/**
 * SlideSlope.jsx — 斜率图（图表页 · Slope / 平行坐标）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 斜率图：左右两条数值轴，每个条目一条连线，把「左指标 → 右指标」的份额迁移
 * 画成斜率。线越陡上扬，代表该类别在右侧维度上被显著放大——用来讲「少数后期
 * 轮次吃掉多数资本」最直观。内联 SVG，仅依赖 props。
 *
 * ── Props (see slideSlopeDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   leftLabel, rightLabel  string   两轴标题
 *   items        Array<{label, left, right}>  left/right 为同尺度数值（如份额%）
 *   unit         string   数值单位（如 “%”）
 *   itemCount    number   展示的条目数量（2–n）
 *   focusEnabled boolean  辉光强调某一条（其余淡出）
 *   focusIndex   number   0-based 被强调条目
 *   showDots     boolean  端点圆点显隐
 *   showValueLabels boolean 端点数值显隐
 *   showDelta    boolean  右侧变化量徽章显隐
 *   gxnScheme    object?  { palette, accent, cool, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideSlopeDefaults = {
  kicker: 'SLOPE · 赢家通吃',
  title: '从「笔数」到「金额」',
  titleEm: '',
  lead: '同样 97 笔融资，按笔数还算分散；可一旦换算成金额，后期与未披露轮次便陡然放大——少数大额轮次吸走多数资本。',
  leftLabel: '事件笔数 份额',
  rightLabel: '融资金额 份额',
  // 源：报告 3.2 轮次结构。金额 = 笔数 × 平均单笔，再换算份额（%）
  items: [
    { label: '种子轮', left: 8.2, right: 1.0 },
    { label: 'A 轮', left: 12.4, right: 2.3 },
    { label: 'B 轮', left: 18.6, right: 6.7 },
    { label: 'C 轮', left: 15.5, right: 10.9 },
    { label: 'D 轮及以后', left: 22.7, right: 35.6 },
    { label: '未披露轮次', left: 22.7, right: 43.5 },
  ],
  unit: '%',
  itemCount: 6,
  focusEnabled: true,
  focusIndex: 5,
  showDots: true,
  showValueLabels: true,
  showDelta: true,
};

export const slideSlopeControls = [
  { key: 'itemCount', type: 'number', label: '条目数量', default: 6, min: 2, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 6), describe: '斜率图展示的条目数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一条（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 5, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调条目的序号' },
  { key: 'showDots', type: 'toggle', label: '端点圆点', default: true, describe: '两端圆点显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '端点数值', default: true, describe: '两端数值显隐' },
  { key: 'showDelta', type: 'toggle', label: '变化徽章', default: true, describe: '右侧变化量徽章显隐' },
];

function Slope({ items, unit, leftLabel, rightLabel, fIdx, showDots, showValueLabels, palette, accent, cool, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1340, H = 452;
  const padT = 52, padB = 40;
  const xL = 376, xR = W - 168;
  const plotH = H - padT - padB;
  const vMax = Math.max(...items.flatMap((d) => [d.left, d.right]), 1) * 1.08;
  const yV = (v) => padT + plotH * (1 - v / vMax);
  const focused = fIdx >= 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* axes */}
      <line x1={xL} y1={padT - 18} x2={xL} y2={H - padB + 8} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1={xR} y1={padT - 18} x2={xR} y2={H - padB + 8} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <text x={xL} y={padT - 32} textAnchor="middle" fontFamily="'Space Mono',monospace" fontSize="23"
            fill="rgba(238,243,241,0.65)" letterSpacing="0.04em">{leftLabel}</text>
      <text x={xR} y={padT - 32} textAnchor="middle" fontFamily="'Space Mono',monospace" fontSize="23"
            fill="rgba(238,243,241,0.65)" letterSpacing="0.04em">{rightLabel}</text>

      {items.map((d, i) => {
        const c = palette[i % palette.length];
        const isF = i === fIdx; const dim = focused && !isF;
        const yl = yV(d.left), yr = yV(d.right);
        const up = d.right > d.left;
        return (
          <g key={i} opacity={dim ? 0.26 : 1}>
            <line x1={xL} y1={yl} x2={xR} y2={yr} stroke={c} strokeWidth={isF ? 5 : 3}
                  strokeLinecap="round" filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showDots && (
              <>
                <circle cx={xL} cy={yl} r={isF ? 9 : 6.5} fill="#10141b" stroke={c} strokeWidth={isF ? 4 : 3} />
                <circle cx={xR} cy={yr} r={isF ? 9 : 6.5} fill="#10141b" stroke={c} strokeWidth={isF ? 4 : 3} />
              </>
            )}
            {/* left side: label + value */}
            <text x={xL - 26} y={yl} textAnchor="end" dominantBaseline="middle"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 500} fontSize="25"
                  fill={isF ? '#eef3f1' : 'rgba(238,243,241,0.7)'}>
              {d.label}{showValueLabels ? ` · ${d.left}${unit}` : ''}
            </text>
            {/* right side: value */}
            {showValueLabels && (
              <text x={xR + 26} y={yr} textAnchor="start" dominantBaseline="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="26"
                    fill={isF ? c : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
                {d.right}{unit}
                <tspan dx="8" fontSize="20" fill={up ? accent : '#ff6fae'}>{up ? '▲' : '▼'}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SlideSlope(props) {
  const p = { ...slideSlopeDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const accent = sc.accent || '#2fe07f';
  const cool = sc.cool || '#4ea2ff';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const items = p.items.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const fb = fIdx >= 0 ? items[fIdx] : null;
  const delta = fb ? (fb.right - fb.left) : 0;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '08 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1280 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 16, minHeight: 0, position: 'relative' }}>
          <Slope items={items} unit={p.unit} leftLabel={p.leftLabel} rightLabel={p.rightLabel} fIdx={fIdx}
                 showDots={p.showDots} showValueLabels={p.showValueLabels}
                 palette={palette} accent={accent} cool={cool} glow={glow} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 24, marginTop: 8 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 线越陡上扬，份额被放大越多——资本向后期高度集中
          </span>
          {p.showDelta && fb && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fb.label}</strong>
              {' '}金额份额 {delta >= 0 ? '放大' : '回落'}{' '}
              <strong style={{ color: delta >= 0 ? 'var(--gxn-accent)' : '#ff6fae', fontWeight: 700 }}>
                {delta >= 0 ? '+' : '−'}{Math.abs(delta).toFixed(1)}{p.unit}
              </strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideSlope;
