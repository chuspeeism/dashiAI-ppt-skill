/**
 * BostonPage — P59 科研与硬科技 (Boston Cluster · Image-led · Geo Card)
 *
 * A regional "geo card": one US funding cluster (Boston) profiled with its
 * national-share chart, an industry tag cluster, four supporting metrics and a
 * tall hero image. Part of the regional series (Bay Area / NY / Seattle /
 * Boston / Other) — the share chart highlights this region inside the national
 * 100% split so the geographic concentration story stays legible.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-bos`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Boston Cluster',
  segment: '波士顿集群',
  enName: 'BOSTON',
  rank: 4, rankTotal: 5,
  title: '科研与硬科技',
  titleTail: '波士顿集群',
  lead: '波士顿集中在医疗 AI、机器人和硬科技方向；高校科研与硬科技转化构成长期优势。',
  shareTitle: '全美融资额占比',
  shareValue: '7.7',
  closing: '科研城市更适合长周期技术资产。',
  badge: '波士顿集群',
  // national 100% split; `on` marks this region's segment (highlighted)
  shareSplit: [
    { k: '湾区', v: 63.9 },
    { k: '纽约', v: 12.4 },
    { k: '西雅图', v: 9.8 },
    { k: '波士顿', v: 7.7, on: true },
    { k: '其他', v: 6.2 },
  ],
  // industry tags (order fixed; count is prop-driven)
  tags: ['医疗 AI', '机器人', '硬科技', '生命科学', '高校科研'],
  // supporting metrics (order fixed; count is prop-driven)
  metrics: [
    { label: '区域融资额', value: '75', unit: '亿美元' },
    { label: '全美占比', value: '7.7', unit: '%' },
    { label: '区域事件数', value: '8', unit: '笔' },
    { label: '平均单笔', value: '9.4', unit: '亿美元' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'portrait',  // 'portrait' | 'landscape' | 'square' | 'auto'
  chartType: 'bar',        // national-share chart: 'bar' (stacked) | 'donut'
  showShare: true,         // national-share chart module
  tagCount: 4,             // industry tags (2–5)
  metricCount: 4,          // supporting metrics (2–4)
  focusEnabled: true,      // highlight one metric
  focusIndex: 0,           // which metric is the focus (0-based)
  showDecorations: true,   // glow + heat strip + image badge + rank chip
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Boston Cluster' },
  { key: 'segment', label: 'segment', type: 'text', default: '波士顿集群' },
  { key: 'enName', label: 'enName', type: 'text', default: 'BOSTON' },
  { key: 'title', label: '标题', type: 'text', default: '科研与硬科技' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '波士顿集群' },
  { key: 'lead', label: '导言', type: 'text', default: '波士顿集中在医疗 AI、机器人和硬科技方向；高校科研与硬科技转化构成长期优势。' },
  { key: 'shareTitle', label: '占比标题', type: 'text', default: '全美融资额占比' },
  { key: 'shareValue', label: 'shareValue', type: 'text', default: '7.7' },
  { key: 'closing', label: '结语', type: 'text', default: '科研城市更适合长周期技术资产。' },
  { key: 'badge', label: 'badge', type: 'text', default: '波士顿集群' },
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
.aic-bos { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-bos, .aic-bos * { box-sizing: border-box; }
.aic-bos .bo-glow { position: absolute; left: 14%; top: -10%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-bos .bo-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-bos .bo-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-bos .bo-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-bos .bo-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-bos .bo-col { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-bos .bo-rank { display: inline-flex; align-self: flex-start; align-items: center; gap: 12px;
  padding: 9px 18px; border-radius: 999px; background: var(--aic-ink); color: #fff;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .04em; }
.aic-bos .bo-rank b { font-size: 22px; color: var(--aic-accent-bright); }
.aic-bos .bo-rank u { text-decoration: none; opacity: .6; }
.aic-bos .bo-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; max-width: 900px; text-wrap: pretty; }
.aic-bos .bo-lead em { font-style: normal; color: var(--aic-accent-deep); font-weight: 700; }

/* national share chart */
.aic-bos .bo-share { margin-top: 30px; }
.aic-bos .bo-share-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 14px; }
.aic-bos .bo-share-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-bos .bo-share-t b { font-family: var(--aic-font-display); font-weight: 700; font-size: 17px; color: var(--aic-faint);
  letter-spacing: .04em; }
.aic-bos .bo-stack { display: flex; height: 56px; border-radius: 14px; overflow: hidden; gap: 3px; }
.aic-bos .bo-seg { position: relative; display: flex; align-items: center; justify-content: center;
  background: var(--aic-hair); min-width: 8px; transition: flex-grow .5s; }
.aic-bos .bo-seg:first-child { border-top-left-radius: 11px; border-bottom-left-radius: 11px; }
.aic-bos .bo-seg:last-child { border-top-right-radius: 11px; border-bottom-right-radius: 11px; }
.aic-bos .bo-seg.on { background: var(--aic-accent); }
.aic-bos .bo-seg-k { font-family: var(--aic-font-text); font-weight: 700; font-size: 17px; color: var(--aic-muted);
  white-space: nowrap; }
.aic-bos .bo-seg.on .bo-seg-k { color: var(--aic-ink); }
.aic-bos .bo-seg.lead .bo-seg-k { color: var(--aic-ink-dim); }
.aic-bos .bo-seg-tip { position: absolute; top: -34px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); white-space: nowrap; }
.aic-bos .bo-seg-tip u { text-decoration: none; font-size: 15px; color: var(--aic-muted); margin-left: 3px; }

.aic-bos .bo-share[data-mode="donut"] { display: flex; align-items: center; gap: 32px; }
.aic-bos .bo-donut-legend { display: flex; flex-direction: column; gap: 11px; }
.aic-bos .bo-leg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); }
.aic-bos .bo-leg i { width: 14px; height: 14px; border-radius: 4px; flex: none; }
.aic-bos .bo-leg.on { color: var(--aic-ink); font-weight: 800; }
.aic-bos .bo-leg u { text-decoration: none; margin-left: auto; font-family: var(--aic-font-display);
  font-variant-numeric: tabular-nums; color: var(--aic-muted); }
.aic-bos .bo-leg.on u { color: var(--aic-accent-deep); }

/* metric strip */
.aic-bos .bo-metrics { margin-top: auto; display: grid; gap: 18px; padding-top: 26px; }
.aic-bos .bo-mcell { position: relative; padding-left: 22px; border-left: 3px solid var(--aic-hair-strong);
  transition: border-color .3s; }
.aic-bos .bo-mcell[data-focus="1"] { border-left-color: var(--aic-accent); }
.aic-bos .bo-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 7px; }
.aic-bos .bo-mval { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; line-height: 1;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-bos .bo-mcell[data-focus="1"] .bo-mval { color: var(--aic-accent-deep); }
.aic-bos .bo-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* industry tags */
.aic-bos .bo-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.aic-bos .bo-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-bos .bo-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* hero image (right) */
.aic-bos .bo-hero { position: absolute; left: 1100px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-bos .bo-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-bos .bo-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-bos .bo-cell.fixed .bo-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: auto; max-width: 100%; }
.aic-bos .bo-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-bos .bo-cell.auto .bo-frame { height: auto; width: 100%; }
.aic-bos .bo-cell.auto .bo-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-bos .bo-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
.aic-bos .bo-cityname { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: 60px 26px 24px;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; letter-spacing: .06em; color: #fff;
  background: linear-gradient(to top, rgba(8,10,6,.78), transparent); pointer-events: none; }
.aic-bos .bo-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-bos .bo-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-bos .bo-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-bos .bo-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-bos .bo-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-bos .bo-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-bos .bo-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'boph-' + i;
  return (
    <div className="bo-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="bo-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

// national 100% stacked share bar — this region's segment highlighted
function ShareStack({ split }) {
  return (
    <div className="bo-stack">
      {split.map((s) => (
        <div key={s.k} className={'bo-seg' + (s.on ? ' on' : (s.v > 40 ? ' lead' : ''))}
          style={{ flexGrow: s.v }}>
          {s.on && <span className="bo-seg-tip">{s.v}<u>%</u></span>}
          {(s.on || s.v > 8) && <span className="bo-seg-k">{s.k}</span>}
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
    <div className="bo-share" data-mode="donut">
      <Donut segments={segments} size={210} thickness={36} focusIndex={onIdx}
        centerTop={hit.v + '%'} centerBottom={hit.k} />
      <div className="bo-donut-legend">
        {split.map((s, i) => (
          <div key={s.k} className={'bo-leg' + (s.on ? ' on' : '')}>
            <i style={{ background: segments[i].color }} />{s.k}<u>{s.v}%</u>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BostonPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, enName: p.enName !== undefined ? p.enName : COPY.enName, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, shareTitle: p.shareTitle !== undefined ? p.shareTitle : COPY.shareTitle, shareValue: p.shareValue !== undefined ? p.shareValue : COPY.shareValue, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, shareSplit: p.shareSplit !== undefined ? p.shareSplit : COPY.shareSplit, tags: p.tags !== undefined ? p.tags : COPY.tags, metrics: p.metrics !== undefined ? p.metrics : COPY.metrics };
  ensureFonts();
  injectScopedStyle('aic-bos', CSS);
  const vars = themeVars(p.accentColor);

  const tagN = Math.max(2, Math.min(copy.tags.length, p.tagCount));
  const tags = copy.tags.slice(0, tagN);
  const mN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, mN);
  const focus = Math.max(0, Math.min(mN - 1, p.focusIndex));

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'portrait';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (3 / 4) : ratioAR;

  return (
    <div className="aic-bos" style={vars}>
      {p.showDecorations && <div className="bo-glow" />}

      <div className="bo-head">
        <div>
          <p className="bo-eyebrow">{copy.eyebrow}</p>
          <h2 className="bo-title">{copy.title}</h2>
        </div>
        <div className="bo-sub">{copy.titleTail}</div>
      </div>

      <div className="bo-col">
        {p.showDecorations && (
          <span className="bo-rank">区域排名<b>{String(copy.rank).padStart(2, '0')}</b><u>/ {String(copy.rankTotal).padStart(2, '0')}</u></span>
        )}
        <p className="bo-lead">{copy.lead}</p>

        {p.showShare && (
          p.chartType === 'donut' ? (
            <ShareDonut split={copy.shareSplit} />
          ) : (
            <div className="bo-share">
              <div className="bo-share-t"><span>{copy.shareTitle}</span><b>NATIONAL SPLIT · 100%</b></div>
              <ShareStack split={copy.shareSplit} />
            </div>
          )
        )}

        <div className="bo-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(mN, 2)}, 1fr)` }}>
          {metrics.map((m, i) => (
            <div className="bo-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="bo-mlbl">{m.label}</div>
              <div className="bo-mval">{m.value}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>

        <div className="bo-tags">
          {tags.map((t, i) => (
            <span className={'bo-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="bo-hero">
        {imgN === 0 ? (
          <div className="bo-cell fixed">
            <div className="bo-frame" style={{ '--ar': String(heroAR) }}>
              <div className="bo-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'bo-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="bo-badge">{copy.badge}</span>}
              {i === 0 && <span className="bo-cityname">{copy.enName}</span>}
              <div className="bo-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bo-foot">
        <div className="bo-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="bo-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
