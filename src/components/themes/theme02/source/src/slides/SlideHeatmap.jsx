/**
 * SlideHeatmap.jsx — 月度热力图（图表页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 一个时间序列的「热力网格」：每个单元格按数值映射辉光强度，峰值自动发光。
 * 适合月度 / 周度等密集时间序列。纯展示，无运行时依赖。
 *
 * ── Props (see slideHeatmapDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   cells        Array<{label,value}>  时间序列数据 (text + numbers)
 *   cellCount    number   展示的单元格数量（≤ cells.length）
 *   columns      number   网格列数（2–6），自动换行成多行
 *   valueUnit    string   数值单位后缀（如「亿」）
 *   focusEnabled boolean  高亮某一格（峰值/重点）
 *   focusIndex   number   0-based 被强调单元格序号
 *   showValues   boolean  单元格内显示数值
 *   showPeakTag  boolean  自动为最高值单元格加「峰值」标记
 *   showScale    boolean  底部显示强度图例渐变条
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideHeatmapDefaults = {
  kicker: 'HEATMAP · 月度节奏',
  title: '逐月融资热力 ',
  titleEm: '双峰浮现',
  cells: [
    { label: '1 月', value: 45 }, { label: '2 月', value: 58 }, { label: '3 月', value: 59 },
    { label: '4 月', value: 86 }, { label: '5 月', value: 105 }, { label: '6 月', value: 93 },
    { label: '7 月', value: 92 }, { label: '8 月', value: 118 }, { label: '9 月', value: 108 },
    { label: '10 月', value: 73 }, { label: '11 月', value: 81 }, { label: '12 月', value: 52 },
  ],
  cellCount: 12,
  columns: 6,
  valueUnit: '亿',
  focusEnabled: true,
  focusIndex: 7,
  showValues: true,
  showPeakTag: true,
  showScale: true,
};

export const slideHeatmapControls = [
  { key: 'cellCount', type: 'number', label: '单元格数量', default: 12, min: 3, step: 1,
    maxFrom: (p) => (p.cells ? p.cells.length : 12), describe: '展示的时间单元数量' },
  { key: 'columns', type: 'number', label: '网格列数', default: 6, min: 2, max: 6, step: 1,
    describe: '热力网格的列数，自动换行' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一单元格' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 7, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.cellCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调单元格的序号' },
  { key: 'showValues', type: 'toggle', label: '数值显示', default: true,
    describe: '单元格内显示/隐藏数值' },
  { key: 'showPeakTag', type: 'toggle', label: '峰值标记', default: true,
    describe: '自动标注最高值单元格' },
  { key: 'showScale', type: 'toggle', label: '强度图例', default: true,
    describe: '底部强度渐变图例显隐' },
];

export function SlideHeatmap(props) {
  const p = { ...slideHeatmapDefaults, ...props };
  const count = Math.max(2, Math.min(p.cells.length, p.cellCount));
  const cells = p.cells.slice(0, count);
  const cols = Math.max(2, Math.min(6, p.columns));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const vMax = Math.max(...cells.map((c) => c.value), 1);
  const vMin = Math.min(...cells.map((c) => c.value), 0);
  const peakIdx = p.showPeakTag ? cells.reduce((m, c, i) => (c.value > cells[m].value ? i : m), 0) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "03 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 44, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{
            flex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridAutoRows: '1fr', gap: 18, minHeight: 0,
          }}>
            {cells.map((c, i) => {
              const t = (c.value - vMin) / (vMax - vMin || 1); // 0..1
              const isF = i === fIdx;
              const isDim = fIdx >= 0 && !isF;
              const isPeak = i === peakIdx;
              const a = 0.06 + t * 0.50;          // fill alpha by intensity
              const border = 0.12 + t * 0.62;     // border alpha by intensity
              return (
                <div key={i} className={cx('gxn-panel', isF && 'is-focus')}
                     style={{
                       position: 'relative', display: 'flex', flexDirection: 'column',
                       justifyContent: 'space-between', padding: '22px 24px',
                       borderRadius: 18, minHeight: 0, overflow: 'hidden',
                       opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease',
                       background: isF ? undefined
                         : `radial-gradient(135% 118% at 50% 122%, rgba(var(--gxn-glow),${(a + 0.14).toFixed(3)}), rgba(var(--gxn-glow),${(a * 0.5).toFixed(3)}) 60%, rgba(255,255,255,0.014))`,
                       border: isF ? undefined : `1px solid rgba(var(--gxn-glow),${border.toFixed(3)})`,
                       boxShadow: isF ? undefined : `inset 0 -14px ${Math.round(46 + t * 80)}px -20px rgba(var(--gxn-glow),${(0.4 + t * 0.8).toFixed(2)})`,
                     }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'nowrap', minWidth: 0 }}>
                    <span className="gxn-mono" style={{ fontSize: 25, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{c.label}</span>
                    {isPeak && p.showPeakTag && (
                      <span className="gxn-mono" style={{
                        fontSize: 24, padding: '5px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                        color: 'var(--gxn-accent)', border: '1px solid rgba(var(--gxn-glow),0.5)',
                        background: 'rgba(var(--gxn-glow),0.10)',
                      }}>峰值</span>
                    )}
                  </div>
                  {p.showValues && (
                    <div className="gxn-num" style={{
                      fontSize: 60, fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.02em',
                      color: isF || t > 0.7 ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                      textShadow: (isF || t > 0.7) ? '0 0 30px rgba(var(--gxn-glow),0.55)' : 'none',
                    }}>
                      {c.value}
                      {p.valueUnit && <span style={{ fontSize: 26, marginLeft: 6, color: 'var(--gxn-dim)', fontWeight: 500 }}>{p.valueUnit}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {p.showScale && (
            <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 30 }}>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>低</span>
              <div style={{
                flex: 1, height: 14, borderRadius: 8,
                background: 'linear-gradient(90deg, rgba(var(--gxn-glow),0.06), rgba(var(--gxn-glow),0.85))',
                boxShadow: 'inset 0 0 18px -6px rgba(var(--gxn-glow),0.8)',
                border: '1px solid var(--gxn-line)',
              }} />
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)' }}>高 · 单位 {p.valueUnit}美元</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideHeatmap;
