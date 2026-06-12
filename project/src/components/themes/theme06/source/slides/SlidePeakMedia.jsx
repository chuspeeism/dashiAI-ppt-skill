// ============================================================================
// SlidePeakMedia.jsx — P19 全年峰值季度 / Image-led Peak Quarter Card
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "single period, image-led" page: an oversized period token + a hero
// figure + supporting metrics on the left, and an ADAPTIVE media column on the
// right whose slot count is fully driven by mediaSlotCount (0..n). The layout
// rebalances at every count — 0 slots swaps the media column for a decorative
// peak-curve panel so the composition never looks empty.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   periodLabel,periodCaption                      content — big token + caption
//   hero ({value,unit,label})                      content — hero figure
//   peakTag                                        content — decorative peak badge text
//   metrics ({k,v}[])                              content — supporting metrics
//   mediaSlotCount (int 0..2) VISUAL  adaptive image slots (0 → peak-curve panel)
//   metricCount (int 2..3)    VISUAL  supporting metrics shown
//   focusEnabled (bool)       VISUAL  emphasise one metric
//   focusIndex (int)          VISUAL  which metric
//   showPeakBadge (bool)      VISUAL  decorative "PEAK" badge
//   accent (color)            VISUAL
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-pkm-css')) {
    const css = `
    .kx-pkm-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-pkm-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-pkm-title{font-size:68px;}
    .kx-pkm-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-pkm-main{flex:1;min-height:0;display:grid;column-gap:64px;padding:30px 0 6px;}
    /* left: token + hero + metrics */
    .kx-pkm-left{display:flex;flex-direction:column;min-height:0;}
    .kx-pkm-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
    .kx-pkm-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
    .kx-pkm-token{font-family:var(--kx-disp);font-weight:900;font-size:210px;line-height:.78;letter-spacing:-.03em;
      color:var(--kx-accent);margin:14px 0 0 -6px;}
    .kx-pkm-tcap{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;margin-top:8px;}
    .kx-pkm-hero{margin-top:30px;}
    .kx-pkm-hv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;
      letter-spacing:-.02em;line-height:.86;}
    .kx-pkm-hv .kx-n{font-size:140px;}
    .kx-pkm-hv .kx-u{font-size:46px;color:var(--kx-mute);}
    .kx-pkm-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
      letter-spacing:.04em;margin-top:10px;}
    .kx-pkm-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
    .kx-pkm-mcard{padding:20px 24px 16px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
    .kx-pkm-mcard:last-child{border-right:none;}
    .kx-pkm-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 80%);padding-left:18px;}
    .kx-pkm-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:50px;line-height:.9;letter-spacing:-.02em;}
    .kx-pkm-mcard.kx-on .kx-mv{color:var(--kx-accent);}
    .kx-pkm-mcard .kx-mk{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* right: media column */
    .kx-pkm-media{display:flex;flex-direction:column;gap:22px;min-height:0;justify-content:center;}
    .kx-pkm-media .kx-imgslot{flex:none;}
    /* zero-slot decorative peak panel */
    .kx-pkm-peak{flex:1;min-height:0;border:1px solid var(--kx-line);position:relative;display:flex;
      flex-direction:column;justify-content:flex-end;padding:30px 30px 26px;overflow:hidden;
      background:linear-gradient(180deg,rgba(200,241,53,.05),transparent 60%);}
    .kx-pkm-peakcap{position:absolute;top:26px;left:30px;font-family:var(--kx-mono);font-size:23px;
      color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    .kx-pkm-curve{display:flex;align-items:flex-end;gap:10px;height:62%;}
    .kx-pkm-ccol{flex:1;background:#34342f;border-radius:3px 3px 0 0;}
    .kx-pkm-ccol.kx-peak{background:var(--kx-accent);}
    .kx-pkm-peakmark{display:flex;align-items:baseline;gap:12px;margin-top:20px;}
    .kx-pkm-peakmark .kx-pv{font-family:var(--kx-disp);font-weight:900;font-size:56px;color:var(--kx-accent);line-height:1;}
    .kx-pkm-peakmark .kx-pl{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;text-transform:uppercase;}
    .kx-pkm-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-pkm-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-pkm-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-pkm-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  // ascending peak-curve heights for the zero-slot panel (rise → peak → settle)
  const CURVE = [22, 30, 28, 40, 52, 48, 64, 78, 100, 72, 60, 66];

  function SlidePeakMedia(props) {
    const p = { ...SlidePeakMedia.defaults, ...props };
    const metrics = p.metrics.slice(0, Math.max(2, Math.min(p.metricCount, p.metrics.length)));
    const fi = Math.min(p.focusIndex, metrics.length - 1);
    const slots = Math.max(0, Math.min(p.mediaSlotCount, 2));
    // grid columns rebalance with media presence
    const mainCols = slots === 0 ? '1.04fr 0.96fr' : '0.92fr 1.08fr';

    const left = h('div', { className: 'kx-pkm-left', style: { borderRight: '1px solid var(--kx-line)', paddingRight: '56px' } },
      p.showPeakBadge ? h('div', { className: 'kx-pkm-badge' }, p.peakTag) : null,
      h('div', { className: 'kx-pkm-token' }, p.periodLabel),
      h('div', { className: 'kx-pkm-tcap' }, p.periodCaption),
      h('div', { className: 'kx-pkm-hero' },
        h('div', { className: 'kx-pkm-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-pkm-hl' }, p.hero.label)),
      h('div', { className: 'kx-pkm-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
        metrics.map((m, i) => {
          const on = p.focusEnabled && i === fi;
          return h('div', { key: i, className: 'kx-pkm-mcard' + (on ? ' kx-on' : '') },
            h('span', { className: 'kx-mv' }, m.v),
            h('span', { className: 'kx-mk' }, m.k));
        })));

    const media = slots === 0
      ? h('div', { className: 'kx-pkm-peak' },
          h('div', { className: 'kx-pkm-peakcap' }, '高亮面积图 / PEAK CURVE'),
          h('div', { className: 'kx-pkm-curve' },
            CURVE.map((v, i) => h('div', { key: i,
              className: 'kx-pkm-ccol' + (v === 100 ? ' kx-peak' : ''), style: { height: v + '%' } }))),
          h('div', { className: 'kx-pkm-peakmark' },
            h('span', { className: 'kx-pv' }, p.hero.value),
            h('span', { className: 'kx-pl' }, p.peakTag)))
      : h('div', { className: 'kx-pkm-media' },
          Array.from({ length: slots }, (_, i) =>
            h(KxImageSlot, {
              key: i, id: 'peakmedia-' + i,
              placeholder: '主视觉 / DROP IMAGE',
              badge: slots === 1 ? p.peakTag : ('IMG ' + String(i + 1).padStart(2, '0')),
              minRatio: slots === 1 ? 0.78 : 1.3, maxRatio: slots === 1 ? 1.45 : 2.3,
              style: { width: '100%' },
            })));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-pkm-pad' },
        h('div', { className: 'kx-pkm-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-pkm-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-pkm-sub' }, p.subhead)),
        h('div', { className: 'kx-pkm-main', style: { gridTemplateColumns: mainCols } }, left, media),
        h('div', { className: 'kx-pkm-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, p.periodLabel + ' · ' + (slots === 0 ? 'CURVE' : slots + ' IMG')))));
  }

  SlidePeakMedia.defaults = {
    eyebrowId: '19', eyebrowLabel: 'QUARTER BREAKDOWN',
    title: '全年峰值季度', subhead: 'Q3 融资拆解 / PEAK QUARTER',
    closing: '高峰之后，市场开始从热度转向筛选。',
    periodLabel: 'Q3', periodCaption: '市场情绪高点 / THIRD QUARTER',
    peakTag: '全年峰值 / PEAK',
    hero: { value: '318', unit: '亿$', label: 'Q3 融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '31 笔' },
      { k: '平均单笔 / AVG', v: '10.3 亿' },
      { k: '峰值月份 / PEAK', v: '8 月' },
    ],
    mediaSlotCount: 1, metricCount: 3, focusEnabled: true, focusIndex: 2,
    showPeakBadge: true, accent: '#c8f135',
  };

  SlidePeakMedia.controls = [
    { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
      desc: '右侧自适应图片槽数量（0 改为峰值曲线面板；上传后按图片比例自适应，构图随数量重排）' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 3, desc: '辅助指标的数量' },
    { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标' },
    { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 2, min: 0, max: 2, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
    { key: 'showPeakBadge', label: '峰值徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角峰值徽标（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlidePeakMedia;
