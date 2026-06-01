# 项目文件作用说明

本文件由 `scripts/update-project-docs.mjs` 生成,用于快速理解当前项目工作树下每个源码文件的主要作用。`output/` 是生成产物目录,不纳入源码文件清单。

```text
.
|-- .githooks/
|   `-- pre-commit - 本地 Git pre-commit hook,提交前重生成 README、ADR 和文件作用说明并自动 stage。
|-- assets/
|   |-- imported/
|   |   `-- xhs3/
|   |       `-- images/
|   |           |-- img-000.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-001.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-002.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-003.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-004.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-005.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-006.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-007.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-008.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-009.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-010.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-011.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-012.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-013.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-014.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-015.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-016.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-017.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-018.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-019.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-020.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-021.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-022.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-023.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-024.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-025.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-026.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-027.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-028.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-029.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-030.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-031.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-032.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-033.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-034.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-035.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-036.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-037.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-038.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-039.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-040.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-041.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-042.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-043.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-044.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-045.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-046.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-047.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-048.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-049.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-050.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-051.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-052.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-053.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-054.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-055.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-056.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-057.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-058.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-059.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-060.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-061.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-062.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-063.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-064.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-065.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-066.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           |-- img-067.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |           `-- img-068.jpg - 小红书分享3导入布局使用的本地图片资源。
|   |-- screenshot-backgrounds/
|   |   |-- style-a/
|   |   |   |-- dune.webp - Style A 沙丘截图背景资源。
|   |   |   |-- forest-ink.webp - Style A 森林墨截图背景资源。
|   |   |   |-- indigo-porcelain.webp - Style A 靛蓝瓷截图背景资源。
|   |   |   |-- kraft-paper.webp - Style A 牛皮纸截图背景资源。
|   |   |   `-- monocle-classic.webp - Style A 墨水经典截图背景资源。
|   |   `-- style-b/
|   |       |-- ikb-dot-gradient.webp - Style B IKB 蓝截图背景资源。
|   |       |-- lemon-green-dot-shadow.webp - Style B 柠檬绿截图背景资源。
|   |       |-- lemon-grid.webp - Style B 柠檬黄截图背景资源。
|   |       `-- safety-orange-halftone.webp - Style B 安全橙截图背景资源。
|   |-- unicorn/
|   |   |-- automations_remix_scene.json - 可选 shader 背景使用的 Unicorn Studio 本地场景文件。
|   |   |-- blue_donut_remix_scene.json - 媒体占位组件使用的 Unicorn Studio 本地 shader 场景文件,运行时会跟随主题 focus 色替换主色。
|   |   |-- goey_balls_remix_scene.json - 可选 shader 背景使用的 Unicorn Studio 本地场景文件。
|   |   |-- moving_into_remix_scene.json - 第 7 页可选随机 shader 背景使用的 Unicorn Studio 本地场景文件。
|   |   `-- tech_background_remix_scene.json - 可选 shader 背景使用的 Unicorn Studio 本地场景文件。
|   |-- motion.min.js - 浏览器端 Motion One 动效 runtime,由渲染器复制到最终产物。
|   `-- template-swiss.html - 静态 PPT HTML 外壳模板,包含 CSS、背景、翻页、导航、预览控制器和动效入口。
|-- docs/
|   |-- ADR.md - 架构决策记录,描述当前生成链路和组件化边界。
|   |-- import-tokenization-notes.md - 项目文档。
|   `-- project-files.md - 项目文件作用说明,由脚本根据当前文件列表生成。
|-- examples/
|   |-- component-decks/
|   |   |-- all-layouts-showcase.jsx - 全部布局总览示例 deck,顺序渲染当前全部已登记布局。
|   |   `-- showcase-copy-overrides.js - 全布局总览示例 deck 的文本覆盖数据,使用稳定 VM 文案 key 替换默认文案。
|   `-- goal-decks/
|       |-- annual-review.json - 按用户目标组合组件的 JSON 计划示例,供 render:goal 渲染。
|       `-- portfolio.json - 个人作品集 JSON 计划示例,供 render:goal 验证不同主题和页面组合。
|-- references/
|   |-- checklist.md - 原项目执行检查清单,包含 Style B 生成和 QA 约束。
|   |-- component-workflow.md - 组件选项工作流参考,说明新增选项和 subagent 测试要求。
|   |-- image-prompts.md - 图片生成提示词参考,包含 Style A 与 Style B 的图像槽位要求。
|   |-- layouts-swiss.md - Style B Swiss 原始布局说明,登记 S01-S22 与地图扩展使用方式。
|   |-- layouts.md - Style A 电子杂志原始布局说明,登记 A01-A10 的历史来源。
|   |-- screenshot-framing.md - 截图入版规范,说明不同风格的背景、裁切、阴影和留边规则。
|   |-- swiss-layout-lock.md - Style B Swiss 布局锁定规则,约束只能使用登记布局和扩展。
|   |-- swiss-map-component.md - Style B S08 地图插槽扩展说明,定义点位、关系线和控制区契约。
|   |-- themes-swiss.md - Style B Swiss 主题色参考,定义主题与使用边界。
|   `-- themes.md - Style A 电子杂志主题色参考。
|-- scripts/
|   |-- render-deck.jsx - 渲染 CLI 入口,把 deck 配置文件输出成静态 HTML。
|   |-- render-goal-deck.jsx - 目标计划渲染 CLI,把 JSON 组件组合计划输出成静态 HTML。
|   |-- update-project-docs.mjs - 文档同步脚本,更新 README、ADR 和项目文件作用说明。
|   |-- validate-layout-showcase.mjs - 布局总览覆盖校验器,确保 all-layouts-showcase 穷举 A01-A10、canonical S01-S22 和 Style B 登记扩展。
|   `-- validate-swiss-deck.mjs - 静态 deck 校验器,检查合法 layout、图片槽位和禁用模式。
|-- src/
|   |-- components/
|   |   |-- blacktech/
|   |   |   |-- BT01Cover.jsx - 黑科技技能分享第 1 页封面布局组件。
|   |   |   |-- BT02Hypothesis.jsx - 黑科技技能分享第 2 页假设/大引用布局组件。
|   |   |   |-- BT03SignalNoise.jsx - 黑科技技能分享第 3 页左右分屏信号噪声布局组件。
|   |   |   |-- BT04Pipeline.jsx - 黑科技技能分享第 4 页四阶段流程布局组件。
|   |   |   |-- BT05Halftone.jsx - 黑科技技能分享第 5 页半调海报+说明列表布局组件。
|   |   |   |-- BT06Dither.jsx - 黑科技技能分享第 6 页媒体占位+可切换图表布局组件。
|   |   |   |-- BT07Warp.jsx - 黑科技技能分享第 7 页可替换 shader 背景布局组件。
|   |   |   |-- BT08Compression.jsx - 黑科技技能分享第 8 页大数字+基准表格布局组件。
|   |   |   |-- BT09Failures.jsx - 黑科技技能分享第 9 页失败模式三栏布局组件。
|   |   |   |-- BT10Observation.jsx - 黑科技技能分享第 10 页点阵观察布局组件。
|   |   |   |-- BT11Applications.jsx - 黑科技技能分享第 11 页应用场景四宫格布局组件。
|   |   |   |-- BT12Closing.jsx - 黑科技技能分享第 12 页收尾布局组件。
|   |   |   |-- index.jsx - 黑科技技能分享布局组件统一导出口。
|   |   |   `-- primitives.jsx - 黑科技技能分享布局共享基础件,包含可替换页眉页脚、媒体占位、caption、shader 背景和可切换图表。
|   |   |-- cards/
|   |   |   |-- Card.jsx - 卡片组件。
|   |   |   `-- index.jsx - 卡片组件。
|   |   |-- charts/
|   |   |   |-- ChartSwitch.jsx - 图表组件,负责条形图、折线图、指标卡片和可切换图表。
|   |   |   |-- HBarChart.jsx - 图表组件,负责条形图、折线图、指标卡片和可切换图表。
|   |   |   `-- index.jsx - 图表组件,负责条形图、折线图、指标卡片和可切换图表。
|   |   |-- decorations/
|   |   |   |-- Icon.jsx - RemixIcon 图标组件,用于页面内可替换 icon slot。
|   |   |   |-- index.jsx - 装饰组件,包含图标和分割线等视觉元素。
|   |   |   `-- Rule.jsx - 装饰组件,包含图标和分割线等视觉元素。
|   |   |-- diagrams/
|   |   |   |-- index.jsx - 图解组件,负责地图、关系图和系统图等结构表达。
|   |   |   `-- RelationMap.jsx - 图解组件,负责地图、关系图和系统图等结构表达。
|   |   |-- media/
|   |   |   |-- ImageGrid.jsx - 媒体组件,负责图片/视频框、截图槽位和媒体网格。
|   |   |   |-- index.jsx - 媒体组件,负责图片/视频框、截图槽位和媒体网格。
|   |   |   `-- MediaFrame.jsx - 媒体组件,负责图片/视频框、截图槽位和媒体网格。
|   |   |-- metrics/
|   |   |   |-- index.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |   |-- MetricRow.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |   `-- StatGrid.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |-- report/
|   |   |   |-- index.jsx - React 生成层源码。
|   |   |   |-- primitives.jsx - React 生成层源码。
|   |   |   |-- Report01Cover.jsx - React 生成层源码。
|   |   |   |-- Report02Overview.jsx - React 生成层源码。
|   |   |   |-- Report03Agenda.jsx - React 生成层源码。
|   |   |   |-- Report04Q1Brand.jsx - React 生成层源码。
|   |   |   |-- Report08Pipeline.jsx - React 生成层源码。
|   |   |   |-- Report09Channels.jsx - React 生成层源码。
|   |   |   |-- Report10BrandLift.jsx - React 生成层源码。
|   |   |   |-- Report11ContentEngine.jsx - React 生成层源码。
|   |   |   |-- Report13Worked.jsx - React 生成层源码。
|   |   |   |-- Report14Misses.jsx - React 生成层源码。
|   |   |   |-- Report15Priorities.jsx - React 生成层源码。
|   |   |   `-- Report16Closing.jsx - React 生成层源码。
|   |   |-- shell/
|   |   |   |-- Background.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Canvas.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Chrome.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Footer.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- index.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   `-- SlideShell.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |-- style1/
|   |   |   |-- index.jsx - style1 布局组件统一导出口。
|   |   |   |-- primitives.jsx - style1 布局共享基础件。
|   |   |   |-- Style1_01Cover.jsx - style1 潮流色彩报告第 1 页封面布局组件。
|   |   |   |-- Style1_02Data.jsx - style1 潮流色彩报告第 2 页数据柱状图布局组件。
|   |   |   |-- Style1_03Naming.jsx - style1 潮流色彩报告第 3 页颜色命名排版布局组件。
|   |   |   |-- Style1_04Brand.jsx - style1 潮流色彩报告第 4 页品牌矩阵布局组件。
|   |   |   |-- Style1_05Cast.jsx - style1 潮流色彩报告第 5 页角色合影布局组件。
|   |   |   `-- Style1_06End.jsx - style1 潮流色彩报告第 6 页结语布局组件。
|   |   |-- style2/
|   |   |   |-- index.jsx - style2 布局组件统一导出口。
|   |   |   |-- primitives.jsx - style2 布局共享基础件。
|   |   |   |-- Style2_01Cover.jsx - style2 幕間影像年鑑第 1 页封面布局组件。
|   |   |   |-- Style2_02Manifesto.jsx - style2 幕間影像年鑑第 2 页引言布局组件。
|   |   |   |-- Style2_03Data.jsx - style2 幕間影像年鑑第 3 页数据图表布局组件。
|   |   |   |-- Style2_04Editorial.jsx - style2 幕間影像年鑑第 4 页文章排版布局组件。
|   |   |   |-- Style2_05Visual.jsx - style2 幕間影像年鑑第 5 页视觉章节布局组件。
|   |   |   `-- Style2_06End.jsx - style2 幕間影像年鑑第 6 页谢幕布局组件。
|   |   |-- text/
|   |   |   |-- index.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   |-- KickerTitle.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   |-- MetaRow.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   `-- QuoteBlock.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |-- timelines/
|   |   |   |-- index.jsx - 时间线与流程组件。
|   |   |   `-- Pipeline.jsx - 时间线与流程组件。
|   |   |-- xhs/
|   |   |   |-- index.jsx - React 生成层源码。
|   |   |   |-- primitives.jsx - React 生成层源码。
|   |   |   `-- XhsDeckOne.jsx - React 生成层源码。
|   |   |-- xhs2/
|   |   |   |-- index.jsx - React 生成层源码。
|   |   |   |-- primitives.jsx - React 生成层源码。
|   |   |   `-- Xhs2Deck.jsx - React 生成层源码。
|   |   |-- xhs3/
|   |   |   |-- index.jsx - 小红书分享3布局组件。
|   |   |   |-- primitives.jsx - 小红书分享3布局组件。
|   |   |   `-- Xhs3Deck.jsx - 小红书分享3布局组件。
|   |   `-- index.jsx - React 生成层源码。
|   |-- tokens/
|   |   |-- font-weights.js - 组件生成层 token 选项。
|   |   |-- fonts.js - 组件生成层 token 选项。
|   |   |-- index.js - 组件生成层 token 选项。
|   |   |-- motion.js - 组件生成层 token 选项。
|   |   |-- spacing.js - 组件生成层 token 选项。
|   |   |-- themes.js - 组件生成层 token 选项。
|   |   `-- typography.js - 组件生成层 token 选项。
|   |-- view-model/
|   |   |-- context.jsx - Slide ViewModel 的 React Context,让 SlideShell 能给每页注入稳定 VM 标识。
|   |   `-- index.jsx - Deck ViewModel 构建层,把 deck model 解析为 slide view model、token 状态和可序列化运行时模型。
|   |-- deckComposer.jsx - 目标 deck 编排器,把用户目标 JSON 计划映射为已登记布局组件组合。
|   |-- options.jsx - 选项注册表,集中登记主题色、字体组合、字号、间距、动效和页面版式,slide() 返回可组合的 slide model。
|   `-- renderDeck.jsx - 核心渲染器,先构建 Deck ViewModel,再把 React slides 注入模板并替换 CSS 变量、注入预览控制器选项。
|-- .gitignore - 忽略本地依赖、生成产物和系统临时文件。
|-- AGENTS.md - 项目级 Agent 记忆,记录本仓库长期遵守的实现约束。
|-- package-lock.json - npm 依赖锁定文件。
|-- package.json - npm 脚本和 React/tsx 依赖声明。
|-- README.md - 项目入口说明,包含快速开始、当前选项和文档索引。
`-- SKILL.md - 给 Agent 使用的 skill 说明,定义 PPT 生成流程和约束。
```
