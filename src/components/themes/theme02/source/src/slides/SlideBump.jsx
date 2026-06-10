/**
 * SlideBump.jsx — 名次变迁（图表页 · Bump / Ranking Chart）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 名次图：每个条目一条折线，在「第 1 名 … 第 N 名」的格点之间逐期升降，线条交叉
 * 处即为「反超 / 被超」的瞬间——把排行榜随时间的换位讲得一目了然。内联 SVG，仅依赖 props。
 *
 * ── Props (see slideBumpDefaults) ───────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   periods      string[]   时间刻度（如季度）
 *   items        Array<{label, ranks:number[]}>   ranks 为每期名次（1 = 第一名）
 *   itemCount    number   展示的条目数量（2–n）
 *   focusEnabled boolean  辉光强调某一条（其余淡出）
 *   focusIndex   number   0-based 被强调条目
 *   showDots     boolean  各期端点圆点显隐
 *   showRankAxis boolean  左侧名次刻度显隐
 *   showEndLabels boolean 两端条目名称显隐
 *   gxnScheme    object?  { palette, accent, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideBumpDefaults = {
  kicker: 'BUMP · 名次变迁',
  title: '四个季度 ',
  titleEm: '赛道排位赛',
  lead: '按季度吸金额给五大赛道排名——算力底座在 Q3 一度登顶，数据平台则一路下滑，资本的注意力在持续换位。',
  periods: ['2024 · Q1', '2024 · Q2', '2024 · Q3', '2024 · Q4'],
  // 源：报告 2.3 赛道季度排名（1 = 当季吸金第一）
  items: [
    { label: '通用大模型', ranks: [1, 1, 2, 1] },
    { label: '算力底座', ranks: [3, 2, 1, 2] },
    { label: '数据平台', ranks: [2, 4, 4, 3] },
    { label: '企业级应用', ranks: [4, 3, 3, 4] },
    { label: 'AI 芯片', ranks: [5, 5, 5, 5] },
  ],
  itemCount: 5,
  focusEnabled: true,
  focusIndex: 1,
  showDots: true,
  showRankAxis: true,
  showEndLabels: true,
};

export const slideBumpControls = [
  { key: 'itemCount', type: 'number', label: '条目数量', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 5), describe: '名次图展示的条目数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一条（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 1, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调条目的序号' },
  { key: 'showDots', type: 'toggle', label: '端点圆点', default: true, describe: '各期端点圆点显隐' },
  { key: 'showRankAxis', type: 'toggle', label: '名次刻度', default: true, describe: '左侧名次刻度显隐' },
  { key: 'showEndLabels', type: 'toggle', label: '两端名称', default: true, describe: '两端条目名称显隐' },
];

function Bump({ periods, items, fIdx, showDots, showRankAxis, showEndLabels, palette, accent, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1280, H = 540;
  const padL = showRankAxis ? 96 : 40, padR = showEndLabels ? 320 : 60;
  const padT = 64, padB = 64;
  const nP = periods.length;
  const nR = items.length; // ranks span 1..nR
  const xOf = (i) => padL + (W - padL - padR) * (nP === 1 ? 0.5 : i / (nP - 1));
  const yOf = (rank) => padT + (H - padT - padB) * (nR === 1 ? 0.5 : (rank - 1) / (nR - 1));
  const focused = fIdx >= 0;

  // smooth-ish path through points (rounded corners via small bezier)
  const linePath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      d += ` C ${mx.toFixed(1)} ${y0.toFixed(1)}, ${mx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    }
    return d;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* rank gridlines + labels */}
      {Array.from({ length: nR }).map((_, r) => {
        const y = yOf(r + 1);
        return (
          <g key={`r${r}`}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            {showRankAxis && (
              <text x={padL - 28} y={y} textAnchor="middle" dominantBaseline="middle"
                    fontFamily="'Space Mono',monospace" fontSize="22" fill="rgba(238,243,241,0.45)">
                #{r + 1}
              </text>
            )}
          </g>
        );
      })}

      {/* period labels */}
      {periods.map((pl, i) => (
        <text key={`p${i}`} x={xOf(i)} y={padT - 30} textAnchor="middle"
              fontFamily="'Space Mono',monospace" fontSize="23" fill="rgba(238,243,241,0.62)"
              letterSpacing="0.02em">{pl}</text>
      ))}

      {items.map((d, i) => {
        const c = palette[i % palette.length];
        const isF = i === fIdx; const dim = focused && !isF;
        const pts = d.ranks.map((rk, pi) => [xOf(pi), yOf(rk)]);
        return (
          <g key={i} opacity={dim ? 0.24 : 1}>
            <path d={linePath(pts)} fill="none" stroke={c} strokeWidth={isF ? 7 : 4.5}
                  strokeLinecap="round" strokeLinejoin="round"
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showDots && pts.map(([x, y], pi) => (
              <circle key={pi} cx={x} cy={y} r={isF ? 11 : 8} fill="#0a0e13"
                      stroke={c} strokeWidth={isF ? 5 : 3.5} />
            ))}
            {/* end label */}
            {showEndLabels && (() => {
              const [ex, ey] = pts[pts.length - 1];
              return (
                <g>
                  <text x={ex + 26} y={ey} dominantBaseline="middle"
                        fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 600} fontSize="27"
                        fill={isF ? '#fff' : 'rgba(238,243,241,0.82)'}>{d.label}</text>
                  <text x={W - padR + 230} y={ey} dominantBaseline="middle" textAnchor="end"
                        fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="26"
                        fill={c} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    #{d.ranks[d.ranks.length - 1]}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}

export function SlideBump(props) {
  const p = { ...slideBumpDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const items = p.items.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const fb = fIdx >= 0 ? items[fIdx] : null;
  const move = fb ? fb.ranks[0] - fb.ranks[fb.ranks.length - 1] : 0; // +ve = climbed

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '06 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1280 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 12, minHeight: 0, position: 'relative' }}>
          <Bump periods={p.periods} items={items} fIdx={fIdx}
                showDots={p.showDots} showRankAxis={p.showRankAxis} showEndLabels={p.showEndLabels}
                palette={palette} accent={accent} glow={glow} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24, marginTop: 6 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 线条交叉处即为「反超」时刻——排位赛仍在进行
          </span>
          {fb && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fb.label}</strong>
              {' '}全年{move > 0 ? '上升' : move < 0 ? '下滑' : '持平'}{' '}
              <strong style={{ color: move >= 0 ? 'var(--gxn-accent)' : '#ff6fae', fontWeight: 700 }}>
                {move !== 0 ? `${Math.abs(move)} 位` : '—'}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideBump;
