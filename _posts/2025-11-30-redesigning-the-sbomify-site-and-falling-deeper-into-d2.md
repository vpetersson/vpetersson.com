---
layout: post
title: "How I Streamlined My Jekyll Diagram Workflow with D2 and Bun"
date: '2025-11-30T12:00:00Z'
tags: [sbomify, d2, diagrams, jekyll, automation, ci-cd]
---

Over the last few days, I gave the [sbomify website](https://sbomify.com) a much-needed overhaul. The previous iteration didn’t really reflect what we’re doing, especially as the product has matured. The new version leans heavily on diagrams to communicate concepts more clearly.

For the past year, I’ve more or less standardized on [`d2`](https://d2lang.com/) for diagrams. I’ve gone through the usual journey: Lucidchart, Mermaid, UML, and a few others. They all work and have their own strengths and weaknesses, but each brought its own annoyances that made me eventually drop them. `d2`, on the other hand, instantly clicked. It’s readable, intuitive, and produces diagrams that actually look good without wrestling with the tool. It’s not perfect, but it’s the closest I’ve found to something that fits the way I think.

One of the things I enjoy most is that I can quickly write out the basic diagrams due to its simple syntax and “vibe-code” them into something more elaborate. They live alongside my notes in [Obsidian](https://obsidian.md/) (which I've recently fallen in love with), where the `d2` plugin renders everything nicely. It’s a surprisingly satisfying workflow.

## The Problem: Keeping Diagrams in Sync

The sbomify site itself is a fairly unorthodox Jekyll setup running on GitHub Pages. Over the last year, I’ve added more and more rendered `d2` diagrams across articles and pages. That created a maintenance headache: keeping SVGs in sync across posts is tedious. Yes, you *can* reuse assets, but minor edits accumulate, and the overhead grows quickly.

The obvious question became: *why not just use `d2` directly in the content?*

## Experimenting With Native `d2` in Markdown

My first idea was to treat `d2` like any other fenced code block, similar to how I use it in Obsidian. Simple in theory, but tricky in practice. Injecting `d2` into Jekyll’s Markdown pipeline through the `rouge` syntax highlighter, proved far more complex than I’d hoped.

Instead, I took a more pragmatic path.

## The Pipeline Approach

I added a build step that runs during CI (and locally) to render `d2` diagrams using [`bun run build:d2`](https://github.com/sbomify/sbomify.com/#building-diagrams), which in turn calls on [`watch-d2.ts`](https://github.com/sbomify/sbomify.com/blob/master/scripts/watch-d2.ts). While I was at it, I moved all diagram styling into a [theme](https://github.com/sbomify/sbomify.com/blob/master/_d2/theme.d2). That means:

* Diagrams are significantly smaller
* The style is consistent everywhere
* Updating the styling automatically updates every diagram site-wide

It’s a clean setup, and it removes an entire class of maintenance problems.

Everything now runs as part of the CI pipeline, along with the rest of the linting and checks. The workflow feels solid, and more importantly, sustainable.