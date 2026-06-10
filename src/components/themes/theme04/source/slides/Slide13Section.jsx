/*
 * Slide13Section — 章节分隔页（大号 Part 编号 + 中英标题 + 章节索引）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsSc- 。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  partNumber      number 章节编号(徽章)      默认 2   可选 1–6
 *  accentTone      enum   主色调(通用命名)     默认 'blue' 可选 'green'|'yellow'|'blue'|'pink'
 *  showIndex       bool   章节索引侧栏显隐     默认 true
 *  indexCount      number 索引条目数量         默认 4   可选 2–5
 *  focusEnabled    bool   当前章节高亮开关     默认 true
 *  focusIndex      number 当前章节序号(从1起)  默认 2
 *  showDecorations bool   装饰元素显隐         默认 true
 *
 * 所有可见文案 / 数据均由 props 暴露（defaults 给完整默认值），controls 与 props 一一对应。
 * 迁移：import Slide13Section, { defaults, controls } from './Slide13Section.jsx'
 */
import React from 'react';

const XHSSC_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };

// 章节内容（写死）：编号、中文名、英文名
const XHSSC_CHAPTERS = [
  { no: '01', zh: '研究方法', en: 'METHODOLOGY' },
  { no: '02', zh: '市场全景', en: 'MARKET LANDSCAPE' },
  { no: '03', zh: '横向透视', en: 'SECTOR & PLAYERS' },
  { no: '04', zh: '产业链分层', en: 'VALUE CHAIN' },
  { no: '05', zh: '风险研判', en: 'RISK & OUTLOOK' },
];

const XHSSC_LEAD = '沿时间轴追踪同一指标的演化，回答趋势的走向、拐点与节奏是否可持续——这是「横纵分析法」的纵向维度。';

function ScSpark({ size = 22, color = '#fff', style }) {
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

function Slide13Section(props) {
  const {
    partNumber = 2,
    accentTone = 'blue',
    showIndex = true,
    indexCount = 4,
    focusEnabled = true,
    focusIndex = 2,
    showDecorations = true,
    // 文案
    indexKicker = 'CONTENTS · 章节导航',
    lead = XHSSC_LEAD,
    // 数据
    chapters = XHSSC_CHAPTERS,
  } = props;

  const accent = XHSSC_TONES[accentTone] || XHSSC_TONES.blue;
  const chSrc = Array.isArray(chapters) && chapters.length ? chapters : XHSSC_CHAPTERS;
  const part = Math.max(1, Math.min(6, partNumber));
  const partStr = String(part).padStart(2, '0');
  const icount = Math.max(2, Math.min(chSrc.length, indexCount));
  const shown = chSrc.slice(0, icount);
  const focus = Math.max(1, Math.min(icount, focusIndex)) - 1;

  // 当前章节标题取自被高亮项（无高亮时取 part 对应项）
  const activeChapter = chSrc[Math.min(chSrc.length - 1, part - 1)] || chSrc[0];

  return (
    <section className="xhs-base xhsSc-root" data-label="章节页" style={{ '--c': accent }}>
      <style>{XHSSC_CSS}</style>

      <div className="xhsSc-left">
        <div className="xhsSc-hero">
          <div className="xhsSc-card">
            <span className="xhsSc-card-tag">{`<Part${partStr}>`}</span>
            <span className="xhsSc-card-num" aria-hidden="true">{partStr}</span>
            <div className="xhsSc-card-foot">
              <span className="xhsSc-card-name">{activeChapter.zh}</span>
              <span className="xhsSc-card-en">{activeChapter.en}</span>
            </div>
            {showDecorations && (
              <React.Fragment>
                <ScSpark size={34} color="#ffffff" style={{ position: 'absolute', top: -20, right: -8 }} />
                <span aria-hidden="true" className="xhsSc-ring" style={{ top: -26, right: 40 }} />
              </React.Fragment>
            )}
          </div>
        </div>
        <p className="xhsSc-lead">{lead}</p>
      </div>

      {showIndex && (
        <aside className="xhsSc-index">
          <div className="xhsSc-index-kicker">{indexKicker}</div>
          <ul className="xhsSc-list">
            {shown.map((c, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              return (
                <li key={i} className={'xhsSc-item' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}>
                  <span className="xhsSc-item-no">{c.no}</span>
                  <span className="xhsSc-item-zh">{c.zh}</span>
                  <span className="xhsSc-item-en">{c.en}</span>
                  {hot && <span className="xhsSc-item-mark" aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        </aside>
      )}

      {showDecorations && (
        <React.Fragment>
          <ScSpark size={20} color="#FFC700" style={{ position: 'absolute', left: 96, bottom: 96 }} />
          <ScSpark size={18} color="#FF9FE2" style={{ position: 'absolute', right: 470, top: 120 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSSC_CSS = `
  .xhsSc-root{ padding:120px 120px; position:relative; display:flex; align-items:center; gap:90px; }
  .xhsSc-root::before{ content:''; position:absolute; inset:0;
    background:radial-gradient(1100px 760px at 22% 50%, color-mix(in srgb, var(--c) 16%, transparent), transparent 70%);
    pointer-events:none; }

  .xhsSc-left{ position:relative; flex:1; min-width:0; display:flex; flex-direction:column; align-items:flex-start; }

  /* 实心霓虹海报卡（沿用目录页卡片效果） */
  .xhsSc-hero{ position:relative; }
  .xhsSc-card{ position:relative; width:460px; height:500px; border-radius:44px; box-sizing:border-box;
    padding:42px 44px; transform:rotate(-3deg);
    background:linear-gradient(158deg, color-mix(in srgb, var(--c) 90%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 74%, #000) 100%);
    display:flex; flex-direction:column;
    box-shadow:18px 20px 0 0 rgba(7,7,7,.92), 0 26px 50px rgba(0,0,0,.45),
      0 0 90px color-mix(in srgb, var(--c) 30%, transparent), inset 0 3px 0 rgba(255,255,255,.5); }
  .xhsSc-card-tag{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; color:#0a0a0a; opacity:.82; }
  .xhsSc-card-num{ font-family:"Space Mono",monospace; font-weight:700; font-size:240px; line-height:.84;
    color:#000; letter-spacing:-.04em; margin:2px 0 auto -8px; }
  .xhsSc-card-foot{ display:flex; flex-direction:column; gap:8px; }
  .xhsSc-card-name{ font-size:64px; font-weight:900; color:#000; line-height:1; letter-spacing:.02em; }
  .xhsSc-card-en{ font-family:"Space Mono",monospace; font-size:18px; letter-spacing:.14em; color:rgba(0,0,0,.6); }

  .xhsSc-lead{ margin:66px 0 0; max-width:560px; font-size:26px; line-height:1.7; font-weight:500; color:#b4b4b4; }
  .xhsSc-lead::before{ content:''; display:block; width:52px; height:4px; border-radius:2px; margin-bottom:20px;
    background:var(--c); box-shadow:0 0 16px color-mix(in srgb, var(--c) 55%, transparent); }

  .xhsSc-index{ width:430px; flex-shrink:0; }
  .xhsSc-index-kicker{ font-family:"Space Mono",monospace; font-size:21px; letter-spacing:.16em;
    color:#6f6f6f; margin-bottom:26px; }
  .xhsSc-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:18px; }
  .xhsSc-item{ position:relative; display:grid; grid-template-columns:auto 1fr; column-gap:20px; row-gap:2px;
    align-items:center; padding:20px 26px; border-radius:18px;
    background:linear-gradient(160deg,#171717,#0e0e0e); border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsSc-item.is-dim{ opacity:.5; filter:saturate(.7); }
  /* 高亮项 = 实心霓虹卡 */
  .xhsSc-item.is-hot{ transform:translateX(-12px) rotate(-1.6deg); border-color:transparent;
    background:linear-gradient(158deg, color-mix(in srgb, var(--c) 90%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 74%, #000) 100%);
    box-shadow:11px 13px 0 0 rgba(7,7,7,.92), 0 0 70px color-mix(in srgb, var(--c) 42%, transparent),
      inset 0 3px 0 rgba(255,255,255,.5); }
  .xhsSc-item-no{ grid-row:1 / span 2; font-family:"Space Mono",monospace; font-size:42px; font-weight:700;
    color:#5a5a5a; }
  .xhsSc-item.is-hot .xhsSc-item-no{ color:#0a0a0a; opacity:.85; }
  .xhsSc-item-zh{ font-size:32px; font-weight:900; color:#eaeaea; }
  .xhsSc-item.is-hot .xhsSc-item-zh{ color:#000; }
  .xhsSc-item-en{ font-family:"Space Mono",monospace; font-size:17px; letter-spacing:.14em; color:#6f6f6f; }
  .xhsSc-item.is-hot .xhsSc-item-en{ color:rgba(0,0,0,.6); }
  .xhsSc-item-mark{ position:absolute; right:22px; top:50%; transform:translateY(-50%);
    width:14px; height:14px; border-radius:50%; background:#000; opacity:.7; }

  .xhsSc-ring{ position:absolute; width:50px; height:50px; border-radius:50%;
    border:5px solid rgba(255,255,255,.9); box-shadow:0 0 22px rgba(255,255,255,.22); }
`;

const META = {
  id: 'section',
  label: '章节页',
  Component: Slide13Section,
  defaults: {
    partNumber: 2,
    accentTone: 'blue',
    showIndex: true,
    indexCount: 4,
    focusEnabled: true,
    focusIndex: 2,
    showDecorations: true,
    indexKicker: 'CONTENTS · 章节导航',
    lead: XHSSC_LEAD,
    chapters: XHSSC_CHAPTERS,
  },
  controls: [
    { key: 'partNumber', type: 'slider', label: '章节编号', min: 1, max: 6, step: 1, default: 2, desc: '大号 Part 编号徽章' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'blue', desc: '页面主色调' },
    { key: 'showIndex', type: 'toggle', label: '章节索引', default: true, desc: '右侧章节导航列表' },
    { key: 'indexCount', type: 'slider', label: '索引条目', min: 2, max: 5, step: 1, default: 4, showIf: (v) => v.showIndex, desc: '索引列表条目数量' },
    { key: 'focusEnabled', type: 'toggle', label: '当前高亮', default: true, showIf: (v) => v.showIndex, desc: '高亮当前章节' },
    { key: 'focusIndex', type: 'slider', label: '当前序号', min: 1, max: 5, step: 1, default: 2, maxFromKey: 'indexCount', showIf: (v) => v.showIndex && v.focusEnabled, desc: '当前章节的序号' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
    { type: 'section', label: '文案' },
    { key: 'lead', type: 'textarea', label: '导语', rows: 3, default: XHSSC_LEAD, desc: '海报卡下方导语' },
    { key: 'indexKicker', type: 'text', label: '索引眉标', default: 'CONTENTS · 章节导航', desc: '右侧索引标题', showIf: (v) => v.showIndex },
    { type: 'section', label: '数据 · 章节' },
    {
      key: 'chapters', type: 'list', label: '章节', itemLabel: '章节', countFromKey: 'indexCount',
      fields: [{ key: 'no', label: '编号' }, { key: 'zh', label: '中文名' }, { key: 'en', label: '英文名' }],
      default: XHSSC_CHAPTERS, desc: '章节列表：编号 / 中文 / 英文（海报卡标题取 partNumber 对应项）',
    },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide13Section.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide13Section;
