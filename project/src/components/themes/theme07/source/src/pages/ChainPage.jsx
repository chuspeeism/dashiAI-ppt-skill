/**
 * ChainPage — P07 产业链分层透视 (Value Chain · Layered View)
 *
 * Layered-chain slide: stacked upstream/mid/downstream cards on the left,
 * an optional regional-distribution panel on the right. The model layer is
 * the default focus.
 *
 * Self-contained & prop-driven. Scoped under `.aic-chain`.
 * Shared deps: ./theme.js, ./viz.jsx (HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

const COPY = {
  eyebrow: 'Value Chain',
  title: '产业链分层',
  titleTail: '三层透视',
  sub: '上游、中游、下游的资本位置',
  lead: 'AI 融资沿基础设施、模型层和应用层三层展开，地区上高度集中在旧金山湾区。',
  closing: '产业链分层决定了资本确定性与商业风险的不同位置。',
  regionTitle: '地区融资分布',
  layers: [
    { tag: '上游', zh: '基础设施层', en: 'Infrastructure', chips: ['算力', '芯片', '数据'], role: '资本确定性高，最接近刚性预算' },
    { tag: '中游', zh: '模型层', en: 'Model', chips: ['通用模型', '专用模型'], role: '叙事与估值中心，竞争最激烈' },
    { tag: '下游', zh: '应用层', en: 'Application', chips: ['企业应用', '搜索', '机器人'], role: '商业兑现前线，决定长期价值' },
  ],
  regions: [
    { label: '旧金山湾区', pct: 63.9 },
    { label: '纽约', pct: 12.4 },
    { label: '西雅图', pct: 9.8 },
    { label: '波士顿', pct: 7.7 },
    { label: '其他地区', pct: 6.2 },
  ],
};

export const defaultProps = {
  ...COPY,
  cardCount: 3,          // number of chain layers shown (1–3)
  focusEnabled: true,
  focusIndex: 1,         // model layer
  showSecondary: true,   // regional distribution panel
  showDecorations: true,
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Value Chain' },
  { key: 'title', label: '标题', type: 'text', default: '产业链分层' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '三层透视' },
  { key: 'sub', label: '次标题', type: 'text', default: '上游、中游、下游的资本位置' },
  { key: 'lead', label: '导言', type: 'text', default: 'AI 融资沿基础设施、模型层和应用层三层展开，地区上高度集中在旧金山湾区。' },
  { key: 'closing', label: '结语', type: 'text', default: '产业链分层决定了资本确定性与商业风险的不同位置。' },
  { key: 'regionTitle', label: '地区标题', type: 'text', default: '地区融资分布' },
  { key: 'cardCount', label: '分层数量', type: 'slider', default: 3, min: 1, max: 3, step: 1,
    description: '展示的产业链层数（1–3）。' },
  { key: 'showSecondary', label: '辅助面板', type: 'toggle', default: true,
    description: '右侧地区分布面板的显隐；关闭后分层卡占据更大空间。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一层作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 1,
    options: [{ value: 0, label: '第 1 个' }, { value: 1, label: '第 2 个' }, { value: 2, label: '第 3 个' }],
    description: '选择被高亮的产业链层。', showWhen: (p) => p.focusEnabled },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '层间连接线、背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-chain { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-chain, .aic-chain * { box-sizing: border-box; }
.aic-chain .ch-glow { position: absolute; right: -6%; top: -8%; width: 50%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-chain .ch-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-chain .ch-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-chain .ch-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 84px; line-height: .96; margin: 0;
  display: flex; align-items: baseline; gap: 22px; }
.aic-chain .ch-title em { font-style: normal; font-weight: 500; font-size: 34px; color: var(--aic-ink-dim); letter-spacing: .02em; }
.aic-chain .ch-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px;
  color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-chain .ch-lead { position: absolute; left: var(--pad); top: 286px; width: 1320px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 34px; line-height: 1.5; color: var(--aic-ink); margin: 0; }

.aic-chain .ch-body { position: absolute; left: var(--pad); right: var(--pad); top: 420px; bottom: 148px;
  display: grid; gap: 64px; }

.aic-chain .ch-layers { display: flex; flex-direction: column; gap: 18px; }
.aic-chain .ch-card { position: relative; flex: 1; overflow: hidden; border-radius: 22px; padding: 0 38px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); display: flex; align-items: center; gap: 34px;
  transition: background .3s, border-color .3s, transform .3s; }
.aic-chain .ch-card[data-focus="1"] { background: var(--aic-ink); border-color: var(--aic-ink); transform: translateX(10px); }
.aic-chain .ch-badge { flex: none; width: 96px; height: 96px; border-radius: 20px; display: grid; place-items: center;
  background: var(--aic-accent); color: var(--aic-ink); font-family: var(--aic-font-text); font-weight: 900; font-size: 32px; }
.aic-chain .ch-card[data-focus="1"] .ch-badge { background: var(--aic-accent); color: var(--aic-ink); }
.aic-chain .ch-card-body { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.aic-chain .ch-card-zh { font-family: var(--aic-font-text); font-weight: 700; font-size: 36px; color: var(--aic-ink); margin: 0;
  display: flex; align-items: baseline; gap: 16px; }
.aic-chain .ch-card-zh em { font-style: normal; font-family: var(--aic-font-display); font-weight: 500; font-size: 19px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--aic-muted); }
.aic-chain .ch-card[data-focus="1"] .ch-card-zh { color: #fff; }
.aic-chain .ch-card[data-focus="1"] .ch-card-zh em { color: rgba(255,255,255,.55); }
.aic-chain .ch-chips { display: flex; gap: 12px; }
.aic-chain .ch-chip { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink-dim);
  padding: 8px 18px; border-radius: 999px; border: 1.5px solid var(--aic-hair-strong); }
.aic-chain .ch-card[data-focus="1"] .ch-chip { color: #fff; border-color: rgba(255,255,255,.3); }
.aic-chain .ch-role { font-family: var(--aic-font-text); font-weight: 600; font-size: 25px; color: var(--aic-ink); margin: 0;
  text-align: right; flex: none; max-width: 320px; }
.aic-chain .ch-card[data-focus="1"] .ch-role { color: var(--aic-accent); }

.aic-chain .ch-region { display: flex; flex-direction: column; }
.aic-chain .ch-panel-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 28px;
  display: flex; align-items: center; justify-content: space-between; }
.aic-chain .ch-panel-t span:last-child { color: var(--aic-faint); }
.aic-chain .ch-rrow { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 6px 16px; }
.aic-chain .ch-rrow + .ch-rrow { margin-top: 22px; }
.aic-chain .ch-rrow .lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 25px; color: var(--aic-ink-dim); }
.aic-chain .ch-rrow[data-focus="1"] .lbl { color: var(--aic-ink); font-weight: 700; }
.aic-chain .ch-rrow .val { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }
.aic-chain .ch-rrow .track { grid-column: 1 / -1; height: 14px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-chain .ch-rrow .fill { height: 100%; border-radius: 999px; transition: width .5s cubic-bezier(.3,.7,.4,1); }

.aic-chain .ch-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 70px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-chain .ch-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-chain .ch-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-chain .ch-deco { width: 300px; height: 32px; }
`;

const DECO = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function ChainPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-chain', CSS);
  const vars = themeVars(p.accentColor);

  const n = Math.max(1, Math.min(3, p.cardCount));
  const layers = copy.layers.slice(0, n);
  const focus = Math.max(0, Math.min(n - 1, p.focusIndex));
  const regionMax = Math.max(...copy.regions.map((r) => r.pct));
  const cols = p.showSecondary ? '1.32fr 0.68fr' : '1fr';

  return (
    <div className="aic-chain" style={vars}>
      {p.showDecorations && <div className="ch-glow" />}

      <div className="ch-head">
        <div>
          <p className="ch-eyebrow">{copy.eyebrow}</p>
          <h2 className="ch-title">{copy.title}<em>· {copy.titleTail}</em></h2>
        </div>
        <div className="ch-sub">{copy.sub}</div>
      </div>

      <p className="ch-lead">{copy.lead}</p>

      <div className="ch-body" style={{ gridTemplateColumns: cols }}>
        <div className="ch-layers">
          {layers.map((l, i) => (
            <div className="ch-card" key={l.tag} data-focus={p.focusEnabled && i === focus ? '1' : '0'}>
              <div className="ch-badge">{l.tag}</div>
              <div className="ch-card-body">
                <p className="ch-card-zh">{l.zh}<em>{l.en}</em></p>
                <div className="ch-chips">
                  {l.chips.map((c) => <span className="ch-chip" key={c}>{c}</span>)}
                </div>
              </div>
              <p className="ch-role">{l.role}</p>
            </div>
          ))}
        </div>

        {p.showSecondary && (
          <div className="ch-region">
            <p className="ch-panel-t"><span>{copy.regionTitle}</span><span>SHARE</span></p>
            {copy.regions.map((r, i) => {
              const isF = i === 0;
              return (
                <div className="ch-rrow" key={r.label} data-focus={isF ? '1' : '0'}>
                  <div className="lbl">{r.label}</div>
                  <div className="val">{r.pct}%</div>
                  <div className="track">
                    <div className="fill" style={{ width: (r.pct / regionMax) * 100 + '%',
                      background: isF ? 'var(--aic-accent)' : 'var(--aic-ink)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="ch-foot">
        <div className="ch-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ch-deco"><HeatStrip data={DECO} gap={4} /></div>}
      </div>
    </div>
  );
}
