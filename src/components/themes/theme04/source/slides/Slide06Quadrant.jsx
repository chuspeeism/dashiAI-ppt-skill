/*
 * Slide06Quadrant — 选题四象限矩阵（资本热度 × 商业兑现度）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsQd- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  focusEnabled    bool   重点突出开关        默认 false
 *  focusIndex      number 重点象限序号(1–4)   默认 1
 *  chipCount       number 每格示例标签数量     默认 3   可选 0–4
 *  showAxisLabels  bool   坐标轴标注显隐       默认 true
 *  showChips       bool   示例标签显隐         默认 true
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 象限顺序：1 左上 / 2 右上 / 3 左下 / 4 右下。文本写死，不做参数化。
 *
 * 迁移：import Slide06Quadrant, { defaults, controls } from './Slide06Quadrant.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSQD_CELLS = [
  { name: '明星兑现区', color: '#27E021', desc: '融资热度与收入确定性兼具，"卖铲子"逻辑成立。', chips: ['CoreWeave', 'Databricks', 'Scale AI'] },
  { name: '叙事泡沫区', color: '#FFC700', desc: '巨额融资在手，商业兑现仍受成本与监管约束。', chips: ['OpenAI', 'Anthropic', 'xAI', 'SSI'] },
  { name: '隐形价值区', color: '#15A7F0', desc: '单笔不一定最大，但落地路径与留存更清晰。', chips: ['Glean', 'Perplexity'] },
  { name: '等待验证区', color: '#FF9FE2', desc: '概念成立、规模未证，作为风险与边缘变量观察。', chips: ['长尾工具链', 'AI 安全', '早期硬件'] },
];

function QdSpark({ size = 20, color = '#fff', style }) {
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

function Slide06Quadrant(props) {
  const {
    focusEnabled = false,
    focusIndex = 1,
    chipCount = 3,
    showAxisLabels = true,
    showChips = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
    // 文案
    kicker = '选题四象限 · 资本热度 × 商业兑现',
    titleLead = '从「谁融得多」升级为',
    titleKeyword = '「谁能兑现」',
    axisColHigh = '商业兑现度 · 高',
    axisColLow = '商业兑现度 · 低 / 待验证',
    axisRowHigh = '资本热度 · 高',
    axisRowLow = '资本热度 · 低 / 中',
    // 数据
    cells = XHSQD_CELLS,
  } = props;

  const focus = Math.max(1, Math.min(4, focusIndex)) - 1;
  const chips = Math.max(0, Math.min(4, chipCount));
  const cellList = Array.isArray(cells) ? cells : XHSQD_CELLS;

  return (
    <section className="xhs-base xhsQd-root" data-label="选题四象限">
      <style>{XHSQD_CSS}</style>

      <header className="xhsQd-head">
        <div className="xhsQd-kicker">{kicker}</div>
        <h2 className="xhsQd-title">
          <span>{titleLead}</span>
          <HL color="#15A7F0" variant={hlStyle} tilt={-hlTilt}>{titleKeyword}</HL>
        </h2>
      </header>

      <div className={'xhsQd-matrix' + (showAxisLabels ? '' : ' no-axis')}>
        {showAxisLabels && <div className="xhsQd-corner" />}
        {showAxisLabels && <div className="xhsQd-col-cap">{axisColHigh}</div>}
        {showAxisLabels && <div className="xhsQd-col-cap is-low">{axisColLow}</div>}
        {showAxisLabels && <div className="xhsQd-row-cap">{axisRowHigh}</div>}

        {cellList.map((c, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          // 让第二行第一格之前插入「资本热度 低/中」行标
          const rowCapBefore = showAxisLabels && i === 2;
          const cellChips = Array.isArray(c.chips) ? c.chips : String(c.chips || '').split(/[，,、\s]+/).filter(Boolean);
          return (
            <React.Fragment key={i}>
              {rowCapBefore && <div className="xhsQd-row-cap is-low">{axisRowLow}</div>}
              <div
                className={'xhsQd-cell' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': c.color }}
              >
                <span className="xhsQd-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div className="xhsQd-cell-head">
                  <span className="xhsQd-dot" />
                  <span className="xhsQd-name">{c.name}</span>
                </div>
                <p className="xhsQd-desc">{c.desc}</p>
                {showChips && chips > 0 && (
                  <div className="xhsQd-chips">
                    {cellChips.slice(0, chips).map((t, k) => (
                      <span key={k} className="xhsQd-chip">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {showDecorations && (
        <React.Fragment>
          <span aria-hidden="true" style={{ position: 'absolute', right: 130, top: 212, width: 46, height: 46, borderRadius: '50%', border: '5px solid rgba(255,255,255,.9)', boxShadow: '0 0 22px rgba(255,255,255,.22)' }} />
          <QdSpark size={24} color="#27E021" style={{ position: 'absolute', right: 130, top: 130 }} />
          <QdSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 70 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSQD_CSS = `
  .xhsQd-root{ padding:80px 120px 64px; position:relative; display:flex; flex-direction:column; }
  .xhsQd-head{ margin-bottom:30px; }
  .xhsQd-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.14em;
    color:#7c7c7c; margin-bottom:18px; }
  .xhsQd-title{ margin:0; display:flex; align-items:center; gap:20px; font-size:54px; font-weight:900; color:#fff; }

  .xhsQd-matrix{ flex:1; display:grid; gap:18px;
    grid-template-columns:44px 1fr 1fr; grid-template-rows:34px 1fr 1fr; align-items:stretch; }
  .xhsQd-matrix.no-axis{ grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; }
  .xhsQd-corner{ }
  .xhsQd-col-cap{ display:flex; align-items:center; justify-content:center; font-size:21px; font-weight:800;
    color:#27E021; letter-spacing:.02em; }
  .xhsQd-col-cap.is-low{ color:#FF9FE2; }
  .xhsQd-row-cap{ writing-mode:vertical-rl; display:flex; align-items:center;
    justify-content:center; font-size:21px; font-weight:800; color:#27E021; letter-spacing:.04em; }
  .xhsQd-row-cap.is-low{ color:#FF9FE2; }

  .xhsQd-cell{ position:relative; border-radius:22px; padding:30px 34px;
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 14%, #121212), #0f0f0f 70%);
    border:1.5px solid color-mix(in srgb, var(--c) 40%, transparent);
    display:flex; flex-direction:column; gap:14px; overflow:hidden;
    transition:transform .3s cubic-bezier(.2,.8,.2,1), opacity .3s ease, box-shadow .3s ease; }
  .xhsQd-cell::after{ content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 42%);
    opacity:.9; }
  .xhsQd-index{ position:absolute; top:20px; right:30px; z-index:1; pointer-events:none;
    font-family:"Space Mono",monospace; font-size:78px; font-weight:700; line-height:1; letter-spacing:-.02em;
    color:transparent; -webkit-text-stroke:1.6px color-mix(in srgb, var(--c) 48%, transparent);
    opacity:.62; transition:opacity .3s ease, -webkit-text-stroke-color .3s ease; }
  .xhsQd-cell.is-hot .xhsQd-index{ opacity:1; -webkit-text-stroke-color:var(--c); }
  .xhsQd-cell.is-dim{ opacity:.42; filter:saturate(.7); }
  .xhsQd-cell.is-hot{ transform:scale(1.03); border-color:var(--c);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 32%, transparent); }
  .xhsQd-cell-head, .xhsQd-desc, .xhsQd-chips{ position:relative; z-index:1; }
  .xhsQd-cell-head{ display:flex; align-items:center; gap:14px; }
  .xhsQd-dot{ width:18px; height:18px; border-radius:50%; background:var(--c);
    box-shadow:0 0 16px color-mix(in srgb, var(--c) 70%, transparent); flex-shrink:0; }
  .xhsQd-name{ font-size:36px; font-weight:900; color:#fff; }
  .xhsQd-desc{ margin:0; font-size:22px; line-height:1.55; color:#a8a8a8; font-weight:500; max-width:92%; }
  .xhsQd-chips{ display:flex; flex-wrap:wrap; gap:11px; margin-top:auto; padding-top:6px; }
  .xhsQd-chip{ font-size:19px; font-weight:700; color:#000; background:var(--c); padding:7px 17px;
    border-radius:999px; white-space:nowrap; box-shadow:inset 0 2px 0 rgba(255,255,255,.6), inset 0 0 18px rgba(255,255,255,.45); }
`;

const META = {
  id: 'quadrant',
  label: '选题四象限',
  Component: Slide06Quadrant,
  defaults: {
    ...hlDefaults,
    focusEnabled: false,
    focusIndex: 1,
    chipCount: 3,
    showAxisLabels: true,
    showChips: true,
    showDecorations: true,
    kicker: '选题四象限 · 资本热度 × 商业兑现',
    titleLead: '从「谁融得多」升级为',
    titleKeyword: '「谁能兑现」',
    axisColHigh: '商业兑现度 · 高',
    axisColLow: '商业兑现度 · 低 / 待验证',
    axisRowHigh: '资本热度 · 高',
    axisRowLow: '资本热度 · 低 / 中',
    cells: XHSQD_CELLS,
  },
  controls: [
    ...hlControls,
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一象限' },
    { key: 'focusIndex', type: 'slider', label: '重点象限', min: 1, max: 4, step: 1, default: 1, showIf: (v) => v.focusEnabled, desc: '被高亮象限序号(1左上→4右下)' },
    { key: 'chipCount', type: 'slider', label: '标签数量', min: 0, max: 4, step: 1, default: 3, desc: '每个象限展示的示例标签数量' },
    { key: 'showAxisLabels', type: 'toggle', label: '坐标轴标注', default: true, desc: '横纵坐标轴文字' },
    { key: 'showChips', type: 'toggle', label: '示例标签', default: true, desc: '象限内示例公司标签' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: '选题四象限 · 资本热度 × 商业兑现', desc: '顶部 kicker' },
    { key: 'titleLead', type: 'text', label: '标题前半', default: '从「谁融得多」升级为', desc: '标题关键词前文' },
    { key: 'titleKeyword', type: 'text', label: '标题关键词', default: '「谁能兑现」', desc: '高亮关键词' },
    { key: 'axisColHigh', type: 'text', label: '横轴 · 高', default: '商业兑现度 · 高', desc: '左列顶轴标', showIf: (v) => v.showAxisLabels },
    { key: 'axisColLow', type: 'text', label: '横轴 · 低', default: '商业兑现度 · 低 / 待验证', desc: '右列顶轴标', showIf: (v) => v.showAxisLabels },
    { key: 'axisRowHigh', type: 'text', label: '纵轴 · 高', default: '资本热度 · 高', desc: '上行左轴标', showIf: (v) => v.showAxisLabels },
    { key: 'axisRowLow', type: 'text', label: '纵轴 · 低', default: '资本热度 · 低 / 中', desc: '下行左轴标', showIf: (v) => v.showAxisLabels },
    { type: 'section', label: '数据 · 象限' },
    {
      key: 'cells', type: 'list', label: '象限', itemLabel: '象限',
      fields: [{ key: 'name', label: '名称' }, { key: 'desc', label: '描述' }, { key: 'chips', label: '标签(逗号分隔)' }, { key: 'color', label: '颜色' }],
      default: XHSQD_CELLS, desc: '四象限：名称 / 描述 / 示例标签 / 颜色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide06Quadrant.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide06Quadrant;
