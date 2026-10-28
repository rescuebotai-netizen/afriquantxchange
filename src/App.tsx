/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Marketplace } from './components/Marketplace';
import { Portfolio } from './components/Portfolio';
import { AQEI } from './components/AQEI';
import { Settings } from './components/Settings';
import { CompanyProfile } from './components/CompanyProfile';
import { CompanyOnboarding } from './components/CompanyOnboarding';
import { ActivityCenter } from './components/ActivityCenter';
import { AQXIntelligence } from './components/AQXIntelligence';
import { AQXAssistant } from './components/AQXAssistant';
import { PayoutsCenter } from './components/PayoutsCenter';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { GlobalSearch } from './components/GlobalSearch';
import { Trade } from './components/Trade';
import { SecondaryMarket } from './components/SecondaryMarket';
import { ForexMarket } from './components/ForexMarket';
import { Index } from './components/Index';
import { Wallet } from './components/Wallet';
import { AdminPanel } from './components/AdminPanel';
import { AuthPanel } from './components/AuthPanel';
import { Onboarding } from './components/Onboarding';
import { LandingPage } from './components/LandingPage';
import { AITradingBot } from './components/AITradingBot';
import { ReportViewer } from './components/ReportViewer';
import { TaxComplianceModule } from './components/TaxComplianceModule';
import { IPOLaunchHub } from './components/IPOLaunchHub';
import { AlgorithmicTradingDesk } from './components/AlgorithmicTradingDesk';
import { ValuationWorkbench } from './components/ValuationWorkbench';
import { InstitutionalIntegrationsHub } from './components/InstitutionalIntegrationsHub';
import { InitialLoader } from './components/InitialLoader';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => localStorage.getItem('hasSeenIntro') === 'true');

  const [isUserOnboarded, setIsUserOnboarded] = useState(() => localStorage.getItem('isUserOnboarded') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [userRole, setUserRole] = useState<'admin' | 'investor' | 'company'>(() => (localStorage.getItem('userRole') as 'admin' | 'investor' | 'company') || 'investor');

  useEffect(() => {
    // Access control logic: Redirect non-onboarded users to auth panel if they try to access restricted features
    if (!isUserOnboarded && activeTab !== 'auth' && activeTab !== 'aqei' && activeTab !== 'intro') {
      if (activeTab === 'admin') {
        setActiveTab('auth');
      } else if (hasSeenIntro) {
        setActiveTab('auth');
      } else {
        setActiveTab('intro');
      }
    }
    
    // Restrict Admin access to admin role only
    if (activeTab === 'admin' && isUserOnboarded && userRole !== 'admin') {
      setActiveTab('dashboard');
    }
  }, [isUserOnboarded, activeTab, hasSeenIntro, userRole]);

  const handleRoleChange = async (role: 'admin' | 'investor' | 'company') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').update({ role: role }).eq('id', user.id);
        }
      } catch (e) {
        console.warn('Could not sync role to remote Supabase profiles:', e);
      }
    }
  };

  const handleNavigateToCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setActiveTab('company-profile');
  };

  const handleIntroComplete = (tab?: string) => {
    setIsLoading(true);
    setHasSeenIntro(true);
    localStorage.setItem('hasSeenIntro', 'true');
    if (tab === 'aqei') {
      setActiveTab('aqei');
    } else {
      setActiveTab('auth');
    }
  };

  const handleNavigateToAuth = () => {
    setIsLoading(true);
    setHasSeenIntro(true);
    localStorage.setItem('hasSeenIntro', 'true');
    setActiveTab('auth');
  };

  const handleAuthComplete = () => {
    setIsLoading(true);
    setIsUserOnboarded(true);
    localStorage.setItem('isUserOnboarded', 'true');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nxg_auth_state_changed'));
    }
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsUserOnboarded(false);
    setHasSeenIntro(false);
    localStorage.removeItem('isUserOnboarded');
    localStorage.removeItem('hasSeenIntro');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('nxg_auth_state_changed'));
    }
    setActiveTab('intro');
  };

  const renderContent = () => {
    if (!hasSeenIntro && !isUserOnboarded) {
      return <Onboarding onComplete={handleIntroComplete} />;
    }

    if (!isUserOnboarded) {
      if (activeTab === 'auth') {
        return <AuthPanel onComplete={handleAuthComplete} />;
      }
      if (activeTab === 'aqei') {
        return <AQEI />;
      }
      return <AuthPanel onComplete={handleAuthComplete} />;
    }

    if (activeTab.startsWith('market-forex-order-')) {
      const orderId = activeTab.replace('market-forex-order-', '');
      return <ForexMarket setActiveTab={setActiveTab} view="order" orderId={orderId} />;
    }

    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigateToAuth={handleNavigateToAuth} onNavigateToDashboard={() => setActiveTab('dashboard')} onNavigateToAQEI={() => setActiveTab('aqei')} />;
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'integrations':
        return <InstitutionalIntegrationsHub setActiveTab={setActiveTab} />;
      case 'wallet':
        return <Wallet setActiveTab={setActiveTab} />;
      case 'portfolio':
        return <Portfolio setActiveTab={setActiveTab} />;
      case 'marketplace':
        return <Marketplace onNavigateToCompany={handleNavigateToCompany} onNavigateToOnboarding={() => setActiveTab('company-onboarding')} setActiveTab={setActiveTab} />;
      case 'trade':
        return <Trade setActiveTab={setActiveTab} />;
      case 'ipo-launch':
        return <IPOLaunchHub setActiveTab={setActiveTab} />;
      case 'algo-trading':
        return <AlgorithmicTradingDesk setActiveTab={setActiveTab} />;
      case 'valuation-workbench':
        return <ValuationWorkbench setActiveTab={setActiveTab} />;
      case 'index':
        return <Index setActiveTab={setActiveTab} />;
      case 'aqei':
        return <AQEI />;
      case 'reports':
        return <ReportViewer setActiveTab={setActiveTab} />;
      case 'tax-compliance':
        return <TaxComplianceModule setActiveTab={setActiveTab} />;
      case 'settings':
        return <Settings userRole={userRole} onRoleChange={handleRoleChange} setActiveTab={setActiveTab} />;
      case 'company-profile':
        return <CompanyProfile companyId={selectedCompanyId} onBack={() => setActiveTab('marketplace')} setActiveTab={setActiveTab} />;
      case 'company-onboarding':
        return <CompanyOnboarding onBack={() => setActiveTab('marketplace')} setActiveTab={setActiveTab} />;
      case 'activity':
        return <ActivityCenter setActiveTab={setActiveTab} />;
      case 'intelligence-ngx':
        return <AQXIntelligence setActiveTab={setActiveTab} />;
      case 'intelligence-ngx-assistant':
        return <AQXAssistant setActiveTab={setActiveTab} />;
      case 'payouts':
        return <PayoutsCenter setActiveTab={setActiveTab} />;
      case 'payouts-q4':
        return <PayoutsCenter setActiveTab={setActiveTab} initialView="q4-dividend" />;
      case 'payouts-q3':
        return <PayoutsCenter setActiveTab={setActiveTab} initialView="q3-history" />;
      case 'performance':
        return <PerformanceAnalytics setActiveTab={setActiveTab} />;
      case 'performance-1M':
        return <PerformanceAnalytics setActiveTab={setActiveTab} initialRange="1M" />;
      case 'performance-3M':
        return <PerformanceAnalytics setActiveTab={setActiveTab} initialRange="3M" />;
      case 'performance-6M':
        return <PerformanceAnalytics setActiveTab={setActiveTab} initialRange="6M" />;
      case 'performance-1Y':
        return <PerformanceAnalytics setActiveTab={setActiveTab} initialRange="1Y" />;
      case 'performance-ALL':
        return <PerformanceAnalytics setActiveTab={setActiveTab} initialRange="ALL" />;
      case 'search':
        return <GlobalSearch 
          setActiveTab={setActiveTab} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onNavigateToCompany={handleNavigateToCompany}
        />;
      case 'market-secondary':
        return <SecondaryMarket setActiveTab={setActiveTab} initialView="hub" />;
      case 'market-secondary-asset-paystack':
        return <SecondaryMarket setActiveTab={setActiveTab} initialView="asset" assetSlug="paystack-payst" />;
      case 'market-secondary-trade-paystack':
        return <SecondaryMarket setActiveTab={setActiveTab} initialView="trade" assetSlug="paystack-payst" tradeType="buy" />;
      case 'market-secondary-confirmation':
        return <SecondaryMarket setActiveTab={setActiveTab} initialView="confirmation" />;
      case 'market-forex':
        return <ForexMarket setActiveTab={setActiveTab} view="hub" />;
      case 'market-forex-confirmation':
        return <ForexMarket setActiveTab={setActiveTab} view="confirmation" />;
      case 'market-forex-history':
        return <ForexMarket setActiveTab={setActiveTab} view="history" />;
      case 'market-forex-liquidity':
        return <ForexMarket setActiveTab={setActiveTab} view="liquidity" />;
      case 'market-forex-positions':
        return <ForexMarket setActiveTab={setActiveTab} view="positions" />;
      case 'market-forex-analytics':
        return <ForexMarket setActiveTab={setActiveTab} view="analytics" />;
      default:
        if (activeTab.startsWith('market-forex-pair-')) {
          const pairSlug = activeTab.replace('market-forex-pair-', '');
          return <ForexMarket setActiveTab={setActiveTab} view="pair" pairSlug={pairSlug} />;
        }
        if (activeTab.startsWith('market-forex-trade-')) {
          const pairSlug = activeTab.replace('market-forex-trade-', '');
          return <ForexMarket setActiveTab={setActiveTab} view="trade" pairSlug={pairSlug} />;
        }
        if (activeTab.startsWith('market-forex-order-')) {
          const orderId = activeTab.replace('market-forex-order-', '');
          return <ForexMarket setActiveTab={setActiveTab} view="order" orderId={orderId} />;
        }
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const mainContent = () => {
    if (activeTab === 'admin' && isUserOnboarded) {
      return <AdminPanel onExit={() => setActiveTab('dashboard')} />;
    }

    if (!hasSeenIntro && !isUserOnboarded) {
      return renderContent();
    }

    return (
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        userRole={userRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAuthenticated={isUserOnboarded}
      >
        {renderContent()}
      </Layout>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <InitialLoader key="initial-loader" onLoaded={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      {mainContent()}
      <CookieConsentBanner />
    </>
  );
}

