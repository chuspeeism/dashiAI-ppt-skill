/**
 * SlideCoverBeam.jsx — 封面变体 A · 居中聚光 / Centered Beam Cover.
 *
 * Independent, prop-driven. Renders its own theme styles via <ThemeStyle/>.
 * Migration: `import React from 'react'`, drop this file + gxnTheme in.
 *
 * 版式特征：纵向居中对称。标题后方一束径向辉光（beam），上有居中 kicker（两侧短线），
 * 标题两行（次行 .gxn-em 流光强调），下接发光分隔线、副标题，底部一排迷你数据。
 *
 * ── Props（完整默认见 slideCoverBeamDefaults）──────────────────────────────
 *   kicker      string   居中 mono 眉题
 *   title       string   主标题第一行
 *   titleEm     string   主标题第二行（发光强调）
 *   subtitle    string   副标题
 *   stats       {value,unit,label}[]   底部迷你数据（按 statCount 截取）
 *   meta        string[] 底部附注（报告日期 / 口径 / 落款）
 *   focusEnabled boolean 标题发光强调
 *   showKicker  boolean  眉题显隐
 *   showRule    boolean  发光分隔线显隐
 *   statCount   number   底部迷你数据数量（0 = 隐藏整行）
 *   showMeta    boolean  底部附注显隐
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';

export const slideCoverBeamDefaults = {
  kicker: 'GENERATIVE AI · INDUSTRY LANDSCAPE · 2026',
  title: '2026 全球生成式 AI',
  titleEm: '产业全景报告',
  subtitle: '横跨模型、算力、应用与生态四层结构，沿资本与采用度两条主线，勾勒出这一年的产业地形与拐点。',
  stats: [
    { value: '1,240', unit: '亿美元', label: '全年产业总投入' },
    { value: '58', unit: '%', label: '企业级渗透率' },
    { value: '7', unit: '大赛道', label: '核心结构分层' },
  ],
  meta: ['编制 2026-06 · 季度刊', '数据口径 公开披露', '仅供研究参考'],
  focusEnabled: true,
  showKicker: true,
  showRule: true,
  statCount: 3,
  showMeta: true,
};

export const slideCoverBeamControls = [
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: true,
    describe: '主标题次行做发光流光强调' },
  { key: 'showKicker', type: 'toggle', label: '眉题', default: true,
    describe: '显示/隐藏标题上方的居中眉题' },
  { key: 'showRule', type: 'toggle', label: '发光分隔线', default: true,
    describe: '标题与副标题之间的发光分隔线' },
  { key: 'statCount', type: 'number', label: '底部数据', default: 3, min: 0, max: 3, step: 1,
    describe: '底部一排迷你数据的数量（0 = 隐藏）' },
  { key: 'showMeta', type: 'toggle', label: '附注信息', default: true,
    describe: '显示/隐藏底部的日期与口径附注' },
];

export function SlideCoverBeam(props) {
  const p = { ...slideCoverBeamDefaults, ...props };
  const stats = (p.stats || []).slice(0, Math.max(0, p.statCount));

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      {/* 径向聚光 beam — 在标题后方，不含线条，安全 */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%,-50%)',
        width: 1280, height: 1280, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, rgba(var(--gxn-glow),0.20), rgba(var(--gxn-glow),0.06) 38%, transparent 66%)',
        filter: 'blur(8px)',
      }} />
      <div className="gxn-pad" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 38, maxWidth: 1500, zIndex: 1 }}>

          {p.showKicker && (
            <div className="gxn-rise" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span aria-hidden="true" style={{ width: 56, height: 2, borderRadius: 2,
                background: 'linear-gradient(90deg, transparent, var(--gxn-accent))',
                boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
              <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', letterSpacing: '.2em',
                textTransform: 'uppercase', color: 'var(--gxn-accent)',
                textShadow: '0 0 18px rgba(var(--gxn-glow),0.55)' }}>{p.kicker}</span>
              <span aria-hidden="true" style={{ width: 56, height: 2, borderRadius: 2,
                background: 'linear-gradient(90deg, var(--gxn-accent), transparent)',
                boxShadow: '0 0 14px rgba(var(--gxn-glow),0.8)' }} />
            </div>
          )}

          <h1 className="gxn-title gxn-rise-2" style={{ fontSize: 'var(--gxn-fs-display)', lineHeight: 1.1 }}>
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>{p.title}</span>
            <span className={cx(p.focusEnabled && 'gxn-em')} style={{ display: 'block', whiteSpace: 'nowrap' }}>{p.titleEm}</span>
          </h1>

          {p.showRule && (
            <div className="gxn-rise-2" aria-hidden="true" style={{ width: 360, height: 2, borderRadius: 2,
              background: 'linear-gradient(90deg, transparent, rgba(var(--gxn-glow),0.9) 22%, rgba(var(--gxn-glow),0.9) 78%, transparent)',
              boxShadow: '0 0 18px rgba(var(--gxn-glow),0.6)' }} />
          )}

          <p className="gxn-sub gxn-rise-3" style={{ maxWidth: 980, textWrap: 'pretty' }}>{p.subtitle}</p>

          {stats.length > 0 && (
            <div className="gxn-rise-3" style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginTop: 14 }}>
              {stats.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', margin: '6px 0',
                    background: 'linear-gradient(180deg, transparent, var(--gxn-line), transparent)' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 46px' }}>
                    <span className="gxn-num" style={{ fontSize: 60, fontWeight: 600, lineHeight: 0.95,
                      letterSpacing: '-0.02em', color: 'var(--gxn-text)' }}>
                      {s.value}
                      {s.unit && <span style={{ fontSize: 24, marginLeft: 6, color: 'var(--gxn-dim)', fontWeight: 500 }}>{s.unit}</span>}
                    </span>
                    <span className="gxn-mono" style={{ fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="gxn-rise-4 gxn-mono" style={{ display: 'flex', gap: 28, flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center', zIndex: 1,
            fontSize: 'var(--gxn-fs-label)', color: 'var(--gxn-faint)' }}>
            {p.meta.map((m, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.5 }}>·</span>}
                <span>{m}</span>
              </React.Fragment>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
}

export default SlideCoverBeam;
