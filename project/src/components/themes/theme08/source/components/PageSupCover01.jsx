// PageSupCover01.jsx — Supplementary cover · 智联万物 重构体验 (tech keynote)
// ─────────────────────────────────────────────────────────────────────────────
// Prop-driven, editable template page. Text content lives in `defaults` (edit in
// code / sidebar), adjustable params are exposed through the `controls` manifest
// and mapped onto props by the preview shell — exactly like the report pages.
// Renders as JSX (no frozen innerHTML), so every string is individually editable.
// All class names are prefixed `supp-` so the page can't collide after migration.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';

const CSS = `
  .supp-cover-root{
    --yellow:#F2E70C; --pink:#FF4D97; --red:#E63329; --lilac:#E7E6F0;
    --blue:#8FB7FF; --ink:#16150F; --paper:#FBFAF4;
  }
  .supp-cover-root *{box-sizing:border-box;margin:0;padding:0;}
  .supp-cover{position:absolute;inset:0;overflow:hidden;
    font-family:'Noto Sans SC',sans-serif;color:var(--ink);}
  .supp-h{font-family:'Noto Sans SC',sans-serif;font-weight:900;line-height:.96;letter-spacing:-.01em;}
  .supp-en{font-family:'Anton',sans-serif;letter-spacing:.02em;text-transform:uppercase;}
  .supp-hand{font-family:'Caveat',cursive;font-weight:700;}
  .supp-idx{position:absolute;bottom:46px;right:60px;font-family:'Anton',sans-serif;
    font-size:26px;letter-spacing:.12em;color:var(--ink);opacity:.5;z-index:9;}
  .supp-idx b{font-size:34px;opacity:1;}
  .supp-hl{position:relative;display:inline-block;}
  .supp-hl > span{position:relative;z-index:2;}
  .supp-hl::before{content:"";position:absolute;left:-.08em;right:-.08em;top:.1em;bottom:.04em;
    z-index:1;border-radius:5px;transform:rotate(-1.4deg);background:var(--yellow);}
  .supp-hl.supp-pink::before{background:var(--pink);}
  .supp-hl.supp-blue::before{background:var(--blue);transform:rotate(1.2deg);}
  .supp-hl.supp-red::before{background:var(--red);}
  .supp-hl.supp-red > span,.supp-hl.supp-pink > span{color:var(--paper);}
  .supp-tag{display:inline-flex;align-items:center;gap:8px;font-family:'Noto Sans SC',sans-serif;
    font-weight:900;font-size:21px;letter-spacing:.02em;color:var(--ink);
    background:var(--yellow);padding:8px 16px;border-radius:7px;
    box-shadow:3px 4px 0 rgba(0,0,0,.16);white-space:nowrap;}
  .supp-tag.supp-pink{background:var(--pink);color:var(--paper);}
  .supp-tag.supp-red{background:var(--red);color:var(--paper);}
  .supp-tag.supp-ink{background:var(--ink);color:var(--paper);}
  .supp-tag .supp-star{color:var(--ink);}
  .supp-tag.supp-pink .supp-star,.supp-tag.supp-red .supp-star,.supp-tag.supp-ink .supp-star{color:var(--yellow);}
  .supp-photo{position:absolute;background:var(--paper);padding:12px 12px 14px;
    box-shadow:7px 9px 0 rgba(0,0,0,.14);}
  .supp-photo image-slot{display:block;}
  .supp-cap{position:absolute;left:14px;bottom:-13px;font-family:'Noto Sans SC',sans-serif;
    font-weight:900;font-size:17px;letter-spacing:.02em;color:var(--ink);white-space:nowrap;
    background:var(--yellow);padding:5px 12px;border-radius:6px;box-shadow:2px 3px 0 rgba(0,0,0,.18);}
  .supp-cap.supp-pink{background:var(--pink);color:var(--paper);}
  .supp-cap.supp-ink{background:var(--ink);color:var(--paper);}
  .supp-spark,.supp-arrow{position:absolute;}
  @media (prefers-reduced-motion:no-preference){
    [data-deck-active] .supp-anim{animation:supp-cover-rise .6s cubic-bezier(.2,.7,.2,1) both;}
    [data-deck-active] .supp-anim.supp-d1{animation-delay:.06s;}
    [data-deck-active] .supp-anim.supp-d2{animation-delay:.13s;}
    [data-deck-active] .supp-anim.supp-d3{animation-delay:.2s;}
    [data-deck-active] .supp-pop{animation:supp-cover-pop .5s cubic-bezier(.2,1.4,.4,1) both;}
    [data-deck-active] .supp-pop.supp-d2{animation-delay:.18s;}
    [data-deck-active] .supp-pop.supp-d3{animation-delay:.3s;}
    [data-deck-active] .supp-pop.supp-d4{animation-delay:.42s;}
  }
  @keyframes supp-cover-rise{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:none;}}
  @keyframes supp-cover-pop{from{opacity:0;transform:scale(.7) rotate(var(--rot,0deg));}}
`;

export default function PageSupCover01(props) {
  const p = { ...PageSupCover01.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showDecor, showIndex,
    eyebrow, yearTag, headlineLine1, headlineHl, headlineTail,
    subtitle, goldenLine, handNote, indexNum, indexTotal, photos,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'var(--lilac)'
    : 'linear-gradient(157deg,var(--lilac) 46%,#EDE36B 88%,var(--yellow) 122%)';

  return (
    <div className="supp-cover-root" style={{ position: 'absolute', inset: 0 }}>
      <style>{CSS}</style>
      <div className="supp-cover" style={{ background: bg }} data-screen-label="封面01 智联万物 重构体验">

        {/* top kicker row */}
        <div className="supp-anim" style={{ position: 'absolute', left: 118, top: 96, display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="supp-en" style={{ fontSize: 24 }}>{eyebrow}</span>
          <span style={{ width: 48, height: 3, background: 'var(--ink)', display: 'inline-block' }} />
          <span className="supp-tag supp-ink"><span className="supp-star">✦</span>{yearTag}</span>
        </div>

        {/* headline */}
        <h1 className="supp-h supp-anim supp-d1" style={{ position: 'absolute', left: 112, top: 236, fontSize: 184 }}>
          <span>{headlineLine1}</span><br />
          <span className="supp-hl"><span>{headlineHl}</span></span><span>{headlineTail}</span>
        </h1>

        {/* subtitle */}
        <p className="supp-anim supp-d2" style={{ position: 'absolute', left: 120, top: 642, fontSize: 37, fontWeight: 700, letterSpacing: '.04em' }}>
          {subtitle}
        </p>

        {/* golden line */}
        <div className="supp-anim supp-d3" style={{ position: 'absolute', left: 120, top: 730, display: 'flex', alignItems: 'center', gap: 22 }}>
          <span className="supp-hand" style={{ fontSize: 40, transform: 'rotate(-3deg)' }}>“</span>
          <span style={{ fontSize: 30, fontWeight: 500, letterSpacing: '.02em', borderBottom: '3px solid var(--pink)', paddingBottom: 6 }}>
            {goldenLine}
          </span>
        </div>

        {/* photo collage right */}
        {mediaCount > 0 && (
          <div className="supp-photo supp-pop supp-d2" style={{ right: 300, top: 118, width: 430, transform: 'rotate(-3.5deg)', '--rot': '-3.5deg' }}>
            <image-slot id="c1-p1" style={{ width: 406, height: 300 }} shape="rect" placeholder={photos[0].placeholder}></image-slot>
            <span className={'supp-cap ' + photos[0].capClass}>{photos[0].caption}</span>
          </div>
        )}
        {mediaCount > 1 && (
          <div className="supp-photo supp-pop supp-d3" style={{ right: 118, top: 470, width: 360, transform: 'rotate(4deg)', '--rot': '4deg' }}>
            <image-slot id="c1-p2" style={{ width: 336, height: 248 }} shape="rect" placeholder={photos[1].placeholder}></image-slot>
            <span className={'supp-cap ' + photos[1].capClass}>{photos[1].caption}</span>
          </div>
        )}
        {mediaCount > 2 && (
          <div className="supp-photo supp-pop supp-d4" style={{ right: 470, top: 560, width: 300, transform: 'rotate(-6deg)', '--rot': '-6deg' }}>
            <image-slot id="c1-p3" style={{ width: 276, height: 330 }} shape="rect" placeholder={photos[2].placeholder}></image-slot>
            <span className={'supp-cap ' + photos[2].capClass}>{photos[2].caption}</span>
          </div>
        )}

        {/* hand-drawn decor */}
        {showDecor && (
          <React.Fragment>
            <span className="supp-hand supp-anim supp-d3" style={{ position: 'absolute', left: 148, top: 840, fontSize: 30, color: 'var(--ink)', transform: 'rotate(-4deg)' }}>{handNote}</span>
            <svg className="supp-arrow" viewBox="0 0 120 90" style={{ left: 430, top: 828, width: 120, height: 90, transform: 'rotate(6deg)' }}>
              <path d="M8,18 C50,2 95,22 104,62" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M104,62 L88,58 M104,62 L100,44" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
            <svg className="supp-spark supp-pop supp-d3" viewBox="0 0 100 100" style={{ right: 255, top: 70, width: 64, height: 64, '--rot': '8deg' }}>
              <path d="M50,2 C56,36 64,44 98,50 C64,56 56,64 50,98 C44,64 36,56 2,50 C36,44 44,36 50,2Z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3.4" />
            </svg>
            <svg className="supp-spark supp-pop supp-d4" viewBox="0 0 100 100" style={{ right: 90, top: 760, width: 44, height: 44, '--rot': '-10deg' }}>
              <path d="M50,2 C56,36 64,44 98,50 C64,56 56,64 50,98 C44,64 36,56 2,50 C36,44 44,36 50,2Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3.4" />
            </svg>
          </React.Fragment>
        )}

        {showIndex && <div className="supp-idx">{indexNum} / <b>{indexTotal}</b></div>}
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
PageSupCover01.defaults = {
  backgroundTheme: 'primary',   // 'primary' (gradient) | 'muted' (lilac)
  mediaCount: 3,                // 0–3 collage photos
  showDecor: true,             // sparkles + arrow + handwritten note
  showIndex: true,             // bottom-right index badge
  eyebrow: 'TECH KEYNOTE',
  yearTag: '2026',
  headlineLine1: '智联万物',
  headlineHl: '重构',
  headlineTail: '体验',
  subtitle: '2026 全新产品体系发布暨技术路演',
  goldenLine: '以技术突破，定义下一代数字生活',
  handNote: 'NEXT-GEN DIGITAL LIFE',
  indexNum: '01',
  indexTotal: '03',
  photos: [
    { placeholder: '旗舰新品实拍', caption: '旗舰新品', capClass: 'supp-pink' },
    { placeholder: '发布会现场', caption: '技术路演', capClass: '' },
    { placeholder: '产品细节', caption: 'NEXT-GEN', capClass: 'supp-ink' },
  ],
};

// ── adjustable-parameter manifest (type / default / options / description) ───
PageSupCover01.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(渐变) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '右侧拼贴照片槽数量（0–3）' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与批注文案的显示/隐藏' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '页码角标', desc: '右下角 01 / 03 索引角标的显示/隐藏' },
];

export const defaults = PageSupCover01.defaults;
export const controls = PageSupCover01.controls;
