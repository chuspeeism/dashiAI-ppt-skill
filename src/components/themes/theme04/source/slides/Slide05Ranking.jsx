/*
 * Slide05Ranking — 头部玩家排行榜（横向排名条 / Leaderboard）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsRk- ，迁移到其它 React 项目不会污染全局。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  itemCount        number 展示条目数量      默认 6   可选 3–10
 *  focusEnabled     bool   重点突出开关       默认 true
 *  focusIndex       number 重点项序号(从1起)  默认 1   范围 1–itemCount
 *  sortDir          enum   排序方向          默认 'desc'  可选 'desc' | 'asc'
 *  showValue        bool   数值显示          默认 true
 *  showCategory     bool   类别标签显隐       默认 true
 *  showRankBadge    bool   序号徽章显隐       默认 true
 *  showDecorations  bool   装饰元素显隐       默认 true
 *
 * 文本内容写死在组件内，不做参数化。
 *
 * 迁移：import Slide05Ranking, { defaults, controls } from './Slide05Ranking.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// —— 设计令牌 + 内容（自带，保证组件可独立迁移）——
const XHSRK_CAT_COLOR = {
  '通用大模型': '#27E021',
  'AI 基础设施': '#15A7F0',
  'AI 硬件': '#FFC700',
  '垂直应用': '#FF9FE2',
};
const XHSRK_ROWS = [
  { name: 'OpenAI', value: 66, cat: '通用大模型' },
  { name: 'Anthropic', value: 65, cat: '通用大模型' },
  { name: 'xAI', value: 50, cat: '通用大模型' },
  { name: 'CoreWeave', value: 11, cat: 'AI 基础设施' },
  { name: 'Safe Superintelligence', value: 10, cat: '通用大模型' },
  { name: 'Scale AI', value: 10, cat: 'AI 基础设施' },
  { name: 'Figure AI', value: 6.8, cat: 'AI 硬件' },
  { name: 'Perplexity AI', value: 5.2, cat: '垂直应用' },
  { name: 'Databricks', value: 5.0, cat: 'AI 基础设施' },
  { name: 'Glean', value: 2.6, cat: '垂直应用' },
];

function RkSpark({ size = 22, color = '#fff', style }) {
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

function Slide05Ranking(props) {
  const {
    itemCount = 6,
    focusEnabled = true,
    focusIndex = 1,
    sortDir = 'desc',
    showValue = true,
    showCategory = true,
    showRankBadge = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '头部玩家 · TOP 10 单笔融资排名',
    titleLead = '三大模型公司',
    titleKeyword = '霸榜前三',
    sub = '单位：亿美元 · 仅取各公司 2024 年最大单笔融资',
    // 数据
    rows: rowsProp = XHSRK_ROWS,
  } = props;

  const src = Array.isArray(rowsProp) ? rowsProp : XHSRK_ROWS;
  const count = Math.max(3, Math.min(src.length, itemCount));
  // 原始数据按融资额降序；asc 时翻转展示顺序（名次仍按真实大小）
  const base = src.slice(0, count).map((r, i) => ({ ...r, value: Number(r.value) || 0, rank: i + 1 }));
  const rows = sortDir === 'asc' ? base.slice().reverse() : base;
  const max = Math.max.apply(null, base.map((r) => r.value));
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1; // 指真实名次(从1起)

  return (
    <section className="xhs-base xhsRk-root" data-label="头部玩家">
      <style>{XHSRK_CSS}</style>

      <header className="xhsRk-head">
        <div className="xhsRk-kicker">{kicker}</div>
        <h2 className="xhsRk-title">
          <span>{titleLead}</span>
          <HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
        <p className="xhsRk-sub">{sub}</p>
      </header>

      <div className="xhsRk-list">
        {rows.map((r) => {
          const color = XHSRK_CAT_COLOR[r.cat] || '#27E021';
          const hot = focusEnabled && r.rank - 1 === focus;
          const dim = focusEnabled && r.rank - 1 !== focus;
          const w = Math.max(6, (r.value / max) * 100);
          return (
            <div
              key={r.rank}
              className={'xhsRk-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': color }}
            >
              {showRankBadge && (
                <span className={'xhsRk-badge' + (r.rank <= 3 ? ' is-top' : '')}>
                  {r.rank}
                </span>
              )}
              <div className="xhsRk-meta">
                <span className="xhsRk-name">{r.name}</span>
                {showCategory && <span className="xhsRk-cat">{r.cat}</span>}
              </div>
              <div className="xhsRk-track">
                <div className="xhsRk-fill" style={{ width: w + '%' }} />
                {showValue && <span className="xhsRk-val">{r.value}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 120, top: 214, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <RkSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 120, top: 132 }} />
          <RkSpark size={18} color="#FF9FE2" style={{ position: 'absolute', left: 70, bottom: 80 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSRK_CSS = `
  .xhsRk-root{ padding:88px 120px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsRk-head{ margin-bottom:40px; }
  .xhsRk-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:22px; }
  .xhsRk-title{ margin:0; display:flex; align-items:center; gap:22px; font-size:62px; font-weight:900; color:#fff; }
  .xhsRk-sub{ margin:22px 0 0; font-size:23px; color:#8a8a8a; font-weight:500; }

  .xhsRk-list{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:14px; }
  .xhsRk-row{ display:flex; align-items:center; gap:26px; padding:8px 0;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsRk-row.is-dim{ opacity:.5; filter:saturate(.75); }
  .xhsRk-row.is-hot{ transform:translateX(8px); }

  .xhsRk-badge{ flex-shrink:0; width:54px; height:54px; border-radius:50%; display:flex;
    align-items:center; justify-content:center; font-family:"Space Mono",monospace;
    font-size:26px; font-weight:700; color:#cfcfcf; background:#161616;
    border:2px solid #2a2a2a; }
  .xhsRk-badge.is-top{ color:#000; background:var(--c);
    box-shadow:0 0 34px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); border:none; }

  .xhsRk-meta{ flex-shrink:0; width:330px; display:flex; flex-direction:column; gap:5px; }
  .xhsRk-name{ font-size:32px; font-weight:800; color:#fff; line-height:1.05;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsRk-cat{ font-size:18px; font-weight:700; color:var(--c); opacity:.92; }

  .xhsRk-track{ flex:1; position:relative; display:flex; align-items:center; min-width:0; }
  .xhsRk-fill{ height:30px; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 70%, #000) 0%, var(--c) 100%);
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 26%, transparent), inset 0 2px 0 rgba(255,255,255,.35);
    transition:width .6s cubic-bezier(.2,.8,.2,1); }
  .xhsRk-row.is-hot .xhsRk-fill{ height:40px;
    box-shadow:0 0 56px color-mix(in srgb, var(--c) 60%, transparent), inset 0 2px 0 rgba(255,255,255,.45); }
  .xhsRk-val{ margin-left:18px; font-size:30px; font-weight:900; color:#fff;
    font-variant-numeric:tabular-nums; white-space:nowrap; }
  .xhsRk-row.is-hot .xhsRk-val{ font-size:36px; color:var(--c); }
`;

const META = {
  id: 'ranking',
  label: '头部玩家',
  Component: Slide05Ranking,
  defaults: {
    ...hlDefaults,
    itemCount: 6,
    focusEnabled: true,
    focusIndex: 1,
    sortDir: 'desc',
    showValue: true,
    showCategory: true,
    showRankBadge: true,
    showDecorations: true,
    kicker: '头部玩家 · TOP 10 单笔融资排名',
    titleLead: '三大模型公司',
    titleKeyword: '霸榜前三',
    sub: '单位：亿美元 · 仅取各公司 2024 年最大单笔融资',
    rows: XHSRK_ROWS,
  },
  controls: [
    ...hlControls,
    { key: 'itemCount', type: 'slider', label: '条目数量', min: 3, max: 10, step: 1, default: 6, desc: '展示的排行条目数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一名次' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 10, step: 1, default: 1, maxFromKey: 'itemCount', showIf: (v) => v.focusEnabled, desc: '被高亮条目的名次' },
    { key: 'sortDir', type: 'radio', label: '排序方向', options: ['desc', 'asc'], optionLabels: ['从高到低', '从低到高'], default: 'desc', desc: '展示顺序方向' },
    { key: 'showValue', type: 'toggle', label: '数值显示', default: true, desc: '条末数值标签' },
    { key: 'showCategory', type: 'toggle', label: '类别标签', default: true, desc: '名称下方的赛道标签' },
    { key: 'showRankBadge', type: 'toggle', label: '序号徽章', default: true, desc: '左侧名次徽章' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '头部玩家 · TOP 10 单笔融资排名', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '三大模型公司', desc: '标题关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '霸榜前三', desc: '高亮关键词' },
    { key: 'sub', type: 'text', label: '副标题', default: '单位：亿美元 · 仅取各公司 2024 年最大单笔融资', desc: '标题下方说明' },
    { type: 'section', label: '数据 · 排行' },
    {
      key: 'rows', type: 'list', label: '排行条目', itemLabel: '名次', countFromKey: 'itemCount',
      fields: [{ key: 'name', label: '名称' }, { key: 'value', label: '数值' }, { key: 'cat', label: '赛道' }],
      default: XHSRK_ROWS, desc: '排行条目：名称 / 数值 / 赛道（赛道名决定色彩）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide05Ranking.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide05Ranking;
