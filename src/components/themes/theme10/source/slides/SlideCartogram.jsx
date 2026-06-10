// SlideCartogram.jsx — 区域敞口 / abstract region tile grid.
// A tile-grid "cartogram": each region is an equal-ish tile placed on a coarse
// grid (loosely geographic), tinted by an intensity value (exposure %), with a
// code + value. Reads as a map without drawing real borders. Distinct from
// SlideHeatmap (uniform matrix), SlideTreemap (area = value) and any chart:
// spatial-ish intensity. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.crt-`.
//
// ── Props (canonical list in SlideCartogram.META.controls) ────────────────────
//   regionCount  number 4..10   how many region tiles                      (8)
//   showValues   boolean        the % on each tile                         (true)
//   showLegend   boolean        the intensity legend                       (true)
//   showName     boolean        the region name (vs code only)             (true)
//   focus        boolean        emphasise one region, dim the rest         (false)
//   focusIndex   number 1..10   which region is emphasised (1-based)       (1)
//
// Content props (authored at call-site):
//   overline, title, unit, legendLabels:[lo,hi],
//   regions:[{ code, name, value(number), col, row }]  (col/row on a grid)

import React from 'react';

function SlideCartogram({
  overline = '地域敞口 · GLOBAL EXPOSURE', title = '资产分布在世界哪些角落',
  unit = '%', legendLabels = ['低', '高'],
  regions = [
    { code: 'NA', name: '北美', value: 34, col: 1, row: 1 },
    { code: 'EU', name: '欧洲', value: 19, col: 3, row: 1 },
    { code: 'UK', name: '英国', value: 7, col: 2, row: 0 },
    { code: 'CN', name: '中国', value: 16, col: 5, row: 1 },
    { code: 'JP', name: '日本', value: 8, col: 6, row: 1 },
    { code: 'IN', name: '印度', value: 6, col: 5, row: 2 },
    { code: 'APAC', name: '亚太其他', value: 5, col: 6, row: 2 },
    { code: 'LATAM', name: '拉美', value: 3, col: 2, row: 3 },
    { code: 'MEA', name: '中东非洲', value: 2, col: 4, row: 3 },
    { code: 'EM', name: '其他新兴', value: 4, col: 4, row: 2 },
  ],
  regionCount = 8, showValues = true, showLegend = true, showName = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { crtInjectStyle(); }, []);
  const n = Math.max(4, Math.min(regions.length, regionCount));
  const used = regions.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const max = Math.max(...used.map((r) => r.value)) || 1;
  const cols = Math.max(...used.map((r) => r.col)) + 1;
  const rows = Math.max(...used.map((r) => r.row)) + 1;
  // Sequential hue ramp: low=blue → mid=teal → high=gold, with rising opacity.
  const ramp = (v) => {
    const f = Math.max(0, Math.min(1, v / max));
    const col = f < 0.5
      ? `color-mix(in srgb, var(--ds-c3) ${Math.round(f * 2 * 100)}%, var(--ds-c1))`
      : `color-mix(in srgb, var(--ds-c4) ${Math.round((f - 0.5) * 2 * 100)}%, var(--ds-c3))`;
    return `linear-gradient(150deg, ${col} 0%, color-mix(in srgb, ${col} 60%, #000) 100%)`;
  };

  return (
    <div className="crt-root">
      <div className="crt-head">
        <div className="crt-overline">{overline}</div>
        <h2 className="crt-title">{title}</h2>
      </div>

      <div className="crt-stage">
        <div className="crt-grid"
             style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
          {used.map((r, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const light = r.value / max > 0.55;
            return (
              <div className={`crt-tile ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''} ${light ? 'on-light' : ''}`}
                   key={i}
                   style={{ gridColumn: r.col + 1, gridRow: r.row + 1,
                     background: ramp(r.value) }}>
                <span className="crt-code">{r.code}</span>
                <div className="crt-tile-foot">
                  {showName && <span className="crt-name">{r.name}</span>}
                  {showValues && <span className="crt-val">{r.value}{unit}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {showLegend && (
          <div className="crt-legend">
            <span className="crt-leg-lab">{legendLabels[0]}</span>
            <span className="crt-leg-bar" />
            <span className="crt-leg-lab">{legendLabels[1]}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function crtInjectStyle() {
  if (document.getElementById('crt-style')) return;
  const s = document.createElement('style'); s.id = 'crt-style';
  s.textContent = `
  .crt-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .crt-head{margin-bottom:30px;}
  .crt-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .crt-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .crt-stage{flex:1;min-height:0;display:flex;flex-direction:column;}
  .crt-grid{flex:1;min-height:0;display:grid;gap:12px;padding:20px;border-radius:16px;
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.14));}
  .crt-tile{position:relative;border-radius:12px;padding:30px 34px;display:flex;flex-direction:column;
    justify-content:center;gap:12px;box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.1));
    transition:opacity .25s,box-shadow .25s;min-height:0;}
  .crt-tile.is-dim{opacity:.34;}
  .crt-tile.is-focus{box-shadow:inset 0 0 0 2.5px var(--ds-ink,#f2f3f6);}
  .crt-code{font-family:var(--font-mono);font-size:26px;letter-spacing:.06em;color:#fff;opacity:.82;}
  .crt-tile-foot{display:flex;flex-direction:column;gap:2px;}
  .crt-name{font-size:28px;font-weight:300;color:#fff;}
  .crt-val{font-size:40px;font-weight:300;font-variant-numeric:tabular-nums;color:#fff;letter-spacing:-.01em;line-height:1;}
  .crt-legend{display:flex;align-items:center;gap:16px;margin-top:24px;justify-content:flex-end;}
  .crt-leg-lab{font-family:var(--font-mono);font-size:24px;color:var(--ds-faint,rgba(242,243,246,.5));}
  .crt-leg-bar{width:240px;height:12px;border-radius:6px;
    background:linear-gradient(90deg, color-mix(in srgb,var(--ds-c1) 24%,transparent), var(--ds-c3) 55%, var(--ds-c4));}
  `;
  document.head.appendChild(s);
}

SlideCartogram.META = {
  id: 'cartogram', title: '区域敞口',
  defaults: { regionCount: 8, showValues: true, showLegend: true, showName: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'regionCount', type: 'slider', label: '区域数量', default: 8, min: 4, max: 10, step: 1,
      description: '展示的区域方块数量。' },
    { key: 'showValues', type: 'toggle', label: '数值', default: true,
      description: '每个区域方块上的敞口百分比。' },
    { key: 'showLegend', type: 'toggle', label: '强度图例', default: true,
      description: '右下角的强度渐变图例。' },
    { key: 'showName', type: 'toggle', label: '区域名称', default: true,
      description: '方块底部的中文区域名（关闭则仅显示代码）。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一区域，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 10, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideCartogram };
export const META = SlideCartogram.META;
export default SlideCartogram;
