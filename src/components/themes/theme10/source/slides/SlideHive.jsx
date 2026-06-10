// SlideHive.jsx — 蜂窝指标 / an interlocking honeycomb of KPI hexagons.
// A lead hex (section caption) nests with a comb of metric hexagons, each a big
// mono figure + label; one can be focused (accent fill) while the rest recede.
// A bold, non-rectangular take on a metric grid — distinct from SlideStatGrid /
// Slide02Metrics (rectangular cards) and SlideGauges (radial rings). Standalone
// & migratable: depends only on React (imported). Token-driven, light/dark tone
// applies. CSS scoped `.hiv-`.
//
// ── Props (canonical list in SlideHive.META.controls) ─────────────────────────
//   tileCount    number 4..7   how many metric hexagons                    (6)
//   showLeadHex  boolean       the leading caption hex                     (true)
//   showUnits    boolean       the small unit line under each figure       (true)
//   focus        boolean       emphasise one metric, dim the rest          (false)
//   focusIndex   number 1..7   which metric is emphasised (1-based)        (1)
//
// Content props (authored at call-site):
//   overline, title, lead:{ kicker, line }, metrics:[{ value, unit, label }]

import React from 'react';

function SlideHive({
  overline = '一图速览 · THE NUMBERS AT A GLANCE',
  title = '一组数字，勾勒这一年的组合',
  lead = { kicker: '2025', line: '自主指数\n年度切片' },
  metrics = [
    { value: '6.4', unit: '%', label: '年化净回报' },
    { value: '0.71', unit: 'SHARPE', label: '风险调整后' },
    { value: '8.2', unit: '%', label: '最大回撤' },
    { value: '23', unit: '只', label: '持仓标的' },
    { value: '0.18', unit: '%', label: '综合费率' },
    { value: '14', unit: '年', label: '回测区间' },
    { value: '92', unit: '%', label: '纪律执行率' },
  ],
  tileCount = 6, showLeadHex = true, showUnits = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { hivInjectStyle(); }, []);
  const n = Math.max(4, Math.min(metrics.length, tileCount));
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const cells = [];
  if (showLeadHex) cells.push({ lead: true });
  metrics.slice(0, n).forEach((m, i) => cells.push({ ...m, mi: i }));
  const half = Math.ceil(cells.length / 2);
  const top = cells.slice(0, half);
  const bot = cells.slice(half);

  const Hex = (c, key) => {
    if (c.lead) {
      return (
        <div className="hiv-hex is-lead" key={key}>
          <span className="hiv-kicker">{lead.kicker}</span>
          <span className="hiv-leadline">{lead.line}</span>
        </div>
      );
    }
    const hot = fIdx < 0 || fIdx === c.mi;
    const isHot = fIdx === c.mi;
    const cn = (c.mi % 6) + 1;
    return (
      <div className={`hiv-hex ${isHot ? 'is-hot' : ''} ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={key}
           style={isHot ? undefined : { background: `var(--ds-c${cn}-soft)` }}>
        <span className="hiv-val" style={isHot ? undefined : { color: `var(--ds-c${cn})` }}>{c.value}{showUnits && <span className="hiv-unit">{c.unit}</span>}</span>
        <span className="hiv-label">{c.label}</span>
      </div>
    );
  };

  return (
    <div className="hiv-root">
      <div className="hiv-head">
        <div className="hiv-overline">{overline}</div>
        <h2 className="hiv-title">{title}</h2>
      </div>
      <div className="hiv-combwrap">
        <div className="hiv-comb">
          <div className="hiv-row">{top.map((c, i) => Hex(c, 't' + i))}</div>
          {bot.length > 0 && <div className="hiv-row is-offset">{bot.map((c, i) => Hex(c, 'b' + i))}</div>}
        </div>
      </div>
    </div>
  );
}

function hivInjectStyle() {
  if (document.getElementById('hiv-style')) return;
  const s = document.createElement('style'); s.id = 'hiv-style';
  s.textContent = `
  .hiv-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .hiv-head{margin-bottom:18px;}
  .hiv-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .hiv-title{font-size:56px;font-weight:300;margin:14px 0 0;line-height:1.1;}
  .hiv-combwrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;}
  .hiv-comb{display:flex;flex-direction:column;}
  .hiv-row{display:flex;gap:20px;}
  .hiv-row.is-offset{margin-top:-74px;margin-left:160px;}
  .hiv-hex{width:300px;height:346px;flex:0 0 auto;display:flex;flex-direction:column;align-items:center;
    justify-content:center;gap:8px;text-align:center;padding:0 30px;
    clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
    background:var(--ds-card,rgba(255,255,255,.05));
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.12));
    transition:opacity .3s ease,transform .3s ease;}
  /* clip-path can't render a ring border, so draw an inner hex outline via a pseudo overlay */
  .hiv-hex{position:relative;}
  .hiv-hex.is-dim{opacity:.34;}
  .hiv-hex.is-lead{background:var(--ds-grad,linear-gradient(118deg,#14233b,#236560 66%,#48b3a6));color:#f4f6f5;}
  .hiv-hex.is-hot{background:linear-gradient(150deg,var(--ds-c1) 0%,var(--ds-c3) 58%,var(--ds-c4) 100%);color:#fff;}
  .hiv-kicker{font-family:var(--font-mono);font-size:28px;letter-spacing:.18em;opacity:.78;}
  .hiv-leadline{font-size:38px;font-weight:300;line-height:1.18;white-space:pre-line;}
  .hiv-val{font-family:var(--font-mono);font-size:72px;font-weight:300;line-height:1;letter-spacing:-.01em;
    font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:6px;}
  .hiv-unit{font-size:26px;letter-spacing:.04em;opacity:.62;}
  .hiv-hex.is-hot .hiv-unit{opacity:.7;}
  .hiv-label{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.66));line-height:1.2;}
  .hiv-hex.is-hot .hiv-label{color:rgba(255,255,255,.82);}
  `;
  document.head.appendChild(s);
}

SlideHive.META = {
  id: 'hive', title: '蜂窝指标',
  defaults: { tileCount: 6, showLeadHex: true, showUnits: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'tileCount', type: 'slider', label: '指标数量', default: 6, min: 4, max: 7, step: 1,
      description: '蜂窝中的指标六边形数量。' },
    { key: 'showLeadHex', type: 'toggle', label: '引导蜂格', default: true,
      description: '蜂窝起始的标题 / 说明六边形。' },
    { key: 'showUnits', type: 'toggle', label: '单位标注', default: true,
      description: '每个数字旁的单位（% / SHARPE / 只 …）。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一个指标，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 7, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的指标。' },
  ],
};

export { SlideHive };
export const META = SlideHive.META;
export default SlideHive;
