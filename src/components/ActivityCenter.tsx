import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Search, Filter, Download, ChevronDown, ChevronUp, 
  TrendingUp, TrendingDown, Activity, FileText, Briefcase, 
  ArrowRightLeft, DollarSign, BrainCircuit, ExternalLink, ShieldCheck, Loader2,
  BellRing, Zap
} from 'lucide-react';
import OpenAI from 'openai';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { priceAlertService } from '../services/priceAlertService';

interface ActivityItem {
  id: string;
  type: 'Investment' | 'Payout' | 'Trade' | 'Contract' | 'Price Alert';
  asset: string;
  time: string;
  amount: number;
  performance: number | null;
  details: string;
  counterparty?: string;
  documents?: string[];
  alertId?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'Investment',
    asset: 'Naspers',
    time: '2h ago',
    amount: 60000.00,
    performance: 1.25,
    details: 'Series A Equity participation. Funds successfully deployed and shares allocated.',
    counterparty: 'Naspers Holdings Ltd.',
    documents: ['Term Sheet v2.pdf', 'Subscription Agreement.pdf']
  },
  {
    id: 'act-2',
    type: 'Payout',
    asset: 'Standard Bank Q2',
    time: '1d ago',
    amount: 1240.50,
    performance: null,
    details: 'Quarterly dividend distribution based on 2.5% yield.',
    counterparty: 'Standard Bank Inc.'
  },
  {
    id: 'act-3',
    type: 'Trade',
    asset: 'Sold 500 MTN Shares',
    time: '2d ago',
    amount: 105250.00,
    performance: -0.1,
    details: 'Secondary market execution. Order filled at $210.50 per share.',
    counterparty: 'Market Maker 0x4A2'
  },
  {
    id: 'act-4',
    type: 'Contract',
    asset: 'Dangote Cement RevShare',
    time: '3d ago',
    amount: 22000.00,
    performance: 0.4,
    details: 'Revenue share contract execution for Q1 logistics volume.',
    counterparty: 'Dangote Cement Manufacturing',
    documents: ['RevShare Contract 2026.pdf']
  }
];

interface ActivityCenterProps {
  setActiveTab: (tab: string) => void;
}

export function ActivityCenter({ setActiveTab }: ActivityCenterProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');
  const [performanceFilter, setPerformanceFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, string>>({});
  const [isGeneratingInsight, setIsGeneratingInsight] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const alertActivities = priceAlertService.getRecordedActivities().map(a => ({
        id: a.id,
        type: 'Price Alert' as const,
        asset: a.asset,
        time: a.time,
        amount: a.amount,
        performance: a.performance,
        details: a.details,
        counterparty: a.counterparty,
        alertId: a.alertId
      }));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setActivities([...alertActivities, ...mockActivities]); // Merge price alerts with mock if not logged in
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedActivities: ActivityItem[] = data.map(t => ({
          id: t.id,
          type: t.type === 'deposit' || t.type === 'withdrawal' ? 'Payout' : 
                t.type === 'trade' ? 'Trade' : 'Investment',
          asset: t.reference || 'Transaction',
          time: new Date(t.created_at).toLocaleString(),
          amount: Number(t.amount),
          performance: null,
          details: t.metadata?.details || `Status: ${t.status}`,
          counterparty: t.metadata?.counterparty || 'NXG Platform',
        }));
        setActivities([...alertActivities, ...formattedActivities]);
      } else {
        setActivities([...alertActivities, ...mockActivities]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      const alertActivities = priceAlertService.getRecordedActivities().map(a => ({
        id: a.id,
        type: 'Price Alert' as const,
        asset: a.asset,
        time: a.time,
        amount: a.amount,
        performance: a.performance,
        details: a.details,
        counterparty: a.counterparty,
        alertId: a.alertId
      }));
      setActivities([...alertActivities, ...mockActivities]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Listen to real-time local price alerts dispatched from AlgorithmicTradingDesk
    const handleLocalActivity = (e: any) => {
      if (e.detail) {
        setActivities(prev => [e.detail, ...prev]);
      }
    };
    window.addEventListener('nxg_activity_added', handleLocalActivity);
    window.addEventListener('nxg_price_alert_triggered', () => {
      fetchTransactions();
    });

    if (!isSupabaseConfigured) {
      return () => {
        window.removeEventListener('nxg_activity_added', handleLocalActivity);
      };
    }

    try {
      const channel = supabase
        .channel('public:transactions')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, () => {
          fetchTransactions();
        })
        .subscribe();

      return () => {
        window.removeEventListener('nxg_activity_added', handleLocalActivity);
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Realtime channel unavailable:', e);
      return () => {
        window.removeEventListener('nxg_activity_added', handleLocalActivity);
      };
    }
  }, []);

  const filteredActivities = activities.filter(act => {
    const matchesType = filterType === 'All' || act.type === filterType;
    const matchesSearch = act.asset.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPerformance = true;
    if (performanceFilter === 'Gains') matchesPerformance = act.performance !== null && act.performance > 0;
    if (performanceFilter === 'Losses') matchesPerformance = act.performance !== null && act.performance < 0;

    return matchesType && matchesSearch && matchesPerformance;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Price Alert': return <BellRing className="w-5 h-5 text-amber-400" />;
      case 'Investment': return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Payout': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'Trade': return <ArrowRightLeft className="w-5 h-5 text-amber-400" />;
      case 'Contract': return <FileText className="w-5 h-5 text-purple-400" />;
      default: return <Activity className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case 'Price Alert': return 'bg-amber-500/10 border-amber-500/25';
      case 'Investment': return 'bg-blue-500/10 border-blue-500/20';
      case 'Payout': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'Trade': return 'bg-amber-500/10 border-amber-500/20';
      case 'Contract': return 'bg-purple-500/10 border-purple-500/20';
      default: return 'bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const generateInsight = async (activity: ActivityItem) => {
    if (aiInsights[activity.id]) return; // Already generated
    
    setIsGeneratingInsight(activity.id);
    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '',
        dangerouslyAllowBrowser: true,
      });
      const prompt = `Analyze this financial transaction and provide a 1-2 sentence professional insight or projection. 
      Type: ${activity.type}, Asset: ${activity.asset}, Amount: $${activity.amount}, Performance: ${activity.performance}%. 
      Format it as a direct statement to the user (e.g., "You invested... projected return...").`;

      const response = await openai.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: "system",
            content: "You are an expert financial analyst."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      });

      const text = response.choices[0].message.content;
      if (text) {
        setAiInsights(prev => ({ ...prev, [activity.id]: text }));
      }
    } catch (error) {
      console.error("Error generating AI insight:", error);
      setAiInsights(prev => ({ ...prev, [activity.id]: "AI insight generation failed. Please try again later." }));
    } finally {
      setIsGeneratingInsight(null);
    }
  };

  const toggleRow = (activity: ActivityItem) => {
    if (expandedRow === activity.id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(activity.id);
      generateInsight(activity);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white tracking-tight">Activity Center</h1>
          <p className="text-zinc-400 mt-1">Track all your transactions, investments, and financial events in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Generate Report
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Activity Surge</h3>
            <p className="text-sm text-zinc-400">Your trading activity increased by 32% this week compared to the previous 7 days.</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Top Performing Asset</h3>
            <p className="text-sm text-zinc-400">Naspers is your top performer this month with a +1.25% gain since acquisition.</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 flex-wrap">
            {[
              { label: 'All', value: 'All' },
              { label: 'Price Alerts', value: 'Price Alert' },
              { label: 'Investments', value: 'Investment' },
              { label: 'Payouts', value: 'Payout' },
              { label: 'Trades', value: 'Trade' },
              { label: 'Contracts', value: 'Contract' }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setFilterType(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filterType === item.value
                    ? 'bg-white/10 text-white font-bold' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {['All Time', 'Today', 'Last 7 Days', 'Last 30 Days'].map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  dateRange === range
                    ? 'bg-white/10 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {['All', 'Gains', 'Losses'].map(perf => (
              <button
                key={perf}
                onClick={() => setPerformanceFilter(perf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  performanceFilter === perf
                    ? 'bg-white/10 text-white' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {perf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search asset, company..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Asset / Event</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Time</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Performance</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-zinc-400 text-sm">Loading live transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 text-sm">
                    No activities found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <tr 
                      onClick={() => toggleRow(activity)}
                      className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${expandedRow === activity.id ? 'bg-white/[0.02]' : ''}`}
                    >
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border ${getBgForType(activity.type)}`}>
                        {getIconForType(activity.type)}
                        <span className="text-xs font-medium text-white">{activity.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-medium text-white">{activity.asset}</span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{activity.time}</td>
                    <td className="p-4 text-sm font-mono text-white text-right">
                      {activity.type === 'Payout' || activity.type === 'Trade' && activity.amount > 0 ? '+' : ''}
                      ${activity.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      {activity.performance !== null ? (
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${activity.performance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {activity.performance >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {activity.performance > 0 ? '+' : ''}{activity.performance}%
                        </span>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-500">
                      {expandedRow === activity.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedRow === activity.id && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-white/10">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-black/40"
                          >
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* AI Insight */}
                              <div className="lg:col-span-2 space-y-3">
                                <div className="flex items-center gap-2 text-blue-400">
                                  <BrainCircuit className="w-4 h-4" />
                                  <span className="text-xs font-bold uppercase tracking-wider">Financial Intelligence Feed</span>
                                </div>
                                {isGeneratingInsight === activity.id ? (
                                  <div className="flex items-center gap-2 text-zinc-400 text-sm animate-pulse">
                                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                    Analyzing transaction data...
                                  </div>
                                ) : (
                                  <p className="text-white text-lg leading-relaxed">
                                    {aiInsights[activity.id] || "You invested $60,000 in Naspers — projected annual return: 18.4% based on current market signals."}
                                  </p>
                                )}
                                <p className="text-sm text-zinc-500 mt-2">
                                  Transaction ID: <span className="font-mono text-zinc-400">{activity.id.toUpperCase()}-{Math.floor(Math.random() * 10000)}</span>
                                </p>
                              </div>
                              
                              {/* Details & Documents */}
                              <div className="space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                                <div>
                                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Counterparty</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm text-white">{activity.counterparty || 'Verified Entity'}</span>
                                  </div>
                                </div>
                                
                                {activity.type === 'Price Alert' ? (
                                  <div className="space-y-3">
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
                                        <BellRing className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Automated Alert Action Ready</span>
                                      </div>
                                      <p className="text-xs text-zinc-300">
                                        Real-time asset price threshold matched. You can route an algorithmic parent order (TWAP/VWAP/Iceberg) immediately to capitalize on this price movement.
                                      </p>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTab('algo-trading');
                                      }}
                                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                      <Zap className="w-4 h-4 fill-black" />
                                      <span>Execute in Algorithmic Trading Desk →</span>
                                    </button>
                                  </div>
                                ) : activity.documents && activity.documents.length > 0 ? (
                                  <div>
                                    <span className="text-xs text-zinc-500 uppercase tracking-wider">Linked Documents</span>
                                    <div className="mt-2 space-y-2">
                                      {activity.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                          <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                            <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">{doc}</span>
                                          </div>
                                          <ExternalLink className="w-3 h-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              )))}
            </tbody>
          </table>
          {filteredActivities.length === 0 && !isLoading && (
            <div className="p-8 text-center text-zinc-500">
              No activities found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
