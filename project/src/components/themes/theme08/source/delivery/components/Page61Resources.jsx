// Page61Resources.jsx — "Statement · Resource Triad" template page (quote / low-density)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-q3-`.
// A single bold statement anchored top-left, a giant rotated backdrop word
// behind it, and a count-driven row of "resource pillars" (numbered cards with a
// doodle mark + title + one-line note) that can be focused to spotlight one.
// Three background themes (primary / muted / ink). Pure ESM, no Tweaks/runtime
// dependency — every visible variation is expressed through props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page61Resources(props) {
  const p = { ...Page61Resources.defaults, ...props };
  const {
    backgroundTheme, showPillars, pillarCount, showBackdrop, focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, quote, backdropWord, pillars, source,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 120% at 22% 6%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = pillars.slice(0, Math.max(2, pillarCount));
  const fIdx = Math.min(focusIndex, items.length - 1);
  const marks = ['heart', 'star', 'spark'];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)'];

  return (
    <div className={'acl-root acl-q3' + (isInk ? ' acl-q3--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-q3{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:84px 120px 70px; display:flex; flex-direction:column; }
        .acl-q3--ink{ color:var(--acl-paper); }
        .acl-q3__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; position:relative; z-index:2; }
        .acl-q3__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-q3--ink .acl-q3__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-q3__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-q3__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-q3--ink .acl-q3__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-q3__backdrop{ position:absolute; right:-30px; top:120px; font-family:var(--acl-font-num);
          font-size:430px; line-height:.74; letter-spacing:-.02em; color:var(--acl-ink); opacity:.05;
          z-index:0; pointer-events:none; white-space:nowrap; transform:rotate(-6deg); }
        .acl-q3--ink .acl-q3__backdrop{ color:var(--acl-yellow); opacity:.06; }

        .acl-q3__body{ flex:1; display:flex; flex-direction:column; justify-content:center;
          position:relative; z-index:1; }
        .acl-q3__label{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.06em; color:rgba(22,21,15,.55); margin-bottom:22px; }
        .acl-q3--ink .acl-q3__label{ color:rgba(251,250,244,.55); }
        .acl-q3__h{ font-weight:900; font-size:116px; line-height:1.2; letter-spacing:-.012em;
          margin:0; max-width:1500px; text-wrap:balance; }
        .acl-q3__h b{ font-weight:900; background:var(--acl-blue); color:var(--acl-ink);
          padding:0 .1em; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
        .acl-q3--ink .acl-q3__h b{ background:var(--acl-pink); color:var(--acl-paper); }

        .acl-q3__pillars{ display:flex; gap:26px; margin-top:54px; }
        .acl-q3__p{ flex:1 1 0; min-width:0; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:6px 8px 0 rgba(22,21,15,.16);
          padding:24px 26px 26px; display:flex; flex-direction:column; gap:12px;
          transition:opacity .25s, transform .25s, box-shadow .25s, background .25s; }
        .acl-q3--ink .acl-q3__p{ background:#211F18; border-color:var(--acl-paper); }
        .acl-q3__prow{ display:flex; align-items:center; gap:14px; }
        .acl-q3__pn{ font-family:var(--acl-font-num); font-size:42px; line-height:.8; }
        .acl-q3--ink .acl-q3__pn{ color:var(--acl-yellow); }
        .acl-q3__pmark{ margin-left:auto; }
        .acl-q3__pt{ font-weight:900; font-size:38px; line-height:1; }
        .acl-q3__pd{ font-weight:700; font-size:21px; line-height:1.42; color:rgba(22,21,15,.62); }
        .acl-q3--ink .acl-q3__pd{ color:rgba(251,250,244,.66); }
        .acl-q3__p--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateY(-8px) scale(1.015);
          box-shadow:9px 12px 0 rgba(22,21,15,.28); z-index:2; }
        .acl-q3--ink .acl-q3__p--focus{ background:var(--acl-yellow); color:var(--acl-ink); border-color:var(--acl-ink); }
        .acl-q3__p--focus .acl-q3__pd{ color:rgba(255,255,255,.8); }
        .acl-q3--ink .acl-q3__p--focus .acl-q3__pd{ color:rgba(22,21,15,.66); }
        .acl-q3__p--focus .acl-q3__pn{ color:var(--acl-yellow); }
        .acl-q3--ink .acl-q3__p--focus .acl-q3__pn{ color:var(--acl-ink); }
        .acl-q3__p--dim{ opacity:.5; }
        .acl-q3__pfx{ position:absolute; top:-17px; right:-12px; z-index:4; }

        .acl-q3__foot{ display:flex; align-items:center; gap:14px; flex:0 0 auto; position:relative; z-index:2;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em; color:rgba(22,21,15,.55); }
        .acl-q3--ink .acl-q3__foot{ color:rgba(251,250,244,.55); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-q3__h{ animation:acl-q3-in .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-q3__p{ animation:acl-q3-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .26s); }
        }
        @keyframes acl-q3-in{ from{ opacity:0; transform:translateY(26px); } to{ opacity:1; transform:none; } }
      `}</style>

      {showBackdrop && <div className="acl-q3__backdrop" aria-hidden="true">{backdropWord}</div>}

      <div className="acl-q3__top">
        <div className="acl-q3__eyebrow">{eyebrow}</div>
        <div className="acl-q3__rule" />
        <div className="acl-q3__kicker">{kicker}</div>
      </div>

      <div className="acl-q3__body">
        <div className="acl-q3__label">{headline}</div>
        <h1 className="acl-q3__h" dangerouslySetInnerHTML={{ __html: quote }} />

        {showPillars && (
          <div className="acl-q3__pillars">
            {items.map((pl, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              return (
                <div key={i} className={'acl-q3__p' + (isF ? ' acl-q3__p--focus' : '') + (dim ? ' acl-q3__p--dim' : '')} style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-q3__pfx"><Sticker label="主战场" color="var(--acl-yellow)" rotate={7} size={13} /></div>}
                  <div className="acl-q3__prow">
                    <span className="acl-q3__pn">{String(i + 1).padStart(2, '0')}</span>
                    {showDecor && <span className="acl-q3__pmark"><Doodle kind={marks[i % marks.length]} size={42} rotate={i % 2 ? 8 : -8}
                      fill={isF ? 'var(--acl-yellow)' : accents[i % accents.length]} stroke="var(--acl-ink)" style={{ position: 'static' }} /></span>}
                  </div>
                  <div className="acl-q3__pt">{pl.title}</div>
                  <div className="acl-q3__pd">{pl.note}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="acl-q3__foot">
        {showDecor && <Doodle kind="loop" size={50} style={{ position: 'static' }} />}
        <span>{source}</span>
        {showDecor && !isInk && <Sticker label="核心判断" color="var(--acl-blue)" rotate={-4} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page61Resources.defaults = {
  backgroundTheme: 'ink',
  showPillars: true,
  pillarCount: 3,          // 2–3 resource pillars
  showBackdrop: true,
  focusEnabled: true,
  focusIndex: 2,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Talent · Capital · Compute',
  kicker: '金句页',
  headline: '三类关键资源 · 人才 / 资本 / 算力',
  quote: 'AI 竞争，首先是一场 <b>资源组织能力</b> 的竞争。',
  backdropWord: 'RESOURCE',
  pillars: [
    { title: '人才', note: '顶级研究员与工程团队，决定模型上限与迭代速度。' },
    { title: '资本', note: '长期、深口袋的资金，支撑漫长的训练与商业化周期。' },
    { title: '算力', note: 'GPU 与云资源的稳定供给，是一切训练与推理的底座。' },
  ],
  source: '数据口径：2024 全年 · 单笔 ≥1 亿美元 · AI CAPITAL LAB',
};

Page61Resources.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'ink', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差金句)' },
  { key: 'showPillars', type: 'boolean', default: true,
    label: '要素卡', desc: '底部资源要素卡的显示/隐藏' },
  { key: 'pillarCount', type: 'number', default: 3, min: 2, max: 3, step: 1, showIf: 'showPillars',
    label: '要素数量', desc: '资源要素卡数量(2–3)' },
  { key: 'showBackdrop', type: 'boolean', default: true,
    label: '背景大字', desc: '倾斜大号背景装饰字的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一张要素卡' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, maxFrom: 'pillarCount', step: 1,
    label: '重点对象', desc: '被突出的要素卡序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘火花与贴纸标签的显示/隐藏' },
];

export const defaults = Page61Resources.defaults;
export const controls = Page61Resources.controls;
