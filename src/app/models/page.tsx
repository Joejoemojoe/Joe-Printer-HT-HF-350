import ModelViewer from '@/components/ModelViewer';
import { getAllModels } from '@/lib/media';

export const revalidate = 60;

export default function ModelsPage() {
  const models = getAllModels();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const encodePath = (p: string) => p.split('/').map((seg, i) => (i === 0 ? seg : encodeURIComponent(seg))).join('/');
  const withBase = (url?: string) => (url && url.startsWith('/') ? basePath + (decodeURI(url) === url ? encodePath(url) : url) : url || '');
  return (
    <div className="space-y-8 w-full">
      <h1 className="page-heading">3D Models</h1>
      <p className="page-intro text-sm max-w-prose">Place .glb/.gltf (preferred) or .stl files in <code>public/models</code> or <code>public/uploads</code>. Large files use Git LFS.</p>
      {models.length === 0 ? (
  <div className="rounded-md border border-border/60 subtle-card p-4 text-gray-300 text-sm">No models found yet. Drop a .glb/.gltf into <code>public/models</code>.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {models.map(m => (
            <div key={m.src} className="rounded-lg overflow-hidden border border-border/60 subtle-card p-3 space-y-2 subtle-card-hover transition">
              <div className="text-sm text-white font-medium">{m.title}</div>
              {m.ext === '.stl' ? (
                <div className="text-xs text-gray-300">
                  STL detected. Convert to GLB/GLTF for inline viewing. <a className="underline" href={withBase(m.src)} target="_blank" rel="noreferrer">Download STL</a>
                </div>
              ) : (
                <div className="aspect-video rounded border border-border overflow-hidden">
                  <ModelViewer src={m.src} />
                </div>
              )}
              <div className="text-[11px] text-gray-400">
                Source: <a className="underline" href={withBase(m.src)} target="_blank" rel="noreferrer">{m.src}</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
