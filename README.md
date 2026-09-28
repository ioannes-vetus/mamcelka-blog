# Mamčelka

Personal blog for Natália Stará, built with [Docusaurus](https://docusaurus.io/).

## Development

```bash
yarn install
yarn start
```

Starts a local dev server at `http://localhost:3000/` with hot reload.

## Other commands

| Command             | Description                               |
|---------------------|-------------------------------------------|
| `yarn build`        | Production build to `build/`              |
| `yarn serve`        | Serve an existing `build/` output locally |
| `yarn preview`      | `build` + `serve` in one step             |
| `yarn typecheck`    | Type-check the project with `tsc`         |
| `yarn format`       | Format `src/` with Prettier               |
| `yarn format:check` | Check formatting without writing          |
| `yarn clear`        | Clear the Docusaurus cache                |

## Writing a blog post

Add a new Markdown file under `blog/`, named `YYYY-MM-DD-slug.md`, with front matter like:

```md
---
slug: my-post
title: My Post
authors: [author]
tags: [general]
---

Preview text shown in the blog list.

<!-- truncate -->

The rest of the post, only shown on the full post page.
```

## Deployment

Pushing to `main` triggers `.github/workflows/ci.yml`, which checks formatting, builds the site, and
deploys it to GitHub Pages, served at the custom domain `https://mamcelka.sk/` (see `static/CNAME`).

## Commit messages

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g.
`feat: add contact section`, `fix: correct footer color in dark mode`). This is enforced locally by
a pre-commit hook — see below.

## Git hooks

Husky + lint-staged run on every commit:

- Prettier is applied to staged `src/**/*.{ts,tsx,css}` files
- Commit messages are validated against Conventional Commits via commitlint

Hooks are installed automatically after `yarn install` (via the `prepare` script).
