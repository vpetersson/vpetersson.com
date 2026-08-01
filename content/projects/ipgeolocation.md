---
title: IP Geolocation
tagline: An address becomes a place.
summary: A self-hosted IP geolocation and timezone API. The MaxMind GeoLite2 database and the timezone boundaries ship inside the container, so a lookup is a local read rather than a call to somebody else's service.
description: A self-hosted IP geolocation and timezone API written in Rust. The GeoLite2 database ships inside the container, so lookups need no API key, no account and no third-party call.
keywords: ip geolocation, self-hosted, geoip api, timezone api, maxmind geolite2, rust, docker
repo: vpetersson/ipgeolocation
demo: https://geoip.vpetersson.com
demo_label: See it running
image_url: ghcr.io/vpetersson/ipgeolocation
license: MIT
language: Rust
live_endpoint: https://geoip.vpetersson.com/ipgeo
# Offers a "look up my own address" row that calls the live instance from the
# visitor's browser, on press only. It needs Access-Control-Allow-Origin, which
# ipgeolocation main sends but the currently deployed build does not. Flip this
# to true once geoip.vpetersson.com is redeployed.
live_lookup: false
spec:
  - 0 third-party calls
  - JSON and protobuf
  - GeoLite2 in the image
  - amd64 and arm64
exchange:
  input_label: request
  output_label: response
  # Responses below are verbatim from the live instance, not illustrations.
  rows:
    - id: us
      path: "?ip=8.8.8.8"
      label: A resolver in Kansas
      response: |
        {
          "latitude": 37.751,
          "longitude": -97.822,
          "city": "",
          "country_name": "United States",
          "time_zone": { "name": "America/Chicago" },
          "languages": "en-US,en"
        }
    - id: ch
      path: "?ip=193.5.216.100"
      label: One in Switzerland
      response: |
        {
          "latitude": 47.1449,
          "longitude": 8.1551,
          "city": "",
          "country_name": "Switzerland",
          "time_zone": { "name": "Europe/Zurich" },
          "languages": "de-CH,de,fr-CH,fr,it-CH,it"
        }
features:
  - title: The addresses stay with you
    body: A hosted geolocation API sees every address you look up, which for most applications means every visitor you have. This one sees nothing, because it is yours.
  - title: No rate limit, no key
    body: The data is in the image. A lookup costs a memory read, so there is no quota to budget and no key to rotate.
  - title: Predictable latency
    body: Nothing in the request path crosses the internet, so a lookup does not inherit somebody else's outage or slow afternoon.
  - title: Timezones from geometry
    body: Coordinates resolve against real timezone boundaries with tzf-rs, rather than being guessed from the country.
  - title: Protobuf when you want it
    body: Ask for protobuf instead of JSON on the routes where payload size actually matters.
  - title: Published with an SBOM
    body: Every release publishes a software bill of materials, so what is inside the image is a matter of record.
---

## The API

Two shapes. The short one keeps a small, stable payload. The `/v1` one adds currency,
calling code, flags and the rest.

```text
# The caller's own address, detected from proxy headers
GET /

# A specific address, short shape
GET /ipgeo?ip=8.8.8.8

# A specific address, full shape
GET /v1/ipgeo?ip=8.8.8.8

# Coordinates to timezone. Note the parameter is `long`, not `lon`.
GET /timezone?lat=51.5074&long=-0.1278
```

The service also publishes `/openapi.yaml` and `/llms.txt`, so it can describe itself to
a code generator and to an agent without anyone hand-writing a client.

## Run your own

The image carries its own data, so there is no API key to obtain and no account to
create.

```bash
docker run -p 3000:3000 ghcr.io/vpetersson/ipgeolocation:latest
curl "http://localhost:3000/ipgeo?ip=8.8.8.8"
```

Put it behind your proxy and it reads `CF-Connecting-IP`, `X-Real-IP` and
`X-Forwarded-For`, so `GET /` answers for the real caller rather than for the proxy. An
in-memory LRU sits in front of the database, and responses carry `Cache-Control` so a
proxy can hold them too.
