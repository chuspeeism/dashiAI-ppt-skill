// Page78Workflow.jsx — "Vertical Strategy · Workflow Embed" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-vs-`.
// A NEW image layout: a VERTICAL "rigid workflow" spine on the left whose focus
// stage bulges out as the "AI embed point", paired on the right with a
// count-driven adaptive scene COLLAGE (each photo slot tagged with a scene
// sticker), a wrapped row of scene chips, and a watch-metric checklist strip.
// Image slots are 0–n and self-size to each uploaded photo's aspect ratio.
// Pure ESM — no Tweaks/preview-runtime dependency; every variation is a prop.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page78Workflow(props) {
  const p = { ...Page78Workflow.defaults, ...props };
  const {
    backgroundTheme, stageCount, mediaCount, sceneCount, metricCount, showScenes,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, railTitle, stages, scenes, metrics, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const rail = stages.slice(0, Math.max(3, stageCount));
  const fIdx = Math.min(focusIndex, rail.length - 1);
  const chips = scenes.slice(0, Math.max(2, sceneCount));
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = collage[mediaCount] || [];
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];

  return (
    <div className="acl-root acl-vs" style={{ background: bg }}>
      <style>{`
        .acl-vs{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 60px; display:flex; flex-direction:column; }
        .acl-vs__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-vs__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-vs__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-vs__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-vs__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-vs__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-vs__body{ flex:1; display:flex; gap:48px; margin-top:28px; min-height:0; }

        /* ── left: vertical workflow rail ── */
        .acl-vs__rail{ flex:0 0 600px; position:relative; padding-left:44px; display:flex;
          flex-direction:column; justify-content:center; gap:0; min-width:0; }
        .acl-vs__railt{ position:absolute; top:0; left:44px; font-family:var(--acl-font-mono);
          font-weight:700; font-size:14px; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(22,21,15,.5); }
        .acl-vs__spine{ position:absolute; left:19px; top:54px; bottom:14px; width:4px;
          background:repeating-linear-gradient(var(--acl-ink) 0 12px, transparent 12px 22px); }
        .acl-vs__stage{ position:relative; display:flex; align-items:center; gap:22px;
          padding:13px 0; transition:transform .25s; }
        .acl-vs__node{ position:absolute; left:-44px; width:38px; height:38px; border-radius:50%;
          background:var(--acl-paper); border:4px solid var(--acl-ink); display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:18px; line-height:1; z-index:2; }
        .acl-vs__slab{ flex:1; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 6px 0 rgba(22,21,15,.14); padding:16px 24px; display:flex; align-items:center;
          gap:18px; min-width:0; transition:background .25s, transform .25s, box-shadow .25s; }
        .acl-vs__sname{ font-weight:900; font-size:32px; line-height:1; }
        .acl-vs__sen{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-left:auto; }
        .acl-vs__stage--embed .acl-vs__slab{ background:var(--acl-ink); color:var(--acl-paper);
          transform:translateX(26px) scale(1.02); box-shadow:8px 10px 0 rgba(22,21,15,.28); }
        .acl-vs__stage--embed .acl-vs__sen{ color:rgba(255,255,255,.55); }
        .acl-vs__stage--embed .acl-vs__node{ background:var(--acl-pink); border-color:var(--acl-ink); color:var(--acl-paper); }
        .acl-vs__embed{ flex:0 0 auto; font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.06em; text-transform:uppercase; background:var(--acl-yellow); color:var(--acl-ink);
          padding:5px 10px; }
        .acl-vs__efx{ position:absolute; right:-8px; top:-14px; z-index:5; }

        /* ── right: scenes + collage + metrics ── */
        .acl-vs__right{ flex:1; min-width:0; display:flex; flex-direction:column; }
        .acl-vs__scenes{ flex:0 0 auto; display:flex; align-items:center; flex-wrap:wrap; gap:11px;
          margin-bottom:6px; }
        .acl-vs__sclab{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.08em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-right:4px; }
        .acl-vs__chip{ font-family:var(--acl-font-cn); font-weight:700; font-size:21px;
          padding:6px 15px; background:var(--acl-paper); border:2.5px solid var(--acl-ink);
          box-shadow:2px 3px 0 rgba(22,21,15,.18); }
        .acl-vs__stage2{ flex:1; position:relative; min-height:0; }
        .acl-vs__slot{ position:absolute; }
        .acl-vs__noimg{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:30px; color:rgba(22,21,15,.4); }
        .acl-vs__metrics{ flex:0 0 auto; display:flex; gap:14px; border-top:2px dashed rgba(22,21,15,.25);
          padding-top:16px; margin-top:8px; }
        .acl-vs__tile{ flex:1; display:flex; align-items:center; gap:12px; min-width:0; }
        .acl-vs__tick{ flex:0 0 auto; width:30px; height:30px; background:var(--acl-ink);
          color:var(--acl-yellow); display:grid; place-items:center; font-family:var(--acl-font-num);
          font-size:17px; transform:rotate(45deg); }
        .acl-vs__tick span{ transform:rotate(-45deg); }
        .acl-vs__ttxt{ display:flex; flex-direction:column; gap:0; min-width:0; }
        .acl-vs__ttxt b{ font-weight:900; font-size:23px; line-height:1.04; }
        .acl-vs__ttxt span{ font-family:var(--acl-font-mono); font-size:11px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }

        .acl-vs__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-vs__stage{ animation:acl-vs-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .15s); }
          [data-deck-active] .acl-vs__chip{ animation:acl-vs-pop .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .05s + .3s); }
          [data-deck-active] .acl-vs__tile{ animation:acl-vs-pop .45s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .4s); }
        }
        @keyframes acl-vs-in{ from{ opacity:0; transform:translateX(-18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-vs-pop{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-vs__head">
        <div>
          <div className="acl-vs__eyebrow">{eyebrow}</div>
          <h1 className="acl-vs__h">{headline}</h1>
        </div>
        <div className="acl-vs__sub">{subheadline}</div>
        <div className="acl-vs__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-vs__body">
        {/* left: rigid workflow with embed point */}
        <div className="acl-vs__rail">
          <div className="acl-vs__railt">{railTitle}</div>
          <div className="acl-vs__spine" />
          {rail.map((s, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-vs__stage' + (isF ? ' acl-vs__stage--embed' : '')} style={{ '--i': i }}>
                <span className="acl-vs__node">{String(i + 1).padStart(2, '0')}</span>
                {isF && showDecor && <div className="acl-vs__efx"><Doodle kind="arrowS" size={52} rotate={-20} color="var(--acl-ink)" style={{ position: 'static' }} /></div>}
                <div className="acl-vs__slab">
                  <span className="acl-vs__sname">{s.name}</span>
                  {isF && <span className="acl-vs__embed">AI 嵌入</span>}
                  <span className="acl-vs__sen">{s.en}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* right: scene chips + adaptive collage + metric checklist */}
        <div className="acl-vs__right">
          {showScenes && (
            <div className="acl-vs__scenes">
              <span className="acl-vs__sclab">落地场景</span>
              {chips.map((c, i) => <span key={i} className="acl-vs__chip" style={{ '--i': i }}>{c}</span>)}
            </div>
          )}
          <div className="acl-vs__stage2">
            {slots.length === 0 && <div className="acl-vs__noimg">— 无图片 · mediaCount 0 —</div>}
            {slots.map((s, i) => (
              <div className="acl-vs__slot" key={i} style={{ left: s.l, top: s.t }}>
                <AdaptiveImageSlot id={'wf-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                  accent={s.accent} placeholder={chips[i] || s.ph}
                  sticker={{ label: chips[i] || s.ph, color: accents[i % accents.length], rotate: i % 2 ? 3 : -4 }} />
              </div>
            ))}
            {showDecor && slots.length > 0 && <Doodle kind="spark" size={44} rotate={-10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ right: 10, top: -6 }} />}
          </div>
          <div className="acl-vs__metrics">
            {tiles.map((m, i) => (
              <div key={i} className="acl-vs__tile" style={{ '--i': i }}>
                <span className="acl-vs__tick"><span>✓</span></span>
                <div className="acl-vs__ttxt"><b>{m.name}</b><span>{m.en}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-vs__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + collage presets (count → balanced slot configs) ────────
Page78Workflow.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  stageCount: 4,               // 3–5 workflow stages
  mediaCount: 2,               // 0–4 scene photo slots (adaptive)
  sceneCount: 5,               // 2–5 scene chips
  metricCount: 4,              // 2–4 watch-metric checklist tiles
  showScenes: true,            // scene chip row show/hide
  focusEnabled: true,
  focusIndex: 1,               // which stage is the AI embed point
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Vertical Strategy',
  headline: '嵌入工作流',
  subheadline: '策略 · 筛选垂直应用',
  summary: '应用要看是否嵌入 <b>刚性流程</b>，而非只看生成效果。',
  railTitle: '刚性流程 · Workflow',
  stages: [
    { name: '数据接入', en: 'Intake' },
    { name: '流程处理', en: 'Process' },
    { name: '结果交付', en: 'Deliver' },
    { name: '计费结算', en: 'Billing' },
    { name: '复盘优化', en: 'Review' },
  ],
  scenes: ['法律', '医疗', '客服', '企业搜索', '开发者工具'],
  metrics: [
    { name: '付费留存', en: 'Retention' },
    { name: '使用频次', en: 'Frequency' },
    { name: '席位扩张', en: 'Seat Expansion' },
    { name: '净收入留存', en: 'NRR' },
  ],
  collage: {
    0: [],
    1: [
      { l: 250, t: 30, box: 400, r: -3, ratio: 1.35, accent: 'var(--acl-paper)', ph: '场景图' },
    ],
    2: [
      { l: 40, t: 20, box: 380, r: -4, ratio: 1.3, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 470, t: 130, box: 340, r: 4, ratio: 0.92, accent: 'var(--acl-paper)', ph: '场景图' },
    ],
    3: [
      { l: 20, t: 10, box: 320, r: -4, ratio: 1.2, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 380, t: 90, box: 280, r: 4, ratio: 0.92, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 660, t: 30, box: 270, r: -3, ratio: 1.1, accent: 'var(--acl-paper)', ph: '场景图' },
    ],
    4: [
      { l: 10, t: 4, box: 280, r: -4, ratio: 1.18, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 320, t: 96, box: 250, r: 4, ratio: 0.92, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 590, t: 18, box: 250, r: -3, ratio: 1.12, accent: 'var(--acl-paper)', ph: '场景图' },
      { l: 700, t: 220, box: 220, r: 5, ratio: 0.86, accent: 'var(--acl-paper)', ph: '场景图' },
    ],
  },
  closingLine: '应用价值来自它在流程里的位置。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page78Workflow.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'stageCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '流程阶段数', desc: '左侧刚性流程的阶段数量(3–5)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '场景拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'showScenes', type: 'boolean', default: true,
    label: '场景标签', desc: '右上方落地场景标签行 显隐' },
  { key: 'sceneCount', type: 'number', default: 5, min: 2, max: 5, step: 1, showIf: 'showScenes',
    label: '场景数量', desc: '落地场景标签数量(2–5)' },
  { key: 'metricCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '关注指标数', desc: '底部关注指标清单数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一流程阶段为 AI 嵌入点' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 4, step: 1, maxFrom: 'stageCount',
    label: '重点对象', desc: '被标记为 AI 嵌入点的阶段序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page78Workflow.defaults;
export const controls = Page78Workflow.controls;
