/**
 * SlideBigNumber.jsx — 单一巨型数字（大数字页）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 一页一个主数字，铺满版面、辉光强调；右侧可带导语与若干支撑小数据。
 * 与「关键数字」多卡版式互补：此页只讲一个数字，气势优先。
 *
 * ── Props (see slideBigNumberDefaults) ──────────────────────────────────────
 *   kicker                           string  顶部标签
 *   value, unit                      strings 主数字与单位
 *   caption                          string  主数字说明（一句话）
 *   lead                             string  右侧导语段落
 *   support      Array<{value,unit,label}>   支撑小数据
 *   supportCount number   展示的支撑数据数量 (0–n)
 *   align        'split' | 'center'  分栏（数字+导语）或居中铺满
 *   showRing     boolean  主数字后的辉光弧环
 *   showLead     boolean  显示/隐藏右侧导语
 *   showCaption  boolean  显示/隐藏主数字说明
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideBigNumberDefaults = {
  kicker: 'HEADLINE · 资本大年',
  value: '970',
  unit: '亿美元',
  caption: '2024 全年美国 AI 初创吸纳风险投资 · 创历史新高',
  lead: '单笔 ≥1 亿美元的大额事件共 97 笔，平均每笔约 10 亿美元，占全美风险投资近三分之一——资本正以前所未有的密度涌入 AI。',
  support: [
    { value: '97', unit: '笔', label: '大额融资事件' },
    { value: '≈1/3', unit: '', label: '占全美 VC 比重' },
    { value: '63.9', unit: '%', label: '集中于旧金山湾区' },
  ],
  supportCount: 3,
  align: 'split',
  showRing: false,
  showLead: true,
  showCaption: true,
};

export const slideBigNumberControls = [
  { key: 'align', type: 'enum', label: '版式', default: 'split',
    options: [{ value: 'split', label: '分栏' }, { value: 'center', label: '居中铺满' }],
    describe: '数字+导语分栏，或数字居中铺满' },
  { key: 'supportCount', type: 'number', label: '支撑数据', default: 3, min: 0, step: 1,
    maxFrom: (p) => (p.support ? p.support.length : 3), describe: '底部支撑小数据数量（0 = 不显示）' },
  { key: 'showRing', type: 'toggle', label: '辉光弧环', default: false,
    describe: '主数字背后的发光弧环显隐' },
  { key: 'showLead', type: 'toggle', label: '导语', default: true,
    visibleWhen: (p) => p.align === 'split', describe: '分栏版式右侧导语显隐' },
  { key: 'showCaption', type: 'toggle', label: '数字说明', default: true,
    describe: '主数字下方说明文案显隐' },
];

function Ring() {
  // decorative glowing arc behind the hero number
  return (
    <svg viewBox="0 0 600 600" aria-hidden="true"
         style={{ position: 'absolute', inset: '50% auto auto -8%', top: '50%', transform: 'translateY(-50%)',
                  width: 720, height: 720, opacity: 0.6, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="gxn-bn-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(var(--gxn-glow),0.0)" />
          <stop offset="55%" stopColor="rgba(var(--gxn-glow),0.85)" />
          <stop offset="100%" stopColor="rgba(var(--gxn-glow),0.0)" />
        </linearGradient>
        <filter id="gxn-bn-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <circle cx="300" cy="300" r="250" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
      <circle cx="300" cy="300" r="250" fill="none" stroke="url(#gxn-bn-ring)" strokeWidth="10"
              strokeLinecap="round" strokeDasharray="900 700" filter="url(#gxn-bn-blur)" />
    </svg>
  );
}

function HeroNumber({ value, unit, center }) {
  return (
    <div className="gxn-num gxn-aurora-num" style={{
      position: 'relative', fontWeight: 600, lineHeight: 0.84, letterSpacing: '-0.04em',
      fontSize: center ? 360 : 320,
      color: 'var(--gxn-accent)', textShadow: '0 0 70px rgba(var(--gxn-glow),0.55)',
      whiteSpace: 'nowrap',
    }}>
      {value}
      {unit && <span style={{ fontSize: '0.22em', marginLeft: 16, color: 'var(--gxn-text)', fontWeight: 500, letterSpacing: '0' }}>{unit}</span>}
    </div>
  );
}

export function SlideBigNumber(props) {
  const p = { ...slideBigNumberDefaults, ...props };
  const sCount = Math.max(0, Math.min(p.support.length, p.supportCount));
  const support = p.support.slice(0, sCount);
  const center = p.align === 'center';

  const SupportRow = support.length > 0 && (
    <div className="gxn-rise-3" style={{
      display: 'grid', gridTemplateColumns: `repeat(${support.length}, 1fr)`, gap: 24,
      justifyContent: center ? 'center' : 'flex-start', maxWidth: center ? 1320 : '100%',
      margin: center ? '0 auto' : 0, width: '100%',
    }}>
      {support.map((s, i) => (
        <div key={i} className="gxn-panel" style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="gxn-num" style={{ fontSize: 64, fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.02em', color: 'var(--gxn-text)', whiteSpace: 'nowrap' }}>
            {s.value}{s.unit && <span style={{ fontSize: '0.4em', marginLeft: 6, color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.unit}</span>}
          </span>
          <span className="gxn-mono" style={{ fontSize: 23, color: 'var(--gxn-faint)' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      {p.showRing && <Ring />}
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} index={p.index || "13 / 23"} />

        {center ? (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 28, minHeight: 0 }}>
            <HeroNumber value={p.value} unit={p.unit} center />
            {p.showCaption && <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', color: 'var(--gxn-dim)', maxWidth: 1180, lineHeight: 1.45 }}>{p.caption}</p>}
            {support.length > 0 && <div style={{ marginTop: 18, width: '100%' }}>{SupportRow}</div>}
          </div>
        ) : (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0, gap: 44 }}>
            <div style={{ display: 'grid', gridTemplateColumns: p.showLead ? '1.35fr 0.65fr' : '1fr', alignItems: 'center', gap: 64 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
                <HeroNumber value={p.value} unit={p.unit} />
                {p.showCaption && (
                  <p style={{ margin: 0, fontSize: 'var(--gxn-fs-h3)', color: 'var(--gxn-dim)', maxWidth: 980, lineHeight: 1.4 }}>{p.caption}</p>
                )}
              </div>
              {p.showLead && (
                <div style={{ borderLeft: '2px solid rgba(var(--gxn-glow),0.4)', paddingLeft: 34 }}>
                  <p style={{ margin: 0, fontSize: 28, lineHeight: 1.6, color: 'var(--gxn-dim)' }}>{p.lead}</p>
                </div>
              )}
            </div>
            {support.length > 0 && SupportRow}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideBigNumber;
