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
    const owner = 'Joejoemojoe';
    const repo = 'Joe-Printer-HT-HF-350';
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
    const lfsUrl = (url?: string) => {
      if (!url || !url.startsWith('/uploads/')) return undefined;
      const file = url.split('/').slice(2).join('/');
      const enc = encodeURIComponent(file).replace(/%2F/g, '/');
      return `https://raw.githubusercontent.com/${owner}/${repo}/main/public/uploads/${enc}`;
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
        const rawLfs = lfsUrl(raw);
        return (
          <div>
            <h3>Display</h3>
            <a href={src} target="_blank" rel="noopener noreferrer">
              <img
                {...props}
                src={src}
                style={{ maxWidth: '100%', height: 'auto', borderRadius: 6, ...(props.style || {}) }}
              />
            </a>
            {rawLfs && (
              <p className="mt-2 text-sm"><a className="underline" href={rawLfs} target="_blank" rel="noopener noreferrer">Download from LFS</a></p>
            )}
          </div>
        );
      },
      video: (props: any) => {
        const raw = props.src as string | undefined;
        const src = withBase(raw);
        // Determine mime type from extension
        const ext = (raw?.split('.').pop() || '').toLowerCase();
        const type = ext === 'mp4' ? 'video/mp4' : ext === 'webm' ? 'video/webm' : ext === 'ogv' ? 'video/ogg' : ext === 'mov' ? 'video/quicktime' : undefined;
        // If children already include <source>, just prefix children via our 'source' override
        const rawLfs = lfsUrl(raw);
        if (props.children) {
          return (
            <div>
              <h3>Display</h3>
              <video {...props} style={{ width: '100%', ...(props.style || {}) }} />
              {rawLfs && (
                <p className="mt-2 text-sm"><a className="underline" href={rawLfs} target="_blank" rel="noopener noreferrer">Download from LFS</a></p>
              )}
            </div>
          );
        }
        return (
          <div>
            <h3>Display</h3>
            <video {...props} controls style={{ width: '100%', ...(props.style || {}) }}>
              {src && <source src={src} {...(type ? { type } : {})} />}
              Your browser does not support the video tag. {raw ? 'Download: ' : ''}
              {raw && (
                <a href={src} target="_blank" rel="noopener noreferrer">
                  {raw}
                </a>
              )}
            </video>
            {rawLfs && (
              <p className="mt-2 text-sm"><a className="underline" href={rawLfs} target="_blank" rel="noopener noreferrer">Download from LFS</a></p>
            )}
          </div>
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
