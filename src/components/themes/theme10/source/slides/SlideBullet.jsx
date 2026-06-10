// SlideBullet.jsx — 目标子弹图 / actual-vs-target bullet bars.
// One horizontal bullet per metric: graded qualitative bands in the background,
// a measure bar for the actual value, and a target tick to beat. Distinct from
// SlideGoals (simple % fill) and SlideRange (spans): bullet encodes actual vs a
// target against context bands. Standalone & migratable: depends only on React
// (global). Token-driven. CSS scoped under `.bul-`.
//
// ── Props (canonical list in SlideBullet.META.controls) ───────────────────────
//   rowCount    number 2..6   how many metric rows                         (4)
//   showTarget  boolean       the target tick                              (true)
//   showBands   boolean       the graded context bands                     (true)
//   showValue   boolean       the actual value label                       (true)
//   focus       boolean       emphasise one row, dim the rest              (false)
//   focusIndex  number 1..6   which row is emphasised (1-based)            (1)
//
// Content props (authored at call-site):
//   overline, title,
//   rows:[{ label, value(number), target(number), max(number), display, unit }]

import React from 'react';

function SlideBullet({
  overline = '对标目标 · VS TARGET', title = '说好的目标，达成得怎样',
  rows = [
    { label: '年化回报', value: 10.4, target: 8, max: 14, display: '10.4%', unit: '%' },
    { label: '目标完成度', value: 78, target: 70, max: 100, display: '78%', unit: '%' },
    { label: '成本控制', value: 0.42, target: 0.6, max: 1.2, display: '0.42%', unit: '% 费率' },
    { label: '回撤控制', value: 8.3, target: 12, max: 25, display: '−8.3%', unit: '% 最大回撤' },
    { label: '再平衡及时率', value: 96, target: 90, max: 100, display: '96%', unit: '%' },
    { label: '客户留存', value: 94, target: 88, max: 100, display: '94%', unit: '%' },
  ],
  rowCount = 4, showTarget = true, showBands = true, showValue = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { bulInjectStyle(); }, []);
  const n = Math.max(2, Math.min(rows.length, rowCount));
  const used = rows.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="bul-root">
      <div className="bul-head">
        <div className="bul-overline">{overline}</div>
        <h2 className="bul-title">{title}</h2>
      </div>

      <div className="bul-list">
        {used.map((r, i) => {
          const hot = i === fIdx, dim = fIdx >= 0 && !hot;
          const mx = r.max || 1;
          const vp = Math.max(0, Math.min(100, (r.value / mx) * 100));
          const tp = Math.max(0, Math.min(100, (r.target / mx) * 100));
          const beat = r.value >= r.target;
          return (
            <div className={`bul-row ${hot ? 'is-focus' : ''} ${dim ? 'is-dim' : ''}`} key={i}>
              <div className="bul-meta">
                <span className="bul-label">{r.label}</span>
                <span className="bul-unit">{r.unit}</span>
              </div>
              <div className="bul-track">
                {showBands && (
                  <div className="bul-bands">
                    <span className="bul-band b1" style={{ width: '55%' }} />
                    <span className="bul-band b2" style={{ width: '25%' }} />
                    <span className="bul-band b3" style={{ width: '20%' }} />
                  </div>
                )}
                <div className={`bul-measure ${beat ? 'is-beat' : 'is-miss'}`} style={{ width: `${vp}%`, background: beat ? `linear-gradient(90deg, color-mix(in srgb, ${['var(--ds-c1)','var(--ds-c4)','var(--ds-c3)','var(--ds-c6)','var(--ds-c2)','var(--ds-c5)'][i % 6]} 38%,#fff), color-mix(in srgb, ${['var(--ds-c1)','var(--ds-c4)','var(--ds-c3)','var(--ds-c6)','var(--ds-c2)','var(--ds-c5)'][i % 6]} 85%,#000))` : undefined }} />
                {showTarget && <div className="bul-target" style={{ left: `${tp}%` }} />}
              </div>
              {showValue && (
                <div className="bul-val">
                  <span className="bul-num">{r.display}</span>
                  {showTarget && <span className={`bul-flag ${beat ? 'ok' : 'no'}`}>{beat ? '达标' : '未达'}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function bulInjectStyle() {
  if (document.getElementById('bul-style')) return;
  const s = document.createElement('style'); s.id = 'bul-style';
  s.textContent = `
  .bul-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .bul-head{margin-bottom:30px;}
  .bul-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .bul-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .bul-list{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:34px;}
  .bul-row{display:grid;grid-template-columns:300px 1fr 230px;align-items:center;gap:44px;transition:opacity .25s;}
  .bul-row.is-dim{opacity:.34;}
  .bul-meta{display:flex;flex-direction:column;gap:6px;}
  .bul-label{font-size:32px;font-weight:300;}
  .bul-row.is-focus .bul-label{color:var(--ds-accent,#6f9bd8);}
  .bul-unit{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.46));}
  .bul-track{position:relative;height:46px;}
  .bul-bands{position:absolute;inset:0;display:flex;border-radius:8px;overflow:hidden;}
  .bul-band{display:block;height:100%;}
  .bul-band.b1{background:color-mix(in srgb,var(--ds-ink,#f2f3f6) 5%,transparent);}
  .bul-band.b2{background:color-mix(in srgb,var(--ds-ink,#f2f3f6) 9%,transparent);}
  .bul-band.b3{background:color-mix(in srgb,var(--ds-ink,#f2f3f6) 14%,transparent);}
  .bul-measure{position:absolute;top:50%;height:18px;transform:translateY(-50%);border-radius:6px;left:0;
    background:var(--ds-accent,#6f9bd8);}
  .bul-measure.is-miss{background:color-mix(in srgb,var(--ds-ink,#f2f3f6) 34%,transparent);}
  .bul-row.is-focus .bul-measure.is-beat{box-shadow:0 0 18px color-mix(in srgb,var(--ds-accent,#6f9bd8) 55%,transparent);}
  .bul-target{position:absolute;top:50%;width:4px;height:38px;transform:translate(-50%,-50%);border-radius:2px;
    background:var(--ds-ink,#f2f3f6);}
  .bul-val{display:flex;flex-direction:column;align-items:flex-end;gap:6px;}
  .bul-num{font-size:46px;font-weight:300;font-variant-numeric:tabular-nums;letter-spacing:-.01em;line-height:1;}
  .bul-flag{font-family:var(--font-mono);font-size:24px;letter-spacing:.08em;padding:3px 12px;border-radius:999px;}
  .bul-flag.ok{color:var(--ds-accent,#6f9bd8);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#6f9bd8) 60%,transparent);}
  .bul-flag.no{color:var(--ds-faint,rgba(242,243,246,.5));box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.2));}
  `;
  document.head.appendChild(s);
}

SlideBullet.META = {
  id: 'bullet', title: '目标子弹图',
  defaults: { rowCount: 4, showTarget: true, showBands: true, showValue: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'rowCount', type: 'slider', label: '指标行数', default: 4, min: 2, max: 6, step: 1,
      description: '展示的指标行数。' },
    { key: 'showTarget', type: 'toggle', label: '目标刻度', default: true,
      description: '每行的目标位置竖线与达标标记。' },
    { key: 'showBands', type: 'toggle', label: '背景分段', default: true,
      description: '衬托用的灰度分段（差/良/优）。' },
    { key: 'showValue', type: 'toggle', label: '实际数值', default: true,
      description: '右侧的实际数值与达标标签。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一行，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 6, step: 1,
      description: '需开启「重点聚焦」后生效。' },
  ],
};

export { SlideBullet };
export const META = SlideBullet.META;
export default SlideBullet;
