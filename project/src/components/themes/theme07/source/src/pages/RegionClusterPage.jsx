/**
 * RegionClusterPage — 地区集群 (Regional Cluster · Image-led · Geo Card)
 *
 * Consolidates the four regional cluster slides (New York / Seattle / Boston /
 * Other Regions) into ONE prop-driven page. A `region` selector switches the
 * whole dataset — eyebrow, title, lead, national-share highlight, industry tags,
 * metrics, hero image and rank — while every layout control (image, share chart,
 * tags, metrics, focus) applies to whichever region is shown. Each region keeps
 * its own image slot (the slot id is region-scoped), so switching region swaps
 * the photo too.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via
 * `renderSlot(slotIndex, { ratio, ratioAR }) => ReactNode`. The page offsets the
 * slot index by region so each region addresses its own slot; when omitted a
 * striped placeholder renders, so the page works (and exports) standalone.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-rgn`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, LensCluster, HeatStrip } from '../viz.jsx';

// national 100% split (shared); each region highlights its own segment by index
const SHARE = [
  { k: '湾区', v: 63.9 },
  { k: '纽约', v: 12.4 },
  { k: '西雅图', v: 9.8 },
  { k: '波士顿', v: 7.7 },
  { k: '其他', v: 6.2 },
];

// ── fixed editorial content per region (text is authored, not tweakable) ──
const REGIONS = [
  {
    eyebrow: 'New York Cluster', enName: 'NEW YORK', segment: '纽约集群', badge: '纽约集群',
    shareIdx: 1, rank: 2,
    title: '行业客户优势', titleTail: '纽约集群',
    lead: '纽约 AI 融资以金融、媒体、企业服务和法律 AI 为主；优势不在基础模型，而在高价值行业客户。',
    closing: '行业客户密度决定垂直应用机会。',
    tags: ['金融', '媒体', '企业服务', '法律 AI', '投研'],
    metrics: [
      { label: '区域融资额', value: '120', unit: '亿美元' },
      { label: '全美占比', value: '12.4', unit: '%' },
      { label: '区域事件数', value: '14', unit: '笔' },
      { label: '平均单笔', value: '8.6', unit: '亿美元' },
    ],
  },
  {
    eyebrow: 'Seattle Cluster', enName: 'SEATTLE', segment: '西雅图集群', badge: '西雅图集群',
    shareIdx: 2, rank: 3,
    title: '云计算人才外溢', titleTail: '西雅图集群',
    lead: '西雅图受益于云计算生态和大厂工程人才外溢；更适合孕育基础设施、开发者工具和企业 AI。',
    closing: '云计算底座带来 AI 基础设施机会。',
    tags: ['基础设施', '开发者工具', '企业 AI', '云服务', '数据平台'],
    metrics: [
      { label: '区域融资额', value: '95', unit: '亿美元' },
      { label: '全美占比', value: '9.8', unit: '%' },
      { label: '区域事件数', value: '10', unit: '笔' },
      { label: '平均单笔', value: '9.5', unit: '亿美元' },
    ],
  },
  {
    eyebrow: 'Boston Cluster', enName: 'BOSTON', segment: '波士顿集群', badge: '波士顿集群',
    shareIdx: 3, rank: 4,
    title: '科研与硬科技', titleTail: '波士顿集群',
    lead: '波士顿集中在医疗 AI、机器人和硬科技方向；高校科研和硬科技转化构成其长期优势。',
    closing: '科研城市更适合长周期技术资产。',
    tags: ['医疗 AI', '机器人', '硬科技', '生物科技', '科研转化'],
    metrics: [
      { label: '区域融资额', value: '75', unit: '亿美元' },
      { label: '全美占比', value: '7.7', unit: '%' },
      { label: '区域事件数', value: '8', unit: '笔' },
      { label: '平均单笔', value: '9.4', unit: '亿美元' },
    ],
  },
  {
    eyebrow: 'Other Regions', enName: 'OTHER REGIONS', segment: '其他地区', badge: '其他地区',
    shareIdx: 4, rank: 5,
    title: '分散型应用落地', titleTail: '其他地区',
    lead: '其他地区融资规模较小，但出现行业专用模型和本地化应用机会；更适合做行业落地而非通用模型。',
    closing: '本地行业资源也能形成应用机会。',
    tags: ['行业模型', '本地化应用', '垂直 SaaS', '制造 AI', '政企服务'],
    metrics: [
      { label: '区域融资额', value: '60', unit: '亿美元' },
      { label: '全美占比', value: '6.2', unit: '%' },
      { label: '区域事件数', value: '11', unit: '笔' },
      { label: '平均单笔', value: '5.5', unit: '亿美元' },
    ],
  },
];

const RANK_TOTAL = 5;
const SHARE_TITLE = '全美融资额占比';
const COPY = {
  share: SHARE,
  regions: REGIONS,
  rankTotal: RANK_TOTAL,
  shareTitle: SHARE_TITLE,
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  region: 0,               // which region: 0 纽约 / 1 西雅图 / 2 波士顿 / 3 其他地区
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  showShare: true,         // national-share chart module
  chartType: 'bar',        // national-share chart: 'bar' (stacked) | 'donut'
  tagCount: 4,             // industry tags (2–5)
  metricCount: 4,          // supporting metrics (2–4)
  focusEnabled: true,      // highlight one metric
  focusIndex: 0,           // which metric is the focus (0-based)
  showDecorations: true,   // glow + heat strip + image badge + rank chip
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (slotIndex, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'shareTitle', label: '占比标题', type: 'text', default: '全美融资额占比' },
  { key: 'region', label: '地区', type: 'select', default: 0,
    options: [{ value: 0, label: '纽约' }, { value: 1, label: '西雅图' },
      { value: 2, label: '波士顿' }, { value: 3, label: '其他地区' }],
    description: '切换展示的地区集群（纽约 / 西雅图 / 波士顿 / 其他地区），整页内容随之更新。' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 1, min: 0, max: 2, step: 1,
    description: '主视觉区图片槽数量（0–2）；为 0 时以品牌图形填充，构图保持完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'portrait',
    options: [
      { value: 'portrait', label: '竖图' },
      { value: 'landscape', label: '横图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例并自动居中排布。' },
  { key: 'showShare', label: '占比图表', type: 'toggle', default: true,
    description: '区域全美占比图表模块的显隐。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'bar',
    options: [{ value: 'bar', label: '占比条' }, { value: 'donut', label: '环形图' }],
    description: '占比图表样式：百分百堆叠占比条 / 环形图。', showWhen: (p) => p.showShare },
  { key: 'tagCount', label: '标签数量', type: 'slider', default: 4, min: 2, max: 5, step: 1,
    description: '行业标签数量（2–5）。' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标、排名标记与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于占比高亮、标签、强调卡与图形。' },
];

const CSS = `
.aic-rgn { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-rgn, .aic-rgn * { box-sizing: border-box; }
.aic-rgn .rgn-glow { position: absolute; left: 14%; top: -10%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-rgn .rgn-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-rgn .rgn-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-rgn .rgn-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-rgn .rgn-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-rgn .rgn-col { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-rgn .rgn-rank { display: inline-flex; align-self: flex-start; align-items: center; gap: 12px;
  padding: 9px 18px; border-radius: 999px; background: var(--aic-ink); color: #fff;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .04em; }
.aic-rgn .rgn-rank b { font-size: 22px; color: var(--aic-accent-bright); }
.aic-rgn .rgn-rank u { text-decoration: none; opacity: .6; }
.aic-rgn .rgn-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; max-width: 900px; text-wrap: pretty; }
.aic-rgn .rgn-lead em { font-style: normal; color: var(--aic-accent-deep); font-weight: 700; }

/* national share chart */
.aic-rgn .rgn-share { margin-top: 30px; }
.aic-rgn .rgn-share-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 14px; }
.aic-rgn .rgn-share-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-rgn .rgn-share-t b { font-family: var(--aic-font-display); font-weight: 700; font-size: 17px; color: var(--aic-faint);
  letter-spacing: .04em; }
.aic-rgn .rgn-stack { display: flex; height: 56px; border-radius: 14px; overflow: hidden; gap: 3px; }
.aic-rgn .rgn-seg { position: relative; display: flex; align-items: center; justify-content: center;
  background: var(--aic-hair); min-width: 8px; transition: flex-grow .5s; }
.aic-rgn .rgn-seg:first-child { border-top-left-radius: 11px; border-bottom-left-radius: 11px; }
.aic-rgn .rgn-seg:last-child { border-top-right-radius: 11px; border-bottom-right-radius: 11px; }
.aic-rgn .rgn-seg.on { background: var(--aic-accent); }
.aic-rgn .rgn-seg-k { font-family: var(--aic-font-text); font-weight: 700; font-size: 17px; color: var(--aic-muted);
  white-space: nowrap; }
.aic-rgn .rgn-seg.on .rgn-seg-k { color: var(--aic-ink); }
.aic-rgn .rgn-seg.lead .rgn-seg-k { color: var(--aic-ink-dim); }
.aic-rgn .rgn-seg-tip { position: absolute; top: -34px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); white-space: nowrap; }
.aic-rgn .rgn-seg-tip u { text-decoration: none; font-size: 15px; color: var(--aic-muted); margin-left: 3px; }

.aic-rgn .rgn-share[data-mode="donut"] { display: flex; align-items: center; gap: 32px; }
.aic-rgn .rgn-donut-legend { display: flex; flex-direction: column; gap: 11px; }
.aic-rgn .rgn-leg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); min-width: 240px; }
.aic-rgn .rgn-leg i { width: 14px; height: 14px; border-radius: 4px; flex: none; }
.aic-rgn .rgn-leg.on { color: var(--aic-ink); font-weight: 800; }
.aic-rgn .rgn-leg u { text-decoration: none; margin-left: auto; font-family: var(--aic-font-display);
  font-variant-numeric: tabular-nums; color: var(--aic-muted); }
.aic-rgn .rgn-leg.on u { color: var(--aic-accent-deep); }

/* metric strip */
.aic-rgn .rgn-metrics { margin-top: auto; display: grid; gap: 18px; padding-top: 26px; }
.aic-rgn .rgn-mcell { position: relative; padding-left: 22px; border-left: 3px solid var(--aic-hair-strong);
  transition: border-color .3s; }
.aic-rgn .rgn-mcell[data-focus="1"] { border-left-color: var(--aic-accent); }
.aic-rgn .rgn-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 7px; }
.aic-rgn .rgn-mval { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; line-height: 1;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-rgn .rgn-mcell[data-focus="1"] .rgn-mval { color: var(--aic-accent-deep); }
.aic-rgn .rgn-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* industry tags */
.aic-rgn .rgn-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.aic-rgn .rgn-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-rgn .rgn-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* hero image (right) */
.aic-rgn .rgn-hero { position: absolute; left: 1100px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-rgn .rgn-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-rgn .rgn-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-rgn .rgn-cell.fixed .rgn-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: auto; max-width: 100%; }
.aic-rgn .rgn-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-rgn .rgn-cell.auto .rgn-frame { height: auto; width: 100%; }
.aic-rgn .rgn-cell.auto .rgn-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-rgn .rgn-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
.aic-rgn .rgn-cityname { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: 60px 26px 24px;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; letter-spacing: .06em; color: #fff;
  background: linear-gradient(to top, rgba(8,10,6,.78), transparent); pointer-events: none; }
.aic-rgn .rgn-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-rgn .rgn-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-rgn .rgn-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-rgn .rgn-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-rgn .rgn-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-rgn .rgn-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-rgn .rgn-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

function Placeholder({ i }) {
  const pid = 'rgnph-' + i;
  return (
    <div className="rgn-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="rgn-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

function ShareStack({ split }) {
  return (
    <div className="rgn-stack">
      {split.map((s) => (
        <div key={s.k} className={'rgn-seg' + (s.on ? ' on' : (s.v > 40 ? ' lead' : ''))}
          style={{ flexGrow: s.v }}>
          {s.on && <span className="rgn-seg-tip">{s.v}<u>%</u></span>}
          {(s.on || s.v > 8) && <span className="rgn-seg-k">{s.k}</span>}
        </div>
      ))}
    </div>
  );
}

function ShareDonut({ split }) {
  const onIdx = split.findIndex((s) => s.on);
  const grays = ['var(--aic-hair-strong)', 'var(--aic-faint)', '#C9CCC2', '#DBDED4', '#E7EAE0'];
  let gi = 0;
  const segments = split.map((s) => ({
    value: s.v, label: s.k,
    color: s.on ? 'var(--aic-accent)' : grays[(gi++) % grays.length],
  }));
  const hit = split[onIdx];
  return (
    <div className="rgn-share" data-mode="donut">
      <Donut segments={segments} size={210} thickness={36} focusIndex={onIdx}
        centerTop={hit.v + '%'} centerBottom={hit.k} />
      <div className="rgn-donut-legend">
        {split.map((s, i) => (
          <div key={s.k} className={'rgn-leg' + (s.on ? ' on' : '')}>
            <i style={{ background: segments[i].color }} />{s.k}<u>{s.v}%</u>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegionClusterPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { share: p.share || SHARE, regions: p.regions || REGIONS, rankTotal: p.rankTotal !== undefined ? p.rankTotal : RANK_TOTAL, shareTitle: p.shareTitle !== undefined ? p.shareTitle : SHARE_TITLE };
  ensureFonts();
  injectScopedStyle('aic-rgn', CSS);
  const vars = themeVars(p.accentColor);

  const regions = copy.regions || REGIONS;
  const share = copy.share || SHARE;
  const ri = Math.max(0, Math.min(regions.length - 1, p.region));
  const R = regions[ri];
  const shareSplit = share.map((s, i) => (i === R.shareIdx ? { ...s, on: true } : s));

  const tagN = Math.max(2, Math.min(R.tags.length, p.tagCount));
  const tags = R.tags.slice(0, tagN);
  const mN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = R.metrics.slice(0, mN);
  const focus = Math.max(0, Math.min(mN - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;
  // region-scoped slot index so each region keeps its own uploaded image
  const slotIndex = (i) => ri * 4 + i;

  return (
    <div className="aic-rgn" style={vars}>
      {p.showDecorations && <div className="rgn-glow" />}

      <div className="rgn-head">
        <div>
          <p className="rgn-eyebrow">{R.eyebrow}</p>
          <h2 className="rgn-title">{R.title}</h2>
        </div>
        <div className="rgn-sub">{R.titleTail}</div>
      </div>

      <div className="rgn-col">
        {p.showDecorations && (
          <span className="rgn-rank">区域排名<b>{String(R.rank).padStart(2, '0')}</b><u>/ {String(copy.rankTotal).padStart(2, '0')}</u></span>
        )}
        <p className="rgn-lead">{R.lead}</p>

        {p.showShare && (
          p.chartType === 'donut' ? (
            <ShareDonut split={shareSplit} />
          ) : (
            <div className="rgn-share">
              <div className="rgn-share-t"><span>{copy.shareTitle}</span><b>NATIONAL SPLIT · 100%</b></div>
              <ShareStack split={shareSplit} />
            </div>
          )
        )}

        <div className="rgn-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(mN, 2)}, 1fr)` }}>
          {metrics.map((m, i) => (
            <div className="rgn-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="rgn-mlbl">{m.label}</div>
              <div className="rgn-mval">{m.value}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>

        <div className="rgn-tags">
          {tags.map((t, i) => (
            <span className={'rgn-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="rgn-hero">
        {imgN === 0 ? (
          <div className="rgn-cell fixed">
            <div className="rgn-frame" style={{ '--ar': String(heroAR) }}>
              <div className="rgn-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'rgn-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="rgn-badge">{R.badge}</span>}
              {i === 0 && <span className="rgn-cityname">{R.enName}</span>}
              <div className="rgn-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(slotIndex(i), { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rgn-foot">
        <div className="rgn-closing"><b />{R.closing}</div>
        {p.showDecorations && <div className="rgn-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
