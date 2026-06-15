// Page74Regulation.jsx — "Compliance Pipeline + Risk Ledger" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-rg-`.
// A NEW table layout (distinct from the ticket-funnel ledger P44, the chip-tier
// slabs P38 and the scenario matrix P30): a count-driven horizontal COMPLIANCE
// PIPELINE strip (connected stages, NOT a narrowing funnel) sits above a RISK
// LEDGER table — dimension · figure · optional rising-delta badge · optional
// severity rating dots. Count-driven rows, one focusable, KPI header strip and a
// row of risk-tag chips. Pure ESM — no Tweaks dependency; all CSS scoped/prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page74Regulation(props) {
  const p = { ...Page74Regulation.defaults, ...props };
  const {
    backgroundTheme, showFlow, flowStageCount, rowCount, showDelta, showRating,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, kpis, flowTitle, flow,
    tags, columnLabels, rows, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const stages = flow.slice(0, Math.max(3, flowStageCount));
  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const cols = `60px 1.3fr 320px${showDelta ? ' 200px' : ''}${showRating ? ' 210px' : ''}`;

  return (
    <div className="acl-root acl-rg" style={{ background: bg }}>
      <style>{`
        .acl-rg{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 58px; display:flex; flex-direction:column; }
        .acl-rg__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-rg__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-rg__h{ font-weight:900; font-size:74px; line-height:.95; margin:0; }
        .acl-rg__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-red); color:var(--acl-paper); transform:rotate(-2deg);
          box-shadow:3px 4px 0 rgba(22,21,15,.2);  white-space:nowrap;}
        .acl-rg__summary{ margin-left:auto; max-width:470px; font-weight:700; font-size:23px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-rg__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-rg__kpis{ display:flex; gap:0; margin-top:18px; border:3px solid var(--acl-ink);
          background:var(--acl-ink); flex:0 0 auto; }
        .acl-rg__kpi{ flex:1; background:var(--acl-paper); padding:11px 22px; display:flex;
          flex-direction:column; gap:2px; }
        .acl-rg__kpi + .acl-rg__kpi{ border-left:3px solid var(--acl-ink); }
        .acl-rg__kpi .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-rg__kpi .v{ font-family:var(--acl-font-num); font-size:42px; line-height:.95; }
        .acl-rg__kpi .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }
        .acl-rg__kpi--accent{ background:var(--acl-yellow); }

        /* ── compliance pipeline strip ── */
        .acl-rg__flow{ margin-top:16px; position:relative; border:3px solid var(--acl-ink);
          background:var(--acl-paper); box-shadow:5px 7px 0 rgba(22,21,15,.14); padding:12px 26px 14px;
          flex:0 0 auto; }
        .acl-rg__flowhd{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.1em; text-transform:uppercase; color:rgba(22,21,15,.45); margin-bottom:10px; }
        .acl-rg__pipe{ display:flex; align-items:stretch; gap:0; }
        .acl-rg__node{ flex:1; display:flex; flex-direction:column; gap:3px; padding:7px 14px;
          border:2px solid var(--acl-ink); }
        .acl-rg__node b{ font-weight:900; font-size:21px; line-height:1.05; }
        .acl-rg__node span{ font-family:var(--acl-font-mono); font-weight:400; font-size:10px;
          letter-spacing:.03em; text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-rg__conn{ flex:0 0 34px; display:grid; place-items:center; }

        /* ── risk ledger ── */
        .acl-rg__panel{ position:relative; flex:1; margin-top:14px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:4px 38px 8px; display:flex; flex-direction:column; min-height:0; }
        .acl-rg__colhead{ display:grid; grid-template-columns:${cols}; align-items:end; gap:22px;
          padding:13px 8px 10px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.07em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-rg__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-rg__row{ flex:1; display:grid; grid-template-columns:${cols}; align-items:center; gap:22px;
          padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.22); position:relative;
          transition:opacity .25s, background .25s; }
        .acl-rg__row:last-child{ border-bottom:none; }
        .acl-rg__idx{ font-family:var(--acl-font-num); font-size:48px; line-height:.8; color:rgba(22,21,15,.26); }
        .acl-rg__dim{ display:flex; flex-direction:column; gap:3px; }
        .acl-rg__dim b{ font-weight:900; font-size:31px; line-height:1; }
        .acl-rg__dim span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.46); }
        .acl-rg__fig{ font-family:var(--acl-font-num); font-size:54px; line-height:.78; white-space:nowrap; }
        .acl-rg__fig em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:3px; opacity:.6; }
        .acl-rg__delta{ display:inline-flex; align-items:center; gap:6px; font-family:var(--acl-font-num);
          font-size:30px; padding:5px 12px; border:2.5px solid var(--acl-ink); background:var(--acl-red);
          color:var(--acl-paper); align-self:center; justify-self:start; line-height:1; white-space:nowrap; }
        .acl-rg__delta svg{ display:block; }
        .acl-rg__rate{ display:flex; align-items:center; gap:10px; }
        .acl-rg__dots{ display:flex; gap:5px; }
        .acl-rg__dot{ width:17px; height:17px; transform:rotate(45deg); border:2px solid var(--acl-ink); }
        .acl-rg__ratelabel{ font-weight:900; font-size:19px; }
        .acl-rg__row--focus{ background:var(--acl-yellow);
          box-shadow:6px 0 0 var(--acl-yellow), -6px 0 0 var(--acl-yellow); border-bottom-color:transparent; z-index:2; }
        .acl-rg__row--focus .acl-rg__idx{ color:var(--acl-ink); }
        .acl-rg__fx{ position:absolute; top:-14px; right:28px; z-index:5; }

        .acl-rg__foot{ display:flex; align-items:center; gap:18px; margin-top:12px; flex:0 0 auto; }
        .acl-rg__tags{ display:flex; gap:9px; flex-wrap:wrap; }
        .acl-rg__tag{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.04em;
          text-transform:uppercase; padding:6px 12px; border:2px solid var(--acl-ink); background:var(--acl-paper); }
        .acl-rg__close{ margin-left:auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-hand); font-size:28px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-rg__flow{ animation:acl-rg-rise .5s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-rg__node{ animation:acl-rg-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .15s); }
          [data-deck-active] .acl-rg__row{ animation:acl-rg-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .3s); }
        }
        @keyframes acl-rg-rise{ from{ opacity:0; transform:translateY(-12px); } to{ opacity:1; transform:none; } }
        @keyframes acl-rg-pop{ from{ opacity:0; transform:scale(.9); } to{ opacity:1; transform:none; } }
        @keyframes acl-rg-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-rg__head">
        <div>
          <div className="acl-rg__eyebrow">{eyebrow}</div>
          <h1 className="acl-rg__h">{headline}</h1>
        </div>
        <div className="acl-rg__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)"
          style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-rg__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-rg__kpis">
        {kpis.map((m, i) => (
          <div key={i} className={'acl-rg__kpi' + (i === 0 ? ' acl-rg__kpi--accent' : '')}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}<em>{m.unit}</em></div>
          </div>
        ))}
      </div>

      {showFlow && (
        <div className="acl-rg__flow">
          <div className="acl-rg__flowhd">{flowTitle} · Compliance Pipeline</div>
          <div className="acl-rg__pipe">
            {stages.map((s, i) => {
              const last = i === stages.length - 1;
              const fills = ['var(--acl-yellow)', 'var(--acl-paper)', 'var(--acl-blue)', 'var(--acl-paper)', 'var(--acl-pink)'];
              return (
                <React.Fragment key={i}>
                  <div className="acl-rg__node" style={{ '--i': i, background: fills[i % fills.length] }}>
                    <b>{s.k}</b><span>{s.en}</span>
                  </div>
                  {!last && <div className="acl-rg__conn"><Doodle kind="arrow" size={36} rotate={0} color="var(--acl-ink)" style={{ position: 'static' }} /></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="acl-rg__panel">
        <div className="acl-rg__colhead">
          <span>#</span>
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          {showDelta && <span>{columnLabels[2]}</span>}
          {showRating && <span>{columnLabels[3]}</span>}
        </div>
        <div className="acl-rg__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-rg__row' + (isF ? ' acl-rg__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-rg__fx"><Sticker label="刚性成本" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} /></div>}
                <div className="acl-rg__idx">{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-rg__dim"><b>{r.dim}</b><span>{r.en}</span></div>
                <div className="acl-rg__fig">{r.fig}<em>{r.unit}</em></div>
                {showDelta && (
                  <div className="acl-rg__delta" style={{ background: r.up === false ? 'var(--acl-blue)' : 'var(--acl-red)', color: r.up === false ? 'var(--acl-ink)' : 'var(--acl-paper)' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      <path d={r.up === false ? 'M8 14 L2 5 L14 5 Z' : 'M8 2 L14 11 L2 11 Z'} fill="currentColor" />
                    </svg>
                    {r.delta}
                  </div>
                )}
                {showRating && (
                  <div className="acl-rg__rate">
                    <div className="acl-rg__dots">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="acl-rg__dot" style={{ background: d < r.rate ? (isF ? 'var(--acl-pink)' : 'var(--acl-red)') : 'transparent' }} />
                      ))}
                    </div>
                    <span className="acl-rg__ratelabel">{r.rateLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-rg__foot">
        <div className="acl-rg__tags">
          {tags.map((t, i) => (
            <span key={i} className="acl-rg__tag" style={i === 0 ? { background: 'var(--acl-ink)', color: 'var(--acl-paper)' } : null}>{t}</span>
          ))}
        </div>
        <div className="acl-rg__close">
          {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
          <span>{closingLine}</span>
        </div>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page74Regulation.defaults = {
  backgroundTheme: 'muted',   // 'primary' | 'muted'
  showFlow: true,             // compliance pipeline strip
  flowStageCount: 5,          // 3–5 pipeline stages
  rowCount: 4,                // 2–4 risk ledger rows
  showDelta: true,            // rising-delta badge column
  showRating: true,           // severity rating diamonds column
  focusEnabled: true,
  focusIndex: 2,              // highlight 数据隔离需求 by default
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Regulation Risk',
  headline: '隐私、版权与安全',
  subheadline: '风险：监管合规',
  summary: '隐私、版权、安全与行业监管会<b>增加交付成本</b>。',
  kpis: [
    { k: '合规团队增长', v: '+42', unit: '%' },
    { k: '采购审查周期', v: '+36', unit: '%' },
    { k: '数据隔离需求', v: '58', unit: '%' },
    { k: '版权风险事件', v: '19', unit: '起' },
  ],
  flowTitle: '合规交付链',
  // pipeline stages — text not parameterized (count via flowStageCount)
  flow: [
    { k: '数据采集', en: 'Ingest' },
    { k: '隐私隔离', en: 'Isolation' },
    { k: '版权审查', en: 'IP Review' },
    { k: '安全合规', en: 'Compliance' },
    { k: '审计追溯', en: 'Audit' },
  ],
  tags: ['隐私', '版权', '内容安全', '行业监管', '数据驻留'],
  columnLabels: ['风险维度', '模拟数据', '趋势', '风险等级'],
  // risk ledger rows — text not parameterized (count via rowCount)
  rows: [
    { dim: '合规团队', en: 'Compliance Team', fig: '42', unit: '%', up: true, delta: '+42%', rate: 3, rateLabel: '高' },
    { dim: '采购审查', en: 'Procurement', fig: '36', unit: '%', up: true, delta: '+36%', rate: 3, rateLabel: '高' },
    { dim: '数据隔离需求', en: 'Data Isolation', fig: '58', unit: '%', up: true, delta: '+58%', rate: 3, rateLabel: '高' },
    { dim: '版权风险事件', en: 'IP Incidents', fig: '19', unit: '起', up: true, delta: '↑ 同比', rate: 2, rateLabel: '中' },
  ],
  closingLine: '合规能力会成为企业采购门槛。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page74Regulation.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'showFlow', type: 'boolean', default: true,
    label: '流程链', desc: '顶部合规交付链流程带的显示/隐藏' },
  { key: 'flowStageCount', type: 'number', default: 5, min: 3, max: 5, step: 1, showIf: 'showFlow',
    label: '流程阶段', desc: '合规交付链的阶段数量(3–5)' },
  { key: 'rowCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的风险维度行数(2–4)' },
  { key: 'showDelta', type: 'boolean', default: true,
    label: '趋势列', desc: '上升/下降趋势徽标列的显示/隐藏' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '风险等级', desc: '风险等级菱形评级列的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 2, min: 0, max: 3, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签 显隐' },
];

export const defaults = Page74Regulation.defaults;
export const controls = Page74Regulation.controls;
