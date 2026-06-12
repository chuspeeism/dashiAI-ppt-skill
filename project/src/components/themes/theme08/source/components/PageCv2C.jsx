// PageCv2C.jsx — Cover · 链通全国 高效履约 (supply-chain strategy, centered layout)
// ─────────────────────────────────────────────────────────────────────────────
// Prop-driven, editable template page. Text → `defaults`, params → `controls`.
// Centered slogan with floating photo cards. Classes prefixed `fmcover-` /
// the original cover utility classes, scoped under `.fmcover-root`.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

const CSS = `
  .fmcover-root{
    --yellow:#F2EA00; --ink:#161616; --paper:#E9E7F1; --pink:#FF3D97;
    --blue:#5C7CFF; --red:#E5311D;
    --display-cn:"Noto Sans SC", sans-serif;
    --display-en:"Anton", sans-serif;
    --body:"Noto Sans SC", sans-serif;
  }
  .fmcover-root *{margin:0;padding:0;box-sizing:border-box;}
  .fmcover-root .cover{position:absolute;inset:0;overflow:hidden;text-align:center;
    font-family:var(--body);color:var(--ink);}
  .fmcover-root .grain{position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;pointer-events:none;
    background-image:radial-gradient(rgba(0,0,0,.05) 1px,transparent 1px);background-size:5px 5px;}
  .fmcover-root .eyebrow{font-family:var(--display-en);font-size:24px;letter-spacing:.16em;color:var(--ink);
    text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:14px;}
  .fmcover-root .hl{position:relative;white-space:nowrap;z-index:0;padding:0 .12em;}
  .fmcover-root .hl::before{content:"";position:absolute;inset:.04em -.18em .02em;background:var(--yellow);
    transform:rotate(-1.4deg);z-index:-1;border-radius:2px;}
  .fmcover-root .hl.pink::before{background:var(--pink);}
  .fmcover-root .hl.pink{color:#fff;}
  .fmcover-root .slogan{font-family:var(--display-cn);font-weight:900;color:var(--ink);
    line-height:1.34;font-size:116px;transform:scaleX(.95);}
  .fmcover-root .sticker{display:inline-block;font-family:var(--body);font-weight:700;font-size:24px;
    background:var(--yellow);color:var(--ink);padding:6px 14px;transform:rotate(-3deg);
    box-shadow:3px 4px 0 rgba(0,0,0,.16);line-height:1.1;}
  .fmcover-root .sticker.pink{background:var(--pink);color:#fff;}
  .fmcover-root .sticker.blue{background:var(--blue);color:#fff;}
  .fmcover-root .sticker .star{color:var(--yellow);margin-right:4px;}
  .fmcover-root .sticker.pink .star,.fmcover-root .sticker.blue .star{color:#fff;}
  .fmcover-root .photo{position:absolute;background:#fff;padding:9px 9px 10px;
    box-shadow:0 14px 30px rgba(20,20,30,.18);border:1px solid rgba(0,0,0,.05);}
  .fmcover-root .photo image-slot{display:block;width:100%;height:100%;}
  .fmcover-root .photo .tag{position:absolute;bottom:-14px;left:14px;z-index:3;}
  .fmcover-root .doodle,.fmcover-root .sparkle{position:absolute;pointer-events:none;}
  @media (prefers-reduced-motion:no-preference){
    [data-deck-active] .fmcover-root .anim{animation:fmc-rise .6s both;}
    [data-deck-active] .fmcover-root .anim.d1{animation-delay:.05s;}
    [data-deck-active] .fmcover-root .anim.d2{animation-delay:.13s;}
    [data-deck-active] .fmcover-root .anim.d3{animation-delay:.21s;}
    [data-deck-active] .fmcover-root .pop{animation:fmc-pop .5s both .2s;}
  }
  @keyframes fmc-rise{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fmc-pop{from{opacity:0;transform:scale(.7) rotate(-8deg);}to{opacity:1;}}
`;

export default function PageCv2C(props) {
  const p = { ...PageCv2C.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showDecor,
    eyebrow, kickerPre, kickerPost, sloganLine1, sloganHl, sticker, photos,
  } = p;

  const bg = backgroundTheme === 'primary' ? 'var(--yellow)' : 'var(--paper)';

  return (
    <div className="fmcover-root" style={{ position: 'absolute', inset: 0 }}>
      <style>{CSS}</style>
      <div className="cover" style={{ background: bg }} data-screen-label="封面2C 链通全国 高效履约">
        <div className="grain" />

        {/* top eyebrow */}
        <div className="eyebrow anim d1" style={{ position: 'absolute', top: 96, left: 0, right: 0 }}>
          {eyebrow}
        </div>

        {/* kicker line */}
        <div className="anim d2" style={{ position: 'absolute', top: 182, left: 0, right: 0, fontFamily: 'var(--display-cn)', fontWeight: 900, fontSize: 54, color: 'var(--ink)' }}>
          <span>{kickerPre}</span><span style={{ color: 'var(--pink)' }}>・</span><span>{kickerPost}</span>
        </div>

        {/* mega slogan centered */}
        <div className="slogan anim d3" style={{ position: 'absolute', top: 300, left: 0, right: 0 }}>
          <span>{sloganLine1}</span><br /><span className="hl pink">{sloganHl}</span>
        </div>

        {/* annotation sticker */}
        <div className="pop" style={{ position: 'absolute', top: 790, left: 0, right: 0 }}>
          <span className="sticker blue" style={{ fontSize: 24, padding: '10px 20px', transform: 'rotate(-2deg)' }}><span className="star">★</span>{sticker}</span>
        </div>

        {/* floating photo cards */}
        {mediaCount > 0 && (
          <div className="photo pop" style={{ width: 210, height: 262, top: 150, left: 128, transform: 'rotate(-5deg)' }}>
            <image-slot id="c3-a" style={{ width: '100%', height: '100%' }} placeholder={photos[0].placeholder}></image-slot>
            {photos[0].tag && <span className="sticker pop tag" style={{ transform: 'rotate(-3deg)' }}>{photos[0].tag}</span>}
          </div>
        )}
        {mediaCount > 1 && (
          <div className="photo pop" style={{ width: 196, height: 236, top: 660, left: 172, transform: 'rotate(4deg)' }}>
            <image-slot id="c3-b" style={{ width: '100%', height: '100%' }} placeholder={photos[1].placeholder}></image-slot>
            {photos[1].tag && <span className="sticker pop tag" style={{ transform: 'rotate(-3deg)' }}>{photos[1].tag}</span>}
          </div>
        )}
        {mediaCount > 2 && (
          <div className="photo pop" style={{ width: 200, height: 250, top: 150, right: 130, transform: 'rotate(5deg)' }}>
            <image-slot id="c3-c" style={{ width: '100%', height: '100%' }} placeholder={photos[2].placeholder}></image-slot>
            {photos[2].tag && <span className="sticker pink pop tag" style={{ left: 'auto', right: 14, transform: 'rotate(3deg)' }}>{photos[2].tag}</span>}
          </div>
        )}
        {mediaCount > 3 && (
          <div className="photo pop" style={{ width: 208, height: 250, top: 640, right: 150, transform: 'rotate(-4deg)' }}>
            <image-slot id="c3-d" style={{ width: '100%', height: '100%' }} placeholder={photos[3].placeholder}></image-slot>
            {photos[3].tag && <span className="sticker pop tag" style={{ transform: 'rotate(-3deg)' }}>{photos[3].tag}</span>}
          </div>
        )}

        {/* hand-drawn decor */}
        {showDecor && (
          <React.Fragment>
            <svg className="doodle" style={{ width: 120, height: 90, top: 430, left: 382, transform: 'rotate(-6deg)' }} viewBox="0 0 120 90">
              <path d="M112 70C96 18 44 8 10 18" fill="none" stroke="#161616" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M22 6l-12 12 18 6" fill="none" stroke="#161616" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="doodle" style={{ width: 120, height: 90, top: 440, right: 380, transform: 'rotate(6deg) scaleX(-1)' }} viewBox="0 0 120 90">
              <path d="M112 70C96 18 44 8 10 18" fill="none" stroke="#161616" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M22 6l-12 12 18 6" fill="none" stroke="#161616" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="sparkle pop" style={{ width: 54, height: 54, top: 262, right: 430 }} viewBox="0 0 40 40">
              <path d="M20 2c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18Z" fill="var(--yellow)" stroke="#161616" strokeWidth="2" />
            </svg>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

PageCv2C.defaults = {
  backgroundTheme: 'muted',     // 'primary' (yellow) | 'muted' (paper, as designed)
  mediaCount: 4,                // 0–4 floating photo cards
  showDecor: true,             // doodles + sparkle
  eyebrow: 'XX 集团供应链 · STRATEGY 2026–2028',
  kickerPre: '链通全国',
  kickerPost: '高效履约',
  sloganLine1: '打通物流脉络',
  sloganHl: '构筑产业护城河',
  sticker: '集团供应链体系三年发展战略',
  photos: [
    { placeholder: '物流枢纽', tag: '全国网络' },
    { placeholder: '干线运输', tag: '' },
    { placeholder: '智能仓', tag: '高效履约' },
    { placeholder: '履约现场', tag: '' },
  ],
};

PageCv2C.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(纸灰，默认) 底色' },
  { key: 'mediaCount', type: 'number', default: 4, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '四周漂浮照片卡数量（0–4）' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头与火花的显示/隐藏' },
];

export const defaults = PageCv2C.defaults;
export const controls = PageCv2C.controls;
