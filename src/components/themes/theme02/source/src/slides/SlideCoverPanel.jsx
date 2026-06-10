/**
 * SlideCoverPanel.jsx — 封面变体 D · 模块网格 / Module-Grid Cover.
 *
 * Independent, prop-driven. Renders its own theme styles via <ThemeStyle/>.
 * Migration: `import React from 'react'`, drop this file + gxnTheme in.
 *
 * 版式特征：左右分栏。左列纵向标题锁定（眉题 + 两行标题 + 副标题 + 底部内联附注）；
 * 右列一列发光「支柱」面板（pillars），每块含描边巨号 + 标题 + 一句说明，可强调其中一块。
 * 几何形态与其余封面（居中 / 大数 / 满幅图）明显区分。
 *
 * ── Props（完整默认见 slideCoverPanelDefaults）─────────────────────────────
 *   kicker / title / titleEm / subtitle   文本
 *   meta        string[] 左列底部附注
 *   pillars     {title,desc}[]   右列支柱（按 pillarCount 截取）
 *   pillarCount number   支柱数量（2–4）
 *   focusEnabled boolean 强调某一支柱
 *   focusIndex  number   被强调支柱序号
 *   showIndex   boolean  支柱巨号显隐
 *   showDesc    boolean  支柱说明显隐
 *   showMeta    boolean  左列底部附注显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideCoverPanelDefaults = {
  kicker: 'GENERATIVE AI · INDUSTRY LANDSCAPE · 2026',
  title: '四层结构',
  titleEm: '读懂这一年',
  subtitle: '从底层算力到上层应用，本报告沿四个维度逐层拆解生成式 AI 的产业地形与资本流向。',
  meta: ['编制 2026-06', '数据口径 公开披露', '仅供研究参考'],
  pillars: [
    { title: '算力底座', desc: '芯片、云与训练集群的供给与成本' },
    { title: '模型层', desc: '基础模型的能力跃迁与开闭源格局' },
    { title: '应用生态', desc: '垂直场景的渗透与商业化节奏' },
    { title: '资本流向', desc: '轮次结构、估值地形与头部集中' },
  ],
  pillarCount: 4,
  focusEnabled: true,
  focusIndex: 1,
  showIndex: true,
  showDesc: true,
  showMeta: true,
};

export const slideCoverPanelControls = [
  { key: 'pillarCount', type: 'number', label: '支柱数量', default: 4, min: 2, max: 4, step: 1,
    describe: '右列支柱面板的数量',
    maxFrom: (p) => (p.pillars ? p.pillars.length : 4) },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '强调其中一块支柱（发光）' },
  { key: 'focusIndex', type: 'number', label: '强调序号', default: 1, min: 0, max: 3, step: 1, oneBased: true,
    describe: '被强调支柱的序号', visibleWhen: (p) => p.focusEnabled,
    maxFrom: (p) => Math.max(0, (p.pillarCount || 1) - 1) },
  { key: 'showIndex', type: 'toggle', label: '支柱编号', default: true,
    describe: '显示/隐藏支柱的描边巨号' },
  { key: 'showDesc', type: 'toggle', label: '支柱说明', default: true,
    describe: '显示/隐藏支柱的一句说明' },
  { key: 'showMeta', type: 'toggle', label: '附注信息', default: true,
    describe: '显示/隐藏左列底部附注' },
];

export function SlideCoverPanel(props) {
  const p = { ...slideCoverPanelDefaults, ...props };
  const pillars = (p.pillars || []).slice(0, Math.max(2, Math.min(4, p.pillarCount)));

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.12fr 0.88fr', gap: 80, minHeight: 0 }}>

          {/* 左列 · 标题锁定 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
            <p className="gxn-kicker gxn-rise">{p.kicker}</p>
            <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.08 }}>
              <span style={{ display: 'block' }}>{p.title}</span>
              <span className="gxn-em" style={{ display: 'block' }}>{p.titleEm}</span>
            </h1>
            <p className="gxn-sub gxn-rise-3" style={{ maxWidth: 620, textWrap: 'pretty' }}>{p.subtitle}</p>
            {p.showMeta && (
              <footer className="gxn-rise-4 gxn-mono" style={{ display: 'flex', gap: 22, flexWrap: 'wrap',
                alignItems: 'center', marginTop: 8, fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>
                {p.meta.map((m, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
                    <span>{m}</span>
                  </React.Fragment>
                ))}
              </footer>
            )}
          </div>

          {/* 右列 · 支柱面板列 */}
          <div className="gxn-rise-3" style={{ display: 'grid', gridAutoRows: '1fr', gap: 20, minHeight: 0 }}>
            {pillars.map((pl, i) => {
              const focus = p.focusEnabled && i === p.focusIndex;
              return (
                <article key={i} className={cx('gxn-panel', focus && 'is-focus')}
                         style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '0 36px',
                                  backgroundColor: 'var(--gxn-bg)', opacity: p.focusEnabled && !focus ? 0.82 : 1,
                                  transition: 'opacity .3s' }}>
                  {p.showIndex && (
                    <span className="gxn-num" style={{ flex: '0 0 auto', width: 88, fontSize: 64, fontWeight: 600,
                      lineHeight: 0.9, letterSpacing: '-0.02em',
                      color: focus ? 'var(--gxn-accent)' : 'transparent',
                      WebkitTextStroke: focus ? '0' : '1.5px rgba(var(--gxn-glow),0.6)',
                      textShadow: focus ? '0 0 30px rgba(var(--gxn-glow),0.5)' : 'none' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', fontWeight: 700, lineHeight: 1.14,
                      color: 'var(--gxn-text)' }}>{pl.title}</h3>
                    {p.showDesc && <p style={{ margin: 0, fontSize: 'var(--gxn-fs-label)', lineHeight: 1.4,
                      color: 'var(--gxn-dim)', textWrap: 'pretty' }}>{pl.desc}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideCoverPanel;
