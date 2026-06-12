// Page34Pipeline.jsx — "Data Pipeline" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pp-`.
// A NEW chart layout: a count-driven horizontal DATA PIPELINE of connected
// stages (one focusable), paired with an embedded growth trend mini-chart
// (column / area / line) and a row of metric tiles anchored by one hero figure.
// No dependency on the Tweaks panel — portable ESM, all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const niceCeil = (v) => {
  const pw = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / pw) * pw >= v * 1.08 ? Math.ceil(v / pw) * pw : Math.ceil((v * 1.12) / pw) * pw;
};

export default function Page34Pipeline(props) {
  const p = { ...Page34Pipeline.defaults, ...props };
  const {
    backgroundTheme, stageCount, chartType, showValueLabels, metricCount, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, stages, growth, growthTitle, growthUnit, hero, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const stg = stages.slice(0, Math.max(3, stageCount));
  const fIdx = Math.min(focusIndex, stg.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));

  // growth mini-chart geometry
  const GW = 560, GH = 220;
  const gn = growth.length;
  const gband = GW / gn;
  const gmax = niceCeil(Math.max(...growth.map((d) => d.v)));
  const gx = (i) => gband * (i + 0.5);
  const gy = (v) => GH - (v / gmax) * GH * 0.86 - GH * 0.06;
  const gLine = growth.map((d, i) => `${i ? 'L' : 'M'}${gx(i).toFixed(1)} ${gy(d.v).toFixed(1)}`).join(' ');
  const gArea = `${gLine} L${gx(gn - 1).toFixed(1)} ${GH} L${gx(0).toFixed(1)} ${GH} Z`;
  const gbarW = Math.min(64, gband * 0.5);

  return (
    <div className="acl-root acl-pp" style={{ background: bg }}>
      <style>{`
        .acl-pp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-pp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-pp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-pp__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-pp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-pp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-pp__panel{ position:relative; flex:1; margin-top:28px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 40px 30px; display:flex; flex-direction:column; min-height:0; }
        .acl-pp__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}

        /* ── pipeline ── */
        .acl-pp__flowhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:20px 0 12px; }
        .acl-pp__pipe{ display:flex; align-items:stretch; }
        .acl-pp__stage{ flex:1; position:relative; background:var(--acl-yellow); border:2.5px solid var(--acl-ink);
          padding:16px 12px 15px 30px; margin-left:-18px; display:flex; flex-direction:column; justify-content:center;
          transition:.25s; clip-path:polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 18px 50%); }
        .acl-pp__stage:first-child{ margin-left:0; padding-left:18px;
          clip-path:polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%); }
        .acl-pp__stage:last-child{ clip-path:polygon(0 0, 100% 0, 100% 100%, 0 100%, 18px 50%); }
        .acl-pp__stage:nth-child(even){ background:var(--acl-paper); }
        .acl-pp__stage .si{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.06em;
          color:rgba(22,21,15,.5); }
        .acl-pp__stage .sn{ font-weight:900; font-size:26px; line-height:1.06; margin-top:3px; }
        .acl-pp__stage .se{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.03em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:3px; }
        .acl-pp__stage--focus{ background:var(--acl-pink); color:var(--acl-paper); z-index:3;
          box-shadow:0 8px 20px rgba(22,21,15,.2); }
        .acl-pp__stage--focus .si, .acl-pp__stage--focus .se{ color:rgba(255,255,255,.72); }
        .acl-pp__stage--dim{ opacity:.5; }

        /* ── lower split: growth chart + metric tiles ── */
        .acl-pp__lower{ flex:1; display:flex; gap:40px; margin-top:24px; min-height:0; }
        .acl-pp__chart{ flex:1; display:flex; flex-direction:column; min-width:0;
          border-right:2px dashed rgba(22,21,15,.2); padding-right:38px; }
        .acl-pp__chlabel{ display:flex; align-items:baseline; gap:12px; }
        .acl-pp__chlabel .t{ font-weight:700; font-size:24px; }
        .acl-pp__chlabel .d{ font-family:var(--acl-font-num); font-size:46px; line-height:.8; color:var(--acl-ink); }
        .acl-pp__chlabel .d em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:18px;
          margin-left:3px; opacity:.6; }
        .acl-pp__plot{ position:relative; flex:1; margin-top:14px; min-height:0; }
        .acl-pp__svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-pp__gbar{ position:absolute; bottom:0; background:var(--acl-ink); transition:height .4s; }
        .acl-pp__vlab{ position:absolute; transform:translate(-50%,-100%); font-family:var(--acl-font-num);
          font-size:26px; line-height:1; white-space:nowrap;
          text-shadow:0 0 6px var(--acl-paper),0 0 6px var(--acl-paper),0 0 6px var(--acl-paper); }
        .acl-pp__xax{ display:flex; margin-top:8px; }
        .acl-pp__xt{ flex:1; text-align:center; font-family:var(--acl-font-mono); font-size:14px;
          letter-spacing:.04em; color:rgba(22,21,15,.55); }

        .acl-pp__tiles{ flex:0 0 430px; display:flex; flex-direction:column; gap:14px; }
        .acl-pp__hero{ border:2.5px solid var(--acl-ink); background:var(--acl-ink); color:var(--acl-paper);
          padding:14px 20px 16px; }
        .acl-pp__hero .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(255,255,255,.6); }
        .acl-pp__hero .v{ font-family:var(--acl-font-num); font-size:84px; line-height:.84; margin-top:2px; white-space:nowrap; }
        .acl-pp__hero .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:22px;
          margin-left:6px; opacity:.7; }
        .acl-pp__trow{ display:flex; gap:14px; flex:1; }
        .acl-pp__tile{ flex:1; border:2px solid var(--acl-ink); padding:13px 16px 11px; display:flex;
          flex-direction:column; justify-content:center; }
        .acl-pp__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-pp__tile .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.94; margin-top:3px; }
        .acl-pp__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }

        .acl-pp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pp__panel{ animation:acl-pp-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-pp__stage{ animation:acl-pp-step .4s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .12s); }
          [data-deck-active] .acl-pp__gbar{ animation:acl-pp-grow .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-pp-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-pp-step{ from{ opacity:0; transform:translateX(-14px); } to{ opacity:1; transform:none; } }
        @keyframes acl-pp-grow{ from{ transform:scaleY(0); transform-origin:bottom; } to{ transform:none; } }
      `}</style>

      <div className="acl-pp__head">
        <div>
          <div className="acl-pp__eyebrow">{eyebrow}</div>
          <h1 className="acl-pp__h">{headline}</h1>
        </div>
        <div className="acl-pp__sub">{subheadline}</div>
        <div className="acl-pp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pp__panel">
        <div className="acl-pp__badge">▤ {badge}</div>
        {showDecor && (
          <Doodle kind="spark" size={46} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
            style={{ right: 28, top: 24 }} />
        )}

        <div className="acl-pp__flowhd">数据流水线 · Data Pipeline</div>
        <div className="acl-pp__pipe">
          {stg.map((s, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            return (
              <div key={i} className={'acl-pp__stage' + (isF ? ' acl-pp__stage--focus' : '') + (dim ? ' acl-pp__stage--dim' : '')}
                style={{ '--i': i }}>
                <div className="si">{String(i + 1).padStart(2, '0')}</div>
                <div className="sn">{s.t}</div>
                <div className="se">{s.s}</div>
              </div>
            );
          })}
        </div>

        <div className="acl-pp__lower">
          {/* growth mini-chart */}
          <div className="acl-pp__chart">
            <div className="acl-pp__chlabel">
              <span className="t">{growthTitle}</span>
              <span className="d">{hero.growth}<em>{growthUnit}</em></span>
            </div>
            <div className="acl-pp__plot">
              {chartType === 'column' && growth.map((d, i) => (
                <div key={i} className="acl-pp__gbar"
                  style={{ left: `${((gx(i) - gbarW / 2) / GW) * 100}%`, width: `${(gbarW / GW) * 100}%`,
                    height: `${((GH - gy(d.v)) / GH) * 100}%`,
                    background: i === gn - 1 ? 'var(--acl-pink)' : 'var(--acl-ink)' }} />
              ))}
              <svg className="acl-pp__svg" viewBox={`0 0 ${GW} ${GH}`} preserveAspectRatio="none">
                {chartType === 'area' && <path d={gArea} fill="var(--acl-pink)" fillOpacity="0.85" />}
                {(chartType === 'area' || chartType === 'line') && (
                  <path d={gLine} fill="none" stroke="var(--acl-ink)" strokeWidth="4"
                    strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                )}
              </svg>
              {(chartType === 'line' || chartType === 'area') && growth.map((d, i) => (
                <div key={i} style={{ position: 'absolute', left: `${(gx(i) / GW) * 100}%`, top: `${(gy(d.v) / GH) * 100}%`,
                  width: 13, height: 13, borderRadius: '50%', background: 'var(--acl-blue)', border: '3px solid var(--acl-ink)',
                  transform: 'translate(-50%,-50%)' }} />
              ))}
              {showValueLabels && growth.map((d, i) => (
                <div key={i} className="acl-pp__vlab"
                  style={{ left: `${(gx(i) / GW) * 100}%`, top: `calc(${(gy(d.v) / GH) * 100}% - 12px)`,
                    color: i === gn - 1 ? 'var(--acl-pink)' : 'var(--acl-ink)' }}>{d.v}</div>
              ))}
            </div>
            <div className="acl-pp__xax">
              {growth.map((d, i) => <div key={i} className="acl-pp__xt">{d.label}</div>)}
            </div>
          </div>

          {/* hero figure + metric tiles */}
          <div className="acl-pp__tiles">
            <div className="acl-pp__hero">
              <div className="k">{hero.label}</div>
              <div className="v">{hero.value}<em>{hero.unit}</em></div>
            </div>
            <div className="acl-pp__trow">
              {tiles.map((m, i) => (
                <div key={i} className="acl-pp__tile">
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v}<em>{m.unit}</em></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="acl-pp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page34Pipeline.defaults = {
  backgroundTheme: 'primary',
  stageCount: 5,           // 3–5 pipeline stages
  chartType: 'area',       // column | area | line — growth mini-chart
  showValueLabels: true,
  metricCount: 3,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 2,           // highlight the 向量索引 stage
  showDecor: true,
  eyebrow: 'Data Infrastructure',
  headline: '企业 AI 底座',
  subheadline: '数据基础设施',
  summary: '数据基础设施承接<b>模型训练、RAG 与知识管理</b>需求。',
  badge: 'Data Infra · 企业 AI 底座',
  // pipeline stages — text not parameterized (count via stageCount)
  stages: [
    { t: '数据接入', s: 'Ingest' },
    { t: '清洗治理', s: 'Govern' },
    { t: '向量索引', s: 'Index' },
    { t: '检索增强', s: 'Retrieve' },
    { t: '应用交付', s: 'Serve' },
  ],
  growthTitle: '企业客户增长',
  growth: [
    { label: 'Q1', v: 100 },
    { label: 'Q2', v: 118 },
    { label: 'Q3', v: 132 },
    { label: 'Q4', v: 147 },
  ],
  growthUnit: '指数',
  hero: { label: '赛道融资额', value: '61', unit: '亿美元', growth: '+47', },
  metrics: [
    { k: '事件数', v: '12', unit: '笔' },
    { k: '平均单笔', v: '5.1', unit: '亿' },
    { k: '客户增长', v: '+47', unit: '%' },
  ],
  closingLine: '没有数据底座，AI 应用很难稳定落地。',
};

Page34Pipeline.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'stageCount', type: 'number', default: 5, min: 3, max: 5, step: 1,
    label: '流程阶段', desc: '数据流水线的阶段数量(3–5)' },
  { key: 'chartType', type: 'enum', default: 'area', options: ['column', 'area', 'line'],
    label: '图表类型', desc: '增长趋势迷你图：柱状 / 面积 / 折线' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '增长趋势图数值标签的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主数字旁的支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个流程阶段(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 4, step: 1, maxFrom: 'stageCount',
    label: '重点对象', desc: '被高亮的流程阶段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page34Pipeline.defaults;
export const controls = Page34Pipeline.controls;
