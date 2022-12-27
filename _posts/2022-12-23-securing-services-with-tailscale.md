---
layout: post
title: Securing and exposing local services with Tailscale and Nginx
date: '2022-12-23T13:00:00+01:00'
tags:
- tailscale
- nginx
- tls
- lets-encrypt
---

Securing and encrypting communication on local network devices is a hard problem. Plenty of people tried, including myself in our now sunsetted company [WoTT](https://wott.io/). The root of the problem is a combination of DNS and routing to local IPs, which means you can't use automated certificate issuers, like Let's Encrypt. The solution, it seems, comes from an unexpected source: the VPN/Wireuard service provider Tailscale.

I've been a fan of [ZeroTier](https://www.zerotier.com/) for some time and use it both personally and professionally to access nodes behind firewalls. Recently, I kept hearing from more and more people how much they love [Tailscale](https://tailscale.com). After hearing [@jnsgruk](https://hachyderm.io/@jnsgruk)’s glowing reviews of Tailscale at Ubuntu Developer Summit, I decided to give it a go myself.

It's clearly a much more polished product than ZeroTier. Both the UI and UX is a lot smoother and it just feels much more production ready. After enrolling a few nodes, I was sold so it was time to start migrating.

There isn't much to write about how to add a machine to Tailscale as that part is dead easy. What I will focus on in this article is how to use to really neat features in Tailscale to solve the problem in the opening paragraph:

* [MagicDNS](https://tailscale.com/kb/1081/magicdns/)
* [SSL Certificates](https://tailscale.com/kb/1153/enabling-https/) (powered by Let's Encrypt)

Together, this is a game changer.

For some time, I've been planning to secure my local web services (Home Assistant, Proxmox etc) with self-signed SSL certificates issued by a local CA (using [cfssl](https://github.com/cloudflare/cfssl)). This however opens a Pandora's Box of security issues. As you now need to trust a local self-signed CA on all your machines, this could in theory be exploited for some really nasty MiTM attacks if someone were to get their hands on the root CA keys.

As it turns out, Tailscale solves this for me, but instead of using self-signed certificates, I get proper certificates issued from Let's Encrypt.

The way it works is rather elegant. When you enable MagicDNS, you get a domain assigned (e.g. `foobar.ts.net`). All your devices will then get a hostname there (e.g. `my-server.foobar.ts.net`). Since this is a valid FQDN, Tailscale can use it to issue proper certificates from Let's Encrypt with the command `tailscale cert my-server.foobar.ts.net`.

Just like with regular Let's Encrypt certificates, these are semi short-lived and thus need to be renewed periodically. As such, we need to automate this renewal on all our hosts with a simple systemd service:

```yaml
# /etc/systemd/system/tailscale-cert.service
[Unit]
Description=Tailscale SSL Service Renewal
After=network.target
After=syslog.target

[Service]
Type=oneshot
User=root
Group=root
WorkingDirectory=/etc/ssl/private/
Environment="HOSTNAME=my-server"
ExecStart=tailscale cert ${HOSTNAME}.foobar.ts.net

[Install]
WantedBy=multi-user.target
```

```yaml
# /etc/systemd/system/tailscale-cert.timer
[Unit]
Description=Renew Tailscale cert

[Timer]
OnCalendar=monthly
Unit=tailscale-cert.service

[Install]
WantedBy=basic.target
```

With these two files created, you can fire up the service by hand to make sure it works:

```bash
$ systemctl daemon-reload
$ systemctl start tailscale-cert.service
```

If everything went well, you should now have your certificates in `/etc/ssl/private`.

We can then do something very basic to expose an internal service running on say `locahost:8080` using Nginx by editing `/etc/nginx/sites-enabled/default` (or similar):

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    return 301 https://$host$request_uri;
}


server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name my-server.foobar.ts.net;
    ssl_certificate /etc/ssl/private/my-server.foobar.ts.net.crt;
    ssl_certificate_key /etc/ssl/private/my-server.foobar.ts.net.key;

    # You might want to include the hardening config that Let's Encrypt
    # puts into place here as well to improve security further.

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://localhost:8080;
    }
}
```

You should now be able to just navigate to your server using a **proper** SSL certificate on the address https://my-server.foobar.ts.net. Pretty neat.

There's even an [official Nginx auth](https://tailscale.com/blog/tailscale-auth-nginx/) that can be used. I haven't toyed with this yet, but you could presumably use this to lock down your Nginx reverse proxies even further.

Below are some notes that I encountered while setting this up on various systems.

## Home Assistant

By default, Home Assistant will complain if you try to access it over a proxy. To overcome this, you need to add this in `configuration.yaml`.

```yaml
http:
 use_x_forwarded_for: true
 trusted_proxies:
   - 127.0.0.1
```

You may also need to tweak your Nginx config for working with WebSocket.

Finally, if you're intending to conect to a MariaDB/MySQL instance using TLS, [the official documentation](https://www.home-assistant.io/integrations/recorder/#mariadb-omit-pymysql-using-tls-encryption) is wrong. As [this forum post](https://community.home-assistant.io/t/mysql-through-an-ssl-connection/453607) correctly pointed out, instead of `;ssl=true`, you need to append `&ssl=true`.

## Proxmox

Setting up Tailscale on Proxmox was just like any other system. The somewhat tricky part was to consume the certificate. To accomplish this, I added the following line after `ExecStart` in `/etc/systemd/system/tailscale-cert.service`, which instructs Proxmox to use the certificates issued from Tailscale:

```yaml
ExecStartPost=pvenode cert set /etc/ssl/private/${HOSTNAME}.foobar.ts.net.crt /etc/ssl/private/${HOSTNAME}.foobar.ts.net.key --force 1 --restart 1
```

Somewhat unrelated to the certificates, but in order to install Tailscale on an LXC container, you need to run it privileged mode as per [this document](https://tailscale.com/kb/1130/lxc-unprivileged/) and add to the config:

```
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

Do note that you can't move a container to privileged mode from unprivileged as this will break file permissions and other things in the container. The way to accomplish this is to take a backup of the container, and then **restore** the container as privileged.

## MariaDB/MySQL

To use the certificate with MariaDB/MySQL, we need to modify our setup a little bit in order to accomidate for permissions.


```yaml
# /etc/systemd/system/tailscale-cert.service
[Unit]
Description=Tailscale SSL Service Renewal
After=network.target
After=syslog.target

[Service]
Type=oneshot
User=root
Group=root
Environment="HOSTNAME=mariadb"
ExecStart=/usr/local/sbin/tailscale-mysql.sh
[Install]
WantedBy=multi-user.target
```

```bash
#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

mkdir -p /etc/mysql/ssl
tailscale cert \
    --cert-file /etc/mysql/ssl/cert.crt \
    --key-file /etc/mysql/ssl/cert.key \
    ${HOSTNAME}.foobar.ts.net
chown mysql:mysql -R /etc/mysql/ssl
chmod 0660 /etc/mysql/ssl/cert*
```

With this done, we just need to tell MariaDB/MySQL to use these certificates:

```yaml
# /etc/mysql/mariadb.conf.d/50-server.cnf
[...]
# We need to point to a CA path instead of the CA file since we
# are using a proper certificate.
ssl-capath = /etc/ssl/certs/
ssl-cert = /etc/mysql/ssl/cert.crt
ssl-key = /etc/mysql/ssl/cert.key
require-secure-transport = on

# We don't want to allow lower ciphers than 1.2 as per NIST etc
tls_version=TLSv1.2
[...]
```

Finally, restart the service with `systemctl restart mysql`.

You might also want to recreate your MySQL user and add the constraint `REQUIRE SSL;` to ensure the remote users only can connect using TLS (even though that should in theory also be done using `require-secure-transport`).


## InfluxDB 2

Much like MariaDB/MySQL, setting up InfluxDB requires a bit extra work with permission.

We start with unit that fires a Bash script

```yaml
#/etc/systemd/system/tailscale-cert.service
[Unit]
Description=Tailscale SSL Service Renewal
After=network.target
After=syslog.target

[Service]
Type=oneshot
User=root
Group=root
Environment="HOSTNAME=influxdb"
ExecStart=/usr/local/sbin/tailscale-influxdb.sh

[Install]
WantedBy=multi-user.target
```

We then create the bash script:
```bash
#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

mkdir -p /etc/influxdb/ssl
tailscale cert \
    --cert-file /etc/influxdb/ssl/cert.crt \
    --key-file /etc/influxdb/ssl/cert.key \
    ${HOSTNAME}.foobar.ts.net
chown influxdb:influxdb -R /etc/influxdb/ssl
chmod 0660 /etc/influxdb/ssl/cert*
```

Upon starting this script, we should now get our certificates in place. The only thing we need to do now is to edit the configuration file to have it consume our certificate:

```toml
# /etc/influxdb/config.toml
bolt-path = "/var/lib/influxdb/influxd.bolt"
engine-path = "/var/lib/influxdb/engine"
tls-cert = "/etc/influxdb/ssl/cert.crt"
tls-key =  "/etc/influxdb/ssl/cert.key"
```

Restarting the service will automatically make InfluxDB serve content over HTTPS. You shouldn't need to update the client configuration, as the port never changed.


## OPNsense

I'm yet to add support for this. It should certainly be possible, but BSD isn't an officially supported platform. Moreover, because OPNSense uses its own CA for things like VPN configuration, it might be a bit more challenging.


