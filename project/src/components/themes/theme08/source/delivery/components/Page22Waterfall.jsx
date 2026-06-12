// Page22Waterfall.jsx — "Contribution Waterfall" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-wf-`.
// A waterfall chart: each category is a floating block stacked onto the running
// cumulative, building up to a final total bar. Step count is adjustable; one
// step can be focused; connectors / value labels toggle. Fully portable — no
// dependency on the Tweaks panel; the preview only maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

export default function Page22Waterfall(props) {
  const p = { ...Page22Waterfall.defaults, ...props };
  const {
    backgroundTheme, stepCount, showTotal, focusEnabled, focusIndex,
    showValueLabels, showConnectors, showDecor,
    eyebrow, headline, subheadline, summary, unit, steps, totalLabel, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  const items = steps.slice(0, Math.max(2, stepCount));
  const total = items.reduce((a, s) => a + s.v, 0);
  const maxV = (() => {
    const raw = total * 1.04;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)) - 1);
    return Math.ceil(raw / pow) * pow;   // round headroom to a clean axis max
  })();

  // running cumulative for each step
  let run = 0;
  const blocks = items.map((s, i) => {
    const base = run; run += s.v;
    return { ...s, base, top: run, i, share: s.v / total };
  });
  const palette = ['var(--acl-pink)', 'var(--acl-blue)', 'var(--acl-yellow)', 'var(--acl-red)', '#B9A8E8'];
  const yPct = (v) => (1 - v / maxV) * 100;

  // columns laid out across the plot: steps + optional total column
  const cols = blocks.length + (showTotal ? 1 : 0);
  const colW = 100 / cols;

  return (
    <div className="acl-root acl-wf" style={{ background: bg }}>
      <style>{`
        .acl-wf{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-wf__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-wf__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-wf__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-wf__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-wf__summary{ margin-left:auto; max-width:560px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-wf__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-wf__panel{ flex:1; min-height:0; margin-top:30px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:9px 11px 0 rgba(22,21,15,.16);
          padding:34px 56px 18px; display:flex; flex-direction:column; }
        .acl-wf__plot{ position:relative; flex:1; }
        .acl-wf__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.14); }
        .acl-wf__gv{ position:absolute; right:calc(100% + 10px); transform:translateY(-50%);
          font-family:var(--acl-font-mono); font-size:13px; color:rgba(22,21,15,.4); white-space:nowrap; }

        .acl-wf__col{ position:absolute; bottom:0; height:100%; display:flex; justify-content:center; }
        .acl-wf__block{ position:absolute; width:62%; left:19%; border:3px solid var(--acl-ink);
          box-shadow:5px 5px 0 rgba(22,21,15,.16); transition:top .45s, height .45s; }
        .acl-wf__block--dim{ opacity:.34; filter:saturate(.6); }
        .acl-wf__block--total{ background:var(--acl-ink); box-shadow:6px 7px 0 rgba(22,21,15,.24); }
        .acl-wf__conn{ position:absolute; height:0; border-top:2.5px dashed rgba(22,21,15,.5); z-index:1; }
        .acl-wf__vlabel{ position:absolute; left:50%; transform:translate(-50%,-100%); white-space:nowrap;
          font-family:var(--acl-font-num); font-size:34px; line-height:1; color:var(--acl-ink); }
        .acl-wf__share{ position:absolute; left:50%; transform:translateX(-50%);
          font-family:var(--acl-font-mono); font-weight:700; font-size:14px; color:var(--acl-paper);
          background:var(--acl-ink); padding:2px 7px; white-space:nowrap; }
        .acl-wf__totnum{ position:absolute; left:50%; transform:translate(-50%,-100%); white-space:nowrap;
          font-family:var(--acl-font-num); font-size:46px; line-height:.9; color:var(--acl-ink); text-align:center; }
        .acl-wf__totnum em{ display:block; font-family:var(--acl-font-mono); font-style:normal;
          font-weight:700; font-size:14px; letter-spacing:.06em; color:rgba(22,21,15,.55); }

        .acl-wf__xaxis{ display:flex; margin-top:14px; flex:0 0 auto; }
        .acl-wf__xt{ text-align:center; padding:0 6px; }
        .acl-wf__xt b{ display:block; font-weight:900; font-size:22px; line-height:1.1; }
        .acl-wf__xt span{ font-family:var(--acl-font-mono); font-size:13px; letter-spacing:.03em;
          color:rgba(22,21,15,.5); }
        .acl-wf__xt--total b{ color:var(--acl-ink); }
        .acl-wf__xt--focus b{ color:var(--acl-pink); }

        .acl-wf__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-wf__block{ animation:acl-wf-pop .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .08s); }
        }
        @keyframes acl-wf-pop{ from{ opacity:0; transform:translateY(14px) scale(.96); } to{ opacity:1; transform:none; } }
      `}</style>

      <div className="acl-wf__head">
        <div>
          <div className="acl-wf__eyebrow">{eyebrow}</div>
          <h1 className="acl-wf__h">{headline}</h1>
        </div>
        <div className="acl-wf__sub">{subheadline}</div>
        <div className="acl-wf__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-wf__panel">
        <div className="acl-wf__plot">
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <React.Fragment key={i}>
              <div className="acl-wf__grid" style={{ top: `${(1 - f) * 100}%` }} />
              <div className="acl-wf__gv" style={{ top: `${(1 - f) * 100}%` }}>{Math.round(maxV * f)}</div>
            </React.Fragment>
          ))}

          {/* connectors between consecutive step tops */}
          {showConnectors && blocks.map((b, i) => {
            if (i === blocks.length - 1 && !showTotal) return null;
            const left = (i + 0.5) * colW + colW * 0.31;   // right edge of block i (block is 62% wide, centered)
            const right = (i + 1) * colW + colW * 0.19;     // left edge of next block
            return (
              <div key={i} className="acl-wf__conn"
                style={{ top: `${yPct(b.top)}%`, left: `${left}%`, width: `${right - left}%` }} />
            );
          })}

          {/* step blocks */}
          {blocks.map((b) => {
            const dim = focusEnabled && b.i !== focusIndex;
            const color = palette[b.i % palette.length];
            const topPct = yPct(b.top), botPct = yPct(b.base);
            return (
              <div key={b.i} className="acl-wf__col" style={{ left: `${b.i * colW}%`, width: `${colW}%`, '--i': b.i }}>
                {showValueLabels && (
                  <div className="acl-wf__vlabel" style={{ top: `${topPct}%`, marginTop: -8 }}>{b.v}</div>
                )}
                <div className={'acl-wf__block' + (dim ? ' acl-wf__block--dim' : '')}
                  style={{ background: color, top: `${topPct}%`, height: `${botPct - topPct}%` }}>
                  <div className="acl-wf__share" style={{ top: '50%', transform: 'translate(-50%,-50%)' }}>
                    {(b.share * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            );
          })}

          {/* total column */}
          {showTotal && (
            <div className="acl-wf__col" style={{ left: `${blocks.length * colW}%`, width: `${colW}%`, '--i': blocks.length }}>
              <div className="acl-wf__totnum" style={{ top: `${yPct(total)}%`, marginTop: -10 }}>
                {total}<em>{totalLabel}</em>
              </div>
              <div className="acl-wf__block acl-wf__block--total"
                style={{ top: `${yPct(total)}%`, height: `${100 - yPct(total)}%` }} />
            </div>
          )}
        </div>

        <div className="acl-wf__xaxis">
          {blocks.map((b) => (
            <div key={b.i} className={'acl-wf__xt' + (focusEnabled && b.i === focusIndex ? ' acl-wf__xt--focus' : '')}
              style={{ width: `${colW}%` }}>
              <b>{b.label}</b><span>{b.en}</span>
            </div>
          ))}
          {showTotal && (
            <div className="acl-wf__xt acl-wf__xt--total" style={{ width: `${colW}%` }}>
              <b>合计</b><span>TOTAL</span>
            </div>
          )}
        </div>
      </div>

      <div className="acl-wf__foot">
        {showDecor && <Doodle kind="loop" size={54} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && <Sticker label="WATERFALL" sub="贡献" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-3} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page22Waterfall.defaults = {
  backgroundTheme: 'primary',
  stepCount: 5,                // 2–5 contribution steps
  showTotal: true,             // final cumulative total bar
  focusEnabled: true,
  focusIndex: 0,               // which step is emphasised (others dim)
  showValueLabels: true,
  showConnectors: true,
  showDecor: true,
  eyebrow: 'Funding Waterfall',
  headline: '赛道贡献拆分',
  subheadline: '融资额贡献瀑布',
  summary: '全年 970 亿美元，由模型、应用、基础设施、芯片与其他<b>共同构成</b>。',
  unit: '亿美元',
  steps: [
    { label: '通用大模型', en: 'Foundation', v: 420 },
    { label: '垂直应用', en: 'Vertical', v: 245 },
    { label: '基础设施', en: 'Infra', v: 158 },
    { label: 'AI 芯片', en: 'Chips', v: 97 },
    { label: '其他', en: 'Others', v: 50 },
  ],
  totalLabel: '亿美元 · 全年',
  closingLine: '大模型制造热度，基础设施与应用承接兑现。',
};

Page22Waterfall.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'stepCount', type: 'number', default: 5, min: 2, max: 5, step: 1,
    label: '分段数量', desc: '瀑布累计的贡献分段数量(2–5)' },
  { key: 'showTotal', type: 'boolean', default: true,
    label: '合计列', desc: '末尾累计合计柱 显隐' },
  { key: 'focusEnabled', type: 'boolean', default: true,
    label: '重点强调', desc: '是否高亮某一分段(其余淡化)' },
  { key: 'focusIndex', type: 'number', default: 0, min: 0, max: 4, step: 1, maxFrom: 'stepCount',
    label: '重点对象', desc: '被强调的分段序号(从 0 起)' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各分段顶部数值 显隐' },
  { key: 'showConnectors', type: 'boolean', default: true,
    label: '连接线', desc: '分段之间的虚线连接 显隐' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘批注与贴纸标签 显隐' },
];

export const defaults = Page22Waterfall.defaults;
export const controls = Page22Waterfall.controls;
