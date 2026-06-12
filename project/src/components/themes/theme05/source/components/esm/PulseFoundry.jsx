/* =========================================================================
   PulseFoundry — P65 image page ("算力基础设施 / Compute Foundry" archetype).
   An image-led case profile whose DISTINGUISHING element is a full-width
   "cluster rack" band: N vertical rack columns, each a stack of unit ticks lit
   by a utilization level (evokes a GPU rack / TR-808 step column). A themed
   identity card (EN + headline + sub + lead + oversized KPI rows) sits beside an
   ADAPTIVE image gallery (0–n justified, ratio-aware, side swappable). With 0
   images the card goes full-width and the KPIs reflow into two columns. The
   reusable template for any "capacity / infrastructure supplier" case page.

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   the no-build preview). Everything else is by props.
   `export default PulseFoundry; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "COREWEAVE CASE",
  title: "算力基础设施",
  sheet: "CASE · 65 / 80",
  en: "COREWEAVE",
  zh: "GPU 云算力供应",
  sub: "CoreWeave 案例",
  lead: "当模型公司都在抢 GPU，算力供应商获得资本溢价 —— 确定性需求叠加稀缺供给。",
  kpis: [
    ["融资额", "110", "亿美元"],
    ["估值", "190", "亿美元"],
    ["GPU 资源", "7.8", "万张"],
    ["核心客户", "模型 · 内容 · 推理", ""],
  ],
  galleryCap: "案例主视觉",
  galleryUnit: "DROP IMAGES",
  rackCap: "GPU 集群",
  rackUnit: "CLUSTER UTILIZATION",
  rackReadK: "在网算力占用",
  conclusion: "卖铲子的人也能成为核心资产。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }
// deterministic per-column jitter so the rack reads as textured, not flat.
function seed(i) { const x = Math.sin((i + 1) * 12.9898) * 43758.5453; return x - Math.floor(x); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "图片槽数量（0–3），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对主体卡的位置（有图片时生效）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
    description: "主体卡内的大号指标行数。" },
  { key: "cardTheme", type: "radio", label: "主体卡主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "主体卡背景：深色 / 强调色块 / 纸色。" },
  { key: "showRack", type: "toggle", label: "集群栅格", default: true,
    description: "底部 GPU 集群占用栅格带（关闭则隐藏整条）。" },
  { key: "rackColumnCount", type: "slider", label: "集群列数", default: 8, min: 4, max: 14, step: 1,
    description: "集群栅格的列（机柜）数量。" },
  { key: "rackFill", type: "slider", label: "占用率", default: 72, min: 20, max: 100, step: 1,
    description: "被占用单元比例（同时作为巨号占用率读数）。" },
  { key: "focusEnabled", type: "toggle", label: "重点列", default: true,
    description: "是否突出某一列（满载并以强调色着色）。" },
  { key: "focusIndex", type: "slider", label: "重点列序号", default: 3, min: 1, max: 14, step: 1,
    description: "被突出的集群列序号（从 1 起）。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 占用单元 /「色块」主题下主体卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

const TICKS = 9; // unit ticks per rack column

function PulseFoundry(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nKpi = Math.max(2, Math.min(COPY.kpis.length, p.metricCount));
  const kpis = COPY.kpis.slice(0, nKpi);
  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasGallery = nImg > 0 && Frame;

  const cols = Math.max(4, Math.min(14, p.rackColumnCount));
  const fill = Math.max(20, Math.min(100, p.rackFill));
  const focusCol = p.focusEnabled ? Math.min(p.focusIndex, cols) - 1 : -1;

  // theme → card bg / fg / divider color
  let bg, fg, div;
  if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

  const cardCls = "pulse-fdry__card" + (hasGallery ? "" : " pulse-fdry__card--wide");
  const rowCls = "pulse-fdry__row" + (hasGallery && p.imageSide === "left" ? " pulse-fdry__row--rev" : "");

  return (
    <div className="pulse-slide pulse-fdry" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-fdry__body">
        <div className={rowCls}>
          <div className={cardCls} style={{ background: bg, color: fg, "--fdry-div": div, flex: hasGallery ? "0 0 44%" : "1 1 auto" }}>
            <div className="pulse-fdry__en">{COPY.en}</div>
            <div className="pulse-fdry__zh">{COPY.zh}</div>
            <div className="pulse-fdry__sub">{COPY.sub}</div>
            {p.showLead && <div className="pulse-fdry__lead">{COPY.lead}</div>}
            <div className="pulse-fdry__kpis">
              {kpis.map((m, i) => (
                <div className="pulse-fdry__k" key={i}>
                  <span className="pulse-fdry__k-k">{m[0]}</span>
                  <span className="pulse-fdry__k-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                </div>
              ))}
            </div>
          </div>

          {hasGallery && (
            <div className="pulse-fdry__media">
              {p.showGalleryCaption && (
                <div className="pulse-fdry__media-cap">
                  <span className="pulse-label">{COPY.galleryCap}</span>
                  <span className="pulse-mono">{COPY.galleryUnit}</span>
                </div>
              )}
              <div className="pulse-fdry__media-row">
                {Array.from({ length: nImg }).map((_, i) => {
                  const im = images[i] || {};
                  const grow = clampAR(im.ar);
                  return (
                    <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                      <Frame src={im.src || null} ar={im.ar || null} fill={true}
                        editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入集群图片"
                        onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {p.showRack && (
          <div className="pulse-fdry__rack">
            <div className="pulse-fdry__rack-cap">
              <span className="pulse-label">{COPY.rackCap}</span>
              <span className="pulse-mono">{COPY.rackUnit}</span>
            </div>
            <div className="pulse-fdry__rack-main">
              <div className="pulse-fdry__cols">
                {Array.from({ length: cols }).map((_, c) => {
                  const isFocus = c === focusCol;
                  const jit = (seed(c) - 0.5) * 22;          // ±11% texture
                  const colFill = isFocus ? 100 : Math.max(8, Math.min(100, fill + jit));
                  const lit = Math.round((TICKS * colFill) / 100);
                  return (
                    <div className={"pulse-fdry__col" + (isFocus ? " pulse-fdry__col--focus" : "")} key={c}>
                      <div className="pulse-fdry__ticks">
                        {Array.from({ length: TICKS }).map((_, t) => {
                          const on = t < lit; // index 0 = bottom
                          return (
                            <span key={t} className="pulse-fdry__tick"
                              style={on
                                ? { background: isFocus ? accent : "var(--pulse-ink)" }
                                : { background: "transparent", boxShadow: "inset 0 0 0 2px var(--pulse-hair)" }} />
                          );
                        })}
                      </div>
                      <div className="pulse-fdry__col-id">{String(c + 1).padStart(2, "0")}</div>
                    </div>
                  );
                })}
              </div>
              <div className="pulse-fdry__readout">
                <div className="pulse-fdry__read-v">{fill}<small>%</small></div>
                <div className="pulse-fdry__read-k">{COPY.rackReadK}</div>
              </div>
            </div>
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-fdry__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseFoundry.controls = controls;
PulseFoundry.defaults = defaults;
export default PulseFoundry;
export { controls };
export { defaults };
