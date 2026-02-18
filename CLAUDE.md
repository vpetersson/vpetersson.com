# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hugo-based personal site (vpetersson.com) combining a tech blog, video podcast ("Nerding Out with Viktor"), and professional portfolio. Hosted on GitHub Pages.

## Build & Development Commands

```bash
# Local development (live reload on localhost:1313)
hugo serve

# Production build
hugo --minify

# Linting (markdown via dprint, SCSS via stylelint, TypeScript type checking)
bun run lint

# Individual linters
bun run lint:markdown
bun run lint:markdown:fix    # auto-fix markdown
bun run lint:scss
bun run lint:scss:fix        # auto-fix SCSS
bun run typecheck

# Install JS dependencies (Tailwind, Lunr.js, linting tools)
bun install
```

## Build Pipeline

Hugo handles the entire build pipeline — no separate build step needed:

- **Sass**: `assets/css/main.scss` → compiled via Hugo's built-in Sass transpiler
- **Tailwind CSS v4**: `assets/css/tailwind.css` → processed via `css.TailwindCSS` pipe
- **TypeScript**: `assets/js/*.ts` → compiled via `js.Build` (esbuild)
- **Concatenation**: Sass + Tailwind + native.css → single bundled CSS file
- **Production**: minified + fingerprinted assets

## Content Structure

**Blog posts** (`content/blog/`): `YYYY-MM-DD-slug.md` with frontmatter:

```yaml
title: "Title"
date: 'YYYY-MM-DDTHH:MM:SSZ'
tags:
- tag1
- tag2
```

**Podcast episodes** (`content/podcast/`): `SXXEXX.md` (e.g., `S03E01.md`) with frontmatter:

```yaml
title: "Episode Title"
date: "YYYY-MM-DDTHH:MM:SS+00:00"
duration: 72          # minutes
season: 3
episode: 1
guests:
  - Guest Name
description: |
  Multi-line description...
youtube: "https://..."
spotify: "https://..."
apple: "https://..."
amazon: "https://..."
```

**Podcast transcripts** (`data/transcripts/`): JSON files accessed via `site.Data.transcripts`.

**Events** (`data/events.yaml`): Speaking engagements, panels, and external podcast appearances organized by year. Set `upcoming: true` for future events.

**Data** (`data/main.yaml`): Site-wide config — navigation, social links, podcast links, header image.

## Architecture

- **Base layout** (`layouts/_default/baseof.html`): HTML shell with head, header, main block, footer, JS loading
- **Section layouts** (`layouts/blog/`, `layouts/podcast/`): `single.html` and `list.html` for each content type
- **Page layouts** (`layouts/about/`, `layouts/projects/`, `layouts/consulting/`, `layouts/search/`): Custom single-page layouts
- **Partials** (`layouts/partials/`): ~25 reusable components — head, header, footer, nav, content cards, schema markup, hero, events, pagination
- **Taxonomies**: Hugo auto-generates tag pages (`layouts/tags/term.html`, `layouts/tags/list.html`)
- **TypeScript** (`assets/js/`): Client-side modules — mobile menu, Lunr.js search, code block copy buttons, parallax effects, GitHub star counts
- **Styling**: Tailwind CSS v4 (dark theme, custom palette in `assets/css/tailwind.css`) + custom Sass (`assets/css/`)
- **Config** (`hugo.toml`): Permalinks, taxonomies, output formats (HTML, RSS, VideoSitemap), markup settings

## Key Patterns

- Blog permalink format: `/:year/:month/:day/:slug/` (matches legacy Jekyll URLs)
- Podcast URLs: `/podcast/:filename/`
- Transcript loading: `{{ index site.Data.transcripts (lower .File.BaseFileName) }}`
- Reading time: 183 WPM (custom partial, not Hugo's built-in `.ReadingTime`)
- YouTube ID extraction: `replaceRE` in templates
- Combined content feeds: `union` of blog + podcast pages, sorted by date

## CI/CD

Two GitHub Actions workflows on `master`:

- **build-deploy.yml**: Hugo + Bun setup → `bun install` → `hugo --minify` → deploy to GitHub Pages (also runs daily at 1 AM UTC)
- **lint.yml**: Runs `bun run lint`; also runs `hugo --minify` build check

## AI Prompt Templates

`.prompts/` contains templates for podcast content generation (episode descriptions, transcripts, YouTube shorts).
