// ============================================================================
// SlideRisk.jsx — P12 风险研判 / Image-led Risk Chain
// Independent, props-driven. Depends only on kit.jsx (incl. KxImageSlot).
//
// A vertical "transmission chain": each risk is a linked card with a severity
// bar; cards are joined by connectors to read as one chain. A media rail holds
// 0..N adaptive image slots (ratio follows the dropped image) and the column
// layout REBALANCES with the slot count so composition stays clean at 0/1/2.
//
// PROPS (content = static defaults; visual = Tweakable via .controls)
//   eyebrowId,eyebrowLabel,title,subhead,closing,summary   content
//   risks ({name,en,desc,level}[])   content — chain links (level 0..1)
//   railCaption (string)             content — media rail caption
//   cardCount (int 3..5)    VISUAL  number of chain links shown
//   focusEnabled (bool)     VISUAL  emphasise one link
//   focusIndex (int)        VISUAL  which link
//   mediaSlotCount (0..2)   VISUAL  adaptive image slots (rebalances layout)
//   showConnectors (bool)   VISUAL  chain connectors between links (decor)
//   showLevel (bool)        VISUAL  severity bars (decor data-viz)
//   accent (color)          VISUAL  accent colour
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-rsk-css')) {
    const css = `
    .kx-rsk-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-rsk-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-rsk-title{font-size:64px;}
    .kx-rsk-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-rsk-body{flex:1;min-height:0;display:grid;gap:54px;padding:30px 0 6px;align-items:start;}
    /* chain column */
    .kx-rsk-chain{display:flex;flex-direction:column;min-height:0;}
    .kx-rsk-card{border:1px solid var(--kx-line);background:var(--kx-ink-2);
      padding:18px 26px;display:grid;grid-template-columns:62px 1fr;column-gap:24px;row-gap:10px;align-items:center;}
    .kx-rsk-idx{font-family:var(--kx-disp);font-weight:900;font-size:44px;line-height:.8;color:var(--kx-mute-2);grid-row:1/3;}
    .kx-rsk-nmrow{display:flex;align-items:baseline;justify-content:space-between;gap:18px;}
    .kx-rsk-nm{font-family:var(--kx-disp);font-weight:900;font-size:36px;letter-spacing:.02em;line-height:1;}
    .kx-rsk-en{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    .kx-rsk-desc{font-family:var(--kx-disp);font-weight:500;font-size:24px;line-height:1.4;color:var(--kx-mute);}
    .kx-rsk-sev{position:relative;height:13px;width:100%;margin-top:4px;
      background-image:repeating-linear-gradient(45deg,var(--kx-mute-2) 0 2px,transparent 2px 9px);opacity:.85;}
    .kx-rsk-sev i{position:absolute;left:0;top:0;bottom:0;background:var(--kx-accent);display:block;}
    .kx-rsk-card.kx-on{background:var(--kx-accent);border-color:var(--kx-accent);}
    .kx-rsk-card.kx-on .kx-rsk-idx{color:rgba(0,0,0,.35);}
    .kx-rsk-card.kx-on .kx-rsk-nm{color:var(--kx-ink);}
    .kx-rsk-card.kx-on .kx-rsk-en{color:rgba(0,0,0,.55);}
    .kx-rsk-card.kx-on .kx-rsk-desc{color:rgba(0,0,0,.78);}
    .kx-rsk-card.kx-on .kx-rsk-sev{opacity:1;background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.45) 0 2px,transparent 2px 9px);}
    .kx-rsk-card.kx-on .kx-rsk-sev i{background:var(--kx-ink);}
    .kx-rsk-conn{height:20px;width:62px;display:flex;align-items:center;justify-content:center;flex:none;}
    .kx-rsk-conn::before{content:'';width:1px;height:100%;background:var(--kx-line);}
    .kx-rsk-conn span{position:absolute;font-family:var(--kx-mono);font-size:18px;color:var(--kx-accent);}
    /* media rail */
    .kx-rsk-rail{display:flex;flex-direction:column;gap:18px;min-height:0;}
    .kx-rsk-cap{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;
      padding-bottom:12px;border-bottom:1px solid var(--kx-line);}
    .kx-rsk-cap b{color:var(--kx-accent);font-weight:700;}
    .kx-rsk-media{display:flex;flex-direction:column;gap:16px;}
    .kx-rsk-panel{border:1px solid var(--kx-line);background:var(--kx-ink-2);padding:34px 32px;
      display:flex;flex-direction:column;gap:22px;}
    .kx-rsk-panel .kx-big{font-family:var(--kx-disp);font-weight:800;font-size:34px;line-height:1.3;}
    .kx-rsk-panel .kx-big b{color:var(--kx-accent);}
    .kx-rsk-agg{display:flex;flex-direction:column;gap:10px;}
    .kx-rsk-agg .kx-agl{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);
      letter-spacing:.04em;text-transform:uppercase;display:flex;justify-content:space-between;}
    .kx-rsk-agg .kx-agl b{color:var(--kx-accent);font-weight:700;}
    .kx-rsk-summary{font-family:var(--kx-disp);font-weight:600;font-size:25px;line-height:1.45;color:var(--kx-mute);}
    .kx-rsk-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-rsk-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-rsk-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);}
    `;
    const s = document.createElement('style'); s.id = 'kx-rsk-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const pad2 = (n) => String(n + 1).padStart(2, '0');

  function SlideRisk(props) {
    const p = { ...SlideRisk.defaults, ...props };
    const risks = p.risks.slice(0, Math.max(1, Math.min(p.cardCount, p.risks.length)));
    const fi = Math.min(p.focusIndex, risks.length - 1);
    const slots = Math.max(0, Math.min(p.mediaSlotCount, 2));
    // composition rebalance: wider chain when no media, fixed rail when media present
    const cols = slots > 0 ? '1fr 600px' : '1.55fr 1fr';
    const avg = risks.reduce((a, r) => a + r.level, 0) / risks.length;
    const aggLabel = avg >= 0.8 ? '高' : avg >= 0.6 ? '偏高' : '中';

    // media rail body adapts to slot count
    let railBody;
    if (slots === 0) {
      railBody = h('div', { className: 'kx-rsk-panel' },
        h('div', { className: 'kx-big', dangerouslySetInnerHTML: { __html: p.summary } }),
        p.showLevel ? h('div', { className: 'kx-rsk-agg' },
          h('div', { className: 'kx-agl' }, h('span', null, '综合风险水位'), h('b', null, aggLabel + ' · ' + Math.round(avg * 100) + '%')),
          h('div', { className: 'kx-rsk-sev', style: { height: '16px', opacity: 1 } }, h('i', { style: { width: (avg * 100) + '%' } }))) : null);
    } else {
      const slotStyle = slots === 1 ? { width: '100%', maxHeight: '520px' } : { width: '100%', maxHeight: '300px' };
      railBody = h('div', { className: 'kx-rsk-media' },
        Array.from({ length: slots }, (_, i) =>
          h(KxImageSlot, { key: i, id: 'risk-media-' + i, placeholder: '风险主视觉 / DROP IMAGE',
            badge: 'RISK ' + pad2(i), minRatio: 0.75, maxRatio: slots === 1 ? 1.7 : 2.1, style: slotStyle })),
        h('div', { className: 'kx-rsk-summary', dangerouslySetInnerHTML: { __html: p.summary } }));
    }

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-rsk-pad' },
        h('div', { className: 'kx-rsk-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-rsk-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-rsk-sub' }, p.subhead)),

        h('div', { className: 'kx-rsk-body', style: { gridTemplateColumns: cols } },
          // chain column
          h('div', { className: 'kx-rsk-chain' },
            risks.map((r, i) => {
              const on = p.focusEnabled && i === fi;
              return h(React.Fragment, { key: i },
                p.showConnectors && i > 0
                  ? h('div', { className: 'kx-rsk-conn' }, h('span', null, '▼')) : null,
                h('div', { className: 'kx-rsk-card' + (on ? ' kx-on' : '') },
                  h('div', { className: 'kx-rsk-idx' }, pad2(i)),
                  h('div', null,
                    h('div', { className: 'kx-rsk-nmrow' },
                      h('span', { className: 'kx-rsk-nm' }, r.name),
                      h('span', { className: 'kx-rsk-en' }, r.en)),
                    h('div', { className: 'kx-rsk-desc' }, r.desc)),
                  p.showLevel ? h('div', { className: 'kx-rsk-sev', style: { gridColumn: '2/3' } },
                    h('i', { style: { width: Math.round(r.level * 100) + '%' } })) : null));
            })),
          // media rail
          h('div', { className: 'kx-rsk-rail' },
            h('div', { className: 'kx-rsk-cap' },
              h('span', null, p.railCaption),
              h('b', null, slots > 0 ? slots + ' 图' : aggLabel + '风险')),
            railBody)),

        h('div', { className: 'kx-rsk-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, risks.length + ' 项风险 / ' + p.risks.length + ' RISKS'))));
  }

  SlideRisk.defaults = {
    eyebrowId: '10', eyebrowLabel: 'RISK ASSESSMENT',
    title: '风险研判', subhead: '资本大年背后的下行因素',
    summary: '高估值、盈利验证、监管压力、大厂竞争与算力成本，构成一条<b>互相传导的风险链条</b>。',
    railCaption: '风险传导 / TRANSMISSION',
    closing: '下一阶段会淘汰只会讲故事的公司。',
    risks: [
      { name: '估值泡沫', en: 'VALUATION', level: 0.9, desc: '一级市场估值透支，二级承压后将向上游传导。' },
      { name: '盈利验证', en: 'MONETIZATION', level: 0.78, desc: '试点难转稳定订阅收入，毛利与留存仍待验证。' },
      { name: '监管合规', en: 'REGULATION', level: 0.62, desc: '隐私、版权与安全审查抬高交付与采购成本。' },
      { name: '大厂挤压', en: 'BIG TECH', level: 0.7, desc: '开源与平台生态压缩初创公司的独立空间。' },
      { name: '算力成本', en: 'COMPUTE', level: 0.85, desc: '训练与推理成本卡住模型商业化的毛利天花板。' },
    ],
    cardCount: 5, focusEnabled: true, focusIndex: 0, mediaSlotCount: 1,
    showConnectors: true, showLevel: true, accent: '#c8f135',
  };

  SlideRisk.controls = [
    { key: 'cardCount', label: '风险链节数量', type: 'number', default: 5, min: 3, max: 5, desc: '展示的风险链节数量' },
    { key: 'mediaSlotCount', label: '媒体占位数量', type: 'number', default: 1, min: 0, max: 2, desc: '右侧图片槽数量（0 时改为摘要面板；上传后按图片比例自适应，布局随数量重排）' },
    { key: 'focusEnabled', label: '重点风险高亮', type: 'toggle', default: true, desc: '是否突出某一风险链节' },
    { key: 'focusIndex', label: '高亮第几项', type: 'number', default: 0, min: 0, max: 4, desc: '被突出的风险链节序号', showIf: (p) => p.focusEnabled },
    { key: 'showConnectors', label: '链条连接线', type: 'toggle', default: true, desc: '显示/隐藏链节之间的传导连接线（装饰）' },
    { key: 'showLevel', label: '风险水位条', type: 'toggle', default: true, desc: '显示/隐藏每项的风险水位条（装饰数据）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideRisk;
