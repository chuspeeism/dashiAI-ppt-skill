// SlideWaterfall.jsx — 资金瀑布 / build-up waterfall of total funding by track.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Each track contributes a *floating* bar that stacks on the running cumulative;
// dashed connectors carry the total from one step to the next, and a final solid
// "合计" column lands at the full height. Hand-rolled SVG (gradients, rounded
// tops, connectors, in-SVG CN labels) inside the frosted-glass + bokeh system —
// no recharts, exports cleanly. Step count / highlight / connectors / running
// total readout / accent are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '市场全景 · 资金构成',
  tone: 'green',
  title: '资金如何累积成 937 亿',
  en: 'Funding Build-Up · Waterfall',
  cn: '逐赛道叠加，看清这一年的钱从哪儿堆出来',
  steps: [
    { label: '通用大模型', value: 420 },
    { label: 'AI 基础设施', value: 248 },
    { label: '垂直应用', value: 122 },
    { label: 'AI 硬件 · 机器人', value: 76 },
    { label: '企业 AI 服务', value: 71 },
  ],
  totalLabel: '全年合计',
  unit: '亿',
  runLabel: '累计达成',
  caption: '瀑布图 · 通用大模型一项即贡献近半，奠定全年基本盘',
  // tweakable (universal names)
  itemCount: 5,
  highlight: true,
  showConnectors: true,
  showRun: true,
  showGrid: true,
  accentColor: '#46b083',
  totalColor: '#2b2b30',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '赛道步数', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 步',
    description: '参与叠加的赛道（瀑布步骤）数量，末尾自动追加「合计」列。' },
  { key: 'highlight', label: '高亮最大项', type: 'boolean', default: true,
    description: '是否把贡献最大的赛道渲染成强调色。' },
  { key: 'showConnectors', label: '连接虚线', type: 'boolean', default: true,
    description: '步骤之间承接累计高度的虚线连接。' },
  { key: 'showRun', label: '累计读数', type: 'boolean', default: true,
    description: '每根浮动柱上方的「累计达成」小读数。' },
  { key: 'showGrid', label: '横向网格', type: 'boolean', default: true,
    description: '绘图区横向参考线的显示。' },
  { key: 'accentColor', label: '赛道色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#7a5ae0', '#e8503a'],
    description: '浮动赛道柱的渐变主题色。' },
  { key: 'totalColor', label: '合计柱色', type: 'color', default: '#2b2b30',
    options: ['#2b2b30', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0', '#e8503a'],
    description: '末尾「合计」实心柱的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function darken(hex, amt) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  return `rgb(${Math.round(((n >> 16) & 255) * (1 - amt))},${Math.round(((n >> 8) & 255) * (1 - amt))},${Math.round((n & 255) * (1 - amt))})`;
}

export default function SlideWaterfall(props) {
  const p = { ...defaultProps, ...props };
  const rid = (React.useId ? React.useId() : 'wf').replace(/:/g, '');
  const steps = p.steps.slice(0, Math.max(3, Math.min(5, p.itemCount)));
  const total = steps.reduce((a, s) => a + s.value, 0);
  const maxV = Math.max.apply(null, steps.map((s) => s.value));

  const VB_W = 1560, VB_H = 600;
  const baseline = 500, plotTop = 40, plotH = baseline - plotTop;
  const maxDomain = total * 1.06;
  const cols = steps.length + 1;            // + total column
  const slot = VB_W / cols;
  const barW = Math.min(slot * 0.5, 168);
  const Y = (v) => baseline - (v / maxDomain) * plotH;
  const ac = p.accentColor;
  const acD = darken(ac, 0.18);

  // cumulative geometry
  let run = 0;
  const segs = steps.map((s) => {
    const start = run; run += s.value;
    return { ...s, start, end: run, cum: run };
  });

  const gridVals = [0.25, 0.5, 0.75, 1].map((g) => Math.round(maxDomain * g / 10) * 10);

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '30px 40px 24px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* header readout */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, paddingBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, background: ac, boxShadow: `0 0 16px ${hexA(ac, 0.7)}` }} />
            <span style={{ fontSize: 30, fontWeight: 800, color: 'var(--aip-ink-2)' }}>逐赛道叠加 · 累计构成</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, color: 'var(--aip-ink-3)' }}>{p.totalLabel}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 64, fontWeight: 700, letterSpacing: '-.03em', color: 'var(--aip-ink)' }}>{total}</span>
            <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{p.unit}</span>
          </div>
        </div>

        {/* plot */}
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMax meet"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <linearGradient id={`${rid}-bar`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ac} stopOpacity="1" />
                <stop offset="100%" stopColor={ac} stopOpacity="0.72" />
              </linearGradient>
              <linearGradient id={`${rid}-bar-hi`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={darken(ac, 0.06)} stopOpacity="1" />
                <stop offset="100%" stopColor={acD} stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id={`${rid}-total`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={p.totalColor} stopOpacity="1" />
                <stop offset="100%" stopColor={p.totalColor} stopOpacity="0.78" />
              </linearGradient>
            </defs>

            {/* gridlines */}
            {p.showGrid && gridVals.map((gv, i) => (
              <g key={i}>
                <line x1={6} y1={Y(gv)} x2={VB_W - 6} y2={Y(gv)} stroke={hexA('#5a5a70', 0.12)} strokeWidth="1.4" strokeDasharray="2 8" />
                <text x={2} y={Y(gv) - 8} fontFamily="'Space Mono', monospace" fontSize="17" fill={hexA('#5a5a70', 0.5)}>{gv}</text>
              </g>
            ))}
            <line x1={6} y1={baseline} x2={VB_W - 6} y2={baseline} stroke="rgba(90,90,112,.3)" strokeWidth="2" />

            {/* floating bars */}
            {segs.map((s, i) => {
              const on = p.highlight && s.value === maxV;
              const cx = (i + 0.5) * slot;
              const x = cx - barW / 2;
              const yTop = Y(s.end), yBot = Y(s.start);
              const h = yBot - yTop;
              const nextCx = (i + 1 + 0.5) * slot;
              return (
                <g key={i}>
                  {/* connector to next column's running base */}
                  {p.showConnectors && (
                    <line x1={x + barW} y1={yTop} x2={i === segs.length - 1 ? nextCx + barW / 2 : nextCx - barW / 2} y2={yTop}
                      stroke={hexA('#5a5a70', 0.5)} strokeWidth="2" strokeDasharray="6 6" />
                  )}
                  <rect x={x} y={yTop} width={barW} height={Math.max(h, 3)} rx={10} ry={10}
                    fill={on ? `url(#${rid}-bar-hi)` : `url(#${rid}-bar)`} />
                  <rect x={x} y={yTop} width={barW} height={4} rx={2} fill="rgba(255,255,255,.6)" />
                  {/* +value */}
                  <text x={cx} y={yTop - 16} textAnchor="middle" fontFamily="'Space Mono', monospace"
                    fontWeight="700" fontSize={on ? 42 : 36} fill={on ? acD : '#2b2b30'}>{'+' + s.value}</text>
                  {/* running cumulative */}
                  {p.showRun && (
                    <text x={cx} y={baseline + 78} textAnchor="middle" fontFamily="'Space Mono', monospace"
                      fontSize="20" fill={hexA('#5a5a70', 0.7)}>{'Σ ' + s.cum}</text>
                  )}
                  {/* category */}
                  <text x={cx} y={baseline + 42} textAnchor="middle" fontFamily="'Noto Sans SC', system-ui, sans-serif"
                    fontWeight="900" fontSize="27" fill={on ? acD : '#2b2b30'}>{s.label}</text>
                </g>
              );
            })}

            {/* total column */}
            {(() => {
              const i = segs.length;
              const cx = (i + 0.5) * slot;
              const x = cx - barW / 2;
              const yTop = Y(total);
              return (
                <g>
                  <rect x={x} y={yTop} width={barW} height={baseline - yTop} rx={10} ry={10} fill={`url(#${rid}-total)`} />
                  <rect x={x} y={yTop} width={barW} height={4} rx={2} fill="rgba(255,255,255,.5)" />
                  <text x={cx} y={yTop - 16} textAnchor="middle" fontFamily="'Space Mono', monospace"
                    fontWeight="700" fontSize="46" fill={p.totalColor}>{total}</text>
                  <text x={cx} y={baseline + 42} textAnchor="middle" fontFamily="'Noto Sans SC', system-ui, sans-serif"
                    fontWeight="900" fontSize="27" fill={p.totalColor}>{p.totalLabel}</text>
                  {p.showRun && (
                    <text x={cx} y={baseline + 78} textAnchor="middle" fontFamily="'Space Mono', monospace"
                      fontSize="20" fill={hexA('#5a5a70', 0.7)}>{p.runLabel}</text>
                  )}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
