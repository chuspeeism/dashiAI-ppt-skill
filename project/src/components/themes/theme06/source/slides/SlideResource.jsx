// ============================================================================
// SlideResource.jsx — P53 钱以外的资源 / Strategic Resource Map (image-led)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "what a deal locks in besides cash" page. N resource types are shown
// as a bold card grid — each card a kind tag + name + an oversized figure (a
// credit line, a count of co-sell / supply / data deals). An ADAPTIVE media
// column (mediaSlotCount 0..n) sits on the right and the grid rebalances at every
// count — 0 lets the cards span full width so composition stays balanced.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   resTag                            sector/section badge (decorative)
//   railCaption                       cards block caption
//   resources ({kind,name,en,value,unit}[])  resource-type cards
//   mediaPlaceholder                  image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   cardCount (int 2..4)      resource cards shown
//   layout (enum)             'grid' | 'rows'  card arrangement
//   mediaSlotCount (int 0..2) adaptive image slots (0 → cards span full width)
//   focusEnabled (bool)       emphasise one card
//   focusIndex (int)          which card
//   showKind (bool)           per-card kind tag (decorative)
//   showBadge (bool)          section badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (!document.getElementById('kx-rsc-css')) {
  const css = `
  .kx-rsc-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-rsc-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-rsc-title{font-size:68px;}
  .kx-rsc-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  .kx-rsc-main{flex:1;min-height:0;display:grid;column-gap:56px;padding:28px 0 6px;}
  .kx-rsc-cards-wrap{display:flex;flex-direction:column;min-height:0;}
  .kx-rsc-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;display:flex;align-items:center;gap:14px;padding-bottom:18px;}
  .kx-rsc-badge{display:inline-flex;align-items:center;gap:10px;
    font-family:var(--kx-mono);font-size:22px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:6px 13px;}
  .kx-rsc-badge::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--kx-ink);}
  .kx-rsc-cards{flex:1;min-height:0;display:grid;gap:18px;}
  .kx-rsc-card{border:1px solid var(--kx-line);border-top:3px solid var(--kx-mute-2);
    padding:26px 28px 22px;display:flex;flex-direction:column;justify-content:space-between;gap:18px;
    background:rgba(255,255,255,.015);min-height:0;}
  .kx-rsc-card.kx-on{border-color:var(--kx-accent);border-top-color:var(--kx-accent);
    background:linear-gradient(160deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 78%);}
  .kx-rsc-ctop{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
  .kx-rsc-kind{font-family:var(--kx-mono);font-size:19px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-ink);background:var(--kx-mute-2);padding:5px 11px;}
  .kx-rsc-card.kx-on .kx-rsc-kind{background:var(--kx-accent);}
  .kx-rsc-idx{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-rsc-nm{display:flex;flex-direction:column;gap:5px;}
  .kx-rsc-nm .kx-k{font-family:var(--kx-disp);font-weight:900;font-size:46px;line-height:.98;letter-spacing:-.01em;}
  .kx-rsc-nm .kx-e{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.04em;}
  .kx-rsc-val{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;
    letter-spacing:-.02em;line-height:.85;}
  .kx-rsc-val .kx-n{font-size:84px;color:var(--kx-cream);}
  .kx-rsc-val .kx-u{font-size:30px;color:var(--kx-mute-2);}
  .kx-rsc-card.kx-on .kx-rsc-val .kx-n{color:var(--kx-accent);}
  /* media column */
  .kx-rsc-media{display:flex;flex-direction:column;gap:20px;min-height:0;justify-content:center;}
  .kx-rsc-media .kx-imgslot{flex:none;}
  .kx-rsc-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-rsc-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-rsc-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-rsc-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideResource(props) {
  const p = { ...SlideResource.defaults, ...props };
  const cards = p.resources.slice(0, clamp(p.cardCount, 2, p.resources.length));
  const fi = clamp(p.focusIndex, 0, cards.length - 1);
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const mainCols = slots === 0 ? '1fr' : '1.32fr 0.78fr';

  // card grid columns: rows layout = single column; grid = 2 cols (>=3 cards) else N
  const gridCols = p.layout === 'rows' ? 1 : (cards.length >= 3 ? 2 : cards.length);

  const cardGrid = h('div', { className: 'kx-rsc-cards', style: { gridTemplateColumns: `repeat(${gridCols},1fr)` } },
    cards.map((r, i) => {
      const on = p.focusEnabled && i === fi;
      return h('div', { key: i, className: 'kx-rsc-card' + (on ? ' kx-on' : ''),
        style: { borderTopColor: on ? 'var(--kx-accent)' : 'var(--kx-mute-2)' } },
        h('div', { className: 'kx-rsc-ctop' },
          p.showKind ? h('span', { className: 'kx-rsc-kind' }, r.kind) : h('span'),
          h('span', { className: 'kx-rsc-idx' }, 'R' + String(i + 1).padStart(2, '0'))),
        h('div', { className: 'kx-rsc-nm' },
          h('span', { className: 'kx-k' }, r.name),
          h('span', { className: 'kx-e' }, r.en)),
        h('div', { className: 'kx-rsc-val' },
          h('span', { className: 'kx-n' }, r.value),
          r.unit ? h('span', { className: 'kx-u' }, r.unit) : null));
    }));

  const media = slots > 0 ? h('div', { className: 'kx-rsc-media' },
    Array.from({ length: slots }, (_, i) =>
      h(KxImageSlot, {
        key: i, id: 'resource-' + (p.eyebrowId || 'x') + '-' + i,
        placeholder: p.mediaPlaceholder || '资源示意 / DROP IMAGE',
        badge: slots === 1 ? p.resTag : ('IMG ' + String(i + 1).padStart(2, '0')),
        minRatio: slots === 1 ? 0.7 : 0.9, maxRatio: slots === 1 ? 1.3 : 1.9,
        style: { width: '100%' },
      }))) : null;

  const cardsBlock = h('div', { className: 'kx-rsc-cards-wrap' },
    h('div', { className: 'kx-rsc-cap' },
      p.showBadge ? h('span', { className: 'kx-rsc-badge' }, p.resTag) : null,
      h('span', null, p.railCaption)),
    cardGrid);

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-rsc-pad' },
      h('div', { className: 'kx-rsc-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-rsc-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-rsc-sub' }, p.subhead)),
      h('div', { className: 'kx-rsc-main', style: { gridTemplateColumns: mainCols } }, cardsBlock, media),
      h('div', { className: 'kx-rsc-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, cards.length + ' 类资源 · ' + (slots === 0 ? 'FULL' : slots + ' IMG')))));
}

SlideResource.defaults = {
  eyebrowId: '53', eyebrowLabel: 'STRATEGIC INVESTORS',
  title: '钱以外的资源', subhead: '战略投资者角色 / BEYOND CAPITAL',
  closing: 'AI 公司融资是在锁定未来资源。',
  resTag: '战略资源 / RESOURCES',
  railCaption: '资源类型 / RESOURCE TYPES',
  resources: [
    { kind: '授信', name: '云资源授信', en: 'CLOUD CREDIT LINE', value: '118', unit: '亿$' },
    { kind: '渠道', name: '联合销售', en: 'CO-SELL DEALS', value: '36', unit: '起' },
    { kind: '供应', name: '芯片供应承诺', en: 'CHIP SUPPLY', value: '22', unit: '起' },
    { kind: '数据', name: '数据合作', en: 'DATA PARTNERSHIP', value: '17', unit: '起' },
  ],
  mediaPlaceholder: '资源类型示意 / DROP IMAGE',
  cardCount: 4, layout: 'grid', mediaSlotCount: 1,
  focusEnabled: true, focusIndex: 0, showKind: true, showBadge: true, accent: '#c8f135',
};

SlideResource.controls = [
  { key: 'cardCount', label: '资源卡数量', type: 'number', default: 4, min: 2, max: 4, desc: '展示的资源类型卡数量' },
  { key: 'layout', label: '卡片排布', type: 'select', default: 'grid',
    options: [['grid', '网格'], ['rows', '列表']], desc: '资源卡的排列方式' },
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 时卡片占满整宽；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'focusEnabled', label: '重点卡高亮', type: 'toggle', default: true, desc: '是否突出某一资源卡' },
  { key: 'focusIndex', label: '高亮第几张', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的资源卡序号', showIf: (p) => p.focusEnabled },
  { key: 'showKind', label: '类型标签', type: 'toggle', default: true, desc: '显示/隐藏每张卡的类型标签（装饰）' },
  { key: 'showBadge', label: '资源徽标', type: 'toggle', default: true, desc: '显示/隐藏卡片区徽标（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideResource;
