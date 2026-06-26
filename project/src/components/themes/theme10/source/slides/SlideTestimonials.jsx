// SlideTestimonials.jsx — 客户实证 / lead pull-quote + proof ledger.
// One testimonial is pulled out large on the left as an editorial quote with a
// sizeable avatar; the remaining proofs run down the right as a compact hairline
// ledger (small avatar + short quote + attribution). Replaces the old rounded
// quote-card grid and drops the star rating entirely.
// Standalone & migratable: depends on React + DeckImageSlot (both global).
// Avatars persist via `${idPrefix}-aN`. Token-driven. CSS scoped under `.tst-`.
//
// ── Props (canonical list in SlideTestimonials.META.controls) ─────────────────
//   cardCount    number 2..4   total proofs (1 lead + the rest in the ledger) (4)
//   focusIndex   number 1..4   which proof is the large lead quote (1-based)  (1)
//   showAvatar   boolean       the circular avatar image slots                (true)
//
// Content props (authored at call-site):
//   overline, title, cards:[{ quote, name, role }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideTestimonials({
  idPrefix = 'testimonials',
  overline = '客户实证 · IN THEIR WORDS', title = '把钱交给纪律之后',
  cards = [
    { quote: '第一次有人把每一笔操作都摊开给我看。波动还在，但焦虑没了。', name: '周敏', role: '持有人 · 4 年' },
    { quote: '它不许诺跑赢谁，只是稳稳地、可解释地往前走，这反而让我敢长期持有。', name: '李哲', role: '持有人 · 2 年' },
    { quote: '费用透明到基点，税务还帮我省下一笔。比我自己折腾省心太多。', name: '陈薇', role: '持有人 · 6 年' },
    { quote: '动荡那几个月我没动手，系统替我守住了纪律——结果证明这是对的。', name: '王凯', role: '持有人 · 3 年' },
  ],
  cardCount = 4, focusIndex = 1, showAvatar = true,
}) {
  React.useEffect(() => { tstInjectStyle(); }, []);
  const n = Math.max(2, Math.min(cards.length, cardCount));
  const items = cards.slice(0, n);
  const lead = Math.max(0, Math.min(n - 1, focusIndex - 1));
  const hero = items[lead];
  const rest = items.map((c, i) => ({ c, i })).filter((x) => x.i !== lead);

  return (
    <div className="tst-root">
      <div className="tst-lead">
        <div className="tst-overline">{overline}</div>
        <blockquote className="tst-bigquote"><span className="tst-mark">“</span>{hero.quote}</blockquote>
        <div className="tst-who">
          {showAvatar && (
            <span className="tst-avatar tst-avatar-lg">
              <DeckImageSlot id={`${idPrefix}-a${lead}`} fit="cover" radius={999} placeholder="图片" />
            </span>
          )}
          <span className="tst-id">
            <span className="tst-name">{hero.name}</span>
            <span className="tst-role">{hero.role}</span>
          </span>
        </div>
      </div>

      <div className="tst-rest">
        <div className="tst-resthead">{title}</div>
        {rest.map(({ c, i }) => (
          <div className="tst-row" key={i}>
            {showAvatar && (
              <span className="tst-avatar tst-avatar-sm">
                <DeckImageSlot id={`${idPrefix}-a${i}`} fit="cover" radius={999} placeholder="图片" />
              </span>
            )}
            <div className="tst-rowtext">
              <p className="tst-rowquote">{c.quote}</p>
              <span className="tst-rowwho"><span className="tst-rowname">{c.name}</span><span className="tst-rowrole">{c.role}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function tstInjectStyle() {
  if (document.getElementById('tst-style')) return;
  const s = document.createElement('style'); s.id = 'tst-style';
  s.textContent = `
  .tst-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;gap:96px;font-family:var(--font-sans);}
  .tst-lead{flex:0 0 50%;display:flex;flex-direction:column;min-width:0;
    border-right:1px solid var(--ds-line,rgba(242,243,246,.13));padding-right:88px;}
  .tst-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .tst-bigquote{flex:1;display:flex;align-items:center;font-size:48px;line-height:1.36;font-weight:300;
    margin:0;letter-spacing:.01em;text-wrap:pretty;position:relative;}
  .tst-mark{color:var(--ds-accent,#6f9bd8);font-size:.92em;margin-right:.12em;}
  .tst-who{display:flex;align-items:center;gap:26px;margin-top:8px;}
  .tst-avatar{flex:0 0 auto;border-radius:50%;overflow:hidden;}
  .tst-avatar .dslot{border-radius:50%;}
  .tst-avatar-lg{width:104px;height:104px;}
  .tst-avatar-sm{width:64px;height:64px;}
  .tst-id{display:flex;flex-direction:column;gap:8px;min-width:0;}
  .tst-name{font-size:34px;font-weight:300;}
  .tst-role{font-family:var(--font-mono);font-size:24px;letter-spacing:.05em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .tst-rest{flex:1;display:flex;flex-direction:column;min-width:0;}
  .tst-resthead{font-family:var(--font-mono);font-size:24px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--ds-muted,rgba(242,243,246,.55));padding-bottom:8px;}
  .tst-row{flex:1;display:flex;align-items:center;gap:30px;padding:26px 0;min-width:0;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .tst-rowtext{display:flex;flex-direction:column;gap:16px;min-width:0;}
  .tst-rowquote{font-size:28px;line-height:1.46;font-weight:300;margin:0;text-wrap:pretty;}
  .tst-rowwho{display:flex;align-items:baseline;gap:18px;}
  .tst-rowname{font-size:25px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.8));}
  .tst-rowrole{font-family:var(--font-mono);font-size:24px;letter-spacing:.05em;color:var(--ds-faint,rgba(242,243,246,.45));}
  `;
  document.head.appendChild(s);
}

SlideTestimonials.META = {
  id: 'testimonials', title: '引述清单',
  defaults: { cardCount: 4, focusIndex: 1, showAvatar: true },
  controls: [
    { key: 'cardCount', type: 'slider', label: '内容数量', default: 4, min: 2, max: 4, step: 1,
      description: '条目总数（1 条放大，其余进入右侧清单）。' },
    { key: 'focusIndex', type: 'slider', label: '重点内容', default: 1, min: 1, max: 4, step: 1,
      description: '被放大为左侧重点内容的那一条（1 起）。' },
    { key: 'showAvatar', type: 'toggle', label: '圆形图片', default: true,
      description: '重点内容与清单中的圆形图片槽（可拖入媒体）。' },
  ],
};

export { SlideTestimonials };
export const META = SlideTestimonials.META;
export default SlideTestimonials;
