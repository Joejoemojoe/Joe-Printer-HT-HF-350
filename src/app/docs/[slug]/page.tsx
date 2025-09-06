import { getDocSlugs, getDocBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

export const revalidate = 60;

export async function generateStaticParams() {
  return getDocSlugs().map(slug => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { meta, content } = getDocBySlug(slug);
    return (
      <article className="prose prose-invert max-w-none">
        <h1>{meta.title}</h1>
        <MDXRemote source={content} />
      </article>
    );
  } catch (e) {
    notFound();
  }
}
