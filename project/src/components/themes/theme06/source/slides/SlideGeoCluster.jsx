// ============================================================================
// SlideGeoCluster.jsx — P57/58/59/60 地区集群 / Geographic Cluster Card
// Independent, props-driven, REUSABLE. Depends only on kit.jsx (incl. KxImageSlot).
//
// One generic "a single cluster within a larger distribution" page, registered
// FOUR times in the demo deck with content passed as props — same component,
// different data:
//   • P57 default        New York   — layout 'media', 1 adaptive image slot
//   • SlideGeoCluster.presetSeattle  P58 — layout 'media'
//   • SlideGeoCluster.presetBoston   P59 — layout 'media'
//   • SlideGeoCluster.presetOther    P60 — layout 'map' (proportional bubbles)
// The migration model: <SlideGeoCluster {...SlideGeoCluster.presetBoston} />.
//
// Left column: a dominant SHARE figure + a share-of-total bar (this cluster's
// slice highlighted within the national distribution) + supporting metric cards
// + industry tag chips + a one-line takeaway. Right column adapts:
//   layout 'media' → ADAPTIVE image slots (mediaSlotCount 0..2); 0 swaps the
//                    column for a vertical distribution panel so it never looks empty.
//   layout 'map'   → proportional region BUBBLES (area ∝ share), the active
//                    cluster highlighted — a small chart that reads dominance.
//
// PROPS (content — text, NOT in Tweaks)
//   eyebrowId,eyebrowLabel,title,subhead,closing
//   clusterTag                          cluster badge (decorative)
//   hero ({value,unit,label})           dominant share figure
//   metrics ({k,v}[])                   supporting metric cards
//   tags (string[])                     industry tag chips
//   note                                one-line takeaway
//   regions ({name,en,value}[])         full distribution (share bar / panel / map)
//   activeRegion (int)                  which region is THIS cluster (highlighted)
//   mediaPlaceholder                    image-slot prompt text
// PROPS (visual — all map 1:1 to .controls)
//   layout (enum)            'media' | 'map'
//   mediaSlotCount (int 0..2) adaptive image slots (media; 0 → distribution panel)
//   metricCount (int 2..3)   supporting metric cards shown
//   tagCount (int 0..6)      industry tag chips (0 hides the row)
//   regionCount (int 3..6)   region bubbles shown (map)
//   focusEnabled (bool)      emphasise one metric card
//   focusIndex (int)         which metric
//   showShareBar (bool)      share-of-total bar (decorative)
//   showTagBadge (bool)      cluster badge chip (decorative)
//   showNote (bool)          one-line takeaway (decorative)
//   accent (color)
// ============================================================================
import React from 'react';
import { KxEyebrow, KxGrid, KxImageSlot } from './kit.jsx';

if (typeof document !== 'undefined' && !document.getElementById('kx-geo-css')) {
  const css = `
  .kx-geo-pad{display:flex;flex-direction:column;height:100%;padding-top:44px;padding-bottom:34px;}
  .kx-geo-head{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    padding-bottom:24px;border-bottom:1px solid var(--kx-line);}
  .kx-geo-title{font-size:68px;}
  .kx-geo-sub{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);letter-spacing:.04em;text-align:right;
    display:flex;flex-direction:column;gap:6px;white-space:nowrap;}
  .kx-geo-sub b{color:var(--kx-cream);font-weight:700;}
  .kx-geo-main{flex:1;min-height:0;display:grid;column-gap:64px;padding:28px 0 6px;}
  /* left column */
  .kx-geo-left{display:flex;flex-direction:column;min-height:0;border-right:1px solid var(--kx-line);padding-right:56px;}
  .kx-geo-badge{display:inline-flex;align-items:center;gap:10px;align-self:flex-start;
    font-family:var(--kx-mono);font-size:24px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
    background:var(--kx-accent);color:var(--kx-ink);padding:7px 15px;}
  .kx-geo-badge::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--kx-ink);}
  .kx-geo-hero{margin-top:26px;}
  .kx-geo-hv{display:flex;align-items:baseline;gap:8px;font-family:var(--kx-disp);font-weight:800;
    letter-spacing:-.03em;line-height:.8;white-space:nowrap;}
  .kx-geo-hv .kx-n{font-size:208px;color:var(--kx-accent);}
  .kx-geo-hv .kx-u{font-size:74px;color:var(--kx-mute);}
  .kx-geo-hl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-mute-2);text-transform:uppercase;
    letter-spacing:.04em;margin-top:14px;}
  /* share-of-total bar */
  .kx-geo-share{margin-top:30px;}
  .kx-geo-sharecap{display:flex;justify-content:space-between;align-items:baseline;
    font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);letter-spacing:.04em;text-transform:uppercase;
    padding-bottom:11px;}
  .kx-geo-sharecap b{color:var(--kx-accent);font-weight:700;}
  .kx-geo-sharebar{display:flex;width:100%;height:26px;gap:2px;background:transparent;}
  .kx-geo-sharebar i{height:100%;background:#33332b;display:block;min-width:2px;transition:none;}
  .kx-geo-sharebar i.kx-on{background:var(--kx-accent);}
  .kx-geo-sharebar i.kx-lead{background:#55554a;}
  /* metric cards */
  .kx-geo-metrics{display:grid;margin-top:auto;border-top:1px solid var(--kx-line);}
  .kx-geo-mcard{padding:20px 22px 14px 0;border-right:1px solid var(--kx-line);display:flex;flex-direction:column;gap:7px;}
  .kx-geo-mcard:last-child{border-right:none;}
  .kx-geo-mcard.kx-on{background:linear-gradient(180deg,color-mix(in srgb,var(--kx-accent) 14%,transparent),transparent 80%);padding-left:16px;}
  .kx-geo-mcard .kx-mv{font-family:var(--kx-disp);font-weight:800;font-size:48px;line-height:.9;letter-spacing:-.02em;}
  .kx-geo-mcard.kx-on .kx-mv{color:var(--kx-accent);}
  .kx-geo-mcard .kx-mk{font-family:var(--kx-mono);font-size:21px;color:var(--kx-mute-2);text-transform:uppercase;letter-spacing:.03em;}
  /* right: media column */
  .kx-geo-media{display:flex;flex-direction:column;gap:20px;min-height:0;justify-content:center;}
  .kx-geo-media .kx-imgslot{flex:none;}
  /* right: industry tags + note overlay block under media handled in left foot */
  /* right: zero-slot vertical distribution panel */
  .kx-geo-panel{display:flex;flex-direction:column;min-height:0;justify-content:center;gap:16px;}
  .kx-geo-panelcap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:14px;border-bottom:1px solid var(--kx-line);}
  .kx-geo-prow{display:grid;grid-template-columns:1fr auto;align-items:center;column-gap:20px;row-gap:8px;padding:14px 0;
    border-bottom:1px solid var(--kx-line);}
  .kx-geo-prow .kx-pn{font-family:var(--kx-disp);font-weight:800;font-size:32px;letter-spacing:-.01em;line-height:1;}
  .kx-geo-prow .kx-pe{font-family:var(--kx-mono);font-size:18px;color:var(--kx-mute-2);letter-spacing:.03em;}
  .kx-geo-prow .kx-pv{font-family:var(--kx-disp);font-weight:800;font-size:44px;line-height:.9;letter-spacing:-.02em;text-align:right;}
  .kx-geo-prow .kx-ptrack{grid-column:1 / -1;height:11px;background:#26261f;}
  .kx-geo-prow .kx-pfill{height:100%;background:#3a3a32;}
  .kx-geo-prow.kx-on .kx-pn,.kx-geo-prow.kx-on .kx-pv{color:var(--kx-accent);}
  .kx-geo-prow.kx-on .kx-pfill{background:var(--kx-accent);}
  /* right: proportional region bubbles (map layout) */
  .kx-geo-mapwrap{display:flex;flex-direction:column;min-height:0;justify-content:center;}
  .kx-geo-mapcap{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute-2);letter-spacing:.05em;
    text-transform:uppercase;padding-bottom:18px;border-bottom:1px solid var(--kx-line);margin-bottom:8px;}
  .kx-geo-bubs{flex:1;min-height:0;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;
    gap:18px 26px;align-content:center;padding:18px 0;}
  .kx-geo-bub{position:relative;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:rgba(255,255,255,.045);border:1px solid var(--kx-line);color:var(--kx-mute);flex:none;text-align:center;}
  .kx-geo-bub.kx-on{background:color-mix(in srgb,var(--kx-accent) 22%,transparent);
    border:2px solid var(--kx-accent);color:var(--kx-cream);}
  .kx-geo-bub .kx-bn{font-family:var(--kx-disp);font-weight:900;letter-spacing:-.01em;line-height:.95;}
  .kx-geo-bub .kx-bv{font-family:var(--kx-mono);font-weight:700;line-height:1;margin-top:5px;}
  .kx-geo-bub.kx-on .kx-bv{color:var(--kx-accent);}
  /* foot */
  .kx-geo-foot{display:flex;justify-content:space-between;align-items:center;padding-top:22px;border-top:1px solid var(--kx-line);}
  .kx-geo-foot .kx-cl{font-family:var(--kx-mono);font-size:26px;color:var(--kx-accent);font-weight:700;}
  .kx-geo-foot .kx-rt{font-family:var(--kx-mono);font-size:24px;color:var(--kx-mute-2);letter-spacing:.03em;}
  /* tags + note row (left bottom, above metrics) */
  .kx-geo-tagrow{display:flex;flex-direction:column;gap:14px;margin-top:26px;}
  .kx-geo-note{font-family:var(--kx-mono);font-size:23px;color:var(--kx-mute);letter-spacing:.02em;line-height:1.5;
    border-left:3px solid var(--kx-accent);padding-left:16px;text-wrap:pretty;}
  `;
  const s = document.createElement('style'); s.id = 'kx-geo-css'; s.textContent = css; document.head.appendChild(s);
}

const h = React.createElement;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function SlideGeoCluster(props) {
  const p = { ...SlideGeoCluster.defaults, ...props };
  const metrics = p.metrics.slice(0, clamp(p.metricCount, 2, p.metrics.length));
  const fi = clamp(p.focusIndex, 0, metrics.length - 1);
  const slots = p.layout === 'media' ? clamp(p.mediaSlotCount, 0, 2) : 0;
  const showPanel = p.layout === 'media' && slots === 0;
  const tags = p.tags.slice(0, clamp(p.tagCount, 0, p.tags.length));

  // full distribution (regions), sorted desc; active region highlighted
  const allRegions = p.regions;
  const activeIdx = clamp(p.activeRegion, 0, allRegions.length - 1);
  const regionMax = Math.max(...allRegions.map((r) => r.value));

  const mainCols = p.layout === 'map' ? '1fr 1fr'
    : slots === 0 ? '1.08fr 0.92fr' : '1.04fr 0.96fr';

  // ---- left column -----------------------------------------------------
  const shareBar = p.showShareBar ? h('div', { className: 'kx-geo-share' },
    h('div', { className: 'kx-geo-sharecap' },
      h('span', null, '地区分布对照 / ACROSS REGIONS'),
      h('span', null, '本集群 ', h('b', null, p.hero.value + (p.hero.unit || '')))),
    h('div', { className: 'kx-geo-sharebar' },
      allRegions.map((r, i) => {
        const on = i === activeIdx;
        const lead = !on && r.value === regionMax;
        return h('i', {
          key: i, className: on ? 'kx-on' : lead ? 'kx-lead' : '',
          style: { flexGrow: r.value, flexBasis: 0 },
          title: r.name + ' ' + r.value + '%',
        });
      }))) : null;

  const tagRow = (tags.length || (p.showNote && p.note))
    ? h('div', { className: 'kx-geo-tagrow' },
        tags.length ? h('div', { className: 'kx-chips' },
          tags.map((t, i) => h('span', { key: i, className: 'kx-chip' + (i === 0 ? ' kx-on' : '') }, t))) : null,
        (p.showNote && p.note) ? h('div', { className: 'kx-geo-note' }, p.note) : null)
    : null;

  const left = h('div', { className: 'kx-geo-left' },
    p.showTagBadge ? h('div', { className: 'kx-geo-badge' }, p.clusterTag) : null,
    h('div', { className: 'kx-geo-hero', style: p.showTagBadge ? null : { marginTop: 0 } },
      h('div', { className: 'kx-geo-hv' },
        h('span', { className: 'kx-n' }, p.hero.value),
        p.hero.unit ? h('span', { className: 'kx-u' }, p.hero.unit) : null),
      h('div', { className: 'kx-geo-hl' }, p.hero.label)),
    shareBar,
    tagRow,
    h('div', { className: 'kx-geo-metrics', style: { gridTemplateColumns: `repeat(${metrics.length},1fr)` } },
      metrics.map((m, i) => { const on = p.focusEnabled && i === fi;
        return h('div', { key: i, className: 'kx-geo-mcard' + (on ? ' kx-on' : '') },
          h('span', { className: 'kx-mv' }, m.v),
          h('span', { className: 'kx-mk' }, m.k)); })));

  // ---- right column: distribution panel (zero-slot media) --------------
  const panel = h('div', { className: 'kx-geo-panel' },
    h('div', { className: 'kx-geo-panelcap' }, '地区分布 / REGIONAL DISTRIBUTION'),
    allRegions.map((r, i) => {
      const on = i === activeIdx;
      return h('div', { key: i, className: 'kx-geo-prow' + (on ? ' kx-on' : '') },
        h('div', null,
          h('div', { className: 'kx-pn' }, r.name),
          h('div', { className: 'kx-pe' }, r.en)),
        h('div', { className: 'kx-pv' }, r.value + '%'),
        h('div', { className: 'kx-ptrack' },
          h('div', { className: 'kx-pfill', style: { width: ((r.value / regionMax) * 100) + '%' } })));
    }));

  // ---- right column: proportional region bubbles (map layout) ----------
  const bubbleRegions = allRegions.slice(0, clamp(p.regionCount, 3, allRegions.length));
  const bubMax = Math.max(...bubbleRegions.map((r) => r.value));
  const DMAX = 290, DMIN = 96;
  const map = h('div', { className: 'kx-geo-mapwrap' },
    h('div', { className: 'kx-geo-mapcap' }, '地区分布 · 面积 ∝ 占比 / SIZE ∝ SHARE'),
    h('div', { className: 'kx-geo-bubs' },
      bubbleRegions.map((r, i) => {
        const on = i === activeIdx;
        const d = DMIN + (DMAX - DMIN) * Math.sqrt(r.value / bubMax);
        return h('div', { key: i, className: 'kx-geo-bub' + (on ? ' kx-on' : ''),
          style: { width: d + 'px', height: d + 'px' } },
          h('div', { className: 'kx-bn', style: { fontSize: Math.max(15, d * 0.11) + 'px' } }, r.name),
          h('div', { className: 'kx-bv', style: { fontSize: Math.max(13, d * 0.13) + 'px' } }, r.value + '%'));
      })));

  const media = p.layout === 'map' ? map
    : showPanel ? panel
    : h('div', { className: 'kx-geo-media' },
        Array.from({ length: slots }, (_, i) =>
          h(KxImageSlot, {
            key: i, id: 'geo-' + (p.eyebrowId || 'x') + '-' + i,
            placeholder: p.mediaPlaceholder || '集群主视觉 / DROP IMAGE',
            badge: slots === 1 ? p.clusterTag : ('IMG ' + String(i + 1).padStart(2, '0')),
            minRatio: slots === 1 ? 0.74 : 1.2, maxRatio: slots === 1 ? 1.4 : 2.1,
            style: { width: '100%' },
          })));

  const footRt = p.layout === 'map' ? bubbleRegions.length + ' REGIONS / MAP'
    : slots === 0 ? allRegions.length + ' REGIONS / PANEL'
    : slots + ' IMG / MEDIA';

  return h('div', { className: 'kx-slide kx-dark', style: { '--kx-accent': p.accent } },
    h(KxGrid, { cols: 6 }),
    h('div', { className: 'kx-pad kx-geo-pad' },
      h('div', { className: 'kx-geo-head' },
        h('div', null,
          h(KxEyebrow, { id: p.eyebrowId, label: p.eyebrowLabel }),
          h('h2', { className: 'kx-h2 kx-cjk kx-geo-title', style: { marginTop: '16px' } }, p.title)),
        h('div', { className: 'kx-geo-sub' },
          p.subhead.split(' / ').map((line, i) => i === 0 ? h('b', { key: i }, line) : h('span', { key: i }, line)))),
      h('div', { className: 'kx-geo-main', style: { gridTemplateColumns: mainCols } }, left, media),
      h('div', { className: 'kx-geo-foot' },
        h('div', { className: 'kx-cl' }, '→ ' + p.closing),
        h('div', { className: 'kx-rt' }, footRt))));
}

// ---- shared regional distribution (sums to 100) -----------------------------
const REGIONS = [
  { name: '旧金山湾区', en: 'BAY AREA', value: 63.9 },
  { name: '纽约', en: 'NEW YORK', value: 12.4 },
  { name: '西雅图', en: 'SEATTLE', value: 9.8 },
  { name: '波士顿', en: 'BOSTON', value: 7.7 },
  { name: '其他地区', en: 'OTHER REGIONS', value: 6.2 },
];

SlideGeoCluster.defaults = {
  eyebrowId: '57', eyebrowLabel: 'NEW YORK CLUSTER',
  title: '行业客户优势', subhead: '纽约集群 / NEW YORK',
  closing: '行业客户密度决定垂直应用机会。',
  clusterTag: '纽约集群 / NYC',
  hero: { value: '12.4', unit: '%', label: '占全国融资额 / SHARE OF TOTAL' },
  metrics: [
    { k: '融资额 / FUNDING', v: '120 亿$' },
    { k: '事件数 / DEALS', v: '14 笔' },
    { k: '平均单笔 / AVG', v: '8.6 亿$' },
  ],
  tags: ['金融 / FINANCE', '媒体 / MEDIA', '企业服务 / ENTERPRISE', '法律 AI / LEGAL'],
  note: '纽约的优势不在基础模型，而在高价值行业客户——行业客户密度决定垂直应用机会。',
  regions: REGIONS,
  activeRegion: 1,
  mediaPlaceholder: '纽约城市/行业客户主视觉 / DROP IMAGE',
  layout: 'media', mediaSlotCount: 1, metricCount: 3, tagCount: 4, regionCount: 5,
  focusEnabled: true, focusIndex: 0, showShareBar: true, showTagBadge: true, showNote: true,
  accent: '#c8f135',
};

SlideGeoCluster.controls = [
  { key: 'layout', label: '右栏形式', type: 'select', default: 'media',
    options: [['media', '图文'], ['map', '分布气泡']], desc: '右栏的呈现形式：集群图片主导 / 地区占比气泡图' },
  { key: 'mediaSlotCount', label: '图片槽数量', type: 'number', default: 1, min: 0, max: 2,
    desc: '右侧自适应图片槽数量（0 改为地区分布面板；上传后按图片比例自适应，构图随数量重排）',
    showIf: (p) => p.layout === 'media' },
  { key: 'regionCount', label: '气泡地区数', type: 'number', default: 5, min: 3, max: 5,
    desc: '气泡图中展示的地区数量', showIf: (p) => p.layout === 'map' },
  { key: 'metricCount', label: '指标数量', type: 'number', default: 3, min: 2, max: 3, desc: '左侧辅助指标卡数量' },
  { key: 'tagCount', label: '行业标签数', type: 'number', default: 4, min: 0, max: 6, desc: '左下行业标签芯片数量（0 隐藏整行）' },
  { key: 'focusEnabled', label: '重点指标高亮', type: 'toggle', default: true, desc: '是否突出某一指标卡' },
  { key: 'focusIndex', label: '高亮第几个', type: 'number', default: 0, min: 0, max: 2, desc: '被突出的指标序号', showIf: (p) => p.focusEnabled },
  { key: 'showShareBar', label: '占比对照条', type: 'toggle', default: true, desc: '显示/隐藏占全国融资额对照条（装饰数据）' },
  { key: 'showTagBadge', label: '集群徽标', type: 'toggle', default: true, desc: '显示/隐藏左上角集群徽标（装饰）' },
  { key: 'showNote', label: '一句话判断', type: 'toggle', default: true, desc: '显示/隐藏左下一句话判断（装饰文案）' },
  { key: 'accent', label: '强调色', type: 'color', default: '#c8f135',
    options: ['#c8f135', '#ff5a3c', '#3ca0ff', '#ffd23c'], desc: '主强调色' },
];

// P58 云计算人才外溢 / Seattle — image-led preset (props only).
SlideGeoCluster.presetSeattle = {
  eyebrowId: '58', eyebrowLabel: 'SEATTLE CLUSTER',
  title: '云计算人才外溢', subhead: '西雅图集群 / SEATTLE',
  closing: '云计算底座带来 AI 基础设施机会。',
  clusterTag: '西雅图集群 / SEA',
  hero: { value: '9.8', unit: '%', label: '占全国融资额 / SHARE OF TOTAL' },
  metrics: [
    { k: '融资额 / FUNDING', v: '95 亿$' },
    { k: '事件数 / DEALS', v: '10 笔' },
    { k: '平均单笔 / AVG', v: '9.5 亿$' },
  ],
  tags: ['云生态 / CLOUD', '基础设施 / INFRA', '开发者工具 / DEVTOOLS', '企业 AI / ENTERPRISE'],
  note: '西雅图受益于云计算生态和大厂工程人才外溢，更适合孕育基础设施、开发者工具和企业 AI。',
  regions: REGIONS, activeRegion: 2,
  mediaPlaceholder: '西雅图云生态主视觉 / DROP IMAGE',
  layout: 'media', mediaSlotCount: 1, metricCount: 3, tagCount: 4, regionCount: 5,
  focusEnabled: true, focusIndex: 0, showShareBar: true, showTagBadge: true, showNote: true,
  accent: '#c8f135',
};

// P59 科研与硬科技 / Boston — image-led preset (props only).
SlideGeoCluster.presetBoston = {
  eyebrowId: '59', eyebrowLabel: 'BOSTON CLUSTER',
  title: '科研与硬科技', subhead: '波士顿集群 / BOSTON',
  closing: '科研城市更适合长周期技术资产。',
  clusterTag: '波士顿集群 / BOS',
  hero: { value: '7.7', unit: '%', label: '占全国融资额 / SHARE OF TOTAL' },
  metrics: [
    { k: '融资额 / FUNDING', v: '75 亿$' },
    { k: '事件数 / DEALS', v: '8 笔' },
    { k: '平均单笔 / AVG', v: '9.4 亿$' },
  ],
  tags: ['医疗 AI / HEALTH', '机器人 / ROBOTICS', '硬科技 / DEEP TECH', '高校科研 / RESEARCH'],
  note: '波士顿集中在医疗 AI、机器人和硬科技方向，高校科研和硬科技转化构成其优势。',
  regions: REGIONS, activeRegion: 3,
  mediaPlaceholder: '波士顿科研/硬科技主视觉 / DROP IMAGE',
  layout: 'media', mediaSlotCount: 1, metricCount: 3, tagCount: 4, regionCount: 5,
  focusEnabled: true, focusIndex: 0, showShareBar: true, showTagBadge: true, showNote: true,
  accent: '#c8f135',
};

// P60 分散型应用落地 / Other Regions — MAP layout preset (proportional bubbles, no image).
SlideGeoCluster.presetOther = {
  eyebrowId: '60', eyebrowLabel: 'OTHER REGIONS',
  title: '分散型应用落地', subhead: '其他地区机会 / DISTRIBUTED',
  closing: '本地行业资源也能形成应用机会。',
  clusterTag: '其他地区 / OTHER',
  hero: { value: '6.2', unit: '%', label: '占全国融资额 / SHARE OF TOTAL' },
  metrics: [
    { k: '融资额 / FUNDING', v: '60 亿$' },
    { k: '事件数 / DEALS', v: '11 笔' },
    { k: '平均单笔 / AVG', v: '5.5 亿$' },
  ],
  tags: ['行业模型 / VERTICAL', '本地化 / LOCAL', '垂直应用 / APPS'],
  note: '其他地区融资规模较小，但出现行业专用模型和本地化应用机会——非核心区域更适合做行业落地。',
  regions: REGIONS, activeRegion: 4,
  mediaPlaceholder: '区域点阵分布 / DROP IMAGE',
  layout: 'map', mediaSlotCount: 1, metricCount: 3, tagCount: 3, regionCount: 5,
  focusEnabled: true, focusIndex: 0, showShareBar: true, showTagBadge: true, showNote: true,
  accent: '#c8f135',
};

export default SlideGeoCluster;
