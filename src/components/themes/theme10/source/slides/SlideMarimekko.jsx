// SlideMarimekko.jsx — 份额矩阵 / variable-width stacked (mekko) chart.
// A row of columns whose WIDTHS encode each holding's share of the book and
// whose internal STACKS encode the asset-class split within that holding — two
// dimensions of allocation read at once. A compact header + class legend sit
// top-left/right. Standalone & migratable: depends only on React (imported).
// Token-driven. CSS scoped under `.mk-`.
//
// ── Props (canonical list in SlideMarimekko.META.controls) ───────────────────
//   columnCount    number 3..5   how many columns plotted                 (4)
//   segmentCount   number 2..4   asset classes stacked per column         (4)
//   showShare      boolean       per-column share % above each column     (true)
//   showLegend     boolean       the asset-class legend (top-right)       (true)
//   focus          boolean       emphasise one column, dim the rest       (false)
//   focusIndex     number 1..5   which column is emphasised (1-based)     (1)
//
// Content props (authored at call-site):
//   overline, title, classes:[string], columns:[{ label, share, weights:[n] }]

import React from 'react';

function SlideMarimekko({
  overline = '配置结构 · MEKKO', title = '份额与构成，一图双读',
  classes = ['权益', '固收', '另类', '现金'],
  columns = [
    { label: '核心指数', share: 38, weights: [62, 22, 10, 6] },
    { label: '卫星增强', share: 26, weights: [48, 14, 32, 6] },
    { label: '对冲篮子', share: 20, weights: [20, 40, 30, 10] },
    { label: '现金管理', share: 11, weights: [4, 30, 6, 60] },
    { label: '机会账户', share: 5, weights: [70, 6, 22, 2] },
  ],
  columnCount = 4, segmentCount = 4,
  showShare = true, showLegend = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { mkInjectStyle(); }, []);
  const n = Math.max(3, Math.min(columns.length, columnCount));
  const sc = Math.max(2, Math.min(classes.length, segmentCount));
  const cols = columns.slice(0, n);
  const cats = classes.slice(0, sc);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const shareTotal = cols.reduce((a, c) => a + c.share, 0) || 1;
  // Each asset class gets a consistent brand hue across all columns.
  const CLS = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];
  const clsColor = (i) => CLS[i % CLS.length];

  return (
    <div className="mk-root">
      <div className="mk-head">
        <div>
          <div className="mk-overline">{overline}</div>
          <h2 className="mk-title">{title}</h2>
        </div>
        {showLegend && (
          <ul className="mk-legend">
            {cats.map((c, i) => (
              <li key={i}><span className="mk-sw" style={{ background: clsColor(i) }} />{c}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mk-plot">
        {cols.map((col, ci) => {
          const hot = ci === fIdx, dim = fIdx >= 0 && !hot;
          const wsum = col.weights.slice(0, sc).reduce((a, b) => a + b, 0) || 1;
          return (
            <div key={ci} className={`mk-col ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                 style={{ flexBasis: `${(col.share / shareTotal) * 100}%` }}>
              {showShare && <div className="mk-share">{col.share}<span>%</span></div>}
              <div className="mk-stack">
                {col.weights.slice(0, sc).map((w, si) => (
                  <span key={si} className="mk-seg"
                        style={{ flexBasis: `${(w / wsum) * 100}%`,
                                 background: `linear-gradient(90deg, color-mix(in srgb, ${clsColor(si)} 72%, #fff), ${clsColor(si)})` }} />
                ))}
              </div>
              <div className="mk-label">{col.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function mkInjectStyle() {
  if (document.getElementById('mk-style')) return;
  const s = document.createElement('style'); s.id = 'mk-style';
  s.textContent = `
  .mk-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);font-family:var(--font-sans);display:flex;flex-direction:column;}
  .mk-head{display:flex;justify-content:space-between;align-items:flex-start;gap:48px;margin-bottom:56px;}
  .mk-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .mk-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.1;letter-spacing:.01em;}
  .mk-legend{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:14px 30px;justify-content:flex-end;max-width:560px;}
  .mk-legend li{display:flex;align-items:center;gap:14px;font-family:var(--font-mono);font-size:25px;letter-spacing:.04em;color:var(--ds-muted,rgba(242,243,246,.6));}
  .mk-sw{width:26px;height:14px;border-radius:3px;background:currentColor;flex:0 0 auto;}
  .mk-plot{flex:1;display:flex;align-items:stretch;gap:16px;min-height:0;}
  .mk-col{display:flex;flex-direction:column;min-width:0;transition:opacity .25s ease;}
  .mk-col.is-dim{opacity:.34;}
  .mk-share{font-family:var(--font-mono);font-size:40px;font-weight:300;letter-spacing:.01em;
    font-variant-numeric:tabular-nums;margin-bottom:18px;color:var(--ds-ink,#f2f3f6);white-space:nowrap;}
  .mk-share span{font-size:24px;color:var(--ds-faint,rgba(242,243,246,.45));margin-left:3px;}
  .mk-col.is-focus .mk-share{color:var(--ds-accent,#5479e8);}
  .mk-stack{flex:1;display:flex;flex-direction:column;gap:5px;border-radius:8px;overflow:hidden;min-height:0;}
  .mk-seg{display:block;width:100%;border-radius:3px;transition:opacity .25s ease,background .25s ease;}
  .mk-label{margin-top:22px;font-size:28px;font-weight:300;letter-spacing:.01em;
    padding-top:18px;border-top:1px solid var(--ds-line,rgba(242,243,246,.14));
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .mk-col.is-focus .mk-label{color:var(--ds-accent,#5479e8);}
  `;
  document.head.appendChild(s);
}

SlideMarimekko.META = {
  id: 'mekko', title: '份额矩阵',
  defaults: { columnCount: 4, segmentCount: 4, showShare: true, showLegend: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'columnCount', type: 'slider', label: '列数量', default: 4, min: 3, max: 5, step: 1,
      description: '绘制的列（持仓单元）数量；列宽按其占比自适应。' },
    { key: 'segmentCount', type: 'slider', label: '分层数量', default: 4, min: 2, max: 4, step: 1,
      description: '每列内部堆叠的资产类别层数。' },
    { key: 'showShare', type: 'toggle', label: '占比数字', default: true,
      description: '每列顶部的占比百分数。' },
    { key: 'showLegend', type: 'toggle', label: '类别图例', default: true,
      description: '右上角的资产类别图例。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一列并以强调色着色，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几列', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideMarimekko };
export const META = SlideMarimekko.META;
export default SlideMarimekko;
