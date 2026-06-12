// ============================================================================
// SlideDonut.jsx — P32 投研、风控与合规 / Composition Ring Chart
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "how a whole splits into parts" chart. N shares are drawn as an SVG
// donut/ring (or a horizontal bar fallback); the hole carries a hero figure so
// the chart doubles as the page anchor. One share can be pulled + accented as
// the focus. SVG keeps the wedges crisp at any scale (data viz, not art).
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit
//   hero ({value,unit,label})         hole figure (e.g. total funding)
//   segments ({name,en,value}[])      shares (values are %, need not sum to 100)
//   metrics ({k,v}[])                 supporting metric chips
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'donut' | 'ring' | 'bars'
//   segmentCount (int 2..4) shares shown
//   showCenter (bool)       hero figure in the donut hole (decorative)
//   showValueLabels (bool)  per-share % labels (decorative data)
//   focusEnabled (bool)     pull + accent one share
//   focusIndex (int)        which share
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-dnt-css')) {
    const css = `
    .kx-dnt-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-dnt-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-dnt-title{font-size:68px;}
    .kx-dnt-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-dnt-main{flex:1;min-height:0;display:grid;grid-template-columns:1.04fr 0.96fr;column-gap:60px;padding:24px 0 6px;}
    .kx-dnt-plot{position:relative;min-height:0;display:flex;align-items:center;justify-content:center;
      border-right:1px solid var(--kx-line);padding-right:52px;}
    .kx-dnt-svg{width:100%;height:100%;max-height:640px;overflow:visible;}
    .kx-dnt-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
      pointer-events:none;padding-right:52px;}
    .kx-dnt-cv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.9;white-space:nowrap;}
    .kx-dnt-cv .kx-n{font-size:104px;color:var(--kx-accent);}
    .kx-dnt-cv .kx-u{font-size:38px;color:var(--kx-mute);white-space:nowrap;}
    .kx-dnt-cl{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;margin-top:10px;max-width:208px;line-height:1.3;text-align:center;}
    /* legend rail */
    .kx-dnt-rail{display:flex;flex-direction:column;min-height:0;justify-content:center;}
    .kx-dnt-railcap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;padding-bottom:14px;border-bottom:1px solid var(--kx-line);}
    .kx-dnt-lrow{display:flex;align-items:center;gap:20px;padding:20px 0;border-bottom:1px solid var(--kx-line);}
    .kx-dnt-sw{width:18px;height:18px;flex:none;}
    .kx-dnt-lnm{flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;}
    .kx-dnt-lnm .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:34px;line-height:1;letter-spacing:-.01em;}
    .kx-dnt-lnm .kx-e{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-dnt-lv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
    .kx-dnt-lrow.kx-on .kx-lv,.kx-dnt-lrow.kx-on .kx-lnm .kx-k{color:var(--kx-accent);}
    .kx-dnt-chips{display:grid;margin-top:24px;border-top:1px solid var(--kx-line);}
    .kx-dnt-chip{padding:18px 22px 4px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
    .kx-dnt-chip:last-child{border-right:none;}
    .kx-dnt-chip .kx-cv{font-family:var(--kx-disp);font-weight:800;font-size:44px;line-height:.9;letter-spacing:-.02em;}
    .kx-dnt-chip .kx-ck{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* bars fallback */
    .kx-dnt-bars{display:flex;flex-direction:column;gap:26px;width:100%;padding:0 10px;}
    .kx-dnt-brow{display:flex;flex-direction:column;gap:12px;}
    .kx-dnt-bmeta{display:flex;justify-content:space-between;align-items:baseline;gap:18px;}
    .kx-dnt-bmeta .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:38px;letter-spacing:-.01em;}
    .kx-dnt-bmeta .kx-v{font-family:var(--kx-disp);font-weight:800;font-size:44px;letter-spacing:-.02em;}
    .kx-dnt-brow.kx-on .kx-k,.kx-dnt-brow.kx-on .kx-v{color:var(--kx-accent);}
    .kx-dnt-btrack{height:22px;background:#26261f;}
    .kx-dnt-bfill{height:100%;}
    .kx-dnt-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-dnt-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-dnt-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-dnt-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const GREYS = ['#5f5f55', '#787870', '#48483f', '#909086'];

  const CX = 230, CY = 230;
  function polar(r, ang) { const a = (ang) * Math.PI / 180; return [CX + r * Math.sin(a), CY - r * Math.cos(a)]; }
  function sector(rO, rI, start, end) {
    const large = (end - start) > 180 ? 1 : 0;
    const o0 = polar(rO, start), o1 = polar(rO, end), i1 = polar(rI, end), i0 = polar(rI, start);
    return `M${o0[0]},${o0[1]} A${rO},${rO} 0 ${large} 1 ${o1[0]},${o1[1]} `
      + `L${i1[0]},${i1[1]} A${rI},${rI} 0 ${large} 0 ${i0[0]},${i0[1]} Z`;
  }

  function SlideDonut(props) {
    const p = { ...SlideDonut.defaults, ...props };
    const segs = p.segments.slice(0, clamp(p.segmentCount, 2, p.segments.length));
    const fi = clamp(p.focusIndex, 0, segs.length - 1);
    const total = segs.reduce((a, b) => a + b.value, 0);
    const isBars = p.chartType === 'bars';
    const rO = 200, rI = p.chartType === 'ring' ? 170 : 132;
    const segColor = (i) => (p.focusEnabled && i === fi) ? 'var(--kx-accent)' : GREYS[i % GREYS.length];

    // build donut arcs (with a tiny gap between wedges)
    let acc = 0; const GAP = 1.4;
    const arcs = segs.map((sg, i) => {
      const sweep = (sg.value / total) * 360;
      const start = acc + GAP / 2, end = acc + sweep - GAP / 2;
      acc += sweep;
      const on = p.focusEnabled && i === fi;
      const mid = (start + end) / 2;
      const lbl = polar((rO + rI) / 2, mid);
      return { d: sector(on ? rO + 12 : rO, rI, start, end), color: segColor(i), on, lbl, val: sg.value, mid };
    });

    const plot = isBars
      ? h('div', { className: 'kx-dnt-bars' },
          segs.map((sg, i) => { const on = p.focusEnabled && i === fi;
            return h('div', { key: i, className: 'kx-dnt-brow' + (on ? ' kx-on' : '') },
              h('div', { className: 'kx-dnt-bmeta' },
                h('span', { className: 'kx-k' }, sg.name),
                p.showValueLabels ? h('span', { className: 'kx-v' }, sg.value + (p.unit || '%')) : null),
              h('div', { className: 'kx-dnt-btrack' },
                h('div', { className: 'kx-dnt-bfill', style: { width: ((sg.value / Math.max(...segs.map((x) => x.value))) * 100) + '%', background: segColor(i) } }))); }))
      : h('div', { style: { position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          h('svg', { className: 'kx-dnt-svg', viewBox: '0 0 460 460' },
            arcs.map((a, i) => h('path', { key: i, d: a.d, fill: a.color })),
            p.showValueLabels ? arcs.map((a, i) => h('text', { key: 't' + i, x: a.lbl[0], y: a.lbl[1] + 9,
              fill: a.on ? 'var(--kx-ink)' : 'var(--kx-cream)', fontSize: a.on ? 32 : 26, fontWeight: 800,
              fontFamily: 'Archivo, sans-serif', textAnchor: 'middle' }, a.val + (p.unit || '%'))) : null),
          p.showCenter ? h('div', { className: 'kx-dnt-center' },
            h('div', { className: 'kx-dnt-cv' },
              h('span', { className: 'kx-n' }, p.hero.value),
              p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
            h('div', { className: 'kx-dnt-cl' }, p.hero.label)) : null);

    const rail = h('div', { className: 'kx-dnt-rail' },
      h('div', { className: 'kx-dnt-railcap' }, '场景占比 / SEGMENT SHARE'),
      segs.map((sg, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-dnt-lrow' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-dnt-sw', style: { background: segColor(i) } }),
          h('div', { className: 'kx-dnt-lnm' },
            h('span', { className: 'kx-k' }, sg.name),
            h('span', { className: 'kx-e' }, sg.en)),
          h('span', { className: 'kx-dnt-lv' }, sg.value + (p.unit || '%'))); }),
      p.metrics && p.metrics.length
        ? h('div', { className: 'kx-dnt-chips', style: { gridTemplateColumns: `repeat(${p.metrics.length},1fr)` } },
            p.metrics.map((m, i) => h('div', { key: i, className: 'kx-dnt-chip' },
              h('span', { className: 'kx-cv' }, m.v),
              h('span', { className: 'kx-ck' }, m.k))))
        : null);

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-dnt-pad' },
        h('div', { className: 'kx-dnt-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-dnt-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-dnt-sub' }, p.subhead)),
        h('div', { className: 'kx-dnt-main' },
          h('div', { className: 'kx-dnt-plot' }, plot), rail),
        h('div', { className: 'kx-dnt-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, segs.length + ' 项 / ' + p.chartType.toUpperCase()))));
  }

  SlideDonut.defaults = {
    eyebrowId: '32', eyebrowLabel: 'FINANCE AI',
    title: '投研、风控与合规', subhead: '金融 AI 赛道 / FINANCE AI', unit: '%',
    closing: '高价值行业需要更强可信度。',
    hero: { value: '22', unit: '亿$', label: '赛道融资额 / FUNDING' },
    segments: [
      { name: '投研', en: 'RESEARCH', value: 31 },
      { name: '合规', en: 'COMPLIANCE', value: 28 },
      { name: '风控', en: 'RISK CONTROL', value: 24 },
      { name: '客户服务', en: 'SERVICE', value: 17 },
    ],
    metrics: [
      { k: '事件数 / DEALS', v: '7 笔' },
      { k: '平均单笔 / AVG', v: '3.1 亿' },
    ],
    chartType: 'donut', segmentCount: 4, showCenter: true, showValueLabels: true,
    focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlideDonut.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'donut',
      options: [['donut', '环形'], ['ring', '细环'], ['bars', '条形']], desc: '占比的可视化形式' },
    { key: 'segmentCount', label: '占比项数', type: 'number', default: 4, min: 2, max: 4, desc: '展示的占比项数量' },
    { key: 'showCenter', label: '中心数字', type: 'toggle', default: true, desc: '显示/隐藏圆环中心的主数字（装饰，仅环形）', showIf: (p) => p.chartType !== 'bars' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各项占比标签（装饰数据）' },
    { key: 'focusEnabled', label: '重点占比高亮', type: 'toggle', default: true, desc: '是否拉出并突出某一占比项' },
    { key: 'focusIndex', label: '高亮第几项', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的占比序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P52 资本来源结构 — reuse this ring chart via a preset passed as props.
  // Migration: any host can render <SlideDonut {...SlideDonut.presetInvestor} />.
  SlideDonut.presetInvestor = {
    eyebrowId: '52', eyebrowLabel: 'INVESTOR MIX',
    title: '资本来源结构', subhead: '投资人类型分布 / INVESTOR MIX', unit: '%',
    closing: '钱的来源本身也是产业结构信号。',
    hero: { value: '40', unit: '%', label: '产业资本合计 / STRATEGIC CAPITAL' },
    segments: [
      { name: '传统 VC', en: 'VENTURE CAPITAL', value: 42 },
      { name: '企业战略', en: 'CORPORATE', value: 27 },
      { name: '成长基金', en: 'GROWTH FUND', value: 18 },
      { name: '云厂商相关', en: 'CLOUD-LINKED', value: 13 },
    ],
    metrics: [
      { k: '覆盖事件 / DEALS', v: '97 笔' },
      { k: '产业资本占比 / STRATEGIC', v: '40%' },
    ],
    chartType: 'donut', segmentCount: 4, showCenter: true, showValueLabels: true,
    focusEnabled: true, focusIndex: 1, accent: '#c8f135',
  };

export default SlideDonut;
