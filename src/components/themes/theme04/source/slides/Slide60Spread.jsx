/*
 * Slide60Spread — 资金消长对照表（表格页 · 两期 H1/H2 + Δ 趋势，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSpd- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 QuarterTable（季度×指标）/ Scoreboard（公司）/ Ledger（出资方）互补：
 * 本表以「赛道为行 × 两期为列」，专看「上半年→下半年」的资本消长——
 * 每行含上半年额、下半年额、Δ 升降徽标，及上/下半年并置 mini 双柱直读冷热反转。
 * 数据为调研整理与推演（报告 3.x 赛道半年资本额 · 示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  rowCount        number 展示的赛道行数(3–6)    默认 6
 *  focusEnabled    bool   重点行高亮开关          默认 true
 *  focusIndex      number 重点行序号(从1起)      默认 1   范围 1–rowCount
 *  showDelta       bool   Δ 升降徽标列显隐         默认 true
 *  showMiniBar     bool   H1/H2 并置双柱列显隐     默认 true
 *  showTotalRow    bool   底部合计行显隐          默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide60Spread, { defaults, controls } from './Slide60Spread.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 各赛道上/下半年资本额(亿美元，示意) · 品牌四色循环
const XHSSPD_ROWS = [
  { name: 'AI 算力 / 基础设施', short: '算力·基建', h1: 120, h2: 210, color: '#15A7F0' },
  { name: '具身智能 / 机器人', short: '具身智能', h1: 24, h2: 58, color: '#FF9FE2' },
  { name: '企业级 AI 应用', short: '企业应用', h1: 60, h2: 88, color: '#FFC700' },
  { name: '通用大模型', short: '通用大模型', h1: 110, h2: 140, color: '#27E021' },
  { name: 'AI 安全 / 对齐', short: '安全·对齐', h1: 16, h2: 28, color: '#15A7F0' },
  { name: 'AIGC 内容生成', short: '内容生成', h1: 38, h2: 34, color: '#FFC700' },
];

function deltaOf(h1, h2) {
  const pct = Math.round(((h2 - h1) / h1) * 100);
  if (pct > 0) return { dir: 'up', sym: '▲', txt: '+' + pct + '%', col: '#27E021' };
  if (pct < 0) return { dir: 'down', sym: '▼', txt: pct + '%', col: '#FF9FE2' };
  return { dir: 'flat', sym: '=', txt: '0%', col: '#8a8a8a' };
}

function SpdSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE60SPREAD_COPY = {
  text001: "亿",
  text002: "亿",
  text003: "上",
  text004: "下",
  text005: "半年消长 · H1 → H2 SWING",
  text006: "下半年，资本",
  text007: "集体加码算力",
  text008: "赛道",
  text009: "2024 上半年",
  text010: "2024 下半年",
  text011: "环比 Δ",
  text012: "上 / 下半年对比",
  text013: "全市场合计",
  text014: "亿",
  text015: "亿",
  text016: "数据为调研整理与推演 · 金额＝该赛道半年内 ≥1 亿美元 AI 轮次合计（亿美元 · 示意）· mini 双柱按全表最高额归一",
};
function Slide60Spread(props) {
  const {
      copy = SLIDE60SPREAD_COPY,
      rowsData = XHSSPD_ROWS,
    rowCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    showDelta = true,
    showMiniBar = true,
    showTotalRow = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const rc = Math.max(3, Math.min(6, rowCount));
  const rows = rowsData.slice(0, rc);
  const focus = Math.max(1, Math.min(rc, focusIndex)) - 1;
  const maxVal = Math.max.apply(null, rows.flatMap((r) => [r.h1, r.h2]));
  const tot1 = rows.reduce((s, r) => s + r.h1, 0);
  const tot2 = rows.reduce((s, r) => s + r.h2, 0);
  const totDelta = deltaOf(tot1, tot2);

  // 列模板：赛道 · 上半年 · 下半年 · [Δ] · [mini双柱]
  const gridCols = ['2fr', '0.74fr', '0.74fr', showDelta ? '0.82fr' : null, showMiniBar ? '1.02fr' : null]
    .filter(Boolean).join(' ');

  const Cell = ({ r }) => {
    const d = deltaOf(r.h1, r.h2);
    const w1 = Math.max(7, (r.h1 / maxVal) * 100);
    const w2 = Math.max(7, (r.h2 / maxVal) * 100);
    return (
      <React.Fragment>
        <div className="xhsSpd-c xhsSpd-c--name">
          <i className="xhsSpd-dot" />
          <span className="xhsSpd-nm">{r.name}</span>
        </div>
        <div className="xhsSpd-c xhsSpd-c--num"><span className="xhsSpd-v xhsSpd-v--past">{r.h1}<i>{copy.text001}</i></span></div>
        <div className="xhsSpd-c xhsSpd-c--num"><span className="xhsSpd-v xhsSpd-v--now">{r.h2}<i>{copy.text002}</i></span></div>
        {showDelta && (
          <div className="xhsSpd-c xhsSpd-c--delta">
            <span className={'xhsSpd-pill xhsSpd-pill--' + d.dir}>{d.sym} {d.txt}</span>
          </div>
        )}
        {showMiniBar && (
          <div className="xhsSpd-c xhsSpd-c--mini">
            <span className="xhsSpd-mrow"><i className="xhsSpd-mtag">{copy.text003}</i><span className="xhsSpd-mtrack"><span className="xhsSpd-mfill is-past" style={{ width: w1 + '%' }} /></span></span>
            <span className="xhsSpd-mrow"><i className="xhsSpd-mtag">{copy.text004}</i><span className="xhsSpd-mtrack"><span className="xhsSpd-mfill is-now" style={{ width: w2 + '%' }} /></span></span>
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <section className="xhs-base xhsSpd-root" data-label="资金消长" data-screen-label="资金消长">
      <style>{XHSSPD_CSS}</style>

      <header className="xhsSpd-head">
        <div className="xhsSpd-kicker">{copy.text005}</div>
        <h2 className="xhsSpd-title">{copy.text006}<HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{copy.text007}</HL>
        </h2>
      </header>

      <div className="xhsSpd-tableWrap">
        <div className="xhsSpd-table">
          <div className="xhsSpd-row xhsSpd-row--head" style={{ gridTemplateColumns: gridCols }}>
            <div className="xhsSpd-c xhsSpd-c--name">{copy.text008}</div>
            <div className="xhsSpd-c xhsSpd-c--num">{copy.text009}</div>
            <div className="xhsSpd-c xhsSpd-c--num">{copy.text010}</div>
            {showDelta && <div className="xhsSpd-c xhsSpd-c--delta">{copy.text011}</div>}
            {showMiniBar && <div className="xhsSpd-c xhsSpd-c--mini">{copy.text012}</div>}
          </div>

          {rows.map((r, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsSpd-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': r.color, gridTemplateColumns: gridCols }}>
                <Cell r={r} />
              </div>
            );
          })}

          {showTotalRow && (
            <div className="xhsSpd-row xhsSpd-row--total" style={{ gridTemplateColumns: gridCols }}>
              <div className="xhsSpd-c xhsSpd-c--name"><span className="xhsSpd-nm">{copy.text013}</span></div>
              <div className="xhsSpd-c xhsSpd-c--num"><span className="xhsSpd-v xhsSpd-v--past">{tot1}<i>{copy.text014}</i></span></div>
              <div className="xhsSpd-c xhsSpd-c--num"><span className="xhsSpd-v xhsSpd-v--now">{tot2}<i>{copy.text015}</i></span></div>
              {showDelta && (
                <div className="xhsSpd-c xhsSpd-c--delta">
                  <span className={'xhsSpd-pill xhsSpd-pill--' + totDelta.dir}>{totDelta.sym} {totDelta.txt}</span>
                </div>
              )}
              {showMiniBar && <div className="xhsSpd-c xhsSpd-c--mini" />}
            </div>
          )}
        </div>
      </div>

      <div className="xhsSpd-caption">{copy.text016}</div>

      {showDecorations && (
        <React.Fragment>
          <SpdSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <SpdSpark size={16} color="#27E021" style={{ position: 'absolute', left: 80, bottom: 92 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSPD_CSS = `
  .xhsSpd-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsSpd-head{ flex:0 0 auto; margin-bottom:24px; }
  .xhsSpd-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsSpd-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsSpd-tableWrap{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsSpd-table{ width:100%; display:flex; flex-direction:column; gap:11px; }

  .xhsSpd-row{ display:grid; align-items:center; gap:18px;
    padding:14px 30px; border-radius:18px; background:linear-gradient(120deg,#151515,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s; }
  .xhsSpd-row--head{ background:none; border:none; padding:0 30px 2px; }
  .xhsSpd-row--head .xhsSpd-c{ font-family:"Space Mono",monospace; font-size:19px; letter-spacing:.05em; color:#8a8a8a; font-weight:700; }
  .xhsSpd-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSpd-row.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsSpd-row--total{ background:linear-gradient(120deg,#1a1a1a,#0e0e0e); border-color:rgba(255,255,255,.14); margin-top:5px; }

  .xhsSpd-c{ min-width:0; display:flex; align-items:center; }
  .xhsSpd-c--name{ gap:14px; }
  .xhsSpd-c--num{ justify-content:flex-start; }
  .xhsSpd-c--delta{ justify-content:flex-start; }

  .xhsSpd-dot{ width:13px; height:13px; flex:0 0 auto; border-radius:50%; background:var(--c);
    box-shadow:0 0 10px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsSpd-nm{ font-size:28px; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsSpd-row--total .xhsSpd-nm{ color:#eaeaea; }
  .xhsSpd-row.is-hot .xhsSpd-nm{ color:var(--c); }

  .xhsSpd-v{ font-family:"Space Mono",monospace; font-weight:700; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .xhsSpd-v i{ font-style:normal; font-size:.5em; font-weight:600; margin-left:4px; opacity:.7; }
  .xhsSpd-v--past{ font-size:31px; color:#8f8f8f; }
  .xhsSpd-v--now{ font-size:34px; color:#fff; }
  .xhsSpd-row.is-hot .xhsSpd-v--now{ color:var(--c); text-shadow:0 0 18px color-mix(in srgb, var(--c) 38%, transparent); }

  .xhsSpd-pill{ display:inline-flex; align-items:center; justify-content:center; gap:6px; min-width:104px;
    font-family:"Space Mono",monospace; font-size:21px; font-weight:700; padding:7px 16px; border-radius:999px; white-space:nowrap; }
  .xhsSpd-pill--up{ color:#06140f; background:#27E021; box-shadow:0 0 18px rgba(39,224,33,.38), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsSpd-pill--down{ color:#1a0713; background:#FF9FE2; box-shadow:0 0 18px rgba(255,159,226,.38), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsSpd-pill--flat{ color:#9a9a9a; background:#1c1c1c; border:1.5px solid rgba(255,255,255,.12); }

  .xhsSpd-c--mini{ flex-direction:column; align-items:stretch; gap:8px; }
  .xhsSpd-mrow{ display:flex; align-items:center; gap:12px; }
  .xhsSpd-mtag{ font-family:"Space Mono",monospace; font-style:normal; font-size:15px; font-weight:700; color:#7e7e7e; width:18px; flex:0 0 auto; }
  .xhsSpd-mtrack{ flex:1; height:13px; min-width:0; border-radius:999px; background:#1a1a1a; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsSpd-mfill{ display:block; height:100%; border-radius:999px; transition:width .6s cubic-bezier(.2,.8,.2,1); }
  .xhsSpd-mfill.is-past{ background:color-mix(in srgb, var(--c) 42%, #1c1c1c); }
  .xhsSpd-mfill.is-now{ background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 14px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35); }

  .xhsSpd-caption{ flex:0 0 auto; margin-top:20px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'spread',
  label: '资金消长',
  Component: Slide60Spread,
  defaults: {
      copy: SLIDE60SPREAD_COPY,
      rowsData: XHSSPD_ROWS,
    ...hlDefaults,
    rowCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    showDelta: true,
    showMiniBar: true,
    showTotalRow: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }, { key: "text014", label: "text014" }, { key: "text015", label: "text015" }, { key: "text016", label: "text016" }], default: SLIDE60SPREAD_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "short", label: "short" }, { key: "h1", label: "h1" }, { key: "h2", label: "h2" }, { key: "color", label: "color" }], default: XHSSPD_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'rowCount', type: 'slider', label: '赛道行数', min: 3, max: 6, step: 1, default: 6, desc: '展示的赛道行数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点行序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'rowCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showDelta', type: 'toggle', label: '环比徽标', default: true, desc: 'Δ 升降徽标列' },
    { key: 'showMiniBar', type: 'toggle', label: '双柱对比', default: true, desc: '上 / 下半年并置双柱列' },
    { key: 'showTotalRow', type: 'toggle', label: '合计行', default: true, desc: '底部全市场合计行' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide60Spread.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide60Spread;
