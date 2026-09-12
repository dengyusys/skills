# 提示词评测（promptfoo）

用 [promptfoo](https://www.promptfoo.dev) 对技能提示词做 A/B 对比和回归评测。评测配置进版本库，评测在本地运行。

## 目录结构

```
prompt-evaluation/
  promptfooconfig.yaml   # 评测配置：提示词变体 + 模型 + 测试用例 + 断言
  prompts/v1.txt         # 变体一（当前写法的精简版）
  prompts/v2.txt         # 变体二（v1 + 收紧的两条规则）
```

## 快速开始

1. 本地放好密钥：智谱 GLM 的 key 已写在 `prompt-evaluation/.env`（该文件已被 `.gitignore` 忽略，**禁止提交到仓库**）。换其他模型时改 `promptfooconfig.yaml` 的 `providers` 即可。

2. 跑评测并打开网页报告：

   ```bash
   npx promptfoo@latest eval --env-file .env
   npx promptfoo@latest view
   ```

   报告是「提示词 × 测试用例」的对比矩阵，能直接看到两个变体在每条用例上的输出和断言结果。

## 怎么扩展

- **加提示词变体**：在 `prompts/` 下新增文件并加进配置的 `prompts` 列表，例如把某个 SKILL.md 的正文抽出来作为基线。
- **加测试用例**：在 `tests` 里加一组 `vars`（输入）+ `assert`（判断标准）。常用断言：`contains`（包含文本）、`regex`（正则）、`llm-rubric`（自然语言标准，由裁判模型打分）。
- **当回归门禁用**：`npx promptfoo@latest eval --fail-on-error`，断言不过则命令非零退出，可接 CI。
- 完整断言类型见[官方文档](https://www.promptfoo.dev/docs/configuration/expected-outputs/)。
