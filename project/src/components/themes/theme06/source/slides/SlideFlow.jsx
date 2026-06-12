// ============================================================================
// SlideFlow.jsx — P34 企业 AI 底座 / Data-Flow Pipeline
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "left-to-right process / data-flow" page: N stage nodes connected by
// arrow gutters form a pipeline, with a stats band (hero figure + metrics + a
// growth callout) underneath. One stage can be accented as the focus. chartType
// switches a horizontal flow ↔ a vertical numbered stepper (same data).
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   stages ({name,en,tag}[])     pipeline nodes
//   hero ({value,unit,label})    headline funding figure
//   growth ({value,label})       growth callout (decorative data)
//   metrics ({k,v}[])            supporting metric cards
// PROPS (visual — all map 1:1 to .controls)
//   chartType (enum)        'flow' | 'steps'
//   stageCount (int 3..5)   pipeline nodes shown
//   metricCount (int 2..3)  supporting metric cards
//   focusEnabled (bool)     emphasise one stage
//   focusIndex (int)        which stage
//   showConnectors (bool)   arrow gutters / step rail (decorative)
//   showGrowth (bool)       growth callout (decorative data)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-flw-css')) {
    const css = `
    .kx-flw-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-flw-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-flw-title{font-size:68px;}
    .kx-flw-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-flw-main{flex:1;min-height:0;display:flex;flex-direction:column;padding:26px 0 6px;gap:30px;}
    .kx-flw-cap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    /* horizontal flow */
    .kx-flw-pipe{flex:1;min-height:0;display:flex;align-items:stretch;gap:0;}
    .kx-flw-node{flex:1;display:flex;flex-direction:column;justify-content:space-between;
      border:1px solid var(--kx-line);border-top:3px solid var(--kx-mute-2);padding:26px 26px 24px;
      background:rgba(255,255,255,.015);min-width:0;}
    .kx-flw-node.kx-on{border-color:var(--kx-accent);border-top-color:var(--kx-accent);
      background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 13%,transparent),transparent 80%);}
    .kx-flw-idx{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;}
    .kx-flw-node.kx-on .kx-flw-idx{color:var(--kx-accent);}
    .kx-flw-nm{font-family:var(--kx-disp);font-weight:900;font-size:46px;line-height:1.02;letter-spacing:.01em;margin-top:18px;}
    .kx-flw-en{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.03em;margin-top:8px;}
    .kx-flw-tag{font-family:var(--kx-mono);font-size:23px;letter-spacing:.02em;margin-top:auto;padding-top:22px;
      color:var(--kx-cream);opacity:.78;}
    .kx-flw-node.kx-on .kx-flw-tag{color:var(--kx-accent);opacity:1;}
    .kx-flw-conn{flex:none;width:64px;display:flex;align-items:center;justify-content:center;position:relative;}
    .kx-flw-conn::before{content:'';position:absolute;left:0;right:0;top:50%;height:2px;
      background:repeating-linear-gradient(90deg,var(--kx-mute-2) 0 8px,transparent 8px 16px);opacity:.5;}
    .kx-flw-chev{display:grid;grid-template-columns:repeat(3,7px);gap:3px;z-index:1;background:var(--kx-ink);padding:0 6px;}
    .kx-flw-chev i{width:7px;height:7px;background:var(--kx-accent);display:block;}
    /* vertical steps */
    .kx-flw-steps{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
    .kx-flw-step{display:grid;grid-template-columns:96px 1fr;align-items:center;gap:0;
      border-top:1px solid var(--kx-line);}
    .kx-flw-step:last-child{border-bottom:1px solid var(--kx-line);}
    .kx-flw-sidx{font-family:var(--kx-disp);font-weight:900;font-size:60px;color:var(--kx-mute-2);
      line-height:1;letter-spacing:-.02em;}
    .kx-flw-step.kx-on .kx-flw-sidx{color:var(--kx-accent);}
    .kx-flw-sbody{display:flex;align-items:baseline;justify-content:space-between;gap:30px;padding:22px 0;}
    .kx-flw-snm{font-family:var(--kx-disp);font-weight:900;font-size:44px;letter-spacing:.01em;}
    .kx-flw-step.kx-on .kx-flw-snm{color:var(--kx-accent);}
    .kx-flw-sen{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-flw-stag{font-family:var(--kx-mono);font-size:23px;color:var(--kx-cream);opacity:.7;text-align:right;white-space:nowrap;}
    /* stats band */
    .kx-flw-stats{flex:none;display:grid;column-gap:0;border-top:1px solid var(--kx-line);}
    .kx-flw-hero{border-right:1px solid var(--kx-line);padding:22px 36px 6px 0;display:flex;flex-direction:column;gap:8px;}
    .kx-flw-hv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:1;white-space:nowrap;}
    .kx-flw-hv .kx-n{font-size:104px;color:var(--kx-accent);}
    .kx-flw-hv .kx-u{font-size:40px;color:var(--kx-mute);white-space:nowrap;}
    .kx-flw-hl{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:4px;}
    .kx-flw-mcard{border-right:1px solid var(--kx-line);padding:22px 30px 6px;display:flex;flex-direction:column;gap:8px;justify-content:flex-end;}
    .kx-flw-mcard:last-child{border-right:none;}
    .kx-flw-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:64px;line-height:.9;letter-spacing:-.02em;}
    .kx-flw-mcard.kx-grow .kx-mv{color:var(--kx-accent);}
    .kx-flw-mcard .kx-mk{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    .kx-flw-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-flw-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-flw-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-flw-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function SlideFlow(props) {
    const p = { ...SlideFlow.defaults, ...props };
    const stages = p.stages.slice(0, clamp(p.stageCount, 3, p.stages.length));
    const fi = clamp(p.focusIndex, 0, stages.length - 1);
    const metrics = p.metrics.slice(0, clamp(p.metricCount, 2, p.metrics.length));
    const chev = h('span', { className: 'kx-flw-chev' }, h('i'), h('i'), h('i'));

    const pipe = p.chartType === 'steps'
      ? h('div', { className: 'kx-flw-steps' },
          stages.map((st, i) => { const on = p.focusEnabled && i === fi;
            return h('div', { key: i, className: 'kx-flw-step' + (on ? ' kx-on' : '') },
              h('div', { className: 'kx-flw-sidx' }, String(i + 1).padStart(2, '0')),
              h('div', { className: 'kx-flw-sbody' },
                h('div', null,
                  h('div', { className: 'kx-flw-snm' }, st.name),
                  h('div', { className: 'kx-flw-sen' }, st.en)),
                st.tag ? h('div', { className: 'kx-flw-stag' }, st.tag) : null)); }))
      : h('div', { className: 'kx-flw-pipe' },
          stages.map((st, i) => { const on = p.focusEnabled && i === fi;
            const node = h('div', { key: 'n' + i, className: 'kx-flw-node' + (on ? ' kx-on' : '') },
              h('div', { className: 'kx-flw-idx' }, 'STAGE ' + String(i + 1).padStart(2, '0')),
              h('div', null,
                h('div', { className: 'kx-flw-nm' }, st.name),
                h('div', { className: 'kx-flw-en' }, st.en)),
              st.tag ? h('div', { className: 'kx-flw-tag' }, st.tag) : null);
            if (i === stages.length - 1) return node;
            return [node, p.showConnectors ? h('div', { key: 'c' + i, className: 'kx-flw-conn' }, chev) : h('div', { key: 'c' + i, style: { width: '24px', flex: 'none' } })];
          }));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-flw-pad' },
        h('div', { className: 'kx-flw-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-flw-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-flw-sub' }, p.subhead)),
        h('div', { className: 'kx-flw-main' },
          h('div', { className: 'kx-flw-cap' }, '数据流 / DATA PIPELINE'),
          pipe,
          h('div', { className: 'kx-flw-stats',
            style: { gridTemplateColumns: `1.1fr repeat(${metrics.length + (p.showGrowth ? 1 : 0)},1fr)` } },
            h('div', { className: 'kx-flw-hero' },
              h('div', { className: 'kx-flw-hv' },
                h('span', { className: 'kx-n' }, p.hero.value),
                p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
              h('div', { className: 'kx-flw-hl' }, p.hero.label)),
            metrics.map((m, i) => h('div', { key: i, className: 'kx-flw-mcard' },
              h('span', { className: 'kx-mv' }, m.v),
              h('span', { className: 'kx-mk' }, m.k))),
            p.showGrowth ? h('div', { className: 'kx-flw-mcard kx-grow' },
              h('span', { className: 'kx-mv' }, p.growth.value),
              h('span', { className: 'kx-mk' }, p.growth.label)) : null)),
        h('div', { className: 'kx-flw-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, stages.length + ' 段 / ' + p.chartType.toUpperCase()))));
  }

  SlideFlow.defaults = {
    eyebrowId: '34', eyebrowLabel: 'DATA INFRASTRUCTURE',
    title: '企业 AI 底座', subhead: '数据基础设施 / DATA INFRASTRUCTURE',
    closing: '没有数据底座，AI 应用很难稳定落地。',
    stages: [
      { name: '数据接入', en: 'DATA INGEST', tag: '多源采集' },
      { name: '向量化存储', en: 'VECTOR STORE', tag: '索引 / 检索' },
      { name: '训练 / RAG', en: 'TRAIN & RAG', tag: '模型对接' },
      { name: '企业应用', en: 'APPLICATIONS', tag: '业务落地' },
    ],
    hero: { value: '61', unit: '亿$', label: '赛道融资额 / FUNDING' },
    growth: { value: '+47%', label: '企业客户增长 / GROWTH' },
    metrics: [
      { k: '事件数 / DEALS', v: '12 笔' },
      { k: '平均单笔 / AVG', v: '5.1 亿' },
    ],
    chartType: 'flow', stageCount: 4, metricCount: 2,
    focusEnabled: true, focusIndex: 1, showConnectors: true, showGrowth: true, accent: '#c8f135',
  };

  SlideFlow.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'flow',
      options: [['flow', '横向流程'], ['steps', '纵向步骤']], desc: '数据流的可视化形式' },
    { key: 'stageCount', label: '环节数量', type: 'number', default: 4, min: 3, max: 5, desc: '流程环节节点数量' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 2, max: 3, desc: '底部辅助指标卡数量' },
    { key: 'focusEnabled', label: '重点环节高亮', type: 'toggle', default: true, desc: '是否突出某一流程环节' },
    { key: 'focusIndex', label: '高亮第几环', type: 'number', default: 1, min: 0, max: 4, desc: '被突出的环节序号', showIf: (p) => p.focusEnabled },
    { key: 'showConnectors', label: '连接箭头', type: 'toggle', default: true, desc: '显示/隐藏环节之间的连接箭头（装饰，仅横向流程）', showIf: (p) => p.chartType === 'flow' },
    { key: 'showGrowth', label: '增长指标', type: 'toggle', default: true, desc: '显示/隐藏底部增长指标卡（装饰数据）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P48 安全与对齐工具 / Model Alignment — flow preset (props only, component unchanged).
  // Demonstrates the reuse model: <SlideFlow {...SlideFlow.presetSafety} />.
  SlideFlow.presetSafety = {
    eyebrowId: '48', eyebrowLabel: 'MODEL ALIGNMENT',
    title: '安全与对齐工具', subhead: '模型安全公司 / MODEL ALIGNMENT',
    closing: '可信 AI 会成为企业级 AI 的基础设施。',
    stages: [
      { name: '模型评测', en: 'EVALUATION', tag: '基准 / 8 亿' },
      { name: '对齐工具', en: 'ALIGNMENT', tag: '价值对齐 / 7 亿' },
      { name: '红队测试', en: 'RED TEAM', tag: '对抗探测 / 6 亿' },
      { name: '合规监测', en: 'COMPLIANCE', tag: '持续监控' },
    ],
    hero: { value: '21', unit: '亿$', label: '赛道融资额 / FUNDING' },
    growth: { value: '+0', label: '—' },
    metrics: [
      { k: '事件数 / DEALS', v: '5 笔' },
      { k: '平均单笔 / AVG', v: '4.2 亿' },
      { k: '评测平台 / EVAL', v: '8 亿' },
    ],
    chartType: 'flow', stageCount: 4, metricCount: 3,
    focusEnabled: true, focusIndex: 1, showConnectors: true, showGrowth: false, accent: '#c8f135',
  };

export default SlideFlow;
