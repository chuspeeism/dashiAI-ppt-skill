// SlideBump.jsx — 名次走势 / bump (rank-flow) chart.
// Several series ranked across consecutive periods; lines connect each series'
// rank position period-to-period, so crossings = overtakes. Distinct from
// SlideSlope (a single two-point comparison), SlideCurve / DeckChart (value over
// time, not rank) and SlideRanking (a static ordered list). Standalone &
// migratable: depends only on React (imported). Token-driven, light/dark tone
// applies. All variation via props; copy authored in markup. CSS scoped `.bmp-`.
//
// ── Props (canonical list in SlideBump.META.controls) ─────────────────────────
//   seriesCount  number 3..5   how many tracked series                    (5)
//   periodCount  number 3..6   how many time columns                      (5)
//   showDots     boolean       rank node dots at each period              (true)
//   showRankAxis boolean       the 1·2·3… rank gutter on the left         (true)
//   focus        boolean       highlight one series, dim the rest         (false)
//   focusIndex   number 1..5   which series is highlighted (1-based)      (1)
//
// Content props (authored at call-site):
//   overline, title, periods:[label…], series:[{ name, ranks:[…] }]  (1 = top)

import React from 'react';

function SlideBump({
  overline = '策略名次 · ROLLING LEADERBOARD',
  title = '谁在领跑，谁在交棒',
  periods = ['2021', '2022', '2023', '2024', '2025', 'YTD'],
  series = [
    { name: '增长权益', ranks: [1, 3, 2, 1, 1, 2] },
    { name: '另类对冲', ranks: [4, 1, 1, 3, 2, 1] },
    { name: '固定收益', ranks: [2, 2, 4, 4, 4, 4] },
    { name: '大宗商品', ranks: [5, 4, 3, 2, 3, 3] },
    { name: '现金管理', ranks: [3, 5, 5, 5, 5, 5] },
  ],
  seriesCount = 5, periodCount = 5, showDots = true, showRankAxis = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { bmpInjectStyle(); }, []);
  const ns = Math.max(3, Math.min(series.length, seriesCount));
  const np = Math.max(3, Math.min(periods.length, periodCount));
  const used = series.slice(0, ns).map((s) => ({ ...s, ranks: s.ranks.slice(0, np) }));
  // Re-rank the selected subset densely (1..ns) per period, so reducing the
  // series count never leaves rank values that project off the plot.
  for (let p = 0; p < np; p++) {
    const order = used.map((s, si) => ({ si, v: s.ranks[p] })).sort((a, b) => a.v - b.v);
    order.forEach((o, idx) => { used[o.si].ranks[p] = idx + 1; });
  }
  const fIdx = focus ? Math.max(0, Math.min(ns - 1, focusIndex - 1)) : -1;

  // Plot geometry (viewBox units). Rows = ns ranks.
  const W = 1000, H = 520, padL = 70, padR = 70, padT = 40, padB = 40;
  const ax = (i) => padL + (i / (np - 1)) * (W - padL - padR);
  const ay = (r) => padT + ((r - 1) / (ns - 1)) * (H - padT - padB);
  const COL = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)'];

  return (
    <div className="bmp-root">
      <div className="bmp-head">
        <div className="bmp-overline">{overline}</div>
        <h2 className="bmp-title">{title}</h2>
      </div>

      <div className="bmp-plot">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="bmp-svg">
          {showRankAxis && used.map((_, ri) => (
            <text key={'r' + ri} x={padL - 30} y={ay(ri + 1)} className="bmp-rank" dominantBaseline="central" textAnchor="middle">{ri + 1}</text>
          ))}
          {periods.slice(0, np).map((_, pi) => (
            <line key={'g' + pi} x1={ax(pi)} y1={padT - 14} x2={ax(pi)} y2={H - padB + 14} className="bmp-grid" />
          ))}
          {used.map((s, si) => {
            const hot = fIdx < 0 || fIdx === si;
            const c = fIdx < 0 ? COL[si] : (hot ? COL[si] : 'currentColor');
            const op = fIdx < 0 ? 1 : (hot ? 1 : 0.16);
            const d = s.ranks.map((r, pi) => `${pi === 0 ? 'M' : 'L'}${ax(pi)},${ay(r)}`).join(' ');
            return (
              <g key={si} style={{ opacity: op }}>
                <path d={d} fill="none" stroke={c} strokeWidth={hot && fIdx === si ? 7 : 5}
                      strokeLinecap="round" strokeLinejoin="round" />
                {showDots && s.ranks.map((r, pi) => (
                  <circle key={pi} cx={ax(pi)} cy={ay(r)} r={hot && fIdx === si ? 11 : 8} fill="var(--ds-bg-soft,#16181d)"
                          stroke={c} strokeWidth={4} />
                ))}
              </g>
            );
          })}
        </svg>

        {/* left name labels (at first period rank) */}
        <div className="bmp-names is-left">
          {used.map((s, si) => (
            <span key={si} className={`bmp-name ${fIdx >= 0 && fIdx !== si ? 'is-dim' : ''}`}
                  style={{ top: `${(ay(s.ranks[0]) / H) * 100}%`, color: COL[si] }}>{s.name}</span>
          ))}
        </div>
        {/* right rank labels (at last period) */}
        <div className="bmp-names is-right">
          {used.map((s, si) => (
            <span key={si} className={`bmp-tag ${fIdx >= 0 && fIdx !== si ? 'is-dim' : ''}`}
                  style={{ top: `${(ay(s.ranks[np - 1]) / H) * 100}%` }}>#{s.ranks[np - 1]}</span>
          ))}
        </div>
      </div>

      <div className="bmp-axis">
        {periods.slice(0, np).map((p, pi) => (
          <span key={pi} className="bmp-period" style={{ left: `${(ax(pi) / W) * 100}%` }}>{p}</span>
        ))}
      </div>
    </div>
  );
}

function bmpInjectStyle() {
  if (document.getElementById('bmp-style')) return;
  const s = document.createElement('style'); s.id = 'bmp-style';
  s.textContent = `
  .bmp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .bmp-head{margin-bottom:30px;}
  .bmp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .bmp-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.08;}
  .bmp-plot{position:relative;flex:1;min-height:0;margin:0 150px;}
  .bmp-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
  .bmp-grid{stroke:var(--ds-line,rgba(242,243,246,.1));stroke-width:1.5;}
  .bmp-rank{fill:var(--ds-faint,rgba(242,243,246,.34));font-family:var(--font-mono);font-size:26px;}
  .bmp-names{position:absolute;top:0;bottom:0;width:150px;pointer-events:none;}
  .bmp-names.is-left{left:-160px;}
  .bmp-names.is-right{right:-110px;}
  .bmp-name{position:absolute;right:0;transform:translateY(-50%);font-size:29px;font-weight:300;white-space:nowrap;
    text-align:right;transition:opacity .25s ease;}
  .bmp-tag{position:absolute;left:0;transform:translateY(-50%);font-family:var(--font-mono);font-size:27px;
    font-variant-numeric:tabular-nums;color:var(--ds-muted,rgba(242,243,246,.6));transition:opacity .25s ease;}
  .bmp-name.is-dim,.bmp-tag.is-dim{opacity:.32;}
  .bmp-axis{position:relative;height:48px;margin:18px 150px 0;}
  .bmp-period{position:absolute;transform:translateX(-50%);font-family:var(--font-mono);font-size:25px;
    letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.42));}
  `;
  document.head.appendChild(s);
}

SlideBump.META = {
  id: 'bump', title: '名次走势',
  defaults: { seriesCount: 5, periodCount: 5, showDots: true, showRankAxis: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'seriesCount', type: 'slider', label: '序列数量', default: 5, min: 3, max: 5, step: 1,
      description: '参与排名的策略/序列条数。线条交叉即代表名次反超。' },
    { key: 'periodCount', type: 'slider', label: '周期数量', default: 5, min: 3, max: 6, step: 1,
      description: '横轴的时间周期列数。' },
    { key: 'showDots', type: 'toggle', label: '名次节点', default: true,
      description: '每个周期上的名次圆点。' },
    { key: 'showRankAxis', type: 'toggle', label: '名次刻度', default: true,
      description: '左侧 1·2·3… 的名次刻度。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一条序列，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的序列。' },
  ],
};

export { SlideBump };
export const META = SlideBump.META;
export default SlideBump;
