# 文档命名与状态

## 命名规则

### 通用规则

- 文件名使用小写英文和短横线；
- Markdown 文件统一使用 `.md`；
- 文件名表达主题，不使用 `new`、`final`、`latest`、`最新版`；
- 版本变化通过 Git 和文档元信息管理，不复制多个版本文件；
- 正文可使用项目主要语言，代码标识符保持原始形式。

推荐：

```text
product-overview.md
api-design.md
data-export.md
```

不推荐：

```text
新建文档.md
最终版开发方案.md
接口设计最新版-v3.md
```

### Spec 编号

功能 Spec 使用三位递增编号：

```text
001-project-initialization.md
002-user-authentication.md
003-data-export.md
```

编号表示创建顺序，不表示优先级。文档废弃后不复用编号。

### 决策编号

决策记录单独编号：

```text
001-use-postgresql.md
002-adopt-event-driven-processing.md
```

Spec 和决策记录分别编号，互不关联。

## 文档元信息与状态

### 推荐格式

产品、架构、Spec、决策和运维文档应在标题后提供简短元信息：

```md
> 状态：Draft
>
> 创建日期：YYYY-MM-DD
>
> 最后更新：YYYY-MM-DD
>
> 负责人：姓名或团队
>
> 关联里程碑：可选
>
> 关联模块：module-name
```

个人项目可以省略负责人。已经使用 Git 管理时，不需要在正文维护完整修改历史。

### 通用状态

| 状态 | 含义 |
| --- | --- |
| `Draft` | 正在讨论，不能直接作为实施依据 |
| `Approved` | 已确认，可以开始实施 |
| `In Progress` | 正在实施 |
| `Completed` | 已实现并通过验收 |
| `Blocked` | 存在阻塞，暂时无法继续 |
| `Active` | 当前持续有效并长期维护 |
| `Deprecated` | 不再推荐使用，但暂时保留 |
| `Superseded` | 已被另一文档或决策替代 |
| `Archived` | 已归档，不再维护 |

### 决策状态

决策记录通常使用：

- `Proposed`：等待确认；
- `Accepted`：已采纳；
- `Rejected`：未采纳；
- `Superseded`：已被新决策替代。
