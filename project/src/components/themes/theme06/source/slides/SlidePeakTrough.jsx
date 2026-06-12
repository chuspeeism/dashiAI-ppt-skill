// ============================================================================
// SlidePeakTrough.jsx — P21 峰值与低位 / Peak-Trough Comparison Chart
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic ranked-comparison chart that reads the spread between extremes. The
// max and min points get distinct treatments (markExtremes) so "peak vs trough"
// is instantly legible; an optional average baseline anchors the middle.
// chartType switches columns / lollipops / dot-stacks over the same data.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   points ({label,value,sub}[])   content — comparison points
//   spread ({k,v}[])               content — summary chips (peak / trough / gap)
//   chartType (enum)        VISUAL  'columns' | 'lollipop' | 'dots'
//   pointCount (int 3..5)   VISUAL  points shown
//   markExtremes (bool)     VISUAL  colour the max (peak) & min (trough)
//   showValueLabels (bool)  VISUAL  per-point value labels (decorative)
//   showBaseline (bool)     VISUAL  average baseline guide (decorative)
//   focusEnabled (bool)     VISUAL  ring + callout on one point
//   focusIndex (int)        VISUAL  which point
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-ptr-css')) {
    const css = `
    .kx-ptr-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-ptr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-ptr-title{font-size:68px;}
    .kx-ptr-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-ptr-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:26px;padding:30px 0 6px;}
    /* summary chips */
    .kx-ptr-chips{display:flex;gap:0;border-top:1px solid var(--kx-line);border-bottom:1px solid var(--kx-line);}
    .kx-ptr-chip{flex:1;display:flex;flex-direction:column;gap:6px;padding:16px 26px 14px 0;border-right:1px solid var(--kx-line);}
    .kx-ptr-chip:last-child{border-right:none;}
    .kx-ptr-chip .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:52px;line-height:.9;letter-spacing:-.02em;}
    .kx-ptr-chip:first-child .kx-cv{color:var(--kx-accent);}
    .kx-ptr-chip .kx-ck{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* plot */
    .kx-ptr-plot{flex:1;min-height:0;position:relative;display:grid;align-items:end;column-gap:30px;padding-top:46px;}
    .kx-ptr-base{position:absolute;left:0;right:0;height:0;border-top:2px dashed var(--kx-line);z-index:0;}
    .kx-ptr-base .kx-bl{position:absolute;right:0;top:-30px;font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-ptr-col{position:relative;display:flex;flex-direction:column;height:100%;justify-content:flex-end;align-items:center;z-index:1;}
    /* columns variant */
    .kx-ptr-bar{width:100%;background:#34342f;border-radius:5px 5px 0 0;position:relative;min-height:6px;}
    .kx-ptr-col.kx-peak .kx-ptr-bar{background:var(--kx-accent);}
    .kx-ptr-col.kx-trough .kx-ptr-bar{background:#5a5a52;}
    .kx-ptr-col.kx-focus .kx-ptr-bar{outline:2px solid var(--kx-accent);outline-offset:3px;}
    .kx-ptr-bv{position:absolute;top:-40px;left:50%;transform:translateX(-50%);font-family:var(--kx-disp);
      font-weight:800;font-size:36px;letter-spacing:-.01em;color:var(--kx-cream);white-space:nowrap;}
    .kx-ptr-col.kx-peak .kx-ptr-bv{color:var(--kx-accent);}
    /* lollipop variant */
    .kx-ptr-stem{width:3px;background:var(--kx-line);flex:1;}
    .kx-ptr-knob{width:30px;height:30px;border-radius:50%;background:#5a5a52;position:relative;}
    .kx-ptr-col.kx-peak .kx-ptr-knob{background:var(--kx-accent);}
    .kx-ptr-col.kx-trough .kx-ptr-knob{background:#5a5a52;outline:2px solid var(--kx-line);}
    .kx-ptr-col.kx-focus .kx-ptr-knob{outline:3px solid var(--kx-accent);outline-offset:3px;}
    /* dots variant */
    .kx-ptr-stack{display:flex;flex-direction:column-reverse;gap:7px;align-items:center;width:100%;}
    .kx-ptr-dot{width:15px;height:15px;border-radius:50%;background:#34342f;}
    .kx-ptr-col.kx-peak .kx-ptr-dot{background:var(--kx-accent);}
    .kx-ptr-col.kx-trough .kx-ptr-dot{background:#5a5a52;}
    /* axis labels */
    .kx-ptr-axis{display:grid;column-gap:30px;border-top:1px solid var(--kx-line);padding-top:16px;}
    .kx-ptr-lab{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;}
    .kx-ptr-lab .kx-lm{font-family:var(--kx-disp);font-weight:900;font-size:34px;letter-spacing:.01em;}
    .kx-ptr-lab .kx-ls{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-ptr-col.kx-peak ~ .kx-ptr-lab{color:var(--kx-accent);}
    .kx-ptr-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-ptr-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-ptr-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-ptr-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlidePeakTrough(props) {
    const p = { ...SlidePeakTrough.defaults, ...props };
    const pts = p.points.slice(0, Math.max(3, Math.min(p.pointCount, p.points.length)));
    const vals = pts.map((d) => d.value);
    const maxV = Math.max(...vals), minV = Math.min(...vals);
    const maxI = vals.indexOf(maxV), minI = vals.indexOf(minV);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const fi = Math.min(p.focusIndex, pts.length - 1);
    const cols = `repeat(${pts.length},1fr)`;
    const cls = (i) => 'kx-ptr-col'
      + (p.markExtremes && i === maxI ? ' kx-peak' : '')
      + (p.markExtremes && i === minI ? ' kx-trough' : '')
      + (p.focusEnabled && i === fi ? ' kx-focus' : '');

    const plotInner = pts.map((d, i) => {
      const hpct = Math.max(6, (d.value / maxV) * 100);
      let mark;
      if (p.chartType === 'lollipop') {
        mark = [h('div', { key: 's', className: 'kx-ptr-stem', style: { height: hpct + '%' } }),
                h('div', { key: 'k', className: 'kx-ptr-knob' },
                  p.showValueLabels ? h('span', { className: 'kx-ptr-bv' }, d.value) : null)];
      } else if (p.chartType === 'dots') {
        const n = Math.max(1, Math.round((d.value / maxV) * 10));
        mark = h('div', { className: 'kx-ptr-stack' },
          Array.from({ length: n }, (_, k) => h('div', { key: k, className: 'kx-ptr-dot' })),
          p.showValueLabels ? h('span', { className: 'kx-ptr-bv', style: { position: 'static', transform: 'none', marginTop: '6px' } }, d.value) : null);
      } else {
        mark = h('div', { className: 'kx-ptr-bar', style: { height: hpct + '%' } },
          p.showValueLabels ? h('span', { className: 'kx-ptr-bv' }, d.value) : null);
      }
      return h('div', { key: i, className: cls(i) }, mark);
    });

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-ptr-pad' },
        h('div', { className: 'kx-ptr-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-ptr-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-ptr-sub' }, p.subhead)),

        h('div', { className: 'kx-ptr-body' },
          h('div', { className: 'kx-ptr-chips' },
            p.spread.map((c, i) => h('div', { key: i, className: 'kx-ptr-chip' },
              h('span', { className: 'kx-cv' }, c.v),
              h('span', { className: 'kx-ck' }, c.k)))),
          h('div', { className: 'kx-ptr-plot', style: { gridTemplateColumns: cols } },
            p.showBaseline ? h('div', { className: 'kx-ptr-base', style: { bottom: ((avg / maxV) * 100) + '%' } },
              h('span', { className: 'kx-bl' }, '均值 ' + avg.toFixed(0) + (p.unit || ''))) : null,
            plotInner),
          h('div', { className: 'kx-ptr-axis', style: { gridTemplateColumns: cols } },
            pts.map((d, i) => h('div', { key: i, className: 'kx-ptr-lab',
              style: (p.markExtremes && i === maxI) ? { color: 'var(--kx-accent)' } : null },
              h('span', { className: 'kx-lm' }, d.label),
              h('span', { className: 'kx-ls' }, d.sub))))),

        h('div', { className: 'kx-ptr-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, '峰谷差 ' + (maxV - minV) + (p.unit || '') + ' / ' + p.chartType.toUpperCase()))));
  }

  SlidePeakTrough.defaults = {
    eyebrowId: '21', eyebrowLabel: 'PEAK & TROUGH',
    title: '峰值与低位', subhead: '月度峰谷对比 / MONTHLY SPREAD',
    closing: '月度波动背后是头部交易节奏。', unit: '亿',
    points: [
      { label: '8月', value: 118, sub: 'AUG · 峰值' },
      { label: '9月', value: 108, sub: 'SEP' },
      { label: '5月', value: 105, sub: 'MAY' },
      { label: '12月', value: 52, sub: 'DEC' },
      { label: '1月', value: 45, sub: 'JAN · 低位' },
    ],
    spread: [
      { k: '峰值月份 / PEAK', v: '118 亿' },
      { k: '低位月份 / TROUGH', v: '45 亿' },
      { k: '峰谷差 / GAP', v: '73 亿' },
    ],
    chartType: 'columns', pointCount: 5, markExtremes: true, showValueLabels: true,
    showBaseline: true, focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlidePeakTrough.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'columns',
      options: [['columns', '柱状'], ['lollipop', '棒棒糖'], ['dots', '点阵']], desc: '峰谷对比的可视化形式' },
    { key: 'pointCount', label: '数据点数量', type: 'number', default: 5, min: 3, max: 5, desc: '展示的月份/数据点数量' },
    { key: 'markExtremes', label: '标记峰谷', type: 'toggle', default: true, desc: '是否用不同颜色标记最高/最低点' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏每个数据点的数值（装饰数据）' },
    { key: 'showBaseline', label: '均值基准线', type: 'toggle', default: true, desc: '显示/隐藏平均值基准线（装饰）' },
    { key: 'focusEnabled', label: '重点点位高亮', type: 'toggle', default: true, desc: '是否用描边突出某一数据点' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 4, desc: '被突出的数据点序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlidePeakTrough;
