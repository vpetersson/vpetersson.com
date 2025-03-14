---
layout: post
title: Access control in Bottle (by IP)
date: '2012-06-26T20:46:26+03:00'
tags:
- Bottle
- Heroku
- Python
redirect_from: /post/92729964659/access-control-in-bottle-by-ip
---

If you haven’t heard of [Bottle](http://bottlepy.org/docs/stable/), it’s a lightweight web framework for Python. It is perfect if you have a small project that requires a web interface, but you don’t want to go all in with a complex framework like Django.

Since Bottle is so lightweight, it doesn’t always have all the features you need built-in. One thing that I was missing was access control. For instance, what if you want to limit access to an admin-page to a certain IP? Sure, if you’re running you’re app behind a full-fledge webserver like Nginx or Apache, you can use it to limit access, but that doesn’t work if you’re deploying to something like [Heroku](http://www.heroku.com/).

As it turns out, implementing a feature like this yourself isn’t really that hard. We’ll simply rely on the HTTP flags REMOTE\_ADDR and HTTP\_X\_FORWARDED\_FOR. Just checking for REMOTE_ADDR won’t work on Heroku.

First, start by creating a function that checks for this:

    def adminAccess():
        remoteaddr = request.environ.get('REMOTE_ADDR')
        forwarded = request.environ.get('HTTP\_X\_FORWARDED_FOR')

        if (remoteaddr in accessList) or (forwarded in accessList):
            return True
        else:
            return False

Next, create a list of IPs that have access to the admin pages:

    accessList = ["123.123.123.123"]

Now, all you need to do is to add a check for this on each page you want to restrict access. For instance here’s a pointless admin-page that checks for your IP:

    @route('/admin')
    def admin_page():
        if adminAccess():
            pass
        else:
            return "Access denied"

        return "Yay! It worked!"

That’s it. Pretty straight forward.
