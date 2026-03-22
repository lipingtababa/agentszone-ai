---
title: "Learning from PingCAP: Building Your Company's AI-Native Software Team"
description: A response to PingCAP CTO Edward Huang's "Vibe Engineering 2026.1." Huang rewrote TiDB's PostgreSQL compatibility layer with AI, achieving near-production quality code. But he spends 90% of his time evaluating AI output. How do ordinary teams replicate this?
author: magong
date: 2026-01-26
tags: [methodology, team-structure]
original_url: https://mp.weixin.qq.com/s/Rya4a-nQqFVL5VFPZ1cotQ
---

This article is a response to the recent piece by Edward Huang (PingCAP CTO), "Vibe Engineering 2026.1." If you haven't read it yet, I strongly recommend you do.

Huang's core thesis: top-tier models paired with mainstream tools can already surpass most senior engineers. He rewrote TiDB's PostgreSQL compatibility layer with AI, achieving code quality that "is already close to production level." But the human bottleneck is in review — he spends 90% of his time evaluating AI's output, not writing code.

His view on the future shape of software companies:

> This way of working is more like a lead wolf leading a pack of wolves (Agents), cultivating a territory of their own. But the same territory can barely contain two lead wolves — it creates 1+1 < 2.

But PingCAP is one of China's finest infrastructure software companies, and Huang is one of China's best programmers. How generalizable is PingCAP's practice? If you and I directly copy his approach, is that learning from the best — or is it awkward mimicry? This article will try to answer that question.

---

## The Lead Wolf Is an Elite Path

Huang's "lead wolf + pack" model is a super-individual inside a company — one top-tier engineer responsible end-to-end for a product.

Qiniu Cloud is trying a similar approach, calling it **Product Architect**: one person responsible for the full cycle of PRD, architecture, implementation, and testing. CEO Xu Shiwei's evaluation standard is direct:

> If you can't do end-to-end ownership within a given timeframe, you're out — someone who can will take over.

But a Product Architect needs the combined capability of a traditional product manager, architect, lead developer, and test team lead. People approaching this profile are extraordinarily rare. I run a world-class AI coding community — AgentsZone. Even there, maybe three people would dare claim they meet this bar.

And even if you find one, how do you know they won't start their own company next month? The three I mentioned above are all founding CEOs of their own companies — not one works for someone else.

So the fatal problem with this elite path: **it depends on a talent market that is nearly inaccessible.**

---

## Breaking the Super-Individual into a Product End-to-End Trio (Product Tri-Ownership Framework)

Outside software engineering, the construction industry solved a similar problem long ago. They don't rely on super-individuals — they guarantee quality through role division. The architect defines the space; the structural engineer designs the structure; the supervisor independently inspects; the contractor executes. Four roles, four specializations, complementing each other.

My friends and I drew on this model to create the **Product Tri-Ownership (PTO) framework**.

The PTO framework breaks apart the super-individual's work:

**Product Architect / Lead Wolf / Super-Individual** (one person doing everything end-to-end) splits into ↓

| Product Owner | Quality Owner | Tech Owner |
|---|---|---|
| owns *what to build* | owns *what is correct* | owns *how to build it* |
| ≈ Architect | ≈ Supervisor | ≈ Structural Engineer |

Sharp readers will ask: where did the contractor go?

The answer is direct: the contractor is the AI Agent. They write code, run tests, and generate documentation as instructed — just as contractors build walls following blueprints. They don't deserve a byline.

### Product Owner (PO): Responsible for What to Build

The Product Owner is an expanded role, merging traditional PM and PO responsibilities: defining product vision and business value, daring to say No; managing user stories, acceptance criteria, and priorities; planning version cadence, iteration plans, and milestones; responsible for upward reporting, cross-team coordination, and client communication.

The PO is **accountable for outcomes**, not for output itself. The PO isn't a secretary writing requirements documents — they're the person deciding "what's worth doing." Not just defining "what to build" but having the courage to say "what not to build." Without a qualified PO at the first layer of quality control, the entire quality chain breaks.

---

### Tech Owner (TO): Responsible for How to Build It

The Tech Owner is responsible for technical implementation — leading a group of AI Agents with different roles to produce correct software. They handle detailed design, code review reports (not the code itself), and tool selection. But the most important responsibility is **orchestrating the workflows of multiple Agents**.

Huang observed:

> When a single module exceeds roughly 50,000 lines of code in complexity, current Coding Agents start struggling to solve the problem in a single shot. Agents don't proactively manage project structure or module boundaries.

Here's a workflow my team's TO designed:

**Standard Development Flow**
- `/story` → generate detailed design from user story
- `tester` → TDD red phase (write failing tests)
- `coder` → TDD green phase (make tests pass)
- `/qc` → quality check and code submission
- `deployer` → monitor CI/CD, ensure staging and production are healthy

Different task types need different workflows. A bug-fix flow differs from a new-feature flow; greenfield projects differ from brownfield ones. The TO builds, observes, and optimizes appropriate workflows for different tasks.

Beyond that, the TO handles any exceptions in the process. In one of our integration projects, for instance, the partner didn't provide an API — the TO had to piece together an openapi.yaml by any means necessary.

---

### Quality Owner (QO): Responsible for Whether It's Correct

The Quality Owner is responsible for delivery quality — unlike civil engineering supervisors, the QO designs quality processes and manages quality across the entire lifecycle.

An independent QO solves several AI coding problems:

#### Offloading TO's Responsibilities

In PingCAP's practice, the CTO:

> spends 90% of his time and energy on evaluation — how to assess AI's output. Before completing a major goal, he always works with AI to build a convenient integration test framework and prepares test infrastructure upfront.

Huang's personal capabilities are strong, so he absorbs 90% of the review work. For most people, this easily becomes a bottleneck.

The Tri-Ownership framework offloads this work by establishing a dedicated QO.

#### Ensuring Quality Through Adversarial Testing

Anyone with AI coding experience knows LLMs are good at cutting corners. If they can't pass a test case after multiple attempts, they may well comment it out to satisfy the user's expectation.

After the Challenger disaster, NASA established an Independent Verification and Validation (IV&V) program. Its core principle: software validation must be performed by an organization independent of both developer and acquirer.

We borrowed this idea to establish an independent QO role. The QO's agents can, to a degree, counter the TO's agents when they try to cheat like this.

#### Full-Lifecycle Quality Control

Unlike traditional testers, the QO participates in every phase of the SDLC and designs a multi-layer test system (unit → integration → end-to-end) embedded into each phase. For instance, when the PO provides a product requirements document, the QO participates in writing the Acceptance Criteria, ensuring requirements are verifiable. In one of my projects, we chose Makefile as the test entry point for a Go project, banned Claude Code from calling `go test` directly, and embedded `make test` into git commit hooks and CI workflows — catching elementary mistakes early. The lead wolf model concentrates all quality pressure at final review (Huang's 90%), which depends heavily on the lead wolf's individual capability. The Tri-Ownership framework lowers the quality bar through a test system that covers the entire lifecycle.

---

## Completing One User Story per Day

In terms of pace, the Tri-Ownership framework should be able to **complete one user story per day**.

How fast is this? Look at Claude Code's release cadence: 10 versions in 10 days, sometimes 2–3 versions in a single day. Teams unable to match this speed are below industry average.

A normal rhythm: in the morning, the PO writes the user story; the QO simultaneously defines acceptance criteria. Before lunch, AI Agents complete the detailed design; the TO reviews and approves, triggering the AI development process. At lunch, AI completes the first version of code and tests. In the afternoon, the TO reviews the code review report, possibly iterating multiple times to improve quality. Before end of day, GitHub Actions automatically triggers end-to-end acceptance; once the QO approves, it merges and goes live.

Why this fast? Because AI Agents absorb the heaviest coding tasks; three people can work in parallel; the QO prepares the test framework in advance rather than setting it up last-minute; automated workflows eliminate human handoff wait times. Note: the AI Agents doing the heaviest work don't need to take a lunch break.

**Small tip: the three Owners must sit together physically.** Problems get discussed immediately — no need to schedule meetings. Daily standups are no longer enough; fast iteration means frequent decisions, and waiting until tomorrow's standup is too late.

If a story takes more than a day, it's too big and needs to be split. AI-era stories should be much smaller than traditional development stories.

### Traditional Practices Become Bottlenecks

Many teams see no speed improvement after introducing AI because traditional processes drag them down:

- **4-eyes code review**: every line of code must be reviewed by two people. When AI can complete a feature in a day, waiting for two people's schedules takes three days. My own CTO complained this mechanism slowed down his own AI-generated code from merging.
- **Change Advisory Board**: every release requires a meeting for approval. AI can deploy ten times a day; CAB meets once a week.
- **Manual deployment**: AI finishes code and then waits for ops to schedule a manual deploy. AI can iterate ten times a day; manual deployment gets scheduled once a week.

---

### Supporting Roles

Beyond Tri-Ownership, some supporting roles are needed:

**Sponsor (Decision-maker)**: Provides resources, resolves conflicts. First, ensures sufficient token budget and appropriate hardware — in AI-native development, the bottleneck is often token cost, not personnel cost. Second, when the three Owners disagree, the Sponsor has final authority.

**Architect**: Defines system architecture, module boundaries, interface contracts, coding standards, and technology stack (language, framework, database, etc.). Huang noted that Agents struggle above 50,000 lines per module; Architects pre-split to keep each module within AI-manageable size. In my team, we use a mono repo; every application inherits the Architect-selected Gin, Gorm, Observability stack. In small projects, this role can be handled by the TO.

**Platform Engineer**: Responsible for production operations, monitoring and alerting, security and compliance, cost optimization. Depending on skill, also helps the QO build and optimize CI/CD pipelines.

**Specialty Expert**: Consulted as needed, not involved in daily development. For example, when my friend Nick was developing an internet-facing consumer service, he needed a UI/UX designer. The designer doesn't know code but can collaborate with AI agents like Lovable to produce a UI Kit and hand it to the TO. Security experts, DBAs, and similar roles follow the same pattern: engage when needed, no need for full-time staff.

---

## An Alternative: The Training Model

Not every company can restructure team composition. My friend Yang Gong used a gentler alternative: the **training model**. Without changing organizational structure, he customizes skills, agents, and workflows himself, then has the implementation team follow the process — using cheaper models to lower the cost threshold.

The advantage: low barrier, no organizational restructuring needed, implementable by a team lead. The disadvantage is also clear: this model only covers a small part of the development process, and the value it generates is capped at a not-very-high ceiling.

---

## The Next Core Problem in AI Coding

Individual pair-programming with AI is already mature practice. The proliferation of tools like Claude Code and Cursor proves this. But how should teams collaborate with AI Agents?

The next core problem in AI coding: after AI agents dramatically reduce implementation costs, how do we systematically build human-AI collaborative teams, ensure delivery quality sustainably, and convert productivity gains into market competitive advantage?

Huang's lead wolf exploration proves the viability of AI-native development. But lead wolves are too scarce.

The value of Product Tri-Ownership: it provides a replicable framework, breaking "the impossible super-individual" into "three cultivatable specialized roles" — enabling ordinary teams to achieve AI-native development.

---

What structure does your company's AI-native team use? What problems have you encountered? Leave a comment. Feel free to reach out directly on the WeChat public account if you'd like to discuss further.

---

**References**
1. Edward Huang, "Vibe Engineering 2026.1": https://mp.weixin.qq.com/s/YQ-GuDfqDW0yhtghjKK8Rg
2. The Rise of the Super Individual: https://medium.com/@yangxu_16238/the-rise-of-the-super-individual-how-ai-is-replacing-teams-and-redefining-work-88dacad036b8
3. Company of One: https://www.goodreads.com/book/show/37570605-company-of-one
4. Claude Code GitHub: https://github.com/anthropics/claude-code
5. NASA IV&V Program: https://www.nasa.gov/ivv-overview/
