/**
 * SlideCycleWheel.jsx — 循环飞轮（关系图 · 环形循环 + 两翼说明）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 参考「分段环形 + 旋转箭头 + 两翼文字」逻辑板式：一个分段圆环表达循环/飞轮，
 * 中心为主题，每段一个环节，对应的说明卡片沿该段方向外侧排布。
 *
 * ── Props (see slideCycleWheelDefaults) ─────────────────────────────────────
 *   kicker, title, titleEm, index   strings
 *   center       {label, sub}        中心主题文案
 *   segments     Array<{label,en,desc,tags:string[]}>  环节 (text)
 *   segmentCount number   环节数量（3–4）
 *   focusEnabled boolean  高亮某一环节
 *   focusIndex   number   0-based 被强调环节
 *   showArrows   boolean  段间旋转箭头
 *   showCards    boolean  两翼说明卡片
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
    describe: '两翼说明卡片显隐' },
  { key: 'showTags', type: 'toggle', label: '卡片标签', default: true,
    visibleWhen: (p) => p.showCards, describe: '卡片内标签显隐' },
];

export function SlideCycleWheel(props) {
  const p = { ...slideCycleWheelDefaults, ...props };
  const count = Math.max(3, Math.min(p.segments.length, p.segmentCount));
  const segs = p.segments.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;

  // ── SVG ring geometry — clean segmented donut (à la bklit-UI ring chart) ──
  // Equal arcs of 360/count° (120° at 3, 90° at 4, 72° at 5 …) drawn as FILLED
  // rounded annular sectors with a tight inter-slice gap — the same technique as
  // the deck's ShareChart donut. A small clockwise chevron sits in each gap so
  // the ring still reads as a spinning flywheel.
  const S = 600, C = S / 2, ro = 250, ri = 150;
  const Rc = (ro + ri) / 2;              // centerline radius — labels + chevrons
  const Rl = Rc;
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

  const cxp = 50, cyp = 53, rCardX = 33, rCardY = 36;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ position: 'relative', flex: 1, marginTop: 8, minHeight: 0 }}>
          {/* wheel */}
          <svg viewBox={`0 0 ${S} ${S}`}
               style={{ position: 'absolute', left: `${cxp}%`, top: `${cyp}%`, transform: 'translate(-50%,-50%)',
                        width: 'min(560px, 52vh)', height: 'min(560px, 52vh)', overflow: 'visible' }}>
            <defs>
              <filter id="gxn-cw-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {segGeom.map((s) => {
              const col = palette[s.i % palette.length];
              const isF = s.i === fIdx; const dim = fIdx >= 0 && !isF;
              const lab = PT(Rl, s.mid);
              return (
                <g key={s.i} opacity={dim ? 0.4 : 1}>
                  <path d={sector(s.a0, s.a1)} fill={col} filter={isF ? 'url(#gxn-cw-glow)' : undefined} />
                  <text x={lab[0]} y={lab[1] - 5} textAnchor="middle" dominantBaseline="central"
                        fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="30" fill="#07090b">{s.label}</text>
                  <text x={lab[0]} y={lab[1] + 24} textAnchor="middle" dominantBaseline="central"
                        fontFamily="'Space Mono',monospace" fontSize="16" fill="rgba(7,9,11,0.7)" letterSpacing="1">{s.en}</text>
                </g>
              );
            })}
            {/* clockwise chevron in each gap — keeps the flywheel rotation read */}
            {p.showArrows && segGeom.map((s) => {
              const ab = s.bound;
              const M = PT(Rc, ab);
              const t = [Math.cos(ab), Math.sin(ab)];   // clockwise tangent
              const n = [Math.sin(ab), -Math.cos(ab)];  // outward radial
              const dim = fIdx >= 0;
              const tip = [M[0] + t[0] * 9, M[1] + t[1] * 9];
              const bk = [M[0] - t[0] * 6, M[1] - t[1] * 6];
              const w = 8.5;
              const t1 = [bk[0] + n[0] * w, bk[1] + n[1] * w];
              const t2 = [bk[0] - n[0] * w, bk[1] - n[1] * w];
              return <polyline key={s.i} points={`${f2(t1)} ${f2(tip)} ${f2(t2)}`}
                               fill="none" stroke="rgba(var(--gxn-glow),0.9)" strokeWidth="4"
                               strokeLinecap="round" strokeLinejoin="round" opacity={dim ? 0.7 : 1} />;
            })}
            {/* center hub */}
            <circle cx={C} cy={C} r={ri - 18} fill="#0a0d10" stroke="rgba(var(--gxn-glow),0.55)" strokeWidth="2" />
            <text x={C} y={C - 8} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="40" fill="#eef3f1">{p.center.label}</text>
            <text x={C} y={C + 34} textAnchor="middle" dominantBaseline="central"
                  fontFamily="'Space Mono',monospace" fontSize="20" fill="var(--gxn-accent)" letterSpacing="2">{p.center.sub}</text>
          </svg>

          {/* flanking cards */}
          {p.showCards && segGeom.map((s) => {
            const cos = Math.sin(s.mid);   // x-direction on screen
            const left = cxp + rCardX * Math.sin(s.mid);
            const top = cyp - rCardY * Math.cos(s.mid);
            const isF = s.i === fIdx; const dim = fIdx >= 0 && !isF;
            const rightSide = cos >= -0.05;
            const col = palette[s.i % palette.length];
            return (
              <div key={s.i} className={cx('gxn-panel', isF && 'is-focus')} style={{
                position: 'absolute', left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)',
                width: 300, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 10,
                textAlign: rightSide ? 'left' : 'right', alignItems: rightSide ? 'flex-start' : 'flex-end',
                opacity: dim ? 0.5 : 1, transition: 'opacity .3s ease',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: rightSide ? 'row' : 'row-reverse' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 4, background: col, boxShadow: `0 0 12px -1px ${col}` }} />
                  <span style={{ fontSize: 30, fontWeight: 700, color: 'var(--gxn-text)' }}>{s.label}</span>
                </span>
                <span style={{ fontSize: 23, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{s.desc}</span>
                {p.showTags && s.tags && s.tags.length > 0 && (
                  <span style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: rightSide ? 'flex-start' : 'flex-end' }}>
                    {s.tags.map((t, k) => (
                      <span key={k} className="gxn-mono" style={{ fontSize: 20, color: 'var(--gxn-accent)', padding: '5px 13px',
                        borderRadius: 999, border: '1px solid rgba(var(--gxn-glow),0.35)', background: 'rgba(var(--gxn-glow),0.05)' }}>{t}</span>
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideCycleWheel;
