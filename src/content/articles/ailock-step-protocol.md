---
title: AILock-Step 协议：解决 AI Agent 幻觉性跳步的工程实践
description: 基于 STP 状态锚点的线性执行协议，通过物理跳转消除幻觉性跳步，实现 AI Agent 断点续传级开发，确保任务执行的绝对幂等性。
author: yang-zhengwu
date: 2026-03-13
tags: [AI Agent, 工程实践, 执行协议, MCP]
original_url: https://imcoders.cn/blog/ai-agent-engineering/
---

## 引言

在与 AI 协作开发时，我们会遇到几个典型问题：

- **幻觉性跳步**：AI 看到循环任务时，会因为上下文窗口压力自动简化中间步骤，直接说"剩余任务逻辑相似已省略"
- **状态不可追溯**：一旦生成中断，AI 很难找回执行进度，导致重复工作或遗漏任务
- **依赖管理混乱**：AI 可能在依赖未就绪时就开始实现相关功能，导致依赖关系错乱
- **语义噪声干扰**：AI 容易受代码注释或需求文档中感性描述的影响，产生偏离目标的逻辑

为了解决这些问题，我设计了 **AILock-Step 协议** —— 一种基于**状态锚点（STP）**的严格线性执行协议，确保任务执行的绝对幂等性。

## 核心设计

### 问题对比

| 问题 | 传统方案 | AILock-Step 方案 |
| --- | --- | --- |
| **幻觉性跳步** | AI 看到 `for task in tasks` 会自动简化中间步骤 | 通过 `STP-XXX -> STP-YYY` 物理跳转，强迫 AI 保持 100% 步骤完整性 |
| **状态不可追溯** | 中断后难以恢复 | 每个 STP 节点都关联 `REG_` 寄存器和物理存盘点 |
| **语义噪声** | AI 容易被感性描述影响 | 冷门符号逻辑 (`??`, `!!`, `>>`) 触发"指令解析模式" |
| **依赖管理松散** | 可能跳过前置条件 | `??` 判断算子充当逻辑哨兵，硬性锁死执行路径 |

### 协议声明

AILock-Step 协议定义了一种基于状态锚点（STP）的线性执行逻辑。执行器必须严格遵守编号、判断、动作、跳转的单步逻辑。只有在收到明确的跳转指令后才能进入下一个状态锚点。

### 语法定义

```yaml
STP-[XXX]      - 状态锚点，执行指针必须停留在此处
?? [Condition] - 逻辑门控，条件为假时跳转错误流
!! [Operator]  - 原子算子，不可拆分的物理动作
>> [Target]    - 数据流向，将输出压入寄存器
-> [Target_STP] - 强制跳转，唯一合法的逻辑演进路径
```

#### 执行示例

```
STP-001: ?? [REG_TASK_COUNT > 0] -> STP-010
          !! OP_FS_READ >> REG_TASK_LIST
          -> STP-002

STP-002: !! OP_GET_TOP(REG_TASK_LIST, status=todo) >> REG_CUR_TASK
          -> STP-010
```

## 标准算子集

### 文件系统算子

| 算子 | 描述 |
| --- | --- |
| `OP_FS_READ` | 物理读取文件系统内容，路径不存在时返回空值 |
| `OP_FS_WRITE` | 写入或覆盖指定路径文件 |
| `OP_FS_EXISTS` | 检查路径是否存在 |
| `OP_FS_DELETE` | 删除指定文件或目录 |

### Git 算子

| 算子 | 描述 |
| --- | --- |
| `OP_GIT_STATUS` | 获取当前 git 状态 |
| `OP_GIT_COMMIT` | 提交当前变更 |
| `OP_GIT_MERGE` | 合并指定分支 |
| `OP_GIT_WORKTREE_ADD` | 创建 worktree |
| `OP_GIT_WORKTREE_REMOVE` | 删除 worktree |

### 数据处理算子

| 算子 | 描述 |
| --- | --- |
| `OP_ANALYSE` | 将非结构化文档转化为结构化的 Key-Value 格式 |
| `OP_GET_TOP` | 从列表寄存器中取出第一个符合过滤条件的项 |
| `OP_COUNT` | 统计符合条件的项目数量 |
| `OP_CODE_GEN` | 基于上下文实现具体任务的代码 |

### 状态同步算子

| 算子 | 描述 |
| --- | --- |
| `OP_STATUS_UPDATE` | 更新 .status 文件 |
| `OP_TASK_SYNC` | 同步 task.md 状态，标记为完成或待处理 |
| `OP_EVENT_EMIT` | 输出事件到日志 |
| `OP_UI_NOTIFY` | 向用户发送通知消息 |

## 方案优势

### 1. 消除幻觉性跳步

**问题**：传统方案中，AI 看到循环任务时会因为上下文窗口压力自动简化中间步骤。

**AILock-Step 解决**：协议禁止循环语义，AI 必须通过 `STP-XXX -> STP-YYY` 物理跳转重新扫描任务列表。每一轮跳转都是一次全新的状态对齐，强迫 AI 保持 100% 步骤完整性。

```
# 传统方案（会被跳过）
for task in tasks:
    implement(task)

# AILock-Step（强制逐个执行）
STP-010: implement(task1) -> STP-011
STP-011: implement(task2) -> STP-012
STP-012: implement(task3) -> STP-013
```

### 2. 状态可追溯与中断恢复

**问题**：传统方案中，一旦生成中断，AI 很难找回执行进度。

**AILock-Step 解决**：每个状态锚点都关联 `REG_` 寄存器和物理存盘点。即使执行中断，新会话只需读取 `.status` 文件即可精准定位指针，实现断点续传。

```bash
# 恢复执行
/parallel-dev --resume
```

### 3. 语义噪声屏蔽

**问题**：传统方案中，AI 容易受代码注释或需求文档中感性描述的影响。

**AILock-Step 解决**：协议采用冷门符号逻辑（`??`, `!!`, `>>`）。这会触发 AI 的"指令解析模式"而非"文本续写模式"，使其注意力集中在算子执行上，而非语义猜测。

### 4. 严格的依赖管理

**问题**：传统方案中，AI 可能在依赖未就绪时就开始实现相关功能。

**AILock-Step 解决**：协议通过状态锚点序列锁死执行路径。`??` 判断算子充当逻辑哨兵，如果前置任务未标记为完成，指针无法移动至下一阶段。

```
STP-100: ?? [REG_DEPS_READY == true] -> STP-200
          !! OP_ERROR_NOTIFY("依赖未就绪")
          -> STP-999
```

## 实际应用

基于 AILock-Step 协议，我们构建了完整的特性开发工作流，支持并行开发和断点续传。

### 项目结构

```
AILock-Step/
├── README.md                        # 项目文档
├── AILock-Step-运行协议-算子说明书-v1-0.md  # 完整协议说明书
├── feature-workflow-LockStep/       # LockStep 版工作流实现
│   ├── PROTOCOL.md                  # 协议详细规范
│   ├── config.yaml                  # 配置文件
│   ├── skills/                      # Claude Code 技能
│   │   ├── parallel-dev.md          # 并行开发编排器
│   │   ├── feature-agent.md         # Feature Agent 执行协议
│   │   ├── start-feature.md         # 启动 Feature
│   │   └── complete-feature.md      # 完成 Feature
│   ├── scripts/                     # 辅助脚本
│   ├── templates/                   # 状态文件模板
│   ├── agents/                      # Agent 配置
│   └── tests/                       # 测试用例
└── dist/                            # 构建产物
```

### 核心工作流

#### 并行开发工作流

```
[Phase: Initialization]
STP-001: 读取队列 → STP-002
STP-002: 检查 active features → STP-100

[Phase: Monitor Loop]
STP-100: 检查每个 .status 文件 → STP-101/STP-200/STP-300
STP-101: 状态=not_started → 启动 Agent → STP-100
STP-200: 状态=done → 调用 complete → STP-201
STP-201: 检查 auto_start_next → STP-202/STP-300
STP-202: 启动下一个 feature → STP-100
STP-300: 所有完成 → 退出
```

#### Feature Agent 工作流

```
[Phase: INITIALIZATION]
STP-001: EVENT:START → STP-002
STP-002: 读取 spec.md → STP-003
STP-003: 读取 task.md → STP-010

[Phase: IMPLEMENT]
STP-010: 检查未完成任务 → STP-011/STP-100
STP-011: 实现当前任务 → STP-012
STP-012: 更新进度 → STP-010

[Phase: VERIFY]
STP-100: 验证所有任务完成 → STP-101
STP-101: npm run lint → STP-102
STP-102: npm test → STP-103
STP-103: 检查 checklist → STP-200

[Phase: COMPLETE]
STP-200: git commit → STP-201
STP-201: 更新 status=done → STP-202
STP-202: EVENT:COMPLETE → END
```

### 使用方法

#### 基础使用

```bash
# 1. 创建新 feature
/new-feature 用户认证

# 2. 启动 feature 开发环境
/start-feature feat-auth

# 3. 启动并行开发 (LockStep 模式)
/parallel-dev

# 系统将严格按照 STP 步骤执行，不会跳过任何验证
```

#### 状态文件格式

```yaml
# features/active-{id}/.status
feature_id: feat-auth
status: implementing
stage: implement
stp_pointer: STP-010    # 当前执行到的状态锚点
progress:
  tasks_total: 5
  tasks_done: 3
  current_task: "实现登录 API"
registers:
  REG_CUR_TASK: "task-003"
  REG_SPEC: "..."
started_at: 2026-03-05T10:00:00Z
updated_at: 2026-03-05T10:30:00Z
```

### 配置选项

```yaml
workflow:
  auto_start_next: true          # 并行开发完成后自动启动下一个
  protocol:
    strict_mode: true             # 严格模式
    emit_stp_events: true         # 输出 STP 进入事件
    checkpoint_interval: 5        # 检查点间隔

verification:
  require_lint: true             # 要求通过 lint
  require_test: true             # 要求通过测试
  require_checklist: true        # 要求完成检查清单

recovery:
  auto_resume: true              # 自动恢复
  max_retries: 3                 # 最大重试次数
```

### EVENT Token 规范

协议定义了标准的事件格式实现可观测性：

```
EVENT:START <feature-id>
EVENT:STAGE <feature-id> <stage>
EVENT:PROGRESS <feature-id> <done>/<total>
EVENT:BLOCKED <feature-id> <reason>
EVENT:COMPLETE <feature-id> <tag>
EVENT:ERROR <feature-id> <message>
EVENT:STP <feature-id> <stp-id>
```

## 总结

AILock-Step 协议通过以下机制确保 AI Agent 的可靠执行：

- **状态锚点强制线性执行**：通过物理跳转消除幻觉性跳步
- **原子算子**：确保每个操作的幂等性和可追溯性
- **寄存器系统**：提供清晰的数据流转和状态管理
- **物理存盘**：实现真正的断点续传能力
- **符号逻辑**：屏蔽语义噪声，让 AI 专注于执行

> **核心理念**：采用 AILock-Step 协议是为了确保任务执行的绝对幂等性。作为一个执行器，不需要理解任务的"宏观意义"，只需确保每一个 STP 的 REG_ 转换准确无误。

## 相关资源

- [AILock-Step 协议完整文档](https://github.com/auenger/AILock-Step)
- [OA_Tool 项目实践](https://github.com/auenger/OA_Tool)
- [MCP 协议文档](https://modelcontextprotocol.io)
