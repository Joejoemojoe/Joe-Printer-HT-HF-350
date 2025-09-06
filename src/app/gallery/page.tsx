import Image from 'next/image';
import { getGalleryImages } from '@/lib/media';

export default function GalleryPage() {
  const local = getGalleryImages();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p
    .split('/')
    .map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg)))
    .join('/');
  const sample = [
    { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=60', alt: 'Printer motion system' },
    { src: 'https://images.unsplash.com/photo-1603732551658-5fabbafa84dc?auto=format&fit=crop&w=800&q=60', alt: 'Electronics wiring' },
    { src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60', alt: 'Print in progress' }
  ];
  const images = local.length ? local : sample;
  return (
    <div className="space-y-8 w-full">
      <h1 className="text-3xl font-bold text-white">Gallery</h1>
      <p className="text-sm text-gray-400 max-w-prose">Add photos to <code>public/gallery</code> (jpg, png, webp, gif) or leave remote samples.</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
    {images.map(img => (
          <div key={img.src} className="group relative border border-border rounded-md overflow-hidden bg-surface">
      <Image src={`${img.src.startsWith('/') ? basePath + (decodeURI(img.src) === img.src ? encodePath(img.src) : img.src) : img.src}`} alt={img.alt} width={400} height={260} className="object-cover w-full h-48 group-hover:scale-105 transition" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-gray-300">
              {img.alt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
