// SwSlideBubble.jsx — "气泡图 / Bubble" three-variable scatter chart.
//
// A scatter plot where x = monthly streams, y = revenue per artist and the
// bubble area = fan base — three variables at once. Distinct from Matrix (2×2
// positioning grid) and Growth (time-series). Bubble count (4–7), grid, a
// focused bubble and the labels are props-controlled, 1:1 with `controls`; all
// visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'bubble', index: 49, label: '气泡图 / Bubble' };

export const defaultProps = {
  accent: C.purple,
  bubbleCount: 6,          // 4–7 bubbles
  focus: false,
  focusIndex: 4,           // 1-based
  showGrid: true,
  showLabels: true,
  // —— content ——
  barMeta: '49 — Bubble',
  kicker: '气泡图 / Bubble',
  title: '谁在[[高效]]地变现？',
  axisX: '← 月均播放量 STREAMS →',
  legendSize: '气泡大小 = 粉丝规模',
  railGhost: '63',
  railValue: '4.3×',
  railLabel: '说唱厂牌 · 单位粉丝产值',
  railText: '纵轴越高、变现越强；横轴越右、播放越多。右上角的气泡，正是声浪最值得加码的人群。',
  railAxisY: '纵轴 = 人均版税 · REVENUE / ARTIST',
  // x = streams (0–100), y = revenue index (0–100), r = fans weight (0–1)
  bubbles: [
    { t: '独立厂牌', s: 'Indies', x: 72, y: 68, r: 0.92 },
    { t: '卧室制作人', s: 'Bedroom', x: 38, y: 44, r: 0.55 },
    { t: '现场乐队', s: 'Live Band', x: 55, y: 78, r: 0.7 },
    { t: '说唱厂牌', s: 'Hip-Hop', x: 84, y: 58, r: 1.0 },
    { t: '电子制作', s: 'Electronic', x: 64, y: 36, r: 0.62 },
    { t: '民谣唱作', s: 'Folk', x: 30, y: 62, r: 0.46 },
    { t: '实验声音', s: 'Experimental', x: 20, y: 28, r: 0.4 },
  ],
  page: '49',
  total: '82',
};

export const controls = [
  { key: 'bubbleCount', label: '气泡数量', type: 'slider', def: 6, min: 4, max: 7, step: 1,
    desc: '散点中的气泡（音乐人类型）数量' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: false, desc: '突出其中一个气泡，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几个', type: 'slider', def: 4, min: 1, max: 7, step: 1,
    dependsOn: 'focus', desc: '高亮的气泡序号' },
  { key: 'showGrid', label: '坐标网格', type: 'toggle', def: true, desc: '显示/隐藏坐标轴与网格' },
  { key: 'showLabels', label: '气泡标签', type: 'toggle', def: true, desc: '显示/隐藏气泡上的名称标签' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '聚焦气泡 / 导语 / 页脚强调色' },
];

const W = 1180, H = 480, M = { t: 28, r: 36, b: 56, l: 70 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;
const xAt = (v) => M.l + (PW * v) / 100;
const yAt = (v) => M.t + PH * (1 - v / 100);
const rAt = (w) => 26 + w * 64;

export default function SwSlideBubble(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(4, Math.min(7, p.bubbleCount));
  const data = (p.bubbles || []).slice(0, count);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;
  const ticks = [0, 25, 50, 75, 100];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '34px 48px 22px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40 }}>

        {/* plot */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-1px', marginTop: 12, marginBottom: 4 }}>
            {renderSwText(p.title, { hl: { tone: 'p' } })}
          </h2>

          <div style={{ flex: 1, minHeight: 0 }}>
            <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
              {p.showGrid && ticks.map((t) => (
                <g key={t}>
                  <line x1={xAt(t)} y1={M.t} x2={xAt(t)} y2={M.t + PH} stroke="rgba(27,21,24,.07)" strokeWidth="1" />
                  <line x1={M.l} y1={yAt(t)} x2={W - M.r} y2={yAt(t)} stroke="rgba(27,21,24,.07)" strokeWidth="1" />
                  <text x={M.l - 14} y={yAt(t) + 6} textAnchor="end" fontFamily={F.mono} fontSize="18" fill="#9a8f8c">{t}</text>
                  <text x={xAt(t)} y={H - 26} textAnchor="middle" fontFamily={F.mono} fontSize="18" fill="#9a8f8c">{t}</text>
                </g>
              ))}
              {/* axes */}
              <line x1={M.l} y1={M.t + PH} x2={W - M.r} y2={M.t + PH} stroke="rgba(27,21,24,.28)" strokeWidth="2" />
              <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + PH} stroke="rgba(27,21,24,.28)" strokeWidth="2" />

              {/* bubbles — large first so small sit on top */}
              {data.map((b, i) => ({ b, i })).sort((a, z) => z.b.r - a.b.r).map(({ b, i }) => {
                const col = swSeriesColors[i % swSeriesColors.length];
                const on = fi === -1 || fi === i;
                const fill = fi === i ? accent : col;
                const r = rAt(b.r);
                return (
                  <g key={b.t} opacity={on ? 1 : 0.22}>
                    <circle cx={xAt(b.x)} cy={yAt(b.y)} r={r} fill={fill} fillOpacity={fi === i ? 0.92 : 0.78}
                      stroke={fi === i ? '#fff' : 'none'} strokeWidth={fi === i ? 4 : 0} />
                    {p.showLabels && (
                      <text x={xAt(b.x)} y={yAt(b.y) + 6} textAnchor="middle" fontFamily={F.sans}
                        fontWeight="700" fontSize={r > 50 ? 22 : 18} fill="#fff">{b.t}</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 19,
            letterSpacing: '.08em', color: C.inkMut, marginTop: 2 }}>
            <span>{p.axisX}</span>
            <span style={{ color: accent }}>{p.legendSize}</span>
          </div>
        </div>

        {/* side rail */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', background: accent, color: '#fff', margin: '-34px -48px -22px 0',
          padding: '34px 40px 22px', borderRadius: '0 38px 38px 0' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: -10, fontFamily: F.mono,
            fontWeight: 700, fontSize: 190, lineHeight: 0.8, color: 'rgba(255,255,255,.13)' }}>{p.railGhost}</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 84, letterSpacing: '-2px', lineHeight: 1 }}>{p.railValue}</div>
            <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{p.railLabel}</div>
            <p style={{ fontSize: 22, lineHeight: 1.6, color: 'rgba(255,255,255,.92)', marginTop: 18 }}>
              {p.railText}
            </p>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.28)',
            fontFamily: F.mono, fontSize: 19, letterSpacing: '.08em', color: 'rgba(255,255,255,.85)',
            position: 'relative', zIndex: 1 }}>
            {p.railAxisY}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
