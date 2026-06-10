// SwSlideGrowth.jsx — "增长曲线 / Growth" chart page.
//
// A real time-series chart (SVG) of cumulative royalties + artists over
// quarters — distinct from WhyNow's stat tiles and BigNumber's mini-bars.
// chartType (area / line / bars), series count (1–2), grid and legend are all
// props-controlled and map 1:1 to `controls`. The SVG is data-driven from
// these defaults; all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'growth', index: 44, label: '增长曲线 / Growth' };

export const defaultProps = {
  accent: C.orange,
  chartType: 'area',       // 'area' | 'line' | 'bars'
  seriesCount: 2,          // 1–2
  showGrid: true,
  showLegend: true,
  showCallout: true,       // highlight the final data point
  // —— content ——
  barMeta: '44 — Growth',
  kicker: '增长曲线 / Growth',
  title: '八个季度，[[指数级]]放大。',
  quarters: ['24·Q3', '24·Q4', '25·Q1', '25·Q2', '25·Q3', '25·Q4', '26·Q1', '26·Q2'],
  seriesA: [0.16, 0.25, 0.33, 0.44, 0.55, 0.70, 0.85, 1.0], // royalties (primary)
  seriesB: [0.10, 0.15, 0.22, 0.30, 0.42, 0.55, 0.72, 0.90], // artists (secondary)
  calloutPeriod: '26 · Q2',
  calloutValue: '¥2.4亿',
  railGhost: '33',
  railValue: '+320%',
  railLabel: '累计版税 · 同比',
  railText: '发放给独立音乐人的版税，在过去一年里增长超三倍。',
  legendA: '累计版税 Royalties',
  legendB: '入驻音乐人 Artists',
  page: '44',
  total: '82',
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'segment', def: 'area',
    options: [{ value: 'area', label: '面积' }, { value: 'line', label: '折线' }, { value: 'bars', label: '柱状' }],
    desc: '增长曲线的呈现形式' },
  { key: 'seriesCount', label: '数据系列', type: 'slider', def: 2, min: 1, max: 2, step: 1,
    desc: '同时展示的数据系列数（版税 / 音乐人）' },
  { key: 'showGrid', label: '网格线', type: 'toggle', def: true, desc: '显示/隐藏背景网格与刻度' },
  { key: 'showLegend', label: '图例', type: 'toggle', def: true, desc: '显示/隐藏系列图例' },
  { key: 'showCallout', label: '终点标注', type: 'toggle', def: true, desc: '高亮并标注最新一季' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主系列 / 标注 / 页脚强调色' },
];

// plot geometry (SVG user units)
const W = 1200, H = 470, M = { t: 30, r: 40, b: 56, l: 70 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;
const xAt = (i, n) => M.l + (PW * i) / (n - 1);
const yAt = (v) => M.t + PH * (1 - v);

export default function SwSlideGrowth(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const two = p.seriesCount >= 2;
  const secondary = C.cyan;
  const QUARTERS = p.quarters;
  const SERIES_A = p.seriesA;
  const SERIES_B = p.seriesB;
  const n = QUARTERS.length;

  const ptsA = SERIES_A.map((v, i) => [xAt(i, n), yAt(v)]);
  const ptsB = SERIES_B.map((v, i) => [xAt(i, n), yAt(v)]);
  const polyline = (pts) => pts.map((q) => q[0] + ',' + q[1]).join(' ');
  const areaPath = (pts) => 'M' + pts[0][0] + ',' + (M.t + PH) + ' L' + polyline(pts).split(' ').join(' L') + ' L' + pts[pts.length - 1][0] + ',' + (M.t + PH) + ' Z';
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  const last = ptsA[n - 1];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '40px 48px 30px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40 }}>

        {/* chart */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-1px', marginTop: 14, marginBottom: 6 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>

          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet"
              style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="sw-grow-a" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.34" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {p.showGrid && yTicks.map((t) => (
                <g key={t}>
                  <line x1={M.l} y1={yAt(t)} x2={W - M.r} y2={yAt(t)}
                    stroke="rgba(27,21,24,.12)" strokeWidth="1" strokeDasharray={t === 0 ? '0' : '4 6'} />
                  <text x={M.l - 14} y={yAt(t) + 7} textAnchor="end"
                    fontFamily={F.mono} fontSize="19" fill="#9a8f8c">{Math.round(t * 100)}</text>
                </g>
              ))}

              {p.chartType === 'bars' ? (
                SERIES_A.map((v, i) => {
                  const bw = two ? 24 : 34;
                  const cx = xAt(i, n);
                  return (
                    <g key={i}>
                      <rect x={cx - (two ? bw + 3 : bw / 2)} y={yAt(v)} width={bw} height={(M.t + PH) - yAt(v)}
                        rx="5" fill={accent} />
                      {two && (
                        <rect x={cx + 3} y={yAt(SERIES_B[i])} width={bw} height={(M.t + PH) - yAt(SERIES_B[i])}
                          rx="5" fill={secondary} />
                      )}
                    </g>
                  );
                })
              ) : (
                <>
                  {p.chartType === 'area' && <path d={areaPath(ptsA)} fill="url(#sw-grow-a)" />}
                  {two && <polyline points={polyline(ptsB)} fill="none" stroke={secondary} strokeWidth="4"
                    strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 9" />}
                  <polyline points={polyline(ptsA)} fill="none" stroke={accent} strokeWidth="5"
                    strokeLinecap="round" strokeLinejoin="round" />
                  {ptsA.map((q, i) => (
                    <circle key={i} cx={q[0]} cy={q[1]} r={i === n - 1 ? 9 : 5}
                      fill={i === n - 1 ? accent : C.paper} stroke={accent} strokeWidth="3" />
                  ))}
                </>
              )}

              {QUARTERS.map((q, i) => (
                <text key={q} x={xAt(i, n)} y={H - 24} textAnchor="middle"
                  fontFamily={F.mono} fontSize="19" letterSpacing="1" fill="#7d7176">{q}</text>
              ))}

              {p.showCallout && p.chartType !== 'bars' && (
                <g>
                  <line x1={last[0]} y1={last[1]} x2={last[0]} y2={M.t + PH} stroke={accent} strokeWidth="1.5" strokeDasharray="3 5" />
                </g>
              )}
            </svg>

            {p.showCallout && (
              <div style={{ position: 'absolute', top: 6, right: 8, textAlign: 'right' }}>
                <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase', color: C.inkMut }}>{p.calloutPeriod}</div>
                <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-1px', color: accent, whiteSpace: 'nowrap' }}>{p.calloutValue}</div>
              </div>
            )}
          </div>
        </div>

        {/* side rail — bold accent block bleeding to the card edge */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', background: accent, color: '#fff',
          margin: '-40px -48px -30px 0', padding: '40px 46px 30px', borderRadius: '0 38px 38px 0' }}>
          <div aria-hidden="true" style={{ position: 'absolute', top: -44, right: -10, fontFamily: F.mono,
            fontWeight: 700, fontSize: 200, lineHeight: 0.8, color: 'rgba(255,255,255,.14)', pointerEvents: 'none' }}>{p.railGhost}</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: 80, letterSpacing: '-2px', color: '#fff', lineHeight: 1 }}>{p.railValue}</div>
            <div style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{p.railLabel}</div>
            <p style={{ fontSize: 23, lineHeight: 1.6, color: 'rgba(255,255,255,.92)', marginTop: 18 }}>
              {p.railText}
            </p>
          </div>

          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'auto', paddingTop: 28,
              borderTop: '1px solid rgba(255,255,255,.28)', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 26, height: 6, borderRadius: 3, background: '#fff' }} />
                <span style={{ fontSize: 23, fontWeight: 700, color: '#fff' }}>{p.legendA}</span>
              </div>
              {two && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 26, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.55)' }} />
                  <span style={{ fontSize: 23, fontWeight: 700, color: 'rgba(255,255,255,.92)' }}>{p.legendB}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
