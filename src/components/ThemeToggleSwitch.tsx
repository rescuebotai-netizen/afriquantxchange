import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleSwitchProps {
  id?: string;
  className?: string;
  scale?: 'normal' | 'compact' | 'micro';
  onChange?: (isLight: boolean) => void;
}

export function ThemeToggleSwitch({
  id = 'theme-toggle-switch',
  className = '',
  scale = 'compact',
  onChange
}: ThemeToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('aqx_theme_mode') === 'light';
  });

  useEffect(() => {
    const applyTheme = (light: boolean) => {
      if (light) {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem('aqx_theme_mode', 'light');
      } else {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem('aqx_theme_mode', 'dark');
      }
    };

    applyTheme(isChecked);

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ isLight: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isLight === 'boolean') {
        setIsChecked(customEvent.detail.isLight);
      }
    };

    window.addEventListener('aqx-theme-change', handleSync);
    return () => window.removeEventListener('aqx-theme-change', handleSync);
  }, [isChecked]);

  const handleToggle = () => {
    const next = !isChecked;
    setIsChecked(next);
    if (next) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('aqx_theme_mode', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('aqx_theme_mode', 'dark');
    }

    // Broadcast change to other switches in layout
    window.dispatchEvent(new CustomEvent('aqx-theme-change', { detail: { isLight: next } }));

    if (onChange) {
      onChange(next);
    }
  };

  return (
    <button 
      type="button"
      id={id}
      onClick={handleToggle}
      className={`relative p-2 rounded-xl bg-transparent border-0 border-none text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center focus:outline-none focus:ring-0 shadow-none ${className}`}
      title={isChecked ? "Switch to Dark Theme" : "Switch to Light Theme"}
      aria-label="Toggle Dark/Light Mode"
    >
      {isChecked ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-400 hover:text-white transition-transform duration-300 -rotate-12" />
      )}
    </button>
  );
}
