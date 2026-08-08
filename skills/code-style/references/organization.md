# 空行与按关注点拆分

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

对应 SKILL.md「2. 空行」「3. 按关注点拆分，不写超长配置对象」。

## 规范

### 空行

- 按逻辑步骤分段，段间加空行，避免大段代码挤在一起。
- 一段代码只做一件事；不要把“解析 → 校验 → 组装 → 返回”压成连续一行。

### 不写超长配置对象

避免在一个块里平铺大量跨越多个关注点的属性；这种结构难以阅读和扩展，也可能让消费方被迫引入无关内容。规模较小、职责单一且总是整体消费的配置可以保持在一起。

### 按关注点拆切片

当配置包含多个独立关注点、不同部分会分别变化或被不同消费方使用时，按关注点拆成内聚切片；消费方按需引入，组合由入口或调用方完成。

- 根据职责、变化原因和消费方拆分切片，不以字段数量作为硬性标准；不要为了拆分而制造大量只转发一两个值的文件。
- 只有被多个切片实际复用，或已形成稳定边界时，才把路径推导、通用校验等基础逻辑提取到 `common` 类模块。
- 需要稳定统一入口时，可由 `index.mjs` 等入口文件汇总重导出；需要完整配置的进程入口可以组合切片，其他消费方直接引入所需部分。

## 示例

以下代码仅演示"空行分段"与"关注点拆分"的形态，名称、字段与目录均为示意：

```js
export function resolveConfig(options = {}) {
  const { env = process.env } = options;

  // 端口：优先取环境变量，未设置时用默认值，不接受命令行参数。
  const port = env.PORT || 3000;

  // 模式：未显式配置时，按是否提供了密钥自动选择。
  const mode = ...;

  return { ... };
}
```

反例（超长扁平配置，避免）：

```js
return {
  repositoryRoot,
  dataRoot: resolveConfiguredPath(...),
  webRoot: resolveConfiguredPath(...),
  host: resolveHost(...),
  port,
  dbConfig,
  authProvider,
  timeoutMs: ...,
  rateLimit: ...,
  // ...十几项平铺在一起
};
```

按关注点拆分后的目录形态：

```text
src/config/
├─ paths.mjs        # 路径相关 → { dataRoot, webRoot }
├─ server.mjs       # 监听地址与端口 → { host, port }
├─ db.mjs           # 数据库连接 → { url, poolSize }
├─ auth.mjs         # 认证、密钥与参数 → { provider, ... }
├─ rate-limit.mjs   # 限流 → { limit, windowMs }
└─ index.mjs        # 汇总入口：重导出各切片，可组合为完整配置
```
