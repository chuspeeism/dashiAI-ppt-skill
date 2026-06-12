// ============================================================================
// SlideQuote.jsx — P11 结论金句 / Closing Quote
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,kicker   content
//   quote (string)    content — the headline statement
//   source (string)   content — attribution / source line
//   meta ({k,v}[])    content — supporting takeaways
//   watermark (string) content — ghosted background word
//   showMeta (bool)   VISUAL  supporting takeaways row
//   metaCount (int 0..3) VISUAL  how many takeaways
//   align (enum)      VISUAL  'left' | 'center'
//   showWatermark (bool) VISUAL
//   accent (color)    VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-quote-css')) {
    const css = `
    .kx-qt-pad{display:flex;flex-direction:column;height:100%;padding-top:48px;padding-bottom:44px;}
    .kx-qt-top{display:flex;justify-content:space-between;align-items:flex-start;}
    .kx-qt-mark{font-family:var(--kx-disp);font-weight:900;font-size:200px;line-height:.6;
      color:var(--kx-accent);height:88px;overflow:hidden;}
    .kx-qt-main{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
    .kx-qt-main.kx-center{align-items:center;text-align:center;}
    .kx-qt-quote{font-family:var(--kx-disp);font-weight:900;letter-spacing:-.005em;line-height:1.04;
      font-size:118px;max-width:1500px;text-wrap:balance;}
    .kx-qt-quote b{color:var(--kx-accent);}
    .kx-qt-source{font-family:var(--kx-mono);font-size:28px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:40px;}
    .kx-qt-meta{display:grid;gap:0;border-top:1px solid var(--kx-line);margin-top:30px;}
    .kx-qt-mcard{padding:26px 34px 4px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:12px;}
    .kx-qt-mcard:last-child{border-right:none;}
    .kx-qt-mcard .kx-mi{font-family:var(--kx-disp);font-weight:900;font-size:30px;color:var(--kx-accent);}
    .kx-qt-mcard .kx-mt{font-family:var(--kx-disp);font-weight:600;font-size:28px;line-height:1.36;color:var(--kx-cream);}
    .kx-qt-foot{display:flex;justify-content:space-between;align-items:center;padding-top:24px;}
    .kx-qt-wm{bottom:-40px;left:-10px;font-size:300px;}
    `;
    const s = document.createElement('style'); s.id = 'kx-quote-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideQuote(props) {
    const p = { ...SlideQuote.defaults, ...props };
    const meta = p.meta.slice(0, Math.max(0, Math.min(p.metaCount, p.meta.length)));
    const center = p.align === 'center';

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      p.showWatermark ? h('div', { className: 'kx-wm kx-qt-wm' }, p.watermark) : null,
      h('div', { className: 'kx-pad kx-qt-pad' },
        h('div', { className: 'kx-qt-top' },
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)', fontSize: '26px', textAlign: 'right', maxWidth: '460px' } }, p.kicker)),
        h('div', { className: 'kx-qt-main' + (center ? ' kx-center' : '') },
          h('div', { className: 'kx-qt-mark' }, '“'),
          h('div', { className: 'kx-qt-quote', dangerouslySetInnerHTML: { __html: p.quote } }),
          p.source ? h('div', { className: 'kx-qt-source' }, '— ' + p.source) : null),
        p.showMeta && meta.length
          ? h('div', { className: 'kx-qt-meta', style: { gridTemplateColumns: `repeat(${meta.length},1fr)` } },
              meta.map((m, i) => h('div', { key: i, className: 'kx-qt-mcard' },
                h('div', { className: 'kx-mi' }, m.k),
                h('div', { className: 'kx-mt' }, m.v))))
          : null,
        h('div', { className: 'kx-qt-foot' },
          h('div', { className: 'kx-eyebrow' }, h('span', { className: 'kx-eb-label' }, 'END'), h('span', { className: 'kx-eb-caret' }, '_')),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, p.source || ''))));
  }

  SlideQuote.defaults = {
    eyebrowId: '13', eyebrowLabel: 'CONCLUSION',
    kicker: '看融资只是起点，看兑现才是判断。',
    quote: '资本下一阶段，将从<b>赌叙事</b>转向<b>看兑现</b>。',
    source: 'AI CAPITAL LAB · 2024 调研',
    watermark: 'END',
    meta: [
      { k: '01 / 集中', v: '资金高度向头部集中，赢家通吃趋势加强。' },
      { k: '02 / 兑现', v: '热度从 AGI 叙事转向收入与毛利的兑现。' },
      { k: '03 / 筛选', v: '下一阶段淘汰只会讲故事、缺乏壁垒的公司。' },
    ],
    showMeta: true, metaCount: 3, align: 'left', showWatermark: true, accent: '#c8f135',
  };

  SlideQuote.controls = [
    { key: 'showMeta', label: '结论卡', type: 'toggle', default: true, desc: '显示/隐藏底部的支撑结论卡' },
    { key: 'metaCount', label: '结论卡数量', type: 'number', default: 3, min: 0, max: 3, desc: '底部结论卡数量', showIf: (p) => p.showMeta },
    { key: 'align', label: '对齐方式', type: 'select', default: 'left',
      options: [['left', '左对齐'], ['center', '居中']], desc: '金句区域的对齐方式' },
    { key: 'showWatermark', label: '背景大字', type: 'toggle', default: true, desc: '显示/隐藏背景水印字（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P33 研发效率提升 / Developer Tools — quote preset (props only, component unchanged).
  // Demonstrates the reuse model: <SlideQuote {...SlideQuote.presetDev} />.
  SlideQuote.presetDev = {
    eyebrowId: '33', eyebrowLabel: 'DEVELOPER TOOLS',
    kicker: '研发效率提升 / Developer Tools',
    quote: '研发效率，是企业<b>最直接</b>的 AI <b>预算入口</b>之一。',
    source: 'AI CAPITAL LAB · 2024 调研',
    watermark: 'DEV',
    meta: [
      { k: '01 / 嵌入', v: '代码补全与评审嵌入 IDE 流水线，使用频次高。' },
      { k: '02 / 预算', v: '研发效率是企业最容易立项的 AI 预算入口。' },
      { k: '03 / 留存', v: '一旦进入工作流，迁移成本与续费随之上升。' },
    ],
    showMeta: true, metaCount: 3, align: 'left', showWatermark: true, accent: '#c8f135',
  };

  // P61 三类关键资源 / Talent · Capital · Compute — quote preset (props only).
  // Centered closing statement for a chapter; <SlideQuote {...SlideQuote.presetTriad} />.
  SlideQuote.presetTriad = {
    eyebrowId: '61', eyebrowLabel: 'TALENT · CAPITAL · COMPUTE',
    kicker: '三类关键资源 / 人才 · 资本 · 算力三角',
    quote: 'AI 竞争首先是一场<b>资源组织能力</b>的竞争。',
    source: 'AI CAPITAL LAB · 2024 调研',
    watermark: 'TRIAD',
    meta: [
      { k: '人才 / TALENT', v: '顶尖研究员与工程团队的密度，决定模型上限。' },
      { k: '资本 / CAPITAL', v: '持续的大额融资能力，支撑长周期的算力与试错。' },
      { k: '算力 / COMPUTE', v: '稳定的 GPU 供给与云资源，是规模化的硬约束。' },
    ],
    showMeta: true, metaCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

  // P80 最终判断 / Closing — final-verdict quote preset (props only, component unchanged).
  // The genuine end of the deck; <SlideQuote {...SlideQuote.presetClosing} />.
  SlideQuote.presetClosing = {
    eyebrowId: '80', eyebrowLabel: 'CLOSING',
    kicker: '最终判断 / 收尾页',
    quote: '融资盛宴之后，真正的<b>竞争</b>才刚刚开始。',
    source: 'AI CAPITAL LAB · 2024 调研',
    watermark: 'THE END',
    meta: [
      { k: '叙事 → 兑现', v: '资本下一阶段从赌叙事转向看兑现，收入与毛利成为试金石。' },
      { k: '集中 → 筛选', v: '资金高度集中于头部，市场进入残酷的筛选周期。' },
      { k: '热度 → 壁垒', v: '没有数据、流程或资源壁垒的公司将被迅速商品化。' },
    ],
    showMeta: true, metaCount: 3, align: 'center', showWatermark: true, accent: '#c8f135',
  };

export default SlideQuote;
