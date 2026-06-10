// SlideHeatmap.jsx — 资金热力矩阵 / sector × quarter heat-matrix.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A table/chart hybrid: rows are sectors, columns are quarters, and each cell's
// fill intensity tracks its funding value (single-accent ramp, never a rainbow).
// The single hottest cell is promoted to a fluorescent "stamp" with a tilt; an
// optional right-hand 合计 column adds a table read. Row count / highlight /
// legend / accent are tweakable; all text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场全景 · 热度分布',
  tone: 'blue',
  title: '资金热力矩阵',
  en: 'Where The Money Flowed',
  cn: '赛道 × 季度 · 单笔大额融资额（亿美元）',
  colLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
  rows: [
    { label: '通用大模型', cells: [88, 96, 110, 126] },
    { label: 'AI 基础设施 / 算力', cells: [42, 51, 63, 92] },
    { label: '垂直应用', cells: [21, 28, 34, 39] },
    { label: 'AI 硬件 · 机器人', cells: [9, 14, 22, 31] },
    { label: '企业 AI 服务', cells: [12, 16, 19, 24] },
  ],
  unit: '亿',
  caption: '热力矩阵 · 资金向大模型与算力、向下半年同时收口',
  // tweakable (universal names)
  rowCount: 5,
  highlight: true,
  showTotals: true,
  showLegend: true,
  accentColor: '#5b8def',
  evil: false,
  showCaption: true,
};

export const controls = [
  { key: 'rowCount', label: '赛道行数', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 行',
    description: '矩阵展示的赛道（行）数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把数值最高的单元格渲染成荧光「印章」。' },
  { key: 'showTotals', label: '合计列', type: 'boolean', default: true,
    description: '右侧每行合计列的显示。' },
  { key: 'showLegend', label: '热度图例', type: 'boolean', default: true,
    description: '底部「低 → 高」热度渐变图例的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '热度单一色家族与强调印章的颜色。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹绘图区 + 单元格 45° 斜纹 + 按热度递增的霓虹辉光（最热格最亮）。' },
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

export default function SlideHeatmap(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const rows = p.rows.slice(0, Math.max(3, Math.min(5, p.rowCount)));
  const cols = p.colLabels.length;

  // global max for the colour ramp + locate the single hottest cell
  let max = 0, hot = { r: -1, c: -1, v: -1 };
  rows.forEach((row, r) => row.cells.forEach((v, c) => {
    if (v > max) max = v;
    if (v > hot.v) hot = { r, c, v };
  }));
  max = max || 1;
  const totals = rows.map((row) => row.cells.reduce((a, b) => a + b, 0));
  const maxTotal = Math.max.apply(null, totals) || 1;

  const gridCols = `300px repeat(${cols}, 1fr)${p.showTotals ? ' 220px' : ''}`;
  const evil = p.evil;
  const HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.14) 0 2px, transparent 2px 9px)';

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', marginTop: 22 }}>
        {/* column header row */}
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 12, marginBottom: 12, flex: '0 0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 6 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.14em',
              fontSize: 24, color: 'var(--aip-ink-3)' }}>赛道 \ 季度</span>
          </div>
          {p.colLabels.map((c, i) => (
            <div key={i} style={{ textAlign: 'center', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 30, letterSpacing: '.06em', color: 'var(--aip-ink-2)' }}>{c}</span>
            </div>
          ))}
          {p.showTotals && (
            <div style={{ textAlign: 'center', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--aip-ink-2)' }}>合计</span>
            </div>
          )}
        </div>

        {/* matrix body */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridAutoRows: '1fr', gap: 12,
          ...(evil ? {
            padding: 16, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.32)',
            backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)',
            backgroundSize: '24px 24px', border: '1px solid rgba(255,255,255,.55)',
            boxShadow: '0 1px 0 rgba(255,255,255,.7) inset',
          } : {}) }}>
          {rows.map((row, r) => (
            <div key={r} style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 12 }}>
              {/* row label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 22, textAlign: 'right' }}>
                <span style={{ fontSize: 31, fontWeight: 800, color: 'var(--aip-ink)', lineHeight: 1.1 }}>{row.label}</span>
              </div>
              {/* cells */}
              {row.cells.map((v, c) => {
                const t = v / max;                       // 0..1 normalised
                const on = p.highlight && r === hot.r && c === hot.c;
                const alpha = 0.08 + 0.62 * t;            // light → strong tint
                const fg = on ? readableOn(ac) : (t > 0.62 ? '#ffffff' : 'var(--aip-ink)');
                const cellShadow = evil
                  ? (on
                      ? `0 0 0 1px ${hexA(ac, 0.5)}, 0 0 46px ${hexA(ac, 0.6)}, 0 20px 50px ${hexA(ac, 0.5)}, 0 2px 0 rgba(255,255,255,.4) inset`
                      : `0 0 ${Math.round(8 + t * 26)}px ${hexA(ac, 0.10 + t * 0.30)}, 0 1px 0 rgba(255,255,255,.4) inset`)
                  : (on
                      ? `0 22px 52px ${hexA(ac, 0.5)}, 0 2px 0 rgba(255,255,255,.4) inset`
                      : '0 1px 0 rgba(255,255,255,.5) inset');
                return (
                  <div key={c} style={{
                    position: 'relative', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', borderRadius: 16, overflow: 'hidden',
                    transform: on ? 'rotate(-1.6deg) scale(1.02)' : 'none', zIndex: on ? 2 : 1,
                    background: on ? ac : hexA(ac, alpha),
                    backgroundImage: evil ? HATCH : undefined,
                    border: `1px solid ${on ? hexA(ac, evil ? 0.6 : 0.5) : hexA(ac, evil ? 0.28 : 0.18)}`,
                    boxShadow: cellShadow,
                  }}>
                    <span style={{ fontSize: on ? 56 : 50, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-.02em', color: fg }}>{v}</span>
                    {on && <span style={{ marginTop: 4, fontFamily: "'Space Mono', monospace", fontSize: 21, fontWeight: 700,
                      letterSpacing: '.08em', color: hexA(readableOn(ac) === '#ffffff' ? '#fff' : '#23232a', 0.85) }}>HOTTEST</span>}
                  </div>
                );
              })}
              {/* total cell */}
              {p.showTotals && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 16, background: 'rgba(255,255,255,.58)', backdropFilter: 'blur(22px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(22px) saturate(140%)', border: '1px solid rgba(255,255,255,.72)',
                  boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 16px 36px rgba(70,72,100,.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 0.9, color: 'var(--aip-ink)' }}>{totals[r]}</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--aip-ink-2)' }}>{p.unit}</span>
                  </div>
                  <div style={{ marginTop: 10, width: '64%', height: 7, borderRadius: 4, background: hexA(ac, 0.16), overflow: 'hidden' }}>
                    <div style={{ width: `${(totals[r] / maxTotal) * 100}%`, height: '100%', borderRadius: 4, background: ac }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* legend */}
        {p.showLegend && (
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--aip-ink-3)' }}>低</span>
            <div style={{ flex: '0 0 360px', height: 16, borderRadius: 8,
              background: `linear-gradient(90deg, ${hexA(ac, 0.08)}, ${hexA(ac, 0.7)}, ${ac})`,
              border: `1px solid ${hexA(ac, 0.25)}` }} />
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--aip-ink-2)' }}>高</span>
            <span style={{ marginLeft: 10, fontFamily: "'Space Mono', monospace", fontSize: 22, color: 'var(--aip-ink-3)' }}>单位 · {p.unit}美元</span>
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
