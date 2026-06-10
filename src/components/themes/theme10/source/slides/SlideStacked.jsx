// SlideStacked.jsx — 构成对比 / grouped stacked-bar comparison.
// Several categories, each a vertical bar split into the same set of composition
// segments, with a shared legend. Distinct from DeckBars (single flat bars),
// DeckDonut (one composition) and SlideWaterfall (bridge): this compares the
// MIX across categories. Standalone & migratable: depends only on React.
// CSS scoped under `.stk-`.
//
// ── Props (canonical list in SlideStacked.META.controls) ──────────────────────
//   barCount     number 2..6   how many category bars                       (4)
//   segmentCount number 2..5   how many composition segments per bar         (4)
//   focus        boolean       emphasise one bar, dim the rest               (false)
//   focusIndex   number 1..6   which bar is emphasised (1-based)            (1)
//   showLegend   boolean       the shared segment legend                     (true)
//   showTotals   boolean       the total figure atop each bar                (true)
//
// Content props (authored at call-site):
//   overline, title, unit, segLabels:[string], bars:[{ label, total, parts:[number] }]

import React from 'react';

function SlideStacked({
  overline = '构成对比 · COMPOSITION', title = '不同方案的成本与收益构成',
  unit = '%',
  segLabels = ['指数底仓', '主动调仓', '对冲敞口', '现金缓冲', '另类资产'],
  bars = [
    { label: '基石', total: 100, parts: [82, 6, 0, 12, 0] },
    { label: '自主', total: 100, parts: [64, 18, 6, 8, 4] },
    { label: '全包', total: 100, parts: [52, 22, 14, 6, 6] },
    { label: '机构', total: 100, parts: [44, 24, 18, 4, 10] },
    { label: '对照·指数', total: 100, parts: [96, 0, 0, 4, 0] },
    { label: '对照·主动', total: 100, parts: [20, 60, 4, 6, 10] },
  ],
  barCount = 4, segmentCount = 4, focus = false, focusIndex = 1, showLegend = true, showTotals = true,
}) {
  React.useEffect(() => { stkInjectStyle(); }, []);
  const bn = Math.max(2, Math.min(bars.length, barCount));
  const sn = Math.max(2, Math.min(segLabels.length, segmentCount));
  const cols = bars.slice(0, bn);
  const labels = segLabels.slice(0, sn);
  const fIdx = focus ? Math.max(0, Math.min(bn - 1, focusIndex - 1)) : -1;
  // Categorical brand palette so each composition segment gets its own hue
  // (was a single copper ramp) — more colourful while staying on-brand.
  const SEG_COLORS = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];
  const segColor = (i) => SEG_COLORS[i % SEG_COLORS.length];

  // Normalise each bar's used segments to fill the column height.
  const geom = cols.map((b) => {
    const parts = b.parts.slice(0, sn);
    const sum = parts.reduce((a, v) => a + v, 0) || 1;
    return { ...b, parts, pct: parts.map((v) => (v / sum) * 100) };
  });

  return (
    <div className="stk-root">
      <div className="stk-head">
        <div className="stk-overline">{overline}</div>
        <h2 className="stk-title">{title}</h2>
      </div>

      <div className="stk-body">
        <div className="stk-plot" style={{ gridTemplateColumns: `repeat(${bn}, 1fr)` }}>
          {geom.map((b, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return (
              <div className={`stk-col ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                {showTotals && <span className="stk-total">{b.total}{unit}</span>}
                <div className="stk-stack">
                  {b.pct.map((p, si) => (
                    <span className="stk-seg" key={si}
                          style={{ height: `${p}%`, background: segColor(si) }}>
                      {p > 9 && <span className="stk-segval">{Math.round(b.parts[si])}</span>}
                    </span>
                  ))}
                </div>
                <span className="stk-collabel">{b.label}</span>
              </div>
            );
          })}
        </div>

        {showLegend && (
          <ul className="stk-legend">
            {labels.map((l, i) => (
              <li key={i}>
                <span className="stk-key" style={{ background: segColor(i) }} />
                <span className="stk-keyname">{l}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function stkInjectStyle() {
  if (document.getElementById('stk-style')) return;
  const s = document.createElement('style'); s.id = 'stk-style';
  s.textContent = `
  .stk-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .stk-head{margin-bottom:36px;}
  .stk-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .stk-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .stk-body{flex:1;display:flex;gap:72px;min-height:0;align-items:stretch;}
  .stk-plot{flex:1;display:grid;gap:48px;align-items:end;min-height:0;}
  .stk-col{height:100%;display:flex;flex-direction:column;align-items:center;transition:opacity .25s;}
  .stk-col.is-dim{opacity:.36;}
  .stk-total{font-family:var(--font-mono);font-size:26px;font-variant-numeric:tabular-nums;
    color:var(--ds-muted,rgba(242,243,246,.62));margin-bottom:14px;}
  .stk-col.is-focus .stk-total{color:var(--ds-accent,#6f9bd8);}
  .stk-stack{flex:1;width:100%;max-width:150px;display:flex;flex-direction:column;border-radius:8px;overflow:hidden;min-height:0;}
  .stk-seg{position:relative;display:flex;align-items:center;justify-content:center;min-height:2px;transition:opacity .25s;}
  .stk-seg + .stk-seg{box-shadow:inset 0 1px 0 var(--ds-bg,#0d0e11);}
  .stk-col.is-focus .stk-stack{box-shadow:0 0 0 2px var(--ds-accent,#6f9bd8);border-radius:8px;}
  .stk-segval{font-family:var(--font-mono);font-size:25px;font-variant-numeric:tabular-nums;color:#fff;}
  .stk-collabel{margin-top:22px;font-size:27px;font-weight:300;text-align:center;color:var(--ds-muted,rgba(242,243,246,.78));}
  .stk-col.is-focus .stk-collabel{color:var(--ds-accent,#6f9bd8);font-weight:400;}
  .stk-legend{flex:0 0 280px;list-style:none;margin:0;padding:0;display:flex;flex-direction:column;justify-content:center;gap:26px;}
  .stk-legend li{display:flex;align-items:center;gap:18px;}
  .stk-key{width:26px;height:26px;border-radius:6px;background:currentColor;flex:0 0 auto;}
  .stk-keyname{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.7));}
  `;
  document.head.appendChild(s);
}

SlideStacked.META = {
  id: 'stacked', title: '构成对比',
  defaults: { barCount: 4, segmentCount: 4, focus: false, focusIndex: 1, showLegend: true, showTotals: true },
  controls: [
    { key: 'barCount', type: 'slider', label: '类别柱数', default: 4, min: 2, max: 6, step: 1,
      description: '参与对比的类别（柱体）数量。' },
    { key: 'segmentCount', type: 'slider', label: '构成段数', default: 4, min: 2, max: 5, step: 1,
      description: '每根柱体堆叠的构成段数量。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一根柱体，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右侧的构成段图例。' },
    { key: 'showTotals', type: 'toggle', label: '柱顶合计', default: true,
      description: '每根柱体顶部的合计数值。' },
  ],
};

export { SlideStacked };
export const META = SlideStacked.META;
export default SlideStacked;
