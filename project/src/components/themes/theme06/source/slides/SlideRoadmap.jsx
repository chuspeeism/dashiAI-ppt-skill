// ============================================================================
// SlideRoadmap.jsx — P79 估值锚重定价 / Watch Timeline (timeline_page, reusable)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "phased watch timeline / roadmap" page. N phase nodes are laid out
// along a single horizontal axis (period chip above the axis dot, milestone +
// note below); one node can be pulled out as a lime focus phase. A bottom band
// pairs a WATCH-LIST of entities (wordmark chips) with a WATCH-METRICS row of
// mono stat tags. `layout` switches the same data between a horizontal axis and
// a vertical numbered step list. In the demo deck it renders P79 估值锚重定价
// (IPO 观察窗口); reusable for any "phases over time + what to watch" page.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   watchTag                         right header badge (decorative)
//   thesis (html)                    the lead statement (display type, <b> = lime)
//   railCaption                      timeline caption
//   phases ({when,name,en,note}[])   timeline phase nodes
//   watchCaption                     watch-list caption
//   watchList ({name,tag}[])         entities to watch (wordmark chips)
//   metricCaption                    watch-metrics caption
//   metrics ({k,v}[])                watch indicators (stat tags)
//   footRight                        mono caption at the foot-right (decorative)
// PROPS (visual — all map 1:1 to .controls)
//   phaseCount (int 3..5)     timeline phase nodes shown
//   layout (enum)             'timeline' | 'stack'  axis vs numbered steps
//   watchCount (int 0..4)     watch-list entity chips (0 hides the rail)
//   metricCount (int 0..4)    watch-metric tags (0 hides the row)
//   focusEnabled (bool)       pull one phase out as the lime focus
//   focusIndex (int)          which phase
//   showAxis (bool)           connecting axis line + dots (decorative, timeline)
//   showMarkers (bool)        big ghost phase index numbers (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-rmp-css')) {
  const css = `
  .kx-rmp-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-rmp-head{display:flex;justify-content:space-between;align-items:flex-end;gap:48px;
    padding-bottom:22px;border-bottom:1px solid var(--kx-line);}
  .kx-rmp-title{font-size:64px;}
  .kx-rmp-sub{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.04em;
    margin-top:14px;text-transform:uppercase;}
  .kx-rmp-tag{font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--kx-mute-2);text-align:right;white-space:nowrap;}
  .kx-rmp-tag b{color:var(--kx-accent);}

  .kx-rmp-thesis{font-family:var(--kx-disp);font-weight:800;font-size:40px;line-height:1.16;letter-spacing:-.01em;
    margin:26px 0 4px;max-width:1500px;text-wrap:pretty;}
  .kx-rmp-thesis b{color:var(--kx-accent);}

  /* ---- horizontal timeline (hero) ---- */
  .kx-rmp-track{flex:1;min-height:0;position:relative;display:flex;align-items:stretch;margin-top:14px;}
  .kx-rmp-axis{position:absolute;left:0;right:0;top:104px;height:3px;
    background:linear-gradient(90deg,var(--kx-accent) 0 60%,rgba(255,255,255,.14) 60% 100%);
    background-color:rgba(255,255,255,.14);}
  .kx-rmp-axis::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);
    width:0;height:0;border-left:14px solid var(--kx-accent);
    border-top:8px solid transparent;border-bottom:8px solid transparent;}
  .kx-rmp-nodes{position:relative;flex:1;min-height:0;display:grid;}
  .kx-rmp-node{position:relative;padding:0 28px;display:flex;flex-direction:column;align-items:flex-start;
    border-left:1px solid var(--kx-line);}
  .kx-rmp-node:first-child{border-left:none;padding-left:4px;}
  .kx-rmp-ghost{position:absolute;right:18px;top:-14px;font-family:var(--kx-disp);font-weight:900;
    font-size:150px;line-height:.7;letter-spacing:-.05em;color:currentColor;opacity:.05;pointer-events:none;}
  .kx-rmp-when{font-family:var(--kx-mono);font-size:22px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    color:var(--kx-cream);border:1px solid var(--kx-line);padding:8px 15px;border-bottom:3px solid var(--kx-accent);
    height:62px;display:inline-flex;align-items:center;}
  .kx-rmp-dot{width:26px;height:26px;border-radius:50%;background:var(--kx-ink);border:3px solid var(--kx-accent);
    margin:30px 0 0 4px;position:relative;z-index:2;flex:none;}
  .kx-rmp-body{margin-top:34px;display:flex;flex-direction:column;gap:9px;}
  .kx-rmp-nm{font-family:var(--kx-disp);font-weight:900;font-size:40px;line-height:.98;letter-spacing:-.005em;}
  .kx-rmp-en{font-family:var(--kx-mono);font-size:19px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;}
  .kx-rmp-note{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute);line-height:1.4;text-wrap:pretty;margin-top:4px;}

  .kx-rmp-node.kx-on .kx-rmp-when{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
  .kx-rmp-node.kx-on .kx-rmp-dot{background:var(--kx-accent);width:32px;height:32px;margin-top:27px;
    box-shadow:0 0 0 6px rgba(200,241,53,.18);}
  .kx-rmp-node.kx-on .kx-rmp-nm{color:var(--kx-accent);}

  /* ---- stack layout (vertical numbered steps) ---- */
  .kx-rmp-steps{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px;margin-top:18px;justify-content:center;}
  .kx-rmp-step{border-radius:16px;border:1px solid var(--kx-line);background:rgba(255,255,255,.035);
    padding:18px 26px;display:flex;align-items:center;gap:26px;}
  .kx-rmp-step.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);color:var(--kx-ink);}
  .kx-rmp-step .kx-si{font-family:var(--kx-disp);font-weight:900;font-size:34px;line-height:.8;letter-spacing:-.03em;
    color:var(--kx-mute-2);min-width:54px;}
  .kx-rmp-step.kx-on .kx-si{color:var(--kx-ink);opacity:.55;}
  .kx-rmp-step .kx-sw{font-family:var(--kx-mono);font-size:21px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;
    min-width:150px;color:var(--kx-cream);}
  .kx-rmp-step.kx-on .kx-sw{color:var(--kx-ink);}
  .kx-rmp-step .kx-snm{display:flex;flex-direction:column;gap:3px;min-width:0;}
  .kx-rmp-step .kx-snm .kx-sk{font-family:var(--kx-disp);font-weight:900;font-size:32px;line-height:1;letter-spacing:-.01em;}
  .kx-rmp-step .kx-snm .kx-se{font-family:var(--kx-mono);font-size:17px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-rmp-step.kx-on .kx-snm .kx-se{color:rgba(12,12,12,.6);}
  .kx-rmp-step .kx-snote{margin-left:auto;font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute);
    max-width:520px;text-align:right;line-height:1.36;text-wrap:pretty;}
  .kx-rmp-step.kx-on .kx-snote{color:rgba(12,12,12,.72);}

  /* ---- bottom band: watch-list + metrics ---- */
  .kx-rmp-band{display:grid;grid-template-columns:1.15fr 1fr;column-gap:54px;
    padding-top:22px;margin-top:20px;border-top:1px solid var(--kx-line);}
  .kx-rmp-bcol{display:flex;flex-direction:column;gap:14px;min-width:0;}
  .kx-rmp-bcol.kx-r{border-left:1px solid var(--kx-line);padding-left:54px;}
  .kx-rmp-cap{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;
    display:flex;align-items:center;gap:12px;}
  .kx-rmp-cap::before{content:'';width:9px;height:9px;background:var(--kx-accent);transform:rotate(45deg);flex:none;}
  .kx-rmp-cos{display:flex;flex-wrap:wrap;gap:12px;}
  .kx-rmp-co{display:inline-flex;align-items:baseline;gap:11px;border:1px solid var(--kx-line);
    background:rgba(255,255,255,.035);padding:11px 18px;}
  .kx-rmp-co .kx-con{font-family:var(--kx-disp);font-weight:900;font-size:28px;letter-spacing:-.01em;}
  .kx-rmp-co .kx-cot{font-family:var(--kx-mono);font-size:16px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  .kx-rmp-mets{display:grid;grid-template-columns:repeat(2,1fr);gap:12px 24px;}
  .kx-rmp-met{display:flex;flex-direction:column;gap:5px;border-left:2px solid var(--kx-accent);padding-left:14px;}
  .kx-rmp-met .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:30px;line-height:1;letter-spacing:-.01em;color:var(--kx-accent);}
  .kx-rmp-met .kx-mk{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}

  .kx-rmp-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;margin-top:20px;border-top:1px solid var(--kx-line);}
  .kx-rmp-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-rmp-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  `;
  const s = document.createElement('style'); s.id = 'kx-rmp-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideRoadmap(props) {
  const p = { ...SlideRoadmap.defaults, ...props };
  const phases = p.phases.slice(0, clamp(p.phaseCount, 3, p.phases.length));
  const fi = clamp(p.focusIndex, 0, phases.length - 1);
  const watch = p.watchList.slice(0, clamp(p.watchCount, 0, p.watchList.length));
  const mets = p.metrics.slice(0, clamp(p.metricCount, 0, p.metrics.length));
  const stack = p.layout === 'stack';

  // ---- horizontal timeline -------------------------------------------
  const timeline = h('div', { className: 'kx-rmp-track' },
    p.showAxis ? h('div', { className: 'kx-rmp-axis' }) : null,
    h('div', { className: 'kx-rmp-nodes', style: { gridTemplateColumns: `repeat(${phases.length},1fr)` } },
      phases.map((n, i) => {
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-rmp-node' + (on ? ' kx-on' : '') },
          p.showMarkers ? h('div', { className: 'kx-rmp-ghost' }, String(i + 1).padStart(2, '0')) : null,
          h('div', { className: 'kx-rmp-when' }, n.when),
          h('div', { className: 'kx-rmp-dot' }),
          h('div', { className: 'kx-rmp-body' },
            h('div', { className: 'kx-rmp-nm' }, n.name),
            n.en ? h('div', { className: 'kx-rmp-en' }, n.en) : null,
            n.note ? h('div', { className: 'kx-rmp-note' }, n.note) : null));
      })));

  // ---- vertical numbered steps ----------------------------------------
  const steps = h('div', { className: 'kx-rmp-steps' },
    phases.map((n, i) => {
      const on = p.focusEnabled && i === fi;
      return h('div', { key: i, className: 'kx-rmp-step' + (on ? ' kx-on' : '') },
        h('span', { className: 'kx-si' }, String(i + 1).padStart(2, '0')),
        h('span', { className: 'kx-sw' }, n.when),
        h('div', { className: 'kx-snm' },
          h('span', { className: 'kx-sk' }, n.name),
          n.en ? h('span', { className: 'kx-se' }, n.en) : null),
        n.note ? h('div', { className: 'kx-snote' }, n.note) : null);
    }));

  // ---- bottom band ----------------------------------------------------
  const band = (watch.length || mets.length) ? h('div', { className: 'kx-rmp-band' },
    h('div', { className: 'kx-rmp-bcol' },
      h('div', { className: 'kx-rmp-cap' }, p.watchCaption),
      h('div', { className: 'kx-rmp-cos' },
        watch.map((w, i) => h('div', { key: i, className: 'kx-rmp-co' },
          h('span', { className: 'kx-con' }, w.name),
          w.tag ? h('span', { className: 'kx-cot' }, w.tag) : null)))),
    mets.length ? h('div', { className: 'kx-rmp-bcol kx-r' },
      h('div', { className: 'kx-rmp-cap' }, p.metricCaption),
      h('div', { className: 'kx-rmp-mets' },
        mets.map((m, i) => h('div', { key: i, className: 'kx-rmp-met' },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k))))) : null) : null;

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-rmp-pad' },
      h('div', { className: 'kx-rmp-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-rmp-title', style: { marginTop: '16px' } }, p.title),
          h('div', { className: 'kx-rmp-sub' }, p.subhead)),
        h('div', { className: 'kx-rmp-tag' }, p.watchTag ? h('b', null, p.watchTag) : p.eyebrowLabel)),
      h('div', { className: 'kx-rmp-thesis', dangerouslySetInnerHTML: { __html: p.thesis } }),
      stack ? steps : timeline,
      band,
      h('div', { className: 'kx-rmp-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, p.footRight || (phases.length + ' PHASES · ' + (stack ? 'STEPS' : 'TIMELINE'))))));
}

SlideRoadmap.defaults = {
  eyebrowId: '79', eyebrowLabel: 'IPO WATCH',
  title: '估值锚重定价', subhead: '策略 · 观察 IPO 窗口 / IPO WINDOW',
  closing: '公开市场会重新定价 AI 叙事。',
  watchTag: 'STRATEGY · IPO 观察',
  thesis: '头部公司的 IPO 表现，将重新定价整个 AI <b>一级市场的估值锚</b>——上市后承压，预期会同步下修。',
  railCaption: 'IPO 观察时间轴 / WATCH TIMELINE',
  phases: [
    { when: '2025 H1', name: '窗口试探', en: 'WINDOW TEST', note: '头部公司启动上市筹备，测试公开市场情绪。' },
    { when: '2025 H2', name: '首批挂牌', en: 'FIRST LISTINGS', note: '基础设施类标的率先挂牌，估值锚初步形成。' },
    { when: '2026', name: '集中上市', en: 'IPO WAVE', note: '模型与数据平台公司密集进入公开市场。' },
    { when: '2027', name: '估值回归', en: 'REPRICE', note: '一级市场对标公开估值，叙事溢价被重新定价。' },
  ],
  watchCaption: '观察对象 / WATCH-LIST',
  watchList: [
    { name: 'OpenAI', tag: '通用模型' },
    { name: 'Anthropic', tag: '安全模型' },
    { name: 'Databricks', tag: '数据平台' },
    { name: 'CoreWeave', tag: 'GPU 云' },
  ],
  metricCaption: '观察指标 / WATCH METRICS',
  metrics: [
    { k: '上市表现 / DEBUT', v: '锚' },
    { k: '收入增速 / GROWTH', v: '↑' },
    { k: '毛利率 / MARGIN', v: '%' },
    { k: '云成本占比 / COMPUTE', v: '↓' },
  ],
  footRight: '4 PHASES · TIMELINE',
  phaseCount: 4, layout: 'timeline', watchCount: 4, metricCount: 4,
  focusEnabled: true, focusIndex: 2, showAxis: true, showMarkers: true, accent: '#c8f135',
};

// P90 2025 里程碑节奏 — reuse this timeline via a preset passed as props.
// Migration: any host can render <SlideRoadmap {...SlideRoadmap.presetSignals} />.
SlideRoadmap.presetSignals = {
  eyebrowId: '90', eyebrowLabel: 'MILESTONES 2025',
  title: '2025 里程碑节奏', subhead: '前瞻 · 按季度的关键节点 / KEY MILESTONES',
  closing: '按节点跟踪，而不是按头条跟踪。',
  watchTag: 'OUTLOOK · 节点节奏',
  thesis: '把 2025 拆成四个可验证的节点——每个节点都对应一次<b>叙事被收入与算力检验</b>的时刻。',
  railCaption: '里程碑时间轴 / MILESTONE TIMELINE',
  phases: [
    { when: '2025 Q1', name: '预算落地', en: 'BUDGETS SET', note: '企业 AI 预算定档，确定性算力支出开始释放。' },
    { when: '2025 Q2', name: '收入验证', en: 'REVENUE PROOF', note: '应用层公布留存与续约，试点能否转稳定收入见分晓。' },
    { when: '2025 H2', name: '上市试探', en: 'IPO TEST', note: '头部标的试探公开市场，估值锚开始形成。' },
    { when: '2026E', name: '壁垒分化', en: 'MOATS DIVERGE', note: '有兑现的与靠叙事的公司在融资难度上明显分层。' },
  ],
  watchCaption: '观察对象 / WATCH-LIST',
  watchList: [
    { name: 'OpenAI', tag: '通用模型' },
    { name: 'Anthropic', tag: '安全模型' },
    { name: 'CoreWeave', tag: 'GPU 云' },
    { name: 'Databricks', tag: '数据平台' },
  ],
  metricCaption: '观察指标 / WATCH METRICS',
  metrics: [
    { k: '续约率 / RENEWAL', v: '↑' },
    { k: '净留存 / NRR', v: '%' },
    { k: '算力占比 / COMPUTE', v: '↓' },
    { k: '上市表现 / DEBUT', v: '锚' },
  ],
  footRight: '4 MILESTONES · 2025',
  phaseCount: 4, layout: 'timeline', watchCount: 4, metricCount: 4,
  focusEnabled: true, focusIndex: 1, showAxis: true, showMarkers: true, accent: '#c8f135',
};

SlideRoadmap.controls = [
  { key: 'phaseCount', label: '阶段数量', type: 'number', default: 4, min: 3, max: 5, desc: '时间轴阶段节点数量' },
  { key: 'layout', label: '时间轴形态', type: 'select', default: 'timeline',
    options: [['timeline', '横向轴'], ['stack', '纵向步骤']], desc: '同一组阶段：横向时间轴 / 纵向编号步骤' },
  { key: 'watchCount', label: '观察对象数量', type: 'number', default: 4, min: 0, max: 4, desc: '底部观察对象芯片数量（0 隐藏整列）' },
  { key: 'metricCount', label: '观察指标数量', type: 'number', default: 4, min: 0, max: 4, desc: '底部观察指标标签数量（0 隐藏整列）' },
  { key: 'focusEnabled', label: '重点阶段高亮', type: 'toggle', default: true, desc: '是否把某一阶段拉成 lime 强调' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 2, min: 0, max: 4, desc: '被突出的阶段序号', showIf: (p) => p.focusEnabled },
  { key: 'showAxis', label: '连接轴线', type: 'toggle', default: true, desc: '显示/隐藏连接轴线与节点圆点（装饰，仅横向轴）', showIf: (p) => p.layout === 'timeline' },
  { key: 'showMarkers', label: '阶段大号编号', type: 'toggle', default: true, desc: '显示/隐藏每个阶段背景的大号编号（装饰，仅横向轴）', showIf: (p) => p.layout === 'timeline' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

export default SlideRoadmap;
