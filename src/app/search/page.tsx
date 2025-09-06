import { getAllDocs, getAllPosts } from '@/lib/mdx';
import SearchClient from './searchClient';

export default function SearchPage() {
  const docs = getAllDocs();
  const posts = getAllPosts();
  const indexData = [
    ...docs.map(d => ({ type: 'doc' as const, title: d.meta.title, desc: d.meta.description, slug: `/docs/${d.meta.slug}` })),
    ...posts.map(p => ({ type: 'post' as const, title: p.meta.title, desc: p.meta.description, slug: `/blog/${p.meta.slug}` }))
  ];
  return <SearchClient indexData={indexData} />;
}
