## vpetersson.com

Hugo-based personal site combining a tech blog, video podcast, and professional portfolio. Hosted on GitHub Pages.

### Development

```bash
# Install dependencies
bun install

# Local development (live reload on localhost:1313)
hugo serve

# Production build
hugo --minify
```

### Linting

```bash
# Run all linters
bun run lint

# Individual linters
bun run lint:markdown
bun run lint:scss
bun run typecheck
```
