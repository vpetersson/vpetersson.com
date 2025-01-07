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

The project uses linters for CSS, HTML, JavaScript, and Markdown files. To run the linters:

```bash
# Install dependencies
npm ci

# Run all linters
PATH="$PWD/node_modules/.bin:$PATH" ./bin/lint-all.sh

# Run specific linters
PATH="$PWD/node_modules/.bin:$PATH" stylelint "**/*.css"
PATH="$PWD/node_modules/.bin:$PATH" htmlhint "**/*.html"
PATH="$PWD/node_modules/.bin:$PATH" eslint "**/*.js"
PATH="$PWD/node_modules/.bin:$PATH" markdownlint "**/*.md"
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
