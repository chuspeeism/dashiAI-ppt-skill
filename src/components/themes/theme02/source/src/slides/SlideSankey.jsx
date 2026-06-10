/**
 * SlideSankey.jsx — 资金流向桑基图（图表页 · Sankey / Alluvial）.
 * Independent, prop-driven. Renders its own theme styles + inline SVG.
 *
 * 两列冲积流向：左列为来源（赛道），右列为汇聚目标（产业链层）。每条来源以一条
 * 「带宽 ∝ 金额」的发光丝带流向其所属目标，目标高度 = 流入之和。一眼读懂「钱从哪
 * 来、汇到哪去」。来源数量可调，可辉光强调某一来源（其丝带高亮、其余淡出）。
 * 纯 props 驱动，无运行时依赖。
 *
 * ── Props (see slideSankeyDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   sources      Array<{label,value,to,note}>  to = 目标列下标（每条整体流向一个目标）
 *   targets      Array<{label,sub}>            汇聚目标（按下标被 source.to 引用）
 *   unit         string   金额单位（如 “亿美元”）
 *   sourceCount  number   展示的来源数量（2–n）
 *   focusEnabled boolean  辉光强调某一来源（其余淡出）
 *   focusIndex   number   0-based 被强调来源
 *   showValueLabels boolean  来源金额 + 占比显隐
 *   showTargetMeta  boolean  目标说明 + 流入合计显隐
 *   gxnScheme    object?  { palette, glow } 调色（缺省走主题调色板）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideSankeyDefaults = {
  kicker: 'FLOW · 资金流向',
  title: '970 亿美元 ',
  titleEm: '流向了哪里',
  lead: '左侧为各业务赛道吸纳的资金，右侧汇聚到 AI 产业链的上 / 中 / 下游——丝带越宽，金额越大。',
  // 源：报告 3.1 行业赛道融资额 × 四、产业链分层映射
  sources: [
    { label: '通用大模型', value: 420, to: 1, note: 'AGI 叙事' },
    { label: '垂直应用', value: 245, to: 2, note: '商业化落地' },
    { label: 'AI 基础设施', value: 158, to: 0, note: '卖铲子逻辑' },
    { label: 'AI 芯片', value: 97, to: 0, note: '上游硬件' },
    { label: '其他赛道', value: 50, to: 2, note: '工具链 · 安全' },
  ],
  targets: [
    { label: '上游 · 基础设施', sub: '芯片 / 算力云' },
    { label: '中游 · 模型层', sub: '通用 / 专用模型' },
    { label: '下游 · 应用层', sub: '企业 / 消费 / 具身' },
  ],
  unit: '亿美元',
  sourceCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showValueLabels: true,
  showTargetMeta: true,
};

export const slideSankeyControls = [
  { key: 'sourceCount', type: 'number', label: '来源数量', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.sources ? p.sources.length : 5), describe: '左列展示的来源数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一来源（其丝带高亮、其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.sourceCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调来源的序号' },
  { key: 'showValueLabels', type: 'toggle', label: '金额标签', default: true,
    describe: '来源金额 + 占比显隐' },
  { key: 'showTargetMeta', type: 'toggle', label: '目标说明', default: true,
    describe: '右列目标说明 + 流入合计显隐' },
];

function ribbon(x0, yt0, yb0, x1, yt1, yb1) {
  const mx = (x0 + x1) / 2;
  return `M ${x0},${yt0} C ${mx},${yt0} ${mx},${yt1} ${x1},${yt1}`
    + ` L ${x1},${yb1} C ${mx},${yb1} ${mx},${yb0} ${x0},${yb0} Z`;
}

function Sankey({ sources, targets, unit, fIdx, showValueLabels, showTargetMeta, palette, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 1280, H = 540;
  const padT = 26, padB = 26, plotH = H - padT - padB;
  const nodeW = 22, leftX = 358, rightX = W - 358 - nodeW;
  const total = sources.reduce((a, s) => a + s.value, 0) || 1;
  const gap = 20;
  const leftGapTotal = gap * Math.max(sources.length - 1, 0);
  const scale = (plotH - leftGapTotal) / total;
  const focused = fIdx >= 0;

  // left nodes (stacked top→bottom by source order)
  let yc = padT;
  const L = sources.map((s, i) => { const h = s.value * scale; const o = { ...s, i, y: yc, h }; yc += h + gap; return o; });

  // targets that actually receive flow from the included sources
  const tin = targets
    .map((t, ti) => ({ ...t, ti, in: L.filter((s) => s.to === ti).reduce((a, s) => a + s.value, 0) }))
    .filter((t) => t.in > 0);
  const rGapTotal = gap * Math.max(tin.length - 1, 0);
  const rUsed = total * scale + rGapTotal;
  let yr = padT + (plotH - rUsed) / 2;
  const tmap = {};
  tin.forEach((t) => { t.y = yr; t.h = t.in * scale; t.off = 0; tmap[t.ti] = t; yr += t.h + gap; });

  // ribbons (source flows entirely into its target slice)
  const ribbons = L.map((s) => {
    const t = tmap[s.to]; if (!t) return null;
    const y1t = t.y + t.off; t.off += s.h;
    return { i: s.i, color: palette[s.i % palette.length],
      d: ribbon(leftX + nodeW, s.y, s.y + s.h, rightX, y1t, y1t + s.h) };
  }).filter(Boolean);

  // left-label de-collision: small nodes' stacked labels would overlap, so spread
  // label centers to a guaranteed min spacing (a leader line ties a displaced
  // label back to its node). Pure layout pass — works for any source count.
  const labelH = showValueLabels ? 66 : 34;
  const minGap = labelH + 8;
  const lab = L.map((s) => ({ i: s.i, node: s.y + s.h / 2, c: s.y + s.h / 2 }));
  for (let k = 1; k < lab.length; k++) {
    if (lab[k].c < lab[k - 1].c + minGap) lab[k].c = lab[k - 1].c + minGap;
  }
  if (lab.length) {
    const maxC = padT + plotH - labelH / 2;
    if (lab[lab.length - 1].c > maxC) {
      lab[lab.length - 1].c = maxC;
      for (let k = lab.length - 2; k >= 0; k--) {
        if (lab[k].c > lab[k + 1].c - minGap) lab[k].c = lab[k + 1].c - minGap;
      }
    }
    const minTop = padT + labelH / 2;
    if (lab[0].c < minTop) {
      lab[0].c = minTop;
      for (let k = 1; k < lab.length; k++) {
        if (lab[k].c < lab[k - 1].c + minGap) lab[k].c = lab[k - 1].c + minGap;
      }
    }
  }
  const labC = {}; lab.forEach((l) => { labC[l.i] = l; });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {ribbons.map((rb) => (
          <linearGradient key={rb.i} id={`${uid}-r${rb.i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rb.color} stopOpacity="0.62" />
            <stop offset="100%" stopColor={rb.color} stopOpacity="0.16" />
          </linearGradient>
        ))}
        <filter id={`${uid}-g`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ribbons */}
      {ribbons.map((rb) => {
        const isF = rb.i === fIdx; const dim = focused && !isF;
        return (
          <path key={rb.i} d={rb.d} fill={`url(#${uid}-r${rb.i})`}
                opacity={dim ? 0.18 : (isF ? 1 : 0.92)}
                filter={isF ? `url(#${uid}-g)` : undefined} />
        );
      })}

      {/* left source nodes + labels */}
      {L.map((s) => {
        const c = palette[s.i % palette.length];
        const isF = s.i === fIdx; const dim = focused && !isF;
        const lc = labC[s.i]; const cyl = lc.c; const nodeC = lc.node;
        const displaced = Math.abs(cyl - nodeC) > 5;
        return (
          <g key={s.i} opacity={dim ? 0.4 : 1}>
            <rect x={leftX} y={s.y} width={nodeW} height={Math.max(s.h, 3)} rx="5" fill={c}
                  filter={isF ? `url(#${uid}-g)` : undefined} />
            {displaced && (
              <path d={`M ${leftX} ${nodeC} C ${leftX - 8},${nodeC} ${leftX - 8},${cyl} ${leftX - 16},${cyl}`}
                    fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="1.4" />
            )}
            <text x={leftX - 18} y={cyl - 13} textAnchor="end"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 600} fontSize="28"
                  fill={isF ? c : '#eef3f1'}>{s.label}</text>
            {showValueLabels && (
              <text x={leftX - 18} y={cyl + 19} textAnchor="end"
                    fontFamily="'Space Mono',monospace" fontSize="23" fill="rgba(238,243,241,0.55)"
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                {s.value} {unit} · {Math.round((s.value / total) * 100)}%
              </text>
            )}
          </g>
        );
      })}

      {/* right target nodes + labels */}
      {tin.map((t) => {
        const cyl = t.y + t.h / 2;
        return (
          <g key={t.ti}>
            <rect x={rightX} y={t.y} width={nodeW} height={Math.max(t.h, 3)} rx="5"
                  fill="#cfe9dd" opacity="0.9" />
            <text x={rightX + nodeW + 18} y={showTargetMeta ? cyl - 24 : cyl - 2}
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="29" fill="#eef3f1">
              {t.label}
            </text>
            {showTargetMeta && (
              <>
                <text x={rightX + nodeW + 18} y={cyl + 6}
                      fontFamily="'Noto Sans SC',sans-serif" fontSize="23" fill="rgba(238,243,241,0.55)">
                  {t.sub}
                </text>
                <text x={rightX + nodeW + 18} y={cyl + 36}
                      fontFamily="'Space Mono',monospace" fontSize="24" fill="var(--gxn-accent)"
                      style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {t.in} {unit} · {Math.round((t.in / total) * 100)}%
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SlideSankey(props) {
  const p = { ...slideSankeyDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(p.sources.length, p.sourceCount));
  const sources = p.sources.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const fp = fIdx >= 0 ? sources[fIdx] : null;
  const ft = fp ? p.targets[fp.to] : null;
  const total = sources.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 14, maxWidth: 1320 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, minHeight: 0, position: 'relative' }}>
          <Sankey sources={sources} targets={p.targets} unit={p.unit} fIdx={fIdx}
                  showValueLabels={p.showValueLabels} showTargetMeta={p.showTargetMeta}
                  palette={palette} glow={glow} />
        </div>

        <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 6 }}>
          <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)' }}>带宽 = 融资额 · 全年合计 {total} {p.unit}</span>
          {fp && ft && (
            <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
              <strong style={{ color: 'var(--gxn-accent)', fontWeight: 700 }}>{fp.label}</strong>
              {' '}{fp.value} {p.unit} 汇入 <strong style={{ color: 'var(--gxn-text)' }}>{ft.label}</strong>
              {' '}· 占全年 {Math.round((fp.value / total) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideSankey;
