/*
 * Slide46Chapter — 章节大字（章节页 · 巨型描边序号 + 居中标题 + 进度轨）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsDv- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Slide13Section（海报卡 + 索引列表）/ Slide36CoverSection（整屏图背）互补：
 * 纯排版式分隔页——超大「描边幽灵数字」铺底、居中中英标题、底部细进度轨。
 * partNumber 只切换徽章数字与进度轨当前段；标题文本写死、不参数化。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  partNumber      number 章节编号(徽章/进度)   默认 3   可选 1–7
 *  accentTone      enum   主色调(通用命名)       默认 'green' 可选 green|yellow|blue|pink
 *  textAlign       enum   文案对齐              默认 'center' 可选 'center'|'left'
 *  showGhost       bool   背景巨型幽灵数字显隐    默认 true
 *  showProgress    bool   底部章节进度轨显隐      默认 true
 *  progressCount   number 进度轨段数            默认 6   可选 3–7
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide46Chapter, { defaults, controls } from './Slide46Chapter.jsx'
 */
import React from 'react';

const XHSDV_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 本页章节内容（写死）：与放映位置呼应的「横向透视」章
const XHSDV_CHAPTER = {
  zh: '横向透视',
  en: 'SECTOR · ROUNDS · PLAYERS',
  lead: '在同一时间截面上，对赛道、轮次、地区与头部玩家做横向对比——回答「谁更大、谁更密集、资源集中在哪里」。',
  tags: ['行业赛道', '轮次结构', '头部玩家'],
};

function DvSpark({ size = 22, color = '#fff', style }) {
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


const SLIDE46CHAPTER_COPY = {
  text001: "PART",
};
function Slide46Chapter(props) {
  const {
      copy = SLIDE46CHAPTER_COPY,
      chapterData = XHSDV_CHAPTER,
    partNumber = 3,
    accentTone = 'green',
    textAlign = 'center',
    showGhost = true,
    showProgress = true,
    progressCount = 6,
    showDecorations = true,
  } = props;

  const accent = XHSDV_TONES[accentTone] || XHSDV_TONES.green;
  const pcount = Math.max(3, Math.min(7, progressCount));
  const part = Math.max(1, Math.min(pcount, partNumber));
  const partStr = String(part).padStart(2, '0');
  const ch = chapterData;

  return (
    <section className={'xhs-base xhsDv-root is-' + textAlign} data-label="章节大字" data-screen-label="章节大字"
      style={{ '--c': accent }}>
      <style>{XHSDV_CSS}</style>

      {showGhost && <span className="xhsDv-ghost" aria-hidden="true">{partStr}</span>}

      <div className="xhsDv-stack">
        <div className="xhsDv-kicker">
          <span className="xhsDv-kicker-tag">{copy.text001}{partStr}</span>
          <span className="xhsDv-kicker-en">{ch.en}</span>
        </div>

        <h1 className="xhsDv-title">{ch.zh}</h1>

        <div className="xhsDv-tags">
          {ch.tags.map((t, i) => (
            <span key={i} className="xhsDv-tag">{t}</span>
          ))}
        </div>

        <p className="xhsDv-lead">{ch.lead}</p>
      </div>

      {showProgress && (
        <div className="xhsDv-progress">
          {Array.from({ length: pcount }).map((_, i) => {
            const done = i < part - 1;
            const now = i === part - 1;
            return (
              <span key={i} className={'xhsDv-seg' + (done ? ' is-done' : '') + (now ? ' is-now' : '')}>
                <span className="xhsDv-seg-no">{String(i + 1).padStart(2, '0')}</span>
              </span>
            );
          })}
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <DvSpark size={26} color={accent} style={{ position: 'absolute', left: 130, top: 150 }} />
          <DvSpark size={16} color="#FFC700" style={{ position: 'absolute', right: 150, top: 200 }} />
          <DvSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 220, bottom: 170 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSDV_CSS = `
  .xhsDv-root{ position:relative; height:100%; box-sizing:border-box; padding:120px 130px;
    display:flex; flex-direction:column; overflow:hidden; }
  .xhsDv-root::before{ content:''; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(1200px 820px at 50% 42%, color-mix(in srgb, var(--c) 15%, transparent), transparent 70%); }
  .xhsDv-root.is-center{ align-items:center; justify-content:center; text-align:center; }
  .xhsDv-root.is-left{ align-items:flex-start; justify-content:center; text-align:left; }

  /* 背景巨型描边幽灵数字 */
  .xhsDv-ghost{ position:absolute; top:50%; left:50%; transform:translate(-50%,-54%);
    font-family:"Space Mono",monospace; font-weight:700; font-size:760px; line-height:.8; letter-spacing:-.04em;
    color:transparent; -webkit-text-stroke:2px color-mix(in srgb, var(--c) 36%, rgba(255,255,255,.06));
    text-stroke:2px color-mix(in srgb, var(--c) 36%, rgba(255,255,255,.06));
    opacity:.5; pointer-events:none; user-select:none; z-index:0; }
  .xhsDv-root.is-left .xhsDv-ghost{ left:auto; right:-40px; transform:translateY(-54%); }

  .xhsDv-stack{ position:relative; z-index:1; display:flex; flex-direction:column;
    align-items:inherit; max-width:1150px; }

  .xhsDv-kicker{ display:flex; align-items:center; gap:18px; margin-bottom:30px; }
  .xhsDv-kicker-tag{ font-family:"Space Mono",monospace; font-weight:700; font-size:22px; letter-spacing:.1em; color:#06140f;
    background:var(--c); padding:6px 16px; border-radius:9px;
    box-shadow:0 0 26px color-mix(in srgb, var(--c) 45%, transparent), inset 0 2px 0 rgba(255,255,255,.4); }
  .xhsDv-kicker-en{ font-family:"Space Mono",monospace; font-size:20px; letter-spacing:.16em; color:#8a8a8a; }

  .xhsDv-title{ margin:0; font-size:188px; font-weight:900; line-height:.96; letter-spacing:.01em; color:#fff;
    text-shadow:0 0 70px color-mix(in srgb, var(--c) 26%, transparent); }

  .xhsDv-tags{ display:flex; flex-wrap:wrap; gap:16px; margin-top:34px; justify-content:inherit; }
  .xhsDv-tag{ font-size:26px; font-weight:700; color:#e6e6e6; padding:10px 26px; border-radius:999px;
    background:linear-gradient(160deg,#181818,#0e0e0e); border:1.5px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,.1));
    box-shadow:0 8px 22px rgba(0,0,0,.4); }

  .xhsDv-lead{ margin:40px 0 0; max-width:880px; font-size:27px; line-height:1.6; font-weight:500; color:#b0b0b0; text-wrap:pretty; }
  .xhsDv-root.is-left .xhsDv-lead::before{ content:''; display:block; width:52px; height:4px; border-radius:2px; margin-bottom:18px;
    background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 55%, transparent); }

  /* 底部进度轨 */
  .xhsDv-progress{ position:absolute; left:130px; right:130px; bottom:70px; z-index:1;
    display:flex; gap:16px; }
  .xhsDv-seg{ flex:1 1 0; height:8px; border-radius:999px; position:relative;
    background:rgba(255,255,255,.1); transition:background .3s; }
  .xhsDv-seg.is-done{ background:color-mix(in srgb, var(--c) 50%, rgba(255,255,255,.12)); }
  .xhsDv-seg.is-now{ background:var(--c); box-shadow:0 0 22px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsDv-seg-no{ position:absolute; top:-30px; left:0; font-family:"Space Mono",monospace; font-size:15px; letter-spacing:.06em; color:#5a5a5a; }
  .xhsDv-seg.is-now .xhsDv-seg-no{ color:var(--c); }
  .xhsDv-seg.is-done .xhsDv-seg-no{ color:#8a8a8a; }
`;

const META = {
  id: 'chapter',
  label: '章节大字',
  Component: Slide46Chapter,
  defaults: {
      copy: SLIDE46CHAPTER_COPY,
      chapterData: XHSDV_CHAPTER,
    partNumber: 3,
    accentTone: 'green',
    textAlign: 'center',
    showGhost: true,
    showProgress: true,
    progressCount: 6,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }], default: SLIDE46CHAPTER_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'chapterData', type: 'list', label: 'chapterData', itemLabel: '数据', single: true, fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "lead", label: "lead" }], default: XHSDV_CHAPTER, desc: '默认数据内容' },
    { key: 'partNumber', type: 'slider', label: '章节编号', min: 1, max: 7, step: 1, default: 3, maxFromKey: 'progressCount', desc: '徽章 / 进度轨当前段' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'green', desc: '页面主色调' },
    { key: 'textAlign', type: 'radio', label: '文案对齐', options: ['center', 'left'], optionLabels: ['居中', '靠左'], default: 'center', desc: '居中 / 靠左' },
    { key: 'showGhost', type: 'toggle', label: '幽灵数字', default: true, desc: '背景巨型描边数字' },
    { key: 'showProgress', type: 'toggle', label: '进度轨', default: true, desc: '底部章节进度轨' },
    { key: 'progressCount', type: 'slider', label: '进度段数', min: 3, max: 7, step: 1, default: 6, showIf: (v) => v.showProgress, desc: '进度轨段数' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide46Chapter.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide46Chapter;
