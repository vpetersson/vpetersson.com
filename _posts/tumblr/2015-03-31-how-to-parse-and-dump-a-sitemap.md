---
layout: post
title: How to parse and dump a sitemap
date: '2015-03-31T23:50:30+03:00'
tags:
- linux
- python
- webmaster
- SEO
- DevOps
permalink: /post/115153423414/how-to-parse-and-dump-a-sitemap
---
When deling with website migrations, you sometimes need to map out the old content such that you can create your redirect to the new pages.

While doing this, I ran across this little helpful snippet.

<script src="https://gist.github.com/vpetersson/f20efe6194460cc28d49.js"></script><p>Just modify the URL to the sitemap and the script will print out all the pages. You will need <a href="http://www.crummy.com/software/BeautifulSoup/">BeautifulSoup 4</a> and <a href="http://docs.python-requests.org/en/latest/">Requests</a>.</p>
