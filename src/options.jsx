import React from 'react';
import {
  SwissClosing,
  SwissCover,
  SwissHBarSlide,
  SwissImageHeroSlide,
  SwissKpiTowerSlide,
  SwissSixCellsSlide,
  SwissTimelineSlide,
} from './components/swiss.jsx';

export const THEME_OPTIONS = {
  ikb: {
    label: '克莱因蓝 IKB',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#002FA7',
      '--accent-rgb': '0,47,167',
      '--accent-on': '#ffffff',
      '--accent-bright': '#5B7BFF',
    },
  },
  lemon: {
    label: '柠檬黄',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#FFD500',
      '--accent-rgb': '255,213,0',
      '--accent-on': '#0a0a0a',
      '--accent-bright': '#FFD500',
    },
  },
  green: {
    label: '柠檬绿',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#C5E803',
      '--accent-rgb': '197,232,3',
      '--accent-on': '#0a0a0a',
      '--accent-bright': '#C5E803',
    },
  },
  orange: {
    label: '安全橙',
    vars: {
      '--paper': '#fafaf8',
      '--paper-rgb': '250,250,248',
      '--ink': '#0a0a0a',
      '--ink-rgb': '10,10,10',
      '--grey-1': '#f0f0ee',
      '--grey-2': '#d4d4d2',
      '--grey-3': '#737373',
      '--accent': '#FF6B35',
      '--accent-rgb': '255,107,53',
      '--accent-on': '#ffffff',
      '--accent-bright': '#FF6B35',
    },
  },
};

export const FONT_OPTIONS = {
  inter: {
    label: 'Inter / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Inter","Helvetica Neue","Helvetica","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"PingFang SC","Hiragino Sans GB","Source Han Sans SC","Noto Sans SC","Microsoft YaHei UI","Microsoft YaHei","微软雅黑",sans-serif',
      '--mono': '"JetBrains Mono","IBM Plex Mono","SF Mono","Cascadia Code","Consolas","Courier New",ui-monospace,monospace',
    },
  },
  system: {
    label: 'System UI / Microsoft YaHei / Consolas',
    vars: {
      '--sans': '"Helvetica Neue","Arial","Segoe UI Variable","Segoe UI",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","PingFang SC",sans-serif',
      '--mono': '"Consolas","SF Mono","Cascadia Code","Courier New",ui-monospace,monospace',
    },
  },
  compact: {
    label: 'Helvetica Compact / Noto Sans SC / JetBrains Mono',
    vars: {
      '--sans': '"Helvetica Neue","Helvetica","Arial Narrow","Arial",system-ui,-apple-system,sans-serif',
      '--sans-zh': '"Noto Sans SC","PingFang SC","Microsoft YaHei UI","Microsoft YaHei",sans-serif',
      '--mono': '"JetBrains Mono","SF Mono","Consolas","Courier New",ui-monospace,monospace',
    },
  },
};

export const LAYOUT_OPTIONS = {
  cover: {
    label: 'Cover',
    dataLayout: 'SWISS-COVER-ASCII',
    component: SwissCover,
  },
  timeline: {
    label: 'Vertical Timeline + KPI',
    dataLayout: 'S02',
    component: SwissTimelineSlide,
  },
  sixCells: {
    label: 'Six Cells',
    dataLayout: 'S04',
    component: SwissSixCellsSlide,
  },
  kpiTower: {
    label: 'KPI Tower',
    dataLayout: 'S06',
    component: SwissKpiTowerSlide,
  },
  hBar: {
    label: 'Horizontal Bar Chart',
    dataLayout: 'S07',
    component: SwissHBarSlide,
  },
  imageHero: {
    label: 'Image Hero',
    dataLayout: 'S22',
    component: SwissImageHeroSlide,
  },
  closing: {
    label: 'Closing Manifesto',
    dataLayout: 'SWISS-CLOSING-ASCII',
    component: SwissClosing,
  },
};

export const DEFAULT_THEME = 'ikb';
export const DEFAULT_FONT = 'inter';

export function slide(layoutName, props) {
  const option = LAYOUT_OPTIONS[layoutName];
  if (!option) {
    throw new Error(`Unknown layout "${layoutName}". Choose one of: ${Object.keys(LAYOUT_OPTIONS).join(', ')}`);
  }
  const Component = option.component;
  return <Component {...props} />;
}

export function resolveOption(registry, name, fallback, label) {
  const key = name ?? fallback;
  const option = registry[key];
  if (!option) {
    throw new Error(`Unknown ${label} "${key}". Choose one of: ${Object.keys(registry).join(', ')}`);
  }
  return { key, option };
}
