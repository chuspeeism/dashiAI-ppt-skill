// SlideQuilt.jsx — 资产收益拼花 / a periodic "asset class returns" quilt.
// Columns are periods (years), each column a ranked stack of colored tiles —
// best performer on top — every asset class keeping a consistent color so the
// eye traces how a class rises and falls across years. Optionally one class is
// highlighted (its tiles glow, the rest recede) to read its path. Distinct from
// SlideHeatmap (a value-shaded correlation matrix) and SlideCalendar (a
// month/day return grid). Standalone & migratable: depends only on React
// (global). Token-driven, light/dark tone applies. CSS scoped `.qlt-`.
//
// ── Props (canonical list in SlideQuilt.META.controls) ────────────────────────
//   colCount    number 4..6    how many period columns shown               (5)
//   assetCount  number 5..8    how many asset classes (rows / legend)      (7)
//   showLegend  boolean        the color→asset legend strip                (true)
//   highlight   boolean        trace one asset across the grid             (true)
//   highlightIndex number 1..8 which asset is traced (1-based, legend order)(1)
//
// Content props (authored at call-site):
//   overline, title, periods:[string], assets:[{ key, name, color }],
//   matrix: periods×ranked  [[{ key, value }]]  (top→bottom = best→worst)

import React from 'react';

function SlideQuilt({
  overline = '区间收益 · WHO LED EACH YEAR',
  title = '没有谁能连年领先',
  periods = ['2021', '2022', '2023', '2024', '2025', 'YTD'],
  assets = [
    { key: 'eq', name: '全球股票', color: '#6f9bd8' },
    { key: 'cn', name: 'A 股核心', color: '#46b39a' },
    { key: 'bd', name: '利率债', color: '#d8a85b' },
    { key: 'cr', name: '信用债', color: '#9a82dc' },
    { key: 'cm', name: '大宗商品', color: '#d27d58' },
    { key: 'au', name: '黄金', color: '#e6c878' },
    { key: 'reit', name: '不动产', color: '#5fb6c4' },
    { key: 'csh', name: '现金', color: '#9aa0a8' },
  ],
  matrix = [
    ['cm', 'eq', 'reit', 'cn', 'au', 'cr', 'bd', 'csh'],
    ['cm', 'au', 'csh', 'bd', 'cr', 'reit', 'eq', 'cn'],
    ['eq', 'cn', 'reit', 'cr', 'au', 'cm', 'bd', 'csh'],
    ['au', 'eq', 'cm', 'cn', 'reit', 'cr', 'csh', 'bd'],
    ['cn', 'eq', 'au', 'reit', 'cr', 'bd', 'cm', 'csh'],
    ['au', 'cn', 'eq', 'cr', 'bd', 'reit', 'csh', 'cm'],
  ],
  colCount = 5, assetCount = 7, showLegend = true, highlight = false, highlightIndex = 1,
}) {
  React.useEffect(() => { qltInjectStyle(); }, []);
  const nCols = Math.max(4, Math.min(periods.length, colCount));
  const nRows = Math.max(5, Math.min(assets.length, assetCount));
  const used = assets.slice(0, nRows);
  const keySet = new Set(used.map((a) => a.key));
  const byKey = Object.fromEntries(assets.map((a) => [a.key, a]));
  const hiKey = highlight ? (used[Math.max(0, Math.min(nRows - 1, highlightIndex - 1))] || {}).key : null;
  // Per period, take ranked keys that are within the used set, capped to nRows.
  const cols = matrix.slice(0, nCols).map((rank) => rank.filter((k) => keySet.has(k)).slice(0, nRows));
  // Synthetic per-cell return tag (illustrative, decreasing down the column).
  const tag = (row) => `${(28 - row * 6.5 - (row > 3 ? 4 : 0)).toFixed(0)}`;

  return (
    <div className="qlt-root">
      <div className="qlt-head">
        <div className="qlt-overline">{overline}</div>
        <h2 className="qlt-title">{title}</h2>
      </div>

      <div className="qlt-grid" style={{ gridTemplateColumns: `repeat(${nCols}, 1fr)` }}>
        {cols.map((col, c) => (
          <div className="qlt-col" key={c}>
            <span className="qlt-period">{periods[c]}</span>
            {col.map((k, r) => {
              const a = byKey[k] || {};
              const hot = !hiKey || hiKey === k;
              return (
                <div className={`qlt-tile ${hiKey ? (hiKey === k ? 'is-hot' : 'is-cool') : ''}`} key={r}
                     style={{ '--tile': a.color, background: hot ? a.color : undefined }}>
                  <span className="qlt-tname">{a.name}</span>
                  <span className="qlt-tval">+{tag(r)}%</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {showLegend && (
        <div className="qlt-legend">
          {used.map((a) => (
            <span className={`qlt-lg ${hiKey && hiKey !== a.key ? 'is-dim' : ''}`} key={a.key}>
              <span className="qlt-dot" style={{ background: a.color }} />{a.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function qltInjectStyle() {
  if (document.getElementById('qlt-style')) return;
  const s = document.createElement('style'); s.id = 'qlt-style';
  s.textContent = `
  .qlt-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .qlt-head{margin-bottom:34px;}
  .qlt-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .qlt-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.1;}
  .qlt-grid{flex:1;min-height:0;display:grid;gap:16px;}
  .qlt-col{display:flex;flex-direction:column;gap:10px;min-width:0;}
  .qlt-period{font-family:var(--font-mono);font-size:25px;letter-spacing:.08em;text-align:center;
    color:var(--ds-muted,rgba(242,243,246,.6));padding-bottom:6px;}
  .qlt-tile{flex:1;min-height:0;border-radius:12px;padding:0 18px;display:flex;flex-direction:column;
    justify-content:center;gap:3px;overflow:hidden;color:#0c0e12;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);transition:opacity .3s ease,filter .3s ease;}
  .qlt-tile.is-cool{background:var(--ds-card,rgba(255,255,255,.045));color:var(--ds-faint,rgba(242,243,246,.45));
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.1));}
  .qlt-tile.is-hot{box-shadow:inset 0 0 0 2px rgba(255,255,255,.55);}
  .qlt-tname{font-size:25px;font-weight:500;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .qlt-tval{font-family:var(--font-mono);font-size:22px;font-variant-numeric:tabular-nums;opacity:.82;}
  .qlt-tile.is-cool .qlt-tname,.qlt-tile.is-cool .qlt-tval{font-weight:300;}
  .qlt-legend{display:flex;flex-wrap:wrap;gap:20px 36px;margin-top:30px;}
  .qlt-lg{display:flex;align-items:center;gap:12px;font-size:25px;font-weight:300;
    color:var(--ds-muted,rgba(242,243,246,.7));transition:opacity .25s ease;}
  .qlt-lg.is-dim{opacity:.4;}
  .qlt-dot{width:18px;height:18px;border-radius:5px;}
  `;
  document.head.appendChild(s);
}

SlideQuilt.META = {
  id: 'quilt', title: '资产收益拼花',
  defaults: { colCount: 5, assetCount: 7, showLegend: true, highlight: false, highlightIndex: 1 },
  controls: [
    { key: 'colCount', type: 'slider', label: '区间列数', default: 5, min: 4, max: 6, step: 1,
      description: '展示的周期（年份）列数。' },
    { key: 'assetCount', type: 'slider', label: '资产类别', default: 7, min: 5, max: 8, step: 1,
      description: '参与排名的资产类别数（即每列瓦片数与图例项数）。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '底部颜色 → 资产类别对照。' },
    { key: 'highlight', type: 'toggle', label: '追踪某类', default: false,
      description: '高亮某一资产类别在各年份的瓦片，串成其名次路径。' },
    { key: 'highlightIndex', type: 'slider', label: '追踪第几类', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「追踪某类」后生效，按图例顺序指定。' },
  ],
};

export { SlideQuilt };
export const META = SlideQuilt.META;
export default SlideQuilt;
