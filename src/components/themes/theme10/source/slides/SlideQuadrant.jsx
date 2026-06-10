// SlideQuadrant.jsx — 策略象限 / immersive full-bleed positioning map.
// The 2-axis map fills the whole frame (no side legend); points are labelled in
// place, the "ideal" quadrant is softly tinted, and the focused point gets an
// accent halo with a coordinate readout. A compact margin header sits top-left.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.qd-`.
//
// ── Props (canonical list in SlideQuadrant.META.controls) ─────────────────────
//   pointCount         number 3..6   how many plotted points              (5)
//   focus              boolean       emphasise one point, dim the rest     (false)
//   focusIndex         number 1..6   which point is emphasised (1-based)   (1)
//   showIdealZone      boolean       tint the top-right "ideal" quadrant   (true)
//   showQuadrantLabels boolean       the four corner quadrant captions     (true)
//   showAxisLabels     boolean       the axis end labels                   (true)
//
// Content props (authored at call-site):
//   overline, title, axisX{low,high}, axisY{low,high}, quadrants[tl,tr,bl,br],
//   points:[{ label, x, y }]   (x/y in 0..100)

import React from 'react';

function SlideQuadrant({
  overline = '策略定位 · MATRIX', title = '风险与回报的坐标',
  axisX = { low: '低风险', high: '高风险' },
  axisY = { low: '低回报', high: '高回报' },
  quadrants = ['稳健区', '理想区', '低效区', '投机区'],
  points = [
    { label: '自主指数', x: 42, y: 82 },
    { label: '指数基金', x: 30, y: 52 },
    { label: '私人理财', x: 64, y: 60 },
    { label: '主动基金', x: 72, y: 44 },
    { label: '储蓄存款', x: 16, y: 20 },
    { label: '单一押注', x: 86, y: 70 },
  ],
  pointCount = 5, focus = false, focusIndex = 1,
  showIdealZone = true, showQuadrantLabels = true, showAxisLabels = true,
}) {
  React.useEffect(() => { qdInjectStyle(); }, []);
  const n = Math.max(3, Math.min(points.length, pointCount));
  const pts = points.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c2)'];

  return (
    <div className="qd-root">
      <div className="qd-plot">
        {showIdealZone && <span className="qd-ideal" />}
        <span className="qd-axis qd-axis-v" />
        <span className="qd-axis qd-axis-h" />

        <div className="qd-header">
          <div className="qd-overline">{overline}</div>
          <h2 className="qd-title">{title}</h2>
        </div>

        {showQuadrantLabels && (
          <>
            <span className="qd-quad qd-quad-tr">{quadrants[1]}</span>
            <span className="qd-quad qd-quad-bl">{quadrants[2]}</span>
            <span className="qd-quad qd-quad-br">{quadrants[3]}</span>
          </>
        )}

        {showAxisLabels && (
          <>
            <span className="qd-ay qd-ay-high">{axisY.high}</span>
            <span className="qd-ay qd-ay-low">{axisY.low}</span>
            <span className="qd-ax qd-ax-low">{axisX.low}</span>
            <span className="qd-ax qd-ax-high">{axisX.high}</span>
          </>
        )}

        {pts.map((p, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const flip = p.x > 64;
          return (
            <span key={i} className={`qd-pt ${flip ? 'is-flip' : ''} ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                  style={{ left: `${p.x}%`, top: `${100 - p.y}%` }}>
              <span className="qd-dot" style={{ background: HUE[i % HUE.length], opacity: 1 }} />
              <span className="qd-ptbox">
                <span className="qd-ptlabel">{p.label}</span>
                {hot && <span className="qd-ptcoord">风险 {p.x} · 回报 {p.y}</span>}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function qdInjectStyle() {
  if (document.getElementById('qd-style')) return;
  const s = document.createElement('style'); s.id = 'qd-style';
  s.textContent = `
  .qd-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:64px 96px 84px;font-family:var(--font-sans);}
  .qd-plot{position:relative;width:100%;height:100%;
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.14));border-radius:8px;}
  .qd-ideal{position:absolute;left:50%;top:0;right:0;height:50%;border-radius:0 8px 0 0;
    background:radial-gradient(120% 120% at 90% 10%, rgba(84,121,232,.16) 0%, rgba(84,121,232,0) 70%);}
  .qd-axis{position:absolute;background:var(--ds-line,rgba(242,243,246,.16));}
  .qd-axis-v{left:50%;top:0;bottom:0;width:1px;}
  .qd-axis-h{top:50%;left:0;right:0;height:1px;}
  .qd-header{position:absolute;left:44px;top:40px;max-width:46%;}
  .qd-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .qd-title{font-size:54px;font-weight:300;margin:14px 0 0;line-height:1.08;}
  .qd-quad{position:absolute;font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;
    color:var(--ds-faint,rgba(242,243,246,.34));}
  .qd-quad-tr{top:34px;right:34px;color:var(--ds-accent,#6f9bd8);opacity:.75;}
  .qd-quad-bl{bottom:34px;left:34px;} .qd-quad-br{bottom:34px;right:34px;}
  .qd-ay{position:absolute;left:-6px;font-family:var(--font-mono);font-size:24px;letter-spacing:.08em;
    color:var(--ds-faint,rgba(242,243,246,.42));writing-mode:vertical-rl;}
  .qd-ay-high{top:8px;} .qd-ay-low{bottom:8px;}
  .qd-ax{position:absolute;bottom:-44px;font-family:var(--font-mono);font-size:24px;letter-spacing:.08em;
    color:var(--ds-faint,rgba(242,243,246,.42));}
  .qd-ax-low{left:0;} .qd-ax-high{right:0;}
  .qd-pt{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:16px;
    transition:opacity .25s ease;white-space:nowrap;}
  .qd-pt.is-flip{flex-direction:row-reverse;}
  .qd-dot{width:18px;height:18px;border-radius:50%;background:currentColor;opacity:.55;flex:0 0 auto;transition:all .25s ease;}
  .qd-ptbox{display:flex;flex-direction:column;gap:6px;}
  .qd-pt.is-flip .qd-ptbox{align-items:flex-end;}
  .qd-ptlabel{font-size:28px;font-weight:300;}
  .qd-ptcoord{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-accent,#6f9bd8);}
  .qd-pt.is-dim{opacity:.3;}
  .qd-pt.is-focus .qd-dot{background:var(--ds-accent,#6f9bd8);opacity:1;width:26px;height:26px;
    box-shadow:0 0 0 9px rgba(84,121,232,.16),0 0 0 17px rgba(84,121,232,.07);}
  .qd-pt.is-focus .qd-ptlabel{font-weight:400;color:var(--ds-accent,#6f9bd8);}
  `;
  document.head.appendChild(s);
}

SlideQuadrant.META = {
  id: 'quadrant', title: '策略象限',
  defaults: { pointCount: 5, focus: false, focusIndex: 1, showIdealZone: true, showQuadrantLabels: true, showAxisLabels: true },
  controls: [
    { key: 'pointCount', type: 'slider', label: '坐标点数量', default: 5, min: 3, max: 6, step: 1,
      description: '地图中绘制的定位点数量。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一坐标点并显示坐标读数，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
    { key: 'showIdealZone', type: 'toggle', label: '理想区高亮', default: true,
      description: '为右上「理想区」象限叠加柔和的蓝色光晕。' },
    { key: 'showQuadrantLabels', type: 'toggle', label: '象限标注', default: true,
      description: '四个角的象限说明文字。' },
    { key: 'showAxisLabels', type: 'toggle', label: '坐标轴标注', default: true,
      description: '两条坐标轴两端的高低标签。' },
  ],
};

export { SlideQuadrant };
export const META = SlideQuadrant.META;
export default SlideQuadrant;
