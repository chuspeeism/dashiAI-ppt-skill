/* =========================================================================
   PulseSqueeze — P76 chart page ("壁垒被压缩 / Moat Compression" archetype).
   A generic chart_page whose DISTINGUISHING element is a COMPRESSION plot: N
   pressure rows where a colored encroachment fill (value = pressure) drives an
   inward pincer arrow toward a fixed "moat wall" on the right, leaving a
   shrinking dark RESIDUAL segment (the defensible space that remains). A dark
   anchor card reads out the minimum residual — the punchline. Complementary to
   the one-way pipeline (P48) and closed loop (P54): here the story is sides
   closing in on a core. The reusable template for any "pressures eroding a
   position / shrinking headroom · competitive landscape" page.

   Self-contained: React + .pulse-* CSS only; everything by props. Text/data live
   in COPY (not prop-driven).
   `export default PulseSqueeze; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
// Each pressure: k+en, p = encroachment %, residual = 100 - p.
const COPY = {
  eyebrow: "OPEN SOURCE RISK",
  title: "壁垒被压缩",
  sheet: "RISK · 76 / 80",
  lead: "开源模型降低能力门槛，大厂生态压缩初创公司的独立空间。",
  plotCap: "竞争格局 · 壁垒侵蚀",
  plotUnit: "PRESSURE → MOAT",
  pressures: [
    { k: "开源模型性能逼近", en: "OPEN SOURCE", p: 86, color: SPECTRUM[0] },
    { k: "大厂产品覆盖",     en: "PLATFORM",    p: 72, color: SPECTRUM[5] },
    { k: "企业自建意愿",     en: "IN-HOUSE",    p: 34, color: SPECTRUM[3] },
  ],
  wallLabel: "壁垒墙",
  anchorNum: "14",
  anchorUnit: "%",
  anchorLabel: "剩余独立壁垒空间",
  anchorNote: "初创公司必须找到数据、工作流或行业入口壁垒。",
  conclusion: "没有壁垒的模型能力会迅速商品化。",
};

const controls = [
  { key: "itemCount", type: "slider", label: "压力维度数量", default: 3, min: 2, max: 3, step: 1,
    description: "参与压缩的压力维度（行）数量。" },
  { key: "chartType", type: "radio", label: "图表样式", default: "pincer",
    options: [{ value: "pincer", label: "夹击残余" }, { value: "bars", label: "普通条形" }],
    description: "夹击残余（侵蚀+残余壁垒+箭头）/ 普通左对齐条形。" },
  { key: "focusEnabled", type: "toggle", label: "重点维度", default: true,
    description: "是否突出某一压力维度（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点维度序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的压力维度序号（从 1 起）。" },
  { key: "showResidual", type: "toggle", label: "残余壁垒", default: true,
    description: "右侧深色「残余壁垒空间」段与数值（pincer 样式下生效）。" },
  { key: "showArrow", type: "toggle", label: "夹击箭头", default: true,
    description: "侵蚀段前缘指向壁垒墙的夹击箭头。" },
  { key: "showValue", type: "toggle", label: "数值标注", default: true,
    description: "各压力维度的侵蚀百分比标注。" },
  { key: "showAnchor", type: "toggle", label: "残余锚点卡", default: true,
    description: "右侧深色残余壁垒锚点卡（巨号读数 + 说明）。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[6], options: SPECTRUM,
    description: "眉标 / 锚点卡巨号 / 重点维度的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseSqueeze(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;

  const n = Math.max(2, Math.min(COPY.pressures.length, p.itemCount));
  const items = COPY.pressures.slice(0, n);
  const focus = p.focusEnabled ? Math.min(p.focusIndex, n) - 1 : -1;
  const pincer = p.chartType === "pincer";
  const hasAnchor = p.showAnchor;

  return (
    <div className="pulse-slide pulse-sqz" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          {p.showLead && <div className="pulse-pagehead__sub pulse-sqz__lead">{COPY.lead}</div>}
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-sqz__body">
        <div className={"pulse-sqz__row" + (hasAnchor ? "" : " pulse-sqz__row--solo")}>
          <div className="pulse-sqz__plot">
            <div className="pulse-sqz__plot-cap">
              <span className="pulse-label">{COPY.plotCap}</span>
              <span className="pulse-mono">{COPY.plotUnit}</span>
            </div>
            <div className={"pulse-sqz__rows" + (pincer ? " pulse-sqz__rows--wall" : "")}>
              {items.map((it, i) => {
                const dim = focus >= 0 && i !== focus;
                const isFocus = i === focus;
                const residual = 100 - it.p;
                return (
                  <div className={"pulse-sqz__r" + (isFocus ? " pulse-sqz__r--focus" : "") + (dim ? " pulse-sqz__r--dim" : "")} key={i}>
                    <div className="pulse-sqz__r-lab">
                      <span className="pulse-sqz__r-k">{it.k}</span>
                      <span className="pulse-sqz__r-en">{it.en}</span>
                    </div>
                    <div className="pulse-sqz__track">
                      <div className="pulse-sqz__press" style={{ width: it.p + "%", background: it.color }}>
                        {p.showValue && <span className="pulse-sqz__press-v">{it.p}<small>%</small></span>}
                        {pincer && p.showArrow && <span className="pulse-sqz__arrow" style={{ borderLeftColor: it.color }} />}
                      </div>
                      {pincer && p.showResidual && (
                        <div className="pulse-sqz__resid" style={{ width: residual + "%" }}>
                          {residual >= 16 && <span className="pulse-sqz__resid-v">残余 {residual}<small>%</small></span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {pincer && <div className="pulse-sqz__wall-lab">{COPY.wallLabel} ▸</div>}
            </div>
          </div>

          {hasAnchor && (
            <div className="pulse-sqz__anchor">
              <div className="pulse-sqz__anchor-cap">
                <span className="pulse-label" style={{ color: "rgba(255,255,255,0.7)" }}>RESIDUAL MOAT</span>
              </div>
              <div className="pulse-sqz__anchor-num" style={{ color: accent }}>
                {COPY.anchorNum}<em>{COPY.anchorUnit}</em>
              </div>
              <div className="pulse-sqz__anchor-k">{COPY.anchorLabel}</div>
              <div className="pulse-sqz__anchor-note">{COPY.anchorNote}</div>
            </div>
          )}
        </div>

        {p.showConclusion && <div className="pulse-conclusion pulse-sqz__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseSqueeze.controls = controls;
PulseSqueeze.defaults = defaults;
export default PulseSqueeze;
export { controls };
export { defaults };
