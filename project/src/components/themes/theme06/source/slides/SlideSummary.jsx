// ============================================================================
// SlideSummary.jsx — P02 报告摘要 / Summary Dashboard
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS  (content defaults + visual controls)
//   eyebrowId,eyebrowLabel,title,subhead,summary,closing   content
//   shares ({name,v}[])     content — 赛道占比 chart data
//   metrics ({n,c}[])       content — bottom metric cards
//   keywords (string[])     content — keyword strip
//   metricCount (int 2..4)  VISUAL  number of metric cards shown
//   focusEnabled (bool)     VISUAL  emphasise one metric card
//   focusIndex (int)        VISUAL  which metric card
//   chartType (enum)        VISUAL  'bars' | 'stack' | 'dots'
//   showCaption (bool)      VISUAL  show keyword strip + closing
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxBars, KxChip, KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-sum-css')) {
    const css = `
    .kx-sum-pad{display:flex;flex-direction:column;height:100%;}
    .kx-sum-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:30px;border-bottom:1px solid var(--kx-line-d);}
    .kx-sum-title{font-size:78px;}
    .kx-sum-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-sum-mid{display:grid;grid-template-columns:1fr 760px;gap:72px;padding:44px 0;flex:1;align-content:center;}
    .kx-sum-summary{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:1.26;letter-spacing:.005em;}
    .kx-sum-summary b{color:var(--kx-ink);background:var(--kx-accent);padding:0 .12em;}
    .kx-sum-kw{display:flex;flex-wrap:wrap;gap:12px;margin-top:34px;}
    .kx-sum-panel{align-self:start;}
    .kx-sum-panel-h{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
      text-transform:uppercase;letter-spacing:.05em;margin-bottom:22px;white-space:nowrap;
      display:flex;justify-content:space-between;border-bottom:1px solid var(--kx-line-d);padding-bottom:12px;}
    .kx-sum-bar{display:flex;align-items:center;gap:18px;margin-bottom:16px;}
    .kx-sum-bar .kx-nm{font-family:var(--kx-mono);font-size:24px;width:160px;flex:none;letter-spacing:.02em;}
    .kx-sum-bar .kx-track{flex:1;height:18px;background:rgba(0,0,0,.07);position:relative;}
    .kx-sum-bar .kx-fill{height:100%;background:var(--kx-ink);min-width:3px;}
    .kx-sum-bar.kx-on .kx-fill{background:var(--kx-accent);}
    .kx-sum-bar .kx-pct{font-family:var(--kx-mono);font-weight:700;font-size:24px;width:78px;text-align:right;}
    .kx-sum-stack{display:flex;height:54px;width:100%;border:1px solid var(--kx-line-d);}
    .kx-sum-stack .kx-seg{height:100%;display:flex;align-items:center;justify-content:center;
      font-family:var(--kx-mono);font-size:20px;color:#fff;overflow:hidden;border-right:1px solid rgba(255,255,255,.25);}
    .kx-sum-stack-legend{display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:20px;}
    .kx-sum-stack-legend span{font-family:var(--kx-mono);font-size:22px;display:flex;align-items:center;gap:8px;}
    .kx-sum-stack-legend i{width:14px;height:14px;display:block;}
    .kx-sum-dots{display:grid;grid-template-columns:repeat(20,1fr);gap:6px;}
    .kx-sum-dots i{width:100%;aspect-ratio:1;display:block;}
    .kx-sum-cards{display:grid;gap:0;border-top:1px solid var(--kx-line-d);}
    .kx-sum-card{padding:30px 30px 30px 0;border-right:1px solid var(--kx-line-d);
      display:flex;flex-direction:column;gap:14px;}
    .kx-sum-card:last-child{border-right:none;}
    .kx-sum-card .kx-stat-n{font-size:80px;}
    .kx-sum-foot{display:flex;justify-content:space-between;align-items:center;padding-top:24px;}
    `;
    const s = document.createElement('style'); s.id = 'kx-sum-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const PALETTE = (a) => ['#0c0c0c', '#3a3a36', '#6f6f66', '#a8a89e', a];

  function Chart({ shares, type, accent, focusIndex, focusEnabled }) {
    if (type === 'stack') {
      const cols = PALETTE(accent);
      return h('div', null,
        h('div', { className: 'kx-sum-stack' },
          shares.map((s, i) => h('div', { key: i, className: 'kx-seg',
            style: { width: s.v + '%', background: cols[i % cols.length] } }, s.v >= 10 ? s.v + '%' : ''))),
        h('div', { className: 'kx-sum-stack-legend' },
          shares.map((s, i) => h('span', { key: i },
            h('i', { style: { background: cols[i % cols.length] } }), s.name + ' ' + s.v + '%'))));
    }
    if (type === 'dots') {
      const total = 100, cells = 100;
      let acc = []; shares.forEach((s, i) => { for (let k = 0; k < Math.round(s.v); k++) acc.push(i); });
      acc = acc.slice(0, cells); while (acc.length < cells) acc.push(shares.length - 1);
      const cols = PALETTE(accent);
      return h('div', null,
        h('div', { className: 'kx-sum-dots' },
          acc.map((idx, i) => h('i', { key: i, style: { background: cols[idx % cols.length] } }))),
        h('div', { className: 'kx-sum-stack-legend' },
          shares.map((s, i) => h('span', { key: i },
            h('i', { style: { background: cols[i % cols.length] } }), s.name + ' ' + s.v + '%'))));
    }
    // default: labeled horizontal bars
    const max = Math.max(...shares.map((s) => s.v));
    return h('div', null,
      shares.map((s, i) => h('div', { key: i, className: 'kx-sum-bar' + (focusEnabled && i === focusIndex ? ' kx-on' : '') },
        h('span', { className: 'kx-nm' }, s.name),
        h('span', { className: 'kx-track' }, h('span', { className: 'kx-fill', style: { width: (s.v / max * 100) + '%' } })),
        h('span', { className: 'kx-pct' }, s.v + '%'))));
  }

  function SlideSummary(props) {
    const p = { ...SlideSummary.defaults, ...props };
    const cards = p.metrics.slice(0, Math.max(1, p.metricCount));
    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-sum-pad' },
        h('div', { className: 'kx-sum-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-sum-title', style: { marginTop: '18px' } }, p.title)),
          h('div', { className: 'kx-sum-sub' }, p.subhead)),
        h('div', { className: 'kx-sum-mid' },
          h('div', null,
            h('div', { className: 'kx-sum-summary', dangerouslySetInnerHTML: { __html: p.summary } }),
            p.showCaption ? h('div', { className: 'kx-sum-kw' },
              p.keywords.map((k, i) => h(KxChip, { key: i }, k))) : null),
          h('div', { className: 'kx-sum-panel' },
            h('div', { className: 'kx-sum-panel-h' }, h('span', null, '赛道融资占比'), h('span', null, 'SHARE %')),
            h(Chart, { shares: p.shares, type: p.chartType, accent: p.accent,
              focusIndex: p.focusIndex, focusEnabled: false }))),
        h('div', { className: 'kx-sum-cards', style: { gridTemplateColumns: `repeat(${cards.length},1fr)` } },
          cards.map((m, i) => {
            const on = p.focusEnabled && i === p.focusIndex;
            return h('div', { key: i, className: 'kx-sum-card' },
              h('div', { className: 'kx-stat-n', style: on ? { color: 'var(--kx-accent)' } : null }, m.n),
              h('div', { className: 'kx-stat-c' }, m.c),
              h(KxBars, { rows: 6, dark: on ? 6 : 3, style: { marginTop: 'auto' } }));
          })),
        p.showCaption ? h('div', { className: 'kx-sum-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, p.closing),
          h('div', { className: 'kx-eyebrow' }, h('span', { className: 'kx-eb-label' }, 'NEXT → 报告结构'))) : null));
  }

  SlideSummary.defaults = {
    eyebrowId: '02', eyebrowLabel: 'OVERVIEW',
    title: '报告摘要', subhead: '2024 全年 · 资本大年',
    summary: '2024 年美国 AI 初创公司吸纳约 <b>970 亿美元</b> 风险投资，单笔 ≥ 1 亿美元的大额融资事件达 <b>97 笔</b>。',
    closing: '资本仍在涌入 AI，但下一阶段会从赌叙事转向看兑现。',
    shares: [
      { name: '通用大模型', v: 43.3 }, { name: '垂直应用', v: 25.3 }, { name: '基础设施', v: 16.3 },
      { name: 'AI 芯片', v: 10.0 }, { name: '其他', v: 5.1 },
    ],
    metrics: [
      { n: '$97B', c: '全年融资 / TOTAL' },
      { n: '97', c: '大额事件 / DEALS ≥$100M' },
      { n: '$1.0B', c: '平均单笔 / AVG TICKET' },
      { n: '63.9%', c: '湾区占比 / BAY AREA' },
    ],
    keywords: ['赢家通吃', 'AGI 叙事', '地理护城河', '估值泡沫', '退潮看兑现'],
    metricCount: 4, focusEnabled: true, focusIndex: 0, chartType: 'bars', showCaption: true, accent: '#c8f135',
  };

  SlideSummary.controls = [
    { key: 'metricCount', label: '指标卡数量', type: 'number', default: 4, min: 2, max: 4, desc: '底部核心指标卡的数量' },
    { key: 'focusEnabled', label: '指标重点高亮', type: 'toggle', default: true, desc: '是否高亮一张指标卡' },
    { key: 'focusIndex', label: '高亮第几张', type: 'number', default: 0, min: 0, max: 3, desc: '被高亮的指标卡序号', showIf: (p) => p.focusEnabled },
    { key: 'chartType', label: '占比图表类型', type: 'select', default: 'bars',
      options: [['bars', '条形'], ['stack', '堆叠条'], ['dots', '点阵']], desc: '右侧赛道占比图表的呈现形式' },
    { key: 'showCaption', label: '装饰文案', type: 'toggle', default: true, desc: '显示/隐藏关键词与底部说明（装饰文案）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideSummary;
