---
layout: post
title: How to fix kernel_task CPU usage on El Capitan
date: '2016-01-03T16:17:59+02:00'
tags:
- os x
- mac os x
redirect_from:
- /post/136535061619/how-to-fix-kerneltask-cpu-usage-on-el-capitan
- /2017/12/21/2016-01-03-how-to-fix-kerneltask-cpu-usage-on-el-capitan.html
---
Sometime ago, I wrote the blog post [How to fix kernel_task CPU usage on Yosemite](/2014/10/16/how-to-fix-kerneltask-cpu-usage-on-yosemite.html). This post still receives a great amount of traction, so I wanted to post an update that reflects the covers how to do this on El Capitan.

The process is largely the same, but requires a bit more work due to the changes to the additional security that El Capitan introduced to the file system with System Integration Protection (SIP).

The tl;dr is as follows:

*   Boot up the system in Recovery Mode (Cmd+R on boot). Start a Terminal window and run `csrutil disable`.
*   Reboot the system as normal and follow the same steps as in the original guide.
*   Reboot the system again into Recover Mode and enable SIP by running `csrutil enable`.
*   Reboot the system.

Step 1: Disable System Integration Protection (SIP)
===================================================

First, shut down your computer. Then power the computer on and boot it into [Recovery Mode](https://support.apple.com/en-gb/HT201314) by holding down Command + R.

Once the computer is done booting, bring up a Terminal window (Utility -> Terminal). With that done, simply run the following command:

    $ csrutil disable


That will disable SIP. In order for this to work, you now need to reboot your computer into regular mode (i.e. not anoter Recover Mode boot).

Step 2: Fix the issue
=====================

Once your computer is booted, stara Terminal session and run the following commands (for more information, see the [original post](/2014/10/16/how-to-fix-kerneltask-cpu-usage-on-yosemite.html):

    # Find the model
    $ system_profiler -detailLevel mini | grep "Model Identifier:"
    Model Identifier: MacBookPro8,2

    # Move and backup the file
    $ cd /System/Library/Extensions/IOPlatformPluginFamily.kext/Contents/PlugIns/ACPI_SMC_PlatformPlugin.kext/Contents/Resources
    $ sudo mv MacBookPro8_2.plist MacBookPro8_2.bak


With that done, it’s time to go back into Recover Mode again, so shut down your computer.

Step 3: Re-enable SIP
=====================

Boot the computer in Recover Mode again by pressing Command + R on boot. Again, open a Terminal window, but this time, run the following command:

    $ csrutil enable


Now reboot your computer and you should be all set.

**Update:** If you’re having issues with mac OS Sierra, please [How to fix kernel_task CPU usage on macOS Sierra](/2016/10/01/how-to-fix-kerneltask-cpu-usage-on-macos-sierra.html)
