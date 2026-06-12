// ============================================================================
// SlideConvert.jsx — P47 社区影响力变现 / Reach-to-Revenue Conversion
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "scale converts into value" page: a top pole (a large reach/volume
// figure) flows through a conversion-rate bridge into a bottom pole (the
// monetised figure). A funding hero + metrics anchor the left; an ADAPTIVE media
// column (mediaSlotCount 0..n) sits on the right and the grid rebalances at every
// count — 0 widens the conversion column so composition stays balanced.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   convTag                       sector badge (decorative)
//   hero ({value,unit,label})     headline funding figure
//   metrics ({k,v}[])             supporting metric cards
//   poles ({label,en,value,sub}[]) 2 poles: [reach, revenue]
//   rate ({value,label})          conversion-rate bridge (decorative data)
//   mediaPlaceholder              image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   mediaSlotCount (int 0..2) adaptive image slots (0 → conversion column widens)
//   metricCount (int 1..3)    supporting metric cards
//   focusEnabled (bool)       emphasise one pole
//   focusIndex (int 0..1)     which pole (0 reach / 1 revenue)
//   showRate (bool)           conversion-rate bridge (decorative data)
//   showBars (bool)           per-pole magnitude bars (decorative)
//   showBadge (bool)          sector badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-cvt-css')) {
    const css = `
    .kx-cvt-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-cvt-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-cvt-title{font-size:68px;}
    .kx-cvt-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-cvt-main{flex:1;min-height:0;display:grid;column-gap:56px;padding:30px 0 6px;}
    /* left: hero + metrics */
    .kx-cvt-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
    .kx-cvt-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
    .kx-cvt-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
    .kx-cvt-hero{margin-top:30px;}
    .kx-cvt-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.82;white-space:nowrap;}
    .kx-cvt-hv .kx-n{font-size:182px;color:var(--kx-accent);}
    .kx-cvt-hv .kx-u{font-size:52px;color:var(--kx-mute);white-space:nowrap;}
    .kx-cvt-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:14px;}
    .kx-cvt-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
    .kx-cvt-mcard{padding:20px 22px 14px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
    .kx-cvt-mcard:last-child{border-right:none;}
    .kx-cvt-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:.9;letter-spacing:-.02em;}
    .kx-cvt-mcard .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* middle: conversion ladder */
    .kx-cvt-ladder{display:flex;flex-direction:column;min-height:0;justify-content:center;gap:0;}
    .kx-cvt-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;padding-bottom:18px;}
    .kx-cvt-pole{border:1px solid var(--kx-line);border-left:3px solid var(--kx-mute-2);padding:22px 26px 20px;
      display:flex;flex-direction:column;gap:14px;background:rgba(255,255,255,.015);}
    .kx-cvt-pole.kx-on{border-color:var(--kx-accent);border-left-color:var(--kx-accent);
      background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 13%,transparent),transparent 85%);}
    .kx-cvt-plabel{display:flex;justify-content:space-between;align-items:baseline;gap:14px;
      font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.04em;text-transform:uppercase;}
    .kx-cvt-pv{display:flex;align-items:baseline;gap:14px;flex-wrap:nowrap;min-width:0;}
    .kx-cvt-pv .kx-n{font-family:var(--kx-disp);font-weight:800;font-size:82px;line-height:.84;letter-spacing:-.02em;white-space:nowrap;}
    .kx-cvt-pv .kx-s{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.03em;white-space:nowrap;}
    .kx-cvt-pole.kx-on .kx-pv-n{color:var(--kx-accent);}
    .kx-cvt-ptrack{height:14px;background:#26261f;}
    .kx-cvt-pfill{height:100%;background:#3a3a32;}
    .kx-cvt-pole.kx-on .kx-cvt-pfill{background:var(--kx-accent);}
    .kx-cvt-bridge{display:flex;align-items:center;gap:18px;padding:18px 8px;}
    .kx-cvt-chevs{display:flex;flex-direction:column;gap:4px;align-items:center;}
    .kx-cvt-chevs i{width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;
      border-top:10px solid var(--kx-accent);display:block;}
    .kx-cvt-ratepill{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:900;}
    .kx-cvt-ratepill .kx-rv{font-size:56px;color:var(--kx-accent);letter-spacing:-.02em;line-height:1;}
    .kx-cvt-ratepill .kx-rl{font-family:var(--kx-mono);font-weight:400;font-size:23px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    /* right: media */
    .kx-cvt-media{display:flex;flex-direction:column;gap:20px;min-height:0;justify-content:center;}
    .kx-cvt-media .kx-imgslot{flex:none;}
    .kx-cvt-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-cvt-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-cvt-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-cvt-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function SlideConvert(props) {
    const p = { ...SlideConvert.defaults, ...props };
    const metrics = p.metrics.slice(0, clamp(p.metricCount, 1, p.metrics.length));
    const slots = clamp(p.mediaSlotCount, 0, 2);
    const fi = clamp(p.focusIndex, 0, 1);
    const mainCols = slots === 0 ? '0.84fr 1.16fr' : '0.74fr 1.04fr 0.76fr';

    const pole = (pl, i, fillPct) => {
      const on = p.focusEnabled && i === fi;
      return h('div', { className: 'kx-cvt-pole' + (on ? ' kx-on' : '') },
        h('div', { className: 'kx-cvt-plabel' },
          h('span', null, pl.label),
          h('span', null, pl.en)),
        h('div', { className: 'kx-cvt-pv' },
          h('span', { className: 'kx-n kx-pv-n' }, pl.value),
          pl.sub ? h('span', { className: 'kx-s' }, pl.sub) : null),
        p.showBars ? h('div', { className: 'kx-cvt-ptrack' },
          h('div', { className: 'kx-cvt-pfill', style: { width: fillPct + '%' } })) : null);
    };

    const ladder = h('div', { className: 'kx-cvt-ladder' },
      h('div', { className: 'kx-cvt-cap' }, '影响力变现 / CONVERSION'),
      pole(p.poles[0], 0, 100),
      p.showRate ? h('div', { className: 'kx-cvt-bridge' },
        h('div', { className: 'kx-cvt-chevs' }, h('i'), h('i')),
        h('div', { className: 'kx-cvt-ratepill' },
          h('span', { className: 'kx-rv' }, p.rate.value),
          h('span', { className: 'kx-rl' }, p.rate.label))) : h('div', { style: { height: '20px' } }),
      pole(p.poles[1], 1, Math.min(100, parseFloat(p.rate.value) || 60)));

    const media = slots > 0 ? h('div', { className: 'kx-cvt-media' },
      Array.from({ length: slots }, (_, i) =>
        h(KxImageSlot, {
          key: i, id: 'convert-' + (p.eyebrowId || 'x') + '-' + i,
          placeholder: p.mediaPlaceholder || '主视觉 / DROP IMAGE',
          badge: slots === 1 ? p.convTag : ('IMG ' + String(i + 1).padStart(2, '0')),
          minRatio: slots === 1 ? 0.7 : 0.9, maxRatio: slots === 1 ? 1.3 : 1.9,
          style: { width: '100%' },
        }))) : null;

    const left = h('div', { className: 'kx-cvt-left' },
      p.showBadge ? h('div', { className: 'kx-cvt-badge' }, p.convTag) : null,
      h('div', { className: 'kx-cvt-hero', style: p.showBadge ? null : { marginTop: 0 } },
        h('div', { className: 'kx-cvt-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-cvt-hl' }, p.hero.label)),
      h('div', { className: 'kx-cvt-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
        metrics.map((m, i) => h('div', { key: i, className: 'kx-cvt-mcard' },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k)))));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-cvt-pad' },
        h('div', { className: 'kx-cvt-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-cvt-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-cvt-sub' }, p.subhead)),
        h('div', { className: 'kx-cvt-main', style: { gridTemplateColumns: mainCols } }, left, ladder, media),
        h('div', { className: 'kx-cvt-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, (slots === 0 ? 'CONVERT' : slots + ' IMG') + ' / ' + (p.rate.value || '')))));
  }

  SlideConvert.defaults = {
    eyebrowId: '47', eyebrowLabel: 'OPEN SOURCE MODELS',
    title: '社区影响力变现', subhead: '开源模型公司 / OPEN SOURCE',
    closing: '开源是入口，不是完整商业模式。',
    convTag: '开源模型赛道 / OSS',
    hero: { value: '28', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '7 笔' },
      { k: '平均单笔 / AVG', v: '4.0 亿' },
    ],
    poles: [
      { label: '社区影响力 / REACH', en: 'COMMUNITY', value: '2.8亿次', sub: '社区下载量 / DOWNLOADS' },
      { label: '商业兑现 / MONETIZED', en: 'REVENUE', value: '37%', sub: '企业服务收入占比 / SHARE' },
    ],
    rate: { value: '37%', label: '转化为企业收入 / CONVERT' },
    mediaPlaceholder: '社区到企业转化图 / DROP IMAGE',
    mediaSlotCount: 1, metricCount: 2, focusEnabled: true, focusIndex: 1,
    showRate: true, showBars: true, showBadge: true, accent: '#c8f135',
  };

  SlideConvert.controls = [
    { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
      desc: '右侧自适应图片槽数量（0 时转化列加宽；上传后按图片比例自适应，构图随数量重排）' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 1, max: 3, desc: '左侧辅助指标数量' },
    { key: 'focusEnabled', label: '重点极点高亮', type: 'toggle', default: true, desc: '是否突出某一极点（影响力 / 兑现）' },
    { key: 'focusIndex', label: '高亮第几极', type: 'number', default: 1, min: 0, max: 1, desc: '被突出的极点（0 影响力 / 1 兑现）', showIf: (p) => p.focusEnabled },
    { key: 'showRate', label: '转化率桥接', type: 'toggle', default: true, desc: '显示/隐藏两极之间的转化率桥接（装饰数据）' },
    { key: 'showBars', label: '量级条', type: 'toggle', default: true, desc: '显示/隐藏每极量级条（装饰）' },
    { key: 'showBadge', label: '赛道徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角赛道徽标（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideConvert;
