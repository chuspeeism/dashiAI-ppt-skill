// SwSlideSlope.jsx — "斜率图 / Slope" before→after comparison chart.
//
// Two vertical value axes (an earlier period on the left, a later one on the
// right); each metric is a line connecting its two values so the *slope* reads
// as its change. Distinct from Growth (time-series curve) and DotPlot (single
// axis). Line count (3–6), grid, a focused line and the delta labels are all
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. No host deps.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'slope', index: 46, label: '斜率图 / Slope' };

export const defaultProps = {
  accent: C.orange,
  lineCount: 5,            // 3–6 metrics
  focus: true,
  focusIndex: 1,           // 1-based, which metric to emphasise
  showGrid: true,
  showDelta: true,
  // —— content ——
  barMeta: '46 — Slope',
  kicker: '斜率图 / Slope',
  title: '两年之间，[[格局翻转]]。',
  periodLeft: { y: '2024', s: '声浪上线前' },
  periodRight: { y: '2026', s: '当下' },
  axisLabel: '占总播放份额 · SHARE OF PLAYS (%)',
  // label, left value, right value (0–100 scale, share of plays)
  metrics: [
    { t: '独立厂牌 Indies', a: 28, b: 71 },
    { t: '自助发行 DIY', a: 12, b: 52 },
    { t: '现场演出 Live', a: 34, b: 58 },
    { t: '海外流媒 Global', a: 9, b: 40 },
    { t: '版税透明 Payout', a: 21, b: 84 },
    { t: '粉丝直连 Direct', a: 17, b: 63 },
  ],
  page: '46',
  total: '82',
};

export const controls = [
  { key: 'lineCount', label: '指标数量', type: 'slider', def: 5, min: 3, max: 6, step: 1,
    desc: '参与对比的指标线数量' },
  { key: 'focus', label: '聚焦高亮', type: 'toggle', def: true, desc: '突出其中一条指标线，其余淡化' },
  { key: 'focusIndex', label: '聚焦第几条', type: 'slider', def: 1, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '高亮的指标线（自上而下）' },
  { key: 'showGrid', label: '刻度网格', type: 'toggle', def: true, desc: '显示/隐藏两端刻度与基线' },
  { key: 'showDelta', label: '变化标注', type: 'toggle', def: true, desc: '显示/隐藏每条线的变化百分比' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '聚焦线 / 导语 / 页脚强调色' },
];

const W = 1180, H = 470, M = { t: 36, b: 44, l: 250, r: 250 };
const PH = H - M.t - M.b;
const yAt = (v) => M.t + PH * (1 - v / 100);

// Push a set of desired label y-positions apart so none overlap. Returns an
// array of adjusted y's aligned to the input order. minGap = required spacing.
function spread(desired, minGap, top, bottom) {
  const order = desired.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < order.length; k++) {
    if (order[k].y - order[k - 1].y < minGap) order[k].y = order[k - 1].y + minGap;
  }
  // clamp to bottom, then back-propagate upward if we ran past it
  if (order.length && order[order.length - 1].y > bottom) {
    order[order.length - 1].y = bottom;
    for (let k = order.length - 2; k >= 0; k--) {
      if (order[k + 1].y - order[k].y < minGap) order[k].y = order[k + 1].y - minGap;
    }
  }
  if (order.length && order[0].y < top) order[0].y = top;
  const out = new Array(desired.length);
  order.forEach((o) => { out[o.i] = o.y; });
  return out;
}

export default function SwSlideSlope(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(6, p.lineCount));
  const data = (p.metrics || []).slice(0, count);
  const fi = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) - 1 : -1;
  const xL = M.l, xR = W - M.r;
  const ticks = [0, 25, 50, 75, 100];
  const lblL = spread(data.map((m) => yAt(m.a)), 36, M.t + 12, M.t + PH);
  const lblR = spread(data.map((m) => yAt(m.b)), 58, M.t + 24, M.t + PH - 6);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '34px 48px 26px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-1px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 56, paddingBottom: 6 }}>
            {[[p.periodLeft.y, p.periodLeft.s], [p.periodRight.y, p.periodRight.s]].map(([y, s], i) => (
              <div key={y} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-.5px',
                  color: i === 1 ? accent : C.ink }}>{y}</div>
                <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em', color: C.inkMut }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, marginTop: 8 }}>
          <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block' }}>
            {/* grid + axes */}
            {p.showGrid && ticks.map((t) => (
              <line key={t} x1={xL} y1={yAt(t)} x2={xR} y2={yAt(t)} stroke="rgba(27,21,24,.08)"
                strokeWidth="1" strokeDasharray={t === 0 ? '0' : '3 7'} />
            ))}
            <line x1={xL} y1={M.t} x2={xL} y2={M.t + PH} stroke="rgba(27,21,24,.28)" strokeWidth="2" />
            <line x1={xR} y1={M.t} x2={xR} y2={M.t + PH} stroke="rgba(27,21,24,.28)" strokeWidth="2" />

            {/* connector lines + endpoint dots */}
            {data.map((m, i) => {
              const col = swSeriesColors[i % swSeriesColors.length];
              const on = fi === -1 || fi === i;
              const yl = yAt(m.a), yr = yAt(m.b);
              const stroke = on ? (fi === i ? accent : col) : 'rgba(27,21,24,.18)';
              return (
                <g key={m.t} opacity={on ? 1 : 0.9}>
                  <line x1={xL} y1={yl} x2={xR} y2={yr} stroke={stroke}
                    strokeWidth={fi === i ? 7 : on ? 4 : 2.5} strokeLinecap="round" />
                  <circle cx={xL} cy={yl} r={fi === i ? 9 : 6} fill={stroke} />
                  <circle cx={xR} cy={yr} r={fi === i ? 11 : 7} fill={stroke} />
                </g>
              );
            })}

            {/* de-collided labels, drawn on top with thin leaders */}
            {data.map((m, i) => {
              const col = swSeriesColors[i % swSeriesColors.length];
              const on = fi === -1 || fi === i;
              const yl = yAt(m.a), yr = yAt(m.b);
              const tcol = on ? C.ink : 'rgba(27,21,24,.32)';
              const up = m.b >= m.a;
              const tyl = lblL[i], tyr = lblR[i];
              return (
                <g key={m.t} opacity={on ? 1 : 0.9}>
                  {Math.abs(tyl - yl) > 7 && (
                    <line x1={xL - 14} y1={yl} x2={xL - 18} y2={tyl} stroke="rgba(27,21,24,.2)" strokeWidth="1" />
                  )}
                  {Math.abs(tyr - yr) > 7 && (
                    <line x1={xR + 14} y1={yr} x2={xR + 18} y2={tyr - 7} stroke="rgba(27,21,24,.2)" strokeWidth="1" />
                  )}
                  {/* left name */}
                  <text x={xL - 24} y={tyl + 7} textAnchor="end" fontFamily={F.sans} fontWeight={fi === i ? 700 : 600}
                    fontSize="23" fill={tcol}>{m.t}</text>
                  {/* right value + delta */}
                  <text x={xR + 24} y={tyr + 7} textAnchor="start" fontFamily={F.sans} fontWeight={700}
                    fontSize="24" fill={tcol}>{m.b}%</text>
                  {p.showDelta && (
                    <text x={xR + 24} y={tyr - 18} textAnchor="start" fontFamily={F.mono} fontSize="18"
                      fill={on ? (up ? C.green : C.orange) : 'rgba(27,21,24,.3)'}>
                      {(up ? '▲ +' : '▼ ') + (m.b - m.a) + 'pt'}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', color: C.inkMut,
          textAlign: 'center', marginTop: 2 }}>{p.axisLabel}</div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
