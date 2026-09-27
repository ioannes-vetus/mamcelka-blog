import {parse, type HTMLElement} from 'node-html-parser';
import {readFileSync, writeFileSync, existsSync, readdirSync} from 'fs';
import {join, sep} from 'path';

interface SearchDocument {
  id: number;
  title: string;
  section: string;
  content: string;
  url: string;
}

const MAX_CONTENT_LENGTH = 2000;

// Everything under blog/ except these listing/tag/archive/author/pagination
// pages is a single post permalink — custom slugs mean the path itself can't
// tell a post apart from a listing page, so listing pages are named instead.
const BLOG_LISTING_PREFIXES = [
  'blog/page/',
  'blog/tags/',
  'blog/archive/',
  'blog/authors/',
];

function isBlogPostPage(relPath: string): boolean {
  if (!relPath.startsWith('blog/')) return false;
  if (relPath === 'blog/index.html') return false;
  return !BLOG_LISTING_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

export function buildSearchIndex(outDir: string): void {
  if (!existsSync(outDir)) return;

  const documents: SearchDocument[] = [];
  let id = 0;

  const files = readdirSync(outDir, {recursive: true, encoding: 'utf-8'});
  const htmlFiles = files.filter((f) => f.endsWith('index.html'));

  for (const file of htmlFiles) {
    const relPath = file.split(sep).join('/');
    const root = parse(readFileSync(join(outDir, file), 'utf-8'));

    const isBlogPost = isBlogPostPage(relPath);
    const content = isBlogPost
      ? root.querySelector('article .markdown')
      : root.querySelector('[data-search-content]');
    if (!content) continue;

    const pageTitle =
      (isBlogPost
        ? root.querySelector('article h1')?.textContent
        : content.querySelector('header h1')?.textContent ||
          content.querySelector('h1')?.textContent
      )?.trim() || '';

    const url = '/' + relPath.replace(/\/?index\.html$/, '');

    for (const el of content.querySelectorAll('header')) {
      el.remove();
    }

    const headings = content.querySelectorAll('h2, h3');

    if (headings.length === 0) {
      const text = normalize(content.textContent);
      if (text) {
        documents.push({
          id: id++,
          title: pageTitle,
          section: '',
          content: text,
          url,
        });
      }
      continue;
    }

    const introText = collectTextBefore(content, headings[0]);
    if (introText) {
      documents.push({
        id: id++,
        title: pageTitle,
        section: '',
        content: introText,
        url,
      });
    }

    for (const heading of headings) {
      const sectionTitle = normalize(heading.textContent);
      const anchor = heading.getAttribute('id') || '';
      const sectionContent = collectTextAfterHeading(heading);
      if (sectionContent) {
        documents.push({
          id: id++,
          title: pageTitle,
          section: sectionTitle,
          content: sectionContent,
          url: anchor ? `${url}#${anchor}` : url,
        });
      }
    }
  }

  writeFileSync(join(outDir, 'search-index.json'), JSON.stringify(documents));
  console.log(
    `[search] Indexed ${documents.length} sections from ${htmlFiles.length} pages`,
  );
}

function normalize(text: string | undefined): string {
  return (text || '')
    .replace(/​/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_CONTENT_LENGTH);
}

function collectTextAfterHeading(heading: HTMLElement): string {
  const parts: string[] = [];
  let sibling = heading.nextElementSibling;
  while (sibling && !/^H[23]$/.test(sibling.tagName)) {
    parts.push(sibling.textContent);
    sibling = sibling.nextElementSibling;
  }
  return normalize(parts.join(' '));
}

function collectTextBefore(parent: HTMLElement, target: HTMLElement): string {
  const parts: string[] = [];
  for (const child of parent.childNodes) {
    if (child === target) break;
    parts.push(child.textContent);
  }
  return normalize(parts.join(' '));
}
