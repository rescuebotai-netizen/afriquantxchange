import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, LayoutDashboard, Briefcase, Store, BarChart3, Rocket, Cpu, Calculator, Scale, FileText } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard },
    { id: 'tax-compliance', label: 'Tax & Compliance Hub (TaxBit Audit Reports)', icon: Scale },
    { id: 'reports', label: 'Reports & Audits (ReportViewer)', icon: FileText },
    { id: 'ipo-launch', label: 'IPO Launch & Bookbuilding Hub', icon: Rocket },
    { id: 'algo-trading', label: 'Algorithmic Execution Desk (TWAP/VWAP)', icon: Cpu },
    { id: 'valuation-workbench', label: 'DCF & LBO Valuation Workbench', icon: Calculator },
    { id: 'portfolio', label: 'View Portfolio', icon: Briefcase },
    { id: 'marketplace', label: 'Explore Markets', icon: Store },
    { id: 'index', label: 'Market Index', icon: BarChart3 },
  ];

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#05070D]/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          className="relative w-full max-w-2xl bg-[#0A0F1C] border border-white/[0.1] rounded-2xl shadow-[0_0_50px_rgba(0,102,255,0.1)] overflow-hidden"
        >
          <div className="flex items-center px-4 py-4 border-b border-white/[0.05]">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-zinc-600 font-sans"
            />
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-zinc-400 font-bold">ESC</kbd>
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredActions.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Suggestions</div>
                {filteredActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        onNavigate(action.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 text-left group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#0066FF]/20 group-hover:text-[#0066FF] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{action.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No results found for "{query}"
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
