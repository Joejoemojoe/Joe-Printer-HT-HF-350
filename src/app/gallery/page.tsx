import Image from 'next/image';

const sample = [
  {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=60',
    alt: 'Printer motion system'
  },
  {
    src: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84dc?auto=format&fit=crop&w=800&q=60',
    alt: 'Electronics wiring'
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    alt: 'Print in progress'
  }
];

export default function GalleryPage() {
  return (
    <div className="space-y-8 w-full">
      <h1 className="text-3xl font-bold text-white">Gallery</h1>
      <p className="text-sm text-gray-400 max-w-prose">Drop photos into the public/ folder or use remote sources; Next/Image optimizes them automatically.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sample.map(img => (
          <div key={img.src} className="group relative border border-border rounded-md overflow-hidden bg-surface">
            <Image src={img.src} alt={img.alt} width={400} height={260} className="object-cover w-full h-48 group-hover:scale-105 transition" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-gray-300">
              {img.alt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
