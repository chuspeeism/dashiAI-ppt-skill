// Page15Chapter.jsx — "Chapter Divider" template page (section breather)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cp-`.
// A big chapter index, the chapter title + subtitle, and a row of keyword chips.
// Count-driven keywords, toggleable giant index, three background themes.
// No Tweaks dependency — portable ESM, all CSS class-prefixed and scoped.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page15Chapter(props) {
  const p = { ...Page15Chapter.defaults, ...props };
  const {
    backgroundTheme, showIndex, keywordCount, showDecor,
    eyebrow, indexLabel, headline, subheadline, keywords, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(130% 130% at 16% 12%, #2A2820 0%, #16150F 62%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const chips = keywords.slice(0, Math.max(0, keywordCount));
  const chipColors = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)', 'var(--acl-paper)', 'var(--acl-blue)'];

  return (
    <div className={'acl-root acl-cp' + (isInk ? ' acl-cp--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-cp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:92px 110px 84px; display:flex; flex-direction:column;
          justify-content:center; }
        .acl-cp--ink{ color:var(--acl-paper); }
        .acl-cp__ghost{ position:absolute; right:-30px; bottom:-160px; font-family:var(--acl-font-num);
          font-size:760px; line-height:.7; color:var(--acl-ink); opacity:.07; z-index:0;
          pointer-events:none; user-select:none; }
        .acl-cp--ink .acl-cp__ghost{ color:var(--acl-yellow); opacity:.1; }

        .acl-cp__inner{ position:relative; z-index:1; }
        .acl-cp__eyebrow{ display:inline-flex; align-items:center; gap:14px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:26px; letter-spacing:.18em;
          text-transform:uppercase; color:var(--acl-ink); background:var(--acl-yellow);
          padding:9px 18px; transform:rotate(-1.6deg); box-shadow:3px 4px 0 rgba(22,21,15,.2); }
        .acl-cp--ink .acl-cp__eyebrow{ background:var(--acl-yellow); }
        .acl-cp__numrow{ display:flex; align-items:flex-start; gap:42px; margin-top:26px; }
        .acl-cp__index{ font-family:var(--acl-font-num); font-size:300px; line-height:.74;
          flex:0 0 auto; letter-spacing:-.02em; }
        .acl-cp--ink .acl-cp__index{ color:var(--acl-yellow); }
        .acl-cp__titles{ display:flex; flex-direction:column; justify-content:center; padding-top:18px; }
        .acl-cp__h{ font-weight:900; font-size:118px; line-height:.94; margin:0; letter-spacing:-.01em; }
        .acl-cp__sub{ font-family:var(--acl-font-hand); font-size:46px; margin-top:14px;
          color:var(--acl-ink); }
        .acl-cp--ink .acl-cp__sub{ color:var(--acl-paper); }
        .acl-cp__noindex .acl-cp__h{ font-size:148px; }

        .acl-cp__chips{ display:flex; flex-wrap:wrap; gap:16px; margin-top:46px; align-items:center; }
        .acl-cp__chip{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.02em; padding:12px 22px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); color:var(--acl-ink); box-shadow:3px 4px 0 rgba(22,21,15,.18); }
        .acl-cp__chip:nth-child(3n+1){ transform:rotate(-1.8deg); }
        .acl-cp__chip:nth-child(3n+2){ transform:rotate(1.5deg); }
        .acl-cp--ink .acl-cp__chip{ border-color:var(--acl-paper); }

        .acl-cp__foot{ position:absolute; left:110px; bottom:64px; z-index:1; display:flex;
          align-items:center; gap:14px; font-family:var(--acl-font-hand); font-size:30px; }
        .acl-cp--ink .acl-cp__foot{ color:var(--acl-paper); }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cp__index{ animation:acl-cp-pop .6s cubic-bezier(.2,.9,.3,1.2) both; }
          [data-deck-active] .acl-cp__h{ animation:acl-cp-in .55s cubic-bezier(.2,.8,.2,1) both; animation-delay:.08s; }
          [data-deck-active] .acl-cp__chip{ animation:acl-cp-in .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .3s); }
        }
        @keyframes acl-cp-pop{ from{ opacity:0; transform:translateY(30px) scale(.92); } to{ opacity:1; transform:none; } }
        @keyframes acl-cp-in{ from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:none; } }
      `}</style>

      {showIndex && <div className="acl-cp__ghost" aria-hidden="true">{indexLabel}</div>}

      <div className={'acl-cp__inner' + (showIndex ? '' : ' acl-cp__noindex')}>
        <div className="acl-cp__eyebrow">
          {eyebrow}
          {showDecor && <Doodle kind="spark" size={26} fill="var(--acl-ink)" style={{ position: 'static' }} />}
        </div>
        <div className="acl-cp__numrow">
          {showIndex && <div className="acl-cp__index">{indexLabel}</div>}
          <div className="acl-cp__titles">
            <h1 className="acl-cp__h">{headline}</h1>
            <div className="acl-cp__sub">{subheadline}</div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="acl-cp__chips">
            {showDecor && <Doodle kind="arrowS" size={56} rotate={4} style={{ position: 'static', marginRight: 4 }} />}
            {chips.map((k, i) => (
              <span key={i} className="acl-cp__chip" style={{ '--i': i,
                background: i === 0 ? chipColors[0] : undefined,
                color: i === 0 ? 'var(--acl-paper)' : undefined,
                borderColor: i === 0 ? 'var(--acl-ink)' : undefined }}>{k}</span>
            ))}
          </div>
        )}
      </div>

      <div className="acl-cp__foot">
        {showDecor && <Sticker label="CHAPTER" sub={indexLabel} color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={-3} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page15Chapter.defaults = {
  backgroundTheme: 'muted',
  showIndex: true,
  keywordCount: 4,         // 0–6 keyword chips
  showDecor: true,
  eyebrow: 'Chapter 02',
  indexLabel: '02',
  headline: '市场数据深拆',
  subheadline: '融资节奏、集中度与交易规模',
  keywords: ['集中度', '季度节奏', '峰谷对比', '资金贡献', '金额区间', '累计曲线'],
  closingLine: '下一组页面进入更细的拆解。',
};

Page15Chapter.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差章节页)' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '大章节号', desc: '巨型章节编号(及背景幽灵数字)的显示/隐藏' },
  { key: 'keywordCount', type: 'number', default: 4, min: 0, max: 6, step: 1,
    label: '关键词数量', desc: '本章关键词标签的数量(0–6)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page15Chapter.defaults;
export const controls = Page15Chapter.controls;
