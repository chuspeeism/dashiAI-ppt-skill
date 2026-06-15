/**
 * AlliancePage — P54 投资与算力消费闭环 (Cloud Alliances · Chart-led · Alliance Map)
 *
 * Chart-led slide (no image). The signature device is an "alliance map": cloud
 * providers on the left invest into a central AI-model-company hub (forward
 * connectors sized by investment), and a dashed return arc closes the loop as
 * compute consumption flows back — investment recouped as cloud spend. An
 * editorial rail (lead + total anchor + closing) anchors the left. Provider
 * count, chart type, the focus provider, the loop and value labels are all
 * prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-ally`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BarRow, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BarRow, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Cloud Alliances',
  segment: '云厂商联盟',
  title: '投资与算力消费闭环',
  titleTail: '云厂商联盟',
  lead: '云厂商投资 AI 公司，并通过算力消费回收价值；云投资本质上是在锁定未来算力需求。',
  closing: '云资源正在成为融资交易的一部分。',
  chartTitle: '云厂商 · 模型公司联盟',
  barsTitle: '云厂商相关投资 / 占比',
  totalVal: '252',
  totalUnit: '亿美元',
  totalLbl: '云厂商相关投资合计',
  hub: { lead: 'AI 模型公司', sub: '算力需求方' },
  cycle: ['资本投资', '算力授信', '消费回收'],
  legendInvest: '资本投资',
  legendReturn: '算力消费回收',
  // cloud providers (order fixed; count is prop-driven). value in 亿美元.
  providers: [
    { label: 'Azure', value: 88, note: 'Microsoft 云' },
    { label: 'AWS', value: 74, note: 'Amazon 云' },
    { label: 'Google Cloud', value: 69, note: 'Google 云' },
    { label: 'Oracle Cloud', value: 21, note: 'Oracle 云' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  providerCount: 4,      // cloud provider nodes (2–4)
  chartType: 'map',      // 'map' | 'bars'
  focusEnabled: true,    // highlight one provider
  focusIndex: 0,         // which provider is the focus (0-based)
  showLoop: true,        // compute-consumption return arc + cycle (map mode)
  showValues: true,      // amount labels
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Cloud Alliances' },
  { key: 'segment', label: 'segment', type: 'text', default: '云厂商联盟' },
  { key: 'title', label: '标题', type: 'text', default: '投资与算力消费闭环' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '云厂商联盟' },
  { key: 'lead', label: '导言', type: 'text', default: '云厂商投资 AI 公司，并通过算力消费回收价值；云投资本质上是在锁定未来算力需求。' },
  { key: 'closing', label: '结语', type: 'text', default: '云资源正在成为融资交易的一部分。' },
  { key: 'chartTitle', label: 'chartTitle', type: 'text', default: '云厂商 · 模型公司联盟' },
  { key: 'barsTitle', label: 'barsTitle', type: 'text', default: '云厂商相关投资 / 占比' },
  { key: 'totalVal', label: 'totalVal', type: 'text', default: '252' },
  { key: 'totalUnit', label: 'totalUnit', type: 'text', default: '亿美元' },
  { key: 'totalLbl', label: 'totalLbl', type: 'text', default: '云厂商相关投资合计' },
  { key: 'legendInvest', label: 'legendInvest', type: 'text', default: '资本投资' },
  { key: 'legendReturn', label: 'legendReturn', type: 'text', default: '算力消费回收' },
  { key: 'providerCount', label: '卡片数量', type: 'slider', default: 4, min: 2, max: 4, step: 1,
    description: '云厂商节点数量（2–4）。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'map',
    options: [{ value: 'map', label: '关系图' }, { value: 'bars', label: '占比条' }],
    description: '主图表样式：联盟关系图 / 投资占比条。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个云厂商作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' },
      { value: 2, label: '第 3 个' }, { value: 3, label: '第 4 个' }],
    description: '选择被高亮的云厂商。', showWhen: (p) => p.focusEnabled },
  { key: 'showLoop', label: '回路标识', type: 'toggle', default: true,
    description: '算力消费回收的回路连接与闭环说明显隐。', showWhen: (p) => p.chartType === 'map' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '节点 / 连接上的投资数值标签显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于厂商节点、投资连接与高亮节点。' },
];

const CSS = `
.aic-ally { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-ally, .aic-ally * { box-sizing: border-box; }
.aic-ally .al-glow { position: absolute; right: -4%; top: -10%; width: 54%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 70%); }

.aic-ally .al-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-ally .al-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-ally .al-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-ally .al-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left rail */
.aic-ally .al-rail { position: absolute; left: var(--pad); top: 312px; bottom: 150px; width: 660px;
  display: flex; flex-direction: column; }
.aic-ally .al-marker { display: flex; align-items: center; gap: 16px; }
.aic-ally .al-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-ally .al-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-ally .al-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 29px; line-height: 1.5;
  color: var(--aic-ink); margin: 22px 0 0; text-wrap: pretty; }
.aic-ally .al-anchor { margin-top: 40px; }
.aic-ally .al-anchor-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 116px; line-height: .82;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; display: flex; align-items: baseline; }
.aic-ally .al-anchor-v u { text-decoration: none; font-size: 34px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 10px; }
.aic-ally .al-anchor-l { font-family: var(--aic-font-text); font-weight: 600; font-size: 22px; color: var(--aic-muted); margin-top: 10px; }
.aic-ally .al-cycle { margin-top: 34px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.aic-ally .al-cycle-step { display: flex; align-items: center; gap: 10px; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 19px; color: var(--aic-ink); padding: 9px 16px; border-radius: 999px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair-strong); white-space: nowrap; }
.aic-ally .al-cycle-step i { width: 9px; height: 9px; border-radius: 50%; background: var(--aic-accent); }
.aic-ally .al-cycle-arrow { color: var(--aic-faint); font-weight: 700; font-size: 20px; }
.aic-ally .al-closing { margin-top: auto; display: flex; align-items: center; gap: 16px;
  font-family: var(--aic-font-text); font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-ally .al-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }

/* right chart panel */
.aic-ally .al-panel { position: absolute; left: 800px; right: var(--pad); top: 312px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-ally .al-panel-t { display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 14px; }
.aic-ally .al-legend { display: flex; align-items: center; gap: 22px; }
.aic-ally .al-leg { display: flex; align-items: center; gap: 8px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 16px; letter-spacing: 0; text-transform: none; color: var(--aic-muted); }
.aic-ally .al-leg i { width: 26px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-ally .al-leg i.ret { height: 0; border-top: 3px dashed var(--aic-ink-dim); border-radius: 0; background: none; }
.aic-ally .al-map { flex: 1; min-height: 0; display: grid; place-items: center; }
.aic-ally .al-map svg { width: 100%; height: 100%; display: block; }
.aic-ally .al-pname { font-family: var(--aic-font-text); font-weight: 700; fill: var(--aic-ink); }
.aic-ally .al-pname.dim { fill: var(--aic-muted); }
.aic-ally .al-pnote { font-family: var(--aic-font-text); font-weight: 500; fill: var(--aic-muted); }
.aic-ally .al-pval { font-family: var(--aic-font-display); font-weight: 700; fill: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-ally .al-hubt { font-family: var(--aic-font-display); font-weight: 700; fill: #fff; }
.aic-ally .al-hubs { font-family: var(--aic-font-display); font-weight: 600; fill: rgba(255,255,255,.72); letter-spacing: .1em; }
.aic-ally .al-retlbl { font-family: var(--aic-font-display); font-weight: 600; fill: var(--aic-ink-dim); }

/* bars mode */
.aic-ally .al-bars { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 34px; padding-right: 10px; }

.aic-ally .al-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: flex-end; }
.aic-ally .al-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

const BAR_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 64%, white)',
  'color-mix(in srgb, var(--aic-accent) 44%, white)',
  'var(--aic-hair-strong)',
];

// Alliance relationship map: providers (left) → hub (right) with a return loop.
function AllianceMap({ copy, providers, focus, focusEnabled, showLoop, showValues }) {
  const W = 980, H = 600;
  const HUBX = 752, HUBY = 296, HUB_R = 118;
  const maxV = Math.max(...providers.map((p) => p.value));
  const chipX = 16, chipW = 250, chipH = 96;
  const top = 40, span = H - 150 - top;
  const items = providers.map((p, i) => {
    const py = providers.length === 1 ? (top + span / 2)
      : top + (span / (providers.length - 1)) * i + chipH / 2;
    const sx = chipX + chipW, sy = py;
    const dx = sx - HUBX, dy = sy - HUBY, len = Math.hypot(dx, dy) || 1;
    const tx = HUBX + HUB_R * dx / len, ty = HUBY + HUB_R * dy / len;
    const w = 5 + (p.value / maxV) * 22;
    const on = focusEnabled && i === focus;
    return { ...p, py, sx, sy, tx, ty, w, on };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* return loop arc (compute consumption recouped) */}
      {showLoop && (
        <g>
          <path d={`M ${HUBX} ${HUBY + HUB_R} C ${HUBX - 40} ${H - 26}, ${chipX + 120} ${H - 18}, ${chipX + 70} ${H - 56}`}
            fill="none" stroke="var(--aic-ink-dim)" strokeWidth="2.5" strokeDasharray="3 9" markerEnd="url(#al-arrow)" />
          <text className="al-retlbl" x={(HUBX + chipX) / 2} y={H - 8} textAnchor="middle"
            style={{ fontSize: 18 }}>← 算力消费回收</text>
        </g>
      )}
      <defs>
        <marker id="al-arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0 0 L6 3 L0 6 Z" fill="var(--aic-ink-dim)" />
        </marker>
      </defs>
      {/* forward investment connectors */}
      {items.map((it, i) => (
        <path key={'c' + i}
          d={`M ${it.sx} ${it.sy} C ${(it.sx + it.tx) / 2} ${it.sy}, ${(it.sx + it.tx) / 2} ${it.ty}, ${it.tx} ${it.ty}`}
          fill="none" strokeLinecap="round" strokeWidth={it.w}
          stroke={it.on ? 'var(--aic-accent)' : 'color-mix(in srgb, var(--aic-accent) 30%, white)'}
          opacity={focusEnabled && !it.on ? 0.7 : 1} />
      ))}
      {/* provider chips */}
      {items.map((it, i) => (
        <g key={'p' + i}>
          <rect x={chipX} y={it.py - chipH / 2} width={chipW} height={chipH} rx="20"
            fill="var(--aic-card)" stroke={it.on ? 'var(--aic-accent)' : 'var(--aic-hair-strong)'}
            strokeWidth={it.on ? 3 : 1.5} />
          <circle cx={chipX + 34} cy={it.py} r="11" fill={it.on ? 'var(--aic-accent)' : 'var(--aic-ink)'} />
          <text className={'al-pname' + (focusEnabled && !it.on ? ' dim' : '')} x={chipX + 56} y={it.py - 8}
            style={{ fontSize: 25 }}>{it.label}</text>
          <text className="al-pnote" x={chipX + 56} y={it.py + 20} style={{ fontSize: 16 }}>{it.note}</text>
          {showValues && (
            <text className="al-pval" x={chipX + chipW - 18} y={it.py + 6} textAnchor="end"
              style={{ fontSize: 30 }}>{it.value}</text>
          )}
        </g>
      ))}
      {/* central hub */}
      <circle cx={HUBX} cy={HUBY} r={HUB_R} fill="var(--aic-ink)" />
      <circle cx={HUBX} cy={HUBY} r={HUB_R - 9} fill="none" stroke="var(--aic-accent)" strokeWidth="2.5" opacity="0.9" />
      <text className="al-hubt" x={HUBX} y={HUBY - 8} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 30 }}>{copy.hub.lead}</text>
      <text className="al-hubs" x={HUBX} y={HUBY + 28} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 17 }}>{copy.hub.sub}</text>
    </svg>
  );
}

export default function AlliancePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-ally', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(2, Math.min(4, p.providerCount));
  const providers = copy.providers.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const maxV = Math.max(...providers.map((x) => x.value));

  return (
    <div className="aic-ally" style={vars}>
      {p.showDecorations && <div className="al-glow" />}

      <div className="al-head">
        <div>
          <p className="al-eyebrow">{copy.eyebrow}</p>
          <h2 className="al-title">{copy.title}</h2>
        </div>
        <div className="al-sub">{copy.titleTail}</div>
      </div>

      <div className="al-rail">
        <div className="al-marker"><b /><span>{copy.segment}</span></div>
        <p className="al-lead">{copy.lead}</p>
        <div className="al-anchor">
          <div className="al-anchor-v">{copy.totalVal}<u>{copy.totalUnit}</u></div>
          <div className="al-anchor-l">{copy.totalLbl}</div>
        </div>
        <div className="al-cycle">
          {copy.cycle.map((step, i) => (
            <React.Fragment key={step}>
              <span className="al-cycle-step"><i />{step}</span>
              {i < copy.cycle.length - 1 && <span className="al-cycle-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="al-closing"><b />{copy.closing}</div>
      </div>

      <div className="al-panel">
        {p.chartType === 'map' ? (
          <React.Fragment>
            <div className="al-panel-t">
              <span>{copy.chartTitle}</span>
              <div className="al-legend">
                <span className="al-leg"><i />{copy.legendInvest}</span>
                {p.showLoop && <span className="al-leg"><i className="ret" />{copy.legendReturn}</span>}
              </div>
            </div>
            <div className="al-map">
        <AllianceMap copy={copy} providers={providers} focus={focus} focusEnabled={p.focusEnabled}
          showLoop={p.showLoop} showValues={p.showValues} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="al-panel-t"><span>{copy.barsTitle}</span><span style={{ letterSpacing: '.06em' }}>亿美元</span></div>
            <div className="al-bars">
              {providers.map((s, i) => (
                <BarRow key={s.label} label={s.label} display={p.showValues ? s.value + ' 亿' : ''}
                  value={s.value / maxV * 100}
                  color={BAR_FILL[i % BAR_FILL.length]}
                  focus={p.focusEnabled && i === focus}
                  dim={p.focusEnabled && i !== focus} />
              ))}
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="al-foot">
        {p.showDecorations && <div className="al-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
