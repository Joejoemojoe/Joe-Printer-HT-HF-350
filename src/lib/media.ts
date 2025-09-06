import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const VID_EXT = new Set(['.mp4', '.webm', '.ogv']);

export type GalleryItem = { src: string; alt: string };
export type VideoItem = { src: string; title: string; poster?: string };

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
