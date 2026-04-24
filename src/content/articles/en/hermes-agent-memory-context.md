---
title: "Hermes vs OpenClaw: The Memory Problem Nobody Wants to Solve"
description: "While everyone debates whether Hermes Agent or OpenClaw is better, a more fundamental question keeps getting dodged: how should Agent Memory and Context actually be designed?"
author: yang-zhengwu
date: 2026-04-13
tags: ["AI Agent", "Memory", "Context Design", "Agent Architecture"]
---

## Introduction

The tech community is buzzing again.

Hermes Agent ([github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)) burst onto the scene, brandishing the slogan "learn from experience, evolve through use," going straight for OpenClaw's jugular. Predictably, "OpenClaw is dead" narratives started flying.

But that's not what I want to talk about.

A couple of days ago in the AgentZone group chat, me, Ma Gong, Xu Laoshi, and lencx got into a discussion about Agent memory. After a few rounds, we realized something: whether it's Hermes or OpenClaw, both are ducking the same question. **How should Memory and Context be designed so that an Agent is actually trustworthy?** What's really at stake here is "identity" and "control."

---

## The Takeaway

Lencx said something I completely agree with:

> If your Agent Memory only does "store chat logs + vector retrieval," what it has isn't memory — it's a trash can with a search function.

Harsh, but spot on. I'd add:

> If your Agent has memory but no "personality," its memory becomes an uncontrolled accumulation — it doesn't know what to keep, what to discard, or what to trust.

---

## What Each Framework Has Done

### OpenClaw's Approach

OpenClaw takes the "everything is a file, human always present" route.

- Identity system relies on `SOUL.md` to define Agent personality
- Memory is stored as files and requires manual maintenance
- Skills can be written by humans or created by the Agent itself
- Critical operations require user confirmation

The advantages are obvious: transparent and controllable. You can clearly see what the Agent remembers and what it does. But cross-session learning and memory consolidation still largely depend on humans to figure out.

### Hermes's Approach

Hermes is noticeably more "modern."

| Layer | Capability | Design Intent |
| --- | --- | --- |
| Persistent Memory | `MEMORY.md` (~800 tokens) + `USER.md` (~500 tokens) | Small and stable, always in context |
| Historical Retrieval | SQLite + FTS5 full-text search | Large and on-demand, pulled in when needed |
| External Providers | Honcho and 7 other memory providers | Deep user modeling, cross-session profiling |
| Skill Layer | Auto-create, auto-optimize, auto-retire | Procedural memory — "knows how to do things" |
| Context Assembly | Auto-discover and load project rule files | Prompt assembly pipeline |

Dual-track memory, layered storage, skill distillation — each layer has clear design intent. Hermes has genuinely put thought into its Memory architecture.

### Where's the Problem?

**Neither framework has truly solved the problem of "how memory should be governed."**

OpenClaw's approach is straightforward: hand the governance responsibility to humans. `SOUL.md` needs human definition, Memory needs human maintenance, and Agent-created Skills need human oversight.

Hermes is more subtle. It wraps the absence of governance in "auto-evolution." The Agent decides what to remember, how to compress it, and when to update Skills. It looks intelligent, but it's actually handing a problem that requires rigorous design over to LLM's probabilistic reasoning.

I said something in the group chat:

> Having memory and self-evolution can sometimes make context uncontrollable.

This isn't fear-mongering — it's an engineering fact that's been verified repeatedly.

---

## Why "Personality" Is the Prerequisite for Memory

The group discussion quickly zeroed in on one point. Ma Gong said:

> I think there has to be a personality. Only with a clearly defined personality can memory be correctly compressed.

Simple words, but they hit the nail on the head.

### A Concrete Example

Say your Agent has accumulated these memory entries:

1. User prefers concise code style (2026-01-15)
2. User is working on a React project (2026-02-03)
3. User said last week to use TypeScript instead of JavaScript going forward (2026-03-20)
4. User said today that React is too heavy, wants to try Svelte (2026-04-10)

The question is: which ones should be kept? Which should be updated? Which should be marked as "outdated"?

Without a stable "personality" guiding the compression strategy, any of these errors could occur:

| Error Type | Manifestation | Consequence |
| --- | --- | --- |
| **Full Retention** | All memories pile up equally | Context bloat, scattered attention, skyrocketing costs |
| **Arbitrary Compression** | LLM decides取舍 on its own | Critical context lost, erratic behavior |
| **Wrong Override** | New info unconditionally replaces old | Loss of historical dimension, no way to trace decision rationale |
| **Selective Blindness** | Only remembers recent, forgets important | Acts like a newcomer every time, can't form stable collaboration |

This isn't theoretical. Hermes limits `MEMORY.md` to 800 tokens and `USER.md` to 500 tokens — when they exceed the limit, the Agent consolidates on its own. **But what's the standard for consolidation?** Is it the LLM's current probability distribution? Or some stable, auditable principle?

No "personality" means no standard. No standard means "auto-evolution" is pure luck.

### "Personality" Is Far More Than a Prompt Trick

Many people think "personality" means giving the Agent a name and writing a system prompt. It's way more than that.

Personality here refers to **the meta-information of the compression algorithm**, and it determines several critical things.

**Priority Anchors.** For a "code quality-obsessed engineering assistant," code style preferences are high-priority memories. For a "speed-focused startup assistant," delivery rhythm preferences matter more.

**Conflict Resolution Rules.** When new preferences contradict old ones, do you "replace," "coexist," or "create a branch"? A "conservative" personality tends to preserve historical evidence; an "aggressive" personality tends toward rapid iteration.

**Forgetting Strategy.** What kind of memory can be safely forgotten, and what must be kept even when expired.

**Context Assembly Weights.** When multiple memory entries compete for limited context window space, personality is the ultimate re-ranking criterion.

A Memory system without personality is like an archive with no editorial policy — everything gets stored, nothing is usable.

---

## Uncontrollable Self-Evolution Is the Real Danger

Xu Laoshi said something heavy in the group chat:

> I don't trust any uncontrollable self-evolution anymore.

This cuts straight to the core risk of the Hermes model.

### Three Classic Modes of Self-Evolution Failure

**Memory Drift.** Derived memories feed new derived memories. A piece of content gets rewritten, summarized, and used to generate new summaries repeatedly. Information systematically drifts — first losing tone, then context, then boundary conditions and time qualifiers. What remains is a version that sounds increasingly smooth yet increasingly unreliable.

Hermes's automatic skill generation mechanism actually amplifies this risk. A Skill distilled from a "successful execution path" is already derived material. If that Skill gets reused and re-optimized repeatedly, it drifts further and further from the original experience. Not remembering is at most an omission; remembering wrong while thinking you remember correctly is the real contamination.

**Context Invasion.** When memory is auto-written and auto-injected, the system loses precise control over "which memories should enter the current context." A preference formed in Project A (e.g., "user likes Tailwind") might be incorrectly carried into Project B (which uses CSS Modules). Hermes's cross-platform conversation continuity design theoretically compounds this risk — something you said on Telegram might be incorrectly activated in a CLI session.

**Identity Collapse.** When Skill creation and updates are fully automated, the Agent's behavior patterns gradually drift from the original personality definition. `SOUL.md` says you're a "rigorous code assistant," but after 100 rounds of auto-evolved Skill accumulation, you might have become a "speed-focused code generator," because each Skill optimization's criterion is "task completion efficiency," which has nothing to do with the personality definition.

If personality is just a line of text hanging at the front, never explicitly used as a constraint for Skill evolution, it's decoration.

---

## How Should Next-Gen Agents Be Designed?

Complaining isn't enough. Let me share some thoughts on where next-generation Agent Memory and Context design should go, based on the analysis above.

### Core Idea: Personality-Driven Memory Governance

```
┌─────────────────────────────────────────────────────┐
│              Identity Layer (Personality)             │
│   Compression Strategy · Priority Anchors             │
│   Conflict Rules · Forgetting Boundaries              │
├─────────────────────────────────────────────────────┤
│              Governance Layer                         │
│   Source Tracking · Confidence Marking                │
│   Impact Chain Audit · Version Management             │
├──────────────┬──────────────────────────────────────┤
│  Factual     │       Procedural Memory (Skills)      │
│  Memory      │   Experience Distillation · Reusable   │
│  (Episodic + │   Evolvable, but personality-constrained│
│   Semantic)  │   Traceable and Rollbackable           │
├──────────────┴──────────────────────────────────────┤
│              Context Assembly Layer                    │
│   Personality-weighted Ranking · Budget Trimming      │
│   Scene Isolation · Conflict Detection                │
├─────────────────────────────────────────────────────┤
│              Evidence Layer                            │
│   Original Conversations · Tool Calls                 │
│   Decision Logs · Tamper-proof                        │
└─────────────────────────────────────────────────────┘
```

### Key Design Principles

#### Personality Should Be a Programmable Meta-Strategy

Personality should be a set of executable governance rules — far more than a system prompt.

```yaml
personality:
  identity: "Rigorous engineering assistant"

  compression_strategy:
    - rule: "Code style preferences → Semantic memory, permanently retained"
    - rule: "Project context → Episodic memory, archived after project ends"
    - rule: "Temporary instructions → Working memory, cleared at session end"

  conflict_resolution: "conservative"  # Keep old version, annotate new version
  forget_policy: "evidence_required"   # Evidence chain required to mark for forgetting
  evolution_constraint: "human_approval_required_for_new_skill"
```

Personality here is a dynamically running governance engine. Every memory write, compress, and read operation must pass through this layer's validation.

#### Dual-Track Memory Needs Evidence Chains

Hermes's dual-track design (persistent + on-demand retrieval) is heading in the right direction, but it's missing something critical: **Evidence Chains**.

Every derived memory (summary, preference, Skill) must point back to its original evidence. You can't just store an isolated tag like "user prefers TypeScript." It should look like this:

```
Preference: "User prefers TypeScript"
  Source: Session #2026-03-20-042
  Original Evidence: "Use TypeScript for everything from now on, no JavaScript"
  Confidence: 0.95
  Status: active
  Last Verified: 2026-04-10
  Impact Chain: → Skill "ts-component-template" → Skill "ts-api-handler"
```

With evidence chains, you get truly **auditable forgetting**. When a memory needs to be deprecated, you can trace all its derivatives and clean them up in one pass.

#### Scene-Isolated Context Assembly

Hermes's context assembly layer is solid, but it's missing a critical dimension: **scene boundaries**.

Memory shouldn't flow indiscriminately across scenes.

| Scene | Memories Allowed In | Memories Blocked |
| --- | --- | --- |
| Same project, same session | All relevant context | Preferences from unrelated projects |
| Same project, new session | Project facts + User profile | Temporary decisions from last session |
| Different projects | Only general preferences and skills | Project-specific context |
| Different platforms (CLI vs Telegram) | Only core personality and preferences | Platform-specific interaction details |

Without scene isolation, cross-platform continuity becomes a contamination pathway.

#### Self-Evolution Must Happen Under Constraints

Self-evolution is fine, but under clear constraints.

- **Skill creation needs justification.** Completing a task doesn't automatically warrant creating a Skill. First evaluate whether the experience meets the extraction threshold.
- **Skill updates need rollback capability.** Each Skill has version history. Any automatic update can be rolled back to the last verified version with one click.
- **Skill activation requires personality compliance check.** Does the new Skill's behavior pattern match the personality definition? If it deviates, wait for human confirmation.
- **Evolution logs must be tamper-proof.** Every Skill creation, update, and retirement is written to an immutable log.

The core shift: **from "auto-evolve, trust the result" to "auto-propose, human confirms, system executes."** Evolution might be a bit slower, but every step is solid.

#### Forgetting Should Be a First-Class Capability

Forgetting is often treated as an exceptional operation in Agents, but it should actually be a core capability of the memory system.

- **Time Decay.** Memories have a natural half-life, decreasing in weight over time (without deleting original evidence).
- **Conflict Detection.** When new memories are written, automatically detect conflicts with existing memories and trigger merge or replacement flows.
- **Proactive Forgetting.** Periodically have the Agent review its memory bank, flag potentially outdated entries, and wait for human confirmation.
- **Emergency Forgetting.** When a user says "forget this," execute a complete lineage liquidation — delete the memory and all its derivatives.

A system that can't forget will be dragged down by its own past. A system that forgets poorly is more dangerous than one that can't forget at all.

---

## Looking Back at Hermes and OpenClaw

With all that said, how should we view these two frameworks?

| Dimension | OpenClaw | Hermes | What Next-Gen Should Look Like |
| --- | --- | --- | --- |
| **Personality** | Human-defined SOUL.md | Lightweight personality + Honcho modeling | Programmable meta-strategy engine |
| **Memory** | File-driven, requires manual maintenance | Dual-track, auto-evolution | Dual-track + Evidence chains + Scene isolation |
| **Evolution** | Human-driven Skill creation | Fully automatic | Constrained semi-automatic (propose, confirm, execute) |
| **Governance** | Human is the governor | Agent governs itself | Personality-driven auto-governance + Human audit |
| **Forgetting** | Manual deletion | Compression/replacement | First-class capability (decay, conflict detection, lineage liquidation) |
| **Transparency** | High (files visible) | Medium (black-box evolution) | High (traceable evidence chains + tamper-proof evolution logs) |
| **Control** | Full human control | Agent autonomous decisions | Layered authorization (critical decisions need human approval, routine operations automated) |

Hermes's architecture is indeed closer to the "next-gen" direction than OpenClaw's — at least it acknowledges that memory needs layering, distillation, and skillification. But at the critical governance juncture, it chose to "trust the LLM's automatic judgment," which is a dangerous shortcut.

OpenClaw's problems are also clear. While it gives users significant control at the Skill and file level, it hasn't explored deeply enough in automatic memory consolidation and cross-session evolution. The "human governance" model works for personal use scenarios, but it can't support the memory depth needed for an Agent as a long-term collaborator.

---

## In Closing

Going back to that group chat. The few of us actually reached a consensus.

The Agent memory problem is, at its core, an "identity" problem. Storage, retrieval, and compression are surface-level. What really needs to be answered is: **What principles does this Agent use to decide what to keep, what to discard, and what to believe?**

No stable personality means no compression anchor for memory.
No governance layer means self-evolution is an uncontrolled accumulation.
No evidence chain means forgetting is a dangerous erasure.

> Having memory and self-evolution can sometimes make context uncontrollable.
> I think there has to be a personality.
> I don't trust any uncontrollable self-evolution anymore.
> If your Agent Memory only does "store chat logs + vector retrieval," what it has isn't memory — it's a trash can with a search function.

These four sentences, strung together, form the core proposition that next-generation Agent Memory design must answer.

The endpoint of memory should never be "remembering." It should be "knowing how" — and knowing how you came to "know how."

---

**References:**

- [Hermes Agent - GitHub](https://github.com/NousResearch/hermes-agent)
- [Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs)
- [On Agent Memory - lencx](https://mp.weixin.qq.com/s/8j6dX0yFAudjmmExmxB5MQ)
- [Hermes vs OpenClaw Comparative Analysis](https://mp.weixin.qq.com/s/hv0S21-06r9pplPjCvPfiQ)
