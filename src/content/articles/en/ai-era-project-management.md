---
title: "What Should Project Management Look Like in the AI Era"
description: AI drove code production costs to the floor, but project management costs actually went up. Traditional PM manages whether you finish on time; AI-era PM manages whether you're building the right thing. These require fundamentally different tools.
author: li-xuetao
date: 2026-04-08
tags: [ai-coding, project-management, team-management]
---

We used AI to write code for two months, and the project ended up delayed. Not because AI was slow. Quite the opposite: it was too fast. So fast that half the code produced in any given week would get thrown out and rewritten the next.

This isn't an isolated case. After leading a team through an AI transformation, I noticed something counterintuitive: AI drove code production costs to the floor, but project management costs went up. Not by a little. By orders of magnitude.

The reason is straightforward. Traditional project management asks "can we finish on time?" AI-era project management asks "are we building the right thing?" These are fundamentally different questions that require fundamentally different tools. But most teams are still using old methods to manage new problems.

## Change Management: The Eternal Problem

Before diving in, I need to state a fact: the core challenge facing project management in the AI era isn't new. Change management has always been one of the hardest parts of project management. Change is a leading cause of project failure. I didn't make this up. It's in the textbooks, backed by decades of industry experience.

How did traditional projects handle change? Through friction.

Traditional change management has nine steps: document the change request in writing, get client sign-off, analyze impact on scope/schedule/budget, communicate the impact and see if the change can be cancelled, get approval signatures, hold a change control meeting, then track status after execution. Every step deliberately increases the friction coefficient of change.

The design is clever: make change difficult, and you objectively reduce how often it happens. In the old days, changing a feature meant talking to developers, getting effort estimates, scheduling it, waiting for someone to be available. A week or two would pass. Communication costs, waiting costs, coordination costs. Those are friction. Most changes died in the face of that friction, because they weren't worth the hassle.

AI wiped out that friction.

Tell AI to make a change, and it's done by the afternoon. No communication cost, no waiting cost, no coordination cost. The lower the cost, the more frequent the changes, and the more severe the directional drift.

This is counterintuitive: AI lowered the cost of changing code, but raised the cost of changing things correctly. Every change risks deviating from the original intent, and that deviation accumulates faster than you'd think. There's a line from minimalist project management that still holds: if you allow changes to happen freely, the pace of change will exceed your imagination.

Our team experienced an extreme case. A backend admin module got changed 15 times in two weeks. Not because requirements were unclear. Because they were too clear. Every day, someone thought of a new optimization. AI made the cost of "just try changing it" essentially zero, so the team fell into an inertia of modification. They'd see something they could change and change it. Nobody stopped to ask "should we actually change this?"

The question comes back to the starting point: the friction is gone, so how do you manage change? The answer isn't to restore friction (that's going backwards). It's to anchor direction in a different way.

But there's another side that's easy to overlook. The disappearance of friction isn't just a risk. It's also an opportunity.

Requirement changes are no longer something to resist. They're a source of competitive advantage. The precondition is that your requirements documents are structured. When business says "approval rules changed: anything over 2 days needs director approval," you open the decision matrix, change one number, and all related flowcharts, state machines, and test cases update automatically. Done in half a day. Your competitor takes 20 days to make the same change. You take 2. Who's the client calling next time? You.

So AI-era change management isn't about "how to block changes." It's about "how to respond to changes quickly without losing direction." These two goals seem contradictory but can coexist: use structured documents to handle response speed, and use scenario scripts to anchor direction.

## From PRDs to Scenario Scripts

I've tried many approaches to control directional drift. The most effective so far has been replacing PRDs with scenario scripts.

What's the difference? A PRD describes "what the system should do." A scenario script describes "how the user uses it."

A concrete example. A traditional PRD would say "support WeChat one-click login." A scenario script would say "Xiaoming opens the app on the subway to check last night's order, authorizes via WeChat, and lands directly on the order list page within 3 seconds." The difference: the PRD gives you a feature point. The scenario script gives you a complete story with context.

Context is the key. AI is great at generating code. It's not great at understanding intent. Give it "support WeChat login" versus "complete login within 3 seconds on the subway" and the code quality will be worlds apart. The former gets you a standard OAuth flow. The latter gets you degradation strategies for unstable networks, loading states, and timeout retries.

Scenario scripts have another value: they're natural anchors for change management. Traditional change management uses process friction to gate changes. Scenario-driven development uses the scenarios themselves to judge changes. When someone proposes a new requirement, you don't need to run a nine-step approval process. You just ask one question: does this change deviate from existing scenarios? If yes, run the change process. If no, it's a natural iteration within the scenario.

But there's a practical lesson here. There's a principle from project management that still works in the AI era: <mark style="background: #FFB86CA6;">never concede without an exchange</mark>. When a client requests a change and you agree, make them concede something in return. Not to be difficult, but to make them realize that change has a cost. Even if the technical cost is nearly zero, there's time cost, testing cost, and directional cost. The clearer the client is about this, the more cautiously they'll propose changes. Another principle worth remembering: warnings beat advice. Tell a client "this change might affect the schedule," and they'll think you're making excuses. Tell them "if this change causes issues after launch, the blast radius is XX," and they'll actually think it through.

But there's a trade-off I need to be clear about. Scenario-driven development keeps direction under control, but the upfront investment increases significantly. Writing a scenario script takes far more time than writing a feature list. It demands that the PO doesn't just think about "what to build," but also thinks through "under what circumstances the user operates, what outcome they expect, and what happens in exceptional cases." That's a whole order of magnitude higher bar for PO capability.

Choosing scenario-driven means giving up the possibility of rapid trial and error. Choosing agile iteration means accepting the risk of directional drift. My judgment is that in an AI development model, the cost of directional drift far exceeds the cost of upfront investment, so this trade-off is worth making. I haven't tracked the exact numbers, but my gut feeling is that scenario-driven upfront prep takes about 2 to 3 times as long as a traditional PRD, while downstream rework drops by roughly 60 to 70 percent.

## Five People, One Project

Building on the thinking in [AI Era New Paradigm: 1+3 Ownership Model and Project Management](https://mp.weixin.qq.com/s/RP19ns9CHAJU9JznupkXHA), what we implemented is a 5-person FDE squad. PM handles overall management, external communication, and release cadence. One frontend and one backend developer, each working with AI. PO is dedicated to requirements analysis and scenario scripts. QO provides full-lifecycle quality assurance. These five don't run a relay. They run in parallel.

PO produces scenarios in the morning, frontend delivers prototypes in the afternoon, QO writes test cases simultaneously. Frontend doesn't wait for PO to finish defining everything. While scenarios are being defined, frontend does technical research, backend confirms the API approach, QO designs test strategy. PM controls the pace throughout but doesn't touch execution. All estimates and delivery commitments go through PM.

But parallel work has a hard prerequisite: communication costs must be low enough. In practice, if five people sit together, this mostly solves itself. If five people sitting together still can't communicate clearly, that's a people problem.

The trade-off here is obvious too. The five people need to be highly in sync. If anyone drops the ball, the whole chain breaks. And early on, frontend and backend are still split by role. They only gradually merge into full-stack TO roles. During that transition, you need AI to lower the cross-domain barrier. Frontend uses AI to write backend APIs. Backend uses AI to write frontend pages. But human understanding of architecture and business logic can't be missing.

## What to Review

In the AI era, the center of Review shifts from auditing outputs to auditing inputs.

What's an output? Code. Human code review is mostly unnecessary now. Variable naming conventions? AI is more consistent than humans. Code structure clarity? AI is cleaner than humans. Comment completeness? AI is more thorough than humans. For the areas where AI is prone to errors, like exception handling and concurrency races, a few rounds of automated testing covers most of it.

What's actually worth spending human time reviewing is what you feed into AI: scenario scripts, context descriptions, technical constraints.

Why? Because the quality of AI-generated code depends almost entirely on the quality of input documents. If your scenario script is ambiguous, AI generates ambiguous code. If you forgot to write "what happens when the network is unstable," AI won't consider a degradation strategy. If your requirement context is incomplete, AI will fill in the gaps on its own, and the direction it fills will probably not be what you wanted.

In other words, the nature of Review has fundamentally changed. You used to review whether "the code was written correctly." Now you review whether "the document was written clearly." One checks output. The other calibrates input. The ROI is completely different. Spend 30 minutes reviewing a scenario script, and you might save 3 days of rework caused by misunderstandings. Spend 30 minutes reviewing AI-generated code, and you might only catch a naming style issue.

What we actually do is split Review into two layers.

**Layer one: scenario script review.** The PO produces a scenario script, and frontend, backend, and QO each read it once. Frontend checks for missing page transitions in the interaction flow. Backend checks for missing APIs in the data flow. QO checks for uncovered exception paths. Three people looking at the same document from three different angles is far more effective than one person reading it three times. Issues get fixed on the spot. Only then does the script go to AI for code generation.

**Layer two: AI context review.** Before handing any task to AI, spend two minutes checking the context description you're about to send. Is the scenario described clearly? Are the technical constraints stated? Are existing APIs referenced? Are the output requirements explicit? These two minutes feel redundant, but skip them and you might spend 20 minutes fixing what AI got wrong.

The core principle is simple: move Review upstream, before AI starts working. Reviewing code is hindsight. Reviewing documents is foresight. The former treats symptoms. The latter addresses root causes.

## Prototypes Are the Biggest Trap

AI makes prototype generation absurdly fast. A requirement in the morning, an interactive prototype by the afternoon. And that's exactly the biggest trap.

When clients see a prototype, their first reaction is "looks about done." In reality, maybe 20 percent of the work is complete.

We fell into this trap. Once we demoed an AI-generated prototype to a client. They were very impressed and demanded delivery within two weeks. The team knew that between prototype and product lay a massive amount of work: exception handling, performance optimization, data validation, compatibility testing. But the client didn't understand that gap.

We later established a hard rule: prototypes and product code are managed separately. Prototypes live in their own branch. When demoing, you must clearly state: "This is a prototype, for scenario validation. It's still X time away from being production-ready." That "X time" must be a specific number. You can't say "it needs some more time."

The rule sounds simple. Executing it takes real discipline. When you spend an afternoon producing a prototype that looks polished, there's a strong temptation to just refine it into a deliverable. That temptation is fatal. Prototype code and product code operate under completely different quality standards. A prototype aims to "look like it works." A product aims to "work correctly under all kinds of abnormal conditions." Trying to turn a prototype into a product produces something that satisfies neither standard.

## Where to Start

If your team is already going all-in on AI development or about to, I'd suggest starting with four things.

First, rewrite the PRD for your most important project as 3 to 5 core scenario scripts. Don't rewrite everything. Just the critical ones. See for yourself what the difference feels like in practice.

Second, establish a daily scenario alignment meeting. 15 minutes every morning, fixed time, fixed format. The key rule: "discuss scenarios only, no technical talk." The value of these 15 minutes isn't solving problems. It's exposing them.

Third, standardize your team's AI tooling. This seems minor but has outsized impact. Different AI tools produce wildly different code styles. If five people use five different tools, review costs will spike to unacceptable levels. Pick one primary tool for the whole team. That's the only way to unify code style.

Fourth, redesign your change management process. The traditional nine-step friction has been shattered by AI. You need a new anchoring mechanism. Scenario scripts are the anchor, but an anchor alone isn't enough. You also need a lightweight change assessment method. For every change, ask three questions: does it deviate from existing scenarios? Does it affect existing code? Does it affect tests? Replace the nine-step process with these three questions. Fast but not out of control. At the same time, establish deterministic testing as a safety net. After every change, automatically run the core scenario test suite. If tests pass, nothing's broken. If tests fail, the change has a problem and needs to be rolled back. Without this mechanism, no matter how fast you change things, you're flying blind.

AI-era project management isn't "using AI to manage projects." It's rethinking what project management is actually managing in the AI era. The core shifted from "can we finish" to "are we building the right thing." The method shifted from "controlling process" to "controlling direction."

One thing hasn't changed: change management is still the hardest part. AI just altered its dynamics, from "change has friction so it's controllable" to "change has no friction so you must actively anchor direction." Understand this, and everything else is execution.

But here's the good news: once you understand this, you gain a weapon that traditional teams don't have. The ability to respond to changes quickly is itself a competitive advantage. It used to take two weeks to change a requirement. Now it takes two days. That gap can't be closed through process optimization. It's a structural advantage of the AI era. The precondition is that you have structured requirements documents, scenario scripts as anchors, and deterministic testing as a safety net. Missing any one of these, rapid response becomes rapid disaster.

## In Closing

Remember one thing: AI made code cheaper. But judgment is more expensive than ever.
