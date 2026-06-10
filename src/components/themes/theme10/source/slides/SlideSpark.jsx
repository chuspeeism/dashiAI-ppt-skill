// SlideSpark.jsx — 持仓小图集 / small-multiples sparkline grid.
// A grid of compact cards, each a single holding with a label, current figure,
// a delta chip and a tiny trend sparkline. Small multiples let many series be
// scanned at once — distinct from one big chart, the dashboard (mixed widgets)
// or a table. Standalone & migratable: depends only on React (imported).
// Token-driven. CSS scoped under `.spk-`.
//
// ── Props (canonical list in SlideSpark.META.controls) ────────────────────────
//   cardCount   number 3..8        how many holding cards                  (6)
//   trendStyle  'area'|'line'      sparkline rendering                     ('area')
//   showDelta   boolean            the delta chip on each card             (true)
//   showAxis    boolean            a faint zero baseline in each spark     (true)
//   focus       boolean            emphasise one card, dim the rest        (false)
//   focusIndex  number 1..8        which card is emphasised (1-based)      (1)
//
// Content props (authored at call-site):
//   overline, title, cards:[{ label, value, delta, up(bool), data:[number] }]

import React from 'react';

function SlideSpark({
  overline = '持仓近况 · BY HOLDING', title = '每个仓位的近况，一眼看完',
  cards = [
    { label: '全球股票', value: '+14.2%', delta: '近 90 天', up: true, data: [3, 4, 3.6, 5, 6.2, 5.8, 7, 8.4] },
    { label: '固定收益', value: '+4.1%', delta: '近 90 天', up: true, data: [4, 4.2, 4.1, 4.5, 4.4, 4.8, 4.9, 5.1] },
    { label: '另类对冲', value: '+6.8%', delta: '低相关', up: true, data: [2, 3, 2.6, 3.4, 3.1, 4, 4.6, 5.2] },
    { label: '实物资产', value: '+2.3%', delta: '抗通胀', up: true, data: [5, 4.7, 4.9, 5.2, 5, 5.4, 5.3, 5.7] },
    { label: '现金等价', value: '+0.9%', delta: '流动性', up: true, data: [1, 1.1, 1.05, 1.2, 1.15, 1.3, 1.28, 1.4] },
    { label: '战术机会', value: '-1.6%', delta: '择机', up: false, data: [6, 5.4, 5.8, 5, 5.2, 4.4, 4.8, 4.2] },
    { label: '海外成长', value: '+9.4%', delta: '分散地域', up: true, data: [2, 2.6, 3, 3.8, 4.2, 5, 5.6, 6.5] },
    { label: '信用债券', value: '+3.7%', delta: '票息为主', up: true, data: [3, 3.2, 3.1, 3.5, 3.6, 3.9, 4.1, 4.3] },
  ],
  cardCount = 6, trendStyle = 'area', showDelta = true, showAxis = false, focus = true, focusIndex = 1,
}) {
  React.useEffect(() => { spkInjectStyle(); }, []);
  const n = Math.max(3, Math.min(cards.length, cardCount));
  const used = cards.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const cols = n <= 3 ? n : n <= 6 ? 3 : 4;

  const sparkPath = (data) => {
    const w = 100, h = 40;
    const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
    const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / span) * (h - 6) - 3]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const area = `${line} L${w},${h} L0,${h} Z`;
    return { line, area, baseY: h - 3, pts };
  };
  const HUE = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)', 'var(--ds-c1)', 'var(--ds-c3)'];

  return (
    <div className="spk-root">
      <div className="spk-head">
        <div className="spk-overline">{overline}</div>
        <h2 className="spk-title">{title}</h2>
      </div>

      <div className="spk-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {used.map((c, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const sp = sparkPath(c.data);
          return (
            <div className={`spk-card ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''} ${c.up ? 'is-up' : 'is-down'}`} key={i}>
              <div className="spk-top">
                <span className="spk-label">{c.label}</span>
                {showDelta && <span className="spk-chip">{c.delta}</span>}
              </div>
              <span className="spk-val">{c.value}</span>
              <svg className="spk-spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                {showAxis && <line x1="0" y1={sp.baseY} x2="100" y2={sp.baseY} className="spk-axis" />}
                {trendStyle === 'area' && <path d={sp.area} className="spk-area" style={{ fill: `color-mix(in srgb, ${HUE[i % HUE.length]} 18%, transparent)` }} />}
                {trendStyle === 'bars' && sp.pts.map((p, k) => {
                  const slot = 100 / c.data.length;
                  return <rect key={k} x={k * slot + slot * 0.2} y={p[1]} width={slot * 0.6} height={Math.max(0.5, sp.baseY - p[1])} rx="1" style={{ fill: HUE[i % HUE.length] }} />;
                })}
                {trendStyle !== 'bars' && <path d={sp.line} className="spk-line" style={{ stroke: HUE[i % HUE.length] }} />}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function spkInjectStyle() {
  if (document.getElementById('spk-style')) return;
  const s = document.createElement('style'); s.id = 'spk-style';
  s.textContent = `
  .spk-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .spk-head{margin-bottom:34px;}
  .spk-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .spk-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .spk-grid{flex:1;min-height:0;display:grid;gap:26px;}
  .spk-card{display:flex;flex-direction:column;min-height:0;padding:30px 32px 0;border-radius:16px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));
    transition:opacity .25s,box-shadow .25s;overflow:hidden;}
  .spk-card.is-dim{opacity:.36;}
  .spk-card.is-focus{box-shadow:inset 0 0 0 1.5px var(--ds-accent,#6f9bd8);}
  .spk-top{display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .spk-label{font-size:28px;font-weight:300;}
  .spk-chip{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.5));
    padding:4px 12px;border-radius:999px;box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.18));white-space:nowrap;}
  .spk-val{font-size:46px;font-weight:300;font-variant-numeric:tabular-nums;letter-spacing:-.01em;margin:16px 0 4px;line-height:1;}
  .spk-card.is-up .spk-val{color:var(--ds-ink,#f2f3f6);}
  .spk-card.is-down .spk-val{color:var(--ds-muted,rgba(242,243,246,.55));}
  .spk-spark{margin-top:auto;margin-left:-32px;margin-right:-32px;width:calc(100% + 64px);height:78px;display:block;}
  .spk-axis{stroke:var(--ds-line,rgba(242,243,246,.16));stroke-width:.5;vector-effect:non-scaling-stroke;}
  .spk-line{fill:none;stroke-width:2;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;}
  .spk-card.is-up .spk-line{stroke:var(--ds-accent,#6f9bd8);}
  .spk-card.is-down .spk-line{stroke:var(--ds-faint,rgba(242,243,246,.45));}
  .spk-area{stroke:none;}
  .spk-card.is-up .spk-area{fill:color-mix(in srgb, var(--ds-accent,#6f9bd8) 16%, transparent);}
  .spk-card.is-down .spk-area{fill:color-mix(in srgb, var(--ds-ink,#f2f3f6) 6%, transparent);}
  `;
  document.head.appendChild(s);
}

SlideSpark.META = {
  id: 'spark', title: '持仓小图集',
  defaults: { cardCount: 6, trendStyle: 'area', showDelta: true, showAxis: false, focus: true, focusIndex: 1 },
  controls: [
    { key: 'cardCount', type: 'slider', label: '卡片数量', default: 6, min: 3, max: 8, step: 1,
      description: '展示的持仓小卡数量（自动分列）。' },
    { key: 'trendStyle', type: 'radio', label: '走势样式', default: 'area',
      options: [{ value: 'area', label: '面积' }, { value: 'line', label: '折线' }, { value: 'bars', label: '柱状' }],
      description: '迷你走势图是填充面积还是纯折线。' },
    { key: 'showDelta', type: 'toggle', label: '角标', default: true,
      description: '每张卡右上角的说明角标。' },
    { key: 'showAxis', type: 'toggle', label: '基线', default: false,
      description: '迷你走势图的浅色基线。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一张卡片，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideSpark };
export const META = SlideSpark.META;
export default SlideSpark;
