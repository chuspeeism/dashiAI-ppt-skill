// SlideBumpChart.jsx — 排位赛 / rank-change (bump) chart across time periods.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A frosted-glass card holds a hand-rolled SVG bump chart: each player is a
// colored line threading left→right through several time columns, with a
// rank-numbered node at every period and a name pill on both ends. Crossing
// lines tell the reshuffle story at a glance; one line can be promoted to a
// glowing accent. Period count, player count, highlighted player, node rings
// and accent are tweakable; all text lives in defaultProps. Pure SVG — exports
// cleanly to PDF / PPTX, no chart library.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场全景 · 座次变化',
  tone: 'blue',
  title: '排位赛 · 一年内座次重排',
  en: 'The Reshuffle',
  cn: '按估值排名追踪头部玩家，谁在上位、谁被反超',
  periods: ['2023', '2024 上半年', '2024 下半年'],
  // ranks: 1 = top. One entry per period; length follows periodCount.
  series: [
    { name: 'OpenAI', color: '#5b8def', ranks: [1, 1, 1] },
    { name: 'Anthropic', color: '#46b083', ranks: [4, 3, 2] },
    { name: 'xAI', color: '#e0a23a', ranks: [6, 4, 3] },
    { name: 'CoreWeave', color: '#7a5ae0', ranks: [5, 5, 4] },
    { name: 'Databricks', color: '#9aa0ad', ranks: [2, 2, 5] },
    { name: 'Scale AI', color: '#e8503a', ranks: [3, 6, 6] },
  ],
  rankNote: '排名按公开披露估值口径 · 1 = 最高',
  caption: '排位图 · OpenAI 稳居榜首，xAI 与 Anthropic 强势上位',
  // tweakable (universal names)
  itemCount: 6,
  periodCount: 3,
  highlight: true,
  highlightIndex: 2,
  showNodes: true,
  showEndPills: true,
  showNote: true,
  accentColor: '#5b8def',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '玩家数量', type: 'number', default: 6, min: 3, max: 6, step: 1, unit: ' 位',
    description: '同时追踪排名变化的玩家数量。' },
  { key: 'periodCount', label: '时间节点', type: 'number', default: 3, min: 2, max: 3, step: 1, unit: ' 个',
    description: '横轴上的时间节点数量（取每位玩家 ranks 的前 N 个）。' },
  { key: 'highlight', label: '高亮玩家', type: 'boolean', default: true,
    description: '是否突出其中一位玩家（加粗发光，其余淡化）。' },
  { key: 'highlightIndex', label: '高亮第几位', type: 'number', default: 2, min: 0, max: 5, step: 1,
    description: '被高亮的玩家序号（从 0 开始）。' },
  { key: 'showNodes', label: '排名节点', type: 'boolean', default: true,
    description: '每个时间节点上的排名圆点（含名次数字）。' },
  { key: 'showEndPills', label: '两端名牌', type: 'boolean', default: true,
    description: '折线两端显示玩家名称的名牌。' },
  { key: 'showNote', label: '口径说明', type: 'boolean', default: true,
    description: '图表底部排名口径小字说明的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '标题点与高亮发光的主题色（不改各玩家自身配色）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideBumpChart(props) {
  const p = { ...defaultProps, ...props };
  const nP = Math.max(2, Math.min(3, p.periodCount));
  const nS = Math.max(3, Math.min(6, p.itemCount));
  const series = p.series.slice(0, nS).map((s) => ({ ...s, ranks: s.ranks.slice(0, nP) }));
  const periods = p.periods.slice(0, nP);
  const maxRank = nS;
  const hiIdx = p.highlight ? Math.min(p.highlightIndex, nS - 1) : -1;

  // viewBox geometry
  const VW = 1240, VH = 460;
  const gutL = 200, gutR = 200;
  const plotX0 = gutL, plotX1 = VW - gutR;
  const padT = 48, padB = 36;
  const xAt = (pi) => plotX0 + (pi * (plotX1 - plotX0)) / (nP - 1);
  const yAt = (rank) => padT + ((rank - 1) * (VH - padT - padB)) / (maxRank - 1 || 1);
  const NR = 21;

  const lineFor = (s) => s.ranks.map((r, i) => `${xAt(i)},${yAt(r)}`).join(' ');

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '30px 40px 26px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        <svg viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', flex: 1, minHeight: 0, overflow: 'visible' }}>
          {/* period column guides + labels */}
          {periods.map((pd, i) => {
            const x = xAt(i);
            return (
              <g key={i}>
                <line x1={x} y1={padT - 18} x2={x} y2={VH - padB + 18}
                  stroke={hexA('#5a5a70', 0.16)} strokeWidth="1.6" strokeDasharray="2 8" />
                <text x={x} y={26} textAnchor="middle" fontFamily="'Space Mono', monospace"
                  fontSize="22" fontWeight="700" fill={hexA('#5a5a70', 0.7)}>{pd}</text>
              </g>
            );
          })}

          {/* lines — dimmed first, highlighted on top */}
          {series.map((s, si) => {
            if (si === hiIdx) return null;
            const dim = hiIdx >= 0;
            return (
              <polyline key={si} points={lineFor(s)} fill="none"
                stroke={s.color} strokeWidth={dim ? 6 : 8} strokeLinecap="round" strokeLinejoin="round"
                opacity={dim ? 0.42 : 0.92} />
            );
          })}
          {hiIdx >= 0 && (
            <polyline points={lineFor(series[hiIdx])} fill="none" stroke={series[hiIdx].color}
              strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: `drop-shadow(0 6px 18px ${hexA(series[hiIdx].color, 0.55)})` }} />
          )}

          {/* nodes + end pills — the dim opacity is applied per-element (ring /
              number / name) and NEVER to the white fill, so a node always masks
              any line crossing behind it. */}
          {series.map((s, si) => {
            const on = si === hiIdx;
            const dim = hiIdx >= 0 && !on;
            const op = dim ? 0.5 : 1;
            return (
              <g key={si}>
                {p.showNodes && s.ranks.map((r, i) => {
                  const x = xAt(i), y = yAt(r), rr = on ? NR + 3 : NR;
                  return (
                    <g key={i}>
                      {/* opaque white mask — full opacity regardless of dim */}
                      <circle cx={x} cy={y} r={rr} fill="#fff" />
                      <circle cx={x} cy={y} r={rr} fill="none" opacity={op}
                        stroke={s.color} strokeWidth={on ? 6 : 4.5}
                        style={on ? { filter: `drop-shadow(0 4px 12px ${hexA(s.color, 0.5)})` } : undefined} />
                      <text x={x} y={y + (on ? 10 : 9)} textAnchor="middle" opacity={op}
                        fontFamily="'Space Mono', monospace" fontSize={on ? 26 : 23} fontWeight="700"
                        fill={s.color}>{r}</text>
                    </g>
                  );
                })}
                {p.showEndPills && (() => {
                  const xL = xAt(0), yL = yAt(s.ranks[0]);
                  const xR = xAt(nP - 1), yR = yAt(s.ranks[nP - 1]);
                  const pill = (x, y, anchor) => (
                    <text x={x} y={y + 9} textAnchor={anchor} opacity={op}
                      fontFamily="'Noto Sans SC', system-ui, sans-serif" fontSize={on ? 26 : 23}
                      fontWeight={on ? 900 : 700} fill={on ? s.color : 'var(--aip-ink)'}>{s.name}</text>
                  );
                  return (
                    <g>
                      {pill(xL - NR - 18, yL, 'end')}
                      {pill(xR + NR + 18, yR, 'start')}
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {p.showNote && (
          <div style={{ flex: '0 0 auto', marginTop: 6, fontFamily: "'Space Mono', monospace",
            fontSize: 17, color: 'var(--aip-ink-3)' }}>{`* `}{p.rankNote}</div>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
