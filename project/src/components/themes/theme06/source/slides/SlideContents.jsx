// ============================================================================
// SlideContents.jsx — P03 报告结构 / Chapter List
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   items ({name,en,scope}[])   content — chapter rows
//   cardCount (int 3..7)  VISUAL  how many chapters shown
//   focusEnabled (bool)   VISUAL  emphasise one chapter
//   focusIndex (int)      VISUAL  which chapter
//   layout (enum)         VISUAL  'rows' | 'grid'
//   showColumnHeaders (bool) VISUAL  decorative column headers
//   accent (color)        VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-con-css')) {
    const css = `
    .kx-con-pad{display:flex;flex-direction:column;height:100%;padding-top:40px;padding-bottom:32px;}
    .kx-con-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;margin-bottom:10px;}
    .kx-con-title{font-size:54px;}
    .kx-con-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-con-colhead{display:grid;grid-template-columns:130px 1.25fr 1fr 56px;gap:40px;
      font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.06em;
      padding-bottom:8px;border-bottom:1px solid var(--kx-line);}
    .kx-con-rows{flex:1;display:flex;flex-direction:column;justify-content:center;}
    .kx-con-row{display:grid;grid-template-columns:130px 1.25fr 1fr 56px;gap:40px;align-items:center;
      padding:11px 0;border-bottom:1px solid var(--kx-line);position:relative;}
    .kx-con-idx{font-family:var(--kx-disp);font-weight:900;font-size:46px;color:var(--kx-accent);line-height:1;}
    .kx-con-name{font-family:var(--kx-disp);font-weight:900;font-size:36px;letter-spacing:.01em;}
    .kx-con-en{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;margin-top:4px;}
    .kx-con-scope{font-family:var(--kx-mono);font-size:25px;color:var(--kx-cream);opacity:.85;letter-spacing:.02em;}
    .kx-con-arrow{justify-self:end;color:var(--kx-mute-2);font-size:34px;}
    .kx-con-row.kx-on{background:linear-gradient(90deg,rgba(200,241,53,.14),transparent 70%);
      margin:0 -24px;padding-left:24px;padding-right:24px;}
    .kx-con-row.kx-on::before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--kx-accent);}
    .kx-con-row.kx-on .kx-con-name{color:var(--kx-accent);}
    .kx-con-row.kx-on .kx-con-arrow{color:var(--kx-accent);}
    .kx-con-tag{display:inline-block;font-family:var(--kx-mono);font-size:24px;font-weight:700;
      background:var(--kx-accent);color:var(--kx-ink);padding:2px 10px;margin-left:14px;vertical-align:middle;letter-spacing:.05em;}
    /* grid layout */
    .kx-con-grid{flex:1;display:grid;gap:22px;align-content:center;}
    .kx-con-cell{border:1px solid var(--kx-line);padding:30px 28px;display:flex;flex-direction:column;gap:14px;
      min-height:0;position:relative;}
    .kx-con-cell .kx-con-idx{font-size:46px;}
    .kx-con-cell .kx-con-name{font-size:38px;}
    .kx-con-cell.kx-on{border-color:var(--kx-accent);background:rgba(200,241,53,.08);}
    .kx-con-cell.kx-on .kx-con-name{color:var(--kx-accent);}
    .kx-con-foot{display:flex;justify-content:space-between;align-items:center;padding-top:12px;margin-top:4px;}
    `;
    const s = document.createElement('style'); s.id = 'kx-con-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const pad2 = (n) => String(n + 1).padStart(2, '0');

  function SlideContents(props) {
    const p = { ...SlideContents.defaults, ...props };
    const items = p.items.slice(0, Math.max(1, Math.min(p.cardCount, p.items.length)));
    const isGrid = p.layout === 'grid';
    const cols = items.length <= 4 ? 2 : 3;

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-con-pad' },
        h('div', { className: 'kx-con-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-con-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-con-sub' }, p.subhead)),

        !isGrid && p.showColumnHeaders ? h('div', { className: 'kx-con-colhead' },
          h('span', null, '[ ID ]'), h('span', null, '[ 章节 / CHAPTER ]'),
          h('span', null, '[ 范围 / SCOPE ]'), h('span')) : null,

        isGrid
          ? h('div', { className: 'kx-con-grid', style: { gridTemplateColumns: `repeat(${cols},1fr)` } },
              items.map((it, i) => h('div', { key: i, className: 'kx-con-cell' + (p.focusEnabled && i === p.focusIndex ? ' kx-on' : '') },
                h('div', { className: 'kx-con-idx' }, pad2(i)),
                h('div', null,
                  h('div', { className: 'kx-con-name' }, it.name,
                    p.focusEnabled && i === p.focusIndex ? h('span', { className: 'kx-con-tag' }, 'FOCUS') : null),
                  h('div', { className: 'kx-con-en' }, it.en)),
                h('div', { className: 'kx-con-scope', style: { marginTop: 'auto' } }, it.scope))))
          : h('div', { className: 'kx-con-rows' },
              items.map((it, i) => h('div', { key: i, className: 'kx-con-row' + (p.focusEnabled && i === p.focusIndex ? ' kx-on' : '') },
                h('div', { className: 'kx-con-idx' }, pad2(i)),
                h('div', null,
                  h('div', { className: 'kx-con-name' }, it.name,
                    p.focusEnabled && i === p.focusIndex ? h('span', { className: 'kx-con-tag' }, 'FOCUS') : null),
                  h('div', { className: 'kx-con-en' }, it.en)),
                h('div', { className: 'kx-con-scope' }, it.scope),
                h('div', { className: 'kx-con-arrow' }, '→')))),

        h('div', { className: 'kx-con-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-accent)', fontWeight: 700 } }, '→ ' + p.closing),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, items.length + ' / ' + p.items.length + ' 章节'))));
  }

  SlideContents.defaults = {
    eyebrowId: '03', eyebrowLabel: 'STRUCTURE',
    title: '报告结构', subhead: '从方法到结论的阅读路径',
    closing: '先建立框架，再进入数据和判断。',
    items: [
      { name: '研究方法', en: 'Methodology', scope: '横纵分析法 · 数据口径' },
      { name: '市场全景', en: 'Market Panorama', scope: '融资规模 · 季度节奏' },
      { name: '横向透视', en: 'Cross-Section', scope: '赛道 · 轮次 · 地区' },
      { name: '产业链分层', en: 'Value Chain', scope: '上游 · 中游 · 下游' },
      { name: '典型案例', en: 'Case Studies', scope: '模型 · 生态 · 算力' },
      { name: '风险研判', en: 'Risk & Outlook', scope: '估值 · 监管 · 兑现' },
      { name: '结论判断', en: 'Conclusion', scope: '投资策略 · 数据来源' },
    ],
    cardCount: 7, focusEnabled: true, focusIndex: 1, layout: 'rows', showColumnHeaders: true, accent: '#c8f135',
  };

  SlideContents.controls = [
    { key: 'cardCount', label: '章节卡数量', type: 'number', default: 7, min: 3, max: 7, desc: '展示的章节数量' },
    { key: 'layout', label: '排布方式', type: 'select', default: 'rows',
      options: [['rows', '列表'], ['grid', '网格']], desc: '章节的排布形式' },
    { key: 'focusEnabled', label: '重点章节高亮', type: 'toggle', default: true, desc: '是否突出某一章节' },
    { key: 'focusIndex', label: '高亮第几章', type: 'number', default: 1, min: 0, max: 6, desc: '被突出的章节序号', showIf: (p) => p.focusEnabled },
    { key: 'showColumnHeaders', label: '装饰列头', type: 'toggle', default: true, desc: '显示/隐藏列表的列头标签（装饰文案，仅列表布局）', showIf: (p) => p.layout !== 'grid' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideContents;
