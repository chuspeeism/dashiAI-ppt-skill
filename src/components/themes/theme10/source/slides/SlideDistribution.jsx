// SlideDistribution.jsx — 收益分布 / histogram with stat markers.
// Vertical bins forming a distribution, with a smooth outline and pinned markers
// for mean / a percentile band, so spread and central tendency read at a glance.
// Distinct from SlideDiverging (signed per-period), SlideAreaStack (composition)
// and SlideSpark (tiny trends): this shows the SHAPE of outcomes. Standalone &
// migratable: depends only on React (imported). Token-driven. CSS scoped `.dst-`.
//
// ── Props (canonical list in SlideDistribution.META.controls) ─────────────────
//   binCount    number 7..15   how many histogram bins shown               (11)
//   showCurve   boolean        the smooth distribution outline             (true)
//   showMean    boolean        the mean marker line                        (true)
//   showBand    boolean        the shaded central (typical) band           (true)
//   showAxis    boolean        the x-axis tick labels                      (true)
//
// Content props (authored at call-site):
//   overline, title, unit, bins:[number], binLabels:[string],
//   meanLabel, meanAt(index, fractional ok), bandFrom(index), bandTo(index),
//   stats:[{ value, label }]

import React from 'react';

function SlideDistribution({
  overline = '结果分布 · DISTRIBUTION', title = '大多数年份，都落在这一段',
  unit = '%',
  bins = [1, 2, 3, 5, 8, 13, 17, 18, 15, 11, 7, 4, 2, 1, 1],
  binLabels = ['−24', '−20', '−16', '−12', '−8', '−4', '0', '4', '8', '12', '16', '20', '24', '30', '36'],
  meanLabel = '均值 +9.4%', meanAt: meanAtProp = 7.4,
  bandFrom = 6, bandTo = 9,
  stats = [
    { value: '+9.4%', label: '历史均值' },
    { value: '68%', label: '落在 ±1σ 区间' },
    { value: '−18%', label: '最差年份' },
  ],
  binCount = 11, showCurve = true, showMean = true, showBand = true, showAxis = true,
}) {
  React.useEffect(() => { dstInjectStyle(); }, []);
  const n = Math.max(7, Math.min(bins.length, binCount));
  const used = bins.slice(0, n);
  const labels = binLabels.slice(0, n);
  const max = Math.max(...used) || 1;
  const peakIdx = used.indexOf(Math.max(...used));
  const meanAt = Math.max(0, Math.min(n - 1, meanAtProp));

  const W = 1000, H = 460;
  const bw = W / n;
  const cx = (i) => bw * i + bw / 2;
  const cy = (v) => H - (v / max) * (H - 30);
  const curve = (() => {
    const pts = used.map((v, i) => [cx(i), cy(v)]);
    let d = `M0,${H} L${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i], p2 = pts[i + 1];
      const mx = (p1[0] + p2[0]) / 2;
      d += ` C${mx},${p1[1]} ${mx},${p2[1]} ${p2[0]},${p2[1]}`;
    }
    d += ` L${W},${H} Z`; return d;
  })();

  return (
    <div className="dst-root">
      <div className="dst-head">
        <div className="dst-overline">{overline}</div>
        <h2 className="dst-title">{title}</h2>
      </div>

      <div className="dst-body">
        <div className="dst-stage">
          <div className="dst-plot">
            {showBand && (
              <div className="dst-band"
                   style={{ left: `${(bandFrom / n) * 100}%`, width: `${((bandTo - bandFrom + 1) / n) * 100}%` }} />
            )}
            {showCurve && (
              <svg className="dst-curvesvg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                <path d={curve} className="dst-curve" />
              </svg>
            )}
            <div className="dst-bars" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
              {used.map((v, i) => (
                <div className="dst-binwrap" key={i}>
                  <div className={`dst-bin ${i === peakIdx ? 'is-peak' : ''}`} style={{ height: `${(v / max) * 100}%` }}>
                    {i === peakIdx && <span className="dst-peak-tag">峰值</span>}
                  </div>
                </div>
              ))}
            </div>
            {showMean && (
              <div className="dst-mean" style={{ left: `${(meanAt / n) * 100 + (100 / n) / 2}%` }}>
                <span className="dst-mean-tag">{meanLabel}</span>
              </div>
            )}
          </div>
          {showAxis && (
            <div className="dst-axis" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
              {labels.map((l, i) => <span key={i} className="dst-tick">{l}{unit}</span>)}
            </div>
          )}
        </div>

        <div className="dst-stats">
          {stats.map((s, i) => (
            <div className="dst-stat" key={i}>
              <span className="dst-stat-val">{s.value}</span>
              <span className="dst-stat-lab">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function dstInjectStyle() {
  if (document.getElementById('dst-style')) return;
  const s = document.createElement('style'); s.id = 'dst-style';
  s.textContent = `
  .dst-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .dst-head{margin-bottom:30px;}
  .dst-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .dst-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .dst-body{flex:1;min-height:0;display:grid;grid-template-columns:1fr 300px;gap:60px;align-items:stretch;}
  .dst-stage{display:flex;flex-direction:column;min-width:0;}
  .dst-plot{position:relative;flex:1;min-height:0;}
  .dst-band{position:absolute;top:0;bottom:0;background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 9%,transparent);
    border-left:1px dashed color-mix(in srgb,var(--ds-accent,#6f9bd8) 40%,transparent);
    border-right:1px dashed color-mix(in srgb,var(--ds-accent,#6f9bd8) 40%,transparent);}
  .dst-curvesvg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
  .dst-curve{fill:color-mix(in srgb,var(--ds-accent,#6f9bd8) 10%,transparent);
    stroke:color-mix(in srgb,var(--ds-accent,#6f9bd8) 55%,transparent);stroke-width:2;vector-effect:non-scaling-stroke;}
  .dst-bars{position:absolute;inset:0;display:grid;align-items:end;gap:6px;}
  .dst-binwrap{height:100%;display:flex;align-items:flex-end;}
  .dst-bin{width:100%;border-radius:5px 5px 0 0;
    background:linear-gradient(0deg,color-mix(in srgb,var(--ds-accent,#6f9bd8) 92%,#000) 0%,color-mix(in srgb,var(--ds-accent,#6f9bd8) 30%,#fff) 100%);}
  .dst-bin.is-peak{position:relative;
    background:linear-gradient(0deg,color-mix(in srgb,var(--ds-c4) 92%,#000) 0%,color-mix(in srgb,var(--ds-c4) 30%,#fff) 100%);}
  .dst-peak-tag{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
    font-family:var(--font-mono);font-size:22px;letter-spacing:.04em;color:#fff;white-space:nowrap;}
  .dst-mean{position:absolute;top:-6px;bottom:0;width:2px;background:var(--ds-ink,#f2f3f6);transform:translateX(-50%);}
  .dst-mean-tag{position:absolute;top:-34px;left:50%;transform:translateX(-50%);font-family:var(--font-mono);
    font-size:24px;white-space:nowrap;color:var(--ds-ink,#f2f3f6);}
  .dst-axis{display:grid;gap:6px;margin-top:16px;border-top:1px solid var(--ds-line,rgba(242,243,246,.16));padding-top:14px;}
  .dst-tick{text-align:center;font-family:var(--font-mono);font-size:24px;color:var(--ds-faint,rgba(242,243,246,.46));}
  .dst-stats{display:flex;flex-direction:column;justify-content:center;gap:36px;
    border-left:1px solid var(--ds-line,rgba(242,243,246,.14));padding-left:54px;}
  .dst-stat{display:flex;flex-direction:column;gap:8px;}
  .dst-stat-val{font-size:58px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;color:var(--ds-accent,#6f9bd8);letter-spacing:-.01em;}
  .dst-stat-lab{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.55));}
  `;
  document.head.appendChild(s);
}

SlideDistribution.META = {
  id: 'distribution', title: '收益分布',
  defaults: { binCount: 11, showCurve: true, showMean: true, showBand: true, showAxis: true },
  controls: [
    { key: 'binCount', type: 'slider', label: '分箱数量', default: 11, min: 7, max: 15, step: 1,
      description: '直方图的分箱（柱）数量。' },
    { key: 'showCurve', type: 'toggle', label: '分布曲线', default: true,
      description: '叠加的平滑分布轮廓。' },
    { key: 'showMean', type: 'toggle', label: '均值线', default: true,
      description: '均值位置的竖线标记。' },
    { key: 'showBand', type: 'toggle', label: '典型区间', default: true,
      description: '中部典型区间的阴影带。' },
    { key: 'showAxis', type: 'toggle', label: '刻度轴', default: true,
      description: '底部的分箱刻度标签。' },
  ],
};

export { SlideDistribution };
export const META = SlideDistribution.META;
export default SlideDistribution;
