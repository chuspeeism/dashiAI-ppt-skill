/*
 * Slide71Verdict — 重磅论断 + 圆形数据印章（金句 · 新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsVd- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Statement（结论卡）/ Manifesto（宣言）/ Voices（观点墙）/ QuoteImage（图文金句）互补：
 * 本页是「终审式论断」——左侧超大多行判断句（关键词高亮）+ 右侧一枚旋转「数据印章」
 * （同心环刻字 + 中心巨数盖戳），把全篇收成一句话 + 一个钢印般的核心数字。
 * 文本/数据写死（报告口径 970 亿 · 资本大年）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  accentTone      enum   主色调(通用命名)        默认 'yellow' 可选 green/yellow/blue/pink
 *  textAlign       enum   论断对齐               默认 'left' 可选 'left'|'center'
 *  showSeal        bool   圆形数据印章显隐         默认 true
 *  showGhostMark   bool   背景巨型引号显隐         默认 true
 *  showSub         bool   论断下支撑副句显隐       默认 true
 *  showAttribution bool   底部署名显隐            默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide71Verdict, { defaults, controls } from './Slide71Verdict.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSVD_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

function VdSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE71VERDICT_COPY = {
  text001: "”",
  text002: "终审判断 · THE VERDICT",
  text003: "这不是一次普通的风口，",
  text004: "而是一场",
  text005: "资本的总动员",
  text006: "钱、算力与共识，",
  text007: "同时压向了同一个方向。",
  text008: "970 亿美元在一年内涌入，把「AI 是否值得」的争论，直接改写成了「谁能上车」。",
  text009: "《2024 美国大额融资 AI 公司调研报告》· 总结",
  text010: "资本大年 · CONFIRMED",
  text011: "FUNDING YEAR · 2024",
  text012: "970",
  text013: "亿美元",
  text014: "★",
};
function Slide71Verdict(props) {
  const {
      copy = SLIDE71VERDICT_COPY,
    accentTone = 'yellow',
    textAlign = 'left',
    showSeal = true,
    showGhostMark = true,
    showSub = true,
    showAttribution = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const accent = XHSVD_TONES[accentTone] || XHSVD_TONES.yellow;
  const centered = textAlign === 'center';

  return (
    <section className={'xhs-base xhsVd-root' + (centered ? ' is-center' : '') + (showSeal ? '' : ' no-seal')}
      data-label="论断印章" data-screen-label="论断印章" style={{ '--c': accent }}>
      <style>{XHSVD_CSS}</style>

      {showGhostMark && <span className="xhsVd-ghost" aria-hidden="true">{copy.text001}</span>}

      <div className="xhsVd-text">
        <div className="xhsVd-kicker">{copy.text002}</div>
        <h2 className="xhsVd-quote">{copy.text003}<br />{copy.text004}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{copy.text005}</HL>——<br />{copy.text006}<br />{copy.text007}</h2>
        {showSub && (
          <p className="xhsVd-sub">{copy.text008}</p>
        )}
        {showAttribution && (
          <div className="xhsVd-attr">
            <span className="xhsVd-rule" aria-hidden="true" />
            <span className="xhsVd-attrTxt">{copy.text009}</span>
          </div>
        )}
      </div>

      {showSeal && (
        <div className="xhsVd-sealWrap" aria-hidden="true">
          <div className="xhsVd-seal">
            <span className="xhsVd-ring" />
            <span className="xhsVd-ringDash" />
            <span className="xhsVd-sealTop">{copy.text010}</span>
            <span className="xhsVd-sealBot">{copy.text011}</span>
            <div className="xhsVd-sealCore">
              <span className="xhsVd-sealNum">{copy.text012}</span>
              <span className="xhsVd-sealUnit">{copy.text013}</span>
            </div>
            <span className="xhsVd-star">{copy.text014}</span>
          </div>
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <VdSpark size={26} color="#27E021" style={{ position: 'absolute', left: 96, bottom: 120 }} />
          <VdSpark size={15} color="#15A7F0" style={{ position: 'absolute', right: centered ? 130 : 'auto', left: centered ? 'auto' : 880, top: 150 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSVD_CSS = `
  .xhsVd-root{ padding:74px 110px 70px; position:relative; display:grid; grid-template-columns:1.32fr 0.68fr; align-items:center; gap:50px;
    box-sizing:border-box; height:100%; overflow:hidden; }
  .xhsVd-root.no-seal{ grid-template-columns:1fr; }
  .xhsVd-root.is-center{ grid-template-columns:1fr; justify-items:center; text-align:center; }

  .xhsVd-ghost{ position:absolute; top:-130px; left:40px; font-family:"Space Mono",monospace; font-weight:700;
    font-size:620px; line-height:1; color:transparent; -webkit-text-stroke:3px rgba(255,255,255,.06); pointer-events:none; z-index:0; }
  .xhsVd-root.is-center .xhsVd-ghost{ left:50%; transform:translateX(-50%); }

  .xhsVd-text{ position:relative; z-index:1; min-width:0; }
  .xhsVd-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.16em; color:var(--c); margin-bottom:30px;
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsVd-quote{ margin:0; font-size:76px; font-weight:900; color:#fff; line-height:1.18; letter-spacing:.005em; text-wrap:pretty; }
  .xhsVd-sub{ margin:38px 0 0; font-size:28px; font-weight:600; color:#a8a8a8; line-height:1.5; max-width:920px; text-wrap:pretty; }
  .xhsVd-root.is-center .xhsVd-sub{ margin-left:auto; margin-right:auto; }
  .xhsVd-attr{ display:flex; align-items:center; gap:20px; margin-top:46px; }
  .xhsVd-root.is-center .xhsVd-attr{ justify-content:center; }
  .xhsVd-rule{ width:64px; height:3px; border-radius:2px; background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsVd-attrTxt{ font-family:"Space Mono",monospace; font-size:20px; letter-spacing:.04em; color:#8a8a8a; }

  /* —— 圆形数据印章 —— */
  .xhsVd-sealWrap{ position:relative; z-index:1; display:flex; align-items:center; justify-content:center; }
  .xhsVd-seal{ position:relative; width:400px; height:400px; border-radius:50%; transform:rotate(-9deg);
    display:flex; align-items:center; justify-content:center;
    background:radial-gradient(circle at 38% 32%, color-mix(in srgb, var(--c) 22%, #121212), #0a0a0a 72%);
    box-shadow:0 0 70px color-mix(in srgb, var(--c) 24%, transparent), inset 0 0 50px rgba(0,0,0,.6); }
  .xhsVd-ring{ position:absolute; inset:14px; border-radius:50%; border:5px solid var(--c);
    box-shadow:0 0 30px color-mix(in srgb, var(--c) 40%, transparent), inset 0 0 22px color-mix(in srgb, var(--c) 22%, transparent); }
  .xhsVd-ringDash{ position:absolute; inset:34px; border-radius:50%; border:2.5px dashed color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsVd-sealTop, .xhsVd-sealBot{ position:absolute; left:0; right:0; text-align:center;
    font-family:"Space Mono",monospace; font-size:21px; font-weight:700; letter-spacing:.14em; color:var(--c); }
  .xhsVd-sealTop{ top:58px; }
  .xhsVd-sealBot{ bottom:58px; }
  .xhsVd-sealCore{ display:flex; flex-direction:column; align-items:center; gap:2px; }
  .xhsVd-sealNum{ font-family:"Space Mono",monospace; font-size:128px; font-weight:700; line-height:.82; color:#fff;
    text-shadow:0 0 40px color-mix(in srgb, var(--c) 45%, transparent); }
  .xhsVd-sealUnit{ font-size:30px; font-weight:800; color:var(--c); letter-spacing:.06em; }
  .xhsVd-star{ position:absolute; top:104px; left:50%; transform:translateX(-50%); font-size:24px; color:var(--c);
    text-shadow:0 0 14px color-mix(in srgb, var(--c) 50%, transparent); }
`;

const META = {
  id: 'verdict',
  label: '论断印章',
  Component: Slide71Verdict,
  defaults: {
      copy: SLIDE71VERDICT_COPY,
    ...hlDefaults,
    accentTone: 'yellow',
    textAlign: 'left',
    showSeal: true,
    showGhostMark: true,
    showSub: true,
    showAttribution: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }, { key: "text014", label: "text014" }], default: SLIDE71VERDICT_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    ...hlControls,
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'yellow', desc: '页面主色调(通用命名)' },
    { key: 'textAlign', type: 'radio', label: '论断对齐', options: ['left', 'center'], optionLabels: ['靠左', '居中'], default: 'left', desc: '论断靠左(带印章) / 居中(纯文字)' },
    { key: 'showSeal', type: 'toggle', label: '数据印章', default: true, showIf: (v) => v.textAlign === 'left', desc: '右侧圆形数据印章' },
    { key: 'showGhostMark', type: 'toggle', label: '背景引号', default: true, desc: '背景巨型引号' },
    { key: 'showSub', type: 'toggle', label: '支撑副句', default: true, desc: '论断下方支撑副句' },
    { key: 'showAttribution', type: 'toggle', label: '署名', default: true, desc: '底部署名' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide71Verdict.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide71Verdict;
