/* =========================================================================
   PulseMekko — P88 chart page ("变宽堆叠 / Marimekko" archetype).
   A generic MARIMEKKO (variable-width 100% stacked) chart: N columns whose
   WIDTH encodes each column's magnitude, each split into M stacked segments
   whose HEIGHT encodes the within-column share — a true two-dimensional
   part-to-whole in one figure. Shared segment colours read across columns; one
   column can be focused (others fade). The reusable template for any
   "size × composition" page (e.g. sector size × round mix).

   Self-contained: React + the shared .pulse-mekko / .pulse-* CSS. Text/data live
   in COPY (not prop-driven); structure & styling are prop-driven (see controls).
   `export default PulseMekko; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "Size × Composition",
  title: "赛道规模 × 轮次构成",
  sheet: "CHART · 88 / 90",
  intro: "列宽 = 赛道融资体量，列内分段 = 该赛道各轮次占比 —— 一张图同时读出「谁更大」与「钱在哪个阶段」。",
  unit: "亿美元",
  segs: [
    { name: "早期" }, { name: "成长期" }, { name: "后期" }, { name: "并购/上市" },
  ],
  cols: [
    { name: "基础设施", en: "Infra", total: 182, parts: [28, 64, 70, 20] },
    { name: "应用层", en: "Apps", total: 121, parts: [52, 44, 18, 7] },
    { name: "算力芯片", en: "Compute", total: 110, parts: [16, 38, 40, 16] },
    { name: "企业服务", en: "Enterprise", total: 64, parts: [22, 26, 12, 4] },
    { name: "医疗 AI", en: "Health", total: 47, parts: [20, 17, 8, 2] },
  ],
  conclusion: "基础设施不仅最大，且资金集中在后期 —— 兑现压力最高。",
};

const controls = [
  { key: "colCount", type: "slider", label: "列数量", default: 4, min: 2, max: 5, step: 1,
    description: "变宽列的数量（2–5）。列宽按各列体量自动分配。" },
  { key: "segmentCount", type: "slider", label: "分段数量", default: 4, min: 2, max: 4, step: 1,
    description: "每列内堆叠分段的数量（2–4）。列高按所选分段求和归一。" },
  { key: "focusEnabled", type: "toggle", label: "重点列", default: true,
    description: "是否突出某一列（其余列淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点序号", default: 1, min: 1, max: 5, step: 1,
    description: "重点列序号（按当前列顺序）。" },
  { key: "showSegValue", type: "toggle", label: "分段占比", default: true,
    description: "足够高的分段内显示其列内占比 %。" },
  { key: "showColTotal", type: "toggle", label: "列体量标注", default: true,
    description: "各列下方的体量数值与整体占比。" },
  { key: "showLegend", type: "toggle", label: "分段图例", default: true,
    description: "顶部的分段类别图例。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 重点列标记强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseMekko(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const nCol = Math.max(2, Math.min(COPY.cols.length, p.colCount));
  const nSeg = Math.max(2, Math.min(COPY.segs.length, p.segmentCount));
  const segs = COPY.segs.slice(0, nSeg);

  const cols = COPY.cols.slice(0, nCol).map((c) => {
    const parts = c.parts.slice(0, nSeg);
    const total = parts.reduce((a, b) => a + b, 0);
    return { name: c.name, en: c.en, parts, total };
  });
  const grand = cols.reduce((a, c) => a + c.total, 0);
  const focus = Math.min(p.focusIndex, nCol) - 1;

  return (
    <div className="pulse-slide pulse-mekko" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-mekko__body">
        <div className="pulse-mekko__top">
          {p.intro !== false && <div className="pulse-mekko__intro">{COPY.intro}</div>}
          {p.showLegend && (
            <div className="pulse-mekko__legend">
              {segs.map((s, i) => (
                <div key={i} className="pulse-mekko__leg">
                  <i style={{ background: SPECTRUM[i] }} /><span>{s.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pulse-mekko__plot">
          {cols.map((c, ci) => {
            const dim = p.focusEnabled && ci !== focus;
            return (
              <div key={ci} className={"pulse-mekko__col" + (dim ? " is-dim" : "")}
                style={{ flex: `${c.total} 1 0` }}>
                <div className="pulse-mekko__stack">
                  {c.parts.map((v, si) => {
                    const pct = Math.round((v / c.total) * 100);
                    return (
                      <div key={si} className="pulse-mekko__seg" style={{ flex: `${v} 1 0`, background: SPECTRUM[si] }}>
                        {p.showSegValue && pct >= 14 && <span className="pulse-mekko__seg-v">{pct}%</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="pulse-mekko__col-foot">
                  <span className="pulse-mekko__col-name">{c.name}</span>
                  {p.showColTotal && (
                    <span className="pulse-mekko__col-total">
                      {c.total}<small>{COPY.unit} · {Math.round((c.total / grand) * 100)}%</small>
                    </span>
                  )}
                  {p.focusEnabled && ci === focus && <span className="pulse-mekko__col-flag" style={{ background: accent }} />}
                </div>
              </div>
            );
          })}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-mekko__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseMekko.controls = controls;
PulseMekko.defaults = defaults;
export default PulseMekko;
export { controls };
export { defaults };
