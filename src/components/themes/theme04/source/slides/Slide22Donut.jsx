/*
 * Slide22Donut — 行业赛道占比（图表页 · EvilCharts 风格：同心环形 / 渐变柱状可切换）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsPie- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 设计参考 EvilCharts（github.com/legions-developer/evilcharts）的两类图表：
 *  · Radial Chart —— 同心「圆角放射条」(concentric rounded radial bars)，每个赛道
 *    一圈，弧长 ∝ 占比；对角线性渐变描边 + feGaussianBlur 柔光，焦点圈不透明并发光，
 *    其余降透明。inner→outer 多圈、圆角端点、淡轨道在底。
 *  · Bar Chart —— 纵向渐变柱，柱体上亮下暗渐变 + 圆角顶 + 淡轨道 + 点阵网格背景 +
 *    Space Mono 数字，焦点柱发光、其余淡化。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  segmentCount    number 展示的赛道分段数     默认 5   可选 2–5
 *  chartVariant    enum   图表类型            默认 'donut'('环形'=同心放射) | 'bar'(纵向柱)
 *  focusEnabled    bool   重点分段高亮开关      默认 true
 *  focusIndex      number 重点分段序号(从1起)   默认 1
 *  showCenterTotal bool   环形中心总额显隐       默认 true（环形生效）
 *  showLegend      bool   右侧图例列表显隐       默认 true（环形生效）
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide22Donut, { defaults, controls } from './Slide22Donut.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 行业赛道融资额占比（报告 3.1）
const XHSPIE_SEGS = [
  { zh: '通用大模型', en: 'Foundation Model', amt: 420, pct: 43.3, color: '#15A7F0' },
  { zh: '垂直应用', en: 'Vertical AI', amt: 245, pct: 25.3, color: '#27E021' },
  { zh: 'AI 基础设施', en: 'Infrastructure', amt: 158, pct: 16.3, color: '#FFC700' },
  { zh: 'AI 芯片', en: 'Hardware', amt: 97, pct: 10.0, color: '#FF9FE2' },
  { zh: '其他赛道', en: 'Tooling · Safety', amt: 50, pct: 5.1, color: '#8a8f98' },
];

function PieSpark({ size = 20, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 5px ${color}aa)`, ...style }}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path fill={`url(#${gid})`} d="M47.283 12.469C48.906 8.146 55.022 8.146 56.645 12.469L65.349 35.655C65.856 37.006 66.922 38.072 68.273 38.579L91.459 47.283C95.782 48.906 95.782 55.022 91.459 56.645L68.273 65.349C66.922 65.856 65.856 66.922 65.349 68.273L56.645 91.459C55.022 95.782 48.906 95.782 47.283 91.459L38.579 68.273C38.072 66.922 37.006 65.856 35.655 65.349L12.469 56.645C8.146 55.022 8.146 48.906 12.469 47.283L35.655 38.579C37.006 38.072 38.072 37.006 38.579 35.655L47.283 12.469Z" />
    </svg>
  );
}

// ── EvilCharts 风「同心圆角放射条」──────────────────────────────────────
// 每个赛道一圈：底部淡轨道（整圈）+ 彩色弧（弧长 ∝ 占比，圆角端点）。
// 对角线性渐变描边；焦点圈 feGaussianBlur 柔光、其余降透明。
function RadialRings({ segs, focus, focusEnabled, showCenterTotal, centerUnit = '亿美元', centerCap = '总融资额' }) {
  const uid = React.useId().replace(/:/g, '');
  const VB = 400, C = VB / 2;
  const outerR = 186, innerR = 84;
  const n = segs.length;
  const step = (outerR - innerR) / n;       // 圈心间距
  const bw = Math.min(28, step - 9);         // 描边宽（留缝）
  const total = segs.reduce((a, s) => a + (Number(s.amt) || 0), 0);
  const hotColor = (segs[focus] && segs[focus].color) || '#15A7F0';

  return (
    <div className="xhsPie-radialWrap"
      style={{ filter: focusEnabled ? `drop-shadow(0 18px 50px ${hotColor}33)` : 'none' }}>
      <svg viewBox={`0 0 ${VB} ${VB}`} className="xhsPie-radialSvg" aria-hidden="true">
        <defs>
          {segs.map((s, i) => (
            <linearGradient key={i} id={`${uid}-g${i}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.98" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.42" />
            </linearGradient>
          ))}
          <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="b" />
            <feColorMatrix in="b" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.75 0" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {segs.map((s, i) => {
          const R = outerR - step * i - bw / 2;
          const circ = 2 * Math.PI * R;
          const len = circ * (s.pct / 100);   // 占整圈比例
          const dim = focusEnabled && i !== focus;
          const hot = focusEnabled && i === focus;
          return (
            <g key={i} transform={`rotate(-90 ${C} ${C})`}>
              {/* 淡轨道（整圈） */}
              <circle cx={C} cy={C} r={R} fill="none" stroke="#ffffff"
                strokeOpacity="0.07" strokeWidth={bw} />
              {/* 彩色弧（弧长 ∝ 占比，圆角端点） */}
              <circle cx={C} cy={C} r={R} fill="none" stroke={`url(#${uid}-g${i})`}
                strokeWidth={bw} strokeLinecap="round"
                strokeDasharray={`${len} ${circ}`}
                filter={hot ? `url(#${uid}-glow)` : undefined}
                style={{ opacity: dim ? 0.32 : 1, transition: 'opacity .35s ease' }} />
            </g>
          );
        })}
      </svg>
      {showCenterTotal && (
        <div className="xhsPie-center">
          <span className="xhsPie-c-num">{total}</span>
          <span className="xhsPie-c-unit">{centerUnit}</span>
          <span className="xhsPie-c-cap">{centerCap}</span>
        </div>
      )}
    </div>
  );
}

// ── EvilCharts 风「纵向渐变柱」──────────────────────────────────────────
// 上亮下暗渐变 + 圆角顶 + 淡轨道 + 点阵网格背景；焦点柱发光、其余淡化。
function BarColumns({ segs, focus, focusEnabled, percentSuffix = '%', amountUnit = '亿' }) {
  const maxPct = Math.max.apply(null, segs.map((s) => Number(s.pct) || 0));
  return (
    <div className="xhsPie-cols">
      <div className="xhsPie-plot">
        {segs.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsPie-col' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.color }}>
              <div className="xhsPie-colTrack">
                <div className="xhsPie-bar" style={{ height: (s.pct / maxPct) * 92 + '%' }}>
                  <span className="xhsPie-colVal">{Number(s.pct).toFixed(1)}<i>{percentSuffix}</i></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="xhsPie-axis">
        {segs.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsPie-axCell' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.color }}>
              <span className="xhsPie-axDot" />
              <span className="xhsPie-axZh">{s.zh}</span>
              <span className="xhsPie-axEn">{s.en}</span>
              <span className="xhsPie-axAmt">{s.amt}<i>{amountUnit}</i></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


const SLIDE22DONUT_COPY = {
  text001: "亿",
  text002: "%",
};
function Slide22Donut(props) {
  const {
      copy = SLIDE22DONUT_COPY,
    segmentCount = 5,
    chartVariant = 'donut',
    focusEnabled = true,
    focusIndex = 1,
    showCenterTotal = true,
    showLegend = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '行业分布 · SECTOR SHARE',
    titleLead = '通用大模型',
    titleKeyword = '独占近半',
    sub = '97 笔大额融资按赛道归类，资金向「底座」高度倾斜——投资人押注 AGI 叙事。',
    centerUnit = '亿美元',
    centerCap = '总融资额',
    // 数据
    segments = XHSPIE_SEGS,
  } = props;

  const src = Array.isArray(segments) && segments.length ? segments : XHSPIE_SEGS;
  const count = Math.max(2, Math.min(src.length, segmentCount));
  const segs = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';

  const head = (
    <header className="xhsPie-head">
      <div className="xhsPie-kicker">{kicker}</div>
      <h2 className="xhsPie-title">
        {titleLead}<HL color="#15A7F0" variant={hlStyle} tilt={hlTilt}>{titleKeyword}</HL>
      </h2>
      <p className="xhsPie-sub">{sub}</p>
    </header>
  );

  const legend = showLegend ? (
    <ul className="xhsPie-legend">
      {segs.map((s, i) => {
        const hot = focusEnabled && i === focus;
        const dim = focusEnabled && i !== focus;
        return (
          <li key={i} className={'xhsPie-leg' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
            style={{ '--c': s.color }}>
            <span className="xhsPie-dot" />
            <span className="xhsPie-legName">
              <span className="xhsPie-legZh">{s.zh}</span>
              <span className="xhsPie-legEn">{s.en}</span>
            </span>
            <span className="xhsPie-legAmt">{s.amt}<i>{copy.text001}</i></span>
            <span className="xhsPie-legPct">{Number(s.pct).toFixed(1)}{copy.text002}</span>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <section className={'xhs-base xhsPie-root' + (isBar ? ' is-barRoot' : ' is-donutRoot')}
      data-label="赛道占比" data-screen-label="赛道占比">
      <style>{XHSPIE_CSS}</style>

      {isBar ? (
        <React.Fragment>
          {head}
          <div className="xhsPie-stage is-bar">
            <BarColumns segs={segs} focus={focus} focusEnabled={focusEnabled} percentSuffix={copy.text002} amountUnit={copy.text001} />
          </div>
        </React.Fragment>
      ) : (
        <div className="xhsPie-split">
          <div className="xhsPie-left">
            {head}
            {legend}
          </div>
          <div className="xhsPie-right">
            <RadialRings segs={segs} focus={focus} focusEnabled={focusEnabled} showCenterTotal={showCenterTotal}
              centerUnit={centerUnit} centerCap={centerCap} />
          </div>
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <PieSpark size={26} color="#27E021" style={{ position: 'absolute', left: 80, bottom: 92 }} />
          <PieSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 96, top: 150 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSPIE_CSS = `
  .xhsPie-root{ padding:80px 110px 76px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsPie-head{ flex:0 0 auto; margin-bottom:30px; }
  .xhsPie-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:16px; }
  .xhsPie-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsPie-sub{ margin:20px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1300px; }

  .xhsPie-stage{ flex:1 1 auto; min-height:0; display:flex; }

  /* ── 环形页：左（标题+副题+类目，上下居中） / 右（图表）── */
  .xhsPie-split{ flex:1 1 auto; min-height:0; display:flex; align-items:center; gap:60px; }
  .xhsPie-left{ flex:1 1 0; min-width:0; display:flex; flex-direction:column; justify-content:center; gap:38px; }
  .xhsPie-left .xhsPie-head{ margin-bottom:0; }
  .xhsPie-right{ flex:1 1 0; min-width:0; display:flex; align-items:center; justify-content:center; }

  /* ── EvilCharts 同心放射条 ── */
  .xhsPie-radialWrap{ position:relative; flex:0 0 auto; width:580px; height:580px;
    display:flex; align-items:center; justify-content:center; }
  .xhsPie-radialSvg{ width:100%; height:100%; overflow:visible;
    filter:saturate(1.12) brightness(1.04); }
  .xhsPie-center{ position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:2px; pointer-events:none; }
  .xhsPie-c-num{ font-family:"Space Mono",monospace; font-size:96px; font-weight:700; color:#fff; line-height:.9;
    text-shadow:0 0 40px rgba(21,167,240,.4); }
  .xhsPie-c-unit{ font-size:28px; font-weight:700; color:#bcbcbc; margin-top:8px; }
  .xhsPie-c-cap{ font-size:21px; font-weight:600; color:#7c7c7c; margin-top:6px; letter-spacing:.04em; }

  /* ── 图例 ── */
  .xhsPie-legend{ list-style:none; margin:0; padding:0; width:100%; max-width:700px; display:flex; flex-direction:column; gap:14px; }
  .xhsPie-leg{ display:grid; grid-template-columns:auto 1fr auto auto; align-items:center; column-gap:22px;
    padding:18px 26px; border-radius:18px; background:linear-gradient(160deg,#161616,#0d0d0d);
    border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s; }
  .xhsPie-leg.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsPie-leg.is-hot{ transform:translateX(8px); border-color:var(--c);
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 18%, #151515), #0d0d0d);
    box-shadow:0 0 48px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsPie-dot{ width:22px; height:22px; border-radius:7px; background:var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsPie-legName{ display:flex; flex-direction:column; gap:2px; min-width:0; }
  .xhsPie-legZh{ font-size:30px; font-weight:900; color:#fff; }
  .xhsPie-legEn{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.08em; color:#6f6f6f; }
  .xhsPie-legAmt{ font-size:26px; font-weight:700; color:#a8a8a8; white-space:nowrap; }
  .xhsPie-legAmt i{ font-style:normal; font-size:18px; margin-left:2px; }
  .xhsPie-legPct{ font-family:"Space Mono",monospace; font-size:38px; font-weight:700; color:var(--c); width:130px; text-align:right;
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 40%, transparent); }

  /* ── EvilCharts 纵向渐变柱 ── */
  .xhsPie-stage.is-bar{ align-items:stretch; }
  .xhsPie-cols{ flex:1; display:flex; flex-direction:column; min-width:0; }
  .xhsPie-plot{ height:486px; display:flex; align-items:flex-end; justify-content:space-between;
    gap:40px; padding:0 26px; position:relative; box-sizing:border-box;
    border-bottom:2px solid rgba(255,255,255,.16);
    background-image:radial-gradient(rgba(255,255,255,.08) 1.5px, transparent 1.5px);
    background-size:28px 28px; background-position:13px 0; }
  .xhsPie-col{ position:relative; flex:1 1 0; height:100%; display:flex; align-items:flex-end; justify-content:center;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsPie-col.is-dim{ opacity:.4; filter:saturate(.7); }
  .xhsPie-colTrack{ position:relative; width:100%; max-width:172px; height:100%; display:flex; align-items:flex-end; }
  .xhsPie-colTrack::before{ content:""; position:absolute; inset:0; border-radius:18px 18px 0 0;
    background:rgba(255,255,255,.04); }
  .xhsPie-bar{ position:relative; width:100%; border-radius:18px 18px 0 0; min-height:26px;
    background:linear-gradient(180deg, var(--c) 0%, color-mix(in srgb, var(--c) 30%, #000) 100%);
    box-shadow:inset 0 2px 0 color-mix(in srgb,#fff 55%, transparent),
      0 0 30px color-mix(in srgb, var(--c) 34%, transparent);
    transition:filter .3s ease, box-shadow .3s ease; }
  .xhsPie-col.is-hot .xhsPie-bar{ filter:brightness(1.1) saturate(1.12);
    box-shadow:inset 0 2px 0 color-mix(in srgb,#fff 60%, transparent),
      0 0 56px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsPie-colVal{ position:absolute; top:-58px; left:50%; transform:translateX(-50%);
    font-family:"Space Mono",monospace; font-size:42px; font-weight:700; color:var(--c); white-space:nowrap;
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsPie-colVal i{ font-style:normal; font-size:24px; margin-left:1px; }
  .xhsPie-axis{ display:flex; justify-content:space-between; gap:40px; padding:22px 26px 0; }
  .xhsPie-axCell{ flex:1 1 0; display:flex; flex-direction:column; align-items:center; gap:5px; text-align:center;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsPie-axCell.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsPie-axDot{ width:18px; height:18px; border-radius:6px; background:var(--c); margin-bottom:3px;
    box-shadow:0 0 14px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsPie-axZh{ font-size:30px; font-weight:900; color:#fff; white-space:nowrap; }
  .xhsPie-axEn{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.08em; color:#6f6f6f; }
  .xhsPie-axAmt{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; color:#a8a8a8; margin-top:2px; }
  .xhsPie-axAmt i{ font-style:normal; font-size:15px; margin-left:1px; }
  .xhsPie-axCell.is-hot .xhsPie-axAmt{ color:var(--c); }
`;

const META = {
  id: 'donut',
  label: '赛道占比',
  Component: Slide22Donut,
  defaults: {
      copy: SLIDE22DONUT_COPY,
    ...hlDefaults,
    segmentCount: 5,
    chartVariant: 'donut',
    focusEnabled: true,
    focusIndex: 1,
    showCenterTotal: true,
    showLegend: true,
    showDecorations: true,
    kicker: '行业分布 · SECTOR SHARE',
    titleLead: '通用大模型',
    titleKeyword: '独占近半',
    sub: '97 笔大额融资按赛道归类，资金向「底座」高度倾斜——投资人押注 AGI 叙事。',
    centerUnit: '亿美元',
    centerCap: '总融资额',
    segments: XHSPIE_SEGS,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }], default: SLIDE22DONUT_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'segmentCount', type: 'slider', label: '分段数量', min: 2, max: 5, step: 1, default: 5, desc: '展示的赛道分段数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['donut', 'bar'], optionLabels: ['环形', '柱状'], default: 'donut', desc: '同心放射环 / 纵向渐变柱' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一分段' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 1, maxFromKey: 'segmentCount', showIf: (v) => v.focusEnabled, desc: '被高亮分段的序号' },
    { key: 'showCenterTotal', type: 'toggle', label: '中心总额', default: true, showIf: (v) => v.chartVariant === 'donut', desc: '环形中心总融资额(环形生效)' },
    { key: 'showLegend', type: 'toggle', label: '图例列表', default: true, showIf: (v) => v.chartVariant === 'donut', desc: '右侧图例列表(环形生效)' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '行业分布 · SECTOR SHARE', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '通用大模型', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '独占近半', desc: '高亮关键词' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '97 笔大额融资按赛道归类，资金向「底座」高度倾斜——投资人押注 AGI 叙事。', desc: '标题下方说明' },
    { key: 'centerUnit', type: 'text', label: '中心单位', default: '亿美元', desc: '环形中心单位', showIf: (v) => v.chartVariant === 'donut' && v.showCenterTotal },
    { key: 'centerCap', type: 'text', label: '中心说明', default: '总融资额', desc: '环形中心说明', showIf: (v) => v.chartVariant === 'donut' && v.showCenterTotal },
    { type: 'section', label: '数据 · 赛道' },
    {
      key: 'segments', type: 'list', label: '赛道分段', itemLabel: '赛道', countFromKey: 'segmentCount',
      fields: [{ key: 'zh', label: '中文名' }, { key: 'en', label: '英文名' }, { key: 'amt', label: '金额' }, { key: 'pct', label: '占比%' }, { key: 'color', label: '颜色' }],
      default: XHSPIE_SEGS, desc: '赛道：中文 / 英文 / 金额 / 占比 / 主色（中心总额自动求和）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide22Donut.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide22Donut;
