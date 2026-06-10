// SlideCycle.jsx — 闭环循环 / circular process loop.
// N nodes on a ring with curved flow arrows and a centre hub, emphasising a
// REPEATING cycle (vs SlideSteps' one-way linear flow). Rendered as one inline
// SVG with preserveAspectRatio="meet" (the same proven, layout-robust pattern as
// the deck's other charts) so it stays centred, circular and aligned in BOTH the
// top and side layouts at any size — no HTML overlay / foreignObject / JS measure.
// Standalone & migratable: depends only on React (imported). Token-driven. CSS
// scoped under `.cyc-`.
//
// ── Props (canonical list in SlideCycle.META.controls) ────────────────────────
//   nodeCount   number 3..6   how many nodes in the loop                   (4)
//   showArrows  boolean       the curved flow arrows                       (true)
//   showHub     boolean       the centre hub label                         (true)
//   showDesc    boolean       the per-node description                     (true)
//   focus       boolean       emphasise one node, dim the rest             (false)
//   focusIndex  number 1..6   which node is emphasised (1-based)           (1)
//   layout      'top'|'side'  title above the chart, or beside it          ('top')
//
// Content props (authored at call-site):
//   overline, title, hub, nodes:[{ label, desc }]

import React from 'react';

function SlideCycle({
  overline = '持续闭环 · THE LOOP', title = '一套自动运转的循环',
  hub = '自主指数\n引擎',
  nodes = [
    { label: '监测', desc: '7×24 跟踪偏离' },
    { label: '信号', desc: '触阈生成调仓信号' },
    { label: '执行', desc: '按规则自动再平衡' },
    { label: '复盘', desc: '记录归因反馈模型' },
    { label: '优化', desc: '据复盘微调参数' },
    { label: '汇报', desc: '定期生成报告' },
  ],
  nodeCount = 4, showArrows = true, showHub = true, showDesc = true, focus = false, focusIndex = 1,
  layout = 'top',
}) {
  React.useEffect(() => { cycInjectStyle(); }, []);
  const n = Math.max(3, Math.min(nodes.length, nodeCount));
  const used = nodes.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  const W = 1280, H = 720, cx = W / 2, cy = H / 2, R = 232;
  const pts = used.map((d, i) => {
    const ang = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { ...d, ang, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  });
  const hubLines = hub.split('\n');

  return (
    <div className={`cyc-root cyc-${layout === 'side' ? 'side' : 'top'}`}>
      <div className="cyc-head">
        <div className="cyc-overline">{overline}</div>
        <h2 className="cyc-title">{title}</h2>
      </div>

      <div className="cyc-stage">
        <svg className="cyc-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="cycArrow" markerWidth="9" markerHeight="9" refX="5" refY="4.5" orient="auto">
              <path d="M0,0 L9,4.5 L0,9 Z" fill="var(--ds-accent,#6f9bd8)" />
            </marker>
          </defs>

          {showArrows && pts.map((p, i) => {
            const next = pts[(i + 1) % n];
            const gap = 0.36;
            const a = p.ang + gap, b = next.ang - gap + (next.ang <= p.ang ? 2 * Math.PI : 0);
            const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a);
            const x2 = cx + R * Math.cos(b), y2 = cy + R * Math.sin(b);
            const large = (b - a) % (2 * Math.PI) > Math.PI ? 1 : 0;
            return (
              <path key={'a' + i}
                    d={`M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)}`}
                    className="cyc-arc" markerEnd="url(#cycArrow)" />
            );
          })}

          {showHub && (
            <g>
              <circle cx={cx} cy={cy} r="150" className="cyc-hub-ring" />
              <circle cx={cx} cy={cy} r="124" className="cyc-hub-disc" />
              <circle cx={cx} cy={cy} r="106" className="cyc-hub-inner" />
              <text x={cx} y={cy} className="cyc-hub-t" textAnchor="middle">
                {hubLines.map((l, i) => (
                  <tspan key={i} x={cx} dy={i === 0 ? `${-(hubLines.length - 1) * 0.58}em` : '1.16em'}>{l}</tspan>
                ))}
              </text>
            </g>
          )}

          {pts.map((p, i) => {
            const hot = fIdx < 0 || fIdx === i;
            const onRight = p.x >= cx - 30;
            const lx = onRight ? p.x + 56 : p.x - 56;
            const anchor = onRight ? 'start' : 'end';
            const hue = ['var(--ds-c1)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c6)', 'var(--ds-c2)', 'var(--ds-c5)'][i % 6];
            const lit = fIdx !== i;
            return (
              <g key={'n' + i} className={`cyc-node ${fIdx === i ? 'is-focus' : ''} ${fIdx >= 0 && !hot ? 'is-dim' : ''}`}>
                <circle cx={p.x} cy={p.y} r="38" className="cyc-dot" style={lit ? { stroke: hue } : undefined} />
                <text x={p.x} y={p.y} className="cyc-idx" textAnchor="middle" dominantBaseline="central" style={lit ? { fill: hue } : undefined}>{String(i + 1).padStart(2, '0')}</text>
                <text x={lx} y={p.y - (showDesc ? 6 : -10)} className="cyc-label" textAnchor={anchor} style={lit ? { fill: hue } : undefined}>{p.label}</text>
                {showDesc && <text x={lx} y={p.y + 30} className="cyc-desc" textAnchor={anchor}>{p.desc}</text>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function cycInjectStyle() {
  if (document.getElementById('cyc-style')) return;
  const s = document.createElement('style'); s.id = 'cyc-style';
  s.textContent = `
  .cyc-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .cyc-side{flex-direction:row;align-items:stretch;gap:40px;}
  .cyc-side .cyc-head{margin-bottom:0;flex:0 0 30%;max-width:30%;align-self:center;}
  .cyc-side .cyc-stage{flex:1;min-width:0;align-self:stretch;}
  .cyc-head{margin-bottom:8px;}
  .cyc-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cyc-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .cyc-stage{position:relative;flex:1;min-height:0;}
  .cyc-svg{position:absolute;inset:0;width:100%;height:100%;}
  .cyc-arc{fill:none;stroke:var(--ds-accent,#6f9bd8);stroke-opacity:.5;stroke-width:2;}
  .cyc-hub-ring{fill:none;stroke:color-mix(in srgb,var(--ds-accent,#6f9bd8) 40%,transparent);stroke-width:1.5;stroke-dasharray:4 8;}
  .cyc-hub-disc{fill:color-mix(in srgb,var(--ds-accent,#6f9bd8) 16%,transparent);}
  .cyc-hub-inner{fill:none;stroke:color-mix(in srgb,var(--ds-accent,#6f9bd8) 24%,transparent);stroke-width:1;}
  .cyc-hub-t{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:38px;font-weight:300;}
  .cyc-node{transition:opacity .25s;}
  .cyc-node.is-dim{opacity:.34;}
  .cyc-dot{fill:var(--ds-bg-soft,#16181d);stroke:var(--ds-accent,#6f9bd8);stroke-width:2;}
  .cyc-node.is-focus .cyc-dot{fill:var(--ds-accent,#6f9bd8);}
  .cyc-idx{fill:var(--ds-accent,#6f9bd8);font-family:var(--font-mono);font-size:30px;font-variant-numeric:tabular-nums;}
  .cyc-node.is-focus .cyc-idx{fill:#0c1118;}
  .cyc-label{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:32px;font-weight:300;}
  .cyc-node.is-focus .cyc-label{fill:var(--ds-accent,#6f9bd8);}
  .cyc-desc{fill:var(--ds-muted,rgba(242,243,246,.6));font-family:var(--font-sans);font-size:24px;font-weight:300;}
  `;
  document.head.appendChild(s);
}

SlideCycle.META = {
  id: 'cycle', title: '闭环循环',
  defaults: { nodeCount: 4, showArrows: true, showHub: true, showDesc: true, focus: false, focusIndex: 1, layout: 'top' },
  controls: [
    { key: 'layout', type: 'radio', label: '布局', default: 'top',
      options: [{ value: 'top', label: '上下' }, { value: 'side', label: '左右' }],
      description: '标题与图表的排布：上下堆叠或左右分栏。' },
    { key: 'nodeCount', type: 'slider', label: '节点数量', default: 4, min: 3, max: 6, step: 1,
      description: '循环上的节点数量。' },
    { key: 'showArrows', type: 'toggle', label: '流向箭头', default: true,
      description: '节点之间的弧形流向箭头。' },
    { key: 'showHub', type: 'toggle', label: '中心标签', default: true,
      description: '圆环中心的主体标签。' },
    { key: 'showDesc', type: 'toggle', label: '节点说明', default: true,
      description: '每个节点旁的说明文字。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一节点，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideCycle };
export const META = SlideCycle.META;
export default SlideCycle;
