// SlideCurve.jsx — 净值曲线 / annotated equity-curve area chart.
// One smooth cumulative growth curve with a soft area fill, light grid, x-axis
// year labels and a few pinned annotations marking moments along the path (a
// drawdown, an auto-buy, a milestone). Distinct from SlideLadder (stepped bars),
// SlideSpark (tiny multiples) and SlideWaterfall (signed bridge): this is the
// single hero equity line. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.crv-`.
//
// ── Props (canonical list in SlideCurve.META.controls) ────────────────────────
//   annotationCount number 0..4   how many pinned callouts to show          (3)
//   showArea        boolean       the gradient area fill under the line     (true)
//   showGrid        boolean       horizontal grid lines                     (true)
//   showEnd         boolean       the end-of-curve value badge              (true)
//   smooth          boolean       smooth (true) vs straight (false) line    (true)
//
// Content props (authored at call-site):
//   overline, title, data:[number], xLabels:[string], endLabel,
//   annotations:[{ at(index), label, sub }]

import React from 'react';

function SlideCurve({
  overline = '净值曲线 · GROWTH CURVE', title = '一条线，看完这些年的复利',
  data = [100, 108, 102, 121, 134, 128, 152, 176, 169, 205, 246, 233, 288, 342, 372, 430],
  xLabels = ['第1年', '', '', '第4年', '', '', '第7年', '', '', '第10年', '', '', '第13年', '', '', '今天'],
  endLabel = '¥1.25M',
  annotations = [
    { at: 5, label: '市场回调 −12%', sub: '纪律不变，继续定投' },
    { at: 8, label: '自动加仓', sub: '低位再平衡' },
    { at: 13, label: '突破 ¥1M', sub: '雪球加速' },
    { at: 2, label: '起步建仓', sub: '设定目标' },
  ],
  annotationCount = 3, showArea = true, showGrid = true, showEnd = true, smooth = true,
}) {
  React.useEffect(() => { crvInjectStyle(); }, []);
  const W = 1000, H = 500, padL = 8, padR = 8, padT = 70, padB = 52;
  const n = data.length;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const X = (i) => padL + (i / (n - 1)) * (W - padL - padR);
  const Y = (v) => padT + (1 - (v - min) / span) * (H - padT - padB);
  const pts = data.map((v, i) => [X(i), Y(v)]);

  const linePath = smooth ? (() => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  })() : pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[n - 1][0]},${H - padB} L${pts[0][0]},${H - padB} Z`;

  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => padT + t * (H - padT - padB));
  const ann = annotations.slice(0, Math.max(0, Math.min(4, annotationCount)))
    .map((a) => ({ ...a, x: X(a.at), y: Y(data[a.at]) }))
    .sort((p, q) => p.x - q.x);

  return (
    <div className="crv-root">
      <div className="crv-head">
        <div className="crv-overline">{overline}</div>
        <h2 className="crv-title">{title}</h2>
      </div>

      <div className="crv-stage">
        <svg className="crv-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="crvLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="color-mix(in srgb,var(--ds-c1) 72%,#fff)" />
              <stop offset="38%" stopColor="color-mix(in srgb,var(--ds-c2) 75%,#fff)" />
              <stop offset="70%" stopColor="color-mix(in srgb,var(--ds-c3) 78%,#fff)" />
              <stop offset="100%" stopColor="color-mix(in srgb,var(--ds-c4) 80%,#fff)" />
            </linearGradient>
          </defs>
          {showGrid && gridY.map((gy, i) => <line key={i} x1={padL} y1={gy} x2={W - padR} y2={gy} className="crv-grid" />)}
          {showArea && (
            <>
              <defs>
                <linearGradient id="crvFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--ds-c2)" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="var(--ds-c1)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#crvFill)" stroke="none" />
            </>
          )}
          <path d={linePath} className="crv-line" />
          {ann.map((a, i) => <line key={'g' + i} x1={a.x} y1={a.y} x2={a.x} y2={H - padB} className="crv-anno-stem" />)}
        </svg>

        {/* HTML annotation cards positioned over the SVG (crisp text + round dots,
            no skew from the SVG's non-uniform preserveAspectRatio). */}
        <div className="crv-annolayer">
          {ann.map((a, i) => {
            const f = a.x / W;
            const c = f < 0.38 ? 'var(--ds-c1)' : f < 0.70 ? 'var(--ds-c2)' : f < 0.9 ? 'var(--ds-c3)' : 'var(--ds-c4)';
            return (
            <React.Fragment key={i}>
              <span className="crv-dot" style={{ left: `${(a.x / W) * 100}%`, top: `${(a.y / H) * 100}%`, boxShadow: `inset 0 0 0 2.5px ${c}` }} />
              <div className="crv-anno"
                   style={{ left: `${(a.x / W) * 100}%`, top: `${(a.y / H) * 100}%` }}>
                <span className="crv-anno-label">{a.label}</span>
                <span className="crv-anno-sub">{a.sub}</span>
              </div>
            </React.Fragment>
            );
          })}
          {showEnd && (
            <>
              <span className="crv-dot crv-dot-end" style={{ left: `${(pts[n - 1][0] / W) * 100}%`, top: `${(pts[n - 1][1] / H) * 100}%` }} />
              <div className="crv-end" style={{ left: `${(pts[n - 1][0] / W) * 100}%`, top: `${(pts[n - 1][1] / H) * 100}%` }}>
                <span className="crv-end-val">{endLabel}</span>
              </div>
            </>
          )}
        </div>

        <div className="crv-axis">
          {xLabels.map((l, i) => <span key={i} className="crv-axis-x" style={{ left: `${(X(i) / W) * 100}%` }}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

function crvInjectStyle() {
  if (document.getElementById('crv-style')) return;
  const s = document.createElement('style'); s.id = 'crv-style';
  s.textContent = `
  .crv-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .crv-head{margin-bottom:24px;}
  .crv-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .crv-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .crv-stage{position:relative;flex:1;min-height:0;}
  .crv-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
  .crv-grid{stroke:var(--ds-line,rgba(242,243,246,.1));stroke-width:1;vector-effect:non-scaling-stroke;}
  .crv-line{fill:none;stroke:url(#crvLine);stroke-width:3;vector-effect:non-scaling-stroke;
    stroke-linecap:round;stroke-linejoin:round;}
  .crv-anno-stem{stroke:var(--ds-faint,rgba(242,243,246,.3));stroke-width:1;stroke-dasharray:3 4;vector-effect:non-scaling-stroke;}
  .crv-annolayer{position:absolute;inset:0;pointer-events:none;}
  .crv-dot{position:absolute;width:13px;height:13px;border-radius:50%;transform:translate(-50%,-50%);
    background:var(--ds-bg,#0d0e11);box-shadow:inset 0 0 0 2.5px var(--ds-accent,#6f9bd8);}
  .crv-dot-end{width:17px;height:17px;background:var(--ds-c4);
    box-shadow:0 0 0 6px color-mix(in srgb,var(--ds-c4) 22%,transparent);}
  .crv-anno{position:absolute;transform:translate(-50%,calc(-100% - 22px));display:flex;flex-direction:column;gap:3px;
    text-align:center;white-space:nowrap;}
  .crv-anno-label{font-size:25px;font-weight:300;color:var(--ds-ink,#f2f3f6);}
  .crv-anno-sub{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .crv-end{position:absolute;transform:translate(-50%,calc(-100% - 26px));}
  .crv-end-val{font-size:42px;font-weight:300;font-variant-numeric:tabular-nums;color:var(--ds-c4);
    letter-spacing:-.01em;white-space:nowrap;}
  .crv-axis{position:absolute;left:0;right:0;bottom:0;height:40px;}
  .crv-axis-x{position:absolute;bottom:0;transform:translateX(-50%);font-family:var(--font-mono);font-size:24px;
    letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.46));white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

SlideCurve.META = {
  id: 'curve', title: '净值曲线',
  defaults: { annotationCount: 3, showArea: true, showGrid: true, showEnd: true, smooth: true },
  controls: [
    { key: 'annotationCount', type: 'slider', label: '标注数量', default: 3, min: 0, max: 4, step: 1,
      description: '曲线上钉住的事件标注数量。' },
    { key: 'showArea', type: 'toggle', label: '面积填充', default: true,
      description: '曲线下方的渐变面积。' },
    { key: 'showGrid', type: 'toggle', label: '网格线', default: true,
      description: '横向参考网格。' },
    { key: 'showEnd', type: 'toggle', label: '末端数值', default: true,
      description: '曲线末端的最终金额徽标。' },
    { key: 'smooth', type: 'toggle', label: '平滑曲线', default: true,
      description: '平滑曲线或折线连接。' },
  ],
};

export { SlideCurve };
export const META = SlideCurve.META;
export default SlideCurve;
