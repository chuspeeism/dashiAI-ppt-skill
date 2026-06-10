// Slide02Metrics.jsx — KPI / dashboard slide.
// Standalone & migratable: depends on React + DeckChart (both global). Variation
// via props only; copy text is authored in markup. CSS scoped under `.mx-`.
//
// ── Props (canonical list in Slide02Metrics.META.controls) ─────────────────────
//   chartType   'area'|'bars'|'line'   chart rendering style                ('area')
//   cardCount   number 0..4            how many metric cards to show         (3)
//   focus       boolean               emphasise one card, dim the rest       (false)
//   focusIndex  number 1..4           which card is emphasised (1-based)      (1)
//   showAxis    boolean               show the chart's bottom axis ticks      (true)

import React from 'react';
import { DeckChart } from '../components/DeckChart.jsx';

const MX_CARDS = [
  { label: '周定投', value: '¥500' },
  { label: '年初至今', value: '+10%' },
  { label: '外部账户', value: '7' },
  { label: '本月流入', value: '¥12,400' },
];

function Slide02Metrics({ chartType = 'bars', cardCount = 3, focus = false, focusIndex = 1, showAxis = true }) {
  React.useEffect(() => { mxInjectStyle(); }, []);
  const n = Math.max(0, Math.min(4, cardCount));
  const cards = MX_CARDS.slice(0, n);
  const fIdx = Math.max(0, Math.min(n - 1, focusIndex - 1));

  return (
    <div className="mx-root">
      <div className="mx-top">
        <div className="mx-hero">
          <div className="mx-label">总净值 · TOTAL NET WORTH</div>
          <div className="mx-num">¥1,250,096<sup className="mx-num-sup">.05</sup></div>
          <div className="mx-delta">▲ 10.0%　·　年初至今跑赢基准 4.2%</div>
        </div>
        <div className="mx-chartwrap">
          <DeckChart type={chartType} showAxis={showAxis}
                     axisLabels={['TODAY', '2035', '2045', '2055']} height={400} />
        </div>
      </div>

      {n > 0 && (
        <div className="mx-cards" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {cards.map((c, i) => {
            const dim = focus && i !== fIdx;
            const hot = focus && i === fIdx;
            return (
              <div key={i} className={`mx-card ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}>
                <span className="mx-card-label">{c.label}</span>
                <span className="mx-card-value">{c.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function mxInjectStyle() {
  if (document.getElementById('mx-style')) return;
  const s = document.createElement('style');
  s.id = 'mx-style';
  s.textContent = `
  .mx-root{position:relative;width:100%;height:100%;
    background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;font-family:var(--font-sans);}
  .mx-top{flex:1;display:flex;align-items:center;gap:96px;min-height:0;}
  .mx-hero{flex:0 0 38%;display:flex;flex-direction:column;}
  .mx-label{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;
    color:var(--ds-faint,rgba(242,243,246,.42));}
  .mx-num{font-size:124px;line-height:1.02;font-weight:300;letter-spacing:-.01em;margin-top:26px;
    font-variant-numeric:tabular-nums;white-space:nowrap;}
  .mx-num-sup{font-size:40px;font-weight:400;color:var(--ds-faint,rgba(242,243,246,.5));
    vertical-align:super;margin-left:6px;}
  .mx-delta{font-family:var(--font-mono);font-size:26px;letter-spacing:.04em;margin-top:32px;
    color:var(--ds-accent,#6f9bd8);}
  .mx-chartwrap{flex:1;color:var(--ds-ink,#f2f3f6);min-width:0;}
  .mx-cards{display:grid;gap:24px;margin-top:64px;}
  .mx-card{display:flex;flex-direction:column;justify-content:space-between;gap:40px;
    min-height:188px;padding:34px 36px;border-radius:20px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));
    transition:opacity .25s ease, background .25s ease, color .25s ease;}
  .mx-card-label{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--ds-muted,rgba(242,243,246,.6));}
  .mx-card-value{font-size:60px;font-weight:300;font-variant-numeric:tabular-nums;}
  .mx-card.is-focus{background:var(--ds-panel,#f3f3f0);color:var(--ds-panel-ink,#101216);box-shadow:none;}
  .mx-card.is-focus .mx-card-label{color:rgba(16,18,22,.55);}
  .mx-card.is-dim{opacity:.38;}
  `;
  document.head.appendChild(s);
}

Slide02Metrics.META = {
  id: 'metrics',
  title: '核心数据',
  defaults: { chartType: 'bars', cardCount: 3, focus: false, focusIndex: 1, showAxis: true },
  controls: [
    { key: 'chartType', type: 'radio', label: '图表类型', default: 'bars',
      options: [{ value: 'area', label: '面积' }, { value: 'bars', label: '柱状' }, { value: 'line', label: '折线' }],
      description: '主图表的呈现样式。' },
    { key: 'cardCount', type: 'slider', label: '卡片数量', default: 3, min: 0, max: 4, step: 1,
      description: '底部指标卡的数量（0 隐藏整行）。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一张卡片，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 4, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的卡片序号。' },
    { key: 'showAxis', type: 'toggle', label: '坐标轴', default: true,
      description: '图表底部的时间刻度标签。' },
  ],
};

export { Slide02Metrics };
export const META = Slide02Metrics.META;
export default Slide02Metrics;
