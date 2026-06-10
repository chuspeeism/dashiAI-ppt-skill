// Slide05Sector.jsx — 赛道分布 / Sector funding distribution.
// Chart renders as donut, pie, or horizontal bars (chartType). Any segment can
// be emphasized; donut center total and the caption can be toggled.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

const EVIL_HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';
const EVIL_DOTS = { backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)', backgroundSize: '24px 24px' };

export const defaultProps = {
  kicker: '# 横向透视',
  title: '赛道分布 · 融资额占比',
  en: 'Funding by Sector',
  cn: '97 笔大额融资的赛道归类',
  segments: [
    { label: '通用大模型', en: 'Foundation Model', value: 420, pct: '43.3%', color: '#5b8def' },
    { label: '垂直应用', en: 'Vertical AI', value: 245, pct: '25.3%', color: '#46b083' },
    { label: 'AI 基础设施', en: 'Infrastructure', value: 158, pct: '16.3%', color: '#e0a23a' },
    { label: 'AI 芯片', en: 'Hardware', value: 97, pct: '10.0%', color: '#e8503a' },
    { label: '其他', en: 'Tooling / Safety', value: 50, pct: '5.1%', color: '#7a5ae0' },
  ],
  centerValue: '970',
  centerUnit: '亿美元',
  centerLabel: '全年合计',
  caption: '通用大模型占据近半壁江山，反映对 AGI 叙事的押注；基础设施与芯片合计超四分之一',
  // tweakable
  chartType: 'donut',
  segmentCount: 5,
  highlight: true,
  highlightIndex: 0,
  showCenterTotal: true,
  tiltAngle: 12,
  cornerRadius: 14,
  paddingAngle: 3,
  showCaption: true,
  evil: false,
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'donut',
    options: [{ value: 'donut', label: '环形' }, { value: 'pie', label: '饼图' }, { value: 'bar', label: '条形' }],
    description: '赛道占比的图表呈现形式。' },
  { key: 'segmentCount', label: '分类数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 类',
    description: '展示的赛道分类数量（其余并入末项）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个赛道。' },
  { key: 'highlightIndex', label: '强调第几类', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的赛道序号（从 0 开始）。' },
  { key: 'showCenterTotal', label: '环形中心合计', type: 'boolean', default: true,
    description: '环形图中心是否显示合计数值（仅环形模式）。' },
  { key: 'tiltAngle', label: '倾斜角度', type: 'number', default: 12, min: 0, max: 24, step: 1, unit: '°',
    description: '图表向右的 3D 倾斜角度（仅环形/饼图模式）；0° 为平面。' },
  { key: 'cornerRadius', label: '扇段圆角', type: 'number', default: 14, min: 0, max: 40, step: 1, unit: 'px',
    description: '环形/饼图扇段的圆角半径，evilcharts 圆角扇段观感（仅环形/饼图模式）。' },
  { key: 'paddingAngle', label: '扇段间隙', type: 'number', default: 3, min: 0, max: 8, step: 1, unit: '°',
    description: '相邻扇段之间的留白角度（仅环形/饼图模式）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
  { key: 'evil', label: '霓虹辉光增强', type: 'boolean', default: false,
    description: '增强高亮扇段的霓虹辉光强度；条形模式下叠加 45° 斜纹纹理。' },
];

// ── evilcharts-style rounded-segment chart helpers (only the LEFT chart is
// restyled to the reference; head / legend / caption stay as before) ──
function mix(hex, amt, toWhite) {
  const c = hex.replace('#', '');
  const f = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  const n = parseInt(f, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = toWhite ? 255 : 0;
  r = Math.round(r + (t - r) * amt); g = Math.round(g + (t - g) * amt); b = Math.round(b + (t - b) * amt);
  return `rgb(${r},${g},${b})`;
}
const rpolar = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
// Rounded annular segment (donut): four corners filleted by radius cr.
function roundedAnnular(cx, cy, ri, ro, a0, a1, cr) {
  const span = a1 - a0;
  if (span <= 1e-4) return '';
  cr = Math.max(0, Math.min(cr, (ro - ri) / 2));
  const sHalf = Math.sin(Math.min(span / 2, Math.PI / 2)) * 0.96;
  cr = Math.min(cr, ro * sHalf / (1 + sHalf));
  const doR = ro - cr, diR = ri + cr;
  const bo = Math.min(Math.asin(Math.min(1, cr / Math.max(1e-3, doR))), span / 2);
  const bi = Math.min(Math.asin(Math.min(1, cr / Math.max(1e-3, diR))), span / 2);
  const P = (rr, aa) => { const q = rpolar(cx, cy, rr, aa); return `${q[0].toFixed(2)} ${q[1].toFixed(2)}`; };
  const oLarge = (a1 - bo) - (a0 + bo) > Math.PI ? 1 : 0;
  const iLarge = (a1 - bi) - (a0 + bi) > Math.PI ? 1 : 0;
  let d = `M ${P(doR * Math.cos(bo), a0)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(ro, a0 + bo)}`;
  d += ` A ${ro} ${ro} 0 ${oLarge} 1 ${P(ro, a1 - bo)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(doR * Math.cos(bo), a1)}`;
  d += ` L ${P(diR * Math.cos(bi), a1)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(ri, a1 - bi)}`;
  d += ` A ${ri} ${ri} 0 ${iLarge} 0 ${P(ri, a0 + bi)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(diR * Math.cos(bi), a0)}`;
  d += ' Z';
  return d;
}
// Rounded pie wedge (ri=0): outer corners filleted, apex stays sharp.
function roundedPie(cx, cy, ro, a0, a1, cr) {
  const span = a1 - a0;
  if (span <= 1e-4) return '';
  const sHalf = Math.sin(Math.min(span / 2, Math.PI / 2)) * 0.96;
  cr = Math.max(0, Math.min(cr, ro * sHalf / (1 + sHalf)));
  const doR = ro - cr;
  const bo = Math.min(Math.asin(Math.min(1, cr / Math.max(1e-3, doR))), span / 2);
  const P = (rr, aa) => { const q = rpolar(cx, cy, rr, aa); return `${q[0].toFixed(2)} ${q[1].toFixed(2)}`; };
  const oLarge = (a1 - bo) - (a0 + bo) > Math.PI ? 1 : 0;
  let d = `M ${cx.toFixed(2)} ${cy.toFixed(2)}`;
  d += ` L ${P(doR * Math.cos(bo), a0)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(ro, a0 + bo)}`;
  d += ` A ${ro} ${ro} 0 ${oLarge} 1 ${P(ro, a1 - bo)}`;
  d += ` A ${cr} ${cr} 0 0 1 ${P(doR * Math.cos(bo), a1)}`;
  d += ' Z';
  return d;
}

function PieDonut({ segs, p, donut }) {
  const uid = React.useId().replace(/:/g, '');
  const total = segs.reduce((s, x) => s + x.value, 0);
  const cx = 230, cy = 230, rO = 192, rI = donut ? 116 : 0, GROW = 14;
  const cr = Math.max(0, Math.min(40, p.cornerRadius ?? 14));
  const padRad = (Math.max(0, Math.min(8, p.paddingAngle ?? 3)) * Math.PI) / 180;
  let a = -Math.PI / 2;
  const slices = segs.map((s, i) => {
    const frac = s.value / total;
    const a0 = a, a1 = a + frac * Math.PI * 2; a = a1;
    const gap = Math.min(padRad, (a1 - a0) * 0.6) / 2;
    return { ...s, i, frac, pa0: a0 + gap, pa1: a1 - gap };
  });
  const fi = p.highlight ? p.highlightIndex : -1;
  const focusSeg = slices.find((s) => s.i === fi) || null;
  const path = (s, ro) => donut
    ? roundedAnnular(cx, cy, rI, ro, s.pa0, s.pa1, cr)
    : roundedPie(cx, cy, ro, s.pa0, s.pa1, cr);
  return (
    <svg viewBox="0 0 460 460" style={{ width: 460, height: 460, overflow: 'visible' }}>
      <defs>
        {slices.map((s) => (
          <radialGradient key={s.i} id={`${uid}-g${s.i}`} gradientUnits="userSpaceOnUse" cx={cx} cy={cy} r={rO + GROW}>
            <stop offset={donut ? `${(rI / (rO + GROW) * 100).toFixed(0)}%` : '0%'} stopColor={mix(s.color, 0.5, true)} />
            <stop offset="62%" stopColor={mix(s.color, 0.16, true)} />
            <stop offset="100%" stopColor={mix(s.color, 0.12, false)} />
          </radialGradient>
        ))}
        <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id={`${uid}-dots`} width="15" height="15" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="rgba(90,84,140,.16)" />
        </pattern>
      </defs>

      <circle cx={cx} cy={cy} r={rO + 16} fill={`url(#${uid}-dots)`} opacity="0.6" />

      {focusSeg && (
        <path d={path(focusSeg, rO + GROW)} fill={focusSeg.color}
          filter={`url(#${uid}-glow)`} opacity={p.evil ? 0.78 : 0.5} />
      )}
      {slices.map((s) => {
        const on = s.i === fi;
        return (
          <path key={s.i} d={path(s, rO + (on ? GROW : 0))}
            fill={`url(#${uid}-g${s.i})`} opacity={fi < 0 || on ? 1 : 0.5}
            stroke={mix(s.color, 0.32, true)} strokeWidth="1.5" strokeLinejoin="round"
            style={{ transition: 'all .3s ease' }} />
        );
      })}

      {donut && p.showCenterTotal && (
        <g>
          <text x={cx} y={cy - 36} textAnchor="middle" fontSize="24" fontWeight="700" fill="#8a8b94">{p.centerLabel}</text>
          <text x={cx} y={cy + 20} textAnchor="middle" fontSize="64" fontWeight="900" fill="#2b2b30">{p.centerValue}</text>
          <text x={cx} y={cy + 52} textAnchor="middle" fontSize="24" fontWeight="700" fill="#8a8b94">{p.centerUnit}</text>
        </g>
      )}
    </svg>
  );
}

function BarsH({ segs, p }) {
  const max = Math.max(...segs.map((s) => s.value));
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 26 }}>
      {segs.map((s, i) => {
        const on = p.highlight && i === p.highlightIndex;
        const dim = p.highlight && !on;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: dim ? 0.5 : 1 }}>
            <div style={{ width: 260, textAlign: 'right', fontSize: 30, fontWeight: 700, color: 'var(--aip-ink)' }}>{s.label}</div>
            <div style={{ flex: 1, height: 52, borderRadius: 12, background: 'rgba(255,255,255,.45)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: `${(s.value / max) * 100}%`, height: '100%', borderRadius: 12,
                background: p.evil ? `${EVIL_HATCH}, linear-gradient(90deg, ${hexA(s.color, 0.95)}, ${hexA(s.color, 0.6)})` : `linear-gradient(90deg, ${hexA(s.color, 0.95)}, ${hexA(s.color, 0.6)})`,
                border: on ? `2px solid ${s.color}` : 'none',
                boxShadow: p.evil
                  ? (on ? `0 0 0 1px ${hexA(s.color, .5)}, 0 0 30px ${hexA(s.color, .5)}, 0 10px 26px ${hexA(s.color, .4)}` : `0 0 16px ${hexA(s.color, .3)}`)
                  : (on ? `0 10px 26px ${hexA(s.color, 0.4)}` : 'none'), transition: 'all .3s ease' }} />
            </div>
            <div style={{ width: 200, fontSize: 30, fontWeight: 900, color: 'var(--aip-ink)' }}>{s.value}<small style={{ fontSize: 24, color: '#8a8b94', fontWeight: 700 }}> · {s.pct}</small></div>
          </div>
        );
      })}
    </div>
  );
}

export default function Slide05Sector(props) {
  const p = { ...defaultProps, ...props };
  let segs = p.segments;
  const n = Math.max(3, Math.min(p.segments.length, p.segmentCount));
  if (n < p.segments.length) {
    const head = p.segments.slice(0, n - 1);
    const rest = p.segments.slice(n - 1);
    const sum = rest.reduce((s, x) => s + x.value, 0);
    segs = [...head, { label: '其他', en: 'Others', value: sum, pct: '—', color: '#9aa0ad' }];
  } else {
    segs = p.segments.slice(0, n);
  }

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 70, marginTop: 8 }}>
        <div style={{ flex: p.chartType === 'bar' ? 1 : '0 0 auto', display: 'flex', justifyContent: 'center' }}>
          {p.chartType === 'bar'
            ? <BarsH segs={segs} p={p} />
            : (
              <div style={{ transform: p.tiltAngle ? `perspective(1500px) rotateY(${p.tiltAngle}deg)` : 'none', transformOrigin: 'center' }}>
                <PieDonut segs={segs} p={p} donut={p.chartType === 'donut'} />
              </div>
            )}
        </div>

        {p.chartType !== 'bar' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {segs.map((s, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', borderRadius: 16,
                  background: on ? hexA(s.color, 0.12) : 'rgba(255,255,255,.4)',
                  border: `1px solid ${on ? hexA(s.color, 0.45) : 'rgba(255,255,255,.6)'}`,
                  transition: 'all .3s ease',
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: s.color, flex: '0 0 auto' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 30, fontWeight: 700, color: 'var(--aip-ink)' }}>{s.label}</div>
                    <div className="aip-en" style={{ fontSize: 24 }}>{s.en}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--aip-ink)' }}>{s.pct}</div>
                    <div style={{ fontSize: 24, color: '#8a8b94', fontWeight: 700 }}>{s.value} 亿</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
