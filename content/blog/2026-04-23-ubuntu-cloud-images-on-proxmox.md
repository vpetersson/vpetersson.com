---
slug: ubuntu-cloud-images-on-proxmox
title: "Ubuntu Cloud Images on Proxmox"
date: '2026-04-23T10:00:23Z'
tags:
- proxmox
- ubuntu
- self-hosted
- virtualization
- infrastructure
- cloud-init
---

I've been clicking through the Ubuntu installer on Proxmox since 2019 -- I even [wrote a note to myself](/2019/10/03/ubuntu-core-on-proxmox/) back then about the dance. Partition the disk, pick a locale, wait for packages, reboot, SSH in, install the things I always install. Ten minutes per VM, every time.

What finally pushed me to fix it was wanting ephemeral Ubuntu VMs for development -- in particular, disposable sandboxes for running AI coding agents. My first instinct was to run Multipass inside a Proxmox VM. That afternoon I fought snap confinement (the daemon couldn't see `/tmp`), tildes not expanding inside quoted arguments, and native mounts that happily clobbered the `authorized_keys` Multipass had just injected. I climbed back out of that rabbit hole and realized the answer was one layer up the stack, not two layers down: Proxmox supports cloud-init natively. Template once, clone in seconds, bootstrap at first boot.

## Cloud Images vs ISOs

Ubuntu ships a [cloud image](https://cloud-images.ubuntu.com/) as a pre-installed qcow2 disk: `noble-server-cloudimg-amd64.img`. No installer. No locale picker. No partitioning. Boot it and `cloud-init` runs on first start, reading a user-data file you provide and configuring the machine -- users, SSH keys, packages, arbitrary commands.

Turn that image into a Proxmox template, and every new VM is a `qm clone` away. Attach a per-VM `cicustom` snippet with your cloud-init YAML, resize the disk, start the VM. First shell prompt in under a minute.

## Building the Template

Here's the script I run on the Proxmox host to build the template from scratch. It's idempotent -- destroy the old template, download a fresh image, verify the checksum, rebuild:

```bash
#!/bin/bash
set -euo pipefail

# Configuration
VMID=${VMID:-9000}
STORAGE=${STORAGE:-local-lvm}
BRIDGE=${BRIDGE:-vmbr0}
IMAGE_URL="https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
IMAGE_FILE="noble-server-cloudimg-amd64.img"

# Destroy existing template if present
if qm status $VMID &>/dev/null; then
  echo "Destroying existing VM/template $VMID..."
  qm destroy $VMID --purge
fi

# Download and verify image
echo "Downloading Ubuntu Noble cloud image..."
wget -q --show-progress "$IMAGE_URL"
wget -q "https://cloud-images.ubuntu.com/noble/current/SHA256SUMS"
sha256sum --check --ignore-missing SHA256SUMS
echo "Checksum OK"

# Create VM
qm create $VMID \
  --name "ubuntu-2404-template" \
  --ostype l26 \
  --memory 1024 \
  --agent 1 \
  --bios ovmf --machine q35 --efidisk0 ${STORAGE}:0,pre-enrolled-keys=0 \
  --cpu host --sockets 1 --cores 1 \
  --vga serial0 --serial0 socket \
  --net0 virtio,bridge=${BRIDGE}

# Import disk
qm importdisk $VMID "$IMAGE_FILE" $STORAGE

# Configure disks - imported disk lands on disk-1 because efidisk takes disk-0
qm set $VMID \
  --scsihw virtio-scsi-pci \
  --virtio0 ${STORAGE}:vm-${VMID}-disk-1,discard=on,iothread=1 \
  --boot order=virtio0 \
  --scsi1 ${STORAGE}:cloudinit

# Convert to template
qm template $VMID

# Cleanup
rm -f "$IMAGE_FILE" SHA256SUMS

echo "Template $VMID ready."
```

A few of the choices worth calling out: `--agent 1` enables the QEMU guest agent (graceful shutdown, IP reporting). `--vga serial0 --serial0 socket` routes the console to serial, which means `qm terminal $VMID` gives you a working shell -- essential when cloud-init falls over and you need to see what happened. And the `SHA256SUMS` check is not optional; you're baking this image into every future VM.

## The efidisk Gotcha

One subtle thing: when you add `--efidisk0` _before_ importing the cloud image, the EFI vars disk takes `disk-0` and the imported OS disk lands on `disk-1`. If you mindlessly script `--virtio0 ${STORAGE}:vm-${VMID}-disk-0` you'll "successfully" boot the EFI variable partition, watch it fail silently, and spend twenty minutes running `qm config` trying to figure out why. The script above references `disk-1` for a reason.

## Cloning and Customizing

Once the template exists, spinning up a new VM is a short script:

```bash
#!/bin/bash
set -euo pipefail

# Usage: ./launch-vm.sh <vmid> <name> [disk_size]
VMID=${1:?Usage: $0 <vmid> <name> [disk_size]}
NAME=${2:?Usage: $0 <vmid> <name> [disk_size]}
EXTRA_DISK=${3:-20G}

TEMPLATE_ID=${TEMPLATE_ID:-9000}
STORAGE=${STORAGE:-local-lvm}
CORES=${CORES:-4}
MEMORY=${MEMORY:-4096}
CLOUDINIT_SNIPPET=${CLOUDINIT_SNIPPET:-"local:snippets/ai-worker.yaml"}

# Clone template
echo "Cloning template $TEMPLATE_ID -> VM $VMID ($NAME)..."
qm clone $TEMPLATE_ID $VMID --name "$NAME" --full --storage $STORAGE

# Configure VM
qm set $VMID \
  --cores $CORES \
  --memory $MEMORY \
  --balloon 0 \
  --ipconfig0 ip=dhcp \
  --cicustom "user=${CLOUDINIT_SNIPPET}"

# Resize disk
qm resize $VMID virtio0 +${EXTRA_DISK}

# Start
qm start $VMID

echo "VM $VMID ($NAME) started."
echo "Watch boot: qm terminal $VMID"
```

The interesting flag is `--cicustom`. Proxmox's built-in cloud-init panel handles the basics (SSH keys, DNS, IP, hostname) but `cicustom` lets you point at a full cloud-init YAML snippet for `users`, `packages`, `runcmd`, `write_files` -- anything cloud-init supports. Snippets live in `/var/lib/vz/snippets/` by default.

One caveat if you're running a Proxmox cluster: `/var/lib/vz/snippets/` is per-node. If you want a snippet available across nodes, put it on shared storage (CephFS, NFS) and reference it through that storage's snippet path.

The `qm resize` step matters too. Cloud images ship with a small root disk (2-3 GB). `cloud-init` will expand the filesystem to fill the disk on first boot, but only if the disk itself is bigger, so resize _before_ start.

## A Minimal Cloud-Init Snippet

Here's a stripped-down example of what goes in the snippet file -- Docker, an `ubuntu` user with passwordless sudo, and SSH keys pulled from GitHub:

```yaml
#cloud-config
packages:
  - qemu-guest-agent
  - ca-certificates
  - curl
package_update: true
package_upgrade: true
users:
  - name: ubuntu
    groups: [sudo]
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_import_id:
      - gh:vpetersson
runcmd:
  - curl -fsSL https://get.docker.com | sh
  - usermod -aG docker ubuntu
  - systemctl enable --now qemu-guest-agent
final_message: "Bootstrap complete."
```

The nicest trick in the whole post is `ssh_import_id: gh:vpetersson`. Cloud-init pulls your public SSH keys straight from GitHub at first boot. No more copying `authorized_keys` around, no key-wrangling scripts.

My actual snippet layers more on top -- `uv`, `bun`, `gh`, Claude Code -- for the AI-agent sandbox use case, but that's incidental. The pattern is the interesting bit; swap in whatever toolchain your VMs need.

## Why a VM Per Project

The reason this workflow matters more than it used to is simple: I don't trust the sandboxing in AI coding agents. Every agent I've used has, at some point, done something I didn't ask for -- misread an instruction, skipped a confirmation, or blasted past an allow-list it was supposed to respect. Treating the agent's built-in sandbox as a real security boundary is a bet I've stopped making.

So the pattern I've settled on is one VM (or LXC container on Proxmox) per project. Inside that VM I'm happy to let the agent run in whatever "dangerous" / auto-approve mode the tool offers, because the blast radius is bounded by the VM itself. If something goes sideways -- rewrites my shell config, `rm -rf`s the wrong directory, pushes junk to a remote -- it's confined to a box I can `qm destroy` and rebuild from the template in seconds.

Each environment also gets its own SSH key pair -- fresh keys for git operations and commit signing, never a copy of my personal key. If an agent ever does go rogue, the git history tells me exactly which environment pushed what. The audit trail survives even if the VM doesn't.

For what it's worth, this post was drafted by Claude Code running in an LXC container set up exactly this way -- dedicated, scoped SSH keys, happy to run in dangerous mode because the blast radius stops at the container boundary.

## Multipass Still Has a Place

Since this post opened with me abandoning Multipass, let me close the loop honestly: Multipass is a great tool, and I still use it on my laptop. `multipass launch --cloud-init init.yaml 24.04` is the fastest way to get a throwaway Ubuntu shell on bare-metal Linux or macOS, and the same cloud-init file works in both worlds.

The other thing Multipass gets right is the ergonomics around ephemeral workflows. `multipass launch`, `multipass shell`, `multipass transfer <file> instance:/path`, `multipass delete --purge` -- shunting files in and out of a short-lived instance is basically a one-liner in each direction. On a full Proxmox VM you're back to `scp`, SSH keys, firewall rules, and (if the VM is short-lived) orchestrating all of that around a clone/destroy cycle. It's doable, but there's real overhead. For a quick "spin up an Ubuntu sandbox, poke at it, grab the output, throw it away" loop, Multipass wins on sheer friction.

The mismatch was the _context_. Running Multipass inside a Proxmox VM means nesting KVM twice, fighting snap confinement on every file transfer, and reinventing primitives Proxmox already gives you -- templates, cloning, per-VM cloud-init injection. The heuristic I landed on: if your workstation is the host, Multipass. If Proxmox is the host, use the templates.

## What's Next

The 2019 version of me would be delighted. The primitives haven't really changed -- `qm importdisk`, OVMF, cloud images all existed back then -- but the workflow is night and day. The obvious next step is to push all of this into [OpenTofu](https://opentofu.org/) via the `bpg/proxmox` provider, so the template, the snippet, and the VM lifecycle are all declarative and version-controlled. That's probably the next post.
