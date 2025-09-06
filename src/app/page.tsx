import Link from 'next/link';

export default function HomePage() {
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
          <div className="aspect-video rounded-lg border border-border bg-surface flex items-center justify-center text-gray-500 text-sm">Hero Graphic / Printer Render</div>
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
