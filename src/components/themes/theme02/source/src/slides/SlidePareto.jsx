/**
 * SlidePareto.jsx — 帕累托图（图表页 · Pareto）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 帕累托图：条目按数值降序排列的柱，叠加一条「累计占比」折线 + 80% 参考线，
 * 一眼看出「少数头部贡献多数总量」的集中度。图表内联 SVG，仅依赖 props。
 *
 * ── Props (see slideParetoDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   items        Array<{label, value}>   已按数值降序（组件不再排序，忠于源序）
 *   unit         string   柱值单位
 *   barCount     number   展示的条目数量（2–n）
 *   focusEnabled boolean  辉光强调某一柱
 *   focusIndex   number   0-based 被强调柱
 *   showCumLine  boolean  累计占比折线显隐
 *   showEighty   boolean  80% 参考线显隐
 *   showValueLabels boolean 柱上数值显隐
 *   showGrid     boolean  左轴网格刻度显隐
 *   gxnScheme    object?  { accent, accent2, cool, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideParetoDefaults = {
  kicker: 'PARETO · 集中度',
  title: '少数头部 ',
  titleEm: '吸走多数资本',
  lead: '把 Top 10 单笔融资按金额降序排开，累计曲线快速逼近顶部——前三家就吃掉大半盘子。',
  // 源：报告 3.3 Top 10 融资公司排名（最大单笔，亿美元）
  items: [
    { label: 'OpenAI', value: 66 },
    { label: 'Anthropic', value: 65 },
    { label: 'xAI', value: 50 },
    { label: 'CoreWeave', value: 11 },
    { label: 'SSI', value: 10 },
    { label: 'Scale AI', value: 10 },
    { label: 'Figure AI', value: 6.8 },
    { label: 'Perplexity', value: 5.2 },
    { label: 'Databricks', value: 5.0 },
    { label: 'Glean', value: 2.6 },
  ],
  unit: '亿美元',
  barCount: 10,
  focusEnabled: true,
  focusIndex: 0,
  showCumLine: true,
  showEighty: true,
  showValueLabels: true,
  showGrid: true,
};

export const slideParetoControls = [
  { key: 'barCount', type: 'number', label: '条目数量', default: 10, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 10), describe: '帕累托图展示的条目数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一柱（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.barCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调柱的序号' },
  { key: 'showCumLine', type: 'toggle', label: '累计曲线', default: true, describe: '累计占比折线显隐' },
  { key: 'showEighty', type: 'toggle', label: '80% 线', default: true, describe: '80% 参考线显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true, describe: '柱上数值显隐' },
  { key: 'showGrid', type: 'toggle', label: '网格刻度', default: true, describe: '左轴网格刻度显隐' },
];

function Pareto({ items, unit, fIdx, showCumLine, showEighty, showValueLabels, showGrid, accent, accent2, cool, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1240, H = 560;
  const padL = 64, padR = 86, padT = 76, padB = 80;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = items.length;
  const total = items.reduce((s, d) => s + d.value, 0) || 1;
  const vMax = Math.max(...items.map((d) => d.value), 1) * 1.16;
  const band = plotW / n;
  const bw = Math.min(band * 0.56, 96);
  const xMid = (i) => padL + band * (i + 0.5);
  const yV = (v) => padT + plotH * (1 - v / vMax);
  const yPct = (q) => padT + plotH * (1 - q);     // q in 0..1 (right axis: cumulative %)
  const focused = fIdx >= 0;

  // cumulative share at each bar (right edge)
  let run = 0;
  const cum = items.map((d) => { run += d.value; return run / total; });

  const gridT = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent2} /><stop offset="100%" stopColor={accent} />
        </linearGradient>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showGrid && gridT.map((t, i) => {
        const y = padT + plotH * t;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={padL - 14} y={y} textAnchor="end" dominantBaseline="middle"
                  fontFamily="'Space Mono',monospace" fontSize="22" fill="rgba(238,243,241,0.5)">
              {Math.round(vMax * (1 - t))}
            </text>
            {/* right axis: cumulative % */}
            <text x={W - padR + 14} y={y} textAnchor="start" dominantBaseline="middle"
                  fontFamily="'Space Mono',monospace" fontSize="22" fill={cool} opacity="0.75">
              {Math.round((1 - t) * 100)}%
            </text>
          </g>
        );
      })}

      {/* 80% reference line — label parked at the right (cumulative-axis side),
          above the line on a faint chip so a tall first bar never covers it. */}
      {showEighty && (
        <g>
          <line x1={padL} y1={yPct(0.8)} x2={W - padR} y2={yPct(0.8)} stroke={cool}
                strokeWidth="1.5" strokeDasharray="3 8" opacity="0.65" />
          <rect x={W - padR - 118} y={yPct(0.8) - 33} width="118" height="26" rx="7"
                fill="#0a0d10" opacity="0.66" />
          <text x={W - padR - 10} y={yPct(0.8) - 14} textAnchor="end"
                fontFamily="'Space Mono',monospace" fontSize="21"
                fill={cool} opacity="0.95">80% 集中线</text>
        </g>
      )}

      {/* bars */}
      {items.map((d, i) => {
        const x = xMid(i) - bw / 2;
        const y = yV(d.value), h = Math.max(padT + plotH - y, 3);
        const isF = i === fIdx; const dim = focused && !isF;
        return (
          <g key={i} opacity={dim ? 0.3 : 1}>
            <rect x={x} y={y} width={bw} height={h} rx="8" fill={`url(#${uid}-bar)`}
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showValueLabels && (
              <text x={xMid(i)} y={y - 14} textAnchor="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="24"
                    fill={isF ? accent2 : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {d.value}
              </text>
            )}
            <text x={xMid(i)} y={H - padB + 34} textAnchor="middle"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 500} fontSize="22"
                  fill={isF ? '#eef3f1' : 'rgba(238,243,241,0.6)'}>{d.label}</text>
          </g>
        );
      })}

      {/* cumulative line on right axis */}
      {showCumLine && (
        <g>
          <polyline points={cum.map((q, i) => `${xMid(i)},${yPct(q)}`).join(' ')}
                    fill="none" stroke={cool} strokeWidth="3.4" strokeLinejoin="round"
                    strokeLinecap="round" filter={`url(#${uid}-g)`} />
          {cum.map((q, i) => {
            const isF = i === fIdx;
            return (
              <g key={i}>
                <circle cx={xMid(i)} cy={yPct(q)} r={isF ? 9 : 6.5} fill="#10141b"
                        stroke={cool} strokeWidth={isF ? 4 : 3} />
                {(i === 0 || i === Math.min(2, n - 1) || isF) && (
                  <text x={xMid(i)} y={yPct(q) - 18} textAnchor="middle"
                        fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="22"
                        fill={cool} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(q * 100)}%
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}

      <text x={padL - 14} y={padT - 32} fontFamily="'Space Mono',monospace" fontSize="21"
            fill="rgba(238,243,241,0.5)">{unit}</text>
    </svg>
  );
}

export function SlidePareto(props) {
  const p = { ...slideParetoDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';
  const accent2 = sc.accent2 || '#b9f24a';
  const cool = sc.cool || '#4ea2ff';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.items.length, p.barCount));
  const items = p.items.slice(0, count);
  const total = items.reduce((s, d) => s + d.value, 0) || 1;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  // top-3 concentration on the FULL visible set
  const top3 = items.slice(0, Math.min(3, count)).reduce((s, d) => s + d.value, 0);
  const top3Pct = Math.round((top3 / total) * 100);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '07 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 18, minHeight: 0, position: 'relative' }}>
          <Pareto items={items} unit={p.unit} fIdx={fIdx} showCumLine={p.showCumLine}
                  showEighty={p.showEighty} showValueLabels={p.showValueLabels} showGrid={p.showGrid}
                  accent={accent} accent2={accent2} cool={cool} glow={glow} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24, marginTop: 6 }}>
          <div style={{ display: 'flex', gap: 30 }}>
            {[{ c: accent, t: '单笔融资额' }, { c: cool, t: '累计占比' }].map((l, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, background: l.c, boxShadow: `0 0 16px -2px ${l.c}` }} />
                <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{l.t}</span>
              </span>
            ))}
          </div>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 前三家合计 <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{top3Pct}%</strong>，赢家通吃格局确立
          </span>
        </div>
      </div>
    </div>
  );
}

export default SlidePareto;
