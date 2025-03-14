---
layout: post
title: How to migrate from WordPress to Tumblr
date: '2014-07-24T22:53:00+03:00'
tags:
- wordpress
- tumblr
- migration
- migrate
- nginx
redirect_from: /post/92760339864/how-to-migrate-from-wordpress-to-tumblr
---

Today, I’ve spent a large chunk of my day migrating my blog from WordPress to Tumblr and [About.me](http://about.me/vpetersson).

Before you ask why on earth I’d do this, let me just sum it up in a few bullet points:

- I hate PHP and managing WordPress sites. Yes, it has gotten a lot better lately, but it’s still a big pain in the ass.
- Most of the content I generate is either on other blogs, or fed via Twitter. As a result, I don’t blog too much.

Now, you’re likely reading this post because you’re interested in the subject at hand, so let’s dive into it.

(You may also find my article [How to deal with/archive an old WordPress site](/2014/12/04/how-to-deal-witharchive-an-old-wordpress-site.html) interesting)

Yet, before we start, there are a few pre-requisites for this to work:

- You’re moving from one subdomain (or domain) to another. In my case, I’m moving from ‘viktorpetersson.com’ to 'blog.viktorpetersson.com’
- Your old blog will still be online (the redirect and images will still be served from here)
- You use Nginx as your web server (but this can probably be changed pretty easily by adjusting the rewrite rules in the script).
- You already have Tumblr up and running with your subdomain/domain.
- You need a Tumblr API key. You can sign up for this [here](https://api.tumblr.com/console).

The backbone of my migration was two WordPress plugins, so let’s get started by installing them:

- [Google XML Sitemaps](http://www.arnebrachhold.de/redir/sitemap-home/)
- [Tumblr Crosspost](https://github.com/meitar/tumblr-crosspostr/#readme)

Start by installing these plug-ins into your WordPress site. Make sure to also activate them.

# Migrating the content to Tumblr

Thanks to the plugin **Tumblr Crosspostr**, migrating the content over to Tumblr is a breeze. First, you need to configure the plug-in by adding your Tumblr API keys.

Before we begin the migration/import, make sure you don’t have the setting in Tumblr that will automatically post to Twitter or Facebook. If you do, you’ll spam your own wall with all these posts.

With that done, go to **Tools** -\> **Tumblrize Archive** -\> **Tumblrize Everything!**.

# Getting a list of source pages

Once you’ve installed the sitemap-plugin, you should be able to go to [http://your-site.com/sitemap.xml](http://your-site.com/sitemap.xml) and copy and paste the content of into a text-file on your computer.

It should look something like:

    http://viktorpetersson.com/ 100%    Daily   2013-08-02 13:21
    http://viktorpetersson.com/2013/08/02/are-they-using-google-apps/   20% Monthly 2013-08-02 13:21
    http://viktorpetersson.com/2013/06/15/my-presentation-from-pi-and-more-3/   20% Monthly 2013-06-16 09:03
    http://viktorpetersson.com/2013/06/01/join-me-on-pi-and-more-on-june-15/

# Generating redirects

Next, let’s do put work some Python magic. Thanks to [pytumblr](https://github.com/tumblr/pytumblr), this part is a breeze.

Start by fetching [this](https://gist.github.com/vpetersson/83da37e80702078e7775) file.

You need to update the following:

- tumblr_blog
- wordpress_site
- source_file
- `<consumer_key>`
- `<consumer_secret>`
- `<oauth_token>`
- `<oauth_secret>`

With that done, you should be able to simply run the script. The script should spit out redirect rules that you can install on your Nginx configuration.

After that you’re done. Happy hacking!
