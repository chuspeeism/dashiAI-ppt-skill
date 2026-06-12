// ============================================================================
// SlideCoverC.jsx — 封面C · 精益智造 / Lean-manufacturing cover (variant c5)
// Independent, props-driven page module. Depends only on covertheme.jsx.
//
// PROPS
//   content (static defaults):
//     kicker (string)
//     titleLine1, titleLine2Pre, titleLine2Em (string)
//     lede (string[])                       headline support, one entry per line
//     footV, footText, footEn (string)      bottom brand strip
//     steps ({si,st,sen}[])                 right-rail step list
//   visual (Tweakable via .controls):
//     accent (color)    — overrides --cv-lime
//     activeStep (int)  — which step row is highlighted (0-based)
// ============================================================================
import React from 'react';
import { cvInject } from './covertheme.jsx';

cvInject('cv-c-css', `
  .cv.c5{display:grid;grid-template-columns:1fr 0.9fr;}
  .cv.c5 .left{padding:90px;display:flex;flex-direction:column;justify-content:space-between;}
  .cv.c5 h1{font-size:120px;line-height:1.0;margin-top:50px;}
  .cv.c5 h1 em{font-style:normal;color:var(--cv-lime);}
  .cv.c5 .lede{max-width:480px;font-size:23px;line-height:1.55;color:var(--cv-muted);margin-top:32px;}
  .cv.c5 .right{background:var(--cv-bg-soft);padding:70px;display:flex;flex-direction:column;justify-content:center;gap:18px;position:relative;}
  .cv.c5 .right::before{content:"";position:absolute;left:-160px;top:50%;transform:translateY(-50%);width:320px;height:320px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(210,251,48,.10),transparent 66%);pointer-events:none;}
  .cv.c5 .step{display:flex;align-items:baseline;gap:26px;border:1px solid var(--cv-line);border-radius:20px;padding:30px 34px;background:rgba(255,255,255,.02);}
  .cv.c5 .step .si{font-family:var(--cv-en);font-weight:700;font-size:26px;color:var(--cv-muted-2);width:46px;flex:none;}
  .cv.c5 .step .st{font-size:36px;font-weight:900;letter-spacing:.04em;white-space:nowrap;flex:none;}
  .cv.c5 .step .sen{margin-left:auto;font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.16em;font-size:14px;color:var(--cv-muted);}
  .cv.c5 .step.on{background:var(--cv-lime);border-color:var(--cv-lime);color:#0a0a0a;}
  .cv.c5 .step.on .si{color:rgba(10,10,10,.45);}
  .cv.c5 .step.on .sen{color:rgba(10,10,10,.62);}
`);

const h = React.createElement;
const br = (lines) => lines.flatMap((l, i) => i === 0 ? [l] : [h('br', { key: 'b' + i }), l]);

function SlideCoverC(props) {
  const p = { ...SlideCoverC.defaults, ...props };
  return h('div', { className: 'cv c5', style: { '--cv-lime': p.accent } },
    h('div', { className: 'left' },
      h('div', null,
        h('div', { className: 'kicker anim' }, h('span', { className: 'dot' }), p.kicker),
        h('h1', { className: 'anim d1' },
          p.titleLine1, h('br'), p.titleLine2Pre, h('em', null, p.titleLine2Em)),
        h('p', { className: 'lede anim d2' }, br(p.lede))),
      h('div', { className: 'brand-foot anim d3' },
        h('span', { className: 'v' }, p.footV), h('span', null, p.footText), h('span', null, p.footEn))),
    h('div', { className: 'right' },
      p.steps.map((s, i) =>
        h('div', { key: i, className: 'step anim d' + (i + 1) + (i === p.activeStep ? ' on' : '') },
          h('span', { className: 'si' }, s.si),
          h('span', { className: 'st' }, s.st),
          h('span', { className: 'sen' }, s.sen)))));
}

SlideCoverC.defaults = {
  kicker: '05 · LEAN MANUFACTURING',
  titleLine1: '精益智造', titleLine2Pre: '提质', titleLine2Em: '增效',
  lede: ['2026 生产基地智能化改造实施方案。', '以数字化重构制造流程，让每一道工序更轻。'],
  footV: '智造', footText: '生产基地智能化改造 · 实施方案', footEn: 'PLAN / 2026',
  steps: [
    { si: '01', st: '降本', sen: 'Cost Down' },
    { si: '02', st: '提效', sen: 'Efficiency' },
    { si: '03', st: '革新', sen: 'Innovation' },
    { si: '04', st: '突围', sen: 'Breakthrough' },
  ],
  accent: '#d2fb30', activeStep: 2,
};

SlideCoverC.controls = [
  { key: 'activeStep', label: '高亮第几步', type: 'number', default: 2, min: 0, max: 3, desc: '被高亮的步骤行序号（从 0 开始）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#d2fb30',
    options: ['#d2fb30', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色（影响荧光绿元素）' },
];

export default SlideCoverC;
