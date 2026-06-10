/*
 * Slide61Scorecards — 资本大年·计分卡（大数字页 · KPI scorecard 网格，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsScr- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 BigNumber（单巨数+支撑卡）/ Versus（两数对峙）/ StatTrio（三数并置）互补：
 * 本页是「四联计分卡」——2×2(或一行) KPI 卡，每张：巨数 + 单位 + 标签 + 趋势徽标 + 一句注脚，
 * 像仪表盘一样一屏读完资本大年的四组头条。数据沿用全篇口径（970 / 97 / ≈1/3 / ~10）。
 * 数据为调研整理与推演（报告 摘要 · 示意）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  statCount       number 计分卡数量(2–4)         默认 4
 *  layoutVariant   enum   排布                     默认 'grid' 可选 'grid'|'row'
 *  focusEnabled    bool   重点卡高亮开关            默认 false
 *  focusIndex      number 重点卡序号(从1起)        默认 1   范围 1–statCount
 *  showDelta       bool   趋势徽标显隐             默认 true
 *  showContext     bool   卡片注脚一句显隐          默认 true
 *  showDecorations bool   星芒等点缀显隐           默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide61Scorecards, { defaults, controls } from './Slide61Scorecards.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 四张计分卡（写死）· 品牌四色
const XHSSCR_CARDS = [
  { eyebrow: 'TOTAL · 总额', num: '970', unit: '亿美元', label: '全年 AI 初创吸纳风投',
    delta: { dir: 'up', txt: '创历史新高' }, ctx: '平均单笔约 10 亿美元，头部标的高度追捧', color: '#15A7F0' },
  { eyebrow: 'MEGA-DEALS · 大额事件', num: '97', unit: '笔', label: '单笔 ≥1 亿美元的融资',
    delta: { dir: 'up', txt: '同比显著放量' }, ctx: '资金向少数巨型轮次集中', color: '#27E021' },
  { eyebrow: 'SHARE · 市场占比', num: '≈1/3', unit: '', label: '占全美风险投资总额',
    delta: { dir: 'flat', txt: '资本虹吸' }, ctx: 'AI 单一主题吸走近三分之一弹药', color: '#FFC700' },
  { eyebrow: 'AVG TICKET · 单笔均值', num: '10', unit: '亿美元', label: '大额轮次平均规模',
    delta: { dir: 'up', txt: '持续大额化' }, ctx: '从「百万级」迈入「十亿级」叙事', color: '#FF9FE2' },
];

const DELTA_SYM = { up: '▲', down: '▼', flat: '=' };

function ScrSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE61SCORECARDS_COPY = {
  text001: "2024 资本大年 · SCORECARD",
  text002: "四个数字，读懂这场",
  text003: "资本大年",
  text004: "数据为调研整理与推演 · 口径＝2024 全年美国 ≥1 亿美元 AI 融资事件汇总（示意）",
};
function Slide61Scorecards(props) {
  const {
      copy = SLIDE61SCORECARDS_COPY,
      cardsData = XHSSCR_CARDS,
      deltaSymData = DELTA_SYM,
    statCount = 4,
    layoutVariant = 'grid',
    focusEnabled = false,
    focusIndex = 1,
    showDelta = true,
    showContext = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(4, statCount));
  const cards = cardsData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;
  const isRow = layoutVariant === 'row' || n === 2;
  const gridStyle = isRow
    ? { gridTemplateColumns: `repeat(${n}, 1fr)`, gridAutoRows: '1fr' }
    : { gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: n > 2 ? 'repeat(2, 1fr)' : '1fr' };

  return (
    <section className="xhs-base xhsScr-root" data-label="资本计分卡" data-screen-label="资本计分卡">
      <style>{XHSSCR_CSS}</style>

      <header className="xhsScr-head">
        <div className="xhsScr-kicker">{copy.text001}</div>
        <h2 className="xhsScr-title">{copy.text002}<HL color="#FFC700" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className={'xhsScr-grid' + (isRow ? ' is-row' : '')} style={gridStyle}>
        {cards.map((c, i) => {
          const hot = focusEnabled && i === focus;
          const dim = focusEnabled && i !== focus;
          return (
            <div key={i} className={'xhsScr-card' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': c.color }}>
              <div className="xhsScr-eyebrow">{c.eyebrow}</div>
              <div className="xhsScr-numRow">
                <span className="xhsScr-num">{c.num}</span>
                {c.unit && <span className="xhsScr-unit">{c.unit}</span>}
              </div>
              <div className="xhsScr-label">{c.label}</div>
              {showDelta && (
                <span className={'xhsScr-pill xhsScr-pill--' + c.delta.dir}>
                  <i>{deltaSymData[c.delta.dir]}</i>{c.delta.txt}
                </span>
              )}
              {showContext && <div className="xhsScr-ctx">{c.ctx}</div>}
              <span className="xhsScr-ghost">{String(i + 1).padStart(2, '0')}</span>
            </div>
          );
        })}
      </div>

      <div className="xhsScr-caption">{copy.text004}</div>

      {showDecorations && (
        <React.Fragment>
          <ScrSpark size={24} color="#15A7F0" style={{ position: 'absolute', right: 96, top: 150 }} />
          <ScrSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 92 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSCR_CSS = `
  .xhsScr-root{ padding:74px 110px 56px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsScr-head{ flex:0 0 auto; margin-bottom:26px; }
  .xhsScr-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsScr-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsScr-grid{ flex:1 1 auto; min-height:0; display:grid; gap:24px; }

  .xhsScr-card{ position:relative; overflow:hidden; min-width:0; display:flex; flex-direction:column; justify-content:center;
    padding:38px 44px; border-radius:24px;
    background:linear-gradient(150deg, color-mix(in srgb, var(--c) 15%, #131313), #0b0b0b 70%);
    border:1.5px solid color-mix(in srgb, var(--c) 40%, transparent);
    transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s, transform .3s; }
  .xhsScr-card::after{ content:""; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
    background:linear-gradient(135deg, color-mix(in srgb, var(--c) 16%, transparent), transparent 44%); }
  .xhsScr-card.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsScr-card.is-hot{ border-color:var(--c); box-shadow:0 0 60px color-mix(in srgb, var(--c) 28%, transparent); transform:translateY(-3px); }

  .xhsScr-eyebrow{ font-family:"Space Mono",monospace; font-size:17px; font-weight:700; letter-spacing:.1em;
    color:color-mix(in srgb, var(--c) 75%, #fff); margin-bottom:10px; }
  .xhsScr-numRow{ display:flex; align-items:baseline; gap:14px; line-height:.92; }
  .xhsScr-num{ font-family:"Space Mono",monospace; font-size:128px; font-weight:700; color:#fff; letter-spacing:-.02em;
    font-variant-numeric:tabular-nums; text-shadow:0 0 44px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsScr-unit{ font-size:30px; font-weight:800; color:#cfcfcf; }
  .xhsScr-label{ margin-top:8px; font-size:25px; font-weight:700; color:#e6e6e6; }

  .xhsScr-pill{ align-self:flex-start; display:inline-flex; align-items:center; gap:8px; margin-top:16px;
    font-family:"Space Mono",monospace; font-size:19px; font-weight:700; padding:7px 17px; border-radius:999px; white-space:nowrap; }
  .xhsScr-pill i{ font-style:normal; }
  .xhsScr-pill--up{ color:#06140f; background:#27E021; box-shadow:0 0 18px rgba(39,224,33,.38), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsScr-pill--down{ color:#1a0713; background:#FF9FE2; box-shadow:0 0 18px rgba(255,159,226,.38), inset 0 1px 0 rgba(255,255,255,.5); }
  .xhsScr-pill--flat{ color:#dcdcdc; background:#1c1c1c; border:1.5px solid color-mix(in srgb, var(--c) 36%, transparent); }

  .xhsScr-ctx{ margin-top:14px; font-size:20px; font-weight:500; line-height:1.4; color:#9a9a9a; max-width:34ch; }

  .xhsScr-ghost{ position:absolute; right:26px; top:14px; font-family:"Space Mono",monospace; font-size:96px; font-weight:700;
    line-height:1; color:transparent; -webkit-text-stroke:2px color-mix(in srgb, var(--c) 26%, transparent); pointer-events:none; user-select:none; }

  /* 一行排布时数字略收，避免拥挤 */
  .xhsScr-grid.is-row .xhsScr-card{ padding:34px 32px; }
  .xhsScr-grid.is-row .xhsScr-num{ font-size:96px; }
  .xhsScr-grid.is-row .xhsScr-ghost{ font-size:72px; }

  .xhsScr-caption{ flex:0 0 auto; margin-top:22px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'scorecards',
  label: '资本计分卡',
  Component: Slide61Scorecards,
  defaults: {
      copy: SLIDE61SCORECARDS_COPY,
      cardsData: XHSSCR_CARDS,
      deltaSymData: DELTA_SYM,
    ...hlDefaults,
    statCount: 4,
    layoutVariant: 'grid',
    focusEnabled: false,
    focusIndex: 1,
    showDelta: true,
    showContext: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }], default: SLIDE61SCORECARDS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'cardsData', type: 'list', label: 'cardsData', itemLabel: '数据', fields: [{ key: "eyebrow", label: "eyebrow" }, { key: "num", label: "num" }, { key: "unit", label: "unit" }, { key: "label", label: "label" }, { key: "ctx", label: "ctx" }, { key: "color", label: "color" }], default: XHSSCR_CARDS, desc: '默认数据内容' },
    { key: 'deltaSymData', type: 'list', label: 'deltaSymData', itemLabel: '数据', single: true, fields: [{ key: "up", label: "up" }, { key: "down", label: "down" }, { key: "flat", label: "flat" }], default: DELTA_SYM, desc: '默认数据内容' },
    ...hlControls,
    { key: 'statCount', type: 'slider', label: '计分卡数', min: 2, max: 4, step: 1, default: 4, desc: '展示的计分卡数量' },
    { key: 'layoutVariant', type: 'radio', label: '排布', options: ['grid', 'row'], optionLabels: ['2×2 网格', '一行排开'], default: 'grid', desc: '网格 / 一行（2 张自动一行）' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, desc: '是否高亮某一张卡' },
    { key: 'focusIndex', type: 'slider', label: '重点卡序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'statCount', showIf: (v) => v.focusEnabled, desc: '被高亮卡的序号' },
    { key: 'showDelta', type: 'toggle', label: '趋势徽标', default: true, desc: '卡内趋势徽标' },
    { key: 'showContext', type: 'toggle', label: '卡片注脚', default: true, desc: '卡片底部一句注脚' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide61Scorecards.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide61Scorecards;
