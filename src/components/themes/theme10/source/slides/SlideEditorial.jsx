// SlideEditorial.jsx — editorial / magazine image spread.
// The image-forward layout: a typographic text column (overline, title, lead,
// numbered "plate" index) beside an adaptive image cluster that honours each
// uploaded image's true aspect ratio and stays tidy at any count (0..4).
// Standalone & migratable: depends only on React (imported) + DeckImageSlot.
// Geometry is computed in the fixed 1920×1080 canvas, so it is deterministic
// regardless of on-screen scaling. CSS scoped under `.ed-`.
//
// ── Props (canonical list in SlideEditorial.META.controls) ────────────────────
//   imageCount   number 0..4         how many image slots (0 = pure text)   (3)
//   imageSide    'right'|'left'      which side the image cluster sits      ('right')
//   showPlates   boolean            the numbered plate index list           (true)
//   showLead     boolean            the lead paragraph                      (true)
//
// Content props (authored at call-site):
//   overline, title, lead, plates: [string]  (caption per image, by index)

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

const ED_DEFAULT_RATIOS = [0.82, 1.4, 1.0, 1.5];
const ED_GAP = 20;

function SlideEditorial({
  idPrefix = 'editorial',
  overline = '影像随笔 · FIELD ESSAY',
  title = '组合背后，\n是真实的生活',
  lead = '每一条回报曲线的尽头，都站着一个具体的人、一段想要守护的日子。我们把抽象的数字，重新放回它本来的位置。',
  plates = ['清晨的城市', '案头与笔记', '远行的路上', '归处的灯'],
  imageCount = 3, imageSide = 'right', showPlates = true, showLead = true,
}) {
  React.useEffect(() => { edInjectStyle(); }, []);
  const n = Math.max(0, Math.min(4, imageCount));
  const [ratios, setRatios] = React.useState(ED_DEFAULT_RATIOS);
  const setRatio = React.useCallback((i, r) => {
    setRatios((prev) => { const next = prev.slice(); next[i] = r; return next; });
  }, []);

  const PAD_X = 120, PAD_Y = 96;
  const innerW = 1920 - PAD_X * 2;      // 1680
  const innerH = 1080 - PAD_Y * 2;      // 888
  const textW = n === 0 ? innerW : 600;
  const imgW = n === 0 ? 0 : innerW - textW - 80;

  const items = Array.from({ length: n }, (_, i) => ({ id: i, r: ratios[i] || 1 }));
  const rows = React.useMemo(() => packJustified(items, imgW, innerH), [items, imgW, innerH]);

  const textCol = (
    <div className="ed-text" style={{ width: textW }}>
      <div className="ed-overline">{overline}</div>
      <h2 className="ed-title">{title}</h2>
      {showLead && <p className="ed-lead">{lead}</p>}
      {showPlates && n > 0 && (
        <ul className="ed-plates">
          {items.map((it) => (
            <li className="ed-plate" key={it.id}>
              <span className="ed-plate-no">{String(it.id + 1).padStart(2, '0')}</span>
              <span className="ed-plate-cap">{plates[it.id] || `图版 ${it.id + 1}`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const imgCol = n > 0 ? (
    <div className="ed-cluster" style={{ width: imgW, height: innerH }}>
      {rows.map((rw, ri) => (
        <div className="ed-cluster-row" key={ri} style={{ height: rw.h, gap: ED_GAP }}>
          {rw.row.map((c) => (
            <div className="ed-frame" key={c.id} style={{ width: c.w, height: rw.h }}>
              <DeckImageSlot id={`${idPrefix}-p${c.id}`} fit="cover" radius={14}
                             placeholder={`0${c.id + 1}`} onAspect={(r) => setRatio(c.id, r)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className={`ed-root ${imageSide === 'left' ? 'is-left' : ''}`}>
      {imageSide === 'left' && n > 0 ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
    </div>
  );
}

// Justified packer: keep each image's true ratio; fill width per row; scale to fit height.
function packJustified(items, W, H) {
  const n = items.length;
  if (!n || W <= 0) return [];
  if (n === 1) {
    const r = items[0].r;
    let h = H, w = h * r;
    if (w > W) { w = W; h = w / r; }
    return [{ h, row: [{ ...items[0], w }] }];
  }
  const target = n <= 2 ? H * 0.52 : H * 0.46;
  const rows = [];
  let cur = [], sumR = 0;
  items.forEach((it) => {
    cur.push(it); sumR += it.r;
    const needed = sumR * target + ED_GAP * (cur.length - 1);
    if (needed >= W) {
      const h = (W - ED_GAP * (cur.length - 1)) / sumR;
      rows.push({ h, row: cur.map((c) => ({ ...c, w: h * c.r })) });
      cur = []; sumR = 0;
    }
  });
  if (cur.length) {
    let h = cur.length > 1 ? (W - ED_GAP * (cur.length - 1)) / sumR : target;
    h = Math.min(h, target * 1.4);
    rows.push({ h, row: cur.map((c) => ({ ...c, w: h * c.r })) });
  }
  const totalH = rows.reduce((a, r) => a + r.h, 0) + ED_GAP * (rows.length - 1);
  const scale = Math.min(1, H / totalH);
  return rows.map((r) => ({ h: r.h * scale, row: r.row.map((c) => ({ ...c, w: c.w * scale })) }));
}

function edInjectStyle() {
  if (document.getElementById('ed-style')) return;
  const s = document.createElement('style'); s.id = 'ed-style';
  s.textContent = `
  .ed-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;gap:80px;align-items:stretch;font-family:var(--font-sans);}
  .ed-text{flex:0 0 auto;display:flex;flex-direction:column;justify-content:center;min-width:0;}
  .ed-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.18em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ed-title{font-size:78px;font-weight:300;line-height:1.12;margin:26px 0 0;letter-spacing:.01em;white-space:pre-line;}
  .ed-root.is-left .ed-title,.ed-root:not(.is-left) .ed-title{}
  .ed-lead{font-size:30px;line-height:1.6;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.64));
    margin:40px 0 0;max-width:560px;text-wrap:pretty;}
  .ed-plates{list-style:none;margin:52px 0 0;padding:0;display:flex;flex-direction:column;}
  .ed-plate{display:flex;align-items:baseline;gap:24px;padding:18px 0;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .ed-plate:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.13));}
  .ed-plate-no{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-accent,#6f9bd8);min-width:40px;}
  .ed-plate-cap{font-size:28px;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.7));}
  .ed-cluster{flex:0 0 auto;display:flex;flex-direction:column;gap:${ED_GAP}px;justify-content:center;}
  .ed-cluster-row{display:flex;}
  .ed-frame{position:relative;overflow:hidden;border-radius:14px;}
  /* When pure-text (no images) the title can breathe larger. */
  .ed-root:has(.ed-text:only-child) .ed-title{font-size:104px;}
  `;
  document.head.appendChild(s);
}

SlideEditorial.META = {
  id: 'editorial', title: '编排图文',
  defaults: { imageCount: 3, imageSide: 'right', showPlates: true, showLead: true },
  controls: [
    { key: 'imageCount', type: 'slider', label: '图片数量', default: 3, min: 0, max: 4, step: 1,
      description: '右侧图片槽位数量（0 即纯文字编排版式）；每个槽位自适应所传图片的比例并自动排布。' },
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'right',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '图片组在版面左侧还是右侧。' },
    { key: 'showPlates', type: 'toggle', label: '编号索引', default: true,
      description: '文字列下方的图版编号清单（数量随图片数联动）。' },
    { key: 'showLead', type: 'toggle', label: '引导段落', default: true,
      description: '标题下方的引导性说明段落。' },
  ],
};

export { SlideEditorial };
export const META = SlideEditorial.META;
export default SlideEditorial;
