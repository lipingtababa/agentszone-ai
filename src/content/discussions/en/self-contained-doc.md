---
title: Self-Contained Docs
description: Specs written for Agents must be self-contained — no implicit knowledge, no "refer to existing implementation." The document IS the complete context.
order: 1
playbook_chapter: 02b-machine-readable-spec
related_articles:
  - ai-native-engineering-playbook
---

## What is a Self-Contained Document?

When we hand tasks to an AI Agent, the Agent has no "team memory" — it doesn't know what was discussed in the last standup or the design intent behind a specific module. **Self-contained documentation** solves this: all necessary context, constraints, and acceptance criteria are packed into a single document so the Agent can work independently without asking follow-up questions.

Core principles:
- **No implicit knowledge** — don't write "refer to existing implementation"; spell out the interfaces and data structures
- **No conversational context** — the document must be understandable on its own
- **Internal segmentation** — each section has clear boundaries so the Agent can process it in parts

## Community Voices

> "The human loop ends, the self-contained doc is ready, then it's full auto."
> — **Violet**

> "The term 'self-contained doc' originated in our community — it's a technique people developed through practice."
> — **胥克谦 (Xu Keqian)**

> "Self-contained docs with internal segmentation — these two things are what make Agents actually work."
> — **leo**

## Why It Matters

Traditional requirements documents assume the reader is human — humans can ask follow-up questions, search Slack history, or check with colleagues. Agents can't. If a document isn't self-contained, the Agent either guesses (causing errors) or stops to ask you (breaking the automation flow).

Self-contained documentation is the infrastructure of AI-native engineering: **document quality directly determines Agent output quality**.
