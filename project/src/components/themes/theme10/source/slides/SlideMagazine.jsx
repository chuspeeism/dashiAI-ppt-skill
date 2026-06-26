// SlideMagazine.jsx — 杂志图文 / editorial photo spread.
// A large editorial image bleeds off one side; a text column with a kicker,
// headline, lede and a couple of pull facts overlaps it on a floating panel.
// Distinct from SlideProfile (full-bleed portrait), SlideFeature, SlideCompareImage
// (two images), SlideFilmstrip (row) and SlideTeam (grid): one hero image + a
// magazine-style overlapping text block. Standalone & migratable: depends only
// on React + DeckImageSlot (both global). Token-driven. CSS scoped `.mag-`.
//
// ── Props (canonical list in SlideMagazine.META.controls) ─────────────────────
//   imageSide    'left'|'right'   which side the photo bleeds off          ('right')
//   imageCount   boolean          show the hero image                      (true)
//   factCount    number 0..3      pull-fact rows under the lede            (2)
//   panelGlass   boolean          frosted panel vs solid                   (true)
//   showKicker   boolean          the kicker overline                      (true)
//
// Content props (authored at call-site):
//   idPrefix, kicker, headline, lede, facts:[{ value, label }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideMagazine({
  idPrefix = 'magazine',
  kicker = '专栏 · IN PRACTICE', headline = '把纪律，过成一种习惯',
  lede = '真正改变结果的，不是某一次聪明的择时，而是日复一日、不被情绪干扰的执行。引擎把这件最难坚持的事，变成默认发生。',
  facts = [
    { value: '0 次', label: '需要你手动盯盘' },
    { value: '每 14 天', label: '自动检查再平衡' },
    { value: '100%', label: '决策可回溯' },
  ],
  imageSide = 'right', imageCount = true, factCount = 2, panelGlass = true, showKicker = true,
}) {
  React.useEffect(() => { magInjectStyle(); }, []);
  const hasImg = imageCount !== false && imageCount !== 0 && imageCount !== '0' && imageCount !== 'false';
  const fc = Math.max(0, Math.min(3, factCount));
  const usedFacts = facts.slice(0, fc);
  const imgLeft = imageSide === 'left';

  return (
    <div className={`mag-root ${imgLeft ? 'img-left' : 'img-right'} ${hasImg ? '' : 'no-img'}`}>
      {hasImg && (
        <div className="mag-imgwrap">
          <DeckImageSlot id={`${idPrefix}-hero`} fit="cover"
                         placeholder="EDITORIAL IMAGE" />
        </div>
      )}

      <div className={`mag-panel ${panelGlass && hasImg ? 'glass' : 'solid'}`}>
        {showKicker && <div className="mag-kicker">{kicker}</div>}
        <h2 className="mag-headline">{headline}</h2>
        <p className="mag-lede">{lede}</p>
        {usedFacts.length > 0 && (
          <div className="mag-facts">
            {usedFacts.map((f, i) => (
              <div className="mag-fact" key={i}>
                <span className="mag-fact-val">{f.value}</span>
                <span className="mag-fact-lab">{f.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function magInjectStyle() {
  if (document.getElementById('mag-style')) return;
  const s = document.createElement('style'); s.id = 'mag-style';
  s.textContent = `
  .mag-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    overflow:hidden;font-family:var(--font-sans);}
  .mag-imgwrap{position:absolute;top:0;bottom:0;width:60%;}
  .mag-root.img-right .mag-imgwrap{right:0;}
  .mag-root.img-left .mag-imgwrap{left:0;}
  .mag-panel{position:absolute;top:50%;transform:translateY(-50%);width:46%;
    padding:64px 60px;display:flex;flex-direction:column;border-radius:20px;}
  .mag-root.img-right .mag-panel{left:var(--pad-x,120px);}
  .mag-root.img-left .mag-panel{right:var(--pad-x,120px);}
  .mag-root.no-img .mag-panel{width:62%;left:var(--pad-x,120px);}
  .mag-panel.glass{background:color-mix(in srgb,var(--ds-bg,#0d0e11) 74%,transparent);
    backdrop-filter:blur(18px);box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.14));}
  .mag-panel.solid{background:transparent;padding-left:0;padding-right:80px;}
  .mag-kicker{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-accent,#6f9bd8);}
  .mag-headline{font-size:74px;font-weight:300;line-height:1.04;margin:22px 0 0;letter-spacing:-.01em;text-wrap:balance;}
  .mag-lede{font-size:30px;font-weight:300;line-height:1.55;margin:30px 0 0;max-width:24ch;
    color:var(--ds-muted,rgba(242,243,246,.74));text-wrap:pretty;}
  .mag-facts{display:flex;gap:48px;margin-top:46px;flex-wrap:wrap;}
  .mag-fact{display:flex;flex-direction:column;gap:6px;}
  .mag-fact-val{font-size:48px;font-weight:300;font-variant-numeric:tabular-nums;color:var(--ds-accent,#6f9bd8);line-height:1;}
  .mag-fact-lab{font-family:var(--font-mono);font-size:24px;letter-spacing:.03em;color:var(--ds-faint,rgba(242,243,246,.55));}
  `;
  document.head.appendChild(s);
}

SlideMagazine.META = {
  id: 'magazine', title: '杂志图文',
  defaults: { imageSide: 'right', imageCount: true, factCount: 2, panelGlass: true, showKicker: true },
  controls: [
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'right',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '大图出血所在的一侧（文字面板在另一侧浮起）。' },
    { key: 'imageCount', type: 'toggle', label: '显示图片', default: true,
      description: '显示或隐藏主图。图片随上传比例自适应裁切。' },
    { key: 'factCount', type: 'slider', label: '数据条数', default: 2, min: 0, max: 3, step: 1,
      description: '正文下方的关键数据条数量。' },
    { key: 'panelGlass', type: 'toggle', label: '毛玻璃面板', default: true,
      description: '文字面板为毛玻璃（叠在图上）或透明直排。' },
    { key: 'showKicker', type: 'toggle', label: '栏目标签', default: true,
      description: '标题上方的栏目小标签。' },
  ],
};

export { SlideMagazine };
export const META = SlideMagazine.META;
export default SlideMagazine;
