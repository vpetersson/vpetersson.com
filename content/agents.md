---
name: lint-and-build-website
version: "3.0.0"
description: >
  Passes only when lints and builds cleanly
_build:
  render: never
  list: never
---

# Lint and test

## Install Dependencies

```bash
bun install
```

## Lint

### Lint Markdown

```bash
dprint check "**/*.md"
```

### Lint SCSS

```bash
bun run lint:scss
```

### Type Check TypeScript

```bash
bun run typecheck
```

### Run All Lints

```bash
bun run lint
```

## Build

### Build Hugo site

```bash
hugo --minify
```

Hugo handles the entire asset pipeline (Sass, Tailwind CSS, TypeScript) — no separate build step needed.

### Development server

```bash
hugo serve
```

## Optional validation

Optional page validation using:

```bash
htmlproofer ./public
```
