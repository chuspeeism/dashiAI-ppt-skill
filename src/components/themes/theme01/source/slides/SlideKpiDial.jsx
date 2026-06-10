// SlideKpiDial.jsx — 关键占比仪表盘 / radial gauge dials.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A row of frosted-glass tiles, each holding a ring gauge whose sweep tracks a
// percentage, with the figure read large at the centre. One dial can be promoted
// to a fluorescent accent ring (thicker, glowing) to anchor the eye. Dial count /
// highlight / track / accent are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '结论 · 占比一览',
  tone: 'violet',
  title: '四个关键占比',
  en: 'Four Ratios That Matter',
  cn: '一屏看清资本向何处集中',
  dials: [
    { value: 33, label: 'AI 占全美 VC', sub: '近三分之一风投流向 AI', color: '#5b8def' },
    { value: 43, label: '大模型占 AI 融资', sub: '断层领先的单一赛道', color: '#e0a23a' },
    { value: 64, label: '资金集中于湾区', sub: '地理护城河效应', color: '#46b083' },
    { value: 24, label: 'Top 10 集中度', sub: '头部十家占近四分之一', color: '#7a5ae0' },
  ],
  caption: '仪表盘 · 行业、赛道、地理、头部，四处同时收口',
  // tweakable (universal names)
  itemCount: 4,
  highlight: true,
  highlightIndex: 2,
  showTrack: true,
  accentColor: '#c9f24d',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '仪表数量', type: 'number', default: 4, min: 2, max: 4, step: 1, unit: ' 个',
    description: '展示的占比仪表盘数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一个仪表渲染成荧光强调环。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 2, min: 0, max: 3, step: 1,
    description: '被强调的仪表序号（从 0 开始）。' },
  { key: 'showTrack', label: '底环轨道', type: 'boolean', default: true,
    description: '仪表底部浅色轨道环的显示。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#c9f24d',
    options: ['#c9f24d', '#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '被强调仪表的荧光环颜色。' },
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

function Dial({ d, on, accent, showTrack }) {
  const ring = on ? accent : d.color;
  const sw = on ? 28 : 22;                 // stroke width
  const R = 100, C = 240;                   // radius, viewBox
  const cx = C / 2, cy = C / 2;
  const v = Math.max(0, Math.min(100, d.value));
  return (
    <div style={{
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 22, padding: '44px 26px 38px', borderRadius: 28,
      transform: on ? 'translateY(-10px)' : 'none',
      background: on ? hexA(accent, 0.14) : 'rgba(255,255,255,.55)',
      backdropFilter: 'blur(26px) saturate(140%)', WebkitBackdropFilter: 'blur(26px) saturate(140%)',
      border: `1px solid ${on ? hexA(accent, 0.55) : 'rgba(255,255,255,.72)'}`,
      boxShadow: on
        ? `0 1px 0 rgba(255,255,255,.6) inset, 0 30px 66px ${hexA(accent, 0.4)}`
        : '0 1px 0 rgba(255,255,255,.8) inset, 0 22px 52px rgba(70,72,100,.12)',
    }}>
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <svg viewBox={`0 0 ${C} ${C}`} style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
          {showTrack && (
            <circle cx={cx} cy={cy} r={R} fill="none" stroke={hexA('#5a5a70', 0.12)} strokeWidth={sw} />
          )}
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={ring} strokeWidth={sw} strokeLinecap="round"
            pathLength="100" strokeDasharray={`${v} ${100 - v}`} strokeDashoffset="0"
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ filter: on ? `drop-shadow(0 6px 16px ${hexA(accent, 0.6)})` : 'none' }} />
        </svg>
        {/* centred figure */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 86, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.03em', color: 'var(--aip-ink)' }}>{v}</span>
            <span style={{ fontSize: 40, fontWeight: 900, color: on ? hexA('#23232a', 0.7) : hexA(d.color, 0.95) }}>%</span>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: on ? accent : d.color }} />
          <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
        <div style={{ fontSize: 25, fontWeight: 600, color: 'var(--aip-ink-2)', lineHeight: 1.3, textWrap: 'pretty' }}>{d.sub}</div>
      </div>
    </div>
  );
}

export default function SlideKpiDial(props) {
  const p = { ...defaultProps, ...props };
  const dials = p.dials.slice(0, Math.max(2, Math.min(4, p.itemCount)));

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 30, marginTop: 16 }}>
        {dials.map((d, i) => (
          <Dial key={i} d={d} accent={p.accentColor} showTrack={p.showTrack}
            on={p.highlight && i === p.highlightIndex} />
        ))}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 18 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
