/**
 * SlideCycleWheel.jsx — 循环飞轮（关系图 · 分段圆环 + 右侧环节卡列）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 版式（v2 重设计）：左侧为分段圆环飞轮（等分扇环 + 段间旋转箭头 + 中心主题），
 * 右侧为一列与环节一一对应的说明卡（编号 / 色点 / 标题 / 说明 / 标签）。
 * 卡列采用确定性网格排布，3–5 个环节下构图均稳定，无遮挡。
 *
 * ── Props (see slideCycleWheelDefaults) ─────────────────────────────────────
 *   kicker, title, titleEm, index   strings
 *   center       {label, sub}        中心主题文案
 *   segments     Array<{label,en,desc,tags:string[]}>  环节 (text)
 *   segmentCount number   环节数量（3–5）
 *   focusEnabled boolean  高亮某一环节
 *   focusIndex   number   0-based 被强调环节
 *   showArrows   boolean  段间旋转箭头
 *   showCards    boolean  右侧环节说明卡列
 *   showTags     boolean  卡片内标签
 *   gxnScheme    object?  预览注入的配色（palette）；缺省回退主题绿
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx, GXN_PALETTE } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideCycleWheelDefaults = {
  kicker: 'FLYWHEEL · 资本飞轮',
  title: 'AI 资本飞轮 ',
  titleEm: '三段循环',
  index: '16 / 27',
  center: { label: '资本飞轮', sub: 'FLYWHEEL' },
  segments: [
    { label: '资本涌入', en: 'CAPITAL', desc: '970 亿美元注入头部，估值快速攀升。', tags: ['集中头部', '估值攀升'] },
    { label: '技术突破', en: 'BREAKTHROUGH', desc: '模型与算力加速迭代，能力边界外扩。', tags: ['模型迭代', '算力卡位'] },
    { label: '商业兑现', en: 'REVENUE', desc: '收入与客户验证价值，反哺下一轮融资。', tags: ['收入增速', '客户留存'] },
    { label: '生态绑定', en: 'ECOSYSTEM', desc: '平台与开发者生态形成网络效应，抬高迁移成本。', tags: ['平台绑定', '网络效应'] },
    { label: '人才虹吸', en: 'TALENT', desc: '头部吸纳顶尖研究者与团队，强化技术领先。', tags: ['顶尖团队', '技术领先'] },
  ],
  segmentCount: 3,
  focusEnabled: true,
  focusIndex: 2,
  showArrows: true,
  showCards: true,
  showTags: true,
};

export const slideCycleWheelControls = [
  { key: 'segmentCount', type: 'number', label: '环节数量', default: 3, min: 3, max: 5, step: 1,
    maxFrom: (p) => (p.segments ? p.segments.length : 3), describe: '飞轮环节数量（角度自适应：3→120°、4→90°、5→72°）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一个环节' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 2, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.segmentCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调环节的序号' },
  { key: 'showArrows', type: 'toggle', label: '旋转箭头', default: true,
    describe: '段间旋转箭头显隐' },
  { key: 'showCards', type: 'toggle', label: '说明卡片', default: true,
    describe: '右侧环节说明卡列显隐' },
  { key: 'showTags', type: 'toggle', label: '卡片标签', default: true,
    visibleWhen: (p) => p.showCards, describe: '卡片内标签显隐' },
];

export function SlideCycleWheel(props) {
  const p = { ...slideCycleWheelDefaults, ...props };
  const count = Math.max(3, Math.min(p.segments.length, p.segmentCount));
  const segs = p.segments.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;
  const colorOf = (i) => palette[i % palette.length];

  // ── SVG ring geometry — clean segmented donut ─────────────────────────────
  // Equal arcs of 360/count° drawn as FILLED rounded annular sectors with a
  // tight inter-slice gap; a clockwise chevron sits in each gap so the ring
  // reads as a spinning flywheel.
  const S = 640, C = S / 2, ro = 264, ri = 158;
  const Rc = (ro + ri) / 2;              // centerline radius — labels + chevrons
  const start = -Math.PI / 2;            // first segment starts at top
  const span = (Math.PI * 2) / count;
  const GAPA = 0.055;                    // angular gap per side (radians)
  const CR = 24;                         // corner radius (gently rounded)
  const PT = (r, a) => [C + r * Math.sin(a), C - r * Math.cos(a)];
  const f2 = (xy) => `${xy[0].toFixed(2)},${xy[1].toFixed(2)}`;
  const sector = (a0, a1) => {
    const A0 = a0 + GAPA, A1 = a1 - GAPA;
    const spanT = A1 - A0;
    if (spanT <= 0.002) return '';
    const cr = Math.min(CR, spanT * ri * 0.44, (ro - ri) * 0.46);
    const dao = cr / ro, dai = cr / ri;
    const large = spanT > Math.PI ? 1 : 0;
    return [
      `M ${f2(PT(ro, A0 + dao))}`,
      `A ${ro} ${ro} 0 ${large} 1 ${f2(PT(ro, A1 - dao))}`,
      `Q ${f2(PT(ro, A1))} ${f2(PT(ro - cr, A1))}`,
      `L ${f2(PT(ri + cr, A1))}`,
      `Q ${f2(PT(ri, A1))} ${f2(PT(ri, A1 - dai))}`,
      `A ${ri} ${ri} 0 ${large} 0 ${f2(PT(ri, A0 + dai))}`,
      `Q ${f2(PT(ri, A0))} ${f2(PT(ri + cr, A0))}`,
      `L ${f2(PT(ro - cr, A0))}`,
      `Q ${f2(PT(ro, A0))} ${f2(PT(ro, A0 + dao))}`,
      'Z',
    ].join(' ');
  };
  const segGeom = segs.map((s, i) => {
    const a0 = start + i * span;
    const a1 = start + (i + 1) * span;
    return { ...s, i, a0, a1, mid: (a0 + a1) / 2, bound: a1 };
  });

  const wheelSize = p.showCards ? 620 : 700;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 28, minHeight: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 72 }}>

          {/* wheel */}
          <div style={{ flex: p.showCards ? '0 0 auto' : '0 0 auto', display: 'flex',
            alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <svg viewBox={`0 0 ${S} ${S}`} style={{ width: wheelSize, height: wheelSize, overflow: 'visible' }}>
              <defs>
                <filter id="gxn-cw-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {/* faint orbit guide behind the ring */}
              <circle cx={C} cy={C} r={ro + 26} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="2 8" />
              {segGeom.map((s) => {
                const col = colorOf(s.i);
                const isF = s.i === fIdx; const dim = fIdx >= 0 && !isF;
                const lab = PT(Rc, s.mid);
                const out = PT(ro + 44, s.mid);
                const side = Math.sin(s.mid); // >0 right, <0 left
                const anchor = Math.abs(side) < 0.35 ? 'middle' : (side > 0 ? 'start' : 'end');
                return (
                  <g key={s.i} opacity={dim ? 0.4 : 1} style={{ transition: 'opacity .3s ease' }}>
                    <path d={sector(s.a0, s.a1)} fill={col} filter={isF ? 'url(#gxn-cw-glow)' : undefined} />
                    {/* number inside the band — always fits, any angle */}
                    <text x={lab[0]} y={lab[1]} textAnchor="middle" dominantBaseline="central"
                          fontFamily="'Space Mono',monospace" fontWeight="700" fontSize="34"
                          fill="#07090b">{String(s.i + 1).padStart(2, '0')}</text>
                    {/* callout labels outside the ring — only when the card rail is hidden */}
                    {!p.showCards && (
                      <g>
                        <text x={out[0]} y={out[1] - (Math.abs(side) < 0.35 ? (PT(1, s.mid)[1] < C ? 14 : -2) : 10)}
                              textAnchor={anchor} dominantBaseline="central"
                              fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="30" fill="#eef3f1">{s.label}</text>
                        <text x={out[0]} y={out[1] + (Math.abs(side) < 0.35 ? (PT(1, s.mid)[1] < C ? 44 : 28) : 20)}
                              textAnchor={anchor} dominantBaseline="central"
                              fontFamily="'Space Mono',monospace" fontSize="16" fill={col} letterSpacing="1">{s.en}</text>
                      </g>
                    )}
                  </g>
                );
              })}
              {/* clockwise chevron in each gap — keeps the flywheel rotation read */}
              {p.showArrows && segGeom.map((s) => {
                const ab = s.bound;
                const M = PT(Rc, ab);
                const t = [Math.cos(ab), Math.sin(ab)];   // clockwise tangent
                const n = [Math.sin(ab), -Math.cos(ab)];  // outward radial
                const tip = [M[0] + t[0] * 9, M[1] + t[1] * 9];
                const bk = [M[0] - t[0] * 6, M[1] - t[1] * 6];
                const w = 8.5;
                const t1 = [bk[0] + n[0] * w, bk[1] + n[1] * w];
                const t2 = [bk[0] - n[0] * w, bk[1] - n[1] * w];
                return <polyline key={s.i} points={`${f2(t1)} ${f2(tip)} ${f2(t2)}`}
                                 fill="none" stroke="rgba(var(--gxn-glow),0.9)" strokeWidth="4"
                                 strokeLinecap="round" strokeLinejoin="round" opacity={fIdx >= 0 ? 0.7 : 1} />;
              })}
              {/* center hub */}
              <circle cx={C} cy={C} r={ri - 18} fill="#0a0d10" stroke="rgba(var(--gxn-glow),0.55)" strokeWidth="2" />
              <circle cx={C} cy={C} r={ri - 30} fill="none" stroke="rgba(var(--gxn-glow),0.18)" strokeWidth="1" strokeDasharray="3 6" />
              <text x={C} y={C - 8} textAnchor="middle" dominantBaseline="central"
                    fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="40" fill="#eef3f1">{p.center.label}</text>
              <text x={C} y={C + 34} textAnchor="middle" dominantBaseline="central"
                    fontFamily="'Space Mono',monospace" fontSize="20" fill="var(--gxn-accent)" letterSpacing="2">{p.center.sub}</text>
            </svg>
          </div>

          {/* segment card rail — deterministic vertical stack, no overlap */}
          {p.showCards && (
            <div style={{ flex: '0 1 720px', maxWidth: 720, alignSelf: 'stretch', minHeight: 0,
              display: 'grid', gridTemplateRows: `repeat(${count}, 1fr)`, gap: 18 }}>
              {segGeom.map((s) => {
                const isF = s.i === fIdx; const dim = fIdx >= 0 && !isF;
                const col = colorOf(s.i);
                return (
                  <div key={s.i} className={cx('gxn-panel', isF && 'is-focus')} style={{
                    display: 'flex', alignItems: 'center', gap: 26, padding: '0 32px', minHeight: 0,
                    opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease',
                  }}>
                    <span className="gxn-num" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1,
                      color: isF ? col : 'var(--gxn-faint)', flex: '0 0 auto',
                      textShadow: isF ? `0 0 22px ${col}` : 'none' }}>{String(s.i + 1).padStart(2, '0')}</span>
                    <span style={{ width: 3, alignSelf: 'stretch', margin: '16px 0', borderRadius: 2,
                      background: `linear-gradient(180deg, ${col}, transparent)`, flex: '0 0 auto' }} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
                      <span style={{ display: 'flex', alignItems: 'baseline', gap: 14, minWidth: 0 }}>
                        <span style={{ fontSize: 29, fontWeight: 700, color: 'var(--gxn-text)', whiteSpace: 'nowrap' }}>{s.label}</span>
                        <span className="gxn-mono" style={{ fontSize: 17, letterSpacing: '.08em', color: col,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.en}</span>
                      </span>
                      <span style={{ fontSize: 22, lineHeight: 1.4, color: 'var(--gxn-dim)' }}>{s.desc}</span>
                    </span>
                    {p.showTags && s.tags && s.tags.length > 0 && (
                      <span style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '0 0 auto', alignItems: 'flex-start' }}>
                        {s.tags.map((t, k) => (
                          <span key={k} className="gxn-mono" style={{ fontSize: 18, color: 'var(--gxn-accent)', padding: '4px 12px',
                            borderRadius: 999, border: '1px solid rgba(var(--gxn-glow),0.35)', background: 'rgba(var(--gxn-glow),0.05)',
                            whiteSpace: 'nowrap' }}>{t}</span>
                        ))}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideCycleWheel;
