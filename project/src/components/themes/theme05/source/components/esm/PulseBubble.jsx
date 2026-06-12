/* =========================================================================
   PulseBubble — P16 chart page ("融资规模气泡图 / Deal Bubble Map").
   A generic bubble / scatter map: deals plotted as circles where bubble SIZE
   encodes amount and COLOR encodes category. Amount tiers, bubble scale,
   color mode, a focus tier, an optional grid and a side legend are all
   prop-controlled. Bubble positions are deterministic (seeded) so the layout
   is stable across renders.
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   See PulseBubble.controls for the typed, documented parameter list.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
const INK = "#14130f";

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "DEAL MAP",
  title: "融资事件规模分层",
  sub: "大额融资事件地图 · 气泡 = 单笔金额",
  sheet: "DEAL MAP · 16 / 32",
  plotNote: "BUBBLE = AMOUNT · COLOR = SECTOR · 97 DEALS",
  // ordered small → large; rep = representative amount used for bubble radius
  tiers: [
    { range: "1–2 亿美元",   count: 41, sum: "58 亿",  rep: 1.5 },
    { range: "2–5 亿美元",   count: 29, sum: "91 亿",  rep: 3.5 },
    { range: "5–10 亿美元",  count: 15, sum: "103 亿", rep: 7.5 },
    { range: "10 亿美元以上", count: 12, sum: "718 亿", rep: 30 },
  ],
  conclusion: "数量最多的不一定最重要，影响最大的往往是巨额交易。",
};

// Deterministic LCG so the bubble field is stable between renders.
function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function radiusFor(rep, scale) {
  const r = Math.sqrt(rep) * 7 * scale;
  return Math.max(8, Math.min(44, r));
}

function buildBubbles(tiers, scale, colorMode, accent) {
  const rng = makeRng(979);
  const out = [];
  tiers.forEach((t, ti) => {
    const r = radiusFor(t.rep, scale);
    for (let j = 0; j < t.count; j++) {
      const rx = rng(), ry = rng(), rc = rng();
      let color;
      if (colorMode === "accent") color = accent;
      else if (colorMode === "mono") color = INK;
      else color = SPECTRUM[Math.floor(rc * SPECTRUM.length) % SPECTRUM.length];
      out.push({
        tier: ti, r,
        x: 4 + rx * 92,    // percent within plot
        y: 8 + ry * 84,
        color,
      });
    }
  });
  // draw large bubbles first (behind), small ones on top
  out.sort((a, b) => b.r - a.r);
  return out;
}

function PulseBubble(props) {
  const p = Object.assign({}, PulseBubble.defaults, props);
  const accent = p.accentColor;
  const nTiers = Math.max(2, Math.min(COPY.tiers.length, p.tierCount));
  const tiers = COPY.tiers.slice(0, nTiers);
  const focusIdx = Math.min(p.focusIndex, nTiers);
  const bubbles = buildBubbles(tiers, p.bubbleScale, p.colorMode, accent);

  return (
    <div className="pulse-slide pulse-bubble" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-bubble__body">
        <div className="pulse-bubble__main">
          <div className="pulse-bubble__caphead">
            <span className="pulse-label">{COPY.sub}</span>
            <span className="pulse-mono">{COPY.plotNote}</span>
          </div>
          <div className="pulse-bubble__plot">
            {p.showGrid && (
              <div className="pulse-bubble__grid" aria-hidden="true">
                {[25, 50, 75].map((t) => <i key={"h" + t} className="h" style={{ top: t + "%" }} />)}
                {[25, 50, 75].map((t) => <i key={"v" + t} className="v" style={{ left: t + "%" }} />)}
              </div>
            )}
            {bubbles.map((b, i) => {
              const isFocusTier = p.focusEnabled && b.tier + 1 === focusIdx;
              const dim = p.focusEnabled && !isFocusTier;
              return (
                <span
                  key={i}
                  className={"pulse-bubble__dot" + (isFocusTier ? " pulse-bubble__dot--focus" : "")}
                  style={{
                    left: b.x + "%", top: b.y + "%",
                    width: b.r * 2 + "px", height: b.r * 2 + "px",
                    background: b.color,
                    opacity: dim ? 0.16 : 0.82,
                  }}
                />
              );
            })}
          </div>
        </div>

        {p.showLegend && (
          <div className="pulse-bubble__side">
            <div className="pulse-label" style={{ marginBottom: 8 }}>金额区间 · 笔数</div>
            <div className="pulse-bubble__tiers">
              {tiers.map((t, i) => {
                const focus = p.focusEnabled && i + 1 === focusIdx;
                const r = radiusFor(t.rep, p.bubbleScale);
                const d = Math.max(16, Math.min(52, r * 1.7));
                const dotColor = p.colorMode === "mono" ? INK
                  : p.colorMode === "accent" ? accent : "#a39e8e";
                return (
                  <div className={"pulse-bubble__tier" + (focus ? " pulse-bubble__tier--focus" : "")} key={i}>
                    <div className="pulse-bubble__tier-mark">
                      <span className="pulse-bubble__tier-dot"
                        style={{ width: d + "px", height: d + "px", background: dotColor, opacity: 0.85 }} />
                    </div>
                    <div className="pulse-bubble__tier-body">
                      <div className="pulse-bubble__tier-range">{t.range}</div>
                      <div className="pulse-bubble__tier-sum">合计 {t.sum}</div>
                    </div>
                    <div className="pulse-bubble__tier-count">
                      <b>{t.count}</b><small>笔</small>
                    </div>
                  </div>
                );
              })}
            </div>
            {p.showConclusion && <div className="pulse-conclusion">{COPY.conclusion}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

PulseBubble.controls = [
  { key: "tierCount", type: "slider", label: "金额分层数", default: 4, min: 2, max: 4, step: 1,
    description: "展示的金额区间（气泡分组）数量。" },
  { key: "bubbleScale", type: "slider", label: "气泡大小", default: 1, min: 0.6, max: 1.6, step: 0.1,
    description: "气泡整体大小的缩放系数。" },
  { key: "focusEnabled", type: "toggle", label: "重点分层", default: true,
    description: "是否突出某一金额区间（其余气泡淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点分层序号", default: 4, min: 1, max: 4, step: 1,
    description: "被突出的金额区间序号（从 1 起，小额→大额）。" },
  { key: "colorMode", type: "radio", label: "配色方式", default: "category",
    options: [{ value: "category", label: "按类别" }, { value: "accent", label: "强调色" }, { value: "mono", label: "单色" }],
    description: "气泡配色：按赛道类别 / 单一强调色 / 单色。" },
  { key: "showGrid", type: "toggle", label: "网格背景", default: true,
    description: "气泡区域的背景网格线。" },
  { key: "showLegend", type: "toggle", label: "图例", default: true,
    description: "右侧的金额区间图例（含笔数与合计）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标的强调色（强调色配色模式下也用于气泡）。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "右下角的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
PulseBubble.defaults = PulseBubble.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseBubble;
export const controls = PulseBubble.controls || [];
export const defaults = PulseBubble.defaults || {};
