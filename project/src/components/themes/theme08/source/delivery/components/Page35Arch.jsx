// Page35Arch.jsx — "Architecture Stack" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ar-`.
// LEFT a count-driven collage of AdaptiveImageSlots (0–4) that resize to their
// uploaded photo's ratio. RIGHT a spec panel: a hero figure, a vertical,
// count-driven ARCHITECTURE STACK (one layer focusable), and a row of metric
// tiles. Portable ESM — no dependency on the Tweaks panel; CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page35Arch(props) {
  const p = { ...Page35Arch.defaults, ...props };
  const {
    backgroundTheme, mediaCount, layerCount, metricCount, showArch, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, layers, metrics, collage, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const lyr = layers.slice(0, Math.max(3, layerCount));
  const fIdx = Math.min(focusIndex, lyr.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const slots = collage[mediaCount] || [];

  return (
    <div className="acl-root acl-ar" style={{ background: bg }}>
      <style>{`
        .acl-ar{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-ar__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-ar__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ar__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-ar__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ar__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ar__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ar__body{ flex:1; display:flex; gap:40px; margin-top:28px; min-height:0; }

        /* collage stage (left) */
        .acl-ar__stage{ flex:1; position:relative; min-width:0; }
        .acl-ar__slot{ position:absolute; }
        .acl-ar__empty{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-family:var(--acl-font-hand); font-size:34px; color:rgba(22,21,15,.4); transform:rotate(-4deg); }

        /* spec panel (right) */
        .acl-ar__panel{ flex:0 0 720px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:28px 36px 28px; display:flex; flex-direction:column; }
        .acl-ar__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-ar__herorow{ display:flex; align-items:flex-end; gap:18px; margin-top:18px; }
        .acl-ar__herorow .k{ font-weight:700; font-size:22px; color:rgba(22,21,15,.6); padding-bottom:14px; }
        .acl-ar__herorow .v{ font-family:var(--acl-font-num); font-size:120px; line-height:.78; white-space:nowrap; }
        .acl-ar__herorow .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:24px;
          margin-left:6px; opacity:.62; }

        .acl-ar__archhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin:22px 0 10px; }
        .acl-ar__stack{ display:flex; flex-direction:column; gap:8px; flex:1; min-height:0; justify-content:center; }
        .acl-ar__layer{ display:flex; align-items:center; gap:16px; border:2.5px solid var(--acl-ink);
          background:var(--acl-yellow); padding:12px 18px; transition:.25s; position:relative; }
        .acl-ar__layer:nth-child(even){ background:var(--acl-paper); }
        .acl-ar__lidx{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); flex:0 0 auto; }
        .acl-ar__lname{ flex:1; font-weight:900; font-size:27px; line-height:1; }
        .acl-ar__lname small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:11px;
          letter-spacing:.05em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:4px; }
        .acl-ar__lmeta{ font-family:var(--acl-font-num); font-size:34px; line-height:.8; flex:0 0 auto; }
        .acl-ar__lmeta em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:2px; opacity:.55; }
        .acl-ar__layer--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:translateX(6px);
          box-shadow:-6px 6px 0 rgba(22,21,15,.18); }
        .acl-ar__layer--focus .acl-ar__lidx, .acl-ar__layer--focus .acl-ar__lname small{ color:rgba(255,255,255,.55); }

        .acl-ar__tiles{ display:flex; gap:12px; margin-top:18px; }
        .acl-ar__tile{ flex:1; border:2px solid var(--acl-ink); padding:11px 14px 9px; }
        .acl-ar__tile .k{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-ar__tile .v{ font-family:var(--acl-font-num); font-size:40px; line-height:.96; margin-top:2px; }
        .acl-ar__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:2px; opacity:.6; }

        .acl-ar__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ar__panel{ animation:acl-ar-rise .55s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-ar__layer{ animation:acl-ar-slide .42s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .12s); }
        }
        @keyframes acl-ar-rise{ from{ opacity:0; transform:translateY(18px); } to{ opacity:1; transform:none; } }
        @keyframes acl-ar-slide{ from{ opacity:0; transform:translateX(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-ar__head">
        <div>
          <div className="acl-ar__eyebrow">{eyebrow}</div>
          <h1 className="acl-ar__h">{headline}</h1>
        </div>
        <div className="acl-ar__sub">{subheadline}</div>
        <div className="acl-ar__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ar__body">
        {/* ── adaptive image collage (left) ── */}
        <div className="acl-ar__stage">
          {slots.length === 0 && <div className="acl-ar__empty">// 图片数量 = 0</div>}
          {slots.map((s, i) => (
            <div className="acl-ar__slot" key={i} style={{ left: s.l, top: s.t }}>
              <AdaptiveImageSlot id={'arch-' + i} box={s.box} rotate={s.r} ratio={s.ratio}
                accent="var(--acl-paper)" placeholder={'架构示意 ' + (i + 1)}
                sticker={{ label: s.label, sub: s.sub, color: s.color, subColor: 'var(--acl-ink)', rotate: s.sr }} />
            </div>
          ))}
          {showDecor && slots.length > 0 && (
            <React.Fragment>
              <div style={{ position: 'absolute', left: 6, top: 4, zIndex: 4, transform: 'rotate(-5deg)' }}>
                <Sticker label="企业级可靠性" sub="RELIABLE" color="var(--acl-yellow)" subColor="var(--acl-ink)" rotate={0} size={19} />
              </div>
              <Doodle kind="arrow" size={84} rotate={64} color="var(--acl-ink)" style={{ right: -10, top: '46%' }} />
              <Doodle kind="spark" size={40} rotate={12} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ left: 24, bottom: 120 }} />
            </React.Fragment>
          )}
        </div>

        {/* ── spec panel (right) ── */}
        <div className="acl-ar__panel">
          <div className="acl-ar__badge">◰ {badge}</div>
          {showDecor && (
            <Doodle kind="spark" size={44} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 26, top: 22 }} />
          )}
          <div className="acl-ar__herorow">
            <span className="v">{hero.value}<em>{hero.unit}</em></span>
            <span className="k">{hero.label}</span>
          </div>

          {showArch && (
            <React.Fragment>
              <div className="acl-ar__archhd">RAG 组件栈 · Architecture</div>
              <div className="acl-ar__stack">
                {lyr.map((l, i) => {
                  const isF = focusEnabled && i === fIdx;
                  return (
                    <div key={i} className={'acl-ar__layer' + (isF ? ' acl-ar__layer--focus' : '')} style={{ '--i': i }}>
                      <span className="acl-ar__lidx">L{lyr.length - i}</span>
                      <div className="acl-ar__lname">{l.t}<small>{l.s}</small></div>
                      <div className="acl-ar__lmeta">{l.v}<em>{l.unit}</em></div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          )}

          <div className="acl-ar__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-ar__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-ar__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page35Arch.defaults = {
  backgroundTheme: 'muted',
  mediaCount: 3,           // 0–4 adaptive image slots
  layerCount: 5,           // 3–5 architecture stack layers
  metricCount: 3,          // 2–3 supporting metric tiles
  showArch: true,
  focusEnabled: true,
  focusIndex: 2,           // highlight 向量库
  showDecor: true,
  eyebrow: 'Vector Database',
  headline: 'RAG 基础组件',
  subheadline: '向量数据库',
  summary: '向量数据库从概念热度进入<b>企业部署竞争</b>阶段。',
  badge: 'Vector DB · RAG 基础组件',
  hero: { label: '赛道融资额', value: '18', unit: '亿美元' },
  // architecture stack — text not parameterized (count via layerCount, top→bottom)
  layers: [
    { t: '应用查询', s: 'Query', v: '高频', unit: '' },
    { t: '嵌入编码', s: 'Embedding', v: '多模', unit: '态' },
    { t: '向量库', s: 'Vector Store', v: '亿级', unit: '维' },
    { t: '检索召回', s: 'Retrieval', v: '低延', unit: '迟' },
    { t: '生成增强', s: 'Generation', v: '可溯', unit: '源' },
  ],
  metrics: [
    { k: '事件数', v: '5', unit: '笔' },
    { k: '平均单笔', v: '3.6', unit: '亿' },
    { k: '付费客户', v: '620', unit: '家' },
  ],
  // count-driven collage presets — stage ≈ 820×740; slot resizes to image ratio.
  collage: {
    0: [],
    1: [
      { l: 150, t: 70, box: 540, r: -3, ratio: 1.2, sr: -4, color: 'var(--acl-yellow)', label: '架构示意', sub: 'RAG' },
    ],
    2: [
      { l: 6, t: 8, box: 462, r: -4, ratio: 1.18, sr: -4, color: 'var(--acl-yellow)', label: '检索流程', sub: 'RAG' },
      { l: 400, t: 290, box: 444, r: 4, ratio: 0.82, sr: 3, color: 'var(--acl-blue)', label: '向量库', sub: 'STORE' },
    ],
    3: [
      { l: 226, t: 0, box: 392, r: 3, ratio: 0.9, sr: -4, color: 'var(--acl-yellow)', label: '检索流程', sub: 'RAG' },
      { l: 0, t: 240, box: 356, r: -5, ratio: 1.2, sr: 4, color: 'var(--acl-blue)', label: '向量库', sub: 'STORE' },
      { l: 430, t: 392, box: 338, r: 5, ratio: 0.82, sr: -3, color: 'var(--acl-pink)', label: '部署看板', sub: 'DEPLOY' },
    ],
    4: [
      { l: 8, t: 0, box: 332, r: -4, ratio: 0.92, sr: -4, color: 'var(--acl-yellow)', label: '检索流程', sub: 'RAG' },
      { l: 372, t: 30, box: 314, r: 4, ratio: 1.2, sr: 3, color: 'var(--acl-blue)', label: '向量库', sub: 'STORE' },
      { l: 40, t: 360, box: 320, r: 5, ratio: 1.16, sr: 4, color: 'var(--acl-pink)', label: '部署看板', sub: 'DEPLOY' },
      { l: 410, t: 396, box: 318, r: -4, ratio: 0.82, sr: -3, color: 'var(--acl-paper)', label: '集成生态', sub: 'INTEG' },
    ],
  },
  closingLine: '基础组件的胜负取决于企业级可靠性。',
};

Page35Arch.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'mediaCount', type: 'number', default: 3, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '拼贴图片槽数量(0–4)；布局随数量自动平衡，每槽按上传图片比例自适应' },
  { key: 'layerCount', type: 'number', default: 5, min: 3, max: 5, step: 1,
    label: '架构层数', desc: '架构栈的层数(3–5)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '主数字下方支撑指标格数量(2–3)' },
  { key: 'showArch', type: 'boolean', default: true,
    label: '架构栈', desc: '右侧组件架构栈的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一架构层' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 4, step: 1, maxFrom: 'layerCount',
    label: '重点对象', desc: '被高亮的架构层序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page35Arch.defaults;
export const controls = Page35Arch.controls;
