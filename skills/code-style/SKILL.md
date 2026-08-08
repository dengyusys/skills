---
name: code-style
description: 规范个人代码风格与可读性约定。当编写、重构、审查代码，或统一代码风格时使用。
---

# 代码风格规范

统一的个人代码风格约定。适用于个人维护的各项目源码，目标是让代码按逻辑分段、注释说明“为什么”，并易于扩展。

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

## 核心规则

| # | 规则 | 要点 | 参考 |
|---|------|------|------|
| 1 | 注释 | 中文注释；块级说明职责；注释解释“为什么”；JSDoc 标注导出项 | [comments.md](references/comments.md) |
| 2 | 空行 | 按逻辑步骤分段，一段只做一件事 | [organization.md](references/organization.md) |
| 3 | 按关注点拆分 | 不写超长扁平配置，拆成小切片，入口汇总 | [organization.md](references/organization.md) |
| 4 | 避免冗长嵌套三元 | 用注册表 + 查表函数 | [conditional-logic.md](references/conditional-logic.md) |
| 5 | 避免过度抽象 | 公共包只保留真正共享的部分 | [abstraction.md](references/abstraction.md) |

## 验证

- 修改后运行仓库现有测试命令（如 `pnpm test` / `npm test`）。
- 交付前复核注释、空行与模块边界，避免文档与实际结构脱节。
