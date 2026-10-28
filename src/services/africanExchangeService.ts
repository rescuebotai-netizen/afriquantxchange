// African Exchange Integration Service (AltcoinTrader v3 & OVEX Institutional v2)

export interface AltcoinLiveStats {
  Symbol: string;
  Price: string;
  High: string;
  Low: string;
  Close: string;
  Open: string;
  Change: string;
  Volume: string;
  Bid: string;
  Ask: string;
  Timestamp: string;
}

export interface OvexRfqQuote {
  success: boolean;
  market: string;
  side: 'buy' | 'sell';
  from_amount: number;
  to_amount: number;
  price: number;
  rate_display: string;
  fee_percent: number;
  fee_amount: number;
  prefunded: boolean;
  quote_token: string;
  expires_in_seconds: number;
  expires_at: number;
  settlement_type: string;
  liquidity_provider: string;
}

export interface DepositAddressResponse {
  success: boolean;
  currency: string;
  address: string;
  network: string;
  memo?: string | null;
  min_deposit: string;
  confirmations_required: number;
  status: string;
}

export interface CarfTransferType {
  id: string;
  name: string;
  code: string;
}

export interface PendingCarfItem {
  id: string;
  currency: string;
  amount: string;
  usd_value: number;
  zar_value: number;
  sender_address: string;
  received_at: string;
  compliance_deadline: string;
  requires_carf_declaration: boolean;
}

export const africanExchangeService = {
  // 1. AltcoinTrader v3 Live Market Stats
  async getAltcoinLiveStats(): Promise<Record<string, AltcoinLiveStats>> {
    try {
      const res = await fetch('/api/african/altcointrader/live-stats');
      const json = await res.json();
      return json.data || {};
    } catch (e) {
      console.warn('AltcoinTrader live stats error:', e);
      return {};
    }
  },

  // 2. AltcoinTrader Orderbook Depth
  async getAltcoinOrderbook(pair: string = 'BTCZAR') {
    try {
      const res = await fetch(`/api/african/altcointrader/orderbook/${pair}`);
      return await res.json();
    } catch (e) {
      console.warn('AltcoinTrader orderbook error:', e);
      return null;
    }
  },

  // 3. OVEX RFQ - Request for Quote
  async getOvexQuote(params: {
    market: string;
    from_amount: number;
    side: 'buy' | 'sell';
    prefunded?: number;
  }): Promise<OvexRfqQuote | null> {
    try {
      const query = new URLSearchParams({
        market: params.market,
        from_amount: params.from_amount.toString(),
        side: params.side,
        prefunded: (params.prefunded || 0).toString()
      });
      const res = await fetch(`/api/african/ovex/rfq/get_quote?${query.toString()}`);
      return await res.json();
    } catch (e) {
      console.warn('OVEX RFQ Quote error:', e);
      return null;
    }
  },

  // 4. OVEX RFQ - Accept & Lock Quote
  async acceptOvexQuote(quote_token: string) {
    try {
      const res = await fetch('/api/african/ovex/broker/rfq/accept_quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote_token })
      });
      return await res.json();
    } catch (e) {
      console.warn('OVEX Accept Quote error:', e);
      return { success: false, error: 'Network communication failure' };
    }
  },

  // 5. OVEX OTC Trades History
  async getOtcTrades() {
    try {
      const res = await fetch('/api/african/ovex/broker/otc_trades');
      return await res.json();
    } catch (e) {
      console.warn('OVEX OTC trades error:', e);
      return { success: false, trades: [] };
    }
  },

  // 6. OVEX Multi-chain Deposit Address
  async getDepositAddress(currency: string): Promise<DepositAddressResponse | null> {
    try {
      const res = await fetch(`/api/african/ovex/deposit_address?currency=${encodeURIComponent(currency)}`);
      return await res.json();
    } catch (e) {
      console.warn('OVEX Deposit address error:', e);
      return null;
    }
  },

  // 7. OVEX Deposits History
  async getDepositsHistory(currency: string = 'btc') {
    try {
      const res = await fetch(`/api/african/ovex/deposits/history?currency=${encodeURIComponent(currency)}`);
      return await res.json();
    } catch (e) {
      console.warn('OVEX deposits history error:', e);
      return { success: false, deposits: [] };
    }
  },

  // 8. OVEX CARF Regulatory Declarations
  async getCarfTransferTypes(): Promise<CarfTransferType[]> {
    try {
      const res = await fetch('/api/african/ovex/carf_transfer_types');
      const json = await res.json();
      return json.transfer_types || [];
    } catch (e) {
      console.warn('OVEX CARF types error:', e);
      return [];
    }
  },

  async getPendingCarf(): Promise<PendingCarfItem[]> {
    try {
      const res = await fetch('/api/african/ovex/deposits/pending_carf');
      const json = await res.json();
      return json.pending || [];
    } catch (e) {
      console.warn('OVEX pending CARF error:', e);
      return [];
    }
  },

  async declareCarf(deposit_id: string, transfer_type: string) {
    try {
      const res = await fetch('/api/african/ovex/deposits/declare_carf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deposit_id, transfer_type })
      });
      return await res.json();
    } catch (e) {
      console.warn('Declare CARF error:', e);
      return { success: false };
    }
  },

  async declareCarfAll(default_transfer_type: string = 'SELF_TRANSFER') {
    try {
      const res = await fetch('/api/african/ovex/deposits/declare_carf_all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ default_transfer_type })
      });
      return await res.json();
    } catch (e) {
      console.warn('Declare CARF all error:', e);
      return { success: false };
    }
  },

  // 9. OVEX Withdrawals & SARB Allowances
  async getWithdrawsHistory(currency: string = 'zar') {
    try {
      const res = await fetch(`/api/african/ovex/withdraws/history?currency=${encodeURIComponent(currency)}`);
      return await res.json();
    } catch (e) {
      console.warn('OVEX withdraws history error:', e);
      return { success: false, withdraws: [] };
    }
  },

  async createWithdrawal(amount: number, beneficiary_id: number | string, currency: string = 'ZAR') {
    try {
      const res = await fetch('/api/african/ovex/withdraws/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, beneficiary_id, currency })
      });
      return await res.json();
    } catch (e) {
      console.warn('OVEX create withdrawal error:', e);
      return { success: false };
    }
  },

  async getOffshoreTransactions() {
    try {
      const res = await fetch('/api/african/ovex/broker/offshore_transactions');
      return await res.json();
    } catch (e) {
      console.warn('OVEX offshore transactions error:', e);
      return null;
    }
  },

  async getMemberInfo() {
    try {
      const res = await fetch('/api/african/ovex/members/me');
      return await res.json();
    } catch (e) {
      console.warn('OVEX member info error:', e);
      return null;
    }
  },

  async getFees() {
    try {
      const [depRes, withRes] = await Promise.all([
        fetch('/api/african/ovex/fees/deposit').then(r => r.json()),
        fetch('/api/african/ovex/fees/withdraw').then(r => r.json())
      ]);
      return { deposit: depRes.fees, withdraw: withRes.fees };
    } catch (e) {
      return { deposit: {}, withdraw: {} };
    }
  }
};
