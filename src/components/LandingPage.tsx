import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Menu, X, Globe, Smartphone, ChevronRight, ShieldCheck
} from 'lucide-react';
import { LandingHome } from './pages/LandingHome';
import { BusinessPage } from './pages/BusinessPage';
import { AboutPage } from './pages/AboutPage';

interface LandingPageProps {
  onNavigateToAuth?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToAQEI?: () => void;
}

export function LandingPage({
  onNavigateToAuth,
  onNavigateToDashboard,
  onNavigateToAQEI
}: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowStickyCTA(scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigatePage = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'business', label: 'Business' },
    { id: 'about', label: 'About' }
  ];

  const renderActivePage = () => {
    switch (currentPage) {
      case 'business':
        return <BusinessPage onNavigatePage={handleNavigatePage} onNavigateToAuth={onNavigateToAuth} />;
      case 'about':
        return <AboutPage onNavigatePage={handleNavigatePage} onNavigateToAuth={onNavigateToAuth} />;
      case 'home':
      default:
        return (
          <LandingHome 
            onNavigatePage={handleNavigatePage} 
            onNavigateToAuth={onNavigateToAuth || (() => {})} 
            onNavigateToDashboard={onNavigateToDashboard}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#191C1F] font-sans selection:bg-[#0666EB] selection:text-white relative">
      
      {/* GLOBAL TRANSPARENT HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[76px] transition-all duration-300 flex items-center bg-transparent border-b border-transparent">
        <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-24 flex items-center justify-between">
          
          {/* Brand Logo Left */}
          <div 
            onClick={() => handleNavigatePage('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow-sm">
              AfriQuant<span className="text-[#D9A94E]">X</span>
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-white/90">
            {navItems.map((item) => (
              <span
                key={item.id}
                onClick={() => handleNavigatePage(item.id)}
                className={`cursor-pointer transition-all duration-200 relative py-1 px-1 ${
                  currentPage === item.id 
                    ? 'text-white font-bold' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D9A94E] rounded-full" 
                  />
                )}
              </span>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={onNavigateToAuth}
              className="text-sm font-semibold text-white/90 hover:text-[#D9A94E] transition-colors px-3 py-2"
            >
              Log in
            </button>

            <button 
              onClick={onNavigateToAuth}
              className="h-[46px] px-7 rounded-full bg-[#D9A94E] text-[#0D0F13] hover:bg-[#e5b75f] font-bold text-sm tracking-tight transition-all duration-200 shadow-[0_4px_16px_rgba(217,169,78,0.25)] hover:scale-[1.02] flex items-center gap-2 group"
            >
              <span>Get the app</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[76px] z-40 bg-[#0A0A0A] text-white border-b border-white/10 p-6 shadow-2xl lg:hidden space-y-4"
          >
            <div className="flex flex-col gap-2 font-semibold text-base">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigatePage(item.id)}
                  className={`py-3 px-4 rounded-xl cursor-pointer transition-all ${
                    currentPage === item.id ? 'bg-[#D9A94E] text-[#0D0F13] font-bold' : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={onNavigateToAuth}
                className="w-full py-4 rounded-full bg-[#D9A94E] text-[#0D0F13] font-bold text-sm tracking-tight shadow-md"
              >
                Sign In / Open Account
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSISTENT STICKY BOTTOM CTA (REVOLUT STYLE) */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={onNavigateToAuth}
              className="px-7 py-3.5 rounded-full bg-[#0A0A0A] hover:bg-black text-white text-sm font-bold shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex items-center gap-3 group hover:scale-[1.03] transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#0666EB] to-[#7C4DFF] animate-pulse" />
              <span>Get AfriQuantX</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER ACTIVE PAGE CONTENT */}
      <main className="relative z-10">
        {renderActivePage()}
      </main>

    </div>
  );
}
