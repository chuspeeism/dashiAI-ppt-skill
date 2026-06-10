// SlidePyramid.jsx — 财富金字塔 / layered priority pyramid.
// Stacked trapezoid tiers (narrow apex → wide base) built with clip-path, each
// tier paired with a label / note / value on a connector line out to the side.
// Reads as a hierarchy of needs or a base-to-growth capital stack. Distinct from
// SlideFunnel (a shrinking conversion flow, top-wide), SlideLadder (stepped
// rungs) and SlideTreemap (area blocks). Standalone & migratable: depends only
// on React (imported). Token-driven, light/dark tone applies. All variation via
// props; copy authored in markup. CSS scoped `.pyr-`.
//
// ── Props (canonical list in SlidePyramid.META.controls) ──────────────────────
//   tierCount    number 3..5   how many pyramid tiers                     (4)
//   showValue    boolean       the value figure on each tier's callout    (true)
//   showNote     boolean       the supporting note line                   (true)
//   side         'right'|'left' which side the callouts extend to         ('right')
//   focus        boolean       emphasise one tier, dim the rest           (false)
//   focusIndex   number 1..5   which tier is emphasised (1-based, 1=apex)  (1)
//
// Content props (authored at call-site):
//   overline, title, tiers:[{ label, note, value }]  (index 0 = apex / top)

import React from 'react';

function SlidePyramid({
  overline = '财富金字塔 · BUILD FROM THE BASE',
  title = '先稳住地基，再追逐高度',
  tiers = [
    { label: '机会增长', note: '少量、可承受损失的高赔率敞口', value: '8%' },
    { label: '主动增值', note: '精选权益与另类，争取超额回报', value: '24%' },
    { label: '稳健配置', note: '分散的核心资产，承接组合波动', value: '40%' },
    { label: '安全垫', note: '现金 + 高等级债，覆盖 24 个月支出', value: '28%' },
  ],
  tierCount = 4, showValue = true, showNote = true, side = 'right', focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { pyrInjectStyle(); }, []);
  const n = Math.max(3, Math.min(tiers.length, tierCount));
  const used = tiers.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  // Warm apex → cool base, each tier a gradient sheen (was flat, less refined).
  const SEG = ['var(--ds-c5)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c2)', 'var(--ds-c1)'];
  const segColor = (i) => SEG[i % SEG.length];

  // Each tier's horizontal inset (apex narrow → base wide). Top inset of tier i.
  const insetTop = (i) => (1 - (i) / n) * 0.5;       // fraction of width cut from EACH side at the tier's top
  const insetBot = (i) => (1 - (i + 1) / n) * 0.5;   // …at the tier's bottom

  return (
    <div className={`pyr-root ${side === 'left' ? 'is-left' : 'is-right'}`}>
      <div className="pyr-head">
        <div className="pyr-overline">{overline}</div>
        <h2 className="pyr-title">{title}</h2>
      </div>

      <div className="pyr-body">
        <div className="pyr-stack">
          {used.map((t, i) => {
            const hot = fIdx < 0 || fIdx === i;
            const topPct = insetTop(i) * 100, botPct = insetBot(i) * 100;
            const wBot = 1 - 2 * insetBot(i);
            const clip = `polygon(${topPct}% 0, ${100 - topPct}% 0, ${100 - botPct}% 100%, ${botPct}% 100%)`;
            const isAccent = fIdx === i;
            return (
              <div className={`pyr-tier ${hot ? '' : 'is-dim'}`} key={i} style={{ flex: 1 }}>
                <div className="pyr-shape" style={{
                  clipPath: clip, WebkitClipPath: clip,
                  background: `linear-gradient(160deg, color-mix(in srgb, ${segColor(i)} 58%, #fff) 0%, ${segColor(i)} 100%)`,
                  opacity: hot ? 1 : 0.4,
                }}>
                  {wBot >= 0.42 && <span className="pyr-in">{t.label}</span>}
                </div>
                <span className="pyr-tick" />
                <div className="pyr-call">
                  <span className="pyr-clabel">{t.label}</span>
                  {showNote && <span className="pyr-cnote">{t.note}</span>}
                  {showValue && <span className="pyr-cval">{t.value}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function pyrInjectStyle() {
  if (document.getElementById('pyr-style')) return;
  const s = document.createElement('style'); s.id = 'pyr-style';
  s.textContent = `
  .pyr-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .pyr-head{margin-bottom:30px;}
  .pyr-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .pyr-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.08;}
  .pyr-body{flex:1;min-height:0;display:flex;align-items:stretch;}
  .pyr-stack{position:relative;width:760px;display:flex;flex-direction:column;gap:8px;padding:8px 0;}
  .pyr-root.is-left .pyr-stack{margin-left:auto;}
  .pyr-tier{position:relative;display:flex;align-items:center;transition:opacity .3s ease;}
  .pyr-tier.is-dim{opacity:.5;}
  .pyr-shape{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;
    transition:opacity .3s ease,background .3s ease;}
  .pyr-in{font-size:30px;font-weight:400;letter-spacing:.02em;color:#fff;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:88%;text-align:center;}
  /* callout: a tick from the tier's edge out to a text block on the chosen side */
  .pyr-tick{position:absolute;top:50%;width:90px;height:1.5px;background:var(--ds-line,rgba(242,243,246,.3));}
  .pyr-root.is-right .pyr-tick{left:100%;}
  .pyr-root.is-left .pyr-tick{right:100%;}
  .pyr-call{position:absolute;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px;width:560px;}
  .pyr-root.is-right .pyr-call{left:calc(100% + 112px);}
  .pyr-root.is-left .pyr-call{right:calc(100% + 112px);text-align:right;}
  .pyr-clabel{font-size:36px;font-weight:300;line-height:1.1;}
  .pyr-cnote{font-size:25px;font-weight:300;line-height:1.4;color:var(--ds-muted,rgba(242,243,246,.62));text-wrap:pretty;}
  .pyr-cval{font-family:var(--font-mono);font-size:40px;font-weight:300;font-variant-numeric:tabular-nums;
    color:var(--ds-accent,#5479e8);margin-top:4px;}
  `;
  document.head.appendChild(s);
}

SlidePyramid.META = {
  id: 'pyramid', title: '财富金字塔',
  defaults: { tierCount: 4, showValue: true, showNote: true, side: 'right', focus: false, focusIndex: 1 },
  controls: [
    { key: 'tierCount', type: 'slider', label: '层级数量', default: 4, min: 3, max: 5, step: 1,
      description: '金字塔的层数（顶=机会、底=安全垫）。' },
    { key: 'showValue', type: 'toggle', label: '占比数值', default: true,
      description: '每层引出标注上的占比 / 数值。' },
    { key: 'showNote', type: 'toggle', label: '说明文字', default: true,
      description: '每层的一句说明。' },
    { key: 'side', type: 'radio', label: '标注方向', default: 'right',
      options: [{ value: 'right', label: '右侧' }, { value: 'left', label: '左侧' }],
      description: '引线与文字标注延伸的方向。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一层，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几层', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效，1 = 顶层。' },
  ],
};

export { SlidePyramid };
export const META = SlidePyramid.META;
export default SlidePyramid;
