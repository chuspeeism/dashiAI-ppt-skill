// ============================================================================
// SlideRanking.jsx — P06 Top 融资公司 / Ranking (table + bars)
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing,unit   content
//   rows ({name,tag,value}[])   content — ranked rows (pre-sorted or not)
//   rowCount (int 5..10)  VISUAL  how many rows shown
//   focusCount (int 0..3) VISUAL  highlight the top-N rows
//   chartType (enum)      VISUAL  'bars' | 'dots'
//   showValueLabels (bool) VISUAL value labels at bar end (decorative)
//   accent (color)        VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-rank-css')) {
    const css = `
    .kx-rnk-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-rnk-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line-d);}
    .kx-rnk-title{font-size:66px;}
    .kx-rnk-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-rnk-rows{flex:1;display:flex;flex-direction:column;justify-content:center;}
    .kx-rnk-row{display:grid;grid-template-columns:84px 300px 1fr 150px;gap:32px;align-items:center;
      padding:0 0;border-bottom:1px solid var(--kx-line-d);position:relative;}
    .kx-rnk-idx{font-family:var(--kx-disp);font-weight:900;font-size:40px;color:var(--kx-mute-2);line-height:1;}
    .kx-rnk-nm{display:flex;flex-direction:column;gap:3px;}
    .kx-rnk-nm b{font-family:var(--kx-disp);font-weight:900;font-size:32px;letter-spacing:.01em;}
    .kx-rnk-nm span{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.04em;}
    .kx-rnk-track{height:26px;background:rgba(0,0,0,.06);position:relative;}
    .kx-rnk-fill{height:100%;background:var(--kx-ink);min-width:4px;display:block;}
    .kx-rnk-dots{display:flex;gap:6px;align-items:center;height:26px;flex-wrap:wrap;align-content:center;}
    .kx-rnk-dots i{width:12px;height:12px;background:var(--kx-ink);display:block;}
    .kx-rnk-val{font-family:var(--kx-mono);font-weight:700;font-size:30px;text-align:right;}
    .kx-rnk-row.kx-on .kx-rnk-idx{color:var(--kx-ink);}
    .kx-rnk-row.kx-on .kx-rnk-fill{background:var(--kx-accent);}
    .kx-rnk-row.kx-on .kx-rnk-dots i{background:var(--kx-accent);}
    .kx-rnk-row.kx-on::before{content:'';position:absolute;left:-26px;top:0;bottom:0;width:6px;background:var(--kx-accent);}
    .kx-rnk-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;}
    .kx-rnk-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);}
    `;
    const s = document.createElement('style'); s.id = 'kx-rank-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const pad2 = (n) => String(n).padStart(2, '0');

  function SlideRanking(props) {
    const p = { ...SlideRanking.defaults, ...props };
    const rows = p.rows.slice(0, Math.max(3, Math.min(p.rowCount, p.rows.length)));
    const max = Math.max(...rows.map((r) => r.value));
    const dotMax = 20;
    const rowH = Math.min(86, Math.max(54, Math.floor(640 / rows.length)));

    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-rnk-pad' },
        h('div', { className: 'kx-rnk-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-rnk-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-rnk-sub' }, p.subhead)),
        h('div', { className: 'kx-rnk-rows' },
          rows.map((r, i) => {
            const on = i < p.focusCount;
            const pct = (r.value / max) * 100;
            const dotN = Math.max(1, Math.round((r.value / max) * dotMax));
            return h('div', { key: i, className: 'kx-rnk-row' + (on ? ' kx-on' : ''), style: { height: rowH + 'px' } },
              h('div', { className: 'kx-rnk-idx' }, pad2(i + 1)),
              h('div', { className: 'kx-rnk-nm' }, h('b', null, r.name), h('span', null, r.tag)),
              p.chartType === 'dots'
                ? h('div', { className: 'kx-rnk-dots' }, Array.from({ length: dotN }, (_, k) => h('i', { key: k })))
                : h('div', { className: 'kx-rnk-track' }, h('span', { className: 'kx-rnk-fill', style: { width: pct + '%' } })),
              h('div', { className: 'kx-rnk-val' }, p.showValueLabels ? (r.value + (p.unit || '')) : ''));
          })),
        h('div', { className: 'kx-rnk-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-accent)', fontWeight: 700 } }, '→ ' + p.closing),
          h('div', { className: 'kx-rnk-foot' }, h('span', { className: 'kx-cl' }, 'TOP ' + rows.length + ' · ' + (p.unit || '') + ' SCALE')))));
  }

  SlideRanking.defaults = {
    eyebrowId: '06', eyebrowLabel: 'TOP FUNDED', unit: 'B',
    title: 'Top 10 融资公司', subhead: '头部玩家资金排名 / 最大单笔',
    closing: '头部规模既反映技术叙事，也反映资源绑定能力。',
    rows: [
      { name: 'OpenAI', tag: '通用大模型 / LLM', value: 66 },
      { name: 'Anthropic', tag: '安全模型 / SAFETY', value: 65 },
      { name: 'xAI', tag: '实时数据 / MULTIMODAL', value: 50 },
      { name: 'CoreWeave', tag: '算力基础设施 / GPU CLOUD', value: 11 },
      { name: 'SSI', tag: '安全智能 / RESEARCH', value: 10 },
      { name: 'Scale AI', tag: '数据基础设施 / DATA', value: 10 },
      { name: 'Figure AI', tag: '具身智能 / ROBOTICS', value: 6.8 },
      { name: 'Perplexity', tag: 'AI 搜索 / SEARCH', value: 5.2 },
      { name: 'Databricks', tag: '数据平台 / PLATFORM', value: 5.0 },
      { name: 'Glean', tag: '企业搜索 / ENTERPRISE', value: 2.6 },
    ],
    rowCount: 8, focusCount: 3, chartType: 'bars', showValueLabels: true, accent: '#c8f135',
  };

  SlideRanking.controls = [
    { key: 'rowCount', label: '展示条目数', type: 'number', default: 8, min: 5, max: 10, desc: '排行榜显示的条目数量' },
    { key: 'focusCount', label: '高亮前 N 名', type: 'number', default: 3, min: 0, max: 3, desc: '高亮排名靠前的条目数量（0 关闭）' },
    { key: 'chartType', label: '图形类型', type: 'select', default: 'bars',
      options: [['bars', '条形'], ['dots', '点阵']], desc: '数值的可视化形式' },
    { key: 'showValueLabels', label: '数值标签', type: 'toggle', default: true, desc: '显示/隐藏每行末尾的数值（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideRanking;
