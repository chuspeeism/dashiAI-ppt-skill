// Page28Agent.jsx — "Segment Card" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-sg-`.
// Left: a bold segment panel anchored by one headline figure, a count-driven
// grid of metric tiles, and an optional horizontal workflow strip. Right: a
// count-driven collage of AdaptiveImageSlots (0–n) — each slot resizes to its
// uploaded photo's aspect ratio and the layout preset rebalances per count.
// No dependency on the Tweaks panel — portable ESM, all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page28Agent(props) {
  const p = { ...Page28Agent.defaults, ...props };
  const {
    backgroundTheme, mediaCount, metricCount, showFlow, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary,
    badge, hero, metrics, flow, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const fIdx = Math.min(focusIndex, tiles.length - 1);
  const slots = collage[mediaCount] || [];

  return (
    <div className="acl-root acl-sg" style={{ background: bg }}>
      <style>{`
        .acl-sg{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-sg__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-sg__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-sg__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-sg__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-sg__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-sg__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-sg__body{ flex:1; display:flex; gap:40px; margin-top:30px; min-height:0; }
        .acl-sg__panel{ flex:0 0 760px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:30px 40px 30px; display:flex; flex-direction:column; }
        .acl-sg__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-sg__herolabel{ font-weight:700; font-size:24px; color:rgba(22,21,15,.6); margin-top:22px;
          display:flex; align-items:center; gap:14px; }
        .acl-sg__unit{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          letter-spacing:.04em; padding:5px 11px; background:var(--acl-pink); color:var(--acl-paper); }
        .acl-sg__heronum{ font-family:var(--acl-font-num); font-size:186px; line-height:.82; margin-top:2px; }
        .acl-sg__tiles{ display:flex; gap:14px; margin-top:18px; }
        .acl-sg__tile{ flex:1; border:2px solid var(--acl-ink); padding:13px 16px 11px; transition:.25s; }
        .acl-sg__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-sg__tile .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.96; margin-top:3px; }
        .acl-sg__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }
        .acl-sg__tile--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-sg__tile--focus .k{ color:rgba(255,255,255,.55); }

        .acl-sg__flow{ margin-top:auto; padding-top:24px; }
        .acl-sg__flowhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:10px; }
        .acl-sg__steps{ display:flex; align-items:stretch; gap:0; }
        .acl-sg__step{ flex:1; position:relative; background:var(--acl-yellow); border:2px solid var(--acl-ink);
          padding:11px 8px 10px 22px; margin-left:-14px; display:flex; flex-direction:column;
          align-items:center; justify-content:center; clip-path:polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%); }
        .acl-sg__step:first-child{ margin-left:0; clip-path:polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%); padding-left:14px; }
        .acl-sg__step:last-child{ clip-path:polygon(0 0, 100% 0, 100% 100%, 0 100%, 14px 50%); }
        .acl-sg__step b{ font-weight:900; font-size:21px; line-height:1; }
        .acl-sg__step span{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.03em;
          color:rgba(22,21,15,.55); margin-top:3px; }
        .acl-sg__step:nth-child(even){ background:var(--acl-paper); }
        .acl-sg__step:last-child{ background:var(--acl-pink); color:var(--acl-paper); }
        .acl-sg__step:last-child span{ color:rgba(255,255,255,.7); }

        /* collage stage */
        .acl-sg__stage{ flex:1; position:relative; min-width:0; }
        .acl-sg__slot{ position:absolute; }
        .acl-sg__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }
        .acl-sg__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-sg__panel{ animation:acl-sg-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-sg__step{ animation:acl-sg-step .4s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .09s + .4s); }
        }
        @keyframes acl-sg-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-sg-step{ from{ opacity:0; transform:translateX(-12px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-sg__head">
        <div>
          <div className="acl-sg__eyebrow">{eyebrow}</div>
          <h1 className="acl-sg__h">{headline}</h1>
        </div>
        <div className="acl-sg__sub">{subheadline}</div>
        <div className="acl-sg__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-sg__body">
        {/* ── segment stat panel ── */}
        <div className="acl-sg__panel">
          <div className="acl-sg__badge">◆ {badge}</div>
          {showDecor && (
            <div style={{ position: 'absolute', right: 30, top: 26 }}>
              <Doodle kind="spark" size={50} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />
            </div>
          )}
          <div className="acl-sg__herolabel">{hero.label}<i className="acl-sg__unit">{hero.unit}</i></div>
          <div className="acl-sg__heronum">{hero.value}</div>
          <div className="acl-sg__tiles">
            {tiles.map((m, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-sg__tile' + (isF ? ' acl-sg__tile--focus' : '')}>
                  <div className="k">{m.k}</div>
                  <div className="v">{m.v}<em>{m.unit}</em></div>
                </div>
              );
            })}
          </div>
          {showFlow && (
            <div className="acl-sg__flow">
              <div className="acl-sg__flowhd">Agent 工作流 · Workflow</div>
              <div className="acl-sg__steps">
                {flow.map((s, i) => (
                  <div key={i} className="acl-sg__step" style={{ '--i': i }}>
                    <b>{s.t}</b><span>{s.s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── adaptive image collage ── */}
        <div className="acl-sg__stage">
          {slots.length === 0 && <div className="acl-sg__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-sg__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'agent-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'Agent 场景 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && (
            <React.Fragment>
              <div style={{ position: 'absolute', right: 4, top: 8, zIndex: 4, transform: 'rotate(-6deg)' }}>
                <Sticker label="可计费流程" sub="BILLABLE" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={20} />
              </div>
              <Doodle kind="arrow" size={88} rotate={118} color="var(--acl-ink)" style={{ left: -6, top: '44%' }} />
              <Doodle kind="spark" size={42} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ right: 36, bottom: 130 }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-sg__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page28Agent.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 2,           // 0–3 adaptive image slots
  metricCount: 3,          // 2–3 supporting metric tiles
  showFlow: true,
  focusEnabled: true,
  focusIndex: 2,           // highlight the ARR tile by default
  showDecor: true,
  eyebrow: 'AI Agents',
  headline: '工作流自动化机会',
  subheadline: 'AI Agent 赛道',
  summary: 'Agent 公司以<b>任务执行与工作流自动化</b>作为核心卖点。',
  badge: 'AI Agents · 工作流自动化',
  hero: { label: '赛道融资额', value: '72', unit: '亿美元' },
  metrics: [
    { k: '事件数', v: '16', unit: '笔' },
    { k: '平均单笔', v: '4.5', unit: '亿' },
    { k: 'ARR 中位数', v: '4200', unit: '万' },
  ],
  // workflow chevrons — text not parameterized (toggled via showFlow)
  flow: [
    { t: '接收任务', s: 'Intake' },
    { t: '规划', s: 'Plan' },
    { t: '调用工具', s: 'Tools' },
    { t: '执行交付', s: 'Deliver' },
  ],
  // count-driven collage presets — stage ≈ 900×720; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 210, t: 70, box: 540, r: -3, ratio: 1.25, sr: -4, color: 'var(--acl-yellow)', label: 'Agent 场景', sub: 'DEMO' },
    ],
    2: [
      { l: 14, t: 6, box: 470, r: -4, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)', label: 'Agent 场景', sub: 'DEMO' },
      { l: 438, t: 288, box: 452, r: 4, ratio: 0.82, sr: 3, color: 'var(--acl-blue)', label: '工作流', sub: 'FLOW' },
    ],
    3: [
      { l: 252, t: 0, box: 398, r: 3, ratio: 0.9, sr: -4, color: 'var(--acl-yellow)', label: 'Agent 场景', sub: 'DEMO' },
      { l: 0, t: 246, box: 364, r: -5, ratio: 1.22, sr: 4, color: 'var(--acl-blue)', label: '工作流', sub: 'FLOW' },
      { l: 472, t: 402, box: 346, r: 5, ratio: 0.82, sr: -3, color: 'var(--acl-pink)', label: '可计费', sub: 'ARR' },
    ],
  },
  closingLine: '能进入工作流的 Agent 才有长期价值。',
};

Page28Agent.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 3, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–3)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主卡内支撑指标格数量(2–3)' },
  { key: 'showFlow', type: 'boolean', default: true,
    label: '流程示意', desc: '底部工作流步骤条的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个支撑指标' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 2, step: 1, maxFrom: 'metricCount',
    label: '重点对象', desc: '被高亮的指标序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page28Agent.defaults;
export const controls = Page28Agent.controls;
