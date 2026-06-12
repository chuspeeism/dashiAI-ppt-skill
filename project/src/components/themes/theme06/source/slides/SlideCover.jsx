// ============================================================================
// SlideCover.jsx — P01 封面 / Hero Cover
// Independent, props-driven slide component. Depends only on kit.jsx primitives.
//
// PROPS (content = static defaults; visual = Tweakable via .controls)
//   eyebrowId,eyebrowLabel,wordmark,statusCenter,statusRight  (string)  content
//   year (string)                         content — big hero figure
//   titleLines (string[])                 content — headline, one entry per line
//   subhead (string)                      content — data caliber line
//   phrase (string)                       content — top-right short message
//   data ({label,value}[])                content — bottom-right caliber rows
//   closing (string)                      content — bottom strip line
//   watermark (string)                    content — ghosted wordmark
//   showWatermark (bool)      VISUAL  show/hide ghosted background wordmark
//   mediaSlotCount (0|1)      VISUAL  number of adaptive media slots
//   focusEnabled (bool)       VISUAL  emphasise one data row
//   focusIndex (int)          VISUAL  which data row is emphasised
//   accent (color)            VISUAL  accent colour
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot, KxStatusBar } from './kit.jsx';

  if (!document.getElementById('kx-cover-css')) {
    const css = `
    .kx-cover-pad{display:grid;grid-template-columns:1fr 540px;grid-template-rows:auto 1fr auto;
      column-gap:64px;row-gap:0;height:100%;}
    .kx-cover-top{grid-column:1/3;display:flex;flex-direction:column;gap:0;}
    .kx-cover-eyebrow{margin-top:40px;}
    .kx-cover-pad{display:flex;flex-direction:column;height:100%;}
    .kx-cover-main{flex:1;min-height:0;display:grid;grid-template-columns:1fr 540px;column-gap:64px;padding-top:34px;}
    .kx-cover-left{display:flex;flex-direction:column;min-height:0;}
    .kx-cover-year{font-family:var(--kx-disp);font-weight:900;line-height:.82;
      letter-spacing:-.03em;font-size:288px;color:var(--kx-accent);margin:6px 0 -6px -6px;}
    .kx-cover-title{font-size:92px;margin-top:6px;}
    .kx-cover-leftfoot{margin-top:auto;display:flex;flex-direction:column;gap:18px;padding-bottom:4px;}
    .kx-cover-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;}
    .kx-cover-rail{display:flex;flex-direction:column;justify-content:flex-start;
      align-items:stretch;gap:20px;min-height:0;}
    .kx-cover-rail>*{flex:none;}
    .kx-cover-spacer{flex:1 1 auto;min-height:18px;}
    .kx-cover-phrase{font-family:var(--kx-disp);font-weight:800;font-size:34px;line-height:1.25;
      text-align:right;margin-left:auto;max-width:520px;}
    .kx-cover-data{width:100%;border-top:1px solid var(--kx-line);}
    .kx-cover-drow{display:flex;justify-content:space-between;align-items:baseline;gap:24px;
      padding:16px 2px;border-bottom:1px solid var(--kx-line);font-family:var(--kx-mono);font-size:26px;}
    .kx-cover-drow .kx-l{color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;font-size:24px;}
    .kx-cover-drow .kx-v{font-weight:700;}
    .kx-cover-drow.kx-on{background:var(--kx-accent);color:var(--kx-ink);margin:0 -8px;padding-left:10px;padding-right:10px;}
    .kx-cover-drow.kx-on .kx-l{color:rgba(0,0,0,.6);}
    .kx-cover-close{grid-column:1/2;align-self:end;}
    .kx-cover-wm{bottom:-58px;right:-10px;font-size:340px;}
    `;
    const s = document.createElement('style'); s.id = 'kx-cover-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideCover(props) {
    const p = { ...SlideCover.defaults, ...props };
    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      p.showWatermark ? h('div', { className: 'kx-wm kx-cover-wm' }, p.watermark) : null,
      h('div', { className: 'kx-pad kx-cover-pad' },
        h(KxStatusBar, { wordmark: p.wordmark, center: p.statusCenter, right: p.statusRight, menu: 'MENU' }),
        h('div', { className: 'kx-cover-main' },
          // left column: eyebrow + year + title, foot anchored at bottom
          h('div', { className: 'kx-cover-left' },
            h('div', { className: 'kx-cover-eyebrow' }, h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel })),
            h('div', { className: 'kx-cover-year' }, p.year),
            h('h1', { className: 'kx-h1 kx-cjk kx-cover-title' },
              p.titleLines.map((l, i) => h('div', { key: i }, l))),
            h('div', { className: 'kx-cover-leftfoot' },
              h('div', { className: 'kx-cover-sub' }, p.subhead),
              h('div', { className: 'kx-mono', style: { color: 'var(--kx-accent)', fontWeight: 700 } }, '→ ' + p.closing))),
          // right rail: phrase, media slot, data anchored at bottom
          h('div', { className: 'kx-cover-rail' },
            h('div', { className: 'kx-cover-phrase' }, p.phrase),
            p.mediaSlotCount > 0
              ? h(KxImageSlot, { id: 'cover-media', placeholder: '封面主视觉 / DROP IMAGE',
                  badge: 'LIVE · ' + p.year, style: { width: '100%', maxHeight: '300px' } })
              : null,
            h('div', { className: 'kx-cover-spacer' }),
            h('div', { className: 'kx-cover-data' },
              p.data.map((d, i) =>
                h('div', { key: i, className: 'kx-cover-drow' + (p.focusEnabled && i === p.focusIndex ? ' kx-on' : '') },
                  h('span', { className: 'kx-l' }, d.label),
                  h('span', { className: 'kx-v' }, d.value))))))));
  }

  SlideCover.defaults = {
    eyebrowId: '01', eyebrowLabel: 'COVER',
    wordmark: 'AI CAPITAL LAB', statusCenter: 'US AI MEGA-FUNDING', statusRight: 'DATA ≥ $100M',
    year: '2024',
    titleLines: ['美国大额融资', 'AI 公司调研报告'],
    subhead: '数据口径：2024 全年 · 单笔 ≥ 1 亿美元',
    phrase: '在资本与算力的浪潮里，每一笔融资都是一次方向的押注。',
    closing: '从资本流向，看 AI 产业下一阶段的真实重心。',
    watermark: 'CAPITAL',
    data: [
      { label: '年份 / YEAR', value: '2024' },
      { label: '口径 / SCOPE', value: '≥ $100M' },
      { label: '日期 / DATE', value: '2026.06' },
      { label: '主题 / TOPIC', value: '美国 AI 大额融资' },
    ],
    showWatermark: true, mediaSlotCount: 1, focusEnabled: true, focusIndex: 1, accent: '#c8f135',
  };

  SlideCover.controls = [
    { key: 'showWatermark', label: '背景大字', type: 'toggle', default: true, desc: '显示/隐藏背景的巨型水印字（装饰文案）' },
    { key: 'mediaSlotCount', label: '媒体占位数量', type: 'number', default: 1, min: 0, max: 1, desc: '右侧主视觉图片槽数量（0 隐藏；上传后按图片比例自适应）' },
    { key: 'focusEnabled', label: '重点信息高亮', type: 'toggle', default: true, desc: '是否高亮一条口径信息' },
    { key: 'focusIndex', label: '高亮第几条', type: 'number', default: 1, min: 0, max: 3, desc: '被高亮的口径行序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideCover;
