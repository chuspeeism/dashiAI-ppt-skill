// Slide03Trend.jsx — 纵向趋势 / Quarterly funding trend.
// Chart renders as bars, line, or area (chartType). A summary glass panel and
// the decorative caption can be toggled; any data point can be highlighted.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, GlassCard, hexA } from './SlideKit.jsx';

const EVIL_HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';
const EVIL_DOTS = { backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)', backgroundSize: '24px 24px' };

export const defaultProps = {
  kicker: '# 市场全景',
  title: '纵向趋势 · 逐季度融资走势',
  en: 'Vertical Trend — Quarterly Funding',
  quarters: [
    { label: 'Q1', amount: 162, deals: 18, note: '18 笔', color: '#5b8def' },
    { label: 'Q2', amount: 284, deals: 26, note: '26 笔', color: '#46b083' },
    { label: 'Q3', amount: 318, deals: 31, note: '31 笔 · 峰值', color: '#e8503a' },
    { label: 'Q4', amount: 206, deals: 22, note: '22 笔', color: '#e0a23a' },
  ],
  unit: '亿',
  summary: { total: '970', totalUnit: '亿美元', en: 'Full-Year Total · 97 Deals',
    rows: [{ k: '事件笔数', v: '97 笔' }, { k: '平均单笔', v: '≈10 亿' }],
    tag: 'Q2–Q3 为融资高峰' },
  caption: 'Q2、Q3 达峰后于 Q4 理性回落但仍处高位 · 市场对头部标的高度追捧',
  // tweakable
  chartType: 'bar',
  highlight: true,
  highlightIndex: 2,
  showSummary: true,
  showCaption: true,
  evil: false,
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'bar',
    options: [{ value: 'bar', label: '柱状' }, { value: 'line', label: '折线' }, { value: 'area', label: '面积' }],
    description: '季度走势的图表呈现形式。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调某一个季度（如峰值）。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 2, min: 0, max: 3, step: 1,
    description: '被强调的季度序号（从 0 开始）。' },
  { key: 'showSummary', label: '汇总面板', type: 'boolean', default: true,
    description: '是否显示右侧全年汇总玻璃卡。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹 + 柱面 45° 斜纹 + 霓虹辉光（折线/面积为发光线）。' },
];

const PLOT_H = 430;

function Bars({ qs, max, p }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 36, flex: 1,
      ...(p.evil ? { padding: '18px 24px 4px', borderRadius: 24, backgroundColor: 'rgba(255,255,255,.32)', border: '1px solid rgba(255,255,255,.55)', ...EVIL_DOTS } : {}) }}>
      {qs.map((q, i) => {
        const on = p.highlight && i === p.highlightIndex;
        const dim = p.highlight && !on;
        const c = q.color;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', height: PLOT_H, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${(q.amount / max) * 100}%`, borderRadius: '18px 18px 6px 6px',
                position: 'relative', opacity: dim ? 0.5 : 1,
                background: p.evil ? `${EVIL_HATCH}, linear-gradient(180deg, ${hexA(c, 0.88)}, ${hexA(c, 0.42)})` : `linear-gradient(180deg, ${hexA(c, 0.85)}, ${hexA(c, 0.4)})`,
                border: on ? `2px solid ${c}` : '1px solid rgba(255,255,255,.55)',
                boxShadow: p.evil
                  ? (on ? `0 0 0 1px ${hexA(c, .5)}, 0 0 44px ${hexA(c, .55)}, 0 20px 46px ${hexA(c, .45)}`
                        : `0 0 0 1px ${hexA(c, .4)}, 0 0 22px ${hexA(c, .3)}, 0 12px 28px ${hexA(c, .2)}`)
                  : (on ? `0 1px 0 rgba(255,255,255,.7) inset, 0 22px 48px ${hexA(c, 0.4)}`
                        : '0 1px 0 rgba(255,255,255,.7) inset, 0 18px 40px rgba(70,90,180,.18)'),
                transition: 'all .3s ease',
              }}>
                <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, textAlign: 'center',
                  fontSize: on ? 52 : 46, fontWeight: 900, color: 'var(--aip-ink)', marginBottom: 16, whiteSpace: 'nowrap' }}>
                  {q.amount}<small style={{ fontSize: 24, fontWeight: 700, color: '#8a8b94' }}>{p.unit}</small>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 22, textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{q.label}</div>
              <div style={{ fontSize: 'var(--aip-type-small)', color: 'var(--aip-ink-2)', marginTop: 6, whiteSpace: 'nowrap' }}>{q.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineArea({ qs, max, p, area }) {
  const n = qs.length;
  const W = 1000, H = PLOT_H, padX = 80, padTop = 70, padBot = 0;
  const ih = H - padTop - padBot;
  const x = (i) => padX + (i * (W - 2 * padX)) / (n - 1);
  const y = (v) => padTop + ih - (v / max) * ih;
  const accent = '#5b8def';
  const pts = qs.map((q, i) => [x(i), y(q.amount)]);
  const line = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0]},${pt[1]}`).join(' ');
  const fill = `${line} L${x(n - 1)},${padTop + ih} L${x(0)},${padTop + ih} Z`;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: PLOT_H }}>
        <defs>
          <linearGradient id="aip-trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hexA(accent, 0.34)} />
            <stop offset="1" stopColor={hexA(accent, 0.02)} />
          </linearGradient>
          <pattern id="aip-trend-dots" patternUnits="userSpaceOnUse" width="24" height="24">
            <circle cx="2" cy="2" r="1.4" fill="rgba(90,90,112,.2)" />
          </pattern>
        </defs>
        {p.evil && <rect x={padX - 20} y={padTop - 12} width={W - 2 * (padX - 20)} height={ih + 12} fill="url(#aip-trend-dots)" />}
        {area && <path d={fill} fill="url(#aip-trend-fill)" />}
        <path d={line} fill="none" stroke={accent} strokeWidth={p.evil ? 5 : 4} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: p.evil ? `drop-shadow(0 0 10px ${hexA(accent, 0.75)})` : 'none' }} />
        {qs.map((q, i) => {
          const on = p.highlight && i === p.highlightIndex;
          return (
            <g key={i}>
              <circle cx={x(i)} cy={y(q.amount)} r={on ? 13 : 8} fill="#fff" stroke={on ? '#e8503a' : accent} strokeWidth={on ? 5 : 4}
                style={{ filter: p.evil ? `drop-shadow(0 0 8px ${hexA(on ? '#e8503a' : accent, 0.8)})` : 'none' }} />
              <text x={x(i)} y={y(q.amount) - 26} textAnchor="middle" fontSize={on ? 46 : 40} fontWeight="900" fill="#2b2b30">{q.amount}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', marginTop: 22 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)' }}>{q.label}</div>
            <div style={{ fontSize: 'var(--aip-type-small)', color: 'var(--aip-ink-2)', marginTop: 6 }}>{q.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Slide03Trend(props) {
  const p = { ...defaultProps, ...props };
  const qs = p.quarters;
  const max = Math.max(...qs.map((q) => q.amount)) * 1.12;
  const s = p.summary;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} />

      <div style={{ display: 'flex', gap: 54, flex: 1, alignItems: 'center', marginTop: 20 }}>
        {p.chartType === 'bar'
          ? <Bars qs={qs} max={max} p={p} />
          : <LineArea qs={qs} max={max} p={p} area={p.chartType === 'area'} />}

        {p.showSummary && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: 26, padding: '44px 48px', width: 520, flex: '0 0 auto' }}>
            <div style={{ fontSize: 96, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: .95 }}>
              {s.total}<small style={{ fontSize: 38, fontWeight: 700 }}>{s.totalUnit}</small>
            </div>
            <div className="aip-en" style={{ marginTop: -12 }}>{s.en}</div>
            {s.rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingTop: 20, borderTop: '1px solid rgba(0,0,0,.08)' }}>
                <span style={{ fontSize: 'var(--aip-type-body)', color: 'var(--aip-ink-2)', fontWeight: 500 }}>{r.k}</span>
                <span style={{ fontSize: 38, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{r.v}</span>
              </div>
            ))}
            <div style={{ paddingTop: 8 }}>
              <span className="aip-tag aip-tag-green">{s.tag}</span>
            </div>
          </GlassCard>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
