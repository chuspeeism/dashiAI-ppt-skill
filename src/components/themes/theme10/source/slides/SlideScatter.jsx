// SlideScatter.jsx — 风险收益气泡散点图 / risk-return bubble scatter.
// A 2-axis plot: X = risk/volatility, Y = annualised return, bubble area ∝
// weight/AUM. Distinct from SlideQuadrant (a 2×2 TEXT grid) and SlideWaterfall
// (bridge bars): this places weighted points in a true coordinate plane.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.scat-`.
//
// ── Props (canonical list in SlideScatter.META.controls) ──────────────────────
//   pointCount  number 3..7   how many bubbles                              (6)
//   showGrid    boolean       background grid + tick guides                 (true)
//   showMean    boolean       crosshair at the dataset mean (median lines)  (true)
//   bubbleScale number 60..160 master multiplier for bubble radius (%)      (100)
//   focus       boolean       emphasise one bubble, dim the rest            (false)
//   focusIndex  number 1..7   which bubble is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, xLabel, yLabel, points:[{label, x, y, size}]

import React from 'react';

function SlideScatter({
  overline = '风险与收益 · RISK × RETURN', title = '每一份持仓的位置',
  xLabel = '年化波动率 →', yLabel = '年化回报',
  xMax = 24, yMax = 18,
  points = [
    { label: '全球股票', x: 16.5, y: 13.2, size: 34 },
    { label: '科技成长', x: 21.0, y: 15.8, size: 18 },
    { label: '投资级债', x: 5.2, y: 4.6, size: 22 },
    { label: '另类对冲', x: 9.4, y: 8.1, size: 14 },
    { label: '黄金 / 实物', x: 12.0, y: 6.4, size: 8 },
    { label: '现金等价', x: 1.4, y: 2.2, size: 4 },
    { label: '新兴市场', x: 19.2, y: 11.0, size: 10 },
  ],
  pointCount = 6, showGrid = true, showMean = true, bubbleScale = 100,
  focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { scatInjectStyle(); }, []);
  const n = Math.max(3, Math.min(points.length, pointCount));
  const pts = points.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const meanX = pts.reduce((a, p) => a + p.x, 0) / n;
  const meanY = pts.reduce((a, p) => a + p.y, 0) / n;
  const xPct = (v) => (v / xMax) * 100;
  const yPct = (v) => (v / yMax) * 100;
  const rOf = (s) => (8 + Math.sqrt(s) * 9) * (bubbleScale / 100);
  // Each holding bubble carries its own brand hue (was a single blue return-tint).
  const BUB = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c1)'];
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * xMax));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * yMax));

  return (
    <div className="scat-root">
      <div className="scat-head">
        <div className="scat-overline">{overline}</div>
        <h2 className="scat-title">{title}</h2>
      </div>

      <div className="scat-stage">
        <div className="scat-ylab">{yLabel}</div>
        <div className="scat-plot">
          {showGrid && (
            <div className="scat-grid">
              {[0.25, 0.5, 0.75].map((f) => <span key={'h' + f} className="scat-gl scat-gl-h" style={{ bottom: `${f * 100}%` }} />)}
              {[0.25, 0.5, 0.75].map((f) => <span key={'v' + f} className="scat-gl scat-gl-v" style={{ left: `${f * 100}%` }} />)}
            </div>
          )}
          {showMean && (
            <>
              <span className="scat-mean scat-mean-v" style={{ left: `${xPct(meanX)}%` }} />
              <span className="scat-mean scat-mean-h" style={{ bottom: `${yPct(meanY)}%` }} />
              <span className="scat-mean-tag" style={{ left: `${xPct(meanX)}%` }}>均值</span>
            </>
          )}
          {pts.map((p, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const r = rOf(p.size);
            return (
              <div key={i} className={`scat-bub ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                   style={{ left: `${xPct(p.x)}%`, bottom: `${yPct(p.y)}%`, width: r * 2, height: r * 2, marginLeft: -r, marginBottom: -r }}>
                <span className="scat-dot" style={{ background: `radial-gradient(circle at 34% 30%, color-mix(in srgb, ${BUB[i % BUB.length]} 55%, #fff), ${BUB[i % BUB.length]} 72%)`, opacity: hot ? 1 : 0.82 }} />
                <span className="scat-lab" style={{ bottom: `calc(50% + ${r}px + 12px)` }}>
                  {p.label}<i className="scat-val">{p.y.toFixed(1)}%</i>
                </span>
              </div>
            );
          })}
          <div className="scat-ticks scat-ticks-y">
            {yTicks.slice().reverse().map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
        <div className="scat-xrow">
          <div className="scat-ticks scat-ticks-x">
            {xTicks.map((t, i) => <span key={i}>{t}</span>)}
          </div>
          <div className="scat-xlab">{xLabel}</div>
        </div>
      </div>
    </div>
  );
}

function scatInjectStyle() {
  if (document.getElementById('scat-style')) return;
  const s = document.createElement('style'); s.id = 'scat-style';
  s.textContent = `
  .scat-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .scat-head{margin-bottom:30px;}
  .scat-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .scat-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .scat-stage{flex:1;display:grid;grid-template-columns:auto 1fr;grid-template-rows:1fr auto;
    column-gap:22px;row-gap:14px;min-height:0;}
  .scat-ylab{grid-column:1;grid-row:1;writing-mode:vertical-rl;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.18em;color:var(--ds-faint,rgba(242,243,246,.45));
    align-self:center;}
  .scat-plot{grid-column:2;grid-row:1;position:relative;min-height:0;
    border-left:1px solid var(--ds-line,rgba(242,243,246,.22));
    border-bottom:1px solid var(--ds-line,rgba(242,243,246,.22));}
  .scat-grid{position:absolute;inset:0;}
  .scat-gl{position:absolute;background:var(--ds-line,rgba(242,243,246,.09));}
  .scat-gl-h{left:0;right:0;height:1px;}
  .scat-gl-v{top:0;bottom:0;width:1px;}
  .scat-mean{position:absolute;background:var(--ds-accent,#6f9bd8);opacity:.35;}
  .scat-mean-v{top:0;bottom:0;width:1px;border-left:1px dashed var(--ds-accent,#6f9bd8);background:none;}
  .scat-mean-h{left:0;right:0;height:1px;border-top:1px dashed var(--ds-accent,#6f9bd8);background:none;}
  .scat-mean-tag{position:absolute;top:6px;transform:translateX(8px);font-family:var(--font-mono);
    font-size:21px;letter-spacing:.1em;color:var(--ds-accent,#6f9bd8);opacity:.8;}
  .scat-bub{position:absolute;display:flex;align-items:center;justify-content:center;transition:opacity .25s;}
  .scat-dot{width:100%;height:100%;border-radius:50%;background:var(--ds-ink,#f2f3f6);
    box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22);transition:opacity .25s,box-shadow .25s;}
  .scat-lab{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;text-align:center;
    font-size:25px;font-weight:400;color:var(--ds-ink,#f2f3f6);line-height:1.2;}
  .scat-val{display:block;font-family:var(--font-mono);font-style:normal;font-size:21px;
    font-variant-numeric:tabular-nums;color:var(--ds-muted,rgba(242,243,246,.7));margin-top:2px;}
  .scat-bub.is-dim{opacity:.32;}
  .scat-bub.is-focus .scat-dot{box-shadow:0 0 0 3px rgba(84,121,232,.4);}
  .scat-bub.is-focus .scat-lab{color:var(--ds-ink,#f2f3f6);}
  .scat-bub.is-focus .scat-val{color:var(--ds-accent,#5479e8);}
  .scat-ticks{display:flex;font-family:var(--font-mono);font-size:21px;font-variant-numeric:tabular-nums;
    color:var(--ds-faint,rgba(242,243,246,.4));}
  .scat-ticks-y{position:absolute;left:-46px;top:0;bottom:0;flex-direction:column;justify-content:space-between;align-items:flex-end;}
  .scat-xrow{grid-column:2;grid-row:2;display:flex;flex-direction:column;gap:8px;}
  .scat-ticks-x{justify-content:space-between;}
  .scat-xlab{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;color:var(--ds-faint,rgba(242,243,246,.45));text-align:right;}
  `;
  document.head.appendChild(s);
}

SlideScatter.META = {
  id: 'scatter', title: '风险收益气泡图',
  defaults: { pointCount: 6, showGrid: true, showMean: true, bubbleScale: 100, focus: false, focusIndex: 1 },
  controls: [
    { key: 'pointCount', type: 'slider', label: '气泡数量', default: 6, min: 3, max: 7, step: 1,
      description: '参与绘制的持仓气泡数量。' },
    { key: 'showGrid', type: 'toggle', label: '背景网格', default: true,
      description: '坐标平面的辅助网格线。' },
    { key: 'showMean', type: 'toggle', label: '均值十字线', default: true,
      description: '在数据均值处绘制十字参考线。' },
    { key: 'bubbleScale', type: 'slider', label: '气泡大小', default: 100, min: 60, max: 160, step: 10, unit: '%',
      description: '所有气泡半径的统一缩放倍数。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一气泡，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideScatter };
export const META = SlideScatter.META;
export default SlideScatter;
