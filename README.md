# Dashi PPT Skill

一个用**登记选项 + React 组件生成层**生成静态 HTML 横向翻页 PPT 的本地 skill。

最终产物仍是普通静态文件:

```text
output/my-deck/ppt/
├── index.html
├── assets/motion.min.js
└── images/
```

浏览器直接打开 `index.html` 即可演示。React 不进入最终运行时。

## 核心思路

每个可变部分都是多选一:

- `theme`: 从主题色选项中选一个
- `fontSet`: 从字体组合中选一个
- 每一页: 从页面版式选项中选一个

主题、字体、字号、间距和动效 token 在 [src/tokens/](/Users/jadon7/Documents/SynologyDrive/code/项目研究/guizang-ppt-skill-main/src/tokens/index.js)。页面版式登记在 [src/options.jsx](/Users/jadon7/Documents/SynologyDrive/code/项目研究/guizang-ppt-skill-main/src/options.jsx)。可组合基础组件按职责放在 [src/components/](/Users/jadon7/Documents/SynologyDrive/code/项目研究/guizang-ppt-skill-main/src/components/index.jsx),项目布局 preset 分别在 `components/blacktech/`、`components/report/`、`components/xhs/`、`components/xhs2/`、`components/xhs3/`、`components/style1/` 和 `components/style2/`。

## 快速开始

```bash
npm install
npm run render:demo
npm run validate:swiss -- output/component-demo/ppt/index.html
```

渲染全部已登记布局总览:

```bash
npm run showcase:update
```

渲染指定 deck:

```bash
npm run render:deck -- examples/component-decks/all-layouts-showcase.jsx output/all-layouts/ppt/index.html
```

按用户目标渲染组件组合 deck:

```bash
npm run render:goal -- examples/goal-decks/annual-review.json output/goal-demo/ppt/index.html
```

渲染当前默认 demo:

```bash
npm run render:examples
```

## 示例 Deck

| 文件 | 内容主题 | 选项特点 |
|---|---|---|
| `examples/goal-decks/annual-review.json` | 年度经营复盘目标计划 | 由 `render:goal` 根据 role/layout + props 组合组件 |
| `examples/component-decks/all-layouts-showcase.jsx` | 全部布局总览 | 顺序展示当前全部已登记布局 |
| `examples/goal-decks/portfolio.json` | 个人作品集 | 由 `render:goal` 根据用户目标组合组件 |

## 当前选项

主题色:

- `light`: 浅色背景
- `dark`: 深色背景
- `colorful`: 多彩
- `acidIndigo`: 酸绿靛蓝
- `vermilionPaper`: 赤橙米白
- `neonTerminal`: 霓光终端

字体组合:

- `cnReport`: 标题字中文: 苹方 / 正文: 苹方 / 数字字体: DIN
- `cnEditorial`: 标题字中文: 宋体 / 正文: 思源黑体 / 数字字体: Georgia
- `cnStrong`: 标题字中文: 思源黑体 Heavy / 正文: 苹方 / 数字字体: Avenir

字号:

- `large`: 大字号
- `medium`: 中字号
- `small`: 小字号

字重:

- `light`: 轻字重
- `regular`: 标准字重
- `bold`: 粗字重

页面版式:

- `bt01` 到 `bt12`: 黑科技技能分享项目提炼出的 12 个布局组件
- `rp01`、`rp02`、`rp03`、`rp04`、`rp08`、`rp09`、`rp10`、`rp11`、`rp13`、`rp14`、`rp15`、`rp16`: 汇报 PPT 项目保留的 12 个布局组件
- `xhs01`、`xhs02`、`xhs04`、`xhs12`、`xhs15`、`xhs17`、`xhs18`、`xhs19`、`xhs22`、`xhs25`: 小红书分享项目保留的 10 个布局组件
- `xhs2_01`、`xhs2_02`、`xhs2_03`、`xhs2_04`、`xhs2_05`、`xhs2_11`、`xhs2_15`、`xhs2_33`、`xhs2_34`: 小红书分享 2 项目保留的 9 个布局组件
- `xhs3_01` 到 `xhs3_25`: 小红书分享 3 项目提炼出的 25 个布局组件
- `style1_01` 到 `style1_06`: 潮流色彩报告布局组件
- `style2_01` 到 `style2_06`: 幕間影像年鑑布局组件

## 项目结构

```text
assets/
  screenshot-backgrounds/style-a/
  screenshot-backgrounds/style-b/
  template-swiss.html
  motion.min.js
src/
  tokens/
  options.jsx
  renderDeck.jsx
  components/
    shell/
    text/
    media/
    metrics/
    charts/
    timelines/
    cards/
    decorations/
    diagrams/
    blacktech/
    report/
    xhs/
    xhs2/
    xhs3/
    style1/
    style2/
scripts/
  render-deck.jsx
  validate-swiss-deck.mjs
examples/component-decks/
references/
  component-workflow.md
  themes.md
  layouts.md
  themes-swiss.md
  swiss-layout-lock.md
  layouts-swiss.md
  swiss-map-component.md
  image-prompts.md
  screenshot-framing.md
  checklist.md
```

## 验证方式

```bash
npm test
npm run render:goal -- examples/goal-decks/annual-review.json output/goal-demo/ppt/index.html
npm run validate:swiss -- output/goal-demo/ppt/index.html
```

多个 subagent 做测试时,不要只换配色。每个测试 deck 应该换内容主题、风格要求和页面组合,再比较呈现结果。

<!-- project-docs:start -->
## 项目文档

以下文档由 `npm run docs:update` 同步,提交前也会由 `.githooks/pre-commit` 自动更新。

提交前 hook 还会运行 `npm run showcase:update`,确保 `all-layouts-showcase.jsx` 覆盖当前全部已登记布局,并刷新 `output/all-components-showcase/ppt/index.html`。

- [ADR](docs/ADR.md): 当前架构决策记录
- [项目文件作用说明](docs/project-files.md): 当前 208 个源码文件的主要作用
<!-- project-docs:end -->
