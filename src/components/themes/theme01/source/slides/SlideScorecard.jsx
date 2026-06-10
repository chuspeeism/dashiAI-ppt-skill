// SlideScorecard.jsx — 标的评分卡 · 贴纸检查表 / single-subject due-diligence card.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A giant rotated "grade stamp" anchors the left; criteria rows on the right each
// carry a fluorescent score bar + a sticker verdict chip. One row (the weak link)
// can be lit. Criterion count, highlight, the grade stamp and accent are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '横向透视',
  title: '标的评分卡 · 尽调五维',
  en: 'Due-Diligence Scorecard',
  cn: '以头部大模型公司为样本的打分框架',
  subject: '通用大模型 · 头部梯队',
  grade: 'A−',
  gradeNote: '加权总分 81 / 100',
  criteria: [
    { name: '团队与履历', en: 'TEAM', score: 92, verdict: '优', color: '#5b8def' },
    { name: '技术壁垒', en: 'MOAT', score: 88, verdict: '优', color: '#46b083' },
    { name: '算力储备', en: 'COMPUTE', score: 95, verdict: '优', color: '#7a5ae0' },
    { name: '商业化进度', en: 'MONETIZATION', score: 72, verdict: '良', color: '#e0a23a' },
    { name: '估值合理性', en: 'VALUATION', score: 54, verdict: '弱', color: '#e8503a' },
  ],
  caption: '评分卡 · 强在团队与算力，弱在估值，与全篇风险判断一致',
  // tweakable (universal names)
  criterionCount: 5,
  highlight: true,
  highlightIndex: 4,
  showBars: true,
  showGrade: true,
  accentColor: '#e8503a',
  showCaption: true,
};

export const controls = [
  { key: 'criterionCount', label: '评分维度数量', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 项',
    description: '展示的尽调评分维度数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把某一行（短板）点亮成荧光。' },
  { key: 'highlightIndex', label: '强调第几项', type: 'number', default: 4, min: 0, max: 4, step: 1,
    description: '被强调的评分维度序号（从 0 开始）。' },
  { key: 'showBars', label: '分数条', type: 'boolean', default: true,
    description: '每项的荧光分数条显示（关闭则仅留分数与评级）。' },
  { key: 'showGrade', label: '总评印章', type: 'boolean', default: true,
    description: '左侧巨型总评等级印章的显示。' },
  { key: 'accentColor', label: '强调色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0', '#c9f24d'],
    description: '荧光强调行与印章的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const VERDICT_TONE = { '优': '#46b083', '良': '#e0a23a', '中': '#5b8def', '弱': '#e8503a' };

function Row({ c, on, accent, showBars }) {
  const tone = on ? accent : (VERDICT_TONE[c.verdict] || c.color);
  return (
    <div style={{
      flex: '1 1 0', minHeight: 0, display: 'flex', alignItems: 'center', gap: 28,
      padding: '0 32px', borderRadius: 22, position: 'relative', overflow: 'hidden',
      background: on ? hexA(accent, 0.13) : 'rgba(255,255,255,.54)',
      backdropFilter: 'blur(22px) saturate(140%)', WebkitBackdropFilter: 'blur(22px) saturate(140%)',
      border: `1px solid ${on ? hexA(accent, 0.5) : 'rgba(255,255,255,.72)'}`,
      boxShadow: on ? `0 16px 40px ${hexA(accent, 0.22)}` : '0 1px 0 rgba(255,255,255,.7) inset, 0 14px 34px rgba(70,72,100,.09)',
    }}>
      {/* label */}
      <div style={{ flex: '0 0 360px', minWidth: 0 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.05 }}>{c.name}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.12em', color: hexA(tone, 0.85), marginTop: 4 }}>{c.en}</div>
      </div>

      {/* fluorescent score bar */}
      {showBars && (
        <div style={{ flex: 1, minWidth: 0, height: 22, borderRadius: 11, background: hexA('#2b2b30', 0.08), position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${c.score}%`, borderRadius: 11,
            background: `linear-gradient(90deg, ${hexA(tone, 0.7)}, ${tone})`,
            boxShadow: on ? `0 0 0 1px ${hexA(accent, 0.4)}, 0 6px 16px ${hexA(accent, 0.45)}` : `0 4px 12px ${hexA(tone, 0.3)}` }} />
        </div>
      )}

      {/* score number */}
      <div style={{ flex: '0 0 auto', width: 96, textAlign: 'right', fontSize: 46, fontWeight: 900, letterSpacing: '-.02em', color: on ? accent : 'var(--aip-ink)' }}>{c.score}</div>

      {/* sticker verdict chip */}
      <span style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 58, height: 58, borderRadius: 14, background: tone, color: '#fff', fontSize: 30, fontWeight: 900,
        transform: on ? 'rotate(-5deg) scale(1.06)' : 'rotate(-3deg)', boxShadow: `0 12px 26px ${hexA(tone, 0.5)}` }}>{c.verdict}</span>
    </div>
  );
}

export default function SlideScorecard(props) {
  const p = { ...defaultProps, ...props };
  const items = p.criteria.slice(0, Math.max(3, Math.min(5, p.criterionCount)));
  const fg = '#23232a';

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={`# ${p.kicker}`} tone="red" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'grid', gridTemplateColumns: p.showGrade ? '0.78fr 1.22fr' : '1fr', gap: 52 }}>
        {/* ── left: giant grade stamp ── */}
        {p.showGrade && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 30 }}>
            <div style={{ position: 'relative', width: 360, height: 360, borderRadius: 40, transform: 'rotate(-4deg)',
              background: p.accentColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 30px 70px ${hexA(p.accentColor, 0.5)}, 0 3px 0 rgba(255,255,255,.4) inset`,
              border: `3px solid ${hexA('#ffffff', 0.55)}` }}>
              <div style={{ position: 'absolute', inset: 14, borderRadius: 30, border: '2px dashed rgba(255,255,255,.55)', pointerEvents: 'none' }} />
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, letterSpacing: '.2em', color: 'rgba(255,255,255,.85)', fontWeight: 700 }}>RATING</div>
              <div style={{ fontSize: 200, fontWeight: 900, color: '#fff', lineHeight: 0.82, letterSpacing: '-.03em' }}>{p.grade}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--aip-ink)' }}>{p.subject}</div>
              <div style={{ marginTop: 8, fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, letterSpacing: '.04em', color: hexA(p.accentColor, 0.95) }}>{p.gradeNote}</div>
            </div>
          </div>
        )}

        {/* ── right: criteria rows ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map((c, i) => (
            <Row key={i} c={c} on={p.highlight && i === p.highlightIndex} accent={p.accentColor} showBars={p.showBars} />
          ))}
        </div>
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
