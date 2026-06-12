// ============================================================================
// SlideSegment.jsx — P28/29/30 赛道概览 / Sector Overview Card
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// One generic "single sector at a glance" page, registered THREE times in the
// demo deck with content passed as props — same component, different data:
//   • P28 default      AI Agents     — layout 'media', 1 adaptive image slot
//   • SlideSegment.presetSearch  P29  Enterprise Search — layout 'media'
//   • SlideSegment.presetLegal   P30  Legal AI — layout 'table' (sector splits)
// Exactly the migration model: <SlideSegment {...SlideSegment.presetLegal} />.
//
// Left column: a hero figure + supporting metric cards. Right column adapts:
//   layout 'media' → ADAPTIVE image slots (mediaSlotCount 0..2); 0 swaps the
//                    column for a sector-split panel so it never looks empty.
//   layout 'table' → a structured sector-split table (name / share / bar).
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   segTag                        sector badge (decorative)
//   hero ({value,unit,label})     headline funding figure
//   metrics ({k,v}[])             supporting metric cards
//   splits ({name,en,value,unit}[]) sector breakdown (table / zero-slot panel)
//   mediaPlaceholder              image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   layout (enum)           'media' | 'table'
//   mediaSlotCount (int 0..2) adaptive image slots (media; 0 → split panel)
//   metricCount (int 2..4)  supporting metric cards shown
//   splitCount (int 2..4)   sector-split rows (table / zero-slot panel)
//   focusEnabled (bool)     emphasise one metric card
//   focusIndex (int)        which metric
//   showTagBadge (bool)     sector badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-seg-css')) {
    const css = `
    .kx-seg-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-seg-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-seg-title{font-size:68px;}
    .kx-seg-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-seg-main{flex:1;min-height:0;display:grid;column-gap:64px;padding:30px 0 6px;}
    /* left: badge + hero + metrics */
    .kx-seg-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:56px;}
    .kx-seg-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
    .kx-seg-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
    .kx-seg-hero{margin-top:30px;}
    .kx-seg-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;
      letter-spacing:-.02em;line-height:.82;white-space:nowrap;}
    .kx-seg-hv .kx-n{font-size:210px;color:var(--kx-accent);}
    .kx-seg-hv .kx-u{font-size:58px;color:var(--kx-mute);white-space:nowrap;}
    .kx-seg-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
      letter-spacing:.04em;margin-top:14px;}
    .kx-seg-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
    .kx-seg-mcard{padding:22px 24px 16px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:8px;}
    .kx-seg-mcard:last-child{border-right:none;}
    .kx-seg-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 80%);padding-left:18px;}
    .kx-seg-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
    .kx-seg-mcard.kx-on .kx-mv{color:var(--kx-accent);}
    .kx-seg-mcard .kx-mk{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* right: media column */
    .kx-seg-media{display:flex;flex-direction:column;gap:22px;min-height:0;justify-content:center;}
    .kx-seg-media .kx-imgslot{flex:none;}
    /* right: split table / zero-slot panel */
    .kx-seg-splitwrap{display:flex;flex-direction:column;min-height:0;justify-content:center;}
    .kx-seg-splitcap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;padding-bottom:16px;border-bottom:1px solid var(--kx-line);}
    .kx-seg-srow{display:flex;flex-direction:column;gap:12px;padding:22px 0;border-bottom:1px solid var(--kx-line);}
    .kx-seg-smeta{display:flex;justify-content:space-between;align-items:baseline;gap:20px;}
    .kx-seg-snm{display:flex;flex-direction:column;gap:4px;}
    .kx-seg-snm .kx-sk{font-family:var(--kx-disp);font-weight:800;font-size:34px;line-height:1;letter-spacing:-.01em;}
    .kx-seg-snm .kx-se{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-seg-sv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
    .kx-seg-srow.kx-on .kx-sv,.kx-seg-srow.kx-on .kx-sk{color:var(--kx-accent);}
    .kx-seg-strack{height:14px;background:#26261f;}
    .kx-seg-sfill{height:100%;background:#3a3a32;}
    .kx-seg-srow.kx-on .kx-seg-sfill{background:var(--kx-accent);}
    .kx-seg-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-seg-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-seg-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-seg-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function SlideSegment(props) {
    const p = { ...SlideSegment.defaults, ...props };
    const metrics = p.metrics.slice(0, clamp(p.metricCount, 2, p.metrics.length));
    const fi = clamp(p.focusIndex, 0, metrics.length - 1);
    const slots = p.layout === 'media' ? clamp(p.mediaSlotCount, 0, 2) : 0;
    const showSplit = p.layout === 'table' || (p.layout === 'media' && slots === 0);
    const splits = p.splits.slice(0, clamp(p.splitCount, 2, p.splits.length));
    const maxSplit = Math.max(...splits.map((s) => s.value));
    // grid rebalances with the right column's content
    const mainCols = p.layout === 'table' ? '0.96fr 1.04fr'
      : slots === 0 ? '1.04fr 0.96fr' : '0.94fr 1.06fr';

    const left = h('div', { className: 'kx-seg-left' },
      p.showTagBadge ? h('div', { className: 'kx-seg-badge' }, p.segTag) : null,
      h('div', { className: 'kx-seg-hero', style: p.showTagBadge ? null : { marginTop: 0 } },
        h('div', { className: 'kx-seg-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-seg-hl' }, p.hero.label)),
      h('div', { className: 'kx-seg-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
        metrics.map((m, i) => { const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-seg-mcard' + (on ? ' kx-on' : '') },
            h('span', { className: 'kx-mv' }, m.v),
            h('span', { className: 'kx-mk' }, m.k)); })));

    const splitBlock = h('div', { className: 'kx-seg-splitwrap' },
      h('div', { className: 'kx-seg-splitcap' }, '场景占比 / SEGMENT SPLIT'),
      splits.map((sp, i) => {
        const on = i === 0; // top split carries the accent
        return h('div', { key: i, className: 'kx-seg-srow' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-seg-smeta' },
            h('div', { className: 'kx-seg-snm' },
              h('span', { className: 'kx-sk' }, sp.name),
              h('span', { className: 'kx-se' }, sp.en)),
            h('span', { className: 'kx-sv' }, sp.value + (sp.unit || ''))),
          h('div', { className: 'kx-seg-strack' },
            h('div', { className: 'kx-seg-sfill', style: { width: ((sp.value / maxSplit) * 100) + '%' } })));
      }));

    const media = showSplit ? splitBlock
      : h('div', { className: 'kx-seg-media' },
          Array.from({ length: slots }, (_, i) =>
            h(KxImageSlot, {
              key: i, id: 'segment-' + (p.eyebrowId || 'x') + '-' + i,
              placeholder: p.mediaPlaceholder || '主视觉 / DROP IMAGE',
              badge: slots === 1 ? p.segTag : ('IMG ' + String(i + 1).padStart(2, '0')),
              minRatio: slots === 1 ? 0.82 : 1.3, maxRatio: slots === 1 ? 1.5 : 2.3,
              style: { width: '100%' },
            })));

    const footRt = p.layout === 'table' ? splits.length + ' SEG / TABLE'
      : slots === 0 ? splits.length + ' SEG / SPLIT' : slots + ' IMG / MEDIA';

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-seg-pad' },
        h('div', { className: 'kx-seg-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-seg-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-seg-sub' }, p.subhead)),
        h('div', { className: 'kx-seg-main', style: { gridTemplateColumns: mainCols } }, left, media),
        h('div', { className: 'kx-seg-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, footRt))));
  }

  SlideSegment.defaults = {
    eyebrowId: '28', eyebrowLabel: 'AI AGENTS',
    title: '工作流自动化机会', subhead: 'AI Agent 赛道 / WORKFLOW AUTOMATION',
    closing: '能进入工作流的 Agent 才有长期价值。',
    segTag: 'AI AGENT 赛道 / AGENTS',
    hero: { value: '72', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '16 笔' },
      { k: '平均单笔 / AVG', v: '4.5 亿' },
      { k: 'ARR 中位数 / ARR', v: '4200 万' },
    ],
    splits: [
      { name: '任务执行', en: 'TASK EXECUTION', value: 44, unit: '%' },
      { name: '工作流编排', en: 'ORCHESTRATION', value: 33, unit: '%' },
      { name: '系统集成', en: 'INTEGRATION', value: 23, unit: '%' },
    ],
    mediaPlaceholder: 'Agent 工作流示意 / DROP IMAGE',
    layout: 'media', mediaSlotCount: 1, metricCount: 3, splitCount: 3,
    focusEnabled: true, focusIndex: 2, showTagBadge: true, accent: '#c8f135',
  };

  SlideSegment.controls = [
    { key: 'layout', label: '布局形式', type: 'select', default: 'media',
      options: [['media', '图文'], ['table', '表格']], desc: '右栏的呈现形式：图片主导 / 场景占比表' },
    { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
      desc: '右侧自适应图片槽数量（0 改为场景占比面板；上传后按图片比例自适应，构图随数量重排）', showIf: (p) => p.layout === 'media' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 4, desc: '左侧辅助指标卡数量' },
    { key: 'splitCount', label: '场景档数', type: 'number', default: 3, min: 2, max: 4,
      desc: '场景占比行数（表格或 0 图片面板时生效）', showIf: (p) => p.layout === 'table' || (p.layout === 'media' && p.mediaSlotCount === 0) },
    { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标卡' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 2, min: 0, max: 3, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
    { key: 'showTagBadge', label: '赛道徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角赛道徽标（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P29 知识入口机会 / Enterprise Search — image-led preset (props only).
  SlideSegment.presetSearch = {
    eyebrowId: '29', eyebrowLabel: 'ENTERPRISE SEARCH',
    title: '知识入口机会', subhead: '企业搜索赛道 / KNOWLEDGE ENTRY',
    closing: '企业知识入口是 AI 应用的重要落地点。',
    segTag: '企业搜索赛道 / SEARCH',
    hero: { value: '38', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '9 笔' },
      { k: '平均单笔 / AVG', v: '4.2 亿' },
      { k: '付费客户中位数 / CLIENTS', v: '620 家' },
    ],
    splits: [
      { name: '内部知识库', en: 'KNOWLEDGE BASE', value: 48, unit: '%' },
      { name: '客服支持', en: 'SUPPORT', value: 29, unit: '%' },
      { name: '研发文档', en: 'DEV DOCS', value: 23, unit: '%' },
    ],
    mediaPlaceholder: '知识库入口图 / DROP IMAGE',
    layout: 'media', mediaSlotCount: 1, metricCount: 3, splitCount: 3,
    focusEnabled: true, focusIndex: 2, showTagBadge: true, accent: '#c8f135',
  };

  // P30 专业服务高客单价 / Legal AI — table preset (sector splits, no images).
  SlideSegment.presetLegal = {
    eyebrowId: '30', eyebrowLabel: 'LEGAL AI',
    title: '专业服务高客单价', subhead: '法律 AI 赛道 / LEGAL SERVICES',
    closing: '法律 AI 是垂直应用商业化样本。',
    segTag: '法律 AI 赛道 / LEGAL',
    hero: { value: '26', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '6 笔' },
      { k: '平均单笔 / AVG', v: '4.3 亿' },
      { k: '合同审查占比 / REVIEW', v: '46%' },
    ],
    splits: [
      { name: '合同审查', en: 'CONTRACT REVIEW', value: 46, unit: '%' },
      { name: '合规审查', en: 'COMPLIANCE', value: 24, unit: '%' },
      { name: '诉讼支持', en: 'LITIGATION', value: 18, unit: '%' },
      { name: '法律检索', en: 'LEGAL RESEARCH', value: 12, unit: '%' },
    ],
    mediaPlaceholder: '法律流程图 / DROP IMAGE',
    layout: 'table', mediaSlotCount: 1, metricCount: 3, splitCount: 4,
    focusEnabled: true, focusIndex: 2, showTagBadge: true, accent: '#c8f135',
  };

  // P46 企业流程嵌入 / Low Code AI — image-led preset (props only, component unchanged).
  // Demonstrates the reuse model: <SlideSegment {...SlideSegment.presetLowcode} />.
  SlideSegment.presetLowcode = {
    eyebrowId: '46', eyebrowLabel: 'LOW CODE AI',
    title: '企业流程嵌入', subhead: '低代码 AI 平台 / LOW CODE',
    closing: '能被业务团队使用的平台更容易扩散。',
    segTag: '低代码 AI 赛道 / LOW CODE',
    hero: { value: '19', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '6 笔' },
      { k: '企业客户中位数 / CLIENTS', v: '430 家' },
      { k: '净收入留存 / NRR', v: '118%' },
    ],
    splits: [
      { name: '流程编排', en: 'ORCHESTRATION', value: 41, unit: '%' },
      { name: '模型接入', en: 'MODEL CONNECT', value: 33, unit: '%' },
      { name: '治理审计', en: 'GOVERNANCE', value: 26, unit: '%' },
    ],
    mediaPlaceholder: '流程编排图 / DROP IMAGE',
    layout: 'media', mediaSlotCount: 1, metricCount: 3, splitCount: 3,
    focusEnabled: true, focusIndex: 2, showTagBadge: true, accent: '#c8f135',
  };

export default SlideSegment;
