# Skills

[![skills.sh](https://skills.sh/b/dengyusys/skills)](https://skills.sh/dengyusys/skills)

个人的 Agent Skills 源仓库（skills.sh 生态）。所有技能在此单点维护，通过 `npx skills` 分发到各项目。

## 技能列表

| 技能 | 说明 | 安装项目 |
| ---- | ---- | -------- |
| `code-style` | 代码怎么写、注释怎么注，风格统一 | ai-steward-a, template-desktop |
| `write-git-commit-message` | 生成/改写/校验 Git 提交信息 | ai-steward-a, template-desktop |
| `document-management` | 软件项目文档治理 | template-desktop |

## 目录结构

```
skills/
  <skill-name>/
    SKILL.md          # 必须：frontmatter 含 name 和 description
    references/       # 可选：参考文档
    assets/           # 可选：模板/素材
    scripts/          # 可选：辅助脚本
```

## 安装

在目标项目根目录执行（项目级，写入 `.agents/skills/`）：

```bash
# 安装全部技能
npx skills add dengyusys/skills

# 按需安装
npx skills add dengyusys/skills --skill code-style --skill write-git-commit-message

# 先查看仓库里有哪些技能（不安装）
npx skills add dengyusys/skills --list
```

全局安装（所有项目自动可用）：

```bash
npx skills add dengyusys/skills -g --skill code-style --skill write-git-commit-message
```

## 更新流程

1. 在本仓库编辑技能内容
2. 提交并推送：`git add . && git commit -m "..." && git push`
3. 在目标项目执行 `npx skills update`（或全局 `npx skills update -g`）

## 维护约定

- 技能命名：小写字母 + 连字符
- 每个技能必须包含 `SKILL.md`，frontmatter 含 `name` 和 `description`
- `description` 面向通用场景，说明"何时使用"，不要硬编码项目名
- 项目专属技能不入库（如 ai-steward-a 的 schedule-calendar）
- 行尾统一 LF，UTF-8 编码（见 `.editorconfig`）

## 新增技能流程

1. 在 `skills/` 下新建 `<skill-name>/SKILL.md`（参考 `npx skills init`）
2. 需要的话补充 `references/`、`assets/`、`scripts/`
3. 验证发现：`npx skills add . --list` 能看到新技能
4. 提交推送后，在目标项目 `npx skills update` 生效
