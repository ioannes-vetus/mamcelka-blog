import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {buildSearchIndex} from './src/searchIndex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Served as a GitHub Pages project site: https://ioannes-vetus.github.io/pancelka-blog/
const baseUrl = '/pancelka-blog/';

const config: Config = {
  title: 'Pančelka',
  tagline: 'Notes on software and everything around it',
  favicon: 'img/favicon.ico',

  url: 'https://ioannes-vetus.github.io',
  baseUrl,

  organizationName: 'ioannes-vetus',
  projectName: 'pancelka-blog',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Inter:wght@400;500;600&display=swap',
      type: 'text/css',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: false,
        blog: {
          routeBasePath: '/blog',
          showReadingTime: true,
          postsPerPage: 10,
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All posts',
          feedOptions: {
            type: ['rss'],
            copyright: `Copyright © ${new Date().getFullYear()}`,
          },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Pančelka',
      items: [{to: '/blog', label: 'Blog', position: 'left'}],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Pančelka<a href="${baseUrl}blog/rss.xml" target="_blank" rel="noopener noreferrer" title="RSS Feed" aria-label="RSS Feed" class="footer-rss-link"><img src="${baseUrl}img/rss.svg" width="14" height="14" alt="RSS Feed"/></a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    function searchIndexPlugin() {
      return {
        name: 'search-index',
        async postBuild({outDir}: {outDir: string}) {
          buildSearchIndex(outDir);
        },
      };
    },
  ],
};

export default config;
