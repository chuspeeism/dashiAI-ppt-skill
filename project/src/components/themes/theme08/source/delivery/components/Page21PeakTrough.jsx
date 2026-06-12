// Page21PeakTrough.jsx — "Extremes / Peak-Trough" template page (chart-led)
// ─────────────────────────────────────────────────────────────────────────────
// Independent prop-driven slide. Class prefix `acl-pt-`.
// A single-series distribution chart that calls out the EXTREMES of a sequence:
// the N highest points ("peaks") and N lowest points ("troughs") are colour-
// coded against the rest, with an optional mean baseline. Renders as columns or
// lollipops. Fully portable — no dependency on the Tweaks panel; the preview
// only maps Tweak values onto props.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { Doodle, Sticker } from './AclPrimitives.jsx';

const aclPtCeil = (v) => {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil((v * 1.06) / p) * p;
};

export default function Page21PeakTrough(props) {
  const p = { ...Page21PeakTrough.defaults, ...props };
  const {
    backgroundTheme, chartType, barCount, highlightHighCount, highlightLowCount,
    showBaseline, showValueLabels, showDecor,
    eyebrow, headline, subheadline, summary, unit, series, peakNote, troughNote, closingLine,
  } = p;

  const bg = backgroundTheme === 'muted'
    ? 'linear-gradient(165deg, #EFEFF6 0%, #E7E6EE 58%, #DEDCEA 100%)'
    : 'linear-gradient(168deg, #F4F66C 0%, #ECEF35 44%, #E2E62A 100%)';

  // take the first `barCount` data points
  const data = series.slice(0, Math.max(4, barCount));
  const n = data.length;
  const values = data.map((d) => d.v);
  const maxV = aclPtCeil(Math.max(...values));
  const mean = values.reduce((a, b) => a + b, 0) / n;

  // rank to find extremes
  const order = data.map((d, i) => i).sort((a, b) => values[b] - values[a]);
  const highSet = new Set(order.slice(0, Math.max(0, highlightHighCount)));
  const lowSet = new Set(order.slice(n - Math.max(0, highlightLowCount)));
  const kindOf = (i) => (highSet.has(i) ? 'high' : lowSet.has(i) ? 'low' : 'base');

  // geometry (percentage within plot)
  const CW = 1000, CH = 360;
  const band = CW / n;
  const cx = (i) => band * (i + 0.5);
  const yPct = (v) => (1 - v / maxV) * 100;
  const barW = Math.min(74, band * 0.5);

  return (
    <div className="acl-root acl-pt" style={{ background: bg }}>
      <style>{`
        .acl-pt{ position:absolute; inset:0; overflow:hidden; font-family:var(--acl-font-cn);
          color:var(--acl-ink); padding:78px 100px 70px; display:flex; flex-direction:column; }
        .acl-pt__head{ display:flex; align-items:flex-end; gap:26px; flex:0 0 auto; }
        .acl-pt__eyebrow{ font-family:var(--acl-font-mono); font-weight:700; font-size:24px;
          letter-spacing:.16em; text-transform:uppercase; color:rgba(22,21,15,.55); margin-bottom:10px; }
        .acl-pt__h{ font-weight:900; font-size:78px; line-height:.95; margin:0; }
        .acl-pt__sub{ font-family:var(--acl-font-mono); font-weight:700; font-size:22px;
          padding:8px 14px; background:var(--acl-ink); color:var(--acl-yellow); transform:rotate(-2deg);  white-space:nowrap;}
        .acl-pt__summary{ margin-left:auto; max-width:560px; font-weight:700; font-size:24px;
          line-height:1.4; text-align:right; text-wrap:balance; }
        .acl-pt__summary b{ background:var(--acl-blue); padding:0 .14em; box-decoration-break:clone;
          -webkit-box-decoration-break:clone;  white-space:nowrap;}

        .acl-pt__panel{ flex:1; min-height:0; margin-top:30px; position:relative; background:var(--acl-paper);
          border:3px solid var(--acl-ink); box-shadow:9px 11px 0 rgba(22,21,15,.16);
          padding:30px 46px 22px; display:flex; flex-direction:column; }
        .acl-pt__legend{ display:flex; align-items:center; gap:26px; flex:0 0 auto; }
        .acl-pt__lg{ display:flex; align-items:center; gap:9px; font-family:var(--acl-font-mono);
          font-weight:700; font-size:16px; letter-spacing:.04em; text-transform:uppercase;
          color:rgba(22,21,15,.62); white-space:nowrap; }
        .acl-pt__sw{ width:20px; height:20px; border:2.5px solid var(--acl-ink); }
        .acl-pt__lgnote{ margin-left:auto; font-family:var(--acl-font-hand); font-size:24px;
          color:rgba(22,21,15,.7); white-space:nowrap; }
        .acl-pt__unit{ font-family:var(--acl-font-mono); font-size:15px; font-weight:700;
          letter-spacing:.05em; color:rgba(22,21,15,.5); white-space:nowrap; }

        .acl-pt__plot{ position:relative; flex:1; margin-top:18px; }
        .acl-pt__grid{ position:absolute; left:0; right:0; height:0; border-top:1.5px dashed rgba(22,21,15,.14); }
        .acl-pt__base{ position:absolute; left:0; right:0; height:0; border-top:3px dashed var(--acl-ink);
          z-index:4; }
        .acl-pt__baselbl{ position:absolute; left:0; transform:translateY(-50%);
          font-family:var(--acl-font-mono); font-weight:700; font-size:14px; letter-spacing:.04em;
          background:var(--acl-ink); color:var(--acl-paper); padding:3px 8px; }

        .acl-pt__col{ position:absolute; bottom:0; transform:translateX(-50%); display:flex;
          flex-direction:column; align-items:center; justify-content:flex-end; height:100%; }
        .acl-pt__bar{ width:100%; background:rgba(22,21,15,.16); border:3px solid var(--acl-ink);
          border-bottom:none; transition:height .45s cubic-bezier(.2,.8,.2,1); }
        .acl-pt__bar--high{ background:var(--acl-pink); box-shadow:4px 0 0 rgba(22,21,15,.18); }
        .acl-pt__bar--low{ background:var(--acl-blue); }
        /* lollipop variant */
        .acl-pt__stem{ width:5px; background:var(--acl-ink); }
        .acl-pt__dot{ width:30px; height:30px; border-radius:50%; border:4px solid var(--acl-ink);
          background:var(--acl-paper); margin-bottom:-15px; z-index:2; }
        .acl-pt__dot--high{ background:var(--acl-pink); width:40px; height:40px; margin-bottom:-20px; }
        .acl-pt__dot--low{ background:var(--acl-blue); }

        .acl-pt__vlabel{ position:absolute; transform:translate(-50%,-100%); white-space:nowrap;
          font-family:var(--acl-font-num); font-size:30px; line-height:1; color:rgba(22,21,15,.65);
          text-shadow:0 0 7px var(--acl-paper),0 0 7px var(--acl-paper),0 0 7px var(--acl-paper); }
        .acl-pt__vlabel--high{ color:var(--acl-pink); font-size:38px; }
        .acl-pt__vlabel--low{ color:var(--acl-ink); }
        .acl-pt__flag{ position:absolute; transform:translate(-50%,-100%); white-space:nowrap;
          font-family:var(--acl-font-mono); font-weight:700; font-size:13px; letter-spacing:.05em;
          text-transform:uppercase; padding:3px 8px; }
        .acl-pt__flag--high{ background:var(--acl-pink); color:var(--acl-paper); }
        .acl-pt__flag--low{ background:var(--acl-blue); color:var(--acl-ink); }

        .acl-pt__xaxis{ display:flex; margin-top:14px; flex:0 0 auto; }
        .acl-pt__xt{ flex:1; text-align:center; font-weight:900; font-size:22px; color:rgba(22,21,15,.5); }
        .acl-pt__xt--high{ color:var(--acl-pink); }
        .acl-pt__xt--low{ color:var(--acl-ink); }

        .acl-pt__foot{ display:flex; align-items:center; gap:14px; font-family:var(--acl-font-hand);
          font-size:28px; margin-top:18px; flex:0 0 auto; }
        @media (prefers-reduced-motion:no-preference){
          [data-deck-active] .acl-pt__col{ animation:acl-pt-grow .5s cubic-bezier(.2,.8,.2,1) both;
            animation-delay:calc(var(--i,0) * .035s); }
        }
        @keyframes acl-pt-grow{ from{ opacity:0; transform:translate(-50%,16px); } to{ opacity:1; transform:translateX(-50%); } }
      `}</style>

      <div className="acl-pt__head">
        <div>
          <div className="acl-pt__eyebrow">{eyebrow}</div>
          <h1 className="acl-pt__h">{headline}</h1>
        </div>
        <div className="acl-pt__sub">{subheadline}</div>
        <div className="acl-pt__summary" dangerouslySetInnerHTML={{ __html: summary }} />
      </div>

      <div className="acl-pt__panel">
        <div className="acl-pt__legend">
          {highlightHighCount > 0 && (
            <div className="acl-pt__lg"><span className="acl-pt__sw" style={{ background: 'var(--acl-pink)' }} />峰值 · Peak</div>
          )}
          {highlightLowCount > 0 && (
            <div className="acl-pt__lg"><span className="acl-pt__sw" style={{ background: 'var(--acl-blue)' }} />低位 · Trough</div>
          )}
          <div className="acl-pt__lg"><span className="acl-pt__sw" style={{ background: 'rgba(22,21,15,.16)' }} />常态</div>
          <span className="acl-pt__unit">单位 · {unit}</span>
          {showDecor && <div className="acl-pt__lgnote">峰谷差 = 交易集中度</div>}
        </div>

        <div className="acl-pt__plot">
          {[0.25, 0.5, 0.75, 1].map((f, i) => (
            <div key={i} className="acl-pt__grid" style={{ top: `${(1 - f) * 100}%` }} />
          ))}
          {showBaseline && (
            <React.Fragment>
              <div className="acl-pt__base" style={{ top: `${yPct(mean)}%` }} />
              <div className="acl-pt__baselbl" style={{ top: `${yPct(mean)}%` }}>均值 {mean.toFixed(0)}</div>
            </React.Fragment>
          )}

          {data.map((d, i) => {
            const k = kindOf(i);
            const hPct = (d.v / maxV) * 100;
            const isLolli = chartType === 'lollipop';
            return (
              <div key={i} className="acl-pt__col" style={{ left: `${(cx(i) / CW) * 100}%`,
                width: `${(barW / CW) * 100}%`, '--i': i }}>
                {showValueLabels && (
                  <div className={'acl-pt__vlabel' + (k !== 'base' ? ' acl-pt__vlabel--' + k : '')}
                    style={{ position: 'absolute', left: '50%', bottom: `calc(${hPct}% + ${isLolli ? 26 : 8}px)` }}>
                    {d.v}
                  </div>
                )}
                {showDecor && k === 'high' && (
                  <div className="acl-pt__flag acl-pt__flag--high"
                    style={{ position: 'absolute', left: '50%', bottom: `calc(${hPct}% + ${showValueLabels ? 56 : 8}px)` }}>{peakNote}</div>
                )}
                {showDecor && k === 'low' && (
                  <div className="acl-pt__flag acl-pt__flag--low"
                    style={{ position: 'absolute', left: '50%', bottom: `calc(${hPct}% + ${showValueLabels ? 44 : 8}px)` }}>{troughNote}</div>
                )}
                {isLolli ? (
                  <React.Fragment>
                    <div className="acl-pt__stem" style={{ height: `calc(${hPct}% - 14px)` }} />
                    <div className={'acl-pt__dot' + (k !== 'base' ? ' acl-pt__dot--' + k : '')} />
                  </React.Fragment>
                ) : (
                  <div className={'acl-pt__bar' + (k !== 'base' ? ' acl-pt__bar--' + k : '')}
                    style={{ height: `${hPct}%` }} />
                )}
              </div>
            );
          })}
        </div>

        <div className="acl-pt__xaxis">
          {data.map((d, i) => {
            const k = kindOf(i);
            return <div key={i} className={'acl-pt__xt' + (k !== 'base' ? ' acl-pt__xt--' + k : '')}>{d.label}</div>;
          })}
        </div>
      </div>

      <div className="acl-pt__foot">
        {showDecor && <Doodle kind="arrowS" size={50} style={{ position: 'static' }} />}
        <span>{closingLine}</span>
        {showDecor && <Sticker label="MONTHLY" sub="峰谷" color="var(--acl-yellow)" subColor="var(--acl-pink)" rotate={-3} style={{ marginLeft: 'auto' }} />}
      </div>
    </div>
  );
}

Page21PeakTrough.defaults = {
  backgroundTheme: 'primary',
  chartType: 'column',         // 'column' | 'lollipop'
  barCount: 12,                // 4–12 sequence points shown
  highlightHighCount: 2,       // top-N points marked as peaks
  highlightLowCount: 2,        // bottom-N points marked as troughs
  showBaseline: true,          // mean reference line
  showValueLabels: true,
  showDecor: true,
  eyebrow: 'Peak & Trough',
  headline: '峰值与低位',
  subheadline: '月度峰谷对比',
  summary: '8 月为全年峰值，1 月为低位，<b>峰谷差体现交易集中度</b>。',
  unit: '亿美元',
  series: [
    { label: '1月', v: 45 }, { label: '2月', v: 58 }, { label: '3月', v: 59 },
    { label: '4月', v: 86 }, { label: '5月', v: 105 }, { label: '6月', v: 93 },
    { label: '7月', v: 92 }, { label: '8月', v: 118 }, { label: '9月', v: 108 },
    { label: '10月', v: 73 }, { label: '11月', v: 81 }, { label: '12月', v: 52 },
  ],
  peakNote: '高点',
  troughNote: '低点',
  closingLine: '月度波动背后，是头部交易的释放节奏。',
};

Page21PeakTrough.controls = [
  { key: 'backgroundTheme', type: 'enum', default: 'primary', options: ['primary', 'muted'],
    label: '背景主题', desc: '主色(电光黄) 或 次色(淡紫灰) 底色' },
  { key: 'chartType', type: 'enum', default: 'column', options: ['column', 'lollipop'],
    label: '图表类型', desc: '序列呈现：柱状 / 棒棒糖（细茎圆点）' },
  { key: 'barCount', type: 'number', default: 12, min: 4, max: 12, step: 1,
    label: '数据点数', desc: '展示的序列点数量(4–12)' },
  { key: 'highlightHighCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '高点标注', desc: '强调为峰值的最高 N 个点(0–4)' },
  { key: 'highlightLowCount', type: 'number', default: 2, min: 0, max: 4, step: 1,
    label: '低点标注', desc: '强调为低位的最低 N 个点(0–4)' },
  { key: 'showBaseline', type: 'boolean', default: true,
    label: '均值基线', desc: '横跨图表的平均值参考线 显隐' },
  { key: 'showValueLabels', type: 'boolean', default: true,
    label: '数值标签', desc: '各数据点上的数值 显隐' },
  { key: 'showDecor', type: 'boolean', default: true,
    label: '装饰元素', desc: '手绘批注、贴纸与极值旗标 显隐' },
];

export const defaults = Page21PeakTrough.defaults;
export const controls = Page21PeakTrough.controls;
