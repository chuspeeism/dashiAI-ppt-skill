// SwSlideTimeline.jsx — horizontal roadmap "时间轴" page.
//
// A milestone track where each node carries a COLOUR-BLOCKED card below the
// connector line, so the roadmap fills the frame instead of floating on a thin
// rule. Count (3–5), the current/"focus" milestone, progress fill, descriptions
// and intro are all props-controlled; all visible copy/data defaults live in
// `defaultProps`. No global side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'timeline', index: 77, label: '时间轴 / Roadmap' };

export const defaultProps = {
  accent: C.orange,
  milestoneCount: 5,        // 3–5 nodes
  focus: true,              // highlight the current milestone
  focusIndex: 4,            // which node is "now" (1-based)
  showProgress: true,       // fill the connector up to focus
  showDescriptions: true,
  showIntro: true,
  // —— content ——
  barMeta: '77 — Roadmap',
  kicker: '路线图 / Roadmap',
  title: '已经在路上，[[还在加速]]。',
  nowLabel: 'Now',
  milestones: [
    { q: '2024 · Q3', t: '声浪上线', d: '发行 + 结算闭环首发。' },
    { q: '2025 · Q1', t: '版权护盾', d: '全网监测与一键维权。' },
    { q: '2025 · Q4', t: '粉丝直连', d: '会员与专属创作者页面。' },
    { q: '2026 · Q2', t: '数据洞察', d: '听众画像与增长工具。' },
    { q: '2026 · Q4', t: '全球结算', d: '多币种实时透明分账。' },
  ],
  page: '77',
  total: '82',
};

export const controls = [
  { key: 'milestoneCount', label: '节点数量', type: 'slider', def: 5, min: 3, max: 5, step: 1,
    desc: '时间轴上的里程碑数量' },
  { key: 'focus', label: '当前进度', type: 'toggle', def: true, desc: '高亮“当前”所处的里程碑' },
  { key: 'focusIndex', label: '进行到第几个', type: 'slider', def: 4, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '当前里程碑的序号（1 起）' },
  { key: 'showProgress', label: '进度填充', type: 'toggle', def: true, desc: '连接线按当前进度着色填充' },
  { key: 'showDescriptions', label: '节点描述', type: 'toggle', def: true, desc: '显示/隐藏每个节点的描述文字' },
  { key: 'showIntro', label: '显示引言', type: 'toggle', def: true, desc: '显示/隐藏顶部标题与引言' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '当前节点 / 进度 / 页脚强调色' },
];

export default function SwSlideTimeline(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.milestoneCount));
  const now = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) : 0;
  const items = (p.milestones || []).slice(0, count);

  const half = 50 / count;
  const lineLeft = half + '%';
  const lineWidth = (100 - 2 * half) + '%';
  const progress = now > 1 ? ((now - 1) / (count - 1)) * (100 - 2 * half) : 0;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 3, padding: '8px 0' }}>

        {p.showIntro && (
          <div style={{ flexShrink: 0, margin: '22px 0 30px' }}>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
        )}

        {/* year row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + count + ',1fr)', flexShrink: 0 }}>
          {items.map((m, i) => {
            const isNow = (i + 1) === now;
            return (
              <div key={m.q} style={{ textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 24,
                letterSpacing: '.06em', color: isNow ? accent : C.inkMut }}>{m.q}</div>
            );
          })}
        </div>

        {/* track */}
        <div style={{ position: 'relative', flexShrink: 0, height: 44, marginTop: 18 }}>
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lineLeft, width: lineWidth, height: 4,
            background: C.line2, borderRadius: 999 }} />
          {p.showProgress && now > 1 && (
            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lineLeft, width: progress + '%', height: 4,
              background: accent, borderRadius: 999 }} />
          )}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', alignItems: 'center',
            gridTemplateColumns: 'repeat(' + count + ',1fr)' }}>
            {items.map((m, i) => {
              const isNow = (i + 1) === now;
              const past = now > 0 && (i + 1) < now;
              const pal = swCardPalette[i % swCardPalette.length];
              const dotColor = isNow || past ? accent : pal.bg;
              return (
                <div key={m.t} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {isNow ? (
                    <span style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%',
                      background: accent, boxShadow: '0 0 0 9px ' + accent + '22',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#fff' }} />
                    </span>
                  ) : (
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: dotColor,
                      border: '5px solid ' + C.blush, boxShadow: '0 0 0 2px ' + dotColor }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* milestone cards */}
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 18, marginTop: 22,
          gridTemplateColumns: 'repeat(' + count + ',1fr)', gridAutoRows: '1fr' }}>
          {items.map((m, i) => {
            const isNow = (i + 1) === now;
            const pal = swCardPalette[i % swCardPalette.length];
            const cardBg = isNow ? accent : pal.bg;
            const titleC = isNow ? '#fff' : pal.title;
            const bodyC = isNow ? 'rgba(255,255,255,.92)' : pal.body;
            const numC = isNow ? 'rgba(255,255,255,.6)' : pal.name;
            return (
              <div key={m.t} style={{ position: 'relative', overflow: 'hidden', borderRadius: 22,
                background: cardBg, color: bodyC, padding: '28px 28px 26px', display: 'flex', flexDirection: 'column',
                transform: isNow ? 'translateY(-8px)' : 'none',
                boxShadow: isNow ? '0 20px 46px rgba(20,15,16,.22)' : 'none' }}>
                <div aria-hidden="true" style={{ position: 'absolute', top: -26, right: -6, fontFamily: F.mono,
                  fontWeight: 700, fontSize: 130, lineHeight: 0.8, color: 'transparent',
                  WebkitTextStroke: '2px ' + numC, opacity: .5, pointerEvents: 'none', zIndex: 0 }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  {isNow && (
                    <span style={{ display: 'inline-block', fontFamily: F.mono, fontWeight: 700, fontSize: 19,
                      letterSpacing: '.1em', textTransform: 'uppercase', color: accent, background: '#fff',
                      borderRadius: 999, padding: '3px 14px', marginBottom: 14 }}>{p.nowLabel}</span>
                  )}
                </div>
                <div style={{ position: 'relative', zIndex: 1, marginTop: 'auto' }}>
                  <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-.5px', color: titleC }}>{m.t}</div>
                  {p.showDescriptions && (
                    <p style={{ fontSize: 23, lineHeight: 1.5, color: bodyC, marginTop: 10 }}>{m.d}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
