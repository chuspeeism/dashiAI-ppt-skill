// ============================================================================
// SlideCases.jsx — P08 典型案例 / Image-led Case Cards
// Independent, props-driven. Depends only on kit.jsx (incl. KxImageSlot).
//
// Image slots are ADAPTIVE (follow the dropped image's natural ratio) and the
// COUNT is driven by cardCount — composition rebalances at 1 / 2 / 3 cards.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   cases ({name,tag,en,metrics:[{k,v}]}[])   content — case cards
//   cardCount (int 1..3)  VISUAL  number of case cards (= number of image slots)
//   focusEnabled (bool)   VISUAL  emphasise one card
//   focusIndex (int)      VISUAL  which card
//   showImage (bool)      VISUAL  show/hide the adaptive image slots
//   metricCount (int 1..3) VISUAL metrics shown per card
//   accent (color)        VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-case-css')) {
    const css = `
    .kx-cse-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-cse-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line-d);}
    .kx-cse-title{font-size:64px;}
    .kx-cse-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-cse-grid{flex:1;min-height:0;display:grid;gap:30px;padding:32px 0 6px;align-content:stretch;}
    .kx-cse-card{border:1px solid var(--kx-line-d);display:flex;flex-direction:column;min-height:0;
      background:#fff;overflow:hidden;}
    .kx-cse-card.kx-on{border-color:var(--kx-accent);box-shadow:0 14px 40px rgba(0,0,0,.12);}
    .kx-cse-slot{width:100%;flex:none;}
    .kx-cse-meta{padding:24px 26px;display:flex;flex-direction:column;gap:14px;flex:1;min-height:0;}
    .kx-cse-tag{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.05em;
      display:flex;justify-content:space-between;align-items:center;white-space:nowrap;gap:14px;}
    .kx-cse-tag .kx-badge{background:var(--kx-accent);color:var(--kx-ink);padding:2px 11px;font-weight:700;letter-spacing:.04em;}
    .kx-cse-nm{font-family:var(--kx-disp);font-weight:900;font-size:40px;letter-spacing:.01em;line-height:1;}
    .kx-cse-metrics{display:flex;flex-direction:column;gap:0;margin-top:auto;}
    .kx-cse-mrow{display:flex;justify-content:space-between;align-items:baseline;gap:18px;
      padding:11px 0;border-top:1px solid var(--kx-line-d);font-family:var(--kx-mono);}
    .kx-cse-mrow .kx-mk{font-size:23px;color:var(--kx-mute-2);letter-spacing:.02em;}
    .kx-cse-mrow .kx-mv{font-size:27px;font-weight:700;}
    .kx-cse-card.kx-on .kx-cse-mrow .kx-mv{color:#111;}
    /* single-card horizontal variant */
    .kx-cse-grid.kx-one{grid-template-columns:1fr;}
    .kx-cse-grid.kx-one .kx-cse-card{flex-direction:row;}
    .kx-cse-grid.kx-one .kx-cse-slot{width:46%;align-self:stretch;display:flex;}
    .kx-cse-grid.kx-one .kx-cse-meta{flex:1;justify-content:center;gap:22px;padding:48px 52px;}
    .kx-cse-grid.kx-one .kx-cse-nm{font-size:64px;}
    .kx-cse-grid.kx-one .kx-cse-mrow .kx-mv{font-size:32px;}
    .kx-cse-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;}
    .kx-cse-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);}
    `;
    const s = document.createElement('style'); s.id = 'kx-case-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideCases(props) {
    const p = { ...SlideCases.defaults, ...props };
    const cases = p.cases.slice(0, Math.max(1, Math.min(p.cardCount, p.cases.length)));
    const one = cases.length === 1;
    const fi = Math.min(p.focusIndex, cases.length - 1);
    // image slot follows the dropped image ratio; placeholder ratio differs per layout
    const slotStyle = one ? { width: '100%', height: '100%' } : { width: '100%', maxHeight: '300px' };

    return h('div', { className: 'kx-slide kx-light', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-cse-pad' },
        h('div', { className: 'kx-cse-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-cse-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-cse-sub' }, p.subhead)),

        h('div', { className: 'kx-cse-grid' + (one ? ' kx-one' : ''),
          style: { gridTemplateColumns: one ? '1fr' : `repeat(${cases.length},1fr)` } },
          cases.map((c, i) => {
            const on = p.focusEnabled && i === fi;
            const metrics = c.metrics.slice(0, Math.max(1, Math.min(p.metricCount, c.metrics.length)));
            return h('div', { key: i, className: 'kx-cse-card' + (on ? ' kx-on' : '') },
              p.showImage ? h('div', { className: 'kx-cse-slot' },
                h(KxImageSlot, { id: 'case-' + i, placeholder: '案例配图 / DROP IMAGE',
                  badge: on ? 'FOCUS' : ('CASE ' + String(i + 1).padStart(2, '0')),
                  minRatio: one ? 0.7 : 1.2, maxRatio: one ? 1.4 : 2.0, style: slotStyle })) : null,
              h('div', { className: 'kx-cse-meta' },
                h('div', { className: 'kx-cse-tag' },
                  h('span', null, c.en),
                  on ? h('span', { className: 'kx-badge' }, 'FOCUS') : null),
                h('div', { className: 'kx-cse-nm' }, c.name),
                h('div', { className: 'kx-mono', style: { fontSize: '24px', color: '#444' } }, c.tag),
                h('div', { className: 'kx-cse-metrics' },
                  metrics.map((m, k) => h('div', { key: k, className: 'kx-cse-mrow' },
                    h('span', { className: 'kx-mk' }, m.k),
                    h('span', { className: 'kx-mv' }, m.v))))));
          })),

        h('div', { className: 'kx-cse-foot' },
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-accent)', fontWeight: 700 } }, '→ ' + p.closing),
          h('div', { className: 'kx-cse-foot' }, h('span', { className: 'kx-cl' }, cases.length + ' 例 / ' + p.cases.length + ' CASES')))));
  }

  SlideCases.defaults = {
    eyebrowId: '08', eyebrowLabel: 'CASE STUDIES',
    title: '典型案例深度剖析', subhead: '三类资本逻辑的代表公司',
    closing: '不同案例共同指向：技术优势能否转成可持续收入。',
    cases: [
      { name: 'Anthropic', en: 'SAFETY MODEL', tag: '安全对齐 / Claude / 长上下文',
        metrics: [{ k: '累计融资', v: '$65B+' }, { k: '定位', v: '企业级可信' }, { k: '客户', v: '云 · 金融' }] },
      { name: 'xAI', en: 'REALTIME DATA', tag: '实时数据 / 多模态 / X 平台',
        metrics: [{ k: '单笔融资', v: '$50B' }, { k: '数据入口', v: 'X 平台' }, { k: '协同', v: '特斯拉' }] },
      { name: 'CoreWeave', en: 'GPU CLOUD', tag: 'GPU 云 / 算力资源 / 推理',
        metrics: [{ k: '融资额', v: '$11B' }, { k: 'GPU 资源', v: '7.8 万张' }, { k: '客户', v: '模型公司' }] },
    ],
    cardCount: 3, focusEnabled: true, focusIndex: 0, showImage: true, metricCount: 3, accent: '#c8f135',
  };

  SlideCases.controls = [
    { key: 'cardCount', label: '案例卡数量', type: 'number', default: 3, min: 1, max: 3, desc: '案例卡数量（同时决定图片槽数量；1 张时为横向大卡）' },
    { key: 'showImage', label: '图片槽', type: 'toggle', default: true, desc: '显示/隐藏案例配图槽（上传后按图片比例自适应）' },
    { key: 'metricCount', label: '每卡指标数', type: 'number', default: 3, min: 1, max: 3, desc: '每张卡展示的指标条数' },
    { key: 'focusEnabled', label: '重点案例高亮', type: 'toggle', default: true, desc: '是否突出某一案例卡' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 2, desc: '被突出的案例卡序号', showIf: (p) => p.focusEnabled },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideCases;
