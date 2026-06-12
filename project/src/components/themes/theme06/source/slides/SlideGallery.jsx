// ============================================================================
// SlideGallery.jsx — P85 超级交易画像 / Image-led Mega-Deal Gallery
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "anchor figure + an adaptive image gallery" page. The right column
// is a gallery whose slot count is fully driven by mediaSlotCount (0..3) and
// rebalances at every count: 1 → a single hero, 2/3 → a balanced filmstrip row.
// Each KxImageSlot follows its uploaded image's natural ratio (ratio-aware),
// so composition stays clean whatever the user drops. With 0 slots the gallery
// becomes a data "deal wall" so the page is never empty. The left column holds
// a hero figure, supporting metrics and keyword chips.
//
// Second-level prefix: kx-gal-  ·  style id: kx-gal-css  (unique)
//
// PROPS (content — set via defaults / props, NOT Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   galleryTag                                     content — corner badge text
//   hero ({value,unit,label})                      content — anchor figure
//   metrics ({k,v}[])                              content — supporting metrics
//   tags (string[])                                content — keyword chips
//   wall ({name,v}[])                              content — 0-slot deal-wall rows
//   caption                                        content — gallery caption (decor)
//   railCaption                                    content — footer right caption
// PROPS (visual — 1:1 with controls)
//   mediaSlotCount (int 0..3) adaptive image slots (0 → deal-wall panel)
//   metricCount (int 2..4)    supporting metrics shown
//   tagCount (int 0..6)       keyword chips (0 hides the row)
//   focusEnabled (bool)       emphasise one metric
//   focusIndex (int)          which metric
//   showHero (bool)           left hero figure (decorative anchor)
//   showTagBadge (bool)       corner gallery badge (decorative)
//   showCaption (bool)        gallery caption strip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (!document.getElementById('kx-gal-css')) {
  const css = `
  .kx-gal-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-gal-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-gal-title{font-size:68px;}
  .kx-gal-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
  .kx-gal-main{flex:1;min-height:0;display:grid;column-gap:60px;padding:30px 0 6px;}
  /* left rail */
  .kx-gal-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:54px;}
  .kx-gal-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
  .kx-gal-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-gal-hero{margin-top:26px;}
  .kx-gal-hv{display:flex;align-items:flex-start;gap:10px;font-family:var(--kx-disp);font-weight:900;
    letter-spacing:-.03em;line-height:.82;color:var(--kx-accent);}
  .kx-gal-hv .kx-n{font-size:188px;}
  .kx-gal-hv .kx-u{font-size:54px;font-weight:800;align-self:flex-end;margin-bottom:24px;color:var(--kx-cream);}
  .kx-gal-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
    letter-spacing:.04em;margin-top:8px;}
  .kx-gal-metrics{display:grid;margin-top:30px;border-top:1px solid var(--kx-line);}
  .kx-gal-mcard{padding:20px 24px 16px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
  .kx-gal-mcard:last-child{border-right:none;}
  .kx-gal-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 80%);padding-left:18px;}
  .kx-gal-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
  .kx-gal-mcard.kx-on .kx-mv{color:var(--kx-accent);}
  .kx-gal-mcard .kx-mk{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-gal-tags{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;}
  .kx-gal-tag{font-family:var(--kx-mono);font-size:23px;font-weight:700;padding:8px 15px;letter-spacing:.02em;
    text-transform:uppercase;border:1px solid var(--kx-line);color:var(--kx-cream);background:rgba(255,255,255,.03);white-space:nowrap;}
  /* right gallery */
  .kx-gal-right{display:flex;flex-direction:column;min-height:0;}
  .kx-gal-cap{display:flex;justify-content:space-between;align-items:baseline;gap:18px;
    font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.04em;
    text-transform:uppercase;padding-bottom:16px;}
  .kx-gal-cap b{color:var(--kx-accent);}
  .kx-gal-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;gap:20px;}
  .kx-gal-stage.kx-one{flex-direction:column;}
  .kx-gal-stage .kx-imgslot{flex:1 1 0;min-width:0;}
  .kx-gal-stage.kx-one .kx-imgslot{flex:none;width:100%;max-height:100%;}
  /* 0-slot deal wall */
  .kx-gal-wall{flex:1;min-height:0;border:1px solid var(--kx-line);display:flex;flex-direction:column;
    justify-content:center;gap:0;padding:8px 30px;
    background:linear-gradient(180deg,rgba(200,241,53,.05),transparent 60%);}
  .kx-gal-wrow{display:grid;grid-template-columns:1fr 1.5fr auto;gap:24px;align-items:center;
    padding:18px 0;border-bottom:1px solid var(--kx-line);}
  .kx-gal-wrow:last-child{border-bottom:none;}
  .kx-gal-wname{font-family:var(--kx-disp);font-weight:900;font-size:40px;letter-spacing:-.01em;line-height:1;}
  .kx-gal-wtrack{height:16px;background:rgba(255,255,255,.05);position:relative;overflow:hidden;}
  .kx-gal-wfill{position:absolute;inset:0 auto 0 0;background:#34342f;}
  .kx-gal-wrow.kx-on .kx-gal-wfill{background:var(--kx-accent);}
  .kx-gal-wrow.kx-on .kx-gal-wname{color:var(--kx-accent);}
  .kx-gal-wv{font-family:var(--kx-disp);font-weight:800;font-size:38px;letter-spacing:-.02em;text-align:right;white-space:nowrap;}
  .kx-gal-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-gal-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-gal-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-gal-css'; s.textContent = css; document.head.appendChild(s);
}
const h = React.createElement;
// per-count ratio clamps keep the filmstrip from going too tall as it widens
const RATIO = { 1: [0.72, 1.4], 2: [0.62, 1.15], 3: [0.56, 0.96] };

function SlideGallery(props) {
  const p = { ...SlideGallery.defaults, ...props };
  const metrics = p.metrics.slice(0, Math.max(2, Math.min(p.metricCount, p.metrics.length)));
  const fi = Math.min(p.focusIndex, metrics.length - 1);
  const tags = p.tags.slice(0, Math.max(0, Math.min(p.tagCount, p.tags.length)));
  const slots = Math.max(0, Math.min(p.mediaSlotCount, 3));
  const mainCols = slots === 0 ? '1fr 1.04fr' : '0.82fr 1.18fr';

  const left = h('div', { className: 'kx-gal-left' },
    p.showTagBadge ? h('div', { className: 'kx-gal-badge' }, p.galleryTag) : null,
    p.showHero ? h('div', { className: 'kx-gal-hero' },
      h('div', { className: 'kx-gal-hv' },
        h('span', { className: 'kx-n' }, p.hero.value),
        p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
      h('div', { className: 'kx-gal-hl' }, p.hero.label)) : null,
    h('div', { className: 'kx-gal-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
      metrics.map((m, i) => {
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-gal-mcard' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k));
      })),
    tags.length ? h('div', { className: 'kx-gal-tags' },
      tags.map((t, i) => h('span', { key: i, className: 'kx-gal-tag' }, t))) : null);

  let stage;
  if (slots === 0) {
    const wall = p.wall.slice(0, 6);
    const maxV = Math.max(...wall.map((d) => d.v));
    const wfi = Math.min(p.focusIndex, wall.length - 1);
    stage = h('div', { className: 'kx-gal-wall' },
      wall.map((d, i) => h('div', { key: i, className: 'kx-gal-wrow' + (p.focusEnabled && i === wfi ? ' kx-on' : '') },
        h('div', { className: 'kx-gal-wname' }, d.name),
        h('div', { className: 'kx-gal-wtrack' },
          h('div', { className: 'kx-gal-wfill', style: { width: Math.max(8, (d.v / maxV) * 100) + '%' } })),
        h('div', { className: 'kx-gal-wv' }, d.v + (p.hero.unit || '')))));
  } else {
    const [mn, mx] = RATIO[slots] || RATIO[1];
    stage = h('div', { className: 'kx-gal-stage' + (slots === 1 ? ' kx-one' : '') },
      Array.from({ length: slots }, (_, i) =>
        h(KxImageSlot, {
          key: slots + '-' + i, id: 'gallery-' + slots + '-' + i,
          placeholder: slots === 1 ? '主视觉 / DROP IMAGE' : ('图 ' + String(i + 1).padStart(2, '0')),
          badge: slots === 1 ? p.galleryTag : ('IMG ' + String(i + 1).padStart(2, '0')),
          minRatio: mn, maxRatio: mx,
          style: { width: '100%' },
        })));
  }

  const right = h('div', { className: 'kx-gal-right' },
    p.showCaption ? h('div', { className: 'kx-gal-cap' },
      h('span', null, slots === 0 ? '超级交易墙 / DEAL WALL' : '案例画像 / GALLERY'),
      h('span', null, h('b', null, slots === 0 ? (p.wall.length + ' 笔') : (slots + ' IMG')))) : null,
    stage);

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-gal-pad' },
      h('div', { className: 'kx-gal-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-gal-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-gal-sub' }, p.subhead)),
      h('div', { className: 'kx-gal-main', style: { gridTemplateColumns: mainCols } }, left, right),
      h('div', { className: 'kx-gal-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.railCaption + ' · ' + (slots === 0 ? 'WALL' : slots + ' IMG')))));
}

SlideGallery.defaults = {
  eyebrowId: '85', eyebrowLabel: 'MEGA DEALS',
  title: '超级交易画像', subhead: '10 亿美元以上交易层 / MEGA-DEAL TIER',
  closing: '市场被少数超级交易重新定价。',
  galleryTag: '超级交易 / MEGA',
  hero: { value: '718', unit: '亿$', label: '10 亿+ 交易层合计 / TIER TOTAL' },
  metrics: [
    { k: '交易笔数 / DEALS', v: '12 笔' },
    { k: '占全年 / SHARE', v: '74%' },
    { k: '平均单笔 / AVG', v: '59.8 亿' },
    { k: '最大单笔 / MAX', v: '66 亿' },
  ],
  tags: ['通用大模型', '算力基础设施', '安全智能', '实时数据'],
  wall: [
    { name: 'OpenAI', v: 66 },
    { name: 'Anthropic', v: 65 },
    { name: 'xAI', v: 50 },
    { name: 'CoreWeave', v: 11 },
    { name: 'SSI', v: 10 },
    { name: 'Scale AI', v: 10 },
  ],
  caption: '超级交易画像',
  railCaption: 'MEGA TIER',
  mediaSlotCount: 2, metricCount: 3, tagCount: 3, focusEnabled: true, focusIndex: 1,
  showHero: true, showTagBadge: true, showCaption: true, accent: '#c8f135',
};

SlideGallery.controls = [
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 2, min: 0, max: 3,
    desc: '右侧自适应图片槽数量（0 改为超级交易墙；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 4, desc: '左栏辅助指标卡数量' },
  { key: 'tagCount', label: '关键词数量', type: 'number', default: 3, min: 0, max: 6, desc: '左栏关键词芯片数量（0 隐藏整行）' },
  { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标（0 图片时突出交易墙某行）' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 1, min: 0, max: 3, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
  { key: 'showHero', label: '主数字', type: 'toggle', default: true, desc: '显示/隐藏左栏主数字（装饰锚点）' },
  { key: 'showTagBadge', label: '角标徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角徽标（装饰）' },
  { key: 'showCaption', label: '画廊说明', type: 'toggle', default: true, desc: '显示/隐藏画廊顶部说明条（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideGallery;
