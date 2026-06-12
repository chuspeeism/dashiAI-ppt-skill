// ============================================================================
// SlideRounds.jsx — P50 新主题萌芽 / Early-Stage Round Signal  (table page)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "structured rows + one emphasis figure" table page. Each round
// carries a COUNT and an AMOUNT; the left table reads like a ledger while a
// size-encoded glyph (bubble / bar / dots) makes the relative deal flow visible
// at a glance. A right rail anchors one share figure and the emergent themes —
// the small-money rounds that hint at the next wave.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   unitCount,unitAmount               row units (e.g. ' 笔', ' 亿$')
//   rounds ({name,en,count,amount}[])  table rows (early → later)
//   share ({value,unit,label})         emphasis figure on the rail
//   tags (string[])                    emergent theme chips
//   railCaption                        rail header label
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'bubbles' | 'bars' | 'dots'   row size glyph
//   rowCount (int 2..4)     rounds shown
//   tagCount (int 0..6)     theme chips shown
//   showShare (bool)        emphasis share figure (decorative anchor)
//   showValueLabels (bool)  per-row count / amount / avg labels (decorative)
//   focusEnabled (bool)     emphasise one round row
//   focusIndex (int)        which round
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (!document.getElementById('kx-rnd-css')) {
  const css = `
  .kx-rnd-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-rnd-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-rnd-title{font-size:68px;}
  .kx-rnd-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  .kx-rnd-main{flex:1;min-height:0;display:grid;grid-template-columns:1.42fr 0.78fr;column-gap:64px;padding:26px 0 6px;}
  /* ledger table */
  .kx-rnd-tbl{display:flex;flex-direction:column;min-height:0;}
  .kx-rnd-colh{display:grid;grid-template-columns:1.35fr 1.5fr 0.7fr 0.7fr 0.8fr;align-items:end;gap:18px;
    font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;
    padding-bottom:14px;border-bottom:1px solid var(--kx-line);}
  .kx-rnd-colh .kx-r{text-align:right;}
  .kx-rnd-row{display:grid;grid-template-columns:1.35fr 1.5fr 0.7fr 0.7fr 0.8fr;align-items:center;gap:18px;
    flex:1;min-height:0;border-bottom:1px solid var(--kx-line);}
  .kx-rnd-nm{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .kx-rnd-nm .kx-k{font-family:var(--kx-disp);font-weight:900;font-size:42px;line-height:.96;letter-spacing:-.01em;}
  .kx-rnd-nm .kx-e{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-rnd-viz{display:flex;align-items:center;height:100%;}
  .kx-rnd-bub{border-radius:50%;background:#4a4a44;flex:none;}
  .kx-rnd-bar{height:30px;background:#4a4a44;border-radius:3px;min-width:6px;}
  .kx-rnd-dots{display:flex;flex-wrap:wrap;gap:7px;align-content:center;max-width:300px;}
  .kx-rnd-dots i{width:15px;height:15px;border-radius:50%;background:#4a4a44;display:block;}
  .kx-rnd-cell{font-family:var(--kx-disp);font-weight:800;font-size:40px;letter-spacing:-.02em;text-align:right;line-height:.9;}
  .kx-rnd-cell.kx-amt{color:var(--kx-accent);}
  .kx-rnd-cell .kx-u{font-family:var(--kx-mono);font-size:18px;font-weight:700;color:var(--kx-mute-2);}
  .kx-rnd-row.kx-on .kx-rnd-nm .kx-k{color:var(--kx-accent);}
  .kx-rnd-row.kx-on .kx-rnd-bub,.kx-rnd-row.kx-on .kx-rnd-bar{background:var(--kx-accent);}
  .kx-rnd-row.kx-on .kx-rnd-dots i{background:var(--kx-accent);}
  /* rail */
  .kx-rnd-rail{display:flex;flex-direction:column;min-height:0;border-left:1px solid var(--kx-line);padding-left:52px;}
  .kx-rnd-railcap{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:16px;}
  .kx-rnd-share{display:flex;flex-direction:column;gap:8px;padding:8px 0 26px;border-bottom:1px solid var(--kx-line);}
  .kx-rnd-share .kx-sv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;
    letter-spacing:-.03em;line-height:.84;}
  .kx-rnd-share .kx-sv .kx-n{font-size:158px;color:var(--kx-accent);}
  .kx-rnd-share .kx-sv .kx-u{font-size:52px;color:var(--kx-mute);}
  .kx-rnd-share .kx-sl{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.04em;
    text-transform:uppercase;line-height:1.3;}
  .kx-rnd-themes{display:flex;flex-direction:column;gap:14px;padding-top:24px;min-height:0;}
  .kx-rnd-themes .kx-th-h{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
  .kx-rnd-chips{display:flex;flex-wrap:wrap;gap:13px;}
  .kx-rnd-chip{font-family:var(--kx-mono);font-size:24px;font-weight:700;padding:11px 18px;letter-spacing:.02em;
    border:1px solid var(--kx-line);color:var(--kx-cream);background:rgba(255,255,255,.03);
    display:inline-flex;align-items:center;gap:11px;white-space:nowrap;}
  .kx-rnd-chip::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--kx-accent);}
  .kx-rnd-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-rnd-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-rnd-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-rnd-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideRounds(props) {
  const p = { ...SlideRounds.defaults, ...props };
  const rows = p.rounds.slice(0, clamp(p.rowCount, 2, p.rounds.length));
  const fi = clamp(p.focusIndex, 0, rows.length - 1);
  const maxC = Math.max(...rows.map((r) => r.count));
  const totC = rows.reduce((a, r) => a + r.count, 0);
  const tags = p.tags.slice(0, clamp(p.tagCount, 0, p.tags.length));

  const viz = (r, on) => {
    if (p.chartType === 'bars') {
      return h('div', { className: 'kx-rnd-viz' },
        h('div', { className: 'kx-rnd-bar', style: { width: Math.max(8, r.count / maxC * 100) + '%' } }));
    }
    if (p.chartType === 'dots') {
      return h('div', { className: 'kx-rnd-viz' },
        h('div', { className: 'kx-rnd-dots' }, Array.from({ length: r.count }, (_, k) => h('i', { key: k }))));
    }
    // bubbles — area-encoded diameter
    const d = 30 + Math.sqrt(r.count / maxC) * 78;
    return h('div', { className: 'kx-rnd-viz' },
      h('div', { className: 'kx-rnd-bub', style: { width: d + 'px', height: d + 'px' } }));
  };

  const table = h('div', { className: 'kx-rnd-tbl' },
    h('div', { className: 'kx-rnd-colh' },
      h('span', null, '轮次 / ROUND'),
      h('span', null, '相对规模 / FLOW'),
      h('span', { className: 'kx-r' }, '笔数'),
      h('span', { className: 'kx-r' }, '金额'),
      h('span', { className: 'kx-r' }, '平均')),
    rows.map((r, i) => {
      const on = p.focusEnabled && i === fi;
      const avg = (r.amount / r.count);
      return h('div', { key: i, className: 'kx-rnd-row' + (on ? ' kx-on' : '') },
        h('div', { className: 'kx-rnd-nm' },
          h('span', { className: 'kx-k' }, r.name),
          h('span', { className: 'kx-e' }, r.en)),
        viz(r, on),
        h('div', { className: 'kx-rnd-cell' }, p.showValueLabels ? r.count : '', p.showValueLabels ? h('span', { className: 'kx-u' }, p.unitCount) : null),
        h('div', { className: 'kx-rnd-cell kx-amt' }, p.showValueLabels ? r.amount : '', p.showValueLabels ? h('span', { className: 'kx-u' }, p.unitAmount) : null),
        h('div', { className: 'kx-rnd-cell', style: { fontSize: '30px', color: 'var(--kx-mute)' } },
          p.showValueLabels ? avg.toFixed(1) : '', p.showValueLabels ? h('span', { className: 'kx-u' }, p.unitAmount) : null));
    }));

  const rail = h('div', { className: 'kx-rnd-rail' },
    h('div', { className: 'kx-rnd-railcap' }, p.railCaption),
    p.showShare ? h('div', { className: 'kx-rnd-share' },
      h('div', { className: 'kx-sv' },
        h('span', { className: 'kx-n' }, p.share.value),
        h('span', { className: 'kx-u' }, p.share.unit)),
      h('div', { className: 'kx-sl' }, p.share.label)) : null,
    tags.length ? h('div', { className: 'kx-rnd-themes' },
      h('div', { className: 'kx-th-h' }, '萌芽主题 / EMERGENT THEMES'),
      h('div', { className: 'kx-rnd-chips' }, tags.map((t, i) => h('span', { key: i, className: 'kx-rnd-chip' }, t)))) : null);

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-rnd-pad' },
      h('div', { className: 'kx-rnd-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-rnd-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-rnd-sub' }, p.subhead)),
      h('div', { className: 'kx-rnd-main' }, table, rail),
      h('div', { className: 'kx-rnd-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, rows.length + ' 轮 · ' + totC + p.unitCount + ' / ' + p.chartType.toUpperCase()))));
}

SlideRounds.defaults = {
  eyebrowId: '50', eyebrowLabel: 'EARLY-STAGE SIGNAL',
  title: '新主题萌芽', subhead: '早期轮信号 / EARLY-STAGE SIGNAL',
  closing: '小金额交易往往藏着下一轮主题。',
  unitCount: ' 笔', unitAmount: ' 亿',
  rounds: [
    { name: 'Pre-Seed', en: 'PRE-SEED', count: 5, amount: 0.6 },
    { name: 'Seed', en: 'SEED ROUND', count: 8, amount: 1.2 },
    { name: 'A 轮', en: 'SERIES A', count: 12, amount: 1.8 },
    { name: 'B 轮', en: 'SERIES B', count: 9, amount: 3.4 },
  ],
  share: { value: '20.6', unit: '%', label: '早期轮占事件数 / OF ALL DEALS' },
  tags: ['Agent', '安全对齐', '具身智能', '行业专用模型', '推理优化', '数据合成'],
  railCaption: '信号读数 / SIGNAL',
  chartType: 'bubbles', rowCount: 4, tagCount: 4, showShare: true, showValueLabels: true,
  focusEnabled: true, focusIndex: 2, accent: '#c8f135',
};

SlideRounds.controls = [
  { key: 'chartType', label: '规模可视化', type: 'select', default: 'bubbles',
    options: [['bubbles', '气泡'], ['bars', '条形'], ['dots', '点阵']], desc: '轮次相对规模的可视化形式' },
  { key: 'rowCount', label: '轮次数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的轮次行数' },
  { key: 'tagCount', label: '主题标签数', type: 'number', default: 4, min: 0, max: 6, desc: '右栏萌芽主题标签数量（0 隐藏）' },
  { key: 'showShare', label: '重点占比', type: 'toggle', default: true, desc: '显示/隐藏右栏重点占比大数字（装饰锚点）' },
  { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏笔数 / 金额 / 平均标签（装饰数据）' },
  { key: 'focusEnabled', label: '重点行高亮', type: 'toggle', default: true, desc: '是否突出某一轮次行' },
  { key: 'focusIndex', label: '高亮第几行', type: 'number', default: 2, min: 0, max: 3, desc: '被突出的轮次序号', showIf: (p) => p.focusEnabled },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideRounds;
