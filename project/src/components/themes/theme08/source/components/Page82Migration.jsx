// Page82Migration.jsx — "Heat Migration · Rank Slope" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-bp-`.
// A NEW chart type for this deck (bump / slope ranking migration — none of the
// existing pages use it): two ranked columns (period A → period B) connected by
// sloping lines so crossings read as "heat migration". Toggle to a paired-bar
// comparison. Count-driven rows, focusable trajectory, rank-change deltas and
// value labels. Pure ESM — no Tweaks dependency; CSS scoped + prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page82Migration(props) {
  const p = { ...Page82Migration.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, focusEnabled, focusIndex,
    showDelta, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, colA, colB, valueUnit, items, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-yellow)', 'var(--acl-pink)'];
  const data = items.slice(0, Math.max(3, segmentCount)).map((d, i) => ({ ...d, color: accents[i % accents.length] }));
  const n = data.length;
  const fIdx = Math.min(focusIndex, n - 1);

  // rank-anchored layout (ranks 1..n re-normalised to the visible subset)
  const byA = [...data].sort((a, b) => a.rankA - b.rankA);
  const byB = [...data].sort((a, b) => a.rankB - b.rankB);
  const rowA = {}; byA.forEach((d, i) => { rowA[d.name] = i; });
  const rowB = {}; byB.forEach((d, i) => { rowB[d.name] = i; });
  const yPct = (row) => ((row + 0.5) / n) * 100;
  const LX = 30, RX = 70;                       // column x in viewBox units
  const maxV = Math.max(...data.map((d) => Math.max(d.valA, d.valB)));

  return (
    <div className="acl-root acl-bp" style={{ background: bg }}>
      <style>{`
        .acl-bp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 64px; display:flex; flex-direction:column; }
        .acl-bp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-bp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-bp__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-bp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-bp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-bp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-bp__panel{ position:relative; flex:1; margin-top:30px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 56px 30px; display:flex; flex-direction:column; min-height:0; }
        .acl-bp__cols{ display:flex; justify-content:space-between; font-family:var(--acl-font-mono);
          font-weight:700; font-size:20px; letter-spacing:.04em; flex:0 0 auto; }
        .acl-bp__col{ display:flex; align-items:center; gap:10px; }
        .acl-bp__col i{ font-family:var(--acl-font-num); font-size:30px; }
        .acl-bp__plot{ position:relative; flex:1; margin-top:14px; min-height:0; }
        .acl-bp__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-bp__node{ position:absolute; transform:translate(-50%,-50%); display:flex; align-items:center;
          z-index:2; }
        .acl-bp__dot{ width:20px; height:20px; border-radius:50%; border:3px solid var(--acl-ink);
          flex:0 0 auto; }
        .acl-bp__lab{ position:absolute; transform:translateY(-50%); z-index:3; white-space:nowrap;
          display:flex; align-items:baseline; gap:10px; transition:opacity .25s; }
        .acl-bp__lab--l{ right:71%; text-align:right; flex-direction:row-reverse; }
        .acl-bp__lab--r{ left:71%; }
        .acl-bp__rk{ font-family:var(--acl-font-num); font-size:34px; line-height:.8; color:rgba(22,21,15,.4); }
        .acl-bp__nm{ font-weight:900; font-size:27px; line-height:1; }
        .acl-bp__vl{ font-family:var(--acl-font-num); font-size:26px; line-height:.8; }
        .acl-bp__vl em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; color:rgba(22,21,15,.5); }
        .acl-bp__delta{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px; padding:3px 8px;
          color:var(--acl-paper); white-space:nowrap; }
        .acl-bp__dim{ opacity:.32; }

        /* bars mode */
        .acl-bp__bars{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:16px;
          margin-top:18px; min-height:0; }
        .acl-bp__brow{ display:flex; align-items:center; gap:18px; transition:opacity .25s; }
        .acl-bp__bname{ flex:0 0 220px; font-weight:900; font-size:26px; text-align:right;
          display:flex; align-items:center; justify-content:flex-end; gap:10px; }
        .acl-bp__brk{ font-family:var(--acl-font-num); font-size:30px; color:rgba(22,21,15,.4); }
        .acl-bp__btrack{ flex:1; display:flex; flex-direction:column; gap:7px; min-width:0; }
        .acl-bp__bpair{ display:flex; align-items:center; gap:12px; }
        .acl-bp__btag{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); flex:0 0 54px; }
        .acl-bp__bbar{ height:20px; border:2.5px solid var(--acl-ink); position:relative; }
        .acl-bp__bbar.b2{ opacity:.5; }
        .acl-bp__bv{ font-family:var(--acl-font-num); font-size:22px; margin-left:9px; }
        .acl-bp__bv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:13px;
          margin-left:2px; color:rgba(22,21,15,.5); }

        .acl-bp__anno{ position:absolute; font-family:var(--acl-font-hand); font-size:27px;
          color:var(--acl-ink); z-index:5; white-space:nowrap; }
        .acl-bp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:27px; margin-top:16px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-bp__path{ stroke-dasharray:1400; stroke-dashoffset:1400;
            animation:acl-bp-draw .9s ease .15s forwards; }
          [data-deck-active] .acl-bp__node{ animation:acl-bp-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .35s); }
          [data-deck-active] .acl-bp__brow{ animation:acl-bp-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s); }
        }
        @keyframes acl-bp-draw{ to{ stroke-dashoffset:0; } }
        @keyframes acl-bp-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.5); } to{ opacity:1; } }
        @keyframes acl-bp-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-bp__head">
        <div>
          <div className="acl-bp__eyebrow">{eyebrow}</div>
          <h1 className="acl-bp__h">{headline}</h1>
        </div>
        <div className="acl-bp__sub">{subheadline}</div>
        <div className="acl-bp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-bp__panel">
        <div className="acl-bp__cols">
          <span className="acl-bp__col"><i>{colA.num}</i>{colA.label}</span>
          <span className="acl-bp__col">{colB.label}<i>{colB.num}</i></span>
        </div>

        {chartType === 'slope' ? (
          <div className="acl-bp__plot">
            {/* connecting slopes */}
            <svg className="acl-bp__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {data.map((d, i) => {
                const isF = focusEnabled && i === fIdx;
                return (
                  <path key={i} className="acl-bp__path"
                    d={`M ${LX} ${yPct(rowA[d.name])} C 50 ${yPct(rowA[d.name])}, 50 ${yPct(rowB[d.name])}, ${RX} ${yPct(rowB[d.name])}`}
                    fill="none" stroke={d.color} strokeWidth={isF ? 6 : 3.5}
                    strokeLinecap="round" vectorEffect="non-scaling-stroke"
                    opacity={focusEnabled && !isF ? 0.3 : 1} />
                );
              })}
            </svg>

            {/* left labels + dots */}
            {byA.map((d, i) => {
              const idx = data.findIndex((x) => x.name === d.name);
              const isF = focusEnabled && idx === fIdx;
              return (
                <React.Fragment key={'a' + i}>
                  <div className={'acl-bp__lab acl-bp__lab--l' + (focusEnabled && !isF ? ' acl-bp__dim' : '')}
                    style={{ top: `${yPct(i)}%` }}>
                    <span className="acl-bp__rk">{String(d.rankA).padStart(2, '0')}</span>
                    <span className="acl-bp__nm">{d.name}</span>
                    {showValueLabels && <span className="acl-bp__vl">{d.valA}<em>{valueUnit}</em></span>}
                  </div>
                  <div className="acl-bp__node" style={{ left: `${LX}%`, top: `${yPct(i)}%`, '--i': i }}>
                    <span className="acl-bp__dot" style={{ background: data[idx].color }} />
                  </div>
                </React.Fragment>
              );
            })}

            {/* right labels + dots */}
            {byB.map((d, i) => {
              const idx = data.findIndex((x) => x.name === d.name);
              const isF = focusEnabled && idx === fIdx;
              const rise = d.rankA - d.rankB;
              return (
                <React.Fragment key={'b' + i}>
                  <div className="acl-bp__node" style={{ left: `${RX}%`, top: `${yPct(i)}%`, '--i': i }}>
                    <span className="acl-bp__dot" style={{ background: data[idx].color }} />
                  </div>
                  <div className={'acl-bp__lab acl-bp__lab--r' + (focusEnabled && !isF ? ' acl-bp__dim' : '')}
                    style={{ top: `${yPct(i)}%` }}>
                    <span className="acl-bp__nm">{d.name}</span>
                    {showValueLabels && <span className="acl-bp__vl">{d.valB}<em>{valueUnit}</em></span>}
                    {showDelta && (
                      <span className="acl-bp__delta"
                        style={{ background: rise > 0 ? 'var(--acl-red)' : rise < 0 ? 'var(--acl-blue)' : 'rgba(22,21,15,.5)' }}>
                        {rise > 0 ? '▲' + rise : rise < 0 ? '▼' + (-rise) : '—'}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

          </div>
        ) : (
          <div className="acl-bp__bars">
            {byB.map((d, i) => {
              const idx = data.findIndex((x) => x.name === d.name);
              const isF = focusEnabled && idx === fIdx;
              return (
                <div key={i} className={'acl-bp__brow' + (focusEnabled && !isF ? ' acl-bp__dim' : '')} style={{ '--i': i }}>
                  <div className="acl-bp__bname"><span className="acl-bp__brk">{String(i + 1).padStart(2, '0')}</span>{d.name}</div>
                  <div className="acl-bp__btrack">
                    <div className="acl-bp__bpair">
                      <span className="acl-bp__btag">{colA.num}</span>
                      <div className="acl-bp__bbar b2" style={{ width: `${(d.valA / maxV) * 100}%`, background: 'rgba(22,21,15,.35)' }} />
                      {showValueLabels && <span className="acl-bp__bv" style={{ opacity: .6 }}>{d.valA}</span>}
                    </div>
                    <div className="acl-bp__bpair">
                      <span className="acl-bp__btag">{colB.num}</span>
                      <div className="acl-bp__bbar" style={{ width: `${(d.valB / maxV) * 100}%`, background: data[idx].color }} />
                      {showValueLabels && <span className="acl-bp__bv">{d.valB}<em>{valueUnit}</em></span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="acl-bp__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page82Migration.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  chartType: 'slope',          // 'slope' (bump migration) | 'bars' (paired bars)
  segmentCount: 5,             // 3–6 tracked items
  focusEnabled: true,
  focusIndex: 0,
  showDelta: true,             // rank-change badge on B side
  showValueLabels: true,       // value labels at endpoints
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Heat Migration',
  headline: '赛道热度迁移',
  subheadline: '2024 → 2025E 关注度排名',
  summary: '资金关注度从 <b>纯叙事</b> 向 <b>能兑现的基础设施与应用</b> 迁移。',
  colA: { num: '2024', label: '实际排名' },
  colB: { num: '2025E', label: '预期排名' },
  valueUnit: '分',
  // tracked items — name + ranks + heat scores in each period (text not parameterized)
  items: [
    { name: '通用大模型', rankA: 1, rankB: 3, valA: 95, valB: 78 },
    { name: '基础设施', rankA: 3, rankB: 1, valA: 74, valB: 91 },
    { name: '垂直应用', rankA: 4, rankB: 2, valA: 66, valB: 85 },
    { name: 'AI 芯片', rankA: 2, rankB: 4, valA: 80, valB: 70 },
    { name: '具身智能', rankA: 6, rankB: 5, valA: 41, valB: 58 },
    { name: '内容生成', rankA: 5, rankB: 6, valA: 52, valB: 44 },
  ],
  closingLine: '排名的交叉点，就是资本叙事换挡的位置。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page82Migration.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'slope', options: ['slope', 'bars'],
    label: '图表类型', desc: '迁移呈现：斜率连线(排名迁移) / 成对条形(两期对比)' },
  { key: 'segmentCount', type: 'number', default: 5, min: 3, max: 6, step: 1,
    label: '条目数量', desc: '参与排名迁移的赛道数量(3–6)' },
  { key: 'showDelta', type: 'boolean', default: true,
    label: '变化徽标', desc: '右侧排名升降徽标 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '两端的热度分值 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一条迁移轨迹(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 5, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的条目序号(从 0 起，按内容顺序)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page82Migration.defaults;
export const controls = Page82Migration.controls;
