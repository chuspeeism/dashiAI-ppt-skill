/**
 * SlideFunnel.jsx — 资本漏斗（图表页 · 漏斗）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 自上而下逐级收窄的漏斗，逐段着色、辉光强调，右侧明细列出各级数值与逐级转化率。
 * 适合“从大盘到头部”的逐层筛选叙事。图表内联 SVG，仅依赖 props（含可选 gxnScheme 调色）。
 *
 * ── Props (see slideFunnelDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   stages       Array<{label,value,unit,note}>   漏斗各级（自上而下，值递减）
 *   stageCount   number   展示的层级数量（2–n）
 *   focusEnabled boolean  辉光强调某一级
 *   focusIndex   number   0-based 被强调层级
 *   showValueLabels boolean  漏斗段内数值显隐
 *   showRate     boolean  逐级转化率显隐
 *   showDetail   boolean  右侧明细列显隐
 *   gxnScheme    object?  { accent, glow, palette } 调色（缺省走主题绿）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideFunnelDefaults = {
  kicker: 'FUNNEL · 资本漏斗',
  title: '从大盘到头部 ',
  titleEm: '资本的逐级收窄',
  lead: '把一年的美国 AI 风险投资放进同一只漏斗——每下一级，门槛抬高一档，留下的玩家越来越少。',
  stages: [
    { label: 'AI 初创融资事件', value: 1160, unit: '笔', note: '全年完成融资的美国 AI 公司' },
    { label: '大额融资 ≥ $100M', value: 97, unit: '笔', note: '单笔金额跨过一亿美元门槛' },
    { label: '超大额 ≥ $1B', value: 12, unit: '笔', note: '单笔金额跨过十亿美元门槛' },
    { label: '百亿美元俱乐部', value: 5, unit: '家', note: '估值站上百亿美元的头部' },
  ],
  stageCount: 4,
  focusEnabled: true,
  focusIndex: 1,
  showValueLabels: true,
  showRate: true,
  showDetail: true,
};

export const slideFunnelControls = [
  { key: 'stageCount', type: 'number', label: '层级数量', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.stages ? p.stages.length : 4), describe: '漏斗展示的层级数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否辉光强调某一级' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 1, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.stageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调层级的序号' },
  { key: 'showValueLabels', type: 'toggle', label: '段内数值', default: true,
    describe: '漏斗段内数值标签显隐' },
  { key: 'showRate', type: 'toggle', label: '逐级转化率', default: true,
    describe: '相邻层级的留存/转化率显隐' },
  { key: 'showDetail', type: 'toggle', label: '右侧明细', default: true,
    describe: '右侧层级明细列显隐' },
];

const fmt = (n) => (n >= 1000 ? n.toLocaleString('en-US') : String(n));

function Funnel({ stages, fIdx, showValueLabels, accent, glow, palette }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 720, H = 600;
  const padT = 16, padB = 16, midX = W / 2;
  const n = stages.length;
  const maxV = Math.max(...stages.map((s) => s.value), 1);
  const minW = 150, maxW = W - 40;
  const wOf = (v) => minW + (maxW - minW) * Math.sqrt(v / maxV); // sqrt → gentler taper
  const gap = 12;
  const bandH = (H - padT - padB - gap * (n - 1)) / n;
  const focused = fIdx >= 0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {stages.map((s, i) => {
        const yTop = padT + i * (bandH + gap);
        const yBot = yTop + bandH;
        const topW = wOf(s.value);
        const next = stages[i + 1];
        const botW = next ? wOf(next.value) : topW * 0.74;
        const tl = midX - topW / 2, tr = midX + topW / 2;
        const bl = midX - botW / 2, br = midX + botW / 2;
        const c = palette[i % palette.length];
        const isF = i === fIdx;
        const dim = focused && !isF;
        return (
          <g key={i} opacity={dim ? 0.34 : 1}>
            <path d={`M ${tl} ${yTop} L ${tr} ${yTop} L ${br} ${yBot} L ${bl} ${yBot} Z`}
                  fill={c} fillOpacity={isF ? 0.95 : 0.8}
                  stroke={isF ? c : 'rgba(255,255,255,0.10)'} strokeWidth={isF ? 2 : 1}
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showValueLabels && (
              <text x={midX} y={yTop + bandH / 2} textAnchor="middle" dominantBaseline="central"
                    fontFamily="'Space Grotesk',sans-serif" fontWeight="700"
                    fontSize={Math.min(44, bandH * 0.5)} fill="#07090b"
                    style={{ fontVariantNumeric: 'tabular-nums' }}>
                {fmt(s.value)}
                <tspan fontSize="0.5em" fontWeight="600" dx="6">{s.unit}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function SlideFunnel(props) {
  const p = { ...slideFunnelDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';
  const palette = sc.palette || ['#2fe07f', '#2fe0c4', '#4ea2ff', '#9b7dff', '#b9f24a'];

  const count = Math.max(2, Math.min(p.stages.length, p.stageCount));
  const stages = p.stages.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const rate = (i) => (i === 0 ? null : Math.round((stages[i].value / stages[i - 1].value) * 1000) / 10);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "21 / 27"} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1200 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, display: 'grid',
          gridTemplateColumns: p.showDetail ? '1.05fr 0.95fr' : '1fr', gap: 56, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Funnel stages={stages} fIdx={fIdx} showValueLabels={p.showValueLabels}
                    accent={accent} glow={glow} palette={palette} />
          </div>

          {p.showDetail && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
              {stages.map((s, i) => {
                const c = palette[i % palette.length];
                const isF = i === fIdx; const dim = fIdx >= 0 && !isF;
                const r = rate(i);
                return (
                  <article key={i} className={cx('gxn-panel', isF && 'is-focus')}
                           style={{ position: 'relative', overflow: 'hidden', padding: '20px 26px 20px 30px',
                                    display: 'flex', alignItems: 'center', gap: 22,
                                    opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
                      background: c, boxShadow: `0 0 20px -2px ${c}` }} />
                    <span style={{ width: 14, height: 14, borderRadius: 4, background: c, flex: '0 0 auto',
                      boxShadow: `0 0 14px ${c}` }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 28, fontWeight: 700,
                        color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)' }}>{s.label}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: 24, color: 'var(--gxn-dim)', lineHeight: 1.35 }}>{s.note}</p>
                    </div>
                    <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                      <div className="gxn-num" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1,
                        color: 'var(--gxn-text)', whiteSpace: 'nowrap' }}>
                        {fmt(s.value)}<span style={{ fontSize: '0.46em', marginLeft: 5, color: 'var(--gxn-dim)' }}>{s.unit}</span>
                      </div>
                      {p.showRate && r != null && (
                        <div className="gxn-mono" style={{ fontSize: 24, marginTop: 5, color: 'var(--gxn-faint)' }}>
                          ▼ 留存 {r}%
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideFunnel;
