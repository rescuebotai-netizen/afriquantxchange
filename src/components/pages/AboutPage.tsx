import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, ShieldCheck, Award, Users, HeartHandshake, MapPin, 
  ArrowRight, CheckCircle2, Building2, Sparkles, Mail, Phone,
  Compass, Landmark, Cpu, BarChart3, TrendingUp
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';
import { AfriQuantXInvestmentBankSection } from '../ui/AfriQuantXInvestmentBankSection';
import { About3DFinanceUniverse } from '../ui/About3DFinanceUniverse';

interface AboutPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const TIMELINE_EVENTS = [
  { year: '2022', title: 'Founded in Lagos & London', desc: 'Started with a mission to democratize cross-border securities clearing for African investors.' },
  { year: '2024', title: 'SEC & Regulatory Licensing', desc: 'Achieved clearing house integrations and partner broker licenses across Nigeria, South Africa, and Kenya.' },
  { year: '2025', title: 'Quantitative Engine Deployment', desc: 'Launched algorithmic quantitative routing network executing sub-millisecond settlement and volatility forecasting.' },
  { year: '2026', title: '$42B+ AUM & Pre-IPO Platform', desc: 'Expanded to 14 African markets, serving institutional allocators and accredited wealth desks globally.' }
];

const LEADERSHIP = [
  { name: 'Lusima Adio', role: 'Founder & Chief Executive Officer', bio: 'Former quantitative researcher and Pan-African macro strategist.', initials: 'LA' },
  { name: 'Amina Bello', role: 'Chief Risk & Compliance Officer', bio: 'Ex-SEC Securities regulator with 15+ years cross-border legal experience.', initials: 'AB' },
  { name: 'David Van Der Merwe', role: 'Chief Technology Officer', bio: 'Pioneer of high-frequency exchange matching engines in Johannesburg.', initials: 'DM' }
];

const OFFICES = [
  { city: 'Lagos, Nigeria', address: 'Victoria Island Financial District', phone: '+234 1 800 AQX' },
  { city: 'Johannesburg, South Africa', address: 'Sandton City Financial Tower', phone: '+27 11 900 AQX' },
  { city: 'Nairobi, Kenya', address: 'Westlands Commercial Center', phone: '+254 20 700 AQX' },
  { city: 'London, United Kingdom', address: 'Canary Wharf Tech Hub', phone: '+44 20 300 AQX' }
];

export function AboutPage({ onNavigatePage, onNavigateToAuth }: AboutPageProps) {
  const [activeOffice, setActiveOffice] = useState(0);

  return (
    <div className="min-h-screen bg-white text-[#0D0F13] font-sans selection:bg-[#D9A94E] selection:text-[#0D0F13] overflow-x-hidden">
      
      {/* 1. FULL-BLEED HERO SECTION WITH 3D MOTION GRAPHICS & FINANCIAL REFLECTIONS VIDEO */}
      <section className="relative w-full min-h-[88vh] sm:min-h-[94vh] flex items-center justify-center bg-[#0D0F13] text-[#F4F1E8] px-6 sm:px-12 lg:px-16 xl:px-24 overflow-hidden border-b border-white/[0.08]">
        
        {/* Full-bleed Auto-playing Muted Video of Financial Markets & Reflections */}
        <HeroVideoBackground 
          videoSrc="/videos/vecteezy_financial-reflections-through-futuristic-glasses-with_52874750.mp4"
          videoId="t5lO9Z42nZ0" 
          overlayOpacity={0.65} 
          darkMode={true}
          title="Financial Reflections & Global Capital Markets"
          creditLabel="FINANCIAL REFLECTIONS • GLOBAL CAPITAL INTELLIGENCE"
        />

        {/* 3D Interactive Finance Universe Motion Graphics (Bank Cards, Currencies, Market Screens) */}
        <About3DFinanceUniverse darkMode={true} />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-28 sm:py-36 pointer-events-none">
          
          <motion.h1 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl lg:text-[80px] font-extrabold tracking-tight text-[#F4F1E8] leading-[1.04]"
          >
            Building Africa's <br className="hidden sm:inline" />
            <span className="text-[#34A87E] drop-shadow-[0_0_40px_rgba(52,168,126,0.35)]">
              Financial Future.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg sm:text-xl text-[#F4F1E8]/85 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            We build the quantitative clearing, institutional securities settlement, and private market rails connecting African enterprise to global liquidity.
          </motion.p>

        </div>
      </section>

      {/* 2. MISSION STATEMENT */}
      <section className="py-24 sm:py-32 bg-[#F5F5F7] border-y border-black/[0.06] px-6 sm:px-12 lg:px-16 xl:px-24 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A94E]">OUR CORE PURPOSE</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0D0F13] leading-tight tracking-tight">
            "To remove friction, FX barriers, and access limits for every institutional and private allocator building wealth in Africa."
          </h2>
        </div>
      </section>

      {/* 3. STORY TIMELINE */}
      <section className="py-28 lg:py-36 px-6 sm:px-12 lg:px-16 xl:px-24 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#34A87E]">OUR MILESTONES</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0D0F13] tracking-tight">From vision to $42B+ AUM infrastructure.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TIMELINE_EVENTS.map((event, idx) => (
            <div key={idx} className="bg-[#F5F5F7] rounded-3xl p-8 border border-black/[0.06] space-y-4 relative">
              <span className="text-3xl font-extrabold font-mono text-[#D9A94E] block">{event.year}</span>
              <h3 className="text-xl font-bold text-[#0D0F13] tracking-tight">{event.title}</h3>
              <p className="text-sm text-[#6E737B] leading-relaxed">{event.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AFRIQUANTX INVESTMENT BANK SERVICES HIGHLIGHT */}
      <AfriQuantXInvestmentBankSection onNavigateToAuth={onNavigateToAuth} />

      {/* 4. LEADERSHIP */}
      <section className="py-28 lg:py-36 bg-[#0D0F13] text-[#F4F1E8] border-y border-white/[0.08] px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A94E]">EXECUTIVE LEADERSHIP</span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-[#F4F1E8] tracking-tight">Backed by industry pioneers.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP.map((leader, idx) => (
              <div key={idx} className="bg-[#14171F] rounded-3xl p-8 border border-white/[0.08] space-y-5 hover:border-[#D9A94E]/50 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#191D27] border border-white/[0.12] flex items-center justify-center font-mono font-bold text-lg text-[#F4F1E8]">
                  {leader.initials}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#F4F1E8] tracking-tight">{leader.name}</h3>
                  <span className="text-xs font-mono text-[#34A87E] font-bold block mt-1">{leader.role}</span>
                </div>
                <p className="text-sm text-[#F4F1E8]/60 leading-relaxed pt-3 border-t border-white/[0.06]">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE OFFICE LOCATIONS */}
      <section className="py-28 lg:py-36 px-6 sm:px-12 lg:px-16 xl:px-24 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6E737B]">GLOBAL PRESENCE</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-[#0D0F13] tracking-tight">Our Regional Hubs.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {OFFICES.map((off, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveOffice(idx)}
              className={`p-7 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                activeOffice === idx 
                  ? 'bg-[#0D0F13] text-[#F4F1E8] border-[#0D0F13] shadow-xl' 
                  : 'bg-[#F5F5F7] text-[#0D0F13] border-black/[0.06] hover:border-black/[0.15]'
              }`}
            >
              <MapPin className={`w-5 h-5 ${activeOffice === idx ? 'text-[#D9A94E]' : 'text-[#34A87E]'}`} />
              <h4 className="font-bold text-xl tracking-tight">{off.city}</h4>
              <p className={`text-xs ${activeOffice === idx ? 'text-[#F4F1E8]/60' : 'text-[#6E737B]'}`}>{off.address}</p>
              <p className={`text-xs font-mono ${activeOffice === idx ? 'text-[#34A87E]' : 'text-[#0D0F13]'}`}>{off.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}

