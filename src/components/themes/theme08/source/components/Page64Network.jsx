// Page64Network.jsx — "Case Card · Ecosystem Constellation" template page (image-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-cn-`.
// A single-subject company case card drawn as a left-anchored connection map: a
// company hub on the left fans count-driven ecosystem nodes out to the right
// (preset constellation positions per count, joined by dashed SVG spokes). The
// leading `mediaCount` nodes carry an ADAPTIVE photo (self-sizing to its image),
// the rest are labelled data nodes; one node is focusable. Left column holds the
// narrative + big-number metric tiles. Pure ESM — no Tweaks/runtime dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, MetaTag, AdaptiveImageSlot } from './AclPrimitives.jsx';

const ACL_CN_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)', 'var(--acl-yellow)'];

export default function Page64Network(props) {
  const p = { ...Page64Network.defaults, ...props };
  const {
    backgroundTheme, nodeCount, mediaCount, metricCount, showValueLabels,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, caption, hubLabel, hubSub,
    nodes, layout, metrics, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = nodes.slice(0, Math.max(3, nodeCount));
  const pos = layout[items.length] || layout[4];
  const photoNodes = Math.min(mediaCount, items.length);
  const fIdx = Math.min(focusIndex, items.length - 1);
  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const hub = { x: 12, y: 50 };

  return (
    <div className="acl-root acl-cn" style={{ background: bg }}>
      <style>{`
        .acl-cn{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 96px 60px; display:flex; flex-direction:column; }
        .acl-cn__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-cn__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-cn__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-cn__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-cn__head{ display:flex; align-items:flex-end; gap:24px; margin-top:14px; flex:0 0 auto; }
        .acl-cn__h{ font-weight:900; font-size:94px; line-height:.9; margin:0; }
        .acl-cn__plate{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          padding:11px 17px; background:var(--acl-pink); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2); white-space:nowrap; }

        .acl-cn__body{ flex:1; display:flex; gap:44px; margin-top:24px; min-height:0; }
        .acl-cn__left{ flex:0 0 600px; display:flex; flex-direction:column; min-width:0; }
        .acl-cn__cap{ font-weight:700; font-size:28px; line-height:1.5; }
        .acl-cn__cap b{ background:var(--acl-blue); padding:0 .12em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone; }
        .acl-cn__tiles{ display:flex; flex-wrap:wrap; gap:30px 56px; margin-top:auto; padding-top:26px; }
        .acl-cn__tile .acl-metatag .k{ font-size:17px; }
        .acl-cn__tile .acl-metatag .v{ font-family:var(--acl-font-num); font-size:96px; line-height:.84; }
        .acl-cn__tile .acl-metatag .v em{ font-style:normal; font-size:26px; font-family:var(--acl-font-cn);
          font-weight:700; margin-left:5px; color:rgba(22,21,15,.5); }

        /* right: constellation stage */
        .acl-cn__stage{ flex:1; position:relative; min-width:0; }
        .acl-cn__spokes{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; z-index:0; }
        .acl-cn__hub{ position:absolute; transform:translate(-50%,-50%); z-index:3; width:262px; height:262px;
          border-radius:50%; background:var(--acl-ink); color:var(--acl-paper); display:flex; flex-direction:column;
          align-items:center; justify-content:center; text-align:center; box-shadow:6px 9px 0 rgba(22,21,15,.24); }
        .acl-cn__hub b{ font-family:var(--acl-font-num); font-size:72px; line-height:.82; color:var(--acl-yellow);
          letter-spacing:.01em; }
        .acl-cn__hub span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.1em;
          text-transform:uppercase; margin-top:9px; color:rgba(251,250,244,.72); padding:0 16px; }

        .acl-cn__node{ position:absolute; transform:translate(-50%,-50%); z-index:2;
          display:flex; flex-direction:column; align-items:center; gap:7px; transition:opacity .25s; }
        .acl-cn__node--dim{ opacity:.45; }
        .acl-cn__card{ background:var(--acl-paper); border:3px solid var(--acl-ink); padding:16px 24px 15px;
          box-shadow:5px 6px 0 rgba(22,21,15,.16); text-align:center; min-width:206px; }
        .acl-cn__node--focus .acl-cn__card{ border-color:var(--acl-pink); transform:rotate(-1.4deg);
          box-shadow:7px 9px 0 rgba(22,21,15,.22); }
        .acl-cn__cl{ font-weight:900; font-size:28px; line-height:1.04; display:flex; align-items:center;
          justify-content:center; gap:10px; white-space:nowrap; }
        .acl-cn__cl i{ width:16px; height:16px; border-radius:50%; flex:0 0 auto; }
        .acl-cn__cnote{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:6px; }
        .acl-cn__ntag{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; background:var(--acl-ink); color:var(--acl-paper); padding:4px 10px;
          transform:rotate(-2deg); }
        .acl-cn__node--focus .acl-cn__ntag{ background:var(--acl-pink); }
        .acl-cn__nfx{ position:absolute; top:-20px; right:-14px; z-index:5; }

        .acl-cn__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:10px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-cn__node{ animation:acl-cn-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .28s); }
          [data-deck-active] .acl-cn__hub{ animation:acl-cn-hub .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-cn-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.82); } to{ opacity:1; } }
        @keyframes acl-cn-hub{ from{ opacity:0; transform:translate(-50%,-50%) scale(.7); } to{ opacity:1; } }
      `}</style>

      <div className="acl-cn__top">
        <div className="acl-cn__eyebrow">{eyebrow}</div>
        <div className="acl-cn__rule" />
        <div className="acl-cn__kicker">{kicker}</div>
      </div>

      <div className="acl-cn__head">
        <h1 className="acl-cn__h">{headline}</h1>
        <div className="acl-cn__plate">{company}</div>
        {showDecor && <Doodle kind="spark" size={44} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', marginLeft: 'auto', alignSelf: 'center' }} />}
      </div>

      <div className="acl-cn__body">
        {/* ── left: narrative + metric tiles ── */}
        <div className="acl-cn__left">
          <div className="acl-cn__cap" dangerouslySetInnerHTML={{ __html: caption }} />
          <div className="acl-cn__tiles">
            {tiles.map((m, i) => (
              <div className="acl-cn__tile" key={i}>
                <MetaTag k={m.k} v={<React.Fragment>{m.v}{m.unit && <em>{m.unit}</em>}</React.Fragment>} />
              </div>
            ))}
          </div>
        </div>

        {/* ── right: hub → ecosystem constellation ── */}
        <div className="acl-cn__stage">
          <svg className="acl-cn__spokes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {pos.map((n, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <line key={i} x1={hub.x} y1={hub.y} x2={n.x} y2={n.y}
                  stroke={isF ? 'var(--acl-pink)' : 'rgba(22,21,15,.4)'} strokeWidth={isF ? 0.7 : 0.5}
                  strokeDasharray="1.7 1.5" strokeLinecap="round" />
              );
            })}
          </svg>

          <div className="acl-cn__hub" style={{ left: hub.x + '%', top: hub.y + '%' }}>
            <b>{hubLabel}</b>
            <span>{hubSub}</span>
          </div>

          {items.map((n, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            const color = ACL_CN_COLORS[i % ACL_CN_COLORS.length];
            const asPhoto = i < photoNodes;
            const pt = pos[i] || { x: 60, y: 50 };
            return (
              <div key={i} className={'acl-cn__node' + (isF ? ' acl-cn__node--focus' : '') + (dim ? ' acl-cn__node--dim' : '')}
                style={{ left: pt.x + '%', top: pt.y + '%', '--i': i }}>
                {isF && showDecor && <div className="acl-cn__nfx"><Sticker label="核心资产" color="var(--acl-yellow)" rotate={7} size={12} /></div>}
                {asPhoto ? (
                  <React.Fragment>
                    <AdaptiveImageSlot id={'cn-' + i} box={196} rotate={i % 2 ? 3 : -3} ratio={1}
                      accent={isF ? 'var(--acl-pink)' : 'var(--acl-paper)'} placeholder={n.label}
                      sticker={{ label: n.label, color: isF ? 'var(--acl-pink)' : color, rotate: -3, size: 13 }} />
                    {showValueLabels && <div className="acl-cn__ntag">{n.note}</div>}
                  </React.Fragment>
                ) : (
                  <div className="acl-cn__card">
                    <div className="acl-cn__cl"><i style={{ background: color }} />{n.label}</div>
                    {showValueLabels && <div className="acl-cn__cnote">{n.note}</div>}
                  </div>
                )}
              </div>
            );
          })}

          {showDecor && (
            <React.Fragment>
              <Doodle kind="arrow" size={62} rotate={4} color="var(--acl-ink)" style={{ left: '20%', top: '14%' }} />
              <Doodle kind="loop" size={48} color="var(--acl-ink)" style={{ left: '24%', bottom: '12%' }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-cn__foot">
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-pink)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page64Network.defaults = {
  backgroundTheme: 'primary',
  nodeCount: 4,
  mediaCount: 2,
  metricCount: 2,
  showValueLabels: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'xAI Case',
  kicker: '案例卡',
  headline: '实时数据生态',
  company: 'xAI',
  caption: 'xAI 以 <b>实时数据与马斯克生态</b> 作为差异化——核心资产不是模型本身，而是实时数据与生态流量。',
  hubLabel: 'xAI',
  hubSub: 'Ecosystem hub · 生态中枢',
  nodes: [
    { label: 'X 平台', note: '实时数据入口' },
    { label: '特斯拉', note: '算力与场景' },
    { label: '多模态', note: '模型能力' },
    { label: '实时搜索', note: '检索与分发' },
    { label: '开发者', note: 'API 生态' },
  ],
  // constellation positions (% of stage), keyed by node count — hub sits at left.
  layout: {
    3: [ { x: 58, y: 16 }, { x: 74, y: 52 }, { x: 56, y: 86 } ],
    4: [ { x: 54, y: 14 }, { x: 80, y: 38 }, { x: 74, y: 74 }, { x: 50, y: 88 } ],
    5: [ { x: 50, y: 10 }, { x: 76, y: 26 }, { x: 84, y: 56 }, { x: 70, y: 84 }, { x: 48, y: 92 } ],
  },
  metrics: [
    { k: '单笔融资', v: '50', unit: '亿' },
    { k: '估值', v: '500', unit: '亿' },
    { k: '数据入口', v: 'X 平台' },
  ],
  closingLine: '独特的数据入口，可以成为模型的差异化。',
};

Page64Network.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'nodeCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '节点数量', desc: '生态连接节点数量(3–5)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '前 N 个节点改为承载图片(0–4，超过节点数自动封顶)；每张按上传图片比例自适应' },
  { key: 'metricCount', type: 'number', default: 2, min: 2, max: 3, step: 1,
    label: '指标数量', desc: '左侧大号支撑指标格数量(2–3)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '节点标注', desc: '各节点的角色标注 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个生态节点' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'nodeCount', step: 1,
    label: '重点对象', desc: '被高亮的节点序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page64Network.defaults;
export const controls = Page64Network.controls;
