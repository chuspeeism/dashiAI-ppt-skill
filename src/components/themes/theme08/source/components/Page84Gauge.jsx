// Page84Gauge.jsx — "One Number for 2025 · Ring Gauge" template page (big-number)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-gg-`.
// A SIXTH big-number layout, distinct from P24 (left figure + collage) and the
// other stat pages: one enormous figure sits dead-centre inside a circular
// PROGRESS-RING gauge whose sweep encodes the value, flanked by a short caption
// and a bottom row of supporting metric tiles. Solid/outline numeral styles,
// three themes, toggleable ring. Pure ESM — every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page84Gauge(props) {
  const p = { ...Page84Gauge.defaults, ...props };
  const {
    backgroundTheme, numberStyle, showRing, gaugePct, metricCount, showDecor,
    eyebrow, kicker, label, bigNumber, bigUnit, caption, metrics, source,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(125% 125% at 50% 8%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const outline = numberStyle === 'outline';
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const pct = Math.max(0, Math.min(100, gaugePct));
  // ring geometry
  const R = 360, SW = 30, C = 2 * Math.PI * R;
  const accent = isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)';

  return (
    <div className={'acl-root acl-gg' + (isInk ? ' acl-gg--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-gg{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 110px 64px; display:flex; flex-direction:column; }
        .acl-gg--ink{ color:var(--acl-paper); }
        .acl-gg__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; z-index:3; }
        .acl-gg__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gg--ink .acl-gg__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-gg__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-gg__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg); white-space:nowrap; }
        .acl-gg--ink .acl-gg__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-gg__body{ flex:1; display:flex; align-items:center; justify-content:center; min-height:0;
          position:relative; }
        .acl-gg__stage{ position:relative; width:740px; height:740px; display:grid; place-items:center;
          flex:0 0 auto; }
        .acl-gg__svg{ position:absolute; inset:0; transform:rotate(-90deg); }
        .acl-gg__track{ fill:none; stroke:rgba(22,21,15,.14); stroke-width:${SW}; }
        .acl-gg--ink .acl-gg__track{ stroke:rgba(251,250,244,.16); }
        .acl-gg__prog{ fill:none; stroke:${accent}; stroke-width:${SW}; stroke-linecap:round;
          stroke-dasharray:${C}; stroke-dashoffset:${C * (1 - pct / 100)}; filter:drop-shadow(4px 5px 0 rgba(22,21,15,.18)); }
        .acl-gg__tick{ position:absolute; top:18px; left:50%; transform:translateX(-50%);
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.12em;
          background:var(--acl-ink); color:var(--acl-yellow); padding:5px 12px; }
        .acl-gg--ink .acl-gg__tick{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-gg__center{ position:relative; z-index:2; display:flex; flex-direction:column;
          align-items:center; text-align:center; }
        .acl-gg__label{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:6px; }
        .acl-gg--ink .acl-gg__label{ color:rgba(251,250,244,.55); }
        .acl-gg__numrow{ display:flex; align-items:flex-start; gap:14px; }
        .acl-gg__num{ font-family:var(--acl-font-num); font-size:340px; line-height:.78; letter-spacing:-.03em;
          color:${accent}; text-shadow:8px 9px 0 var(--acl-ink); }
        .acl-gg--ink .acl-gg__num{ text-shadow:8px 9px 0 rgba(0,0,0,.5); }
        .acl-gg__num--outline{ color:transparent; -webkit-text-stroke:5px ${isInk ? 'var(--acl-yellow)' : 'var(--acl-ink)'};
          text-shadow:none; }
        .acl-gg__unit{ font-family:var(--acl-font-cn); font-weight:900; font-size:72px; line-height:1; margin-top:30px; }
        .acl-gg__cap{ font-weight:700; font-size:25px; line-height:1.4; max-width:520px; margin-top:6px;
          text-wrap:balance; }
        .acl-gg__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-gg--ink .acl-gg__cap b{ background:var(--acl-pink); color:var(--acl-paper); }
        .acl-gg__sidefx{ position:absolute; z-index:3; }

        .acl-gg__tiles{ flex:0 0 auto; display:flex; gap:20px; z-index:3; margin-top:8px; }
        .acl-gg__tile{ flex:1 1 0; border-top:5px solid var(--acl-ink); padding-top:13px; }
        .acl-gg--ink .acl-gg__tile{ border-color:var(--acl-yellow); }
        .acl-gg__tk{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-gg--ink .acl-gg__tk{ color:rgba(251,250,244,.55); }
        .acl-gg__tv{ font-family:var(--acl-font-num); font-size:62px; line-height:.96; margin-top:3px; }
        .acl-gg--ink .acl-gg__tv{ color:var(--acl-yellow); }
        .acl-gg__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:20px;
          margin-left:5px; color:rgba(22,21,15,.55); }
        .acl-gg--ink .acl-gg__tv em{ color:rgba(251,250,244,.55); }

        .acl-gg__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px; margin-top:20px; z-index:3;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em; color:rgba(22,21,15,.55); }
        .acl-gg--ink .acl-gg__foot{ color:rgba(251,250,244,.55); }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-gg__prog{ animation:acl-gg-sweep 1.1s cubic-bezier(.3,.9,.3,1) both .2s; }
          [data-deck-active] .acl-gg__num{ animation:acl-gg-pop .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-gg__tile{ animation:acl-gg-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .35s); }
        }
        @keyframes acl-gg-sweep{ from{ stroke-dashoffset:${C}; } to{ stroke-dashoffset:${C * (1 - pct / 100)}; } }
        @keyframes acl-gg-pop{ from{ opacity:0; transform:translateY(20px) scale(.94); } to{ opacity:1; transform:none; } }
        @keyframes acl-gg-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-gg__top">
        <div className="acl-gg__eyebrow">{eyebrow}</div>
        <div className="acl-gg__rule" />
        <div className="acl-gg__kicker">{kicker}</div>
      </div>

      <div className="acl-gg__body">
        <div className="acl-gg__stage">
          {showRing && (
            <React.Fragment>
              <svg className="acl-gg__svg" viewBox="0 0 800 800" aria-hidden="true">
                <circle className="acl-gg__track" cx="400" cy="400" r={R} />
                <circle className="acl-gg__prog" cx="400" cy="400" r={R} />
              </svg>
              <div className="acl-gg__tick">{pct}%</div>
            </React.Fragment>
          )}
          {showDecor && (
            <React.Fragment>
              <Doodle kind="spark" size={64} rotate={-12} fill={isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)'}
                stroke="var(--acl-ink)" style={{ left: -10, top: 120, zIndex: 3 }} />
              <Doodle kind="star" size={48} rotate={10} fill="var(--acl-blue)" stroke="var(--acl-ink)"
                style={{ right: 0, bottom: 150, zIndex: 3 }} />
            </React.Fragment>
          )}
          <div className="acl-gg__center">
            <div className="acl-gg__label">{label}</div>
            <div className="acl-gg__numrow">
              <span className={'acl-gg__num' + (outline ? ' acl-gg__num--outline' : '')}>{bigNumber}</span>
              <span className="acl-gg__unit">{bigUnit}</span>
            </div>
            <div className="acl-gg__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          </div>
          {showDecor && (
            <div className="acl-gg__sidefx" style={{ right: -34, top: 40 }}>
              <Sticker label="2025" sub="一个数字" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={6} />
            </div>
          )}
        </div>
      </div>

      <div className="acl-gg__tiles">
        {tiles.map((m, i) => (
          <div key={i} className="acl-gg__tile" style={{ '--i': i }}>
            <div className="acl-gg__tk">{m.k}</div>
            <div className="acl-gg__tv">{m.v}<em>{m.unit}</em></div>
          </div>
        ))}
      </div>

      <div className="acl-gg__foot">
        {showDecor && <Doodle kind="loop" size={46} color={isInk ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{source}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page84Gauge.defaults = {
  backgroundTheme: 'ink',      // 'primary' | 'muted' | 'ink'
  numberStyle: 'solid',        // 'solid' | 'outline'
  showRing: true,              // circular progress-ring gauge around the number
  gaugePct: 67,                // 0–100 sweep of the ring (usually == big number)
  metricCount: 3,              // 2–3 supporting metric tiles
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'One Number · 2025 展望',
  kicker: '大数字',
  label: '资本向应用层迁移的比例',
  bigNumber: '67',
  bigUnit: '%',
  caption: '2025 年新增 AI 资本预计有 <b>三分之二</b> 流向能直接计费的应用与垂直层。',
  metrics: [
    { k: '应用层占比', v: '67', unit: '%' },
    { k: '基础设施', v: '24', unit: '%' },
    { k: '模型层', v: '9', unit: '%' },
  ],
  source: '数据口径：2025 资本流向模拟 · AI CAPITAL LAB',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page84Gauge.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'ink', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差大数字)' },
  { key: 'numberStyle', type: 'enum', default: 'solid', options: ['solid', 'outline'],
    label: '数字样式', desc: '巨型数字：实心(带投影) / 描边(空心轮廓)' },
  { key: 'showRing', type: 'boolean', default: true,
    label: '环形仪表', desc: '数字外圈的环形进度仪表 显隐' },
  { key: 'gaugePct', type: 'number', default: 67, min: 0, max: 100, step: 1, showIf: 'showRing',
    label: '仪表百分比', desc: '环形仪表扫过的百分比（通常等于主数字）' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '底部支撑指标格数量(2–3)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘箭头、火花与贴纸标签 显隐' },
];

export const defaults = Page84Gauge.defaults;
export const controls = Page84Gauge.controls;
