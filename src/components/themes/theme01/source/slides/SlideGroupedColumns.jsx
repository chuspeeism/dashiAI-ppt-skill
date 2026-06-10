// SlideGroupedColumns.jsx — 同比对比 / grouped (clustered) column chart.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A frosted plot with horizontal gridlines + y-axis ticks; each category holds a
// cluster of 1–2 value-proportional columns (e.g. 2023 vs 2024) with value chips
// riding their tops. The later series is the bold accent; the earlier one sits
// behind in a muted tone, so growth reads as the gap between the pair. Category
// count, series count, value chips, gridlines and accent are tweakable; text
// lives in defaultProps. Pure CSS flex — exports cleanly to PDF / PPTX.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场全景 · 同比对比',
  tone: 'green',
  title: '一年之间，赛道翻倍',
  en: 'Year-over-Year by Track',
  cn: '各赛道 2023 与 2024 大额融资额对比（亿美元）',
  series: [
    { name: '2023', color: '#9aa0ad' },
    { name: '2024', color: '#46b083' },
  ],
  // each category carries one value per series (aligned to `series` order)
  categories: [
    { label: '通用大模型', values: [230, 420] },
    { label: '基础设施 · 算力', values: [120, 255] },
    { label: '垂直应用', values: [95, 150] },
    { label: 'AI 芯片', values: [60, 97] },
    { label: '具身 · 机器人', values: [18, 70] },
  ],
  unit: '亿',
  axisMax: 450,
  tickStep: 150,
  caption: '柱状图 · 五大赛道全线放量，大模型与算力增量最猛',
  // tweakable (universal names)
  itemCount: 5,
  seriesCount: 2,
  showValues: true,
  showGrid: true,
  showLegend: true,
  accentColor: '#46b083',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '类别数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 类',
    description: '横轴上的类别（柱组）数量。' },
  { key: 'seriesCount', label: '系列数量', type: 'number', default: 2, min: 1, max: 2, step: 1, unit: ' 组',
    description: '每个类别并排的柱子数量（1 = 仅最新年，2 = 同比对比）。' },
  { key: 'showValues', label: '数值标签', type: 'boolean', default: true,
    description: '每根柱顶数值胶囊的显示。' },
  { key: 'showGrid', label: '网格刻度', type: 'boolean', default: true,
    description: '绘图区水平网格线与左侧刻度的显示。' },
  { key: 'showLegend', label: '顶部图例', type: 'boolean', default: true,
    description: '顶部系列图例的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '最新系列柱子与标题点的主题色（早期系列保持灰调）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideGroupedColumns(props) {
  const p = { ...defaultProps, ...props };
  const nC = Math.max(3, Math.min(5, p.itemCount));
  const nS = Math.max(1, Math.min(2, p.seriesCount));
  const cats = p.categories.slice(0, nC);
  // last series uses the accent; earlier ones keep their muted palette color.
  const series = p.series.slice(0, nS).map((s, i, arr) => (i === arr.length - 1 ? { ...s, color: p.accentColor } : s));
  const max = p.axisMax || Math.max.apply(null, cats.flatMap((c) => c.values.slice(0, nS))) * 1.1;
  const ticks = [];
  for (let v = 0; v <= max + 0.001; v += p.tickStep) ticks.push(v);

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      {/* legend */}
      {p.showLegend && (
        <div style={{ display: 'flex', gap: 30, marginTop: 16 }}>
          {series.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: 7, background: s.color,
                boxShadow: `0 3px 10px ${hexA(s.color, 0.4)}` }} />
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--aip-ink)' }}>{s.name}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex',
        background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '30px 40px 24px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* y-axis ticks */}
        {p.showGrid && (
          <div style={{ flex: '0 0 auto', position: 'relative', width: 78, marginRight: 8 }}>
            {ticks.map((tval, i) => (
              <div key={i} style={{ position: 'absolute', right: 8, bottom: `calc(${(tval / max) * 100}% + 44px)`,
                transform: 'translateY(50%)', fontFamily: "'Space Mono', monospace", fontSize: 21,
                color: 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{tval}</div>
            ))}
          </div>
        )}

        {/* plot */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* gridlines */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            {p.showGrid && ticks.map((tval, i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(tval / max) * 100}%`,
                borderTop: i === 0 ? '2px solid rgba(43,43,48,.2)' : '1px dashed rgba(43,43,48,.12)' }} />
            ))}
            {/* columns */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end' }}>
              {cats.map((c, ci) => (
                <div key={ci} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'flex-end',
                  justifyContent: 'center', gap: 12 }}>
                  {series.map((s, si) => {
                    const v = c.values[si] || 0;
                    const h = Math.max(0, (v / max) * 100);
                    const last = si === series.length - 1;
                    return (
                      <div key={si} style={{ position: 'relative', width: nS === 1 ? '46%' : '34%', maxWidth: 96,
                        height: `${h}%`, borderRadius: '12px 12px 0 0',
                        background: last
                          ? `linear-gradient(180deg, ${s.color}, ${hexA(s.color, 0.82)})`
                          : `linear-gradient(180deg, ${hexA(s.color, 0.85)}, ${hexA(s.color, 0.6)})`,
                        boxShadow: last ? `0 -2px 0 rgba(255,255,255,.4) inset, 0 14px 30px ${hexA(s.color, 0.34)}`
                          : '0 12px 24px rgba(70,72,100,.16)' }}>
                        {p.showValues && (
                          <span style={{ position: 'absolute', top: -42, left: '50%', transform: 'translateX(-50%)',
                            fontFamily: "'Space Mono', monospace", fontSize: last ? 30 : 26, fontWeight: 700,
                            color: last ? s.color : 'var(--aip-ink-2)', whiteSpace: 'nowrap' }}>{v}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* x-axis labels */}
          <div style={{ flex: '0 0 auto', height: 44, display: 'flex', alignItems: 'center' }}>
            {cats.map((c, ci) => (
              <div key={ci} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 27, fontWeight: 800,
                color: 'var(--aip-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 4px' }}>{c.label}</div>
            ))}
          </div>
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{`单位 ${p.unit}美元 · `}{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
