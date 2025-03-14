---

layout: post
title: 'Yocto, RockPi and SBOMs: Building Modern Embedded Linux Images'
date: '2025-02-21T15:34:00+01:00'
tags:
- yocto
- embedded
- linux
- rockpi
- sbom
- security

---

**TLDR**: _I wanted to generate an up-to-date disk image for a Rock Pi 4 using Yocto that included CUPS and Docker to both get a better understanding of Yocto and test the new SBOM generation feature._

As with many single-board computers (SBCs) from China, the issue often isn't the board itself but rather the software. RockPi from Radxa is no exception. If you go and download the [latest disk images](https://wiki.radxa.com/Rock4/downloads) for this board, you will notice that they are all end-of-life (EoL). However, these boards are still great and work very well for many applications. This should be top of mind if you are building a product that uses any of these devices.

I wanted to use one of the RockPi 4 boards I had for a simple print server. It's not a customer product, of course, but let's assume it was. Since it has the option to add eMMC storage, I find it more reliable than Raspberry Pi (I know the Raspberry Pi 5 allows for proper storage). However, given that I neither trust the Radxa disk images nor did I want to set things up on an already EoL Linux distribution, I started doing some digging. As it turns out, the RockPi is supported in Yocto.

Say what you want about Raspberry Pi, but you can still download an up-to-date OS that runs on the Pi 1.
In this article, I will show you not only how to build a disk image with Yocto (in this case for the Rock Pi 4, but it can easily be adjusted for other boards), but we will also talk a bit about how Yocto generates SBOMs (hint: it's really clever) and where to find your SBOMs.

## What is Yocto anyways?

The Yocto Project is an open-source framework for building custom Linux distributions tailored to embedded systems. It provides a flexible, modular build system based on BitBake and OpenEmbedded, enabling developers to create highly optimized and reproducible Linux images for specific hardware. Yocto is widely used in industries like automotive, IoT, and networking due to its ability to support diverse architectures and long-term maintenance needs. With its layered architecture, extensive BSP support, and strong focus on customization, Yocto is a powerful tool for developers looking to build and maintain embedded Linux systems efficiently.

I've toyed with it a few times over the years to build images for Raspberry Pis, but never really used it seriously. However, I recently crossed paths with some of the Yocto people in a CISA working group I'm co-chairing on [SBOM generation](https://github.com/CISA-SBOM-Community/SBOM-Generation). As it turns out, Yocto is very sophisticated when it comes to generating SBOMs, so I wanted to get some more up-to-date exposure to Yocto. Color me impressed. Not only did Yocto produce a Software Bill of Materials (SBOM) for me -- it did so without even asking me.

Since Yocto builds everything from source and is essentially a package manager, it is able to capture all the dependencies into an SBOM. Moreover, since Yocto maintains detailed information about every dependency, it is able to generate very high-quality SBOMs.

## Key Yocto Terminology

Before we dive in, here are some key terms in Yocto that you probably want to understand:

- **Poky** – The reference distribution of the Yocto Project, containing the OpenEmbedded build system, BitBake, and a set of metadata
- **Scarthgap** – The codename for the Yocto Project 5.0 release
- **Mickledore** – The codename for Yocto 4.2
- **Kirkstone** – The codename for Yocto 4.0, a long-term support (LTS) release
- **Dunfell** – The codename for Yocto 3.1, another LTS release
- **Layers** – Modular additions to the base Yocto version that provide extra functionality
- **BitBake** – The build tool used by Yocto to process recipes and generate images
- **OpenEmbedded (OE)** – The build framework Yocto is based on
- **Recipes** (.bb files) – Build instructions for individual packages or applications
- **BSP** (Board Support Package) – A set of metadata and configurations for specific hardware platforms

## Building a disk image with Yocto

Before we build, you will need a pretty beefy server to build this image (or a lot of time). I'm using my [home server](/2024/05/04/home-server-journey.html), and I think it took about an hour or two to build the initial version. Subsequent builds will be a lot faster due to cache.

I've used an Ubuntu 24.04 VM to build my disk images, and you can find the base dependencies you need to install [here](https://docs.yoctoproject.org/ref-manual/system-requirements.html).

### Let's get our hands dirty

First, clone the repositories and set up the layers:

```bash
$ git clone -b scarthgap https://git.yoctoproject.org/poky
$ cd poky
```

```bash
# Add layers
$ git clone -b scarthgap git://git.yoctoproject.org/meta-arm
$ git clone -b scarthgap git://git.yoctoproject.org/meta-rockchip
$ git clone -b scarthgap git://git.openembedded.org/meta-openembedded
$ git clone -b scarthgap git://git.yoctoproject.org/meta-virtualization
```

```bash
$ source oe-init-build-env
```

```bash
$ bitbake-layers add-layer ../meta-arm/meta-arm-toolchain
$ bitbake-layers add-layer ../meta-arm/meta-arm
$ bitbake-layers add-layer ../meta-rockchip
$ bitbake-layers add-layer ../meta-openembedded/meta-oe

# Add docker support
$ bitbake-layers add-layer ../meta-openembedded/meta-python
$ bitbake-layers add-layer ../meta-openembedded/meta-networking
$ bitbake-layers add-layer ../meta-openembedded/meta-filesystems
$ bitbake-layers add-layer ../meta-virtualization
```

Next, adjust your `conf/local.conf` by appending these configurations:

```bash
MACHINE = "rock-pi-4b"

INIT_MANAGER = "systemd"
DISTRO_FEATURES:append = " virtualization wifi"
DISTRO_FEATURES:remove = " x11 wayland"
CORE_IMAGE_EXTRA_INSTALL += "openssh cups cups-filters ghostscript qpdf vim docker e2fsprogs-resize2fs"
```

Finally, build the image:

```bash
$ bitbake core-image-base
```

Note, if you're building on Ubuntu 24.04, you might need to run:

```bash
$ sudo apparmor_parser -R /etc/apparmor.d/unprivileged_userns
```

After the build completes, you can find your image here:

```bash
$ ls -lah tmp/deploy/images/rock-pi-4b/core-image-base-rock-pi-4b.rootfs-*.wic
```

Flash this disk image and you should be good to go. Once it's up and running, you should be able to SSH into the device using `root` and a blank password.

## On updating

It's important to note that Yocto generates a disk image. By default, you cannot update this disk image by any other means than reflashing it (e.g., you can't run "apt update"). There are over-the-air (OTA) platforms that can be integrated into Yocto, such as [Mender](https://mender.io/) and [RAUC](https://rauc.io/), but by default, you need to rebuild the image from scratch to update dependencies and patch vulnerabilities.

## Finding Your SBOMs

One of the cool features of Yocto is that it automatically generates SBOMs. You can find them in the deploy directory:

```bash
$ ls -lah tmp/deploy/images/rock-pi-4b/*spdx*
[..]
```

You can extract the SPDX file with:

```bash
$ tar --zstd -xvf \
    path/to/tmp/deploy/images/rock-pi-4b/core-image-base-rock-pi-4b.rootfs-*.spdx.tar.zst
```

Do note that this will generate a lot of files. You will find a file called `index.json` in there, which links to all other SBOMs using document linking.

(Check out my article [Mastering SBOM Generation with Yocto](https://sbomify.com/2025/02/21/mastering-sbom-generation-with-yocto/) for more details on the SBOMs.)

## On running in production

If you are intending to run this in production, please do not just copy the above. These images are configured for lab or test mode. Yocto is very well suited for production images, but you need to harden them and also have an OTA strategy in place. Alternatively, I can recommend [Balena](https://www.balena.io/), which uses Yocto under the hood and also supports the Rock Pi.

## Future improvements

One limitation of the current disk image for Rock Pi is that you don't have a functional TTY. You can SSH in, or you could use a serial console, but the regular TTY doesn't work and I haven't spent much time trying to figure out why. Also, the disk system doesn't automatically expand to use all available space on the eMMC/SD.

Some things I'm planning to add in the future:

- Add support for Tailscale (there's a [meta-tailscale](https://github.com/ChristophHandschuh/meta-tailscale) layer)
- Add support for auto disk expansion
- Add WiFi support

## Resources

- [Yocto Project Documentation](https://docs.yoctoproject.org/)
- [Adding Docker to Yocto Project](https://kacperstapor.com/blog/24-11-2024/adding-docker-to-yocto-project)
- [RAUC on Rockchip](https://www.konsulko.com/rauc-on-rockchip)
