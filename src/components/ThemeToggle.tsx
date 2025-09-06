'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); },[]);
  const toggle = () => {
    const html = document.documentElement;
    const next = html.classList.contains('dark') ? 'light' : 'dark';
    html.classList.toggle('dark');
    try { localStorage.setItem('theme', next); } catch(e) {}
  };
  if(!mounted) return null;
  return (
    <button onClick={toggle} className="text-xs px-2 py-1 rounded border border-border bg-surface hover:border-gray-500" aria-label="Toggle theme">Theme</button>
  );
}
