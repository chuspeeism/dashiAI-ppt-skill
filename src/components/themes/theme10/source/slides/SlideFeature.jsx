// SlideFeature.jsx — 图文 / image + headline + body, optional half-split panel.
// Standalone & migratable: depends only on React (imported) + DeckImageSlot.
// Image slot persistence id derives from `idPrefix`. CSS scoped under `.ft-`.
//
// ── Props (canonical list in SlideFeature.META.controls) ──────────────────────
//   split        boolean        half-image / half light text panel        (true)
//   imageSide    'left'|'right'  which side the image sits                 ('right')
//   showStats    boolean         the small stat row under the body         (true)
//   showCaption  boolean         caption under the image (non-split only)  (false)
//
// Content props (authored at call-site): idPrefix, overline, title, body, stats, caption

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideFeature({
  idPrefix = 'feature',
  overline = '产品理念', title = '一个会自己思考的组合',
  body = '自主指数不是一只基金，而是一套持续运行的系统。它读懂你的目标，在市场的每一次呼吸里，悄悄把组合调回最优。',
  stats = [{ value: '7×24', label: '不间断监控' }, { value: '<1ms', label: '信号到执行' }],
  imageSide = 'right', showStats = true, showCaption = false, caption = '产品界面示意', split = true,
}) {
  React.useEffect(() => { ftInjectStyle(); }, []);
  const img = (
    <div className="ft-media">
      {DeckImageSlot && <DeckImageSlot id={`${idPrefix}-img`} fit="cover" radius={split ? 0 : 22} placeholder="IMAGE" />}
      {showCaption && !split && <span className="ft-cap">{caption}</span>}
    </div>
  );
  const text = (
    <div className={`ft-text ${split ? 'tone-light' : ''}`}>
      <div className="ft-overline">{overline}</div>
      <h2 className="ft-title">{title}</h2>
      <p className="ft-body">{body}</p>
      {showStats && (
        <div className="ft-stats">
          {stats.map((s, i) => (
            <div className="ft-stat" key={i}><span className="ft-sv">{s.value}</span><span className="ft-sl">{s.label}</span></div>
          ))}
        </div>
      )}
    </div>
  );
  return (
    <div className={`ft-root ${split ? 'is-split' : ''}`}>
      {imageSide === 'left' ? <>{img}{text}</> : <>{text}{img}</>}
    </div>
  );
}
function ftInjectStyle() {
  if (document.getElementById('ft-style')) return;
  const s = document.createElement('style'); s.id = 'ft-style';
  s.textContent = `
  .ft-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;gap:88px;align-items:center;font-family:var(--font-sans);}
  .ft-media{flex:0 0 46%;align-self:stretch;display:flex;flex-direction:column;gap:18px;margin:0;}
  .ft-media .dslot{flex:1;}
  .ft-cap{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.4));}
  .ft-text{flex:1;}
  .ft-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ft-title{font-size:72px;font-weight:300;line-height:1.1;margin:20px 0 32px;}
  .ft-body{font-size:30px;line-height:1.6;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.64));margin:0;max-width:760px;text-wrap:pretty;}
  .ft-stats{display:flex;gap:64px;margin-top:56px;}
  .ft-stat{display:flex;flex-direction:column;gap:10px;}
  .ft-sv{font-size:56px;font-weight:300;font-variant-numeric:tabular-nums;}
  .ft-sl{font-family:var(--font-mono);font-size:24px;letter-spacing:.07em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ft-root.is-split{padding:0;gap:0;}
  .ft-root.is-split .ft-media{flex:0 0 50%;align-self:stretch;gap:0;}
  .ft-root.is-split .ft-media .dslot{flex:1;border-radius:0;}
  .ft-root.is-split .ft-text{flex:1;align-self:stretch;background:var(--ds-bg);color:var(--ds-ink);
    padding:0 96px;display:flex;flex-direction:column;justify-content:center;}
  `;
  document.head.appendChild(s);
}
SlideFeature.META = {
  id: 'feature', title: '图文',
  defaults: { imageSide: 'right', showStats: true, showCaption: false, split: true },
  controls: [
    { key: 'split', type: 'toggle', label: '半屏分色', default: true, description: '开启后一半图片、一半浅色文字面板（半黑半白）。' },
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'right',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }], description: '图片在左还是在右。' },
    { key: 'showStats', type: 'toggle', label: '数据点', default: true, description: '正文下方的小型数据。' },
    { key: 'showCaption', type: 'toggle', label: '图注', default: false, description: '图片下方的说明文字（非分色时显示）。' },
  ],
};

export { SlideFeature };
export const META = SlideFeature.META;
export default SlideFeature;
