// ============================================================================
// SlideTreemap.jsx — P88 资本流向预测 / Proportional Composition (chart_page, reusable)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "how a whole splits into weighted parts, BY AREA" page. N blocks
// pack into one full-bleed mosaic where each block's area ∝ its value (a
// balanced two-row treemap), so the eye reads dominance at a glance. One block
// can be pulled out as a solid-lime focus block (borrowing the reference's
// "one lime card among dark cards" language). `chartType` switches the SAME
// data between an area treemap, horizontal bars and an equal grid. In the demo
// deck it renders P88 2025 资本流向预测 (capital allocation forecast); reusable
// for any "composition by share" page.
//
// Second-level prefix: kx-tmp-  ·  style id: kx-tmp-css  (unique)
//
// PROPS (content — text, set via defaults / props, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   hero ({value,unit,label})        content — header anchor figure (decor)
//   blocks ({name,en,value,note}[])  content — weighted parts (value drives area)
//   footRight                        content — foot-right mono caption
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)          'treemap' | 'bars' | 'grid'  same data, 3 forms
//   blockCount (int 3..6)     number of parts shown
//   focusEnabled (bool)       pull one part out as the lime focus block
//   focusIndex (int)          which part
//   showValueLabels (bool)    per-block share figure (decorative data)
//   showHero (bool)           header anchor figure (decorative anchor)
//   showNote (bool)           per-block sub-note on larger blocks (decor text)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-tmp-css')) {
  const css = `
  .kx-tmp-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-tmp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-tmp-title{font-size:64px;}
  .kx-tmp-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-tmp-hero{text-align:right;white-space:nowrap;}
  .kx-tmp-hero .kx-hv{font-family:var(--kx-disp);font-weight:900;font-size:78px;line-height:.82;
    letter-spacing:-.03em;color:var(--kx-accent);}
  .kx-tmp-hero .kx-hv .kx-u{font-size:34px;font-weight:800;margin-left:4px;}
  .kx-tmp-hero .kx-hl{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;margin-top:8px;}

  /* ---- shared block face ---- */
  .kx-tmp-stage{flex:1;min-height:0;margin-top:22px;display:flex;}
  .kx-tmp-block{position:relative;overflow:hidden;border:1px solid var(--kx-line);
    background:rgba(255,255,255,.035);padding:24px 26px;display:flex;flex-direction:column;
    justify-content:space-between;min-width:0;min-height:0;}
  .kx-tmp-block.kx-on{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
  .kx-tmp-block .kx-bidx{position:absolute;right:18px;top:10px;font-family:var(--kx-mono);
    font-size:20px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-tmp-block.kx-on .kx-bidx{color:rgba(12,12,12,.5);}
  .kx-tmp-top{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .kx-tmp-nm{font-family:var(--kx-disp);font-weight:900;font-size:44px;line-height:.98;
    letter-spacing:-.01em;text-wrap:balance;}
  .kx-tmp-en{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;}
  .kx-tmp-block.kx-on .kx-tmp-en{color:rgba(12,12,12,.6);}
  .kx-tmp-note{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute);line-height:1.34;
    text-wrap:pretty;margin-top:8px;max-width:480px;}
  .kx-tmp-block.kx-on .kx-tmp-note{color:rgba(12,12,12,.72);}
  .kx-tmp-bot{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-top:10px;}
  .kx-tmp-val{font-family:var(--kx-disp);font-weight:800;font-size:62px;line-height:.82;
    letter-spacing:-.02em;color:var(--kx-accent);}
  .kx-tmp-block.kx-on .kx-tmp-val{color:var(--kx-ink);}
  .kx-tmp-val .kx-u{font-size:28px;font-weight:800;margin-left:3px;}

  /* ---- treemap rows ---- */
  .kx-tmp-tree{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;width:100%;}
  .kx-tmp-row{display:flex;gap:10px;min-height:0;}

  /* ---- bars ---- */
  .kx-tmp-bars{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:16px;width:100%;}
  .kx-tmp-bar{display:grid;grid-template-columns:300px 1fr auto;gap:28px;align-items:center;}
  .kx-tmp-bar .kx-bnm{display:flex;flex-direction:column;gap:3px;min-width:0;}
  .kx-tmp-bar .kx-bnm .kx-k{font-family:var(--kx-disp);font-weight:900;font-size:38px;line-height:1;letter-spacing:-.01em;}
  .kx-tmp-bar .kx-bnm .kx-e{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-tmp-track{height:30px;background:rgba(255,255,255,.05);position:relative;overflow:hidden;}
  .kx-tmp-fill{position:absolute;inset:0 auto 0 0;background:#34342f;}
  .kx-tmp-bar.kx-on .kx-tmp-fill{background:var(--kx-accent);}
  .kx-tmp-bar.kx-on .kx-k{color:var(--kx-accent);}
  .kx-tmp-bv{font-family:var(--kx-disp);font-weight:800;font-size:46px;letter-spacing:-.02em;
    text-align:right;white-space:nowrap;min-width:140px;color:var(--kx-accent);}
  .kx-tmp-bv .kx-u{font-size:24px;font-weight:800;margin-left:2px;}

  /* ---- grid ---- */
  .kx-tmp-cells{flex:1;min-height:0;display:grid;gap:12px;}
  .kx-tmp-cell{position:relative;overflow:hidden;border:1px solid var(--kx-line);
    background:rgba(255,255,255,.035);padding:24px 26px;display:flex;flex-direction:column;justify-content:space-between;}
  .kx-tmp-cell.kx-on{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
  .kx-tmp-cell .kx-cfill{position:absolute;left:0;bottom:0;height:8px;background:var(--kx-accent);opacity:.55;}
  .kx-tmp-cell.kx-on .kx-cfill{background:var(--kx-ink);opacity:.25;}

  .kx-tmp-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;margin-top:22px;border-top:1px solid var(--kx-line);}
  .kx-tmp-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-tmp-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-tmp-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const sum = (a) => a.reduce((x, y) => x + y, 0);

// Balanced two-row split that PRESERVES order (big parts read top-left).
// Returns [row1, row2] index ranges; for ≤2 items, one row.
function splitRows(values) {
  const n = values.length;
  if (n <= 2) return [[0, n]];
  const total = sum(values);
  let best = 1, bestDiff = Infinity;
  for (let k = 1; k < n; k++) {
    const s1 = sum(values.slice(0, k));
    const diff = Math.abs(s1 - (total - s1));
    if (diff < bestDiff) { bestDiff = diff; best = k; }
  }
  return [[0, best], [best, n]];
}

function blockFace(b, i, on, p, big) {
  return h('div', { key: i, className: 'kx-tmp-block' + (on ? ' kx-on' : ''),
    style: { flex: `${Math.max(1, b.value)} 1 0` } },
    h('div', { className: 'kx-bidx' }, String(i + 1).padStart(2, '0')),
    h('div', { className: 'kx-tmp-top' },
      h('div', { className: 'kx-tmp-nm' }, b.name),
      b.en ? h('div', { className: 'kx-tmp-en' }, b.en) : null,
      (p.showNote && big && b.note) ? h('div', { className: 'kx-tmp-note' }, b.note) : null),
    h('div', { className: 'kx-tmp-bot' },
      p.showValueLabels ? h('div', { className: 'kx-tmp-val' },
        b.value, h('span', { className: 'kx-u' }, p.unit)) : h('span')));
}

function SlideTreemap(props) {
  const p = { ...SlideTreemap.defaults, ...props };
  const blocks = p.blocks.slice(0, clamp(p.blockCount, 3, p.blocks.length));
  const fi = clamp(p.focusIndex, 0, blocks.length - 1);
  const vals = blocks.map((b) => Math.max(1, b.value));

  let stage;
  if (p.chartType === 'bars') {
    const maxV = Math.max(...vals);
    stage = h('div', { className: 'kx-tmp-bars' },
      blocks.map((b, i) => h('div', { key: i, className: 'kx-tmp-bar' + (p.focusEnabled && i === fi ? ' kx-on' : '') },
        h('div', { className: 'kx-bnm' },
          h('div', { className: 'kx-k' }, b.name),
          b.en ? h('div', { className: 'kx-e' }, b.en) : null),
        h('div', { className: 'kx-tmp-track' },
          h('div', { className: 'kx-tmp-fill', style: { width: Math.max(6, (b.value / maxV) * 100) + '%' } })),
        p.showValueLabels ? h('div', { className: 'kx-tmp-bv' }, b.value, h('span', { className: 'kx-u' }, p.unit)) : h('span'))));
  } else if (p.chartType === 'grid') {
    const n = blocks.length;
    const cols = n <= 3 ? n : (n === 4 ? 2 : 3);
    const maxV = Math.max(...vals);
    stage = h('div', { className: 'kx-tmp-cells', style: { gridTemplateColumns: `repeat(${cols},1fr)` } },
      blocks.map((b, i) => {
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-tmp-cell' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-bidx' }, String(i + 1).padStart(2, '0')),
          h('div', { className: 'kx-tmp-top' },
            h('div', { className: 'kx-tmp-nm' }, b.name),
            b.en ? h('div', { className: 'kx-tmp-en' }, b.en) : null),
          h('div', { className: 'kx-tmp-bot' },
            p.showValueLabels ? h('div', { className: 'kx-tmp-val' }, b.value, h('span', { className: 'kx-u' }, p.unit)) : h('span')),
          h('div', { className: 'kx-cfill', style: { width: Math.max(8, (b.value / maxV) * 100) + '%' } }));
      }));
  } else {
    // treemap — balanced two-row area mosaic
    const rows = splitRows(vals);
    stage = h('div', { className: 'kx-tmp-tree' },
      rows.map((rg, ri) => {
        const [a, z] = rg;
        const rowVals = vals.slice(a, z);
        return h('div', { key: ri, className: 'kx-tmp-row', style: { flex: `${sum(rowVals)} 1 0` } },
          blocks.slice(a, z).map((b, j) => {
            const idx = a + j;
            const on = p.focusEnabled && idx === fi;
            const big = b.value >= 12;
            return blockFace(b, idx, on, p, big);
          }));
      }));
  }

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-tmp-pad' },
      h('div', { className: 'kx-tmp-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-tmp-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-tmp-sub' }, p.subhead)),
        p.showHero ? h('div', { className: 'kx-tmp-hero' },
          h('div', { className: 'kx-hv' }, p.hero.value, p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
          h('div', { className: 'kx-hl' }, p.hero.label)) : null),
      h('div', { className: 'kx-tmp-stage' }, stage),
      h('div', { className: 'kx-tmp-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (blocks.length + ' PARTS · ' + p.chartType.toUpperCase())))));
}

SlideTreemap.defaults = {
  eyebrowId: '88', eyebrowLabel: 'CAPITAL FLOW',
  title: '2025 资本流向预测',
  subhead: '按赛道的份额结构 / FORECAST CAPITAL ALLOCATION',
  closing: '钱往模型与算力两端继续集中。',
  unit: '%',
  hero: { value: '62', unit: '%', label: '模型+算力合计 / MODEL + COMPUTE' },
  blocks: [
    { name: '通用大模型', en: 'FOUNDATION MODELS', value: 38, note: '少数前沿实验室继续吸走最大份额，单笔规模抬升。' },
    { name: '算力基础设施', en: 'COMPUTE INFRA', value: 24, note: 'GPU 云与数据中心承接模型训练的确定性预算。' },
    { name: '企业应用', en: 'ENTERPRISE APPS', value: 16, note: '从试点走向稳定收入的应用层获得加注。' },
    { name: '垂直行业', en: 'VERTICAL AI', value: 11, note: '医疗、金融、法律等高客单价场景。' },
    { name: '安全与对齐', en: 'SAFETY', value: 6, note: '评测、对齐与合规工具受监管驱动。' },
    { name: '数据与工具', en: 'DATA & TOOLS', value: 5, note: '数据标注、可观测与开发者工具。' },
  ],
  footRight: 'FORECAST · SHARE',
  chartType: 'treemap', blockCount: 6, focusEnabled: true, focusIndex: 0,
  showValueLabels: true, showHero: true, showNote: true, accent: '#c8f135',
};

SlideTreemap.controls = [
  { key: 'chartType', label: '图表形态', type: 'select', default: 'treemap',
    options: [['treemap', '面积块'], ['bars', '条形'], ['grid', '网格']], desc: '同一组份额：面积treemap / 条形 / 网格' },
  { key: 'blockCount', label: '区块数量', type: 'number', default: 6, min: 3, max: 6, desc: '展示的份额区块数量' },
  { key: 'focusEnabled', label: '重点区块高亮', type: 'toggle', default: true, desc: '是否把某一区块拉成 lime 焦点块' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 5, desc: '被突出的区块序号', showIf: (p) => p.focusEnabled },
  { key: 'showValueLabels', label: '份额数字', type: 'toggle', default: true, desc: '显示/隐藏每块份额数字（装饰数据）' },
  { key: 'showHero', label: '顶部锚点数字', type: 'toggle', default: true, desc: '显示/隐藏右上角锚点数字（装饰）' },
  { key: 'showNote', label: '区块小注', type: 'toggle', default: true, desc: '显示/隐藏较大区块上的说明（装饰文案，仅面积块）', showIf: (p) => p.chartType === 'treemap' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideTreemap;
