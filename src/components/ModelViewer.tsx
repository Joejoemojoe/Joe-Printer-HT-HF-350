"use client";
import { useEffect, useMemo } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function ModelViewer({ src, autoRotate = true, cameraControls = true, className = '' }: { src: string; autoRotate?: boolean; cameraControls?: boolean; className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const full = useMemo(() => (src.startsWith('/') ? basePath + (decodeURI(src) === src ? encodePath(src) : src) : src), [src, basePath]);

  useEffect(() => {
    // Load model-viewer web component from CDN once
    const id = 'model-viewer-cdn';
    if (typeof window !== 'undefined' && !document.getElementById(id)) {
      const s = document.createElement('script');
      s.id = id;
      s.type = 'module';
      s.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(s);
    }
  }, []);

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
