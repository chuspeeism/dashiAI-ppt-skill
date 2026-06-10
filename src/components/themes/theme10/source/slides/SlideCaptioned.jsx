// SlideCaptioned.jsx — 图注精读 / one image with numbered annotation callouts.
// A large image sits on one side; numbered markers pinned onto it correspond to
// a numbered note list on the other side — for reading a product shot, a chart
// printout or a scene in detail. Frame sizes to the uploaded image's aspect.
// Distinct from SlideFeature (image + stats), SlideMagazine (overlapping panel)
// and SlideCompareImage (two images): this is annotated single-image reading.
// Standalone & migratable: depends only on React + DeckImageSlot (both global).
// CSS scoped under `.cpn-`.
//
// ── Props (canonical list in SlideCaptioned.META.controls) ────────────────────
//   imageSide   'left'|'right'  which side the image sits                  ('left')
//   noteCount   number 2..5     how many annotation notes                  (3)
//   showMarkers boolean         the numbered pins on the image             (true)
//   showOverline boolean        the kicker above the title                 (true)
//
// Content props (authored at call-site):
//   idPrefix, overline, title, notes:[{ x, y, title, body }]  (x/y in 0..100)

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideCaptioned({
  idPrefix = 'captioned',
  overline = '细节 · ANNOTATED', title = '把一张图，读到底',
  notes = [
    { x: 30, y: 26, title: '实时净值', body: '主区显示组合当日净值与累计回报曲线。' },
    { x: 68, y: 44, title: '风险标尺', body: '右侧色带标注当前波动落在历史区间何处。' },
    { x: 42, y: 72, title: '再平衡点', body: '标记每次自动调仓的触发时刻与幅度。' },
    { x: 22, y: 56, title: '现金缓冲', body: '底部细条为随市况伸缩的现金垫。' },
    { x: 80, y: 22, title: '指数对照', body: '虚线为基准指数，便于即时比较超额。' },
  ],
  imageSide = 'left', noteCount = 3, showMarkers = false, showOverline = true,
}) {
  React.useEffect(() => { cpnInjectStyle(); }, []);
  const n = Math.max(2, Math.min(notes.length, noteCount));
  const used = notes.slice(0, n);
  const imgLeft = imageSide === 'left';

  return (
    <div className={`cpn-root ${imgLeft ? 'img-left' : 'img-right'}`}>
      <div className="cpn-imgwrap">
        <DeckImageSlot id={`${idPrefix}-img`} fit="cover" radius={0} placeholder="DETAIL IMAGE" />
        {showMarkers && used.map((m, i) => (
          <span className="cpn-marker" key={i} style={{ left: `${m.x}%`, top: `${m.y}%` }}>
            <span className="cpn-marker-dot">{i + 1}</span>
          </span>
        ))}
      </div>

      <div className="cpn-panel">
        {showOverline && <div className="cpn-overline">{overline}</div>}
        <h2 className="cpn-title">{title}</h2>
        <ol className="cpn-notes">
          {used.map((m, i) => (
            <li className="cpn-note" key={i}>
              <span className="cpn-num">{i + 1}</span>
              <span className="cpn-note-body">
                <span className="cpn-note-title">{m.title}</span>
                <span className="cpn-note-text">{m.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function cpnInjectStyle() {
  if (document.getElementById('cpn-style')) return;
  const s = document.createElement('style'); s.id = 'cpn-style';
  s.textContent = `
  .cpn-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    display:flex;font-family:var(--font-sans);}
  .cpn-root.img-right{flex-direction:row-reverse;}
  .cpn-imgwrap{position:relative;flex:0 0 52%;height:100%;overflow:hidden;background:var(--ds-bg-soft,#16181d);}
  .cpn-marker{position:absolute;transform:translate(-50%,-50%);}
  .cpn-marker-dot{display:flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;
    background:var(--ds-accent,#5479e8);color:#1a1206;font-family:var(--font-mono);font-size:26px;
    box-shadow:0 0 0 8px rgba(84,121,232,.2);}
  .cpn-panel{flex:1;min-width:0;padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;justify-content:center;}
  .cpn-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .cpn-title{font-size:62px;font-weight:300;margin:16px 0 48px;line-height:1.04;text-wrap:balance;}
  .cpn-notes{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:34px;}
  .cpn-note{display:flex;gap:28px;align-items:flex-start;}
  .cpn-num{flex:0 0 auto;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    box-shadow:inset 0 0 0 1.5px var(--ds-accent,#5479e8);color:var(--ds-accent,#5479e8);
    font-family:var(--font-mono);font-size:24px;}
  .cpn-note-body{display:flex;flex-direction:column;gap:8px;}
  .cpn-note-title{font-size:32px;font-weight:400;line-height:1.1;}
  .cpn-note-text{font-size:26px;font-weight:300;line-height:1.5;color:var(--ds-muted,rgba(242,243,246,.7));text-wrap:pretty;max-width:30ch;}
  `;
  document.head.appendChild(s);
}

SlideCaptioned.META = {
  id: 'captioned', title: '图注精读',
  defaults: { imageSide: 'left', noteCount: 3, showMarkers: false, showOverline: true },
  controls: [
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '主图所在的一侧（标注列表在另一侧）。' },
    { key: 'noteCount', type: 'slider', label: '标注数量', default: 3, min: 2, max: 5, step: 1,
      description: '图上的编号标记与右侧条目数量。' },
    { key: 'showMarkers', type: 'toggle', label: '图上标记', default: false,
      description: '图片上对应编号的圆形定位点。' },
    { key: 'showOverline', type: 'toggle', label: '栏目标签', default: true,
      description: '标题上方的等宽小标签。' },
  ],
};

export { SlideCaptioned };
export const META = SlideCaptioned.META;
export default SlideCaptioned;
