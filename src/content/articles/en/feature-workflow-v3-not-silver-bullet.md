---
title: "Feature Workflow v3: From Templates to Tailored Design — AI Workflows Are No Silver Bullet"
description: "Feature Workflow v3 upgrades to a Command + Agent + Skill three-layer architecture. The core insight: template-based workflows are not silver bullets — every project needs purpose-built Skill design."
author: yang-zhengwu
date: 2026-04-02
tags: [ai-agent, skill-design, workflow, ailock-step, customization]
original_url: https://imcoders.cn/blog/feature-workflow-v3/
---

## Introduction

In a previous article, I introduced Feature Workflow — a multi-feature parallel development paradigm based on Git Worktree. After several real-world projects, the workflow evolved from v1 to v3. This update isn't just a technical refactoring — it's a rethinking of AI workflow design philosophy.

One core point needs to be stated upfront: **Template-based workflows are no silver bullet. Every project needs Skill design tailored to its own characteristics.**

## The v3 Architecture Evolution

### From v1 to v3

| Version | Architecture | Core Problem |
| -- | -- | -- |
| v1 | Pure Skill chain calls | Main session blocked, dev details pollute context |
| v2 | Shell scripts + `claude --print` | Black-box processes, no real-time intervention, crude communication |
| v3 | Command + Agent + Skill three-layer architecture | Native integration, context isolation, full lifecycle automation |

In the v1 era, all operations ran in the main session. The AI's development context mixed with the user's conversation context, quickly bloating the session. v2 tried to isolate via Shell scripts launching independent processes, but `claude --print` runs in non-interactive mode — once launched, you can't intervene, and communication relies solely on file polling. v3 solves all of this.

### Command + Agent + Skill Three-Layer Architecture

```text
User → /dev-agent (Command, main context)
         │  ← Scheduling: read queue, evaluate dependencies, batch dispatch
         │
         ├── Agent Tool → DevSubAgent (Agent, independent 200k context)
         │                    ├── Skill Tool → /start-feature
         │                    ├── Skill Tool → /implement-feature --auto
         │                    ├── Skill Tool → /verify-feature --auto-fix
         │                    └── Skill Tool → /complete-feature --auto
         │
         └── Agent Tool → DevSubAgent × N (batch parallel, run_in_background)
```

**dev-agent (Command)** is the user entry point, running in the main context, responsible for scheduling. It reads `queue.yaml` and `config.yaml`, evaluates which features can start, then batch-dispatches DevSubAgents via Agent Tool.

**DevSubAgent (Agent)** is the executor, with an independent 200k context that doesn't pollute the main conversation. It's a Skill orchestrator that calls registered Skills in sequence to complete a feature's full lifecycle. Core principle: invoke via Skill Tool, don't read docs, don't duplicate implementation.

### Why MateAgent Was Deprecated

The original design included a standalone MateAgent as a scheduler. But Claude Code v2.1.x has a nesting limitation: custom SubAgents cannot spawn further SubAgents. Additionally, scheduling logic doesn't need an isolated context — it can run perfectly in the Command's main context. So the scheduling logic was merged directly into the dev-agent Command, resulting in a cleaner architecture.

### Full Lifecycle Automation

DevSubAgent covers every stage of a feature from creation to archival:

```text
start-feature (create branch + worktree)
  → implement-feature (write code in worktree)
    → verify-feature (testing + acceptance)
      → complete-feature (commit → merge → tag → archive → cleanup)
```

Fully autonomous. When encountering problems, it follows the full-automation principle:

- Test failure → fix code → rerun tests (max 2 retries)
- Rebase conflict → analyze conflict → smart merge → re-verify
- Lint error → fix code → rerun lint
- Multiple retries still failing → return error (with detailed diagnostics), don't block other features

## Key Design Upgrades

### Plugin System and Distribution

Skills are now distributed through Company AI Marketplace, supporting standard Plugin management commands:

```bash
# Install
claude plugin marketplace add http://company-marketplace:9090/meper/meper-claude-marketplace
claude plugin install feature-workflow

# Update
claude plugin update feature-workflow

# Manage
claude plugin list
claude plugin disable feature-workflow
```

No more manually copying files to `.claude/` directories — install, update, and uninstall all follow standardized workflows.

### Project Context Management

A new `/pm-agent` Skill and `project-context.md` provide AI with project-level context:

```markdown
# Project Context: {project_name}

## Technology Stack
| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Frontend | React | 18.2 | Vite + TypeScript |
| Backend | Node.js | 20.x | Express |

## Critical Rules
### Must Follow
- Rule: {critical_rule}

## Recent Changes
| Date | Feature | Impact |
```

This context is incrementally updated during `complete-feature`, ensuring subsequent feature development always has access to the latest project information.

### Intelligent Feature Splitting

When a feature reaches L scale (3+ user value points), the system suggests splitting:

```text
Input: "User authentication system with registration, login, permission management"
Analysis: 3 user value points

Split result:
feat-auth-register  → Users can register (independently deliverable)
feat-auth-login     → Users can log in (depends on register)
feat-auth-permission → Users can manage permissions (depends on login)
```

The key principle is splitting by **user value**, not by technical layers. Splitting into `feat-auth-db`, `feat-auth-api`, `feat-auth-ui` is wrong because users can't get independent value from "database design."

### Gherkin Acceptance Criteria and Playwright MCP

Each feature's spec.md now includes Gherkin-formatted acceptance scenarios. The verification phase automatically selects the appropriate method based on feature type:

- **Backend**: AI code analysis validates Gherkin scenarios
- **Frontend**: Playwright MCP executes browser tests with automatic screenshot evidence
- **Fullstack**: Combined approach

After verification, a complete acceptance report is generated with screenshots and trace files for each step.

### Smart Stop Hook Interception

A `.loop-active` marker distinguishes between auto-loop mode and manual mode:

| Mode | Condition | Behavior |
| -- | -- | -- |
| `/dev-agent` auto-loop | `.loop-active` exists | Only checks continuation switch |
| Manual mode | `.loop-active` doesn't exist | Main switch false → allow pass-through |

This prevents manual operations (like `/new-feature`) from being incorrectly intercepted.

## Core Argument: Workflows Are No Silver Bullet

### Problems with Template-Based Workflows

The sections above cover the complete Feature Workflow v3 design. But there's a deeper issue worth discussing.

Many people take a workflow template, apply it directly to their project, find it doesn't work well, and conclude "this workflow doesn't work." The problem isn't the workflow itself — it's the **lack of project-specific customization**.

Common problems with template-based workflows:

- **Context mismatch**: The Skill granularity defined in the template doesn't suit the current project's tech stack and code scale
- **Rigid verification strategy**: Frontend projects need Playwright acceptance testing, backend API projects need integration tests, pure algorithm projects may only need unit tests
- **Over-engineered parallelism**: Small projects don't need parallel development at all — forcing it adds management complexity
- **Bloated documentation templates**: For a requirement completable in a week, writing full spec + task + checklist is over-engineering

### Every Project Needs Custom Skill Design

When applying Feature Workflow across different projects, I redesign Skills based on each project's characteristics:

**Project A (Large Full-Stack Application)**:

- Complex tech stack (React + Node.js + PostgreSQL)
- Team collaboration, strict documentation standards needed
- Uses all 11 Skills + Gherkin acceptance + Playwright testing
- Parallelism set to 2, dependency management required

**Project B (Python CLI Tool)**:

- Solo developer, simple tech stack
- Only keeps core 5 Skills (new/start/implement/verify/complete)
- Verification only does pytest + lint, no Playwright needed
- Parallelism set to 1, simplified queue management

**Project C (Data Pipeline Service)**:

- Backend-focused, emphasis on data correctness
- Verification strategy focuses on data validation and integration tests
- New Skill added for data migration rollback
- Archive strategy includes data snapshots

### Dimensions of Customization

When you take the Feature Workflow template, consider these dimensions for tailored design:

**1. Skill Granularity**

Not every project needs 11 Skills. Choose appropriate granularity based on project complexity. The core 5 Skills cover the full lifecycle — enable others as needed.

**2. Verification Strategy**

This is the dimension that needs the most customization. Frontend projects use Playwright, backend APIs use integration tests, data projects use data validation. Your verification strategy directly determines the ceiling of code quality.

**3. Project Context**

The content of `project-context.md` must be tailored to the project. Different projects care about completely different technical rules, anti-patterns, and coding conventions. Generic tech stack descriptions offer limited guidance to AI.

**4. Feature Splitting Threshold**

3 user value points to trigger splitting is the default. Small projects can relax to 5, large projects can tighten to 2. Splitting granularity directly affects parallel development efficiency and context management.

**5. Archive Strategy**

Should worktrees be preserved? How should tags be named? Should archives include data snapshots? These decisions should align with the project's release process and rollback strategy.

## Practical Recommendations

### Start with Minimum Viable

Don't enable everything at once. A recommended progressive adoption path:

```text
Phase 1: Manual mode (only use Skills manually)
  Familiarize with workflow concepts, validate basic flow

Phase 2: Single feature auto mode (/dev-agent feat-xxx)
  Experience full lifecycle automation, fine-tune Skill details

Phase 3: Batch parallel mode (/dev-agent)
  Enable parallel development, optimize parallel strategy

Phase 4: Advanced features (Playwright acceptance, feature splitting)
  Enable advanced features as needed
```

### Continuously Optimize Skill Design

Skills aren't designed once and done. After completing a few features, review actual Skill performance:

- Which steps does AI frequently get wrong?
- What's the auto-fix success rate in the verification phase?
- Is the feature splitting granularity appropriate?
- Does the project context need updating?

Use this feedback to continuously adjust Skill prompt design and configuration parameters.

## Resources

- [Feature Workflow v3 Source Code](https://github.com/auenger/AILock-Step/tree/feature/dev-agent-subagent-optimization/feature-workflow)
- [AILock-Step Protocol Documentation](https://github.com/auenger/AILock-Step)
- [AILock-Step Protocol Introduction](https://agentszone.ai/articles/ailock-step-protocol)
