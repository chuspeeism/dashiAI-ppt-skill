// ============================================================================
// SlideChapter.jsx — P15 章节分隔页 / Chapter Divider
// Independent, props-driven. Depends only on kit.jsx.
//
// A breathing point in a long deck: oversized chapter index, a big CJK title
// and a short keyword row. Borrows the soft radial "stage glow" backdrop from
// the reference art while keeping the established eyebrow / mono / type system.
//
// PROPS
//   eyebrowId,eyebrowLabel,chapterNo,title,subhead,closing   content
//   keywords (string[])    content — keyword chips
//   watermark (string)     content — ghosted background wordmark
//   showIndex (bool)       VISUAL  show the oversized chapter number
//   keywordCount (int 0..4) VISUAL number of keyword chips shown
//   focusEnabled (bool)    VISUAL  emphasise one keyword chip
//   focusIndex (int)       VISUAL  which keyword
//   background (enum)      VISUAL  'glow' | 'solid' | 'panel'  (backdrop variant)
//   showWatermark (bool)   VISUAL  ghosted background wordmark (decorative)
//   accent (color)         VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-cha-css')) {
    const css = `
    .kx-cha-glow{position:absolute;inset:0;pointer-events:none;
      background:radial-gradient(120% 90% at 26% 122%,rgba(240,239,230,.20),transparent 56%),
                 radial-gradient(80% 70% at 92% -10%,color-mix(in srgb,var(--kx-accent) 22%,transparent),transparent 60%);}
    .kx-cha-panel{position:absolute;right:0;top:0;bottom:0;width:38%;background:var(--kx-accent);
      clip-path:polygon(22% 0,100% 0,100% 100%,0 100%);}
    .kx-cha-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:48px;position:relative;}
    .kx-cha-top{display:flex;justify-content:space-between;align-items:flex-start;}
    .kx-cha-chno{font-family:var(--kx-mono);font-size:26px;letter-spacing:.06em;color:var(--kx-mute-2);
      text-transform:uppercase;text-align:right;}
    .kx-cha-chno b{display:block;color:var(--kx-accent);font-size:30px;}
    .kx-cha-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;}
    .kx-cha-index{font-family:var(--kx-disp);font-weight:900;line-height:.78;letter-spacing:-.04em;
      font-size:392px;color:var(--kx-accent);margin:0 0 -8px -8px;}
    .kx-cha-title{font-size:132px;line-height:.96;margin:0;}
    .kx-cha-sub{font-family:var(--kx-mono);font-size:30px;color:var(--kx-mute);letter-spacing:.05em;margin-top:26px;}
    .kx-cha-foot{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;}
    .kx-cha-kw{display:flex;flex-wrap:wrap;gap:14px;max-width:1180px;}
    .kx-cha-chip{font-family:var(--kx-mono);font-size:26px;font-weight:700;padding:11px 20px;
      letter-spacing:.03em;border:1px solid var(--kx-line);color:var(--kx-cream);background:rgba(255,255,255,.03);
      display:inline-flex;align-items:center;gap:12px;white-space:nowrap;}
    .kx-cha-chip::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-mute-2);}
    .kx-cha-chip.kx-on{background:var(--kx-accent);color:var(--kx-ink);border-color:var(--kx-accent);}
    .kx-cha-chip.kx-on::before{background:var(--kx-ink);}
    .kx-cha-close{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;
      white-space:nowrap;text-align:right;}
    .kx-cha-wm{top:50%;left:50%;transform:translate(-50%,-50%);font-size:560px;opacity:.045;}
    `;
    const s = document.createElement('style'); s.id = 'kx-cha-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideChapter(props) {
    const p = { ...SlideChapter.defaults, ...props };
    const kws = p.keywords.slice(0, Math.max(0, Math.min(p.keywordCount, p.keywords.length)));
    const fi = Math.min(p.focusIndex, Math.max(0, kws.length - 1));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      p.background === 'glow' ? h('div', { className: 'kx-cha-glow' }) : null,
      p.background === 'panel' ? h('div', { className: 'kx-cha-panel' }) : null,
      p.showWatermark ? h('div', { className: 'kx-wm kx-cha-wm' }, p.watermark) : null,

      h('div', { className: 'kx-pad kx-cha-pad' },
        h('div', { className: 'kx-cha-top' },
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('div', { className: 'kx-cha-chno' }, '章节 / SECTION', h('b', null, p.chapterNo))),

        h('div', { className: 'kx-cha-body' },
          p.showIndex ? h('div', { className: 'kx-cha-index' }, p.chapterNo) : null,
          h('h1', { className: 'kx-h1 kx-cjk kx-cha-title' }, p.title),
          h('div', { className: 'kx-cha-sub' }, p.subhead)),

        h('div', { className: 'kx-cha-foot' },
          kws.length
            ? h('div', { className: 'kx-cha-kw' },
                kws.map((k, i) => h('span', { key: i, className: 'kx-cha-chip' + (p.focusEnabled && i === fi ? ' kx-on' : '') }, k)))
            : h('div'),
          h('div', { className: 'kx-cha-close' }, '→ ' + p.closing))));
  }

  SlideChapter.defaults = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 02',
    chapterNo: '02',
    title: '市场数据深拆',
    subhead: '融资节奏 · 集中度 · 交易规模 / MARKET DATA DEEP-DIVE',
    closing: '下一组页面进入更细的拆解。',
    keywords: ['集中度', '季度节奏', '峰谷对比', '资金贡献'],
    watermark: '02',
    showIndex: true, keywordCount: 4, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

  SlideChapter.controls = [
    { key: 'background', label: '背景形态', type: 'select', default: 'glow',
      options: [['glow', '光晕'], ['solid', '纯色'], ['panel', '色块']], desc: '分隔页背景的呈现形式' },
    { key: 'showIndex', label: '大号章节号', type: 'toggle', default: true, desc: '显示/隐藏超大章节编号' },
    { key: 'keywordCount', label: '关键词数量', type: 'number', default: 4, min: 0, max: 6, desc: '底部关键词标签数量（0 隐藏）' },
    { key: 'focusEnabled', label: '关键词高亮', type: 'toggle', default: false, desc: '是否高亮某个关键词标签' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 5, desc: '被高亮的关键词序号', showIf: (p) => p.focusEnabled && p.keywordCount > 0 },
    { key: 'showWatermark', label: '背景大字', type: 'toggle', default: false, desc: '显示/隐藏背景巨型水印字（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P26 赛道结构细分 — reuse this divider via a preset passed as props.
  // Migration: any host can render <SlideChapter {...SlideChapter.presetCh03} />.
  SlideChapter.presetCh03 = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 03',
    chapterNo: '03',
    title: '赛道结构细分',
    subhead: '从大模型到垂直应用 / SECTOR BREAKDOWN',
    closing: '下一组页面进入更细的赛道拆解。',
    keywords: ['通用模型', 'Agent', '企业搜索', '医疗', '金融', '开发者工具'],
    watermark: '03',
    showIndex: true, keywordCount: 6, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

  // P49 资本与地区结构 — reuse this divider via a preset passed as props.
  // Migration: any host can render <SlideChapter {...SlideChapter.presetCh04} />.
  SlideChapter.presetCh04 = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 04',
    chapterNo: '04',
    title: '资本与地区结构',
    subhead: '轮次 · 投资人 · 地理集群 / CAPITAL & GEOGRAPHY',
    closing: '下一组页面进入资本结构的拆解。',
    keywords: ['后期轮', '战略投资', '云资源', '湾区', '纽约', '西雅图'],
    watermark: '04',
    showIndex: true, keywordCount: 6, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

  // P72 风险与策略 — reuse this divider via a preset passed as props.
  // Migration: any host can render <SlideChapter {...SlideChapter.presetCh05} />.
  SlideChapter.presetCh05 = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 05',
    chapterNo: '05',
    title: '风险与策略',
    subhead: '从估值压力到投资筛选 / RISK & STRATEGY',
    closing: '下一组页面进入风险与策略的拆解。',
    keywords: ['估值泡沫', '收入验证', '合规', '算力成本', '垂直应用筛选'],
    watermark: '05',
    showIndex: true, keywordCount: 5, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

  // P83 数据附录精读 — reuse this divider via a preset passed as props.
  // Migration: any host can render <SlideChapter {...SlideChapter.presetCh06} />.
  SlideChapter.presetCh06 = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 06',
    chapterNo: '06',
    title: '数据附录精读',
    subhead: '月度热力 · 超级交易 · 头部集中 / DATA APPENDIX',
    closing: '用数据回看，再做最终判断。',
    keywords: ['月度节奏', '超级交易', '头部集中', '口径回看'],
    watermark: '06',
    showIndex: true, keywordCount: 4, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

  // P87 前瞻信号 — reuse this divider via a preset passed as props.
  // Migration: any host can render <SlideChapter {...SlideChapter.presetCh07} />.
  SlideChapter.presetCh07 = {
    eyebrowId: 'CH', eyebrowLabel: 'CHAPTER 07',
    chapterNo: '07',
    title: '前瞻信号',
    subhead: '2025 年的观察坐标 / FORWARD SIGNALS 2025',
    closing: '附录：用前瞻信号校准下一年的判断。',
    keywords: ['资本流向', '收入兑现', '算力成本', '估值重定', '里程碑节奏'],
    watermark: '07',
    showIndex: true, keywordCount: 5, focusEnabled: false, focusIndex: 0,
    background: 'glow', showWatermark: false, accent: '#c8f135',
  };

export default SlideChapter;
