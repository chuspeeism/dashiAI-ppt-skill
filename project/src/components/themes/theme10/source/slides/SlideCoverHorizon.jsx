// SlideCoverHorizon.jsx — 地平线渐变封面 / dawn-horizon cover.
// A crisp horizon: deep night sky fills the upper field and carries the title;
// at ~68% a luminous dawn band breaks across the frame, with the sub sitting in
// the light and meta on the floor. Editorial, asymmetric, no glyph/icon — the
// sunrise is the image. Standalone & migratable: depends only on React (imported).
// Themed. CSS scoped under `.chrz-`.
//
// ── Props (canonical list in SlideCoverHorizon.META.controls) ─────────────────
//   theme      'dawn'|'dusk'|'ember'   horizon colourway                  ('dawn')
//   horizon    number 56..76           height of the night sky (%)        (68)
//   showRule   boolean   the accent rule above the title                  (true)
//   showFooter boolean   bottom meta row                                  (true)
//   showGrain  boolean   the film-grain overlay                           (true)
//
// Content props (authored at call-site): wordmark, kicker, title, sub, footL, footR

import React from 'react';

const CHRZ_THEMES = {
  dawn:  { sky: 'linear-gradient(180deg,#080b12 0%,#0d1421 56%,#152233 100%)', band: 'linear-gradient(180deg,#f3c193 0%,#dd9b6a 30%,#9d6450 64%,#3c2824 100%)', rule: '#e8b078', ink: 'rgba(34,20,14,.8)', inkSub: 'rgba(34,20,14,.92)' },
  dusk:  { sky: 'linear-gradient(180deg,#080b12 0%,#0c1322 56%,#101d33 100%)', band: 'linear-gradient(180deg,#aec6f2 0%,#6f93ef 30%,#41599f 64%,#1b2540 100%)', rule: '#9fb6f5', ink: 'rgba(12,18,34,.82)', inkSub: 'rgba(10,14,28,.94)' },
  ember: { sky: 'linear-gradient(180deg,#0a0810 0%,#180f18 56%,#241420 100%)', band: 'linear-gradient(180deg,#f0b487 0%,#d07a52 30%,#9a4944 64%,#341c20 100%)', rule: '#ec9668', ink: 'rgba(34,16,14,.8)', inkSub: 'rgba(34,16,14,.94)' },
};

function SlideCoverHorizon({
  theme = 'dawn', horizon = 68, showRule = true, showFooter = true, showGrain = true,
  wordmark = 'AUTONOMOUS INDEX', kicker = '自主指数 · 年度财富报告',
  title = '财富，\n自主增长', sub = '让每一笔结余都在为你工作。',
  footL = '2025 ANNUAL REVIEW', footR = '01 / 05',
}) {
  React.useEffect(() => { chrzInjectStyle(); }, []);
  const t = CHRZ_THEMES[theme] || CHRZ_THEMES.dawn;
  const h = Math.max(52, Math.min(80, horizon));
  const lines = String(title).split('\n');
  return (
    <div className="chrz-root" style={{ ['--chrz-rule']: t.rule, ['--chrz-ink']: t.ink, ['--chrz-inksub']: t.inkSub }}>
      <div className="chrz-sky" style={{ height: h + '%', background: t.sky }}>
        {showGrain && <div className="chrz-grain" />}
        <div className="chrz-word">{wordmark}</div>
        <div className="chrz-titlewrap">
          <div className="chrz-kicker">{kicker}</div>
          {showRule && <span className="chrz-rule" />}
          <h1 className="chrz-title">{lines.map((l, i) => <span key={i}>{l}</span>)}</h1>
        </div>
      </div>
      <div className="chrz-band" style={{ height: (100 - h) + '%', background: t.band }}>
        {showGrain && <div className="chrz-grain" />}
        <p className="chrz-sub">{sub}</p>
        {showFooter && <div className="chrz-foot"><span>{footL}</span><span className="chrz-foot-r">{footR}</span></div>}
      </div>
    </div>
  );
}

function chrzInjectStyle() {
  if (document.getElementById('chrz-style')) return;
  const s = document.createElement('style'); s.id = 'chrz-style';
  s.textContent = `
  .chrz-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);display:flex;flex-direction:column;}
  .chrz-grain{position:absolute;inset:0;pointer-events:none;opacity:.4;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .chrz-sky{position:relative;color:#f3f4f6;padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;justify-content:space-between;}
  .chrz-word{position:relative;z-index:1;font-family:var(--font-mono);font-size:25px;letter-spacing:.24em;color:rgba(243,244,246,.62);white-space:nowrap;}
  .chrz-titlewrap{position:relative;z-index:1;}
  .chrz-kicker{font-family:var(--font-mono);font-size:26px;letter-spacing:.18em;color:rgba(243,244,246,.66);}
  .chrz-rule{display:block;width:96px;height:3px;border-radius:2px;background:var(--chrz-rule);margin:30px 0;}
  .chrz-title{margin:0;font-size:150px;line-height:.98;font-weight:300;letter-spacing:-.01em;display:flex;flex-direction:column;}
  .chrz-band{position:relative;padding:0 var(--pad-x,120px) 64px;display:flex;flex-direction:column;justify-content:space-between;}
  .chrz-sub{position:relative;z-index:1;margin:46px 0 0;font-size:34px;line-height:1.45;font-weight:400;color:var(--chrz-inksub);max-width:1100px;text-shadow:0 1px 16px rgba(255,235,210,.3);}
  .chrz-foot{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:flex-end;
    font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:var(--chrz-ink);}
  .chrz-foot span{white-space:nowrap;} .chrz-foot-r{color:var(--chrz-inksub);}
  `;
  document.head.appendChild(s);
}

try { chrzInjectStyle(); } catch (e) { /* head not ready — useEffect covers it */ }

SlideCoverHorizon.META = {
  id: 'coverhorizon', title: '地平线渐变封面',
  defaults: { theme: 'dawn', horizon: 68, showRule: true, showFooter: true, showGrain: true },
  controls: [
    { key: 'theme', type: 'select', label: '地平线色', default: 'dawn',
      options: [{ value: 'dawn', label: '晨曦' }, { value: 'dusk', label: '暮蓝' }, { value: 'ember', label: '余烬' }],
      description: '地平线下方辉带的配色。' },
    { key: 'horizon', type: 'slider', label: '地平线高度', default: 68, min: 56, max: 76, step: 1, unit: '%',
      description: '夜空占整页的高度（地平线的位置）。' },
    { key: 'showRule', type: 'toggle', label: '强调横条', default: true, description: '标题上方的强调色横条。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true, description: '辉带底部的页脚信息行。' },
    { key: 'showGrain', type: 'toggle', label: '颗粒质感', default: true, description: '画面之上的细颗粒纹理。' },
  ],
};

export { SlideCoverHorizon };
export const META = SlideCoverHorizon.META;
export default SlideCoverHorizon;
