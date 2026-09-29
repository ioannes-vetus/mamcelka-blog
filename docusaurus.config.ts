import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import {buildSearchIndex} from './src/searchIndex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Served on the custom domain https://mamcelka.sk/ (see static/CNAME), so it sits at the
// domain root rather than under a GitHub Pages project-site subpath.
const baseUrl = '/';

const config: Config = {
  title: 'Mamčelka',
  tagline: 'Úvahy o výchove z pohľadu mamy & učiteľky',
  favicon: 'img/favicon.ico',

  url: 'https://mamcelka.sk',
  baseUrl,

  organizationName: 'ioannes-vetus',
  projectName: 'mamcelka-blog',

  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'sk',
    locales: ['sk'],
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
          blogSidebarTitle: 'Všetky príspevky',
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
    image: 'img/social-card.jpeg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Mamčelka',
      items: [{to: '/blog', label: 'Blog', position: 'left'}],
    },
    footer: {
      style: 'dark',
      links: [
        {
          html: `<a href="${baseUrl}blog/rss.xml" target="_blank" rel="noopener noreferrer" title="RSS Feed" aria-label="RSS Feed" class="footer-social-link"><img src="${baseUrl}img/rss.svg" width="14" height="14" alt="RSS Feed"/></a>`,
        },
        {
          html: `<a href="https://www.instagram.com/_nataliastara_/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" class="footer-social-link"><img src="${baseUrl}img/instagram.svg" width="14" height="14" alt="Instagram"/></a>`,
        },
        {
          html: `<a href="mailto:stranakovan01@gmail.com" title="E-mail" aria-label="E-mail" class="footer-social-link"><img src="${baseUrl}img/mail.svg" width="14" height="14" alt="E-mail"/></a>`,
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mamčelka`,
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
