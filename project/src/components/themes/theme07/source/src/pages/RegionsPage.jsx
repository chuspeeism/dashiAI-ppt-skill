/**
 * RegionsPage — P60 分散型应用落地 (Other Regions · Dot-distribution Map)
 *
 * The dispersed counterpart to the city-cluster series. Instead of a hero photo
 * the right panel is a "dot map": a scattered field of small market points with
 * a few labelled regional hubs sized by funding — visualising activity spread
 * thinly across non-core regions. Shares the regional series' editorial column
 * (rank chip, national-share chart, metrics, industry tags) on the left.
 *
 * No image slot — the map is the hero, so this page is fully self-contained and
 * export-safe with zero host wiring. Scatter positions are seeded (stable).
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-reg`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (Donut, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { Donut, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Other Regions',
  segment: '其他地区机会',
  rank: 5, rankTotal: 5,
  title: '分散型应用落地',
  titleTail: '其他地区机会',
  lead: '其他地区融资规模较小，但出现行业专用模型和本地化应用机会；本地行业资源也能形成应用机会。',
  shareTitle: '全美融资额占比',
  mapTitle: '区域活跃分布',
  mapLegend: '点 = 融资事件 · 圈 = 区域枢纽',
  closing: '本地行业资源也能形成应用机会。',
  // national 100% split; `on` marks this region's segment (highlighted)
  shareSplit: [
    { k: '湾区', v: 63.9 },
    { k: '纽约', v: 12.4 },
    { k: '西雅图', v: 9.8 },
    { k: '波士顿', v: 7.7 },
    { k: '其他', v: 6.2, on: true },
  ],
  // industry tags (order fixed; count is prop-driven)
  tags: ['行业专用模型', '本地化应用', '政企服务', '制造', '能源'],
  // supporting metrics (order fixed; count is prop-driven)
  metrics: [
    { label: '区域融资额', value: '60', unit: '亿美元' },
    { label: '全美占比', value: '6.2', unit: '%' },
    { label: '区域事件数', value: '11', unit: '笔' },
    { label: '平均单笔', value: '5.5', unit: '亿美元' },
  ],
  // labelled regional hubs (order fixed; count is prop-driven). x/y in 760×620 map space.
  hubs: [
    { label: '奥斯汀', value: 16, x: 220, y: 210 },
    { label: '丹佛', value: 12, x: 452, y: 132 },
    { label: '亚特兰大', value: 10, x: 588, y: 352 },
    { label: '迈阿密', value: 9, x: 318, y: 452 },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  pointDensity: 48,        // scattered market points on the map (24–72)
  hubCount: 4,             // labelled regional hubs (2–4)
  showShare: true,         // national-share chart module
  chartType: 'bar',        // share chart: 'bar' (stacked) | 'donut'
  tagCount: 4,             // industry tags (2–5)
  metricCount: 4,          // supporting metrics (2–4)
  focusEnabled: true,      // highlight one hub
  focusIndex: 0,           // which hub is the focus (0-based)
  showGrid: true,          // map grid guide
  showValues: true,        // hub value labels
  showDecorations: true,   // glow + heat strip + rank chip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Other Regions' },
  { key: 'segment', label: 'segment', type: 'text', default: '其他地区机会' },
  { key: 'title', label: '标题', type: 'text', default: '分散型应用落地' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '其他地区机会' },
  { key: 'lead', label: '导言', type: 'text', default: '其他地区融资规模较小，但出现行业专用模型和本地化应用机会；本地行业资源也能形成应用机会。' },
  { key: 'shareTitle', label: '占比标题', type: 'text', default: '全美融资额占比' },
  { key: 'mapTitle', label: 'mapTitle', type: 'text', default: '区域活跃分布' },
  { key: 'mapLegend', label: 'mapLegend', type: 'text', default: '点 = 融资事件 · 圈 = 区域枢纽' },
  { key: 'closing', label: '结语', type: 'text', default: '本地行业资源也能形成应用机会。' },
  { key: 'pointDensity', label: '点阵密度', type: 'slider', default: 48, min: 24, max: 72, step: 4,
    description: '地图上散点（融资事件）的数量（24–72）。' },
  { key: 'hubCount', label: '标注数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '带标签的区域枢纽数量（2–4）。' },
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
    description: '是否高亮某一个区域枢纽作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的区域枢纽。', showWhen: (p) => p.focusEnabled },
  { key: 'showGrid', label: '网格', type: 'toggle', default: true,
    description: '地图背景网格参考线的显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '区域枢纽内融资数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、排名标记与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于占比高亮、枢纽与散点。' },
];

const CSS = `
.aic-reg { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-reg, .aic-reg * { box-sizing: border-box; }
.aic-reg .rg-glow { position: absolute; left: 14%; top: -10%; width: 48%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-reg .rg-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-reg .rg-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-reg .rg-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-reg .rg-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* editorial column (left) */
.aic-reg .rg-col { position: absolute; left: var(--pad); top: 300px; bottom: 150px; width: 940px;
  display: flex; flex-direction: column; }
.aic-reg .rg-rank { display: inline-flex; align-self: flex-start; align-items: center; gap: 12px;
  padding: 9px 18px; border-radius: 999px; background: var(--aic-ink); color: #fff;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 19px; letter-spacing: .04em; }
.aic-reg .rg-rank b { font-size: 22px; color: var(--aic-accent-bright); }
.aic-reg .rg-rank u { text-decoration: none; opacity: .6; }
.aic-reg .rg-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 30px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; max-width: 900px; text-wrap: pretty; }

/* national share chart */
.aic-reg .rg-share { margin-top: 30px; }
.aic-reg .rg-share-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin: 0 0 14px; }
.aic-reg .rg-share-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-reg .rg-share-t b { font-family: var(--aic-font-display); font-weight: 700; font-size: 17px; color: var(--aic-faint);
  letter-spacing: .04em; }
.aic-reg .rg-stack { display: flex; height: 56px; border-radius: 14px; overflow: hidden; gap: 3px; }
.aic-reg .rg-seg { position: relative; display: flex; align-items: center; justify-content: center;
  background: var(--aic-hair); min-width: 8px; transition: flex-grow .5s; }
.aic-reg .rg-seg:first-child { border-top-left-radius: 11px; border-bottom-left-radius: 11px; }
.aic-reg .rg-seg:last-child { border-top-right-radius: 11px; border-bottom-right-radius: 11px; }
.aic-reg .rg-seg.on { background: var(--aic-accent); }
.aic-reg .rg-seg-k { font-family: var(--aic-font-text); font-weight: 700; font-size: 17px; color: var(--aic-muted);
  white-space: nowrap; }
.aic-reg .rg-seg.on .rg-seg-k { color: var(--aic-ink); }
.aic-reg .rg-seg.lead .rg-seg-k { color: var(--aic-ink-dim); }
.aic-reg .rg-seg-tip { position: absolute; top: -34px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink); white-space: nowrap; }
.aic-reg .rg-seg-tip u { text-decoration: none; font-size: 15px; color: var(--aic-muted); margin-left: 3px; }

.aic-reg .rg-share[data-mode="donut"] { display: flex; align-items: center; gap: 32px; }
.aic-reg .rg-donut-legend { display: flex; flex-direction: column; gap: 11px; }
.aic-reg .rg-leg { display: flex; align-items: center; gap: 12px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); min-width: 240px; }
.aic-reg .rg-leg i { width: 14px; height: 14px; border-radius: 4px; flex: none; }
.aic-reg .rg-leg.on { color: var(--aic-ink); font-weight: 800; }
.aic-reg .rg-leg u { text-decoration: none; margin-left: auto; font-family: var(--aic-font-display);
  font-variant-numeric: tabular-nums; color: var(--aic-muted); }
.aic-reg .rg-leg.on u { color: var(--aic-accent-deep); }

/* metric strip */
.aic-reg .rg-metrics { margin-top: auto; display: grid; gap: 18px; padding-top: 26px; }
.aic-reg .rg-mcell { position: relative; padding-left: 22px; border-left: 3px solid var(--aic-hair-strong);
  transition: border-color .3s; }
.aic-reg .rg-mcell[data-focus="1"] { border-left-color: var(--aic-accent); }
.aic-reg .rg-mlbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted);
  margin-bottom: 7px; }
.aic-reg .rg-mval { font-family: var(--aic-font-display); font-weight: 700; font-size: 50px; line-height: 1;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-reg .rg-mcell[data-focus="1"] .rg-mval { color: var(--aic-accent-deep); }
.aic-reg .rg-mval u { text-decoration: none; font-size: 19px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }

/* industry tags */
.aic-reg .rg-tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.aic-reg .rg-tag { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 10px 20px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); background: var(--aic-card); }
.aic-reg .rg-tag.lead { background: var(--aic-accent-soft); color: var(--aic-accent-deep);
  border-color: color-mix(in srgb, var(--aic-accent) 40%, white); }

/* dot map (right) */
.aic-reg .rg-map { position: absolute; left: 1100px; right: var(--pad); top: 300px; bottom: 150px;
  border-radius: 26px; border: 1.5px solid var(--aic-hair); background: var(--aic-card); overflow: hidden;
  display: flex; flex-direction: column; }
.aic-reg .rg-map-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  padding: 22px 26px 0; }
.aic-reg .rg-map-t span { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-reg .rg-map-t em { font-style: normal; font-family: var(--aic-font-text); font-weight: 500; font-size: 16px;
  color: var(--aic-faint); }
.aic-reg .rg-map-svg { flex: 1; min-height: 0; padding: 8px; }
.aic-reg .rg-map-svg svg { width: 100%; height: 100%; display: block; }
.aic-reg .rg-hublbl { font-family: var(--aic-font-text); font-weight: 700; fill: var(--aic-ink); }
.aic-reg .rg-hublbl.dim { fill: var(--aic-muted); }
.aic-reg .rg-hubval { font-family: var(--aic-font-display); font-weight: 700; fill: var(--aic-ink);
  font-variant-numeric: tabular-nums; }

.aic-reg .rg-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-reg .rg-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-reg .rg-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-reg .rg-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

// deterministic scatter — seeded LCG so the map is stable across renders
function scatter(n) {
  let s = 0x6d2b79f5;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff; };
  const tones = ['var(--aic-accent)', 'var(--aic-pos)', 'var(--aic-warn)', 'var(--aic-hair-strong)'];
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = 40 + rnd() * 680;
    const y = 40 + rnd() * 540;
    const r = 2.5 + rnd() * 4.5;
    const t = rnd();
    const tone = t < 0.42 ? tones[0] : t < 0.6 ? tones[1] : t < 0.74 ? tones[2] : tones[3];
    pts.push({ x, y, r, tone, o: 0.5 + rnd() * 0.45 });
  }
  return pts;
}

function DotMap({ density, hubs, focus, focusEnabled, showGrid, showValues }) {
  const pts = scatter(density);
  const maxV = Math.max(...hubs.map((h) => h.value));
  return (
    <svg viewBox="0 0 760 620" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {showGrid && (
        <g stroke="var(--aic-hair)" strokeWidth="1">
          {[152, 304, 456, 608].map((x) => <line key={'v' + x} x1={x} y1="20" x2={x} y2="600" />)}
          {[155, 310, 465].map((y) => <line key={'h' + y} x1="30" y1={y} x2="730" y2={y} />)}
        </g>
      )}
      {/* scattered market points */}
      {pts.map((p, i) => (
        <circle key={'p' + i} cx={p.x} cy={p.y} r={p.r} fill={p.tone} opacity={p.o} />
      ))}
      {/* labelled regional hubs */}
      {hubs.map((h, i) => {
        const on = focusEnabled && i === focus;
        const hr = 34 + Math.sqrt(h.value / maxV) * 26;
        return (
          <g key={'h' + i}>
            <circle cx={h.x} cy={h.y} r={hr + 9} fill="none"
              stroke={on ? 'var(--aic-accent)' : 'var(--aic-hair-strong)'} strokeWidth={on ? 2 : 1}
              strokeDasharray="2 7" opacity={on ? 0.9 : 0.6} />
            <circle cx={h.x} cy={h.y} r={hr}
              fill={on ? 'var(--aic-accent)' : 'var(--aic-accent-soft)'}
              stroke={on ? 'var(--aic-accent-deep)' : 'color-mix(in srgb, var(--aic-accent) 30%, white)'}
              strokeWidth={on ? 3 : 1.5} opacity={focusEnabled && !on ? 0.94 : 1} />
            {showValues && (
              <text className="rg-hubval" x={h.x} y={h.y} textAnchor="middle" dominantBaseline="central"
                style={{ fontSize: Math.max(20, hr * 0.6) }}>{h.value}</text>
            )}
            <text className={'rg-hublbl' + (focusEnabled && !on ? ' dim' : '')}
              x={h.x} y={h.y + hr + 24} textAnchor="middle" style={{ fontSize: 22 }}>{h.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ShareStack({ split }) {
  return (
    <div className="rg-stack">
      {split.map((s) => (
        <div key={s.k} className={'rg-seg' + (s.on ? ' on' : (s.v > 40 ? ' lead' : ''))}
          style={{ flexGrow: s.v }}>
          {s.on && <span className="rg-seg-tip">{s.v}<u>%</u></span>}
          {(s.on || s.v > 8) && <span className="rg-seg-k">{s.k}</span>}
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
    <div className="rg-share" data-mode="donut">
      <Donut segments={segments} size={210} thickness={36} focusIndex={onIdx}
        centerTop={hit.v + '%'} centerBottom={hit.k} />
      <div className="rg-donut-legend">
        {split.map((s, i) => (
          <div key={s.k} className={'rg-leg' + (s.on ? ' on' : '')}>
            <i style={{ background: segments[i].color }} />{s.k}<u>{s.v}%</u>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegionsPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-reg', CSS);
  const vars = themeVars(p.accentColor);

  const tagN = Math.max(2, Math.min(copy.tags.length, p.tagCount));
  const tags = copy.tags.slice(0, tagN);
  const mN = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, mN);
  const hubN = Math.max(2, Math.min(4, p.hubCount));
  const hubs = copy.hubs.slice(0, hubN);
  const focus = Math.max(0, Math.min(hubN - 1, p.focusIndex));
  const density = Math.max(24, Math.min(72, p.pointDensity));

  return (
    <div className="aic-reg" style={vars}>
      {p.showDecorations && <div className="rg-glow" />}

      <div className="rg-head">
        <div>
          <p className="rg-eyebrow">{copy.eyebrow}</p>
          <h2 className="rg-title">{copy.title}</h2>
        </div>
        <div className="rg-sub">{copy.titleTail}</div>
      </div>

      <div className="rg-col">
        {p.showDecorations && (
          <span className="rg-rank">区域排名<b>{String(copy.rank).padStart(2, '0')}</b><u>/ {String(copy.rankTotal).padStart(2, '0')}</u></span>
        )}
        <p className="rg-lead">{copy.lead}</p>

        {p.showShare && (
          p.chartType === 'donut' ? (
            <ShareDonut split={copy.shareSplit} />
          ) : (
            <div className="rg-share">
              <div className="rg-share-t"><span>{copy.shareTitle}</span><b>NATIONAL SPLIT · 100%</b></div>
              <ShareStack split={copy.shareSplit} />
            </div>
          )
        )}

        <div className="rg-metrics" style={{ gridTemplateColumns: `repeat(${Math.min(mN, 2)}, 1fr)` }}>
          {metrics.map((m, i) => (
            <div className="rg-mcell" key={m.label} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="rg-mlbl">{m.label}</div>
              <div className="rg-mval">{m.value}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>

        <div className="rg-tags">
          {tags.map((t, i) => (
            <span className={'rg-tag' + (i === 0 ? ' lead' : '')} key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="rg-map">
        <div className="rg-map-t"><span>{copy.mapTitle}</span><em>{copy.mapLegend}</em></div>
        <div className="rg-map-svg">
          <DotMap density={density} hubs={hubs} focus={focus} focusEnabled={p.focusEnabled}
            showGrid={p.showGrid} showValues={p.showValues} />
        </div>
      </div>

      <div className="rg-foot">
        <div className="rg-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="rg-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
