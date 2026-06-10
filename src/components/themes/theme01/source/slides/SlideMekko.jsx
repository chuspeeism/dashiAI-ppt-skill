// SlideMekko.jsx — Marimekko / 可变宽堆叠柱 (mekko chart).
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A two-dimensional crosstab: each赛道 column's WIDTH ∝ its total funding, and is
// stacked top-to-bottom by阶段 share (Pre-IPO / 成长 / 早期) to 100%. Reads two
// variables at once — who raised the most AND at what stage — in a way the
// deck's equal-width stacked bars and treemap cannot. One column can be
// spotlighted (lift + ring + dim rest). Column count, cell %, axis, palette,
// highlight tweakable; labels live in defaultProps. Self-contained.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 横向透视',
  tone: 'blue',
  title: '赛道 × 阶段 · 可变宽堆叠',
  en: 'Sector × Stage · Marimekko',
  cn: '列宽看体量，分段看轮次结构',
  // each category: total (drives column WIDTH) + stage shares (sum to ~100, drive heights)
  stages: ['后期 · Pre-IPO', '成长期', '早期 · 种子'],
  categories: [
    { label: '通用大模型', total: 420, parts: [62, 30, 8] },
    { label: '垂直应用', total: 245, parts: [28, 46, 26] },
    { label: 'AI 基础设施', total: 158, parts: [52, 36, 12] },
    { label: 'AI 芯片', total: 97, parts: [44, 40, 16] },
    { label: '工具 / 安全', total: 50, parts: [18, 40, 42] },
  ],
  palette: ['#5b8def', '#46b083', '#e0a23a'],
  caption: '可变宽堆叠 · 大模型不仅最吸金，且资金高度押注后期；越垂直，越早期',
  // tweakable (universal names)
  itemCount: 5,
  highlight: true,
  highlightIndex: 0,
  showCellPct: true,
  showAxis: true,
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '列数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 列',
    description: '参与对比的赛道列数量（其余略去）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮其中一列（描边 + 抬升，其余淡出）。' },
  { key: 'highlightIndex', label: '强调第几列', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的赛道列序号（从 0 开始）。' },
  { key: 'showCellPct', label: '分段占比', type: 'boolean', default: true,
    description: '每个色块内阶段占比数字的显示。' },
  { key: 'showAxis', label: '左侧百分轴', type: 'boolean', default: true,
    description: '左侧 0–100% 纵轴刻度的显示。' },
  { key: 'palette', label: '阶段配色', type: 'palette', default: ['#5b8def', '#46b083', '#e0a23a'],
    options: [
      ['#5b8def', '#46b083', '#e0a23a'],
      ['#7a5ae0', '#5b8def', '#46b083'],
      ['#e8503a', '#e0a23a', '#46b083'],
      ['#2b2b30', '#5b8def', '#9aa0ad'],
    ],
    description: '三个阶段（后期 / 成长 / 早期）的色序。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function lighten(hex, amt) {
  const c = String(hex).replace('#', '');
  const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const n = parseInt(f, 16);
  const r = Math.round(((n >> 16) & 255) + (255 - ((n >> 16) & 255)) * amt);
  const g = Math.round(((n >> 8) & 255) + (255 - ((n >> 8) & 255)) * amt);
  const b = Math.round((n & 255) + (255 - (n & 255)) * amt);
  return `rgb(${r},${g},${b})`;
}

export default function SlideMekko(props) {
  const p = { ...defaultProps, ...props };
  const cats = p.categories.slice(0, Math.max(3, Math.min(p.categories.length, p.itemCount)));
  const grand = cats.reduce((s, c) => s + c.total, 0);
  const pal = p.palette;
  const GAP_PCT = 1.1;                                  // gap between columns, % of plot width
  const totalGap = GAP_PCT * (cats.length - 1);
  const usable = 100 - totalGap;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      {/* legend */}
      <div style={{ display: 'flex', gap: 30, marginTop: 16, flexWrap: 'wrap' }}>
        {p.stages.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, background: pal[i] }} />
            <span style={{ fontSize: 26, fontWeight: 700, color: 'var(--aip-ink)' }}>{st}</span>
          </div>
        ))}
      </div>

      {/* plot */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex',
        background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(28px) saturate(140%)',
        WebkitBackdropFilter: 'blur(28px) saturate(140%)', border: '1px solid rgba(255,255,255,.72)',
        borderRadius: 28, padding: '26px 40px 22px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* % axis */}
        {p.showAxis && (
          <div style={{ flex: '0 0 auto', width: 58, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', paddingBottom: 64, paddingTop: 2 }}>
            {[100, 75, 50, 25, 0].map((v) => (
              <div key={v} style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: '#9a9ba4',
                fontWeight: 700, textAlign: 'right', paddingRight: 14 }}>{v}</div>
            ))}
          </div>
        )}

        {/* columns area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', gap: `${GAP_PCT}%` }}>
          {/* horizontal gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${f * (100 - 64 / 6)}%`,
              borderTop: '1px dashed rgba(43,43,48,.12)', height: 0, pointerEvents: 'none',
              bottom: 'auto', transform: `translateY(${f === 1 ? -1 : 0}px)` }} />
          ))}

          {cats.map((c, ci) => {
            const wPct = (c.total / grand) * usable;
            const partSum = c.parts.reduce((s, x) => s + x, 0);
            const on = p.highlight && ci === p.highlightIndex;
            const dim = p.highlight && !on;
            return (
              <div key={ci} style={{ width: `${wPct}%`, display: 'flex', flexDirection: 'column',
                opacity: dim ? 0.6 : 1, transition: 'all .3s ease',
                transform: on ? 'translateY(-8px)' : 'none' }}>
                {/* column total + width chip */}
                <div style={{ flex: '0 0 auto', textAlign: 'center', marginBottom: 8, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: on ? pal[0] : 'var(--aip-ink)' }}>
                    {c.total}<small style={{ fontSize: 19, color: '#8a8b94', fontWeight: 700 }}> 亿</small>
                  </div>
                </div>
                {/* stacked cells */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
                  borderRadius: 12, overflow: 'hidden',
                  boxShadow: on ? `0 0 0 3px ${pal[0]}, 0 18px 40px ${hexA(pal[0], 0.34)}`
                    : '0 10px 26px rgba(70,72,100,.16)' }}>
                  {c.parts.map((pt, si) => {
                    const hPct = (pt / partSum) * 100;
                    const col = pal[si] || '#9aa0ad';
                    return (
                      <div key={si} style={{ flexBasis: `${hPct}%`, flexGrow: 0, flexShrink: 0,
                        background: `linear-gradient(180deg, ${lighten(col, 0.12)}, ${col})`,
                        borderBottom: si < c.parts.length - 1 ? '1px solid rgba(255,255,255,.55)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative' }}>
                        {p.showCellPct && hPct > 11 && wPct > 9 && (
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: hPct > 22 ? 28 : 22,
                            fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,.22)' }}>
                            {Math.round(hPct)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* category label */}
                <div style={{ flex: '0 0 auto', height: 56, marginTop: 10, display: 'flex',
                  alignItems: 'flex-start', justifyContent: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: wPct > 14 ? 27 : 22, fontWeight: 700,
                    color: on ? pal[0] : 'var(--aip-ink)', lineHeight: 1.12, textWrap: 'balance' }}>{c.label}</span>
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
