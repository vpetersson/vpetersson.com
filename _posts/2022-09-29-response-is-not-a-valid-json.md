---
layout: post
title: Wordpress, 'The response is not a valid JSON response' and Cloudflare
date: '2022-09-29T13:00:00+01:00'
tags:
- wordpress
- cloudflare
- apache
- lets-encrypt
- note-to-self
---

In the last 24 hours, I've spent an embarrassing amount of time trying to debug a simple WordPress installation. When saving any changes, I received `The response is not a valid JSON response`.

After spending a long time researching this, I discovered about a hundred useless answers to why people received this. In retrospect, one of the common replies was that it was related to SSL. However, in my case SSL worked just fine, so that didn't make a lot of sense. Except that it was right on the money, in a convoluted way.

See, the server was running a regular LAMP installation with Let's Encrypt providing the SSL certificate. That part worked. I knew the certificate was valid etc. I then use Cloudflare for DNS/CDN/DDoS protection. Routing to the site worked just fine. **However**, by default, Cloudflare is set its SSL/TLS [encryption mode](https://developers.cloudflare.com/ssl/get-started) to 'Flexible'. This means that Cloudflare will gladly reverse proxy an HTTP end-point.

In my case, what happened was that Cloudflare would serve the content as HTTPS to the client, but use **HTTP** in the reverse proxy. As far as WordPress is concerned, the content is then served as HTTP, thus causing some internals to break. (On a technical note, what I would imagine happening is that WordPress simply ignore common flags, such as `X-FORWARDED-PROTO` that could have helped here.)

The solution was to change the 'encryption mode' from 'Flexible' to 'Full (strict)', which means that Cloudflare will HTTPS to communicate to the back-end (while also validate the certificate). This is exactly what I wanted.

Hopefully this will save someone else a bunch of head scratching.
