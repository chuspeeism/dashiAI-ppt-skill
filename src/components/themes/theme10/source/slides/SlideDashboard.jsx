// SlideDashboard.jsx — multi-chart "quant dashboard": one hero chart + KPI tiles
// each carrying its own sparkline. Standalone & migratable: depends on React +
// DeckChart + DeckHead (globals; DeckChart renders inline SVG). Token-driven.
// All variation via props; copy authored in markup. CSS scoped under `.dsh-`.
//
// ── Props (canonical list in SlideDashboard.META.controls) ────────────────────
//   chartType   'area'|'bars'|'line'   rendering style for every chart      ('area')
//   tileCount   number 2..6            how many KPI tiles                    (4)
//   showHero    boolean               the large hero chart panel            (true)
//   focus       boolean               emphasise one tile, dim the rest      (false)
//   focusIndex  number 1..6           which tile is emphasised (1-based)    (1)
//
// Content props (authored at call-site):
//   overline, title, hero {label,value,delta,data}, tiles [{label,value,delta,data}]

import React from 'react';
import { DeckChart } from '../components/DeckChart.jsx';

const DSH_SPARK = (seed, n = 24) => Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1);
  return 30 + Math.pow(t, 1.6) * 60 + Math.sin(i * 0.9 + seed) * (6 + seed);
});

function SlideDashboard({
  overline = '组合监控 · LIVE', title = '一屏看懂全局',
  hero = { label: '总净值走势 · TOTAL', value: '¥1.25M', delta: '+10.0% YTD', data: undefined },
  tiles = [
    { label: '年化回报', value: '12.4%', delta: '近五年', data: DSH_SPARK(1) },
    { label: '夏普比率', value: '0.71', delta: '同类前 10%', data: DSH_SPARK(3) },
    { label: '最大回撤', value: '-8.3%', delta: '优于基准', data: DSH_SPARK(2) },
    { label: '税务效率', value: '98%', delta: '损失收割', data: DSH_SPARK(5) },
    { label: '再平衡', value: '24/7', delta: '自动触发', data: DSH_SPARK(4) },
    { label: '全包费率', value: '0.34%', delta: '行业最低', data: DSH_SPARK(6) },
  ],
  chartType = 'bars', tileCount = 4, showHero = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { dshInjectStyle(); }, []);
  const n = Math.max(2, Math.min(tiles.length, tileCount));
  const cells = tiles.slice(0, n);
  // With the hero panel, tiles sit in a single KPI strip; without it they fill
  // the slide as a multi-row grid.
  const cols = showHero ? n : (n <= 3 ? n : n === 4 ? 2 : 3);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const SPARK = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];

  return (
    <div className="dsh-root">
      <div className="dsh-head">
        <div className="dsh-overline">{overline}</div>
        <h2 className="dsh-title">{title}</h2>
      </div>

      <div className="dsh-grid">
        {showHero && (
          <div className="dsh-hero">
            <div className="dsh-hero-top">
              <span className="dsh-hero-label">{hero.label}</span>
              <div className="dsh-hero-figs">
                <span className="dsh-hero-value">{hero.value}</span>
                <span className="dsh-hero-delta">{hero.delta}</span>
              </div>
            </div>
            <div className="dsh-hero-chart">
              {DeckChart && <DeckChart type={chartType} data={hero.data} accent="var(--ds-c1)" showAxis={false} height={200} />}
            </div>
          </div>
        )}

        <div className={`dsh-tiles ${showHero ? 'is-strip' : 'is-fill'}`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {cells.map((c, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            return (
              <div className={`dsh-tile ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
                <span className="dsh-tile-label">{c.label}</span>
                <span className="dsh-tile-value">{c.value}</span>
                <div className="dsh-tile-spark">
                  {DeckChart && <DeckChart type={chartType} data={c.data || DSH_SPARK(i + 1)} accent={SPARK[i % SPARK.length]} showAxis={false} height={68} />}
                </div>
                <span className="dsh-tile-delta">{c.delta}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function dshInjectStyle() {
  if (document.getElementById('dsh-style')) return;
  const s = document.createElement('style'); s.id = 'dsh-style';
  s.textContent = `
  .dsh-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .dsh-head{margin-bottom:40px;}
  .dsh-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .dsh-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .dsh-grid{flex:1;display:flex;flex-direction:column;gap:28px;min-height:0;justify-content:center;}
  .dsh-hero{flex:0 0 auto;display:flex;flex-direction:column;gap:16px;padding:32px 40px;border-radius:22px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));
    color:var(--ds-ink,#f2f3f6);}
  .dsh-hero-top{display:flex;flex-direction:column;gap:14px;}
  .dsh-hero-label{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;text-transform:uppercase;color:var(--ds-faint,rgba(242,243,246,.45));white-space:nowrap;}
  .dsh-hero-figs{display:flex;align-items:baseline;gap:28px;}
  .dsh-hero-value{font-size:64px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;}
  .dsh-hero-delta{font-family:var(--font-mono);font-size:26px;letter-spacing:.04em;color:var(--ds-c1);margin-left:auto;}
  .dsh-hero-chart{flex:1;min-height:0;}
  .dsh-tiles{display:grid;gap:24px;min-height:0;}
  .dsh-tiles.is-strip{flex:0 0 auto;}
  .dsh-tiles.is-fill{flex:1;align-content:center;}
  .dsh-tile{display:flex;flex-direction:column;gap:12px;padding:28px 32px;border-radius:20px;min-height:190px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));
    transition:opacity .25s,background .25s,color .25s;overflow:hidden;}
  .dsh-tile-label{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;text-transform:uppercase;color:var(--ds-muted,rgba(242,243,246,.6));}
  .dsh-tile-value{font-size:52px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;}
  .dsh-tile-spark{flex:1;min-height:46px;color:var(--ds-muted,rgba(242,243,246,.6));}
  .dsh-tile-delta{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.4));}
  .dsh-tile.is-dim{opacity:.34;}
  .dsh-tile.is-focus{background:var(--ds-panel,#f3f3f0);color:var(--ds-panel-ink,#101216);box-shadow:none;}
  .dsh-tile.is-focus .dsh-tile-label{color:rgba(16,18,22,.55);}
  .dsh-tile.is-focus .dsh-tile-delta{color:rgba(16,18,22,.45);}
  .dsh-tile.is-focus .dsh-tile-spark{color:rgba(16,18,22,.5);}
  `;
  document.head.appendChild(s);
}

SlideDashboard.META = {
  id: 'dashboard', title: '数据仪表盘',
  defaults: { chartType: 'bars', tileCount: 4, showHero: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'chartType', type: 'radio', label: '图表类型', default: 'bars',
      options: [{ value: 'area', label: '面积' }, { value: 'bars', label: '柱状' }, { value: 'line', label: '折线' }],
      description: '所有图表（含迷你走势）的统一呈现样式。' },
    { key: 'tileCount', type: 'slider', label: '指标块数量', default: 4, min: 2, max: 6, step: 1,
      description: '下方 KPI 指标块的数量（自动排布列数）。' },
    { key: 'showHero', type: 'toggle', label: '主图面板', default: true,
      description: '顶部的大号走势图面板。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一指标块，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的指标块。' },
  ],
};

export { SlideDashboard };
export const META = SlideDashboard.META;
export default SlideDashboard;
