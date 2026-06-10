// SlideQuoteImage.jsx — 影像金句 / portrait beside a large pull-quote.
// A full-bleed image column paired with an oversized quotation and attribution.
// Distinct from SlideProfile (portrait + credentials list), SlideTestimonials
// (a grid of small cards) and SlideImageQuote (text laid OVER a full-bleed
// image): here the photo and the quote occupy separate columns. Standalone &
// migratable: depends only on React + DeckImageSlot (both global). Token-driven,
// light/dark tone applies. CSS scoped `.qim-`.
//
// ── Props (canonical list in SlideQuoteImage.META.controls) ───────────────────
//   imageSide    'left'|'right'  which column holds the portrait          ('left')
//   split        number 32..52   image column width (% of slide)          (42)
//   showMark     boolean         the big decorative quote mark            (true)
//   showAttribution boolean      name / role line under the quote         (true)
//   radius       number 0..28    image corner radius (px)                 (16)
//
// Content props (authored at call-site):
//   idPrefix, overline, quote, name, role

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideQuoteImage({
  idPrefix = 'quoteimg',
  overline = '受托人手记 · IN THEIR WORDS',
  quote = '我们不预测市场，我们设计一套无论市场怎么走，你都能睡得着觉的结构。',
  name = '林知远',
  role = '首席投资官 · 自主指数',
  imageSide = 'left', split = 42, showMark = true, showAttribution = true, radius = 16,
}) {
  React.useEffect(() => { qimInjectStyle(); }, []);
  const imgW = Math.max(32, Math.min(52, split));

  const Picture = (
    <div className="qim-pic" style={{ flex: `0 0 ${imgW}%`, borderRadius: radius }}>
      <DeckImageSlot id={`${idPrefix}-portrait`} fit="cover" radius={radius} placeholder="PORTRAIT" />
    </div>
  );

  const Text = (
    <div className="qim-text">
      <div className="qim-overline">{overline}</div>
      <blockquote className="qim-quote">
        {showMark && <span className="qim-mark" aria-hidden="true">“</span>}
        <span className="qim-words">{quote}</span>
      </blockquote>
      {showAttribution && (
        <div className="qim-attr">
          <span className="qim-rule" />
          <div className="qim-who">
            <span className="qim-name">{name}</span>
            <span className="qim-role">{role}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`qim-root ${imageSide === 'right' ? 'is-imgright' : 'is-imgleft'}`}>
      {imageSide === 'right' ? <>{Text}{Picture}</> : <>{Picture}{Text}</>}
    </div>
  );
}

function qimInjectStyle() {
  if (document.getElementById('qim-style')) return;
  const s = document.createElement('style'); s.id = 'qim-style';
  s.textContent = `
  .qim-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    display:flex;align-items:stretch;gap:0;font-family:var(--font-sans);}
  .qim-pic{position:relative;min-height:0;overflow:hidden;margin:48px;}
  .qim-root.is-imgleft .qim-pic{margin-right:0;}
  .qim-root.is-imgright .qim-pic{margin-left:0;}
  .qim-text{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;
    padding:var(--pad-y,96px) var(--pad-x,120px);}
  .qim-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));
    margin-bottom:40px;}
  .qim-quote{position:relative;margin:0;}
  .qim-mark{position:absolute;left:-12px;top:-78px;font-size:200px;line-height:1;color:var(--ds-accent,#5479e8);
    opacity:.5;font-family:Georgia,'Songti SC',serif;pointer-events:none;}
  .qim-words{position:relative;display:block;font-size:62px;font-weight:300;line-height:1.28;letter-spacing:.005em;
    text-wrap:pretty;}
  .qim-attr{display:flex;align-items:center;gap:30px;margin-top:56px;}
  .qim-rule{width:84px;height:2px;background:var(--ds-accent,#5479e8);flex:0 0 auto;}
  .qim-who{display:flex;flex-direction:column;gap:6px;}
  .qim-name{font-size:34px;font-weight:400;}
  .qim-role{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-muted,rgba(242,243,246,.6));}
  `;
  document.head.appendChild(s);
}

SlideQuoteImage.META = {
  id: 'quoteimg', title: '影像金句',
  defaults: { imageSide: 'left', split: 42, showMark: true, showAttribution: true, radius: 16 },
  controls: [
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '肖像所在的一侧。图片随上传比例自适应裁切填满。' },
    { key: 'split', type: 'slider', label: '图片宽度', default: 42, min: 32, max: 52, step: 2, unit: '%',
      description: '图片列占整页的宽度。' },
    { key: 'showMark', type: 'toggle', label: '引号装饰', default: true,
      description: '金句左上角的大引号。' },
    { key: 'showAttribution', type: 'toggle', label: '署名', default: true,
      description: '金句下方的姓名 / 职务。' },
    { key: 'radius', type: 'slider', label: '圆角', default: 16, min: 0, max: 28, step: 2, unit: 'px',
      description: '图片的圆角半径。' },
  ],
};

export { SlideQuoteImage };
export const META = SlideQuoteImage.META;
export default SlideQuoteImage;
