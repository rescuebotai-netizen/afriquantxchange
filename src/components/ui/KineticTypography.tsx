import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// 1. Kinetic Word Reveal (staggered word-by-word slide & fade up)
export function KineticWordReveal({ 
  text, 
  className = '', 
  delay = 0,
  staggerDuration = 0.05,
  highlightWord = ''
}: { 
  text: string; 
  className?: string; 
  delay?: number;
  staggerDuration?: number;
  highlightWord?: string;
}) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      filter: 'blur(8px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] ${className}`}
    >
      {words.map((word, i) => {
        const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
        return (
          <motion.span 
            key={i} 
            variants={wordVariants} 
            className={`inline-block whitespace-nowrap ${isHighlight ? 'text-[#00C805] font-extrabold' : ''}`}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
}

// 2. Character Stagger (letter-by-letter kinetic animation)
export function KineticCharacterStagger({ 
  text, 
  className = '',
  delay = 0 
}: { 
  text: string; 
  className?: string;
  delay?: number;
}) {
  const letters = Array.from(text);

  return (
    <motion.span 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.02, delayChildren: delay }
        }
      }}
      className={`inline-block ${className}`}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 12, rotateX: -90 },
            visible: { 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              transition: { duration: 0.35, ease: 'easeOut' }
            }
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// 3. Text Morphing (smoothly transitions between a list of words or phrases)
export function TextMorph({ 
  words, 
  interval = 3000, 
  className = '' 
}: { 
  words: string[]; 
  interval?: number; 
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={`inline-block relative overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 24, filter: 'blur(10px)', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
          exit={{ opacity: 0, y: -24, filter: 'blur(10px)', scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="inline-block text-[#00C805] font-extrabold"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// 4. Typewriter Kinetic Effect (character typing with cursor)
export function TypewriterText({ 
  text, 
  speed = 40, 
  className = '' 
}: { 
  text: string; 
  speed?: number; 
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={`font-mono inline-flex items-center ${className}`}>
      <span>{displayedText}</span>
      <motion.span 
        animate={{ opacity: [1, 0] }} 
        transition={{ repeat: Infinity, duration: 0.7 }} 
        className="inline-block w-2 h-4 bg-[#00C805] ml-1 rounded-sm"
      />
    </span>
  );
}

// 5. Animated Quotes Carousel Component
export interface QuoteItem {
  quote: string;
  author: string;
  role: string;
  roi?: string;
  avatar?: string;
  company?: string;
}

export function AnimatedQuoteCarousel({ 
  quotes, 
  autoPlayInterval = 6000,
  darkTheme = false 
}: { 
  quotes: QuoteItem[]; 
  autoPlayInterval?: number;
  darkTheme?: boolean;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % quotes.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [quotes, autoPlayInterval]);

  const current = quotes[activeIdx];

  return (
    <div className={`rounded-[32px] p-8 lg:p-12 border relative overflow-hidden transition-all duration-300 ${
      darkTheme 
        ? 'bg-zinc-900 border-zinc-800 text-white shadow-2xl' 
        : 'bg-[#F9F9FB] border-gray-200/90 text-black shadow-xl'
    }`}>
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C805]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Quote Icon */}
      <div className="text-4xl font-serif text-[#00C805] mb-4 select-none opacity-80">“</div>

      {/* Quote Text with Crossfade + Blur Effect */}
      <div className="min-h-[140px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-6 w-full"
          >
            <p className="text-xl lg:text-2xl font-medium leading-relaxed tracking-tight">
              {current.quote}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/40">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-bold text-base">{current.author}</div>
                  <div className={`text-xs font-mono ${darkTheme ? 'text-zinc-400' : 'text-gray-500'}`}>
                    {current.role} {current.company ? `• ${current.company}` : ''}
                  </div>
                </div>
              </div>

              {current.roi && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#00C805]/15 text-[#00C805] border border-[#00C805]/30 font-mono font-bold text-xs">
                  {current.roi}
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Navigation Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {quotes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIdx === idx 
                ? 'w-8 bg-[#00C805]' 
                : darkTheme ? 'w-2 bg-zinc-700 hover:bg-zinc-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
