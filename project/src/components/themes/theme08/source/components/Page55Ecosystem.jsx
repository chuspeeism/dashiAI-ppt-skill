// Page55Ecosystem.jsx — "Ecosystem Orbit" template page (radial ring of photos + data)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ec-`.
// A central hub with count-driven ecosystem nodes evenly placed on an orbit ring,
// joined to the hub by hand-drawn radial spokes. The first `mediaCount` nodes
// carry an ADAPTIVE photo (self-sizing to its image); the rest are data cards —
// so the same ring works image-led or data-led. One node is focusable.
// Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker, AdaptiveImageSlot } from './AclPrimitives.jsx';

const ACL_EC_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-ink)'];

export default function Page55Ecosystem(props) {
  const p = { ...Page55Ecosystem.defaults, ...props };
  const {
    backgroundTheme, segmentCount, mediaCount, focusEnabled, focusIndex, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, hubLabel, hubSub, hubValue, segments, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, Math.max(3, segmentCount));
  const photoNodes = Math.min(mediaCount, segs.length);
  const fIdx = Math.min(focusIndex, segs.length - 1);

  // even angular placement on an ellipse; even counts start on the diagonal so
  // nodes sit in the corners (fills the frame instead of leaving empty corners)
  const Rx = 47, Ry = 38;
  const startAng = segs.length % 2 === 0 ? -45 : -90;
  const nodes = segs.map((s, i) => {
    const ang = (startAng + (i * 360) / segs.length) * Math.PI / 180;
    return { ...s, x: 50 + Rx * Math.cos(ang), y: 50 + Ry * Math.sin(ang) };
  });

  return (
    <div className="acl-root acl-ec" style={{ background: bg }}>
      <style>{`
        .acl-ec{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 60px; display:flex; flex-direction:column; }
        .acl-ec__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-ec__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ec__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-ec__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ec__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-ec__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ec__stage{ flex:1; position:relative; margin-top:2px; min-height:0; }
        .acl-ec__ring{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          height:100%; aspect-ratio:1.62; max-width:100%; }
        .acl-ec__spokes{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
        .acl-ec__orbit{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:92%; height:90%; border:3px dashed rgba(22,21,15,.4); border-radius:50%; }

        .acl-ec__hub{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); z-index:3;
          width:402px; height:402px; border-radius:50%; background:var(--acl-ink); color:var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
          box-shadow:6px 9px 0 rgba(22,21,15,.22); }
        .acl-ec__hub b{ font-family:var(--acl-font-num); font-size:126px; line-height:.78; color:var(--acl-yellow); }
        .acl-ec__hub span{ font-family:var(--acl-font-mono); font-size:20px; letter-spacing:.1em;
          text-transform:uppercase; margin-top:12px; color:rgba(251,250,244,.72); }
        .acl-ec__hub u{ text-decoration:none; font-weight:900; font-size:28px; margin-top:9px; }

        .acl-ec__node{ position:absolute; transform:translate(-50%,-50%); z-index:2;
          display:flex; flex-direction:column; align-items:center; gap:12px; width:375px;
          transition:opacity .25s; }
        .acl-ec__node--dim{ opacity:.46; }
        .acl-ec__card{ background:var(--acl-paper); border:4px solid var(--acl-ink); padding:22px 30px 21px;
          box-shadow:8px 9px 0 rgba(22,21,15,.16); text-align:center; min-width:318px; }
        .acl-ec__node--focus .acl-ec__card{ border-color:var(--acl-pink); transform:rotate(-1.2deg);
          box-shadow:7px 9px 0 rgba(22,21,15,.22); }
        .acl-ec__cl{ font-weight:900; font-size:36px; line-height:1.02; display:flex; align-items:center;
          justify-content:center; gap:13px; }
        .acl-ec__cl i{ width:21px; height:21px; flex:0 0 auto; }
        .acl-ec__cv{ font-family:var(--acl-font-num); font-size:75px; line-height:.9; margin-top:5px; }
        .acl-ec__cv em{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700; font-size:21px;
          letter-spacing:.04em; color:rgba(22,21,15,.5); margin-left:5px; text-transform:uppercase; }
        .acl-ec__vtag{ font-family:var(--acl-font-num); font-size:51px; line-height:1;
          background:var(--acl-ink); color:var(--acl-yellow); padding:8px 18px; transform:rotate(-2deg); }
        .acl-ec__vtag em{ font-style:normal; font-family:var(--acl-font-mono); font-size:18px; margin-left:6px;
          color:rgba(251,250,244,.7); }
        .acl-ec__nlabel{ font-weight:900; font-size:31px; text-align:center; }

        .acl-ec__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:8px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ec__node{ animation:acl-ec-pop .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .25s); }
          [data-deck-active] .acl-ec__hub{ animation:acl-ec-hub .55s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-ec-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.82); } to{ opacity:1; } }
        @keyframes acl-ec-hub{ from{ opacity:0; transform:translate(-50%,-50%) scale(.7); } to{ opacity:1; } }
      `}</style>

      <div className="acl-ec__head">
        <div>
          <div className="acl-ec__eyebrow">{eyebrow}</div>
          <h1 className="acl-ec__h">{headline}</h1>
        </div>
        <div className="acl-ec__sub">{subheadline}</div>
        <div className="acl-ec__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ec__stage">
        <div className="acl-ec__ring">
          <div className="acl-ec__orbit" />
          {/* radial spokes hub → nodes (scalable SVG overlay) */}
          <svg className="acl-ec__spokes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {nodes.map((n, i) => (
              <line key={i} x1="50" y1="50" x2={n.x} y2={n.y}
                stroke="rgba(22,21,15,.42)" strokeWidth="0.5" strokeDasharray="1.6 1.4" strokeLinecap="round" />
            ))}
          </svg>

          <div className="acl-ec__hub">
            <b>{hubLabel}</b>
            <u>{hubValue}</u>
            <span>{hubSub}</span>
          </div>

          {nodes.map((n, i) => {
            const isF = focusEnabled && i === fIdx;
            const dim = focusEnabled && !isF;
            const color = ACL_EC_COLORS[i % ACL_EC_COLORS.length];
            const asPhoto = i < photoNodes;
            return (
              <div key={i} className={'acl-ec__node' + (isF ? ' acl-ec__node--focus' : '') + (dim ? ' acl-ec__node--dim' : '')}
                style={{ left: n.x + '%', top: n.y + '%', '--i': i }}>
                {asPhoto ? (
                  <React.Fragment>
                    <AdaptiveImageSlot id={'eco-' + i} box={294} rotate={i % 2 ? 3 : -3} ratio={1}
                      accent={isF ? 'var(--acl-pink)' : 'var(--acl-paper)'} placeholder={n.label}
                      sticker={{ label: n.label, color: isF ? 'var(--acl-pink)' : color, rotate: -3,
                        subColor: isF ? undefined : undefined, size: 19 }} />
                    {showValueLabels && <div className="acl-ec__vtag">{n.value}<em>亿</em></div>}
                  </React.Fragment>
                ) : (
                  <div className="acl-ec__card">
                    <div className="acl-ec__cl"><i style={{ background: color }} />{n.label}</div>
                    {showValueLabels && <div className="acl-ec__cv">{n.value}<em>亿美元</em></div>}
                  </div>
                )}
              </div>
            );
          })}

          {showDecor && (
            <React.Fragment>
              <Doodle kind="spark" size={48} rotate={-10} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
                style={{ left: '46%', top: '20%' }} />
              <Doodle kind="loop" size={50} color="var(--acl-ink)" style={{ right: '40%', bottom: '16%' }} />
            </React.Fragment>
          )}
        </div>
      </div>

      <div className="acl-ec__foot">
        {showDecor && <Doodle kind="arrow" size={52} rotate={6} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page55Ecosystem.defaults = {
  // adjustable params
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  segmentCount: 4,             // 3–4 ecosystem nodes on the ring
  mediaCount: 2,               // 0–4 leading nodes carry an adaptive photo
  focusEnabled: true,
  focusIndex: 0,               // spotlight GPU 云
  showValueLabels: true,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'NVIDIA Ecosystem',
  headline: 'GPU 资源链条',
  subheadline: 'NVIDIA 生态',
  summary: 'NVIDIA 生态内的融资，围绕 GPU、网络、集群与推理<b>层层展开</b>。',
  hubLabel: 'GPU',
  hubValue: '92 亿',
  hubSub: 'Ecosystem core · 生态核心',
  segments: [
    { label: 'GPU 云', value: '64' },
    { label: '集群管理', value: '12' },
    { label: '推理优化', value: '9' },
    { label: '芯片互联', value: '7' },
  ],
  closingLine: '算力供给能力，正在变成融资能力。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page55Ecosystem.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 4, step: 1,
    label: '节点数量', desc: '生态环上的节点数量(3–4)' },
  { key: 'mediaCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '图片数量', desc: '前 N 个节点改为承载图片(0–4，超过节点数自动封顶)；每张按上传图片比例自适应' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个生态节点' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的节点序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各节点融资额数值 显隐' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page55Ecosystem.defaults;
export const controls = Page55Ecosystem.controls;
