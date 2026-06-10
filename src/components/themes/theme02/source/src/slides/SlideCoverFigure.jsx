/**
 * SlideCoverFigure.jsx — 封面变体 B · 大数主视觉 / Hero Figure Cover.
 *
 * Independent, prop-driven. Renders its own theme styles via <ThemeStyle/>.
 * Migration: `import React from 'react'`, drop this file + gxnTheme in.
 *
 * 版式特征：左右分栏、左轻右重。左列文字纵向锁定（眉题 + 两行标题 + 副标题 + 标签）；
 * 右列一块发光面板里放一个巨型流光数字（.gxn-aurora-num），下接说明与若干小指标。
 * 右侧面板可走 .is-focus 接入全局「炫光票卡 / 磁吸」强调系统。
 *
 * ── Props（完整默认见 slideCoverFigureDefaults）────────────────────────────
 *   kicker / title / titleEm / subtitle   文本
 *   tags        string[] 装饰标签
 *   stat        {value,unit,caption}   右侧巨型数字
 *   subStats    {value,label}[]        右侧底部小指标（按 subStatCount 截取）
 *   statSide    'left' | 'right'       巨数面板所在侧
 *   focusEnabled boolean 右侧面板发光强调
 *   subStatCount number  小指标数量（0 = 隐藏）
 *   showSubtitle boolean 副标题显隐
 *   showTags    boolean  标签显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { TagRow } from '../gxnPrimitives.jsx';

export const slideCoverFigureDefaults = {
  kicker: 'GENERATIVE AI · CAPITAL REPORT · 2026',
  title: '资本涌入',
  titleEm: '智能新纪元',
  subtitle: '一年之内，生成式 AI 从概念验证走向规模部署。本报告以横纵分析法，复盘资本与采用度的双重跃迁。',
  tags: ['横纵分析法', '四层结构', '资本大年'],
  stat: { value: '1,240', unit: '亿美元', caption: '全年产业总投入 · 创历史新高' },
  subStats: [
    { value: '+38%', label: '同比增速' },
    { value: '97', label: '亿级事件（笔）' },
  ],
  statSide: 'right',
  focusEnabled: true,
  subStatCount: 2,
  showSubtitle: true,
  showTags: true,
};

export const slideCoverFigureControls = [
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '右侧巨数面板做发光强调（接入全局强调样式）' },
  { key: 'statSide', type: 'enum', label: '巨数侧别', default: 'right',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
    describe: '巨型数字面板放在左或右' },
  { key: 'subStatCount', type: 'number', label: '小指标数量', default: 2, min: 0, max: 2, step: 1,
    describe: '巨数下方的小指标数量（0 = 隐藏）' },
  { key: 'showSubtitle', type: 'toggle', label: '副标题', default: true,
    describe: '显示/隐藏左列副标题' },
  { key: 'showTags', type: 'toggle', label: '装饰标签', default: true,
    describe: '显示/隐藏左列标签' },
];

export function SlideCoverFigure(props) {
  const p = { ...slideCoverFigureDefaults, ...props };
  const subs = (p.subStats || []).slice(0, Math.max(0, p.subStatCount));
  const statOnLeft = p.statSide === 'left';

  const textBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'flex-start' }}>
      <p className="gxn-kicker gxn-rise">{p.kicker}</p>
      <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.1 }}>
        <span style={{ display: 'block' }}>{p.title}</span>
        <span className="gxn-em" style={{ display: 'block' }}>{p.titleEm}</span>
      </h1>
      {p.showSubtitle && <p className="gxn-sub gxn-rise-3" style={{ maxWidth: 720, textWrap: 'pretty' }}>{p.subtitle}</p>}
      {p.showTags && <div className="gxn-rise-3"><TagRow tags={p.tags} /></div>}
    </div>
  );

  const figureBlock = (
    <div className="gxn-rise-3" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
      <div className={cx('gxn-panel', p.focusEnabled && 'is-focus')}
           style={{ width: '100%', padding: '58px 56px', display: 'flex', flexDirection: 'column',
                    gap: 26, backgroundColor: 'var(--gxn-bg)' }}>
        <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', letterSpacing: '.1em',
          color: 'var(--gxn-accent)' }}>KEY FIGURE · 关键数据</span>
        <div className="gxn-num gxn-aurora-num" style={{ fontSize: 150, fontWeight: 600, lineHeight: 0.9,
          letterSpacing: '-0.03em', color: 'var(--gxn-accent)',
          textShadow: '0 0 46px rgba(var(--gxn-glow),0.55)' }}>
          {p.stat.value}
          <span style={{ fontSize: 40, marginLeft: 12, color: 'var(--gxn-dim)', fontWeight: 500 }}>{p.stat.unit}</span>
        </div>
        <p style={{ margin: 0, fontSize: 'var(--gxn-fs-body)', lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{p.stat.caption}</p>

        {subs.length > 0 && (
          <div style={{ display: 'flex', gap: 0, marginTop: 8, paddingTop: 26,
            borderTop: '1px solid var(--gxn-line)' }}>
            {subs.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', margin: '2px 0',
                  background: 'var(--gxn-line)' }} />}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6,
                  paddingLeft: i > 0 ? 34 : 0 }}>
                  <span className="gxn-num" style={{ fontSize: 52, fontWeight: 600, lineHeight: 1,
                    color: 'var(--gxn-text)' }}>{s.value}</span>
                  <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <div style={{ flex: 1, display: 'grid',
          gridTemplateColumns: statOnLeft ? '0.92fr 1.08fr' : '1.08fr 0.92fr',
          gap: 76, alignItems: 'center' }}>
          {statOnLeft ? figureBlock : textBlock}
          {statOnLeft ? textBlock : figureBlock}
        </div>
      </div>
    </div>
  );
}

export default SlideCoverFigure;
