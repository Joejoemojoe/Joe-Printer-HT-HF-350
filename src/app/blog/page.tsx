import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 60;

export default function BlogIndex() {
  const posts = getAllPosts();
  const groups = groupByMonth(posts);
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Updates & Changelog</h1>
      <div className="space-y-8">
        {groups.map(g => (
          <section key={g.key} className="space-y-3">
            <h2 className="text-xl font-semibold text-white">{g.label}</h2>
            <ul className="space-y-3">
              {g.items.map(p => (
                <li key={p.meta.slug}>
                  <Link href={`/blog/${p.meta.slug}/`} className="block p-4 rounded-md border border-border bg-surface hover:border-gray-500 transition">
                    <p className="font-medium text-white">{p.meta.title}</p>
                    <div className="flex gap-3 text-[11px] mt-1 text-gray-400">
                      {p.meta.date && <span>{p.meta.date}</span>}
                      {p.meta.tags && p.meta.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-ink border border-border">{t}</span>)}
                    </div>
                    {p.meta.description && <p className="text-xs text-gray-400 mt-2">{p.meta.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function groupByMonth(posts: ReturnType<typeof getAllPosts>) {
  const map = new Map<string, { key: string; label: string; items: typeof posts }>();
  for (const p of posts) {
    const d = p.meta.date ? new Date(p.meta.date) : null;
    const key = d && !isNaN(d.getTime()) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : 'undated';
    const label = d && !isNaN(d.getTime()) ? `${monthName(d.getMonth())} ${d.getFullYear()}` : 'Undated';
    if (!map.has(key)) map.set(key, { key, label, items: [] as any });
    map.get(key)!.items.push(p);
  }
  // Sort groups by key desc, with undated last
  const arr = Array.from(map.values()).sort((a, b) => (a.key === 'undated' ? 1 : b.key === 'undated' ? -1 : b.key.localeCompare(a.key)));
  return arr;
}

function monthName(i: number) {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][i] || '';
}
