---
title: Doc Testing
description: Test the spec before writing code — use AI to walk through user stories against the spec, finding gaps at token cost instead of coding cost.
order: 2
playbook_chapter: 02c-doc-testing
related_articles:
  - ai-native-engineering-playbook
---

## What is Doc Testing?

**Doc testing** means using AI to "walk through" your specification document before writing any code. The AI plays the role of a user, stepping through the user stories described in the doc to see if they hold up. Where they don't — that's a gap in the doc, and a future bug in the code.

This technique was popularized by **胥克谦 (Xu Keqian)** in the community. The core insight: **finding problems at token cost is far cheaper than finding them at coding cost**.

## Community Voices

> "Xu's doc testing — once you try it, you never go back."
> — **崔富泽 (Cui Fuze)**

> "Doc testing catches UX-level gaps that you simply can't find by writing code."
> — **崔富泽 (Cui Fuze)**

> "It really does catch interaction-level logic flaws."
> — **详志 (Xiangzhi)**

> "Doc testing is essentially a pre-flight for UAT — moving acceptance testing forward to the documentation stage."
> — **胥克谦 (Xu Keqian)**

## How To Do It

1. **Write a self-contained doc** (see [Self-Contained Docs](/en/discussions/self-contained-doc))
2. **Have AI play the user**, walking through the flows described in the doc
3. **Log the breakdowns** — missing fields, contradictory logic, uncovered edge cases
4. **Patch the doc**, then walk through again
5. Once the doc passes testing, start coding

## Why It Matters

Changing a line in a document costs almost nothing. Changing a line of already-written code can cascade through tests, deployments, and regressions. Doc testing shifts problem discovery as far left as possible — it's the "shift left" philosophy put into concrete practice in the AI era.
