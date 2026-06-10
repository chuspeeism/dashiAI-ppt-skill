// SlidePinboard.jsx — 影像贴墙 / scattered pinned photo cards.
// A small set of framed photo cards, each lightly rotated and pinned to a board,
// with a mono caption strip beneath. Every card adapts to its uploaded image's
// true aspect ratio (no cropping) by reading onAspect — so portrait and
// landscape shots both sit naturally. Composition stays balanced from 2 to 5
// cards. Standalone & migratable: depends on React + DeckImageSlot (global).
// Token-driven frame. CSS scoped under `.pin-`.
//
// ── Props (canonical list in SlidePinboard.META.controls) ────────────────────
//   cardCount    number 2..5   how many pinned cards                     (4)
//   showCaption  boolean       the caption strip under each card         (true)
//   scatter      boolean       apply the rotation/offset scatter         (true)
//   showPin      boolean       the pin dot at each card's top            (true)
//
// Content props (authored at call-site):
//   overline, title, cards:[{ caption }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlidePinboard({
  idPrefix = 'pinboard',
  overline = '影像 · FIELD NOTES', title = '组合背后的人与现场',
  cards = [
    { caption: '01 · 月度策略评审' },
    { caption: '02 · 再平衡执行台' },
    { caption: '03 · 风控晨会' },
    { caption: '04 · 数据基建机房' },
    { caption: '05 · 客户面谈' },
  ],
  cardCount = 4, showCaption = true, scatter = true, showPin = true,
}) {
  React.useEffect(() => { pinInjectStyle(); }, []);
  const n = Math.max(2, Math.min(cards.length, cardCount));
  const data = cards.slice(0, n);
  const photoW = n <= 2 ? 460 : n === 3 ? 392 : n === 4 ? 332 : 288;
  const [aspects, setAspects] = React.useState({});
  const setA = React.useCallback((i, r) => setAspects((m) => (m[i] === r ? m : { ...m, [i]: r })), []);
  const rot = [-9, 7, -5, 10.5, -7.5, 5.5];
  const off = [20, 92, 44, 104, 62, 78];

  return (
    <div className="pin-root">
      <div className="pin-head">
        <div className="pin-overline">{overline}</div>
        <h2 className="pin-title">{title}</h2>
      </div>
      <div className={`pin-wall ${scatter ? '' : 'is-flat'}`}>
        {data.map((c, i) => {
          const ar = aspects[i] || 1.34;
          return (
            <figure key={i} className="pin-card"
                    style={{ transform: scatter ? `rotate(${rot[i % rot.length]}deg)` : 'none',
                             marginTop: scatter ? `${off[i % off.length]}px` : '0',
                             paddingBottom: showCaption ? undefined : '24px',
                             maxWidth: `${photoW + 36}px` }}>
              {showPin && <span className="pin-dot" />}
              <span className="pin-photo" style={{ aspectRatio: String(ar), width: `${photoW}px` }}>
                <DeckImageSlot id={`${idPrefix}-card-${i}`} fit="cover" radius={4}
                               placeholder={`PHOTO ${i + 1}`} onAspect={(r) => setA(i, r)} />
              </span>
              {showCaption && <figcaption className="pin-cap">{c.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
    </div>
  );
}

function pinInjectStyle() {
  if (document.getElementById('pin-style')) return;
  const s = document.createElement('style'); s.id = 'pin-style';
  s.textContent = `
  .pin-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);font-family:var(--font-sans);display:flex;flex-direction:column;}
  .pin-head{margin-bottom:40px;flex:0 0 auto;}
  .pin-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .pin-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.1;letter-spacing:.01em;}
  .pin-wall{flex:1;display:flex;align-items:flex-start;justify-content:center;gap:clamp(28px,3.4vw,64px);min-height:0;padding-top:8px;}
  .pin-wall.is-flat{align-items:center;padding-top:0;}
  .pin-card{margin:0;flex:0 1 auto;background:var(--ds-panel,#f3f3f0);
    padding:18px 18px 0;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12);
    display:flex;flex-direction:column;position:relative;}
  .pin-dot{position:absolute;top:-12px;left:50%;transform:translateX(-50%);width:20px;height:20px;border-radius:50%;
    background:var(--ds-accent,#5479e8);box-shadow:inset 0 2px 3px rgba(255,255,255,.4);}
  .pin-photo{position:relative;display:block;overflow:hidden;border-radius:4px;background:#0c0d10;max-height:60vh;}
  .pin-cap{font-family:var(--font-mono);font-size:23px;letter-spacing:.05em;color:var(--ds-panel-ink,#101216);
    opacity:.78;padding:18px 4px 20px;text-align:center;}
  `;
  document.head.appendChild(s);
}

SlidePinboard.META = {
  id: 'pinboard', title: '影像贴墙',
  defaults: { cardCount: 4, showCaption: true, scatter: true, showPin: true },
  controls: [
    { key: 'cardCount', type: 'slider', label: '照片数量', default: 4, min: 2, max: 5, step: 1,
      description: '贴墙上的照片卡数量；每张随上传图片比例自适应。' },
    { key: 'showCaption', type: 'toggle', label: '照片说明', default: true,
      description: '每张照片下方的说明条。' },
    { key: 'scatter', type: 'toggle', label: '随性散布', default: true,
      description: '为照片卡施加轻微旋转与错落；关闭则整齐排列。' },
    { key: 'showPin', type: 'toggle', label: '图钉', default: true,
      description: '每张照片顶部的图钉。' },
  ],
};

export { SlidePinboard };
export const META = SlidePinboard.META;
export default SlidePinboard;
