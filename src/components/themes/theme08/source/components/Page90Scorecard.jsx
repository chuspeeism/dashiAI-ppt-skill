// Page90Scorecard.jsx — "Comparison Scorecard" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-sc-`.
// A NEW table shape for this deck — TRANSPOSED comparison: OPTIONS are columns
// (2–3) and CRITERIA are rows (3–5); each cell carries a rating-dot meter plus a
// short value. One whole column can be highlighted (focus). Distinct from the
// row-ledger tables (P10/P18/P30/P38/P44/P50/P66/P74). Toggle rating dots and
// value text independently. Pure ESM — no Tweaks dependency; CSS scoped + prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page90Scorecard(props) {
  const p = { ...Page90Scorecard.defaults, ...props };
  const {
    backgroundTheme, columnCount, rowCount, showRating, showValueLabels, showVerdict,
    focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, options, criteria, ratingMax, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)'];
  const cols = options.slice(0, Math.max(2, columnCount)).map((o, i) => ({ ...o, accent: accents[i % accents.length] }));
  const nc = cols.length;
  const rows = criteria.slice(0, Math.max(3, rowCount));
  const fIdx = Math.min(focusIndex, nc - 1);
  const dots = Array.from({ length: ratingMax });

  return (
    <div className="acl-root acl-sc" style={{ background: bg }}>
      <style>{`
        .acl-sc{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:72px 100px 60px; display:flex; flex-direction:column; }
        .acl-sc__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-sc__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-sc__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-sc__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-sc__summary{ margin-left:auto; max-width:480px; font-weight:700; font-size:23px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-sc__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-sc__table{ flex:1; margin-top:30px; display:grid; gap:0; min-height:0;
          grid-template-columns:300px repeat(var(--nc), 1fr); grid-auto-rows:1fr;
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16); }
        .acl-sc__cell{ border-right:3px solid var(--acl-ink); border-bottom:3px solid var(--acl-ink);
          padding:18px 24px; display:flex; flex-direction:column; justify-content:center; min-width:0; }
        .acl-sc__cell--rt{ border-right:0; }
        .acl-sc__corner{ border-bottom:3px solid var(--acl-ink); }

        /* header row */
        .acl-sc__ohead{ background:var(--acl-ink); color:var(--acl-paper); border-bottom:3px solid var(--acl-ink);
          border-right:3px solid var(--acl-paper); padding:18px 22px; position:relative; transition:background .25s; }
        .acl-sc__ohead:last-child{ border-right:0; }
        .acl-sc__oname{ font-weight:900; font-size:33px; line-height:1; }
        .acl-sc__otag{ display:inline-block; font-family:var(--acl-font-mono); font-weight:700; font-size:12px;
          letter-spacing:.05em; text-transform:uppercase; padding:4px 9px; background:var(--acl-yellow);
          color:var(--acl-ink); margin-top:10px; }
        .acl-sc__ohead--focus{ background:var(--acl-pink); }
        .acl-sc__ofx{ position:absolute; top:-16px; right:-10px; z-index:5; }

        /* criteria label column */
        .acl-sc__crit{ background:var(--acl-paper); }
        .acl-sc__cname{ font-weight:900; font-size:26px; line-height:1.08; }
        .acl-sc__cnote{ font-family:var(--acl-font-mono); font-size:12px; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:5px; }

        /* body cells */
        .acl-sc__bc{ background:var(--acl-paper); transition:background .25s; }
        .acl-sc__bc--focus{ background:rgba(255,61,151,.12); }
        .acl-sc__dots{ display:flex; gap:6px; }
        .acl-sc__dot{ width:18px; height:18px; border-radius:50%; border:2.5px solid var(--acl-ink);
          background:var(--acl-paper); }
        .acl-sc__dot--on{ background:var(--acl-ink); }
        .acl-sc__bc--focus .acl-sc__dot--on{ background:var(--acl-pink); border-color:var(--acl-pink); }
        .acl-sc__bv{ font-family:var(--acl-font-num); font-size:26px; line-height:1; margin-top:9px; }
        .acl-sc__bv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:14px;
          margin-left:3px; color:rgba(22,21,15,.55); }

        /* verdict row */
        .acl-sc__vc{ background:var(--acl-paper); border-bottom:0; }
        .acl-sc__vlabel{ font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-sc__verdict{ font-weight:900; font-size:24px; line-height:1.1; margin-top:4px; }
        .acl-sc__vc--focus{ background:var(--acl-ink); color:var(--acl-paper); }
        .acl-sc__vc--focus .acl-sc__vlabel{ color:var(--acl-yellow); }

        .acl-sc__foot{ flex:0 0 auto; display:flex; align-items:center; gap:14px;
          font-family:var(--acl-font-hand); font-size:27px; margin-top:14px; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-sc__ohead{ animation:acl-sc-rise .5s cubic-bezier(.2,.8,.2,1) both; }
          [data-deck-active] .acl-sc__crit{ animation:acl-sc-rise .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--r,0) * .08s + .1s); }
        }
        @keyframes acl-sc-rise{ from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-sc__head">
        <div>
          <div className="acl-sc__eyebrow">{eyebrow}</div>
          <h1 className="acl-sc__h">{headline}</h1>
        </div>
        <div className="acl-sc__sub">{subheadline}</div>
        <div className="acl-sc__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-sc__table" style={{ '--nc': nc }}>
        {/* header row */}
        <div className="acl-sc__corner acl-sc__crit" />
        {cols.map((o, i) => {
          const isF = focusEnabled && i === fIdx;
          return (
            <div key={i} className={'acl-sc__ohead' + (isF ? ' acl-sc__ohead--focus' : '')}>
              {isF && showDecor && <div className="acl-sc__ofx"><Sticker label="首选" color="var(--acl-yellow)" rotate={8} /></div>}
              <div className="acl-sc__oname">{o.name}</div>
              <span className="acl-sc__otag">{o.tag}</span>
            </div>
          );
        })}

        {/* criteria rows */}
        {rows.map((c, r) => (
          <React.Fragment key={r}>
            <div className="acl-sc__cell acl-sc__crit" style={{ '--r': r }}>
              <div className="acl-sc__cname">{c.name}</div>
              <div className="acl-sc__cnote">{c.note}</div>
            </div>
            {cols.map((o, i) => {
              const isF = focusEnabled && i === fIdx;
              const cell = c.cells[i] || {};
              return (
                <div key={i} className={'acl-sc__cell acl-sc__bc' + (i === nc - 1 ? ' acl-sc__cell--rt' : '') + (isF ? ' acl-sc__bc--focus' : '')}>
                  {showRating && (
                    <div className="acl-sc__dots">
                      {dots.map((_, d) => <span key={d} className={'acl-sc__dot' + (d < (cell.rating || 0) ? ' acl-sc__dot--on' : '')} />)}
                    </div>
                  )}
                  {showValueLabels && cell.value != null && (
                    <div className="acl-sc__bv">{cell.value}<em>{cell.unit}</em></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* verdict row */}
        {showVerdict && (
          <React.Fragment>
            <div className="acl-sc__cell acl-sc__vc acl-sc__crit" style={{ borderBottom: 0 }}>
              <div className="acl-sc__vlabel">综合判断</div>
            </div>
            {cols.map((o, i) => {
              const isF = focusEnabled && i === fIdx;
              return (
                <div key={i} className={'acl-sc__cell acl-sc__vc' + (i === nc - 1 ? ' acl-sc__cell--rt' : '') + (isF ? ' acl-sc__vc--focus' : '')}>
                  <div className="acl-sc__vlabel">Verdict</div>
                  <div className="acl-sc__verdict">{o.verdict}</div>
                </div>
              );
            })}
          </React.Fragment>
        )}
      </div>

      <div className="acl-sc__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

// ── default content + adjustable params ──────────────────────────────────────
Page90Scorecard.defaults = {
  backgroundTheme: 'muted',    // 'primary' | 'muted'
  columnCount: 3,              // 2–3 compared options (columns)
  rowCount: 4,                 // 3–5 criteria (rows)
  showRating: true,            // rating-dot meter in each cell
  showValueLabels: true,       // short value under the dots
  showVerdict: true,           // bottom verdict row
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  ratingMax: 5,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Scorecard · Side by Side',
  headline: '三条路径对比',
  subheadline: '同一张记分卡',
  summary: '把不同落地路径放进<b>同一套标准</b>，差距才看得清。',
  // options = columns
  options: [
    { name: '嵌入工作流', tag: 'Workflow', verdict: '可计费 · 高留存' },
    { name: '量化降本', tag: 'ROI', verdict: '易验证 · 中壁垒' },
    { name: '资源绑定', tag: 'Resource', verdict: '高门槛 · 难复制' },
  ],
  // criteria = rows; cells[i] aligns with options[i]
  criteria: [
    { name: '可计费性', note: 'Billable', cells: [{ rating: 5, value: '高' }, { rating: 3, value: '中' }, { rating: 4, value: '中高' }] },
    { name: '净留存', note: 'NRR', cells: [{ rating: 5, value: '132', unit: '%' }, { rating: 3, value: '108', unit: '%' }, { rating: 4, value: '121', unit: '%' }] },
    { name: '壁垒强度', note: 'Moat', cells: [{ rating: 3, value: '中' }, { rating: 2, value: '低' }, { rating: 5, value: '高' }] },
    { name: '复制成本', note: 'Replicable', cells: [{ rating: 4, value: '低' }, { rating: 5, value: '很低' }, { rating: 2, value: '高' }] },
    { name: '回报周期', note: 'Payback', cells: [{ rating: 4, value: '12', unit: '月' }, { rating: 5, value: '8', unit: '月' }, { rating: 2, value: '24', unit: '月' }] },
  ],
  closingLine: '没有最好的路径，只有最适配你资源的那一条。',
};

// ── adjustable-parameter manifest (type / default / options / description) ───
Page90Scorecard.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'columnCount', type: 'number', default: 3, min: 2, max: 3, step: 1,
    label: '对比项数量', desc: '参与对比的选项(列)数量(2–3)' },
  { key: 'rowCount', type: 'number', default: 4, min: 3, max: 5, step: 1,
    label: '评估维度数量', desc: '评估维度(行)数量(3–5)' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '评级圆点', desc: '每格的评级圆点计量 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '评级下方的简短数值 显隐' },
  { key: 'showVerdict', type: 'boolean', default: true,
    label: '综合判断行', desc: '底部综合判断行 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否整列高亮某一个对比项' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 2, maxFrom: 'columnCount', step: 1,
    label: '重点对象', desc: '被高亮的对比项序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page90Scorecard.defaults;
export const controls = Page90Scorecard.controls;
