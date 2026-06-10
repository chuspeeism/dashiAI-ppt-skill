/**
 * SlideClosing.jsx — 封底收束页（封底页 · Back Cover / Closing）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 全篇收束：一句收束主张（关键短语辉光强调）压在巨型描边背景字之上，配一条发光分隔
 * 线、补充说明与落款署名（报告名 / 日期 / 口径）。整体偏冷静、留白大，作为 deck 的
 * 最后一页。可左对齐 / 居中。纯 props 驱动，无运行时依赖。
 *
 * ── Props (see slideClosingDefaults) ────────────────────────────────────────
 *   kicker          string   顶部小标
 *   ghost           string   背景巨型描边字（如 FIN / 2024）
 *   statement,
 *   statementEm     string   收束主张（statementEm = 辉光强调短语）
 *   sub             string   补充说明
 *   signature       {org,date,note}   落款署名
 *   align           'left' | 'center'   整体对齐
 *   showGhost       boolean  背景巨型字显隐
 *   showRule        boolean  发光分隔线显隐
 *   showSub         boolean  补充说明显隐
 *   showSignature   boolean  落款署名显隐
 *   showMark        boolean  装饰引号显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideClosingDefaults = {
  kicker: 'CLOSING · 结语',
  ghost: 'FIN',
  statement: 'AI 融资盛宴仍在继续，',
  statementEm: '但音乐节奏正在变化。',
  // 源：报告 七、结论 一句话总结
  sub: '资本的下一阶段，将从「赌叙事」转向「看兑现」——能把技术转化为可持续收入的公司，才能在退潮后留在牌桌上。',
  signature: {
    org: '2024 美国大额融资 AI 公司调研报告',
    date: '2026 · 06',
    note: '数据口径：2024 全年 ≥1 亿美元公开融资事件 · 仅供研究参考',
  },
  align: 'left',
  showGhost: true,
  showRule: true,
  showSub: true,
  showSignature: true,
  showMark: true,
};

export const slideClosingControls = [
  { key: 'align', type: 'enum', label: '对齐', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    describe: '封底整体对齐方式' },
  { key: 'showGhost', type: 'toggle', label: '背景巨型字', default: true,
    describe: '背景描边巨型字（如 FIN）显隐' },
  { key: 'showMark', type: 'toggle', label: '装饰引号', default: true,
    describe: '主张上方装饰引号显隐' },
  { key: 'showRule', type: 'toggle', label: '发光分隔线', default: true,
    describe: '主张与说明之间的发光线显隐' },
  { key: 'showSub', type: 'toggle', label: '补充说明', default: true,
    describe: '主张下方补充说明显隐' },
  { key: 'showSignature', type: 'toggle', label: '落款署名', default: true,
    describe: '底部报告名 / 日期 / 口径显隐' },
];

export function SlideClosing(props) {
  const p = { ...slideClosingDefaults, ...props };
  const centered = p.align === 'center';
  const sig = p.signature || {};

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />

      {/* background ghost word */}
      {p.showGhost && p.ghost && (
        <div className="gxn-num gxn-rise" aria-hidden="true" style={{
          position: 'absolute', right: centered ? '50%' : '-2%', bottom: '-6%',
          transform: centered ? 'translateX(50%)' : 'none',
          fontSize: 640, fontWeight: 700, lineHeight: 0.7, letterSpacing: '-0.04em',
          color: 'transparent', WebkitTextStroke: '2px rgba(var(--gxn-glow),0.18)',
          textShadow: '0 0 120px rgba(var(--gxn-glow),0.12)', pointerEvents: 'none', userSelect: 'none',
        }}>{p.ghost}</div>
      )}

      <div className="gxn-pad" style={{ justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34,
          alignItems: centered ? 'center' : 'flex-start', textAlign: centered ? 'center' : 'left',
          maxWidth: 1340 }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <p className="gxn-kicker gxn-rise" style={{ margin: 0 }}>{p.kicker}</p>
            {p.index != null && !centered && <span className="gxn-index">{p.index}</span>}
          </div>

          {p.showMark && (
            <div className="gxn-num gxn-rise" aria-hidden="true" style={{ fontSize: 120, lineHeight: 0.6, height: 64,
              color: 'var(--gxn-accent)', textShadow: '0 0 40px rgba(var(--gxn-glow),0.5)', opacity: 0.9 }}>”</div>
          )}

          <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.12, fontWeight: 700 }}>
            {p.statement}
            {p.statementEm ? <span className="gxn-em">{p.statementEm}</span> : null}
          </h1>

          {p.showRule && (
            <span className="gxn-rise-2" style={{ width: 140, height: 4, borderRadius: 4,
              background: 'linear-gradient(90deg, var(--gxn-accent), transparent)',
              boxShadow: '0 0 16px rgba(var(--gxn-glow),0.8)' }} />
          )}

          {p.showSub && p.sub && (
            <p className="gxn-sub gxn-rise-3" style={{ maxWidth: 1080, lineHeight: 1.5 }}>{p.sub}</p>
          )}

          {p.showSignature && (
            <div className="gxn-rise-3" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '10px 22px',
              marginTop: 18, justifyContent: centered ? 'center' : 'flex-start' }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--gxn-text)' }}>{sig.org}</span>
              {sig.date && <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)' }}>{sig.date}</span>}
              {sig.note && (
                <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)',
                  borderLeft: '1px solid var(--gxn-line)', paddingLeft: 22 }}>{sig.note}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideClosing;
