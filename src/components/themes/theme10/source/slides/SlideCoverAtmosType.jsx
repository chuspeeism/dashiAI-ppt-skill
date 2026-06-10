// SlideCoverAtmosType.jsx — 满版渐变大字 / atmospheric type cover.
// A full-bleed vertical sky gradient (dark slate dissolving to off-white) under
// grain, with a mono kicker pinned top-left and an oversized title anchored to
// the lower-left — type-forward and editorial. Distinct from the centred
// "greeting" treatment. Standalone & migratable: depends only on React
// (global). Themed. CSS scoped under `.caty-`.
//
// ── Props (canonical list in SlideCoverAtmosType.META.controls) ───────────────
//   theme      'dusk'|'dawn'|'mono'   gradient mood                       ('dusk')
//   showKicker boolean   the top-left mono kicker                         (true)
//   showRule   boolean   the accent rule above the title                  (true)
//   showFooter boolean   bottom meta row                                  (true)
//   showGrain  boolean   the film-grain overlay                           (true)
//
// Content props (authored at call-site): kicker, title, sub, footL, footR

import React from 'react';

const CATY_GRADS = {
  dusk: 'linear-gradient(179deg,#0a1016 0%,#1a2530 24%,#33404a 46%,#6c747a 66%,#a7a8a6 82%,#e6e4e0 100%)',
  dawn: 'linear-gradient(179deg,#0f1a27 0%,#283744 26%,#5c5e64 48%,#9a7e74 68%,#cba386 84%,#ecd2bb 100%)',
  mono: 'linear-gradient(179deg,#090a0c 0%,#202329 30%,#484c52 52%,#8b8e92 74%,#d6d5d1 100%)',
};

function SlideCoverAtmosType({
  theme = 'dusk', showKicker = true, showRule = true, showFooter = true, showGrain = true,
  kicker = 'AUTONOMOUS INDEX · 年度财富报告',
  title = '财富，\n自主增长', sub = '让每一笔结余都在为你工作 —— 一份关于长期复利的报告。',
  footL = '2025 ANNUAL REVIEW', footR = '01 / 05',
}) {
  React.useEffect(() => { catyInjectStyle(); }, []);
  const bg = CATY_GRADS[theme] || CATY_GRADS.dusk;
  const lines = String(title).split('\n');
  return (
    <div className="caty-root" style={{ background: bg }}>
      {showGrain && <div className="caty-grain" />}
      {showKicker && <div className="caty-kicker">{kicker}</div>}
      <div className="caty-body">
        {showRule && <span className="caty-rule" />}
        <h1 className="caty-title">{lines.map((l, i) => <span key={i}>{l}</span>)}</h1>
        <p className="caty-sub">{sub}</p>
      </div>
      {showFooter && <div className="caty-foot"><span>{footL}</span><span className="caty-foot-r">{footR}</span></div>}
    </div>
  );
}

function catyInjectStyle() {
  if (document.getElementById('caty-style')) return;
  const s = document.createElement('style'); s.id = 'caty-style';
  s.textContent = `
  .caty-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);color:#f4f5f6;
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;}
  .caty-grain{position:absolute;inset:0;pointer-events:none;opacity:.4;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .caty-kicker{position:relative;z-index:1;font-family:var(--font-mono);font-size:26px;letter-spacing:.2em;
    color:rgba(244,245,246,.82);}
  .caty-body{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:30px;}
  .caty-rule{width:96px;height:3px;border-radius:2px;background:#7e9bf0;margin-bottom:40px;}
  .caty-title{margin:0;font-size:176px;line-height:.98;font-weight:300;letter-spacing:-.015em;
    display:flex;flex-direction:column;text-shadow:0 2px 50px rgba(8,11,15,.22);}
  .caty-sub{margin:40px 0 0;font-size:34px;line-height:1.5;font-weight:300;color:rgba(20,22,26,.66);max-width:1000px;}
  .caty-foot{position:relative;z-index:1;display:flex;justify-content:space-between;padding-top:22px;
    border-top:1px solid rgba(20,22,26,.18);
    font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:rgba(20,22,26,.6);}
  .caty-foot-r{color:rgba(20,22,26,.78);}
  .caty-foot span{white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

try { catyInjectStyle(); } catch (e) { /* head not ready — useEffect covers it */ }

SlideCoverAtmosType.META = {
  id: 'coveratmostype', title: '满版渐变大字',
  defaults: { theme: 'dusk', showKicker: true, showRule: true, showFooter: true, showGrain: true },
  controls: [
    { key: 'theme', type: 'select', label: '渐变情绪', default: 'dusk',
      options: [{ value: 'dusk', label: '暮蓝' }, { value: 'dawn', label: '晨曦' }, { value: 'mono', label: '灰阶' }],
      description: '竖向天空渐变的配色。' },
    { key: 'showKicker', type: 'toggle', label: '顶部标签', default: true, description: '左上角的等宽说明标签。' },
    { key: 'showRule', type: 'toggle', label: '强调横条', default: true, description: '大标题上方的强调色横条。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true, description: '底部细线分隔的页脚信息行。' },
    { key: 'showGrain', type: 'toggle', label: '颗粒质感', default: true, description: '渐变之上的细颗粒纹理。' },
  ],
};

export { SlideCoverAtmosType };
export const META = SlideCoverAtmosType.META;
export default SlideCoverAtmosType;
