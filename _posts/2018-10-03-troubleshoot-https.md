---
layout: post
title: Troubleshoot HTTPS with curl
date: '2018-10-03T13:00:00+01:00'
tags:
- kubernetes
- linux
- devops
- note-to-self
---

Troubleshooting an HTTPS connection can be somewhat challenging at times (in particular if Cloudflare is involved).

Today, I had to troubleshoot a Kubernetes (Nginx) Ingress controller that was acting up for [Screenly](https://www.screenly.io). Having done this on more than one occasion, I decided to create a public Note-to-Self in order to avoid having to Google for the exact syntax in the future.

For this task, my weapon of choice is `curl`.

The key we want to accomplish is to be able to explicitly specify the IP address to the load balancer in order to rule out any possible DNS issue.

First, we can use `curl` to get the HEAD. The key here is that we pass on the desired domain/sub-domain using the 'HOST' header. We also specify the IP address of the load balancer directly (a.b.c.d):

```
$ curl -I \
    -H "HOST: some.domain.com" \
    https://a.b.c.d
[...]
```

Assuming that still doesn't work, we may need to take a closer look at the SSL certificate that by adding `-w %{certs}`.

Recent versions of `curl` added the `--resolve` functionality, which is handy. You can then do something like this:

```
$ curl -I \
    --resolve 'some.domain.com:443:a.b.c.d' \
    https://some.domain.com
```
