/**
 * OutlookPage — P13 投资建议与阶段性策略 (Investment Outlook · Compare + Timeline)
 *
 * Timeline-led slide: two compare columns (conviction vs. caution) over a
 * horizontal phase timeline. Column count, items per column, the focus column,
 * the timeline and its node count are all prop-driven.
 *
 * Self-contained & prop-driven. All styling is scoped under `.aic-out`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (HeatStrip).
 * No Tweaks / preview-runtime dependency — text is authored COPY; only the
 * exported `defaultProps` / `controls` drive structural + style variation.
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Investment Outlook',
  title: '投资建议与阶段性策略',
  sub: '看好方向与谨慎方向',
  lead: '后续观察应围绕收入兑现、基础设施确定性和垂直应用 PMF 展开。',
  closing: '看融资只是起点，看兑现才是判断。',
  timelineLabel: '阶段性观察 · 2025 — 2027',
  // compare columns
  columns: [
    {
      kind: '看好方向', en: 'Conviction', tone: 'accent',
      items: [
        { name: '垂直应用', note: '嵌入刚性工作流，验证 PMF' },
        { name: '基础设施', note: 'GPU 云与数据平台，刚性预算' },
        { name: '具身智能', note: '软件能力延伸到物理场景' },
      ],
    },
    {
      kind: '谨慎方向', en: 'Caution', tone: 'neg',
      items: [
        { name: '高估值纯模型', note: '叙事透支远期增长预期' },
        { name: 'AI 包装项目', note: '缺乏壁垒，易被快速替代' },
        { name: '低壁垒消费应用', note: '留存与付费意愿不足' },
      ],
    },
  ],
  // phase timeline nodes
  nodes: [
    { year: '2025', title: '收入兑现', note: '看试点能否转为稳定订阅' },
    { year: '2026', title: 'IPO 窗口', note: '头部上市重定价估值锚' },
    { year: '2027', title: '商业闭环', note: '能形成闭环的方向胜出' },
  ],
};

const TONE = { accent: 'var(--aic-accent)', neg: 'var(--aic-neg)', warn: 'var(--aic-warn)', ink: 'var(--aic-ink)' };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  columnCount: 2,        // compare columns shown (1–2)
  itemCount: 3,          // items per column (1–3)
  focusEnabled: true,    // highlight one compare column
  focusIndex: 0,         // which column is the focus (0-based)
  showTimeline: true,    // bottom phase timeline
  nodeCount: 3,          // timeline node count (2–3)
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Investment Outlook' },
  { key: 'title', label: '标题', type: 'text', default: '投资建议与阶段性策略' },
  { key: 'sub', label: '次标题', type: 'text', default: '看好方向与谨慎方向' },
  { key: 'lead', label: '导言', type: 'text', default: '后续观察应围绕收入兑现、基础设施确定性和垂直应用 PMF 展开。' },
  { key: 'closing', label: '结语', type: 'text', default: '看融资只是起点，看兑现才是判断。' },
  { key: 'timelineLabel', label: 'timelineLabel', type: 'text', default: '阶段性观察 · 2025 — 2027' },
  { key: 'kind', label: 'kind', type: 'text', default: '看好方向\', en: \'Conviction\', tone: \'accent' },
  { key: 'kind', label: 'kind', type: 'text', default: '谨慎方向\', en: \'Caution\', tone: \'neg' },
  { key: 'columnCount', label: '对比栏数量', type: 'slider', default: 2, min: 1, max: 2, step: 1,
    description: '并排对比栏数量（1–2）；为 1 时单栏占据整行。' },
  { key: 'itemCount', label: '条目数量', type: 'slider', default: 3, min: 1, max: 3, step: 1,
    description: '每个对比栏内的方向条目数量（1–3）。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮某一个对比栏作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 0,
    options: [{ value: 0, label: '第 1 栏' }, { value: 1, label: '第 2 栏' }],
    description: '选择被高亮的对比栏。', showWhen: (p) => p.focusEnabled },
  { key: 'showTimeline', label: '阶段时间轴', type: 'toggle', default: true,
    description: '底部阶段性时间轴的显隐。' },
  { key: 'nodeCount', label: '节点数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '时间轴上的阶段节点数量（2–3）。', showWhen: (p) => p.showTimeline },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色。' },
];

const CSS = `
.aic-out { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-out, .aic-out * { box-sizing: border-box; }
.aic-out .ou-glow { position: absolute; right: -4%; top: -8%; width: 52%; height: 56%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-out .ou-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-out .ou-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-out .ou-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 74px; line-height: .96; margin: 0; white-space: nowrap; }
.aic-out .ou-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; }

.aic-out .ou-lead { position: absolute; left: var(--pad); top: 252px; width: 1320px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 32px; line-height: 1.5; color: var(--aic-ink-dim); margin: 0; }

.aic-out .ou-cols { position: absolute; left: var(--pad); right: var(--pad); top: 356px;
  display: grid; gap: 30px; }
.aic-out .ou-col { position: relative; border-radius: 26px; padding: 28px 38px 20px;
  background: var(--aic-card); border: 1.5px solid var(--aic-hair); display: flex; flex-direction: column;
  transition: border-color .3s, box-shadow .3s, transform .3s; }
.aic-out .ou-col[data-focus="1"] { transform: translateY(-6px);
  box-shadow: 0 26px 64px -30px color-mix(in srgb, var(--col-tone) 60%, transparent); border-color: var(--col-tone); }
.aic-out .ou-col-hd { display: flex; align-items: baseline; gap: 18px; padding-bottom: 18px;
  border-bottom: 1.5px solid var(--aic-hair); margin-bottom: 4px; }
.aic-out .ou-col-dot { width: 16px; height: 16px; border-radius: 50%; background: var(--col-tone); flex: none; align-self: center; }
.aic-out .ou-col-kind { font-family: var(--aic-font-text); font-weight: 900; font-size: 40px; line-height: 1; color: var(--aic-ink); }
.aic-out .ou-col-en { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px; letter-spacing: .2em;
  text-transform: uppercase; color: var(--aic-muted); margin-left: auto; }
.aic-out .ou-item { display: flex; align-items: baseline; gap: 20px; padding: 15px 0;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-out .ou-item:last-child { border-bottom: 0; }
.aic-out .ou-item-idx { font-family: var(--aic-font-display); font-weight: 700; font-size: 22px; color: var(--col-tone);
  width: 40px; flex: none; font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; }
.aic-out .ou-item-main { display: flex; flex-direction: column; gap: 4px; }
.aic-out .ou-item-name { font-family: var(--aic-font-text); font-weight: 700; font-size: 30px; color: var(--aic-ink); line-height: 1.1; }
.aic-out .ou-item-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 21px; color: var(--aic-muted); line-height: 1.35; }

.aic-out .ou-tl { position: absolute; left: var(--pad); right: var(--pad); bottom: 128px; }
.aic-out .ou-tl-cap { font-family: var(--aic-font-display); font-weight: 600; font-size: 20px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 26px; }
.aic-out .ou-tl-track { position: relative; height: 2px; background: var(--aic-hair-strong); }
.aic-out .ou-tl-track::after { content: ''; position: absolute; right: -2px; top: -5px; border: 6px solid transparent;
  border-left-color: var(--aic-ink); }
.aic-out .ou-tl-nodes { display: grid; }
.aic-out .ou-tl-node { position: relative; padding-top: 30px; }
.aic-out .ou-tl-node::before { content: ''; position: absolute; top: -7px; left: 0; width: 16px; height: 16px;
  border-radius: 50%; background: var(--aic-paper); border: 4px solid var(--aic-accent); }
.aic-out .ou-tl-year { font-family: var(--aic-font-display); font-weight: 700; font-size: 30px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transform: skewX(-9deg); transform-origin: left bottom; display: inline-block; }
.aic-out .ou-tl-ttl { font-family: var(--aic-font-text); font-weight: 700; font-size: 24px; color: var(--aic-ink); margin: 8px 0 4px; }
.aic-out .ou-tl-note { font-family: var(--aic-font-text); font-weight: 500; font-size: 19px; color: var(--aic-muted); line-height: 1.35; max-width: 360px; }

.aic-out .ou-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-out .ou-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-out .ou-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-out .ou-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','neg','pos','accent','pos','warn','accent','pos','pos',
  'neg','warn','accent','pos','pos','warn','accent','pos','neg','pos','accent','pos','warn','pos',
  'accent','pos','pos','neg','warn','accent','pos','pos','warn','accent'].map((tone) => ({ tone }));

export default function OutlookPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { ...COPY, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) };
  ensureFonts();
  injectScopedStyle('aic-out', CSS);
  const vars = themeVars(p.accentColor);

  const nCols = Math.max(1, Math.min(2, p.columnCount));
  const cols = copy.columns.slice(0, nCols);
  const focus = Math.max(0, Math.min(nCols - 1, p.focusIndex));
  const itemsN = Math.max(1, Math.min(3, p.itemCount));
  const nNodes = Math.max(2, Math.min(copy.nodes.length, p.nodeCount));
  const nodes = copy.nodes.slice(0, nNodes);

  return (
    <div className="aic-out" style={vars}>
      {p.showDecorations && <div className="ou-glow" />}

      <div className="ou-head">
        <div>
          <p className="ou-eyebrow">{copy.eyebrow}</p>
          <h2 className="ou-title">{copy.title}</h2>
        </div>
        <div className="ou-sub">{copy.sub}</div>
      </div>

      <p className="ou-lead">{copy.lead}</p>

      <div className="ou-cols" style={{ gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        bottom: p.showTimeline ? 326 : 150 }}>
        {cols.map((c, i) => {
          const isF = p.focusEnabled && i === focus;
          return (
            <div className="ou-col" key={c.en} data-focus={isF ? '1' : '0'}
              style={{ '--col-tone': TONE[c.tone], background: isF
                ? `color-mix(in srgb, ${TONE[c.tone]} 7%, var(--aic-card))` : 'var(--aic-card)' }}>
              <div className="ou-col-hd">
                <span className="ou-col-dot" />
                <span className="ou-col-kind">{c.kind}</span>
                <span className="ou-col-en">{c.en}</span>
              </div>
              {c.items.slice(0, itemsN).map((it, j) => (
                <div className="ou-item" key={it.name}>
                  <span className="ou-item-idx">{String(j + 1).padStart(2, '0')}</span>
                  <div className="ou-item-main">
                    <span className="ou-item-name">{it.name}</span>
                    <span className="ou-item-note">{it.note}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {p.showTimeline && (
        <div className="ou-tl">
          <p className="ou-tl-cap">{copy.timelineLabel}</p>
          <div className="ou-tl-track" />
          <div className="ou-tl-nodes" style={{ gridTemplateColumns: `repeat(${nNodes}, 1fr)` }}>
            {nodes.map((nd) => (
              <div className="ou-tl-node" key={nd.year}>
                <span className="ou-tl-year">{nd.year}</span>
                <div className="ou-tl-ttl">{nd.title}</div>
                <div className="ou-tl-note">{nd.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ou-foot">
        <div className="ou-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="ou-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
