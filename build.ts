#!/usr/bin/env bun

import { $ } from "bun";

// Build TypeScript files
console.log("Building TypeScript...");
await Bun.build({
  entrypoints: [
    './src/main.ts',
    './src/search.ts', 
    './src/code-blocks.ts'
  ],
  outdir: './assets/js',
  target: 'browser',
  minify: false,
});

// Build Sass
console.log("Building Sass...");
await $`bun x sass --load-path=_sass _sass/main.scss assets/css/main.css --style=compressed --no-source-map`;

// Build CSS with PostCSS
console.log("Building CSS with PostCSS...");
await $`bun x postcss _assets/css/tailwind.css -o assets/css/styles.css`;

console.log("Build complete!");
