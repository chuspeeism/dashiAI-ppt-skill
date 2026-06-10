import React from "react";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   MethodSlide — research method ("横纵分析法") as a row of numbered cards,
   each with a generative node-diagram. Mirrors the reference "HOW IT WORKS"
   layout: label + title on the left, cards on the right.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "左侧分类标签显示 / 隐藏" },
  { key: "cardCount", label: "卡片数量", type: "slider", default: 2, min: 1, max: 3, step: 1,
    help: "展示的维度卡片数量" },
  { key: "showDiagram", label: "装饰图形", type: "toggle", default: true,
    help: "卡片中的生成式节点图显示 / 隐藏" },
  { key: "diagramStyle", label: "图形类型", type: "select", default: "auto",
    options: [
      { value: "auto", label: "自动" },
      { value: "radial", label: "网格" },
      { value: "burst", label: "放射" },
      { value: "orbit", label: "环轨" },
      { value: "mesh", label: "矩阵" },
      { value: "spiral", label: "螺旋" },
      { value: "constellation", label: "星座" },
    ], help: "生成式节点图的视觉样式（auto 按序轮换）" },
  { key: "diagramArt", label: "替换为元素", type: "icons", default: null,
    help: "选中后用 3D 元素替换全部卡片的节点图（选项由预览提供）" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它卡片以突出某一张" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被突出的卡片序号（从 0 起）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  cardCount: 2,
  showDiagram: true,
  diagramStyle: "auto",
  diagramArt: null,
  focusEnabled: false,
  focusIndex: 0,
  // —— visible content (override per deck) ——
  eyebrow: "研究方法 / METHOD",
  kicker: "01 / 横纵分析框架",
  leadTitle: "横纵分析法",
  leadBody: "本报告以横纵分析法为基本框架——从两个正交的维度切入同一组数据，互为补充，避免单一视角的盲区。",
  leadNote: "↳ 横向看集中 · 纵向看节奏",
  cards: [
    { idx: "01", name: "横向", dim: "空间维度 // 对比",
      desc: "在同一时间截面上，对不同公司、赛道、轮次与地区做横向对比，回答「谁更大、谁更密集、资源集中在哪里」。" },
    { idx: "02", name: "纵向", dim: "时间维度 // 趋势",
      desc: "沿时间轴追踪同一指标的演化，回答「趋势向上还是向下、拐点在何处、节奏是否可持续」。" },
    { idx: "03", name: "交叉", dim: "结构维度 // 因果",
      desc: "两个维度交叉后，识别产业链的层级结构与因果传导关系，定位结构性机会所在。" },
  ],
  ...decorDefaults,
};

/* ---- generative node diagram (abstract, geometric only) ------------------- */
function MethodDiagram({ kind, color, size = 230 }) {
  const c = size / 2;
  const dots = [];
  const lines = [];
  // Theme-aware: these tokens flip in dark mode so the diagram stays visible.
  const stroke = "var(--rd-ink-3)";
  const dotFill = "var(--rd-ink-2)";

  if (kind === "radial") {
    const N = 9, rings = [size * 0.16, size * 0.3, size * 0.42];
    const pts = rings.map((r) =>
      Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        return [c + Math.cos(a) * r, c + Math.sin(a) * r];
      })
    );
    pts.forEach((ring) => ring.forEach((p, i) => {
      const q = ring[(i + 1) % N];
      lines.push([p[0], p[1], q[0], q[1]]);
    }));
    for (let i = 0; i < N; i++) lines.push([c, c, pts[2][i][0], pts[2][i][1]]);
    pts.flat().forEach((p) => dots.push([p[0], p[1], 2.4]));
    dots.push([c, c, 3.4]);
  } else if (kind === "burst") {
    const N = 26;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const len = size * (0.22 + 0.22 * ((Math.sin(i * 2.3) + 1) / 2));
      const x = c + Math.cos(a) * len, y = c + Math.sin(a) * len;
      lines.push([c, c, x, y]);
      dots.push([x, y, 2.2]);
    }
    dots.push([c, c, 7, color]);
    dots.push([c, c, 12, "ring"]);
  } else if (kind === "orbit") {
    const rings = [size * 0.18, size * 0.32, size * 0.44];
    rings.forEach((r, ri) => {
      const N = 6 + ri * 3;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + ri * 0.4;
        dots.push([c + Math.cos(a) * r, c + Math.sin(a) * r, 2.6]);
      }
    });
    dots.push([c, c, 4, color]);
  } else if (kind === "mesh") {
    const G = 5, span = size * 0.66, step = span / (G - 1), o = c - span / 2;
    const grid = [];
    for (let r = 0; r < G; r++) for (let col = 0; col < G; col++) grid.push([o + col * step, o + r * step]);
    for (let r = 0; r < G; r++) for (let col = 0; col < G; col++) {
      const p = [o + col * step, o + r * step];
      if (col < G - 1) lines.push([p[0], p[1], p[0] + step, p[1]]);
      if (r < G - 1) lines.push([p[0], p[1], p[0], p[1] + step]);
    }
    grid.forEach((p) => dots.push([p[0], p[1], 2.2]));
    dots.push([c, c, 4.2, color]);
  } else if (kind === "spiral") {
    const N = 46;
    let prev = null;
    for (let i = 0; i <= N; i++) {
      const a = i * 0.46, r = (i / N) * size * 0.44;
      const x = c + Math.cos(a) * r, y = c + Math.sin(a) * r;
      if (prev) lines.push([prev[0], prev[1], x, y]);
      if (i % 3 === 0) dots.push([x, y, 2.2]);
      prev = [x, y];
    }
    dots.push([c, c, 4.2, color]);
  } else { // constellation
    const N = 13, pts = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2.399963, r = size * 0.12 + (i / N) * size * 0.32;
      pts.push([c + Math.cos(a) * r, c + Math.sin(a) * r]);
    }
    for (let i = 0; i < N - 1; i++) lines.push([pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]]);
    pts.forEach((p, i) => dots.push([p[0], p[1], i % 4 === 0 ? 3.2 : 2]));
    dots.push([c, c, 4.2, color]);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", color: "var(--rd-ink)" }}>
      {kind === "orbit" && [size * 0.18, size * 0.32, size * 0.44].map((r, i) => (
        <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={stroke} strokeWidth="0.8" />
      ))}
      {lines.map((l, i) => (
        <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={stroke} strokeWidth="0.8" />
      ))}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d[0]} cy={d[1]} r={d[2]}
          fill={d[3] === "ring" ? "none" : (d[3] || dotFill)}
          stroke={d[3] === "ring" ? color : "none"}
          strokeWidth={d[3] === "ring" ? 2 : 0}
        />
      ))}
    </svg>
  );
}

export default function MethodSlide(props) {
  const p = { ...defaultProps, ...props };
  const CARDS = p.cards || [];
  const accent = "var(--rd-blue)";
  const count = Math.max(1, Math.min(3, p.cardCount));
  const cards = CARDS.slice(0, count);
  const focusIndex = Math.min(p.focusIndex, count - 1);
  const styleFor = (i) => (p.diagramStyle === "auto" ? ["radial", "burst", "orbit", "mesh", "spiral", "constellation"][i % 6] : p.diagramStyle);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? (
            <span className="rd-tag rd-anim">{p.eyebrow}</span>
          ) : <span />}
          <span className="rd-mono rd-anim">{p.kicker}</span>
        </div>

        <div style={{ flex: 1, display: "flex", gap: 72, paddingTop: 48 }}>
          {/* left intro */}
          <div className="rd-anim rd-anim-2" style={{ width: 460, flex: "none" }}>
            <h2 className="rd-title">{p.leadTitle}</h2>
            <p className="rd-body" style={{ marginTop: 32, maxWidth: 400 }}>
              {p.leadBody}
            </p>
            <div className="rd-mono" style={{ marginTop: 44, color: accent }}>
              {p.leadNote}
            </div>
          </div>

          {/* cards */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 40 }}>
            {cards.map((card, i) => {
              const dimmed = p.focusEnabled && i !== focusIndex;
              const focused = p.focusEnabled && i === focusIndex;
              return (
                <div
                  key={card.idx}
                  className={`rd-anim rd-anim-${Math.min(4, i + 2)}`}
                  style={{
                    display: "flex", flexDirection: "column",
                    paddingTop: 26,
                    borderTop: `2px solid ${focused ? accent : "var(--rd-line)"}`,
                    opacity: dimmed ? 0.32 : 1,
                    transition: "opacity .35s, border-color .35s",
                  }}
                >
                  <div className="rd-mono" style={{ fontSize: 24, color: accent }}>{card.idx}</div>
                  <h3 className="rd-headline" style={{ marginTop: 10, color: focused ? accent : "var(--rd-ink)" }}>
                    {card.name}
                  </h3>
                  <div className="rd-mono" style={{ fontSize: 24, marginTop: 8 }}>{card.dim}</div>

                  {p.showDiagram && (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "18px 0", minHeight: 200 }}>
                      {p.diagramArt ? (
                        <img src={p.diagramArt} alt="" aria-hidden="true"
                          style={{ maxWidth: 220, maxHeight: 220, width: "auto", height: "auto", objectFit: "contain",
                            filter: "drop-shadow(0 16px 20px rgba(22,21,19,0.24))" }} />
                      ) : (
                        <MethodDiagram kind={styleFor(i)} color={accent} size={230} />
                      )}
                    </div>
                  )}

                  <p className="rd-cap" style={{ marginTop: p.showDiagram ? 0 : 24 }}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={240} rotate={-4} pos={{ left: 110, bottom: 78 }} />
    </div>
  );
}
