import Link from 'next/link';
import { getAllDocs } from '@/lib/mdx';

export const revalidate = 60;

export default function DocsIndex() {
  const docs = getAllDocs();
  return (
    <div className="w-full space-y-8">
      <header className="space-y-2">
        <h1 className="page-heading">Documentation</h1>
        <p className="page-intro text-sm max-w-prose">Guides, tuning references and advanced calibration procedures.</p>
      </header>
      <ul className="space-y-3">
        {docs.map(d => (
          <li key={d.meta.slug}>
            <Link href={`/docs/${d.meta.slug}`} className="block p-4 subtle-card subtle-card-hover transition">
              <p className="font-medium text-white">{d.meta.title}</p>
              {d.meta.description && <p className="text-xs text-gray-400 mt-1">{d.meta.description}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
