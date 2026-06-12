---
name: dashi-ppt-skill
description: 根据用户目标随机组合已接入主题页面,生成可离线打开和导出的静态 HTML PPT。
---

# PPT 生成 Skill

生成静态 HTML 横向翻页 PPT。使用本 skill 时,先把用户的自然语言需求整理成 JSON 计划,再调用本地项目生成器输出 `index.html` 和 `assets/`。


## 版本

当前版本: `0.1.1`

每次完成用户请求、准备最终回复前,运行:

```bash
node <skill-root>/scripts/check_latest_version.mjs
```

如果脚本有输出,把输出内容附在最终回复末尾提醒用户更新;如果脚本无输出或检查失败,保持静默,不要提版本检查。

## Skill 目录

当前 `SKILL.md` 所在目录就是 Skill 根目录,下文记为 `<skill-root>`。

内置生成器目录:

`<skill-root>/project`

渲染脚本:

`<skill-root>/scripts/render_goal_deck.sh`

版本检查脚本:

`<skill-root>/scripts/check_latest_version.mjs`

## 生成原则

本 Skill 是模板编排器。默认目标是快速、稳定地把用户需求套入已登记页面组件,输出可离线打开的 HTML PPT。

默认模式是“锁模板填文案”:保留所选页面组件的原始视觉、结构、数量、显隐、强调、配色、图表类型和图片槽位,只替换可见文字内容。除非用户明确要求调整页面属性,不要改任何非文案 props。

默认不做视觉精修,不做截图审美判断,不因为普通断行或局部排版不完美反复返工。只有用户明确要求“视觉精修”“100% 检查”“帮我调到满意”时,才进入视觉 QA 流程。

## 使用规则

- 运行生成器需要 Node.js 18+ 和 npm;首次生成时渲染脚本会在 Skill 内置 `project/` 目录安装依赖。
- 开始阶段先确认用户想要的风格。用户没有明确指定时,先列出全部可选风格并询问,不要直接生成。
- 当前可选风格:
  - `theme01`: 01-轻拟态质感
  - `theme02`: 02-炫光紫绿
  - `theme03`: 03-深浅代码风
  - `theme04`: 04-玻璃糖果
  - `theme05`: 05-PULSE 色谱图表
  - `theme06`: 06-深色数据图谱
  - `theme07`: 07-冷白调研图谱
  - `theme08`: 08-黑金实验质感
  - `theme09`: 09-深蓝杂志
  - `theme10`: 10-金色指数图表
  - `theme11`: 11-高能增长图谱
  - `theme12`: 12-声波霓虹
- 不使用旧 token、旧主题、旧图片 slot、旧风格分支或旧入场动画控制。
- 元素出现动画使用 Claude Design 页面组件自带的原生效果。
- 页面切换动画可以在预览控制面板里调整。
- 如果当前是在 Codex 环境中执行,且页面有插图/图片槽位或用户主题明显需要插图,必须先询问用户是否同意通过 image2 生图并插入 PPT。用户同意后,在对应插图位置/图片槽位写入生成图片;用户不同意或未回复时,不要生成图片,也不要替换图片槽位。
- 面向用户交付的 deck 不显示风格/主题切换选项;风格切换只保留在内部调试 demo 页面。
- 不手写自由 HTML slide;面向用户交付的每页必须写 `layout` + `props`。`role` 只允许在草稿阶段辅助选页,渲染前必须换成具体 `layout`。
- 每套主题的前 5 页 `themeXX_page001` 到 `themeXX_page005` 都是封面候选。一个 deck 只能从前 5 页中选择 1 页作为封面,不要同时使用多个封面页;正文页从第 6 页以后选择。
- 面向用户交付的 deck 不能只写 `role` 后依赖页面默认文案。除非用户明确要默认 demo,每一页都必须写和用户主题对应的 `props` 文案。
- 页眉、页脚、角标、右上角标签、收尾标签也算正文可见文案。组件支持 `head`、`brand`、`reportLabel` 等字段时必须一起覆盖,不要只改卡片正文。
- 不要默认填写页面 `controls`。`accent`、`tone`、`variant`、`theme`、`style`、`color`、`align`、`columns`、`focus`、`highlight`、`show*`、`*Count`、`chart*`、`image*`、`media*` 等字段都视为模板结构/样式字段,用户没有明确要求时不要写。
- 用户内容超过模板默认承载量时,优先压缩文字、拆成另一页或换一个更合适的 layout,不要改卡片数量、图表类型、显隐开关或重点高亮来适配。
- 只有用户明确要求“增加卡片数量/切换图表/调整颜色/突出第几个/隐藏某元素”等页面属性变化时,才读取 `layout-manifest.json` 的 `controls` 和 `countBindings` 并填写对应 props。
- 数量变化必须通过 `cardCount`、`itemCount`、`stepCount` 等 count 参数控制显示数量。不要通过截短 `cards`、`items`、`steps`、`stats` 等数组来隐藏元素。
- 写数组内容时,数组是模板内容池,不是页面结构。只改需要显示的前 N 项文案/数据;后续未显示项必须保留模板默认项或可恢复占位,让用户后续在控制面板把数量加回去仍然有内容。
- 不要改页面元数据、组件源码、className、CSS、样式字段或默认视觉结构来完成内容填充。只在 `props` 内填写内容和用户明确要求的页面属性。
- 允许用顶层 `text` 覆盖可见文字槽位,但只用于替换文字内容。不要在普通生成中启动浏览器批量抽取全页面文本槽位;只有用户明确要求“彻底清除所有模板默认文案/逐页校对可见文案”时才做运行时槽位抽取。
- 禁止复用 `output/` 里已有的旧 `goal.json` 或旧 HTML。每次请求都新建本次输出目录和本次 JSON 计划。
- 最终返回给用户的必须是本次请求的 `output/<deck-name>/ppt/index.html`,不要返回 `theme-preview` 或其它调试页。
- 如果输出正文里出现与用户主题无关的默认文案,例如 AI Capital / 投融资 / SoundWave / 声浪 / Key Metrics / Roadmap / End of Report 等,必须重写 JSON 后重新渲染,不能交付。

## 工作流

1. 提炼用户目标: `title`、`goal`、`audience`、`owner`、页数和内容重点。
2. 确认 `themePack`。用户未指定时先询问风格;用户选定后生成 `randomSeed`,例如 `<主题>-<日期>-<3位随机词>`,保证随机选页可复现。
3. 根据用户内容拆出页面结构。先从该主题前 5 页中选 1 页作为封面,后续正文页从第 6 页以后选定具体 `layout`。
4. 为每页填写文字内容字段;普通生成保持页面默认结构,不要为了内容适配改 controls。
5. 每页只承载一个主要信息角色,并覆盖能通过文案字段安全覆盖的页眉、标签、收尾文案。无法安全覆盖的页面优先换 layout,不要改样式字段硬凑。
6. 把 JSON 写入本次工作目录的 `output/<deck-name>/goal.json`;不要使用 Skill 项目里遗留的旧 JSON。
7. 运行渲染脚本输出 `output/<deck-name>/ppt/index.html`;脚本会使用 Skill 内置生成器,不要切回外部项目目录。
8. 确认脚本完成 `validate:swiss` 和 `validate:goal-copy`。
9. 运行 `node <skill-root>/scripts/check_latest_version.mjs` 做静默版本检查。
10. 两项校验通过后把本地 HTML 路径或预览地址返回给用户;只有版本检查脚本有输出时才附加更新提醒。

## 返工与浏览器检查

只在以下情况返工:渲染失败、`validate:swiss` 失败、`validate:goal-copy` 失败、输出中出现明显不属于用户主题的模板文案、用户明确指出某页内容有问题。

默认最多修复 2 轮。仍失败时说明阻塞原因,不要继续无边界尝试。

默认不打开浏览器,不创建 Chrome profile,不抽取全量文本槽位。只有修改了生成器/预览模板/导出逻辑、用户明确要求检查页面效果,或上一轮出现过运行后 props 被默认值覆盖的问题时,才做一次浏览器 smoke check。

浏览器 smoke check 只确认页面能打开、页数正确、首尾页不是空白。不要默认截图精修,不要因为普通换行问题反复改稿。

示例命令:

```bash
<skill-root>/scripts/render_goal_deck.sh \
  output/client-review/goal.json \
  output/client-review/ppt/index.html
```

## JSON 结构

```json
{
  "title": "美国 AI 融资调研",
  "goal": "面向投资团队汇报 2024-2026 年美国 AI 大额融资结构、资本流向和后续判断",
  "audience": "投资团队 / 产业研究团队",
  "owner": "研究团队",
  "randomSeed": "ai-funding-20260609-a7k",
  "pageCount": 8,
  "themePack": "theme01",
  "slides": [
    {"layout": "theme01_page001", "props": {"kicker": "融资调研 · VOL.01", "titleTop": "美国 AI", "titleBottom": "融资调研", "lead": "从资本体量、赛道结构和典型公司拆解本轮 AI 融资周期。"}},
    {"layout": "theme01_page006", "props": {"kicker": "核心数字", "value": "970", "unit": "亿美元", "sub": "2024 年美国 AI 风险投资规模创历史新高。"}},
    {"layout": "theme01_page010", "props": {"kicker": "# 研究方法", "title": "横纵分析法", "cn": "用时间维度和赛道维度交叉识别融资变化。"}},
    {"layout": "theme01_page030", "props": {"kicker": "# 典型案例", "title": "里程碑 · 头部公司融资节奏"}},
    {"layout": "theme01_page089", "props": {"kicker": "# 附录", "title": "数据来源与研究说明"}}
  ]
}
```

如果 `slides` 为空,`pageCount` 只适合临时草稿预览。面向用户交付前,必须改成具体 `layout` + 对应 `props`。

## 页面角色

`role` 会按 `themePack` 从对应主题候选池中按 `randomSeed` 可复现抽取页面。同一套 deck 内会尽量避免重复使用同一个 layout。

| role | 候选页面用途 |
|---|---|
| `cover` | 主题封面,只能从 `themeXX_page001` 到 `themeXX_page005` 中选 1 页 |
| `statement` | 摘要、论点、金句、核心判断 |
| `breakdown` | 目录、结构拆解、篇章卡、问答结构 |
| `transition` | 章节分隔、附录分隔 |
| `context` | 市场背景、定位矩阵、区域画像、批注说明 |
| `metrics` | 点阵计数、核心数字、计量条、关键指标、数字海报、计分榜 |
| `trend` | 资金流、时间线、日历、阶段、季度走势、编年 |
| `comparison` | 交叉透视、同比、对决、表格、双联、区间、多维对比 |
| `distribution` | 比例带、轮次、漏斗、市占、梯队、瀑布、分布、结构演变 |
| `relationship` | 联投、层级、弧网、网络、交集、径向、冰柱 |
| `case` | 典型案例、分屏、分镜、特写、影像速写、影像便当、人物证言 |
| `image` | 全景、杂志封面、拼贴、陈列、长卷、瀑布、卡集、圆窗、画廊 |
| `process` | 产业链、流向、用途、阶段、方案、阶梯、路线、实施路径 |
| `risks` | 风险研判、景气仪表、预测、关键问答 |
| `observation` | 投资展望、核心结论、观点引述、批注、评分、专题洞察 |
| `actions` | 应用落地、方案、阶梯、路线、实施路径 |
| `result` | 核心结论、数字海报、核心要点、专题洞察 |
| `team` | 研究团队、关于我们 |
| `closing` | 主题结语 |

也可以直接指定页面:

```json
{"layout": "theme01_page030", "props": {"focusIndex": 1}}
```

也可以直接指定其它已接入主题页面:

```json
{"themePack": "theme08", "slides": [{"layout": "theme08_page001"}]}
```

也可以限制候选池:

```json
{"role": "metrics", "layouts": ["theme01_page006", "theme01_page020"]}
```

## 交付能力

生成后的预览页支持翻页、打开侧边栏编辑文本、调整页面 props、替换 Claude 页面自带图片 slot、切换页面切换动画、导出 HTML/PDF/PPTX。面向用户交付的页面底部不显示页码标识、翻页引导、圆点导航或索引提示。

## 页面属性契约

`layout-manifest.json` 由 `npm run manifest:update` 生成,记录每个页面的 `controls` 和数量参数绑定关系。普通生成不需要读取或填写这些 controls;只有用户明确要求调整页面属性时才使用。

典型规则:

- `cardCount` 绑定 `cards`
- `statCount` 绑定 `stats`
- `itemCount` 绑定 `items` / `stats` / `data`
- `stepCount` 绑定 `steps`
- `laneCount` 绑定 `lanes`
- `phaseCount` 绑定 `phases`,且每条 lane 的 `items` 数量要一致

如果用户明确要求调整数量,优先填写 count 参数。只填写数组不填写 count 时项目会按数组中用户填写的数量补齐 count;同时会保留模板默认数组尾部,避免控制面板后续加回数量时无内容。

数量参数的正确写法:

- 要显示 4 个卡片,写 `cardCount: 4`。
- 如果同时写 `cards`,只覆盖前 4 个卡片的内容;不要把原本可选的第 5-7 个卡片从数组里删除。
- 需要保留后续卡片的默认对象、图片槽、颜色、标签类型和其它视觉字段;没有用户内容时保留模板默认项即可。
- 校验标准是数组长度至少覆盖当前 count。数组可以比 count 长,因为长出来的项是控制面板后续加回数量时要使用的内容池。

## 校验

- 输出后必须运行 `validate:swiss`。
- 输出后必须运行 `validate:goal-copy`。
- 改动展示 demo 后运行 `npm run showcase:update`。
