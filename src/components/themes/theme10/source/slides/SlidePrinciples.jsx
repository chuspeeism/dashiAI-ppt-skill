// SlidePrinciples.jsx — 投资原则 / editorial "spotlight + contents ledger".
// A magazine-style split: one principle is pulled out large on the left under a
// monumental ghost numeral, while every principle is listed as a numbered
// hairline ledger on the right (the spotlighted one marked in accent). Replaces
// the old symmetric 2-column grid — asymmetric, no boxes, distinct masthead.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.pcp-`.
//
// ── Props (canonical list in SlidePrinciples.META.controls) ───────────────────
//   itemCount     number 3..6   how many principles in the ledger            (4)
//   focusIndex    number 1..6   which principle is the large spotlight        (1)
//   showGhostNum  boolean       the monumental ghost numeral on the spotlight (true)
//   showLeadBody  boolean       show the spotlight's body paragraph           (true)
//
// Content props (authored at call-site):
//   overline, title, items:[{ head, body }]

import React from 'react';

function SlidePrinciples({
  overline = '投资原则 · PRINCIPLES', title = '不被市场动摇的准则',
  items = [
    { head: '只承担有补偿的风险', body: '每一份波动都应换回预期回报。无补偿的敞口被系统性剔除，风险预算只留给真正的定价错误。' },
    { head: '让纪律跑赢情绪', body: '规则在平静时写好，在动荡时执行。再平衡、止盈与对冲由系统触发，而不是临场的直觉判断。' },
    { head: '把成本当作收益', body: '省下的每个基点都会被复利放大。我们以税务感知的方式交易，持续压低显性与隐性成本。' },
    { head: '透明胜过承诺', body: '账本对持有人完全开放。我们不靠预测取信，而是让每一笔操作都可被复核、可被追溯。' },
    { head: '时间是唯一的杠杆', body: '我们不追逐短期排名，而是把复利的主动权交还给时间，并尽可能减少对它的干扰。' },
    { head: '简单优先于花哨', body: '能用更简单的结构达成同样目标，就不引入复杂性。复杂只在它带来真实补偿时才被保留。' },
  ],
  itemCount = 4, focusIndex = 1, showGhostNum = true, showLeadBody = true,
}) {
  React.useEffect(() => { pcpInjectStyle(); }, []);
  const n = Math.max(3, Math.min(items.length, itemCount));
  const rows = items.slice(0, n);
  const lead = Math.max(0, Math.min(n - 1, focusIndex - 1));
  const hero = rows[lead];

  return (
    <div className="pcp-root">
      <div className="pcp-lead">
        <div className="pcp-overline">{overline}</div>
        <h2 className="pcp-title">{title}</h2>
        <div className="pcp-spot">
          {showGhostNum && <span className="pcp-ghost">{String(lead + 1).padStart(2, '0')}</span>}
          <h3 className="pcp-spot-head">{hero.head}</h3>
          {showLeadBody && <p className="pcp-spot-body">{hero.body}</p>}
        </div>
      </div>

      <ol className="pcp-index">
        {rows.map((it, i) => (
          <li className={`pcp-irow ${i === lead ? 'is-lead' : ''}`} key={i}>
            <span className="pcp-inum">{String(i + 1).padStart(2, '0')}</span>
            <span className="pcp-ihead">{it.head}</span>
            <span className="pcp-imark" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  );
}

function pcpInjectStyle() {
  if (document.getElementById('pcp-style')) return;
  const s = document.createElement('style'); s.id = 'pcp-style';
  s.textContent = `
  .pcp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;gap:0;font-family:var(--font-sans);}
  .pcp-lead{flex:0 0 46%;display:flex;flex-direction:column;padding-right:88px;min-width:0;
    border-right:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .pcp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .pcp-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;letter-spacing:.01em;}
  .pcp-spot{margin-top:auto;position:relative;}
  .pcp-ghost{display:block;font-family:var(--font-mono);font-size:200px;line-height:.72;font-weight:200;
    letter-spacing:-.04em;color:var(--ds-accent,#6f9bd8);opacity:.9;margin-bottom:28px;}
  .pcp-spot-head{font-size:50px;font-weight:300;margin:0 0 22px;line-height:1.1;text-wrap:balance;max-width:640px;}
  .pcp-spot-body{font-size:27px;line-height:1.6;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));
    margin:0;max-width:600px;text-wrap:pretty;}
  .pcp-index{flex:1;list-style:none;margin:0;padding:0 0 0 88px;display:flex;flex-direction:column;
    justify-content:center;min-width:0;}
  .pcp-irow{display:flex;align-items:center;gap:40px;padding:34px 8px 34px 0;position:relative;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.13));transition:opacity .25s,padding .25s;}
  .pcp-index > .pcp-irow:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .pcp-inum{font-family:var(--font-mono);font-size:30px;font-weight:400;letter-spacing:.02em;
    color:var(--ds-faint,rgba(242,243,246,.4));flex:0 0 auto;font-variant-numeric:tabular-nums;}
  .pcp-ihead{flex:1;font-size:40px;font-weight:300;line-height:1.12;min-width:0;text-wrap:balance;}
  .pcp-imark{flex:0 0 auto;width:9px;height:9px;border-radius:50%;background:var(--ds-faint,rgba(242,243,246,.28));}
  .pcp-irow.is-lead{padding-left:22px;}
  .pcp-irow.is-lead::before{content:"";position:absolute;left:0;top:18px;bottom:18px;width:3px;
    background:var(--ds-accent,#6f9bd8);}
  .pcp-irow:not(.is-lead){opacity:.62;}
  .pcp-irow.is-lead .pcp-inum,.pcp-irow.is-lead .pcp-ihead{color:var(--ds-accent,#6f9bd8);}
  .pcp-irow.is-lead .pcp-ihead{font-weight:400;}
  .pcp-irow.is-lead .pcp-imark{background:var(--ds-accent,#6f9bd8);}
  `;
  document.head.appendChild(s);
}

SlidePrinciples.META = {
  id: 'principles', title: '投资原则',
  defaults: { itemCount: 4, focusIndex: 1, showGhostNum: true, showLeadBody: true },
  controls: [
    { key: 'itemCount', type: 'slider', label: '原则数量', default: 4, min: 3, max: 6, step: 1,
      description: '右侧编号清单展示的原则条目数量。' },
    { key: 'focusIndex', type: 'slider', label: '主角原则', default: 1, min: 1, max: 6, step: 1,
      description: '被放大到左侧聚光位、并在清单中以蓝色标记的那一条（1 起）。' },
    { key: 'showGhostNum', type: 'toggle', label: '巨号序号', default: true,
      description: '左侧聚光位上方的超大蓝色序号。' },
    { key: 'showLeadBody', type: 'toggle', label: '主角正文', default: true,
      description: '左侧聚光原则下方的说明正文。' },
  ],
};

export { SlidePrinciples };
export const META = SlidePrinciples.META;
export default SlidePrinciples;
