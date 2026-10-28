import React from 'react';
import { 
  ArrowRight, ShieldCheck, Globe, Twitter, Linkedin, Github, 
  Send, Smartphone, ChevronRight, CheckCircle2, Lock
} from 'lucide-react';

interface SharedFooterProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

export function SharedFooter({ onNavigatePage, onNavigateToAuth }: SharedFooterProps) {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10 pt-20 pb-12 px-6 lg:px-12 text-xs font-sans relative overflow-hidden">
      
      {/* Subtle Electric Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-[#0666EB]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto space-y-16 relative z-10">
        
        {/* Top Newsletter & Institutional Briefing Bar */}
        <div className="bg-zinc-900/80 rounded-3xl p-8 lg:p-10 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Get weekly institutional market insights.
            </h3>
            <p className="text-zinc-400 text-sm font-normal">
              Join 120,000+ investors receiving our proprietary quantitative macro research every Monday morning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <input 
                type="email" 
                placeholder="Enter your work email"
                className="w-full bg-[#0A0A0A] border border-white/15 rounded-full px-5 py-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0666EB] transition-colors"
              />
            </div>
            <button className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs tracking-tight transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-md">
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Solutions */}
          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">SOLUTIONS</h5>
            <ul className="space-y-2.5 text-zinc-400 text-sm">
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Global Multi-Currency</li>
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Instant FX Clearing</li>
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Metal & Ultra Card</li>
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Treasury Yield Vaults</li>
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Pre-IPO Secondary Desk</li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">PLATFORM</h5>
            <ul className="space-y-2.5 text-zinc-400 text-sm">
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Quantitative Router Node</li>
              <li onClick={onNavigateToAuth} className="hover:text-white cursor-pointer transition-colors">Risk Governance Matrix</li>
              <li onClick={() => onNavigatePage('business')} className="hover:text-white cursor-pointer transition-colors">Enterprise Treasury</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">System Uptime (99.99%)</li>
            </ul>
          </div>

          {/* Column 3: Institutional */}
          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">INSTITUTIONAL</h5>
            <ul className="space-y-2.5 text-zinc-400 text-sm">
              <li onClick={() => onNavigatePage('business')} className="hover:text-white cursor-pointer transition-colors">Investment Banking Advisory</li>
              <li onClick={() => onNavigatePage('business')} className="hover:text-white cursor-pointer transition-colors">Underwriting & Syndication</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">Security Audits</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">Compliance Protocols</li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-4">
            <h5 className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">COMPANY</h5>
            <ul className="space-y-2.5 text-zinc-400 text-sm">
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">About AfriQuantX</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">Press & Media</li>
              <li onClick={() => onNavigatePage('about')} className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

        </div>

        {/* Legal & Regulatory Footnote */}
        <div className="pt-10 border-t border-white/10 space-y-5 font-mono text-[11px] text-zinc-500 leading-relaxed">
          <p>
            AfriQuantX Technologies Inc. (AQX) provides digital securities clearing infrastructure, algorithmic order routing, and multi-currency liquidity management across African exchanges. Brokerage services are facilitated through SEC and JSE registered clearing members. Multi-currency depository services are provided through licensed banking partners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>© 2026 AfriQuantX Technologies Inc. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-white cursor-pointer transition-colors">Regulatory Disclosures</span>
              <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
