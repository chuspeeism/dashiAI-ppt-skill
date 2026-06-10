// SlideGrouped.jsx — 分组柱图 / clustered multi-series bars.
// Categories along the x-axis, each holding a small cluster of bars (one per
// series) so you can compare series WITHIN and ACROSS categories. Distinct from
// SlideStacked (segments summed in one bar), DeckBars (single series ranking)
// and SlideDiverging (signed): this is grouped comparison. Standalone &
// migratable: depends only on React (imported). Token-driven. CSS scoped `.grp-`.
//
// ── Props (canonical list in SlideGrouped.META.controls) ──────────────────────
//   groupCount   number 3..6   how many category groups                    (5)
//   seriesCount  number 2..3   bars per group                              (2)
//   showValues   boolean       value atop each bar                         (true)
//   showLegend   boolean       the series legend                          (true)
//   showAxis     boolean       the baseline + category labels             (true)
//   focusSeries  number 0..3   emphasise one series (0 = none)            (0)
//
// Content props (authored at call-site):
//   overline, title, unit, seriesNames:[string],
//   groups:[{ label, values:[number] }]

import React from 'react';

function SlideGrouped({
  overline = '基准对比 · VS BENCHMARK', title = '同期，我们跑赢在哪儿',
  unit = '%', seriesNames = ['自主指数', '同类平均', '大盘基准'],
  groups = [
    { label: '1 年', values: [10.4, 6.1, 7.8] },
    { label: '3 年', values: [11.2, 5.4, 6.9] },
    { label: '5 年', values: [12.0, 6.8, 8.1] },
    { label: '波动率', values: [9.1, 13.4, 12.2] },
    { label: '最大回撤', values: [8.3, 16.0, 14.5] },
    { label: '夏普', values: [1.3, 0.7, 0.9] },
  ],
  groupCount = 6, seriesCount = 3, showValues = true, showLegend = true, showAxis = true, focusSeries = 0,
}) {
  React.useEffect(() => { grpInjectStyle(); }, []);
  const gn = Math.max(3, Math.min(groups.length, groupCount));
  const sn = Math.max(2, Math.min(3, seriesCount));
  const used = groups.slice(0, gn);
  const names = seriesNames.slice(0, sn);
  const maxV = Math.max(...used.flatMap((g) => g.values.slice(0, sn))) || 1;
  const RAMP = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c6)'];
  const HERO = 'linear-gradient(0deg,#3f57b8 0%,#86a9f2 100%)';
  const fSer = Math.max(0, Math.min(sn, focusSeries)) - 1;

  return (
    <div className="grp-root">
      <div className="grp-head">
        <div className="grp-topline">
          <div>
            <div className="grp-overline">{overline}</div>
            <h2 className="grp-title">{title}</h2>
          </div>
          {showLegend && (
            <ul className="grp-legend">
              {names.map((nm, i) => (
                <li key={i} className={fSer >= 0 && fSer !== i ? 'dim' : ''}>
                  <span className="grp-key" style={{ background: RAMP[i] }} />{nm}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grp-stage">
        <div className={`grp-plot ${showAxis ? 'has-axis' : ''}`} style={{ gridTemplateColumns: `repeat(${gn}, 1fr)` }}>
          {used.map((g, gi) => (
            <div className="grp-group" key={gi}>
              <div className="grp-bars">
                {g.values.slice(0, sn).map((v, si) => {
                  const h = Math.max(1.5, (v / maxV) * 88);
                  const dim = fSer >= 0 && fSer !== si;
                  return (
                    <div className="grp-barwrap" key={si}>
                      <div className={`grp-bar ${si === 0 ? 'is-hero' : ''} ${dim ? 'is-dim' : ''}`}
                           style={{ height: `${h}%`, background: si === 0 ? HERO : `linear-gradient(0deg, ${RAMP[si]} 0%, color-mix(in srgb, ${RAMP[si]} 45%, #fff) 100%)` }}>
                        {showValues && <span className="grp-val">{v}{unit}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {showAxis && <span className="grp-xlab">{g.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function grpInjectStyle() {
  if (document.getElementById('grp-style')) return;
  const s = document.createElement('style'); s.id = 'grp-style';
  s.textContent = `
  .grp-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .grp-head{margin-bottom:30px;}
  .grp-topline{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;}
  .grp-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .grp-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.06;}
  .grp-legend{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:14px 28px;justify-content:flex-end;}
  .grp-legend li{display:flex;align-items:center;gap:11px;font-size:25px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.72));transition:opacity .25s;}
  .grp-legend li.dim{opacity:.4;}
  .grp-key{width:18px;height:18px;border-radius:4px;display:inline-block;}
  .grp-stage{flex:1;min-height:0;display:flex;}
  .grp-plot{flex:1;display:grid;gap:30px;align-items:stretch;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.16));}
  .grp-plot.has-axis{padding-bottom:0;}
  .grp-group{display:flex;flex-direction:column;min-width:0;}
  .grp-bars{flex:1;display:flex;align-items:flex-end;justify-content:center;gap:12px;padding:0 6px;}
  .grp-barwrap{flex:1;max-width:90px;height:100%;display:flex;align-items:flex-end;}
  .grp-bar{position:relative;width:100%;border-radius:7px 7px 0 0;transition:opacity .25s;}
  .grp-bar.is-hero{}
  .grp-bar.is-dim{opacity:.45;}
  .grp-val{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:10px;
    font-family:var(--font-mono);font-size:24px;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--ds-muted,rgba(242,243,246,.7));}
  .grp-bar.is-hero .grp-val{color:var(--ds-ink,#f2f3f6);font-size:27px;}
  .grp-xlab{margin-top:18px;text-align:center;font-family:var(--font-mono);font-size:26px;letter-spacing:.04em;
    color:var(--ds-faint,rgba(242,243,246,.5));}
  `;
  document.head.appendChild(s);
}

SlideGrouped.META = {
  id: 'grouped', title: '分组柱图',
  defaults: { groupCount: 6, seriesCount: 3, showValues: true, showLegend: true, showAxis: true, focusSeries: 0 },
  controls: [
    { key: 'groupCount', type: 'slider', label: '分组数量', default: 6, min: 3, max: 6, step: 1,
      description: 'x 轴上的类别分组数量。' },
    { key: 'seriesCount', type: 'slider', label: '系列数量', default: 3, min: 2, max: 3, step: 1,
      description: '每组内的柱子（对比系列）数量。' },
    { key: 'showValues', type: 'toggle', label: '柱顶数值', default: true,
      description: '每根柱子顶部的数值。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右上角的系列图例。' },
    { key: 'showAxis', type: 'toggle', label: '坐标轴', default: true,
      description: '底部基线与类别标签。' },
    { key: 'focusSeries', type: 'slider', label: '强调系列', default: 0, min: 0, max: 3, step: 1,
      description: '高亮某一系列（0 为不强调，其余弱化）。' },
  ],
};

export { SlideGrouped };
export const META = SlideGrouped.META;
export default SlideGrouped;
