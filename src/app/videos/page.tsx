import { getLocalVideos } from '@/lib/media';

export default function VideosPage() {
  const local = getLocalVideos();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p
    .split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join('/');
  return (
    <div className="space-y-8 w-full">
      <h1 className="text-3xl font-bold text-white">Videos</h1>
      <p className="text-sm text-gray-400 max-w-prose">Add video files to <code>public/videos</code> (mp4, webm, ogv) or paste YouTube IDs below.</p>
      {local.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {local.map(v => (
            <div key={v.src} className="rounded-lg overflow-hidden border border-border bg-surface">
              <video className="w-full" controls poster={v.poster}>
                <source src={v.src.startsWith('/') ? basePath + (decodeURI(v.src) === v.src ? encodePath(v.src) : v.src) : v.src} />
                Your browser does not support the video tag.
              </video>
              <div className="p-2 text-[12px] text-gray-300 border-t border-border">{v.title}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {["dQw4w9WgXcQ","9bZkp7q19f0"].map(id => (
            <div key={id} className="aspect-video rounded-lg overflow-hidden border border-border bg-surface">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
