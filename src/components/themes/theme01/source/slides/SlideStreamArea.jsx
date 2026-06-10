// SlideStreamArea.jsx — 图表页 · 流式堆叠面积图（stacked area / stream）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；样式收在
// `.aip-root` 作用域（沿用 SlideKit 主题，不污染全局，不依赖 window）。
//
// 设计：一条沿季度轴铺开的多层半透明「资金河流」——各赛道按值堆叠，层层叠加
// 显示构成随时间的此消彼长。可把其中一层提为荧光主层（提高不透明度 + 顶缘描边
// 发光 + 峰值标注）；右侧图例行可强调。各层用 theme.series 配色，渐变以 uid
// 命名，多实例同页不冲突。纯 SVG + CSS，导出 PDF / PPTX 干净。
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';
import { THEME } from './theme.js';

export const defaultProps = {
  kicker: '市场全景 · 构成演变',
  tone: 'blue',
  title: '资金河流 · 赛道构成的此消彼长',
  en: 'How the Capital Mix Shifts',
  cn: '逐季度看各赛道吸纳资金的堆叠演变',
  unit: '亿',
  // X 轴时间刻度
  periods: ['24Q1', '24Q2', '24Q3', '24Q4', '25Q1', '25Q2', '25Q3', '25Q4'],
  // 从下到上堆叠；values 与 periods 一一对应（同口径数额）
  series: [
    { label: '通用大模型', en: 'Foundation Models', values: [38, 52, 66, 88, 132, 168, 196, 240] },
    { label: 'AI 基础设施 · 算力', en: 'Infra & Compute', values: [22, 30, 41, 58, 84, 96, 118, 140] },
    { label: '具身智能 · 机器人', en: 'Embodied AI', values: [8, 11, 14, 20, 28, 34, 44, 58] },
    { label: 'AI 芯片', en: 'AI Silicon', values: [14, 16, 19, 24, 31, 36, 42, 50] },
    { label: '企业 AI 应用', en: 'Enterprise Apps', values: [10, 13, 17, 21, 26, 30, 35, 41] },
  ],
  note: '通用大模型这条「主河道」逐季拓宽，到 25Q4 已占全部增量的近半——资金正加速向最上层的基座模型汇聚。',
  // tweakable（通用命名）
  itemCount: 5,
  highlight: true,
  highlightIndex: 0,
  smooth: true,
  showDots: false,
  showGrid: true,
  showPeak: true,
  showNote: true,
  accentColor: '#5b8def',
  showCaption: true,
  caption: '流式面积图 · 基座模型这条主河道持续拓宽',
};

export const controls = [
  { key: 'itemCount', label: '赛道层数', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 层',
    description: '堆叠的赛道层数；少于总数时其余并入「其它」。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把某一层渲染成荧光主层（提亮 + 顶缘发光）。' },
  { key: 'highlightIndex', label: '强调第几层', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被强调的赛道层序号（从下往上、0 基）。' },
  { key: 'smooth', label: '平滑曲线', type: 'boolean', default: true,
    description: '层与层边界用平滑曲线（关闭则折线）。' },
  { key: 'showDots', label: '数据点', type: 'boolean', default: false,
    description: '主层顶缘各季度数据点的显示。' },
  { key: 'showGrid', label: '网格基线', type: 'boolean', default: true,
    description: '横向网格与时间刻度的显示。' },
  { key: 'showPeak', label: '峰值标注', type: 'boolean', default: true,
    description: '末期总额峰值气泡的显示。' },
  { key: 'showNote', label: '核心发现', type: 'boolean', default: true,
    description: '底部「核心发现」说明卡的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '标签、峰值与核心发现卡的主题色（不影响各层固有配色）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const PALETTE = THEME.series;

// Catmull-Rom → Bézier 平滑（开放折线）
function smoothLine(pts, smooth) {
  if (!pts.length) return '';
  if (!smooth || pts.length < 3) {
    return pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export default function SlideStreamArea(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const uid = React.useId().replace(/:/g, '');
  const periods = p.periods;
  const nP = periods.length;

  // 依 itemCount 收敛层数（多余并入「其它」）
  let raw = (p.series || []).slice();
  const n = Math.max(3, Math.min(raw.length, p.itemCount));
  let series;
  if (n >= raw.length) series = raw;
  else {
    const head = raw.slice(0, n - 1);
    const rest = raw.slice(n - 1);
    const merged = periods.map((_, k) => rest.reduce((a, s) => a + (s.values[k] || 0), 0));
    series = [...head, { label: '其它赛道', en: 'Others', values: merged }];
  }
  const focus = p.highlight ? Math.max(0, Math.min(series.length - 1, p.highlightIndex)) : -1;

  // 几何
  const W = 1240, H = 470;
  const padL = 70, padR = 28, padT = 26, padB = 52;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const x = (k) => padL + (plotW * k) / (nP - 1);

  // 逐季度堆叠总额 → Y 比例
  const totals = periods.map((_, k) => series.reduce((a, s) => a + (s.values[k] || 0), 0));
  const maxTotal = Math.max.apply(null, totals) || 1;
  const niceMax = Math.ceil(maxTotal / 100) * 100;
  const y = (v) => padT + plotH - (plotH * v) / niceMax;

  // 累计上缘（每层顶部 = 其下所有层之和），自底向上
  const cum = periods.map(() => 0);
  const layers = series.map((s, li) => {
    const top = periods.map((_, k) => { cum[k] += (s.values[k] || 0); return cum[k]; });
    const bottom = top.map((t, k) => t - (s.values[k] || 0));
    const topPts = top.map((t, k) => [x(k), y(t)]);
    const botPts = bottom.map((b, k) => [x(k), y(b)]);
    const topD = smoothLine(topPts, p.smooth);
    const botRev = smoothLine(botPts.slice().reverse(), p.smooth).replace(/^M/, 'L');
    return { ...s, li, topPts, area: `${topD} ${botRev} Z`, color: PALETTE[li % PALETTE.length] };
  });

  const gridVals = [0, niceMax / 4, niceMax / 2, (niceMax * 3) / 4, niceMax];
  const peakTotal = totals[nP - 1];

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', gap: 36, alignItems: 'stretch' }}>
        {/* 河流图 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
          border: '1px solid rgba(255,255,255,.72)', borderRadius: 28, padding: '18px 26px 12px',
          boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
            <defs>
              {layers.map((l) => (
                <linearGradient key={l.li} id={`${uid}-f${l.li}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={hexA(l.color, l.li === focus ? 0.92 : 0.6)} />
                  <stop offset="100%" stopColor={hexA(l.color, l.li === focus ? 0.5 : 0.24)} />
                </linearGradient>
              ))}
              <filter id={`${uid}-glow`} x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* 网格 + Y 刻度 */}
            {p.showGrid && gridVals.map((gv, i) => (
              <g key={i}>
                <line x1={padL} y1={y(gv)} x2={W - padR} y2={y(gv)} stroke="rgba(43,43,48,.09)" strokeWidth="1" />
                <text x={padL - 14} y={y(gv) + 7} textAnchor="end"
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fill: 'var(--aip-ink-3)' }}>{Math.round(gv)}</text>
              </g>
            ))}

            {/* 堆叠层（自底向上绘制，焦点层最后描边发光） */}
            {layers.map((l) => (
              <path key={l.li} d={l.area} fill={`url(#${uid}-f${l.li})`}
                stroke={l.li === focus ? l.color : hexA(l.color, 0.55)}
                strokeWidth={l.li === focus ? 3 : 1.25} strokeLinejoin="round"
                opacity={focus >= 0 && l.li !== focus ? 0.78 : 1} />
            ))}
            {/* 焦点层顶缘发光描边 */}
            {focus >= 0 && (
              <path d={smoothLine(layers[focus].topPts, p.smooth)} fill="none" stroke={layers[focus].color}
                strokeWidth="3.5" strokeLinecap="round" opacity="0.9" filter={`url(#${uid}-glow)`} />
            )}
            {/* 焦点层数据点 */}
            {focus >= 0 && p.showDots && layers[focus].topPts.map((pt, k) => (
              <circle key={k} cx={pt[0]} cy={pt[1]} r="5.5" fill="#fff" stroke={layers[focus].color} strokeWidth="3" />
            ))}

            {/* X 刻度 */}
            {periods.map((lab, k) => (
              <text key={k} x={x(k)} y={H - padB + 32} textAnchor="middle"
                style={{ fontFamily: "'Space Mono', monospace", fontSize: 21, fontWeight: 700,
                  fill: k === nP - 1 ? ac : 'var(--aip-ink-2)' }}>{lab}</text>
            ))}

            {/* 峰值气泡 */}
            {p.showPeak && (
              <g>
                <line x1={x(nP - 1)} y1={y(peakTotal)} x2={x(nP - 1)} y2={padT - 4}
                  stroke={hexA(ac, 0.4)} strokeWidth="1.5" strokeDasharray="4 5" />
                <g transform={`translate(${x(nP - 1) - 8}, ${padT - 6})`}>
                  <rect x={-150} y={-2} width={158} height={44} rx={11} fill={ac}
                    style={{ filter: `drop-shadow(0 10px 22px ${hexA(ac, 0.5)})` }} />
                  <text x={-71} y={26} textAnchor="middle"
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, fill: '#fff' }}>
                    {peakTotal} {p.unit}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* 图例 */}
        <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          {layers.slice().reverse().map((l) => {
            const isF = l.li === focus;
            const last = l.values[nP - 1] || 0;
            const sh = totals[nP - 1] ? Math.round((last / totals[nP - 1]) * 100) : 0;
            return (
              <div key={l.li} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 20px', borderRadius: 18,
                background: isF ? 'rgba(255,255,255,.66)' : 'rgba(255,255,255,.42)',
                border: `1px solid ${isF ? hexA(l.color, 0.45) : 'rgba(255,255,255,.62)'}`,
                boxShadow: isF ? `0 18px 42px -22px ${hexA(l.color, 0.7)}` : 'none',
                transform: isF ? 'translateX(-6px)' : 'none', transition: 'all .3s' }}>
                <span style={{ flex: '0 0 20px', width: 20, height: 20, borderRadius: 6,
                  background: `linear-gradient(150deg, ${hexA(l.color, 0.62)}, ${l.color})`,
                  boxShadow: `0 4px 10px -3px ${l.color}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--aip-ink)', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: 'var(--aip-ink-3)',
                    letterSpacing: '.03em' }}>{l.en}</div>
                </div>
                <div style={{ flex: '0 0 auto', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 25, fontWeight: 700,
                    color: isF ? l.color : 'var(--aip-ink)' }}>{last}<span style={{ fontSize: 18, color: 'var(--aip-ink-3)', marginLeft: 3 }}>{p.unit}</span></div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: 'var(--aip-ink-3)' }}>{sh}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {p.showNote && p.note && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 14, padding: '16px 26px', borderRadius: 18,
          background: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.7)',
          boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 18px 44px -28px rgba(70,72,100,.5)' }}>
          <span style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20,
            letterSpacing: '.12em', color: '#fff', background: ac, padding: '8px 16px', borderRadius: 9 }}>核心发现</span>
          <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.note}</p>
        </div>
      )}

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
