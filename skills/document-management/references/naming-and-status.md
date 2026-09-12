# 文档命名与状态

对应 SKILL.md「建文档」「改文档」。

## 命名规则

- 文件名小写英文加短横线。别用 new、final、latest、"最终版"；要翻旧版去 Git 历史，别复制文件。
  反例："接口设计最新版-v3.md"；正例："api-design.md"。
- Spec 和 ADR 各自三位递增编号（001-、002-…）。编号只表示创建顺序，废弃后永不复用。

## 元信息

至少四件套：状态 / 创建日期 / 最后更新 / 关联模块；团队协作再加负责人和关联里程碑。

## 状态含义速查

- `Draft`：讨论中，不能当实施依据；
- `Approved`：定了，可以开工；
- `In Progress`：干着；
- `Completed`：做完且验收过；
- `Blocked`：卡住了；
- `Active`：一直有效、长期维护；
- `Deprecated`：内容过时，暂留；
- `Superseded`：被别的文档或决策明确替代；
- `Archived`：归档不再维护。

ADR 专用：`Proposed`（待确认）/ `Accepted`（已采纳）/ `Rejected`（没采纳）/ `Superseded`。
