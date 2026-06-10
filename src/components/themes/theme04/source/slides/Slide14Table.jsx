/*
 * Slide14Table — 表格页（融资轮次结构对比 · 暗色霓虹表格 + 行内可视化柱条）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsTb- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  rowCount        number 数据行数            默认 6   可选 3–6
 *  focusEnabled    bool   重点行高亮开关       默认 true
 *  focusIndex      number 重点行序号(从1起)    默认 6
 *  showBar         bool   行内柱条可视化列      默认 true
 *  showTotalRow    bool   合计行显隐           默认 true
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide14Table, { defaults, controls } from './Slide14Table.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSTB_ACCENT = '#FFC700';
// 列：轮次 / 事件笔数 / 平均单笔（亿美元）
const XHSTB_ROWS = [
  { stage: '种子轮', en: 'Seed', count: 8, avg: 1.2 },
  { stage: 'A 轮', en: 'Series A', count: 12, avg: 1.8 },
  { stage: 'B 轮', en: 'Series B', count: 18, avg: 3.5 },
  { stage: 'C 轮', en: 'Series C', count: 15, avg: 6.8 },
  { stage: 'D 轮及以后', en: 'Series D+', count: 22, avg: 15.2 },
  { stage: '未标明轮次', en: 'Undisclosed', count: 22, avg: 18.6 },
];
const XHSTB_TOTAL = { stage: '全年合计', en: 'Total', count: 97, avg: 10.0 };

function TbSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE14TABLE_COPY = {
  text001: "笔",
  text002: "笔",
};
function Slide14Table(props) {
  const {
      copy = SLIDE14TABLE_COPY,
    rowCount = 6,
    focusEnabled = true,
    focusIndex = 6,
    showBar = true,
    showTotalRow = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '轮次结构 · ROUND STRUCTURE',
    titleLead = '越往后轮次，',
    titleKeyword = '单笔越大',
    titleTail = '——头部「赢家通吃」',
    sub = '「D 轮及以后」与「未标明轮次」合计占比过半，平均单笔超 15 亿美元。',
    colStage = '融资轮次',
    colCount = '事件笔数',
    colAvg = '平均单笔 / 亿美元',
    colBar = '规模对比',
    // 数据
    rows = XHSTB_ROWS,
    totalRow = XHSTB_TOTAL,
  } = props;

  const src = Array.isArray(rows) && rows.length ? rows : XHSTB_ROWS;
  const count = Math.max(3, Math.min(src.length, rowCount));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const maxAvg = Math.max.apply(null, src.map((r) => Number(r.avg) || 0));

  return (
    <section className="xhs-base xhsTb-root" data-label="轮次结构表" style={{ '--c': XHSTB_ACCENT }}>
      <style>{XHSTB_CSS}</style>

      <header className="xhsTb-head">
        <div className="xhsTb-kicker">{kicker}</div>
        <h2 className="xhsTb-title">
          {titleLead}<HL color={XHSTB_ACCENT} variant={hlStyle} tilt={hlTilt}>{titleKeyword}</HL>{titleTail}
        </h2>
        <p className="xhsTb-sub">{sub}</p>
      </header>

      <div className={'xhsTb-table' + (showBar ? '' : ' no-bar')}>
        <div className="xhsTb-row xhsTb-hrow">
          <span className="xhsTb-c-stage">{colStage}</span>
          <span className="xhsTb-c-count">{colCount}</span>
          <span className="xhsTb-c-avg">{colAvg}</span>
          {showBar && <span className="xhsTb-c-bar">{colBar}</span>}
        </div>

        {shown.map((r, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsTb-row xhsTb-drow' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
              <span className="xhsTb-c-stage">
                <span className="xhsTb-stage-zh">{r.stage}</span>
                <span className="xhsTb-stage-en">{r.en}</span>
              </span>
              <span className="xhsTb-c-count"><b>{r.count}</b>{copy.text001}</span>
              <span className="xhsTb-c-avg"><b>{Number(r.avg).toFixed(1)}</b></span>
              {showBar && (
                <span className="xhsTb-c-bar">
                  <span className="xhsTb-track">
                    <span className="xhsTb-fill" style={{ width: (r.avg / maxAvg) * 100 + '%' }} />
                  </span>
                </span>
              )}
            </div>
          );
        })}

        {showTotalRow && (
          <div className="xhsTb-row xhsTb-trow">
            <span className="xhsTb-c-stage"><span className="xhsTb-stage-zh">{totalRow.stage}</span></span>
            <span className="xhsTb-c-count"><b>{totalRow.count}</b>{copy.text002}</span>
            <span className="xhsTb-c-avg"><b>{Number(totalRow.avg).toFixed(1)}</b></span>
            {showBar && <span className="xhsTb-c-bar" />}
          </div>
        )}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 116, top: 224, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <TbSpark size={22} color="#15A7F0" style={{ position: 'absolute', right: 116, top: 142 }} />
          <TbSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 84 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSTB_CSS = `
  .xhsTb-root{ padding:84px 110px 76px; position:relative; display:flex; flex-direction:column; }
  .xhsTb-head{ margin-bottom:40px; }
  .xhsTb-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:18px; }
  .xhsTb-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }
  .xhsTb-sub{ margin:22px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; }

  .xhsTb-table{ flex:1; display:flex; flex-direction:column; gap:12px; justify-content:center; }
  .xhsTb-row{ display:grid; grid-template-columns:1.6fr 1fr 1.2fr 2fr; align-items:center;
    column-gap:30px; padding:0 40px; }
  .xhsTb-table.no-bar .xhsTb-row{ grid-template-columns:2fr 1fr 1.4fr; }

  .xhsTb-hrow{ padding-top:6px; padding-bottom:18px; border-bottom:2px solid color-mix(in srgb, var(--c) 55%, #333);
    font-family:"Space Mono",monospace; font-size:21px; letter-spacing:.08em; color:#8a8a8a; font-weight:700; }
  .xhsTb-hrow .xhsTb-c-count, .xhsTb-hrow .xhsTb-c-avg{ text-align:right; }

  .xhsTb-drow{ height:78px; border-radius:16px; background:linear-gradient(160deg,#161616,#0e0e0e);
    border:1.5px solid rgba(255,255,255,.06);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsTb-drow.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsTb-drow.is-hot{ transform:translateX(8px);
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 20%, #141414), #0e0e0e);
    border-color:var(--c); box-shadow:0 0 54px color-mix(in srgb, var(--c) 24%, transparent); }

  .xhsTb-trow{ height:74px; margin-top:6px; padding-top:0;
    border-top:2px dashed rgba(255,255,255,.16); border-radius:0; }
  .xhsTb-trow .xhsTb-c-stage .xhsTb-stage-zh{ color:var(--c); }
  .xhsTb-trow b{ color:var(--c); }

  .xhsTb-c-stage{ display:flex; flex-direction:column; gap:2px; }
  .xhsTb-stage-zh{ font-size:30px; font-weight:900; color:#fff; }
  .xhsTb-stage-en{ font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.1em; color:#6f6f6f; }
  .xhsTb-c-count{ text-align:right; font-size:26px; font-weight:600; color:#a8a8a8; }
  .xhsTb-c-count b{ font-size:34px; font-weight:900; color:#eaeaea; margin-right:4px; }
  .xhsTb-c-avg{ text-align:right; font-size:22px; font-weight:600; color:#7e7e7e; }
  .xhsTb-c-avg b{ font-size:40px; font-weight:900; color:#fff; }
  .xhsTb-drow.is-hot .xhsTb-c-avg b{ color:var(--c); }

  .xhsTb-c-bar{ display:flex; align-items:center; }
  .xhsTb-track{ width:100%; height:18px; border-radius:999px; background:rgba(255,255,255,.07); overflow:hidden; }
  .xhsTb-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 70%, #fff), var(--c));
    box-shadow:0 0 22px color-mix(in srgb, var(--c) 45%, transparent); }
`;

const META = {
  id: 'table',
  label: '轮次结构表',
  Component: Slide14Table,
  defaults: {
      copy: SLIDE14TABLE_COPY,
    ...hlDefaults,
    rowCount: 6,
    focusEnabled: true,
    focusIndex: 6,
    showBar: true,
    showTotalRow: true,
    showDecorations: true,
    kicker: '轮次结构 · ROUND STRUCTURE',
    titleLead: '越往后轮次，',
    titleKeyword: '单笔越大',
    titleTail: '——头部「赢家通吃」',
    sub: '「D 轮及以后」与「未标明轮次」合计占比过半，平均单笔超 15 亿美元。',
    colStage: '融资轮次',
    colCount: '事件笔数',
    colAvg: '平均单笔 / 亿美元',
    colBar: '规模对比',
    rows: XHSTB_ROWS,
    totalRow: XHSTB_TOTAL,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }], default: SLIDE14TABLE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'rowCount', type: 'slider', label: '数据行数', min: 3, max: 6, step: 1, default: 6, desc: '展示的数据行数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一行' },
    { key: 'focusIndex', type: 'slider', label: '重点行号', min: 1, max: 6, step: 1, default: 6, maxFromKey: 'rowCount', showIf: (v) => v.focusEnabled, desc: '被高亮行的序号' },
    { key: 'showBar', type: 'toggle', label: '可视化列', default: true, desc: '行内规模对比柱条列' },
    { key: 'showTotalRow', type: 'toggle', label: '合计行', default: true, desc: '底部合计行' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '轮次结构 · ROUND STRUCTURE', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '越往后轮次，', desc: '关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '单笔越大', desc: '高亮关键词' },
    { key: 'titleTail', type: 'text', label: '标题后半', default: '——头部「赢家通吃」', desc: '关键词后文' },
    { key: 'sub', type: 'textarea', label: '副标题', rows: 2, default: '「D 轮及以后」与「未标明轮次」合计占比过半，平均单笔超 15 亿美元。', desc: '标题下方说明' },
    { key: 'colStage', type: 'text', label: '列头·轮次', default: '融资轮次', desc: '第一列表头' },
    { key: 'colCount', type: 'text', label: '列头·笔数', default: '事件笔数', desc: '第二列表头' },
    { key: 'colAvg', type: 'text', label: '列头·均值', default: '平均单笔 / 亿美元', desc: '第三列表头' },
    { key: 'colBar', type: 'text', label: '列头·柱条', default: '规模对比', desc: '柱条列表头', showIf: (v) => v.showBar },
    { type: 'section', label: '数据 · 表格' },
    {
      key: 'rows', type: 'list', label: '数据行', itemLabel: '行', countFromKey: 'rowCount',
      fields: [{ key: 'stage', label: '轮次' }, { key: 'en', label: '英文' }, { key: 'count', label: '笔数', type: 'number' }, { key: 'avg', label: '平均单笔', type: 'number' }],
      default: XHSTB_ROWS, desc: '表格数据行：轮次 / 英文 / 笔数 / 平均单笔',
    },
    {
      key: 'totalRow', type: 'list', label: '合计行', itemLabel: '合计', single: true,
      fields: [{ key: 'stage', label: '名称' }, { key: 'count', label: '笔数', type: 'number' }, { key: 'avg', label: '平均单笔', type: 'number' }],
      default: XHSTB_TOTAL, desc: '底部合计行', showIf: (v) => v.showTotalRow,
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide14Table.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide14Table;
