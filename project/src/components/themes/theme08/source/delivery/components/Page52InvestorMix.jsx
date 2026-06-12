// Page52InvestorMix.jsx — "Investor Mix" template page (chart + evolution axis)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-im-`.
// Left: an investor-type share chart (donut OR horizontal bars) with a focusable
// segment. Right: an optional vertical EVOLUTION axis (count-driven stage cards
// joined by a hand-drawn track) showing the shift from pure-VC to industry
// capital. Fully portable — no dependency on the Tweaks panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const ACL_IM_COLORS = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-ink)', 'var(--acl-red)'];

export default function Page52InvestorMix(props) {
  const p = { ...Page52InvestorMix.defaults, ...props };
  const {
    backgroundTheme, chartType, segmentCount, focusEnabled, focusIndex, showValueLabels,
    showTimeline, stageCount, showDecor,
    eyebrow, headline, subheadline, summary, shareTitle, segments,
    timelineTitle, stages, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const segs = segments.slice(0, Math.max(3, segmentCount));
  const total = segs.reduce((s, d) => s + d.pct, 0);
  const fIdx = Math.min(focusIndex, segs.length - 1);
  const focus = segs[fIdx] || segs[0];
  const steps = stages.slice(0, Math.max(2, stageCount));

  let acc = 0;
  const stops = segs.map((d, i) => {
    const start = (acc / total) * 100; acc += d.pct;
    return `${ACL_IM_COLORS[i % ACL_IM_COLORS.length]} ${start}% ${(acc / total) * 100}%`;
  }).join(',');

  return (
    <div className="acl-root acl-im" style={{ background: bg }}>
      <style>{`
        .acl-im{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 70px; display:flex; flex-direction:column; }
        .acl-im__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-im__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-im__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-im__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-im__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:23px;
          line-height:1.42; text-align:right; text-wrap:balance; }
        .acl-im__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-im__body{ flex:1; display:flex; gap:46px; margin-top:32px; align-items:stretch; min-height:0; }
        .acl-im__panel{ background:var(--acl-paper); border:3px solid var(--acl-ink);
          box-shadow:8px 10px 0 rgba(22,21,15,.16); padding:30px 36px; display:flex; flex-direction:column;
          position:relative; }
        .acl-im__panel.left{ flex:0 0 ${showTimeline ? 880 : 1640}px; }
        .acl-im__panel.right{ flex:1; }
        .acl-im__ptitle{ font-weight:900; font-size:28px; margin:0 0 4px; display:flex; align-items:center; gap:12px; }
        .acl-im__ptag{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:18px; }

        /* donut */
        .acl-im__donutwrap{ flex:1; display:flex; align-items:center; gap:38px; }
        .acl-im__donut{ position:relative; width:320px; height:320px; border-radius:50%; flex:0 0 auto;
          box-shadow:5px 7px 0 rgba(22,21,15,.16); }
        .acl-im__dcenter{ position:absolute; inset:80px; border-radius:50%; z-index:2; background:var(--acl-paper);
          display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
        .acl-im__dcenter b{ font-family:var(--acl-font-num); font-size:54px; line-height:.82; color:var(--acl-pink); }
        .acl-im__dcenter span{ font-weight:700; font-size:18px; max-width:140px; line-height:1.2; margin-top:6px; }
        .acl-im__legend{ flex:1; display:flex; flex-direction:column; gap:12px; }
        .acl-im__lrow{ display:grid; grid-template-columns:20px 1fr auto; align-items:center; gap:12px;
          font-weight:700; font-size:22px; padding:7px 10px; transition:opacity .25s; }
        .acl-im__lrow i{ width:20px; height:20px; }
        .acl-im__lrow .pc{ font-family:var(--acl-font-num); font-size:30px; }
        .acl-im__lrow--focus{ background:var(--acl-ink); color:var(--acl-paper); transform:rotate(-1deg);
          box-shadow:4px 5px 0 rgba(22,21,15,.2); }
        .acl-im__lrow--dim{ opacity:.4; }

        /* bars */
        .acl-im__bars{ flex:1; display:flex; flex-direction:column; justify-content:center; gap:22px; }
        .acl-im__bar{ display:grid; grid-template-columns:230px 1fr 92px; align-items:center; gap:16px;
          transition:opacity .25s; }
        .acl-im__bar .bl{ font-weight:700; font-size:24px; }
        .acl-im__bar .track{ height:36px; background:rgba(22,21,15,.08); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-im__bar .fill{ position:absolute; inset:0 auto 0 0; transition:width .5s; }
        .acl-im__bar .pc{ font-family:var(--acl-font-num); font-size:34px; text-align:right; }
        .acl-im__bar--focus .bl{ color:var(--acl-pink); }
        .acl-im__bar--dim{ opacity:.42; }

        /* evolution timeline */
        .acl-im__evo{ flex:1; display:flex; flex-direction:column; justify-content:space-between;
          position:relative; padding-left:36px; }
        .acl-im__evoline{ position:absolute; left:13px; top:14px; bottom:14px; width:0;
          border-left:4px dashed var(--acl-ink); }
        .acl-im__step{ position:relative; display:flex; flex-direction:column; gap:5px; padding:4px 0; }
        .acl-im__stepdot{ position:absolute; left:-36px; top:4px; width:28px; height:28px; border-radius:50%;
          background:var(--acl-yellow); border:4px solid var(--acl-ink); }
        .acl-im__step:last-child .acl-im__stepdot{ background:var(--acl-pink); }
        .acl-im__phase{ font-family:var(--acl-font-mono); font-size:15px; font-weight:700; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-im__stitle{ font-weight:900; font-size:34px; line-height:1.04; }
        .acl-im__snote{ font-size:19px; line-height:1.35; color:rgba(22,21,15,.72); max-width:440px; }

        .acl-im__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-im__step{ animation:acl-im-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .1s + .25s); }
        }
        @keyframes acl-im-in{ from{ opacity:0; transform:translateX(20px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-im__head">
        <div>
          <div className="acl-im__eyebrow">{eyebrow}</div>
          <h1 className="acl-im__h">{headline}</h1>
        </div>
        <div className="acl-im__sub">{subheadline}</div>
        <div className="acl-im__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-im__body">
        {/* ── left: share chart ── */}
        <div className="acl-im__panel left">
          <h3 className="acl-im__ptitle">{shareTitle}
            {showDecor && <Doodle kind="spark" size={34} rotate={10} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static' }} />}
          </h3>
          <div className="acl-im__ptag">Investor type · share of capital</div>

          {chartType === 'donut' && (
            <div className="acl-im__donutwrap">
              <div className="acl-im__donut" style={{ background: `conic-gradient(${stops})` }}>
                <div className="acl-im__dcenter">
                  <b>{focus.pct}%</b>
                  <span>{focusEnabled ? focus.label : shareTitle}</span>
                </div>
              </div>
              <div className="acl-im__legend">
                {segs.map((d, i) => {
                  const isF = focusEnabled && i === fIdx;
                  const dim = focusEnabled && !isF;
                  return (
                    <div key={i} className={'acl-im__lrow' + (isF ? ' acl-im__lrow--focus' : '') + (dim ? ' acl-im__lrow--dim' : '')}>
                      <i style={{ background: ACL_IM_COLORS[i % ACL_IM_COLORS.length] }} />
                      <span>{d.label}</span>
                      {showValueLabels && <span className="pc">{d.pct}%</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {chartType === 'bars' && (
            <div className="acl-im__bars">
              {segs.map((d, i) => {
                const isF = focusEnabled && i === fIdx;
                const dim = focusEnabled && !isF;
                const w = (d.pct / Math.max(...segs.map((s) => s.pct))) * 100;
                return (
                  <div key={i} className={'acl-im__bar' + (isF ? ' acl-im__bar--focus' : '') + (dim ? ' acl-im__bar--dim' : '')}>
                    <div className="bl">{d.label}</div>
                    <div className="track"><div className="fill" style={{ width: w + '%', background: ACL_IM_COLORS[i % ACL_IM_COLORS.length] }} /></div>
                    {showValueLabels && <div className="pc">{d.pct}%</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── right: evolution axis ── */}
        {showTimeline && (
          <div className="acl-im__panel right">
            <h3 className="acl-im__ptitle">{timelineTitle}
              {showDecor && <Doodle kind="arrowS" size={36} rotate={-16} style={{ position: 'static' }} />}
            </h3>
            <div className="acl-im__ptag">From pure VC to industry capital</div>
            <div className="acl-im__evo">
              <div className="acl-im__evoline" />
              {steps.map((s, i) => (
                <div key={i} className="acl-im__step" style={{ '--i': i }}>
                  <div className="acl-im__stepdot" />
                  <div className="acl-im__phase">{s.phase}</div>
                  <div className="acl-im__stitle">{s.title}</div>
                  <div className="acl-im__snote">{s.note}</div>
                </div>
              ))}
              {showDecor && (
                <div style={{ position: 'absolute', right: 6, bottom: 18 }}>
                  <Sticker label="产业资本" sub="混合" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-4} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="acl-im__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page52InvestorMix.defaults = {
  // adjustable params
  backgroundTheme: 'primary',  // 'primary' | 'muted'
  chartType: 'donut',          // 'donut' | 'bars'
  segmentCount: 4,             // 3–4 investor types
  focusEnabled: true,
  focusIndex: 1,               // spotlight 企业战略 (the industry-capital story)
  showValueLabels: true,
  showTimeline: true,          // evolution axis
  stageCount: 3,               // 2–3 evolution stages
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Investor Mix',
  headline: '资本来源结构',
  subheadline: '投资人类型分布',
  summary: 'AI 融资已从纯 VC 交易，转向<b>产业资本混合</b>交易。',
  shareTitle: '投资人类型占比',
  segments: [
    { label: '传统 VC', pct: 42 },
    { label: '企业战略', pct: 27 },
    { label: '成长基金', pct: 18 },
    { label: '云厂商相关', pct: 13 },
  ],
  timelineTitle: '资本来源的演进',
  stages: [
    { phase: 'Phase 01 · 早期', title: '纯 VC 主导', note: '财务投资人主导，关注估值与回报倍数。' },
    { phase: 'Phase 02 · 当下', title: '产业资本入场', note: '企业战略与成长基金加入，绑定业务与资源。' },
    { phase: 'Phase 03 · 趋势', title: '云厂商深度绑定', note: '算力与渠道成为出资筹码，资本即资源。' },
  ],
  closingLine: '钱的来源本身，也是产业结构信号。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page52InvestorMix.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'donut', options: ['donut', 'bars'],
    label: '图表类型', desc: '占比模块的呈现：环形 / 条形' },
  { key: 'segmentCount', type: 'number', default: 4, min: 3, max: 4, step: 1,
    label: '分段数量', desc: '投资人类型分段的数量(3–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一个分段' },
  { key: 'focusIndex', type: 'number', default: 1, min: 0, maxFrom: 'segmentCount', step: 1,
    label: '重点对象', desc: '被高亮的分段序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各分段百分比标签的显示/隐藏' },
  { key: 'showTimeline', type: 'boolean', default: true,
    label: '演进时间轴', desc: '右侧资本来源演进轴的显示/隐藏' },
  { key: 'stageCount', type: 'number', default: 3, min: 2, max: 3, step: 1, showIf: 'showTimeline',
    label: '阶段数量', desc: '演进时间轴的阶段数量(2–3)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page52InvestorMix.defaults;
export const controls = Page52InvestorMix.controls;
