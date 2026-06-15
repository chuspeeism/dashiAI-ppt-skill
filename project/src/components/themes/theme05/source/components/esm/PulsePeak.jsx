import React from 'react';
import './PulseImageFrame.jsx';
const window = globalThis.__theme05Window || (globalThis.__theme05Window = {});
globalThis.React = React;
function withTheme05Copy(Component) {
  const defaultCopy = Component.copyDefaults || Component.defaults?.copy || null;
  function Theme05CopyWrapped(props = {}) {
    const copy = mergeTheme05Copy(defaultCopy, props.copy);
    const element = Component({ ...props, copy });
    return replaceTheme05Text(element, theme05ReplacementMap(defaultCopy, copy));
  }
  Theme05CopyWrapped.controls = Component.controls || [];
  Theme05CopyWrapped.defaults = { ...(Component.defaults || {}), ...(defaultCopy ? { copy: defaultCopy } : {}) };
  return Theme05CopyWrapped;
}

function mergeTheme05Copy(base, override) {
  if (!base || typeof base !== 'object') return override || base;
  if (!override || typeof override !== 'object') return base;
  if (Array.isArray(base)) return Array.isArray(override) ? override : base;
  const next = { ...base };
  for (const [key, value] of Object.entries(override)) {
    next[key] = base[key] && typeof base[key] === 'object' && value && typeof value === 'object'
      ? mergeTheme05Copy(base[key], value)
      : value;
  }
  return next;
}

function theme05ReplacementMap(base, copy, map = new Map()) {
  if (!base || !copy) return map;
  if (typeof base === 'string' || typeof base === 'number') {
    const from = String(base).replace(/\u00a0/g, ' ');
    const to = typeof copy === 'string' || typeof copy === 'number' ? String(copy) : copy;
    if (from && to !== undefined && to !== null && (!map.has(from) || String(to) !== from)) map.set(from, to);
    return map;
  }
  if (Array.isArray(base) && Array.isArray(copy)) {
    base.forEach((item, index) => theme05ReplacementMap(item, copy[index], map));
    return map;
  }
  if (typeof base === 'object' && typeof copy === 'object') {
    Object.keys(base).forEach(key => theme05ReplacementMap(base[key], copy[key], map));
  }
  return map;
}

function replaceTheme05Text(node, replacements) {
  if (!replacements?.size) return node;
  if (typeof node === 'string' || typeof node === 'number') {
    return replacements.get(String(node).replace(/\u00a0/g, ' ')) ?? node;
  }
  if (Array.isArray(node)) return node.map(child => replaceTheme05Text(child, replacements));
  if (!React.isValidElement(node)) return node;
  const nextProps = {};
  let changed = false;
  for (const key of ['children', 'label', 'placeholder', 'title', 'alt', 'aria-label']) {
    if (!(key in node.props)) continue;
    const next = replaceTheme05Text(node.props[key], replacements);
    if (next !== node.props[key]) {
      nextProps[key] = next;
      changed = true;
    }
  }
  return changed ? React.cloneElement(node, nextProps) : node;
}

/* =========================================================================
   PulsePeak — P19 image-led peak page ("峰值图文" archetype).
   A generic "focal subject + metric spec + highlighted chart + adaptive
   image gallery" slide. Left: giant subject glyph + metric spec. Right (dark
   panel): a switchable chart (area / bar / line) with a peak marker, plus an
   ADAPTIVE image gallery (0–n slots, justified by aspect ratio).
   Self-contained: React + .pulse-* CSS (+ PulseImageFrame). Controlled by props.
   See PulsePeak.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "QUARTER BREAKDOWN",
    title: "全年峰值季度",
    sub: "Q3 融资拆解",
    sheet: "Q3 · 19 / 32",
    glyph: "Q3",
    name: "Q3 融资拆解 · 全年高点",
    metrics: [
      { k: "融资额", v: "318", u: "亿美元" },
      { k: "事件数", v: "31", u: "笔" },
      { k: "平均单笔", v: "10.3", u: "亿美元" },
      { k: "峰值月份", v: "8", u: "月" },
    ],
    panelTitle: "峰值月度",
    unit: "亿美元 / 月",
    points: [
      { axis: "7月", v: 92 },
      { axis: "8月", v: 118 },
      { axis: "9月", v: 108 },
    ],
    galleryCap: "峰值示意",
    galleryUnit: "DROP IMAGES",
    conclusion: "高峰之后，市场开始从热度转向筛选。",
  };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  function PeakChart({ pts, type, focusEnabled, focusIndex, accent }) {
    const max = Math.max.apply(null, pts.map((p) => p.v)) * 1.16;
    const base = "#efe9da";
    const n = pts.length;
    const xAt = (i) => (n === 1 ? 50 : (i / (n - 1)) * 96 + 2);
    const yAt = (v) => 100 - (v / max) * 100;
    const linePts = pts.map((p, i) => `${xAt(i)},${yAt(p.v)}`).join(" ");
    const areaPts = `2,100 ${linePts} ${xAt(n - 1)},100`;

    return (
      <div className="pulse-chart">
        <div className="pulse-chart__plot">
          <div className="pulse-chart__grid">
            {[25, 50, 75].map((t) => <i key={t} style={{ top: t + "%" }} />)}
          </div>

          {type === "bar" ? (
            <div className="pulse-chart__bars">
              {pts.map((p, i) => {
                const focus = focusEnabled && i + 1 === focusIndex;
                return (
                  <div className="pulse-chart__col" key={i}>
                    <div
                      className={"pulse-chart__bar" + (focus ? " pulse-chart__bar--focus" : "")}
                      style={{ height: (p.v / max) * 100 + "%", "--bar": focus ? accent : base }}>
                      <span className="pulse-chart__val">{p.v}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <React.Fragment>
              <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {type === "area" && <polygon points={areaPts} fill={accent} fillOpacity="0.24" />}
                <polyline points={linePts} fill="none" stroke={accent} strokeWidth="2.6"
                  strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg className="pulse-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {pts.map((p, i) => {
                  const focus = focusEnabled && i + 1 === focusIndex;
                  return (
                    <g key={i}>
                      <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap"
                        vectorEffect="non-scaling-stroke" strokeWidth={focus ? 28 : 20}
                        stroke={focus ? "#fff" : accent} />
                      <path d={`M ${xAt(i)} ${yAt(p.v)} h 0.001`} className="pulse-dotcap pulse-dotcap--core"
                        vectorEffect="non-scaling-stroke" strokeWidth={focus ? 20 : 12} />
                    </g>
                  );
                })}
              </svg>
            </React.Fragment>
          )}
        </div>

        <div className="pulse-chart__axis">
          {pts.map((p, i) => {
            const focus = focusEnabled && i + 1 === focusIndex;
            return <span key={i} className={focus ? "is-focus" : ""}>{p.axis}</span>;
          })}
        </div>
      </div>
    );
  }

  function PulsePeak(props) {
    const p = Object.assign({}, PulsePeak.defaults, props);
    const accent = p.accentColor;
    const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
    const metrics = COPY.metrics.slice(0, nMetric);
    const nPts = Math.max(2, Math.min(COPY.points.length, p.pointCount));
    const pts = COPY.points.slice(0, nPts);
    const nImg = Math.max(0, Math.min(3, p.imageCount));
    const images = p.images || [];
    const Frame = window.PulseImageFrame;

    // peak label derived from the focused point (defaults to global max).
    const peakIdx = p.focusEnabled
      ? Math.max(0, Math.min(pts.length - 1, p.focusIndex - 1))
      : pts.reduce((bi, pt, i, a) => (pt.v > a[bi].v ? i : bi), 0);
    const peak = pts[peakIdx];

    return (
      <div className="pulse-slide pulse-stat" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-stat__body">
          <div className="pulse-stat__id">
            <div className="pulse-stat__glyph">{COPY.glyph}</div>
            <div className="pulse-stat__name">{COPY.name}</div>
            <div className="pulse-stat__metrics">
              {metrics.map((m, i) => (
                <div key={i} className="pulse-stat__m">
                  <div className="pulse-stat__m-k">{m.k}</div>
                  <div className="pulse-stat__m-v">{m.v}<small>{m.u}</small></div>
                </div>
              ))}
            </div>
            {p.showSwatches && (
              <div className="pulse-stat__band">
                {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
              </div>
            )}
          </div>

          <div className="pulse-stat__viz">
            <div className="pulse-stat__panel">
              <div className="pulse-stat__panel-head">
                <div className="pulse-stat__panel-title">{COPY.panelTitle}</div>
                {p.showPeakBadge
                  ? <div className="pulse-stat__pill" style={{ background: accent }}>峰值 · {peak.axis}<small>{peak.v}</small></div>
                  : <div className="pulse-mono" style={{ color: "var(--pulse-on-dark-mute)" }}>{COPY.unit}</div>}
              </div>

              <div className="pulse-peak__chart">
                <PeakChart pts={pts} type={p.chartType} focusEnabled={p.focusEnabled}
                  focusIndex={p.focusIndex} accent={accent} />
              </div>

              {nImg > 0 && Frame && (
                <div className="pulse-peak__gallery">
                  {p.showGalleryCaption && (
                    <div className="pulse-peak__gallery-cap">
                      <span className="pulse-label">{COPY.galleryCap}</span>
                      <span className="pulse-mono">{COPY.galleryUnit}</span>
                    </div>
                  )}
                  <div className="pulse-peak__gallery-row">
                    {Array.from({ length: nImg }).map((_, i) => {
                      const im = images[i] || {};
                      const grow = clampAR(im.ar);
                      return (
                        <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
                          <Frame
                            src={im.src || null}
                            ar={im.ar || null}
                            fill={true}
                            editable={p.editable !== false}
                            label={"IMG." + (i + 1)}
                            placeholder="拖入图片"
                            onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {p.showConclusion && <div className="pulse-conclusion pulse-stat__concl">{COPY.conclusion}</div>}
          </div>
        </div>
      </div>
    );
  }

  PulsePeak.controls = [
    { key: "chartType", type: "radio", label: "图表类型", default: "area",
      options: [{ value: "area", label: "面积" }, { value: "bar", label: "柱状" }, { value: "line", label: "折线" }],
      description: "峰值证据图表的呈现方式：面积 / 柱状 / 折线。" },
    { key: "pointCount", type: "slider", label: "数据点数量", default: 3, min: 2, max: 3, step: 1,
      description: "图表展示的数据点（时间截面）数量。" },
    { key: "focusEnabled", type: "toggle", label: "峰值标记", default: true,
      description: "是否标记峰值数据点（关闭时自动取最大值）。" },
    { key: "focusIndex", type: "slider", label: "峰值数据点", default: 2, min: 1, max: 3, step: 1,
      description: "被标记为峰值的数据点序号（从 1 起）。" },
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
      description: "面板下方图片槽数量（0–3）；按各图比例自适应排布，构图自动均衡。" },
    { key: "showPeakBadge", type: "toggle", label: "峰值徽标", default: true,
      description: "面板右上角的峰值徽标（关闭时显示单位说明）。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "metricCount", type: "slider", label: "指标行数", default: 4, min: 2, max: 4, step: 1,
      description: "左侧主体卡的指标行数量。" },
    { key: "showSwatches", type: "toggle", label: "色谱色卡", default: true,
      description: "左下角的装饰性色谱色卡。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "主体字形 / 峰值标记 / 眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "面板下方的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulsePeak.defaults = PulsePeak.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulsePeak.copyDefaults = COPY;
  PulsePeak.defaults = { ...(PulsePeak.defaults || {}), copy: COPY };
  window.PulsePeak = PulsePeak;
})();

const Component = window.PulsePeak;
if (!Component) throw new Error('Missing theme05 component PulsePeak');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;