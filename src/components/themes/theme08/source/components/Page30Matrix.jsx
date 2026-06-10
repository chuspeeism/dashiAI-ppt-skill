// Page30Matrix.jsx — "Scenario Matrix" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-mx-`.
// A structured scenario matrix: scenario · share (optional bar) · representative
// capability (optional column) · verdict rating (optional dots). Count-driven
// rows, a focusable highlight row, and a compact KPI strip in the header.
// Fully portable — no dependency on the Tweaks panel; all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page30Matrix(props) {
  const p = { ...Page30Matrix.defaults, ...props };
  const {
    backgroundTheme, rowCount, showBars, showRepCol, showRating, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, kpis, columnLabels, rows, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxShare = Math.max(...shown.map((r) => r.share));
  const cols = `1.05fr 380px${showRepCol ? ' 1fr' : ''}${showRating ? ' 300px' : ''}`;

  return (
    <div className="acl-root acl-mx" style={{ background: bg }}>
      <style>{`
        .acl-mx{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-mx__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-mx__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-mx__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-mx__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-mx__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-mx__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-mx__kpis{ display:flex; gap:0; margin-top:24px; border:3px solid var(--acl-ink);
          background:var(--acl-ink); }
        .acl-mx__kpi{ flex:1; background:var(--acl-paper); padding:13px 22px; display:flex;
          flex-direction:column; gap:2px; }
        .acl-mx__kpi + .acl-mx__kpi{ border-left:3px solid var(--acl-ink); }
        .acl-mx__kpi .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-mx__kpi .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.95; }
        .acl-mx__kpi .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:4px; opacity:.6; }
        .acl-mx__kpi--accent{ background:var(--acl-yellow); }

        .acl-mx__panel{ position:relative; flex:1; margin-top:22px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:8px 40px 18px; display:flex; flex-direction:column; min-height:0; }
        .acl-mx__colhead{ display:grid; grid-template-columns:${cols}; align-items:end; gap:28px;
          padding:16px 8px 12px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:15px; letter-spacing:.07em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-mx__colhead .c{ text-align:center; }
        .acl-mx__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-mx__row{ flex:1; display:grid; grid-template-columns:${cols}; align-items:center; gap:28px;
          padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.22); position:relative; transition:background .25s; }
        .acl-mx__row:last-child{ border-bottom:none; }
        .acl-mx__scn{ display:flex; flex-direction:column; gap:3px; }
        .acl-mx__scn b{ font-weight:900; font-size:36px; line-height:1; }
        .acl-mx__scn span{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.46); }
        .acl-mx__share{ display:flex; align-items:center; gap:16px; }
        .acl-mx__sharev{ font-family:var(--acl-font-num); font-size:50px; line-height:.85; white-space:nowrap; }
        .acl-mx__sharev em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:3px; opacity:.6; }
        .acl-mx__bar{ flex:1; height:20px; background:rgba(22,21,15,.1); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-mx__barfill{ position:absolute; inset:0 auto 0 0; background:var(--acl-blue);
          border-right:2px solid var(--acl-ink); }
        .acl-mx__rep{ font-weight:700; font-size:23px; line-height:1.3; }
        .acl-mx__rep small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:13px;
          letter-spacing:.03em; color:rgba(22,21,15,.5); margin-top:3px; text-transform:uppercase; }
        .acl-mx__verdict{ justify-self:center; display:flex; flex-direction:column; align-items:center; gap:7px; }
        .acl-mx__dots{ display:flex; gap:5px; }
        .acl-mx__dot{ width:15px; height:15px; border:2.5px solid var(--acl-ink); border-radius:50%;
          background:transparent; }
        .acl-mx__dot--on{ background:var(--acl-pink); }
        .acl-mx__vtag{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.03em;
          padding:4px 10px; background:var(--acl-ink); color:var(--acl-paper); white-space:nowrap; }
        .acl-mx__row--focus{ background:var(--acl-yellow);
          box-shadow:6px 0 0 var(--acl-yellow), -6px 0 0 var(--acl-yellow); border-bottom-color:transparent; z-index:2; }
        .acl-mx__row--focus .acl-mx__bar{ background:rgba(22,21,15,.16); }
        .acl-mx__fx{ position:absolute; top:-14px; right:30px; z-index:5; }
        .acl-mx__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-mx__row{ animation:acl-mx-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .1s); }
          [data-deck-active] .acl-mx__barfill{ animation:acl-mx-grow .7s cubic-bezier(.2,.8,.2,1) .35s both; }
        }
        @keyframes acl-mx-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
        @keyframes acl-mx-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:scaleX(1); } }
      `}</style>

      <div className="acl-mx__head">
        <div>
          <div className="acl-mx__eyebrow">{eyebrow}</div>
          <h1 className="acl-mx__h">{headline}</h1>
        </div>
        <div className="acl-mx__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-mx__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-mx__kpis">
        {kpis.map((m, i) => (
          <div key={i} className={'acl-mx__kpi' + (i === 0 ? ' acl-mx__kpi--accent' : '')}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}<em>{m.unit}</em></div>
          </div>
        ))}
      </div>

      <div className="acl-mx__panel">
        <div className="acl-mx__colhead">
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          {showRepCol && <span>{columnLabels[2]}</span>}
          {showRating && <span className="c">{columnLabels[3]}</span>}
        </div>
        <div className="acl-mx__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-mx__row' + (isF ? ' acl-mx__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-mx__fx"><Sticker label="高客单价" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} /></div>}
                <div className="acl-mx__scn"><b>{r.scn}</b><span>{r.en}</span></div>
                <div className="acl-mx__share">
                  <div className="acl-mx__sharev">{r.share}<em>%</em></div>
                  {showBars && (
                    <div className="acl-mx__bar"><div className="acl-mx__barfill"
                      style={{ right: `${100 - (r.share / maxShare) * 100}%`, background: isF ? 'var(--acl-ink)' : 'var(--acl-blue)' }} /></div>
                  )}
                </div>
                {showRepCol && <div className="acl-mx__rep">{r.rep}<small>{r.repEn}</small></div>}
                {showRating && (
                  <div className="acl-mx__verdict">
                    <div className="acl-mx__dots">
                      {[0, 1, 2, 3].map((d) => <span key={d} className={'acl-mx__dot' + (d < r.rating ? ' acl-mx__dot--on' : '')} />)}
                    </div>
                    <div className="acl-mx__vtag">{r.verdict}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-mx__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page30Matrix.defaults = {
  backgroundTheme: 'muted',
  rowCount: 4,             // 2–4 scenario rows
  showBars: true,
  showRepCol: true,
  showRating: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  eyebrow: 'Legal AI',
  headline: '专业服务高客单价',
  subheadline: '法律 AI 赛道',
  summary: '法律 AI 具备<b>高客单价、强专业壁垒</b>和明确效率提升空间。',
  kpis: [
    { k: '赛道融资额', v: '26', unit: '亿' },
    { k: '事件数', v: '6', unit: '笔' },
    { k: '平均单笔', v: '4.3', unit: '亿' },
    { k: '合同审查占比', v: '46', unit: '%' },
  ],
  columnLabels: ['场景', '场景占比', '代表能力', '判断'],
  rows: [
    { scn: '合同审查', en: 'Contract Review', share: 46, rep: '审查 / 比对引擎', repEn: 'Review Engine', rating: 4, verdict: '高频刚需' },
    { scn: '法务检索', en: 'Legal Research', share: 22, rep: '案例 / 法规检索', repEn: 'Case Search', rating: 3, verdict: '专业壁垒' },
    { scn: '合规监控', en: 'Compliance', share: 18, rep: '实时风险监控', repEn: 'Monitoring', rating: 3, verdict: '监管驱动' },
    { scn: '文书起草', en: 'Drafting', share: 14, rep: '模板智能生成', repEn: 'Drafting', rating: 2, verdict: '效率提升' },
  ],
  closingLine: '法律 AI 是垂直应用商业化样本。',
};

Page30Matrix.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的场景行数(2–4)' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '占比条', desc: '占比列横向比例条的显示/隐藏' },
  { key: 'showRepCol', type: 'boolean', default: true,
    label: '能力列', desc: '「代表能力」列的显示/隐藏' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '判断列', desc: '「判断」评级圆点与标签列的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page30Matrix.defaults;
export const controls = Page30Matrix.controls;
