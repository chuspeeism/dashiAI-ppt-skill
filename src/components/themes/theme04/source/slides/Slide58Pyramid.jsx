/*
 * Slide58Pyramid — 估值金字塔（图表 / 结构页 · 分层梯形金字塔，新原型）
 * 独立组件：仅通过 props 控制内容与样式，不依赖 Tweaks / 预览运行时。
 * CSS 前缀 xhsPy- ，样式内联、不污染 :root，作用域收在 .xhs-base。
 *
 * 与漏斗(Funnel)/ 环形(Donut)/ 树图(Treemap) 互补：本页用「金字塔」表达估值分层——
 * 越往上越稀缺（少数超级独角兽坐顶端）、越往下越宽（大量成长梯队垫底），
 * 每层梯形内是数量，右栏注解给门槛 / 代表公司。chartVariant=bars 退回横向柱。
 * 数据为调研整理与推演（报告 2.x / 3.x 估值分层 · 家数为示意量级）。
 *
 * ── 可调参数（controls）────────────────────────────────────────────────
 *  tierCount       number 展示的分层数(2–4)        默认 4
 *  chartVariant    enum   图表类型                  默认 'pyramid' 可选 'pyramid'|'bars'
 *  focusEnabled    bool   重点层高亮开关            默认 true
 *  focusIndex      number 重点层序号(从1起·顶为1)   默认 1   范围 1–tierCount
 *  showCount       bool   层内家数数字显隐          默认 true
 *  showExamples    bool   右栏代表公司芯片显隐       默认 true
 *  showDecorations bool   星芒等点缀显隐           默认 true
 *
 * 文本/数据写死在组件内，不做参数化。
 * 迁移：import Slide58Pyramid, { defaults, controls } from './Slide58Pyramid.jsx'
 */
import React from 'react';
import { HL, hlControls, hlDefaults } from './_Highlight.jsx';

// 估值分层（顶→底，窄→宽 = 稀缺→普遍）：层名 / 门槛 / 家数 / 单位 / 权重(柱状用) / 代表 / 主色
const XHSPY_TIERS = [
  { name: '超级独角兽', en: 'SUPER', threshold: '≥ 1000 亿美元', count: '3', unit: '家', weight: 3, reps: ['OpenAI', 'xAI', 'Databricks'], color: '#27E021' },
  { name: '巨型独角兽', en: 'MEGA', threshold: '≥ 100 亿美元', count: '9', unit: '家', weight: 9, reps: ['Anthropic', 'CoreWeave', 'Scale AI'], color: '#15A7F0' },
  { name: '独角兽', en: 'UNICORN', threshold: '≥ 10 亿美元', count: '30+', unit: '家', weight: 33, reps: ['Figure', 'Perplexity', 'Glean'], color: '#FFC700' },
  { name: '成长梯队', en: 'GROWTH', threshold: '1 – 10 亿美元', count: '55+', unit: '笔', weight: 58, reps: ['大量早 / 中期玩家'], color: '#FF9FE2' },
];

function PySpark({ size = 22, color = '#fff', style }) {
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

function lerp(a, b, t) { return a + (b - a) * t; }


const SLIDE58PYRAMID_COPY = {
  text001: "估值分层 · THE PYRAMID",
  text002: "估值金字塔，",
  text003: "越往上越稀缺",
  text004: "↑",
  text005: "越往上 · 越稀缺",
  text006: "估值门槛 ·",
  text007: "数据为调研整理与推演 · 家数 / 笔数为 2024 ≥1 亿美元 AI 融资玩家的估值分层（示意量级）· 梯形宽度示意各层规模",
};
function Slide58Pyramid(props) {
  const {
      copy = SLIDE58PYRAMID_COPY,
      tiersData = XHSPY_TIERS,
    tierCount = 4,
    chartVariant = 'pyramid',
    focusEnabled = true,
    focusIndex = 1,
    showCount = true,
    showExamples = true,
    showDecorations = true,
    hlStyle = 'glass',
    hlTilt = 2,
  } = props;

  const n = Math.max(2, Math.min(4, tierCount));
  const tiers = tiersData.slice(0, n);
  const focus = Math.max(1, Math.min(n, focusIndex)) - 1;

  const apexHalf = 9, baseHalf = 49; // 梯形半宽（%）：顶窄底宽
  const isPyramid = chartVariant === 'pyramid';
  const maxW = Math.max.apply(null, tiers.map((t) => t.weight));

  return (
    <section className="xhs-base xhsPy-root" data-label="估值金字塔" data-screen-label="估值金字塔">
      <style>{XHSPY_CSS}</style>

      <header className="xhsPy-head">
        <div className="xhsPy-kicker">{copy.text001}</div>
        <h2 className="xhsPy-title">{copy.text002}<HL color="#27E021" variant={hlStyle} tilt={-hlTilt}>{copy.text003}</HL>
        </h2>
      </header>

      {isPyramid ? (
        <div className="xhsPy-stage">
          <div className="xhsPy-scarce" aria-hidden="true">
            <span className="xhsPy-arrow">{copy.text004}</span><span>{copy.text005}</span>
          </div>

          <div className="xhsPy-tower">
            {tiers.map((t, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              const topH = lerp(apexHalf, baseHalf, i / n);
              const botH = lerp(apexHalf, baseHalf, (i + 1) / n);
              const clip = `polygon(${50 - topH}% 0, ${50 + topH}% 0, ${50 + botH}% 100%, ${50 - botH}% 100%)`;
              return (
                <div key={i} className={'xhsPy-tier' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                  style={{ '--c': t.color, clipPath: clip, WebkitClipPath: clip }}>
                  {showCount && (
                    <span className="xhsPy-tierCount">{t.count}<i>{t.unit}</i></span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="xhsPy-notes">
            {tiers.map((t, i) => {
              const hot = focusEnabled && i === focus;
              const dim = focusEnabled && i !== focus;
              return (
                <div key={i} className={'xhsPy-note' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                  style={{ '--c': t.color }}>
                  <span className="xhsPy-dot" />
                  <div className="xhsPy-noteBody">
                    <div className="xhsPy-noteTop">
                      <span className="xhsPy-noteName">{t.name}</span>
                      <span className="xhsPy-noteEn">{t.en}</span>
                    </div>
                    <span className="xhsPy-noteTh">{copy.text006}{t.threshold}</span>
                    {showExamples && (
                      <div className="xhsPy-chips">
                        {t.reps.map((r, j) => <span key={j} className="xhsPy-chip">{r}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="xhsPy-bars">
          {tiers.map((t, i) => {
            const hot = focusEnabled && i === focus;
            const dim = focusEnabled && i !== focus;
            const w = Math.max(12, (t.weight / maxW) * 100);
            return (
              <div key={i} className={'xhsPy-bar' + (hot ? ' is-hot' : '') + (dim ? ' is-dim' : '')}
                style={{ '--c': t.color }}>
                <div className="xhsPy-barHd">
                  <span className="xhsPy-barName">{t.name}</span>
                  <span className="xhsPy-barTh">{t.threshold}</span>
                </div>
                <div className="xhsPy-barRow">
                  <span className="xhsPy-track"><span className="xhsPy-fill" style={{ width: w + '%' }} /></span>
                  {showCount && <span className="xhsPy-barCount">{t.count}<i>{t.unit}</i></span>}
                </div>
                {showExamples && (
                  <div className="xhsPy-chips">
                    {t.reps.map((r, j) => <span key={j} className="xhsPy-chip">{r}</span>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="xhsPy-caption">{copy.text007}</div>

      {showDecorations && (
        <React.Fragment>
          <PySpark size={24} color="#FFC700" style={{ position: 'absolute', right: 96, top: 150 }} />
          <PySpark size={16} color="#FF9FE2" style={{ position: 'absolute', left: 80, bottom: 96 }} />
        </React.Fragment>
      )}
    </section>
  );
}

const XHSPY_CSS = `
  .xhsPy-root{ padding:74px 110px 52px; position:relative; display:flex; flex-direction:column; box-sizing:border-box; height:100%; }
  .xhsPy-head{ flex:0 0 auto; margin-bottom:22px; }
  .xhsPy-kicker{ font-family:"Space Mono",monospace; font-size:24px; letter-spacing:.14em; color:#7c7c7c; margin-bottom:14px; }
  .xhsPy-title{ margin:0; font-size:54px; font-weight:900; color:#fff; line-height:1.12; }

  .xhsPy-stage{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:64px 1fr 560px; gap:36px; align-items:stretch; }

  .xhsPy-scarce{ display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:14px; padding-top:18px;
    font-family:"Space Mono",monospace; font-size:18px; font-weight:700; letter-spacing:.06em; color:#7c7c7c;
    writing-mode:vertical-rl; }
  .xhsPy-arrow{ font-size:30px; color:#27E021; text-shadow:0 0 16px rgba(39,224,33,.5); writing-mode:horizontal-tb; }

  /* —— 金字塔塔身 —— */
  .xhsPy-tower{ display:flex; flex-direction:column; gap:6px; min-width:0; }
  .xhsPy-tier{ flex:1 1 0; min-height:0; position:relative; display:flex; align-items:center; justify-content:center;
    background:linear-gradient(168deg, color-mix(in srgb, var(--c) 88%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 78%, #000) 100%);
    box-shadow:inset 0 3px 0 rgba(255,255,255,.5), inset 0 -16px 30px color-mix(in srgb, var(--c) 60%, #000);
    transition:opacity .3s ease, filter .3s ease, transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsPy-tier.is-dim{ opacity:.4; filter:saturate(.65) brightness(.9); }
  .xhsPy-tier.is-hot{ filter:drop-shadow(0 0 30px color-mix(in srgb, var(--c) 60%, transparent)); z-index:2; }
  .xhsPy-tierCount{ font-family:"Space Mono",monospace; font-size:46px; font-weight:700; color:#06140f; line-height:1;
    display:flex; align-items:baseline; text-shadow:0 1px 0 rgba(255,255,255,.4); transition:transform .3s cubic-bezier(.2,.8,.2,1); }
  .xhsPy-tierCount i{ font-style:normal; font-size:21px; font-weight:700; margin-left:5px; }
  .xhsPy-tier.is-hot .xhsPy-tierCount{ transform:scale(1.12); }

  /* —— 右栏注解（与塔身逐层对齐：各 flex:1） —— */
  .xhsPy-notes{ display:flex; flex-direction:column; gap:6px; min-width:0; }
  .xhsPy-note{ flex:1 1 0; min-height:0; display:flex; align-items:center; gap:18px; padding:14px 24px; border-radius:16px;
    background:linear-gradient(120deg,#151515,#0b0b0b); border:1.5px solid rgba(255,255,255,.07);
    transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s; }
  .xhsPy-note.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsPy-note.is-hot{ border-color:var(--c); box-shadow:0 0 48px color-mix(in srgb, var(--c) 22%, transparent); }
  .xhsPy-dot{ width:16px; height:16px; border-radius:50%; background:var(--c); flex:0 0 auto;
    box-shadow:0 0 14px color-mix(in srgb, var(--c) 60%, transparent); }
  .xhsPy-noteBody{ min-width:0; display:flex; flex-direction:column; gap:7px; }
  .xhsPy-noteTop{ display:flex; align-items:baseline; gap:14px; }
  .xhsPy-noteName{ font-size:31px; font-weight:800; color:#fff; line-height:1; }
  .xhsPy-note.is-hot .xhsPy-noteName{ color:var(--c); }
  .xhsPy-noteEn{ font-family:"Space Mono",monospace; font-size:16px; font-weight:700; letter-spacing:.1em; color:#6e6e6e; }
  .xhsPy-noteTh{ font-size:20px; font-weight:700; color:var(--c); }
  .xhsPy-chips{ display:flex; flex-wrap:wrap; gap:8px; }
  .xhsPy-chip{ font-size:17px; font-weight:700; color:#cfcfcf; padding:4px 13px; border-radius:999px;
    background:color-mix(in srgb, var(--c) 12%, #0c0c0c); border:1.5px solid color-mix(in srgb, var(--c) 30%, transparent); white-space:nowrap; }

  /* —— bars 备用模式 —— */
  .xhsPy-bars{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:center; gap:16px; }
  .xhsPy-bar{ padding:18px 28px; border-radius:18px; background:linear-gradient(120deg,#151515,#0c0c0c);
    border:1.5px solid rgba(255,255,255,.07); transition:opacity .3s, filter .3s, border-color .3s, box-shadow .3s; }
  .xhsPy-bar.is-dim{ opacity:.45; filter:saturate(.7); }
  .xhsPy-bar.is-hot{ border-color:var(--c); box-shadow:0 0 48px color-mix(in srgb, var(--c) 22%, transparent); }
  .xhsPy-barHd{ display:flex; align-items:baseline; gap:16px; margin-bottom:12px; }
  .xhsPy-barName{ font-size:30px; font-weight:800; color:#fff; }
  .xhsPy-bar.is-hot .xhsPy-barName{ color:var(--c); }
  .xhsPy-barTh{ font-size:20px; font-weight:700; color:var(--c); }
  .xhsPy-barRow{ display:flex; align-items:center; gap:20px; }
  .xhsPy-track{ flex:1; height:22px; border-radius:999px; background:#1a1a1a; overflow:hidden; border:1px solid rgba(255,255,255,.06); }
  .xhsPy-fill{ display:block; height:100%; border-radius:999px;
    background:linear-gradient(90deg, color-mix(in srgb, var(--c) 65%, #000), var(--c));
    box-shadow:0 0 18px color-mix(in srgb, var(--c) 36%, transparent), inset 0 1px 0 rgba(255,255,255,.35); }
  .xhsPy-barCount{ font-family:"Space Mono",monospace; font-size:34px; font-weight:700; color:#fff; display:flex; align-items:baseline; }
  .xhsPy-barCount i{ font-style:normal; font-size:18px; font-weight:700; margin-left:5px; color:var(--c); }
  .xhsPy-bar .xhsPy-chips{ margin-top:12px; }

  .xhsPy-caption{ flex:0 0 auto; margin-top:20px; font-family:"Space Mono",monospace; font-size:16px; letter-spacing:.04em; color:#6a6a6a; }
`;

const META = {
  id: 'pyramid',
  label: '估值金字塔',
  Component: Slide58Pyramid,
  defaults: {
      copy: SLIDE58PYRAMID_COPY,
      tiersData: XHSPY_TIERS,
    ...hlDefaults,
    tierCount: 4,
    chartVariant: 'pyramid',
    focusEnabled: true,
    focusIndex: 1,
    showCount: true,
    showExamples: true,
    showDecorations: true,
  },
  controls: [
    { type: 'section', label: '文案 / 单位' },
    { key: 'copy', type: 'list', label: '可见文案', itemLabel: '文案', single: true, fields: [{ key: "text001", label: "text001" }, { key: "text002", label: "text002" }, { key: "text003", label: "text003" }, { key: "text004", label: "text004" }, { key: "text005", label: "text005" }, { key: "text006", label: "text006" }, { key: "text007", label: "text007" }], default: SLIDE58PYRAMID_COPY, desc: '页面中的固定可见文案、单位和图片槽提示' },
    { key: 'tiersData', type: 'list', label: 'tiersData', itemLabel: '数据', fields: [{ key: "name", label: "name" }, { key: "en", label: "en" }, { key: "threshold", label: "threshold" }, { key: "count", label: "count" }, { key: "unit", label: "unit" }, { key: "weight", label: "weight" }, { key: "color", label: "color" }], default: XHSPY_TIERS, desc: '默认数据内容' },
    ...hlControls,
    { key: 'tierCount', type: 'slider', label: '分层数', min: 2, max: 4, step: 1, default: 4, desc: '展示的估值分层数' },
    { key: 'chartVariant', type: 'radio', label: '图表类型', options: ['pyramid', 'bars'], optionLabels: ['金字塔', '横向柱'], default: 'pyramid', desc: '金字塔 / 横向柱状' },
    { key: 'focusEnabled', type: 'toggle', label: '重点突出', default: true, desc: '是否高亮某一层' },
    { key: 'focusIndex', type: 'slider', label: '重点层序号', min: 1, max: 4, step: 1, default: 1, maxFromKey: 'tierCount', showIf: (v) => v.focusEnabled, desc: '被高亮层的序号（顶为1）' },
    { key: 'showCount', type: 'toggle', label: '家数数字', default: true, desc: '层内家数数字' },
    { key: 'showExamples', type: 'toggle', label: '代表公司', default: true, desc: '右栏代表公司芯片' },
    { key: 'showDecorations', type: 'toggle', label: '装饰元素', default: true, desc: '星芒等点缀' },
  ],
};

META.defaultProps = META.defaults;
export const defaultProps = META.defaultProps;
Slide58Pyramid.defaultProps = defaultProps;
export const defaults = META.defaults;
export const controls = META.controls;
export const meta = META;
export default Slide58Pyramid;
