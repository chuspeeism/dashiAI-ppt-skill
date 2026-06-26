// SlideBalance.jsx — 权衡天平 / a tilting balance scale weighing two sides.
// A pivoted beam with two hanging pans, tilted toward the heavier side, plus a
// column of weighed items under each pan and an optional verdict line. Built for
// trade-offs (风险 vs 回报, 主动 vs 被动). Distinct from SlideVersus (a hard
// two-column split), SlideCompareMatrix (a feature grid) and SlideDiverging (a
// signed bar chart). Standalone & migratable: depends only on React (imported).
// Token-driven, light/dark tone applies. CSS scoped `.bal-`.
//
// ── Props (canonical list in SlideBalance.META.controls) ──────────────────────
//   tilt         'left'|'level'|'right'  which way the beam leans         ('right')
//   itemCount    number 2..4   weighed items listed under each pan        (3)
//   showWeights  boolean       the big weight token inside each pan       (true)
//   showVerdict  boolean       the conclusion line beneath the scale      (true)
//
// Content props (authored at call-site):
//   overline, title, left:{ name, weight, items:[…] }, right:{…}, verdict

import React from 'react';

const DEFAULT_LEFT = {
  name: '主动择时',
  weight: '高成本',
  items: ['交易摩擦与税负', '依赖个人判断', '业绩难以复制', '择时窗口难把握'],
};
const DEFAULT_RIGHT = {
  name: '被动核心',
  weight: '高胜率',
  items: ['费率低、可解释', '纪律替代情绪', '长期跑赢多数主动', '配置透明可回溯'],
};

function SlideBalance({
  overline = '权衡 · WHAT TIPS THE SCALE',
  title = '为什么我们偏向被动核心',
  left = DEFAULT_LEFT,
  right = DEFAULT_RIGHT,
  verdict = '长期看，结构与纪律的重量，胜过对市场的短期押注。',
  tilt = 'right', itemCount = 3, showWeights = true, showVerdict = true,
}) {
  React.useEffect(() => { balInjectStyle(); }, []);
  const angle = tilt === 'left' ? -7 : tilt === 'right' ? 7 : 0;
  const leftItems = (left.items || []).concat(DEFAULT_LEFT.items.slice((left.items || []).length));
  const rightItems = (right.items || []).concat(DEFAULT_RIGHT.items.slice((right.items || []).length));
  const nL = Math.max(2, Math.min(4, leftItems.length, itemCount));
  const nR = Math.max(2, Math.min(4, rightItems.length, itemCount));
  const heavy = tilt === 'left' ? 'left' : tilt === 'right' ? 'right' : null;

  const Pan = (side, data, dropDelta) => (
    <div className={`bal-arm is-${side}`} style={{ transform: `translateY(${dropDelta}px)` }}>
      <span className="bal-hanger" style={{ transform: `rotate(${-angle}deg)` }} />
      <div className={`bal-pan ${heavy === side ? 'is-heavy' : ''}`} style={{ transform: `rotate(${-angle}deg)` }}>
        <span className="bal-pweight">{showWeights ? data.weight : data.name}</span>
        <span className="bal-pname">{data.name}</span>
      </div>
    </div>
  );

  // Vertical drop of each pan to fake the hang under a tilted beam.
  const drop = Math.sin((angle * Math.PI) / 180) * 360;

  return (
    <div className="bal-root">
      <div className="bal-head">
        <div className="bal-overline">{overline}</div>
        <h2 className="bal-title">{title}</h2>
      </div>

      <div className="bal-body">
        <div className="bal-scale">
          <div className="bal-beam" style={{ transform: `rotate(${angle}deg)` }}>
            <span className="bal-beam-bar" />
            {Pan('left', left, 0)}
            {Pan('right', right, 0)}
          </div>
          <span className="bal-pivot" />
          <span className="bal-base" />
        </div>

        <div className="bal-cols">
          <div className={`bal-col ${heavy === 'left' ? 'is-heavy' : ''}`}>
            <span className="bal-cname">{left.name}</span>
            <ul className="bal-list">
              {leftItems.slice(0, nL).map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
          <div className="bal-vs">VS</div>
          <div className={`bal-col is-right ${heavy === 'right' ? 'is-heavy' : ''}`}>
            <span className="bal-cname">{right.name}</span>
            <ul className="bal-list">
              {rightItems.slice(0, nR).map((it, i) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {showVerdict && (
        <div className="bal-verdict"><span className="bal-vrule" />{verdict}</div>
      )}
    </div>
  );
}

function balInjectStyle() {
  if (document.getElementById('bal-style')) return;
  const s = document.createElement('style'); s.id = 'bal-style';
  s.textContent = `
  .bal-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .bal-head{margin-bottom:6px;}
  .bal-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .bal-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.1;}
  .bal-body{flex:1;min-height:0;display:grid;grid-template-columns:560px 1fr;gap:80px;align-items:center;}
  /* scale */
  .bal-scale{position:relative;width:520px;height:430px;margin:0 auto;}
  .bal-beam{position:absolute;left:50%;top:96px;width:720px;margin-left:-360px;height:0;
    transition:transform .5s cubic-bezier(.4,1.2,.5,1);transform-origin:50% 50%;}
  .bal-beam-bar{position:absolute;left:0;top:-4px;width:100%;height:8px;border-radius:4px;
    background:linear-gradient(90deg,var(--ds-accent-2,#8fa8e6),var(--ds-accent,#5479e8));}
  .bal-beam::after{content:'';position:absolute;left:50%;top:-13px;width:22px;height:22px;margin-left:-11px;border-radius:50%;
    background:var(--ds-ink,#f2f3f6);}
  .bal-arm{position:absolute;top:0;display:flex;flex-direction:column;align-items:center;}
  .bal-arm.is-left{left:0;transform-origin:top center;}
  .bal-arm.is-right{right:0;transform-origin:top center;}
  .bal-hanger{width:2px;height:84px;background:var(--ds-line,rgba(242,243,246,.4));transform-origin:top center;}
  .bal-pan{width:184px;height:184px;border-radius:50%;margin-top:-2px;display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:6px;transform-origin:top center;
    background:var(--ds-card,rgba(255,255,255,.05));box-shadow:inset 0 0 0 1.5px var(--ds-line,rgba(242,243,246,.2));}
  .bal-pan.is-heavy{background:var(--ds-grad-soft,linear-gradient(120deg,rgba(51,64,92,.32),rgba(200,150,107,.32)));
    box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--ds-accent,#5479e8) 42%,transparent);}
  .bal-pweight{font-family:var(--font-mono);font-size:34px;font-weight:300;color:var(--ds-accent,#5479e8);}
  .bal-pan.is-heavy .bal-pweight{color:var(--ds-ink,#f2f3f6);}
  .bal-pname{font-size:24px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));}
  .bal-pivot{position:absolute;left:50%;top:96px;margin-left:-30px;width:60px;height:0;
    border-left:30px solid transparent;border-right:30px solid transparent;
    border-bottom:200px solid var(--ds-card,rgba(255,255,255,.06));}
  .bal-base{position:absolute;left:50%;bottom:8px;width:300px;margin-left:-150px;height:8px;border-radius:4px;
    background:var(--ds-line,rgba(242,243,246,.22));}
  /* columns */
  .bal-cols{display:grid;grid-template-columns:1fr auto 1fr;gap:36px;align-items:center;}
  .bal-col{display:flex;flex-direction:column;gap:18px;padding:30px 32px;border-radius:18px;min-width:0;
    background:var(--ds-card,rgba(255,255,255,.04));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.1));
    transition:box-shadow .3s ease,background .3s ease;}
  .bal-col.is-heavy{background:var(--ds-grad-soft,linear-gradient(120deg,rgba(51,64,92,.28),rgba(200,150,107,.28)));
    box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--ds-accent,#5479e8) 36%,transparent);}
  .bal-cname{font-size:34px;font-weight:300;}
  .bal-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;}
  .bal-list li{position:relative;padding-left:26px;font-size:25px;font-weight:300;line-height:1.4;
    color:var(--ds-muted,rgba(242,243,246,.7));text-wrap:pretty;}
  .bal-list li::before{content:'';position:absolute;left:0;top:14px;width:10px;height:10px;border-radius:50%;
    background:var(--ds-accent,#5479e8);opacity:.7;}
  .bal-vs{font-family:var(--font-mono);font-size:26px;letter-spacing:.12em;color:var(--ds-faint,rgba(242,243,246,.4));}
  .bal-verdict{display:flex;align-items:center;gap:26px;margin-top:30px;font-size:30px;font-weight:300;
    line-height:1.4;color:var(--ds-ink,#f2f3f6);text-wrap:pretty;}
  .bal-vrule{flex:0 0 auto;width:72px;height:2px;background:var(--ds-accent,#5479e8);}
  `;
  document.head.appendChild(s);
}

SlideBalance.META = {
  id: 'balance', title: '权衡天平',
  defaults: { tilt: 'right', itemCount: 3, showWeights: true, showVerdict: true },
  controls: [
    { key: 'tilt', type: 'radio', label: '天平倾向', default: 'right',
      options: [{ value: 'left', label: '左' }, { value: 'level', label: '平' }, { value: 'right', label: '右' }],
      description: '横梁倒向较重的一侧（左 / 持平 / 右）。' },
    { key: 'itemCount', type: 'slider', label: '每侧条目', default: 3, min: 2, max: 4, step: 1,
      description: '每侧列出的权衡要点条数。' },
    { key: 'showWeights', type: 'toggle', label: '托盘标记', default: true,
      description: '托盘内显示「重量」标签（关则显示名称）。' },
    { key: 'showVerdict', type: 'toggle', label: '结论句', default: true,
      description: '天平下方的一句结论。' },
  ],
};

export { SlideBalance };
export const META = SlideBalance.META;
export default SlideBalance;
