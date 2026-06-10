/**
 * SlideManifesto.jsx — 结论主张（金句页 · 大字主张三联）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * A closing-thesis layout: a stack of numbered, oversized claim lines, each
 * with a glowing keyword fragment. Reads as a manifesto / conclusion rather
 * than an attributed quote. The claim count is tunable, one claim can be
 * emphasised (others dim), and the numbering / dividers are toggleable.
 *
 * ── Props (see slideManifestoDefaults) ──────────────────────────────────────
 *   kicker        string  mono eyebrow line
 *   claims        Array<{key,lead,em,tail}>  each big claim line
 *                         (key = short glowing tag, lead+em+tail = the line)
 *   claimCount    number  how many claims to render (slices `claims`)
 *   showIndex     boolean number each claim
 *   showDivider   boolean hairline rule between claims
 *   focusEnabled  boolean emphasise one claim (others dim)
 *   focusIndex    number  0-based claim to emphasise
 *   footnote      string  small closing line under the stack
 *   showFootnote  boolean show/hide the footnote
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideManifestoDefaults = {
  kicker: 'CONCLUSION · 三条核心结论',
  claims: [
    { key: '横向看集中', lead: '资金高度向头部公司、通用大模型与旧金山湾区集中，', em: '「赢家通吃」', tail: '格局确立。' },
    { key: '纵向看节奏', lead: '全年呈「前高后稳」，Q2–Q3 达峰后理性回落，市场由', em: '狂热转向分化', tail: '。' },
    { key: '结构看分层', lead: '上游确定性最强、中游竞争最激烈，下游潜力最大但', em: '仍需时间兑现', tail: '。' },
  ],
  claimCount: 3,
  showIndex: true,
  showDivider: true,
  focusEnabled: false,
  focusIndex: 0,
  footnote: '资本的下一阶段，将从「赌叙事」转向「看兑现」。',
  showFootnote: true,
};

export const slideManifestoControls = [
  { key: 'claimCount', type: 'number', label: '主张数量', default: 3, min: 2, step: 1,
    maxFrom: (p) => (p.claims ? p.claims.length : 3), describe: '展示的主张条数' },
  { key: 'showIndex', type: 'toggle', label: '编号', default: true,
    describe: '为每条主张显示序号' },
  { key: 'showDivider', type: 'toggle', label: '分隔线', default: true,
    describe: '在主张之间显示分隔线' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    describe: '是否高亮其中一条主张' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.claimCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled, describe: '被强调主张的序号' },
  { key: 'showFootnote', type: 'toggle', label: '收束句', default: true,
    describe: '显示/隐藏底部的收束句' },
];

export function SlideManifesto(props) {
  const p = { ...slideManifestoDefaults, ...props };
  const claims = (p.claims || []).slice(0, Math.max(2, p.claimCount));
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(claims.length - 1, p.focusIndex)) : -1;
  const fs = claims.length >= 4 ? 44 : claims.length === 3 ? 52 : 58;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad" style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 1560 }}>
          <p className="gxn-kicker gxn-rise">{p.kicker}</p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {claims.map((c, i) => {
              const focus = i === fIdx;
              const dim = fIdx >= 0 && !focus;
              return (
                <div key={i} className={cx('gxn-rise-2')} style={{
                  display: 'flex', gap: 36, alignItems: 'flex-start',
                  padding: '34px 0',
                  borderTop: p.showDivider && i > 0 ? '1px solid var(--gxn-line)' : 'none',
                  opacity: dim ? 0.4 : 1, transition: 'opacity .3s ease',
                }}>
                  {p.showIndex && (
                    <span className="gxn-num" style={{
                      flex: '0 0 auto', fontSize: fs * 0.92, fontWeight: 700, lineHeight: 1,
                      color: focus ? 'var(--gxn-accent)' : 'var(--gxn-faint)',
                      textShadow: focus ? '0 0 30px rgba(var(--gxn-glow),0.6)' : 'none',
                      minWidth: 86,
                    }}>{String(i + 1).padStart(2, '0')}</span>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                    <span className="gxn-mono" style={{ fontSize: 26, letterSpacing: '.08em', color: 'var(--gxn-accent)' }}>{c.key}</span>
                    <p style={{
                      margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700,
                      fontSize: fs, lineHeight: 1.24, letterSpacing: '-0.01em',
                      color: 'var(--gxn-text)', textWrap: 'pretty',
                    }}>
                      {c.lead}
                      {c.em && <span className="gxn-em">{c.em}</span>}
                      {c.tail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {p.showFootnote && p.footnote && (
            <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ width: 64, height: 3, borderRadius: 3, flex: '0 0 auto',
                             background: 'linear-gradient(90deg, var(--gxn-accent), transparent)',
                             boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
              <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-h3)', color: 'var(--gxn-dim)', letterSpacing: '.02em' }}>{p.footnote}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideManifesto;
