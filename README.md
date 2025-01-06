## vpetersson.com

### Adding new gems

To add new gems to the project:

```bash
# Add a new gem using docker compose
docker compose run --rm web bundle add jekyll-seo-tag  # Replace with the gem you want to add
```

### Updating dependencies

To update all dependencies in the lockfile:

```bash
docker compose run --rm web bundle update
```

### Running Linters

The project uses Docker-based linting for CSS, HTML, JavaScript, and Markdown files. To run the linters:

```bash
# Build the linter image (only needed once)
docker build -t site-linters -f Dockerfile.lint .

# Run all linters
docker run --rm -v ${PWD}:/app site-linters

# Run specific linters
docker run --rm -v ${PWD}:/app site-linters stylelint "**/*.css"
docker run --rm -v ${PWD}:/app site-linters htmlhint "**/*.html"
docker run --rm -v ${PWD}:/app site-linters eslint "**/*.js"
docker run --rm -v ${PWD}:/app site-linters markdownlint "**/*.md"
```

The linting configuration is defined in:
- `.stylelintrc.json` - CSS rules
- `.htmlhintrc` - HTML rules
- `.eslintrc.json` - JavaScript rules
- `.markdownlint.json` - Markdown rules
