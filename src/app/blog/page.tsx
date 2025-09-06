import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 60;

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Updates & Changelog</h1>
      <ul className="space-y-3">
        {posts.map(p => (
          <li key={p.meta.slug}>
            <Link href={`/blog/${p.meta.slug}`} className="block p-4 rounded-md border border-border bg-surface hover:border-gray-500 transition">
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
    </div>
  );
}
