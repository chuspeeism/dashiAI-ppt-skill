// SlideBigStat.jsx — 大字指标 / a monumental figure with a stat row + action ring.
// Standalone & migratable: depends only on React (imported) + DECK_THEMES
// (token fallback). CSS scoped under `.bs-`.
//
// ── Props (canonical list in SlideBigStat.META.controls) ──────────────────────
//   theme      DECK_THEMES key   background mood                       ('paper')
//   showDelta  boolean           the change chip beside the label      (true)
//   showStats  boolean           the bottom stat row                   (true)
//   showAction boolean           the circular action button            (true)
//
// Content props (authored at call-site): kicker, value, valueSup, label, delta, stats

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

const BS_GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

function SlideBigStat({
  kicker = '预测 · 总净值 · 2055', value: bigValue = '¥1,250,096', valueSup = '.05',
  label = '以每周 ¥500 定投，交给自主指数复利。这是耐心带你抵达的位置。',
  delta = '+38% 同比',
  stats = [
    { label: '周定投', value: '¥500' }, { label: '年初至今', value: '+10%' },
    { label: '外部账户', value: '7' }, { label: '投资年限', value: '29 年' },
  ],
  theme = 'paper', showDelta = true, showStats = true, showAction = true,
}) {
  React.useEffect(() => { bsInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  const acc = theme === 'paper' ? '#a8632f' : '#cf9b6f';
  return (
    <div className="bs-root" style={{ background: t.bg, color: t.fg, ['--bs-sub']: t.sub, ['--bs-acc']: acc }}>
      <div className="bs-grain" />
      <div className="bs-kicker">{kicker}</div>
      <div className="bs-spacer" />
      <div className="bs-value">{bigValue}{valueSup && <span className="bs-sup">{valueSup}</span>}</div>
      <div className="bs-meta">
        <p className="bs-label">{label}</p>
        {showDelta && <span className="bs-delta">{delta}</span>}
      </div>
      {(showStats || showAction) && (
        <div className="bs-footrow">
          {showStats && (
            <div className="bs-stats">
              {stats.map((s, i) => (
                <div className="bs-stat" key={i}><span className="bs-sl">{s.label}</span><span className="bs-sv">{s.value}</span></div>
              ))}
            </div>
          )}
          {showAction && (
            <div className="bs-action">
              <span className="bs-arrow" aria-hidden="true">↗</span>
              <span className="bs-actioncap">SLIDE TO INVEST</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function bsInjectStyle() {
  if (document.getElementById('bs-style')) return;
  const s = document.createElement('style'); s.id = 'bs-style';
  s.textContent = `
  .bs-root{position:relative;width:100%;height:100%;overflow:hidden;padding:var(--pad-y,96px) var(--pad-x,120px) calc(var(--pad-y,96px) - 8px);
    display:flex;flex-direction:column;font-family:var(--font-sans);}
  .bs-grain{position:absolute;inset:0;pointer-events:none;opacity:.4;mix-blend-mode:overlay;background-image:url("${BS_GRAIN}");}
  .bs-kicker{position:relative;z-index:1;font-family:var(--font-mono);font-size:27px;letter-spacing:.2em;text-transform:uppercase;color:var(--bs-sub);}
  .bs-spacer{flex:1;min-height:24px;}
  .bs-value{position:relative;z-index:1;font-size:268px;line-height:.9;font-weight:200;letter-spacing:-.025em;
    font-variant-numeric:tabular-nums;margin:0 0 30px;display:flex;align-items:flex-start;}
  .bs-sup{font-size:.3em;font-weight:300;letter-spacing:0;margin-top:.34em;margin-left:.05em;color:var(--bs-sub);}
  .bs-meta{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:48px;
    padding-bottom:42px;border-bottom:1px solid color-mix(in srgb,currentColor 22%,transparent);}
  .bs-label{font-size:30px;font-weight:300;line-height:1.5;color:var(--bs-sub);margin:0;max-width:920px;text-wrap:pretty;}
  .bs-delta{font-family:var(--font-mono);font-size:28px;letter-spacing:.04em;color:var(--bs-acc);white-space:nowrap;}
  .bs-footrow{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:38px;}
  .bs-stats{display:flex;gap:92px;}
  .bs-stat{display:flex;flex-direction:column;gap:14px;text-align:left;}
  .bs-sl{font-family:var(--font-mono);font-size:23px;letter-spacing:.12em;text-transform:uppercase;color:var(--bs-sub);}
  .bs-sv{font-size:54px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;}
  .bs-action{display:flex;flex-direction:column;align-items:center;gap:16px;flex:0 0 auto;}
  .bs-arrow{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-size:40px;color:var(--bs-acc);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,currentColor 32%,transparent);}
  .bs-actioncap{font-family:var(--font-mono);font-size:21px;letter-spacing:.16em;color:var(--bs-sub);}
  `;
  document.head.appendChild(s);
}
SlideBigStat.META = {
  id: 'bigstat', title: '大字指标',
  defaults: { theme: 'paper', showDelta: true, showStats: true, showAction: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'paper',
      options: [{ value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' }, { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' }, { value: 'paper', label: '纸白' }], description: '背景渐变（纸白最贴近参考图）。' },
    { key: 'showDelta', type: 'toggle', label: '变化标记', default: true, description: '右下的同比/环比变化标记。' },
    { key: 'showStats', type: 'toggle', label: '底部数据行', default: true, description: '底部一行小型指标（标签在上、数字在下）。' },
    { key: 'showAction', type: 'toggle', label: '右下环形按钮', default: true, description: '参考图的标志性圆形箭头＋说明。' },
  ],
};

export { SlideBigStat };
export const META = SlideBigStat.META;
export default SlideBigStat;
