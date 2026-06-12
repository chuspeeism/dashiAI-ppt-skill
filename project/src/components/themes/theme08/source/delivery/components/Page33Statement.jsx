// Page33Statement.jsx — "Big Statement" template page (low-density, quote)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-q2-`.
// A SECOND quote/statement layout (distinct from Page14): left-aligned mega
// statement with a tilted oversized backdrop word, a diagonal accent slab, and
// a right-hand vertical rail of numbered supporting points. Three background
// themes (primary / muted / ink). No Tweaks dependency — portable ESM.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page33Statement(props) {
  const p = { ...Page33Statement.defaults, ...props };
  const {
    backgroundTheme, showSupports, supportCount, showBackdrop, showDecor,
    eyebrow, kicker, label, statement, backdrop, supports, source,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 130% at 18% 12%, #2A2820 0%, #16150F 62%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(155deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(160deg, #F4F66C 0%, #ECEF35 46%, #E2E62A 100%)';
  const items = supports.slice(0, Math.max(0, supportCount));

  return (
    <div className={'acl-root acl-q2' + (isInk ? ' acl-q2--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-q2{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:84px 110px 76px; display:flex; flex-direction:column; }
        .acl-q2--ink{ color:var(--acl-paper); }

        .acl-q2__backdrop{ position:absolute; right:-40px; top:74px; font-family:var(--acl-font-num);
          font-size:330px; line-height:.72; letter-spacing:-.02em; color:var(--acl-ink); opacity:.07;
          transform:rotate(-7deg); pointer-events:none; white-space:nowrap; z-index:0; }
        .acl-q2--ink .acl-q2__backdrop{ color:var(--acl-yellow); opacity:.1; }

        .acl-q2__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; position:relative; z-index:2; }
        .acl-q2__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-q2--ink .acl-q2__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-q2__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.45; }
        .acl-q2__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-q2--ink .acl-q2__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-q2__body{ flex:1; display:flex; gap:56px; align-items:center; position:relative; z-index:1;
          min-height:0; }
        .acl-q2__main{ flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center; }
        .acl-q2__label{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          letter-spacing:.05em; color:rgba(22,21,15,.55); margin-bottom:26px; display:flex; align-items:center; gap:14px; }
        .acl-q2--ink .acl-q2__label{ color:rgba(251,250,244,.55); }
        .acl-q2__label::before{ content:""; width:52px; height:0; border-top:5px solid var(--acl-pink); }
        .acl-q2__h{ font-weight:900; font-size:100px; line-height:1.28; letter-spacing:-.015em; margin:0;
          max-width:1180px; text-wrap:balance; }
        .acl-q2__h b{ font-weight:900; background:var(--acl-pink); color:var(--acl-paper); padding:0 .08em;
          white-space:nowrap; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
        .acl-q2--ink .acl-q2__h b{ background:var(--acl-pink); color:var(--acl-paper); }
        .acl-q2__h u{ text-decoration:none; background:var(--acl-blue); color:var(--acl-ink); padding:0 .08em;
          white-space:nowrap; box-decoration-break:clone; -webkit-box-decoration-break:clone; }

        .acl-q2__rail{ flex:0 0 412px; display:flex; flex-direction:column; gap:0; align-self:stretch;
          justify-content:center; border-left:4px solid var(--acl-ink); padding-left:34px; }
        .acl-q2--ink .acl-q2__rail{ border-color:var(--acl-yellow); }
        .acl-q2__s{ padding:22px 0; border-bottom:1.5px dashed rgba(22,21,15,.26); display:flex; gap:18px;
          align-items:flex-start; }
        .acl-q2__s:last-child{ border-bottom:none; }
        .acl-q2--ink .acl-q2__s{ border-color:rgba(251,250,244,.22); }
        .acl-q2__sn{ font-family:var(--acl-font-num); font-size:50px; line-height:.8; flex:0 0 auto;
          color:var(--acl-ink); }
        .acl-q2--ink .acl-q2__sn{ color:var(--acl-yellow); }
        .acl-q2__st{ font-weight:700; font-size:24px; line-height:1.4; padding-top:5px; }

        .acl-q2__foot{ display:flex; align-items:center; gap:14px; flex:0 0 auto; position:relative; z-index:2;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em; color:rgba(22,21,15,.55); }
        .acl-q2--ink .acl-q2__foot{ color:rgba(251,250,244,.55); }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-q2__h{ animation:acl-q2-in .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-q2__s{ animation:acl-q2-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .28s); }
        }
        @keyframes acl-q2-in{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:none; } }
      `}</style>

      {showBackdrop && <div className="acl-q2__backdrop" aria-hidden="true">{backdrop}</div>}

      <div className="acl-q2__top">
        <div className="acl-q2__eyebrow">{eyebrow}</div>
        <div className="acl-q2__rule" />
        <div className="acl-q2__kicker">{kicker}</div>
      </div>

      <div className="acl-q2__body">
        <div className="acl-q2__main">
          <div className="acl-q2__label">
            {label}
            {showDecor && <Doodle kind="spark" size={34} fill={isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)'} stroke={isInk ? 'none' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
          </div>
          <h1 className="acl-q2__h" dangerouslySetInnerHTML={{ __html: statement }} />
        </div>

        {showSupports && items.length > 0 && (
          <div className="acl-q2__rail">
            {items.map((s, i) => (
              <div key={i} className="acl-q2__s" style={{ '--i': i }}>
                <div className="acl-q2__sn">{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-q2__st">{s}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="acl-q2__foot">
        {showDecor && <Doodle kind="loop" size={48} style={{ position: 'static' }} />}
        <span>{source}</span>
        {showDecor && !isInk && <Sticker label="核心判断" color="var(--acl-blue)" rotate={-4} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page33Statement.defaults = {
  backgroundTheme: 'primary',
  showSupports: true,
  supportCount: 3,         // 0–3 supporting points in the right rail
  showBackdrop: true,
  showDecor: true,
  eyebrow: 'Developer Tools · 开发者工具赛道',
  kicker: '金句页',
  label: '一句话判断',
  statement: '研发效率，是企业最直接的 <b>AI 预算入口</b> 之一。',
  backdrop: 'DEV',
  supports: [
    '代码补全与评审已成为团队级刚需，付费意愿明确。',
    '价值不在炫技 Demo，而在嵌入真实研发流水线。',
    '能被工程团队日常使用的工具，才有复利式留存。',
  ],
  source: '数据口径：2024 全年 · 单笔 ≥1 亿美元 · AI CAPITAL LAB',
};

Page33Statement.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差金句)' },
  { key: 'showSupports', type: 'boolean', default: true,
    label: '支撑要点', desc: '右侧要点列的显示/隐藏' },
  { key: 'supportCount', type: 'number', default: 3, min: 0, max: 3, step: 1, showIf: 'showSupports',
    label: '要点数量', desc: '展示的支撑要点数量(0–3)' },
  { key: 'showBackdrop', type: 'boolean', default: true,
    label: '背景大字', desc: '倾斜大号背景装饰字的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘火花与贴纸标签的显示/隐藏' },
];

export const defaults = Page33Statement.defaults;
export const controls = Page33Statement.controls;
