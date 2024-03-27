---
layout: post
title: On UniFi Captive Portals
date: '2024-03-27T01:00:00+01:00'
tags:
- unifi
- open-source
- devops
---

## What are captive portals?

Lately, I've been doing some digging into captive portals - you know, these things that pop up when you try to connect to the WiFi at a coffee shop or hotel. In essence, they are very simple:

* You load a web page that usually requires you to tick a box or enter your email.
* If the system is satisfied with the input above, you are sent to a page that returns HTTP status 200 (and usually a `success` message in the body), which tells the system that you're online.

Now, I'm a massive UniFi fan. Over the years, I've migrated most of my networks over to UniFi equipment with [Dream Machine Pros](https://store.ui.com/us/en/collections/unifi-dream-machine/products/udm-pro) as the firewall. It's a great turn-key solution that largely just works. Prior to this, I usually relied on either a [pfSense](https://www.pfsense.org/) (and later [OPNsense](https://opnsense.org/)), but frankly, the UDM is just a great device that integrates seamlessly with all other UniFi hardware. That means provisioning a whole network is done in a few clicks.

## Captive portals and UniFi

Bringing this back to the topic of captive portals, UniFi's console does allow you to provision captive portals out-of-the-box (called 'Hotspot Portal'). However, their support is rather limited. Usually, the reason any commercial WiFi deployment would want to use a captive portal for their WiFi is to capture email addresses (for marketing), or to set tracking pixels (for remarketing). UniFi's default captive portal does not allow you to do either of this, making it somewhat moot to enable.

![UniFi's built-in hotspot/captive portal](/assets/unifi-built-in-captive-portal.png)

What they do support, however, is something they call 'External Portal Server,' which allows you to integrate a third-party captive portal with the UniFi hardware. This is all neat until you start digging into the details. Or should I say, the lack of details. You see, UniFi provides absolutely *zero* documentation on this. There are, however, third-party services/libraries that have reverse-engineered how this flow works, but it's less than ideal.

## Using External Portal Servers

What you notice when you start digging into these third-party tools is that they all ask you for admin access to your UniFi Console (which also needs to be publicly accessible). That should be a pretty big red flag right there, as this essentially gives them full control over your network. In theory, they could own your entire network and do all sorts of mischief, like redirecting `gmail.com` to a phishing site.

There is, however, a good reason why they ask for this. As it turns out, this is required for an External Portal Server to work; they need the ability to approve guests by issuing an API call to the console.

When a user tries to access the WiFi, a GET request is sent to the external server that looks like this:
`http://externalportal.example.com?ap=access_point_mac&user_mac=user_mac_address&ssid=network_ssid&url=original_url_requested`

Notice all those GET parameters:

* ap=access_point_mac
* user_mac=user_mac_address
* ssid=network_ssid
* url=original_url_requested

With that information, the external portal then needs to issue back a POST request to the console that looks something like this:

```
POST /api/s/<site_name>/cmd/stamgr
Authorization: Bearer <API_Token>
Content-Type: application/json
{
   "cmd": "authorize-guest",
   "mac": "<user_mac_address>",
   "minutes": <authorization_duration>
}
```

Notice that we need to pass the MAC address back, along with how long the session should be open.

Now, there are a few problems with this:

* We need to be able to talk directly to the console (i.e., this is **not** unifi.ui.com), but rather the console directly.
* We need to acquire a Bearer token (which is done by issuing a call to the `/api/auth/login` with a set of admin-level credentials).

As you can see, this is why these tools need both direct access to your UniFi console and a set of credentials. Some of them also use this to provision the External Portal Server configuration, which is somewhat neat.

## Is it possible to use External Portal sensibly?

The short answer is that the only sensible way to do this is if you run your External Portal on the local network. It's still far from ideal, but that way, you can at least avoid having to expose your console to the public internet. It wouldn't be very difficult to implement the above flow, but I don't think anyone who cares even the slightest about security should a) expose their console to the public internet and b) hand over admin credentials to a third party.

What I'm really hoping for is that UniFi will allow API access to their cloud-based console (unifi.ui.com), and provide proper API documentation. Currently, the implementation is prone to breakage, especially since the API isn't even versioned. Additionally, the lack of ACL/permissions for user accounts is a significant issue. Ideally, one should be able to issue an API token that can only approve clients. Solving these issues would make it viable to offer this as a cloud-based service.

For now, I might develop a simple Python application to test the waters, as you can access the console's API over the LAN. Or I might just give the NodeJS implementation below a go.

My initial idea of creating a SaaS product around this (I even bought the domain [CaptivePortalConnect.com](https://captiveportalconnect.com/) for the purpose) is likely not worth pursuing due to the fragile (and insecure) approach required.

## References

* [unifi-hotspot](https://github.com/woodjme/unifi-hotspot) - NodeJS based captive portal that can feed to Google Sheets. Looks very promising.
* [UniFi API Client](https://github.com/Art-of-WiFi/UniFi-API-client) - A PHP based UniFi client that is actively maintained by [Art of WiFi](https://artofwifi.net), who offer captive portals as a service (based on the library).
* [aiounifi](https://github.com/Kane610/aiounifi) - Python based UniFi library used by Home Assistant.
* [unificontrol](https://github.com/nickovs/unificontrol) - Another Python based UniFi library.