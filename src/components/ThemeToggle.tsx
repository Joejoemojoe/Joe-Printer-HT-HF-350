'use client';
import { useEffect, useState } from 'react';

// Low-key theme toggle: subtle icon circle, no harsh contrast, small footprint.
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read current theme from html class (already set by inline script to avoid FOUC)
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const nowDark = !html.classList.contains('dark');
    if (nowDark) html.classList.add('dark'); else html.classList.remove('dark');
    setIsDark(nowDark);
    try { localStorage.setItem('theme', nowDark ? 'dark' : 'light'); } catch(e) {}
  };

  if (!mounted) {
    // Avoid hydration mismatch: render a tiny placeholder that matches final dimensions.
    return <span className="inline-block w-8 h-8 rounded-md border border-transparent" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="group w-8 h-8 inline-flex items-center justify-center rounded-md border border-border/60 bg-surface/60 hover:bg-surface/80 hover:border-border transition-colors focus:outline-none focus:ring-1 focus:ring-accent/40 text-gray-400 hover:text-gray-200"
    >
      {/* Icon: sun/moon hybrid rendered with simple shapes to keep contrast soft */}
      <span className="relative w-4 h-4 block">
        {/* Base circle */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-500 dark:to-gray-300 shadow-inner transition-colors" />
        {/* Crescent mask for light mode (shows moon in dark mode) */}
        <span className={`absolute inset-0 rounded-full bg-ink transition-all duration-300 ${isDark ? 'scale-75 translate-x-1 translate-y-1 opacity-80' : 'opacity-0 scale-0'}`} />
      </span>
    </button>
  );
}
