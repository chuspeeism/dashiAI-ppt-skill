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
   PulseRisk — P12 image-led page ("风险链 / Risk Chain" archetype).
   A generic transmission-chain + factor-card slide with an ADAPTIVE image
   gallery (0–n slots, justified by aspect ratio). Top: a horizontal cause→
   effect chain. Middle: a row of factor cards with optional level badges and a
   focus highlight. Bottom: prop-driven image slots.
   Self-contained: React + .pulse-* CSS (+ PulseImageFrame). Controlled by props.
   See PulseRisk.controls for the typed, documented parameter list.
   ========================================================================= */
(function () {
  const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];

  const COPY = {
    eyebrow: "RISK ASSESSMENT",
    title: "风险研判",
    sub: "资本大年背后的下行因素",
    sheet: "RISK · 12 / 32",
    chain: ["高估值预期", "盈利兑现承压", "算力成本攀升", "资本转向观望", "估值锚重定价"],
    cards: [
      { en: "VALUATION",  zh: "估值泡沫",       c: SPECTRUM[0], level: "高", note: "一级估值远超当期收入支撑" },
      { en: "REVENUE",    zh: "盈利模式未验证", c: SPECTRUM[5], level: "高", note: "多数公司仍停留在试点阶段" },
      { en: "REGULATION", zh: "监管成本上升",   c: SPECTRUM[1], level: "中", note: "隐私、版权与合规推高交付成本" },
      { en: "COMPETITION",zh: "开源与大厂挤压", c: SPECTRUM[6], level: "中", note: "模型能力被快速商品化" },
      { en: "COMPUTE",    zh: "算力供应链卡脖子", c: SPECTRUM[3], level: "高", note: "GPU 供给与成本约束毛利" },
    ],
    galleryCap: "风险示意",
    galleryUnit: "DROP IMAGES",
    conclusion: "下一阶段会淘汰只会讲故事的公司。",
  };

  const LEVEL_C = { "高": SPECTRUM[0], "中": SPECTRUM[1], "低": SPECTRUM[2] };

  function clampAR(v) { return Math.max(0.62, Math.min(1.78, v || 1.45)); }

  function PulseRisk(props) {
    const p = Object.assign({}, PulseRisk.defaults, props);
    const accent = p.accentColor;
    const chainN = Math.max(3, Math.min(COPY.chain.length, p.chainCount));
    const chain = COPY.chain.slice(0, chainN);
    const cardN = Math.max(2, Math.min(COPY.cards.length, p.cardCount));
    const cards = COPY.cards.slice(0, cardN);
    const nImg = Math.max(0, Math.min(2, p.imageCount));
    const images = p.images || [];
    const Frame = window.PulseImageFrame;

    return (
      <div className="pulse-slide pulse-risk" style={{ "--pulse-accent": accent }}>
        <div className="pulse-pagehead">
          <div className="pulse-pagehead__l">
            <div className="pulse-eyebrow pulse-pagehead__eyebrow">{COPY.eyebrow}</div>
            <h1 className="pulse-pagehead__title">{COPY.title}</h1>
          </div>
          {p.showSheetLabel && <div className="pulse-pagehead__sheet">{COPY.sheet}</div>}
        </div>
        <div className="pulse-rule" />

        <div className="pulse-risk__body">
          {p.showChain && (
            <div className="pulse-risk__chainwrap">
              <div className="pulse-label pulse-risk__chain-cap">风险传导链 · {COPY.sub}</div>
              <div className="pulse-risk__chain">
                {chain.map((node, i) => (
                  <React.Fragment key={i}>
                    <div className="pulse-risk__node">
                      <span className="pulse-risk__node-idx">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pulse-risk__node-t">{node}</span>
                    </div>
                    {i < chain.length - 1 && <span className="pulse-risk__arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="pulse-risk__cards" style={{ gridTemplateColumns: `repeat(${cardN}, 1fr)` }}>
            {cards.map((card, i) => {
              const focus = p.focusEnabled && i + 1 === p.focusIndex;
              return (
                <div key={i}
                  className={"pulse-riskcard" + (focus ? " pulse-riskcard--focus" : "")}
                  style={{ background: card.c }}>
                  {focus && <div className="pulse-riskcard__flag">重点</div>}
                  <div className="pulse-riskcard__top">
                    <span className="pulse-riskcard__idx">{String(i + 1).padStart(2, "0")}</span>
                    {p.showLevel && (
                      <span className="pulse-riskcard__level" style={{ color: card.c, background: "#efe9da" }}>
                        风险 {card.level}
                      </span>
                    )}
                  </div>
                  <div className="pulse-riskcard__en">{card.en}</div>
                  <div className="pulse-riskcard__zh">{card.zh}</div>
                  <div className="pulse-riskcard__note">{card.note}</div>
                </div>
              );
            })}
          </div>

          {nImg > 0 && Frame && (
            <div className="pulse-risk__gallery">
              {p.showGalleryCaption && (
                <div className="pulse-risk__gallery-cap">
                  <span className="pulse-label">{COPY.galleryCap}</span>
                  <span className="pulse-mono">{COPY.galleryUnit}</span>
                </div>
              )}
              <div className="pulse-risk__gallery-row">
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

          {p.showConclusion && <div className="pulse-conclusion pulse-risk__concl">{COPY.conclusion}</div>}
        </div>
      </div>
    );
  }

  PulseRisk.controls = [
    { key: "chainCount", type: "slider", label: "传导链节点", default: 4, min: 3, max: 5, step: 1,
      description: "顶部风险传导链的节点数量。" },
    { key: "cardCount", type: "slider", label: "风险卡数量", default: 4, min: 2, max: 5, step: 1,
      description: "风险因素卡片数量（网格列数随之变化）。" },
    { key: "focusEnabled", type: "toggle", label: "突出风险", default: true,
      description: "是否突出某一张风险卡。" },
    { key: "focusIndex", type: "slider", label: "重点风险卡", default: 1, min: 1, max: 5, step: 1,
      description: "被突出的风险卡序号（从 1 起）。" },
    { key: "imageCount", type: "slider", label: "图片槽数量", default: 1, min: 0, max: 2, step: 1,
      description: "底部图片槽数量（0–2）；按各图比例自适应排布，构图自动均衡。" },
    { key: "showChain", type: "toggle", label: "传导链", default: true,
      description: "顶部的风险传导链。" },
    { key: "showLevel", type: "toggle", label: "风险等级", default: true,
      description: "卡片内的风险等级标识（高 / 中 / 低）。" },
    { key: "showGalleryCaption", type: "toggle", label: "图注", default: true,
      description: "图片区上方的装饰性图注。" },
    { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
      description: "眉标的强调色。" },
    { key: "showConclusion", type: "toggle", label: "结论文案", default: true,
      description: "底部的一句装饰性结论。" },
    { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
      description: "右上角的页码 / 章节标签。" },
  ];
  PulseRisk.defaults = PulseRisk.controls.reduce(
    (o, c) => { o[c.key] = c.default; return o; }, {}
  );

  PulseRisk.copyDefaults = COPY;
  PulseRisk.defaults = { ...(PulseRisk.defaults || {}), copy: COPY };
  window.PulseRisk = PulseRisk;
})();

const Component = window.PulseRisk;
if (!Component) throw new Error('Missing theme05 component PulseRisk');
const WrappedComponent = withTheme05Copy(Component);
export const controls = WrappedComponent.controls || [];
export const defaults = WrappedComponent.defaults || {};
export default WrappedComponent;