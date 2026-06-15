// SlideShowcase.jsx — 沉浸大图 / a full-bleed hero image with a data ticker.
// One image fills the frame; a gradient scrim anchors a corner title block, and
// a row of index readouts runs along the bottom edge like a live ticker — photo
// dominant, data secondary. Distinct from SlidePoster (type-dominant over photo),
// SlideMagazine (overlapping panel) and Slide04Gallery (multi grid): this is the
// immersive single hero. Standalone & migratable: depends only on React +
// DeckImageSlot (both global). Token-driven. CSS scoped under `.shw-`.
//
// ── Props (canonical list in SlideShowcase.META.controls) ─────────────────────
//   textPos     'bottom-left'|'center'  title placement                   ('bottom-left')
//   scrim       number 30..85   darkening of the photo (%)                 (60)
//   showTicker  boolean         the bottom index readout strip             (true)
//   tickerCount number 2..4     how many ticker readouts                   (3)
//   showOverline boolean        the kicker above the title                 (true)
//
// Content props (authored at call-site):
//   idPrefix, overline, title, ticks:[{ value, label }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

function SlideShowcase({
  idPrefix = 'showcase',
  overline = '年度影像 · COVER', title = '让财富，安静地生长',
  ticks = [
    { value: '+182%', label: '十年累计回报' },
    { value: '0.62%', label: '综合年化成本' },
    { value: '14,200', label: '同行的投资者' },
    { value: '4.9 / 5', label: '客户满意度' },
  ],
  textPos = 'bottom-left', scrim = 60, showTicker = true, tickerCount = 3, showOverline = true,
  backgroundMode = 'unicorn', unicornScene = 'moving',
}) {
  React.useEffect(() => { shwInjectStyle(); }, []);
  const tc = Math.max(2, Math.min(ticks.length, tickerCount));
  const used = ticks.slice(0, tc);
  const sc = Math.max(0, Math.min(95, scrim)) / 100;
  const useUnicorn = backgroundMode === 'unicorn';

  return (
    <div className={`shw-root pos-${textPos === 'center' ? 'center' : 'bl'}`}>
      <div className="shw-img">
        {useUnicorn
          ? <UnicornBackground scene={unicornScene} accent="var(--ds-accent,#6f9bd8)" />
          : <DeckImageSlot id={`${idPrefix}-hero`} fit="cover" radius={0} placeholder="FULL-BLEED HERO" />}
      </div>
      <div className="shw-scrim" style={{ '--shw-sc': sc }} />

      <div className="shw-text">
        {showOverline && <div className="shw-overline">{overline}</div>}
        <h2 className="shw-title">{title}</h2>
      </div>

      {showTicker && (
        <div className="shw-ticker">
          {used.map((t, i) => (
            <div className="shw-tick" key={i}>
              <span className="shw-tick-val">{t.value}</span>
              <span className="shw-tick-lab">{t.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function shwInjectStyle() {
  if (document.getElementById('shw-style')) return;
  const s = document.createElement('style'); s.id = 'shw-style';
  s.textContent = `
  .shw-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:#f4f4f2;
    overflow:hidden;font-family:var(--font-sans);}
  .shw-img{position:absolute;inset:0;}
  .shw-scrim{position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(180deg, rgba(8,9,11,calc(var(--shw-sc)*.45)) 0%, rgba(8,9,11,calc(var(--shw-sc)*.12)) 38%, rgba(8,9,11,calc(var(--shw-sc)*.78)) 100%);}
  .shw-text{position:absolute;z-index:3;max-width:62%;}
  .shw-root.pos-bl .shw-text{left:var(--pad-x,120px);bottom:230px;}
  .shw-root.pos-center .shw-text{left:50%;top:46%;transform:translate(-50%,-50%);text-align:center;max-width:80%;}
  .shw-overline{font-family:var(--font-mono);font-size:27px;letter-spacing:.18em;color:rgba(244,244,242,.78);}
  .shw-title{font-size:96px;font-weight:300;margin:20px 0 0;line-height:1.0;letter-spacing:-.015em;text-wrap:balance;}
  .shw-ticker{position:absolute;left:0;right:0;bottom:0;z-index:3;display:flex;
    background:linear-gradient(180deg, rgba(8,9,11,0) 0%, rgba(8,9,11,.55) 100%);
    border-top:1px solid rgba(244,244,242,.16);
    padding:34px var(--pad-x,120px) 40px;gap:64px;backdrop-filter:blur(3px);}
  .shw-tick{display:flex;flex-direction:column;gap:8px;padding-right:64px;border-right:1px solid rgba(244,244,242,.16);}
  .shw-tick:last-child{border-right:0;}
  .shw-tick-val{font-size:54px;font-weight:300;font-variant-numeric:tabular-nums;line-height:1;letter-spacing:-.01em;}
  .shw-tick-lab{font-family:var(--font-mono);font-size:23px;letter-spacing:.05em;color:rgba(244,244,242,.7);}
  `;
  document.head.appendChild(s);
}

SlideShowcase.META = {
  id: 'showcase', title: '沉浸大图',
  defaults: { textPos: 'bottom-left', scrim: 60, showTicker: true, tickerCount: 3, showOverline: true, backgroundMode: 'unicorn', unicornScene: 'moving' },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('moving'),
    { key: 'textPos', type: 'radio', label: '文字位置', default: 'bottom-left',
      options: [{ value: 'bottom-left', label: '左下' }, { value: 'center', label: '居中' }],
      description: '标题块在画面中的位置。' },
    { key: 'scrim', type: 'slider', label: '压暗程度', default: 60, min: 30, max: 85, step: 5, unit: '%',
      description: '图片之上的渐变压暗强度，保证文字可读。' },
    { key: 'showTicker', type: 'toggle', label: '指标走马条', default: true,
      description: '底部一排关键指标读数条。' },
    { key: 'tickerCount', type: 'slider', label: '指标条数', default: 3, min: 2, max: 4, step: 1,
      description: '走马条中的指标数量。' },
    { key: 'showOverline', type: 'toggle', label: '栏目标签', default: true,
      description: '标题上方的等宽小标签。' },
  ],
};

export { SlideShowcase };
export const META = SlideShowcase.META;
export default SlideShowcase;
