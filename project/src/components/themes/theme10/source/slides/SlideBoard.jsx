// SlideBoard.jsx — 指数行情板 / terminal-style market board.
// A grid of large mono "tickers": symbol code, oversized price, signed change
// with up/down tint and a tiny inline tick-mark. Reads like a trading wall.
// Distinct from SlideStatGrid (sans-serif metric cards) and SlideBigStat (one
// number): this is a dense, monospace, +/- coloured quote board. Standalone &
// migratable: depends only on React (imported). Token-driven. CSS scoped `.brd-`.
//
// ── Props (canonical list in SlideBoard.META.controls) ────────────────────────
//   tileCount   number 3..8   how many quote tiles                          (6)
//   columns     number 2..4   grid columns                                  (3)
//   showSpark   boolean       a minimal tick-line under each value          (true)
//   colorSign   boolean       tint change by direction (up accent / down)   (true)
//   focus       boolean       emphasise one tile, dim the rest              (false)
//   focusIndex  number 1..8   which tile is emphasised (1-based)            (1)
//
// Content props (authored at call-site):
//   overline, title, asOf, quotes:[{code, name, value, change, up, spark[]}]

import React from 'react';

function SlideBoard({
  overline = '行情快照 · MARKETS', title = '今日的盘面',
  asOf = '截至 16:00 CST',
  quotes = [
    { code: 'NAV', name: '组合净值', value: '1.2487', change: '+0.62%', up: true },
    { code: 'YTD', name: '年初至今', value: '+10.0', change: '跑赢 +4.2', up: true },
    { code: 'VOL', name: '年化波动', value: '7.5', change: '-0.30', up: false },
    { code: 'SHRP', name: '夏普比率', value: '0.71', change: '+0.04', up: true },
    { code: 'DD', name: '当前回撤', value: '-2.1', change: '+1.4', up: true },
    { code: 'CASH', name: '现金占比', value: '4.5%', change: '-0.50', up: false },
    { code: 'YLD', name: '组合股息', value: '2.84%', change: '+0.11', up: true },
    { code: 'FEE', name: '全包费率', value: '0.34%', change: '持平', up: true },
  ],
  tileCount = 6, columns = 3, showSpark = true, colorSign = true, focus = true, focusIndex = 1,
}) {
  React.useEffect(() => { brdInjectStyle(); }, []);
  const n = Math.max(3, Math.min(quotes.length, tileCount));
  const cells = quotes.slice(0, n);
  const cols = Math.max(2, Math.min(4, columns));
  const rows = Math.ceil(n / cols);
  const dense = rows >= 4;
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const spark = (seed) => Array.from({ length: 14 }, (_, i) => 40 + Math.sin(i * 0.8 + seed) * 22 + (i / 13) * 24);

  return (
    <div className={`brd-root ${dense ? 'is-dense' : ''}`}>
      <div className="brd-head">
        <div className="brd-top">
          <div className="brd-overline">{overline}</div>
          <div className="brd-asof">{asOf}</div>
        </div>
        <h2 className="brd-title">{title}</h2>
      </div>

      <div className="brd-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((q, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const dirCls = colorSign ? (q.up ? 'is-up' : 'is-down') : '';
          const pts = spark(i + 1);
          const max = Math.max(...pts), min = Math.min(...pts);
          const path = pts.map((v, j) => `${j ? 'L' : 'M'}${(j / (pts.length - 1) * 100).toFixed(1)} ${(28 - ((v - min) / (max - min || 1)) * 26).toFixed(1)}`).join(' ');
          return (
            <div className={`brd-tile ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="brd-tile-top">
                <span className="brd-code">{q.code}</span>
                <span className={`brd-change ${dirCls}`}>
                  <i className="brd-arrow">{q.up ? '▲' : '▼'}</i>{q.change}
                </span>
              </div>
              <span className="brd-value">{q.value}</span>
              <div className="brd-tile-bot">
                <span className="brd-name">{q.name}</span>
                {showSpark && (
                  <svg className={`brd-spark ${dirCls}`} viewBox="0 0 100 28" preserveAspectRatio="none">
                    <path d={path} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function brdInjectStyle() {
  if (document.getElementById('brd-style')) return;
  const s = document.createElement('style'); s.id = 'brd-style';
  s.textContent = `
  .brd-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .brd-head{margin-bottom:38px;}
  .brd-top{display:flex;justify-content:space-between;align-items:baseline;}
  .brd-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));white-space:nowrap;}
  .brd-asof{font-family:var(--font-mono);font-size:23px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.4));white-space:nowrap;}
  .brd-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .brd-grid{flex:1;display:grid;gap:20px;min-height:0;align-content:stretch;}
  .brd-tile{display:flex;flex-direction:column;justify-content:space-between;gap:18px;padding:34px 38px;border-radius:18px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));
    transition:opacity .25s,background .25s,color .25s;overflow:hidden;}
  .brd-tile-top{display:flex;justify-content:space-between;align-items:baseline;}
  .brd-code{font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .brd-change{font-family:var(--font-mono);font-size:25px;font-variant-numeric:tabular-nums;letter-spacing:.02em;
    color:var(--ds-muted,rgba(242,243,246,.6));display:inline-flex;align-items:baseline;gap:8px;}
  .brd-change.is-up{color:var(--ds-accent,#6f9bd8);}
  .brd-change.is-down{color:var(--ds-faint,rgba(242,243,246,.5));}
  .brd-arrow{font-size:19px;}
  .brd-value{font-family:var(--font-mono);font-size:76px;font-weight:400;line-height:.95;font-variant-numeric:tabular-nums;
    letter-spacing:-.01em;}
  .brd-tile-bot{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;}
  .brd-name{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));}
  .brd-spark{width:120px;height:34px;flex:0 0 auto;color:var(--ds-faint,rgba(242,243,246,.4));}
  .brd-spark.is-up{color:var(--ds-accent,#6f9bd8);}
  .brd-tile.is-dim{opacity:1;}
  .brd-tile.is-focus{background:linear-gradient(140deg,#243a6e 0%,#2f7bb0 55%,#2f9e86 100%);color:#fff;box-shadow:none;}
  .brd-tile.is-focus .brd-code,.brd-tile.is-focus .brd-name{color:rgba(255,255,255,.72);}
  .brd-tile.is-focus .brd-change,.brd-tile.is-focus .brd-change.is-up,.brd-tile.is-focus .brd-change.is-down{color:#fff;}
  .brd-tile.is-focus .brd-spark{color:rgba(255,255,255,.85);}
  .brd-root.is-dense .brd-head{margin-bottom:24px;}
  .brd-root.is-dense .brd-title{font-size:54px;}
  .brd-root.is-dense .brd-grid{gap:14px;}
  .brd-root.is-dense .brd-tile{gap:10px;padding:20px 28px;border-radius:16px;}
  .brd-root.is-dense .brd-code{font-size:20px;}
  .brd-root.is-dense .brd-change{font-size:21px;gap:6px;white-space:nowrap;}
  .brd-root.is-dense .brd-arrow{font-size:16px;}
  .brd-root.is-dense .brd-value{font-size:56px;line-height:.92;}
  .brd-root.is-dense .brd-tile-bot{gap:12px;}
  .brd-root.is-dense .brd-name{font-size:22px;}
  .brd-root.is-dense .brd-spark{width:96px;height:24px;}
  `;
  document.head.appendChild(s);
}

SlideBoard.META = {
  id: 'board', title: '指数行情板',
  defaults: { tileCount: 6, columns: 3, showSpark: true, colorSign: true, focus: true, focusIndex: 1 },
  controls: [
    { key: 'tileCount', type: 'slider', label: '行情块数量', default: 6, min: 3, max: 8, step: 1,
      description: '行情板上的报价块数量。' },
    { key: 'columns', type: 'slider', label: '每行列数', default: 3, min: 2, max: 4, step: 1,
      description: '网格的列数。' },
    { key: 'showSpark', type: 'toggle', label: '迷你走势线', default: true,
      description: '每个报价值下方的极简走势线。' },
    { key: 'colorSign', type: 'toggle', label: '涨跌着色', default: true,
      description: '按方向给涨跌幅着色（升=蓝，降=灰）。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: true,
      description: '高亮某一报价块，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideBoard };
export const META = SlideBoard.META;
export default SlideBoard;
