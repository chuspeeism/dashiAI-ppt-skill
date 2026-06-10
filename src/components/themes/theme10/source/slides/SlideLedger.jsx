// SlideLedger.jsx — financial ledger / holdings table.
// Standalone & migratable: depends only on React (imported) + DeckHead (optional;
// falls back to a local header). Token-driven, so the universal light/dark tone
// applies. All variation via props; copy authored in markup. CSS scoped `.ldg-`.
//
// ── Props (canonical list in SlideLedger.META.controls) ───────────────────────
//   rowCount       number 3..8    how many holding rows to show          (6)
//   showWeightBar  boolean        inline proportional weight bar          (true)
//   showTotal      boolean        the summary / totals footer row         (true)
//   focus          boolean        emphasise one row, dim the rest         (false)
//   focusIndex     number 1..8    which row is emphasised (1-based)       (1)
//
// Content props (authored at call-site):
//   overline, title, columns (header labels), rows: [{ name, code, weight, value, change, up }]

import React from 'react';

function SlideLedger({
  overline = '持仓明细 · AS OF TODAY', title = '组合里的每一笔',
  columns = ['持仓', '权重', '市值', '当日'],
  rows = [
    { name: '全球股票核心', code: 'EQ-CORE', weight: 38, value: '¥475,000', change: '+1.24%', up: true },
    { name: '低相关另类', code: 'ALT-SLV', weight: 24, value: '¥300,000', change: '+0.86%', up: true },
    { name: '固定收益', code: 'FI-AGG', weight: 16, value: '¥200,000', change: '+0.12%', up: true },
    { name: '对冲策略', code: 'HEDGE', weight: 9, value: '¥112,500', change: '-0.34%', up: false },
    { name: '危机阿尔法', code: 'TAIL', weight: 8, value: '¥100,000', change: '-0.08%', up: false },
    { name: '灵活现金', code: 'CASH', weight: 5, value: '¥62,500', change: '+0.01%', up: true },
    { name: '大宗商品', code: 'COMD', weight: 6, value: '¥75,000', change: '+0.42%', up: true },
    { name: '私募信贷', code: 'PVT-CR', weight: 4, value: '¥50,000', change: '+0.05%', up: true },
  ],
  total = { label: '合计', weight: '100%', value: '¥1,250,096', change: '+0.71%', up: true },
  rowCount = 6, showWeightBar = true, showTotal = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { ldgInjectStyle(); }, []);
  const n = Math.max(3, Math.min(rows.length, rowCount));
  const body = rows.slice(0, n);
  const maxW = Math.max(...body.map((r) => r.weight), 1);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="ldg-root">
      <div className="ldg-head">
        <div className="ldg-overline">{overline}</div>
        <h2 className="ldg-title">{title}</h2>
      </div>

      <div className="ldg-table">
        <div className="ldg-row ldg-colhead">
          <span className="ldg-c-name">{columns[0]}</span>
          <span className="ldg-c-weight">{columns[1]}</span>
          <span className="ldg-c-value">{columns[2]}</span>
          <span className="ldg-c-change">{columns[3]}</span>
        </div>

        <div className="ldg-body">
        {body.map((r, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          return (
            <div className={`ldg-row ldg-line ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <span className="ldg-c-name">
                <span className="ldg-name">{r.name}</span>
                <span className="ldg-code">{r.code}</span>
              </span>
              <span className="ldg-c-weight">
                {showWeightBar && (
                  <span className="ldg-bar"><span className="ldg-bar-fill" style={{ width: `${(r.weight / maxW) * 100}%` }} /></span>
                )}
                <span className="ldg-wpct">{r.weight}%</span>
              </span>
              <span className="ldg-c-value">{r.value}</span>
              <span className={`ldg-c-change ${r.up ? 'is-up' : 'is-down'}`}>
                <span className="ldg-arrow">{r.up ? '▲' : '▼'}</span>{r.change}
              </span>
            </div>
          );
        })}
        </div>

        {showTotal && (
          <div className="ldg-row ldg-total">
            <span className="ldg-c-name">{total.label}</span>
            <span className="ldg-c-weight"><span className="ldg-wpct">{total.weight}</span></span>
            <span className="ldg-c-value">{total.value}</span>
            <span className={`ldg-c-change ${total.up ? 'is-up' : 'is-down'}`}>
              <span className="ldg-arrow">{total.up ? '▲' : '▼'}</span>{total.change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ldgInjectStyle() {
  if (document.getElementById('ldg-style')) return;
  const s = document.createElement('style'); s.id = 'ldg-style';
  s.textContent = `
  .ldg-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .ldg-head{margin-bottom:44px;}
  .ldg-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ldg-title{font-size:68px;font-weight:300;margin:18px 0 0;line-height:1.08;}
  .ldg-table{flex:1;display:flex;flex-direction:column;min-height:0;}
  .ldg-body{flex:1;display:flex;flex-direction:column;min-height:0;}
  .ldg-row{display:grid;grid-template-columns:1fr 360px 260px 220px;align-items:center;gap:40px;}
  .ldg-colhead{flex:0 0 auto;padding-bottom:24px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.16));}
  .ldg-colhead span{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--ds-faint,rgba(242,243,246,.42));}
  .ldg-line{flex:1;min-height:0;padding:12px 18px 12px 18px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.1));transition:opacity .25s,background .25s;border-radius:12px;}
  .ldg-body .ldg-line:last-child{border-bottom-color:transparent;}
  .ldg-c-name{display:flex;align-items:baseline;gap:18px;min-width:0;}
  .ldg-name{font-size:33px;font-weight:300;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ldg-code{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;color:var(--ds-faint,rgba(242,243,246,.4));white-space:nowrap;}
  .ldg-c-weight{display:flex;align-items:center;gap:22px;}
  .ldg-bar{flex:1;height:10px;border-radius:5px;background:rgba(128,128,128,.22);overflow:hidden;}
  .ldg-bar-fill{display:block;height:100%;border-radius:5px;background:linear-gradient(90deg,var(--ds-accent-2,#8fa8e6),var(--ds-accent,#5479e8));opacity:.85;
    transition:width .4s cubic-bezier(.3,.7,.4,1);}
  .ldg-wpct{font-family:var(--font-mono);font-size:30px;font-variant-numeric:tabular-nums;color:var(--ds-muted,rgba(242,243,246,.7));min-width:78px;text-align:right;}
  .ldg-c-value{font-family:var(--font-mono);font-size:32px;font-variant-numeric:tabular-nums;text-align:right;}
  .ldg-c-change{font-family:var(--font-mono);font-size:28px;font-variant-numeric:tabular-nums;text-align:right;
    display:inline-flex;align-items:baseline;justify-content:flex-end;gap:10px;}
  .ldg-c-change.is-up{color:var(--ds-accent,#6f9bd8);}
  .ldg-c-change.is-down{color:var(--ds-faint,rgba(242,243,246,.5));}
  .ldg-arrow{font-size:24px;}
  .ldg-line.is-dim{opacity:.62;}
  .ldg-line.is-focus{position:relative;background:var(--ds-grad-soft,linear-gradient(110deg,rgba(51,64,92,.34),rgba(200,150,107,.32)));
    box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#5479e8) 38%,transparent);
    border-radius:14px;border-bottom-color:transparent;}
  .ldg-line.is-focus::before{content:'';position:absolute;left:0;top:14%;bottom:14%;width:4px;border-radius:4px;
    background:linear-gradient(180deg,var(--ds-accent-2,#8fa8e6),var(--ds-accent,#5479e8));}
  .ldg-line.is-focus .ldg-name{font-weight:400;}
  .ldg-line.is-focus .ldg-wpct,.ldg-line.is-focus .ldg-c-value{color:var(--ds-ink,#f2f3f6);}
  .ldg-total{flex:0 0 auto;margin-top:14px;padding-top:30px;border-top:1.5px solid var(--ds-line,rgba(242,243,246,.3));}
  .ldg-total .ldg-c-name{font-size:30px;font-family:var(--font-mono);letter-spacing:.1em;color:var(--ds-muted,rgba(242,243,246,.62));}
  .ldg-total .ldg-c-value{font-size:36px;}
  `;
  document.head.appendChild(s);
}

SlideLedger.META = {
  id: 'ledger', title: '账本表',
  defaults: { rowCount: 6, showWeightBar: true, showTotal: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'rowCount', type: 'slider', label: '持仓行数', default: 6, min: 3, max: 8, step: 1,
      description: '表格中显示的持仓行数。' },
    { key: 'showWeightBar', type: 'toggle', label: '权重条', default: true,
      description: '权重列内联的占比可视化条。' },
    { key: 'showTotal', type: 'toggle', label: '合计行', default: true,
      description: '底部的汇总 / 合计行。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的行。' },
  ],
};

export { SlideLedger };
export const META = SlideLedger.META;
export default SlideLedger;
