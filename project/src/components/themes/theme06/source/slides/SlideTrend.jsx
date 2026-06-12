// ============================================================================
// SlideTrend.jsx — P05 市场全景 / Trend (chart-led page)
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   series ({label,value,sub}[])   content — chart points + bottom metric cards
//   unit (string)                  content — value unit suffix on cards
//   metricCount (int 2..6) VISUAL  number of bottom metric cards
//   focusEnabled (bool)    VISUAL  emphasise one point (peak)
//   focusIndex (int)       VISUAL  which point is emphasised
//   chartType (enum)       VISUAL  'area' | 'bars' | 'line'
//   showDecor (bool)       VISUAL  baseline grid + peak marker (decorative)
//   accent (color)         VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-trend-css')) {
    const css = `
    .kx-trd-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:32px;}
    .kx-trd-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:26px;border-bottom:1px solid var(--kx-line);}
    .kx-trd-title{font-size:72px;}
    .kx-trd-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-trd-chart{flex:1;min-height:0;position:relative;margin:30px 0 10px;display:flex;flex-direction:column;}
    .kx-trd-inner{flex:1;min-height:0;display:flex;flex-direction:column;}
    .kx-trd-plot{flex:1;position:relative;min-height:0;}
    .kx-trd-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
    .kx-trd-grid line{stroke:var(--kx-line);stroke-width:1;}
    .kx-trd-bars{position:absolute;inset:0;display:flex;align-items:flex-end;gap:3%;}
    .kx-trd-bar{flex:1;background:#3a3a36;position:relative;display:flex;justify-content:center;
      transition:background .2s;}
    .kx-trd-bar.kx-on{background:var(--kx-accent);}
    .kx-trd-bar .kx-bv{position:absolute;top:-44px;font-family:var(--kx-mono);font-size:26px;font-weight:700;color:var(--kx-cream);white-space:nowrap;}
    .kx-trd-bar.kx-on .kx-bv{color:var(--kx-accent);}
    .kx-trd-peak{position:absolute;transform:translate(-50%,-130%);font-family:var(--kx-mono);
      font-size:24px;font-weight:700;color:var(--kx-ink);background:var(--kx-accent);
      padding:5px 12px;letter-spacing:.04em;white-space:nowrap;}
    .kx-trd-dot{fill:var(--kx-ink);stroke:var(--kx-accent);stroke-width:3;}
    .kx-trd-dot.kx-on{fill:var(--kx-accent);}
    .kx-trd-pt{position:absolute;width:15px;height:15px;border-radius:50%;background:var(--kx-ink);
      border:3px solid var(--kx-accent);transform:translate(-50%,-50%);box-sizing:border-box;}
    .kx-trd-pt.kx-on{background:var(--kx-accent);width:22px;height:22px;}
    .kx-trd-axis{display:flex;gap:3%;margin-top:18px;}
    .kx-trd-axis>div{flex:1;text-align:center;font-family:var(--kx-mono);font-size:26px;
      color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-trd-axis>div.kx-on{color:var(--kx-accent);}
    .kx-trd-cards{display:grid;gap:0;border-top:1px solid var(--kx-line);}
    .kx-trd-card{padding:24px 28px 6px 0;border-right:1px solid var(--kx-line);
      display:flex;flex-direction:column;gap:8px;}
    .kx-trd-card:last-child{border-right:none;}
    .kx-trd-card .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:60px;line-height:.9;letter-spacing:-.02em;}
    .kx-trd-card.kx-on .kx-cv{color:var(--kx-accent);}
    .kx-trd-card .kx-cc{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
      text-transform:uppercase;letter-spacing:.03em;}
    .kx-trd-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;}
    .kx-trd-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    `;
    const s = document.createElement('style'); s.id = 'kx-trend-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function TrendChart({ series, type, accent, focusIndex, focusEnabled, showDecor }) {
    const max = Math.max(...series.map((d) => d.value)) * 1.18;
    const n = series.length;
    // geometry in 0..100 space, plotted via percentages
    const x = (i) => (n === 1 ? 50 : (i / (n - 1)) * 100);
    const y = (v) => 100 - (v / max) * 100;

    const gridLines = showDecor
      ? h('g', { className: 'kx-trd-grid' },
          [0.25, 0.5, 0.75].map((g, i) =>
            h('line', { key: i, x1: 0, x2: 100, y1: g * 100, y2: g * 100, vectorEffect: 'non-scaling-stroke' })))
      : null;

    if (type === 'bars') {
      return h('div', { className: 'kx-trd-inner' },
        h('div', { className: 'kx-trd-plot' },
          showDecor ? h('svg', { className: 'kx-trd-svg', viewBox: '0 0 100 100', preserveAspectRatio: 'none' }, gridLines) : null,
          h('div', { className: 'kx-trd-bars' },
            series.map((d, i) => {
              const on = focusEnabled && i === focusIndex;
              return h('div', { key: i, className: 'kx-trd-bar' + (on ? ' kx-on' : ''),
                style: { height: ((d.value / max) * 100) + '%' } },
                h('span', { className: 'kx-bv' }, d.value));
            }))),
        h('div', { className: 'kx-trd-axis' },
          series.map((d, i) => h('div', { key: i, className: focusEnabled && i === focusIndex ? 'kx-on' : '' }, d.label))));
    }

    // area / line: SVG polyline (data viz, not decoration)
    const pts = series.map((d, i) => x(i) + ',' + y(d.value)).join(' ');
    const areaPts = '0,100 ' + pts + ' 100,100';
    return h('div', { className: 'kx-trd-inner' },
      h('div', { className: 'kx-trd-plot' },
        h('svg', { className: 'kx-trd-svg', viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
          gridLines,
          type === 'area'
            ? h('polygon', { points: areaPts, fill: accent, fillOpacity: 0.14 })
            : null,
          h('polyline', { points: pts, fill: 'none', stroke: accent, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke',
            strokeLinejoin: 'round', strokeLinecap: 'round' })),
        // round dots as HTML (kept circular regardless of SVG stretch)
        series.map((d, i) => {
          const on = focusEnabled && i === focusIndex;
          return h('div', { key: 'pt' + i, className: 'kx-trd-pt' + (on ? ' kx-on' : ''),
            style: { left: x(i) + '%', top: y(d.value) + '%' } });
        }),
        focusEnabled && showDecor
          ? h('div', { className: 'kx-trd-peak',
              style: { left: x(focusIndex) + '%', top: y(series[focusIndex].value) + '%' } },
              'PEAK ' + series[focusIndex].value)
          : null),
      h('div', { className: 'kx-trd-axis' },
        series.map((d, i) => h('div', { key: i, className: focusEnabled && i === focusIndex ? 'kx-on' : '' }, d.label))));
  }

  function SlideTrend(props) {
    const p = { ...SlideTrend.defaults, ...props };
    const cards = p.series.slice(0, Math.max(2, Math.min(p.metricCount, p.series.length)));
    const fi = Math.min(p.focusIndex, p.series.length - 1);
    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-trd-pad' },
        h('div', { className: 'kx-trd-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-trd-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-trd-sub' }, p.subhead)),
        h('div', { className: 'kx-trd-chart' },
          h(TrendChart, { series: p.series, type: p.chartType, accent: p.accent,
            focusIndex: fi, focusEnabled: p.focusEnabled, showDecor: p.showDecor })),
        h('div', { className: 'kx-trd-cards', style: { gridTemplateColumns: `repeat(${cards.length},1fr)` } },
          cards.map((d, i) => {
            const on = p.focusEnabled && i === fi;
            return h('div', { key: i, className: 'kx-trd-card' + (on ? ' kx-on' : '') },
              h('div', { className: 'kx-cv' }, d.value + (p.unit || '')),
              h('div', { className: 'kx-cc' }, d.label + ' · ' + d.sub));
          })),
        h('div', { className: 'kx-trd-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-eyebrow' }, h('span', { className: 'kx-eb-label' }, 'TREND ' + p.year)))));
  }

  SlideTrend.defaults = {
    eyebrowId: '05', eyebrowLabel: 'MARKET PANORAMA', year: '2024',
    title: '市场全景 · 纵向趋势', subhead: '逐季度融资额走势 / $B',
    closing: '高峰过后不是崩塌，而是市场开始筛选。',
    unit: '',
    series: [
      { label: 'Q1', value: 162, sub: '18 笔' },
      { label: 'Q2', value: 284, sub: '26 笔' },
      { label: 'Q3', value: 318, sub: '31 笔' },
      { label: 'Q4', value: 206, sub: '22 笔' },
    ],
    metricCount: 4, focusEnabled: true, focusIndex: 2, chartType: 'area', showDecor: true, accent: '#c8f135',
  };

  SlideTrend.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'area',
      options: [['area', '面积'], ['bars', '柱状'], ['line', '折线']], desc: '主视觉图表的呈现形式' },
    { key: 'metricCount', label: '指标卡数量', type: 'number', default: 4, min: 2, max: 6, desc: '底部数据卡的数量（按数据点截取）' },
    { key: 'focusEnabled', label: '峰值高亮', type: 'toggle', default: true, desc: '是否高亮某个数据点（峰值）' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 2, min: 0, max: 5, desc: '被高亮的数据点序号', showIf: (p) => p.focusEnabled },
    { key: 'showDecor', label: '装饰网格 / 峰值标', type: 'toggle', default: true, desc: '显示/隐藏基准网格线与峰值标记（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideTrend;
