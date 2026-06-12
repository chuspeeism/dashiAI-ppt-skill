// Page05Trend.jsx — "Trend Chart" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-tr-`.
// Showcases a chart as the hero: a primary amount series (column / area / line)
// plus an optional secondary trend line, value labels, and a focus point.
// No dependency on the Tweaks panel — the preview maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const niceCeil = (v) => {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p) * p >= v * 1.08 ? Math.ceil(v / p) * p : Math.ceil((v * 1.12) / p) * p;
};

export default function Page05Trend(props) {
  const p = { ...Page05Trend.defaults, ...props };
  const {
    backgroundTheme, chartType, focusEnabled, focusIndex, showTrendLine, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, points, amountUnit, countUnit, peakNote, trendNote, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  // ── chart geometry (fixed px — the whole slide is scaled by deck-stage) ──
  const n = points.length;
  const CW = 1500, CH = 360;
  const band = CW / n;
  const barW = Math.min(150, band * 0.42);
  const maxAmount = niceCeil(Math.max(...points.map((d) => d.amount)));
  const maxCount = niceCeil(Math.max(...points.map((d) => d.count)));
  const cx = (i) => band * (i + 0.5);
  const yA = (v) => CH - (v / maxAmount) * CH;
  const yC = (v) => CH - ((v / maxCount) * CH * 0.84) - CH * 0.08;

  const amountPath = points.map((d, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${yA(d.amount).toFixed(1)}`).join(' ');
  const areaPath = `${amountPath} L${cx(n - 1).toFixed(1)} ${CH} L${cx(0).toFixed(1)} ${CH} Z`;
  const countPath = points.map((d, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${yC(d.count).toFixed(1)}`).join(' ');
  const gy = [0.25, 0.5, 0.75, 1].map((f) => CH - f * CH);

  return (
    <div className="acl-root acl-tr" style={{ background: bg }}>
      <style>{`
        .acl-tr{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-tr__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-tr__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-tr__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-tr__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-tr__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-tr__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-tr__panel{ position:relative; flex:1; margin-top:34px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:34px 46px 30px; display:flex; flex-direction:column; }
        .acl-tr__legend{ display:flex; gap:26px; align-items:center; font-family:var(--acl-font-mono);
          font-size:17px; font-weight:700; }
        .acl-tr__legend span{ display:flex; align-items:center; gap:9px; white-space:nowrap; flex:0 0 auto; }
        .acl-tr__legend i{ width:22px; height:12px; }
        .acl-tr__legend .ln{ width:26px; height:0; border-top:3px dashed var(--acl-blue); }
        .acl-tr__plot{ position:relative; flex:1; margin-top:18px; }
        .acl-tr__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.16); }
        .acl-tr__gridv{ position:absolute; font-family:var(--acl-font-mono); font-size:13px;
          color:rgba(22,21,15,.4); left:0; transform:translateY(-50%); }
        .acl-tr__bars{ position:absolute; left:0; bottom:0; width:100%; height:100%; }
        .acl-tr__bar{ position:absolute; bottom:0; background:var(--acl-ink);
          box-shadow:3px 0 0 rgba(22,21,15,.12); transition:height .4s, background .3s; }
        .acl-tr__bar--focus{ background:var(--acl-pink); box-shadow:3px 3px 0 rgba(22,21,15,.22); }
        .acl-tr__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-tr__vlabel{ position:absolute; transform:translate(-50%,-100%); font-family:var(--acl-font-num);
          font-size:34px; line-height:1; color:var(--acl-ink); white-space:nowrap;
          text-shadow:0 0 7px var(--acl-paper), 0 0 7px var(--acl-paper), 0 0 7px var(--acl-paper); }
        .acl-tr__vlabel em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; color:rgba(22,21,15,.55); }
        .acl-tr__vlabel--focus{ color:var(--acl-pink); }
        .acl-tr__dot{ position:absolute; width:15px; height:15px; border-radius:50%;
          background:var(--acl-blue); border:3px solid var(--acl-ink); transform:translate(-50%,-50%); }
        .acl-tr__xaxis{ display:flex; margin-top:14px; }
        .acl-tr__xtick{ flex:1; text-align:center; }
        .acl-tr__xtick b{ display:block; font-weight:900; font-size:30px; }
        .acl-tr__xtick span{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-tr__xtick em{ display:block; font-style:normal; font-weight:700; font-size:18px;
          color:rgba(22,21,15,.66); margin-top:2px; }
        .acl-tr__xtick--focus b, .acl-tr__xtick--focus em{ color:var(--acl-pink); }
        .acl-tr__anno{ position:absolute; font-family:var(--acl-font-hand); font-size:30px;
          color:var(--acl-ink); white-space:nowrap; z-index:5; }
        .acl-tr__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-tr__bar{ animation:acl-tr-grow .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-tr-grow{ from{ transform:scaleY(0); transform-origin:bottom; } to{ transform:none; } }
      `}</style>

      <div className="acl-tr__head">
        <div>
          <div className="acl-tr__eyebrow">{eyebrow}</div>
          <h1 className="acl-tr__h">{headline}</h1>
        </div>
        <div className="acl-tr__sub">{subheadline}</div>
        <div className="acl-tr__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-tr__panel">
        <div className="acl-tr__legend">
          <span><i style={{ background: 'var(--acl-ink)' }} />融资额 · {amountUnit}</span>
          {showTrendLine && <span><i className="ln" />事件数 · {countUnit}</span>}
          {showDecor && <Doodle kind="spark" size={38} rotate={8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto' }} />}
        </div>

        <div className="acl-tr__plot">
          {/* gridlines */}
          {gy.map((y, i) => (
            <React.Fragment key={i}>
              <div className="acl-tr__grid" style={{ top: `${(y / CH) * 100}%` }} />
              <div className="acl-tr__gridv" style={{ top: `${(y / CH) * 100}%` }}>
                {Math.round(maxAmount * (1 - y / CH))}
              </div>
            </React.Fragment>
          ))}

          {/* bars (column mode) */}
          {chartType === 'column' && (
            <div className="acl-tr__bars">
              {points.map((d, i) => {
                const isF = focusEnabled && i === focusIndex;
                return (
                  <div key={i} className={'acl-tr__bar' + (isF ? ' acl-tr__bar--focus' : '')}
                    style={{ left: `${((cx(i) - barW / 2) / CW) * 100}%`, width: `${(barW / CW) * 100}%`,
                      height: `${((CH - yA(d.amount)) / CH) * 100}%` }} />
                );
              })}
            </div>
          )}

          {/* area / line modes + secondary trend line */}
          <svg className="acl-tr__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
            {chartType === 'area' && <path d={areaPath} fill="var(--acl-pink)" fillOpacity="0.9" stroke="none" vectorEffect="non-scaling-stroke" />}
            {(chartType === 'area' || chartType === 'line') && (
              <path d={amountPath} fill="none" stroke="var(--acl-ink)" strokeWidth="4"
                strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            )}
            {showTrendLine && (
              <path d={countPath} fill="none" stroke="var(--acl-blue)" strokeWidth="3.5"
                strokeDasharray="3 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {/* secondary line dots + value labels (HTML overlay, px-aligned) */}
          {points.map((d, i) => {
            const isF = focusEnabled && i === focusIndex;
            const topPx = chartType === 'column' ? yA(d.amount) : (chartType === 'line' || chartType === 'area' ? yA(d.amount) : yA(d.amount));
            return (
              <React.Fragment key={i}>
                {showTrendLine && (
                  <div className="acl-tr__dot" style={{ left: `${(cx(i) / CW) * 100}%`, top: `${(yC(d.count) / CH) * 100}%` }} />
                )}
                {showValueLabels && (
                  <div className={'acl-tr__vlabel' + (isF ? ' acl-tr__vlabel--focus' : '')}
                    style={{ left: `${(cx(i) / CW) * 100}%`, top: `calc(${(topPx / CH) * 100}% - 22px)`, transform: 'translate(-50%,-100%)' }}>
                    {d.amount}<em>{amountUnit}</em>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* focus annotation */}
          {showDecor && focusEnabled && (
            <React.Fragment>
              <div className="acl-tr__anno" style={{ left: `${(cx(focusIndex) / CW) * 100}%`, top: -6, transform: 'translateX(-50%)' }}>
                {peakNote}
              </div>
              <div className="fx" style={{ position: 'absolute', left: `${(cx(focusIndex) / CW) * 100}%`, top: `${(yA(points[focusIndex].amount) / CH) * 100}%`, transform: `translate(${barW / 2 + 16}px,-4px)`, zIndex: 6 }}>
                <Sticker label="峰值" color="var(--acl-yellow)" rotate={6} />
              </div>
            </React.Fragment>
          )}

        </div>

        {/* x axis */}
        <div className="acl-tr__xaxis">
          {points.map((d, i) => {
            const isF = focusEnabled && i === focusIndex;
            return (
              <div key={i} className={'acl-tr__xtick' + (isF ? ' acl-tr__xtick--focus' : '')}>
                <b>{d.label}</b>
                <span>{d.sub}</span>
                <em>{d.count} {countUnit}</em>
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-tr__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page05Trend.defaults = {
  backgroundTheme: 'primary',
  chartType: 'column',     // 'column' | 'area' | 'line'
  focusEnabled: true,
  focusIndex: 2,
  showTrendLine: true,
  showValueLabels: true,
  showDecor: true,
  eyebrow: 'Market Panorama',
  headline: '市场全景 · 纵向趋势',
  subheadline: '逐季度融资额走势',
  summary: '热度在 <b>Q2 与 Q3 达峰</b>，Q4 理性回落但仍处高位。',
  points: [
    { label: 'Q1', sub: 'Jan–Mar', amount: 162, count: 18 },
    { label: 'Q2', sub: 'Apr–Jun', amount: 284, count: 26 },
    { label: 'Q3', sub: 'Jul–Sep', amount: 318, count: 31 },
    { label: 'Q4', sub: 'Oct–Dec', amount: 206, count: 22 },
  ],
  amountUnit: '亿美元',
  countUnit: '笔',
  peakNote: '全年最高点 →',
  trendNote: '事件数同步走高',
  closingLine: '高峰过后不是崩塌，而是市场开始筛选。',
};

Page05Trend.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'column', options: ['column', 'area', 'line'],
    label: '图表类型', desc: '主数据系列的呈现：柱状 / 面积 / 折线' },
  { key: 'showTrendLine', type: 'boolean', default: true,
    label: '副线(事件数)', desc: '叠加第二条趋势线及节点' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '在数据点上显示数值' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个数据点(峰值)' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '重点对象', desc: '被高亮的数据点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page05Trend.defaults;
export const controls = Page05Trend.controls;
