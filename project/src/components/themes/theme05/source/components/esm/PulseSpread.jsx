/* =========================================================================
   PulseSpread — P60 chart page ("分散型应用落地 / Distribution Dot-matrix" archetype).
   A generic dispersion chart: an N×M dot-matrix where a deterministic subset of
   cells is "active", each tinted by one of K categories, reading as a scattered /
   decentralized distribution — paired with a headline metric pair and a category
   legend (with per-category cell counts). One category can be emphasized. Optional
   0–n ratio-aware image slots. The distinguishing element is the scattered matrix
   (vs a single bar/donut). The reusable template for any "dispersed footprint /
   coverage / long-tail distribution" page.

   Self-contained & migratable: depends only on React (+ an injected/`window`
   PulseImageFrame only when imageCount>0) and the shared .pulse-sprd / .pulse-*
   CSS. Text/data live in COPY (not prop-driven, per spec); everything else by props.
   `export default PulseSpread; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';
import PulseImageFrame from './PulseImageFrame.jsx';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "OTHER REGIONS",
  title: "分散型应用落地",
  sheet: "CHART · 60 / 80",
  locale: "其他地区机会",
  lead: "其他地区融资规模较小，但出现行业专用模型和本地化应用机会 —— 更适合做行业落地，而非争夺通用模型。",
  metrics: [
    ["融资额", "60", "亿美元"],
    ["市场占比", "6.2", "%"],
  ],
  matrixNote: "事件数 11 笔 · 平均单笔 5.5 亿美元",
  matrixCap: "区域分布",
  matrixUnit: "DISPERSED FOOTPRINT",
  categories: [
    { name: "行业专用模型", en: "VERTICAL MODELS", c: SPECTRUM[0] },
    { name: "本地化应用",   en: "LOCALIZED APPS",  c: SPECTRUM[3] },
    { name: "垂直 SaaS",    en: "VERTICAL SAAS",   c: SPECTRUM[5] },
    { name: "区域服务",     en: "REGIONAL OPS",    c: SPECTRUM[1] },
  ],
  legendCap: "落地方向",
  legendUnit: "BY THEME",
  mediaCap: "落地场景",
  mediaUnit: "DROP IMAGE",
  conclusion: "本地行业资源也能形成应用机会。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }
// Deterministic active-cell scatter + category assignment (stable across renders).
function scatter(total, count, cats) {
  const picks = []; let s = 12289;
  for (let i = 0; i < total * 8 && picks.length < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * total);
    if (picks.indexOf(idx) < 0) picks.push(idx);
  }
  return picks.map((idx, k) => ({ idx, cat: k % cats }));
}

const controls = [
  { key: "cols", type: "slider", label: "网格列数", default: 12, min: 8, max: 16, step: 1,
    description: "分布点阵的列数。" },
  { key: "rows", type: "slider", label: "网格行数", default: 6, min: 4, max: 8, step: 1,
    description: "分布点阵的行数。" },
  { key: "activeCount", type: "slider", label: "活跃单元数", default: 26, min: 6, max: 60, step: 1,
    description: "被点亮（有落地）的单元数量，散布呈现分散度（自动收敛到网格容量内）。" },
  { key: "categoryCount", type: "slider", label: "类别数量", default: 4, min: 2, max: 4, step: 1,
    description: "活跃单元的类别（配色 / 图例）数量。" },
  { key: "focusEnabled", type: "toggle", label: "重点类别", default: false,
    description: "是否突出某一类别（其余单元淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点类别序号", default: 1, min: 1, max: 4, step: 1,
    description: "被突出的类别序号（从 1 起）。" },
  { key: "showLegend", type: "toggle", label: "类别图例", default: true,
    description: "右侧带单元计数的类别图例。" },
  { key: "showCounts", type: "toggle", label: "图例计数", default: true,
    description: "图例中各类别的活跃单元计数。" },
  { key: "showMetrics", type: "toggle", label: "头部指标", default: true,
    description: "引导文案右侧的一对头部指标。" },
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 0, min: 0, max: 2, step: 1,
    description: "可选图片槽数量（0–2），按比例自适应；为 0 时不显示图片。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[1], options: SPECTRUM,
    description: "眉标 / 头部指标的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseSpread(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const cols = Math.max(8, Math.min(16, p.cols));
  const rows = Math.max(4, Math.min(8, p.rows));
  const total = cols * rows;
  const nCat = Math.max(2, Math.min(COPY.categories.length, p.categoryCount));
  const cats = COPY.categories.slice(0, nCat);
  const active = scatter(total, Math.min(p.activeCount, total - 1), nCat);
  const activeMap = {};
  active.forEach((a) => { activeMap[a.idx] = a.cat; });
  const counts = cats.map((_, ci) => active.filter((a) => a.cat === ci).length);
  const focusCat = p.focusEnabled ? Math.min(p.focusIndex, nCat) - 1 : -1;

  const nMetric = COPY.metrics.length;
  const metrics = COPY.metrics.slice(0, nMetric);

  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  return (
    <div className="pulse-slide pulse-sprd" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-sprd__body">
        <div className="pulse-sprd__lead-row">
          <div className="pulse-sprd__lead-wrap">
            <div className="pulse-sprd__locale">{COPY.locale}</div>
            <div className="pulse-sprd__lead">{COPY.lead}</div>
          </div>
          {p.showMetrics && (
            <div className="pulse-sprd__hm">
              {metrics.map((m, i) => (
                <div key={i} className="pulse-sprd__hm-item">
                  <span className="pulse-sprd__hm-v" style={{ color: accent }}>{m[1]}<small>{m[2]}</small></span>
                  <span className="pulse-sprd__hm-k">{m[0]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pulse-sprd__main">
          <div className="pulse-sprd__matrix">
            <div className="pulse-sprd__matrix-cap">
              <span className="pulse-label">{COPY.matrixCap}</span>
              <span className="pulse-mono">{COPY.matrixUnit}</span>
            </div>
            <div className="pulse-sprd__grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: total }).map((_, i) => {
                const ci = activeMap[i];
                if (ci === undefined) return <div key={i} className="pulse-sprd__cell" />;
                const dim = focusCat >= 0 && ci !== focusCat;
                return (
                  <div key={i} className={"pulse-sprd__cell pulse-sprd__cell--on" + (dim ? " pulse-sprd__cell--dim" : "")}
                    style={{ background: cats[ci].c }} />
                );
              })}
            </div>
            <div className="pulse-sprd__matrix-note">{COPY.matrixNote}</div>
          </div>

          <div className="pulse-sprd__side">
            {p.showLegend && (
              <div className="pulse-sprd__legend">
                <div className="pulse-sprd__legend-cap">
                  <span className="pulse-label">{COPY.legendCap}</span>
                  <span className="pulse-mono">{COPY.legendUnit}</span>
                </div>
                {cats.map((c, i) => {
                  const isFocus = focusCat === i;
                  const dim = focusCat >= 0 && !isFocus;
                  return (
                    <div key={i} className={"pulse-sprd__leg" + (isFocus ? " pulse-sprd__leg--focus" : "") + (dim ? " pulse-sprd__leg--dim" : "")}>
                      <span className="pulse-sprd__leg-dot" style={{ background: c.c }} />
                      <span className="pulse-sprd__leg-body">
                        <span className="pulse-sprd__leg-zh">{c.name}</span>
                        <span className="pulse-sprd__leg-en">{c.en}</span>
                      </span>
                      {p.showCounts && <span className="pulse-sprd__leg-n">{counts[i]}</span>}
                    </div>
                  );
                })}
              </div>
            )}
            {hasMedia && (
              <div className="pulse-sprd__media">
                <div className="pulse-sprd__media-cap">
                  <span className="pulse-label">{COPY.mediaCap}</span>
                  <span className="pulse-mono">{COPY.mediaUnit}</span>
                </div>
                <div className="pulse-sprd__media-row">
                  {Array.from({ length: nImg }).map((_, i) => {
                    const im = images[i] || {};
                    const grow = clampAR(im.ar);
                    return (
                      <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                        <Frame src={im.src || null} ar={im.ar || null} fill={true}
                          editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入落地场景图"
                          onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-sprd__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseSpread.controls = controls;
PulseSpread.defaults = defaults;
export default PulseSpread;
export { controls };
export { defaults };
