/*
 * Slide39Scoreboard — 头部玩家对照表（表格页 · 估值 / 单笔 / 赛道 / 资本热度 多列对照）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSb- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与已有表格（轮次结构 / 季度走势 / 产业链）互补：以「公司为行、多维度为列」的对照表，
 * 含行内估值规模柱条 + 「资本热度」评级点（dots），数值以单元格标注为准。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  rowCount        number 展示的公司行数        默认 6   可选 3–6
 *  focusEnabled    bool   重点行高亮开关         默认 true
 *  focusIndex      number 重点行序号(从1起)     默认 1   范围 1–rowCount
 *  showBar         bool   估值规模柱条列显隐      默认 true
 *  showRating      bool   资本热度评级点显隐      默认 true
 *  showCategory    bool   赛道标签列显隐         默认 true
 *  showDecorations bool   星芒 / 圆环等点缀      默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide39Scoreboard, { defaults, controls } from './Slide39Scoreboard.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSSB_CAT_COLOR = {
  '通用大模型': '#27E021',
  'AI 基础设施': '#15A7F0',
  'AI 硬件': '#FFC700',
  '垂直应用': '#FF9FE2',
};
// 头部玩家对照（报告 3.x 整理；估值/单笔单位：亿美元；热度 0–5）
const XHSSB_ROWS = [
  { name: 'OpenAI', cat: '通用大模型', val: 1570, single: 66, heat: 5 },
  { name: 'Databricks', cat: 'AI 基础设施', val: 620, single: 100, heat: 5 },
  { name: 'Anthropic', cat: '通用大模型', val: 600, single: 40, heat: 5 },
  { name: 'xAI', cat: '通用大模型', val: 500, single: 60, heat: 4 },
  { name: 'CoreWeave', cat: 'AI 基础设施', val: 190, single: 11, heat: 4 },
  { name: 'Safe Superintelligence', cat: '通用大模型', val: 50, single: 10, heat: 3 },
];

function SbSpark({ size = 22, color = '#fff', style }) {
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

function SbRating({ heat, color }) {
  return (
    <span className="xhsSb-dots" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={'xhsSb-dot' + (i < heat ? ' is-on' : '')}
          style={i < heat ? { background: color, boxShadow: `0 0 12px ${color}99` } : undefined} />
      ))}
    </span>
  );
}


const SLIDE39SCOREBOARD_COPY = {
  text001: "头部对照 · SCOREBOARD",
  text002: "六家头部，",
  text003: "估值与热度一表看清",
  text004: "#",
  text005: "公司",
  text006: "主投赛道",
  text007: "最新估值",
  text008: "亿美元",
  text009: "最大单笔",
  text010: "亿美元",
  text011: "资本热度",
  text012: "数据为调研整理与推演 · 估值柱条按全表最高估值归一 · 资本热度＝该公司 2024 受追捧程度（0–5）",
};
function Slide39Scoreboard(props) {
  const {
      copy = SLIDE39SCOREBOARD_COPY,
      rowsData = XHSSB_ROWS,
    rowCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    showBar = true,
    showRating = true,
    showCategory = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const rc = Math.max(3, Math.min(6, rowCount));
  const rows = rowsData.slice(0, rc);
  const focus = Math.max(1, Math.min(rc, focusIndex)) - 1;
  const maxVal = Math.max.apply(null, rows.map((r) => r.val));

  // 列模板随可选列开关自适应：rank · name · [cat] · val · single · [heat]
  const gridCols = ['72px', '360px', showCategory ? '1fr' : null, '1.5fr', '0.8fr', showRating ? '1fr' : null]
    .filter(Boolean).join(' ');

  return (
    <section className="xhs-base xhsSb-root" data-label="头部玩家对照表" data-screen-label="头部玩家对照表">
      <style>{XHSSB_CSS}</style>

      <header className="xhsSb-head">
        <div className="xhsSb-kicker">{copy.text001}</div>
        <h2 className="xhsSb-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsSb-tableWrap">
        <div className="xhsSb-table">
          <div className="xhsSb-row xhsSb-row--head" style={{ gridTemplateColumns: gridCols }}>
            <div className="xhsSb-c xhsSb-c--rank">{copy.text004}</div>
            <div className="xhsSb-c xhsSb-c--name">{copy.text005}</div>
            {showCategory && <div className="xhsSb-c xhsSb-c--cat">{copy.text006}</div>}
            <div className="xhsSb-c xhsSb-c--val">{copy.text007}<i>{copy.text008}</i></div>
            <div className="xhsSb-c xhsSb-c--single">{copy.text009}<i>{copy.text010}</i></div>
            {showRating && <div className="xhsSb-c xhsSb-c--heat">{copy.text011}</div>}
          </div>

          {rows.map((r, i) => {
            const color = XHSSB_CAT_COLOR[r.cat] || '#27E021';
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const w = Math.max(8, (r.val / maxVal) * 100);
            return (
              <div key={i} className={'xhsSb-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': color, gridTemplateColumns: gridCols }}>
                <div className="xhsSb-c xhsSb-c--rank">
                  <span className={'xhsSb-badge' + (i < 3 ? ' is-top' : '')}>{i + 1}</span>
                </div>
                <div className="xhsSb-c xhsSb-c--name"><span className="xhsSb-name">{r.name}</span></div>
                {showCategory && (
                  <div className="xhsSb-c xhsSb-c--cat">
                    <span className="xhsSb-tag">{r.cat}</span>
                  </div>
                )}
                <div className="xhsSb-c xhsSb-c--val">
                  {showBar && (
                    <span className="xhsSb-track"><span className="xhsSb-fill" style={{ width: w + '%' }} /></span>
                  )}
                  <span className="xhsSb-num">{r.val.toLocaleString()}</span>
                </div>
                <div className="xhsSb-c xhsSb-c--single"><span className="xhsSb-num xhsSb-num--alt">{r.single}</span></div>
                {showRating && (
                  <div className="xhsSb-c xhsSb-c--heat"><SbRating heat={r.heat} color={color} /></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="xhsSb-caption">{copy.text012}</div>

      {showDecorations && (
        <React.Fragment>
          <SbSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <SbSpark size={16} color="#15A7F0" style={{ position: 'absolute', left: 80, bottom: 92 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSB_CSS = `
  .xhsSb-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsSb-head{ flex:0 0 auto; margin-bottom:28px; }
  .xhsSb-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsSb-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsSb-tableWrap{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsSb-table{ width:100%; display:flex; flex-direction:column; gap:12px; }

  .xhsSb-row{ display:grid; align-items:center; gap:24px;
    grid-template-columns:72px 360px 1fr 1.5fr 0.8fr 1fr;
    padding:16px 30px; border-radius:18px; background:linear-gradient(120deg,#151515,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsSb-row--head{ background:none; border:none; padding:0 30px 4px; }
  .xhsSb-row--head .xhsSb-c{ font-family:"Space Mono",monospace; font-size:19px; letter-spacing:.05em; color:#8a8a8a; font-weight:700; }
  .xhsSb-row--head .xhsSb-c i{ font-style:normal; font-size:14px; color:#6a6a6a; margin-left:8px; letter-spacing:.04em; }
  .xhsSb-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsSb-row.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); }

  .xhsSb-c{ min-width:0; display:flex; align-items:center; }
  .xhsSb-c--rank{ justify-content:flex-start; }
  .xhsSb-c--heat{ justify-content:flex-start; }

  .xhsSb-badge{ width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:#cfcfcf; background:#161616; border:2px solid #2a2a2a; }
  .xhsSb-badge.is-top{ color:#06140f; background:var(--c); border:none;
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 16px rgba(255,255,255,.4); }

  .xhsSb-name{ font-size:34px; font-weight:800; color:#fff; line-height:1.05; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsSb-row.is-hot .xhsSb-name{ color:var(--c); }

  .xhsSb-tag{ font-size:19px; font-weight:700; color:var(--c); padding:6px 16px; border-radius:999px;
    background:color-mix(in srgb, var(--c) 14%, #0c0c0c); border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent); white-space:nowrap; }

  .xhsSb-c--val{ gap:18px; }
  .xhsSb-track{ flex:1; height:18px; min-width:0; border-radius:999px; background:#1a1a1a; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsSb-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35);
    transition:width .6s cubic-bezier(.2,.8,.2,1); }
  .xhsSb-num{ font-family:"Space Mono",monospace; font-size:32px; font-weight:700; color:#fff; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .xhsSb-num--alt{ font-size:30px; color:#cfcfcf; }
  .xhsSb-row.is-hot .xhsSb-num{ color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }

  .xhsSb-dots{ display:inline-flex; gap:9px; }
  .xhsSb-dot{ width:18px; height:18px; border-radius:50%; background:#222; border:1.5px solid #333; }

  .xhsSb-caption{ flex:0 0 auto; margin-top:20px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'scoreboard',
  label: '头部玩家对照表',
  Component: Slide39Scoreboard,
  defaults: {
      copy: SLIDE39SCOREBOARD_COPY,
      rowsData: XHSSB_ROWS,
    ...hlDefaults,
    rowCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    showBar: true,
    showRating: true,
    showCategory: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }], default: SLIDE39SCOREBOARD_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "cat", label: "cat" }, { key: "val", label: "val" }, { key: "single", label: "single" }, { key: "heat", label: "heat" }], default: XHSSB_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'rowCount', type: 'slider', label: '公司行数', min: 3, max: 6, step: 1, default: 6, desc: '展示的公司行数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点行序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'rowCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showBar', type: 'toggle', label: '估值柱条', default: true, desc: '行内估值规模柱条' },
    { key: 'showRating', type: 'toggle', label: '资本热度', default: true, desc: '资本热度评级点' },
    { key: 'showCategory', type: 'toggle', label: '赛道标签', default: true, desc: '主投赛道标签列' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide39Scoreboard.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide39Scoreboard;
