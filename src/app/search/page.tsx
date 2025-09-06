import { getAllDocs, getAllPosts } from '@/lib/mdx';
export const runtime = 'nodejs';
import SearchClient from './searchClient';

export default function SearchPage() {
  const docs = getAllDocs();
  const posts = getAllPosts();
  const withSlash = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  const indexData = [
    ...docs
      .map(d => ({
        type: 'doc' as const,
        title: d.meta.title,
        desc: d.meta.description,
        slug: d.meta.slug === 'index' ? '/docs/' : withSlash(`/docs/${d.meta.slug}`)
      }))
      // If a dedicated /docs/ exists, don't also include /docs/index/
      .filter(item => item.slug !== withSlash('/docs/index')),
    ...posts.map(p => ({ type: 'post' as const, title: p.meta.title, desc: p.meta.description, slug: withSlash(`/blog/${p.meta.slug}`) }))
  ];
  return <SearchClient indexData={indexData} />;
}
