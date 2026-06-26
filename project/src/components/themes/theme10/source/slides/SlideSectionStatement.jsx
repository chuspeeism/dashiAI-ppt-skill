// SlideSectionStatement.jsx — a "manifesto" section divider: a big multi-line
// statement opening a part. Distinct from SlideChapterIndex (running TOC) and
// SlideSection (number + title). Standalone & migratable: depends only on React
// (global) + DECK_THEMES. CSS scoped under `.ss-`.
//
// ── Props (canonical list in SlideSectionStatement.META.controls) ─────────────
//   theme      'graphite'|'midnight'|'dusk'|'dawn'|'vapor'|'paper'  bg mood  ('dusk')
//   align      'left'|'center'    statement alignment                        ('left')
//   showIndex  boolean           the PART NN · label marker                  (true)
//   showRule   boolean           the baseline rule under the statement       (true)
//
// Content props (authored at call-site):
//   kicker, statement (use \n for line breaks), partNo, partLabel

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

function SlideSectionStatement({
  kicker = '我们的信念 · MANIFESTO',
  statement = '不预测，\n只准备。',
  partNo = '03', partLabel = '风险框架',
  theme = 'dusk', align = 'left', showIndex = true, showRule = false,
}) {
  React.useEffect(() => { ssInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  const center = align === 'center';
  return (
    <div className={`ss-root ${center ? 'is-center' : ''}`} style={{ background: t.bg, color: t.fg, ['--ss-sub']: t.sub }}>
      <div className="ss-grain" />
      <div className="ss-top">
        <span className="ss-kicker">{kicker}</span>
        {showIndex && (
          <span className="ss-index"><span className="ss-index-no">{partNo}</span><span className="ss-index-label">{partLabel}</span></span>
        )}
      </div>
      <div className="ss-body">
        <h2 className="ss-statement">{statement}</h2>
        {showRule && <span className="ss-rule" />}
      </div>
    </div>
  );
}

function ssInjectStyle() {
  if (document.getElementById('ss-style')) return;
  const s = document.createElement('style'); s.id = 'ss-style';
  s.textContent = `
  .ss-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;}
  .ss-grain{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .ss-top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:24px;}
  .ss-kicker{font-family:var(--font-mono);font-size:26px;letter-spacing:.24em;color:var(--ss-sub);white-space:nowrap;}
  .ss-index{display:flex;align-items:baseline;gap:16px;font-family:var(--font-mono);}
  .ss-index-no{font-size:32px;color:var(--ds-accent,#6f9bd8);letter-spacing:.04em;}
  .ss-index-label{font-size:26px;letter-spacing:.08em;color:var(--ss-sub);}
  .ss-body{position:relative;z-index:1;flex:1;display:flex;flex-direction:column;justify-content:center;}
  .ss-root.is-center .ss-body{align-items:center;text-align:center;}
  .ss-statement{font-size:150px;line-height:1.04;font-weight:300;letter-spacing:.005em;margin:0;
    white-space:pre-line;max-width:1600px;}
  .ss-rule{display:block;width:200px;height:2px;background:var(--ds-accent,#6f9bd8);margin-top:56px;opacity:.85;}
  `;
  document.head.appendChild(s);
}

SlideSectionStatement.META = {
  id: 'sectionstatement', title: '宣言章节',
  defaults: { theme: 'dusk', align: 'left', showIndex: true, showRule: false },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dusk',
      options: [
        { value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' },
        { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' },
        { value: 'vapor', label: '雾光' }, { value: 'paper', label: '纸白' },
      ], description: '分章页的背景渐变与配色基调。' },
    { key: 'align', type: 'radio', label: '对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '宣言文字的对齐方式。' },
    { key: 'showIndex', type: 'toggle', label: '章节标记', default: true,
      description: '右上角的「PART 编号 · 名称」标记。' },
    { key: 'showRule', type: 'toggle', label: '强调横线', default: false,
      description: '宣言下方的强调色短横线。' },
  ],
};

export { SlideSectionStatement };
export const META = SlideSectionStatement.META;
export default SlideSectionStatement;
