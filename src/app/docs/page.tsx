import Link from 'next/link';
import { getAllDocs } from '@/lib/mdx';

export const revalidate = 60;

export default function DocsIndex() {
  const docs = getAllDocs();
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Documentation</h1>
      <ul className="space-y-3">
        {docs.map(d => (
          <li key={d.meta.slug}>
            <Link href={`/docs/${d.meta.slug}`} className="block p-4 rounded-md border border-border bg-surface hover:border-gray-500 transition">
              <p className="font-medium text-white">{d.meta.title}</p>
              {d.meta.description && <p className="text-xs text-gray-400 mt-1">{d.meta.description}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
