/* =========================================================================
   PulseGrid — P03 chapter card grid ("Sound Bank" archetype).
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   ========================================================================= */
import React from 'react';

const C = {
  red:"#d8402e", orange:"#e2742c", yellow:"#efbe2e", green:"#3c9a52",
  cyan:"#4da0c6", blue:"#2c44a0", purple:"#7a3c90",
  paper:"#f2efe4", ink:"#1a1814",
};

const COPY = {
  title: "报告结构",
  note: ["07 章 · 横纵分析", "FROM METHOD TO OUTLOOK"],
  chapters: [
    { zh: "研究方法",   en: "METHODOLOGY",     code: "MT" },
    { zh: "市场全景",   en: "MARKET PANORAMA", code: "MK" },
    { zh: "横向透视",   en: "CROSS-SECTION",   code: "CS" },
    { zh: "产业链分层", en: "VALUE CHAIN",      code: "VC" },
    { zh: "典型案例",   en: "CASE STUDIES",     code: "CA" },
    { zh: "风险研判",   en: "RISK ASSESSMENT",  code: "RK" },
    { zh: "结论展望",   en: "OUTLOOK",          code: "OL" },
    { zh: "附录数据",   en: "APPENDIX",         code: "AP" },
  ],
  // per-card skin + abstract block composition (positions in %)
  skins: [
    { bg: C.red,    fg: "#fff",     blocks: [[2,42,40,58,C.yellow],[34,8,34,54,C.orange],[64,30,34,70,C.paper]] },
    { bg: C.paper,  fg: C.ink,      blocks: [[2,30,30,70,C.red],[30,55,34,45,C.blue],[62,18,36,82,C.yellow]] },
    { bg: C.green,  fg: "#fff",     blocks: [[0,20,46,40,C.yellow],[40,48,38,52,C.cyan],[70,6,30,46,C.paper]] },
    { bg: C.blue,   fg: "#fff",     blocks: [[2,48,36,52,C.cyan],[30,12,36,46,C.red],[62,40,36,60,C.yellow]] },
    { bg: C.yellow, fg: C.ink,      blocks: [[0,30,42,50,C.red],[38,10,30,64,C.blue],[64,46,36,54,C.green]] },
    { bg: C.ink,    fg: C.paper,    blocks: [[2,24,32,54,C.green],[32,46,34,54,C.orange],[62,16,36,62,C.cyan]] },
    { bg: C.cyan,   fg: "#fff",     blocks: [[0,40,40,60,C.blue],[34,14,34,50,C.yellow],[64,34,36,66,C.red]] },
    { bg: C.purple, fg: "#fff",     blocks: [[2,30,36,62,C.yellow],[32,54,34,46,C.cyan],[62,12,36,60,C.orange]] },
  ],
};

function PulseGrid(props) {
  const p = Object.assign({}, PulseGrid.defaults, props);
  const count = Math.max(1, Math.min(8, p.cardCount));
  const cards = COPY.chapters.slice(0, count);

  return (
    <div className="pulse-slide pulse-grid2">
      <div className="pulse-grid2__head">
        <h1 className="pulse-grid2__title">{COPY.title}</h1>
        {p.showNote && (
          <div className="pulse-grid2__note">{COPY.note[0]}<br />{COPY.note[1]}</div>
        )}
      </div>
      <div className="pulse-rule" />

      <div
        className="pulse-grid2__grid"
        style={{ gridTemplateColumns: `repeat(${p.columns}, 1fr)`, gridAutoRows: "1fr" }}
      >
        {cards.map((ch, i) => {
          const skin = COPY.skins[i % COPY.skins.length];
          const focused = p.focusEnabled && (i + 1) === p.focusIndex;
          return (
            <div
              key={i}
              className={"pulse-card" + (focused ? " pulse-card--focus" : "")}
              style={{
                background: skin.bg,
                color: skin.fg,
                outlineColor: focused ? skin.fg : undefined,
              }}
            >
              {focused && <div className="pulse-card__tag">重点</div>}
              {p.showCardIndex && (
                <div className="pulse-card__index">{String(i + 1).padStart(2, "0")}</div>
              )}
              <div className="pulse-card__name">{ch.zh}</div>
              <div className="pulse-card__en">{ch.en}</div>

              {p.showCardGraphic && (
                <div className="pulse-card__graphic" aria-hidden="true">
                  {skin.blocks.map((b, k) => (
                    <b key={k} style={{
                      left: b[0] + "%", top: b[1] + "%",
                      width: b[2] + "%", height: b[3] + "%",
                      background: b[4],
                    }} />
                  ))}
                </div>
              )}

              <div className="pulse-card__foot">
                <div className="pulse-card__foot-label">CHAPTER</div>
                {p.showCardCode && <div className="pulse-card__code">{ch.code}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

PulseGrid.controls = [
  { key: "cardCount", type: "slider", label: "卡片数量", default: 7, min: 1, max: 8, step: 1,
    description: "展示的章节卡数量。" },
  { key: "columns", type: "slider", label: "列数", default: 4, min: 2, max: 4, step: 1,
    description: "网格列数，行数自动换行。" },
  { key: "focusEnabled", type: "toggle", label: "重点卡", default: true,
    description: "是否突出显示某一张卡片。" },
  { key: "focusIndex", type: "slider", label: "重点卡序号", default: 2, min: 1, max: 8, step: 1,
    description: "被突出显示的卡片序号（从 1 起）。" },
  { key: "showCardGraphic", type: "toggle", label: "色块图形", default: true,
    description: "卡片内的抽象色块构图。" },
  { key: "showCardIndex", type: "toggle", label: "序号", default: true,
    description: "卡片右上角的两位序号。" },
  { key: "showCardCode", type: "toggle", label: "卡片代号", default: true,
    description: "卡片右下角的大号代号。" },
  { key: "showNote", type: "toggle", label: "装饰注释", default: true,
    description: "标题右侧的装饰性说明文字。" },
];
PulseGrid.defaults = PulseGrid.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseGrid;
export const controls = PulseGrid.controls || [];
export const defaults = PulseGrid.defaults || {};
