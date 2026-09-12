# core：公共基础设施

所有测评共用的一切都在这里维护，测评目录（evals/<name>/）只放与该测评相关的内容。

## 组成

| 内容 | 文件 | 说明 |
|------|------|------|
| 模型配置 | `providers.yaml` | 被测模型与裁判（端点、温度、thinking 关闭）。换模型只改这里 |
| 机械断言 | `assertions/*.py` | 可机器判定的检查（如 Unicode 制表符、文字墙），各测评按需在 eval.yaml 的 defaultAsserts 里引用 |
| 脚本 | `scripts/*.cjs` | run（跑测评）/ new-eval（建新测评）/ report（生成报告与 dashboard）/ serve（本地查看服务） |
| 模板 | `template/` | 新测评脚手架，`npm run new -- <名字>` 使用 |

## 基建踩坑备忘（务必读，都是真实代价换来的）

1. **Coding Plan key 走 Anthropic 兼容端点**：`https://open.bigmodel.cn/api/anthropic`（`anthropic:messages:` 前缀的 provider）。标准按量端点 `/api/paas/v4` 会对该 key 报 `1113 余额不足`，且会导致评测无限重试假死。
2. **GLM-5.3 是思考型模型**：不显式 `thinking: {type: disabled}` 时，思考文本会拼进输出，污染所有断言（曾导致 30/30 全部带 "Thinking:" 前缀、整体慢 5 倍）。已间歇性出现过"配置关闭仍有约 1/3 输出泄漏思考文本"的情况，属于待修已知问题；关键判定需人工抽查输出正文。
3. **提示词文件里不能出现 `---` 分隔线**：promptfoo 会把它当作多提示词切分点，把一个文件劈成两半，实验直接作废。用 `=====` 代替。
4. **裁判一次被内容安全过滤拦截**（1301 敏感内容误判）属个例，重跑即恢复。
5. **LLM 裁判在临界用例上会摇摆**：两轮之间单个边界用例翻转属正常，4/6 与 5/6 的差距不要过度解读；可靠的是"某变体必挂/必过"的模式。
6. **缓存**：promptfoo 按内容哈希缓存，未变的提示词×用例组合重跑秒回；只有新增变体真正调 API。
7. **密钥**：API key 放根目录 `.env`（gitignore），运行用 `--env-file .env` 传入。
