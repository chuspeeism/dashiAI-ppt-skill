/*
 * Slide56Manifesto — 宣言（金句页 · 全屏超大排版式核心判断 / THE THESIS）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsMf- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Statement（结论卡）/ QuoteImage（图文金句）/ Voices（观点墙）互补：本页是纯排版式
 * 「宣言」——背景巨型引号铺底 + 超大多行论断（关键词高亮）+ 署名，一句话钉住全篇主张。
 * 文本写死在组件内（报告核心结论），仅结构 / 样式 / 显隐通过 props 暴露。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)        默认 'green' green/yellow/blue/pink
 *  textAlign       enum   文案对齐               默认 'left' 可选 'left'|'center'
 *  showGhostMark    bool   背景巨型引号显隐         默认 true
 *  showSub         bool   论断下方支撑副句显隐      默认 true
 *  showAttribution bool   底部署名显隐            默认 true
 *  showRule        bool   署名前装饰短线显隐        默认 true
 *  showDecorations bool   星芒等点缀显隐           默认 true
 *
 * 迁移：import Slide56Manifesto, { defaults, controls } from './Slide56Manifesto.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSMF_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

function MfSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE56MANIFESTO_COPY = {
  text001: "“",
  text002: "核心判断 · THE THESIS",
  text003: "2024 不是 AI 的泡沫之年，",
  text004: "而是",
  text005: "资本用脚投票",
  text006: "的一年——",
  text007: "钱，正涌向能造出",
  text008: "下一代基础设施",
  text009: "的少数人。",
  text010: "970 亿美元、97 笔大额轮、近三分之一的美国风投——这一年的结论只有一句：",
  text011: "头部赢家通吃，资本不再撒胡椒面。",
  text012: "《2024 美国大额融资 AI 公司调研报告》",
  text013: "· 核心结论",
};
function Slide56Manifesto(props) {
  const {
      copy = SLIDE56MANIFESTO_COPY,
    accentTone = 'green',
    textAlign = 'left',
    showGhostMark = true,
    showSub = true,
    showAttribution = true,
    showRule = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const accent = XHSMF_TONES[accentTone] || XHSMF_TONES.green;
  const centered = textAlign === 'center';

  return (
    <section className={'xhs-base xhsMf-root' + (centered ? ' is-center' : '')}
      data-label="宣言金句" data-screen-label="宣言金句" style={{ '--c': accent }}>
      <style>{XHSMF_CSS}</style>

      {showGhostMark && <span className="xhsMf-ghost" aria-hidden="true">{copy.text001}</span>}

      <div className="xhsMf-inner">
        <div className="xhsMf-kicker">{copy.text002}</div>

        <h2 className="xhsMf-quote">{copy.text003}<br />{copy.text004}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{copy.text005}</HL>{copy.text006}<br />{copy.text007}<HL color={accent} variant={hlStyle} tilt={hlTilt}>{copy.text008}</HL>{copy.text009}</h2>

        {showSub && (
          <p className="xhsMf-sub">{copy.text010}<strong>{copy.text011}</strong>
          </p>
        )}

        {showAttribution && (
          <div className="xhsMf-attr">
            {showRule && <span className="xhsMf-rule" aria-hidden="true" />}
            <span className="xhsMf-attrTxt">{copy.text012}<i>{copy.text013}</i></span>
          </div>
        )}
      </div>

      {showDecorations && (
        <React.Fragment>
          <MfSpark size={28} color="#FFC700" style={{ position: 'absolute', right: 132, top: 150 }} />
          <MfSpark size={17} color="#15A7F0" style={{ position: 'absolute', left: 96, bottom: 120 }} />
          <span aria-hidden="true" className="xhsMf-ring" />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSMF_CSS = `
  .xhsMf-root{ padding:96px 130px 90px; position:relative; display:flex; flex-direction:column; justify-content:center;
    box-sizing:border-box; height:100%; overflow:hidden; }
  .xhsMf-root::before{ content:""; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(1100px 720px at 22% 30%, color-mix(in srgb, var(--c) 13%, transparent), transparent 66%); }
  .xhsMf-root.is-center::before{ background:radial-gradient(1100px 720px at 50% 36%, color-mix(in srgb, var(--c) 13%, transparent), transparent 66%); }

  .xhsMf-ghost{ position:absolute; left:60px; top:-120px; font-family:Georgia,"Times New Roman",serif;
    font-size:760px; line-height:1; font-weight:700; color:color-mix(in srgb, var(--c) 16%, transparent);
    text-shadow:0 0 80px color-mix(in srgb, var(--c) 12%, transparent); pointer-events:none; z-index:0; user-select:none; }
  .xhsMf-root.is-center .xhsMf-ghost{ left:50%; transform:translateX(-50%); }

  .xhsMf-inner{ position:relative; z-index:1; max-width:1480px; }
  .xhsMf-root.is-center .xhsMf-inner{ margin:0 auto; text-align:center; }

  .xhsMf-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.16em; color:var(--c);
    margin-bottom:30px; text-shadow:0 0 20px color-mix(in srgb, var(--c) 32%, transparent); }

  .xhsMf-quote{ margin:0; font-size:84px; font-weight:900; color:#fff; line-height:1.22; letter-spacing:-.005em;
    text-wrap:pretty; text-shadow:0 0 60px rgba(0,0,0,.5); }

  .xhsMf-sub{ margin:46px 0 0; font-size:30px; font-weight:600; color:#b4b4b4; line-height:1.5; max-width:1180px; text-wrap:pretty; }
  .xhsMf-root.is-center .xhsMf-sub{ margin-left:auto; margin-right:auto; }
  .xhsMf-sub strong{ color:#fff; font-weight:800; }

  .xhsMf-attr{ display:flex; align-items:center; gap:22px; margin-top:54px; }
  .xhsMf-root.is-center .xhsMf-attr{ justify-content:center; }
  .xhsMf-rule{ width:74px; height:4px; border-radius:999px; background:var(--c);
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsMf-attrTxt{ font-family:"Space Mono",monospace; font-size:23px; font-weight:700; letter-spacing:.03em; color:#dcdcdc; }
  .xhsMf-attrTxt i{ font-style:normal; color:#7c7c7c; }

  .xhsMf-ring{ position:absolute; right:200px; bottom:188px; width:46px; height:46px; border-radius:50%;
    border:5px solid rgba(255,255,255,.8); box-shadow:0 0 22px rgba(255,255,255,.2); pointer-events:none; }
`;

const META = {
  id: 'manifesto',
  label: '宣言金句',
  Component: Slide56Manifesto,
  defaults: {
      copy: SLIDE56MANIFESTO_COPY,
    ...hlDefaults,
    accentTone: 'green',
    textAlign: 'left',
    showGhostMark: true,
    showSub: true,
    showAttribution: true,
    showRule: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }], default: SLIDE56MANIFESTO_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调(通用命名)' },
    { key: 'textAlign', type: 'radio', label: '文案对齐', options: ['left', 'center'], optionLabels: ['靠左', '居中'], default: 'left', desc: '文案靠左 / 居中' },
    { key: 'showGhostMark', type: 'toggle', label: '背景引号', default: true, desc: '背景巨型引号' },
    { key: 'showSub', type: 'toggle', label: '支撑副句', default: true, desc: '论断下方支撑副句' },
    { key: 'showAttribution', type: 'toggle', label: '底部署名', default: true, desc: '底部署名' },
    { key: 'showRule', type: 'toggle', label: '署名短线', default: true, desc: '署名前装饰短线', showIf: (v) => v.showAttribution },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide56Manifesto.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide56Manifesto;
