#!/usr/bin/env bun

import { $ } from "bun";
import { copyFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Build TypeScript files
console.log("Building TypeScript...");
await Bun.build({
  entrypoints: [
    './src/main.ts',
    './src/search.ts', 
    './src/code-blocks.ts',
    './src/hero-parallax.ts',
    './src/github-stars.ts'
  ],
  outdir: './assets/js',
  target: 'browser',
  minify: false,
});

// Copy Font Awesome CSS files
console.log("Copying Font Awesome CSS...");
const cssDir = './assets/css';
if (!existsSync(cssDir)) {
  await mkdir(cssDir, { recursive: true });
}

// Check both local node_modules and Docker location
const nodeModulesPath = existsSync('./node_modules/@fortawesome')
  ? './node_modules'
  : '/usr/local/bun-deps/node_modules';
const fontawesomeCss = `${nodeModulesPath}/@fortawesome/fontawesome-free/css`;
const cssFiles = {
  'fontawesome.min.css': 'fontawesome-core.css',
  'solid.min.css': 'fontawesome-solid.css',
  'brands.min.css': 'fontawesome-brands.css',
};

for (const [srcFile, destFile] of Object.entries(cssFiles)) {
  const src = join(fontawesomeCss, srcFile);
  const dest = join(cssDir, destFile);
  if (existsSync(src)) {
    await copyFile(src, dest);
  }
}

// Copy Font Awesome webfonts
console.log("Copying Font Awesome webfonts...");
const webfontsDir = './assets/webfonts';
if (!existsSync(webfontsDir)) {
  await mkdir(webfontsDir, { recursive: true });
}

const fontawesomeWebfonts = `${nodeModulesPath}/@fortawesome/fontawesome-free/webfonts`;
const webfontFiles = [
  'fa-solid-900.woff2',
  'fa-solid-900.ttf',
  'fa-brands-400.woff2',
  'fa-brands-400.ttf',
];

for (const file of webfontFiles) {
  const src = join(fontawesomeWebfonts, file);
  const dest = join(webfontsDir, file);
  if (existsSync(src)) {
    await copyFile(src, dest);
  }
}

// Build Sass
console.log("Building Sass...");
await $`bun x sass --load-path=_sass _sass/main.scss assets/css/main.css --style=compressed --no-source-map`;

// Build CSS with PostCSS
console.log("Building CSS with PostCSS...");
await $`bun x postcss _assets/css/tailwind.css -o assets/css/styles.css`;

console.log("Build complete!");
