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
    const encodePath = (p: string) => p
      .split('/')
      .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
      .join('/');
    const withBase = (url?: string) => {
      if (!url) return '';
      if (!url.startsWith('/')) return url;
      let encoded = url;
      try {
        // If not already percent-encoded, encode each segment
        if (decodeURI(url) === url) encoded = encodePath(url);
      } catch {
        // On malformed URI, fall back to raw
      }
      return `${basePath}${encoded}`;
    };
  const components = {
      img: (props: any) => {
        const raw = props.src as string | undefined;
        const src = withBase(raw);
        const isHeic = !!raw && /\.heic$/i.test(raw);
        if (isHeic) {
          return (
            <div className="rounded-md border border-border bg-ink p-3 text-sm text-gray-300">
              <div>HEIC image attached.</div>
              <a className="underline text-blue-300" href={src} target="_blank" rel="noopener noreferrer">
                Download original
              </a>
            </div>
          );
        }
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
      video: (props: any) => {
        const raw = props.src as string | undefined;
        const src = withBase(raw);
        // Determine mime type from extension
        const ext = (raw?.split('.').pop() || '').toLowerCase();
        const type = ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : ext === 'ogv' ? 'video/ogg' : ext === 'mov' ? 'video/quicktime' : undefined;
        // If children already include <source>, just prefix children via our 'source' override
        if (props.children) {
          return <video {...props} style={{ width: '100%', ...(props.style || {}) }} />;
        }
        return (
          <video {...props} controls style={{ width: '100%', ...(props.style || {}) }}>
            {src && <source src={src} {...(type ? { type } : {})} />}
            Your browser does not support the video tag. {raw ? 'Download: ' : ''}
            {raw && (
              <a href={src} target="_blank" rel="noopener noreferrer">
                {raw}
              </a>
            )}
          </video>
        );
      },
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
