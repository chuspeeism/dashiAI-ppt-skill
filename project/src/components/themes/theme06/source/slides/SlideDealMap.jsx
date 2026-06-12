// ============================================================================
// SlideDealMap.jsx — P16 融资事件规模分层 / Deal Size Map
// Independent, props-driven. Depends only on kit.jsx.
//
// A "deal map": 97 mega-rounds split into size tiers. Bubble area encodes the
// per-deal size of each tier, so the eye reads "a few huge deals dominate".
// chartType switches the same data between bubble clusters / dot matrix /
// proportional bars.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   tiers ({range,en,count,amount}[])   content — size tiers (low→high)
//   chartType (enum)       VISUAL  'bubbles' | 'dots' | 'bars'
//   tierCount (int 2..4)   VISUAL  how many tiers shown
//   focusEnabled (bool)    VISUAL  emphasise one tier
//   focusIndex (int)       VISUAL  which tier (default = mega tier)
//   showValueLabels (bool) VISUAL  per-tier count / amount labels (decorative)
//   accent (color)         VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-dlm-css')) {
    const css = `
    .kx-dlm-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:32px;}
    .kx-dlm-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:26px;border-bottom:1px solid var(--kx-line);}
    .kx-dlm-title{font-size:68px;}
    .kx-dlm-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-dlm-field{flex:1;min-height:0;display:grid;gap:0;margin:18px 0 8px;}
    .kx-dlm-zone{position:relative;display:flex;flex-direction:column;border-right:1px solid var(--kx-line);
      padding:18px 26px 0;min-height:0;}
    .kx-dlm-zone:last-child{border-right:none;}
    .kx-dlm-zone.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 12%,transparent),transparent 72%);}
    .kx-dlm-zhead{display:flex;flex-direction:column;gap:5px;}
    .kx-dlm-zrange{font-family:var(--kx-disp);font-weight:900;font-size:38px;letter-spacing:.01em;line-height:1;}
    .kx-dlm-zen{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.05em;}
    .kx-dlm-zone.kx-on .kx-dlm-zrange{color:var(--kx-accent);}
    .kx-dlm-cluster{flex:1;min-height:0;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;
      gap:12px;padding:16px 0;}
    .kx-dlm-bub{border-radius:50%;background:#34342f;flex:none;}
    .kx-dlm-zone.kx-on .kx-dlm-bub{background:var(--kx-accent);}
    .kx-dlm-dot{width:14px;height:14px;border-radius:50%;background:#34342f;flex:none;}
    .kx-dlm-zone.kx-on .kx-dlm-dot{background:var(--kx-accent);}
    .kx-dlm-zfoot{font-family:var(--kx-mono);display:flex;justify-content:space-between;align-items:baseline;
      gap:14px;padding:14px 0 4px;border-top:1px solid var(--kx-line);}
    .kx-dlm-zfoot .kx-c{font-size:30px;font-weight:700;}
    .kx-dlm-zfoot .kx-a{font-size:24px;color:var(--kx-mute-2);}
    .kx-dlm-zone.kx-on .kx-dlm-zfoot .kx-c{color:var(--kx-accent);}
    /* bars variant */
    .kx-dlm-bars{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:26px;padding:10px 0;}
    .kx-dlm-brow{display:grid;grid-template-columns:230px 1fr 230px;gap:26px;align-items:center;}
    .kx-dlm-blabel{font-family:var(--kx-disp);font-weight:900;font-size:34px;}
    .kx-dlm-btrack{height:46px;background:rgba(255,255,255,.05);position:relative;overflow:hidden;}
    .kx-dlm-bfill{position:absolute;inset:0 auto 0 0;background:#34342f;display:flex;align-items:center;}
    .kx-dlm-brow.kx-on .kx-dlm-bfill{background:var(--kx-accent);}
    .kx-dlm-brow.kx-on .kx-dlm-blabel{color:var(--kx-accent);}
    .kx-dlm-bmeta{font-family:var(--kx-mono);font-size:25px;color:var(--kx-mute-2);text-align:right;letter-spacing:.02em;}
    .kx-dlm-bmeta b{color:var(--kx-cream);font-size:30px;}
    .kx-dlm-brow.kx-on .kx-dlm-bmeta b{color:var(--kx-accent);}
    .kx-dlm-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-dlm-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-dlm-foot .kx-tot{font-family:var(--kx-mono);font-size:25px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-dlm-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  // bubble diameter per tier index (area grows ≈ with per-deal size)
  const BUB = [22, 34, 50, 70];

  function SlideDealMap(props) {
    const p = { ...SlideDealMap.defaults, ...props };
    const tiers = p.tiers.slice(0, Math.max(2, Math.min(p.tierCount, p.tiers.length)));
    const fi = Math.min(p.focusIndex, tiers.length - 1);
    const totalCount = tiers.reduce((s, t) => s + t.count, 0);
    const maxAmount = Math.max(...tiers.map((t) => t.amount));

    const head = h('div', { className: 'kx-dlm-head' },
      h('div', null,
        h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
        h('h2', { className: 'kx-h2 kx-cjk kx-dlm-title', style: { marginTop: '16px' } }, p.title)),
      h('div', { className: 'kx-dlm-sub' }, p.subhead));

    const foot = h('div', { className: 'kx-dlm-foot' },
      h('div', { className: 'kx-cl' }, '→ ' + p.closing),
      h('div', { className: 'kx-tot' }, totalCount + ' 笔 / ' + tiers.length + ' TIERS'));

    let body;
    if (p.chartType === 'bars') {
      body = h('div', { className: 'kx-dlm-bars' },
        tiers.map((t, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-dlm-brow' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-dlm-blabel' }, t.range),
            h('div', { className: 'kx-dlm-btrack' },
              h('div', { className: 'kx-dlm-bfill', style: { width: Math.max(6, (t.amount / maxAmount) * 100) + '%' } })),
            h('div', { className: 'kx-dlm-bmeta' },
              h('b', null, t.amount + (p.unit || '')), p.showValueLabels ? h('div', null, t.count + ' 笔') : null));
        }));
    } else {
      const isDots = p.chartType === 'dots';
      body = h('div', { className: 'kx-dlm-field', style: { gridTemplateColumns: `repeat(${tiers.length},1fr)` } },
        tiers.map((t, i) => {
          const on = p.focusEnabled && i === fi;
          const dia = BUB[Math.min(i, BUB.length - 1)];
          return h('div', { key: i, className: 'kx-dlm-zone' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-dlm-zhead' },
              h('div', { className: 'kx-dlm-zrange' }, t.range),
              h('div', { className: 'kx-dlm-zen' }, t.en)),
            h('div', { className: 'kx-dlm-cluster' },
              Array.from({ length: t.count }, (_, k) => isDots
                ? h('span', { key: k, className: 'kx-dlm-dot' })
                : h('span', { key: k, className: 'kx-dlm-bub', style: { width: dia + 'px', height: dia + 'px' } }))),
            p.showValueLabels ? h('div', { className: 'kx-dlm-zfoot' },
              h('span', { className: 'kx-c' }, t.count + ' 笔'),
              h('span', { className: 'kx-a' }, t.amount + (p.unit || ''))) : null);
        }));
    }

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-dlm-pad' }, head, body, foot));
  }

  SlideDealMap.defaults = {
    eyebrowId: '16', eyebrowLabel: 'DEAL MAP',
    title: '融资事件规模分层', subhead: '大额融资事件地图 / 金额 $B',
    closing: '影响最大的往往是少数巨额交易。', unit: '亿',
    tiers: [
      { range: '1–2亿', en: '1–2 · 41 DEALS', count: 41, amount: 58 },
      { range: '2–5亿', en: '2–5 · 29 DEALS', count: 29, amount: 91 },
      { range: '5–10亿', en: '5–10 · 15 DEALS', count: 15, amount: 103 },
      { range: '10亿+', en: '10+ · MEGA', count: 12, amount: 718 },
    ],
    chartType: 'bubbles', tierCount: 4, focusEnabled: true, focusIndex: 3, showValueLabels: true, accent: '#c8f135',
  };

  SlideDealMap.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'bubbles',
      options: [['bubbles', '气泡'], ['dots', '点阵'], ['bars', '条形']], desc: '规模分层的可视化形式' },
    { key: 'tierCount', label: '分层数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的金额区间层数' },
    { key: 'focusEnabled', label: '重点分层高亮', type: 'toggle', default: true, desc: '是否突出某一金额区间' },
    { key: 'focusIndex', label: '高亮第几层', type: 'number', default: 3, min: 0, max: 3, desc: '被突出的区间序号（默认巨额交易层）', showIf: (p) => p.focusEnabled },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏每层的笔数与金额标签（装饰数据）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideDealMap;
