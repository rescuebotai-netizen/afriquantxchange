import { Router } from 'express';
import { supabaseAdmin } from '../services/supabase.service.js';

const router = Router();

// 1. Deposit Funds
router.post('/deposit', async (req, res) => {
  try {
    const { userId, amount, currency = 'USD' } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'userId and valid amount are required' });
    }

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, balance')
      .eq('profile_id', userId)
      .eq('currency', currency)
      .single();

    if (walletError && walletError.code !== 'PGRST116') { // PGRST116 is code for no rows returned
      throw walletError;
    }

    let walletId = wallet?.id;
    let currentBalance = Number(wallet?.balance || 0);

    if (!wallet) {
      // Create wallet
      const { data: newWallet, error: createError } = await supabaseAdmin
        .from('wallets')
        .insert([{ profile_id: userId, currency, balance: amount }])
        .select('id')
        .single();
      if (createError) throw createError;
      walletId = newWallet.id;
      currentBalance = amount;
    } else {
      // Update wallet
      const newBalance = currentBalance + Number(amount);
      const { error: updateError } = await supabaseAdmin
        .from('wallets')
        .update({ balance: newBalance })
        .eq('id', walletId);
      if (updateError) throw updateError;
    }

    // Insert transaction
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert([{
        wallet_id: walletId,
        profile_id: userId,
        type: 'deposit',
        amount: amount,
        status: 'completed',
        reference: `Deposit of ${amount} ${currency}`,
        metadata: { method: 'Card/Bank', currency }
      }]);

    if (txError) throw txError;

    res.json({ success: true, message: `Successfully deposited ${amount} ${currency}` });
  } catch (error: any) {
    console.error('Error in deposit:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Withdraw Funds
router.post('/withdraw', async (req, res) => {
  try {
    const { userId, amount, currency = 'USD' } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'userId and valid amount are required' });
    }

    // Get wallet
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, balance')
      .eq('profile_id', userId)
      .eq('currency', currency)
      .single();

    if (walletError) throw walletError;
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    const currentBalance = Number(wallet.balance);
    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Update wallet
    const newBalance = currentBalance - amount;
    const { error: updateError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', wallet.id);
    if (updateError) throw updateError;

    // Insert transaction
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert([{
        wallet_id: wallet.id,
        profile_id: userId,
        type: 'withdrawal',
        amount: -amount,
        status: 'completed',
        reference: `Withdrawal of ${amount} ${currency}`,
        metadata: { destination: 'Linked Bank Account', currency }
      }]);

    if (txError) throw txError;

    res.json({ success: true, message: `Successfully withdrew ${amount} ${currency}` });
  } catch (error: any) {
    console.error('Error in withdrawal:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Execute Trade (Buy/Sell)
router.post('/execute', async (req, res) => {
  try {
    const { userId, assetSymbol, assetName, assetType = 'stock', side, quantity, price } = req.body;
    
    if (!userId || !assetSymbol || !assetName || !side || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required trade parameters' });
    }

    const qtyNum = Number(quantity);
    const priceNum = Number(price);
    const totalCost = qtyNum * priceNum;

    // 1. Get or create the asset in DB
    let { data: asset, error: assetError } = await supabaseAdmin
      .from('assets')
      .select('id, current_price')
      .eq('symbol', assetSymbol)
      .single();

    if (assetError && assetError.code !== 'PGRST116') {
      throw assetError;
    }

    let assetId;
    if (!asset) {
      const { data: newAsset, error: createAssetError } = await supabaseAdmin
        .from('assets')
        .insert([{ symbol: assetSymbol, name: assetName, type: assetType, current_price: priceNum }])
        .select('id')
        .single();
      if (createAssetError) throw createAssetError;
      assetId = newAsset.id;
    } else {
      assetId = asset.id;
      // Optionally update current price
      await supabaseAdmin
        .from('assets')
        .update({ current_price: priceNum })
        .eq('id', assetId);
    }

    // 2. Get user's USD wallet
    let { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, balance')
      .eq('profile_id', userId)
      .eq('currency', 'USD')
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      throw walletError;
    }

    // Auto-create USD wallet if not existing (though usually created on signup)
    if (!wallet) {
      const { data: newWallet, error: createWalletError } = await supabaseAdmin
        .from('wallets')
        .insert([{ profile_id: userId, currency: 'USD', balance: 0 }])
        .select('id, balance')
        .single();
      if (createWalletError) throw createWalletError;
      wallet = newWallet;
    }

    const currentBalance = Number(wallet.balance);

    if (side === 'buy' && currentBalance < totalCost) {
      return res.status(400).json({ error: `Insufficient cash balance. Required: $${totalCost.toFixed(2)}, available: $${currentBalance.toFixed(2)}` });
    }

    // 3. Get user's portfolio item
    let { data: portfolioItem, error: portfolioError } = await supabaseAdmin
      .from('portfolio_items')
      .select('id, quantity, average_buy_price')
      .eq('profile_id', userId)
      .eq('asset_id', assetId)
      .single();

    if (portfolioError && portfolioError.code !== 'PGRST116') {
      throw portfolioError;
    }

    if (side === 'sell' && (!portfolioItem || Number(portfolioItem.quantity) < qtyNum)) {
      const availableQty = portfolioItem ? Number(portfolioItem.quantity) : 0;
      return res.status(400).json({ error: `Insufficient stock quantity. Required: ${qtyNum}, available: ${availableQty}` });
    }

    // 4. Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        profile_id: userId,
        asset_id: assetId,
        side: side,
        type: 'market',
        quantity: qtyNum,
        price: priceNum,
        status: 'filled',
        filled_quantity: qtyNum
      }])
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 5. Record the transaction
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .insert([{
        wallet_id: wallet.id,
        profile_id: userId,
        type: 'trade',
        amount: side === 'buy' ? -totalCost : totalCost,
        status: 'completed',
        reference: `${side.toUpperCase()} ${assetSymbol}`,
        metadata: {
          details: `Manual trade executed via trading interface`,
          counterparty: 'Market',
          order_id: order.id,
          shares: qtyNum,
          price: priceNum
        }
      }]);

    if (txError) throw txError;

    // 6. Update Wallet Balance
    const newBalance = side === 'buy' ? currentBalance - totalCost : currentBalance + totalCost;
    const { error: walletUpdateError } = await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', wallet.id);
    if (walletUpdateError) throw walletUpdateError;

    // 7. Update Portfolio Items
    if (side === 'buy') {
      if (portfolioItem) {
        const currentQty = Number(portfolioItem.quantity);
        const currentAvgPrice = Number(portfolioItem.average_buy_price);
        const newQty = currentQty + qtyNum;
        const newAvgPrice = ((currentQty * currentAvgPrice) + (qtyNum * priceNum)) / newQty;
        
        const { error: portUpdateError } = await supabaseAdmin
          .from('portfolio_items')
          .update({ quantity: newQty, average_buy_price: newAvgPrice })
          .eq('id', portfolioItem.id);
        if (portUpdateError) throw portUpdateError;
      } else {
        const { error: portInsertError } = await supabaseAdmin
          .from('portfolio_items')
          .insert([{
            profile_id: userId,
            asset_id: assetId,
            quantity: qtyNum,
            average_buy_price: priceNum
          }]);
        if (portInsertError) throw portInsertError;
      }
    } else if (side === 'sell' && portfolioItem) {
      const newQty = Number(portfolioItem.quantity) - qtyNum;
      if (newQty <= 0) {
        const { error: portDeleteError } = await supabaseAdmin
          .from('portfolio_items')
          .delete()
          .eq('id', portfolioItem.id);
        if (portDeleteError) throw portDeleteError;
      } else {
        const { error: portUpdateError } = await supabaseAdmin
          .from('portfolio_items')
          .update({ quantity: newQty })
          .eq('id', portfolioItem.id);
        if (portUpdateError) throw portUpdateError;
      }
    }

    res.json({
      success: true,
      message: `Successfully executed ${side} order for ${quantity} of ${assetSymbol}`
    });
  } catch (error: any) {
    console.error('Error executing trade:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Trade History
router.get('/history', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }

    const { data: transactions, error } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('profile_id', userId)
      .eq('type', 'trade')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ history: transactions });
  } catch (error: any) {
    console.error('Error fetching trade history:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
