// SlideFAQ.jsx — 常见问题 / editorial Q-beside-A ledger.
// A full-width spread: a left masthead column (overline + big title + a live
// counter), and questions running down the right as wide rows where the
// question sits left of a hairline-separated answer, each prefixed by an
// oversized mono Q index. Replaces the old symmetric two-column card list.
// Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.faq-`.
//
// ── Props (canonical list in SlideFAQ.META.controls) ──────────────────────────
//   itemCount   number 3..6   how many Q&A rows                             (4)
//   focus       boolean       emphasise one row, dim the rest               (false)
//   focusIndex  number 1..6   which row is emphasised (1-based)             (1)
//   showIndex   boolean       the oversized mono Q01 / Q02 markers          (true)
//
// Content props (authored at call-site):
//   overline, title, items:[{ q, a }]

import React from 'react';

function SlideFAQ({
  overline = '答疑 · COMMON QUESTIONS', title = '你可能正想问的',
  items = [
    { q: '我的钱安全吗？', a: '资产由持牌托管机构独立保管，我们不触碰本金；所有持仓与操作都记录在对持有人开放的账本里。' },
    { q: '为什么不承诺跑赢市场？', a: '没人能稳定预测市场。我们承诺的是纪律、透明与低成本——这些才是长期复利里真正可控的部分。' },
    { q: '费用到底怎么算？', a: '一个全包年费率，覆盖配置、再平衡、税务优化与对冲，没有隐藏的申赎或业绩抽成。' },
    { q: '波动来时会怎样？', a: '再平衡、止盈与对冲均由系统在预设规则下自动触发，避免在情绪最强烈时做出最糟的决定。' },
    { q: '我可以随时退出吗？', a: '可以。持仓清晰、流动性透明，赎回按市价执行，不设惩罚性锁定期。' },
    { q: '它适合长期还是短期？', a: '它为长期复利而设计。时间越长，纪律与低成本的优势被复利放大得越明显。' },
  ],
  itemCount = 4, focus = false, focusIndex = 1, showIndex = true,
}) {
  React.useEffect(() => { faqInjectStyle(); }, []);
  const n = Math.max(3, Math.min(items.length, itemCount));
  const rows = items.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="faq-root">
      <div className="faq-mast">
        <div className="faq-overline">{overline}</div>
        <h2 className="faq-title">{title}</h2>
        <div className="faq-counter">{String(n).padStart(2, '0')}<span className="faq-counter-sub"> 个常见问题</span></div>
      </div>

      <div className="faq-list">
        {rows.map((it, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          return (
            <div className={`faq-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="faq-q">
                {showIndex && <span className="faq-idx">Q{String(i + 1).padStart(2, '0')}</span>}
                <h3 className="faq-qt">{it.q}</h3>
              </div>
              <p className="faq-a">{it.a}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function faqInjectStyle() {
  if (document.getElementById('faq-style')) return;
  const s = document.createElement('style'); s.id = 'faq-style';
  s.textContent = `
  .faq-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;gap:96px;font-family:var(--font-sans);}
  .faq-mast{flex:0 0 30%;display:flex;flex-direction:column;min-width:0;}
  .faq-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .faq-title{font-size:64px;font-weight:300;margin:22px 0 0;line-height:1.08;letter-spacing:.01em;text-wrap:balance;}
  .faq-counter{margin-top:auto;font-family:var(--font-mono);font-size:96px;font-weight:200;line-height:1;
    color:var(--ds-accent,#6f9bd8);font-variant-numeric:tabular-nums;display:flex;align-items:baseline;}
  .faq-counter-sub{font-size:26px;letter-spacing:.1em;color:var(--ds-faint,rgba(242,243,246,.42));margin-left:18px;}
  .faq-list{flex:1;display:flex;flex-direction:column;min-width:0;align-content:stretch;}
  .faq-row{flex:1;display:grid;grid-template-columns:1fr 1.05fr;align-items:center;gap:64px;
    padding:30px 0;border-top:1px solid var(--ds-line,rgba(242,243,246,.13));transition:opacity .25s;}
  .faq-list > .faq-row:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .faq-q{display:flex;align-items:baseline;gap:26px;min-width:0;}
  .faq-idx{font-family:var(--font-mono);font-size:34px;font-weight:400;letter-spacing:.02em;
    color:var(--ds-faint,rgba(242,243,246,.4));flex:0 0 auto;font-variant-numeric:tabular-nums;}
  .faq-qt{font-size:38px;font-weight:400;margin:0;line-height:1.16;text-wrap:balance;}
  .faq-a{font-size:25px;line-height:1.6;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));
    margin:0;max-width:680px;text-wrap:pretty;}
  .faq-row.is-dim{opacity:.34;}
  .faq-row.is-focus .faq-idx,.faq-row.is-focus .faq-qt{color:var(--ds-accent,#6f9bd8);}
  .faq-row.is-focus .faq-a{color:var(--ds-ink,#f2f3f6);}
  `;
  document.head.appendChild(s);
}

SlideFAQ.META = {
  id: 'faq', title: '常见问题',
  defaults: { itemCount: 4, focus: false, focusIndex: 1, showIndex: true },
  controls: [
    { key: 'itemCount', type: 'slider', label: '问题数量', default: 4, min: 3, max: 6, step: 1,
      description: '展示的问答行数（同时驱动左侧计数器）。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行问答，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
    { key: 'showIndex', type: 'toggle', label: '问题编号', default: true,
      description: '每个问题前的 Q01 / Q02 大号编号。' },
  ],
};

export { SlideFAQ };
export const META = SlideFAQ.META;
export default SlideFAQ;
