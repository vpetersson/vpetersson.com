---
layout: post
title: How to grant SSH access to a 'regular' user on OPNsense
date: '2021-11-17T13:00:00+01:00'
tags:
- opnsense
- pfsense
- ssh
- note-to-self
---

I was working on trying to grant a 'regular' user SSH access in [OPNsense](https://opnsense.org/) last night. After banging my head against the wall for some time (partially because the [official documentation](https://docs.opnsense.org/manual/how-tos/user-local.html) is outdated), I was able to figure it out.

(Do however note that this is _different_ than how you grant a user SSH access in [pfSense](https://www.pfsense.org/), where the steps do align with the outdated documentation.)

Here's how you do it:

- Go to System -> Access -> Groups
  - Create a new group called 'remote_access'
- Go to System -> Access -> Users
  - Create a new user with a valid shell (i.e. not `nologin`), and make sure to add a valid SSH key and to add the user to the group 'remote_access'
- Go to System -> Administration and navigate to the 'Secure Shell' Section.
  - Under 'Login Group', select 'wheel,remote_access'

This of course assumes that you have SSH already enabled and remotely accessible. However, assuming this is true, you should now be able to login using the newly created user.
