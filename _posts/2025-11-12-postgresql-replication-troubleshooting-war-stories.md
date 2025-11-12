---
layout: post
title: "PostgreSQL Replication Troubleshooting: War Stories from the Field"
date: '2025-11-12T00:00:00Z'
tags: [postgresql, database, consulting, replication, troubleshooting]
---

I recently wrapped up a consulting gig helping a client troubleshoot some gnarly PostgreSQL replication issues. What started as a "quick performance tune" turned into a deep dive through WAL checkpoints, replication slots, and the delicate dance of logical replication workers.

Here are the war stories from the trenches, complete with the errors we hit and how we solved them. If you're dealing with PostgreSQL logical replication at scale, you might find these useful.

## The Setup

The client was running a PostgreSQL logical replication setup between two servers using publication/subscription. The source server was running PostgreSQL 14, while the target server was on PostgreSQL 18. Everything was working, but performance was suffering, and the logs were filling up with concerning messages.

An important constraint: we could **not restart the source server**—it was a live production system handling real traffic. This limitation would prove crucial later when we hit replication slot limits.

Time to roll up the sleeves.

## War Story #1: The Checkpoint Chaos

### The Problem

The first red flag was in the logs on the receiving node:

```bash
[...]
Nov 11 16:26:56 [redacted].internal postgres[9307]: [102-1] 2025-11-11 16:26:56 UTC [9307] LOG: checkpoints are occurring too frequently (11 seconds apart)
Nov 11 16:26:56 [redacted].internal postgres[9307]: [102-2] 2025-11-11 16:26:56 UTC [9307] HINT: Consider increasing the configuration parameter "max_wal_size".
Nov 11 16:26:56 [redacted].internal postgres[9307]: [103-1] 2025-11-11 16:26:56 UTC [9307] LOG: checkpoint starting: wal
Nov 11 16:27:05 [redacted].internal postgres[9307]: [104-1] 2025-11-11 16:27:05 UTC [9307] LOG: checkpoint complete: wrote 1382 buffers (8.4%), wrote 0 SLRU buffers; 0 WAL file(s) added, 5 removed, 96 recycled; write=8.387 s, sync=0.943 s, total=9.559 s; sync files=19, longest=0.437 s, average=0.050 s; distance=1656483 kB, estimate=1656642 kB; lsn=D/194EB50, redo lsn=C/A2256A78
[...]
```

Checkpoints every 11 seconds? That's way too frequent. PostgreSQL was basically spending all its time doing housekeeping instead of actual work.

### The Solution

The fix was straightforward — increase the `max_wal_size` parameter:

```sql
ALTER SYSTEM SET max_wal_size = '8GB';
SELECT pg_reload_conf();
```

This gave PostgreSQL more breathing room before triggering checkpoints. The frequency dropped dramatically, and performance improved immediately.

But we weren't done yet. Looking at resource utilization, we noticed something interesting: CPU cores were maxed out on the receiving server, but the workload on the sending server was pretty low. When we checked `max_sync_workers_per_subscription`, it was set to just 2, explaining why we were only using two CPU cores for replication work.

To squeeze out more throughput, we bumped up the sync workers on the receiving node:

```sql
ALTER SYSTEM SET max_sync_workers_per_subscription = 8;
SELECT pg_reload_conf();
```

This was previously set to 2, so we quadrupled the parallelism. More workers should mean faster replication, right? Well, not so fast...

## War Story #2: The Replication Slot Shortage

### The Problem

After increasing the sync workers, we started seeing a different set of errors on the **sending** node:

```bash
[...]
2025-11-11 17:52:33 UTC [358108] postgres@[redacted] STATEMENT:  CREATE_REPLICATION_SLOT "pg_21465_sync_18014_7571499740820591239" LOGICAL pgoutput USE_SNAPSHOT
2025-11-11 17:52:33 UTC [358109] postgres@[redacted] ERROR:  replication slot "pg_21465_sync_18449_7571499740820591239" does not exist
2025-11-11 17:52:33 UTC [358109] postgres@[redacted] STATEMENT:  DROP_REPLICATION_SLOT pg_21465_sync_18449_7571499740820591239 WAIT
2025-11-11 17:52:33 UTC [358109] postgres@[redacted] ERROR:  all replication slots are in use
2025-11-11 17:52:33 UTC [358109] postgres@[redacted] HINT:  Free one or increase max_replication_slots.
2025-11-11 17:52:33 UTC [358109] postgres@[redacted] STATEMENT:  CREATE_REPLICATION_SLOT "pg_21465_sync_18449_7571499740820591239" LOGICAL pgoutput USE_SNAPSHOT
[...]
```

The pattern repeated over and over. PostgreSQL was trying to create replication slots but kept hitting the limit.

### The Root Cause

After some head-scratching, we figured out the math:

- The sending server had **4 replication slots** total
- PostgreSQL reserves **1 slot** internally
- That left us with **3 available slots**
- But we had configured **8 sync workers** on the receiving end

Each sync worker needs its own replication slot on the sender. 8 workers, 3 slots. The math doesn't work.

### The Solution

We had two options:

**Option 1: Dial back the sync workers** (what we did):

```sql
ALTER SYSTEM SET max_sync_workers_per_subscription = 3;
SELECT pg_reload_conf();
```

This immediately fixed the slot shortage since we now had exactly the right number of workers for available slots.

**Option 2: Increase replication slots on the sender** (requires restart):

```sql
ALTER SYSTEM SET max_replication_slots = 32;   -- pick a number that fits your needs
ALTER SYSTEM SET max_wal_senders = 32;         -- keep this in step with parallelism
```

The catch? These parameters require a full PostgreSQL restart to take effect. In our case, that was off the table, but if you have the flexibility, this gives you much more headroom for scaling.

## The Lessons

1. **WAL checkpoint frequency matters**: If you're seeing frequent checkpoints, bump up `max_wal_size`. Your disks (and performance) will thank you.
2. **Replication slots are finite**: Every sync worker needs a replication slot on the sender. Do the math before cranking up parallelism.
3. **Some parameters need restarts**: `max_replication_slots` and `max_wal_senders` are restart-required parameters. Plan accordingly.
4. **Monitor your logs**: Both nodes will tell you what's wrong, but sometimes the error shows up on the opposite end from where you'd expect.

## The Takeaway

PostgreSQL logical replication is powerful, but it has limits. Understanding the relationship between sync workers, replication slots, and WAL management is crucial when you're trying to scale throughput.
