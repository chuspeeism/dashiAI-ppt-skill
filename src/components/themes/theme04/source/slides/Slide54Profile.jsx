/*
 * Slide54Profile — 人物档案卡（图片页 · 肖像图片槽 + 结构化档案数据表）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsPf- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Hero（整屏图 + 浮层）/ Spotlight（侧图 + 浮层数据）互补：本页是一张「档案卡 / DOSSIER」——
 * 受控竖版肖像画框（cover 填满、永不溢出）+ 右侧结构化档案数据（估值 / 融资 / 成立 / 赛道）
 * + 资本热度评级点 + 底部批注金句。mediaCount=0 时肖像转「霓虹首字母」无图态。
 * 数据为调研整理（报告案例 · Anthropic / Dario Amodei，单位亿美元）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 肖像图片槽数量(0/1)    默认 1
 *  imageSide       enum   肖像位置            默认 'left' 可选 'left'|'right'
 *  accentTone      enum   主色调(通用命名)      默认 'blue' 可选 green/yellow/blue/pink
 *  statCount       number 档案数据条数(0–4)     默认 4
 *  showRating      bool   资本热度评级点显隐      默认 true
 *  showNote        bool   底部批注金句显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide54Profile, { defaults, controls } from './Slide54Profile.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

const XHSPF_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
// 档案数据（写死）：键 / 值 / 单位
const XHSPF_FACTS = [
  { k: '最新估值', v: '600', u: '亿美元' },
  { k: '2024 融资', v: '80', u: '亿美元' },
  { k: '成立年份', v: '2021', u: '' },
  { k: '主投赛道', v: '通用大模型', u: '安全对齐' },
];

function PfSpark({ size = 20, color = '#fff', style }) {
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

function PfRating({ heat, color }) {
  return (
    <span className="xhsPf-dots" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={'xhsPf-dot' + (i < heat ? ' is-on' : '')}
          style={i < heat ? { background: color, boxShadow: `0 0 12px ${color}99` } : undefined} />
      ))}
    </span>
  );
}


const SLIDE54PROFILE_COPY = {
  text001: "档案 NO. 02 · CASE",
  placeholder001: "Dario Amodei · 人物肖像",
  text002: "A",
  text003: "典型案例 · DOSSIER",
  text004: "一张档案，",
  text005: "看懂头号挑战者",
  text006: "联合创始人 & CEO",
  text007: "Dario Amodei",
  text008: "Anthropic",
  text009: "通用大模型 · 安全对齐",
  text010: "资本热度",
  text011: "5 / 5",
  text012: "“",
  text013: "以「AI 安全」为旗号，成为资本最青睐的 OpenAI 头号挑战者——估值一年翻数倍。",
};
function Slide54Profile(props) {
  const {
      copy = SLIDE54PROFILE_COPY,
      factsData = XHSPF_FACTS,
    mediaCount = 1,
    imageSide = 'left',
    accentTone = 'blue',
    statCount = 4,
    showRating = true,
    showNote = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const accent = XHSPF_TONES[accentTone] || XHSPF_TONES.blue;
  const hasImg = Math.max(0, Math.min(1, mediaCount)) > 0;
  const fc = Math.max(0, Math.min(4, statCount));
  const facts = factsData.slice(0, fc);

  const portrait = (
    <div className="xhsPf-portrait">
      <span className="xhsPf-fileNo" aria-hidden="true">{copy.text001}</span>
      <div className="xhsPf-frame">
        {hasImg ? (
          <image-slot id="xhsPf-media-0" fit="cover" shape="rect" placeholder={copy.placeholder001}></image-slot>
        ) : (
          <div className="xhsPf-noimg"><span className="xhsPf-initial">{copy.text002}</span></div>
        )}
        <span className="xhsPf-scrim" aria-hidden="true" />
      </div>
    </div>
  );

  return (
    <section className={'xhs-base xhsPf-root' + (imageSide === 'right' ? ' is-right' : '')}
      data-label="人物档案卡" data-screen-label="人物档案卡" style={{ '--c': accent }}>
      <style>{XHSPF_CSS}</style>

      <header className="xhsPf-head">
        <div className="xhsPf-kicker">{copy.text003}</div>
        <h2 className="xhsPf-title">{copy.text004}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{copy.text005}</HL>
        </h2>
      </header>

      <div className="xhsPf-card">
        {imageSide === 'left' && portrait}

        <div className="xhsPf-body">
          <div className="xhsPf-id">
            <span className="xhsPf-eyebrow">{copy.text006}</span>
            <h3 className="xhsPf-name">{copy.text007}</h3>
            <div className="xhsPf-org">
              <span className="xhsPf-orgName">{copy.text008}</span>
              <span className="xhsPf-orgTag">{copy.text009}</span>
            </div>
          </div>

          {showRating && (
            <div className="xhsPf-heat">
              <span className="xhsPf-heatLab">{copy.text010}</span>
              <PfRating heat={5} color={accent} />
              <span className="xhsPf-heatVal">{copy.text011}</span>
            </div>
          )}

          {fc > 0 && (
            <div className="xhsPf-facts" style={{ '--cols': fc >= 3 ? 2 : fc }}>
              {facts.map((f, i) => (
                <div key={i} className="xhsPf-fact">
                  <span className="xhsPf-factKey">{f.k}</span>
                  <span className="xhsPf-factVal">{f.v}{f.u && <i>{f.u}</i>}</span>
                </div>
              ))}
            </div>
          )}

          {showNote && (
            <div className="xhsPf-note">
              <span className="xhsPf-qmark" aria-hidden="true">{copy.text012}</span>{copy.text013}</div>
          )}
        </div>

        {imageSide === 'right' && portrait}
      </div>

      {showDecorations && (
        <React.Fragment>
          <PfSpark size={26} color="#FFC700" style={{ position: 'absolute', right: 104, top: 144 }} />
          <PfSpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 84, bottom: 108 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSPF_CSS = `
  .xhsPf-root{ padding:70px 110px 60px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsPf-head{ flex:0 0 auto; margin-bottom:30px; }
  .xhsPf-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsPf-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.1; }

  .xhsPf-card{ flex:1 1 auto; min-height:0; display:flex; gap:54px; align-items:stretch;
    background:linear-gradient(150deg,#181818,#0c0c0c); border:1.5px solid rgba(255,255,255,.09); border-radius:28px;
    padding:46px 50px; box-shadow:0 30px 70px rgba(0,0,0,.55); position:relative; overflow:hidden; }
  .xhsPf-card::before{ content:""; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(680px 480px at var(--gx,18%) 30%, color-mix(in srgb, var(--c) 12%, transparent), transparent 70%); }
  .xhsPf-root.is-right .xhsPf-card{ --gx:82%; }

  /* 肖像：受控竖版画框，cover 填满、永不溢出 */
  .xhsPf-portrait{ position:relative; flex:0 0 auto; width:460px; display:flex; flex-direction:column; }
  .xhsPf-fileNo{ font-family:"Space Mono",monospace; font-size:16px; font-weight:700; letter-spacing:.1em; color:var(--c);
    margin-bottom:14px; }
  .xhsPf-frame{ position:relative; flex:1 1 auto; min-height:0; border-radius:20px; overflow:hidden; background:#0a0a0a;
    border:2px solid color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.08));
    box-shadow:0 0 44px color-mix(in srgb, var(--c) 18%, transparent); }
  .xhsPf-frame image-slot{ width:100%; height:100%; display:block; }
  .xhsPf-noimg{ width:100%; height:100%; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(120% 120% at 50% 22%, color-mix(in srgb, var(--c) 32%, #101010) 0%, #0a0a0a 70%); }
  .xhsPf-initial{ font-family:"Space Mono",monospace; font-size:230px; font-weight:700; color:var(--c); line-height:1;
    text-shadow:0 0 50px color-mix(in srgb, var(--c) 55%, transparent); opacity:.92; }
  .xhsPf-scrim{ position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, transparent 62%, rgba(0,0,0,.42) 100%); }

  /* 档案数据列 */
  .xhsPf-body{ flex:1 1 auto; min-width:0; position:relative; z-index:1; display:flex; flex-direction:column; }
  .xhsPf-eyebrow{ font-family:"Space Mono",monospace; font-size:21px; font-weight:700; letter-spacing:.06em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 30%, transparent); }
  .xhsPf-name{ margin:12px 0 0; font-size:88px; font-weight:900; color:#fff; line-height:.96; letter-spacing:-.01em;
    text-shadow:0 0 44px color-mix(in srgb, var(--c) 24%, transparent); }
  .xhsPf-org{ display:flex; align-items:center; gap:16px; margin-top:18px; flex-wrap:wrap; }
  .xhsPf-orgName{ font-size:34px; font-weight:800; color:#eaeaea; }
  .xhsPf-orgTag{ font-size:20px; font-weight:700; color:var(--c); padding:6px 18px; border-radius:999px;
    background:color-mix(in srgb, var(--c) 14%, #0c0c0c); border:1.5px solid color-mix(in srgb, var(--c) 40%, transparent); }

  .xhsPf-heat{ display:flex; align-items:center; gap:16px; margin-top:30px; }
  .xhsPf-heatLab{ font-size:21px; font-weight:700; color:#9a9a9a; }
  .xhsPf-dots{ display:inline-flex; gap:9px; }
  .xhsPf-dot{ width:18px; height:18px; border-radius:50%; background:#222; border:1.5px solid #333; }
  .xhsPf-heatVal{ font-family:"Space Mono",monospace; font-size:21px; font-weight:700; color:var(--c); }

  .xhsPf-facts{ margin-top:30px; display:grid; grid-template-columns:repeat(var(--cols),1fr); gap:16px; }
  .xhsPf-fact{ padding:22px 26px; border-radius:18px; background:linear-gradient(160deg,#1c1c1c,#101010);
    border:1.5px solid rgba(255,255,255,.07); display:flex; flex-direction:column; gap:8px; }
  .xhsPf-factKey{ font-size:19px; font-weight:700; color:#8e8e8e; }
  .xhsPf-factVal{ font-family:"Space Mono",monospace; font-size:42px; font-weight:700; line-height:1; color:#fff;
    display:flex; align-items:baseline; }
  .xhsPf-factVal i{ font-style:normal; font-size:20px; font-weight:700; margin-left:8px; color:var(--c); }

  .xhsPf-note{ margin-top:auto; padding-top:26px; display:flex; align-items:baseline; gap:14px;
    font-size:25px; font-weight:600; color:#c4c4c4; line-height:1.5; text-wrap:pretty; }
  .xhsPf-qmark{ font-family:"Space Mono",monospace; font-size:58px; font-weight:700; color:var(--c); line-height:.5;
    text-shadow:0 0 20px color-mix(in srgb, var(--c) 38%, transparent); flex-shrink:0; }
`;

const META = {
  id: 'profile',
  label: '人物档案卡',
  Component: Slide54Profile,
  defaults: {
      copy: SLIDE54PROFILE_COPY,
      factsData: XHSPF_FACTS,
    ...hlDefaults,
    mediaCount: 1,
    imageSide: 'left',
    accentTone: 'blue',
    statCount: 4,
    showRating: true,
    showNote: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "placeholder001", label: "placeholder001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }, { key: "text010", label: "text010" }, { key: "text011", label: "text011" }, { key: "text012", label: "text012" }, { key: "text013", label: "text013" }], default: SLIDE54PROFILE_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'factsData', type: 'list', label: 'factsData', itemLabel: '数据', fields: [{ key: "k", label: "k" }, { key: "v", label: "v" }, { key: "u", label: "u" }], default: XHSPF_FACTS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '肖像图片槽', min: 0, max: 1, step: 1, default: 1, desc: '肖像图片槽数量(0=霓虹首字母无图态)' },
    { key: 'imageSide', type: 'radio', label: '肖像位置', options: ['left', 'right'], optionLabels: ['左侧', '右侧'], default: 'left', desc: '肖像在左 / 右' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调(通用命名)' },
    { key: 'statCount', type: 'slider', label: '档案数据条数', min: 0, max: 4, step: 1, default: 4, desc: '结构化档案数据条数' },
    { key: 'showRating', type: 'toggle', label: '资本热度', default: true, desc: '资本热度评级点' },
    { key: 'showNote', type: 'toggle', label: '批注金句', default: true, desc: '底部批注金句' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide54Profile.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide54Profile;
