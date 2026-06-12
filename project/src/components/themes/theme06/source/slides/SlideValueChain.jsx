// ============================================================================
// SlideValueChain.jsx — P07 产业链分层 / Layered Value Chain
// Independent, props-driven. Depends only on kit.jsx.
//
// PROPS
//   eyebrowId,eyebrowLabel,title,subhead,closing   content
//   layers ({tier,name,en,items[]}[])  content — value-chain tiers (top→bottom)
//   regions ({name,v}[])               content — side region distribution
//   layerCount (int 2..3)  VISUAL  number of tiers shown
//   focusEnabled (bool)    VISUAL  emphasise one tier
//   focusIndex (int)       VISUAL  which tier
//   layout (enum)          VISUAL  'stack' | 'columns'
//   showRegion (bool)      VISUAL  side region distribution panel
//   accent (color)         VISUAL
// ============================================================================
import React from 'react';
import { KxChip, KxEyebrow, KxGrid } from './kit.jsx';

  if (!document.getElementById('kx-chain-css')) {
    const css = `
    .kx-chn-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-chn-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-chn-title{font-size:66px;}
    .kx-chn-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-chn-body{flex:1;min-height:0;display:grid;gap:48px;padding:34px 0 8px;align-content:center;}
    /* tiers */
    .kx-chn-tiers{display:flex;flex-direction:column;gap:18px;min-width:0;}
    .kx-chn-tiers.kx-cols{flex-direction:row;gap:22px;align-items:stretch;}
    .kx-chn-tier{border:1px solid var(--kx-line);padding:28px 32px;display:grid;
      grid-template-columns:128px 1fr;gap:30px;align-items:center;position:relative;background:var(--kx-ink-2);}
    .kx-chn-tiers.kx-cols .kx-chn-tier{flex:1;grid-template-columns:1fr;gap:18px;align-content:flex-start;}
    .kx-chn-mk{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.05em;text-transform:uppercase;}
    .kx-chn-nm{font-family:var(--kx-disp);font-weight:900;font-size:42px;letter-spacing:.02em;line-height:1;}
    .kx-chn-en{font-family:var(--kx-mono);font-size:22px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.05em;margin-top:7px;}
    .kx-chn-items{display:flex;flex-wrap:wrap;gap:10px;}
    .kx-chn-tier.kx-on{border-color:var(--kx-accent);background:rgba(200,241,53,.07);}
    .kx-chn-tier.kx-on::before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--kx-accent);}
    .kx-chn-tiers.kx-cols .kx-chn-tier.kx-on::before{right:0;left:0;bottom:auto;width:auto;height:5px;}
    .kx-chn-tier.kx-on .kx-chn-nm{color:var(--kx-accent);}
    /* region panel */
    .kx-chn-region{align-self:stretch;display:flex;flex-direction:column;}
    .kx-chn-rh{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);text-transform:uppercase;
      letter-spacing:.05em;display:flex;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--kx-line);}
    .kx-chn-rrow{display:flex;align-items:center;gap:16px;padding:15px 0;border-bottom:1px solid var(--kx-line);}
    .kx-chn-rrow .kx-rn{font-family:var(--kx-mono);font-size:25px;width:130px;flex:none;letter-spacing:.02em;}
    .kx-chn-rrow .kx-rt{flex:1;height:16px;background:#2a2a26;position:relative;}
    .kx-chn-rrow .kx-rf{height:100%;background:var(--kx-cream);display:block;}
    .kx-chn-rrow.kx-top .kx-rf{background:var(--kx-accent);}
    .kx-chn-rrow .kx-rp{font-family:var(--kx-mono);font-weight:700;font-size:25px;width:88px;text-align:right;}
    .kx-chn-foot{display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid var(--kx-line);}
    .kx-chn-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    `;
    const s = document.createElement('style'); s.id = 'kx-chain-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;

  function SlideValueChain(props) {
    const p = { ...SlideValueChain.defaults, ...props };
    const layers = p.layers.slice(0, Math.max(2, Math.min(p.layerCount, p.layers.length)));
    const cols = p.layout === 'columns';
    const fi = Math.min(p.focusIndex, layers.length - 1);
    const rmax = Math.max(...p.regions.map((r) => r.v));

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-chn-pad' },
        h('div', { className: 'kx-chn-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-chn-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-chn-sub' }, p.subhead)),

        h('div', { className: 'kx-chn-body',
          style: { gridTemplateColumns: p.showRegion ? '1fr 520px' : '1fr' } },
          h('div', { className: 'kx-chn-tiers' + (cols ? ' kx-cols' : '') },
            layers.map((l, i) => {
              const on = p.focusEnabled && i === fi;
              return h('div', { key: i, className: 'kx-chn-tier' + (on ? ' kx-on' : '') },
                h('div', { className: 'kx-chn-mk' }, l.tier),
                h('div', null,
                  h('div', { className: 'kx-chn-nm' }, l.name),
                  h('div', { className: 'kx-chn-en' }, l.en),
                  h('div', { className: 'kx-chn-items', style: { marginTop: '16px' } },
                    l.items.map((it, k) => h(KxChip, { key: k, on: on }, it)))));
            })),
          p.showRegion ? h('div', { className: 'kx-chn-region' },
            h('div', { className: 'kx-chn-rh' }, h('span', null, '地区分布'), h('span', null, 'REGION %')),
            h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 } },
              p.regions.map((r, i) => h('div', { key: i, className: 'kx-chn-rrow' + (i === 0 ? ' kx-top' : '') },
                h('span', { className: 'kx-rn' }, r.name),
                h('span', { className: 'kx-rt' }, h('span', { className: 'kx-rf', style: { width: (r.v / rmax * 100) + '%' } })),
                h('span', { className: 'kx-rp' }, r.v + '%'))))) : null),

        h('div', { className: 'kx-chn-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-mono', style: { color: 'var(--kx-mute-2)' } }, layers.length + ' 层 / ' + p.layers.length + ' TIERS'))));
  }

  SlideValueChain.defaults = {
    eyebrowId: '07', eyebrowLabel: 'VALUE CHAIN',
    title: '产业链分层透视', subhead: '上游、中游、下游的资本位置',
    closing: '产业链分层决定了资本确定性与商业风险的不同位置。',
    layers: [
      { tier: '上游 / UPSTREAM', name: '基础设施层', en: 'Infrastructure', items: ['算力', 'AI 芯片', '数据'] },
      { tier: '中游 / MIDSTREAM', name: '模型层', en: 'Model Layer', items: ['通用模型', '专用模型', '安全对齐'] },
      { tier: '下游 / DOWNSTREAM', name: '应用层', en: 'Application', items: ['企业应用', '搜索', '机器人'] },
    ],
    regions: [
      { name: '旧金山湾区', v: 63.9 }, { name: '纽约', v: 12.4 },
      { name: '西雅图', v: 9.8 }, { name: '波士顿', v: 7.7 }, { name: '其他', v: 6.2 },
    ],
    layerCount: 3, focusEnabled: true, focusIndex: 1, layout: 'stack', showRegion: true, accent: '#c8f135',
  };

  SlideValueChain.controls = [
    { key: 'layerCount', label: '产业层数量', type: 'number', default: 3, min: 2, max: 3, desc: '展示的产业链层级数量' },
    { key: 'layout', label: '排布方式', type: 'select', default: 'stack',
      options: [['stack', '堆叠'], ['columns', '并列']], desc: '层级的排布形式' },
    { key: 'focusEnabled', label: '重点层高亮', type: 'toggle', default: true, desc: '是否突出某一产业层' },
    { key: 'focusIndex', label: '高亮第几层', type: 'number', default: 1, min: 0, max: 2, desc: '被突出的产业层序号', showIf: (p) => p.focusEnabled },
    { key: 'showRegion', label: '地区分布面板', type: 'toggle', default: true, desc: '显示/隐藏右侧地区分布面板' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

export default SlideValueChain;
