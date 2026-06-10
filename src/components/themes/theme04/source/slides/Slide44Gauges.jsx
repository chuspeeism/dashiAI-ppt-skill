/*
 * Slide44Gauges — 三重集中（图表页 · 环形仪表盘 Radial Gauge / 横向柱状双模）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsGg- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 新图表类型：用 conic-gradient 画环形仪表盘（弧长 ∝ 集中度百分比），三盘并列表达
 * 「钱、赛道、地理」三重集中（赢家通吃）。chartVariant 可切到横向柱状对照。
 * 数据来源报告 3.1 地区分布（湾区 63.9%）、3.1 赛道占比（大模型 43.3%）、3.2 轮次结构。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  gaugeCount      number 展示的仪表盘数量(1–3)  默认 3
 *  chartVariant    enum   编码方式             默认 'gauge' 可选 'gauge'|'bar'
 *  focusEnabled    bool   重点仪表高亮开关       默认 false
 *  focusIndex      number 重点仪表序号(从1起)   默认 1   范围 1–gaugeCount
 *  showContext     bool   盘下注释行显隐         默认 true
 *  showTrack       bool   底环（未填充弧）显隐    默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide44Gauges, { defaults, controls } from './Slide44Gauges.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 3 个集中度仪表（写死）：维度 / 主体 / 百分比数值 / 主色 / 注释
const XHSGG_DIALS = [
  { dim: '地理集中', en: 'GEOGRAPHY', value: 63.9, label: '旧金山湾区', color: '#15A7F0', note: '六成资金落在一座湾区' },
  { dim: '赛道集中', en: 'SECTOR', value: 43.3, label: '通用大模型', color: '#27E021', note: '近半押注同一条赛道' },
  { dim: '头部集中', en: 'LATE-STAGE', value: 45.4, label: 'D 轮及以后 / 未标明', color: '#FFC700', note: '后期大额轮包揽近半笔数' },
];

function GgSpark({ size = 22, color = '#fff', style }) {
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

function GgDial({ d, idx, focusEnabled, focus, showContext, showTrack, percentSuffix = '%' }) {
  const hot = focusEnabled && idx === focus;
  const dim = focusEnabled && idx !== focus;
  const deg = (d.value / 100) * 360;
  const track = showTrack ? 'rgba(255,255,255,.08)' : 'transparent';
  const ring = `conic-gradient(from -90deg, var(--c) 0deg, color-mix(in srgb, var(--c) 60%, #fff) ${deg}deg, ${track} ${deg}deg 360deg)`;
  return (
    <div className={'xhsGg-dial' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')} style={{ '--c': d.color }}>
      <div className="xhsGg-dim">
        <span className="xhsGg-dim-zh">{d.dim}</span>
        <span className="xhsGg-dim-en">{d.en}</span>
      </div>
      <div className="xhsGg-ringwrap">
        <div className="xhsGg-ring" style={{ background: ring }}>
          <div className="xhsGg-hole">
            <div className="xhsGg-pct">{d.value}<span className="xhsGg-pct-sym">{percentSuffix}</span></div>
            <div className="xhsGg-sub">{d.label}</div>
          </div>
        </div>
      </div>
      {showContext && <div className="xhsGg-note">{d.note}</div>}
    </div>
  );
}


const SLIDE44GAUGES_COPY = {
  text001: "集中度 · CONCENTRATION",
  text002: "钱、赛道、地理，",
  text003: "越挤越窄",
  text004: "%",
  text005: "赢家通吃",
  text006: "资金高度向头部公司、单一赛道与少数枢纽集中 · 数据为调研整理（报告 3.1 / 3.2）",
};
function Slide44Gauges(props) {
  const {
      copy = SLIDE44GAUGES_COPY,
      dialsData = XHSGG_DIALS,
    gaugeCount = 3,
    chartVariant = 'gauge',
    focusEnabled = false,
    focusIndex = 1,
    showContext = true,
    showTrack = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(1, Math.min(3, gaugeCount));
  const dials = dialsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isBar = chartVariant === 'bar';

  return (
    <section className="xhs-base xhsGg-root" data-label="三重集中" data-screen-label="三重集中">
      <style>{XHSGG_CSS}</style>

      <header className="xhsGg-head">
        <div className="xhsGg-kicker">{copy.text001}</div>
        <h2 className="xhsGg-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      {!isBar ? (
        <div className="xhsGg-stage" style={{ '--n': n }}>
          {dials.map((d, i) => (
            <GgDial key={i} d={d} idx={i} focusEnabled={focusEnabled} focus={focus}
              showContext={showContext} showTrack={showTrack} percentSuffix={copy.text004} />
          ))}
        </div>
      ) : (
        <div className="xhsGg-bars">
          {dials.map((d, i) => {
            const hot = focusEnabled && i === focus;
            const dimc = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsGg-barrow' + (hot ? ' is-hot' : '') + (dimc ? ' is-dim' : '')} style={{ '--c': d.color }}>
                <div className="xhsGg-barhead">
                  <span className="xhsGg-barzh">{d.dim}</span>
                  <span className="xhsGg-barlabel">{d.label}</span>
                </div>
                <div className="xhsGg-bartrack">
                  <div className="xhsGg-barfill" style={{ width: d.value + '%' }}>
                    <span className="xhsGg-barval">{d.value}<i>{copy.text004}</i></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <footer className="xhsGg-foot">
        <span className="xhsGg-foot-tag">{copy.text005}</span>
        <span className="xhsGg-foot-txt">{copy.text006}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <GgSpark size={24} color="#27E021" style={{ position: 'absolute', left: 80, top: 150 }} />
          <GgSpark size={15} color="#FF9FE2" style={{ position: 'absolute', right: 96, bottom: 110 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSGG_CSS = `
  .xhsGg-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsGg-head{ flex:0 0 auto; margin-bottom:20px; }
  .xhsGg-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsGg-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsGg-stage{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:repeat(var(--n),1fr); gap:32px; align-items:center; justify-items:center; }

  .xhsGg-dial{ display:flex; flex-direction:column; align-items:center; gap:26px; width:100%; max-width:480px;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsGg-dial.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsGg-dial.is-hot{ transform:scale(1.04); }

  .xhsGg-dim{ display:flex; flex-direction:column; align-items:center; gap:4px; }
  .xhsGg-dim-zh{ font-size:30px; font-weight:900; color:#fff; }
  .xhsGg-dim-en{ font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.14em; color:#7c7c7c; }

  .xhsGg-ringwrap{ position:relative; width:min(42vh,410px); aspect-ratio:1; }
  .xhsGg-ring{ position:absolute; inset:0; border-radius:50%;
    filter:drop-shadow(0 0 34px color-mix(in srgb, var(--c) 30%, transparent)); }
  .xhsGg-dial.is-hot .xhsGg-ring{ filter:drop-shadow(0 0 52px color-mix(in srgb, var(--c) 50%, transparent)); }
  .xhsGg-hole{ position:absolute; inset:14%; border-radius:50%; background:radial-gradient(circle at 50% 36%, #161616, #0a0a0a 72%);
    border:1.5px solid rgba(255,255,255,.07); box-shadow:inset 0 0 30px rgba(0,0,0,.7);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:0 8%; box-sizing:border-box; }
  .xhsGg-pct{ font-family:"Space Mono",monospace; font-weight:700; line-height:.9; color:var(--c);
    font-size:clamp(42px,6.2vh,66px); display:flex; align-items:baseline;
    text-shadow:0 0 30px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsGg-pct-sym{ font-size:.4em; margin-left:2px; color:#cfcfcf; }
  .xhsGg-sub{ font-size:21px; font-weight:700; color:#dcdcdc; text-align:center; padding:0 10%; line-height:1.2; }

  .xhsGg-note{ font-size:21px; font-weight:500; color:#9a9a9a; text-align:center; line-height:1.35; max-width:320px; }

  /* ── 横向柱状对照 ── */
  .xhsGg-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:32px; }
  .xhsGg-barrow{ display:grid; grid-template-columns:360px 1fr; align-items:center; gap:30px; transition:opacity .3s, filter .3s; }
  .xhsGg-barrow.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsGg-barhead{ display:flex; flex-direction:column; gap:4px; }
  .xhsGg-barzh{ font-size:32px; font-weight:900; color:#fff; }
  .xhsGg-barlabel{ font-size:19px; font-weight:500; color:#9a9a9a; }
  .xhsGg-bartrack{ height:60px; border-radius:16px; background:linear-gradient(180deg,#141414,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.06); overflow:hidden; }
  .xhsGg-barfill{ height:100%; border-radius:14px; display:flex; align-items:center; justify-content:flex-end; padding-right:20px; min-width:120px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 34%, #0c0c0c), var(--c));
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 36%, transparent), inset 0 2px 0 rgba(255,255,255,.3); }
  .xhsGg-barval{ font-family:"Space Mono",monospace; font-weight:700; font-size:30px; color:#06140f; display:flex; align-items:baseline; }
  .xhsGg-barval i{ font-style:normal; font-size:.6em; margin-left:2px; }
  .xhsGg-barrow.is-hot .xhsGg-bartrack{ border-color:var(--c); box-shadow:0 0 40px color-mix(in srgb, var(--c) 26%, transparent); }

  /* ── 页脚 ── */
  .xhsGg-foot{ flex:0 0 auto; margin-top:24px; display:flex; align-items:center; gap:18px; }
  .xhsGg-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#FFC700; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(255,199,0,.4); }
  .xhsGg-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'gauges',
  label: '三重集中',
  Component: Slide44Gauges,
  defaults: {
      copy: SLIDE44GAUGES_COPY,
      dialsData: XHSGG_DIALS,
    ...hlDefaults,
    gaugeCount: 3,
    chartVariant: 'gauge',
    focusEnabled: false,
    focusIndex: 1,
    showContext: true,
    showTrack: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE44GAUGES_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'dialsData', type: 'list', label: 'dialsData', itemLabel: '数据', fields: [{ key: "dim", label: "dim" }, { key: "en", label: "en" }, { key: "value", label: "value" }, { key: "label", label: "label" }, { key: "color", label: "color" }, { key: "note", label: "note" }], default: XHSGG_DIALS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'gaugeCount', type: 'slider', label: '仪表盘数', min: 1, max: 3, step: 1, default: 3, desc: '展示的环形仪表盘数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['gauge', 'bar'], optionLabels: ['环形盘', '横向柱'], default: 'gauge', desc: '环形仪表盘 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一仪表盘' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'gaugeCount', showIf: (v) => v.focusEnabled, desc: '被高亮仪表盘的序号' },
    { key: 'showContext', type: 'toggle', label: '盘下注释', default: true, desc: '仪表盘下方注释行' },
    { key: 'showTrack', type: 'toggle', label: '底环', default: true, desc: '未填充弧（底环）显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide44Gauges.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide44Gauges;
