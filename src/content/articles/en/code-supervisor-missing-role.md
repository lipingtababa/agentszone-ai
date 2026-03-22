---
title: "The Missing Role in Software Engineering: Why We Need a Code Supervisor"
description: Lovable, valued at billions, had user debt amounts, home addresses, and API keys extracted in 47 minutes. Software has product managers, architects, developers, testers, and ops — but lacks one role that civil engineering calls a "supervisor."
author: magong
date: 2026-02-08
tags: [quality-control, team-structure]
original_url: https://mp.weixin.qq.com/s/sWONCv2gAzjq3HZLUhY50A
---

Lovable is valued at billions of dollars — called "Europe's fastest-growing company." A security researcher spent 47 minutes extracting users' debt amounts, home addresses, and API keys from one of its applications.

If 10% of a building's rooms could collapse at any moment, no one would call it a success. But software can.

Software engineering has product managers, architects, developers, testers, and operations. Seems like everything's covered. But there's one role that civil engineering has and software engineering doesn't — an independent person with veto power who inspects against specifications.

Civil engineering calls it a "supervisor" (监理).

This is a perspective I discussed with Li Xuetao in an online conversation.

## What Is a Supervisor?

A supervisor is a third party, independent from both the design team and the construction team. They don't belong to any execution team — they inspect each process step against specifications. Without their sign-off, the next phase cannot begin.

Li described a case: a foundation pit was designed 8 meters deep; the construction crew dug 0.5 meters short. The supervisor measured it with a ruler and refused to approve it. They dug the remaining 0.5 meters before being cleared.

Why can a supervisor hold that line? Because their signature carries legal liability. Missing 5% might be paperable-over; missing 50% and you're signing yourself into prison.

The civil engineering industry has over 1,100 ISO standards — even safety helmet colors have national specifications. Supervisors inspect against documented standards.

## Why Doesn't Software Have Supervisors?

On the surface, software has similar roles: QA, Code Review, security audits. But compare them and you'll see they're fundamentally different.

QA is part of the same project team, interests tied to development. When the project is rushing toward a deadline and QA says "it must be fixed before we can launch" — they get pressured into letting it through.

Code Review is advisory, not a process-enforced veto.

Security audits are usually spot checks after the fact, not verification at every process step.

The more fundamental problem: software has no legal accountability.

This is the classic principal-agent problem: when executors and decision-makers have misaligned interests, quality cannot be guaranteed without independent oversight. Civil engineering solved this with supervisors. Software hasn't.

In November 2023, DiDi's K8s upgrade went wrong and the system was down for 10 hours. A platform with 31.3 million daily orders completely paralyzed — over 400 million yuan in lost transactions. Legal consequences? Zero.

When a construction site scaffold collapses, the supervisor, contractor, and design firm can all be held accountable. When software goes down? A few days of public criticism and it passes.

## The Cost of No Supervisor

Veracode's 2025 report shows 45% of AI-generated code contains security vulnerabilities. The failure rate for Java code is as high as 72%.

Of Lovable's 1,645 applications, 170 allowed anyone to access user private data. Its built-in security scanning only catches 66% of issues.

The software industry? A few years ago companies were still storing passwords in plaintext — and nobody cared.

## The Opportunity in the AI Era

There was a practical reason stricter verification wasn't done before: it was too expensive. Reviewing every process step kills timelines. Setting up an independent inspection team crushes personnel costs. And human QA can be fooled — someone who doesn't understand the technology can only do formal checks, and someone who does tends to side with developers.

AI changed this equation.

Li said something that stuck with me: "AI's compliance is stronger than humans'. Have AI execute a task multiple times, have five AIs review each other — the thoroughness is very high."

The cost of following a specification is nearly zero; running a few more rounds is just spending a few more tokens. AI doesn't cave when the boss pushes for a release.

Specifications are also making a comeback — GitHub open-sourced Spec Kit, pushing "spec-first then code." This is essentially the software equivalent of civil engineering's "blueprints + legend."

## What Should a Code Supervisor Look Like?

Borrowing from civil engineering, a few elements are non-negotiable.

First, it must be **independent**. It cannot belong to the development team. It cannot be held hostage to project timelines. It can be an independent Agent, a service — but it cannot be "one of us."

Second, it must have **veto power**. Not "I suggest you fix this," but "it doesn't pass and cannot be merged or deployed." Process-enforced, not self-disciplined.

Third, it must **inspect against specifications**. A code supervisor doesn't need to understand the business logic — just check items off against the spec. A civil supervisor doesn't need to know how to lay bricks; knowing how to read a ruler is enough.

Fourth, it must be **traceable**. Every inspection is recorded; problems can be traced back.

The pieces already exist in fragments: pre-commit hooks, CI checks, security scanning. But they're all optional, without veto power. A real code supervisor would integrate all of this into hard constraints.

## Conclusion

Software engineering is missing one role: an independent inspector with veto power. Civil engineering has one — called a supervisor. Software doesn't, so quality depends on luck.

AI makes this role financially viable. What was once too expensive to do, now can be done.

But open questions remain: what should software "specifications" look like? Who defines them? Without legal accountability, how can veto power actually be effective?

In your team — who plays the supervisor's role? Or does it simply not exist?

## References

1. Veracode 2025 GenAI Code Security Report
2. Engprax: 268% Higher Failure Rates for Agile Software Projects
3. Semafor: Lovable security vulnerabilities
4. AgentsZone Episode 13: Learning from Civil Engineering (Li Gong / Xuetao)

---

![image-1](/images/articles/code-supervisor-missing-role/1.jpg)
