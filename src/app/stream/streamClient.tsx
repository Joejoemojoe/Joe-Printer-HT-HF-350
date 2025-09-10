'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface FeedPost { slug:string; title:string; date:string; description:string; content:string; }
interface Props { posts: FeedPost[]; }

// Extract first media (image/video) for preview
function extractMedia(md: string): { type:'img'|'video'|null; src?:string } {
  const img = md.match(/!\[[^\]]*\]\(([^)]+)\)/); if(img) return { type:'img', src: img[1] };
  const vid = md.match(/<video[^>]*src="([^"]+)"[^>]*>/i); if(vid) return { type:'video', src: vid[1] };
  const source = md.match(/<source[^>]*src="([^"]+)"[^>]*>/i); if(source) return { type:'video', src: source[1] };
  return { type:null };
}

export default function StreamClient({ posts }: Props){
  const [visible, setVisible] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // IntersectionObserver for infinite grow
  useEffect(()=>{
    const el = loadMoreRef.current; if(!el) return;
    const obs = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ setVisible(v=> Math.min(posts.length, v+8)); } }); }, { rootMargin:'300px 0px' });
    obs.observe(el); return ()=> obs.disconnect();
  },[posts.length]);

  // Parallax on background accents
  useEffect(()=>{
    const layers = Array.from(document.querySelectorAll('.stream-parallax')) as HTMLElement[];
    const onMove = (e: Event)=>{
      const scrollY = window.scrollY;
      layers.forEach((l,i)=>{ const depth = (i+1)*0.04; l.style.transform = `translateY(${scrollY*depth}px)`; });
    };
    window.addEventListener('scroll', onMove, { passive:true });
    return ()=> window.removeEventListener('scroll', onMove);
  },[]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Background subtle blobs */}
      <div className="glow-blob blob-violet blob-anim-a stream-parallax w-[340px] h-[340px] -top-24 -left-32 opacity-25" />
      <div className="glow-blob blob-cyan blob-anim-b stream-parallax w-[300px] h-[300px] top-40 -right-24 opacity-25" />
      <div className="space-y-8 relative">
        <header className="space-y-2 pt-2">
          <h1 className="page-heading">Live Feed</h1>
          <p className="page-intro text-sm max-w-prose">Continuous update stream, most recent first. Scroll for more; items auto-load.</p>
        </header>
        <ul className="space-y-6">
          {posts.slice(0,visible).map(p=>{
            const media = extractMedia(p.content);
            const snippet = p.description || p.content.replace(/[#>*`\-\n]/g,' ').slice(0,180).trim()+ '...';
            return (
              <li key={p.slug} className="relative group overflow-hidden rounded-xl subtle-card subtle-card-hover p-0 border border-border/60 transition">
                <Link href={`/blog/${p.slug}/`} className="flex flex-col sm:flex-row gap-0 w-full">
                  {media.type==='img' && media.src && (
                    <div className="sm:w-52 w-full aspect-video sm:aspect-auto relative shrink-0 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                      <img src={media.src} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  {media.type==='video' && media.src && (
                    <div className="sm:w-52 w-full aspect-video sm:aspect-auto relative shrink-0 overflow-hidden rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none">
                      <video className="w-full h-full object-cover" muted playsInline autoPlay loop preload="metadata">
                        <source src={media.src} />
                      </video>
                    </div>
                  )}
                  <div className="flex-1 p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      {p.date && <span>{p.date}</span>}
                      <span className="inline-block w-1 h-1 rounded-full bg-border/70" />
                      <span>{p.slug}</span>
                    </div>
                    <h2 className="text-base font-semibold text-white leading-tight line-clamp-2">{p.title}</h2>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">{snippet}</p>
                    <div className="mt-auto flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-gray-400">
                      <span>Open ↗</span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        {visible < posts.length && <div ref={loadMoreRef} className="h-16 flex items-center justify-center text-xs text-gray-500">Loading…</div>}
        {visible >= posts.length && <div className="text-center text-[11px] text-gray-500 py-4">End of feed.</div>}
      </div>
    </div>
  );
}
