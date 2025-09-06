import { getPostSlugs, getPostBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const revalidate = 60;

export async function generateStaticParams() {
  return getPostSlugs().map(slug => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { meta, content } = getPostBySlug(slug);
    return (
      <article className="prose prose-invert max-w-none">
        <h1>{meta.title}</h1>
        {meta.date && <p className="text-xs -mt-4 mb-6 text-gray-400">{meta.date}</p>}
        <MDXRemote source={content} />
      </article>
    );
  } catch (e) {
    notFound();
  }
}
