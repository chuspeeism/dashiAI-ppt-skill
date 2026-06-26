// SlideVersus.jsx — 抉择双栏 / diagonal A-vs-B contrast.
// The frame is split by a diagonal seam into two stances — a dimmed "before /
// do-it-yourself" side and an emphasised "with us" side — each carrying a label,
// a headline verdict, a hero figure and a short list of points. Distinct from
// SlidePlans (3-column pricing grid) and SlideQuadrant (2×2): this is a binary
// editorial face-off. Standalone & migratable: depends only on React (imported).
// Token-driven. CSS scoped under `.vs-`.
//
// ── Props (canonical list in SlideVersus.META.controls) ───────────────────────
//   pointCount  number 1..5          bullet points shown per side          (4)
//   splitBias   number 42..60        seam position (% from left)           (52)
//   showStat    boolean              the hero figure per side              (true)
//   showPoints  boolean              the bullet list per side              (true)
//
// Content props (authored at call-site):
//   overline,
//   left:{ label, head, stat, points:[string] }, right:{ ... }

import React from 'react';

function SlideVersus({
  overline = '两条路 · THE CHOICE',
  left = {
    label: '自己打理', head: '凭感觉进出，被情绪牵着走',
    stat: '+3.1%', points: ['追涨杀跌，错过反弹', '再平衡全凭记性', '隐性成本看不见', '占用大量精力'],
  },
  right = {
    label: '自主指数', head: '规则先行，纪律自动执行',
    stat: '+10.4%', points: ['情绪不参与决策', '到点自动再平衡', '成本一目了然', '你只管过好生活'],
  },
  pointCount = 4, splitBias = 52, showStat = true, showPoints = true,
}) {
  React.useEffect(() => { vsInjectStyle(); }, []);
  const split = Math.max(42, Math.min(60, splitBias));
  const pc = Math.max(1, Math.min(5, pointCount));
  const sideData = (d, key) => ({
    label: d.label, head: d.head, stat: d.stat,
    points: (d.points || []).slice(0, pc), hot: key === 'right',
  });
  const L = sideData(left, 'left'), Rt = sideData(right, 'right');

  return (
    <div className="vs-root" style={{ '--split': `${split}%` }}>
      <div className="vs-bg vs-bg-left" />
      <div className="vs-bg vs-bg-right" />

      <div className="vs-overline">{overline}</div>

      <div className="vs-grid">
        {[L, Rt].map((d, i) => (
          <div className={`vs-side vs-side-${i === 0 ? 'l' : 'r'} ${d.hot ? 'is-hot' : 'is-cool'}`} key={i}>
            <div className="vs-tag">{i === 0 ? 'A' : 'B'} · {d.label}</div>
            <h3 className="vs-headline">{d.head}</h3>
            <div className="vs-spacer" />
            {showStat && (
              <div className="vs-statwrap">
                <span className="vs-stat">{d.stat}</span>
                <span className="vs-stat-cap">三年累计回报</span>
              </div>
            )}
            {showPoints && (
              <ul className="vs-points">
                {d.points.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function vsInjectStyle() {
  if (document.getElementById('vs-style')) return;
  const s = document.createElement('style'); s.id = 'vs-style';
  s.textContent = `
  .vs-root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--ds-bg,#0d0e11);
    color:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);}
  .vs-bg{position:absolute;inset:0;}
  .vs-bg-left{background:color-mix(in srgb, var(--ds-ink,#f2f3f6) 4%, transparent);
    clip-path:polygon(0 0, calc(var(--split) + 4%) 0, calc(var(--split) - 4%) 100%, 0 100%);}
  .vs-bg-right{background:var(--ds-grad,linear-gradient(118deg,#1c2740,#5479e8));
    box-shadow:inset 0 0 120px -20px rgba(0,0,0,.4);
    clip-path:polygon(calc(var(--split) + 4%) 0, 100% 0, 100% 100%, calc(var(--split) - 4%) 100%);}
  .vs-overline{position:absolute;top:var(--pad-y,96px);left:var(--pad-x,120px);z-index:2;white-space:nowrap;
    font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .vs-grid{position:absolute;inset:0;z-index:1;display:grid;
    grid-template-columns:var(--split) 1fr;}
  .vs-side{display:flex;flex-direction:column;min-height:0;
    padding:calc(var(--pad-y,96px) + 70px) var(--pad-x,120px) var(--pad-y,96px);}
  .vs-side-l{padding-right:90px;}
  .vs-side-r{padding-left:96px;color:#fff;}
  .vs-side.is-cool{color:var(--ds-muted,rgba(242,243,246,.56));}
  .vs-side-r.is-cool{color:#fff;}
  .vs-tag{font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--ds-faint,rgba(242,243,246,.5));}
  .vs-side.is-hot .vs-tag{color:#f3e7d8;}
  .vs-headline{font-size:50px;font-weight:300;line-height:1.18;margin:22px 0 0;max-width:15ch;text-wrap:pretty;}
  .vs-spacer{flex:1;min-height:24px;}
  .vs-statwrap{display:flex;align-items:baseline;gap:18px;margin-bottom:30px;}
  .vs-stat{font-size:104px;font-weight:300;line-height:.9;font-variant-numeric:tabular-nums;letter-spacing:-.02em;}
  .vs-side.is-hot .vs-stat{color:#fff;}
  .vs-stat-cap{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .vs-side.is-hot .vs-stat-cap{color:rgba(246,241,234,.72);}
  .vs-points{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px;}
  .vs-points li{font-size:28px;font-weight:300;padding-left:30px;position:relative;line-height:1.3;}
  .vs-points li::before{content:"";position:absolute;left:0;top:.62em;width:12px;height:2px;
    background:var(--ds-faint,rgba(242,243,246,.4));}
  .vs-side.is-hot .vs-points li::before{content:"";top:.5em;width:13px;height:13px;border-radius:50%;
    background:none;box-shadow:inset 0 0 0 2px rgba(246,241,234,.85);}
  `;
  document.head.appendChild(s);
}

SlideVersus.META = {
  id: 'versus', title: '抉择双栏',
  defaults: { pointCount: 4, splitBias: 52, showStat: true, showPoints: true },
  controls: [
    { key: 'pointCount', type: 'slider', label: '每侧条目', default: 4, min: 1, max: 5, step: 1,
      description: '每一侧展示的要点条目数量。' },
    { key: 'splitBias', type: 'slider', label: '分割位置', default: 52, min: 42, max: 60, step: 1, unit: '%',
      description: '对角分割线距左边的位置。' },
    { key: 'showStat', type: 'toggle', label: '主数字', default: true,
      description: '每一侧的核心对比大数字。' },
    { key: 'showPoints', type: 'toggle', label: '要点列表', default: true,
      description: '每一侧的要点清单。' },
  ],
};

export { SlideVersus };
export const META = SlideVersus.META;
export default SlideVersus;
