# TypeScript Source Files

This directory contains the TypeScript source files for the website's client-side JavaScript.

## Files

- **`types.ts`** - Type definitions for search functionality and global interfaces
- **`main.ts`** - Mobile menu toggle functionality
- **`search.ts`** - Search functionality using Lunr.js
- **`code-blocks.ts`** - Progressive enhancement for code blocks (copy button, language labels, keyboard shortcuts)

## Building

The TypeScript files are compiled to JavaScript using Bun's built-in bundler:

```bash
bun run build
```

This compiles all `.ts` files and outputs them to `assets/js/` as browser-compatible JavaScript bundles.

## Type Checking

To run TypeScript type checking without emitting files:

```bash
bun run typecheck
```

## Configuration

- **`tsconfig.json`** - TypeScript compiler configuration
- **`build.ts`** - Build script that handles TypeScript, Sass, and CSS compilation

## Generated Files

The following files in `assets/js/` are generated from TypeScript and should not be edited directly:

- `main.js`
- `search.js`
- `code-blocks.js`
- `types.js`

These files are gitignored and regenerated during the build process.
