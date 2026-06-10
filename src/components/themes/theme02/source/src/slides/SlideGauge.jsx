/**
 * SlideGauge.jsx — 达成率（图表页 · 多环进度 / 仪表）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 默认呈现 Bklit-UI 风格的「同心多环进度图」(Ring Chart)：圆角弧段 + 分项辉光，
 * 圆心读数 (RingCenter)，右侧 marker · label · value 的可组合图例。亦可切换为
 * 一排 270° 仪表 (gauges)。图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideGaugeDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   gauges       Array<{label, value, note}>   value 为 0–100 的百分比
 *   gaugeCount   number   展示的环 / 仪表数量（2–n）
 *   layout       'ring' | 'gauges'   同心多环 (Bklit) / 一排仪表
 *   focusEnabled boolean  强调某一项（圆心切到该项；其余淡出）
 *   focusIndex   number   0-based 被强调项
 *   showTrack    boolean  背景轨道弧显隐
 *   showCenter   boolean  圆心读数显隐（ring 版）
 *   showLegend   boolean  右侧图例显隐（ring 版）
 *   showNote     boolean  说明文案显隐（图例内 / 仪表下方）
 *   gxnScheme    object?  { palette } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideGaugeDefaults = {
  kicker: 'RINGS · 关键达成率',
  title: '四个比率 ',
  titleEm: '看清结构性力量',
  lead: '把这一年最具结构意义的几个比率叠进同一组进度环——资本正在向哪里、向谁集中。',
  gauges: [
    { label: '基础设施层占比', value: 78, note: '算力 + 数据吃下最确定红利' },
    { label: '头部资本集中度', value: 63, note: '前十大公司拿走六成资金' },
    { label: '湾区地理集中度', value: 55, note: '融资进一步向旧金山聚拢' },
    { label: '商业化兑现率', value: 41, note: '营收兑现仍是下一阶段考题' },
  ],
  gaugeCount: 4,
  layout: 'ring',
  focusEnabled: true,
  focusIndex: 0,
  showTrack: true,
  showCenter: true,
  showLegend: true,
  showNote: true,
};

export const slideGaugeControls = [
  { key: 'layout', type: 'enum', label: '版式', default: 'ring',
    options: [{ value: 'ring', label: '同心多环' }, { value: 'gauges', label: '一排仪表' }],
    describe: '同心多环 (Bklit 风) / 一排 270° 仪表' },
  { key: 'gaugeCount', type: 'number', label: '环数量', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.gauges ? p.gauges.length : 4), describe: '环 / 仪表的数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '强调某一项（圆心切到该项，其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.gaugeCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调项的序号' },
  { key: 'showTrack', type: 'toggle', label: '背景轨道', default: true,
    describe: '背景轨道弧显隐' },
  { key: 'showCenter', type: 'toggle', label: '圆心读数', default: true,
    visibleWhen: (p) => p.layout === 'ring', describe: '同心多环的圆心读数显隐' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    visibleWhen: (p) => p.layout === 'ring', describe: '同心多环右侧图例显隐' },
  { key: 'showNote', type: 'toggle', label: '说明文案', default: true,
    describe: '说明文案显隐（图例内 / 仪表下方）' },
];

/* ── Bklit-style concentric multi-ring progress chart ── */
function RingChart({ gauges, palette, fIdx, showTrack, showCenter }) {
  const uid = React.useId().replace(/:/g, '');
  const S = 560, c = S / 2;
  const n = gauges.length;
  const focused = fIdx >= 0;
  const colorOf = (i) => palette[i % palette.length];

  const R_OUT = 240, R_IN = 96;
  const step = (R_OUT - R_IN) / n;
  const ringW = Math.max(10, Math.min(30, step * 0.6));

  const avg = Math.round(gauges.reduce((s, g) => s + g.value, 0) / (n || 1));
  const centerVal = focused ? Math.round(gauges[fIdx].value) : avg;
  const centerLabel = focused ? gauges[fIdx].label : '平均达成率';
  const centerColor = focused ? colorOf(fIdx) : '#eef3f1';
  const bigFont = n >= 5 ? 78 : n === 4 ? 92 : 104;

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {gauges.map((g, i) => (
          <linearGradient key={i} id={`${uid}-arc-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colorOf(i)} stopOpacity="0.72" />
            <stop offset="100%" stopColor={colorOf(i)} />
          </linearGradient>
        ))}
        <filter id={`${uid}-g`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {gauges.map((g, i) => {
        const radius = R_OUT - (i + 0.5) * step;
        const circ = 2 * Math.PI * radius;
        const pv = Math.max(0, Math.min(100, g.value)) / 100;
        const dash = `${(pv * circ).toFixed(2)} ${circ.toFixed(2)}`;
        const color = colorOf(i);
        const isF = i === fIdx;
        const dim = focused && !isF;
        const sw = isF ? ringW + 3 : ringW;
        // leading-tip position (start at 12 o'clock, clockwise)
        const theta = (-90 + pv * 360) * Math.PI / 180;
        const tx = c + radius * Math.cos(theta);
        const ty = c + radius * Math.sin(theta);
        return (
          <g key={i}>
            {showTrack && (
              <circle cx={c} cy={c} r={radius} fill="none"
                      stroke="rgba(255,255,255,0.07)" strokeWidth={ringW} />
            )}
            <circle cx={c} cy={c} r={radius} fill="none" stroke={`url(#${uid}-arc-${i})`}
                    strokeWidth={sw} strokeLinecap="round" strokeDasharray={dash}
                    transform={`rotate(-90 ${c} ${c})`}
                    opacity={dim ? 0.34 : 1}
                    filter={!dim ? `url(#${uid}-g)` : undefined} />
            {/* leading-tip dot on the focused ring */}
            {isF && (
              <circle cx={tx} cy={ty} r={sw * 0.42} fill="#0b0f14" stroke={color}
                      strokeWidth="3" filter={`url(#${uid}-g)`} />
            )}
          </g>
        );
      })}

      {showCenter && (
        <g>
          <text x={c} y={c - 6} textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize={bigFont}
                fill={centerColor} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {centerVal}<tspan fontSize="0.4em" dx="2" fill="rgba(238,243,241,0.6)">%</tspan>
          </text>
          <text x={c} y={c + bigFont * 0.62} textAnchor="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontSize="24" fill="rgba(238,243,241,0.55)">
            {centerLabel}
          </text>
        </g>
      )}
    </svg>
  );
}

/* ── 270° single gauge (alternate "gauges" layout) ── */
function Gauge({ value, color, focus, dim, showTrack }) {
  const uid = React.useId().replace(/:/g, '');
  const S = 300, c = S / 2, r = 116, sw = focus ? 26 : 22;
  const circ = 2 * Math.PI * r;
  const sweep = 0.75;
  const pv = Math.max(0, Math.min(100, value)) / 100;
  const dash = `${(pv * sweep * circ).toFixed(2)} ${circ}`;
  const trackDash = `${(sweep * circ).toFixed(2)} ${circ}`;
  const rot = `rotate(135 ${c} ${c})`;

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`${uid}-arc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <filter id={`${uid}-g`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={focus ? 9 : 6} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {showTrack && (
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={sw}
                strokeLinecap="round" strokeDasharray={trackDash} transform={rot} />
      )}
      <circle cx={c} cy={c} r={r} fill="none" stroke={`url(#${uid}-arc)`} strokeWidth={sw}
              strokeLinecap="round" strokeDasharray={dash} transform={rot}
              filter={!dim ? `url(#${uid}-g)` : undefined} />
      <text x={c} y={c - 4} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Space Grotesk',sans-serif" fontWeight="600" fontSize="76"
            fill={focus ? color : '#eef3f1'} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {Math.round(value)}<tspan fontSize="0.42em" dx="2" fill="rgba(238,243,241,0.6)">%</tspan>
      </text>
      <text x={c} y={c + 52} textAnchor="middle"
            fontFamily="'Space Mono',monospace" fontSize="22" fill="rgba(238,243,241,0.42)"
            letterSpacing="0.08em">RATE</text>
    </svg>
  );
}

export function SlideGauge(props) {
  const p = { ...slideGaugeDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#2fe0c4', '#4ea2ff', '#9b7dff', '#b9f24a', '#ff6fae'];

  const count = Math.max(2, Math.min(p.gauges.length, p.gaugeCount));
  const gauges = p.gauges.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const focused = fIdx >= 0;
  const isRing = p.layout === 'ring';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        {isRing ? (
          <div className="gxn-rise" style={{ flex: 1, minHeight: 0, display: 'grid',
            gridTemplateColumns: p.showLegend ? '1fr 0.9fr' : '1fr', gap: 76, alignItems: 'stretch' }}>
            {/* LEFT — 标题 + 引言 + 类目图例 */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '30 / 39'} />
              {p.lead && <p className="gxn-sub" style={{ marginTop: 16, maxWidth: 760 }}>{p.lead}</p>}
              {p.showLegend && (
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', gap: 16, marginTop: 28 }}>
                  {gauges.map((g, i) => {
                    const color = palette[i % palette.length];
                    const isF = i === fIdx; const dim = focused && !isF;
                    return (
                      <div key={i} className={cx('gxn-panel', isF && 'is-focus')}
                           style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 28px',
                             opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
                        <span style={{ width: 16, height: 16, borderRadius: 5, background: color, flex: '0 0 auto',
                          boxShadow: `0 0 16px -1px ${color}` }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ margin: 0, fontSize: 29, fontWeight: 700, lineHeight: 1.2,
                            color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.label}</h3>
                          {p.showNote && g.note && (
                            <p style={{ margin: '5px 0 0', fontSize: 22, lineHeight: 1.35, color: 'var(--gxn-dim)',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.note}</p>
                          )}
                        </div>
                        <span className="gxn-num" style={{ fontSize: 46, fontWeight: 600, color,
                          whiteSpace: 'nowrap', lineHeight: 1 }}>
                          {Math.round(g.value)}<span style={{ fontSize: '0.5em', color: 'var(--gxn-dim)', marginLeft: 1 }}>%</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* RIGHT — 环形图表 */}
            <div className="gxn-rise-2" style={{ height: '100%', minHeight: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ height: '100%', maxHeight: 740, aspectRatio: '1 / 1', maxWidth: '100%' }}>
                <RingChart gauges={gauges} palette={palette} fIdx={fIdx}
                           showTrack={p.showTrack} showCenter={p.showCenter} />
              </div>
            </div>
          </div>
        ) : (
          <>
          <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '30 / 39'} />
          {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, display: 'grid',
            gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 40, alignItems: 'center' }}>
            {gauges.map((g, i) => {
              const color = palette[i % palette.length];
              const isF = i === fIdx; const dim = focused && !isF;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
                  opacity: dim ? 0.46 : 1, transition: 'opacity .3s ease', minWidth: 0 }}>
                  <div style={{ width: '100%', maxWidth: 300, aspectRatio: '1 / 1' }}>
                    <Gauge value={g.value} color={color} focus={isF} dim={dim} showTrack={p.showTrack} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    textAlign: 'center', minWidth: 0, marginTop: -8 }}>
                    <h3 style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.2,
                      color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', textWrap: 'balance' }}>{g.label}</h3>
                    {p.showNote && g.note && (
                      <p style={{ margin: 0, fontSize: 23, lineHeight: 1.42, color: 'var(--gxn-dim)',
                        textWrap: 'pretty', maxWidth: 320 }}>{g.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SlideGauge;
