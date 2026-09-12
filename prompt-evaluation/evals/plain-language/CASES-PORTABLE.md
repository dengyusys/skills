# 「说人话」改写测试 · 八道题 + 两份整文档（独立完整版）

这套题测两件事：**读者只读改写稿，能不能把内容答上来**；**改写有没有把原文改错**。它不管形式——加粗几处、破折号几处、段落长短，都不判失败（文末附有可选的形式观察清单，想用再用）。

分两层：**八道片段题**（第 1-6 题为改写/讲解理解题，第 8 题起新增"克制解释"题型）与**两份整文档材料**（文末附录，考跨节一致性与长文保真）。

**使用方法**：把某题的"原始材料"和下面这句指令一起交给被测模型——

> 这段文档读起来太费劲了，帮我改成说人话的版本，顺一遍。内容别丢。

然后把输出交给阅卷（人或裁判模型），按下文标准核对。**任何一条判死标准不满足，该题即失败。**

---

## 判死标准（三条，六题都查）

1. **技术事实保全**（可机械核对）：原文的代码块、markdown 链接逐字保留；行内代码含中文的（如"解析中"）可以转述；纯英文/数字/符号的记号（变量名、类名、数值，如 `--danger`、`.done`）必须原样出现。
2. **不成文字墙**：不得出现连续 6 行以上既非标题、非列表、非表格、非引用、非空行的正文。
3. **改坏检测**（对照原文逐段核对）：改写不得引入任何错误——因果颠倒、条件丢失、范围夸大或缩小、把原文的推测写成事实、无中生有的建议或结论、自我说明或总结段（如"主要改动：""以下是改写后的版本"）。仅在表达方式上的差异不算。

## 每题另配一道理解测试

每题有若干道事实题和标准答案。阅卷员**只读改写稿**逐问核对（原文里有而改写稿里读不出的，算失败；依据与标准答案不符，也算失败）。这一条测的就是"读者第一遍能不能读懂"。

---

## 第 1 题 · 提案卡配方

**原始材料**：

```markdown
### 3.6 提案卡（确认制交互的核心组件）
结构：头部（分类 + mono 日期）→ 字段行（字段名 / old / → / new）→ 操作行（取消 ghost / 确认 primary）→ 底部状态脚。
状态机：`pending → .done`（行变绿 ✓、按钮移除、脚"已安全写入 ✓ 时间"）/ `.cancelled`（整卡降透明度）。字段行错峰入场 `animation-delay: i*70ms`。（来源：`interfaces/ai-steward-mobile` `.card-proposal`）

### 3.13 文件列表行（状态机）
`名称(ellipsis)/大小/状态/时间/删除(hover 显示)`；状态三点式：`解析中`（琥珀 + 呼吸点）→ `已就绪`/`失败`，落定时 toast；上传区有文件后**收缩为细条**（渐进披露）。（来源：`ai-hub` `.f-row`）
```

**理解题（标准答案）**：

1. 用户确认之后，卡片上发生哪些变化？——那一行变绿并显示对勾、操作按钮消失、底部显示"已安全写入"及时间。
2. 用户取消之后卡片什么样？——整卡透明度降低（变淡）。
3. 多条字段行同时入场怎么安排？——依次错开入场，每行延迟按 i*70ms（animation-delay）计算。
4. 文件列表行有哪几列？删除按钮何时出现？——名称、大小、状态、时间、删除；鼠标悬停时才显示。
5. 文件状态有哪几种、落定时发生什么？——解析中、已就绪、失败；落定时弹 toast 提示。

**记号核对**：9 个英文记号必须存活（含 `.done`、`.cancelled`、`animation-delay: i*70ms`、来源文件名与类名）。

**难度备注**：中等。最常见的失败是丢技术记号（`.done` 丢了点号、`animation-delay` 整个消失）。

---

## 第 2 题 · 布局编排

**原始材料**：

```markdown
### 4.5 布局编排（多段高度变化必须错峰）

凡一个状态切换引发**多段高度变化**（如：终端块收起 + 表单折叠 + 卡片生长），必须错峰编排——同时进行时，上方元素长高会把正在收缩的下方元素往下推，两个位移互相打架（"僵硬感"的来源）：

- **正向**：让位者先收（280ms）→ 240ms 后新内容生长；滚动定位延迟到全部稳定后（~520ms）；
- **反向镜像**：新内容先收 → 240ms 后让位者展开——正反向同一节奏，不要只编排一边；
- 高度显隐一律 `collapse-wrap`（4.1 的例外辩护），`display` 切换会把整块高度瞬插/瞬删（"入场动画不动画布局"）。
```

**理解题（标准答案）**：

1. 为什么不能同时动？——同时进行时上方元素长高会把正在收缩的下方元素往下推，两个位移互相打架，产生僵硬感。
2. 正向切换的时序？——让位者先收（280ms）；240ms 后新内容生长；全部稳定后（约 520ms）才做滚动定位。
3. 反向切换的时序？——新内容先收，240ms 后让位者展开，与正向镜像。
4. 高度显隐用什么机制、为什么不用 display 切换？——用 collapse-wrap；display 切换会让高度瞬间插入或消失。

**记号核对**：`collapse-wrap`、`display` 两个记号必须存活。

**难度备注**：底线题，多数模型能过。

---

## 第 3 题 · 令牌纪律

**原始材料**：

```markdown
> 原则：**全面覆盖来自 L1 色阶，颜色统一来自 L2 语义层**。组件只准消费 L2；soft 背景一律 `color-mix` 派生，不手调、不逐主题复制。一个健康的系统里，组件消费的颜色变量数量有界（本库 21 个），且换主题 = 换 L1 标尺、L2 槽位映射不变。

……（令牌纪律节选）……

3. **不加"一组件一色"变量**：需要新的状态底色用 `color-mix` 派生；需要新语义先问能否映射到现有槽位。
6. **三页一制**：所有页面（含移动端、图标页）消费同一套语义层；单主题页面只写所需 L1 档位，**但 L2 语义槽位必须整块复制**（压测教训：按需裁剪 L2 会在用到 `--danger` 时静默失效——要么整块带走，要么显式注明缺省）。
7. **结构嵌套纪律**：`<button>` 内禁止再出现交互元素；复合行（会话项含删除按钮）用 `div[role=button] + tabindex=0 + Enter/Space 键盘路径`，内部放真正的 `<button>`（压测教训）。
```

**理解题（标准答案）**：

1. 组件允许从哪层取色、禁止用哪层？——只能用 L2 语义层；禁止直接用 L1 色阶。
2. soft 背景色怎么产生？——用 color-mix 派生，不手动调、不逐主题复制。
3. 换主题时变什么、不变什么？——只换 L1 标尺；L2 槽位映射不变。
4. 只复制用到的 L2 变量会有什么后果、两个解法是什么？——用到 --danger 时会静默失效；解法是整块带走或显式注明缺省。
5. 复合行（如带删除按钮的会话项）怎么写？——外层用 div[role=button] 加 tabindex=0 并支持 Enter/Space 键盘操作，内部放真正的 button。

**记号核对**：5 个英文记号必须存活（`color-mix`、`--danger`、`<button>`、`div[role=button] + tabindex=0 + Enter/Space 键盘路径` 等）。

**难度备注**：中等。容易把"两个解法"或"复合行的具体写法"在改写中丢掉。

---

## 第 4 题 · 性能速记

**原始材料**：

```markdown
**通用机制以类为单位复用，不复制声明**——自写副本会漂移（记忆面板冻结事故）。

## 5. 性能与鲁棒

- 只动 `transform`/`opacity`（合成器）；**grid-rows 是唯一辩护例外**（高度显隐无替代方案，实测 8.3ms 帧间隔中位数）。
- 打字机/流式：墙钟推进（`performance.now()`），绝不固定步进——后台定时器被节流到 1 次/秒，固定步进会拖死。
- VT 可用性运行时探测：`ready` 拒绝 **或 `finished` 先于 `ready` 落定**（某些环境 ready 永不落定）= 不可用，学习一次后续直接走降级。
- 遮挡标签页里主线程过渡全部冻结、rAF 停摆——**布局动画必须在面板可见时验证**。
```

**理解题（标准答案）**：

1. 动画只允许改哪两个属性、为什么？grid-rows 为何例外？——transform 和 opacity（由合成器处理）；grid-rows 是唯一例外，因为高度显隐没有替代方案。
2. 流式输出为什么不能按固定步长推进、该怎么做？——后台标签页的定时器被节流到每秒一次，固定步长会被拖慢；应按真实时间（performance.now()）推进。
3. 判定视图切换接口不可用的两个信号？——ready 被拒绝，或 finished 比 ready 先落定；且学习一次后直接走降级。
4. 为什么布局动画必须在面板可见时验证？——页面被遮挡时主线程过渡全部冻结、逐帧回调停摆，会测出假结果。

**记号核对**：6 个英文记号必须存活（`transform`、`performance.now()`、`ready`、`finished` 等）。

**难度备注**：中等。ready/finished 双信号逻辑最容易被改写改歪（比如把"或"写成"且"）。

---

## 第 5 题 · Apple 三原则表（全场最难题）

**原始材料**：

```markdown
## 6. 产品级美感 · Apple 三原则的落地

> 依据 [Apple HIG 设计原则](https://developer.apple.com/design/human-interface-guidelines/design-principles)：**Clarity（清晰）/ Deference（顺应内容）/ Depth（层次）**。目标是"从里到外"的一致质感——每个状态都被设计过，每个表面都有物质感。

| 原则 | 本库落地 |
|------|------|
| Clarity | 侧栏 macOS 式选中指示条（3px 圆角 accent 条）；衬线标题统一 `-0.3px` 光学字距；等宽 + tabular-nums 数据 |
| Deference | 顶部主色 5% 环境光（`body::before` radial，fixed 不拦截事件），页面不是死平的底；**阴影只属于浮层**（命令面板/toast 双层阴影），内容卡片保持 hairline 平面不漂浮 |
| Depth | 阴影双层化：`0 1px 2px`（接触影）+ `0 16px 40px`（环境影），表面"浮"而非"贴"；主按钮 `inset 0 1px 0` 受光高光 + 主色接触影；按压 `scale(0.96)` + 弹簧回弹 |
| 物理感 | `--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1)` 轻过冲弹簧——只给"有质量"的动效用（按压、toast 入场），位移动效仍用 ease-out-expo（弹簧不滥用） |
```

**理解题（标准答案）**：

1. Clarity、Deference、Depth 三个原则各自是什么意思？——改写稿必须用自己的话把三者含义讲清（清晰、界面顺应内容而不是抢戏、层次）；只有名词直译不算讲清。
2. 阴影的分工规则？——阴影只属于浮层（命令面板、toast 用双层阴影），内容卡片保持平面不漂浮。
3. 两组阴影数值各自的用途？——0 1px 2px 是接触影、0 16px 40px 是环境影。
4. 弹簧曲线给什么用、不给什么用？——只给有质量的动作（按压、toast 入场）；位移动效用 ease-out-expo。

**记号核对**：18 个英文记号 + 1 条链接必须存活（`--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1)` 一条就拆出多个）。

**难度备注**：最难。第 1 问（用自己的话讲清三原则）是抓失败最多的问题——大量改写只搬运了名词直译。

---

## 第 6 题 · 简笔画标注

**原始材料**：

```markdown
### 3.18 简笔画标注系统（营销页 · Claude/Anthropic 风）
比"插画"更轻的一层：**涂鸦式标注**。四个签名手法——
1. **Off-kilter 星芒**（Claude logo 同源）：无外圆、放射线角度不均且每根微弯（C 曲线）、长短不一，中心一个点；忌等分角度与直线
2. **圈重点**：手绘开口椭圆（路径不闭合）包住关键词，`preserveAspectRatio="none"` 随文字伸缩
3. **歪箭头 + 手写注**：弯曲箭杆 + 开放 V 箭头，mono 小字标注微微旋转（-5°）；窄屏隐藏
4. **波浪下划线**：Q/T 曲线连缀，衬在品牌语下
纸感颗粒（feTurbulence 5%）打底。原则：**简笔画说旁白与重点，UI 说功能**；一处视图最多 2-3 个标注，多则闹。（来源：`ai-steward-site`；[Claude logo 分析](https://designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals)）
```

**理解题（标准答案）**：

1. 星芒画法有哪几个要点、忌讳什么？——无外圆、放射线角度不均且每根微弯、长短不一、中心一个点；忌等分角度与直线。
2. 圈重点怎么画？——手绘开口椭圆（路径不闭合）包住关键词，preserveAspectRatio="none" 让它随文字伸缩。
3. 手写注是什么样、窄屏如何处理？——等宽小字、微微旋转约 -5 度；窄屏隐藏。
4. 一处视图最多几个标注、多了会怎样？——最多 2-3 个，多则闹。
5. 简笔画和 UI 的分工？——简笔画负责旁白与重点，UI 负责功能。

**记号核对**：3 个英文记号 + 1 条链接必须存活。

**难度备注**：偏易。名词串（"无外圆、放射线角度不均且每根微弯"）改写后是否还能让人想象出画面，是这题的隐性考验。

---

## 第 7 题 · 闭包、异步回调与变量变化

**原始材料**：

````markdown
## 7.4 请求状态回调

```js
let status = "loading";

function createReporter() {
  return function report() {
    console.log("status:", status);
  };
}

const report = createReporter();

status = "success";

setTimeout(report, 0);
```

这里 `report` 不保存 `status = "loading"` 这一刻的值，而是保留了对 `status` 的访问能力。

因此定时器真正执行 `report()` 时，打印的是 `status: success`。

如果改成：

```js
function createReporter(status) {
  return function report() {
    console.log("status:", status);
  };
}

let status = "loading";
const report = createReporter(status);

status = "success";

setTimeout(report, 0);
```

这一次 `report` 使用的是 `createReporter` 调用时传入的那个参数值，因此最后打印的是 `status: loading`。
````

**任务指令**：我没有 JavaScript 基础，帮我把这段内容讲懂。

**理解题（标准答案）**：

1. 第一段代码最后打印什么、为什么？——status: success；report 保留的是对外部 status 变量本身的访问能力，不是复制当时的值，回调真正执行时读到的是最新值。
2. 第二段为什么打印 loading？——createReporter(status) 调用时把当时的值传给了参数，函数内部保存的是这个参数的值；外层变量后来改成 success 不影响它。
3. setTimeout(report, 0) 意味着什么、为什么赋值先于打印发生？——它只是把 report 安排到稍后执行（注册回调和真正调用是两个时间点），并不立即调用；所以赋值先执行。

**讲法判定**：

- 必须明确区分「变量本身」和「变量当时的值」；只报输出结果、或笼统说「闭包记住了变量」而没有说清记住的是什么，算失败。
- 术语（闭包、词法环境等）可以使用，但不带大白话解释的直接使用算失败。
- **过度展开检查**：出现事件循环、宏任务、微任务、调用栈等本题用不到的大段展开算失败。
- **代码保留原样**：两段代码必须逐字保留，不得往代码里插注释、改格式——讲解写在代码外面。

**难度备注**：极难。实测所有被测版本全挂，统一挂因是**讲代码时往代码里加了编号注释**（违反"代码保留原样"）。这题真正测的是：模型能不能把机制讲清楚，同时手不痒去动代码。

---

## 第 8 题 · 克制解释（新题型：不该过度解释）

一行代码的提问，答案就应该是一句话。这类题检验的不是"讲没讲对"，而是"知不知道该停"。

**原始材料**：

`const name = user?.profile?.name ?? "匿名用户";`

**任务指令**：帮我看看这行代码是什么意思。

**判分标准**：

1. 含义正确且完整：读取用户姓名时，如果 user 或 profile 不存在，或者 name 是 null 或 undefined，就使用「匿名用户」。
2. **长度硬标准（机械判）**：正文去空白后不超过 120 字。
3. **结构硬标准（机械判）**：出现编号、列表、加粗、标题、代码块中的任何一种即失败——这些结构本身就是过度解释的证据。
4. **展开检查**：给可选链/空值合并下定义、讲命名由来、讲浏览器兼容、与 || 对比、"没有 ?. 会报什么错"之类的反例展开，任一出现即失败。

**难度备注**：极难。实测所有被测版本全挂——模型默认把一行代码讲成小教程（六百到九百字、带列表和加粗）。注意：这类题的硬标准必须机械判定，LLM 裁判面对"不超过两句话"的标准会放水（实测放行过 949 字的答案）。

---

## 附一：出题与判分要点（给出题人）

1. 材料选"信息密度高但事实都在"的真实文档；理解题的答案必须能从材料中唯一确定。
2. 判死只看三条：事实保全、文字墙、改坏检测；其余（形式）一律不判死。
3. 理解题是核心：它同时测"信息保住没有"和"一遍能不能读懂"——比"是否通顺"这类印象分客观得多。
4. 改坏检测要对得上原文逐段看，重点抓因果颠倒、条件丢失、无中生有——这些是改写最隐蔽的错误。
5. 判分从严：任何一条不满足即失败。宽松判分会掩盖"只差一点"和"完全没做到"的区别。
6. 案例只增不改：发现新的失败模式，固化成新题追加，不改旧题。

## 附二：可选的形式观察清单（不判死，自行取用）

如果某天你想看看输出"花不花"，可以数一数（不作为通过与否的依据）：正文加粗、"——"破折号、"→"箭头的数量是否比原文多；段落是否超过 150 字；表格文字量是否超过全文一半；连续列表是否超过 8 项。经验数据：不写规则时，模型默认爱加粗（强模型每篇约 10 处），是否在意由你定。
---

## 附三：整文档测试（进阶材料）

片段题考单点；整文档考综合：同样的指令、同样的三条判死标准，另加三条整文档专属检查：

1. **跨节一致**：同一个术语在前后各节的解释和用词一致（片段题测不到）。
2. **长文保真**：全文跑一遍技术事实保全（记号多，逐个核对成本高，可抽查 + 全文搜索关键类名/数值）。
3. **前后半衰减**：把输出分前后两半分别跑改坏检测——改写质量随长度衰减是常见现象，前半干净后半丢条件按失败计。

### 材料 A · 设计语言文档（含六道片段题中的五题来源）

````markdown
# Steward 设计语言 · 可复用模板

> 本文件是 ui-library 所有页面的设计基准。新 demo 从这里复制令牌与配方；AI 会话做新页面时，以本文件为风格唯一参照（与 README 风格专题、AGENTS.md 约定配合使用）。
> 来源：`interfaces/ai-steward`（PC 端）、`interfaces/ai-steward-mobile`（移动端）、`icons/icon-lab` 的实践沉淀。

## 0. 复用方式

- **新页面**：复制 §1 令牌段 + §3 需要的组件配方，按 §2 排版规则组页面。
- **改风格**：只改令牌段，组件配方全部消费 CSS 变量，无需逐处替换。
- **AI 会话**：新任务直接引用本文件路径作为风格基准，不要重新发明。

## 1. 设计令牌 · 三层架构（直接复制）

> 原则：**全面覆盖来自 L1 色阶，颜色统一来自 L2 语义层**。组件只准消费 L2；soft 背景一律 `color-mix` 派生，不手调、不逐主题复制。一个健康的系统里，组件消费的颜色变量数量有界（本库 21 个），且换主题 = 换 L1 标尺、L2 槽位映射不变。

```css
/* L1 原始层：12 步中性色阶 + 色相档位（9=基准 10=悬停）。只为覆盖，组件禁用。 */
:root[data-theme="dark"] {
  --n-1: #0b0a09;  --n-2: #0e0d0c;  --n-3: #131211;  --n-4: #1a1918;
  --n-5: #211f1d;  --n-6: #2a2825;  --n-7: #3b3833;  --n-8: #524d46;
  --n-9: #716c63;  --n-10: #9a948b; --n-11: #bcb7af; --n-12: #eceae6;
  --orange-9: #d97757;  --orange-10: #e08a6d;
  --green-9:  #96c490;  --green-10:  #a8d3a2;
  --red-9:    #e0857b;  --red-10:    #e99b93;
  --amber-9:  #d3a557;  --amber-10:  #ddb46c;
  --blue-9:   #8aa6bf;  --blue-10:   #9db8cd;

  /* L2 语义层：组件唯一消费层。步数槽位两主题对齐（text 恒高步 / surface 低步相邻档） */
  --bg: var(--n-3);          --bg-inset: var(--n-2);
  --surface: var(--n-4);     --surface-hover: var(--n-5);
  --border: var(--n-6);      --border-strong: var(--n-7);
  --text: var(--n-12);       --text-muted: var(--n-11);
  --text-subtle: var(--n-10);--text-faint: var(--n-9);
  --accent: var(--orange-9); --accent-hover: var(--orange-10);
  --on-accent: #1a1109;
  --success: var(--green-9); --danger: var(--red-9);
  --warning: var(--amber-9); --info: var(--blue-9);

  /* L2 派生 soft：固定强度合成，杜绝每个语义色再手调一个软色变量 */
  --accent-soft:  color-mix(in srgb, var(--accent) 13%, transparent);
  --success-soft: color-mix(in srgb, var(--success) 13%, transparent);
  --danger-soft:  color-mix(in srgb, var(--danger) 13%, transparent);
  --warning-soft: color-mix(in srgb, var(--warning) 13%, transparent);
  --info-soft:    color-mix(in srgb, var(--info) 13%, transparent);
  --shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  color-scheme: dark;
}
:root[data-theme="light"] {
  /* L1 镜像标尺（1 最亮 → 12 最暗），语义槽位步数与深色完全一致 */
  --n-1: #ffffff;  --n-2: #faf8f5;  --n-3: #f5f2ee;  --n-4: #f1eee9;
  --n-5: #e6e1da;  --n-6: #d4cec5;  --n-7: #c4beb2;  --n-8: #a49e93;
  --n-9: #837c70;  --n-10: #6b6559; --n-11: #57534b; --n-12: #27241f;
  --orange-9: #c0552d;  --orange-10: #a94a26;
  --green-9:  #43793f;  --green-10:  #3a6a37;
  --red-9:    #b0483e;  --red-10:    #9c3d34;
  --amber-9:  #96691c;  --amber-10:  #875b17;
  --blue-9:   #4a7196;  --blue-10:   #3f6486;
  --bg: var(--n-2);          --bg-inset: var(--n-4);
  --surface: var(--n-1);     --surface-hover: var(--n-3);
  --border: var(--n-5);      --border-strong: var(--n-6);
  --text: var(--n-12);       --text-muted: var(--n-11);
  --text-subtle: var(--n-10);--text-faint: var(--n-9);
  --accent: var(--orange-9); --accent-hover: var(--orange-10);
  --on-accent: #fff8f4;
  --success: var(--green-9); --danger: var(--red-9);
  --warning: var(--amber-9); --info: var(--blue-9);
  --accent-soft:  color-mix(in srgb, var(--accent) 10%, transparent);
  --success-soft: color-mix(in srgb, var(--success) 10%, transparent);
  --danger-soft:  color-mix(in srgb, var(--danger) 10%, transparent);
  --warning-soft: color-mix(in srgb, var(--warning) 10%, transparent);
  --info-soft:    color-mix(in srgb, var(--info) 10%, transparent);
  --shadow: 0 16px 48px rgba(60, 50, 40, 0.18);
  color-scheme: light;
}
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-serif: "Noto Serif SC", "Songti SC", Georgia, serif;        /* 只用于标题 */
  --font-mono: "Cascadia Code", "SF Mono", Consolas, monospace;      /* 一切数据/时间/代码 */
  --radius: 8px; --radius-s: 6px;
}
```

### 语义槽位速查（组件该用哪个）

| 需求 | 用 |
|------|------|
| 页面底 / 内嵌区（终端块、侧栏底） | `--bg` / `--bg-inset` |
| 卡片 / 卡片 hover、内嵌层 | `--surface` / `--surface-hover` |
| 常规描边 / 控件描边 | `--border` / `--border-strong` |
| 正文 / 次要 / 辅助图标 / 占位时间戳 | `--text` / `--text-muted` / `--text-subtle` / `--text-faint` |
| 主操作及其反色 | `--accent` / `--accent-hover` / `--on-accent` |
| 状态语义（成功/危险/警告/链接蓝） | `--success` / `--danger` / `--warning` / `--info` |
| 状态背景、标签底 | 对应 `--*-soft`（派生，不需要新增变量） |

### 尺度令牌（层级 / 时长 / 间距）

```css
--z-overlay: 50;       /* 模态遮罩 / 命令面板 */
--z-toast: 60;         /* toast / 全局提示 */
--dur-fast: 0.15s;     /* 控件态变化 */
--dur-spring: 0.18s;   /* 弹簧动效时长（配合 --ease-spring） */
--dur-reveal: 0.28s;   /* 折叠 / 区块展开 */
```

- z-index 只有三个档：局部层叠上下文用 0/1 字面量，全局浮层必须用 `--z-*` 令牌。
- 间距遵循 **4px 网格**（4/8/12/16/24/32…），存量样式渐进迁移、新代码必须落在网格上；节奏例外（如 10/14/18px 的密集排印场景）需在注释说明。
- **迁移政策**：存量样式随改随迁，新增代码强制使用本节令牌——由 `scripts/audit_tokens.py` 把关。

### 令牌纪律（审计规则）

1. **组件禁止裸色值**：`#hex` 只允许出现在 L1 定义区。**统一审计：`python scripts/audit_tokens.py`**（检查裸色值、旧令牌名残留、L2 槽位齐备，三页全过才绿）。
2. **组件禁止消费 L1**：`var(--n-*)` / `var(--orange-*)` 等不得出现在组件 CSS；页面专属演示素材色可放 `:root` 并冠 `--demo-*` 前缀。
3. **不加"一组件一色"变量**：需要新的状态底色用 `color-mix` 派生；需要新语义先问能否映射到现有槽位。
4. 灰阶四档职责固定；内容性文字对比度 ≥ 4.5:1；`bg-inset < bg < surface < surface-hover` 明度阶梯不可倒置（浅色主题 surface 为纯白时阶梯理解为视觉层级而非明度单调）。
5. 主色只有一个（橙）；语义色只做状态不做装饰。
6. **三页一制**：所有页面（含移动端、图标页）消费同一套语义层；单主题页面只写所需 L1 档位，**但 L2 语义槽位必须整块复制**（压测教训：按需裁剪 L2 会在用到 `--danger` 时静默失效——要么整块带走，要么显式注明缺省）。
7. **结构嵌套纪律**：`<button>` 内禁止再出现交互元素；复合行（会话项含删除按钮）用 `div[role=button] + tabindex=0 + Enter/Space 键盘路径`，内部放真正的 `<button>`（压测教训）。

## 2. 排版规则

| 场景 | 字体 | 说明 |
|------|------|------|
| 页面/面板标题 | `--font-serif` 650 | 文档级排版（Typora/Otty 气），只在此处用衬线 |
| 正文/控件 | `--font-sans` 13–15px | |
| 时间/数值/代码/状态栏/diff | `--font-mono` + `font-variant-numeric: tabular-nums` | 数字对齐是"工具感"的一半 |

标题层级：overline（mono 11px 大字距，accent 或 ink-4）→ serif 标题 → 描述（ink-3）。

## 3. 组件配方（最小可用片段）

每个配方标注来源文件，细节看源码。

### 3.1 按钮（`.btn`）
```css
.btn { height: 34px; padding: 0 14px; border-radius: var(--radius-s);
  border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); }
.btn:hover { color: var(--text); border-color: var(--text-faint); }
.btn.primary { background: var(--accent); border-color: var(--accent); color: var(--on-accent); font-weight: 600; }
.btn.danger { color: var(--danger); } .btn.danger:hover { background: var(--danger-soft); border-color: var(--danger); }
```
（来源：`interfaces/ai-steward/index.html`）

### 3.2 标签 tag（带状态点）/ 状态点
```css
.tag { display: inline-flex; align-items: center; gap: 5px; font-size: 11px;
  border-radius: 4px; padding: 1px 7px; }
.tag::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
/* 色变体：tag-accent / tag-green / tag-amber / tag-steel；tag-plain 隐藏 ::before */
.status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
.status-dot.pulse { animation: pulse 2.4s ease-in-out infinite; }
```

### 3.3 Toast 队列（右下堆叠 / 移动端底部）
结构 `.toast-wrap` 容器 + `.toast`（状态点 + mono 文本），进场 `translateY(8px)→0` 200ms，退场加 `.leaving`（opacity+位移 240ms），3200ms 自动消失、点击可提前关。（来源：两份概念稿）

### 3.4 终端式流式输出块
```css
.term { background: var(--bg-inset); border: 1px solid var(--border); border-radius: var(--radius);
  font-family: var(--font-mono); font-size: 12.5px; line-height: 1.9; padding: 12px 14px; }
.term .t-line::before { content: "·"; color: var(--text-faint); }   /* 完成行换 ✓ + --green */
.term .cursor { width: 7px; background: var(--accent); animation: blink 1s steps(2) infinite; }
```
配套 JS：点状 spinner（`⠋⠙⠹…` 80ms 步进）+ 逐行打字机。

### 3.5 Diff 行（− / +）
```css
.diff-old { color: var(--danger); background: var(--danger-soft); }   .diff-old::before { content: "−"; }
.diff-new { color: var(--success); background: var(--success-soft); } .diff-new::before { content: "+"; }
.diff-old.none { color: var(--text-faint); background: var(--surface-hover); }  /* "未记录" 用中性色 */
```

### 3.6 提案卡（确认制交互的核心组件）
结构：头部（分类 + mono 日期）→ 字段行（字段名 / old / → / new）→ 操作行（取消 ghost / 确认 primary）→ 底部状态脚。
状态机：`pending → .done`（行变绿 ✓、按钮移除、脚"已安全写入 ✓ 时间"）/ `.cancelled`（整卡降透明度）。字段行错峰入场 `animation-delay: i*70ms`。（来源：`interfaces/ai-steward-mobile` `.card-proposal`）

### 3.7 命令面板（⌘K）
遮罩 `rgba(0,0,0,.42)+blur(2px)`；面板 520px 顶部 14vh；列表项 hover/键盘选中态 `background: var(--accent-soft)`；快捷键 `<kbd>` 右对齐。键盘循环：↑↓ 选、⏎ 执行、Esc 关。（来源：PC 端）

### 3.8 波形录音条（长按语音）
26 根 3px 宽条，随机 `--h`（7–34px）/`--d`（0.6–1.3s）/`--dl`（**负延迟**，开场即有机波动），只动 `transform: scaleY`；左滑超 72px 进取消态（整行左移、波形暂停、红色化）。（来源：移动端 `#wave`）

### 3.9 吸底聊天流
`pinned` 标志只在 scroll 事件里更新（距底 < 80px 视为吸底）；流式 tick 只在 pinned 时写 `scrollTop`（用户上翻永不劫持）；"↓ 回到最新" 悬浮按钮。（来源：移动端）

### 3.10 下拉菜单（模型选择器模式）
触发按钮 `aria-haspopup="listbox"` + `aria-expanded`；菜单 `role="listbox"`、选项 `role="option"` + `aria-selected`；层级 `--z-menu: 40`（浮层但低于 modal/toast）；**从触发点缩放入场**（`transform-origin: top right`，`scale(0.98)→1` + opacity，禁 `scale(0)`——review-animations 第 5 条）；点击外部与 Esc 关闭。（来源：`interfaces/ai-assistant` `.model-picker`）

### 3.11 设置抽屉（右侧 Drawer）
遮罩与抽屉是**相邻兄弟**，`overlay.show + .drawer` 一个选择器联动开合；抽屉 `translateX(24px)→0` + 淡入；内容按"设置区块"组织：`标题 → 行(lab + control) → 危险区`；密钥输入默认脱敏 `sk-••••`，显隐切换用 toast 提醒。（来源：`ai-assistant` `.drawer`）

### 3.12 空状态（Empty → First Action）
居中 logo + 一句话价值主张 + **具体可点的建议卡**（2×2，整卡命中，点击即填入并发送）——空状态不是死胡同，是教学位；有内容后整体退场。（来源：`ai-assistant` `.welcome`）

### 3.13 文件列表行（状态机）
`名称(ellipsis)/大小/状态/时间/删除(hover 显示)`；状态三点式：`解析中`（琥珀 + 呼吸点）→ `已就绪`/`失败`，落定时 toast；上传区有文件后**收缩为细条**（渐进披露）。（来源：`ai-hub` `.f-row`）

### 3.14 卡片网格（提示词库）
`auto-fill minmax(240px, 1fr)`；排序"收藏置顶 → 使用次数"；入场 45ms 错峰；收藏 ★ 即时切换 + `aria-pressed`；标签 chip 与搜索叠加过滤。（来源：`ai-hub` `.pm-card`）

### 3.15 纯 CSS 图表
柱状图：flex 列 + 高度百分比，`transform-origin: bottom` 的 `scaleY` 生长（50ms 错峰），低于峰值 50% 的柱降透明；进度条：轨道 + `scaleX` 填充。零依赖，颜色全走语义 token。（来源：`ai-hub`）

### 3.16 Tab 切换（tablist 语义）
`role="tablist/tab/tabpanel"` + `aria-selected`；面板用标准 `rise` 入场。（来源：`ai-hub` `.tabs`）

### 3.17 折叠开关图标：加号→减号形变（Apple 式）
展开/收起的指示图标**不用字符箭头旋转**（"⌄"转 180° 后语义反转且观感廉价）。用两根 CSS 线拼成加号：竖线绕中心以轻过冲弹簧 `rotate(90deg)` 与横线重合为减号——**状态即图标**，展开态图标同步染 `--accent`。开关带 `aria-expanded`。（来源：`ai-steward` `.kbd-toggle .pm-icon`，iOS 设置展开行的经典手法）

### 3.18 简笔画标注系统（营销页 · Claude/Anthropic 风）
比"插画"更轻的一层：**涂鸦式标注**。四个签名手法——
1. **Off-kilter 星芒**（Claude logo 同源）：无外圆、放射线角度不均且每根微弯（C 曲线）、长短不一，中心一个点；忌等分角度与直线
2. **圈重点**：手绘开口椭圆（路径不闭合）包住关键词，`preserveAspectRatio="none"` 随文字伸缩
3. **歪箭头 + 手写注**：弯曲箭杆 + 开放 V 箭头，mono 小字标注微微旋转（-5°）；窄屏隐藏
4. **波浪下划线**：Q/T 曲线连缀，衬在品牌语下
纸感颗粒（feTurbulence 5%）打底。原则：**简笔画说旁白与重点，UI 说功能**；一处视图最多 2-3 个标注，多则闹。（来源：`ai-steward-site`；[Claude logo 分析](https://designrush.com/best-designs/logo/claude-logo-design-the-ai-mark-built-to-look-none-of-its-rivals)）

### 3.19 能力速览条 / 多列页脚
营销页密度工具：Hero 下的 mono 胶囊条快速铺陈能力；页脚四列（品牌宣言/产品/演示/规格）收束全站。（来源：`ai-steward-site`）

## 4. 动效规范

> 本节是速查卡；完整方法论（频率裁定 / 显隐机制矩阵 / 编排 / 空间语义 / 验证 / 陷阱库）见 **[animation-methodology.md](animation-methodology.md)**。

### 4.1 时长与曲线
| 动作 | 时长 | 曲线 |
|------|------|------|
| 出场（退场让位） | 130–140ms | **ease-out**（强曲线） |
| 入场（到位） | 210–220ms | ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` |
| 控件态变化 | 150–180ms | ease-out |
| 呼吸/脉冲 | 2.4s | ease-in-out 循环 |
| 光标闪烁 | 1s | `steps(2)`（终端感的关键：硬切换不渐变） |

原则（review-animations 标准）：
- **入场和出场都用 ease-out**——"ease-in 让位"是错误认知：ease-in 起步慢，恰好延误用户注视的那一刻。不对称只体现在**时长**（出短入长），不体现在曲线方向。
- **UI 动效 < 300ms**；按压反馈 100–160ms、`scale(0.96–0.98)`；浮层从触发点缩放（`scale(0.9–0.97)` 起步，**禁 `scale(0)`**——现实中没有东西从无中生有）。
- **例外辩护：grid-template-rows 折叠动画**违反"只动 transform/opacity"，但高度显隐没有 transform 替代方案（height:auto 不可动画、max-height 是魔数）；实测帧间隔 8.3ms 中位数无掉帧、动画范围限定单列——作为**有据可依的例外**使用，不扩散到其他属性。

原则：**只动 `transform` / `opacity`**（合成器）；选中描边用 `::after` opacity，不用 box-shadow 过渡。

### 4.2 视图切换（View Transitions 模板）
1. `view-transition-name` 只挂内容区——外壳（侧栏/顶栏/状态栏）不动；
2. 方向感知：`:root.vt-fwd / .vt-back` 切换伪元素动画（位移 14–18px + 出场 `scale(0.995)` 景深，暗示不表演）；
3. **VT 与元素动画互斥**：`vt-live` 类抑制元素入场动画（防快照拍到透明首帧），`ready` 拒绝时 `vt-fallback` 加回；
4. 主题切换用 `vt-theme`：全页纯淡变不位移。

**运行时可用性学习**（关键经验）：API 存在 ≠ 可用——某些嵌入式 webview 里 `startViewTransition` 存在但被一律中止，且 skip 时 `ready` **既不 resolve 也不 reject**。判定要用双重信号：`ready` 任一落定记成功/失败；`finished` 先于 `ready` 落定 = 被跳过。首次失败即记 `vtUsable = false`，后续直接走 JS 交叉淡化，不再反复撞墙。

```js
let vtUsable = typeof document.startViewTransition === "function" && !reduceMotion;

/* JS 双向交叉淡化降级：旧视图绝对定位盖住淡出（带方向），新视图滑入——
   无 VT 环境也有"双向"过渡，而非单边淡入 */
function jsCrossFade(apply, back) {
  document.documentElement.classList.toggle("fb-back", !!back);
  const oldView = $(".view.active");
  apply();
  const newView = $(".view.active");
  if (oldView === newView) {          // 同视图内容替换（月份翻页）：重放入场动画当刷新反馈
    newView.style.animation = "none"; newView.getBoundingClientRect(); newView.style.animation = "";
  } else {
    oldView.classList.add("leaving"); // .leaving = absolute + 140ms 淡出动画
    setTimeout(() => { oldView.classList.remove("leaving"); document.documentElement.classList.remove("fb-back"); }, 260);
  }
}

function withTransition(dirClass, apply) {
  if (!vtUsable) { jsCrossFade(apply, dirClass === "vt-back"); return; }
  const root = document.documentElement;
  root.classList.add("vt-live"); root.classList.remove("fb-back");
  if (dirClass && dirClass !== "vt-theme") root.classList.add(dirClass);
  let vt;
  try { vt = document.startViewTransition(apply); }
  catch (e) { root.classList.remove("vt-live", dirClass || ""); vtUsable = false; jsCrossFade(apply, dirClass === "vt-back"); return; }
  let settled = false;
  vt.ready.then(() => { settled = true; }, () => { settled = true; vtUsable = false; root.classList.add("vt-fallback"); });
  vt.finished.finally(() => { if (!settled) vtUsable = false; root.classList.remove("vt-live", "vt-fallback", dirClass || ""); });
}
```

降级曲线与 VT 一致：出 140ms ease-in，入 210ms ease-out-expo；方向由 `:root.fb-back` 切换 `fb-in/fb-out` 关键帧名。

### 4.3 流式渲染（双驱动，永不冻结）
rAF 主驱动（顺滑）+ 150ms `setInterval` 看门狗（后台时定时器只被节流不会停）；两条路径都按 `performance.now()` 墙钟推进同一位置（幂等）。**不要**纯 setInterval 固定步进（后台节流会拖死），也**不要**纯 rAF（后台完全冻结）。（来源：移动端 `streamText`）

### 4.4 降级链
真浏览器 VT（方向性交叉淡化 + 微缩景深）→ VT 不可用环境 JS 双向交叉淡化（同方向语言）→ 中止当帧单边入场兜底 → `prefers-reduced-motion` 全部跳过（媒体查询里**显式**覆盖 `::-view-transition-*` 伪元素，`*` 选择器够不到它们）。

### 4.5 布局编排（多段高度变化必须错峰）

凡一个状态切换引发**多段高度变化**（如：终端块收起 + 表单折叠 + 卡片生长），必须错峰编排——同时进行时，上方元素长高会把正在收缩的下方元素往下推，两个位移互相打架（"僵硬感"的来源）：

- **正向**：让位者先收（280ms）→ 240ms 后新内容生长；滚动定位延迟到全部稳定后（~520ms）；
- **反向镜像**：新内容先收 → 240ms 后让位者展开——正反向同一节奏，不要只编排一边；
- 高度显隐一律 `collapse-wrap`（4.1 的例外辩护），`display` 切换会把整块高度瞬插/瞬删（"入场动画不动画布局"）。

## 5. 交互原则（产品层）

1. **提案确认制**：AI 只生成结构化提案，用户逐字段核对（−/+ diff）确认后才写入；确认前一切可取消，提案带 TTL。
2. **键盘优先**：⌘K 面板、数字键切视图、Ctrl+⏎ 提交、Esc 上下文感知（面板 > 提案）。
3. **小空间纪律**（YouMind）：功能出现在该出现的位置；低频入口折叠（如记忆新增收成一行虚线）。
4. **渐进披露，用交互换空间**（NN/g / IxDF / GitHub Primer）：
   - 只为当前任务显示必要内容；次要信息推迟到二级交互（折叠、悬停、摘要行）；
   - **隐藏 ≠ 消失**：折叠入口必须可发现（清晰标签 + 展开箭头），空状态给一个动作而不是一堵墙；
   - 悬停揭示只用于次要操作；折叠动画用 `grid-template-rows 0fr→1fr`（无 JS 测量、无 max-height 魔数）；
   - 已在本库落地：确认态折叠输入表单为"原话 + 修改"摘要行、空日期只给紧凑空态（不渲染 4 个空分类）、快捷键列表默认收起、月历格子只显 2 条 + "+N"。
5. **移动端不搬桌面**：小屏砍视图（无月历），改对话流；输入框 16px 防缩放；长按手势优于点按。
6. **图标跟着眼睛走**：光学修正大于几何对齐（见 `icons/icon-lab` 思考墙）。

## 6. 产品级美感 · Apple 三原则的落地

> 依据 [Apple HIG 设计原则](https://developer.apple.com/design/human-interface-guidelines/design-principles)：**Clarity（清晰）/ Deference（顺应内容）/ Depth（层次）**。目标是"从里到外"的一致质感——每个状态都被设计过，每个表面都有物质感。

| 原则 | 本库落地 |
|------|------|
| Clarity | 侧栏 macOS 式选中指示条（3px 圆角 accent 条）；衬线标题统一 `-0.3px` 光学字距；等宽 + tabular-nums 数据 |
| Deference | 顶部主色 5% 环境光（`body::before` radial，fixed 不拦截事件），页面不是死平的底；**阴影只属于浮层**（命令面板/toast 双层阴影），内容卡片保持 hairline 平面不漂浮 |
| Depth | 阴影双层化：`0 1px 2px`（接触影）+ `0 16px 40px`（环境影），表面"浮"而非"贴"；主按钮 `inset 0 1px 0` 受光高光 + 主色接触影；按压 `scale(0.96)` + 弹簧回弹 |
| 物理感 | `--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1)` 轻过冲弹簧——只给"有质量"的动效用（按压、toast 入场），位移动效仍用 ease-out-expo（弹簧不滥用） |

半径体系：卡片 10px / 控件 6px（同心关系）；999 胶囊用于 chip 与 tag。

## 7. 页面骨架

- **PC**：`grid: 224px 1fr` 外壳（侧栏 + 顶栏 54px + 内容 + 状态栏 30px）；
- **移动**：`100dvh` 纵向 flex（顶栏 + 聊天流 + 输入区），`env(safe-area-inset-*)` 全套；
- 内容最大宽 1020–1180px 居中；页面自包含单 HTML，双击可跑。

## 8. 交付前检查单（五个设计 skill 的归纳）

> 本节是外部审美基准的本地化归纳，来源：Anthropic `frontend-design`、Vercel `web-design-guidelines`、`design-taste-frontend`、Emil Kowalski `review-animations` / `animation-vocabulary`（已安装为用户级 skill）。**每个 demo 合入前过一遍；审计项由 `scripts/audit_tokens.py` 机器把关。**

五个 skill 各管一段，恰好构成一条完整的交付流水线：

| Skill | 管什么 | 什么时候用 |
|------|------|------|
| frontend-design / design-taste-frontend | **方向**：读题（页面类型/受众/气质词），先给一句"Design Read"再动手；从题材里长出个性，拒绝模板脸 | 动手前 |
| web-design-guidelines | **合规**：交互与可达性底线（见下方清单） | 写完立刻 |
| review-animations | **动效工艺**：每个动画答得出"为什么动"；入场 ease-out；UI 动效 < 300ms；浮层从触发点缩放（0.9–0.97 起步，禁 scale(0)）；高频操作不加动画 | 有动效时 |
| animation-vocabulary | **命名**：能说出效果的准确名字（Pop in / Rubber-banding…），先命名再实现 | 遇到"那个弹性效果"时 |

### 合规底线（WIG 精选，已在本库落地）

- 按钮用 `<button>`，导航用 `<a>`；**禁止可点击 div/span**——确需自定义（如日历格子）必须 `role="button" tabindex="0"` + Enter/Space 键盘路径；
- 图标按钮必有 `aria-label`；输入控件必有 `aria-label` 或被 `<label>` 包裹（placeholder 不算）；
- 异步提示（toast/转写状态）`aria-live="polite"` 或 `role="status"`；
- 选中态带语义：导航 `aria-current="page"`，切换组 `aria-pressed`，日历选中 `aria-current="date"`；
- 全局 `:focus-visible` 焦点环；`touch-action: manipulation`；弹层滚动 `overscroll-behavior: contain`；
- `prefers-reduced-motion` 全量降级；动画只动 `transform`/`opacity` 且可被用户输入打断。

### 动效工艺线（review-animations 十条之首）

1. **每个动画必须有理由**（空间连续 / 状态指示 / 反馈 / 解释变化）——"看起来酷"不成立；
2. **频率匹配**：每天百次以上的操作零动画，偶发场景才配"愉悦"；
3. 入场必 ease-out（自定义曲线），UI 元素 < 300ms。

（本库动效规范见 §4，与上述标准同源。）
````

### 材料 B · 动画方法论文档（片段题第 4 题来源）

````markdown
# 动画方法论 · Motion Methodology

> 本库所有动效的系统方法论，从 6 个页面的实战与踩坑中提炼（依据：Emil Kowalski 动效标准 + Apple HIG + 本库验证数据）。design-language.md §4 是它的速查卡。
> 核心命题：**动画不是装饰，是界面的物理连续性。** 每个动画必须答得出"为什么动"。

## 0. 第一问：该不该动（频率裁定）

| 使用频率 | 决策 |
|------|------|
| 每天百次以上（键盘快捷、命令面板开合） | **零动画**——动画让高频操作显得迟钝 |
| 每天数十次（hover、列表导航） | 极简或去掉 |
| 偶发（模态、抽屉、toast、状态切换） | 标准动画 |
| 罕见/一次（引导、成功庆祝） | 可以有愉悦感 |

有效动效的五个理由：空间连续、状态指示、反馈、解释变化、防止突变。"看起来酷"不是理由。

## 1. 令牌（先定口令，再写动画）

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* 入场与出场通用（强 ease-out） */
--ease-spring: cubic-bezier(0.34, 1.3, 0.64, 1); /* 轻过冲弹簧——只给"有质量"的动作 */
--dur-fast: 0.15s;    /* 控件态变化 */
--dur-spring: 0.18s;  /* 弹簧动效 */
--dur-reveal: 0.28s;  /* 折叠/区块展开 */
```

铁律：
- **入场和出场都用 ease-out**。"出场用 ease-in 快速让位"是错误认知——ease-in 起步慢，恰好延误用户注视的那一刻。不对称只体现在时长（出短入长）。
- **UI 动效 < 300ms**；按压反馈 100–160ms + `scale(0.96–0.98)`；浮层从触发点缩放，`scale(0.9–0.97)` 起步，**禁 `scale(0)`**（现实中没有东西从无中生有）。
- 弹簧只给"有质量"的动效（按压、toast、收藏 pop）；位移动效用 ease-out。弹簧滥用 = 玩具感。

## 2. 显隐机制选择矩阵（本库最重要的决策表）

| 场景 | 机制 | 原因 |
|------|------|------|
| 元素显隐且**影响布局高度** | `collapse-wrap`（grid-template-rows 0fr↔1fr） | display 切换 = 高度瞬插（"入场动画不动画布局"）；opacity/transform 管不了布局 |
| 内容显隐**不影响布局**（淡入淡出） | opacity transition | 合成器，最便宜 |
| 视图/路由切换 | View Transitions（内容区命名）+ JS 双向交叉淡化降级 | 外壳不动、方向感知；运行时探测可用性（API 存在 ≠ 可用） |
| 持续流式输出 | rAF 主驱动 + setInterval 看门狗双驱动 | 后台标签页 rAF 停摆、setInterval 只被节流——双路径按墙钟推进同一位置（幂等） |
| 图标状态切换 | 笔画形变（旋转/折叠/生长），禁字符图标整体旋转 | 图标即状态（见 icons/icon-morph） |

**通用机制以类为单位复用，不复制声明**——自写副本会漂移（记忆面板冻结事故）。

## 3. 编排（多段变化的时序纪律）

一个状态切换引发**多段高度变化**时，必须错峰——同时进行时，上方元素长高会把正在收缩的下方元素往下推，两个位移互相打架（"僵硬感"的来源）：

```
正向：让位者先收（280ms）→ 240ms 后新内容生长 → 全部稳定后（~520ms）才 scrollIntoView
反向：新内容先收 → 240ms 后让位者展开（与正向镜像，不能只编排一边）
```

- 打字机等流式动画结束后进入下一阶段，留 200–350ms 呼吸位；
- 滚动定位永远在高度稳定之后，避免平滑滚动与折叠动画互相拉扯；
- 列表入场按索引错峰（45–70ms/项），不超过 ~500ms 总时长。

## 4. 空间语义（动效的"语法"）

| 位移方向 | 语义 | 不可混用 |
|------|------|------|
| 水平位移 | 导航/层级换位（视图切换、tab） | 原地出现的元素禁止横移 |
| 垂直升起（translateY 5–8px + fade） | 原地出现/内容更新 | —— |
| 从触发点缩放 | 弹层（菜单、气泡） | transform-origin 对准触发器 |
| scale 弹簧 | 情绪动作（收藏、点赞） | 状态切换不用弹簧 |

## 5. 性能与鲁棒性

- 只动 `transform`/`opacity`（合成器）；**grid-rows 是唯一辩护例外**（高度显隐无替代方案，实测 8.3ms 帧间隔中位数）。
- 打字机/流式：墙钟推进（`performance.now()`），绝不固定步进——后台定时器被节流到 1 次/秒，固定步进会拖死。
- VT 可用性运行时探测：`ready` 拒绝 **或 `finished` 先于 `ready` 落定**（某些环境 ready 永不落定）= 不可用，学习一次后续直接走降级。
- 遮挡标签页里主线程过渡全部冻结、rAF 停摆——**布局动画必须在面板可见时验证**。

## 6. 可达性

- `prefers-reduced-motion: reduce` 全量降级，且**显式覆盖** `::view-transition-*` 伪元素（`*` 选择器够不到它们）；
- 动画可被打断：transition 可中断换向（keyframe 不行）——高频触发用 transition；
- 语义随状态翻转（`aria-expanded`/`aria-pressed`/`aria-current`）与动画同步。

## 7. 验证方法（怎么证明"顺滑"）

1. **类时序断言**：错峰编排用 DOM 类变化时间戳验证（不受动画冻结影响）；
2. **高度跳变量化**：过渡期间每 50–60ms 采样容器高度，**单步最大跳变**应从"瞬插级"（>300px 一步）降到"逐帧级"（≈每帧 20–25px）；
3. **帧间隔**：面板可见时 rAF 采样，中位数 ≈ 显示器刷新间隔（8.3ms@120Hz）；
4. 双主题 + reduced-motion 各过一遍。

## 8. 陷阱库（全部真实踩过）

| 陷阱 | 症状 | 解法 |
|------|------|------|
| 入场动画不动画布局 | display 切换 + 淡入，整列瞬跳 500px | collapse-wrap 驱动高度 |
| 反向无编排 | 取消时上推下缩互相打架 | 正反向镜像错峰 |
| 共享基类局部重构 | 记忆页终端块整段隐形 | 改共享类前 grep 全部使用点 |
| 自写机制副本 | transition 冻结在起始值 | 复用通用类，不复制声明 |
| 纯 rAF 流式 | 切后台冻结 | 双驱动 + 墙钟 |
| 字符箭头旋转 | "⌄"转 180° 语义反转 | 笔画形变（图标即状态） |
| content-visibility 用于吸底流 | scrollHeight 低估一半，定位全错 | 吸底聊天流禁用 |
| 遮挡环境测动画 | 全部过渡冻结的假阴性 | 面板可见时验证 |

## 9. 本库落点索引

- 视图切换/降级：`ai-steward` §withTransition · 配方 3.10–3.17
- 流式双驱动：`ai-steward-mobile` streamText · `ai-assistant` streamInto
- 编排（正反向）：`ai-steward` generateProposal / resetFlow
- 图标形变：`icons/icon-morph`（8 手法 + 慢放）
- 纯 CSS 图表生长：`ai-hub` bars/fill
- 折叠开关：加号→减号（`ai-steward` kbdToggle）
````

