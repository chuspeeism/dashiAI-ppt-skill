/**
 * SeattlePage — P58 云计算人才外溢 (Seattle Cluster · Image-led · Geo Card)
 *
 * A regional "geo card": one US funding cluster (Seattle) profiled with its
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
 * Self-contained & prop-driven. All styling is scoped under `.aic-sea`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Seattle Cluster',
  segment: '西雅图集群',
  enName: 'SEATTLE',
  rank: 3, rankTotal: 5,
  title: '云计算人才外溢',
  titleTail: '西雅图集群',
  lead: '西雅图受益于云计算生态和大厂工程人才外溢；更适合孕育基础设施、开发者工具和企业 AI。',
  shareTitle: '全美融资额占比',
  shareValue: '9.8',
  closing: '云计算底座带来 AI 基础设施机会。',
  badge: '西雅图集群',
  // national 100% split; `on` marks this region's segment (highlighted)
  shareSplit: [
    { k: '湾区', v: 63.9 },
    { k: '纽约', v: 12.4 },
    { k: '西雅图', v: 9.8, on: true },
    { k: '波士顿', v: 7.7 },
    { k: '其他', v: 6.2 },
  ],
  // industry tags (order fixed; count is prop-driven)
  tags: ['基础设施', '开发者工具', '企业 AI', '云原生', '数据平台'],
  // supporting metrics (order fixed; count is prop-driven)
  metrics: [
    { label: '区域融资额', value: '95', unit: '亿美元' },
    { label: '全美占比', value: '9.8', unit: '%' },
    { label: '区域事件数', value: '10', unit: '笔' },
    { label: '平均单笔', value: '9.5', unit: '亿美元' },
  ],
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
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
.aic-sea { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-sea, .aic-sea * { box-sizing: border-box; }
.aic-sea .se-glow { position: absolute; left: 14%; top: -10%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-sea .se-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-sea .se-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-sea .se-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-sea .se-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-sea .se-col { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-sea .se-rank { display: inline-flex; align-self: flex-start; align-items: center; gap: 12px;
  padding: 9px 18px; border-radius: 999px; background: var(--aic-ink); color: #fff;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .04em; }
.aic-sea .se-rank b { font-size: 22px; color: var(--aic-accent-bright); }
.aic-sea .se-rank u { text-decoration: none; opacity: .6; }
.aic-sea .se-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; max-width: 900px; text-wrap: pretty; }
.aic-sea .se-lead em { font-style: normal; color: var(--aic-accent-deep); font-weight: 700; }

/* national share chart */
.aic-sea .se-share { margin-top: 30px; }
.aic-sea .se-share-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 14px; }
.aic-sea .se-share-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-sea .se-share-t b { font-family: var(--aic-font-display); font-weight: 700; font-size: 17px; color: var(--aic-faint);
  letter-spacing: .04em; }
.aic-sea .se-stack { display: flex; height: 56px; border-radius: 14px; overflow: hidden; gap: 3px; }
.aic-sea .se-seg { position: relative; display: flex; align-items: center; justify-content: center;
  background: var(--aic-hair); min-width: 8px; transition: flex-grow .5s; }
.aic-sea .se-seg:first-child { border-top-left-radius: 11px; border-bottom-left-radius: 11px; }
.aic-sea .se-seg:last-child { border-top-right-radius: 11px; border-bottom-right-radius: 11px; }
.aic-sea .se-seg.on { background: var(--aic-accent); }
.aic-sea .se-seg-k { font-family: var(--aic-font-text); font-weight: 700; font-size: 17px; color: var(--aic-muted);
  white-space: nowrap; }
.aic-sea .se-seg.on .se-seg-k { color: var(--aic-ink); }
.aic-sea .se-seg.lead .se-seg-k { color: var(--aic-ink-dim); }
.aic-sea .se-seg-tip { position: absolute; top: -34px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); white-space: nowrap; }
.aic-sea .se-seg-tip u { text-decoration: none; font-size: 15px; color: var(--aic-muted); margin-left: 3px; }

.aic-sea .se-share[data-mode="donut"] { display: flex; align-items: center; gap: 32px; }
.aic-sea .se-donut-legend { display: flex; flex-direction: column; gap: 11px; }
.aic-sea .se-leg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); }
.aic-sea .se-leg i { width: 14px; height: 14px; border-radius: 4px; flex: none; }
.aic-sea .se-leg.on { color: var(--aic-ink); font-weight: 800; }
.aic-sea .se-leg u { text-decoration: none; margin-left: auto; font-family: var(--aic-font-display);
  font-variant-numeric: tabular-nums; color: var(--aic-muted); }
.aic-sea .se-leg.on u { color: var(--aic-accent-deep); }

/* metric strip */
.aic-sea .se-metrics { margin-top: auto; display: grid; gap: 18px; padding-top: 26px; }
.aic-sea .se-mcell { position: relative; padding-left: 22px; border-left: 3px solid var(--aic-hair-strong);
  transition: border-color .3s; }
.aic-sea .se-mcell[data-focus="1"] { border-left-color: var(--aic-accent); }
.aic-sea .se-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 7px; }
.aic-sea .se-mval { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; line-height: 1;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-sea .se-mcell[data-focus="1"] .se-mval { color: var(--aic-accent-deep); }
.aic-sea .se-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* industry tags */
.aic-sea .se-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.aic-sea .se-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-sea .se-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* hero image (right) */
.aic-sea .se-hero { position: absolute; left: 1100px; right: var(--pad); top: 300px; bottom: 150px;
  display: flex; gap: 16px; }
.aic-sea .se-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-sea .se-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-sea .se-cell.fixed .se-frame { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: auto; max-width: 100%; }
.aic-sea .se-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-sea .se-cell.auto .se-frame { height: auto; width: 100%; }
.aic-sea .se-cell.auto .se-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-sea .se-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 7px 14px; border-radius: 999px; white-space: nowrap; }
.aic-sea .se-cityname { position: absolute; left: 0; right: 0; bottom: 0; z-index: 4; padding: 60px 26px 24px;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 40px; letter-spacing: .06em; color: #fff;
  background: linear-gradient(to top, rgba(8,10,6,.78), transparent); pointer-events: none; }
.aic-sea .se-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-sea .se-ph-cap { position: absolute; left: 0; right: 0; bottom: 20px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-sea .se-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

.aic-sea .se-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-sea .se-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-sea .se-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-sea .se-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'seph-' + i;
  return (
    <div className="se-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="se-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

// national 100% stacked share bar — this region's segment highlighted
function ShareStack({ split }) {
  return (
    <div className="se-stack">
      {split.map((s) => (
        <div key={s.k} className={'se-seg' + (s.on ? ' on' : (s.v > 40 ? ' lead' : ''))}
          style={{ flexGrow: s.v }}>
          {s.on && <span className="se-seg-tip">{s.v}<u>%</u></span>}
          {(s.on || s.v > 8) && <span className="se-seg-k">{s.k}</span>}
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
    <div className="se-share" data-mode="donut">
      <Donut segments={segments} size={210} thickness={36} focusIndex={onIdx}
        centerTop={hit.v + '%'} centerBottom={hit.k} />
      <div className="se-donut-legend">
        {split.map((s, i) => (
          <div key={s.k} className={'se-leg' + (s.on ? ' on' : '')}>
            <i style={{ background: segments[i].color }} />{s.k}<u>{s.v}%</u>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeattlePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-sea', CSS);
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
    <div className="aic-sea" style={vars}>
      {p.showDecorations && <div className="se-glow" />}

      <div className="se-head">
        <div>
          <p className="se-eyebrow">{copy.eyebrow}</p>
          <h2 className="se-title">{copy.title}</h2>
        </div>
        <div className="se-sub">{copy.titleTail}</div>
      </div>

      <div className="se-col">
        {p.showDecorations && (
          <span className="se-rank">区域排名<b>{String(copy.rank).padStart(2, '0')}</b><u>/ {String(copy.rankTotal).padStart(2, '0')}</u></span>
        )}
        <p className="se-lead">{copy.lead}</p>

        {p.showShare && (
          p.chartType === 'donut' ? (
            <ShareDonut split={copy.shareSplit} />
          ) : (
            <div className="se-share">
              <div className="se-share-t"><span>{copy.shareTitle}</span><b>NATIONAL SPLIT · 100%</b></div>
              <ShareStack split={copy.shareSplit} />
            </div>
          )
        )}

        <div className="se-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(mN, 2)}, 1fr)` }}>
          {metrics.map((m, i) => (
            <div className="se-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="se-mlbl">{m.label}</div>
              <div className="se-mval">{m.value}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>

        <div className="se-tags">
          {tags.map((t, i) => (
            <span className={'se-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="se-hero">
        {imgN === 0 ? (
          <div className="se-cell fixed">
            <div className="se-frame" style={{ '--ar': String(heroAR) }}>
              <div className="se-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'se-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="se-badge">{copy.badge}</span>}
              {i === 0 && <span className="se-cityname">{copy.enName}</span>}
              <div className="se-frame" style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="se-foot">
        <div className="se-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="se-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
