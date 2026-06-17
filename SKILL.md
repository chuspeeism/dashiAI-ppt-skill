---
name: dashi-ppt-skill
description: 根据用户目标随机组合已接入主题页面,生成可离线打开和导出的静态 HTML PPT。
---

# PPT 生成 Skill

生成静态 HTML 横向翻页 PPT。根据用户输入先整理 JSON 计划,再调用本地生成器输出 `index.html` 和 `assets/`。

## 版本

当前版本: `0.1.1`

每次完成用户请求、准备最终回复前,运行:

```bash
node scripts/check_latest_version.mjs
```

如果脚本有输出,把输出内容附在最终回复末尾提醒用户更新;如果脚本无输出或检查失败,保持静默,不要提版本检查。

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
- 普通生成不要直接打开大型 `layout-manifest.json` 或 `generated-metadata.js`。选页先运行 `npm run layout:query -- --theme <themePack> --role <role> --limit 8`;需要图片槽时加 `--needs-media`、`--planned-images <n>`、`--provided-images <n>` 或 `--image-gen`。
- 选定页面后运行 `npm run inspect:layout -- <layout>` 查看 `copyKeys`、`mediaSlots`、`countBindings` 和 `controlKeys`;写复杂数组或图片 props 前运行 `npm run props:safe -- <layout> '<props-json>' [--images <path...>]`。
- 图片和视频的真实写入点是页面 `props.images` / `props.media`;不要写顶层 `media` 或 `slides[].media`。用户只提供纯文本但计划后续插图时,用带 media slot 的页面并保留 slot;需要 image-gen 时先询问用户是否同意。
- 元素出现动画使用 Claude Design 页面组件自带的原生效果。
- 页面切换动画可以在预览控制面板里调整。
- 面向用户交付的 deck 默认不显示风格/主题切换选项;风格切换只保留在内部调试 demo 页面。用户明确要求保留主题切换时,在 goal 顶层写 `preview: {"themeSwitcher": true}`。
- 不手写自由 HTML slide;面向用户交付的每页必须写 `layout` + `props`。`role` 只允许在草稿阶段辅助选页,渲染前必须换成具体 `layout`。
- 每套主题的前 5 页 `themeXX_page001` 到 `themeXX_page005` 都是封面候选。一个 deck 只能从前 5 页中选择 1 页作为封面,不要同时使用多个封面页;正文页从第 6 页以后选择。
- 面向用户交付的 deck 不能只写 `role` 后依赖页面默认文案。除非用户明确要默认 demo,每一页都必须写和用户主题对应的 `props` 文案。
- 优先只写 `inspect:layout` 暴露的文案字段。用户明确要求调整数量、显隐、强调、颜色、图表或图片槽时,才写对应 control props,并用 `props:safe` 保留数组默认尾部。
- 不要改页面元数据、组件源码、className、CSS、样式字段或默认视觉结构来完成内容填充。只在 `props` 内填写内容和用户明确要求的页面属性。
- 允许用顶层 `text` 覆盖可见文字槽位,但只用于替换文字内容。不要在普通生成中启动浏览器批量抽取全页面文本槽位;只有用户明确要求“彻底清除所有模板默认文案/逐页校对可见文案”时才做运行时槽位抽取。
- 禁止复用 `output/` 里已有的旧 `goal.json` 或旧 HTML。每次请求都新建本次输出目录和本次 JSON 计划。
- 最终返回给用户的必须是本次请求的 `output/<deck-name>/ppt/index.html`,不要返回 `theme-preview` 或其它调试页。
- 如果输出正文里出现与用户主题无关的默认文案,例如 AI Capital / 投融资 / SoundWave / 声浪 / Key Metrics / Roadmap / End of Report 等,必须重写 JSON 后重新渲染,不能交付。

## 工作流

1. 提炼用户目标: `title`、`goal`、`audience`、`owner`、页数和内容重点。
2. 确认 `themePack`。用户未指定时先询问风格;用户选定后生成 `randomSeed`,例如 `<主题>-<日期>-<3位随机词>`,保证随机选页可复现。
3. 判断图片意图:用户已给图片用 `--provided-images <n>`;用户计划后续配图用 `--planned-images <n>`;需要生图用 `--image-gen` 并先询问。
4. 用 `layout:query` 选候选,用 `inspect:layout` 确认可写字段和 media slot,用 `props:safe` 生成安全 props。
5. 每页只承载一个主要信息角色。无法安全覆盖的页面优先换 layout,不要改样式字段硬凑。
6. 把 JSON 写入本次工作目录的 `output/<deck-name>/goal.json`;渲染前必须通过 goal spec 校验。
7. 运行 `npm run render:goal -- output/<deck-name>/goal.json output/<deck-name>/ppt/index.html`。
8. 运行 `npm run validate:swiss -- output/<deck-name>/ppt/index.html`。
9. 运行 `npm run validate:goal-copy -- output/<deck-name>/goal.json output/<deck-name>/ppt/index.html`。
10. 两项校验通过后返回本地预览路径或当前服务地址。

## 返工与浏览器检查

只在以下情况返工:渲染失败、`validate:swiss` 失败、`validate:goal-copy` 失败、输出中出现明显不属于用户主题的模板文案、用户明确指出某页内容有问题。

默认最多修复 2 轮。仍失败时说明阻塞原因,不要继续无边界尝试。

默认不打开浏览器,不创建 Chrome profile,不抽取全量文本槽位。只有修改了生成器/预览模板/导出逻辑、用户明确要求检查页面效果,或上一轮出现过运行后 props 被默认值覆盖的问题时,才做一次浏览器 smoke check。

浏览器 smoke check 只确认页面能打开、页数正确、首尾页不是空白。不要默认截图精修,不要因为普通换行问题反复改稿。

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

`role` 只用于草稿选页,最终 JSON 必须落成具体 `layout`。角色说明见 `references/layout-roles.md`;真实候选以 `layout:query` 输出为准。

`cover` 只能从当前主题前 5 页选择。`image` / `media` 候选基于真实 `mediaSlots`,不是页面标题关键词。

可以直接指定页面:

```json
{"layout": "theme01_page030", "props": {"title": "典型案例"}}
```

## 交付能力

生成后的预览页支持翻页、打开侧边栏编辑文本、调整页面 props、替换 Claude 页面自带图片 slot、切换页面切换动画、导出 HTML/PDF/PPTX。面向用户交付的页面底部不显示页码标识、翻页引导、圆点导航或索引提示。

## 页面属性契约

普通生成不要读 `layout-manifest.json`。用 `inspect:layout` 看单页契约:

- `copyKeys`: 可安全改写的文案/数据字段。
- `mediaSlots`: 图片/视频写入字段、count key、默认数量和最大数量。
- `countBindings`: 数量参数与数组字段的绑定。
- `controlKeys`: 右侧面板可操作字段。

需要写数组、数量或图片时,用 `props:safe` 输出归一化 props。它会保留数组默认尾部,并根据 `props.images` / `props.media` 派生对应 count。

## 校验

- 渲染前必须运行 `validate:goal-spec`。
- 输出后必须运行 `validate:swiss`。
- 输出后必须运行 `validate:goal-copy`。
- 改动展示 demo 后运行 `npm run showcase:update`。
