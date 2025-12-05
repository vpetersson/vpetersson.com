---
name: lint-and-build-website
version: "2.0.0"
description: >
  Passes only when lints and builds cleanly
---

# Lint and test

## Install Dependencies

```bash
bun install
bundle install
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

### Build TypeScript, Sass, and CSS

```bash
bun run build
```

This generates:

- TypeScript → JavaScript in `assets/js/`
- Font Awesome CSS in `assets/css/`
- Font Awesome webfonts in `assets/webfonts/`
- Compiled Sass and PostCSS

### Build Jekyll site

```bash
bundle exec jekyll build
```

Jekyll will automatically include the generated files because they're listed in `_config.yml` under `include`.

### Full build (CI/CD)

```bash
# Build assets first, then Jekyll
bun run build && bundle exec jekyll build
```

## Optional validation

Optional page validation using:

```bash
bundle exec htmlproofer ./_site
```
