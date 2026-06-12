// ============================================================================
// SlideStrategy.jsx — P77 确定性预算 / Strategy Recommendation (reusable)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "what to back + how to screen it" strategy page. The left column
// states a strategy thesis and a `WATCH` screening checklist (the criteria you
// vet a direction against). The right zone lists N recommended directions as
// bold tiles (or compact rows); one tile can be pulled out as a solid-lime focus
// pick — the strongest recommendation. An ADAPTIVE media column (mediaSlotCount
// 0..2) can sit on the far right (e.g. a workflow-embedding diagram); the grid
// rebalances at every count so composition stays clean. In the demo deck it
// renders P77 优先基础设施; reused via `presetVertical` for P78 筛选垂直应用.
// Reusable for any "back this direction · screen on these criteria" page.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   stanceTag                         left strategy badge chip (decorative)
//   thesis (html)                     the strategy positioning sentence (display type)
//   watchCaption                      checklist caption
//   watch ({k,en}[])                  screening criteria (the checklist)
//   railCaption                       directions block caption
//   directions ({name,en,tag}[])      recommended directions / scenarios
//   mediaPlaceholder                  image-slot prompt text
//   footRight                         mono caption at the foot-right (decorative)
// PROPS (visual — all map 1:1 to .controls)
//   cardCount (int 2..5)      directions shown
//   layout (enum)             'cards' | 'rows'  direction arrangement
//   mediaSlotCount (int 0..2) adaptive image slots (0 → directions span the zone)
//   watchCount (int 0..4)     screening checklist items (0 hides the checklist)
//   focusEnabled (bool)       pull one direction out as the lime focus pick
//   focusIndex (int)          which direction
//   showTag (bool)            per-direction tag chip (decorative)
//   showBadge (bool)          section badge chips (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-stg-css')) {
  const css = `
  .kx-stg-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-stg-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-stg-title{font-size:64px;}
  .kx-stg-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-stg-tag{font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-mute-2);text-align:right;white-space:nowrap;}
  .kx-stg-tag b{color:var(--kx-accent);}

  .kx-stg-main{flex:1;min-height:0;display:grid;column-gap:54px;padding:30px 0 6px;}

  /* ---- left thesis + checklist column ---- */
  .kx-stg-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:50px;}
  .kx-stg-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;border-radius:999px;}
  .kx-stg-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-stg-thesis{font-family:var(--kx-disp);font-weight:800;font-size:44px;line-height:1.14;letter-spacing:-.01em;
    margin-top:22px;text-wrap:pretty;}
  .kx-stg-thesis b{color:var(--kx-accent);}
  .kx-stg-watch{margin-top:auto;display:flex;flex-direction:column;gap:0;}
  .kx-stg-wcap{font-family:var(--kx-mono);font-size:21px;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-mute-2);display:flex;align-items:center;gap:12px;padding-bottom:14px;}
  .kx-stg-wrow{display:flex;align-items:center;gap:18px;padding:15px 0;border-top:1px solid var(--kx-line);}
  .kx-stg-wrow:last-child{border-bottom:1px solid var(--kx-line);}
  .kx-stg-wmark{flex:none;width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,.06);
    border:1px solid var(--kx-line);display:flex;align-items:center;justify-content:center;position:relative;}
  .kx-stg-wmark::after{content:'';width:12px;height:7px;border-left:2.5px solid var(--kx-accent);
    border-bottom:2.5px solid var(--kx-accent);transform:translateY(-1px) rotate(-45deg);}
  .kx-stg-wk{font-family:var(--kx-disp);font-weight:800;font-size:28px;letter-spacing:-.005em;}
  .kx-stg-we{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);text-transform:uppercase;
    letter-spacing:.03em;margin-left:auto;white-space:nowrap;}

  /* ---- directions zone ---- */
  .kx-stg-dir{display:flex;flex-direction:column;min-height:0;}
  .kx-stg-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;display:flex;align-items:center;gap:14px;padding-bottom:18px;}
  .kx-stg-cap .kx-stg-badge2{font-family:var(--kx-mono);font-size:22px;font-weight:700;letter-spacing:.04em;
    text-transform:uppercase;background:var(--kx-accent);color:var(--kx-ink);padding:6px 13px;
    display:inline-flex;align-items:center;gap:9px;}
  .kx-stg-cap .kx-stg-badge2::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--kx-ink);}

  /* tiles grid */
  .kx-stg-tiles{flex:1;min-height:0;display:grid;gap:16px;}
  .kx-stg-tile{position:relative;border-radius:22px;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:26px 28px 24px;display:flex;flex-direction:column;justify-content:space-between;gap:24px;min-height:0;overflow:hidden;}
  .kx-stg-tile.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);color:var(--kx-ink);}
  .kx-stg-ttop{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
  .kx-stg-idx{font-family:var(--kx-disp);font-weight:900;font-size:40px;line-height:.8;letter-spacing:-.03em;
    color:var(--kx-mute-2);}
  .kx-stg-tile.kx-on .kx-stg-idx{color:var(--kx-ink);opacity:.55;}
  .kx-stg-ttag{font-family:var(--kx-mono);font-size:18px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    color:var(--kx-ink);background:var(--kx-mute-2);padding:5px 11px;white-space:nowrap;}
  .kx-stg-tile.kx-on .kx-stg-ttag{background:var(--kx-ink);color:var(--kx-accent);}
  .kx-stg-tnm{display:flex;flex-direction:column;gap:6px;}
  .kx-stg-tnm .kx-tk{font-family:var(--kx-disp);font-weight:900;font-size:46px;line-height:.98;letter-spacing:-.01em;}
  .kx-stg-tnm .kx-te{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.04em;text-transform:uppercase;}
  .kx-stg-tile.kx-on .kx-stg-tnm .kx-te{color:rgba(12,12,12,.62);}
  .kx-stg-tile .kx-stg-tnum{position:absolute;right:-10px;bottom:-26px;font-family:var(--kx-disp);font-weight:900;
    font-size:150px;line-height:.7;letter-spacing:-.04em;color:currentColor;opacity:.05;pointer-events:none;}

  /* rows list (compact) */
  .kx-stg-rows{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;justify-content:center;}
  .kx-stg-row{border-radius:18px;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:20px 26px;display:flex;align-items:center;gap:22px;}
  .kx-stg-row.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);color:var(--kx-ink);}
  .kx-stg-row .kx-ri{font-family:var(--kx-disp);font-weight:900;font-size:30px;line-height:.8;letter-spacing:-.03em;
    color:var(--kx-mute-2);min-width:48px;}
  .kx-stg-row.kx-on .kx-ri{color:var(--kx-ink);opacity:.55;}
  .kx-stg-row .kx-rn{display:flex;flex-direction:column;gap:3px;min-width:0;}
  .kx-stg-row .kx-rn .kx-rk{font-family:var(--kx-disp);font-weight:900;font-size:34px;line-height:1;letter-spacing:-.01em;}
  .kx-stg-row .kx-rn .kx-re{font-family:var(--kx-mono);font-size:17px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-stg-row.kx-on .kx-rn .kx-re{color:rgba(12,12,12,.6);}
  .kx-stg-row .kx-rtag{margin-left:auto;font-family:var(--kx-mono);font-size:18px;font-weight:700;letter-spacing:.04em;
    text-transform:uppercase;color:var(--kx-ink);background:var(--kx-mute-2);padding:5px 11px;white-space:nowrap;}
  .kx-stg-row.kx-on .kx-rtag{background:var(--kx-ink);color:var(--kx-accent);}

  /* media column */
  .kx-stg-media{display:flex;flex-direction:column;gap:18px;min-height:0;justify-content:center;}
  .kx-stg-media .kx-imgslot{flex:none;border-radius:22px;}

  /* foot */
  .kx-stg-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-stg-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-stg-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-stg-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideStrategy(props) {
  const p = { ...SlideStrategy.defaults, ...props };
  const dirs = p.directions.slice(0, clamp(p.cardCount, 2, p.directions.length));
  const fi = clamp(p.focusIndex, 0, dirs.length - 1);
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const watch = p.watch.slice(0, clamp(p.watchCount, 0, p.watch.length));

  // main columns: thesis | directions [ | media ]
  const mainCols = slots === 0 ? '0.92fr 1.26fr' : '0.78fr 1.04fr 0.86fr';

  // ---- left thesis + checklist ----------------------------------------
  const left = h('div', { className: 'kx-stg-left' },
    p.showBadge ? h('div', { className: 'kx-stg-badge' }, p.stanceTag) : null,
    h('div', { className: 'kx-stg-thesis', dangerouslySetInnerHTML: { __html: p.thesis } }),
    watch.length ? h('div', { className: 'kx-stg-watch' },
      h('div', { className: 'kx-stg-wcap' }, p.watchCaption),
      watch.map((w, i) => h('div', { key: i, className: 'kx-stg-wrow' },
        h('span', { className: 'kx-stg-wmark' }),
        h('span', { className: 'kx-stg-wk' }, w.k),
        w.en ? h('span', { className: 'kx-stg-we' }, w.en) : null))) : null);

  // ---- directions: tiles grid ------------------------------------------
  const gridCols = slots > 0 ? 1 : (dirs.length >= 3 ? 2 : 1);
  const tiles = h('div', { className: 'kx-stg-tiles', style: { gridTemplateColumns: `repeat(${gridCols},1fr)` } },
    dirs.map((d, i) => {
      const on = p.focusEnabled && i === fi;
      return h('div', { key: i, className: 'kx-stg-tile' + (on ? ' kx-on' : '') },
        h('div', { className: 'kx-stg-tnum' }, String(i + 1).padStart(2, '0')),
        h('div', { className: 'kx-stg-ttop' },
          h('span', { className: 'kx-stg-idx' }, String(i + 1).padStart(2, '0')),
          p.showTag && d.tag ? h('span', { className: 'kx-stg-ttag' }, d.tag) : null),
        h('div', { className: 'kx-stg-tnm' },
          h('span', { className: 'kx-tk' }, d.name),
          d.en ? h('span', { className: 'kx-te' }, d.en) : null));
    }));

  // ---- directions: compact rows ----------------------------------------
  const rows = h('div', { className: 'kx-stg-rows' },
    dirs.map((d, i) => {
      const on = p.focusEnabled && i === fi;
      return h('div', { key: i, className: 'kx-stg-row' + (on ? ' kx-on' : '') },
        h('span', { className: 'kx-ri' }, String(i + 1).padStart(2, '0')),
        h('div', { className: 'kx-rn' },
          h('span', { className: 'kx-rk' }, d.name),
          d.en ? h('span', { className: 'kx-re' }, d.en) : null),
        p.showTag && d.tag ? h('span', { className: 'kx-rtag' }, d.tag) : null);
    }));

  const dirZone = h('div', { className: 'kx-stg-dir' },
    h('div', { className: 'kx-stg-cap' },
      p.showBadge ? h('span', { className: 'kx-stg-badge2' }, p.dirTag || 'PICKS') : null,
      h('span', null, p.railCaption)),
    p.layout === 'rows' || slots > 0 ? rows : tiles);

  // ---- media column ----------------------------------------------------
  const media = slots > 0 ? h('div', { className: 'kx-stg-media' },
    Array.from({ length: slots }, (_, i) =>
      h(KxImageSlot, {
        key: i, id: 'strategy-' + (p.eyebrowId || 'x') + '-' + i,
        placeholder: p.mediaPlaceholder || '方向示意 / DROP IMAGE',
        badge: slots === 1 ? p.stanceTag : ('IMG ' + String(i + 1).padStart(2, '0')),
        minRatio: slots === 1 ? 0.78 : 0.9, maxRatio: slots === 1 ? 1.5 : 1.9,
        style: { width: '100%' },
      }))) : null;

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-stg-pad' },
      h('div', { className: 'kx-stg-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-stg-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-stg-sub' }, p.subhead)),
        h('div', { className: 'kx-stg-tag' }, p.stanceTag ? h('b', null, p.stanceTag) : p.eyebrowLabel)),
      h('div', { className: 'kx-stg-main', style: { gridTemplateColumns: mainCols } },
        left, dirZone, media),
      h('div', { className: 'kx-stg-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (dirs.length + ' 方向 · ' + (slots === 0 ? 'FULL' : slots + ' IMG'))))));
}

SlideStrategy.defaults = {
  eyebrowId: '77', eyebrowLabel: 'INFRASTRUCTURE STRATEGY',
  title: '确定性预算', subhead: '策略 · 优先基础设施 / PRIORITIZE INFRA',
  closing: '优先看能支撑全行业增长的基础设施。',
  stanceTag: 'STRATEGY · 优先基础设施',
  dirTag: 'PICKS',
  thesis: '基础设施公司更接近 <b>刚性预算</b>，收入确定性相对更强——模型胜负未定时，卖铲子仍是更稳的资本逻辑。',
  watchCaption: '关注指标 / WHAT TO WATCH',
  watch: [
    { k: '收入增速', en: 'REVENUE GROWTH' },
    { k: '毛利率', en: 'GROSS MARGIN' },
    { k: '客户集中度', en: 'CONCENTRATION' },
    { k: '资源锁定', en: 'RESOURCE LOCK-IN' },
  ],
  railCaption: '推荐方向 / RECOMMENDED',
  directions: [
    { name: 'GPU 云', en: 'GPU CLOUD', tag: '算力供给' },
    { name: '数据平台', en: 'DATA PLATFORM', tag: '企业刚需' },
    { name: '评测工具', en: 'EVAL TOOLING', tag: '合规门槛' },
    { name: '推理优化', en: 'INFERENCE OPT', tag: '成本曲线' },
  ],
  mediaPlaceholder: '基础设施示意 / DROP IMAGE',
  footRight: '4 方向 · FULL',
  cardCount: 4, layout: 'cards', mediaSlotCount: 0, watchCount: 4,
  focusEnabled: true, focusIndex: 0, showTag: true, showBadge: true, accent: '#c8f135',
};

SlideStrategy.controls = [
  { key: 'cardCount', label: '方向数量', type: 'number', default: 4, min: 2, max: 5, desc: '展示的推荐方向数量' },
  { key: 'layout', label: '方向排布', type: 'select', default: 'cards',
    options: [['cards', '方向卡'], ['rows', '列表行']], desc: '推荐方向的呈现形式（有图片时自动转列表行）' },
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 0, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 时方向卡占满；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'watchCount', label: '筛选清单条数', type: 'number', default: 4, min: 0, max: 4, desc: '左侧筛选指标清单条数（0 隐藏整列）' },
  { key: 'focusEnabled', label: '重点方向高亮', type: 'toggle', default: true, desc: '是否把某一方向拉成实心强调（最优先推荐）' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 4, desc: '被突出的方向序号', showIf: (p) => p.focusEnabled },
  { key: 'showTag', label: '方向标签', type: 'toggle', default: true, desc: '显示/隐藏每个方向的标签芯片（装饰）' },
  { key: 'showBadge', label: '区块徽标', type: 'toggle', default: true, desc: '显示/隐藏策略 / 方向区徽标（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P78 嵌入工作流 / 筛选垂直应用 — reuse this strategy page via a preset passed as props.
// Image-led variant: a workflow-embedding diagram slot + scenario rows.
// Migration: any host can render <SlideStrategy {...SlideStrategy.presetVertical} />.
SlideStrategy.presetVertical = {
  eyebrowId: '78', eyebrowLabel: 'VERTICAL STRATEGY',
  title: '嵌入工作流', subhead: '策略 · 筛选垂直应用 / EMBED IN WORKFLOW',
  closing: '应用价值来自流程位置。',
  stanceTag: 'STRATEGY · 筛选垂直应用',
  dirTag: 'SCENES',
  thesis: '垂直应用要看是否 <b>嵌入刚性流程</b>，而不是只看生成效果——能成为工作流一部分的应用才有长期价值。',
  watchCaption: '关注指标 / WHAT TO WATCH',
  watch: [
    { k: '付费留存', en: 'PAID RETENTION' },
    { k: '使用频次', en: 'USAGE FREQUENCY' },
    { k: '席位扩张', en: 'SEAT EXPANSION' },
    { k: '净收入留存', en: 'NET REVENUE RET.' },
  ],
  railCaption: '重点场景 / KEY SCENES',
  directions: [
    { name: '法律', en: 'LEGAL', tag: '高客单价' },
    { name: '医疗', en: 'HEALTHCARE', tag: '高壁垒' },
    { name: '客服', en: 'SUPPORT', tag: '可量化 ROI' },
    { name: '企业搜索', en: 'ENTERPRISE SEARCH', tag: '高频入口' },
    { name: '开发者工具', en: 'DEV TOOLS', tag: '刚性预算' },
  ],
  mediaPlaceholder: '工作流嵌入示意 / DROP IMAGE',
  footRight: '5 场景 · 1 IMG',
  cardCount: 5, layout: 'rows', mediaSlotCount: 1, watchCount: 4,
  focusEnabled: true, focusIndex: 2, showTag: true, showBadge: true, accent: '#c8f135',
};

export default SlideStrategy;
