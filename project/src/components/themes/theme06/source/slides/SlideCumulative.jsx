// ============================================================================
// SlideCumulative.jsx — P25 累计资金分布 / Capital Concentration Curve
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic cumulative-share curve: how much of the whole is captured by the
// top-N. The optional equality reference line makes "head concentration" read
// as the gap the actual curve bows above. chartType switches area / line /
// steps; an SVG plot keeps the curve crisp at any scale (data viz, not art).
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   stages ({label,en,value}[])   content — cumulative points (ascending)
//   hero ({value,label})          content — headline concentration callout
//   chartType (enum)        VISUAL  'area' | 'line' | 'steps'
//   stageCount (int 2..4)   VISUAL  cumulative points shown
//   showEquality (bool)     VISUAL  even-distribution reference line (decorative)
//   showGrid (bool)         VISUAL  horizontal grid + axis ticks (decorative)
//   showValueLabels (bool)  VISUAL  per-point % labels (decorative)
//   focusEnabled (bool)     VISUAL  vertical guide + enlarged dot on one point
//   focusIndex (int)        VISUAL  which point (default = last)
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-cum-css')) {
    const css = `
    .kx-cum-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-cum-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-cum-title{font-size:68px;}
    .kx-cum-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-cum-main{flex:1;min-height:0;display:grid;grid-template-columns:1.62fr 0.88fr;column-gap:56px;padding:26px 0 8px;}
    .kx-cum-plotwrap{position:relative;min-height:0;display:flex;flex-direction:column;}
    .kx-cum-svg{flex:1;min-height:0;width:100%;height:100%;overflow:visible;}
    .kx-cum-xlab{display:grid;padding-top:14px;border-top:1px solid var(--kx-line);}
    .kx-cum-xi{text-align:center;}
    .kx-cum-xi .kx-xn{font-family:var(--kx-disp);font-weight:900;font-size:32px;letter-spacing:.01em;}
    .kx-cum-xi .kx-xe{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;margin-top:4px;}
    .kx-cum-xi.kx-on .kx-xn{color:var(--kx-accent);}
    /* right rail */
    .kx-cum-rail{display:flex;flex-direction:column;min-height:0;border-left:1px solid var(--kx-line);padding-left:54px;justify-content:center;gap:30px;}
    .kx-cum-hero .kx-hv{font-family:var(--kx-disp);font-weight:900;font-size:170px;line-height:.82;letter-spacing:-.03em;color:var(--kx-accent);}
    .kx-cum-hero .kx-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:10px;}
    .kx-cum-rows{display:flex;flex-direction:column;border-top:1px solid var(--kx-line);}
    .kx-cum-row{display:flex;justify-content:space-between;align-items:baseline;gap:18px;padding:15px 0;border-bottom:1px solid var(--kx-line);}
    .kx-cum-row .kx-rk{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-cum-row .kx-rv{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:1;letter-spacing:-.01em;}
    .kx-cum-row.kx-on .kx-rv{color:var(--kx-accent);}
    .kx-cum-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-cum-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-cum-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-cum-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const W = 1000, H = 470, PADL = 64, PADR = 26, PADT = 40, PADB = 30;
  const PLOTW = W - PADL - PADR, PLOTH = H - PADT - PADB, BASEY = PADT + PLOTH;

  function SlideCumulative(props) {
    const p = { ...SlideCumulative.defaults, ...props };
    const stages = p.stages.slice(0, Math.max(2, Math.min(p.stageCount, p.stages.length)));
    const fi = Math.min(p.focusIndex, stages.length - 1);
    const maxY = 100;
    // points include an implicit origin so the climb starts from zero
    const pts = [{ value: 0 }].concat(stages);
    const N = pts.length;
    const X = (i) => PADL + (i / (N - 1)) * PLOTW;
    const Y = (v) => BASEY - (v / maxY) * PLOTH;
    const coords = pts.map((d, i) => [X(i), Y(d.value)]);

    // path strings
    let line;
    if (p.chartType === 'steps') {
      line = coords.map((c, i) => i === 0 ? `M${c[0]},${c[1]}` : `H${c[0]} V${c[1]}`).join(' ');
    } else {
      line = coords.map((c, i) => (i === 0 ? 'M' : 'L') + c[0] + ',' + c[1]).join(' ');
    }
    const area = line + ` L${coords[N - 1][0]},${BASEY} L${coords[0][0]},${BASEY} Z`;
    const grid = [0, 25, 50, 75, 100];

    const svg = h('svg', { className: 'kx-cum-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' },
      p.showGrid ? grid.map((g, i) => h('g', { key: 'g' + i },
        h('line', { x1: PADL, y1: Y(g), x2: W - PADR, y2: Y(g), stroke: 'rgba(255,255,255,.10)', strokeWidth: 1 }),
        h('text', { x: PADL - 12, y: Y(g) + 7, fill: '#9a9a92', fontSize: 21, fontFamily: 'Space Mono, monospace', textAnchor: 'end' }, g + '%'))) : null,
      p.showEquality ? h('line', { x1: coords[0][0], y1: coords[0][1], x2: coords[N - 1][0], y2: coords[N - 1][1],
        stroke: 'var(--kx-mute-2)', strokeWidth: 2, strokeDasharray: '8 7', opacity: .6 }) : null,
      p.chartType !== 'line' ? h('path', { d: area, fill: 'var(--kx-accent)', opacity: .14 }) : null,
      h('path', { d: line, fill: 'none', stroke: 'var(--kx-accent)', strokeWidth: 4,
        strokeLinejoin: 'round', strokeLinecap: 'round' }),
      p.focusEnabled ? h('line', { x1: coords[fi + 1][0], y1: coords[fi + 1][1], x2: coords[fi + 1][0], y2: BASEY,
        stroke: 'var(--kx-accent)', strokeWidth: 2, strokeDasharray: '4 6', opacity: .7 }) : null,
      stages.map((d, i) => {
        const c = coords[i + 1]; const on = p.focusEnabled && i === fi;
        return h('g', { key: 'p' + i },
          h('circle', { cx: c[0], cy: c[1], r: on ? 13 : 8, fill: on ? 'var(--kx-accent)' : 'var(--kx-ink)',
            stroke: 'var(--kx-accent)', strokeWidth: 4 }),
          p.showValueLabels ? h('text', { x: c[0], y: c[1] - 26, fill: on ? 'var(--kx-accent)' : 'var(--kx-cream)',
            fontSize: on ? 40 : 32, fontWeight: 800, fontFamily: 'Archivo, sans-serif', textAnchor: i === stages.length - 1 ? 'end' : 'middle' }, d.value + '%') : null);
      }));

    const heroStage = stages[fi];
    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-cum-pad' },
        h('div', { className: 'kx-cum-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-cum-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-cum-sub' }, p.subhead)),
        h('div', { className: 'kx-cum-main' },
          h('div', { className: 'kx-cum-plotwrap' }, svg,
            h('div', { className: 'kx-cum-xlab', style: { gridTemplateColumns: `repeat(${stages.length},1fr)` } },
              stages.map((d, i) => h('div', { key: i, className: 'kx-cum-xi' + (p.focusEnabled && i === fi ? ' kx-on' : '') },
                h('div', { className: 'kx-xn' }, d.label),
                h('div', { className: 'kx-xe' }, d.en))))),
          h('div', { className: 'kx-cum-rail' },
            h('div', { className: 'kx-cum-hero' },
              h('div', { className: 'kx-hv' }, (heroStage ? heroStage.value : p.hero.value) + '%'),
              h('div', { className: 'kx-hl' }, (heroStage ? heroStage.label + ' ' : '') + p.hero.label)),
            h('div', { className: 'kx-cum-rows' },
              stages.map((d, i) => h('div', { key: i, className: 'kx-cum-row' + (p.focusEnabled && i === fi ? ' kx-on' : '') },
                h('span', { className: 'kx-rk' }, d.label),
                h('span', { className: 'kx-rv' }, d.value + '%')))))),
        h('div', { className: 'kx-cum-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, stages.length + ' 档 / ' + p.chartType.toUpperCase()))));
  }

  SlideCumulative.defaults = {
    eyebrowId: '25', eyebrowLabel: 'CAPITAL CURVE',
    title: '累计资金分布', subhead: '资本集中曲线 / CONCENTRATION',
    closing: '集中度本身就是市场结构。', unit: '%',
    hero: { value: 71.2, label: '累计占比 / CUMULATIVE' },
    stages: [
      { label: 'Top 3', en: '前 3 家', value: 18.7 },
      { label: 'Top 10', en: '前 10 家', value: 23.8 },
      { label: 'Top 25', en: '前 25 家', value: 48.5 },
      { label: 'Top 50', en: '前 50 家', value: 71.2 },
    ],
    chartType: 'area', stageCount: 4, showEquality: true, showGrid: true,
    showValueLabels: true, focusEnabled: true, focusIndex: 3, accent: '#c8f135',
  };

  SlideCumulative.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'area',
      options: [['area', '面积'], ['line', '折线'], ['steps', '阶梯']], desc: '累计曲线的可视化形式' },
    { key: 'stageCount', label: '档位数量', type: 'number', default: 4, min: 2, max: 4, desc: '累计占比的档位数量' },
    { key: 'showEquality', label: '均衡参考线', type: 'toggle', default: true, desc: '显示/隐藏均匀分布参考线（装饰，对比集中度）' },
    { key: 'showGrid', label: '坐标网格', type: 'toggle', default: true, desc: '显示/隐藏横向网格与刻度（装饰）' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各点占比标签（装饰数据）' },
    { key: 'focusEnabled', label: '重点档位高亮', type: 'toggle', default: true, desc: '是否用竖向引导线突出某一档位' },
    { key: 'focusIndex', label: '高亮第几档', type: 'number', default: 3, min: 0, max: 3, desc: '被突出的档位序号（默认末档）', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideCumulative;
