# 避免冗长嵌套三元

> 本文中的原则与约束属于规范；代码仅用于说明。标识符、目录名、配置键和示例数值应结合当前项目调整，除非正文明确标注为固定要求。

对应 SKILL.md「4. 避免冗长嵌套三元」。

## 规范

- 不写降低可读性的多层嵌套三元。
- 优先选择当前场景中最直接的表达：提前返回、清晰的 `if` / `else`、`switch`、映射表或注册表均可。
- 当条件由稳定键映射到数据、选项会持续扩展且各分支结构一致时，使用**注册表 + 查表函数**。
- 只有两三个简单分支，或每个分支包含明显不同的行为时，不要为了使用注册表而增加间接层。
- 使用注册表时，错误提示可基于注册表动态生成，避免另行维护重复的枚举列表。

## 示例

以下代码仅演示适合使用“注册表 + 查表”的形态，名称与数值均为示意：

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

当新增提供商只需增加同结构配置时，可以只在注册表补一条，让查表函数与调用处保持稳定。
