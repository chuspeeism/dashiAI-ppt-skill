// SlideInset.jsx — 满版角嵌 / full-bleed hero with a floating lockup + inset.
// One image fills the frame; a frosted text lockup floats over it carrying the
// overline, headline and a short note, and an optional second image sits inset
// in the opposite corner (sized to its own aspect ratio, no crop). The scrim is
// directional so the type stays legible on any photo. Standalone & migratable:
// depends on React + DeckImageSlot (global). CSS scoped under `.ins-`.
//
// ── Props (canonical list in SlideInset.META.controls) ───────────────────────
//   textPos    radio    'bottom-left' | 'top-left' | 'bottom-right'   ('bottom-left')
//   scrim      number 30..80   scrim strength % over the hero          (58)
//   showInset  boolean   the small inset image in the far corner       (true)
//   showNote   boolean   the note line under the headline              (true)
//
// Content props (authored at call-site):
//   overline, title, note, insetCaption

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

function SlideInset({
  idPrefix = 'inset',
  overline = '现场 · ON LOCATION', title = '把纪律，建在看得见的地方',
  note = '从配置台到风控屏，每一次再平衡都留痕、可回溯、可复盘。',
  insetCaption = '配置控制台 · 实时',
  textPos = 'bottom-left', scrim = 58, showInset = true, showNote = true,
  backgroundMode = 'unicorn', unicornScene = 'goey',
}) {
  React.useEffect(() => { insInjectStyle(); }, []);
  const [ar, setAr] = React.useState(1.4);
  const sc = Math.max(0, Math.min(80, scrim)) / 100;
  const useUnicorn = backgroundMode === 'unicorn';

  return (
    <div className={`ins-root ins-${textPos}`}>
      <div className="ins-hero">
        <div className={`ins-upload-bg ${useUnicorn ? 'is-hidden' : ''}`}>
          <DeckImageSlot id={`${idPrefix}-hero`} fit="cover" radius={0} placeholder="HERO IMAGE" />
        </div>
        {useUnicorn && <UnicornBackground scene={unicornScene} accent="var(--ds-accent,#6f9bd8)" />}
      </div>
      <span className="ins-scrim" style={{
        '--s': sc,
        background: `linear-gradient(var(--scrim-dir), rgba(7,8,11,${sc}) 0%, rgba(7,8,11,${sc * 0.5}) 36%, rgba(7,8,11,0) 70%)`,
      }} />

      <div className="ins-lock">
        <div className="ins-overline">{overline}</div>
        <h2 className="ins-title">{title}</h2>
        {showNote && <p className="ins-note">{note}</p>}
      </div>

      {showInset && (
        <figure className="ins-inset" style={{ aspectRatio: String(ar) }}>
          <DeckImageSlot id={`${idPrefix}-inset`} fit="cover" radius={8}
                         placeholder="INSET" onAspect={(r) => setAr(r)} />
          <figcaption className="ins-cap">{insetCaption}</figcaption>
        </figure>
      )}
    </div>
  );
}

function insInjectStyle() {
  if (document.getElementById('ins-style')) return;
  const s = document.createElement('style'); s.id = 'ins-style';
  s.textContent = `
  .ins-root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--ds-bg,#0d0e11);
    color:#f4f4f2;font-family:var(--font-sans);}
  .ins-hero{position:absolute;inset:0;}
  .ins-upload-bg{position:absolute;inset:0;}
  .ins-upload-bg.is-hidden{opacity:0;pointer-events:none;}
  .ins-hero .dslot{border-radius:0;}
  .ins-scrim{position:absolute;inset:0;pointer-events:none;--scrim-dir:30deg;}
  .ins-bottom-left{--scrim-dir:30deg;} .ins-top-left{--scrim-dir:150deg;} .ins-bottom-right{--scrim-dir:-30deg;}
  .ins-lock{position:absolute;z-index:2;max-width:46%;padding:40px 46px;
    background:rgba(10,12,16,.34);backdrop-filter:blur(14px);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.14);border-radius:14px;}
  .ins-bottom-left .ins-lock{left:var(--pad-x,120px);bottom:var(--pad-y,96px);}
  .ins-top-left .ins-lock{left:var(--pad-x,120px);top:var(--pad-y,96px);}
  .ins-bottom-right .ins-lock{right:var(--pad-x,120px);bottom:var(--pad-y,96px);text-align:right;}
  .ins-overline{font-family:var(--font-mono);font-size:25px;letter-spacing:.16em;color:rgba(244,244,242,.8);}
  .ins-title{font-size:60px;font-weight:300;line-height:1.12;margin:18px 0 0;letter-spacing:.01em;text-wrap:pretty;}
  .ins-note{font-family:var(--font-mono);font-size:25px;line-height:1.5;letter-spacing:.02em;
    color:rgba(244,244,242,.78);margin:22px 0 0;}
  .ins-inset{position:absolute;z-index:2;margin:0;width:clamp(300px,22vw,420px);
    max-height:calc(100% - var(--pad-y,96px) * 2);
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.16);border-radius:10px;background:#0c0d10;overflow:hidden;}
  .ins-bottom-left .ins-inset{right:var(--pad-x,120px);top:var(--pad-y,96px);}
  .ins-top-left .ins-inset{right:var(--pad-x,120px);bottom:var(--pad-y,96px);}
  .ins-bottom-right .ins-inset{left:var(--pad-x,120px);top:var(--pad-y,96px);}
  .ins-inset .dslot{position:absolute;inset:0;}
  .ins-cap{position:absolute;left:0;right:0;bottom:0;z-index:1;font-family:var(--font-mono);font-size:21px;
    letter-spacing:.05em;color:#f4f4f2;padding:14px 16px;
    background:linear-gradient(0deg,rgba(7,8,11,.82),rgba(7,8,11,0));pointer-events:none;}
  `;
  document.head.appendChild(s);
}

SlideInset.META = {
  id: 'inset', title: '满版角嵌',
  defaults: { textPos: 'bottom-left', scrim: 58, showInset: true, showNote: true, backgroundMode: 'unicorn', unicornScene: 'goey' },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('goey'),
    { key: 'textPos', type: 'radio', label: '文字位置', default: 'bottom-left',
      options: [
        { value: 'bottom-left', label: '左下' },
        { value: 'top-left', label: '左上' },
        { value: 'bottom-right', label: '右下' },
      ], description: '浮动文字锁的所在角；嵌图自动落在对角。' },
    { key: 'scrim', type: 'slider', label: '蒙版强度', default: 58, min: 30, max: 80, step: 2, unit: '%',
      description: '主图上方方向性暗角的强度。' },
    { key: 'showInset', type: 'toggle', label: '角嵌图', default: true,
      description: '对角的小嵌图（随上传图片比例自适应）。' },
    { key: 'showNote', type: 'toggle', label: '说明文字', default: true,
      description: '标题下方的说明句。' },
  ],
};

export { SlideInset };
export const META = SlideInset.META;
export default SlideInset;
