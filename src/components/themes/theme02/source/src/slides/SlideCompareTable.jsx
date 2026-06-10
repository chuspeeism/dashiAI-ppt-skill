/**
 * SlideCompareTable.jsx — 特性对照表（表格页 · ✓/✗ 矩阵）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 能力对照矩阵：行 = 能力维度，列 = 公司，单元格 = 支持(✓)/部分(◐)/不支持(✕)。
 * 与数据表（榜单/轮次）互补，专做“谁支持什么”的横向对照。纯 props。
 *
 * ── Props (see slideCompareTableDefaults) ───────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   cols         string[]   列（公司）名称
 *   rows         Array<{label, cells:('yes'|'partial'|'no')[]}>   行（能力）+ 各列取值
 *   rowCount     number   展示的行数（3–n）
 *   colCount     number   展示的列数（2–n）
 *   focusEnabled boolean  高亮某一列
 *   focusCol     number   0-based 被强调列
 *   showLegend   boolean  图例（✓/◐/✕ 释义）显隐
 *   showRowNote  boolean  行首序号显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideCompareTableDefaults = {
  kicker: 'MATRIX · 能力对照',
  title: '谁支持什么 ',
  titleEm: '一表看清',
  lead: '把头部玩家放进同一张能力清单——优势与缺口，落在每一个勾叉里。',
  cols: ['OpenAI', 'Anthropic', 'Mistral', 'xAI'],
  rows: [
    { label: '自研基础大模型', cells: ['yes', 'yes', 'yes', 'yes'] },
    { label: '商用 API / 开放平台', cells: ['yes', 'yes', 'yes', 'partial'] },
    { label: '开源模型权重', cells: ['no', 'no', 'yes', 'partial'] },
    { label: '企业级私有化部署', cells: ['yes', 'yes', 'partial', 'no'] },
    { label: '原生多模态', cells: ['yes', 'partial', 'partial', 'yes'] },
    { label: '公开安全对齐承诺', cells: ['partial', 'yes', 'partial', 'no'] },
  ],
  rowCount: 6,
  colCount: 4,
  focusEnabled: true,
  focusCol: 0,
  showLegend: true,
  showRowNote: true,
};

export const slideCompareTableControls = [
  { key: 'rowCount', type: 'number', label: '行数（能力）', default: 6, min: 3, step: 1,
    maxFrom: (p) => (p.rows ? p.rows.length : 6), describe: '展示的能力维度行数' },
  { key: 'colCount', type: 'number', label: '列数（公司）', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.cols ? p.cols.length : 4), describe: '展示的公司列数' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一列' },
  { key: 'focusCol', type: 'number', label: '强调列', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.colCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调公司列的序号' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true,
    describe: '✓/◐/✕ 释义图例显隐' },
  { key: 'showRowNote', type: 'toggle', label: '行序号', default: true,
    describe: '行首序号显隐' },
];

const MARK = {
  yes: { glyph: '✓', color: 'var(--gxn-accent)', label: '支持', shadow: '0 0 16px rgba(var(--gxn-glow),0.6)' },
  partial: { glyph: '◐', color: 'var(--gxn-accent-cool)', label: '部分', shadow: 'none' },
  no: { glyph: '✕', color: 'var(--gxn-faint)', label: '不支持', shadow: 'none' },
};

function Cell({ v, isFocusCol }) {
  const m = MARK[v] || MARK.no;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 52, height: 52, borderRadius: '50%', fontSize: 30, fontWeight: 700,
        color: m.color, textShadow: m.shadow,
        border: v === 'no' ? '1px solid var(--gxn-line)' : `1px solid ${m.color}`,
        background: v === 'yes' ? 'rgba(var(--gxn-glow),0.10)' : 'rgba(255,255,255,0.02)',
        opacity: isFocusCol || v !== 'no' ? 1 : 0.7 }}>{m.glyph}</span>
    </div>
  );
}

export function SlideCompareTable(props) {
  const p = { ...slideCompareTableDefaults, ...props };
  const colCount = Math.max(2, Math.min(p.cols.length, p.colCount));
  const rowCount = Math.max(3, Math.min(p.rows.length, p.rowCount));
  const cols = p.cols.slice(0, colCount);
  const rows = p.rows.slice(0, rowCount);
  const fCol = p.focusEnabled ? Math.max(0, Math.min(colCount - 1, p.focusCol)) : -1;
  const gridCols = `minmax(360px, 1.5fr) repeat(${colCount}, 1fr)`;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "23 / 31"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: gridCols,
            gridAutoRows: '1fr', alignItems: 'stretch' }}>
            {/* header row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', padding: '0 8px 18px' }}>
              <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>能力 ╲ 公司</span>
            </div>
            {cols.map((c, ci) => {
              const isF = ci === fCol;
              return (
                <div key={ci} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  padding: '0 8px 18px', borderTopLeftRadius: 16, borderTopRightRadius: 16,
                  background: isF ? 'rgba(var(--gxn-glow),0.08)' : 'transparent' }}>
                  <span style={{ fontSize: 32, fontWeight: 700, textAlign: 'center',
                    color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                    textShadow: isF ? '0 0 22px rgba(var(--gxn-glow),0.5)' : 'none' }}>{c}</span>
                </div>
              );
            })}

            {/* body rows */}
            {rows.map((r, ri) => (
              <React.Fragment key={ri}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 8px',
                  borderTop: '1px solid var(--gxn-line)' }}>
                  {p.showRowNote && (
                    <span className="gxn-num" style={{ fontSize: 26, color: 'var(--gxn-faint)', flex: '0 0 auto', width: 40 }}>
                      {String(ri + 1).padStart(2, '0')}
                    </span>
                  )}
                  <span style={{ fontSize: 28, fontWeight: 500, color: 'var(--gxn-text)' }}>{r.label}</span>
                </div>
                {cols.map((_, ci) => {
                  const isF = ci === fCol;
                  const isLast = ri === rows.length - 1;
                  return (
                    <div key={ci} style={{ borderTop: '1px solid var(--gxn-line)',
                      background: isF ? 'rgba(var(--gxn-glow),0.08)' : 'transparent',
                      borderBottomLeftRadius: isLast ? 16 : 0, borderBottomRightRadius: isLast ? 16 : 0 }}>
                      <Cell v={r.cells[ci]} isFocusCol={isF} />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {p.showLegend && (
            <div className="gxn-rise-3" style={{ display: 'flex', gap: 36, marginTop: 22, alignItems: 'center' }}>
              {['yes', 'partial', 'no'].map((k) => {
                const m = MARK[k];
                return (
                  <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: '50%', fontSize: 22, fontWeight: 700,
                      color: m.color, border: `1px solid ${k === 'no' ? 'var(--gxn-line)' : m.color}` }}>{m.glyph}</span>
                    <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>{m.label}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideCompareTable;
