// Page77Budget.jsx — "Strategy · Direction Cards + Screening Checklist" template page
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-is-`.
// A NEW strategy layout (distinct from P03 chapter cards / P13 compare timeline):
// a left INK "screening checklist" panel (count-driven diamond-ticked criteria)
// paired with a right GRID of recommended "direction cards" (doodle mark + idx +
// title + EN + one-line rationale) where one card can be focused/spotlighted.
// Pure ESM — no Tweaks/preview-runtime dependency; every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page77Budget(props) {
  const p = { ...Page77Budget.defaults, ...props };
  const {
    backgroundTheme, cardCount, criteriaCount, showChecklist, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, checklistTitle, criteria, directions, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const cards = directions.slice(0, Math.max(2, cardCount));
  const fIdx = Math.min(focusIndex, cards.length - 1);
  const crit = criteria.slice(0, Math.max(2, criteriaCount));
  const cols = cards.length <= 2 ? cards.length : cards.length === 3 ? 3 : 2;
  const marks = ['spark', 'star', 'heart', 'spark'];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-is" style={{ background: bg }}>
      <style>{`
        .acl-is{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 64px; display:flex; flex-direction:column; }
        .acl-is__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-is__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-is__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-is__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-is__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-is__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-is__body{ flex:1; display:flex; gap:46px; margin-top:30px; min-height:0; }

        /* ── left: screening checklist (ink panel) ── */
        .acl-is__check{ flex:0 0 600px; position:relative; background:var(--acl-ink); color:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 38px 30px; display:flex; flex-direction:column; min-width:0; }
        .acl-is__checkt{ font-family:var(--acl-font-mono); font-weight:700; font-size:15px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.5); flex:0 0 auto;
          display:flex; align-items:center; gap:12px; }
        .acl-is__checkt::after{ content:""; flex:1; height:0; border-top:2px solid rgba(255,255,255,.22); }
        .acl-is__crows{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:0; }
        .acl-is__crow{ display:flex; align-items:center; gap:20px; padding:18px 0;
          border-bottom:1.5px dashed rgba(255,255,255,.2); }
        .acl-is__crow:last-child{ border-bottom:none; }
        .acl-is__tick{ flex:0 0 auto; width:42px; height:42px; background:var(--acl-yellow);
          color:var(--acl-ink); display:grid; place-items:center; transform:rotate(45deg);
          box-shadow:3px 3px 0 rgba(0,0,0,.3); }
        .acl-is__tick span{ transform:rotate(-45deg); font-family:var(--acl-font-num); font-size:24px; line-height:1; }
        .acl-is__ctxt{ display:flex; flex-direction:column; gap:2px; min-width:0; }
        .acl-is__ctxt b{ font-weight:900; font-size:34px; line-height:1.04; }
        .acl-is__ctxt span{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(255,255,255,.5); }
        .acl-is__checkfx{ position:absolute; right:24px; top:22px; z-index:4; }

        /* ── right: direction cards grid ── */
        .acl-is__grid{ flex:1; min-width:0; display:grid; gap:24px; align-content:stretch;
          grid-template-columns:repeat(${cols}, 1fr); }
        .acl-is__card{ position:relative; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.16); padding:26px 28px 24px; display:flex; flex-direction:column;
          gap:10px; min-width:0; overflow:hidden;
          transition:opacity .25s, transform .25s, box-shadow .25s, background .25s; }
        .acl-is__corner{ position:absolute; top:0; right:0; width:74px; height:74px;
          clip-path:polygon(100% 0, 0 0, 100% 100%); }
        .acl-is__crow2{ display:flex; align-items:center; gap:14px; }
        .acl-is__cn{ font-family:var(--acl-font-num); font-size:46px; line-height:.8; }
        .acl-is__cmark{ margin-left:auto; }
        .acl-is__ct{ font-weight:900; font-size:38px; line-height:1; }
        .acl-is__cen{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-is__cd{ font-weight:700; font-size:21px; line-height:1.42; color:rgba(22,21,15,.64);
          margin-top:auto; }
        .acl-is__card--focus{ background:var(--acl-ink); color:var(--acl-paper);
          transform:translateY(-8px) scale(1.015); box-shadow:9px 12px 0 rgba(22,21,15,.3); z-index:3; }
        .acl-is__card--focus .acl-is__cen{ color:rgba(255,255,255,.55); }
        .acl-is__card--focus .acl-is__cd{ color:rgba(255,255,255,.8); }
        .acl-is__card--focus .acl-is__cn{ color:var(--acl-yellow); }
        .acl-is__card--dim{ opacity:.5; }
        .acl-is__cfx{ position:absolute; top:-15px; left:-10px; z-index:5; }

        .acl-is__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-is__check{ animation:acl-is-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-is__crow{ animation:acl-is-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .2s); }
          [data-deck-active] .acl-is__card{ animation:acl-is-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .26s); }
        }
        @keyframes acl-is-rise{ from{ opacity:0; transform:translateX(-26px); } to{ opacity:1; transform:none; } }
        @keyframes acl-is-in{ from{ opacity:0; transform:translateX(-14px); } to{ opacity:1; transform:none; } }
        @keyframes acl-is-pop{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-is__head">
        <div>
          <div className="acl-is__eyebrow">{eyebrow}</div>
          <h1 className="acl-is__h">{headline}</h1>
        </div>
        <div className="acl-is__sub">{subheadline}</div>
        <div className="acl-is__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-is__body">
        {showChecklist && (
          <div className="acl-is__check">
            <div className="acl-is__checkt">{checklistTitle}</div>
            {showDecor && (
              <div className="acl-is__checkfx">
                <Sticker label="筛选清单" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={5} size={13} />
              </div>
            )}
            <div className="acl-is__crows">
              {crit.map((c, i) => (
                <div key={i} className="acl-is__crow" style={{ '--i': i }}>
                  <span className="acl-is__tick"><span>{String(i + 1).padStart(2, '0')}</span></span>
                  <div className="acl-is__ctxt"><b>{c.name}</b><span>{c.en}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="acl-is__grid">
          {cards.map((d, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            const acc = accents[i % accents.length];
            return (
              <div key={i} className={'acl-is__card' + (isF ? ' acl-is__card--focus' : '') + (dim ? ' acl-is__card--dim' : '')}
                   style={{ '--i': i }}>
                <div className="acl-is__corner" style={{ background: isF ? 'var(--acl-yellow)' : acc }} />
                {isF && showDecor && <div className="acl-is__cfx"><Sticker label="优先" color="var(--acl-yellow)" rotate={-7} size={13} /></div>}
                <div className="acl-is__crow2">
                  <span className="acl-is__cn">{String(i + 1).padStart(2, '0')}</span>
                  {showDecor && (
                    <span className="acl-is__cmark">
                      <Doodle kind={marks[i % marks.length]} size={42} rotate={i % 2 ? 8 : -8}
                        fill={isF ? 'var(--acl-yellow)' : acc} stroke="var(--acl-ink)" style={{ position: 'static' }} />
                    </span>
                  )}
                </div>
                <div className="acl-is__ct">{d.title}</div>
                <div className="acl-is__cen">{d.en}</div>
                <div className="acl-is__cd">{d.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-is__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page77Budget.defaults = {
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  cardCount: 4,                // 2–4 recommended direction cards
  criteriaCount: 4,            // 2–4 screening checklist rows
  showChecklist: true,         // left screening panel show/hide
  focusEnabled: true,
  focusIndex: 0,               // spotlight one direction card
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Infrastructure Strategy',
  headline: '确定性预算',
  subheadline: '策略 · 优先基础设施',
  summary: '基础设施更接近 <b>刚性预算</b>，收入确定性相对更强。',
  checklistTitle: '筛选指标 · Screening',
  criteria: [
    { name: '收入增速', en: 'Revenue Growth' },
    { name: '毛利率', en: 'Gross Margin' },
    { name: '客户集中度', en: 'Concentration' },
    { name: '资源锁定', en: 'Resource Lock-in' },
  ],
  directions: [
    { title: 'GPU 云', en: 'GPU Cloud', note: '训练与推理双重需求，资源锁定即护城河。' },
    { title: '数据平台', en: 'Data Platform', note: '最接近企业刚性预算，存量客户可复用。' },
    { title: '评测工具', en: 'Eval & Trust', note: '监管收紧把安全从可选预算变成刚需。' },
    { title: '推理优化', en: 'Inference', note: '抬高毛利天花板，决定单位经济模型。' },
  ],
  closingLine: '优先看能支撑全行业增长的基础设施。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page77Budget.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '方向卡数量', desc: '推荐方向卡数量(2–4)，网格随数量自动布局' },
  { key: 'showChecklist', type: 'boolean', default: true,
    label: '筛选面板', desc: '左侧筛选指标清单面板 显隐' },
  { key: 'criteriaCount', type: 'number', default: 4, min: 2, max: 4, step: 1, showIf: 'showChecklist',
    label: '筛选指标数', desc: '筛选清单行数(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一张方向卡(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'cardCount',
    label: '重点对象', desc: '被突出的方向卡序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page77Budget.defaults;
export const controls = Page77Budget.controls;
