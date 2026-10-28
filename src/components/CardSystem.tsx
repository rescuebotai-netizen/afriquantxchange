import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  CreditCard, Smartphone, ShieldCheck, Settings, Eye, EyeOff, 
  Snowflake, ArrowRightLeft, Globe, Lock, Zap, ChevronLeft,
  CheckCircle2, Palette, Sparkles, Fingerprint, CreditCard as CardIcon,
  Image as ImageIcon, Plus, Activity, PieChart, Bitcoin, Type, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { WhopCardFundModal } from './WhopCardFundModal';

interface CardSystemProps {
  onBack: () => void;
}

const themes = [
  { id: 'midnight', name: 'Midnight Black', color: 'from-zinc-800 to-zinc-950', border: 'border-zinc-700/50' },
  { id: 'ocean', name: 'Ocean Blue', color: 'from-blue-600 to-blue-900', border: 'border-blue-500/50' },
  { id: 'gold', name: 'Royal Gold', color: 'from-amber-500 to-yellow-700', border: 'border-yellow-500/50' },
  { id: 'neon', name: 'Neon AI', color: 'from-fuchsia-600 to-purple-900', border: 'border-fuchsia-500/50' },
  { id: 'afrotech', name: 'AfroTech', color: 'from-emerald-600 to-teal-900', border: 'border-emerald-500/50' },
];

const renderGraphic = (type: string, opacity: number) => {
  const opacityClass = `opacity-[${opacity/100}]`;
  switch (type) {
    case 'chart':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-white mix-blend-overlay" style={{ opacity: opacity / 100 }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path 
            d="M0,80 L10,70 L20,75 L30,50 L40,60 L50,30 L60,40 L70,10 L80,20 L90,5 L100,15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path 
            d="M0,80 L10,70 L20,75 L30,50 L40,60 L50,30 L60,40 L70,10 L80,20 L90,5 L100,15 L100,100 L0,100 Z" 
            fill="currentColor" 
            opacity="0.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </svg>
      );
    case 'candles':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-white mix-blend-overlay" style={{ opacity: opacity / 100 }} preserveAspectRatio="none" viewBox="0 0 100 100">
          {[10, 30, 50, 70, 90].map((x, i) => (
            <motion.g 
              key={x}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <line x1={x} y1={20 + (i * 5)} x2={x} y2={80 - (i * 2)} stroke="currentColor" strokeWidth="1" />
              <rect x={x - 2} y={30 + (i * 5)} width="4" height={30} fill="currentColor" />
            </motion.g>
          ))}
        </svg>
      );
    case 'waves':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-white mix-blend-overlay" style={{ opacity: opacity / 100 }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <motion.path 
            d="M0,50 Q25,20 50,50 T100,50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            animate={{ d: ["M0,50 Q25,20 50,50 T100,50", "M0,50 Q25,80 50,50 T100,50", "M0,50 Q25,20 50,50 T100,50"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path 
            d="M0,60 Q25,30 50,60 T100,60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.5"
            animate={{ d: ["M0,60 Q25,30 50,60 T100,60", "M0,60 Q25,90 50,60 T100,60", "M0,60 Q25,30 50,60 T100,60"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.path 
            d="M0,70 Q25,40 50,70 T100,70" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.25" 
            opacity="0.2"
            animate={{ d: ["M0,70 Q25,40 50,70 T100,70", "M0,70 Q25,100 50,70 T100,70", "M0,70 Q25,40 50,70 T100,70"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </svg>
      );
    case 'grid':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none text-white mix-blend-overlay" style={{ opacity: opacity / 100 }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
          <motion.rect 
            width="100" 
            height="100" 
            fill="url(#grid)" 
            animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            opacity="0.5"
          />
        </svg>
      );
    default:
      return null;
  }
};

const renderTexture = (type: string) => {
  switch (type) {
    case 'matte':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay pointer-events-none">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      );
    case 'brushed':
      return <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none" />;
    case 'glass':
      return <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl pointer-events-none" />;
    case 'carbon':
      return <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" />;
    case 'afrotech':
      return (
        <svg className="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay pointer-events-none text-white" preserveAspectRatio="none" viewBox="0 0 100 100">
          <pattern id="afrotech" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0,10 L10,0 L20,10 L10,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill="url(#afrotech)" />
        </svg>
      );
    default:
      return null;
  }
};

export function CardSystem({ onBack }: CardSystemProps) {
  const [activeTab, setActiveTab] = useState('virtual');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [orderStep, setOrderStep] = useState(0); // 0: not ordering, 1: design, 2: confirm, 3: success
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  
  // Customization state
  const [creationStep, setCreationStep] = useState<'customize' | 'success'>('customize');
  const [newCardName, setNewCardName] = useState('YOUR NAME');
  const [newCardGraphic, setNewCardGraphic] = useState('waves'); // 'chart', 'candles', 'waves', 'grid', 'none'
  const [newCardTexture, setNewCardTexture] = useState('matte'); // 'matte', 'brushed', 'glass', 'carbon', 'afrotech'
  const [newCardColor, setNewCardColor] = useState(themes[0]);
  const [newCardFont, setNewCardFont] = useState('font-sans'); // 'font-sans', 'font-serif', 'font-mono'
  const [newCardAlign, setNewCardAlign] = useState('text-left'); // 'text-left', 'text-center', 'text-right'
  const [newCardSpacing, setNewCardSpacing] = useState('tracking-widest'); // 'tracking-tight', 'tracking-normal', 'tracking-widest'
  const [newCardTextColor, setNewCardTextColor] = useState('text-white');
  const [newCardTextSize, setNewCardTextSize] = useState('text-sm');
  const [newCardGraphicOpacity, setNewCardGraphicOpacity] = useState(20);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWhopFundModal, setShowWhopFundModal] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  // Combine the flip rotation with the hover rotation
  const combinedRotateY = useTransform(rotateY, (val) => {
    return isFlipped ? `calc(180deg + ${val})` : val;
  });

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "-100%"]);
  const parallaxX = useTransform(mouseXSpring, [-0.5, 0.5], [10, -10]);
  const parallaxY = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cards = [
    { id: '1', type: 'Virtual USD', balance: '$12,450.00', last4: '4821', theme: selectedTheme },
    { id: '2', type: 'Virtual EUR', balance: '€8,200.00', last4: '9021', theme: themes[1] },
    { id: '3', type: 'Crypto Spend', balance: '2.45 ETH', last4: '4532', theme: themes[3] },
  ];

  const activeCard = cards[currentCardIndex];
  const displayTheme = currentCardIndex === 0 ? selectedTheme : activeCard.theme;

  const handleFlip = () => setIsFlipped(!isFlipped);

  if (isCreatingCard) {
    if (creationStep === 'customize') {
      return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
          {/* Left: 3D Preview */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              className="relative perspective-1000 w-full max-w-md mx-auto aspect-[1.586/1]"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                className="w-full h-full relative preserve-3d cursor-pointer"
                style={{ rotateX, rotateY }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={handleFlip}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
                >
                  {/* Front */}
                  <div className={cn(
                    "absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between shadow-2xl border overflow-hidden",
                    "bg-gradient-to-br", newCardColor.color, newCardColor.border
                  )}>
                    {renderTexture(newCardTexture)}
                    {renderGraphic(newCardGraphic, newCardGraphicOpacity)}
                    
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none"
                      style={{ x: glareX, y: glareY }}
                    />

                    <motion.div style={{ x: parallaxX, y: parallaxY }} className="relative z-10 flex justify-between items-start">
                      <span className={cn("font-bold tracking-wider text-lg", newCardTextColor)}>NXG Wallet</span>
                      <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                        <span className="text-white font-bold italic text-xs">VISA</span>
                      </div>
                    </motion.div>

                    <motion.div style={{ x: parallaxX, y: parallaxY }} className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-90 shadow-sm" />
                      </div>
                      <div className={cn("h-8 flex items-center", newCardAlign)}>
                        <p className={cn("text-2xl drop-shadow-md w-full", newCardFont, newCardSpacing, newCardTextColor)}>
                          •••• •••• •••• 1234
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className={cn("font-medium uppercase drop-shadow-md", newCardFont, newCardSpacing, newCardTextColor, newCardTextSize)}>
                          {newCardName || 'YOUR NAME'}
                        </p>
                        <div className="text-right">
                          <p className={cn("text-[10px] uppercase font-semibold opacity-60", newCardTextColor)}>Valid Thru</p>
                          <p className={cn("drop-shadow-md", newCardFont, newCardSpacing, newCardTextColor, newCardTextSize)}>12/29</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Back */}
                  <div 
                    className={cn(
                      "absolute inset-0 backface-hidden rounded-2xl flex flex-col shadow-2xl border overflow-hidden",
                      "bg-gradient-to-br", newCardColor.color, newCardColor.border
                    )}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    {renderTexture(newCardTexture)}
                    
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-none" />
                    <div className="w-full h-12 bg-black/80 mt-6 relative z-10" />
                    <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded p-3 flex justify-between items-center backdrop-blur-sm border border-white/5">
                          <span className="text-white/50 text-xs uppercase tracking-wider">CVV</span>
                          <span className={cn("text-white tracking-widest", newCardFont)}>***</span>
                        </div>
                      </div>
                      <p className="text-white/30 text-[8px] text-center uppercase tracking-widest">
                        Issued by NXG Financial Services.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right: Customization Controls */}
          <div className="flex-1 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-400" />
                Customize Card
              </h3>
              
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Full Name</label>
                  <input 
                    type="text" 
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    placeholder="YOUR NAME"
                    maxLength={22}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors uppercase"
                  />
                </div>

                {/* Finance Graphics */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-sm text-zinc-400 block">Finance Graphic</label>
                    {newCardGraphic !== 'none' && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500">Opacity</label>
                        <input 
                          type="range" 
                          min="5" 
                          max="100" 
                          value={newCardGraphicOpacity} 
                          onChange={(e) => setNewCardGraphicOpacity(Number(e.target.value))}
                          className="w-20 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'chart', label: 'Line Chart' },
                      { id: 'candles', label: 'Candlesticks' },
                      { id: 'waves', label: 'Market Waves' },
                      { id: 'grid', label: 'Data Grid' },
                    ].map(g => (
                      <button
                        key={g.id}
                        onClick={() => setNewCardGraphic(g.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                          newCardGraphic === g.id ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textures */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Texture & Material</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'matte', label: 'Matte' },
                      { id: 'brushed', label: 'Brushed Metal' },
                      { id: 'glass', label: 'Frosted Glass' },
                      { id: 'carbon', label: 'Carbon Fiber' },
                      { id: 'afrotech', label: 'AfroTech' },
                    ].map(tex => (
                      <button
                        key={tex.id}
                        onClick={() => setNewCardTexture(tex.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                          newCardTexture === tex.id ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {tex.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Color Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {themes.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setNewCardColor(theme)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                          newCardColor.id === theme.id ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Text Color</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'text-white', label: 'White' },
                      { id: 'text-zinc-900', label: 'Black' },
                      { id: 'text-amber-400', label: 'Gold' },
                    ].map(color => (
                      <button
                        key={color.id}
                        onClick={() => setNewCardTextColor(color.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all border flex-1",
                          newCardTextColor === color.id ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300"
                        )}
                      >
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format Text */}
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Typography</label>
                  <div className="flex gap-2 mb-3">
                    {[
                      { id: 'font-sans', label: 'Modern' },
                      { id: 'font-serif', label: 'Elegant' },
                      { id: 'font-mono', label: 'Tech' },
                    ].map(font => (
                      <button
                        key={font.id}
                        onClick={() => setNewCardFont(font.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all border flex-1",
                          newCardFont === font.id ? "bg-white/10 border-white/20 text-white" : "bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300",
                          font.id
                        )}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-zinc-500 mb-2 block">Alignment</label>
                      <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                        {[
                          { id: 'text-left', label: 'Left' },
                          { id: 'text-center', label: 'Center' },
                          { id: 'text-right', label: 'Right' },
                        ].map(align => (
                          <button
                            key={align.id}
                            onClick={() => setNewCardAlign(align.id)}
                            className={cn(
                              "px-2 py-1.5 rounded text-xs font-medium transition-all flex-1",
                              newCardAlign === align.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                          >
                            {align.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-zinc-500 mb-2 block">Spacing</label>
                      <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                        {[
                          { id: 'tracking-tight', label: 'Tight' },
                          { id: 'tracking-normal', label: 'Normal' },
                          { id: 'tracking-widest', label: 'Wide' },
                        ].map(spacing => (
                          <button
                            key={spacing.id}
                            onClick={() => setNewCardSpacing(spacing.id)}
                            className={cn(
                              "px-2 py-1.5 rounded text-xs font-medium transition-all flex-1",
                              newCardSpacing === spacing.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                          >
                            {spacing.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="text-xs text-zinc-500 mb-2 block">Size</label>
                    <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                      {[
                        { id: 'text-xs', label: 'Small' },
                        { id: 'text-sm', label: 'Medium' },
                        { id: 'text-base', label: 'Large' },
                      ].map(size => (
                        <button
                          key={size.id}
                          onClick={() => setNewCardTextSize(size.id)}
                          className={cn(
                            "px-2 py-1.5 rounded text-xs font-medium transition-all flex-1",
                            newCardTextSize === size.id ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                          )}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                title="Delete/Reset"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                className="flex-1 py-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button 
                onClick={() => setCreationStep('success')}
                className="flex-[2] py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Create Card
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Success Step
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <motion.div
          className="relative perspective-1000 w-full max-w-md aspect-[1.586/1] mb-12"
          initial={{ scale: 1.2, y: -50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="w-full h-full relative preserve-3d"
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
          >
            {/* Blank Metal Slab */}
            <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-2xl border border-zinc-400 overflow-hidden flex items-center justify-center">
              
              {/* Laser Etching Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent w-[200%]"
                initial={{ x: '-100%' }}
                animate={{ x: '50%' }}
                transition={{ duration: 1.5, delay: 0.8, ease: "linear" }}
                style={{ mixBlendMode: 'overlay' }}
              />
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="relative z-10 text-center"
              >
                <span className="text-zinc-700 font-bold tracking-widest text-xl">NXG Wallet</span>
              </motion.div>
            </div>

            {/* Back of Card */}
            <div 
              className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-2xl border border-zinc-400 overflow-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="w-full h-12 bg-black/80 mt-6 relative z-10" />
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between mt-4">
                <div className="bg-white/50 rounded p-3 flex justify-between items-center">
                  <span className="text-zinc-600 text-xs uppercase tracking-wider">CVV</span>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-zinc-800 font-mono tracking-widest"
                  >
                    ***
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Card Created Successfully</h2>
          <p className="text-zinc-400 mb-8">Your new virtual card is ready to use.</p>
          <button 
            onClick={() => {
              setIsCreatingCard(false);
              setCreationStep('customize');
            }}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
          >
            Go to Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  const renderVirtualCard = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Card Display & Quick Actions */}
      <div className="flex-1 space-y-8">
        <div 
          className="relative perspective-1000 w-full max-w-md mx-auto aspect-[1.586/1]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {cards.map((card, index) => {
            const isActive = index === currentCardIndex;
            const offset = index - currentCardIndex;
            const zIndex = 10 - Math.abs(offset);
            const scale = isActive ? 1 : 0.92;
            const translateX = offset * 110; // 110% width
            const opacity = Math.abs(offset) > 1 ? 0 : 1;
            const blur = isActive ? 'blur(0px)' : 'blur(4px)';
            const theme = index === 0 ? selectedTheme : card.theme;

            return (
              <motion.div
                key={card.id}
                className="absolute inset-0 cursor-pointer preserve-3d"
                style={{ 
                  zIndex,
                  rotateX: isActive ? rotateX : 0, 
                  rotateY: isActive ? rotateY : 0 
                }}
                animate={{ 
                  scale, 
                  x: `${translateX}%`, 
                  opacity,
                  filter: blur
                }}
                whileHover={isActive ? { scale: 1.03 } : {}}
                whileTap={isActive ? { scale: 0.97 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (isActive) {
                    handleFlip();
                  } else {
                    setCurrentCardIndex(index);
                    setIsFlipped(false);
                  }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  if (swipe < -50 && currentCardIndex < cards.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1);
                    setIsFlipped(false);
                  } else if (swipe > 50 && currentCardIndex > 0) {
                    setCurrentCardIndex(currentCardIndex - 1);
                    setIsFlipped(false);
                  }
                }}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d"
                  animate={{ rotateY: isActive && isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0.2, 0.2, 1] }}
                >
                  {/* Front of Card */}
                  <div className={cn(
                    "absolute inset-0 backface-hidden rounded-2xl p-6 flex flex-col justify-between shadow-2xl border overflow-hidden",
                    "bg-gradient-to-br", theme.color, theme.border
                  )}>
                    {/* Animated Gradient Background */}
                    <motion.div 
                      className="absolute inset-0 opacity-50 mix-blend-overlay"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      style={{
                        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 50%)',
                        backgroundSize: '200% 200%'
                      }}
                    />
                    
                    {/* Glassmorphism overlays */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                    
                    {/* Light Reflection (Hover) */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                      style={{
                        x: isActive ? glareX : 0,
                        y: isActive ? glareY : 0,
                      }}
                    />

                    {/* Light Sweep (Idle) */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                      animate={{
                        x: ['-200%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "easeInOut"
                      }}
                    />

                    <motion.div style={{ x: isActive ? parallaxX : 0, y: isActive ? parallaxY : 0 }} className="relative z-10 flex justify-between items-start">
                      <span className="text-white/90 font-bold tracking-wider text-lg">NXG Wallet</span>
                      <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                        <span className="text-white font-bold italic text-xs">VISA</span>
                      </div>
                    </motion.div>

                    <motion.div style={{ x: isActive ? parallaxX : 0, y: isActive ? parallaxY : 0 }} className="relative z-10 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md opacity-90 shadow-sm" /> {/* Chip */}
                        <Zap className="w-5 h-5 text-white/50" />
                      </div>
                      <div className="h-8 flex items-center">
                        <AnimatePresence mode="wait">
                          {showDetails && isActive ? (
                            <motion.p 
                              key="details"
                              initial={{ opacity: 0, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, filter: 'blur(4px)' }}
                              transition={{ duration: 0.3 }}
                              className="text-white/90 font-mono text-2xl tracking-[0.15em] drop-shadow-md"
                            >
                              4821 9021 4532 {card.last4}
                            </motion.p>
                          ) : (
                            <motion.p 
                              key="hidden"
                              initial={{ opacity: 0, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, filter: 'blur(4px)' }}
                              transition={{ duration: 0.3 }}
                              className="text-white/90 font-mono text-2xl tracking-[0.15em] drop-shadow-md"
                            >
                              •••• •••• •••• {card.last4}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-white/90 font-medium tracking-widest uppercase text-sm drop-shadow-md">Alex Thompson</p>
                        <div className="text-right">
                          <p className="text-white/50 text-[10px] uppercase font-semibold">Valid Thru</p>
                          <p className="text-white/90 font-mono text-sm drop-shadow-md">12/29</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Back of Card */}
                  <div 
                    className={cn(
                      "absolute inset-0 backface-hidden rounded-2xl flex flex-col shadow-2xl border overflow-hidden",
                      "bg-gradient-to-br", theme.color, theme.border
                    )}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                    <div className="w-full h-12 bg-black/80 mt-6 relative z-10" />
                    <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded p-3 flex justify-between items-center backdrop-blur-sm border border-white/5">
                          <span className="text-white/50 text-xs uppercase tracking-wider">CVV</span>
                          <div className="flex items-center gap-3">
                            <AnimatePresence mode="wait">
                              {showDetails && isActive ? (
                                <motion.span 
                                  key="cvv-show"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-white font-mono tracking-widest"
                                >
                                  842
                                </motion.span>
                              ) : (
                                <motion.span 
                                  key="cvv-hide"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  className="text-white font-mono tracking-widest"
                                >
                                  •••
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {showDetails && isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Tokenized ID</p>
                          <p className="text-white/60 font-mono text-xs">tok_nx_9821...441</p>
                        </div>
                      </div>
                      <p className="text-white/30 text-[8px] text-center uppercase tracking-widest">
                        Issued by NXG Financial Services. Call 1-800-NXG-CARD if found.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Card Pagination & Balance */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2 items-center">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCardIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  currentCardIndex === idx ? "bg-white w-4" : "bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
            <button 
              onClick={() => setIsCreatingCard(true)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center ml-2 transition-colors"
            >
              <Plus className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <p className="text-zinc-400 text-sm mb-1">{activeCard.type} Balance</p>
            <h2 className="text-3xl font-bold text-white">{activeCard.balance}</h2>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 max-w-md mx-auto">
          <button
            onClick={() => setShowWhopFundModal(true)}
            className="w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            Fund Card via Whop API (Africa, America, Asia, Europe)
          </button>

          <div className="grid grid-cols-5 gap-3">
            <button 
              onClick={() => setIsFrozen(!isFrozen)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all",
                isFrozen ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400"
              )}
            >
              <Snowflake className="w-5 h-5" />
              <span className="text-xs font-medium text-center">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
            </button>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 transition-all"
            >
              {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="text-xs font-medium text-center">{showDetails ? 'Hide' : 'Details'}</span>
            </button>
            <button 
              onClick={() => setShowWhopFundModal(true)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-400 transition-all"
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs font-medium text-center">Fund Card</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 transition-all">
              <ArrowRightLeft className="w-5 h-5" />
              <span className="text-xs font-medium text-center">Convert</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 transition-all">
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-medium text-center">Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Controls & Personalisation */}
      <div className="flex-1 space-y-6">
        {/* Personalisation Engine */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            Card Identity
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Theme</label>
              <div className="flex flex-wrap gap-2">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                      selectedTheme.id === theme.id 
                        ? "bg-white/10 border-white/20 text-white" 
                        : "bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <label className="text-sm text-zinc-400 mb-2 block">Card Finish</label>
              <div className="flex gap-2">
                {['Matte', 'Metallic', 'Glass'].map(finish => (
                  <button
                    key={finish}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border bg-transparent border-white/5 text-zinc-500 hover:text-zinc-300 focus:bg-white/10 focus:border-white/20 focus:text-white"
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <label className="text-sm text-zinc-400 mb-2 block">Dynamic Features</label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-zinc-300">React to Portfolio Performance</span>
                  </div>
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-zinc-300">Biometric CVV Reveal</span>
                  </div>
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </label>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <label className="text-sm text-zinc-400 mb-2 block">NFT Integration</label>
              <button className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm text-zinc-300">
                <ImageIcon className="w-4 h-4" />
                Use Owned NFT as Background
              </button>
            </div>
          </div>
        </div>

        {/* Card Controls */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Security & Controls
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              {[
                { icon: Globe, label: 'Online Transactions', active: true },
                { icon: Smartphone, label: 'Contactless Payments', active: true },
                { icon: Lock, label: 'Geo-Restrictions', active: false },
                { icon: ArrowRightLeft, label: 'Auto Crypto-to-Fiat Conversion', active: true },
              ].map((control, idx) => (
                <label key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <control.icon className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-300">{control.label}</span>
                  </div>
                  <div className={cn("w-10 h-5 rounded-full relative transition-colors", control.active ? "bg-blue-500" : "bg-zinc-700")}>
                    <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", control.active ? "right-1" : "left-1")} />
                  </div>
                </label>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-zinc-400">Monthly Spending Limit</label>
                <span className="text-sm text-white font-medium">$5,000 / $10,000</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-1/2 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Spending Insights
            </h3>
            <p className="text-sm text-zinc-300 mb-3">
              "You spent 12% more this week. Optimize your spending by converting 0.5 ETH to Fiat now to capture the current premium."
            </p>
            <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View Detailed Analysis &rarr;
            </button>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Fraud Alert
            </h3>
            <p className="text-sm text-zinc-300 mb-3">
              Suspicious transaction detected: $450.00 at BestBuy, NY. Was this you?
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/30 transition-colors">
                No, Freeze Card
              </button>
              <button className="px-4 py-2 bg-white/5 text-zinc-300 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors">
                Yes, It Was Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhysicalCardOrder = () => {
    if (orderStep === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center max-w-2xl mx-auto">
          <div className="w-64 h-40 perspective-1000 mx-auto mb-8">
            <motion.div 
              className="w-full h-full relative preserve-3d"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
                <div className="w-8 h-6 bg-zinc-700 rounded-sm absolute left-6 top-1/2 -translate-y-1/2 opacity-50" />
                <span className="text-zinc-500 font-bold tracking-widest absolute bottom-4 right-4 text-xs">NXG</span>
              </div>
              <div className="absolute inset-0 backface-hidden rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl" style={{ transform: 'rotateY(180deg)' }}>
                <div className="w-full h-8 bg-black mt-4" />
              </div>
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Get the NXG Physical Card</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            A premium, minimalist matte black card. NFC-enabled, no visible numbers on the front. Connects directly to your multi-asset wallet.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">Secure</h4>
              <p className="text-xs text-zinc-500">Numberless design, manage via app</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">Global</h4>
              <p className="text-xs text-zinc-500">Accepted worldwide via VISA network</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h4 className="text-white font-medium mb-1">Smart</h4>
              <p className="text-xs text-zinc-500">Auto-converts crypto at point of sale</p>
            </div>
          </div>

          <button 
            onClick={() => setOrderStep(1)}
            className="px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2 text-lg"
          >
            Order Now for $2.00
          </button>
        </div>
      );
    }

    if (orderStep === 1) {
      return (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Select Card Design</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden">
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Matte Black (Standard)</h3>
                <p className="text-zinc-400 text-sm mb-4">Premium PVC with a sleek matte finish. Included in the $2.00 order fee.</p>
                <div className="w-full h-32 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 opacity-50" />
                  <span className="text-zinc-600 font-bold tracking-widest text-xl relative z-10">NXG</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-amber-500 transition-colors relative overflow-hidden opacity-50">
                <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded">
                  COMING SOON
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Brushed Titanium</h3>
                <p className="text-zinc-400 text-sm mb-4">Heavyweight metal card with laser-engraved details. +$49.00</p>
                <div className="w-full h-32 bg-gradient-to-br from-zinc-400 to-zinc-600 rounded-xl border border-zinc-400 flex items-center justify-center relative overflow-hidden">
                  <span className="text-zinc-800 font-bold tracking-widest text-xl relative z-10">NXG</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Personalisation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Name on Card</label>
                    <input type="text" defaultValue="Alex Thompson" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="text-white font-medium">Hide Name</p>
                        <p className="text-xs text-zinc-500">Print only your initials for maximum privacy</p>
                      </div>
                      <div className="w-10 h-5 bg-zinc-700 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-center">
                <button onClick={() => setOrderStep(0)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors">Back</button>
                <button onClick={() => setOrderStep(2)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Continue</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (orderStep === 2) {
      return (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Confirm Shipping Details</h2>
          <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Last Name</label>
                <input type="text" defaultValue="Thompson" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Street Address</label>
              <input type="text" defaultValue="123 Tech Lane, Apt 4B" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">City</label>
                <input type="text" defaultValue="San Francisco" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">State</label>
                <input type="text" defaultValue="CA" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-zinc-500 mb-1 block">ZIP Code</label>
                <input type="text" defaultValue="94105" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
              <div>
                <p className="text-white font-medium">Total: $2.00</p>
                <p className="text-xs text-zinc-500">Will be deducted from your USD Wallet</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setOrderStep(1)} className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors">Back</button>
                <button onClick={() => setOrderStep(3)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Confirm & Pay</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (orderStep === 3) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center relative">
          {/* Confetti Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-yellow-500/50 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  opacity: 0,
                  scale: [0, 1.5, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut",
                  delay: Math.random() * 0.5
                }}
              />
            ))}
          </div>

          <motion.div 
            className="relative mb-12"
            initial={{ y: 50, scale: 0.9, rotateX: 20 }}
            animate={{ y: 0, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            
            {/* Card Mockup */}
            <div className="w-64 h-40 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 opacity-50" />
               <div className="w-8 h-6 bg-zinc-700 rounded-sm absolute left-6 top-1/2 -translate-y-1/2 opacity-50" />
               <span className="text-zinc-500 font-bold tracking-widest absolute bottom-4 right-4 text-xs">NXG</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Your premium NXG Physical Card is being prepared. You will receive it within 3-5 business days.
            </p>
            <button onClick={() => setOrderStep(0)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
              Back to Card Settings
            </button>
          </motion.div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[150px]"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Card Management</h1>
          <p className="text-sm text-zinc-400">Manage your virtual and physical cards</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('virtual')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'virtual' ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
          )}
        >
          Virtual Card
        </button>
        <button
          onClick={() => setActiveTab('physical')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'physical' ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-300"
          )}
        >
          Physical Card
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'virtual' ? renderVirtualCard() : renderPhysicalCardOrder()}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">Cancel Customization?</h3>
              <p className="text-zinc-400 mb-6">Are you sure you want to cancel? Your current design will be lost.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setIsCreatingCard(false);
                    setCreationStep('customize');
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
                >
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">Reset Design?</h3>
              <p className="text-zinc-400 mb-6">This will reset all your customizations back to the default style.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNewCardName('YOUR NAME');
                    setNewCardGraphic('none');
                    setNewCardTexture('matte');
                    setNewCardColor(themes[0]);
                    setNewCardFont('font-sans');
                    setNewCardAlign('text-left');
                    setNewCardSpacing('tracking-widest');
                    setNewCardTextColor('text-white');
                    setNewCardTextSize('text-sm');
                    setNewCardGraphicOpacity(20);
                    setShowDeleteModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WhopCardFundModal
        isOpen={showWhopFundModal}
        onClose={() => setShowWhopFundModal(false)}
      />
    </div>
  );
}
