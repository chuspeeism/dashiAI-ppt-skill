// Page54Loop.jsx — "Closed Loop / Alliance Map" template page (cycle diagram + share chart)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-lp-`.
// Left (hero): a count-driven CLOSED-LOOP cycle — stage nodes evenly placed on a
// dashed ring with a labeled hub, showing capital → compute → value recirculating.
// Right: a vendor share chart (donut OR horizontal bars) with a focusable segment.
// Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const ACL_LP_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-red)'];

export default function Page54Loop(props) {
  const p = { ...Page54Loop.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, stageCount, focusEnabled, focusIndex,
    showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, loopTitle, hubLabel, hubSub, stages,
    shareTitle, segments, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const steps = stages.slice(0, Math.max(2, stageCount));
  const segs = segments.slice(0, Math.max(3, segmentCount));
  const total = segs.reduce((s, d) => s + d.val, 0);
  const maxVal = Math.max(...segs.map((s) => s.val));
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const focus = segs[fIdx] || segs[0];

  // even angular placement on the ring (start at top, clockwise)
  const R = 38; // % of ring box
  const nodes = steps.map((s, i) => {
    const ang = (-90 + (i * 360) / steps.length) * Math.PI / 180;
    return { ...s, x: 50 + R * Math.cos(ang), y: 50 + R * Math.sin(ang) };
  });

  let acc = 0;
  const stops = segs.map((d, i) => {
    const start = (acc / total) * 100; acc += d.val;
    return `${ACL_LP_COLORS[i % ACL_LP_COLORS.length]} ${start}% ${(acc / total) * 100}%`;
  }).join(',');
  const pct = (v) => Math.round((v / total) * 100);

  return (
    <div className="acl-root acl-lp" style={{ background: bg }}>
      <style>{`
        .acl-lp{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 66px; display:flex; flex-direction:column; }
        .acl-lp__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-lp__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-lp__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-lp__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-lp__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-lp__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-lp__body{ flex:1; display:flex; gap:46px; margin-top:28px; min-height:0; align-items:stretch; }
        .acl-lp__panel{ background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:8px 10px 0 rgba(22,21,15,.16); padding:26px 34px 24px; display:flex; flex-direction:column;
          position:relative; }
        .acl-lp__panel.left{ flex:1; min-width:0; }
        .acl-lp__panel.right{ flex:0 0 640px; }
        .acl-lp__ptitle{ font-weight:900; font-size:27px; margin:0 0 2px; display:flex; align-items:center; gap:12px; }
        .acl-lp__ptag{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:8px; }

        /* loop ring */
        .acl-lp__ringwrap{ flex:1; position:relative; min-height:0; }
        .acl-lp__ring{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:min(100%, 580px); aspect-ratio:1; }
        .acl-lp__track{ position:absolute; inset:11%; border-radius:50%; border:4px dashed rgba(22,21,15,.5); }
        .acl-lp__hub{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
          width:40%; aspect-ratio:1; border-radius:50%; background:var(--acl-ink); color:var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
          box-shadow:5px 7px 0 rgba(22,21,15,.2); padding:8px; }
        .acl-lp__hub b{ font-family:var(--acl-font-cn); font-weight:900; font-size:34px; line-height:1.02; }
        .acl-lp__hub span{ font-family:var(--acl-font-mono); font-size:12.5px; letter-spacing:.08em;
          text-transform:uppercase; color:var(--acl-yellow); margin-top:6px; }
        .acl-lp__node{ position:absolute; transform:translate(-50%,-50%); width:176px; text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:6px; }
        .acl-lp__ndot{ width:56px; height:56px; border-radius:50%; display:grid; place-items:center;
          font-family:var(--acl-font-num); font-size:28px; color:var(--acl-paper);
          border:4px solid var(--acl-paper); box-shadow:0 0 0 3px var(--acl-ink); }
        .acl-lp__nl{ font-weight:900; font-size:23px; line-height:1.04; }
        .acl-lp__nn{ font-size:15px; line-height:1.25; color:rgba(22,21,15,.62); }

        /* share chart */
        .acl-lp__donutwrap{ flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px; }
        .acl-lp__donut{ position:relative; width:300px; height:300px; border-radius:50%; flex:0 0 auto;
          box-shadow:5px 7px 0 rgba(22,21,15,.16); }
        .acl-lp__dcenter{ position:absolute; inset:76px; border-radius:50%; z-index:2; background:var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
        .acl-lp__dcenter b{ font-family:var(--acl-font-num); font-size:58px; line-height:.82; color:var(--acl-pink); }
        .acl-lp__dcenter span{ font-weight:700; font-size:16px; max-width:130px; line-height:1.2; margin-top:5px; }
        .acl-lp__legend{ width:100%; display:flex; flex-direction:column; gap:9px; }
        .acl-lp__lrow{ display:grid; grid-template-columns:18px 1fr auto; align-items:center; gap:12px;
          font-weight:700; font-size:20px; padding:5px 8px; transition:opacity .25s, background .25s; }
        .acl-lp__lrow i{ width:18px; height:18px; }
        .acl-lp__lrow .pc{ font-family:var(--acl-font-num); font-size:26px; }
        .acl-lp__lrow .pc em{ font-style:normal; font-family:var(--acl-font-mono); font-size:13px;
          color:rgba(22,21,15,.5); margin-left:4px; }
        .acl-lp__lrow--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-lp__lrow--focus .pc em{ color:rgba(251,250,244,.6); }
        .acl-lp__lrow--dim{ opacity:.42; }

        .acl-lp__bars{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:18px; }
        .acl-lp__bar{ display:grid; grid-template-columns:160px 1fr 96px; align-items:center; gap:14px;
          transition:opacity .25s; }
        .acl-lp__bar .bl{ font-weight:700; font-size:20px; }
        .acl-lp__bar .track{ height:32px; background:rgba(22,21,15,.08); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-lp__bar .fill{ position:absolute; inset:0 auto 0 0; transition:width .55s cubic-bezier(.2,.8,.2,1); }
        .acl-lp__bar .pc{ font-family:var(--acl-font-num); font-size:30px; text-align:right; }
        .acl-lp__bar .pc em{ font-style:normal; font-family:var(--acl-font-mono); font-size:12px;
          color:rgba(22,21,15,.5); margin-left:3px; }
        .acl-lp__bar--focus .bl{ color:var(--acl-pink); }
        .acl-lp__bar--dim{ opacity:.42; }

        .acl-lp__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-lp__node{ animation:acl-lp-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .25s); }
          [data-deck-active] .acl-lp__lrow, [data-deck-active] .acl-lp__bar{
            animation:acl-lp-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); }
        }
        @keyframes acl-lp-pop{ from{ opacity:0; transform:translate(-50%,-50%) scale(.8); } to{ opacity:1; } }
        @keyframes acl-lp-in{ from{ opacity:0; transform:translateX(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-lp__head">
        <div>
          <div className="acl-lp__eyebrow">{eyebrow}</div>
          <h1 className="acl-lp__h">{headline}</h1>
        </div>
        <div className="acl-lp__sub">{subheadline}</div>
        <div className="acl-lp__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-lp__body">
        {/* ── left: closed-loop cycle ── */}
        <div className="acl-lp__panel left">
          <h3 className="acl-lp__ptitle">{loopTitle}
            {showDecor && <Doodle kind="loop" size={34} style={{ position: 'static' }} />}
          </h3>
          <div className="acl-lp__ptag">Capital → Compute → Value · recirculating</div>
          <div className="acl-lp__ringwrap">
            <div className="acl-lp__ring">
              <div className="acl-lp__track" />
              <div className="acl-lp__hub"><b>{hubLabel}</b><span>{hubSub}</span></div>
              {nodes.map((n, i) => (
                <div key={i} className="acl-lp__node" style={{ left: n.x + '%', top: n.y + '%', '--i': i }}>
                  <div className="acl-lp__ndot" style={{ background: ACL_LP_COLORS[i % ACL_LP_COLORS.length] }}>
                    {String(i + 1).padStart(2, '0')}</div>
                  <div className="acl-lp__nl">{n.label}</div>
                  <div className="acl-lp__nn">{n.note}</div>
                </div>
              ))}
              {showDecor && (
                <React.Fragment>
                  <Doodle kind="arrow" size={70} rotate={36} color="var(--acl-ink)" style={{ right: -18, top: '24%' }} />
                  <Doodle kind="arrow" size={70} rotate={216} color="var(--acl-ink)" style={{ left: -18, bottom: '24%' }} />
                </React.Fragment>
              )}
            </div>
          </div>
        </div>

        {/* ── right: vendor share chart ── */}
        <div className="acl-lp__panel right">
          <h3 className="acl-lp__ptitle">{shareTitle}
            {showDecor && <Doodle kind="spark" size={32} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
          </h3>
          <div className="acl-lp__ptag">Related funding by cloud vendor · 亿美元</div>

          {chartType === 'donut' && (
            <div className="acl-lp__donutwrap">
              <div className="acl-lp__donut" style={{ background: `conic-gradient(${stops})` }}>
                <div className="acl-lp__dcenter">
                  <b>{focusEnabled ? pct(focus.val) + '%' : segs.length}</b>
                  <span>{focusEnabled ? focus.label : shareTitle}</span>
                </div>
              </div>
              <div className="acl-lp__legend">
                {segs.map((d, i) => {
                  const isF = focusEnabled && i === fIdx;
                  const dim = focusEnabled && !isF;
                  return (
                    <div key={i} className={'acl-lp__lrow' + (isF ? ' acl-lp__lrow--focus' : '') + (dim ? ' acl-lp__lrow--dim' : '')} style={{ '--i': i }}>
                      <i style={{ background: ACL_LP_COLORS[i % ACL_LP_COLORS.length] }} />
                      <span>{d.label}</span>
                      {showValueLabels && <span className="pc">{d.val}<em>亿</em></span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {chartType === 'bars' && (
            <div className="acl-lp__bars">
              {segs.map((d, i) => {
                const isF = focusEnabled && i === fIdx;
                const dim = focusEnabled && !isF;
                const w = (d.val / maxVal) * 100;
                return (
                  <div key={i} className={'acl-lp__bar' + (isF ? ' acl-lp__bar--focus' : '') + (dim ? ' acl-lp__bar--dim' : '')} style={{ '--i': i }}>
                    <div className="bl">{d.label}</div>
                    <div className="track"><div className="fill" style={{ width: w + '%', background: ACL_LP_COLORS[i % ACL_LP_COLORS.length] }} /></div>
                    {showValueLabels && <div className="pc">{d.val}<em>亿</em></div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="acl-lp__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page54Loop.defaults = {
  // adjustable params
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  chartType: 'donut',          // 'donut' | 'bars'
  segmentCount: 4,             // 3–4 cloud vendors
  stageCount: 4,               // 2–4 loop nodes
  focusEnabled: true,
  focusIndex: 2,               // spotlight Azure
  showValueLabels: true,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Cloud Alliances',
  headline: '投资与算力消费闭环',
  subheadline: '云厂商联盟',
  summary: '云厂商投资 AI 公司，再通过算力消费<b>把价值收回来</b>。',
  loopTitle: '资本—算力闭环',
  hubLabel: '闭环',
  hubSub: 'Closed Loop',
  stages: [
    { label: '云厂商出资', note: '入股 / 授信模型公司' },
    { label: '资金转算力', note: '融资变成 GPU 订单' },
    { label: '算力消费', note: '回购云厂商算力时长' },
    { label: '价值回收', note: '收入回流，再投资' },
  ],
  shareTitle: '云厂商相关融资',
  segments: [
    { label: 'AWS 相关', val: 74 },
    { label: 'Google Cloud', val: 69 },
    { label: 'Azure 相关', val: 88 },
    { label: 'Oracle Cloud', val: 21 },
  ],
  closingLine: '云资源，正在成为融资交易的一部分。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page54Loop.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'donut', options: ['donut', 'bars'],
    label: '图表类型', desc: '占比模块的呈现：环形 / 条形' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 4, step: 1,
    label: '分段数量', desc: '占比分段(厂商)的数量(3–4)' },
  { key: 'stageCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '环节数量', desc: '闭环上的节点数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个占比分段' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的分段序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各分段数值标签的显示/隐藏' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page54Loop.defaults;
export const controls = Page54Loop.controls;
