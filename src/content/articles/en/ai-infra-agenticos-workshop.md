---
title: "System Infrastructure for the Agent Era: Recap of the First AgenticOS Workshop"
description: "A summary of the first AgenticOS Workshop at ASPLOS 2026, exploring agents' dual role: as new users demanding fault tolerance, exploratory execution, and resource control; and as new builders enabling specialized software revival and LLM-assisted system management."
author: fuquanzhi
date: 2026-03-27
tags: [systems, agent-infrastructure, agenticos, workshop, os]
---

Agents are rapidly penetrating every corner of our computing landscape. With the proliferation of tools like OpenClaw and Claude Code, agents have acquired the ability to execute autonomously inside sandboxed environments. For a long time, systems researchers treated AI as a dense computational workload — the core challenge was optimizing throughput or latency for training and inference. The rise of agents has restructured this relationship: **AI is no longer merely a workload to be optimized; it has started to interact directly with underlying system infrastructure as a "user."** This identity shift demands that operating systems revisit their foundational abstractions and assumptions.

At the first AgenticOS Workshop held at ASPLOS — the top systems conference — academia began a focused discussion of this trend. Drawing on the workshop's research, this article explores the dual relationship between agents and underlying infrastructure: **agents are both new users of the system and new builders of system capabilities.**

As **new users**, agents differ from humans in behavior patterns, trust relationships, and controllability in fundamental ways. These differences invalidate many existing system assumptions and require us to design different abstractions starting from the nature of agents.

As **new builders**, coding agents are reshaping the economics of systems technology. A large number of previously infeasible technical approaches are becoming viable again.

This article first analyzes the demand-side transformation — the new requirements agents place on system primitives as users. It then turns to the supply side, examining how coding agents expand the feasibility frontier of system optimization. Finally, it distills three principles as a reference framework for research and practice in this space.

## Agent as New User: Which Assumptions Have Changed?

The emergence of agents has shaken a foundational assumption in system design: "systems are built for humans." The differences between agents and humans require rethinking many areas of system design.

First, agents exhibit **persistent and destructive behavioral characteristics**. Agents can run continuously for extended periods, exhausting all execution paths under goal-driven pursuit. Due to limited observability support, logical errors in their execution tend to be both hidden and destructive.

Second, at the trust level, traditional accountability mechanisms break down when agents are involved. Agents exist as pure execution proxies, severing the chain of accountability. Agents treat high-risk operations and low-risk operations with equal decisiveness — this **risk-neutral decision style** demands that systems intervene.

Third, on security boundaries, an agent's intent is fully exposed to external inputs. Prompt injection converts external data directly into control instructions. The agent's action space is completely open; its attack surface extends from traditional API calls to natural language text.

### Irreversible Side Effects: Backstopping Agent Errors

A core reason agents are difficult to fully trust in practice is the **irreversibility of side effects**. When an agent calls an external API, sends a message, or writes a record, that action has already affected the external world the moment it completes. You can roll back in-memory state, but you cannot unsend a message or reverse a completed transaction. This makes agent fault tolerance far harder than it is for traditional programs.

Guanlan Dai — early engineer at Cloudflare, founding engineer at Kong, and now founder of the agent infrastructure project RUNTA — addressed this problem in his invited talk, proposing a set of primitives covering three stages of the side-effect lifecycle.

**Stage 1: Effect Log** — recording what has already happened. It captures all external effects an agent has committed, the semantic equivalent of a write-ahead log. Only by sealing what has already occurred into a deterministic history record can subsequent constraints and recovery have a reliable foundation.

**Stage 2: Capability Gateway** — constraining what is allowed to happen. It gates side effects before they occur, separating planning permissions from execution permissions, and mediates all of an agent's external access through temporary, revocable tokens.

**Stage 3: Resumability** — how to return to a safe state after an error. When an agent has produced partial side effects and then fails, the system needs to let it safely resume from a known, deterministic state — re-entering from a sealed boundary rather than starting from zero.

![Three missing primitives — slide from Guanlan Dai's talk](/images/articles/ai-infra-agenticos-workshop/missingprimitives.jpg)

These three have a sequential dependency: **first record what has happened (Effect Log), then constrain what is about to happen (Capability Gateway), finally safely roll back when errors occur (Resumability).** Systems practitioners will find this structure familiar — a database's WAL first persists, access control constrains the operation scope, then crash recovery can restore state correctly. Agent fault tolerance reproduces this classic pattern at a higher semantic level.

### Exploratory Execution: Making Trial-and-Error a First-Class Operation

Agent execution has a fundamental difference from traditional programs. A traditional program's execution path is largely determined at writing time; it follows predetermined logic at runtime. An agent facing an open-ended goal must decide what to do next on its own, often pursuing multiple solution paths simultaneously and keeping only the successful one.

This explore-and-backtrack pattern faces two core difficulties when implemented at the application layer. The first is context bloat — as the agent switches back and forth among multiple paths, its context grows longer and longer, making it prone to being "lost in the middle" with degrading reasoning quality. The second is environmental side effects — each exploration path may modify files, spawn processes, or produce external effects; without isolation between paths, one path's side effects contaminate other paths' state.

The workshop paper *"Fork, Explore, Commit: OS Primitives for Agentic Exploration"* proposes pushing exploration and backtracking down to the OS layer. The core abstraction is called a **branch context** — it provides each exploration path with an isolated filesystem view and process group, supporting a complete lifecycle of fork, explore, and commit/abort. Multiple branches do not interfere with each other; a **first-commit-wins** strategy resolves conflicts: the successful branch commits, and all other branches are automatically invalidated.

The paper presents two Linux implementations: **BranchFS** is a FUSE-based filesystem providing each branch context with a copy-on-write isolated workspace with creation overhead under 350 microseconds; branch() is a proposed Linux syscall providing process isolation and branch coordination at the kernel level.

This complements the fault tolerance discussed earlier: **fault tolerance is a backstop after errors — how to recover; exploratory execution is proactive support — letting agents attempt and discard at low cost, reducing the penalty for mistakes.**

### Isolation and Resource Control: Why Existing Mechanisms Fall Short

Isolation and resource control are unavoidable fundamentals for running agents in production. Products like Lovable and Manus run large numbers of coding agents simultaneously in the cloud, each running in an isolated sandbox container. They need high deployment density to control costs and strict isolation to ensure security. This pattern superficially resembles serverless or microservices, but the resource consumption characteristics of agent workloads are completely different.

The **AgentCgroup** work I contributed to performed a systematic resource profile of sandboxed AI coding agents, analyzing 144 software engineering tasks on the SWE-rebench benchmark. Several key findings stand out: OS-level execution (tool calls and container initialization) accounts for **56–74%** of end-to-end latency; the concurrency bottleneck is **memory, not CPU**; the ratio of peak to average memory usage is **15.4×**, and these spikes are driven by tool calls — highly unpredictable and varying across tasks, runs, and models.

The paper compared these characteristics against serverless, microservices, and batch processing — three traditional workload categories — and identified three mismatches:

- **Granularity mismatch**: existing resource control policies operate at the container level, but agent resource fluctuations occur at the tool-call level.
- **Response speed mismatch**: user-space resource adjustments cannot keep up with sub-second unpredictable bursts.
- **Adaptability mismatch**: traditional methods predict from historical data, but agent execution is a non-deterministic stateful process where historical data has limited predictive value.

To address these mismatches, the paper proposes AgentCgroup, an eBPF-based resource controller. The core insight is to leverage the agent's own capabilities: agents can declare their resource needs and can also re-plan execution strategies when resources are insufficient. AgentCgroup uses a hierarchical cgroup structure aligned with tool-call boundaries for isolation, enforcing in real time at the kernel level via sched_ext and memcg_bpf_ops.

## Agent as Builder: The Feasibility Frontier of Systems Technology Is Moving

The previous section introduced agents as new users of the system, with entirely new requirements across fault tolerance, execution models, and resource management. On the other side, agents are also changing how infrastructure itself is built: they lower the cost of system-level customization and intelligent decision-making, making some previously infeasible technical paths viable again.

### Specialized Software Revived

When coding agents drive the cost of generating and adapting code toward zero, many technical paths in the systems domain that have long been constrained by labor costs will be reopened. This is the central thesis of Dan Williams, professor at Virginia Tech and keynote speaker at this workshop. Dan has deep research experience in operating systems and virtualization, with expertise in unikernels, systems security, and kernel architecture.

![Dan Williams delivering the keynote at AgenticOS 2026](/images/articles/ai-infra-agenticos-workshop/Dan.jpg)

A long-standing tension exists in systems: **the optimal solution is often highly customized, but customization carries prohibitively high engineering costs, so general-purpose solutions win.** The many design choices in the Linux ecosystem reflect exactly this economic constraint — everyone uses POSIX APIs, general-purpose filesystems, standard network stacks, and unified kernel configurations.

Unikernels are the most emblematic case of this tension. Unikernels are technically elegant — trimming the kernel, reducing the attack surface, significantly improving performance. But they have remained limited to niche applications because every application needs individual porting, driving engineering costs sky-high, and they don't support POSIX APIs, so they can't reuse the existing Linux ecosystem. **The arrival of coding agents changes this equation.** If the cost of generating and adapting code drops substantially, such systems can come back to life.

Intuitively, coding agents could generate an entirely custom system for each application from scratch. But anyone who has used coding agents knows that while coding costs have dropped, the costs of architectural design and accurate requirements specification for large systems projects remain unavoidable. **A more viable path is to provide extension points and dedicated interfaces, attaching customized logic to a general-purpose system rather than replacing the entire system.**

Extensions have already proven successful at the kernel level. eBPF lets you insert custom logic at critical kernel paths while a verifier guarantees code safety. This pattern has two layers of value for the coding-agent era: the first is safety — you may not fully trust agent-generated code, but a verifier can perform static checks before loading to guarantee satisfaction of a safety specification; the second is interface constraints — explicit hook points, restricted data access, and a limited set of operations mean **agents have less room to go wrong under such interfaces, making it easier to generate correct code.**

eBPF has proven the feasibility of this **"constrained, verifiable extension"** pattern. But it is currently limited to the kernel layer. If coding agents are to drive broader system customization, every layer of system components needs similar extension interfaces. This direction urgently needs exploration.

### Intelligent Decisions: LLMs Understanding Program Semantics to Assist System Management

LLMs' semantic understanding capabilities are opening new possibilities for system management. Program source code, documentation, error messages, and configuration descriptions have always existed, but traditional system management tools couldn't understand their meaning — they had to fall back on running benchmarks, looking at historical data, and fitting black-box models. LLMs can directly understand this information, converting semantic knowledge into the basis for system decisions.

The paper *"Fuyun: Bridging the Semantic Gap in Serverless Resource Provisioning via LLM Agents"* demonstrates this approach in the resource provisioning domain. Serverless platforms need to pre-allocate resources for each function; traditional methods use Bayesian optimization or reinforcement learning, treating functions as black boxes with high sample complexity that is difficult to deploy within production budget constraints. Fuyun lets an LLM agent read function source code directly and generate a verifiable parameterized policy. For an image processing function, after reading the source code the LLM can determine that execution time is approximately a function of the input image's length, width, and number of color channels, and produce a concrete expression. Experimental results show Fuyun achieves comparable reliability with only **one-quarter the profiling samples** of Bayesian optimization, while reducing resource waste by **44 percentage points** compared to static allocation.

A similar approach appears in the security domain. The paper *"VibeWAF"* explores using LLMs to generate WAF rules. Traditional rule maintenance relies on security experts to manually write and update rules — slow and demanding of specialized knowledge. VibeWAF uses a hybrid architecture: a fast rule engine handles known attack patterns, while an LLM analyzes traffic that the rule engine fails to match and generates new rules that feed back into the rule engine to cover similar future requests. This feedback loop converges to a **rule hit rate of 88%**, with average latency dropping from 6.5 seconds to under **400 milliseconds**.

These two papers solve different problems, but the underlying paradigm is the same: **LLMs handle understanding and decision-making; traditional system components handle efficient execution.**

## Three Principles and the Future They Point To

AgenticOS 2026 is the first workshop dedicated to discussing OS for agents, and much of the work is still in early stages. But from these early contributions, some clear trends are already emerging. We attempt to distill these trends into three principles.

### Principle 1: Design from Agent Nature, Not from Human User Experience

The difference between agents and humans is qualitative. The primitives Effect Log, Capability Gateway, and Resumability work precisely because they are designed starting from the irreversibility of side effects — a problem specific to agents. Branch context works because it is designed starting from the fact that agents naturally involve exploration and backtracking. **These abstractions all come from deep observation of agent behavior patterns, not from patching existing system abstractions.**

For system designers, this means spending significant time using agents, observing agents, and collaborating with agents in real scenarios — building intuition about agent behavior patterns from firsthand experience. Agents themselves are evolving rapidly; this intuition needs continuous updating.

### Principle 2: Revisit Good Technologies Killed by Economics

Unikernels, per-application system customization — these directions were shelved because adaptation costs were too high. **The technology itself is good. Coding agents are driving those costs down sharply; the economic constraints are loosening.**

This logic extends to more directions. Formal verification is a telling example. seL4 achieved a complete formal verification of a microkernel, but the human effort required was enormous, making extension to more complex systems nearly impossible. The bottleneck is that code itself lacks sufficient annotations, type hints, and invariants — the verification tools lack usable information. **If code is generated by LLMs, having them produce this auxiliary information alongside the code carries near-zero marginal cost.** More system components can be verified; more concurrency bugs can be caught at compile time.

**It is worth conducting a comprehensive review of approaches that were abandoned because of excessive labor or adaptation costs.** Every such direction should be reevaluated in the context of coding agents.

### Principle 3: Agents and Infrastructure Are Co-Evolving — Design for Evolution

The bidirectional framework running through this entire article is itself making this point. Agents as users push infrastructure to evolve, requiring new fault tolerance, execution models, and resource management. Agents as builders accelerate that evolution, making customization and intelligent decision-making viable. **These two reinforce each other, forming a positive feedback loop.** Once this loop is spinning, the pace of growth in agent capabilities may exceed our expectations based on current experience.

This means infrastructure designed today must leave room for this accelerating co-evolution. Overly rigid abstractions will become bottlenecks when agent capabilities make a step change. Part of why the extension pattern matters is precisely that it provides flexibility for co-evolution — the core of the system remains stable, while customized components can iterate continuously as agent capabilities grow.

> Infrastructure for agents is a field that has just begun to unfold. These three principles represent our current judgment; as agent capabilities evolve, these judgments will themselves be revised. But one thing will not change: **agents are becoming the subjects of computation, not its objects. Building infrastructure around this transformation is one of the most important challenges facing systems researchers and practitioners today.**
