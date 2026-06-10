/*
 * Slide08Compare — 投资策略对比（看好 / 谨慎 双栏对照）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCp- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  columnCount     number 列数             默认 2   可选 1–2（=1 仅显示首列）
 *  itemCount       number 每列条目数量      默认 3   可选 2–3
 *  focusEnabled    bool   重点突出开关       默认 false
 *  focusSide       enum   重点列            默认 'left'  可选 'left' | 'right'
 *  showIcons       bool   ✓/✕ 图标显隐       默认 true
 *  showDecorations bool   装饰元素显隐       默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide08Compare, { defaults, controls } from './Slide08Compare.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSCP_COLUMNS = [
  {
    side: 'left',
    color: '#27E021',
    kind: 'good',
    heading: '看好方向',
    sub: '有商业闭环 · 确定性强',
    items: [
      { title: '垂直应用', desc: '商业模式清晰、已验证 PMF，如 Glean、Harvey。' },
      { title: '基础设施中游', desc: '数据标注、向量数据库等"卖铲子"环节，如 Scale AI、Pinecone。' },
      { title: '具身智能', desc: '人形机器人、自动驾驶等长周期硬科技，如 Figure AI。' },
    ],
  },
  {
    side: 'right',
    color: '#FF2442',
    kind: 'bad',
    heading: '谨慎对待',
    sub: '泡沫高 · 壁垒低',
    items: [
      { title: '高估值无收入纯模型', desc: '烧钱速度快、竞争壁垒低、估值泡沫大。' },
      { title: '跟风的"AI 包装"项目', desc: '仅在传统业务上加一层 LLM 调用，无核心壁垒。' },
      { title: '无数据护城河的消费应用', desc: '用户迁移成本低，易被大厂直接复制。' },
    ],
  },
];

function CpSpark({ size = 20, color = '#fff', style }) {
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

function CpMark({ kind, color }) {
  return (
    <span className="xhsCp-mark" style={{ '--c': color }}>
      {kind === 'good' ? (
        <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 13l4 4L19 7" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="#000" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

function Slide08Compare(props) {
  const {
    columnCount = 2,
    itemCount = 3,
    focusEnabled = false,
    focusSide = 'left',
    showIcons = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '投资展望 · 策略对比',
    titleLead = '退潮之后，谁能',
    titleKeyword = '留在牌桌',
    // 数据
    columns = XHSCP_COLUMNS,
  } = props;

  const cols = (Array.isArray(columns) ? columns : XHSCP_COLUMNS).slice(0, Math.max(1, Math.min(2, columnCount)));
  const items = Math.max(2, Math.min(3, itemCount));

  return (
    <section className="xhs-base xhsCp-root" data-label="投资策略">
      <style>{XHSCP_CSS}</style>

      <header className="xhsCp-head">
        <div className="xhsCp-kicker">{kicker}</div>
        <h2 className="xhsCp-title">
          <span>{titleLead}</span>
          <HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
      </header>

      <div className={'xhsCp-grid' + (cols.length === 1 ? ' is-single' : '')}>
        {cols.map((col) => {
          const hot = focusEnabled && col.side === focusSide;
          const dim = focusEnabled && col.side !== focusSide;
          return (
            <div
              key={col.side}
              className={'xhsCp-col xhsCp-col--' + col.kind + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': col.color }}
            >
              <div className="xhsCp-colhead">
                {showIcons && <CpMark kind={col.kind} color={col.color} />}
                <div className="xhsCp-colheadtext">
                  <span className="xhsCp-colname">{col.heading}</span>
                  <span className="xhsCp-colsub">{col.sub}</span>
                </div>
              </div>
              <div className="xhsCp-items">
                {col.items.slice(0, items).map((it, k) => (
                  <div className="xhsCp-item" key={k}>
                    <span className="xhsCp-bullet" />
                    <div className="xhsCp-itemtext">
                      <span className="xhsCp-itemtitle">{it.title}</span>
                      <span className="xhsCp-itemdesc">{it.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 130, top: 212, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <CpSpark size={24} color="#27E021" style={{ position: 'absolute', right: 130, top: 130 }} />
          <CpSpark size={16} color="#FF2442" style={{ position: 'absolute', left: 80, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCP_CSS = `
  .xhsCp-root{ padding:84px 110px 70px; position:relative; display:flex; flex-direction:column; }
  .xhsCp-head{ margin-bottom:40px; }
  .xhsCp-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:20px; }
  .xhsCp-title{ margin:0; display:flex; align-items:center; gap:22px; font-size:58px; font-weight:900; color:#fff; }

  .xhsCp-grid{ flex:1; display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:stretch; }
  .xhsCp-grid.is-single{ grid-template-columns:1fr; max-width:920px; }

  .xhsCp-col{ position:relative; border-radius:24px; padding:42px 46px;
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 12%, #131313), #0f0f0f 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 38%, transparent);
    display:flex; flex-direction:column; gap:30px;
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, box-shadow .3s ease; }
  .xhsCp-col.is-dim{ opacity:.44; filter:saturate(.7); }
  .xhsCp-col.is-hot{ transform:translateY(-8px); border-color:var(--c);
    box-shadow:0 0 80px color-mix(in srgb, var(--c) 30%, transparent); }

  .xhsCp-colhead{ display:flex; align-items:center; gap:20px; padding-bottom:26px;
    border-bottom:2px solid color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsCp-mark{ flex-shrink:0; width:62px; height:62px; border-radius:50%; background:var(--c);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 34px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }
  .xhsCp-colheadtext{ display:flex; flex-direction:column; gap:6px; }
  .xhsCp-colname{ font-size:40px; font-weight:900; color:#fff; line-height:1; }
  .xhsCp-colsub{ font-size:21px; font-weight:700; color:var(--c); }

  .xhsCp-items{ display:flex; flex-direction:column; gap:24px; }
  .xhsCp-item{ display:flex; gap:18px; align-items:flex-start; }
  .xhsCp-bullet{ flex-shrink:0; width:14px; height:14px; margin-top:11px; border-radius:50%;
    background:var(--c); box-shadow:0 0 14px color-mix(in srgb, var(--c) 65%, transparent); }
  .xhsCp-itemtext{ display:flex; flex-direction:column; gap:7px; }
  .xhsCp-itemtitle{ font-size:30px; font-weight:900; color:#fff; }
  .xhsCp-itemdesc{ font-size:22px; line-height:1.5; font-weight:500; color:#9e9e9e; }
`;

const META = {
  id: 'compare',
  label: '投资策略',
  Component: Slide08Compare,
  defaults: {
    ...hlDefaults,
    columnCount: 2,
    itemCount: 3,
    focusEnabled: false,
    focusSide: 'left',
    showIcons: true,
    showDecorations: true,
    kicker: '投资展望 · 策略对比',
    titleLead: '退潮之后，谁能',
    titleKeyword: '留在牌桌',
    columns: XHSCP_COLUMNS,
  },
  controls: [
    ...hlControls,
    { key: 'columnCount', type: 'slider', label: '列数', min: 1, max: 2, step: 1, default: 2, desc: '对比列数(=1 仅显示首列)' },
    { key: 'itemCount', type: 'slider', label: '条目数量', min: 2, max: 3, step: 1, default: 3, desc: '每列展示的条目数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一列' },
    { key: 'focusSide', type: 'radio', label: '重点列', options: ['left', 'right'], optionLabels: ['首列', '次列'], default: 'left', showIf: (v) => v.focusEnabled && v.columnCount > 1, desc: '被高亮的列' },
    { key: 'showIcons', type: 'toggle', label: '图标显示', default: true, desc: '列首 ✓/✕ 图标' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '投资展望 · 策略对比', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '退潮之后，谁能', desc: '标题关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '留在牌桌', desc: '高亮关键词' },
    { type: 'section', label: '数据 · 对比列' },
    {
      key: 'columns', type: 'list', label: '对比列', itemLabel: '列', countFromKey: 'columnCount',
      fields: [{ key: 'heading', label: '标题' }, { key: 'sub', label: '副标' }, { key: 'color', label: '颜色' }],
      default: XHSCP_COLUMNS, desc: '对比列：标题 / 副标 / 颜色（每列条目 items 在 defaults 中）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide08Compare.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide08Compare;
