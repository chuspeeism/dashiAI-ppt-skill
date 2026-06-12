// Page19Peak.jsx — "Peak Spotlight" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pk-`.
// Left: a bold stat panel anchored by one headline figure, a count-driven grid
// of metric tiles, and a compact area chart that flags a single peak point.
// Right: a count-driven collage of AdaptiveImageSlots (0–n) — each slot resizes
// to its uploaded photo's aspect ratio and the layout preset rebalances per
// count. Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page19Peak(props) {
  const p = { ...Page19Peak.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, showPeakMark, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary,
    badge, hero, metrics, curve, curveUnit, peakIndex, peakNote, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, tiles.length - 1);
  const slots = collage[mediaCount] || [];

  // ── area chart geometry ──
  const n = curve.length, CW = 660, CH = 200;
  const maxV = Math.max(...curve) * 1.1;
  const cx = (i) => (i / (n - 1)) * CW;
  const cy = (v) => CH - (v / maxV) * CH;
  const line = curve.map((v, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(' ');
  const area = `${line} L${CW} ${CH} L0 ${CH} Z`;
  const pk = Math.min(peakIndex, n - 1);

  return (
    <div className="acl-root acl-pk" style={{ background: bg }}>
      <style>{`
        .acl-pk{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-pk__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-pk__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-pk__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-pk__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-pk__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pk__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-pk__body{ flex:1; display:flex; gap:40px; margin-top:30px; min-height:0; }
        .acl-pk__panel{ flex:0 0 740px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 40px 26px; display:flex; flex-direction:column; }
        .acl-pk__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-pink); color:var(--acl-paper); padding:9px 16px;  white-space:nowrap;}
        .acl-pk__herolabel{ font-weight:700; font-size:24px; color:rgba(22,21,15,.6); margin-top:24px;
          display:flex; align-items:center; gap:14px; }
        .acl-pk__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-ink); color:var(--acl-paper); }
        .acl-pk__heronum{ font-family:var(--acl-font-num); font-size:188px; line-height:.84; margin-top:4px; }
        .acl-pk__tiles{ display:flex; gap:14px; margin-top:18px; }
        .acl-pk__tile{ flex:1; border:2px solid var(--acl-ink); padding:12px 14px 10px; transition:.25s; }
        .acl-pk__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-pk__tile .v{ font-family:var(--acl-font-num); font-size:42px; line-height:.96; margin-top:3px; }
        .acl-pk__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }
        .acl-pk__tile--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-pk__tile--focus .k{ color:rgba(255,255,255,.55); }
        .acl-pk__chart{ flex:1; margin-top:22px; position:relative; min-height:120px; }
        .acl-pk__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-pk__pkdot{ position:absolute; width:22px; height:22px; border-radius:50%; background:var(--acl-pink);
          border:4px solid var(--acl-ink); transform:translate(-50%,-50%); z-index:2; }
        .acl-pk__pklab{ position:absolute; transform:translate(-50%,-100%); z-index:3; white-space:nowrap;
          font-family:var(--acl-font-num); font-size:30px; color:var(--acl-pink);
          text-shadow:0 0 7px var(--acl-paper),0 0 7px var(--acl-paper); }
        .acl-pk__pkflag{ position:absolute; transform:translate(-50%,0); z-index:4; }

        /* collage stage */
        .acl-pk__stage{ flex:1; position:relative; min-width:0; }
        .acl-pk__slot{ position:absolute; }
        .acl-pk__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-pk__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pk__panel{ animation:acl-pk-rise .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-pk-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-pk__head">
        <div>
          <div className="acl-pk__eyebrow">{eyebrow}</div>
          <h1 className="acl-pk__h">{headline}</h1>
        </div>
        <div className="acl-pk__sub">{subheadline}</div>
        <div className="acl-pk__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pk__body">
        {/* ── peak stat panel ── */}
        <div className="acl-pk__panel">
          <div className="acl-pk__badge">★ {badge}</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 30, top: 26 }}>
              <Doodle kind="star" size={52} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />
            </div>
          )}
          <div className="acl-pk__herolabel">{hero.label}<i className="acl-pk__unit">{hero.unit}</i></div>
          <div className="acl-pk__heronum">{hero.value}</div>
          <div className="acl-pk__tiles">
            {tiles.map((m, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-pk__tile' + (isF ? ' acl-pk__tile--focus' : '')}>
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v}<em>{m.unit}</em></div>
                </div>
              );
            })}
          </div>
          <div className="acl-pk__chart">
            <svg className="acl-pk__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
              <path d={area} fill="var(--acl-pink)" fillOpacity="0.18" />
              <path d={line} fill="none" stroke="var(--acl-ink)" strokeWidth="3.5"
                strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {showPeakMark && (
              <React.Fragment>
                <div className="acl-pk__pkdot" style={{ left: `${(cx(pk) / CW) * 100}%`, top: `${(cy(curve[pk]) / CH) * 100}%` }} />
                <div className="acl-pk__pklab" style={{ left: `${(cx(pk) / CW) * 100}%`, top: `calc(${(cy(curve[pk]) / CH) * 100}% - 14px)` }}>{curve[pk]}</div>
                {showDecor && (
                  <div className="acl-pk__pkflag" style={{ left: `${(cx(pk) / CW) * 100}%`, top: `calc(${(cy(curve[pk]) / CH) * 100}% - 78px)` }}>
                    <Sticker label={peakNote} color="var(--acl-yellow)" rotate={-5} />
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>

        {/* ── adaptive image collage ── */}
        <div className="acl-pk__stage">
          {slots.length === 0 && <div className="acl-pk__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-pk__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'peak-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'峰值现场 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && (
            <React.Fragment>
              <div style={{ position: 'absolute', right: 4, top: 8, zIndex: 4, transform: 'rotate(-6deg)' }}>
                <Sticker label="全年最高" sub="PEAK" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={20} />
              </div>
              <Doodle kind="spark" size={46} rotate={12} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ right: 150, top: 92 }} />
              <Doodle kind="spark" size={30} rotate={-6} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 28, bottom: 150 }} />
              <Doodle kind="arrow" size={90} rotate={118} color="var(--acl-ink)" style={{ left: -6, top: '46%' }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-pk__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page19Peak.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,           // 0–3 adaptive image slots
  metricCount: 3,          // 2–3 supporting metric tiles
  showPeakMark: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  eyebrow: 'Quarter Breakdown',
  headline: '全年峰值季度',
  subheadline: 'Q3 融资拆解',
  summary: 'Q3 融资额与事件数均达<b>全年最高</b>，是市场情绪高点。',
  badge: 'Q3 · 全年峰值',
  hero: { label: '季度融资额', value: '318', unit: '亿美元' },
  metrics: [
    { k: '事件数', v: '31', unit: '笔' },
    { k: '平均单笔', v: '10.3', unit: '亿' },
    { k: '峰值月份', v: '8', unit: '月' },
  ],
  curve: [45, 58, 59, 86, 105, 93, 92, 118, 108, 73, 81, 52],
  curveUnit: '亿美元',
  peakIndex: 7,            // index of the highlighted peak point (8月)
  peakNote: '8 月峰值',
  // count-driven collage presets — tuned per count for a balanced composition.
  // stage area ≈ 900×720; each slot resizes to its uploaded image's ratio.
  collage: {
    0: [],
    1: [
      { l: 200, t: 70, box: 540, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)', label: '峰值现场', sub: 'Q3' },
    ],
    2: [
      { l: 16, t: 4, box: 470, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)', label: '峰值现场', sub: 'Q3' },
      { l: 440, t: 286, box: 452, r: 4, ratio: 0.84, sr: 3, color: 'var(--acl-blue)', label: '高点交易', sub: '8月' },
    ],
    3: [
      { l: 250, t: 0, box: 400, r: 3, ratio: 0.92, sr: -4, color: 'var(--acl-yellow)', label: '峰值现场', sub: 'Q3' },
      { l: 0, t: 244, box: 366, r: -5, ratio: 1.2, sr: 4, color: 'var(--acl-blue)', label: '高点交易', sub: '8月' },
      { l: 470, t: 400, box: 348, r: 5, ratio: 0.82, sr: -3, color: 'var(--acl-pink)', label: '超级交易', sub: 'Top' },
    ],
  },
  closingLine: '高峰之后，市场开始从热度转向筛选。',
};

Page19Peak.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主卡内支撑指标格数量(2–3)' },
  { key: 'showPeakMark', type: 'boolean', default: true,
    label: '峰值标记', desc: '面积图上的峰值点与标签的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个支撑指标' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 2, step: 1, maxFrom: 'metricCount',
    label: '重点对象', desc: '被高亮的指标序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page19Peak.defaults;
export const controls = Page19Peak.controls;
