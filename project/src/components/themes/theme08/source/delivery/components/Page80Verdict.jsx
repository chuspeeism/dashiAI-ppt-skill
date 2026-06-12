// Page80Verdict.jsx — "Closing Verdict / Stamped Pull-quote" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-vd-`.
// A NEW closing-quote layout, deliberately distinct from the other quote pages:
//   · P14 = centred statement,  · P33 = left rail + slanted backdrop,
//   · P61 = resource triad.
// Here the statement is split into stacked clause LINES; one line is the "punch"
// and gets an emphasis treatment (skewed fill band  OR  hand underline) that
// bleeds toward the right edge, paired with a rotated circular "verdict seal"
// stamp and a giant ghost closing-mark behind. Low information density by design
// (a section closer). Three themes (primary / muted / ink) for a dramatic ender.
// Pure ESM — no Tweaks/preview-runtime dependency; every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page80Verdict(props) {
  const p = { ...Page80Verdict.defaults, ...props };
  const {
    backgroundTheme, emphasisStyle, showSeal, showQuoteMark,
    showSupports, supportCount, focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, label, lines, supports, sealTop, sealBottom, source,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(125% 125% at 80% 6%, #2A2820 0%, #16150F 62%, #0E0D08 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = supports.slice(0, Math.max(0, supportCount));
  const fIdx = Math.min(focusIndex, lines.length - 1);

  return (
    <div className={'acl-root acl-vd' + (isInk ? ' acl-vd--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-vd{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 110px 72px; display:flex; flex-direction:column; }
        .acl-vd--ink{ color:var(--acl-paper); }

        /* ── header rail ── */
        .acl-vd__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; z-index:2; }
        .acl-vd__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.2em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-vd--ink .acl-vd__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-vd__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-vd__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow);
          transform:rotate(-2deg); white-space:nowrap; }
        .acl-vd--ink .acl-vd__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        /* ── giant ghost closing-mark behind ── */
        .acl-vd__ghost{ position:absolute; right:60px; bottom:-120px; font-family:var(--acl-font-num);
          font-size:560px; line-height:.62; color:var(--acl-pink); opacity:.14; z-index:0;
          pointer-events:none; user-select:none; }
        .acl-vd--ink .acl-vd__ghost{ color:var(--acl-yellow); opacity:.12; }

        /* ── body: stacked clause lines ── */
        .acl-vd__body{ flex:1; display:flex; flex-direction:column; justify-content:center;
          position:relative; z-index:1; gap:6px; }
        .acl-vd__label{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.5);
          display:flex; align-items:center; gap:14px; margin-bottom:24px; }
        .acl-vd--ink .acl-vd__label{ color:rgba(251,250,244,.55); }
        .acl-vd__label::before{ content:""; width:54px; height:7px; background:var(--acl-pink);
          display:inline-block; }
        .acl-vd--ink .acl-vd__label::before{ background:var(--acl-yellow); }

        .acl-vd__line{ position:relative; font-weight:900; line-height:1.02; letter-spacing:-.01em;
          margin:0; width:max-content; max-width:100%; }
        .acl-vd__line--set{ font-size:92px; color:rgba(22,21,15,.78); }
        .acl-vd--ink .acl-vd__line--set{ color:rgba(251,250,244,.82); }
        .acl-vd__line--punch{ font-size:150px; }

        /* emphasis · band (skewed fill that reads like a stamped marker swipe) */
        .acl-vd__band{ position:relative; display:inline-block; padding:.04em .22em .08em .14em;
          color:var(--acl-paper); background:var(--acl-ink); transform:rotate(-1.4deg);
          box-shadow:10px 12px 0 rgba(22,21,15,.18);
          clip-path:polygon(0 6%, 100% 0, 99% 92%, 1% 100%); }
        .acl-vd--ink .acl-vd__band{ background:var(--acl-yellow); color:var(--acl-ink);
          box-shadow:10px 12px 0 rgba(0,0,0,.4); }
        .acl-vd__band--alt{ background:var(--acl-pink); color:var(--acl-paper); }

        /* emphasis · underline (hand-drawn double stroke) */
        .acl-vd__under{ position:relative; display:inline-block; padding:0 .06em .12em; }
        .acl-vd__under::after{ content:""; position:absolute; left:-.04em; right:-.08em; bottom:.02em;
          height:.16em; background:var(--acl-pink);
          clip-path:polygon(0 22%,100% 0,100% 78%,0 100%); }
        .acl-vd--ink .acl-vd__under::after{ background:var(--acl-yellow); }

        .acl-vd__linefx{ position:absolute; top:-34px; right:-58px; z-index:3; }

        /* ── verdict seal stamp ── */
        .acl-vd__seal{ position:absolute; top:128px; right:96px; width:230px; height:230px;
          border-radius:50%; border:5px solid var(--acl-ink); display:grid; place-items:center;
          text-align:center; transform:rotate(-13deg); z-index:2;
          box-shadow:0 0 0 9px rgba(22,21,15,.08); background:transparent; }
        .acl-vd--ink .acl-vd__seal{ border-color:var(--acl-yellow); box-shadow:0 0 0 9px rgba(236,239,53,.08); }
        .acl-vd__sealring{ position:absolute; inset:14px; border-radius:50%;
          border:2px dashed rgba(22,21,15,.4); }
        .acl-vd--ink .acl-vd__sealring{ border-color:rgba(251,250,244,.4); }
        .acl-vd__sealwrap{ display:flex; flex-direction:column; align-items:center; gap:7px;
          padding:0 18px; }
        .acl-vd__sealtop{ font-weight:900; font-size:46px; line-height:.94; white-space:pre-line; }
        .acl-vd__sealdiv{ width:64px; height:3px; background:currentColor; opacity:.55; }
        .acl-vd__sealbot{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.16em; text-transform:uppercase; }
        .acl-vd__sealfx{ position:absolute; top:-22px; left:-26px; z-index:4; }

        /* ── foot: supports + signature ── */
        .acl-vd__foot{ flex:0 0 auto; display:flex; align-items:flex-end; gap:30px; z-index:2;
          padding-top:22px; border-top:3px solid rgba(22,21,15,.22); }
        .acl-vd--ink .acl-vd__foot{ border-color:rgba(251,250,244,.28); }
        .acl-vd__supports{ display:flex; gap:16px; flex:1; min-width:0; }
        .acl-vd__chip{ display:flex; align-items:center; gap:13px; min-width:0; }
        .acl-vd__chipn{ flex:0 0 auto; width:40px; height:40px; transform:rotate(45deg);
          background:var(--acl-ink); display:grid; place-items:center; }
        .acl-vd--ink .acl-vd__chipn{ background:var(--acl-yellow); }
        .acl-vd__chipn span{ transform:rotate(-45deg); font-family:var(--acl-font-num); font-size:20px;
          line-height:1; color:var(--acl-yellow); }
        .acl-vd--ink .acl-vd__chipn span{ color:var(--acl-ink); }
        .acl-vd__chiptxt{ display:flex; flex-direction:column; min-width:0; }
        .acl-vd__chiptxt b{ font-weight:900; font-size:25px; line-height:1.04; }
        .acl-vd__chiptxt span{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-vd--ink .acl-vd__chiptxt span{ color:rgba(251,250,244,.5); }
        .acl-vd__sign{ flex:0 0 auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em;
          color:rgba(22,21,15,.58); }
        .acl-vd--ink .acl-vd__sign{ color:rgba(251,250,244,.58); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-vd__line{ animation:acl-vd-in .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .12s + .08s); }
          [data-deck-active] .acl-vd__seal{ animation:acl-vd-stamp .5s cubic-bezier(.3,1.5,.5,1) both;
            animation-delay:.5s; }
          [data-deck-active] .acl-vd__chip{ animation:acl-vd-in .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .5s); }
        }
        @keyframes acl-vd-in{ from{ opacity:0; transform:translateY(26px); } to{ opacity:1; transform:none; } }
        @keyframes acl-vd-stamp{ from{ opacity:0; transform:rotate(-13deg) scale(1.5); }
          to{ opacity:1; transform:rotate(-13deg) scale(1); } }
      `}</style>

      {showQuoteMark && <div className="acl-vd__ghost" aria-hidden="true">”</div>}

      <div className="acl-vd__top">
        <div className="acl-vd__eyebrow">{eyebrow}</div>
        <div className="acl-vd__rule" />
        <div className="acl-vd__kicker">{kicker}</div>
      </div>

      {showSeal && (
        <div className="acl-vd__seal">
          <div className="acl-vd__sealring" />
          {showDecor && (
            <div className="acl-vd__sealfx">
              <Doodle kind="star" size={48} fill={isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)'}
                stroke="var(--acl-ink)" rotate={-12} style={{ position: 'static' }} />
            </div>
          )}
          <div className="acl-vd__sealwrap">
            <div className="acl-vd__sealtop">{sealTop}</div>
            <div className="acl-vd__sealdiv" />
            <div className="acl-vd__sealbot">{sealBottom}</div>
          </div>
        </div>
      )}

      <div className="acl-vd__body">
        <div className="acl-vd__label">{label}</div>
        {lines.map((ln, i) => {
          const isF = focusEnabled && i === fIdx;
          return (
            <h2 key={i} className={'acl-vd__line ' + (isF ? 'acl-vd__line--punch' : 'acl-vd__line--set')}
                style={{ '--i': i }}>
              {isF
                ? (emphasisStyle === 'underline'
                    ? <span className="acl-vd__under">{ln}</span>
                    : <span className={'acl-vd__band' + (isInk ? '' : ' acl-vd__band--alt')}>{ln}</span>)
                : ln}
              {isF && showDecor && (
                <span className="acl-vd__linefx">
                  <Doodle kind="spark" size={70} fill={isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)'}
                    stroke="var(--acl-ink)" rotate={10} style={{ position: 'static' }} />
                </span>
              )}
            </h2>
          );
        })}
      </div>

      <div className="acl-vd__foot">
        {showSupports && items.length > 0 && (
          <div className="acl-vd__supports">
            {items.map((s, i) => (
              <div key={i} className="acl-vd__chip" style={{ '--i': i }}>
                <span className="acl-vd__chipn"><span>{String(i + 1).padStart(2, '0')}</span></span>
                <div className="acl-vd__chiptxt"><b>{s.name}</b><span>{s.en}</span></div>
              </div>
            ))}
          </div>
        )}
        <div className="acl-vd__sign">
          {showDecor && <Doodle kind="loop" size={50} style={{ position: 'static' }} />}
          <span>{source}</span>
        </div>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page80Verdict.defaults = {
  backgroundTheme: 'ink',      // 'primary' | 'muted' | 'ink'
  emphasisStyle: 'band',       // 'band' (skewed fill) | 'underline' (hand stroke)
  showSeal: true,              // rotated circular verdict seal stamp
  showQuoteMark: true,         // giant ghost closing-mark behind
  showSupports: true,          // bottom support chips
  supportCount: 3,             // 0–3 support chips
  focusEnabled: true,
  focusIndex: 1,               // which clause line is the "punch" (emphasised)
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Closing',
  kicker: '收尾页',
  label: '最终判断 · Final Call',
  lines: [
    '融资盛宴之后，',
    '真正的竞争才刚开始。',
  ],
  supports: [
    { name: '一句话判断', en: 'One-line Verdict' },
    { name: '低信息密度', en: 'Low Density' },
    { name: '阶段性收束', en: 'Section Closer' },
  ],
  sealTop: '最终\n判断',
  sealBottom: 'Final Call · 2024',
  source: 'AI CAPITAL LAB · 全年调研收束',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page80Verdict.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'ink', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差金句)' },
  { key: 'emphasisStyle', type: 'enum', default: 'band', options: ['band', 'underline'],
    label: '强调样式', desc: '重点句强调方式：倾斜填充色块 / 手绘下划线' },
  { key: 'showSeal', type: 'boolean', default: true,
    label: '判定印章', desc: '右上角旋转的圆形判定印章 显隐' },
  { key: 'showQuoteMark', type: 'boolean', default: true,
    label: '大引号', desc: '背景大号收尾引号装饰 显隐' },
  { key: 'showSupports', type: 'boolean', default: true,
    label: '支撑要点', desc: '底部支撑要点条 显隐' },
  { key: 'supportCount', type: 'number', default: 3, min: 0, max: 3, step: 1, showIf: 'showSupports',
    label: '要点数量', desc: '展示的支撑要点数量(0–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一行金句（作为重点句加强调样式）' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 1, step: 1, maxFrom: 'lines',
    label: '重点行', desc: '被强调为重点句的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘火花、星标与贴纸标签 显隐' },
];

export const defaults = Page80Verdict.defaults;
export const controls = Page80Verdict.controls;
