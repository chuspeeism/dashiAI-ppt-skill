// SlideEvilBars.jsx — 关键占比 / evilcharts-style glowing gradient bar chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Visual language borrowed from EvilCharts (shadcn + recharts): a chart card with
// a dotted-grid plot, vertical bars filled top-bright→bottom-fade (duotone), with
// rounded tops, a luminous top cap and a soft glow — one bar promoted to a fully
// saturated "glowing" bar with a spotlight behind it. A header carries the chart
// title, a one-line read and a trend badge. Rebuilt inside our frosted-glass +
// bokeh system (aip- scope, our palette). Bar count / highlight / dots / grid /
// badge / accent are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '结论 · 占比一览',
  tone: 'violet',
  title: '四个关键占比',
  en: 'Four Ratios That Matter',
  cn: '一屏看清资本向何处集中',
  chartTitle: '资本集中度 · 占比',
  chartDesc: '行业 / 赛道 / 地理 / 头部，四处同时收口',
  trend: '集中度持续走高',
  unit: '%',
  bars: [
    { label: 'AI 占全美 VC', value: 33, sub: '行业层面' },
    { label: '大模型占 AI 融资', value: 43, sub: '赛道层面' },
    { label: '资金集中于湾区', value: 64, sub: '地理层面' },
    { label: 'Top 10 集中度', value: 24, sub: '头部层面' },
  ],
  caption: '柱状图 · evilcharts 风格 · 四个维度的集中度',
  // tweakable (universal names)
  itemCount: 4,
  highlight: true,
  highlightIndex: 2,
  showDots: false,
  showGrid: true,
  showBadge: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '柱子数量', type: 'number', default: 4, min: 3, max: 4, step: 1, unit: ' 根',
    description: '图表展示的柱子数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一根柱子渲染成发光强调柱（带聚光）。' },
  { key: 'highlightIndex', label: '强调第几根', type: 'number', default: 2, min: 0, max: 3, step: 1,
    description: '被强调的柱子序号（从 0 开始）。' },
  { key: 'showDots', label: '点阵底纹', type: 'boolean', default: false,
    description: 'evilcharts 标志性的点阵网格背景的显示（默认关闭，净色柱状图）。' },
  { key: 'showGrid', label: '横向网格', type: 'boolean', default: true,
    description: '绘图区横向参考线的显示。' },
  { key: 'showBadge', label: '趋势角标', type: 'boolean', default: true,
    description: '右上角趋势胶囊角标的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a', '#c9f24d'],
    description: '渐变柱与发光强调柱的主题色（单一色家族，渐变 + 发光）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? '#23232a' : '#ffffff';
}

export default function SlideEvilBars(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const bars = p.bars.slice(0, Math.max(3, Math.min(4, p.itemCount)));
  const max = Math.max.apply(null, bars.map((b) => b.value)) || 1;
  const TOP_FRAC = 0.82;                          // tallest bar occupies 82% of plot

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      {/* chart card */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '38px 52px 30px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* card header */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 16, height: 16, borderRadius: 5, background: ac, boxShadow: `0 0 16px ${hexA(ac, 0.7)}` }} />
              <h3 style={{ margin: 0, fontSize: 40, fontWeight: 900, color: 'var(--aip-ink)', letterSpacing: '.01em' }}>{p.chartTitle}</h3>
            </div>
            <div style={{ marginTop: 8, fontSize: 27, fontWeight: 600, color: 'var(--aip-ink-2)' }}>{p.chartDesc}</div>
          </div>
          {p.showBadge && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 22px', borderRadius: 999,
              background: hexA(ac, 0.12), border: `1px solid ${hexA(ac, 0.4)}`, whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 26, color: ac }}>↗</span>
              <span style={{ fontSize: 25, fontWeight: 800, color: 'var(--aip-ink)' }}>{p.trend}</span>
            </span>
          )}
        </div>

        {/* plot area */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0, marginTop: 26,
          borderBottom: `2px solid ${hexA('#5a5a70', 0.22)}` }}>
          {/* dotted background */}
          {p.showDots && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `radial-gradient(${hexA('#5a5a70', 0.22)} 1.6px, transparent 1.6px)`,
              backgroundSize: '30px 30px', backgroundPosition: '0 0', borderRadius: 12, maskImage: 'linear-gradient(180deg, transparent 0, #000 12%)' }} />
          )}
          {/* horizontal gridlines */}
          {p.showGrid && [0.25, 0.5, 0.75].map((g, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${g * 100}%`,
              borderTop: '1px dashed rgba(43,43,48,.12)' }} />
          ))}

          {/* bars */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', gap: 0 }}>
            {bars.map((b, i) => {
              const on = p.highlight && i === p.highlightIndex;
              const pct = (b.value / max) * TOP_FRAC * 100;     // bar height %
              const fg = ac;
              return (
                <div key={i} style={{ position: 'relative', flex: 1, height: '100%' }}>
                  {/* the bar — solid, grounded gradient (page-63 column style) */}
                  <div style={{
                    position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
                    width: 'min(58%, 168px)', height: `${pct}%`, borderRadius: '14px 14px 0 0',
                    background: on
                      ? `linear-gradient(180deg, ${fg}, ${hexA(fg, 0.82)})`
                      : `linear-gradient(180deg, ${hexA(fg, 0.5)}, ${hexA(fg, 0.34)})`,
                    boxShadow: on
                      ? `0 -2px 0 ${hexA('#ffffff', 0.45)} inset, 0 14px 30px ${hexA(fg, 0.34)}`
                      : `0 -2px 0 ${hexA('#ffffff', 0.35)} inset, 0 12px 24px rgba(70,72,100,.14)`,
                    transition: '.3s',
                  }} />

                  {/* value label above the bar */}
                  <div style={{ position: 'absolute', left: '50%', bottom: `calc(${pct}% + 14px)`, transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'baseline', gap: 2, whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 56 : 46, fontWeight: 700,
                      lineHeight: 1, letterSpacing: '-.02em', color: on ? ac : 'var(--aip-ink)' }}>{b.value}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 28 : 24, fontWeight: 700,
                      color: on ? ac : 'var(--aip-ink-2)' }}>{p.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* x-axis category labels */}
        <div style={{ flex: '0 0 auto', display: 'flex', marginTop: 16 }}>
          {bars.map((b, i) => {
            const on = p.highlight && i === p.highlightIndex;
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: on ? ac : 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{b.label}</div>
                <div style={{ marginTop: 4, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
                  letterSpacing: '.1em', fontSize: 22, color: 'var(--aip-ink-3)' }}>{b.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
