/**
 * SlideStream.jsx — 主题河流（图表页 · 流式堆叠面积 / ThemeRiver）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 把多条「构成型」时间序列叠成一条会呼吸的河——各分项的带宽随时间此消彼长，
 * 默认以中心基线对称展开（wiggle，即 ThemeRiver），亦可切回底部堆叠。平滑样条
 * 带 + 分项渐变填充 + 顶缘描边 + 焦点辉光与峰值读数。一图读出「谁在涨、谁在退、
 * 节律何时被推高」。内联 SVG，仅依赖 props（含可选 gxnScheme 调色），无预览运行时耦合。
 *
 * ── Props (see slideStreamDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   series       Array<{key,label}>            分项（图例 + 颜色顺序，自下而上）
 *   groups       Array<{label, values:{}}>     各时点：分项 key → 数值
 *   pointCount   number   展示的时点数量（4–n）
 *   baseline     'center' | 'bottom'   中心对称基线(河流) / 底部堆叠
 *   focusEnabled boolean  辉光强调某一条带（其余淡出 + 峰值读数）
 *   focusIndex   number   0-based 被强调分项
 *   showBaseline boolean  中心基线 / 底轴显隐
 *   showAxis     boolean  时点刻度标签显隐
 *   showPeak     boolean  焦点带峰值读数显隐
 *   showLegend   boolean  右侧分项图例显隐
 *   valueSuffix  string   数值单位后缀（如 '亿'）
 *   gxnScheme    object?  { palette, glow } 调色（缺省走主题调色板）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideStreamDefaults = {
  kicker: 'STREAM · 月度赛道节律',
  title: '一条会呼吸的 ',
  titleEm: '资本河流',
  lead: '把全年每月的 AI 融资额按赛道叠成一条河——河面越宽，当月吸金越多。通用大模型始终是最厚的主流，并在年末把整条河推向峰值。',
  series: [
    { key: 'llm', label: '通用大模型' },
    { key: 'app', label: '应用层' },
    { key: 'infra', label: 'AI 基础设施' },
    { key: 'chip', label: 'AI 芯片' },
  ],
  // 源：报告 3.x 月度赛道融资额（亿美元，示意分解）
  groups: [
    { label: '01', values: { llm: 28, app: 14, infra: 12, chip: 6 } },
    { label: '02', values: { llm: 22, app: 12, infra: 10, chip: 5 } },
    { label: '03', values: { llm: 41, app: 18, infra: 16, chip: 8 } },
    { label: '04', values: { llm: 35, app: 20, infra: 15, chip: 7 } },
    { label: '05', values: { llm: 52, app: 24, infra: 22, chip: 10 } },
    { label: '06', values: { llm: 44, app: 26, infra: 20, chip: 9 } },
    { label: '07', values: { llm: 38, app: 22, infra: 18, chip: 8 } },
    { label: '08', values: { llm: 30, app: 19, infra: 15, chip: 7 } },
    { label: '09', values: { llm: 58, app: 30, infra: 26, chip: 12 } },
    { label: '10', values: { llm: 49, app: 28, infra: 24, chip: 11 } },
    { label: '11', values: { llm: 66, app: 34, infra: 30, chip: 14 } },
    { label: '12', values: { llm: 72, app: 40, infra: 33, chip: 16 } },
  ],
  pointCount: 12,
  baseline: 'center',
  focusEnabled: true,
  focusIndex: 0,
  showBaseline: true,
  showAxis: true,
  showPeak: true,
  showLegend: true,
  valueSuffix: '亿',
};

export const slideStreamControls = [
  { key: 'baseline', type: 'enum', label: '基线形态', default: 'center',
    options: [{ value: 'center', label: '中心河流' }, { value: 'bottom', label: '底部堆叠' }],
    describe: '中心对称基线(ThemeRiver) / 底部堆叠面积' },
  { key: 'pointCount', type: 'number', label: '时点数量', default: 12, min: 4, step: 1,
    maxFrom: (p) => (p.groups ? p.groups.length : 12), describe: '展示的时点（月/期）数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一条带（其余淡出 + 峰值读数）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.series ? p.series.length : 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调分项的序号' },
  { key: 'showBaseline', type: 'toggle', label: '基线', default: true,
    describe: '中心基线 / 底轴显隐' },
  { key: 'showAxis', type: 'toggle', label: '时点刻度', default: true,
    describe: '横轴时点标签显隐' },
  { key: 'showPeak', type: 'toggle', label: '峰值读数', default: true,
    visibleWhen: (p) => p.focusEnabled, describe: '焦点带峰值数值显隐' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '右侧分项图例显隐' },
];

const fmt = (n) => (Math.round(n * 10) / 10).toString();
const r2 = (x) => Math.round(x * 100) / 100;

/* Cardinal-spline smoothing → cubic-bezier path string. */
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

function StreamChart({ series, groups, baseline, fIdx, showBaseline, showAxis, showPeak,
                      valueSuffix, palette, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1180, H = 600;
  const padL = 54, padR = 44, padT = 60, padB = 56;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = groups.length, m = series.length;
  const focused = fIdx >= 0;
  const colorOf = (i) => palette[i % palette.length];

  const totals = groups.map((g) => series.reduce((s, se) => s + (g.values[se.key] || 0), 0));
  const vMax = Math.max(...totals, 1);
  const sc = (plotH * 0.86) / vMax;
  const centerY = padT + plotH / 2;
  const yBase = padT + plotH;
  const xOf = (i) => (n === 1 ? padL + plotW / 2 : padL + plotW * (i / (n - 1)));
  const yCum = (cum, total) => (baseline === 'center' ? centerY + (total / 2 - cum) * sc : yBase - cum * sc);

  // cumulative band boundaries (series order = bottom → top of stack)
  const bands = series.map((se, si) => {
    const lower = [], upper = [];
    groups.forEach((g, gi) => {
      const lo = series.slice(0, si).reduce((a, x) => a + (g.values[x.key] || 0), 0);
      const hi = lo + (g.values[se.key] || 0);
      lower.push([xOf(gi), yCum(lo, totals[gi])]);
      upper.push([xOf(gi), yCum(hi, totals[gi])]);
    });
    return { lower, upper, se, si };
  });

  // peak of focused band
  let peak = null;
  if (focused) {
    let gi = 0, best = -Infinity;
    groups.forEach((g, i) => { const v = g.values[series[fIdx].key] || 0; if (v > best) { best = v; gi = i; } });
    const x = xOf(gi);
    const my = (bands[fIdx].lower[gi][1] + bands[fIdx].upper[gi][1]) / 2;
    peak = { x, y: my, value: best, label: groups[gi].label };
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {series.map((se, si) => (
          <linearGradient key={si} id={`${uid}-fill-${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorOf(si)} stopOpacity="0.78" />
            <stop offset="100%" stopColor={colorOf(si)} stopOpacity="0.32" />
          </linearGradient>
        ))}
        <filter id={`${uid}-glow`} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${uid}-ds`} x="-60%" y="-120%" width="220%" height="340%">
          <feDropShadow dx="0" dy="6" stdDeviation="9" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* baseline */}
      {showBaseline && (
        <line x1={padL} y1={baseline === 'center' ? centerY : yBase}
              x2={W - padR} y2={baseline === 'center' ? centerY : yBase}
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"
              strokeDasharray={baseline === 'center' ? '2 9' : 'none'} />
      )}

      {/* focus guide line */}
      {focused && peak && (
        <line x1={peak.x} y1={padT - 4} x2={peak.x} y2={yBase}
              stroke={`rgba(${glow},0.4)`} strokeWidth="1.5" strokeDasharray="3 6" />
      )}

      {/* filled bands */}
      {bands.map((b, si) => {
        const dim = focused && si !== fIdx;
        return (
          <path key={si} d={areaBetween(b.upper, b.lower)} fill={`url(#${uid}-fill-${si})`}
                opacity={dim ? 0.26 : 1} />
        );
      })}

      {/* top edge stroke per band */}
      {bands.map((b, si) => {
        const isF = si === fIdx;
        const dim = focused && !isF;
        return (
          <path key={`s${si}`} d={smoothPath(b.upper)} fill="none"
                stroke={colorOf(si)} strokeWidth={isF ? 3.4 : 2}
                strokeLinecap="round" strokeLinejoin="round"
                opacity={dim ? 0.3 : 0.95}
                filter={isF ? `url(#${uid}-glow)` : undefined} />
        );
      })}

      {/* peak readout on focused band */}
      {focused && showPeak && peak && (() => {
        const txt = `${fmt(peak.value)}${valueSuffix}`;
        const bw = txt.length * 16 + 40, bh = 52;
        let bx = peak.x - bw / 2;
        bx = Math.max(padL + 2, Math.min(W - padR - bw - 2, bx));
        const by = Math.max(padT - 8, peak.y - bh - 16);
        return (
          <g filter={`url(#${uid}-ds)`}>
            <rect x={bx} y={by} width={bw} height={bh} rx="14"
                  fill="rgba(13,17,22,0.96)" stroke={colorOf(fIdx)} strokeWidth="1.8" />
            <circle cx={bx + 22} cy={by + bh / 2} r="6" fill={colorOf(fIdx)} />
            <text x={bx + 38} y={by + bh / 2 + 1} dominantBaseline="central"
                  fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="28"
                  fill="#eef3f1" style={{ fontVariantNumeric: 'tabular-nums' }}>{txt}</text>
            <circle cx={peak.x} cy={peak.y} r="7" fill="#0b0f14" stroke={colorOf(fIdx)} strokeWidth="3.4"
                    filter={`url(#${uid}-glow)`} />
          </g>
        );
      })()}

      {/* x axis labels */}
      {showAxis && groups.map((g, gi) => (
        <text key={`x${gi}`} x={xOf(gi)} y={H - 18} textAnchor="middle"
              fontFamily="'Space Mono',monospace" fontSize="23"
              fill={focused && peak && gi === Math.round((peak.x - padL) / (plotW / Math.max(n - 1, 1)))
                ? '#eef3f1' : 'rgba(238,243,241,0.5)'}>
          {g.label}
        </text>
      ))}
    </svg>
  );
}

/* Composable legend: marker · label · 全期合计. */
function StreamLegend({ series, groups, fIdx, palette, valueSuffix }) {
  const totalAll = groups.reduce((s, g) => s + series.reduce((t, x) => t + (g.values[x.key] || 0), 0), 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="gxn-mono" style={{ fontSize: 21, color: 'var(--gxn-faint)', letterSpacing: '.12em' }}>分项 · 全期</span>
      </div>
      {series.map((se, si) => {
        const c = palette[si % palette.length];
        const v = groups.reduce((s, g) => s + (g.values[se.key] || 0), 0);
        const pct = Math.round((v / (totalAll || 1)) * 100);
        const isF = si === fIdx;
        return (
          <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '17px 4px',
            borderBottom: '1px solid var(--gxn-line)', opacity: fIdx >= 0 && !isF ? 0.5 : 1,
            transition: 'opacity .3s ease' }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: c, flex: '0 0 auto',
              boxShadow: `0 0 14px -1px ${c}` }} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 25, fontWeight: isF ? 700 : 500,
              color: isF ? c : 'var(--gxn-text)', whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis' }}>{se.label}</span>
            <span className="gxn-num" style={{ fontSize: 22, color: 'var(--gxn-faint)', fontWeight: 500,
              whiteSpace: 'nowrap' }}>{fmt(v)}{valueSuffix}</span>
            <span className="gxn-num" style={{ width: 56, textAlign: 'right', fontSize: 26, fontWeight: 600,
              color: c, whiteSpace: 'nowrap' }}>{pct}%</span>
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 4px 0' }}>
        <span className="gxn-mono" style={{ fontSize: 21, color: 'var(--gxn-dim)', letterSpacing: '.06em' }}>合计</span>
        <span className="gxn-num" style={{ fontSize: 34, fontWeight: 700, color: 'var(--gxn-text)' }}>
          {fmt(totalAll)}<span style={{ fontSize: '0.6em', marginLeft: 4, color: 'var(--gxn-dim)' }}>{valueSuffix}</span>
        </span>
      </div>
    </div>
  );
}

export function SlideStream(props) {
  const p = { ...slideStreamDefaults, ...props };
  const sc = p.gxnScheme || {};
  const glow = sc.glow || '47,224,127';
  const palette = sc.palette || ['#2fe07f', '#2fe0c4', '#4ea2ff', '#9b7dff', '#b9f24a', '#ff6fae'];

  const count = Math.max(4, Math.min(p.groups.length, p.pointCount));
  const groups = p.groups.slice(0, count);
  const series = p.series;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(series.length - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '57 / 69'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, minHeight: 0, display: 'grid',
          gridTemplateColumns: p.showLegend ? '1fr 320px' : '1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StreamChart series={series} groups={groups} baseline={p.baseline} fIdx={fIdx}
                         showBaseline={p.showBaseline} showAxis={p.showAxis} showPeak={p.showPeak}
                         valueSuffix={p.valueSuffix} palette={palette} glow={glow} />
          </div>
          {p.showLegend && (
            <StreamLegend series={series} groups={groups} fIdx={fIdx} palette={palette}
                          valueSuffix={p.valueSuffix} />
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideStream;
