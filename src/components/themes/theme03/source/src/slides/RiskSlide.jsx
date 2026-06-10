import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RiskSlide — 风险研判 (risk cards).
   A grid of numbered risk cards; count is adjustable and a card can be focused.
   Pure presentational, props-driven; text is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "cardCount", label: "卡片数量", type: "slider", default: 4, min: 1, max: 4, step: 1,
    help: "展示的风险卡片数量" },
  { key: "columns", label: "网格列数", type: "select", default: "2",
    options: [{ value: "2", label: "两列" }, { value: "4", label: "四列" }],
    help: "卡片网格的列数布局" },
  { key: "showIndex", label: "卡片序号", type: "toggle", default: true,
    help: "卡片角标序号显示 / 隐藏" },
  { key: "showMeter", label: "风险等级", type: "toggle", default: true,
    help: "每张卡片的风险等级标记显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它卡片以突出某一张" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 3, step: 1,
    help: "被突出的卡片序号（从 0 起）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  cardCount: 4,
  columns: "2",
  showIndex: true,
  showMeter: true,
  focusEnabled: false,
  focusIndex: 0,
  copy: {
    t001: "风险研判 / 09",
    t002: "多重风险信号 · 不容忽视",
    t003: "当前市场的主要风险",
  },
  risks: [
  { idx: "01", name: "估值泡沫与盈利困境", en: "VALUATION BUBBLE", level: 3,
    desc: "多数估值建立在「未来市值」而非当前收入之上。Anthropic 9650 亿估值对应 2024 年预计收入约 8 亿，P/S 超千倍，宏观收紧时回调难免。" },
  { idx: "02", name: "监管压力加大", en: "REGULATION", level: 2,
    desc: "欧盟 AI Act、美国各州数据隐私法案相继生效，合规成本与法律风险上升；技术标准尚未统一，政策不确定性高。" },
  { idx: "03", name: "大厂挤压与开源冲击", en: "BIG-TECH & OSS", level: 3,
    desc: "Google、Meta、Microsoft 自研模型凭生态优势形成降维打击；Llama、Mistral 等开源性能逼近闭源，削弱 API 收费壁垒。" },
  { idx: "04", name: "算力供应链卡脖子", en: "COMPUTE SUPPLY", level: 2,
    desc: "NVIDIA GPU 供应紧张，叠加出口管制加码，算力成本居高不下，中小公司难以承受长期烧钱。" },
  ],
  ...decorDefaults,
};



function Meter({ level, color }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {[1, 2, 3].map((i) => (
        <span key={i} style={{ width: 22, height: 8, background: i <= level ? color : "rgba(22,21,19,0.14)" }} />
      ))}
      <span className="rd-mono" style={{ fontSize: 20, marginLeft: 6, color: COLORS.ink3 }}>
        {level >= 3 ? "高" : level === 2 ? "中" : "低"}
      </span>
    </div>
  );
}

export default function RiskSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = COLORS.blue;
  const count = Math.max(1, Math.min(4, p.cardCount));
  const cards = p.risks.slice(0, count);
  const focusIndex = Math.min(p.focusIndex, count - 1);
  const cols = p.columns === "4" ? Math.min(4, count) : Math.min(2, count);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 8 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1000 }}>{copy.t003}</h2>
          <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={196} rotate={-6} pos={{ right: 110, top: -34 }} />
        </div>

        <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0, minHeight: 0 }}>
          {cards.map((c, i) => {
            const hot = p.focusEnabled && i === focusIndex;
            const dim = p.focusEnabled && !hot;
            const col = i % cols;
            const row = Math.floor(i / cols);
            return (
              <div key={c.idx} className={`rd-anim rd-anim-${Math.min(4, (i % cols) + 2)}`} style={{
                display: "flex", flexDirection: "column", padding: "34px 40px 28px",
                borderLeft: col === 0 ? "none" : `1px solid ${COLORS.line2}`,
                borderTop: row === 0 ? "none" : `1px solid ${COLORS.line2}`,
                background: hot ? "rgba(39,66,236,0.05)" : "transparent",
                opacity: dim ? 0.4 : 1, transition: "opacity .3s, background .3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {p.showIndex && <span className="rd-mono" style={{ fontSize: 26, color: hot ? accent : COLORS.ink3 }}>{c.idx}</span>}
                  {p.showMeter && <Meter level={c.level} color={hot ? accent : COLORS.ink} />}
                </div>
                <h3 className="rd-headline" style={{ fontSize: 36, marginTop: 16, color: hot ? accent : COLORS.ink }}>{c.name}</h3>
                <div className="rd-mono" style={{ fontSize: 21, marginTop: 7, color: COLORS.ink3 }}>{c.en}</div>
                <p className="rd-cap" style={{ marginTop: 16, maxWidth: 640 }}>{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
