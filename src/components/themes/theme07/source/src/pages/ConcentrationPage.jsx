/**
 * ConcentrationPage — P28 资本集中度 (Capital Concentration · Big Number)
 *
 * A big-number finale for the capital-side section: one oversized percentage
 * (Top-10 share) anchors the canvas, supported by a stacked share bar that
 * breaks funding down by investor rank-tier, a few metrics and the brand lens.
 * The figure is the hero; the share bar makes the concentration legible.
 *
 * Self-contained & prop-driven. Scoped under `.aic-con`.
 * Shared deps: ./theme.js (tokens), ./viz.jsx (BigNumber, LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { BigNumber, LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Capital Concentration',
  title: '资本集中度',
  sub: '头部集中',
  numLead: '42',
  numTail: '%',
  numCaption: '全年大额融资中，由 Top 10 机构主导轮次贡献的比例',
  note: '集中不是终点，而是下一轮分化的起点。',
  closing: '当资本向头部聚拢，中长尾的窗口正在收窄。',
  barTitle: '融资额份额 · 按机构排名分层',
  // leading rank-tiers (remainder is recomputed so the bar always sums to 100)
  tiers: [
    { label: 'Top 3 机构', v: 22 },
    { label: '第 4–6 名', v: 11 },
    { label: '第 7–10 名', v: 9 },
  ],
  remainderLabel: '其他机构',
  // supporting metrics (order fixed; count is prop-driven)
  aux: [
    { label: '活跃机构', value: '48', unit: '家' },
    { label: 'Top10 覆盖轮次', value: '37', unit: '笔' },
    { label: '平均领投规模', value: '14', unit: '亿美元' },
  ],
};

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  copy: COPY,
  numberSlant: true,     // brand italic-slant on the hero digits
  tierCount: 3,          // leading rank-tiers shown in the share bar (2–3)
  showRemainder: true,   // append the "其他机构" remainder segment
  showShareBar: true,    // the stacked concentration share bar
  auxCount: 3,           // supporting metric chips (0–3)
  showNote: true,        // supporting note line
  showLens: true,        // brand lens-cluster motif
  showDecorations: true, // glow + heat strip
  accentColor: THEME.accent,
};

export const controls = [
  { key: 'numberSlant', label: '数字倾斜', type: 'toggle', default: true,
    description: '主数字是否应用品牌斜切（italic-slant）效果。' },
  { key: 'tierCount', label: '卡片数量', type: 'slider', default: 3, min: 2, max: 3, step: 1,
    description: '份额条中显式展示的头部分层数量（2–3）；剩余自动并入「其他」。' },
  { key: 'showRemainder', label: '其他分段', type: 'toggle', default: true,
    description: '是否在份额条末尾补上「其他机构」剩余分段。' },
  { key: 'showShareBar', label: '份额图表', type: 'toggle', default: true,
    description: '堆叠份额条（按机构排名分层）的显隐。' },
  { key: 'auxCount', label: '辅助数量', type: 'slider', default: 3, min: 0, max: 3, step: 1,
    description: '辅助指标数量（0–3）；为 0 时只保留主数字。' },
  { key: 'showNote', label: '辅助注释', type: 'toggle', default: true,
    description: '底部补充注释的显隐。' },
  { key: 'showLens', label: '品牌图形', type: 'toggle', default: true,
    description: '品牌透镜图形（焦点圆盘）的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于主数字下划线、份额条与品牌图形。' },
];

const CSS = `
.aic-con { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-con, .aic-con * { box-sizing: border-box; }
.aic-con .cn-glow { position: absolute; left: 30%; top: 24%; width: 56%; height: 60%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 24%, transparent), transparent 72%); }
.aic-con .cn-lens { position: absolute; right: -70px; top: 150px; width: 560px; height: 560px; opacity: .9; pointer-events: none; }

.aic-con .cn-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-con .cn-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-con .cn-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 60px; line-height: .96; margin: 0; }
.aic-con .cn-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* hero number (left) + aux (right) */
.aic-con .cn-hero { position: absolute; left: var(--pad); top: 312px; width: 980px; }
.aic-con .cn-kicker { display: flex; align-items: center; gap: 16px; margin: 0 0 4px; }
.aic-con .cn-kicker b { width: 64px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-con .cn-kicker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px; letter-spacing: .16em;
  text-transform: uppercase; color: var(--aic-muted); }
.aic-con .cn-bignum { line-height: .8; }
.aic-con .cn-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim);
  margin: 24px 0 0; max-width: 880px; line-height: 1.4; }

.aic-con .cn-aux { position: absolute; right: var(--pad); top: 320px; width: 420px;
  display: flex; flex-direction: column; gap: 26px; }
.aic-con .cn-aux-item { display: flex; flex-direction: column; gap: 6px; padding-left: 22px;
  border-left: 3px solid var(--aic-hair-strong); }
.aic-con .cn-aux-lbl { font-family: var(--aic-font-text); font-weight: 600; font-size: 20px; color: var(--aic-muted); }
.aic-con .cn-aux-val { font-family: var(--aic-font-display); font-weight: 700; font-size: 46px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; line-height: 1; }
.aic-con .cn-aux-val u { text-decoration: none; font-size: 18px; font-weight: 600; color: var(--aic-muted); margin-left: 6px; }

/* concentration share bar */
.aic-con .cn-share { position: absolute; left: var(--pad); right: var(--pad); top: 690px; }
.aic-con .cn-share-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .14em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 16px; }
.aic-con .cn-bar { display: flex; width: 100%; height: 64px; border-radius: 14px; overflow: hidden; gap: 4px; }
.aic-con .cn-seg { position: relative; display: flex; align-items: center; justify-content: center;
  font-family: var(--aic-font-display); font-weight: 700; font-size: 26px; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; transition: flex-basis .55s cubic-bezier(.3,.7,.4,1); min-width: 0; }
.aic-con .cn-seg.rest { background: var(--aic-hair); color: var(--aic-ink-dim); }
.aic-con .cn-legend { display: flex; flex-wrap: wrap; gap: 14px 36px; margin-top: 18px; }
.aic-con .cn-leg { display: flex; align-items: center; gap: 10px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 21px; color: var(--aic-ink-dim); }
.aic-con .cn-leg i { width: 16px; height: 16px; border-radius: 5px; flex: none; }
.aic-con .cn-leg b { font-family: var(--aic-font-display); font-weight: 700; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; }

.aic-con .cn-note { position: absolute; left: var(--pad); right: var(--pad); bottom: 150px;
  font-family: var(--aic-font-text); font-weight: 500; font-size: 26px; color: var(--aic-muted);
  display: flex; align-items: center; gap: 14px; }
.aic-con .cn-note::before { content: ''; width: 26px; height: 2px; background: var(--aic-hair-strong); flex: none; }

.aic-con .cn-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-con .cn-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); }
.aic-con .cn-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-con .cn-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','warn','accent','pos','accent',
  'pos','warn','accent','pos','pos','accent','warn','pos','accent','pos','pos','warn','accent','pos',
  'pos','accent','warn','pos','accent','pos','warn','pos','accent','pos'].map((tone) => ({ tone }));

const LENS_DISCS = [
  { x: 40, y: 36, d: 56 },
  { x: 66, y: 30, d: 38 },
  { x: 56, y: 64, d: 48 },
  { x: 80, y: 58, d: 28 },
];

// share-bar segment fills — leading tiers in accent shades, remainder is grey
const SEG_FILL = [
  'var(--aic-accent)',
  'color-mix(in srgb, var(--aic-accent) 64%, white)',
  'color-mix(in srgb, var(--aic-accent) 38%, white)',
];

export default function ConcentrationPage(props) {
  const p = { ...defaultProps, ...props };
  const copy = p.copy || COPY;
  ensureFonts();
  injectScopedStyle('aic-con', CSS);
  const vars = themeVars(p.accentColor);

  const auxN = Math.max(0, Math.min(copy.aux.length, p.auxCount));
  const aux = copy.aux.slice(0, auxN);

  const tierN = Math.max(2, Math.min(copy.tiers.length, p.tierCount));
  const tiers = copy.tiers.slice(0, tierN);
  const shown = tiers.reduce((s, t) => s + t.v, 0);
  const remainder = Math.max(0, 100 - shown);

  return (
    <div className="aic-con" style={vars}>
      {p.showDecorations && <div className="cn-glow" />}
      {p.showLens && <div className="cn-lens"><LensCluster discs={LENS_DISCS} /></div>}

      <div className="cn-head">
        <div>
          <p className="cn-eyebrow">{copy.eyebrow}</p>
          <h2 className="cn-title">{copy.title}</h2>
        </div>
        <div className="cn-sub">{copy.sub}</div>
      </div>

      <div className="cn-hero">
        <div className="cn-kicker"><b /><span>{copy.sub}</span></div>
        <div className="cn-bignum">
          <BigNumber lead={copy.numLead} tail={copy.numTail} slant={p.numberSlant} size={320} />
        </div>
        <p className="cn-caption">{copy.numCaption}</p>
      </div>

      {auxN > 0 && (
        <div className="cn-aux">
          {aux.map((a) => (
            <div className="cn-aux-item" key={a.label}>
              <div className="cn-aux-lbl">{a.label}</div>
              <div className="cn-aux-val">{a.value}<u>{a.unit}</u></div>
            </div>
          ))}
        </div>
      )}

      {p.showShareBar && (
        <div className="cn-share">
          <p className="cn-share-t">{copy.barTitle}</p>
          <div className="cn-bar">
            {tiers.map((t, i) => (
              <div className="cn-seg" key={t.label}
                style={{ flex: `${t.v} 1 0`, background: SEG_FILL[i % SEG_FILL.length] }}>
                {t.v}%
              </div>
            ))}
            {p.showRemainder && remainder > 0 && (
              <div className="cn-seg rest" style={{ flex: `${remainder} 1 0` }}>{remainder}%</div>
            )}
          </div>
          <div className="cn-legend">
            {tiers.map((t, i) => (
              <div className="cn-leg" key={t.label}>
                <i style={{ background: SEG_FILL[i % SEG_FILL.length] }} />
                {t.label} <b>{t.v}%</b>
              </div>
            ))}
            {p.showRemainder && remainder > 0 && (
              <div className="cn-leg">
                <i style={{ background: 'var(--aic-hair)' }} />
                {copy.remainderLabel} <b>{remainder}%</b>
              </div>
            )}
          </div>
        </div>
      )}

      {p.showNote && <div className="cn-note">{copy.note}</div>}

      <div className="cn-foot">
        <div className="cn-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="cn-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
