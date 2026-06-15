// SlidePoster.jsx — 主视觉海报 / a type-dominant statement over a photo.
// The image is texture; an oversized, multi-line headline is the subject, set
// against a directional scrim with a kicker and a thin footer line — a campaign
// poster / chapter divider. Distinct from SlideShowcase (photo-dominant + data
// ticker), SlideSectionStatement (no image) and SlideImageQuote (a quotation):
// this is a bold typographic poster. Standalone & migratable: depends only on
// React + DeckImageSlot (both global). Token-driven. CSS scoped under `.pst-`.
//
// ── Props (canonical list in SlidePoster.META.controls) ───────────────────────
//   headlinePos 'center'|'bottom'|'top'  vertical placement of the type    ('center')
//   scrim       number 30..85   darkening of the photo (%)                 (66)
//   showKicker  boolean         the kicker above the headline              (true)
//   showFooter  boolean         the thin footer meta line                  (true)
//   showRule    boolean         the accent rule by the headline            (true)
//
// Content props (authored at call-site):
//   idPrefix, kicker, headline, footL, footR

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

function SlidePoster({
  idPrefix = 'poster',
  kicker = '第三章 · 长期主义', headline = '时间，是\n最被低估的\n复利',
  footL = '自主指数 · 2025 年度报告', footR = '03 / 05',
  headlinePos = 'center', scrim = 66, showKicker = true, showFooter = true, showRule = true,
  backgroundMode = 'unicorn', unicornScene = 'tech',
}) {
  React.useEffect(() => { pstInjectStyle(); }, []);
  const sc = Math.max(0, Math.min(95, scrim)) / 100;
  const lines = String(headline).split('\n');
  const useUnicorn = backgroundMode === 'unicorn';

  return (
    <div className={`pst-root pos-${headlinePos}`}>
      <div className="pst-img">
        {useUnicorn
          ? <UnicornBackground scene={unicornScene} accent="var(--ds-accent,#5479e8)" />
          : <DeckImageSlot id={`${idPrefix}-bg`} fit="cover" radius={0} placeholder="POSTER IMAGE" />}
      </div>
      <div className="pst-scrim" style={{ '--pst-sc': sc }} />

      <div className="pst-content">
        {showKicker && <div className="pst-kicker">{kicker}</div>}
        <h2 className="pst-headline">
          {showRule && <span className="pst-rule" />}
          {lines.map((l, i) => <span className="pst-line" key={i}>{l}</span>)}
        </h2>
      </div>

      {showFooter && (
        <div className="pst-footer">
          <span>{footL}</span>
          <span className="pst-foot-r">{footR}</span>
        </div>
      )}
    </div>
  );
}

function pstInjectStyle() {
  if (document.getElementById('pst-style')) return;
  const s = document.createElement('style'); s.id = 'pst-style';
  s.textContent = `
  .pst-root{position:relative;width:100%;height:100%;background:#0b0c0f;color:#f5f4f1;
    overflow:hidden;font-family:var(--font-sans);}
  .pst-img{position:absolute;inset:0;filter:saturate(.9);}
  .pst-scrim{position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(115deg, rgba(8,9,11,calc(var(--pst-sc)*.92)) 0%, rgba(8,9,11,calc(var(--pst-sc)*.6)) 46%, rgba(8,9,11,calc(var(--pst-sc)*.2)) 100%);}
  .pst-content{position:absolute;z-index:3;left:var(--pad-x,120px);right:var(--pad-x,120px);}
  .pst-root.pos-center .pst-content{top:50%;transform:translateY(-50%);}
  .pst-root.pos-bottom .pst-content{bottom:170px;}
  .pst-root.pos-top .pst-content{top:var(--pad-y,96px);}
  .pst-kicker{font-family:var(--font-mono);font-size:28px;letter-spacing:.2em;text-transform:uppercase;
    color:var(--ds-accent,#5479e8);margin-bottom:34px;}
  .pst-headline{position:relative;margin:0;display:flex;flex-direction:column;
    font-size:132px;font-weight:300;line-height:.98;letter-spacing:-.025em;text-wrap:balance;}
  .pst-rule{position:absolute;left:-40px;top:6px;bottom:6px;width:5px;border-radius:3px;
    background:linear-gradient(180deg,var(--ds-c1),var(--ds-c3));}
  .pst-line{display:block;}
  .pst-footer{position:absolute;z-index:3;left:var(--pad-x,120px);right:var(--pad-x,120px);bottom:64px;
    display:flex;justify-content:space-between;align-items:center;
    padding-top:28px;border-top:1px solid rgba(245,244,241,.22);
    font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:rgba(245,244,241,.7);}
  .pst-foot-r{color:var(--ds-accent,#5479e8);}
  `;
  document.head.appendChild(s);
}

SlidePoster.META = {
  id: 'poster', title: '主视觉海报',
  defaults: { headlinePos: 'center', scrim: 66, showKicker: true, showFooter: true, showRule: true, backgroundMode: 'unicorn', unicornScene: 'tech' },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('tech'),
    { key: 'headlinePos', type: 'radio', label: '标题位置', default: 'center',
      options: [{ value: 'top', label: '顶部' }, { value: 'center', label: '居中' }, { value: 'bottom', label: '底部' }],
      description: '超大标题在画面中的垂直位置。' },
    { key: 'scrim', type: 'slider', label: '压暗程度', default: 66, min: 30, max: 85, step: 5, unit: '%',
      description: '图片之上的方向性压暗强度（左深右浅）。' },
    { key: 'showKicker', type: 'toggle', label: '章节标签', default: true,
      description: '大标题上方的等宽章节标签。' },
    { key: 'showFooter', type: 'toggle', label: '页脚信息', default: true,
      description: '底部细线分隔的页脚信息行。' },
    { key: 'showRule', type: 'toggle', label: '强调竖条', default: true,
      description: '大标题左侧的强调色竖条。' },
  ],
};

export { SlidePoster };
export const META = SlidePoster.META;
export default SlidePoster;
