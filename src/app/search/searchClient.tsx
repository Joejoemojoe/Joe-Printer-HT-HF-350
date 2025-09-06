"use client";
import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import Link from 'next/link';

type Item = { type: 'doc' | 'post'; title: string; desc?: string; slug: string };

export default function SearchClient({ indexData }: { indexData: Item[] }) {
  const fuse = useMemo(() => new Fuse(indexData, { keys: ['title', 'desc'], threshold: 0.35 }), [indexData]);
  const [q, setQ] = useState('');
  const results = q ? fuse.search(q).map(r => r.item) : indexData.slice(0, 20);
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-white">Search</h1>
      <input
        value={q}
        onChange={e=>setQ(e.target.value)}
        placeholder="Search docs & posts..."
        className="w-full rounded-md bg-surface border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <ul className="space-y-2">
        {results.map(r => (
          <li key={r.slug} className="p-3 rounded-md border border-border bg-surface hover:border-gray-500 transition">
            <Link href={r.slug} className="text-sm font-medium text-white">{r.title} <span className="text-[10px] uppercase ml-2 px-1 py-0.5 rounded bg-ink border border-border">{r.type}</span></Link>
            {r.desc && <p className="text-xs text-gray-400 mt-1">{r.desc}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
