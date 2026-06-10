// SlideHeatmap.jsx — 相关性热力矩阵 / correlation heatmap.
// An N×N grid of asset-to-asset correlations; each cell's fill encodes the value
// (cool accent = positive, warm/faint = low/negative), diagonal = 1.00. Distinct
// from SlideMatrix (numeric time-series table) and SlideLedger (holdings list):
// this is a 2-D intensity field. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.heat-`.
//
// ── Props (canonical list in SlideHeatmap.META.controls) ──────────────────────
//   assetCount  number 4..7   matrix dimension N (rows = cols)              (6)
//   showValues  boolean       print the numeric coefficient in each cell    (true)
//   showLegend  boolean       the -1 … +1 colour legend                     (true)
//   focusRow    boolean       emphasise one asset's row + column            (false)
//   focusIndex  number 1..7   which asset is emphasised (1-based)           (1)
//
// Content props (authored at call-site):
//   overline, title, labels:[...], matrix:[[...]]  (symmetric, diagonal 1)

import React from 'react';

function SlideHeatmap({
  overline = '分散度 · CORRELATION', title = '它们彼此独立吗',
  labels = ['全球股票', '科技成长', '投资级债', '另类对冲', '黄金', '现金', '新兴市场'],
  matrix = [
    [1.00, 0.82, 0.10, 0.34, -0.12, -0.05, 0.68],
    [0.82, 1.00, 0.04, 0.28, -0.18, -0.08, 0.60],
    [0.10, 0.04, 1.00, 0.22, 0.30, 0.46, 0.08],
    [0.34, 0.28, 0.22, 1.00, 0.16, 0.12, 0.30],
    [-0.12, -0.18, 0.30, 0.16, 1.00, 0.24, -0.02],
    [-0.05, -0.08, 0.46, 0.12, 0.24, 1.00, -0.10],
    [0.68, 0.60, 0.08, 0.30, -0.02, -0.10, 1.00],
  ],
  assetCount = 6, showValues = true, showLegend = true, focusRow = false, focusIndex = 1,
}) {
  React.useEffect(() => { heatInjectStyle(); }, []);
  const n = Math.max(4, Math.min(labels.length, assetCount));
  const labs = labels.slice(0, n);
  const m = matrix.slice(0, n).map((r) => r.slice(0, n));
  const fIdx = focusRow ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  // Diverging scale: positive → brand blue accent, negative → warm copper,
  // ~0 → faint. Reads as correlation polarity at a glance.
  const cellStyle = (v) => {
    const a = Math.min(1, Math.abs(v));
    const rgb = v >= 0 ? '91,128,234' : '210,125,88';
    return { background: `rgba(${rgb},${(0.10 + a * 0.86).toFixed(3)})` };
  };
  const numColor = (v) => (Math.abs(v) > 0.5 ? '#15161a' : 'var(--ds-muted,rgba(242,243,246,.78))');

  return (
    <div className="heat-root">
      <div className="heat-head">
        <div className="heat-overline">{overline}</div>
        <h2 className="heat-title">{title}</h2>
      </div>

      <div className="heat-body">
        <div className="heat-grid" style={{ gridTemplateColumns: `200px repeat(${n}, 1fr)`, gridTemplateRows: `auto repeat(${n}, 1fr)` }}>
          <span className="heat-corner" />
          {labs.map((l, i) => (
            <span key={'c' + i} className={`heat-colh ${i === fIdx ? 'is-hot' : ''}`}>{l}</span>
          ))}
          {m.map((row, ri) => (
            <React.Fragment key={ri}>
              <span className={`heat-rowh ${ri === fIdx ? 'is-hot' : ''}`}>{labs[ri]}</span>
              {row.map((v, ci) => {
                const diag = ri === ci;
                const inFocus = fIdx >= 0 && (ri === fIdx || ci === fIdx);
                const dim = fIdx >= 0 && !inFocus;
                return (
                  <span key={ci} className={`heat-cell ${diag ? 'is-diag' : ''} ${dim ? 'is-dim' : ''} ${inFocus ? 'is-focus' : ''}`}>
                    {diag ? <span className="heat-self" /> : <span className="heat-fill" style={cellStyle(v)} />}
                    {showValues && !diag && <span className="heat-num" style={{ color: numColor(v) }}>{v.toFixed(2)}</span>}
                  </span>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {showLegend && (
          <div className="heat-legend">
            <span className="heat-leg-cap">相关系数</span>
            <div className="heat-leg-row">
              <span className="heat-leg-bar" />
              <div className="heat-leg-scale"><span>+1 同向</span><span>0</span><span>−1 反向</span></div>
            </div>
            <p className="heat-leg-note">暖色＝同涨同跌，冷色＝走势相反。越冷，分散对冲越强。</p>
          </div>
        )}
      </div>
    </div>
  );
}

function heatInjectStyle() {
  if (document.getElementById('heat-style')) return;
  const s = document.createElement('style'); s.id = 'heat-style';
  s.textContent = `
  .heat-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .heat-head{margin-bottom:36px;}
  .heat-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .heat-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .heat-body{flex:1;display:grid;grid-template-columns:1fr 230px;column-gap:56px;align-items:stretch;min-height:0;}
  .heat-grid{display:grid;gap:10px;height:100%;min-height:0;}
  .heat-corner{}
  .heat-colh{font-family:var(--font-mono);font-size:22px;letter-spacing:.02em;text-align:center;
    color:var(--ds-muted,rgba(242,243,246,.6));align-self:end;padding-bottom:8px;line-height:1.25;transition:color .25s;}
  .heat-rowh{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.7));display:flex;align-items:center;
    justify-content:flex-end;padding-right:22px;text-align:right;transition:color .25s;}
  .heat-colh.is-hot,.heat-rowh.is-hot{color:var(--ds-accent,#5479e8);}
  .heat-cell{position:relative;min-height:0;display:flex;align-items:center;justify-content:center;
    border-radius:9px;overflow:hidden;transition:opacity .25s,transform .25s;
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.08));}
  .heat-fill{position:absolute;inset:0;}
  .heat-num{position:relative;font-family:var(--font-mono);font-size:25px;font-variant-numeric:tabular-nums;}
  .heat-self{position:absolute;width:13px;height:13px;border-radius:50%;
    box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--ds-faint,rgba(242,243,246,.4)) 80%,transparent);}
  .heat-cell.is-diag{box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.16));
    background:repeating-linear-gradient(135deg,transparent 0 9px,color-mix(in srgb,currentColor 5%,transparent) 9px 10px);}
  .heat-cell.is-dim{opacity:.3;}
  .heat-cell.is-focus{box-shadow:inset 0 0 0 2px var(--ds-accent,#5479e8);transform:scale(1.015);z-index:1;}
  .heat-legend{display:flex;flex-direction:column;gap:22px;align-self:center;}
  .heat-leg-cap{font-family:var(--font-mono);font-size:22px;letter-spacing:.12em;text-transform:uppercase;color:var(--ds-faint,rgba(242,243,246,.42));}
  .heat-leg-row{display:flex;align-items:stretch;gap:20px;height:280px;}
  .heat-leg-bar{width:32px;border-radius:8px;
    background:linear-gradient(180deg,#5b80ea 0%,color-mix(in srgb,#5b80ea 40%,transparent) 30%,rgba(150,150,150,.10) 50%,color-mix(in srgb,#d27d58 40%,transparent) 70%,#d27d58 100%);
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.16));}
  .heat-leg-scale{display:flex;flex-direction:column;justify-content:space-between;flex:0 0 auto;
    font-family:var(--font-mono);font-size:21px;white-space:nowrap;color:var(--ds-faint,rgba(242,243,246,.5));}
  .heat-leg-note{font-size:23px;font-weight:300;line-height:1.5;color:var(--ds-muted,rgba(242,243,246,.6));
    margin:0;max-width:220px;text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideHeatmap.META = {
  id: 'heatmap', title: '相关性热力矩阵',
  defaults: { assetCount: 6, showValues: true, showLegend: true, focusRow: false, focusIndex: 1 },
  controls: [
    { key: 'assetCount', type: 'slider', label: '资产数量', default: 6, min: 4, max: 7, step: 1,
      description: '矩阵维度 N（行列同时变化）。' },
    { key: 'showValues', type: 'toggle', label: '显示数值', default: true,
      description: '在每个格子里打印相关系数。' },
    { key: 'showLegend', type: 'toggle', label: '色阶图例', default: true,
      description: '右侧 −1…+1 的颜色图例。' },
    { key: 'focusRow', type: 'toggle', label: '聚焦一行', default: false,
      description: '高亮某一资产的整行与整列。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「聚焦一行」后生效。' },
  ],
};

export { SlideHeatmap };
export const META = SlideHeatmap.META;
export default SlideHeatmap;
