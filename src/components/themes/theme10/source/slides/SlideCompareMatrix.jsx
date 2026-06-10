// SlideCompareMatrix.jsx — 能力对照 / capability ✓·✕ matrix.
// Rows of capabilities scored across a few approaches, one column emphasised as
// "ours". Marks are yes / partial / no. Distinct from SlidePlans (pricing tiers)
// and SlideVersus (binary diagonal): this is a multi-column feature grid.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.cm-`.
//
// ── Props (canonical list in SlideCompareMatrix.META.controls) ────────────────
//   rowCount       number 3..7   how many capability rows                  (5)
//   colCount       number 2..4   how many approach columns                 (3)
//   highlightIndex number 1..4   which column is emphasised (1-based)      (3)
//   showHeadNote   boolean       the sub-label under each column head      (true)
//   zebra          boolean       alternating row shading                   (true)
//
// Content props (authored at call-site):
//   overline, title,
//   columns:[{ name, note }],
//   rows:[{ label, cells:['yes'|'partial'|'no', ...] }]

import React from 'react';

function SlideCompareMatrix({
  overline = '能力对照 · HOW WE COMPARE', title = '同一张表，三种活法',
  columns = [
    { name: '自己打理', note: 'DIY' },
    { name: '传统投顾', note: '人工 · 高费率' },
    { name: '自主指数', note: '规则 · 自动' },
  ],
  rows = [
    { label: '自动再平衡', cells: ['no', 'partial', 'yes'] },
    { label: '情绪不干预', cells: ['no', 'partial', 'yes'] },
    { label: '成本透明可见', cells: ['partial', 'no', 'yes'] },
    { label: '税务优化', cells: ['no', 'partial', 'yes'] },
    { label: '7×24 监测', cells: ['no', 'no', 'yes'] },
    { label: '一键调整目标', cells: ['partial', 'partial', 'yes'] },
    { label: '可随时赎回', cells: ['yes', 'partial', 'yes'] },
  ],
  rowCount = 5, colCount = 3, highlightIndex = 3, showHeadNote = true, zebra = true,
}) {
  React.useEffect(() => { cmInjectStyle(); }, []);
  const cn = Math.max(2, Math.min(columns.length, colCount));
  const rn = Math.max(3, Math.min(rows.length, rowCount));
  const cols = columns.slice(0, cn);
  const body = rows.slice(0, rn);
  const hi = Math.max(0, Math.min(cn - 1, highlightIndex - 1));
  const grid = `1.5fr repeat(${cn}, 1fr)`;
  const mark = (k) => k === 'yes' ? '✓' : k === 'partial' ? '◐' : '✕';

  return (
    <div className="cm-root">
      <div className="cm-head">
        <div className="cm-overline">{overline}</div>
        <h2 className="cm-title">{title}</h2>
      </div>

      <div className="cm-table">
        <div className="cm-band" style={{ left: `${((1.5 + hi) / (1.5 + cn)) * 100}%`, width: `${(1 / (1.5 + cn)) * 100}%` }} />
        <div className="cm-row cm-headrow" style={{ gridTemplateColumns: grid }}>
          <div className="cm-corner" />
          {cols.map((c, j) => (
            <div className={`cm-colhead ${j === hi ? 'is-hi' : ''}`} key={j}>
              <span className="cm-colname">{c.name}</span>
              {showHeadNote && <span className="cm-colnote">{c.note}</span>}
            </div>
          ))}
        </div>

        {body.map((r, i) => (
          <div className={`cm-row ${zebra && i % 2 ? 'is-zebra' : ''}`} key={i} style={{ gridTemplateColumns: grid }}>
            <div className="cm-rowlab">{r.label}</div>
            {cols.map((_, j) => {
              const k = (r.cells || [])[j] || 'no';
              return (
                <div className={`cm-cell ${j === hi ? 'is-hi' : ''} cm-${k}`} key={j}>
                  <span className="cm-mark">{mark(k)}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function cmInjectStyle() {
  if (document.getElementById('cm-style')) return;
  const s = document.createElement('style'); s.id = 'cm-style';
  s.textContent = `
  .cm-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .cm-head{margin-bottom:30px;}
  .cm-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cm-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .cm-table{flex:1;min-height:0;display:flex;flex-direction:column;position:relative;}
  .cm-band{position:absolute;top:0;bottom:0;border-radius:16px;background:linear-gradient(160deg,#15303f 0%,#1f5f6e 52%,#2f86a0 100%);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);z-index:0;}
  .cm-row{display:grid;align-items:stretch;position:relative;z-index:1;}
  .cm-headrow{margin-bottom:8px;}
  .cm-corner{}
  .cm-colhead{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px 12px 22px;text-align:center;}
  .cm-colname{font-size:30px;font-weight:300;}
  .cm-colhead.is-hi .cm-colname{color:#f6f1ea;}
  .cm-colnote{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;white-space:nowrap;color:var(--ds-faint,rgba(242,243,246,.5));}
  .cm-colhead.is-hi .cm-colnote{color:rgba(246,241,234,.74);}
  .cm-row:not(.cm-headrow){flex:1;border-top:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .cm-row:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .cm-row.is-zebra .cm-rowlab,.cm-row.is-zebra .cm-cell:not(.is-hi){background:color-mix(in srgb,var(--ds-ink,#f2f3f6) 3%,transparent);}
  .cm-rowlab{display:flex;align-items:center;font-size:30px;font-weight:300;padding:0 8px;}
  .cm-cell{display:flex;align-items:center;justify-content:center;}
  .cm-mark{font-size:34px;line-height:1;}
  .cm-yes .cm-mark{color:var(--ds-accent,#5479e8);}
  .cm-cell.is-hi .cm-mark{color:rgba(246,241,234,.5);}
  .cm-cell.is-hi.cm-yes .cm-mark{color:#fff;}
  .cm-cell.is-hi.cm-partial .cm-mark{color:rgba(246,241,234,.78);}
  .cm-partial .cm-mark{color:var(--ds-muted,rgba(242,243,246,.55));font-size:30px;}
  .cm-no .cm-mark{color:var(--ds-faint,rgba(242,243,246,.32));font-size:26px;}
  `;
  document.head.appendChild(s);
}

SlideCompareMatrix.META = {
  id: 'capmatrix', title: '能力对照',
  defaults: { rowCount: 5, colCount: 3, highlightIndex: 3, showHeadNote: true, zebra: true },
  controls: [
    { key: 'rowCount', type: 'slider', label: '能力行数', default: 5, min: 3, max: 7, step: 1,
      description: '对照的能力 / 特性行数。' },
    { key: 'colCount', type: 'slider', label: '方案列数', default: 3, min: 2, max: 4, step: 1,
      description: '参与对照的方案列数。' },
    { key: 'highlightIndex', type: 'slider', label: '强调第几列', default: 3, min: 1, max: 4, step: 1,
      description: '被高亮强调的方案列（上限随列数）。' },
    { key: 'showHeadNote', type: 'toggle', label: '列副标题', default: true,
      description: '每列表头下方的小字说明。' },
    { key: 'zebra', type: 'toggle', label: '斑马底纹', default: true,
      description: '隔行的浅色底纹。' },
  ],
};

export { SlideCompareMatrix };
export const META = SlideCompareMatrix.META;
export default SlideCompareMatrix;
