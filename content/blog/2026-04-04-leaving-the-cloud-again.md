---
slug: leaving-the-cloud-again
title: "Leaving the Cloud (Again)"
date: '2026-04-04T12:00:00Z'
tags:
- self-hosted
- proxmox
- hetzner
- docker
- infrastructure
---

Digital sovereignty is becoming an increasingly hot topic, and people are starting to wake up to just how large the premium is for "cloud" versus simply running a few dedicated servers.

For me, this is full circle -- not in the technology, but in the operational model. I've been managing my own servers since I was running FreeBSD jails in the early 2000s, scaling one of my early companies to hundreds of jails across dedicated hardware at Rackspace. FreeBSD jails were among the earliest container-like technologies, and the lineage from jails to Docker to LXC containers on Proxmox is a direct one. The abstraction has gotten better, but the core idea -- isolated workloads on hardware you control -- hasn't changed.

Like most of the tech world, I eventually moved to Linux entirely. I was early on Docker, then early on Kubernetes -- both Linux-first ecosystems, as were all the major cloud vendors. I stayed in that world for years. It wasn't until I started [sbomify](https://sbomify.com) that I began reassessing my cloud-by-default strategy. Yes, Google gave us some startup credits, but not nearly enough to justify getting locked into their ecosystem.

Cost was a factor, but so was digital sovereignty. One of sbomify's core value propositions is providing a CRA compliance easy button. Most of the customers we're talking to are in Europe, and for them, where data is hosted matters, as does the jurisdiction of the companies holding it. We also expect many of our users to self-host sbomify, so it's important that we understand the self-hosted experience firsthand and support it well.

## The Stack

Having run Proxmox at home for years, it was the natural starting point. A Proxmox cluster gives you a solid foundation for spinning up both LXC containers and VMs across N nodes, with easy workload migration between them.

One thing worth calling out: Proxmox now supports ZFS for the root drive, not just data volumes. This is a significant upgrade. ZFS brings checksumming and copy-on-write to every write, which means silent data corruption gets caught rather than silently propagated. It also makes snapshots and backups first-class operations -- you can snapshot the entire system state before a risky change and roll back in seconds if something goes wrong.

For hosting, I landed on Hetzner. The UI isn't exactly state of the art, but it does everything I need. I provisioned a few servers with Proxmox, set up VLANs, and had a cluster running quickly. One thing to note: installing Proxmox requires Hetzner's KVM console service, which you need to manually request from support.

One constraint worth knowing: by default, IPs are allocated per host. To have IPs span nodes for ingress, you need to allocate them to a VLAN. Getting an IPv6 block assigned was straightforward. Those addresses are added as AAAA records in Cloudflare, which handles IPv6-to-IPv4 translation for anything that needs it.

## Hiccups Along the Way

Getting everything up and running went smoothly after working through a couple of Hetzner-specific quirks. The firewall doesn't differentiate between regular and VLAN traffic, which tripped me up initially.

Once that was sorted, I started seeing random connection errors in the logs. After some head-scratching, the culprit turned out to be MTU. Hetzner uses an MTU of 1400 (versus the standard 1500). I'd configured this on the Proxmox host but forgot to apply the same setting to Docker. Once identified, it was a straightforward fix.

Since the hosts are IPv6-only, I also had to configure IPv4 on a VLAN so nodes could reach IPv4 targets. Minor, but worth noting.

## Zero Trust on the LAN

The last piece was internal TLS. Sending credentials in plaintext is bad practice even on a LAN, and I wanted to get this right. I looked at using Tailscale for certificates but it felt like unnecessary complexity. Instead I went with [SmallStep](https://smallstep.com/) -- their `step-ca` server and `step` agent make certificate management surprisingly painless. You define your CA, enroll your hosts, and certificates are automatically issued and renewed. I was genuinely impressed by how little friction there was.

Securing Postgres and Redis with TLS via a private CA worked well. The trickiest part was getting the clients (Django and Dramatiq) to actually use the TLS connection. Django's `DATABASES` setting accepts `sslmode` and `sslrootcert` options, which worked as expected. Dramatiq was a different story: you need to pass the Redis connection as a URL with TLS parameters (e.g. `rediss://...?ssl_ca_certs=/path/to/ca.crt`), because passing the CA settings as keyword arguments gets silently ignored. And don't forget: your application container needs access to the root CA certificate too -- either copy it into the image or volume mount it in. That's the kind of bug that passes every test but fails in production. You can see the fix in [sbomify/sbomify#856](https://github.com/sbomify/sbomify/pull/856) and the subsequent cleanup in [sbomify/sbomify#857](https://github.com/sbomify/sbomify/pull/857).

## What's Next

The current setup still uses Docker Compose for the workers. The next step is to migrate those to [Talos Linux](https://www.talos.dev/) -- a minimal, immutable OS purpose-built for Kubernetes -- provisioned with [OpenTofu](https://opentofu.org/). That would give us a fully declarative, API-driven infrastructure layer while keeping everything on our own hardware. I'm also looking at adding [OpenBao](https://openbao.org/) for secret management, replacing the current approach of manually distributing secrets.

You get a lot of this stuff for "free" with the major cloud vendors -- managed databases, built-in TLS, secret management, load balancing. But it isn't really free. It's more like capex vs opex: you trade upfront setup effort for an ongoing premium that only grows as you scale. Yes, there's a management cost to maintaining your own clusters. But the tooling has gotten dramatically better in recent years, while the price delta between cloud and bare metal has only increased. Not to mention free egress -- no surprise bills for the crime of serving traffic. At some point, the math stops making sense -- or the VC money runs dry.
