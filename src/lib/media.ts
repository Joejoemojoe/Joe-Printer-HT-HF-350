import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const VID_EXT = new Set(['.mp4', '.webm', '.ogv']);
const MODEL_EXT = new Set(['.glb', '.gltf', '.stl']);

export type GalleryItem = { src: string; alt: string };
export type VideoItem = { src: string; title: string; poster?: string };
export type ModelItem = { src: string; title: string; ext: string; size?: number };

export function getGalleryImages(): GalleryItem[] {
  const dirs = [path.join(publicDir, 'gallery'), path.join(publicDir, 'uploads')];
  const items: GalleryItem[] = [];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const base = path.relative(publicDir, d) || '';
    for (const f of fs.readdirSync(d)) {
      if (!IMG_EXT.has(path.extname(f).toLowerCase())) continue;
      items.push({ src: `/${base}/${f}`, alt: humanize(path.basename(f, path.extname(f))) });
    }
  }
  return items;
}

export function getLocalVideos(): VideoItem[] {
  const dirs = [path.join(publicDir, 'videos'), path.join(publicDir, 'uploads')];
  const items: VideoItem[] = [];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const base = path.relative(publicDir, d) || '';
    for (const f of fs.readdirSync(d)) {
      if (!VID_EXT.has(path.extname(f).toLowerCase())) continue;
      items.push({ src: `/${base}/${f}`, title: humanize(path.basename(f, path.extname(f))) });
    }
  }
  return items;
}

function humanize(s: string) {
  return s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function getFirstModel(): ModelItem | null {
  const dirs = [path.join(publicDir, 'models'), path.join(publicDir, 'uploads')];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const base = path.relative(publicDir, d) || '';
    for (const f of fs.readdirSync(d)) {
  const ext = path.extname(f).toLowerCase();
  if (!MODEL_EXT.has(ext)) continue;
  let size: number | undefined;
  try { size = fs.statSync(path.join(d, f)).size; } catch {}
  return { src: `/${base}/${f}`, title: humanize(path.basename(f, ext)), ext, size };
    }
  }
  return null;
}

export function getAllModels(): ModelItem[] {
  const dirs = [path.join(publicDir, 'models'), path.join(publicDir, 'uploads')];
  const items: ModelItem[] = [];
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const base = path.relative(publicDir, d) || '';
    for (const f of fs.readdirSync(d)) {
      const ext = path.extname(f).toLowerCase();
      if (!MODEL_EXT.has(ext)) continue;
  let size: number | undefined;
  try { size = fs.statSync(path.join(d, f)).size; } catch {}
  items.push({ src: `/${base}/${f}`, title: humanize(path.basename(f, ext)), ext, size });
    }
  }
  return items;
}
