// Page76Squeeze.jsx — "Moat Compression · Pincer" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cz-`.
// A NEW chart layout (distinct from every prior chart): a PINCER diagram where a
// center "independent space" box is squeezed from two converging walls (open
// source on one flank, incumbents on the other) — paired with count-driven
// PRESSURE GAUGE bars, each filling toward a danger THRESHOLD line. Toggle
// chartType between the pincer diagram and a plain pressure-bar stack. One
// focusable pressure indicator + metric tiles. Pure ESM — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page76Squeeze(props) {
  const p = { ...Page76Squeeze.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, showThreshold, showValueLabels, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, leftWall, rightWall, coreLabel, coreValue,
    threshold, pressures, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = pressures.slice(0, Math.max(2, segmentCount));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const isPincer = chartType === 'pincer';
  const palette = ['var(--acl-pink)', 'var(--acl-red)', 'var(--acl-blue)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-cz" style={{ background: bg }}>
      <style>{`
        .acl-cz{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 64px; display:flex; flex-direction:column; }
        .acl-cz__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-cz__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-cz__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-cz__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-red); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-cz__summary{ margin-left:auto; max-width:490px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-cz__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-cz__body{ flex:1; display:flex; gap:44px; margin-top:28px; min-height:0; }

        /* ── pincer diagram card (dark) ── */
        .acl-cz__chart{ flex:0 0 760px; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 34px 30px; display:flex; flex-direction:column; min-width:0; }
        .acl-cz__chartt{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.55); flex:0 0 auto; }
        .acl-cz__stage{ flex:1; display:flex; align-items:center; justify-content:center; min-height:0;
          position:relative; margin-top:8px; }

        /* pincer variant */
        .acl-cz__pincer{ width:100%; height:100%; display:flex; align-items:stretch; gap:0; }
        .acl-cz__wall{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
          color:var(--acl-ink); position:relative; }
        .acl-cz__wall--l{ clip-path:polygon(0 0, 100% 18%, 100% 82%, 0 100%); background:var(--acl-blue); }
        .acl-cz__wall--r{ clip-path:polygon(0 18%, 100% 0, 100% 100%, 0 82%); background:var(--acl-yellow); }
        .acl-cz__walltag{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.08em; text-transform:uppercase; opacity:.7; }
        .acl-cz__wallname{ font-weight:900; font-size:30px; line-height:1.04; text-align:center; padding:0 16px;
          margin-top:4px; }
        .acl-cz__wallv{ font-family:var(--acl-font-num); font-size:64px; line-height:.82; margin-top:6px; }
        .acl-cz__core{ flex:0 0 230px; align-self:center; height:64%; background:var(--acl-paper);
          color:var(--acl-ink); border:4px dashed var(--acl-ink); display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:6px; z-index:3; box-shadow:0 0 0 6px var(--acl-ink); }
        .acl-cz__corelab{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.06em; text-transform:uppercase; color:rgba(22,21,15,.55); text-align:center; padding:0 8px; }
        .acl-cz__corename{ font-weight:900; font-size:27px; line-height:1.05; text-align:center; padding:0 8px; }
        .acl-cz__corev{ font-family:var(--acl-font-num); font-size:62px; line-height:.8; color:var(--acl-pink); }
        .acl-cz__sq{ position:absolute; z-index:5; }
        .acl-cz__sq--l{ left:34%; top:50%; transform:translateY(-50%); }
        .acl-cz__sq--r{ right:34%; top:50%; transform:translateY(-50%) scaleX(-1); }

        /* bars variant */
        .acl-cz__bars{ width:100%; display:flex; flex-direction:column; justify-content:center; gap:22px; padding:6px 4px; }
        .acl-cz__brow{ display:flex; flex-direction:column; gap:7px; }
        .acl-cz__btop{ display:flex; align-items:baseline; justify-content:space-between; }
        .acl-cz__bname{ font-weight:900; font-size:25px; }
        .acl-cz__bname small{ font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; opacity:.55; margin-left:9px; }
        .acl-cz__bval{ font-family:var(--acl-font-num); font-size:44px; line-height:.8; color:var(--acl-yellow); }
        .acl-cz__btrack{ position:relative; height:30px; background:rgba(255,255,255,.12);
          border:3px solid var(--acl-paper); overflow:hidden; }
        .acl-cz__bfill{ position:absolute; inset:0 auto 0 0; border-right:3px solid var(--acl-paper); }

        /* shared threshold line */
        .acl-cz__thr{ position:absolute; top:-7px; bottom:-7px; width:0; border-left:3px dashed var(--acl-yellow); z-index:4; }
        .acl-cz__thrlab{ position:absolute; top:-26px; transform:translateX(-50%); font-family:var(--acl-font-mono);
          font-weight:700; font-size:11px; letter-spacing:.05em; text-transform:uppercase; color:var(--acl-yellow);
          white-space:nowrap; }

        /* ── right: pressure panel ── */
        .acl-cz__panel{ flex:1; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 38px 28px; display:flex; flex-direction:column; min-width:0; }
        .acl-cz__panelt{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); flex:0 0 auto; }
        .acl-cz__gauges{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:0; }
        .acl-cz__gauge{ flex:0 0 auto; display:flex; flex-direction:column; gap:8px; padding:16px 0;
          border-bottom:1.5px dashed rgba(22,21,15,.2); transition:opacity .25s; }
        .acl-cz__gauge:last-child{ border-bottom:none; }
        .acl-cz__gtop{ display:flex; align-items:baseline; justify-content:space-between; }
        .acl-cz__gname{ font-weight:900; font-size:26px; line-height:1.05; }
        .acl-cz__gname small{ font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-left:9px; }
        .acl-cz__gval{ font-family:var(--acl-font-num); font-size:48px; line-height:.78; white-space:nowrap; }
        .acl-cz__gtrack{ position:relative; height:24px; background:rgba(22,21,15,.1);
          border:3px solid var(--acl-ink); overflow:hidden; }
        .acl-cz__gfill{ position:absolute; inset:0 auto 0 0; border-right:3px solid var(--acl-ink); }
        .acl-cz__gauge--dim{ opacity:.42; }
        .acl-cz__fx{ position:absolute; right:30px; z-index:5; transform:translateY(-50%); }

        .acl-cz__tiles{ flex:0 0 auto; display:flex; gap:14px; margin-top:18px;
          border-top:2px dashed rgba(22,21,15,.2); padding-top:16px; }
        .acl-cz__tile{ flex:1; }
        .acl-cz__tk{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-cz__tv{ font-family:var(--acl-font-num); font-size:44px; line-height:.96; margin-top:2px; }
        .acl-cz__tv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        .acl-cz__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cz__chart,[data-deck-active] .acl-cz__panel{
            animation:acl-cz-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-cz__panel{ animation-delay:.08s; }
          [data-deck-active] .acl-cz__wall--l{ animation:acl-cz-sl .6s cubic-bezier(.2,.8,.2,1) .2s both; }
          [data-deck-active] .acl-cz__wall--r{ animation:acl-cz-sr .6s cubic-bezier(.2,.8,.2,1) .2s both; }
          [data-deck-active] .acl-cz__gfill,[data-deck-active] .acl-cz__bfill{
            animation:acl-cz-grow .7s cubic-bezier(.2,.8,.2,1) .4s both; }
          [data-deck-active] .acl-cz__gauge{ animation:acl-cz-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .3s); }
        }
        @keyframes acl-cz-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-cz-sl{ from{ opacity:0; transform:translateX(-30px); } to{ opacity:1; transform:none; } }
        @keyframes acl-cz-sr{ from{ opacity:0; transform:translateX(30px); } to{ opacity:1; transform:none; } }
        @keyframes acl-cz-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:none; } }
        @keyframes acl-cz-in{ from{ opacity:0; transform:translateX(18px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-cz__head">
        <div>
          <div className="acl-cz__eyebrow">{eyebrow}</div>
          <h1 className="acl-cz__h">{headline}</h1>
        </div>
        <div className="acl-cz__sub">{subheadline}</div>
        <div className="acl-cz__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-cz__body">
        {/* ── pincer / bars chart ── */}
        <div className="acl-cz__chart">
          <div className="acl-cz__chartt">{isPincer ? '壁垒夹击 · Moat Compression' : '压力指标 · Pressure Gauges'}</div>
          <div className="acl-cz__stage">
            {isPincer ? (
              <div className="acl-cz__pincer">
                <div className="acl-cz__wall acl-cz__wall--l">
                  <span className="acl-cz__walltag">{leftWall.tag}</span>
                  <span className="acl-cz__wallname">{leftWall.name}</span>
                  {showValueLabels && <span className="acl-cz__wallv">{leftWall.v}%</span>}
                </div>
                <div className="acl-cz__core">
                  <span className="acl-cz__corelab">{coreLabel}</span>
                  <span className="acl-cz__corename">初创独立空间</span>
                  {showValueLabels && <span className="acl-cz__corev">{coreValue}%</span>}
                </div>
                <div className="acl-cz__wall acl-cz__wall--r">
                  <span className="acl-cz__walltag">{rightWall.tag}</span>
                  <span className="acl-cz__wallname">{rightWall.name}</span>
                  {showValueLabels && <span className="acl-cz__wallv">{rightWall.v}%</span>}
                </div>
                {showDecor && <div className="acl-cz__sq acl-cz__sq--l"><Doodle kind="arrow" size={56} rotate={0} color="var(--acl-paper)" style={{ position: 'static' }} /></div>}
                {showDecor && <div className="acl-cz__sq acl-cz__sq--r"><Doodle kind="arrow" size={56} rotate={0} color="var(--acl-paper)" style={{ position: 'static' }} /></div>}
              </div>
            ) : (
              <div className="acl-cz__bars">
                {segs.map((s, i) => {
                  const isF = focusEnabled && i === fIdx;
                  const c = isF ? 'var(--acl-yellow)' : palette[i % palette.length];
                  const onDark = c === 'var(--acl-ink)';
                  return (
                    <div key={i} className="acl-cz__brow" style={{ opacity: focusEnabled && !isF ? 0.5 : 1 }}>
                      <div className="acl-cz__btop">
                        <span className="acl-cz__bname">{s.k}<small>{s.en}</small></span>
                        {showValueLabels && <span className="acl-cz__bval">{s.v}%</span>}
                      </div>
                      <div className="acl-cz__btrack">
                        <div className="acl-cz__bfill" style={{ width: `${Math.min(100, s.v)}%`, background: c }} />
                        {showThreshold && <div className="acl-cz__thr" style={{ left: `${threshold}%` }} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── pressure gauges panel ── */}
        <div className="acl-cz__panel">
          <div className="acl-cz__panelt">压力指标 · Compression Pressure</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 26, top: 22 }}>
              <Sticker label="商品化风险" sub="HIGH" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={5} size={14} />
            </div>
          )}
          <div className="acl-cz__gauges">
            {segs.map((s, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const c = isF ? 'var(--acl-pink)' : palette[i % palette.length];
              return (
                <div key={i} className={'acl-cz__gauge' + (dim ? ' acl-cz__gauge--dim' : '')} style={{ '--i': i }}>
                  {isF && showDecor && <div className="acl-cz__fx" style={{ top: 26 }}><Sticker label="逼近临界" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={6} size={13} /></div>}
                  <div className="acl-cz__gtop">
                    <span className="acl-cz__gname">{s.k}<small>{s.en}</small></span>
                    {showValueLabels && <span className="acl-cz__gval">{s.v}%</span>}
                  </div>
                  <div className="acl-cz__gtrack">
                    <div className="acl-cz__gfill" style={{ width: `${Math.min(100, s.v)}%`, background: c }} />
                    {showThreshold && (
                      <div className="acl-cz__thr" style={{ left: `${threshold}%`, borderLeftColor: 'var(--acl-ink)' }}>
                        {i === 0 && <span className="acl-cz__thrlab" style={{ color: 'var(--acl-ink)' }}>临界 {threshold}%</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="acl-cz__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-cz__tile">
                <div className="acl-cz__tk">{m.k}</div>
                <div className="acl-cz__tv">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-cz__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page76Squeeze.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  chartType: 'pincer',         // 'pincer' (converging walls) | 'bars' (pressure stack)
  segmentCount: 3,             // 2–4 pressure indicators
  showThreshold: true,         // danger threshold line
  showValueLabels: true,
  metricCount: 3,              // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,               // highlight 开源性能逼近 by default
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Open Source Risk',
  headline: '壁垒被压缩',
  subheadline: '风险：开源与大厂竞争',
  summary: '开源模型降低能力门槛，大厂生态<b>压缩初创独立空间</b>。',
  leftWall: { tag: 'Open Source', name: '开源社区', v: 86 },
  rightWall: { tag: 'Incumbents', name: '大厂生态', v: 72 },
  coreLabel: '被夹击的',
  coreValue: 34,
  threshold: 75,
  // pressure indicators — text not parameterized (count via segmentCount)
  pressures: [
    { k: '开源性能逼近', en: 'OSS Parity', v: 86 },
    { k: '大厂产品覆盖', en: 'Incumbent Coverage', v: 72 },
    { k: '企业自建意愿', en: 'Build In-House', v: 34 },
    { k: '价格战压力', en: 'Price Pressure', v: 58 },
  ],
  metrics: [
    { k: '开源性能逼近', v: '86', unit: '%' },
    { k: '大厂产品覆盖', v: '72', unit: '%' },
    { k: '企业自建意愿', v: '34', unit: '%' },
  ],
  closingLine: '没有壁垒的模型能力会迅速商品化。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page76Squeeze.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'pincer', options: ['pincer', 'bars'],
    label: '图表类型', desc: '竞争格局：夹击压缩(pincer) / 压力指标条(bars)' },
  { key: 'segmentCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '压力指标数量(2–4)' },
  { key: 'showThreshold', type: 'boolean', default: true,
    label: '临界线', desc: '压力条上的临界阈值虚线 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各压力指标百分比标签 显隐' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '面板底部支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个压力指标(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'segmentCount',
    label: '重点对象', desc: '被高亮的压力指标序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page76Squeeze.defaults;
export const controls = Page76Squeeze.controls;
