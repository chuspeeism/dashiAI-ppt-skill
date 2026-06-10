// Page26Chapter.jsx — "Chapter Divider" template page (section breather · split layout)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cx-`.
// A bolder alternative chapter divider: a colored side panel carries a giant
// vertical chapter number + eyebrow; the main area stacks the title and a
// count-driven numbered keyword list. Toggleable giant index, three themes.
// No Tweaks dependency — portable ESM, all CSS class-prefixed and scoped.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page26Chapter(props) {
  const p = { ...Page26Chapter.defaults, ...props };
  const {
    backgroundTheme, showIndex, keywordCount, showDecor,
    eyebrow, indexLabel, headline, subheadline, keywords, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(130% 130% at 82% 18%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const chips = keywords.slice(0, Math.max(0, keywordCount));
  const panelBg = isInk ? 'var(--acl-yellow)' : 'var(--acl-ink)';
  const panelFg = isInk ? 'var(--acl-ink)' : 'var(--acl-paper)';

  return (
    <div className={'acl-root acl-cx' + (isInk ? ' acl-cx--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-cx{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); display:flex; }
        .acl-cx--ink{ color:var(--acl-paper); }

        /* ── left color panel with giant vertical index ── */
        .acl-cx__rail{ flex:0 0 ${showIndex ? '430px' : '120px'}; position:relative; overflow:hidden;
          background:${panelBg}; color:${panelFg}; display:flex; flex-direction:column;
          justify-content:space-between; padding:74px 0 60px; transition:flex-basis .3s; }
        .acl-cx__railtop{ writing-mode:vertical-rl; transform:rotate(180deg); margin:0 auto;
          font-family:var(--acl-font-mono); font-weight:700; font-size:24px; letter-spacing:.34em;
          text-transform:uppercase; }
        .acl-cx__index{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          font-family:var(--acl-font-num); font-size:560px; line-height:.7; letter-spacing:-.04em;
          opacity:${isInk ? '1' : '.96'}; }
        .acl-cx__railfoot{ position:relative; z-index:2; margin:0 auto; }

        /* ── main area ── */
        .acl-cx__main{ flex:1; position:relative; padding:92px 110px 84px 90px; display:flex;
          flex-direction:column; justify-content:center; min-width:0; }
        .acl-cx__eyebrow{ display:inline-flex; align-self:flex-start; align-items:center; gap:14px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:26px; letter-spacing:.18em;
          text-transform:uppercase; color:var(--acl-ink); background:var(--acl-yellow);
          padding:9px 18px; transform:rotate(-1.4deg); box-shadow:3px 4px 0 rgba(22,21,15,.2); }
        .acl-cx__h{ font-weight:900; font-size:128px; line-height:.92; margin:24px 0 0;
          letter-spacing:-.012em; }
        .acl-cx__sub{ font-family:var(--acl-font-hand); font-size:48px; margin-top:16px; }
        .acl-cx--ink .acl-cx__sub{ color:var(--acl-paper); }

        .acl-cx__list{ display:flex; flex-direction:column; margin-top:48px; max-width:1020px;
          border-top:2px solid rgba(22,21,15,.18); }
        .acl-cx--ink .acl-cx__list{ border-top-color:rgba(251,250,244,.22); }
        .acl-cx__item{ display:flex; align-items:center; gap:24px; padding:15px 4px;
          border-bottom:2px solid rgba(22,21,15,.18); }
        .acl-cx--ink .acl-cx__item{ border-bottom-color:rgba(251,250,244,.22); }
        .acl-cx__no{ font-family:var(--acl-font-num); font-size:40px; line-height:.8; flex:0 0 70px;
          color:var(--acl-ink); opacity:.32; }
        .acl-cx--ink .acl-cx__no{ color:var(--acl-yellow); opacity:.9; }
        .acl-cx__kw{ font-weight:900; font-size:38px; letter-spacing:-.01em; }
        .acl-cx__dot{ margin-left:auto; width:16px; height:16px; flex:0 0 auto; }
        .acl-cx__item:first-child .acl-cx__no{ opacity:1; color:var(--acl-pink); }
        .acl-cx__item:first-child .acl-cx__kw{ position:relative; }

        .acl-cx__foot{ position:absolute; left:90px; bottom:50px; display:flex; align-items:center;
          gap:14px; font-family:var(--acl-font-hand); font-size:30px; }
        .acl-cx--ink .acl-cx__foot{ color:var(--acl-paper); }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cx__index{ animation:acl-cx-pop .65s cubic-bezier(.2,.9,.3,1.15) both; }
          [data-deck-active] .acl-cx__h{ animation:acl-cx-in .55s cubic-bezier(.2,.8,.2,1) both; animation-delay:.1s; }
          [data-deck-active] .acl-cx__item{ animation:acl-cx-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .32s); }
        }
        @keyframes acl-cx-pop{ from{ opacity:0; transform:translate(-50%,-46%) scale(.9); } to{ opacity:.96; } }
        @keyframes acl-cx-in{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-cx__rail">
        <div className="acl-cx__railtop">{eyebrow}</div>
        {showIndex && <div className="acl-cx__index" aria-hidden="true">{indexLabel}</div>}
        <div className="acl-cx__railfoot">
          {showDecor && <Doodle kind="spark" size={40} fill={isInk ? 'var(--acl-ink)' : 'var(--acl-yellow)'} stroke={isInk ? 'none' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        </div>
      </div>

      <div className="acl-cx__main">
        <div className="acl-cx__eyebrow">
          {eyebrow}
          {showDecor && <Doodle kind="spark" size={26} fill="var(--acl-ink)" style={{ position: 'static' }} />}
        </div>
        <h1 className="acl-cx__h">{headline}</h1>
        <div className="acl-cx__sub">{subheadline}</div>

        {chips.length > 0 && (
          <div className="acl-cx__list">
            {chips.map((k, i) => (
              <div key={i} className="acl-cx__item" style={{ '--i': i }}>
                <span className="acl-cx__no">{String(i + 1).padStart(2, '0')}</span>
                <span className="acl-cx__kw">{k}</span>
                {showDecor && (
                  <Doodle kind={i === 0 ? 'heart' : 'spark'} size={i === 0 ? 26 : 22}
                    className="acl-cx__dot"
                    fill={i === 0 ? 'var(--acl-pink)' : 'var(--acl-yellow)'} stroke="var(--acl-ink)"
                    style={{ position: 'static', marginLeft: 'auto' }} />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="acl-cx__foot">
          {showDecor && <Sticker label="CHAPTER" sub={indexLabel} color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={-3} />}
          <span>{closingLine}</span>
        </div>
      </div>
    </div>
  );
}

Page26Chapter.defaults = {
  backgroundTheme: 'primary',
  showIndex: true,
  keywordCount: 4,         // 0–6 keyword rows
  showDecor: true,
  eyebrow: 'Chapter 03',
  indexLabel: '03',
  headline: '赛道结构细分',
  subheadline: '从大模型到垂直应用',
  keywords: ['通用模型', 'Agent', '企业搜索', '医疗 · 金融', '开发者工具', '安全对齐'],
  closingLine: '下一组页面进入更细的拆解。',
};

Page26Chapter.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差章节页)' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '大章节号', desc: '侧栏巨型章节编号的显示/隐藏' },
  { key: 'keywordCount', type: 'number', default: 4, min: 0, max: 6, step: 1,
    label: '关键词数量', desc: '本章关键词行的数量(0–6)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page26Chapter.defaults;
export const controls = Page26Chapter.controls;
