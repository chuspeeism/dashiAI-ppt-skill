// SlideSankey.jsx — 资金桑基 / source→destination flow ribbons.
// Two stacked node columns (left = sources, right = destinations) connected by
// proportionally-weighted curved ribbons, so "where money comes from and where
// it goes" reads as one continuous flow. Distinct from SlideFlow (node graph),
// SlideFunnel (single shrinking stack) and SlideAreaStack (time series): this is
// a bipartite weighted flow. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.snk-`.
//
// ── Props (canonical list in SlideSankey.META.controls) ───────────────────────
//   sourceCount  number 2..4   left-hand source nodes                      (3)
//   targetCount  number 3..5   right-hand destination nodes                (4)
//   showValues   boolean       value chips on each node                    (true)
//   showLabels   boolean       node name labels                            (true)
//   focus        boolean       highlight one destination's inflows         (false)
//   focusIndex   number 1..5   which destination is highlighted (1-based)  (1)
//
// Content props (authored at call-site):
//   overline, title, unit, sources:[{name,value}], targets:[{name}],
//   links: number[sources][targets]  (flow weights)

import React from 'react';

function SlideSankey({
  overline = '资金流 · SANKEY', title = '钱从哪来，去了哪',
  unit = '%',
  sources = [
    { name: '定投流入' }, { name: '分红再投' }, { name: '一次性申购' }, { name: '组合调仓' },
  ],
  targets = [
    { name: '全球股票' }, { name: '固定收益' }, { name: '另类对冲' }, { name: '实物资产' }, { name: '现金缓冲' },
  ],
  links = [
    [18, 6, 5, 4, 2],
    [9, 7, 2, 1, 1],
    [10, 5, 6, 4, 3],
    [4, 3, 3, 2, 1],
  ],
  sourceCount = 3, targetCount = 4, showValues = true, showLabels = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { snkInjectStyle(); }, []);
  const ns = Math.max(2, Math.min(sources.length, sourceCount));
  const nt = Math.max(3, Math.min(targets.length, targetCount));
  const src = sources.slice(0, ns), tgt = targets.slice(0, nt);
  const M = src.map((_, si) => tgt.map((_, ti) => links[si][ti] || 0));
  const fIdx = focus ? Math.max(0, Math.min(nt - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  const W = 1200, H = 660, colW = 26, gapPx = 18;
  const lx = 0, rx = W - colW;
  const srcTot = M.map((row) => row.reduce((a, b) => a + b, 0));
  const tgtTot = tgt.map((_, ti) => M.reduce((a, row) => a + row[ti], 0));
  const grand = srcTot.reduce((a, b) => a + b, 0) || 1;

  // node vertical layout (proportional heights + gaps)
  const layout = (totals) => {
    const totalGap = gapPx * (totals.length - 1);
    const avail = H - totalGap;
    let y = 0; return totals.map((t) => { const h = (t / grand) * avail; const o = { y, h }; y += h + gapPx; return o; });
  };
  const sN = layout(srcTot), tN = layout(tgtTot);

  // ribbon endpoints: walk each node's edge top-down
  const sCursor = sN.map((n) => n.y), tCursor = tN.map((n) => n.y);
  const ribbons = [];
  src.forEach((_, si) => {
    tgt.forEach((__, ti) => {
      const v = M[si][ti]; if (v <= 0) return;
      const avail = H - gapPx * (src.length - 1);
      const hS = (v / grand) * (H - gapPx * (src.length - 1));
      const hT = (v / grand) * (H - gapPx * (tgt.length - 1));
      const y0 = sCursor[si], y1 = sCursor[si] + hS;
      const y2 = tCursor[ti], y3 = tCursor[ti] + hT;
      sCursor[si] += hS; tCursor[ti] += hT;
      const x0 = lx + colW, x1 = rx;
      const mx = (x0 + x1) / 2;
      const d = `M${x0} ${y0} C${mx} ${y0} ${mx} ${y2} ${x1} ${y2} L${x1} ${y3} C${mx} ${y3} ${mx} ${y1} ${x0} ${y1} Z`;
      ribbons.push({ d, si, ti, v });
    });
  });

  return (
    <div className="snk-root">
      <div className="snk-head">
        <div className="snk-overline">{overline}</div>
        <h2 className="snk-title">{title}</h2>
      </div>

      <div className="snk-stage">
        <svg className="snk-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          {ribbons.map((r, i) => {
            const hot = fIdx >= 0 && r.ti === fIdx;
            const dim = fIdx >= 0 && !hot;
            return <path key={i} d={r.d} className={`snk-ribbon ${hot ? 'is-hot' : ''} ${dim ? 'is-dim' : ''}`}
                         style={{ color: HUE[r.ti % HUE.length] }} />;
          })}
          {sN.map((nd, i) => <rect key={`s${i}`} x={lx} y={nd.y} width={colW} height={nd.h} className="snk-node snk-node-s" rx="4" />)}
          {tN.map((nd, i) => {
            const hot = i === fIdx;
            return <rect key={`t${i}`} x={rx} y={nd.y} width={colW} height={nd.h}
                         className={`snk-node snk-node-t ${hot ? 'is-hot' : ''}`} rx="4" style={{ fill: HUE[i % HUE.length] }} />;
          })}
        </svg>

        {showLabels && (
          <>
            <div className="snk-labels snk-labels-l">
              {sN.map((nd, i) => (
                <div className="snk-lab" key={i} style={{ top: `${(nd.y + nd.h / 2) / H * 100}%` }}>
                  <span className="snk-lab-name">{src[i].name}</span>
                  {showValues && <span className="snk-lab-val">{srcTot[i]}{unit}</span>}
                </div>
              ))}
            </div>
            <div className="snk-labels snk-labels-r">
              {tN.map((nd, i) => (
                <div className={`snk-lab is-right ${i === fIdx ? 'is-hot' : ''}`} key={i} style={{ top: `${(nd.y + nd.h / 2) / H * 100}%` }}>
                  <span className="snk-lab-name">{tgt[i].name}</span>
                  {showValues && <span className="snk-lab-val">{tgtTot[i]}{unit}</span>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function snkInjectStyle() {
  if (document.getElementById('snk-style')) return;
  const s = document.createElement('style'); s.id = 'snk-style';
  s.textContent = `
  .snk-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .snk-head{margin-bottom:24px;}
  .snk-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .snk-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .snk-stage{position:relative;flex:1;min-height:0;margin:0 140px;}
  .snk-svg{width:100%;height:100%;display:block;overflow:visible;}
  .snk-ribbon{fill:currentColor;color:var(--ds-accent,#5479e8);opacity:.52;transition:opacity .25s ease;}
  .snk-ribbon.is-hot{opacity:.8;}
  .snk-ribbon.is-dim{opacity:.05;}
  .snk-node{fill:var(--ds-ink,#f2f3f6);opacity:.85;}
  .snk-node-t{fill:var(--ds-accent,#5479e8);opacity:.7;}
  .snk-node-t.is-hot{opacity:1;}
  .snk-labels{position:absolute;top:0;height:100%;width:140px;}
  .snk-labels-l{right:100%;}
  .snk-labels-r{left:100%;}
  .snk-lab{position:absolute;transform:translateY(-50%);display:flex;flex-direction:column;gap:4px;
    padding:0 18px;text-align:right;width:100%;}
  .snk-lab.is-right{text-align:left;}
  .snk-lab-name{font-size:26px;font-weight:300;line-height:1.15;}
  .snk-lab-val{font-family:var(--font-mono);font-size:23px;color:var(--ds-faint,rgba(242,243,246,.5));}
  .snk-lab.is-hot .snk-lab-name{color:var(--ds-accent,#5479e8);font-weight:400;}
  .snk-lab.is-hot .snk-lab-val{color:var(--ds-accent,#5479e8);}
  `;
  document.head.appendChild(s);
}

SlideSankey.META = {
  id: 'sankey', title: '资金桑基',
  defaults: { sourceCount: 3, targetCount: 4, showValues: true, showLabels: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'sourceCount', type: 'slider', label: '来源数量', default: 3, min: 2, max: 4, step: 1,
      description: '左侧资金来源节点数量。' },
    { key: 'targetCount', type: 'slider', label: '去向数量', default: 4, min: 3, max: 5, step: 1,
      description: '右侧配置去向节点数量。' },
    { key: 'showValues', type: 'toggle', label: '数值标签', default: true,
      description: '各节点旁的合计数值。' },
    { key: 'showLabels', type: 'toggle', label: '节点名称', default: true,
      description: '两侧节点名称标签。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一去向的全部流入带，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效（按去向计）。' },
  ],
};

export { SlideSankey };
export const META = SlideSankey.META;
export default SlideSankey;
