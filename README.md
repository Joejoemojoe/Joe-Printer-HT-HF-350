# Joe 3D Printer Site

Modern GitHub-inspired documentation portal for a custom 3D printer project.

## Stack
- Next.js 14 (App Router)
- MDX content (docs + blog)
- Tailwind CSS (GitHub dark style palette)
- next-mdx-remote for MDX rendering
- Shiki highlighting via rehype-pretty-code
- Local search (Fuse.js)
- Light/Dark toggle (prefers-color-scheme + localStorage)
- Image optimization & video embeds

## Commands
```bash
npm install
npm run dev
```

## Content
Add docs in `content/docs/*.mdx` and posts in `content/blog/*.mdx` with frontmatter:
```md
---
 title: Example Title
 description: Short summary.
 date: 2025-09-05
 tags: [tag1, tag2]
 draft: false
---
```

## Search
Index is built at request time in the search page using Fuse.js. For larger sites, prebuild a JSON index.

## Syntax Highlighting
Code blocks rendered through MDX use `rehype-pretty-code` with the `github-dark` theme. Adjust in `src/lib/mdx.ts`.

## Theming
Theme toggle button persists preference to localStorage. System preference used on first load.

## Deployment
Deploy via Vercel for best experience.

## Future Ideas
- Prebuilt JSON search index
- OpenGraph image generation
- RSS feed for blog posts
- MDX components for callouts / tips
