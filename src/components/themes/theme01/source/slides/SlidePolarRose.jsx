// SlidePolarRose.jsx — 玫瑰图 / Nightingale polar-area (rose) chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Equal-angle wedges whose RADIUS encodes each sector's value (area- or
// linear-scaled), ringed by faint value gridlines — a fresh, non-bar way to
// read赛道占比 that doesn't repeat the donut/pie family. Any wedge can be
// spotlighted (grow + glow + dim the rest); legend, value chips, rings and the
// radius scale are tweakable. Text lives in defaultProps; component is self-contained.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 横向透视',
  tone: 'blue',
  title: '赛道分布 · 玫瑰图',
  en: 'Funding by Sector · Rose',
  cn: '以花瓣半径丈量各赛道吸金体量',
  segments: [
    { label: '通用大模型', en: 'Foundation Model', value: 420, color: '#5b8def' },
    { label: '垂直应用', en: 'Vertical AI', value: 245, color: '#46b083' },
    { label: 'AI 基础设施', en: 'Infrastructure', value: 158, color: '#e0a23a' },
    { label: 'AI 芯片', en: 'Hardware', value: 97, color: '#e8503a' },
    { label: '工具 / 安全', en: 'Tooling / Safety', value: 50, color: '#7a5ae0' },
  ],
  unit: '亿',
  caption: '玫瑰图 · 半径越长越吸金，通用大模型的花瓣一枝独秀',
  // tweakable (universal names)
  itemCount: 5,
  radiusScale: 'area',
  highlight: true,
  highlightIndex: 0,
  showRings: true,
  showValues: true,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '花瓣数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 瓣',
    description: '参与玫瑰图的赛道数量（其余并入末项）。' },
  { key: 'radiusScale', label: '半径标度', type: 'select', default: 'area',
    options: [{ value: 'area', label: '面积正比' }, { value: 'linear', label: '半径正比' }],
    description: '面积正比（半径取平方根，弱化巨头）或半径正比（直接线性，放大差距）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮其中一瓣（放大 + 辉光，其余淡出）。' },
  { key: 'highlightIndex', label: '强调第几瓣', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的赛道序号（从 0 开始）。' },
  { key: 'showRings', label: '刻度环', type: 'boolean', default: true,
    description: '同心刻度圆环与数值刻度的显示。' },
  { key: 'showValues', label: '花瓣数值', type: 'boolean', default: true,
    description: '每瓣尖端数值胶囊的显示。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

// hex → lighten/darken mix toward white(t=255) or black(t=0).
function mix(hex, amt, toWhite) {
  const c = String(hex).replace('#', '');
  const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const n = parseInt(f, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const tg = toWhite ? 255 : 0;
  r = Math.round(r + (tg - r) * amt); g = Math.round(g + (tg - g) * amt); b = Math.round(b + (tg - b) * amt);
  return `rgb(${r},${g},${b})`;
}

function Rose({ segs, p }) {
  const uid = React.useId().replace(/:/g, '');
  const total = segs.reduce((s, x) => s + x.value, 0);
  const maxV = Math.max.apply(null, segs.map((s) => s.value));
  const cx = 260, cy = 262, rMax = 206, r0 = 26;
  const GAP = (1.6 * Math.PI) / 180;               // angular gap between petals
  const n = segs.length;
  const span = (Math.PI * 2) / n;
  const scale = (v) => p.radiusScale === 'area' ? Math.sqrt(v / maxV) : (v / maxV);
  const rOf = (v) => r0 + (rMax - r0) * scale(v);
  const P = (r, a) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  const fi = p.highlight ? p.highlightIndex : -1;

  const rings = [0.25, 0.5, 0.75, 1];
  const ringVal = (f) => p.radiusScale === 'area' ? Math.round(maxV * f * f) : Math.round(maxV * f);

  return (
    <svg viewBox="0 0 520 520" style={{ width: 520, height: 520, overflow: 'visible' }}>
      <defs>
        {segs.map((s, i) => (
          <radialGradient key={i} id={`${uid}-g${i}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={rMax}>
            <stop offset="0%" stopColor={mix(s.color, 0.52, true)} />
            <stop offset="60%" stopColor={mix(s.color, 0.12, true)} />
            <stop offset="100%" stopColor={mix(s.color, 0.10, false)} />
          </radialGradient>
        ))}
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id={`${uid}-dots`} width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="rgba(90,84,140,.14)" />
        </pattern>
      </defs>

      <circle cx={cx} cy={cy} r={rMax + 18} fill={`url(#${uid}-dots)`} opacity="0.5" />

      {/* gridline rings + scale ticks */}
      {p.showRings && rings.map((f, i) => {
        const rr = r0 + (rMax - r0) * f;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={rr} fill="none" stroke="rgba(43,43,48,.16)" strokeWidth="1"
              strokeDasharray="3 6" />
            <text x={cx + 6} y={cy - rr + 6} fontSize="17" fontFamily="'Space Mono', monospace"
              fill="#9a9ba4" fontWeight="700">{ringVal(f)}</text>
          </g>
        );
      })}

      {/* petals */}
      {segs.map((s, i) => {
        const a0 = -Math.PI / 2 + i * span + GAP / 2;
        const a1 = -Math.PI / 2 + (i + 1) * span - GAP / 2;
        const r = rOf(s.value);
        const on = i === fi;
        const dim = fi >= 0 && !on;
        const rr = on ? Math.min(rMax + 8, r + 12) : r;
        const d = `M ${cx} ${cy} L ${P(rr, a0)} A ${rr} ${rr} 0 0 1 ${P(rr, a1)} Z`;
        return (
          <g key={i} style={{ transition: 'all .3s ease' }}>
            {on && <path d={d} fill={s.color} filter={`url(#${uid}-glow)`} opacity="0.5" />}
            <path d={d} fill={`url(#${uid}-g${i})`} opacity={dim ? 0.42 : 1}
              stroke={mix(s.color, 0.3, true)} strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        );
      })}

      {/* value chips at each petal tip */}
      {p.showValues && segs.map((s, i) => {
        const am = -Math.PI / 2 + (i + 0.5) * span;
        const r = rOf(s.value) + (i === fi ? 30 : 22);
        const x = cx + r * Math.cos(am), y = cy + r * Math.sin(am);
        const on = i === fi;
        return (
          <g key={i} opacity={fi >= 0 && !on ? 0.5 : 1}>
            <text x={x} y={y + 8} textAnchor="middle" fontSize={on ? 30 : 25}
              fontFamily="'Space Mono', monospace" fontWeight="700"
              fill={on ? s.color : '#5a5a63'}>{s.value}</text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={r0 - 4} fill="#fff" opacity="0.85"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(70,72,100,.18))' }} />
    </svg>
  );
}

export default function SlidePolarRose(props) {
  const p = { ...defaultProps, ...props };
  const n = Math.max(3, Math.min(p.segments.length, p.itemCount));
  let segs;
  if (n < p.segments.length) {
    const head = p.segments.slice(0, n - 1);
    const rest = p.segments.slice(n - 1);
    const sum = rest.reduce((s, x) => s + x.value, 0);
    segs = [...head, { label: '其他', en: 'Others', value: sum, color: '#9aa0ad' }];
  } else {
    segs = p.segments.slice(0, n);
  }
  const total = segs.reduce((s, x) => s + x.value, 0);

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 64, marginTop: 4 }}>
        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
          <Rose segs={segs} p={p} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {segs.map((s, i) => {
            const on = p.highlight && i === p.highlightIndex;
            const pct = ((s.value / total) * 100).toFixed(1);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', borderRadius: 16,
                background: on ? hexA(s.color, 0.12) : 'rgba(255,255,255,.42)',
                border: `1px solid ${on ? hexA(s.color, 0.45) : 'rgba(255,255,255,.6)'}`,
                opacity: p.highlight && !on ? 0.78 : 1, transition: 'all .3s ease',
              }}>
                <span style={{ width: 22, height: 22, borderRadius: 6, background: s.color, flex: '0 0 auto' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--aip-ink)' }}>{s.label}</div>
                  <div className="aip-en" style={{ fontSize: 22 }}>{s.en}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 34, fontWeight: 900, color: on ? s.color : 'var(--aip-ink)' }}>
                    {s.value}<small style={{ fontSize: 22, color: '#8a8b94', fontWeight: 700 }}> {p.unit}</small>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, color: '#9a9ba4', fontWeight: 700 }}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
