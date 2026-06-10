/*
 * Slide35Versus — 对比双数字（大数字 · 两笔头部融资正面对决）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsVs- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 两个巨型数字左右对峙，中缝 VS 徽章；可单独高亮一侧，或显示差额条。
 * 与单数字页 Slide15BigNumber 互补（本页强调「对比」而非单点之大）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  metricCount     number 每侧支撑指标行数      默认 2   可选 0–2
 *  focusSide       enum   高亮侧             默认 'none' 可选 'none'|'left'|'right'
 *  showVsBadge     bool   中缝 VS 徽章显隐      默认 true
 *  showDelta       bool   底部差额对比条显隐     默认 true
 *  showUnit        bool   主数字单位后缀显隐     默认 true
 *  showDecorations bool   星芒等点缀显隐        默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide35Versus, { defaults, controls } from './Slide35Versus.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 两侧主体（写死）：名称、巨型数字、单位、副标、主色、支撑指标
const XHSVS_SIDES = [
  {
    key: 'left', name: 'OpenAI', initial: 'O', color: '#15A7F0',
    big: '66', unit: '亿', sub: '2024 单笔融资额 / 美元',
    metrics: [
      { v: '1570', u: '亿', l: '投后估值 / 美元' },
      { v: 'No.1', u: '', l: '全年最大单笔' },
    ],
  },
  {
    key: 'right', name: 'xAI', initial: 'x', color: '#FFC700',
    big: '60', unit: '亿', sub: '2024 单笔融资额 / 美元',
    metrics: [
      { v: '240', u: '亿', l: '投后估值 / 美元' },
      { v: '18', u: '月', l: '成立到 B 轮' },
    ],
  },
];

function VsSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE35VERSUS_COPY = {
  text001: "HEAD TO HEAD · 两笔头部融资正面对决",
  text002: "两强相争，",
  text003: "只差 6 亿美元",
  text004: "VS",
  text005: "OpenAI · 66 亿",
  text006: "xAI · 60 亿",
  text007: "两笔交易体量近乎并驾齐驱，头部资金高度集中于通用大模型「第一梯队」。",
};
function Slide35Versus(props) {
  const {
      copy = SLIDE35VERSUS_COPY,
      sidesData = XHSVS_SIDES,
    metricCount = 2,
    focusSide = 'none',
    showVsBadge = true,
    showDelta = true,
    showUnit = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const mcount = Math.max(0, Math.min(2, metricCount));

  return (
    <section className="xhs-base xhsVs-root" data-label="对比双数字" data-screen-label="对比双数字">
      <style>{XHSVS_CSS}</style>

      <header className="xhsVs-head">
        <div className="xhsVs-kicker">{copy.text001}</div>
        <h2 className="xhsVs-title">{copy.text002}<HL color="#FF9FE2" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      <div className="xhsVs-arena">
        {sidesData.map((s) => {
          const hot = focusSide !== 'none' && focusSide === s.key;
          const dim = focusSide !== 'none' && focusSide !== s.key;
          return (
            <div key={s.key}
              className={'xhsVs-side is-' + s.key + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
              style={{ '--c': s.color }}>
              <div className="xhsVs-side-head">
                <span className="xhsVs-badge">{s.initial}</span>
                <span className="xhsVs-name">{s.name}</span>
              </div>
              <div className="xhsVs-num">
                <span className="xhsVs-digits">{s.big}</span>
                {showUnit && <span className="xhsVs-unit">{s.unit}</span>}
              </div>
              <div className="xhsVs-sub">{s.sub}</div>
              {mcount > 0 && (
                <div className="xhsVs-metrics">
                  {s.metrics.slice(0, mcount).map((m, i) => (
                    <div key={i} className="xhsVs-metric">
                      <span className="xhsVs-metric-v">{m.v}{m.u && <i>{m.u}</i>}</span>
                      <span className="xhsVs-metric-l">{m.l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {showVsBadge && (
          <div className="xhsVs-vs" aria-hidden="true"><span>{copy.text004}</span></div>
        )}
      </div>

      {showDelta && (
        <div className="xhsVs-delta">
          <div className="xhsVs-delta-bars">
            <span className="xhsVs-bar is-left" style={{ '--w': '100%', '--c': '#15A7F0' }}><i>{copy.text005}</i></span>
            <span className="xhsVs-bar is-right" style={{ '--w': '91%', '--c': '#FFC700' }}><i>{copy.text006}</i></span>
          </div>
          <div className="xhsVs-delta-note">{copy.text007}</div>
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <VsSpark size={26} color="#27E021" style={{ position: 'absolute', left: 96, top: 150 }} />
          <VsSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 120, bottom: 120 }} />
          <span aria-hidden="true" style={{ position: 'absolute', right: 150, top: 160, width: 44, height: 44, borderRadius: '50%', border: '5px solid rgba(255,255,255,.82)', boxShadow: '0 0 22px rgba(255,255,255,.2)' }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSVS_CSS = `
  .xhsVs-root{ padding:58px 110px 54px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsVs-head{ flex:0 0 auto; text-align:center; margin-bottom:26px; }
  .xhsVs-kicker{ font-family:"Space Mono",monospace; font-size:23px; letter-spacing:.16em; color:#7c7c7c; margin-bottom:14px; }
  .xhsVs-title{ margin:0; font-size:48px; font-weight:900; color:#fff; line-height:1.04; white-space:nowrap; }

  .xhsVs-arena{ flex:1 1 auto; min-height:0; position:relative; display:grid; grid-template-columns:1fr 1fr; gap:36px;
    align-items:stretch; }
  .xhsVs-side{ position:relative; border-radius:28px; padding:34px 46px; box-sizing:border-box;
    background:linear-gradient(160deg,#161616,#0c0c0c); border:1.5px solid rgba(255,255,255,.08);
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; overflow:hidden;
    box-shadow:0 24px 56px rgba(0,0,0,.5); transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1), border-color .3s, box-shadow .3s; }
  .xhsVs-side::before{ content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(120% 90% at 50% 18%, color-mix(in srgb, var(--c) 20%, transparent), transparent 64%); }
  .xhsVs-side.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsVs-side.is-hot{ border-color:var(--c); transform:translateY(-8px);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 30%, transparent); }

  .xhsVs-side-head{ position:relative; display:flex; align-items:center; gap:18px; }
  .xhsVs-badge{ width:58px; height:58px; border-radius:16px; display:flex; align-items:center; justify-content:center;
    font-family:"Space Mono",monospace; font-size:38px; font-weight:700; color:#000; background:var(--c);
    box-shadow:0 10px 26px color-mix(in srgb, var(--c) 40%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsVs-name{ font-size:44px; font-weight:900; color:#fff; letter-spacing:-.01em; }
  .xhsVs-num{ position:relative; display:flex; align-items:flex-end; gap:12px; margin-top:8px; }
  .xhsVs-digits{ font-family:"Space Mono",monospace; font-weight:700; font-size:196px; line-height:.82; letter-spacing:-.03em;
    color:#fff; text-shadow:0 0 60px color-mix(in srgb, var(--c) 50%, transparent), 0 0 130px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsVs-unit{ font-size:52px; font-weight:900; color:var(--c); padding-bottom:26px;
    text-shadow:0 0 30px color-mix(in srgb, var(--c) 48%, transparent); }
  .xhsVs-sub{ position:relative; font-size:22px; font-weight:600; color:#9a9a9a; white-space:nowrap; }

  .xhsVs-metrics{ position:relative; display:flex; gap:16px; margin-top:24px; width:100%; justify-content:center; }
  .xhsVs-metric{ flex:1; max-width:260px; padding:16px 20px; border-radius:16px; background:rgba(255,255,255,.035);
    border:1.5px solid rgba(255,255,255,.08); display:flex; flex-direction:column; gap:5px; align-items:center; text-align:center; }
  .xhsVs-metric-v{ font-family:"Space Mono",monospace; font-size:38px; font-weight:700; line-height:1; color:var(--c);
    text-shadow:0 0 20px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsVs-metric-v i{ font-style:normal; font-size:21px; font-weight:700; margin-left:3px; }
  .xhsVs-metric-l{ font-size:18px; font-weight:600; color:#9a9a9a; white-space:nowrap; }

  .xhsVs-vs{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); z-index:3;
    width:108px; height:108px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    background:linear-gradient(160deg,#1c1c1c,#0a0a0a); border:3px solid rgba(255,255,255,.16);
    box-shadow:0 0 0 10px #000, 0 18px 40px rgba(0,0,0,.6); }
  .xhsVs-vs span{ font-family:"Space Mono",monospace; font-size:42px; font-weight:700; color:#fff; letter-spacing:.04em;
    text-shadow:0 0 22px rgba(255,255,255,.35); }

  .xhsVs-delta{ flex:0 0 auto; margin-top:26px; display:flex; flex-direction:column; gap:12px; }
  .xhsVs-delta-bars{ display:flex; flex-direction:column; gap:11px; }
  .xhsVs-bar{ position:relative; height:42px; width:var(--w); border-radius:0 12px 12px 0; background:var(--c);
    display:flex; align-items:center; box-shadow:inset 0 2px 0 rgba(255,255,255,.45), 0 0 30px color-mix(in srgb, var(--c) 34%, transparent); }
  .xhsVs-bar i{ position:absolute; left:22px; font-style:normal; font-family:"Space Mono",monospace; font-size:22px;
    font-weight:700; color:#000; white-space:nowrap; }
  .xhsVs-delta-note{ font-size:22px; font-weight:500; color:#8e8e8e; text-align:center; }
`;

const META = {
  id: 'versus',
  label: '对比双数字',
  Component: Slide35Versus,
  defaults: {
      copy: SLIDE35VERSUS_COPY,
      sidesData: XHSVS_SIDES,
    ...hlDefaults,
    metricCount: 2,
    focusSide: 'none',
    showVsBadge: true,
    showDelta: true,
    showUnit: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE35VERSUS_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'sidesData', type: 'list', label: 'sidesData', itemLabel: '数据', fields: [{ key: "key", label: "key" }, { key: "name", label: "name" }, { key: "initial", label: "initial" }, { key: "color", label: "color" }, { key: "big", label: "big" }, { key: "unit", label: "unit" }, { key: "sub", label: "sub" }], default: XHSVS_SIDES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'metricCount', type: 'slider', label: '支撑指标', min: 0, max: 2, step: 1, default: 2, desc: '每侧支撑指标行数' },
    { key: 'focusSide', type: 'radio', label: '高亮侧', options: ['none', 'left', 'right'], optionLabels: ['不高亮', '左侧', '右侧'], default: 'none', desc: '高亮左 / 右某一侧' },
    { key: 'showVsBadge', type: 'toggle', label: 'VS 徽章', default: true, desc: '中缝 VS 徽章' },
    { key: 'showDelta', type: 'toggle', label: '差额对比条', default: true, desc: '底部两侧体量对比条' },
    { key: 'showUnit', type: 'toggle', label: '单位后缀', default: true, desc: '主数字「亿」单位' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide35Versus.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide35Versus;
