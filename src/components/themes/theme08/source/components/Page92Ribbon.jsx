// Page92Ribbon.jsx — "Upward Trajectory · Diagonal Photo Ribbon" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rb-`.
// A NEW image layout, distinct from P42 (horizontal film strip), P83 (poster
// columns), P85 (hero split), P88 (photo wall), P08: aspect-true photos climb a
// diagonal accent RIBBON from lower-left to upper-right (each pinned a step
// higher), reading as an upward trajectory; a left title block + bottom support
// metrics anchor it. Count-driven (0–4), focusable, toggle ribbon/captions.
// Pure ESM — every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page92Ribbon(props) {
  const p = { ...Page92Ribbon.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, showRibbon, showCaptions,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, tiles, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = tiles.slice(0, Math.max(0, mediaCount));
  const n = items.length;
  const fIdx = Math.min(focusIndex, Math.max(0, n - 1));
  const mtiles = metrics.slice(0, Math.max(2, metricCount));
  const baseBox = n <= 1 ? 420 : n === 2 ? 360 : n === 3 ? 318 : 282;
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-paper)', 'var(--acl-red)'];

  return (
    <div className="acl-root acl-rb" style={{ background: bg }}>
      <style>{`
        .acl-rb{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:66px 96px 56px; display:flex; flex-direction:column; }

        /* diagonal ribbon behind the photos */
        .acl-rb__ribbon{ position:absolute; left:-8%; right:-8%; top:50%; height:248px; z-index:0;
          background:var(--acl-ink); transform:rotate(-15deg); transform-origin:center;
          box-shadow:0 26px 0 rgba(22,21,15,.12); }
        .acl-rb__ribbon::after{ content:""; position:absolute; inset:0;
          background:repeating-linear-gradient(90deg, transparent 0 56px, rgba(236,239,53,.16) 56px 60px); }

        .acl-rb__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; z-index:3; }
        .acl-rb__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:8px; }
        .acl-rb__h{ font-weight:900; font-size:74px; line-height:.94; margin:0; }
        .acl-rb__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg); white-space:nowrap; }
        .acl-rb__summary{ margin-left:auto; max-width:430px; font-weight:700; font-size:22px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-rb__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; white-space:nowrap; }

        .acl-rb__stage{ flex:1; position:relative; display:flex; align-items:center; justify-content:center;
          gap:38px; min-height:0; z-index:2; }
        .acl-rb__empty{ font-family:var(--acl-font-hand); font-size:38px; color:rgba(22,21,15,.4); z-index:3; }
        .acl-rb__cell{ position:relative; transition:transform .28s; }
        .acl-rb__idx{ position:absolute; top:-18px; left:-14px; z-index:6; font-family:var(--acl-font-num);
          width:52px; height:52px; border-radius:50%; background:var(--acl-pink); color:var(--acl-paper);
          display:flex; align-items:center; justify-content:center; font-size:26px;
          border:3px solid var(--acl-paper); box-shadow:3px 4px 0 rgba(22,21,15,.25); }
        .acl-rb__cap{ position:absolute; left:50%; bottom:-15px; transform:translateX(-50%); z-index:6; }
        .acl-rb__cfx{ position:absolute; top:-24px; right:-16px; z-index:7; }

        .acl-rb__foot{ flex:0 0 auto; display:flex; align-items:flex-end; gap:30px; z-index:3; margin-top:8px;
          padding-top:18px; border-top:3px solid rgba(22,21,15,.22); }
        .acl-rb__metrics{ display:flex; gap:20px; flex:1; }
        .acl-rb__m{ flex:1 1 0; border-top:0; }
        .acl-rb__mk{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-rb__mv{ font-family:var(--acl-font-num); font-size:54px; line-height:.96; }
        .acl-rb__mv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:5px; color:rgba(22,21,15,.55); }
        .acl-rb__sign{ flex:0 0 auto; display:flex; align-items:center; gap:12px;
          font-family:var(--acl-font-hand); font-size:25px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rb__cell{ animation:acl-rb-climb .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .11s); }
          [data-deck-active] .acl-rb__m{ animation:acl-rb-rise .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .45s); }
        }
        @keyframes acl-rb-climb{ from{ opacity:0; transform:translate(-20px,28px) rotate(var(--rot,0deg)); }
          to{ opacity:1; } }
        @keyframes acl-rb-rise{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-rb__head">
        <div>
          <div className="acl-rb__eyebrow">{eyebrow}</div>
          <h1 className="acl-rb__h">{headline}</h1>
        </div>
        <div className="acl-rb__sub">{subheadline}</div>
        <div className="acl-rb__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rb__stage">
        {showRibbon && n > 0 && <div className="acl-rb__ribbon" aria-hidden="true" />}
        {n === 0 && <div className="acl-rb__empty">// 图片数量 = 0</div>}
        {items.map((t, i) => {
          const isF = focusEnabled && i === fIdx;
          const box = Math.round(baseBox * (isF ? 1.22 : 1));
          // each photo climbs a step higher (upward trajectory)
          const lift = (n > 1 ? (i - (n - 1) / 2) : 0) * -64;
          const rot = isF ? 0 : (i % 2 ? 3 : -3);
          return (
            <div key={i} className="acl-rb__cell"
              style={{ transform: `translateY(${lift}px) rotate(${rot}deg)`, '--rot': rot + 'deg', '--i': i }}>
              <div className="acl-rb__idx">{String(i + 1).padStart(2, '0')}</div>
              {isF && showDecor && <div className="acl-rb__cfx"><Sticker label="焦点" sub="UP" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={8} /></div>}
              <AdaptiveImageSlot id={'rb-' + i} box={box} ratio={t.ratio || 0.84}
                accent={isF ? 'var(--acl-pink)' : accents[i % accents.length]} placeholder={t.name}
                sticker={showCaptions ? { label: t.name, sub: t.tag, color: accents[i % accents.length], subColor: 'var(--acl-ink)', rotate: i % 2 ? 3 : -3 } : null} />
            </div>
          );
        })}
        {showDecor && n > 0 && (
          <Doodle kind="arrow" size={120} rotate={-18} fill="var(--acl-pink)" stroke="var(--acl-ink)"
            style={{ right: 30, top: 24, zIndex: 4 }} />
        )}
      </div>

      <div className="acl-rb__foot">
        <div className="acl-rb__metrics">
          {mtiles.map((m, i) => (
            <div key={i} className="acl-rb__m" style={{ '--i': i }}>
              <div className="acl-rb__mk">{m.k}</div>
              <div className="acl-rb__mv">{m.v}<em>{m.unit}</em></div>
            </div>
          ))}
        </div>
        <div className="acl-rb__sign">
          {showDecor && <Doodle kind="loop" size={46} style={{ position: 'static' }} />}
          <span>{closingLine}</span>
        </div>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page92Ribbon.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  mediaCount: 3,               // 0–4 photo slots climbing the ribbon
  metricCount: 3,              // 2–4 bottom support metric tiles
  showRibbon: true,            // diagonal accent ribbon behind the photos
  showCaptions: true,          // sticker caption per photo
  focusEnabled: true,
  focusIndex: 1,               // which photo is enlarged
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Upward · 上行轨迹',
  headline: '一年走高的曲线',
  subheadline: '对角飘带',
  summary: '把节点串成一条<b>向上的飘带</b>，让趋势一眼可读。',
  // photo tiles — each holds one adaptive image slot (count via mediaCount)
  tiles: [
    { name: '起点', tag: 'Q1', ratio: 0.84 },
    { name: '加速', tag: 'Q2', ratio: 1.1 },
    { name: '高点', tag: 'Q4', ratio: 0.9 },
    { name: '展望', tag: '2025', ratio: 1.2 },
  ],
  metrics: [
    { k: '全年增速', v: '2.3', unit: '×' },
    { k: '季度峰值', v: '312', unit: '亿' },
    { k: '高光节点', v: '4', unit: '个' },
  ],
  closingLine: '趋势比单点更有说服力。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page92Ribbon.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '对角飘带上的图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–4)' },
  { key: 'showRibbon', type: 'boolean', default: true,
    label: '斜向色带', desc: '图片背后的斜向色带 显隐' },
  { key: 'showCaptions', type: 'boolean', default: true,
    label: '照片标签', desc: '每张照片的贴纸标签 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否放大突出某一张照片' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, step: 1, maxFrom: 'mediaCount',
    label: '重点对象', desc: '被放大突出的照片序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page92Ribbon.defaults;
export const controls = Page92Ribbon.controls;
