---
title: "How Do You Actually Manage Changes in the AI Era? (Opening the Discussion)"
description: Traditional change management relies on friction to control change frequency. AI eliminated that friction. Change management has shifted from a human process problem to a context engineering problem. Sharing our practice and unsolved challenges in structured anchoring within an SDD system.
author: li-xuetao
date: 2026-04-08
tags: [ai-coding, spec-coding, change-management]
---

Halfway through a feature, the product person says "we need to tweak the parameters on this API." Just one sentence.

In a traditional project, the textbook has a standard procedure: submit a change request, CCB review, impact analysis, update documentation, notify stakeholders. Tedious, but clear. Everyone knows where the change came from, who it affects, and what its current status is.

In reality, very few companies actually run this full procedure. Most fall somewhere between two extremes. The slightly more disciplined ones maintain a change log, list what was modified, then get to work. The less disciplined ones just start coding, updating docs or not depending on mood. The end result is always the same: documentation drifts further and further from the code, and downstream artifact consistency is held together by people's memory. The less disciplined the process, the faster things fall out of sync.

And that's before the AI era. Pure human collaboration already looks like this.

## AI Doesn't Read Change Logs

The core tools of traditional change management are CCB, change logs, and version baselines. These tools work because humans can do cross-module associative reasoning in their heads. No matter how messy the change log is, a person reads through it once and pieces things together: A changed, B is affected, C needs to sync up. People can even bypass the change log entirely, filling in missing information from their overall understanding of the project.

Large language models can't do that.

Current LLMs have limited attention windows. They can't "see" all affected modules at once. Change information is scattered across different documents and different conversations. As the AI reads along, it forgets what came before, let alone performing cross-document associative reasoning.

So in the AI era, change management shifted from a "human process problem" to a "context engineering problem." You don't just record changes, you have to organize change information into structures that AI can directly consume.

## Two Paths, Both With Costs

In our own SDD (Spec-Driven Development) system, every feature is an independent directory with its own requirements document, interface design, test cases, and development plan. There's no industry-standard SDD framework right now, everyone is figuring it out as they go. Ours was shaped by our own bumps and bruises. When a change happens, you face a basic choice: where does this change go?

I've tried two approaches.

The first: every change becomes a new feature. The benefit is clean isolation, the change and the original feature don't interfere with each other. The cost is serious fragmentation. One module gets changed three times, and you end up with three extra features. Tracing which change is based on which baseline gets confusing fast, especially months later when you look back at a pile of features scattered around with no clear lineage.

The second: attach the change as a sub-item under the original feature. The benefit is clear ownership, all changes to module A live under A. The cost is deep nesting. Multiple changes to the same module stack several layers deep, and the directory structure gets ugly. Cross-module changes are especially awkward: an authentication scheme adjustment affects three modules, so which feature does the change document go under?

Both paths work. Neither feels good.

## Our Current Approach: Structured Anchoring

What we do now is use a "change request" skill to manage things. Every time a change occurs, the skill scans the existing feature list and asks the user to confirm the baseline and impact scope.

The core mechanism comes down to two fields: `base_on` and `change_group`.

`base_on` points a change feature back to its original feature, creating a traceability chain. If B is a changed version of A, then B's `base_on` is A. Following this chain, the AI can trace from the changed version back to the original requirements and understand the full context of the change.

`change_group` solves the cross-module problem. Say an authentication scheme adjustment affects user authentication, profile center, and approval management. Each module creates its own change feature, but they all share the same `change_group` ID. In the project-level view, these three otherwise unrelated features are bundled together, showing they belong to the same change.

The pm (project management) skill automatically aggregates all features into a tree structure based on `base_on` relationships, with `change_group` annotated at the end of each line. Run `pm status` and you get a full picture of all changes in the current project at a glance.

## Traceability Is Solved, Consistency Is Not

This mechanism solves two problems: "can changes be traced?" and "can AI find the right context?" As an initial approach, the direction is right.

But it only manages the requirements layer. Each feature's directory also contains interface design, database models, test cases, and development plans. When a change happens, the new feature gets its own full set of artifacts. What about the original feature? What happens to those artifacts?

Here's an example. Feature A defines an API, and test cases are written against it. Later the requirements change, a new change feature B is created, and the API parameters are modified. B's test cases are written against the new API, they pass fine. But A's test cases are still written against the old API. The system is now running on the new API, so A's test cases will definitely fail.

So what should happen to A's test cases? If you update them to match the new API, they no longer serve as a record of A's original design. If you don't update them, they sit there in a "outdated but unmarked" state, becoming noise.

It's not just test cases. Interface docs, database models, development plans, all downstream artifacts face the same problem.

What's more interesting is that sometimes this "inconsistency" is actually correct. A's test cases reflect A's original design intent, and they should differ from the current system because the system has moved forward. But you can't clearly tell whether it's a "reasonable historical record" or something that "got missed and wasn't updated." Nobody can tell the difference. AI can't either.

## Humans and AI Want Different Things

Think deeper and you'll find an unavoidable contradiction here.

Humans need complete information with historical context. They want to know what an API originally looked like, who changed it, how many times it was changed, and why. Human reading habits are linear, they can jump back and forth, and they can construct a timeline in their heads.

AI needs lean, currently-valid context. It doesn't care about historical versions. It cares about what state the system is in right now, which interfaces the line of code it's about to modify depends on, and what the current definitions of those interfaces are. Its attention window is limited. Every historical document loaded means less understanding capacity for the current task.

Directory structures want to be clean, but change-driven multi-version artifacts are inherently messy. Process management wants to be simple, but the cascading effects of changes inherently require lots of manual intervention to calibrate. The current approach tries to satisfy both parties at once, but their needs actually conflict.

## Nowhere Near the Finish Line

This isn't solved.

`base_on` plus `change_group` solved the traceability sub-problem, but it poked a bigger hole: can humans and AI actually share one document system? Baseline anchoring and impact scope management found a workable approach, but whether the original interface docs should be updated after a change, which version the test cases should run against, and which status the project overview should display, none of that is clear to us yet.

I haven't found a standard answer in the industry either.

What I'm sure of is the direction: change management in the AI era must become part of context management, and structured anchoring mechanisms are necessary. But how humans and AI can each get what they need from the same system without getting in each other's way, that still needs more exploration.

Looking back, change management was a big headache in the traditional era. It's still a big headache in the AI era. Just wearing a different face.
