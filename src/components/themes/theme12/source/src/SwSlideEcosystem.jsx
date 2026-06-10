// SwSlideEcosystem.jsx — "生态网络 / Ecosystem" hub-and-spoke diagram page.
//
// A central platform node with 3–6 orbiting capability nodes, joined by simple
// connector lines. Distinct from Process (linear steps): this shows a radial
// system where everything plugs into one account. Node count, connectors,
// the center caption and accent are props-controlled and map 1:1 to `controls`;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no runtime host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'ecosystem', index: 8, label: '生态网络 / Ecosystem' };

export const defaultProps = {
  accent: C.orange,
  nodeCount: 6,            // 3–6 orbiting nodes
  showConnectors: true,    // spokes from hub to nodes
  showCenter: true,        // central hub label
  showNodeEn: true,        // english sub-label on nodes
  // —— content ——
  barMeta: '08 — Ecosystem',
  kicker: '生态网络 / Ecosystem',
  title: '一个账户，\n接管[[每一环]]。',
  intro: '分发、结算、粉丝、版权——不再散落在十几个后台。声浪把它们收进同一个中枢，彼此打通。',
  moduleNote: '个模块 · 同一数据底座',
  hubName: '声浪',
  hubTitle: 'OS',
  hubSub: 'ONE ACCOUNT',
  nodes: [
    { cn: '一键分发', en: 'Distribute' },
    { cn: '版税结算', en: 'Royalties' },
    { cn: '粉丝直连', en: 'Fans' },
    { cn: '版权护盾', en: 'Rights' },
    { cn: '数据洞察', en: 'Insights' },
    { cn: '演出票务', en: 'Live' },
  ],
  page: '08',
  total: '82',
};

export const controls = [
  { key: 'nodeCount', label: '节点数量', type: 'slider', def: 6, min: 3, max: 6, step: 1,
    desc: '环绕中枢的能力节点数量' },
  { key: 'showConnectors', label: '连接线', type: 'toggle', def: true, desc: '显示/隐藏中枢到各节点的连线' },
  { key: 'showCenter', label: '中枢标签', type: 'toggle', def: true, desc: '显示/隐藏中央中枢说明' },
  { key: 'showNodeEn', label: '英文副标', type: 'toggle', def: true, desc: '显示/隐藏节点上的英文副标题' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '中枢 / 连线 / 页脚强调色' },
];

export default function SwSlideEcosystem(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(6, p.nodeCount));
  const items = (p.nodes || []).slice(0, count);

  // satellite positions on an ellipse (percent of the plot box), starting top.
  const rx = 35, ry = 37, cx = 50, cy = 50;
  const pos = items.map((_, i) => {
    const a = (-90 + (360 / count) * i) * (Math.PI / 180);
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '0.82fr 1.18fr',
        gap: 44, padding: '26px 0 22px', alignItems: 'stretch' }}>

        {/* left rail copy */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 60, lineHeight: 1.08, letterSpacing: '-1.4px', marginTop: 18 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
          <p style={{ fontSize: 25, lineHeight: 1.6, color: '#5a4f54', marginTop: 24, maxWidth: 440 }}>
            {p.intro}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30,
            fontFamily: F.mono, fontSize: 22, letterSpacing: '.06em', color: C.inkMut }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: accent, color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{count}</span>
            <span>{p.moduleNote}</span>
          </div>
        </div>

        {/* radial diagram */}
        <div style={{ position: 'relative', background: C.paper, borderRadius: swTheme.radius,
          overflow: 'hidden', minWidth: 0 }}>
          {/* connectors */}
          {p.showConnectors && (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
              {pos.map((s, i) => (
                <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y}
                  stroke={accent} strokeWidth="0.35" strokeDasharray="1.4 1.4" opacity="0.5" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
          )}

          {/* nodes */}
          {items.map((it, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            return (
              <div key={it.en} style={{ position: 'absolute', left: pos[i].x + '%', top: pos[i].y + '%',
                transform: 'translate(-50%,-50%)', zIndex: 3, width: 168, textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 64, height: 64, borderRadius: 18, background: pal.bg, color: pal.title,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono,
                  fontWeight: 700, fontSize: 26, boxShadow: '0 8px 22px rgba(0,0,0,.14)' }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 25, letterSpacing: '-.3px', whiteSpace: 'nowrap' }}>{it.cn}</div>
                  {p.showNodeEn && (
                    <div style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.1em', textTransform: 'uppercase',
                      color: C.inkMut, marginTop: 2 }}>{it.en}</div>
                  )}
                </div>
              </div>
            );
          })}

          {/* hub */}
          <div style={{ position: 'absolute', left: cx + '%', top: cy + '%', transform: 'translate(-50%,-50%)',
            zIndex: 4, width: 184, height: 184, borderRadius: '50%', background: accent, color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', boxShadow: '0 0 0 14px ' + accent + '22, 0 18px 40px rgba(0,0,0,.22)' }}>
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: '.2em', opacity: .85 }}>{p.hubName}</span>
            {p.showCenter && (
              <>
                <span style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-1px', lineHeight: 1, marginTop: 4 }}>{p.hubTitle}</span>
                <span style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '.12em', opacity: .82, marginTop: 6 }}>{p.hubSub}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
