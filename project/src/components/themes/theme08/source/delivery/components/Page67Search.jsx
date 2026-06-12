// Page67Search.jsx — "Case Card · Hero + Conversion Funnel" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cf-`.
// A single-subject company case card pairing a LEFT dominant hero image (1 main
// + up to 2 nested AdaptiveImageSlots, each self-sizing to its photo, with an
// optional headline badge) and a RIGHT vertical CONVERSION FUNNEL (count-driven
// shrinking stages, one focusable) plus a metric-tile row. Pure ESM — every
// visible change flows from props; no Tweaks / preview-runtime dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page67Search(props) {
  const p = { ...Page67Search.defaults, ...props };
  const {
    backgroundTheme, mediaCount, stageCount, metricCount, showValueLabels, showBadge,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, caption, funnelTitle,
    badgeValue, badgeLabel, stages, hero, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const steps = stages.slice(0, Math.max(2, stageCount));
  const fIdx = Math.min(focusIndex, steps.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = hero[mediaCount] || [];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-cf" style={{ background: bg }}>
      <style>{`
        .acl-cf{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-cf__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-cf__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-cf__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-cf__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-cf__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-cf__h{ font-weight:900; font-size:74px; line-height:.92; margin:0; }
        .acl-cf__plate{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:9px 15px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-cf__body{ flex:1; display:flex; gap:52px; margin-top:24px; min-height:0; }

        /* left: dominant hero (1 main + nested) */
        .acl-cf__stage{ flex:0 0 760px; position:relative; min-width:0; }
        .acl-cf__slot{ position:absolute; }
        .acl-cf__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-3deg); }
        .acl-cf__badge{ position:absolute; z-index:6; left:6px; bottom:18px; background:var(--acl-ink);
          color:var(--acl-paper); padding:16px 24px 14px; transform:rotate(-3deg);
          box-shadow:6px 8px 0 rgba(22,21,15,.28); text-align:center;  white-space:nowrap;}
        .acl-cf__badgev{ font-family:var(--acl-font-num); font-size:74px; line-height:.82; color:var(--acl-yellow); }
        .acl-cf__badgek{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(251,250,244,.7); margin-top:5px; }

        /* right: conversion funnel + tiles */
        .acl-cf__right{ flex:1; display:flex; flex-direction:column; min-width:0; }
        .acl-cf__cap{ font-weight:700; font-size:24px; line-height:1.46; }
        .acl-cf__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-cf__ftitle{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin:24px 0 14px; display:flex;
          align-items:center; gap:10px; }
        .acl-cf__funnel{ display:flex; flex-direction:column; gap:10px; }
        .acl-cf__stagewrap{ display:flex; flex-direction:column; align-items:center; gap:10px; }
        .acl-cf__connector{ width:0; height:0; border-left:13px solid transparent;
          border-right:13px solid transparent; border-top:12px solid rgba(22,21,15,.32); }
        .acl-cf__bar{ position:relative; height:74px; border:3px solid var(--acl-ink);
          box-shadow:5px 6px 0 rgba(22,21,15,.14); display:flex; align-items:center; gap:16px;
          padding:0 24px; color:var(--acl-paper); overflow:hidden;
          transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-cf__bk{ font-weight:900; font-size:27px; line-height:1; z-index:1; white-space:nowrap; }
        .acl-cf__bnote{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; opacity:.8; z-index:1; white-space:nowrap; }
        .acl-cf__bv{ margin-left:auto; font-family:var(--acl-font-num); font-size:44px; line-height:.84;
          z-index:1; white-space:nowrap; color:var(--acl-paper); }
        .acl-cf__bv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:3px; opacity:.7; }
        .acl-cf__bar--focus{ transform:scale(1.025); z-index:2; box-shadow:8px 10px 0 rgba(22,21,15,.26);
          outline:4px solid var(--acl-yellow); outline-offset:-3px; }
        .acl-cf__bar--dim{ opacity:.52; }
        .acl-cf__bfx{ position:absolute; top:-14px; right:-8px; z-index:5; }

        .acl-cf__tiles{ display:flex; gap:34px; margin-top:auto; padding-top:24px; }
        .acl-cf__tile .acl-metatag .v{ font-family:var(--acl-font-num); font-size:48px; line-height:.9; }
        .acl-cf__tile .acl-metatag .v em{ font-style:normal; font-size:18px; font-family:var(--acl-font-cn);
          font-weight:700; margin-left:4px; color:rgba(22,21,15,.5); }

        .acl-cf__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cf__stagewrap{ animation:acl-cf-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .25s); }
          [data-deck-active] .acl-cf__badge{ animation:acl-cf-pop .55s cubic-bezier(.2,.8,.2,1) .3s both; }
        }
        @keyframes acl-cf-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; } }
        @keyframes acl-cf-pop{ from{ opacity:0; transform:rotate(-3deg) scale(.8); } to{ opacity:1; transform:rotate(-3deg) scale(1); } }
      `}</style>

      <div className="acl-cf__top">
        <div className="acl-cf__eyebrow">{eyebrow}</div>
        <div className="acl-cf__rule" />
        <div className="acl-cf__kicker">{kicker}</div>
      </div>

      <div className="acl-cf__head">
        <h1 className="acl-cf__h">{headline}</h1>
        <div className="acl-cf__plate">{company}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-cf__body">
        {/* ── left: dominant hero ── */}
        <div className="acl-cf__stage">
          {slots.length === 0 && <div className="acl-cf__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-cf__slot" key={i} style={{ left: s.l, top: s.t, zIndex: s.z || (i + 1) }}>
              <AdaptiveImageSlot id={'cf-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={i === 0 ? company : ('FIG.' + (i + 1))}
                sticker={i === 0 ? { label: company, sub: tag, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr } : null} />
            </div>
          ))}
          {showBadge && slots.length > 0 && (
            <div className="acl-cf__badge">
              <div className="acl-cf__badgev">{badgeValue}</div>
              <div className="acl-cf__badgek">{badgeLabel}</div>
            </div>
          )}
          {showDecor && slots.length > 0 && (
            <Doodle kind="arrow" size={76} rotate={6} color="var(--acl-ink)" style={{ right: -22, top: '38%' }} />
          )}
        </div>

        {/* ── right: conversion funnel ── */}
        <div className="acl-cf__right">
          <div className="acl-cf__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          <div className="acl-cf__ftitle">
            {funnelTitle}
            {showDecor && <Doodle kind="arrowS" size={28} rotate={-12} style={{ position: 'static' }} />}
          </div>
          <div className="acl-cf__funnel">
            {steps.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const c = accents[i % accents.length];
              return (
                <div className="acl-cf__stagewrap" key={i} style={{ '--i': i }}>
                  {i > 0 && <div className="acl-cf__connector" />}
                  <div className={'acl-cf__bar' + (isF ? ' acl-cf__bar--focus' : '') + (dim ? ' acl-cf__bar--dim' : '')}
                    style={{ width: s.w + '%', background: c }}>
                    {isF && showDecor && <div className="acl-cf__bfx"><Sticker label="转化" color="var(--acl-yellow)" rotate={6} size={12} /></div>}
                    <span className="acl-cf__bk">{s.k}</span>
                    <span className="acl-cf__bnote">{s.note}</span>
                    {showValueLabels && <span className="acl-cf__bv">{s.v}{s.unit && <em>{s.unit}</em>}</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="acl-cf__tiles">
            {tiles.map((m, i) => (
              <div className="acl-cf__tile" key={i}>
                <MetaTag k={m.k} v={<React.Fragment>{m.v}{m.unit && <em>{m.unit}</em>}</React.Fragment>} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-cf__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page67Search.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,
  stageCount: 3,
  metricCount: 2,
  showValueLabels: true,
  showBadge: true,
  focusEnabled: true,
  focusIndex: 2,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Perplexity Case',
  kicker: '案例卡',
  headline: 'AI 搜索入口',
  company: 'Perplexity',
  tag: 'AI 搜索',
  caption: 'Perplexity 代表 AI 搜索与答案引擎方向——机会在于 <b>重构信息入口</b>，挑战是内容版权与用户留存。',
  funnelTitle: '从流量到订阅的转化漏斗',
  badgeValue: '4800万',
  badgeLabel: 'Monthly Active Users',
  stages: [
    { k: '月活用户', note: 'Monthly Active', v: '4800', unit: '万', w: 100 },
    { k: '高频提问', note: 'High-intent', v: '58', unit: '%', w: 64 },
    { k: '订阅转化', note: 'Paid Conversion', v: '5.8', unit: '%', w: 34 },
    { k: '年度续订', note: 'Renewal', v: '74', unit: '%', w: 22 },
  ],
  // count-driven hero presets — stage ≈ 760×680, each slot resizes to its ratio.
  hero: {
    0: [],
    1: [
      { l: 90, t: 50, box: 540, r: -2, ratio: 1.2, sr: -4, z: 1, color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 40, t: 20, box: 500, r: -3, ratio: 1.12, sr: -4, z: 1, color: 'var(--acl-yellow)' },
      { l: 410, t: 380, box: 300, r: 5, ratio: 0.82, sr: 4, z: 2, color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 30, t: 0, box: 470, r: -3, ratio: 1.08, sr: -4, z: 1, color: 'var(--acl-yellow)' },
      { l: 430, t: 50, box: 250, r: 5, ratio: 0.8, sr: 4, z: 2, color: 'var(--acl-blue)' },
      { l: 400, t: 400, box: 280, r: 4, ratio: 1.05, sr: -3, z: 3, color: 'var(--acl-pink)' },
    ],
  },
  metrics: [
    { k: '最大单笔融资', v: '5.2', unit: '亿' },
    { k: '赛道', v: 'AI 搜索' },
    { k: '订阅转化率', v: '5.8', unit: '%' },
  ],
  closingLine: '新入口，要用留存证明价值。',
};

Page67Search.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '特写图片数量(0–3)：1 主视觉 + 至多 2 张嵌套；每张按上传图片比例自适应' },
  { key: 'stageCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '漏斗阶段', desc: '转化漏斗的阶段数量(2–4)' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–3)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '漏斗各阶段的数值标签 显隐' },
  { key: 'showBadge', type: 'boolean', default: true,
    label: '高亮徽标', desc: '主视觉上的大号高亮数字徽标 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个漏斗阶段' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, maxFrom: 'stageCount', step: 1,
    label: '重点对象', desc: '被突出的漏斗阶段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page67Search.defaults;
export const controls = Page67Search.controls;
