// Page91Quote.jsx — "Summary Quote · Two-Field Highlight Bands" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-q5-`.
// A FIFTH quote layout, distinct from P14 (centred), P33 (left rail + backdrop),
// P61 (resource triad), P80 (stamped verdict): the statement is broken into
// full-bleed CLAUSE LINES that alternate between two highlight FIELDS (ink band
// vs accent band) so the whole stack reads as a two-tone block — one focus line
// gets the loud accent. Big background quote-mark, optional support row.
// Pure ESM — every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page91Quote(props) {
  const p = { ...Page91Quote.defaults, ...props };
  const {
    backgroundTheme, showQuoteMark, showSupports, supportCount, focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, label, lines, supports, source,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(125% 125% at 14% 8%, #2A2820 0%, #16150F 62%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(160deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(165deg, #F4F66C 0%, #ECEF35 46%, #E2E62A 100%)';

  const items = supports.slice(0, Math.max(0, supportCount));
  const fIdx = Math.min(focusIndex, Math.max(0, lines.length - 1));

  return (
    <div className={'acl-root acl-q5' + (isInk ? ' acl-q5--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-q5{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 110px 70px; display:flex; flex-direction:column; }
        .acl-q5--ink{ color:var(--acl-paper); }

        .acl-q5__mark{ position:absolute; left:36px; top:-130px; font-family:var(--acl-font-num);
          font-size:540px; line-height:.7; color:var(--acl-pink); opacity:.16; z-index:0;
          pointer-events:none; user-select:none; }
        .acl-q5--ink .acl-q5__mark{ color:var(--acl-yellow); opacity:.13; }

        .acl-q5__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; z-index:2; }
        .acl-q5__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-q5--ink .acl-q5__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-q5__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-q5__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg); white-space:nowrap; }
        .acl-q5--ink .acl-q5__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-q5__body{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:10px;
          position:relative; z-index:1; }
        .acl-q5__label{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(22,21,15,.5); display:flex; align-items:center; gap:14px;
          margin-bottom:18px; }
        .acl-q5--ink .acl-q5__label{ color:rgba(251,250,244,.55); }
        .acl-q5__label::before{ content:""; width:54px; height:7px; background:var(--acl-pink); }
        .acl-q5--ink .acl-q5__label::before{ background:var(--acl-yellow); }

        /* alternating highlight bands -> two colour fields */
        .acl-q5__line{ display:inline-block; width:max-content; max-width:100%; font-weight:900;
          line-height:1.18; letter-spacing:-.01em; font-size:96px; padding:.02em .2em; margin:0;
          box-decoration-break:clone; -webkit-box-decoration-break:clone; }
        .acl-q5__line--a{ background:var(--acl-ink); color:var(--acl-paper); transform:rotate(-.6deg); }
        .acl-q5--ink .acl-q5__line--a{ background:rgba(251,250,244,.1); color:var(--acl-paper); }
        .acl-q5__line--b{ background:var(--acl-blue); color:var(--acl-ink); transform:rotate(.5deg); }
        .acl-q5__line--focus{ background:var(--acl-pink); color:var(--acl-paper); font-size:118px;
          box-shadow:9px 11px 0 rgba(22,21,15,.18); transform:rotate(-1deg); position:relative; }
        .acl-q5__linefx{ position:absolute; top:-30px; right:-54px; z-index:3; }

        .acl-q5__foot{ flex:0 0 auto; display:flex; align-items:flex-end; gap:30px; z-index:2;
          padding-top:22px; margin-top:8px; border-top:3px solid rgba(22,21,15,.22); }
        .acl-q5--ink .acl-q5__foot{ border-color:rgba(251,250,244,.28); }
        .acl-q5__supports{ display:flex; gap:30px; flex:1; min-width:0; }
        .acl-q5__s{ display:flex; gap:14px; align-items:flex-start; min-width:0; flex:1; }
        .acl-q5__sn{ font-family:var(--acl-font-num); font-size:48px; line-height:.8; flex:0 0 auto;
          color:var(--acl-pink); }
        .acl-q5--ink .acl-q5__sn{ color:var(--acl-yellow); }
        .acl-q5__st{ font-weight:700; font-size:21px; line-height:1.36; padding-top:5px; }
        .acl-q5__s--focus .acl-q5__sn{ color:var(--acl-ink); background:var(--acl-yellow); padding:0 .12em; }
        .acl-q5--ink .acl-q5__s--focus .acl-q5__sn{ color:var(--acl-ink); }
        .acl-q5__sign{ flex:0 0 auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em; color:rgba(22,21,15,.55); }
        .acl-q5--ink .acl-q5__sign{ color:rgba(251,250,244,.55); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-q5__line{ animation:acl-q5-in .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .12s + .08s); }
          [data-deck-active] .acl-q5__s{ animation:acl-q5-in .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .5s); }
        }
        @keyframes acl-q5-in{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; } }
      `}</style>

      {showQuoteMark && <div className="acl-q5__mark" aria-hidden="true">“</div>}

      <div className="acl-q5__top">
        <div className="acl-q5__eyebrow">{eyebrow}</div>
        <div className="acl-q5__rule" />
        <div className="acl-q5__kicker">{kicker}</div>
      </div>

      <div className="acl-q5__body">
        <div className="acl-q5__label">{label}</div>
        {lines.map((ln, i) => {
          const isF = focusEnabled && i === fIdx;
          const field = i % 2 === 0 ? 'acl-q5__line--a' : 'acl-q5__line--b';
          return (
            <h2 key={i} className={'acl-q5__line ' + (isF ? 'acl-q5__line--focus' : field)} style={{ '--i': i }}>
              {ln}
              {isF && showDecor && (
                <span className="acl-q5__linefx">
                  <Doodle kind="spark" size={66} fill="var(--acl-yellow)" stroke="var(--acl-ink)" rotate={10}
                    style={{ position: 'static' }} />
                </span>
              )}
            </h2>
          );
        })}
      </div>

      <div className="acl-q5__foot">
        {showSupports && items.length > 0 && (
          <div className="acl-q5__supports">
            {items.map((s, i) => {
              const isF = focusEnabled && i === Math.min(fIdx, items.length - 1);
              return (
                <div key={i} className={'acl-q5__s' + (isF ? ' acl-q5__s--focus' : '')} style={{ '--i': i }}>
                  <div className="acl-q5__sn">{String(i + 1).padStart(2, '0')}</div>
                  <div className="acl-q5__st">{s}</div>
                </div>
              );
            })}
          </div>
        )}
        <div className="acl-q5__sign">
          {showDecor && <Doodle kind="loop" size={48} color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
          <span>{source}</span>
        </div>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page91Quote.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted' | 'ink'
  showQuoteMark: true,         // big background quote mark
  showSupports: true,          // bottom support row
  supportCount: 3,             // 0–3 support points
  focusEnabled: true,
  focusIndex: 0,               // which clause line is the loud accent field
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Summary · 总结一句',
  kicker: '金句页',
  label: '一句话收束',
  lines: [
    '资本可以催熟赛道，',
    '但只有现金流',
    '能决定谁活到最后。',
  ],
  supports: [
    '叙事负责融资，留存负责生存。',
    '可计费的价值，胜过漂亮的演示。',
    '穿越周期的，从来是现金流而非估值。',
  ],
  source: 'AI CAPITAL LAB · 全年调研总结',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page91Quote.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差金句)' },
  { key: 'showQuoteMark', type: 'boolean', default: true,
    label: '大引号', desc: '背景大号引号 显隐' },
  { key: 'showSupports', type: 'boolean', default: true,
    label: '支撑要点', desc: '底部支撑要点 显隐' },
  { key: 'supportCount', type: 'number', default: 3, min: 0, max: 3, step: 1, showIf: 'showSupports',
    label: '要点数量', desc: '展示的支撑要点数量(0–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一行金句（及对应支撑要点）' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 2, step: 1, maxFrom: 'lines',
    label: '重点行', desc: '作为重点强调场的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘火花与贴纸标签 显隐' },
];

export const defaults = Page91Quote.defaults;
export const controls = Page91Quote.controls;
