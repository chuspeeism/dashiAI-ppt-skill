/**
 * SlideRoadmap.jsx — 策略路线图（时间轴页 · 横向阶段路线）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * A horizontal phased roadmap: N equal-width phase cards sitting above a
 * continuous progress rail with aligned milestone nodes. Distinct from a
 * step timeline — phases are durations, not points. Phase count is tunable,
 * one phase can be emphasised (others dim), and the rail is toggleable.
 *
 * ── Props (see slideRoadmapDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm, lead       strings
 *   phases       Array<{period,title,desc}>  phase content
 *   phaseCount   number   how many phases to render (slices `phases`)
 *   focusEnabled boolean  emphasise one phase
 *   focusIndex   number   0-based phase to emphasise
 *   showRail     boolean  show the connecting progress rail + nodes
 *   showLead     boolean  show/hide the intro lead line
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRoadmapDefaults = {
  kicker: 'STRATEGY · 阶段性策略',
  title: '资本下一程的 ',
  titleEm: '三段节奏',
  lead: '从「赌叙事」转向「看兑现」，节奏分三段推进：先观察头部 IPO，再优选可兑现标的，最后在洗牌期布局被低估的技术资产。',
  phases: [
    { period: '2025 – 2026', title: '观察期', desc: '跟踪头部公司 IPO 表现；若 Anthropic / OpenAI 上市破发，警惕全行业估值回调。' },
    { period: '2026 – 2027', title: '优选期', desc: '关注垂直应用收入曲线，优选 ARR > 1 亿美元、续约率 > 120% 的标的。' },
    { period: '2027 年后', title: '洗牌期', desc: '若 AGI 突破未兑现进入行业洗牌，可逆势抄底被低估的技术资产。' },
  ],
  phaseCount: 3,
  focusEnabled: false,
  focusIndex: 1,
  showRail: true,
  showLead: true,
};

export const slideRoadmapControls = [
  { key: 'phaseCount', type: 'number', label: '阶段数量', default: 3, min: 2, step: 1,
    maxFrom: (p) => (p.phases ? p.phases.length : 3), describe: '路线图的阶段数量' },
  { key: 'showRail', type: 'toggle', label: '进度轨道', default: true,
    describe: '显示/隐藏底部的进度轨道与节点' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一个阶段' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 1, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.phaseCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调阶段的序号' },
  { key: 'showLead', type: 'toggle', label: '引言', default: true,
    describe: '显示/隐藏标题下方的引言' },
];

export function SlideRoadmap(props) {
  const p = { ...slideRoadmapDefaults, ...props };
  const n = Math.max(2, Math.min((p.phases || []).length, p.phaseCount));
  const phases = (p.phases || []).slice(0, n);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(n - 1, p.focusIndex)) : -1;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm}
                     subtitle={p.showLead ? p.lead : null} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 44, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* phase cards */}
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 30, gridTemplateColumns: `repeat(${n}, 1fr)`, alignItems: 'stretch' }}>
            {phases.map((ph, i) => {
              const focus = i === fIdx;
              const dim = fIdx >= 0 && !focus;
              return (
                <div key={i} className={cx('gxn-panel', focus && 'is-focus', dim && 'is-dim')}
                     style={{ display: 'flex', flexDirection: 'column', padding: '34px 36px', gap: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="gxn-mono" style={{ fontSize: 24, letterSpacing: '.06em', color: 'var(--gxn-accent)' }}>{ph.period}</span>
                    <span className="gxn-num" style={{ fontSize: 30, fontWeight: 700, color: 'var(--gxn-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700, fontSize: 42, lineHeight: 1.1, color: 'var(--gxn-text)' }}>{ph.title}</h3>
                  <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.5, color: 'var(--gxn-dim)' }}>{ph.desc}</p>
                </div>
              );
            })}
          </div>

          {/* progress rail */}
          {p.showRail && (
            <div style={{ position: 'relative', height: 70, marginTop: 30 }}>
              <div style={{
                position: 'absolute', left: `${50 / n}%`, right: `${50 / n}%`, top: '50%', height: 4,
                transform: 'translateY(-50%)', borderRadius: 4,
                background: 'linear-gradient(90deg, rgba(var(--gxn-glow),0.15), var(--gxn-accent))',
                boxShadow: '0 0 18px -2px rgba(var(--gxn-glow),0.7)',
              }} />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, alignItems: 'center' }}>
                {phases.map((ph, i) => {
                  const focus = i === fIdx;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{
                        width: focus ? 26 : 20, height: focus ? 26 : 20, borderRadius: '50%',
                        background: 'var(--gxn-bg)', border: '4px solid var(--gxn-accent)',
                        boxShadow: '0 0 20px -2px rgba(var(--gxn-glow),0.9)', transition: 'all .3s ease',
                        opacity: fIdx >= 0 && !focus ? 0.5 : 1,
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideRoadmap;
