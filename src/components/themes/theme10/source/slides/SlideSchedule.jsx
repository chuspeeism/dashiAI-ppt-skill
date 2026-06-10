// SlideSchedule.jsx — 条款明细 / a grouped fee & terms schedule table.
// A precise four-column ledger of line items (项目 · 说明 · 费率 · 备注) split by
// section dividers, with an optional emphasised row and a footing total. Distinct
// from SlideLedger (holdings + weight bars) and SlideMatrix (numeric grid): this
// is a document-style terms table. Standalone & migratable: depends only on
// React (imported). Token-driven. CSS scoped under `.sch-`.
//
// ── Props (canonical list in SlideSchedule.META.controls) ─────────────────────
//   rowCount    number 3..8   how many line items shown                   (6)
//   showNote    boolean       the right-hand 备注 column                   (true)
//   showGroup   boolean       section divider labels                      (true)
//   showTotal   boolean       the footing total row                       (true)
//   focus       boolean       emphasise one row, dim the rest             (false)
//   focusIndex  number 1..8   which row is emphasised (1-based)           (1)
//
// Content props (authored at call-site):
//   overline, title, columns{item,desc,rate,note}, totalLabel, totalValue,
//   rows:[{ group, item, desc, rate, note }]

import React from 'react';

function SlideSchedule({
  overline = '费用与条款 · SCHEDULE', title = '一张表，看清全部成本',
  columns = { item: '项目', desc: '说明', rate: '费率', note: '备注' },
  totalLabel = '综合年化成本', totalValue = '0.62%',
  rows = [
    { group: '持有成本', item: '管理费', desc: '按日计提 · 按年结算', rate: '0.30%', note: '行业中位 0.8%' },
    { group: '持有成本', item: '托管费', desc: '第三方银行独立托管', rate: '0.05%', note: '资产隔离' },
    { group: '交易成本', item: '再平衡佣金', desc: '季度调仓产生', rate: '0.12%', note: '低换手设计' },
    { group: '交易成本', item: '指数授权', desc: '底层指数使用费', rate: '0.08%', note: '已含在内' },
    { group: '业绩相关', item: '业绩报酬', desc: '超额收益的 10%', rate: '计提制', note: '高水位线' },
    { group: '业绩相关', item: '赎回费', desc: '持有满 1 年免收', rate: '0.00%', note: '鼓励长期' },
    { group: '其它', item: '账户服务', desc: '开户与年检', rate: '免费', note: '—' },
    { group: '其它', item: '增值咨询', desc: '可选 · 按需', rate: '面议', note: '非必选' },
  ],
  rowCount = 6, showNote = true, showGroup = true, showTotal = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { schInjectStyle(); }, []);
  const n = Math.max(3, Math.min(rows.length, rowCount));
  const used = rows.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const rp = n >= 8 ? 6 : n >= 6 ? 9 : 13;
  const gp = n >= 6 ? 9 : 14;
  const itemFs = n >= 8 ? 28 : 32;
  const descFs = n >= 8 ? 24 : 27;

  // build display list with group dividers inserted when group changes
  let lastGroup = null;

  return (
    <div className="sch-root">
      <div className="sch-head">
        <div className="sch-overline">{overline}</div>
        <h2 className="sch-title">{title}</h2>
      </div>

      <div className="sch-table" style={{ ['--sch-rp']: `${rp}px`, ['--sch-gp']: `${gp}px`, ['--sch-item']: `${itemFs}px`, ['--sch-desc']: `${descFs}px` }}>
        <div className={`sch-thead ${showNote ? '' : 'no-note'}`}>
          <span className="sch-th sch-col-idx">#</span>
          <span className="sch-th">{columns.item}</span>
          <span className="sch-th">{columns.desc}</span>
          <span className="sch-th sch-col-rate">{columns.rate}</span>
          {showNote && <span className="sch-th sch-col-note">{columns.note}</span>}
        </div>

        <div className="sch-body">
          {used.map((r, i) => {
            const hot = i === fIdx, dim = fIdx >= 0 && !hot;
            const newGroup = showGroup && r.group && r.group !== lastGroup;
            lastGroup = r.group;
            return (
              <React.Fragment key={i}>
                {newGroup && <div className="sch-group">{r.group}</div>}
                <div className={`sch-row ${showNote ? '' : 'no-note'} ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`}>
                  <span className="sch-idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sch-item">{r.item}</span>
                  <span className="sch-desc">{r.desc}</span>
                  <span className="sch-rate">{r.rate}</span>
                  {showNote && <span className="sch-note">{r.note}</span>}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {showTotal && (
          <div className={`sch-total ${showNote ? '' : 'no-note'}`}>
            <span className="sch-idx" />
            <span className="sch-total-lab">{totalLabel}</span>
            <span />
            <span className="sch-total-val">{totalValue}</span>
            {showNote && <span />}
          </div>
        )}
      </div>
    </div>
  );
}

function schInjectStyle() {
  if (document.getElementById('sch-style')) return;
  const s = document.createElement('style'); s.id = 'sch-style';
  s.textContent = `
  .sch-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .sch-head{margin-bottom:34px;}
  .sch-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .sch-title{font-size:60px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .sch-table{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;}
  .sch-thead,.sch-row,.sch-total{display:grid;grid-template-columns:80px 1.1fr 2fr 1fr 1.3fr;align-items:center;
    column-gap:32px;padding:0 12px;}
  .sch-thead.no-note,.sch-row.no-note,.sch-total.no-note{grid-template-columns:80px 1.2fr 2.4fr 1fr;}
  .sch-thead{padding-bottom:14px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.18));}
  .sch-th{font-family:var(--font-mono);font-size:23px;letter-spacing:.1em;color:var(--ds-faint,rgba(242,243,246,.44));text-transform:uppercase;}
  .sch-col-rate,.sch-th.sch-col-rate{text-align:right;}
  .sch-body{flex:0 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:flex-start;}
  .sch-body > .sch-group:first-child{padding-top:6px;}
  .sch-group{font-family:var(--font-mono);font-size:21px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--ds-accent,#5479e8);padding:var(--sch-gp,22px) 12px 8px;}
  .sch-row{padding-top:var(--sch-rp,18px);padding-bottom:var(--sch-rp,18px);border-bottom:1px solid var(--ds-line,rgba(242,243,246,.09));
    transition:opacity .25s ease,background .2s ease;}
  .sch-body > .sch-row:last-child{border-bottom:0;}
  .sch-row.is-dim{opacity:.36;}
  .sch-row.is-focus{background:var(--ds-card,rgba(255,255,255,.05));border-radius:10px;
    box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#5479e8) 40%,transparent);}
  .sch-idx{font-family:var(--font-mono);font-size:24px;color:var(--ds-faint,rgba(242,243,246,.4));font-variant-numeric:tabular-nums;}
  .sch-item{font-size:var(--sch-item,32px);font-weight:400;}
  .sch-desc{font-size:var(--sch-desc,27px);font-weight:300;color:var(--ds-muted,rgba(242,243,246,.7));}
  .sch-rate{font-family:var(--font-mono);font-size:var(--sch-item,32px);font-variant-numeric:tabular-nums;text-align:right;letter-spacing:.01em;}
  .sch-row.is-focus .sch-rate{color:var(--ds-accent,#5479e8);}
  .sch-note{font-family:var(--font-mono);font-size:23px;color:var(--ds-faint,rgba(242,243,246,.5));}
  .sch-total{margin-top:10px;padding-top:12px;border-top:2px solid var(--ds-line,rgba(242,243,246,.24));}
  .sch-total-lab{font-size:30px;font-weight:400;grid-column:2 / span 1;}
  .sch-total-val{font-family:var(--font-mono);font-size:46px;font-weight:300;text-align:right;color:var(--ds-accent,#5479e8);font-variant-numeric:tabular-nums;}
  `;
  document.head.appendChild(s);
}

SlideSchedule.META = {
  id: 'schedule', title: '条款明细',
  defaults: { rowCount: 6, showNote: true, showGroup: true, showTotal: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'rowCount', type: 'slider', label: '条目数量', default: 6, min: 3, max: 8, step: 1,
      description: '表格中的明细行数。' },
    { key: 'showNote', type: 'toggle', label: '备注列', default: true,
      description: '最右侧的备注说明列。' },
    { key: 'showGroup', type: 'toggle', label: '分组标题', default: true,
      description: '按类别插入的分组分隔标题。' },
    { key: 'showTotal', type: 'toggle', label: '合计行', default: true,
      description: '表尾的综合合计行。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideSchedule };
export const META = SlideSchedule.META;
export default SlideSchedule;
