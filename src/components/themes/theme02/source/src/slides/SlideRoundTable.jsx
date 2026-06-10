/**
 * SlideRoundTable.jsx — Slide 14 · 融资轮次结构（表格页 · 双指标）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 双指标表格：每行一个轮次，含「事件笔数」与「平均单笔」，各带等比内联条。
 *
 * ── Props (see slideRoundTableDefaults) ─────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   columns      {label,count,avg}   表头文案 (text)
 *   rows         Array<{label,count,avg}>  dataset (text + numbers)
 *   total        {label,count,avg}   合计行 (text)
 *   rowCount     number   how many of `rows` to show
 *   focusEnabled boolean  glow-emphasise one row
 *   focusIndex   number   0-based row to emphasise
 *   showCountBar boolean  show bars for the count metric
 *   showAvg      boolean  show the average-size metric column
 *   showAvgBar   boolean  show bars for the average metric
 *   showTotal    boolean  show the totals row
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRoundTableDefaults = {
  kicker: 'ROUNDS · 轮次结构',
  title: '融资轮次结构 ',
  titleEm: '越往后越集中',
  columns: { label: '融资轮次', count: '事件笔数', avg: '平均单笔（亿美元）' },
  rows: [
    { label: '种子轮 · Seed', count: 8, avg: 1.2 },
    { label: 'A 轮 · Series A', count: 12, avg: 1.8 },
    { label: 'B 轮 · Series B', count: 18, avg: 3.5 },
    { label: 'C 轮 · Series C', count: 15, avg: 6.8 },
    { label: 'D 轮及以后 · Series D+', count: 22, avg: 15.2 },
    { label: '未标明轮次 · Undisclosed', count: 22, avg: 18.6 },
  ],
  total: { label: '合计', count: 97, avg: '≈10' },
  rowCount: 6,
  focusEnabled: true,
  focusIndex: 4,
  showCountBar: true,
  showAvg: true,
  showAvgBar: true,
  showTotal: true,
};

export const slideRoundTableControls = [
  { key: 'rowCount', type: 'number', label: '行数', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.rows ? p.rows.length : 6), describe: '展示的轮次行数' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 4, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.rowCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号' },
  { key: 'showCountBar', type: 'toggle', label: '笔数条形', default: true,
    describe: '事件笔数列的等比条形显隐' },
  { key: 'showAvg', type: 'toggle', label: '平均单笔列', default: true,
    describe: '显示/隐藏平均单笔指标列' },
  { key: 'showAvgBar', type: 'toggle', label: '平均条形', default: true,
    visibleWhen: (p) => p.showAvg, describe: '平均单笔列的等比条形显隐' },
  { key: 'showTotal', type: 'toggle', label: '合计行', default: true,
    describe: '显示/隐藏底部合计行' },
];

function MetricCell({ value, unit, ratio, showBar, color, dim, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, minWidth: 0 }}>
      <span className="gxn-num" style={{ width: 116, textAlign: 'right', flex: '0 0 auto', fontSize: 40, fontWeight: 600, color, letterSpacing: '-0.01em' }}>
        {value}{unit && <span style={{ fontSize: 24, marginLeft: 5, color: 'var(--gxn-dim)' }}>{unit}</span>}
      </span>
      {showBar && (
        <div style={{ flex: 1, height: 12, borderRadius: 7, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', minWidth: 0 }}>
          <div style={{ height: '100%', width: `${Math.max(5, ratio * 100)}%`, borderRadius: 7,
                        background: 'linear-gradient(90deg, var(--gxn-accent), var(--gxn-accent-2))',
                        boxShadow: dim ? 'none' : '0 0 18px -3px rgba(var(--gxn-glow),0.8)' }} />
        </div>
      )}
    </div>
  );
}

export function SlideRoundTable(props) {
  const p = { ...slideRoundTableDefaults, ...props };
  const count = Math.max(1, Math.min(p.rows.length, p.rowCount));
  const rows = p.rows.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const maxC = Math.max(...rows.map((r) => r.count), 1);
  const maxA = Math.max(...rows.map((r) => r.avg), 1);

  const cols = ['minmax(0, 1.25fr)', '1.5fr'];
  if (p.showAvg) cols.push('1.5fr');
  const gridTemplateColumns = cols.join(' ');

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "18 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 38, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* head */}
          <div style={{ display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 40, padding: '0 28px 14px', borderBottom: '1px solid var(--gxn-line)' }}>
            <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.08em' }}>{p.columns.label}</span>
            <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.08em' }}>{p.columns.count}</span>
            {p.showAvg && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.08em' }}>{p.columns.avg}</span>}
          </div>

          {/* rows */}
          <div style={{ flex: 1, display: 'grid', gridTemplateRows: `repeat(${count}, 1fr)`, gap: 8, marginTop: 12, minHeight: 0 }}>
            {rows.map((r, i) => {
              const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
              return (
                <div key={i} className={cx(isF && 'gxn-panel is-focus')}
                     style={{ display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 40, padding: '0 28px',
                              borderRadius: isF ? 'var(--gxn-radius)' : 0, borderBottom: isF ? 'none' : '1px solid var(--gxn-line)',
                              opacity: isDim ? 0.52 : 1, transition: 'opacity .3s ease' }}>
                  <span style={{ fontSize: 30, fontWeight: 600, color: 'var(--gxn-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</span>
                  <MetricCell value={r.count} unit="笔" ratio={r.count / maxC} showBar={p.showCountBar}
                              color={isF ? 'var(--gxn-accent)' : 'var(--gxn-text)'} dim={isDim} />
                  {p.showAvg && (
                    <MetricCell value={r.avg} ratio={r.avg / maxA} showBar={p.showAvgBar}
                                color={isF ? 'var(--gxn-accent)' : 'var(--gxn-text)'} dim={isDim} />
                  )}
                </div>
              );
            })}
          </div>

          {/* total */}
          {p.showTotal && (
            <div className="gxn-rise-3" style={{ display: 'grid', gridTemplateColumns, alignItems: 'center', gap: 40, padding: '20px 28px 0', borderTop: '1px solid var(--gxn-line)', marginTop: 6 }}>
              <span className="gxn-mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--gxn-accent)', letterSpacing: '.06em' }}>{p.total.label}</span>
              <span className="gxn-num" style={{ fontSize: 40, fontWeight: 600, color: 'var(--gxn-accent)' }}>{p.total.count}<span style={{ fontSize: 24, marginLeft: 5, color: 'var(--gxn-dim)' }}>笔</span></span>
              {p.showAvg && <span className="gxn-num" style={{ fontSize: 40, fontWeight: 600, color: 'var(--gxn-accent)' }}>{p.total.avg}<span style={{ fontSize: 24, marginLeft: 5, color: 'var(--gxn-dim)' }}>亿/笔</span></span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideRoundTable;
