// Page46LowCode.jsx — "Process Strata" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-lc-`.
// A NEW image layout: a vertical stack of progressively-indented PROCESS STRATA
// bands (orchestration layers), each carrying an AdaptiveImageSlot thumbnail that
// resizes to its uploaded photo's ratio (mediaCount leading bands get a photo, the
// rest a numbered tile). A right stat rail anchors the hero figure + a highlighted
// retention metric. One stratum focusable. Portable ESM — no Tweaks dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

export default function Page46LowCode(props) {
  const p = { ...Page46LowCode.defaults, ...props };
  const {
    backgroundTheme, layerCount, mediaCount, showIndent, metricCount,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, badge, hero, retention, metrics,
    strataTitle, layers, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const bands = layers.slice(0, Math.max(2, layerCount));
  const fIdx = Math.min(focusIndex, bands.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const photos = Math.max(0, Math.min(bands.length, mediaCount));
  const palette = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-pink)', 'var(--acl-paper)'];

  return (
    <div className="acl-root acl-lc" style={{ background: bg }}>
      <style>{`
        .acl-lc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 58px; display:flex; flex-direction:column; }
        .acl-lc__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-lc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-lc__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-lc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-lc__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-lc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-lc__body{ flex:1; display:flex; gap:40px; margin-top:26px; min-height:0; }

        /* strata stack (left) */
        .acl-lc__stack{ flex:1; min-width:0; display:flex; flex-direction:column; }
        .acl-lc__stacktitle{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:12px; }
        .acl-lc__bands{ flex:1; display:flex; flex-direction:column; gap:14px; }
        .acl-lc__band{ flex:1; display:grid; grid-template-columns:auto 1fr auto; align-items:center;
          gap:24px; background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:5px 7px 0 rgba(22,21,15,.14); padding:12px 24px 12px 14px; position:relative;
          transition:background .25s, opacity .25s, transform .25s; }
        .acl-lc__thumb{ flex:0 0 auto; display:flex; align-items:center; }
        .acl-lc__numtile{ width:118px; height:118px; display:grid; place-items:center;
          border:3px solid var(--acl-ink); font-family:var(--acl-font-num); font-size:62px; color:var(--acl-ink); }
        .acl-lc__bmeta{ min-width:0; }
        .acl-lc__step{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.08em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-lc__bname{ font-weight:900; font-size:34px; line-height:1.02; margin-top:2px; }
        .acl-lc__bdesc{ font-weight:700; font-size:19px; color:rgba(22,21,15,.62); margin-top:5px; line-height:1.3; }
        .acl-lc__bnext{ flex:0 0 auto; }
        .acl-lc__band--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-lc__band--focus .acl-lc__step{ color:rgba(255,255,255,.55); }
        .acl-lc__band--focus .acl-lc__bdesc{ color:rgba(255,255,255,.72); }
        .acl-lc__band--focus .acl-lc__numtile{ border-color:var(--acl-yellow); color:var(--acl-yellow); }
        .acl-lc__band--dim{ opacity:.5; }
        .acl-lc__fx{ position:absolute; top:-15px; right:24px; z-index:5; }

        /* stat rail (right) */
        .acl-lc__rail{ flex:0 0 520px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:26px 36px 28px; display:flex; flex-direction:column; }
        .acl-lc__badge{ display:inline-flex; align-self:flex-start; align-items:center; gap:9px;
          font-family:var(--acl-font-mono); font-weight:700; font-size:18px; letter-spacing:.05em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-yellow); padding:9px 16px;  white-space:nowrap;}
        .acl-lc__hero{ margin-top:18px; }
        .acl-lc__herolabel{ font-weight:700; font-size:20px; color:rgba(22,21,15,.6); }
        .acl-lc__heronum{ font-family:var(--acl-font-num); font-size:150px; line-height:.76; margin-top:2px; }
        .acl-lc__heronum em{ font-style:normal; font-size:38px; margin-left:3px; }
        .acl-lc__ret{ margin-top:18px; border:3px solid var(--acl-ink); background:var(--acl-yellow);
          padding:16px 22px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .acl-lc__retk{ font-weight:900; font-size:22px; line-height:1.1; max-width:200px; }
        .acl-lc__retk small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.6); margin-top:4px; }
        .acl-lc__retv{ font-family:var(--acl-font-num); font-size:84px; line-height:.74; }
        .acl-lc__retv em{ font-style:normal; font-size:28px; }
        .acl-lc__tiles{ display:flex; gap:13px; margin-top:auto; padding-top:18px; }
        .acl-lc__tile{ flex:1; border-left:5px solid var(--acl-ink); padding-left:13px; }
        .acl-lc__tile .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-lc__tile .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.92; }
        .acl-lc__tile .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:3px; opacity:.6; }

        .acl-lc__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-lc__band{ animation:acl-lc-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .15s); }
          [data-deck-active] .acl-lc__rail{ animation:acl-lc-rise .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-lc-in{ from{ opacity:0; transform:translateX(-26px); } }
        @keyframes acl-lc-rise{ from{ opacity:0; transform:translateY(18px); } }
      `}</style>

      <div className="acl-lc__head">
        <div>
          <div className="acl-lc__eyebrow">{eyebrow}</div>
          <h1 className="acl-lc__h">{headline}</h1>
        </div>
        <div className="acl-lc__sub">{subheadline}</div>
        <div className="acl-lc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-lc__body">
        {/* ── process strata ── */}
        <div className="acl-lc__stack">
          <div className="acl-lc__stacktitle">{strataTitle} · Orchestration Layers</div>
          <div className="acl-lc__bands">
            {bands.map((b, i) => {
              const isF = focusEnabled && i === fIdx;
              const dim = focusEnabled && !isF;
              const indent = showIndent ? i * 38 : 0;
              const accent = palette[i % palette.length];
              return (
                <div key={i} className={'acl-lc__band' + (isF ? ' acl-lc__band--focus' : (dim ? ' acl-lc__band--dim' : ''))}
                     style={{ '--i': i, marginLeft: indent }}>
                  {isF && showDecor && <div className="acl-lc__fx"><Sticker label="治理就绪" sub="GOVERNED" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={5} size={13} /></div>}
                  <div className="acl-lc__thumb">
                    {i < photos ? (
                      <AdaptiveImageSlot id={'lowcode-' + i} box={118} rotate={i % 2 ? 2 : -2} ratio={b.ratio || 1}
                        accent={isF ? 'var(--acl-yellow)' : 'var(--acl-paper)'} placeholder={b.k} />
                    ) : (
                      <div className="acl-lc__numtile" style={{ background: isF ? 'transparent' : accent }}>{i + 1}</div>
                    )}
                  </div>
                  <div className="acl-lc__bmeta">
                    <div className="acl-lc__step">Layer {String(i + 1).padStart(2, '0')} · {b.en}</div>
                    <div className="acl-lc__bname">{b.k}</div>
                    <div className="acl-lc__bdesc">{b.desc}</div>
                  </div>
                  {i < bands.length - 1 && showDecor && (
                    <div className="acl-lc__bnext">
                      <Doodle kind="arrow" size={48} rotate={58} color={isF ? 'var(--acl-paper)' : 'var(--acl-ink)'} style={{ position: 'static' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── stat rail ── */}
        <div className="acl-lc__rail">
          <div className="acl-lc__badge">▤ {badge}</div>
          {showDecor && (
            <Doodle kind="spark" size={44} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
              style={{ right: 26, top: 22 }} />
          )}
          <div className="acl-lc__hero">
            <div className="acl-lc__herolabel">{hero.label}</div>
            <div className="acl-lc__heronum">{hero.value}<em>{hero.unit}</em></div>
          </div>
          <div className="acl-lc__ret">
            <div className="acl-lc__retk">{retention.label}<small>{retention.en}</small></div>
            <div className="acl-lc__retv">{retention.value}<em>{retention.unit}</em></div>
          </div>
          <div className="acl-lc__tiles">
            {tiles.map((m, i) => (
              <div key={i} className="acl-lc__tile">
                <div className="k">{m.k}</div>
                <div className="v">{m.v}<em>{m.unit}</em></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="acl-lc__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page46LowCode.defaults = {
  backgroundTheme: 'muted',
  layerCount: 4,           // 2–4 process strata bands
  mediaCount: 2,           // 0–4 leading bands that carry an image thumbnail
  showIndent: true,        // progressive indent (embedding-depth feel)
  metricCount: 2,          // 2–3 rail metric tiles
  focusEnabled: true,
  focusIndex: 1,           // highlight 流程编排 by default
  showDecor: true,
  eyebrow: 'Low Code AI',
  headline: '企业流程嵌入',
  subheadline: '低代码 AI 平台',
  summary: '低代码平台把模型能力<b>嵌入企业内部流程</b>。',
  badge: 'Low Code · 流程编排',
  hero: { label: '赛道融资额', value: '19', unit: '亿' },
  retention: { label: '净收入留存', en: 'Net Revenue Retention', value: '118', unit: '%' },
  metrics: [
    { k: '事件数', v: '6', unit: '笔' },
    { k: '企业客户中位数', v: '430', unit: '家' },
    { k: '平均单笔', v: '3.2', unit: '亿' },
  ],
  strataTitle: '流程编排',
  // orchestration layers — text not parameterized (count via layerCount)
  layers: [
    { k: '数据接入', en: 'Data Connect', desc: '统一接入企业数据源与权限', ratio: 1.2 },
    { k: '流程编排', en: 'Orchestration', desc: '可视化拖拽编排模型与规则', ratio: 0.95 },
    { k: '模型嵌入', en: 'Model Embed', desc: '把模型能力嵌入业务节点', ratio: 1.1 },
    { k: '治理监测', en: 'Governance', desc: '审计、留存与合规监测', ratio: 1.0 },
  ],
  closingLine: '能被业务团队使用的平台更容易扩散。',
};

Page46LowCode.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'layerCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '层级数量', desc: '流程编排的层级带数量(2–4)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '带图片缩略图的层级数(0–4，超出层数自动按层数封顶)；每槽按上传图片比例自适应，无图层显示序号块' },
  { key: 'showIndent', type: 'boolean', default: true,
    label: '层级缩进', desc: '逐层递进缩进(嵌入深度感) 显隐' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '右栏支撑指标格数量(2–3)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否突出某一层级(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, max: 3, step: 1, maxFrom: 'layerCount',
    label: '重点对象', desc: '被突出的层级序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page46LowCode.defaults;
export const controls = Page46LowCode.controls;
