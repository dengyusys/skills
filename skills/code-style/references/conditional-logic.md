# 避免冗长嵌套三元

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

对应 SKILL.md「4. 避免冗长嵌套三元」。

## 规范

- 判断链不要写成多层嵌套三元，改用**注册表 + 查表函数**。
- 新增选项只需在注册表补一条，调用处保持不变。
- 错误提示可基于注册表动态生成，不写死枚举列表。

## 示例

以下代码仅演示"注册表 + 查表"的形态，名称与数值均为示意：

```js
const PROVIDERS = Object.freeze({
  default: { modelEnv: "DEFAULT_MODEL", modelDefault: "v1" },
  custom: null,
});

function resolveModel(provider, env) {
  const entry = PROVIDERS[provider];
  if (!entry) return null;
  return env[entry.modelEnv] || entry.modelDefault;
}
```

新增提供商时，只需在注册表补一条，查表函数与调用处无需改动。
