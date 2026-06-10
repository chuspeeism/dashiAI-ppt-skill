// SlideRanking.jsx — 排行榜 / ranked leaderboard table.
// A vertical ranking of holdings: big mono rank index, name + tag, an inline
// contribution bar, the headline value and a delta chip. The leading row is
// lifted onto a tinted plate so the #1 reads instantly. Standalone & migratable:
// React only. Token-driven. CSS scoped under `.rk-`.
//
// ── Props (canonical list in SlideRanking.META.controls) ─────────────────────
//   rowCount       number 4..8   how many ranked rows                     (6)
//   showBar        boolean       the inline contribution bar              (true)
//   showDelta      boolean       the delta chip column                    (true)
//   highlightIndex number 1..8   which rank is lifted onto a plate        (1)
//   showHighlight  boolean       enable the lifted plate                  (true)
//
// Content props (authored at call-site):
//   overline, title, unit, rows:[{ name, tag, value, delta }]

import React from 'react';

function SlideRanking({
  overline = '贡献排行 · LEADERBOARD', title = '本年度收益贡献，谁在领跑',
  unit = '%',
  rows = [
    { name: '核心指数篮子', tag: '权益 · 宽基', value: 9.4, delta: 1.8 },
    { name: '另类对冲组合', tag: '另类 · 中性', value: 6.1, delta: 2.3 },
    { name: '黄金与实物', tag: '商品 · 避险', value: 4.7, delta: 0.9 },
    { name: '新兴市场增强', tag: '权益 · 区域', value: 3.9, delta: -0.6 },
    { name: '信用债阶梯', tag: '固收 · 中久期', value: 2.8, delta: 0.4 },
    { name: '现金管理', tag: '现金 · 货基', value: 1.5, delta: 0.1 },
    { name: '可转债策略', tag: '混合 · 进攻', value: 1.1, delta: 0.7 },
    { name: '波动率敞口', tag: '另类 · 尾部', value: 0.6, delta: -0.2 },
  ],
  rowCount = 6, showBar = true, showDelta = true, highlightIndex = 1, showHighlight = true,
}) {
  React.useEffect(() => { rkInjectStyle(); }, []);
  const n = Math.max(4, Math.min(rows.length, rowCount));
  const data = rows.slice(0, n);
  const hi = showHighlight ? Math.max(0, Math.min(n - 1, highlightIndex - 1)) : -1;
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowPad = n >= 8 ? 8 : n === 7 ? 12 : 22;
  const rankFs = n >= 8 ? 36 : n === 7 ? 40 : 46;
  const valFs = n >= 8 ? 34 : n === 7 ? 38 : 42;
  const nmFs = n >= 8 ? 28 : n === 7 ? 30 : 32;
  const headMb = n >= 7 ? 26 : 48;

  return (
    <div className="rk-root">
      <div className="rk-head" style={{ marginBottom: `${headMb}px` }}>
        <div className="rk-overline">{overline}</div>
        <h2 className="rk-title">{title}</h2>
      </div>
      <div className="rk-list" style={{ ['--rk-rowpad']: `${rowPad}px`, ['--rk-rank']: `${rankFs}px`, ['--rk-val']: `${valFs}px`, ['--rk-nm']: `${nmFs}px` }}>
        {data.map((r, i) => {
          const hot = i === hi;
          return (
            <div key={i} className={`rk-row ${hot ? 'is-hot' : ''}`}>
              <span className="rk-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="rk-name">
                <span className="rk-nm">{r.name}</span>
                <span className="rk-tag">{r.tag}</span>
              </span>
              {showBar && (
                <span className="rk-track">
                  <span className="rk-fill" style={{ width: `${(r.value / max) * 100}%`,
                    background: hot ? 'rgba(255,255,255,.9)' : 'currentColor',
                    opacity: hot ? 1 : 0.3 }} />
                </span>
              )}
              <span className="rk-value">{r.value.toFixed(1)}<span className="rk-unit">{unit}</span></span>
              {showDelta && (
                <span className={`rk-delta ${r.delta >= 0 ? 'is-up' : 'is-down'}`}>
                  {r.delta >= 0 ? '+' : '−'}{Math.abs(r.delta).toFixed(1)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function rkInjectStyle() {
  if (document.getElementById('rk-style')) return;
  const s = document.createElement('style'); s.id = 'rk-style';
  s.textContent = `
  .rk-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);font-family:var(--font-sans);display:flex;flex-direction:column;}
  .rk-head{margin-bottom:48px;}
  .rk-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .rk-title{font-size:60px;font-weight:300;margin:16px 0 0;line-height:1.1;letter-spacing:.01em;}
  .rk-list{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
  .rk-row{display:flex;align-items:center;gap:36px;padding:var(--rk-rowpad,22px) 40px;
    border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));border-radius:10px;transition:background .2s ease;}
  .rk-row.is-hot{background:linear-gradient(100deg,#4a3fb0 0%,#3f6fd8 55%,#2f9ec8 100%);border-bottom-color:transparent;
    box-shadow:none;}
  .rk-row.is-hot .rk-rank,.rk-row.is-hot .rk-nm,.rk-row.is-hot .rk-tag,.rk-row.is-hot .rk-value,.rk-row.is-hot .rk-unit,.rk-row.is-hot .rk-delta{color:#fff;}
  .rk-row.is-hot .rk-track{background:rgba(255,255,255,.18);}
  .rk-rank{flex:0 0 92px;font-family:var(--font-mono);font-size:var(--rk-rank,46px);font-weight:300;
    font-variant-numeric:tabular-nums;color:var(--ds-faint,rgba(242,243,246,.4));letter-spacing:.02em;}
  .rk-name{flex:0 0 380px;display:flex;flex-direction:column;gap:8px;min-width:0;}
  .rk-nm{font-size:var(--rk-nm,32px);font-weight:300;letter-spacing:.01em;}
  .rk-tag{font-family:var(--font-mono);font-size:22px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.46));}
  .rk-track{flex:1;height:14px;border-radius:7px;background:var(--ds-card,rgba(255,255,255,.05));overflow:hidden;min-width:80px;}
  .rk-fill{display:block;height:100%;border-radius:7px;transition:width .4s cubic-bezier(.3,.7,.4,1);}
  .rk-value{flex:0 0 auto;min-width:150px;text-align:right;font-family:var(--font-mono);font-size:var(--rk-val,42px);font-weight:300;
    font-variant-numeric:tabular-nums;letter-spacing:.01em;}
  .rk-row.is-hot .rk-value-NOOP{}
  .rk-unit{font-size:24px;color:var(--ds-faint,rgba(242,243,246,.45));margin-left:3px;}
  .rk-delta{flex:0 0 110px;text-align:right;font-family:var(--font-mono);font-size:26px;
    font-variant-numeric:tabular-nums;letter-spacing:.02em;}
  .rk-delta.is-up{color:var(--ds-accent,#5479e8);}
  .rk-delta.is-down{color:var(--ds-muted,rgba(242,243,246,.45));}
  `;
  document.head.appendChild(s);
}

SlideRanking.META = {
  id: 'ranking', title: '排行榜',
  defaults: { rowCount: 6, showBar: true, showDelta: true, highlightIndex: 1, showHighlight: true },
  controls: [
    { key: 'rowCount', type: 'slider', label: '榜单行数', default: 6, min: 4, max: 8, step: 1,
      description: '排行榜显示的条目数量。' },
    { key: 'showBar', type: 'toggle', label: '贡献条', default: true,
      description: '每行内联的贡献度条形图。' },
    { key: 'showDelta', type: 'toggle', label: '变化列', default: true,
      description: '右侧的同比增减列。' },
    { key: 'showHighlight', type: 'toggle', label: '榜首高亮', default: true,
      description: '将某一名次抬起到强调底板上。' },
    { key: 'highlightIndex', type: 'slider', label: '高亮第几名', default: 1, min: 1, max: 8, step: 1,
      description: '需开启「榜首高亮」后生效，上限随行数变化。' },
  ],
};

export { SlideRanking };
export const META = SlideRanking.META;
export default SlideRanking;
