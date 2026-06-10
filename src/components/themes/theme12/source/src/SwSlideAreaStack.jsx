// SwSlideAreaStack.jsx — "堆叠面积 / Stacked Area" composition-over-time chart.
//
// Stacked areas show how revenue composition (streaming / live / merch) evolves
// across quarters. Distinct from Growth (single trend line) and StackBars
// (discrete columns). Series count (2–3), the grid, the legend, end labels and
// accent are props-controlled, 1:1 with `controls`; all visible copy/data
// defaults live in `defaultProps`. No host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'areastack', index: 45, label: '堆叠面积 / Stacked Area' };

export const defaultProps = {
  accent: C.orange,
  seriesCount: 3,          // 2–3 stacked series
  showGrid: true,
  showLegend: true,
  showEndLabels: true,
  // —— content ——
  barMeta: '45 — Stacked Area',
  kicker: '堆叠面积 / Stacked Area',
  title: '收入结构，[[越长越宽]]。',
  axisLabel: '创作者季度总收入构成 · ¥百万 / QUARTER',
  quarters: ['24·Q3', '24·Q4', '25·Q1', '25·Q2', '25·Q3', '25·Q4', '26·Q1', '26·Q2'],
  // series (absolute values per quarter)
  series: [
    { t: '流媒体版税', s: 'Streaming', c: '#f15a29', v: [22, 28, 33, 40, 48, 55, 63, 70] },
    { t: '现场演出', s: 'Live', c: '#3bb6ec', v: [8, 10, 13, 16, 20, 25, 30, 36] },
    { t: '周边电商', s: 'Merch', c: '#baf04f', v: [3, 4, 6, 8, 10, 13, 16, 20] },
  ],
  page: '45',
  total: '82',
};

export const controls = [
  { key: 'seriesCount', label: '数据系列', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    desc: '堆叠的收入构成系列数' },
  { key: 'showGrid', label: '网格线', type: 'toggle', def: true, desc: '显示/隐藏背景网格与刻度' },
  { key: 'showLegend', label: '图例', type: 'toggle', def: true, desc: '显示/隐藏系列图例' },
  { key: 'showEndLabels', label: '终值标注', type: 'toggle', def: true, desc: '显示/隐藏右端各层占比标注' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主系列 / 导语 / 页脚强调色' },
];

const W = 1180, H = 470, M = { t: 26, r: 150, b: 52, l: 64 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;

export default function SwSlideAreaStack(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const k = Math.max(2, Math.min(3, p.seriesCount));
  const QUARTERS = p.quarters;
  const series = (p.series || []).slice(0, k);
  const n = QUARTERS.length;

  // cumulative stack tops per quarter
  const totals = QUARTERS.map((_, i) => series.reduce((s, ser) => s + ser.v[i], 0));
  const maxTotal = Math.max(...totals) * 1.05;
  const xAt = (i) => M.l + (PW * i) / (n - 1);
  const yAt = (val) => M.t + PH * (1 - val / maxTotal);

  // build stacked baselines
  let baseline = QUARTERS.map(() => 0);
  const layers = series.map((ser) => {
    const lower = baseline.slice();
    const upper = lower.map((b, i) => b + ser.v[i]);
    baseline = upper;
    const top = upper.map((val, i) => xAt(i) + ',' + yAt(val));
    const bot = lower.map((val, i) => xAt(i) + ',' + yAt(val)).reverse();
    return { ...ser, path: 'M' + top.join(' L') + ' L' + bot.join(' L') + ' Z',
      lineTop: upper.map((val, i) => xAt(i) + ',' + yAt(val)).join(' '),
      endTop: yAt(upper[n - 1]), endBot: yAt(lower[n - 1]), share: Math.round((ser.v[n - 1] / totals[n - 1]) * 100) };
  });
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxTotal * f));

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '34px 48px 26px', display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 30 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-1px', marginTop: 12 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 4 }}>
              {layers.map((l) => (
                <div key={l.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 5, background: l.c }} />
                  <span style={{ fontSize: 21, fontWeight: 700, color: C.ink }}>{l.t}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minHeight: 0, marginTop: 6 }}>
          <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
            {p.showGrid && yTicks.map((t, i) => (
              <g key={i}>
                <line x1={M.l} y1={yAt(t)} x2={W - M.r} y2={yAt(t)} stroke="rgba(27,21,24,.1)" strokeWidth="1"
                  strokeDasharray={i === 0 ? '0' : '4 6'} />
                <text x={M.l - 14} y={yAt(t) + 6} textAnchor="end" fontFamily={F.mono} fontSize="18"
                  fill="#9a8f8c">{t}</text>
              </g>
            ))}

            {layers.map((l) => (
              <g key={l.t}>
                <path d={l.path} fill={l.c} fillOpacity="0.9" />
                <polyline points={l.lineTop} fill="none" stroke={l.c} strokeWidth="2.5" />
              </g>
            ))}

            {QUARTERS.map((q, i) => (
              <text key={q} x={xAt(i)} y={H - 22} textAnchor="middle" fontFamily={F.mono} fontSize="18"
                fill="#7d7176">{q}</text>
            ))}

            {p.showEndLabels && layers.map((l) => (
              <g key={'e' + l.t}>
                <text x={W - M.r + 16} y={(l.endTop + l.endBot) / 2 + 1} textAnchor="start"
                  fontFamily={F.sans} fontWeight="900" fontSize="26" fill={l.c}>{l.share}%</text>
                <text x={W - M.r + 16} y={(l.endTop + l.endBot) / 2 + 24} textAnchor="start"
                  fontFamily={F.mono} fontSize="15" letterSpacing="1" fill={C.inkMut}>{l.s}</text>
              </g>
            ))}
          </svg>
        </div>

        <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em', color: C.inkMut,
          textAlign: 'center', marginTop: 2 }}>{p.axisLabel}</div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
