// ============================================================================
// SlideBranch.jsx — P31 慢变量高壁垒 / Branch Structure (image-led)
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// A generic "one root → N branches" structure page. A funding root (hero figure
// + supporting metrics) on the left feeds a vertical trunk that fans out into N
// branch nodes, each carrying a value + relative funding bar — i.e. a clean
// brutalist "structure diagram". An ADAPTIVE media column (mediaSlotCount 0..n)
// sits on the far right; at 0 the branch column widens so composition stays
// balanced at every slot count, and uploaded images self-size to their ratio.
//
// PROPS (content)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   rootTag                       root badge (decorative)
//   hero ({value,unit,label})     headline funding figure (the root)
//   metrics ({k,v}[])             supporting metric cards under the root
//   branches ({name,en,value,unit}[]) branch nodes (the structure)
//   mediaPlaceholder              image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   branchCount (int 2..4)    branch nodes shown
//   mediaSlotCount (int 0..2) adaptive image slots (0 → branch column widens)
//   metricCount (int 1..3)    supporting metric cards
//   focusEnabled (bool)       emphasise one branch node
//   focusIndex (int)          which branch
//   showTrunk (bool)          connector trunk + node dots (decorative)
//   showValueBars (bool)      per-branch funding bars (decorative data)
//   showRootBadge (bool)      root badge chip (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

  if (!document.getElementById('kx-brn-css')) {
    const css = `
    .kx-brn-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
    .kx-brn-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
      padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
    .kx-brn-title{font-size:68px;}
    .kx-brn-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;}
    .kx-brn-main{flex:1;min-height:0;display:grid;column-gap:56px;padding:30px 0 6px;}
    /* root column */
    .kx-brn-root{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:52px;}
    .kx-brn-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
      font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
      background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
    .kx-brn-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
    .kx-brn-hero{margin-top:30px;}
    .kx-brn-hv{display:flex;align-items:baseline;gap:10px;font-family:var(--kx-disp);font-weight:800;
      letter-spacing:-.02em;line-height:.82;white-space:nowrap;}
    .kx-brn-hv .kx-n{font-size:188px;color:var(--kx-accent);}
    .kx-brn-hv .kx-u{font-size:54px;color:var(--kx-mute);white-space:nowrap;}
    .kx-brn-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
      letter-spacing:.04em;margin-top:14px;}
    .kx-brn-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
    .kx-brn-mcard{padding:20px 22px 14px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
    .kx-brn-mcard:last-child{border-right:none;}
    .kx-brn-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:46px;line-height:.9;letter-spacing:-.02em;}
    .kx-brn-mcard .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
    /* branch column */
    .kx-brn-tree{position:relative;display:flex;flex-direction:column;min-height:0;justify-content:center;gap:22px;}
    .kx-brn-treecap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
      text-transform:uppercase;position:absolute;top:0;left:0;}
    .kx-brn-node{display:grid;grid-template-columns:30px 1fr;align-items:stretch;}
    .kx-brn-rail{position:relative;}
    .kx-brn-rail::before{content:'';position:absolute;left:5px;top:0;bottom:0;width:2px;background:var(--kx-line);}
    .kx-brn-node:first-of-type .kx-brn-rail::before{top:50%;}
    .kx-brn-node:last-of-type .kx-brn-rail::before{bottom:50%;}
    .kx-brn-rail i{position:absolute;left:0;top:50%;transform:translateY(-50%);width:12px;height:12px;
      border-radius:50%;background:var(--kx-ink);border:2px solid var(--kx-mute-2);z-index:2;}
    .kx-brn-rail::after{content:'';position:absolute;left:11px;top:50%;width:19px;height:2px;
      transform:translateY(-50%);background:var(--kx-line);}
    .kx-brn-node.kx-on .kx-brn-rail i{background:var(--kx-accent);border-color:var(--kx-accent);width:16px;height:16px;}
    .kx-brn-node.kx-on .kx-brn-rail::after{background:var(--kx-accent);}
    .kx-brn-card{border:1px solid var(--kx-line);border-left:3px solid var(--kx-mute-2);
      padding:18px 24px 16px;display:flex;flex-direction:column;gap:13px;background:rgba(255,255,255,.015);}
    .kx-brn-node.kx-on .kx-brn-card{border-color:var(--kx-accent);border-left-color:var(--kx-accent);
      background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 13%,transparent),transparent 85%);}
    .kx-brn-crow{display:flex;justify-content:space-between;align-items:baseline;gap:18px;}
    .kx-brn-nm{display:flex;flex-direction:column;gap:4px;}
    .kx-brn-nm .kx-k{font-family:var(--kx-disp);font-weight:800;font-size:38px;line-height:1;letter-spacing:-.01em;}
    .kx-brn-nm .kx-e{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.03em;}
    .kx-brn-v{font-family:var(--kx-disp);font-weight:800;font-size:52px;line-height:.9;letter-spacing:-.02em;}
    .kx-brn-node.kx-on .kx-brn-v,.kx-brn-node.kx-on .kx-brn-nm .kx-k{color:var(--kx-accent);}
    .kx-brn-track{height:12px;background:#26261f;}
    .kx-brn-fill{height:100%;background:#3a3a32;}
    .kx-brn-node.kx-on .kx-brn-fill{background:var(--kx-accent);}
    /* media column */
    .kx-brn-media{display:flex;flex-direction:column;gap:20px;min-height:0;justify-content:center;}
    .kx-brn-media .kx-imgslot{flex:none;}
    .kx-brn-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
    .kx-brn-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
    .kx-brn-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
    `;
    const s = document.createElement('style'); s.id = 'kx-brn-css'; s.textContent = css; document.head.appendChild(s);
  }
  const h = React.createElement;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function SlideBranch(props) {
    const p = { ...SlideBranch.defaults, ...props };
    const metrics = p.metrics.slice(0, clamp(p.metricCount, 1, p.metrics.length));
    const branches = p.branches.slice(0, clamp(p.branchCount, 2, p.branches.length));
    const fi = clamp(p.focusIndex, 0, branches.length - 1);
    const slots = clamp(p.mediaSlotCount, 0, 2);
    const maxV = Math.max(...branches.map((b) => b.value));
    // grid rebalances with the media column's presence
    const mainCols = slots === 0 ? '0.82fr 1.18fr' : '0.74fr 1.02fr 0.78fr';

    const root = h('div', { className: 'kx-brn-root' },
      p.showRootBadge ? h('div', { className: 'kx-brn-badge' }, p.rootTag) : null,
      h('div', { className: 'kx-brn-hero', style: p.showRootBadge ? null : { marginTop: 0 } },
        h('div', { className: 'kx-brn-hv' },
          h('span', { className: 'kx-n' }, p.hero.value),
          p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
        h('div', { className: 'kx-brn-hl' }, p.hero.label)),
      h('div', { className: 'kx-brn-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
        metrics.map((m, i) => h('div', { key: i, className: 'kx-brn-mcard' },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k)))));

    const tree = h('div', { className: 'kx-brn-tree' + (p.showTrunk ? '' : ' kx-notrunk') },
      h('div', { className: 'kx-brn-treecap' }, '分支结构 / STRUCTURE'),
      h('div', { style: { height: '14px' } }),
      branches.map((b, i) => {
        const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-brn-node' + (on ? ' kx-on' : '') },
          p.showTrunk ? h('div', { className: 'kx-brn-rail' }, h('i')) : h('div'),
          h('div', { className: 'kx-brn-card' },
            h('div', { className: 'kx-brn-crow' },
              h('div', { className: 'kx-brn-nm' },
                h('span', { className: 'kx-k' }, b.name),
                h('span', { className: 'kx-e' }, b.en)),
              h('span', { className: 'kx-brn-v' }, b.value + (b.unit || ''))),
            p.showValueBars ? h('div', { className: 'kx-brn-track' },
              h('div', { className: 'kx-brn-fill', style: { width: ((b.value / maxV) * 100) + '%' } })) : null));
      }));

    const media = slots > 0 ? h('div', { className: 'kx-brn-media' },
      Array.from({ length: slots }, (_, i) =>
        h(KxImageSlot, {
          key: i, id: 'branch-' + (p.eyebrowId || 'x') + '-' + i,
          placeholder: p.mediaPlaceholder || '主视觉 / DROP IMAGE',
          badge: slots === 1 ? p.rootTag : ('IMG ' + String(i + 1).padStart(2, '0')),
          minRatio: slots === 1 ? 0.7 : 0.9, maxRatio: slots === 1 ? 1.3 : 1.9,
          style: { width: '100%' },
        }))) : null;

    return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
      h(KxGrid, { cols: 6 }),
      h('div', { className: 'kx-pad kx-brn-pad' },
        h('div', { className: 'kx-brn-head' },
          h('div', null,
            h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
            h('h2', { className: 'kx-h2 kx-cjk kx-brn-title', style: { marginTop: '16px' } }, p.title)),
          h('div', { className: 'kx-brn-sub' }, p.subhead)),
        h('div', { className: 'kx-brn-main', style: { gridTemplateColumns: mainCols } },
          root, tree, media),
        h('div', { className: 'kx-brn-foot' },
          h('div', { className: 'kx-cl' }, '→ ' + p.closing),
          h('div', { className: 'kx-rt' }, branches.length + ' 支 / ' + (slots === 0 ? 'STRUCTURE' : slots + ' IMG')))));
  }

  SlideBranch.defaults = {
    eyebrowId: '31', eyebrowLabel: 'HEALTHCARE AI',
    title: '慢变量高壁垒', subhead: '医疗 AI 赛道 / HEALTHCARE AI',
    closing: '慢场景不代表低价值。',
    rootTag: '医疗 AI 赛道 / HEALTH',
    hero: { value: '34', unit: '亿$', label: '赛道融资额 / FUNDING' },
    metrics: [
      { k: '事件数 / DEALS', v: '8 笔' },
      { k: '平均单笔 / AVG', v: '4.3 亿' },
    ],
    branches: [
      { name: '药物发现', en: 'DRUG DISCOVERY', value: 14, unit: ' 亿' },
      { name: '影像诊断', en: 'MEDICAL IMAGING', value: 11, unit: ' 亿' },
      { name: '临床文书', en: 'CLINICAL DOCS', value: 9, unit: ' 亿' },
    ],
    mediaPlaceholder: '三分支结构图 / DROP IMAGE',
    branchCount: 3, mediaSlotCount: 1, metricCount: 2,
    focusEnabled: true, focusIndex: 0, showTrunk: true, showValueBars: true,
    showRootBadge: true, accent: '#c8f135',
  };

  SlideBranch.controls = [
    { key: 'branchCount', label: '分支数量', type: 'number', default: 3, min: 2, max: 4, desc: '结构图的分支节点数量' },
    { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
      desc: '右侧自适应图片槽数量（0 时分支列加宽；上传后按图片比例自适应，构图随数量重排）' },
    { key: 'metricCount', label: '指标数量', type: 'number', default: 2, min: 1, max: 3, desc: '根节点下方辅助指标数量' },
    { key: 'focusEnabled', label: '重点分支高亮', type: 'toggle', default: true, desc: '是否突出某一分支节点' },
    { key: 'focusIndex', label: '高亮第几支', type: 'number', default: 0, min: 0, max: 3, desc: '被突出的分支序号', showIf: (p) => p.focusEnabled },
    { key: 'showTrunk', label: '连接主干', type: 'toggle', default: true, desc: '显示/隐藏连接主干与节点圆点（装饰）' },
    { key: 'showValueBars', label: '数值条', type: 'toggle', default: true, desc: '显示/隐藏每支融资数值条（装饰数据）' },
    { key: 'showRootBadge', label: '赛道徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角赛道徽标（装饰）' },
    { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
      options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
  ];

  // P55 GPU 资源链条 / NVIDIA 生态 — reuse this structure via a preset passed as props.
  // Migration: any host can render <SlideBranch {...SlideBranch.presetGpu} />.
  SlideBranch.presetGpu = {
    eyebrowId: '55', eyebrowLabel: 'NVIDIA ECOSYSTEM',
    title: 'GPU 资源链条', subhead: 'NVIDIA 生态 / NVIDIA ECOSYSTEM',
    closing: '算力供给能力正在变成融资能力。',
    rootTag: 'NVIDIA 生态 / GPU',
    hero: { value: '92', unit: '亿$', label: '生态融资额 / ECOSYSTEM FUNDING' },
    metrics: [
      { k: 'GPU 云占比 / GPU CLOUD', v: '70%' },
      { k: '核心环节 / NODES', v: '4 类' },
    ],
    branches: [
      { name: 'GPU 云', en: 'GPU CLOUD', value: 64, unit: ' 亿' },
      { name: '集群管理', en: 'CLUSTER OPS', value: 12, unit: ' 亿' },
      { name: '推理优化', en: 'INFERENCE OPT', value: 9, unit: ' 亿' },
      { name: '芯片互联', en: 'INTERCONNECT', value: 7, unit: ' 亿' },
    ],
    mediaPlaceholder: 'GPU 为中心的生态环图 / DROP IMAGE',
    branchCount: 4, mediaSlotCount: 1, metricCount: 2,
    focusEnabled: true, focusIndex: 0, showTrunk: true, showValueBars: true,
    showRootBadge: true, accent: '#c8f135',
  };

export default SlideBranch;
