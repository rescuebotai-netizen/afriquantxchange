import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, PlayCircle, TrendingUp, Sparkles, Send, 
  Clock, Award, ArrowRight, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';
import { SharedFooter } from './SharedFooter';
import { HeroVideoBackground } from '../ui/HeroVideoBackground';

interface LearnPageProps {
  onNavigatePage: (page: string) => void;
  onNavigateToAuth?: () => void;
}

const COURSES = [
  {
    title: 'African Market Fundamentals 101',
    category: 'Beginner',
    duration: '45 mins',
    lessons: '8 Lessons',
    level: 'Starter',
    progress: 100,
    desc: 'Master dual listings across NGX, JSE, and NSE exchanges with zero jargon.'
  },
  {
    title: 'Evaluating Pre-IPO Unicorn Valuation',
    category: 'Pre-IPOs',
    duration: '1 hr 15 mins',
    lessons: '12 Lessons',
    level: 'Intermediate',
    progress: 60,
    desc: 'How to read cap tables, liquidation preferences, and secondary discount rates.'
  },
  {
    title: 'Algorithmic AI Trading with AQEI',
    category: 'AI Investing',
    duration: '2 hours',
    lessons: '16 Lessons',
    level: 'Advanced',
    progress: 30,
    desc: 'Configure neural weights, stop-loss triggers, and automated cross-market arbitrage.'
  }
];

const ARTICLES = [
  {
    title: 'Why Pan-African Banking Stocks Are Outperforming Emerging Markets in 2026',
    author: 'Dr. Kwame Osei, Head of Research',
    date: 'August 2, 2026',
    readTime: '6 min read',
    category: 'Macro Economics'
  },
  {
    title: 'Understanding Sovereign Eurobonds: A Guide for Individual Investors',
    author: 'Amina Bello, Senior Analyst',
    date: 'July 28, 2026',
    readTime: '8 min read',
    category: 'Fixed Income'
  },
  {
    title: 'The Rise of Secondary Equity Liquidity in African Tech Unicorns',
    author: 'Tariq Hassan, AQX Insights',
    date: 'July 20, 2026',
    readTime: '5 min read',
    category: 'Pre-IPOs'
  }
];

export function LearnPage({ onNavigatePage, onNavigateToAuth }: LearnPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#D5FF2F]">
      
      {/* 1. HERO SECTION WITH YOUTUBE VIDEO BACKGROUND */}
      <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-[1280px] mx-auto text-center space-y-8 overflow-hidden">
        <HeroVideoBackground videoId="LXb3EKWsInQ" overlayOpacity={0.88} />

        <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-semibold tracking-tight leading-[1.04]">
          Become a <br />
          <span>Smarter Investor.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Free masterclasses, institutional market research, and step-by-step guides for investing in African assets.
        </p>
      </section>

      {/* 2. CATEGORY FILTERS */}
      <section className="py-6 border-y border-gray-100 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
          {['All', 'Beginner', 'Markets', 'Stocks', 'Pre-IPOs', 'AI Investing', 'Business'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-bold transition-all border ${selectedCategory === cat ? 'bg-black text-white border-black' : 'bg-[#F5F5F7] text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="py-20 px-6 lg:px-12 max-w-[1280px] mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-black">Interactive Courses</h2>
          <span className="text-xs font-mono text-[#00C805] font-bold">100% FREE ACADEMY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map((course, idx) => (
            <div key={idx} className="bg-white rounded-[24px] p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-[#F5F5F7] text-black font-bold">{course.category}</span>
                  <span className="text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                </div>
                <h3 className="text-xl font-bold text-black">{course.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{course.desc}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Level: {course.level}</span>
                  <span>{course.lessons}</span>
                </div>
                <button 
                  onClick={onNavigateToAuth}
                  className="w-full py-3 rounded-full bg-black text-white hover:bg-[#D5FF2F] hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Start Course
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL RESEARCH ARTICLES GRID */}
      <section className="py-20 bg-[#F5F5F7] border-t border-gray-200 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto space-y-12">
          <h2 className="text-3xl font-semibold text-black">Latest Market Intelligence</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((art, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-8 border border-gray-200/80 shadow-sm space-y-4 hover:-translate-y-1 transition-transform">
                <span className="text-xs font-mono font-bold text-[#00C805] uppercase tracking-wider">{art.category}</span>
                <h3 className="text-xl font-bold text-black leading-snug">{art.title}</h3>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span>{art.author}</span>
                  <span>{art.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SharedFooter onNavigatePage={onNavigatePage} onNavigateToAuth={onNavigateToAuth} />

    </div>
  );
}
