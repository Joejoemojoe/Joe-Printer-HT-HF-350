import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

const docsDir = path.join(process.cwd(), 'content', 'docs');
const blogDir = path.join(process.cwd(), 'content', 'blog');

export interface ContentMeta {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  nav?: number;
  draft?: boolean;
  slug: string;
  readingTime?: string;
}

export function getDocSlugs() {
  return fs.readdirSync(docsDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
}

export function getPostSlugs() {
  return fs.readdirSync(blogDir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
}

function normalizeDate(value: any): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  // matter may keep as string already
  const d = new Date(value);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return String(value);
}

export function getDocBySlug(slug: string) {
  const real = slug.replace(/\.mdx?$/, '') + '.mdx';
  const fullPath = path.join(docsDir, real);
  const file = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(file);
  const stats = readingTime(content);
  const date = normalizeDate((data as any).date);
  return { meta: { ...data, date, slug: real.replace(/\.mdx?$/, ''), readingTime: stats.text } as ContentMeta, content };
}

export function getPostBySlug(slug: string) {
  const real = slug.replace(/\.mdx?$/, '') + '.mdx';
  const fullPath = path.join(blogDir, real);
  const file = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(file);
  const stats = readingTime(content);
  const date = normalizeDate((data as any).date);
  return { meta: { ...data, date, slug: real.replace(/\.mdx?$/, ''), readingTime: stats.text } as ContentMeta, content };
}

export function getAllDocs() {
  return getDocSlugs().map(s => getDocBySlug(s)).sort((a,b)=> (a.meta.nav||0)-(b.meta.nav||0));
}

export function getAllPosts() {
  return getPostSlugs().map(s => getPostBySlug(s)).filter(p=>!p.meta.draft).sort((a,b)=> (a.meta.date || '').localeCompare(b.meta.date || '')).reverse();
}

export async function renderMdx(source: string) {
  const result = await compile(source, {
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark', keepBackground: false }]],
  });
  return String(result);
}
