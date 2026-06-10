// Slide04Gallery.jsx — image showcase slide.
// Standalone & migratable: depends on React + DeckImageSlot (both global).
// Image slots persist their own uploads and report aspect ratios; the layout
// adapts to count + ratio. CSS scoped under `.gl-`.
//
// ── Props (canonical list in Slide04Gallery.META.controls) ─────────────────────
//   imageCount   number 0..6                  how many image slots             (3)
//   layout       'justified'|'grid'|'feature' composition strategy            ('justified')
//   showCaption  boolean                       show the kicker caption line     (true)
//
// Layout geometry is computed in the deck's fixed 1920×1080 canvas coordinates,
// so it is deterministic regardless of on-screen scaling.

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

const GL_DEFAULT_RATIOS = [1.5, 0.78, 1.34, 1.0, 1.62, 0.82];
const GL_GAP = 22;

function Slide04Gallery({ idPrefix = 'gallery', imageCount = 3, layout = 'justified', showCaption = true }) {
  React.useEffect(() => { glInjectStyle(); }, []);
  const n = Math.max(0, Math.min(6, imageCount));

  // Per-slot aspect ratio; defaults give a pleasing empty composition, then
  // each slot overwrites its own entry once a user drops a real image.
  const [ratios, setRatios] = React.useState(GL_DEFAULT_RATIOS);
  const setRatio = React.useCallback((i, r) => {
    setRatios((prev) => { const next = prev.slice(); next[i] = r; return next; });
  }, []);

  const PAD_X = 120, PAD_Y = 96;
  const headH = showCaption ? 250 : 196;
  const Wc = 1920 - PAD_X * 2;                 // 1680
  const Hc = 1080 - PAD_Y * 2 - headH - 36;    // gallery stage height

  const items = Array.from({ length: n }, (_, i) => ({ id: i, r: ratios[i] || 1 }));

  return (
    <div className="gl-root">
      <div className="gl-head">
        <div className="gl-overline">影像档案 · FIELD NOTES</div>
        <h2 className="gl-title">组合背后的真实场景</h2>
        {showCaption && <p className="gl-caption">拖入你自己的图片 · 槽位将自动适配其比例与数量</p>}
      </div>

      <div className="gl-stage" style={{ height: Hc }}>
        {n === 0 ? (
          <div className="gl-empty">图片数量：0　·　当前为纯文字版式</div>
        ) : layout === 'grid' ? (
          <GlGrid items={items} n={n} Wc={Wc} Hc={Hc} setRatio={setRatio} pfx={idPrefix} />
        ) : layout === 'feature' ? (
          <GlFeature items={items} n={n} Wc={Wc} Hc={Hc} setRatio={setRatio} pfx={idPrefix} />
        ) : (
          <GlJustified items={items} n={n} Wc={Wc} Hc={Hc} setRatio={setRatio} pfx={idPrefix} />
        )}
      </div>
    </div>
  );
}

// ── justified rows: keep every image's true ratio, fill width per row ──────────
function GlJustified({ items, n, Wc, Hc, setRatio, pfx }) {
  const layout = React.useMemo(() => {
    if (n === 1) {
      const r = items[0].r;
      let h = Hc, w = h * r;
      if (w > Wc) { w = Wc; h = w / r; }
      return [{ h, row: [{ ...items[0], w }] }];
    }
    const target = 360;
    const rows = [];
    let cur = [], sumR = 0;
    items.forEach((it) => {
      cur.push(it); sumR += it.r;
      const needed = sumR * target + GL_GAP * (cur.length - 1);
      if (needed >= Wc) {
        const h = (Wc - GL_GAP * (cur.length - 1)) / sumR;
        rows.push({ h, row: cur.map((c) => ({ ...c, w: h * c.r })) });
        cur = []; sumR = 0;
      }
    });
    if (cur.length) {
      let h = cur.length > 1 ? (Wc - GL_GAP * (cur.length - 1)) / sumR : target;
      h = Math.min(h, target * 1.4);
      rows.push({ h, row: cur.map((c) => ({ ...c, w: h * c.r })) });
    }
    // Shrink to fit the stage height if needed; never scale up (that would push
    // a width-justified row past the available width).
    const totalH = rows.reduce((a, r) => a + r.h, 0) + GL_GAP * (rows.length - 1);
    const scale = Math.min(1, Hc / totalH);
    return rows.map((r) => ({ h: r.h * scale, row: r.row.map((c) => ({ ...c, w: c.w * scale })) }));
  }, [items, n, Wc, Hc]);

  return (
    <div className="gl-just">
      {layout.map((rw, ri) => (
        <div className="gl-just-row" key={ri} style={{ height: rw.h, gap: GL_GAP }}>
          {rw.row.map((c) => (
            <div className="gl-frame" key={c.id} style={{ width: c.w, height: rw.h }}>
              <DeckImageSlot id={`${pfx}-g${c.id}`} fit="cover" radius={16}
                             placeholder={`0${c.id + 1}`} onAspect={(r) => setRatio(c.id, r)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── uniform grid: crop to a tidy matrix ───────────────────────────────────────
function GlGrid({ items, n, Wc, Hc, setRatio, pfx }) {
  const cols = n <= 1 ? 1 : n <= 3 ? n : n === 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  const cellW = (Wc - GL_GAP * (cols - 1)) / cols;
  const cellH = (Hc - GL_GAP * (rows - 1)) / rows;
  return (
    <div className="gl-grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
      gridAutoRows: `${cellH}px`, gap: GL_GAP }}>
      {items.map((c) => (
        <div className="gl-frame" key={c.id}>
          <DeckImageSlot id={`${pfx}-g${c.id}`} fit="cover" radius={16}
                         placeholder={`0${c.id + 1}`} onAspect={(r) => setRatio(c.id, r)} />
        </div>
      ))}
    </div>
  );
}

// ── feature: one hero + a stacked column of the rest ───────────────────────────
function GlFeature({ items, n, Wc, Hc, setRatio, pfx }) {
  if (n === 1) {
    return (
      <div className="gl-frame" style={{ width: Wc, height: Hc }}>
        <DeckImageSlot id={`${pfx}-g0`} fit="cover" radius={18} placeholder="01"
                       onAspect={(r) => setRatio(0, r)} />
      </div>
    );
  }
  const heroW = Math.round(Wc * 0.62);
  const colW = Wc - heroW - GL_GAP;
  const rest = items.slice(1);
  const colItemH = (Hc - GL_GAP * (rest.length - 1)) / rest.length;
  return (
    <div className="gl-feature" style={{ gap: GL_GAP, height: Hc }}>
      <div className="gl-frame" style={{ width: heroW, height: Hc }}>
        <DeckImageSlot id={`${pfx}-g0`} fit="cover" radius={18} placeholder="01"
                       onAspect={(r) => setRatio(0, r)} />
      </div>
      <div className="gl-feature-col" style={{ width: colW, gap: GL_GAP }}>
        {rest.map((c) => (
          <div className="gl-frame" key={c.id} style={{ width: colW, height: colItemH }}>
            <DeckImageSlot id={`${pfx}-g${c.id}`} fit="cover" radius={16}
                           placeholder={`0${c.id + 1}`} onAspect={(r) => setRatio(c.id, r)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function glInjectStyle() {
  if (document.getElementById('gl-style')) return;
  const s = document.createElement('style');
  s.id = 'gl-style';
  s.textContent = `
  .gl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);
    color:var(--ds-ink,#f2f3f6);padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;font-family:var(--font-sans);}
  .gl-head{margin-bottom:36px;}
  .gl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;
    color:var(--ds-faint,rgba(242,243,246,.42));}
  .gl-title{font-size:68px;font-weight:300;margin:18px 0 0;line-height:1.05;}
  .gl-caption{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;
    color:var(--ds-muted,rgba(242,243,246,.55));margin:20px 0 0;}
  .gl-stage{position:relative;width:100%;}
  .gl-empty{height:100%;display:flex;align-items:center;justify-content:center;
    font-family:var(--font-mono);font-size:30px;letter-spacing:.12em;
    color:var(--ds-faint,rgba(242,243,246,.34));
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.12));border-radius:18px;}
  .gl-just{display:flex;flex-direction:column;gap:${GL_GAP}px;}
  .gl-just-row{display:flex;}
  .gl-grid{display:grid;justify-content:start;}
  .gl-feature{display:flex;}
  .gl-feature-col{display:flex;flex-direction:column;}
  .gl-frame{position:relative;overflow:hidden;border-radius:16px;}
  `;
  document.head.appendChild(s);
}

Slide04Gallery.META = {
  id: 'gallery',
  title: '图文展示',
  defaults: { imageCount: 3, layout: 'justified', showCaption: true },
  controls: [
    { key: 'imageCount', type: 'slider', label: '图片数量', default: 3, min: 0, max: 6, step: 1,
      description: '图片槽位的数量（0 即纯文字版式）；每个槽位自适应所传图片的比例。' },
    { key: 'layout', type: 'select', label: '构图方式', default: 'justified',
      options: [
        { value: 'justified', label: '等高排版（保留原比例）' },
        { value: 'grid', label: '网格（统一裁切）' },
        { value: 'feature', label: '主次（大图 + 缩略列）' },
      ],
      description: '多图的排布策略，适配不同数量与比例。' },
    { key: 'showCaption', type: 'toggle', label: '装饰说明', default: true,
      description: '标题下方的辅助说明文案。' },
  ],
};

export { Slide04Gallery };
export const META = Slide04Gallery.META;
export default Slide04Gallery;
