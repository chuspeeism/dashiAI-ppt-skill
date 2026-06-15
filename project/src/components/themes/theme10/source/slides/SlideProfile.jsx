// SlideProfile.jsx — 人物特写 / cinematic full-bleed portrait.
// The portrait fills the entire frame; a directional scrim anchors a text block
// to one side carrying the overline, a large pull-quote, a name/role lockup and
// a horizontal credentials strip. Replaces the old beside-the-image split — the
// type now lives ON the image. Overlay type stays light at every page tone.
// Standalone & migratable: depends on React + DeckImageSlot (both global).
// Token-driven (frame only). CSS scoped under `.pf-`.
//
// ── Props (canonical list in SlideProfile.META.controls) ──────────────────────
//   textSide    'left'|'right'   which side the text block anchors to    ('left')
//   showQuote   boolean          the large pull-quote                     (true)
//   showCreds   boolean          the credentials strip                    (true)
//
// Content props (authored at call-site):
//   overline, name, role, quote, creds:[string]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';
import UnicornBackground, { UNICORN_BACKGROUND_CONTROL, createUnicornSceneControl } from '../../../unicorn-background.jsx';

function SlideProfile({
  idPrefix = 'profile',
  overline = '团队 · WHO RUNS IT',
  name = '林彦', role = '首席投资官 · Chief Investment Officer',
  quote = '我不预测市场，我只确保无论市场怎样，纪律都在执行。',
  creds = ['前量化对冲基金合伙人', 'CFA · 15 年跨周期实盘', '主导自主再平衡引擎设计'],
  textSide = 'left', showQuote = true, showCreds = true,
  backgroundMode = 'unicorn', unicornScene = 'automations',
}) {
  React.useEffect(() => { pfInjectStyle(); }, []);
  const useUnicorn = backgroundMode === 'unicorn';
  return (
    <div className={`pf-root pf-${textSide}`}>
      <div className="pf-media">
        {useUnicorn
          ? <UnicornBackground scene={unicornScene} accent="var(--ds-accent,#6f9bd8)" />
          : <DeckImageSlot id={`${idPrefix}-portrait`} fit="cover" radius={0} placeholder="PORTRAIT" />}
      </div>
      <div className="pf-scrim" />
      <div className="pf-overlay">
        <div className="pf-overline">{overline}</div>
        <div className="pf-spacer" />
        {showQuote && <blockquote className="pf-quote">{quote}</blockquote>}
        <div className="pf-id">
          <span className="pf-name">{name}</span>
          <span className="pf-role">{role}</span>
        </div>
        {showCreds && (
          <ul className="pf-creds">
            {creds.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

function pfInjectStyle() {
  if (document.getElementById('pf-style')) return;
  const s = document.createElement('style'); s.id = 'pf-style';
  s.textContent = `
  .pf-root{position:relative;width:100%;height:100%;overflow:hidden;background:var(--ds-bg,#0d0e11);
    color:#f4f4f2;font-family:var(--font-sans);}
  .pf-media{position:absolute;inset:0;}
  .pf-media .dslot{border-radius:0;}
  .pf-scrim{position:absolute;inset:0;pointer-events:none;}
  .pf-left .pf-scrim{background:
    linear-gradient(90deg,rgba(7,8,11,.9) 0%,rgba(7,8,11,.66) 34%,rgba(7,8,11,.12) 64%,rgba(7,8,11,0) 82%),
    linear-gradient(0deg,rgba(7,8,11,.5) 0%,rgba(7,8,11,0) 32%);}
  .pf-right .pf-scrim{background:
    linear-gradient(270deg,rgba(7,8,11,.9) 0%,rgba(7,8,11,.66) 34%,rgba(7,8,11,.12) 64%,rgba(7,8,11,0) 82%),
    linear-gradient(0deg,rgba(7,8,11,.5) 0%,rgba(7,8,11,0) 32%);}
  /* pointer-events:none so the full-bleed image slot beneath stays clickable
     (overlay is pure text + scrim, nothing interactive lives here). */
  .pf-overlay{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;
    padding:var(--pad-y,96px) var(--pad-x,120px);pointer-events:none;}
  .pf-right .pf-overlay{align-items:flex-end;text-align:right;}
  .pf-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:rgba(244,244,242,.78);}
  .pf-spacer{flex:1;}
  .pf-quote{font-size:60px;line-height:1.28;font-weight:300;margin:0 0 44px;max-width:980px;
    letter-spacing:.01em;text-wrap:pretty;}
  .pf-id{display:flex;flex-direction:column;gap:10px;}
  .pf-name{font-size:48px;font-weight:300;}
  .pf-role{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:rgba(244,244,242,.74);}
  .pf-creds{list-style:none;margin:36px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:18px 40px;max-width:1040px;}
  .pf-right .pf-creds{justify-content:flex-end;}
  .pf-creds li{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:rgba(244,244,242,.82);
    padding-left:26px;position:relative;}
  .pf-creds li::before{content:"—";position:absolute;left:0;color:var(--ds-accent,#6f9bd8);}
  .pf-right .pf-creds li{padding-left:0;padding-right:26px;}
  .pf-right .pf-creds li::before{left:auto;right:0;}
  `;
  document.head.appendChild(s);
}

SlideProfile.META = {
  id: 'profile', title: '人物特写',
  defaults: { textSide: 'left', showQuote: true, showCreds: true, backgroundMode: 'unicorn', unicornScene: 'automations' },
  controls: [
    UNICORN_BACKGROUND_CONTROL,
    createUnicornSceneControl('automations'),
    { key: 'textSide', type: 'radio', label: '文字位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '叠加文字块与暗角渐变所锚定的一侧（满幅肖像作背景）。' },
    { key: 'showQuote', type: 'toggle', label: '人物金句', default: true,
      description: '叠加在肖像上的大号引述。' },
    { key: 'showCreds', type: 'toggle', label: '履历清单', default: true,
      description: '姓名下方的横排履历 / 资历条。' },
  ],
};

export { SlideProfile };
export const META = SlideProfile.META;
export default SlideProfile;
