import Link from 'next/link';
import HeroModelSwitcher from '@/components/HeroModelSwitcher';
import { getFirstModel } from '@/lib/media';
import ClientHomeEnhancements from './pageClient';

export default function HomePage() {
  const model = getFirstModel();
  return (
  <div className="space-y-20 w-full relative">
      {/* Glow blobs */}
      <div className="glow-blob blob-violet w-[520px] h-[520px] -top-40 -left-40 parallax-layer" />
      <div className="glow-blob blob-cyan w-[480px] h-[480px] top-20 -right-40 parallax-layer" />
      <div className="glow-blob blob-coral w-[560px] h-[560px] top-[420px] left-1/2 -translate-x-1/2 parallax-layer" />

      <section className="grid md:grid-cols-2 gap-14 items-center relative pt-4">
        {/* Model first in DOM for faster paint on mobile; order swapped on desktop */}
        <div className="relative md:order-2">
          <div className="aspect-video glass-card overflow-hidden relative">
            {model ? (
              model.ext === '.stl' ? (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm p-4 text-center">
                  STL detected: Please convert STL to GLB/GLTF for web viewing. Try Blender or online converters, then place the .glb/.gltf in <code>public/models</code>.
                </div>
              ) : (
                <HeroModelSwitcher
                  modelSrc={model.src}
                  modelTitle={model.title}
                  modelSizeBytes={model.size}
                  previewPng={'/uploads/printer cad.png'}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Drop a .glb/.gltf into public/models or public/uploads</div>
            )}
          </div>
        </div>
        <div className="space-y-7 md:order-1 relative">
          <h1 className="text-[56px] font-extrabold leading-[1.05] gradient-text tracking-tight">Joe&#39;s 3D Printer Project</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-prose">Open-source documentation hub, tuning methodologies, upgrade log and media showcase for a custom high-speed, high-temperature 3D printer platform.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/docs" className="btn btn-primary">Get Started</Link>
            <Link href="/blog" className="btn">Latest Updates</Link>
            <Link href="/videos" className="btn">Videos</Link>
          </div>
          <ClientHomeEnhancements part="marquee" />
        </div>
      </section>
  <ClientHomeEnhancements part="reveal-open" />
  <div className="reveal grid md:grid-cols-3 gap-6">
        {[
          { title: 'Build Docs', desc: 'Assembly steps, dimensions, BOM and firmware.', href: '/docs' },
          { title: 'Tuning Guides', desc: 'Extrusion, input shaping, linear advance and flow.', href: '/docs/tuning' },
          { title: 'Upgrade Log', desc: 'Iterative hardware & firmware improvements.', href: '/blog' }
        ].map(card => (
          <Link key={card.title} href={card.href} className="group p-5 glass-card hover:border-gray-500 transition flex flex-col gap-2">
            <h3 className="font-semibold text-white group-hover:text-accent underline-heading">{card.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>
      <div className="reveal">
        <div className="feature-tabs glass-card p-6 space-y-6">
          <div className="flex gap-3 flex-wrap text-xs font-medium">
            <span className="pill">High Temp</span>
            <span className="pill">High Flow</span>
            <span className="pill">Input Shaping</span>
            <span className="pill">Beacon Mesh</span>
            <span className="pill">Resonance</span>
          </div>
      <ClientHomeEnhancements part="featured" />
        </div>
    </div>
    <div className="reveal prose prose-invert max-w-none">
        <h2>Project Philosophy</h2>
        <p>This site acts like a lightweight documentation portal and changelog for my printer platform. Content lives as Markdown/MDX files so updates are just git commits. Media (images & embedded videos) accompany detailed tuning notes so others can replicate results.</p>
    </div>
    <ClientHomeEnhancements part="reveal-init" />
    </div>
  );
}

// (HeroOverlay kept if needed elsewhere; removed from homepage for cleaner layout)
