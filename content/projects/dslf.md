---
title: DSLF
tagline: Your links, on your own box.
summary: Damn Small Link Forwarder is a self-hosted link shortener and link-index page. The configuration is a CSV file. There is no database, no dashboard and no account, because a redirect does not need any of them.
description: DSLF (Damn Small Link Forwarder) is a self-hosted link shortener and Linktree alternative written in Rust. Configuration is a CSV file, with no database, dashboard or account required.
keywords: link shortener, self-hosted, linktree alternative, url shortener, rust, docker, bitly alternative
repo: vpetersson/dslf
demo: https://301.vpetersson.com
demo_label: See it running
image_url: ghcr.io/vpetersson/dslf
license: Apache-2.0
language: Rust
blog_post:
  url: /2026/01/14/ai-is-killing-saas-part-2-linktree-link-shorteners-and-the-leverage-you-buy-back/
  title: Why I built it
spec:
  - 5 MB binary
  - under 10 MB resident
  - 0 databases
  - amd64 and arm64
exchange:
  input_label: redirects.csv
  output_label: on the wire
  header: url,target,status
  rows:
    - id: gh
      path: /gh
      target: https://github.com/you
      status: "301"
      status_text: Moved Permanently
    - id: blog
      path: /blog
      target: https://yourblog.com
      status: "301"
      status_text: Moved Permanently
    - id: promo
      path: /promo
      target: https://you.com/offer
      status: "302"
      status_text: Found
features:
  - title: Real redirects
    body: Proper 301 and 302 responses with a Location header, so curl, scripts and link checkers follow them the way browsers do.
  - title: No database
    body: Configuration is a CSV file and an optional YAML file. Nothing to migrate, back up, or wake up for at 3am.
  - title: No tracking
    body: No analytics, no cookies, no third-party requests. Visitors are redirected and that is the end of it.
  - title: A link-index page
    body: An optional landing page in place of a hosted link-in-bio service, themed with Catppuccin.
  - title: Import what you have
    body: Pull your existing short links out of Rebrandly with a single command.
  - title: Published with an SBOM
    body: Every release publishes a software bill of materials, so what is inside the image is a matter of record.
---

## Run it

The image ships with example configuration, so it starts before you have written
anything of your own.

```bash
docker run -p 3000:3000 \
  -v $(pwd)/redirects.csv:/app/redirects.csv \
  ghcr.io/vpetersson/dslf:latest
```

Write one row per link: the path, where it goes, and `301` or `302`. Mount the file at
runtime, or bake it into an image. Then point a domain at it. Any host that can run a
container will do, because it is one process listening on one port.

## The second file, if you want it

`redirects.csv` is the only file you need. Add `link-index.yaml` and the root path
serves a link-index page instead of a 404.

```yaml
profile:
  name: "Your Name"
  bio: "Short line about you"

theme:
  preset: mocha # mocha | macchiato | frappe | latte
  buttonStyle: glass # glass | solid | outline
```

Both files can be mounted at runtime, so changing a link is a file edit and a restart
rather than a deploy.
