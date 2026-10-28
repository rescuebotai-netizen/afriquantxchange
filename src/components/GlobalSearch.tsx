import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  BrainCircuit, 
  Clock, 
  Building2, 
  Package, 
  Activity,
  ArrowRight,
  Sparkles,
  PieChart,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface GlobalSearchProps {
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNavigateToCompany: (companyId: string) => void;
}

// Dummy data for default state
const trendingAssets = [
  { id: 'agripay-equity', name: 'Naspers Equity', symbol: 'AGP', change: '+5.2%', price: '$120.50' },
  { id: 'healthsync-bond', name: 'Standard Bank Bond', symbol: 'HSB', change: '+1.1%', price: '$1,050.00' },
  { id: 'logisflow-rev', name: 'Dangote Cement RevShare', symbol: 'LFR', change: '+3.4%', price: '$45.20' },
];

const topCompanies = [
  { id: 'agripay-africa', name: 'Naspers', sector: 'Technology', rating: 'A+' },
  { id: 'healthsync', name: 'Standard Bank', sector: 'Financials', rating: 'A' },
  { id: 'logisflow', name: 'Dangote Cement', sector: 'Manufacturing', rating: 'B+' },
];

const aiInsights = [
  { id: 'agritech-q4', title: 'Technology Growth Outlook Q4', type: 'Sector Analysis' },
  { id: 'health-reg', title: 'Healthcare Regulatory Shifts', type: 'Risk Alert' },
];

const recentSearches = ['Naspers', 'Dividend Yields', 'Tech Bonds'];

// Dummy data for search results
const searchDatabase = [
  { type: 'company', id: 'agripay-africa', name: 'Naspers', desc: 'Leading Technology platform', match: 'naspers' },
  { type: 'company', id: 'healthsync', name: 'Standard Bank', desc: 'Digital healthcare solutions', match: 'standard' },
  { type: 'product', id: 'agripay-equity', name: 'Naspers Equity', category: 'equity', desc: 'Common stock', match: 'naspers' },
  { type: 'insight', id: 'agritech-q4', name: 'Technology Growth Outlook Q4', desc: 'Sector analysis report', match: 'technology' },
  { type: 'transaction', id: 'txn-98342', name: 'Naspers Investment', desc: '$60,000.00', match: 'naspers' },
];

export function GlobalSearch({ setActiveTab, searchQuery, setSearchQuery, onNavigateToCompany }: GlobalSearchProps) {
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check if it's a natural language query for AI search
  useEffect(() => {
    const isQuestion = searchQuery.toLowerCase().includes('where should i invest') || 
                       searchQuery.toLowerCase().includes('how to') ||
                       searchQuery.toLowerCase().includes('compare') ||
                       searchQuery.toLowerCase().includes('show my best') ||
                       searchQuery.length > 25;
    
    if (isQuestion && !isAiSearch) {
      setIsAiSearch(true);
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 1500);
      return () => clearTimeout(timer);
    } else if (!isQuestion && isAiSearch) {
      setIsAiSearch(false);
    }
  }, [searchQuery]);

  const handleRedirect = (result: any) => {
    setSearchQuery(''); // Clear search after selection
    switch (result.type) {
      case 'company':
        onNavigateToCompany(result.id);
        break;
      case 'product':
        setActiveTab('trade');
        break;
      case 'insight':
        setActiveTab('intelligence-ngx');
        break;
      case 'transaction':
        setActiveTab('activity');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  const filteredResults = searchDatabase.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.match.includes(searchQuery.toLowerCase())
  );

  const renderDefaultState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {/* Trending Assets */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFFFFF]" /> Trending Assets
        </h3>
        <div className="space-y-2">
          {trendingAssets.map(asset => (
            <button 
              key={asset.id}
              onClick={() => { setSearchQuery(''); setActiveTab('trade'); }}
              className="w-full text-left p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/50 hover:bg-white/5 transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{asset.name}</span>
                <span className="text-xs text-[#FFFFFF] font-bold font-mono">{asset.change}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">{asset.symbol}</span>
                <span className="text-sm text-zinc-300 font-mono font-bold">{asset.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#FFFFFF]" /> Top Companies
        </h3>
        <div className="space-y-2">
          {topCompanies.map(company => (
            <button 
              key={company.id}
              onClick={() => { setSearchQuery(''); onNavigateToCompany(company.id); }}
              className="w-full text-left p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/50 hover:bg-white/5 transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{company.name}</span>
                <span className="text-xs bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 px-2 py-0.5 rounded text-[#FFFFFF] font-bold">{company.rating}</span>
              </div>
              <span className="text-xs text-zinc-400">{company.sector}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-[#FFFFFF]" /> AI Insights
        </h3>
        <div className="space-y-2">
          {aiInsights.map(insight => (
            <button 
              key={insight.id}
              onClick={() => { setSearchQuery(''); setActiveTab('intelligence-ngx'); }}
              className="w-full text-left p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/50 hover:bg-white/5 transition-all group"
            >
              <p className="font-bold text-white text-sm mb-2 group-hover:text-[#FFFFFF] transition-colors line-clamp-2">{insight.title}</p>
              <span className="text-[10px] text-[#FFFFFF] uppercase tracking-wider font-bold">{insight.type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" /> Recent Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((search, i) => (
            <button 
              key={i}
              onClick={() => setSearchQuery(search)}
              className="px-4 py-2 rounded-xl bg-black border border-white/10 hover:border-[#FFFFFF]/40 hover:text-white text-sm text-zinc-300 font-medium transition-colors"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveSearch = () => {
    if (filteredResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase">No exact matches found</h3>
          <p className="text-zinc-400 max-w-md text-sm font-medium">
            Try adjusting your search terms, or ask our AI assistant a specific question about investments or companies.
          </p>
          <button 
            onClick={() => setSearchQuery(`Analyze opportunities related to "${searchQuery}"`)}
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] text-black font-bold uppercase tracking-wider text-xs hover:bg-white transition-all shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Ask AI Assistant
          </button>
        </div>
      );
    }

    const groupedResults = filteredResults.reduce((acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    }, {} as Record<string, typeof searchDatabase>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {Object.entries(groupedResults).map(([type, results]) => (
          <div key={type} className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2 capitalize">
              {type === 'company' && <Building2 className="w-4 h-4 text-[#FFFFFF]" />}
              {type === 'product' && <Package className="w-4 h-4 text-[#FFFFFF]" />}
              {type === 'insight' && <BrainCircuit className="w-4 h-4 text-[#FFFFFF]" />}
              {type === 'transaction' && <Activity className="w-4 h-4 text-[#FFFFFF]" />}
              {type}s
            </h3>
            <div className="space-y-2">
              {results.map(result => (
                <button 
                  key={result.id}
                  onClick={() => handleRedirect(result)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-black border border-white/10 hover:border-[#FFFFFF]/50 hover:bg-white/5 transition-all group"
                >
                  <div className="text-left">
                    <p className="font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{result.name}</p>
                    <p className="text-xs text-zinc-400 mt-1 font-medium">{result.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[#FFFFFF] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAiSearch = () => (
    <div className="mt-8 space-y-8">
      <div className="bg-black border border-[#FFFFFF]/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] flex items-center justify-center text-black font-bold shadow-lg">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Financial Intelligence Engine</h2>
              <p className="text-sm text-[#FFFFFF] font-medium">Analyzing your query: "{searchQuery}"</p>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="space-y-4 py-8">
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold uppercase tracking-wider animate-pulse">Scanning market conditions...</span>
              </div>
              <div className="flex items-center gap-4 text-zinc-400">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-bold uppercase tracking-wider animate-pulse">Evaluating risk profiles...</span>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* AI Recommendation */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Recommended Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black border border-white/10 rounded-2xl p-5 hover:border-[#FFFFFF]/40 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-bold text-white">Technology Growth Fund</p>
                        <p className="text-xs text-zinc-400 font-medium">High Yield • Moderate Risk</p>
                      </div>
                      <span className="text-[#FFFFFF] font-bold font-mono">60%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-[#FFFFFF] h-full rounded-full w-[60%]" /></div>
                    <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium">
                      Strong seasonal growth projected for Q4. Aligns with your risk tolerance.
                    </p>
                  </div>
                  
                  <div className="bg-black border border-white/10 rounded-2xl p-5 hover:border-[#FFFFFF]/40 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-bold text-white">Standard Bank Bonds</p>
                        <p className="text-xs text-zinc-400 font-medium">Fixed Income • Low Risk</p>
                      </div>
                      <span className="text-white font-bold font-mono">30%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-white h-full rounded-full w-[30%]" /></div>
                    <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium">
                      Provides stable baseline returns to hedge against market volatility.
                    </p>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-5 hover:border-[#FFFFFF]/40 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-bold text-white">Dangote Cement Equity</p>
                        <p className="text-xs text-zinc-400 font-medium">Growth • High Risk</p>
                      </div>
                      <span className="text-[#FFFFFF] font-bold font-mono">10%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5"><div className="bg-[#FFFFFF]/60 h-full rounded-full w-[10%]" /></div>
                    <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium">
                      Speculative play on upcoming infrastructure expansion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="flex gap-6 p-5 bg-black border border-white/10 rounded-2xl">
                <ShieldAlert className="w-8 h-8 text-[#FFFFFF] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Risk Analysis</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    This allocation presents a <strong className="text-white">Moderate</strong> risk profile with an expected annualized return of <strong className="text-[#FFFFFF]">12.4%</strong>. The heavy weighting in Technology exposes the portfolio to seasonal fluctuations, hedged by the Standard Bank bonds.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => { setSearchQuery(''); setActiveTab('trade'); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] text-black font-bold uppercase tracking-wider text-xs hover:bg-white transition-all shadow-lg"
                >
                  Execute Strategy <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-[80vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Universal Command Center</h1>
        <p className="text-zinc-400 text-sm">Search assets, companies, insights, or ask AI for investment strategies.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery === '' ? 'default' : isAiSearch ? 'ai' : 'active'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {searchQuery === '' 
            ? renderDefaultState() 
            : isAiSearch 
              ? renderAiSearch() 
              : renderActiveSearch()
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
