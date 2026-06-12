/* =========================================================================
   PulseHorizon — P71 content page ("强叙事模型实验室 / Long Horizon" archetype).
   An image-led case profile whose DISTINGUISHING element is a "long-horizon
   trajectory": an SVG projection band anchored at NOW (value 0) and rising along
   a dashed/solid curve toward a distant HORIZON marker, with N milestone ticks
   (one emphasizable) — visualises strong-narrative / weak-near-term-revenue and
   long time-to-realize. A themed identity card (EN + headline + sub + lead + KPI
   rows) sits beside an ADAPTIVE image gallery (0–n justified, ratio-aware, side
   swappable). With 0 images the card goes full-width and KPIs reflow to two
   columns. The reusable template for any "long-arc thesis + hero visual" page.

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   Everything else is by props.
   `export default PulseHorizon; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "SSI CASE",
  title: "强叙事模型实验室",
  sheet: "CASE · 71 / 80",
  en: "SSI",
  zh: "安全智能 · 长期技术",
  sub: "SSI 案例",
  lead: "强团队、强叙事、弱商业化验证 —— 短期难以用收入评价，价值建立在长期技术想象上。",
  kpis: [
    ["最大单笔融资", "10", "亿美元"],
    ["产品收入", "0", ""],
    ["团队规模", "85", "人"],
    ["赛道", "安全智能", ""],
  ],
  galleryCap: "案例主视觉",
  galleryUnit: "DROP IMAGES",
  horizonCap: "兑现周期",
  horizonUnit: "NOW → HORIZON",
  startLabel: "现在 · 收入 0",
  endLabel: "长期技术兑现",
  // milestones positioned 0..1 along the arc
  milestones: [
    { t: 0.30, k: "研究突破", en: "RESEARCH" },
    { t: 0.55, k: "原型验证", en: "PROTOTYPE" },
    { t: 0.78, k: "商业化", en: "COMMERCIAL" },
  ],
  conclusion: "强叙事需要更长时间兑现。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
    description: "图片槽数量（0–2），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对主体卡的位置（有图片时生效）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "主体卡内的指标行数。" },
  { key: "cardTheme", type: "radio", label: "主体卡主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "主体卡背景：深色 / 强调色块 / 纸色。" },
  { key: "showHorizon", type: "toggle", label: "兑现轨迹", default: true,
    description: "底部「现在 → 远期」的兑现轨迹带（关闭则隐藏整条）。" },
  { key: "milestoneCount", type: "slider", label: "里程碑数", default: 3, min: 1, max: 3, step: 1,
    description: "轨迹上的里程碑节点数量。" },
  { key: "curveStyle", type: "radio", label: "轨迹线型", default: "dashed",
    options: [{ value: "dashed", label: "虚线" }, { value: "solid", label: "实线" }],
    description: "兑现轨迹的线型（虚线 = 不确定的远期）。" },
  { key: "focusEnabled", type: "toggle", label: "重点里程碑", default: true,
    description: "是否突出某一里程碑节点。" },
  { key: "focusIndex", type: "slider", label: "重点节点序号", default: 3, min: 1, max: 3, step: 1,
    description: "被突出的里程碑序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[5], options: SPECTRUM,
    description: "眉标 / 轨迹 / 重点节点 /「色块」主题主体卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

// exponential rise: y(t) low+flat near now, steep toward horizon. Returns 0..1 (1=top).
function arcY(t) { return Math.pow(t, 2.1); }

function PulseHorizon(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nKpi = Math.max(2, Math.min(COPY.kpis.length, p.metricCount));
  const kpis = COPY.kpis.slice(0, nKpi);
  const nImg = Math.max(0, Math.min(2, p.imageCount));
  const images = p.images || [];
  const hasGallery = nImg > 0 && Frame;

  const nMile = Math.max(1, Math.min(COPY.milestones.length, p.milestoneCount));
  const miles = COPY.milestones.slice(0, nMile);
  const focusMile = p.focusEnabled ? Math.min(p.focusIndex, nMile) - 1 : -1;

  let bg, fg, div;
  if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

  const cardCls = "pulse-hrz__card" + (hasGallery ? "" : " pulse-hrz__card--wide");
  const rowCls = "pulse-hrz__row" + (hasGallery && p.imageSide === "left" ? " pulse-hrz__row--rev" : "");

  // Chart geometry — one shared % coordinate system (viewBox 0..100, y down,
  // preserveAspectRatio="none"). SVG draws line/area/grid with NON-scaling
  // strokes; dots + labels are an HTML overlay positioned with the SAME px/py,
  // so every marker sits exactly on the curve and circles never distort.
  const PADL = 3, PADR = 5, TOPp = 22, BASEp = 78;
  const px = (t) => PADL + t * (100 - PADL - PADR);
  const py = (t) => TOPp + (1 - arcY(t)) * (BASEp - TOPp);
  const sample = (a, b) => {
    const out = []; const steps = 48;
    for (let i = 0; i <= steps; i++) { const t = a + (b - a) * (i / steps); out.push(`${px(t).toFixed(2)},${py(t).toFixed(2)}`); }
    return out;
  };
  const tSplit = miles.length ? miles[miles.length - 1].t : 0.68;
  const headPts = sample(0, tSplit);
  const tailPts = sample(tSplit, 1);
  const headPath = "M " + headPts.join(" L ");
  const tailPath = "M " + tailPts.join(" L ");
  const areaPath = `M ${px(0).toFixed(2)},${BASEp} L ` + headPts.concat(tailPts.slice(1)).join(" L ") + ` L ${px(1).toFixed(2)},${BASEp} Z`;
  const gid = "hrzg-" + String(accent).replace(/[^a-z0-9]/gi, "");
  const tailDash = p.curveStyle === "dashed";

  return (
    <div className="pulse-slide pulse-hrz" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-hrz__body">
        <div className={rowCls}>
          <div className={cardCls} style={{ background: bg, color: fg, "--hrz-div": div, flex: hasGallery ? "0 0 44%" : "1 1 auto" }}>
            <div className="pulse-hrz__en">{COPY.en}</div>
            <div className="pulse-hrz__zh">{COPY.zh}</div>
            <div className="pulse-hrz__sub">{COPY.sub}</div>
            {p.showLead && <div className="pulse-hrz__lead">{COPY.lead}</div>}
            <div className="pulse-hrz__kpis">
              {kpis.map((m, i) => (
                <div className="pulse-hrz__k" key={i}>
                  <span className="pulse-hrz__k-k">{m[0]}</span>
                  <span className="pulse-hrz__k-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                </div>
              ))}
            </div>
          </div>

          {hasGallery && (
            <div className="pulse-hrz__media">
              {p.showGalleryCaption && (
                <div className="pulse-hrz__media-cap">
                  <span className="pulse-label">{COPY.galleryCap}</span>
                  <span className="pulse-mono">{COPY.galleryUnit}</span>
                </div>
              )}
              <div className="pulse-hrz__media-row">
                {Array.from({ length: nImg }).map((_, i) => {
                  const im = images[i] || {};
                  const grow = clampAR(im.ar);
                  return (
                    <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                      <Frame src={im.src || null} ar={im.ar || null} fill={true}
                        editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入抽象技术图片"
                        onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {p.showHorizon && (
          <div className="pulse-hrz__band">
            <div className="pulse-hrz__band-cap">
              <span className="pulse-label">{COPY.horizonCap}</span>
              <span className="pulse-mono">{COPY.horizonUnit}</span>
            </div>
            <div className="pulse-hrz__plot">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pulse-hrz__svg">
                <defs>
                  <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.20" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[BASEp, (TOPp + BASEp) / 2, TOPp].map((gy, i) => (
                  <line key={i} x1={PADL} y1={gy} x2={100 - PADR} y2={gy}
                    className={i === 0 ? "pulse-hrz__axis" : "pulse-hrz__guide"} vectorEffect="non-scaling-stroke" />
                ))}
                {miles.map((m, i) => (
                  <line key={i} x1={px(m.t)} y1={py(m.t)} x2={px(m.t)} y2={BASEp}
                    className="pulse-hrz__drop" vectorEffect="non-scaling-stroke" />
                ))}
                <path d={areaPath} fill={`url(#${gid})`} />
                <path d={headPath} fill="none" stroke={accent} strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <path d={tailPath} fill="none" stroke={accent} strokeWidth="3.5"
                  strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                  strokeDasharray={tailDash ? "2 9" : "0"} opacity={tailDash ? 0.85 : 1} />
              </svg>

              {/* HTML overlay — markers + labels use the SAME px/py, always on the curve */}
              <div className="pulse-hrz__overlay">
                <div className="pulse-hrz__now" style={{ left: px(0) + "%", top: py(0) + "%" }}>
                  <span className="pulse-hrz__now-dot" />
                  <span className="pulse-hrz__now-cap">{COPY.startLabel}</span>
                </div>

                {miles.map((m, i) => {
                  const isFocus = i === focusMile;
                  return (
                    <div key={i} className={"pulse-hrz__node" + (isFocus ? " pulse-hrz__node--focus" : "")}
                      style={{ left: px(m.t) + "%", top: py(m.t) + "%" }}>
                      <span className="pulse-hrz__node-label">
                        <span className="pulse-hrz__node-k">{m.k}</span>
                        <span className="pulse-hrz__node-en">{m.en}</span>
                      </span>
                      <span className="pulse-hrz__node-dot"
                        style={{ background: isFocus ? accent : "var(--pulse-paper)", borderColor: accent }} />
                    </div>
                  );
                })}

                <div className="pulse-hrz__horizon" style={{ left: px(1) + "%", top: py(1) + "%" }}>
                  <span className="pulse-hrz__horizon-cap" style={{ color: accent }}>{COPY.endLabel} ▸</span>
                  <span className="pulse-hrz__horizon-dot" style={{ background: accent, "--pulse-accent": accent }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-hrz__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseHorizon.controls = controls;
PulseHorizon.defaults = defaults;
export default PulseHorizon;
export { controls };
export { defaults };
