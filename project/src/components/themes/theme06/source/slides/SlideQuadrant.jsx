// ============================================================================
// SlideQuadrant.jsx — P09 资本热度 × 商业兑现 / 2×2 Matrix
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   axisX ({label,low,high})   content — horizontal axis
//   axisY ({label,low,high})   content — vertical axis
//   quadrants ({name,en,examples[]}[])  content — 4 cells, order TL,TR,BL,BR
//   focusEnabled (bool)   VISUAL  emphasise one quadrant
//   focusIndex (int 0..3) VISUAL  which quadrant
//   showAxis (bool)       VISUAL  axis labels (decorative meta)
//   showDecor (bool)      VISUAL  scatter dots inside cells (decorative)
//   accent (color)        VISUAL
// ============================================================================
import React from 'react';
import { KxChip, KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-quad-css')) {
    const css = `
    .kx-qd-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-qd-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-qd-title{font-size:64px;}
    .kx-qd-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-qd-body{flex:1;min-height:0;display:grid;
      grid-template-columns:46px 1fr;grid-template-rows:1fr 46px;gap:14px;padding:30px 0 4px;}
    .kx-qd-ylab{grid-column:1;grid-row:1;display:flex;align-items:center;justify-content:center;}
    .kx-qd-ylab span{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;
      text-transform:uppercase;writing-mode:vertical-rl;transform:rotate(180deg);}
    .kx-qd-grid{grid-column:2;grid-row:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;
      gap:2px;background:var(--kx-line);border:1px solid var(--kx-line);position:relative;}
    .kx-qd-cell{background:var(--kx-ink);padding:26px 28px;display:flex;flex-direction:column;gap:10px;
      position:relative;overflow:hidden;}
    .kx-qd-tag{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    .kx-qd-nm{font-family:var(--kx-disp);font-weight:900;font-size:38px;letter-spacing:.02em;line-height:1;}
    .kx-qd-ex{display:flex;flex-wrap:wrap;gap:9px;margin-top:auto;position:relative;z-index:2;}
    .kx-qd-cell.kx-on{background:var(--kx-accent);}
    .kx-qd-cell.kx-on .kx-qd-tag{color:rgba(0,0,0,.55);}
    .kx-qd-cell.kx-on .kx-qd-nm{color:var(--kx-ink);}
    .kx-qd-scatter{position:absolute;inset:0;pointer-events:none;opacity:.5;}
    .kx-qd-scatter i{position:absolute;width:8px;height:8px;border-radius:50%;background:var(--kx-mute-2);}
    .kx-qd-cell.kx-on .kx-qd-scatter i{background:rgba(0,0,0,.35);}
    .kx-qd-xlab{grid-column:2;grid-row:2;display:flex;align-items:center;justify-content:center;}
    .kx-qd-xlab span{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;text-transform:uppercase;}
    .kx-qd-axend{position:absolute;font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.04em;}
    .kx-qd-foot{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid var(--kx-line);}
    .kx-qd-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    `;
    const s = document.createElement('style'); s.id = 'kx-quad-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  // deterministic pseudo-random scatter positions per cell
  const SCATTER = [
    [[18, 30], [42, 18], [70, 38], [55, 60], [30, 72]],
    [[25, 25], [60, 20], [80, 45], [40, 55], [68, 70]],
    [[20, 40], [48, 28], [72, 52], [35, 64], [60, 76]],
    [[30, 22], [55, 36], [78, 30], [44, 62], [66, 72]],
  ];

  function SlideQuadrant(props) {
    const p = { ...SlideQuadrant.defaults, ...props };
    const qs = p.quadrants.slice(0, 4);

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-qd-pad' },
        h('div', { className: 'kx-qd-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-qd-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-qd-sub' }, p.subhead)),

        h('div', { className: 'kx-qd-body' },
          p.showAxis ? h('div', { className: 'kx-qd-ylab' }, h('span', null, p.axisY.label + ' →')) : h('div'),
          h('div', { className: 'kx-qd-grid' },
            qs.map((q, i) => {
              const on = p.focusEnabled && i === p.focusIndex;
              return h('div', { key: i, className: 'kx-qd-cell' + (on ? ' kx-on' : '') },
                p.showDecor ? h('div', { className: 'kx-qd-scatter' },
                  SCATTER[i].map((pos, k) => h('i', { key: k, style: { left: pos[0] + '%', top: pos[1] + '%' } }))) : null,
                h('div', { className: 'kx-qd-tag', style: { position: 'relative', zIndex: 2 } }, q.en),
                h('div', { className: 'kx-qd-nm', style: { position: 'relative', zIndex: 2 } }, q.name),
                h('div', { className: 'kx-qd-ex' },
                  q.examples.map((e, k) => h(KxChip, { key: k, on: on }, e))));
            })),
          p.showAxis ? h('div', { className: 'kx-qd-xlab' }, h('span', null, p.axisX.label + ' →')) : h('div')),

        h('div', { className: 'kx-qd-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, p.axisX.low + ' ↔ ' + p.axisX.high))));
  }

  SlideQuadrant.defaults = {
    eyebrowId: '09', eyebrowLabel: 'OPPORTUNITY MAP',
    title: '资本热度 × 商业兑现', subhead: '四象限机会判断',
    closing: '资本正在从叙事驱动转向兑现驱动。',
    axisX: { label: '资本热度', low: '低热度', high: '高热度' },
    axisY: { label: '商业兑现', low: '弱兑现', high: '强兑现' },
    quadrants: [
      { name: '隐形价值', en: 'HIDDEN VALUE', examples: ['垂直应用', '企业搜索'] },
      { name: '明星兑现', en: 'STAR DELIVERY', examples: ['基础设施', '数据平台'] },
      { name: '等待验证', en: 'TO BE PROVEN', examples: ['长尾工具', '安全', '早期硬件'] },
      { name: '叙事泡沫', en: 'NARRATIVE BUBBLE', examples: ['通用模型', 'AGI 实验室'] },
    ],
    focusEnabled: true, focusIndex: 1, showAxis: true, showDecor: true, accent: '#c8f135',
  };

  SlideQuadrant.controls = [
    { key: 'focusEnabled', label: '重点象限高亮', type: 'toggle', default: true, desc: '是否突出某一象限' },
    { key: 'focusIndex', label: '高亮第几象限', type: 'number', default: 1, min: 0, max: 3, desc: '被突出的象限序号（左上→右上→左下→右下）', showIf: (p) => p.focusEnabled },
    { key: 'showAxis', label: '坐标轴标签', type: 'toggle', default: true, desc: '显示/隐藏坐标轴标签（装饰）' },
    { key: 'showDecor', label: '散点装饰', type: 'toggle', default: true, desc: '显示/隐藏象限内的散点装饰' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideQuadrant;
