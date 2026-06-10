// SlideStatGrid.jsx — 关键数字一览 / multi-stat "number board".
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A compact header sits clear of a grid of oversized numerals; each tile carries a
// mono index + colored side-rule, and one tile is promoted to a fluorescent
// "stamp" sticker. Tile count, columns, highlight and accent are tweakable; text
// lives in defaultProps.
import React from 'react';
import { SlideFrame, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场速览',
  title: '关键数字一览',
  en: 'The Year in Numbers',
  cn: '一屏读懂 2024 美国 AI 资本体量',
  stats: [
    { value: '970', unit: '亿美元', label: '全年 AI 风险投资', sub: '创历史新高', color: '#5b8def' },
    { value: '≈1/3', unit: '', label: '占全美风险投资', sub: '近三分之一流向 AI', color: '#46b083' },
    { value: '97', unit: '笔', label: '单笔 ≥ 1 亿美元事件', sub: '平均约 10 亿 / 笔', color: '#e0a23a' },
    { value: '9650', unit: '亿美元', label: 'Anthropic 估值', sub: '全球估值最高 AI 初创', color: '#e8503a' },
  ],
  caption: '大数字 · 资本体量的四个坐标',
  // tweakable (universal names)
  itemCount: 4,
  columns: 2,
  highlight: true,
  highlightIndex: 3,
  accentColor: '#e8503a',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '数字卡数量', type: 'number', default: 4, min: 2, max: 4, step: 1, unit: ' 个',
    description: '展示的关键数字卡数量。' },
  { key: 'columns', label: '每行列数', type: 'select', default: 2,
    options: [{ value: 2, label: '两列' }, { value: 4, label: '一行排开' }],
    description: '数字卡的网格列数。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一个数字卡渲染成荧光「印章」贴纸。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 3, min: 0, max: 3, step: 1,
    description: '被强调的数字卡序号（从 0 开始）。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0', '#c9f24d'],
    description: '被强调数字卡的荧光贴纸颜色。' },
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

function Tile({ s, idx, on, accent, numSize, tilt }) {
  const fg = on ? readableOn(accent) : 'var(--aip-ink)';
  const numColor = on ? fg : s.color;
  const dim = on ? hexA(fg === '#ffffff' ? '#ffffff' : '#23232a', 0.74) : 'var(--aip-ink-2)';
  return (
    <div style={{
      position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 0 0 40px', borderRadius: 26, overflow: 'hidden', transform: on ? `rotate(${tilt}deg)` : 'none',
      background: on ? accent : 'rgba(255,255,255,.6)',
      backdropFilter: on ? undefined : 'blur(26px) saturate(140%)',
      WebkitBackdropFilter: on ? undefined : 'blur(26px) saturate(140%)',
      border: `1px solid ${on ? hexA(accent, 0.6) : 'rgba(255,255,255,.72)'}`,
      boxShadow: on
        ? `0 26px 60px ${hexA(accent, 0.46)}, 0 2px 0 rgba(255,255,255,.5) inset`
        : '0 1px 0 rgba(255,255,255,.75) inset, 0 18px 40px rgba(70,72,100,.11)',
    }}>
      {/* mono index, top-right */}
      <span style={{ position: 'absolute', top: 26, right: 32, fontFamily: "'Space Mono', monospace",
        fontSize: 26, fontWeight: 700, letterSpacing: '.08em',
        color: on ? hexA(fg === '#ffffff' ? '#ffffff' : '#23232a', 0.55) : hexA(s.color, 0.7) }}>
        {String(idx + 1).padStart(2, '0')}
      </span>

      <div style={{ paddingRight: 40, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'nowrap' }}>
        <span style={{ fontSize: numSize, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.02em', color: numColor, whiteSpace: 'nowrap' }}>{s.value}</span>
        {s.unit && <span style={{ fontSize: numSize * 0.3, fontWeight: 900, color: on ? fg : 'var(--aip-ink-2)', whiteSpace: 'nowrap' }}>{s.unit}</span>}
      </div>
      <div style={{ marginTop: 16, fontSize: 36, fontWeight: 800, color: fg }}>{s.label}</div>
      {s.sub && <div style={{ marginTop: 6, fontSize: 27, fontWeight: 600, color: dim }}>{s.sub}</div>}
    </div>
  );
}

export default function SlideStatGrid(props) {
  const p = { ...defaultProps, ...props };
  const stats = p.stats.slice(0, Math.max(2, Math.min(4, p.itemCount)));
  const cols = p.columns === 4 ? Math.min(4, stats.length) : Math.min(2, stats.length);
  const rows = Math.ceil(stats.length / cols);
  const numSize = cols >= 4 ? 116 : 150;

  return (
    <SlideFrame bg="a">
      {/* compact header — kept clear of the grid */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 28, marginBottom: 58 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 22px',
            borderRadius: 13, background: '#23232a', transform: 'rotate(-1.2deg)', boxShadow: '0 12px 28px rgba(20,20,28,.28)' }}>
            <span style={{ width: 13, height: 13, borderRadius: 4, background: p.accentColor }} />
            <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}># {p.kicker}</span>
          </span>
          <h2 style={{ margin: 0, fontSize: 84, fontWeight: 900, lineHeight: 1, letterSpacing: '.012em', color: 'var(--aip-ink)' }}>{p.title}</h2>
        </div>
        <div style={{ textAlign: 'right', paddingBottom: 8, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.16em', fontSize: 27, color: 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{p.en}</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#7e7f8a', marginTop: 8, whiteSpace: 'nowrap' }}>{p.cn}</div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 28,
        gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {stats.map((s, i) => (
          <Tile key={i} s={s} idx={i} numSize={numSize} accent={p.accentColor}
            on={p.highlight && i === p.highlightIndex} tilt={i % 2 === 0 ? -1.4 : 1.4} />
        ))}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 22 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
