/*
 * Slide36CoverSection — 图背章节页（章节页 + 图片 · 全屏背景章节分隔）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsCv- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Slide13Section 互补：本页用整屏 image-slot 作背景（cover 铺满 + 暗角遮罩
 * 保证文字可读），右下角章节进度条；mediaCount=0 时回退到霓虹渐变底。
 *
 * 图片槽（image-slot）：单张整屏 cover，永不溢出；数量 0–1 由 mediaCount 控制。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  mediaCount      number 整屏背景图(0=霓虹底)  默认 1   可选 0–1
 *  partNumber      number 章节编号(徽章)        默认 4   可选 1–6
 *  accentTone      enum   主色调(通用命名)       默认 'pink' 可选 'green'|'yellow'|'blue'|'pink'
 *  textAlign       enum   文案对齐             默认 'left' 可选 'left'|'center'
 *  showProgress    bool   章节进度条显隐         默认 true
 *  progressCount   number 进度条段数            默认 5   可选 3–6
 *  showScrim       bool   暗角遮罩显隐(保证可读)   默认 true
 *  showDecorations bool   星芒等点缀显隐         默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide36CoverSection, { defaults, controls } from './Slide36CoverSection.jsx'
 */
import React from 'react';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

const XHSCV_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 章节内容（写死）
const XHSCV_CHAPTER = {
  zh: '资本现场', en: 'INSIDE THE CAPITAL', lead: '镜头拉近到一线——机房、团队、发布会与签约桌，看资本如何在真实场景里落地。',
};
const XHSCV_PROGRESS = ['研究方法', '市场全景', '横向透视', '资本现场', '风险研判', '投资展望'];

function CvSpark({ size = 24, color = '#fff', style }) {
  const gid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 104 104" aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 6px ${color}cc)`, ...style }}>
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


const SLIDE36COVERSECTION_COPY = {
  placeholder001: "整屏背景 · 机房 / 团队 / 资本现场",
  text001: "CONTENTS",
};
function Slide36CoverSection(props) {
  const {
      copy = SLIDE36COVERSECTION_COPY,
      progressData = XHSCV_PROGRESS,
      chapterData = XHSCV_CHAPTER,
    mediaCount = 1,
    backgroundMode = 'unicorn',
    unicornScene = 'automations',
    partNumber = 4,
    accentTone = 'pink',
    textAlign = 'left',
    showProgress = true,
    progressCount = 5,
    showScrim = true,
    showDecorations = true,
  } = props;

  const accent = XHSCV_TONES[accentTone] || XHSCV_TONES.pink;
  const useUnicorn = backgroundMode === 'unicorn';
  const hasImg = !useUnicorn && mediaCount >= 1;
  const part = Math.max(1, Math.min(6, partNumber));
  const partStr = String(part).padStart(2, '0');
  const pcount = Math.max(3, Math.min(6, progressCount));
  const progress = progressData.slice(0, pcount);
  const activeIdx = Math.min(pcount - 1, part - 1);

  return (
    <section className={'xhs-base xhsCv-root is-' + textAlign + (hasImg ? '' : ' is-noimg')}
      data-label="图背章节页" data-screen-label="图背章节页" style={{ '--c': accent }}>
      <style>{XHSCV_CSS}</style>

      <div className="xhsCv-bg" aria-hidden="true">
        {useUnicorn ? (
          <UnicornBackground scene={unicornScene} accent={accent} />
        ) : hasImg ? (
          <image-slot id="xhsCv-bg-0" fit="cover" shape="rect" placeholder={copy.placeholder001}></image-slot>
        ) : (
          <div className="xhsCv-gradient" />
        )}
      </div>
      {showScrim && <div className="xhsCv-scrim" aria-hidden="true" />}

      <div className="xhsCv-content">
        <span className="xhsCv-part">{`<Part${partStr}>`}</span>
        <div className="xhsCv-numrow">
          <span className="xhsCv-num">{partStr}</span>
          <span className="xhsCv-numline" aria-hidden="true" />
        </div>
        <h2 className="xhsCv-zh">{chapterData.zh}</h2>
        <div className="xhsCv-en">{chapterData.en}</div>
        <p className="xhsCv-lead">{chapterData.lead}</p>
      </div>

      {showProgress && (
        <div className="xhsCv-progress">
          <span className="xhsCv-progress-kicker">{copy.text001}</span>
          <ol className="xhsCv-progress-list">
            {progress.map((p, i) => (
              <li key={i} className={'xhsCv-progress-item' + (i === activeIdx ? ' is-active' : '')}>
                <span className="xhsCv-progress-no">{String(i + 1).padStart(2, '0')}</span>
                <span className="xhsCv-progress-zh">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <CvSpark size={30} color={accent} style={{ position: 'absolute', left: 110, top: 120 }} />
          <CvSpark size={18} color="#FFC700" style={{ position: 'absolute', left: 200, top: 200 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSCV_CSS = `
  .xhsCv-root{ position:relative; width:100%; height:100%; overflow:hidden; display:flex; flex-direction:column;
    justify-content:flex-end; padding:120px 130px 110px; box-sizing:border-box; }
  .xhsCv-root.is-center{ align-items:center; text-align:center; justify-content:center; }

  .xhsCv-bg{ position:absolute; inset:0; z-index:0; background:#0a0a0a; }
  .xhsCv-bg image-slot{ width:100%; height:100%; display:block; }
  .xhsCv-gradient{ width:100%; height:100%;
    background:
      radial-gradient(1100px 760px at 78% 20%, color-mix(in srgb, var(--c) 40%, transparent), transparent 62%),
      radial-gradient(900px 700px at 16% 86%, color-mix(in srgb, #15A7F0 32%, transparent), transparent 60%),
      linear-gradient(150deg,#141414,#050505); }

  .xhsCv-scrim{ position:absolute; inset:0; z-index:1; pointer-events:none;
    background:linear-gradient(90deg, rgba(0,0,0,.86) 0%, rgba(0,0,0,.6) 34%, rgba(0,0,0,.18) 64%, rgba(0,0,0,.42) 100%),
      linear-gradient(0deg, rgba(0,0,0,.72) 0%, transparent 46%); }
  .xhsCv-root.is-center .xhsCv-scrim{ background:radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,.3), rgba(0,0,0,.78)); }

  .xhsCv-content{ position:relative; z-index:2; max-width:1180px; display:flex; flex-direction:column; }
  .xhsCv-root.is-center .xhsCv-content{ align-items:center; }
  .xhsCv-part{ font-family:"Space Mono",monospace; font-size:28px; font-weight:700; letter-spacing:.04em; color:var(--c);
    text-shadow:0 0 22px color-mix(in srgb, var(--c) 46%, transparent); }
  .xhsCv-numrow{ display:flex; align-items:center; gap:34px; margin:4px 0 6px; }
  .xhsCv-root.is-center .xhsCv-numrow{ justify-content:center; }
  .xhsCv-num{ font-family:"Space Mono",monospace; font-weight:700; font-size:230px; line-height:.82; letter-spacing:-.04em;
    color:#fff; text-shadow:0 0 70px color-mix(in srgb, var(--c) 48%, transparent), 0 8px 40px rgba(0,0,0,.7); }
  .xhsCv-numline{ flex:1; height:6px; max-width:360px; border-radius:3px; background:var(--c);
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsCv-root.is-center .xhsCv-numline{ display:none; }
  .xhsCv-zh{ margin:0; font-size:110px; font-weight:900; color:#fff; line-height:1; letter-spacing:.02em;
    text-shadow:0 6px 40px rgba(0,0,0,.7); }
  .xhsCv-en{ margin-top:14px; font-family:"Space Mono",monospace; font-size:26px; letter-spacing:.22em; color:rgba(255,255,255,.7); }
  .xhsCv-lead{ margin:30px 0 0; max-width:780px; font-size:27px; line-height:1.66; font-weight:500; color:#d2d2d2;
    text-wrap:pretty; }
  .xhsCv-lead::before{ content:''; display:block; width:52px; height:4px; border-radius:2px; margin-bottom:18px;
    background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 55%, transparent); }
  .xhsCv-root.is-center .xhsCv-lead{ text-align:center; }
  .xhsCv-root.is-center .xhsCv-lead::before{ margin-left:auto; margin-right:auto; }

  /* 章节进度条：右下角 */
  .xhsCv-progress{ position:absolute; right:130px; bottom:110px; z-index:2; display:flex; flex-direction:column; gap:16px;
    align-items:flex-end; }
  .xhsCv-root.is-center .xhsCv-progress{ display:none; }
  .xhsCv-progress-kicker{ font-family:"Space Mono",monospace; font-size:18px; letter-spacing:.2em; color:rgba(255,255,255,.55); }
  .xhsCv-progress-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:12px; align-items:flex-end; }
  .xhsCv-progress-item{ display:flex; align-items:center; gap:14px; opacity:.55; transition:opacity .3s; }
  .xhsCv-progress-no{ font-family:"Space Mono",monospace; font-size:20px; font-weight:700; color:rgba(255,255,255,.6); }
  .xhsCv-progress-zh{ font-size:24px; font-weight:700; color:#fff; }
  .xhsCv-progress-item.is-active{ opacity:1; }
  .xhsCv-progress-item.is-active .xhsCv-progress-zh{ color:#000; background:var(--c); padding:4px 18px; border-radius:999px;
    box-shadow:0 8px 22px color-mix(in srgb, var(--c) 38%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
  .xhsCv-progress-item.is-active .xhsCv-progress-no{ color:var(--c); }
`;

const META = {
  id: 'coversection',
  label: '图背章节页',
  Component: Slide36CoverSection,
  defaults: {
      copy: SLIDE36COVERSECTION_COPY,
      progressData: XHSCV_PROGRESS,
      chapterData: XHSCV_CHAPTER,
    mediaCount: 1,
    backgroundMode: 'unicorn',
    unicornScene: 'automations',
    partNumber: 4,
    accentTone: 'pink',
    textAlign: 'left',
    showProgress: true,
    progressCount: 5,
    showScrim: true,
    showDecorations: true,
  },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('automations'),
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "placeholder001", label: "placeholder001" }, { key: "text001", label: "text001" }], default: SLIDE36COVERSECTION_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'progressData', type: 'list', label: 'progressData', itemLabel: '数据', primitive: true, default: XHSCV_PROGRESS, desc: '默认数据内容' },
    { key: 'chapterData', type: 'list', label: 'chapterData', itemLabel: '数据', single: true, fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "lead", label: "lead" }], default: XHSCV_CHAPTER, desc: '默认数据内容' },
    { key: 'mediaCount', type: 'slider', label: '整屏背景图', min: 0, max: 1, step: 1, default: 1, dependsOn: 'backgroundMode', dependsOnValue: 'media', desc: '整屏背景图片槽(0=霓虹渐变底)' },
    { key: 'partNumber', type: 'slider', label: '章节编号', min: 1, max: 6, step: 1, default: 4, desc: '大号 Part 编号徽章' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'pink', desc: '页面主色调' },
    { key: 'textAlign', type: 'radio', label: '文案对齐', options: ['left', 'center'], optionLabels: ['左下', '居中'], default: 'left', desc: '文案靠左下 / 居中' },
    { key: 'showProgress', type: 'toggle', label: '章节进度', default: true, showIf: (v) => v.textAlign === 'left', desc: '右下角章节进度条' },
    { key: 'progressCount', type: 'slider', label: '进度段数', min: 3, max: 6, step: 1, default: 5, showIf: (v) => v.textAlign === 'left' && v.showProgress, desc: '进度条段数' },
    { key: 'showScrim', type: 'toggle', label: '暗角遮罩', default: true, desc: '保证文字可读的暗角遮罩' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide36CoverSection.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide36CoverSection;
