// ============================================================================
// SlideCoverA.jsx — 封面A · 智联万物 / Product-launch cover (variant c2)
// Independent, props-driven page module. Depends only on covertheme.jsx.
//
// PROPS
//   content (static defaults):
//     kicker, titleLine1, titleLine2Pre, titleLine2Em (string)
//     lede (string[])                       headline support, one entry per line
//     footV, footText, footEn (string)      bottom brand strip
//     card1Label, card1Title (string), card1Sub (string[])   glass card
//     card2Label, card2Title (string), card2Sub (string[])   lime card
//   visual (Tweakable via .controls):
//     accent (color)    — overrides the lime accent (--cv-lime)
//     showMidBtn (bool) — show/hide the round ↗ connector button
// ============================================================================
import React from 'react';
import { cvInject } from './covertheme.jsx';

cvInject('cv-a-css', `
  .cv.c2{display:grid;grid-template-columns:1fr 0.92fr;}
  .cv.c2 .left{padding:90px;display:flex;flex-direction:column;justify-content:space-between;}
  .cv.c2 h1{font-size:108px;line-height:1.02;margin-top:52px;}
  .cv.c2 h1 em{font-style:normal;color:var(--cv-lime);}
  .cv.c2 .lede{max-width:480px;font-size:23px;line-height:1.55;color:var(--cv-muted);margin-top:34px;}
  .cv.c2 .right{position:relative;background:var(--cv-bg-soft);overflow:hidden;}
  .cv.c2 .stage{position:absolute;inset:0;}
  .cv.c2 .glass{position:absolute;width:440px;border-radius:34px;padding:42px;background:linear-gradient(150deg,rgba(126,140,242,.92),rgba(150,120,224,.78));overflow:hidden;}
  .cv.c2 .glass::after{content:"";position:absolute;right:-90px;top:-90px;width:340px;height:340px;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,rgba(255,255,255,.10) 0 1px,transparent 1px 22px);opacity:.7;}
  .cv.c2 .card-lime{position:absolute;width:440px;border-radius:34px;padding:42px;background:var(--cv-lime);color:#0a0a0a;overflow:hidden;}
  .cv.c2 .card-lime::after{content:"";position:absolute;right:-60px;bottom:-90px;width:300px;height:300px;background:repeating-radial-gradient(circle at 50% 50%,rgba(10,10,10,.16) 0 1px,transparent 1px 16px);border-radius:50%;}
  .cv.c2 .card-label{font-size:24px;font-weight:500;}
  .cv.c2 .card-big{font-family:var(--cv-sans);font-weight:900;font-size:54px;margin-top:18px;letter-spacing:.01em;line-height:1;}
  .cv.c2 .card-sub{font-size:17px;margin-top:18px;line-height:1.5;opacity:.78;}
  .cv.c2 .midbtn{position:absolute;width:76px;height:76px;border-radius:50%;background:#0a0a0a;display:grid;place-items:center;font-size:30px;color:#fff;z-index:5;border:5px solid var(--cv-bg-soft);}
`);

const h = React.createElement;
const br = (lines) => lines.flatMap((l, i) => i === 0 ? [l] : [h('br', { key: 'b' + i }), l]);

function SlideCoverA(props) {
  const p = { ...SlideCoverA.defaults, ...props };
  return h('div', { className: 'cv c2', style: { '--cv-lime': p.accent } },
    h('div', { className: 'left' },
      h('div', null,
        h('div', { className: 'kicker anim' }, h('span', { className: 'dot' }), p.kicker),
        h('h1', { className: 'anim d1' },
          p.titleLine1, h('br'), p.titleLine2Pre, h('em', null, p.titleLine2Em)),
        h('p', { className: 'lede anim d2' }, br(p.lede))),
      h('div', { className: 'brand-foot anim d3' },
        h('span', { className: 'v' }, p.footV), h('span', null, p.footText), h('span', null, p.footEn))),
    h('div', { className: 'right' },
      h('div', { className: 'stage' },
        h('div', { className: 'glass anim d1', style: { left: '120px', top: '152px' } },
          h('div', { className: 'card-label', style: { color: '#fff' } }, p.card1Label),
          h('div', { className: 'card-big', style: { color: '#fff' } }, p.card1Title),
          h('div', { className: 'card-sub', style: { color: 'rgba(255,255,255,.86)' } }, br(p.card1Sub))),
        p.showMidBtn
          ? h('div', { className: 'midbtn anim d2', style: { left: '308px', top: '398px' } }, '↗')
          : null,
        h('div', { className: 'card-lime anim d2', style: { left: '120px', top: '436px' } },
          h('div', { className: 'card-label' }, p.card2Label),
          h('div', { className: 'card-big' }, p.card2Title),
          h('div', { className: 'card-sub' }, br(p.card2Sub))))));
}

SlideCoverA.defaults = {
  kicker: '01 · PRODUCT LAUNCH',
  titleLine1: '智联万物', titleLine2Pre: '重构', titleLine2Em: '体验',
  lede: ['2026 全新产品体系发布暨技术路演。', '以技术突破，定义下一代数字生活。'],
  footV: '智联', footText: '全新产品体系发布 · 技术路演', footEn: 'IoT × EXPERIENCE',
  card1Label: '万物互联 · IoT', card1Title: '全域智联',
  card1Sub: ['设备 · 数据 · 服务', '一体贯通的数字底座'],
  card2Label: '技术突破 · Tech', card2Title: '体验重构',
  card2Sub: ['以技术突破，', '定义下一代数字生活'],
  accent: '#d2fb30', showMidBtn: true,
};

SlideCoverA.controls = [
  { key: 'showMidBtn', label: '连接按钮', type: 'toggle', default: true, desc: '显示/隐藏中部的圆形 ↗ 连接按钮' },
  { key: 'accent', label: '强调色', type: 'color', default: '#d2fb30',
    options: ['#d2fb30', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色（影响荧光绿元素）' },
];

export default SlideCoverA;
