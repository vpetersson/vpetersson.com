---
slug: using-ansible-with-google-cloud-platform-the-easy
title: Using Ansible with Google Cloud Platform (the easy way)
date: '2015-12-04T17:51:17+02:00'
tags:
- ansible
- libcloud
- DevOps
- linux
- google
- gce
- google cloud
- google compute engine
aliases: /post/134533191074/using-ansible-with-google-cloud-platform-the-easy
---

For some time, [Ansible](http://www.ansible.com/) has been my configuration management of choice and we use it for both [Screenly](http://www.screenlyapp.com) and [YippieMove](http://www.yippiemove.com). Since both of these services are running on Google Compute Engine, we’re using Ansible’s [dynamic inventory](http://docs.ansible.com/ansible/intro_dynamic_inventory.html) for GCE.

(Behind the scenes, this dynamic inventory is using [Apache Libcloud](https://libcloud.apache.org/), which is a great Python library for interacting with various providers.)

When I first followed Ansible’s [Google Cloud Platform Guide](http://docs.ansible.com/ansible/guide_gce.html) I did run into a fair bit of trouble with authentication.

As it turns out, Libcloud is very picky when it comes to the environment variables that you need to set. To solve this, I whipped together a little script that I call on to set the appropriate variable environments for each project I’m working on. This saved me a lot of headache.

The script looks as follows:

    #!/bin/bash
    export GCE_PROJECT=your-project
    export GCE_PEM_FILE_PATH=~/.gce/$GCE_PROJECT\.json
    export GCE_EMAIL=$(grep client_email $GCE_PEM_FILE_PATH | sed -e 's/  "client_email": "//g' -e 's/",//g')
    gcloud config set project $GCE_PROJECT

Just change `GCE_PROJECT` to match your setup, and then run:

    $ source /path/to/script.sh

You can now run Ansible with the GCE inventory file.

As an added bonus, this also configures `gcloud` to the same project.

Happy (DevOps) hacking.
