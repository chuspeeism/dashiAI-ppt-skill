import React from "react";
import { COLORS, RAMP } from "../theme.js";
import { ImageGallery } from "../ImageSlot.jsx";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   GeoSlide — 地区分布 (geographic concentration).
   Ranked regional magnitude bars + a focusable region + an adaptive image
   column (e.g. a skyline). All variable parts are props.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "条目数量", type: "slider", default: 5, min: 3, max: 5, step: 1,
    help: "展示的地区数量（按融资额排序）" },
  { key: "chartType", label: "图表类型", type: "select", default: "bar",
    options: [{ value: "bar", label: "条形" }, { value: "lollipop", label: "棒棒糖" }],
    help: "地区占比的呈现方式" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: true,
    help: "高亮某一个地区" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 4, step: 1,
    help: "被高亮的地区序号（从 0 起）" },
  { key: "imageCount", label: "图片数量", type: "slider", default: 1, min: 0, max: 2, step: 1,
    help: "右侧图片槽数量，0 为纯数据布局" },
  { key: "showCallout", label: "装饰解读", type: "toggle", default: true,
    help: "底部集聚效应解读文案显示 / 隐藏" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 5,
  chartType: "bar",
  focusEnabled: true,
  focusIndex: 0,
  imageCount: 1,
  showCallout: true,
  copy: {
    t001: "地区生态 / 08",
    t002: "按科技枢纽归类 · 单位：亿美元",
    t003: "融资的地理版图",
    t004: "资金高度向少数科技枢纽集聚",
    t005: "亿",
    t006: "↳ 高度集聚",
    t007: "旧金山湾区独占六成以上，人才、资本、算力的虹吸效应进一步强化，「地理护城河」短期内难以撼动。",
    t008: "科技枢纽实景 / DROP IMAGE",
    t009: "63.9",
    t010: "资金落在",
    t011: "旧金山湾区",
    t012: "63.9",
    t013: "资金落在旧金山湾区",
  },
  data: [
  { region: "旧金山湾区", en: "SF Bay Area", amt: 620, pct: 63.9 },
  { region: "纽约", en: "New York", amt: 120, pct: 12.4 },
  { region: "西雅图", en: "Seattle", amt: 95, pct: 9.8 },
  { region: "波士顿", en: "Boston", amt: 75, pct: 7.7 },
  { region: "其他地区", en: "Others", amt: 60, pct: 6.2 },
  ],
  ...decorDefaults,
};



export default function GeoSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = COLORS.blue;
  const n = Math.max(3, Math.min(5, p.itemCount));
  const rows = p.data.slice(0, n);
  const focusIndex = Math.min(p.focusIndex, n - 1);
  const max = 63.9;

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <h2 className="rd-title rd-anim rd-anim-2" style={{ marginTop: 30 }}>{copy.t003}</h2>
        <p className="rd-cap rd-anim rd-anim-2" style={{ marginTop: 12 }}>{copy.t004}</p>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 30, minHeight: 0 }}>
          {/* ranked regions */}
          <div className="rd-anim rd-anim-3" style={{ flex: 1.35, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
            {rows.map((d, i) => {
              const hot = p.focusEnabled && i === focusIndex;
              const w = (d.pct / max) * 100;
              return (
                <div key={d.region} style={{
                  padding: "18px 0", borderBottom: `1px solid ${COLORS.line2}`,
                  opacity: p.focusEnabled && !hot ? 0.5 : 1,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
                    <span style={{ fontFamily: '"Archivo","Noto Sans SC",sans-serif', fontWeight: 700, fontSize: 30, color: hot ? accent : COLORS.ink }}>{d.region}</span>
                    <span className="rd-mono" style={{ fontSize: 22, color: COLORS.ink3 }}>{d.en}</span>
                    <span style={{ marginLeft: "auto", fontFamily: '"Archivo",sans-serif', fontWeight: 800, fontSize: 34, color: hot ? accent : COLORS.ink }}>
                      {d.pct}<span style={{ fontSize: 22, color: COLORS.ink2 }}>%</span>
                    </span>
                    <span className="rd-mono" style={{ width: 110, textAlign: "right", fontSize: 22, color: COLORS.ink3 }}>{d.amt}{copy.t005}</span>
                  </div>
                  {p.chartType === "bar" ? (
                    <div style={{ height: 16, background: "rgba(22,21,19,0.06)" }}>
                      <div style={{ width: `${w}%`, height: "100%", background: hot ? accent : RAMP[Math.min(i, RAMP.length - 1)] }} />
                    </div>
                  ) : (
                    <div style={{ width: `${w}%`, height: 16, display: "flex", alignItems: "center" }}>
                      <div style={{ flex: 1, height: 3, background: hot ? accent : "rgba(22,21,19,0.2)" }} />
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: hot ? accent : COLORS.ink, flex: "none" }} />
                    </div>
                  )}
                </div>
              );
            })}

            {p.showCallout && (
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: `2px solid ${COLORS.blue}`, display: "flex", gap: 18, alignItems: "baseline" }}>
                <span className="rd-mono" style={{ color: accent, flex: "none" }}>{copy.t006}</span>
                <p className="rd-cap" style={{ maxWidth: 700 }}>{copy.t007}</p>
              </div>
            )}
          </div>

          {/* image column or ghost figure */}
          <div className="rd-anim rd-anim-4" style={{ width: 560, flex: "none", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            {p.imageCount > 0 ? (
              <>
                <ImageGallery layout="column" count={p.imageCount} width={560} height={560} gap={14}
                  caption={copy.t008} />
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span className="rd-figure" style={{ fontSize: 120, color: accent }}>{copy.t009}</span>
                  <span className="rd-sub" style={{ fontWeight: 700 }}>%</span>
                  <span className="rd-cap" style={{ marginLeft: 8 }}>{copy.t010}<br />{copy.t011}</span>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", gap: 10 }}>
                  <span className="rd-figure" style={{ fontSize: 300, color: accent }}>{copy.t012}</span>
                  <span className="rd-sub" style={{ fontWeight: 800, marginTop: 28 }}>%</span>
                </div>
                <p className="rd-sub" style={{ fontWeight: 700, marginTop: 8 }}>{copy.t013}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={160} rotate={6} pos={{ left: 40, bottom: 36 }} />
    </div>
  );
}
