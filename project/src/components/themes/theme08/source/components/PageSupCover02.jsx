// PageSupCover02.jsx — Supplementary cover · 深耕教学 聚力成长 (year-end review)
// ─────────────────────────────────────────────────────────────────────────────
// Prop-driven, editable template page. Text → `defaults`, params → `controls`.
// Centered headline layout, no photo collage. All classes prefixed `supp-`.
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
  .supp-hand{font-family:'Caveat',cursive;font-weight:700;}
  .supp-kicker{font-family:'Noto Sans SC',sans-serif;font-weight:700;letter-spacing:.34em;
    font-size:22px;text-transform:none;}
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
  .supp-tag.supp-ink{background:var(--ink);color:var(--paper);}
  .supp-tag .supp-star{color:var(--ink);}
  .supp-tag.supp-ink .supp-star{color:var(--yellow);}
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

export default function PageSupCover02(props) {
  const p = { ...PageSupCover02.defaults, ...props };
  const {
    backgroundTheme, showDecor, showIndex,
    kicker, headlineL1Pre, headlineHl1, headlineL2Pre, headlineHl2,
    subtitle, tags, handNoteTL, handNoteTR, handNoteBL, indexNum, indexTotal,
  } = p;

  const bg = backgroundTheme === 'muted' ? 'var(--lilac)' : 'var(--yellow)';

  return (
    <div className="supp-cover-root" style={{ position: 'absolute', inset: 0 }}>
      <style>{CSS}</style>
      <div className="supp-cover" style={{ background: bg }} data-screen-label="封面02 深耕教学 聚力成长">

        {/* corner annotations */}
        {showDecor && (
          <React.Fragment>
            <span className="supp-hand supp-anim" style={{ position: 'absolute', left: 150, top: 120, fontSize: 34, transform: 'rotate(-5deg)' }}>{handNoteTL}</span>
            <svg className="supp-arrow" viewBox="0 0 110 80" style={{ left: 150, top: 170, width: 110, height: 80, transform: 'rotate(-2deg)' }}>
              <path d="M12,8 C20,40 50,58 96,60" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
              <path d="M96,60 L80,58 M96,60 L86,46" fill="none" stroke="var(--ink)" strokeWidth="3.4" strokeLinecap="round" />
            </svg>
            <span className="supp-hand supp-anim supp-d1" style={{ position: 'absolute', right: 160, top: 128, fontSize: 34, transform: 'rotate(4deg)' }}>{handNoteTR}</span>
          </React.Fragment>
        )}

        {/* centered headline */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span className="supp-kicker supp-anim" style={{ marginBottom: 26 }}>{kicker}</span>
          <h1 className="supp-h supp-anim supp-d1" style={{ fontSize: 206 }}>
            <span>{headlineL1Pre}</span><span className="supp-hl supp-pink"><span>{headlineHl1}</span></span><br />
            <span>{headlineL2Pre}</span><span className="supp-hl supp-blue"><span>{headlineHl2}</span></span>
          </h1>
          <p className="supp-anim supp-d2" style={{ marginTop: 40, fontSize: 36, fontWeight: 700, letterSpacing: '.03em' }}>{subtitle}</p>
          <div className="supp-anim supp-d3" style={{ marginTop: 34, display: 'flex', gap: 18 }}>
            <span className="supp-tag supp-ink"><span className="supp-star">✦</span>{tags[0]}</span>
            <span className="supp-tag supp-ink"><span className="supp-star">✦</span>{tags[1]}</span>
          </div>
        </div>

        {/* sparkles + bottom note */}
        {showDecor && (
          <React.Fragment>
            <svg className="supp-spark supp-pop supp-d2" viewBox="0 0 100 100" style={{ left: 420, top: 430, width: 58, height: 58, '--rot': '-8deg' }}>
              <path d="M50,2 C56,36 64,44 98,50 C64,56 56,64 50,98 C44,64 36,56 2,50 C36,44 44,36 50,2Z" fill="var(--pink)" stroke="var(--ink)" strokeWidth="3.4" />
            </svg>
            <svg className="supp-spark supp-pop supp-d3" viewBox="0 0 100 100" style={{ right: 430, top: 600, width: 50, height: 50, '--rot': '10deg' }}>
              <path d="M50,2 C56,36 64,44 98,50 C64,56 56,64 50,98 C44,64 36,56 2,50 C36,44 44,36 50,2Z" fill="var(--blue)" stroke="var(--ink)" strokeWidth="3.4" />
            </svg>
            <span className="supp-hand supp-anim supp-d3" style={{ position: 'absolute', left: 210, bottom: 150, fontSize: 30, transform: 'rotate(-3deg)' }}>{handNoteBL}</span>
          </React.Fragment>
        )}

        {showIndex && <div className="supp-idx">{indexNum} / <b>{indexTotal}</b></div>}
      </div>
    </div>
  );
}

PageSupCover02.defaults = {
  backgroundTheme: 'primary',   // 'primary' (yellow) | 'muted' (lilac)
  showDecor: true,             // corner notes + arrow + sparkles
  showIndex: true,             // bottom-right index badge
  kicker: '2025—2026 学年工作总结',
  headlineL1Pre: '深耕',
  headlineHl1: '教学',
  headlineL2Pre: '聚力',
  headlineHl2: '成长',
  subtitle: '全域工作复盘 & 6 大提升行动规划',
  tags: ['夯实教学根基', '拓宽育人边界'],
  handNoteTL: '复盘 · review',
  handNoteTR: '规划 2026 →',
  handNoteBL: 'GROW TOGETHER',
  indexNum: '02',
  indexTotal: '03',
};

PageSupCover02.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '四角批注、手绘箭头与火花的显示/隐藏' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '页码角标', desc: '右下角 02 / 03 索引角标的显示/隐藏' },
];

export const defaults = PageSupCover02.defaults;
export const controls = PageSupCover02.controls;
