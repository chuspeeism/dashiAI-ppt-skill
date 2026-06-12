// Page31Triptych.jsx — "Branch Triptych" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-tp-`.
// A count-driven row of "branch" cards (0–4). Each card stacks an
// AdaptiveImageSlot (resizes to its uploaded photo's ratio) over a ranked label
// and a headline figure. One card can be focused; an optional footer strip adds
// an editorial note. Distinct from the panel+collage image pages.
// Fully portable — no dependency on the Tweaks panel; all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page31Triptych(props) {
  const p = { ...Page31Triptych.defaults, ...props };
  const {
    backgroundTheme, cardCount, showValue, showStrip, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, branches, strip, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const cards = branches.slice(0, Math.max(0, cardCount));
  const fIdx = Math.min(focusIndex, Math.max(0, cards.length - 1));
  const accents = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)'];
  // image box shrinks a touch as card count grows so the row stays balanced.
  const box = cards.length <= 2 ? 460 : cards.length === 3 ? 392 : 300;

  return (
    <div className="acl-root acl-tp" style={{ background: bg }}>
      <style>{`
        .acl-tp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-tp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-tp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-tp__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-tp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-tp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-tp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-tp__body{ flex:1; display:flex; gap:34px; margin-top:28px; min-height:0; }
        .acl-tp__empty{ flex:1; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:36px; color:rgba(22,21,15,.4); transform:rotate(-3deg); }
        .acl-tp__card{ flex:1; position:relative; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:8px 10px 0 rgba(22,21,15,.16); padding:22px 22px 24px; display:flex; flex-direction:column;
          align-items:center; min-width:0; }
        .acl-tp__rank{ position:absolute; top:-22px; left:-14px; z-index:6; width:54px; height:54px;
          border-radius:50%; background:var(--acl-ink); color:var(--acl-paper); display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:32px; transform:rotate(-6deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); }
        .acl-tp__imgzone{ flex:1; width:100%; display:flex; align-items:center; justify-content:center;
          min-height:0; }
        .acl-tp__meta{ width:100%; flex:0 0 auto; text-align:center; margin-top:18px; }
        .acl-tp__name{ font-weight:900; font-size:40px; line-height:1; }
        .acl-tp__en{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:6px; }
        .acl-tp__val{ font-family:var(--acl-font-num); font-size:84px; line-height:.82; margin-top:12px; }
        .acl-tp__val em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:22px;
          margin-left:5px; opacity:.62; }
        .acl-tp__note{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.02em;
          color:rgba(22,21,15,.55); margin-top:8px; }
        .acl-tp__card--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateY(-10px); }
        .acl-tp__card--focus .acl-tp__en, .acl-tp__card--focus .acl-tp__note{ color:rgba(255,255,255,.55); }
        .acl-tp__card--focus .acl-tp__rank{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-tp__fx{ position:absolute; top:-20px; right:-12px; z-index:7; }

        .acl-tp__strip{ flex:0 0 auto; margin-top:22px; display:flex; align-items:center; gap:0;
          border:3px solid var(--acl-ink); }
        .acl-tp__stripcell{ flex:1; padding:13px 24px; display:flex; align-items:baseline; gap:12px;
          background:var(--acl-paper); }
        .acl-tp__stripcell + .acl-tp__stripcell{ border-left:3px solid var(--acl-ink); }
        .acl-tp__stripcell .sk{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-tp__stripcell .sv{ font-weight:900; font-size:24px; }
        .acl-tp__stripcell:last-child{ background:var(--acl-yellow); }

        .acl-tp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-tp__card{ animation:acl-tp-rise .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s); }
        }
        @keyframes acl-tp-rise{ from{ opacity:0; transform:translateY(22px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-tp__head">
        <div>
          <div className="acl-tp__eyebrow">{eyebrow}</div>
          <h1 className="acl-tp__h">{headline}</h1>
        </div>
        <div className="acl-tp__sub">{subheadline}</div>
        <div className="acl-tp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-tp__body">
        {cards.length === 0 && <div className="acl-tp__empty">// 分支数量 = 0</div>}
        {cards.map((b, i) => {
          const isF = focusEnabled && i === fIdx;
          const accent = accents[i % accents.length];
          return (
            <div key={i} className={'acl-tp__card' + (isF ? ' acl-tp__card--focus' : '')} style={{ '--i': i }}>
              <div className="acl-tp__rank">{i + 1}</div>
              {isF && showDecor && <div className="acl-tp__fx"><Sticker label="高壁垒" sub="MOAT" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={6} size={17} /></div>}
              <div className="acl-tp__imgzone">
                <AdaptiveImageSlot id={'triptych-' + i} box={box} rotate={i % 2 ? 2 : -2} ratio={0.82}
                  accent={isF ? 'var(--acl-yellow)' : 'var(--acl-paper)'} placeholder={b.name}
                  sticker={{ label: b.tag, color: accent, subColor: 'var(--acl-ink)', rotate: i % 2 ? 3 : -3 }} />
              </div>
              <div className="acl-tp__meta">
                <div className="acl-tp__name">{b.name}</div>
                <div className="acl-tp__en">{b.en}</div>
                {showValue && <div className="acl-tp__val">{b.value}<em>{b.unit}</em></div>}
                <div className="acl-tp__note">{b.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      {showStrip && (
        <div className="acl-tp__strip">
          {strip.map((s, i) => (
            <div key={i} className="acl-tp__stripcell">
              <span className="sk">{s.k}</span><span className="sv">{s.v}</span>
            </div>
          ))}
        </div>
      )}

      <div className="acl-tp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && <Doodle kind="spark" size={40} rotate={10} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
      </div>
    </div>
  );
}

Page31Triptych.defaults = {
  backgroundTheme: 'muted',
  cardCount: 3,            // 0–4 branch cards (each carries an adaptive image slot)
  showValue: true,
  showStrip: true,
  focusEnabled: true,
  focusIndex: 1,           // 药物发现 — highest funding
  showDecor: true,
  eyebrow: 'Healthcare AI',
  headline: '慢变量高壁垒',
  subheadline: '医疗 AI 赛道',
  summary: '医疗 AI 集中在<b>影像、药物发现和临床文书</b>自动化。',
  branches: [
    { name: '影像诊断', en: 'Imaging', value: '11', unit: '亿', tag: '诊断', note: 'FDA 审批 · 高门槛' },
    { name: '药物发现', en: 'Drug Discovery', value: '14', unit: '亿', tag: '研发', note: '验证周期长 · 强壁垒' },
    { name: '临床文书', en: 'Clinical Notes', value: '9', unit: '亿', tag: '文书', note: '高频刚需 · 快落地' },
    { name: '远程监护', en: 'Remote Care', value: '6', unit: '亿', tag: '监护', note: '设备绑定 · 数据沉淀' },
  ],
  strip: [
    { k: '赛道融资额', v: '34 亿美元' },
    { k: '事件数', v: '8 笔' },
    { k: '验证周期', v: '长' },
    { k: '进入壁垒', v: '高' },
  ],
  closingLine: '慢场景不代表低价值。',
};

Page31Triptych.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '分支数量', desc: '分支卡数量(0–4)；每卡含一个图片槽，布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showValue', type: 'boolean', default: true,
    label: '数值', desc: '每张分支卡的大号数值的显示/隐藏' },
  { key: 'showStrip', type: 'boolean', default: true,
    label: '信息条', desc: '底部赛道汇总信息条的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某张分支卡' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, step: 1, maxFrom: 'cardCount',
    label: '重点对象', desc: '被突出的分支卡序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page31Triptych.defaults;
export const controls = Page31Triptych.controls;
