// Page43Education.jsx — "Learning Path" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ed-`.
// A NEW image layout: an ASCENDING learning-path of scene cards (0–4), each
// rising step-by-step and carrying its own AdaptiveImageSlot that resizes to the
// uploaded photo's ratio, linked by optional hand-drawn path arrows. A left hero
// panel anchors the figure + metric tiles. One card focusable. No dependency on
// the Tweaks panel — portable ESM, prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page43Education(props) {
  const p = { ...Page43Education.defaults, ...props };
  const {
    backgroundTheme, cardCount, showPath, showValue, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, metrics,
    scenes, valueUnit, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const cards = scenes.slice(0, Math.max(0, Math.min(4, cardCount)));
  const fIdx = Math.min(focusIndex, Math.max(0, cards.length - 1));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const palette = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)'];
  const box = cards.length <= 2 ? 320 : cards.length === 3 ? 268 : 222;
  const STEP = cards.length > 1 ? 116 / (cards.length - 1) : 0; // vertical rise per card (% of available)

  return (
    <div className="acl-root acl-ed" style={{ background: bg }}>
      <style>{`
        .acl-ed{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 64px; display:flex; flex-direction:column; }
        .acl-ed__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-ed__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ed__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-ed__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ed__summary{ margin-left:auto; max-width:470px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ed__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ed__body{ flex:1; display:flex; gap:40px; margin-top:26px; min-height:0; }

        /* ── left hero panel ── */
        .acl-ed__panel{ flex:0 0 470px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 36px 28px; display:flex; flex-direction:column; }
        .acl-ed__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-ed__herolabel{ font-weight:700; font-size:22px; color:rgba(22,21,15,.6); margin-top:20px;
          display:flex; align-items:center; gap:14px; }
        .acl-ed__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-pink); color:var(--acl-paper); }
        .acl-ed__heronum{ font-family:var(--acl-font-num); font-size:176px; line-height:.78; margin-top:2px; }
        .acl-ed__tiles{ display:flex; gap:14px; margin-top:auto; }
        .acl-ed__tile{ flex:1; border:2px solid var(--acl-ink); padding:13px 16px 11px; }
        .acl-ed__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-ed__tile .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.96; margin-top:3px; }
        .acl-ed__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }

        /* ── path stage ── */
        .acl-ed__stage{ flex:1; position:relative; min-width:0; display:flex; align-items:flex-end;
          justify-content:space-between; gap:18px; padding-top:30px; }
        .acl-ed__empty{ flex:1; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-3deg); }
        .acl-ed__card{ flex:1; position:relative; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:6px 8px 0 rgba(22,21,15,.16); padding:16px 14px 16px; display:flex; flex-direction:column;
          align-items:center; min-width:0; }
        .acl-ed__step{ position:absolute; top:-22px; left:-12px; z-index:6; width:50px; height:50px;
          border-radius:50%; background:var(--acl-ink); color:var(--acl-paper); display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:28px; transform:rotate(-6deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); }
        .acl-ed__imgzone{ width:100%; display:flex; align-items:center; justify-content:center; }
        .acl-ed__cmeta{ width:100%; text-align:center; margin-top:14px; }
        .acl-ed__cname{ font-weight:900; font-size:30px; line-height:1; }
        .acl-ed__cen{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:5px; }
        .acl-ed__cval{ font-family:var(--acl-font-num); font-size:60px; line-height:.82; margin-top:9px; }
        .acl-ed__cval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; opacity:.62; }
        .acl-ed__card--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-ed__card--focus .acl-ed__cen{ color:rgba(255,255,255,.55); }
        .acl-ed__card--focus .acl-ed__step{ background:var(--acl-yellow); color:var(--acl-ink); }
        .acl-ed__fx{ position:absolute; top:-20px; right:-10px; z-index:7; }
        .acl-ed__arrow{ position:absolute; z-index:5; }

        .acl-ed__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ed__panel{ animation:acl-ed-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-ed__card{ animation:acl-ed-rise .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .12s + .15s); }
        }
        @keyframes acl-ed-rise{ from{ opacity:0; transform:translateY(24px); } to{ opacity:1; } }
      `}</style>

      <div className="acl-ed__head">
        <div>
          <div className="acl-ed__eyebrow">{eyebrow}</div>
          <h1 className="acl-ed__h">{headline}</h1>
        </div>
        <div className="acl-ed__sub">{subheadline}</div>
        <div className="acl-ed__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ed__body">
        {/* ── hero panel ── */}
        <div className="acl-ed__panel">
          <div className="acl-ed__badge">✎ {badge}</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 28, top: 22 }}>
              <Sticker label="个性化" sub="ADAPTIVE" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={5} size={15} />
            </div>
          )}
          <div className="acl-ed__herolabel">{hero.label}<i className="acl-ed__unit">{hero.unit}</i></div>
          <div className="acl-ed__heronum">{hero.value}</div>
          <div className="acl-ed__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-ed__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ascending learning path ── */}
        <div className="acl-ed__stage">
          {cards.length === 0 && <div className="acl-ed__empty">// 场景数量 = 0</div>}
          {cards.map((s, i) => {
            const isF = focusEnabled && i === fIdx;
            const accent = palette[i % palette.length];
            const rise = (cards.length - 1 - i) * STEP; // first lowest → ascending right
            return (
              <div key={i} className={'acl-ed__card' + (isF ? ' acl-ed__card--focus' : '')}
                   style={{ '--i': i, marginBottom: `${rise}px` }}>
                <div className="acl-ed__step">{i + 1}</div>
                {isF && showDecor && <div className="acl-ed__fx"><Sticker label="重点" sub="FOCUS" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} size={14} /></div>}
                <div className="acl-ed__imgzone">
                  <AdaptiveImageSlot id={'education-' + i} box={box} rotate={i % 2 ? 2 : -2} ratio={s.ratio || 1.05}
                    accent={isF ? 'var(--acl-yellow)' : 'var(--acl-paper)'} placeholder={s.name}
                    sticker={{ label: s.tag, color: accent, subColor: 'var(--acl-ink)', rotate: i % 2 ? 3 : -3 }} />
                </div>
                <div className="acl-ed__cmeta">
                  <div className="acl-ed__cname">{s.name}</div>
                  <div className="acl-ed__cen">{s.en}</div>
                  {showValue && <div className="acl-ed__cval">{s.value}<em>{valueUnit}</em></div>}
                </div>
              </div>
            );
          })}
          {showPath && showDecor && cards.length > 1 && (
            <React.Fragment>
              <Doodle kind="arrow" size={64} rotate={-18} color="var(--acl-ink)"
                className="acl-ed__arrow" style={{ left: '30%', top: 0 }} />
              {cards.length > 2 && (
                <Doodle kind="arrowS" size={56} rotate={-8} color="var(--acl-ink)"
                  className="acl-ed__arrow" style={{ right: '30%', top: '8%' }} />
              )}
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-ed__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page43Education.defaults = {
  backgroundTheme: 'muted',
  cardCount: 3,            // 0–4 scene cards (each carries an adaptive image slot)
  showPath: true,          // hand-drawn path arrows between scenes
  showValue: true,         // big funding figure per scene
  metricCount: 3,          // 2–3 supporting metric tiles
  focusEnabled: true,
  focusIndex: 0,           // highlight K12 辅导 by default
  showDecor: true,
  eyebrow: 'Education AI',
  headline: '个性化学习与教师工具',
  subheadline: '教育 AI 赛道',
  summary: '教育 AI 从通用答疑转向<b>个性化辅导与教师工作台</b>。',
  badge: 'Education · 教育 AI',
  hero: { label: '赛道融资额', value: '14', unit: '亿' },
  metrics: [
    { k: '事件数', v: '5', unit: '笔' },
    { k: '平均单笔', v: '2.8', unit: '亿' },
    { k: 'K12 占比', v: '43', unit: '%' },
  ],
  // learning-path scenes — text not parameterized (count via cardCount)
  scenes: [
    { name: 'K12 辅导', en: 'K12 Tutoring', tag: '辅导', value: '6', ratio: 0.95 },
    { name: '企业培训', en: 'Corporate Training', tag: '培训', value: '5', ratio: 1.2 },
    { name: '教师工具', en: 'Teacher Tools', tag: '工具', value: '3', ratio: 0.9 },
    { name: '备考提分', en: 'Test Prep', tag: '备考', value: '2', ratio: 1.05 },
  ],
  valueUnit: '亿',
  closingLine: '教育 AI 需要用结果证明价值。',
};

Page43Education.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'cardCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '场景数量', desc: '学习路径场景卡数量(0–4)；每卡含一个图片槽，布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showPath', type: 'boolean', default: true,
    label: '路径连线', desc: '场景之间手绘路径箭头的显示/隐藏' },
  { key: 'showValue', type: 'boolean', default: true,
    label: '数值', desc: '每张场景卡的大号融资额的显示/隐藏' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主卡内支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某张场景卡' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'cardCount',
    label: '重点对象', desc: '被突出的场景卡序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page43Education.defaults;
export const controls = Page43Education.controls;
