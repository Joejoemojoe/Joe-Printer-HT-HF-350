"use client";
import { useEffect, useMemo, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ModelViewer({ src, autoRotate = true, cameraControls = true, className = '' }: { src: string; autoRotate?: boolean; cameraControls?: boolean; className?: string }) {
  // Render nothing on the server and on the initial client render to prevent
  // hydration mismatches caused by the web component mutating attributes.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const full = useMemo(() => (src.startsWith('/') ? basePath + (decodeURI(src) === src ? encodePath(src) : src) : src), [src, basePath]);

  useEffect(() => {
    // Fallback: if layout didn't load the script yet (rare), inject it lazily
    const id = 'model-viewer-cdn';
    if (typeof window !== 'undefined' && !customElements?.get?.('model-viewer') && !document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(s);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface text-gray-400 text-sm">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600 animate-pulse" />
          <span>Loading model…</span>
        </div>
      </div>
    );
  }

  const ModelViewerElement: any = 'model-viewer';
  return (
    <ModelViewerElement
      src={full}
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls={cameraControls}
      auto-rotate={autoRotate}
      exposure="1.0"
      shadow-intensity="1"
      style={{ width: '100%', height: '100%' }}
      className={className}
    />
  );
}
