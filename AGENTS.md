# AGENTS.md

本文件供 AI 助手在 `skills` 仓库中工作时参考，确保技能维护符合仓库约定。

## 仓库定位

- 本仓库是**个人 Agent Skills 源仓库**（skills.sh 生态），通过 `npx skills` 分发到各项目。
- 单点维护：技能只在本仓库编辑，项目侧通过 `npx skills update` 同步。

## 技能结构

```
skills/
  <skill-name>/
    SKILL.md          # 必须
    references/       # 可选：参考文档
    assets/           # 可选：模板/素材
    scripts/          # 可选：辅助脚本
```

每个 `SKILL.md` 必须：

- frontmatter 含 `name`（小写字母 + 连字符）和 `description`
- `description` 面向通用场景，说明"何时使用"，**不要硬编码项目名**
- 正文用中文撰写

## 通用约定

- 行尾 LF，UTF-8 编码，末尾空行（`.editorconfig` 已配置，遵循即可）
- 项目专属技能不入库（如 ai-steward-a 的 schedule-calendar）
- 技能应泛化为"个人通用"定位，避免绑定某个具体仓库结构

## 实验与正式区工作流

- 提示词与技能的迭代实验在 `prompt-evaluation/`（评测区）进行：规则修改先做成变体提示词跑验证，候选文本以提案（PROPOSAL.md）形式记录
- 修改 `skills/` 前必须先请用户审阅候选文本，经确认后才落地；不得在评测后直接修改技能本体
- `git commit` 仅在用户明确要求时执行，不得自行提交

## 修改技能

1. 只编辑 `skills/<name>/` 下的文件，不触碰项目侧副本
2. 编辑后验证发现正常：

   ```powershell
   npx skills add . --list
   ```

3. 确认列出的 `description` 展示无误（无乱码、无硬编码项目名）

## 新增技能

1. `npx skills init <skill-name>` 生成骨架，或手动新建 `skills/<name>/SKILL.md`
2. 需要时补充 `references/`、`assets/`、`scripts/`
3. 用 `npx skills add . --list` 验证可发现
4. 提交信息遵循仓库历史风格（见 `write-git-commit-message` 技能）

## 发布与同步

- 编辑完成并经用户确认提交后，执行 `git add . && git commit -m "..."` → `git push`
- 推送后，各项目执行 `npx skills update` 生效（本仓库不做项目侧操作）
