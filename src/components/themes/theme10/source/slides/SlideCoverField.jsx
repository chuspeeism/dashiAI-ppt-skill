// SlideCoverField.jsx — 渐变色场分栏封面 / split type panel + gradient field.
// A near-black type panel on one side; on the other, a full-height atmospheric
// gradient colour field (the same sky the deck uses) under grain — the colour
// IS the imagery, no photo or glyph. Standalone & migratable: depends only on
// React (imported). Themed. CSS scoped under `.cfld-`.
//
// ── Props (canonical list in SlideCoverField.META.controls) ───────────────────
//   theme      'dusk'|'dawn'|'mono'   colour-field gradient mood          ('dusk')
//   fieldSide  'left'|'right'         which side the gradient field sits   ('right')
//   panelWidth number 40..58          text-panel width (%)                ('46')
//   showRule   boolean   the accent rule above the title                  (true)
//   showFooter boolean   bottom meta row in the panel                     (true)
//
// Content props (authored at call-site): wordmark, kicker, title, sub, footL, footR

import React from 'react';

const CFLD_FIELDS = {
  dusk: 'linear-gradient(207deg,#0c1622 0%,#21303e 30%,#3f4f5b 54%,#7c7a76 78%,#cdb89f 100%)',
  dawn: 'linear-gradient(207deg,#101a28 0%,#2c3744 28%,#6a5f62 52%,#b07f6b 78%,#ecc6a4 100%)',
  mono: 'linear-gradient(207deg,#0a0b0d 0%,#23262b 32%,#4c5056 56%,#8f9296 78%,#d8d7d3 100%)',
};

function SlideCoverField({
  theme = 'dusk', fieldSide = 'right', panelWidth = 46, showRule = true, showFooter = true,
  wordmark = 'AUTONOMOUS INDEX', kicker = '自主指数 · 年度财富报告',
  title = '财富，\n自主增长', sub = '一套为长期主义者设计的智能资产配置系统，让每一笔结余都在为你工作。',
  footL = '2025 ANNUAL REVIEW', footR = '01 / 05',
}) {
  React.useEffect(() => { cfldInjectStyle(); }, []);
  const field = CFLD_FIELDS[theme] || CFLD_FIELDS.dusk;
  const pw = Math.max(38, Math.min(62, panelWidth));
  const lines = String(title).split('\n');

  const panel = (
    <div className="cfld-panel" style={{ width: pw + '%' }}>
      <div className="cfld-word">{wordmark}</div>
      <div className="cfld-mid">
        <div className="cfld-kicker">{kicker}</div>
        {showRule && <span className="cfld-rule" />}
        <h1 className="cfld-title">{lines.map((l, i) => <span key={i}>{l}</span>)}</h1>
        <p className="cfld-sub">{sub}</p>
      </div>
      {showFooter && <div className="cfld-foot"><span>{footL}</span><span className="cfld-foot-r">{footR}</span></div>}
    </div>
  );
  const fieldEl = (
    <div className="cfld-field" style={{ background: field }}><div className="cfld-grain" /></div>
  );

  return (
    <div className={`cfld-root side-${fieldSide}`}>
      {fieldSide === 'left' ? <>{fieldEl}{panel}</> : <>{panel}{fieldEl}</>}
    </div>
  );
}

function cfldInjectStyle() {
  if (document.getElementById('cfld-style')) return;
  const s = document.createElement('style'); s.id = 'cfld-style';
  s.textContent = `
  .cfld-root{position:relative;width:100%;height:100%;overflow:hidden;display:flex;
    background:#070809;color:#f3f4f6;font-family:var(--font-sans);}
  .cfld-panel{position:relative;z-index:2;flex:none;height:100%;background:#070809;
    padding:var(--pad-y,96px) clamp(80px,5vw,116px);display:flex;flex-direction:column;}
  .cfld-word{font-family:var(--font-mono);font-size:25px;letter-spacing:.24em;color:rgba(243,244,246,.6);white-space:nowrap;}
  .cfld-mid{flex:1;display:flex;flex-direction:column;justify-content:center;}
  .cfld-kicker{font-family:var(--font-mono);font-size:25px;letter-spacing:.16em;color:rgba(243,244,246,.55);}
  .cfld-rule{width:88px;height:3px;border-radius:2px;background:#7e9bf0;margin:32px 0;}
  .cfld-title{margin:0;font-size:128px;line-height:1.0;font-weight:300;letter-spacing:-.01em;display:flex;flex-direction:column;}
  .cfld-sub{margin:38px 0 0;font-size:31px;line-height:1.5;font-weight:300;color:rgba(243,244,246,.6);max-width:660px;}
  .cfld-foot{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:24px;
    letter-spacing:.14em;color:rgba(243,244,246,.5);}
  .cfld-foot span{white-space:nowrap;} .cfld-foot-r{color:#7e9bf0;}
  .cfld-field{position:relative;flex:1;height:100%;}
  .cfld-grain{position:absolute;inset:0;pointer-events:none;opacity:.45;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  `;
  document.head.appendChild(s);
}

try { cfldInjectStyle(); } catch (e) { /* head not ready — useEffect covers it */ }

SlideCoverField.META = {
  id: 'coverfield', title: '渐变色场分栏封面',
  defaults: { theme: 'dusk', fieldSide: 'right', panelWidth: 46, showRule: true, showFooter: true },
  controls: [
    { key: 'theme', type: 'select', label: '色场情绪', default: 'dusk',
      options: [{ value: 'dusk', label: '暮光' }, { value: 'dawn', label: '晨曦' }, { value: 'mono', label: '灰阶' }],
      description: '渐变色场的配色基调。' },
    { key: 'fieldSide', type: 'radio', label: '色场位置', default: 'right',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '渐变色场位于文字面板的哪一侧。' },
    { key: 'panelWidth', type: 'slider', label: '文字区宽度', default: 46, min: 40, max: 58, step: 1, unit: '%',
      description: '文字面板占整页的宽度比例。' },
    { key: 'showRule', type: 'toggle', label: '强调横条', default: true, description: '标题上方的强调色横条。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true, description: '文字面板底部的页脚信息行。' },
  ],
};

export { SlideCoverField };
export const META = SlideCoverField.META;
export default SlideCoverField;
