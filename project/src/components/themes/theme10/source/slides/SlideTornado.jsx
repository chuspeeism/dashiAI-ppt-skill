// SlideTornado.jsx — 敏感性龙卷风图 / a tornado sensitivity chart.
// Each driver gets a bar swinging LEFT (下行情形) and RIGHT (上行情形) from a
// central baseline; rows are sorted by total swing so the widest sits on top —
// the signature "tornado" silhouette. Built for sensitivity / scenario analysis
// (哪些变量最能左右结果). Distinct from SlideDiverging (a signed annual P&L bar
// chart, one value per row) and SlideDumbbell (two point markers, no baseline).
// Standalone & migratable: depends only on React (imported). Token-driven,
// light/dark tone applies. CSS scoped `.trn-`.
//
// ── Props (canonical list in SlideTornado.META.controls) ──────────────────────
//   factorCount  number 4..7   how many drivers are charted               (6)
//   showValues   boolean       the ± figure at each bar tip               (true)
//   showBaseline boolean       the central reference rule + label         (true)
//   focus        boolean       emphasise one driver, dim the rest         (false)
//   focusIndex   number 1..7   which driver is emphasised (1-based)       (1)
//
// Content props (authored at call-site):
//   overline, title, base, factors:[{ name, down, up, downLabel, upLabel }]

import React from 'react';

function SlideTornado({
  overline = '敏感性分析 · WHAT MOVES THE OUTCOME',
  title = '哪些变量最能左右十年回报',
  base = '基准情形 · 年化 6.4%',
  factors = [
    { name: '权益久期配置', down: 3.4, up: 4.1, downLabel: '-3.4%', upLabel: '+4.1%' },
    { name: '通胀路径', down: 2.9, up: 2.6, downLabel: '-2.9%', upLabel: '+2.6%' },
    { name: '再平衡纪律', down: 1.7, up: 2.8, downLabel: '-1.7%', upLabel: '+2.8%' },
    { name: '费率与摩擦', down: 2.1, up: 1.2, downLabel: '-2.1%', upLabel: '+1.2%' },
    { name: '汇率敞口', down: 1.5, up: 1.4, downLabel: '-1.5%', upLabel: '+1.4%' },
    { name: '现金缓冲比例', down: 0.9, up: 1.1, downLabel: '-0.9%', upLabel: '+1.1%' },
    { name: '税务时点', down: 0.7, up: 0.8, downLabel: '-0.7%', upLabel: '+0.8%' },
  ],
  factorCount = 6, showValues = true, showBaseline = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { trnInjectStyle(); }, []);
  const n = Math.max(2, Math.min(factors.length, factorCount));
  const rows = factors.slice(0, n).slice().sort((a, b) => (b.down + b.up) - (a.down + a.up));
  const maxAbs = Math.max(...rows.map((r) => Math.max(r.down, r.up)), 1);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="trn-root">
      <div className="trn-head">
        <div className="trn-headl">
          <div className="trn-overline">{overline}</div>
          <h2 className="trn-title">{title}</h2>
        </div>
        <div className="trn-legend">
          <span className="trn-lg"><span className="trn-sw is-down" />下行情形</span>
          <span className="trn-lg"><span className="trn-sw is-up" />上行情形</span>
        </div>
      </div>

      <div className="trn-chart">
        {showBaseline && <span className="trn-axis" />}
        {rows.map((r, i) => {
          const hot = fIdx < 0 || fIdx === i;
          const dim = fIdx >= 0 && fIdx !== i;
          return (
            <div className={`trn-row ${dim ? 'is-dim' : ''}`} key={i}>
              <span className="trn-name">{r.name}</span>
              <div className="trn-bars">
                <span className="trn-bar is-down" style={{ width: `${(r.down / maxAbs) * 50}%` }} />
                {showValues && <span className="trn-val down" style={{ right: `${50 + (r.down / maxAbs) * 50}%` }}>{r.downLabel}</span>}
                <span className={`trn-bar is-up ${hot && fIdx >= 0 ? 'is-hot' : ''}`} style={{ width: `${(r.up / maxAbs) * 50}%` }} />
                {showValues && <span className="trn-val up" style={{ left: `${50 + (r.up / maxAbs) * 50}%` }}>{r.upLabel}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {showBaseline && <div className="trn-foot"><span className="trn-fdot" />{base}</div>}
    </div>
  );
}

function trnInjectStyle() {
  if (document.getElementById('trn-style')) return;
  const s = document.createElement('style'); s.id = 'trn-style';
  s.textContent = `
  .trn-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .trn-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:54px;}
  .trn-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .trn-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.1;}
  .trn-legend{display:flex;gap:34px;flex:0 0 auto;}
  .trn-lg{display:flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:23px;letter-spacing:.06em;
    color:var(--ds-muted,rgba(242,243,246,.62));white-space:nowrap;}
  .trn-sw{width:26px;height:14px;border-radius:3px;}
  .trn-sw.is-down{background:currentColor;opacity:.34;}
  .trn-sw.is-up{background:var(--ds-accent,#6f9bd8);}
  .trn-chart{position:relative;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:26px;}
  .trn-axis{position:absolute;left:calc(260px + 80px + (100% - 340px)/2);top:0;bottom:0;width:2px;margin-left:-1px;
    background:var(--ds-line,rgba(242,243,246,.22));}
  .trn-row{display:grid;grid-template-columns:260px 1fr;column-gap:80px;align-items:center;transition:opacity .25s ease;}
  .trn-row.is-dim{opacity:.38;}
  .trn-name{font-size:29px;font-weight:300;text-align:right;}
  .trn-bars{position:relative;height:46px;}
  .trn-bar{position:absolute;top:50%;transform:translateY(-50%);height:46px;transition:width .45s cubic-bezier(.3,.7,.4,1);}
  .trn-bar.is-down{right:50%;background:linear-gradient(270deg,var(--ds-c6),color-mix(in srgb,var(--ds-c6) 58%,#fff));opacity:.85;border-radius:6px 2px 2px 6px;}
  .trn-bar.is-up{left:50%;background:linear-gradient(90deg,var(--ds-c1),color-mix(in srgb,var(--ds-c1) 58%,#fff));opacity:1;border-radius:2px 6px 6px 2px;}
  .trn-bar.is-up.is-hot{opacity:1;box-shadow:0 0 0 1.5px color-mix(in srgb,var(--ds-c1) 60%,transparent);}
  .trn-val{position:absolute;top:50%;font-family:var(--font-mono);font-size:25px;font-variant-numeric:tabular-nums;
    color:var(--ds-muted,rgba(242,243,246,.66));white-space:nowrap;}
  .trn-val.down{transform:translate(-100%,-50%);padding-right:14px;}
  .trn-val.up{transform:translateY(-50%);padding-left:14px;}
  .trn-foot{display:flex;align-items:center;gap:16px;margin-top:46px;font-family:var(--font-mono);font-size:24px;
    letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .trn-fdot{width:12px;height:12px;border-radius:50%;background:var(--ds-ink,#f2f3f6);opacity:.7;}
  `;
  document.head.appendChild(s);
}

SlideTornado.META = {
  id: 'tornado', title: '敏感性龙卷风图',
  defaults: { factorCount: 6, showValues: true, showBaseline: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'factorCount', type: 'slider', label: '变量数量', default: 6, min: 2, max: 7, step: 1,
      description: '参与敏感性分析的驱动变量条数（自动按总摆幅排序）。' },
    { key: 'showValues', type: 'toggle', label: '数值标注', default: true,
      description: '每根条形末端显示 ± 影响幅度。' },
    { key: 'showBaseline', type: 'toggle', label: '基准轴', default: true,
      description: '中央基准参考线与底部基准情形说明。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一个变量，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的变量（按排序后顺序）。' },
  ],
};

export { SlideTornado };
export const META = SlideTornado.META;
export default SlideTornado;
