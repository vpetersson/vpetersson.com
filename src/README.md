# TypeScript Source Files

This directory contains the TypeScript source files for the website's client-side JavaScript.

## Files

- **`types.ts`** - Type definitions for search functionality and global interfaces
- **`main.ts`** - Mobile menu with accessibility features (ARIA attributes, keyboard navigation, focus management)
- **`search.ts`** - Full-text search using Lunr.js (bundled as dependency)
- **`code-blocks.ts`** - Progressive enhancement for code blocks (copy button, language labels, keyboard shortcuts)
- **`hero-parallax.ts`** - Parallax effect for hero section decoration dots

## Building

The TypeScript files are compiled to JavaScript using Bun's built-in bundler:

```bash
bun run build
```

This compiles all `.ts` files and outputs them to `assets/js/` as browser-compatible JavaScript bundles with all dependencies included.

## Dependencies

External packages used:

- **`lunr`** - Full-text search library (bundled into `search.js`)
- **`@types/lunr`** - TypeScript type definitions for Lunr
- **`@fortawesome/fontawesome-free`** - Icon library (CSS and webfonts copied to assets)

## Type Checking

To run TypeScript type checking without emitting files:

```bash
bun run typecheck
```

## Linting

To run all linters (includes type checking):

```bash
bun run lint
```

## Configuration

- **`tsconfig.json`** - TypeScript compiler configuration
- **`build.ts`** - Build script that handles TypeScript, Sass, and CSS compilation

## Generated Files

The following files are generated during build and should not be edited directly:

### JavaScript (from TypeScript)

- `assets/js/main.js` (~2KB) - Mobile menu functionality
- `assets/js/search.js` (~64KB) - Search functionality with Lunr.js bundled
- `assets/js/code-blocks.js` (~6KB) - Code block enhancements
- `assets/js/hero-parallax.js` (~1.5KB) - Hero parallax effects

### CSS and Fonts (from node_modules)

- `assets/css/fontawesome-core.css` (~57KB) - Font Awesome core styles
- `assets/css/fontawesome-solid.css` (~600B) - Font Awesome solid icons
- `assets/css/fontawesome-brands.css` (~15KB) - Font Awesome brand icons
- `assets/webfonts/fa-*.woff2` - Font Awesome webfont files

All generated files are gitignored and regenerated during the build process.

## Best Practices Applied

### Type Safety

- Strict TypeScript configuration
- Proper type annotations throughout
- No use of `any` except where necessary for external libraries
- Readonly types for immutable data

### Code Quality

- Comprehensive JSDoc comments
- Named constants for magic values
- Pure functions where possible
- Proper error handling with user feedback
- DRY principle (Don't Repeat Yourself)

### Accessibility

- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML generation
- Proper event handlers with passive listeners where appropriate

### Security

- HTML escaping to prevent XSS attacks
- Proper use of modern APIs (Clipboard API with fallback)
- No inline event handlers
- CSP-friendly code

### Performance

- Event delegation where appropriate
- Passive event listeners for scroll/touch events
- Efficient DOM manipulation
- Minimal reflows/repaints
- Bundled dependencies (no separate HTTP requests)
