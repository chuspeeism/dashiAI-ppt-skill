/*
 * Slide57Cover — 杂志封面（图片页 · 整屏 image-slot 背景 + 刊头 / 封面标题 / 角标导读）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCo- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Hero（整屏图 + 浮层数据）/ CoverSection（整屏图背章节）互补：本页把封面做成
 * 「杂志封面」语言——顶部刊头(masthead) + 超大封面标题 + 右侧角标导读(cover lines) +
 * 期号徽标，整屏 image-slot 作 cover 背景（mediaCount=0 回退霓虹渐变底）。
 * 文本写死在组件内，仅结构 / 数量 / 显隐通过 props 暴露。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 整屏 cover 背景图片槽(0/1)  默认 1
 *  accentTone      enum   主色调(通用命名)            默认 'green' green/yellow/blue/pink
 *  lineCount       number 角标导读条数(0–4)           默认 4
 *  showMasthead    bool   顶部刊头显隐               默认 true
 *  showIssue       bool   期号徽标显隐               默认 true
 *  showScrim       bool   暗角遮罩显隐               默认 true
 *  showDecorations bool   星芒等点缀显隐             默认 true
 *
 * 迁移：import Slide57Cover, { defaults, controls } from './Slide57Cover.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

const XHSCO_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 角标导读（写死）：序号 / 主句 / 释义 / 主色循环
const XHSCO_LINES = [
  { tag: '01', head: '970 亿美元', sub: '全年总额创历史新高', color: '#27E021' },
  { tag: '02', head: '97 笔大额轮', sub: '单笔 ≥1 亿 · 头部高度集中', color: '#15A7F0' },
  { tag: '03', head: '六大赛道争霸', sub: '算力 · 大模型 · 应用 · 谁吸金', color: '#FFC700' },
  { tag: '04', head: '估值一年翻数倍', sub: '独角兽流水线 · 资本不眠', color: '#FF9FE2' },
];

function CoSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE57COVER_COPY = {
  placeholder001: "封面大图 · 资本现场 / 人物 / 城市",
  text001: "AI CAPITAL",
  text002: "资本观察 · 特别报告",
  text003: "NO.",
  text004: "04",
  text005: "2024 年刊",
  text006: "封面故事 · COVER STORY",
  text007: "钱，都",
  text008: "去哪了",
  text009: "2024 美国大额融资 AI 公司 · 全景调研",
};
function Slide57Cover(props) {
  const {
      copy = SLIDE57COVER_COPY,
      linesData = XHSCO_LINES,
    mediaCount = 1,
    backgroundMode = 'unicorn',
    unicornScene = 'tech',
    accentTone = 'green',
    lineCount = 4,
    showMasthead = true,
    showIssue = true,
    showScrim = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const accent = XHSCO_TONES[accentTone] || XHSCO_TONES.green;
  const useUnicorn = backgroundMode === 'unicorn';
  const hasImg = !useUnicorn && Math.max(0, Math.min(1, mediaCount)) > 0;
  const lc = Math.max(0, Math.min(4, lineCount));
  const lines = linesData.slice(0, lc);

  return (
    <section className="xhs-base xhsCo-root" data-label="杂志封面" data-screen-label="杂志封面"
      style={{ '--c': accent }}>
      <style>{XHSCO_CSS}</style>

      {/* 整屏背景：image-slot cover 或 霓虹渐变底 */}
      <div className="xhsCo-bg">
        {useUnicorn ? (
          <UnicornBackground scene={unicornScene} accent={accent} />
        ) : hasImg ? (
          <image-slot id="xhsCo-media-0" fit="cover" shape="rect" placeholder={copy.placeholder001}></image-slot>
        ) : (
          <div className="xhsCo-noimg" aria-hidden="true" />
        )}
      </div>
      {showScrim && <div className="xhsCo-scrim" aria-hidden="true" />}

      {/* 刊头 */}
      {showMasthead && (
        <header className="xhsCo-masthead">
          <span className="xhsCo-brand">{copy.text001}</span>
          <span className="xhsCo-brandZh">{copy.text002}</span>
          {showIssue && (
            <span className="xhsCo-issue">
              <i className="xhsCo-issueNo">{copy.text003}</i><b>{copy.text004}</b>
              <span className="xhsCo-issueYr">{copy.text005}</span>
            </span>
          )}
        </header>
      )}

      {/* 封面标题 */}
      <div className="xhsCo-titleWrap">
        <span className="xhsCo-eyebrow">{copy.text006}</span>
        <h2 className="xhsCo-title">{copy.text007}<HL color={accent} variant={hlStyle} tilt={-hlTilt}>{copy.text008}</HL>？
        </h2>
        <p className="xhsCo-sub">{copy.text009}</p>
      </div>

      {/* 右侧角标导读 */}
      {lc > 0 && (
        <ul className="xhsCo-lines">
          {lines.map((l, i) => (
            <li key={i} className="xhsCo-line" style={{ '--c': l.color }}>
              <span className="xhsCo-lineTag">{l.tag}</span>
              <span className="xhsCo-lineBody">
                <span className="xhsCo-lineHead">{l.head}</span>
                <span className="xhsCo-lineSub">{l.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {showDecorations && (
        <React.Fragment>
          <CoSpark size={26} color="#FFC700" style={{ position: 'absolute', left: 470, top: 360, zIndex: 4 }} />
          <CoSpark size={15} color="#15A7F0" style={{ position: 'absolute', left: 96, bottom: 220, zIndex: 4 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCO_CSS = `
  .xhsCo-root{ position:relative; box-sizing:border-box; height:100%; overflow:hidden; background:#000; }

  .xhsCo-bg{ position:absolute; inset:0; z-index:0; }
  .xhsCo-bg image-slot{ width:100%; height:100%; display:block; }
  .xhsCo-noimg{ width:100%; height:100%;
    background:radial-gradient(1200px 900px at 30% 22%, color-mix(in srgb, var(--c) 30%, #0a0a0a) 0%, #050505 64%),
      linear-gradient(135deg, #0c0c0c, #000); }
  .xhsCo-scrim{ position:absolute; inset:0; z-index:1; pointer-events:none;
    background:linear-gradient(180deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.18) 32%, rgba(0,0,0,.32) 64%, rgba(0,0,0,.82) 100%),
      linear-gradient(90deg, rgba(0,0,0,.66) 0%, rgba(0,0,0,0) 46%); }

  .xhsCo-masthead{ position:absolute; left:96px; right:96px; top:64px; z-index:3; display:flex; align-items:baseline; gap:24px; }
  .xhsCo-brand{ font-family:"Space Mono",monospace; font-size:40px; font-weight:700; letter-spacing:.06em; color:#fff;
    text-shadow:0 2px 24px rgba(0,0,0,.7); }
  .xhsCo-brandZh{ font-size:23px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent); }
  .xhsCo-issue{ margin-left:auto; display:inline-flex; align-items:baseline; gap:8px; padding:8px 20px; border-radius:12px;
    background:rgba(0,0,0,.45); border:1.5px solid rgba(255,255,255,.18); backdrop-filter:blur(4px); }
  .xhsCo-issueNo{ font-family:"Space Mono",monospace; font-style:normal; font-size:20px; font-weight:700; color:#bdbdbd; }
  .xhsCo-issue b{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:var(--c); line-height:1; }
  .xhsCo-issueYr{ font-size:18px; font-weight:700; color:#cfcfcf; margin-left:8px; letter-spacing:.06em; white-space:nowrap; }

  .xhsCo-titleWrap{ position:absolute; left:96px; bottom:92px; z-index:3; max-width:1080px; }
  .xhsCo-eyebrow{ font-family:"Space Mono",monospace; font-size:24px; font-weight:700; letter-spacing:.14em; color:var(--c);
    text-shadow:0 0 20px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCo-title{ margin:20px 0 0; font-size:166px; font-weight:900; color:#fff; line-height:1.12; letter-spacing:-.02em;
    text-shadow:0 8px 60px rgba(0,0,0,.7); }
  .xhsCo-sub{ margin:24px 0 0; font-size:34px; font-weight:600; color:#e0e0e0; letter-spacing:.02em;
    text-shadow:0 2px 18px rgba(0,0,0,.7); }

  .xhsCo-lines{ position:absolute; right:90px; top:184px; z-index:3; width:476px; margin:0; padding:0; list-style:none;
    display:flex; flex-direction:column; gap:16px; }
  .xhsCo-line{ display:flex; align-items:center; gap:18px; padding:18px 24px; border-radius:18px;
    background:linear-gradient(155deg, color-mix(in srgb, var(--c) 18%, rgba(13,13,13,.82)), rgba(8,8,8,.82) 72%);
    border:1.5px solid color-mix(in srgb, var(--c) 42%, rgba(255,255,255,.1));
    box-shadow:0 14px 40px rgba(0,0,0,.5); }
  .xhsCo-lineTag{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:var(--c); line-height:1;
    flex:0 0 auto; text-shadow:0 0 16px color-mix(in srgb, var(--c) 40%, transparent); }
  .xhsCo-lineBody{ display:flex; flex-direction:column; gap:5px; min-width:0; }
  .xhsCo-lineHead{ font-size:27px; font-weight:800; color:#fff; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .xhsCo-lineSub{ font-size:18px; font-weight:600; color:#b8b8b8; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
`;

const META = {
  id: 'cover',
  label: '杂志封面',
  Component: Slide57Cover,
  defaults: {
      copy: SLIDE57COVER_COPY,
      linesData: XHSCO_LINES,
    ...hlDefaults,
    mediaCount: 1,
    backgroundMode: 'unicorn',
    unicornScene: 'tech',
    accentTone: 'green',
    lineCount: 4,
    showMasthead: true,
    showIssue: true,
    showScrim: true,
    showDecorations: true,
  },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('tech'),
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "placeholder001", label: "placeholder001" }, { key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }, { key: "text008", label: "text008" }, { key: "text009", label: "text009" }], default: SLIDE57COVER_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'linesData', type: 'list', label: 'linesData', itemLabel: '数据', fields: [{ key: "tag", label: "tag" }, { key: "head", label: "head" }, { key: "sub", label: "sub" }, { key: "color", label: "color" }], default: XHSCO_LINES, desc: '默认数据内容' },
    ...hlControls,
    { key: 'mediaCount', type: 'slider', label: '背景图片槽', min: 0, max: 1, step: 1, default: 1, dependsOn: 'backgroundMode', dependsOnValue: 'media', desc: '整屏 cover 背景图片槽(0=霓虹渐变底)' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调(通用命名)' },
    { key: 'lineCount', type: 'slider', label: '角标导读条数', min: 0, max: 4, step: 1, default: 4, desc: '右侧角标导读条数' },
    { key: 'showMasthead', type: 'toggle', label: '顶部刊头', default: true, desc: '顶部刊头' },
    { key: 'showIssue', type: 'toggle', label: '期号徽标', default: true, desc: '期号徽标', showIf: (v) => v.showMasthead },
    { key: 'showScrim', type: 'toggle', label: '暗角遮罩', default: true, desc: '保证文字可读的暗角遮罩' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide57Cover.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide57Cover;
