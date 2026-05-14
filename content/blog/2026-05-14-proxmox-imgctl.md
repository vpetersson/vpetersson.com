---
slug: proxmox-imgctl
title: "proxmox-imgctl: A Single Rust Binary for Proxmox Cloud Image Templates"
date: '2026-05-14T10:00:00Z'
tags:
- proxmox
- rust
- self-hosted
- virtualization
- infrastructure
- cloud-init
---

A few weeks ago I [wrote up](/2026/04/23/ubuntu-cloud-images-on-proxmox/) the bash scripts I use to turn Ubuntu cloud images into Proxmox templates and clone them into VMs. The scripts work, but every time I went to spin something up I found myself re-reading the post to remember which env vars to set, which storage pool I'd picked, and which snippet file was the current "good" one. The scripts were a recipe, not a tool.

So I built the tool. [`proxmox-imgctl`](https://github.com/vpetersson/proxmox-imgctl) is a single Rust binary you drop on a Proxmox node. Run it, answer a handful of menu prompts, and you get a verified cloud image template or a fresh VM clone, with cloud-init wired up, secure boot enabled, and the right disk layout. No script collection, no Python runtime, no Ansible playbook. Just a binary.

It's what I've been using myself for the last few weeks. The bash scripts in the previous post are retired.

## What it does

Two top-level actions:

- **Build template from cloud image.** Pick a distro from a curated catalog (Ubuntu 26.04 / 24.04 / 22.04, Debian 13 / 12 / 11), pick a storage pool and a VMID, confirm. The binary downloads the image, verifies it against the upstream `SHA256SUMS` / `SHA512SUMS`, creates the VM shell with OVMF + secure boot + cloud-init drive + virtio, imports the disk, and marks it as a template.
- **Spawn VM from template.** Pick a template, pick a cloud-init profile (`minimal`, `dev`, `docker`, an interactive generator, or any existing snippet on disk), answer prompts for username and `ssh_import_id`, and the binary clones, resizes, attaches the snippet, and starts the VM.

Each step that mutates state shows a plan and asks for confirmation before executing. There's a `--dry-run` flag that prints every `qm` command, snippet write, and download it would do, without touching anything. Useful for previewing on a non-root account or even off the Proxmox node entirely.

## Why a single Rust binary

Cluttering up `/usr/local/bin` with three bash scripts, a checksum file, and a snippets directory was the worst part of the old workflow. Cluttering it with a Python tool plus `requirements.txt` plus a virtualenv would have been worse. So:

- **Single static binary.** `x86_64-linux-musl`, no glibc dependency, no runtime. The same binary runs on PVE 8 (Debian 12, glibc 2.36) and PVE 9 (Debian 13, glibc 2.41) without a rebuild. Drop it in `/usr/local/bin/proxmox-imgctl`, done.
- **Rust.** Cheap to ship, fast to start, strict about errors. The downloader, the SHA256/SHA512 verifier, and the interactive prompts are all in the same binary with no shelling out except to `qm`, `pvesm`, and `pvesh`: the three Proxmox CLIs I genuinely need.
- **No new abstractions over Proxmox.** The tool shells out to `qm` rather than talking to the HTTP API, because (a) it's designed to run on the node anyway and (b) `qm disk import` has no clean API equivalent. The wrapper layer is thin and easy to swap if I ever want to make it run remotely.

It also gracefully handles the [`qm importdisk` -> `qm disk import` rename](https://pve.proxmox.com/wiki/Roadmap#Proxmox_VE_8.0) that landed in PVE 8: it tries the modern form first and falls back to the legacy name only if the CLI rejects the syntax. One binary, both PVE majors.

## Install

A static musl binary is attached to every tagged release. On the Proxmox node, as root:

```bash
curl -fsSLO https://github.com/vpetersson/proxmox-imgctl/releases/latest/download/proxmox-imgctl-x86_64-linux
curl -fsSLO https://github.com/vpetersson/proxmox-imgctl/releases/latest/download/proxmox-imgctl-x86_64-linux.sha256
sha256sum -c proxmox-imgctl-x86_64-linux.sha256
install -m 0755 proxmox-imgctl-x86_64-linux /usr/local/bin/proxmox-imgctl
```

First run as root seeds `/etc/proxmox-imgctl.toml` with sensible defaults (`storage`, `snippet_storage`, `snippet_dir`, `bridge`, `cache_dir`) and exits so you can review them.

## Building a template

```text
$ sudo proxmox-imgctl
? What do you want to do?  Build template from cloud image
? Base image:  Ubuntu 24.04 (noble)
✓ Cached image at /var/lib/proxmox-imgctl/cache/ubuntu-24.04-noble.img matches checksum.
? Storage pool:  local-lvm
? Network bridge: vmbr0
? Template VMID: 9000
? Template name: ubuntu-noble-template
? Memory (e.g. 1024M, 2G): 1G
? CPU sockets: 1
? Cores per socket: 1

Plan:
  base image:  https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img -> /var/lib/proxmox-imgctl/cache/ubuntu-24.04-noble.img
  vmid:        9000
  name:        ubuntu-noble-template
  storage:     local-lvm
  bridge:      vmbr0
  resources:   1 socket(s) × 1 core(s) = 1 vCPU, 1G memory

? Proceed? Yes
-> Creating VM shell...
-> Importing disk (this can take a minute)...
-> Attaching disk, configuring boot, adding cloud-init drive, marking as template...

✓ Template 9000 (ubuntu-noble-template) ready.
```

Spawning a VM from that template is the same shape: pick a template, pick a profile (`minimal`, `dev`, `docker`, or your own), confirm. The `dev` profile, for what it's worth, is what I use for the agent-sandbox VMs I described in the last post: a single user, passwordless sudo, SSH keys imported from GitHub, plus `git`, `build-essential`, `curl`, `vim`, `htop`, `tmux`, `jq`. The `docker` profile adds the official `get.docker.com` installer on top.

## Image catalog

| Distro | Release   | Codename |
| ------ | --------- | -------- |
| Ubuntu | 26.04 LTS | resolute |
| Ubuntu | 24.04 LTS | noble    |
| Ubuntu | 22.04 LTS | jammy    |
| Debian | 13        | trixie   |
| Debian | 12        | bookworm |
| Debian | 11        | bullseye |

Each entry resolves through the upstream `current` / `latest` symlink, so a fresh download always grabs the latest point release.

## Known limitations

- **amd64 only.** No arm64 release builds yet. The code is portable; I just don't have an arm64 PVE node to validate against.
- **Hardcoded catalog.** Adding a distro means appending an entry to `src/catalog.rs` and rebuilding. Good enough for now. I'd rather pin the checksum logic per distro than have a free-form config.
- **Single-node mindset.** The tool doesn't yet help you target a specific node on a cluster.
- **No delete / edit actions.** Build template and spawn VM are the only two top-level actions; cleanup is `qm destroy` and `qm stop` directly, the way you'd do it anyway.

## Where it goes next

The bash-script version of the workflow lived in my head and in a blog post. This one lives in a binary I can hand to someone else, with a release pipeline, CI that runs `fmt --check`, `clippy -D warnings`, and a build/test pass on every PR. That makes the OpenTofu / declarative version I gestured at in the last post a much smaller jump: the catalog, the profiles, and the `qm` invocations are all already factored into modules. Wiring them up behind a Terraform provider, or just behind a non-interactive CLI mode, is the obvious next step.

In the meantime: if you're managing Proxmox cloud images and the scripts in the last post felt like the right idea but the wrong ergonomics, give the binary a spin.

[github.com/vpetersson/proxmox-imgctl](https://github.com/vpetersson/proxmox-imgctl)
