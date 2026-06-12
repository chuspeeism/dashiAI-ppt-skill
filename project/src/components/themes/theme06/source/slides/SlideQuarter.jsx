// ============================================================================
// SlideQuarter.jsx — P17 / P18 季度拆解 / Period Breakdown Card
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// One generic "period breakdown" page. Drives any single period (a quarter, a
// month, a region…): an oversized period token + a hero figure + supporting
// metrics + a peer-context mini chart. Registered twice in the demo deck (Q1
// chart layout, Q2 table layout) with content passed as props — same component,
// different data, exactly the migration model.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   periodLabel,periodCaption                      content — big token + caption
//   hero ({value,unit,label})                      content — hero figure
//   delta ({value,dir:'up'|'down'|'flat',label})   content — QoQ change pill
//   metrics ({k,v}[])                              content — supporting metrics
//   context ({label,value}[])                      content — peer periods for mini chart
//   layout (enum)          VISUAL  'chart' | 'table'  (metrics presentation)
//   metricCount (int 2..4) VISUAL  supporting metrics shown
//   showTrend (bool)       VISUAL  peer-context mini chart
//   showDelta (bool)       VISUAL  QoQ change pill (decorative data)
//   focusEnabled (bool)    VISUAL  emphasise one peer period
//   focusIndex (int)       VISUAL  which peer period (usually = this one)
//   accent (color)         VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-qtr-css')) {
    const css = `
    .kx-qtr-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-qtr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-qtr-title{font-size:68px;}
    .kx-qtr-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-qtr-main{flex:1;min-height:0;display:grid;grid-template-columns:0.92fr 1.08fr;column-gap:64px;
      padding:32px 0 8px;}
    /* left: period token + hero */
    .kx-qtr-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:56px;}
    .kx-qtr-token{font-family:var(--kx-disp);font-weight:900;font-size:230px;line-height:.8;letter-spacing:-.03em;
      color:var(--kx-accent);margin:-10px 0 0 -6px;}
    .kx-qtr-tcap{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:6px;}
    .kx-qtr-hero{margin-top:auto;}
    .kx-qtr-hv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;
      letter-spacing:-.02em;line-height:.86;}
    .kx-qtr-hv .kx-n{font-size:150px;}
    .kx-qtr-hv .kx-u{font-size:48px;color:var(--kx-mute);}
    .kx-qtr-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
      letter-spacing:.04em;margin-top:12px;}
    .kx-qtr-delta{display:inline-flex;align-items:center;gap:12px;margin-top:24px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:30px;font-weight:700;padding:10px 18px;
      background:var(--kx-accent);color:var(--kx-ink);letter-spacing:.02em;}
    .kx-qtr-delta.kx-down{background:#ff5a3c;color:#fff;}
    .kx-qtr-delta.kx-flat{background:rgba(255,255,255,.06);color:var(--kx-mute);}
    .kx-qtr-delta .kx-dl{font-size:22px;font-weight:400;opacity:.7;text-transform:uppercase;}
    .kx-qtr-delta .kx-ar{font-size:24px;}
    /* right column */
    .kx-qtr-right{display:flex;flex-direction:column;min-height:0;gap:30px;}
    .kx-qtr-mcards{display:grid;gap:0;border-top:1px solid var(--kx-line);}
    .kx-qtr-mcard{padding:22px 26px 18px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:8px;}
    .kx-qtr-mcard:last-child{border-right:none;}
    .kx-qtr-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:54px;line-height:.9;letter-spacing:-.02em;}
    .kx-qtr-mcard .kx-mk{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* table variant */
    .kx-qtr-table{display:flex;flex-direction:column;border-top:1px solid var(--kx-line);}
    .kx-qtr-trow{display:flex;justify-content:space-between;align-items:baseline;gap:24px;
      padding:20px 2px;border-bottom:1px solid var(--kx-line);}
    .kx-qtr-trow .kx-tk{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-qtr-trow .kx-tv{font-family:var(--kx-disp);font-weight:800;font-size:44px;line-height:1;letter-spacing:-.01em;}
    .kx-qtr-trow:nth-child(1) .kx-tv{color:var(--kx-accent);}
    /* context mini chart */
    .kx-qtr-ctx{margin-top:auto;}
    .kx-qtr-ctx-cap{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;margin-bottom:14px;}
    .kx-qtr-bars{display:flex;align-items:flex-end;gap:18px;height:150px;}
    .kx-qtr-bcol{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:10px;}
    .kx-qtr-bar{width:100%;background:#34342f;position:relative;}
    .kx-qtr-bcol.kx-on .kx-qtr-bar{background:var(--kx-accent);}
    .kx-qtr-bv{position:absolute;top:-34px;left:50%;transform:translateX(-50%);font-family:var(--kx-mono);
      font-size:24px;font-weight:700;color:var(--kx-cream);white-space:nowrap;}
    .kx-qtr-bcol.kx-on .kx-qtr-bv{color:var(--kx-accent);}
    .kx-qtr-blabel{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-qtr-bcol.kx-on .kx-qtr-blabel{color:var(--kx-accent);}
    .kx-qtr-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-qtr-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-qtr-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-qtr-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const ARROW = { up: '▲', down: '▼', flat: '→' };

  function SlideQuarter(props) {
    const p = { ...SlideQuarter.defaults, ...props };
    const metrics = p.metrics.slice(0, Math.max(2, Math.min(p.metricCount, p.metrics.length)));
    const ctx = p.context;
    const maxV = Math.max(...ctx.map((c) => c.value));
    const fi = Math.min(p.focusIndex, ctx.length - 1);
    const d = p.delta || {};

    const left = h('div', { className: 'kx-qtr-left' },
      h('div', { className: 'kx-qtr-token' }, p.periodLabel),
      h('div', { className: 'kx-qtr-tcap' }, p.periodCaption),
      p.showDelta && d.value ? h('div', { className: 'kx-qtr-delta' + (d.dir === 'down' ? ' kx-down' : d.dir === 'flat' ? ' kx-flat' : '') },
        h('span', { className: 'kx-ar' }, ARROW[d.dir] || '→'),
        h('span', null, d.value),
        d.label ? h('span', { className: 'kx-dl' }, d.label) : null) : null,
      h('div', { className: 'kx-qtr-hero' },
        h('div', { className: 'kx-qtr-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-qtr-hl' }, p.hero.label)));

    const metricsBlock = p.layout === 'table'
      ? h('div', { className: 'kx-qtr-table' },
          metrics.map((m, i) => h('div', { key: i, className: 'kx-qtr-trow' },
            h('span', { className: 'kx-tk' }, m.k),
            h('span', { className: 'kx-tv' }, m.v))))
      : h('div', { className: 'kx-qtr-mcards', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
          metrics.map((m, i) => h('div', { key: i, className: 'kx-qtr-mcard' },
            h('span', { className: 'kx-mv' }, m.v),
            h('span', { className: 'kx-mk' }, m.k))));

    const ctxBlock = p.showTrend ? h('div', { className: 'kx-qtr-ctx' },
      h('div', { className: 'kx-qtr-ctx-cap' }, '全年对照 / FULL-YEAR CONTEXT'),
      h('div', { className: 'kx-qtr-bars' },
        ctx.map((c, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-qtr-bcol' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-qtr-bar', style: { height: ((c.value / maxV) * 100) + '%' } },
              on ? h('span', { className: 'kx-qtr-bv' }, c.value) : null),
            h('div', { className: 'kx-qtr-blabel' }, c.label));
        }))) : null;

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-qtr-pad' },
        h('div', { className: 'kx-qtr-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-qtr-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-qtr-sub' }, p.subhead)),
        h('div', { className: 'kx-qtr-main' }, left,
          h('div', { className: 'kx-qtr-right' }, metricsBlock, ctxBlock)),
        h('div', { className: 'kx-qtr-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, p.periodLabel + ' · ' + p.layout.toUpperCase()))));
  }

  SlideQuarter.defaults = {
    eyebrowId: '17', eyebrowLabel: 'QUARTER BREAKDOWN',
    title: '冷启动季度', subhead: 'Q1 融资拆解 / COLD START',
    closing: '全年热度从保守启动开始。',
    periodLabel: 'Q1', periodCaption: '全年起步阶段 / FIRST QUARTER',
    hero: { value: '162', unit: '亿$', label: 'Q1 融资额 / FUNDING' },
    delta: { value: '—', dir: 'flat', label: '环比 / QoQ' },
    metrics: [
      { k: '事件数 / DEALS', v: '18 笔' },
      { k: '平均单笔 / AVG', v: '9.0 亿' },
      { k: '最大单笔 / MAX', v: '32 亿' },
    ],
    context: [
      { label: 'Q1', value: 162 }, { label: 'Q2', value: 284 },
      { label: 'Q3', value: 318 }, { label: 'Q4', value: 206 },
    ],
    layout: 'chart', metricCount: 3, showTrend: true, showDelta: true,
    focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlideQuarter.controls = [
    { key: 'layout', label: '指标呈现', type: 'select', default: 'chart',
      options: [['chart', '图表卡'], ['table', '表格']], desc: '右侧指标的呈现形式' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 4, desc: '辅助指标的数量' },
    { key: 'showTrend', label: '全年对照图', type: 'toggle', default: true, desc: '显示/隐藏底部同侪期对照迷你图' },
    { key: 'showDelta', label: '环比标签', type: 'toggle', default: true, desc: '显示/隐藏环比变化标签（装饰数据）' },
    { key: 'focusEnabled', label: '本期高亮', type: 'toggle', default: true, desc: '是否在对照图中高亮本期', showIf: (p) => p.showTrend },
    { key: 'focusIndex', label: '高亮第几期', type: 'number', default: 0, min: 0, max: 3, desc: '被高亮的对照期序号', showIf: (p) => p.showTrend && p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // Q2 content preset (P18) — passed as props by the demo harness; the component
  // itself stays generic. Reuse in any host: <SlideQuarter {...SlideQuarter.presetQ2} />
  SlideQuarter.presetQ2 = {
    eyebrowId: '18', eyebrowLabel: 'QUARTER BREAKDOWN',
    title: '加速季度', subhead: 'Q2 融资拆解 / ACCELERATION',
    closing: 'Q2 是融资窗口打开的关键节点。',
    periodLabel: 'Q2', periodCaption: '融资窗口打开 / SECOND QUARTER',
    hero: { value: '284', unit: '亿$', label: 'Q2 融资额 / FUNDING' },
    delta: { value: '+75.3%', dir: 'up', label: '环比 / QoQ' },
    metrics: [
      { k: '事件数 / DEALS', v: '26 笔' },
      { k: '平均单笔 / AVG', v: '10.9 亿' },
      { k: '环比增长 / QoQ', v: '+75.3%' },
    ],
    context: [
      { label: 'Q1', value: 162 }, { label: 'Q2', value: 284 },
      { label: 'Q3', value: 318 }, { label: 'Q4', value: 206 },
    ],
    layout: 'table', metricCount: 3, showTrend: true, showDelta: true,
    focusEnabled: true, focusIndex: 1, accent: '#c8f135',
  };

export default SlideQuarter;
