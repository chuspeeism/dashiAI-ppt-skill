// SlideOrbit.jsx — 核心卫星 / core-satellite constellation.
// A central core holding most of the capital, with N satellite strategies placed
// on an orbit around it; each satellite's disc area ∝ its weight, joined to the
// core by a spoke. Mirrors the real "core-satellite" portfolio idea. Distinct
// from any donut/bar/flow (radial hub-and-spoke, not a sequential cycle).
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.orb-`.
//
// ── Props (canonical list in SlideOrbit.META.controls) ────────────────────────
//   nodeCount   number 3..6   how many satellites                          (5)
//   showOrbit   boolean       the faint orbit ring                         (true)
//   showSpokes  boolean       the core→satellite connectors                (true)
//   showWeights boolean       the % weight on each satellite               (true)
//   focus       boolean       emphasise one satellite, dim the rest        (false)
//   focusIndex  number 1..6   which satellite is emphasised (1-based)      (1)
//
// Content props (authored at call-site):
//   overline, title, coreLabel, coreValue, coreNote,
//   nodes:[{ label, weight(number), note }]

import React from 'react';

function SlideOrbit({
  overline = '核心 · 卫星 / CORE-SATELLITE', title = '一个稳的核心，几个灵活的卫星',
  coreLabel = '核心组合', coreValue = '64%', coreNote = '指数底仓 · 自动再平衡',
  nodes = [
    { label: '主动 Alpha', weight: 12, note: '精选主动' },
    { label: '另类对冲', weight: 9, note: '低相关' },
    { label: '实物资产', weight: 7, note: '抗通胀' },
    { label: '战术机会', weight: 5, note: '择机出手' },
    { label: '现金缓冲', weight: 3, note: '流动性' },
    { label: '海外敞口', weight: 4, note: '分散地域' },
  ],
  nodeCount = 5, showOrbit = true, showSpokes = true, showWeights = true, focus = false, focusIndex = 1,
  layout = 'side',
}) {
  React.useEffect(() => { orbInjectStyle(); }, []);
  const n = Math.max(3, Math.min(nodes.length, nodeCount));
  const used = nodes.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  const W = 1100, H = 680, cx = 430, cy = 340, R = 246, coreR = 112;
  const maxW = Math.max(...used.map((d) => d.weight)) || 1;
  const rOf = (w) => 30 + Math.sqrt(w / maxW) * 34; // area-ish scaling, 30..64

  const pts = used.map((d, i) => {
    const ang = (-90 + (360 / n) * i) * (Math.PI / 180);
    const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
    return { ...d, x, y, ang, r: rOf(d.weight), right: Math.cos(ang) >= -0.15 };
  });

  return (
    <div className={`orb-root orb-${layout === 'side' ? 'side' : 'top'}`}>
      <div className="orb-head">
        <div className="orb-overline">{overline}</div>
        <h2 className="orb-title">{title}</h2>
      </div>

      <div className="orb-stage">
        <svg className="orb-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {showOrbit && <circle cx={cx} cy={cy} r={R} className="orb-ring" />}
          {showSpokes && pts.map((p, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const ux = (p.x - cx) / R, uy = (p.y - cy) / R;
            const x1 = cx + ux * coreR, y1 = cy + uy * coreR;
            const x2 = p.x - ux * p.r, y2 = p.y - uy * p.r;
            return <line key={'s' + i} x1={x1} y1={y1} x2={x2} y2={y2}
                         className={`orb-spoke ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} />;
          })}

          {/* core */}
          <circle cx={cx} cy={cy} r={coreR + 20} className="orb-core-halo" />
          <foreignObject x={cx - coreR} y={cy - coreR} width={coreR * 2} height={coreR * 2}>
            <div className="orb-core-fx">
              <span className="orb-core-val">{coreValue}</span>
              <span className="orb-core-lab">{coreLabel}</span>
              <span className="orb-core-note">{coreNote}</span>
            </div>
          </foreignObject>

          {/* satellites */}
          {pts.map((p, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const cls = `${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`;
            const lx = p.x + (p.right ? p.r + 18 : -(p.r + 18));
            const anchor = p.right ? 'start' : 'end';
            const hue = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c2)'][i % 6];
            return (
              <g key={'n' + i} className={`orb-node ${cls}`}>
                <foreignObject x={p.x - p.r} y={p.y - p.r} width={p.r * 2} height={p.r * 2}>
                  <div className="orb-disc-fx" style={{ background: `linear-gradient(140deg, color-mix(in srgb, ${hue} 92%, #fff) 0%, ${hue} 45%, color-mix(in srgb, ${hue} 60%, var(--ds-bg-soft,#16181d)) 100%)`, borderColor: hue }}>
                    {showWeights && <span className="orb-disc-w">{p.weight}%</span>}
                  </div>
                </foreignObject>
                <text x={lx} y={p.y - 4} className="orb-node-lab" textAnchor={anchor}>{p.label}</text>
                <text x={lx} y={p.y + 24} className="orb-node-note" textAnchor={anchor}>{p.note}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function orbInjectStyle() {
  if (document.getElementById('orb-style')) return;
  const s = document.createElement('style'); s.id = 'orb-style';
  s.textContent = `
  .orb-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .orb-side{flex-direction:row;align-items:center;gap:48px;}
  .orb-side .orb-head{margin-bottom:0;flex:0 0 32%;max-width:32%;}
  .orb-side .orb-stage{flex:1;min-width:0;}
  .orb-head{margin-bottom:8px;}
  .orb-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .orb-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .orb-stage{flex:1;min-height:0;display:flex;align-items:center;}
  .orb-svg{width:100%;height:100%;overflow:visible;}
  .orb-ring{fill:none;stroke:color-mix(in srgb,var(--ds-accent,#6f9bd8) 46%,var(--ds-ink,#f2f3f6));stroke-opacity:.42;stroke-width:2;stroke-dasharray:3 6;}
  .orb-spoke{stroke:color-mix(in srgb,var(--ds-accent,#6f9bd8) 78%,#fff);stroke-opacity:.58;stroke-width:2;transition:stroke-opacity .25s,opacity .25s;}
  .orb-spoke.is-focus{stroke-opacity:.95;stroke-width:2.4;}
  .orb-spoke.is-dim{opacity:.42;}
  .orb-core-halo{fill:color-mix(in srgb, var(--ds-accent,#6f9bd8) 14%, transparent);}
  .orb-core-fx{width:100%;height:100%;border-radius:50%;box-sizing:border-box;
    background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 88%,#0b0c0f);
    border:1.5px solid var(--ds-accent,#6f9bd8);
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
    text-align:center;padding:14px 18px;overflow:hidden;}
  .orb-core-val{color:#fff;font-family:var(--font-sans);font-size:56px;font-weight:300;line-height:1;font-variant-numeric:tabular-nums;}
  .orb-core-lab{color:rgba(255,255,255,.92);font-family:var(--font-sans);font-size:26px;font-weight:300;line-height:1.1;}
  .orb-core-note{color:rgba(255,255,255,.66);font-family:var(--font-mono);font-size:20px;letter-spacing:.02em;line-height:1.2;text-wrap:balance;}
  .orb-node{transition:opacity .25s;}
  .orb-node.is-dim{opacity:.34;}
  .orb-disc-fx{width:100%;height:100%;border-radius:50%;box-sizing:border-box;
    display:flex;align-items:center;justify-content:center;
    background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 70%,var(--ds-bg-soft,#16181d));
    border:1.4px solid var(--ds-accent,#6f9bd8);
    -webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);
    transition:background .25s,border-color .25s;}
  .orb-node.is-focus .orb-disc-fx{background:color-mix(in srgb,var(--ds-accent,#6f9bd8) 58%,transparent);border-color:var(--ds-accent,#6f9bd8);}
  .orb-disc-w{color:#fff;font-family:var(--font-mono);font-size:24px;font-variant-numeric:tabular-nums;}
  .orb-node-lab{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:29px;font-weight:300;}
  .orb-node.is-focus .orb-node-lab{fill:var(--ds-accent,#6f9bd8);}
  .orb-node-note{fill:var(--ds-faint,rgba(242,243,246,.5));font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;}
  `;
  document.head.appendChild(s);
}

SlideOrbit.META = {
  id: 'orbit', title: '核心卫星',
  defaults: { nodeCount: 5, showOrbit: true, showSpokes: true, showWeights: true, focus: false, focusIndex: 1, layout: 'side' },
  controls: [
    { key: 'layout', type: 'radio', label: '布局', default: 'side',
      options: [{ value: 'top', label: '上下' }, { value: 'side', label: '左右' }],
      description: '标题与图表的排布：上下堆叠或左右分栏。' },
    { key: 'nodeCount', type: 'slider', label: '卫星数量', default: 5, min: 3, max: 6, step: 1,
      description: '环绕核心的卫星策略数量。' },
    { key: 'showOrbit', type: 'toggle', label: '轨道环', default: true,
      description: '卫星所在的虚线轨道。' },
    { key: 'showSpokes', type: 'toggle', label: '连接线', default: true,
      description: '核心到各卫星的连接辐条。' },
    { key: 'showWeights', type: 'toggle', label: '权重标签', default: true,
      description: '每个卫星圆盘内的权重百分比。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一卫星，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideOrbit };
export const META = SlideOrbit.META;
export default SlideOrbit;
