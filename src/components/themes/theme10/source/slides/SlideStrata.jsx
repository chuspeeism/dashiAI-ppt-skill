// SlideStrata.jsx — 横向影像带 / stacked full-width image bands.
// Two to four full-bleed horizontal image strips stack to fill the frame; each
// carries a left-anchored lockup (index + label + caption) over a directional
// scrim. The focused band expands to take more vertical room, the others
// compress — so one image can lead without losing the rhythm. Image slots are
// cover-fit, so any uploaded ratio fills its band cleanly. Standalone &
// migratable: depends on React + DeckImageSlot (global). CSS scoped under `.str-`.
//
// ── Props (canonical list in SlideStrata.META.controls) ──────────────────────
//   tileCount    number 2..4   how many image bands                      (3)
//   showCaption  boolean       the caption line under each label         (true)
//   showIndex    boolean       the mono index numeral per band           (true)
//   focus        boolean       expand one band, compress the others      (false)
//   focusIndex   number 1..4   which band expands (1-based)              (1)
//
// Content props (authored at call-site):
//   bands:[{ label, caption }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideStrata({
  idPrefix = 'strata',
  bands = [
    { label: '资产配置', caption: '跨市场、跨币种的底层敞口' },
    { label: '风控引擎', caption: '自主再平衡与回撤阈值' },
    { label: '实证回报', caption: '十年穿越周期的净值轨迹' },
    { label: '团队纪律', caption: '不预测、不择时、不漂移' },
  ],
  tileCount = 3, showCaption = true, showIndex = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { strInjectStyle(); }, []);
  const n = Math.max(2, Math.min(bands.length, tileCount));
  const data = bands.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;

  return (
    <div className="str-root">
      {data.map((b, i) => {
        const hot = i === fIdx;
        const grow = fIdx >= 0 ? (hot ? 2.2 : 1) : 1;
        return (
          <div key={i} className={`str-band ${hot ? 'is-focus' : ''}`} style={{ flexGrow: grow }}>
            <DeckImageSlot id={`${idPrefix}-band-${i}`} fit="cover" radius={0}
                           placeholder={`IMAGE ${i + 1}`} />
            <span className="str-scrim" />
            <div className="str-lock">
              {showIndex && <span className="str-idx">{String(i + 1).padStart(2, '0')}</span>}
              <div className="str-text">
                <span className="str-label">{b.label}</span>
                {showCaption && <span className="str-cap">{b.caption}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function strInjectStyle() {
  if (document.getElementById('str-style')) return;
  const s = document.createElement('style'); s.id = 'str-style';
  s.textContent = `
  .str-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);
    display:flex;flex-direction:column;gap:6px;font-family:var(--font-sans);}
  .str-band{position:relative;flex:1 1 0;min-height:0;overflow:hidden;
    transition:flex-grow .35s cubic-bezier(.3,.7,.4,1);}
  .str-band .dslot{border-radius:0;}
  .str-scrim{position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(90deg,rgba(7,8,11,.86) 0%,rgba(7,8,11,.5) 32%,rgba(7,8,11,0) 60%);}
  .str-lock{position:absolute;left:var(--pad-x,120px);top:0;bottom:0;z-index:1;
    display:flex;align-items:center;gap:34px;pointer-events:none;color:#f4f4f2;}
  .str-idx{font-family:var(--font-mono);font-size:48px;font-weight:300;font-variant-numeric:tabular-nums;
    color:rgba(244,244,242,.55);letter-spacing:.02em;}
  .str-band.is-focus .str-idx{color:var(--ds-accent,#5479e8);}
  .str-text{display:flex;flex-direction:column;gap:10px;}
  .str-label{font-size:46px;font-weight:300;letter-spacing:.01em;}
  .str-cap{font-family:var(--font-mono);font-size:25px;letter-spacing:.04em;color:rgba(244,244,242,.74);}
  .str-band.is-focus .str-label{color:var(--ds-accent,#5479e8);}
  `;
  document.head.appendChild(s);
}

SlideStrata.META = {
  id: 'strata', title: '横向影像带',
  defaults: { tileCount: 3, showCaption: true, showIndex: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'tileCount', type: 'slider', label: '影像带数量', default: 3, min: 2, max: 4, step: 1,
      description: '纵向堆叠的横向图片带数量（0 图时显示占位）。' },
    { key: 'showCaption', type: 'toggle', label: '说明文字', default: true,
      description: '每条影像带标签下的说明小字。' },
    { key: 'showIndex', type: 'toggle', label: '序号', default: true,
      description: '每条影像带左侧的等宽序号。' },
    { key: 'focus', type: 'toggle', label: '重点放大', default: false,
      description: '放大某一条影像带，其余压缩。' },
    { key: 'focusIndex', type: 'slider', label: '放大第几条', default: 1, min: 1, max: 4, step: 1,
      description: '需开启「重点放大」后生效。' },
  ],
};

export { SlideStrata };
export const META = SlideStrata.META;
export default SlideStrata;
