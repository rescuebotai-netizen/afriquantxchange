import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { generateStockScreening } from '../services/geminiService';

interface StockResult {
  symbol: string;
  name: string;
  price: string;
  change: string;
  marketCap: string;
  peRatio: string;
  epsGrowth: string;
  analystRating: string;
  matchScore: number;
}

const mockStocks = [
  { ticker: 'AGRI', name: 'Naspers', sector: 'Technology', price: '$14.20', change: '+2.4%', marketCap: '$1.2B', pe: '24.5', signal: 'Strong Buy' },
  { ticker: 'HLTH', name: 'Standard Bank', sector: 'Financials', price: '$45.80', change: '+1.2%', marketCap: '$3.4B', pe: '32.1', signal: 'Buy' },
  { ticker: 'LOGI', name: 'Dangote Cement', sector: 'Manufacturing', price: '$8.90', change: '-0.5%', marketCap: '$800M', pe: '15.2', signal: 'Hold' },
  { ticker: 'TECH', name: 'Safaricom', sector: 'AI/ML', price: '$120.50', change: '+5.6%', marketCap: '$12.5B', pe: '45.8', signal: 'Strong Buy' },
  { ticker: 'FINX', name: 'FinX Solutions', sector: 'Fintech', price: '$32.10', change: '-1.8%', marketCap: '$2.1B', pe: '18.4', signal: 'Hold' },
];

export function StockScreener() {
  const [query, setQuery] = useState("Top African tech startups by market cap");
  const [results, setResults] = useState<StockResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const data = await generateStockScreening(query);
    setResults(data);
    setIsLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0066FF] via-[#FFFFFF] to-[#00C896]" />
      
      <div className="p-6 border-b border-white/10 bg-white/[0.01] flex flex-col gap-4 relative z-10">
        <div>
          <h2 className="text-white font-bold tracking-tight text-xl">Natural Language Screener</h2>
          <p className="text-sm text-zinc-400 mt-1">Query the market using plain English to find investment opportunities.</p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#0066FF]/50 focus:ring-1 focus:ring-[#0066FF]/50 transition-all duration-300 backdrop-blur-md"
            placeholder="e.g., 'Show me undervalued AI companies with >20% revenue growth'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-2">
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg hover:bg-[#0066FF]/30 transition-colors border border-[#0066FF]/30 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
            <button className="p-2 bg-[#0066FF]/20 text-[#0066FF] rounded-lg hover:bg-[#0066FF]/30 transition-colors border border-[#0066FF]/30">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['High Growth Tech', 'Undervalued Fintech', 'Dividend Yield > 4%', 'Low P/E Ratio'].map((tag) => (
            <span 
              key={tag} 
              onClick={() => { setQuery(tag); handleSearch(); }}
              className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 cursor-pointer hover:bg-white/10 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 relative z-10">
        <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sector</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Change</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Market Cap</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">P/E</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden lg:table-cell">EPS Growth</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider hidden md:table-cell">Analyst</th>
                <th className="p-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">AI Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Analyzing market data...
                  </td>
                </tr>
              ) : results.length > 0 ? (
                results.map((stock, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={stock.symbol} 
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066FF]/20 to-[#FFFFFF]/20 flex items-center justify-center border border-white/10 text-xs font-bold text-white">
                          {stock.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#0066FF] transition-colors">{stock.symbol}</div>
                          <div className="text-xs text-zinc-500">{stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-zinc-300">Technology</td>
                    <td className="p-4 text-sm font-medium text-white">{stock.price}</td>
                    <td className="p-4 text-sm">
                      <span className={`flex items-center gap-1 ${stock.change.startsWith('+') ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                        {stock.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stock.change}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-400 hidden md:table-cell">{stock.marketCap}</td>
                    <td className="p-4 text-sm text-zinc-400 hidden lg:table-cell">{stock.peRatio}</td>
                    <td className="p-4 text-sm text-zinc-400 hidden lg:table-cell">
                      <span className={stock.epsGrowth?.startsWith('+') ? 'text-[#00C896]' : stock.epsGrowth?.startsWith('-') ? 'text-[#FF3B3B]' : 'text-zinc-400'}>
                        {stock.epsGrowth || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4 text-sm hidden md:table-cell">
                      <span className={`font-medium ${
                        stock.analystRating?.includes('Buy') ? 'text-[#00C896]' : 
                        stock.analystRating?.includes('Sell') ? 'text-[#FF3B3B]' : 
                        'text-[#FFFFFF]'
                      }`}>
                        {stock.analystRating || 'Hold'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        stock.matchScore > 80 ? 'bg-[#00C896]/10 text-[#00C896] border-[#00C896]/20' :
                        stock.matchScore > 50 ? 'bg-[#FFFFFF]/10 text-[#FFFFFF] border-[#FFFFFF]/20' :
                        'bg-[#FF3B3B]/10 text-[#FF3B3B] border-[#FF3B3B]/20'
                      }`}>
                        {stock.matchScore > 80 ? 'Strong Match' : stock.matchScore > 50 ? 'Good Match' : 'Weak Match'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500">
                    No results found. Try a different query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
