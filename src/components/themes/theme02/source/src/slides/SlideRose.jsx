/**
 * SlideRose.jsx — 南丁格尔玫瑰 / 极坐标柱（图表页 · Polar）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 玫瑰图：把一圈周期数据（如 12 个月）画成等角度的扇形花瓣，半径 ∝ 数值，
 * 峰谷沿圆周一目了然。半径可选「线性（radius∝值）」或「面积守恒（√值）」。
 * 极坐标内联 SVG：pt(ang,r)=[c+r·cosθ, c+r·sinθ]，仅依赖 props。
 *
 * ── Props (see slideRoseDefaults) ───────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   items        Array<{label, value}>   一圈周期数据
 *   unit         string   数值单位
 *   petalCount   number   展示的花瓣数（3–n）
 *   scaleMode    'radius' | 'area'   半径映射方式
 *   focusEnabled boolean  辉光强调某一瓣（其余淡出）
 *   focusIndex   number   0-based 被强调瓣
 *   showRings    boolean  背景同心环 + 刻度显隐
 *   showLabels   boolean  外圈周期标签显隐
 *   showValueLabels boolean 峰值瓣的数值显隐
 *   gxnScheme    object?  { palette, accent, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRoseDefaults = {
  kicker: 'ROSE · 节律',
  title: '资本的 ',
  titleEm: '十二个月',
  lead: '把全年逐月融资额绕成一圈——5 月与 8 月两次冲高，与多家头部公司集中关账同步。',
  // 源：报告 2.2 逐月融资额（亿美元）
  items: [
    { label: '1月', value: 45 }, { label: '2月', value: 58 }, { label: '3月', value: 59 },
    { label: '4月', value: 86 }, { label: '5月', value: 105 }, { label: '6月', value: 93 },
    { label: '7月', value: 92 }, { label: '8月', value: 118 }, { label: '9月', value: 108 },
    { label: '10月', value: 73 }, { label: '11月', value: 81 }, { label: '12月', value: 52 },
  ],
  unit: '亿美元',
  petalCount: 12,
  scaleMode: 'radius',
  focusEnabled: true,
  focusIndex: 7,
  showRings: true,
  showLabels: true,
  showValueLabels: true,
};

export const slideRoseControls = [
  { key: 'petalCount', type: 'number', label: '花瓣数量', default: 12, min: 3, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 12), describe: '玫瑰图展示的花瓣（周期）数量' },
  { key: 'scaleMode', type: 'enum', label: '半径映射', default: 'radius',
    options: [{ value: 'radius', label: '线性' }, { value: 'area', label: '面积守恒' }],
    describe: '半径 ∝ 数值，或面积 ∝ 数值（√）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一瓣（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 7, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.petalCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调花瓣的序号' },
  { key: 'showRings', type: 'toggle', label: '背景环网', default: true, describe: '同心环 + 刻度显隐' },
  { key: 'showLabels', type: 'toggle', label: '周期标签', default: true, describe: '外圈周期标签显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '峰值数值', default: true, describe: '峰值瓣数值显隐' },
];

function Rose({ items, unit, scaleMode, fIdx, showRings, showLabels, showValueLabels, palette, accent, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const S = 620, cx = S / 2, cy = S / 2, R = 246, r0 = 30;
  const n = items.length;
  const vMax = Math.max(...items.map((d) => d.value), 1);
  const map = (v) => scaleMode === 'area' ? Math.sqrt(v / vMax) : (v / vMax);
  const rOf = (v) => r0 + (R - r0) * map(v);
  const step = (Math.PI * 2) / n;
  const gap = step * 0.10;
  const focused = fIdx >= 0;

  // wedge from center (r0) to rOf(value), between two angles (12 o'clock origin, cw)
  const PT = (a, r) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const f2 = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const wedge = (a0, a1, r) => {
    const large = (a1 - a0) > Math.PI ? 1 : 0;
    return [
      `M ${f2(PT(a0, r0))}`, `L ${f2(PT(a0, r))}`,
      `A ${r} ${r} 0 ${large} 1 ${f2(PT(a1, r))}`,
      `L ${f2(PT(a1, r0))}`,
      `A ${r0} ${r0} 0 ${large} 0 ${f2(PT(a0, r0))}`, 'Z',
    ].join(' ');
  };

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showRings && rings.map((f, i) => (
        <circle key={i} cx={cx} cy={cy} r={r0 + (R - r0) * f} fill="none"
                stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      ))}
      {showRings && rings.map((f, i) => (
        <text key={`t${i}`} x={cx + 6} y={cy - (r0 + (R - r0) * f) - 4}
              fontFamily="'Space Mono',monospace" fontSize="18" fill="rgba(238,243,241,0.4)">
          {Math.round(vMax * f)}
        </text>
      ))}

      {items.map((d, i) => {
        const a0 = i * step + gap, a1 = (i + 1) * step - gap;
        const r = rOf(d.value);
        const c = palette[i % palette.length];
        const isF = i === fIdx; const dim = focused && !isF;
        return (
          <g key={i} opacity={dim ? 0.32 : 1}>
            <path d={wedge(a0, a1, r)} fill={c} fillOpacity={isF ? 0.95 : 0.78}
                  stroke={isF ? '#fff' : c} strokeWidth={isF ? 2 : 0.5} strokeOpacity={isF ? 0.5 : 1}
                  filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
            {showValueLabels && (isF || d.value >= vMax * 0.86) && (() => {
              const am = (a0 + a1) / 2;
              const [lx, ly] = PT(am, r + 26);
              return (
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontFamily="'Space Grotesk',sans-serif" fontWeight="700" fontSize="24"
                      fill={isF ? '#fff' : c} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {d.value}
                </text>
              );
            })()}
          </g>
        );
      })}

      {showLabels && items.map((d, i) => {
        const am = i * step + step / 2;
        const [lx, ly] = PT(am, R + 50);
        const isF = i === fIdx;
        return (
          <text key={`l${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontWeight={isF ? 700 : 500} fontSize="23"
                fill={isF ? '#eef3f1' : 'rgba(238,243,241,0.6)'}>{d.label}</text>
        );
      })}
    </svg>
  );
}

export function SlideRose(props) {
  const p = { ...slideRoseDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#b9f24a', '#2fe0c4', '#4ea2ff', '#9b7dff', '#ff6fae', '#ffc24a'];
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(3, Math.min(p.items.length, p.petalCount));
  const items = p.items.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const total = items.reduce((s, d) => s + d.value, 0);
  const peak = items.reduce((m, d) => d.value > m.value ? d : m, items[0]);

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '04 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 18, maxWidth: 1200 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 14, minHeight: 0, display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr', gap: 48, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rose items={items} unit={p.unit} scaleMode={p.scaleMode} fIdx={fIdx}
                  showRings={p.showRings} showLabels={p.showLabels} showValueLabels={p.showValueLabels}
                  palette={palette} accent={accent} glow={glow} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
            {[
              { v: peak.value, u: p.unit, c: `年内峰值 · ${peak.label}`, foc: true },
              { v: Math.round(total / count), u: p.unit, c: '月度均值', foc: false },
              { v: total, u: p.unit, c: '全年合计', foc: false },
            ].map((s, i) => (
              <div key={i} className={cx('gxn-panel', s.foc && fIdx >= 0 && 'is-focus')}
                   style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className={cx('gxn-num', s.foc && fIdx >= 0 && 'gxn-aurora-num')} style={{
                  fontSize: 72, fontWeight: 600, lineHeight: 0.9, letterSpacing: '-0.02em',
                  color: s.foc ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                  textShadow: s.foc && fIdx >= 0 ? '0 0 32px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                  {s.v}<span style={{ fontSize: '0.32em', marginLeft: 8, color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.u}</span>
                </div>
                <span className="gxn-mono" style={{ fontSize: 23, color: 'var(--gxn-faint)' }}>{s.c}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gxn-rise-3" style={{ marginTop: 18 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 5 月、8 月两次峰值，与头部公司集中关账有关；全年呈「双峰高位」节律
          </span>
        </div>
      </div>
    </div>
  );
}

export default SlideRose;
