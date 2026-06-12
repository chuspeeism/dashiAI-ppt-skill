// ============================================================================
// SlideDealStruct.jsx — P51 复杂交易结构 / Deal Structure Breakdown
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "one whole decomposed into structural parts" page. A single mega
// deal is broken into weighted components (cash / cloud credits / strategic /
// debt …) rendered as a stacked composition column (or horizontal bars / cards).
// A funding hero + metrics anchor the left; an ADAPTIVE media column
// (mediaSlotCount 0..n) sits on the right and the grid rebalances at every count
// — 0 widens the structure so composition stays balanced.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   structTag                       sector/structure badge (decorative)
//   hero ({value,unit,label})       headline figure (e.g. avg ticket)
//   metrics ({k,v}[])               supporting metric cards
//   parts ({name,en,value}[])       structure components (values are %)
//   mediaPlaceholder                image-slot prompt text
//   railCaption                     structure column caption
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'stacked' | 'bars' | 'segments'  structure form
//   partCount (int 2..4)    components shown
//   mediaSlotCount (int 0..2) adaptive image slots (0 → structure widens)
//   metricCount (int 1..3)  supporting metric cards
//   focusEnabled (bool)     emphasise one component
//   focusIndex (int)        which component
//   showConnectors (bool)   scale ticks / connectors (decorative)
//   showValueLabels (bool)  per-part % labels (decorative data)
//   showBadge (bool)        structure badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (!document.getElementById('kx-dst-css')) {
  const css = `
  .kx-dst-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-dst-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-dst-title{font-size:68px;}
  .kx-dst-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  .kx-dst-main{flex:1;min-height:0;display:grid;column-gap:56px;padding:30px 0 6px;}
  /* left: hero + metrics */
  .kx-dst-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
  .kx-dst-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
  .kx-dst-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-dst-hero{margin-top:30px;}
  .kx-dst-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.82;white-space:nowrap;}
  .kx-dst-hv .kx-n{font-size:176px;color:var(--kx-accent);}
  .kx-dst-hv .kx-u{font-size:50px;color:var(--kx-mute);white-space:nowrap;}
  .kx-dst-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:14px;}
  .kx-dst-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
  .kx-dst-mcard{padding:20px 22px 14px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
  .kx-dst-mcard:last-child{border-right:none;}
  .kx-dst-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:44px;line-height:.9;letter-spacing:-.02em;}
  .kx-dst-mcard .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  /* middle: structure */
  .kx-dst-struct{display:flex;flex-direction:column;min-height:0;}
  .kx-dst-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:18px;display:flex;justify-content:space-between;}
  /* stacked composition column */
  .kx-dst-col{flex:1;min-height:0;display:flex;flex-direction:column;gap:4px;}
  .kx-dst-seg{flex-grow:0;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:18px;
    padding:0 24px;color:var(--kx-cream);overflow:hidden;border-left:3px solid transparent;}
  .kx-dst-seg .kx-sg-nm{display:flex;flex-direction:column;gap:3px;min-width:0;}
  .kx-dst-seg .kx-sg-nm .kx-k{font-family:var(--kx-disp);font-weight:900;font-size:36px;line-height:.96;letter-spacing:-.01em;}
  .kx-dst-seg .kx-sg-nm .kx-e{font-family:var(--kx-mono);font-size:19px;opacity:.7;letter-spacing:.04em;}
  .kx-dst-seg .kx-sg-v{font-family:var(--kx-disp);font-weight:800;font-size:52px;letter-spacing:-.02em;line-height:.9;white-space:nowrap;}
  .kx-dst-seg.kx-on{outline:2px solid var(--kx-accent);outline-offset:-2px;}
  /* horizontal bars */
  .kx-dst-bars{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:30px;}
  .kx-dst-brow{display:flex;flex-direction:column;gap:11px;}
  .kx-dst-bmeta{display:flex;justify-content:space-between;align-items:baseline;gap:18px;}
  .kx-dst-bmeta .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:38px;letter-spacing:-.01em;}
  .kx-dst-bmeta .kx-e{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;margin-left:14px;}
  .kx-dst-bmeta .kx-v{font-family:var(--kx-disp);font-weight:800;font-size:46px;letter-spacing:-.02em;}
  .kx-dst-btrack{height:26px;background:#26261f;}
  .kx-dst-bfill{height:100%;}
  .kx-dst-brow.kx-on .kx-k,.kx-dst-brow.kx-on .kx-v{color:var(--kx-accent);}
  /* segment cards */
  .kx-dst-cards{flex:1;min-height:0;display:grid;gap:18px;align-content:center;}
  .kx-dst-card{border:1px solid var(--kx-line);border-top:3px solid var(--kx-mute-2);padding:24px 24px 20px;
    display:flex;flex-direction:column;gap:10px;background:rgba(255,255,255,.015);}
  .kx-dst-card.kx-on{border-color:var(--kx-accent);border-top-color:var(--kx-accent);
    background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 13%,transparent),transparent 85%);}
  .kx-dst-card .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:70px;line-height:.85;letter-spacing:-.02em;}
  .kx-dst-card.kx-on .kx-cv{color:var(--kx-accent);}
  .kx-dst-card .kx-ck{font-family:var(--kx-disp);font-weight:900;font-size:30px;letter-spacing:-.01em;}
  .kx-dst-card .kx-ce{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;}
  /* right: media */
  .kx-dst-media{display:flex;flex-direction:column;gap:20px;min-height:0;justify-content:center;}
  .kx-dst-media .kx-imgslot{flex:none;}
  .kx-dst-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-dst-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-dst-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-dst-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const SHADE = ['#3a3a36', '#55554e', '#7a7a70', '#48483f'];

function SlideDealStruct(props) {
  const p = { ...SlideDealStruct.defaults, ...props };
  const parts = p.parts.slice(0, clamp(p.partCount, 2, p.parts.length));
  const fi = clamp(p.focusIndex, 0, parts.length - 1);
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const metrics = p.metrics.slice(0, clamp(p.metricCount, 1, p.metrics.length));
  const total = parts.reduce((a, b) => a + b.value, 0);
  const maxV = Math.max(...parts.map((x) => x.value));
  const segColor = (i, on) => on ? 'var(--kx-accent)' : SHADE[i % SHADE.length];
  const mainCols = slots === 0 ? '0.8fr 1.2fr' : '0.7fr 0.96fr 0.84fr';

  let struct, meta;
  if (p.chartType === 'bars') {
    meta = 'BARS';
    struct = h('div', { className: 'kx-dst-bars' },
      parts.map((pt, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-dst-brow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-dst-bmeta' },
            h('span', null, h('span', { className: 'kx-k' }, pt.name), h('span', { className: 'kx-e' }, pt.en)),
            p.showValueLabels ? h('span', { className: 'kx-v' }, pt.value + '%') : null),
          h('div', { className: 'kx-dst-btrack' },
            h('div', { className: 'kx-dst-bfill', style: { width: (pt.value / maxV * 100) + '%', background: segColor(i, on) } }))); }));
  } else if (p.chartType === 'segments') {
    meta = 'SEGMENTS';
    const cols = parts.length <= 2 ? 1 : 2;
    struct = h('div', { className: 'kx-dst-cards', style: { gridTemplateColumns: `repeat(${cols},1fr)` } },
      parts.map((pt, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-dst-card' + (on ? ' kx-on' : ''), style: { borderTopColor: on ? 'var(--kx-accent)' : segColor(i, false) } },
          p.showValueLabels ? h('div', { className: 'kx-cv' }, pt.value + '%') : null,
          h('div', { className: 'kx-ck' }, pt.name),
          h('div', { className: 'kx-ce' }, pt.en)); }));
  } else {
    meta = 'STACKED';
    struct = h('div', { className: 'kx-dst-col' },
      parts.map((pt, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-dst-seg' + (on ? ' kx-on' : ''),
          style: { flexGrow: pt.value, background: segColor(i, on), color: on ? 'var(--kx-ink)' : 'var(--kx-cream)' } },
          h('div', { className: 'kx-sg-nm' },
            h('div', { className: 'kx-k' }, pt.name),
            h('div', { className: 'kx-e' }, pt.en)),
          p.showValueLabels ? h('div', { className: 'kx-sg-v' }, pt.value + '%') : null); }));
  }

  const media = slots > 0 ? h('div', { className: 'kx-dst-media' },
    Array.from({ length: slots }, (_, i) =>
      h(KxImageSlot, {
        key: i, id: 'dealstruct-' + (p.eyebrowId || 'x') + '-' + i,
        placeholder: p.mediaPlaceholder || '交易结构示意 / DROP IMAGE',
        badge: slots === 1 ? p.structTag : ('IMG ' + String(i + 1).padStart(2, '0')),
        minRatio: slots === 1 ? 0.7 : 0.9, maxRatio: slots === 1 ? 1.3 : 1.9,
        style: { width: '100%' },
      }))) : null;

  const left = h('div', { className: 'kx-dst-left' },
    p.showBadge ? h('div', { className: 'kx-dst-badge' }, p.structTag) : null,
    h('div', { className: 'kx-dst-hero', style: p.showBadge ? null : { marginTop: 0 } },
      h('div', { className: 'kx-dst-hv' },
        h('span', { className: 'kx-n' }, p.hero.value),
        p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
      h('div', { className: 'kx-dst-hl' }, p.hero.label)),
    h('div', { className: 'kx-dst-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
      metrics.map((m, i) => h('div', { key: i, className: 'kx-dst-mcard' },
        h('span', { className: 'kx-mv' }, m.v),
        h('span', { className: 'kx-mk' }, m.k)))));

  const structCol = h('div', { className: 'kx-dst-struct' },
    h('div', { className: 'kx-dst-cap' },
      h('span', null, p.railCaption),
      p.showConnectors ? h('span', null, '合计 ' + total + '%') : null),
    struct);

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-dst-pad' },
      h('div', { className: 'kx-dst-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-dst-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-dst-sub' }, p.subhead)),
      h('div', { className: 'kx-dst-main', style: { gridTemplateColumns: mainCols } }, left, structCol, media),
      h('div', { className: 'kx-dst-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, parts.length + ' 项 · ' + (slots === 0 ? 'STRUCT' : slots + ' IMG') + ' / ' + meta))));
}

SlideDealStruct.defaults = {
  eyebrowId: '51', eyebrowLabel: 'UNDISCLOSED MEGA',
  title: '复杂交易结构', subhead: '未披露巨额轮次 / UNDISCLOSED MEGA ROUNDS',
  closing: 'AI 融资越来越像资源组合交易。',
  structTag: '未披露轮次 / UNDISCLOSED',
  hero: { value: '18.6', unit: '亿$', label: '平均单笔规模 / AVG TICKET' },
  metrics: [
    { k: '事件数 / DEALS', v: '22 笔' },
    { k: '云资源绑定 / CLOUD', v: '39%' },
    { k: '战略投资 / STRATEGIC', v: '31%' },
  ],
  parts: [
    { name: '云资源置换', en: 'CLOUD CREDITS', value: 39 },
    { name: '战略投资', en: 'STRATEGIC', value: 31 },
    { name: '现金对价', en: 'CASH', value: 18 },
    { name: '债务组合', en: 'DEBT MIX', value: 12 },
  ],
  mediaPlaceholder: '交易结构示意 / DROP IMAGE',
  railCaption: '交易结构拆解 / STRUCTURE',
  chartType: 'stacked', partCount: 4, mediaSlotCount: 1, metricCount: 2,
  focusEnabled: true, focusIndex: 0, showConnectors: true, showValueLabels: true,
  showBadge: true, accent: '#c8f135',
};

SlideDealStruct.controls = [
  { key: 'chartType', label: '结构形态', type: 'select', default: 'stacked',
    options: [['stacked', '堆叠列'], ['bars', '条形'], ['segments', '卡片']], desc: '交易结构拆解的可视化形式' },
  { key: 'partCount', label: '结构项数', type: 'number', default: 4, min: 2, max: 4, desc: '展示的结构组成项数量' },
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 时结构列加宽；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 1, max: 3, desc: '左侧辅助指标数量' },
  { key: 'focusEnabled', label: '重点结构高亮', type: 'toggle', default: true, desc: '是否突出某一结构组成项' },
  { key: 'focusIndex', label: '高亮第几项', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的结构序号', showIf: (p) => p.focusEnabled },
  { key: 'showConnectors', label: '刻度合计', type: 'toggle', default: true, desc: '显示/隐藏结构合计刻度（装饰）' },
  { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各结构项占比标签（装饰数据）' },
  { key: 'showBadge', label: '结构徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角结构徽标（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideDealStruct;
