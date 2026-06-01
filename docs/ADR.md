# ADR

本文件由 `scripts/update-project-docs.mjs` 生成,记录当前项目已经采用的架构决策。

## ADR-001: 最终产物保持为静态 HTML

最终交付仍是 `index.html`、`assets/motion.min.js` 和图片资源。React 只作为生成层使用,不进入浏览器运行时。

## ADR-002: 可变部分使用登记选项多选一

`theme` 从 `THEME_OPTIONS` 选择,`fontSet` 从 `FONT_OPTIONS` 选择,每页通过 `slide(layoutKey, props)` 从 `LAYOUT_OPTIONS` 选择。Agent 不直接手写自由 HTML 页面。

## ADR-003: 模板负责浏览器运行时

`assets/template-swiss.html` 负责 CSS 视觉系统、背景、翻页、导航、预览控制器和动效入口。React 组件只生成注入到 `#deck` 内的 slide markup。

## ADR-004: 输出目录是生成物

`output/` 用于 demo、验证 deck 和截图产物,已加入 `.gitignore`,不作为源码提交。

## ADR-005: 提交前同步项目文档

`.githooks/pre-commit` 会运行 `scripts/update-project-docs.mjs`,并 stage `README.md`、`docs/ADR.md`、`docs/project-files.md`。

## ADR-006: 导入布局按页登记

`src/components/blacktech/`、`report/`、`xhs/`、`xhs2/`、`xhs3/`、`style1/` 和 `style2/` 分别存放从外部 HTML deck 提炼出的页面布局组件。`src/options.jsx` 当前登记 80 个布局,覆盖 `bt01`-`bt12`、12 个 report 布局、10 个 xhs 布局、9 个 xhs2 布局、`xhs3_01`-`xhs3_25`、`style1_01`-`style1_06`、`style2_01`-`style2_06`。

## ADR-007: 新布局继续按文件拆分

后续每个页面布局仍然独立成一个 JSX 文件。共享能力优先复用 `src/components/shell/`、`text/`、`media/`、`metrics/`、`charts/`、`timelines/`、`cards/`、`decorations/`、`diagrams/`。

## ADR-008: 提交前刷新全布局总览

`.githooks/pre-commit` 会运行 `npm run showcase:update`。showcase 需要同步覆盖全部已登记布局,当前覆盖 80 个布局。

## ADR-009: 旧布局参考资料保留为历史参考

原项目 Style A / Style B 的参考资料仍在 `references/` 与 `assets/screenshot-backgrounds/`,但当前分支不再登记旧布局组件。

## ADR-010: 生成底座继续保留

`assets/template-swiss.html`、`src/renderDeck.jsx`、`src/tokens/` 和基础组件目录继续保留,用于承载黑科技布局和后续新布局。

## ADR-011: token 与基础组件按组合维度分类

`src/tokens/` 存放主题、字体、字号、间距和动效选项。`src/components/` 下按组合职责分为 `shell/`、`text/`、`media/`、`metrics/`、`charts/`、`timelines/`、`cards/`、`decorations/`、`diagrams/`。

## ADR-012: demo 同时覆盖布局穷举和运行时切换

`examples/component-decks/all-layouts-showcase.jsx` 当前按顺序渲染全部已登记布局,用于预览组件组合效果。主题、字体、字号、间距这类全局 token 仍由 `assets/template-swiss.html` 的预览侧边栏切换。主题必须覆盖整页视觉语境,不是单个 accent 色:每个 theme preset 需要定义全屏基调、前景文字、面板、边框、focus 和装饰色,并允许浅色、暗色、多色背景、单色底加点缀色等不同类型。

## ADR-013: 用户目标通过 JSON 计划组合组件

`src/deckComposer.jsx` 将用户目标 JSON 计划映射为已登记布局组件。`scripts/render-goal-deck.jsx` 负责把计划渲染为最终静态 HTML。Agent 调用 skill 时应优先生成目标计划,再运行 `npm run render:goal`。

## ADR-014: 预览页支持局部内容替换

静态预览页允许用户直接替换媒体、编辑文字和切换图表。媒体占位接受图片或视频文件并内嵌到导出的 HTML 中;文字编辑状态在导出 PDF/HTML 前写入页面;图表组件通过 `data-chart-switch` 暴露可选图表形态。

## ADR-015: 文案与组合逻辑进入 ViewModel

`slide(layoutKey, props)` 不再直接返回 React element,而是返回 slide model。`src/view-model/` 负责把 deck model 解析为 slide view model、token 当前值、页面顺序和运行时可编辑状态。`src/renderDeck.jsx` 只消费 Deck ViewModel 渲染组件;浏览器端 `deck-view-model` 负责统一保存主题、字体、字号、页面排序、文案编辑、媒体替换、shader 和图表选择,导出 HTML/PDF/PPTX 前都会同步这份状态。

## ADR-016: VM 文案 key 不依赖页面顺序

文本覆盖统一使用 `text:<slideKey>:<slot>`。默认 `slideKey` 是 layout key,只有同一个 deck 内重复使用相同布局时才追加出现序号;运行时按单页局部序号生成 slot,不要使用全局递增序号或当前页码。这样拖拽排序、增删前置页面、导出 HTML/PDF/PPTX 时,文案仍能命中同一个布局页面。
