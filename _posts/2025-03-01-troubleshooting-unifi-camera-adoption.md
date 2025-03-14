---
layout: post
title: 'Troubleshooting UniFi Camera Adoption on Old G3 Pro Cameras'
date: '2025-03-01T20:24:00+00:00'
tags:
- unifi
- cameras
- troubleshooting
- networking
---

I recently got a few affordable G3 Pro cameras to replace some less-than-stellar G4 Dome units I had in my setup. Once I hooked these cameras up to the network, they appeared in my UniFi Console (Dream Machine Pro) without issue. However, after clicking the "Adopt" button, they became stuck in "Restoring" mode for quite some time.

Eventually, I decided to look for solutions online and found [a blog post](https://www.kilala.nl/index.php?id=2614) detailing a similar problem. My own fix turned out to be simpler, and here is how I resolved the issue:

1. **Download the Next Latest Firmware:**
   - Navigate to the [UniFi downloads page](https://www.ui.com/download/software/uvc-g3-pro) and locate the firmware just below the absolute latest release (for example, version 4.30.0).
   - If you try to use the newest release (like version 4.51.4), the camera may not recognize it.

2. **Log In to the Camera Directly:**
   - From your UniFi Console, note the camera's IP address.
   - Enter that IP address in your browser.
   - Use the default credentials (ubnt/ubnt) to log in. (In the blog post I read, the credentials were provided by Protect, but that was not the case here.)

3. **Upgrade the Firmware and Wait for Further Updates:**
   - Upload the firmware you downloaded in Step 1.
   - Once the camera finishes updating, it should be automatically adopted by UniFi Protect, which will then trigger subsequent upgrades as needed.

By following these steps, I managed to get the cameras up and running without a hitch. If you find your G3 Pro cameras are stuck in "Restoring" mode, this process might save you a lot of time and headaches.
