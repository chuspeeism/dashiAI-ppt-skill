/**
 * SlideRisk.jsx — Slide 18 · 风险研判（清单页 · 严重度）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideRiskDefaults) ───────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   levels       {high,mid,low}      severity labels (text)
 *   risks        Array<{title,desc,level}>  risk dataset; level ∈ high|mid|low
 *   riskCount    number   how many risks to show
 *   layout       'list' | 'grid'     stacked rows or 2-col cards
 *   focusEnabled boolean  glow-emphasise one risk
 *   focusIndex   number   0-based risk to emphasise
 *   showLevel    boolean  show the severity badge
 *   showDesc     boolean  show the risk description
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideRiskDefaults = {
  kicker: 'RISK · 风险研判',
  title: '盛宴之下 ',
  titleEm: '五个风险信号',
  levels: { high: '高', mid: '中', low: '观察' },
  risks: [
    { title: '估值泡沫', desc: '部分头部估值远超当期收入，存在回调风险。', level: 'high' },
    { title: '商业化滞后', desc: '叙事驱动公司的付费转化与留存仍待验证。', level: 'high' },
    { title: '算力成本高企', desc: 'GPU 与训练成本居高，持续挤压毛利空间。', level: 'mid' },
    { title: '监管不确定', desc: '安全与合规政策走向，影响落地节奏。', level: 'mid' },
    { title: '头部过度集中', desc: '资金与人才高度集中，长尾公司承压。', level: 'low' },
  ],
  riskCount: 5,
  layout: 'list',
  focusEnabled: true,
  focusIndex: 0,
  showLevel: true,
  showDesc: true,
};

export const slideRiskControls = [
  { key: 'riskCount', type: 'number', label: '风险数量', default: 5, min: 3, step: 1,
    maxFrom: (p) => (p.risks ? p.risks.length : 5), describe: '展示的风险条数' },
  { key: 'layout', type: 'enum', label: '版式', default: 'list',
    options: [{ value: 'list', label: '清单' }, { value: 'grid', label: '卡片网格' }],
    describe: '竖排清单或双列卡片' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一风险' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.riskCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调风险的序号' },
  { key: 'showLevel', type: 'toggle', label: '严重度', default: true,
    describe: '显示/隐藏严重度徽章' },
  { key: 'showDesc', type: 'toggle', label: '风险说明', default: true,
    describe: '显示/隐藏风险描述' },
];

const LEVEL_COLOR = {
  high: 'var(--gxn-accent)',
  mid: 'var(--gxn-accent-cool)',
  low: 'var(--gxn-faint)',
};

export function SlideRisk(props) {
  const p = { ...slideRiskDefaults, ...props };
  const count = Math.max(1, Math.min(p.risks.length, p.riskCount));
  const risks = p.risks.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const grid = p.layout === 'grid';

  const Card = ({ r, i }) => {
    const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
    const c = LEVEL_COLOR[r.level] || 'var(--gxn-faint)';
    return (
      <article className={cx('gxn-panel', isF && 'is-focus')}
               style={{ position: 'relative', overflow: 'hidden', flex: grid ? '0 1 auto' : 1, minHeight: 0,
                        padding: grid ? '28px 30px 28px 38px' : '0 34px 0 40px', display: 'flex',
                        flexDirection: grid ? 'column' : 'row', alignItems: grid ? 'flex-start' : 'center',
                        gap: grid ? 12 : 30, opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease' }}>
        {/* severity accent bar */}
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
          background: c, boxShadow: `0 0 22px -2px ${c}` }} />
        <span className="gxn-num" style={{ fontSize: grid ? 40 : 48, fontWeight: 600, color: 'var(--gxn-faint)', flex: '0 0 auto', width: grid ? 'auto' : 70 }}>{String(i + 1).padStart(2, '0')}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 34, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)' }}>{r.title}</h3>
            {p.showLevel && (
              <span className="gxn-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 24,
                padding: '5px 15px', borderRadius: 999, color: c, border: `1px solid ${c}`, background: 'rgba(255,255,255,0.03)' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: c, boxShadow: `0 0 12px ${c}` }} />
                {p.levels[r.level] || r.level}
              </span>
            )}
          </div>
          {p.showDesc && <p style={{ margin: 0, fontSize: 25, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{r.desc}</p>}
        </div>
      </article>
    );
  };

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "22 / 23"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, minHeight: 0,
          display: grid ? 'grid' : 'flex', flexDirection: grid ? undefined : 'column',
          gridTemplateColumns: grid ? '1fr 1fr' : undefined, gap: grid ? 22 : 14,
          alignContent: grid ? 'start' : undefined }}>
          {risks.map((r, i) => <Card key={i} r={r} i={i} />)}
        </div>
      </div>
    </div>
  );
}

export default SlideRisk;
