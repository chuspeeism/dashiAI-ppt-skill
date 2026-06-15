// ============================================================================
// SlideAlliance.jsx — P54 投资与算力消费闭环 / Cloud Alliance Flow (chart)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "many sources flow into one hub" relationship chart. N providers on
// the left send weighted flows (Sankey-style filled ribbons, width ∝ value) into
// a single hub on the right; a closed-loop ribbon below states the round trip
// (invest → consume → invest). chartType switches the same data between the flow
// map, ranked bars, or a dot plot. SVG ribbons (filled, not stroked) stay crisp
// at any scale (data viz, not art).
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit
//   providers ({name,en,value}[])  source nodes (e.g. cloud providers)
//   hub ({name,en,label})          the convergence node (e.g. AI companies)
//   loop ({a,fwd,b,back})          closed-loop ribbon labels
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'flow' | 'bars' | 'dots'
//   providerCount (int 2..4) sources shown
//   showLoop (bool)         closed-loop ribbon (decorative)
//   showValueLabels (bool)  per-source value labels (decorative data)
//   showHub (bool)          hub node total (decorative; flow only)
//   focusEnabled (bool)     emphasise one source flow
//   focusIndex (int)        which source
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (!document.getElementById('kx-all-css')) {
  const css = `
  .kx-all-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-all-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-all-title{font-size:68px;}
  .kx-all-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  .kx-all-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:22px 0 4px;}
  .kx-all-plot{position:relative;flex:1;min-height:0;}
  .kx-all-svg{position:absolute;inset:0;width:100%;height:100%;}
  /* provider labels overlaid on the left */
  .kx-all-prov{position:absolute;left:0;width:33%;display:flex;flex-direction:column;gap:4px;
    transform:translateY(-50%);text-align:right;padding-right:28px;}
  .kx-all-prov .kx-pk{font-family:var(--kx-disp);font-weight:900;font-size:40px;line-height:.98;letter-spacing:-.01em;}
  .kx-all-prov .kx-pe{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-all-prov .kx-pv{font-family:var(--kx-disp);font-weight:800;font-size:30px;color:var(--kx-accent);letter-spacing:-.02em;margin-top:2px;}
  .kx-all-prov.kx-on .kx-pk{color:var(--kx-accent);}
  /* hub node on the right */
  .kx-all-hub{position:absolute;right:0;width:25%;top:50%;transform:translateY(-50%);
    border:1px solid var(--kx-accent);border-left:4px solid var(--kx-accent);padding:24px 24px 22px;
    background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 88%);
    display:flex;flex-direction:column;gap:10px;}
  .kx-all-hub .kx-hk{font-family:var(--kx-disp);font-weight:900;font-size:42px;line-height:.98;letter-spacing:-.01em;}
  .kx-all-hub .kx-he{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-all-hub .kx-hv{font-family:var(--kx-disp);font-weight:800;font-size:74px;color:var(--kx-accent);line-height:.85;letter-spacing:-.03em;margin-top:6px;}
  .kx-all-hub .kx-hl{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
  /* bars / dots fallbacks */
  .kx-all-bars{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:30px;padding:0 4px;}
  .kx-all-brow{display:flex;flex-direction:column;gap:11px;}
  .kx-all-bmeta{display:flex;justify-content:space-between;align-items:baseline;gap:18px;}
  .kx-all-bmeta .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:40px;letter-spacing:-.01em;}
  .kx-all-bmeta .kx-e{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;margin-left:14px;}
  .kx-all-bmeta .kx-v{font-family:var(--kx-disp);font-weight:800;font-size:48px;letter-spacing:-.02em;}
  .kx-all-btrack{height:28px;background:#26261f;}
  .kx-all-bfill{height:100%;}
  .kx-all-brow.kx-on .kx-k,.kx-all-brow.kx-on .kx-v{color:var(--kx-accent);}
  .kx-all-dots{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:30px;padding:0 4px;}
  .kx-all-drow{display:flex;align-items:center;gap:26px;}
  .kx-all-dot{border-radius:50%;background:#4a4a44;flex:none;}
  .kx-all-drow.kx-on .kx-all-dot{background:var(--kx-accent);}
  .kx-all-dnm{flex:1;display:flex;flex-direction:column;gap:3px;}
  .kx-all-dnm .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:40px;letter-spacing:-.01em;}
  .kx-all-dnm .kx-e{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-all-dv{font-family:var(--kx-disp);font-weight:800;font-size:50px;color:var(--kx-accent);letter-spacing:-.02em;}
  /* closed-loop ribbon */
  .kx-all-loop{display:flex;align-items:stretch;gap:0;margin-top:18px;border:1px solid var(--kx-line);}
  .kx-all-loopbadge{display:flex;align-items:center;gap:10px;background:var(--kx-accent);color:var(--kx-ink);
    font-family:var(--kx-mono);font-weight:700;font-size:22px;letter-spacing:.04em;text-transform:uppercase;padding:16px 18px;white-space:nowrap;}
  .kx-all-loopflow{flex:1;display:flex;align-items:center;justify-content:space-around;gap:14px;padding:14px 22px;flex-wrap:nowrap;}
  .kx-all-pill{font-family:var(--kx-disp);font-weight:800;font-size:28px;letter-spacing:-.01em;white-space:nowrap;}
  .kx-all-arr{display:flex;align-items:center;gap:8px;font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;}
  .kx-all-arr b{color:var(--kx-accent);font-size:24px;}
  .kx-all-foot{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--kx-line);margin-top:18px;}
  .kx-all-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-all-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-all-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const PROV_X = 33, HUB_X = 70, BAND_TOP = 16, BAND_H = 68;

function SlideAlliance(props) {
  const p = { ...SlideAlliance.defaults, ...props };
  const provs = p.providers.slice(0, clamp(p.providerCount, 2, p.providers.length));
  const fi = clamp(p.focusIndex, 0, provs.length - 1);
  const total = provs.reduce((a, b) => a + b.value, 0);
  const maxV = Math.max(...provs.map((x) => x.value));
  const isFlow = p.chartType === 'flow';

  let plot;
  if (p.chartType === 'bars') {
    plot = h('div', { className: 'kx-all-bars' },
      provs.map((pv, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-all-brow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-all-bmeta' },
            h('span', null, h('span', { className: 'kx-k' }, pv.name), h('span', { className: 'kx-e' }, pv.en)),
            p.showValueLabels ? h('span', { className: 'kx-v' }, pv.value + (p.unit || '')) : null),
          h('div', { className: 'kx-all-btrack' },
            h('div', { className: 'kx-all-bfill', style: { width: (pv.value / maxV * 100) + '%', background: on ? 'var(--kx-accent)' : '#5a5a50' } }))); }));
  } else if (p.chartType === 'dots') {
    plot = h('div', { className: 'kx-all-dots' },
      provs.map((pv, i) => { const on = p.focusEnabled && i === fi;
        const d = 40 + Math.sqrt(pv.value / maxV) * 92;
        return h('div', { key: i, className: 'kx-all-drow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-all-dot', style: { width: d + 'px', height: d + 'px' } }),
          h('div', { className: 'kx-all-dnm' },
            h('span', { className: 'kx-k' }, pv.name),
            h('span', { className: 'kx-e' }, pv.en)),
          p.showValueLabels ? h('span', { className: 'kx-all-dv' }, pv.value + (p.unit || '')) : null); }));
  } else {
    // flow — Sankey-style filled ribbons from each provider to the hub
    let acc = BAND_TOP;
    const ribbons = provs.map((pv, i) => {
      const yi = (i + 0.5) / provs.length * 100;
      const si = (pv.value / total) * BAND_H;          // band slice height at hub
      const hT = acc, hB = acc + si; acc += si;
      const halfP = Math.min(si, 18) / 2;               // ribbon half-height at provider side
      const pT = yi - halfP, pB = yi + halfP;
      const on = p.focusEnabled && i === fi;
      const d = `M ${PROV_X} ${pT} C ${(PROV_X + HUB_X) / 2} ${pT}, ${(PROV_X + HUB_X) / 2} ${hT}, ${HUB_X} ${hT} `
        + `L ${HUB_X} ${hB} C ${(PROV_X + HUB_X) / 2} ${pB}, ${(PROV_X + HUB_X) / 2} ${pB}, ${PROV_X} ${pB} Z`;
      return { d, on, fill: on ? 'var(--kx-accent)' : '#55554d', op: on ? 0.85 : 0.5 };
    });
    plot = h('div', { className: 'kx-all-plot' },
      h('svg', { className: 'kx-all-svg', viewBox: '0 0 100 100', preserveAspectRatio: 'none' },
        ribbons.map((r, i) => h('path', { key: i, d: r.d, fill: r.fill, opacity: r.op }))),
      provs.map((pv, i) => { const on = p.focusEnabled && i === fi; const yi = (i + 0.5) / provs.length * 100;
        return h('div', { key: i, className: 'kx-all-prov' + (on ? ' kx-on' : ''), style: { top: yi + '%' } },
          h('span', { className: 'kx-pk' }, pv.name),
          h('span', { className: 'kx-pe' }, pv.en),
          p.showValueLabels ? h('span', { className: 'kx-pv' }, pv.value + (p.unit || '')) : null); }),
      h('div', { className: 'kx-all-hub' },
        h('span', { className: 'kx-hk' }, p.hub.name),
        h('span', { className: 'kx-he' }, p.hub.en),
        p.showHub ? h('span', { className: 'kx-hv' }, total + (p.unit || '')) : null,
        h('span', { className: 'kx-hl' }, p.hub.label)));
  }

  const loop = p.showLoop ? h('div', { className: 'kx-all-loop' },
    h('div', { className: 'kx-all-loopbadge' }, '↺ 闭环 / LOOP'),
    h('div', { className: 'kx-all-loopflow' },
      h('span', { className: 'kx-all-pill' }, p.loop.a),
      h('span', { className: 'kx-all-arr' }, p.loop.fwd, ' ', h('b', null, '▶')),
      h('span', { className: 'kx-all-pill' }, p.loop.b),
      h('span', { className: 'kx-all-arr' }, p.loop.back, ' ', h('b', null, '▶')),
      h('span', { className: 'kx-all-pill', style: { color: 'var(--kx-mute-2)' } }, p.loop.a))) : null;

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-all-pad' },
      h('div', { className: 'kx-all-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-all-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-all-sub' }, p.subhead)),
      h('div', { className: 'kx-all-body' },
        isFlow ? plot : h('div', { style: { flex: 1, minHeight: 0, display: 'flex' } }, plot),
        loop),
      h('div', { className: 'kx-all-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, provs.length + ' 家 · ' + total + (p.unit || '') + ' / ' + p.chartType.toUpperCase()))));
}

SlideAlliance.defaults = {
  eyebrowId: '54', eyebrowLabel: 'CLOUD ALLIANCES',
  title: '投资与算力消费闭环', subhead: '云厂商联盟 / CLOUD ALLIANCES', unit: '亿$',
  closing: '云资源正在成为融资交易的一部分。',
  providers: [
    { name: 'Azure', en: 'MICROSOFT', value: 88 },
    { name: 'AWS', en: 'AMAZON', value: 74 },
    { name: 'Google Cloud', en: 'ALPHABET', value: 69 },
    { name: 'Oracle Cloud', en: 'ORACLE', value: 21 },
  ],
  hub: { name: 'AI 模型公司', en: 'AI MODEL CO.', label: '算力消费需求 / COMPUTE DEMAND' },
  loop: { a: '云厂商', fwd: '资本投资 INVEST', b: 'AI 公司', back: '算力消费 CONSUME' },
  chartType: 'flow', providerCount: 4, showLoop: true, showValueLabels: true, showHub: true,
  focusEnabled: true, focusIndex: 0, accent: '#c8f135',
};

SlideAlliance.controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'flow',
    options: [['flow', '关系流'], ['bars', '条形'], ['dots', '点阵']], desc: '云厂商联盟的可视化形式' },
  { key: 'providerCount', label: '云厂商数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的云厂商节点数量' },
  { key: 'showLoop', label: '闭环条', type: 'toggle', default: true, desc: '显示/隐藏底部投资—消费闭环条（装饰）' },
  { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各云厂商金额标签（装饰数据）' },
  { key: 'showHub', label: '汇聚总额', type: 'toggle', default: true, desc: '显示/隐藏汇聚节点总额（装饰，仅关系流）', showIf: (p) => p.chartType === 'flow' },
  { key: 'focusEnabled', label: '重点云厂商高亮', type: 'toggle', default: true, desc: '是否突出某一云厂商流' },
  { key: 'focusIndex', label: '高亮第几家', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的云厂商序号', showIf: (p) => p.focusEnabled },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideAlliance;
