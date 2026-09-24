---
slug: little-snitch-meets-1password-for-ai-agents
title: "Little Snitch Meets 1Password, for AI Agents"
date: '2026-09-23T10:00:00Z'
tags:
- ai
- security
- rust
- mcp
- 1password
- open-source
---

AI agents need credentials to do real work. Today, that usually means pasting long-lived API keys into their environment and hoping for the best.

That's a bad deal. The key now lives in an environment variable, a config file, a context window, and whatever got logged along the way. It works from anywhere, does everything the key can do, and lasts until you remember to rotate it. And when something goes wrong, the upstream's audit log tells you the key was used. Not which agent used it.

So I built [Agent IAP](https://github.com/vpetersson/agent-iap). It's an identity-aware proxy for AI agents that pulls credentials from 1Password. Agents get narrow, time-boxed access to the services they need. They never see the actual credentials.

## How it works

1. The agent gets a token minted by the proxy. It's not an API key. It's worthless anywhere except the proxy.
2. The agent calls a service through the proxy. Agent IAP checks the request against an ACL: allow, deny, or ask.
3. If the rule says ask, the request is parked and a dialogue pops up in your terminal. That's the Little Snitch part.
4. On approval, the proxy strips the agent's token, attaches the real credential, and forwards the call. The credential never leaks to the agent. That's the 1Password part.
5. Every decision is written to a hash-chained audit log, naming the agent and the rule that allowed it.

It works with both APIs and MCP servers. Enrolling PostHog is one command, and pointing an agent at it is another. The key stays in 1Password, and the policy file only holds a pointer to it:

```bash
agent-iap upstream add posthog --profile posthog \
    --secret "op://Private/PostHog/credential" --var region=eu
agent-iap agent add claude-code --target posthog
```

The agent then calls PostHog through the proxy with its own token:

```bash
curl -H "Authorization: Bearer $IAP_TOKEN" \
    http://127.0.0.1:8080/posthog/api/projects/
```

No rule allows that yet, so the call stops at your terminal:

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

You pick how long and how broad, and the answer becomes the rule. "5 min" writes an ACL rule with a deadline. When it lapses, the next call asks again. A parked request rings the terminal bell, and one nobody answers is denied.

Or skip the curl and hand an agent the proxy as an MCP server. It discovers what it's allowed to reach on its own.

## Avoiding the Little Snitch trap

Anyone who has used Little Snitch knows its failure mode. After the fiftieth prompt, you click Allow without reading. A permission prompt you've trained yourself to ignore is worse than none.

So the defaults push the other way. The cursor starts on the narrowest scope and "Once," so a reflexive keypress never grants more than was asked for. Grants can carry deadlines, so "yes, while I'm doing this" doesn't turn into "yes, forever." And the prompts are meant to be rare, which brings us to the ACL.

## Dial in the risk

Not every credential deserves the same treatment.

Low-stakes credentials, like a read-only service account for Google Analytics or PostHog, can be permanently available to every agent. No prompts, no friction. That covers most of what an agent actually does all day.

Everything else gets granted deliberately. Three things make a call worth thinking about, and none of them are legible from the URL:

- **It writes.** Sentry's `triage` level allows every read and exactly one write: the PUT that resolves, ignores, or assigns an issue. That's the whole job of an agent watching errors. The same credential doesn't also get to edit projects, alert rules, and members, and DELETE is denied outright rather than prompted.
- **It burns tokens or credits.** DataForSEO bills per call, and its `live` endpoints cost more than the queued ones. Nothing in the method or the path says so, and an agent has no way to know. The default level allows the queued endpoints and makes `live` ask. Semrush's MCP server is the same shape, except there the expensive call has a name you can write a rule against: `execute_report`.
- **It's destructive.** Cloudflare's `ask-writes` allows GET, denies DELETE outright, and parks everything else for a human. An ACL can't tell a reasonable POST from one that takes a zone offline.

Where the upstream already lets you scope a key, do that as well. An xAI key, for instance, carries its own allow-list of endpoints and models, chosen in the console when you mint it and checked before the proxy's policy is ever consulted. The ACL narrows what's left of it. It can never widen it.

This is also how human approval coexists with unattended agents. Standing rules keep routine work flowing while you're away. Prompts are reserved for the calls where you'd want to be interrupted anyway.

There are around 50 built-in profiles, covering Google, Cloudflare, PostHog, Sentry, GitHub, and Stripe among others. A profile knows the base URL, the auth scheme, and sensible access levels. But enrolling a service grants nothing. The first call still stops at your terminal.

## How I use it

I run all my agents in ephemeral VMs on a dedicated VLAN, managed with Terraform and Ansible on Proxmox. Each VM runs Claude Code and Codex, connects to a dedicated GitHub account for agents, and signs commits with its own SSH key. That gives me an audit trail of which agent did what.

I orchestrate everything through [Multica](https://multica.ai), which lets me manage agents like a Kanban board. Queue a task, review the findings, move on. That setup is safe precisely because nothing on the agent VLAN holds a credential worth stealing. It stopped working the moment tasks weren't just code: build a report from Google Analytics, check a setting in Cloudflare. Agent IAP is how agents get those credentials without actually getting them.

## Why not just use...

_Vault or OpenBao?_ Agent IAP isn't a secrets manager. It reads from yours. A secrets manager decides who can read a credential. Agent IAP makes sure the agent never reads it at all.

_`op run`?_ It injects secrets into the process environment. The agent still has them.

_Scoped, expiring API keys?_ Use them where you can. Many services don't offer them. Agent IAP narrows whatever the key allows on top.

## What it doesn't do

It doesn't stop data exfiltration. This is the most important limitation, so I'll be blunt. A prompt-injected agent with read access to PostHog doesn't need your API key. It can read your analytics through the proxy and send them anywhere it can reach. Agent IAP never inspects response bodies. It stops credentials from leaking and narrows what an agent can touch. Controlling where data goes afterwards is your network's job. In my setup, that's the locked-down VLAN. You need both halves.

It concentrates your credentials in one place. The proxy loads every credential it fronts into memory at startup. Compromise the proxy host and you get all of them. That's a deliberate trade: one hardened process, outside the agent network, running under a tightly sandboxed systemd unit, versus secrets scattered across every environment that processes untrusted input. But treat the proxy host accordingly.

Tokens are bearer tokens. Possession is proof. By default, a leaked agent token works against the proxy, within the ACL, until you rotate it. Run workload identity in `required` mode and agents instead carry tokens scoped to one task, signed by a per-process key, expiring within the hour. If a renewed token keeps getting used, the whole lineage is revoked and flagged in the audit log. None of this binds a token to a channel. mTLS would, and it's not built yet. Until then, make sure the proxy is only reachable from your agent network.

It's not a firewall and not a sandbox. It constrains what an agent can reach, not what it can compute.

And it's not built for the data center. For production agent traffic at scale, look at something like [agentgateway](https://agentgateway.dev/). Agent IAP is for your development flow, where you need ad hoc rules for what your agents can touch.

If things go sideways, press `L` in the console. Everything is denied until you press it again.

## Built by agents, for agents

You'll notice it in the commit history, so I'll say it upfront: much of Agent IAP was written by agents running in the exact setup described above, orchestrated through Multica. A security tool written by AI deserves extra scrutiny, and I'd rather you apply it than take my word for anything. The code is open, there's a test suite, and [SECURITY.md](https://github.com/vpetersson/agent-iap/blob/master/SECURITY.md) has a private channel for reporting vulnerabilities. If you find a way past the ACL, I want to hear about it.

## Try it

Agent IAP is open source under the MIT license and written in Rust. It's early, but I use it every day.

```bash
brew tap vpetersson/agent-iap https://github.com/vpetersson/agent-iap
brew trust vpetersson/agent-iap
brew install agent-iap
agent-iap init
```

Prebuilt Linux and macOS binaries are on the [releases page](https://github.com/vpetersson/agent-iap/releases). Issues and PRs welcome.
