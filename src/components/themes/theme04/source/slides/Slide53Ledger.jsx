/*
 * Slide53Ledger — 活跃投资人出手榜（表格页 · 领投方 / 出手次数 / 代表押注 对照）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsLg- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Scoreboard（以公司为行）互补：本表「以出资方为行」，看谁在 2024 AI 大额轮里最活跃——
 * 含行内出手次数柱条 + 机构类型标签 + 代表押注。数值以单元格标注为准。
 * 数据为调研整理与推演（报告 3.x，出手次数为示意量级）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  rowCount        number 展示的机构行数(3–6)   默认 6
 *  focusEnabled    bool   重点行高亮开关         默认 true
 *  focusIndex      number 重点行序号(从1起)     默认 1   范围 1–rowCount
 *  showBar         bool   出手次数柱条列显隐      默认 true
 *  showType        bool   机构类型标签列显隐      默认 true
 *  showRep         bool   代表押注列显隐         默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide53Ledger, { defaults, controls } from './Slide53Ledger.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 机构类型 → 主色
const XHSLG_TYPE_COLOR = {
  '风险投资': '#27E021',
  '战略投资': '#15A7F0',
  '成长基金': '#FFC700',
  '主权基金': '#FF9FE2',
};
// 活跃出资方（报告 3.x 整理 / 推演；deals = 2024 AI 大额轮出手次数 · 示意）
const XHSLG_ROWS = [
  { name: 'a16z', full: 'Andreessen Horowitz', type: '风险投资', deals: 12, rep: 'xAI · Databricks' },
  { name: 'Nvidia', full: '英伟达战投', type: '战略投资', deals: 9, rep: 'CoreWeave · xAI' },
  { name: 'Sequoia', full: '红杉资本', type: '风险投资', deals: 8, rep: 'OpenAI 生态' },
  { name: 'Thrive Capital', full: '成长基金', type: '成长基金', deals: 7, rep: '领投 OpenAI 66 亿' },
  { name: 'SoftBank', full: '软银愿景基金', type: '成长基金', deals: 6, rep: '重返 AI 牌桌' },
  { name: 'MGX', full: '阿布扎比主权', type: '主权基金', deals: 5, rep: '中东资本进场' },
];

function LgSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE53LEDGER_COPY = {
  text001: "出资方 · WHO'S WRITING CHECKS",
  text002: "谁在出手？",
  text003: "头部资本最忙",
  text004: "#",
  text005: "出资方",
  text006: "机构类型",
  text007: "2024 出手",
  text008: "次",
  text009: "代表押注",
  text010: "数据为调研整理与推演 · 出手次数＝该机构 2024 参与的 ≥1 亿美元 AI 轮次（示意量级）· 柱条按全表最多出手归一",
};
function Slide53Ledger(props) {
  const {
      copy = SLIDE53LEDGER_COPY,
      rowsData = XHSLG_ROWS,
    rowCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    showBar = true,
    showType = true,
    showRep = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const rc = Math.max(3, Math.min(6, rowCount));
  const rows = rowsData.slice(0, rc);
  const focus = Math.max(1, Math.min(rc, focusIndex)) - 1;
  const maxDeals = Math.max.apply(null, rows.map((r) => r.deals));

  // 列模板随可选列自适应：rank · name · [type] · deals(bar+num) · [rep]
  const gridCols = ['72px', '380px', showType ? '0.9fr' : null, '1.7fr', showRep ? '1.1fr' : null]
    .filter(Boolean).join(' ');

  return (
    <section className="xhs-base xhsLg-root" data-label="投资人出手榜" data-screen-label="投资人出手榜">
      <style>{XHSLG_CSS}</style>

      <header className="xhsLg-head">
        <div className="xhsLg-kicker">{copy.text001}</div>
        <h2 className="xhsLg-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsLg-tableWrap">
        <div className="xhsLg-table">
          <div className="xhsLg-row xhsLg-row--head" style={{ gridTemplateColumns: gridCols }}>
            <div className="xhsLg-c xhsLg-c--rank">{copy.text004}</div>
            <div className="xhsLg-c xhsLg-c--name">{copy.text005}</div>
            {showType && <div className="xhsLg-c xhsLg-c--type">{copy.text006}</div>}
            <div className="xhsLg-c xhsLg-c--deals">{copy.text007}<i>{copy.text008}</i></div>
            {showRep && <div className="xhsLg-c xhsLg-c--rep">{copy.text009}</div>}
          </div>

          {rows.map((r, i) => {
            const color = XHSLG_TYPE_COLOR[r.type] || '#27E021';
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const w = Math.max(10, (r.deals / maxDeals) * 100);
            return (
              <div key={i} className={'xhsLg-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': color, gridTemplateColumns: gridCols }}>
                <div className="xhsLg-c xhsLg-c--rank">
                  <span className={'xhsLg-badge' + (i < 3 ? ' is-top' : '')}>{i + 1}</span>
                </div>
                <div className="xhsLg-c xhsLg-c--name">
                  <span className="xhsLg-name">{r.name}</span>
                  <span className="xhsLg-full">{r.full}</span>
                </div>
                {showType && (
                  <div className="xhsLg-c xhsLg-c--type">
                    <span className="xhsLg-tag">{r.type}</span>
                  </div>
                )}
                <div className="xhsLg-c xhsLg-c--deals">
                  {showBar && (
                    <span className="xhsLg-track"><span className="xhsLg-fill" style={{ width: w + '%' }} /></span>
                  )}
                  <span className="xhsLg-num">{r.deals}</span>
                </div>
                {showRep && (
                  <div className="xhsLg-c xhsLg-c--rep"><span className="xhsLg-rep">{r.rep}</span></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="xhsLg-caption">{copy.text010}</div>

      {showDecorations && (
        <React.Fragment>
          <LgSpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <LgSpark size={16} color="#15A7F0" style={{ position: 'absolute', left: 80, bottom: 92 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSLG_CSS = `
  .xhsLg-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsLg-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsLg-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsLg-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsLg-tableWrap{ flex:1 1 auto; min-height:0; display:flex; align-items:center; }
  .xhsLg-table{ width:100%; display:flex; flex-direction:column; gap:12px; }

  .xhsLg-row{ display:grid; align-items:center; gap:24px;
    grid-template-columns:72px 380px 0.9fr 1.7fr 1.1fr;
    padding:16px 30px; border-radius:18px; background:linear-gradient(120deg,#151515,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsLg-row--head{ background:none; border:none; padding:0 30px 4px; }
  .xhsLg-row--head .xhsLg-c{ font-family:"Space Mono",monospace; font-size:19px; letter-spacing:.05em; color:#8a8a8a; font-weight:700; }
  .xhsLg-row--head .xhsLg-c i{ font-style:normal; font-size:14px; color:#6a6a6a; margin-left:8px; letter-spacing:.04em; }
  .xhsLg-row.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsLg-row.is-hot{ border-color:var(--c); box-shadow:0 0 52px color-mix(in srgb, var(--c) 24%, transparent); }

  .xhsLg-c{ min-width:0; display:flex; align-items:center; }
  .xhsLg-c--rank{ justify-content:flex-start; }
  .xhsLg-c--name{ flex-direction:column; align-items:flex-start; gap:3px; }

  .xhsLg-badge{ width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:#cfcfcf; background:#161616; border:2px solid #2a2a2a; }
  .xhsLg-badge.is-top{ color:#06140f; background:var(--c); border:none;
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 16px rgba(255,255,255,.4); }

  .xhsLg-name{ font-size:33px; font-weight:800; color:#fff; line-height:1.05; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
  .xhsLg-full{ font-size:18px; font-weight:600; color:#7e7e7e; line-height:1; }
  .xhsLg-row.is-hot .xhsLg-name{ color:var(--c); }

  .xhsLg-tag{ font-size:19px; font-weight:700; color:var(--c); padding:6px 16px; border-radius:999px;
    background:color-mix(in srgb, var(--c) 14%, #0c0c0c); border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent); white-space:nowrap; }

  .xhsLg-c--deals{ gap:18px; }
  .xhsLg-track{ flex:1; height:18px; min-width:0; border-radius:999px; background:#1a1a1a; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsLg-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35);
    transition:width .6s cubic-bezier(.2,.8,.2,1); }
  .xhsLg-num{ font-family:"Space Mono",monospace; font-size:32px; font-weight:700; color:#fff; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .xhsLg-row.is-hot .xhsLg-num{ color:var(--c); text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }

  .xhsLg-rep{ font-size:23px; font-weight:600; color:#bcbcbc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%; }
  .xhsLg-row.is-hot .xhsLg-rep{ color:#e6e6e6; }

  .xhsLg-caption{ flex:0 0 auto; margin-top:20px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'ledger',
  label: '投资人出手榜',
  Component: Slide53Ledger,
  defaults: {
      copy: SLIDE53LEDGER_COPY,
      rowsData: XHSLG_ROWS,
    ...hlDefaults,
    rowCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    showBar: true,
    showType: true,
    showRep: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }], default: SLIDE53LEDGER_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'rowsData', type: 'list', label: 'rowsData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "full", label: "full" }, { key: "type", label: "type" }, { key: "deals", label: "deals" }, { key: "rep", label: "rep" }], default: XHSLG_ROWS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'rowCount', type: 'slider', label: '机构行数', min: 3, max: 6, step: 1, default: 6, desc: '展示的出资方行数' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点行序号', min: 1, max: 6, step: 1, default: 1, maxFromKey: 'rowCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showBar', type: 'toggle', label: '出手柱条', default: true, desc: '行内出手次数柱条' },
    { key: 'showType', type: 'toggle', label: '类型标签', default: true, desc: '机构类型标签列' },
    { key: 'showRep', type: 'toggle', label: '代表押注', default: true, desc: '代表押注列' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide53Ledger.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide53Ledger;
