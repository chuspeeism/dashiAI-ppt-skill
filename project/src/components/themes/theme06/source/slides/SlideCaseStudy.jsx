// ============================================================================
// SlideCaseStudy.jsx — P62/63/64 公司案例 / Company Case Spotlight
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// One generic "single company spotlight" page, registered THREE times in the
// demo deck with content passed as props — same component, different data:
//   • P62 default                  商业化标杆   OpenAI    (1 adaptive image slot)
//   • SlideCaseStudy.presetAnthropic  P63 安全可靠模型  Anthropic
//   • SlideCaseStudy.presetXai        P64 实时数据生态  xAI
//   • SlideCaseStudy.presetCoreweave  P65 算力基础设施  CoreWeave
// (P66 数据基础设施 Scale AI is a TABLE page → see SlideMatrix.jsx.)
// Migration model: <SlideCaseStudy {...SlideCaseStudy.presetAnthropic} />.
//
// Header: eyebrow + CJK theme title on the left, big Latin company wordmark +
// "CASE NN / total" index on the right. Left column carries a dominant HERO
// figure (the company's standout number, lime) + a 2-up grid of supporting
// metric cards + keyword tag chips. Right column adapts:
//   mediaSlotCount 1..2 → ADAPTIVE image slots (ratio-aware, layout reflows).
//   mediaSlotCount 0    → a STAT MOSAIC (hero + metrics as big cards) so the
//                         column never looks empty — a fully data-driven case card.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   company                          big Latin wordmark (case identity)
//   caseIndex,caseTotal              "CASE NN / total" index (decorative)
//   caseTag                          company badge chip (decorative)
//   positioning                      one-line case framing (mono)
//   hero ({value,unit,label})        dominant standout figure
//   metrics ({k,v}[])                supporting metric cards
//   tags (string[])                  keyword tag chips
//   mediaPlaceholder                 image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   mediaSlotCount (int 0..2)  adaptive image slots (0 → stat mosaic)
//   metricCount (int 2..4)     supporting metric cards shown
//   tagCount (int 0..6)        keyword chips (0 hides the row)
//   focusEnabled (bool)        emphasise one metric card
//   focusIndex (int)           which metric
//   showHero (bool)            dominant hero figure (decorative anchor)
//   showCaseIndex (bool)       "CASE NN / total" index (decorative)
//   showTagBadge (bool)        company badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-cas-css')) {
  const css = `
  .kx-cas-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-cas-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-cas-title{font-size:66px;}
  .kx-cas-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-cas-id{display:flex;flex-direction:column;align-items:flex-end;gap:10px;text-align:right;white-space:nowrap;}
  .kx-cas-wm{font-family:var(--kx-disp);font-weight:900;letter-spacing:-.02em;line-height:.84;
    font-size:84px;text-transform:none;}
  .kx-cas-wm b{color:var(--kx-accent);}
  .kx-cas-idx{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;}
  .kx-cas-idx b{color:var(--kx-accent);font-weight:700;}

  .kx-cas-main{flex:1;min-height:0;display:grid;column-gap:60px;padding:30px 0 8px;}
  /* left column */
  .kx-cas-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
  .kx-cas-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
  .kx-cas-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-cas-pos{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute);line-height:1.42;letter-spacing:.01em;
    margin-top:16px;text-wrap:pretty;border-left:3px solid var(--kx-accent);padding-left:16px;}
  /* hero */
  .kx-cas-hero{margin-top:20px;}
  .kx-cas-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;
    letter-spacing:-.03em;line-height:.9;white-space:nowrap;}
  .kx-cas-hv .kx-n{font-size:144px;color:var(--kx-accent);}
  .kx-cas-hv .kx-u{font-size:52px;color:var(--kx-mute);}
  .kx-cas-hl{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);text-transform:uppercase;
    letter-spacing:.04em;margin-top:14px;}
  /* metric cards (2-up grid) */
  .kx-cas-metrics{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:auto;
    border-top:1px solid var(--kx-line);}
  .kx-cas-mcard{padding:16px 24px 13px 0;border-right:1px solid var(--kx-line);
    border-bottom:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;min-width:0;}
  .kx-cas-metrics.kx-1col{grid-template-columns:1fr;}
  .kx-cas-mcard:nth-child(2n){border-right:none;padding-right:0;}
  .kx-cas-metrics.kx-1col .kx-cas-mcard{border-right:none;padding-right:0;}
  .kx-cas-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 82%);
    padding-left:16px;}
  .kx-cas-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:.92;letter-spacing:-.02em;
    overflow-wrap:anywhere;}
  .kx-cas-mcard.kx-on .kx-mv{color:var(--kx-accent);}
  .kx-cas-mcard .kx-mk{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  /* tags */
  .kx-cas-tags{margin-top:16px;}
  .kx-cas-tags .kx-chip{font-size:21px;padding:7px 13px;}
  /* right: media column */
  .kx-cas-media{display:flex;flex-direction:column;gap:18px;min-height:0;justify-content:center;}
  .kx-cas-media .kx-imgslot{flex:none;}
  /* right: stat mosaic (zero-slot) */
  .kx-cas-mosaic{display:flex;flex-direction:column;min-height:0;justify-content:center;}
  .kx-cas-moscap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:16px;border-bottom:1px solid var(--kx-line);margin-bottom:18px;}
  .kx-cas-mosgrid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .kx-cas-moscard{background:rgba(255,255,255,.04);border:1px solid var(--kx-line);
    padding:26px 26px 22px;display:flex;flex-direction:column;gap:12px;min-height:0;}
  .kx-cas-moscard.kx-hero{grid-column:1 / -1;background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
  .kx-cas-moscard .kx-cv{font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.9;
    font-size:58px;overflow-wrap:anywhere;}
  .kx-cas-moscard.kx-hero .kx-cv{font-size:120px;display:flex;align-items:baseline;gap:8px;}
  .kx-cas-moscard.kx-hero .kx-cv .kx-u{font-size:48px;opacity:.7;}
  .kx-cas-moscard .kx-ck{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-cas-moscard.kx-hero .kx-ck{color:var(--kx-ink);opacity:.66;}
  /* foot */
  .kx-cas-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-cas-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-cas-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-cas-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideCaseStudy(props) {
  const p = { ...SlideCaseStudy.defaults, ...props };
  const metrics = p.metrics.slice(0, clamp(p.metricCount, 2, p.metrics.length));
  const fi = clamp(p.focusIndex, 0, metrics.length - 1);
  const slots = clamp(p.mediaSlotCount, 0, 2);
  const showMosaic = slots === 0;
  const tags = p.tags.slice(0, clamp(p.tagCount, 0, p.tags.length));

  const mainCols = showMosaic ? '0.92fr 1.08fr' : slots === 2 ? '0.96fr 1.04fr' : '0.86fr 1.14fr';

  // ---- left column -----------------------------------------------------
  const left = h('div', { className: 'kx-cas-left' },
    p.showTagBadge ? h('div', { className: 'kx-cas-badge' }, p.caseTag) : null,
    p.positioning ? h('div', { className: 'kx-cas-pos' }, p.positioning) : null,
    p.showHero ? h('div', { className: 'kx-cas-hero' },
      h('div', { className: 'kx-cas-hv' },
        h('span', { className: 'kx-n' }, p.hero.value),
        p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
      h('div', { className: 'kx-cas-hl' }, p.hero.label)) : null,
    tags.length ? h('div', { className: 'kx-cas-tags' },
      h('div', { className: 'kx-chips' },
        tags.map((t, i) => h('span', { key: i, className: 'kx-chip' + (i === 0 ? ' kx-on' : '') }, t)))) : null,
    h('div', { className: 'kx-cas-metrics' + (metrics.length <= 1 ? ' kx-1col' : '') },
      metrics.map((m, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-cas-mcard' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k)); })));

  // ---- right column: stat mosaic (zero-slot) ---------------------------
  const mosaic = h('div', { className: 'kx-cas-mosaic' },
    h('div', { className: 'kx-cas-moscap' }, '关键数据 / KEY FIGURES'),
    h('div', { className: 'kx-cas-mosgrid' },
      h('div', { className: 'kx-cas-moscard kx-hero' },
        h('div', { className: 'kx-cv' },
          h('span', null, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-ck' }, p.hero.label)),
      metrics.map((m, i) => h('div', { key: i, className: 'kx-cas-moscard' },
        h('div', { className: 'kx-cv' }, m.v),
        h('div', { className: 'kx-ck' }, m.k)))));

  // ---- right column: adaptive image slots ------------------------------
  const media = showMosaic ? mosaic
    : h('div', { className: 'kx-cas-media' },
        Array.from({ length: slots }, (_, i) =>
          h(KxImageSlot, {
            key: i, id: 'cas-' + (p.eyebrowId || 'x') + '-' + i,
            placeholder: p.mediaPlaceholder || '案例主视觉 / DROP IMAGE',
            badge: slots === 1 ? p.caseTag : ('IMG ' + String(i + 1).padStart(2, '0')),
            minRatio: slots === 1 ? 0.78 : 1.3, maxRatio: slots === 1 ? 1.5 : 2.2,
            style: { width: '100%' },
          })));

  const footRt = showMosaic ? (metrics.length + 1) + ' FIGURES / MOSAIC'
    : slots + ' IMG / MEDIA';

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-cas-pad' },
      h('div', { className: 'kx-cas-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-cas-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-cas-sub' }, p.subhead)),
        h('div', { className: 'kx-cas-id' },
          h('div', { className: 'kx-cas-wm' }, h('b', null, p.company)),
          p.showCaseIndex ? h('div', { className: 'kx-cas-idx' },
            'CASE ', h('b', null, String(p.caseIndex).padStart(2, '0')), ' / ', String(p.caseTotal).padStart(2, '0')) : null)),
      h('div', { className: 'kx-cas-main', style: { gridTemplateColumns: mainCols } }, left, media),
      h('div', { className: 'kx-cas-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, footRt))));
}

SlideCaseStudy.defaults = {
  eyebrowId: '62', eyebrowLabel: 'OPENAI CASE',
  title: '商业化标杆', subhead: 'OpenAI 案例 / GENERAL MODELS',
  closing: '模型能力必须转成生态和收入。',
  company: 'OpenAI', caseIndex: 1, caseTotal: 9, caseTag: 'CASE · OPENAI',
  positioning: '看点是模型能力、生态入口和企业商业化能否同时领先——OpenAI 仍是通用大模型商业化的标杆样本。',
  hero: { value: '66', unit: '亿$', label: '最大单笔融资 / LARGEST ROUND' },
  metrics: [
    { k: '企业客户 / ENTERPRISE', v: '9.4 万家' },
    { k: '年度化收入 / ARR', v: '38 亿$' },
    { k: '赛道 / SEGMENT', v: '通用大模型' },
  ],
  tags: ['通用大模型 / FRONTIER', '生态入口 / PLATFORM', '企业商业化 / GTM'],
  mediaPlaceholder: 'OpenAI 公司卡主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 3,
  focusEnabled: true, focusIndex: 1, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

SlideCaseStudy.controls = [
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 改为关键数据卡阵；上传后按图片比例自适应，构图随数量重排）' },
  { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 4, desc: '左侧辅助指标卡数量' },
  { key: 'tagCount', label: '关键词数量', type: 'number', default: 3, min: 0, max: 6, desc: '左侧关键词芯片数量（0 隐藏整行）' },
  { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标卡' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 1, min: 0, max: 3, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
  { key: 'showHero', label: '重点大数字', type: 'toggle', default: true, desc: '显示/隐藏左栏主标数字（装饰锚点）' },
  { key: 'showCaseIndex', label: '案例编号', type: 'toggle', default: true, desc: '显示/隐藏右上角 CASE 编号（装饰）' },
  { key: 'showTagBadge', label: '案例徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角案例徽标（装饰）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P63 安全可靠模型 / Anthropic — case preset (props only, component unchanged).
SlideCaseStudy.presetAnthropic = {
  eyebrowId: '63', eyebrowLabel: 'ANTHROPIC CASE',
  title: '安全可靠模型', subhead: 'Anthropic 案例 / SAFE & RELIABLE',
  closing: '可信度本身可以成为商业壁垒。',
  company: 'Anthropic', caseIndex: 2, caseTotal: 9, caseTag: 'CASE · ANTHROPIC',
  positioning: 'Anthropic 的核心定位是安全、可靠和企业级模型能力——优势不是更激进的叙事，而是更可信的企业采用。',
  hero: { value: '650', unit: '亿$+', label: '累计融资 / TOTAL RAISED' },
  metrics: [
    { k: '估值 / VALUATION', v: '9650 亿$' },
    { k: '产品 / PRODUCT', v: 'Claude' },
    { k: '客户群 / CUSTOMERS', v: '云 · 金融 · 专业服务' },
  ],
  tags: ['Claude', '安全对齐 / ALIGNMENT', '长上下文 / LONG CTX', '企业采用 / ENTERPRISE'],
  mediaPlaceholder: 'Anthropic 公司卡主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 0, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

// P64 实时数据生态 / xAI — case preset (props only, component unchanged).
SlideCaseStudy.presetXai = {
  eyebrowId: '64', eyebrowLabel: 'XAI CASE',
  title: '实时数据生态', subhead: 'xAI 案例 / REAL-TIME DATA',
  closing: '独特数据入口可以成为模型差异化。',
  company: 'xAI', caseIndex: 3, caseTotal: 9, caseTag: 'CASE · XAI',
  positioning: 'xAI 以实时数据和马斯克生态作为差异化——核心资产不是模型本身，而是实时数据和生态流量。',
  hero: { value: '50', unit: '亿$', label: '单笔融资 / SINGLE ROUND' },
  metrics: [
    { k: '估值 / VALUATION', v: '500 亿$' },
    { k: '数据入口 / DATA', v: 'X 平台' },
    { k: '协同 / SYNERGY', v: '特斯拉 · 多模态' },
  ],
  tags: ['实时数据 / REAL-TIME', 'X 平台 / PLATFORM', '多模态 / MULTIMODAL', '实时搜索 / SEARCH'],
  mediaPlaceholder: 'xAI 生态连接主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 1, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

// P65 算力基础设施 / CoreWeave — case preset (props only, component unchanged).
SlideCaseStudy.presetCoreweave = {
  eyebrowId: '65', eyebrowLabel: 'COREWEAVE CASE',
  title: '算力基础设施', subhead: 'CoreWeave 案例 / COMPUTE INFRA',
  closing: '卖铲子的人也能成为核心资产。',
  company: 'CoreWeave', caseIndex: 4, caseTotal: 9, caseTag: 'CASE · COREWEAVE',
  positioning: '当模型公司都在抢 GPU，算力供应商获得资本溢价——CoreWeave 代表算力基础设施的确定性机会。',
  hero: { value: '110', unit: '亿$', label: '融资额 / TOTAL RAISED' },
  metrics: [
    { k: '估值 / VALUATION', v: '190 亿$' },
    { k: 'GPU 资源 / GPU FLEET', v: '7.8 万张' },
    { k: '客户 / CUSTOMERS', v: '模型 · 生成式 · 推理' },
  ],
  tags: ['GPU 云 / GPU CLOUD', '算力供应 / COMPUTE', '资本溢价 / PREMIUM', '企业推理 / INFERENCE'],
  mediaPlaceholder: 'CoreWeave GPU 集群主视觉 / DROP IMAGE',
  mediaSlotCount: 1, metricCount: 3, tagCount: 4,
  focusEnabled: true, focusIndex: 1, showHero: true, showCaseIndex: true, showTagBadge: true,
  accent: '#c8f135',
};

export default SlideCaseStudy;
