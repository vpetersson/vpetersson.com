---
slug: state-of-the-commercial-raspberry-pi-ecosystem
title: "The State of Commercial Raspberry Pi Security: I Scanned Every Paid-For OS in Raspberry Pi Imager"
date: '2026-11-26T09:00:00Z'
description: "I downloaded every image in the 'Freemium and paid-for OS' section of Raspberry Pi Imager, built an SBOM for each one, and ran them through OSV. End-of-life Debian, Python 2.7, stale Chromium, a default password, shared SSH host keys, and thousands of already-fixed CVEs. On boxes that live inside business networks."
tags:
- security
- raspberry-pi
- sbom
- cra
- iot
- digital-signage
---

Back in [The Last 20%](/2026/08/21/the-last-20-percent/) I threw out a line that the digital signage industry's security posture is "pretty terrible." It was an aside. I didn't back it up. Here's me backing it up.

The Raspberry Pi Imager, the official tool for flashing SD cards, has a section called **Freemium and paid-for OS**. These are images from companies selling a product on top of the Pi. Mostly digital signage players, plus a thin client, a smart-home hub, a 3D printer controller, and a commercial Android build. None of them are weekend projects. They end up in lobbies, meeting rooms, shop windows, factory floors and hospital corridors. Almost always on the corporate network. Usually on a VLAN nobody has looked at since install day. Almost never in anyone's asset inventory.

So I downloaded every one of them, built an SBOM, and ran it through a vulnerability scanner. I was right. It's worse than "pretty terrible."

One thing up front, because it matters. Hobby builds get a pass. Nobody expects a retro-gaming rig or a kid's weather station to ship with a vulnerability management program, and holding a maker who flashed an image for a weekend to the same bar as a company charging money would be unfair. The tinkerer promised nobody anything. A vendor selling a signage player did, whether they wrote it down or not, and from December 2027 the EU turns that promise into law. So I only looked at the things sold as products. Everything else in Imager, I left alone.

## How I did it

1. Pulled the Raspberry Pi Imager OS list (`os_list_imagingutility_v4.json`) on 20 November 2026 and took every entry under **Freemium and paid-for OS**.
2. Grabbed the newest image per vendor that supports a Pi 4 or Pi 5. One scan each, the most current build.
3. Decompressed each image, attached it as a read-only loop device, and mounted every partition. When the root filesystem was buried inside Ubuntu Core snaps, balenaOS container layers, an LVM volume or a squashfs payload, I mounted that too.
4. Recorded the OS release, kernel, package sources and update mechanism, then generated an SBOM with [Syft](https://github.com/anchore/syft) 1.57.2 and scanned it with [OSV-Scanner](https://github.com/google/osv-scanner) 2.7.1.

A few things to know before you read the table:

- **Counts are unique advisories** after OSV groups aliases. A CVE that also carries a DSA, GHSA or PYSEC ID counts once.
- **"Fix available"** means OSV knows a patched version exists in that ecosystem. The problem is already solved upstream. The vendor just hasn't shipped it.
- **The kernel is counted separately.** The Linux kernel became its own CNA and now issues thousands of CVEs a year, so matching Pi kernels against Debian's `linux` advisories is mostly noise. I report it but keep it out of the headline numbers.
- **Raspbian has no OSV ecosystem of its own.** I mapped Raspbian packages to the matching Debian release and used source package names, which is how Debian keys its advisories.
- **This is the out-of-the-box state.** Some products update themselves after first boot, so a device in the field may be better or worse than its image. But the image is what the vendor chose to ship, and it's where every new device starts.

## The results

| Product (image tested)                         | Base OS                                      | Base OS support status                                                       | Non-kernel vulns | Critical / High | Fix available | Update path I found                             |
| ---------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- | ---------------: | --------------: | ------------: | ----------------------------------------------- |
| **Linutop OS** (Jan 2025)                      | Raspbian 10                                  | **End of life** (Debian LTS ended June 2024)                                 |      318 (756\*) |        28 / 151 |           316 | Plain apt against the archived Debian 10 repo   |
| **XOGO** 2.105.21 (Oct 2022)                   | balenaOS host, player container on Debian 10 | **End of life** (Debian 10; Alpine 3.15/3.16 supervisor containers also EoL) |      413 (547\*) |          3 / 37 |           413 | balena fleet updates, if the fleet is managed   |
| **3DPrinterOS** (Mar 2024)                     | Arch Linux ARM snapshot, kernel 6.6.21       | Rolling release, 20 months stale                                             |             299† |         10 / 47 |           299 | Vendor service; no evidence of OS-level updates |
| **info-beamer OS** (Feb 2026)                  | Custom minimal Linux                         | Runtime on **Python 2.7.18** (EoL Jan 2020)                                  |              117 |         19 / 60 |           116 | Signed A/B image updates                        |
| **1Play** V17 (Jul 2025)                       | Raspbian 12.11                               | Debian 12 is in LTS since July 2026                                          |            3,877 |     257 / 1,371 |         2,617 | apt against Raspbian and Raspberry Pi repos     |
| **Yodeck** (Aug 2026, Pi 5)                    | Debian 12.5                                  | Debian 12 LTS; packages from the March 2024 point release                    |            3,266 |     208 / 1,201 |         2,643 | Vendor apt mirror                               |
| **TLXOS** 5.2.4                                | Debian 12.13                                 | Debian 12 LTS                                                                |            6,273 |     598 / 2,581 |         5,252 | Vendor updater service + Debian security repo   |
| **Homey Self-Hosted Server** (Dec 2025)        | Debian 13.2                                  | Supported                                                                    |            1,397 |        59 / 429 |         1,103 | Debian security repo, app in Docker             |
| **ScreenlyOS** 26.10.1 (Nov 2026)              | Ubuntu Core 24/26                            | Supported                                                                    |              673 |        37 / 148 |           349 | Transactional snap updates (automatic)          |
| **Android by emteria** 17.2.0 (Nov 2026, Pi 5) | Android 17                                   | Security patch level **2026-06-05**, five months behind its own build date   |             n/a‡ |             n/a |           n/a | Vendor OTA                                      |
| **Fugo One**                                   | n/a                                          | n/a                                                                          |              n/a |             n/a |           n/a | Image URL in Imager returns 404                 |
| **vetra player**                               | n/a                                          | n/a                                                                          |              n/a |             n/a |           n/a | Listed in Imager with no images                 |

\* The same packages, checked against Debian 11 advisory data. See "Scanners go quiet exactly when you need them" below.
† Only the application layer could be scanned. OSV has no Arch Linux (ALPM) ecosystem, so none of the 386 OS packages were checked.
‡ I read the Android build properties. I did not build a full Android SBOM.

Full disclosure before we go on. ScreenlyOS is Screenly, the company I co-founded. It's on the list, so it went through the exact same pipeline as everyone else, and I left it in the table so you can hold me to my own standard. It doesn't come out clean either.

## What stands out

### End-of-life bases are still shipping

Two of the nine images I could fully analyse are built on Debian 10. [Regular security support for Debian 10 ended in September 2022, and LTS in June 2024](https://endoflife.date/debian). Linutop's image is dated January 2025 and it's Raspbian 10.13 on a 5.10.103 kernel from early 2022. The package database was last touched in November 2024. XOGO's player runs in a Debian 10 container on a balenaOS host with a 5.10.95 kernel, and its supervisor containers are Alpine 3.15 and 3.16. Both of those are past end of life too.

info-beamer is a more interesting case. The base is a small custom build with signed A/B updates, which is the right architecture. But the device management stack runs on Python 2.7.18 with Flask 0.12, Werkzeug 0.11, Jinja2 2.8 and Pillow 4.0. [Python 2 died in January 2020](https://www.python.org/doc/sunset-python-2/). Those libraries are from 2016 and 2017. Pillow on its own accounts for 70 of the 117 advisories.

3DPrinterOS runs Arch Linux ARM, a rolling release. That's fine as long as you keep rolling. A March 2024 snapshot is just a 20-month-old Linux box with no versioned distribution behind it to backport anything.

### "Supported" doesn't mean patched

The Debian 12 images look fine on paper, because bookworm is still in LTS. In practice they carry the most vulnerabilities, because they ship a lot of software and the image is frozen in time:

- **Yodeck's** Pi 5 image is dated August 2026 but built from Debian 12.5, which shipped in February 2024. Chromium is at 125, from June 2024. 2,643 of its 3,266 non-kernel advisories already have a fix in Debian.
- **1Play** ships two complete kernel trees (6.12.25 and 6.12.34) for every Pi generation, Chromium 138, and 2,617 fixable advisories.
- **TLXOS** has the most current Debian 12 image here (12.13), but it bundles a whole thin-client stack on top: Citrix, VMware Horizon, FreeRDP, NX, SPICE, CUPS, strongSwan. Its Chromium build alone matches 4,206 advisories. Debian handles Chromium security differently from most packages, so discount that one figure. The other 2,000-plus stand.

The same handful of packages shows up at the top of every Debian-based image: `webkit2gtk`, `imagemagick`, `ffmpeg`, `chromium`, `vim`, `binutils`, `pillow`. These are the media and browser bits a signage player needs. They're also the bits parsing untrusted content all day.

### Scanners go quiet exactly when you need them

This one should worry anyone who trusts a scanner dashboard. I scanned Linutop's Raspbian 10 packages against OSV's **Debian 10** data and got **14** advisories. Against **Debian 11** data, the same packages matched **452**. XOGO went from 143 to 280.

The reason is boring. Once a release is archived, the upstream security tracker stops recording new issues against it, so the vulnerability databases stop matching it. The older and more neglected a system gets, the cleaner its scan looks. A "0 critical" result on an end-of-life box is a false negative, not a clean bill of health. Checking the support status of the base OS has to be part of the job. Running the scanner and reading the number is not enough.

### A default password and shared SSH host keys

A CVE count tells you what software a vendor pulled in. It says nothing about how they set the thing up. So I also looked at two things an SBOM never sees: the accounts baked into the image, and the SSH host keys.

The worst offender is **Linutop**. The image ships with the `pi` account still set to the default Raspberry Pi password, `raspberry`. That's the password [Raspberry Pi OS itself dropped in 2022](https://www.raspberrypi.com/news/raspberry-pi-bullseye-update-april-2022/), on security grounds, because it was one of the most exploited defaults on the platform. Anyone who can reach the box and knows the default, which is everyone, is already in. Hardcoded credential, no asterisk.

The SSH problem is separate and hits more images. Several vendors bake the **private SSH host keys** straight into the image, so every device flashed from it hands out the _same_ key:

| Product         | SSH on by default   | Host keys               | First-boot regeneration    | Password login                                    |
| --------------- | ------------------- | ----------------------- | -------------------------- | ------------------------------------------------- |
| **Linutop**     | No (needs enabling) | **Baked in, shared**    | None                       | Default `pi` / `raspberry`                        |
| **1Play**       | Yes                 | **Baked in, shared**    | None                       | `pi` set (not default)                            |
| **TLXOS**       | Yes                 | **Baked in, shared**    | None                       | Disabled (key-only, root `prohibit-password`)     |
| **Yodeck**      | Yes                 | Generated on first boot | `regenerate_ssh_host_keys` | `root` / `pi` / `user` set; `PermitRootLogin yes` |
| **Homey**       | Yes                 | Generated on first boot | `regenerate_ssh_host_keys` | `homey` set                                       |
| **3DPrinterOS** | Yes                 | None in image           | n/a                        | `root` / `printeros` set                          |

A shared private host key is a real problem. Every device in the field holds the identical key, so the key is only as secret as the image download, and the image download is public. Pull the image and you own the private key for every deployed unit. SSH's whole defence against a man-in-the-middle goes away: a box on the same network can pretend to be the real player, and the admin connecting in gets no host-key warning, because the key matches. The fix is five minutes of work. Delete the keys at build time and let `ssh-keygen` run once per device on first boot, which is exactly what Yodeck and Homey do. That's what makes skipping it so lazy.

Worth being precise about what I pulled out and what I didn't. `pi` / `raspberry` is the platform's own documented default, so naming it gives away nothing that wasn't already public. I did not crack, and I'm not publishing, the unique password hashes on the other images, or any private key material. The finding is that the keys are there and shared, and you can see that without reading them. Credit to TLXOS for turning off password auth completely, though the shared host key still stands.

### Update mechanisms are all over the map

| Approach                                                 | Products                                        |
| -------------------------------------------------------- | ----------------------------------------------- |
| Transactional / image-based OTA (A/B or snaps)           | ScreenlyOS, info-beamer, XOGO (balena), emteria |
| Package manager pointed at live security repos           | TLXOS, Homey, 1Play                             |
| Package manager pointed at a vendor-controlled mirror    | Yodeck                                          |
| Package manager pointed at an archived, end-of-life repo | Linutop                                         |
| No OS-level update path visible in the image             | 3DPrinterOS                                     |

Image-based OTA is the right architecture for an appliance, but only if the vendor actually rebuilds the image with current components. XOGO has balena's update machinery and ships a Debian 10 payload through it. info-beamer has signed A/B updates and ships Python 2.7 through them. And a package manager pointed at live Debian security repos only helps if something runs the upgrade. In none of the Debian-based images did I find an unattended-upgrades policy turned on.

### The part nobody mentions: apt can't cross a Debian release

This is the detail that turns "end of life" from a slow-moving worry into a brick wall, and it's the thing to understand about every package-manager row above. `apt upgrade` keeps a device current _inside_ one Debian release. It does not, in any realistic fleet sense, move a device from one release to the next.

A Debian major upgrade, 11 to 12 or 12 to 13, is a full `dist-upgrade`. Thousands of packages swapped, maintainer scripts run, config files merged, the C library and init system replaced underneath a running system. On my laptop, with a keyboard and a screen and the ability to answer a debconf prompt, that's a supported but fiddly afternoon. On a headless signage player bolted behind a screen in a shop, pushed unattended to a whole fleet, with no console and no way to step in when a maintainer script stops to ask a question, nobody sane tries it. One interrupted upgrade, a power cut, a dropped network, a single package conflict, and you've got a bricked box that needs a site visit anyway. Nobody ships a cross-release `dist-upgrade` as an OTA strategy. That's the point.

So for every Debian-based product here, the base OS has a hard expiry date. [Debian 12's regular support ended in July 2026 and LTS runs to June 2028](https://www.debian.org/News/2026/20260712). Debian 10 is already past it. When that date lands, the apt channel these devices lean on stops getting fixes, and there is no in-place path to the next release. The device isn't "a bit behind" at that point. It's frozen on an unsupported OS for the rest of its physical life, piling up unpatched CVEs, and the only way out is a reflash. Someone physically re-imaging each unit, or the vendor pushing a whole new image through a channel that, for the apt-based products, doesn't exist today.

This is where the image-based vendors have a real edge. A/B image OTA and snap systems (ScreenlyOS, info-beamer, emteria, balena) ship a whole new base OS as just another signed image. Crossing a release boundary is the same operation as any other update, and it rolls back if it fails. The pure apt-based products here (Yodeck, 1Play, Homey, Linutop) have nothing like it, and for them the base OS reaching end of life is a truck roll, not a download, which is exactly why it usually never happens. TLXOS turns out to be a partial exception, for reasons I'll come to.

### "Can't they just dist-upgrade on first boot?"

Fair question. It's the strongest objection to everything above, so let me make the case for it properly before I knock it down.

First boot is the ideal moment to take the hit. The device is on a bench, not in service. No uptime to protect, no screen anyone's watching, no SLA. So you ship whatever base you built against, and the first time the unit powers on it runs `apt update && apt full-upgrade`, pulls every pending fix, and goes into service current. Cloud images do a version of this through [cloud-init](https://docs.cloud-init.io/en/stable/reference/yaml_examples/package_update_upgrade.html) every day. You could even script the cross-release jump: set `DEBIAN_FRONTEND=noninteractive`, force the old conffiles, repoint `sources.list` at the new release, and dist-upgrade before first light. Ship once, heal on boot, never reflash.

Here's where that lands. Within a release, it's completely right, and it would erase most of this post. A first-boot `full-upgrade` clears the "fix available" column wholesale: Yodeck's 2,643, 1Play's 2,617, all of it, because those are in-release fixes sitting in the same repo the device already points at.

The awkward part for the vendors is that none of them do even this, and I went back into the images to make sure I wasn't guessing. Not one of the five apt-based builds has `unattended-upgrades` installed. The stock `apt-daily` timer is there, but it's inert: no `50unattended-upgrades`, no `20auto-upgrades`, nothing behind it to actually install anything. 1Play has gone the other way and stripped the apt timers out of `timers.target.wants` entirely, and pins Chromium's own auto-update off for good measure. The clearest tell is Homey. It's built on the standard Raspberry Pi cloud-init image, and the first-boot `user-data` on the boot partition still carries the stock lines `#package_update: true` and `#package_upgrade: true`, commented out, directly under a heading that reads "Update apt database and upgrade packages on first boot." The switch ships in the image, one `#` away from on, and it's left off. (Homey's own app container does pull `:latest` on boot. The Debian base underneath it does not.)

So the single easiest win in the whole exercise is sitting there untaken. If you ship one thing after reading this, ship a first-boot `full-upgrade`.

Here's where it doesn't. The cross-release version is a different animal, and first boot is the worst place to run it, not the best.

- **Debian doesn't let you skip.** [Upgrades are only supported from the release right before](https://www.debian.org/releases/bookworm/amd64/release-notes/ch-upgrading.en.html), so 10 to 12 means 10 to 11 to 12, two full dist-upgrades back to back. The release notes document the direct jump failing outright, and the same chapter warns against running the upgrade remotely for exactly the reasons below. You're chaining the fragile operation, not dodging it.
- **Fail on first boot and the customer unboxes a brick.** A device that dies in service at least worked for a while. One that bricks itself the first time it's plugged in is a return and a support ticket on day zero. Worse product, not a safer one.
- **It assumes a network, and signage often doesn't have one yet.** Installs happen on captive Wi-Fi, flaky site links, or fully offline. No network at first boot means the upgrade quietly no-ops and the unit goes live on the stale, maybe end-of-life, base with nobody aware it skipped.
- **The field breaks it in boring ways.** Vendor and third-party repos (Citrix, balena, the vendor's own mirror) with no build for the new release, held packages, a conffile prompt nothing can answer, Pi firmware and kernel changes, a 16GB eMMC that runs out of space halfway through swapping the userland. Any one of those stalls it.
- **It only fires once.** First boot is a one-time event. It catches the device up on day one and does nothing eighteen months later when the base itself goes end of life. There is no second first boot. You're back at the same wall, now with a unit that's been in a wall bracket for a year and a half.

And the kicker: if you're willing to build and trust a fully automated, unattended, rollback-free dist-upgrade that runs across releases, you've reinvented image-based OTA, just the brittle version without the atomic swap or the rollback. At which point, ship the image.

So the honest answer is split. First-boot `full-upgrade` is real, it's the free win nobody here is taking, and every apt-based vendor on this list should turn it on tomorrow. First-boot `dist-upgrade` as a stand-in for crossing releases is a party trick that fails in exactly the conditions signage gets installed into, and it still leaves you reflashing when the base expires.

### What about an OTA agent?

That's the right instinct, and it's exactly what separates the two groups. An OTA agent, whether you roll your own with Mender, RAUC or SWUpdate, or adopt a whole platform like balenaOS or Ubuntu Core, does atomic A/B image updates with automatic rollback. The thing apt can't do, shipping a whole new base OS across a release boundary, is just another signed image to an OTA agent. It's the only mechanism in this roundup that clears the end-of-life wall without a truck roll, and the vendors who have one (ScreenlyOS on snaps, info-beamer and emteria on signed A/B, XOGO on balena) are the ones who can actually stay current for years.

I went looking for one inside the apt-based images too, and this is the part where trusting the SBOM would have lied to me, because an OTA agent is usually a vendor binary, not a package. One of them has it. TLXOS ships `tms_client`, the ThinLinX management agent, and the binary is full of partition-flashing logic: "Erasing kernel partition", "Erasing root partition", "Error programming boot partition". The disk even carries a separate "maint" partition for the job. So a TLXOS box can be reimaged out of band from ThinLinX's management server, apt or not. Whether that path actually delivers a current, patched OS depends entirely on whether ThinLinX builds and pushes one, which I can't tell from the image, but the mechanism is real, and it's the kind of thing a package scan never shows you. 1Play's `commander` binary can shell out to `apt-get install` on command, which is a remote hand on the package manager, but not a full upgrade and not image-based. The other three have nothing: single root partition, no A/B, no agent. Homey's app container pulls `:latest` on boot, but the Debian base underneath has no updater at all.

The reason the pure-apt vendors haven't just bolted one on: an OTA agent is not `apt install mender` and done. It wants an A/B partition layout, signed image artifacts, a build pipeline that produces whole-image updates, and a server to hand them out. That's re-architecting the product, not flipping a flag. It's still the right thing to build. It's also why, years into shipping, most of them are still on apt and a reflash.

## Why I care: this stuff lives on your network

Every one of these is a Linux computer with network access, sitting in a public or semi-public space, installed by facilities or marketing rather than IT, and left alone for years once it works. Many run a full browser engine rendering remote content. Several bundle VPN clients, remote-desktop clients and printing stacks. A compromised signage player is a quiet foothold inside the building's network, and nobody's watching it.

This isn't theory. Attackers already go after unmanaged IoT and edge devices to get in, exactly because those boxes are the least likely to be patched or watched. Thousands of fixable vulnerabilities in a browser and media stack, on a device that pulls content off the internet and sits next to the corporate LAN, is the exact thing they look for.

## And then there's the CRA

These are commercial products sold in the EU, so the [Cyber Resilience Act](https://sbomify.com/compliance/eu-cra/) covers them. The main obligations start on **11 December 2027**, and the reporting obligations already kicked in on **11 September 2026**. Against what I found:

- **No known exploitable vulnerabilities at release** (Annex I, Part I(2)(a)). Shipping a 2026 image on a 2024 point release, or on an end-of-life base, is hard to square with that.
- **Security updates, automatic by default** (Annex I, Part I(2)(c)). An image with no working update path, or one pointed at an archived repo, doesn't clear it.
- **A defined support period, usually at least five years** (Article 13(8)). It has to cover the base OS, and you can't promise five years on a distribution that's already end of life.
- **An SBOM covering at least the top-level dependencies** (Annex I, Part II(1)). Every vendor here would need one. Generating it is the easy part. Acting on it is where they fall over.
- **Handling vulnerabilities without delay** (Annex I, Part II(2)). Two to five thousand already-fixed advisories in a shipping image is not "without delay."
- **No default or unchangeable passwords, and protection from unauthorised access** (Annex I, Part I(2)(b)). A shipped `pi` / `raspberry` default and shared SSH host keys are the exact failures this clause exists to stop.

None of this needs heroics. Most of it goes away if you rebuild the image on a supported base on a schedule, ship it through an update mechanism the device actually uses, and keep watching the SBOM for new vulnerabilities as they land. That last part, watching the SBOM over time instead of scanning once at build, is literally what I do at [sbomify](https://sbomify.com), so yes, I have a horse in this race. The first two are just doing the job.

## Takeaways

**If you buy these things**, ask the vendor for an SBOM and a stated support period, and ask how OS-level updates actually reach the device. Put signage players on their own network segment, and put them in your asset inventory.

**If you build them**, turn on a first-boot `full-upgrade` today, because it's free and it clears most of the backlog above. Then treat the base image as a dependency with an expiry date, and remember apt won't save you when it arrives. Within-release upgrades keep you current until the base goes end of life; after that apt has no realistic cross-release path, so stand up an OTA agent (Mender, RAUC, SWUpdate, or a platform like balenaOS or Ubuntu Core) _before_ your base OS expires, not a fleet-wide reflash after. Track the base the way you track your app dependencies. Rebuild on a schedule, ship through a channel the device uses, and don't trust a clean scan of an end-of-life system. And do the basics an SBOM can't see: no default passwords, and regenerate SSH host keys on first boot instead of baking one shared key into every unit.

**For everyone else**: a hobby image that's two years old is a hobby project. A commercial product that's two years behind is a liability, and from December 2027 it's a compliance problem too. Turns out "pretty terrible" was generous.
