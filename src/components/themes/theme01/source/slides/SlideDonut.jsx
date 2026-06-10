// SlideDonut.jsx — 图表页 · 甜甜圈 / 饼图占比（part-to-whole 径向图）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；样式收在
// `.aip-root` 作用域（沿用 SlideKit 主题，不污染全局，不依赖 window）。
//
// 设计：左侧一枚玻璃质感圆环——donut 用圆角描边环、pie 用圆角楔形路径，高亮扇段
// 外扩并发光，环心展示合计 / 高亮占比；右侧为可强调的图例行（色块 + 中英名 +
// 数值 + 占比条）。各扇段用 theme.series 配色，多实例同页不冲突（渐变以 uid 命名）。
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';
import { THEME } from './theme.js';

export const defaultProps = {
  kicker: '市场全景 · 资金来源',
  tone: 'violet',
  title: '钱从哪里来 · 投资方类型占比',
  en: 'Capital by Investor Type',
  cn: '巨额资金背后，谁在下注',
  unit: '亿',
  // 从大到小排序；value 为同口径数额
  segments: [
    { label: '风险投资 VC', en: 'Venture Capital', value: 268 },
    { label: '企业战投 CVC', en: 'Corporate', value: 196 },
    { label: '主权 / 政府基金', en: 'Sovereign', value: 118 },
    { label: '对冲基金 / 资管', en: 'Hedge & AM', value: 84 },
    { label: '家族办公室 · 个人', en: 'Family Office', value: 42 },
  ],
  centerLabel: '资金合计',
  note: '企业战投（微软、英伟达、亚马逊）首次逼近传统 VC——巨头用资本+算力换股权，把生态绑定在自己的云上。',
  // tweakable（通用命名）
  chartType: 'donut',
  itemCount: 5,
  highlight: true,
  highlightIndex: 1,
  gapAngle: 2,
  showValues: true,
  showNote: true,
  accentColor: '#7a5ae0',
  showCaption: true,
  caption: '甜甜圈 · 企业战投逼近 VC，资本与算力深度绑定',
};

export const controls = [
  { key: 'chartType', label: '图表类型', type: 'select', default: 'donut',
    options: [{ value: 'donut', label: '甜甜圈' }, { value: 'pie', label: '饼图' }],
    description: '甜甜圈（圆环 + 环心标注）或实心饼图。' },
  { key: 'itemCount', label: '类目数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 类',
    description: '展示的类目数；少于总数时其余并入「其它」。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮某一扇段（外扩 + 发光）。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 1, min: 0, max: 4, step: 1,
    description: '被强调的类目序号（0 基）。' },
  { key: 'gapAngle', label: '扇段间隙', type: 'number', default: 2, min: 0, max: 6, step: 1, unit: '°',
    description: '相邻扇段之间的留白角度。' },
  { key: 'showValues', label: '图例数值', type: 'boolean', default: true,
    description: '图例行右侧数值与占比条的显示。' },
  { key: 'showNote', label: '核心发现', type: 'boolean', default: true,
    description: '底部「核心发现」说明卡的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '标签、环心与核心发现卡的主题色（不影响各扇段固有配色）。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const PALETTE = THEME.series; // ['#5b8def','#46b083','#e0a23a','#e8503a','#7a5ae0']

function polar(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
// 实心楔形（pie）路径
function wedge(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

export default function SlideDonut(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const uid = React.useId().replace(/:/g, '');
  const isPie = p.chartType === 'pie';

  // 依 itemCount 收敛类目
  let raw = (p.segments || []).slice();
  const n = Math.max(3, Math.min(raw.length, p.itemCount));
  let segs;
  if (n >= raw.length) segs = raw;
  else {
    const head = raw.slice(0, n - 1);
    const sum = raw.slice(n - 1).reduce((a, s) => a + s.value, 0);
    segs = [...head, { label: '其它', en: 'Others', value: sum }];
  }
  const total = segs.reduce((a, s) => a + s.value, 0);
  const focus = p.highlight ? Math.max(0, Math.min(segs.length - 1, p.highlightIndex)) : -1;

  // 几何
  const SZ = 520, cx = SZ / 2, cy = SZ / 2;
  const ROUT = 196, ringW = 54;           // 段外缘半径 / 环宽
  const R = ROUT - ringW / 2;             // 描边中线半径（整环完整收在 viewBox 内）
  const HI = 14;                          // 高亮段加宽
  const gap = (Math.max(0, Math.min(8, p.gapAngle)) * Math.PI) / 180;
  // 圆角端帽内缩：宽段按整端帽内缩（圆头正好补回、不溢出相邻段）；窄段按弧长比例
  // 内缩，保证再细的扇段也留得下一段可见圆弧，绝不塌缩消失。
  const arcPath = (r, a0, a1, w) => {
    const cap = (w / 2) / r;
    const span = a1 - a0;
    const ins = Math.min(cap, span * 0.45);   // 窄段自动减小内缩
    const s = a0 + ins, e = a1 - ins;
    const [sx, sy] = polar(cx, cy, r, s);
    const [ex, ey] = polar(cx, cy, r, e);
    const large = (e - s) > Math.PI ? 1 : 0;
    return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  };

  let a = -Math.PI / 2;
  const slices = segs.map((s, i) => {
    const frac = s.value / total;
    const a0 = a, a1 = a + frac * Math.PI * 2;
    a = a1;
    const g = Math.min(gap, (a1 - a0) * 0.5) / 2;
    return { ...s, i, frac, a0: a0 + g, a1: a1 - g, mid: (a0 + a1) / 2, color: PALETTE[i % PALETTE.length] };
  });
  const centerSeg = focus >= 0 ? slices[focus] : null;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', gap: 48, alignItems: 'center' }}>
        {/* 圆环 / 饼 */}
        <div style={{ flex: '0 0 470px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg viewBox={`0 0 ${SZ} ${SZ}`} style={{ width: 470, height: 470, overflow: 'visible' }}>
            <defs>
              {slices.map((s) => (
                <linearGradient key={s.i} id={`${uid}-g${s.i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={hexA(s.color, 0.92)} />
                  <stop offset="100%" stopColor={s.color} />
                </linearGradient>
              ))}
              <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {isPie ? (
              <>
                {centerSeg && (
                  <path d={wedge(cx, cy, ROUT + HI, centerSeg.a0, centerSeg.a1)} fill={centerSeg.color}
                    opacity="0.4" filter={`url(#${uid}-glow)`} />
                )}
                {slices.map((s) => {
                  const isF = s.i === focus;
                  return (
                    <path key={s.i} d={wedge(cx, cy, ROUT + (isF ? HI : 0), s.a0, s.a1)} fill={`url(#${uid}-g${s.i})`}
                      opacity={focus >= 0 && !isF ? 0.55 : 1} stroke="#fff" strokeWidth="3" strokeLinejoin="round"
                      style={{ transition: 'opacity .3s' }} />
                  );
                })}
              </>
            ) : (
              <>
                {/* 轨道 */}
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(43,43,48,.05)" strokeWidth={ringW} />
                {/* 发光层（仅高亮段） */}
                {centerSeg && (
                  <path d={arcPath(R, centerSeg.a0, centerSeg.a1, ringW + HI)} fill="none"
                    stroke={centerSeg.color} strokeWidth={ringW + HI} strokeLinecap="round" opacity="0.5" filter={`url(#${uid}-glow)`} />
                )}
                {/* 扇段 */}
                {slices.map((s) => {
                  const isF = s.i === focus;
                  const w = isF ? ringW + HI : ringW;
                  return (
                    <path key={s.i} d={arcPath(R, s.a0, s.a1, w)} fill="none" stroke={`url(#${uid}-g${s.i})`}
                      strokeWidth={w} strokeLinecap="round" opacity={focus >= 0 && !isF ? 0.5 : 1}
                      style={{ transition: 'opacity .3s' }} />
                  );
                })}
              </>
            )}
          </svg>

          {/* 环心 */}
          {!isPie && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 82, fontWeight: 700, lineHeight: 0.9,
                letterSpacing: '-.02em', color: centerSeg ? centerSeg.color : 'var(--aip-ink)' }}>
                {centerSeg ? Math.round(centerSeg.frac * 100) + '%' : total}
              </div>
              <div style={{ fontSize: 25, fontWeight: 800, color: 'var(--aip-ink)', marginTop: 8, whiteSpace: 'nowrap' }}>
                {centerSeg ? centerSeg.label : p.centerLabel}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 23, color: 'var(--aip-ink-3)', marginTop: 4 }}>
                {centerSeg ? `${centerSeg.value} ${p.unit}` : `${total} ${p.unit}`}
              </div>
            </div>
          )}
        </div>

        {/* 图例 */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {slices.map((s) => {
            const isF = s.i === focus;
            return (
              <div key={s.i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '13px 22px', borderRadius: 18,
                background: isF ? 'rgba(255,255,255,.62)' : 'rgba(255,255,255,.4)',
                border: `1px solid ${isF ? hexA(s.color, 0.45) : 'rgba(255,255,255,.6)'}`,
                boxShadow: isF ? `0 18px 42px -22px ${hexA(s.color, 0.7)}` : 'none',
                transform: isF ? 'translateX(8px)' : 'none', transition: 'all .3s' }}>
                <span style={{ flex: '0 0 22px', width: 22, height: 22, borderRadius: 7,
                  background: `linear-gradient(150deg, ${hexA(s.color, 0.6)}, ${s.color})`,
                  boxShadow: `0 4px 10px -3px ${s.color}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--aip-ink)' }}>{s.label}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 19, color: 'var(--aip-ink-3)', letterSpacing: '.04em' }}>{s.en}</div>
                </div>
                {p.showValues && (
                  <>
                    <div style={{ flex: '0 0 130px' }}>
                      <div style={{ height: 9, borderRadius: 5, background: 'rgba(43,43,48,.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${s.frac * 100}%`, height: '100%', borderRadius: 5,
                          background: `linear-gradient(90deg, ${hexA(s.color, 0.6)}, ${s.color})` }} />
                      </div>
                    </div>
                    <div style={{ flex: '0 0 116px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 27, fontWeight: 700, color: isF ? s.color : 'var(--aip-ink)' }}>{s.value}</span>
                      <span style={{ fontSize: 21, color: 'var(--aip-ink-3)', marginLeft: 5 }}>{p.unit}</span>
                    </div>
                    <div style={{ flex: '0 0 74px', textAlign: 'right', fontFamily: "'Space Mono', monospace",
                      fontSize: 24, fontWeight: 700, color: isF ? s.color : 'var(--aip-ink-2)' }}>{(s.frac * 100).toFixed(0)}%</div>
                  </>
                )}
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
