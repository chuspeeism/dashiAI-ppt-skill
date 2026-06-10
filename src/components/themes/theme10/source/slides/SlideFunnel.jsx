// SlideFunnel.jsx — 转化漏斗 / narrowing stages.
// Centered trapezoid stages stacked top-to-bottom, each narrower than the last,
// with a value, a share-of-top and a step conversion. Distinct from SlideSteps
// (equal numbered cards), SlideJourney (progress track) and the deleted pyramid
// (composition tiers): a funnel encodes drop-off between stages. Standalone &
// migratable: depends only on React (imported). Token-driven. CSS scoped `.fnl-`.
//
// ── Props (canonical list in SlideFunnel.META.controls) ───────────────────────
//   stageCount   number 3..6   how many funnel stages                      (4)
//   showValues   boolean       the absolute value per stage                (true)
//   showStepRate boolean       the step-to-step conversion %               (true)
//   showShare    boolean       the share-of-top %                          (false)
//   focus        boolean       emphasise one stage, dim the rest           (false)
//   focusIndex   number 1..6   which stage is emphasised (1-based)         (1)
//
// Content props (authored at call-site):
//   overline, title, stages:[{ label, value(number), display, note }]

import React from 'react';

function SlideFunnel({
  overline = '资金转化 · INCOME → WEALTH', title = '每一块钱，怎么变成资产',
  stages = [
    { label: '税前收入', value: 100, display: '¥100', note: '每月到手前' },
    { label: '可支配', value: 68, display: '¥68', note: '税与社保之后' },
    { label: '结余储蓄', value: 34, display: '¥34', note: '开支之后留下' },
    { label: '投入指数', value: 30, display: '¥30', note: '自动定投' },
    { label: '复利增值', value: 41, display: '¥41', note: '一年后' },
  ],
  stageCount = 4, showValues = true, showStepRate = true, showShare = false, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { fnlInjectStyle(); }, []);
  const n = Math.max(3, Math.min(stages.length, stageCount));
  const used = stages.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const top = used[0].value || 1;
  const maxV = Math.max(...used.map((s) => s.value)) || 1;
  const wOf = (v) => 30 + (v / maxV) * 70; // 30%..100% width
  const SEG = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  return (
    <div className="fnl-root">
      <div className="fnl-head">
        <div className="fnl-overline">{overline}</div>
        <h2 className="fnl-title">{title}</h2>
      </div>

      <div className="fnl-stage">
        <div className="fnl-stack">
          {used.map((s, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const wTop = wOf(s.value);
            const wBot = wOf(i < n - 1 ? used[i + 1].value : s.value * 0.92);
            const step = i > 0 ? Math.round((s.value / used[i - 1].value) * 100) : 100;
            const grew = i > 0 && s.value > used[i - 1].value;
            return (
              <div className={`fnl-seg ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <div className="fnl-bar"
                     style={{ clipPath: `polygon(${(100 - wTop) / 2}% 0, ${100 - (100 - wTop) / 2}% 0, ${100 - (100 - wBot) / 2}% 100%, ${(100 - wBot) / 2}% 100%)`,
                       background: `color-mix(in srgb, ${SEG[i % SEG.length]} ${84 - i * 5}%, transparent)` }}>
                  <div className="fnl-bar-in">
                    <span className="fnl-label">{s.label}</span>
                    {showValues && <span className="fnl-value">{s.display}</span>}
                  </div>
                </div>
                <div className="fnl-side">
                  <span className="fnl-note">{s.note}</span>
                  {showShare && <span className="fnl-share">占起点 {Math.round((s.value / top) * 100)}%</span>}
                  {showStepRate && i > 0 && (
                    <span className={`fnl-step ${grew ? 'up' : ''}`}>{grew ? '↑' : '↓'} {step}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function fnlInjectStyle() {
  if (document.getElementById('fnl-style')) return;
  const s = document.createElement('style'); s.id = 'fnl-style';
  s.textContent = `
  .fnl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .fnl-head{margin-bottom:26px;}
  .fnl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .fnl-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .fnl-stage{flex:1;min-height:0;display:flex;align-items:center;}
  .fnl-stack{width:100%;display:flex;flex-direction:column;gap:6px;}
  .fnl-seg{position:relative;display:flex;align-items:center;transition:opacity .25s;}
  .fnl-seg.is-dim{opacity:.34;}
  .fnl-bar{position:relative;width:74%;height:96px;display:flex;align-items:center;justify-content:center;}
  .fnl-seg.is-focus .fnl-bar{filter:brightness(1.18);}
  .fnl-bar-in{display:flex;align-items:baseline;gap:20px;}
  .fnl-label{font-size:32px;font-weight:300;color:#fff;}
  .fnl-value{font-size:40px;font-weight:400;font-variant-numeric:tabular-nums;color:#fff;letter-spacing:-.01em;}
  .fnl-side{flex:1;padding-left:44px;display:flex;flex-direction:column;gap:5px;}
  .fnl-note{font-size:26px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.66));}
  .fnl-share{font-family:var(--font-mono);font-size:24px;color:var(--ds-faint,rgba(242,243,246,.5));}
  .fnl-step{font-family:var(--font-mono);font-size:25px;color:var(--ds-faint,rgba(242,243,246,.5));letter-spacing:.03em;}
  .fnl-step.up{color:var(--ds-c3);}
  `;
  document.head.appendChild(s);
}

SlideFunnel.META = {
  id: 'funnel', title: '转化漏斗',
  defaults: { stageCount: 4, showValues: true, showStepRate: true, showShare: false, focus: false, focusIndex: 1 },
  controls: [
    { key: 'stageCount', type: 'slider', label: '阶段数量', default: 4, min: 3, max: 6, step: 1,
      description: '漏斗的阶段数量。' },
    { key: 'showValues', type: 'toggle', label: '阶段数值', default: true,
      description: '每段漏斗内的金额数值。' },
    { key: 'showStepRate', type: 'toggle', label: '环节转化', default: true,
      description: '相邻阶段之间的转化 / 增减百分比。' },
    { key: 'showShare', type: 'toggle', label: '占起点比', default: false,
      description: '相对第一阶段的占比。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一阶段，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideFunnel };
export const META = SlideFunnel.META;
export default SlideFunnel;
