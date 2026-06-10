/**
 * SlideLinkedSpheres.jsx — 三球串联（关系图 · 横向阶段流）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 参考「N 个大圆横向并列 + 中间连接标签」逻辑板式：每个球体一个阶段，
 * 含标记、标题与说明，球之间用连接标签衔接，表达递进 / 传导关系。
 *
 * ── Props (see slideLinkedSpheresDefaults) ──────────────────────────────────
 *   kicker, title, titleEm, index, lead, ghost   strings（ghost = 背景大字英文）
 *   nodes        Array<{tag,label,desc}>  阶段球 (text)
 *   nodeCount    number   球体数量（2–4）
 *   connectors   Array<{label}>  球之间的连接标签（取前 nodeCount-1 个）
 *   focusEnabled boolean  高亮某一阶段
 *   focusIndex   number   0-based 被强调球
 *   showConnectors boolean 显示连接标签
 *   showDesc     boolean  显示球内说明
 *   showGhost    boolean  显示背景大字英文
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideLinkedSpheresDefaults = {
  kicker: 'THESIS · 资本主线',
  title: '资本逻辑 ',
  titleEm: '三段演进',
  index: '10 / 27',
  lead: '2024 的资本主线，是从「叙事驱动」转向「兑现驱动」——市场开始分辨谁能把技术真正跑成可持续收入。',
  ghost: 'narrative to revenue',
  nodes: [
    { tag: 'PHASE 01', label: '叙事驱动', desc: 'AGI 故事吸金，估值脱离当期收入，资本押注未来市值。' },
    { tag: 'PHASE 02', label: '分化验证', desc: '资本开始分辨商业闭环，头部集中、长尾承压。' },
    { tag: 'PHASE 03', label: '兑现驱动', desc: '收入确定性、客户留存成为新的估值标尺。' },
  ],
  nodeCount: 3,
  connectors: [{ label: '估值高企' }, { label: '理性回归' }, { label: '价值重估' }],
  focusEnabled: true,
  focusIndex: 2,
  showConnectors: true,
  showDesc: true,
  showGhost: true,
};

export const slideLinkedSpheresControls = [
  { key: 'nodeCount', type: 'number', label: '球体数量', default: 3, min: 2, max: 4, step: 1,
    maxFrom: (p) => (p.nodes ? p.nodes.length : 3), describe: '横向并列的阶段球数量' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '是否高亮其中一个阶段' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 2, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.nodeCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调阶段的序号' },
  { key: 'showConnectors', type: 'toggle', label: '连接标签', default: true,
    describe: '球之间的连接标签显隐' },
  { key: 'showDesc', type: 'toggle', label: '球内说明', default: true,
    describe: '球内说明文案显隐' },
  { key: 'showGhost', type: 'toggle', label: '背景大字', default: true,
    describe: '标题后的背景大字英文显隐' },
];

function Marker({ focus }) {
  return (
    <div style={{ width: 58, height: 58, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${focus ? 'var(--gxn-accent)' : 'rgba(var(--gxn-glow),0.5)'}`,
                  boxShadow: focus ? '0 0 26px -4px rgba(var(--gxn-glow),0.8)' : 'none' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%',
                     background: 'radial-gradient(circle at 35% 30%, var(--gxn-accent-2), var(--gxn-accent))',
                     boxShadow: '0 0 16px -2px rgba(var(--gxn-glow),0.9)' }} />
    </div>
  );
}

export function SlideLinkedSpheres(props) {
  const p = { ...slideLinkedSpheresDefaults, ...props };
  const count = Math.max(2, Math.min(p.nodes.length, p.nodeCount));
  const nodes = p.nodes.slice(0, count);
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(count - 1, p.focusIndex)) : -1;
  const conns = (p.connectors || []).slice(0, Math.max(0, count - 1));
  const dia = count >= 4 ? 318 : count === 3 ? 372 : 420;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad" style={{ overflow: 'hidden' }}>
        {/* ghost backdrop word */}
        {p.showGhost && p.ghost && (
          <span aria-hidden="true" style={{
            position: 'absolute', top: 96, left: 100, right: 100, zIndex: 0, pointerEvents: 'none',
            fontFamily: 'var(--gxn-font-display)', fontStyle: 'italic', fontWeight: 700,
            fontSize: 132, lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden',
            color: 'transparent', WebkitTextStroke: '1.5px rgba(var(--gxn-glow),0.12)',
          }}>{p.ghost}</span>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index} />
          <p className="gxn-sub gxn-rise" style={{ marginTop: 20, maxWidth: 1320 }}>{p.lead}</p>
        </div>

        <div className="gxn-rise-2" style={{ position: 'relative', zIndex: 1, flex: 1, marginTop: 6, display: 'flex',
                                             alignItems: 'center', justifyContent: 'center', gap: 0, minHeight: 0 }}>
          {nodes.map((n, i) => {
            const isF = i === fIdx; const isDim = fIdx >= 0 && !isF;
            return (
              <React.Fragment key={i}>
                <div className={cx('gxn-panel', isF && 'is-focus')} style={{
                  width: dia, height: dia, borderRadius: '50%', flex: '0 0 auto',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 14, padding: '0 46px', textAlign: 'center',
                  opacity: isDim ? 0.5 : 1, transition: 'opacity .3s ease',
                }}>
                  <Marker focus={isF} />
                  <span className="gxn-mono" style={{ fontSize: 22, color: 'var(--gxn-faint)', letterSpacing: '.12em' }}>{n.tag}</span>
                  <span style={{ fontSize: 42, fontWeight: 700, color: isF ? 'var(--gxn-accent)' : 'var(--gxn-text)', lineHeight: 1.1 }}>{n.label}</span>
                  {p.showDesc && <span style={{ fontSize: 23, lineHeight: 1.45, color: 'var(--gxn-dim)' }}>{n.desc}</span>}
                </div>

                {i < count - 1 && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, minWidth: 60, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -10, right: -10, top: '50%', height: 2,
                                  background: 'linear-gradient(90deg, rgba(var(--gxn-glow),0.15), rgba(var(--gxn-glow),0.6), rgba(var(--gxn-glow),0.15))' }} />
                    {p.showConnectors && conns[i] && (
                      <span className="gxn-mono" style={{ position: 'relative', fontSize: 22, color: 'var(--gxn-accent)',
                        padding: '7px 16px', borderRadius: 999, whiteSpace: 'nowrap',
                        border: '1px solid rgba(var(--gxn-glow),0.4)', background: 'var(--gxn-bg)' }}>{conns[i].label}</span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlideLinkedSpheres;
