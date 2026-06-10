/**
 * SlideTimeline.jsx — Slide 05 · 时间轴 / 资本节奏关键里程碑.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * ── Props (see slideTimelineDefaults) ───────────────────────────────────────
 *   kicker, title, titleEm          strings
 *   items        Array<{date,tag,title,desc}>  milestone dataset (text)
 *   itemCount    number   how many of `items` to show
 *   orientation  'horizontal' | 'vertical'   axis direction
 *   focusEnabled boolean  glow-emphasise one milestone
 *   focusIndex   number   0-based milestone to emphasise (clamped)
 *   showConnector boolean show/hide the connecting axis line
 *   showMeta     boolean  show/hide the description line under each title
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideTimelineDefaults = {
  kicker: 'TIMELINE · 资本节奏',
  title: '2024 关键融资里程碑 ',
  titleEm: '前高后稳',
  items: [
    { date: '2024 · Q1', tag: '市场回暖', title: '单季 162 亿美元', desc: '18 笔大额事件，情绪自年初快速回暖。' },
    { date: '2024 · 05', tag: 'Anthropic Series G', title: '融资 280 亿 · 估值 600 亿', desc: '安全对齐路线获企业信任，开启反超序章。' },
    { date: '2024 · 08', tag: '集中关账', title: '单月峰值 118 亿', desc: '多家头部公司同期完成大额轮次。' },
    { date: '2024 · 11', tag: 'xAI / Anthropic', title: '估值登顶 9650 亿', desc: 'xAI 融资 50 亿，Anthropic 扩轮 190 亿。' },
    { date: '2024 · Q4', tag: '理性回落', title: '单季 206 亿 仍处高位', desc: '从狂热转向分化，资本回归兑现逻辑。' },
    { date: '2026 · 06', tag: 'IPO 在即', title: 'Anthropic 递交上市申请', desc: '一级市场盛宴向二级市场传导。' },
  ],
  itemCount: 5,
  orientation: 'horizontal',
  focusEnabled: true,
  focusIndex: 3,
  showConnector: true,
  showMeta: true,
};

export const slideTimelineControls = [
  { key: 'itemCount', type: 'number', label: '节点数量', default: 5, min: 3, step: 1,
    maxFrom: (p) => (p.items ? p.items.length : 6), describe: '时间轴节点数量' },
  { key: 'orientation', type: 'enum', label: '轴向', default: 'horizontal',
    options: [{ value: 'horizontal', label: '横向' }, { value: 'vertical', label: '纵向' }],
    describe: '时间轴排布方向' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮某一节点' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 3, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.itemCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调节点的序号' },
  { key: 'showConnector', type: 'toggle', label: '连接轴线', default: true,
    describe: '显示/隐藏贯穿节点的轴线' },
  { key: 'showMeta', type: 'toggle', label: '描述文案', default: true,
    describe: '显示/隐藏节点的补充描述' },
];

function Dot({ focus }) {
  return (
    <span style={{
      width: focus ? 30 : 18, height: focus ? 30 : 18, borderRadius: '50%', flex: '0 0 auto',
      background: focus ? 'radial-gradient(circle at 35% 30%, var(--gxn-accent-2), var(--gxn-accent))' : 'var(--gxn-bg)',
      border: `3px solid ${focus ? 'transparent' : 'var(--gxn-accent)'}`,
      boxShadow: focus ? '0 0 34px -2px rgba(var(--gxn-glow),0.9)' : '0 0 16px -2px rgba(var(--gxn-glow),0.55)',
      transition: 'all .3s ease',
    }} />
  );
}

export function SlideTimeline(props) {
  const p = { ...slideTimelineDefaults, ...props };
  const count = Math.max(2, Math.min(p.items.length, p.itemCount));
  const items = p.items.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const horizontal = p.orientation === 'horizontal';

  const Card = ({ it, isF, isDim, style }) => (
    <div className={cx('gxn-panel', isF && 'is-focus')}
         style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 10,
                  opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease', ...style }}>
      <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-accent)', letterSpacing: '.05em' }}>{it.tag}</span>
      <h3 style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.18, color: 'var(--gxn-text)' }}>{it.title}</h3>
      {p.showMeta && <p style={{ margin: 0, fontSize: 24, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{it.desc}</p>}
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "06 / 23"} />

        {horizontal ? (
          <div className="gxn-rise-2" style={{
            flex: 1, marginTop: 56, display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`,
            columnGap: 28, position: 'relative', minHeight: 0,
          }}>
            {/* connector line through the dot band */}
            {p.showConnector && (
              <div style={{
                position: 'absolute', top: 63, left: `calc(100% / ${count} / 2)`, width: `calc(100% - 100% / ${count})`,
                height: 2, transform: 'translateY(-1px)',
                background: 'linear-gradient(90deg, transparent, var(--gxn-accent) 12%, var(--gxn-accent) 88%, transparent)',
                boxShadow: '0 0 14px rgba(var(--gxn-glow),0.6)', opacity: 0.55,
              }} />
            )}
            {items.map((it, i) => {
              const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                  <span className="gxn-num" style={{ fontSize: 26, lineHeight: '32px', height: 32, display: 'flex', alignItems: 'center', fontWeight: 600, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)', opacity: isDim ? 0.6 : 1, marginBottom: 16, whiteSpace: 'nowrap' }}>{it.date}</span>
                  <div style={{ height: 30, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}><Dot focus={isF} /></div>
                  <Card it={it} isF={isF} isDim={isDim} style={{ marginTop: 22, width: '100%' }} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, position: 'relative', minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 4 }}>
            {p.showConnector && (
              <div style={{
                position: 'absolute', left: 14, top: 24, bottom: 24, width: 2,
                background: 'linear-gradient(180deg, transparent, var(--gxn-accent) 10%, var(--gxn-accent) 90%, transparent)',
                boxShadow: '0 0 14px rgba(var(--gxn-glow),0.6)', opacity: 0.55,
              }} />
            )}
            {items.map((it, i) => {
              const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 220px 1fr', alignItems: 'center', columnGap: 34 }}>
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}><Dot focus={isF} /></div>
                  <span className="gxn-num" style={{ fontSize: 30, fontWeight: 600, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-dim)', opacity: isDim ? 0.6 : 1, whiteSpace: 'nowrap' }}>{it.date}</span>
                  <Card it={it} isF={isF} isDim={isDim} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideTimeline;
