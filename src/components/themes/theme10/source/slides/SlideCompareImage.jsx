// SlideCompareImage.jsx — two-up image comparison (before/after, A vs B).
// Two adaptive image slots with a centre divider, per-side labels and captions.
// Standalone & migratable: depends only on React (imported) + DeckImageSlot.
// CSS scoped under `.ci-`.
//
// ── Props (canonical list in SlideCompareImage.META.controls) ─────────────────
//   split        number 35..65   left panel width (%)                   (50)
//   showDivider  boolean         the centre divider + VS badge           (true)
//   showLabels   boolean         the per-side label chips                (true)
//   showCaption  boolean         the per-side captions                   (true)
//
// Content props (authored at call-site):
//   overline, title, leftLabel, rightLabel, leftCaption, rightCaption

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideCompareImage({
  idPrefix = 'compareimg',
  overline = '对照 · BEFORE / AFTER', title = '同一笔钱，两种命运',
  leftLabel = '传统理财', rightLabel = '自主指数',
  leftCaption = '人工、滞后、被情绪左右。', rightCaption = '自动、实时、由纪律驱动。',
  split = 50, showDivider = true, showLabels = true, showCaption = true,
}) {
  React.useEffect(() => { ciInjectStyle(); }, []);
  const s = Math.max(35, Math.min(65, split));

  const panel = (side, label, caption) => (
    <div className="ci-panel" style={{ width: `${side === 'left' ? s : 100 - s}%` }}>
      <DeckImageSlot id={`${idPrefix}-${side}`} fit="cover" radius={0} placeholder={side === 'left' ? 'A' : 'B'} />
      <div className={`ci-scrim ci-scrim-${side}`} />
      {showLabels && <span className={`ci-chip ci-chip-${side}`}>{label}</span>}
      {showCaption && <span className="ci-cap">{caption}</span>}
    </div>
  );

  return (
    <div className="ci-root">
      <div className="ci-head">
        <span className="ci-overline">{overline}</span>
        <h2 className="ci-title">{title}</h2>
      </div>
      <div className="ci-stage">
        {panel('left', leftLabel, leftCaption)}
        {panel('right', rightLabel, rightCaption)}
        {showDivider && <span className="ci-divider" style={{ left: `${s}%` }}><span className="ci-vs">VS</span></span>}
      </div>
    </div>
  );
}

function ciInjectStyle() {
  if (document.getElementById('ci-style')) return;
  const s = document.createElement('style'); s.id = 'ci-style';
  s.textContent = `
  .ci-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .ci-head{margin-bottom:40px;}
  .ci-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ci-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .ci-stage{position:relative;flex:1;display:flex;gap:6px;border-radius:22px;overflow:hidden;min-height:0;}
  .ci-panel{position:relative;height:100%;overflow:hidden;}
  .ci-panel .dslot{border-radius:0;}
  .ci-scrim{position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(0deg,rgba(8,9,11,.72) 0%,rgba(8,9,11,.1) 42%,rgba(8,9,11,.34) 100%);}
  .ci-chip{position:absolute;top:32px;font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;
    padding:10px 20px;border-radius:999px;background:rgba(8,9,11,.5);color:#f4f4f2;backdrop-filter:blur(6px);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);}
  .ci-chip-left{left:36px;} .ci-chip-right{right:36px;background:linear-gradient(120deg,var(--ds-c1) 0%,var(--ds-c3) 55%,var(--ds-c4) 100%);color:#fff;box-shadow:none;}
  .ci-cap{position:absolute;left:40px;right:40px;bottom:40px;font-size:30px;font-weight:300;color:#f4f4f2;
    text-wrap:pretty;}
  .ci-divider{position:absolute;top:0;bottom:0;width:0;transform:translateX(-50%);
    display:flex;align-items:center;justify-content:center;pointer-events:none;}
  .ci-vs{flex:0 0 auto;font-family:var(--font-mono);font-size:26px;letter-spacing:.1em;color:#0d0e11;
    width:76px;height:76px;border-radius:50%;background:#f3f3f0;display:flex;align-items:center;justify-content:center;
    box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);}
  `;
  document.head.appendChild(s);
}

SlideCompareImage.META = {
  id: 'compareimg', title: '图像对照',
  defaults: { split: 50, showDivider: true, showLabels: true, showCaption: true },
  controls: [
    { key: 'split', type: 'slider', label: '左右占比', default: 50, min: 35, max: 65, step: 5, unit: '%',
      description: '左侧画面所占的宽度比例。' },
    { key: 'showDivider', type: 'toggle', label: '中缝与徽标', default: true,
      description: '中间的分隔与 VS 圆标。' },
    { key: 'showLabels', type: 'toggle', label: '分组标签', default: true,
      description: '每一侧顶部的标签胶囊。' },
    { key: 'showCaption', type: 'toggle', label: '说明文字', default: true,
      description: '每一侧底部的说明文字。' },
  ],
};

export { SlideCompareImage };
export const META = SlideCompareImage.META;
export default SlideCompareImage;
