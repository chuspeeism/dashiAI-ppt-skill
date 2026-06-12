// ============================================================================
// SlideMethod.jsx — P04 研究方法 / Method Stack
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,goal,closing   content
//   layers ({name,en,axis,desc}[])   content — method layers
//   cardCount (int 2..3)  VISUAL  number of method layers
//   focusEnabled (bool)   VISUAL  emphasise one layer
//   focusIndex (int)      VISUAL  which layer
//   stackStyle (enum)     VISUAL  'stack' | 'list'
//   showDecor (bool)      VISUAL  decorative index / axis labels
//   accent (color)        VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-met-css')) {
    const css = `
    .kx-met-pad{display:flex;flex-direction:column;height:100%;}
    .kx-met-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:30px;border-bottom:1px solid var(--kx-line-d);}
    .kx-met-title{font-size:74px;}
    .kx-met-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-met-body{flex:1;display:grid;grid-template-columns:660px 1fr;gap:80px;align-items:center;padding:30px 0;}
    /* stack column */
    .kx-met-stack{position:relative;display:flex;flex-direction:column;}
    .kx-met-card{border:1px solid var(--kx-line-d);background:var(--kx-cream);
      padding:30px 34px;display:flex;align-items:center;gap:30px;position:relative;
      box-shadow:0 10px 30px rgba(0,0,0,.10);}
    .kx-met-stack.kx-ov .kx-met-card{margin-top:-36px;}
    .kx-met-stack.kx-ov .kx-met-card:first-child{margin-top:0;}
    .kx-met-stack.kx-list{gap:18px;}
    .kx-met-card .kx-met-mk{font-family:var(--kx-disp);font-weight:900;font-size:72px;line-height:.8;
      color:var(--kx-mute);width:96px;flex:none;}
    .kx-met-card .kx-met-nm{font-family:var(--kx-disp);font-weight:900;font-size:48px;letter-spacing:.04em;}
    .kx-met-card .kx-met-ax{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);
      letter-spacing:.05em;text-transform:uppercase;margin-top:6px;}
    .kx-met-card.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);transform:translateX(28px);
      box-shadow:0 18px 44px rgba(0,0,0,.22);z-index:5;}
    .kx-met-card.kx-on .kx-met-mk{color:rgba(0,0,0,.35);}
    .kx-met-card.kx-on .kx-met-ax{color:rgba(0,0,0,.6);}
    /* description column */
    .kx-met-desc{display:flex;flex-direction:column;gap:0;}
    .kx-met-drow{display:grid;grid-template-columns:64px 1fr;gap:26px;padding:26px 0;
      border-top:1px solid var(--kx-line-d);}
    .kx-met-drow:last-child{border-bottom:1px solid var(--kx-line-d);}
    .kx-met-dnum{font-family:var(--kx-mono);font-size:26px;font-weight:700;color:var(--kx-accent);}
    .kx-met-dnum.kx-flat{color:var(--kx-mute-2);}
    .kx-met-dname{font-family:var(--kx-disp);font-weight:800;font-size:30px;margin-bottom:8px;}
    .kx-met-dtext{font-family:var(--kx-disp);font-weight:500;font-size:27px;line-height:1.45;color:#2a2a26;}
    .kx-met-drow.kx-on{background:rgba(200,241,53,.16);margin:0 -20px;padding-left:20px;padding-right:20px;}
    .kx-met-foot{display:flex;justify-content:space-between;align-items:center;gap:40px;
      padding-top:26px;border-top:1px solid var(--kx-line-d);}
    .kx-met-goal{font-family:var(--kx-disp);font-weight:800;font-size:30px;white-space:nowrap;}
    .kx-met-goal b{background:var(--kx-accent);padding:0 .15em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-met-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const pad2 = (n) => String(n + 1).padStart(2, '0');

  function SlideMethod(props) {
    const p = { ...SlideMethod.defaults, ...props };
    const layers = p.layers.slice(0, Math.max(1, Math.min(p.cardCount, p.layers.length)));
    const overlap = p.stackStyle === 'stack';

    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-met-pad' },
        h('div', { className: 'kx-met-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-met-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-met-sub' }, p.subhead)),

        h('div', { className: 'kx-met-body' },
          h('div', { className: 'kx-met-stack ' + (overlap ? 'kx-ov' : 'kx-list') },
            layers.map((l, i) => h('div', { key: i, className: 'kx-met-card' + (p.focusEnabled && i === p.focusIndex ? ' kx-on' : ''),
              style: { zIndex: i + 1 } },
              p.showDecor ? h('div', { className: 'kx-met-mk' }, l.name) : null,
              h('div', null,
                h('div', { className: 'kx-met-nm' }, p.showDecor ? l.axis : l.name),
                h('div', { className: 'kx-met-ax' }, '[' + pad2(i) + '] ' + l.en))))),

          h('div', { className: 'kx-met-desc' },
            layers.map((l, i) => {
              const on = p.focusEnabled && i === p.focusIndex;
              return h('div', { key: i, className: 'kx-met-drow' + (on ? ' kx-on' : '') },
                h('div', { className: 'kx-met-dnum' + (on ? '' : ' kx-flat') }, pad2(i)),
                h('div', null,
                  h('div', { className: 'kx-met-dname' }, l.name + ' · ' + l.axis),
                  h('div', { className: 'kx-met-dtext' }, l.desc)));
            }))),

        h('div', { className: 'kx-met-foot' },
          h('div', { className: 'kx-met-goal', dangerouslySetInnerHTML: { __html: p.goal } }),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, '→ ' + p.closing))));
  }

  SlideMethod.defaults = {
    eyebrowId: '04', eyebrowLabel: 'METHODOLOGY',
    title: '研究方法', subhead: '横纵分析法',
    goal: '目标：把融资数据变成 <b>结构化判断</b>',
    closing: '不是罗列融资新闻，而是看清资本流向。',
    layers: [
      { name: '横向', en: 'HORIZONTAL', axis: '空间对比', desc: '同一时间截面下，对比公司、赛道、轮次与地区——回答「钱流向哪里」。' },
      { name: '纵向', en: 'VERTICAL', axis: '时间演化', desc: '沿时间轴观察融资额、事件数与市场节奏的变化——回答「热度如何变化」。' },
      { name: '交叉', en: 'CROSS', axis: '产业分层', desc: '横纵交叉叠加产业链分层，判断哪些方向能够真正兑现。' },
    ],
    cardCount: 3, focusEnabled: true, focusIndex: 2, stackStyle: 'stack', showDecor: true, accent: '#c8f135',
  };

  SlideMethod.controls = [
    { key: 'cardCount', label: '方法卡数量', type: 'number', default: 3, min: 2, max: 3, desc: '方法层级的数量' },
    { key: 'stackStyle', label: '卡片样式', type: 'select', default: 'stack',
      options: [['stack', '堆叠'], ['list', '列表']], desc: '左侧方法卡的排布形式' },
    { key: 'focusEnabled', label: '重点层高亮', type: 'toggle', default: true, desc: '是否突出某一方法层' },
    { key: 'focusIndex', label: '高亮第几层', type: 'number', default: 2, min: 0, max: 2, desc: '被突出的方法层序号', showIf: (p) => p.focusEnabled },
    { key: 'showDecor', label: '装饰编号', type: 'toggle', default: true, desc: '显示/隐藏卡片上的大号标记与轴线编号（装饰文案）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideMethod;
