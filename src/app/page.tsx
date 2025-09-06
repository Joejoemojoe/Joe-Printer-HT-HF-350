import Link from 'next/link';
import ModelViewer from '@/components/ModelViewer';
import { getFirstModel } from '@/lib/media';

export default function HomePage() {
  const model = getFirstModel();
  return (
    <div className="space-y-10 w-full">
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-white">Joe&#39;s 3D Printer Project</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Open-source style documentation, tuning notes, upgrade logs and media hub for my custom 3D printer builds. Inspired by GitHub&#39;s clean aesthetic.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/docs" className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:brightness-110 transition">Get Started</Link>
            <Link href="/blog" className="px-4 py-2 rounded-md bg-surface border border-border text-sm font-medium hover:border-gray-500 transition">Latest Updates</Link>
            <Link href="/videos" className="px-4 py-2 rounded-md bg-surface border border-border text-sm font-medium hover:border-gray-500 transition">Videos</Link>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video rounded-lg border border-border bg-surface overflow-hidden relative">
            {model ? (
              model.ext === '.stl' ? (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm p-4 text-center">
                  STL detected: Please convert STL to GLB/GLTF for web viewing. Try Blender or online converters, then place the .glb/.gltf in <code>public/models</code>.
                </div>
              ) : (
                <>
                  <ModelViewer src={model.src} />
                  <HeroOverlay title={model.title} href={model.src} />
                </>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Drop a .glb/.gltf into public/models or public/uploads</div>
            )}
          </div>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Build Docs', desc: 'Assembly steps, dimensions, BOM and firmware.', href: '/docs' },
          { title: 'Tuning Guides', desc: 'Extrusion, input shaping, linear advance and flow.', href: '/docs/tuning' },
          { title: 'Upgrade Log', desc: 'Iterative hardware & firmware improvements.', href: '/blog' }
        ].map(card => (
          <Link key={card.title} href={card.href} className="group p-5 rounded-lg border border-border bg-surface hover:border-gray-500 transition flex flex-col gap-2">
            <h3 className="font-semibold text-white group-hover:text-accent">{card.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </section>
      <section className="prose prose-invert max-w-none">
        <h2>Project Philosophy</h2>
        <p>This site acts like a lightweight documentation portal and changelog for my printer platform. Content lives as Markdown/MDX files so updates are just git commits. Media (images & embedded videos) accompany detailed tuning notes so others can replicate results.</p>
      </section>
    </div>
  );
}

function HeroOverlay({ title, href }: { title: string; href: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const full = href.startsWith('/') ? basePath + (decodeURI(href) === href ? encodePath(href) : href) : href;
  return (
    <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
      <div className="text-sm text-white font-medium truncate">{title}</div>
      <a href={full} className="text-xs px-2 py-1 rounded bg-surface border border-border hover:border-gray-500" target="_blank" rel="noreferrer">Download</a>
    </div>
  );
}
