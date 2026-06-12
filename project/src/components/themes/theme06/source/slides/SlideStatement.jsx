// ============================================================================
// SlideStatement.jsx — P89 前瞻主题 / Editorial Statement (image_led, reusable)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A bold "manifesto / thesis" page: an oversized editorial statement (mixed
// weight, one lime-highlighted phrase, an inline lime mark) sits against a soft
// top spotlight, paired with an adaptive image and a couple of anchor stat
// cards in the corner — borrowing the reference art's big-statement-plus-mini-
// stat-cards composition. The right media column is fully driven by
// mediaSlotCount (0..2) and rebalances at every count; each KxImageSlot follows
// its uploaded image's natural ratio (ratio-aware). With 0 slots the statement
// goes full-bleed (pure-type editorial) so the page is never empty. Reusable
// for any section-closing statement / thesis page.
//
// Second-level prefix: kx-stm-  ·  style id: kx-stm-css  (unique)
//
// PROPS (content — text, set via defaults / props, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,kicker,statement(html),lead,closing,footRight
//   statTag                       corner badge text (decorative)
//   stats ({k,v}[])               anchor stat cards
//   mediaPlaceholder              image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   mediaSlotCount (int 0..2)  adaptive image slots (0 → full-bleed statement)
//   statCount (int 0..3)       anchor stat cards (0 hides the row)
//   focusEnabled (bool)        emphasise one stat card
//   focusIndex (int)           which stat
//   showKicker (bool)          mono kicker line (decorative)
//   showGlow (bool)            top spotlight glow (decorative)
//   showBadge (bool)           corner badge (decorative)
//   showLead (bool)            bottom lead line (decorative text)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-stm-css')) {
  const css = `
  .kx-stm-glow{position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(90% 60% at 50% -8%,rgba(240,239,230,.16),transparent 60%),
               radial-gradient(70% 55% at 108% 8%,color-mix(in srgb,var(--kx-accent) 16%,transparent),transparent 62%);}
  .kx-stm-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;position:relative;}
  .kx-stm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;}
  .kx-stm-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:8px 16px;white-space:nowrap;}
  .kx-stm-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}

  .kx-stm-main{flex:1;min-height:0;display:grid;column-gap:64px;align-items:center;padding:18px 0;}
  .kx-stm-left{display:flex;flex-direction:column;justify-content:center;min-width:0;}
  .kx-stm-kicker{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;display:flex;align-items:center;gap:13px;margin-bottom:26px;}
  .kx-stm-kicker::before{content:'';width:34px;height:2px;background:var(--kx-accent);flex:none;}
  .kx-stm-quote{font-family:var(--kx-disp);font-weight:500;line-height:1.04;letter-spacing:-.015em;
    margin:0;text-wrap:pretty;color:var(--kx-cream);}
  .kx-stm-quote b{font-weight:900;color:var(--kx-accent);}
  .kx-stm-quote .kx-mk{display:inline-block;width:.62em;height:.62em;background:var(--kx-accent);
    transform:translateY(.02em) rotate(45deg);margin:0 .12em;vertical-align:baseline;}
  .kx-stm-lead{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute);line-height:1.5;
    margin-top:30px;max-width:760px;text-wrap:pretty;}

  /* right media column */
  .kx-stm-right{display:flex;flex-direction:column;min-height:0;gap:16px;justify-content:center;}
  .kx-stm-right .kx-imgslot{width:100%;}

  /* anchor stat cards */
  .kx-stm-stats{display:flex;gap:16px;flex-wrap:wrap;margin-top:26px;}
  .kx-stm-stat{border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:18px 22px;min-width:210px;display:flex;flex-direction:column;gap:8px;}
  .kx-stm-stat.kx-on{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
  .kx-stm-stat .kx-sk{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center;justify-content:space-between;gap:14px;}
  .kx-stm-stat.kx-on .kx-sk{color:rgba(12,12,12,.62);}
  .kx-stm-stat .kx-sk .kx-ar{color:var(--kx-accent);font-weight:700;}
  .kx-stm-stat.kx-on .kx-sk .kx-ar{color:var(--kx-ink);}
  .kx-stm-stat .kx-sv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
  .kx-stm-stat.kx-on .kx-sv{color:var(--kx-ink);}

  .kx-stm-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;
    margin-top:8px;border-top:1px solid var(--kx-line);}
  .kx-stm-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-stm-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-stm-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
// per-count ratio clamps keep media tidy as the column changes shape
const RATIO = { 1: [0.66, 1.05], 2: [1.2, 2.0] };

function SlideStatement(props) {
  const p = { ...SlideStatement.defaults, ...props };
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const stats = p.stats.slice(0, clamp(p.statCount, 0, p.stats.length));
  const fi = clamp(p.focusIndex, 0, Math.max(0, stats.length - 1));
  // statement scales up when there's no media to fill
  const quoteSize = slots === 0 ? '108px' : '74px';
  const mainCols = slots === 0 ? '1fr' : (slots === 1 ? '1.16fr 0.84fr' : '1.24fr 0.76fr');

  const left = h('div', { className: 'kx-stm-left' },
    p.showKicker ? h('div', { className: 'kx-stm-kicker' }, p.kicker) : null,
    h('p', { className: 'kx-stm-quote', style: { fontSize: quoteSize },
      dangerouslySetInnerHTML: { __html: p.statement } }),
    p.showLead ? h('div', { className: 'kx-stm-lead' }, p.lead) : null,
    stats.length ? h('div', { className: 'kx-stm-stats' },
      stats.map((st, i) => {
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-stm-stat' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-sk' }, h('span', null, st.k), h('span', { className: 'kx-ar' }, '↗')),
          h('div', { className: 'kx-sv' }, st.v));
      })) : null);

  let right = null;
  if (slots > 0) {
    const [mn, mx] = RATIO[slots] || RATIO[1];
    right = h('div', { className: 'kx-stm-right' },
      Array.from({ length: slots }, (_, i) =>
        h(KxImageSlot, {
          key: slots + '-' + i, id: 'statement-' + slots + '-' + i,
          placeholder: slots === 1 ? p.mediaPlaceholder : ('图 ' + String(i + 1).padStart(2, '0')),
          badge: slots === 1 ? p.statTag : ('IMG ' + String(i + 1).padStart(2, '0')),
          minRatio: mn, maxRatio: mx, style: { width: '100%' },
        })));
  }

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    p.showGlow ? h('div', { className: 'kx-stm-glow' }) : null,
    h('div', { className: 'kx-pad kx-stm-pad' },
      h('div', { className: 'kx-stm-head' },
        h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
        p.showBadge ? h('div', { className: 'kx-stm-badge' }, p.statTag) : null),
      h('div', { className: 'kx-stm-main', style: { gridTemplateColumns: mainCols } },
        left, right),
      h('div', { className: 'kx-stm-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight + ' · ' + (slots === 0 ? 'STATEMENT' : slots + ' IMG')))));
}

SlideStatement.defaults = {
  eyebrowId: '89', eyebrowLabel: 'FORWARD VIEW',
  kicker: '前瞻判断 / FORWARD STATEMENT',
  statement: '融资盛宴退潮后，<span class="kx-mk"></span> 真正的护城河来自<b>稳定收入与确定性算力</b>，而非估值叙事。',
  lead: '叙事可以一次性融到大钱，但只有持续兑现的收入与可控的算力成本，才会在 2025 年被公开市场重新定价为壁垒。',
  closing: '把注意力从融资额转向兑现能力。',
  footRight: 'FORWARD VIEW',
  statTag: '前瞻 / OUTLOOK',
  stats: [
    { k: '收入兑现 / REVENUE', v: '稳' },
    { k: '算力成本 / COMPUTE', v: '降' },
    { k: '估值锚 / VALUATION', v: '重定' },
  ],
  mediaPlaceholder: '前瞻主视觉 / DROP IMAGE',
  mediaSlotCount: 1, statCount: 3, focusEnabled: true, focusIndex: 0,
  showKicker: true, showGlow: true, showBadge: true, showLead: true, accent: '#c8f135',
};

SlideStatement.controls = [
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 时主张文案占满整版；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'statCount', label: '锚点指标数量', type: 'number', default: 3, min: 0, max: 3, desc: '底部锚点指标卡数量（0 隐藏整行）' },
  { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一锚点指标卡' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 2, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled && p.statCount > 0 },
  { key: 'showKicker', label: '前置小标', type: 'toggle', default: true, desc: '显示/隐藏主张上方的 mono 小标（装饰）' },
  { key: 'showGlow', label: '顶部光晕', type: 'toggle', default: true, desc: '显示/隐藏顶部聚光光晕（装饰）' },
  { key: 'showBadge', label: '角标徽标', type: 'toggle', default: true, desc: '显示/隐藏右上角徽标（装饰）' },
  { key: 'showLead', label: '引导段落', type: 'toggle', default: true, desc: '显示/隐藏主张下方的引导段（装饰文案）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideStatement;
