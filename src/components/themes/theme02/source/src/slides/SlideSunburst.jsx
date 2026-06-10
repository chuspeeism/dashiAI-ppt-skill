/**
 * SlideSunburst.jsx — 旭日图（图表页 · Sunburst / 两层径向层级）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 旭日图：内环为顶层分类（扇区角度 ∝ 该类合计），外环把每个内环扇区按子项再细分，
 * 一眼读出「钱进了哪个大板块、又落在哪个子赛道」。极坐标内联 SVG，仅依赖 props。
 *
 * ── Props (see slideSunburstDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   groups       Array<{label, children:Array<{label,value}>}>  两层数据
 *   unit         string   数值单位
 *   centerLabel  string   中心读数说明
 *   groupCount   number   展示的顶层分类数量（1–n）
 *   focusEnabled boolean  辉光强调某一板块（其余淡出）
 *   focusIndex   number   0-based 被强调板块
 *   showInnerLabels boolean 内环板块标签显隐
 *   showValueLabels boolean 外环子项数值显隐
 *   showLegend   boolean  右侧明细图例显隐
 *   gxnScheme    object?  { palette, accent, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideSunburstDefaults = {
  kicker: 'SUNBURST · 资本去向',
  title: '970 亿美元 ',
  titleEm: '层层拆解',
  lead: '内环是三大板块、外环是子赛道——角度越宽，吸金越多。资本高度向「模型层 + 算力底座」聚拢。',
  // 源：报告 2.1 赛道结构（亿美元），三大板块合计 970
  groups: [
    { label: '模型层', children: [
      { label: '通用大模型', value: 380 },
      { label: '开源 / 专用模型', value: 90 },
    ] },
    { label: '基础设施', children: [
      { label: '算力云', value: 210 },
      { label: 'AI 芯片', value: 95 },
      { label: '数据底座', value: 45 },
    ] },
    { label: '应用层', children: [
      { label: '企业级应用', value: 90 },
      { label: 'AI 搜索 / 消费', value: 35 },
      { label: '行业垂直', value: 25 },
    ] },
  ],
  unit: '亿美元',
  centerLabel: '全年总额',
  groupCount: 3,
  focusEnabled: true,
  focusIndex: 0,
  showInnerLabels: true,
  showValueLabels: true,
  showLegend: true,
};

export const slideSunburstControls = [
  { key: 'groupCount', type: 'number', label: '板块数量', default: 3, min: 1, step: 1,
    maxFrom: (p) => (p.groups ? p.groups.length : 3), describe: '旭日图展示的顶层板块数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一板块（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.groupCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调板块的序号' },
  { key: 'showInnerLabels', type: 'toggle', label: '板块标签', default: true, describe: '内环板块标签显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '子项数值', default: true, describe: '外环子项数值显隐' },
  { key: 'showLegend', type: 'toggle', label: '右侧明细', default: true, describe: '右侧明细图例显隐' },
];

// hex → "r,g,b"
function rgbOf(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

function Sunburst({ groups, total, unit, centerLabel, fIdx, showInnerLabels, showValueLabels, palette, accent, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const S = 600, cx = S / 2, cy = S / 2;
  const rIn0 = 96, rIn1 = 186, rOut1 = 280; // inner ring band + outer ring band
  const focused = fIdx >= 0;
  const TAU = Math.PI * 2;
  const gap = 0.012 * TAU; // angular gap between top sectors

  const PT = (a, r) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const f2 = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const sector = (a0, a1, ri, ro) => {
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    return [
      `M ${f2(PT(a0, ri))}`, `L ${f2(PT(a0, ro))}`,
      `A ${ro} ${ro} 0 ${large} 1 ${f2(PT(a1, ro))}`,
      `L ${f2(PT(a1, ri))}`,
      `A ${ri} ${ri} 0 ${large} 0 ${f2(PT(a0, ri))}`, 'Z',
    ].join(' ');
  };

  // compute angular spans
  let cursor = 0;
  const arcs = groups.map((g, gi) => {
    const gTotal = g.children.reduce((s, c) => s + c.value, 0);
    const span = (gTotal / total) * (TAU - gap * groups.length);
    const a0 = cursor + gap / 2;
    const a1 = a0 + span;
    cursor = a1 + gap / 2;
    let ci = a0;
    const kids = g.children.map((c) => {
      const cs = (c.value / gTotal) * span;
      const k = { ...c, a0: ci, a1: ci + cs, mid: ci + cs / 2 };
      ci += cs;
      return k;
    });
    return { gi, g, gTotal, a0, a1, mid: (a0 + a1) / 2, kids };
  });

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {arcs.map((a) => {
        const c = palette[a.gi % palette.length];
        const isF = a.gi === fIdx; const dim = focused && !isF;
        return (
          <g key={a.gi} opacity={dim ? 0.3 : 1}>
            {/* inner ring sector */}
            <path d={sector(a.a0, a.a1, rIn0, rIn1)} fill={c} fillOpacity={isF ? 0.96 : 0.86}
                  stroke="#07090b" strokeWidth="2"
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {/* outer ring children */}
            {a.kids.map((k, ki) => (
              <path key={ki} d={sector(k.a0, k.a1, rIn1 + 4, rOut1)} fill={c}
                    fillOpacity={(isF ? 0.62 : 0.5) - ki * 0.12}
                    stroke="#07090b" strokeWidth="2" />
            ))}
            {/* inner label */}
            {showInnerLabels && (() => {
              const [lx, ly] = PT(a.mid, (rIn0 + rIn1) / 2);
              return (
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="22"
                      fill="#07120c" style={{ paintOrder: 'stroke' }}
                      stroke="rgba(255,255,255,0.18)" strokeWidth="0.6">{a.g.label}</text>
              );
            })()}
            {/* outer value labels for large arcs or focused group */}
            {showValueLabels && a.kids.map((k, ki) => {
              if (!isF && (k.a1 - k.a0) < 0.16) return null;
              const [lx, ly] = PT(k.mid, rOut1 + 30);
              return (
                <text key={`v${ki}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="22"
                      fill={isF ? '#fff' : 'rgba(238,243,241,0.82)'}
                      style={{ fontVariantNumeric: 'tabular-nums' }}>{k.value}</text>
              );
            })}
          </g>
        );
      })}

      {/* center readout */}
      <circle cx={cx} cy={cy} r={rIn0 - 8} fill="rgba(7,9,11,0.6)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <text x={cx} y={cy - 14} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="58"
            fill={accent} style={{ fontVariantNumeric: 'tabular-nums' }}>{total}</text>
      <text x={cx} y={cy + 30} textAnchor="middle" dominantBaseline="middle"
            fontFamily="'Space Mono',monospace" fontSize="20" fill="rgba(238,243,241,0.55)">
        {centerLabel} · {unit}
      </text>
    </svg>
  );
}

export function SlideSunburst(props) {
  const p = { ...slideSunburstDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(1, Math.min(p.groups.length, p.groupCount));
  const groups = p.groups.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const total = groups.reduce((s, g) => s + g.children.reduce((a, c) => a + c.value, 0), 0);
  const grand = p.groups.reduce((s, g) => s + g.children.reduce((a, c) => a + c.value, 0), 0);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '05 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 14, minHeight: 0, display: 'grid',
          gridTemplateColumns: p.showLegend ? '1.1fr 0.9fr' : '1fr', gap: 52, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sunburst groups={groups} total={total} unit={p.unit} centerLabel={p.centerLabel} fIdx={fIdx}
                      showInnerLabels={p.showInnerLabels} showValueLabels={p.showValueLabels}
                      palette={palette} accent={accent} glow={glow} />
          </div>

          {p.showLegend && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
              {groups.map((g, gi) => {
                const gTotal = g.children.reduce((s, c) => s + c.value, 0);
                const isF = gi === fIdx; const dim = fIdx >= 0 && !isF;
                const c = palette[gi % palette.length];
                return (
                  <div key={gi} className={cx('gxn-panel', isF && fIdx >= 0 && 'is-focus')}
                       style={{ padding: '20px 26px', display: 'flex', flexDirection: 'column', gap: 12,
                         opacity: dim ? 0.5 : 1, transition: 'opacity .3s' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <span className="gxn-dot" style={{ color: c, background: c }} />
                        <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--gxn-text)' }}>{g.label}</span>
                      </span>
                      <span className="gxn-num" style={{ fontSize: 34, fontWeight: 600, color: isF && fIdx >= 0 ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                        whiteSpace: 'nowrap' }}>{gTotal}<span style={{ fontSize: '0.5em', color: 'var(--gxn-faint)', marginLeft: 6 }}>{Math.round(gTotal / total * 100)}%</span></span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 18px' }}>
                      {g.children.map((k, ki) => (
                        <span key={ki} className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-dim)' }}>
                          {k.label}<span style={{ color: 'var(--gxn-faint)', marginLeft: 7 }}>{k.value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="gxn-rise-3" style={{ marginTop: 16 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 模型层 + 基础设施合计占比超 {Math.round((grand - p.groups[p.groups.length - 1].children.reduce((a, c) => a + c.value, 0)) / grand * 100)}%——资本仍集中在「造模型」与「卖铲子」两端
          </span>
        </div>
      </div>
    </div>
  );
}

export default SlideSunburst;
