// Page29Portal.jsx — "Knowledge Portal" template page (image-led, editorial rail)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-kp-`.
// A flipped image-led layout: LEFT a count-driven collage of AdaptiveImageSlots
// (0–4) that each resize to their uploaded photo's aspect ratio, RIGHT an open
// editorial stat rail (no card) — a hero figure, count-driven metric rows, and
// an optional ratio meter. Distinct from the bordered "panel" image pages.
// Fully portable — no dependency on the Tweaks panel; all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page29Portal(props) {
  const p = { ...Page29Portal.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, showMeter, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary,
    hero, metrics, meter, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const rows = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, rows.length - 1);
  const slots = collage[mediaCount] || [];

  return (
    <div className="acl-root acl-kp" style={{ background: bg }}>
      <style>{`
        .acl-kp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 70px; display:flex; flex-direction:column; }
        .acl-kp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-kp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-kp__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-kp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-kp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-kp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-kp__body{ flex:1; display:flex; gap:54px; margin-top:30px; min-height:0; }

        /* collage stage (left) */
        .acl-kp__stage{ flex:1; position:relative; min-width:0; }
        .acl-kp__slot{ position:absolute; }
        .acl-kp__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        /* editorial stat rail (right) */
        .acl-kp__rail{ flex:0 0 600px; position:relative; display:flex; flex-direction:column; }
        .acl-kp__hero{ border-top:5px solid var(--acl-ink); padding-top:14px; }
        .acl-kp__herolabel{ font-weight:700; font-size:22px; color:rgba(22,21,15,.6);
          display:flex; align-items:center; gap:12px; }
        .acl-kp__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:17px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-pink); color:var(--acl-paper); }
        .acl-kp__heronum{ font-family:var(--acl-font-num); font-size:210px; line-height:.8; margin-top:4px; }
        .acl-kp__rows{ margin-top:26px; display:flex; flex-direction:column; }
        .acl-kp__row{ display:flex; align-items:baseline; gap:18px; padding:15px 4px;
          border-top:2px solid rgba(22,21,15,.3); transition:.25s; }
        .acl-kp__row .k{ flex:1; font-weight:700; font-size:24px; }
        .acl-kp__row .ken{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); display:block; margin-top:2px; }
        .acl-kp__row .v{ font-family:var(--acl-font-num); font-size:56px; line-height:.85; }
        .acl-kp__row .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; opacity:.6; }
        .acl-kp__row--focus{ margin:0 -16px; padding:15px 16px; background:var(--acl-ink); color:var(--acl-paper);
          border-top-color:transparent; }
        .acl-kp__row--focus .ken{ color:rgba(255,255,255,.5); }
        .acl-kp__fx{ position:absolute; right:-6px; z-index:5; }
        .acl-kp__meter{ margin-top:auto; padding-top:22px; }
        .acl-kp__meterhd{ display:flex; justify-content:space-between; align-items:baseline;
          font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.06em; text-transform:uppercase;
          color:rgba(22,21,15,.55); margin-bottom:8px; }
        .acl-kp__meterhd b{ font-family:var(--acl-font-num); font-size:36px; color:var(--acl-ink);
          letter-spacing:0; text-transform:none; }
        .acl-kp__track{ height:26px; background:var(--acl-paper); border:3px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-kp__fill{ position:absolute; inset:0 auto 0 0; background:var(--acl-blue);
          border-right:3px solid var(--acl-ink); }

        .acl-kp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-kp__heronum{ animation:acl-kp-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-kp__row{ animation:acl-kp-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .15s); }
          [data-deck-active] .acl-kp__fill{ animation:acl-kp-grow .8s cubic-bezier(.2,.8,.2,1) .4s both; }
        }
        @keyframes acl-kp-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
        @keyframes acl-kp-in{ from{ opacity:0; transform:translateX(16px); } to{ opacity:1; transform:none; } }
        @keyframes acl-kp-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:scaleX(1); } }
      `}</style>

      <div className="acl-kp__head">
        <div>
          <div className="acl-kp__eyebrow">{eyebrow}</div>
          <h1 className="acl-kp__h">{headline}</h1>
        </div>
        <div className="acl-kp__sub">{subheadline}</div>
        <div className="acl-kp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-kp__body">
        {/* ── adaptive image collage (left) ── */}
        <div className="acl-kp__stage">
          {slots.length === 0 && <div className="acl-kp__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-kp__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'portal-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'知识场景 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <div style={{ position: 'absolute', left: 2, top: -6, zIndex: 6, transform: 'rotate(-5deg)' }}>
                <Sticker label="高频入口" sub="DAILY" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={20} />
              </div>
              <Doodle kind="arrow" size={88} rotate={64} color="var(--acl-ink)" style={{ right: -30, top: '42%' }} />
              <Doodle kind="spark" size={40} rotate={10} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ left: 30, bottom: 40 }} />
            </React.Fragment>
          )}
        </div>

        {/* ── editorial stat rail (right) ── */}
        <div className="acl-kp__rail">
          {showDecor && (
            <Doodle kind="spark" size={48} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 0, top: -34 }} />
          )}
          <div className="acl-kp__hero">
            <div className="acl-kp__herolabel">{hero.label}<i className="acl-kp__unit">{hero.unit}</i></div>
            <div className="acl-kp__heronum">{hero.value}</div>
          </div>
          <div className="acl-kp__rows">
            {rows.map((m, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-kp__row' + (isF ? ' acl-kp__row--focus' : '')} style={{ '--i': i, position: 'relative' }}>
                  {isF && showDecor && <div className="acl-kp__fx" style={{ top: -16 }}><Sticker label="付费场景" color="var(--acl-yellow)" rotate={6} /></div>}
                  <div className="k">{m.k}<span className="ken">{m.en}</span></div>
                  <div className="v">{m.v}<em>{m.unit}</em></div>
                </div>
              );
            })}
          </div>
          {showMeter && (
            <div className="acl-kp__meter">
              <div className="acl-kp__meterhd"><span>{meter.label}</span><b>{meter.value}%</b></div>
              <div className="acl-kp__track"><div className="acl-kp__fill" style={{ right: `${100 - meter.value}%` }} /></div>
            </div>
          )}
        </div>
      </div>

      <div className="acl-kp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page29Portal.defaults = {
  backgroundTheme: 'primary',
  mediaCount: 3,           // 0–4 adaptive image slots
  metricCount: 3,          // 2–4 editorial metric rows
  showMeter: true,
  focusEnabled: true,
  focusIndex: 2,
  showDecor: true,
  eyebrow: 'Enterprise Search',
  headline: '知识入口机会',
  subheadline: '企业搜索赛道',
  summary: '企业搜索是较早形成<b>明确付费场景</b>的应用方向。',
  hero: { label: '赛道融资额', value: '38', unit: '亿美元' },
  metrics: [
    { k: '事件数', en: 'Deals', v: '9', unit: '笔' },
    { k: '平均单笔', en: 'Avg Ticket', v: '4.2', unit: '亿' },
    { k: '付费客户中位数', en: 'Median Paid', v: '620', unit: '家' },
  ],
  meter: { label: '内部知识接入采用率', value: 72 },
  // count-driven collage presets — stage ≈ 1040×720; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 200, t: 60, box: 620, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)', label: '知识库入口', sub: 'SEARCH' },
    ],
    2: [
      { l: 20, t: 10, box: 540, r: -4, ratio: 1.15, sr: -4, color: 'var(--acl-yellow)', label: '知识库入口', sub: 'SEARCH' },
      { l: 500, t: 320, box: 470, r: 4, ratio: 0.82, sr: 3, color: 'var(--acl-blue)', label: '检索结果', sub: 'RESULT' },
    ],
    3: [
      { l: 250, t: 0, box: 430, r: 3, ratio: 0.92, sr: -4, color: 'var(--acl-yellow)', label: '知识库入口', sub: 'SEARCH' },
      { l: 0, t: 248, box: 392, r: -5, ratio: 1.2, sr: 4, color: 'var(--acl-blue)', label: '检索结果', sub: 'RESULT' },
      { l: 470, t: 372, box: 372, r: 5, ratio: 0.84, sr: -3, color: 'var(--acl-pink)', label: '采用率', sub: 'ADOPT' },
    ],
    4: [
      { l: 6, t: 8, box: 380, r: -4, ratio: 0.96, sr: -4, color: 'var(--acl-yellow)', label: '知识库入口', sub: 'SEARCH' },
      { l: 412, t: 30, box: 340, r: 4, ratio: 1.15, sr: 3, color: 'var(--acl-blue)', label: '检索结果', sub: 'RESULT' },
      { l: 110, t: 380, box: 352, r: 4, ratio: 1.1, sr: -3, color: 'var(--acl-pink)', label: '采用率', sub: 'ADOPT' },
      { l: 540, t: 388, box: 336, r: -4, ratio: 0.82, sr: 4, color: 'var(--acl-paper)', label: '企业部署', sub: 'DEPLOY' },
    ],
  },
  closingLine: '企业知识入口是 AI 应用的重要落地点。',
};

Page29Portal.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '右侧编辑式指标行数量(2–4)' },
  { key: 'showMeter', type: 'boolean', default: true,
    label: '比例条', desc: '底部比例/采用率进度条的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一条指标行' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 3, step: 1, maxFrom: 'metricCount',
    label: '重点对象', desc: '被高亮的指标行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page29Portal.defaults;
export const controls = Page29Portal.controls;
