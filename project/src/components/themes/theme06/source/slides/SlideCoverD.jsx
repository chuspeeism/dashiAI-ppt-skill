// ============================================================================
// SlideCoverD.jsx — 封面D · 品牌整合营销 / Brand-marketing cover (variant c6)
// Independent, props-driven page module. Depends only on covertheme.jsx.
//
// PROPS
//   content (static defaults):
//     kicker, docId, watermark (string)
//     formal (string)
//     titleLine1, titleLine2Pre, titleLine2Em, titleLine2Suf (string)
//     tags ({t,solid}[])    pill row under the headline
//   visual (Tweakable via .controls):
//     accent (color)      — overrides --cv-lime
//     showWatermark (bool)— show/hide the giant ghosted year wordmark
//     showGlow (bool)     — show/hide the bottom-left accent glow
// ============================================================================
import React from 'react';
import { cvInject } from './covertheme.jsx';

cvInject('cv-d-css', `
  .cv.c6{padding:84px 90px 76px;display:flex;flex-direction:column;justify-content:flex-end;}
  .cv.c6 .top{position:absolute;top:84px;left:90px;right:90px;display:flex;justify-content:space-between;align-items:flex-start;z-index:2;}
  .cv.c6 .wm{font-family:var(--cv-en);font-weight:700;font-size:210px;line-height:.8;color:rgba(255,255,255,.045);letter-spacing:.02em;position:absolute;right:70px;top:200px;pointer-events:none;}
  .cv.c6 .glow{position:absolute;left:-180px;bottom:-220px;width:680px;height:680px;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(210,251,48,.15),transparent 64%);pointer-events:none;}
  .cv.c6 .formal{font-size:25px;color:var(--cv-muted);max-width:760px;line-height:1.5;margin-bottom:30px;}
  .cv.c6 h1{font-size:150px;line-height:.98;}
  .cv.c6 h1 em{font-style:normal;color:var(--cv-lime);}
  .cv.c6 .meta{display:flex;align-items:center;gap:14px;margin-top:38px;}
  .cv.c6 .disc{position:absolute;right:90px;bottom:120px;width:132px;height:132px;border-radius:50%;background:var(--cv-lime);color:#0a0a0a;display:grid;place-items:center;font-size:52px;z-index:2;}
`);

const h = React.createElement;

function SlideCoverD(props) {
  const p = { ...SlideCoverD.defaults, ...props };
  return h('div', { className: 'cv c6', style: { '--cv-lime': p.accent } },
    p.showGlow ? h('div', { className: 'glow' }) : null,
    p.showWatermark ? h('div', { className: 'wm' }, p.watermark) : null,
    h('div', { className: 'top' },
      h('div', { className: 'kicker anim' }, h('span', { className: 'dot' }), p.kicker),
      h('div', { className: 'mono anim d1' }, p.docId)),
    h('div', null,
      h('p', { className: 'formal anim d1' }, p.formal),
      h('h1', { className: 'anim d2' },
        p.titleLine1, h('br'), p.titleLine2Pre, h('em', null, p.titleLine2Em), p.titleLine2Suf),
      h('div', { className: 'meta anim d3' },
        p.tags.map((t, i) =>
          h('span', { key: i, className: 'tag' + (t.solid ? ' solid' : '') }, t.t)))),
    h('div', { className: 'disc anim d2' }, '↗'));
}

SlideCoverD.defaults = {
  kicker: '06 · BRAND MARKETING',
  docId: 'FY2026 / FULL-FUNNEL',
  watermark: '2026',
  formal: '2026 年度全平台品牌整合营销方案 · 覆盖内容、投放、私域与活动的全链路打法。',
  titleLine1: '内容驱动传播', titleLine2Pre: '创意', titleLine2Em: '引爆', titleLine2Suf: '市场',
  tags: [
    { t: '全平台整合' },
    { t: '内容驱动' },
    { t: '创意引爆', solid: true },
  ],
  accent: '#d2fb30', showWatermark: true, showGlow: true,
};

SlideCoverD.controls = [
  { key: 'showWatermark', label: '背景大字', type: 'toggle', default: true, desc: '显示/隐藏右侧巨型年份水印字' },
  { key: 'showGlow', label: '底部光晕', type: 'toggle', default: true, desc: '显示/隐藏左下角强调色光晕' },
  { key: 'accent', label: '强调色', type: 'color', default: '#d2fb30',
    options: ['#d2fb30', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色（影响荧光绿元素）' },
];

export default SlideCoverD;
