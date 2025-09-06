"use client";
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type Item = { type: 'doc' | 'post'; title: string; desc?: string; slug: string };

export default function SearchClient({ indexData }: { indexData: Item[] }) {
  const fuse = useMemo(() => new Fuse(indexData, { keys: ['title', 'desc'], threshold: 0.35 }), [indexData]);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const results = q ? fuse.search(q).map(r => r.item) : indexData.slice(0, 20);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setActive(0), [q]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const item = results[active];
      if (item) window.location.href = item.slug;
    } else if (e.key === 'Escape') {
      setQ('');
    }
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <div className="relative">
        <input
          ref={inputRef}
          value={q}
          onChange={e=>setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search docs & posts..."
          className="w-full rounded-md bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {q && (
          <button onClick={()=>setQ('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-xs">Clear</button>
        )}
      </div>
      <ul ref={listRef} className="space-y-2">
        {results.map((r, i) => (
          <li key={r.slug} className={`p-3 rounded-md border border-border bg-surface hover:border-gray-500 transition ${i===active ? 'ring-1 ring-accent' : ''}`}>
            <Link href={r.slug} className="text-sm font-medium text-white">{r.title} <span className="text-[10px] uppercase ml-2 px-1 py-0.5 rounded bg-ink border border-border">{r.type}</span></Link>
            {r.desc && <p className="text-xs text-gray-400 mt-1">{r.desc}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
