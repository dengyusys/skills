# 空行与按关注点拆分

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

对应 SKILL.md「2. 空行」「3. 按关注点拆分，不写超长配置对象」。

## 规范

### 空行

- 按逻辑步骤分段，段间加空行，避免大段代码挤在一起。
- 一段代码只做一件事；不要把“解析 → 校验 → 组装 → 返回”压成连续一行。

### 不写超长配置对象

不要在一个块里平铺所有属性，尤其是职责跨越多个关注点的配置对象；它难以阅读、难以扩展，也让消费方被迫引入无关内容。

### 按关注点拆切片

**按关注点拆成多个切片**，每个切片只负责自己的一部分并各自解析、导出；消费方按需引入，组合由入口或调用方完成。

- 每个切片小而内聚（通常 3~8 个字段），一个文件只承担一个职责。
- 公共基础（路径推导、通用校验）单独放 `common` 类模块，供各切片复用。
- 入口文件（如 `index.mjs`）负责汇总重导出，保持对外 API 稳定；需要完整配置的进程入口可用它组合，普通消费方直接 import 自己需要的切片。

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
