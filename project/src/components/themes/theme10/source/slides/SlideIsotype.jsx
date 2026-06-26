// SlideIsotype.jsx — 象形占比 / pictograph unit chart.
// A 10×10 grid of unit cells (=100) filled category-by-category, so proportions
// read as countable area rather than an abstract arc. Distinct from SlideDonut
// (arc segments), SlideBarData (bars) and SlideTreemap (nested rects). Standalone
// & migratable: depends only on React (imported). Token-driven, so the universal
// light/dark tone applies. All variation via props; copy authored in markup.
// CSS scoped `.iso-`.
//
// ── Props (canonical list in SlideIsotype.META.controls) ──────────────────────
//   catCount     number 2..4   how many categories fill the grid          (3)
//   showLegend   boolean       the side legend with name + percent        (true)
//   showValues   boolean       percent figures inside the legend          (true)
//   focus        boolean       emphasise one category, dim the rest       (false)
//   focusIndex   number 1..4   which category is emphasised (1-based)      (1)
//
// Content props (authored at call-site):
//   overline, title, lead, cats: [{ name, value, note }]  (value = % of 100)

import React from 'react';

function SlideIsotype({
  overline = '资产象形 · WHERE THE MONEY SITS',
  title = '一百份资金的去向',
  lead = '把组合拆成一百个等额单元，每一格代表 1% 的本金——配置一目了然，不靠百分号也能数清。',
  cats = [
    { name: '增长型权益', value: 46, note: '全球核心 + 卫星' },
    { name: '稳健固收', value: 28, note: '利率债 + 信用债' },
    { name: '另类对冲', value: 18, note: '低相关 + 危机阿尔法' },
    { name: '灵活现金', value: 8, note: '机会储备金' },
  ],
  catCount = 3, showLegend = true, showValues = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { isoInjectStyle(); }, []);
  const n = Math.max(2, Math.min(cats.length, catCount));
  // Re-normalise the visible categories to exactly 100 cells.
  const used = cats.slice(0, n);
  const sum = used.reduce((a, c) => a + c.value, 0) || 1;
  const cells = used.map((c) => Math.round((c.value / sum) * 100));
  let drift = 100 - cells.reduce((a, b) => a + b, 0);
  for (let i = 0; drift !== 0; i = (i + 1) % n) { cells[i] += Math.sign(drift); drift -= Math.sign(drift); }
  // Map each of the 100 cells → category index.
  const owner = [];
  cells.forEach((cnt, ci) => { for (let k = 0; k < cnt; k++) owner.push(ci); });
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const TONE = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c6)'];
  const OPA = [1, 1, 1, 1];

  return (
    <div className="iso-root">
      <div className="iso-head">
        <div className="iso-overline">{overline}</div>
        <h2 className="iso-title">{title}</h2>
      </div>

      <div className={`iso-body ${showLegend ? '' : 'iso-body-solo'}`}>
        <div className="iso-gridwrap">
          <div className="iso-grid">
            {owner.map((ci, i) => {
              const hot = fIdx < 0 || fIdx === ci;
              return (
                <span className="iso-cell" key={i}
                      style={{ background: `linear-gradient(150deg, color-mix(in srgb, ${TONE[ci]} 55%, #fff), ${TONE[ci]})`, opacity: hot ? OPA[ci] : 0.12 }} />
              );
            })}
          </div>
          <div className="iso-gridcap">100 个单元 · 每格 = 1% 本金</div>
        </div>

        {showLegend && (
          <div className="iso-legend">
            <p className="iso-lead">{lead}</p>
            <div className="iso-rows">
              {used.map((c, i) => {
                const hot = fIdx < 0 || fIdx === i;
                return (
                  <div className={`iso-lrow ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}>
                    <span className="iso-sw" style={{ background: TONE[i], opacity: OPA[i] }} />
                    <span className="iso-lname">{c.name}</span>
                    <span className="iso-lnote">{c.note}</span>
                    {showValues && <span className="iso-lval">{cells[i]}<span className="iso-pct">%</span></span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function isoInjectStyle() {
  if (document.getElementById('iso-style')) return;
  const s = document.createElement('style'); s.id = 'iso-style';
  s.textContent = `
  .iso-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .iso-head{margin-bottom:48px;}
  .iso-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .iso-title{font-size:68px;font-weight:300;margin:18px 0 0;line-height:1.08;}
  .iso-body{flex:1;min-height:0;display:grid;grid-template-columns:auto 1fr;gap:96px;align-items:center;}
  .iso-body-solo{grid-template-columns:1fr;justify-items:center;}
  .iso-body-solo .iso-gridwrap{align-items:center;}
  .iso-gridwrap{display:flex;flex-direction:column;gap:24px;}
  .iso-grid{display:grid;grid-template-columns:repeat(10,46px);grid-auto-rows:46px;gap:10px;}
  .iso-cell{display:block;width:46px;height:46px;border-radius:7px;transition:opacity .35s ease;}
  .iso-gridcap{font-family:var(--font-mono);font-size:22px;letter-spacing:.08em;color:var(--ds-faint,rgba(242,243,246,.4));}
  .iso-legend{min-width:0;display:flex;flex-direction:column;gap:40px;}
  .iso-lead{font-size:30px;font-weight:300;line-height:1.5;color:var(--ds-muted,rgba(242,243,246,.66));margin:0;max-width:620px;text-wrap:pretty;}
  .iso-rows{display:flex;flex-direction:column;gap:26px;}
  .iso-lrow{display:grid;grid-template-columns:26px 1fr auto auto;align-items:baseline;gap:24px;
    padding-bottom:24px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));transition:opacity .25s ease;}
  .iso-lrow:last-child{border-bottom:0;}
  .iso-lrow.is-dim{opacity:.4;}
  .iso-sw{width:26px;height:26px;border-radius:6px;align-self:center;}
  .iso-lname{font-size:34px;font-weight:300;}
  .iso-lnote{font-family:var(--font-mono);font-size:23px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .iso-lval{font-family:var(--font-mono);font-size:48px;font-weight:300;font-variant-numeric:tabular-nums;text-align:right;}
  .iso-pct{font-size:26px;margin-left:3px;color:var(--ds-muted,rgba(242,243,246,.6));}
  `;
  document.head.appendChild(s);
}

SlideIsotype.META = {
  id: 'isotype', title: '象形占比',
  defaults: { catCount: 3, showLegend: true, showValues: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'catCount', type: 'slider', label: '类别数量', default: 3, min: 2, max: 4, step: 1,
      description: '填充百格网格的类别数。各类别占比按比例重新归一到 100 格。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右侧的类别名称 + 说明图例。' },
    { key: 'showValues', type: 'toggle', label: '百分数', default: true,
      description: '图例中的百分比数字。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一类别，其余格子弱化为底纹。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 4, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的类别。' },
  ],
};

export { SlideIsotype };
export const META = SlideIsotype.META;
export default SlideIsotype;
