/*
 * Slide32Funnel — 资本漏斗（图表页 · 融资交易转化漏斗 / 横向柱状可切换）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsFn- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  stageCount      number 漏斗层级数量          默认 5   可选 3–5
 *  chartVariant    enum   图表类型            默认 'funnel' 可选 'funnel'|'bars'
 *  focusEnabled    bool   重点层级高亮开关       默认 true
 *  focusIndex      number 重点层级序号(从1起)    默认 4
 *  showConversion  bool   层级间转化率显隐       默认 true
 *  showStageIndex  bool   漏斗内层级编号显隐      默认 true（funnel 生效）
 *  showDecorations bool   星芒 / 圆环等点缀     默认 true
 *
 * 文本/数据写死在组件内，不做参数化。漏斗宽度为示意比例，数值以标签为准。
 * 迁移：import Slide32Funnel, { defaults, controls } from './Slide32Funnel.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 2024 美国 AI 融资漏斗（报告口径 · 数值为调研整理推演）
// topW：该层顶部相对宽度(%)；末层底宽固定在数组末尾
const XHSFN_STAGES = [
  { name: '活跃 AI 创业公司', sub: '全美在投', count: '5,000', suffix: '+', conv: '', color: '#15A7F0', topW: 100 },
  { name: '全年获得新融资', sub: '完成至少一轮', count: '1,200', suffix: '', conv: '24%', color: '#27E021', topW: 75 },
  { name: '千万美元级以上', sub: '$10M+ 单笔', count: '380', suffix: '', conv: '32%', color: '#FFC700', topW: 51 },
  { name: '亿美元级以上', sub: '本报告样本 · $100M+', count: '97', suffix: '', conv: '26%', color: '#FF9FE2', topW: 31 },
  { name: '十亿美元级', sub: '$1B+ 巨额轮', count: '12', suffix: '', conv: '12%', color: '#15A7F0', topW: 17 },
];
const XHSFN_BOTW = 9; // 末层底部宽度

function FnSpark({ size = 20, color = '#fff', style }) {
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


const SLIDE32FUNNEL_COPY = {
  text001: "交易漏斗 · DEAL FUNNEL",
  text002: "五千家筛到最后，",
  text003: "只有 97 笔",
  text004: "从活跃创业公司到亿美元级大额融资，层层筛选——本报告聚焦的，正是漏斗最底端那批顶流。",
  text005: "家",
  text006: "▼",
  text007: "通过率",
  text008: "漏斗宽度为示意比例 · 通过率 = 本层 ÷ 上一层 · 数据为调研整理推演",
};
function Slide32Funnel(props) {
  const {
      copy = SLIDE32FUNNEL_COPY,
      stagesData = XHSFN_STAGES,
    stageCount = 5,
    chartVariant = 'funnel',
    focusEnabled = true,
    focusIndex = 4,
    showConversion = true,
    showStageIndex = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const count = Math.max(3, Math.min(5, stageCount));
  const stages = stagesData.slice(0, count);
  const focus = Math.max(1, Math.min(count, focusIndex)) - 1;
  const isBars = chartVariant === 'bars';
  const hotColor = (stages[focus] && stages[focus].color) || '#FF9FE2';
  // 每层顶宽 / 底宽（底宽 = 下一层顶宽，末层用 XHSFN_BOTW）
  const botW = (i) => (i < count - 1 ? stages[i + 1].topW : XHSFN_BOTW);
  const maxW = stages[0].topW;

  return (
    <section className="xhs-base xhsFn-root" data-label="资本漏斗" data-screen-label="资本漏斗"
      style={{ '--c': hotColor }}>
      <style>{XHSFN_CSS}</style>

      <header className="xhsFn-head">
        <div className="xhsFn-kicker">{copy.text001}</div>
        <h2 className="xhsFn-title">{copy.text002}<HL color={hotColor} variant={hlStyle} tilt={hlTilt}>{copy.text003}</HL>
        </h2>
        <p className="xhsFn-sub">{copy.text004}</p>
      </header>

      <div className={'xhsFn-stage' + (isBars ? ' is-bars' : ' is-funnel')}>
        {stages.map((s, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          const tW = s.topW, bW = botW(i);
          const clip = `polygon(${50 - tW / 2}% 0, ${50 + tW / 2}% 0, ${50 + bW / 2}% 100%, ${50 - bW / 2}% 100%)`;
          return (
            <div key={i} className={'xhsFn-row' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.color }}>
              <div className="xhsFn-bandCell">
                {isBars ? (
                  <div className="xhsFn-bar" style={{ width: (s.topW / maxW) * 100 + '%' }}>
                    {showStageIndex && <span className="xhsFn-barIdx">{String(i + 1).padStart(2, '0')}</span>}
                  </div>
                ) : (
                  <div className="xhsFn-band" style={{ clipPath: clip, WebkitClipPath: clip }}>
                    {showStageIndex && <span className="xhsFn-idx">{String(i + 1).padStart(2, '0')}</span>}
                  </div>
                )}
              </div>

              <div className="xhsFn-label">
                <div className="xhsFn-count"><span className="xhsFn-num">{s.count}</span><i>{s.suffix}</i><span className="xhsFn-unit">{copy.text005}</span></div>
                <div className="xhsFn-name">{s.name}</div>
                <div className="xhsFn-sub2">{s.sub}</div>
              </div>

              {showConversion && i > 0 && (
                <span className="xhsFn-conv">
                  <span className="xhsFn-convArr" aria-hidden="true">{copy.text006}</span>
                  <span className="xhsFn-convPct">{s.conv}</span>
                  <span className="xhsFn-convLab">{copy.text007}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="xhsFn-caption">{copy.text008}</div>

      {showDecorations && (
        <React.Fragment>
          <FnSpark size={26} color="#27E021" style={{ position: 'absolute', left: 90, top: 196 }} />
          <FnSpark size={18} color="#15A7F0" style={{ position: 'absolute', right: 120, bottom: 110 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSFN_CSS = `
  .xhsFn-root{ padding:74px 110px 52px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsFn-head{ flex:0 0 auto; margin-bottom:16px; }
  .xhsFn-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsFn-title{ margin:0; font-size:56px; font-weight:900; color:#fff; line-height:1.1; display:flex; align-items:center; flex-wrap:wrap; }
  .xhsFn-sub{ margin:16px 0 0; font-size:25px; line-height:1.6; color:#9a9a9a; font-weight:500; max-width:1360px; }

  .xhsFn-stage{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; margin-top:8px; }

  .xhsFn-row{ position:relative; flex:1 1 0; min-height:0; display:grid; grid-template-columns:1fr 560px; align-items:stretch; column-gap:48px;
    transition:opacity .3s ease, filter .3s ease; }
  .xhsFn-row.is-dim{ opacity:.55; filter:saturate(.7); }

  .xhsFn-bandCell{ position:relative; min-width:0; display:flex; align-items:stretch; }
  .xhsFn-band{ position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:linear-gradient(160deg, color-mix(in srgb, var(--c) 92%, #fff), color-mix(in srgb, var(--c) 60%, #000));
    transition:filter .3s ease; }
  .xhsFn-row.is-hot .xhsFn-band{ filter:brightness(1.12) saturate(1.12)
    drop-shadow(0 0 38px color-mix(in srgb, var(--c) 55%, transparent)); }
  .xhsFn-idx{ font-family:"Space Mono",monospace; font-size:64px; font-weight:700; color:rgba(0,0,0,.32);
    line-height:1; user-select:none; }

  /* 横向柱状变体 */
  .xhsFn-bar{ height:64%; align-self:center; border-radius:0 16px 16px 0; display:flex; align-items:center; padding-left:26px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 58%, #000), var(--c));
    box-shadow:0 0 28px color-mix(in srgb, var(--c) 38%, transparent), inset 0 3px 0 rgba(255,255,255,.4);
    transition:filter .3s ease; }
  .xhsFn-row.is-hot .xhsFn-bar{ filter:brightness(1.12) saturate(1.1); }
  .xhsFn-barIdx{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:rgba(0,0,0,.4); }

  .xhsFn-label{ display:flex; flex-direction:column; justify-content:center; gap:3px; }
  .xhsFn-count{ display:flex; align-items:baseline; gap:3px; line-height:.9; }
  .xhsFn-num{ font-family:"Space Mono",monospace; font-size:62px; font-weight:700; color:var(--c);
    text-shadow:0 0 22px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsFn-count i{ font-style:normal; font-family:"Space Mono",monospace; font-size:40px; font-weight:700; color:var(--c); }
  .xhsFn-unit{ font-size:24px; font-weight:700; color:#8f8f8f; margin-left:6px; align-self:center; }
  .xhsFn-name{ font-size:32px; font-weight:900; color:#fff; margin-top:6px; }
  .xhsFn-sub2{ font-family:"Space Mono",monospace; font-size:18px; letter-spacing:.04em; color:#7c7c7c; }

  .xhsFn-conv{ position:absolute; left:50%; top:0; transform:translate(-50%,-50%); z-index:4;
    display:flex; align-items:center; gap:9px; padding:7px 18px 7px 12px; border-radius:999px;
    background:#0c0c0e; border:1.5px solid rgba(255,255,255,.16);
    box-shadow:0 8px 22px rgba(0,0,0,.6); }
  .xhsFn-convArr{ font-size:14px; color:#8a8a8a; }
  .xhsFn-convPct{ font-family:"Space Mono",monospace; font-size:24px; font-weight:700; color:#fff; }
  .xhsFn-convLab{ font-size:16px; font-weight:600; color:#8a8a8a; }

  .xhsFn-caption{ flex:0 0 auto; margin-top:14px; font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'funnel',
  label: '资本漏斗',
  Component: Slide32Funnel,
  defaults: {
      copy: SLIDE32FUNNEL_COPY,
      stagesData: XHSFN_STAGES,
    ...hlDefaults,
    stageCount: 5,
    chartVariant: 'funnel',
    focusEnabled: true,
    focusIndex: 4,
    showConversion: true,
    showStageIndex: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }], default: SLIDE32FUNNEL_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'stagesData', type: 'list', label: 'stagesData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "sub", label: "sub" }, { key: "count", label: "count" }, { key: "suffix", label: "suffix" }, { key: "conv", label: "conv" }, { key: "color", label: "color" }, { key: "topW", label: "topW" }], default: XHSFN_STAGES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'stageCount', type: 'slider', label: '层级数量', min: 3, max: 5, step: 1, default: 5, desc: '漏斗层级数量' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['funnel', 'bars'], optionLabels: ['漏斗', '横向柱'], default: 'funnel', desc: '梯形漏斗 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一层级' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 5, step: 1, default: 4, maxFromKey: 'stageCount', showIf: (v) => v.focusEnabled, desc: '被高亮层级的序号' },
    { key: 'showConversion', type: 'toggle', label: '层级转化率', default: true, desc: '层级间通过率显隐' },
    { key: 'showStageIndex', type: 'toggle', label: '层级编号', default: true, desc: '漏斗内层级编号(funnel/bars)' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒 / 圆环等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide32Funnel.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide32Funnel;
