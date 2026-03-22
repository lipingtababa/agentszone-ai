---
title: "AILock-Step Protocol: An Engineering Solution to AI Agent Hallucination Skipping"
description: A strict linear execution protocol based on STP state anchors. Eliminates hallucination skipping via physical jumps, enabling checkpoint-resumable AI Agent development with absolute idempotency.
author: yang-zhengwu
date: 2026-03-13
tags: [AI Agent, 工程实践, 执行协议, MCP]
original_url: https://imcoders.cn/blog/ai-agent-engineering/
---

## Introduction

When collaborating with AI on development, we encounter several common problems:

- **Hallucination skipping**: When AI sees a loop task, it simplifies intermediate steps due to context window pressure, saying "remaining tasks have similar logic and have been omitted"
- **Non-traceable state**: Once generation is interrupted, AI struggles to recover execution progress, leading to duplicate work or missed tasks
- **Chaotic dependency management**: AI may start implementing features before dependencies are ready, causing dependency relationship chaos
- **Semantic noise interference**: AI is easily influenced by emotional descriptions in code comments or requirement documents, producing logic that drifts from the goal

To solve these problems, I designed the **AILock-Step Protocol** — a strict linear execution protocol based on **State Transition Point (STP) anchors** that ensures absolute idempotency in task execution.

## Core Design

### Problem Comparison

| Problem | Traditional Approach | AILock-Step Approach |
| --- | --- | --- |
| **Hallucination skipping** | AI auto-simplifies steps when it sees `for task in tasks` | Physical jumps via `STP-XXX -> STP-YYY` force 100% step completeness |
| **Non-traceable state** | Hard to recover after interruption | Each STP node is associated with `REG_` registers and physical checkpoints |
| **Semantic noise** | AI easily influenced by emotional descriptions | Rare symbol logic (`??`, `!!`, `>>`) triggers "instruction parsing mode" |
| **Loose dependency management** | May skip preconditions | `??` judgment operator acts as a logic sentinel, hard-locking execution paths |

### Protocol Declaration

The AILock-Step Protocol defines a linear execution logic based on state anchors (STP). The executor must strictly follow single-step logic: number, judgment, action, jump. It can only enter the next state anchor after receiving an explicit jump instruction.

### Syntax Definition

```yaml
STP-[XXX]      - State anchor; execution pointer must halt here
?? [Condition] - Logic gate; jumps to error flow if condition is false
!! [Operator]  - Atomic operator; indivisible physical action
>> [Target]    - Data flow; pushes output into register
-> [Target_STP] - Forced jump; the only legal path of logical progression
```

#### Execution Example

```
STP-001: ?? [REG_TASK_COUNT > 0] -> STP-010
          !! OP_FS_READ >> REG_TASK_LIST
          -> STP-002

STP-002: !! OP_GET_TOP(REG_TASK_LIST, status=todo) >> REG_CUR_TASK
          -> STP-010
```

## Standard Operator Set

### Filesystem Operators

| Operator | Description |
| --- | --- |
| `OP_FS_READ` | Physically read filesystem contents; returns null if path doesn't exist |
| `OP_FS_WRITE` | Write or overwrite a file at the specified path |
| `OP_FS_EXISTS` | Check whether a path exists |
| `OP_FS_DELETE` | Delete a specified file or directory |

### Git Operators

| Operator | Description |
| --- | --- |
| `OP_GIT_STATUS` | Get current git status |
| `OP_GIT_COMMIT` | Commit current changes |
| `OP_GIT_MERGE` | Merge a specified branch |
| `OP_GIT_WORKTREE_ADD` | Create a worktree |
| `OP_GIT_WORKTREE_REMOVE` | Remove a worktree |

### Data Processing Operators

| Operator | Description |
| --- | --- |
| `OP_ANALYSE` | Transform unstructured documents into structured Key-Value format |
| `OP_GET_TOP` | Retrieve the first item matching filter criteria from a list register |
| `OP_COUNT` | Count items matching a condition |
| `OP_CODE_GEN` | Implement specific task code based on context |

### State Sync Operators

| Operator | Description |
| --- | --- |
| `OP_STATUS_UPDATE` | Update the .status file |
| `OP_TASK_SYNC` | Sync task.md status, marking as complete or pending |
| `OP_EVENT_EMIT` | Output events to the log |
| `OP_UI_NOTIFY` | Send a notification message to the user |

## Advantages

### 1. Eliminating Hallucination Skipping

**Problem**: In traditional approaches, AI auto-simplifies intermediate steps when it sees loop tasks due to context window pressure.

**AILock-Step solution**: The protocol prohibits loop semantics. AI must re-scan the task list via `STP-XXX -> STP-YYY` physical jumps. Every jump is a fresh state alignment, forcing AI to maintain 100% step completeness.

```
# Traditional approach (gets skipped)
for task in tasks:
    implement(task)

# AILock-Step (forced one-by-one execution)
STP-010: implement(task1) -> STP-011
STP-011: implement(task2) -> STP-012
STP-012: implement(task3) -> STP-013
```

### 2. Traceable State and Checkpoint Recovery

**Problem**: In traditional approaches, once generation is interrupted, AI struggles to recover execution progress.

**AILock-Step solution**: Each state anchor is associated with `REG_` registers and physical checkpoints. Even if execution is interrupted, a new session only needs to read the `.status` file to precisely locate the pointer and resume from the checkpoint.

```bash
# Resume execution
/parallel-dev --resume
```

### 3. Semantic Noise Shielding

**Problem**: In traditional approaches, AI is easily influenced by emotional descriptions in code comments or requirement documents.

**AILock-Step solution**: The protocol uses rare symbol logic (`??`, `!!`, `>>`). This triggers AI's "instruction parsing mode" rather than "text continuation mode," focusing its attention on operator execution rather than semantic guessing.

### 4. Strict Dependency Management

**Problem**: In traditional approaches, AI may start implementing features before dependencies are ready.

**AILock-Step solution**: The protocol hard-locks execution paths through the state anchor sequence. The `??` judgment operator acts as a logic sentinel: if a prerequisite task isn't marked complete, the pointer cannot advance to the next phase.

```
STP-100: ?? [REG_DEPS_READY == true] -> STP-200
          !! OP_ERROR_NOTIFY("Dependencies not ready")
          -> STP-999
```

## Practical Application

Based on the AILock-Step protocol, we built a complete feature development workflow supporting parallel development and checkpoint recovery.

### Project Structure

```
AILock-Step/
├── README.md
├── AILock-Step-Protocol-Operator-Reference-v1-0.md
├── feature-workflow-LockStep/
│   ├── PROTOCOL.md
│   ├── config.yaml
│   ├── skills/
│   │   ├── parallel-dev.md
│   │   ├── feature-agent.md
│   │   ├── start-feature.md
│   │   └── complete-feature.md
│   ├── scripts/
│   ├── templates/
│   ├── agents/
│   └── tests/
└── dist/
```

### Core Workflows

#### Parallel Development Workflow

```
[Phase: Initialization]
STP-001: Read queue → STP-002
STP-002: Check active features → STP-100

[Phase: Monitor Loop]
STP-100: Check each .status file → STP-101/STP-200/STP-300
STP-101: status=not_started → Start Agent → STP-100
STP-200: status=done → Call complete → STP-201
STP-201: Check auto_start_next → STP-202/STP-300
STP-202: Start next feature → STP-100
STP-300: All complete → Exit
```

#### Feature Agent Workflow

```
[Phase: INITIALIZATION]
STP-001: EVENT:START → STP-002
STP-002: Read spec.md → STP-003
STP-003: Read task.md → STP-010

[Phase: IMPLEMENT]
STP-010: Check incomplete tasks → STP-011/STP-100
STP-011: Implement current task → STP-012
STP-012: Update progress → STP-010

[Phase: VERIFY]
STP-100: Verify all tasks complete → STP-101
STP-101: npm run lint → STP-102
STP-102: npm test → STP-103
STP-103: Check checklist → STP-200

[Phase: COMPLETE]
STP-200: git commit → STP-201
STP-201: Update status=done → STP-202
STP-202: EVENT:COMPLETE → END
```

### Usage

#### Basic Usage

```bash
# 1. Create a new feature
/new-feature user-authentication

# 2. Start feature development environment
/start-feature feat-auth

# 3. Start parallel development (LockStep mode)
/parallel-dev

# The system will strictly execute STP steps without skipping any verification
```

#### Status File Format

```yaml
# features/active-{id}/.status
feature_id: feat-auth
status: implementing
stage: implement
stp_pointer: STP-010    # Current state anchor
progress:
  tasks_total: 5
  tasks_done: 3
  current_task: "Implement login API"
registers:
  REG_CUR_TASK: "task-003"
  REG_SPEC: "..."
started_at: 2026-03-05T10:00:00Z
updated_at: 2026-03-05T10:30:00Z
```

### Configuration Options

```yaml
workflow:
  auto_start_next: true
  protocol:
    strict_mode: true
    emit_stp_events: true
    checkpoint_interval: 5

verification:
  require_lint: true
  require_test: true
  require_checklist: true

recovery:
  auto_resume: true
  max_retries: 3
```

### EVENT Token Specification

The protocol defines a standard event format for observability:

```
EVENT:START <feature-id>
EVENT:STAGE <feature-id> <stage>
EVENT:PROGRESS <feature-id> <done>/<total>
EVENT:BLOCKED <feature-id> <reason>
EVENT:COMPLETE <feature-id> <tag>
EVENT:ERROR <feature-id> <message>
EVENT:STP <feature-id> <stp-id>
```

## Summary

The AILock-Step Protocol ensures reliable AI Agent execution through:

- **State anchors enforce linear execution**: physical jumps eliminate hallucination skipping
- **Atomic operators**: ensure idempotency and traceability of each operation
- **Register system**: provides clear data flow and state management
- **Physical checkpoints**: enable true checkpoint-resume capability
- **Symbol logic**: shields semantic noise, letting AI focus on execution

> **Core philosophy**: Adopting the AILock-Step Protocol is about ensuring absolute idempotency in task execution. As an executor, you don't need to understand the "macro significance" of tasks — only ensure that every STP's REG_ transitions are accurate.

## Resources

- [AILock-Step Protocol Full Documentation](https://github.com/auenger/AILock-Step)
- [OA_Tool Project Practice](https://github.com/auenger/OA_Tool)
- [MCP Protocol Documentation](https://modelcontextprotocol.io)
