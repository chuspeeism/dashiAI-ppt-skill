// SwSlideMatrix.jsx — "定位矩阵 / Positioning" 2×2 quadrant chart.
//
// A two-axis positioning map: competitors plotted as muted dots, 声浪 plotted as
// the highlighted accent dot in the winning quadrant. Distinct from every other
// chart (line / bars / pie). Plotted point count (3–6), quadrant tints, axis +
// quadrant labels, the highlighted "own" point and accent are props-controlled,
// 1:1 with controls; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'matrix', index: 56, label: '定位矩阵 / Positioning' };

export const defaultProps = {
  accent: C.orange,
  pointCount: 5,           // 3–6 rival points (besides 声浪)
  showQuadrants: true,     // tint the winning quadrant + labels
  showGrid: true,
  showRivalLabels: true,
  // —— content ——
  barMeta: '56 — Positioning',
  kicker: '市场定位 / Where We Sit',
  title: '把创作者放回\n[[坐标原点]]。',
  intro: '越往右上，越透明、越属于创作者本人。大多数方案挤在左下——而声浪，独自站在那个理应属于你的象限。',
  quadrantTop: '创作者主权 · 透明',
  quadrantBottom: '平台主导 · 不透明',
  axisX: '结算透明度 →',
  axisY: '创作者掌控力 →',
  ownLegend: '声浪 · 创作者主权象限',
  rivalLegend: '传统方案 ·',
  own: { cn: '声浪', en: 'SoundWave', x: 82, y: 86 },
  // x = 0..100 (left=不透明→right=透明结算), y = 0..100 (bottom=平台主导→top=创作者主导)
  rivals: [
    { cn: '传统厂牌', en: 'Labels', x: 22, y: 24 },
    { cn: '聚合分发', en: 'Aggregators', x: 58, y: 40 },
    { cn: '流媒体直发', en: 'DSP Direct', x: 46, y: 62 },
    { cn: '自建独立', en: 'DIY', x: 30, y: 70 },
    { cn: '版权代理', en: 'Publishers', x: 40, y: 30 },
    { cn: '经纪公司', en: 'Agencies', x: 26, y: 48 },
  ],
  page: '56',
  total: '82',
};

export const controls = [
  { key: 'pointCount', label: '对手数量', type: 'slider', def: 5, min: 3, max: 6, step: 1,
    desc: '矩阵中除声浪外的对照点数量' },
  { key: 'showQuadrants', label: '象限标注', type: 'toggle', def: true, desc: '显示/隐藏象限底色与标签' },
  { key: 'showGrid', label: '坐标网格', type: 'toggle', def: true, desc: '显示/隐藏坐标轴与网格' },
  { key: 'showRivalLabels', label: '对手标签', type: 'toggle', def: true, desc: '显示/隐藏对照点名称' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '声浪点 / 高亮 / 页脚强调色' },
];

export default function SwSlideMatrix(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const OWN = p.own;
  const rivals = (p.rivals || []).slice(0, Math.max(3, Math.min(6, p.pointCount)));

  // helper: x,y (0..100, y up) → CSS positions inside the plot
  const at = (x, y) => ({ left: x + '%', bottom: y + '%' });

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 0.92fr', gap: 56,
        alignItems: 'center', padding: '20px 0', position: 'relative', zIndex: 3 }}>

        {/* plot */}
        <div style={{ position: 'relative', aspectRatio: '1.18 / 1', width: '100%', alignSelf: 'center' }}>
          {/* quadrant tints */}
          {p.showQuadrants && (
            <>
              <div style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: '50%',
                background: accent + '14', borderRadius: '0 16px 0 0' }} />
              <div style={{ position: 'absolute', right: 14, top: 12, fontFamily: F.mono, fontSize: 19,
                fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: accent }}>{p.quadrantTop}</div>
              <div style={{ position: 'absolute', left: 14, bottom: 44, fontFamily: F.mono, fontSize: 18,
                letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(27,21,24,.34)' }}>{p.quadrantBottom}</div>
            </>
          )}

          {/* axes */}
          {p.showGrid && (
            <>
              <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 2.5, background: C.line2 }} />
              <div style={{ position: 'absolute', left: 0, bottom: 0, width: 2.5, height: '100%', background: C.line2 }} />
              <div style={{ position: 'absolute', left: '50%', bottom: 0, width: 1, height: '100%',
                borderLeft: '1px dashed ' + C.line }} />
              <div style={{ position: 'absolute', left: 0, bottom: '50%', width: '100%', height: 1,
                borderTop: '1px dashed ' + C.line }} />
            </>
          )}

          {/* rival dots */}
          {rivals.map((r, i) => (
            <div key={r.en} style={{ position: 'absolute', ...at(r.x, r.y), transform: 'translate(-50%, 50%)',
              display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff',
                border: '3px solid ' + C.inkMut, flexShrink: 0 }} />
              {p.showRivalLabels && (
                <span style={{ fontSize: 21, fontWeight: 700, color: C.inkMut, whiteSpace: 'nowrap' }}>{r.cn}</span>
              )}
            </div>
          ))}

          {/* own dot */}
          <div style={{ position: 'absolute', ...at(OWN.x, OWN.y), transform: 'translate(-50%, 50%)', zIndex: 4 }}>
            <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
              width: 74, height: 74, borderRadius: '50%', background: accent + '26' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 38, height: 38, borderRadius: '50%', background: accent,
                border: '4px solid #fff', boxShadow: '0 6px 18px rgba(241,90,41,.4)', flexShrink: 0 }} />
              <span style={{ background: accent, color: '#fff', fontWeight: 900, fontSize: 24,
                letterSpacing: '-.3px', padding: '6px 16px', borderRadius: 10, whiteSpace: 'nowrap' }}>{OWN.cn}</span>
            </div>
          </div>

          {/* axis captions */}
          <div style={{ position: 'absolute', left: '50%', bottom: -38, transform: 'translateX(-50%)',
            fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em', textTransform: 'uppercase', color: C.inkMut }}>{p.axisX}</div>
          <div style={{ position: 'absolute', left: -38, top: '50%', transform: 'rotate(-90deg) translateX(50%)',
            transformOrigin: 'left center', fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em',
            textTransform: 'uppercase', color: C.inkMut }}>{p.axisY}</div>
        </div>

        {/* copy rail */}
        <div style={{ minWidth: 0 }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.08, letterSpacing: '-1.4px', marginTop: 16 }}>
            {renderSwText(p.title, { hl: { tone: 'o', block: true } })}
          </h2>
          <p style={{ fontSize: 25, lineHeight: 1.66, color: '#5a4f54', marginTop: 24, maxWidth: 520 }}>
            {p.intro}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: accent, border: '3px solid #fff',
                boxShadow: '0 0 0 1px ' + accent }} />
              <span style={{ fontSize: 24, fontWeight: 700 }}>{p.ownLegend}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: '3px solid ' + C.inkMut }} />
              <span style={{ fontSize: 24, color: C.inkMut }}>{p.rivalLegend} {rivals.length} 家对照</span>
            </div>
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
