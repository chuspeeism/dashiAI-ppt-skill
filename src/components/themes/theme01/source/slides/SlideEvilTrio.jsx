// SlideEvilTrio.jsx — 三个数字，看清资本格局 / three EvilCharts-style cards.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
//
// Visual language borrowed from EvilCharts (shadcn + recharts): every card pairs
// ONE headline number with a beautiful chart that *proves* it, using the EvilCharts
// toolkit — duotone / glowing gradient bars on a dotted-grid plot, a gradient
// semi-circle radial gauge with an outer neon glow, and a glowing neon line over a
// gradient area fill. Three different chart archetypes (bars / radial / area) read
// the three facets of capital concentration — industry, sector, geography — so the
// landscape "snaps into focus" at a glance. Rebuilt inside our frosted-glass + bokeh
// system (aip- scope, our palette). Card count / highlight / dotted bg / grid / trend
// badge / palette are tweakable; all text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 横向透视 · 资本格局',
  tone: 'blue',
  title: '三个数字，看清资本格局',
  en: 'Three Numbers, One Map of Capital',
  cn: '行业 · 赛道 · 地理 —— 资本同时向头部收口',
  cards: [
    {
      tag: '行业层面', tagTone: 'blue',
      label: 'AI 占全美风险投资', en: 'Share of All US VC',
      value: 33, unit: '%', chartType: 'bars',
      trend: '三分天下有其一',
      bars: [
        { l: 'AI', v: 33, hot: true },
        { l: '医药', v: 14 },
        { l: '金融', v: 11 },
        { l: '软件', v: 10 },
        { l: '能源', v: 8 },
      ],
    },
    {
      tag: '赛道层面', tagTone: 'green',
      label: '大模型独占 AI 融资', en: 'Foundation-Model Layer',
      value: 43, unit: '%', chartType: 'radial',
      trend: '模型层最吸金',
      restLabel: '其余赛道', restValue: 57,
    },
    {
      tag: '地理层面', tagTone: 'violet',
      label: '资金虹吸旧金山湾区', en: 'Siphoned to the Bay Area',
      value: 64, unit: '%', chartType: 'area',
      trend: '虹吸效应持续强化',
      // rising quarterly concentration → 64%
      points: [
        { x: 'Q1', v: 52 }, { x: 'Q2', v: 56 }, { x: 'Q3', v: 59 }, { x: 'Q4', v: 64 },
      ],
    },
  ],
  caption: '三图 · evilcharts 风格 · 行业 / 赛道 / 地理三处同时收口',
  // tweakable (universal names) ----------------------------------------------
  cardCount: 3,
  highlight: true,
  highlightIndex: 2,
  showDots: false,
  showGrid: true,
  showTrend: true,
  palette: ['#5b8def', '#46b083', '#7a5ae0'],
  showCaption: true,
};

export const controls = [
  { key: 'cardCount', label: '卡片数量', type: 'number', default: 3, min: 2, max: 3, step: 1, unit: ' 张',
    description: '并排展示的数字卡片数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一张卡片抬升为发光强调卡。' },
  { key: 'highlightIndex', label: '强调第几张', type: 'number', default: 2, min: 0, max: 2, step: 1,
    description: '被强调的卡片序号（从 0 开始）。' },
  { key: 'showDots', label: '点阵底纹', type: 'boolean', default: false,
    description: 'evilcharts 标志性的点阵网格背景（默认关闭，净色图表）。' },
  { key: 'showGrid', label: '参考网格', type: 'boolean', default: true,
    description: '绘图区参考线 / 刻度的显示。' },
  { key: 'showTrend', label: '趋势角标', type: 'boolean', default: true,
    description: '每张卡片底部趋势胶囊角标的显示。' },
  { key: 'palette', label: '三卡配色', type: 'palette', default: ['#5b8def', '#46b083', '#7a5ae0'],
    options: [
      ['#5b8def', '#46b083', '#7a5ae0'],
      ['#7a5ae0', '#5b8def', '#46b083'],
      ['#e8503a', '#e0a23a', '#46b083'],
      ['#5b8def', '#46b083', '#e0a23a'],
    ],
    description: '三张卡片的主题色（依次对应）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

// dotted EvilCharts plot background -------------------------------------------
function DottedBg({ show, radius = 12 }) {
  if (!show) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: radius,
      backgroundImage: `radial-gradient(${hexA('#5a5a70', 0.20)} 1.5px, transparent 1.5px)`,
      backgroundSize: '26px 26px',
      maskImage: 'linear-gradient(180deg, transparent 0, #000 14%, #000 100%)',
      WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 14%, #000 100%)' }} />
  );
}

// ── Chart 1 · glowing duotone gradient bars ──────────────────────────────────
function BarsChart({ bars, ac, showDots, showGrid }) {
  const max = Math.max.apply(null, bars.map((b) => b.v)) || 1;
  const TOP = 0.6;
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div style={{ position: 'absolute', inset: '0 0 40px 0' }}>
        <DottedBg show={showDots} />
        {showGrid && [0.33, 0.66].map((g, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${g * 100}%`,
            borderTop: '1px dashed rgba(43,43,48,.12)' }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: hexA('#5a5a70', 0.22) }} />
        {/* bars */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end' }}>
          {bars.map((b, i) => {
            const on = b.hot;
            const pct = (b.v / max) * TOP * 100;
            return (
              <div key={i} style={{ position: 'relative', flex: 1, height: '100%' }}>
                <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
                  width: 'min(58%, 80px)', height: `${pct}%`, borderRadius: '12px 12px 0 0',
                  background: on
                    ? `linear-gradient(180deg, ${ac}, ${hexA(ac, 0.82)})`
                    : `linear-gradient(180deg, ${hexA(ac, 0.5)}, ${hexA(ac, 0.34)})`,
                  boxShadow: on
                    ? `0 -2px 0 ${hexA('#ffffff', 0.45)} inset, 0 14px 30px ${hexA(ac, 0.34)}`
                    : `0 -2px 0 ${hexA('#ffffff', 0.35)} inset, 0 10px 22px rgba(70,72,100,.14)`,
                }} />
                {on && (
                  <div style={{ position: 'absolute', left: '50%', bottom: `calc(${pct}% + 12px)`, transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 74, fontWeight: 700, lineHeight: 1,
                      letterSpacing: '-.02em', color: ac }}>{b.v}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700, color: ac }}>%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* x labels */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 32, display: 'flex' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 23, fontWeight: b.hot ? 900 : 600,
            color: b.hot ? ac : 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{b.l}</div>
        ))}
      </div>
    </div>
  );
}

// ── Chart 2 · gradient radial semi-gauge with neon glow ──────────────────────
function RadialGauge({ value, unit, ac, rest, restLabel, showDots, uid }) {
  const cx = 175, cy = 172, r = 142;
  const L = Math.PI * r;
  const dash = (value / 100) * L;
  const gid = `aip-evt-grad-${uid}`;
  const fid = `aip-evt-glow-${uid}`;
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <DottedBg show={showDots} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 388 }}>
        <svg viewBox="0 0 350 200" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={hexA(ac, 0.55)} />
              <stop offset="100%" stopColor={ac} />
            </linearGradient>
            <filter id={fid} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* track */}
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none"
            stroke={hexA('#5a5a70', 0.16)} strokeWidth="26" strokeLinecap="round" />
          {/* value arc */}
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none"
            stroke={`url(#${gid})`} strokeWidth="26" strokeLinecap="round"
            strokeDasharray={`${dash} ${L}`} />
        </svg>
        {/* number overlaid in the bowl */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: '4%', display: 'flex',
          flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 96, fontWeight: 700, lineHeight: 1,
              letterSpacing: '-.03em', color: ac }}>{value}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 40, fontWeight: 700, color: ac }}>{unit}</span>
          </div>
          <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', gap: 16, fontSize: 22,
            fontWeight: 700, color: 'var(--aip-ink-3)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: ac }} />其余 {rest}{unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chart 3 · glowing neon line over gradient area fill ──────────────────────
function AreaChart({ points, ac, unit, peak, showDots, showGrid, uid }) {
  const vals = points.map((p) => p.v);
  const lo = Math.min.apply(null, vals) - 8;
  const hi = Math.max.apply(null, vals) + 6;
  const span = hi - lo || 1;
  const n = points.length;
  const xy = points.map((p, i) => ({
    x: n === 1 ? 50 : (i / (n - 1)) * 100,
    y: (1 - (p.v - lo) / span) * 100,
  }));
  const line = xy.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  const area = `${line} L 100 100 L 0 100 Z`;
  const gid = `aip-evt-area-${uid}`;
  const last = xy[xy.length - 1];
  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div style={{ position: 'absolute', inset: '0 0 36px 0' }}>
        <DottedBg show={showDots} />
        {showGrid && [0.33, 0.66].map((g, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${g * 100}%`,
            borderTop: '1px dashed rgba(43,43,48,.12)' }} />
        ))}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: hexA('#5a5a70', 0.22) }} />
        {/* svg fill + line */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hexA(ac, 0.42)} />
              <stop offset="100%" stopColor={hexA(ac, 0.02)} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} stroke="none" />
          <path d={line} fill="none" stroke={ac} strokeWidth="2.4" strokeLinecap="round"
            strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* dots (kept perfectly round via % divs) */}
        {xy.map((p, i) => {
          const big = i === xy.length - 1;
          return (
            <div key={i} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)',
              width: big ? 20 : 12, height: big ? 20 : 12, borderRadius: '50%',
              background: big ? ac : '#fff', border: `3px solid ${ac}`,
              boxShadow: big ? `0 0 0 6px ${hexA(ac, 0.16)}, 0 4px 12px ${hexA(ac, 0.4)}` : `0 2px 8px ${hexA(ac, 0.4)}` }} />
          );
        })}
        {/* peak number pill */}
        <div style={{ position: 'absolute', left: `${last.x}%`, top: `${last.y}%`,
          transform: `translate(${last.x > 70 ? '-104%' : '-50%'}, -132%)`, whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 78, fontWeight: 700, lineHeight: 1,
            letterSpacing: '-.02em', color: ac }}>{peak}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700, color: ac }}>{unit}</span>
        </div>
      </div>
      {/* x labels */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 28, display: 'flex' }}>
        {points.map((p, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontFamily: "'Space Mono', monospace",
            fontSize: 21, fontWeight: 700, letterSpacing: '.06em',
            color: i === points.length - 1 ? ac : 'var(--aip-ink-3)' }}>{p.x}</div>
        ))}
      </div>
    </div>
  );
}

const TAG_BG = { blue: '#5b8def', green: '#46b083', violet: '#7a5ae0', amber: '#e0a23a', red: '#e8503a' };

export default function SlideEvilTrio(props) {
  const p = { ...defaultProps, ...props };
  const n = Math.max(2, Math.min(3, p.cardCount));
  const cards = p.cards.slice(0, n);
  const pal = p.palette || defaultProps.palette;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'flex', gap: 34 }}>
        {cards.map((c, i) => {
          const ac = pal[i % pal.length];
          const on = p.highlight && i === p.highlightIndex;
          return (
            <div key={i} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column',
              padding: '34px 38px 30px', borderRadius: 30, position: 'relative',
              background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)',
              WebkitBackdropFilter: 'blur(28px) saturate(140%)',
              border: on ? `2px solid ${hexA(ac, 0.55)}` : '1px solid rgba(255,255,255,.72)',
              transform: on ? 'translateY(-12px)' : 'none',
              boxShadow: on
                ? `0 1px 0 rgba(255,255,255,.85) inset, 0 30px 70px ${hexA(ac, 0.30)}, 0 0 0 6px ${hexA(ac, 0.07)}`
                : '0 1px 0 rgba(255,255,255,.8) inset, 0 26px 60px rgba(70,72,100,.14)' }}>

              {/* header */}
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 10, color: '#fff',
                    fontSize: 23, fontWeight: 800, letterSpacing: '.04em', background: TAG_BG[c.tagTone] || ac,
                    boxShadow: `0 8px 20px ${hexA(TAG_BG[c.tagTone] || ac, 0.34)}` }}>{c.tag}</span>
                  <div style={{ marginTop: 14, fontSize: 31, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.12 }}>{c.label}</div>
                  <div style={{ marginTop: 4, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
                    letterSpacing: '.12em', fontSize: 20, color: 'var(--aip-ink-3)' }}>{c.en}</div>
                </div>
                <span style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontSize: 26, fontWeight: 700,
                  color: hexA(ac, 0.85) }}>{`0${i + 1}`}</span>
              </div>

              {/* chart body */}
              <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', flexDirection: 'column' }}>
                {c.chartType === 'bars' && (
                  <BarsChart bars={c.bars} ac={ac} showDots={p.showDots} showGrid={p.showGrid} />
                )}
                {c.chartType === 'radial' && (
                  <RadialGauge value={c.value} unit={c.unit} ac={ac} rest={c.restValue} restLabel={c.restLabel}
                    showDots={p.showDots} uid={i} />
                )}
                {c.chartType === 'area' && (
                  <AreaChart points={c.points} ac={ac} unit={c.unit} peak={c.value}
                    showDots={p.showDots} showGrid={p.showGrid} uid={i} />
                )}
              </div>

              {/* trend badge */}
              {p.showTrend && (
                <div style={{ flex: '0 0 auto', marginTop: 14, display: 'flex' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 999,
                    background: hexA(ac, 0.12), border: `1px solid ${hexA(ac, 0.4)}`, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 24, color: ac }}>↗</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--aip-ink)' }}>{c.trend}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 18 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
