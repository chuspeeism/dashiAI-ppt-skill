// SlideCoverDusk.jsx — 暮光对角封面 / signature diagonal-gradient cover.
// The deck's house gradient (deep ink → slate → warm copper) running corner to
// corner under grain, with a mono wordmark, an oversized light-weight title and
// a footer meta line. No glyphs/icons — pure type on atmosphere. Standalone &
// migratable: depends only on React (imported). Themed. CSS scoped under `.cdsk-`.
//
// ── Props (canonical list in SlideCoverDusk.META.controls) ────────────────────
//   theme      'dusk'|'midnight'|'dawn'   gradient mood                   ('dusk')
//   align      'left'|'center'            title block alignment           ('left')
//   showRule   boolean   the accent rule above the title                  (true)
//   showFooter boolean   bottom meta row                                  (true)
//   showGrain  boolean   the film-grain overlay                           (true)
//
// Content props (authored at call-site): wordmark, kicker, title, sub, footL, footR

import React from 'react';

const CDSK_THEMES = {
  dusk:     { bg: 'linear-gradient(152deg,#080b0f 0%,#121d27 24%,#33434e 50%,#7e6f60 76%,#cdb097 100%)', fg: '#f4f4f2', sub: 'rgba(244,244,242,.74)', line: 'rgba(244,244,242,.22)', accent: '#cdb097', foot: 'rgba(244,244,242,.6)' },
  midnight: { bg: 'radial-gradient(120% 90% at 80% -8%, rgba(84,121,232,.28) 0%, rgba(84,121,232,0) 52%), linear-gradient(155deg,#11151c 0%,#0b0c11 58%,#08090c 100%)', fg: '#f2f3f6', sub: 'rgba(242,243,246,.66)', line: 'rgba(242,243,246,.2)', accent: '#7e9bf0', foot: 'rgba(242,243,246,.5)' },
  dawn:     { bg: 'linear-gradient(155deg,#12101c 0%,#33283f 34%,#7a5560 62%,#b87f6b 82%,#e6bf9c 100%)', fg: '#f7f2ec', sub: 'rgba(247,242,236,.76)', line: 'rgba(247,242,236,.24)', accent: '#e6bf9c', foot: 'rgba(247,242,236,.62)' },
};

function SlideCoverDusk({
  theme = 'dusk', align = 'left', showRule = true, showFooter = true, showGrain = true,
  wordmark = 'AUTONOMOUS INDEX', kicker = '自主指数 · 年度财富报告',
  title = '财富，\n自主增长', sub = '一套为长期主义者设计的智能资产配置系统，\n让每一笔结余都在为你工作。',
  footL = '2025 ANNUAL REVIEW', footR = 'CONFIDENTIAL · 01',
}) {
  React.useEffect(() => { cdskInjectStyle(); }, []);
  const t = CDSK_THEMES[theme] || CDSK_THEMES.dusk;
  const lines = String(title).split('\n');
  const subLines = String(sub).split('\n');
  return (
    <div className={`cdsk-root align-${align}`} style={{ background: t.bg, color: t.fg, ['--cdsk-sub']: t.sub, ['--cdsk-line']: t.line, ['--cdsk-accent']: t.accent, ['--cdsk-foot']: t.foot }}>
      {showGrain && <div className="cdsk-grain" />}
      <div className="cdsk-top"><span className="cdsk-word">{wordmark}</span></div>
      <div className="cdsk-body">
        <div className="cdsk-kicker">{kicker}</div>
        {showRule && <span className="cdsk-rule" />}
        <h1 className="cdsk-title">{lines.map((l, i) => <span key={i}>{l}</span>)}</h1>
        <p className="cdsk-sub">{subLines.map((l, i) => <span key={i}>{l}</span>)}</p>
      </div>
      {showFooter && <div className="cdsk-foot"><span>{footL}</span><span className="cdsk-foot-r">{footR}</span></div>}
    </div>
  );
}

function cdskInjectStyle() {
  if (document.getElementById('cdsk-style')) return;
  const s = document.createElement('style'); s.id = 'cdsk-style';
  s.textContent = `
  .cdsk-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;}
  .cdsk-grain{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .cdsk-top{position:relative;z-index:1;font-family:var(--font-mono);font-size:25px;letter-spacing:.24em;white-space:nowrap;}
  .cdsk-body{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;max-width:1240px;padding-bottom:40px;}
  .cdsk-root.align-center .cdsk-body{align-items:center;text-align:center;max-width:none;}
  .cdsk-kicker{font-family:var(--font-mono);font-size:26px;letter-spacing:.18em;color:var(--cdsk-sub);}
  .cdsk-rule{width:96px;height:3px;border-radius:2px;background:var(--cdsk-accent);margin:36px 0;}
  .cdsk-title{margin:0;font-size:152px;line-height:1.0;font-weight:300;letter-spacing:-.01em;display:flex;flex-direction:column;}
  .cdsk-sub{margin:44px 0 0;font-size:34px;line-height:1.5;font-weight:300;color:var(--cdsk-sub);display:flex;flex-direction:column;}
  .cdsk-foot{position:relative;z-index:1;display:flex;justify-content:space-between;padding-top:24px;
    border-top:1px solid var(--cdsk-line);font-family:var(--font-mono);font-size:24px;letter-spacing:.14em;color:var(--cdsk-foot);}
  .cdsk-foot span{white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

try { cdskInjectStyle(); } catch (e) { /* head not ready — useEffect covers it */ }

SlideCoverDusk.META = {
  id: 'coverdusk', title: '暮光对角封面',
  defaults: { theme: 'dusk', align: 'left', showRule: true, showFooter: true, showGrain: true },
  controls: [
    { key: 'theme', type: 'select', label: '渐变情绪', default: 'dusk',
      options: [{ value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' }, { value: 'dawn', label: '晨曦' }],
      description: '对角渐变的配色基调。' },
    { key: 'align', type: 'radio', label: '文本对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '标题区块的水平对齐。' },
    { key: 'showRule', type: 'toggle', label: '强调横条', default: true, description: '标题上方的强调色横条。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true, description: '底部细线分隔的页脚信息行。' },
    { key: 'showGrain', type: 'toggle', label: '颗粒质感', default: true, description: '渐变之上的细颗粒纹理。' },
  ],
};

export { SlideCoverDusk };
export const META = SlideCoverDusk.META;
export default SlideCoverDusk;
