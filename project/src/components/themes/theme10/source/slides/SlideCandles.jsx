// SlideCandles.jsx — K线蜡烛 / OHLC candlestick chart.
// A financial candlestick chart: each period draws a high–low wick and an
// open–close body (rising = accent copper, falling = blue). An optional moving-
// average line threads through, an optional volume strip sits beneath, and the
// final candle can be tagged with a live readout. Distinct from SlideCurve
// (single smooth line), SlideWaterfall (signed deltas) and SlideDistribution
// (histogram): this is price-action OHLC. Standalone & migratable: depends only
// on React (imported). Token-driven. CSS scoped under `.cdl-`.
//
// ── Props (canonical list in SlideCandles.META.controls) ──────────────────────
//   candleCount  number 10..28  how many candles plotted                  (18)
//   showMA       boolean        moving-average overlay line                (true)
//   showVolume   boolean        volume strip under the price chart         (true)
//   showGrid     boolean        horizontal price gridlines                 (true)
//   tagLast      boolean        readout label on the final candle          (true)
//
// Content props (authored at call-site):
//   overline, title, caption, unit, axisLabels:[...]

import React from 'react';

function SlideCandles({
  overline = '价格行为 · OHLC', title = '一年里的脉搏', caption = '自主指数 · 近 12 个月日线收敛',
  unit = '', axisLabels = ['Q1', 'Q2', 'Q3', 'Q4'],
  candleCount = 18, showMA = true, showVolume = true, showGrid = true, tagLast = true,
}) {
  React.useEffect(() => { cdlInjectStyle(); }, []);
  const n = Math.max(10, Math.min(28, candleCount));

  // Deterministic OHLC walk — a gently rising, breathing market.
  const data = React.useMemo(() => {
    const out = []; let prev = 46;
    for (let i = 0; i < n; i++) {
      const drift = 1.4 + Math.sin(i * 0.55) * 1.1 + (i / n) * 2.2;
      const open = prev;
      const close = open + drift + Math.sin(i * 1.9) * 2.6 - 0.6;
      const hi = Math.max(open, close) + 1.4 + Math.abs(Math.sin(i * 2.3)) * 2.2;
      const lo = Math.min(open, close) - 1.3 - Math.abs(Math.cos(i * 1.7)) * 2.0;
      const vol = 30 + Math.abs(Math.sin(i * 1.3)) * 60 + (close - open) * 4;
      out.push({ open, close, hi, lo, vol: Math.max(8, vol) });
      prev = close;
    }
    return out;
  }, [n]);

  const W = 1000, priceH = showVolume ? 470 : 600, volH = 120, gap = 40;
  const H = priceH + (showVolume ? gap + volH : 0);
  const hiMax = Math.max(...data.map((d) => d.hi));
  const loMin = Math.min(...data.map((d) => d.lo));
  const span = (hiMax - loMin) || 1;
  const pad = span * 0.06;
  const top = hiMax + pad, bot = loMin - pad, range = top - bot;
  const Y = (v) => ((top - v) / range) * priceH;
  const step = W / n, cw = Math.min(step * 0.56, 28);
  const X = (i) => i * step + step / 2;

  // moving average (window 4)
  const ma = data.map((_, i) => {
    const s = Math.max(0, i - 3);
    const seg = data.slice(s, i + 1);
    return seg.reduce((a, d) => a + d.close, 0) / seg.length;
  });
  const maPath = ma.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const volMax = Math.max(...data.map((d) => d.vol));
  const gridVals = showGrid ? [0, 0.25, 0.5, 0.75, 1].map((t) => bot + t * range) : [];
  const last = data[n - 1];

  return (
    <div className="cdl-root">
      <div className="cdl-head">
        <div className="cdl-overline">{overline}</div>
        <h2 className="cdl-title">{title}</h2>
        {caption && <p className="cdl-caption">{caption}</p>}
      </div>

      <div className="cdl-stage">
        <svg className="cdl-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="cdlUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in srgb,var(--ds-c3) 70%,#fff)" />
              <stop offset="100%" stopColor="var(--ds-c3)" />
            </linearGradient>
          </defs>
          {gridVals.map((v, i) => (
            <line key={i} x1="0" x2={W} y1={Y(v)} y2={Y(v)} className="cdl-grid" />
          ))}

          {showMA && <path d={maPath} className="cdl-ma" vectorEffect="non-scaling-stroke" />}

          {data.map((d, i) => {
            const up = d.close >= d.open;
            const bx = X(i);
            const yO = Y(d.open), yC = Y(d.close);
            const bodyTop = Math.min(yO, yC), bodyH = Math.max(2, Math.abs(yC - yO));
            const isLast = i === n - 1;
            return (
              <g key={i} className={`cdl-candle ${up ? 'is-up' : 'is-down'} ${isLast ? 'is-last' : ''}`}>
                <line x1={bx} x2={bx} y1={Y(d.hi)} y2={Y(d.lo)} className="cdl-wick" vectorEffect="non-scaling-stroke" />
                <rect x={bx - cw / 2} y={bodyTop} width={cw} height={bodyH} className="cdl-body" rx="1.5" />
              </g>
            );
          })}

          {showVolume && data.map((d, i) => {
            const up = d.close >= d.open;
            const h = (d.vol / volMax) * volH;
            return (
              <rect key={i} className={`cdl-vol ${up ? 'is-up' : 'is-down'}`}
                    x={X(i) - cw / 2} y={priceH + gap + (volH - h)} width={cw} height={h} rx="1.5" />
            );
          })}
        </svg>

        {gridVals.length > 0 && (
          <div className="cdl-gridlabs">
            {gridVals.map((v, i) => (
              <span key={i} className="cdl-gridlab" style={{ top: `${(Y(v) / H) * 100}%` }}>{v.toFixed(0)}{unit}</span>
            ))}
          </div>
        )}

        {tagLast && (
          <div className="cdl-tag" style={{ top: `${(Y(last.close) / H) * 100}%` }}>
            <span className="cdl-tag-dot" />
            <span className="cdl-tag-val">{last.close.toFixed(1)}{unit}</span>
            <span className="cdl-tag-delta">{last.close >= last.open ? '▲' : '▼'} {(last.close - last.open).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="cdl-axis">
        {axisLabels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
}

function cdlInjectStyle() {
  if (document.getElementById('cdl-style')) return;
  const s = document.createElement('style'); s.id = 'cdl-style';
  s.textContent = `
  .cdl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .cdl-head{margin-bottom:34px;}
  .cdl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cdl-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .cdl-caption{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-muted,rgba(242,243,246,.6));margin:16px 0 0;}
  .cdl-stage{position:relative;flex:1;min-height:0;}
  .cdl-svg{width:100%;height:100%;display:block;overflow:visible;}
  .cdl-grid{stroke:var(--ds-line,rgba(242,243,246,.1));stroke-width:1;}
  .cdl-gridlabs{position:absolute;inset:0;pointer-events:none;}
  .cdl-gridlab{position:absolute;left:0;transform:translateY(-100%);padding-bottom:6px;line-height:1;
    color:var(--ds-faint,rgba(242,243,246,.4));font-family:var(--font-mono);font-size:22px;letter-spacing:.06em;}
  .cdl-wick{stroke:currentColor;stroke-opacity:.5;stroke-width:1.5;}
  .cdl-candle.is-up .cdl-wick,.cdl-candle.is-up .cdl-body{color:var(--ds-c3);}
  .cdl-candle.is-down .cdl-wick,.cdl-candle.is-down .cdl-body{color:var(--ds-c5);}
  .cdl-candle.is-up .cdl-body{fill:url(#cdlUp);fill-opacity:1;}
  .cdl-candle.is-down .cdl-body{fill:var(--ds-bg,#0d0e11);stroke:var(--ds-c5);stroke-width:2.5;}
  .cdl-candle.is-last .cdl-body{fill-opacity:1;}
  .cdl-ma{fill:none;stroke:var(--ds-ink,#f2f3f6);stroke-opacity:.42;stroke-width:2;stroke-linejoin:round;stroke-dasharray:2 7;stroke-linecap:round;}
  .cdl-vol{opacity:.32;}
  .cdl-vol.is-up{fill:var(--ds-c3);}
  .cdl-vol.is-down{fill:var(--ds-c5);}
  .cdl-tag{position:absolute;right:-10px;transform:translateY(-50%);display:flex;align-items:center;gap:12px;
    padding:8px 16px;border-radius:999px;background:color-mix(in srgb,var(--ds-bg,#0d0e11) 70%,transparent);
    backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.18));white-space:nowrap;}
  .cdl-tag-dot{width:10px;height:10px;border-radius:50%;background:var(--ds-c3);box-shadow:0 0 0 5px color-mix(in srgb,var(--ds-c3) 22%,transparent);}
  .cdl-tag-val{font-family:var(--font-mono);font-size:28px;font-variant-numeric:tabular-nums;}
  .cdl-tag-delta{font-family:var(--font-mono);font-size:22px;color:var(--ds-c3);}
  .cdl-axis{display:flex;justify-content:space-between;margin-top:18px;padding-top:16px;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.13));
    font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;color:var(--ds-faint,rgba(242,243,246,.4));}
  `;
  document.head.appendChild(s);
}

SlideCandles.META = {
  id: 'candles', title: 'K线蜡烛',
  defaults: { candleCount: 18, showMA: true, showVolume: true, showGrid: true, tagLast: true },
  controls: [
    { key: 'candleCount', type: 'slider', label: '蜡烛数量', default: 18, min: 10, max: 28, step: 1,
      description: '绘制的 K 线（周期）数量。' },
    { key: 'showMA', type: 'toggle', label: '均线叠加', default: true,
      description: '叠加一条移动平均虚线。' },
    { key: 'showVolume', type: 'toggle', label: '成交量条', default: true,
      description: '价格图下方的成交量量柱条。' },
    { key: 'showGrid', type: 'toggle', label: '价格网格', default: true,
      description: '横向价格刻度网格线与标尺。' },
    { key: 'tagLast', type: 'toggle', label: '末值标记', default: true,
      description: '在最后一根 K 线高度处标注现价读数。' },
  ],
};

export { SlideCandles };
export const META = SlideCandles.META;
export default SlideCandles;
