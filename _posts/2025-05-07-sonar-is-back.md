---
layout: post
title: "Sonar Is Back: A Fresh Take on BLE Device Counting"
date: 2025-05-07 12:00:00 +0000
categories: [projects, bluetooth]
tags: [sonar, bluetooth, ble, fastapi, python, raspberry-pi]
---

I'm excited to share that I've just given Sonar—a FastAPI-based BLE device counter I built years ago—a full overhaul and relaunched it as an open-source project on GitHub: [https://github.com/viktopia/sonar](https://github.com/viktopia/sonar)

### Why Sonar?

When I first created Sonar, the goal was simple: track Bluetooth Low Energy devices nearby to estimate foot traffic in a space without specialized hardware. Over time, the codebase drifted, dependencies aged, and the project paused. Now, with modern Python tooling and container best practices, Sonar is leaner, easier to deploy, and more powerful than ever.

### What's New

- **Modern service architecture**
  Sonar has been fully migrated from its original Django codebase to a lean FastAPI service, with the old `manage.py` and Django apps removed and a new `app/main.py` powering all BLE scanning logic.

- **Improved code quality**
  We've adopted Ruff for linting and import sorting, and fortified the test suite with Pytest (including async tests and coverage checks). The new `requirements-test.txt` lists `pytest`, `pytest-asyncio`, `pytest-cov`, and `ruff`, ensuring consistent style and at least 80 percent coverage.

- **Docker-first deployments**
  Sonar now ships with a production `Dockerfile` for building a container image and a simplified `docker-compose.yml` that sets up the BLE scanner with persistent storage and hardware access.

- **Simplified API**
  A new set of REST endpoints in `app/api/endpoints.py` covers device listing (`/devices`), counts (`/count`), manufacturer stats (`/manufacturers`), scan control (`/scan`), and health checks (`/health`), all returning JSON with robust error handling.

- **Removed legacy code**
  The old Django analytics application, static assets (like jQuery bundles), and deprecated Balena/Raspbian scripts have been stripped away, leaving a focused, modern codebase.

### Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/viktopia/sonar.git
cd sonar
```

2. **Run with Docker Compose (recommended)**

```bash
docker-compose up -d --build
```

3. **Verify it's working**

```bash
curl http://localhost:8000/health
# Expect: { "status": "healthy", "message": "System requirements met" }
```

While Sonar is primarily designed for Raspberry Pi, it should be compatible with most other boards and devices that have Bluez-compatible Bluetooth hardware. Feel free to dive into the API endpoints, inspect the source, and contribute—issues and pull requests are very welcome. Happy scanning!
