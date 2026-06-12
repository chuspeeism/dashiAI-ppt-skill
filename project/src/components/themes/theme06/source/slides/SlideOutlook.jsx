// ============================================================================
// SlideOutlook.jsx — P13 投资建议与阶段性策略 / Compare + Phase Timeline
// Independent, props-driven. Depends only on kit.jsx.
//
// Two stance columns (content-defined) compared side by side, with an optional
// emphasis weighting one side, over a horizontal phase timeline. Every visual
// param is generic (item count, emphasis side, focus node, timeline node count).
//
// PROPS (content = static defaults; visual = Tweakable via .controls)
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   columns ({title,en,tone,items:[{name,en,note}]}[])  content — 2 stance columns
//   phases ({when,name,note}[])   content — timeline phase nodes
//   itemCount (int 2..4)    VISUAL  rows shown per column
//   emphasis (enum)         VISUAL  'none' | 'left' | 'right' — weight one column
//   showTimeline (bool)     VISUAL  bottom phase timeline
//   timelineCount (int 2..4) VISUAL number of phase nodes
//   focusEnabled (bool)     VISUAL  emphasise one phase node
//   focusIndex (int)        VISUAL  which phase node
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-otl-css')) {
    const css = `
    .kx-otl-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-otl-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line-d);}
    .kx-otl-title{font-size:64px;}
    .kx-otl-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-otl-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:34px;padding:30px 0 4px;}
    .kx-otl-cmp{flex:1;min-height:0;display:grid;gap:30px;align-items:stretch;}
    .kx-otl-col{border:1px solid var(--kx-line-d);background:#fff;display:flex;flex-direction:column;overflow:hidden;}
    .kx-otl-colhd{display:flex;align-items:center;justify-content:space-between;gap:18px;
      padding:22px 28px;border-bottom:1px solid var(--kx-line-d);}
    .kx-otl-coltl{font-family:var(--kx-disp);font-weight:900;font-size:40px;letter-spacing:.02em;line-height:1;}
    .kx-otl-colen{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    .kx-otl-sign{width:54px;height:54px;flex:none;display:flex;align-items:center;justify-content:center;
      font-family:var(--kx-disp);font-weight:900;font-size:40px;line-height:1;border:1px solid var(--kx-line-d);}
    .kx-otl-rows{flex:1;display:flex;flex-direction:column;}
    .kx-otl-row{display:grid;grid-template-columns:1fr auto;column-gap:18px;row-gap:6px;
      padding:20px 28px;border-top:1px solid var(--kx-line-d);}
    .kx-otl-row:first-child{border-top:none;}
    .kx-otl-rnm{font-family:var(--kx-disp);font-weight:800;font-size:30px;letter-spacing:.01em;}
    .kx-otl-ren{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;align-self:center;text-align:right;}
    .kx-otl-rnote{grid-column:1/3;font-family:var(--kx-disp);font-weight:500;font-size:23px;line-height:1.35;color:#3a3a36;}
    /* tone: bullish column uses lime header; cautious stays neutral */
    .kx-otl-col.kx-bull .kx-otl-colhd{background:var(--kx-accent);border-bottom-color:var(--kx-accent);}
    .kx-otl-col.kx-bull .kx-otl-sign{background:var(--kx-ink);color:var(--kx-accent);border-color:var(--kx-ink);}
    .kx-otl-col.kx-caut .kx-otl-colhd{background:var(--kx-ink);}
    .kx-otl-col.kx-caut .kx-otl-coltl{color:var(--kx-cream);}
    .kx-otl-col.kx-caut .kx-otl-colen{color:var(--kx-mute-2);}
    .kx-otl-col.kx-caut .kx-otl-sign{color:var(--kx-cream);border-color:var(--kx-line);}
    .kx-otl-col.kx-dim{opacity:.62;}
    .kx-otl-col.kx-up{box-shadow:0 18px 44px rgba(0,0,0,.16);}
    /* timeline */
    .kx-otl-tl{flex:none;}
    .kx-otl-tlhd{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;margin-bottom:14px;}
    .kx-otl-track{display:grid;position:relative;}
    .kx-otl-track::before{content:'';position:absolute;left:0;right:0;top:9px;height:2px;background:var(--kx-line-d);}
    .kx-otl-node{position:relative;padding:0 28px 0 0;display:flex;flex-direction:column;gap:8px;}
    .kx-otl-dot{width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid var(--kx-mute-2);position:relative;z-index:1;}
    .kx-otl-when{font-family:var(--kx-disp);font-weight:900;font-size:34px;letter-spacing:.01em;line-height:1;}
    .kx-otl-pnm{font-family:var(--kx-mono);font-size:23px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;}
    .kx-otl-pnote{font-family:var(--kx-disp);font-weight:500;font-size:23px;line-height:1.35;color:#3a3a36;max-width:340px;}
    .kx-otl-node.kx-on .kx-otl-dot{background:var(--kx-accent);border-color:var(--kx-ink);}
    .kx-otl-node.kx-on .kx-otl-pnm{color:#111;background:var(--kx-accent);padding:2px 10px;align-self:flex-start;}
    .kx-otl-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line-d);}
    .kx-otl-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);font-weight:700;}
    `;
    const s = document.createElement('style'); s.id = 'kx-otl-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideOutlook(props) {
    const p = { ...SlideOutlook.defaults, ...props };
    const cols = p.columns.slice(0, 2);
    const phases = p.phases.slice(0, Math.max(2, Math.min(p.timelineCount, p.phases.length)));
    const fi = Math.min(p.focusIndex, phases.length - 1);

    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-otl-pad' },
        h('div', { className: 'kx-otl-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-otl-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-otl-sub' }, p.subhead)),

        h('div', { className: 'kx-otl-body' },
          // compare columns
          h('div', { className: 'kx-otl-cmp', style: { gridTemplateColumns: 'repeat(' + cols.length + ',1fr)' } },
            cols.map((c, ci) => {
              const items = c.items.slice(0, Math.max(2, Math.min(p.itemCount, c.items.length)));
              const emph = (p.emphasis === 'left' && ci === 0) || (p.emphasis === 'right' && ci === 1);
              const dim = p.emphasis !== 'none' && !emph;
              const tone = c.tone === 'bull' ? ' kx-bull' : ' kx-caut';
              return h('div', { key: ci, className: 'kx-otl-col' + tone + (emph ? ' kx-up' : '') + (dim ? ' kx-dim' : '') },
                h('div', { className: 'kx-otl-colhd' },
                  h('div', null,
                    h('div', { className: 'kx-otl-coltl' }, c.title),
                    h('div', { className: 'kx-otl-colen' }, c.en)),
                  h('div', { className: 'kx-otl-sign' }, c.tone === 'bull' ? '↗' : '↘')),
                h('div', { className: 'kx-otl-rows' },
                  items.map((it, ri) => h('div', { key: ri, className: 'kx-otl-row' },
                    h('div', { className: 'kx-otl-rnm' }, it.name),
                    h('div', { className: 'kx-otl-ren' }, it.en),
                    h('div', { className: 'kx-otl-rnote' }, it.note)))));
            })),

          // phase timeline
          p.showTimeline ? h('div', { className: 'kx-otl-tl' },
            h('div', { className: 'kx-otl-tlhd' }, '阶段性观察 / PHASED WATCH'),
            h('div', { className: 'kx-otl-track', style: { gridTemplateColumns: 'repeat(' + phases.length + ',1fr)' } },
              phases.map((ph, i) => {
                const on = p.focusEnabled && i === fi;
                return h('div', { key: i, className: 'kx-otl-node' + (on ? ' kx-on' : '') },
                  h('div', { className: 'kx-otl-dot' }),
                  h('div', { className: 'kx-otl-when' }, ph.when),
                  h('div', { className: 'kx-otl-pnm' }, ph.name),
                  h('div', { className: 'kx-otl-pnote' }, ph.note));
              }))) : null),

        h('div', { className: 'kx-otl-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, p.subhead),
          h('div', { className: 'kx-cl' }, '→ ' + p.closing))));
  }

  SlideOutlook.defaults = {
    eyebrowId: '11', eyebrowLabel: 'INVESTMENT OUTLOOK',
    title: '投资建议与阶段性策略', subhead: '看好方向与谨慎方向',
    closing: '看融资只是起点，看兑现才是判断。',
    columns: [
      { title: '看好方向', en: 'BULLISH', tone: 'bull', items: [
        { name: '垂直应用', en: 'VERTICAL APPS', note: '嵌入刚性工作流，看付费留存与净收入留存。' },
        { name: '基础设施', en: 'INFRASTRUCTURE', note: '接近企业刚性预算，收入确定性相对更强。' },
        { name: '具身智能', en: 'EMBODIED AI', note: '长周期硬科技，关注供应链与量产能力。' },
        { name: '数据底座', en: 'DATA STACK', note: '承接训练、RAG 与知识管理的刚需。' },
      ] },
      { title: '谨慎方向', en: 'CAUTIOUS', tone: 'caut', items: [
        { name: '高估值纯模型', en: 'PURE MODELS', note: '估值透支，缺乏数据与工作流护城河。' },
        { name: 'AI 包装项目', en: 'AI WRAPPERS', note: '无壁垒，易被平台与开源能力替代。' },
        { name: '低壁垒消费应用', en: 'THIN CONSUMER', note: '留存弱、同质化竞争，付费意愿不稳。' },
        { name: '纯演示硬件', en: 'DEMO HARDWARE', note: '缺乏量产与成本验证，兑现周期长。' },
      ] },
    ],
    phases: [
      { when: '2025', name: '观察期', note: '关注 IPO 窗口与头部公司收入曲线。' },
      { when: '2026', name: '分化期', note: '兑现能力开始拉开公司之间的差距。' },
      { when: '2027', name: '重定价', note: '公开市场重定 AI 一级市场估值锚。' },
      { when: '2028', name: '再配置', note: '资本向已验证商业闭环的方向集中。' },
    ],
    itemCount: 3, emphasis: 'left', showTimeline: true, timelineCount: 3,
    focusEnabled: true, focusIndex: 2, accent: '#c8f135',
  };

  SlideOutlook.controls = [
    { key: 'itemCount', label: '每栏方向数量', type: 'number', default: 3, min: 2, max: 4, desc: '每个对比栏展示的方向条数' },
    { key: 'emphasis', label: '对比侧重', type: 'select', default: 'left',
      options: [['none', '均衡'], ['left', '左栏'], ['right', '右栏']], desc: '突出哪一侧对比栏（另一侧弱化）' },
    { key: 'showTimeline', label: '阶段时间轴', type: 'toggle', default: true, desc: '显示/隐藏底部的阶段性时间轴' },
    { key: 'timelineCount', label: '阶段节点数', type: 'number', default: 3, min: 2, max: 4, desc: '时间轴上的阶段节点数量', showIf: (p) => p.showTimeline },
    { key: 'focusEnabled', label: '重点阶段高亮', type: 'toggle', default: true, desc: '是否突出某一阶段节点', showIf: (p) => p.showTimeline },
    { key: 'focusIndex', label: '高亮第几阶段', type: 'number', default: 2, min: 0, max: 3, desc: '被突出的阶段节点序号', showIf: (p) => p.showTimeline && p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideOutlook;
