---
name: code-style
description: 规范个人代码风格与可读性约定。当编写、重构、审查代码，或统一代码风格时使用。
---

# 代码风格规范

统一的个人代码风格约定。适用于本仓库所有源码（`apps/`、`packages/`、`scripts/`、`test/`）。目标是让代码按逻辑分段、注释说明“为什么”，并易于扩展。

## 1. 注释

- 一律使用中文注释。
- 文件/模块顶部用块级注释 `/** */` 说明整体职责。
- 重要常量或数据表（如状态码表、提供商注册表、枚举映射）在变量上方统一用一块 `/** */` 说明，内部用箭头 `→` 表示映射关系，或用 `1. 2. 3.` 序号列举各项；**不要**在每个属性上方分别加注释。

  ```js
  /**
   * AI 提供商注册表：映射提供商 → 模型配置。
   *
   * deepseek → { 模型环境变量: DEEPSEEK_MODEL, 默认模型: deepseek-v4-flash }
   * fixed    → null（本地固定解析器，不调用 AI，无模型配置）
   */
  ```

- 流程类说明用箭头串起步骤，步骤类说明用序号列举：

  ```js
  /**
   * Gateway 进程入口：
   *   1. 解析配置（config/index.mjs）；
   *   2. 按配置创建 AI 解析器（create-command-parser.mjs）；
   *   3. 组装 HTTP 服务（create-schedule-server）并监听启动。
   */
  ```

- 注释解释“为什么”（安全边界、防漂移、性能、兼容原因），不只复述代码在做什么。
- 为关键函数/导出项标注职责与约定（如“仅通过 URL 提交 proposal_id”“缺失文件抛 MONTH_FILE_MISSING”）。
- 导出函数/类/常量使用 JSDoc 注释（`/** */`）描述，并可用 `@param`、`@returns` 标注参数类型、默认值与用途，便于 IDE 提示与后续维护；行内 `//` 注释用于解释局部逻辑。默认值用 `[options.xxx]` 表示可选参数。
- 无需逐行注释；显而易见的代码不加注释。
- JSON（`package.json` 等）不支持注释，不要写入。

## 2. 空行

- 按逻辑步骤分段，段间加空行，避免大段代码挤在一起。
- 一段代码只做一件事；不要把“解析 → 校验 → 组装 → 返回”压成连续一行。
- 结构示意：

  ```js
  export function resolveGatewayConfig(options = {}) {
    const { env = process.env } = options;

    // 端口：固定来自配置（AI_STEWARD_PORT，默认 4173），不接受命令行参数。
    const port = ...;

    // 提供商：未显式配置时，按是否配置了 API key 自动选择。
    const aiProvider = ...;

    return { ... };
  }
  ```

## 3. 按关注点拆分，不写超长配置对象

- 不要在一个块里平铺所有属性，尤其是职责跨越多个关注点的配置对象；它难以阅读、难以扩展，也让消费方被迫引入无关内容。
- 反例（超长扁平配置，避免）：

  ```js
  return {
    repositoryRoot,
    dataRoot: resolveConfiguredPath(...),
    webRoot: resolveConfiguredPath(...),
    host: loopbackHost(env.AI_STEWARD_HOST),
    port,
    aiProvider,
    deepSeekModel: ...,
    aiTimeoutMs: ...,
    commandRateLimit: ...,
    // ...十几项平铺在一起
  };
  ```

- 做法：像 Vue 拆分模块一样，**按关注点拆成多个切片**，每个切片只负责自己的一部分并各自解析、导出；消费方按需引入，组合由入口或调用方完成。

  ```text
  src/config/
  ├─ common.mjs       # 仓库根推导 + 校验辅助
  ├─ paths.mjs        # 数据/资源路径 → { dataRoot, webRoot }
  ├─ server.mjs       # 监听地址与端口 → { host, port }
  ├─ ai.mjs           # AI 提供商、模型、密钥与参数 → { aiProvider, ... }
  ├─ rate-limit.mjs   # 限流 → { commandRateLimit, commandRateWindowMs }
  └─ index.mjs        # 汇总入口：重导出各切片，可组合为完整配置
  ```

- 每个切片小而内聚（通常 3~8 个字段），一个文件只承担一个职责。
- 公共基础（路径推导、通用校验）单独放 `common` 类模块，供各切片复用。
- 入口文件（如 `index.mjs`）负责汇总重导出，保持对外 API 稳定；需要完整配置的进程入口可用它组合，普通消费方直接 import 自己需要的切片。

## 4. 避免冗长嵌套三元

- 判断链（如 提供商 → 模型名）不要写成多层嵌套三元，改用**注册表 + 查表函数**。
- 新增选项只需在注册表补一条，调用处（如 server 入口）保持不变。
- 错误提示可基于注册表动态生成，不写死枚举列表。

  ```js
  const AI_PROVIDERS = Object.freeze({
    deepseek: { modelEnv: "DEEPSEEK_MODEL", modelDefault: "deepseek-v4-flash" },
    fixed: null,
  });

  function resolveAiModel(aiProvider, env) {
    const provider = AI_PROVIDERS[aiProvider];
    if (!provider) return null;
    return env[provider.modelEnv] || provider.modelDefault;
  }
  ```

## 5. 避免过度抽象

- 公共包（如 `packages/api-contract`）只保留**两端真正共享**的部分（路径/动作常量）。
- 单侧使用的状态码、错误处理、类型守卫等实现细节留在所在模块（如 Gateway 内部 `http-contract.mjs`），不要塞进公共包。
- 抽取共享模块前先量化消费方：只有一个消费方的内容不算“共享”。

## 验证

- 修改后运行仓库测试：`pnpm test`。
- 交付前复核注释、空行与模块边界，避免文档与实际结构脱节。
