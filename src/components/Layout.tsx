import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Store, 
  BrainCircuit, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User,
  Wallet,
  ArrowRightLeft,
  BarChart3,
  ShieldAlert,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Rocket,
  Cpu,
  Calculator,
  Layers,
  LogIn,
  BellRing,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Zap,
  X,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { LiveTicker } from './LiveTicker';
import { CommandPalette } from './CommandPalette';
import { ThemeToggleSwitch } from './ThemeToggleSwitch';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
  userRole?: 'admin' | 'investor' | 'company';
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  isAuthenticated?: boolean;
}

const allNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'integrations', label: 'Integrations Hub', icon: Layers },
  { id: 'ipo-launch', label: 'IPO Bookbuilding', icon: Rocket },
  { id: 'algo-trading', label: 'Algo Execution Desk', icon: Cpu },
  { id: 'valuation-workbench', label: 'Valuation & Advisory', icon: Calculator },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'marketplace', label: 'Markets', icon: Store },
  { id: 'market-secondary', label: 'Secondary Market', icon: Store },
  { id: 'market-forex', label: 'Forex Market', icon: Store },
  { id: 'trade', label: 'Trade', icon: ArrowRightLeft },
  { id: 'index', label: 'Index', icon: BarChart3 },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'activity', label: 'Activity Center', icon: Bell },
  { id: 'payouts', label: 'Payouts', icon: ArrowRightLeft },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'reports', label: 'Reports & Audits', icon: BarChart3 },
  { id: 'tax-compliance', label: 'Tax & Compliance', icon: Scale },
  { id: 'aqei', label: 'AQEI Intelligence', icon: BrainCircuit },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'admin', label: 'Admin', icon: ShieldAlert },
];

export function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  userRole = 'investor',
  searchQuery = '',
  setSearchQuery,
  isAuthenticated
}: LayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const [isAuthed, setIsAuthed] = useState<boolean>(() => {
    if (typeof isAuthenticated === 'boolean') return isAuthenticated;
    return typeof window !== 'undefined' ? localStorage.getItem('isUserOnboarded') === 'true' : false;
  });

  useEffect(() => {
    if (typeof isAuthenticated === 'boolean') {
      setIsAuthed(isAuthenticated);
    } else {
      setIsAuthed(localStorage.getItem('isUserOnboarded') === 'true');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthed(localStorage.getItem('isUserOnboarded') === 'true');
    };
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('nxg_auth_state_changed', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('nxg_auth_state_changed', handleAuthChange);
    };
  }, []);

  const currentUserName = typeof window !== 'undefined'
    ? localStorage.getItem('userName') || (localStorage.getItem('userEmail') ? localStorage.getItem('userEmail')!.split('@')[0] : 'Alex Investor')
    : 'Alex Investor';

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      localStorage.setItem('sidebar_collapsed', (!prev).toString());
      return !prev;
    });
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [toastNotification, setToastNotification] = useState<any | null>(null);

  useEffect(() => {
    // Initial notifications
    setNotifications([
      { id: 'notif-init-1', title: 'Institutional Gateway Active', message: 'Direct market data feeds connected across JSE, NGX, and NSE Kenya.', time: 'Just now', read: false, type: 'info' },
      { id: 'notif-init-2', title: 'Real-Time Market Update', message: 'Pan-African Index surged +2.48% on strong telecommunications earnings.', time: '2m ago', read: false, type: 'market' }
    ]);
    setUnreadCount(2);

    // Live real-time notification generator for institutional feeds
    const liveEventPool = [
      { title: 'FIX 4.4 Trade Execution', message: 'Child slice of 2,500 shares filled for JSE:SBK at ZAR 208.50 on Strate.', type: 'trade' },
      { title: 'IPO Bookbuilding Update', message: 'AfriHydropower Green Bond syndicate reached 3.42x institutional oversubscription.', type: 'ipo' },
      { title: 'AQEI Predictive Signal', message: 'New high-conviction BUY alert detected for Safaricom (SCOM) with 87% confidence.', type: 'signal' },
      { title: 'DvP Settlement Cleared', message: 'Pre-funded escrow allotment of ZAR 4,500,000 cleared by CSD Custody Node.', type: 'settlement' },
      { title: 'Pre-Trade Risk Gate Checked', message: 'TWAP parent order VaR collar validated: 0.18% headroom within 2.5% band.', type: 'risk' },
      { title: 'Macro FX Telemetry', message: 'USD/ZAR implied volatility compressed 14 bps following SARB policy rate release.', type: 'macro' }
    ];

    let eventIdx = 0;
    const interval = setInterval(() => {
      const selected = liveEventPool[eventIdx % liveEventPool.length];
      eventIdx++;

      const newNotif = {
        id: `notif-live-${Date.now()}`,
        title: selected.title,
        message: selected.message,
        time: 'Just now',
        read: false,
        type: selected.type
      };

      setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
      setUnreadCount(prev => prev + 1);

      // Trigger temporary live real-time toast banner
      setToastNotification(newNotif);
      setTimeout(() => {
        setToastNotification((curr: any) => (curr?.id === newNotif.id ? null : curr));
      }, 4500);
    }, 12000);

    // Subscribe to real-time transactions in Supabase if configured
    let channel: any = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase.channel('realtime-notifications')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, payload => {
            const newNotif = {
              id: payload.new.id,
              title: 'New Transaction',
              message: `A new ${payload.new.type} of ${payload.new.amount} was recorded.`,
              time: 'Just now',
              read: false,
              type: 'trade'
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            setToastNotification(newNotif);
            setTimeout(() => setToastNotification(null), 4000);
          })
          .subscribe();
      } catch (e) {
        console.warn('Realtime notifications channel unavailable:', e);
      }
    }

    // Subscribe to real-time price threshold alerts dispatched by priceAlertService
    const handlePriceAlert = (e: any) => {
      if (e.detail?.alert) {
        const alert = e.detail.alert;
        const actualPrice = e.detail.actualPrice ?? alert.targetPrice;
        const newNotif = {
          id: `price-alert-${alert.id}-${Date.now()}`,
          title: `PRICE ALERT: ${alert.symbol}`,
          message: `${alert.assetName} breached threshold at ${alert.currency} ${actualPrice.toFixed(2)} (${alert.condition === 'GREATER_EQUAL' ? '▲ resistance' : '▼ support'}). Action: ${alert.triggerAction}`,
          time: 'Just now',
          read: false,
          type: 'alert'
        };
        setNotifications(prev => [newNotif, ...prev.slice(0, 24)]);
        setUnreadCount(prev => prev + 1);
        setToastNotification(newNotif);
        setTimeout(() => {
          setToastNotification((curr: any) => (curr?.id === newNotif.id ? null : curr));
        }, 6000);
      }
    };
    window.addEventListener('nxg_price_alert_triggered', handlePriceAlert);

    return () => {
      clearInterval(interval);
      window.removeEventListener('nxg_price_alert_triggered', handlePriceAlert);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current && !isCommandPaletteOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  const navItems = allNavItems.filter(item => {
    if (item.id === 'admin') {
      return userRole === 'admin';
    }
    return true;
  });

  const mobileNavItems = navItems.filter(item => 
    ['dashboard', 'portfolio', 'marketplace', 'settings'].includes(item.id)
  );

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans selection:bg-white/30">
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        onNavigate={setActiveTab} 
      />
      
      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "hidden md:flex flex-col border-r border-white/5 bg-black relative z-20 transition-all duration-300 ease-in-out shrink-0",
        isSidebarCollapsed ? "w-20" : "w-72"
      )}>
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute top-7 -right-3 w-6 h-6 bg-white border border-neutral-800 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50 shadow-md"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        <div className={cn("flex items-center gap-3 transition-all duration-300", isSidebarCollapsed ? "justify-center p-4" : "px-6 py-5 pb-3")}>
          <img src="/logo.svg" alt="AfriQuantX Logo" className="w-9 h-9 object-contain" />
          {!isSidebarCollapsed && (
            <span className="font-extrabold text-lg tracking-tight text-white">AfriQuantX</span>
          )}
        </div>

        {/* Search Bar - Moved to Side Menu Bar on top of Dashboard link */}
        <div className={cn("pb-2 transition-all duration-300 shrink-0", isSidebarCollapsed ? "px-2 flex justify-center" : "px-4")}>
          {isSidebarCollapsed ? (
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-10 h-10 flex items-center justify-center bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 hover:border-white/25 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer shadow-sm group"
              title="Search or jump to... (⌘K)"
            >
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-white" />
            </button>
          ) : (
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-800/90 border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-zinc-400 hover:text-white transition-all text-xs group cursor-pointer shadow-inner"
              title="Search or jump to... (Press ⌘K or /)"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white shrink-0" />
              <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200 flex-1 text-left truncate">Search or jump to...</span>
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-mono text-zinc-400 font-bold border border-white/10">⌘K</kbd>
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center rounded-xl transition-all duration-200 relative group uppercase tracking-wider text-[10px] font-bold",
                  isSidebarCollapsed ? "justify-center p-3" : "px-3 py-2.5 gap-2.5",
                  isActive 
                    ? "text-black font-extrabold" 
                    : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-desktop"
                    className="absolute inset-0 bg-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 relative z-10 transition-transform duration-200 shrink-0", isActive ? "scale-105 text-black" : "group-hover:scale-105")} />
                {!isSidebarCollapsed && <span className="relative z-10 truncate text-[10px] tracking-wider">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Profile & Wallet (if authed) + Theme Toggle & Notifications Bell */}
        <div className="mt-auto border-t border-white/5 flex flex-col bg-neutral-950/80 shrink-0">
          {isAuthed && (
            <div className={cn("p-3 transition-all duration-300", isSidebarCollapsed ? "items-center flex flex-col gap-3" : "")}>
              {isSidebarCollapsed ? (
                <div className="flex flex-col items-center gap-2.5">
                  <div 
                    onClick={() => setActiveTab('settings')}
                    className="w-9 h-9 rounded-full bg-white p-[2px] cursor-pointer hover:scale-105 transition-transform" 
                    title={`${currentUserName} (${userRole})`}
                  >
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div 
                    onClick={() => setActiveTab('wallet')}
                    className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer" 
                    title="Wallet Balance: $0"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setActiveTab('settings')}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-white/5 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-2.5 mb-2.5 relative z-10">
                    <div className="w-8 h-8 rounded-full bg-white p-[2px] shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white uppercase tracking-wider truncate">{currentUserName}</p>
                      <p className="text-[9px] text-emerald-400 flex items-center gap-1 uppercase tracking-widest font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Verified {userRole}
                      </p>
                    </div>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('wallet');
                    }}
                    className="pt-2 border-t border-white/5 relative z-10 hover:opacity-90 transition-opacity"
                  >
                    <p className="text-[9px] text-zinc-400 mb-0.5 flex items-center gap-1 uppercase tracking-widest font-bold">
                      <Wallet className="w-3 h-3 text-white" /> Wallet Balance
                    </p>
                    <p className="text-sm font-bold font-mono text-white tracking-tight">$0</p>
                  </div>
                </div>
              )}
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className={cn(
                    "mt-2 flex items-center justify-center bg-zinc-900 text-white hover:bg-rose-950/40 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer",
                    isSidebarCollapsed ? "w-9 h-9 p-0" : "w-full py-2.5 gap-2"
                  )}
                  title={isSidebarCollapsed ? "Sign Out" : undefined}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {!isSidebarCollapsed && "Sign Out"}
                </button>
              )}
            </div>
          )}

          {/* Theme Toggle & Notification Bell at the bottom side of the Side menu */}
          <div className={cn(
            "p-3 border-t border-white/5 flex items-center justify-between gap-2 transition-all duration-300",
            isSidebarCollapsed ? "flex-col justify-center" : ""
          )}>
            <div className="flex items-center gap-2">
              {!isSidebarCollapsed && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Theme</span>
              )}
              <ThemeToggleSwitch scale={isSidebarCollapsed ? "micro" : "compact"} id="sidebar-bottom-theme-toggle" />
            </div>

            {/* Notification Bell with Dropdown in Sidebar */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={handleNotificationClick}
                className="relative p-2 rounded-xl bg-transparent border-0 border-none text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-0 shadow-none"
                title="Notifications & Live Telemetry"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown from bottom of sidebar */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "fixed z-[99999] bottom-16 w-96 sm:w-[420px] bg-[#0A0E1A] border-2 border-white/20 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.99)] overflow-hidden",
                      isSidebarCollapsed ? "left-24" : "left-76"
                    )}
                    style={{ backgroundColor: '#0A0E1A' }}
                  >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#101626]" style={{ backgroundColor: '#101626' }}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <h3 className="font-bold text-white text-sm">Real-Time Telemetry & Alerts</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400 font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                          {notifications.length} events
                        </span>
                        {notifications.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifications([]);
                              setUnreadCount(0);
                            }}
                            title="Clear all notifications"
                            className="text-zinc-500 hover:text-rose-400 p-1 text-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 bg-[#0A0E1A]" style={{ backgroundColor: '#0A0E1A' }}>
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if (notif.type === 'alert' || notif.title.includes('PRICE ALERT')) {
                                setActiveTab('algo-trading');
                              } else {
                                setActiveTab('activity');
                              }
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 hover:bg-[#151D2E] transition-colors cursor-pointer ${!notif.read ? 'bg-[#0E1524]' : 'bg-[#0A0E1A]'}`}
                            style={{ backgroundColor: !notif.read ? '#0E1524' : '#0A0E1A' }}
                          >
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                {notif.type === 'alert' || notif.title.includes('PRICE ALERT') ? (
                                  <BellRing className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                ) : notif.type === 'trade' ? (
                                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : notif.type === 'signal' ? (
                                  <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                ) : notif.type === 'risk' ? (
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                ) : (
                                  <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate">{notif.title}</h4>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono shrink-0">{notif.time}</span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed pl-5">{notif.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-zinc-400 text-sm">
                          <Bell className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                          No active notifications
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 border-t border-white/10 bg-[#0E1422] flex items-center justify-between" style={{ backgroundColor: '#0E1422' }}>
                      <button
                        onClick={() => {
                          setUnreadCount(0);
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Mark all read
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('activity');
                          setShowNotifications(false);
                        }}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        Activity Center
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-black">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />

        {/* Scrollable Content - FULL WIDTH STRETCHED LAYOUT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 z-10 scroll-smooth w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full h-full min-h-[calc(100vh-140px)]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Real-time Notification Toast Notification (Top Right, Opaque, High Z-Index) */}
        <AnimatePresence>
          {toastNotification && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-20 md:top-24 right-4 md:right-8 z-[99999] max-w-sm w-[calc(100vw-2rem)] md:w-96 bg-[#0A0E1A] border-2 border-emerald-500/60 p-4 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.98)] flex items-start gap-3 pointer-events-auto"
              style={{ backgroundColor: '#0A0E1A' }}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                {toastNotification.type === 'alert' || toastNotification.title.includes('PRICE ALERT') ? (
                  <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
                ) : toastNotification.type === 'trade' ? (
                  <ArrowRightLeft className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : toastNotification.type === 'signal' ? (
                  <Zap className="w-4 h-4 text-purple-400 animate-bounce" />
                ) : (
                  <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
                )}
              </div>
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => {
                  if (toastNotification.type === 'alert' || toastNotification.title.includes('PRICE ALERT')) {
                    setActiveTab('algo-trading');
                  } else {
                    setActiveTab('activity');
                  }
                  setToastNotification(null);
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-xs font-bold text-white uppercase tracking-wider truncate">{toastNotification.title}</p>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">{toastNotification.time}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">{toastNotification.message}</p>
                <p className="text-[10px] text-blue-400 font-semibold mt-1 flex items-center gap-1 hover:underline">
                  Click to open in terminal <ChevronRight className="w-3 h-3" />
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToastNotification(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-18 bg-black/95 backdrop-blur-2xl border-t border-white/10 z-50 px-4 pb-safe flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav-mobile"
                  className="absolute inset-0 bg-white rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn("w-4 h-4 relative z-10 transition-transform duration-300", isActive ? "text-black -translate-y-0.5" : "text-zinc-500")} />
              <span className={cn("text-[8px] font-bold uppercase tracking-wider absolute bottom-1 transition-opacity duration-300", isActive ? "opacity-100 text-black font-extrabold" : "opacity-0")}>
                {item.label}
              </span>
            </button>
          );
        })}
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="relative flex flex-col items-center justify-center w-12 h-12 text-zinc-500 hover:text-white"
          title="Search or jump to..."
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">Search</span>
        </button>
      </nav>
    </div>
  );
}
