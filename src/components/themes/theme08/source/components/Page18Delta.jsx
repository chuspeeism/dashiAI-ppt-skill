// Page18Delta.jsx — "Metric Table with Delta" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-dl-`.
// A structured metric table: dimension · current value · period-over-period
// delta badge · per-row trend sparkline. Count-driven rows, optional delta and
// sparkline columns, optional trend-based colour, and a focusable highlight row.
// Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

function AclDlSpark({ data, color }) {
  const n = data.length, W = 200, H = 56;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const cx = (i) => (i / (n - 1)) * W;
  const cy = (v) => H - 6 - ((v - min) / span) * (H - 12);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${cy(v).toFixed(1)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="56" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d={area} fill={color} fillOpacity="0.16" />
      <path d={line} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round"
        strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={cx(n - 1)} cy={cy(data[n - 1])} r="6" fill={color} />
    </svg>
  );
}

export default function Page18Delta(props) {
  const p = { ...Page18Delta.defaults, ...props };
  const {
    backgroundTheme, rowCount, showDelta, showSpark, colorByTrend, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, rows, columnLabels, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const upColor = 'var(--acl-blue)', downColor = 'var(--acl-red)';
  const cols = `1fr 360px${showDelta ? ' 260px' : ''}${showSpark ? ' 280px' : ''}`;

  return (
    <div className="acl-root acl-dl" style={{ background: bg }}>
      <style>{`
        .acl-dl{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-dl__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-dl__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-dl__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-dl__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-dl__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-dl__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-dl__panel{ position:relative; flex:1; margin-top:34px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:14px 44px 22px; display:flex; flex-direction:column; }
        .acl-dl__colhead{ display:grid; grid-template-columns:${cols}; align-items:center; gap:30px;
          padding:14px 8px 12px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:15px; letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-dl__colhead .r{ text-align:right; }
        .acl-dl__colhead .c{ text-align:center; }
        .acl-dl__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-dl__row{ flex:1; display:grid; grid-template-columns:${cols}; align-items:center; gap:30px;
          padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.2); position:relative; transition:background .25s; }
        .acl-dl__row:last-child{ border-bottom:none; }
        .acl-dl__dim{ display:flex; flex-direction:column; gap:2px; }
        .acl-dl__dim b{ font-weight:900; font-size:34px; line-height:1; }
        .acl-dl__dim span{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.46); }
        .acl-dl__val{ font-family:var(--acl-font-num); font-size:54px; line-height:.9; text-align:right; white-space:nowrap; }
        .acl-dl__val em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:5px; opacity:.6; }
        .acl-dl__delta{ justify-self:center; display:inline-flex; align-items:center; gap:8px;
          font-family:var(--acl-font-num); font-size:34px; line-height:1; padding:8px 16px;
          border:3px solid var(--acl-ink); white-space:nowrap; }
        .acl-dl__delta .ar{ font-size:28px; }
        .acl-dl__spark{ align-self:center; width:100%; }
        .acl-dl__row--focus{ background:var(--acl-ink); color:var(--acl-paper);
          box-shadow:6px 0 0 var(--acl-ink), -6px 0 0 var(--acl-ink); border-bottom-color:transparent; z-index:2; }
        .acl-dl__row--focus .acl-dl__dim span{ color:rgba(255,255,255,.55); }
        .acl-dl__fx{ position:absolute; top:-14px; left:120px; z-index:5; }
        .acl-dl__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-dl__row{ animation:acl-dl-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .06s); }
        }
        @keyframes acl-dl-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-dl__head">
        <div>
          <div className="acl-dl__eyebrow">{eyebrow}</div>
          <h1 className="acl-dl__h">{headline}</h1>
        </div>
        <div className="acl-dl__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-dl__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-dl__panel">
        <div className="acl-dl__colhead">
          <span>{columnLabels[0]}</span>
          <span className="r">{columnLabels[1]}</span>
          {showDelta && <span className="c">{columnLabels[2]}</span>}
          {showSpark && <span className="c">{columnLabels[3]}</span>}
        </div>
        <div className="acl-dl__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            const up = r.delta >= 0;
            const tcolor = colorByTrend ? (up ? upColor : downColor) : 'var(--acl-ink)';
            return (
              <div key={i} className={'acl-dl__row' + (isF ? ' acl-dl__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-dl__fx"><Sticker label="加速信号" color="var(--acl-yellow)" rotate={6} /></div>}
                <div className="acl-dl__dim"><b>{r.dim}</b><span>{r.en}</span></div>
                <div className="acl-dl__val">{r.value}<em>{r.unit}</em></div>
                {showDelta && (
                  <div className="acl-dl__delta" style={{ background: isF ? 'transparent' : tcolor,
                    color: isF ? 'var(--acl-paper)' : (up ? 'var(--acl-ink)' : 'var(--acl-paper)'),
                    borderColor: isF ? 'var(--acl-paper)' : 'var(--acl-ink)' }}>
                    <span className="ar">{up ? '▲' : '▼'}</span>{Math.abs(r.delta)}{r.deltaUnit || '%'}
                  </div>
                )}
                {showSpark && (
                  <div className="acl-dl__spark">
                    <AclDlSpark data={r.spark} color={isF ? 'var(--acl-yellow)' : tcolor} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-dl__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page18Delta.defaults = {
  backgroundTheme: 'muted',
  rowCount: 4,             // 2–5 metric rows
  showDelta: true,
  showSpark: true,
  colorByTrend: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  eyebrow: 'Quarter Breakdown',
  headline: '加速季度',
  subheadline: 'Q2 融资拆解',
  summary: 'Q2 进入明显加速期，模型、应用与基础设施<b>同步升温</b>。',
  columnLabels: ['维度', '本期值', '环比', '趋势'],
  rows: [
    { dim: '融资额', en: 'Funding', value: '284', unit: '亿', delta: 75.3, spark: [120, 162, 210, 284] },
    { dim: '事件数', en: 'Deals', value: '26', unit: '笔', delta: 44.4, spark: [15, 18, 21, 26] },
    { dim: '平均单笔', en: 'Avg Ticket', value: '10.9', unit: '亿', delta: 21.1, spark: [8.4, 9.0, 9.8, 10.9] },
    { dim: '最大单笔', en: 'Max Ticket', value: '38', unit: '亿', delta: 18.8, spark: [26, 32, 34, 38] },
    { dim: '头部集中度', en: 'Concentration', value: '58', unit: '%', delta: -4.2, spark: [64, 62, 60, 58] },
  ],
  closingLine: 'Q2 是融资窗口打开的关键节点。',
};

Page18Delta.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 4, min: 2, max: 5, step: 1,
    label: '行数', desc: '展示的指标行数(2–5)' },
  { key: 'showDelta', type: 'boolean', default: true,
    label: '环比列', desc: '环比变化徽标列的显示/隐藏' },
  { key: 'showSpark', type: 'boolean', default: true,
    label: '趋势列', desc: '每行迷你趋势曲线列的显示/隐藏' },
  { key: 'colorByTrend', type: 'boolean', default: true,
    label: '按涨跌配色', desc: '按上升/下降为徽标与曲线着色' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 4, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page18Delta.defaults;
export const controls = Page18Delta.controls;
