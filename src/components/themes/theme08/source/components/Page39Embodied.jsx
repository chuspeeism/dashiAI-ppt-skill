// Page39Embodied.jsx — "Embodied / Application Split" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-em-`.
// Left: a bold segment panel anchored by a hero figure + metric tiles. Right: a
// count-driven collage of AdaptiveImageSlots (0–3) that resize to each uploaded
// photo's ratio. Bottom: a full-width APPLICATION-SPLIT strip that toggles between
// a single stacked bar and grouped bars (one focusable). Portable ESM, prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page39Embodied(props) {
  const p = { ...Page39Embodied.defaults, ...props };
  const {
    backgroundTheme, mediaCount, splitStyle, segmentCount, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, metrics,
    splitTitle, segments, valueUnit, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const segs = segments.slice(0, Math.max(2, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const slots = collage[mediaCount] || [];
  const totalV = segs.reduce((a, s) => a + s.v, 0);
  const maxV = Math.max(...segs.map((s) => s.v));
  const palette = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-yellow)'];
  const segColor = (i, isF) => (isF ? 'var(--acl-pink)' : palette[(i + 1) % palette.length]);

  return (
    <div className="acl-root acl-em" style={{ background: bg }}>
      <style>{`
        .acl-em{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 64px; display:flex; flex-direction:column; }
        .acl-em__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-em__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-em__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-em__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-em__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-em__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-em__body{ flex:1; display:flex; gap:40px; margin-top:26px; min-height:0; }
        .acl-em__panel{ flex:0 0 640px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 38px 28px; display:flex; flex-direction:column; }
        .acl-em__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-em__herolabel{ font-weight:700; font-size:22px; color:rgba(22,21,15,.6); margin-top:18px;
          display:flex; align-items:center; gap:14px; }
        .acl-em__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-pink); color:var(--acl-paper); }
        .acl-em__heronum{ font-family:var(--acl-font-num); font-size:172px; line-height:.8; margin-top:2px; }
        .acl-em__tiles{ display:flex; gap:14px; margin-top:auto; }
        .acl-em__tile{ flex:1; border:2px solid var(--acl-ink); padding:13px 16px 11px; }
        .acl-em__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-em__tile .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.96; margin-top:3px; }
        .acl-em__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }

        /* collage stage */
        .acl-em__stage{ flex:1; position:relative; min-width:0; }
        .acl-em__slot{ position:absolute; }
        .acl-em__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        /* ── application-split strip ── */
        .acl-em__split{ flex:0 0 auto; margin-top:22px; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:6px 8px 0 rgba(22,21,15,.14); padding:16px 30px 18px; }
        .acl-em__splithd{ display:flex; align-items:baseline; justify-content:space-between; gap:14px; }
        .acl-em__splitt{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); }
        .acl-em__splittot{ font-family:var(--acl-font-num); font-size:30px; }
        .acl-em__splittot em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }
        /* stacked variant */
        .acl-em__stack{ display:flex; height:54px; border:2px solid var(--acl-ink); margin-top:12px; overflow:hidden; }
        .acl-em__seg{ display:flex; align-items:center; justify-content:center; border-right:2px solid var(--acl-ink);
          font-weight:900; font-size:22px; color:var(--acl-paper); transition:.25s; min-width:0; }
        .acl-em__seg:last-child{ border-right:none; }
        .acl-em__keys{ display:flex; gap:24px; margin-top:12px; flex-wrap:wrap; }
        .acl-em__key{ display:flex; align-items:center; gap:9px; transition:.25s; }
        .acl-em__sw{ width:18px; height:18px; border:2px solid var(--acl-ink); flex:0 0 auto; }
        .acl-em__key .kn{ font-weight:900; font-size:21px; }
        .acl-em__key .kv{ font-family:var(--acl-font-num); font-size:24px; margin-left:2px; }
        .acl-em__key .kv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:13px;
          margin-left:2px; opacity:.6; }
        .acl-em__key--dim{ opacity:.4; }
        /* grouped bars variant */
        .acl-em__bars{ display:flex; gap:26px; margin-top:12px; align-items:flex-end; height:118px; }
        .acl-em__bcol{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end;
          height:100%; gap:7px; }
        .acl-em__bval{ font-family:var(--acl-font-num); font-size:26px; line-height:.8; }
        .acl-em__bbar{ width:100%; border:2px solid var(--acl-ink); }
        .acl-em__bname{ font-weight:900; font-size:19px; text-align:center; }
        .acl-em__bname small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:11px;
          letter-spacing:.03em; text-transform:uppercase; color:rgba(22,21,15,.5); }

        .acl-em__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-em__panel{ animation:acl-em-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-em__split{ animation:acl-em-rise .55s cubic-bezier(.2,.8,.2,1) .15s both; }
          [data-deck-active] .acl-em__seg{ animation:acl-em-wipe .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); transform-origin:left; }
          [data-deck-active] .acl-em__bbar{ animation:acl-em-grow .6s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); transform-origin:bottom; }
        }
        @keyframes acl-em-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-em-wipe{ from{ transform:scaleX(0); } to{ transform:none; } }
        @keyframes acl-em-grow{ from{ transform:scaleY(0); } to{ transform:none; } }
      `}</style>

      <div className="acl-em__head">
        <div>
          <div className="acl-em__eyebrow">{eyebrow}</div>
          <h1 className="acl-em__h">{headline}</h1>
        </div>
        <div className="acl-em__sub">{subheadline}</div>
        <div className="acl-em__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-em__body">
        {/* ── segment stat panel ── */}
        <div className="acl-em__panel">
          <div className="acl-em__badge">⬡ {badge}</div>
          {showDecor && (
            <Doodle kind="spark" size={48} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 26, top: 22 }} />
          )}
          <div className="acl-em__herolabel">{hero.label}<i className="acl-em__unit">{hero.unit}</i></div>
          <div className="acl-em__heronum">{hero.value}</div>
          <div className="acl-em__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-em__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── adaptive image collage ── */}
        <div className="acl-em__stage">
          {slots.length === 0 && <div className="acl-em__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-em__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'embodied-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'机器人场景 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && (
            <React.Fragment>
              <div style={{ position: 'absolute', right: 4, top: 4, zIndex: 4, transform: 'rotate(-6deg)' }}>
                <Sticker label="物理世界" sub="EMBODIED" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={19} />
              </div>
              <Doodle kind="arrow" size={82} rotate={118} color="var(--acl-ink)" style={{ left: -8, top: '40%' }} />
              <Doodle kind="spark" size={40} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 24, bottom: 40 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      {/* ── application-split strip ── */}
      <div className="acl-em__split">
        <div className="acl-em__splithd">
          <div className="acl-em__splitt">{splitTitle} · Application Split</div>
          <div className="acl-em__splittot">{totalV}<em>{valueUnit}</em></div>
        </div>

        {splitStyle === 'stack' ? (
          <React.Fragment>
            <div className="acl-em__stack">
              {segs.map((s, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <div key={i} className="acl-em__seg" style={{ '--i': i, flex: s.v,
                    background: segColor(i, isF), color: segColor(i, isF) === 'var(--acl-yellow)' ? 'var(--acl-ink)' : 'var(--acl-paper)',
                    opacity: focusEnabled && !isF ? 0.55 : 1 }}>
                    {showValueLabels && Math.round((s.v / totalV) * 100) + '%'}
                  </div>
                );
              })}
            </div>
            <div className="acl-em__keys">
              {segs.map((s, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <div key={i} className={'acl-em__key' + (focusEnabled && !isF ? ' acl-em__key--dim' : '')}>
                    <span className="acl-em__sw" style={{ background: segColor(i, isF) }} />
                    <span className="kn">{s.k}</span>
                    {showValueLabels && <span className="kv">{s.v}<em>{valueUnit}</em></span>}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ) : (
          <div className="acl-em__bars">
            {segs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className="acl-em__bcol" style={{ opacity: focusEnabled && !isF ? 0.5 : 1 }}>
                  {showValueLabels && <div className="acl-em__bval">{s.v}<span style={{ fontSize: 14 }}>{valueUnit}</span></div>}
                  <div className="acl-em__bbar" style={{ '--i': i, height: `${(s.v / maxV) * 100}%`, background: segColor(i, isF) }} />
                  <div className="acl-em__bname">{s.k}<small>{s.en}</small></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="acl-em__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page39Embodied.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 2,           // 0–3 adaptive image slots
  splitStyle: 'stack',     // stack | bars — application distribution display
  segmentCount: 3,         // 2–4 application directions
  showValueLabels: true,
  metricCount: 2,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight 人形机器人 by default
  showDecor: true,
  eyebrow: 'Embodied AI',
  headline: '从软件走向物理世界',
  subheadline: '机器人与具身智能',
  summary: '具身智能是 AI 从软件能力延伸到<b>物理场景</b>的重要方向。',
  badge: 'Embodied · 具身智能',
  hero: { label: '赛道融资额', value: '41', unit: '亿美元' },
  metrics: [
    { k: '事件数', v: '7', unit: '笔' },
    { k: '平均单笔', v: '5.9', unit: '亿' },
    { k: '人形占比', v: '51', unit: '%' },
  ],
  splitTitle: '应用分布',
  valueUnit: '亿',
  // application directions — text not parameterized (count via segmentCount)
  segments: [
    { k: '人形机器人', en: 'Humanoid', v: 21 },
    { k: '工业自动化', en: 'Industrial', v: 11 },
    { k: '仓储机器人', en: 'Warehouse', v: 9 },
    { k: '服务机器人', en: 'Service', v: 5 },
  ],
  // count-driven collage presets — stage ≈ 940×520; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 240, t: 16, box: 470, r: -3, ratio: 1.4, sr: -4, color: 'var(--acl-yellow)', label: '机器人场景', sub: 'ROBOT' },
    ],
    2: [
      { l: 20, t: 0, box: 432, r: -4, ratio: 1.3, sr: -4, color: 'var(--acl-yellow)', label: '人形场景', sub: 'HUMANOID' },
      { l: 470, t: 130, box: 408, r: 4, ratio: 0.86, sr: 3, color: 'var(--acl-blue)', label: '工业场景', sub: 'INDUSTRY' },
    ],
    3: [
      { l: 250, t: 0, box: 348, r: 3, ratio: 0.96, sr: -4, color: 'var(--acl-yellow)', label: '人形场景', sub: 'HUMANOID' },
      { l: 0, t: 150, box: 322, r: -5, ratio: 1.3, sr: 4, color: 'var(--acl-blue)', label: '工业场景', sub: 'INDUSTRY' },
      { l: 562, t: 178, box: 330, r: 5, ratio: 0.86, sr: -3, color: 'var(--acl-pink)', label: '仓储场景', sub: 'WAREHOUSE' },
    ],
  },
  closingLine: '长周期赛道需要看供应链和量产能力。',
};

Page39Embodied.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'splitStyle', type: 'enum', default: 'stack', options: ['stack', 'bars'],
    label: '分布样式', desc: '应用分布呈现：堆叠条 / 分组柱' },
  { key: 'segmentCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '应用方向', desc: '应用分布的方向数量(2–4)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '应用分布数值标签的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主卡内支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个应用方向(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的应用方向序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page39Embodied.defaults;
export const controls = Page39Embodied.controls;
