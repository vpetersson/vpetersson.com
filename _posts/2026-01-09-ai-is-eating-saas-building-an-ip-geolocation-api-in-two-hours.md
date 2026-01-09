---
layout: post
title: "AI is Eating SaaS: Building an IP Geolocation API in Two Hours"
date: '2026-01-09T12:00:00Z'
tags:
- rust
- ai
- cursor
- self-hosted
---

We've all heard the saying that AI is eating SaaS. For some simple products, it's certainly becoming true.

At [Screenly](https://www.screenly.io), we've been using [ipgeolocation.io](https://ipgeolocation.io) for a while. It's a solid service, but at its core, it's just a frontend for a GeoIP database. This morning, I saw yet another monthly invoice from them and decided to run an experiment: how far can [Cursor](https://cursor.sh) with Claude Opus 4.5 go in terms of recreating their API with feature parity?

Turns out, it can do it in under two hours. In Rust.

## The Problem

Many applications need to know where their users are located - for timezone detection, localization, or analytics. Services like ipgeolocation.io provide this, but they come with drawbacks: API rate limits, recurring costs, latency from external calls, and dependency on third-party uptime.

## The Solution

I built a drop-in replacement that runs entirely self-hosted. It's a single binary that bundles all the data it needs - no external API calls, no API keys to manage, and responses in microseconds instead of milliseconds.

**Demo**: [geoip.vpetersson.com](https://geoip.vpetersson.com) (available until it gets too much load)
**Source**: [github.com/vpetersson/ipgeolocation](https://github.com/vpetersson/ipgeolocation)

## Why It's Cool (Technically)

### Zero External Dependencies at Runtime

The service embeds two datasets directly:

- **MaxMind GeoLite2-City** (~70MB database) for IP-to-location lookups
- **tzf-rs** compiles timezone boundary polygons (~15MB) directly into the binary

This means the 17MB binary contains everything needed to resolve any IP address to its location and any coordinates to their timezone - offline, airgapped, whatever.

### Rust + Axum = Blazing Fast

Built on [Axum](https://github.com/tokio-rs/axum) and [Tokio](https://tokio.rs/), the async runtime handles thousands of concurrent requests efficiently. The in-memory LRU cache (via [Moka](https://github.com/moka-rs/moka)) means repeated lookups are nearly instant.

### Aggressive Caching Strategy

IP geolocation data rarely changes. The service returns `Cache-Control: public, max-age=1209600` (2 weeks), making it perfect behind a CDN like Cloudflare.

### Minimal Attack Surface

The Docker image uses [Chainguard](https://www.chainguard.dev/) images:

- **Build stage**: `cgr.dev/chainguard/rust` (with `cargo-auditable` for SBOM)
- **Runtime**: `cgr.dev/chainguard/glibc-dynamic` (minimal, CVE-free base)

The final image contains just the binary, the GeoIP database, and country flag SVGs. No shell, no package manager, minimal attack surface.

### API Compatibility

Two API formats are supported:

- **Simple format** (`/ipgeo`, `/timezone`) - backward compatible, minimal response
- **Full format** (`/v1/ipgeo`, `/v1/timezone`) - rich metadata including country info, currency, calling codes, DST details

## The Numbers

| Metric        | Value                                        |
| ------------- | -------------------------------------------- |
| Binary size   | 17MB (includes all timezone boundary data)   |
| Docker image  | 140MB on disk, 44.5MB content                |
| Response time | Sub-millisecond for cached lookups           |
| Memory        | ~100MB runtime (GeoIP DB loaded into memory) |
| Startup       | <1 second                                    |

Most of the disk image is the GeoIP database and country flag SVGs. The Rust binary itself is about 17MB, which includes everything.

## What This Means

For simple, data-lookup SaaS products, the economics are shifting. When an AI coding assistant can recreate your entire product in a couple of hours, the value proposition needs to be more than just "we host it for you."

The project is MIT licensed and available on [GitHub](https://github.com/vpetersson/ipgeolocation). The only requirement is a free [MaxMind](https://www.maxmind.com) account to download the GeoLite2 database during Docker build.
