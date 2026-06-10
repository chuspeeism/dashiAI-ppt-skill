// Page49Chapter.jsx — "Chapter Divider" template page (marquee + keyword filmstrip)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-c4-`.
// A THIRD, distinct chapter-divider layout (different from P15 full-bleed ghost
// number and P26 side-rail vertical index): a left-aligned giant headline with a
// huge OUTLINE stencil index bleeding off the right, and the chapter keywords laid
// out as a horizontal "filmstrip" of numbered ticket tiles with a focusable tile.
// Three themes (primary / muted / ink). Fully portable — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page49Chapter(props) {
  const p = { ...Page49Chapter.defaults, ...props };
  const {
    backgroundTheme, showIndex, keywordCount, focusEnabled, focusIndex, showDecor,
    eyebrow, indexLabel, headlineLines, subheadline, keywords, kicker, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(130% 130% at 84% 16%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const chips = keywords.slice(0, Math.max(0, keywordCount));
  const fIdx = Math.min(focusIndex, Math.max(0, chips.length - 1));
  const ghostFill = isInk ? 'rgba(236,239,53,.12)' : 'rgba(22,21,15,.07)';

  return (
    <div className={'acl-root acl-c4' + (isInk ? ' acl-c4--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-c4{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:88px 100px 80px; display:flex; flex-direction:column; }
        .acl-c4--ink{ color:var(--acl-paper); }

        /* giant solid-tint stencil index, bleeding off the right edge */
        .acl-c4__ghost{ position:absolute; right:-36px; top:50%; transform:translateY(-52%);
          font-family:var(--acl-font-num); font-size:660px; line-height:.62; letter-spacing:-.04em;
          color:${ghostFill}; z-index:0; pointer-events:none; }

        .acl-c4__head{ position:relative; z-index:2; display:flex; align-items:center; gap:20px; }
        .acl-c4__eyebrow{ display:inline-flex; align-items:center; gap:14px; font-family:var(--acl-font-mono);
          font-weight:700; font-size:25px; letter-spacing:.18em; text-transform:uppercase;
          color:var(--acl-ink); background:var(--acl-yellow); padding:10px 18px; transform:rotate(-1.4deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); }
        .acl-c4__kicker{ font-family:var(--acl-font-cn); font-weight:700; font-size:30px; line-height:1.1;
          opacity:.9; color:rgba(22,21,15,.72); }
        .acl-c4--ink .acl-c4__kicker{ color:rgba(251,250,244,.7); }

        .acl-c4__mid{ position:relative; z-index:2; flex:1; display:flex; flex-direction:column;
          justify-content:center; }
        .acl-c4__h{ font-weight:900; font-size:120px; line-height:1.42; letter-spacing:-.018em; margin:0; }
        .acl-c4__h .mk{ display:inline-block; line-height:1; background:var(--acl-pink); color:var(--acl-ink);
          padding:.04em .1em; transform:rotate(-1deg); margin-top:.12em; }
        .acl-c4__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:26px; letter-spacing:.04em;
          text-transform:uppercase; margin-top:24px; color:rgba(22,21,15,.6); }
        .acl-c4--ink .acl-c4__sub{ color:var(--acl-yellow); }

        /* keyword filmstrip */
        .acl-c4__strip{ position:relative; z-index:2; display:flex; gap:18px; flex-wrap:wrap; margin-top:6px; }
        .acl-c4__tile{ position:relative; display:flex; align-items:center; gap:16px; padding:16px 26px 16px 20px;
          background:var(--acl-paper); border:3px solid var(--acl-ink); box-shadow:5px 6px 0 rgba(22,21,15,.18);
          transition:transform .25s, background .25s, color .25s; }
        .acl-c4__tile .no{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; color:var(--acl-pink); }
        .acl-c4__tile .kw{ font-weight:900; font-size:34px; line-height:1; letter-spacing:-.01em; color:var(--acl-ink); }
        .acl-c4__tile--focus{ background:var(--acl-ink); transform:rotate(-2deg) translateY(-4px); }
        .acl-c4__tile--focus .kw{ color:var(--acl-paper); }
        .acl-c4__tile--focus .no{ color:var(--acl-yellow); }
        .acl-c4--ink .acl-c4__tile--focus{ background:var(--acl-yellow); }
        .acl-c4--ink .acl-c4__tile--focus .kw{ color:var(--acl-ink); }
        .acl-c4--ink .acl-c4__tile--focus .no{ color:var(--acl-pink); }
        .acl-c4__tfx{ position:absolute; right:-16px; top:-22px; z-index:4; }

        .acl-c4__foot{ position:relative; z-index:2; display:flex; align-items:center; gap:16px;
          font-family:var(--acl-font-cn); font-weight:600; font-size:26px; margin-top:42px; color:rgba(22,21,15,.7); }
        .acl-c4--ink .acl-c4__foot{ color:var(--acl-paper); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-c4__ghost{ animation:acl-c4-ghost .7s cubic-bezier(.2,.9,.3,1.1) both; }
          [data-deck-active] .acl-c4__h{ animation:acl-c4-in .55s cubic-bezier(.2,.8,.2,1) both; animation-delay:.08s; }
          [data-deck-active] .acl-c4__tile{ animation:acl-c4-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .3s); }
        }
        @keyframes acl-c4-ghost{ from{ opacity:0; transform:translate(40px,-52%); } to{ opacity:1; } }
        @keyframes acl-c4-in{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:none; } }
      `}</style>

      {showIndex && <div className="acl-c4__ghost" aria-hidden="true">{indexLabel}</div>}

      <div className="acl-c4__head">
        <div className="acl-c4__eyebrow">
          {eyebrow}
          {showDecor && <Doodle kind="spark" size={24} fill="var(--acl-ink)" style={{ position: 'static' }} />}
        </div>
        <span className="acl-c4__kicker">{kicker}</span>
      </div>

      <div className="acl-c4__mid">
        <h1 className="acl-c4__h">
          {headlineLines[0]}<br />
          <span className="mk">{headlineLines[1]}</span>
        </h1>
        <div className="acl-c4__sub">{subheadline}</div>
      </div>

      {chips.length > 0 && (
        <div className="acl-c4__strip">
          {chips.map((k, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-c4__tile' + (isF ? ' acl-c4__tile--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-c4__tfx"><Sticker label="本章重点" color="var(--acl-yellow)" rotate={6} /></div>}
                <span className="no">{String(i + 1).padStart(2, '0')}</span>
                <span className="kw">{k}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="acl-c4__foot">
        {showDecor && <Doodle kind="loop" size={58} color={isInk ? 'var(--acl-yellow)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page49Chapter.defaults = {
  // adjustable params
  backgroundTheme: 'ink',     // 'primary' | 'muted' | 'ink'
  showIndex: true,            // giant outline stencil index
  keywordCount: 6,            // 0–6 keyword tiles
  focusEnabled: true,         // highlight one keyword tile
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Chapter 04',
  indexLabel: '04',
  headlineLines: ['资本与', '地区结构'],
  subheadline: '轮次、投资人和地理集群',
  kicker: '钱从哪来，又流向哪里',
  keywords: ['后期轮', '战略投资', '云资源', '湾区', '纽约', '西雅图'],
  closingLine: '下一组页面进入更细的拆解。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page49Chapter.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'ink', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差章节页)' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '大章节号', desc: '右侧巨型描边章节编号的显示/隐藏' },
  { key: 'keywordCount', type: 'number', default: 6, min: 0, max: 6, step: 1,
    label: '关键词数量', desc: '本章关键词胶片格的数量(0–6)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个关键词格' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'keywordCount', step: 1,
    label: '重点对象', desc: '被高亮的关键词序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page49Chapter.defaults;
export const controls = Page49Chapter.controls;
