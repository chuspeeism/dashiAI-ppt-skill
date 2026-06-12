// ============================================================================
// SlideTimeline.jsx — P20 理性回落季度 / Stage-Axis Period Card
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "single period on a stage axis" page: an oversized period token +
// hero figure + a directional change pill on the left, and a horizontal stage
// timeline on the right whose nodes carry a value bar (so a rise-and-fall reads
// at a glance). Node count, the value track, and the focused node are all
// generic visual params. Used here for a quarter pullback (Q1→Q4) but works for
// any ordered progression.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   periodLabel,periodCaption                      content — big token + caption
//   hero ({value,unit,label})                      content — hero figure
//   delta ({value,dir:'up'|'down'|'flat',label})   content — change pill
//   metrics ({k,v}[])                              content — supporting metrics
//   nodes ({when,value,name,note}[])               content — stage nodes (ordered)
//   nodeCount (int 2..4)    VISUAL  stage nodes shown
//   metricCount (int 1..2)  VISUAL  supporting metrics shown
//   showDelta (bool)        VISUAL  directional change pill (decorative data)
//   showTrack (bool)        VISUAL  per-node value bars + connecting track
//   focusEnabled (bool)     VISUAL  emphasise one node (usually = this period)
//   focusIndex (int)        VISUAL  which node
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-tml-css')) {
    const css = `
    .kx-tml-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-tml-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-tml-title{font-size:68px;}
    .kx-tml-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-tml-main{flex:1;min-height:0;display:grid;grid-template-columns:0.82fr 1.18fr;column-gap:60px;padding:32px 0 8px;}
    /* left */
    .kx-tml-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:54px;}
    .kx-tml-token{font-family:var(--kx-disp);font-weight:900;font-size:220px;line-height:.78;letter-spacing:-.03em;
      color:var(--kx-accent);margin:-8px 0 0 -6px;}
    .kx-tml-tcap{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:6px;}
    .kx-tml-delta{display:inline-flex;align-items:center;gap:12px;margin-top:26px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:30px;font-weight:700;padding:10px 18px;
      background:var(--kx-accent);color:var(--kx-ink);letter-spacing:.02em;}
    .kx-tml-delta.kx-down{background:#ff5a3c;color:#fff;}
    .kx-tml-delta.kx-flat{background:rgba(255,255,255,.06);color:var(--kx-mute);}
    .kx-tml-delta .kx-dl{font-size:22px;font-weight:400;opacity:.72;text-transform:uppercase;}
    .kx-tml-hero{margin-top:auto;}
    .kx-tml-hv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;letter-spacing:-.02em;line-height:.86;}
    .kx-tml-hv .kx-n{font-size:128px;}
    .kx-tml-hv .kx-u{font-size:42px;color:var(--kx-mute);}
    .kx-tml-hl{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;margin-top:10px;}
    .kx-tml-mrow{display:flex;gap:40px;margin-top:22px;}
    .kx-tml-mrow .kx-mi{display:flex;flex-direction:column;gap:5px;}
    .kx-tml-mrow .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:42px;line-height:.9;letter-spacing:-.02em;}
    .kx-tml-mrow .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* right: stage axis */
    .kx-tml-right{display:flex;flex-direction:column;min-height:0;}
    .kx-tml-axiscap{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;margin-bottom:8px;}
    .kx-tml-stage{flex:1;min-height:0;display:grid;align-items:end;gap:24px;}
    .kx-tml-node{display:flex;flex-direction:column;height:100%;justify-content:flex-end;gap:0;position:relative;}
    .kx-tml-bar{width:100%;background:#34342f;border-radius:4px 4px 0 0;min-height:8px;position:relative;}
    .kx-tml-node.kx-on .kx-tml-bar{background:var(--kx-accent);}
    .kx-tml-bv{position:absolute;top:-40px;left:0;font-family:var(--kx-disp);font-weight:800;font-size:34px;letter-spacing:-.01em;color:var(--kx-cream);}
    .kx-tml-node.kx-on .kx-tml-bv{color:var(--kx-accent);}
    .kx-tml-nbody{border-top:2px solid var(--kx-line);padding-top:16px;margin-top:14px;display:flex;flex-direction:column;gap:7px;}
    .kx-tml-node.kx-on .kx-tml-nbody{border-top-color:var(--kx-accent);}
    .kx-tml-dot{position:absolute;left:0;width:16px;height:16px;border-radius:50%;background:var(--kx-ink);
      border:2px solid var(--kx-mute-2);transform:translateY(13px);z-index:1;}
    .kx-tml-node.kx-on .kx-tml-dot{background:var(--kx-accent);border-color:var(--kx-accent);}
    .kx-tml-when{font-family:var(--kx-disp);font-weight:900;font-size:36px;letter-spacing:.01em;line-height:1;}
    .kx-tml-nnm{font-family:var(--kx-mono);font-size:22px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--kx-mute);}
    .kx-tml-node.kx-on .kx-tml-nnm{color:var(--kx-accent);}
    .kx-tml-nnote{font-family:var(--kx-disp);font-weight:500;font-size:22px;line-height:1.35;color:var(--kx-mute-2);max-width:280px;}
    .kx-tml-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-tml-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-tml-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-tml-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const ARROW = { up: '▲', down: '▼', flat: '→' };

  function SlideTimeline(props) {
    const p = { ...SlideTimeline.defaults, ...props };
    const nodes = p.nodes.slice(0, Math.max(2, Math.min(p.nodeCount, p.nodes.length)));
    const metrics = p.metrics.slice(0, Math.max(1, Math.min(p.metricCount, p.metrics.length)));
    const fi = Math.min(p.focusIndex, nodes.length - 1);
    const maxV = Math.max(...nodes.map((n) => n.value));
    const d = p.delta || {};

    const left = h('div', { className: 'kx-tml-left' },
      h('div', { className: 'kx-tml-token' }, p.periodLabel),
      h('div', { className: 'kx-tml-tcap' }, p.periodCaption),
      p.showDelta && d.value ? h('div', { className: 'kx-tml-delta' + (d.dir === 'down' ? ' kx-down' : d.dir === 'flat' ? ' kx-flat' : '') },
        h('span', null, ARROW[d.dir] || '→'),
        h('span', null, d.value),
        d.label ? h('span', { className: 'kx-dl' }, d.label) : null) : null,
      h('div', { className: 'kx-tml-hero' },
        h('div', { className: 'kx-tml-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-tml-hl' }, p.hero.label),
        h('div', { className: 'kx-tml-mrow' },
          metrics.map((m, i) => h('div', { key: i, className: 'kx-mi' },
            h('span', { className: 'kx-mv' }, m.v),
            h('span', { className: 'kx-mk' }, m.k))))));

    const right = h('div', { className: 'kx-tml-right' },
      h('div', { className: 'kx-tml-axiscap' }, '季度演进 / QUARTERLY PROGRESSION'),
      h('div', { className: 'kx-tml-stage', style: { gridTemplateColumns: `repeat(${nodes.length},1fr)` } },
        nodes.map((n, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-tml-node' + (on ? ' kx-on' : '') },
            p.showTrack ? h('div', { className: 'kx-tml-bar', style: { height: Math.max(8, (n.value / maxV) * 100) + '%' } },
              h('span', { className: 'kx-tml-bv' }, n.value)) : null,
            h('div', { className: 'kx-tml-nbody' },
              p.showTrack ? h('div', { className: 'kx-tml-dot' }) : null,
              h('div', { className: 'kx-tml-when' }, n.when),
              h('div', { className: 'kx-tml-nnm' }, n.name),
              h('div', { className: 'kx-tml-nnote' }, n.note)));
        })));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-tml-pad' },
        h('div', { className: 'kx-tml-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-tml-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-tml-sub' }, p.subhead)),
        h('div', { className: 'kx-tml-main' }, left, right),
        h('div', { className: 'kx-tml-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, nodes.length + ' 阶段 / ' + p.periodLabel))));
  }

  SlideTimeline.defaults = {
    eyebrowId: '20', eyebrowLabel: 'QUARTER BREAKDOWN',
    title: '理性回落季度', subhead: 'Q4 融资拆解 / RATIONAL PULLBACK',
    closing: '回落不是终点，而是分化的开始。',
    periodLabel: 'Q4', periodCaption: '资金挑选确定性 / FOURTH QUARTER',
    hero: { value: '206', unit: '亿$', label: 'Q4 融资额 / FUNDING' },
    delta: { value: '−35.2%', dir: 'down', label: '较 Q3 / vs Q3' },
    metrics: [
      { k: '事件数 / DEALS', v: '22 笔' },
      { k: '平均单笔 / AVG', v: '9.4 亿' },
    ],
    nodes: [
      { when: 'Q1', value: 162, name: '冷启动 / COLD START', note: '市场保守启动，资金谨慎。' },
      { when: 'Q2', value: 284, name: '加速 / ACCELERATION', note: '融资窗口打开，节奏加快。' },
      { when: 'Q3', value: 318, name: '峰值 / PEAK', note: '情绪高点，多赛道同时活跃。' },
      { when: 'Q4', value: 206, name: '回落 / PULLBACK', note: '回落但仍高于年初，资金转向筛选。' },
    ],
    nodeCount: 4, metricCount: 2, showDelta: true, showTrack: true,
    focusEnabled: true, focusIndex: 3, accent: '#c8f135',
  };

  SlideTimeline.controls = [
    { key: 'nodeCount', label: '阶段节点数', type: 'number', default: 4, min: 2, max: 4, desc: '横向阶段轴上的节点数量' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 1, max: 2, desc: '左侧辅助指标数量' },
    { key: 'showTrack', label: '阶段数值条', type: 'toggle', default: true, desc: '显示/隐藏每个节点的数值条与连接轴' },
    { key: 'showDelta', label: '变化标签', type: 'toggle', default: true, desc: '显示/隐藏方向变化标签（装饰数据）' },
    { key: 'focusEnabled', label: '本期高亮', type: 'toggle', default: true, desc: '是否在阶段轴中高亮本期' },
    { key: 'focusIndex', label: '高亮第几阶段', type: 'number', default: 3, min: 0, max: 3, desc: '被高亮的节点序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideTimeline;
