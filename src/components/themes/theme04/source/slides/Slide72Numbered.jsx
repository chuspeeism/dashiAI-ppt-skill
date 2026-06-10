/*
 * Slide72Numbered — 极简编号章节（章节页 · 排版极简新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsNb- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与 Section（海报卡+索引）/ Chapter（幽灵大字）/ CoverSection（整屏图背）/ Split（分屏面板）互补：
 * 本页是「极简编号」——细顶线 + 小号 PART 编号 + 超大中英居中标题 + 底部分章步进轨，
 * 不靠幽灵巨数、不靠实色面板，纯留白与排版立纲。文本写死，partNumber 仅切徽章/步进位置。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  partNumber      number 当前章节编号           默认 6   范围 1–stepCount
 *  accentTone      enum   主色调(通用命名)        默认 'pink' 可选 green/yellow/blue/pink
 *  stepCount       number 底部步进轨段数(3–7)     默认 6
 *  showStepper     bool   底部分章步进轨显隐       默认 true
 *  showRule        bool   顶部细分隔线显隐         默认 true
 *  showKana        bool   标题旁竖排英文小注显隐   默认 true
 *  showDecorations bool   星芒等点缀显隐          默认 true
 *
 * 文本写死在组件内，不做参数化。
 * 迁移：import Slide72Numbered, { defaults, controls } from './Slide72Numbered.jsx'
 */
import React from 'react';

const XHSNB_TONES = { green: '#27E021', yellow: '#FFC700', blue: '#15A7F0', pink: '#FF9FE2' };
// 章节信息（写死）
const XHSNB_CHAPTER = { zh: '结论与展望', en: 'CONCLUSION', tag: '本章导读 · FINAL CHAPTER', sub: '把全篇收束成一句判断' };

function NbSpark({ size = 22, color = '#fff', style }) {
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

function Slide72Numbered(props) {
  const {
      chapterData = XHSNB_CHAPTER,
    partNumber = 6,
    accentTone = 'pink',
    stepCount = 6,
    showStepper = true,
    showRule = true,
    showKana = true,
    showDecorations = true,
  } = props;

  const accent = XHSNB_TONES[accentTone] || XHSNB_TONES.pink;
  const steps = Math.max(3, Math.min(7, stepCount));
  const part = Math.max(1, Math.min(steps, partNumber));
  const partStr = String(part).padStart(2, '0');

  return (
    <section className="xhs-base xhsNb-root" data-label="极简编号章节" data-screen-label="极简编号章节"
      style={{ '--c': accent }}>
      <style>{XHSNB_CSS}</style>

      <div className="xhsNb-topbar">
        <span className="xhsNb-tag">{chapterData.tag}</span>
        {showRule && <span className="xhsNb-rule" aria-hidden="true" />}
        <span className="xhsNb-part">{`PART ${partStr} / ${String(steps).padStart(2, '0')}`}</span>
      </div>

      <div className="xhsNb-center">
        <span className="xhsNb-bignum" aria-hidden="true">{partStr}</span>
        <div className="xhsNb-titleWrap">
          <h2 className="xhsNb-zh">{chapterData.zh}</h2>
          {showKana && <span className="xhsNb-en">{chapterData.en}</span>}
        </div>
        <p className="xhsNb-sub">{chapterData.sub}</p>
      </div>

      {showStepper && (
        <div className="xhsNb-stepper">
          {Array.from({ length: steps }).map((_, i) => {
            const done = i + 1 < part;
            const cur = i + 1 === part;
            return (
              <div key={i} className={'xhsNb-step' + (cur ? ' is-cur' : done ? ' is-done' : '')}>
                <span className="xhsNb-sn">{String(i + 1).padStart(2, '0')}</span>
                <span className="xhsNb-sbar" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      )}

      {showDecorations && (
        <React.Fragment>
          <NbSpark size={24} color={accent} style={{ position: 'absolute', right: 150, top: 150 }} />
          <NbSpark size={15} color="#FFC700" style={{ position: 'absolute', left: 120, bottom: 188 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSNB_CSS = `
  .xhsNb-root{ padding:70px 110px 64px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsNb-root::before{ content:""; position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(900px 640px at 50% 42%, color-mix(in srgb, var(--c) 11%, transparent), transparent 70%); }

  .xhsNb-topbar{ position:relative; flex:0 0 auto; display:flex; align-items:center; gap:28px; }
  .xhsNb-tag{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; letter-spacing:.16em; color:var(--c);
    text-shadow:0 0 18px color-mix(in srgb, var(--c) 30%, transparent); white-space:nowrap; }
  .xhsNb-rule{ flex:1 1 auto; height:2px; background:linear-gradient(90deg, color-mix(in srgb, var(--c) 50%, transparent), rgba(255,255,255,.08)); }
  .xhsNb-part{ font-family:"Space Mono",monospace; font-size:22px; font-weight:700; letter-spacing:.12em; color:#7a7a7a; white-space:nowrap; }

  .xhsNb-center{ position:relative; flex:1 1 auto; min-height:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center; text-align:center; }
  .xhsNb-bignum{ font-family:"Space Mono",monospace; font-weight:700; font-size:150px; line-height:.9; letter-spacing:.02em;
    color:transparent; -webkit-text-stroke:2.5px color-mix(in srgb, var(--c) 64%, #444);
    text-shadow:0 0 40px color-mix(in srgb, var(--c) 16%, transparent); margin-bottom:6px; }
  .xhsNb-titleWrap{ display:flex; flex-direction:column; align-items:center; gap:14px; }
  .xhsNb-zh{ margin:0; font-size:128px; font-weight:900; color:#fff; line-height:.98; letter-spacing:.06em;
    text-shadow:0 0 60px color-mix(in srgb, var(--c) 26%, transparent); }
  .xhsNb-en{ font-family:"Space Mono",monospace; font-size:30px; font-weight:700; letter-spacing:.42em; color:var(--c);
    text-shadow:0 0 22px color-mix(in srgb, var(--c) 34%, transparent); padding-left:.42em; }
  .xhsNb-sub{ margin:34px 0 0; font-size:28px; font-weight:600; color:#9c9c9c; letter-spacing:.02em; }

  .xhsNb-stepper{ position:relative; flex:0 0 auto; display:flex; gap:20px; align-items:flex-end; }
  .xhsNb-step{ flex:1 1 0; display:flex; flex-direction:column; gap:12px; }
  .xhsNb-sn{ font-family:"Space Mono",monospace; font-size:18px; font-weight:700; letter-spacing:.06em; color:#555; }
  .xhsNb-sbar{ height:6px; border-radius:999px; background:rgba(255,255,255,.1); }
  .xhsNb-step.is-done .xhsNb-sn{ color:#9a9a9a; }
  .xhsNb-step.is-done .xhsNb-sbar{ background:rgba(255,255,255,.28); }
  .xhsNb-step.is-cur .xhsNb-sn{ color:var(--c); text-shadow:0 0 16px color-mix(in srgb, var(--c) 50%, transparent); }
  .xhsNb-step.is-cur .xhsNb-sbar{ height:8px; background:var(--c);
    box-shadow:0 0 22px color-mix(in srgb, var(--c) 60%, transparent), inset 0 2px 0 rgba(255,255,255,.5); }
`;

const META = {
  id: 'numbered',
  label: '极简编号章节',
  Component: Slide72Numbered,
  defaults: {
      chapterData: XHSNB_CHAPTER,
    partNumber: 6,
    accentTone: 'pink',
    stepCount: 6,
    showStepper: true,
    showRule: true,
    showKana: true,
    showDecorations: true,
  },
  controls: [
    { key: 'chapterData', type: 'list', label: 'chapterData', itemLabel: '数据', single: true, fields: [{ key: "zh", label: "zh" }, { key: "en", label: "en" }, { key: "tag", label: "tag" }, { key: "sub", label: "sub" }], default: XHSNB_CHAPTER, desc: '默认数据内容' },
    { key: 'partNumber', type: 'slider', label: '章节编号', min: 1, max: 7, step: 1, default: 6, maxFromKey: 'stepCount', desc: '当前章节编号（同时定位步进位置）' },
    { key: 'accentTone', type: 'radio', label: '主色调', options: ['green', 'yellow', 'blue', 'pink'], optionLabels: ['绿', '黄', '蓝', '粉'], default: 'pink', desc: '页面主色调(通用命名)' },
    { key: 'stepCount', type: 'slider', label: '步进段数', min: 3, max: 7, step: 1, default: 6, desc: '底部分章步进轨段数' },
    { key: 'showStepper', type: 'toggle', label: '步进轨', default: true, desc: '底部分章步进轨' },
    { key: 'showRule', type: 'toggle', label: '顶部细线', default: true, desc: '顶部细分隔线' },
    { key: 'showKana', type: 'toggle', label: '英文小注', default: true, desc: '标题下英文小注' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide72Numbered.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide72Numbered;
