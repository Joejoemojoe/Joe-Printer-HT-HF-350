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
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const withBase = (url?: string) => (url && url.startsWith('/')) ? `${basePath}${url}` : url || '';
    const components = {
      img: (props: any) => {
        const src = withBase(props.src);
        return (
          <a href={src} target="_blank" rel="noopener noreferrer">
            <img
              {...props}
              src={src}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 6, ...(props.style || {}) }}
            />
          </a>
        );
      },
      video: (props: any) => <video {...props} src={withBase(props.src)} />,
      source: (props: any) => <source {...props} src={withBase(props.src)} />,
      a: (props: any) => <a {...props} href={withBase(props.href)} />,
    } as const;
    return (
      <article className="prose prose-invert max-w-none">
        <h1>{meta.title}</h1>
        {meta.date && <p className="text-xs -mt-4 mb-6 text-gray-400">{meta.date}</p>}
        <MDXRemote source={content} components={components} />
      </article>
    );
  } catch (e) {
    notFound();
  }
}
