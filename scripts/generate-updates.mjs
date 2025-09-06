#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const uploadsDir = path.join(repoRoot, 'public', 'uploads');
const blogDir = path.join(repoRoot, 'content', 'blog');

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.heic']);
const VID_EXT = new Set(['.mp4', '.webm', '.ogv', '.mov']);

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

  const rel = `/uploads/${path.basename(file)}`;
  const isImg = IMG_EXT.has(ext);
  const isVid = VID_EXT.has(ext);
  const embed = isImg
    ? `![${title}](${rel})`
    : isVid
  ? `<video controls style={{ width: '100%' }} src="${rel}"></video>`
    : `[Download file](${rel})`;

  const mdx = `---\n` +
    `title: "${title}"\n` +
    `description: "Uploaded ${path.basename(file)}"\n` +
    `date: ${date}\n` +
    `tags: [upload]\n` +
    `draft: false\n` +
    `---\n\n` +
    `Auto-generated update for ${path.basename(file)}.\n\n` +
    `${embed}\n`;

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
