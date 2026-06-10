// Slide13Monthly.jsx — 月度节奏 / Monthly funding rhythm.
// Renders the 12-month series as a heatmap strip, bars, or an area line
// (chartType). Any month can be highlighted, a side stats panel and the
// decorative caption can be toggled. Self-contained: relative imports only,
// controlled entirely by props, `aip-` scoped styles.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, GlassCard, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 市场全景',
  title: '月度节奏 · 逐月融资强度',
  en: 'Vertical Trend — Monthly Cadence',
  months: [
    { label: '1 月', value: 45 }, { label: '2 月', value: 58 }, { label: '3 月', value: 59 },
    { label: '4 月', value: 86 }, { label: '5 月', value: 105 }, { label: '6 月', value: 93 },
    { label: '7 月', value: 92 }, { label: '8 月', value: 118 }, { label: '9 月', value: 108 },
    { label: '10 月', value: 73 }, { label: '11 月', value: 81 }, { label: '12 月', value: 52 },
  ],
  unit: '亿',
  accentColor: '#5b8def',
  stats: {
    en: 'Monthly Distribution',
    rows: [
      { k: '峰值', v: '118 亿', note: '8 月' },
      { k: '低谷', v: '45 亿', note: '1 月' },
      { k: '月均', v: '≈ 80.8 亿', note: '全年 12 个月' },
    ],
    tag: '5 月、8 月双峰',
  },
  caption: '5 月、8 月形成两次峰值 · 与多家头部公司集中关账的节奏吻合',
  // ── tweakable ──
  chartType: 'heatmap',
  highlight: true,
  highlightIndex: 7,
  showStats: true,
  showCaption: true,
  evil: false,
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'heatmap',
    options: [{ value: 'heatmap', label: '热力' }, { value: 'bar', label: '柱状' }, { value: 'area', label: '面积' }],
    description: '逐月数据的呈现形式：热力色块 / 柱状 / 面积折线。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调某一个月份（如峰值）。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 7, min: 0, max: 11, step: 1,
    description: '被强调的月份序号（0 = 1 月，11 = 12 月）。' },
  { key: 'showStats', label: '数据摘要面板', type: 'boolean', default: true,
    description: '是否显示右侧峰值 / 低谷 / 月均摘要卡。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹 + 柱/格面 45° 斜纹 + 霓虹辉光（面积图为点阵底 + 发光折线）。' },
];

const PLOT_H = 460;
const EVIL_HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';
const EVIL_DOTS = { backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)', backgroundSize: '24px 24px' };

// ── heatmap: a 12-cell strip; fill alpha scales with value ──
function Heatmap({ ms, min, max, p }) {
  const c = p.accentColor;
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12, alignContent: 'center' }}>
      {ms.map((m, i) => {
        const on = p.highlight && i === p.highlightIndex;
        const dim = p.highlight && !on;
        const t = (m.value - min) / (max - min || 1); // 0..1 intensity
        const a = 0.16 + t * 0.72;
        return (
          <div key={i} style={{
            position: 'relative', height: PLOT_H * (0.46 + t * 0.54), alignSelf: 'end',
            borderRadius: 18, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '0 0 16px', textAlign: 'center', opacity: dim ? 0.55 : 1,
            background: p.evil ? `${EVIL_HATCH}, linear-gradient(180deg, ${hexA(c, a)}, ${hexA(c, a * 0.55)})` : `linear-gradient(180deg, ${hexA(c, a)}, ${hexA(c, a * 0.55)})`,
            border: on ? `2px solid ${c}` : `1px solid ${hexA('#ffffff', 0.55)}`,
            boxShadow: p.evil
              ? (on ? `0 0 0 1px ${hexA(c, .5)}, 0 0 42px ${hexA(c, .55)}, 0 18px 42px ${hexA(c, .45)}`
                    : `0 0 ${Math.round(8 + t * 24)}px ${hexA(c, 0.12 + t * 0.26)}, 0 1px 0 rgba(255,255,255,.5) inset`)
              : (on ? `0 1px 0 rgba(255,255,255,.7) inset, 0 20px 46px ${hexA(c, 0.4)}`
                    : '0 1px 0 rgba(255,255,255,.6) inset, 0 14px 32px rgba(70,90,180,.12)'),
            transition: 'all .3s ease',
          }}>
            <div style={{ fontSize: on ? 38 : 34, fontWeight: 900, color: t > 0.55 ? '#fff' : 'var(--aip-ink)', lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color: t > 0.55 ? 'rgba(255,255,255,.92)' : 'var(--aip-ink-2)' }}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Bars({ ms, max, p }) {
  const c = p.accentColor;
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 16,
      ...(p.evil ? { padding: '20px 22px 8px', borderRadius: 22, backgroundColor: 'rgba(255,255,255,.34)', border: '1px solid rgba(255,255,255,.55)', ...EVIL_DOTS } : {}) }}>
      {ms.map((m, i) => {
        const on = p.highlight && i === p.highlightIndex;
        const dim = p.highlight && !on;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', height: PLOT_H, display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%', height: `${(m.value / max) * 100}%`, borderRadius: '14px 14px 5px 5px',
                position: 'relative', opacity: dim ? 0.5 : 1,
                background: p.evil ? `${EVIL_HATCH}, linear-gradient(180deg, ${hexA(c, 0.9)}, ${hexA(c, 0.45)})` : `linear-gradient(180deg, ${hexA(c, 0.88)}, ${hexA(c, 0.4)})`,
                border: on ? `2px solid ${c}` : '1px solid rgba(255,255,255,.55)',
                boxShadow: p.evil
                  ? (on ? `0 0 0 1px ${hexA(c, .5)}, 0 0 40px ${hexA(c, .55)}, 0 16px 38px ${hexA(c, .4)}, 0 2px 0 rgba(255,255,255,.45) inset`
                        : `0 0 0 1px ${hexA(c, .4)}, 0 0 20px ${hexA(c, .3)}, 0 10px 24px ${hexA(c, .2)}`)
                  : (on ? `0 1px 0 rgba(255,255,255,.7) inset, 0 20px 44px ${hexA(c, 0.4)}`
                        : '0 1px 0 rgba(255,255,255,.7) inset, 0 14px 32px rgba(70,90,180,.16)'),
                transition: 'all .3s ease',
              }}>
                <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, textAlign: 'center',
                  fontSize: on ? 32 : 28, fontWeight: 900, color: 'var(--aip-ink)', marginBottom: 10, whiteSpace: 'nowrap' }}>{m.value}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 23, fontWeight: 700, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{m.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Area({ ms, max, p }) {
  const c = p.accentColor;
  const n = ms.length;
  const W = 1180, H = PLOT_H, padX = 50, padTop = 64;
  const ih = H - padTop;
  const x = (i) => padX + (i * (W - 2 * padX)) / (n - 1);
  const y = (v) => padTop + ih - (v / max) * ih;
  const pts = ms.map((m, i) => [x(i), y(m.value)]);
  const line = pts.map((pt, i) => `${i ? 'L' : 'M'}${pt[0]},${pt[1]}`).join(' ');
  const fill = `${line} L${x(n - 1)},${padTop + ih} L${x(0)},${padTop + ih} Z`;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: PLOT_H }}>
        <defs>
          <linearGradient id="aip-month-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={hexA(c, 0.34)} />
            <stop offset="1" stopColor={hexA(c, 0.02)} />
          </linearGradient>
          <pattern id="aip-month-dots" patternUnits="userSpaceOnUse" width="24" height="24">
            <circle cx="2" cy="2" r="1.4" fill="rgba(90,90,112,.2)" />
          </pattern>
        </defs>
        {p.evil && <rect x="0" y={padTop - 12} width={W} height={ih + 12} fill="url(#aip-month-dots)" />}
        <path d={fill} fill="url(#aip-month-fill)" />
        <path d={line} fill="none" stroke={c} strokeWidth={p.evil ? 5 : 4} strokeLinecap="round" strokeLinejoin="round"
          style={{ filter: p.evil ? `drop-shadow(0 0 10px ${hexA(c, 0.75)})` : 'none' }} />
        {ms.map((m, i) => {
          const on = p.highlight && i === p.highlightIndex;
          return (
            <g key={i}>
              <circle cx={x(i)} cy={y(m.value)} r={on ? 12 : 7} fill="#fff" stroke={on ? '#e8503a' : c} strokeWidth={on ? 5 : 4}
                style={{ filter: p.evil ? `drop-shadow(0 0 8px ${hexA(on ? '#e8503a' : c, 0.8)})` : 'none' }} />
              {on && <text x={x(i)} y={y(m.value) - 24} textAnchor="middle" fontSize={38} fontWeight="900" fill="#2b2b30">{m.value}</text>}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', marginTop: 14 }}>
        {ms.map((m, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 23, fontWeight: 700, color: 'var(--aip-ink)' }}>{m.label}</div>
        ))}
      </div>
    </div>
  );
}

export default function Slide13Monthly(props) {
  const p = { ...defaultProps, ...props };
  const ms = p.months;
  const vals = ms.map((m) => m.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals) * 1.12;
  const s = p.stats;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} />

      <div style={{ display: 'flex', gap: 48, flex: 1, alignItems: 'center', marginTop: 16, minHeight: 0 }}>
        {p.chartType === 'heatmap' && <Heatmap ms={ms} min={min} max={Math.max(...vals)} p={p} />}
        {p.chartType === 'bar' && <Bars ms={ms} max={max} p={p} />}
        {p.chartType === 'area' && <Area ms={ms} max={max} p={p} />}

        {p.showStats && (
          <GlassCard style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
            gap: 22, padding: '40px 44px', width: 440, flex: '0 0 auto' }}>
            <div className="aip-en" style={{ fontSize: 24 }}>{s.en}</div>
            {s.rows.map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                paddingTop: 18, borderTop: '1px solid rgba(0,0,0,.08)' }}>
                <div>
                  <div style={{ fontSize: 'var(--aip-type-body)', color: 'var(--aip-ink-2)', fontWeight: 500 }}>{r.k}</div>
                  <div style={{ fontSize: 22, color: 'var(--aip-ink-3)', marginTop: 2 }}>{r.note}</div>
                </div>
                <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{r.v}</span>
              </div>
            ))}
            <div style={{ paddingTop: 6 }}>
              <span className="aip-tag aip-tag-blue">{s.tag}</span>
            </div>
          </GlassCard>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
