import React from "react";
import { COLORS } from "../theme.js";
import Decor, { decorControls, decorDefaults } from "../Decor.jsx";

/* ============================================================================
   RiskChainSlide — 流程图 · 风险传导链条 (left→right cascade flows).
   Each chain is a row of cause→effect nodes connected by arrows; the primary
   chain forks into two terminal outcome badges. Count / arrows / outcomes /
   focus are all props. Pure presentational; copy is static.
   ========================================================================== */

export const controls = [
  { key: "showEyebrow", label: "装饰标签", type: "toggle", default: true,
    help: "顶部分类标签显示 / 隐藏" },
  { key: "chainCount", label: "链条数量", type: "slider", default: 3, min: 1, max: 3, step: 1,
    help: "展示的风险传导链数量" },
  { key: "showConnector", label: "传导箭头", type: "toggle", default: true,
    help: "节点之间的传导箭头显示 / 隐藏" },
  { key: "showOutcome", label: "终局结果", type: "toggle", default: true,
    help: "主链末端「估值回调 / 倒闭潮」结果分叉显示 / 隐藏" },
  { key: "focusEnabled", label: "重点突出", type: "toggle", default: false,
    help: "弱化其它链条以突出某一条" },
  { key: "focusIndex", label: "突出项", type: "slider", default: 0, min: 0, max: 2, step: 1,
    help: "被突出的链条序号（自动随链条数量收敛）" },
  ...decorControls,
];

export const defaultProps = {
  showEyebrow: true,
  chainCount: 3,
  showConnector: true,
  showOutcome: true,
  focusEnabled: false,
  focusIndex: 0,
  copy: {
    t001: "风险研判 / CHAIN",
    t002: "风险如何一步步传导",
    t003: "风险传导链条",
    t004: "三组风险并非孤立，而是沿因果链层层放大——最终汇向估值回调与行业出清。",
  },
  chains: [
  { tag: "传导链 A", title: "泡沫 → 出清", nodes: ["高估值泡沫", "盈利模式未验证", "烧钱速度过快", "资本耐心耗尽"], outcomes: ["估值回调", "倒闭潮"] },
  { tag: "传导链 B", title: "监管收紧", nodes: ["监管收紧", "AI 安全法案", "合规成本激增"] },
  { tag: "传导链 C", title: "竞争加剧", nodes: ["大厂自研竞争", "开源模型普及", "商业化壁垒降低"] },
  ],
  ...decorDefaults,
};



function Arrow({ show, color }) {
  if (!show) return <span style={{ width: 14, flexShrink: 0 }} />;
  return (
    <span aria-hidden="true" style={{ flexShrink: 0, padding: "0 12px", fontFamily: "var(--rd-sans)", fontWeight: 900, fontSize: 30, lineHeight: 1, color }}>→</span>
  );
}

export default function RiskChainSlide(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...defaultProps.copy, ...(p.copy || {}) };
  const accent = COLORS.blue;
  const count = Math.max(1, Math.min(p.chains.length, p.chainCount));
  const chains = p.chains.slice(0, count);
  const fi = Math.min(p.focusIndex, count - 1);

  return (
    <div className="rd-slide">
      <div className="rd-frame">
        <div className="rd-topbar">
          {p.showEyebrow ? <span className="rd-tag rd-anim">{copy.t001}</span> : <span />}
          <span className="rd-mono rd-anim">{copy.t002}</span>
        </div>

        <div style={{ position: "relative", paddingTop: 28, paddingBottom: 18 }}>
          <h2 className="rd-title rd-anim rd-anim-2" style={{ maxWidth: 1100 }}>{copy.t003}</h2>
          <p className="rd-cap rd-anim rd-anim-2" style={{ marginTop: 12, maxWidth: 1000 }}>{copy.t004}</p>
          <Decor show={p.showDecor} src={p.decorSrc} scale={p.decorScale} base={188} rotate={-7} pos={{ right: 90, top: -28 }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0, minHeight: 0 }}>
          {chains.map((c, ci) => {
            const hot = p.focusEnabled && ci === fi;
            const dim = p.focusEnabled && !hot;
            const lead = hot ? accent : COLORS.ink;
            return (
              <div key={c.tag} className={`rd-anim rd-anim-${Math.min(4, ci + 2)}`} style={{
                display: "flex", alignItems: "center", gap: 28,
                padding: "26px 0",
                borderTop: ci === 0 ? "none" : `1px solid ${COLORS.line2}`,
                opacity: dim ? 0.4 : 1, transition: "opacity .3s",
              }}>
                {/* label */}
                <div style={{ width: 196, flexShrink: 0 }}>
                  <div className="rd-mono" style={{ fontSize: 22, color: hot ? accent : COLORS.ink3 }}>{c.tag}</div>
                  <div className="rd-sub" style={{ fontSize: 30, marginTop: 4, color: lead }}>{c.title}</div>
                </div>

                {/* nodes */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", flexWrap: "nowrap", minWidth: 0 }}>
                  {c.nodes.map((n, ni) => (
                    <React.Fragment key={ni}>
                      {ni > 0 && <Arrow show={p.showConnector} color={hot ? accent : COLORS.ink3} />}
                      <div style={{
                        flex: "1 1 0", minWidth: 0, textAlign: "center",
                        padding: "20px 14px",
                        border: `1px solid ${hot ? accent : COLORS.line}`,
                        borderLeft: ni === 0 ? `4px solid ${hot ? accent : COLORS.ink}` : `1px solid ${hot ? accent : COLORS.line}`,
                        background: hot ? "rgba(39,66,236,0.05)" : "transparent",
                        fontFamily: "var(--rd-sans)", fontWeight: 700, fontSize: 25, letterSpacing: "-0.01em",
                        color: COLORS.ink, lineHeight: 1.15,
                      }}>{n}</div>
                    </React.Fragment>
                  ))}

                  {/* terminal outcomes (primary chain only) */}
                  {c.outcomes && p.showOutcome && (
                    <>
                      <Arrow show={p.showConnector} color={hot ? accent : COLORS.ink} />
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                        {c.outcomes.map((o) => (
                          <div key={o} style={{
                            padding: "11px 18px", background: COLORS.ink, color: COLORS.bg,
                            fontFamily: "var(--rd-sans)", fontWeight: 800, fontSize: 24, letterSpacing: "0.01em",
                            whiteSpace: "nowrap", textAlign: "center",
                          }}>{o}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
