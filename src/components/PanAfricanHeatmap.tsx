import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { X, TrendingUp, TrendingDown, Activity, BarChart2, DollarSign, Globe, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// African countries ISO 3166-1 alpha-3 codes
const africanCountries = [
  "DZA", "AGO", "BEN", "BWA", "BFA", "BDI", "CPV", "CMR", "CAF", "TCD", "COM", "COG", "COD",
  "DJI", "EGY", "GNQ", "ERI", "SWZ", "ETH", "GAB", "GMB", "GHA", "GIN", "GNB", "CIV", "KEN",
  "LSO", "LBR", "LBY", "MDG", "MWI", "MLI", "MRT", "MUS", "MAR", "MOZ", "NAM", "NER", "NGA",
  "RWA", "STP", "SEN", "SYC", "SLE", "SOM", "ZAF", "SSD", "SDN", "TZA", "TGO", "UGA", "ZMB", "ZWE"
];

const generateChartData = (baseValue: number, trend: number) => {
  const data = [];
  let currentValue = baseValue * 0.9; // Start a bit lower
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * (baseValue * 0.02) + (trend > 0 ? baseValue * 0.005 : -baseValue * 0.005);
    currentValue += change;
    data.push({ value: currentValue });
  }
  data.push({ value: baseValue }); // End at current value
  return data;
};

const initialExchangeData: Record<string, any> = {
  "ZAF": { name: "South Africa", exchange: "JSE", index: "JSE Top 40", value: 74521.30, change: 1.2, volume: "12.4B ZAR", active: true, chartData: generateChartData(74521.30, 1.2) },
  "NGA": { name: "Nigeria", exchange: "AQX", index: "AQX All-Share", value: 104562.10, change: -0.5, volume: "4.2B NGN", active: true, chartData: generateChartData(104562.10, -0.5) },
  "KEN": { name: "Kenya", exchange: "NSE", index: "NSE 20", value: 1524.80, change: 0.8, volume: "850M KES", active: true, chartData: generateChartData(1524.80, 0.8) },
  "EGY": { name: "Egypt", exchange: "EGX", index: "EGX 30", value: 28451.20, change: 2.1, volume: "3.1B EGP", active: true, chartData: generateChartData(28451.20, 2.1) },
  "MAR": { name: "Morocco", exchange: "CSE", index: "MASI", value: 13245.60, change: 0.3, volume: "1.2B MAD", active: true, chartData: generateChartData(13245.60, 0.3) },
  "MUS": { name: "Mauritius", exchange: "SEM", index: "SEMDEX", value: 2145.30, change: 0.1, volume: "45M MUR", active: true, chartData: generateChartData(2145.30, 0.1) },
  "CIV": { name: "Ivory Coast", exchange: "BRVM", index: "BRVM Composite", value: 215.40, change: -0.2, volume: "1.1B XOF", active: true, chartData: generateChartData(215.40, -0.2) },
  "GHA": { name: "Ghana", exchange: "GSE", index: "GSE Composite", value: 3452.10, change: 0.5, volume: "25M GHS", active: true, chartData: generateChartData(3452.10, 0.5) },
  "BWA": { name: "Botswana", exchange: "BSE", index: "BSE DCI", value: 8945.20, change: 0.0, volume: "12M BWP", active: true, chartData: generateChartData(8945.20, 0.0) },
  "NAM": { name: "Namibia", exchange: "NSX", index: "NSX Overall", value: 1654.80, change: 0.4, volume: "8M NAD", active: true, chartData: generateChartData(1654.80, 0.4) },
  "TZA": { name: "Tanzania", exchange: "DSE", index: "DSE All Share", value: 1845.20, change: 0.2, volume: "150M TZS", active: true, chartData: generateChartData(1845.20, 0.2) },
  "UGA": { name: "Uganda", exchange: "USE", index: "USE All Share", value: 1245.60, change: -0.1, volume: "450M UGX", active: true, chartData: generateChartData(1245.60, -0.1) },
  "ZMB": { name: "Zambia", exchange: "LuSE", index: "LuSE All Share", value: 7845.20, change: 0.6, volume: "5M ZMW", active: true, chartData: generateChartData(7845.20, 0.6) },
  "RWA": { name: "Rwanda", exchange: "RSE", index: "RSI", value: 145.20, change: 0.0, volume: "2M RWF", active: true, chartData: generateChartData(145.20, 0.0) },
  "MWI": { name: "Malawi", exchange: "MSE", index: "MASI", value: 112450.20, change: 0.3, volume: "15M MWK", active: true, chartData: generateChartData(112450.20, 0.3) },
  "ZWE": { name: "Zimbabwe", exchange: "ZSE", index: "ZSE All Share", value: 545210.30, change: 4.5, volume: "1.2B ZWL", active: true, chartData: generateChartData(545210.30, 4.5) },
};

const colorScale = scaleLinear<string>()
  .domain([-2, 0, 2])
  .range(["#ef4444", "#0A0A0A", "#00FFB2"]);

export function PanAfricanHeatmap() {
  const [exchangeData, setExchangeData] = useState(initialExchangeData);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeData(prevData => {
        const newData = { ...prevData };
        Object.keys(newData).forEach(key => {
          const market = newData[key];
          
          // Simulate real-time price changes (0.1% volatility)
          const volatility = market.value * 0.001;
          const changeAmount = (Math.random() - 0.5) * volatility;
          const newValue = market.value + changeAmount;
          
          // Calculate new percentage change
          const baseValue = market.value / (1 + market.change / 100);
          const newChange = ((newValue - baseValue) / baseValue) * 100;

          // Update chart data
          const newChartData = [...market.chartData.slice(1), { value: newValue }];

          newData[key] = {
            ...market,
            value: newValue,
            change: Number(newChange.toFixed(2)),
            chartData: newChartData
          };
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (geo: any) => {
    if (exchangeData[geo.id]) {
      setSelectedCountry(geo.id);
    }
  };

  const selectedData = selectedCountry ? exchangeData[selectedCountry] : null;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-6">
      {/* Map Container */}
      <div className="flex-1 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-4 relative overflow-hidden min-h-[400px] lg:min-h-[600px] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#FFFFFF]" />
            Live Market Heatmap
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFB2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFB2]"></span>
            </span>
          </h3>
          <p className="text-xs text-[#00FFB2]/80 mt-1 uppercase tracking-wider">Click on active markets to view details</p>
        </div>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#FF3B3B]"></div> Bearish</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#0A0A0A] border border-white/20"></div> Neutral</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#00FFB2]"></div> Bullish</div>
          <div className="flex items-center gap-1 ml-2"><div className="w-3 h-3 rounded-full bg-[#111] border border-white/10"></div> Inactive</div>
        </div>

        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-20, -5, 0],
            scale: 480
          }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter(geo => africanCountries.includes(geo.id))
                .map(geo => {
                  const data = exchangeData[geo.id];
                  const isHovered = hoveredCountry === geo.id;
                  const isSelected = selectedCountry === geo.id;
                  
                  let fillColor = "#0A0A0A"; // Default dark
                  if (data) {
                    fillColor = colorScale(data.change) as string;
                  } else {
                    fillColor = "#111111"; // Inactive
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (data) setHoveredCountry(geo.id);
                      }}
                      onMouseLeave={() => {
                        setHoveredCountry(null);
                      }}
                      onClick={() => handleCountryClick(geo)}
                      style={{
                        default: {
                          fill: isSelected ? "#FFFFFF" : fillColor,
                          stroke: "#333333",
                          strokeWidth: 0.5,
                          outline: "none",
                          transition: "all 250ms"
                        },
                        hover: {
                          fill: data ? "#FFFFFF" : fillColor,
                          stroke: "#666666",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: data ? "pointer" : "default",
                          transition: "all 250ms"
                        },
                        pressed: {
                          fill: "#8A7322",
                          stroke: "#999999",
                          strokeWidth: 1,
                          outline: "none",
                        }
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredCountry && exchangeData[hoveredCountry] && !selectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0B0F14]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl pointer-events-none flex items-center gap-4"
            >
              <div>
                <div className="text-sm font-bold text-white">{exchangeData[hoveredCountry].name}</div>
                <div className="text-xs text-zinc-400">{exchangeData[hoveredCountry].exchange}</div>
              </div>
              <div className={`text-sm font-bold flex items-center gap-1 ${exchangeData[hoveredCountry].change >= 0 ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                {exchangeData[hoveredCountry].change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {exchangeData[hoveredCountry].change > 0 ? '+' : ''}{exchangeData[hoveredCountry].change}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drill-down Panel */}
      <AnimatePresence mode="wait">
        {selectedData ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '350px' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{selectedData.name}</h3>
                <p className="text-sm text-[#FFFFFF] uppercase tracking-wider">{selectedData.exchange} Exchange</p>
              </div>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              {/* Main Index Performance */}
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                <div className="text-sm text-zinc-400 mb-1 uppercase tracking-wider">{selectedData.index}</div>
                <div className="flex items-end justify-between mb-4">
                  <div className="text-2xl font-bold text-white">
                    {selectedData.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${selectedData.change >= 0 ? 'text-[#00C896]' : 'text-[#FF3B3B]'}`}>
                    {selectedData.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {selectedData.change > 0 ? '+' : ''}{selectedData.change}%
                  </div>
                </div>
                
                {/* Mini Chart */}
                <div className="h-24 w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedData.chartData}>
                      <defs>
                        <linearGradient id={`colorValue${selectedData.change >= 0 ? 'Up' : 'Down'}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedData.change >= 0 ? '#00FFB2' : '#ef4444'} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={selectedData.change >= 0 ? '#00FFB2' : '#ef4444'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={selectedData.change >= 0 ? '#00FFB2' : '#ef4444'} 
                        fillOpacity={1} 
                        fill={`url(#colorValue${selectedData.change >= 0 ? 'Up' : 'Down'})`} 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Market Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 shadow-[inset_0_0_10px_rgba(255,255,255,0.01)]">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <Activity className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-xs font-medium uppercase tracking-wider">Volume</span>
                  </div>
                  <div className="text-sm font-semibold text-white">{selectedData.volume}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 shadow-[inset_0_0_10px_rgba(255,255,255,0.01)]">
                  <div className="flex items-center gap-2 text-zinc-400 mb-2">
                    <DollarSign className="w-4 h-4 text-[#FFFFFF]" />
                    <span className="text-xs font-medium uppercase tracking-wider">Status</span>
                  </div>
                  <div className="text-sm font-semibold text-[#00FFB2] flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse shadow-[0_0_10px_rgba(0,255,178,0.8)]"></div>
                    Market Open
                  </div>
                </div>
              </div>

              {/* Top Movers (Mocked based on country) */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                  <BarChart2 className="w-4 h-4 text-[#FFFFFF]" />
                  Top Movers
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-white/[0.05] rounded-lg transition-colors border border-transparent hover:border-white/5">
                      <div>
                        <div className="text-sm font-medium text-white">TKR{i}</div>
                        <div className="text-xs text-zinc-500">Company {i}</div>
                      </div>
                      <div className={`text-sm font-medium ${i === 3 ? 'text-[#FF3B3B]' : 'text-[#00C896]'}`}>
                        {i === 3 ? '-' : '+'}{(Math.random() * 5).toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-[#0066FF]/10 border border-[#0066FF]/20 rounded-xl p-4 shadow-[inset_0_0_20px_rgba(0,102,255,0.05)]">
                <h4 className="text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  AI Market Insight
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedData.change > 0 
                    ? `Strong buying momentum detected in ${selectedData.name}'s financial sector. Institutional inflows are driving the ${selectedData.index} higher.`
                    : `Profit-taking observed across major caps in ${selectedData.name}. Market sentiment remains cautious pending upcoming macroeconomic data.`}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '350px' }}
            exit={{ opacity: 0, width: 0 }}
            className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center p-8 text-center shrink-0 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFFFFF]/20 to-transparent flex items-center justify-center mb-4 border border-[#FFFFFF]/30">
              <Globe className="w-8 h-8 text-[#FFFFFF]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">Select a Market</h3>
            <p className="text-sm text-zinc-400">Click on any highlighted country on the map to view detailed exchange performance and AI insights.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
