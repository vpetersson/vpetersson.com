# blog.viktorpetersson.com

## Adding new gems

To add new gems to the project:

```bash
# Add a new gem using docker compose
docker compose run --rm web bundle add jekyll-seo-tag  # Replace with the gem you want to add
```

## Updating dependencies

To update all dependencies in the lockfile:

```bash
docker compose run --rm web bundle update
```

## Running Linters

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

## Security Audits

The project uses security auditing tools for both Ruby and Node.js dependencies.

### Ruby Dependencies

To check for security vulnerabilities in Ruby gems:

```bash
# Run bundler-audit inside Docker
docker compose run --rm web bash -c "gem install bundler-audit && bundle-audit check --update"
```

### Node.js Dependencies

To check for security vulnerabilities in npm packages:

```bash
# Run npm audit inside Docker
docker compose run --rm web npm audit

# To automatically fix vulnerabilities when possible
docker compose run --rm web npm audit fix
```
