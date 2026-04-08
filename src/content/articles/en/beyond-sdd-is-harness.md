---
title: "Is Harness What Comes After SDD?"
description: "From prompt engineering to Harness Engineering, AI programming has been doing one thing: humans move further from code while gaining stronger control. OpenAI's 3 engineers guiding Codex to 1M lines of code reveals Harness's decisive role in AI programming reliability."
author: li-xuetao
date: 2026-04-08
tags: [ai-coding, harness, sdd, agent]
---

I keep seeing the word Harness everywhere lately, with people passionately discussing it and even giving it a Chinese name. So I wrote this explainer based on my understanding, tracing how we got here step by step in the AI era, and what we're going to face in the next phase.

From prompt engineering to Harness Engineering, AI programming has been doing one thing all along: humans move further from code while gaining stronger control over output. Prompt engineering controls a sentence. Harness controls an entire execution environment. But as long as this environment still needs humans to build, it's not the final destination yet.

## Three People, Zero Lines of Hand-Written Code, One Million Lines

In February 2026, OpenAI engineer Ryan Lopopolo published a blog post titled Harness Engineering: Leveraging Codex in an Agent-First World. The content was straightforward: 3 engineers, 5 months, they had Codex generate roughly 1 million lines of code. The product already has internal DAU and external beta users, with zero lines of hand-written code. On average, each engineer merged 3.5 PRs per day, and as the team grew from 3 to 7 people, throughput kept rising.

This post sparked massive discussion in the community. But most people fixated on the "1 million lines" number and missed the more important question: what exactly were these 3 engineers doing?

They don't write code. They design environments, specify intent, and build feedback loops. In OpenAI's own words: Humans steer. Agents execute.

That's Harness Engineering. OpenAI has an internal judgment: model changes account for 10% to 15% of output quality impact, while Harness design determines 80% of agent reliability. Most problems attributed to "the model isn't good enough" are actually Harness that hasn't been set up properly.

## Four Stages

**1. Prompt Engineering: Making AI understand what you say**

People discovered that different prompts and different role settings had a huge impact on output, so they started researching how to write better prompts. The core finding: the AI's capability was always there, the key is how you elicit it. But they hit a ceiling fast. No matter how much you optimize a prompt, you can only control a single input-output cycle. When tasks get complex, one prompt can't hold up.

**2. Context Engineering: Controlling the information flow**

Inputs and outputs kept getting longer. How to manage the context window, how to provide effective information, how to trim and segment — this became its own discipline. Yage discussed this topic before: what determines output quality isn't model intelligence, but the density of context you inject. Context engineering is far from outdated today. It's the foundation everything else builds on.

**3. Vibe Coding: Letting AI do the work itself**

AI can now write code and operate files on its own. Tools like Claude Code, Codex CLI, and Cursor turned "AI writing code" from concept into daily practice. But problems followed: unstable code quality from AI, hard to debug, difficult to notice when things go off track. Vibe Coding solved the question "can it write code?" but not "is the code correct?"

**4. SDD: Constraining output with a specification system**

SDD (Spec-Driven Development) puts a structured document system at the center of development. This system doesn't just contain requirements specs — it extends downward into architecture design, interface definitions, and development plans.

Each layer of documentation constrains how detailed the next layer can be: requirements specs define business goals and acceptance criteria, design documents build on that to define architecture and tech choices, development plans break the design into executable tasks. The point isn't to nail down every detail upfront, but to unfold and converge layer by layer. Every line of code the AI writes must be traceable back along this document chain. Code that doesn't conform to the spec is wrong. This fills the reliability gap that Vibe Coding left behind.

But SDD's constraints happen before coding, transmitted through the document chain. No matter how thorough your spec system is, once the AI actually starts writing code and drifts off track, once the context gets polluted, once tool calls fail, you might not even know. SDD defines "what counts as correct" but lacks a runtime mechanism to continuously verify "is it actually being done correctly." That gap needs something else to fill it.

## What Harness Actually Looks Like

Abstract concepts are easy to talk about in a vacuum. Let's look at what OpenAI's Harness actually does.

**Context management: give a map, not an encyclopedia**

OpenAI first tried the "one big AGENTS.md" approach. It failed. A giant instruction file crowds out space for tasks and code. Too much guidance equals no guidance at all, and it rots fast. They later shrunk AGENTS.md to about 100 lines, treating it as a table of contents rather than an encyclopedia. The real knowledge lives in a structured docs/ directory: design documents, execution plans, product specs, architecture docs, quality scores.

This is the same logic behind the Skill system we use daily: AGENTS.md is the L1 cache, telling the agent which capability directions exist; the docs/ directory is L2, loading specific documents on demand; the actual spec files and reference manuals are L3, only read when relevant to the current task. Each layer exposes only the information necessary for the decision at hand.

Even more critically, they use linters and CI to mechanically verify the knowledge base's freshness, cross-links, and structural correctness. They regularly run a "doc-gardening" agent that scans for outdated documents and auto-opens PRs to fix them. Knowledge doesn't rot in the repo.

**Observability: letting agents test themselves**

OpenAI did something clever: they launch the application in isolated git worktrees, so every time Codex modifies code, it can spin up a separate instance to verify. They hooked Chrome DevTools Protocol into the agent runtime, giving agents access to DOM snapshots, screenshots, and navigation events. Agents can reproduce bugs and verify fixes on their own. So a constraint like "ensure service startup completes within 800ms" goes from empty talk to an executable check item.

They often see Codex work continuously for over 6 hours in a single run, with engineers asleep the whole time.

**Architectural constraints: boundaries matter more than implementation**

OpenAI split the application into fixed layers (Types → Config → Repo → Service → Runtime → UI), with cross-layer dependency directions strictly enforced. These constraints are mechanically enforced by custom linters, and the linters' error messages are directly injected into agent context as fix instructions. They mandate boundary parsing (parse, don't validate), but don't dictate which library to use.

They also don't require agents to use the general-purpose `p-limit` concurrency control package. Instead, they had the agent implement its own version, because this custom implementation integrates fully with their monitoring system — its behavior is controllable. For agents, "boring" technology is actually better to use: it's composable, has stable APIs, and appears frequently in training data.

**Entropy management: garbage collection for technical debt**

Agents replicate patterns already in the repo, including bad ones. Early on, OpenAI spent 20% of their time each week cleaning up "AI slop." They later changed this by encoding "golden principles" into the repo: prefer shared utility packages over hand-written helper functions; no YOLO-style data probing, validation must happen at the boundary. They run background tasks periodically to scan for deviations and open refactoring PRs. Most of these PRs get automerged in under a minute of review.

Their words: technical debt is like high-interest loans. Making small continuous payments is almost always better than letting it compound and then dealing with it all at once.

## What Happens Without Harness

The most direct evidence comes from LangChain. On Terminal Bench 2.0, they didn't swap models — they only optimized the Harness: system prompts emphasizing self-verification loops, enhanced tool and context injection, middleware hooks to detect infinite loops. The result jumped from 52.8% to 66.5%, ranking from Top 30 to Top 5. Same model, same tasks. Harness alone makes that much difference.

Other teams observed similar phenomena. Anthropic found that when you have the same LLM write code and then check code, it fools itself — it does a surface review after writing and declares "looks good" without running tests. They call this Poor Self-Evaluation Bias, and the fix is forced role separation. Vercel found that giving an agent 15 tools yielded an 80% success rate, but cutting it to 2 tools hit 100%. More tools don't empower — they distract.

## The Relationship Between SDD and Harness

SDD and Harness address the same big problem (AI programming reliability), but their angles are orthogonal.

SDD transmits constraints through the document chain, happening before coding. It defines "what to build" and "by what standards," converging layer by layer from requirements specs to architecture design to development plans. Harness transmits constraints through runtime systems, happening during coding. It verifies whether the agent's actual output at each step deviates from the spec.

A construction analogy: SDD is the blueprints and building codes, Harness is the scaffolding, quality inspection process, and on-site monitoring system. Without blueprints and codes, the construction crew doesn't know what to build. Without scaffolding and quality checks, even the best blueprints won't prevent workers from getting hurt. The two can exist independently: you could write a complete spec system with no Harness protection, and if things drift off course you'd never know. The reverse works too — a precision construction management system with nobody knowing what to build. But existing independently doesn't mean operating in isolation. Truly efficient workflows stack the two together: SDD's document chain provides the verification standards for Harness's validation layer, and Harness checks the agent's actual output against the spec at every step.

If you had to place them on a single evolutionary line: Vibe Coding lets AI write code, SDD lets AI write code to spec, Harness lets AI reliably write code to spec continuously. Each layer solves the reliability gap left by the previous one, but they aren't simple replacements. They're more like complements.

## What Comes After Harness

I think the endgame for AI programming is AI becoming a compiler.

A compiler's core characteristic is determinism: given the same input, the output is always the same. Current LLMs are fundamentally non-deterministic — they're probabilistic predictors. Run the same requirement twice and you get different code, different quality. This is the biggest problem with AI programming today, and the fundamental reason SDD and Harness exist.

What they're really doing, at root, is narrowing the model's uncertainty window.

SDD narrows from the input side: the more precise your spec documents, the smaller the model's output space, and the fuzzy possibilities get squeezed into a predictable range.

Harness narrows from the process side: even with precise input, models accumulate drift across multi-step execution. Verification loops correct drift, role separation prevents self-deception, tool pruning reduces wrong choices.

Feedback loops narrow from the output side: automated tests, linters, and human review verify the final output, and error signals get fed back into specs and Harness, making the next round of execution converge further.

All three layers together use engineering means to simulate compiler determinism. The model itself isn't deterministic enough, so external constraints force it close to deterministic behavior. OpenAI's 80% factor means exactly this: at current model capability levels, external constraints contribute far more to final reliability than the model itself.

Push this logic to the extreme: if the model becomes fully deterministic, do SDD and Harness become useless? Probably not. Compilers are deterministic, but we still need architecture design, code standards, and CI pipelines. The complexity of large systems doesn't disappear just because models become deterministic. Model uncertainty just happens to be the most urgent variable right now.

Until then, what external engineering can do is keep narrowing this uncertainty window.
