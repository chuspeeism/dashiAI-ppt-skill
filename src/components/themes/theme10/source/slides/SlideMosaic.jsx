// SlideMosaic.jsx — 图文马赛克 / editorial image mosaic with a caption rail.
// A deterministic 6×2 image grid whose composition is curated per tile count
// (0–6) so it stays balanced at every count and any image ratio; a single image
// adapts to its uploaded aspect. Distinct from SlideGallery / SlideFeature: this
// is a multi-tile mosaic paired with a vertical caption rail. Standalone &
// migratable: depends only on React (imported) + DeckImageSlot. Image slot
// ids derive from `idPrefix` (`${idPrefix}-N`). CSS scoped under `.mos-`.
//
// ── Props (canonical list in SlideMosaic.META.controls) ───────────────────────
//   tileCount    number 0..6   how many image tiles                         (4)
//   railSide     'left'|'right' which side the caption rail sits            ('left')
//   showIndex    boolean       the mono running index on each caption       (true)
//   gap          number 8..32  gutter between tiles (px)                    (16)
//
// Content props (authored at call-site):
//   idPrefix, overline, title, body, captions:[...]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideMosaic({
  idPrefix = 'mosaic',
  overline = '影像档案 · FIELD NOTES', title = '把回报，放回真实的生活',
  body = '数字之外，是一个个具体的人和场景。把属于你的照片拖进来，让这份报告有温度。',
  captions = ['清晨的港口', '工作室一角', '第一笔分红', '家庭旅行', '退休的海岸', '传承的礼物'],
  tileCount = 4, railSide = 'left', showIndex = true, gap = 16,
}) {
  React.useEffect(() => { mosInjectStyle(); }, []);
  const n = Math.max(0, Math.min(6, tileCount));
  const [aspect, setAspect] = React.useState(0);

  // Curated layouts on a 6-col × 2-row grid: [colStart,colEnd,rowStart,rowEnd].
  const LAYOUTS = {
    1: [[1, 7, 1, 3]],
    2: [[1, 4, 1, 3], [4, 7, 1, 3]],
    3: [[1, 4, 1, 3], [4, 7, 1, 2], [4, 7, 2, 3]],
    4: [[1, 4, 1, 2], [4, 7, 1, 2], [1, 4, 2, 3], [4, 7, 2, 3]],
    5: [[1, 3, 1, 2], [3, 5, 1, 2], [5, 7, 1, 2], [1, 4, 2, 3], [4, 7, 2, 3]],
    6: [[1, 3, 1, 2], [3, 5, 1, 2], [5, 7, 1, 2], [1, 3, 2, 3], [3, 5, 2, 3], [5, 7, 2, 3]],
  };
  const layout = LAYOUTS[n] || [];

  const rail = (
    <div className="mos-rail">
      <div className="mos-overline">{overline}</div>
      <h2 className="mos-title">{title}</h2>
      <p className="mos-body">{body}</p>
      {n > 0 && (
        <ul className="mos-caplist">
          {Array.from({ length: n }).map((_, i) => (
            <li className="mos-capitem" key={i}>
              {showIndex && <span className="mos-capidx">{String(i + 1).padStart(2, '0')}</span>}
              <span className="mos-captext">{captions[i] || `图 ${i + 1}`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const grid = n === 0 ? null : n === 1 ? (
    <div className="mos-solo">
      <div className="mos-soloframe" style={aspect ? { aspectRatio: String(aspect) } : { width: '100%', height: '100%' }}>
        {DeckImageSlot && <DeckImageSlot id={`${idPrefix}-0`} fit="cover" radius={4} placeholder="IMAGE"
          onAspect={(r) => setAspect(r)} />}
      </div>
    </div>
  ) : (
    <div className="mos-grid" style={{ gap }}>
      {layout.map((pos, i) => (
        <div className="mos-cell" key={i}
             style={{ gridColumn: `${pos[0]} / ${pos[1]}`, gridRow: `${pos[2]} / ${pos[3]}` }}>
          {DeckImageSlot && <DeckImageSlot id={`${idPrefix}-${i}`} fit="cover" radius={4}
            placeholder="IMAGE" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`mos-root ${railSide === 'right' ? 'rail-right' : 'rail-left'} ${n === 0 ? 'is-empty' : ''}`}>
      {railSide === 'right' ? <>{grid}{rail}</> : <>{rail}{grid}</>}
    </div>
  );
}

function mosInjectStyle() {
  if (document.getElementById('mos-style')) return;
  const s = document.createElement('style'); s.id = 'mos-style';
  s.textContent = `
  .mos-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:grid;grid-template-columns:430px 1fr;gap:72px;
    align-items:stretch;font-family:var(--font-sans);}
  .mos-root.rail-right{grid-template-columns:1fr 430px;}
  .mos-root.is-empty{grid-template-columns:1fr;}
  .mos-rail{display:flex;flex-direction:column;min-height:0;justify-content:center;}
  .mos-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .mos-title{font-size:58px;font-weight:300;line-height:1.1;margin:18px 0 0;text-wrap:balance;}
  .mos-body{font-size:27px;line-height:1.6;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));margin:28px 0 0;
    max-width:430px;text-wrap:pretty;}
  .mos-caplist{list-style:none;margin:40px 0 0;padding:0;display:flex;flex-direction:column;}
  .mos-capitem{display:flex;align-items:baseline;gap:18px;padding:16px 0;border-top:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .mos-capitem:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.12));}
  .mos-capidx{font-family:var(--font-mono);font-size:22px;color:var(--ds-faint,rgba(242,243,246,.4));}
  .mos-captext{font-size:27px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.78));}
  .mos-grid{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,1fr);min-height:0;height:100%;}
  .mos-cell{position:relative;min-height:0;overflow:hidden;border-radius:4px;}
  .mos-cell .dslot{position:absolute;inset:0;}
  .mos-solo{height:100%;display:flex;align-items:center;justify-content:center;min-height:0;}
  .mos-soloframe{position:relative;max-width:100%;max-height:100%;}
  .mos-soloframe .dslot{position:absolute;inset:0;}
  `;
  document.head.appendChild(s);
}

SlideMosaic.META = {
  id: 'mosaic', title: '图文马赛克',
  defaults: { tileCount: 4, railSide: 'left', showIndex: true, gap: 16 },
  controls: [
    { key: 'tileCount', type: 'slider', label: '图片数量', default: 4, min: 0, max: 6, step: 1,
      description: '马赛克的图片块数量（0 为纯文字，版式按数量自动重排）。' },
    { key: 'railSide', type: 'radio', label: '文字栏位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '标题与图注栏在画面的哪一侧。' },
    { key: 'showIndex', type: 'toggle', label: '图注编号', default: true,
      description: '在每条图注前显示等宽编号。' },
    { key: 'gap', type: 'slider', label: '图片间距', default: 16, min: 8, max: 32, step: 4, unit: 'px',
      description: '马赛克图块之间的间隙。' },
  ],
};

export { SlideMosaic };
export const META = SlideMosaic.META;
export default SlideMosaic;
