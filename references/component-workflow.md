# 组件选项工作流

本项目采用选项注册表生成 PPT。目标是让 Agent 在明确边界内组合,而不是手写长 HTML。

## 注册表

所有选项都在 `src/options.jsx`:

- `THEME_OPTIONS`: deck 级主题色,一个 deck 只选一个
- `FONT_OPTIONS`: deck 级字体组合,一个 deck 只选一个
- `LAYOUT_OPTIONS`: 页级版式,每页从中选一个

## Deck 配置

```jsx
import React from 'react';
import { slide } from '../../src/options.jsx';

export default {
  style: 'swiss',
  theme: 'ikb',
  fontSet: 'inter',
  title: 'Deck 标题',
  slides: [
    slide('cover', {
      title: '封面标题',
      kicker: 'SECTION LABEL',
      lead: '一段副标题。',
    }),
    slide('timeline', {
      page: '02 / 05',
      title: '时间线标题',
      kicker: 'FLOW',
      nodes: [],
      metrics: [],
    }),
  ],
};
```

## 生成命令

```bash
npm run render:deck -- examples/component-decks/ai-ops-review.jsx output/ai-ops/ppt/index.html
npm run validate:swiss -- output/ai-ops/ppt/index.html
```

## 新增选项

新增主题:

1. 在 `THEME_OPTIONS` 加 key。
2. 写完整 CSS 变量,尤其是 `--accent` 和 `--accent-on`。
3. 用至少一份示例 deck 验证可读性。

新增字体组合:

1. 在 `FONT_OPTIONS` 加 key。
2. 同时提供 `--sans`、`--sans-zh`、`--mono`。
3. 检查中文标题和数字页。

新增版式:

1. 在 `src/components/swiss.jsx` 写组件。
2. 组件输出合法 `data-layout`。
3. 在 `LAYOUT_OPTIONS` 登记 key。
4. 必要时更新 `scripts/validate-swiss-deck.mjs`。

## Subagent 测试

测试不能只换颜色。每个 subagent 需要生成不同内容主题和页面组合:

- AI/技术复盘:偏 `timeline`、`kpiTower`、`hBar`
- 城市/生态报告:偏 `imageHero`、`sixCells`、`timeline`
- 零售/消费简报:偏 `hBar`、`kpiTower`、`imageHero`

比较结果时看:

- 内容是否匹配所选版式
- 主题色是否服务内容语气
- 字体组合是否影响密度和可读性
- 页面组合是否有节奏,而不是只是换色
