/* =========================================================================
   PulseProfile — P59 image-led page ("科研与硬科技 / Image-forward Profile" archetype).
   A generic image-DOMINANT profile page: a large ratio-aware hero image (0–n
   justified slots) takes the majority of the frame, beside a stat column with one
   oversized HERO metric, a ranked metric ladder and theme tag chips. Image / stat
   sides swappable; with 0 images the stat column goes full-width and the hero
   metric scales up. The reusable template for any "place / subject profile where
   the photograph leads + a headline stat + supporting ladder" page.

   Image slots are prop-driven (`images` + `onImageChange`); everything else by
   props. Self-contained: React + an injected/`window` PulseImageFrame + the
   shared .pulse-prof / .pulse-* CSS. Text/data live in COPY (not prop-driven).
   `export default PulseProfile; export { controls, defaults };` instead
   (import PulseImageFrame as a module, or pass it via `props.ImageFrame`).
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  eyebrow: "BOSTON CLUSTER",
  title: "科研与硬科技",
  sheet: "IMAGE · 59 / 80",
  cluster: "BOSTON",
  locale: "波士顿集群",
  lead: "波士顿集中在医疗 AI、机器人和硬科技方向 —— 高校科研与硬科技转化构成其优势。",
  metrics: [
    ["融资额", "75", "亿美元"],
    ["市场占比", "7.7", "%"],
    ["事件数", "8", "笔"],
    ["平均单笔", "9.4", "亿美元"],
  ],
  tags: ["医疗 AI", "机器人", "硬科技", "高校科研"],
  mediaCap: "科研场景",
  mediaUnit: "DROP IMAGE",
  conclusion: "科研城市更适合长周期技术资产。",
};

function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.4)); }

const controls = [
  { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 3, step: 1,
    description: "主视觉图片槽数量（0–3），按各图比例自适应。为 0 时数据列铺满整幅、主指标放大。" },
  { key: "imageSide", type: "radio", label: "图片位置", default: "left",
    options: [{ value: "left", label: "左侧" }, { value: "right", label: "右侧" }],
    description: "图片相对数据列的位置（有图片时生效）。" },
  { key: "heroIndex", type: "slider", label: "主指标序号", default: 1, min: 1, max: 4, step: 1,
    description: "作为巨号主指标突出显示的指标序号（从 1 起）。" },
  { key: "metricCount", type: "slider", label: "指标项数", default: 4, min: 2, max: 4, step: 1,
    description: "参与显示的指标数量（主指标 + 阶梯）。" },
  { key: "showLadderIndex", type: "toggle", label: "阶梯序号", default: true,
    description: "阶梯指标行左侧的两位序号。" },
  { key: "tagCount", type: "slider", label: "标签数量", default: 4, min: 0, max: 4, step: 1,
    description: "主题标签 chip 数量（0 隐藏整行）。" },
  { key: "showLead", type: "toggle", label: "引导文案", default: true,
    description: "地名下方的一段引导说明。" },
  { key: "showMediaCaption", type: "toggle", label: "图注", default: true,
    description: "图片区上方的装饰性图注。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[6], options: SPECTRUM,
    description: "眉标 / 主指标 / 强调条的强调色。" },
  { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
    description: "底部的一句装饰性结论。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseProfile(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const Frame = PulseImageFrame;

  const nMetric = Math.max(2, Math.min(COPY.metrics.length, p.metricCount));
  const all = COPY.metrics.slice(0, nMetric);
  const heroIdx = Math.min(p.heroIndex, nMetric) - 1;
  const hero = all[heroIdx];
  const ladder = all.filter((_, i) => i !== heroIdx);

  const nTag = Math.max(0, Math.min(COPY.tags.length, p.tagCount));
  const tags = COPY.tags.slice(0, nTag);

  const nImg = Math.max(0, Math.min(3, p.imageCount));
  const images = p.images || [];
  const hasMedia = nImg > 0 && Frame;

  const stat = (
    <div className={"pulse-prof__stat" + (hasMedia ? "" : " pulse-prof__stat--wide")}>
      <div className="pulse-prof__head">
        <span className="pulse-prof__cluster">{COPY.cluster}</span>
        <span className="pulse-prof__locale">{COPY.locale}</span>
      </div>
      {p.showLead && <div className="pulse-prof__lead">{COPY.lead}</div>}
      <div className="pulse-prof__hero">
        <div className="pulse-prof__hero-v" style={{ color: accent }}>{hero[1]}<small>{hero[2]}</small></div>
        <div className="pulse-prof__hero-k">{hero[0]}</div>
      </div>
      <div className="pulse-prof__ladder">
        {ladder.map((m, i) => (
          <div key={i} className="pulse-prof__l">
            {p.showLadderIndex && <span className="pulse-prof__l-i">{String(i + 2).padStart(2, "0")}</span>}
            <span className="pulse-prof__l-k">{m[0]}</span>
            <span className="pulse-prof__l-v">{m[1]}<small>{m[2]}</small></span>
          </div>
        ))}
      </div>
      {nTag > 0 && (
        <div className="pulse-prof__tags">
          {tags.map((t, i) => <span key={i} className="pulse-prof__tag" style={{ borderColor: accent }}>{t}</span>)}
        </div>
      )}
    </div>
  );

  const media = hasMedia && (
    <div className="pulse-prof__media">
      {p.showMediaCaption && (
        <div className="pulse-prof__media-cap">
          <span className="pulse-label">{COPY.mediaCap}</span>
          <span className="pulse-mono">{COPY.mediaUnit}</span>
        </div>
      )}
      <div className="pulse-prof__media-row">
        {Array.from({ length: nImg }).map((_, i) => {
          const im = images[i] || {};
          const grow = clampAR(im.ar);
          return (
            <div key={i} style={{ flex: `${grow} 1 0`, minWidth: 0 }}>
              <Frame src={im.src || null} ar={im.ar || null} fill={true}
                editable={p.editable !== false} label={"IMG." + (i + 1)} placeholder="拖入科研场景图"
                onChange={(src, ar) => p.onImageChange && p.onImageChange(i, src, ar)} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pulse-slide pulse-prof" style={{ "--pulse-accent": accent }}>
      <div className="pulse-pagehead">
        <div className="pulse-pagehead__l">
          <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
          <h1 className="pulse-pagehead__title">{COPY.title}</h1>
        </div>
        {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
      </div>
      <div className="pulse-rule" />

      <div className="pulse-prof__body">
        <div className={"pulse-prof__row" + (hasMedia && p.imageSide === "right" ? " pulse-prof__row--rev" : "")}>
          {hasMedia ? <React.Fragment>{media}{stat}</React.Fragment> : stat}
        </div>
        {p.showConclusion && <div className="pulse-conclusion pulse-prof__concl">{COPY.conclusion}</div>}
      </div>
    </div>
  );
}

PulseProfile.controls = controls;
PulseProfile.defaults = defaults;
export default PulseProfile;
export { controls };
export { defaults };
