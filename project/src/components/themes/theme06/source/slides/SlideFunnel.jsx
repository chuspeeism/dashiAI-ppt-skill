// ============================================================================
// SlideFunnel.jsx — P45 增长效率工具 / Growth Funnel
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "stages that narrow" chart. N tiers are drawn as a continuous SVG
// funnel whose band width encodes each tier's value (authored descending); an
// optional stage-to-stage conversion rate reads the drop-off. A hero figure +
// metrics anchor the left. chartType switches funnel / horizontal bars /
// numbered steps on the same data (data viz, not art).
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit
//   hero ({value,unit,label})        headline funding figure
//   metrics ({k,v}[])                supporting metric cards
//   tiers ({name,en,value,unit}[])   funnel tiers (descending by value)
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'funnel' | 'bars' | 'steps'
//   tierCount (int 3..5)    tiers shown
//   metricCount (int 1..3)  supporting metric cards
//   showRate (bool)         stage-to-stage conversion % (decorative data)
//   showValueLabels (bool)  per-tier value labels (decorative data)
//   focusEnabled (bool)     emphasise one tier
//   focusIndex (int)        which tier
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-fnl-css')) {
    const css = `
    .kx-fnl-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-fnl-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-fnl-title{font-size:68px;}
    .kx-fnl-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-fnl-main{flex:1;min-height:0;display:grid;grid-template-columns:0.82fr 1.18fr;column-gap:60px;padding:28px 0 6px;}
    /* left: hero + metrics */
    .kx-fnl-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
    .kx-fnl-hero{margin-top:6px;}
    .kx-fnl-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.84;white-space:nowrap;}
    .kx-fnl-hv .kx-n{font-size:184px;color:var(--kx-accent);}
    .kx-fnl-hv .kx-u{font-size:52px;color:var(--kx-mute);white-space:nowrap;}
    .kx-fnl-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:14px;}
    .kx-fnl-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
    .kx-fnl-mcard{padding:20px 22px 14px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
    .kx-fnl-mcard:last-child{border-right:none;}
    .kx-fnl-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:.9;letter-spacing:-.02em;}
    .kx-fnl-mcard .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* right: funnel plot */
    .kx-fnl-plot{position:relative;min-height:0;display:flex;flex-direction:column;}
    .kx-fnl-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;padding-bottom:14px;}
    .kx-fnl-svg{flex:1;min-height:0;width:100%;height:100%;overflow:visible;}
    /* bars / steps fallback */
    .kx-fnl-rows{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:22px;}
    .kx-fnl-brow{display:flex;flex-direction:column;gap:11px;}
    .kx-fnl-bmeta{display:flex;justify-content:space-between;align-items:baseline;gap:18px;}
    .kx-fnl-bmeta .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:38px;letter-spacing:-.01em;}
    .kx-fnl-bmeta .kx-e{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;margin-left:14px;}
    .kx-fnl-bmeta .kx-v{font-family:var(--kx-disp);font-weight:800;font-size:44px;letter-spacing:-.02em;}
    .kx-fnl-brow.kx-on .kx-k,.kx-fnl-brow.kx-on .kx-v{color:var(--kx-accent);}
    .kx-fnl-btrack{height:22px;background:#26261f;}
    .kx-fnl-bfill{height:100%;background:#3a3a32;}
    .kx-fnl-brow.kx-on .kx-bfill{background:var(--kx-accent);}
    .kx-fnl-srow{display:grid;grid-template-columns:84px 1fr auto;align-items:center;gap:22px;
      border-top:1px solid var(--kx-line);padding:20px 0;}
    .kx-fnl-srow:last-child{border-bottom:1px solid var(--kx-line);}
    .kx-fnl-sidx{font-family:var(--kx-disp);font-weight:900;font-size:54px;color:var(--kx-mute-2);line-height:1;}
    .kx-fnl-srow.kx-on .kx-fnl-sidx{color:var(--kx-accent);}
    .kx-fnl-snm{font-family:var(--kx-disp);font-weight:800;font-size:40px;letter-spacing:-.01em;}
    .kx-fnl-sen{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-fnl-sv{font-family:var(--kx-disp);font-weight:800;font-size:46px;letter-spacing:-.02em;}
    .kx-fnl-srow.kx-on .kx-fnl-snm,.kx-fnl-srow.kx-on .kx-fnl-sv{color:var(--kx-accent);}
    .kx-fnl-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-fnl-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-fnl-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-fnl-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const GREY = ['#54544b', '#4a4a42', '#404038', '#37372f', '#2e2e27'];
  const W = 920, H = 560, CXF = 460, PADT = 16, PADB = 16, GAP = 9, MINW = 150, MAXW = 880;

  function SlideFunnel(props) {
    const p = { ...SlideFunnel.defaults, ...props };
    const tiers = p.tiers.slice(0, clamp(p.tierCount, 3, p.tiers.length));
    const fi = clamp(p.focusIndex, 0, tiers.length - 1);
    const metrics = p.metrics.slice(0, clamp(p.metricCount, 1, p.metrics.length));
    const maxV = Math.max(...tiers.map((t) => t.value));
    const N = tiers.length;
    const wOf = (v) => MINW + (v / maxV) * (MAXW - MINW);
    const tierH = (H - PADT - PADB - GAP * (N - 1)) / N;

    const funnel = h('svg', { className: 'kx-fnl-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' },
      tiers.map((t, i) => {
        const yTop = PADT + i * (tierH + GAP), yBot = yTop + tierH;
        const wTop = wOf(t.value);
        const wBot = i < N - 1 ? wOf(tiers[i + 1].value) : Math.max(90, wTop * 0.62);
        const on = p.focusEnabled && i === fi;
        const pts = `${CXF - wTop / 2},${yTop} ${CXF + wTop / 2},${yTop} ${CXF + wBot / 2},${yBot} ${CXF - wBot / 2},${yBot}`;
        const yMid = yTop + tierH / 2;
        const rate = i > 0 ? Math.round((t.value / tiers[i - 1].value) * 100) : null;
        return h('g', { key: i },
          h('polygon', { points: pts, fill: on ? 'var(--kx-accent)' : GREY[i % GREY.length] }),
          h('text', { x: CXF, y: yMid - 4, textAnchor: 'middle', fontFamily: "Archivo, 'Noto Sans SC', sans-serif",
            fontWeight: 800, fontSize: 36, fill: on ? 'var(--kx-ink)' : 'var(--kx-cream)' }, t.name),
          p.showValueLabels ? h('text', { x: CXF, y: yMid + 34, textAnchor: 'middle', fontFamily: "Archivo, 'Noto Sans SC', sans-serif",
            fontWeight: 800, fontSize: 30, fill: on ? 'var(--kx-ink)' : 'var(--kx-mute)' }, t.value + (t.unit || '')) : null,
          (p.showRate && rate != null) ? h('text', { x: CXF + wTop / 2 + 30, y: yTop + 6, textAnchor: 'start',
            fontFamily: 'Space Mono, monospace', fontSize: 24, fill: 'var(--kx-mute-2)' }, '▸ ' + rate + '%') : null);
      }));

    const bars = h('div', { className: 'kx-fnl-rows' },
      tiers.map((t, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-fnl-brow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-fnl-bmeta' },
            h('span', null, h('span', { className: 'kx-k' }, t.name), h('span', { className: 'kx-e' }, t.en)),
            p.showValueLabels ? h('span', { className: 'kx-v' }, t.value + (t.unit || '')) : null),
          h('div', { className: 'kx-fnl-btrack' },
            h('div', { className: 'kx-fnl-bfill kx-bfill', style: { width: ((t.value / maxV) * 100) + '%', background: on ? 'var(--kx-accent)' : '#3a3a32' } }))); }));

    const steps = h('div', { className: 'kx-fnl-rows', style: { gap: 0, justifyContent: 'center' } },
      tiers.map((t, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-fnl-srow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-fnl-sidx' }, String(i + 1).padStart(2, '0')),
          h('div', null, h('div', { className: 'kx-fnl-snm' }, t.name), h('div', { className: 'kx-fnl-sen' }, t.en)),
          p.showValueLabels ? h('div', { className: 'kx-fnl-sv' }, t.value + (t.unit || '')) : null); }));

    const plot = p.chartType === 'bars' ? bars : p.chartType === 'steps' ? steps : funnel;

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-fnl-pad' },
        h('div', { className: 'kx-fnl-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-fnl-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-fnl-sub' }, p.subhead)),
        h('div', { className: 'kx-fnl-main' },
          h('div', { className: 'kx-fnl-left' },
            h('div', { className: 'kx-fnl-hero' },
              h('div', { className: 'kx-fnl-hv' },
                h('span', { className: 'kx-n' }, p.hero.value),
                p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
              h('div', { className: 'kx-fnl-hl' }, p.hero.label)),
            h('div', { className: 'kx-fnl-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
              metrics.map((m, i) => h('div', { key: i, className: 'kx-fnl-mcard' },
                h('span', { className: 'kx-mv' }, m.v),
                h('span', { className: 'kx-mk' }, m.k))))),
          h('div', { className: 'kx-fnl-plot' },
            h('div', { className: 'kx-fnl-cap' }, '增长漏斗 / GROWTH FUNNEL'), plot)),
        h('div', { className: 'kx-fnl-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, tiers.length + ' 层 / ' + p.chartType.toUpperCase()))));
  }

  SlideFunnel.defaults = {
    eyebrowId: '45', eyebrowLabel: 'SALES & MARKETING AI',
    title: '增长效率工具', subhead: '销售与营销 AI / GROWTH TOOLS', unit: ' 亿',
    closing: '营销 AI 要用转化率证明自己。',
    hero: { value: '24', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '10 笔' },
      { k: '平均单笔 / AVG', v: '2.4 亿' },
    ],
    tiers: [
      { name: '广告创意', en: 'AD CREATIVE', value: 8, unit: ' 亿' },
      { name: '线索评分', en: 'LEAD SCORING', value: 7, unit: ' 亿' },
      { name: '自动外呼', en: 'AUTO OUTREACH', value: 6, unit: ' 亿' },
      { name: '邮件触达', en: 'EMAIL OUTREACH', value: 4, unit: ' 亿' },
    ],
    chartType: 'funnel', tierCount: 4, metricCount: 2, showRate: true, showValueLabels: true,
    focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlideFunnel.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'funnel',
      options: [['funnel', '漏斗'], ['bars', '条形'], ['steps', '步骤']], desc: '增长场景的可视化形式' },
    { key: 'tierCount', label: '层级数量', type: 'number', default: 4, min: 3, max: 5, desc: '漏斗层级数量' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 1, max: 3, desc: '左侧辅助指标数量' },
    { key: 'showRate', label: '转化率', type: 'toggle', default: true, desc: '显示/隐藏层级间转化率（装饰数据，仅漏斗）', showIf: (p) => p.chartType === 'funnel' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏各层数值标签（装饰数据）' },
    { key: 'focusEnabled', label: '重点层级高亮', type: 'toggle', default: true, desc: '是否突出某一层级' },
    { key: 'focusIndex', label: '高亮第几层', type: 'number', default: 0, min: 0, max: 4, desc: '被突出的层级序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideFunnel;
