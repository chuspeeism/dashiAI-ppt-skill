// ============================================================================
// SlideHeat.jsx — P84 全年月度热力 / Monthly Heat (chart page)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "N periods, one intensity read" chart: each period is encoded as a
// heat cell whose lime fill tracks its value (the peak reads as a solid lime
// pill, the rest as hatched/low-fill cells — borrowing the reference's month-
// pill + hatch-remainder language). `chartType` switches the SAME data between
// a heat grid / value columns / a dot-intensity matrix. One period can be
// pulled out as a lime focus cell, and a peak/trough callout anchors the read.
// Reusable to any "12 months / N buckets + one peak" page.
//
// Second-level prefix: kx-hmp-  ·  style id: kx-hmp-css  (unique)
//
// PROPS (content — set via defaults / props, NOT Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   periods ({m,en,v}[])   content — period label / latin / value (low→high read)
//   total                  content — decorative total read (peak/trough band)
//   footRight              content — decorative footer caption
// PROPS (visual — 1:1 with controls)
//   chartType (enum)        'grid' | 'columns' | 'dots'   visualization form
//   periodCount (int 6..12) how many periods shown (sliced)
//   focusEnabled (bool)     pull one period out as a lime focus cell
//   focusIndex (int)        which period (default = peak month)
//   showScale (bool)        intensity legend low→high (decorative)
//   showValueLabels (bool)  per-cell value number (decorative data)
//   showPeakMark (bool)     peak / trough / total read band (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (!document.getElementById('kx-hmp-css')) {
  const css = `
  .kx-hmp-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:32px;}
  .kx-hmp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-hmp-title{font-size:68px;}
  .kx-hmp-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  /* peak / trough read band */
  .kx-hmp-band{display:flex;gap:0;border-bottom:1px solid var(--kx-line);}
  .kx-hmp-bcell{flex:1;padding:18px 26px 16px 0;border-right:1px solid var(--kx-line);
    display:flex;flex-direction:column;gap:6px;}
  .kx-hmp-bcell:last-child{border-right:none;padding-right:0;}
  .kx-hmp-bcell .kx-bk{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;}
  .kx-hmp-bcell .kx-bv{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:.9;letter-spacing:-.02em;}
  .kx-hmp-bcell.kx-pk .kx-bv{color:var(--kx-accent);}
  /* field */
  .kx-hmp-field{flex:1;min-height:0;display:grid;gap:12px;margin:22px 0;}
  /* heat cell */
  .kx-hmp-cell{position:relative;border:1px solid var(--kx-line);overflow:hidden;
    display:flex;flex-direction:column;justify-content:space-between;padding:18px 18px 16px;min-height:0;}
  .kx-hmp-cell .kx-fill{position:absolute;inset:0;z-index:0;}
  .kx-hmp-cell .kx-hatch{position:absolute;inset:0;z-index:0;
    background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0 2px,transparent 2px 11px);}
  .kx-hmp-cell>*{position:relative;z-index:1;}
  .kx-hmp-cell .kx-m{font-family:var(--kx-disp);font-weight:900;font-size:34px;line-height:1;letter-spacing:.01em;}
  .kx-hmp-cell .kx-en{font-family:var(--kx-mono);font-size:20px;letter-spacing:.06em;opacity:.55;text-transform:uppercase;}
  .kx-hmp-cell .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.86;letter-spacing:-.02em;
    display:flex;align-items:baseline;gap:5px;}
  .kx-hmp-cell .kx-cv .kx-u{font-size:22px;font-weight:700;opacity:.7;font-family:var(--kx-mono);}
  .kx-hmp-cell.kx-on{outline:2px solid var(--kx-accent);outline-offset:-2px;}
  /* columns variant */
  .kx-hmp-cols{flex:1;min-height:0;display:flex;align-items:flex-end;gap:14px;padding:8px 0 0;}
  .kx-hmp-col{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:12px;}
  .kx-hmp-cbar{width:100%;position:relative;background:rgba(255,255,255,.045);min-height:8px;
    display:flex;align-items:flex-start;justify-content:center;}
  .kx-hmp-cbar i{position:absolute;left:0;right:0;bottom:0;background:#34342f;}
  .kx-hmp-col.kx-on .kx-hmp-cbar i,.kx-hmp-col.kx-pk .kx-hmp-cbar i{background:var(--kx-accent);}
  .kx-hmp-cval{font-family:var(--kx-disp);font-weight:800;font-size:30px;line-height:1;
    position:absolute;top:-40px;left:0;right:0;text-align:center;}
  .kx-hmp-col.kx-on .kx-hmp-cval,.kx-hmp-col.kx-pk .kx-hmp-cval{color:var(--kx-accent);}
  .kx-hmp-clab{font-family:var(--kx-mono);font-size:23px;letter-spacing:.03em;color:var(--kx-mute);white-space:nowrap;}
  .kx-hmp-col.kx-on .kx-hmp-clab,.kx-hmp-col.kx-pk .kx-hmp-clab{color:var(--kx-accent);}
  /* dots variant cell */
  .kx-hmp-dcell{position:relative;border:1px solid var(--kx-line);display:flex;flex-direction:column;
    justify-content:space-between;padding:18px 16px 16px;min-height:0;gap:14px;}
  .kx-hmp-dcell.kx-on{outline:2px solid var(--kx-accent);outline-offset:-2px;}
  .kx-hmp-dhead{display:flex;justify-content:space-between;align-items:baseline;}
  .kx-hmp-dhead .kx-m{font-family:var(--kx-disp);font-weight:900;font-size:30px;}
  .kx-hmp-dhead .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:30px;color:var(--kx-mute);}
  .kx-hmp-dcell.kx-on .kx-cv,.kx-hmp-dcell.kx-pk .kx-cv{color:var(--kx-accent);}
  .kx-hmp-dots{display:flex;flex-wrap:wrap;align-content:flex-end;gap:8px;flex:1;}
  .kx-hmp-dots i{width:13px;height:13px;border-radius:50%;background:#34342f;}
  .kx-hmp-dcell.kx-on .kx-hmp-dots i,.kx-hmp-dcell.kx-pk .kx-hmp-dots i{background:var(--kx-accent);}
  /* scale legend */
  .kx-hmp-scale{display:flex;align-items:center;gap:18px;padding-top:6px;}
  .kx-hmp-scale .kx-sl{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;}
  .kx-hmp-ramp{flex:1;height:14px;
    background:linear-gradient(90deg,var(--kx-ink-3),color-mix(in srgb,var(--kx-accent) 55%,var(--kx-ink-3)),var(--kx-accent));}
  .kx-hmp-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-hmp-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-hmp-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-hmp-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;

function SlideHeat(props) {
  const p = { ...SlideHeat.defaults, ...props };
  const all = p.periods;
  const n = Math.max(6, Math.min(p.periodCount, all.length));
  const periods = all.slice(0, n);
  const maxV = Math.max(...periods.map((d) => d.v));
  const minV = Math.min(...periods.map((d) => d.v));
  // peak / trough indices within the shown window
  const peakIdx = periods.reduce((bi, d, i) => (d.v > periods[bi].v ? i : bi), 0);
  const troughIdx = periods.reduce((bi, d, i) => (d.v < periods[bi].v ? i : bi), 0);
  const fi = Math.min(p.focusIndex, n - 1);
  // grid columns: single row up to 6, else two balanced rows
  const cols = n <= 6 ? n : Math.ceil(n / 2);

  const head = h('div', { className: 'kx-hmp-head' },
    h('div', null,
      h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
      h('h2', { className: 'kx-h2 kx-cjk kx-hmp-title', style: { marginTop: '16px' } }, p.title)),
    h('div', { className: 'kx-hmp-sub' }, p.subhead));

  const peak = periods[peakIdx], trough = periods[troughIdx];
  const band = p.showPeakMark ? h('div', { className: 'kx-hmp-band' },
    h('div', { className: 'kx-hmp-bcell kx-pk' },
      h('div', { className: 'kx-bk' }, '峰值 / PEAK · ' + peak.m),
      h('div', { className: 'kx-bv' }, peak.v + p.unit)),
    h('div', { className: 'kx-hmp-bcell' },
      h('div', { className: 'kx-bk' }, '低位 / TROUGH · ' + trough.m),
      h('div', { className: 'kx-bv' }, trough.v + p.unit)),
    h('div', { className: 'kx-hmp-bcell' },
      h('div', { className: 'kx-bk' }, '全年合计 / TOTAL'),
      h('div', { className: 'kx-bv' }, p.total))) : null;

  let body;
  if (p.chartType === 'columns') {
    body = h('div', { className: 'kx-hmp-cols' },
      periods.map((d, i) => {
        const isPk = i === peakIdx;
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-hmp-col' + (on ? ' kx-on' : isPk ? ' kx-pk' : '') },
          h('div', { className: 'kx-hmp-cbar', style: { height: '100%' } },
            h('i', { style: { height: Math.max(6, (d.v / maxV) * 100) + '%' } },
              p.showValueLabels ? h('span', { className: 'kx-hmp-cval' }, d.v) : null)),
          h('div', { className: 'kx-hmp-clab' }, d.m));
      }));
  } else if (p.chartType === 'dots') {
    body = h('div', { className: 'kx-hmp-field',
      style: { gridTemplateColumns: `repeat(${cols},1fr)`, gridAutoRows: '1fr' } },
      periods.map((d, i) => {
        const isPk = i === peakIdx;
        const on = p.focusEnabled && i === fi;
        const dots = Math.max(1, Math.round(d.v / 10));
        return h('div', { key: i, className: 'kx-hmp-dcell' + (on ? ' kx-on' : isPk ? ' kx-pk' : '') },
          h('div', { className: 'kx-hmp-dhead' },
            h('span', { className: 'kx-m' }, d.m),
            p.showValueLabels ? h('span', { className: 'kx-cv' }, d.v + p.unit) : null),
          h('div', { className: 'kx-hmp-dots' },
            Array.from({ length: dots }, (_, k) => h('i', { key: k }))));
      }));
  } else {
    // grid (heat cells)
    body = h('div', { className: 'kx-hmp-field',
      style: { gridTemplateColumns: `repeat(${cols},1fr)`, gridAutoRows: '1fr' } },
      periods.map((d, i) => {
        const isPk = i === peakIdx;
        const on = p.focusEnabled && i === fi;
        const t = (d.v - minV) / Math.max(1, maxV - minV);       // 0..1 within window
        const pct = Math.round(14 + t * 86);                      // fill strength
        const strong = isPk || pct > 58;                          // dark text on bright fill
        const fillColor = isPk
          ? 'var(--kx-accent)'
          : `color-mix(in srgb, var(--kx-accent) ${pct}%, var(--kx-ink-3))`;
        const txt = strong ? 'var(--kx-ink)' : 'var(--kx-cream)';
        return h('div', { key: i, className: 'kx-hmp-cell' + (on ? ' kx-on' : ''), style: { color: txt } },
          h('div', { className: 'kx-fill', style: { background: fillColor } }),
          isPk ? null : h('div', { className: 'kx-hatch' }),
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
            h('span', { className: 'kx-m' }, d.m),
            h('span', { className: 'kx-en' }, d.en)),
          p.showValueLabels
            ? h('div', { className: 'kx-cv' }, d.v, h('span', { className: 'kx-u' }, p.unit))
            : h('div'));
      }));
  }

  const scale = p.showScale ? h('div', { className: 'kx-hmp-scale' },
    h('div', { className: 'kx-sl' }, '低 / LOW'),
    h('div', { className: 'kx-hmp-ramp' }),
    h('div', { className: 'kx-sl' }, '高 / HIGH ' + maxV + p.unit)) : null;

  const foot = h('div', { className: 'kx-hmp-foot' },
    h('div', { className: 'kx-cl' }, '→ ' + p.closing),
    h('div', { className: 'kx-rt' }, p.footRight));

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-hmp-pad' }, head, band, body, scale, foot));
}

SlideHeat.defaults = {
  eyebrowId: '84', eyebrowLabel: 'MONTHLY HEAT',
  title: '全年月度热力', subhead: '12 个月融资节奏 / 金额 亿$',
  closing: '融资节奏的核心不是均值，而是峰值背后的超级交易。',
  unit: '亿', total: '970亿', footRight: '12 MONTHS · PEAK AUG',
  periods: [
    { m: '1月', en: 'JAN', v: 45 },
    { m: '2月', en: 'FEB', v: 58 },
    { m: '3月', en: 'MAR', v: 59 },
    { m: '4月', en: 'APR', v: 86 },
    { m: '5月', en: 'MAY', v: 105 },
    { m: '6月', en: 'JUN', v: 93 },
    { m: '7月', en: 'JUL', v: 92 },
    { m: '8月', en: 'AUG', v: 118 },
    { m: '9月', en: 'SEP', v: 108 },
    { m: '10月', en: 'OCT', v: 73 },
    { m: '11月', en: 'NOV', v: 81 },
    { m: '12月', en: 'DEC', v: 52 },
  ],
  chartType: 'grid', periodCount: 12, focusEnabled: true, focusIndex: 7,
  showScale: true, showValueLabels: true, showPeakMark: true, accent: '#c8f135',
};

SlideHeat.controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'grid',
    options: [['grid', '热力格'], ['columns', '纵向柱'], ['dots', '点阵']], desc: '同一组节奏数据的可视化形式' },
  { key: 'periodCount', label: '周期数量', type: 'number', default: 12, min: 6, max: 12, desc: '展示的周期（月份）数量' },
  { key: 'focusEnabled', label: '重点周期高亮', type: 'toggle', default: true, desc: '是否突出某一周期' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 7, min: 0, max: 11, desc: '被突出的周期序号（默认峰值月）', showIf: (p) => p.focusEnabled },
  { key: 'showPeakMark', label: '峰谷读数带', type: 'toggle', default: true, desc: '显示/隐藏顶部峰值/低位/合计读数（装饰锚点）' },
  { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏每格的金额数字（装饰数据）' },
  { key: 'showScale', label: '强度图例', type: 'toggle', default: true, desc: '显示/隐藏底部低→高强度图例（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideHeat;
