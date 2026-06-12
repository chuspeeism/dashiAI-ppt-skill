// Page25CapitalCurve.jsx — "Capital Concentration Curve" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cc-`.
// Hero chart: a cumulative concentration curve (Lorenz-style) showing how a small
// head of items captures most of the total. Nodes are count-driven (2–5), the
// fill style switches (area / line / step), an optional equality baseline gives
// a reference, value labels + a focus node round it out.
// No dependency on the Tweaks panel — portable ESM, all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page25CapitalCurve(props) {
  const p = { ...Page25CapitalCurve.defaults, ...props };
  const {
    backgroundTheme, chartType, nodeCount, showBaseline, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, nodes, axisXLabel, axisYLabel,
    valueUnit, focusNote, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  // ── chart geometry (fixed px — the whole slide is scaled by deck-stage) ──
  const shown = nodes.slice(0, Math.max(2, nodeCount));
  const n = shown.length;
  const CW = 1480, CH = 470;
  const maxY = 100; // cumulative share tops out at 100%
  // x is positioned by EVEN index spacing (categorical) so labels never bunch up
  // at the head; y still encodes the cumulative share so the concentration shape
  // reads clearly. The curve anchors at the origin (0,0).
  const px = (i) => ((i + 1) / n) * CW;
  const py = (v) => CH - (v / maxY) * CH;
  const pts = shown.map((d, i) => ({ x: px(i), y: py(d.v), d }));

  // primary cumulative path (starts at origin)
  let line = `M0 ${CH.toFixed(1)} `;
  if (chartType === 'step') {
    let prevY = CH;
    pts.forEach((pt) => { line += `L${pt.x.toFixed(1)} ${prevY.toFixed(1)} L${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `; prevY = pt.y; });
  } else {
    pts.forEach((pt) => { line += `L${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `; });
  }
  const area = `${line} L${pts[n - 1].x.toFixed(1)} ${CH} L0 ${CH} Z`;
  const lastX = pts[n - 1].x;
  const gy = [0.25, 0.5, 0.75, 1];
  const fIdx = Math.min(focusIndex, n - 1);

  return (
    <div className="acl-root acl-cc" style={{ background: bg }}>
      <style>{`
        .acl-cc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-cc__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-cc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-cc__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-cc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-cc__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-cc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-cc__panel{ position:relative; flex:1; margin-top:34px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 56px 26px 70px; display:flex; flex-direction:column; }
        .acl-cc__legend{ display:flex; gap:26px; align-items:center; font-family:var(--acl-font-mono);
          font-size:17px; font-weight:700; }
        .acl-cc__legend span{ display:flex; align-items:center; gap:9px; white-space:nowrap; }
        .acl-cc__legend i{ width:22px; height:12px; background:var(--acl-pink); }
        .acl-cc__legend .ln{ width:26px; height:0; border-top:3px dashed rgba(22,21,15,.45); }
        .acl-cc__yaxis{ position:absolute; left:18px; top:50%; transform:rotate(-90deg) translateX(50%);
          transform-origin:left center; font-family:var(--acl-font-mono); font-size:15px; font-weight:700;
          letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.5); white-space:nowrap; }
        .acl-cc__plot{ position:relative; flex:1; margin-top:14px; min-height:0; }
        .acl-cc__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.16); }
        .acl-cc__gridv{ position:absolute; left:-46px; transform:translateY(-50%);
          font-family:var(--acl-font-mono); font-size:14px; color:rgba(22,21,15,.42); }
        .acl-cc__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-cc__node{ position:absolute; width:17px; height:17px; border-radius:50%;
          background:var(--acl-ink); border:3px solid var(--acl-paper); transform:translate(-50%,-50%);
          box-shadow:0 0 0 2px var(--acl-ink); z-index:3; transition:.25s; }
        .acl-cc__node--focus{ width:26px; height:26px; background:var(--acl-pink); box-shadow:0 0 0 3px var(--acl-ink); z-index:5; }
        .acl-cc__vlabel{ position:absolute; transform:translate(-50%,-100%); z-index:4;
          font-family:var(--acl-font-num); font-size:30px; line-height:1; color:var(--acl-ink);
          white-space:nowrap; text-shadow:0 0 7px var(--acl-paper),0 0 7px var(--acl-paper),0 0 7px var(--acl-paper); }
        .acl-cc__vlabel em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700;
          font-size:16px; margin-left:2px; color:rgba(22,21,15,.55); }
        .acl-cc__vlabel--focus{ color:var(--acl-pink); }
        .acl-cc__flag{ position:absolute; transform:translate(-50%,-100%); z-index:6; }
        .acl-cc__xaxis{ display:flex; margin-top:12px; padding-bottom:2px; }
        .acl-cc__xtick{ position:absolute; transform:translateX(-50%); text-align:center; }
        .acl-cc__xtick b{ display:block; font-weight:900; font-size:26px; line-height:1; }
        .acl-cc__xtick span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-cc__xtick--focus b{ color:var(--acl-pink); }
        .acl-cc__xwrap{ position:relative; height:62px; margin-top:8px; }
        .acl-cc__xname{ position:absolute; right:0; bottom:-2px; font-family:var(--acl-font-mono);
          font-size:15px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-cc__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cc__draw{ stroke-dasharray:3600; stroke-dashoffset:3600;
            animation:acl-cc-draw 1.1s cubic-bezier(.3,.7,.3,1) .15s forwards; }
          [data-deck-active] .acl-cc__fill{ opacity:0; animation:acl-cc-fade .7s ease .7s forwards; }
          [data-deck-active] .acl-cc__node{ opacity:0; animation:acl-cc-pop .4s cubic-bezier(.2,.9,.3,1.3) both;
            animation-delay:calc(var(--i,0) * .12s + .55s); }
        }
        @keyframes acl-cc-draw{ to{ stroke-dashoffset:0; } }
        @keyframes acl-cc-fade{ to{ opacity:1; } }
        @keyframes acl-cc-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.4); } to{ opacity:1; } }
      `}</style>

      <div className="acl-cc__head">
        <div>
          <div className="acl-cc__eyebrow">{eyebrow}</div>
          <h1 className="acl-cc__h">{headline}</h1>
        </div>
        <div className="acl-cc__sub">{subheadline}</div>
        <div className="acl-cc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-cc__panel">
        <div className="acl-cc__legend">
          <span><i />累计资金占比 · {valueUnit}</span>
          {showBaseline && <span><i className="ln" />均匀分布参考线</span>}
          {showDecor && <Doodle kind="spark" size={38} rotate={8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto' }} />}
        </div>
        <div className="acl-cc__yaxis">{axisYLabel}</div>

        <div className="acl-cc__plot">
          {gy.map((f, i) => (
            <React.Fragment key={i}>
              <div className="acl-cc__grid" style={{ top: `${(1 - f) * 100}%` }} />
              <div className="acl-cc__gridv" style={{ top: `${(1 - f) * 100}%` }}>{Math.round(maxY * f)}</div>
            </React.Fragment>
          ))}

          <svg className="acl-cc__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
            {showBaseline && (
              <path d={`M0 ${CH} L${CW} 0`} fill="none"
                stroke="rgba(22,21,15,.4)" strokeWidth="2.5" strokeDasharray="6 8"
                strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            )}
            {chartType === 'area' && <path className="acl-cc__fill" d={area} fill="var(--acl-pink)" fillOpacity="0.7" stroke="none" />}
            <path className="acl-cc__draw" d={line} fill="none" stroke="var(--acl-ink)" strokeWidth="5"
              strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          {pts.map((pt, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <React.Fragment key={i}>
                <div className={'acl-cc__node' + (isF ? ' acl-cc__node--focus' : '')} style={{ '--i': i,
                  left: `${(pt.x / CW) * 100}%`, top: `${(pt.y / CH) * 100}%` }} />
                {showValueLabels && (
                  <div className={'acl-cc__vlabel' + (isF ? ' acl-cc__vlabel--focus' : '')}
                    style={{ left: `${(pt.x / CW) * 100}%`, top: `calc(${(pt.y / CH) * 100}% - 18px)` }}>
                    {pt.d.v}<em>%</em>
                  </div>
                )}
                {showDecor && isF && (
                  <div className="acl-cc__flag" style={{ left: `${(pt.x / CW) * 100}%`, top: `calc(${(pt.y / CH) * 100}% - 62px)` }}>
                    <Sticker label={focusNote} color="var(--acl-yellow)" rotate={-5} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="acl-cc__xwrap">
          {pts.map((pt, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-cc__xtick' + (isF ? ' acl-cc__xtick--focus' : '')}
                style={{ left: `calc(${(pt.x / CW) * 100}% )` }}>
                <b>{pt.d.label}</b>
                <span>{pt.d.sub}</span>
              </div>
            );
          })}
          <div className="acl-cc__xname">{axisXLabel} →</div>
        </div>
      </div>

      <div className="acl-cc__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page25CapitalCurve.defaults = {
  backgroundTheme: 'primary',
  chartType: 'area',       // 'area' | 'line' | 'step'
  nodeCount: 4,            // 2–5 cumulative nodes
  showBaseline: true,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 3,           // highlight the Top 50 node by default
  showDecor: true,
  eyebrow: 'Capital Curve',
  headline: '累计资金分布',
  subheadline: '资本集中曲线',
  summary: '资金高度向头部集中——<b>少数公司吸走大部分融资</b>。',
  // x = share of population (0..1); v = cumulative % of capital captured.
  nodes: [
    { label: 'Top 3', sub: '头部', x: 0.031, v: 18.7 },
    { label: 'Top 10', sub: '前十', x: 0.103, v: 23.8 },
    { label: 'Top 25', sub: '前廿五', x: 0.258, v: 48.5 },
    { label: 'Top 50', sub: '过半', x: 0.515, v: 71.2 },
    { label: '全部', sub: '97 笔', x: 1.0, v: 100 },
  ],
  axisXLabel: '公司数量（由多到少）',
  axisYLabel: '累计资金占比 %',
  valueUnit: '%',
  focusNote: '过半公司 ≈ 七成资金',
  closingLine: '集中度本身就是市场结构。',
};

Page25CapitalCurve.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'area', options: ['area', 'line', 'step'],
    label: '图表类型', desc: '累计曲线的呈现：面积 / 折线 / 阶梯' },
  { key: 'nodeCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '节点数量', desc: '累计曲线上的阶段节点数量(2–5)' },
  { key: 'showBaseline', type: 'boolean', default: true,
    label: '参考基线', desc: '均匀分布(对角)参考线的显示/隐藏' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '在各节点上显示数值' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个阶段节点' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 4, step: 1, maxFrom: 'nodeCount',
    label: '重点对象', desc: '被高亮的节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page25CapitalCurve.defaults;
export const controls = Page25CapitalCurve.controls;
