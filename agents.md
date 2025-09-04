---
name: lint-and-build-website
version: "1.0.0"
description: >
  Passes only when lints and builds cleanly

---

# Lint and test

## Lint Markdown

```bash
cargo install dprint
dprint check "**/*.md"
```

## Test build

```bash
bundle install
bundle exec jekyll build
```

## Optional validation

Optional page validation using:

```bash
bundle exec htmlproofer ./_site
```
