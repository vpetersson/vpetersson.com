---
slug: little-snitch-meets-1password-for-ai-agents
title: "Introducing Agent IAP - Little Snitch meets 1Password for AI agents"
date: '2026-09-23T10:00:00Z'
tags:
- ai
- security
- rust
- mcp
- 1password
- open-source
---

These days I run all my agents in ephemeral VMs on a dedicated VLAN, managed with Terraform and Ansible on top of [Proxmox](/2026/05/14/proxmox-imgctl/). Each VM runs Claude Code and Codex, talks to a dedicated GitHub account that only the agents use, and signs its commits with its own SSH key. I orchestrate the whole thing through [Multica](https://multica.ai), which lets me manage agents a bit like a Kanban board. Queue up a task, review the findings, move on.

The reason I'm comfortable letting that run unattended is that there's nothing on that VLAN worth stealing. No API keys, no secrets, nothing. If an agent goes off the rails or swallows a prompt injection, the blast radius is a throwaway VM and a repo I can revert.

That worked great right up until the tasks stopped being about code. Build me a report from Google Analytics. Check a setting in Cloudflare. Pull some numbers out of PostHog. All of a sudden the agent needs a credential for a system that was never part of the arrangement.

The usual answer is to paste a long-lived API key into the agent's environment and hope for the best. I really didn't want to do that. Once you do, the key lives in an environment variable, a config file, a context window, and whatever got logged along the way. It works from anywhere, it does everything that key can do, and it lasts until you remember to rotate it. Then when something does go wrong, the upstream's audit log will cheerfully tell you that the key was used. Not which agent used it.

So I built [Agent IAP](https://github.com/vpetersson/agent-iap) instead. It's an identity-aware proxy for AI agents that pulls credentials from 1Password. The agents get narrow, time-boxed access to the services they need, and they never see the actual credentials.

## How it works

1. The agent gets a token minted by the proxy. It isn't an API key, and it's worthless anywhere except the proxy.
2. The agent makes a call through the proxy. Agent IAP checks it against an ACL: allow, deny, or ask.
3. If the rule says ask, the request is parked and a dialogue pops up in my terminal. That's the Little Snitch part.
4. Once I approve it, the proxy strips the agent's token, attaches the real credential and forwards the call. The credential never goes anywhere near the agent. That's the 1Password part.
5. Every decision gets written to a hash-chained audit log that names the agent and the rule that let it through.

It works with both plain APIs and MCP servers. Enrolling PostHog takes one command, and pointing an agent at it takes another. The key itself stays in 1Password, and the policy file only holds a pointer to it:

```bash
agent-iap upstream add posthog --profile posthog \
    --secret "op://Private/PostHog/credential" --var region=eu
agent-iap agent add claude-code --target posthog
```

The agent then calls PostHog through the proxy using its own token:

```bash
curl -H "Authorization: Bearer $IAP_TOKEN" \
    http://127.0.0.1:8080/posthog/api/projects/
```

No rule allows that yet, so the call stops at my terminal:

```
┌ Claude Code is asking ───────────────────────────────────────┐
│  Claude Code  (claude-code)                                  │
│  wants to GET /api/projects/ on posthog                      │
│                                                              │
│    Once   5 min   1 hour   1 day   Until quit   From now on  │
│                                                              │
│      ( ) anything on posthog                                 │
│      ( ) → GET on posthog                                    │
│      (•) → GET /api/projects/ on posthog                     │
│                                                              │
│       d  Deny     a  Allow     esc  leave it waiting         │
└──────────────────────────────────────────────── waiting 4s ──┘
```

You pick how long and how broad, and your answer becomes the rule. Picking "5 min" writes an ACL rule with a deadline on it, and once that lapses the next call asks again. A parked request rings the terminal bell, and one that nobody gets around to answering is denied.

Or you can skip the curl entirely and just hand the agent the proxy as an MCP server, in which case it discovers what it's allowed to reach on its own.

## Avoiding the Little Snitch trap

Anyone who has used Little Snitch knows exactly how this goes wrong. After the fiftieth prompt you stop reading and just hit Allow. A permission prompt you've trained yourself to ignore is arguably worse than no prompt at all.

So the defaults deliberately push the other way. The cursor starts on the narrowest scope and on "Once", so a reflexive keypress never grants more than was actually asked for. Grants can carry a deadline, which means "yes, while I'm doing this" doesn't quietly turn into "yes, forever". And the prompts are meant to be rare in the first place, which brings us to the ACL.

## Dial in the risk

Not every credential deserves the same treatment.

The low-stakes ones, like a read-only service account for Google Analytics or PostHog, can just be permanently available to every agent. No prompts, no friction. That covers most of what an agent actually does all day.

Everything else I want to grant deliberately. There are three things that make a call worth thinking about, and none of them are obvious from looking at the URL:

- **It writes.** Sentry's `triage` level allows every read plus exactly one write: the PUT that resolves, ignores or assigns an issue. That's the entire job of an agent watching errors, and the same credential doesn't also get to edit projects, alert rules and members. DELETE is denied outright rather than prompted.
- **It burns tokens or credits.** DataForSEO bills per call, and its `live` endpoints cost more than the queued ones. Nothing in the method or the path tells you which is which, and the agent certainly has no idea. So the default level allows the queued endpoints and makes `live` ask first. Semrush's MCP server is the same shape, except there the expensive call at least has a name you can write a rule against: `execute_report`.
- **It's destructive.** Cloudflare's `ask-writes` allows GET, denies DELETE outright and parks everything else for a human. An ACL can't tell a reasonable POST from one that takes a zone offline.

Where the upstream lets you scope the key itself, do that as well. An xAI key, for instance, carries its own allow-list of endpoints and models that you pick in the console when you mint it, and that gets checked long before my policy is ever consulted. The ACL narrows whatever is left of it. It can never widen it.

This is also how human approval manages to coexist with unattended agents. Standing rules keep the routine work flowing while I'm asleep or away, and the prompts are reserved for the calls I'd want to be interrupted for anyway.

There are around 50 built-in profiles at the moment, covering Google, Cloudflare, PostHog, Sentry, GitHub and Stripe among others. A profile knows the base URL, the auth scheme and a set of sensible access levels. Do however note that enrolling a service grants nothing on its own. The first call still stops at your terminal.

## Why not just use...

_Vault or OpenBao?_ Agent IAP isn't a secrets manager, it reads from yours. A secrets manager decides who is allowed to read a credential. Agent IAP makes sure the agent never reads it at all.

_`op run`?_ That injects the secrets straight into the process environment. The agent still ends up holding them.

_Scoped, expiring API keys?_ Use them wherever you can, they're great. Plenty of services don't offer them though, and Agent IAP narrows whatever the key does allow on top of that.

## What it doesn't do

This is the part I'd rather you read than skip, so let me be blunt about where this thing stops.

It doesn't stop data exfiltration, and that's the big one. A prompt-injected agent with read access to PostHog doesn't need your API key at all. It can happily read your analytics through the proxy and ship them off to wherever it can reach. Agent IAP never looks at response bodies. It stops credentials from leaking and it narrows what an agent can touch, but controlling where the data goes afterwards is your network's job. In my setup that's the locked-down VLAN. You really do need both halves.

The VLAN is a fairly blunt instrument though. It tells me that an agent can reach the internet, and very little about what it actually did once it got there. So the next thing on my list is to route all agent traffic through a SOCKS5 proxy (or something similar) so that I can actually see and log the traffic patterns, rather than just trusting that my firewall rules are doing their job. Knowing which hosts an agent talked to, and how often, feels like the missing half of the audit log that Agent IAP already keeps.

It also concentrates your credentials in one place. The proxy loads every credential it fronts into memory at startup, so if you compromise the proxy host you get all of them. That's a deliberate trade, one hardened process sitting outside the agent network under a tightly sandboxed systemd unit, versus secrets scattered across every environment that processes untrusted input. But you should treat that host accordingly.

Tokens are bearer tokens, so possession is proof. By default a leaked agent token works against the proxy, within the ACL, until you rotate it. You can turn on workload identity in `required` mode, and then agents carry tokens that are scoped to a single task, signed by a per-process key and expiring within the hour. If a superseded token keeps getting used, the whole lineage is revoked and flagged in the audit log. None of that binds a token to a channel though. [mTLS](/2024/05/29/tailscale-and-mutual-tls/) would, and it isn't built yet, so for now make sure the proxy is only reachable from your agent network.

It's also not a firewall and not a sandbox. It constrains what an agent can reach, not what it can compute.

And it isn't built for the data center. If you're running production agent traffic at scale, go look at something like [agentgateway](https://agentgateway.dev/) instead. Agent IAP is for your development flow, where you want ad hoc rules about what your agents can touch.

Oh, and if things really go sideways, press `L` in the console. Everything is denied until you press it again.

## Built by agents, for agents

You'll spot it in the commit history soon enough, so I'll say it upfront: a lot of Agent IAP was written by agents, running in the exact setup I described at the top and orchestrated through Multica. A security tool written by AI deserves extra scrutiny, and I'd much rather you apply it than take my word for any of this. The code is open, there's a test suite, and [SECURITY.md](https://github.com/vpetersson/agent-iap/blob/master/SECURITY.md) has a private channel for reporting vulnerabilities. If you find a way past the ACL, I genuinely want to hear about it.

## Try it

Agent IAP is open source under the MIT license and written in Rust. It's early days, but I use it every single day.

```bash
brew tap vpetersson/agent-iap https://github.com/vpetersson/agent-iap
brew trust vpetersson/agent-iap
brew install agent-iap
agent-iap init
```

There are prebuilt Linux and macOS binaries on the [releases page](https://github.com/vpetersson/agent-iap/releases) if you'd rather skip Homebrew. Issues and PRs welcome.

Happy hacking!
