/**
 * SlideDataTable.jsx — 头部公司明细（表格页 · 数据明细表）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 规整的明细表：磨砂表头 + 数据行，可强调某一行（辉光描边）或某一列（accent
 * 着色），支持斑马纹、序号列与列对齐。表格内联渲染，仅依赖 props。
 *
 * ── Props (see slideDataTableDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   columns      Array<{key,label,align?,unit?}>   列定义（align: 'left'|'right'）
 *   rows         Array<{ [key]: value }>           行数据
 *   rowCount     number   展示的行数（3–n）
 *   showRank     boolean  序号列显隐
 *   zebra        boolean  斑马纹底色
 *   focusEnabled boolean  辉光强调某一行
 *   focusIndex   number   0-based 被强调行
 *   highlightCol number   accent 着色的列序号（-1 = 不着色）
 *   gxnScheme    object?  { accent, glow } 调色（缺省走主题绿）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideDataTableDefaults = {
  kicker: 'LEAGUE TABLE · 头部公司明细',
  title: '十亿美元俱乐部的 ',
  titleEm: '入场名单',
  lead: '2024 年单笔或累计跨过十亿美元门槛的美国 AI 公司——融资额、最新估值与领投方一览。',
  columns: [
    { key: 'company', label: '公司', align: 'left' },
    { key: 'sector', label: '赛道', align: 'left' },
    { key: 'round', label: '轮次', align: 'left' },
    { key: 'raise', label: '融资额', align: 'right', unit: '亿$' },
    { key: 'valuation', label: '估值', align: 'right', unit: '亿$' },
    { key: 'lead', label: '领投方', align: 'left' },
  ],
  rows: [
    { company: 'OpenAI', sector: '通用大模型', round: '后期', raise: '66', valuation: '1570', lead: 'Thrive Capital' },
    { company: 'xAI', sector: '通用大模型', round: 'B/C', raise: '120', valuation: '500', lead: 'Sequoia 等' },
    { company: 'Anthropic', sector: '安全对齐', round: '战略', raise: '40', valuation: '180', lead: 'Amazon' },
    { company: 'Databricks', sector: '数据平台', round: 'J 轮', raise: '100', valuation: '620', lead: 'Thrive Capital' },
    { company: 'Waymo', sector: '自动驾驶', round: '战略', raise: '56', valuation: '450', lead: 'Alphabet' },
    { company: 'CoreWeave', sector: '算力云', round: '债+股', raise: '110', valuation: '190', lead: 'Blackstone' },
  ],
  rowCount: 6,
  showRank: true,
  zebra: true,
  focusEnabled: true,
  focusIndex: 0,
  highlightCol: 3,
};

export const slideDataTableControls = [
  { key: 'rowCount', type: 'number', label: '行数', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.rows ? p.rows.length : 6), describe: '展示的数据行数量' },
  { key: 'showRank', type: 'toggle', label: '序号列', default: true,
    describe: '左侧排名序号列显隐' },
  { key: 'zebra', type: 'toggle', label: '斑马纹', default: true,
    describe: '隔行底色显隐' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否辉光强调某一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.rowCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号' },
  { key: 'highlightCol', type: 'number', label: '强调列', default: 3, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.columns ? p.columns.length : 1) - 1),
    describe: 'accent 着色的列序号（用于突出关键指标列）' },
];

export function SlideDataTable(props) {
  const p = { ...slideDataTableDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';

  const count = Math.max(3, Math.min(p.rows.length, p.rowCount));
  const rows = p.rows.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const cols = p.columns;
  const hCol = p.highlightCol;

  const gridCols = [
    p.showRank ? '78px' : null,
    ...cols.map((c, i) => (i === 0 ? '1.5fr' : c.align === 'right' ? '0.85fr' : '1fr')),
  ].filter(Boolean).join(' ');

  const cellPad = '0 14px';

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "38 / 39"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1280 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 34, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* header row */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center',
                        padding: '0 14px 16px', borderBottom: '1px solid rgba(var(--gxn-glow),0.32)' }}>
            {p.showRank && (
              <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)', letterSpacing: '.1em' }}>#</span>
            )}
            {cols.map((c, ci) => (
              <span key={c.key} className="gxn-mono"
                    style={{ padding: cellPad, fontSize: 23, letterSpacing: '.08em', textTransform: 'uppercase',
                             textAlign: c.align === 'right' ? 'right' : 'left',
                             color: ci === hCol ? accent : 'var(--gxn-dim)',
                             textShadow: ci === hCol ? '0 0 16px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                {c.label}{c.unit ? ` · ${c.unit}` : ''}
              </span>
            ))}
          </div>

          {/* body rows */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', gap: 0 }}>
            {rows.map((row, ri) => {
              const isF = ri === fIdx;
              const dim = fIdx >= 0 && !isF;
              return (
                <div key={ri}
                     className={cx(isF && 'gxn-panel is-focus')}
                     style={{ display: 'grid', gridTemplateColumns: gridCols, alignItems: 'center',
                              padding: isF ? '4px 14px' : '0 14px', borderRadius: isF ? 16 : 0,
                              minHeight: 0,
                              background: !isF && p.zebra && ri % 2 === 1 ? 'rgba(255,255,255,0.028)' : 'transparent',
                              borderBottom: !isF ? '1px solid var(--gxn-line)' : 'none',
                              opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease',
                              transform: isF ? 'scale(1.012)' : 'none' }}>
                  {p.showRank && (
                    <span className="gxn-num" style={{ fontSize: 30, fontWeight: 600, lineHeight: 1,
                      padding: '18px 0', color: isF ? accent : 'var(--gxn-faint)',
                      textShadow: isF ? '0 0 18px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                      {String(ri + 1).padStart(2, '0')}
                    </span>
                  )}
                  {cols.map((c, ci) => {
                    const val = row[c.key];
                    const isNum = c.align === 'right';
                    const isHl = ci === hCol;
                    const isName = ci === 0;
                    return (
                      <span key={c.key}
                            className={isNum ? 'gxn-num' : undefined}
                            style={{ padding: `18px ${isNum ? 14 : 14}px`, fontSize: isName ? 30 : isNum ? 31 : 26,
                                     fontWeight: isName ? 700 : isNum ? 600 : 400,
                                     textAlign: isNum ? 'right' : 'left',
                                     whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                     color: isHl ? accent : isName ? 'var(--gxn-text)' : 'var(--gxn-dim)',
                                     textShadow: isHl ? '0 0 18px rgba(var(--gxn-glow),0.45)' : 'none',
                                     fontVariantNumeric: isNum ? 'tabular-nums' : 'normal' }}>
                        {val}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideDataTable;
