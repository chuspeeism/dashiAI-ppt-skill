// Page53Resource.jsx — "Resource Binding Map" template page (image-led + resource cards)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rs-`.
// Left: a count-driven adaptive photo collage (0–3 slots, each self-sizing to
// its own aspect ratio). Right: a count-driven stack of "resource binding" cards
// — each a labeled resource with a big count, a qualitative strength bar and a
// focusable spotlight. Frames the idea that a deal binds resources, not just
// cash. Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

const ACL_RS_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-red)'];

export default function Page53Resource(props) {
  const p = { ...Page53Resource.defaults, ...props };
  const {
    backgroundTheme, mediaCount, cardCount, focusEnabled, focusIndex, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, cardsTitle, cards, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const slots = collage[mediaCount] || [];
  const items = cards.slice(0, Math.max(2, cardCount));
  const fIdx = Math.min(focusIndex, items.length - 1);

  return (
    <div className="acl-root acl-rs" style={{ background: bg }}>
      <style>{`
        .acl-rs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 66px; display:flex; flex-direction:column; }
        .acl-rs__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-rs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-rs__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-rs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-rs__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-rs__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-rs__body{ flex:1; display:flex; gap:50px; margin-top:30px; min-height:0; }

        /* left: photo collage stage */
        .acl-rs__stage{ position:relative; flex:1 1 auto; min-width:0; }
        .acl-rs__slot{ position:absolute; }
        .acl-rs__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); }
        .acl-rs__stagetag{ position:absolute; left:0; bottom:6px; font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.5);
          display:flex; align-items:center; gap:8px; }
        .acl-rs__stagetag i{ width:34px; height:3px; background:var(--acl-ink); display:block; }

        /* right: resource binding cards */
        .acl-rs__cards{ flex:0 0 760px; display:flex; flex-direction:column; gap:16px; min-height:0;
          justify-content:center; }
        .acl-rs__cardsT{ font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(22,21,15,.5); display:flex; align-items:center; gap:10px; }
        .acl-rs__cardsT b{ font-family:var(--acl-font-cn); font-weight:900; font-size:26px;
          letter-spacing:0; text-transform:none; color:var(--acl-ink); }
        .acl-rs__card{ background:var(--acl-paper); border:3px solid var(--acl-ink); padding:16px 22px 14px;
          box-shadow:6px 7px 0 rgba(22,21,15,.16); display:grid;
          grid-template-columns:54px 1fr auto; grid-template-rows:auto auto; column-gap:18px;
          align-items:center; transition:opacity .25s, transform .25s, box-shadow .25s; }
        .acl-rs__idx{ grid-row:1 / span 2; width:54px; height:54px; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:30px; color:var(--acl-paper); }
        .acl-rs__cl{ font-weight:900; font-size:30px; line-height:1.02; }
        .acl-rs__cn{ grid-column:2; font-size:18px; line-height:1.3; color:rgba(22,21,15,.62); margin-top:2px; }
        .acl-rs__cv{ grid-row:1 / span 2; grid-column:3; text-align:right; font-family:var(--acl-font-num);
          font-size:58px; line-height:.86; }
        .acl-rs__cv em{ display:block; font-style:normal; font-family:var(--acl-font-mono); font-weight:700;
          font-size:15px; letter-spacing:.04em; color:rgba(22,21,15,.5); margin-top:4px; text-transform:uppercase; }
        .acl-rs__bar{ grid-column:1 / -1; grid-row:3; height:10px; margin-top:13px; background:rgba(22,21,15,.1);
          border:2px solid var(--acl-ink); position:relative; overflow:hidden; }
        .acl-rs__fill{ position:absolute; inset:0 auto 0 0; transition:width .55s cubic-bezier(.2,.8,.2,1); }
        .acl-rs__card{ grid-template-rows:auto auto auto; }
        .acl-rs__card--focus{ transform:rotate(-.6deg); box-shadow:9px 11px 0 rgba(22,21,15,.22);
          border-color:var(--acl-pink); }
        .acl-rs__card--dim{ opacity:.5; }

        .acl-rs__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rs__card{ animation:acl-rs-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .25s); }
        }
        @keyframes acl-rs-in{ from{ opacity:0; transform:translateX(22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-rs__head">
        <div>
          <div className="acl-rs__eyebrow">{eyebrow}</div>
          <h1 className="acl-rs__h">{headline}</h1>
        </div>
        <div className="acl-rs__sub">{subheadline}</div>
        <div className="acl-rs__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rs__body">
        {/* ── left: adaptive photo collage ── */}
        <div className="acl-rs__stage">
          {slots.length === 0 && <div className="acl-rs__empty">（图片可选 · 0）</div>}
          {slots.map((s, i) => (
            <div className="acl-rs__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'resource-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent={s.accent} placeholder={s.ph} sticker={s.st} />
            </div>
          ))}
          {slots.length > 0 && <div className="acl-rs__stagetag"><i />Resource map · 资源绑定现场</div>}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <Doodle kind="arrow" size={100} rotate={4} color="var(--acl-ink)" style={{ right: -46, top: 96 }} />
              <Doodle kind="spark" size={44} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
                style={{ left: -12, bottom: 60 }} />
            </React.Fragment>
          )}
        </div>

        {/* ── right: resource binding cards ── */}
        <div className="acl-rs__cards">
          <div className="acl-rs__cardsT">
            <b>{cardsTitle}</b>
            {showDecor && <Doodle kind="arrowS" size={34} rotate={-16} style={{ position: 'static' }} />}
          </div>
          {items.map((c, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            const color = ACL_RS_COLORS[i % ACL_RS_COLORS.length];
            return (
              <div key={i} className={'acl-rs__card' + (isF ? ' acl-rs__card--focus' : '') + (dim ? ' acl-rs__card--dim' : '')}
                style={{ '--i': i }}>
                <div className="acl-rs__idx" style={{ background: color }}>{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-rs__cl">{c.label}</div>
                <div className="acl-rs__cn">{c.note}</div>
                <div className="acl-rs__cv">{showValueLabels ? c.value : '·'}<em>{c.unit}</em></div>
                <div className="acl-rs__bar"><div className="acl-rs__fill" style={{ width: c.w + '%', background: color }} /></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-rs__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + collage presets (count → balanced slot configs) ────────
Page53Resource.defaults = {
  // adjustable params
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  mediaCount: 2,               // 0–3 adaptive photo slots
  cardCount: 4,                // 2–4 resource binding cards
  focusEnabled: true,
  focusIndex: 0,               // spotlight 云资源授信
  showValueLabels: true,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Strategic Investors',
  headline: '钱以外的资源',
  subheadline: '战略投资者角色',
  summary: '战略投资者带来渠道、云资源、芯片供应和客户入口——<b>钱只是其中一部分</b>。',
  cardsTitle: '被绑定的关键资源',
  cards: [
    { label: '云资源授信', value: '118', unit: '亿美元', note: 'GPU / 算力额度换取股权与优先权', w: 100 },
    { label: '联合销售', value: '36', unit: '起', note: '产业方渠道直达企业客户', w: 64 },
    { label: '芯片供应承诺', value: '22', unit: '起', note: '锁定先进制程与交付优先级', w: 46 },
    { label: '数据合作', value: '17', unit: '起', note: '行业数据回流强化模型壁垒', w: 34 },
  ],
  collage: {
    0: [],
    1: [
      { l: 120, t: 60, box: 560, r: -3, ratio: 0.95, accent: 'var(--acl-paper)', ph: '资源现场', st: { label: 'RES.01', sub: '资源', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
    ],
    2: [
      { l: 30, t: 24, box: 420, r: -4, ratio: 0.86, accent: 'var(--acl-paper)', ph: '资源现场', st: { label: 'RES.01', sub: '资源', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
      { l: 360, t: 340, box: 360, r: 4, ratio: 1.18, accent: 'var(--acl-paper)', ph: '资源现场', st: { label: 'RES.02', color: 'var(--acl-blue)', rotate: 3 } },
    ],
    3: [
      { l: 40, t: 0, box: 360, r: 3, ratio: 0.9, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'RES.01', sub: '资源', color: 'var(--acl-yellow)', subColor: 'var(--acl-pink)', rotate: -4 } },
      { l: 10, t: 360, box: 300, r: -5, ratio: 1.2, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'RES.02', color: 'var(--acl-blue)', rotate: 4 } },
      { l: 360, t: 270, box: 340, r: 5, ratio: 0.84, accent: 'var(--acl-paper)', ph: '图片', st: { label: 'RES.03', color: 'var(--acl-pink)', rotate: -3 } },
    ],
  },
  closingLine: 'AI 公司融资，是在锁定未来资源。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page53Resource.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴照片槽数量；布局随数量自动平衡，每个槽按上传图片比例自适应' },
  { key: 'cardCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '卡片数量', desc: '资源绑定卡的数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一张资源卡' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'cardCount', step: 1,
    label: '重点对象', desc: '被高亮的资源卡序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各资源卡的数量数值 显隐' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page53Resource.defaults;
export const controls = Page53Resource.controls;
