// Page10Ranking.jsx — "Ranking Table" template page (table-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-tb-`.
// A structured ranking table: rank · name · category · value, with an optional
// in-cell bar visualization and per-category colour coding. Count-driven row
// total and a focusable highlighted row. No dependency on the Tweaks panel — the
// preview maps Tweak values onto props; the component is fully portable.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const ACL_TB_CAT = {
  '模型': 'var(--acl-yellow)', '基础设施': 'var(--acl-blue)',
  '应用': 'var(--acl-pink)', '具身': 'var(--acl-red)',
};

export default function Page10Ranking(props) {
  const p = { ...Page10Ranking.defaults, ...props };
  const {
    backgroundTheme, rowCount, showBars, colorByCategory, focusEnabled, focusIndex, showDecor,
    eyebrow, headline, subheadline, summary, rows, unit, columnLabels, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const shown = rows.slice(0, Math.max(1, rowCount));
  const fIdx = Math.min(focusIndex, shown.length - 1);
  const maxV = Math.max(...shown.map((r) => r.v));

  return (
    <div className="acl-root acl-tb" style={{ background: bg }}>
      <style>{`
        .acl-tb{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:80px 100px 72px; display:flex; flex-direction:column; }
        .acl-tb__head{ display:flex; align-items:flex-end; gap:26px; }
        .acl-tb__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-tb__h{ font-weight:900; font-size:80px; line-height:.95; margin:0; }
        .acl-tb__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-tb__summary{ margin-left:auto; max-width:520px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-tb__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}
        .acl-tb__panel{ position:relative; flex:1; margin-top:34px; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:8px 10px 0 rgba(22,21,15,.16);
          padding:14px 40px 22px; display:flex; flex-direction:column; }
        .acl-tb__colhead{ display:grid; grid-template-columns:96px 1fr 200px 460px; align-items:center;
          gap:24px; padding:14px 8px 12px; border-bottom:3px solid var(--acl-ink);
          font-family:var(--acl-font-mono); font-size:15px; letter-spacing:.08em; text-transform:uppercase;
          color:rgba(22,21,15,.55); }
        .acl-tb__colhead .r{ text-align:right; }
        .acl-tb__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-tb__row{ flex:1; display:grid; grid-template-columns:96px 1fr 200px 460px; align-items:center;
          gap:24px; padding:0 8px; border-bottom:1.5px dashed rgba(22,21,15,.2); position:relative;
          transition:background .25s; }
        .acl-tb__row:last-child{ border-bottom:none; }
        .acl-tb__rank{ font-family:var(--acl-font-num); font-size:46px; line-height:1; }
        .acl-tb__name{ font-weight:900; font-size:32px; line-height:1; }
        .acl-tb__cat{ justify-self:start; font-family:var(--acl-font-mono); font-size:14px; font-weight:700;
          letter-spacing:.04em; padding:5px 12px; border:2px solid var(--acl-ink); white-space:nowrap; }
        .acl-tb__valwrap{ display:flex; align-items:center; gap:16px; }
        .acl-tb__track{ flex:1; height:22px; background:rgba(22,21,15,.08);
          border:2px solid var(--acl-ink); position:relative; overflow:hidden; }
        .acl-tb__fill{ position:absolute; left:0; top:0; bottom:0; background:var(--acl-ink);
          transition:width .5s cubic-bezier(.2,.8,.2,1); }
        .acl-tb__val{ font-family:var(--acl-font-num); font-size:34px; line-height:1; min-width:118px;
          text-align:right; white-space:nowrap; }
        .acl-tb__val em{ font-style:normal; font-family:var(--acl-font-cn); font-weight:700; font-size:15px;
          margin-left:4px; opacity:.62; }
        .acl-tb__row--focus{ background:var(--acl-ink); color:var(--acl-paper);
          box-shadow:6px 0 0 var(--acl-ink), -6px 0 0 var(--acl-ink); border-bottom-color:transparent; z-index:2; }
        .acl-tb__row--focus .acl-tb__cat{ border-color:var(--acl-paper); }
        .acl-tb__row--focus .acl-tb__track{ background:rgba(255,255,255,.16); border-color:var(--acl-paper); }
        .acl-tb__fx{ position:absolute; top:-14px; left:60px; z-index:5; }
        .acl-tb__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:16px; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-tb__row{ animation:acl-tb-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .05s); }
        }
        @keyframes acl-tb-in{ from{ opacity:0; transform:translateX(-22px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-tb__head">
        <div>
          <div className="acl-tb__eyebrow">{eyebrow}</div>
          <h1 className="acl-tb__h">{headline}</h1>
        </div>
        <div className="acl-tb__sub">{subheadline}</div>
        <div className="acl-tb__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-tb__panel">
        <div className="acl-tb__colhead">
          <span>{columnLabels[0]}</span>
          <span>{columnLabels[1]}</span>
          <span>{columnLabels[2]}</span>
          <span className="r">{columnLabels[3]} · {unit}</span>
        </div>
        <div className="acl-tb__rows">
          {shown.map((r, i) => {
            const isF = focusEnabled && i === fIdx;
            const cat = colorByCategory ? (ACL_TB_CAT[r.cat] || 'var(--acl-ink)') : 'var(--acl-ink)';
            return (
              <div key={i} className={'acl-tb__row' + (isF ? ' acl-tb__row--focus' : '')} style={{ '--i': i }}>
                {isF && showDecor && <div className="acl-tb__fx"><Sticker label="榜首" color="var(--acl-yellow)" rotate={6} /></div>}
                <div className="acl-tb__rank" style={{ color: isF ? 'var(--acl-yellow)' : cat }}>{String(i + 1).padStart(2, '0')}</div>
                <div className="acl-tb__name">{r.name}</div>
                <div className="acl-tb__cat" style={{ background: isF ? 'transparent' : cat,
                  color: isF ? 'var(--acl-paper)' : (r.cat === '模型' ? 'var(--acl-ink)' : 'var(--acl-ink)') }}>{r.cat}</div>
                <div className="acl-tb__valwrap">
                  {showBars && (
                    <div className="acl-tb__track">
                      <div className="acl-tb__fill" style={{ width: `${(r.v / maxV) * 100}%`,
                        background: isF ? 'var(--acl-yellow)' : cat }} />
                    </div>
                  )}
                  <div className="acl-tb__val">{r.v}<em>{unit}</em></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="acl-tb__foot">
        {showDecor && <Doodle kind="loop" size={56} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
      </div>
    </div>
  );
}

Page10Ranking.defaults = {
  backgroundTheme: 'muted',
  rowCount: 8,             // 3–10 ranked rows shown
  showBars: true,
  colorByCategory: true,
  focusEnabled: true,
  focusIndex: 0,
  showDecor: true,
  eyebrow: 'Top Funded Companies',
  headline: 'Top 10 融资公司',
  subheadline: '头部玩家资金排名',
  summary: '头部公司融资额显著领先，<b>通用大模型</b> 占据榜单上方位置。',
  columnLabels: ['排名', '公司', '赛道', '最大单笔'],
  rows: [
    { name: 'OpenAI', cat: '模型', v: 66 },
    { name: 'Anthropic', cat: '模型', v: 65 },
    { name: 'xAI', cat: '模型', v: 50 },
    { name: 'CoreWeave', cat: '基础设施', v: 11 },
    { name: 'SSI', cat: '模型', v: 10 },
    { name: 'Scale AI', cat: '基础设施', v: 10 },
    { name: 'Figure AI', cat: '具身', v: 6.8 },
    { name: 'Perplexity', cat: '应用', v: 5.2 },
    { name: 'Databricks', cat: '应用', v: 5.0 },
    { name: 'Glean', cat: '应用', v: 2.6 },
  ],
  unit: '亿美元',
  closingLine: '头部融资规模既反映技术叙事，也反映资源绑定能力。',
};

Page10Ranking.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'rowCount', type: 'number', default: 8, min: 3, max: 10, step: 1,
    label: '行数', desc: '展示的排名行数(3–10)' },
  { key: 'showBars', type: 'boolean', default: true,
    label: '数据条', desc: '在数值列显示横向比例条' },
  { key: 'colorByCategory', type: 'boolean', default: true,
    label: '按类别配色', desc: '按赛道为序号/标签/数据条着色' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一行' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 9, step: 1, maxFrom: 'rowCount',
    label: '重点对象', desc: '被高亮的行序号(从 0 起)' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘装饰与标签的显示/隐藏' },
];

export const defaults = Page10Ranking.defaults;
export const controls = Page10Ranking.controls;
