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
      img: (props: any) => <img {...props} src={withBase(props.src)} style={{ maxWidth:'100%', height:'auto', ...(props.style||{}) }} />,
      video: (props: any) => {
        const raw = props.src as string | undefined;
        const ext = (raw?.split('.').pop() || '').toLowerCase();
        const type = ext==='mp4'?'video/mp4': ext==='webm'?'video/webm': ext==='ogv'?'video/ogg': ext==='mov'?'video/quicktime': undefined;
        return (
          <video {...props} controls style={{ width:'100%', ...(props.style||{}) }}>
            {raw && <source src={withBase(raw)} {...(type?{type}:{})} />}
          </video>
        );
      },
      source: (p:any)=> <source {...p} src={withBase(p.src)} />,
      a:(p:any)=><a {...p} href={withBase(p.href)} />
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
