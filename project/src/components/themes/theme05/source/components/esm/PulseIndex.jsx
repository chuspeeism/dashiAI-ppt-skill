/* =========================================================================
   PulseIndex — P69 content page ("企业知识入口 / Knowledge Directory" archetype).
   An image-led case profile whose DISTINGUISHING element is a "knowledge-source
   directory": a numbered catalog of indexed sources (card-catalog rows, one
   emphasizable) terminated by a circular RENEWAL RING gauge — evokes a BASF /
   library index feeding a retention dial. A themed identity card (EN + headline +
   sub + lead + KPI rows) sits beside an ADAPTIVE image gallery (0–n justified,
   ratio-aware, side swappable). With 0 images the card goes full-width and the
   KPIs reflow into two columns. The reusable template for any "indexed sources +
   retention + hero visual" case page.

   Image slots are prop-driven (`images` + `onImageChange`); the image component
   the no-build preview). Everything else is by props.
   `export default PulseIndex; export { controls, defaults };`, and
   `import PulseImageFrame` (or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "GLEAN CASE",
  title: "企业知识入口",
  sheet: "CASE · 69 / 80",
  en: "GLEAN",
  zh: "企业搜索 · 知识工作流",
  sub: "Glean 案例",
  lead: "接入知识库后，企业搜索会成为高频工作入口 —— 窄场景也能产生高价值。",
  kpis: [
    ["最大单笔融资", "2.6", "亿美元"],
    ["付费客户", "780", "家"],
    ["赛道", "企业搜索", ""],
  ],
  galleryCap: "案例主视觉",
  galleryUnit: "DROP IMAGES",
  dirCap: "知识来源索引",
  dirUnit: "INDEXED SOURCES",
  // value (w) drives the inline coverage bar
  sources: [
    { k: "文档与云盘", en: "DOCS · DRIVE", w: 92 },
    { k: "工单与邮件", en: "TICKETS · MAIL", w: 74 },
    { k: "代码与知识库", en: "CODE · WIKI", w: 61 },
    { k: "会话与日历", en: "CHAT · CAL", w: 48 },
    { k: "数据看板", en: "DASHBOARDS", w: 35 },
  ],
  ringCap: "续约率",
  ringValue: 91,
  ringNote: "高留存验证入口价值",
  conclusion: "窄场景也能产生高价值。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "图片槽数量（0–3），按各图比例自适应排布；为 0 时主体卡铺满整幅、指标转两列。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "right",
    options: [{ value: "right", label: "右侧" }, { value: "left", label: "左侧" }],
    description: "图片相对主体卡的位置（有图片时生效）。" },
  { key: "metricCount", type: "slider", label: "指标行数", default: 3, min: 2, max: 3, step: 1,
    description: "主体卡内的指标行数。" },
  { key: "cardTheme", type: "radio", label: "主体卡主题", default: "dark",
    options: [{ value: "dark", label: "深色" }, { value: "color", label: "色块" }, { value: "paper", label: "纸色" }],
    description: "主体卡背景：深色 / 强调色块 / 纸色。" },
  { key: "showDirectory", type: "toggle", label: "来源索引", default: true,
    description: "底部知识来源索引目录（关闭则隐藏整条）。" },
  { key: "sourceCount", type: "slider", label: "索引条数", default: 4, min: 2, max: 5, step: 1,
    description: "知识来源目录的行数。" },
  { key: "showCoverage", type: "toggle", label: "覆盖度条", default: true,
    description: "各来源右侧的覆盖度比例条。" },
  { key: "focusEnabled", type: "toggle", label: "重点来源", default: true,
    description: "是否突出某一条来源（以强调色着色）。" },
  { key: "focusIndex", type: "slider", label: "重点条序号", default: 1, min: 1, max: 5, step: 1,
    description: "被突出的来源序号（从 1 起）。" },
  { key: "showRing", type: "toggle", label: "续约环", default: true,
    description: "索引末端的环形续约率读数。" },
  { key: "showLead", type: "toggle", label: "引导说明", default: true,
    description: "标题下方的一句引导说明。" },
  { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[3], options: SPECTRUM,
    description: "眉标 / 重点来源 / 续约环 /「色块」主题主体卡的颜色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseIndex(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nKpi = Math.max(2, Math.min(COPY.kpis.length, p.metricCount));
  const kpis = COPY.kpis.slice(0, nKpi);
  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasGallery = nImg > 0 && Frame;

  const nSrc = Math.max(2, Math.min(COPY.sources.length, p.sourceCount));
  const sources = COPY.sources.slice(0, nSrc);
  const focusSrc = p.focusEnabled ? Math.min(p.focusIndex, nSrc) - 1 : -1;

  let bg, fg, div;
  if (p.cardTheme === "color") { bg = accent; fg = "#fff"; div = "rgba(255,255,255,0.26)"; }
  else if (p.cardTheme === "paper") { bg = "var(--pulse-paper-2)"; fg = "var(--pulse-ink)"; div = "var(--pulse-hair)"; }
  else { bg = "var(--pulse-dark)"; fg = "var(--pulse-on-dark)"; div = "rgba(255,255,255,0.18)"; }

  const cardCls = "pulse-idx__card" + (hasGallery ? "" : " pulse-idx__card--wide");
  const rowCls = "pulse-idx__row" + (hasGallery && p.imageSide === "left" ? " pulse-idx__row--rev" : "");
  const ring = COPY.ringValue;

  return (
    <div className="pulse-slide pulse-idx" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-idx__body">
        <div className={rowCls}>
          <div className={cardCls} style={{ background: bg, color: fg, "--idx-div": div, flex: hasGallery ? "0 0 44%" : "1 1 auto" }}>
            <div className="pulse-idx__en">{COPY.en}</div>
            <div className="pulse-idx__zh">{COPY.zh}</div>
            <div className="pulse-idx__sub">{COPY.sub}</div>
            {p.showLead && <div className="pulse-idx__lead">{COPY.lead}</div>}
            <div className="pulse-idx__kpis">
              {kpis.map((m, i) => (
                <div className="pulse-idx__k" key={i}>
                  <span className="pulse-idx__k-k">{m[0]}</span>
                  <span className="pulse-idx__k-v">{m[1]}{m[2] ? <small>{m[2]}</small> : null}</span>
                </div>
              ))}
            </div>
          </div>

          {hasGallery && (
            <div className="pulse-idx__media">
              {p.showGalleryCaption && (
                <div className="pulse-idx__media-cap">
                  <span className="pulse-label">{COPY.galleryCap}</span>
                  <span className="pulse-mono">{COPY.galleryUnit}</span>
                </div>
              )}
              <div className="pulse-idx__media-row">
                {Array.from({ length: nImg }).map((_, i) => {
                  const im = images[i] || {};
                  const grow = clampAR(im.ar);
                  return (
                    <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                      <Frame src={im.src || null} ar={im.ar || null} fill={true}
                        editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入知识库入口图"
                        onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {p.showDirectory && (
          <div className="pulse-idx__dir">
            <div className="pulse-idx__dir-list">
              <div className="pulse-idx__dir-cap">
                <span className="pulse-label">{COPY.dirCap}</span>
                <span className="pulse-mono">{COPY.dirUnit}</span>
              </div>
              <div className="pulse-idx__rows">
                {sources.map((s, i) => {
                  const isFocus = i === focusSrc;
                  return (
                    <div className={"pulse-idx__src" + (isFocus ? " pulse-idx__src--focus" : "")} key={i}>
                      <span className="pulse-idx__src-no" style={isFocus ? { background: accent, color: "#fff" } : null}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="pulse-idx__src-k">{s.k}</span>
                      <span className="pulse-idx__src-en">{s.en}</span>
                      {p.showCoverage && (
                        <span className="pulse-idx__src-track">
                          <span className="pulse-idx__src-fill"
                            style={{ width: s.w + "%", background: isFocus ? accent : "var(--pulse-ink)" }} />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {p.showRing && (
              <div className="pulse-idx__ring">
                <div className="pulse-idx__ring-dial"
                  style={{ background: `conic-gradient(${accent} ${ring * 3.6}deg, var(--pulse-hair) 0)` }}>
                  <div className="pulse-idx__ring-hole">
                    <span className="pulse-idx__ring-v">{ring}<small>%</small></span>
                  </div>
                </div>
                <div className="pulse-idx__ring-meta">
                  <span className="pulse-idx__ring-k">{COPY.ringCap}</span>
                  <span className="pulse-idx__ring-note">{COPY.ringNote}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {p.showConclusion && <div className="pulse-conclusion pulse-idx__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseIndex.controls = controls;
PulseIndex.defaults = defaults;
export default PulseIndex;
export { controls };
export { defaults };
