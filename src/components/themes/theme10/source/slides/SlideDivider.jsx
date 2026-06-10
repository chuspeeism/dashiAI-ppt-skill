// SlideDivider.jsx — 序号分章 / oversized numbered chapter divider.
// A giant index numeral anchors one side, a hairline rule separates it from a
// stacked kicker + multi-line chapter title, with a small meta lockup at the
// foot. Themed: paints its own background from DECK_THEMES (in the THEMED set —
// no light/dark tone control). Standalone & migratable: depends on React +
// DECK_THEMES (imported, with a hard-coded fallback). CSS scoped under `.dv-`.
//
// ── Props (canonical list in SlideDivider.META.controls) ─────────────────────
//   theme      select   background mood (DECK_THEMES key)               ('midnight')
//   numberSide radio    'left' | 'right'  which side the numeral sits   ('left')
//   showRule   boolean  the hairline rule between numeral and title     (true)
//   showMeta   boolean  the foot meta lockup                            (true)
//
// Content props (authored at call-site):
//   index, kicker, title, meta:[string]

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

function SlideDivider({
  index = '04', kicker = '第四章 · CHAPTER',
  title = '运作机制\n与风控纪律',
  meta = ['自主指数 · 财富报告', '内部资料 · 谨慎传阅'],
  theme = 'dawn', numberSide = 'left', showRule = true, showMeta = true,
}) {
  React.useEffect(() => { dvInjectStyle(); }, []);
  const THEMES = DECK_THEMES || {
    midnight: { bg: 'radial-gradient(120% 85% at 72% 8%,#1c2533 0%,#0d1016 52%,#07080b 100%)', fg: '#f2f3f6', sub: 'rgba(242,243,246,.62)', foot: 'rgba(242,243,246,.42)' },
  };
  const th = THEMES[theme] || THEMES.midnight;
  const lines = String(title).split('\n');

  return (
    <div className={`dv-root dv-${numberSide}`} style={{ background: th.bg, color: th.fg }}>
      <div className="dv-index">{index}</div>
      {showRule && <span className="dv-rule" />}
      <div className="dv-body">
        <div className="dv-kicker" style={{ color: th.sub }}>{kicker}</div>
        <h2 className="dv-title">
          {lines.map((l, i) => <span key={i} className="dv-line">{l}</span>)}
        </h2>
        {showMeta && (
          <div className="dv-meta">
            {meta.map((m, i) => <span key={i} style={{ color: th.fg }}>{m}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function dvInjectStyle() {
  if (document.getElementById('dv-style')) return;
  const s = document.createElement('style'); s.id = 'dv-style';
  s.textContent = `
  .dv-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;align-items:center;gap:clamp(56px,7vw,120px);}
  .dv-right{flex-direction:row-reverse;}
  .dv-index{font-family:var(--font-mono);font-weight:300;font-size:clamp(360px,52vh,560px);line-height:.8;
    font-variant-numeric:tabular-nums;letter-spacing:-.04em;flex:0 0 auto;
    background:linear-gradient(170deg,currentColor 0%,rgba(255,255,255,.5) 120%);
    -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;opacity:.95;}
  .dv-rule{width:1px;align-self:stretch;margin:8% 0;background:linear-gradient(180deg,transparent,currentColor 30% 70%,transparent);opacity:.4;flex:0 0 auto;}
  .dv-body{flex:1;min-width:0;}
  .dv-right .dv-body{text-align:right;}
  .dv-kicker{font-family:var(--font-mono);font-size:30px;letter-spacing:.18em;margin-bottom:34px;}
  .dv-title{margin:0;font-size:clamp(72px,9vw,110px);font-weight:300;line-height:1.04;letter-spacing:.01em;display:flex;flex-direction:column;}
  .dv-line{display:block;}
  .dv-meta{display:flex;gap:42px;margin-top:54px;}
  .dv-right .dv-meta{justify-content:flex-end;}
  .dv-meta span{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;position:relative;padding-left:26px;}
  .dv-meta span::before{content:"";position:absolute;left:0;top:50%;width:12px;height:1px;background:currentColor;opacity:.7;}
  .dv-right .dv-meta span{padding-left:0;padding-right:26px;}
  .dv-right .dv-meta span::before{left:auto;right:0;}
  `;
  document.head.appendChild(s);
}

SlideDivider.META = {
  id: 'divider', title: '序号分章',
  defaults: { theme: 'dawn', numberSide: 'left', showRule: true, showMeta: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dawn',
      options: [
        { value: 'midnight', label: '午夜' }, { value: 'dusk', label: '暮蓝' },
        { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨曦' },
        { value: 'vapor', label: '雾岚' }, { value: 'paper', label: '纸白' },
      ], description: '整页背景渐变情绪（来自 DECK_THEMES）。' },
    { key: 'numberSide', type: 'radio', label: '序号位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '巨幅序号所在的一侧。' },
    { key: 'showRule', type: 'toggle', label: '分隔标线', default: true,
      description: '序号与标题之间的竖向细线。' },
    { key: 'showMeta', type: 'toggle', label: '底部信息', default: true,
      description: '底部的元信息小字。' },
  ],
};

export { SlideDivider };
export const META = SlideDivider.META;
export default SlideDivider;
