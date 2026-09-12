# prompt-evaluation：提示词与技能测评系统

用 [promptfoo](https://www.promptfoo.dev) 对提示词和 Agent 技能做 A/B 对比与回归评测。全中文报告，零外部依赖，离线可用。

被测模型 GLM-5.3-Flash，裁判 GLM-5.3（Coding Plan key 走 Anthropic 兼容端点，配置在 `core/providers.yaml`，改模型只动这一处）。

## 快速开始

```bash
cd prompt-evaluation

npm run eval                  # 跑全部测评（或 npm run eval -- code-reading 跑单个）
npm run dashboard             # 打开可视化总览（http://localhost:15600）
```

每次 `npm run eval` 自动完成：跑 promptfoo → 结果存 `results/<测评>/<时间戳>.json` → `history.jsonl` 追加一行台账 → 重新生成全部报告。

不想起服务时，直接双击 `reports/dashboard.html` 也能看（数据内嵌）。

## 目录结构

```
core/               公共基础设施（唯一维护点）
  providers.yaml    模型与裁判配置（端点、温度、thinking 关闭）
  assertions/       通用机械断言（Unicode 制表符、文字墙）
  scripts/          run / new-eval / report / serve
  template/         新测评脚手架
  README.md         基建踩坑备忘（端点、thinking、分隔线等，必读）
evals/              测评项目，一项目一目录，自动发现
  <名字>/
    eval.yaml       元信息：标题、说明、变体标签、全局机械断言
    prompts/        提示词变体（文件名排序 = 变体顺序；正文不能含 --- 分隔线）
    cases/          测试用例，一案例一 YAML（vars + assert）
    README.md       该测评的结论与迭代史
results/<测评>/      运行产物（gitignore，保留全部历史供趋势）
reports/            生成的中文报告与总览（gitignore，随时可再生成）
history.jsonl       入库的运行台账（每行一次运行）
.env                API key（gitignore，禁止提交）
```

## 新增一个测评项目

```bash
npm run new -- my-skill        # 建骨架
# 1. 改 evals/my-skill/eval.yaml（标题、标签数与 prompts/ 文件数一致）
# 2. 写 prompts/*.txt（占位符用 {{request}} {{code}} 等，cases 的 vars 与之对应）
# 3. 写 cases/*.yaml
npm run eval -- my-skill
```

## 现有测评

| 测评 | 内容 | 当前最优 |
|------|------|---------|
| code-reading | 代码阅读指导提示词 v1-v6（文件级 6 案例） | v6 |
| project-reading | 同套提示词的项目级泛化（设计/架构/可读性 3 维度） | v6 |
| code-style | 仓库 code-style 技能三变体测试（6 案例） | 见该测评 README |
| commit-message | write-git-commit-message 提示词（入门示例） | v1/v2 持平 |

各测评的详细结论、失败模式与迭代记录见 `evals/<名字>/README.md`。

## 工作流约定

- **改提示词前先跑基线，改完再跑对比**：`npm run eval -- <测评>`，dashboard 看变体得分变化。
- **黄金集只增不改**：真实使用中发现提示词表现不符预期的场景，固化成新 case 加进 cases/。
- **趋势看 dashboard**，跨机器时 `history.jsonl` 入库保证历史不丢（本地 results 为空时自动回退它重建趋势）。
- LLM 裁判在临界用例上会摇摆（详见 core/README），个例翻转不代表回归，看模式不看单点。
