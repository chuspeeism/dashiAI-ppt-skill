/**
 * OpenSourcePage — P47 社区影响力变现 (Open-Source Models · Image-led · Segment Card)
 *
 * Image-led slide with a dominant hero on the LEFT and, on the right, a
 * "conversion bridge": a community-influence anchor flows through a tapering
 * ribbon into an enterprise-revenue anchor, narrating how downloads convert to
 * paid enterprise value. Image count / ratio, the enterprise-share chart type,
 * the focus side and value labels are all prop-driven.
 *
 * ── Image slots (migration note) ───────────────────────────────────────────
 * Host-agnostic. The fillable slot is supplied by the host via the
 * `renderSlot(i, { ratio, ratioAR }) => ReactNode` prop. When omitted a striped
 * placeholder renders, so the page works (and exports) standalone. Image count
 * is prop-driven (0–2); at 0 the hero falls back to the brand lens graphic.
 *
 * Scoped under `.aic-os`. Shared deps: ./theme.js, ./viz.jsx (LensCluster, HeatStrip).
 */
import React from 'react';
import { THEME, themeVars, ensureFonts, injectScopedStyle } from '../theme.js';
import { LensCluster, HeatStrip } from '../viz.jsx';

// ── fixed editorial content (text is authored, not tweakable) ──
const COPY = {
  eyebrow: 'Open-Source Models',
  segment: '开源模型公司',
  title: '社区影响力变现',
  titleTail: '开源模型公司',
  lead: '开源模型公司通过社区影响力、托管服务和企业支持变现；开源能快速获得开发者，但商业化仍需要企业级能力。',
  statLine: '融资额 28 亿美元 · 7 笔事件',
  closing: '开源是入口，不是完整商业模式。',
  badge: '开源模型',
  bridgeTitle: '影响力到收入 · 转化路径',
  // two-node conversion bridge (authored)
  source: { kicker: '社区影响力', value: '2.8', unit: '亿次', caption: '累计模型下载量', tag: '开发者入口' },
  target: { kicker: '企业服务', pct: 37, display: '37', unit: '%', caption: '企业服务收入占比', tag: '商业化兑现' },
  ribbonLabel: '影响力 → 收入',
};

// aspect presets → numeric width/height ratio. 'auto' → null (slot self-sizes).
const RATIO_AR = { portrait: 3 / 4, landscape: 4 / 3, square: 1, auto: null };

// ── exported, migration-stable parameter contract ──
export const defaultProps = {
  ...COPY,
  imageCount: 1,           // hero image slots (0–2)
  imageRatio: 'landscape', // 'portrait' | 'landscape' | 'square' | 'auto'
  chartType: 'ring',       // enterprise-share chart: 'ring' | 'bar'
  focusEnabled: true,      // emphasize one conversion node
  focusIndex: 1,           // 0 = community source, 1 = enterprise target
  showBridge: true,        // tapering ribbon connector
  showValues: true,        // value labels on the nodes
  showDecorations: true,   // glow + heat strip + image badge
  accentColor: THEME.accent,
  renderSlot: null,        // host hook: (i, { ratio, ratioAR }) => ReactNode
};

export const controls = [
  { key: 'eyebrow', label: '眉标', type: 'text', default: 'Open-Source Models' },
  { key: 'segment', label: 'segment', type: 'text', default: '开源模型公司' },
  { key: 'title', label: '标题', type: 'text', default: '社区影响力变现' },
  { key: 'titleTail', label: '副标题', type: 'text', default: '开源模型公司' },
  { key: 'lead', label: '导言', type: 'text', default: '开源模型公司通过社区影响力、托管服务和企业支持变现；开源能快速获得开发者，但商业化仍需要企业级能力。' },
  { key: 'statLine', label: 'statLine', type: 'text', default: '融资额 28 亿美元 · 7 笔事件' },
  { key: 'closing', label: '结语', type: 'text', default: '开源是入口，不是完整商业模式。' },
  { key: 'badge', label: 'badge', type: 'text', default: '开源模型' },
  { key: 'bridgeTitle', label: 'bridgeTitle', type: 'text', default: '影响力到收入 · 转化路径' },
  { key: 'ribbonLabel', label: 'ribbonLabel', type: 'text', default: '影响力 → 收入' },
  { key: 'imageCount', label: '图片数量', type: 'slider', default: 1, min: 0, max: 2, step: 1,
    description: '主视觉区图片槽数量（0–2）；为 0 时以品牌图形填充，构图保持完整。' },
  { key: 'imageRatio', label: '图片比例', type: 'radio', default: 'landscape',
    options: [
      { value: 'landscape', label: '横图' },
      { value: 'portrait', label: '竖图' },
      { value: 'square', label: '方形' },
      { value: 'auto', label: '自适应' },
    ],
    description: '图片槽比例；自适应会跟随用户上传图片的原始比例并自动居中排布。' },
  { key: 'chartType', label: '图表类型', type: 'radio', default: 'ring',
    options: [{ value: 'ring', label: '环形' }, { value: 'bar', label: '占比条' }],
    description: '企业服务收入占比的呈现方式：环形图 / 占比条。' },
  { key: 'focusEnabled', label: '重点信息', type: 'toggle', default: true,
    description: '是否高亮转化路径的某一端作为视觉重点。' },
  { key: 'focusIndex', label: '重点元素', type: 'select', default: 1,
    options: [{ value: 0, label: '社区影响力' }, { value: 1, label: '企业服务' }],
    description: '选择被高亮的转化节点。', showWhen: (p) => p.focusEnabled },
  { key: 'showBridge', label: '转化连接', type: 'toggle', default: true,
    description: '两节点之间的渐缩转化连接带的显隐。' },
  { key: 'showValues', label: '数值标签', type: 'toggle', default: true,
    description: '转化节点内数值标签的显隐。' },
  { key: 'showDecorations', label: '装饰文案', type: 'toggle', default: true,
    description: '背景光晕、图片角标与条码等装饰的显隐。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: THEME.accent,
    options: [THEME.accent, '#23C76A', '#2F7BFF', '#F2A93B', '#0E110B'],
    description: '品牌强调色，作用于赛道标记、高亮节点与转化连接带。' },
];

const CSS = `
.aic-os { position: relative; width: 100%; height: 100%; overflow: hidden;
  background: var(--aic-paper); color: var(--aic-ink); font-family: var(--aic-font-text); --pad: 96px; }
.aic-os, .aic-os * { box-sizing: border-box; }
.aic-os .os-glow { position: absolute; left: -6%; top: -10%; width: 50%; height: 58%; pointer-events: none;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--aic-accent) 22%, transparent), transparent 70%); }

.aic-os .os-head { position: absolute; top: 84px; left: var(--pad); right: var(--pad);
  display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 28px;
  border-bottom: 1.5px solid var(--aic-hair); }
.aic-os .os-eyebrow { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .24em; text-transform: uppercase; color: var(--aic-muted); margin: 0 0 24px; }
.aic-os .os-title { font-family: var(--aic-font-text); font-weight: 900; font-size: 80px; line-height: .96; margin: 0; }
.aic-os .os-sub { font-family: var(--aic-font-display); font-weight: 600; font-size: 30px; color: var(--aic-ink-dim); padding-bottom: 8px; white-space: nowrap; }

/* left: dominant hero */
.aic-os .os-hero { position: absolute; left: var(--pad); top: 304px; bottom: 150px; width: 744px;
  display: flex; gap: 16px; }
.aic-os .os-cell { position: relative; overflow: hidden; border-radius: 26px; flex: 1 1 0;
  background: var(--aic-accent-soft); border: 1.5px solid var(--aic-hair); display: grid;
  align-items: center; justify-items: center; }
.aic-os .os-frame { position: relative; width: 100%; height: 100%; overflow: hidden; }
.aic-os .os-cell.fixed .os-frame { height: 100%; }
.aic-os .os-cell.fixed .os-frame.cap { aspect-ratio: var(--ar); height: auto; max-height: 100%; width: 100%; }
.aic-os .os-frame > * { position: absolute; inset: 0; width: 100%; height: 100%; }
.aic-os .os-cell.auto .os-frame { height: auto; }
.aic-os .os-cell.auto .os-frame > * { position: static; width: 100%; height: auto; display: block; }
.aic-os .os-badge { position: absolute; top: 18px; left: 18px; z-index: 4; font-family: var(--aic-font-display);
  font-weight: 600; font-size: 16px; letter-spacing: .12em; text-transform: uppercase; color: var(--aic-ink);
  background: var(--aic-accent); padding: 6px 13px; border-radius: 999px; white-space: nowrap; }
.aic-os .os-ph { position: absolute; inset: 0; display: grid; place-items: center; }
.aic-os .os-ph-cap { position: absolute; left: 0; right: 0; bottom: 22px; text-align: center;
  font-family: var(--aic-font-display); font-weight: 500; font-size: 17px; letter-spacing: .06em; color: var(--aic-ink-dim); }
.aic-os .os-deco-fill { position: absolute; inset: 0; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--aic-accent-bright) 70%, white), var(--aic-accent) 92%); }

/* right: editorial + conversion bridge */
.aic-os .os-right { position: absolute; left: 888px; right: var(--pad); top: 304px; bottom: 150px;
  display: flex; flex-direction: column; }
.aic-os .os-marker { display: flex; align-items: center; gap: 16px; }
.aic-os .os-marker b { width: 58px; height: 5px; border-radius: 3px; background: var(--aic-accent); }
.aic-os .os-marker span { font-family: var(--aic-font-display); font-weight: 600; font-size: 22px;
  letter-spacing: .16em; text-transform: uppercase; color: var(--aic-muted); white-space: nowrap; }
.aic-os .os-lead { font-family: var(--aic-font-text); font-weight: 500; font-size: 28px; line-height: 1.5;
  color: var(--aic-ink); margin: 20px 0 10px; text-wrap: pretty; }
.aic-os .os-statline { font-family: var(--aic-font-display); font-weight: 600; font-size: 21px; letter-spacing: .03em;
  color: var(--aic-muted); }

.aic-os .os-bridge-wrap { margin-top: auto; }
.aic-os .os-bridge-t { font-family: var(--aic-font-display); font-weight: 600; font-size: 18px; letter-spacing: .12em;
  text-transform: uppercase; color: var(--aic-muted); margin: 0 0 22px; }
.aic-os .os-bridge { display: grid; grid-template-columns: 1fr 116px 1fr; align-items: stretch; }
.aic-os .os-node { border-radius: 24px; padding: 30px 32px; background: var(--aic-card);
  border: 1.5px solid var(--aic-hair-strong); display: flex; flex-direction: column; justify-content: space-between;
  transition: background .35s, border-color .35s, box-shadow .35s; min-height: 248px; }
.aic-os .os-node[data-focus="1"] { box-shadow: 0 24px 50px -26px color-mix(in srgb, var(--aic-accent) 70%, transparent);
  border-color: color-mix(in srgb, var(--aic-accent) 50%, white); }
.aic-os .os-node.target[data-focus="1"] { background: linear-gradient(160deg, color-mix(in srgb, var(--aic-accent) 14%, white), var(--aic-card)); }
.aic-os .os-kicker { display: flex; align-items: center; gap: 10px; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 21px; color: var(--aic-ink); }
.aic-os .os-kicker i { width: 11px; height: 11px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-os .os-node.source .os-kicker i { background: var(--aic-ink); }
.aic-os .os-bignum { font-family: var(--aic-font-display); font-weight: 700; font-size: 86px; line-height: .9;
  color: var(--aic-ink); font-variant-numeric: tabular-nums; display: flex; align-items: baseline; }
.aic-os .os-bignum u { text-decoration: none; font-size: 28px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 6px; }
.aic-os .os-caption { font-family: var(--aic-font-text); font-weight: 600; font-size: 21px; color: var(--aic-ink); }
.aic-os .os-tag { font-family: var(--aic-font-display); font-weight: 600; font-size: 15px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--aic-muted); }
/* ring inside target node */
.aic-os .os-ring { position: relative; width: 150px; height: 150px; }
.aic-os .os-ring svg { transform: rotate(-90deg); }
.aic-os .os-ring-v { position: absolute; inset: 0; display: grid; place-items: center; font-family: var(--aic-font-display);
  font-weight: 700; font-size: 46px; color: var(--aic-ink); font-variant-numeric: tabular-nums; }
.aic-os .os-ring-v u { text-decoration: none; font-size: 20px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 1px; }
.aic-os .os-target-body { display: flex; align-items: center; gap: 22px; }
/* bar variant */
.aic-os .os-barbox { display: flex; flex-direction: column; gap: 12px; }
.aic-os .os-bar-track { height: 22px; border-radius: 999px; background: var(--aic-hair); overflow: hidden; }
.aic-os .os-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--aic-accent-bright), var(--aic-accent) 85%);
  transition: width .6s cubic-bezier(.3,.7,.4,1); }
.aic-os .os-bar-v { font-family: var(--aic-font-display); font-weight: 700; font-size: 70px; line-height: .9; color: var(--aic-ink);
  font-variant-numeric: tabular-nums; display: flex; align-items: baseline; }
.aic-os .os-bar-v u { text-decoration: none; font-size: 26px; font-weight: 600; color: var(--aic-ink-dim); margin-left: 4px; }
/* tapering ribbon connector */
.aic-os .os-ribbon { position: relative; display: grid; place-items: center; }
.aic-os .os-ribbon svg { width: 100%; height: 130px; display: block; }
.aic-os .os-ribbon-lbl { position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  font-family: var(--aic-font-display); font-weight: 600; font-size: 14px; letter-spacing: .08em;
  white-space: nowrap; color: var(--aic-muted); }

.aic-os .os-foot { position: absolute; left: var(--pad); right: var(--pad); bottom: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 48px; }
.aic-os .os-closing { display: flex; align-items: center; gap: 16px; font-family: var(--aic-font-text);
  font-weight: 600; font-size: 27px; color: var(--aic-ink); white-space: nowrap; }
.aic-os .os-closing b { width: 12px; height: 12px; border-radius: 50%; background: var(--aic-accent); flex: none; }
.aic-os .os-deco { width: 300px; height: 30px; }
`;

const HEAT = ['pos','accent','pos','warn','pos','accent','pos','pos','accent','warn','pos','accent',
  'pos','pos','accent','warn','pos','accent','pos','pos','accent','warn','pos','accent','pos','pos',
  'accent','warn','pos','accent','pos','pos','warn','accent','pos','accent'].map((tone) => ({ tone }));

function TargetRing({ pct, focus, showValue, display, unit }) {
  const r = 64, c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, pct / 100)) * c;
  return (
    <div className="os-ring">
      <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true">
        <circle cx="75" cy="75" r={r} fill="none" stroke="var(--aic-hair)" strokeWidth="14" />
        <circle cx="75" cy="75" r={r} fill="none" strokeWidth="14" strokeLinecap="round"
          stroke={focus ? 'var(--aic-accent)' : 'var(--aic-ink)'}
          strokeDasharray={`${dash} ${c - dash}`} style={{ transition: 'stroke-dasharray .6s cubic-bezier(.3,.7,.4,1)' }} />
      </svg>
      {showValue && <div className="os-ring-v">{display}<u>{unit}</u></div>}
    </div>
  );
}

// striped placeholder — used when no host `renderSlot` is supplied
function Placeholder({ i }) {
  const pid = 'osph-' + i;
  return (
    <div className="os-ph">
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="var(--aic-accent-soft)" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="color-mix(in srgb, var(--aic-accent) 40%, white)" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <span className="os-ph-cap">{`image_slot_${i + 1}`}</span>
    </div>
  );
}

export default function OpenSourcePage(props) {
  const p = { ...defaultProps, ...props };
  const copy = { eyebrow: p.eyebrow !== undefined ? p.eyebrow : COPY.eyebrow, segment: p.segment !== undefined ? p.segment : COPY.segment, title: p.title !== undefined ? p.title : COPY.title, titleTail: p.titleTail !== undefined ? p.titleTail : COPY.titleTail, lead: p.lead !== undefined ? p.lead : COPY.lead, statLine: p.statLine !== undefined ? p.statLine : COPY.statLine, closing: p.closing !== undefined ? p.closing : COPY.closing, badge: p.badge !== undefined ? p.badge : COPY.badge, bridgeTitle: p.bridgeTitle !== undefined ? p.bridgeTitle : COPY.bridgeTitle, ribbonLabel: p.ribbonLabel !== undefined ? p.ribbonLabel : COPY.ribbonLabel };
  ensureFonts();
  injectScopedStyle('aic-os', CSS);
  const vars = themeVars(p.accentColor);

  const focusSrc = p.focusEnabled && p.focusIndex === 0;
  const focusTgt = p.focusEnabled && p.focusIndex === 1;
  const t = copy.target;

  const imgN = Math.max(0, Math.min(2, p.imageCount));
  const ratio = RATIO_AR.hasOwnProperty(p.imageRatio) ? p.imageRatio : 'landscape';
  const ratioAR = RATIO_AR[ratio];
  const isAuto = ratioAR == null;
  const heroAR = isAuto ? (4 / 3) : ratioAR;

  return (
    <div className="aic-os" style={vars}>
      {p.showDecorations && <div className="os-glow" />}

      <div className="os-head">
        <div>
          <p className="os-eyebrow">{copy.eyebrow}</p>
          <h2 className="os-title">{copy.title}</h2>
        </div>
        <div className="os-sub">{copy.titleTail}</div>
      </div>

      <div className="os-hero">
        {imgN === 0 ? (
          <div className="os-cell fixed">
            <div className="os-frame cap" style={{ '--ar': String(heroAR) }}>
              <div className="os-deco-fill"><LensCluster /></div>
            </div>
          </div>
        ) : (
          Array.from({ length: imgN }).map((_, i) => (
            <div className={'os-cell ' + (isAuto ? 'auto' : 'fixed')} key={i}>
              {p.showDecorations && i === 0 && <span className="os-badge">{copy.badge}</span>}
              <div className={'os-frame' + (isAuto ? '' : ' cap')} style={isAuto ? null : { '--ar': String(ratioAR) }}>
                {p.renderSlot ? p.renderSlot(i, { ratio, ratioAR }) : <Placeholder i={i} />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="os-right">
        <div className="os-marker"><b /><span>{copy.segment}</span></div>
        <p className="os-lead">{copy.lead}</p>
        <div className="os-statline">{copy.statLine}</div>

        <div className="os-bridge-wrap">
          <p className="os-bridge-t">{copy.bridgeTitle}</p>
          <div className="os-bridge">
            <div className="os-node source" data-focus={focusSrc ? '1' : '0'}>
              <div className="os-kicker"><i />{copy.source.kicker}</div>
              {p.showValues && <div className="os-bignum">{copy.source.value}<u>{copy.source.unit}</u></div>}
              <div className="os-caption">{copy.source.caption}</div>
              <div className="os-tag">{copy.source.tag}</div>
            </div>

            <div className="os-ribbon">
              {p.showBridge && (
                <svg viewBox="0 0 116 130" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 16 L116 50 L116 80 L0 114 Z" fill="var(--aic-accent-soft)" />
                  <path d="M0 38 L116 56 L116 74 L0 92 Z" fill="var(--aic-accent)" opacity="0.85" />
                  <path d="M70 56 L98 65 L70 74 Z" fill="var(--aic-accent-deep)" />
                </svg>
              )}
              {p.showBridge && <span className="os-ribbon-lbl">{copy.ribbonLabel}</span>}
            </div>

            <div className="os-node target" data-focus={focusTgt ? '1' : '0'}>
              <div className="os-kicker"><i />{t.kicker}</div>
              {p.chartType === 'ring' ? (
                <div className="os-target-body">
                  <TargetRing pct={t.pct} focus={focusTgt} showValue={p.showValues} display={t.display} unit={t.unit} />
                  <div className="os-caption" style={{ flex: 1 }}>{t.caption}</div>
                </div>
              ) : (
                <div className="os-barbox">
                  {p.showValues && <div className="os-bar-v">{t.display}<u>{t.unit}</u></div>}
                  <div className="os-bar-track"><div className="os-bar-fill" style={{ width: t.pct + '%' }} /></div>
                  <div className="os-caption">{t.caption}</div>
                </div>
              )}
              {p.chartType === 'ring' && <div className="os-tag">{t.tag}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="os-foot">
        <div className="os-closing"><b />{copy.closing}</div>
        {p.showDecorations && <div className="os-deco"><HeatStrip data={HEAT} gap={4} /></div>}
      </div>
    </div>
  );
}
