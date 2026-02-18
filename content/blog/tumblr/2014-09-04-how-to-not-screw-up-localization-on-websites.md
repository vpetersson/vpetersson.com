---
slug: how-to-not-screw-up-localization-on-websites
title: How to not screw up localization on websites
date: '2014-09-04T19:13:39+03:00'
tags:
- dyson
- localization
- localisation
- seo
aliases: /post/96629746439/how-to-not-screw-up-localization-on-websites
---

Poorly implemented translations ‘logic’ is something that really grinds my gear. Today I ran across the new [Dyson 360 Eye](http://www.dyson360eye.com/) and it is a case study in how to **not** do website translations.

Since I’m connected to a VPN in Switzerland, this is what I was presented with: ![](/tumblr_files/tumblr_inline_nbdymqMeeW1skxjxc.webp)

As you can see, the website is in German just because I connected through Switzerland. Now let’s analyze why this is bad.

# Location != language

Your location isn’t really a great way to determine the language for a user. For instance, there are plenty of companies that route all their internal traffic through a central end-point for all their remote offices. Using this approach, all them will see the language of the country the end-point is located.

There are of course a ton of other situations that would break this logic too, such as VPN users (like yours truly) and incorrect GeoIP lookups.

A far better approach is to look at the locale of the browser, and user that as the basis. That way, you can serve the user with the language s/he prefers (regardless of location).

# Use proper URLs

Another thing you can notice in the Dyson example is that URL doesn’t change with the locale. For instance, one would expect something like `dyson360eye.com/de` or `dyson360eye.de` for the German version. Instead, you just have the German version being served under `dyson360eye.com`. Beyond being a horrible thing from an SEO perspective, it is also confusing for the users.

# Give the users a choice

Even if you have a good implementation for auto-probing for the users’ language (either using GeoIP or locale), you should still give the users a choice to override this.

In the case of Dyson, there is no way for me to change the language, **nor** override it manually by altering the URL.

# What should I do?

It’s easy to criticize, so let’s give Dyson some constructive feedback instead:

- Don’t use the same URL for all languages. Use proper suffix (such as `/de` or a separate subdomain).
- Use proper redirects for each language to not upset thy mighty Google Bot.
- Give the user a choice to set the language themselves (regardless how good you think your logic is).
