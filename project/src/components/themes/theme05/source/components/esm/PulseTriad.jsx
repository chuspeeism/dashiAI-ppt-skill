/* =========================================================================
   PulseTriad — P61 quote page ("三类关键资源 / Three Pillars" archetype).
   A low-density quote_page: an oversized editorial judgment is the focal point,
   anchored by a bottom row of N "pillar" blocks (a conceptual triptych — e.g.
   talent / capital / compute) joined by relational operators, reading as
   "these together form the system". paper / dark / color themes, optional ghost
   numeral, one pillar emphasizable. No image. The reusable template for any
   "one judgment + N-part concept" page.

   Self-contained & migratable: depends only on React + the shared .pulse-triad
   / .pulse-* CSS. Text/data live in COPY (not prop-driven, per spec); structure
   & style come only from props. `controls` maps 1:1 to props; `defaults` covers
   every prop.
   `export default PulseTriad; export { controls, defaults };` instead.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
const ROMAN = ["I", "II", "III"];

// Static copy + data (text/data intentionally NOT prop-driven, per spec).
const COPY = {
  kicker: "TALENT · CAPITAL · COMPUTE",
  lead: "三类关键资源",
  leadSub: "人才 · 资本 · 算力",
  // Use [text] / {text} markers: {…} = accent highlight inside the quote.
  quote: "AI 竞争首先是{资源组织能力}竞争。",
  sub: "谁能把人才、资本与算力组织进同一张网，谁就掌握了下一阶段的主动权。",
  railCap: "资源三角",
  railUnit: "RESOURCE TRIANGLE",
  op: "+",
  pillars: [
    { en: "TALENT",  zh: "人才", note: "顶尖研究员与工程团队的密度", c: SPECTRUM[0] },
    { en: "CAPITAL", zh: "资本", note: "持续、巨额且有耐心的资金", c: SPECTRUM[5] },
    { en: "COMPUTE", zh: "算力", note: "可调度的大规模训练与推理", c: SPECTRUM[3] },
  ],
  src: "EXPANDED SLIDE · P61",
  sheet: "QUOTE · 61 / 80",
};

function renderQuote(str, accent) {
  // Split on {accent} spans; render highlighted segments in accent color.
  const out = []; let i = 0; const re = /\{([^}]*)\}/g; let m; let k = 0;
  while ((m = re.exec(str)) !== null) {
    if (m.index > i) out.push(str.slice(i, m.index));
    out.push(<span key={k++} className="hl">{m[1]}</span>);
    i = m.index + m[0].length;
  }
  if (i < str.length) out.push(str.slice(i));
  return out;
}

const controls = [
  { key: "theme", type: "radio", label: "页面主题", default: "paper",
    options: [{ value: "paper", label: "纸色" }, { value: "dark", label: "深色" }, { value: "color", label: "色块" }],
    description: "整页背景：纸色 / 深色 / 整页强调色块。" },
  { key: "bgColor", type: "color", label: "色块背景", default: SPECTRUM[5], options: SPECTRUM,
    description: "「色块」主题下的整页背景色。" },
  { key: "pillarCount", type: "slider", label: "支柱数量", default: 3, min: 2, max: 3, step: 1,
    description: "底部概念支柱块的数量（2–3）。" },
  { key: "focusEnabled", type: "toggle", label: "重点支柱", default: false,
    description: "是否突出某一支柱（其余淡出）。" },
  { key: "focusIndex", type: "slider", label: "重点支柱序号", default: 1, min: 1, max: 3, step: 1,
    description: "被突出的支柱序号（从 1 起）。" },
  { key: "showRoman", type: "toggle", label: "支柱编号", default: true,
    description: "各支柱角上的罗马数字编号。" },
  { key: "showGhost", type: "toggle", label: "装饰数字", default: true,
    description: "背景超大半透明装饰数字。" },
  { key: "emphasis", type: "toggle", label: "关键词高亮", default: true,
    description: "金句中关键词的强调色高亮。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "眉标 / 关键词 / 装饰数字的强调色。" },
  { key: "showSub", type: "toggle", label: "辅助说明", default: true,
    description: "金句下方的一句辅助说明。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "右下角的小色谱条。" },
  { key: "showSheetLabel", type: "toggle", label: "页码标签", default: true,
    description: "右上角的页码 / 章节标签。" },
];
const defaults = controls.reduce((o, c) => { o[c.key] = c.default; return o; }, {});

function PulseTriad(props) {
  const p = Object.assign({}, defaults, props);
  const accent = p.accentColor;
  const theme = p.theme;
  const rootStyle = { "--pulse-accent": accent };
  if (theme === "color") rootStyle.background = p.bgColor;

  const nPillar = Math.max(2, Math.min(COPY.pillars.length, p.pillarCount));
  const pillars = COPY.pillars.slice(0, nPillar);
  const focus = p.focusEnabled ? Math.min(p.focusIndex, nPillar) - 1 : -1;

  const cls = "pulse-slide pulse-triad" + (theme === "dark" ? " pulse-triad--dark" : theme === "color" ? " pulse-triad--color" : "");

  return (
    <div className={cls} style={rootStyle}>
      <div className="pulse-triad__top">
        <div className="pulse-triad__kicker">{COPY.kicker}</div>
        {p.showSheetLabel && <div className="pulse-triad__sheet">{COPY.sheet}</div>}
      </div>

      <div className="pulse-triad__main">
        {p.showGhost && <div className="pulse-triad__ghost">{String(nPillar)}</div>}
        <div className="pulse-triad__lead">{COPY.lead}<span>{COPY.leadSub}</span></div>
        <div className="pulse-triad__quote">
          {p.emphasis ? renderQuote(COPY.quote, accent) : COPY.quote.replace(/[{}]/g, "")}
        </div>
        {p.showSub && <div className="pulse-triad__sub">{COPY.sub}</div>}
      </div>

      <div className="pulse-triad__rail">
        <div className="pulse-triad__rail-cap">
          <span className="pulse-label">{COPY.railCap}</span>
          <span className="pulse-mono">{COPY.railUnit}</span>
        </div>
        <div className="pulse-triad__pillars">
          {pillars.map((pil, i) => {
            const dim = focus >= 0 && i !== focus;
            const isFocus = focus === i;
            return (
              <React.Fragment key={i}>
                {i > 0 && <div className="pulse-triad__op">{COPY.op}</div>}
                <div
                  className={"pulse-triad__pillar" + (dim ? " pulse-triad__pillar--dim" : "") + (isFocus ? " pulse-triad__pillar--focus" : "")}
                  style={{ background: pil.c }}>
                  <div className="pulse-triad__p-en">{pil.en}</div>
                  {p.showRoman && <div className="pulse-triad__p-rom">{ROMAN[i]}</div>}
                  <div className="pulse-triad__p-num">{i + 1}</div>
                  <div className="pulse-triad__p-zh">{pil.zh}</div>
                  <div className="pulse-triad__p-note">{pil.note}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="pulse-triad__foot">
        <div className="pulse-triad__src">{COPY.src}</div>
        {p.showColorBand && (
          <div className="pulse-triad__band">
            {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
          </div>
        )}
      </div>
    </div>
  );
}

PulseTriad.controls = controls;
PulseTriad.defaults = defaults;
export default PulseTriad;
export { controls };
export { defaults };
