"use client";
import { useMemo, useState } from 'react';
import ModelViewer from '@/components/ModelViewer';

export default function HeroModelSwitcher({ modelSrc, modelTitle, modelSizeBytes, previewPng }: { modelSrc: string; modelTitle: string; modelSizeBytes?: number; previewPng: string }) {
  const [showModel, setShowModel] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const png = useMemo(() => (previewPng.startsWith('/') ? basePath + (decodeURI(previewPng) === previewPng ? encodePath(previewPng) : previewPng) : previewPng), [previewPng, basePath]);
  const warn = useMemo(() => {
    if (!modelSizeBytes) return '';
    const mb = modelSizeBytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`; 
  }, [modelSizeBytes]);

  if (showModel) {
    return <ModelViewer src={modelSrc} />;
  }

  return (
    <div className="relative w-full h-full">
      <img src={png} alt={modelTitle || 'Model preview'} className="w-full h-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-sm text-white font-medium truncate">{modelTitle}</div>
        <button
          className="text-xs px-2 py-1 rounded bg-accent text-white hover:brightness-110"
          onClick={() => setShowModel(true)}
          title={warn ? `Loads ~${warn}` : 'Load 3D model'}
        >
          Load 3D model{warn ? ` (~${warn})` : ''}
        </button>
      </div>
    </div>
  );
}
