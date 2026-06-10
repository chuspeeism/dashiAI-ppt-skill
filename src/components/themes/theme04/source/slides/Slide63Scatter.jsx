/*
 * Slide63Scatter — 估值×融资 气泡散点图（图表 · 新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSct- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 全 deck 尚无「散点 / 气泡」图表语言：横轴=2024 融资规模、纵轴=最新估值、
 * 气泡大小=资本热度，一图看清「谁估值高、谁融资猛、谁估值跑在前」。
 * 背景按对角线分「估值兑现 / 估值跑前」两区淡色块；focus 强化某家 + 弱化其余。
 * 数值为调研整理（报告 2.x / 案例，单位亿美元，纵轴 sqrt 示意比例）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 展示的公司气泡数(3–6)  默认 6
 *  chartVariant    enum   图表类型               默认 'scatter' 可选 'scatter'|'bars'
 *  focusEnabled    bool   重点公司高亮开关        默认 true
 *  focusIndex      number 重点公司序号(从1起)    默认 1   范围 1–itemCount
 *  showZones       bool   背景对角分区淡色块      默认 true（scatter 生效）
 *  showAxisLabels  bool   坐标轴文字显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide63Scatter, { defaults, controls } from './Slide63Scatter.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 公司点（写死，单位亿美元）：名 / 2024融资 raise / 最新估值 val / 热度 heat(3-5) / 主色 / 短注
const XHSSCT_PTS = [
  { name: 'OpenAI', raise: 66, val: 1570, heat: 5, color: '#27E021', note: '估值断层第一' },
  { name: 'Databricks', raise: 100, val: 620, heat: 4, color: '#FFC700', note: '单轮融资最猛' },
  { name: 'Anthropic', raise: 80, val: 600, heat: 5, color: '#15A7F0', note: '安全派头号挑战者' },
  { name: 'xAI', raise: 60, val: 500, heat: 4, color: '#FF9FE2', note: '后发高举高打' },
  { name: 'CoreWeave', raise: 75, val: 230, heat: 3, color: '#27E021', note: '算力底座 · 估值待追' },
  { name: 'SSI', raise: 10, val: 50, heat: 3, color: '#15A7F0', note: '种子即被追捧' },
];

const XHSSCT_MAXR = 110;   // 横轴上限（亿）
const XHSSCT_MAXV = 1600;  // 纵轴上限（亿，sqrt 示意）
const sx = (r) => 9 + (r / XHSSCT_MAXR) * 83;             // left %  9–92
const sy = (v) => 11 + Math.sqrt(v / XHSSCT_MAXV) * 80;   // bottom% 11–91

function SctSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE63SCATTER_COPY = {
  text001: "资本图谱 · VALUATION MAP",
  text002: "融资越猛，",
  text003: "估值就越高吗",
  text004: "亿",
  text005: "融资",
  text006: "亿",
  text007: "估值跑在融资前面",
  text008: "融资换体量 · 估值待追",
  text009: "亿 · 热度",
  text010: "最新估值（亿美元）→",
  text011: "2024 融资规模（亿美元）→",
  text012: "资本图谱",
  text013: "气泡大小 = 资本热度 · 纵轴为 sqrt 示意比例（小值仍可辨识）· 数值见标注（报告 2.x · 调研整理）",
};
function Slide63Scatter(props) {
  const {
      copy = SLIDE63SCATTER_COPY,
      ptsData = XHSSCT_PTS,
    itemCount = 6,
    chartVariant = 'scatter',
    focusEnabled = true,
    focusIndex = 1,
    showZones = true,
    showAxisLabels = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(3, Math.min(6, itemCount));
  const pts = ptsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isBars = chartVariant === 'bars';
  const maxVal = Math.max(...pts.map((p) => p.val));

  return (
    <section className="xhs-base xhsSct-root" data-label="估值散点" data-screen-label="估值散点"
      style={{ '--c': '#15A7F0' }}>
      <style>{XHSSCT_CSS}</style>

      <header className="xhsSct-head">
        <div className="xhsSct-kicker">{copy.text001}</div>
        <h2 className="xhsSct-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      {isBars ? (
        <div className="xhsSct-bars">
          {pts.map((p, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsSct-brow' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': p.color }}>
                <span className="xhsSct-bname"><i className="xhsSct-dot" />{p.name}</span>
                <div className="xhsSct-btrack">
                  <div className="xhsSct-bfill" style={{ width: `${Math.max(8, (p.val / maxVal) * 100)}%` }}>
                    <span className="xhsSct-bval">{p.val}<i>{copy.text004}</i></span>
                  </div>
                </div>
                <span className="xhsSct-braise">{copy.text005}{p.raise}{copy.text006}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="xhsSct-plot">
          {showZones && (
            <React.Fragment>
              <span className="xhsSct-zone is-up" aria-hidden="true" />
              <span className="xhsSct-zone is-down" aria-hidden="true" />
              <span className="xhsSct-diag" aria-hidden="true" />
              <span className="xhsSct-zlab is-up" aria-hidden="true">{copy.text007}</span>
              <span className="xhsSct-zlab is-down" aria-hidden="true">{copy.text008}</span>
            </React.Fragment>
          )}
          {/* 网格刻度 */}
          {[25, 50, 75].map((g) => (
            <span key={'h' + g} className="xhsSct-grid is-h" style={{ bottom: `${g}%` }} aria-hidden="true" />
          ))}
          {[25, 50, 75].map((g) => (
            <span key={'v' + g} className="xhsSct-grid is-v" style={{ left: `${g}%` }} aria-hidden="true" />
          ))}

          {pts.map((p, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const d = 56 + p.heat * 13; // 气泡直径
            return (
              <div key={i} className={'xhsSct-bub' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ left: `${sx(p.raise)}%`, bottom: `${sy(p.val)}%`, '--c': p.color, '--d': d + 'px' }}>
                <span className="xhsSct-disc" aria-hidden="true" />
                <span className="xhsSct-blab">
                  <span className="xhsSct-bn">{p.name}</span>
                  <span className="xhsSct-bm">{p.val}{copy.text009}{p.heat}</span>
                </span>
              </div>
            );
          })}

          {showAxisLabels && (
            <React.Fragment>
              <span className="xhsSct-axY" aria-hidden="true">{copy.text010}</span>
              <span className="xhsSct-axX" aria-hidden="true">{copy.text011}</span>
            </React.Fragment>
          )}
        </div>
      )}

      <footer className="xhsSct-foot">
        <span className="xhsSct-foot-tag">{copy.text012}</span>
        <span className="xhsSct-foot-txt">{copy.text013}</span>
      </footer>

      {showDecorations && (
        <React.Fragment>
          <SctSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 110, top: 150 }} />
          <SctSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSCT_CSS = `
  .xhsSct-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsSct-head{ flex:0 0 auto; margin-bottom:22px; }
  .xhsSct-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsSct-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  /* —— 散点图 —— */
  .xhsSct-plot{ flex:1 1 auto; min-height:0; position:relative; margin:8px 0 30px;
    border-left:2px solid rgba(255,255,255,.18); border-bottom:2px solid rgba(255,255,255,.18);
    border-radius:2px 18px 2px 2px; }
  .xhsSct-grid{ position:absolute; background:rgba(255,255,255,.05); }
  .xhsSct-grid.is-h{ left:0; right:0; height:1.5px; }
  .xhsSct-grid.is-v{ top:0; bottom:0; width:1.5px; }
  .xhsSct-zone{ position:absolute; inset:0; pointer-events:none; clip-path:polygon(0 0,100% 0,0 100%); }
  .xhsSct-zone.is-up{ background:radial-gradient(140% 140% at 12% 8%, color-mix(in srgb,#15A7F0 16%, transparent), transparent 64%); }
  .xhsSct-zone.is-down{ clip-path:polygon(100% 100%,100% 0,0 100%);
    background:radial-gradient(140% 140% at 88% 92%, color-mix(in srgb,#FFC700 13%, transparent), transparent 64%); }
  .xhsSct-diag{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(to top right, transparent calc(50% - 1px), rgba(255,255,255,.16) 50%, transparent calc(50% + 1px)); }
  .xhsSct-zlab{ position:absolute; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; font-weight:700; pointer-events:none; }
  .xhsSct-zlab.is-up{ top:30px; left:34px; color:color-mix(in srgb,#15A7F0 78%, #fff); }
  .xhsSct-zlab.is-down{ bottom:24px; right:30px; color:color-mix(in srgb,#FFC700 80%, #fff); }

  .xhsSct-bub{ position:absolute; transform:translate(-50%, 50%);
    transition:opacity .3s ease, filter .3s ease; }
  .xhsSct-disc{ display:block; width:var(--d); height:var(--d); border-radius:50%;
    background:radial-gradient(circle at 36% 30%, color-mix(in srgb, var(--c) 92%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 70%, #000) 100%);
    border:2px solid color-mix(in srgb, var(--c) 75%, #fff);
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 50%, transparent), inset 0 3px 8px rgba(255,255,255,.4); }
  .xhsSct-blab{ position:absolute; left:50%; bottom:calc(100% - 2px); transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:1px; white-space:nowrap; }
  .xhsSct-bn{ font-size:21px; font-weight:800; color:#fff; line-height:1; text-shadow:0 2px 8px rgba(0,0,0,.7); }
  .xhsSct-bm{ font-family:"Space Mono",monospace; font-size:14px; font-weight:700; color:var(--c); text-shadow:0 2px 6px rgba(0,0,0,.8); }
  .xhsSct-bub.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSct-bub.is-hot .xhsSct-disc{ transform:scale(1.12); border-color:#fff;
    box-shadow:0 0 48px color-mix(in srgb, var(--c) 70%, transparent), inset 0 3px 10px rgba(255,255,255,.5); }
  .xhsSct-bub.is-hot .xhsSct-bn{ color:var(--c); }

  .xhsSct-axY{ position:absolute; top:-2px; left:14px; transform-origin:left top; font-family:"Space Mono",monospace;
    font-size:16px; letter-spacing:.06em; color:#7a7a7a; }
  .xhsSct-axX{ position:absolute; right:6px; bottom:-30px; font-family:"Space Mono",monospace;
    font-size:16px; letter-spacing:.06em; color:#7a7a7a; }

  /* —— 横向柱（fallback：按估值排序展示） —— */
  .xhsSct-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:18px; margin:6px 0 28px; }
  .xhsSct-brow{ display:grid; grid-template-columns:230px 1fr 170px; align-items:center; gap:24px;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsSct-brow.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSct-brow.is-hot{ transform:translateX(8px); }
  .xhsSct-bname{ display:flex; align-items:center; gap:13px; font-size:27px; font-weight:800; color:#eee; }
  .xhsSct-dot{ width:14px; height:14px; border-radius:50%; background:var(--c); box-shadow:0 0 12px color-mix(in srgb,var(--c) 60%, transparent); flex:0 0 auto; }
  .xhsSct-btrack{ height:46px; border-radius:12px; background:rgba(255,255,255,.05); overflow:hidden; }
  .xhsSct-bfill{ height:100%; border-radius:12px; display:flex; align-items:center; justify-content:flex-end; padding-right:18px;
    background:linear-gradient(90deg, color-mix(in srgb,var(--c) 55%, #000), var(--c));
    box-shadow:0 0 26px color-mix(in srgb,var(--c) 36%, transparent), inset 0 2px 0 rgba(255,255,255,.4); }
  .xhsSct-brow.is-hot .xhsSct-bfill{ box-shadow:0 0 44px color-mix(in srgb,var(--c) 52%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsSct-bval{ font-family:"Space Mono",monospace; font-size:28px; font-weight:700; color:#06140f; }
  .xhsSct-bval i{ font-style:normal; font-size:17px; margin-left:3px; }
  .xhsSct-braise{ font-family:"Space Mono",monospace; font-size:20px; font-weight:700; color:#9a9a9a; text-align:right; }

  .xhsSct-foot{ flex:0 0 auto; display:flex; align-items:center; gap:18px; }
  .xhsSct-foot-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:16px; letter-spacing:.08em; color:#06140f;
    background:#15A7F0; padding:5px 14px; border-radius:8px; box-shadow:0 0 22px rgba(21,167,240,.4); }
  .xhsSct-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; }
`;

const META = {
  id: 'scatter',
  label: '估值散点',
  Component: Slide63Scatter,
  defaults: {
      copy: SLIDE63SCATTER_COPY,
      ptsData: XHSSCT_PTS,
    ...hlDefaults,
    itemCount: 6,
    chartVariant: 'scatter',
    focusEnabled: true,
    focusIndex: 1,
    showZones: true,
    showAxisLabels: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }], default: SLIDE63SCATTER_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'ptsData', type: 'list', label: 'ptsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "raise", label: "raise" }, { key: "val", label: "val" }, { key: "heat", label: "heat" }, { key: "color", label: "color" }, { key: "note", label: "note" }], default: XHSSCT_PTS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '公司气泡数', min: 3, max: 6, step: 1, default: 6, desc: '展示的公司气泡数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['scatter', 'bars'], optionLabels: ['散点', '柱状'], default: 'scatter', desc: '气泡散点 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一公司' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮公司的序号' },
    { key: 'showZones', type: 'toggle', label: '对角分区', default: true, showIf: (v) => v.chartVariant === 'scatter', desc: '背景估值兑现 / 跑前淡色块' },
    { key: 'showAxisLabels', type: 'toggle', label: '坐标轴文字', default: true, showIf: (v) => v.chartVariant === 'scatter', desc: '横纵坐标轴文字' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide63Scatter.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide63Scatter;
