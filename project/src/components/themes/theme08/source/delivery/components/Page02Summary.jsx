// Page02Summary.jsx — "Summary Dashboard" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-sm-`.
// Showcases: card count, focus on/off, focus index, chart type, decor toggle.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Doodle, Sticker, MetaTag } from './AclPrimitives.jsx';

export default function Page02Summary(props) {
  const p = { ...Page02Summary.defaults, ...props };
  const {
    backgroundTheme, cardCount, focusEnabled, focusIndex, chartType, showDecor,
    eyebrow, headline, subheadline, summary, metrics, trackData, trackTitle, closingLine,
  } = p;

  const bg = backgroundTheme === 'primary'
    ? 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)'
    : 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)';
  const cards = metrics.slice(0, cardCount);
  const focusOn = focusEnabled && chartType !== null;
  const cyc = ['var(--acl-ink)', 'var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'rgba(22,21,15,.35)'];

  return (
    <div className="acl-root acl-sm" style={{ background: bg }}>
      <style>{`
        .acl-sm{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:84px 100px 80px; }
        .acl-sm__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-sm__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55);
          margin-bottom:10px; font-size:24px; }
        .acl-sm__h{ font-weight:900; font-size:88px; line-height:.95; margin:0; }
        .acl-sm__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow);
          transform:rotate(-2deg);  white-space:nowrap;}
        .acl-sm__body{ display:flex; gap:48px; margin-top:54px; align-items:stretch; }
        .acl-sm__left{ flex:1 1 0; display:flex; flex-direction:column; gap:30px; min-width:0; }
        .acl-sm__summary{ background:var(--acl-paper); border:3px solid var(--acl-ink);
          padding:34px 38px; box-shadow:7px 9px 0 rgba(22,21,15,.16); position:relative; }
        .acl-sm__summary p{ margin:0; font-weight:700; font-size:33px; line-height:1.42; }
        .acl-sm__summary .tag{ position:absolute; top:-18px; left:30px; }
        .acl-sm__metrics{ display:grid; gap:22px; margin-top:auto; }
        .acl-sm__card{ background:var(--acl-paper); border:3px solid var(--acl-ink);
          padding:22px 24px 20px; box-shadow:5px 6px 0 rgba(22,21,15,.14);
          display:flex; flex-direction:column; gap:6px; transition:transform .25s; position:relative; }
        .acl-sm__card .num{ font-family:var(--acl-font-num); font-size:64px; line-height:.84;
          letter-spacing:.01em; display:flex; align-items:baseline; gap:6px; }
        .acl-sm__card .num em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700;
          font-size:24px; }
        .acl-sm__card .lbl{ font-weight:700; font-size:21px; color:rgba(22,21,15,.72); }
        .acl-sm__card--focus{ background:var(--acl-ink); color:var(--acl-yellow);
          transform:scale(1.045) rotate(-1.5deg); box-shadow:8px 10px 0 rgba(22,21,15,.28); z-index:2; }
        .acl-sm__card--focus .lbl{ color:rgba(255,255,255,.8); }
        .acl-sm__card .fx{ position:absolute; top:-15px; right:-10px; }
        .acl-sm__right{ flex:0 0 600px; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:7px 9px 0 rgba(22,21,15,.16); padding:32px 36px; display:flex;
          flex-direction:column; }
        .acl-sm__right h3{ margin:0 0 24px; font-weight:900; font-size:30px;
          display:flex; align-items:center; gap:12px; }
        .acl-sm__bars{ display:flex; flex-direction:column; gap:18px; }
        .acl-sm__bar{ display:grid; grid-template-columns:170px 1fr 96px; align-items:center; gap:14px; }
        .acl-sm__bar .bl{ font-weight:700; font-size:22px; }
        .acl-sm__bar .track{ height:30px; background:rgba(22,21,15,.08); }
        .acl-sm__bar .fill{ height:100%; }
        .acl-sm__bar .pc{ font-family:var(--acl-font-num); font-size:30px; text-align:right; }
        .acl-sm__donut-wrap{ display:flex; align-items:center; gap:36px; flex:1; }
        .acl-sm__donut{ width:248px; height:248px; border-radius:50%; flex:0 0 auto;
          position:relative; }
        .acl-sm__donut::after{ content:""; position:absolute; inset:64px; border-radius:50%;
          background:var(--acl-paper); }
        .acl-sm__legend{ display:flex; flex-direction:column; gap:13px; }
        .acl-sm__legend div{ display:flex; align-items:center; gap:11px; font-weight:700; font-size:21px; }
        .acl-sm__legend i{ width:18px; height:18px; flex:0 0 auto; }
        .acl-sm__nochart{ flex:1; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-mono); color:rgba(22,21,15,.4); font-size:20px;
          border:2px dashed rgba(22,21,15,.25); }
        .acl-sm__foot{ position:absolute; left:100px; right:100px; bottom:46px;
          display:flex; align-items:center; gap:16px; font-family:var(--acl-font-hand);
          font-size:30px; }
      `}</style>

      <div className="acl-sm__head">
        <div>
          <div className="acl-sm__eyebrow">{eyebrow}</div>
          <h1 className="acl-sm__h">{headline}</h1>
        </div>
        <div className="acl-sm__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={50} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
      </div>

      <div className="acl-sm__body">
        <div className="acl-sm__left">
          <div className="acl-sm__summary">
            {showDecor && <div className="tag"><Sticker label="摘要" color="var(--acl-pink)" rotate={-4} /></div>}
            <p>{summary}</p>
          </div>
          <div className="acl-sm__metrics" style={{ gridTemplateColumns: `repeat(${Math.min(cards.length, 2)}, 1fr)` }}>
            {cards.map((m, i) => {
              const isF = focusOn && i === focusIndex;
              return (
                <div key={i} className={'acl-sm__card' + (isF ? ' acl-sm__card--focus' : '')}>
                  {isF && showDecor && <div className="fx"><Sticker label="重点" color="var(--acl-yellow)" rotate={6} /></div>}
                  <div className="num">{m.value}<em>{m.unit}</em></div>
                  <div className="lbl">{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {chartType !== null && (
          <div className="acl-sm__right">
            <h3>{trackTitle}{showDecor && <Doodle kind="arrowS" size={42} rotate={-20} style={{ position: 'static' }} />}</h3>
            {chartType === 'bars' && (
              <div className="acl-sm__bars">
                {trackData.map((t, i) => (
                  <div key={i} className="acl-sm__bar">
                    <div className="bl">{t.label}</div>
                    <div className="track"><div className="fill" style={{ width: t.pct + '%', background: cyc[i % cyc.length] }} /></div>
                    <div className="pc">{t.pct}%</div>
                  </div>
                ))}
              </div>
            )}
            {chartType === 'donut' && (
              <div className="acl-sm__donut-wrap">
                <div className="acl-sm__donut" style={{ background: donutGradient(trackData, cyc) }} />
                <div className="acl-sm__legend">
                  {trackData.map((t, i) => (
                    <div key={i}><i style={{ background: cyc[i % cyc.length] }} />{t.label} · {t.pct}%</div>
                  ))}
                </div>
              </div>
            )}
            {chartType === 'plain' && <div className="acl-sm__nochart">chart hidden</div>}
          </div>
        )}
      </div>

      <div className="acl-sm__foot">
        {showDecor && <Doodle kind="loop" size={60} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

function donutGradient(data, cyc) {
  let acc = 0; const stops = [];
  data.forEach((t, i) => {
    const c = cyc[i % cyc.length]; const start = acc; acc += t.pct;
    stops.push(`${c} ${start}% ${acc}%`);
  });
  return `conic-gradient(${stops.join(',')})`;
}

Page02Summary.defaults = {
  backgroundTheme: 'muted',
  cardCount: 4,
  focusEnabled: true,
  focusIndex: 3,
  chartType: 'bars',   // 'bars' | 'donut' | null (hide)
  showDecor: true,
  eyebrow: 'Report Overview',
  headline: '报告摘要',
  subheadline: '2024 全年 · 资本大年',
  summary: '2024 年美国 AI 初创公司吸纳约 970 亿美元风险投资，单笔 ≥ 1 亿美元的大额融资事件达 97 笔。',
  metrics: [
    { value: '970', unit: '亿美元', label: '全年融资总额' },
    { value: '97', unit: '笔', label: '大额融资事件' },
    { value: '10', unit: '亿美元', label: '平均单笔规模' },
    { value: '63.9', unit: '%', label: '湾区融资占比' },
  ],
  trackTitle: '赛道融资占比',
  trackData: [
    { label: '通用大模型', pct: 43.3 },
    { label: '垂直应用', pct: 25.3 },
    { label: '基础设施', pct: 16.3 },
    { label: 'AI 芯片', pct: 10.0 },
    { label: '其他', pct: 5.1 },
  ],
  closingLine: '资本仍在涌入 AI，但下一阶段会从赌叙事转向看兑现。',
};

Page02Summary.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '指标卡数量', desc: '底部核心指标卡的数量' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一张指标卡' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 3, maxFrom: 'cardCount', step: 1,
    label: '重点对象', desc: '被高亮的指标卡序号(从 0 起)' },
  { key: 'chartType', type: 'enum', default: 'bars', options: ['bars', 'donut', null],
    label: '图表类型', desc: '占比模块的呈现方式：条形 / 环形 / 隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page02Summary.defaults;
export const controls = Page02Summary.controls;
