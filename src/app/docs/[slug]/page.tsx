import { getDocSlugs, getDocBySlug, renderMdx } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { Fragment } from 'react';

export const revalidate = 60;

export async function generateStaticParams() {
  return getDocSlugs().map(slug => ({ slug: slug.replace(/\.mdx?$/, '') }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
  const { meta, content } = getDocBySlug(slug);
  const code = await renderMdx(content);
  const MDXContent = new Function(code)().default;
    return (
      <article className="prose prose-invert max-w-none">
        <h1>{meta.title}</h1>
    <MDXContent components={{}}
    />
      </article>
    );
  } catch (e) {
    notFound();
  }
}
