// Page85HeroSplit.jsx — "Hero Split · Editorial Spread" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-hs-`.
// A NEW image layout (distinct from P08 list+collage, P31 branch cards, P45
// radial hub, P57 postcards, P83 poster columns, P88 photo wall): a magazine
// HERO SPREAD — a left editorial column (eyebrow / huge headline / lead /
// count-driven caption chips / metric tiles) faces a right HERO STAGE where one
// big aspect-true image bleeds off-frame with 0–2 overlapping cut-outs. Every
// variation is a prop. Pure ESM — no Tweaks/preview-runtime dependency; scoped CSS.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page85HeroSplit(props) {
  const p = { ...Page85HeroSplit.defaults, ...props };
  const {
    backgroundTheme, mediaCount, tagCount, metricCount, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, lead, tags, metrics, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const chips = tags.slice(0, Math.max(2, tagCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, chips.length - 1);
  const slots = collage[mediaCount] || [];

  return (
    <div className="acl-root acl-hs" style={{ background: bg }}>
      <style>{`
        .acl-hs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 96px 58px; display:flex; gap:48px; }
        .acl-hs__left{ flex:0 0 47%; display:flex; flex-direction:column; min-width:0; z-index:3; }
        .acl-hs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55);
          display:flex; align-items:center; gap:14px; }
        .acl-hs__eyebrow .acl-hs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:16px;
          letter-spacing:.04em; padding:6px 12px; background:var(--acl-ink); color:var(--acl-yellow);
          transform:rotate(-2deg); text-transform:uppercase;  white-space:nowrap;}
        .acl-hs__h{ font-weight:900; font-size:104px; line-height:.9; margin:18px 0 0; letter-spacing:-.01em;
          text-wrap:balance; }
        .acl-hs__lead{ font-weight:700; font-size:26px; line-height:1.46; margin-top:26px; max-width:760px;
          text-wrap:pretty; }
        .acl-hs__lead b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-hs__chips{ display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
        .acl-hs__chip{ font-family:var(--acl-font-mono); font-weight:700; font-size:17px; letter-spacing:.03em;
          padding:9px 16px; background:var(--acl-paper); border:2.5px solid var(--acl-ink);
          box-shadow:3px 4px 0 rgba(22,21,15,.16); display:flex; align-items:baseline; gap:8px;
          transition:transform .25s, background .25s; }
        .acl-hs__chip i{ font-family:var(--acl-font-num); font-style:normal; font-size:15px;
          color:rgba(22,21,15,.5); }
        .acl-hs__chip--focus{ background:var(--acl-pink); color:var(--acl-paper); transform:translateY(-3px) rotate(-2deg); }
        .acl-hs__chip--focus i{ color:rgba(255,255,255,.7); }
        .acl-hs__tiles{ display:flex; gap:0; margin-top:auto; padding-top:30px; }
        .acl-hs__tile{ flex:1; padding-right:30px; margin-right:30px; border-right:3px solid rgba(22,21,15,.18); }
        .acl-hs__tile:last-child{ border-right:0; margin-right:0; padding-right:0; }
        .acl-hs__tk{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-hs__tv{ font-family:var(--acl-font-num); font-size:58px; line-height:.92; margin-top:4px; }
        .acl-hs__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:5px; color:rgba(22,21,15,.55); }

        .acl-hs__stage{ flex:1; position:relative; min-width:0; }
        .acl-hs__slot{ position:absolute; }
        .acl-hs__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:40px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        .acl-hs__foot{ position:absolute; left:96px; bottom:24px; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-hand); font-size:27px; z-index:4; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-hs__h{ animation:acl-hs-rise .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-hs__chip{ animation:acl-hs-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .2s); }
          [data-deck-active] .acl-hs__slot{ animation:acl-hs-pop .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--s,0) * .1s + .15s); }
        }
        @keyframes acl-hs-rise{ from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:none; } }
        @keyframes acl-hs-pop{ from{ opacity:0; transform:scale(.92); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-hs__left">
        <div className="acl-hs__eyebrow">
          <span>{eyebrow}</span>
          <span className="acl-hs__sub">{subheadline}</span>
        </div>
        <h1 className="acl-hs__h">{headline}</h1>
        <div className="acl-hs__lead" dangerouslySetInnerHTML={{ __html: lead }} />
        <div className="acl-hs__chips">
          {chips.map((c, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <span key={i} className={'acl-hs__chip' + (isF ? ' acl-hs__chip--focus' : '')} style={{ '--i': i }}>
                <i>{String(i + 1).padStart(2, '0')}</i>{c}
              </span>
            );
          })}
        </div>
        <div className="acl-hs__tiles">
          {tiles.map((m, i) => (
            <div key={i} className="acl-hs__tile">
              <div className="acl-hs__tk">{m.k}</div>
              <div className="acl-hs__tv">{m.v}{m.unit && <em>{m.unit}</em>}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="acl-hs__stage">
        {slots.length === 0 && <div className="acl-hs__empty">// 图片数量 = 0</div>}
        {slots.map((s, i) => (
          <div className="acl-hs__slot" key={i} style={{ left: s.l, top: s.t, '--s': i, zIndex: s.z || 1 }}>
            <AdaptiveImageSlot id={'hs-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
              accent={i === 0 ? 'var(--acl-paper)' : s.color}
              placeholder={s.cap}
              sticker={i === 0 ? { label: s.cap, color: 'var(--acl-yellow)', subColor: 'var(--acl-ink)', sub: 'A', rotate: -4 } : null} />
          </div>
        ))}
        {showDecor && slots.length > 0 && (
          <React.Fragment>
            <Doodle kind="arrow" size={90} rotate={158} color="var(--acl-ink)" style={{ left: -28, top: 30 }} />
            <Doodle kind="spark" size={40} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ right: 6, top: -6 }} />
            <Doodle kind="heart" size={38} rotate={-8} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 60, bottom: 24 }} />
          </React.Fragment>
        )}
      </div>

      <div className="acl-hs__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page85HeroSplit.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  mediaCount: 3,               // 0–3 images: 1 bleeding hero + up to 2 cut-outs
  tagCount: 4,                 // 2–5 caption chips (focusable)
  metricCount: 3,              // 2–4 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Field Guide · 2025',
  subheadline: 'How to Enter',
  headline: '进入 AI 资本市场',
  lead: '不再是「投不投」，而是<b>怎么进、何时进、绑定什么资源</b>——入场方式比方向更决定回报。',
  tags: ['看兑现而非叙事', '绑定算力与渠道', '阶段错位布局', '盯紧毛利结构', '关注退出路径'],
  metrics: [
    { k: '可入场窗口', v: '18', unit: '个月' },
    { k: '建议配置', v: '60', unit: '% 兑现' },
    { k: '观察赛道', v: '12', unit: '类' },
  ],
  // count-driven hero collage — slot 0 is the bleeding hero; others are cut-outs.
  // stage area ≈ right column (~820×860); each slot resizes to its image ratio.
  collage: {
    0: [],
    1: [
      { l: 60, t: 70, box: 600, r: -2, ratio: 0.92, z: 2, cap: '主视觉', color: 'var(--acl-yellow)' },
    ],
    2: [
      { l: 90, t: 20, box: 540, r: -2, ratio: 0.96, z: 2, cap: '主视觉', color: 'var(--acl-yellow)' },
      { l: 8, t: 470, box: 300, r: 4, ratio: 1.2, z: 3, cap: '场景', color: 'var(--acl-blue)' },
    ],
    3: [
      { l: 150, t: 0, box: 520, r: -2, ratio: 0.96, z: 2, cap: '主视觉', color: 'var(--acl-yellow)' },
      { l: 0, t: 380, box: 290, r: 4, ratio: 1.18, z: 3, cap: '场景', color: 'var(--acl-blue)' },
      { l: 470, t: 500, box: 250, r: -5, ratio: 0.82, z: 3, cap: '团队', color: 'var(--acl-pink)' },
    ],
  },
  closingLine: '入场方式，本身就是一种判断。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page85HeroSplit.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '主视觉+裁切配图槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'tagCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '要点标签数量', desc: '左栏要点标签数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '左栏底部支撑指标格数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一个要点标签' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 4, maxFrom: 'tagCount', step: 1,
    label: '重点对象', desc: '被突出的标签序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page85HeroSplit.defaults;
export const controls = Page85HeroSplit.controls;
