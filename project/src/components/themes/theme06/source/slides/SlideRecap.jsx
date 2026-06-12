// ============================================================================
// SlideRecap.jsx — 全景速览 / Year-in-One-View Stat Wall (big_number_page, reusable)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic multi-stat "headline wall" — distinct from the single-hero
// SlideBigNumber: it composes N spine numbers into one dramatic board. One cell
// is pulled out as a solid-lime hero; the rest sit as outlined stat cells.
// `layout` switches between a hero+mosaic board, an even grid, and a single
// stat band (row). In the demo deck it recaps the whole report's 2024 spine
// figures; reusable for any "the year/quarter in N big numbers" recap page.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   watermark                  ghosted background word (decorative)
//   thesis (html)              the lead statement (display type, <b> = lime)
//   stats ({v,k,en}[])         the headline numbers (v=figure, k=caption, en=Latin sub)
//   footRight                  mono caption at the foot-right (decorative)
// PROPS (visual — all map 1:1 to .controls)
//   statCount (int 2..5)       stat cells shown
//   layout (enum)              'hero' | 'grid' | 'row'
//   focusEnabled (bool)        pull one stat out as the lime hero
//   focusIndex (int)           which stat is the hero/emphasis
//   showWatermark (bool)       ghosted background word
//   showThesis (bool)          the lead statement line
//   showCaption (bool)         per-stat Latin sub-captions (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-rcp-css')) {
  const css = `
  .kx-rcp-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-rcp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-rcp-title{font-size:64px;}
  .kx-rcp-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-rcp-tag{font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-mute-2);text-align:right;white-space:nowrap;}
  .kx-rcp-tag b{color:var(--kx-accent);}

  .kx-rcp-thesis{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:1.16;letter-spacing:-.01em;
    margin:24px 0 2px;max-width:1560px;text-wrap:pretty;}
  .kx-rcp-thesis b{color:var(--kx-accent);}

  .kx-rcp-wm{top:8px;right:-10px;font-size:300px;text-align:right;}

  /* ---- shared stat cell ---- */
  .kx-rcp-cell{position:relative;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:30px 32px;display:flex;flex-direction:column;justify-content:space-between;gap:22px;overflow:hidden;min-width:0;}
  .kx-rcp-cell.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);color:var(--kx-ink);}
  .kx-rcp-v{font-family:var(--kx-disp);font-weight:800;line-height:.86;letter-spacing:-.025em;
    overflow-wrap:anywhere;color:var(--kx-accent);}
  .kx-rcp-cell.kx-on .kx-rcp-v{color:var(--kx-ink);}
  .kx-rcp-meta{display:flex;flex-direction:column;gap:6px;}
  .kx-rcp-k{font-family:var(--kx-disp);font-weight:900;font-size:26px;letter-spacing:-.005em;line-height:1.04;}
  .kx-rcp-e{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;}
  .kx-rcp-cell.kx-on .kx-rcp-e{color:rgba(12,12,12,.62);}
  .kx-rcp-cell .kx-rcp-ghost{position:absolute;right:-8px;bottom:-30px;font-family:var(--kx-disp);font-weight:900;
    font-size:150px;line-height:.7;letter-spacing:-.05em;color:currentColor;opacity:.05;pointer-events:none;}

  /* ---- hero board (asymmetric) ---- */
  .kx-rcp-board{flex:1;min-height:0;display:grid;gap:16px;margin-top:16px;}
  .kx-rcp-board.kx-hero{grid-template-columns:1.14fr 1fr;}
  .kx-rcp-big{display:flex;flex-direction:column;justify-content:space-between;gap:26px;}
  .kx-rcp-big .kx-rcp-v{font-size:170px;}
  .kx-rcp-big .kx-rcp-k{font-size:34px;}
  .kx-rcp-big .kx-rcp-e{font-size:22px;}
  .kx-rcp-rest{display:grid;gap:16px;min-height:0;}
  .kx-rcp-rest .kx-rcp-v{font-size:76px;}

  /* ---- even grid ---- */
  .kx-rcp-board.kx-grid2{grid-auto-rows:1fr;}
  .kx-rcp-board.kx-grid2 .kx-rcp-v{font-size:90px;}

  /* ---- single band (row) ---- */
  .kx-rcp-board.kx-row{display:flex;gap:0;}
  .kx-rcp-board.kx-row .kx-rcp-cell{flex:1;border:none;border-left:1px solid var(--kx-line);background:none;
    border-radius:0;padding:26px 34px 26px 30px;}
  .kx-rcp-board.kx-row .kx-rcp-cell:first-child{border-left:none;padding-left:2px;}
  .kx-rcp-board.kx-row .kx-rcp-cell.kx-on{background:none;color:inherit;}
  .kx-rcp-board.kx-row .kx-rcp-cell.kx-on .kx-rcp-v{color:var(--kx-accent);}
  .kx-rcp-board.kx-row .kx-rcp-cell.kx-on .kx-rcp-e{color:var(--kx-mute-2);}
  .kx-rcp-board.kx-row .kx-rcp-v{font-size:96px;}
  .kx-rcp-board.kx-row .kx-rcp-cell.kx-on .kx-rcp-k::after{content:'';display:block;width:54px;height:4px;
    background:var(--kx-accent);margin-top:14px;}

  .kx-rcp-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;margin-top:18px;border-top:1px solid var(--kx-line);}
  .kx-rcp-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-rcp-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-rcp-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideRecap(props) {
  const p = { ...SlideRecap.defaults, ...props };
  const stats = p.stats.slice(0, clamp(p.statCount, 2, p.stats.length));
  const fi = clamp(p.focusIndex, 0, stats.length - 1);

  const cell = (s, i, on, ghost) => h('div', { key: i, className: 'kx-rcp-cell' + (on ? ' kx-on' : '') },
    ghost ? h('div', { className: 'kx-rcp-ghost' }, String(i + 1).padStart(2, '0')) : null,
    h('div', { className: 'kx-rcp-v' }, s.v),
    h('div', { className: 'kx-rcp-meta' },
      h('div', { className: 'kx-rcp-k' }, s.k),
      p.showCaption && s.en ? h('div', { className: 'kx-rcp-e' }, s.en) : null));

  let board;
  if (p.layout === 'hero') {
    const heroI = p.focusEnabled ? fi : 0;
    const hero = stats[heroI];
    const rest = stats.filter((_, i) => i !== heroI);
    // right grid: 2 cols; if rest is odd, the last cell spans both columns
    const restCols = rest.length <= 1 ? 1 : 2;
    const restNodes = rest.map((s, i) => {
      const wide = restCols === 2 && rest.length % 2 === 1 && i === rest.length - 1;
      return h('div', { key: i, style: wide ? { gridColumn: '1 / -1' } : null }, cell(s, i, false, true));
    });
    board = h('div', { className: 'kx-rcp-board kx-hero' },
      h('div', { className: 'kx-rcp-cell kx-rcp-big' + (p.focusEnabled ? ' kx-on' : '') },
        h('div', { className: 'kx-rcp-v' }, hero.v),
        h('div', { className: 'kx-rcp-meta' },
          h('div', { className: 'kx-rcp-k' }, hero.k),
          p.showCaption && hero.en ? h('div', { className: 'kx-rcp-e' }, hero.en) : null)),
      h('div', { className: 'kx-rcp-rest', style: { gridTemplateColumns: `repeat(${restCols},1fr)` } }, restNodes));
  } else if (p.layout === 'row') {
    board = h('div', { className: 'kx-rcp-board kx-row' },
      stats.map((s, i) => cell(s, i, p.focusEnabled && i === fi, false)));
  } else {
    const cols = stats.length <= 2 ? stats.length : stats.length <= 4 ? 2 : 3;
    board = h('div', { className: 'kx-rcp-board kx-grid2', style: { gridTemplateColumns: `repeat(${cols},1fr)` } },
      stats.map((s, i) => cell(s, i, p.focusEnabled && i === fi, true)));
  }

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    p.showWatermark ? h('div', { className: 'kx-wm kx-rcp-wm' }, p.watermark) : null,
    h('div', { className: 'kx-pad kx-rcp-pad' },
      h('div', { className: 'kx-rcp-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-rcp-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-rcp-sub' }, p.subhead)),
        h('div', { className: 'kx-rcp-tag' }, h('b', null, p.eyebrowLabel))),
      p.showThesis ? h('div', { className: 'kx-rcp-thesis', dangerouslySetInnerHTML: { __html: p.thesis } }) : null,
      board,
      h('div', { className: 'kx-rcp-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (stats.length + ' STATS · ' + p.layout.toUpperCase())))));
}

SlideRecap.defaults = {
  eyebrowId: '81', eyebrowLabel: 'YEAR IN REVIEW',
  title: '全景速览', subhead: '2024 · 一年回望 / YEAR IN ONE VIEW',
  closing: '资本仍在涌入，但下一阶段只认兑现。',
  watermark: '2024',
  thesis: '一年 <b>970 亿美元</b> 涌入美国 AI，<b>97 笔</b> 大额交易，重新定义了资本的重心。',
  stats: [
    { v: '970亿$', k: '全年融资', en: '2024 VC INTO US AI' },
    { v: '97 笔', k: '大额事件', en: 'ROUNDS ≥ $100M' },
    { v: '10亿$', k: '平均单笔', en: 'PER MEGA DEAL' },
    { v: '63.9%', k: '湾区占比', en: 'BAY AREA SHARE' },
    { v: '71.2%', k: 'Top-50 集中度', en: 'CAPITAL CONCENTRATION' },
  ],
  footRight: '4 STATS · RECAP',
  statCount: 4, layout: 'hero', focusEnabled: true, focusIndex: 0,
  showWatermark: true, showThesis: true, showCaption: true, accent: '#c8f135',
};

SlideRecap.controls = [
  { key: 'statCount', label: '数字数量', type: 'number', default: 4, min: 2, max: 5, desc: '展示的大数字单元数量' },
  { key: 'layout', label: '排布形态', type: 'select', default: 'hero',
    options: [['hero', '主数字 + 阵列'], ['grid', '均分网格'], ['row', '单行数字带']], desc: '大数字墙的版式' },
  { key: 'focusEnabled', label: '主数字高亮', type: 'toggle', default: true, desc: '是否把某个数字拉成 lime 主数字（hero 时即左侧大格）' },
  { key: 'focusIndex', label: '主数字第几个', type: 'number', default: 0, min: 0, max: 4, desc: '作为主数字/强调的序号', showIf: (p) => p.focusEnabled },
  { key: 'showWatermark', label: '背景大字', type: 'toggle', default: true, desc: '显示/隐藏背景水印字（装饰）' },
  { key: 'showThesis', label: '引导句', type: 'toggle', default: true, desc: '显示/隐藏顶部一句话引导（装饰文案）' },
  { key: 'showCaption', label: '英文小注', type: 'toggle', default: true, desc: '显示/隐藏每个数字的英文小注（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideRecap;
