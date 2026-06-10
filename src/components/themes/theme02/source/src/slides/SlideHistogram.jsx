/**
 * SlideHistogram.jsx — 规模分布（文字排版页 · 编辑式 / Editorial Stats）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 不用图表，改以「正常文字排版」表达分布洞察：左侧一句大字陈述（关键短语辉光强调）
 * + 一段支撑导语；右侧一组结构化数字（值 · 单位 · 标签 · 注解），以细分隔线纵向排开，
 * 可辉光强调其中一项。亦可切换为「上陈述 + 下数字横排」的通栏版式。纯 props 驱动，
 * 不依赖预览运行时。
 *
 * ── Props (see slideHistogramDefaults) ──────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   statement, statementEm           大字陈述 + 末尾辉光强调短语
 *   lead                             支撑导语段落
 *   points       Array<{value, unit, label, note}>   结构化数字条目
 *   pointCount   number   展示的数字条目数量（2–n）
 *   layout       'split' | 'stack'   左右分栏 / 上陈述下数字横排
 *   focusEnabled boolean  辉光强调某一条数字
 *   focusIndex   number   0-based 被强调条目
 *   showLead     boolean  支撑导语显隐
 *   showNote     boolean  条目注解显隐
 *   showRule     boolean  分隔线 / 分栏竖线显隐
 *   gxnScheme    object?  调色（缺省走主题绿）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideHistogramDefaults = {
  kicker: 'DISTRIBUTION · 单笔融资规模',
  title: '钱不是平均分配的，而是 ',
  titleEm: '长尾',
  statement: '把每一笔融资按金额排开，绝大多数交易都停在亿元以内——',
  statementEm: '真正拉长这条分布的，是屈指可数的十亿级超级轮。',
  lead: '头部高度集中：最小的两档区间就装下了约六成笔数；而右尾虽稀，却决定了整年资本叙事的上限。',
  // 源：报告 2.x 单笔融资规模分布
  points: [
    { value: '107', unit: '笔', label: '全年大额融资事件', note: '统计口径：单笔 ≥ 1 亿美元' },
    { value: '61', unit: '%', label: '落在最小的两档区间', note: '单笔 < 1 亿美元的密集区' },
    { value: '0.9', unit: '亿', label: '单笔融资中位数', note: '一半交易低于此体量' },
    { value: '5', unit: '笔', label: '≥ 10 亿美元的超级轮', note: '数量稀少，却把右尾拉得很长' },
  ],
  pointCount: 4,
  layout: 'split',
  focusEnabled: true,
  focusIndex: 3,
  showLead: true,
  showNote: true,
  showRule: true,
};

export const slideHistogramControls = [
  { key: 'layout', type: 'enum', label: '版式', default: 'split',
    options: [{ value: 'split', label: '左右分栏' }, { value: 'stack', label: '通栏横排' }],
    describe: '左陈述右数字 / 上陈述下数字横排' },
  { key: 'pointCount', type: 'number', label: '数字条目', default: 4, min: 2, step: 1,
    maxFrom: (p) => (p.points ? p.points.length : 4), describe: '展示的数字条目数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '辉光强调某一条数字' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 3, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.pointCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调条目的序号' },
  { key: 'showLead', type: 'toggle', label: '支撑导语', default: true,
    describe: '陈述下方支撑导语显隐' },
  { key: 'showNote', type: 'toggle', label: '条目注解', default: true,
    describe: '数字条目的一句注解显隐' },
  { key: 'showRule', type: 'toggle', label: '分隔线', default: true,
    describe: '条目分隔线 / 分栏竖线显隐' },
];

/* A single typographic stat line: big figure + unit, label, optional note. */
function StatLine({ d, isFocus, dim, showNote, accent, horizontal }) {
  return (
    <div style={{
      display: 'flex', flexDirection: horizontal ? 'column' : 'row',
      alignItems: horizontal ? 'flex-start' : 'baseline',
      gap: horizontal ? 10 : 28, minWidth: 0,
      opacity: dim ? 0.42 : 1, transition: 'opacity .3s ease',
    }}>
      <div className={cx('gxn-num', isFocus && 'gxn-aurora-num')} style={{
        flex: horizontal ? '0 0 auto' : '0 0 230px', textAlign: horizontal ? 'left' : 'right',
        fontSize: horizontal ? 96 : 84, fontWeight: 600, lineHeight: 0.92, letterSpacing: '-0.02em',
        color: isFocus ? accent : 'var(--gxn-text)',
        textShadow: isFocus ? '0 0 36px rgba(var(--gxn-glow),0.5)' : 'none',
        whiteSpace: 'nowrap',
      }}>
        {d.value}<span style={{ fontSize: '0.34em', marginLeft: 8, color: 'var(--gxn-dim)', fontWeight: 500 }}>{d.unit}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4,
        paddingBottom: horizontal ? 0 : 4 }}>
        <span style={{ fontSize: horizontal ? 28 : 30, fontWeight: 700, lineHeight: 1.2,
          color: isFocus ? accent : 'var(--gxn-text)', textWrap: 'balance' }}>{d.label}</span>
        {showNote && d.note && (
          <span style={{ fontSize: horizontal ? 23 : 24, lineHeight: 1.4, color: 'var(--gxn-dim)', textWrap: 'pretty' }}>{d.note}</span>
        )}
      </div>
    </div>
  );
}

export function SlideHistogram(props) {
  const p = { ...slideHistogramDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || 'var(--gxn-accent)';

  const count = Math.max(2, Math.min(p.points.length, p.pointCount));
  const points = p.points.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const isStack = p.layout === 'stack';

  const Statement = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <p className="gxn-rise" style={{ margin: 0, fontSize: 50, fontWeight: 600, lineHeight: 1.32,
        letterSpacing: '-0.01em', color: 'var(--gxn-text)', textWrap: 'pretty' }}>
        {p.statement}
        {p.statementEm ? <span className="gxn-em">{p.statementEm}</span> : null}
      </p>
      {p.showLead && p.lead && (
        <p className="gxn-rise-2" style={{ margin: 0, fontSize: 28, lineHeight: 1.55,
          color: 'var(--gxn-dim)', maxWidth: 760, textWrap: 'pretty' }}>{p.lead}</p>
      )}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '58 / 69'} />

        {isStack ? (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 30, minHeight: 0, display: 'flex',
            flexDirection: 'column', justifyContent: 'center', gap: 56 }}>
            {Statement}
            {p.showRule && <div style={{ height: 1, background: 'var(--gxn-line)' }} />}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, gap: 48 }}>
              {points.map((d, i) => (
                <StatLine key={i} d={d} isFocus={i === fIdx} dim={fIdx >= 0 && i !== fIdx}
                          showNote={p.showNote} accent={accent} horizontal />
              ))}
            </div>
          </div>
        ) : (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 18, minHeight: 0, display: 'grid',
            gridTemplateColumns: '1.04fr 0.96fr', gap: 86, alignItems: 'center' }}>
            <div style={{ alignSelf: 'center' }}>{Statement}</div>
            <div style={{ display: 'flex', flexDirection: 'column',
              borderLeft: p.showRule ? '1px solid var(--gxn-line)' : 'none',
              paddingLeft: p.showRule ? 76 : 0 }}>
              {points.map((d, i) => (
                <div key={i} style={{ padding: '26px 0',
                  borderBottom: p.showRule && i < count - 1 ? '1px solid var(--gxn-line)' : 'none' }}>
                  <StatLine d={d} isFocus={i === fIdx} dim={fIdx >= 0 && i !== fIdx}
                            showNote={p.showNote} accent={accent} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideHistogram;
