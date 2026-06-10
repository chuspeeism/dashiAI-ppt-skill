// SlideFlow.jsx — 资金流向扇形图 / source-to-streams flow diagram.
// A single source bar on the left fans out into N weighted streams on the right;
// each curved band's thickness ∝ its share, and right-side nodes carry label +
// percentage. Distinct from SlideAllocation (donut) and SlideStacked (vertical
// composition): this is a directional sankey-style fan. Standalone & migratable:
// depends only on React (imported). Token-driven. CSS scoped under `.flow-`.
//
// ── Props (canonical list in SlideFlow.META.controls) ─────────────────────────
//   streamCount number 3..6   how many destination streams                 (5)
//   showPercent boolean       percentage labels on each stream             (true)
//   showSource  boolean       the left source totals panel                 (true)
//   curveAmt    number 0..100 how curved the bands are (0 = straight)       (70)
//   focus       boolean       emphasise one stream, dim the rest           (false)
//   focusIndex  number 1..6   which stream is emphasised (1-based)         (1)
//
// Content props (authored at call-site):
//   overline, title, sourceLabel, sourceValue, streams:[{label, value, note}]

import React from 'react';

function SlideFlow({
  overline = '资金流向 · ALLOCATION FLOW', title = '每一元钱去了哪里',
  sourceLabel = '可投资金', sourceValue = '¥1.25M',
  streams = [
    { label: '全球股票', value: 42, note: '增长引擎' },
    { label: '固定收益', value: 24, note: '稳定压舱' },
    { label: '另类对冲', value: 16, note: '低相关' },
    { label: '实物资产', value: 10, note: '抗通胀' },
    { label: '现金等价', value: 5, note: '流动性' },
    { label: '战术机会', value: 3, note: '择机' },
  ],
  streamCount = 5, showPercent = true, showSource = true, curveAmt = 70, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { flowInjectStyle(); }, []);
  const n = Math.max(3, Math.min(streams.length, streamCount));
  const used = streams.slice(0, n);
  const total = used.reduce((a, s) => a + s.value, 0) || 1;
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  // SVG geometry. Source bar on the left edge, streams stacked on the right.
  const W = 1440, H = 600;
  const srcX = 60, srcTop = 70, srcBot = H - 70, srcH = srcBot - srcTop;
  const dstX = 600;
  const gap = 26;
  const dstTotalH = srcH - gap * (n - 1);
  const k = curveAmt / 100;

  let srcCursor = srcTop;
  let dstCursor = srcTop;
  const bands = used.map((s, i) => {
    const h = (s.value / total) * srcH;          // proportional source slice
    const dh = (s.value / total) * dstTotalH;     // proportional dest slice (with gaps)
    const s0 = srcCursor, s1 = srcCursor + h;
    const d0 = dstCursor, d1 = dstCursor + dh;
    srcCursor = s1;
    dstCursor = d1 + gap;
    const cx1 = srcX + (dstX - srcX) * (0.5 - k * 0.18);
    const cx2 = srcX + (dstX - srcX) * (0.5 + k * 0.18);
    const path = `M${srcX},${s0} C${cx1},${s0} ${cx2},${d0} ${dstX},${d0} `
               + `L${dstX},${d1} C${cx2},${d1} ${cx1},${s1} ${srcX},${s1} Z`;
    return { ...s, path, dMid: (d0 + d1) / 2, d0, d1, pct: Math.round((s.value / total) * 100) };
  });

  // De-collide label Y positions: keep each at least `minGap` apart, centred.
  const minGap = Math.min(86, srcH / n);
  const labelY = bands.map((b) => b.dMid);
  for (let i = 1; i < labelY.length; i++) {
    if (labelY[i] < labelY[i - 1] + minGap) labelY[i] = labelY[i - 1] + minGap;
  }
  const overflow = labelY[n - 1] - (srcBot - 6);
  if (overflow > 0) for (let i = 0; i < labelY.length; i++) labelY[i] -= overflow;

  return (
    <div className="flow-root">
      <div className="flow-head">
        <div className="flow-overline">{overline}</div>
        <h2 className="flow-title">{title}</h2>
      </div>

      <div className="flow-stage">
        <svg className="flow-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {showSource && (
            <>
              <rect x={srcX - 16} y={srcTop} width="16" height={srcH} rx="3" className="flow-srcbar" />
              <text x={0} y={srcTop - 18} className="flow-src-val" textAnchor="start">{sourceValue}</text>
              <text x={0} y={srcBot + 36} className="flow-src-lab" textAnchor="start">{sourceLabel}</text>
            </>
          )}
          {bands.map((b, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return <path key={i} d={b.path} className={`flow-band ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                         style={{ fill: HUE[i % HUE.length], stroke: HUE[i % HUE.length] }} />;
          })}
          {bands.map((b, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return <rect key={'n' + i} x={dstX} y={b.d0} width="14" height={Math.max(2, b.d1 - b.d0)} rx="3"
                         className={`flow-node ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}
                         style={{ fill: HUE[i % HUE.length] }} />;
          })}
          {bands.map((b, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const ly = labelY[i];
            const leadX = 1150;
            return (
              <g key={'l' + i} className={`flow-lab ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}>
                <path d={`M${dstX + 14},${b.dMid} C${(dstX + 14 + leadX) / 2},${b.dMid} ${(dstX + 14 + leadX) / 2},${ly} ${leadX},${ly}`}
                      className="flow-lab-link" />
                <text x={W - 150} y={ly - 4} className="flow-lab-name" textAnchor="end">{b.label}</text>
                {showPercent && <text x={W} y={ly - 2} className="flow-lab-pct" textAnchor="end" style={{ fill: HUE[i % HUE.length] }}>{b.pct}%</text>}
                <text x={W} y={ly + 30} className="flow-lab-note" textAnchor="end">{b.note}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function flowInjectStyle() {
  if (document.getElementById('flow-style')) return;
  const s = document.createElement('style'); s.id = 'flow-style';
  s.textContent = `
  .flow-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .flow-head{margin-bottom:8px;}
  .flow-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .flow-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .flow-stage{flex:1;min-height:0;display:flex;align-items:center;}
  .flow-svg{width:100%;height:100%;overflow:visible;}
  .flow-srcbar{fill:var(--ds-ink,#f2f3f6);opacity:.85;}
  .flow-src-val{font-family:var(--font-mono);font-size:34px;font-variant-numeric:tabular-nums;fill:var(--ds-ink,#f2f3f6);}
  .flow-src-lab{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;fill:var(--ds-faint,rgba(242,243,246,.5));}
  .flow-band{fill:var(--ds-accent,#6f9bd8);fill-opacity:.66;stroke:var(--ds-accent,#6f9bd8);stroke-opacity:.5;stroke-width:1;
    transition:fill-opacity .25s,opacity .25s;}
  .flow-band.is-focus{fill-opacity:.9;stroke-opacity:.9;}
  .flow-band.is-dim{opacity:.25;}
  .flow-node{fill:var(--ds-accent,#6f9bd8);opacity:.8;transition:opacity .25s;}
  .flow-node.is-focus{opacity:1;}
  .flow-node.is-dim{opacity:.3;}
  .flow-lab{transition:opacity .25s;}
  .flow-lab.is-dim{opacity:.32;}
  .flow-lab-name{font-family:var(--font-sans);font-size:30px;font-weight:300;fill:var(--ds-ink,#f2f3f6);}
  .flow-lab-link{fill:none;stroke:var(--ds-faint,rgba(242,243,246,.4));stroke-width:1.2;}
  .flow-lab-note{font-family:var(--font-mono);font-size:22px;letter-spacing:.05em;fill:var(--ds-faint,rgba(242,243,246,.5));}
  .flow-lab-pct{font-family:var(--font-mono);font-size:34px;font-variant-numeric:tabular-nums;fill:var(--ds-accent,#6f9bd8);}
  .flow-lab.is-focus .flow-lab-pct{font-size:40px;}
  `;
  document.head.appendChild(s);
}

SlideFlow.META = {
  id: 'flow', title: '资金流向图',
  defaults: { streamCount: 5, showPercent: true, showSource: true, curveAmt: 70, focus: false, focusIndex: 1 },
  controls: [
    { key: 'streamCount', type: 'slider', label: '流向数量', default: 5, min: 3, max: 6, step: 1,
      description: '从资金源分出的去向流数量。' },
    { key: 'showPercent', type: 'toggle', label: '占比标签', default: true,
      description: '每条流向上的百分比标签。' },
    { key: 'showSource', type: 'toggle', label: '资金源面板', default: true,
      description: '左侧的资金总额来源条。' },
    { key: 'curveAmt', type: 'slider', label: '曲线弯度', default: 70, min: 0, max: 100, step: 10, unit: '%',
      description: '流带的弯曲程度，0 为直线。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一条流向，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideFlow };
export const META = SlideFlow.META;
export default SlideFlow;
