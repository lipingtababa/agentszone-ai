## 引言

在之前的文章中，我介绍了 Feature Workflow 基于 Git Worktree 的多特性并行开发范式。经过几个实际项目的落地验证，工作流经历了从 v1 到 v3 的架构演进。这次更新不只是技术层面的重构，更是一次关于 AI 工作流设计哲学的重新思考。

一个核心观点需要先说清楚：**模板化的工作流不是银弹，每一个项目都需要针对自身特点进行 Skill 的重新规划和设计。**

## v3 架构演进

### 从 v1 到 v3 的变化路径

| 版本 | 架构                           | 核心问题                |
| -- | ---------------------------- | ------------------- |
| v1 | 纯 Skill 链式调用                 | 主会话被阻塞，开发细节污染上下文    |
| v2 | Shell 脚本 + `claude --print`  | 进程黑盒，无法实时干预，通信机制简陋  |
| v3 | Command + Agent + Skill 三层架构 | 原生集成，上下文隔离，全生命周期自动化 |

v1 时代，所有操作都在主会话中执行，AI 的开发上下文和用户的对话上下文混在一起，会话很快变得臃肿。v2 试图通过 Shell 脚本启动独立进程来隔离，但 `claude --print` 是非交互模式，启动后无法干预，通信只能通过文件轮询。v3 彻底解决了这些问题。

### Command + Agent + Skill 三层架构

```text
User → /dev-agent (Command, 主上下文)
         │  ← 调度：读取队列、评估依赖、批量派发
         │
         ├── Agent Tool → DevSubAgent (Agent, 独立 200k 上下文)
         │                    ├── Skill Tool → /start-feature
         │                    ├── Skill Tool → /implement-feature --auto
         │                    ├── Skill Tool → /verify-feature --auto-fix
         │                    └── Skill Tool → /complete-feature --auto
         │
         └── Agent Tool → DevSubAgent × N (批量并行, run_in_background)
```

**dev-agent（Command）** 是用户入口，运行在主上下文中，负责调度。它读取 `queue.yaml` 和 `config.yaml`，评估哪些 feature 可以启动，然后通过 Agent Tool 批量派发 DevSubAgent。

**DevSubAgent（Agent）** 是执行器，拥有独立的 200k 上下文，不污染主对话。它是一个 Skill 编排器，按顺序调用已注册的 Skills 完成一个 feature 的完整生命周期。核心原则：通过 Skill Tool 调用，不读文档，不重复实现。

### 为什么废弃 MateAgent

最初设计中有一个独立的 MateAgent 作为调度器。但 Claude Code v2.1.x 有嵌套限制：自定义 SubAgent 不能再派生 SubAgent。而且调度逻辑不需要独立上下文，完全可以在 Command 的主上下文中执行。所以调度逻辑直接合并到 dev-agent Command，架构更简洁。

### 全生命周期自动化

DevSubAgent 涵盖一个 feature 从生到死的全部阶段：

```text
start-feature (创建分支 + worktree)
  → implement-feature (在 worktree 中写代码)
    → verify-feature (测试 + 验收)
      → complete-feature (commit → merge → tag → 归档 → 清理)
```

全程无人值守。遇到问题时遵循全自动原则：

* 测试失败 → 修复代码 → 重跑测试（最多 2 次）

* Rebase 冲突 → 分析冲突 → 智能合并 → 重新验证

* Lint 报错 → 修复代码 → 重跑 lint

* 多次重试仍失败 → 返回 error（附带详细诊断），不阻塞其他 feature

## 关键设计升级

### Plugin 系统与分发

Skills 现在通过 Company AI Marketplace 分发，支持标准的 Plugin 管理命令：

```bash
# 安装
claude plugin marketplace add http://company-marketplace:9090/meper/meper-claude-marketplace
claude plugin install feature-workflow

# 更新
claude plugin update feature-workflow

# 管理
claude plugin list
claude plugin disable feature-workflow
```

工作流不再需要手动复制文件到 `.claude/` 目录，安装、更新、卸载都有了标准化的流程。

### 项目上下文管理

新增了 `/pm-agent` Skill 和 `project-context.md`，为 AI 提供项目级别的上下文信息：

```markdown
# Project Context: {project_name}

## Technology Stack
| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| Frontend | React | 18.2 | Vite + TypeScript |
| Backend | Node.js | 20.x | Express |

## Critical Rules
### Must Follow
- 规则: {critical_rule}

## Recent Changes
| Date | Feature | Impact |
```

这个上下文在 `complete-feature` 时自动增量更新，确保后续的 feature 开发能持续获取最新的项目信息。

### 需求智能切分

当需求规模达到 L（3 个以上用户价值点）时，系统会建议切分：

```text
输入: "用户认证系统，支持注册、登录、权限管理"
分析: 3 个用户价值点

切分结果:
feat-auth-register  → 用户能注册 (独立可交付)
feat-auth-login     → 用户能登录 (依赖 register)
feat-auth-permission → 用户能管理权限 (依赖 login)
```

切分的关键原则是按**用户价值**拆分，而非按技术层拆分。`feat-auth-db`、`feat-auth-api`、`feat-auth-ui` 这种切分方式是错误的，因为用户无法从"数据库设计"中获得独立价值。

### Gherkin 验收与 Playwright MCP

每个 feature 的 spec.md 现在包含 Gherkin 格式的验收场景，验证阶段根据类型自动选择验收方式：

* **Backend**: AI 代码分析验证 Gherkin 场景

* **Frontend**: Playwright MCP 执行浏览器测试，自动截图保存证据

* **Fullstack**: 混合方式

验证完成后生成完整的验收报告，包含每一步的截图和 trace 文件。

### Stop Hook 智能拦截

通过 `.loop-active` marker 区分自动循环模式和手动模式：

| 模式                | 判断条件               | 说明            |
| ----------------- | ------------------ | ------------- |
| `/dev-agent` 自动循环 | `.loop-active` 存在  | 只看续跑开关        |
| 手动模式              | `.loop-active` 不存在 | 主开关 false 则放行 |

这避免了手动操作（如 `/new-feature`）被误拦截。

## 核心观点：工作流不是银弹

### 模板化工作流的问题

以上介绍了 Feature Workflow v3 的完整设计。但这里有一个更深层的问题需要讨论。

很多人拿到一个工作流模板后，直接套用到自己的项目上，发现效果不好，就说"这个工作流不行"。问题其实不在工作流本身，而在于**没有针对项目进行定制化设计**。

模板化工作流的典型问题：

* **上下文不匹配**：模板定义的 Skill 粒度不适合当前项目的技术栈和代码规模

* **验证策略僵化**：前端项目需要 Playwright 验收，后端 API 项目需要接口测试，纯算法项目可能只需要单元测试

* **并行策略过度**：小项目根本不需要并行开发，强行使用反而增加管理复杂度

* **文档模板冗余**：对于一周能完成的小需求，写完整的 spec + task + checklist 是过度工程

### 每个项目都需要重新设计 Skill

我在不同的项目中应用 Feature Workflow 时，会根据项目特点重新规划 Skill 设计：

**项目 A（大型全栈应用）**：

* 技术栈复杂（React + Node.js + PostgreSQL）

* 团队协作，需要严格的文档规范

* 使用完整 11 个 Skills + Gherkin 验收 + Playwright 测试

* 并行数设为 2，需要依赖管理

**项目 B（Python CLI 工具）**：

* 单人开发，技术栈简单

* 只保留核心 5 个 Skills（new/start/implement/verify/complete）

* 验证阶段只做 pytest + lint，不需要 Playwright

* 并行数设为 1，简化队列管理

**项目 C（数据管道服务）**：

* 后端为主，强调数据正确性

* 验证策略重点在数据校验和集成测试

* 新增数据迁移回滚的 Skill

* 归档策略包含数据快照

### 定制化的设计维度

当你拿到 Feature Workflow 模板后，需要从以下维度进行针对性设计：

**1. Skill 粒度**

不是每个项目都需要 11 个 Skill。根据项目复杂度选择合适的粒度。核心 5 个 Skill 覆盖了完整的生命周期，其他的按需启用。

**2. 验证策略**

这是最需要定制化的部分。前端项目用 Playwright，后端 API 用接口测试，数据项目用数据校验。验证策略直接决定代码质量的上限。

**3. 项目上下文**

`project-context.md` 的内容需要针对项目特点定制。不同项目关注的技术规则、反模式、代码约定完全不同。泛泛的技术栈描述对 AI 的指导意义有限。

**4. 需求切分阈值**

3 个用户价值点触发切分是默认值。小项目可以放宽到 5 个，大项目可以收紧到 2 个。切分的粒度直接影响开发的并行效率和上下文管理。

**5. 归档策略**

是否需要保留 worktree？tag 格式怎么命名？归档时是否需要数据快照？这些都需要根据项目的发布流程和回滚策略来决定。

## 实践建议

### 从最小可用开始

不要一上来就启用所有功能。建议的渐进式引入路径：

```text
Phase 1: 手动模式（只使用 Skills 手动调用）
  熟悉工作流理念，验证基础流程

Phase 2: 单 feature 自动模式（/dev-agent feat-xxx）
  体验全生命周期自动化，调整 Skill 细节

Phase 3: 批量并行模式（/dev-agent）
  开启并行开发，调优并行策略

Phase 4: 增强功能（Playwright 验收、需求切分）
  按需启用高级功能
```

### 持续优化 Skill 设计

Skill 不是一次设计就定型的。每完成几个 feature 后，回顾 Skill 的实际表现：

* AI 在哪些步骤容易出错？

* 验证阶段的自动修复成功率如何？

* 需求切分的粒度是否合适？

* 项目上下文是否需要更新？

根据这些反馈持续调整 Skill 的 prompt 设计和配置参数。

## 相关资源

* [Feature Workflow v3 源码](https://github.com/auenger/AILock-Step/tree/feature/dev-agent-subagent-optimization/feature-workflow)

* [AILock-Step 协议文档](https://github.com/auenger/AILock-Step)

* [AILock-Step 协议介绍](https://agentszone.ai/articles/ailock-step-protocol)

⠀