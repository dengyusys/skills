---
name: code-style
description: 在采用本个人规范的软件项目中指导代码编写、重构与审查，统一注释、逻辑分段、模块组织、条件表达和抽象边界。当用户明确要求应用个人代码风格，或目标项目已安装或引用本技能且任务涉及代码变更或代码审查时使用；不用于一般技术问答、纯文档写作，也不覆盖仓库已有规范。
---

# 代码风格规范

统一的个人代码风格约定。目标是让代码按逻辑分段、注释说明“为什么”，并在不过度抽象的前提下易于维护和扩展。

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

## 适用优先级

按以下顺序应用规则：

1. 用户对当前任务的明确要求；
2. 仓库级规则、格式化工具、Lint 配置和目标文件已形成的局部惯例；
3. 本 Skill 的默认约定。

只调整当前任务涉及的代码。不要为了统一风格批量改写无关文件、既有注释或稳定接口；现有写法不违反更高优先级规则且不妨碍维护时，保持不变。

## 核心规则

| # | 规则 | 要点 | 参考 |
|---|------|------|------|
| 1 | 注释 | 遵循仓库语言；无约定时默认中文；解释“为什么”；按语言生态为需要说明的公共 API 写文档注释 | [comments.md](references/comments.md) |
| 2 | 空行 | 按逻辑步骤分段，一段只做一件事 | [organization.md](references/organization.md) |
| 3 | 按关注点拆分 | 根据职责、变化原因和消费方拆分，避免超长扁平结构，也避免机械切碎 | [organization.md](references/organization.md) |
| 4 | 简化条件逻辑 | 避免冗长嵌套三元；根据场景选择守卫语句、`if` / `switch`、映射表或注册表 | [conditional-logic.md](references/conditional-logic.md) |
| 5 | 避免过度抽象 | 只抽取已有复用或边界稳定的内容，允许暂时保留小范围重复 | [abstraction.md](references/abstraction.md) |

## Reference 使用条件

- 新增、修改或评审注释和公共 API 时，读取 [comments.md](references/comments.md)。
- 调整函数分段、配置结构或模块边界时，读取 [organization.md](references/organization.md)。
- 简化复杂条件分支时，读取 [conditional-logic.md](references/conditional-logic.md)。
- 提取共享模块、公共包或通用层时，读取 [abstraction.md](references/abstraction.md)。

只读取与当前任务直接相关的 reference。

## 验证

- 修改后运行仓库现有测试命令（如 `pnpm test` / `npm test`）。
- 同时运行仓库已有的格式化、Lint 或类型检查命令；不存在时不额外引入工具。
- 交付前复核注释、空行、条件表达与模块边界，并确认没有无关的风格改写。
