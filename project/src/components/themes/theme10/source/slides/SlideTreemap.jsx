// SlideTreemap.jsx — 占比树图 / squarified treemap of holdings.
// Rectangles sized by weight via the squarify algorithm, tinted on a single
// cool-blue ramp by rank. Distinct from a donut (allocation), stacked bars
// (composition) and the heatmap (fixed grid): area-encoded nested rectangles.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.tmp-`.
//
// ── Props (canonical list in SlideTreemap.META.controls) ──────────────────────
//   tileCount    number 4..9   how many tiles                              (7)
//   showWeights  boolean       the % on each tile                          (true)
//   showSub      boolean       the sub-label on each tile                  (true)
//   gap          number 2..14  gap between tiles (px)                      (6)
//   focus        boolean       emphasise one tile, dim the rest            (false)
//   focusIndex   number 1..9   which tile is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, items:[{ label, weight(number), sub }]

import React from 'react';

function SlideTreemap({
  overline = '持仓占比 · BY WEIGHT', title = '钱都放在哪儿，一眼看全',
  items = [
    { label: '全球股票', weight: 38, sub: '指数底仓' },
    { label: '固定收益', weight: 22, sub: '票息为主' },
    { label: '另类对冲', weight: 12, sub: '低相关' },
    { label: '实物资产', weight: 9, sub: '抗通胀' },
    { label: '海外成长', weight: 8, sub: '分散地域' },
    { label: '现金等价', weight: 6, sub: '流动性' },
    { label: '战术机会', weight: 5, sub: '择机' },
    { label: '私募股权', weight: 4, sub: '长锁定' },
    { label: '黄金', weight: 3, sub: '避险' },
  ],
  tileCount = 6, showWeights = true, showSub = true, gap = 6, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { tmpInjectStyle(); }, []);
  const n = Math.max(4, Math.min(items.length, tileCount));
  const used = items.slice(0, n).slice().sort((a, b) => b.weight - a.weight);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const rects = tmpSquarify(used, 0, 0, 1000, 560);
  // Light tints of the brand categorical palette by rank — colourful tiles that
  // keep near-black text legible (each hue mixed into a warm cream).
  const HUES = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c2)', 'var(--ds-c6)'];
  const tileBg = (i) => `linear-gradient(150deg, color-mix(in srgb, ${HUES[i % HUES.length]} 46%, #f4efe7) 0%, color-mix(in srgb, ${HUES[i % HUES.length]} 72%, #f4efe7) 100%)`;

  return (
    <div className="tmp-root">
      <div className="tmp-head">
        <div className="tmp-overline">{overline}</div>
        <h2 className="tmp-title">{title}</h2>
      </div>

      <div className="tmp-stage">
        <div className="tmp-canvas">
          {rects.map((r, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const tier = (r.h > 150 && r.w > 200) ? 'big' : (r.h > 92 ? 'mid' : 'tiny');
            return (
              <div className={`tmp-tile tier-${tier} ${dim ? 'is-dim' : ''} ${hot ? 'is-focus' : ''}`} key={i}
                   style={{ left: `${(r.x / 1000) * 100}%`, top: `${(r.y / 560) * 100}%`,
                     width: `calc(${(r.w / 1000) * 100}% - ${gap}px)`, height: `calc(${(r.h / 560) * 100}% - ${gap}px)`,
                     background: tileBg(i) }}>
                <div className="tmp-tile-top">
                  <span className="tmp-label">{r.label}</span>
                  {showSub && tier === 'big' && <span className="tmp-sub">{r.sub}</span>}
                </div>
                {showWeights && <span className="tmp-w">{r.weight}<span className="tmp-wu">%</span></span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Squarified treemap — commits one row at a time along the shorter side.
function tmpSquarify(items, x, y, w, h) {
  const total = items.reduce((a, b) => a + b.weight, 0) || 1;
  const scale = (w * h) / total;
  let remaining = items.map((it) => ({ ...it, area: it.weight * scale }));
  let rect = { x, y, w, h };
  const out = [];
  const worst = (row, len) => {
    const sum = row.reduce((a, b) => a + b.area, 0);
    const mx = Math.max(...row.map((r) => r.area)), mn = Math.min(...row.map((r) => r.area));
    const s2 = sum * sum, l2 = len * len;
    return Math.max((l2 * mx) / s2, s2 / (l2 * mn));
  };
  const commit = (row, len, horizontal) => {
    const sum = row.reduce((a, b) => a + b.area, 0);
    const thick = sum / len;
    let cur = horizontal ? rect.y : rect.x;
    row.forEach((r) => {
      const cell = r.area / thick;
      if (horizontal) { out.push({ ...r, x: rect.x, y: cur, w: thick, h: cell }); cur += cell; }
      else { out.push({ ...r, x: cur, y: rect.y, w: cell, h: thick }); cur += cell; }
    });
    if (horizontal) { rect.x += thick; rect.w -= thick; } else { rect.y += thick; rect.h -= thick; }
  };
  while (remaining.length) {
    const horizontal = rect.w < rect.h;
    const len = horizontal ? rect.h : rect.w;
    let row = [remaining[0]], i = 1;
    while (i < remaining.length && worst([...row, remaining[i]], len) <= worst(row, len)) { row.push(remaining[i]); i++; }
    commit(row, len, horizontal);
    remaining = remaining.slice(row.length);
  }
  return out;
}

function tmpInjectStyle() {
  if (document.getElementById('tmp-style')) return;
  const s = document.createElement('style'); s.id = 'tmp-style';
  s.textContent = `
  .tmp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .tmp-head{margin-bottom:30px;}
  .tmp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .tmp-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .tmp-stage{flex:1;min-height:0;}
  .tmp-canvas{position:relative;width:100%;height:100%;}
  .tmp-tile{position:absolute;border-radius:10px;overflow:hidden;transition:opacity .25s,box-shadow .25s;
    box-shadow:inset 0 0 0 1px rgba(13,14,17,.4);display:flex;flex-direction:column;justify-content:space-between;
    align-items:center;text-align:center;padding:18px 22px;container-type:size;}
  .tmp-tile::after{content:'';position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,0) 42%);}
  .tmp-tile.tier-tiny{padding:0 16px;align-items:center;flex-direction:row;justify-content:space-between;}
  .tmp-tile.is-dim{opacity:.4;}
  .tmp-tile.is-focus{box-shadow:inset 0 0 0 3px #0c1118;z-index:2;}
  .tmp-tile-top{display:flex;flex-direction:column;gap:4px;min-width:0;align-items:center;}
  .tmp-label{font-weight:500;color:#1a130c;line-height:1.04;letter-spacing:.005em;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:clamp(17px,11cqh,33px);}
  .tier-tiny .tmp-label{font-size:20px;font-weight:500;}
  .tmp-sub{font-family:var(--font-mono);letter-spacing:.02em;color:rgba(26,19,12,.6);
    font-size:clamp(15px,6.5cqh,23px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .tmp-w{font-weight:300;font-variant-numeric:tabular-nums;color:#1a130c;line-height:.9;letter-spacing:-.02em;align-self:center;
    font-size:clamp(22px,22cqh,60px);}
  .tier-tiny .tmp-w{font-size:24px;align-self:center;}
  @container (max-height:130px){.tmp-sub{display:none;}}
  .tmp-wu{margin-left:2px;font-size:.46em;color:rgba(26,19,12,.6);}
  `;
  document.head.appendChild(s);
}

SlideTreemap.META = {
  id: 'treemap', title: '占比树图',
  defaults: { tileCount: 6, showWeights: true, showSub: true, gap: 6, focus: false, focusIndex: 1 },
  controls: [
    { key: 'tileCount', type: 'slider', label: '分块数量', default: 6, min: 4, max: 9, step: 1,
      description: '树图分块数量（按权重自动布局，大块在左上）。' },
    { key: 'showWeights', type: 'toggle', label: '权重数字', default: true,
      description: '每个分块上的占比百分比。' },
    { key: 'showSub', type: 'toggle', label: '副标签', default: true,
      description: '较大分块内的副说明（小块自动隐藏）。' },
    { key: 'gap', type: 'slider', label: '间隙', default: 6, min: 2, max: 14, step: 1, unit: 'px',
      description: '分块之间的间隙。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一分块，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 9, step: 1,
      description: '需开启「重点聚焦」后生效（按权重排序后的序号）。' },
  ],
};

export { SlideTreemap };
export const META = SlideTreemap.META;
export default SlideTreemap;
