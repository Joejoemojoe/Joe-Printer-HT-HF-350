import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Joe 3D Printer Docs',
  description: 'Documentation, guides, videos and updates for Joe\'s 3D printer project.',
  metadataBase: new URL('https://example.com')
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-ink text-gray-200 min-h-screen flex flex-col">
        <header className="border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60 sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold text-gray-100 hover:text-white">JoePrinter</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="hover:text-white" href="/docs">Docs</Link>
              <Link className="hover:text-white" href="/videos">Videos</Link>
              <Link className="hover:text-white" href="/gallery">Gallery</Link>
              <Link className="hover:text-white" href="/blog">Updates</Link>
              <Link className="hover:text-white" href="/about">About</Link>
              <Link className="hover:text-white" href="/search">Search</Link>
              <a className="hover:text-white" href="https://github.com/USERNAME/REPO" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </nav>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 flex gap-8">
          {children}
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Joe Printer Project. Built with Next.js.
        </footer>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try { const s = localStorage.getItem('theme'); if(s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');} } catch(e) {}
          })();
        `}} />
      </body>
    </html>
  );
}
