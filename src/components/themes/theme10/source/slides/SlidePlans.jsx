// SlidePlans.jsx — 方案对照 / editorial capability × tier comparison table.
// Rows are capabilities, columns are plan tiers; each tier header carries a name
// and a monumental price figure, and the recommended tier is rendered as a
// continuous full-height light panel band (no badge needed). Replaces the old
// rounded pricing-card row — this is a spec sheet, not SaaS cards.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.pl-`.
//
// ── Props (canonical list in SlidePlans.META.controls) ────────────────────────
//   columnCount    number 2..4   how many tier columns                       (3)
//   featureCount   number 3..6   how many capability rows                    (6)
//   highlightCol   boolean       render one tier as the light panel band     (true)
//   highlightIndex number 1..4   which tier is highlighted (1-based)         (2)
//   showPrice      boolean       the big price figure row                    (true)
//
// Content props (authored at call-site):
//   overline, title, features:[string], plans:[{ name, price, unit, caption, on:[bool] }]

import React from 'react';

function SlidePlans({
  overline = '方案对照 · PLANS', title = '选择适合你的自主程度',
  features = ['全球指数配置', '自主再平衡', '税务优化', '透明账本', '专属顾问', '跨市场对冲'],
  plans = [
    { name: '基石', price: '0.18', unit: '%/年', caption: '指数化打底，最低成本', on: [true, true, false, false, false, false] },
    { name: '自主', price: '0.34', unit: '%/年', caption: '完整的自主指数引擎', on: [true, true, true, true, false, false] },
    { name: '全包', price: '0.52', unit: '%/年', caption: '含跨市场对冲与顾问', on: [true, true, true, true, true, true] },
    { name: '机构', price: '议定', unit: '', caption: '面向法人与家族办公室', on: [true, true, true, true, true, true] },
  ],
  columnCount = 3, featureCount = 6, highlightCol = true, highlightIndex = 2, showPrice = true,
}) {
  React.useEffect(() => { plInjectStyle(); }, []);
  const n = Math.max(2, Math.min(plans.length, columnCount));
  const fn = Math.max(3, Math.min(features.length, featureCount));
  const cols = plans.slice(0, n);
  const rows = features.slice(0, fn);
  const hl = highlightCol ? Math.max(0, Math.min(n - 1, highlightIndex - 1)) : -1;

  return (
    <div className="pl-root">
      <div className="pl-head">
        <div className="pl-overline">{overline}</div>
        <h2 className="pl-title">{title}</h2>
      </div>

      <div className="pl-table" style={{ gridTemplateColumns: `1.5fr repeat(${n}, 1fr)`, gridTemplateRows: `auto repeat(${fn}, 1fr)` }}>
        {/* continuous gradient band behind the recommended column (absolute — no grid interference) */}
        {hl >= 0 && (
          <div className="pl-band" style={{ left: `${((1.5 + hl) / (1.5 + n)) * 100}%`, width: `${(1 / (1.5 + n)) * 100}%` }} />
        )}
        {/* header row */}
        <div className="pl-corner" />
        {cols.map((p, i) => (
          <div className={`pl-headcell ${i === hl ? 'is-hl is-hl-top' : ''}`} key={`h${i}`}>
            {i === hl && <span className="pl-rec">推荐</span>}
            <span className="pl-name">{p.name}</span>
            {showPrice && (
              <span className="pl-price"><span className="pl-fig">{p.price}</span><span className="pl-unit">{p.unit}</span></span>
            )}
            <span className="pl-caption">{p.caption}</span>
          </div>
        ))}

        {/* feature rows */}
        {rows.map((f, ri) => (
          <React.Fragment key={`r${ri}`}>
            <div className="pl-feat">{f}</div>
            {cols.map((p, ci) => {
              const on = !!(p.on && p.on[ri]);
              const isLast = ri === fn - 1;
              return (
                <div className={`pl-cell ${ci === hl ? 'is-hl' : ''} ${ci === hl && isLast ? 'is-hl-bottom' : ''}`} key={`c${ri}-${ci}`}>
                  <span className={`pl-mark ${on ? 'is-on' : 'is-off'}`}>{on ? '●' : '–'}</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function plInjectStyle() {
  if (document.getElementById('pl-style')) return;
  const s = document.createElement('style'); s.id = 'pl-style';
  s.textContent = `
  .pl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .pl-head{margin-bottom:36px;}
  .pl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .pl-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .pl-table{flex:1;display:grid;min-height:0;column-gap:0;row-gap:0;position:relative;}
  .pl-corner{}
  .pl-band{position:absolute;top:0;bottom:0;border-radius:18px;background:linear-gradient(165deg,#1b2540 0%,#283d72 56%,#3a5fc8 100%);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);z-index:0;}
  .pl-headcell,.pl-cell,.pl-feat{position:relative;z-index:1;}
  .pl-headcell{position:relative;display:flex;flex-direction:column;justify-content:flex-end;
    padding:26px 30px 30px;gap:6px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.2));}
  .pl-rec{position:absolute;top:24px;left:30px;font-family:var(--font-mono);font-size:20px;letter-spacing:.14em;
    padding:6px 14px;border-radius:999px;background:var(--ds-accent,#5479e8);color:#fff;}
  .pl-name{font-family:var(--font-mono);font-size:26px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--ds-muted,rgba(242,243,246,.62));}
  .pl-price{display:flex;align-items:baseline;gap:8px;margin-top:6px;}
  .pl-fig{font-size:78px;line-height:.9;font-weight:200;letter-spacing:-.02em;font-variant-numeric:tabular-nums;}
  .pl-unit{font-family:var(--font-mono);font-size:24px;color:var(--ds-faint,rgba(242,243,246,.5));white-space:nowrap;}
  .pl-caption{font-size:22px;line-height:1.45;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.6));margin-top:8px;text-wrap:pretty;}
  .pl-feat{display:flex;align-items:center;font-size:28px;font-weight:300;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.12));padding:0 4px;}
  .pl-cell{display:flex;align-items:center;justify-content:center;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .pl-mark{font-size:30px;line-height:1;font-family:var(--font-mono);}
  .pl-mark.is-on{color:var(--ds-accent,#5479e8);}
  .pl-mark.is-off{color:var(--ds-faint,rgba(242,243,246,.3));}
  /* recommended column: text + marks tuned for the gradient band */
  .pl-headcell.is-hl,.pl-cell.is-hl{color:#f6f1ea;
    border-top-color:rgba(246,241,234,.16);}
  .pl-headcell.is-hl{border-bottom-color:rgba(246,241,234,.24);padding-top:72px;}
  .pl-headcell.is-hl .pl-name{color:rgba(246,241,234,.82);}
  .pl-headcell.is-hl .pl-unit{color:rgba(246,241,234,.72);}
  .pl-headcell.is-hl .pl-caption{color:rgba(246,241,234,.82);}
  .pl-cell.is-hl .pl-mark.is-on{color:#fff;}
  .pl-cell.is-hl .pl-mark.is-off{color:rgba(246,241,234,.4);}
  `;
  document.head.appendChild(s);
}

SlidePlans.META = {
  id: 'plans', title: '方案对照',
  defaults: { columnCount: 3, featureCount: 6, highlightCol: true, highlightIndex: 2, showPrice: true },
  controls: [
    { key: 'columnCount', type: 'slider', label: '方案数量', default: 3, min: 2, max: 4, step: 1,
      description: '并列对照的方案 / 套餐列数。' },
    { key: 'featureCount', type: 'slider', label: '能力行数', default: 6, min: 3, max: 6, step: 1,
      description: '对照表中的能力 / 功能行数。' },
    { key: 'highlightCol', type: 'toggle', label: '高亮推荐', default: true,
      description: '将某一方案整列渲染为浅色面板带。' },
    { key: 'highlightIndex', type: 'slider', label: '高亮第几个', default: 2, min: 1, max: 4, step: 1,
      description: '需开启「高亮推荐」后生效。' },
    { key: 'showPrice', type: 'toggle', label: '价格数字', default: true,
      description: '表头中每个方案的大号费率 / 价格。' },
  ],
};

export { SlidePlans };
export const META = SlidePlans.META;
export default SlidePlans;
