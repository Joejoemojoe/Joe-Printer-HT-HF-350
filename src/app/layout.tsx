import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { getFirstModel } from '@/lib/media';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Joe 3D Printer Docs',
  description: 'Documentation, guides, videos and updates for Joe\'s 3D printer project.',
  metadataBase: new URL('https://example.com')
};

const BUILD_YEAR = new Date().getFullYear();

export default function RootLayout({ children }: { children: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const model = getFirstModel();
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const modelHref = model?.src
    ? (model.src.startsWith('/') ? basePath + (decodeURI(model.src) === model.src ? encodePath(model.src) : model.src) : model.src)
    : null;
  const modelType = model?.ext === '.gltf' ? 'model/gltf+json' : model?.ext === '.glb' ? 'model/gltf-binary' : undefined;
  return (
  <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="//unpkg.com" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
  {/* Intentionally do not preload the 3D model to keep first-load data small. */}
        {/* Early inline theme script to avoid class mismatch */}
        <script
          dangerouslySetInnerHTML={{ __html: `(()=>{try{const s=localStorage.getItem('theme');if(s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();` }}
        />
      </head>
      <body className="font-sans bg-ink text-gray-200 min-h-screen flex flex-col" suppressHydrationWarning>
  {/* Load model-viewer early so the 3D model can render ASAP */}
  <Script id="model-viewer-cdn" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" type="module" strategy="beforeInteractive" />
        <header className="border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60 sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold text-gray-100 hover:text-white">JoePrinter</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link className="hover:text-white" href="/docs">Docs</Link>
              <Link className="hover:text-white" href="/videos">Videos</Link>
              <Link className="hover:text-white" href="/models">Models</Link>
              <Link className="hover:text-white" href="/gallery">Gallery</Link>
              <Link className="hover:text-white" href="/blog">Updates</Link>
              <Link className="hover:text-white" href="/stream">Feed</Link>
              <Link className="hover:text-white" href="/about">About</Link>
              <Link className="hover:text-white" href="/search">Search</Link>
              <a className="hover:text-white" href="https://github.com/Joejoemojoe/Joe-Printer-HT-HF-350" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </nav>
            <div className="ml-auto flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 flex gap-8 page-fade-enter">
          {children}
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-gray-400" suppressHydrationWarning>
          © {BUILD_YEAR} Joe Printer Project. Built with Next.js.
        </footer>
      </body>
    </html>
  );
}
