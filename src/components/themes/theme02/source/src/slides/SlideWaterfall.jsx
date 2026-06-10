/**
 * SlideWaterfall.jsx — 资本桥（图表页 · 瀑布图）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 瀑布 / 桥接图：从一个基准总额出发，逐项加减各赛道的贡献，最终汇成本年总额。
 * 浮动条 + 虚线连接器 + 逐项有符号数值，直观呈现“总额是怎么搭起来的”。
 * 图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideWaterfallDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   bars         Array<{label, value, type}>  type: 'total' | 'inc' | 'dec'
 *                'total' 为绝对锚定条（落地基线）；'inc'/'dec' 为浮动增减条。
 *   unit         string   数值单位（如 “十亿美元”）
 *   barCount     number   展示的条目数量（2–n）
 *   focusEnabled boolean  辉光强调某一条（其余淡出）
 *   focusIndex   number   0-based 被强调条目
 *   showConnector boolean 浮动条之间的虚线连接器显隐
 *   showValueLabels boolean 条上方有符号数值显隐
 *   showGrid     boolean  水平网格 + 刻度显隐
 *   gxnScheme    object?  { accent, accent2, cool, glow } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideWaterfallDefaults = {
  kicker: 'BRIDGE · 资本桥',
  title: '本年总额 ',
  titleEm: '是怎么搭起来的',
  lead: '以 2023 年基数为起点，逐层叠加各赛道的资本增减，桥接出 2024 年美国 AI 大额融资总盘。',
  bars: [
    { label: '2023 基数', value: 96, type: 'total' },
    { label: '基础设施层', value: 58, type: 'inc' },
    { label: '模型层', value: 41, type: 'inc' },
    { label: '应用层回落', value: -12, type: 'dec' },
    { label: '其它赛道', value: 9, type: 'inc' },
    { label: '2024 总额', value: 192, type: 'total' },
  ],
  unit: '十亿美元',
  barCount: 6,
  focusEnabled: true,
  focusIndex: 1,
  showConnector: true,
  showValueLabels: true,
  showGrid: true,
};

export const slideWaterfallControls = [
  { key: 'barCount', type: 'number', label: '条目数量', default: 6, min: 2, step: 1,
    maxFrom: (p) => (p.bars ? p.bars.length : 6), describe: '瀑布图展示的条目数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一条（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 1, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.barCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调条目的序号' },
  { key: 'showConnector', type: 'toggle', label: '连接器', default: true,
    describe: '浮动条之间的虚线连接器显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true,
    describe: '条上方有符号数值显隐' },
  { key: 'showGrid', type: 'toggle', label: '网格刻度', default: true,
    describe: '水平网格与刻度显隐' },
];

function Waterfall({ bars, unit, fIdx, showConnector, showValueLabels, showGrid, accent, accent2, cool, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1240, H = 568;
  const padL = 78, padR = 30, padT = 70, padB = 96;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const n = bars.length;

  // running cumulative → each bar's [lo, hi] in value space + exit level
  let cum = 0;
  const segs = bars.map((b) => {
    let lo, hi, exit;
    if (b.type === 'total') { lo = 0; hi = b.value; cum = b.value; exit = b.value; }
    else { const s = cum; const e = cum + b.value; lo = Math.min(s, e); hi = Math.max(s, e); cum = e; exit = e; }
    return { ...b, lo, hi, exit };
  });
  const vMax = Math.max(...segs.map((s) => s.hi), 1) * 1.14;
  const band = plotW / n;
  const bw = Math.min(band * 0.52, 116);
  const xMid = (i) => padL + band * (i + 0.5);
  const yV = (v) => padT + plotH * (1 - v / vMax);
  const focused = fIdx >= 0;

  const colorOf = (b) => (b.type === 'total' ? cool : b.type === 'dec' ? '#ff6fae' : accent);
  const gridT = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${uid}-inc`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent2} /><stop offset="100%" stopColor={accent} />
        </linearGradient>
        <linearGradient id={`${uid}-tot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe6ff" /><stop offset="100%" stopColor={cool} />
        </linearGradient>
        <linearGradient id={`${uid}-dec`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffa6cf" /><stop offset="100%" stopColor="#ff6fae" />
        </linearGradient>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showGrid && gridT.map((t, i) => {
        const y = padT + plotH * t;
        const v = Math.round(vMax * (1 - t));
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={padL - 16} y={y} textAnchor="end" dominantBaseline="middle"
                  fontFamily="'Space Mono',monospace" fontSize="23" fill="rgba(238,243,241,0.5)">{v}</text>
          </g>
        );
      })}
      {/* baseline */}
      <line x1={padL} y1={yV(0)} x2={W - padR} y2={yV(0)} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* connectors between consecutive bars at the exit level of bar i */}
      {showConnector && segs.slice(0, -1).map((s, i) => {
        const y = yV(s.exit);
        const x1 = xMid(i) + bw / 2, x2 = xMid(i + 1) - bw / 2;
        return (
          <line key={`c${i}`} x1={x1} y1={y} x2={x2} y2={y}
                stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
        );
      })}

      {/* bars */}
      {segs.map((s, i) => {
        const x = xMid(i) - bw / 2;
        const y = yV(s.hi), h = Math.max(yV(s.lo) - yV(s.hi), 3);
        const c = colorOf(s);
        const fillId = s.type === 'total' ? `${uid}-tot` : s.type === 'dec' ? `${uid}-dec` : `${uid}-inc`;
        const isF = i === fIdx; const dim = focused && !isF;
        return (
          <g key={i} opacity={dim ? 0.3 : 1}>
            <rect x={x} y={y} width={bw} height={h} rx="9" fill={`url(#${fillId})`}
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showValueLabels && (
              <text x={xMid(i)} y={y - 16} textAnchor="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="26"
                    fill={isF ? c : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {s.type === 'total' ? s.value : (s.value > 0 ? `+${s.value}` : `−${Math.abs(s.value)}`)}
              </text>
            )}
            <text x={xMid(i)} y={H - padB + 36} textAnchor="middle"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 500} fontSize="24"
                  fill={isF ? '#eef3f1' : 'rgba(238,243,241,0.6)'}>
              {s.label}
            </text>
          </g>
        );
      })}

      <text x={padL - 16} y={padT - 30} textAnchor="start"
            fontFamily="'Space Mono',monospace" fontSize="22" fill="rgba(238,243,241,0.5)">{unit}</text>
    </svg>
  );
}

export function SlideWaterfall(props) {
  const p = { ...slideWaterfallDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';
  const accent2 = sc.accent2 || '#b9f24a';
  const cool = sc.cool || '#4ea2ff';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.bars.length, p.barCount));
  const bars = p.bars.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const fb = fIdx >= 0 ? bars[fIdx] : null;

  // recompute focus delta context
  let cum = 0; const exits = bars.map((b) => { cum = b.type === 'total' ? b.value : cum + b.value; return cum; });

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '24 / 35'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 22, minHeight: 0, position: 'relative' }}>
          <Waterfall bars={bars} unit={p.unit} fIdx={fIdx}
                     showConnector={p.showConnector} showValueLabels={p.showValueLabels} showGrid={p.showGrid}
                     accent={accent} accent2={accent2} cool={cool} glow={glow} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, marginTop: 4 }}>
          <div style={{ display: 'flex', gap: 30 }}>
            {[{ c: cool, t: '锚定总额' }, { c: accent, t: '资本增量' }, { c: '#ff6fae', t: '资本回落' }].map((l, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 16, height: 16, borderRadius: 5, background: l.c, boxShadow: `0 0 16px -2px ${l.c}` }} />
                <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{l.t}</span>
              </span>
            ))}
          </div>
          {fb && fb.type !== 'total' && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fb.label}</strong>
              {' '}贡献 {fb.value > 0 ? `+${fb.value}` : `−${Math.abs(fb.value)}`} {p.unit}
            </span>
          )}
          {fb && fb.type === 'total' && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fb.label}</strong>
              {' '}锚定 {fb.value} {p.unit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideWaterfall;
