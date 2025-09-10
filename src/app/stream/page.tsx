import StreamClient from './streamClient';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 60;

export default function StreamPage(){
  const posts = getAllPosts().sort((a,b)=> (b.meta.date || '').localeCompare(a.meta.date || ''));
  // Provide trimmed content snippet for preview (first paragraph or first 220 chars)
  const feed = posts.map(p=> ({
    slug: p.meta.slug,
    title: p.meta.title,
    date: p.meta.date || '',
    description: p.meta.description || '',
    content: p.content,
  }));
  return <StreamClient posts={feed} />;
}
