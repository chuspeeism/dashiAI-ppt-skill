/*
 * Slide49Matrix — 能力对照矩阵（表格页 · 评级点矩阵 Capability Matrix）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsMx- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Scoreboard（柱条+评级）/ QuarterTable（季度数值）互补：公司(行) × 能力维度(列)
 * 的「评级点矩阵」——每格一枚发光评级点（领先 ✓ / 具备 ● / 偏弱 –），一眼看清谁强在哪。
 * 数据为调研整理（报告 2 横纵分析法 · 能力画像，示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  rowCount        number 展示的公司行数(3–4)   默认 4
 *  colCount        number 展示的能力维度列数(3–5) 默认 5
 *  focusEnabled    bool   重点行高亮开关         默认 true
 *  focusIndex      number 重点行序号(从1起)     默认 1   范围 1–rowCount
 *  showRowMeta     bool   公司下方赛道副标显隐    默认 true
 *  showLegend      bool   底部评级图例显隐       默认 true
 *  showColScore    bool   列尾综合分行显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide49Matrix, { defaults, controls } from './Slide49Matrix.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 能力维度（列，写死）
const XHSMX_DIMS = [
  { zh: '通用大模型', en: 'MODEL' },
  { zh: '算力自有', en: 'COMPUTE' },
  { zh: '商业兑现', en: 'REVENUE' },
  { zh: '安全治理', en: 'SAFETY' },
  { zh: '生态分发', en: 'ECOSYSTEM' },
];

// 公司（行，写死）：名称 / 赛道 / 主色 / 各维度评级(3 领先 / 2 具备 / 1 偏弱)
const XHSMX_ROWS = [
  { name: 'OpenAI', cat: '通用大模型 · 应用', color: '#27E021', s: [3, 2, 3, 2, 3] },
  { name: 'Anthropic', cat: '通用大模型 · 安全', color: '#15A7F0', s: [3, 2, 2, 3, 2] },
  { name: 'Google DeepMind', cat: '大模型 · 全栈', color: '#FFC700', s: [3, 3, 2, 3, 3] },
  { name: 'xAI', cat: '通用大模型 · 算力', color: '#FF9FE2', s: [2, 3, 1, 1, 3] },
];

const XHSMX_LV = {
  3: { color: '#27E021', glyph: '✓', tag: '领先' },
  2: { color: '#FFC700', glyph: '●', tag: '具备' },
  1: { color: '#5f5f5f', glyph: '–', tag: '偏弱' },
};

function MxSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE49MATRIX_COPY = {
  text001: "能力画像 · CAPABILITY MATRIX",
  text002: "同样是头部，",
  text003: "强项各不同",
  text004: "公司 \\ 维度",
  text005: "综合强度",
  text006: "横纵分析法 · 能力画像（报告 2，评级为调研整理 / 示意）",
};
function Slide49Matrix(props) {
  const {
      copy = SLIDE49MATRIX_COPY,
      dimsData = XHSMX_DIMS,
      rowsData = XHSMX_ROWS,
      lvData = XHSMX_LV,
    rowCount = 4,
    colCount = 5,
    focusEnabled = true,
    focusIndex = 1,
    showRowMeta = true,
    showLegend = true,
    showColScore = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const nr = Math.max(3, Math.min(4, rowCount));
  const nc = Math.max(3, Math.min(5, colCount));
  const dims = dimsData.slice(0, nc);
  const rows = rowsData.slice(0, nr);
  const focus = Math.max(1, Math.min(nr, focusIndex)) - 1;

  const gridCols = `300px repeat(${nc}, 1fr)`;
  const sumOf = (s) => s.slice(0, nc).reduce((a, b) => a + b, 0);

  return (
    <section className="xhs-base xhsMx-root" data-label="能力对照矩阵" data-screen-label="能力对照矩阵">
      <style>{XHSMX_CSS}</style>

      <header className="xhsMx-head">
        <div className="xhsMx-kicker">{copy.text001}</div>
        <h2 className="xhsMx-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsMx-table">
        <div className="xhsMx-row xhsMx-row--head" style={{ gridTemplateColumns: gridCols }}>
          <div className="xhsMx-cell xhsMx-cell--corner">{copy.text004}</div>
          {dims.map((d, i) => (
            <div key={i} className="xhsMx-cell xhsMx-colhead">
              <span className="xhsMx-colzh">{d.zh}</span>
              <span className="xhsMx-colen">{d.en}</span>
            </div>
          ))}
        </div>

        {rows.map((r, ri) => {
          const hot = focusEnabled && ri === focus;
          const dim = focusEnabled && ri !== focus;
          return (
            <div key={ri} className={'xhsMx-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ gridTemplateColumns: gridCols, '--c': r.color }}>
              <div className="xhsMx-cell xhsMx-namecell">
                <span className="xhsMx-rdot"></span>
                <span className="xhsMx-nametxt">
                  <span className="xhsMx-rname">{r.name}</span>
                  {showRowMeta && <span className="xhsMx-rcat">{r.cat}</span>}
                </span>
              </div>
              {r.s.slice(0, nc).map((lv, ci) => {
                const L = lvData[lv];
                return (
                  <div key={ci} className="xhsMx-cell xhsMx-datacell">
                    <span className={'xhsMx-pip xhsMx-pip--' + lv} style={{ '--p': L.color }}>{L.glyph}</span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {showColScore && (
          <div className="xhsMx-row xhsMx-row--score" style={{ gridTemplateColumns: gridCols }}>
            <div className="xhsMx-cell xhsMx-scorehead">{copy.text005}</div>
            {dims.map((d, ci) => {
              const colSum = rows.reduce((a, r) => a + (r.s[ci] || 0), 0);
              const colMax = rows.length * 3;
              return (
                <div key={ci} className="xhsMx-cell xhsMx-scorecell">
                  <span className="xhsMx-scorebar"><span style={{ width: (colSum / colMax) * 100 + '%' }}></span></span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showLegend && (
        <footer className="xhsMx-foot">
          <div className="xhsMx-legend">
            {[3, 2, 1].map((lv) => (
              <span key={lv} className="xhsMx-leg">
                <span className={'xhsMx-pip xhsMx-pip--' + lv} style={{ '--p': lvData[lv].color }}>{lvData[lv].glyph}</span>
                {lvData[lv].tag}
              </span>
            ))}
          </div>
          <span className="xhsMx-foot-txt">{copy.text006}</span>
        </footer>
      )}

      {showDecorations && (
        <React.Fragment>
          <MxSpark size={24} color="#27E021" style={{ position: 'absolute', right: 92, top: 150 }} />
          <MxSpark size={15} color="#FF9FE2" style={{ position: 'absolute', left: 82, bottom: 108 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSMX_CSS = `
  .xhsMx-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsMx-head{ flex:0 0 auto; margin-bottom:22px; }
  .xhsMx-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsMx-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsMx-table{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; gap:14px; justify-content:center; }
  .xhsMx-row{ display:grid; align-items:stretch; gap:18px; transition:opacity .3s ease, filter .3s ease; }

  .xhsMx-row--head{ align-items:end; padding-bottom:6px; }
  .xhsMx-cell{ display:flex; align-items:center; }
  .xhsMx-cell--corner{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6f6f6f; }
  .xhsMx-colhead{ flex-direction:column; align-items:center; justify-content:flex-end; gap:3px; text-align:center; }
  .xhsMx-colzh{ font-size:22px; font-weight:800; color:#eaeaea; line-height:1.1; }
  .xhsMx-colen{ font-family:"Space Mono",monospace; font-size:12px; letter-spacing:.1em; color:#6f6f6f; }

  .xhsMx-row:not(.xhsMx-row--head):not(.xhsMx-row--score){ border-radius:18px; padding:18px 18px;
    border:1.5px solid rgba(255,255,255,.07); background:linear-gradient(160deg,#141414,#0b0b0b); position:relative; }
  .xhsMx-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsMx-row.is-hot{ border-color:var(--c); background:
      radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--c) 14%, transparent), transparent 56%),
      linear-gradient(160deg,#171717,#0c0c0c);
    box-shadow:0 0 50px color-mix(in srgb, var(--c) 22%, transparent); z-index:2; }

  .xhsMx-namecell{ gap:16px; }
  .xhsMx-rdot{ flex-shrink:0; width:14px; height:14px; border-radius:50%; background:var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 70%, transparent); }
  .xhsMx-nametxt{ display:flex; flex-direction:column; gap:3px; min-width:0; }
  .xhsMx-rname{ font-size:27px; font-weight:900; color:#fff; line-height:1.1; }
  .xhsMx-row.is-hot .xhsMx-rname{ color:var(--c); }
  .xhsMx-rcat{ font-family:"Space Mono",monospace; font-size:14px; letter-spacing:.04em; color:#7c7c7c; }

  .xhsMx-datacell{ justify-content:center; }
  .xhsMx-pip{ width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-size:24px; font-weight:900; line-height:1; }
  .xhsMx-pip--3{ color:#06140f; background:radial-gradient(circle at 38% 30%, color-mix(in srgb, var(--p) 75%, #fff), var(--p) 72%);
    box-shadow:0 0 24px color-mix(in srgb, var(--p) 55%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsMx-pip--2{ color:var(--p); background:color-mix(in srgb, var(--p) 14%, #101010);
    border:2px solid color-mix(in srgb, var(--p) 64%, transparent); font-size:18px;
    box-shadow:0 0 16px color-mix(in srgb, var(--p) 24%, transparent); }
  .xhsMx-pip--1{ color:var(--p); background:#121212; border:2px solid rgba(255,255,255,.1); font-size:26px; }

  .xhsMx-row--score{ align-items:center; padding-top:4px; }
  .xhsMx-scorehead{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6f6f6f; padding-left:30px; }
  .xhsMx-scorecell{ justify-content:center; padding:0 10px; }
  .xhsMx-scorebar{ width:100%; height:8px; border-radius:5px; background:rgba(255,255,255,.07); overflow:hidden; display:block; }
  .xhsMx-scorebar > span{ display:block; height:100%; border-radius:5px;
    background:linear-gradient(90deg,#15A7F0,#27E021); box-shadow:0 0 14px rgba(39,224,33,.4); }

  /* ── 页脚 / 图例 ── */
  .xhsMx-foot{ flex:0 0 auto; margin-top:22px; display:flex; align-items:center; gap:30px; }
  .xhsMx-legend{ display:flex; align-items:center; gap:26px; }
  .xhsMx-leg{ display:flex; align-items:center; gap:11px; font-size:19px; font-weight:700; color:#cfcfcf; }
  .xhsMx-leg .xhsMx-pip{ width:32px; height:32px; font-size:16px; }
  .xhsMx-leg .xhsMx-pip--1{ font-size:18px; }
  .xhsMx-foot-txt{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.03em; color:#6a6a6a; margin-left:auto; }
`;

const META = {
  id: 'matrix',
  label: '能力对照矩阵',
  Component: Slide49Matrix,
  defaults: {
      copy: SLIDE49MATRIX_COPY,
      dimsData: XHSMX_DIMS,
      rowsData: XHSMX_ROWS,
      lvData: XHSMX_LV,
    ...hlDefaults,
    rowCount: 4,
    colCount: 5,
    focusEnabled: true,
    focusIndex: 1,
    showRowMeta: true,
    showLegend: true,
    showColScore: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }], default: SLIDE49MATRIX_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'dimsData', type: 'list', label: 'dimsData', itemLabel: '数据', fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }], default: XHSMX_DIMS, desc: '默认数据内容' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "cat", label: "cat" }, { key: "color", label: "color" }], default: XHSMX_ROWS, desc: '默认数据内容' },
    { key: 'lvData', type: 'list', label: 'lvData', itemLabel: '数据', single: true, default: XHSMX_LV, desc: '默认数据内容' },
    ...hlControls,
    { key: 'rowCount', type: 'slider', label: '公司行数', min: 3, max: 4, step: 1, default: 4, desc: '展示的公司行数' },
    { key: 'colCount', type: 'slider', label: '维度列数', min: 3, max: 5, step: 1, default: 5, desc: '展示的能力维度列数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'rowCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showRowMeta', type: 'toggle', label: '赛道副标', default: true, desc: '公司下方赛道副标显隐' },
    { key: 'showLegend', type: 'toggle', label: '评级图例', default: true, desc: '底部评级图例显隐' },
    { key: 'showColScore', type: 'toggle', label: '综合强度行', default: true, desc: '列尾综合强度行显隐' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide49Matrix.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide49Matrix;
