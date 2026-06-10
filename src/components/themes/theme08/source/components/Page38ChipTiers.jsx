// Page38ChipTiers.jsx — "Chip Tier Ledger" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ct-`.
// A structured TIER LEDGER table: tier name · funding figure · optional share
// bar · optional representative-direction column. Count-driven rows styled as
// stacked chip "slabs", one focusable highlight row, KPI strip in the header.
// Fully portable — no dependency on the Tweaks panel; all CSS class-prefixed.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page38ChipTiers(props) {
  const p = { ...Page38ChipTiers.defaults, ...props };
  const {
    backgroundTheme, rowCount, showBars, showRepCol, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, kpis, columnLabels, rows, valueUnit, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = rows.slice(0, Math.max(2, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxV = Math.max(...shown.map((r) => r.v));
  const cols = `78px 1.2fr 360px${showBars ? ' 1.1fr' : ''}${showRepCol ? ' 1fr' : ''}`;

  return (
    <div className="acl-root acl-ct" style={{ background: bg }}>
      <style>{`
        .acl-ct{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-ct__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-ct__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ct__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-ct__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ct__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ct__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ct__kpis{ display:flex; gap:0; margin-top:24px; border:3px solid var(--acl-ink);
          background:var(--acl-ink); }
        .acl-ct__kpi{ flex:1; background:var(--acl-paper); padding:13px 22px; display:flex;
          flex-direction:column; gap:2px; }
        .acl-ct__kpi + .acl-ct__kpi{ border-left:3px solid var(--acl-ink); }
        .acl-ct__kpi .k{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.06em;
          text-transform:uppercase; color:rgba(22,21,15,.5); }
        .acl-ct__kpi .v{ font-family:var(--acl-font-num); font-size:46px; line-height:.95; }
        .acl-ct__kpi .v em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:16px;
          margin-left:4px; opacity:.6; }
        .acl-ct__kpi--accent{ background:var(--acl-yellow); }

        .acl-ct__panel{ position:relative; flex:1; margin-top:22px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:8px 40px 16px; display:flex; flex-direction:column; min-height:0; }
        .acl-ct__colhead{ display:grid; grid-template-columns:${cols}; align-items:end; gap:26px;
          padding:16px 8px 12px; border-bottom:3px solid var(--acl-ink); font-family:var(--acl-font-mono);
          font-size:15px; letter-spacing:.07em; text-transform:uppercase; color:rgba(22,21,15,.55); }
        .acl-ct__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-ct__row{ flex:1; display:grid; grid-template-columns:${cols}; align-items:center; gap:26px;
          padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.22); position:relative; transition:background .25s; }
        .acl-ct__row:last-child{ border-bottom:none; }
        .acl-ct__idx{ font-family:var(--acl-font-num); font-size:58px; line-height:.8; color:rgba(22,21,15,.26); }
        .acl-ct__tier{ display:flex; flex-direction:column; gap:3px; }
        .acl-ct__tier b{ font-weight:900; font-size:38px; line-height:1; }
        .acl-ct__tier span{ font-family:var(--acl-font-mono); font-size:14px; letter-spacing:.04em;
          text-transform:uppercase; color:rgba(22,21,15,.46); }
        .acl-ct__amt{ font-family:var(--acl-font-num); font-size:62px; line-height:.78; white-space:nowrap; }
        .acl-ct__amt em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:19px;
          margin-left:5px; opacity:.6; }
        .acl-ct__bar{ height:24px; background:rgba(22,21,15,.1); border:2px solid var(--acl-ink);
          position:relative; overflow:hidden; }
        .acl-ct__barfill{ position:absolute; inset:0 auto 0 0; background:var(--acl-blue);
          border-right:2px solid var(--acl-ink); }
        .acl-ct__rep{ font-weight:700; font-size:22px; line-height:1.3; }
        .acl-ct__rep small{ display:block; font-family:var(--acl-font-mono); font-weight:400; font-size:13px;
          letter-spacing:.03em; color:rgba(22,21,15,.5); margin-top:3px; text-transform:uppercase; }
        .acl-ct__row--focus{ background:var(--acl-yellow);
          box-shadow:6px 0 0 var(--acl-yellow), -6px 0 0 var(--acl-yellow); border-bottom-color:transparent; z-index:2; }
        .acl-ct__row--focus .acl-ct__idx{ color:var(--acl-ink); }
        .acl-ct__row--focus .acl-ct__bar{ background:rgba(22,21,15,.16); }
        .acl-ct__row--focus .acl-ct__barfill{ background:var(--acl-pink); }
        .acl-ct__fx{ position:absolute; top:-14px; right:30px; z-index:5; }
        .acl-ct__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:14px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ct__row{ animation:acl-ct-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s + .1s); }
          [data-deck-active] .acl-ct__barfill{ animation:acl-ct-grow .7s cubic-bezier(.2,.8,.2,1) .4s both; }
        }
        @keyframes acl-ct-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
        @keyframes acl-ct-grow{ from{ transform:scaleX(0); transform-origin:left; } to{ transform:scaleX(1); } }
      `}</style>

      <div className="acl-ct__head">
        <div>
          <div className="acl-ct__eyebrow">{eyebrow}</div>
          <h1 className="acl-ct__h">{headline}</h1>
        </div>
        <div className="acl-ct__sub">{subheadline}</div>
        {showDecor && <Doodle kind="spark" size={42} rotate={-8} fill="var(--acl-yellow)" stroke="var(--acl-ink)" style={{ position: 'static', alignSelf: 'center', marginBottom: 8 }} />}
        <div className="acl-ct__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ct__kpis">
        {kpis.map((m, i) => (
          <div key={i} className={'acl-ct__kpi' + (i === 0 ? ' acl-ct__kpi--accent' : '')}>
            <div className="k">{m.k}</div>
            <div className="v">{m.v}<em>{m.unit}</em></div>
          </div>
        ))}
      </div>

      <div className="acl-ct__panel">
        <div className="acl-ct__colhead">
          <span>#</span>
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          {showBars && <span>{columnLabels[2]}</span>}
          {showRepCol && <span>{columnLabels[3]}</span>}
        </div>
        <div className="acl-ct__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            return (
              <div key={i} className={'acl-ct__row' + (isF ? ' acl-ct__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-ct__fx"><Sticker label="长期确定性" color="var(--acl-pink)" subColor="var(--acl-ink)" rotate={6} /></div>}
                <div className="acl-ct__idx">{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-ct__tier"><b>{r.tier}</b><span>{r.en}</span></div>
                <div className="acl-ct__amt">{r.v}<em>{valueUnit}</em></div>
                {showBars && (
                  <div className="acl-ct__bar"><div className="acl-ct__barfill"
                    style={{ right: `${100 - (r.v / maxV) * 100}%`, background: isF ? 'var(--acl-pink)' : 'var(--acl-blue)' }} /></div>
                )}
                {showRepCol && <div className="acl-ct__rep">{r.rep}<small>{r.repEn}</small></div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-ct__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page38ChipTiers.defaults = {
  backgroundTheme: 'muted',
  rowCount: 3,             // 2–4 tier rows
  showBars: true,
  showRepCol: true,
  focusEnabled: true,
  focusIndex: 0,           // highlight 训练芯片 by default
  showDecor: true,
  eyebrow: 'AI Chips',
  headline: '训练与推理硬件',
  subheadline: 'AI 芯片赛道',
  summary: 'AI 芯片融资集中在<b>训练加速器、推理芯片与边缘 AI</b>。',
  kpis: [
    { k: '赛道融资额', v: '97', unit: '亿' },
    { k: '事件数', v: '13', unit: '笔' },
    { k: '平均单笔', v: '7.5', unit: '亿' },
    { k: '训练芯片占比', v: '47', unit: '%' },
  ],
  columnLabels: ['芯片层级', '融资额', '资金占比', '代表方向'],
  valueUnit: '亿',
  rows: [
    { tier: '训练芯片', en: 'Training Accelerator', v: 46, rep: '大规模训练加速器', repEn: 'Accelerator', },
    { tier: '推理芯片', en: 'Inference Chip', v: 32, rep: '低延迟推理 / 能效', repEn: 'Inference', },
    { tier: '边缘 AI', en: 'Edge AI', v: 19, rep: '端侧 / 嵌入式算力', repEn: 'Edge', },
    { tier: '芯片互联', en: 'Interconnect', v: 11, rep: '高速互联 / 封装', repEn: 'Interconnect', },
  ],
  closingLine: '硬件方向看长期确定性。',
};

Page38ChipTiers.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 3, min: 2, max: 4, step: 1,
    label: '行数', desc: '展示的芯片层级行数(2–4)' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '占比条', desc: '资金占比列横向比例条的显示/隐藏' },
  { key: 'showRepCol', type: 'boolean', default: true,
    label: '方向列', desc: '「代表方向」列的显示/隐藏' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 3, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page38ChipTiers.defaults;
export const controls = Page38ChipTiers.controls;
