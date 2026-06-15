// Page86Dumbbell.jsx — "Range Dumbbell" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-db-`.
// A NEW chart type for this deck (none of the existing pages use it): a
// DUMBBELL / RANGE plot — each category is a row with a low dot and a high dot
// joined by a thick bar, so the *spread* (dispersion between floor and ceiling)
// is the headline. Shared value axis, optional reference line, endpoint value
// labels and a range badge. Toggle to paired bars. Count-driven, focusable.
// Pure ESM — no Tweaks/preview-runtime dependency; CSS scoped + prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page86Dumbbell(props) {
  const p = { ...Page86Dumbbell.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, showBaseline, showValueLabels, showDelta,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, lowLabel, highLabel, valueUnit,
    refValue, refLabel, items, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-pink)', 'var(--acl-blue)'];
  const data = items.slice(0, Math.max(3, segmentCount)).map((d, i) => ({ ...d, color: accents[i % accents.length] }));
  const n = data.length;
  const fIdx = Math.min(focusIndex, n - 1);
  const maxV = Math.max(...data.map((d) => d.high), refValue) * 1.06;
  const pos = (v) => (v / maxV) * 100;

  return (
    <div className="acl-root acl-db" style={{ background: bg }}>
      <style>{`
        .acl-db{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 60px; display:flex; flex-direction:column; }
        .acl-db__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-db__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-db__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-db__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-db__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-db__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-db__panel{ position:relative; flex:1; margin-top:28px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:24px 60px 22px 44px; display:flex; flex-direction:column; min-height:0; }
        .acl-db__legend{ display:flex; align-items:center; gap:26px; flex:0 0 auto;
          font-family:var(--acl-font-mono); font-weight:700; font-size:15px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.6); padding-left:240px; }
        .acl-db__lg{ display:flex; align-items:center; gap:9px; }
        .acl-db__lgdot{ width:18px; height:18px; border-radius:50%; border:3px solid var(--acl-ink); }
        .acl-db__lgbar{ width:36px; height:9px; background:var(--acl-ink); }

        .acl-db__rows{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:14px;
          margin-top:8px; min-height:0; }
        .acl-db__row{ display:flex; align-items:center; gap:44px; transition:opacity .25s; }
        .acl-db__dim{ opacity:.34; }
        .acl-db__name{ flex:0 0 196px; text-align:right; display:flex; flex-direction:column; align-items:flex-end; }
        .acl-db__nm{ font-weight:900; font-size:30px; line-height:1.04; }
        .acl-db__nt{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:3px; }
        .acl-db__track{ flex:1; position:relative; height:54px; }
        .acl-db__axis{ position:absolute; left:0; right:0; top:50%; height:3px;
          background:rgba(22,21,15,.12); transform:translateY(-50%); }
        .acl-db__ref{ position:absolute; top:-4px; bottom:-4px; width:0; border-left:3px dashed rgba(22,21,15,.4);
          z-index:1; }
        .acl-db__reflab{ position:absolute; top:-30px; transform:translateX(-50%); white-space:nowrap;
          font-family:var(--acl-font-mono); font-weight:700; font-size:12px; letter-spacing:.04em;
          color:rgba(22,21,15,.55); }
        .acl-db__bar{ position:absolute; top:50%; height:14px; transform:translateY(-50%);
          background:var(--acl-ink); border-radius:7px; z-index:2; transition:filter .25s; }
        .acl-db__dot{ position:absolute; top:50%; width:30px; height:30px; border-radius:50%;
          border:4px solid var(--acl-ink); transform:translate(-50%,-50%); z-index:3; }
        .acl-db__dot--lo{ background:var(--acl-paper); }
        .acl-db__vl{ position:absolute; top:50%; transform:translateY(-50%); z-index:4;
          font-family:var(--acl-font-num); font-size:31px; white-space:nowrap; }
        .acl-db__vl--lo{ text-align:right; transform:translate(-100%,-50%); padding-right:24px;
          color:rgba(22,21,15,.6); }
        .acl-db__vl--hi{ padding-left:24px; }
        .acl-db__vl em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:3px; color:rgba(22,21,15,.5); }
        .acl-db__delta{ flex:0 0 auto; font-family:var(--acl-font-num); font-size:40px; line-height:.9;
          min-width:150px; display:flex; align-items:baseline; justify-content:flex-end; gap:10px; }
        .acl-db__delta span{ font-family:var(--acl-font-cn); font-weight:900; font-size:22px;
          letter-spacing:.02em; color:rgba(22,21,15,.5); }
        .acl-db__row--focus .acl-db__nm{ color:var(--acl-pink); }

        /* paired-bars mode */
        .acl-db__pair{ flex:1; position:relative; display:flex; flex-direction:column; gap:6px; }
        .acl-db__pbar{ height:18px; border:2.5px solid var(--acl-ink); position:relative; }
        .acl-db__pbar.lo{ opacity:.45; }
        .acl-db__pv{ position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%);
          font-family:var(--acl-font-num); font-size:18px; white-space:nowrap; }

        .acl-db__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:27px; margin-top:14px; flex:0 0 auto; }
        .acl-db__anno{ position:absolute; font-family:var(--acl-font-hand); font-size:25px; z-index:6;
          white-space:nowrap; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-db__row, [data-deck-active] .acl-db__prow{
            animation:acl-db-rise .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .1s); }
        }
        @keyframes acl-db-rise{ from{ opacity:0; transform:translateX(-18px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-db__head">
        <div>
          <div className="acl-db__eyebrow">{eyebrow}</div>
          <h1 className="acl-db__h">{headline}</h1>
        </div>
        <div className="acl-db__sub">{subheadline}</div>
        <div className="acl-db__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-db__panel">
        <div className="acl-db__legend">
          <span className="acl-db__lg"><span className="acl-db__lgdot" style={{ background: 'var(--acl-paper)' }} />{lowLabel}</span>
          <span className="acl-db__lg"><span className="acl-db__lgdot" style={{ background: 'var(--acl-pink)' }} />{highLabel}</span>
          <span className="acl-db__lg"><span className="acl-db__lgbar" />区间跨度</span>
        </div>

        {chartType === 'dumbbell' ? (
          <div className="acl-db__rows">
            {data.map((d, i) => {
              const isF = focusEnabled && i === fIdx;
              const lo = pos(d.low), hi = pos(d.high);
              return (
                <div key={i} className={'acl-db__row' + (isF ? ' acl-db__row--focus' : '') + (focusEnabled && !isF ? ' acl-db__dim' : '')} style={{ '--i': i }}>
                  <div className="acl-db__name">
                    <span className="acl-db__nm">{d.name}</span>
                    <span className="acl-db__nt">{d.note}</span>
                  </div>
                  <div className="acl-db__track">
                    <div className="acl-db__axis" />
                    {showBaseline && (
                      <div className="acl-db__ref" style={{ left: pos(refValue) + '%' }}>
                        {i === 0 && <span className="acl-db__reflab" style={{ left: 0 }}>{refLabel}</span>}
                      </div>
                    )}
                    <div className="acl-db__bar" style={{ left: lo + '%', width: (hi - lo) + '%', background: isF ? d.color : 'var(--acl-ink)' }} />
                    <div className="acl-db__dot acl-db__dot--lo" style={{ left: lo + '%' }} />
                    <div className="acl-db__dot" style={{ left: hi + '%', background: d.color }} />
                    {showValueLabels && <span className="acl-db__vl acl-db__vl--lo" style={{ left: lo + '%' }}>{d.low}</span>}
                    {showValueLabels && <span className="acl-db__vl acl-db__vl--hi" style={{ left: hi + '%' }}>{d.high}<em>{valueUnit}</em></span>}
                  </div>
                  {showDelta && (
                    <div className="acl-db__delta" style={isF ? { color: d.color } : null}>
                      <span>跨度</span>×{(d.high / d.low).toFixed(1)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="acl-db__rows">
            {data.map((d, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-db__row' + (focusEnabled && !isF ? ' acl-db__dim' : '')} style={{ '--i': i }}>
                  <div className="acl-db__name">
                    <span className="acl-db__nm">{d.name}</span>
                    <span className="acl-db__nt">{d.note}</span>
                  </div>
                  <div className="acl-db__pair">
                    <div className="acl-db__pbar lo" style={{ width: pos(d.low) + '%', background: 'rgba(22,21,15,.3)' }}>
                      {showValueLabels && <span className="acl-db__pv" style={{ opacity: .6 }}>{d.low}</span>}
                    </div>
                    <div className="acl-db__pbar" style={{ width: pos(d.high) + '%', background: d.color }}>
                      {showValueLabels && <span className="acl-db__pv">{d.high}<em>{valueUnit}</em></span>}
                    </div>
                  </div>
                  {showDelta && (
                    <div className="acl-db__delta" style={isF ? { color: d.color } : null}>
                      <span>跨度</span>×{(d.high / d.low).toFixed(1)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showDecor && (
          <div className="acl-db__anno" style={{ right: 60, top: 14 }}>
            <Sticker label="区间越宽 越分化" color="var(--acl-yellow)" rotate={-4} />
          </div>
        )}
      </div>

      <div className="acl-db__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page86Dumbbell.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  chartType: 'dumbbell',       // 'dumbbell' (range plot) | 'bars' (paired bars)
  segmentCount: 5,             // 3–6 categories (rows)
  showBaseline: true,          // vertical reference line across the plot
  showValueLabels: true,       // endpoint value labels
  showDelta: true,             // range / spread badge per row
  focusEnabled: true,
  focusIndex: 1,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Deal Size Range',
  headline: '单笔融资区间分化',
  subheadline: '2024 · 各赛道下限 → 上限',
  summary: '同一赛道里，<b>头部与长尾的单笔规模差距</b>正在被持续拉大。',
  lowLabel: '区间下限',
  highLabel: '区间上限',
  valueUnit: '亿',
  refValue: 30,
  refLabel: '全市场中位',
  // rows — name + note + low/high of the range (text not parameterized)
  items: [
    { name: '通用大模型', note: 'Foundation', low: 20, high: 95 },
    { name: '算力基础设施', note: 'Compute', low: 15, high: 78 },
    { name: '垂直应用', note: 'Vertical Apps', low: 5, high: 42 },
    { name: 'AI 芯片', note: 'Silicon', low: 12, high: 60 },
    { name: '具身智能', note: 'Embodied', low: 4, high: 28 },
    { name: '内容生成', note: 'Generative', low: 3, high: 22 },
  ],
  closingLine: '区间的宽度，决定了你在这条赛道里能站到哪一段。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page86Dumbbell.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'dumbbell', options: ['dumbbell', 'bars'],
    label: '图表类型', desc: '区间呈现：哑铃(下限→上限连点) / 成对条形' },
  { key: 'segmentCount', type: 'number', default: 5, min: 3, max: 6, step: 1,
    label: '条目数量', desc: '参与对比的赛道(行)数量(3–6)' },
  { key: 'showBaseline', type: 'boolean', default: true,
    label: '参考线', desc: '横跨图表的中位/参考竖线 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '区间两端数值 显隐' },
  { key: 'showDelta', type: 'boolean', default: true,
    label: '跨度徽标', desc: '每行右侧区间跨度倍数 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 5, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的条目序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page86Dumbbell.defaults;
export const controls = Page86Dumbbell.controls;
