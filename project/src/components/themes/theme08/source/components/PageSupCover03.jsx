// PageSupCover03.jsx — Supplementary cover · 新机遇 新赛道 新价值 (business plan)
// ─────────────────────────────────────────────────────────────────────────────
// Prop-driven, editable template page. Text → `defaults`, params → `controls`.
// Left headline stack + right photo accents. All classes prefixed `supp-`.
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
  .supp-hl.supp-pink > span{color:var(--paper);}
  .supp-tag{display:inline-flex;align-items:center;gap:8px;font-family:'Noto Sans SC',sans-serif;
    font-weight:900;font-size:21px;letter-spacing:.02em;color:var(--ink);
    background:var(--yellow);padding:8px 16px;border-radius:7px;
    box-shadow:3px 4px 0 rgba(0,0,0,.16);white-space:nowrap;}
  .supp-tag.supp-pink{background:var(--pink);color:var(--paper);}
  .supp-tag .supp-star{color:var(--ink);}
  .supp-tag.supp-pink .supp-star{color:var(--paper);}
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
  }
  @keyframes supp-cover-rise{from{opacity:0;transform:translateY(26px);}to{opacity:1;transform:none;}}
  @keyframes supp-cover-pop{from{opacity:0;transform:scale(.7) rotate(var(--rot,0deg));}}
`;

export default function PageSupCover03(props) {
  const p = { ...PageSupCover03.defaults, ...props };
  const {
    backgroundTheme, mediaCount, showDecor, showIndex,
    eyebrow, tag, terms, sloganLine1, sloganLine2, standoutTag, handNote,
    indexNum, indexTotal, photos,
  } = p;

  const bg = backgroundTheme === 'primary' ? 'var(--yellow)' : 'var(--lilac)';

  return (
    <div className="supp-cover-root" style={{ position: 'absolute', inset: 0 }}>
      <style>{CSS}</style>
      <div className="supp-cover" style={{ background: bg }} data-screen-label="封面03 新机遇 新赛道 新价值">

        {/* top kicker */}
        <div className="supp-anim" style={{ position: 'absolute', left: 120, top: 92, display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="supp-en" style={{ fontSize: 24 }}>{eyebrow}</span>
          <span style={{ width: 48, height: 3, background: 'var(--ink)', display: 'inline-block' }} />
          <span className="supp-tag">{tag}</span>
        </div>

        {/* three terms row */}
        <div className="supp-h supp-anim supp-d1" style={{ position: 'absolute', left: 120, top: 188, fontSize: 62, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span className="supp-hl"><span>{terms[0]}</span></span><span style={{ opacity: .4 }}>·</span>
          <span className="supp-hl supp-pink"><span>{terms[1]}</span></span><span style={{ opacity: .4 }}>·</span>
          <span className="supp-hl supp-blue"><span>{terms[2]}</span></span>
        </div>

        {/* BIG slogan */}
        <h1 className="supp-h supp-anim supp-d2" style={{ position: 'absolute', left: 114, top: 330, fontSize: 158 }}>
          <span>{sloganLine1}</span><br /><span>{sloganLine2}</span>
        </h1>

        {/* standout tag */}
        <div className="supp-anim supp-d3" style={{ position: 'absolute', left: 122, top: 728, display: 'flex', alignItems: 'center', gap: 22 }}>
          <span className="supp-tag supp-pink" style={{ fontSize: 27, padding: '13px 26px' }}><span className="supp-star">★</span>{standoutTag}</span>
          {showDecor && <span className="supp-hand" style={{ fontSize: 30, transform: 'rotate(-3deg)' }}>{handNote}</span>}
        </div>

        {/* scattered photo accents */}
        {mediaCount > 0 && (
          <div className="supp-photo supp-pop supp-d2" style={{ right: 140, top: 150, width: 330, transform: 'rotate(4deg)', '--rot': '4deg' }}>
            <image-slot id="c3-p1" style={{ width: 306, height: 230 }} shape="rect" placeholder={photos[0].placeholder}></image-slot>
            <span className={'supp-cap ' + photos[0].capClass}>{photos[0].caption}</span>
          </div>
        )}
        {mediaCount > 1 && (
          <div className="supp-photo supp-pop supp-d3" style={{ right: 108, top: 470, width: 280, transform: 'rotate(-5deg)', '--rot': '-5deg' }}>
            <image-slot id="c3-p2" style={{ width: 256, height: 300 }} shape="rect" placeholder={photos[1].placeholder}></image-slot>
            <span className={'supp-cap ' + photos[1].capClass}>{photos[1].caption}</span>
          </div>
        )}

        {/* hand-drawn decor */}
        {showDecor && (
          <React.Fragment>
            <svg className="supp-arrow supp-anim supp-d3" viewBox="0 0 120 90" style={{ right: 430, top: 690, width: 120, height: 90, transform: 'rotate(-8deg)' }}>
              <path d="M110,14 C70,4 18,24 12,66" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M12,66 L26,58 M12,66 L18,50" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
            <svg className="supp-spark supp-pop supp-d3" viewBox="0 0 100 100" style={{ right: 470, top: 120, width: 54, height: 54, '--rot': '9deg' }}>
              <path d="M50,2 C56,36 64,44 98,50 C64,56 56,64 50,98 C44,64 36,56 2,50 C36,44 44,36 50,2Z" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="3.4" />
            </svg>
          </React.Fragment>
        )}

        {showIndex && <div className="supp-idx">{indexNum} / <b>{indexTotal}</b></div>}
      </div>
    </div>
  );
}

PageSupCover03.defaults = {
  backgroundTheme: 'muted',     // 'primary' (yellow) | 'muted' (lilac, as designed)
  mediaCount: 2,                // 0–2 photo accents
  showDecor: true,             // arrow + sparkle + handwritten note
  showIndex: true,             // bottom-right index badge
  eyebrow: 'BUSINESS PLAN',
  tag: 'XX 金融项目',
  terms: ['新机遇', '新赛道', '新价值'],
  sloganLine1: '精准布局',
  sloganLine2: '与时代红利同行',
  standoutTag: '面向机构投资人专属方案',
  handNote: 'for investors',
  indexNum: '03',
  indexTotal: '03',
  photos: [
    { placeholder: '团队 / 路演', caption: '核心团队', capClass: 'supp-pink' },
    { placeholder: '市场 / 数据', caption: '市场洞察', capClass: 'supp-ink' },
  ],
};

PageSupCover03.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰，默认) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 2, step: 1,
    label: '图片数量', desc: '右侧照片点缀数量（0–2）' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与批注文案的显示/隐藏' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '页码角标', desc: '右下角 03 / 03 索引角标的显示/隐藏' },
];

export const defaults = PageSupCover03.defaults;
export const controls = PageSupCover03.controls;
