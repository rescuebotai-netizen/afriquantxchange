import React from 'react';
import { motion } from 'motion/react';

export function AfricanPartnersMarquee() {
  const corporatePartners = [
    'MTN Group',
    'Dangote Group',
    'Standard Bank',
    'Safaricom',
    'Absa Group',
    'Ecobank Transnational',
    'Equity Bank Group',
    'FirstBank'
  ];

  const unicornPartners = [
    'Flutterwave',
    'OPay',
    'Wave Mobile',
    'Interswitch',
    'Moniepoint',
    'Chipper Cash',
    'Andela',
    'Sun King'
  ];

  // Quadruple lists to ensure a completely seamless continuous infinite motion loop
  const corporateLoop = [...corporatePartners, ...corporatePartners, ...corporatePartners, ...corporatePartners];
  const unicornLoop = [...unicornPartners, ...unicornPartners, ...unicornPartners, ...unicornPartners];

  return (
    <section className="relative w-full py-20 lg:py-24 bg-[#0D0F13] text-[#F4F1E8] overflow-hidden selection:bg-[#D9A94E] selection:text-[#0D0F13] border-y border-white/[0.08]">
      
      {/* Background Dot Texture */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(244,241,232,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 1200px 600px at 50% 50%, #000 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 1200px 600px at 50% 50%, #000 40%, transparent 85%)',
        }}
      />

      {/* Ambient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] bg-gradient-to-r from-[#D9A94E]/10 via-[#34A87E]/10 to-[#0666EB]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full space-y-12">

        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center px-6 space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F1E8]">
            Institutional Corporate Giants <span className="text-[#F4F1E8]/40 font-light px-1">&amp;</span>
            <span className="text-[#34A87E] drop-shadow-[0_0_30px_rgba(52,168,126,0.22)]">
              African Tech Unicorns
            </span>
          </h2>
        </motion.div>

        {/* Motion Streams: Only Partner Names Moving */}
        <div className="space-y-6 relative overflow-hidden">
          
          {/* Edge Fade Gradients */}
          <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-r from-[#0D0F13] via-[#0D0F13]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 bg-gradient-to-l from-[#0D0F13] via-[#0D0F13]/80 to-transparent z-20 pointer-events-none" />

          {/* Row 1: Corporate Giants (Forward Stream) */}
          <div className="flex overflow-hidden select-none py-2">
            <motion.div
              className="flex items-center gap-10 sm:gap-14 whitespace-nowrap"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 30,
              }}
            >
              {corporateLoop.map((name, idx) => (
                <div key={`corp-${idx}`} className="inline-flex items-center gap-10 sm:gap-14">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F4F1E8]/85 hover:text-[#D9A94E] transition-colors cursor-default">
                    {name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#D9A94E]/60 shadow-[0_0_8px_rgba(217,169,78,0.6)]" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Divider Signal Line */}
          <div className="relative h-[1px] bg-white/[0.06] w-full max-w-6xl mx-auto" />

          {/* Row 2: African Tech Unicorns (Reverse Stream) */}
          <div className="flex overflow-hidden select-none py-2">
            <motion.div
              className="flex items-center gap-10 sm:gap-14 whitespace-nowrap"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 32,
              }}
            >
              {unicornLoop.map((name, idx) => (
                <div key={`uni-${idx}`} className="inline-flex items-center gap-10 sm:gap-14">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F4F1E8]/85 hover:text-[#34A87E] transition-colors cursor-default">
                    {name}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#34A87E]/60 shadow-[0_0_8px_rgba(52,168,126,0.6)]" />
                </div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
