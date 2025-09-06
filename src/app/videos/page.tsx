export default function VideosPage() {
  return (
    <div className="space-y-8 w-full">
      <h1 className="text-3xl font-bold text-white">Videos</h1>
      <p className="text-sm text-gray-400 max-w-prose">Embed build logs, time-lapses and calibration walkthroughs. Replace the sample iframes with your own YouTube or locally hosted videos.</p>
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
    </div>
  );
}
