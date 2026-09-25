---
title: Agent IAP
tagline: The agent makes the call. The credential never leaves the proxy.
summary: An identity-aware proxy for LLM agents. Give an agent an API or an MCP server without giving it the key — an ACL decides what may go out, a human answers what the ACL cannot, and every call lands in a hash-chained log naming the agent and the rule that let it through.
description: Agent IAP is an identity-aware proxy for LLM agents, written in Rust. It holds the upstream credentials, gates every call behind an ACL with a Little Snitch style approval prompt, and writes a tamper-evident audit log.
keywords: identity aware proxy, ai agent security, llm agents, api credentials, mcp gateway, 1password, secrets management, audit log, acl, rust
repo: vpetersson/agent-iap
image_url: ghcr.io/vpetersson/agent-iap
license: MIT
language: Rust
blog_post:
  url: /2026/09/23/little-snitch-meets-1password-for-ai-agents/
  title: Why I built it
spec:
  - 0 credentials in the agent
  - ~60 service profiles
  - HTTP and MCP
  - hash-chained audit log
exchange:
  kind: config
  input_label: iap.toml
  output_label: what the agent gets back
  # Captured from a running proxy in front of a local echo server that prints
  # the headers it received, so the first row shows a real injected credential
  # arriving at a real upstream. The JSON is pretty-printed for reading.
  rows:
    - id: allow
      label: A rule that says yes. The agent sent the token this proxy minted it, and the API received the key the agent never sees.
      config: |
        [[acl]]
        target = "demo"
        methods = ["GET"]
        paths = ["/v1/models"]
        action = "allow"
      topic: GET /demo/v1/models → 200
      payload: |-
        {
          "path": "/v1/models",
          "x-api-key seen by the upstream": "sk-the-real-api-key",
          "authorization seen by the upstream": null
        }
    - id: ask
      label: A rule that asks a human. Nothing was watching the queue, so it denied rather than waving it through.
      config: |
        [[acl]]
        target = "demo"
        methods = ["POST"]
        paths = ["/v1/messages"]
        action = "ask"
      topic: POST /demo/v1/messages → 403
      payload: |-
        {
          "error": {
            "message": "held for approval by policy `acl[1]` and not allowed
                        (ask:no-approver-denied)",
            "type": "approval_denied"
          },
          "proxy": "agent-iap"
        }
    - id: audit
      label: Allowed or not, the call is one line — the agent, the rule that decided, and a hash over the line before it.
      config: |
        [audit]
        path = "iap-audit.jsonl"
      topic: iap-audit.jsonl
      payload: |-
        {
          "seq": 2,
          "ts": "2026-09-25T09:01:06.778Z",
          "agent": "claude-code",
          "target": "demo",
          "method": "POST",
          "path": "/v1/messages",
          "decision": "deny",
          "rule": "acl[1]",
          "status": 403,
          "prev_hash": "1ade617f9d62af98…",
          "hash": "626fe71c5d3351d9…"
        }
features:
  - title: The key stays in the proxy
    body: The agent holds a token this proxy minted. It authenticates nowhere else, revoking it rotates nothing, and only its sha256 is in the file. The real credential is read from 1Password — or the environment, or a file — inside the proxy and attached on the way out.
  - title: Little Snitch, for credentialed calls
    body: A rule can park a call and raise a dialogue on your terminal — allow it once, for five minutes, for an hour, or from now on. Anything but once writes the rule, and writes it in front of the rule that asked.
  - title: A default never widens access
    body: Adding a rule defaults to asking rather than allowing, and a grant has to name the service it is about. Enrolling a service grants nothing on its own — the first call stops at the console, and the rule comes out of the answer.
  - title: Every call is attributable
    body: One JSON line per request — the agent, the rule that decided, the status, the duration — each committing to the line before it. Bodies are not logged, and credential headers are replaced before anything is written.
  - title: Tokens that expire with the job
    body: An agent can trade its standing token for one scoped to the run in front of it, valid for an hour at most. Renewing rotates it, and a second holder presenting the superseded token kills the lineage.
  - title: About sixty services already worked out
    body: Google service accounts, Cloudflare, Sentry, PostHog, Semrush, Linear, Slack, Stripe and the rest arrive with their base URL, credential scheme and scopes — and a note saying what that profile cannot reach.
---

## Run it

Homebrew on macOS or Linux, or the static binary, or a distroless image. The tap
is the repository itself, so there is no second `homebrew-` repo to keep in step.

```bash
brew tap vpetersson/agent-iap https://github.com/vpetersson/agent-iap
brew trust vpetersson/agent-iap
brew install agent-iap
```

Then five commands and a proxy. There is no editor step: every one of them
validates the edit before it writes, and a rejected flag leaves the file exactly
as it was.

```bash
agent-iap init
agent-iap upstream add anthropic \
    --base-url https://api.anthropic.com \
    --auth header --header x-api-key --secret op://Private/Anthropic/credential
agent-iap acl add --target anthropic --methods POST --paths /v1/messages --action allow
agent-iap agent add claude-code --target anthropic
agent-iap run
```

`agent add` prints the agent's token once and copies it to your clipboard. Point
the agent at `http://127.0.0.1:8080/anthropic` with that token where the API key
used to go, and nothing else about it changes.

## What the agent finds

An agent handed a token and an address has everything it needs and no idea what
to do with it. So the root of the proxy answers that question, generated from the
policy that is actually running, for the agent that asked:

```console
$ curl -sH "Authorization: Bearer $IAP_TOKEN" http://127.0.0.1:8080/
# agent-iap

You have reached agent-iap at `http://127.0.0.1:8080`, as `claude-code`.
…
## What you can reach

### `demo`

- proxied at `http://127.0.0.1:8080/demo/<path>`
- the proxy attaches the credential — `header x-api-key` — and drops any you send

#### Rules that apply to you, in order

- **allow** `acl[0]` — GET `/v1/models`
- **ask a human** `acl[1]` — POST `/v1/messages`
```

Two agents on one proxy are told two different things, and neither is told
anything it could not have learned by making one refused call.

## MCP, both directions

The proxy is itself an MCP server: add `http://127.0.0.1:8080/_iap/mcp` to a
client and the APIs behind it arrive as tools, with skills built from the running
policy rather than a README that goes stale the first time a rule changes.

It also fronts somebody else's MCP server — remote ones as an ordinary upstream,
stdio ones through a bridge that spawns the real server with the credential in
its environment and asks the daemon to rule on every JSON-RPC message. A
`tools/call` shows up in the same audit log and the same approval queue as an
HTTP request.

## On a laptop, or on a box

`agent-iap run` on a terminal _is_ the approval console: the queue, the rule
list, the enrolment forms and a live tail of the audit log. Under systemd or in
a container there is no terminal to draw on, so it is the log stream it always
was, and an `ask` is answered over the control plane or denied. Either way the
policy file is watched — enrolling an agent, revoking one, rotating a leaked
token or renewing a certificate all land in the running proxy without a restart.

The reference documentation lives with the code: the
[policy file](https://github.com/vpetersson/agent-iap/blob/master/docs/policy-file.md),
the [service profiles](https://github.com/vpetersson/agent-iap/blob/master/docs/profiles.md),
[TLS](https://github.com/vpetersson/agent-iap/blob/master/docs/tls.md),
[deployment](https://github.com/vpetersson/agent-iap/blob/master/docs/deployment.md),
and the [security model](https://github.com/vpetersson/agent-iap#security-model)
with the list of what it deliberately does not give you.
