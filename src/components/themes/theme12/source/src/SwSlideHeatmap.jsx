// SwSlideHeatmap.jsx — "热力网格 / Heatmap" activity-intensity grid.
//
// A weeks × days grid where each cell's tint encodes activity (release volume),
// like a contribution graph. Distinct from Calendar (dated schedule) and
// StackBars (totals). Week count (8–16), the legend, value scale and accent are
// props-controlled, 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. The grid matrix is generated; no host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'heatmap', index: 33, label: '热力网格 / Heatmap' };

export const defaultProps = {
  accent: C.orange,
  weeks: 14,               // 8–16 columns
  showLegend: true,
  showSidebar: true,
  // —— content ——
  barMeta: '33 — Heatmap',
  kicker: '热力网格 / Heatmap',
  title: '发行的[[节奏]]，一目了然。',
  weekdays: ['一', '二', '三', '四', '五', '六', '日'],
  months: ['3月', '4月', '5月', '6月'],
  legendLess: '少',
  legendMore: '多',
  legendNote: '每格 = 一日发行强度',
  sidebarGhost: '71',
  sidebarLabel: '近 {weeks} 周 · 发行总量',
  sidebarText: '颜色越深、那天越热闹。周末（{peak}）是上新与开演的高峰。',
  sidebarFoot: '峰值 +38% · 周末效应',
  page: '33',
  total: '82',
};

export const controls = [
  { key: 'weeks', label: '周数', type: 'slider', def: 14, min: 8, max: 16, step: 1,
    desc: '热力网格的列数（周）' },
  { key: 'showLegend', label: '图例', type: 'toggle', def: true, desc: '显示/隐藏 少→多 强度图例' },
  { key: 'showSidebar', label: '侧栏数据', type: 'toggle', def: true, desc: '显示/隐藏右侧统计侧栏' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.green, C.purple, C.cyan], desc: '热力 / 导语 / 页脚强调色' },
];

// deterministic pseudo-intensity 0..4 from (day,week)
function intensity(d, w) {
  const n = (Math.sin(d * 1.3 + 1) + Math.cos(w * 0.9 + d * 0.4) + Math.sin(w * 0.5 + 2)) ; // -3..3
  let v = Math.round(((n + 3) / 6) * 4); // 0..4
  if (d >= 5 && v < 4) v += 1;           // busier weekends (gigs)
  if (w % 5 === 4) v = Math.min(4, v + 1);
  return Math.max(0, Math.min(4, v));
}

export default function SwSlideHeatmap(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const weeks = Math.max(8, Math.min(16, p.weeks));
  const DAYS = p.weekdays;
  const MONTHS = p.months;

  const cell = (lvl) => {
    if (lvl <= 0) return 'rgba(27,21,24,.06)';
    return accent + ['', '', '40', '6e', 'a8', 'ff'][lvl + 1]; // alpha ramp via hex
  };
  // build matrix + total
  let total = 0;
  const grid = DAYS.map((_, d) => Array.from({ length: weeks }, (_, w) => {
    const v = intensity(d, w); total += v; return v;
  }));
  const peakDay = DAYS[5];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '34px 44px 30px', display: 'grid',
        gridTemplateColumns: p.showSidebar ? '1fr 270px' : '1fr', gap: 40 }}>

        {/* grid */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-1px', marginTop: 12, marginBottom: 18 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>

          {/* month markers */}
          <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr', gap: 10 }}>
            <div />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono,
              fontSize: 18, letterSpacing: '.08em', color: C.inkMut, paddingRight: 4 }}>
              {MONTHS.map((m) => <span key={m}>{m}</span>)}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '34px 1fr', gap: 10,
            marginTop: 8, alignItems: 'center' }}>
            {/* day labels */}
            <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 1fr)', gap: 8, height: '100%' }}>
              {DAYS.map((d) => (
                <div key={d} style={{ display: 'flex', alignItems: 'center', fontFamily: F.mono,
                  fontSize: 18, color: C.inkMut }}>{d}</div>
              ))}
            </div>
            {/* cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + weeks + ', 1fr)',
              gridTemplateRows: 'repeat(7, 1fr)', gap: 8, height: '100%', minWidth: 0 }}>
              {grid.map((row, d) => (
                row.map((v, w) => (
                  <div key={d + '-' + w} title={'强度 ' + v} style={{ background: cell(v), borderRadius: 6,
                    minWidth: 0, border: '1px solid rgba(27,21,24,.05)' }} />
                ))
              ))}
            </div>
          </div>

          {p.showLegend && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18,
              fontFamily: F.mono, fontSize: 18, color: C.inkMut }}>
              <span>{p.legendLess}</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <span key={l} style={{ width: 20, height: 20, borderRadius: 5, background: cell(l),
                  border: '1px solid rgba(27,21,24,.05)' }} />
              ))}
              <span>{p.legendMore}</span>
              <span style={{ marginLeft: 'auto', textTransform: 'uppercase' }}>{p.legendNote}</span>
            </div>
          )}
        </div>

        {/* sidebar */}
        {p.showSidebar && (
          <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', background: accent, color: '#fff', margin: '-34px -44px -30px 0',
            padding: '34px 38px 30px', borderRadius: '0 38px 38px 0' }}>
            <div aria-hidden="true" style={{ position: 'absolute', top: -40, right: -10, fontFamily: F.mono,
              fontWeight: 700, fontSize: 190, lineHeight: 0.8, color: 'rgba(255,255,255,.13)' }}>{p.sidebarGhost}</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 80, letterSpacing: '-2px', lineHeight: 1 }}>{total}</div>
              <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,.85)', marginTop: 8 }}>{p.sidebarLabel.replace('{weeks}', weeks)}</div>
              <p style={{ fontSize: 22, lineHeight: 1.6, color: 'rgba(255,255,255,.92)', marginTop: 18 }}>
                {p.sidebarText.replace('{peak}', peakDay)}
              </p>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.28)',
              fontFamily: F.mono, fontSize: 19, letterSpacing: '.08em', color: 'rgba(255,255,255,.85)',
              position: 'relative', zIndex: 1 }}>{p.sidebarFoot}</div>
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
