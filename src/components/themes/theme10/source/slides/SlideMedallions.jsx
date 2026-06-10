// SlideMedallions.jsx — 影像勋章 / a row of circular image medallions on an arc.
// Round, aspect-tolerant image slots (any uploaded ratio is cover-cropped to a
// perfect circle) sit on a gentle crest, each captioned with a name + role — for
// featured holdings, partners or people. Distinct from SlideTeam (a flat square
// grid) and SlideMedia galleries (rectangular framed shots). Count is adjustable
// 0–6 and the medallion size grows as the count drops, so every count stays
// composed. Standalone & migratable: depends only on React + DeckImageSlot
// (globals). Token-driven, light/dark tone applies. CSS scoped `.mdl-`.
//
// ── Props (canonical list in SlideMedallions.META.controls) ───────────────────
//   imageCount  number 0..6   how many medallions                          (5)
//   arc         boolean       lift the middle medallions onto a crest      (true)
//   showLabels  boolean       name + role caption under each               (true)
//   showLead    boolean       the left lead paragraph beside the row       (true)
//   idPrefix    string        persistence namespace for the image slots
//
// Content props (authored at call-site):
//   overline, title, lead, items:[{ name, role }]

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideMedallions({
  overline = '入选标的 · THIS YEAR\u2019S FEATURED',
  title = '今年走进组合的五张面孔',
  lead = '它们不是全部，却最能说明这套规则在挑选什么——稳健的现金流、可解释的护城河、与组合其余部分的低相关。',
  items = [
    { name: '宁德时代', role: '新能源 · 核心仓' },
    { name: '贵州茅台', role: '消费 · 压舱石' },
    { name: '腾讯控股', role: '平台 · 现金流' },
    { name: '长江电力', role: '公用 · 低波动' },
    { name: '招商银行', role: '金融 · 高股息' },
    { name: '中国海油', role: '能源 · 周期对冲' },
  ],
  imageCount = 5, arc = true, showLabels = true, showLead = true, idPrefix = 'medallions',
}) {
  React.useEffect(() => { mdlInjectStyle(); }, []);
  const n = Math.max(0, Math.min(items.length, imageCount));
  const used = items.slice(0, n);
  const size = n <= 3 ? 330 : n === 4 ? 300 : n === 5 ? 272 : 248;
  const amp = arc ? Math.min(64, size * 0.22) : 0;
  const mid = (n - 1) / 2;
  const lift = (i) => (mid === 0 ? 0 : amp * (1 - Math.pow((i - mid) / mid, 2)));

  return (
    <div className="mdl-root">
      <div className={`mdl-top ${showLead ? '' : 'is-solo'}`}>
        <div className="mdl-head">
          <div className="mdl-overline">{overline}</div>
          <h2 className="mdl-title">{title}</h2>
        </div>
        {showLead && <p className="mdl-lead">{lead}</p>}
      </div>

      {n === 0 ? (
        <div className="mdl-empty">将「勋章数量」调到 1–6，拖入图片即可</div>
      ) : (
        <div className="mdl-row">
          {used.map((it, i) => (
            <div className="mdl-cell" key={i} style={{ transform: `translateY(${-lift(i)}px)` }}>
              <div className="mdl-coin" style={{ width: size, height: size }}>
                <DeckImageSlot id={`${idPrefix}-med-${i}`} idPrefix={idPrefix} placeholder={`PORTRAIT ${i + 1}`}
                               fit="cover" radius={size / 2} />
              </div>
              {showLabels && (
                <div className="mdl-cap">
                  <span className="mdl-name">{it.name}</span>
                  <span className="mdl-role">{it.role}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function mdlInjectStyle() {
  if (document.getElementById('mdl-style')) return;
  const s = document.createElement('style'); s.id = 'mdl-style';
  s.textContent = `
  .mdl-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .mdl-top{display:grid;grid-template-columns:1fr 560px;gap:80px;align-items:end;margin-bottom:18px;}
  .mdl-top.is-solo{grid-template-columns:1fr;}
  .mdl-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .mdl-title{font-size:58px;font-weight:300;margin:16px 0 0;line-height:1.1;text-wrap:balance;}
  .mdl-lead{margin:0;font-size:26px;font-weight:300;line-height:1.5;color:var(--ds-muted,rgba(242,243,246,.66));text-wrap:pretty;}
  .mdl-row{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:36px;}
  .mdl-cell{display:flex;flex-direction:column;align-items:center;gap:24px;transition:transform .4s cubic-bezier(.3,.7,.4,1);}
  .mdl-coin{flex:0 0 auto;border-radius:50%;overflow:hidden;
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.16));}
  .mdl-coin .dslot{border-radius:50% !important;}
  .mdl-cap{display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;}
  .mdl-name{font-size:29px;font-weight:400;}
  .mdl-role{font-family:var(--font-mono);font-size:21px;letter-spacing:.04em;color:var(--ds-faint,rgba(242,243,246,.5));}
  .mdl-empty{flex:1;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);
    font-size:28px;letter-spacing:.06em;color:var(--ds-faint,rgba(242,243,246,.4));}
  `;
  document.head.appendChild(s);
}

SlideMedallions.META = {
  id: 'medallions', title: '影像勋章',
  defaults: { imageCount: 5, arc: true, showLabels: true, showLead: true },
  controls: [
    { key: 'imageCount', type: 'slider', label: '勋章数量', default: 5, min: 0, max: 6, step: 1,
      description: '圆形图片勋章的数量（0 为空态提示）；数量越少单枚越大。' },
    { key: 'arc', type: 'toggle', label: '弧形排布', default: true,
      description: '让中间的勋章微微抬起，形成弧线；关则平排。' },
    { key: 'showLabels', type: 'toggle', label: '名称标注', default: true,
      description: '每枚勋章下方的名称 + 角色。' },
    { key: 'showLead', type: 'toggle', label: '引导段落', default: true,
      description: '标题右侧的一段引导说明。' },
  ],
};

export { SlideMedallions };
export const META = SlideMedallions.META;
export default SlideMedallions;
