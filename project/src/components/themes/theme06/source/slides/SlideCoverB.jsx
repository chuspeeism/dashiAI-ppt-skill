// ============================================================================
// SlideCoverB.jsx — 封面B · 新机遇 / Business-plan cover (variant c3)
// Independent, props-driven page module. Depends only on covertheme.jsx.
//
// PROPS
//   content (static defaults):
//     kicker, docId (string)
//     titleLine1 (string), titleLine2 (string — rendered in accent)
//     sub, note (string)
//     stats ({sv,sl}[])   bottom three-up strip (2nd value uses accent)
//   visual (Tweakable via .controls):
//     accent (color)  — overrides --cv-lime
//     showHaze (bool) — show/hide the top radial haze glow
// ============================================================================
import React from 'react';
import { cvInject } from './covertheme.jsx';

cvInject('cv-b-css', `
  .cv.c3{padding:72px 90px;display:flex;flex-direction:column;align-items:center;text-align:center;}
  .cv.c3 .haze{position:absolute;top:-380px;left:50%;transform:translateX(-50%);width:1500px;height:920px;border-radius:50%;background:radial-gradient(ellipse at 50% 42%,rgba(186,191,206,.26),rgba(120,120,130,.05) 46%,transparent 68%);pointer-events:none;}
  .cv.c3 .top{width:100%;display:flex;justify-content:space-between;align-items:center;position:relative;z-index:2;}
  .cv.c3 .mid{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;position:relative;z-index:2;}
  .cv.c3 h1{font-size:130px;line-height:1.04;}
  .cv.c3 .sub{font-size:24px;color:var(--cv-muted);max-width:820px;line-height:1.5;}
  .cv.c3 .note{display:inline-flex;align-items:center;gap:12px;white-space:nowrap;border:1px solid var(--cv-line);border-radius:999px;padding:12px 24px;font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.14em;font-size:15px;color:var(--cv-ink);}
  .cv.c3 .note .dot{width:8px;height:8px;border-radius:50%;background:var(--cv-lime);box-shadow:0 0 14px var(--cv-lime);}
  .cv.c3 .strip{width:100%;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--cv-line);position:relative;z-index:2;}
  .cv.c3 .stat{padding:38px 30px 6px;border-right:1px solid var(--cv-line);display:flex;flex-direction:column;gap:12px;align-items:center;}
  .cv.c3 .stat:last-child{border-right:none;}
  .cv.c3 .stat .sv{font-family:var(--cv-sans);font-weight:900;font-size:60px;line-height:1;letter-spacing:.02em;}
  .cv.c3 .stat.hot .sv{color:var(--cv-lime);}
  .cv.c3 .stat .sl{font-family:var(--cv-mono);text-transform:uppercase;letter-spacing:.18em;font-size:15px;color:var(--cv-muted);}
`);

const h = React.createElement;

function SlideCoverB(props) {
  const p = { ...SlideCoverB.defaults, ...props };
  return h('div', { className: 'cv c3', style: { '--cv-lime': p.accent } },
    p.showHaze ? h('div', { className: 'haze' }) : null,
    h('div', { className: 'top' },
      h('div', { className: 'kicker anim' }, h('span', { className: 'dot' }), p.kicker),
      h('div', { className: 'mono anim d1' }, p.docId)),
    h('div', { className: 'mid' },
      h('h1', { className: 'anim d1' }, p.titleLine1, h('br'), h('span', { className: 'lime' }, p.titleLine2)),
      h('p', { className: 'sub anim d2' }, p.sub),
      h('div', { className: 'note anim d2' }, h('span', { className: 'dot' }), p.note)),
    h('div', { className: 'strip anim d3' },
      p.stats.map((s, i) =>
        h('div', { key: i, className: 'stat' + (i === 1 ? ' hot' : '') },
          h('div', { className: 'sv' }, s.sv),
          h('div', { className: 'sl' }, s.sl)))));
}

SlideCoverB.defaults = {
  kicker: 'BUSINESS PLAN · 商业计划书',
  docId: 'CONFIDENTIAL / 03',
  titleLine1: '精准布局', titleLine2: '与时代红利同行',
  sub: 'XX 金融项目商业计划书 · 新机遇 · 新赛道 · 新价值',
  note: '面向机构投资人专属方案',
  stats: [
    { sv: '新机遇', sl: 'New Opportunity' },
    { sv: '新赛道', sl: 'New Track' },
    { sv: '新价值', sl: 'New Value' },
  ],
  accent: '#d2fb30', showHaze: true,
};

SlideCoverB.controls = [
  { key: 'showHaze', label: '顶部光晕', type: 'toggle', default: true, desc: '显示/隐藏顶部径向光晕装饰' },
  { key: 'accent', label: '强调色', type: 'color', default: '#d2fb30',
    options: ['#d2fb30', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色（影响荧光绿元素）' },
];

export default SlideCoverB;
