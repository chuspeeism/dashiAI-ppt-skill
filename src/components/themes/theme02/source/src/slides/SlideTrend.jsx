/**
 * SlideTrend.jsx — Slide 03 · 市场全景 / 逐季度融资走势.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideTrendDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm                strings
 *   data         Array<{label,value,secondary}>   series (金额 + 笔数)
 *   chartType    'bar' | 'line' | 'area'   primary chart form
 *   showSecondary boolean  overlay the secondary (笔数) series
 *   showValueLabels boolean show numeric labels on the chart
 *   focusEnabled boolean   emphasise one data point
 *   focusIndex   number    0-based point to emphasise
 *   showAnnotation boolean show/hide the interpretation note
 *   annotation   string    interpretation text
 *   stats        Array<{value,unit,caption}>  side summary figures
 *   seriesLabels {primary, secondary}  legend captions
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';
import { TrendChart } from '../gxnCharts.jsx';

export const slideTrendDefaults = {
  kicker: 'MARKET · 市场全景',
  title: '逐季度融资走势 ',
  titleEm: '前高后稳',
  data: [
    { label: 'Q1', value: 162, secondary: 18 },
    { label: 'Q2', value: 284, secondary: 26 },
    { label: 'Q3', value: 318, secondary: 31 },
    { label: 'Q4', value: 206, secondary: 22 },
  ],
  chartType: 'line',
  showSecondary: true,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 2,
  showAnnotation: true,
  annotation: 'Q2–Q3 为融资高峰，Q4 回落但仍处高位。平均单笔约 10 亿美元，市场对头部标的高度追捧。',
  stats: [
    { value: '970', unit: '亿美元', caption: '全年融资总额' },
    { value: '97', unit: '笔', caption: '大额融资事件' },
    { value: '≈10', unit: '亿/笔', caption: '平均单笔规模' },
  ],
  seriesLabels: { primary: '融资额（亿美元）', secondary: '事件笔数' },
};

export const slideTrendControls = [
  { key: 'chartType', type: 'enum', label: '图表类型', default: 'line',
    options: [{ value: 'bar', label: '柱状' }, { value: 'line', label: '折线' }, { value: 'area', label: '面积' }],
    describe: '主数据系列的呈现形式' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一数据点' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 2, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.data ? p.data.length : 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调数据点的序号' },
  { key: 'showSecondary', type: 'toggle', label: '次要指标', default: true,
    describe: '叠加显示次要系列（事件笔数）' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true,
    describe: '在图表上显示具体数值' },
  { key: 'showAnnotation', type: 'toggle', label: '解读文案', default: true,
    describe: '显示/隐藏右下角的趋势解读' },
];

export function SlideTrend(props) {
  const p = { ...slideTrendDefaults, ...props };
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.data.length - 1, p.focusIndex)) : -1;
  const sch = p.gxnScheme || {};

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "02 / 23"} />

        <div className="gxn-rise-2" style={{
          flex: 1, marginTop: 44, display: 'grid', gridTemplateColumns: '1.62fr 1fr',
          gap: 56, minHeight: 0,
        }}>
          {/* chart panel */}
          <section className="gxn-panel" style={{ padding: '34px 40px 24px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', gap: 34, marginBottom: 8 }}>
              <Legend color="var(--gxn-accent)" label={p.seriesLabels.primary} />
              {p.showSecondary && <Legend color="var(--gxn-accent-cool)" label={p.seriesLabels.secondary} dashed />}
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <TrendChart data={p.data} chartType={p.chartType} showSecondary={p.showSecondary}
                          focusIndex={fIdx} showValueLabels={p.showValueLabels}
                          accent={sch.accent} accent2={sch.accent2} cool={sch.cool} glow={sch.glow}
                          auroraColors={sch.aurora} auroraSpeed={sch.auroraSpeed} />
            </div>
          </section>

          {/* side column */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 22, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {p.stats.map((s, i) => (
                <div key={i} className="gxn-panel" style={{ padding: '22px 28px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span className={cx('gxn-num', i === 0 && 'gxn-aurora-num')} style={{ fontSize: 56, fontWeight: 600, color: i === 0 ? 'var(--gxn-accent)' : 'var(--gxn-text)', textShadow: i === 0 ? '0 0 28px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                    {s.value}<span style={{ fontSize: 24, marginLeft: 8, color: 'var(--gxn-dim)' }}>{s.unit}</span>
                  </span>
                  <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', textAlign: 'right', maxWidth: 180 }}>{s.caption}</span>
                </div>
              ))}
            </div>
            {p.showAnnotation && (
              <div className="gxn-panel" style={{ padding: '26px 30px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
                <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.08em' }}>趋势解读</span>
                <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.55, color: 'var(--gxn-dim)' }}>{p.annotation}</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 22, height: dashed ? 0 : 12, borderRadius: 4,
                     borderTop: dashed ? `3px dashed ${color}` : 'none',
                     background: dashed ? 'none' : color,
                     boxShadow: dashed ? 'none' : `0 0 14px -1px ${color}` }} />
      <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{label}</span>
    </span>
  );
}

export default SlideTrend;
