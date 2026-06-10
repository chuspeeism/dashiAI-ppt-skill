/**
 * SlideVenn.jsx — 维恩图（关系页 · 集合交叠）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 维恩图：2–3 个半透明发光圆代表稀缺要素，叠加处自然加亮 = 交集；三圆共有的中心节点
 * 即「赢家护城河」。圆外标注要素名，两两叠加处标注配对意义。内联 SVG，仅依赖 props。
 *
 * ── Props (see slideVennDefaults) ───────────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   sets         Array<{label, sub}>   集合（2–3 个）
 *   pairs        Array<{label}>        两两交集说明（3 圆时为 3 个，2 圆时为 1 个）
 *   centerLabel, centerSub  string     中心交集（核心结论）
 *   setCount     number   集合数量（2–3）
 *   focusEnabled boolean  辉光强调某一集合（其余淡出）
 *   focusIndex   number   0-based 被强调集合
 *   showPairs    boolean  两两交集说明显隐
 *   showCenter   boolean  中心交集节点显隐
 *   showSub      boolean  集合副标题显隐
 *   gxnScheme    object?  { palette, accent, glow }
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideVennDefaults = {
  kicker: 'VENN · 赢家方程式',
  title: '稀缺要素的 ',
  titleEm: '交集',
  lead: '算力、数据、顶尖人才——单点优势已不足以胜出。真正拉开差距的，是同时握住三者的那一小撮交集。',
  sets: [
    { label: '算力', sub: '万卡级训练集群' },
    { label: '数据', sub: '高质量 + 专有语料' },
    { label: '顶尖人才', sub: '前沿研究与对齐' },
  ],
  pairs: [
    { label: '规模化预训练' },   // 算力 ∩ 数据
    { label: '对齐与精调' },     // 数据 ∩ 人才
    { label: '前沿研究突破' },   // 算力 ∩ 人才
  ],
  centerLabel: '头部护城河',
  centerSub: '三者俱备者寥寥可数',
  setCount: 3,
  focusEnabled: false,
  focusIndex: 0,
  showPairs: true,
  showCenter: true,
  showSub: true,
};

export const slideVennControls = [
  { key: 'setCount', type: 'number', label: '集合数量', default: 3, min: 2, max: 3, step: 1,
    maxFrom: (p) => Math.min(3, p.sets ? p.sets.length : 3), describe: '维恩图集合数量（2–3）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '辉光强调某一集合（其余淡出）' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.setCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调集合的序号' },
  { key: 'showPairs', type: 'toggle', label: '配对交集', default: true, describe: '两两交集说明显隐' },
  { key: 'showCenter', type: 'toggle', label: '中心交集', default: true, describe: '中心交集节点显隐' },
  { key: 'showSub', type: 'toggle', label: '要素副标题', default: true, describe: '集合副标题显隐' },
];

function Venn({ sets, pairs, centerLabel, centerSub, fIdx, showPairs, showCenter, showSub, palette, accent, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const W = 760, H = 680, cx = W / 2;
  const n = sets.length;
  const focused = fIdx >= 0;

  // circle centres + geometry. Tuned so labels sit inside a padded viewBox
  // and the pairwise lenses are clear of the central node.
  let centres, R, cd, cy, cr;
  if (n === 2) {
    cy = 356; R = 190; cd = 110; cr = 68;
    centres = [[cx - cd, cy], [cx + cd, cy]];
  } else {
    cy = 356; R = 162; cd = 120; cr = 56;
    centres = [
      [cx, cy - cd],                                   // top
      [cx - cd * 0.866, cy + cd * 0.5],                // bottom-left
      [cx + cd * 0.866, cy + cd * 0.5],                // bottom-right
    ];
  }

  // outward label anchor for each set (just beyond circle edge, radial from centroid)
  const labelPos = centres.map(([x, y]) => {
    const dx = x - cx, dy = y - cy;
    const m = Math.hypot(dx, dy) || 1;
    return { x: x + (dx / m) * (R + 4), y: y + (dy / m) * (R + 4), above: dy < -1 };
  });

  // pairwise intersection labels: start at the midpoint of the two centres, then
  // push OUTWARD (away from centroid) into the two-way-only lens so the central
  // node never covers them.
  const pairIdx = n === 2 ? [[0, 1]] : [[0, 1], [1, 2], [0, 2]];
  const pairMid = pairIdx.map(([a, b]) => {
    let mx = (centres[a][0] + centres[b][0]) / 2;
    let my = (centres[a][1] + centres[b][1]) / 2;
    if (n === 2) {
      // single lens == centre; drop it below the central node
      return [cx, cy + cr + 38];
    }
    const dx = mx - cx, dy = my - cy, m = Math.hypot(dx, dy) || 1;
    const push = 60;
    return [mx + (dx / m) * push, my + (dy / m) * push];
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={`${uid}-g`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g style={{ mixBlendMode: 'screen' }}>
        {centres.map(([x, y], i) => {
          const c = palette[i % palette.length];
          const isF = i === fIdx; const dim = focused && !isF;
          return (
            <circle key={i} cx={x} cy={y} r={R} fill={c}
                    fillOpacity={dim ? 0.06 : (isF ? 0.24 : 0.15)}
                    stroke={c} strokeWidth={isF ? 4 : 2.5}
                    strokeOpacity={dim ? 0.35 : 1}
                    filter={(isF || !focused) ? `url(#${uid}-g)` : undefined} />
          );
        })}
      </g>

      {/* pairwise intersection labels (drawn before centre node, but live in their own lens) */}
      {showPairs && pairMid.map(([x, y], i) => (
        <text key={`p${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Noto Sans SC',sans-serif" fontWeight="500" fontSize="20"
              fill="rgba(238,243,241,0.72)">{pairs[i] ? pairs[i].label : ''}</text>
      ))}

      {/* set labels (outside) — stacked away from the circle so nothing clips the viewBox */}
      {sets.map((s, i) => {
        const { x: lx, y: ly, above } = labelPos[i];
        const isF = i === fIdx; const dim = focused && !isF;
        const c = palette[i % palette.length];
        // above: stack upward (title then sub, both above anchor); below: stack downward
        const titleY = above ? ly - (showSub && s.sub ? 30 : 8) : ly + 30;
        const subY = above ? ly - 6 : ly + 56;
        return (
          <g key={`l${i}`} opacity={dim ? 0.4 : 1}>
            <text x={lx} y={titleY} textAnchor="middle"
                  fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="34"
                  fill={isF ? c : '#eef3f1'}>{s.label}</text>
            {showSub && s.sub && (
              <text x={lx} y={subY} textAnchor="middle"
                    fontFamily="'Space Mono',monospace" fontSize="20" fill="rgba(238,243,241,0.55)">
                {s.sub}</text>
            )}
          </g>
        );
      })}

      {/* centre (full intersection) */}
      {showCenter && (
        <g filter={`url(#${uid}-g)`}>
          <circle cx={cx} cy={cy} r={cr}
                  fill="rgba(7,9,11,0.82)" stroke={accent} strokeWidth="2.5" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Noto Sans SC',sans-serif" fontWeight="700" fontSize="25" fill={accent}
                style={{ filter: 'none' }}>{centerLabel}</text>
        </g>
      )}
    </svg>
  );
}

export function SlideVenn(props) {
  const p = { ...slideVennDefaults, ...props };
  const sc = p.gxnScheme || {};
  const palette = sc.palette || ['#2fe07f', '#4ea2ff', '#9b7dff', '#b9f24a', '#2fe0c4', '#ff6fae', '#ffc24a'];
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';

  const count = Math.max(2, Math.min(3, p.sets.length, p.setCount));
  const sets = p.sets.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '07 / 40'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1240 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 8, minHeight: 0, display: 'grid',
          gridTemplateColumns: '1.12fr 0.88fr', gap: 56, alignItems: 'center' }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Venn sets={sets} pairs={p.pairs} centerLabel={p.centerLabel} centerSub={p.centerSub} fIdx={fIdx}
                  showPairs={p.showPairs} showCenter={p.showCenter} showSub={p.showSub}
                  palette={palette} accent={accent} glow={glow} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
            {p.showCenter && (
              <div className={cx('gxn-panel', fIdx < 0 && 'is-focus')}
                   style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-accent)', letterSpacing: '0.06em' }}>
                  ▲ 三者交集
                </span>
                <span className={cx('gxn-num', fIdx < 0 && 'gxn-aurora-num')} style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.1,
                  color: 'var(--gxn-accent)' }}>{p.centerLabel}</span>
                <span style={{ fontSize: 25, color: 'var(--gxn-dim)', lineHeight: 1.5 }}>{p.centerSub}</span>
              </div>
            )}
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sets.map((s, i) => {
                const isF = i === fIdx; const dim = fIdx >= 0 && !isF;
                const c = palette[i % palette.length];
                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16,
                    opacity: dim ? 0.5 : 1, transition: 'opacity .3s' }}>
                    <span className="gxn-dot" style={{ color: c, background: c, marginTop: 8 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span style={{ fontSize: 30, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)' }}>{s.label}</span>
                      {p.showSub && s.sub && (
                        <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)' }}>{s.sub}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="gxn-rise-3" style={{ marginTop: 14 }}>
          <span style={{ fontSize: 26, color: 'var(--gxn-dim)' }}>
            ↳ 叠加越多，越是稀缺——资本愿为「三者俱备」的极少数公司支付溢价
          </span>
        </div>
      </div>
    </div>
  );
}

export default SlideVenn;
