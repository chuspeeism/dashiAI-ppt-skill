// ============================================================================
// SlideSpotlight.jsx — P67/68/69 公司案例 · 标志卡 / Company Case Spotlight
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A SECOND, bolder "single company spotlight" treatment (distinct from
// SlideCaseStudy): a rounded "signature metric" lime card + glassy rounded
// stat cards, echoing the dashboard reference (lime card / soft cards) while
// staying on the same kx- token system (dark #0c0c0c · lime #c8f135 · Archivo
// + Space Mono). Registered THREE times in the demo deck via presets — same
// component, different data:
//   • P67 default                 AI 搜索入口     Perplexity (1 adaptive slot)
//   • SlideSpotlight.presetDatabricks  P68 数据平台延展  Databricks (0 slot → mosaic)
//   • SlideSpotlight.presetGlean       P69 企业知识入口  Glean      (1 adaptive slot)
// Migration model: <SlideSpotlight {...SlideSpotlight.presetGlean} />.
//
// Layout. Header: eyebrow + CJK title (left), big Latin wordmark + CASE idx
// (right). Main is two columns:
//   LEFT  — positioning line, a bold rounded LIME signature card (the company's
//           standout figure), compact rounded metric cards, keyword chips.
//   RIGHT — mediaSlotCount 1..2 → ADAPTIVE image slots (ratio-aware, reflows).
//           mediaSlotCount 0    → a rounded STAT MOSAIC (metrics move here as big
//           cards) so the column is never empty — a fully data-driven case card.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   company                          big Latin wordmark (case identity)
//   caseIndex,caseTotal              "CASE NN / total" index (decorative)
//   caseTag                          company badge chip (decorative)
//   sigLabel                         signature-card kicker (mono, decorative)
//   positioning                      one-line case framing (mono)
//   hero ({value,unit,label})        the standout signature figure
//   metrics ({k,v}[])                supporting metric cards
//   tags (string[])                  keyword tag chips
//   mediaPlaceholder                 image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   mediaSlotCount (int 0..2)  adaptive image slots (0 → stat mosaic)
//   metricCount (int 2..4)     supporting metric cards shown
//   tagCount (int 0..6)        keyword chips (0 hides the row)
//   focusEnabled (bool)        emphasise one metric card
//   focusIndex (int)           which metric
//   showHero (bool)            rounded lime signature card (decorative anchor)
//   showCaseIndex (bool)       "CASE NN / total" index (decorative)
//   showTagBadge (bool)        company badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-spt-css')) {
  const css = `
  .kx-spt-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-spt-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-spt-title{font-size:64px;}
  .kx-spt-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-spt-id{display:flex;flex-direction:column;align-items:flex-end;gap:9px;text-align:right;white-space:nowrap;}
  .kx-spt-wm{font-family:var(--kx-disp);font-weight:900;letter-spacing:-.03em;line-height:.82;
    font-size:72px;text-transform:none;color:var(--kx-cream);}
  .kx-spt-wm b{color:var(--kx-accent);}
  .kx-spt-idx{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;}
  .kx-spt-idx b{color:var(--kx-accent);font-weight:700;}

  .kx-spt-main{flex:1;min-height:0;display:grid;column-gap:48px;padding:28px 0 6px;}
  /* left column */
  .kx-spt-left{display:flex;flex-direction:column;min-height:0;}
  .kx-spt-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;border-radius:999px;}
  .kx-spt-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-spt-pos{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute);line-height:1.45;letter-spacing:.01em;
    margin-top:16px;text-wrap:pretty;}
  /* signature lime card */
  .kx-spt-sig{margin-top:20px;border-radius:28px;padding:28px 34px 30px;
    background:linear-gradient(150deg,color-mix(in srgb,var(--kx-accent) 100%,white 6%),
      color-mix(in srgb,var(--kx-accent) 86%,black 6%));
    color:var(--kx-ink);position:relative;overflow:hidden;}
  .kx-spt-sig::after{content:'';position:absolute;right:-70px;bottom:-90px;width:280px;height:280px;
    border-radius:50%;border:1.5px solid rgba(0,0,0,.16);}
  .kx-spt-sigk{font-family:var(--kx-mono);font-size:21px;font-weight:700;letter-spacing:.05em;
    text-transform:uppercase;opacity:.62;}
  .kx-spt-sigv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:900;
    letter-spacing:-.03em;line-height:.92;margin-top:6px;white-space:nowrap;}
  .kx-spt-sigv .kx-n{font-size:124px;}
  .kx-spt-sigv .kx-u{font-size:46px;font-weight:800;opacity:.72;}
  .kx-spt-sigl{font-family:var(--kx-mono);font-size:22px;letter-spacing:.03em;text-transform:uppercase;
    opacity:.72;margin-top:14px;}
  /* compact metric cards (left) */
  .kx-spt-metrics{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px;}
  .kx-spt-metrics.kx-1col{grid-template-columns:1fr;}
  .kx-spt-mcard{border-radius:18px;border:1px solid var(--kx-line);background:rgba(255,255,255,.04);
    padding:16px 20px 14px;display:flex;flex-direction:column;gap:6px;min-width:0;}
  .kx-spt-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 16%,transparent),
    rgba(255,255,255,.02));border-color:color-mix(in srgb,var(--kx-accent) 55%,transparent);}
  .kx-spt-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:38px;line-height:.92;
    letter-spacing:-.02em;overflow-wrap:anywhere;}
  .kx-spt-mcard.kx-on .kx-mv{color:var(--kx-accent);}
  .kx-spt-mcard .kx-mk{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.03em;}
  /* tags */
  .kx-spt-tags{margin-top:auto;padding-top:18px;}
  .kx-spt-tags .kx-chip{font-size:21px;padding:7px 15px;border-radius:999px;}
  /* right: media column */
  .kx-spt-visual{display:flex;flex-direction:column;gap:18px;min-height:0;justify-content:center;}
  .kx-spt-visual .kx-imgslot{flex:none;border-radius:26px;}
  .kx-spt-visual .kx-imgslot .kx-slot-badge{border-radius:0 14px 0 0;}
  /* right: stat mosaic (zero-slot) */
  .kx-spt-mosaic{display:flex;flex-direction:column;min-height:0;justify-content:center;}
  .kx-spt-moscap{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:16px;margin-bottom:18px;border-bottom:1px solid var(--kx-line);}
  .kx-spt-mosgrid{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
  .kx-spt-mosgrid>.kx-spt-moscard:last-child:nth-child(odd){grid-column:1 / -1;}
  .kx-spt-moscard{border-radius:24px;border:1px solid var(--kx-line);background:rgba(255,255,255,.04);
    padding:30px 30px 26px;display:flex;flex-direction:column;gap:12px;min-height:0;}
  .kx-spt-moscard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 16%,transparent),
    rgba(255,255,255,.02));border-color:color-mix(in srgb,var(--kx-accent) 55%,transparent);}
  .kx-spt-moscard .kx-cv{font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.9;
    font-size:58px;overflow-wrap:anywhere;}
  .kx-spt-moscard.kx-on .kx-cv{color:var(--kx-accent);}
  .kx-spt-moscard .kx-ck{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);
    text-transform:uppercase;letter-spacing:.03em;}
  /* foot */
  .kx-spt-foot{display:flex;justify-content:space-between;align-items:center;padding-top:20px;
    border-top:1px solid var(--kx-line);}
  .kx-spt-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-spt-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-spt-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideSpotlight(props) {
  const p = { ...SlideSpotlight.defaults, ...props };
  const metrics = p.metrics.slice(0, clamp(p.metricCount, 2, p.metrics.length));
  const fi = clamp(p.focusIndex, 0, metrics.length - 1);
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const showMosaic = slots === 0;
  const tags = p.tags.slice(0, clamp(p.tagCount, 0, p.tags.length));

  const mainCols = showMosaic ? '0.94fr 1.06fr' : slots === 2 ? '1.02fr 0.98fr' : '0.96fr 1.04fr';

  // ---- left column -----------------------------------------------------
  const left = h('div', { className: 'kx-spt-left' },
    p.showTagBadge ? h('div', { className: 'kx-spt-badge' }, p.caseTag) : null,
    p.positioning ? h('div', { className: 'kx-spt-pos' }, p.positioning) : null,
    p.showHero ? h('div', { className: 'kx-spt-sig' },
      h('div', { className: 'kx-spt-sigk' }, p.sigLabel),
      h('div', { className: 'kx-spt-sigv' },
        h('span', { className: 'kx-n' }, p.hero.value),
        p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
      h('div', { className: 'kx-spt-sigl' }, p.hero.label)) : null,
    showMosaic ? null : h('div', { className: 'kx-spt-metrics' + (metrics.length <= 1 ? ' kx-1col' : '') },
      metrics.map((m, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-spt-mcard' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k)); })),
    tags.length ? h('div', { className: 'kx-spt-tags' },
      h('div', { className: 'kx-chips' },
        tags.map((t, i) => h('span', { key: i, className: 'kx-chip' + (i === 0 ? ' kx-on' : '') }, t)))) : null);

  // ---- right column: stat mosaic (zero-slot) ---------------------------
  const mosaic = h('div', { className: 'kx-spt-mosaic' },
    h('div', { className: 'kx-spt-moscap' }, '关键数据 / KEY FIGURES'),
    h('div', { className: 'kx-spt-mosgrid' },
      metrics.map((m, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-spt-moscard' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-cv' }, m.v),
          h('div', { className: 'kx-ck' }, m.k)); })));

  // ---- right column: adaptive image slots ------------------------------
  const media = showMosaic ? mosaic
    : h('div', { className: 'kx-spt-visual' },
        Array.from({ length: slots }, (_, i) =>
          h(KxImageSlot, {
            key: i, id: 'spt-' + (p.eyebrowId || 'x') + '-' + i,
            placeholder: p.mediaPlaceholder || '案例主视觉 / DROP IMAGE',
            badge: slots === 1 ? p.caseTag : ('IMG ' + String(i + 1).padStart(2, '0')),
            minRatio: slots === 1 ? 0.82 : 1.3, maxRatio: slots === 1 ? 1.5 : 2.2,
            style: { width: '100%' },
          })));

  const footRt = showMosaic ? (metrics.length) + ' FIGURES / MOSAIC' : slots + ' IMG / MEDIA';

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-spt-pad' },
      h('div', { className: 'kx-spt-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-spt-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-spt-sub' }, p.subhead)),
        h('div', { className: 'kx-spt-id' },
          h('div', { className: 'kx-spt-wm' }, h('b', null, p.company)),
          p.showCaseIndex ? h('div', { className: 'kx-spt-idx' },
            'CASE ', h('b', null, String(p.caseIndex).padStart(2, '0')), ' / ', String(p.caseTotal).padStart(2, '0')) : null)),
      h('div', { className: 'kx-spt-main', style: { gridTemplateColumns: mainCols } }, left, media),
      h('div', { className: 'kx-spt-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, footRt))));
}

SlideSpotlight.defaults = {
  eyebrowId: '67', eyebrowLabel: 'PERPLEXITY CASE',
  title: 'AI 搜索入口', subhead: 'Perplexity 案例 / AI SEARCH',
  closing: '新入口要用留存证明价值。',
  company: 'Perplexity', caseIndex: 6, caseTotal: 9, caseTag: 'CASE · PERPLEXITY',
  sigLabel: '标志数字 / SIGNATURE',
  positioning: '机会在于重构信息入口，挑战是内容版权和用户留存——Perplexity 代表 AI 搜索与答案引擎方向。',
  hero: { value: '5.2', unit: '亿$', label: '最大单笔融资 / LARGEST ROUND' },
  metrics: [
    { k: '月活用户 / MAU', v: '4800 万' },
    { k: '订阅转化率 / PAID', v: '5.8%' },
    { k: '赛道 / SEGMENT', v: 'AI 搜索' },
  ],
  tags: ['AI 搜索 / SEARCH', '答案引擎 / ANSWER', '信息入口 / GATEWAY', '用户留存 / RETENTION'],
  mediaPlaceholder: 'Perplexity 搜索入口主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 0, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

SlideSpotlight.controls = [
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 改为关键数据卡阵；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 4, desc: '辅助指标卡数量' },
  { key: 'tagCount', label: '关键词数量', type: 'number', default: 4, min: 0, max: 6, desc: '关键词芯片数量（0 隐藏整行）' },
  { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标卡' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
  { key: 'showHero', label: '标志数字卡', type: 'toggle', default: true, desc: '显示/隐藏左栏标志数字卡（装饰锚点）' },
  { key: 'showCaseIndex', label: '案例编号', type: 'toggle', default: true, desc: '显示/隐藏右上角 CASE 编号（装饰）' },
  { key: 'showTagBadge', label: '案例徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角案例徽标（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P68 数据平台延展 / Databricks — content_page → 0 slot, data mosaic.
SlideSpotlight.presetDatabricks = {
  eyebrowId: '68', eyebrowLabel: 'DATABRICKS CASE',
  title: '数据平台延展', subhead: 'Databricks 案例 / DATA PLATFORM',
  closing: '存量客户基础是 AI 商业化捷径。',
  company: 'Databricks', caseIndex: 7, caseTotal: 9, caseTag: 'CASE · DATABRICKS',
  sigLabel: '标志数字 / SIGNATURE',
  positioning: '已有数据平台更容易把 AI 能力卖给现有企业客户——Databricks 是数据平台向 AI 平台延展的典型公司。',
  hero: { value: '5.0', unit: '亿$', label: '最大单笔融资 / LARGEST ROUND' },
  metrics: [
    { k: '企业客户 / ENTERPRISE', v: '1.1 万家' },
    { k: '净收入留存 / NRR', v: '132%' },
    { k: '赛道 / SEGMENT', v: '数据平台' },
  ],
  tags: ['数据平台 / DATA', 'AI 平台 / AI PLATFORM', '存量客户 / INSTALLED', '高留存 / NRR'],
  mediaPlaceholder: 'Databricks 平台架构主视觉 / DROP IMAGE',
  mediaSlotCount: 0, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 1, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

// P69 企业知识入口 / Glean — content_page → 1 adaptive slot.
SlideSpotlight.presetGlean = {
  eyebrowId: '69', eyebrowLabel: 'GLEAN CASE',
  title: '企业知识入口', subhead: 'Glean 案例 / ENTERPRISE SEARCH',
  closing: '窄场景也能产生高价值。',
  company: 'Glean', caseIndex: 8, caseTotal: 9, caseTag: 'CASE · GLEAN',
  sigLabel: '标志数字 / SIGNATURE',
  positioning: '接入知识库后，企业搜索会成为高频工作入口——Glean 代表企业搜索和知识工作流自动化。',
  hero: { value: '2.6', unit: '亿$', label: '最大单笔融资 / LARGEST ROUND' },
  metrics: [
    { k: '付费客户 / PAID', v: '780 家' },
    { k: '续约率 / RENEWAL', v: '91%' },
    { k: '赛道 / SEGMENT', v: '企业搜索' },
  ],
  tags: ['企业搜索 / SEARCH', '知识工作流 / WORKFLOW', '高频入口 / DAILY', '高续约 / RENEWAL'],
  mediaPlaceholder: 'Glean 知识库入口主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 1, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

// P71 强叙事模型实验室 / SSI — case preset (props only, component unchanged).
SlideSpotlight.presetSSI = {
  eyebrowId: '71', eyebrowLabel: 'SSI CASE',
  title: '强叙事模型实验室', subhead: 'SSI 案例 / SAFE SUPERINTELLIGENCE',
  closing: '强叙事需要更长时间兑现。',
  company: 'SSI', caseIndex: 9, caseTotal: 9, caseTag: 'CASE · SSI',
  sigLabel: '标志数字 / SIGNATURE',
  positioning: '短期难以用收入评价，价值建立在长期技术想象上——SSI 代表强团队、强叙事、弱商业化验证的模型实验室。',
  hero: { value: '10', unit: '亿$', label: '最大单笔融资 / LARGEST ROUND' },
  metrics: [
    { k: '产品收入 / REVENUE', v: '0' },
    { k: '团队规模 / TEAM', v: '85 人' },
    { k: '赛道 / SEGMENT', v: '安全智能' },
  ],
  tags: ['安全智能 / SAFE SI', '强团队 / TEAM', '强叙事 / NARRATIVE', '长期兑现 / LONG-TERM'],
  mediaPlaceholder: 'SSI 抽象技术主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 0, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

export default SlideSpotlight;
