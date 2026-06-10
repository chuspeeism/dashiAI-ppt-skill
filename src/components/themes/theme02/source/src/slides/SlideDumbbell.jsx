/**
 * SlideDumbbell.jsx — 差距图（图表页 · 哑铃 / 双值对比）.
 * Independent, prop-driven. Renders its own theme styles and an inline SVG
 * (no shared-chart dependency), so the slide drops into any project cleanly.
 *
 * Each row plots two values on a shared linear scale — a "from" dot and a
 * "to" dot joined by a connector — making the GAP between the two the visual
 * subject (e.g. 去年 → 今年 的增长). An optional Δ label closes each row.
 *
 * ── Props (see slideDumbbellDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm             strings
 *   data         Array<{label,from,to}>  rows (shared value scale)
 *   rowCount     number   how many rows to render (slices `data`)
 *   valueSuffix  string   unit appended to Δ / axis ticks
 *   fromLabel    string   legend label for the "from" dot
 *   toLabel      string   legend label for the "to" dot
 *   sortBy       'none' | 'to' | 'delta'   row ordering
 *   focusEnabled boolean  emphasise one row
 *   focusIndex   number   0-based row to emphasise (post-sort order)
 *   showDelta    boolean  show the Δ growth label per row
 *   showLegend   boolean  show the from/to legend
 *   showAnnotation boolean  show the interpretation note
 *   annotation   string   interpretation text
 *   gxnScheme    object   deck color scheme (accent / cool / glow)
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideDumbbellDefaults = {
  kicker: 'MARKET · 赛道增长',
  title: '各赛道融资额 ',
  titleEm: '一年翻倍',
  data: [
    { label: '通用大模型', from: 210, to: 420 },
    { label: '垂直应用', from: 120, to: 245 },
    { label: 'AI 基础设施', from: 95, to: 158 },
    { label: 'AI 芯片', from: 60, to: 97 },
    { label: '其他（工具 / 安全）', from: 38, to: 50 },
  ],
  rowCount: 5,
  valueSuffix: '亿',
  fromLabel: '2023',
  toLabel: '2024',
  sortBy: 'to',
  focusEnabled: true,
  focusIndex: 0,
  showDelta: true,
  showLegend: true,
  showAnnotation: true,
  annotation: '通用大模型一年内融资规模翻倍并拉开身位，垂直应用与基础设施同步放量，资本向上游与头部赛道集中的趋势进一步强化。',
};

export const slideDumbbellControls = [
  { key: 'sortBy', type: 'enum', label: '排序方式', default: 'to',
    options: [{ value: 'none', label: '默认' }, { value: 'to', label: '终值' }, { value: 'delta', label: '增幅' }],
    describe: '行的排序依据' },
  { key: 'rowCount', type: 'number', label: '行数', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.data ? p.data.length : 5), describe: '展示的对比行数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, Math.min((p.data ? p.data.length : 1), p.rowCount) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号（按当前排序）' },
  { key: 'showDelta', type: 'toggle', label: '增幅标签', default: true,
    describe: '显示/隐藏每行末尾的 Δ 增幅' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '显示/隐藏起止图例' },
  { key: 'showAnnotation', type: 'toggle', label: '解读文案', default: true,
    describe: '显示/隐藏底部的趋势解读' },
];

function Dumbbell({ data, valueSuffix, fromLabel, toLabel, focusIndex, showDelta, accent, cool, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const ACC = accent || '#2fe07f';
  const COOL = cool || '#4ea2ff';
  const GLOW = glow || '47,224,127';
  const n = data.length || 1;
  const W = 1180, rowH = 92, padT = 18;
  const H = padT * 2 + rowH * n;
  const labelW = 290, deltaW = showDelta ? 150 : 40;
  const x0 = labelW, x1 = W - deltaW;
  const vMax = Math.max(...data.map((d) => Math.max(d.from, d.to)), 1) * 1.06;
  const xs = (v) => x0 + (v / vMax) * (x1 - x0);
  const focused = focusIndex >= 0 && focusIndex < n;
  const ticks = [0, 0.5, 1].map((t) => t * vMax);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COOL} />
          <stop offset="100%" stopColor={ACC} />
        </linearGradient>
      </defs>

      {/* vertical guide ticks */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={xs(t)} y1={padT} x2={xs(t)} y2={H - padT} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x={xs(t)} y={H - 2} textAnchor="middle" fontFamily="'Space Mono',monospace" fontSize="21"
                fill="rgba(238,243,241,0.34)">{Math.round(t)}</text>
        </g>
      ))}

      {data.map((d, i) => {
        const cy = padT + rowH * (i + 0.5);
        const xa = xs(d.from), xb = xs(d.to);
        const dim = focused && i !== focusIndex;
        const isF = i === focusIndex;
        const delta = d.to - d.from;
        return (
          <g key={i} opacity={dim ? 0.34 : 1}>
            <text x={labelW - 28} y={cy} textAnchor="end" dominantBaseline="middle"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight="500" fontSize="27"
                  fill={isF ? '#fff' : '#eef3f1'}>{d.label}</text>

            {/* connector */}
            <line x1={xa} y1={cy} x2={xb} y2={cy} stroke={`url(#${uid}-bar)`} strokeWidth="9"
                  strokeLinecap="round" filter={!dim ? `url(#${uid}-g)` : undefined} />
            {/* from dot (hollow) */}
            <circle cx={xa} cy={cy} r="11" fill="#0b0e12" stroke={COOL} strokeWidth="4" />
            {/* to dot (filled accent) */}
            <circle cx={xb} cy={cy} r={isF ? 16 : 13} fill={ACC} stroke="#07090b" strokeWidth="3"
                    filter={!dim ? `url(#${uid}-g)` : undefined} />

            {/* value labels above dots */}
            <text x={xa} y={cy - 24} textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontSize="22" fontWeight="600" fill="rgba(238,243,241,0.6)"
                  style={{ fontVariantNumeric: 'tabular-nums' }}>{d.from}</text>
            <text x={xb} y={cy - 26} textAnchor="middle" fontFamily="'Space Grotesk',sans-serif"
                  fontSize="25" fontWeight="700" fill={isF ? ACC : '#eef3f1'}
                  style={{ fontVariantNumeric: 'tabular-nums' }}>{d.to}</text>

            {showDelta && (
              <text x={W - 8} y={cy} textAnchor="end" dominantBaseline="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontSize="26" fontWeight="700"
                    fill={isF ? ACC : 'rgba(238,243,241,0.8)'}
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                +{delta}{valueSuffix}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SlideDumbbell(props) {
  const p = { ...slideDumbbellDefaults, ...props };
  const sch = p.gxnScheme || {};
  let rows = (p.data || []).slice();
  if (p.sortBy === 'to') rows.sort((a, b) => b.to - a.to);
  else if (p.sortBy === 'delta') rows.sort((a, b) => (b.to - b.from) - (a.to - a.from));
  rows = rows.slice(0, Math.max(2, p.rowCount));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(rows.length - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'grid',
             gridTemplateColumns: p.showAnnotation ? '1.66fr 1fr' : '1fr', gap: 56, minHeight: 0 }}>
          <section className="gxn-panel" style={{ padding: '30px 44px 22px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {p.showLegend && (
              <div style={{ display: 'flex', gap: 34, marginBottom: 6 }}>
                <Legend color="var(--gxn-accent-cool)" label={p.fromLabel} hollow />
                <Legend color="var(--gxn-accent)" label={p.toLabel} />
              </div>
            )}
            <div style={{ flex: 1, minHeight: 0 }}>
              <Dumbbell data={rows} valueSuffix={p.valueSuffix} fromLabel={p.fromLabel} toLabel={p.toLabel}
                        focusIndex={fIdx} showDelta={p.showDelta}
                        accent={sch.accent} cool={sch.cool} glow={sch.glow} />
            </div>
          </section>

          {p.showAnnotation && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0, justifyContent: 'center' }}>
              <div className="gxn-panel" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>合计增长</span>
                <span className="gxn-num gxn-aurora-num" style={{ fontSize: 76, fontWeight: 600, color: 'var(--gxn-accent)', lineHeight: 1, textShadow: '0 0 30px rgba(var(--gxn-glow),0.5)' }}>
                  +{rows.reduce((s, d) => s + (d.to - d.from), 0)}<span style={{ fontSize: 30, marginLeft: 8, color: 'var(--gxn-dim)' }}>{p.valueSuffix}</span>
                </span>
              </div>
              <div className="gxn-panel" style={{ padding: '26px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
                <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.08em' }}>趋势解读</span>
                <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.55, color: 'var(--gxn-dim)' }}>{p.annotation}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, hollow }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%',
                     background: hollow ? '#0b0e12' : color,
                     border: hollow ? `3px solid ${color}` : 'none',
                     boxShadow: hollow ? 'none' : `0 0 14px -1px ${color}` }} />
      <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{label}</span>
    </span>
  );
}

export default SlideDumbbell;
