/**
 * SlideProgress.jsx — 达成度（图表页 · 水平进度 / 子弹条）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 一列水平进度条：每行一个 0–100 的比率（渗透率 / 集中度 / 兑现率…），辉光填充 +
 * 可选目标刻度（target tick）+ 右侧读数。与「达成率」径向仪表互补：此页用线性条形
 * 横向对比多项比率，读「离满格还差多少 / 是否够到目标线」。仅依赖 props（含调色）。
 *
 * ── Props (see slideProgressDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm, lead     strings
 *   bars         Array<{label, value, target, note}>   value/target 为 0–100
 *   barCount     number   行数（2–n）
 *   focusEnabled boolean  辉光强调某一行
 *   focusIndex   number   0-based 被强调行
 *   showTarget   boolean  目标刻度线显隐
 *   showNote     boolean  行内说明显隐
 *   showValueLabels boolean 右侧百分比读数显隐
 *   gxnScheme    object?  { palette } 调色
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx, GXN_PALETTE } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideProgressDefaults = {
  kicker: 'PROGRESS · 关键比率',
  title: '五条比率 ',
  titleEm: '量出资本的偏好',
  lead: '把这一年最有结构意义的几个比率拉平了横向比——填得越满，说明这股力量越强；虚线是参照目标。',
  bars: [
    { label: '基础设施层资金占比', value: 78, target: 70, note: '算力 + 数据吃下最确定红利' },
    { label: '头部十强资本集中度', value: 63, target: 55, note: '前十大公司拿走六成资金' },
    { label: '湾区地理集中度', value: 55, target: 50, note: '融资进一步向旧金山聚拢' },
    { label: '企业级付费渗透率', value: 47, target: 45, note: '续费率走高，落地在加速' },
    { label: '商业化营收兑现率', value: 41, target: 60, note: '兑现仍是下一阶段的考题' },
  ],
  barCount: 5,
  focusEnabled: true,
  focusIndex: 0,
  showTarget: true,
  showNote: true,
  showValueLabels: true,
};

export const slideProgressControls = [
  { key: 'barCount', type: 'number', label: '行数', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.bars ? p.bars.length : 5), describe: '进度条行数（2–n）' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否辉光强调某一行' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.barCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调行的序号' },
  { key: 'showTarget', type: 'toggle', label: '目标刻度', default: true,
    describe: '目标参照虚线显隐' },
  { key: 'showValueLabels', type: 'toggle', label: '百分比读数', default: true,
    describe: '右侧百分比读数显隐' },
  { key: 'showNote', type: 'toggle', label: '说明文案', default: true,
    describe: '行内说明文案显隐' },
];

export function SlideProgress(props) {
  const p = { ...slideProgressDefaults, ...props };
  const count = Math.max(2, Math.min(p.bars.length, p.barCount));
  const bars = p.bars.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const palette = (p.gxnScheme && p.gxnScheme.palette) || GXN_PALETTE;
  const colorOf = (i) => palette[i % palette.length];

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || '30 / 43'} />
        {p.lead && <p className="gxn-sub gxn-rise" style={{ marginTop: 16, maxWidth: 1300 }}>{p.lead}</p>}

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, minHeight: 0, display: 'grid',
          gridTemplateRows: `repeat(${count}, 1fr)`, gap: 22, alignContent: 'stretch' }}>
          {bars.map((b, i) => {
            const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
            const c = colorOf(i);
            const v = Math.max(0, Math.min(100, b.value));
            const t = b.target != null ? Math.max(0, Math.min(100, b.target)) : null;
            const hit = t != null && v >= t;
            return (
              <div key={i} className={cx('gxn-panel', isF && 'is-focus')}
                   style={{ display: 'grid', gridTemplateColumns: '380px 1fr 132px', alignItems: 'center',
                     gap: 32, padding: '0 36px', minHeight: 0,
                     opacity: isDim ? 0.46 : 1, transition: 'opacity .3s ease' }}>

                {/* label + note */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2,
                    color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>
                  {p.showNote && b.note && (
                    <span style={{ fontSize: 21, lineHeight: 1.3, color: 'var(--gxn-dim)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.note}</span>
                  )}
                </div>

                {/* track + fill + target tick */}
                <div style={{ position: 'relative', height: 26, borderRadius: 999,
                  background: 'rgba(255,255,255,0.06)', overflow: 'visible' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${v}%`, height: '100%', borderRadius: 999,
                      background: `linear-gradient(90deg, ${c}99, ${c})`,
                      boxShadow: isF ? `0 0 30px -2px ${c}` : `0 0 18px -6px ${c}`,
                      transition: 'width .4s ease' }} />
                  </div>
                  {/* leading tip — 内嵌于填充条末端，距上下与右端等距（6px） */}
                  <div style={{ position: 'absolute', top: 6, left: `${v}%`, marginLeft: -20,
                    width: 14, height: 14, boxSizing: 'border-box', borderRadius: '50%',
                    background: '#0b0f14', border: `3px solid ${c}`,
                    boxShadow: `0 0 16px -2px ${c}` }} />
                  {/* target tick */}
                  {p.showTarget && t != null && (
                    <div style={{ position: 'absolute', top: -8, bottom: -8, left: `${t}%`,
                      width: 2, background: 'rgba(255,255,255,0.5)',
                      boxShadow: '0 0 8px rgba(255,255,255,0.4)' }}>
                      <span className="gxn-mono" style={{ position: 'absolute', top: -26, left: '50%',
                        transform: 'translateX(-50%)', fontSize: 18, color: 'var(--gxn-faint)',
                        whiteSpace: 'nowrap' }}>目标 {t}</span>
                    </div>
                  )}
                </div>

                {/* value readout */}
                {p.showValueLabels && (
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 6 }}>
                    <span className="gxn-num" style={{ fontSize: 54, fontWeight: 600, lineHeight: 1,
                      letterSpacing: '-0.02em', color: isF ? c : 'var(--gxn-text)' }}>{v}</span>
                    <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-dim)' }}>%</span>
                    {p.showTarget && t != null && (
                      <span aria-hidden="true" style={{ marginLeft: 4, fontSize: 22, lineHeight: 1,
                        color: hit ? c : 'var(--gxn-faint)' }}>{hit ? '↑' : '↓'}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideProgress;
