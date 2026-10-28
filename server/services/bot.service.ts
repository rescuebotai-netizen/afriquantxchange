import { supabaseAdmin } from './supabase.service.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
});

export interface BotStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  assets: string[];
}

export const predefinedStrategies: BotStrategy[] = [
  {
    id: 'strat-1',
    name: 'African Blue-Chip Momentum',
    description: 'Trades top African equities based on momentum and news sentiment.',
    riskLevel: 'medium',
    assets: ['Naspers', 'MTN Group', 'Standard Bank', 'Dangote Cement']
  },
  {
    id: 'strat-2',
    name: 'Forex Arbitrage (NGN/USD)',
    description: 'Exploits spread differences in African forex markets.',
    riskLevel: 'high',
    assets: ['USD/NGN', 'USD/ZAR']
  },
  {
    id: 'strat-3',
    name: 'Stable Yield Farming',
    description: 'Allocates capital to low-risk bonds and stablecoins.',
    riskLevel: 'low',
    assets: ['FGN Bonds', 'USDC']
  }
];

// In-memory state for the bot
let isBotRunning = false;
let activeStrategy: BotStrategy | null = null;
let botInterval: NodeJS.Timeout | null = null;
let botUserId: string | null = null; // The user ID the bot is trading for

export const startBot = async (userId: string, strategyId: string) => {
  if (isBotRunning) {
    throw new Error('Bot is already running');
  }

  const strategy = predefinedStrategies.find(s => s.id === strategyId);
  if (!strategy) {
    throw new Error('Invalid strategy ID');
  }

  isBotRunning = true;
  activeStrategy = strategy;
  botUserId = userId;

  // Run the bot loop every 30 seconds for demonstration (in production, use cron or websockets)
  botInterval = setInterval(() => runBotCycle(), 30000);
  
  // Run immediately once
  runBotCycle();

  return { status: 'started', strategy: strategy.name };
};

export const stopBot = () => {
  if (!isBotRunning) {
    throw new Error('Bot is not running');
  }

  isBotRunning = false;
  activeStrategy = null;
  botUserId = null;
  if (botInterval) {
    clearInterval(botInterval);
    botInterval = null;
  }

  return { status: 'stopped' };
};

export const getBotStatus = () => {
  return {
    isRunning: isBotRunning,
    strategy: activeStrategy,
  };
};

const runBotCycle = async () => {
  if (!isBotRunning || !activeStrategy || !botUserId) return;

  try {
    console.log(`[AI Bot] Running cycle for strategy: ${activeStrategy.name}`);

    // 1. Fetch market data (mocked for now, but could fetch from real API)
    const marketData = activeStrategy.assets.map(asset => ({
      asset,
      price: Math.random() * 100 + 10,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      volatility: Math.random()
    }));

    // 2. Ask OpenRouter (AI) for a trading decision
    const prompt = `
      You are an expert AI trading bot executing the "${activeStrategy.name}" strategy.
      Risk Level: ${activeStrategy.riskLevel}.
      Current Market Data: ${JSON.stringify(marketData)}
      
      Decide whether to 'buy', 'sell', or 'hold' one of these assets.
      Respond ONLY with a JSON object in this format:
      {
        "action": "buy" | "sell" | "hold",
        "asset": "Asset Name",
        "amount": number (between 100 and 5000),
        "reason": "Short explanation"
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a financial trading algorithm.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const decisionText = response.choices[0].message.content || '{}';
    const decision = JSON.parse(decisionText);

    console.log(`[AI Bot] Decision:`, decision);

    if (decision.action === 'buy' || decision.action === 'sell') {
      // 3. Execute the trade via Supabase
      await executeTrade(botUserId, decision.asset, decision.action, decision.amount, decision.reason);
    }

  } catch (error) {
    console.error('[AI Bot] Error during cycle:', error);
  }
};

const executeTrade = async (userId: string, asset: string, action: 'buy' | 'sell', amount: number, reason: string) => {
  try {
    // 1. Get or create the asset in DB
    let { data: assetData } = await supabaseAdmin
      .from('assets')
      .select('id, current_price')
      .eq('symbol', asset)
      .single();

    if (!assetData) {
      const { data: newAsset } = await supabaseAdmin
        .from('assets')
        .insert([{ symbol: asset, name: asset, type: 'stock', current_price: 100 }])
        .select('id, current_price')
        .single();
      assetData = newAsset;
    }

    if (!assetData) throw new Error('Failed to resolve asset');

    const price = Number(assetData.current_price) || 100;
    const quantity = amount / price;

    // 2. Get user's USD wallet
    const { data: wallet } = await supabaseAdmin
      .from('wallets')
      .select('id, balance')
      .eq('profile_id', userId)
      .eq('currency', 'USD')
      .single();

    if (!wallet) throw new Error('USD Wallet not found');

    const currentBalance = Number(wallet.balance);

    if (action === 'buy' && currentBalance < amount) {
      console.log(`[AI Bot] Insufficient funds for ${action} ${asset}`);
      return; // Skip trade
    }

    // 3. Get or create portfolio item
    let { data: portfolioItem } = await supabaseAdmin
      .from('portfolio_items')
      .select('id, quantity, average_buy_price')
      .eq('profile_id', userId)
      .eq('asset_id', assetData.id)
      .single();

    if (action === 'sell' && (!portfolioItem || Number(portfolioItem.quantity) < quantity)) {
      console.log(`[AI Bot] Insufficient asset quantity for ${action} ${asset}`);
      return; // Skip trade
    }

    // 4. Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        profile_id: userId,
        asset_id: assetData.id,
        side: action,
        type: 'market',
        quantity: quantity,
        price: price,
        status: 'filled',
        filled_quantity: quantity
      }])
      .select('id')
      .single();

    if (orderError) throw orderError;

    // 5. Record the transaction
    await supabaseAdmin
      .from('transactions')
      .insert([{
        wallet_id: wallet.id,
        profile_id: userId,
        type: 'trade',
        amount: action === 'buy' ? -amount : amount,
        status: 'completed',
        reference: `${action.toUpperCase()} ${asset}`,
        metadata: {
          details: `AI Bot executed ${action} order. Reason: ${reason}`,
          counterparty: 'Market',
          order_id: order.id
        }
      }]);

    // 6. Update Wallet Balance
    const newBalance = action === 'buy' ? currentBalance - amount : currentBalance + amount;
    await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance })
      .eq('id', wallet.id);

    // 7. Update Portfolio
    if (action === 'buy') {
      if (portfolioItem) {
        const currentQty = Number(portfolioItem.quantity);
        const currentAvgPrice = Number(portfolioItem.average_buy_price);
        const newQty = currentQty + quantity;
        const newAvgPrice = ((currentQty * currentAvgPrice) + (quantity * price)) / newQty;
        
        await supabaseAdmin
          .from('portfolio_items')
          .update({ quantity: newQty, average_buy_price: newAvgPrice })
          .eq('id', portfolioItem.id);
      } else {
        await supabaseAdmin
          .from('portfolio_items')
          .insert([{
            profile_id: userId,
            asset_id: assetData.id,
            quantity: quantity,
            average_buy_price: price
          }]);
      }
    } else if (action === 'sell' && portfolioItem) {
      const newQty = Number(portfolioItem.quantity) - quantity;
      if (newQty <= 0) {
        await supabaseAdmin
          .from('portfolio_items')
          .delete()
          .eq('id', portfolioItem.id);
      } else {
        await supabaseAdmin
          .from('portfolio_items')
          .update({ quantity: newQty })
          .eq('id', portfolioItem.id);
      }
    }

    console.log(`[AI Bot] Successfully executed ${action} for ${asset} (Qty: ${quantity.toFixed(4)}, Price: $${price})`);
  } catch (error) {
    console.error('[AI Bot] Failed to execute trade:', error);
  }
};
