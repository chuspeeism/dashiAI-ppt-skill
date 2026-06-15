/**
 * ComputePage — P37 算力供给稀缺 (GPU Cloud · Chart-led · Segment Card)
 *
 * Chart-led single-segment slide. The signature device is a "compute cluster"
 * heat-grid: a rack of GPU node cells whose fill encodes utilization, paired
 * with a resource-allocation split bar. An editorial rail (lead + metric cards
 * + closing) anchors the left. Chart type, grid density, metric-card count,
 * the resource split and the focus card are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-cmp`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BarRow, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'GPU Cloud',
  segment: 'GPU 云与算力租赁',
  title: '算力供给稀缺',
  titleTail: 'GPU 云与算力租赁',
  lead: 'GPU 云公司受益于训练和推理双重需求；壁垒来自供给锁定、客户绑定和资本开支效率。',
  closing: '算力是 AI 时代最直接的硬资源。',
  chartTitle: '算力集群 · 资源利用',
  splitTitle: '资源构成 / 占比',
  // metric cards (order fixed; count is prop-driven)
  metrics: [
    { lbl: '融资额', val: '64', unit: '亿美元' },
    { lbl: '事件数', val: '9', unit: '笔' },
    { lbl: '平均单笔', val: '7.1', unit: '亿美元' },
    { lbl: 'H100/H200 占比', val: '58', unit: '%' },
  ],
  // resource allocation split (used by bars chart + top strip; percent)
  split: [
    { label: 'H100 / H200', value: 58, note: '新一代训练算力' },
    { label: 'A100 及以下', value: 30, note: '存量推理算力' },
    { label: '弹性 / 其他', value: 12, note: '按需与异构资源' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  chartType: 'cluster',  // 'cluster' | 'bars'
  gridDensity: 12,       // cluster columns (8–16); rows derived
  metricCount: 4,        // metric cards shown (2–4)
  focusEnabled: true,    // highlight one metric card
  focusIndex: 0,         // which card is the focus (0-based)
  showSplit: true,       // resource-allocation split (strip / bars)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'GPU Cloud' },
  { key: 'segment', label: 'segment', type: 'text', default: 'GPU 云与算力租赁' },
  { key: 'title', label: '标题', type: 'text', default: '算力供给稀缺' },
  { key: 'titleTail', label: '副标题', type: 'text', default: 'GPU 云与算力租赁' },
  { key: 'lead', label: '导言', type: 'text', default: 'GPU 云公司受益于训练和推理双重需求；壁垒来自供给锁定、客户绑定和资本开支效率。' },
  { key: 'closing', label: '结语', type: 'text', default: '算力是 AI 时代最直接的硬资源。' },
  { key: 'chartTitle', label: 'chartTitle', type: 'text', default: '算力集群 · 资源利用' },
  { key: 'splitTitle', label: 'splitTitle', type: 'text', default: '资源构成 / 占比' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'cluster',
    options: [{ value: 'cluster', label: '集群网格' }, { value: 'bars', label: '占比条' }],
    description: '主图表样式：算力集群热力网格 / 资源占比条。' },
  { key: 'gridDensity', label: '图表密度', type: 'slider', default: 12, min: 8, max: 16, step: 1,
    description: '集群网格的列密度（8–16）；行数自动推导。', showWhen: (p) => p.chartType === 'cluster' },
  { key: 'metricCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '左侧指标卡数量（2–4）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一张指标卡作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 张' }, { value: 1, label: '第 2 张' },
      { value: 2, label: '第 3 张' }, { value: 3, label: '第 4 张' }],
    description: '选择被高亮的指标卡。', showWhen: (p) => p.focusEnabled },
  { key: 'showSplit', label: '占比图', type: 'toggle', default: true,
    description: '资源构成占比（网格上方条带 / 占比条）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、集群高负载单元与高亮卡。' },
];

const CSS = `
.aic-cmp { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-cmp, .aic-cmp * { box-sizing: border-box; }
.aic-cmp .cm-glow { position: absolute; right: -4%; top: -10%; width: 54%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-cmp .cm-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-cmp .cm-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-cmp .cm-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0; }
.aic-cmp .cm-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left rail */
.aic-cmp .cm-rail { position: absolute; left: var(--pad); top: 312px; bottom: 150px; width: 700px;
  display: flex; flex-direction: column; }
.aic-cmp .cm-marker { display: flex; align-items: center; gap: 16px; }
.aic-cmp .cm-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-cmp .cm-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-cmp .cm-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; text-wrap: pretty; }
.aic-cmp .cm-cards { margin-top: 34px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.aic-cmp .cm-card { position: relative; border: 1.5px solid var(--aic-hair); border-radius: 20px;
  background: var(--aic-card); padding: 24px 26px 22px; overflow: hidden; transition: border-color .3s, background .3s; }
.aic-cmp .cm-card[data-focus="1"] { border-color: transparent;
  background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 18%, var(--aic-card)), var(--aic-card) 78%); }
.aic-cmp .cm-card[data-focus="1"]::after { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: var(--aic-accent); }
.aic-cmp .cm-card-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 19px; color: var(--aic-muted); }
.aic-cmp .cm-card-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 52px; line-height: 1;
  color: var(--aic-ink); margin-top: 12px; font-variant-numeric: tabular-nums; }
.aic-cmp .cm-card[data-focus="1"] .cm-card-val { color: var(--aic-accent-deep); }
.aic-cmp .cm-card-val u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-muted); margin-left: 5px; }
.aic-cmp .cm-closing { margin-top: auto; display: flex; align-items: center; gap: 16px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-cmp .cm-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* right chart panel */
.aic-cmp .cm-panel { position: absolute; left: 832px; right: var(--pad); top: 312px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-cmp .cm-panel-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 20px; white-space: nowrap; }
.aic-cmp .cm-panel-t > span { white-space: nowrap; }
.aic-cmp .cm-panel-t em { font-style: normal; font-size: 16px; letter-spacing: .08em; color: var(--aic-faint); }

/* resource split strip (cluster mode top) */
.aic-cmp .cm-strip { display: flex; height: 56px; border-radius: 12px; overflow: hidden;
  border: 1.5px solid var(--aic-hair); margin-bottom: 22px; }
.aic-cmp .cm-strip-seg { position: relative; display: flex; flex-direction: column; justify-content: center;
  padding: 0 18px; min-width: 0; transition: flex-grow .5s; }
.aic-cmp .cm-strip-seg b { font-family: var(--aic-font-display); font-weight: 700; font-size: 24px;
  line-height: 1; font-variant-numeric: tabular-nums; }
.aic-cmp .cm-strip-seg span { font-family: var(--aic-font-text); font-weight: 600; font-size: 15px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 3px; }

/* cluster heat grid */
.aic-cmp .cm-cluster { flex: 1; display: grid; gap: 7px; min-height: 0; align-content: stretch; }
.aic-cmp .cm-node { border-radius: 5px; position: relative; background: var(--aic-hair);
  transition: background .4s, transform .3s; }
.aic-cmp .cm-node.on { background: color-mix(in srgb, var(--aic-accent) calc(var(--u) * 1%), var(--aic-accent-soft)); }
.aic-cmp .cm-node.hot { background: linear-gradient(160deg, var(--aic-accent-bright), var(--aic-accent) 72%);
  box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--aic-accent) 50%, white); }
.aic-cmp .cm-cluster-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 18px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 17px; color: var(--aic-muted); }
.aic-cmp .cm-scale { display: flex; align-items: center; gap: 10px; }
.aic-cmp .cm-scale i { width: 26px; height: 12px; border-radius: 3px; }

/* bars mode */
.aic-cmp .cm-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 38px; }

.aic-cmp .cm-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: flex-end; }
.aic-cmp .cm-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

const SPLIT_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 46%, white)',
  'var(--aic-hair-strong)',
];

// Deterministic utilization for a cluster cell (stable across renders).
function util(i, total) {
  const s = Math.sin(i * 12.9898 + 4.13) * 43758.5453;
  const f = s - Math.floor(s);
  // weight toward the slide's stated 58% busy share
  return Math.round((0.22 + f * 0.78) * 100);
}

export default function ComputePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-cmp', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.metricCount));
  const metrics = copy.metrics.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));

  const cols = Math.max(8, Math.min(16, p.gridDensity));
  const rows = 6;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const u = util(i, cols * rows);
    return { u, on: u >= 36, hot: u >= 82 };
  });

  const maxSplit = Math.max(...copy.split.map((s) => s.value));

  return (
    <div className="aic-cmp" style={vars}>
      {p.showDecorations && <div className="cm-glow" />}

      <div className="cm-head">
        <div>
          <p className="cm-eyebrow">{copy.eyebrow}</p>
          <h2 className="cm-title">{copy.title}</h2>
        </div>
        <div className="cm-sub">{copy.titleTail}</div>
      </div>

      <div className="cm-rail">
        <div className="cm-marker"><b /><span>{copy.segment}</span></div>
        <p className="cm-lead">{copy.lead}</p>
        <div className="cm-cards">
          {metrics.map((m, i) => (
            <div className="cm-card" key={m.lbl} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="cm-card-lbl">{m.lbl}</div>
              <div className="cm-card-val">{m.val}<u>{m.unit}</u></div>
            </div>
          ))}
        </div>
        <div className="cm-closing"><b />{copy.closing}</div>
      </div>

      <div className="cm-panel">
        {p.chartType === 'cluster' ? (
          <React.Fragment>
            <p className="cm-panel-t"><span>{copy.chartTitle}</span><em>NODES {cols * rows}</em></p>
            {p.showSplit && (
              <div className="cm-strip">
                {copy.split.map((s, i) => (
                  <div className="cm-strip-seg" key={s.label}
                    style={{ flex: s.value, background: SPLIT_FILL[i % SPLIT_FILL.length],
                      color: i === 0 ? 'var(--aic-ink)' : (i === 2 ? 'var(--aic-ink)' : 'var(--aic-ink)') }}>
                    <b>{s.value}%</b><span>{s.label}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="cm-cluster" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {cells.map((c, i) => (
                <div key={i} className={'cm-node' + (c.hot ? ' hot' : c.on ? ' on' : '')}
                  style={{ '--u': c.u }} />
              ))}
            </div>
            <div className="cm-cluster-foot">
              <span>单元 = 算力节点 · 填充 = 利用率</span>
              <div className="cm-scale">
                <i style={{ background: 'var(--aic-accent-soft)' }} />
                <i style={{ background: 'color-mix(in srgb, var(--aic-accent) 55%, white)' }} />
                <i style={{ background: 'var(--aic-accent)' }} />
                <span style={{ marginLeft: 4 }}>低 → 满载</span>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="cm-panel-t"><span>{copy.splitTitle}</span><em>SHARE</em></p>
            <div className="cm-bars">
              {copy.split.map((s, i) => (
                <BarRow key={s.label} label={s.label} display={s.value + '%'}
                  value={s.value / maxSplit * 100}
                  color={SPLIT_FILL[i % SPLIT_FILL.length]}
                  focus={i === 0} />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="cm-foot">
        {p.showDecorations && <div className="cm-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
