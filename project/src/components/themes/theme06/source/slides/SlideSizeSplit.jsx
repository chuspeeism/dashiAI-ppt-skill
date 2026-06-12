// ============================================================================
// SlideSizeSplit.jsx — P23 金额区间结构 / Dual-Dimension Size Split
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "two metrics that don't track each other" chart. Each tier carries
// a COUNT and an AMOUNT; the layout makes their divergence the whole point —
// low tiers own the count, the top tier owns the amount. chartType switches
// between a diverging butterfly, grouped paired bars, or two 100% stacked bars.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   leftLabel,rightLabel,unitLeft,unitRight        content — axis captions / units
//   tiers ({range,en,count,amount}[])              content — size tiers (low→high)
//   chartType (enum)        VISUAL  'diverging' | 'grouped' | 'stacked'
//   tierCount (int 2..4)    VISUAL  tiers shown
//   focusEnabled (bool)     VISUAL  emphasise one tier
//   focusIndex (int)        VISUAL  which tier (default = top/mega tier)
//   showValueLabels (bool)  VISUAL  per-tier count / amount labels (decorative)
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-sps-css')) {
    const css = `
    .kx-sps-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-sps-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-sps-title{font-size:68px;}
    .kx-sps-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-sps-axis{display:flex;justify-content:space-between;font-family:var(--kx-mono);font-size:23px;
      color:var(--kx-mute-2);letter-spacing:.04em;text-transform:uppercase;padding:18px 0 6px;}
    .kx-sps-axis .kx-amt{color:var(--kx-accent);}
    .kx-sps-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:6px 0;}
    /* diverging (butterfly) */
    .kx-sps-div{display:flex;flex-direction:column;gap:26px;}
    .kx-sps-drow{display:grid;grid-template-columns:1fr 168px 1fr;align-items:center;column-gap:24px;}
    .kx-sps-dleft{display:flex;justify-content:flex-end;align-items:center;gap:18px;}
    .kx-sps-dright{display:flex;justify-content:flex-start;align-items:center;gap:18px;}
    .kx-sps-cbar{height:42px;background:#4a4a44;border-radius:4px 0 0 4px;}
    .kx-sps-abar{height:42px;background:var(--kx-accent);opacity:.55;border-radius:0 4px 4px 0;}
    .kx-sps-drow.kx-on .kx-sps-cbar{background:#6f6f66;}
    .kx-sps-drow.kx-on .kx-sps-abar{opacity:1;}
    .kx-sps-dval{font-family:var(--kx-disp);font-weight:800;font-size:30px;letter-spacing:-.01em;white-space:nowrap;}
    .kx-sps-dval.kx-amt{color:var(--kx-accent);}
    .kx-sps-tier{text-align:center;}
    .kx-sps-tier .kx-tr{font-family:var(--kx-disp);font-weight:900;font-size:32px;line-height:1;}
    .kx-sps-tier .kx-te{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:5px;}
    .kx-sps-drow.kx-on .kx-sps-tier .kx-tr{color:var(--kx-accent);}
    /* grouped */
    .kx-sps-grp{display:grid;gap:30px;align-items:end;height:100%;}
    .kx-sps-gcol{display:flex;flex-direction:column;justify-content:flex-end;height:100%;gap:14px;}
    .kx-sps-gbars{display:flex;align-items:flex-end;gap:14px;height:100%;}
    .kx-sps-gb{flex:1;border-radius:4px 4px 0 0;position:relative;min-height:6px;}
    .kx-sps-gb.kx-c{background:#4a4a44;}
    .kx-sps-gb.kx-a{background:var(--kx-accent);opacity:.55;}
    .kx-sps-gcol.kx-on .kx-sps-gb.kx-a{opacity:1;}
    .kx-sps-gcol.kx-on .kx-sps-gb.kx-c{background:#6f6f66;}
    .kx-sps-gbv{position:absolute;top:-32px;left:50%;transform:translateX(-50%);font-family:var(--kx-mono);
      font-size:21px;font-weight:700;color:var(--kx-cream);white-space:nowrap;}
    .kx-sps-glabel{text-align:center;border-top:1px solid var(--kx-line);padding-top:12px;}
    .kx-sps-glabel .kx-tr{font-family:var(--kx-disp);font-weight:900;font-size:30px;}
    .kx-sps-glabel .kx-te{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:4px;}
    .kx-sps-gcol.kx-on .kx-sps-glabel .kx-tr{color:var(--kx-accent);}
    /* stacked (two 100% bars) */
    .kx-sps-stk{display:flex;flex-direction:column;gap:40px;}
    .kx-sps-srow .kx-sl{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
      text-transform:uppercase;margin-bottom:14px;display:flex;justify-content:space-between;}
    .kx-sps-sbar{display:flex;height:88px;width:100%;border:1px solid var(--kx-line);overflow:hidden;}
    .kx-sps-sseg{position:relative;display:flex;align-items:center;justify-content:center;border-right:2px solid var(--kx-ink);}
    .kx-sps-sseg:last-child{border-right:none;}
    .kx-sps-sseg .kx-sv{font-family:var(--kx-disp);font-weight:800;font-size:26px;color:var(--kx-cream);}
    .kx-sps-sseg.kx-lite .kx-sv{color:var(--kx-ink);}
    .kx-sps-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-sps-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-sps-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-sps-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  // per-tier shade for the stacked variant (low→high; top tier = accent)
  const SHADE = ['#3a3a36', '#55554e', '#7a7a70', 'var(--kx-accent)'];

  function SlideSizeSplit(props) {
    const p = { ...SlideSizeSplit.defaults, ...props };
    const tiers = p.tiers.slice(0, Math.max(2, Math.min(p.tierCount, p.tiers.length)));
    const fi = Math.min(p.focusIndex, tiers.length - 1);
    const maxC = Math.max(...tiers.map((t) => t.count));
    const maxA = Math.max(...tiers.map((t) => t.amount));
    const totC = tiers.reduce((s, t) => s + t.count, 0);
    const totA = tiers.reduce((s, t) => s + t.amount, 0);

    let body, meta;
    if (p.chartType === 'grouped') {
      meta = 'GROUPED';
      body = h('div', { className: 'kx-sps-grp', style: { gridTemplateColumns: `repeat(${tiers.length},1fr)` } },
        tiers.map((t, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-sps-gcol' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-sps-gbars' },
              h('div', { className: 'kx-sps-gb kx-c', style: { height: Math.max(6, t.count / maxC * 100) + '%' } },
                p.showValueLabels ? h('span', { className: 'kx-sps-gbv' }, t.count + p.unitLeft) : null),
              h('div', { className: 'kx-sps-gb kx-a', style: { height: Math.max(6, t.amount / maxA * 100) + '%' } },
                p.showValueLabels ? h('span', { className: 'kx-sps-gbv', style: { color: 'var(--kx-accent)' } }, t.amount + p.unitRight) : null)),
            h('div', { className: 'kx-sps-glabel' },
              h('div', { className: 'kx-tr' }, t.range),
              h('div', { className: 'kx-te' }, t.en)));
        }));
    } else if (p.chartType === 'stacked') {
      meta = 'STACKED';
      const seg = (t, i, val, tot, lite) => h('div', { key: i,
        className: 'kx-sps-sseg' + (lite ? ' kx-lite' : ''),
        style: { width: (val / tot * 100) + '%', background: SHADE[Math.min(i, SHADE.length - 1)] } },
        p.showValueLabels && val / tot > 0.06 ? h('span', { className: 'kx-sv' }, Math.round(val / tot * 100) + '%') : null);
      body = h('div', { className: 'kx-sps-stk' },
        h('div', { className: 'kx-sps-srow' },
          h('div', { className: 'kx-sl' }, h('span', null, p.leftLabel + ' / COUNT'), h('span', null, totC + p.unitLeft)),
          h('div', { className: 'kx-sps-sbar' }, tiers.map((t, i) => seg(t, i, t.count, totC, i === tiers.length - 1)))),
        h('div', { className: 'kx-sps-srow' },
          h('div', { className: 'kx-sl' }, h('span', null, p.rightLabel + ' / AMOUNT'), h('span', null, totA + p.unitRight)),
          h('div', { className: 'kx-sps-sbar' }, tiers.map((t, i) => seg(t, i, t.amount, totA, i === tiers.length - 1)))));
    } else {
      meta = 'DIVERGING';
      body = h('div', { className: 'kx-sps-div' },
        tiers.map((t, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-sps-drow' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-sps-dleft' },
              p.showValueLabels ? h('span', { className: 'kx-sps-dval' }, t.count + p.unitLeft) : null,
              h('div', { className: 'kx-sps-cbar', style: { width: Math.max(8, t.count / maxC * 100) + '%' } })),
            h('div', { className: 'kx-sps-tier' },
              h('div', { className: 'kx-tr' }, t.range),
              h('div', { className: 'kx-te' }, t.en)),
            h('div', { className: 'kx-sps-dright' },
              h('div', { className: 'kx-sps-abar', style: { width: Math.max(8, t.amount / maxA * 100) + '%' } }),
              p.showValueLabels ? h('span', { className: 'kx-sps-dval kx-amt' }, t.amount + p.unitRight) : null));
        }));
    }

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-sps-pad' },
        h('div', { className: 'kx-sps-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-sps-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-sps-sub' }, p.subhead)),
        p.chartType === 'diverging' ? h('div', { className: 'kx-sps-axis' },
          h('span', null, '◄ ' + p.leftLabel + ' / COUNT'),
          h('span', { className: 'kx-amt' }, p.rightLabel + ' / AMOUNT ►')) : null,
        h('div', { className: 'kx-sps-body' }, body),
        h('div', { className: 'kx-sps-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, totC + p.unitLeft + ' · ' + totA + p.unitRight + ' / ' + meta))));
  }

  SlideSizeSplit.defaults = {
    eyebrowId: '23', eyebrowLabel: 'DEAL SIZE SPLIT',
    title: '金额区间结构', subhead: '交易规模分布 / SIZE DISTRIBUTION',
    closing: '市场被少数超级交易重新定价。',
    leftLabel: '笔数', rightLabel: '金额', unitLeft: ' 笔', unitRight: ' 亿',
    tiers: [
      { range: '1–2亿', en: '1–2B USD', count: 41, amount: 58 },
      { range: '2–5亿', en: '2–5B USD', count: 29, amount: 91 },
      { range: '5–10亿', en: '5–10B USD', count: 15, amount: 103 },
      { range: '10亿+', en: '10B+ MEGA', count: 12, amount: 718 },
    ],
    chartType: 'diverging', tierCount: 4, focusEnabled: true, focusIndex: 3,
    showValueLabels: true, accent: '#c8f135',
  };

  SlideSizeSplit.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'diverging',
      options: [['diverging', '双向对比'], ['grouped', '分组柱'], ['stacked', '百分比堆叠']], desc: '数量×金额双维度的可视化形式' },
    { key: 'tierCount', label: '区间数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的金额区间层数' },
    { key: 'focusEnabled', label: '重点区间高亮', type: 'toggle', default: true, desc: '是否突出某一金额区间' },
    { key: 'focusIndex', label: '高亮第几层', type: 'number', default: 3, min: 0, max: 3, desc: '被突出的区间序号（默认巨额交易层）', showIf: (p) => p.focusEnabled && p.chartType !== 'stacked' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏笔数与金额标签（装饰数据）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideSizeSplit;
