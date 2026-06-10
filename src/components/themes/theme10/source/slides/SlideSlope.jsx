// SlideSlope.jsx — 排名变化 / before→after slope chart.
// Two vertical axes (a "before" and an "after" period); each item is a line
// connecting its value on the left to its value on the right, so rising and
// falling trajectories read instantly. Distinct from SlideCurve (one series over
// many x), SlideDiverging (signed bars) and SlideRange (spans): this compares
// TWO snapshots across many items. Standalone & migratable: depends only on
// React (imported). Token-driven. CSS scoped under `.slp-`.
//
// ── Props (canonical list in SlideSlope.META.controls) ────────────────────────
//   itemCount   number 3..7   how many items (lines)                       (5)
//   showValues  boolean       the value at each endpoint                   (true)
//   showDelta   boolean       the change chip on the right label           (true)
//   showDots    boolean       endpoint dots                               (true)
//   focus       boolean       emphasise one line, dim the rest             (false)
//   focusIndex  number 1..7   which line is emphasised (1-based)           (1)
//
// Content props (authored at call-site):
//   overline, title, leftLabel, rightLabel, unit,
//   items:[{ label, from(number), to(number) }]

import React from 'react';

function SlideSlope({
  overline = '此消彼长 · THEN → NOW', title = '五年里，权重怎样换防',
  leftLabel = '五年前', rightLabel = '今天', unit = '%',
  items = [
    { label: '全球股票', from: 30, to: 40 },
    { label: '固定收益', from: 38, to: 24 },
    { label: '另类对冲', from: 8, to: 18 },
    { label: '实物资产', from: 20, to: 10 },
    { label: '现金等价', from: 14, to: 4 },
    { label: '海外成长', from: 5, to: 14 },
    { label: '私募股权', from: 2, to: 8 },
  ],
  itemCount = 5, showValues = true, showDelta = true, showDots = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { slpInjectStyle(); }, []);
  const n = Math.max(3, Math.min(items.length, itemCount));
  const used = items.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const all = used.flatMap((d) => [d.from, d.to]);
  const min = Math.min(...all), max = Math.max(...all), span = (max - min) || 1;
  const H = 560, padT = 58, padB = 30;
  const Y = (v) => padT + (1 - (v - min) / span) * (H - padT - padB);
  const W = 1440, lx = 250, rx = W - 250;

  return (
    <div className="slp-root">
      <div className="slp-head">
        <div className="slp-overline">{overline}</div>
        <h2 className="slp-title">{title}</h2>
      </div>

      <div className="slp-stage">
        <svg className="slp-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="slpUp" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="color-mix(in srgb,var(--ds-c3) 50%,#fff)" />
              <stop offset="100%" stopColor="var(--ds-c3)" />
            </linearGradient>
            <linearGradient id="slpDown" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="color-mix(in srgb,var(--ds-c5) 50%,#fff)" />
              <stop offset="100%" stopColor="var(--ds-c5)" />
            </linearGradient>
          </defs>
          <text x={lx} y={20} className="slp-axl" textAnchor="middle">{leftLabel}</text>
          <text x={rx} y={20} className="slp-axr" textAnchor="middle">{rightLabel}</text>
          <line x1={lx} y1={padT - 14} x2={lx} y2={H - padB + 14} className="slp-axis" />
          <line x1={rx} y1={padT - 14} x2={rx} y2={H - padB + 14} className="slp-axis" />
          {used.map((d, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const rising = d.to >= d.from;
            const y1 = Y(d.from), y2 = Y(d.to);
            return (
              <g key={i} className={`slp-g ${rising ? 'is-up' : 'is-down'} ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}>
                <line x1={lx} y1={y1} x2={rx} y2={y2} className="slp-line" />
                {showDots && <circle cx={lx} cy={y1} r="6" className="slp-dot" />}
                {showDots && <circle cx={rx} cy={y2} r="6" className="slp-dot" />}
                <text x={lx - 22} y={y1 + 9} className="slp-lab slp-lab-l" textAnchor="end">
                  {d.label}{showValues ? ` · ${d.from}${unit}` : ''}
                </text>
                <text x={rx + 22} y={y2 + 9} className="slp-lab slp-lab-r" textAnchor="start">
                  {showValues ? `${d.to}${unit} · ` : ''}{d.label}
                </text>
                {showDelta && (() => {
                  const dd = d.to - d.from; if (dd === 0) return null;
                  return <text x={rx + 22} y={y2 + 38} className={`slp-delta ${dd > 0 ? 'up' : 'down'}`} textAnchor="start">
                    {dd > 0 ? '▲ +' : '▼ '}{dd}{unit}</text>;
                })()}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function slpInjectStyle() {
  if (document.getElementById('slp-style')) return;
  const s = document.createElement('style'); s.id = 'slp-style';
  s.textContent = `
  .slp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .slp-head{margin-bottom:64px;}
  .slp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .slp-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .slp-stage{position:relative;flex:1;min-height:0;}
  .slp-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
  .slp-axis{stroke:var(--ds-line,rgba(242,243,246,.16));stroke-width:1.5;}
  .slp-axl,.slp-axr{fill:var(--ds-faint,rgba(242,243,246,.55));font-family:var(--font-mono);font-size:26px;letter-spacing:.06em;}
  .slp-g{transition:opacity .25s;}
  .slp-g.is-dim{opacity:.28;}
  .slp-line{stroke:url(#slpUp);stroke-opacity:.7;stroke-width:2.6;vector-effect:non-scaling-stroke;}
  .slp-g.is-up .slp-line{stroke:url(#slpUp);}
  .slp-g.is-down .slp-line{stroke:url(#slpDown);}
  .slp-g.is-focus .slp-line{stroke-opacity:1;stroke-width:3.6;}
  .slp-dot{fill:var(--ds-c3);}
  .slp-g.is-up .slp-dot{fill:var(--ds-c3);}
  .slp-g.is-down .slp-dot{fill:var(--ds-c5);}
  .slp-lab{fill:var(--ds-ink,#f2f3f6);font-family:var(--font-sans);font-size:27px;font-weight:300;}
  .slp-g.is-focus .slp-lab{font-weight:400;}
  .slp-delta{font-family:var(--font-mono);font-size:24px;}
  .slp-delta.up{fill:var(--ds-c3);}
  .slp-delta.down{fill:var(--ds-c5);}
  `;
  document.head.appendChild(s);
}

SlideSlope.META = {
  id: 'slope', title: '排名变化',
  defaults: { itemCount: 5, showValues: true, showDelta: true, showDots: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'itemCount', type: 'slider', label: '条目数量', default: 5, min: 3, max: 7, step: 1,
      description: '对比的项目（连线）数量。' },
    { key: 'showValues', type: 'toggle', label: '端点数值', default: true,
      description: '每条线两端的数值。' },
    { key: 'showDelta', type: 'toggle', label: '变化量', default: true,
      description: '右侧的升降变化标签。' },
    { key: 'showDots', type: 'toggle', label: '端点圆点', default: true,
      description: '两端轴上的圆点。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一条线，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideSlope };
export const META = SlideSlope.META;
export default SlideSlope;
