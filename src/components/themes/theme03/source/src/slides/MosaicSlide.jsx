import React from "react";
import { COLORS } from "../theme.js";
import ImageSlot from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MosaicSlide — 图片页 · 资本地理图集 (full-bleed image mosaic + overlay).
   A designed image grid whose composition re-flows by slot count (2–5), each
   cell cover-fitting any uploaded ratio. A focal tile carries a big-number
   overlay; a meta strip breaks down the regional split. Pure & portable.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 4, min: 2, max: 5, step: 1,
    help: "马赛克图块数量（构图随数量自动重排）" },
  { key: "showFigure", label: "主视觉数字", type: "toggle", default: true,
    help: "焦点图块上的超大占比数字显示 / 隐藏" },
  { key: "showMeta", label: "地区明细", type: "toggle", default: true,
    help: "底部各地区占比条显示 / 隐藏" },
  { key: "theme", label: "明暗主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "主视觉数字与标记的强调色" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  imageCount: 4,
  showFigure: true,
  showMeta: true,
  theme: "light",
  accent: "blue",
  copy: {
    t001: "地区分布 / 13",
    t002: "融资地理 · 高度集聚",
    t003: "融资的",
    t004: "地理版图",
    t005: "湾区现场 / DROP",
    t006: "配图 / DROP",
    t007: "旧金山湾区 · Bay Area",
    t008: "63.9",
    t009: "独占全美 AI 融资六成以上",
  },
  regions: [
  { name: "旧金山湾区", en: "Bay Area", pct: 63.9 },
  { name: "纽约", en: "New York", pct: 12.4 },
  { name: "西雅图", en: "Seattle", pct: 9.8 },
  { name: "波士顿", en: "Boston", pct: 7.7 },
  { name: "其他地区", en: "Others", pct: 6.2 },
  ],
  ...decorDefaults,
};



// Per-count grid composition — keeps the mosaic well-balanced at any slot count.
function layoutFor(count) {
  switch (count) {
    case 2: return { cols: "1fr 1fr", rows: "1fr", cells: [{ c: "1", r: "1" }, { c: "2", r: "1" }] };
    case 3: return { cols: "1.5fr 1fr", rows: "1fr 1fr", cells: [{ c: "1", r: "1 / span 2" }, { c: "2", r: "1" }, { c: "2", r: "2" }] };
    case 5: return { cols: "1.45fr 1fr 1fr", rows: "1fr 1fr", cells: [{ c: "1", r: "1 / span 2" }, { c: "2", r: "1" }, { c: "3", r: "1" }, { c: "2", r: "2" }, { c: "3", r: "2" }] };
    default: return { cols: "1.4fr 1fr 1fr", rows: "1fr 1fr", cells: [{ c: "1", r: "1 / span 2" }, { c: "2", r: "1" }, { c: "3", r: "1" }, { c: "2 / span 2", r: "2" }] };
  }
}

export default function MosaicSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.lime : "#6f86ff";
  const count = Math.max(2, Math.min(5, p.imageCount));
  const L = layoutFor(count);

  // self-managed image state (demo-friendly; cover-fit so any ratio composes)
  const [imgs, setImgs] = React.useState({});
  const setAt = (i, src) => setImgs((m) => ({ ...m, [i]: src }));

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 32 }}>{copy.t003}<span style={{ color: p.accent === "lime" ? COLORS.ink : COLORS.blue }}>{copy.t004}</span>
        </h2>

        {/* mosaic */}
        <div className="rd-anim rd-anim-2" style={{ flex: 1, display: "grid", gridTemplateColumns: L.cols, gridTemplateRows: L.rows, gap: 14, marginTop: 22, minHeight: 0 }}>
          {L.cells.map((cell, i) => (
            <div key={i} style={{ position: "relative", gridColumn: cell.c, gridRow: cell.r, overflow: "hidden" }}>
              <ImageSlot src={imgs[i] || null} index={i} fit="cover" radius={0}
                caption={i === 0 ? copy.t005 : copy.t006}
                onUpload={(src) => setAt(i, src)} />
              {/* focal overlay on the first (feature) tile */}
              {i === 0 && p.showFigure && (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 36, background: "linear-gradient(to top, rgba(8,8,7,0.82) 0%, rgba(8,8,7,0.38) 42%, rgba(8,8,7,0) 72%)", pointerEvents: "none" }}>
                  <span style={{ fontFamily: "var(--rd-mono)", fontSize: 24, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>{copy.t007}</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
                    <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 150, lineHeight: 0.84, letterSpacing: "-0.03em", color: "#fff", fontFeatureSettings: '"tnum" 1' }}>{copy.t008}</span>
                    <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 56, color: accentInk }}>%</span>
                  </div>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 600, fontSize: 26, color: "rgba(255,255,255,0.92)", marginTop: 10 }}>{copy.t009}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* region split */}
        {p.showMeta && (
          <div className="rd-anim rd-anim-3" style={{ display: "flex", gap: 0, marginTop: 22, borderTop: `2px solid var(--rd-ink)`, paddingTop: 18 }}>
            {p.regions.map((r, i) => (
              <div key={i} style={{ flex: r.pct, minWidth: 132, paddingRight: 22, borderRight: i < p.regions.length - 1 ? `1px solid var(--rd-line-2)` : "none", marginRight: i < p.regions.length - 1 ? 22 : 0 }}>
                <div style={{ height: 6, background: i === 0 ? accent : "var(--rd-ink)", marginBottom: 12, opacity: i === 0 ? 1 : 0.32 }} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 34, color: "var(--rd-ink)", fontFeatureSettings: '"tnum" 1' }}>{r.pct}</span>
                  <span className="rd-mono" style={{ fontSize: 20, color: "var(--rd-ink-3)" }}>%</span>
                </div>
                <div style={{ fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 24, color: "var(--rd-ink)", marginTop: 6 }}>{r.name}</div>
                <div className="rd-mono" style={{ fontSize: 19, color: "var(--rd-ink-3)", marginTop: 2 }}>{r.en}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={156} rotate={-5} pos={{ right: 56, top: 132 }} />
    </div>
  );
}
