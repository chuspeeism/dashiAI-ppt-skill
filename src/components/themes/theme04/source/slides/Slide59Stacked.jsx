/*
 * Slide59Stacked — 季度资本构成（图表页 · 100% 堆叠柱 / stacked bar，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsStk- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与折线 / 面积 / 柱状 / 斜率等趋势图互补：本页是「构成随季度变化」——
 * 每季一根堆叠柱，按赛道切段，一眼读懂「钱往哪个赛道挪」。算力逐季抬升、模型占比回落。
 * 数据为调研整理与推演（报告 3.x 季度赛道资本构成 · 示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  columnCount     number 展示的季度柱数(2–4)      默认 4
 *  chartVariant    enum   堆叠口径                  默认 'ratio' 可选 'ratio'|'absolute'
 *  focusEnabled    bool   重点赛道高亮开关           默认 true
 *  focusIndex      number 重点赛道序号(从1起)       默认 1   范围 1–赛道数(4)
 *  showSegLabel    bool   段内占比/金额标签显隐      默认 true
 *  showLegend      bool   底部赛道图例显隐           默认 true
 *  showDecorations bool   星芒等点缀显隐            默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide59Stacked, { defaults, controls } from './Slide59Stacked.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 赛道（自下而上堆叠顺序：算力垫底 → 其他封顶）· 品牌四色 + 中性
const XHSSTK_TRACKS = [
  { key: 'infra', name: 'AI 算力 / 基础设施', short: '算力·基建', color: '#15A7F0' },
  { key: 'model', name: '通用大模型', short: '通用大模型', color: '#27E021' },
  { key: 'app', name: '企业级 AI 应用', short: '企业应用', color: '#FFC700' },
  { key: 'other', name: '具身 / 内容 / 其他', short: '其他赛道', color: '#FF9FE2' },
];

// 各季度：赛道占比(%) 求和=100 + 季度总额(亿美元，absolute 模式用)
const XHSSTK_COLS = [
  { q: 'Q1', total: 180, parts: { infra: 28, model: 34, app: 22, other: 16 } },
  { q: 'Q2', total: 220, parts: { infra: 33, model: 31, app: 21, other: 15 } },
  { q: 'Q3', total: 260, parts: { infra: 38, model: 28, app: 20, other: 14 } },
  { q: 'Q4', total: 310, parts: { infra: 44, model: 25, app: 19, other: 12 } },
];

function StkSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE59STACKED_COPY = {
  text001: "季度构成 · CAPITAL MIX BY QUARTER",
  text002: "钱往哪挪？",
  text003: "算力逐季抬升",
  text004: "数据为调研整理与推演 ·",
  text005: "· 示意",
};
function Slide59Stacked(props) {
  const {
      copy = SLIDE59STACKED_COPY,
      colsData = XHSSTK_COLS,
      tracksData = XHSSTK_TRACKS,
    columnCount = 4,
    chartVariant = 'ratio',
    focusEnabled = true,
    focusIndex = 1,
    showSegLabel = true,
    showLegend = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const nCols = Math.max(2, Math.min(4, columnCount));
  const cols = colsData.slice(0, nCols);
  const nTracks = tracksData.length;
  const focus = Math.max(1, Math.min(nTracks, focusIndex)) - 1;
  const isRatio = chartVariant === 'ratio';
  const maxTotal = Math.max.apply(null, cols.map((c) => c.total));

  return (
    <section className="xhs-base xhsStk-root" data-label="季度资本构成" data-screen-label="季度资本构成">
      <style>{XHSSTK_CSS}</style>

      <header className="xhsStk-head">
        <div className="xhsStk-kicker">{copy.text001}</div>
        <h2 className="xhsStk-title">{copy.text002}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsStk-stage">
        <div className="xhsStk-axis">
          {(isRatio ? ['100%', '75%', '50%', '25%', '0'] : ['满', '', '', '', '0']).map((t, i) => (
            <span key={i} className="xhsStk-axisT">{t}</span>
          ))}
        </div>

        <div className="xhsStk-bars">
          {cols.map((col, ci) => {
            const barH = isRatio ? 100 : (col.total / maxTotal) * 100;
            return (
              <div key={ci} className="xhsStk-col">
                <div className="xhsStk-barWrap">
                  <div className="xhsStk-bar" style={{ height: barH + '%' }}>
                    {tracksData.slice().reverse().map((tr) => {
                      const trIdx = tracksData.indexOf(tr);
                      const pct = col.parts[tr.key];
                      const hot = focusEnabled && trIdx === focus;
                      const dim = focusEnabled && trIdx !== focus;
                      const amount = Math.round((col.total * pct) / 100);
                      return (
                        <div key={tr.key}
                          className={'xhsStk-seg' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                          style={{ height: pct + '%', '--c': tr.color }}>
                          {showSegLabel && pct >= 13 && (
                            <span className="xhsStk-segLab">
                              {isRatio ? pct + '%' : amount}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="xhsStk-colFoot">
                  <span className="xhsStk-qLab">{col.q}</span>
                  <span className="xhsStk-qSub">{isRatio ? '占比' : col.total + ' 亿'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showLegend && (
        <div className="xhsStk-legend">
          {tracksData.map((tr, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <span key={tr.key} className={'xhsStk-chip' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': tr.color }}>
                <i className="xhsStk-chipDot" />{tr.name}
              </span>
            );
          })}
        </div>
      )}

      <div className="xhsStk-caption">{copy.text004}{isRatio ? '各季按赛道资本占比堆叠（求和 100%）' : '各季按赛道绝对融资额（亿美元）堆叠，柱高即季度总盘子'}{copy.text005}</div>

      {showDecorations && (
        <React.Fragment>
          <StkSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <StkSpark size={16} color="#27E021" style={{ position: 'absolute', left: 80, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSTK_CSS = `
  .xhsStk-root{ padding:74px 110px 52px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsStk-head{ flex:0 0 auto; margin-bottom:18px; }
  .xhsStk-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsStk-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsStk-stage{ flex:1 1 auto; min-height:0; display:flex; gap:26px; padding:6px 0 0; }
  .xhsStk-axis{ flex:0 0 auto; width:58px; display:flex; flex-direction:column; justify-content:space-between; padding:2px 0 58px; text-align:right; }
  .xhsStk-axisT{ font-family:"Space Mono",monospace; font-size:16px; color:#5e5e5e; letter-spacing:.04em; }

  .xhsStk-bars{ flex:1 1 auto; min-width:0; display:flex; align-items:flex-end; gap:clamp(36px,6vw,96px); justify-content:center; }
  .xhsStk-col{ flex:1 1 0; max-width:200px; min-width:0; display:flex; flex-direction:column; height:100%; gap:10px; }
  .xhsStk-barWrap{ flex:1 1 auto; min-height:0; display:flex; align-items:flex-end; }
  .xhsStk-bar{ width:100%; display:flex; flex-direction:column; border-radius:14px 14px 6px 6px; overflow:hidden;
    background:#0b0b0b; box-shadow:0 0 0 1.5px rgba(255,255,255,.06), 0 18px 44px rgba(0,0,0,.5); }

  .xhsStk-seg{ position:relative; display:flex; align-items:center; justify-content:center; min-height:0;
    background:linear-gradient(180deg, color-mix(in srgb, var(--c) 86%, #fff) 0%, var(--c) 44%, color-mix(in srgb, var(--c) 80%, #000) 100%);
    box-shadow:inset 0 1px 0 rgba(255,255,255,.42), inset 0 -1px 0 rgba(0,0,0,.4);
    border-bottom:2px solid #0b0b0b; transition:opacity .3s, filter .3s, box-shadow .3s; }
  .xhsStk-seg:first-child{ border-bottom:none; }
  .xhsStk-seg.is-dim{ opacity:.4; filter:saturate(.62); }
  .xhsStk-seg.is-hot{ box-shadow:inset 0 0 0 2.5px rgba(255,255,255,.7), inset 0 1px 0 rgba(255,255,255,.5),
    0 0 30px color-mix(in srgb, var(--c) 50%, transparent); z-index:2; }
  .xhsStk-segLab{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; color:#06140f;
    text-shadow:0 1px 0 rgba(255,255,255,.45); font-variant-numeric:tabular-nums; }
  .xhsStk-seg.is-dim .xhsStk-segLab{ color:rgba(6,20,15,.7); }

  .xhsStk-colFoot{ flex:0 0 auto; height:48px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:3px; }
  .xhsStk-qLab{ font-family:"Space Mono",monospace; font-size:27px; font-weight:700; color:#fff; }
  .xhsStk-qSub{ font-size:15px; color:#6e6e6e; letter-spacing:.03em; }

  .xhsStk-legend{ flex:0 0 auto; display:flex; flex-wrap:wrap; gap:14px; justify-content:center; margin-top:22px; }
  .xhsStk-chip{ display:inline-flex; align-items:center; gap:11px; font-size:21px; font-weight:700; color:#d2d2d2;
    padding:9px 18px; border-radius:999px; background:#101010; border:1.5px solid rgba(255,255,255,.08);
    transition:opacity .3s, filter .3s, border-color .3s, color .3s; }
  .xhsStk-chip.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsStk-chip.is-hot{ border-color:var(--c); color:#fff; box-shadow:0 0 26px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsStk-chipDot{ width:14px; height:14px; border-radius:50%; background:var(--c); box-shadow:0 0 10px color-mix(in srgb, var(--c) 60%, transparent); }

  .xhsStk-caption{ flex:0 0 auto; margin-top:18px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'stacked',
  label: '季度资本构成',
  Component: Slide59Stacked,
  defaults: {
      copy: SLIDE59STACKED_COPY,
      colsData: XHSSTK_COLS,
      tracksData: XHSSTK_TRACKS,
    ...hlDefaults,
    columnCount: 4,
    chartVariant: 'ratio',
    focusEnabled: true,
    focusIndex: 1,
    showSegLabel: true,
    showLegend: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }], default: SLIDE59STACKED_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'colsData', type: 'list', label: 'colsData', itemLabel: '数据', fields: [{ key: "q", label: "q" }, { key: "total", label: "total" }], default: XHSSTK_COLS, desc: '默认数据内容' },
    { key: 'tracksData', type: 'list', label: 'tracksData', itemLabel: '数据', fields: [{ key: "key", label: "key" }, { key: "name", label: "name" }, { key: "short", label: "short" }, { key: "color", label: "color" }], default: XHSSTK_TRACKS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'columnCount', type: 'slider', label: '季度柱数', min: 2, max: 4, step: 1, default: 4, desc: '展示的季度数量' },
    { key: 'chartVariant', type: 'radio', label: '堆叠口径', options: ['ratio', 'absolute'], optionLabels: ['百分比', '绝对额'], default: 'ratio', desc: '100% 占比 / 绝对额(柱高随总盘)' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一赛道' },
    { key: 'focusIndex', type: 'slider', label: '重点赛道', min: 1, max: 4, step: 1, default: 1, showIf: (v) => v.focusEnabled, desc: '被高亮赛道的序号' },
    { key: 'showSegLabel', type: 'toggle', label: '段内标签', default: true, desc: '段内占比 / 金额标签' },
    { key: 'showLegend', type: 'toggle', label: '赛道图例', default: true, desc: '底部赛道图例' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide59Stacked.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide59Stacked;
