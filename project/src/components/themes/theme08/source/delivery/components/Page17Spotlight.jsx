// Page17Spotlight.jsx — "Period Spotlight + Mini Chart" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-qs-`.
// A single period (e.g. one quarter) gets a bold ink hero card carrying one
// headline figure + a count-driven grid of supporting metric tiles; a compact
// sequence mini-chart on the right places this period inside the full series
// (column / area / line) with a focusable point. Fully portable — no dependency
// on the Tweaks panel; the preview only maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const aclQsCeil = (v) => {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p) * p >= v * 1.08 ? Math.ceil(v / p) * p : Math.ceil((v * 1.12) / p) * p;
};

export default function Page17Spotlight(props) {
  const p = { ...Page17Spotlight.defaults, ...props };
  const {
    backgroundTheme, metricCount, chartType, focusEnabled, focusIndex, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary,
    badge, hero, metrics, series, seriesUnit, seriesNote, chartCaption, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, series.length - 1);

  // ── mini chart geometry ──
  const n = series.length;
  const CW = 600, CH = 300;
  const band = CW / n;
  const barW = Math.min(96, band * 0.46);
  const maxV = aclQsCeil(Math.max(...series.map((d) => d.v)));
  const cx = (i) => band * (i + 0.5);
  const y = (v) => CH - (v / maxV) * CH;
  const linePath = series.map((d, i) => `${i ? 'L' : 'M'}${cx(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${cx(n - 1).toFixed(1)} ${CH} L${cx(0).toFixed(1)} ${CH} Z`;

  return (
    <div className="acl-root acl-qs" style={{ background: bg }}>
      <style>{`
        .acl-qs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-qs__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-qs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-qs__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-qs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-qs__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-qs__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-qs__body{ flex:1; display:flex; gap:40px; margin-top:34px; min-height:0; }

        /* ── hero card (ink) ── */
        .acl-qs__hero{ flex:0 0 760px; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:10px 12px 0 rgba(22,21,15,.2);
          padding:38px 44px 34px; display:flex; flex-direction:column; overflow:hidden; }
        .acl-qs__ghost{ position:absolute; right:-34px; bottom:-86px; font-family:var(--acl-font-num);
          font-size:460px; line-height:.7; color:rgba(236,239,53,.16); pointer-events:none; z-index:0;
          letter-spacing:-.04em; }
        .acl-qs__badge{ display:inline-flex; align-self:flex-start; font-family:var(--acl-font-mono);
          font-weight:700; font-size:18px; letter-spacing:.06em; text-transform:uppercase;
          background:var(--acl-yellow); color:var(--acl-ink); padding:8px 16px; position:relative; z-index:1;  white-space:nowrap;}
        .acl-qs__herolabel{ position:relative; z-index:1; font-weight:700; font-size:26px;
          color:rgba(255,255,255,.66); margin-top:auto; display:flex; align-items:center; gap:14px; }
        .acl-qs__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-qs__heronum{ position:relative; z-index:1; font-family:var(--acl-font-num); font-size:212px;
          line-height:.84; color:var(--acl-yellow); margin-top:6px; }
        .acl-qs__tiles{ position:relative; z-index:1; display:grid; gap:14px; margin-top:30px;
          grid-template-columns:repeat(2, 1fr); }
        .acl-qs__tiles[data-n="2"]{ grid-template-columns:repeat(2, 1fr); }
        .acl-qs__tiles[data-n="3"]{ grid-template-columns:repeat(3, 1fr); }
        .acl-qs__tiles[data-n="4"]{ grid-template-columns:repeat(2, 1fr); }
        .acl-qs__tile{ border:2px solid rgba(255,255,255,.26); padding:14px 16px 12px; }
        .acl-qs__tile .k{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(255,255,255,.5); }
        .acl-qs__tile .v{ font-family:var(--acl-font-num); font-size:48px; line-height:.96; margin-top:4px; }
        .acl-qs__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700;
          font-size:18px; margin-left:4px; color:rgba(255,255,255,.62); }

        /* ── mini chart panel ── */
        .acl-qs__chart{ flex:1; min-width:0; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 40px 24px; display:flex; flex-direction:column; }
        .acl-qs__ctitle{ font-family:var(--acl-font-mono); font-size:17px; font-weight:700;
          letter-spacing:.06em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-qs__plot{ position:relative; flex:1; margin-top:18px; }
        .acl-qs__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.16); }
        .acl-qs__bars{ position:absolute; inset:0; }
        .acl-qs__bar{ position:absolute; bottom:0; background:rgba(22,21,15,.30);
          border-top:5px solid var(--acl-ink); transition:height .4s, background .3s; }
        .acl-qs__bar--focus{ background:var(--acl-pink); border-top-color:var(--acl-ink);
          box-shadow:4px 4px 0 rgba(22,21,15,.24); }
        .acl-qs__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-qs__vlabel{ position:absolute; transform:translate(-50%,-100%); font-family:var(--acl-font-num);
          font-size:30px; line-height:1; white-space:nowrap; color:rgba(22,21,15,.7);
          text-shadow:0 0 7px var(--acl-paper),0 0 7px var(--acl-paper),0 0 7px var(--acl-paper); }
        .acl-qs__vlabel--focus{ color:var(--acl-pink); }
        .acl-qs__dot{ position:absolute; width:14px; height:14px; border-radius:50%; background:var(--acl-paper);
          border:3px solid var(--acl-ink); transform:translate(-50%,-50%); }
        .acl-qs__dot--focus{ width:20px; height:20px; background:var(--acl-pink); }
        .acl-qs__xaxis{ display:flex; margin-top:12px; }
        .acl-qs__xtick{ flex:1; text-align:center; font-weight:900; font-size:26px; color:rgba(22,21,15,.55); }
        .acl-qs__xtick--focus{ color:var(--acl-pink); }
        .acl-qs__cnote{ font-family:var(--acl-font-hand); font-size:26px; margin-top:10px; }

        .acl-qs__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-qs__bar{ animation:acl-qs-grow .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-qs__hero{ animation:acl-qs-rise .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-qs-grow{ from{ transform:scaleY(0); transform-origin:bottom; } to{ transform:none; } }
        @keyframes acl-qs-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-qs__head">
        <div>
          <div className="acl-qs__eyebrow">{eyebrow}</div>
          <h1 className="acl-qs__h">{headline}</h1>
        </div>
        <div className="acl-qs__sub">{subheadline}</div>
        <div className="acl-qs__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-qs__body">
        {/* ── hero spotlight card ── */}
        <div className="acl-qs__hero">
          <div className="acl-qs__ghost">{badge}</div>
          <div className="acl-qs__badge">{hero.tag}</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 34, top: 30, zIndex: 2 }}>
              <Doodle kind="spark" size={50} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />
            </div>
          )}
          <div className="acl-qs__herolabel">{hero.label}<i className="acl-qs__unit">{hero.unit}</i></div>
          <div className="acl-qs__heronum">{hero.value}</div>
          <div className="acl-qs__tiles" data-n={tiles.length}>
            {tiles.map((m, i) => (
              <div key={i} className="acl-qs__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── mini sequence chart ── */}
        <div className="acl-qs__chart">
          <div className="acl-qs__ctitle">{seriesNote} · {seriesUnit}</div>
          <div className="acl-qs__plot">
            {[0.33, 0.66, 1].map((f, i) => (
              <div key={i} className="acl-qs__grid" style={{ top: `${(1 - f) * 100}%` }} />
            ))}
            {chartType === 'column' && (
              <div className="acl-qs__bars">
                {series.map((d, i) => {
                  const isF = focusEnabled && i === fIdx;
                  return (
                    <div key={i} className={'acl-qs__bar' + (isF ? ' acl-qs__bar--focus' : '')}
                      style={{ left: `${((cx(i) - barW / 2) / CW) * 100}%`, width: `${(barW / CW) * 100}%`,
                        height: `${((CH - y(d.v)) / CH) * 100}%` }} />
                  );
                })}
              </div>
            )}
            <svg className="acl-qs__svg" viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none">
              {chartType === 'area' && <path d={areaPath} fill="var(--acl-pink)" fillOpacity="0.85" />}
              {(chartType === 'area' || chartType === 'line') && (
                <path d={linePath} fill="none" stroke="var(--acl-ink)" strokeWidth="4"
                  strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              )}
            </svg>
            {series.map((d, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <React.Fragment key={i}>
                  {chartType !== 'column' && (
                    <div className={'acl-qs__dot' + (isF ? ' acl-qs__dot--focus' : '')}
                      style={{ left: `${(cx(i) / CW) * 100}%`, top: `${(y(d.v) / CH) * 100}%` }} />
                  )}
                  {showValueLabels && (
                    <div className={'acl-qs__vlabel' + (isF ? ' acl-qs__vlabel--focus' : '')}
                      style={{ left: `${(cx(i) / CW) * 100}%`, top: `calc(${(y(d.v) / CH) * 100}% - 16px)` }}>
                      {d.v}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="acl-qs__xaxis">
            {series.map((d, i) => (
              <div key={i} className={'acl-qs__xtick' + (focusEnabled && i === fIdx ? ' acl-qs__xtick--focus' : '')}>{d.label}</div>
            ))}
          </div>
          {showDecor && chartCaption && (
            <div className="acl-qs__cnote">
              <Doodle kind="arrowS" size={44} rotate={0} style={{ position: 'static', verticalAlign: 'middle', marginRight: 8 }} />
              {chartCaption}
            </div>
          )}
        </div>
      </div>

      <div className="acl-qs__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page17Spotlight.defaults = {
  backgroundTheme: 'primary',
  metricCount: 3,          // 2–4 supporting metric tiles
  chartType: 'column',     // 'column' | 'area' | 'line'  (mini sequence chart)
  focusEnabled: true,
  focusIndex: 0,           // which point in the series is spotlighted
  showValueLabels: true,
  showDecor: true,
  eyebrow: 'Quarter Breakdown',
  headline: '冷启动季度',
  subheadline: 'Q1 融资拆解',
  summary: 'Q1 交易数量稳定，但整体金额<b>尚未进入全年高峰</b>。',
  badge: 'Q1',
  hero: { tag: 'Q1 · Jan–Mar', label: '季度融资额', value: '162', unit: '亿美元' },
  metrics: [
    { k: '事件数', v: '18', unit: '笔' },
    { k: '平均单笔', v: '9.0', unit: '亿' },
    { k: '最大单笔', v: '32', unit: '亿' },
    { k: '占全年', v: '16.7', unit: '%' },
  ],
  series: [
    { label: 'Q1', v: 162 },
    { label: 'Q2', v: 284 },
    { label: 'Q3', v: 318 },
    { label: 'Q4', v: 206 },
  ],
  seriesUnit: '亿美元',
  seriesNote: '全年季度走势',
  chartCaption: '起步阶段，曲线尚未抬头',
  closingLine: '全年热度从保守启动开始。',
};

Page17Spotlight.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '主卡内支撑指标格数量(2–4)' },
  { key: 'chartType', type: 'enum', default: 'column', options: ['column', 'area', 'line'],
    label: '图表类型', desc: '右侧序列迷你图：柱状 / 面积 / 折线' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '迷你图数据点上的数值显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否在序列中高亮某个点(本期)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1,
    label: '重点对象', desc: '被高亮的序列点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与批注的显示/隐藏' },
];

export const defaults = Page17Spotlight.defaults;
export const controls = Page17Spotlight.controls;
