// SlideCollage.jsx — 拼贴影像 / a scattered, lightly-tilted photo wall.
// Photos drop into a loose scrapbook arrangement; each frame rotates a touch and
// carries a mono index/caption, so a set of moments reads as one spread. Frames
// size themselves to each uploaded image's true aspect (fixed height, width from
// ratio) so nothing is awkwardly cropped. Distinct from Slide04Gallery (tidy
// grid), SlideTriptych (3 equal), SlideFilmstrip (single row) and SlideMosaic:
// this is the deliberately-imperfect collage. Standalone & migratable: depends
// only on React + DeckImageSlot (both global). CSS scoped under `.clg-`.
//
// ── Props (canonical list in SlideCollage.META.controls) ──────────────────────
//   imageCount   number 3..6   how many photo frames                      (5)
//   tilt         boolean       apply the scattered rotation                (true)
//   showCaptions boolean       the mono caption under each frame           (true)
//   showIndex    boolean       the corner index tab                        (true)
//
// Content props (authored at call-site):
//   idPrefix, overline, title, captions:[...]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideCollage({
  idPrefix = 'collage',
  overline = '影像志 · COLLAGE', title = '一年，被记录下来',
  captions = ['年度策略会', '客户面谈', '研究台', '路演现场', '团队复盘', '颁奖之夜'],
  imageCount = 5, tilt = true, showCaptions = true, showIndex = true,
}) {
  React.useEffect(() => { clgInjectStyle(); }, []);
  const n = Math.max(3, Math.min(6, imageCount));
  const [aspects, setAspects] = React.useState({});
  const setA = (k, r) => setAspects((m) => (m[k] === r ? m : { ...m, [k]: r }));

  // Loose layouts per count: center x/y in %, frame height in px, rotation deg.
  const LAYOUTS = {
    3: [ [24, 50, 430, -3], [52, 44, 470, 2], [78, 56, 410, 4] ],
    4: [ [21, 40, 380, -4], [47, 56, 420, 3], [72, 38, 360, 2], [82, 66, 320, -3] ],
    5: [ [19, 38, 360, -4], [42, 56, 400, 2], [50, 30, 300, 4], [70, 50, 380, -2], [86, 68, 300, 5] ],
    6: [ [17, 36, 330, -4], [38, 54, 360, 2], [46, 28, 270, 3], [64, 46, 350, -3], [80, 64, 300, 4], [88, 32, 250, -2] ],
  };
  const layout = LAYOUTS[n];

  return (
    <div className="clg-root">
      <div className="clg-head">
        <div className="clg-overline">{overline}</div>
        <h2 className="clg-title">{title}</h2>
      </div>

      <div className="clg-stage">
        {layout.map((L, i) => {
          const [x, y, h, rot] = L;
          const key = `${idPrefix}-${i}`;
          const ar = aspects[key] || 1.32;
          const w = Math.max(200, Math.min(h * ar, 560));
          return (
            <figure className={`clg-frame ${showCaptions ? '' : 'is-no-caption'}`} key={i}
                     style={{ left: `${x}%`, top: `${y}%`, width: w, transform: `translate(-50%,-50%) rotate(${tilt ? rot : 0}deg)` }}>
              {showIndex && <span className="clg-tab">{String(i + 1).padStart(2, '0')}</span>}
              <div className="clg-slot" style={{ height: h }}>
                <DeckImageSlot id={key} fit="cover" radius={4}
                               placeholder={`PHOTO ${i + 1}`} onAspect={(r) => setA(key, r)} />
              </div>
              {showCaptions && <figcaption className="clg-cap">{captions[i] || `影像 ${i + 1}`}</figcaption>}
            </figure>
          );
        })}
      </div>
    </div>
  );
}

function clgInjectStyle() {
  if (document.getElementById('clg-style')) return;
  const s = document.createElement('style'); s.id = 'clg-style';
  s.textContent = `
  .clg-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    overflow:hidden;font-family:var(--font-sans);}
  .clg-head{position:absolute;left:var(--pad-x,120px);top:var(--pad-y,96px);z-index:5;max-width:40%;}
  .clg-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .clg-title{font-size:58px;font-weight:300;margin:14px 0 0;line-height:1.04;text-wrap:balance;}
  .clg-stage{position:absolute;left:0;right:0;bottom:0;top:calc(var(--pad-y,96px) + 150px);}
  .clg-frame{position:absolute;margin:0;padding:14px 14px 0;background:var(--ds-panel,#f3f3f0);
    box-shadow:inset 0 0 0 1px rgba(0,0,0,.14);}
  .clg-frame.is-no-caption{padding-bottom:14px;}
  .clg-slot{position:relative;width:100%;overflow:hidden;background:var(--ds-bg-soft,#16181d);}
  .clg-tab{position:absolute;top:-14px;left:-14px;z-index:3;width:46px;height:46px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;background:var(--ds-accent,#5479e8);color:#1a1206;
    font-family:var(--font-mono);font-size:21px;}
  .clg-cap{padding:14px 4px 16px;font-family:var(--font-mono);font-size:22px;letter-spacing:.04em;
    color:var(--ds-panel-ink,#101216);text-align:center;}
  `;
  document.head.appendChild(s);
}

SlideCollage.META = {
  id: 'collage', title: '拼贴影像',
  defaults: { imageCount: 5, tilt: true, showCaptions: true, showIndex: true },
  controls: [
    { key: 'imageCount', type: 'slider', label: '图片数量', default: 5, min: 3, max: 6, step: 1,
      description: '拼贴中的照片框数量；各框按上传图片真实比例自适应宽度。' },
    { key: 'tilt', type: 'toggle', label: '错落倾斜', default: true,
      description: '为每张照片施加轻微旋转的拼贴感。' },
    { key: 'showCaptions', type: 'toggle', label: '照片说明', default: true,
      description: '每张照片下方的等宽说明文字。' },
    { key: 'showIndex', type: 'toggle', label: '角标编号', default: true,
      description: '每张照片左上角的圆形编号。' },
  ],
};

export { SlideCollage };
export const META = SlideCollage.META;
export default SlideCollage;
