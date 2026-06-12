// ============================================================================
// SlideBigNumber.jsx — P10 大数字锚点 / Big Number
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,kicker   content
//   figure (string)   content — the oversized number
//   unit (string)     content — small unit beside the figure
//   explain (string)  content — one-line explanation
//   closing (string)  content — bottom strip line
//   metrics ({k,v}[]) content — supporting metrics
//   watermark (string) content — ghosted background word
//   metricCount (int 0..3) VISUAL  number of supporting metrics
//   align (enum)      VISUAL  'left' | 'center'
//   showWatermark (bool) VISUAL  ghosted background word
//   accent (color)    VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-big-css')) {
    const css = `
    .kx-big-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:40px;}
    .kx-big-top{display:flex;justify-content:space-between;align-items:flex-start;}
    .kx-big-kicker{font-family:var(--kx-disp);font-weight:800;font-size:34px;max-width:560px;line-height:1.25;}
    .kx-big-main{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
    .kx-big-main.kx-center{align-items:center;text-align:center;}
    .kx-big-fig{font-family:var(--kx-disp);font-weight:900;line-height:.82;letter-spacing:-.04em;
      color:var(--kx-accent);font-size:380px;display:flex;align-items:flex-start;gap:18px;}
    .kx-big-fig .kx-unit{font-size:96px;font-weight:800;color:var(--kx-ink);align-self:flex-end;
      margin-bottom:40px;letter-spacing:0;white-space:nowrap;}
    .kx-light .kx-big-fig .kx-unit{color:var(--kx-ink);}
    .kx-big-explain{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:1.2;
      max-width:1100px;margin-top:8px;}
    .kx-big-explain b{background:var(--kx-accent);padding:0 .12em;}
    .kx-big-metrics{display:grid;gap:0;border-top:1px solid var(--kx-line-d);margin-top:42px;}
    .kx-big-mcard{padding:26px 30px 6px 0;border-right:1px solid var(--kx-line-d);display:flex;flex-direction:column;gap:8px;}
    .kx-big-mcard:last-child{border-right:none;}
    .kx-big-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:54px;line-height:.9;letter-spacing:-.02em;}
    .kx-big-mcard .kx-mk{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    .kx-big-foot{display:flex;justify-content:space-between;align-items:center;padding-top:26px;}
    .kx-big-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);}
    .kx-big-wm{top:18%;right:-20px;font-size:300px;}
    `;
    const s = document.createElement('style'); s.id = 'kx-big-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideBigNumber(props) {
    const p = { ...SlideBigNumber.defaults, ...props };
    const metrics = p.metrics.slice(0, Math.max(0, Math.min(p.metricCount, p.metrics.length)));
    const center = p.align === 'center';

    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      p.showWatermark ? h('div', { className: 'kx-wm kx-big-wm' }, p.watermark) : null,
      h('div', { className: 'kx-pad kx-big-pad' },
        h('div', { className: 'kx-big-top' },
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('div', { className: 'kx-big-kicker', style: { textAlign: 'right' } }, p.kicker)),
        h('div', { className: 'kx-big-main' + (center ? ' kx-center' : '') },
          h('div', { className: 'kx-big-fig' }, p.figure, p.unit ? h('span', { className: 'kx-unit' }, p.unit) : null),
          h('div', { className: 'kx-big-explain', dangerouslySetInnerHTML: { __html: p.explain } })),
        metrics.length
          ? h('div', { className: 'kx-big-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
              metrics.map((m, i) => h('div', { key: i, className: 'kx-big-mcard' },
                h('div', { className: 'kx-mv' }, m.v),
                h('div', { className: 'kx-mk' }, m.k))))
          : null,
        h('div', { className: 'kx-big-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-accent)', fontWeight: 700 } }, '→ ' + p.closing),
          h('div', { className: 'kx-eyebrow' }, h('span', { className: 'kx-eb-label' }, p.eyebrowLabel)))));
  }

  SlideBigNumber.defaults = {
    eyebrowId: '12', eyebrowLabel: 'AVERAGE TICKET',
    kicker: '把规模换算成单笔，更能看清资本的下注密度。',
    figure: '$1.0', unit: 'B',
    explain: '全年大额融资的 <b>平均单笔规模</b>——融资规模越大，后续兑现压力越高。',
    closing: '融资规模越大，后续兑现压力越高。',
    watermark: 'AVG',
    metrics: [
      { k: '全年融资 / TOTAL', v: '$97B' },
      { k: '大额事件 / DEALS', v: '97' },
      { k: '湾区占比 / BAY AREA', v: '63.9%' },
    ],
    metricCount: 3, align: 'left', showWatermark: true, accent: '#c8f135',
  };

  SlideBigNumber.controls = [
    { key: 'metricCount', label: '辅助指标数量', type: 'number', default: 3, min: 0, max: 3, desc: '大数字下方的辅助指标数量（0 隐藏）' },
    { key: 'align', label: '对齐方式', type: 'select', default: 'left',
      options: [['left', '左对齐'], ['center', '居中']], desc: '主数字区域的对齐方式' },
    { key: 'showWatermark', label: '背景大字', type: 'toggle', default: true, desc: '显示/隐藏背景水印字（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P24 赛道平均融资额 — reuse this component via a preset passed as props.
  // Migration: any host can render <SlideBigNumber {...SlideBigNumber.presetTicket} />.
  SlideBigNumber.presetTicket = {
    eyebrowId: '24', eyebrowLabel: 'AVERAGE TICKET',
    kicker: '把全年融资换算成单笔，才能看清资本的下注密度。',
    figure: '$1.0', unit: 'B',
    explain: '全年大额融资的 <b>平均单笔规模</b>——但垂直应用不应只用融资规模评价，更要看收入效率。',
    closing: '融资规模越大，后续兑现压力越高。',
    watermark: 'TICKET',
    metrics: [
      { k: '全年融资 / TOTAL', v: '$97B' },
      { k: '大额事件 / DEALS', v: '97 笔' },
      { k: '最大单笔 / MAX', v: '$50B' },
    ],
    metricCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

  // P56 最大地理中心 / 旧金山湾区 — reuse this big-number via a preset passed as props.
  // Migration: any host can render <SlideBigNumber {...SlideBigNumber.presetBay} />.
  SlideBigNumber.presetBay = {
    eyebrowId: '56', eyebrowLabel: 'BAY AREA CLUSTER',
    kicker: '一个城市群，吸走了全美 AI 大额融资的大半。',
    figure: '63.9', unit: '%',
    explain: '<b>旧金山湾区</b> 融资额占比——优势来自人才密度、资本网络、云厂商与模型实验室邻近。',
    closing: '湾区仍是 AI 资本重力中心。',
    watermark: 'BAY',
    metrics: [
      { k: '全年融资 / TOTAL', v: '$97B' },
      { k: '大额事件 / DEALS', v: '97 笔' },
      { k: '次位·纽约 / NEXT', v: '12.4%' },
    ],
    metricCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

  // P70 人形机器人 / Figure AI — reuse this big-number via a preset passed as props.
  // Migration: any host can render <SlideBigNumber {...SlideBigNumber.presetFigure} />.
  SlideBigNumber.presetFigure = {
    eyebrowId: '70', eyebrowLabel: 'FIGURE AI CASE',
    kicker: 'demo 之外，硬件 AI 真正的考验是量产。',
    figure: '6.8', unit: '亿$',
    explain: '<b>Figure AI</b> 最大单笔融资——关键不只是 demo，而是供应链、可靠性和量产成本。',
    closing: '硬件 AI 要用量产证明自己。',
    watermark: 'FIGURE',
    metrics: [
      { k: '赛道 / SEGMENT', v: '人形机器人' },
      { k: '方向 / FOCUS', v: '具身智能' },
      { k: '关键 / KEY', v: '量产成本' },
    ],
    metricCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

  // P75 毛利天花板 / 算力成本风险 — reuse this big-number via a preset passed as props.
  // Migration: any host can render <SlideBigNumber {...SlideBigNumber.presetCompute} />.
  SlideBigNumber.presetCompute = {
    eyebrowId: '75', eyebrowLabel: 'COMPUTE COST RISK',
    kicker: '收入还没跑起来，算力账单已经在涨。',
    figure: '61', unit: '%',
    explain: '头部模型公司 <b>训练预算的模拟年增幅</b>——如果推理成本降不下来，收入增长会被毛利吞掉。',
    closing: '算力成本是模型商业化的硬约束。',
    watermark: 'COMPUTE',
    metrics: [
      { k: '毛利率中位数 / MARGIN', v: '54%' },
      { k: '推理成本占收入 / COST', v: '31%' },
      { k: '风险 / RISK', v: '算力成本' },
    ],
    metricCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

  // P86 超级交易均值 — reuse this big-number via a preset passed as props.
  // Migration: any host can render <SlideBigNumber {...SlideBigNumber.presetMega} />.
  SlideBigNumber.presetMega = {
    eyebrowId: '86', eyebrowLabel: 'MEGA-DEAL AVERAGE',
    kicker: '少数几笔交易，重画了全年的融资曲线。',
    figure: '59.8', unit: '亿$',
    explain: '<b>头部 12 笔超级交易</b> 的平均单笔规模——合计 718 亿美元，约占全年大额融资的四分之三。',
    closing: '市场被少数超级交易重新定价。',
    watermark: 'MEGA',
    metrics: [
      { k: '超级交易 / DEALS', v: '12 笔' },
      { k: '合计金额 / TOTAL', v: '$718亿' },
      { k: '占全年 / SHARE', v: '74%' },
    ],
    metricCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

export default SlideBigNumber;
