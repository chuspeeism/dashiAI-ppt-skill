// SwSlideSankey.jsx — "资金流向 / Flow" single-stage sankey diagram.
//
// Total revenue on the left flows through proportional ribbons into N allocation
// buckets on the right. Distinct from Treemap (nested area) and Funnel (stages).
// Bucket count (3–5), a focused ribbon, the value labels and accent are all
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. No host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'sankey', index: 42, label: '资金流向 / Flow' };

export const defaultProps = {
  accent: C.green,
  bucketCount: 5,          // 3–5 destinations
  focus: true,
  focusIndex: 1,           // 1-based
  showValues: true,
  // —— content ——
  barMeta: '42 — Flow',
  kicker: '资金流向 / Flow',
  title: '每 100 元，[[70 元]]回到创作者。',
  totalValue: '¥2.4亿',
  totalLabel: '年度总营收 · 2026',
  sourceLabel: '总营收',
  sourceSub: 'REVENUE',
  buckets: [
    { t: '创作者分成', s: 'To Artists', v: 70, c: '#1f6b2a' },
    { t: '平台运营', s: 'Platform', v: 14, c: '#3bb6ec' },
    { t: '版权清算', s: 'Rights', v: 9, c: '#c44ee0' },
    { t: '生态再投资', s: 'Reinvest', v: 5, c: '#f15a29' },
    { t: '公益基金', s: 'Fund', v: 2, c: '#fbb24d' },
  ],
  page: '42',
  total: '82',
};

export const controls = [
  { key: 'bucketCount', label: '去向数量', type: 'slider', def: 5, min: 3, max: 5, step: 1,
    desc: '资金分配的去向数量' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: true, desc: '突出其中一条资金流，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几条', type: 'slider', def: 1, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '高亮的资金流序号' },
  { key: 'showValues', label: '金额占比', type: 'toggle', def: true, desc: '显示/隐藏每条流向的占比' },
  { key: 'accent', label: '强调色', type: 'color', def: C.green,
    options: [C.green, C.orange, C.cyan, C.purple], desc: '聚焦流 / 导语 / 页脚强调色' },
];

const W = 1200, H = 540, PAD = 16;
const LX0 = 8, LX1 = 198;            // source node x-range (flush left)
const RX0 = 660, RX1 = 800;           // target node x-range (labels fill to the right)
const PH = H - PAD * 2;

export default function SwSlideSankey(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.bucketCount));
  const data = (p.buckets || []).slice(0, count);
  const sum = data.reduce((s, d) => s + d.v, 0);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;

  // left segments (stacked, proportional, contiguous) + right nodes (stacked
  // with gaps). Right nodes get a minimum height so even tiny buckets stay
  // legible and, crucially, adjacent labels never collide when bucket count is
  // high — the remaining height is shared proportionally above that floor.
  const gap = 14;
  const minH = 36;
  const totalGap = gap * (count - 1);
  const freeH = Math.max(0, PH - minH * count - totalGap);
  const rScale = freeH / sum;
  let ly = PAD, ry = PAD;
  const rows = data.map((d) => {
    const lh = (d.v / sum) * PH;
    const rh = minH + d.v * rScale;
    const row = { ...d, ls: ly, le: ly + lh, rs: ry, re: ry + rh };
    ly += lh; ry += rh + gap;
    return row;
  });

  const ribbon = (r) => {
    const mx = (LX1 + RX0) / 2;
    return 'M' + LX1 + ',' + r.ls +
      ' C' + mx + ',' + r.ls + ' ' + mx + ',' + r.rs + ' ' + RX0 + ',' + r.rs +
      ' L' + RX0 + ',' + r.re +
      ' C' + mx + ',' + r.re + ' ' + mx + ',' + r.le + ' ' + LX1 + ',' + r.le + ' Z';
  };

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '32px 46px 24px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-1px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'g' } })}
            </h2>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-.5px', color: accent }}>{p.totalValue}</div>
            <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.1em', color: C.inkMut }}>{p.totalLabel}</div>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, marginTop: 6 }}>
          <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
            {/* ribbons */}
            {rows.map((r, i) => {
              const on = fi === -1 || fi === i;
              return <path key={'rb' + i} d={ribbon(r)} fill={fi === i ? accent : r.c}
                opacity={on ? (fi === i ? 0.92 : 0.5) : 0.12} />;
            })}

            {/* source node */}
            <rect x={LX0} y={PAD} width={LX1 - LX0} height={PH} rx="10" fill={C.ink} />
            <text x={(LX0 + LX1) / 2} y={H / 2 - 8} textAnchor="middle" fontFamily={F.sans} fontWeight="900"
              fontSize="30" fill="#fff">{p.sourceLabel}</text>
            <text x={(LX0 + LX1) / 2} y={H / 2 + 22} textAnchor="middle" fontFamily={F.mono} fontSize="18"
              letterSpacing="2" fill="rgba(255,255,255,.7)">{p.sourceSub}</text>

            {/* target nodes + labels */}
            {rows.map((r, i) => {
              const on = fi === -1 || fi === i;
              const pct = Math.round((r.v / sum) * 100);
              const cy = (r.rs + r.re) / 2;
              return (
                <g key={'tn' + i} opacity={on ? 1 : 0.32}>
                  <rect x={RX0} y={r.rs} width={RX1 - RX0} height={Math.max(3, r.re - r.rs)} rx="6"
                    fill={fi === i ? accent : r.c} />
                  <text x={RX1 + 18} y={cy - 4} textAnchor="start" fontFamily={F.sans} fontWeight="700"
                    fontSize="24" fill={C.ink}>{r.t}</text>
                  <text x={RX1 + 18} y={cy + 22} textAnchor="start" fontFamily={F.mono} fontSize="17"
                    letterSpacing="1.5" fill={C.inkMut}>{r.s}{p.showValues ? ' · ' + pct + '%' : ''}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
