---
slug: complete-refactoring-of-csconnect
title: Complete refactoring of 'csconnect'
date: '2012-08-19T11:06:36+03:00'
tags:
- CloudSigma
- csconnect
- Python
aliases: /post/92729968184/complete-refactoring-of-csconnect
---

A few months back I wrote [csconnect](https://github.com/vpetersson/csconnect) to make it easier for myself to logon to our Cloud Sigma-nodes. It’s a pretty simple application. All it does is to poll Cloud Sigma’s API and lookup the IPs for the node(s) specified.

Yet, since this was one of the first Python-programs I ever wrote (beyond Hello World), the state of the code was pretty terrible. Last night I took on myself to rewrite the program from the ground up.

It works more or less the same. The only differences are that:

- I feel a lot better knowing the code is prettier ![:)](https://vpetersson.com/wp-includes/images/smilies/icon_smile.gif)
- It now uses a config-file to host the Cloud Sigma-credentials (instead of being stored in the actual script)

You can grab csconnect from its [Github-repo](https://github.com/vpetersson/csconnect).
