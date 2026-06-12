// Page66DataInfra.jsx — "Case Card · Business Ledger Table" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ce-`.
// A single-subject company case card whose dominant element is a structured
// BUSINESS-LINE LEDGER table (line / revenue-share bar / representative client /
// verdict rating). A dark nameplate strip carries count-driven headline metrics.
// Count-driven rows, one focusable row, optional bars / rep-column / rating.
// Pure ESM — no Tweaks / preview-runtime dependency.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page66DataInfra(props) {
  const p = { ...Page66DataInfra.defaults, ...props };
  const {
    backgroundTheme, rowCount, metricCount, showBars, showRepCol, showRating,
    focusEnabled, focusIndex, showDecor,
    eyebrow, kicker, headline, company, tag, summary,
    metrics, columnLabels, shareUnit, rows, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const tiles = metrics.slice(0, Math.max(2, metricCount));
  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxShare = Math.max(...shown.map((r) => r.share));
  const accents = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-red)', 'var(--acl-yellow)'];

  // collapse hidden columns so the grid stays balanced
  const cols = ['380px', '1fr'];
  if (showRepCol) cols.push('300px');
  if (showRating) cols.push('250px');
  const gridCols = cols.join(' ');

  return (
    <div className="acl-root acl-ce" style={{ background: bg }}>
      <style>{`
        .acl-ce{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:70px 96px 58px; display:flex; flex-direction:column; }
        .acl-ce__top{ display:flex; align-items:center; gap:18px; flex:0 0 auto; }
        .acl-ce__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:23px;
          letter-spacing:.18em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ce__rule{ flex:1; height:0; border-top:3px solid var(--acl-ink); opacity:.4; }
        .acl-ce__kicker{ font-family:var(--acl-font-mono); font-weight:700; font-size:18px;
          padding:7px 13px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}

        .acl-ce__head{ display:flex; align-items:flex-end; gap:22px; margin-top:12px; flex:0 0 auto; }
        .acl-ce__h{ font-weight:900; font-size:66px; line-height:.92; margin:0; }
        .acl-ce__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:20px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg); white-space:nowrap; }
        .acl-ce__summary{ margin-left:auto; max-width:560px; font-weight:700; font-size:22px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ce__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        /* nameplate metric strip */
        .acl-ce__band{ display:flex; align-items:stretch; margin-top:20px; background:var(--acl-ink);
          color:var(--acl-paper); box-shadow:6px 8px 0 rgba(22,21,15,.2); flex:0 0 auto; position:relative; }
        .acl-ce__co{ flex:0 0 auto; display:flex; align-items:center; gap:14px; padding:18px 30px;
          border-right:3px solid rgba(251,250,244,.2); }
        .acl-ce__coname{ font-weight:900; font-size:46px; line-height:.9; color:var(--acl-paper); }
        .acl-ce__cotag{ font-family:var(--acl-font-mono); font-weight:700; font-size:13px;
          letter-spacing:.05em; text-transform:uppercase; padding:5px 11px; background:var(--acl-pink);
          color:var(--acl-paper); transform:rotate(-2deg); white-space:nowrap; }
        .acl-ce__mtiles{ flex:1; display:flex; }
        .acl-ce__mt{ flex:1; padding:16px 26px; border-right:1.5px dashed rgba(251,250,244,.22);
          display:flex; flex-direction:column; justify-content:center; gap:4px; }
        .acl-ce__mt:last-child{ border-right:none; }
        .acl-ce__mtk{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.07em;
          text-transform:uppercase; color:rgba(251,250,244,.55); }
        .acl-ce__mtv{ font-family:var(--acl-font-num); font-size:46px; line-height:.86; color:var(--acl-yellow); }
        .acl-ce__mtv em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:17px;
          margin-left:4px; color:rgba(251,250,244,.6); }
        .acl-ce__bandfx{ position:absolute; top:-16px; right:-12px; z-index:3; }

        /* ledger table panel */
        .acl-ce__panel{ position:relative; flex:1; margin-top:22px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:10px 36px 14px; display:flex; flex-direction:column; min-height:0; }
        .acl-ce__colhead{ display:grid; grid-template-columns:${gridCols}; align-items:center; gap:28px;
          padding:13px 6px 11px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:14px; letter-spacing:.07em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ce__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-ce__row{ flex:1; display:grid; grid-template-columns:${gridCols}; align-items:center; gap:28px;
          padding:0 6px; border-bottom:1.5px dashed rgba(22,21,15,.2); position:relative;
          transition:background .25s, color .25s; }
        .acl-ce__row:last-child{ border-bottom:none; }

        .acl-ce__line{ display:flex; flex-direction:column; gap:3px; }
        .acl-ce__line b{ font-weight:900; font-size:32px; line-height:1.04; }
        .acl-ce__line span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }

        .acl-ce__share{ display:flex; align-items:center; gap:16px; }
        .acl-ce__track{ flex:1; height:24px; background:rgba(22,21,15,.08); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-ce__fill{ position:absolute; left:0; top:0; bottom:0;
          transition:width .5s cubic-bezier(.2,.8,.2,1); }
        .acl-ce__sval{ font-family:var(--acl-font-num); font-size:36px; line-height:.9; min-width:96px;
          text-align:right; white-space:nowrap; }
        .acl-ce__sval em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:2px; opacity:.6; }

        .acl-ce__rep{ font-weight:700; font-size:21px; line-height:1.2; }
        .acl-ce__rep em{ font-style:normal; display:block; font-family:var(--acl-font-mono); font-size:12px;
          letter-spacing:.04em; text-transform:uppercase; color:rgba(22,21,15,.5); margin-top:3px; }

        .acl-ce__verdict{ display:flex; flex-direction:column; gap:7px; }
        .acl-ce__pips{ display:flex; gap:7px; }
        .acl-ce__pips i{ width:17px; height:17px; border:2.5px solid var(--acl-ink); border-radius:50%; }
        .acl-ce__pips i.on{ background:var(--acl-pink); }
        .acl-ce__verdict span{ font-weight:700; font-size:17px; }

        .acl-ce__row--focus{ background:var(--acl-ink); color:var(--acl-paper);
          box-shadow:6px 0 0 var(--acl-ink), -6px 0 0 var(--acl-ink); border-bottom-color:transparent; z-index:2; }
        .acl-ce__row--focus .acl-ce__line span{ color:rgba(251,250,244,.6); }
        .acl-ce__row--focus .acl-ce__track{ background:rgba(255,255,255,.16); border-color:var(--acl-paper); }
        .acl-ce__row--focus .acl-ce__fill{ background:var(--acl-yellow) !important; }
        .acl-ce__row--focus .acl-ce__rep em{ color:rgba(251,250,244,.6); }
        .acl-ce__row--focus .acl-ce__pips i{ border-color:var(--acl-paper); }
        .acl-ce__row--focus .acl-ce__pips i.on{ background:var(--acl-yellow); }
        .acl-ce__fx{ position:absolute; top:-13px; left:128px; z-index:5; }

        .acl-ce__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; flex:0 0 auto; }

        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ce__row{ animation:acl-ce-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .07s + .15s); }
          [data-deck-active] .acl-ce__band{ animation:acl-ce-band .5s cubic-bezier(.2,.8,.2,1) both; }
        }
        @keyframes acl-ce-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
        @keyframes acl-ce-band{ from{ opacity:0; transform:translateY(-12px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-ce__top">
        <div className="acl-ce__eyebrow">{eyebrow}</div>
        <div className="acl-ce__rule" />
        <div className="acl-ce__kicker">{kicker}</div>
      </div>

      <div className="acl-ce__head">
        <h1 className="acl-ce__h">{headline}</h1>
        <div className="acl-ce__sub">{tag}</div>
        <div className="acl-ce__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ce__band">
        {showDecor && <div className="acl-ce__bandfx"><Sticker label="案例" sub={company.toUpperCase()} color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={5} size={12} /></div>}
        <div className="acl-ce__co">
          <span className="acl-ce__coname">{company}</span>
          <span className="acl-ce__cotag">{tag}</span>
        </div>
        <div className="acl-ce__mtiles">
          {tiles.map((m, i) => (
            <div className="acl-ce__mt" key={i}>
              <div className="acl-ce__mtk">{m.k}</div>
              <div className="acl-ce__mtv">{m.v}{m.unit && <em>{m.unit}</em>}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="acl-ce__panel">
        <div className="acl-ce__colhead">
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]} · {shareUnit}</span>
          {showRepCol && <span>{columnLabels[2]}</span>}
          {showRating && <span>{columnLabels[3]}</span>}
        </div>
        <div className="acl-ce__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-ce__row' + (isF ? ' acl-ce__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-ce__fx"><Sticker label="底层变量" color="var(--acl-yellow)" rotate={6} size={13} /></div>}
                <div className="acl-ce__line"><b>{r.line}</b><span>{r.en}</span></div>

                <div className="acl-ce__share">
                  {showBars && (
                    <div className="acl-ce__track">
                      <div className="acl-ce__fill" style={{ width: `${(r.share / maxShare) * 100}%`, background: accents[i % accents.length] }} />
                    </div>
                  )}
                  <div className="acl-ce__sval">{r.share}<em>{shareUnit}</em></div>
                </div>

                {showRepCol && (
                  <div className="acl-ce__rep">{r.rep}<em>{r.repEn}</em></div>
                )}

                {showRating && (
                  <div className="acl-ce__verdict">
                    <div className="acl-ce__pips">
                      {[0, 1, 2].map((k) => <i key={k} className={k < r.rating ? 'on' : ''} />)}
                    </div>
                    <span>{r.verdict}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-ce__foot">
        {showDecor && <Doodle kind="loop" size={52} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page66DataInfra.defaults = {
  backgroundTheme: 'muted',
  rowCount: 4,
  metricCount: 3,
  showBars: true,
  showRepCol: true,
  showRating: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  // text content (edit in code; not exposed to Tweaks)
  eyebrow: 'Scale AI Case',
  kicker: '案例卡',
  headline: '数据基础设施',
  company: 'Scale AI',
  tag: '数据标注',
  summary: 'Scale AI 代表标注、RLHF 与评测数据需求——<b>数据质量是模型竞争的底层变量</b>。',
  metrics: [
    { k: '最大单笔融资', v: '10', unit: '亿' },
    { k: '企业客户', v: '1200', unit: '家' },
    { k: '政府客户占比', v: '18', unit: '%' },
  ],
  columnLabels: ['业务线', '营收占比', '代表客户', '判断'],
  shareUnit: '%',
  rows: [
    { line: '数据标注', en: 'Data Labeling', share: 38, rep: '模型实验室', repEn: 'Model Labs', rating: 3, verdict: '刚性需求' },
    { line: '人类反馈', en: 'RLHF', share: 27, rep: '头部大模型', repEn: 'Frontier Labs', rating: 3, verdict: '核心壁垒' },
    { line: '模型评测', en: 'Evaluation', share: 20, rep: '企业 / 政府', repEn: 'Enterprise / Gov', rating: 2, verdict: '快速增长' },
    { line: '合成数据', en: 'Synthetic', share: 15, rep: '研究机构', repEn: 'Research', rating: 2, verdict: '新兴方向' },
  ],
  closingLine: '数据质量，是模型竞争的底层变量。',
};

Page66DataInfra.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的业务线行数(2–4)' },
  { key: 'metricCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '指标数量', desc: '顶部铭牌带的指标格数量(2–4)' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '数据条', desc: '占比列的横向比例条 显隐' },
  { key: 'showRepCol', type: 'boolean', default: true,
    label: '代表列', desc: '「代表客户」列 显隐' },
  { key: 'showRating', type: 'boolean', default: true,
    label: '判断评级', desc: '「判断」评级圆点列 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, maxFrom: 'rowCount', step: 1,
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与贴纸标签的显示/隐藏' },
];

export const defaults = Page66DataInfra.defaults;
export const controls = Page66DataInfra.controls;
