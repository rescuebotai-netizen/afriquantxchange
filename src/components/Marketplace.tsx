import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, TrendingDown, ShieldCheck, Star, Zap, X, ChevronRight, BrainCircuit, Building2, ArrowRight, Coins, Globe, BarChart3, Activity, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface MarketplaceProps {
  onNavigateToCompany?: (id: string) => void;
  onNavigateToOnboarding?: () => void;
  setActiveTab?: (tab: string) => void;
}

const products = [];
const equities = [];
const commodities = [];

const forexPairs = [
  {
    id: 'fx1',
    pair: 'USD/NGN',
    name: 'US Dollar / Nigerian Naira',
    rate: 1450.50,
    change: '-1.5%',
    trend: 'down',
    volume: '$45.2M'
  },
  {
    id: 'fx2',
    pair: 'USD/ZAR',
    name: 'US Dollar / South African Rand',
    rate: 18.75,
    change: '+0.2%',
    trend: 'up',
    volume: '$120.5M'
  },
  {
    id: 'fx3',
    pair: 'EUR/KES',
    name: 'Euro / Kenyan Shilling',
    rate: 142.30,
    change: '+0.8%',
    trend: 'up',
    volume: '$28.4M'
  },
  {
    id: 'fx4',
    pair: 'GBP/EGP',
    name: 'British Pound / Egyptian Pound',
    rate: 59.80,
    change: '-0.4%',
    trend: 'down',
    volume: '$15.7M'
  },
  {
    id: 'fx5',
    pair: 'USD/GHS',
    name: 'US Dollar / Ghanaian Cedi',
    rate: 13.50,
    change: '+0.1%',
    trend: 'up',
    volume: '$12.1M'
  }
];

const generateCompanies = () => {
  const generated = [];
  const realCompanies = [
    { name: 'Naspers', sector: 'Technology', risk: 'Low', ticker: 'NPN' },
    { name: 'Standard Bank', sector: 'Financials', risk: 'Low', ticker: 'SBK' },
    { name: 'Dangote Cement', sector: 'Manufacturing', risk: 'Medium', ticker: 'DANGCEM' },
    { name: 'Safaricom', sector: 'Telecom', risk: 'Low', ticker: 'SCOM' },
    { name: 'MTN Group', sector: 'Telecom', risk: 'Low', ticker: 'MTN' },
    { name: 'OCP Group', sector: 'Agriculture', risk: 'Low', ticker: 'OCP' },
    { name: 'Sonatrach', sector: 'Energy', risk: 'Medium', ticker: 'SONA' },
    { name: 'Equity Group', sector: 'Financials', risk: 'Low', ticker: 'EQTY' },
    { name: 'Zenith Bank', sector: 'Financials', risk: 'Medium', ticker: 'ZENITH' },
    { name: 'Flutterwave', sector: 'FinTech', risk: 'High', ticker: 'FLW' },
    { name: 'Paystack', sector: 'FinTech', risk: 'Medium', ticker: 'PSTK' },
    { name: 'Jumia', sector: 'E-commerce', risk: 'High', ticker: 'JMIA' },
    { name: 'Fawry', sector: 'FinTech', risk: 'Medium', ticker: 'FWRY' },
    { name: 'Interswitch', sector: 'FinTech', risk: 'Medium', ticker: 'ISW' },
    { name: 'M-KOPA', sector: 'CleanTech', risk: 'Medium', ticker: 'MKOPA' },
    { name: 'Andela', sector: 'Tech Services', risk: 'Medium', ticker: 'AND' },
    { name: 'Chipper Cash', sector: 'FinTech', risk: 'High', ticker: 'CHPR' },
    { name: 'Wave', sector: 'FinTech', risk: 'High', ticker: 'WAVE' },
    { name: 'OPay', sector: 'FinTech', risk: 'Medium', ticker: 'OPAY' },
    { name: 'Sasol', sector: 'Energy', risk: 'High', ticker: 'SOL' },
    { name: 'KCB Group', sector: 'Financials', risk: 'Low', ticker: 'KCB' },
    { name: 'Anglo American Platinum', sector: 'Mining', risk: 'Medium', ticker: 'AMS' },
    { name: 'Cassava Technologies', sector: 'Technology', risk: 'Medium', ticker: 'CASS' },
    { name: 'Liquid Intelligent Tech', sector: 'Telecom', risk: 'Low', ticker: 'LIQ' },
    { name: 'Africa Data Centres', sector: 'Infrastructure', risk: 'Low', ticker: 'ADC' }
  ];

  realCompanies.forEach((comp, i) => {
    generated.push({
      id: `real-comp-${i}`,
      name: comp.name,
      sector: comp.sector,
      description: `Leading African ${comp.sector} company.`,
      growthScore: 70 + (i % 30),
      risk: comp.risk,
      revGrowth: `+${(i % 30) + 5}% YoY`,
      returns: `+${(i % 50) + 10}% YTD`,
      logo: comp.name.substring(0, 2).toUpperCase(),
      price: 10 + (i % 500) + (Math.random() * 10),
      ticker: comp.ticker
    });
  });

  const prefixes = ['Afri', 'Pan', 'Global', 'National', 'Standard', 'First', 'United', 'Royal', 'Imperial', 'Apex', 'Summit', 'Pioneer', 'Prime', 'Core', 'Next', 'Future', 'Smart', 'Eco', 'Green', 'Blue', 'Nova', 'Syn', 'Omni', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa', 'Zetta', 'Yotta'];
  const roots = ['Tech', 'Fin', 'Agri', 'Mine', 'Tel', 'Eng', 'Log', 'Com', 'Health', 'Man', 'Real', 'Edu', 'Med', 'Bio', 'Chem', 'Phys', 'Aero', 'Auto', 'Marine', 'Space'];
  const suffixes = ['Holdings', 'Group', 'Ventures', 'Partners', 'Capital', 'Technologies', 'Solutions', 'Systems', 'Industries', 'Enterprises', 'Corp', 'Ltd', 'Plc', 'Networks', 'Dynamics', 'Innovations', 'Labs', 'Studios', 'Works', 'Foundry'];
  const sectors = ['Technology', 'Financials', 'Manufacturing', 'Telecom', 'Agriculture', 'Energy', 'FinTech', 'E-commerce', 'CleanTech', 'Mining', 'Infrastructure', 'Healthcare', 'Education', 'Real Estate', 'Transportation'];
  const risks = ['Low', 'Medium', 'High'];
  
  let idCounter = realCompanies.length;
  for (let i = 0; i < prefixes.length; i++) {
    for (let j = 0; j < roots.length; j++) {
      for (let k = 0; k < suffixes.length; k++) {
        if (generated.length >= 2050) break;
        const name = `${prefixes[i]}${roots[j]} ${suffixes[k]}`;
        const sector = sectors[(i + j + k) % sectors.length];
        const risk = risks[(i + j + k) % risks.length];
        const ticker = `${prefixes[i].substring(0, 2).toUpperCase()}${roots[j].substring(0, 2).toUpperCase()}`;
        
        generated.push({
          id: `gen-comp-${idCounter}`,
          name: name,
          sector: sector,
          description: `Emerging private enterprise in the African ${sector} sector.`,
          growthScore: 40 + ((i * j * k) % 60),
          risk: risk,
          revGrowth: `+${((i + j + k) % 40) + 2}% YoY`,
          returns: `+${((i * j) % 60) + 5}% YTD`,
          logo: name.substring(0, 2).toUpperCase(),
          price: 5 + ((i * j * k) % 200) + (Math.random() * 5),
          ticker: ticker
        });
        idCounter++;
      }
      if (generated.length >= 2050) break;
    }
    if (generated.length >= 2050) break;
  }
  return generated;
};

const generateProducts = () => {
  const generated = [];
  const realProducts = [
    { name: 'M-Pesa API Access', category: 'FinTech API', desc: 'Enterprise integration for East Africa\'s leading mobile money platform.' },
    { name: 'Paystack Payment Gateway', category: 'FinTech API', desc: 'Seamless payment processing for African businesses.' },
    { name: 'Flutterwave Store', category: 'E-commerce', desc: 'Digital storefront infrastructure for African merchants.' },
    { name: 'Jumia Prime', category: 'E-commerce', desc: 'Subscription service for free delivery across Jumia\'s network.' },
    { name: 'Zipline Drone Delivery SLA', category: 'Manufacturing', desc: 'Automated medical and commercial drone delivery services.' },
    { name: 'Andela Engineering Team', category: 'Tech Services', desc: 'Dedicated remote engineering teams from Africa\'s top talent pool.' },
    { name: 'M-KOPA Solar Home System', category: 'CleanTech Hardware', desc: 'Pay-as-you-go solar power systems for off-grid homes.' },
    { name: 'Fawry POS Terminal', category: 'Hardware', desc: 'Point-of-sale hardware for Egypt\'s largest e-payment network.' },
    { name: 'Roam Electric Motorcycle', category: 'EV Hardware', desc: 'Electric motorcycles designed and built in Kenya.' },
    { name: 'Ampersand EV Battery Swap', category: 'EV Services', desc: 'Battery swapping subscription for electric moto-taxis in Rwanda.' },
    { name: 'Liquid Telecom Fiber Lease', category: 'Infrastructure', desc: 'High-speed fiber optic network leasing across Africa.' },
    { name: 'Africa Data Centres Colocation', category: 'Infrastructure', desc: 'Tier III data center colocation services.' },
    { name: 'BasiGo Electric Bus Lease', category: 'EV Services', desc: 'Pay-As-You-Drive electric bus leasing for public transport.' },
    { name: 'Kobo360 Freight Booking', category: 'Manufacturing', desc: 'Digital logistics platform connecting cargo owners with truck drivers.' },
    { name: 'Wasoko Supply Chain', category: 'Manufacturing', desc: 'B2B retail supply chain and financing for informal retailers.' }
  ];

  realProducts.forEach((prod, i) => {
    generated.push({
      id: `real-prod-${i}`,
      name: prod.name,
      description: prod.desc,
      price: 100 + (i % 5000) + (Math.random() * 50),
      equity: (i % 10) / 100,
      estReturn: 50 + (i % 500),
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      category: prod.category,
      rating: 4.0 + ((i % 10) / 10),
    });
  });

  const actions = ['Payment', 'Delivery', 'Cloud', 'Data', 'Security', 'Analytics', 'Mobile', 'Web', 'AI', 'IoT', 'Blockchain', 'Energy', 'Health', 'Education', 'Agri'];
  const types = ['Gateway', 'Platform', 'API', 'Dashboard', 'App', 'System', 'Network', 'Service', 'Solution', 'Engine', 'Hub', 'Portal', 'Suite', 'Toolkit', 'Framework'];
  const regions = ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda', 'Uganda', 'Tanzania', 'Morocco', 'Senegal'];
  const categories = ['FinTech API', 'E-commerce', 'Manufacturing', 'Tech Services', 'CleanTech Hardware', 'Hardware', 'EV Hardware', 'EV Services', 'Infrastructure', 'SaaS'];

  let idCounter = realProducts.length;
  for (let i = 0; i < actions.length; i++) {
    for (let j = 0; j < types.length; j++) {
      for (let k = 0; k < regions.length; k++) {
        if (generated.length >= 2050) break;
        const name = `${regions[k]} ${actions[i]} ${types[j]}`;
        const category = categories[(i + j + k) % categories.length];
        
        generated.push({
          id: `gen-prod-${idCounter}`,
          name: name,
          description: `Enterprise-grade ${actions[i].toLowerCase()} ${types[j].toLowerCase()} tailored for the ${regions[k]} market.`,
          price: 50 + ((i * j * k) % 1000) + (Math.random() * 20),
          equity: ((i + j + k) % 15) / 100,
          estReturn: 30 + ((i * j * k) % 200),
          image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
          category: category,
          rating: 3.5 + (((i + j + k) % 15) / 10),
        });
        idCounter++;
      }
      if (generated.length >= 2050) break;
    }
    if (generated.length >= 2050) break;
  }
  return generated;
};

const generateCommodities = () => {
  const generated = [];
  const realCommodities = [
    { name: 'Gold (XAU)', type: 'Precious Metal', desc: 'Major exports from South Africa, Ghana, Mali.', icon: '🪙' },
    { name: 'Cocoa', type: 'Agriculture', desc: 'Major exports from Ivory Coast and Ghana.', icon: '🍫' },
    { name: 'Brent Crude Oil', type: 'Energy', desc: 'Major exports from Nigeria and Angola.', icon: '🛢️' },
    { name: 'Platinum', type: 'Precious Metal', desc: 'South Africa is the world\'s largest producer.', icon: '⚪' },
    { name: 'Copper', type: 'Industrial Metal', desc: 'Major exports from DRC and Zambia.', icon: '🥉' },
    { name: 'Cobalt', type: 'Industrial Metal', desc: 'DRC produces over 70% of global supply.', icon: '🔋' },
    { name: 'Diamonds', type: 'Precious Stones', desc: 'Major exports from Botswana, South Africa, Angola.', icon: '💎' },
    { name: 'Vanilla', type: 'Agriculture', desc: 'Madagascar produces ~80% of global supply.', icon: '🍦' },
    { name: 'Coffee (Arabica)', type: 'Agriculture', desc: 'Major exports from Ethiopia and Kenya.', icon: '☕' },
    { name: 'Coffee (Robusta)', type: 'Agriculture', desc: 'Major exports from Uganda and Ivory Coast.', icon: '☕' },
    { name: 'Tea', type: 'Agriculture', desc: 'Kenya is the world\'s top exporter of black tea.', icon: '🍵' },
    { name: 'Cashew Nuts', type: 'Agriculture', desc: 'Major exports from Ivory Coast, Tanzania, Nigeria.', icon: '🥜' },
    { name: 'Bauxite', type: 'Industrial Metal', desc: 'Guinea has the world\'s largest reserves.', icon: '🪨' },
    { name: 'Manganese', type: 'Industrial Metal', desc: 'South Africa and Gabon are top producers.', icon: '🪨' },
    { name: 'Uranium', type: 'Energy', desc: 'Major exports from Namibia and Niger.', icon: '☢️' },
    { name: 'Lithium', type: 'Industrial Metal', desc: 'Emerging production in Zimbabwe and Namibia.', icon: '🔋' },
    { name: 'Sesame Seeds', type: 'Agriculture', desc: 'Major exports from Sudan, Ethiopia, Nigeria.', icon: '🌱' },
    { name: 'Macadamia Nuts', type: 'Agriculture', desc: 'South Africa and Kenya are leading producers.', icon: '🌰' }
  ];

  realCommodities.forEach((cmd, i) => {
    generated.push({
      id: `real-cmd-${i}`,
      name: cmd.name,
      type: cmd.type,
      price: 10 + (i % 3000) + (Math.random() * 10),
      change: `${i % 2 === 0 ? '+' : '-'}${(i % 5) + 0.1}%`,
      trend: i % 2 === 0 ? 'up' : 'down',
      description: cmd.desc,
      icon: cmd.icon
    });
  });

  const materials = ['Gold', 'Silver', 'Copper', 'Platinum', 'Palladium', 'Iron Ore', 'Coal', 'Crude Oil', 'Natural Gas', 'Uranium', 'Cobalt', 'Lithium', 'Bauxite', 'Manganese', 'Zinc', 'Lead', 'Nickel', 'Tin', 'Diamonds', 'Emeralds', 'Sapphires', 'Rubies', 'Cocoa', 'Coffee', 'Tea', 'Cotton', 'Rubber', 'Palm Oil', 'Sugar', 'Maize', 'Wheat', 'Rice', 'Soybeans', 'Cashews', 'Macadamia', 'Vanilla', 'Sesame', 'Sorghum', 'Millet', 'Cassava'];
  const origins = ['South Africa', 'Nigeria', 'Ghana', 'Kenya', 'Tanzania', 'DRC', 'Zambia', 'Angola', 'Mozambique', 'Zimbabwe', 'Botswana', 'Namibia', 'Madagascar', 'Ivory Coast', 'Senegal', 'Mali', 'Guinea', 'Egypt', 'Morocco', 'Algeria'];
  const grades = ['Premium', 'Standard', 'Raw', 'Refined', 'Grade A', 'Grade B', 'Export', 'Industrial'];
  const types = ['Precious Metal', 'Industrial Metal', 'Energy', 'Agriculture', 'Precious Stones', 'Minerals'];

  let idCounter = realCommodities.length;
  for (let i = 0; i < materials.length; i++) {
    for (let j = 0; j < origins.length; j++) {
      for (let k = 0; k < grades.length; k++) {
        if (generated.length >= 2050) break;
        const name = `${origins[j]} ${materials[i]} (${grades[k]})`;
        const type = types[i % types.length];
        
        generated.push({
          id: `gen-cmd-${idCounter}`,
          name: name,
          type: type,
          price: 10 + ((i * j * k) % 5000) + (Math.random() * 10),
          change: `${(i + j + k) % 2 === 0 ? '+' : '-'}${((i * j) % 5) + 0.1}%`,
          trend: (i + j + k) % 2 === 0 ? 'up' : 'down',
          description: `High-quality ${materials[i].toLowerCase()} sourced from ${origins[j]}.`,
          icon: type === 'Agriculture' ? '🌱' : type === 'Energy' ? '⚡' : '🪨'
        });
        idCounter++;
      }
      if (generated.length >= 2050) break;
    }
    if (generated.length >= 2050) break;
  }
  return generated;
};

const allEquities = [...equities, ...generateCompanies()];
const allProducts = [...products, ...generateProducts()];
const allCommodities = [...commodities, ...generateCommodities()];

export function Marketplace({ onNavigateToCompany, onNavigateToOnboarding, setActiveTab: setAppActiveTab }: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState<'equities' | 'commodities' | 'forex' | 'products'>('equities');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveCompanies, setLiveCompanies] = useState<any[]>([]);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!isSupabaseConfigured) return;
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*');
        
        if (data && !error) {
          const formattedCompanies = data.map(comp => ({
          id: comp.id,
          name: comp.name,
          sector: comp.sector,
          description: comp.mission || `Emerging private enterprise in the African ${comp.sector} sector.`,
          growthScore: comp.growth_score || 75,
          risk: comp.risk_profile || 'Medium',
          revGrowth: '+15% YoY',
          returns: '+20% YTD',
          logo: comp.name.substring(0, 2).toUpperCase(),
          price: 50 + (Math.random() * 10),
          ticker: comp.name.substring(0, 3).toUpperCase()
        }));
        setLiveCompanies(formattedCompanies);
      }
    } catch (e) {
      console.warn('Could not load companies from Supabase:', e);
    }
  };
  fetchCompanies();
}, []);

  const displayEquities = liveCompanies.length > 0 ? liveCompanies : allEquities;

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getPaginatedData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <span className="text-sm text-zinc-400">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl bg-white/5 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 relative bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">AQX Exchange</h1>
          <p className="text-zinc-400 mt-1 font-medium">Africa's Wall Street: Equities, Commodities & Forex</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-mono text-white font-bold">1,485.20</span>
            <span className="flex items-center px-2.5 py-1 rounded-md bg-[#FFFFFF]/10 text-[#FFFFFF] text-xs font-bold border border-[#FFFFFF]/20">
              <TrendingUp className="w-3 h-3 mr-1 text-[#FFFFFF]" />
              +2.4%
            </span>
            <span className="flex items-center px-2.5 py-1 rounded-md bg-[#FFFFFF]/10 text-[#FFFFFF] text-xs font-bold border border-[#FFFFFF]/20">
              <BrainCircuit className="w-3 h-3 mr-1 text-[#FFFFFF]" />
              Bullish Trend
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex bg-black p-1 rounded-2xl border border-white/10 whitespace-nowrap">
            <button
              onClick={() => setActiveTab('equities')}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'equities' 
                  ? 'bg-[#FFFFFF] text-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Equities
            </button>
            <button
              onClick={() => setActiveTab('commodities')}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'commodities' 
                  ? 'bg-[#FFFFFF] text-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Coins className="w-4 h-4" /> Commodities
            </button>
            <button
              onClick={() => {
                if (setAppActiveTab) setAppActiveTab('market-forex');
              }}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 text-zinc-400 hover:text-white hover:bg-white/5`}
            >
              <Globe className="w-4 h-4" /> Forex
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 md:px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'products' 
                  ? 'bg-[#FFFFFF] text-black shadow-lg' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Products
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (setAppActiveTab) setAppActiveTab('market-secondary');
              }}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF]/10 text-[#FFFFFF] border border-[#FFFFFF]/20 hover:bg-[#FFFFFF] hover:text-black transition-colors text-sm font-bold uppercase tracking-wider whitespace-nowrap"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Secondary Market
            </button>
            <button 
              onClick={onNavigateToOnboarding}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] text-black border border-[#FFFFFF] hover:bg-white hover:text-black transition-colors text-sm font-bold uppercase tracking-wider whitespace-nowrap"
            >
              <Building2 className="w-4 h-4" />
              List Company
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'equities' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Top Performing Companies */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-[#FFFFFF]" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Top African Equities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPaginatedData(displayEquities).map((company: any) => (
                <div 
                  key={company.id}
                  onClick={() => onNavigateToCompany?.(company.id)}
                  className="bg-black border border-white/10 rounded-2xl p-6 hover:border-[#FFFFFF]/50 transition-all duration-300 cursor-pointer group relative overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BrainCircuit className="w-24 h-24 text-[#FFFFFF]" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-black bg-[#FFFFFF] shadow-lg">
                        {company.logo}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-1.5 group-hover:text-[#FFFFFF] transition-colors">
                          {company.ticker}
                          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
                        </h3>
                        <span className="text-xs text-zinc-400">{company.name} • {company.sector}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                      {company.risk} Risk
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-300 mb-6 relative z-10 line-clamp-2 font-medium">{company.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Price</p>
                      <p className="text-sm font-mono font-bold text-white">${company.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/10">
                      <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Growth</p>
                      <p className="text-sm font-mono font-bold text-[#FFFFFF]">{company.revGrowth}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">AI Score:</span>
                      <span className="text-sm font-bold text-[#FFFFFF] font-mono">{company.growthScore}/100</span>
                    </div>
                    <button className="bg-[#FFFFFF] text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-all shadow-md">
                      Trade
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination(displayEquities.length)}
          </div>
        </motion.div>
      )}

      {activeTab === 'commodities' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Coins className="w-5 h-5 text-[#FFFFFF]" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">African Commodities Market</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedData(allCommodities).map((cmd: any) => (
              <div key={cmd.id} className="bg-black border border-white/10 rounded-2xl p-6 hover:border-[#FFFFFF]/50 transition-all group shadow-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                      {cmd.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#FFFFFF] transition-colors">{cmd.name}</h3>
                      <p className="text-xs text-zinc-400">{cmd.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-white">${cmd.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm font-bold font-mono flex items-center justify-end gap-1 text-[#FFFFFF]">
                      {cmd.trend === 'up' ? <TrendingUp className="w-3 h-3 text-[#FFFFFF]" /> : <TrendingDown className="w-3 h-3 text-[#FFFFFF]" />}
                      {cmd.change}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mb-6 font-medium">{cmd.description}</p>
                <div className="flex gap-3">
                  <button className="flex-1 bg-[#FFFFFF] text-black border border-[#FFFFFF] py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors">
                    Buy
                  </button>
                  <button className="flex-1 bg-white/5 text-white border border-white/10 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
          {renderPagination(allCommodities.length)}
        </motion.div>
      )}

      {activeTab === 'products' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedData(allProducts).map((product: any) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -6 }}
                className="bg-black border border-white/10 rounded-3xl overflow-hidden flex flex-col group shadow-2xl relative hover:border-[#FFFFFF]/50 transition-colors"
              >
              <div className="relative h-56 overflow-hidden p-2">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                </div>
                <div className="absolute top-4 left-4 bg-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10">
                  {product.category}
                </div>
                <div className="absolute top-4 right-4 bg-[#FFFFFF] px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1 shadow-lg">
                  <TrendingUp className="w-3 h-3 text-black" />
                  +{product.equity}% Equity
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1 relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FFFFFF] transition-colors leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1 text-[#FFFFFF] text-sm bg-[#FFFFFF]/10 px-2 py-1 rounded-lg border border-[#FFFFFF]/20">
                    <Star className="w-3.5 h-3.5 fill-current text-[#FFFFFF]" />
                    <span className="font-bold text-[#FFFFFF] font-mono">{product.rating}</span>
                  </div>
                </div>
                <p className="text-zinc-300 text-sm mb-6 flex-1 leading-relaxed font-medium">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider font-bold">Price</p>
                    <p className="text-2xl font-bold font-mono text-white tracking-tight">${product.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="bg-[#FFFFFF] text-black px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center gap-2 hover:bg-white hover:text-black shadow-lg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy & Earn
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
          {renderPagination(allProducts.length)}
        </motion.div>
      )}

      {/* Product -> Equity Converter Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            key="product-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div 
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-black border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-[#FFFFFF]" />
              
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF]/10 border border-[#FFFFFF]/20 flex items-center justify-center text-[#FFFFFF]">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">Investment Summary</h2>
                <p className="text-zinc-400 text-sm mb-8 font-medium">Review your product purchase and equity allocation.</p>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <span className="text-zinc-400 text-sm">You are purchasing:</span>
                    <span className="font-bold text-white">{selectedProduct.name}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                    <span className="text-zinc-400 text-sm">Value:</span>
                    <span className="font-bold font-mono text-white">${selectedProduct.price.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-2xl bg-[#FFFFFF]/10 border border-[#FFFFFF]/20">
                    <span className="text-[#FFFFFF] text-sm font-bold uppercase tracking-wider">Equity Earned:</span>
                    <span className="font-bold text-[#FFFFFF] text-lg font-mono">+{selectedProduct.equity}%</span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Quarterly Return (Est.):</span>
                    <span className="font-bold text-white text-lg font-mono">${selectedProduct.estReturn}</span>
                  </div>
                </div>

                <button className="w-full bg-[#FFFFFF] text-black py-4 rounded-2xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white hover:text-black shadow-2xl">
                  Confirm Investment <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-zinc-500 mt-4">
                  By confirming, you agree to the AQX Equity Terms of Service.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
