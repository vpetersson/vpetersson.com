---
layout: post
title: Troubleshoot HTTPS with curl and openssl
date: '2018-10-03T13:00:00+01:00'
tags:
- kubernetes
- linux
- devops
- note-to-self
---

Troubleshooting an HTTPS connection can be somewhat challenging at times (in particular if Cloudflare is involved).

Today, I had to troubleshoot a Kubernetes (Nginx) Ingress controller that was acting up for [Screenly](https://www.screenly.io). Having done this on more than one occasion, I decided to create a public Note-to-Self in order to avoid having to Google for the exact syntax in the future.

For this task, my weapons of choice is `curl` and `openssl`.

The key we want to accomplish is to be able to explicitly specify the IP address to the load balancer in order to rule out any possible DNS issue.

First, we can use `curl` to get the HEAD. The key here is that we pass on the desired domain/sub-domain using the 'HOST' header. We also specify the IP address of the load balancer directly (a.b.c.d):

```
$ curl -I \
    -H "HOST: some.domain.com" \
    https://a.b.c.d
[...]
```

Assuming that still doesn't work, we may need to take a closer look at the SSL certificate that is being served. To do that, we can use good 'ol OpenSSL:

```
$ openssl s_client \
    -connect a.b.c.d:443 \
    -servername some.domain.com \
    -showcerts
[...]
```

We do the same thing as we did with `curl`. By explicitly specifying the IP to the load balancer, as well as the domain that we are troubleshooting, we're able to get the load balancer to serve us the desired certificate.

Some readers may be quick to point out that you can accomplish the same by altering your `/etc/hosts` file. This is correct, but IMHO this is a cleaner approach.
