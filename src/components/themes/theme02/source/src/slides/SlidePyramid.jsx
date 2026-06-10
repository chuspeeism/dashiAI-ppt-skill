/**
 * SlidePyramid.jsx — 优先级金字塔（概念图页 · 3D 玻璃金字塔）.
 * Independent, prop-driven. Renders its own theme styles + inline SVG.
 *
 * A 3D extruded "glass" pyramid (front / right / top faces with depth), tinted
 * to the deck accent scheme, paired with an aligned description column. Tiers
 * run apex → base in `tiers`; the base is numbered 01 (foundation convention).
 * One tier can be emphasised (brighter rim + glow, others dim). Tier count and
 * the description column are tunable.
 *
 * The 3D pyramid treatment is adapted from a parametric glass-pyramid diagram
 * (depth-extruded layered prism with per-face gradients + ground glow).
 *
 * ── Props (see slidePyramidDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, lead       strings
 *   tiers        Array<{tag,title,desc}>  apex → base
 *   tierCount    number   how many tiers (slices `tiers`)
 *   focusEnabled boolean  emphasise one tier
 *   focusIndex   number   0-based tier to emphasise (apex = 0)
 *   showDesc     boolean  show the description column
 *   showNumbers  boolean  show the 01/02… index on each layer face
 *   showLead     boolean  show/hide the intro lead line
 *   gxnScheme    object   deck color scheme (accent / glow)
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

/* ── colour helpers (module-scoped, no globals) ── */
function _hex(c) {
  c = String(c).replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16));
}
function _toHex(rgb) {
  return '#' + rgb.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function lerpColor(a, b, t) { const A = _hex(a), B = _hex(b); return _toHex(A.map((v, i) => v + (B[i] - v) * t)); }
const lighten = (c, t) => lerpColor(c, '#ffffff', t);
const darken = (c, t) => lerpColor(c, '#000000', t);

export const slidePyramidDefaults = {
  kicker: 'OUTLOOK · 投资优先级',
  title: '可兑现性 ',
  titleEm: '分层金字塔',
  lead: '按兑现确定性自下而上堆叠：塔基越稳，收入越可见、确定性越强；越向塔尖，潜力越大但兑现周期越长。',
  tiers: [
    { tag: '长线', title: '具身智能', desc: '人形机器人、自动驾驶等硬科技，潜力最大但兑现周期最长。' },
    { tag: '进阶', title: '垂直应用', desc: '已验证 PMF、商业模式清晰的细分赛道，如企业搜索、法律 AI。' },
    { tag: '优先', title: '基础设施中游', desc: '数据标注、向量数据库等「卖铲子」环节，需求确定、收入可见。' },
  ],
  tierCount: 3,
  focusEnabled: false,
  focusIndex: 0,
  showDesc: true,
  showNumbers: true,
  showLead: true,
  faceTexture: 'gloss',
  gxnScheme: {},
};

export const slidePyramidControls = [
  { key: 'tierCount', type: 'number', label: '层级数量', default: 3, min: 2, step: 1,
    maxFrom: (p) => (p.tiers ? p.tiers.length : 3), describe: '金字塔的层级数量' },
  { key: 'showDesc', type: 'toggle', label: '层级说明', default: true,
    describe: '显示/隐藏右侧的层级说明栏' },
  { key: 'showNumbers', type: 'toggle', label: '层级编号', default: true,
    describe: '在金字塔每层显示序号' },
  { key: 'faceTexture', type: 'enum', label: '表面质感', default: 'gloss',
    options: [{ value: 'gloss', label: '玻璃光泽' }, { value: 'duotone', label: '双色调' }, { value: 'hatched', label: '斜纹' }],
    describe: '层面的表面质感样式' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一个层级' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.tierCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调层级的序号（塔尖为 1）' },
  { key: 'showLead', type: 'toggle', label: '引言', default: true,
    describe: '显示/隐藏标题下方的引言' },
];

/* ── 3D glass pyramid (tiers passed apex → base) ── */
function Pyramid({ tiers, focusIndex, showNumbers, faceTexture = 'gloss', accent, glow }) {
  const uid = React.useId().replace(/:/g, '');
  const ACC = accent || '#2fe07f';
  const GLOW = glow || '47,224,127';
  const hi = lighten(ACC, 0.26);   // apex tint
  const lo = darken(ACC, 0.60);    // base tint (deep, reads as depth)

  const n = tiers.length || 1;
  const W = 860, H = 824;
  const cx = 372;
  const yTop = 50, yBot = 724;
  const span = yBot - yTop;
  const topHW = 120, baseHW = 300;
  const depth = 54, dx = depth, dy = -depth * 0.6;
  const gap = 14;
  const hw = (y) => topHW + (baseHW - topHW) * ((y - yTop) / span);
  const layerH = (span - (n - 1) * gap) / n;
  const focused = focusIndex >= 0 && focusIndex < n;
  const P = (x, y) => `${x.toFixed(1)},${y.toFixed(1)}`;

  // geometry top(apex,index0) → bottom
  const built = [];
  for (let t = 0; t < n; t++) {
    const yt = yTop + t * (layerH + gap);
    const yb = yt + layerH;
    const fracFromBottom = n > 1 ? (n - 1 - t) / (n - 1) : 1;
    const mid = lerpColor(lo, hi, fracFromBottom);
    built.push({ yt, yb, tHW: hw(yt), bHW: hw(yb), mid, data: tiers[t] || {}, idx: t });
  }

  const sil = [P(cx - built[0].tHW, yTop), P(cx + built[0].tHW, yTop), P(cx + baseHW, yBot), P(cx - baseHW, yBot)].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {built.map((L, i) => (
          <linearGradient key={i} id={`${uid}-pf-${i}`} x1="0" y1="0" x2="0.22" y2="1">
            <stop offset="0%" stopColor={lighten(L.mid, 0.46)} />
            <stop offset="42%" stopColor={lighten(L.mid, 0.10)} />
            <stop offset="100%" stopColor={darken(L.mid, 0.20)} />
          </linearGradient>
        ))}
        {/* diagonal hatch per layer (evilcharts “hatched” variant) */}
        {built.map((L, i) => (
          <pattern key={`h${i}`} id={`${uid}-hx-${i}`} width="13" height="13"
                   patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="13" stroke={lighten(L.mid, 0.55)} strokeWidth="3" strokeOpacity="0.42" />
          </pattern>
        ))}
        {/* glossy diagonal sheen sweep (evilcharts “gloss” feel) */}
        <linearGradient id={`${uid}-sheen`} x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="56%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* bottom inner-shadow for face bevel depth */}
        <linearGradient id={`${uid}-ish`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.36" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id={`${uid}-glow2`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={`${uid}-fg`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`${uid}-floor`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ACC} stopOpacity="0.34" />
          <stop offset="100%" stopColor={ACC} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ambient accent glow (soft + tight) + ground reflection */}
      <polygon points={sil} fill={ACC} opacity="0.20" filter={`url(#${uid}-glow)`} />
      <polygon points={sil} fill={ACC} opacity="0.16" filter={`url(#${uid}-glow2)`} />
      <ellipse cx={cx + dx * 0.5} cy={yBot + 30} rx={baseHW * 1.05} ry="42" fill={`url(#${uid}-floor)`} />

      {/* layers painted bottom → top so apex steps sit on top */}
      {built.slice().reverse().map((L) => {
        const { yt, yb, tHW, bHW, mid, idx } = L;
        const isF = idx === focusIndex;
        const dim = focused && !isF;
        const FTL = [cx - tHW, yt], FTR = [cx + tHW, yt];
        const FBL = [cx - bHW, yb], FBR = [cx + bHW, yb];
        const top = [FTL, FTR, [FTR[0] + dx, FTR[1] + dy], [FTL[0] + dx, FTL[1] + dy]];
        const right = [FTR, FBR, [FBR[0] + dx, FBR[1] + dy], [FTR[0] + dx, FTR[1] + dy]];
        const front = [FTL, FTR, FBR, FBL];
        const cyMid = (yt + yb) / 2;
        const frontHW = (tHW + bHW) / 2;
        const num = String(n - idx).padStart(2, '0'); // base = 01
        const pts = (a) => a.map((q) => P(q[0], q[1])).join(' ');
        const frontPts = pts(front);
        // duotone upper band
        const splitY = yt + (yb - yt) * 0.46, shw = hw(splitY);
        const upper = [FTL, FTR, [cx + shw, splitY], [cx - shw, splitY]];
        // bottom inner-shadow band
        const bsY = yb - (yb - yt) * 0.22, bhw = hw(bsY);
        const lower = [[cx - bhw, bsY], [cx + bhw, bsY], FBR, FBL];
        return (
          <g key={idx} opacity={dim ? 0.32 : 1}>
            {/* right depth face + rim light on its leading edge */}
            <polygon points={pts(right)} fill={darken(mid, 0.44)} />
            <line x1={FTR[0]} y1={FTR[1]} x2={FBR[0]} y2={FBR[1]} stroke={lighten(mid, 0.4)} strokeOpacity="0.5" strokeWidth="1.4" />
            {/* top depth face */}
            <polygon points={pts(top)} fill={lighten(mid, 0.2)} opacity="0.94" />
            {/* front face base gradient */}
            <polygon points={frontPts} fill={`url(#${uid}-pf-${idx})`} />
            {/* texture overlay */}
            {faceTexture === 'duotone' && (
              <polygon points={pts(upper)} fill={lighten(mid, 0.34)} opacity="0.55" />
            )}
            {faceTexture === 'hatched' && (
              <polygon points={frontPts} fill={`url(#${uid}-hx-${idx})`} opacity="0.6" />
            )}
            {faceTexture === 'gloss' && (
              <polygon points={frontPts} fill={`url(#${uid}-sheen)`} />
            )}
            {/* bottom inner-shadow bevel */}
            <polygon points={pts(lower)} fill={`url(#${uid}-ish)`} />
            {/* outline + focus rim */}
            <polygon points={frontPts} fill="none"
                     stroke={isF ? '#ffffff' : lighten(mid, 0.5)} strokeOpacity={isF ? 0.95 : 0.34}
                     strokeWidth={isF ? 2.4 : 1} filter={isF ? `url(#${uid}-fg)` : undefined} />
            {/* crisp top highlight edge */}
            <line x1={FTL[0]} y1={FTL[1]} x2={FTR[0]} y2={FTR[1]} stroke="#ffffff" strokeOpacity="0.62" strokeWidth="1.6" />

            {showNumbers && (
              <text x={cx - frontHW * 0.52} y={cyMid} fill="#ffffff" fillOpacity="0.95"
                    fontSize="40" fontStyle="italic" fontWeight="600" textAnchor="middle" dominantBaseline="central"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.02em',
                             paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.18)', strokeWidth: 3 }}>{num}</text>
            )}
            <text x={cx + frontHW * 0.18} y={cyMid} fill="#ffffff" fillOpacity="0.97"
                  fontSize="31" fontWeight="500" textAnchor="middle" dominantBaseline="central"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif", letterSpacing: '0.04em',
                           paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.18)', strokeWidth: 3 }}>{L.data.title}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function SlidePyramid(props) {
  const p = { ...slidePyramidDefaults, ...props };
  const sch = p.gxnScheme || {};
  const n = Math.max(2, Math.min((p.tiers || []).length, p.tierCount));
  const tiers = (p.tiers || []).slice(0, n);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(n - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm}
                     subtitle={p.showLead ? p.lead : null} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 28, display: 'grid',
             gridTemplateColumns: p.showDesc ? '1.06fr 0.94fr' : '1fr', gap: 56, alignItems: 'center', minHeight: 0 }}>
          <div style={{ height: '100%', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pyramid tiers={tiers} focusIndex={fIdx} showNumbers={p.showNumbers} faceTexture={p.faceTexture} accent={sch.accent} glow={sch.glow} />
          </div>

          {p.showDesc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center', minHeight: 0 }}>
              {tiers.map((t, i) => {
                const focus = i === fIdx;
                const dim = fIdx >= 0 && !focus;
                return (
                  <div key={i} className={cx('gxn-panel', focus && 'is-focus', dim && 'is-dim')}
                       style={{ padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 24 }}>
                    <span className="gxn-num" style={{ fontSize: 44, fontWeight: 700, lineHeight: 1, flex: '0 0 auto', fontStyle: 'italic',
                          color: 'var(--gxn-accent)', textShadow: '0 0 22px rgba(var(--gxn-glow),0.45)' }}>{String(n - i).padStart(2, '0')}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <h3 style={{ margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700, fontSize: 32, color: 'var(--gxn-text)' }}>{t.title}</h3>
                        <span className="gxn-mono" style={{ fontSize: 20, padding: '3px 12px', borderRadius: 999, color: 'var(--gxn-accent)', border: '1px solid var(--gxn-line)' }}>{t.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 25, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{t.desc}</p>
                    </div>
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

export default SlidePyramid;
