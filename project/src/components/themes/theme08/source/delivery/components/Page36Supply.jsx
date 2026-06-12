// Page36Supply.jsx — "Supply Chain + Share" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-sp-`.
// TOP a count-driven horizontal SUPPLY-CHAIN ribbon of connected nodes (one
// focusable). LOWER-LEFT count-driven SHARE ring cards (each a mini donut + %).
// LOWER-RIGHT a count-driven collage of AdaptiveImageSlots (0–3) that resize to
// their uploaded photo's ratio. Portable ESM — no Tweaks dependency; prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page36Supply(props) {
  const p = { ...Page36Supply.defaults, ...props };
  const {
    backgroundTheme, mediaCount, chainCount, shareCount, showChain, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, chain, shares, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const nodes = chain.slice(0, Math.max(3, chainCount));
  const fIdx = Math.min(focusIndex, nodes.length - 1);
  const cards = shares.slice(0, Math.max(2, shareCount));
  const slots = collage[mediaCount] || [];
  const palette = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)'];

  return (
    <div className="acl-root acl-sp" style={{ background: bg }}>
      <style>{`
        .acl-sp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-sp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-sp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-sp__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-sp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-sp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-sp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        /* ── supply-chain ribbon ── */
        .acl-sp__chain{ display:flex; align-items:stretch; gap:0; margin-top:26px; flex:0 0 auto; }
        .acl-sp__node{ flex:1; position:relative; display:flex; flex-direction:column; justify-content:center;
          background:var(--acl-paper); border:3px solid var(--acl-ink); padding:18px 22px 17px; transition:.25s; }
        .acl-sp__node:not(:last-child){ margin-right:34px; }
        .acl-sp__node:not(:last-child)::after{ content:""; position:absolute; right:-34px; top:50%;
          width:34px; height:0; border-top:3px dashed var(--acl-ink); transform:translateY(-50%); }
        .acl-sp__node:not(:last-child)::before{ content:""; position:absolute; right:-13px; top:50%;
          width:0; height:0; border-left:13px solid var(--acl-ink);
          border-top:9px solid transparent; border-bottom:9px solid transparent; transform:translateY(-50%); z-index:2; }
        .acl-sp__node .ni{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          color:rgba(22,21,15,.5); }
        .acl-sp__node .nn{ font-weight:900; font-size:30px; line-height:1.04; margin-top:4px; }
        .acl-sp__node .ne{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.03em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:4px; }
        .acl-sp__node--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateY(-6px);
          box-shadow:6px 10px 0 rgba(22,21,15,.18); }
        .acl-sp__node--focus .ni, .acl-sp__node--focus .ne{ color:rgba(255,255,255,.6); }
        .acl-sp__node--dim{ opacity:.5; }

        .acl-sp__body{ flex:1; display:flex; gap:44px; margin-top:30px; min-height:0; }

        /* share ring cards (left) */
        .acl-sp__shares{ flex:0 0 560px; display:flex; flex-direction:column; gap:18px; }
        .acl-sp__card{ flex:1; display:flex; align-items:center; gap:26px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:6px 8px 0 rgba(22,21,15,.14); padding:18px 28px; }
        .acl-sp__ring{ flex:0 0 132px; position:relative; }
        .acl-sp__ringsvg{ width:132px; height:132px; display:block; }
        .acl-sp__ringval{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-num); font-size:42px; }
        .acl-sp__ringval em{ font-style:normal; font-size:20px; margin-left:1px; opacity:.6; }
        .acl-sp__cardtxt .cn{ font-weight:900; font-size:34px; line-height:1.04; }
        .acl-sp__cardtxt .ce{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:5px; }
        .acl-sp__cardtxt .cd{ font-weight:700; font-size:18px; line-height:1.35; color:rgba(22,21,15,.62);
          margin-top:8px; max-width:300px; }

        /* collage stage (right) */
        .acl-sp__stage{ flex:1; position:relative; min-width:0; }
        .acl-sp__slot{ position:absolute; }
        .acl-sp__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        .acl-sp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-sp__node{ animation:acl-sp-pop .42s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .15s); }
          [data-deck-active] .acl-sp__card{ animation:acl-sp-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--j,0) * .1s + .4s); }
          [data-deck-active] .acl-sp__arc{ animation:acl-sp-draw 1s ease both; }
        }
        @keyframes acl-sp-pop{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
        @keyframes acl-sp-rise{ from{ opacity:0; transform:translateX(-16px); } to{ opacity:1; transform:none; } }
        @keyframes acl-sp-draw{ from{ stroke-dashoffset:var(--c); } }
      `}</style>

      <div className="acl-sp__head">
        <div>
          <div className="acl-sp__eyebrow">{eyebrow}</div>
          <h1 className="acl-sp__h">{headline}</h1>
        </div>
        <div className="acl-sp__sub">{subheadline}</div>
        <div className="acl-sp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      {showChain && (
        <div className="acl-sp__chain">
          {nodes.map((nd, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            return (
              <div key={i} className={'acl-sp__node' + (isF ? ' acl-sp__node--focus' : '') + (dim ? ' acl-sp__node--dim' : '')}
                style={{ '--i': i }}>
                <div className="ni">{String(i + 1).padStart(2, '0')}</div>
                <div className="nn">{nd.t}</div>
                <div className="ne">{nd.s}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="acl-sp__body">
        {/* ── share ring cards (left) ── */}
        <div className="acl-sp__shares">
          {cards.map((c, i) => {
            const R = 56, C = 2 * Math.PI * R, dash = (c.v / 100) * C;
            const col = palette[i % palette.length];
            return (
              <div key={i} className="acl-sp__card" style={{ '--j': i }}>
                <div className="acl-sp__ring">
                  <svg className="acl-sp__ringsvg" viewBox="0 0 132 132">
                    <circle cx="66" cy="66" r={R} fill="none" stroke="rgba(22,21,15,.12)" strokeWidth="15" />
                    <circle className="acl-sp__arc" cx="66" cy="66" r={R} fill="none" stroke={col} strokeWidth="15"
                      strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset="0" strokeLinecap="butt"
                      transform="rotate(-90 66 66)" style={{ '--c': dash }} />
                  </svg>
                  {showValueLabels && <div className="acl-sp__ringval">{c.v}<em>%</em></div>}
                </div>
                <div className="acl-sp__cardtxt">
                  <div className="cn">{c.k}</div>
                  <div className="ce">{c.en}</div>
                  <div className="cd">{c.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── adaptive image collage (right) ── */}
        <div className="acl-sp__stage">
          {slots.length === 0 && <div className="acl-sp__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-sp__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'supply-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'数据场景 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <div style={{ position: 'absolute', right: 4, top: 0, zIndex: 4, transform: 'rotate(-6deg)' }}>
                <Sticker label="稀缺资源" sub="SCARCE" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={19} />
              </div>
              <Doodle kind="arrow" size={80} rotate={118} color="var(--acl-ink)" style={{ left: -8, top: '42%' }} />
              <Doodle kind="spark" size={40} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 30, bottom: 110 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-sp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page36Supply.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 2,           // 0–3 adaptive image slots
  chainCount: 5,           // 3–5 supply-chain nodes
  shareCount: 2,           // 2–3 share ring cards
  showChain: true,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 3,           // highlight 合成数据
  showDecor: true,
  eyebrow: 'Data Labeling',
  headline: '高质量数据供给',
  subheadline: '数据标注与合成数据',
  summary: '高质量训练与反馈数据，仍是模型能力提升的<b>关键瓶颈</b>。',
  // supply-chain nodes — text not parameterized (count via chainCount)
  chain: [
    { t: '数据采集', s: 'Collect' },
    { t: '清洗治理', s: 'Clean' },
    { t: '人工标注', s: 'Label' },
    { t: '合成数据', s: 'Synthetic' },
    { t: '反馈回流', s: 'Feedback' },
  ],
  shares: [
    { k: '合成数据', en: 'Synthetic Data', v: 42, desc: '规模化、低成本扩充训练样本。' },
    { k: '人类反馈数据', en: 'Human Feedback', v: 35, desc: 'RLHF 对齐与质量校准的核心来源。' },
    { k: '第三方采购', en: 'Third-party', v: 23, desc: '行业语料与许可数据补充。' },
  ],
  // count-driven collage presets — stage ≈ 760×500; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 120, t: 24, box: 440, r: -3, ratio: 1.3, sr: -4, color: 'var(--acl-yellow)', label: '标注场景', sub: 'LABEL' },
    ],
    2: [
      { l: 6, t: 0, box: 380, r: -4, ratio: 1.22, sr: -4, color: 'var(--acl-yellow)', label: '标注场景', sub: 'LABEL' },
      { l: 360, t: 138, box: 372, r: 4, ratio: 0.86, sr: 3, color: 'var(--acl-blue)', label: '合成流水', sub: 'SYNTH' },
    ],
    3: [
      { l: 178, t: 0, box: 332, r: 3, ratio: 0.94, sr: -4, color: 'var(--acl-yellow)', label: '标注场景', sub: 'LABEL' },
      { l: 0, t: 168, box: 300, r: -5, ratio: 1.22, sr: 4, color: 'var(--acl-blue)', label: '合成流水', sub: 'SYNTH' },
      { l: 350, t: 196, box: 300, r: 5, ratio: 0.84, sr: -3, color: 'var(--acl-pink)', label: '反馈回流', sub: 'RLHF' },
    ],
  },
  closingLine: '数据越稀缺，数据基础设施越有价值。',
};

Page36Supply.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'chainCount', type: 'number', default: 5, min: 3, max: 5, step: 1,
    label: '供应链节点', desc: '数据供应链的节点数量(3–5)' },
  { key: 'shareCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '占比卡数量', desc: '占比环卡数量(2–3)' },
  { key: 'showChain', type: 'boolean', default: true,
    label: '供应链', desc: '顶部数据供应链的显示/隐藏' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '占比环卡中心百分比的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个供应链节点(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 4, step: 1, maxFrom: 'chainCount',
    label: '重点对象', desc: '被高亮的供应链节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page36Supply.defaults;
export const controls = Page36Supply.controls;
