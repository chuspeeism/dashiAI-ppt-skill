// Page89Chapter.jsx — "Chapter Divider · Diagonal Split" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cd-`.
// A FIFTH chapter layout, distinct from P15 (index+chips row), P26/P49/P72:
// the frame is split by a hard DIAGONAL seam into two colour fields; a giant
// chapter number straddles the seam (its halves reading against opposite
// backgrounds), with the title block on the lower field and keyword chips along
// the base. Solid/outline number, three themes, count-driven focusable chips.
// Pure ESM — every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page89Chapter(props) {
  const p = { ...Page89Chapter.defaults, ...props };
  const {
    backgroundTheme, numberStyle, showIndex, keywordCount, focusEnabled, focusIndex, showDecor,
    eyebrow, indexLabel, headline, subheadline, keywords, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  // lower-field base color
  const bg = isInk ? '#100F0A'
    : backgroundTheme === 'muted' ? '#E7E6EE'
      : '#ECEF35';
  // upper diagonal wedge color (contrasts the base)
  const wedge = isInk ? '#2A2820' : backgroundTheme === 'muted' ? '#16150F' : '#16150F';
  const wedgeInk = !isInk && backgroundTheme !== 'muted' ? false : true; // wedge is dark -> light text
  const outline = numberStyle === 'outline';
  const chips = keywords.slice(0, Math.max(0, keywordCount));
  const fIdx = Math.min(focusIndex, Math.max(0, chips.length - 1));

  return (
    <div className={'acl-root acl-cd' + (isInk ? ' acl-cd--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-cd{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:${isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'}; padding:0; }
        /* diagonal upper wedge */
        .acl-cd__wedge{ position:absolute; inset:0; background:${wedge}; z-index:0;
          clip-path:polygon(0 0, 100% 0, 100% 40%, 0 72%); }
        .acl-cd__wedgeline{ position:absolute; inset:0; z-index:1; pointer-events:none; }
        .acl-cd__wedgeline::before{ content:""; position:absolute; left:0; right:0; top:0; height:100%;
          background:linear-gradient(to bottom right, transparent calc(72% - 6px),
            var(--acl-pink) calc(72% - 6px), var(--acl-pink) 72%, transparent 72%); }

        .acl-cd__pad{ position:absolute; inset:0; z-index:2; padding:76px 110px 78px;
          display:flex; flex-direction:column; }
        .acl-cd__eyebrow{ display:inline-flex; align-items:center; gap:14px; align-self:flex-start;
          font-family:var(--acl-font-mono); font-weight:700; font-size:24px; letter-spacing:.18em;
          text-transform:uppercase; color:var(--acl-ink); background:var(--acl-yellow);
          padding:9px 18px; transform:rotate(-1.6deg); box-shadow:3px 4px 0 rgba(22,21,15,.25); z-index:4; }

        /* giant number straddling the seam */
        .acl-cd__index{ position:absolute; right:96px; top:96px; font-family:var(--acl-font-num);
          font-size:520px; line-height:.7; letter-spacing:-.03em; z-index:3;
          color:var(--acl-yellow); text-shadow:8px 10px 0 rgba(0,0,0,.35); }
        .acl-cd__index--outline{ color:transparent; -webkit-text-stroke:6px var(--acl-yellow); text-shadow:none; }

        .acl-cd__titles{ margin-top:auto; max-width:1180px; z-index:4; }
        .acl-cd__kick{ font-family:var(--acl-font-hand); font-size:40px; margin-bottom:8px;
          color:${isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'}; }
        .acl-cd__h{ font-weight:900; font-size:128px; line-height:.92; margin:0; letter-spacing:-.01em;
          text-wrap:balance; }
        .acl-cd__h b{ color:var(--acl-pink); }

        .acl-cd__chips{ display:flex; flex-wrap:wrap; gap:15px; margin-top:34px; align-items:center; z-index:4; }
        .acl-cd__chip{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px; letter-spacing:.02em;
          padding:11px 21px; border:3px solid currentColor; box-shadow:3px 4px 0 rgba(22,21,15,.18);
          background:${isInk ? 'transparent' : 'var(--acl-paper)'}; color:${isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'}; }
        .acl-cd__chip:nth-child(2n){ transform:rotate(1.6deg); }
        .acl-cd__chip:nth-child(2n+1){ transform:rotate(-1.4deg); }
        .acl-cd__chip--focus{ background:var(--acl-pink); color:var(--acl-paper); border-color:var(--acl-ink);
          transform:rotate(0deg) scale(1.06); }

        .acl-cd__foot{ position:absolute; left:110px; bottom:34px; z-index:4; display:flex; align-items:center;
          gap:14px; font-family:var(--acl-font-mono); font-size:17px; letter-spacing:.05em;
          color:${isInk ? 'rgba(251,250,244,.6)' : 'rgba(22,21,15,.55)'}; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cd__index{ animation:acl-cd-pop .7s cubic-bezier(.2,.9,.3,1.15) both; }
          [data-deck-active] .acl-cd__h{ animation:acl-cd-in .55s cubic-bezier(.2,.8,.2,1) both .12s; }
          [data-deck-active] .acl-cd__chip{ animation:acl-cd-in .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .34s); }
        }
        @keyframes acl-cd-pop{ from{ opacity:0; transform:translateY(-28px) scale(.9); } to{ opacity:1; transform:none; } }
        @keyframes acl-cd-in{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-cd__wedge" />
      <div className="acl-cd__wedgeline" aria-hidden="true" />

      {showIndex && (
        <div className={'acl-cd__index' + (outline ? ' acl-cd__index--outline' : '')} aria-hidden="true">
          {indexLabel}
        </div>
      )}

      <div className="acl-cd__pad">
        <div className="acl-cd__eyebrow">
          {eyebrow}
          {showDecor && <Doodle kind="spark" size={26} fill="var(--acl-ink)" style={{ position: 'static' }} />}
        </div>

        <div className="acl-cd__titles">
          <div className="acl-cd__kick">{subheadline}</div>
          <h1 className="acl-cd__h" dangerouslySetInnerHTML={{ __html: headline }} />

          {chips.length > 0 && (
            <div className="acl-cd__chips">
              {showDecor && <Doodle kind="arrowS" size={54} rotate={4}
                color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static', marginRight: 4 }} />}
              {chips.map((k, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <span key={i} className={'acl-cd__chip' + (isF ? ' acl-cd__chip--focus' : '')}
                    style={{ '--i': i }}>{k}</span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="acl-cd__foot">
        {showDecor && <Sticker label="CHAPTER" sub={indexLabel} color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={-3} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page89Chapter.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted' | 'ink'
  numberStyle: 'solid',        // 'solid' | 'outline'
  showIndex: true,             // giant chapter number straddling the seam
  keywordCount: 4,             // 0–6 keyword chips
  focusEnabled: true,
  focusIndex: 0,               // which keyword chip is highlighted
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Chapter 06',
  indexLabel: '06',
  headline: '附录与<b>方法</b>',
  subheadline: '口径、来源与复盘',
  keywords: ['数据口径', '样本范围', '指标定义', '引用来源', '复盘清单', '免责说明'],
  closingLine: '把方法摊开，结论才站得住。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page89Chapter.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色' },
  { key: 'numberStyle', type: 'enum', default: 'solid', options: ['solid', 'outline'],
    label: '章节号样式', desc: '巨型章节号：实心 / 描边' },
  { key: 'showIndex', type: 'boolean', default: true,
    label: '大章节号', desc: '跨越对角分割的巨型章节编号 显隐' },
  { key: 'keywordCount', type: 'number', default: 4, min: 0, max: 6, step: 1,
    label: '关键词数量', desc: '底部本章关键词标签数量(0–6)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个关键词' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 5, step: 1, maxFrom: 'keywordCount',
    label: '重点对象', desc: '被高亮的关键词序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page89Chapter.defaults;
export const controls = Page89Chapter.controls;
