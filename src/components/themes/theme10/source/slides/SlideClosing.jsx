// SlideClosing.jsx — 结束 / closing thank-you with contacts and optional QR.
// Standalone & migratable: depends only on React (imported) + DECK_THEMES
// + DeckImageSlot (token fallbacks). CSS scoped under `.cl-`.
//
// ── Props (canonical list in SlideClosing.META.controls) ──────────────────────
//   theme       DECK_THEMES key   background mood                     ('dusk')
//   align       'left'|'center'    content alignment                   ('left')
//   showContact boolean            the contact list                    (true)
//   showQR      boolean            an uploadable QR image slot          (false)
//
// Content props (authored at call-site): idPrefix, title, kicker, contacts

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

const CL_GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

function SlideClosing({
  idPrefix = 'closing',
  title = '让财富，开始自主增长', kicker = 'THANK YOU',
  contacts = ['hello@autonomous.fund', 'autonomous.fund', '400-820-0000'],
  theme = 'dusk', align = 'left', showContact = true, showQR = false,
}) {
  React.useEffect(() => { clInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  return (
    <div className="cl-root" style={{ background: t.bg, color: t.fg, ['--cl-sub']: t.sub,
      alignItems: align === 'center' ? 'center' : 'flex-start', textAlign: align === 'center' ? 'center' : 'left' }}>
      <div className="cl-grain" />
      <div className="cl-kicker">{kicker}</div>
      <h2 className="cl-title">{title}</h2>
      <div className="cl-bottom" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        {showContact && (
          <ul className="cl-contacts">{contacts.map((c, i) => <li key={i}>{c}</li>)}</ul>
        )}
        {showQR && DeckImageSlot && <div className="cl-qr"><DeckImageSlot id={`${idPrefix}-qr`} fit="cover" radius={14} placeholder="QR" /></div>}
      </div>
    </div>
  );
}
function clInjectStyle() {
  if (document.getElementById('cl-style')) return;
  const s = document.createElement('style'); s.id = 'cl-style';
  s.textContent = `
  .cl-root{position:relative;width:100%;height:100%;overflow:hidden;padding:var(--pad-y,96px) var(--pad-x,120px);
    display:flex;flex-direction:column;justify-content:center;font-family:var(--font-sans);}
  .cl-grain{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;background-image:url("${CL_GRAIN}");}
  .cl-kicker{position:relative;z-index:1;font-family:var(--font-mono);font-size:28px;letter-spacing:.26em;color:var(--cl-sub);white-space:nowrap;}
  .cl-title{position:relative;z-index:1;font-size:104px;font-weight:300;line-height:1.08;margin:32px 0 0;max-width:1500px;}
  .cl-bottom{position:relative;z-index:1;display:flex;align-items:flex-end;gap:80px;margin-top:80px;width:100%;}
  .cl-contacts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:16px;
    font-family:var(--font-mono);font-size:28px;letter-spacing:.04em;color:var(--cl-sub);}
  .cl-qr{width:180px;height:180px;flex:0 0 auto;}
  `;
  document.head.appendChild(s);
}
SlideClosing.META = {
  id: 'closing', title: '结束',
  defaults: { theme: 'dusk', align: 'left', showContact: true, showQR: false },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dusk',
      options: [{ value: 'dusk', label: '暮光' }, { value: 'midnight', label: '午夜' }, { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' }, { value: 'paper', label: '纸白' }], description: '背景渐变。' },
    { key: 'align', type: 'radio', label: '对齐', default: 'left', options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }], description: '内容对齐。' },
    { key: 'showContact', type: 'toggle', label: '联系方式', default: true, description: '底部联系方式列表。' },
    { key: 'showQR', type: 'toggle', label: '二维码', default: false, description: '可上传二维码图片槽。' },
  ],
};

export { SlideClosing };
export const META = SlideClosing.META;
export default SlideClosing;
