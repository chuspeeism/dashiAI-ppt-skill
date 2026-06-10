// SwSlideStackBars.jsx — "堆叠柱状 / Stacked Bars" chart page.
//
// Vertical bars over periods (quarters), each a stack of revenue-source
// segments — or grouped side-by-side when chartType='grouped'. Distinct from
// Growth (line), Ranking (horizontal bars) and Donut (pie). Period count (4–8),
// series count (2–3), chart type, the focus period, value labels, gridlines and
// accent are props-controlled, 1:1 with controls; all visible copy/data
// defaults live in `defaultProps`. No global side effects, no
// host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'stackbars', index: 50, label: '堆叠柱状 / Stacked Bars' };

export const defaultProps = {
  accent: C.orange,
  periodCount: 6,          // 4–8 periods
  seriesCount: 3,          // 2–3 stacked series
  chartType: 'stacked',    // 'stacked' | 'grouped'
  focus: true,
  focusIndex: 6,           // highlighted period (1-based)
  showValues: true,        // total label atop each bar
  showGrid: true,
  // —— content ——
  barMeta: '50 — Stacked Bars',
  kicker: '收入结构 / Revenue Mix',
  title: '不止增长，而是[[越来越稳]]。',
  periods: ['Q1·24', 'Q2·24', 'Q3·24', 'Q4·24', 'Q1·25', 'Q2·25', 'Q3·25', 'Q4·25'],
  series: [
    { cn: '流媒体版税', en: 'Streaming' },
    { cn: '直连粉丝', en: 'Direct' },
    { cn: '授权与演出', en: 'Sync & Live' },
  ],
  // per-period values for each series (relative units)
  data: [
    [28, 10, 6], [34, 14, 8], [40, 18, 11], [49, 22, 14],
    [57, 28, 17], [66, 35, 21], [74, 41, 26], [83, 48, 30],
  ],
  page: '50',
  total: '82',
};

export const controls = [
  { key: 'periodCount', label: '周期数量', type: 'slider', def: 6, min: 4, max: 8, step: 1,
    desc: '横轴上的周期（季度）数量' },
  { key: 'seriesCount', label: '分项数量', type: 'slider', def: 3, min: 2, max: 3, step: 1,
    desc: '每根柱子堆叠的收入分项数量' },
  { key: 'chartType', label: '图表类型', type: 'segment', def: 'stacked',
    options: [{ value: 'stacked', label: '堆叠' }, { value: 'grouped', label: '分组' }], desc: '堆叠柱 或 分组柱' },
  { key: 'focus', label: '高亮周期', type: 'toggle', def: true, desc: '高亮某个周期、弱化其余' },
  { key: 'focusIndex', label: '高亮第几个', type: 'slider', def: 6, min: 1, max: 8, step: 1,
    dependsOn: 'focus', desc: '被高亮周期的序号（1 起）' },
  { key: 'showValues', label: '数值标签', type: 'toggle', def: true, desc: '显示/隐藏每柱顶部合计' },
  { key: 'showGrid', label: '网格线', type: 'toggle', def: true, desc: '显示/隐藏背景横向网格线' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主分项 / 高亮 / 页脚强调色' },
];

export default function SwSlideStackBars(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const periods = Math.max(4, Math.min(8, p.periodCount));
  const series = Math.max(2, Math.min(3, p.seriesCount));
  const grouped = p.chartType === 'grouped';
  const colors = [accent, C.cyan, C.purple];
  const PERIODS = p.periods;
  const SERIES = p.series;

  const data = (p.data || []).slice(0, periods).map((d) => d.slice(0, series));
  const totals = data.map((d) => d.reduce((a, b) => a + b, 0));
  const maxStack = Math.max(...totals);
  const maxItem = Math.max(...data.flat());
  const max = grouped ? maxItem : maxStack;
  const ceil = Math.ceil(max / 20) * 20;
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '40px 54px 36px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        <Shape kind="circle" size={120} color="rgba(58,182,236,.12)" style={{ top: -34, right: -28, zIndex: 0 }} />

        {/* header + legend */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40,
          marginBottom: 28, position: 'relative', zIndex: 2 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 4 }}>
            {SERIES.slice(0, series).map((s, i) => (
              <div key={s.en} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span style={{ width: 22, height: 14, borderRadius: 4, background: colors[i] }} />
                <span style={{ fontSize: 22, fontWeight: 700 }}>{s.cn}</span>
                <span style={{ fontFamily: F.mono, fontSize: 17, letterSpacing: '.08em', color: C.inkMut,
                  textTransform: 'uppercase' }}>{s.en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* plot */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column', zIndex: 2 }}>
          {/* gridlines */}
          {p.showGrid && (
            <div style={{ position: 'absolute', inset: '0 0 32px 0', zIndex: 0 }}>
              {gridLines.map((g) => (
                <div key={g} style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(' + (g * 100) + '% )',
                  borderTop: '1px solid ' + (g === 0 ? C.line2 : C.line),
                  display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: -44, transform: 'translateY(-50%)',
                    fontFamily: F.mono, fontSize: 17, color: C.inkMut }}>{Math.round(ceil * g)}</span>
                </div>
              ))}
            </div>
          )}

          {/* bars */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'repeat(' + periods + ',1fr)',
            gap: grouped ? 18 : 26, alignItems: 'end', position: 'relative', zIndex: 1, paddingBottom: 0 }}>
            {data.map((d, pi) => {
              const on = !p.focus || (pi + 1) === p.focusIndex;
              const total = totals[pi];
              return (
                <div key={pi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                  height: '100%', justifyContent: 'flex-end', opacity: on ? 1 : 0.4, transition: 'opacity .2s' }}>
                  {p.showValues && (
                    <div style={{ fontWeight: 900, fontSize: on ? 27 : 23, letterSpacing: '-.5px',
                      color: on && p.focus ? accent : C.ink, marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>{total}</div>
                  )}
                  {grouped ? (
                    <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', gap: 4,
                      alignItems: 'flex-end', justifyContent: 'center' }}>
                      {d.map((v, si) => (
                        <div key={si} style={{ width: 18, height: (v / ceil * 100) + '%', minHeight: 4,
                          background: colors[si], borderRadius: '5px 5px 0 0' }} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ flex: 1, minHeight: 0, width: '74%', maxWidth: 96, display: 'flex',
                      flexDirection: 'column', justifyContent: 'flex-end' }}>
                      {d.map((v, si) => {
                        const last = si === d.length - 1;
                        const first = si === 0;
                        return (
                          <div key={si} style={{ height: (v / ceil * 100) + '%', minHeight: 3, background: colors[si],
                            borderRadius: first ? '7px 7px 0 0' : 0,
                            boxShadow: on && (pi + 1) === p.focusIndex && first ? '0 -2px 0 rgba(0,0,0,.04)' : 'none',
                            outline: !first ? '1px solid ' + C.paper : 'none', outlineOffset: -0.5 }} />
                        );
                      })}
                    </div>
                  )}
                  <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.04em',
                    color: on && p.focus ? C.ink : C.inkMut, fontWeight: on && p.focus ? 700 : 400,
                    marginTop: 12, height: 20 }}>{PERIODS[pi]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
