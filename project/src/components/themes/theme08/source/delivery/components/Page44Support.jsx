// Page44Support.jsx — "ROI Ledger + Ticket Funnel" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-su-`.
// A NEW table layout: a count-driven TICKET-FLOW funnel band (narrowing stages)
// sits above a structured ROI LEDGER table — scenario · key figure · optional
// adoption bar · optional ROI rating dots. Count-driven rows, one focusable, KPI
// strip in the header. Fully portable — no Tweaks dependency; all CSS prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page44Support(props) {
  const p = { ...Page44Support.defaults, ...props };
  const {
    backgroundTheme, showFunnel, funnelStageCount, rowCount, showBars, showRating,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, kpis, funnelTitle, funnel,
    columnLabels, rows, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const stages = funnel.slice(0, Math.max(3, funnelStageCount));
  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxShare = Math.max(...shown.map((r) => r.share));
  const cols = `64px 1.25fr 360px${showBars ? ' 1fr' : ''}${showRating ? ' 200px' : ''}`;

  return (
    <div className="acl-root acl-su" style={{ background: bg }}>
      <style>{`
        .acl-su{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:74px 100px 62px; display:flex; flex-direction:column; }
        .acl-su__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-su__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-su__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-su__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-su__summary{ margin-left:auto; max-width:500px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-su__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-su__kpis{ display:flex; gap:0; margin-top:22px; border:3px solid var(--acl-ink);
          background:var(--acl-ink); }
        .acl-su__kpi{ flex:1; background:var(--acl-paper); padding:12px 22px; display:flex;
          flex-direction:column; gap:2px; }
        .acl-su__kpi + .acl-su__kpi{ border-left:3px solid var(--acl-ink); }
        .acl-su__kpi .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-su__kpi .v{ font-family:var(--acl-font-num); font-size:44px; line-height:.95; }
        .acl-su__kpi .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:4px; opacity:.6; }
        .acl-su__kpi--accent{ background:var(--acl-yellow); }

        /* ── ticket funnel band ── */
        .acl-su__funnel{ margin-top:18px; position:relative; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:6px 8px 0 rgba(22,21,15,.14); padding:13px 26px 16px; }
        .acl-su__funnelhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:10px; }
        .acl-su__flow{ display:flex; align-items:center; gap:0; }
        .acl-su__stage{ flex:1; display:flex; flex-direction:column; gap:5px; }
        .acl-su__sbar{ height:42px; border:2px solid var(--acl-ink); display:flex; align-items:center;
          justify-content:center; font-family:var(--acl-font-num); font-size:26px; color:var(--acl-ink); }
        .acl-su__sname{ font-weight:900; font-size:18px; }
        .acl-su__sname small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:10px;
          letter-spacing:.03em; text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-su__arrow{ flex:0 0 38px; display:grid; place-items:center; }

        /* ── ROI ledger ── */
        .acl-su__panel{ position:relative; flex:1; margin-top:18px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:6px 38px 12px; display:flex; flex-direction:column; min-height:0; }
        .acl-su__colhead{ display:grid; grid-template-columns:${cols}; align-items:end; gap:24px;
          padding:14px 8px 11px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.07em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-su__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-su__row{ flex:1; display:grid; grid-template-columns:${cols}; align-items:center; gap:24px;
          padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.22); position:relative; transition:background .25s; }
        .acl-su__row:last-child{ border-bottom:none; }
        .acl-su__idx{ font-family:var(--acl-font-num); font-size:50px; line-height:.8; color:rgba(22,21,15,.26); }
        .acl-su__scn{ display:flex; flex-direction:column; gap:3px; }
        .acl-su__scn b{ font-weight:900; font-size:32px; line-height:1; }
        .acl-su__scn span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.46); }
        .acl-su__fig{ font-family:var(--acl-font-num); font-size:56px; line-height:.78; white-space:nowrap; }
        .acl-su__fig em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; opacity:.6; }
        .acl-su__fig small{ display:block; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          color:rgba(22,21,15,.55); margin-top:2px; }
        .acl-su__bar{ height:22px; background:rgba(22,21,15,.1); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-su__barfill{ position:absolute; inset:0 auto 0 0; background:var(--acl-blue);
          border-right:2px solid var(--acl-ink); }
        .acl-su__rate{ display:flex; align-items:center; gap:10px; }
        .acl-su__dots{ display:flex; gap:5px; }
        .acl-su__dot{ width:17px; height:17px; border-radius:50%; border:2px solid var(--acl-ink); }
        .acl-su__ratelabel{ font-weight:900; font-size:19px; }
        .acl-su__row--focus{ background:var(--acl-yellow);
          box-shadow:6px 0 0 var(--acl-yellow), -6px 0 0 var(--acl-yellow); border-bottom-color:transparent; z-index:2; }
        .acl-su__row--focus .acl-su__idx{ color:var(--acl-ink); }
        .acl-su__row--focus .acl-su__bar{ background:rgba(22,21,15,.16); }
        .acl-su__row--focus .acl-su__barfill{ background:var(--acl-pink); }
        .acl-su__fx{ position:absolute; top:-14px; right:30px; z-index:5; }

        .acl-su__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:12px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-su__funnel{ animation:acl-su-rise .5s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-su__sbar{ animation:acl-su-grow .55s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .15s); transform-origin:left; }
          [data-deck-active] .acl-su__row{ animation:acl-su-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .25s); }
          [data-deck-active] .acl-su__barfill{ animation:acl-su-bgrow .7s cubic-bezier(.2,.8,.2,1) .5s both; }
        }
        @keyframes acl-su-rise{ from{ opacity:0; transform:translateY(-14px); } to{ opacity:1; transform:none; } }
        @keyframes acl-su-grow{ from{ transform:scaleX(0); } to{ transform:none; } }
        @keyframes acl-su-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
        @keyframes acl-su-bgrow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:scaleX(1); } }
      `}</style>

      <div className="acl-su__head">
        <div>
          <div className="acl-su__eyebrow">{eyebrow}</div>
          <h1 className="acl-su__h">{headline}</h1>
        </div>
        <div className="acl-su__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-su__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-su__kpis">
        {kpis.map((m, i) => (
          <div key={i} className={'acl-su__kpi' + (i === 0 ? ' acl-su__kpi--accent' : '')}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}<em>{m.unit}</em></div>
          </div>
        ))}
      </div>

      {showFunnel && (
        <div className="acl-su__funnel">
          <div className="acl-su__funnelhd">{funnelTitle} · Ticket Flow</div>
          <div className="acl-su__flow">
            {stages.map((s, i) => {
              const last = i === stages.length - 1;
              const fillColors = ['var(--acl-yellow)', 'var(--acl-blue)', 'var(--acl-paper)', 'var(--acl-pink)', 'var(--acl-paper)'];
              return (
                <React.Fragment key={i}>
                  <div className="acl-su__stage">
                    <div className="acl-su__sbar" style={{ '--i': i, width: `${s.pct}%`,
                      background: fillColors[i % fillColors.length] }}>{s.pct}%</div>
                    <div className="acl-su__sname">{s.k}<small>{s.en}</small></div>
                  </div>
                  {!last && <div className="acl-su__arrow"><Doodle kind="arrow" size={40} rotate={0} color="var(--acl-ink)" style={{ position: 'static' }} /></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="acl-su__panel">
        <div className="acl-su__colhead">
          <span>#</span>
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          {showBars && <span>{columnLabels[2]}</span>}
          {showRating && <span>{columnLabels[3]}</span>}
        </div>
        <div className="acl-su__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-su__row' + (isF ? ' acl-su__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-su__fx"><Sticker label="可量化 ROI" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} /></div>}
                <div className="acl-su__idx">{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-su__scn"><b>{r.scn}</b><span>{r.en}</span></div>
                <div className="acl-su__fig">{r.fig}<em>{r.unit}</em><small>{r.figNote}</small></div>
                {showBars && (
                  <div className="acl-su__bar"><div className="acl-su__barfill"
                    style={{ right: `${100 - (r.share / maxShare) * 100}%`, background: isF ? 'var(--acl-pink)' : 'var(--acl-blue)' }} /></div>
                )}
                {showRating && (
                  <div className="acl-su__rate">
                    <div className="acl-su__dots">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="acl-su__dot" style={{ background: d < r.rate ? (isF ? 'var(--acl-pink)' : 'var(--acl-ink)') : 'transparent' }} />
                      ))}
                    </div>
                    <span className="acl-su__ratelabel">{r.rateLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-su__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page44Support.defaults = {
  backgroundTheme: 'muted',
  showFunnel: true,        // ticket-flow funnel band
  funnelStageCount: 4,     // 3–5 funnel stages
  rowCount: 4,             // 2–4 scenario rows
  showBars: true,          // adoption-share bars
  showRating: true,        // ROI rating dots column
  focusEnabled: true,
  focusIndex: 0,           // highlight 自动应答 by default
  showDecor: true,
  eyebrow: 'Customer Support AI',
  headline: '可量化降本场景',
  subheadline: '客服 AI 赛道',
  summary: '客服 AI 是最容易<b>量化 ROI</b> 的垂直应用之一。',
  kpis: [
    { k: '赛道融资额', v: '27', unit: '亿' },
    { k: '事件数', v: '9', unit: '笔' },
    { k: '平均替代率', v: '32', unit: '%' },
    { k: '工单时长下降', v: '41', unit: '%' },
  ],
  funnelTitle: '工单流程',
  // funnel stages — text not parameterized (count via funnelStageCount)
  funnel: [
    { k: '工单接入', en: 'Intake', pct: 100 },
    { k: '智能分类', en: 'Triage', pct: 78 },
    { k: '自动解决', en: 'Auto-Resolve', pct: 54 },
    { k: '人工升级', en: 'Escalation', pct: 18 },
    { k: '满意回收', en: 'CSAT', pct: 11 },
  ],
  columnLabels: ['降本场景', '关键指标', '采用占比', 'ROI 判断'],
  // scenario rows — text not parameterized (count via rowCount)
  rows: [
    { scn: '自动应答', en: 'Auto Reply', fig: '32', unit: '%', figNote: '工单替代率', share: 38, rate: 3, rateLabel: '高' },
    { scn: '智能分流', en: 'Smart Routing', fig: '41', unit: '%', figNote: '工单时长下降', share: 26, rate: 3, rateLabel: '高' },
    { scn: '知识库自助', en: 'Self-Service', fig: '28', unit: '%', figNote: '自助解决率', share: 21, rate: 2, rateLabel: '中' },
    { scn: '坐席辅助', en: 'Agent Assist', fig: '19', unit: '%', figNote: '坐席提效', share: 15, rate: 2, rateLabel: '中' },
  ],
  closingLine: '能量化 ROI 的场景更容易获得预算。',
};

Page44Support.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'showFunnel', type: 'boolean', default: true,
    label: '流程漏斗', desc: '顶部工单流程漏斗带的显示/隐藏' },
  { key: 'funnelStageCount', type: 'number', default: 4, min: 3, max: 5, step: 1, showIf: 'showFunnel',
    label: '流程阶段', desc: '工单流程漏斗的阶段数量(3–5)' },
  { key: 'rowCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的降本场景行数(2–4)' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '占比条', desc: '采用占比列横向比例条的显示/隐藏' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '判断列', desc: '「ROI 判断」评级圆点列的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page44Support.defaults;
export const controls = Page44Support.controls;
