/**
 * SlideStackedBar.jsx — 资本结构演变（图表页 · 堆叠面积 / 柱状）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 逐年（或逐期）的「构成型」图表。默认呈现 Bklit-UI 风格的「堆叠面积图」：
 * 平滑曲线 + 分项渐变填充 + 环形标记点 + 细网格 + 自适应圆角浮窗（tooltip），
 * 并提供 marker + label + value 的可组合图例。亦可切换为堆叠 / 百分比 / 分组柱状。
 * 图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色），无预览运行时耦合。
 *
 * ── Props (see slideStackedBarDefaults) ─────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   series       Array<{key,label}>            分项（图例 + 颜色顺序）
 *   groups       Array<{label, values:{}}>     各组：分项 key → 数值
 *   groupCount   number   展示的组数（2–n）
 *   chartType    'area' | 'stacked' | 'norm' | 'grouped'
 *                area=堆叠面积(Bklit 风) · stacked=堆叠柱 · norm=百分比柱 · grouped=分组柱
 *   focusEnabled boolean  辉光强调某一组（面积图显示浮窗 + 引导线）
 *   focusIndex   number   0-based 被强调组
 *   showTotals   boolean  合计标签显隐
 *   showGrid     boolean  网格与坐标刻度显隐
 *   showMarkers  boolean  数据点环形标记显隐（面积图）
 *   showLegend   boolean  图例显隐
 *   valueSuffix  string   数值单位后缀（如 'B'）
 *   gxnScheme    object?  { accent, glow, palette } 调色（缺省走主题绿）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideStackedBarDefaults = {
  kicker: 'COMPOSITION · 资本结构演变',
  title: '一年比一年厚的资本堆叠 ',
  titleEm: '阶段构成',
  lead: '把每年的美国 AI 风险投资按融资阶段拆开堆叠——成长期始终是最厚的一层，2024 年早期与成长期共同把总盘推向新高。',
  series: [
    { key: 'seed', label: '种子 / 天使' },
    { key: 'early', label: '早期 A·B 轮' },
    { key: 'growth', label: '成长期 C+' },
    { key: 'late', label: '后期 / Pre-IPO' },
  ],
  groups: [
    { label: '2021', values: { seed: 8, early: 22, growth: 30, late: 18 } },
    { label: '2022', values: { seed: 6, early: 18, growth: 24, late: 12 } },
    { label: '2023', values: { seed: 9, early: 26, growth: 34, late: 20 } },
    { label: '2024', values: { seed: 12, early: 34, growth: 41, late: 10 } },
  ],
  groupCount: 4,
  chartType: 'area',
  focusEnabled: true,
  focusIndex: 3,
  showTotals: true,
  showGrid: true,
  showMarkers: true,
  showLegend: true,
  valueSuffix: 'B',
};

export const slideStackedBarControls = [
  { key: 'chartType', type: 'enum', label: '图表形态', default: 'area',
    options: [
      { value: 'area', label: '堆叠面积' },
      { value: 'stacked', label: '堆叠柱' },
      { value: 'norm', label: '百分比' },
      { value: 'grouped', label: '分组柱' },
    ],
    describe: '堆叠面积(Bklit 风) / 堆叠柱 / 100% 占比 / 同组分项并列' },
  { key: 'groupCount', type: 'number', label: '组数', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.groups ? p.groups.length : 4), describe: '展示的数据点（年份/期）数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否强调某一组（面积图显示浮窗 + 引导线）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 3, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.groupCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调数据点的序号' },
  { key: 'showTotals', type: 'toggle', label: '合计标签', default: true,
    visibleWhen: (p) => p.chartType !== 'norm', describe: '各组合计数值标签显隐' },
  { key: 'showGrid', type: 'toggle', label: '网格刻度', default: true,
    describe: '横向网格与纵轴刻度显隐' },
  { key: 'showMarkers', type: 'toggle', label: '数据点标记', default: true,
    visibleWhen: (p) => p.chartType === 'area', describe: '面积图数据点的环形标记显隐' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '分项图例显隐' },
];

const fmt = (n) => (Math.round(n * 10) / 10).toString();
const r2 = (x) => Math.round(x * 100) / 100;

/* Cardinal-spline smoothing → cubic-bezier path string (Bklit-style curves). */
function smoothPath(pts) {
  if (pts.length < 2) return pts.length ? `M ${r2(pts[0][0])},${r2(pts[0][1])}` : '';
  const k = 0.16;
  let d = `M ${r2(pts[0][0])},${r2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) * k, c1y = p1[1] + (p2[1] - p0[1]) * k;
    const c2x = p2[0] - (p3[0] - p1[0]) * k, c2y = p2[1] - (p3[1] - p1[1]) * k;
    d += ` C ${r2(c1x)},${r2(c1y)} ${r2(c2x)},${r2(c2y)} ${r2(p2[0])},${r2(p2[1])}`;
  }
  return d;
}
function areaBetween(topPts, botPts) {
  const top = smoothPath(topPts);
  const botRev = smoothPath(botPts.slice().reverse());
  return `${top} L${botRev.slice(1)} Z`;
}

/* ── Bklit-style stacked gradient area chart ── */
function AreaChart({ series, groups, fIdx, showTotals, showGrid, showMarkers, valueSuffix, palette, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1080, H = 600;
  const padL = 64, padR = 26, padT = 64, padB = 58;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = groups.length;
  const m = series.length;
  const focused = fIdx >= 0;
  const colorOf = (i) => palette[i % palette.length];

  const totals = groups.map((g) => series.reduce((s, se) => s + (g.values[se.key] || 0), 0));
  const vMax = Math.max(...totals, 1) * 1.18;
  const xBase = padL, yBase = padT + plotH;
  const xOf = (i) => (n === 1 ? padL + plotW / 2 : padL + plotW * (i / (n - 1)));
  const yOf = (v) => yBase - plotH * (v / vMax);

  // cumulative boundaries per series (bottom → top)
  const bounds = series.map((se, si) => {
    const lower = [], upper = [];
    groups.forEach((g, gi) => {
      const lo = series.slice(0, si).reduce((s, x) => s + (g.values[x.key] || 0), 0);
      const hi = lo + (g.values[se.key] || 0);
      lower.push([xOf(gi), yOf(lo)]);
      upper.push([xOf(gi), yOf(hi)]);
    });
    return { lower, upper };
  });

  const grid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {series.map((se, si) => (
          <linearGradient key={si} id={`${uid}-fill-${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorOf(si)} stopOpacity="0.62" />
            <stop offset="100%" stopColor={colorOf(si)} stopOpacity="0.05" />
          </linearGradient>
        ))}
        <filter id={`${uid}-line`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${uid}-ds`} x="-60%" y="-80%" width="220%" height="260%">
          <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* grid + y ticks */}
      {showGrid && grid.map((t, i) => {
        const y = yBase - plotH * t;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                  strokeDasharray={i === 0 ? 'none' : '2 8'} />
            <text x={padL - 14} y={y} textAnchor="end" dominantBaseline="central"
                  fontFamily="'Space Mono',monospace" fontSize="19" fill="rgba(238,243,241,0.36)">
              {fmt((vMax / 1.18) * t)}
            </text>
          </g>
        );
      })}

      {/* focus guide line */}
      {focused && (
        <line x1={xOf(fIdx)} y1={padT - 6} x2={xOf(fIdx)} y2={yBase}
              stroke={`rgba(${glow},0.42)`} strokeWidth="1.5" strokeDasharray="3 6" />
      )}

      {/* stacked bands (bottom → top) */}
      {bounds.map((b, si) => (
        <path key={si} d={areaBetween(b.upper, b.lower)} fill={`url(#${uid}-fill-${si})`}
              opacity={focused ? 0.92 : 1} />
      ))}

      {/* top stroke per band */}
      {bounds.map((b, si) => (
        <path key={`s${si}`} d={smoothPath(b.upper)} fill="none"
              stroke={colorOf(si)} strokeWidth={si === m - 1 ? 3 : 2.2}
              strokeLinecap="round" strokeLinejoin="round"
              filter={si === m - 1 ? `url(#${uid}-line)` : undefined}
              opacity={si === m - 1 ? 1 : 0.8} />
      ))}

      {/* markers on every band boundary at the focused group; subtle rings on the
          total silhouette elsewhere (Bklit ring markers) */}
      {showMarkers && groups.map((g, gi) => {
        const isF = gi === fIdx;
        if (focused && !isF) {
          // small hollow dot on the total silhouette
          const [x, y] = bounds[m - 1].upper[gi];
          return <circle key={gi} cx={x} cy={y} r="5" fill="#0b0f14"
                         stroke={colorOf(m - 1)} strokeWidth="2.6" opacity="0.7" />;
        }
        return (
          <g key={gi}>
            {bounds.map((b, si) => {
              const [x, y] = b.upper[gi];
              const big = isF;
              return <circle key={si} cx={x} cy={y} r={big ? 7.5 : 6} fill="#0b0f14"
                             stroke={colorOf(si)} strokeWidth={big ? 3.4 : 2.8}
                             filter={big ? `url(#${uid}-line)` : undefined} />;
            })}
          </g>
        );
      })}

      {/* muted total labels above each silhouette point */}
      {showTotals && !focused && groups.map((g, gi) => {
        const [x, y] = bounds[m - 1].upper[gi];
        return (
          <text key={gi} x={x} y={y - 18} textAnchor="middle"
                fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="24"
                fill="#eef3f1" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {fmt(totals[gi])}{valueSuffix}
          </text>
        );
      })}

      {/* adaptive tooltip on the focused group */}
      {focused && (() => {
        const gi = fIdx;
        const [x, y] = bounds[m - 1].upper[gi];
        const label = groups[gi].label;
        const valTxt = `${fmt(totals[gi])}${valueSuffix}`;
        const bw = 150, bh = 86;
        let bx = x - bw / 2;
        bx = Math.max(padL + 2, Math.min(W - padR - bw - 2, bx));
        let by = y - 26 - bh;
        if (by < padT - 30) by = y + 26;
        return (
          <g filter={`url(#${uid}-ds)`}>
            <rect x={bx} y={by} width={bw} height={bh} rx="16"
                  fill="rgba(13,17,22,0.96)" stroke={`rgba(${glow},0.55)`} strokeWidth="1.5" />
            <text x={bx + 18} y={by + 30} fontFamily="'Space Mono',monospace" fontSize="20"
                  fill="rgba(238,243,241,0.6)" letterSpacing="0.04em">{label}</text>
            <text x={bx + 18} y={by + 66} fontFamily="'Space Grotesk',sans-serif" fontWeight="700"
                  fontSize="38" fill="#eef3f1" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {valTxt}
            </text>
            <text x={bx + bw - 16} y={by + 30} textAnchor="end" fontFamily="'Space Mono',monospace"
                  fontSize="18" fill={`rgba(${glow},0.9)`}>合计</text>
          </g>
        );
      })()}

      {/* x labels */}
      {groups.map((g, gi) => (
        <text key={`x${gi}`} x={xOf(gi)} y={H - 22} textAnchor="middle"
              fontFamily="'Space Mono',monospace" fontSize="25"
              fill={gi === fIdx ? '#eef3f1' : 'rgba(238,243,241,0.55)'}>
          {g.label}
        </text>
      ))}
    </svg>
  );
}

/* ── stacked / normalized / grouped bar chart (alternate forms) ── */
function StackChart({ series, groups, chartType, fIdx, showTotals, showGrid, valueSuffix, palette, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1080, H = 600;
  const padL = 64, padR = 26, padT = 70, padB = 58;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = groups.length || 1;
  const m = series.length || 1;
  const norm = chartType === 'norm';
  const grouped = chartType === 'grouped';
  const focused = fIdx >= 0;

  const totals = groups.map((g) => series.reduce((s, se) => s + (g.values[se.key] || 0), 0));
  const vMax = norm ? 1 : Math.max(...totals, 1) * 1.16;
  const groupedMax = Math.max(
    ...groups.flatMap((g) => series.map((se) => g.values[se.key] || 0)), 1) * 1.16;

  const band = plotW / n;
  const yBase = padT + plotH;
  const yOf = (v, max) => yBase - plotH * (v / max);
  const colorOf = (i) => palette[i % palette.length];
  const grid = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showGrid && grid.map((t, i) => {
        const y = yBase - plotH * t;
        const lbl = norm ? `${Math.round(t * 100)}%` : fmt((vMax / 1.16) * t);
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray={i === 0 ? 'none' : '2 8'} />
            <text x={padL - 14} y={y} textAnchor="end" dominantBaseline="central"
                  fontFamily="'Space Mono',monospace" fontSize="19" fill="rgba(238,243,241,0.36)">
              {lbl}
            </text>
          </g>
        );
      })}

      {groups.map((g, gi) => {
        const cx0 = padL + band * (gi + 0.5);
        const dim = focused && gi !== fIdx;
        const isF = gi === fIdx;
        const total = totals[gi] || 1;

        if (grouped) {
          const inner = band * 0.74;
          const bw = inner / m;
          return (
            <g key={gi} opacity={dim ? 0.34 : 1}>
              {series.map((se, si) => {
                const v = g.values[se.key] || 0;
                const x = cx0 - inner / 2 + bw * si + bw * 0.12;
                const y = yOf(v, groupedMax);
                const h = yBase - y;
                return (
                  <rect key={si} x={x} y={y} width={bw * 0.76} height={Math.max(h, 2)} rx="6"
                        fill={colorOf(si)}
                        filter={!dim && (isF || !focused) ? `url(#${uid}-g)` : undefined} />
                );
              })}
              {showTotals && (
                <text x={cx0} y={yOf(Math.max(...series.map((se) => g.values[se.key] || 0)), groupedMax) - 16}
                      textAnchor="middle" fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="24"
                      fill={isF ? colorOf(0) : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(total)}{valueSuffix}
                </text>
              )}
            </g>
          );
        }

        const bw = Math.min(band * 0.5, 118);
        let acc = 0;
        return (
          <g key={gi} opacity={dim ? 0.34 : 1}>
            {series.map((se, si) => {
              const raw = g.values[se.key] || 0;
              const v = norm ? raw / total : raw;
              const yA = yOf(acc, vMax);
              const yB = yOf(acc + v, vMax);
              acc += v;
              const h = yA - yB;
              if (h < 0.5) return null;
              const isLast = si === series.length - 1;
              const isFirst = si === 0;
              const rr = (isFirst || isLast) ? 9 : 0;
              return (
                <path key={si}
                      d={roundedSeg(cx0 - bw / 2, yB, bw, h, isLast ? rr : 0, isFirst ? rr : 0)}
                      fill={colorOf(si)}
                      filter={!dim && (isF || !focused) ? `url(#${uid}-g)` : undefined} />
              );
            })}
            {showTotals && !norm && (
              <text x={cx0} y={yOf(total, vMax) - 16} textAnchor="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="27"
                    fill={isF ? colorOf(2) : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmt(total)}{valueSuffix}
              </text>
            )}
          </g>
        );
      })}

      {groups.map((g, gi) => (
        <text key={`x${gi}`} x={padL + band * (gi + 0.5)} y={H - 22} textAnchor="middle"
              fontFamily="'Space Mono',monospace" fontSize="25"
              fill={gi === fIdx ? '#eef3f1' : 'rgba(238,243,241,0.55)'}>
          {g.label}
        </text>
      ))}
    </svg>
  );
}

/* rounded rect with independently-rounded top and bottom corners (segment). */
function roundedSeg(x, y, w, h, rTop, rBot) {
  const rt = Math.min(rTop, w / 2, h / 2);
  const rb = Math.min(rBot, w / 2, h / 2);
  return [
    `M ${x + rt},${y}`,
    `H ${x + w - rt}`,
    rt ? `Q ${x + w},${y} ${x + w},${y + rt}` : `H ${x + w}`,
    `V ${y + h - rb}`,
    rb ? `Q ${x + w},${y + h} ${x + w - rb},${y + h}` : `V ${y + h}`,
    `H ${x + rb}`,
    rb ? `Q ${x},${y + h} ${x},${y + h - rb}` : `H ${x}`,
    `V ${y + rt}`,
    rt ? `Q ${x},${y} ${x + rt},${y}` : `V ${y}`,
    'Z',
  ].join(' ');
}

export function SlideStackedBar(props) {
  const p = { ...slideStackedBarDefaults, ...props };
  const sc = p.gxnScheme || {};
  const glow = sc.glow || '47,224,127';
  const palette = sc.palette || ['#2fe07f', '#2fe0c4', '#4ea2ff', '#9b7dff', '#b9f24a', '#ff6fae'];

  const count = Math.max(2, Math.min(p.groups.length, p.groupCount));
  const groups = p.groups.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const series = p.series;
  const isArea = p.chartType === 'area';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "36 / 39"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 26, minHeight: 0, display: 'grid',
          gridTemplateColumns: p.showLegend ? '1fr 322px' : '1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isArea ? (
              <AreaChart series={series} groups={groups} fIdx={fIdx}
                         showTotals={p.showTotals} showGrid={p.showGrid} showMarkers={p.showMarkers}
                         valueSuffix={p.valueSuffix} palette={palette} glow={glow} />
            ) : (
              <StackChart series={series} groups={groups} chartType={p.chartType} fIdx={fIdx}
                          showTotals={p.showTotals} showGrid={p.showGrid}
                          valueSuffix={p.valueSuffix} palette={palette} glow={glow} />
            )}
          </div>

          {p.showLegend && (
            <Legend series={series} groups={groups} fIdx={fIdx} palette={palette}
                    valueSuffix={p.valueSuffix} />
          )}
        </div>
      </div>
    </div>
  );
}

/* Bklit-style composable legend: title + rows of marker · label · value. */
function Legend({ series, groups, fIdx, palette, valueSuffix }) {
  const src = fIdx >= 0 ? groups[fIdx] : null;
  const total = src
    ? series.reduce((s, x) => s + (src.values[x.key] || 0), 0)
    : groups.reduce((s, g) => s + series.reduce((t, x) => t + (g.values[x.key] || 0), 0), 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <span className="gxn-mono" style={{ fontSize: 21, color: 'var(--gxn-faint)', letterSpacing: '.12em' }}>分项构成</span>
        <span className="gxn-mono" style={{ fontSize: 19, color: 'var(--gxn-faint)' }}>
          {src ? src.label : '全期'}
        </span>
      </div>
      {series.map((se, si) => {
        const c = palette[si % palette.length];
        const v = src ? (src.values[se.key] || 0) : groups.reduce((s, g) => s + (g.values[se.key] || 0), 0);
        const pct = Math.round((v / (total || 1)) * 100);
        return (
          <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '17px 4px',
            borderBottom: '1px solid var(--gxn-line)' }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: c, flex: '0 0 auto',
              boxShadow: `0 0 14px -1px ${c}` }} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 25, fontWeight: 500, color: 'var(--gxn-text)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{se.label}</span>
            <span className="gxn-num" style={{ fontSize: 22, color: 'var(--gxn-faint)', fontWeight: 500,
              whiteSpace: 'nowrap' }}>{fmt(v)}{valueSuffix}</span>
            <span className="gxn-num" style={{ width: 62, textAlign: 'right', fontSize: 26, fontWeight: 600,
              color: c, whiteSpace: 'nowrap' }}>{pct}%</span>
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px 0' }}>
        <span className="gxn-mono" style={{ fontSize: 21, color: 'var(--gxn-dim)', letterSpacing: '.06em' }}>合计</span>
        <span className="gxn-num" style={{ fontSize: 34, fontWeight: 700, color: 'var(--gxn-text)' }}>
          {fmt(total)}<span style={{ fontSize: '0.6em', marginLeft: 4, color: 'var(--gxn-dim)' }}>{valueSuffix}</span>
        </span>
      </div>
    </div>
  );
}

export default SlideStackedBar;
