---
layout: post
title: How to deal with/archive an old WordPress site
date: '2014-12-04T18:33:00+02:00'
tags:
- wordpress
- DevOps
- html
- migration
redirect_from:
- /post/104338402244/how-to-deal-witharchive-an-old-wordpress-site
- /post/104338402244/how-to-deal-with-archive-an-old-wordpress-site
---

We all have those old blogs that we started some time ago with some grandiose vision. Unfortunately, the blog never really took off. Now it just sits there and generate a small amount of traffic every day. It’s enough to not shut it down, but not enough to invest a whole lot more resources into.

Chances are that said blog is running on WordPress. You now have to log into the blog somewhat frequently to upgrade it. Moreover, chances are also that your blog has been compromised during this time and you don’t even know about it.

Sounds familiar? I’ve had a few of these, and today I finally had enough and decided to do something about it.

Here are the steps I took to migrate two of our old WordPress sites to static files.

(Also take a look at my other post [How to migrate from WordPress to Tumblr](/2014/07/24/how-to-migrate-from-wordpress-to-tumblr.html))

## Backup the files and database

Before we begin, you should make sure that you have backups of both the files and database.

## Add the site to Google Webmaster Tools

If you haven’t already, make sure to add your site to [Google Webmaster Tools](https://www.google.com/webmasters/). This will allow us to monitor potential errors that could cause SEO penalties.

It is also worth adding the site to [Bing Webmaster](https://www.bing.com/webmaster) to ensure Bing don’t find anything either.

## Bring the site up to date

First, we want to make sure that it is up to date. While it might not matter too much (since we are moving it to a static page anyways) I felt better knowing that I had brought it up to date.

Also, given how easy this is to do in WordPress, there is little reason not to do this (other than perhaps incompatible themes etc).

## Scan it using WordFence

It is likely that your WordPress installation has been compromised. As such, I strongly recommend that you scan it using [WordFence](https://wordpress.org/plugins/wordfence/) first. For both the sites that I migrated, I found issues.

Resolve these issues before moving on.

## Generate a Sitemap

If you have a sitemap, make sure that it is up to date (i.e. refresh it).

If you don’t, make sure you generate one with a tool like [Google Sitemap Generator](https://wordpress.org/plugins/google-sitemap-generator/).

## Creating a static copy

My first approach was to use the WordPress plugin [Very Static](https://wordpress.org/plugins/really-static/) to generate a full static copy of my installation. While this plugin does a great job at generating a static copy, it is designed to run in conjunction with your WordPress installation. As such, I wasn’t able to get it to run independently (it refused to use ’/’ as the root, which caused all links in the static files to be wrong).

Since Very Static failed, I resorted to the good old tool `wget` to fetch a copy for me.

On the same server, I simply created a new folder and ran:

    $ mkdir static.my-wordpress-blog.com
    $ cd static.my-wordpress-blog.com
    $ wget --mirror -nH -k -E http://www.my-wordpress-blog.com
    $ wget http://www.my-wordpress-blog.com/sitemap.xml

This will take some time. When done, you should have a complete static copy of your WordPress installation.

I also looked at the output and noticed that one of the sites had a lot of spam there that I manually removed. This was probably as a result of some SQL Injection attack that WordFence was unable to detect.

## Change document root

After verifying that `wget` was able to retrieve all files, the last step was to update the document root. Depending on your web server, this will differ. On Nginx, all I had to do was to change the ‘root’ stanza from ’/path/to/www.my-wordpress-blog.com’ to ’/path/to/static.my-wordpress-blog.com’. I also disabled all PHP specific configuration options just to speed things up further.
