/**
 * SlideOrbit.jsx — 径向枢纽（关系图 · 中心枢纽 + 环形节点）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 参考「中心 + 环绕」逻辑板式：一个中心枢纽，N 个编号节点沿轨道环均匀分布，
 * 每个节点带序号、标题与说明，文字朝版面外侧排布。纯关系图，无运行时依赖。
 *
 * ── Props (see slideOrbitDefaults) ──────────────────────────────────────────
 *   kicker, title, titleEm, index   strings
 *   center       {label, sub}        中心枢纽文案
 *   nodes        Array<{label,desc}> 环绕节点 (text)
 *   nodeCount    number   展示的节点数量（3–6）
 *   focusEnabled boolean  高亮某一节点
 *   focusIndex   number   0-based 被强调节点
 *   showOrbit    boolean  显示轨道环
 *   showIndex    boolean  节点内显示序号
 *   showDesc     boolean  显示节点说明文案
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideOrbitDefaults = {
  kicker: 'FRAMEWORK · 调研框架',
  title: '五维透视 ',
  titleEm: '横纵分析法',
  index: '02 / 27',
  center: { label: 'AI 资本图景', sub: '2024 · 横纵分析' },
  nodes: [
    { label: '市场全景', desc: '逐季逐月的资本节奏与拐点' },
    { label: '行业分布', desc: '五大赛道的资金占比结构' },
    { label: '轮次结构', desc: '从种子到 D+ 的集中度' },
    { label: '产业链分层', desc: '上游—中游—下游的传导' },
    { label: '典型案例', desc: '头部玩家的路径剖析' },
  ],
  nodeCount: 5,
  focusEnabled: false,
  focusIndex: 0,
  coreFlow: true,
  showSpokes: true,
  showOrbit: true,
  showIndex: true,
  showDesc: true,
};

export const slideOrbitControls = [
  { key: 'nodeCount', type: 'number', label: '节点数量', default: 5, min: 3, step: 1,
    maxFrom: (p) => (p.nodes ? p.nodes.length : 5), describe: '环绕节点的数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一个节点' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.nodeCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调节点的序号' },
  { key: 'coreFlow', type: 'toggle', label: '中心流光', default: true,
    describe: '中心球体的荧光流动动效' },
  { key: 'showSpokes', type: 'toggle', label: '辐射连线', default: true,
    describe: '中心→节点的辐射连线显隐' },
  { key: 'showOrbit', type: 'toggle', label: '轨道环', default: true,
    describe: '显示/隐藏环绕轨道线' },
  { key: 'showIndex', type: 'toggle', label: '节点序号', default: true,
    describe: '节点内序号显隐' },
  { key: 'showDesc', type: 'toggle', label: '节点说明', default: true,
    describe: '节点说明文案显隐' },
];

export function SlideOrbit(props) {
  const p = { ...slideOrbitDefaults, ...props };
  const count = Math.max(3, Math.min(p.nodes.length, p.nodeCount));
  const nodes = p.nodes.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;

  // Geometry in % of the orbit stage. The lone vertical-axis node sits at the
  // BOTTOM (angle 90°) so odd counts stay left-right symmetric without a card
  // overflowing the top. rx is kept tight enough that outboard label cards fit.
  const cxp = 50, cyp = 47, rxp = 26, ryp = 30;
  const BADGE = 120, GAP = 26, CARDW = 300, OFF = BADGE / 2 + GAP;

  const seats = nodes.map((n, i) => {
    const ang = (90 + i * (360 / count)) * Math.PI / 180;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    let side;
    if (cos > 0.25) side = 'right';
    else if (cos < -0.25) side = 'left';
    else side = sin >= 0 ? 'down' : 'up';
    return { n, i, x: cxp + rxp * cos, y: cyp + ryp * sin, side };
  });

  const cardStyle = (side) => {
    if (side === 'right') return { left: OFF, top: 0, transform: 'translateY(-50%)', textAlign: 'left', width: CARDW, alignItems: 'flex-start' };
    if (side === 'left') return { left: -OFF, top: 0, transform: 'translate(-100%,-50%)', textAlign: 'right', width: CARDW, alignItems: 'flex-end' };
    if (side === 'down') return { left: 0, top: OFF, transform: 'translateX(-50%)', textAlign: 'center', width: CARDW, alignItems: 'center' };
    return { left: 0, top: -OFF, transform: 'translate(-50%,-100%)', textAlign: 'center', width: CARDW, alignItems: 'center' };
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />

        <div className="gxn-rise-2" style={{ position: 'relative', flex: 1, marginTop: 10, minHeight: 0 }}>
          {/* orbit track + radial spokes — drawn in a 0–100 viewBox mapped 1:1
              to the stage (% space). Non-scaling strokes keep an even weight;
              the opaque hub + node badges (drawn over) mask the line ends so
              nothing bleeds through (Design.md R1). */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"
               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            {p.showOrbit && (
              <ellipse cx={cxp} cy={cyp} rx={rxp} ry={ryp} fill="none"
                       stroke="rgba(var(--gxn-glow),0.30)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            )}
            {p.showSpokes && seats.map((s) => {
              const dim = fIdx >= 0 && s.i !== fIdx;
              return (
                <line key={s.i} x1={cxp} y1={cyp} x2={s.x} y2={s.y}
                      stroke={s.i === fIdx ? 'rgba(var(--gxn-glow),0.85)' : 'rgba(var(--gxn-glow),0.42)'}
                      strokeWidth={s.i === fIdx ? 2.4 : 1.6} vectorEffect="non-scaling-stroke"
                      opacity={dim ? 0.25 : 1} />
              );
            })}
          </svg>

          {/* center hub — flowing neon sphere */}
          <div style={{ position: 'absolute', left: `${cxp}%`, top: `${cyp}%`, transform: 'translate(-50%,-50%)', zIndex: 3 }}>
            <div className={cx('gxn-sphere', p.coreFlow && 'is-flow')} style={{
              width: 228, height: 228, borderRadius: '50%', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              textAlign: 'center', padding: 24, border: '1px solid rgba(var(--gxn-glow),0.7)',
              boxShadow: '0 0 120px -10px rgba(var(--gxn-glow),0.85), 0 20px 60px -22px rgba(0,0,0,0.85), inset 0 -26px 56px -22px rgba(0,0,0,0.45)',
            }}>
              <span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: '50%', pointerEvents: 'none',
                background: 'radial-gradient(circle at 36% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0) 46%)' }} />
              <span style={{ position: 'relative', fontSize: 34, fontWeight: 800, lineHeight: 1.08,
                color: '#08130c', letterSpacing: '-0.01em', textShadow: '0 1px 0 rgba(255,255,255,0.32)' }}>{p.center.label}</span>
              {p.center.sub && <span className="gxn-mono" style={{ position: 'relative', fontSize: 21,
                color: 'rgba(8,19,12,0.74)', letterSpacing: '.04em', fontWeight: 600 }}>{p.center.sub}</span>}
            </div>
          </div>

          {/* satellite seats — badge + outboard label card */}
          {seats.map((s) => {
            const isF = s.i === fIdx; const isDim = fIdx >= 0 && !isF;
            return (
              <div key={s.i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: 0, height: 0, zIndex: 2,
                                      opacity: isDim ? 0.4 : 1, transition: 'opacity .3s ease' }}>
                <div className={cx('gxn-panel', isF && 'is-focus')} style={{
                  position: 'absolute', left: -BADGE / 2, top: -BADGE / 2, width: BADGE, height: BADGE,
                  borderRadius: '50%', backgroundColor: 'var(--gxn-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {p.showIndex && (
                    <span className="gxn-num" style={{ fontSize: 58, fontWeight: 600, lineHeight: 1,
                      color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                      textShadow: isF ? '0 0 26px rgba(var(--gxn-glow),0.6)' : 'none' }}>{s.i + 1}</span>
                  )}
                </div>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', gap: 6, ...cardStyle(s.side) }}>
                  <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.12,
                    color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)' }}>{s.n.label}</div>
                  {p.showDesc && <div style={{ fontSize: 22, lineHeight: 1.42, color: 'var(--gxn-dim)' }}>{s.n.desc}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideOrbit;
