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
  const firstMedia = (content: string): { type: 'image'|'video'|'file'; url: string; alt?: string } | null => {
    // Markdown image: ![alt](/path)
    const mdImg = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImg) {
      const url = mdImg[1];
      const ext = url.split('.').pop()?.toLowerCase() || '';
      if (IMG_EXT.has(`.${ext}`)) return { type: 'image', url, alt: undefined };
    }
    // HTML video with src
    const htmlVideo = content.match(/<video[^>]*src=\"([^\"]+)\"[^>]*>/i);
    if (htmlVideo) {
      return { type: 'video', url: htmlVideo[1] };
    }
    // Fallback: first markdown link as file
    const mdLink = content.match(/\[[^\]]*\]\(([^)]+)\)/);
    if (mdLink) return { type: 'file', url: mdLink[1] };
    return null;
  };
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Updates & Changelog</h1>
      <div className="space-y-8">
        {groups.map(g => (
          <section key={g.key} className="space-y-3">
            <h2 className="text-xl font-semibold text-white">{g.label}</h2>
            <ul className="space-y-3">
              {g.items.map(p => (
                <li key={p.meta.slug}>
                  <Link href={`/blog/${p.meta.slug}/`} className="block p-4 rounded-md border border-border bg-surface hover:border-gray-500 transition">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const m = firstMedia(p.content);
                        if (!m) return null;
                        const url = withBase(m.url);
                        if (m.type === 'image') {
                          const isHeic = /\.heic$/i.test(m.url);
                          if (isHeic) {
                            return (
                              <div className="w-20 h-16 flex items-center justify-center rounded border border-border bg-ink text-[10px] text-gray-300 shrink-0">
                                HEIC file
                              </div>
                            );
                          }
                          return <img src={url} alt={m.alt || p.meta.title} className="w-20 h-16 object-cover rounded border border-border shrink-0" />;
                        }
                        if (m.type === 'video') {
                          return (
                            <div className="w-20 h-16 flex items-center justify-center rounded border border-border bg-ink text-[10px] text-gray-300 shrink-0">
                              Video
                            </div>
                          );
                        }
                        return (
                          <div className="w-20 h-16 flex items-center justify-center rounded border border-border bg-ink text-[10px] text-gray-300 shrink-0">
                            File
                          </div>
                        );
                      })()}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate">{p.meta.title}</p>
                        <div className="flex flex-wrap gap-2 text-[11px] mt-1 text-gray-400">
                          {p.meta.date && <span className="shrink-0">{p.meta.date}</span>}
                          {p.meta.tags && p.meta.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-ink border border-border">{t}</span>)}
                        </div>
                        {p.meta.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{p.meta.description}</p>}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
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
