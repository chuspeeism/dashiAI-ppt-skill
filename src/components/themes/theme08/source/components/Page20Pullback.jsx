// Page20Pullback.jsx — "Single-track Timeline + Curve" template page (timeline-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pl-`.
// One horizontal track of period nodes whose height encodes a value, joined by
// an optional rise/fall curve (connected-scatter timeline). Count-driven nodes,
// optional curve/area, value labels and per-node delta badge, and a focusable
// node. Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page20Pullback(props) {
  const p = { ...Page20Pullback.defaults, ...props };
  const {
    backgroundTheme, nodeCount, showCurve, showValueLabels, showDelta, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, nodes, unit, deckNote, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = nodes.slice(0, Math.max(2, nodeCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);

  // ── plot geometry: x evenly spaced, y encodes value ──
  const n = shown.length, CW = 1000, CH = 460;
  const padX = CW / (n * 2);
  const maxV = Math.max(...shown.map((d) => d.v)) * 1.16;
  const cx = (i) => padX + (i / Math.max(1, n - 1)) * (CW - padX * 2);
  const cy = (v) => CH - (v / maxV) * CH;
  const line = shown.map((d, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${cy(d.v).toFixed(1)}`).join(' ');
  const areaP = `${line} L${cx(n - 1).toFixed(1)} ${CH} L${cx(0).toFixed(1)} ${CH} Z`;

  return (
    <div className="acl-root acl-pl" style={{ background: bg }}>
      <style>{`
        .acl-pl{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 64px; display:flex; flex-direction:column; }
        .acl-pl__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-pl__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-pl__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-pl__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-pl__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pl__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-pl__panel{ flex:1; margin-top:30px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:46px 56px 40px; display:flex; flex-direction:column; }
        .acl-pl__plot{ position:relative; flex:1; min-height:0; }
        .acl-pl__base{ position:absolute; left:0; right:0; bottom:0; height:0; border-top:4px dashed var(--acl-ink); }
        .acl-pl__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.14); }
        .acl-pl__gridlab{ position:absolute; right:100%; margin-right:14px; transform:translateY(-50%);
          font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.04em; color:rgba(22,21,15,.4); white-space:nowrap; }
        .acl-pl__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-pl__node{ position:absolute; transform:translateX(-50%); display:flex; flex-direction:column;
          align-items:center; bottom:0; }
        .acl-pl__stem{ width:0; border-left:3px dashed rgba(22,21,15,.3); }
        .acl-pl__dot{ width:30px; height:30px; border-radius:50%; background:var(--acl-paper);
          border:5px solid var(--acl-ink); position:absolute; transform:translate(-50%,-50%); z-index:2; transition:.25s; }
        .acl-pl__dot--focus{ width:42px; height:42px; background:var(--acl-pink); }
        .acl-pl__val{ position:absolute; transform:translate(-50%,-100%); font-family:var(--acl-font-num);
          font-size:52px; line-height:.9; white-space:nowrap; z-index:3;
          text-shadow:0 0 8px var(--acl-paper),0 0 8px var(--acl-paper),0 0 8px var(--acl-paper); }
        .acl-pl__val em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:4px; opacity:.6; }
        .acl-pl__val--focus{ color:var(--acl-pink); }
        .acl-pl__cap{ position:absolute; bottom:-66px; transform:translateX(-50%); text-align:center; white-space:nowrap; }
        .acl-pl__cap b{ display:block; font-weight:900; font-size:34px; line-height:1; }
        .acl-pl__cap span{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-pl__cap--focus b{ color:var(--acl-pink); }
        .acl-pl__delta{ position:absolute; transform:translate(-50%,-50%); z-index:5; display:inline-flex;
          align-items:center; gap:7px; font-family:var(--acl-font-num); font-size:30px; line-height:1;
          background:var(--acl-red); color:var(--acl-paper); padding:9px 15px;
          box-shadow:3px 4px 0 rgba(22,21,15,.25); white-space:nowrap; }
        .acl-pl__nfx{ position:absolute; transform:translate(-50%,-100%); z-index:6; }
        .acl-pl__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pl__node, [data-deck-active] .acl-pl__valwrap{
            animation:acl-pl-in .5s cubic-bezier(.2,.8,.2,1) both; animation-delay:calc(var(--i,0) * .1s + .1s); }
        }
        @keyframes acl-pl-in{ from{ opacity:0; transform:translate(-50%,16px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-pl__head">
        <div>
          <div className="acl-pl__eyebrow">{eyebrow}</div>
          <h1 className="acl-pl__h">{headline}</h1>
        </div>
        <div className="acl-pl__sub">{subheadline}</div>
        <div className="acl-pl__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pl__panel">
        <div className="acl-pl__plot">
          <div className="acl-pl__base" />
          {[0.25, 0.5, 0.75].map((f, i) => (
            <div key={i} className="acl-pl__grid" style={{ top: `${(1 - f) * 100}%` }}>
              <span className="acl-pl__gridlab">{Math.round((maxV * f) / 10) * 10}</span>
            </div>
          ))}

          {/* curve + area */}
          {showCurve && (
            <svg className="acl-pl__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
              <path d={areaP} fill="var(--acl-blue)" fillOpacity="0.26" />
              <path d={line} fill="none" stroke="var(--acl-ink)" strokeWidth="5"
                strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}

          {/* stems + dots + value labels + captions */}
          {shown.map((d, i) => {
            const isF = focusEnabled && i === fIdx;
            const xPct = (cx(i) / CW) * 100, yPct = (cy(d.v) / CH) * 100;
            return (
              <React.Fragment key={i}>
                {/* stem from baseline up to the dot */}
                <div className="acl-pl__node" style={{ left: `${xPct}%`, '--i': i }}>
                  <div className="acl-pl__stem" style={{ height: `calc((100% - 0px) * ${(1 - cy(d.v) / CH).toFixed(3)})` }} />
                </div>
                <div className={'acl-pl__dot' + (isF ? ' acl-pl__dot--focus' : '')}
                  style={{ left: `${xPct}%`, top: `${yPct}%` }} />
                {showValueLabels && (
                  <div className={'acl-pl__val' + (isF ? ' acl-pl__val--focus' : '')}
                    style={{ left: `${xPct}%`, top: `calc(${yPct}% - 26px)` }}>{d.v}<em>{unit}</em></div>
                )}
                <div className={'acl-pl__cap' + (isF ? ' acl-pl__cap--focus' : '')} style={{ left: `${xPct}%` }}>
                  <b>{d.label}</b><span>{d.note}</span>
                </div>
                {isF && showDelta && d.delta != null && (
                  <div className="acl-pl__delta" style={{ left: `${xPct}%`, top: `calc(${yPct}% + 64px)` }}>
                    <span>▼</span>{Math.abs(d.delta)}% vs 上期
                  </div>
                )}
                {isF && showDecor && (
                  <div className="acl-pl__nfx" style={{ left: `${xPct}%`, top: `calc(${yPct}% - 86px)` }}>
                    <Sticker label={deckNote} color="var(--acl-yellow)" rotate={-5} />
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {showDecor && (
            <Doodle kind="arrow" size={104} rotate={148} color="var(--acl-ink)"
              style={{ right: '6%', top: '14%' }} />
          )}
        </div>
      </div>

      <div className="acl-pl__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page20Pullback.defaults = {
  backgroundTheme: 'muted',
  nodeCount: 4,            // 2–4 timeline nodes
  showCurve: true,
  showValueLabels: true,
  showDelta: true,
  focusEnabled: true,
  focusIndex: 3,           // spotlight the latest node by default
  showDecor: true,
  eyebrow: 'Quarter Breakdown',
  headline: '理性回落季度',
  subheadline: 'Q4 融资拆解',
  summary: 'Q4 较 Q3 回落，但<b>仍高于年初水平</b>，资金并未完全撤离。',
  nodes: [
    { label: 'Q1', note: '冷启动', v: 162, delta: null },
    { label: 'Q2', note: '加速', v: 284, delta: 75.3 },
    { label: 'Q3', note: '峰值', v: 318, delta: 12.0 },
    { label: 'Q4', note: '理性回落', v: 206, delta: 35.2 },
  ],
  unit: '亿',
  deckNote: '仍处高位',
  closingLine: '回落不是终点，而是分化的开始。',
};

Page20Pullback.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'nodeCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '节点数量', desc: '时间轴上的节点数量(2–4)' },
  { key: 'showCurve', type: 'boolean', default: true,
    label: '趋势曲线', desc: '连接各节点的升降曲线与面积的显示/隐藏' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各节点上方的数值显示/隐藏' },
  { key: 'showDelta', type: 'boolean', default: true,
    label: '环比徽标', desc: '重点节点的环比变化徽标显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个节点' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 3, step: 1, maxFrom: 'nodeCount',
    label: '重点对象', desc: '被高亮的节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page20Pullback.defaults;
export const controls = Page20Pullback.controls;
