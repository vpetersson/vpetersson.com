---
layout: post
title: "DSLF – a rust hacking, cheaper hosting, and two HTTP codes I didn’t know about"
date: '2025-07-11T00:00:00Z'
tags: [rust, http, fly.io, open-source]
---

I hacked together [DSLF](https://github.com/vpetersson/dslf) today because paying a monthly fee for a plain 301 felt silly.
It’s a tiny Rust service that reads a CSV and spits out redirects—nothing more.

In the process I learned that HTTP has two “new” redirect codes that slipped past me years ago.

## Four ways to say “go over there”

| Old code | New code | Keeps the HTTP method? |
| -------- | -------- | ---------------------- |
| 301      | 308      | **Yes**                |
| 302      | 307      | **Yes**                |

_301_ and _302_ can turn a POST into a GET.
_307_ and _308_ guarantee the original method sticks. Neat.

DSLF defaults to the classic pair, but you can switch to the modern ones with a single flag.

```bash
./dslf --modern
```

## Quick start

1. Drop your links in `redirects.csv`:

   ```csv
   url,target,status
   /gh,https://github.com/vpetersson,301
   /blog,https://vpetersson.com,301
   ```

2. Run the binary:

   ```bash
   ./dslf
   ```

   It listens on `0.0.0.0:3000`.

3. Or run it in Docker:

   ```bash
   docker run -p 3000:3000 \
     -v $(pwd)/redirects.csv:/redirects.csv \
     vpetersson/dslf --modern
   ```

   (`dslf` is already the entrypoint, so just pass the flag.)

## Cheap hosting on Fly.io

Fly’s smallest instance plus their free credit is often enough for a personal short-link service.
Point `fly.toml` at `vpetersson/dslf`, hit `fly deploy`, and you’re live for pennies—or free if your traffic is tiny.

## What I haven’t done yet

- **Load testing** – numbers will come later once I point k6 at it.
- **Click counts** – might add an optional flag, but only if it stays lightweight.

---

Grab the code:

```bash
git clone https://github.com/vpetersson/dslf
```

If you need a no-nonsense, self-hosted link shortener—and want to use those shiny 307/308 codes—give DSLF a spin and tell me what you think.
