// SwSlideRadar.jsx — "能力雷达 / Radar" spider-chart page.
//
// A radar plot comparing SoundWave against the legacy path across N capability
// axes — distinct from the bar/area/donut/gauge data pages. Axis count (4–6),
// series count (1–2), the grid rings and axis labels are props-controlled and
// map 1:1 to `controls`; all visible copy/data defaults live in `defaultProps`.
// The SVG is data-driven; no global side effects.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'radar', index: 55, label: '能力雷达 / Radar' };

export const defaultProps = {
  accent: C.purple,
  axisCount: 6,            // 4–6 capability axes
  seriesCount: 2,          // 1–2 series
  showGrid: true,
  showLabels: true,
  // —— content ——
  barMeta: '55 — Radar',
  kicker: '能力雷达 / Capability',
  title: '同一把尺子，\n[[六个维度]]全面领先。',
  intro: '把发行、版权、结算与数据放在一张图上比较——声浪几乎贴着外环，传统路径仍困在中心。',
  seriesAName: '声浪 SoundWave',
  seriesBName: '传统发行 Legacy',
  axes: [
    { cn: '分成', en: 'Payout', a: 0.96, b: 0.45 },
    { cn: '版权', en: 'Rights', a: 0.92, b: 0.40 },
    { cn: '数据', en: 'Insights', a: 0.88, b: 0.30 },
    { cn: '发行', en: 'Distro', a: 0.90, b: 0.62 },
    { cn: '粉丝', en: 'Fans', a: 0.84, b: 0.35 },
    { cn: '速度', en: 'Speed', a: 0.94, b: 0.50 },
  ],
  page: '55',
  total: '82',
};

export const controls = [
  { key: 'axisCount', label: '维度数', type: 'slider', def: 6, min: 4, max: 6, step: 1,
    desc: '雷达图的能力维度数量' },
  { key: 'seriesCount', label: '系列数', type: 'slider', def: 2, min: 1, max: 2, step: 1,
    desc: '对比的系列数（声浪 / 传统）' },
  { key: 'showGrid', label: '网格环', type: 'toggle', def: true, desc: '显示/隐藏背景网格环与刻度' },
  { key: 'showLabels', label: '维度标签', type: 'toggle', def: true, desc: '显示/隐藏外圈维度名称' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '主系列 / 页脚强调色' },
];

const CX = 300, CY = 300, R = 232;

export default function SwSlideRadar(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(4, Math.min(6, p.axisCount));
  const two = p.seriesCount >= 2;
  const axes = (p.axes || []).slice(0, n);
  const secondary = C.inkMut;

  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i, r) => [CX + Math.cos(angle(i)) * R * r, CY + Math.sin(angle(i)) * R * r];
  const poly = (key) => axes.map((ax, i) => pt(i, ax[key]).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '36px 52px 30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

        {/* chart */}
        <div style={{ minWidth: 0, minHeight: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', maxHeight: 560 }}>
            {p.showGrid && rings.map((r) => (
              <polygon key={r} points={axes.map((_, i) => pt(i, r).join(',')).join(' ')}
                fill="none" stroke="rgba(27,21,24,.12)" strokeWidth="1.5" />
            ))}
            {axes.map((ax, i) => {
              const [x, y] = pt(i, 1);
              return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(27,21,24,.12)" strokeWidth="1.5" />;
            })}

            {two && (
              <polygon points={poly('b')} fill={secondary + '22'} stroke={secondary} strokeWidth="3"
                strokeDasharray="3 8" strokeLinejoin="round" />
            )}
            <polygon points={poly('a')} fill={accent + '2e'} stroke={accent} strokeWidth="4" strokeLinejoin="round" />
            {axes.map((ax, i) => {
              const [x, y] = pt(i, ax.a);
              return <circle key={i} cx={x} cy={y} r="7" fill={accent} stroke={C.paper} strokeWidth="2.5" />;
            })}

            {p.showLabels && axes.map((ax, i) => {
              const [x, y] = pt(i, 1.16);
              const anchor = Math.abs(x - CX) < 24 ? 'middle' : (x > CX ? 'start' : 'end');
              return (
                <g key={i}>
                  <text x={x} y={y - 4} textAnchor={anchor} fontWeight="900" fontSize="30" fill={C.ink}>{ax.cn}</text>
                  <text x={x} y={y + 22} textAnchor={anchor} fontFamily={F.mono} fontSize="18"
                    letterSpacing="1" fill="#9a8f8c">{ax.en.toUpperCase()}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* rail */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.1, letterSpacing: '-1px', marginTop: 14 }}>
            {renderSwText(p.title, { hl: { tone: 'p' } })}
          </h2>
          <p style={{ fontSize: T.body, lineHeight: 1.66, color: '#5a4f54', marginTop: 18, maxWidth: 460 }}>
            {p.intro}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28,
            paddingTop: 24, borderTop: '1px solid ' + C.line }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 28, height: 14, borderRadius: 4, background: accent + '2e',
                border: '3px solid ' + accent }} />
              <span style={{ fontWeight: 700, fontSize: 24 }}>{p.seriesAName}</span>
            </div>
            {two && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{ width: 28, height: 14, borderRadius: 4, background: secondary + '22',
                  border: '3px dashed ' + secondary }} />
                <span style={{ fontWeight: 700, fontSize: 24, color: '#5a4f54' }}>{p.seriesBName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
