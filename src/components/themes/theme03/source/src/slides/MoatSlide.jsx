import React from "react";
import { COLORS, FONTS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MoatSlide — 头部护城河剖析 (data: 报告 5.1/5.2/5.3 核心竞争力 · 特殊优势).
   Three company columns, each with its moat-type, a depth meter, and the
   report's three moat sources verbatim. Pure / portable — column count, meter,
   focus are props. (Depth scores mirror the 投资记分卡 壁垒 column.)
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "itemCount", label: "公司数量", type: "slider", default: 3, min: 2, max: 3, step: 1,
    help: "参与剖析的公司数量" },
  { key: "showType", label: "壁垒类型", type: "toggle", default: true,
    help: "各公司「护城河类型」标记显示 / 隐藏" },
  { key: "showMeter", label: "护城河深度", type: "toggle", default: true,
    help: "护城河深度量表显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "高亮某一家公司列" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 2, min: 0, max: 2, step: 1,
    help: "被高亮的公司序号（自动随公司数量收敛）" },
  { key: "showCallout", label: "结构解读", type: "toggle", default: true,
    help: "底部护城河小结显示 / 隐藏" },
  { key: "accent", label: "强调色", type: "select", default: "blue",
    options: [{ value: "blue", label: "电光蓝" }, { value: "lime", label: "荧光绿" }],
    help: "高亮列与标记强调色" },
  { key: "theme", label: "主题", type: "select", default: "light",
    options: [{ value: "light", label: "浅色" }, { value: "dark", label: "深色" }],
    help: "整页明暗主题" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  itemCount: 3,
  showType: true,
  showMeter: true,
  focusEnabled: false,
  focusIndex: 2,
  showCallout: true,
  accent: "blue",
  copy: {
    t001: "典型案例 / MOAT ANATOMY",
    t002: "头部公司 · 核心竞争力剖析",
    t003: "护城河 · 凭什么是它们",
    t004: "同样吸金，壁垒来源各不相同",
    t005: "0",
    t006: "护城河深度",
    t007: "↳ 护城河小结",
    t008: "模型层靠",
    t009: "信任、数据与渠道",
    t010: "筑墙，上游靠",
    t011: "资源锁定",
    t012: "立壁—— 判断标的，先看其护城河是\"可被大厂复制\"还是\"难以复制\"。",
  },
  companies: [
  { name: "Anthropic", seg: "中游 · 通用大模型", type: "信任 × 渠道", depth: 4,
    points: ["「安全对齐」路线 → 企业客户信任优势", "Claude 在代码生成、长文本理解领先", "与 Amazon、Google 云深度合作、渠道快覆盖"] },
  { name: "xAI", seg: "中游 · 通用大模型", type: "数据 × 协同", depth: 3,
    points: ["背靠 X 平台海量实时社交数据", "与特斯拉自动驾驶团队协同多模态感知", "Grok 主打「幽默 · 实时 · 无审查」差异化"] },
  { name: "CoreWeave", seg: "上游 · 算力云", type: "资源锁定", depth: 4,
    points: ["与 NVIDIA 签订长期供应协议", "手握数万张 H100 / H200 GPU", "OpenAI、Stability 等公司核心算力供应商"] },
  ],
  ...decorDefaults,
};



function Meter({ value, color, dark }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ width: 22, height: 12, background: i < value ? color : "transparent", border: `1.5px solid ${i < value ? color : "var(--rd-line)"}` }} />
      ))}
    </div>
  );
}

export default function MoatSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const dark = p.theme === "dark";
  const accent = p.accent === "lime" ? COLORS.lime : COLORS.blue;
  const accentInk = p.accent === "lime" ? COLORS.ink : COLORS.blue;
  const n = Math.max(2, Math.min(p.companies.length, p.itemCount));
  const list = p.companies.slice(0, n);
  const fi = Math.min(Math.max(0, p.focusIndex), n - 1);
  const axisCol = dark ? "#84827c" : COLORS.ink3;

  return (
    <div className={`rd-slide${dark ? " rd-dark" : ""}`}>
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div className="rd-anim rd-anim-2" style={{ display: "flex", alignItems: "baseline", gap: 20, paddingTop: 22 }}>
          <h2 className="rd-title">{copy.t003}</h2>
          <span className="rd-cap">{copy.t004}</span>
        </div>

        <div className="rd-anim rd-anim-3" style={{ flex: 1, minHeight: 0, marginTop: 24, display: "flex", gap: 36 }}>
          {list.map((c, i) => {
            const hot = p.focusEnabled && i === fi;
            const dim = p.focusEnabled && !hot;
            return (
              <div key={i} style={{
                flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
                borderTop: `5px solid ${hot ? accentInk : COLORS.ink}`,
                paddingTop: 22, opacity: dim ? 0.5 : 1,
                background: hot ? (dark ? "rgba(110,133,255,0.10)" : "rgba(39,66,236,0.05)") : "transparent",
                paddingLeft: hot ? 18 : 0, paddingRight: hot ? 18 : 0,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 38, letterSpacing: "-0.015em", color: hot ? accentInk : COLORS.ink }}>{c.name}</span>
                  <span className="rd-mono" style={{ fontSize: 15, color: axisCol }}>{copy.t005}{i + 1}</span>
                </div>
                <div className="rd-mono" style={{ fontSize: 16, color: COLORS.ink2, marginTop: 8 }}>{c.seg}</div>

                {p.showType && (
                  <span style={{ alignSelf: "flex-start", marginTop: 18, fontFamily: FONTS.sans, fontWeight: 700, fontSize: 19, color: hot && p.accent === "blue" ? COLORS.blueInk : COLORS.bg, background: hot ? accentInk : COLORS.ink, padding: "7px 14px" }}>{c.type}</span>
                )}

                {p.showMeter && (
                  <div style={{ marginTop: 20 }}>
                    <div className="rd-mono" style={{ fontSize: 14, color: axisCol, marginBottom: 9 }}>{copy.t006}</div>
                    <Meter value={c.depth} color={hot ? accentInk : COLORS.ink} dark={dark} />
                  </div>
                )}

                <ul style={{ listStyle: "none", margin: "26px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                  {c.points.map((pt, j) => (
                    <li key={j} style={{ display: "flex", gap: 12 }}>
                      <span style={{ flex: "none", width: 9, height: 9, marginTop: 11, background: hot ? accentInk : accent }} />
                      <span style={{ fontFamily: FONTS.sans, fontSize: 21, lineHeight: 1.42, color: COLORS.ink2 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {p.showCallout && (
          <div className="rd-anim rd-anim-4" style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 6, paddingTop: 16, borderTop: `1px solid ${COLORS.line}` }}>
            <span className="rd-mono" style={{ color: accentInk, flex: "none" }}>{copy.t007}</span>
            <p className="rd-cap" style={{ margin: 0, fontSize: 21 }}>{copy.t008}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t009}</strong>{copy.t010}<strong style={{ color: COLORS.ink, fontWeight: 700 }}>{copy.t011}</strong>{copy.t012}</p>
          </div>
        )}
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={114} rotate={8} pos={{ right: 40, top: 102 }} />
    </div>
  );
}
