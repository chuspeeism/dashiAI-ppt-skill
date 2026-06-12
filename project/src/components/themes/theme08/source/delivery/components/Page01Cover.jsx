// Page01Cover.jsx — "Hero Cover" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent, prop-driven slide component. No dependency on the Tweaks panel;
// the preview shell maps Tweak values onto these props. Depends only on the
// shared primitives (Doodle / Sticker / MetaTag / AdaptiveImageSlot) + tokens.
//
// All class names are prefixed `acl-cv-` so the page can't collide after it is
// migrated into another React project.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page01Cover(props) {
  const p = { ...Page01Cover.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showDecor, showMeta,
    eyebrow, year, headlineLines, subheadline, subheadMark, closingLine, meta, decorTexts, collage,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const slots = (collage[mediaCount] || []);
  const renderSub = () => {
    if (subheadMark && subheadline.indexOf(subheadMark) >= 0) {
      const parts = subheadline.split(subheadMark);
      return <React.Fragment>{parts[0]}<span className="acl-hl" style={{ background: 'var(--acl-blue)' }}>{subheadMark}</span>{parts[1]}</React.Fragment>;
    }
    return subheadline;
  };

  return (
    <div className="acl-root acl-cv" style={{ background: bg }}>
      <style>{`
        .acl-cv{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); }
        .acl-cv__grain{ position:absolute; inset:0; pointer-events:none; opacity:.5;
          background:radial-gradient(circle at 80% 12%, rgba(255,255,255,.5), transparent 55%); }
        .acl-cv__eyebrow{ position:absolute; top:84px; left:100px; font-family:var(--acl-font-mono);
          font-weight:700; font-size:24px; letter-spacing:.16em; text-transform:uppercase;
          display:flex; align-items:center; gap:14px; }
        .acl-cv__eyebrow i{ width:46px; height:7px; background:var(--acl-ink); display:inline-block; }
        .acl-cv__main{ position:absolute; left:100px; top:178px; width:1040px; }
        .acl-cv__h{ font-weight:900; font-size:112px; line-height:1.4; letter-spacing:-.01em;
          margin:0; }
        .acl-cv__h .l2{ display:inline-block; }
        .acl-cv__mark{ background:var(--acl-pink); color:var(--acl-paper); padding:0 .12em; white-space:nowrap; }
        .acl-cv__sub{ margin-top:32px; font-family:var(--acl-font-mono); font-size:25px;
          font-weight:700; letter-spacing:.02em; color:rgba(22,21,15,.78); }
        .acl-cv__year{ position:absolute; top:120px; right:104px; z-index:4;
          background:var(--acl-ink); color:var(--acl-yellow); font-family:var(--acl-font-num);
          font-size:96px; line-height:.84; padding:18px 24px 12px; transform:rotate(4deg);
          box-shadow:5px 7px 0 rgba(22,21,15,.2); letter-spacing:.02em; }
        .acl-cv--muted .acl-cv__year{ color:var(--acl-paper); }
        .acl-cv__foot{ position:absolute; left:100px; bottom:88px; width:760px;
          display:flex; align-items:flex-end; gap:30px; }
        .acl-cv__close{ font-family:var(--acl-font-cn); font-weight:700; font-size:30px;
          line-height:1.3; max-width:560px; }
        .acl-cv__meta{ position:absolute; right:104px; bottom:84px; display:flex; gap:44px;
          z-index:4; }
        .acl-cv__stage{ position:absolute; right:60px; top:150px; width:820px; height:720px; }
        .acl-cv__slot{ position:absolute; }
        .acl-cv__anno{ position:absolute; font-family:var(--acl-font-hand); font-weight:400;
          color:var(--acl-ink); line-height:1.05; z-index:5; white-space:nowrap; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cv__h{ animation:acl-cv-rise .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-cv__h .l2{ animation:acl-cv-rise .6s .08s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-cv-rise{ from{ opacity:0; transform:translateY(26px); } to{ opacity:1; transform:none; } }
      `}</style>
      <div className="acl-cv__grain" />

      <div className="acl-cv__eyebrow"><i />{eyebrow}</div>

      <div className="acl-cv__main">
        <h1 className="acl-cv__h">
          <span className="l1">{headlineLines[0]}</span><br />
          <span className="l2"><span className="acl-cv__mark">{headlineLines[1]}</span></span>
        </h1>
        <div className="acl-cv__sub">{renderSub()}</div>
      </div>

      <div className="acl-cv__year">{year}</div>

      {/* photo collage — adaptive slots, count-driven layout */}
      <div className="acl-cv__stage">
        {slots.map((s, i) => (
          <div className="acl-cv__slot" key={i} style={{ left: s.l, top: s.t }}>
            <AdaptiveImageSlot id={'cover-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
              accent={s.accent} placeholder={s.ph} sticker={s.st} />
          </div>
        ))}
        {showDecor && (
          <React.Fragment>
            <Doodle kind="spark" size={54} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ left: -24, top: 16 }} />
            <Doodle kind="arrow" size={94} rotate={32} color="var(--acl-ink)"
              style={{ left: 286, top: -30 }} />
          </React.Fragment>
        )}
      </div>

      {showDecor && (
        <div className="acl-cv__anno" style={{ left: 120, top: 560, fontSize: 27,
          display: 'flex', alignItems: 'center', gap: 16, transform: 'rotate(-2deg)' }}>
          <Doodle kind="arrowS" size={60} rotate={-12} color="var(--acl-pink)" style={{ position: 'static' }} />
          <span>{decorTexts[1]}</span>
        </div>
      )}

      <div className="acl-cv__foot">
        <Doodle kind="loop" size={74} rotate={0} color="var(--acl-ink)"
          style={{ position: 'static', flex: '0 0 auto' }} />
        <div className="acl-cv__close">{closingLine}</div>
      </div>

      {showMeta && (
        <div className="acl-cv__meta">
          {meta.map((m, i) => <MetaTag key={i} k={m.k} v={m.v} />)}
        </div>
      )}
    </div>
  );
}

// ── default content + collage layout presets (count → slot configs) ──────────
Page01Cover.defaults = {
  // adjustable params
  backgroundTheme: 'primary',   // 'primary' (yellow) | 'muted' (lilac)
  mediaCount: 3,                // 0–4 photo slots
  showDecor: true,             // hand-drawn doodles + annotations
  showMeta: true,              // bottom data tags
  // text content (not exposed to Tweaks; edit in code)
  eyebrow: 'AI CAPITAL LAB · 2024',
  year: '2024',
  headlineLines: ['美国大额融资', 'AI 公司调研报告'],
  subheadline: '数据口径：2024 全年 · 单笔 ≥ 1 亿美元',
  subheadMark: '≥ 1 亿美元',
  closingLine: '从资本流向，看 AI 产业下一阶段的真实重心。',
  meta: [
    { k: 'Year', v: '2024' },
    { k: 'Cut', v: '≥1 亿美元' },
    { k: 'Date', v: "2026.06" },
  ],
  decorTexts: ['横纵分析法', '每一笔都是一次押注'],
  // collage presets — each key = mediaCount, balanced for that count
  collage: {
    0: [],
    1: [
      { l: 200, t: 150, box: 460, r: -3, ratio: 0.82, accent: 'var(--acl-paper)', ph: '主图', st: { label: 'FIG.01', sub: '现场', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
    ],
    2: [
      { l: 70, t: 70, box: 360, r: -4, ratio: 0.8, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.01', sub: '现场', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
      { l: 360, t: 360, box: 340, r: 4, ratio: 1.25, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.02', color: 'var(--acl-blue)', rotate: 3 } },
    ],
    3: [
      { l: 330, t: 40, box: 350, r: 3, ratio: 0.84, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.01', sub: '现场', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
      { l: 40, t: 300, box: 300, r: -5, ratio: 1.2, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.02', color: 'var(--acl-blue)', rotate: 4 } },
      { l: 420, t: 430, box: 250, r: 6, ratio: 0.78, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.03', color: 'var(--acl-pink)', rotate: -3 } },
    ],
    4: [
      { l: 360, t: 20, box: 300, r: 3, ratio: 0.82, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.01', sub: '现场', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
      { l: 50, t: 130, box: 250, r: -5, ratio: 0.9, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.02', color: 'var(--acl-blue)', rotate: 4 } },
      { l: 140, t: 430, box: 270, r: 4, ratio: 1.15, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.03', color: 'var(--acl-pink)', rotate: -3 } },
      { l: 500, t: 400, box: 240, r: -4, ratio: 0.8, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'FIG.04', color: 'var(--acl-yellow)', rotate: 5 } },
    ],
  },
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page01Cover.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '拼贴照片槽数量；布局随数量自动平衡，每个槽按上传图片比例自适应' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与批注文案的显示/隐藏' },
  { key: 'showMeta', type: 'boolean', default: true,
    label: '底部信息', desc: '底部数据标签行的显示/隐藏' },
];

export const defaults = Page01Cover.defaults;
export const controls = Page01Cover.controls;
