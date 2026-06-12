/* =========================================================================
   PulseSplit — P04 method / setup-menu slide ("Setup Menu" archetype).
   Self-contained: React + .pulse-* CSS only. Controlled entirely by props.
   ========================================================================= */
import React from 'react';

const SPECTRUM = ["#d8402e","#e2742c","#efbe2e","#3c9a52","#4da0c6","#2c44a0","#7a3c90"];
const RED = "#d8402e", INK = "#1a1814";
// panel colors limited to dark-enough hues so white menu text stays legible
const PANELS = ["#2c44a0","#7a3c90","#3c9a52","#d8402e","#1a1814"];

const COPY = {
  eyebrow: "METHODOLOGY",
  title: "横纵分析法",
  sub: "横向看空间对比，纵向看时间演化，交叉锁定资本流向。",
  specs: [
    { k: "横向 / Horizontal", v: "空间对比" },
    { k: "纵向 / Vertical",   v: "时间演化" },
    { k: "交叉 / Cross",      v: "产业分层" },
    { k: "目标 / Output",     v: "资本流向" },
  ],
  brand: "AICL",
  panelHead: "分析框架 · METHOD",
  menu: [
    { k: "横向分析", v: "空间" },
    { k: "纵向分析", v: "时间" },
    { k: "交叉分析", v: "分层" },
    { k: "数据口径", v: "≥ $100M" },
    { k: "样本规模", v: "97 笔" },
    { k: "输出结论", v: "投资判断" },
  ],
  panelFoot: "SELECT WITH (▲ ▼) · 横纵交叉定位资本流向",
};

function PulseSplit(props) {
  const p = Object.assign({}, PulseSplit.defaults, props);
  const accent = p.accentColor;
  const panel = p.panelColor;
  const specs = COPY.specs.slice(0, Math.max(2, p.specRowCount));
  const rows = COPY.menu.slice(0, Math.max(2, Math.min(6, p.menuItemCount)));
  const focusBg = panel === RED ? INK : RED;

  return (
    <div className="pulse-slide pulse-split2" style={{ "--pulse-accent": accent }}>
      <div className="pulse-split2__left">
        <div className="pulse-eyebrow pulse-split2__eyebrow">{COPY.eyebrow}</div>
        <h1 className="pulse-split2__title">{COPY.title}</h1>
        <div className="pulse-split2__sub">{COPY.sub}</div>

        <div className="pulse-split2__list">
          <div className="pulse-spectable">
            {specs.map((s, i) => (
              <div className="pulse-spectable__row" key={i}>
                <div className="pulse-spectable__k">{s.k}</div>
                <div className="pulse-spectable__v"><b>{s.v}</b></div>
              </div>
            ))}
          </div>
        </div>

        <div className="pulse-split2__foot">
          {p.showColorBand && (
            <div className="pulse-split2__band" aria-hidden="true">
              {SPECTRUM.map((c, i) => <i key={i} style={{ background: c }} />)}
            </div>
          )}
          {p.showWordmark && (
            <div className="pulse-wordmark" style={{ color: INK }}>{COPY.brand}<sup>®</sup></div>
          )}
        </div>
      </div>

      <div className="pulse-split2__panel" style={{ background: panel }}>
        <div className="pulse-split2__panel-head">{COPY.panelHead}</div>
        <div className="pulse-menu">
          {rows.map((r, i) => {
            const focused = p.focusEnabled && (i + 1) === p.focusIndex;
            return (
              <div
                key={i}
                className={"pulse-menu__row" + (focused ? " pulse-menu__row--focus" : "")}
                style={focused ? { background: focusBg } : undefined}
              >
                <span className="pulse-menu__k">
                  <span className="pulse-menu__caret">▶</span>{r.k}
                </span>
                <span className="pulse-menu__v">{r.v}</span>
              </div>
            );
          })}
        </div>
        <div className="pulse-split2__panel-foot">{COPY.panelFoot}</div>
      </div>
    </div>
  );
}

PulseSplit.controls = [
  { key: "menuItemCount", type: "slider", label: "菜单项数量", default: 6, min: 2, max: 6, step: 1,
    description: "右侧控制菜单的行数。" },
  { key: "focusEnabled", type: "toggle", label: "高亮项", default: true,
    description: "是否高亮某一条菜单项。" },
  { key: "focusIndex", type: "slider", label: "高亮项序号", default: 1, min: 1, max: 6, step: 1,
    description: "被高亮的菜单项序号（从 1 起）。" },
  { key: "panelColor", type: "color", label: "面板色", default: PANELS[0], options: PANELS,
    description: "右侧菜单面板背景色（取深色保证文字可读）。" },
  { key: "accentColor", type: "color", label: "强调色", default: SPECTRUM[0], options: SPECTRUM,
    description: "左侧眉标的强调色。" },
  { key: "specRowCount", type: "slider", label: "左侧条目数", default: 4, min: 2, max: 4, step: 1,
    description: "左侧方法说明的条目数量。" },
  { key: "showColorBand", type: "toggle", label: "色谱条", default: true,
    description: "左下角的小色谱条带。" },
  { key: "showWordmark", type: "toggle", label: "标识", default: true,
    description: "左下角的品牌标识。" },
];
PulseSplit.defaults = PulseSplit.controls.reduce(
  (o, c) => { o[c.key] = c.default; return o; }, {}
);

export default PulseSplit;
export const controls = PulseSplit.controls || [];
export const defaults = PulseSplit.defaults || {};
