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

function guessDescription(baseName, { isImg, isVid }) {
  const s = baseName.toLowerCase();
  const bits = [];
  // Subject keywords
  if (s.includes('toolhead') && s.includes('5015')) bits.push('Toolhead cooling with 5015 fan');
  else if (s.includes('toolhead') && s.includes('peek')) bits.push('Toolhead printed in PEEK');
  else if (s.includes('toolhead')) bits.push('Toolhead assembly');
  if (s.includes('frame')) bits.push('Printer frame');
  if (s.includes('gantry')) bits.push('Gantry progress');
  if (s.includes('wiring')) bits.push('Wiring and electronics');
  if (s.includes('linear') && s.includes('rail')) bits.push('Linear rails maintenance');
  if (s.includes('mosquito') || s.includes('magnum')) bits.push('Mosquito Magnum hotend');
  if (s.includes('beacon') || s.includes('eddy')) bits.push('Beacon eddy-current probe mount');
  if (s.includes('motor')) bits.push('Stepper motors');
  if (s.includes('printed')) bits.push('Printed parts');
  if (s.includes('cad')) bits.push('CAD update');
  if (bits.length === 0) bits.push('Build update');
  const media = isVid ? 'video' : isImg ? 'photo' : 'file';
  return `${bits.join(' · ')} (${media}).`;
}

function makeSummary(title, baseName, { isImg, isVid }) {
  // Build a ~200-word narrative using lightweight heuristics from filename
  const s = baseName.toLowerCase();
  const topics = [];
  if (s.includes('toolhead') && s.includes('5015')) topics.push('toolhead cooling with a 5015 blower');
  else if (s.includes('toolhead') && s.includes('peek')) topics.push('a high-temperature PEEK toolhead');
  else if (s.includes('toolhead')) topics.push('the evolving toolhead assembly');
  if (s.includes('frame')) topics.push('the printer frame and structural alignment');
  if (s.includes('gantry')) topics.push('gantry setup and motion system');
  if (s.includes('wiring')) topics.push('wiring, harness routing, and electronics layout');
  if (s.includes('linear') && s.includes('rail')) topics.push('linear rail cleaning and lubrication');
  if (s.includes('mosquito') || s.includes('magnum')) topics.push('a Slice Engineering Mosquito Magnum hotend');
  if (s.includes('beacon') || s.includes('eddy')) topics.push('a Beacon eddy-current probe and its mounting');
  if (s.includes('motor')) topics.push('stepper motor selection and installation');
  if (s.includes('printed')) topics.push('printed parts fit and finish');
  if (s.includes('cad')) topics.push('CAD iterations and mounting geometry');
  if (topics.length === 0) topics.push('general build progress and checks');

  const medium = isVid ? 'This short video' : isImg ? 'This photo' : 'This file';
  const focus = topics[0];
  const lines = [];
  lines.push(`${medium} documents ${title}, focusing on ${focus}.`);
  if (isVid) {
    lines.push('It captures live behavior under real usage, including vibrations, acoustics, and any transient issues that are hard to see in stills.');
  } else if (isImg) {
    lines.push('A still frame helps inspect surface quality, part interfaces, and small details without motion blur.');
  }
  if (s.includes('toolhead')) {
    lines.push('The toolhead work here balances mass, stiffness, and thermal management. Cooling duct geometry and fan choice affect overhangs and small-feature fidelity, while weight influences ringing and acceleration limits.');
  }
  if (s.includes('gantry') || s.includes('frame')) {
    lines.push('Structural alignment is checked progressively; squareness and preload on the motion system are adjusted to reduce racking and binding, improving first-layer consistency and dimensional accuracy.');
  }
  if (s.includes('linear') && s.includes('rail')) {
    lines.push('Rails were cleaned and re-lubed to ensure smooth travel. Proper lubricant viscosity and even ball distribution reduce stick-slip and improve input-shaping results.');
  }
  if (s.includes('beacon') || s.includes('eddy')) {
    lines.push('The Beacon probe requires rigid mounting and appropriate stand-off. Care is taken to avoid thermal drift and to map bed topology reliably across the build surface.');
  }
  if (s.includes('mosquito') || s.includes('magnum')) {
    lines.push('The Mosquito Magnum is chosen for high flow at elevated temperatures. Mounting focuses on minimizing heat creep while preserving nozzle accessibility and part cooling paths.');
  }
  if (s.includes('cad')) {
    lines.push('CAD iterations here validate envelope clearances, fastener access, and serviceability. Fillets, chamfers, and ribbing are adjusted to manage stress and printability.');
  }
  lines.push('Next steps: verify fastener torque, confirm belt tension and tram, then run calibration prints (flow, temperature towers, and input shaping). Any anomalies seen here inform small CAD tweaks or wiring reroutes before finalizing.');
  return lines.join(' ');
}

function shouldDeleteGeneratedPost(filePath) {
  if (!filePath.endsWith('.md') && !filePath.endsWith('.mdx')) return false;
  const name = path.basename(filePath);
  if (name.startsWith('_TEMPLATE')) return false;
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    // Identify auto-generated posts by upload tag or old description pattern
    if (/\stags:\s*\[\s*upload\s*\]/i.test(txt)) return true;
    if (/^---[\s\S]*?description:\s*"?Uploaded\s+/i.test(txt)) return true;
  } catch {}
  return false;
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
  const description = guessDescription(base, { isImg, isVid });
  const summary = makeSummary(title, base, { isImg, isVid });
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
    ? `### Display\n\n<img src="${rel}" alt="${title}" style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} />\n\n[Download from LFS](${lfs})`
    : isVid
    ? `### Display\n\n<video controls preload="metadata"${poster ? ` poster="${poster}"` : ''} style={{ width: '100%' }}><source src="${rel}"${mime ? ` type="${mime}"` : ''} /></video>\n\n${poster ? `![Preview](${poster})\n\n` : ''}[Download from LFS](${lfs})`
    : `### Display\n\n[Download file](${rel})  \\\n+[Download from LFS](${lfs})`;

  const mdx = `---\n` +
    `title: "${title}"\n` +
    `description: "${description}"\n` +
    `date: ${date}\n` +
    `tags: [upload]\n` +
    `draft: false\n` +
    `---\n\n` +
  `Auto-generated update for ${path.basename(file)}.\n\n` +
  `### Summary\n\n${summary}\n\n` +
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
  // Clean previous auto-generated posts
  const existing = fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let removed = 0;
  for (const f of existing) {
    const full = path.join(blogDir, f);
    if (shouldDeleteGeneratedPost(full)) {
      fs.unlinkSync(full);
      removed++;
    }
  }
  if (removed) console.log(`Removed ${removed} existing auto-generated post(s).`);
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
