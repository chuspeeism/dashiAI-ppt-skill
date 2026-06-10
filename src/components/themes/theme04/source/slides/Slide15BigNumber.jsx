/*
 * Slide15BigNumber — 大数字页（巨型主数字 + 支撑数据卡）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsBn- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  statCount       number 支撑数据卡数量       默认 3   可选 0–3
 *  focusEnabled    bool   支撑卡重点高亮开关     默认 false
 *  focusIndex      number 重点卡序号(从1起)     默认 1
 *  showUnit        bool   主数字单位后缀显隐     默认 true
 *  showCaption     bool   底部说明文案显隐       默认 true
 *  showDecorations bool   装饰元素显隐          默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide15BigNumber, { defaults, controls } from './Slide15BigNumber.jsx'
 */
import React from 'react';

const XHSBN_ACCENT = '#27E021';
const XHSBN_STATS = [
  { value: '≈1/3', label: '占美国全部风险投资', color: '#15A7F0' },
  { value: '97', unit: '笔', label: '单笔 ≥1 亿美元事件', color: '#FFC700' },
  { value: '≈10', unit: '亿', label: '平均单笔融资金额', color: '#FF9FE2' },
];

function BnSpark({ size = 22, color = '#fff', style }) {
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

function Slide15BigNumber(props) {
  const {
    statCount = 3,
    focusEnabled = false,
    focusIndex = 1,
    showUnit = true,
    showCaption = true,
    showDecorations = true,
    // 文案
    kicker = 'MARKET SCALE · 资本大年',
    pre = '2024 全年 AI 初创吸纳风投',
    mainValue = '970',
    mainUnit = '亿美元',
    post = '创历史新高 · 平均单笔约 10 亿美元，市场对头部标的高度追捧',
    caption = '数据口径：2024 全年公开披露的 ≥1 亿美元融资事件 · 占美国 VC 近三分之一',
    // 数据
    stats = XHSBN_STATS,
  } = props;

  const src = Array.isArray(stats) ? stats : XHSBN_STATS;
  const count = Math.max(0, Math.min(src.length, statCount));
  const shown = src.slice(0, count);
  const focus = Math.max(1, Math.min(Math.max(1, count), focusIndex)) - 1;

  return (
    <section className="xhs-base xhsBn-root" data-label="大数字" style={{ '--c': XHSBN_ACCENT }}>
      <style>{XHSBN_CSS}</style>

      <div className="xhsBn-kicker">{kicker}</div>

      <div className="xhsBn-hero">
        <span className="xhsBn-pre">{pre}</span>
        <div className="xhsBn-num">
          <span className="xhsBn-digits">{mainValue}</span>
          {showUnit && <span className="xhsBn-unit">{mainUnit}</span>}
        </div>
        <span className="xhsBn-post">{post}</span>
      </div>

      {count > 0 && (
        <div className="xhsBn-stats" style={{ '--n': count }}>
          {shown.map((s, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            return (
              <div key={i} className={'xhsBn-stat' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--sc': s.color }}>
                <div className="xhsBn-stat-val">
                  {s.value}{s.unit && <span className="xhsBn-stat-unit">{s.unit}</span>}
                </div>
                <div className="xhsBn-stat-label">{s.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {showCaption && (
        <div className="xhsBn-caption">{caption}</div>
      )}

      {showDecorations && (
        <React.Fragment>
          <BnSpark size={34} color={XHSBN_ACCENT} style={{ position: 'absolute', left: 300, top: 250 }} />
          <BnSpark size={22} color="#FFC700" style={{ position: 'absolute', right: 330, top: 286 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 280, top: 360, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.85)', boxShadow: '0 0 22px rgba(255,255,255,.2)' }} />
          <BnSpark size={18} color="#FF9FE2" style={{ position: 'absolute', left: 360, bottom: 270 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSBN_CSS = `
  .xhsBn-root{ padding:96px; position:relative; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; }
  .xhsBn-root::before{ content:''; position:absolute; inset:0;
    background:radial-gradient(900px 620px at 50% 38%, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%);
    pointer-events:none; }
  .xhsBn-kicker{ position:absolute; top:108px; left:0; right:0; text-align:center;
    font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.2em; color:#7c7c7c; }

  .xhsBn-hero{ position:relative; display:flex; flex-direction:column; align-items:center; }
  .xhsBn-pre{ font-size:32px; font-weight:700; color:#cfcfcf; margin-bottom:10px; white-space:nowrap; }
  .xhsBn-num{ display:flex; align-items:flex-end; gap:26px; }
  .xhsBn-digits{ font-family:"Space Mono",monospace; font-weight:700; font-size:380px; line-height:.82;
    letter-spacing:-.03em; color:#fff;
    text-shadow:0 0 70px color-mix(in srgb, var(--c) 55%, transparent), 0 0 140px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsBn-unit{ font-size:80px; font-weight:900; color:var(--c); padding-bottom:46px;
    text-shadow:0 0 36px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsBn-post{ margin-top:14px; font-size:27px; font-weight:500; color:#9a9a9a; max-width:1000px; }

  .xhsBn-stats{ margin-top:62px; display:grid; grid-template-columns:repeat(var(--n),minmax(0,300px)); gap:30px; }
  .xhsBn-stat{ padding:32px 36px; border-radius:22px; background:linear-gradient(160deg,#181818,#0e0e0e);
    border:1.5px solid rgba(255,255,255,.08); text-align:left;
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsBn-stat.is-dim{ opacity:.5; filter:saturate(.7); }
  .xhsBn-stat.is-hot{ transform:translateY(-12px); border-color:var(--sc);
    box-shadow:0 0 60px color-mix(in srgb, var(--sc) 30%, transparent); }
  .xhsBn-stat-val{ font-family:"Space Mono",monospace; font-size:78px; font-weight:700; line-height:1; color:var(--sc);
    text-shadow:0 0 30px color-mix(in srgb, var(--sc) 40%, transparent); display:flex; align-items:baseline; }
  .xhsBn-stat-unit{ font-size:34px; font-weight:700; margin-left:8px; }
  .xhsBn-stat-label{ margin-top:16px; font-size:24px; font-weight:600; color:#b0b0b0; }

  .xhsBn-caption{ position:absolute; left:0; right:0; bottom:78px; text-align:center;
    font-size:23px; color:#6f6f6f; font-weight:500; }
`;

const META = {
  id: 'bignumber',
  label: '大数字',
  Component: Slide15BigNumber,
  defaults: {
    statCount: 3,
    focusEnabled: false,
    focusIndex: 1,
    showUnit: true,
    showCaption: true,
    showDecorations: true,
    kicker: 'MARKET SCALE · 资本大年',
    pre: '2024 全年 AI 初创吸纳风投',
    mainValue: '970',
    mainUnit: '亿美元',
    post: '创历史新高 · 平均单笔约 10 亿美元，市场对头部标的高度追捧',
    caption: '数据口径：2024 全年公开披露的 ≥1 亿美元融资事件 · 占美国 VC 近三分之一',
    stats: XHSBN_STATS,
  },
  controls: [
    { key: 'statCount', type: 'slider', label: '支撑卡数量', min: 0, max: 3, step: 1, default: 3, desc: '主数字下方支撑数据卡数量' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: false, showIf: (v) => v.statCount > 0, desc: '是否高亮某一张支撑卡' },
    { key: 'focusIndex', type: 'slider', label: '重点序号', min: 1, max: 3, step: 1, default: 1, maxFromKey: 'statCount', showIf: (v) => v.statCount > 0 && v.focusEnabled, desc: '被高亮支撑卡的序号' },
    { key: 'showUnit', type: 'toggle', label: '单位后缀', default: true, desc: '主数字「亿美元」单位' },
    { key: 'showCaption', type: 'toggle', label: '底部说明', default: true, desc: '底部数据口径说明' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'kicker', type: 'text', label: '眉标', default: 'MARKET SCALE · 资本大年', desc: '顶部 kicker' },
    { key: 'pre', type: 'text', label: '主数字前句', default: '2024 全年 AI 初创吸纳风投', desc: '主数字上方引言' },
    { key: 'mainValue', type: 'text', label: '主数字', default: '970', desc: '巨型主数字' },
    { key: 'mainUnit', type: 'text', label: '主数字单位', default: '亿美元', desc: '单位后缀', showIf: (v) => v.showUnit },
    { key: 'post', type: 'textarea', label: '主数字后句', rows: 2, default: '创历史新高 · 平均单笔约 10 亿美元，市场对头部标的高度追捧', desc: '主数字下方说明' },
    { key: 'caption', type: 'textarea', label: '底部说明', rows: 2, default: '数据口径：2024 全年公开披露的 ≥1 亿美元融资事件 · 占美国 VC 近三分之一', desc: '数据口径说明', showIf: (v) => v.showCaption },
    { type: 'section', label: '数据 · 支撑卡' },
    {
      key: 'stats', type: 'list', label: '支撑卡', itemLabel: '卡', countFromKey: 'statCount',
      fields: [{ key: 'value', label: '数值' }, { key: 'unit', label: '单位' }, { key: 'label', label: '标签' }, { key: 'color', label: '颜色' }],
      default: XHSBN_STATS, desc: '支撑数据卡：数值 / 单位 / 标签 / 主色',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide15BigNumber.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide15BigNumber;
