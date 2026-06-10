// SlideWaffle.jsx — 像形方格图 / waffle (unit) chart for part-to-whole share.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A 10×10 grid of 100 rounded "stickers", filled category-by-category so each
// cell literally reads as one percentage point — the part-to-whole story you can
// count by eye. A frosted legend lists each category with its swatch, share and
// value; one category can be promoted (the rest dim) to spotlight a single
// flow. Category count, highlight, legend, cell gap and accent are tweakable;
// text lives in defaultProps. Pure CSS grid — exports cleanly to PDF / PPTX.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视 · 资金去向',
  tone: 'violet',
  title: '100 美元，流向何处',
  en: 'Where Every Dollar Goes',
  cn: '把全年大额融资视作 100 份，看资金如何分配',
  unitNote: '每格 = 全年大额融资的 1%',
  items: [
    { label: '通用大模型', value: 45, color: '#5b8def', meta: 'OpenAI / Anthropic / xAI' },
    { label: 'AI 基础设施 · 算力', value: 24, color: '#46b083', meta: 'CoreWeave / Scale' },
    { label: '垂直应用层', value: 16, color: '#e0a23a', meta: 'Copilot / 搜索 / Agent' },
    { label: 'AI 芯片', value: 9, color: '#7a5ae0', meta: 'Groq / 定制算力' },
    { label: '具身智能 · 机器人', value: 6, color: '#e8503a', meta: 'Figure / 通用机器人' },
  ],
  caption: '像形图 · 近七成资金集中在大模型与算力两端',
  // tweakable (universal names)
  itemCount: 5,
  highlight: false,
  highlightIndex: 0,
  showLegend: true,
  showMeta: true,
  showPercent: true,
  cellGap: 8,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '类别数量', type: 'number', default: 5, min: 2, max: 5, step: 1, unit: ' 类',
    description: '参与拼格的类别数量（不足 100 的格子留作底色空格）。' },
  { key: 'highlight', label: '聚焦某类', type: 'boolean', default: false,
    description: '是否只点亮其中一类（其余格子与图例淡化）。' },
  { key: 'highlightIndex', label: '聚焦第几类', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被聚焦的类别序号（从 0 开始）。' },
  { key: 'showLegend', label: '右侧图例', type: 'boolean', default: true,
    description: '右侧类别图例 / 占比读数的显示。' },
  { key: 'showMeta', label: '副标说明', type: 'boolean', default: true,
    description: '图例中代表公司 / 说明小字的显示。' },
  { key: 'showPercent', label: '占比数值', type: 'boolean', default: true,
    description: '图例右侧百分比大数字的显示。' },
  { key: 'cellGap', label: '格子间距', type: 'number', default: 8, min: 3, max: 14, step: 1, unit: ' px',
    description: '方格之间的间隙大小。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '标题点 / 聚焦描边的主题色（不改各类别自身配色）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideWaffle(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const items = p.items.slice(0, Math.max(2, Math.min(5, p.itemCount)));
  const hiIdx = p.highlight ? Math.min(p.highlightIndex, items.length - 1) : -1;

  // build 100 cells: assign category index by cumulative count (row-major,
  // bottom-up so the stack reads like it's filling a tank).
  const cells = new Array(100).fill(-1);
  let cursor = 0;
  items.forEach((it, ci) => {
    const n = Math.max(0, Math.round(it.value));
    for (let k = 0; k < n && cursor < 100; k++) cells[cursor++] = ci;
  });

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', gap: 56,
        background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '36px 44px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* ── waffle grid ── */}
        <div style={{ flex: '0 0 auto', height: '100%', aspectRatio: '1 / 1', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)',
            gap: p.cellGap }}>
            {cells.map((ci, idx) => {
              const it = ci >= 0 ? items[ci] : null;
              const dim = hiIdx >= 0 && ci !== hiIdx;
              const on = hiIdx >= 0 && ci === hiIdx;
              const bg = it
                ? (dim ? hexA(it.color, 0.16) : it.color)
                : hexA('#5a5a70', 0.10);
              return (
                <div key={idx} style={{
                  borderRadius: 7, background: bg,
                  border: on ? `2px solid ${hexA('#ffffff', 0.85)}` : '1px solid rgba(255,255,255,.4)',
                  boxShadow: it && !dim
                    ? `0 3px 8px ${hexA(it.color, on ? 0.5 : 0.32)}${on ? `, 0 0 0 2px ${hexA(it.color, 0.6)}` : ''}`
                    : 'none',
                }} />
              );
            })}
          </div>
        </div>

        {/* ── legend ── */}
        {p.showLegend && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontSize: 21,
              letterSpacing: '.12em', textTransform: 'uppercase', color: hexA(ac, 0.95), fontWeight: 700, marginBottom: 6 }}>
              {`// 资金分配`}
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              {items.map((it, i) => {
                const dim = hiIdx >= 0 && i !== hiIdx;
                return (
                  <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', gap: 20,
                    borderTop: i === 0 ? 'none' : '1px solid rgba(43,43,48,.12)', opacity: dim ? 0.42 : 1 }}>
                    <span style={{ flex: '0 0 auto', width: 26, height: 26, borderRadius: 8, background: it.color,
                      boxShadow: `0 4px 12px ${hexA(it.color, 0.4)}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{it.label}</div>
                      {p.showMeta && it.meta && (
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: 'var(--aip-ink-3)',
                          marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.meta}</div>
                      )}
                    </div>
                    {p.showPercent && (
                      <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 50, fontWeight: 700,
                          color: it.color, letterSpacing: '-.02em', lineHeight: 1 }}>{it.value}</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, color: 'var(--aip-ink-3)' }}>%</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ flex: '0 0 auto', marginTop: 8, fontFamily: "'Space Mono', monospace",
              fontSize: 19, color: 'var(--aip-ink-3)' }}>{`* `}{p.unitNote}</div>
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
