// SlideTriptych.jsx — 三联影像 / overlaid-caption image panels.
// Equal vertical panels, each a full-bleed image slot with a bottom scrim
// carrying an index, a title and a caption laid OVER the image. Distinct from
// SlideFilmstrip (ratio-justified widths, captions below), Slide04Gallery
// (untitled uniform grid) and SlideTeam (portraits + captions beneath): this is
// a poster-like editorial triptych with text on the image. Standalone &
// migratable: depends only on React + DeckImageSlot (both global). Token-driven.
// CSS scoped under `.tri-`.
//
// ── Props (canonical list in SlideTriptych.META.controls) ─────────────────────
//   panelCount   number 2..4    how many image panels                      (3)
//   showOverline boolean        the deck overline above the panels         (true)
//   showIndex    boolean        the big index numeral on each panel         (true)
//   captionPos   'bottom'|'top' where the caption block sits               ('bottom')
//   radius       number 0..28   panel corner radius (px)                   (12)
//
// Content props (authored at call-site):
//   idPrefix, overline, panels:[{ title, caption }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideTriptych({
  idPrefix = 'triptych',
  overline = '三种生活 · WHAT IT BUYS',
  panels = [
    { title: '时间', caption: '把盯盘的精力，还给真正重要的人和事。' },
    { title: '从容', caption: '市场起落不再牵动情绪，纪律替你扛住波动。' },
    { title: '自由', caption: '当被动收入覆盖开支，选择权重新回到你手里。' },
    { title: '传承', caption: '规划好的财富，跨过一代又一代继续生长。' },
  ],
  panelCount = 3, showOverline = true, showIndex = true, captionPos = 'bottom', radius = 12,
}) {
  React.useEffect(() => { triInjectStyle(); }, []);
  const n = Math.max(2, Math.min(panels.length, panelCount));
  const used = panels.slice(0, n);

  return (
    <div className="tri-root">
      {showOverline && <div className="tri-overline">{overline}</div>}
      <div className="tri-grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {used.map((p, i) => (
          <div className="tri-panel" key={i} style={{ borderRadius: radius }}>
            <DeckImageSlot id={`${idPrefix}-${i}`} fit="cover" radius={radius}
                           placeholder={`IMAGE ${String(i + 1).padStart(2, '0')}`} />
            <div className={`tri-scrim ${captionPos === 'top' ? 'at-top' : 'at-bottom'}`} />
            <div className={`tri-cap ${captionPos === 'top' ? 'at-top' : 'at-bottom'}`}>
              {showIndex && <span className="tri-idx">{String(i + 1).padStart(2, '0')}</span>}
              <span className="tri-title">{p.title}</span>
              <span className="tri-caption">{p.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function triInjectStyle() {
  if (document.getElementById('tri-style')) return;
  const s = document.createElement('style'); s.id = 'tri-style';
  s.textContent = `
  .tri-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .tri-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));
    margin-bottom:30px;}
  .tri-grid{flex:1;min-height:0;display:grid;gap:24px;}
  .tri-panel{position:relative;min-height:0;overflow:hidden;}
  .tri-scrim{position:absolute;left:0;right:0;height:62%;pointer-events:none;}
  .tri-scrim.at-bottom{bottom:0;background:linear-gradient(0deg, rgba(7,9,12,.92) 0%, rgba(7,9,12,.55) 42%, transparent 100%);}
  .tri-scrim.at-top{top:0;background:linear-gradient(180deg, rgba(7,9,12,.92) 0%, rgba(7,9,12,.55) 42%, transparent 100%);}
  .tri-cap{position:absolute;left:0;right:0;padding:34px 34px;display:flex;flex-direction:column;gap:8px;}
  .tri-cap.at-bottom{bottom:0;}
  .tri-cap.at-top{top:0;}
  .tri-idx{font-family:var(--font-mono);font-size:30px;color:var(--ds-accent,#6f9bd8);letter-spacing:.04em;}
  .tri-title{font-size:46px;font-weight:300;line-height:1.04;color:#fff;}
  .tri-caption{font-size:25px;font-weight:300;line-height:1.45;color:rgba(255,255,255,.82);text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideTriptych.META = {
  id: 'triptych', title: '三联影像',
  defaults: { panelCount: 3, showOverline: true, showIndex: true, captionPos: 'bottom', radius: 12 },
  controls: [
    { key: 'panelCount', type: 'slider', label: '面板数量', default: 3, min: 2, max: 4, step: 1,
      description: '并排影像面板数量。各面板等宽，图片随上传比例自适应裁切填满。' },
    { key: 'showOverline', type: 'toggle', label: '顶部标签', default: true,
      description: '面板上方的栏目小标签。' },
    { key: 'showIndex', type: 'toggle', label: '序号', default: true,
      description: '每个面板上的 01/02… 序号。' },
    { key: 'captionPos', type: 'radio', label: '文字位置', default: 'bottom',
      options: [{ value: 'bottom', label: '底部' }, { value: 'top', label: '顶部' }],
      description: '叠在图片上的文字块位置。' },
    { key: 'radius', type: 'slider', label: '圆角', default: 12, min: 0, max: 28, step: 2, unit: 'px',
      description: '面板的圆角半径。' },
  ],
};

export { SlideTriptych };
export const META = SlideTriptych.META;
export default SlideTriptych;
