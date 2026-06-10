/**
 * SlideRegion.jsx — Slide 15 · 地区分布（图表页 · 100% 堆叠条）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideRegionDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   data         Array<{label,value,pct,color?}>  region dataset
 *   regionCount  number   how many regions to show
 *   focusEnabled boolean  glow-emphasise one region
 *   focusIndex   number   0-based region to emphasise
 *   showLegend   boolean  show the legend list
 *   showValueLabels boolean show % labels on bar segments
 *   showCallout  boolean  show the dominant-leader callout panel
 *   callout      {value,unit,caption,note}  leader readout (text)
 *   gxnScheme    object   deck color scheme (preview-injected; optional)
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx, GXN_PALETTE } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRegionDefaults = {
  kicker: 'GEOGRAPHY · 地区分布',
  title: '融资高度集聚 ',
  titleEm: '湾区独占六成',
  data: [
    { label: '旧金山湾区', value: 620, pct: '63.9%' },
    { label: '纽约', value: 120, pct: '12.4%' },
    { label: '西雅图', value: 95, pct: '9.8%' },
    { label: '波士顿', value: 75, pct: '7.7%' },
    { label: '其他地区', value: 60, pct: '6.2%', color: '#41454f' },
  ],
  regionCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showLegend: true,
  showValueLabels: true,
  showCallout: true,
  callout: { value: '63.9', unit: '%', caption: '旧金山湾区融资占比', note: '人才、资本、算力的虹吸效应进一步强化，“地理护城河”短期难以撼动。' },
};

export const slideRegionControls = [
  { key: 'regionCount', type: 'number', label: '地区数量', default: 5, min: 3, step: 1,
    maxFrom: (p) => (p.data ? p.data.length : 5), describe: '展示的地区数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一地区' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.regionCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调地区的序号' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '显示/隐藏图例列表' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true,
    describe: '在条形段上显示占比' },
  { key: 'showCallout', type: 'toggle', label: '主导读数', default: true,
    describe: '显示/隐藏主导地区读数面板' },
];

export function SlideRegion(props) {
  const p = { ...slideRegionDefaults, ...props };
  const count = Math.max(2, Math.min(p.data.length, p.regionCount));
  const data = p.data.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;
  const colorOf = (d, i) => d.color || palette[i % palette.length];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "19 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 44, display: 'grid',
          gridTemplateColumns: p.showCallout ? '1.5fr 1fr' : '1fr', gap: 64, alignItems: 'center', minHeight: 0 }}>

          {/* left: stacked bar + legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ display: 'flex', width: '100%', height: 150, gap: 8 }}>
              {data.map((d, i) => {
                const w = (d.value / total) * 100;
                const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
                const c = colorOf(d, i);
                return (
                  <div key={i} style={{ width: `${w}%`, position: 'relative', borderRadius: 14,
                    background: c, opacity: isDim ? 0.4 : 1,
                    boxShadow: isF ? `0 0 60px -10px ${c}, inset 0 0 0 2px rgba(255,255,255,0.25)` : (!isDim ? `0 0 26px -10px ${c}` : 'none'),
                    transition: 'opacity .3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                    {p.showValueLabels && w > 7 && (
                      <span className="gxn-num" style={{ fontSize: isF ? 40 : 30, fontWeight: 700, color: '#07090b' }}>{d.pct}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {p.showLegend && (
              <ul className="gxn-legend" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 48px' }}>
                {data.map((d, i) => {
                  const isF = p.focusEnabled && i === fIdx; const isDim = p.focusEnabled && i !== fIdx;
                  return (
                    <li key={i} className={cx('gxn-legend-row', isDim && 'is-dim')}>
                      <span className="gxn-dot" style={{ background: colorOf(d, i), color: colorOf(d, i) }} />
                      <span style={{ flex: 1, fontSize: 'var(--gxn-fs-body)', fontWeight: isF ? 700 : 500, color: 'var(--gxn-text)' }}>{d.label}</span>
                      <span className="gxn-num" style={{ fontSize: 'var(--gxn-fs-body)', color: 'var(--gxn-dim)' }}>{d.value}</span>
                      <span className="gxn-num" style={{ width: 96, textAlign: 'right', fontSize: 'var(--gxn-fs-body)', fontWeight: 600, color: isF ? colorOf(d, i) : 'var(--gxn-text)' }}>{d.pct}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* right: dominant callout */}
          {p.showCallout && (
            <div className="gxn-panel is-focus" style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center' }}>
              <div className="gxn-num" style={{ fontSize: 168, fontWeight: 600, lineHeight: 0.86, letterSpacing: '-0.03em', color: 'var(--gxn-accent)', textShadow: '0 0 44px rgba(var(--gxn-glow),0.5)' }}>
                {p.callout.value}<span style={{ fontSize: '0.3em', marginLeft: 8, color: 'var(--gxn-dim)' }}>{p.callout.unit}</span>
              </div>
              <span style={{ fontSize: 30, fontWeight: 600, color: 'var(--gxn-text)' }}>{p.callout.caption}</span>
              <p style={{ margin: 0, fontSize: 25, lineHeight: 1.5, color: 'var(--gxn-dim)' }}>{p.callout.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideRegion;
