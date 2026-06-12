// ============================================================================
// SlideRadar.jsx — P27 算力·数据·人才·渠道 / Multi-dimensional Capability Chart
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "many dimensions, one subject" chart page. Plots N capability axes
// as a radar (spider) polygon — or, via chartType, the SAME data as horizontal
// bars or a dot-matrix. Each axis carries a display value (e.g. "+64%") shown in
// the right-hand legend; an optional benchmark polygon makes "above / below the
// baseline" readable at a glance. SVG keeps the radar crisp at any scale.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing,footRight
//   axes ({k,en,v,mag,base}[])   k=label, en=mono sub, v=display value,
//                                mag=0..100 plot magnitude, base=0..100 benchmark
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'radar' | 'bars' | 'dots'  visualization form
//   axisCount (int 3..6)    dimensions shown
//   showGrid (bool)         radar rings / bar gridlines (decorative)
//   showCompare (bool)      benchmark polygon / marker (decorative data)
//   showValueLabels (bool)  per-axis value labels (decorative data)
//   focusEnabled (bool)     emphasise one axis
//   focusIndex (int)        which axis
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-rad-css')) {
    const css = `
    .kx-rad-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-rad-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-rad-title{font-size:68px;}
    .kx-rad-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-rad-main{flex:1;min-height:0;display:grid;grid-template-columns:1.12fr 0.88fr;column-gap:60px;padding:24px 0 6px;}
    /* plot column */
    .kx-rad-plot{position:relative;min-height:0;display:flex;flex-direction:column;justify-content:center;
      border-right:1px solid var(--kx-line);padding-right:56px;}
    .kx-rad-svg{width:100%;height:100%;min-height:0;overflow:visible;}
    .kx-rad-pcap{position:absolute;top:2px;left:0;font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);
      letter-spacing:.05em;text-transform:uppercase;}
    /* bars variant */
    .kx-rad-bars{display:flex;flex-direction:column;gap:26px;width:100%;}
    .kx-rad-brow{display:flex;flex-direction:column;gap:11px;}
    .kx-rad-bmeta{display:flex;justify-content:space-between;align-items:baseline;}
    .kx-rad-bmeta .kx-bk{font-family:var(--kx-mono);font-size:25px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-rad-bmeta .kx-bv{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:1;letter-spacing:-.01em;}
    .kx-rad-brow.kx-on .kx-bv{color:var(--kx-accent);}
    .kx-rad-btrack{height:18px;background:#26261f;position:relative;}
    .kx-rad-bfill{height:100%;background:#3a3a32;}
    .kx-rad-brow.kx-on .kx-rad-bfill{background:var(--kx-accent);}
    .kx-rad-bbase{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--kx-mute-2);opacity:.7;}
    /* dots variant */
    .kx-rad-dots{display:flex;flex-direction:column;gap:24px;width:100%;}
    .kx-rad-drow{display:flex;align-items:center;gap:28px;}
    .kx-rad-dk{flex:0 0 38%;font-family:var(--kx-mono);font-size:25px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-rad-drow.kx-on .kx-rad-dk{color:var(--kx-cream);}
    .kx-rad-dgrid{flex:1;display:grid;grid-template-columns:repeat(10,1fr);gap:9px;}
    .kx-rad-dot{aspect-ratio:1;border-radius:50%;background:#2c2c25;}
    .kx-rad-dot.kx-fill{background:#52524a;}
    .kx-rad-drow.kx-on .kx-rad-dot.kx-fill{background:var(--kx-accent);}
    .kx-rad-dv{flex:0 0 auto;font-family:var(--kx-disp);font-weight:800;font-size:34px;letter-spacing:-.01em;min-width:96px;text-align:right;}
    .kx-rad-drow.kx-on .kx-rad-dv{color:var(--kx-accent);}
    /* legend rail */
    .kx-rad-rail{display:flex;flex-direction:column;min-height:0;justify-content:center;gap:0;}
    .kx-rad-legcap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;padding-bottom:18px;border-bottom:1px solid var(--kx-line);}
    .kx-rad-lrow{display:flex;align-items:center;gap:22px;padding:22px 0;border-bottom:1px solid var(--kx-line);}
    .kx-rad-lswatch{flex:0 0 14px;width:14px;height:14px;background:#3a3a32;}
    .kx-rad-lrow.kx-on .kx-rad-lswatch{background:var(--kx-accent);}
    .kx-rad-lbody{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}
    .kx-rad-lk{font-family:var(--kx-disp);font-weight:800;font-size:30px;line-height:1;letter-spacing:-.01em;}
    .kx-rad-len{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-rad-lv{flex:0 0 auto;font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
    .kx-rad-lrow.kx-on .kx-rad-lv{color:var(--kx-accent);}
    .kx-rad-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-rad-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-rad-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-rad-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function SlideRadar(props) {
    const p = { ...SlideRadar.defaults, ...props };
    const axes = p.axes.slice(0, clamp(p.axisCount, 3, p.axes.length));
    const N = axes.length;
    const fi = clamp(p.focusIndex, 0, N - 1);

    // ---- radar geometry --------------------------------------------------
    const VB = 560, cx = VB / 2, cy = VB / 2 + 4, R = 198;
    const ang = (i) => (-90 + (i * 360) / N) * Math.PI / 180;
    const pt = (i, m) => [cx + R * (m / 100) * Math.cos(ang(i)), cy + R * (m / 100) * Math.sin(ang(i))];
    const poly = (key) => axes.map((a, i) => pt(i, a[key])).map((c) => c[0].toFixed(1) + ',' + c[1].toFixed(1)).join(' ');
    const rings = [25, 50, 75, 100];

    const radar = h('svg', { className: 'kx-rad-svg', viewBox: `0 0 ${VB} ${VB}`, preserveAspectRatio: 'xMidYMid meet' },
      // grid rings + spokes
      p.showGrid ? h('g', null,
        rings.map((rr, i) => h('polygon', { key: 'r' + i,
          points: axes.map((a, j) => pt(j, rr)).map((c) => c[0].toFixed(1) + ',' + c[1].toFixed(1)).join(' '),
          fill: 'none', stroke: 'rgba(255,255,255,.10)', strokeWidth: 1 })),
        axes.map((a, i) => { const e = pt(i, 100);
          return h('line', { key: 's' + i, x1: cx, y1: cy, x2: e[0], y2: e[1], stroke: 'rgba(255,255,255,.10)', strokeWidth: 1 }); })) : null,
      // benchmark polygon
      p.showCompare ? h('polygon', { points: poly('base'), fill: 'none',
        stroke: 'var(--kx-mute-2)', strokeWidth: 2, strokeDasharray: '7 6', opacity: .7 }) : null,
      // data polygon
      h('polygon', { points: poly('mag'), fill: 'var(--kx-accent)', fillOpacity: .16,
        stroke: 'var(--kx-accent)', strokeWidth: 4, strokeLinejoin: 'round' }),
      // vertices + labels
      axes.map((a, i) => {
        const c = pt(i, a.mag), lab = pt(i, 116), on = p.focusEnabled && i === fi;
        const anchor = Math.abs(lab[0] - cx) < 30 ? 'middle' : lab[0] > cx ? 'start' : 'end';
        return h('g', { key: 'v' + i },
          h('circle', { cx: c[0], cy: c[1], r: on ? 12 : 7, fill: on ? 'var(--kx-accent)' : 'var(--kx-ink)',
            stroke: 'var(--kx-accent)', strokeWidth: 4 }),
          p.showValueLabels ? h('text', { x: lab[0], y: lab[1] + 8, textAnchor: anchor,
            fill: on ? 'var(--kx-accent)' : 'var(--kx-cream)', fontSize: on ? 34 : 28, fontWeight: 800,
            fontFamily: 'Archivo, sans-serif' }, a.v) : null);
      }));

    const bars = h('div', { className: 'kx-rad-bars' },
      axes.map((a, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-rad-brow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-rad-bmeta' },
            h('span', { className: 'kx-bk' }, a.k),
            p.showValueLabels ? h('span', { className: 'kx-bv' }, a.v) : null),
          h('div', { className: 'kx-rad-btrack' },
            h('div', { className: 'kx-rad-bfill', style: { width: a.mag + '%' } }),
            p.showCompare ? h('div', { className: 'kx-rad-bbase', style: { left: a.base + '%' } }) : null)); }));

    const dots = h('div', { className: 'kx-rad-dots' },
      axes.map((a, i) => { const on = p.focusEnabled && i === fi; const filled = Math.round(a.mag / 10);
        return h('div', { key: i, className: 'kx-rad-drow' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-rad-dk' }, a.k),
          h('div', { className: 'kx-rad-dgrid' },
            Array.from({ length: 10 }, (_, j) => h('span', { key: j, className: 'kx-rad-dot' + (j < filled ? ' kx-fill' : '') }))),
          p.showValueLabels ? h('span', { className: 'kx-rad-dv' }, a.v) : null); }));

    const plot = p.chartType === 'bars' ? bars : p.chartType === 'dots' ? dots : radar;
    const plotCap = p.chartType === 'radar' ? '四维能力雷达 / CAPABILITY RADAR'
      : p.chartType === 'bars' ? '能力对比柱 / CAPABILITY BARS' : '能力点阵 / CAPABILITY DOTS';

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-rad-pad' },
        h('div', { className: 'kx-rad-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-rad-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-rad-sub' }, p.subhead)),
        h('div', { className: 'kx-rad-main' },
          h('div', { className: 'kx-rad-plot' },
            h('div', { className: 'kx-rad-pcap' }, plotCap), plot),
          h('div', { className: 'kx-rad-rail' },
            h('div', { className: 'kx-rad-legcap' }, '维度明细 / DIMENSIONS'),
            axes.map((a, i) => { const on = p.focusEnabled && i === fi;
              return h('div', { key: i, className: 'kx-rad-lrow' + (on ? ' kx-on' : '') },
                h('span', { className: 'kx-rad-lswatch' }),
                h('div', { className: 'kx-rad-lbody' },
                  h('span', { className: 'kx-rad-lk' }, a.k),
                  h('span', { className: 'kx-rad-len' }, a.en)),
                h('span', { className: 'kx-rad-lv' }, a.v)); }))),
        h('div', { className: 'kx-rad-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, (p.footRight || (N + ' DIM')) + ' · ' + p.chartType.toUpperCase()))));
  }

  SlideRadar.defaults = {
    eyebrowId: '27', eyebrowLabel: 'MODEL LAB RACE',
    title: '算力、数据、人才与渠道', subhead: '模型实验室竞争 / RESOURCE EDGE',
    closing: '模型能力只是入口，交付能力才是商业化。',
    footRight: '同比变化 / YoY',
    axes: [
      { k: '算力预算 / COMPUTE', en: 'TRAINING BUDGET', v: '+64%', mag: 86, base: 52 },
      { k: '企业 API 客户 / CLIENTS', en: 'ENTERPRISE API', v: '+52%', mag: 78, base: 50 },
      { k: '研究团队 / TEAM', en: 'RESEARCH HEADCOUNT', v: '+38%', mag: 64, base: 48 },
      { k: '推理成本 / COST', en: 'INFERENCE COST', v: '-21%', mag: 58, base: 54 },
    ],
    chartType: 'radar', axisCount: 4, showGrid: true, showCompare: true,
    showValueLabels: true, focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlideRadar.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'radar',
      options: [['radar', '雷达'], ['bars', '柱状'], ['dots', '点阵']], desc: '多维能力的可视化形式' },
    { key: 'axisCount', label: '维度数量', type: 'number', default: 4, min: 3, max: 6, desc: '展示的能力维度数量' },
    { key: 'showGrid', label: '网格刻度', type: 'toggle', default: true, desc: '显示/隐藏雷达环线或柱状基准（装饰）' },
    { key: 'showCompare', label: '基准对照', type: 'toggle', default: true, desc: '显示/隐藏行业基准多边形 / 基准线（装饰数据）' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各维度数值标签（装饰数据）' },
    { key: 'focusEnabled', label: '重点维度高亮', type: 'toggle', default: true, desc: '是否突出某一能力维度' },
    { key: 'focusIndex', label: '高亮第几维', type: 'number', default: 0, min: 0, max: 5, desc: '被突出的维度序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideRadar;
