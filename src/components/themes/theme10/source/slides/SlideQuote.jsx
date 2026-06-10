// SlideQuote.jsx — 引言 / a large pull-quote with attribution, on a themed bg.
// Standalone & migratable: depends only on React (imported) + DECK_THEMES
// (with a token fallback). CSS scoped under `.qt-`.
//
// ── Props (canonical list in SlideQuote.META.controls) ────────────────────────
//   theme            DECK_THEMES key   background mood                     ('vapor')
//   align            'left'|'center'    text alignment                      ('left')
//   showQuoteMark    boolean            the oversized quote glyph           (true)
//   showAttribution  boolean            the author + role line              (true)
//
// Content props (authored at call-site): quote, author, role

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

const QT_GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

function SlideQuote({
  quote = '真正的复利，不来自一次正确的预测，而来自一套能被反复执行的纪律。',
  author = '林彦', role = '首席投资官',
  theme = 'vapor', align = 'left', showQuoteMark = true, showAttribution = true,
}) {
  React.useEffect(() => { qtInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  return (
    <div className="qt-root" style={{ background: t.bg, color: t.fg, ['--qt-sub']: t.sub,
      alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align === 'center' ? 'center' : 'left' }}>
      <div className="qt-grain" />
      {showQuoteMark && <div className="qt-mark">“</div>}
      <blockquote className="qt-quote">{quote}</blockquote>
      {showAttribution && (
        <div className="qt-attr"><span className="qt-author">{author}</span><span className="qt-role">{role}</span></div>
      )}
    </div>
  );
}
function qtInjectStyle() {
  if (document.getElementById('qt-style')) return;
  const s = document.createElement('style'); s.id = 'qt-style';
  s.textContent = `
  .qt-root{position:relative;width:100%;height:100%;overflow:hidden;padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;justify-content:center;font-family:var(--font-sans);}
  .qt-grain{position:absolute;inset:0;pointer-events:none;opacity:.45;mix-blend-mode:overlay;
    background-image:url("${QT_GRAIN}");}
  .qt-mark{position:relative;z-index:1;font-size:200px;line-height:.6;font-weight:300;color:var(--qt-sub);height:90px;}
  .qt-quote{position:relative;z-index:1;font-size:62px;line-height:1.34;font-weight:300;margin:0;max-width:1500px;
    letter-spacing:.01em;text-wrap:pretty;}
  .qt-attr{position:relative;z-index:1;display:flex;align-items:baseline;gap:20px;margin-top:56px;
    font-family:var(--font-mono);font-size:26px;letter-spacing:.06em;}
  .qt-author{color:inherit;}
  .qt-role{color:var(--qt-sub);}
  `;
  document.head.appendChild(s);
}
SlideQuote.META = {
  id: 'quote', title: '引言',
  defaults: { theme: 'vapor', align: 'left', showQuoteMark: true, showAttribution: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'vapor',
      options: [{ value: 'vapor', label: '垂直渐变' }, { value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' }, { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' }, { value: 'paper', label: '纸白' }], description: '引言页背景。' },
    { key: 'align', type: 'radio', label: '对齐', default: 'left', options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], description: '文本对齐。' },
    { key: 'showQuoteMark', type: 'toggle', label: '引号装饰', default: true, description: '大号引号符。' },
    { key: 'showAttribution', type: 'toggle', label: '署名', default: true, description: '显示作者与头衔。' },
  ],
};

export { SlideQuote };
export const META = SlideQuote.META;
export default SlideQuote;
