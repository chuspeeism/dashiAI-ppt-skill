/**
 * SlideBubbleTimeline.jsx — 月度气泡（图表页 · 时间轴气泡）.
 * Independent, prop-driven. Renders its own theme styles and an inline SVG.
 *
 * A row of bubbles positioned along a month axis, area-encoded by value
 * (radius ∝ √value) — good for reading seasonality / peaks at a glance.
 * One point can be emphasised; value labels and the interpretation note are
 * toggleable.
 *
 * ── Props (see slideBubbleTimelineDefaults) ─────────────────────────────────
 *   kicker, title, titleEm             strings
 *   data         Array<{label,value}>   the monthly series
 *   valueSuffix  string   unit suffix on labels
 *   focusEnabled boolean  emphasise one bubble
 *   focusIndex   number   0-based point to emphasise
 *   showValueLabels boolean show numeric labels above bubbles
 *   showAnnotation boolean  show the interpretation note
 *   annotation   string   interpretation text
 *   gxnScheme    object   deck color scheme (accent / accent2 / glow)
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideBubbleTimelineDefaults = {
  kicker: 'MARKET · 月度节奏',
  title: '逐月融资额 ',
  titleEm: '双峰脉冲',
  data: [
    { label: '1月', value: 45 }, { label: '2月', value: 58 }, { label: '3月', value: 59 },
    { label: '4月', value: 86 }, { label: '5月', value: 105 }, { label: '6月', value: 93 },
    { label: '7月', value: 92 }, { label: '8月', value: 118 }, { label: '9月', value: 108 },
    { label: '10月', value: 73 }, { label: '11月', value: 81 }, { label: '12月', value: 52 },
  ],
  valueSuffix: '亿',
  focusEnabled: true,
  focusIndex: 7,
  showValueLabels: true,
  showAnnotation: true,
  annotation: '5 月与 8 月形成两次峰值，与多家头部公司集中关账有关；年末回落但仍高于上半年，节奏呈「双峰脉冲」。',
};

export const slideBubbleTimelineControls = [
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一月份' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 7, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.data ? p.data.length : 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调月份的序号' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true,
    describe: '在气泡上显示具体数值' },
  { key: 'showAnnotation', type: 'toggle', label: '解读文案', default: true,
    describe: '显示/隐藏趋势解读' },
];

function Bubbles({ data, valueSuffix, focusIndex, showValueLabels, accent, accent2, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const ACC = accent || '#2fe07f';
  const ACC2 = accent2 || '#b9f24a';
  const GLOW = glow || '47,224,127';
  const n = data.length || 1;
  const W = 1180, H = 470;
  const padL = 30, padR = 30, baseY = H * 0.56;
  const band = (W - padL - padR) / n;
  const cxs = (i) => padL + band * (i + 0.5);
  const vMax = Math.max(...data.map((d) => d.value), 1);
  const rMax = Math.min(band * 0.46, 46);
  const rOf = (v) => Math.max(14, rMax * Math.sqrt(v / vMax));
  const focused = focusIndex >= 0 && focusIndex < n;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`${uid}-fill`} cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor={ACC2} stopOpacity="0.95" />
          <stop offset="100%" stopColor={ACC} stopOpacity="0.7" />
        </radialGradient>
        <filter id={`${uid}-g`} x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* baseline */}
      <line x1={padL} y1={baseY} x2={W - padR} y2={baseY} stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

      {data.map((d, i) => {
        const cx = cxs(i), r = rOf(d.value);
        const isF = i === focusIndex;
        const dim = focused && !isF;
        return (
          <g key={i} opacity={dim ? 0.34 : 1}>
            <circle cx={cx} cy={baseY} r={r}
                    fill={`url(#${uid}-fill)`} stroke={isF ? ACC2 : 'rgba(255,255,255,0.25)'}
                    strokeWidth={isF ? 3 : 1.5}
                    filter={!dim ? `url(#${uid}-g)` : undefined} />
            {showValueLabels && (
              <text x={cx} y={baseY - r - 16} textAnchor="middle"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight={isF ? 700 : 600}
                    fontSize={isF ? 30 : 25} fill={isF ? ACC2 : '#eef3f1'}
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                {d.value}{isF ? valueSuffix : ''}
              </text>
            )}
            <text x={cx} y={H - 8} textAnchor="middle" fontFamily="'Space Mono',monospace"
                  fontSize="24" fill={isF ? '#eef3f1' : 'rgba(238,243,241,0.5)'}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function SlideBubbleTimeline(props) {
  const p = { ...slideBubbleTimelineDefaults, ...props };
  const sch = p.gxnScheme || {};
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.data.length - 1, p.focusIndex)) : -1;
  const total = p.data.reduce((s, d) => s + d.value, 0);
  const peak = p.data.reduce((m, d) => (d.value > m.value ? d : m), p.data[0]);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, display: 'grid',
             gridTemplateColumns: p.showAnnotation ? '1.7fr 1fr' : '1fr', gap: 56, minHeight: 0 }}>
          <section className="gxn-panel" style={{ padding: '30px 40px 22px', display: 'flex', minHeight: 0 }}>
            <div style={{ flex: 1, minHeight: 0 }}>
              <Bubbles data={p.data} valueSuffix={p.valueSuffix} focusIndex={fIdx}
                       showValueLabels={p.showValueLabels}
                       accent={sch.accent} accent2={sch.accent2} glow={sch.glow} />
            </div>
          </section>

          {p.showAnnotation && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0, justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: 18 }}>
                <div className="gxn-panel" style={{ padding: '22px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>全年合计</span>
                  <span className="gxn-num" style={{ fontSize: 52, fontWeight: 600, color: 'var(--gxn-text)' }}>{total}<span style={{ fontSize: 22, marginLeft: 6, color: 'var(--gxn-dim)' }}>{p.valueSuffix}</span></span>
                </div>
                <div className="gxn-panel" style={{ padding: '22px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>峰值 · {peak.label}</span>
                  <span className="gxn-num gxn-aurora-num" style={{ fontSize: 52, fontWeight: 600, color: 'var(--gxn-accent)', textShadow: '0 0 26px rgba(var(--gxn-glow),0.5)' }}>{peak.value}<span style={{ fontSize: 22, marginLeft: 6, color: 'var(--gxn-dim)' }}>{p.valueSuffix}</span></span>
                </div>
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

export default SlideBubbleTimeline;
