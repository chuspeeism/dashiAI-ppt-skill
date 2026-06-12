// Page23SizeSplit.jsx — "Dual-Metric Split" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-ds-`.
// A two-measure comparison across ordered bands: a "count" measure and a "value"
// measure that often move in OPPOSITE directions (few big deals carry most of
// the money). Two layouts: 'mirror' (back-to-back diverging) or 'grouped'
// (paired bars). Band count + focus + value labels are adjustable. Fully
// portable — no Tweaks dependency; the preview only maps Tweak values to props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page23SizeSplit(props) {
  const p = { ...Page23SizeSplit.defaults, ...props };
  const {
    backgroundTheme, chartType, bandCount, focusEnabled, focusIndex,
    showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary,
    countLabel, valueLabel, countUnit, valueUnit, bands, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const rows = bands.slice(0, Math.max(2, bandCount));
  const maxC = Math.max(...rows.map((r) => r.count));
  const maxV = Math.max(...rows.map((r) => r.value));
  const sumC = rows.reduce((a, r) => a + r.count, 0);
  const sumV = rows.reduce((a, r) => a + r.value, 0);
  const isMirror = chartType === 'mirror';

  return (
    <div className="acl-root acl-ds" style={{ background: bg }}>
      <style>{`
        .acl-ds{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-ds__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-ds__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-ds__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-ds__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-ds__summary{ margin-left:auto; max-width:560px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-ds__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-ds__panel{ flex:1; min-height:0; margin-top:28px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:9px 11px 0 rgba(22,21,15,.16);
          padding:24px 56px 22px; display:flex; flex-direction:column; }
        .acl-ds__colhead{ display:flex; align-items:center; flex:0 0 auto; padding-bottom:14px;
          border-bottom:3px solid var(--acl-ink); margin-bottom:6px; }
        .acl-ds__ch{ display:flex; align-items:center; gap:9px; font-family:var(--acl-font-mono);
          font-weight:700; font-size:18px; letter-spacing:.05em; text-transform:uppercase; white-space:nowrap; }
        .acl-ds__ch .sw{ width:18px; height:18px; border:2.5px solid var(--acl-ink); }
        .acl-ds__ch small{ font-weight:400; font-size:13px; color:rgba(22,21,15,.5); white-space:nowrap; }
        .acl-ds__ch--c{ flex:1; }
        .acl-ds__ch--mid{ width:230px; justify-content:center; color:rgba(22,21,15,.45); font-size:15px; }
        .acl-ds__ch--v{ flex:1; justify-content:flex-end; }

        .acl-ds__rows{ flex:1; display:flex; flex-direction:column; }
        .acl-ds__row{ flex:1; display:flex; align-items:center; gap:0; min-height:0;
          border-bottom:1.5px dashed rgba(22,21,15,.14); }
        .acl-ds__row:last-child{ border-bottom:none; }

        /* mirror layout */
        .acl-ds__side{ flex:1; min-width:0; display:flex; align-items:center; height:100%; }
        .acl-ds__side--c{ justify-content:flex-end; }
        .acl-ds__bar{ height:46%; border:3px solid var(--acl-ink); position:relative;
          transition:width .45s cubic-bezier(.2,.8,.2,1); }
        .acl-ds__bar--c{ background:var(--acl-blue); }
        .acl-ds__bar--v{ background:var(--acl-pink); }
        .acl-ds__bar--dim{ opacity:.32; filter:saturate(.55); }
        .acl-ds__bar--focus{ height:62%; box-shadow:4px 4px 0 rgba(22,21,15,.22); }
        .acl-ds__bval{ position:absolute; top:50%; transform:translateY(-50%);
          font-family:var(--acl-font-num); font-size:34px; line-height:1; white-space:nowrap; }
        .acl-ds__bval em{ font-style:normal; font-family:var(--acl-font-mono); font-weight:700;
          font-size:15px; margin-left:3px; color:rgba(22,21,15,.6); }
        .acl-ds__bval--c{ right:calc(100% + 12px); }
        .acl-ds__bval--v{ left:calc(100% + 12px); }
        .acl-ds__mid{ width:230px; flex:0 0 230px; text-align:center; padding:0 8px; }
        .acl-ds__mid b{ display:block; font-weight:900; font-size:30px; line-height:1.05; }
        .acl-ds__mid span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.04em;
          color:rgba(22,21,15,.5); }
        .acl-ds__mid--focus b{ color:var(--acl-pink); }

        /* grouped layout */
        .acl-ds__grp{ flex:1; min-width:0; display:flex; flex-direction:column; gap:8px;
          justify-content:center; height:100%; padding-right:30px; }
        .acl-ds__gbar{ height:24px; border:3px solid var(--acl-ink); position:relative;
          transition:width .45s; display:flex; align-items:center; }
        .acl-ds__glabel{ width:230px; flex:0 0 230px; text-align:left; padding-left:8px; }
        .acl-ds__glabel b{ display:block; font-weight:900; font-size:28px; line-height:1.05; }
        .acl-ds__glabel span{ font-family:var(--acl-font-mono); font-size:13px; color:rgba(22,21,15,.5); }
        .acl-ds__gv{ position:absolute; left:calc(100% + 10px); font-family:var(--acl-font-num);
          font-size:26px; white-space:nowrap; }

        .acl-ds__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-ds__row{ animation:acl-ds-in .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s); }
        }
        @keyframes acl-ds-in{ from{ opacity:0; transform:translateY(12px); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-ds__head">
        <div>
          <div className="acl-ds__eyebrow">{eyebrow}</div>
          <h1 className="acl-ds__h">{headline}</h1>
        </div>
        <div className="acl-ds__sub">{subheadline}</div>
        <div className="acl-ds__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-ds__panel">
        {isMirror ? (
          <React.Fragment>
            <div className="acl-ds__colhead">
              <div className="acl-ds__ch acl-ds__ch--c"><span className="sw" style={{ background: 'var(--acl-blue)' }} />{countLabel}<small>{countUnit} · 共 {sumC}</small></div>
              <div className="acl-ds__ch acl-ds__ch--mid">区间 · BAND</div>
              <div className="acl-ds__ch acl-ds__ch--v">{valueLabel}<small>{valueUnit} · 共 {sumV}</small><span className="sw" style={{ background: 'var(--acl-pink)' }} /></div>
            </div>
            <div className="acl-ds__rows">
              {rows.map((r, i) => {
                const isF = focusEnabled && i === focusIndex;
                const dim = focusEnabled && !isF;
                return (
                  <div key={i} className="acl-ds__row" style={{ '--i': i }}>
                    <div className="acl-ds__side acl-ds__side--c">
                      <div className={'acl-ds__bar acl-ds__bar--c' + (dim ? ' acl-ds__bar--dim' : '') + (isF ? ' acl-ds__bar--focus' : '')}
                        style={{ width: `${(r.count / maxC) * 84}%` }}>
                        {showValueLabels && <div className="acl-ds__bval acl-ds__bval--c">{r.count}<em>{countUnit}</em></div>}
                      </div>
                    </div>
                    <div className={'acl-ds__mid' + (isF ? ' acl-ds__mid--focus' : '')}>
                      <b>{r.label}</b><span>{r.en}</span>
                    </div>
                    <div className="acl-ds__side acl-ds__side--v">
                      <div className={'acl-ds__bar acl-ds__bar--v' + (dim ? ' acl-ds__bar--dim' : '') + (isF ? ' acl-ds__bar--focus' : '')}
                        style={{ width: `${(r.value / maxV) * 84}%` }}>
                        {showValueLabels && <div className="acl-ds__bval acl-ds__bval--v">{r.value}<em>{valueUnit}</em></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="acl-ds__colhead">
              <div className="acl-ds__ch acl-ds__ch--c" style={{ width: 230, flex: '0 0 230px' }}>区间 · BAND</div>
              <div className="acl-ds__ch" style={{ gap: 22 }}>
                <span><span className="sw" style={{ background: 'var(--acl-blue)' }} /> {countLabel}</span>
                <span><span className="sw" style={{ background: 'var(--acl-pink)' }} /> {valueLabel}</span>
              </div>
            </div>
            <div className="acl-ds__rows">
              {rows.map((r, i) => {
                const isF = focusEnabled && i === focusIndex;
                const dim = focusEnabled && !isF;
                return (
                  <div key={i} className="acl-ds__row" style={{ '--i': i }}>
                    <div className={'acl-ds__glabel' + (isF ? ' acl-ds__mid--focus' : '')}>
                      <b>{r.label}</b><span>{r.en}</span>
                    </div>
                    <div className="acl-ds__grp">
                      <div className={'acl-ds__gbar acl-ds__bar--c' + (dim ? ' acl-ds__bar--dim' : '')}
                        style={{ width: `${(r.count / maxC) * 92}%` }}>
                        {showValueLabels && <div className="acl-ds__gv">{r.count}<em style={{ fontFamily: 'var(--acl-font-mono)', fontSize: 13 }}> {countUnit}</em></div>}
                      </div>
                      <div className={'acl-ds__gbar acl-ds__bar--v' + (dim ? ' acl-ds__bar--dim' : '')}
                        style={{ width: `${(r.value / maxV) * 92}%` }}>
                        {showValueLabels && <div className="acl-ds__gv">{r.value}<em style={{ fontFamily: 'var(--acl-font-mono)', fontSize: 13 }}> {valueUnit}</em></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="acl-ds__foot">
        {showDecor && <Doodle kind="arrow" size={56} rotate={6} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && <Sticker label="SIZE SPLIT" sub="区间" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-3} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page23SizeSplit.defaults = {
  backgroundTheme: 'muted',
  chartType: 'mirror',          // 'mirror' (back-to-back) | 'grouped' (paired bars)
  bandCount: 4,                 // 2–4 ordered bands
  focusEnabled: true,
  focusIndex: 3,                // emphasise the top band (few-but-huge deals)
  showValueLabels: true,
  showDecor: true,
  eyebrow: 'Deal Size Split',
  headline: '金额区间结构',
  subheadline: '交易规模分布',
  summary: '低金额段贡献数量，高金额段<b>贡献市场记忆</b>。',
  countLabel: '交易笔数',
  valueLabel: '融资金额',
  countUnit: '笔',
  valueUnit: '亿',
  bands: [
    { label: '1–2 亿', en: '$100–200M', count: 41, value: 58 },
    { label: '2–5 亿', en: '$200–500M', count: 29, value: 91 },
    { label: '5–10 亿', en: '$500M–1B', count: 15, value: 103 },
    { label: '10 亿 +', en: '$1B+', count: 12, value: 718 },
  ],
  closingLine: '市场，被少数超级交易重新定价。',
};

Page23SizeSplit.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'muted', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'mirror', options: ['mirror', 'grouped'],
    label: '图表类型', desc: '双维呈现：镜像对比(背向) / 成组并列' },
  { key: 'bandCount', type: 'number', default: 4, min: 2, max: 4, step: 1,
    label: '区间数量', desc: '有序区间(行)的数量(2–4)' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某个区间(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 3, min: 0, max: 3, step: 1, maxFrom: 'bandCount',
    label: '重点对象', desc: '被强调的区间序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各条形上的数值 显隐' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘批注与贴纸标签 显隐' },
];

export const defaults = Page23SizeSplit.defaults;
export const controls = Page23SizeSplit.controls;
