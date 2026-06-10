// SlideCalendar.jsx — 月度回报日历热度 / monthly-return calendar heatmap.
// A 12-month grid where each month cell is tinted by its return magnitude (cool
// accent for gains, faint warm for losses), with the value printed. A side panel
// totals the year and flags best/worst months. Distinct from SlideMatrix (a
// labelled numeric table) and SlideDashboard (charts): this is a temporal heat
// field. Standalone & migratable: depends only on React (imported). Token-driven.
// CSS scoped under `.cal-`.
//
// ── Props (canonical list in SlideCalendar.META.controls) ─────────────────────
//   columns      number 3..6   grid columns (rows auto-fill to 12)          (4)
//   showValues   boolean       the % return inside each month cell          (true)
//   showSummary  boolean       the right summary rail (YTD/best/worst)       (true)
//   accentLoss   boolean       tint losing months too (vs leave faint)      (true)
//
// Content props (authored at call-site):
//   overline, title, year, months:[{m, v}]  (v = monthly return %)

import React from 'react';

function SlideCalendar({
  overline = '回报节律 · MONTHLY', title = '一年里的每个月',
  year = '2025',
  months = [
    { m: '一月', v: 2.1 }, { m: '二月', v: -0.8 }, { m: '三月', v: 1.4 }, { m: '四月', v: 3.0 },
    { m: '五月', v: 0.6 }, { m: '六月', v: -1.6 }, { m: '七月', v: 2.4 }, { m: '八月', v: 1.1 },
    { m: '九月', v: -0.4 }, { m: '十月', v: 2.8 }, { m: '十一月', v: 1.9 }, { m: '十二月', v: 3.3 },
  ],
  columns = 4, showValues = true, showSummary = true, accentLoss = true,
}) {
  React.useEffect(() => { calInjectStyle(); }, []);
  const cols = Math.max(3, Math.min(6, columns));
  const maxAbs = Math.max(...months.map((x) => Math.abs(x.v)), 1);
  const ytd = months.reduce((a, x) => a + x.v, 0);
  const best = months.reduce((a, x) => (x.v > a.v ? x : a), months[0]);
  const worst = months.reduce((a, x) => (x.v < a.v ? x : a), months[0]);

  const cellStyle = (v) => {
    const t = Math.abs(v) / maxAbs;
    const hue = v >= 0 ? 'var(--ds-c3)' : 'var(--ds-c5)';
    return { background: `linear-gradient(150deg, color-mix(in srgb, ${hue} ${Math.round((0.45 + t * 0.4) * 100)}%, #fff) 0%, ${hue} 100%)`, opacity: 0.5 + t * 0.5 };
  };

  return (
    <div className="cal-root">
      <div className="cal-head">
        <div className="cal-overline">{overline}</div>
        <h2 className="cal-title">{title}<span className="cal-year">{year}</span></h2>
      </div>

      <div className="cal-body">
        <div className="cal-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {months.map((mm, i) => (
            <div className="cal-cell" key={i}>
              <span className="cal-fill" style={cellStyle(mm.v)} />
              <span className="cal-m">{mm.m}</span>
              {showValues && (
                <span className={`cal-v ${mm.v >= 0 ? 'is-up' : 'is-down'}`}>
                  {mm.v >= 0 ? '+' : '−'}{Math.abs(mm.v).toFixed(1)}%
                </span>
              )}
            </div>
          ))}
        </div>

        {showSummary && (
          <div className="cal-side">
            <div className="cal-ytd">
              <span className="cal-ytd-num">{ytd >= 0 ? '+' : '−'}{Math.abs(ytd).toFixed(1)}%</span>
              <span className="cal-ytd-lab">全年累计回报</span>
            </div>
            <div className="cal-flags">
              <div className="cal-flag">
                <span className="cal-flag-cap">最佳月</span>
                <span className="cal-flag-val">{best.m} · +{best.v.toFixed(1)}%</span>
              </div>
              <div className="cal-flag">
                <span className="cal-flag-cap">最弱月</span>
                <span className="cal-flag-val">{worst.m} · {worst.v.toFixed(1)}%</span>
              </div>
              <div className="cal-flag">
                <span className="cal-flag-cap">上涨月数</span>
                <span className="cal-flag-val">{months.filter((x) => x.v >= 0).length} / {months.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function calInjectStyle() {
  if (document.getElementById('cal-style')) return;
  const s = document.createElement('style'); s.id = 'cal-style';
  s.textContent = `
  .cal-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .cal-head{margin-bottom:36px;}
  .cal-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cal-title{font-size:62px;font-weight:300;margin:14px 0 0;line-height:1.06;display:flex;align-items:baseline;gap:24px;}
  .cal-year{font-family:var(--font-mono);font-size:34px;color:var(--ds-faint,rgba(242,243,246,.42));letter-spacing:.04em;}
  .cal-body{flex:1;display:grid;grid-template-columns:1fr 340px;gap:56px;min-height:0;align-items:stretch;}
  .cal-grid{display:grid;gap:16px;min-height:0;}
  .cal-cell{position:relative;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;
    padding:26px 30px;box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.1));}
  .cal-fill{position:absolute;inset:0;}
  .cal-m{position:relative;font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-muted,rgba(242,243,246,.75));}
  .cal-v{position:relative;font-family:var(--font-mono);font-size:40px;font-weight:400;font-variant-numeric:tabular-nums;line-height:1;}
  .cal-v.is-up{color:#fff;}
  .cal-v.is-down{color:#fff;}
  .cal-m{color:rgba(255,255,255,.82);}
  .cal-side{display:flex;flex-direction:column;gap:30px;justify-content:center;}
  .cal-ytd{display:flex;flex-direction:column;gap:10px;padding:36px 38px;border-radius:20px;
    background:var(--ds-card,rgba(255,255,255,.045));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.13));}
  .cal-ytd-num{font-size:80px;font-weight:300;line-height:1;font-variant-numeric:tabular-nums;color:var(--ds-c3);}
  .cal-ytd-lab{font-family:var(--font-mono);font-size:23px;letter-spacing:.08em;color:var(--ds-faint,rgba(242,243,246,.45));}
  .cal-flags{display:flex;flex-direction:column;gap:22px;}
  .cal-flag{display:flex;flex-direction:column;gap:6px;padding-bottom:20px;border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .cal-flag:last-child{border-bottom:0;}
  .cal-flag-cap{font-family:var(--font-mono);font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cal-flag-val{font-size:30px;font-weight:300;color:var(--ds-ink,#f2f3f6);}
  `;
  document.head.appendChild(s);
}

SlideCalendar.META = {
  id: 'calendar', title: '月度回报日历',
  defaults: { columns: 4, showValues: true, showSummary: true, accentLoss: true },
  controls: [
    { key: 'columns', type: 'slider', label: '每行月份数', default: 4, min: 3, max: 6, step: 1,
      description: '日历网格的列数（共 12 个月自动换行）。' },
    { key: 'showValues', type: 'toggle', label: '显示数值', default: true,
      description: '在每个月份格里打印回报率。' },
    { key: 'showSummary', type: 'toggle', label: '汇总栏', default: true,
      description: '右侧的全年累计与最佳/最弱月。' },
    { key: 'accentLoss', type: 'toggle', label: '标记下跌月', default: true,
      description: '让下跌月份也带上可见的底色。' },
  ],
};

export { SlideCalendar };
export const META = SlideCalendar.META;
export default SlideCalendar;
