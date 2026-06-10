// Page24BigNumber.jsx — "Big Number / Stat Anchor" template page (NEW format)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-bn-`.
// One enormous figure anchors the whole page as the single thing to remember,
// supported by a short caption, a count-driven row of secondary metric tiles and
// an OPTIONAL adaptive photo collage (0–n slots, each self-sizing to its image).
// Three themes + a solid/outline numeral style. Fully portable — no Tweaks
// dependency; the preview only maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page24BigNumber(props) {
  const p = { ...Page24BigNumber.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, showDecor,
    eyebrow, kicker, headline, bigNumber, bigUnit, caption, metrics, collage, closingLine,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 120% at 76% 6%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const slots = (collage[mediaCount] || []);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const hasMedia = slots.length > 0;

  return (
    <div className={'acl-root acl-bn' + (isInk ? ' acl-bn--ink' : '')}
      style={{ background: bg }}>
      <style>{`
        .acl-bn{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 72px; display:flex; flex-direction:column; }
        .acl-bn--ink{ color:var(--acl-paper); }
        .acl-bn__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; z-index:3; }
        .acl-bn__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-bn--ink .acl-bn__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-bn__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-bn__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-bn--ink .acl-bn__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-bn__body{ flex:1; display:flex; gap:48px; min-height:0; align-items:center; }
        .acl-bn__left{ flex:1 1 auto; min-width:0; position:relative; display:flex;
          flex-direction:column; justify-content:center; }
        .acl-bn__label{ font-weight:700; font-size:30px; color:rgba(22,21,15,.6);
          display:flex; align-items:center; gap:14px; }
        .acl-bn--ink .acl-bn__label{ color:rgba(251,250,244,.66); }
        .acl-bn__label i{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700;
          font-size:16px; letter-spacing:.05em; text-transform:uppercase; padding:5px 11px;
          background:var(--acl-ink); color:var(--acl-paper); }
        .acl-bn--ink .acl-bn__label i{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-bn__numwrap{ position:relative; display:flex; align-items:flex-end; gap:24px; margin:6px 0 4px; }
        .acl-bn__num{ position:relative; z-index:1; font-family:var(--acl-font-num);
          font-size:clamp(300px, 30vw, 460px); line-height:.82; letter-spacing:-.03em;
          color:var(--acl-pink); text-shadow:7px 8px 0 var(--acl-ink); }
        .acl-bn--ink .acl-bn__num{ color:var(--acl-yellow); text-shadow:7px 8px 0 rgba(0,0,0,.5); }
        .acl-bn__unit{ position:relative; z-index:1; font-family:var(--acl-font-cn); font-weight:900;
          font-size:88px; line-height:1; margin-bottom:48px; }
        .acl-bn__unit b{ display:block; font-family:var(--acl-font-mono); font-weight:700; font-size:20px;
          letter-spacing:.04em; color:rgba(22,21,15,.5); margin-top:10px; text-transform:uppercase; }
        .acl-bn--ink .acl-bn__unit b{ color:rgba(251,250,244,.5); }

        .acl-bn__cap{ position:relative; z-index:1; font-weight:700; font-size:28px; line-height:1.42;
          max-width:760px; margin-top:14px; }
        .acl-bn__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-bn--ink .acl-bn__cap b{ background:var(--acl-pink); color:var(--acl-paper); }

        .acl-bn__tiles{ position:relative; z-index:1; display:flex; gap:18px; margin-top:34px; }
        .acl-bn__tile{ flex:1 1 0; min-width:0; border-top:5px solid var(--acl-ink); padding-top:13px; }
        .acl-bn--ink .acl-bn__tile{ border-color:var(--acl-yellow); }
        .acl-bn__tk{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-bn--ink .acl-bn__tk{ color:rgba(251,250,244,.55); }
        .acl-bn__tv{ font-family:var(--acl-font-num); font-size:62px; line-height:.96; margin-top:3px; }
        .acl-bn--ink .acl-bn__tv{ color:var(--acl-yellow); }
        .acl-bn__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:20px;
          margin-left:5px; color:rgba(22,21,15,.55); }
        .acl-bn--ink .acl-bn__tv em{ color:rgba(251,250,244,.55); }

        .acl-bn__stage{ flex:0 0 560px; position:relative; height:100%; }
        .acl-bn__slot{ position:absolute; }

        .acl-bn__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; flex:0 0 auto; z-index:3; }
        .acl-bn--ink .acl-bn__foot{ color:var(--acl-paper); }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-bn__num{ animation:acl-bn-pop .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-bn__tile{ animation:acl-bn-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .2s); }
        }
        @keyframes acl-bn-pop{ from{ opacity:0; transform:translateY(22px) scale(.94); } to{ opacity:1; transform:none; } }
        @keyframes acl-bn-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-bn__top">
        <div className="acl-bn__eyebrow">{eyebrow}</div>
        <div className="acl-bn__rule" />
        <div className="acl-bn__kicker">{kicker}</div>
      </div>

      <div className="acl-bn__body">
        <div className="acl-bn__left">
          <div className="acl-bn__label">
            {headline}
            <i>{p.subheadline}</i>
            {showDecor && <Sticker label="ANCHOR" sub="记住这个数" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-3} size={14} />}
          </div>

          <div className="acl-bn__numwrap">
            <div className="acl-bn__num">{bigNumber}</div>
            <div className="acl-bn__unit">{bigUnit}<b>Big Number</b></div>
            {showDecor && (
              <Doodle kind="arrow" size={104} rotate={188} fill="var(--acl-pink)"
                stroke="var(--acl-ink)" style={{ right: hasMedia ? -40 : 120, top: -34, zIndex: 2 }} />
            )}
          </div>

          <div className="acl-bn__cap" dangerouslySetInnerHTML={{ __html: caption }} />

          <div className="acl-bn__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-bn__tile" style={{ '--i': i }}>
                <div className="acl-bn__tk">{m.k}</div>
                <div className="acl-bn__tv">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        {hasMedia && (
          <div className="acl-bn__stage">
            {slots.map((s, i) => (
              <div className="acl-bn__slot" key={i} style={{ left: s.l, top: s.t }}>
                <AdaptiveImageSlot id={'bignum-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                  accent={s.accent} placeholder={s.ph} sticker={s.st} />
              </div>
            ))}
            {showDecor && (
              <React.Fragment>
                <Doodle kind="spark" size={56} rotate={-10} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
                  style={{ left: -24, top: 30 }} />
                <Doodle kind="heart" size={42} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)"
                  style={{ right: 6, bottom: 40 }} />
              </React.Fragment>
            )}
          </div>
        )}
      </div>

      <div className="acl-bn__foot">
        {showDecor && <Doodle kind="loop" size={56} fill={isInk ? 'var(--acl-yellow)' : undefined}
          color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + collage layout presets (count → slot configs) ──────────
Page24BigNumber.defaults = {
  backgroundTheme: 'primary',   // 'primary' | 'muted' | 'ink'
  mediaCount: 2,                // 0–3 accent photo slots (adaptive ratio)
  metricCount: 3,               // 2–3 supporting metric tiles
  showDecor: true,
  eyebrow: 'Average Ticket · 平均单笔',
  kicker: '大数字',
  headline: '全年平均单笔融资规模',
  subheadline: 'Avg / Deal',
  bigNumber: '10',
  bigUnit: '亿美元',
  caption: '把 970 亿美元摊到 97 笔大额交易上，<b>平均每笔约 10 亿美元</b>——规模越大，后续兑现压力越高。',
  metrics: [
    { k: '全年融资', v: '970', unit: '亿' },
    { k: '大额事件', v: '97', unit: '笔' },
    { k: '最大单笔', v: '66', unit: '亿' },
  ],
  collage: {
    0: [],
    1: [
      { l: 60, t: 70, box: 420, r: -3, ratio: 0.84, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.01', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', sub: '现场', rotate: -4 } },
    ],
    2: [
      { l: 40, t: 30, box: 320, r: -4, ratio: 0.82, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.01', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', sub: '现场', rotate: -4 } },
      { l: 260, t: 330, box: 280, r: 5, ratio: 1.2, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.02', color: 'var(--acl-blue)', rotate: 4 } },
    ],
    3: [
      { l: 30, t: 0, box: 280, r: -4, ratio: 0.82, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.01', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', sub: '现场', rotate: -4 } },
      { l: 290, t: 220, box: 250, r: 5, ratio: 1.18, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.02', color: 'var(--acl-blue)', rotate: 4 } },
      { l: 60, t: 430, box: 220, r: 3, ratio: 0.9, accent: 'var(--acl-paper)', ph: '配图', st: { label: 'FIG.03', color: 'var(--acl-pink)', rotate: -3 } },
    ],
  },
  closingLine: '一个数字，先把整页钉在观众脑子里。',
};

Page24BigNumber.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差大数字)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '配图槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主数字下方支撑指标格数量(2–3)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与贴纸标签 显隐' },
];

export const defaults = Page24BigNumber.defaults;
export const controls = Page24BigNumber.controls;
