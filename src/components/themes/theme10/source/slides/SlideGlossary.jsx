// SlideGlossary.jsx — 名词释义 / a term–definition reference list.
// Each entry pairs a mono term (with an index or initial) against a plain-language
// definition; entries flow down one or two columns with a hairline divider. Built
// for a glossary / 名词解释 page in a report appendix. Distinct from SlideFAQ (a
// question→answer accordion feel) and SlideSchedule (a 条款 line-item table with
// values). Standalone & migratable: depends only on React (imported). Token-driven,
// light/dark tone applies. CSS scoped `.gls-`.
//
// ── Props (canonical list in SlideGlossary.META.controls) ─────────────────────
//   itemCount  number 4..8   how many terms shown                          (6)
//   columns    number 1..2   one long list or two columns                  (2)
//   showIndex  boolean       the 01.. counter beside each term             (true)
//   focus      boolean       emphasise one term, dim the rest              (false)
//   focusIndex number 1..8   which term is emphasised (1-based)            (1)
//
// Content props (authored at call-site):
//   overline, title, terms:[{ term, en, def }]

import React from 'react';

function SlideGlossary({
  overline = '名词释义 · SPEAK THE SAME LANGUAGE',
  title = '读懂这份报告的八个词',
  terms = [
    { term: '自主指数', en: 'Self-Directed Index', def: '由规则而非个人判断驱动、可解释可复制的组合编制方法。' },
    { term: '夏普比率', en: 'Sharpe Ratio', def: '每承担一单位波动所换得的超额回报，衡量风险调整后的性价比。' },
    { term: '最大回撤', en: 'Max Drawdown', def: '区间内从高点到随后低点的最大跌幅，刻画最坏体验。' },
    { term: '再平衡', en: 'Rebalancing', def: '定期把偏离的权重拉回目标，用纪律替代情绪择时。' },
    { term: '久期', en: 'Duration', def: '债券价格对利率变动的敏感度，单位近似为年。' },
    { term: '因子', en: 'Factor', def: '可解释长期回报来源的共同特征，如价值、质量、低波。' },
    { term: '相关性', en: 'Correlation', def: '两类资产同涨同跌的程度，越低越能分散风险。' },
    { term: '基点', en: 'Basis Point', def: '万分之一（0.01%），费率与利差的常用计量单位。' },
  ],
  itemCount = 6, columns = 2, showIndex = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { glsInjectStyle(); }, []);
  const n = Math.max(4, Math.min(terms.length, itemCount));
  const used = terms.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="gls-root">
      <div className="gls-head">
        <div className="gls-overline">{overline}</div>
        <h2 className="gls-title">{title}</h2>
      </div>

      <div className={`gls-list cols-${Math.max(1, Math.min(2, columns))}`}>
        {used.map((t, i) => {
          const hot = fIdx < 0 || fIdx === i;
          return (
            <div className={`gls-item ${fIdx === i ? 'is-hot' : ''} ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}>
              {showIndex && <span className="gls-idx">{String(i + 1).padStart(2, '0')}</span>}
              <div className="gls-body">
                <div className="gls-termrow">
                  <span className="gls-term">{t.term}</span>
                  <span className="gls-en">{t.en}</span>
                </div>
                <p className="gls-def">{t.def}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function glsInjectStyle() {
  if (document.getElementById('gls-style')) return;
  const s = document.createElement('style'); s.id = 'gls-style';
  s.textContent = `
  .gls-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .gls-head{margin-bottom:44px;}
  .gls-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .gls-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.1;}
  .gls-list{flex:1;min-height:0;display:grid;align-content:center;gap:0 90px;}
  .gls-list.cols-1{grid-template-columns:1fr;}
  .gls-list.cols-2{grid-template-columns:1fr 1fr;}
  .gls-item{display:grid;grid-template-columns:auto 1fr;gap:26px;align-items:start;padding:26px 0;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.12));transition:opacity .25s ease;}
  .gls-item.is-dim{opacity:.34;}
  .gls-idx{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.4));
    padding-top:9px;font-variant-numeric:tabular-nums;}
  .gls-item.is-hot .gls-idx{color:var(--ds-accent,#6f9bd8);}
  .gls-termrow{display:flex;align-items:baseline;gap:18px;flex-wrap:wrap;}
  .gls-term{font-size:34px;font-weight:400;line-height:1.1;}
  .gls-item.is-hot .gls-term{color:var(--ds-accent,#6f9bd8);}
  .gls-en{font-family:var(--font-mono);font-size:21px;letter-spacing:.05em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .gls-def{font-size:25px;font-weight:300;line-height:1.45;margin:12px 0 0;text-wrap:pretty;
    color:var(--ds-muted,rgba(242,243,246,.66));}
  .gls-list.cols-1 .gls-item{padding:20px 0;}
  .gls-list.cols-1 .gls-body{display:grid;grid-template-columns:330px 1fr;gap:44px;align-items:baseline;}
  .gls-list.cols-1 .gls-def{margin-top:0;}
  `;
  document.head.appendChild(s);
}

SlideGlossary.META = {
  id: 'glossary', title: '名词释义',
  defaults: { itemCount: 6, columns: 2, showIndex: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'itemCount', type: 'slider', label: '词条数量', default: 6, min: 4, max: 8, step: 1,
      description: '展示的名词释义条数。' },
    { key: 'columns', type: 'slider', label: '列数', default: 2, min: 1, max: 2, step: 1,
      description: '单列长表或双列并排。' },
    { key: 'showIndex', type: 'toggle', label: '序号', default: true,
      description: '每个词条前的 01.. 计数。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一个词条，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的词条。' },
  ],
};

export { SlideGlossary };
export const META = SlideGlossary.META;
export default SlideGlossary;
