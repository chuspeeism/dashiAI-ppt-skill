/**
 * SlideIndustry.jsx — Slide 04 · 横向透视 / 行业赛道融资额占比.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideIndustryDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm        strings
 *   data         Array<{label,value,pct,color?,note?}>  category dataset
 *   chartType    'donut' | 'pie' | 'bar'   chart form
 *   focusEnabled boolean   emphasise one category (pops the segment out)
 *   focusIndex   number    0-based category to emphasise
 *   showLegend   boolean   show/hide the legend column
 *   showCenter   boolean   show/hide the donut centre readout (donut only)
 *   showValueLabels boolean show numeric labels on the chart
 *   centerValue, centerLabel  strings for the donut centre
 *   finding      string    key-finding note shown under the legend
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';
import { ShareChart } from '../gxnCharts.jsx';
import { GXN_PALETTE } from '../gxnTheme.js';

export const slideIndustryDefaults = {
  kicker: 'STRUCTURE · 横向透视',
  title: '行业赛道融资额占比 ',
  titleEm: '大模型领跑',
  data: [
    { label: '通用大模型', value: 420, pct: '43.3%' },
    { label: '垂直应用', value: 245, pct: '25.3%' },
    { label: 'AI 基础设施', value: 158, pct: '16.3%' },
    { label: 'AI 芯片', value: 97, pct: '10.0%' },
    { label: '其他（工具链 / 安全）', value: 50, pct: '5.1%', color: '#41454f', hatch: true },
  ],
  chartType: 'donut',
  focusEnabled: true,
  focusIndex: 0,
  showLegend: true,
  showCenter: true,
  showValueLabels: true,
  centerValue: '970',
  centerLabel: '亿美元 · 全年合计',
  finding: '通用大模型占据近半壁江山，反映投资人押注 AGI 叙事；基础设施与芯片合计超四分之一，上游热度不减。',
};

export const slideIndustryControls = [
  { key: 'chartType', type: 'enum', label: '图表类型', default: 'donut',
    options: [{ value: 'donut', label: '环形' }, { value: 'pie', label: '饼图' }, { value: 'bar', label: '条形' }],
    describe: '占比数据的呈现形式' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一赛道' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.data ? p.data.length : 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调赛道的序号' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '显示/隐藏右侧图例列表' },
  { key: 'showCenter', type: 'toggle', label: '中心数据', default: true,
    visibleWhen: (p) => p.chartType === 'donut',
    describe: '显示/隐藏环形图中心的合计读数' },
  { key: 'showValueLabels', type: 'toggle', label: '数值标签', default: true,
    describe: '在图表上显示占比数值' },
];

export function SlideIndustry(props) {
  const p = { ...slideIndustryDefaults, ...props };
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.data.length - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;
  const colorOf = (d, i) => d.color || palette[i % palette.length];

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "04 / 23"} />

        <div className="gxn-rise-2" style={{
          flex: 1, marginTop: 40, display: 'grid',
          gridTemplateColumns: p.showLegend ? '1fr 1fr' : '1fr', gap: 64,
          alignItems: 'center', minHeight: 0,
        }}>
          {/* chart */}
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShareChart data={p.data} chartType={p.chartType} focusIndex={fIdx}
                        showCenter={p.showCenter} showValueLabels={p.showValueLabels}
                        centerValue={p.centerValue} centerLabel={p.centerLabel} palette={palette}
                        auroraColors={p.gxnScheme && p.gxnScheme.aurora} auroraSpeed={p.gxnScheme && p.gxnScheme.auroraSpeed} />
          </div>

          {/* legend + finding */}
          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, maxWidth: 640 }}>
              <ul className="gxn-legend" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {p.data.map((d, i) => {
                  const isDim = p.focusEnabled && i !== fIdx;
                  const isF = p.focusEnabled && i === fIdx;
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
              {p.finding && (
                <div className="gxn-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.08em' }}>核心发现</span>
                  <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.55, color: 'var(--gxn-dim)' }}>{p.finding}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideIndustry;
