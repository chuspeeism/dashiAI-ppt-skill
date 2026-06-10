// SlideTimeline.jsx — 横向时间轴 / horizontal milestone track.
// A single baseline crossing the slide, with year nodes stepping along it.
// Distinct from SlideRoadmap (vertical) and SlideSteps (process arrows): this is
// a chronological horizontal track with alternating above/below callouts.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.tl-`.
//
// ── Props (canonical list in SlideTimeline.META.controls) ─────────────────────
//   nodeCount    number 3..6   how many milestone nodes                  (5)
//   layout       'alternate'|'below'   callouts straddle the line or all below (alternate)
//   focus        boolean       emphasise one node, dim the rest           (false)
//   focusIndex   number 1..6   which node is emphasised (1-based)         (1)
//   showConnector boolean      the connecting baseline + ticks            (true)
//
// Content props (authored at call-site):
//   overline, title, nodes: [{ year, label, note }]

import React from 'react';

function SlideTimeline({
  overline = '发展历程 · TIMELINE', title = '一条始终自主的曲线',
  nodes = [
    { year: '2018', label: '引擎成型', note: '自主再平衡算法首次实盘验证。' },
    { year: '2020', label: '穿越波动', note: '在剧烈震荡中保持纪律，回撤可控。' },
    { year: '2022', label: '税务感知', note: '交易引擎接入税务优化，净收益抬升。' },
    { year: '2024', label: '全面开放', note: '面向所有持有人开放透明账本。' },
    { year: '2026', label: '当下', note: '管理规模与跑赢基准同步创新高。' },
    { year: '2028', label: '路线图', note: '跨市场对冲与自动化覆盖再扩张。' },
  ],
  nodeCount = 5, layout = 'alternate', focus = false, focusIndex = 1, showConnector = true,
}) {
  React.useEffect(() => { tlInjectStyle(); }, []);
  const n = Math.max(3, Math.min(nodes.length, nodeCount));
  const items = nodes.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const alt = layout === 'alternate';
  const HUE = ['var(--ds-c1)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c2)'];

  return (
    <div className="tl-root">
      <div className="tl-head">
        <div className="tl-overline">{overline}</div>
        <h2 className="tl-title">{title}</h2>
      </div>

      <div className={`tl-track ${alt ? 'is-alt' : 'is-below'} ${showConnector ? 'has-line' : ''}`}
           style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {showConnector && <span className="tl-line" />}
        {items.map((it, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const up = alt && i % 2 === 0;
          const hue = HUE[i % HUE.length];
          return (
            <div className={`tl-node ${up ? 'is-up' : 'is-down'} ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="tl-card">
                <div className="tl-year" style={hot ? undefined : { color: hue }}>{it.year}</div>
                <div className="tl-label">{it.label}</div>
                <p className="tl-note">{it.note}</p>
              </div>
              <span className="tl-dot" style={hot ? undefined : { background: hue, opacity: 1 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function tlInjectStyle() {
  if (document.getElementById('tl-style')) return;
  const s = document.createElement('style'); s.id = 'tl-style';
  s.textContent = `
  .tl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .tl-head{margin-bottom:18px;}
  .tl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .tl-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .tl-track{position:relative;flex:1;display:grid;align-items:center;min-height:0;}
  .tl-line{position:absolute;left:0;right:0;top:50%;height:2px;
    background:linear-gradient(90deg,color-mix(in srgb,var(--ds-c1) 55%,transparent),color-mix(in srgb,var(--ds-c3) 55%,transparent),color-mix(in srgb,var(--ds-c4) 55%,transparent));}
  .tl-track.is-below .tl-line{top:42%;}
  .tl-node{position:relative;display:flex;flex-direction:column;align-items:flex-start;padding-right:48px;transition:opacity .25s ease;}
  .tl-track.is-alt .tl-node{display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);height:100%;}
  .tl-track.is-alt .tl-node.is-up .tl-card{grid-row:1;align-self:end;margin-bottom:44px;}
  .tl-track.is-alt .tl-node.is-down .tl-card{grid-row:2;align-self:start;margin-top:44px;}
  .tl-track.is-below .tl-node{height:100%;}
  .tl-track.is-below .tl-card{position:absolute;top:calc(42% + 46px);left:0;right:48px;}
  .tl-card{max-width:340px;}
  .tl-year{font-family:var(--font-mono);font-size:30px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .tl-label{font-size:38px;font-weight:300;margin:8px 0 14px;line-height:1.12;}
  .tl-note{font-size:24px;line-height:1.56;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.6));margin:0;text-wrap:pretty;}
  .tl-dot{position:absolute;left:0;width:18px;height:18px;border-radius:50%;background:currentColor;opacity:.4;
    box-shadow:0 0 0 6px var(--ds-bg-soft,#16181d);}
  .tl-track.is-alt .tl-dot{top:50%;transform:translateY(-50%);}
  .tl-track.is-below .tl-dot{top:42%;transform:translateY(-50%);}
  .tl-node.is-dim{opacity:.34;}
  .tl-node.is-focus .tl-dot{background:var(--ds-accent,#6f9bd8);opacity:1;width:24px;height:24px;
    box-shadow:0 0 0 7px rgba(84,121,232,.18),0 0 0 11px var(--ds-bg-soft,#16181d);}
  .tl-node.is-focus .tl-year,.tl-node.is-focus .tl-label{color:var(--ds-accent,#6f9bd8);}
  `;
  document.head.appendChild(s);
}

SlideTimeline.META = {
  id: 'timeline', title: '横向时间轴',
  defaults: { nodeCount: 5, layout: 'alternate', focus: false, focusIndex: 1, showConnector: true },
  controls: [
    { key: 'nodeCount', type: 'slider', label: '节点数量', default: 5, min: 3, max: 6, step: 1,
      description: '时间轴上的里程碑节点数量。' },
    { key: 'layout', type: 'radio', label: '节点排布', default: 'alternate',
      options: [{ value: 'alternate', label: '上下交错' }, { value: 'below', label: '统一下方' }],
      description: '说明卡片在基线上下交错，或全部置于基线下方。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一节点，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
    { key: 'showConnector', type: 'toggle', label: '连接基线', default: true,
      description: '贯穿节点的连接线与圆点。' },
  ],
};

export { SlideTimeline };
export const META = SlideTimeline.META;
export default SlideTimeline;
