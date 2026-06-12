// Page14Quote.jsx — "Quote / Pull-quote" template page (low-density, statement)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-qt-`.
// A single large statement centred on the page, with an optional set of short
// supporting points and a big quotation mark. Three background themes (primary /
// muted / ink) for dramatic section closers. No Tweaks dependency — portable ESM.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page14Quote(props) {
  const p = { ...Page14Quote.defaults, ...props };
  const {
    backgroundTheme, showSupports, supportCount, showQuoteMark, showDecor,
    eyebrow, headline, quote, supports, source, kicker,
  } = p;

  const isInk = backgroundTheme === 'ink';
  const bg = isInk
    ? 'radial-gradient(120% 120% at 78% 8%, #2A2820 0%, #16150F 60%, #100F0A 100%)'
    : backgroundTheme === 'muted'
      ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
      : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';
  const items = supports.slice(0, Math.max(0, supportCount));

  return (
    <div className={'acl-root acl-qt' + (isInk ? ' acl-qt--ink' : '')} style={{ background: bg }}>
      <style>{`
        .acl-qt{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:84px 120px 76px; display:flex; flex-direction:column; }
        .acl-qt--ink{ color:var(--acl-paper); }
        .acl-qt__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-qt__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-qt--ink .acl-qt__eyebrow{ color:rgba(251,250,244,.6); }
        .acl-qt__rule{ flex:1; height:0; border-top:3px solid currentColor; opacity:.5; }
        .acl-qt__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-qt--ink .acl-qt__kicker{ background:var(--acl-yellow); color:var(--acl-ink); }

        .acl-qt__body{ flex:1; display:flex; flex-direction:column; justify-content:center;
          position:relative; }
        .acl-qt__mark{ position:absolute; top:-46px; left:-30px; font-family:var(--acl-font-num);
          font-size:340px; line-height:.7; color:var(--acl-pink); opacity:.9; z-index:0;
          pointer-events:none; }
        .acl-qt--ink .acl-qt__mark{ color:var(--acl-yellow); opacity:.18; }
        .acl-qt__h{ position:relative; z-index:1; font-weight:900; font-size:112px; line-height:1.32;
          letter-spacing:-.01em; margin:0; max-width:1480px; text-wrap:balance; }
        .acl-qt__h b{ font-weight:900; background:var(--acl-yellow); color:var(--acl-ink);
          padding:.02em .1em; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
        .acl-qt--ink .acl-qt__h b{ background:var(--acl-pink); color:var(--acl-paper); }
        .acl-qt__label{ position:relative; z-index:1; font-family:var(--acl-font-mono); font-weight:700;
          font-size:22px; letter-spacing:.06em; color:rgba(22,21,15,.55); margin-bottom:26px; }
        .acl-qt--ink .acl-qt__label{ color:rgba(251,250,244,.55); }

        .acl-qt__supports{ display:flex; gap:22px; margin-top:48px; position:relative; z-index:1; }
        .acl-qt__s{ flex:1 1 0; min-width:0; border-top:5px solid var(--acl-ink); padding-top:14px;
          display:flex; flex-direction:column; gap:6px; }
        .acl-qt--ink .acl-qt__s{ border-color:var(--acl-yellow); }
        .acl-qt__sn{ font-family:var(--acl-font-num); font-size:30px; line-height:1; }
        .acl-qt--ink .acl-qt__sn{ color:var(--acl-yellow); }
        .acl-qt__st{ font-weight:700; font-size:24px; line-height:1.32; }

        .acl-qt__foot{ display:flex; align-items:center; gap:14px; flex:0 0 auto;
          font-family:var(--acl-font-mono); font-size:18px; letter-spacing:.04em;
          color:rgba(22,21,15,.55); }
        .acl-qt--ink .acl-qt__foot{ color:rgba(251,250,244,.55); }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-qt__h{ animation:acl-qt-in .6s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-qt__s{ animation:acl-qt-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .25s); }
        }
        @keyframes acl-qt-in{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-qt__top">
        <div className="acl-qt__eyebrow">{eyebrow}</div>
        <div className="acl-qt__rule" />
        <div className="acl-qt__kicker">{kicker}</div>
      </div>

      <div className="acl-qt__body">
        {showQuoteMark && <div className="acl-qt__mark" aria-hidden="true">“</div>}
        <div className="acl-qt__label">{headline}</div>
        <h1 className="acl-qt__h" dangerouslySetInnerHTML={{ __html: quote }} />

        {showSupports && items.length > 0 && (
          <div className="acl-qt__supports">
            {items.map((s, i) => (
              <div key={i} className="acl-qt__s" style={{ '--i': i }}>
                <div className="acl-qt__sn">{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-qt__st">{s}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="acl-qt__foot">
        {showDecor && <Doodle kind="spark" size={40} fill={isInk ? 'var(--acl-yellow)' : 'var(--acl-pink)'} stroke={isInk ? 'none' : 'var(--acl-ink)'} style={{ position: 'static' }} />}
        <span>{source}</span>
        {showDecor && !isInk && <Sticker label="核心判断" color="var(--acl-blue)" rotate={-4} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page14Quote.defaults = {
  backgroundTheme: 'ink',
  showSupports: true,
  supportCount: 3,         // 0–3 supporting points
  showQuoteMark: true,
  showDecor: true,
  eyebrow: 'Conclusion · 结论与数据来源',
  kicker: '金句页',
  headline: '三条核心结论 · 一句话判断',
  quote: '资本下一阶段，将从 <b>赌叙事</b> 转向 <b>看兑现</b>。',
  supports: [
    '资本仍在涌入 AI，但开始挑选确定性更高的标的。',
    '头部集中度本身就是市场结构，长尾被超级交易重新定价。',
    '兑现能力正取代叙事，成为衡量公司价值的新标尺。',
  ],
  source: '数据口径：2024 全年 · 单笔 ≥1 亿美元 · AI CAPITAL LAB',
};

Page14Quote.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'ink', options: ['primary', 'muted', 'ink'],
    label: '背景主题', desc: '主色(电光黄) / 次色(淡紫灰) / 深色(高反差金句)' },
  { key: 'showSupports', type: 'boolean', default: true,
    label: '支撑要点', desc: '底部要点行的显示/隐藏' },
  { key: 'supportCount', type: 'number', default: 3, min: 0, max: 3, step: 1, showIf: 'showSupports',
    label: '要点数量', desc: '展示的支撑要点数量(0–3)' },
  { key: 'showQuoteMark', type: 'boolean', default: true,
    label: '大引号', desc: '背景大号引号装饰的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘火花与贴纸标签的显示/隐藏' },
];

export const defaults = Page14Quote.defaults;
export const controls = Page14Quote.controls;
