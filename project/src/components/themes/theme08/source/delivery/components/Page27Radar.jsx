// Page27Radar.jsx — "Capability Radar" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rd-`.
// Hero chart: a multi-axis radar comparing two series (a leader vs a baseline)
// across count-driven dimensions (4–6). Optional comparison overlay, value
// labels, and a focus axis. A side rail carries supporting delta metrics.
// No dependency on the Tweaks panel — portable ESM, all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page27Radar(props) {
  const p = { ...Page27Radar.defaults, ...props };
  const {
    backgroundTheme, dimensionCount, showCompare, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, dims, seriesA, seriesB, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  // ── radar geometry (fixed px — slide is scaled by deck-stage) ──
  const shown = dims.slice(0, Math.max(4, dimensionCount));
  const n = shown.length;
  const SQ = 580, C = SQ / 2, R = 212;
  const ang = (i) => (-90 + (i * 360) / n) * Math.PI / 180;
  const at = (i, v) => [C + R * (v / 100) * Math.cos(ang(i)), C + R * (v / 100) * Math.sin(ang(i))];
  const polyOf = (vals) => vals.map((v, i) => { const [x, y] = at(i, v); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  const rings = [25, 50, 75, 100];
  const ringPoly = (f) => shown.map((_, i) => { const [x, y] = at(i, f); return `${x.toFixed(1)},${y.toFixed(1)}`; }).join(' ');
  const aVals = shown.map((d) => d.a);
  const bVals = shown.map((d) => d.b);
  const fIdx = Math.min(focusIndex, n - 1);

  return (
    <div className="acl-root acl-rd" style={{ background: bg }}>
      <style>{`
        .acl-rd{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-rd__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-rd__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-rd__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-rd__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-rd__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-rd__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-rd__body{ flex:1; display:flex; gap:48px; margin-top:26px; min-height:0; align-items:stretch; }
        .acl-rd__chart{ flex:0 0 ${SQ}px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16); }
        .acl-rd__inner{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:${SQ}px; height:${SQ}px; }
        .acl-rd__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-rd__axlabel{ position:absolute; transform:translate(-50%,-50%); text-align:center;
          font-weight:900; font-size:26px; line-height:1; white-space:nowrap; }
        .acl-rd__axlabel span{ display:block; font-family:var(--acl-font-mono); font-weight:700;
          font-size:13px; letter-spacing:.04em; color:rgba(22,21,15,.5); margin-top:3px; }
        .acl-rd__axlabel--focus{ color:var(--acl-pink); }
        .acl-rd__axlabel--focus span{ color:var(--acl-pink); }
        .acl-rd__vlab{ position:absolute; transform:translate(-50%,-50%); z-index:5;
          font-family:var(--acl-font-num); font-size:30px; line-height:1; color:var(--acl-ink);
          text-shadow:0 0 6px var(--acl-paper),0 0 6px var(--acl-paper),0 0 6px var(--acl-paper); }
        .acl-rd__vlab--focus{ color:var(--acl-pink); }
        .acl-rd__lgd{ position:absolute; left:24px; bottom:20px; display:flex; gap:22px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:16px; z-index:6; }
        .acl-rd__lgd span{ display:flex; align-items:center; gap:8px; white-space:nowrap; }
        .acl-rd__lgd i{ width:20px; height:12px; }

        /* ── right metrics rail ── */
        .acl-rd__rail{ flex:1; display:flex; flex-direction:column; gap:16px; min-width:0; }
        .acl-rd__railhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-rd__mcards{ display:flex; flex-direction:column; gap:14px; flex:1; }
        .acl-rd__mcard{ flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 6px 0 rgba(22,21,15,.14); padding:18px 26px; display:flex; align-items:center;
          gap:20px; }
        .acl-rd__mk{ font-weight:700; font-size:27px; flex:1; min-width:0; }
        .acl-rd__mk span{ display:block; font-family:var(--acl-font-mono); font-size:13px;
          letter-spacing:.05em; text-transform:uppercase; color:rgba(22,21,15,.45); margin-top:2px; }
        .acl-rd__mv{ font-family:var(--acl-font-num); font-size:60px; line-height:.85; flex:0 0 auto;
          display:flex; align-items:baseline; gap:4px; }
        .acl-rd__mv em{ font-style:normal; font-size:30px; }
        .acl-rd__mv--up{ color:var(--acl-pink); }
        .acl-rd__mv--down{ color:#1F8A5B; }
        .acl-rd__arrow{ font-family:var(--acl-font-cn); font-size:30px; }
        .acl-rd__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rd__polyA{ opacity:0; transform-box:fill-box; transform-origin:center;
            animation:acl-rd-grow .7s cubic-bezier(.2,.8,.2,1) .2s both; }
          [data-deck-active] .acl-rd__polyB{ opacity:0; animation:acl-rd-fade .6s ease .5s both; }
          [data-deck-active] .acl-rd__mcard{ animation:acl-rd-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .35s); }
        }
        @keyframes acl-rd-grow{ from{ opacity:0; transform:scale(.4); } to{ opacity:1; transform:scale(1); } }
        @keyframes acl-rd-fade{ to{ opacity:1; } }
        @keyframes acl-rd-in{ from{ opacity:0; transform:translateX(20px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-rd__head">
        <div>
          <div className="acl-rd__eyebrow">{eyebrow}</div>
          <h1 className="acl-rd__h">{headline}</h1>
        </div>
        <div className="acl-rd__sub">{subheadline}</div>
        <div className="acl-rd__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rd__body">
        {/* ── radar ── */}
        <div className="acl-rd__chart">
          {showDecor && (
            <div style={{ position: 'absolute', right: 18, top: 16, zIndex: 6 }}>
              <Doodle kind="spark" size={42} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />
            </div>
          )}
          <div className="acl-rd__inner">
            <svg className="acl-rd__svg" viewBox={`0 0 ${SQ} ${SQ}`}>
              {/* rings */}
              {rings.map((f, i) => (
                <polygon key={i} points={ringPoly(f)} fill={i === rings.length - 1 ? 'rgba(231,230,238,.35)' : 'none'}
                  stroke="rgba(22,21,15,.2)" strokeWidth="1.5" />
              ))}
              {/* spokes */}
              {shown.map((d, i) => {
                const [x, y] = at(i, 100);
                const isF = focusEnabled && i === fIdx;
                return <line key={i} x1={C} y1={C} x2={x} y2={y}
                  stroke={isF ? 'var(--acl-pink)' : 'rgba(22,21,15,.28)'} strokeWidth={isF ? 3 : 1.5} />;
              })}
              {/* series B (baseline) */}
              {showCompare && (
                <polygon className="acl-rd__polyB" points={polyOf(bVals)} fill="var(--acl-blue)" fillOpacity="0.32"
                  stroke="var(--acl-blue)" strokeWidth="3" strokeLinejoin="round" />
              )}
              {/* series A (leader) */}
              <polygon className="acl-rd__polyA" points={polyOf(aVals)} fill="var(--acl-pink)" fillOpacity="0.34"
                stroke="var(--acl-ink)" strokeWidth="4" strokeLinejoin="round" />
              {/* vertices on A */}
              {shown.map((d, i) => { const [x, y] = at(i, d.a); const isF = focusEnabled && i === fIdx;
                return <circle key={i} cx={x} cy={y} r={isF ? 11 : 7} fill={isF ? 'var(--acl-pink)' : 'var(--acl-ink)'}
                  stroke="var(--acl-paper)" strokeWidth="3" />; })}
            </svg>

            {/* axis labels */}
            {shown.map((d, i) => {
              const [x, y] = at(i, 122);
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-rd__axlabel' + (isF ? ' acl-rd__axlabel--focus' : '')}
                  style={{ left: x, top: y }}>{d.label}<span>{d.note}</span></div>
              );
            })}
            {/* A value labels */}
            {showValueLabels && shown.map((d, i) => {
              const [x, y] = at(i, d.a + 9);
              const isF = focusEnabled && i === fIdx;
              return <div key={i} className={'acl-rd__vlab' + (isF ? ' acl-rd__vlab--focus' : '')}
                style={{ left: x, top: y }}>{d.a}</div>;
            })}
          </div>
          <div className="acl-rd__lgd">
            <span><i style={{ background: 'var(--acl-pink)' }} />{seriesA}</span>
            {showCompare && <span><i style={{ background: 'var(--acl-blue)' }} />{seriesB}</span>}
          </div>
        </div>

        {/* ── supporting delta metrics ── */}
        <div className="acl-rd__rail">
          <div className="acl-rd__railhd">同比变化 · Year-over-Year</div>
          <div className="acl-rd__mcards">
            {metrics.map((m, i) => {
              const up = m.dir !== 'down';
              return (
                <div key={i} className="acl-rd__mcard" style={{ '--i': i }}>
                  <div className="acl-rd__mk">{m.k}<span>{m.sub}</span></div>
                  <div className={'acl-rd__mv ' + (up ? 'acl-rd__mv--up' : 'acl-rd__mv--down')}>
                    <span className="acl-rd__arrow">{up ? '▲' : '▼'}</span>{m.v}<em>%</em>
                  </div>
                </div>
              );
            })}
          </div>
          {showDecor && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <Sticker label="资源整合 = 竞争力" color="var(--acl-yellow)" rotate={-2} size={18} />
            </div>
          )}
        </div>
      </div>

      <div className="acl-rd__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page27Radar.defaults = {
  backgroundTheme: 'primary',
  dimensionCount: 5,       // 4–6 radar axes
  showCompare: true,       // overlay the baseline series
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  eyebrow: 'Model Lab Race',
  headline: '算力、数据、人才与渠道',
  subheadline: '模型实验室竞争',
  summary: '模型实验室竞争不只看模型指标，更看<b>资源整合能力</b>。',
  // each dim: label + note + series A (leader) + series B (baseline), 0–100
  dims: [
    { label: '算力', note: 'Compute', a: 92, b: 58 },
    { label: '数据', note: 'Data', a: 84, b: 55 },
    { label: '人才', note: 'Talent', a: 88, b: 60 },
    { label: '渠道', note: 'Channel', a: 80, b: 48 },
    { label: '模型', note: 'Model', a: 90, b: 62 },
    { label: '资本', note: 'Capital', a: 86, b: 50 },
  ],
  seriesA: '头部实验室',
  seriesB: '行业均值',
  // supporting delta metrics (from key_metrics) — dir 'up' | 'down' for coloring
  metrics: [
    { k: '算力预算', sub: 'Compute budget', v: '64', dir: 'up' },
    { k: '研究团队', sub: 'Research team', v: '38', dir: 'up' },
    { k: '企业 API 客户', sub: 'Enterprise API', v: '52', dir: 'up' },
    { k: '推理成本', sub: 'Inference cost', v: '21', dir: 'down' },
  ],
  closingLine: '模型能力只是入口，交付能力才是商业化。',
};

Page27Radar.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'dimensionCount', type: 'number', default: 5, min: 4, max: 6, step: 1,
    label: '维度数量', desc: '雷达图坐标轴(维度)数量(4–6)' },
  { key: 'showCompare', type: 'boolean', default: true,
    label: '对比系列', desc: '叠加第二条基准系列(行业均值)多边形' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '在主系列各顶点显示数值' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一条维度坐标轴' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 5, step: 1, maxFrom: 'dimensionCount',
    label: '重点对象', desc: '被高亮的维度序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page27Radar.defaults;
export const controls = Page27Radar.controls;
