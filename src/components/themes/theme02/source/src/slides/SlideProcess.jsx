/**
 * SlideProcess.jsx — Slide 17 · 流程框架（步骤流页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideProcessDefaults) ────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   steps        Array<{title,desc}> step dataset (text)
 *   stepCount    number   how many steps to show (2–4)
 *   orientation  'horizontal' | 'vertical'
 *   focusEnabled boolean  glow-emphasise one step
 *   focusIndex   number   0-based step to emphasise
 *   showConnector boolean show arrows between steps
 *   showStepNo   boolean  show the big step number
 *   showDesc     boolean  show the step description
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideProcessDefaults = {
  kicker: 'FRAMEWORK · 判断框架',
  title: '从数据到决策 ',
  titleEm: '四步判断',
  steps: [
    { title: '看热度', desc: '融资额、轮次与头部集中度，判断资本在哪里聚集。' },
    { title: '辨兑现', desc: '收入确定性、客户留存与成本结构，判断能否落地。' },
    { title: '分层级', desc: '上游确定、中游竞争、下游潜力，定位风险与机会。' },
    { title: '定策略', desc: '转化为可执行的投资与产品判断，留在牌桌上。' },
  ],
  stepCount: 4,
  orientation: 'horizontal',
  focusEnabled: false,
  focusIndex: 0,
  showConnector: true,
  showStepNo: true,
  showDesc: true,
};

export const slideProcessControls = [
  { key: 'stepCount', type: 'number', label: '步骤数量', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.steps ? p.steps.length : 4), describe: '展示的步骤数量' },
  { key: 'orientation', type: 'enum', label: '排布方向', default: 'horizontal',
    options: [{ value: 'horizontal', label: '横向' }, { value: 'vertical', label: '纵向' }],
    describe: '步骤流的排布方向' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮某一步骤' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.stepCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调步骤的序号' },
  { key: 'showConnector', type: 'toggle', label: '步骤箭头', default: true,
    describe: '显示/隐藏步骤之间的箭头' },
  { key: 'showStepNo', type: 'toggle', label: '步骤编号', default: true,
    describe: '显示/隐藏大号步骤编号' },
  { key: 'showDesc', type: 'toggle', label: '步骤说明', default: true,
    describe: '显示/隐藏步骤描述' },
];

export function SlideProcess(props) {
  const p = { ...slideProcessDefaults, ...props };
  const count = Math.max(2, Math.min(p.steps.length, p.stepCount));
  const steps = p.steps.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const horizontal = p.orientation === 'horizontal';

  const Card = ({ s, i }) => {
    const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
    return (
      <section className={cx('gxn-panel', isF && 'is-focus')}
               style={{ flex: 1, minWidth: 0, padding: horizontal ? '34px 32px' : '28px 34px',
                        display: 'flex', flexDirection: horizontal ? 'column' : 'row',
                        alignItems: horizontal ? 'flex-start' : 'center', gap: horizontal ? 18 : 34,
                        opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
        {p.showStepNo && (
          <span className="gxn-num" style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.8,
            color: isF ? 'rgba(var(--gxn-glow),0.18)' : 'rgba(var(--gxn-glow),0.08)',
            WebkitTextStroke: `2px ${isF ? 'var(--gxn-accent)' : 'rgba(var(--gxn-glow),0.45)'}`,
            textShadow: isF ? '0 0 30px rgba(var(--gxn-glow),0.4)' : 'none', flex: '0 0 auto' }}>{String(i + 1).padStart(2, '0')}</span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', textShadow: isF ? '0 0 24px rgba(var(--gxn-glow),0.45)' : 'none' }}>{s.title}</h3>
          {p.showDesc && <p style={{ margin: 0, fontSize: 25, lineHeight: 1.5, color: 'var(--gxn-dim)' }}>{s.desc}</p>}
        </div>
      </section>
    );
  };

  const Arrow = () => (
    <span aria-hidden="true" className="gxn-num" style={{ flex: '0 0 auto', alignSelf: 'center',
      fontSize: 44, color: 'var(--gxn-accent)', textShadow: '0 0 16px rgba(var(--gxn-glow),0.7)', opacity: 0.8 }}>
      {horizontal ? '→' : '↓'}
    </span>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "21 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 48, display: 'flex',
          flexDirection: horizontal ? 'row' : 'column', alignItems: 'stretch',
          gap: p.showConnector ? 18 : 24, minHeight: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <Card s={s} i={i} />
              {p.showConnector && i < count - 1 && <Arrow />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlideProcess;
