// ============================================================================
// SlideWaterfall.jsx — P22 赛道贡献拆分 / Contribution Waterfall
// Independent, props-driven, REUSABLE. Depends only on kit.jsx.
//
// A generic "how the total is built" chart. Floating bars accumulate left→right
// to a final total (waterfall); the same parts also render as one stacked bar or
// proportional rows. Segment count, the total bar, connectors and the focused
// segment are all generic visual params.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   segments ({name,en,value}[])   content — contribution parts (high→low)
//   totalLabel                     content — label for the cumulative total bar
//   chartType (enum)        VISUAL  'waterfall' | 'stack' | 'bars'
//   segmentCount (int 3..5) VISUAL  parts shown
//   showTotal (bool)        VISUAL  cumulative total bar / chip
//   showValueLabels (bool)  VISUAL  per-part value labels (decorative)
//   showConnectors (bool)   VISUAL  step connector lines (decorative, waterfall)
//   focusEnabled (bool)     VISUAL  emphasise one part
//   focusIndex (int)        VISUAL  which part
//   accent (color)          VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-wfl-css')) {
    const css = `
    .kx-wfl-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-wfl-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-wfl-title{font-size:68px;}
    .kx-wfl-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-wfl-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:24px 0 6px;}
    /* waterfall + total share a grid */
    .kx-wfl-plot{flex:1;min-height:0;display:grid;column-gap:22px;padding-top:54px;}
    .kx-wfl-col{position:relative;height:100%;}
    .kx-wfl-bar{position:absolute;left:0;right:0;background:#34342f;border-radius:4px 4px 0 0;min-height:6px;}
    .kx-wfl-col.kx-on .kx-wfl-bar{background:var(--kx-accent);}
    .kx-wfl-col.kx-total .kx-wfl-bar{background:repeating-linear-gradient(135deg,var(--kx-cream) 0 3px,transparent 3px 9px);
      border:1px solid var(--kx-cream);}
    .kx-wfl-bv{position:absolute;top:-44px;left:50%;transform:translateX(-50%);font-family:var(--kx-disp);
      font-weight:800;font-size:38px;letter-spacing:-.01em;color:var(--kx-cream);white-space:nowrap;}
    .kx-wfl-col.kx-on .kx-wfl-bv{color:var(--kx-accent);}
    .kx-wfl-conn{position:absolute;right:-22px;width:22px;border-top:2px dashed var(--kx-line);z-index:0;}
    /* stack variant: one horizontal bar */
    .kx-wfl-stackwrap{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:30px;}
    .kx-wfl-stack{display:flex;height:120px;width:100%;border:1px solid var(--kx-line);overflow:hidden;}
    .kx-wfl-seg{position:relative;background:#34342f;border-right:2px solid var(--kx-ink);display:flex;align-items:center;justify-content:center;}
    .kx-wfl-seg:last-child{border-right:none;}
    .kx-wfl-seg.kx-on{background:var(--kx-accent);}
    .kx-wfl-seg .kx-sv{font-family:var(--kx-disp);font-weight:800;font-size:34px;color:var(--kx-cream);}
    .kx-wfl-seg.kx-on .kx-sv{color:var(--kx-ink);}
    /* bars variant: proportional rows */
    .kx-wfl-rows{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:22px;}
    .kx-wfl-row{display:grid;grid-template-columns:300px 1fr 150px;gap:26px;align-items:center;}
    .kx-wfl-rlabel{font-family:var(--kx-disp);font-weight:900;font-size:34px;}
    .kx-wfl-col.kx-on .kx-wfl-rlabel{color:var(--kx-accent);}
    .kx-wfl-rtrack{height:44px;background:rgba(255,255,255,.05);position:relative;overflow:hidden;}
    .kx-wfl-rfill{position:absolute;inset:0 auto 0 0;background:#34342f;}
    .kx-wfl-row.kx-on .kx-wfl-rfill{background:var(--kx-accent);}
    .kx-wfl-rlabel.kx-on,.kx-wfl-row.kx-on .kx-wfl-rlabel{color:var(--kx-accent);}
    .kx-wfl-rval{font-family:var(--kx-disp);font-weight:800;font-size:36px;text-align:right;letter-spacing:-.01em;}
    /* axis labels under chart */
    .kx-wfl-axis{display:grid;column-gap:22px;border-top:1px solid var(--kx-line);padding-top:16px;margin-top:8px;}
    .kx-wfl-lab{display:flex;flex-direction:column;gap:4px;text-align:center;}
    .kx-wfl-lab .kx-lm{font-family:var(--kx-disp);font-weight:900;font-size:30px;letter-spacing:.01em;line-height:1.05;}
    .kx-wfl-lab .kx-ls{font-family:var(--kx-mono);font-size:20px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-wfl-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-wfl-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-wfl-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-wfl-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideWaterfall(props) {
    const p = { ...SlideWaterfall.defaults, ...props };
    const segs = p.segments.slice(0, Math.max(3, Math.min(p.segmentCount, p.segments.length)));
    const total = segs.reduce((s, d) => s + d.value, 0);
    const maxV = Math.max(...segs.map((d) => d.value));
    const fi = Math.min(p.focusIndex, segs.length - 1);
    const colCount = segs.length + (p.showTotal ? 1 : 0);
    const grid = `repeat(${colCount},1fr)`;

    let body, footMeta;
    if (p.chartType === 'stack') {
      footMeta = 'STACK';
      body = h('div', { className: 'kx-wfl-stackwrap' },
        h('div', { className: 'kx-wfl-stack' },
          segs.map((d, i) => h('div', { key: i, className: 'kx-wfl-seg' + (p.focusEnabled && i === fi ? ' kx-on' : ''),
            style: { width: (d.value / total * 100) + '%' } },
            p.showValueLabels ? h('span', { className: 'kx-sv' }, d.value) : null))),
        h('div', { className: 'kx-wfl-axis', style: { gridTemplateColumns: `repeat(${segs.length},1fr)` } },
          segs.map((d, i) => h('div', { key: i, className: 'kx-wfl-lab' },
            h('span', { className: 'kx-lm' }, d.name),
            h('span', { className: 'kx-ls' }, d.en)))));
    } else if (p.chartType === 'bars') {
      footMeta = 'BARS';
      body = h('div', { className: 'kx-wfl-rows' },
        segs.map((d, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-wfl-row' + (on ? ' kx-on' : '') },
            h('div', { className: 'kx-wfl-rlabel' }, d.name),
            h('div', { className: 'kx-wfl-rtrack' },
              h('div', { className: 'kx-wfl-rfill', style: { width: Math.max(5, d.value / maxV * 100) + '%' } })),
            h('div', { className: 'kx-wfl-rval' }, p.showValueLabels ? d.value + (p.unit || '') : ''));
        }));
    } else {
      // waterfall
      footMeta = 'WATERFALL';
      let cum = 0;
      const cols = segs.map((d, i) => {
        const start = cum; cum += d.value;
        const on = p.focusEnabled && i === fi;
        const drawConn = p.showConnectors && (i < segs.length - 1 || p.showTotal);
        return h('div', { key: i, className: 'kx-wfl-col' + (on ? ' kx-on' : '') },
          h('div', { className: 'kx-wfl-bar',
            style: { height: (d.value / total * 100) + '%', bottom: (start / total * 100) + '%' } },
            p.showValueLabels ? h('span', { className: 'kx-wfl-bv' }, d.value) : null,
            drawConn ? h('div', { className: 'kx-wfl-conn', style: { top: 0 } }) : null));
      });
      if (p.showTotal) {
        cols.push(h('div', { key: 'total', className: 'kx-wfl-col kx-total' },
          h('div', { className: 'kx-wfl-bar', style: { height: '100%', bottom: 0 } },
            p.showValueLabels ? h('span', { className: 'kx-wfl-bv', style: { color: 'var(--kx-cream)' } }, total) : null)));
      }
      const labels = segs.map((d, i) => h('div', { key: i, className: 'kx-wfl-lab' },
        h('span', { className: 'kx-lm', style: (p.focusEnabled && i === fi) ? { color: 'var(--kx-accent)' } : null }, d.name),
        h('span', { className: 'kx-ls' }, d.en)));
      if (p.showTotal) labels.push(h('div', { key: 'tl', className: 'kx-wfl-lab' },
        h('span', { className: 'kx-lm' }, p.totalLabel),
        h('span', { className: 'kx-ls' }, 'TOTAL ' + total + (p.unit || ''))));
      body = h(React.Fragment, null,
        h('div', { className: 'kx-wfl-plot', style: { gridTemplateColumns: grid } }, cols),
        h('div', { className: 'kx-wfl-axis', style: { gridTemplateColumns: grid } }, labels));
    }

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-wfl-pad' },
        h('div', { className: 'kx-wfl-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-wfl-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-wfl-sub' }, p.subhead)),
        h('div', { className: 'kx-wfl-body' }, body),
        h('div', { className: 'kx-wfl-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, '合计 ' + total + (p.unit || '') + ' / ' + footMeta))));
  }

  SlideWaterfall.defaults = {
    eyebrowId: '22', eyebrowLabel: 'FUNDING WATERFALL',
    title: '赛道贡献拆分', subhead: '融资额贡献瀑布 / CONTRIBUTION', unit: '亿',
    closing: '大模型制造热度，基础设施和应用承接兑现。',
    totalLabel: '全年合计',
    segments: [
      { name: '通用大模型', en: 'FOUNDATION MODELS', value: 420 },
      { name: '垂直应用', en: 'VERTICAL APPS', value: 245 },
      { name: '基础设施', en: 'INFRASTRUCTURE', value: 158 },
      { name: 'AI 芯片', en: 'AI CHIPS', value: 97 },
      { name: '其他', en: 'OTHERS', value: 50 },
    ],
    chartType: 'waterfall', segmentCount: 5, showTotal: true, showValueLabels: true,
    showConnectors: true, focusEnabled: true, focusIndex: 0, accent: '#c8f135',
  };

  SlideWaterfall.controls = [
    { key: 'chartType', label: '图表类型', type: 'select', default: 'waterfall',
      options: [['waterfall', '瀑布'], ['stack', '堆叠条'], ['bars', '条形']], desc: '贡献拆分的可视化形式' },
    { key: 'segmentCount', label: '赛道数量', type: 'number', default: 5, min: 3, max: 5, desc: '展示的赛道/贡献项数量' },
    { key: 'showTotal', label: '合计柱', type: 'toggle', default: true, desc: '显示/隐藏累计合计柱（仅瀑布有效）', showIf: (p) => p.chartType === 'waterfall' },
    { key: 'showConnectors', label: '阶梯连接线', type: 'toggle', default: true, desc: '显示/隐藏瀑布阶梯连接线（装饰，仅瀑布有效）', showIf: (p) => p.chartType === 'waterfall' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏每项数值（装饰数据）' },
    { key: 'focusEnabled', label: '重点赛道高亮', type: 'toggle', default: true, desc: '是否突出某一赛道' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 4, desc: '被突出的赛道序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideWaterfall;
