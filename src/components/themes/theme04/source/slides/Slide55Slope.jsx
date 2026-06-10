/*
 * Slide55Slope — 赛道热度排名变迁（图表页 · 斜率图 / slope chart，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSl- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与折线 / 柱状 / 面积等趋势图互补：本页是「两期排名对照」——左 H1、右 H2，
 * 同一赛道两端用斜线相连，上行(▲) / 下行(▼) / 持平(=) 一眼可读「谁在逆势上位」。
 * 数据为调研整理与推演（报告 3.x 赛道资本关注度排名 · 示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount       number 展示的赛道条数(3–6)     默认 6
 *  chartVariant    enum   图表类型                默认 'slope' 可选 'slope'|'bars'
 *  focusEnabled    bool   重点赛道高亮开关          默认 true
 *  focusIndex      number 重点赛道序号(从1起)      默认 1   范围 1–itemCount
 *  showDelta       bool   升降徽标(▲n/▼n/=)显隐    默认 true
 *  showRankNum     bool   两端名次数字显隐          默认 true
 *  showDecorations bool   星芒等点缀显隐           默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide55Slope, { defaults, controls } from './Slide55Slope.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 赛道两期排名（写死）：h1 = 上半年名次 / h2 = 下半年名次（1 = 最热）· 主色循环品牌四色
const XHSSL_ROWS = [
  { name: 'AI 算力 / 基础设施', short: '算力·基建', h1: 4, h2: 1, color: '#15A7F0' },
  { name: '通用大模型', short: '通用大模型', h1: 1, h2: 2, color: '#27E021' },
  { name: '企业级 AI 应用', short: '企业应用', h1: 2, h2: 3, color: '#FFC700' },
  { name: '具身智能 / 机器人', short: '具身智能', h1: 6, h2: 4, color: '#FF9FE2' },
  { name: 'AI 安全 / 对齐', short: '安全·对齐', h1: 5, h2: 5, color: '#27E021' },
  { name: 'AIGC 内容生成', short: '内容生成', h1: 3, h2: 6, color: '#FFC700' },
];

function SlSpark({ size = 22, color = '#fff', style }) {
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

function deltaOf(h1, h2) {
  const d = h1 - h2; // 正 = 名次上升
  if (d > 0) return { dir: 'up', n: d, sym: '▲', col: '#27E021' };
  if (d < 0) return { dir: 'down', n: -d, sym: '▼', col: '#FF9FE2' };
  return { dir: 'flat', n: 0, sym: '=', col: '#8a8a8a' };
}


const SLIDE55SLOPE_COPY = {
  text001: "半年风向 · RANK SHIFT",
  text002: "半年之间，谁在",
  text003: "逆势上位",
  text004: "2024 上半年",
  text005: "2024 下半年",
  text006: "#",
  text007: "#",
  text008: "数据为调研整理与推演 · 名次＝该赛道半年内 ≥1 亿美元 AI 轮次的资本关注度排名（1＝最热 · 示意）",
};
function Slide55Slope(props) {
  const {
      copy = SLIDE55SLOPE_COPY,
      rowsData = XHSSL_ROWS,
    itemCount = 6,
    chartVariant = 'slope',
    focusEnabled = true,
    focusIndex = 1,
    showDelta = true,
    showRankNum = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(3, Math.min(6, itemCount));
  const rows = rowsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const maxRank = rowsData.length; // 名次刻度固定为 6 档，切片后仍稳定

  // SVG 几何：viewBox 加宽至接近版心比例，两列拉开、占满横向空间
  const VB_W = 1400, VB_H = 560;
  const xL = 200, xR = 940;
  const yTop = 96, yBot = 512;
  const yOf = (rank) => yTop + ((rank - 1) / (maxRank - 1)) * (yBot - yTop);

  const isSlope = chartVariant === 'slope';

  return (
    <section className="xhs-base xhsSl-root" data-label="排名变迁" data-screen-label="排名变迁">
      <style>{XHSSL_CSS}</style>

      <header className="xhsSl-head">
        <div className="xhsSl-kicker">{copy.text001}</div>
        <h2 className="xhsSl-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      {isSlope ? (
        <div className="xhsSl-stage">
          <svg className="xhsSl-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid meet">
            {/* 两期列头 */}
            <text x={xL} y={28} className="xhsSl-colHd" textAnchor="middle">{copy.text004}</text>
            <text x={xR} y={28} className="xhsSl-colHd" textAnchor="middle">{copy.text005}</text>
            {/* 名次刻度参考虚线 */}
            {Array.from({ length: maxRank }).map((_, i) => (
              <line key={'g' + i} x1={xL} x2={xR} y1={yOf(i + 1)} y2={yOf(i + 1)} className="xhsSl-grid" />
            ))}
            {/* 斜线 + 端点 */}
            {rows.map((r, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              const y1 = yOf(r.h1), y2 = yOf(r.h2);
              const cls = 'xhsSl-line' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '');
              return (
                <g key={i} className={cls} style={{ '--c': r.color }}>
                  <line x1={xL} y1={y1} x2={xR} y2={y2} className="xhsSl-conn" />
                  <circle cx={xL} cy={y1} r="9" className="xhsSl-dot" />
                  <circle cx={xR} cy={y2} r="11" className="xhsSl-dot xhsSl-dot--end" />
                  {showRankNum && (
                    <text x={xL - 30} y={y1 + 8} className="xhsSl-rk" textAnchor="end">{r.h1}</text>
                  )}
                  <text x={xR + 30} y={y2 + 9} className="xhsSl-lab">{r.short}</text>
                  {showRankNum && (
                    <text x={xR + 30} y={y2 - 17} className="xhsSl-rkEnd">{copy.text006}{r.h2}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <div className="xhsSl-bars">
          {rows.slice().sort((a, b) => a.h2 - b.h2).map((r, i) => {
            const idx = rows.indexOf(r);
            const hot = focusEnabled && idx === focus;
            const dim = focusEnabled && idx !== focus;
            const d = deltaOf(r.h1, r.h2);
            const w = ((maxRank - r.h2 + 1) / maxRank) * 100;
            return (
              <div key={i} className={'xhsSl-bar' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': r.color }}>
                <span className="xhsSl-barRk">{copy.text007}{r.h2}</span>
                <span className="xhsSl-barName">{r.name}</span>
                <span className="xhsSl-track"><span className="xhsSl-fill" style={{ width: w + '%' }} /></span>
                {showDelta && (
                  <span className={'xhsSl-pill xhsSl-pill--' + d.dir} style={{ '--d': d.col }}>
                    {d.sym}{d.n > 0 ? d.n : ''}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 升降图例 + 焦点徽标（slope 模式底栏） */}
      {isSlope && (
        <div className="xhsSl-legend">
          {showDelta && rows.map((r, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const d = deltaOf(r.h1, r.h2);
            return (
              <span key={i} className={'xhsSl-chip' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': r.color, '--d': d.col }}>
                <i className="xhsSl-chipDot" />
                {r.short}
                <b className={'xhsSl-chipDelta xhsSl-pill--' + d.dir}>{d.sym}{d.n > 0 ? d.n : ''}</b>
              </span>
            );
          })}
        </div>
      )}

      <div className="xhsSl-caption">{copy.text008}</div>

      {showDecorations && (
        <React.Fragment>
          <SlSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <SlSpark size={16} color="#15A7F0" style={{ position: 'absolute', left: 80, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSL_CSS = `
  .xhsSl-root{ padding:74px 110px 52px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsSl-head{ flex:0 0 auto; margin-bottom:14px; }
  .xhsSl-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsSl-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsSl-stage{ flex:1 1 auto; min-height:0; display:flex; align-items:center; justify-content:center; }
  .xhsSl-svg{ width:100%; height:100%; overflow:visible; }

  .xhsSl-colHd{ font-family:"Space Mono",monospace; font-size:23px; font-weight:700; letter-spacing:.04em; fill:#9a9a9a; }
  .xhsSl-grid{ stroke:rgba(255,255,255,.07); stroke-width:1.5; stroke-dasharray:3 9; }

  .xhsSl-line{ transition:opacity .3s ease, filter .3s ease; }
  .xhsSl-line.is-dim{ opacity:.42; filter:saturate(.7); }
  .xhsSl-conn{ stroke:var(--c); stroke-width:6; stroke-linecap:round; fill:none;
    filter:drop-shadow(0 0 8px color-mix(in srgb, var(--c) 45%, transparent)); }
  .xhsSl-line.is-hot .xhsSl-conn{ stroke-width:9;
    filter:drop-shadow(0 0 16px color-mix(in srgb, var(--c) 75%, transparent)); }
  .xhsSl-dot{ fill:var(--c); stroke:#000; stroke-width:3;
    filter:drop-shadow(0 0 8px color-mix(in srgb, var(--c) 55%, transparent)); }
  .xhsSl-line.is-hot .xhsSl-dot{ transform-box:fill-box; transform-origin:center; transform:scale(1.18);
    filter:drop-shadow(0 0 16px color-mix(in srgb, var(--c) 80%, transparent)); }
  .xhsSl-rk{ font-family:"Space Mono",monospace; font-size:26px; font-weight:700; fill:#cfcfcf; }
  .xhsSl-line.is-hot .xhsSl-rk{ fill:#fff; }
  .xhsSl-rkEnd{ font-family:"Space Mono",monospace; font-size:21px; font-weight:700; fill:var(--c); }
  .xhsSl-lab{ font-size:27px; font-weight:800; fill:#eaeaea; }
  .xhsSl-line.is-hot .xhsSl-lab{ fill:#fff; }

  /* —— bars 备用模式 —— */
  .xhsSl-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:16px; }
  .xhsSl-bar{ display:grid; grid-template-columns:78px 360px 1fr auto; align-items:center; gap:26px;
    padding:14px 28px; border-radius:18px; background:linear-gradient(120deg,#151515,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.07); transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s; }
  .xhsSl-bar.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSl-bar.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsSl-barRk{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:var(--c); }
  .xhsSl-barName{ font-size:30px; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsSl-track{ height:18px; border-radius:999px; background:#1a1a1a; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsSl-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35); }

  /* —— 升降徽标 —— */
  .xhsSl-pill{ display:inline-flex; align-items:center; justify-content:center; min-width:60px; font-family:"Space Mono",monospace;
    font-size:22px; font-weight:700; padding:6px 14px; border-radius:999px; white-space:nowrap; }
  .xhsSl-pill--up{ color:#06140f; background:#27E021; box-shadow:0 0 18px rgba(39,224,33,.4), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsSl-pill--down{ color:#1a0713; background:#FF9FE2; box-shadow:0 0 18px rgba(255,159,226,.4), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsSl-pill--flat{ color:#9a9a9a; background:#1c1c1c; border:1.5px solid rgba(255,255,255,.12); }

  /* —— slope 底栏图例 —— */
  .xhsSl-legend{ flex:0 0 auto; display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:8px; }
  .xhsSl-chip{ display:inline-flex; align-items:center; gap:10px; font-size:21px; font-weight:700; color:#d2d2d2;
    padding:8px 16px; border-radius:999px; background:#101010; border:1.5px solid rgba(255,255,255,.08);
    transition:opacity .3s, filter .3s, border-color .3s; }
  .xhsSl-chip.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSl-chip.is-hot{ border-color:var(--c); color:#fff; box-shadow:0 0 26px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsSl-chipDot{ width:13px; height:13px; border-radius:50%; background:var(--c); box-shadow:0 0 10px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsSl-chipDelta{ font-family:"Space Mono",monospace; font-size:17px; font-weight:700; padding:2px 9px; border-radius:999px; }
  .xhsSl-chipDelta.xhsSl-pill--up{ color:#06140f; background:#27E021; }
  .xhsSl-chipDelta.xhsSl-pill--down{ color:#1a0713; background:#FF9FE2; }
  .xhsSl-chipDelta.xhsSl-pill--flat{ color:#9a9a9a; background:#1c1c1c; }

  .xhsSl-caption{ flex:0 0 auto; margin-top:18px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'slope',
  label: '排名变迁',
  Component: Slide55Slope,
  defaults: {
      copy: SLIDE55SLOPE_COPY,
      rowsData: XHSSL_ROWS,
    ...hlDefaults,
    itemCount: 6,
    chartVariant: 'slope',
    focusEnabled: true,
    focusIndex: 1,
    showDelta: true,
    showRankNum: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }], default: SLIDE55SLOPE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "short", label: "short" }, { key: "h1", label: "h1" }, { key: "h2", label: "h2" }, { key: "color", label: "color" }], default: XHSSL_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '赛道条数', min: 3, max: 6, step: 1, default: 6, desc: '展示的赛道数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['slope', 'bars'], optionLabels: ['斜率图', '横向柱'], default: 'slope', desc: '斜率图 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一赛道' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮赛道的序号' },
    { key: 'showDelta', type: 'toggle', label: '升降徽标', default: true, desc: '▲n / ▼n / = 升降标记' },
    { key: 'showRankNum', type: 'toggle', label: '名次数字', default: true, desc: '两端名次数字', showIf: (v) => v.chartVariant === 'slope' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide55Slope.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide55Slope;
