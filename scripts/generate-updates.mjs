#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const uploadsDir = path.join(repoRoot, 'public', 'uploads');
const blogDir = path.join(repoRoot, 'content', 'blog');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.heic']);
const VID_EXT = new Set(['.mp4', '.webm', '.ogv', '.mov']);
// GitHub repository info (for public LFS raw links)
const GITHUB_OWNER = 'Joejoemojoe';
const GITHUB_REPO = 'Joe-Printer-HT-HF-350';

function humanize(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function generatePostForFile(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const title = humanize(base);
  const date = today();
  const slugBase = `upload-${slugify(base)}`;
  let outName = `${date}-${slugBase}.mdx`;
  // Avoid collisions if multiple files share base
  let idx = 1;
  while (fs.existsSync(path.join(blogDir, outName))) {
    outName = `${date}-${slugBase}-${idx++}.mdx`;
  }

  const fname = path.basename(file);
  const rel = `/uploads/${fname}`;
  const encFile = encodeURIComponent(fname).replace(/%2F/g, '/');
  const lfs = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/public/uploads/${encFile}`;
  const isImg = IMG_EXT.has(ext);
  const isVid = VID_EXT.has(ext);
  const mime = ext === '.mp4' ? 'video/mp4' : ext === '.webm' ? 'video/webm' : ext === '.ogv' ? 'video/ogg' : ext === '.mov' ? 'video/quicktime' : '';
  // Try to find a poster image alongside the video (same basename, any image ext)
  let poster = '';
  if (isVid) {
    for (const cand of ['.jpg', '.jpeg', '.png', '.webp']) {
      const p = path.join(uploadsDir, `${base}${cand}`);
      if (fs.existsSync(p)) {
        poster = `/uploads/${path.basename(p)}`;
        break;
      }
    }
  }
  const displayBlock = isImg
    ? `### Display\n\n![${title}](${rel})\n\n[Download from LFS](${lfs})`
    : isVid
    ? `### Display\n\n<video controls preload="metadata"${poster ? ` poster="${poster}"` : ''} style={{ width: '100%' }}><source src="${rel}"${mime ? ` type="${mime}"` : ''} /></video>\n\n[Download from LFS](${lfs})`
    : `### Display\n\n[Download file](${rel})  \\n+[Download from LFS](${lfs})`;

  const mdx = `---\n` +
    `title: "${title}"\n` +
    `description: "Uploaded ${path.basename(file)}"\n` +
    `date: ${date}\n` +
    `tags: [upload]\n` +
    `draft: false\n` +
    `---\n\n` +
    `Auto-generated update for ${path.basename(file)}.\n\n` +
    `${displayBlock}\n`;

  fs.writeFileSync(path.join(blogDir, outName), mdx, 'utf8');
  return outName;
}

function main() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found at public/uploads. Nothing to do.');
    process.exit(0);
  }
  ensureDir(blogDir);
  const files = fs
    .readdirSync(uploadsDir)
    .filter((f) => fs.statSync(path.join(uploadsDir, f)).isFile())
    .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()) || VID_EXT.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    console.log('No media files found in public/uploads.');
    process.exit(0);
  }

  const created = [];
  for (const f of files) {
    const out = generatePostForFile(f);
    created.push(out);
  }
  console.log(`Generated ${created.length} update post(s):`);
  for (const c of created) console.log(' -', c);
}

main();
