---
layout: post
title: "AI is Killing (Basic) SaaS, Part 2: From Link Shorteners to Linktrees"
date: '2026-01-14T12:00:00Z'
tags:
- rust
- ai
- cursor
- self-hosted
- open-source
---

In [Part 1](/2026/01/09/ai-is-eating-saas-building-an-ip-geolocation-api-in-two-hours), I replaced ipgeolocation.io with a self-hosted Rust service in under two hours. That was just one piece of a larger pattern we've been following at [Screenly](https://www.screenly.io).

This is the story of [DSLF](https://github.com/vpetersson/dslf)—a project that started as a link shortener and evolved into a Linktree killer.

## The Link Shortener

A few months ago, I got fed up paying for Rebrandly at Screenly. It's a bit.ly-style service, and while it worked fine, the monthly invoice felt silly for what amounts to a 301 redirect.

So I [hacked together DSLF](/2025/07/11/dslf-a-rust-hacking-cheaper-hosting-and-two-http-codes-i-didnt-know-about). It's a tiny Rust binary that reads a CSV and spits out redirects. I even wrote an import tool for Rebrandly to make migration painless.

It's been running on `go.srly.io` for Screenly and `301.vpetersson.com` for my personal stuff ever since.

## Next: Linktree

With the link shortener done, I turned to another commodity SaaS: Linktree.

You know these pages. They exist because Instagram only lets you add one link, so Linktree turns one link into many. Companies use them too—we do at Screenly.

The thing is, these are fundamentally simple pages. A profile picture, a bio, a list of links. Yet we pay monthly for what's essentially static HTML.

### First Attempt: Failed

I actually tried adding this to DSLF months ago. Cursor with the then-current model choked. The combination of multi-stage Docker builds, TypeScript for static site generation, and Rust for the server was too much for it.

So I shelved the PR.

### Second Attempt: Opus 4.5

This weekend I picked up that stale PR again. With Claude Opus 4.5, I had something working within an hour.

Then I added the bits that make it usable for a company:

- [Catppuccin](https://catppuccin.com) theming (Mocha, Macchiato, Frappé, Latte)
- Button styles (glass, solid, outline)
- Social icons for all the usual suspects
- Open Graph, Twitter Cards, JSON-LD for SEO
- Same tiny footprint as the redirect service

## How It Works

The key insight: the landing page should be fast, redirects should be flexible.

The landing page compiles from YAML to static HTML at Docker build time. No template rendering at runtime—just serving files. Sub-millisecond.

Redirects load from CSV at startup and can be mounted as a volume. No rebuild needed to add a new short link.

Configuration is dead simple:

```yaml
profile:
  name: "Screenly"
  bio: "The Secure Digital Signage Company"
  type: "organization"

theme:
  preset: "mocha"
  buttonStyle: "glass"

links:
  - title: "Get Started"
    url: "https://www.screenly.io/signup"
    icon: "fas fa-rocket"
    highlight: true
  - title: "Documentation"
    url: "https://developer.screenly.io"
    icon: "fas fa-book"
```

The Dockerfile uses a multi-stage build with a pre-built builder image:

```dockerfile
FROM vpetersson/dslf:builder AS static
COPY redirects.csv ./
COPY link-index.yaml ./
RUN bun run build

FROM vpetersson/dslf:latest
COPY --from=static /static/dist /app/static
COPY --from=static /static/redirects.csv /app/
```

Then just:

```bash
docker build -t my-links .
docker run -p 3000:3000 my-links
```

## The Tally

Three SaaS tools replaced at Screenly in the last few months:

| Original SaaS       | Replacement                                                  | Language |
| ------------------- | ------------------------------------------------------------ | -------- |
| ipgeolocation.io    | [ipgeolocation](https://github.com/vpetersson/ipgeolocation) | Rust     |
| Bit.ly / Rebrandly  | [DSLF](https://github.com/vpetersson/dslf)                   | Rust     |
| Linktree / About.me | [DSLF](https://github.com/vpetersson/dslf)                   | Rust     |

All Rust. Tiny footprint. Extremely fast.

## "Controlled" Matters

I keep saying "controlled vibe coding" because the "controlled" part matters.

AI-assisted code still goes through the same standards as any other change: reviewable diffs, reproducible builds, a pipeline we trust.

One underrated benefit of replacing Rebrandly: everything is in git now. Full visibility, audit trails. No more "ask $name to update the link for $something." It's a PR.

Maintenance? Mostly content updates and merging Dependabot PRs. These are simple tools solving simple problems.

## The Philosophy

Bootstrapping isn't "spend less." It's "buy back leverage."

At Screenly, we'd rather own the commodity layer than keep paying rent on it. When a service is simple enough to replicate, core enough to matter, and stable enough not to need constant innovation—it's a candidate for self-hosting.

With AI-assisted development, the build-vs-buy equation has shifted. What used to be "not worth the engineering time" is now "an afternoon project."

---

DSLF is Apache 2.0 licensed. Grab it from [GitHub](https://github.com/vpetersson/dslf) and see it live at [go.srly.io](https://go.srly.io) or [301.vpetersson.com](https://301.vpetersson.com).
