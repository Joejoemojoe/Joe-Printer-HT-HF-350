import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

export const revalidate = 60;

export default function BlogIndex() {
  const posts = getAllPosts();
  const groups = groupByMonth(posts);
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
      if (decodeURI(url) === url) encoded = encodePath(url);
    } catch {}
    return `${basePath}${encoded}`;
  };
  const IMG_EXT = new Set(['.jpg','.jpeg','.png','.webp','.gif','.svg','.heic']);
  const VID_EXT = new Set(['.mp4','.webm','.ogv','.mov']);
  const firstMedia = (content: string): { type: 'image'|'video'|'file'; url: string; alt?: string; poster?: string } | null => {
    // Markdown image: ![alt](/path)
    const mdImg = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImg) {
      const url = mdImg[1];
      const ext = url.split('.').pop()?.toLowerCase() || '';
      if (IMG_EXT.has(`.${ext}`)) return { type: 'image', url, alt: undefined };
    }
    // HTML image: <img src="/path" ...>
    const htmlImg = content.match(/<img[^>]*src=\"([^\"]+)\"[^>]*>/i);
    if (htmlImg) {
      const url = htmlImg[1];
      const ext = url.split('.').pop()?.toLowerCase() || '';
      if (IMG_EXT.has(`.${ext}`)) return { type: 'image', url, alt: undefined };
    }
  // HTML video with src
  const htmlVideo = content.match(/<video[^>]*src=\"([^\"]+)\"[^>]*>/i);
  if (htmlVideo) {
    const poster = content.match(/<video[^>]*poster=\"([^\"]+)\"[^>]*>/i)?.[1];
    return { type: 'video', url: htmlVideo[1], poster };
  }
  // HTML video that uses <source src="...">
  const sourceVideo = content.match(/<source[^>]*src=\"([^\"]+)\"[^>]*>/i);
  if (sourceVideo) {
    const poster = content.match(/<video[^>]*poster=\"([^\"]+)\"[^>]*>/i)?.[1];
    return { type: 'video', url: sourceVideo[1], poster };
  }
    // Fallback: first markdown link as file
    const mdLink = content.match(/\[[^\]]*\]\(([^)]+)\)/);
    if (mdLink) return { type: 'file', url: mdLink[1] };
    return null;
  };
  return (
    <div className="w-full space-y-12">
      <header className="space-y-2">
        <h1 className="page-heading">Update Log</h1>
        <p className="page-intro text-sm max-w-prose">Chronological log of platform changes, uploads and calibration milestones. Minimal presentation—optimized for quick diff style scanning.</p>
      </header>
      <div className="space-y-12">
        {groups.map(g => (
          <section key={g.key} className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-200 tracking-tight border-b border-border/60 pb-1">{g.label}</h2>
            <ul className="divide-y divide-border/40 border border-border/50 rounded-md bg-transparent">
              {g.items.map(p => {
                const media = firstMedia(p.content);
                const mediaIcon = media ? (media.type === 'video' ? '🎞️' : media.type === 'image' ? '🖼️' : '📄') : '•';
                return (
                  <li key={p.meta.slug} className="p-3 md:p-4 hover:bg-surface/40 transition-colors group">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        {p.meta.date && <span className="font-mono">{p.meta.date}</span>}
                        <span className="opacity-60">{mediaIcon}</span>
                        {p.meta.tags && p.meta.tags.length > 0 && (
                          <span className="flex flex-wrap gap-1">{p.meta.tags.map(t => <span key={t} className="px-1 py-0.5 rounded border border-border/60 text-[10px] text-gray-400 tracking-wide">{t}</span>)}</span>
                        )}
                      </div>
                      <Link href={`/blog/${p.meta.slug}/`} className="font-medium text-white leading-snug hover:underline underline-offset-2 decoration-border/70">
                        {p.meta.title}
                      </Link>
                      {p.meta.description && (
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                          {p.meta.description}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function groupByMonth(posts: ReturnType<typeof getAllPosts>) {
  const map = new Map<string, { key: string; label: string; items: typeof posts }>();
  for (const p of posts) {
    const d = p.meta.date ? new Date(p.meta.date) : null;
    const key = d && !isNaN(d.getTime()) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` : 'undated';
    const label = d && !isNaN(d.getTime()) ? `${monthName(d.getMonth())} ${d.getFullYear()}` : 'Undated';
    if (!map.has(key)) map.set(key, { key, label, items: [] as any });
    map.get(key)!.items.push(p);
  }
  // Sort groups by key desc, with undated last
  const arr = Array.from(map.values()).sort((a, b) => (a.key === 'undated' ? 1 : b.key === 'undated' ? -1 : b.key.localeCompare(a.key)));
  return arr;
}

function monthName(i: number) {
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][i] || '';
}
