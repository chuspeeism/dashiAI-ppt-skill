// SlideStatement.jsx — typographic statement hero. Two modes in one component:
//   'quote'  → a large pull-statement with an accentable keyword (金句)
//   'figure' → a monumental number framed by a short caption (大数字)
// Distinct from SlideQuote (centred blockquote) and SlideBigStat (number + stat
// row). Standalone & migratable: depends only on React (imported) + DECK_THEMES.
// Variation via props; copy authored in markup. CSS scoped under `.st-`.
//
// ── Props (canonical list in SlideStatement.META.controls) ────────────────────
//   theme    'dusk'|'midnight'|'graphite'|'dawn'|'vapor'|'paper'   bg mood   ('graphite')
//   mode     'quote'|'figure'      statement layout                          ('quote')
//   align    'left'|'center'       composition alignment                     ('left')
//   accent   boolean              tint the emphasised token with the accent  (true)
//   showMeta boolean              the attribution / source line              (true)
//
// Content props (authored at call-site):
//   kicker, statement: [{ t, mark? }], figure, figureCaption, attribution

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

function SlideStatement({
  kicker = '一句话 · ONE LINE',
  statement = [
    { t: '真正的复利，来自一套' },
    { t: '能被反复执行', mark: true },
    { t: '的纪律，而不是一次正确的预测。' },
  ],
  figure = '0.34%',
  figureCaption = '全包年费率 —— 我们用最低的成本，换来全天候的安心。',
  attribution = '林彦 · 首席投资官',
  theme = 'graphite', mode = 'quote', align = 'left', accent = true, showMeta = true,
}) {
  React.useEffect(() => { stInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  const center = align === 'center';

  return (
    <div className={`st-root ${center ? 'is-center' : ''} ${mode === 'figure' ? 'is-figure' : 'is-quote'}`}
         style={{ background: t.bg, color: t.fg, ['--st-sub']: t.sub }}>
      <div className="st-grain" />
      <div className="st-kicker">{kicker}</div>

      {mode === 'figure' ? (
        <>
          <div className={`st-figure ${accent ? 'is-accent' : ''}`}>{figure}</div>
          <p className="st-caption">{figureCaption}</p>
        </>
      ) : (
        <blockquote className="st-statement">
          <span className="st-inner">
            {statement.map((seg, i) => (
              <span key={i} className={seg.mark ? `st-mark ${accent ? 'is-accent' : ''}` : ''}>{seg.t}</span>
            ))}
          </span>
        </blockquote>
      )}

      {showMeta && <div className="st-meta">{attribution}</div>}
    </div>
  );
}

function stInjectStyle() {
  if (document.getElementById('st-style')) return;
  const s = document.createElement('style'); s.id = 'st-style';
  s.textContent = `
  .st-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;justify-content:center;
    align-items:flex-start;text-align:left;}
  .st-root.is-center{align-items:center;text-align:center;}
  .st-grain{position:absolute;inset:0;pointer-events:none;opacity:.45;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .st-kicker{position:relative;z-index:1;font-family:var(--font-mono);font-size:26px;letter-spacing:.22em;color:var(--st-sub);white-space:nowrap;}
  .st-statement{position:relative;z-index:1;font-size:88px;line-height:1.32;font-weight:300;margin:44px 0 0;
    max-width:1560px;letter-spacing:.01em;text-wrap:pretty;}
  .st-mark{font-weight:400;}
  .st-mark.is-accent{color:var(--ds-c4);}
  .st-figure{position:relative;z-index:1;font-size:300px;line-height:.9;font-weight:200;letter-spacing:-.02em;
    font-variant-numeric:tabular-nums;margin:30px 0 0;}
  .st-figure.is-accent{color:var(--ds-c4);}
  .st-caption{position:relative;z-index:1;font-size:34px;line-height:1.5;font-weight:300;color:var(--st-sub);
    margin:38px 0 0;max-width:1200px;text-wrap:pretty;}
  .st-meta{position:relative;z-index:1;font-family:var(--font-mono);font-size:26px;letter-spacing:.06em;
    color:var(--st-sub);margin-top:64px;white-space:nowrap;}
  `;
  document.head.appendChild(s);
}

SlideStatement.META = {
  id: 'statement', title: '声明金句',
  defaults: { theme: 'graphite', mode: 'quote', align: 'left', accent: true, showMeta: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'graphite',
      options: [
        { value: 'graphite', label: '石墨' }, { value: 'midnight', label: '午夜' },
        { value: 'dusk', label: '暮光' }, { value: 'dawn', label: '晨光' },
        { value: 'vapor', label: '雾光' }, { value: 'paper', label: '纸白' },
      ], description: '整页背景渐变与配色基调。' },
    { key: 'mode', type: 'radio', label: '版式模式', default: 'quote',
      options: [{ value: 'quote', label: '金句' }, { value: 'figure', label: '大数字' }],
      description: '金句（强调一句话）或大数字（一个数字 + 说明）两种排版。' },
    { key: 'align', type: 'radio', label: '对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '整体内容的对齐方式。' },
    { key: 'accent', type: 'toggle', label: '关键词强调', default: true,
      description: '将关键词 / 数字以强调色突出显示。' },
    { key: 'showMeta', type: 'toggle', label: '署名出处', default: true,
      description: '底部的署名或出处行。' },
  ],
};

export { SlideStatement };
export const META = SlideStatement.META;
export default SlideStatement;
