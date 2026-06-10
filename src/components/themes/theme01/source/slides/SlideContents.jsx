// SlideContents.jsx — 报告导览 / 目录 / agenda.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// 版式：SlideHead + 双栏「章节卡」网格（大号 mono 序号 + 标题 + EN + 一句话）。
// 刻意区别于附录页（单列分隔线清单）与结论页（等分大卡 + 深条）：此处是紧凑双栏导览网格。
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 报告导览',
  title: '目录 · 七个章节',
  en: 'Contents',
  cn: '横纵分析法贯穿全篇',
  chapters: [
    { no: '01', label: '研究方法', en: 'Methodology', desc: '横纵两维切入同一组数据，互为补充' },
    { no: '02', label: '市场全景', en: 'Market Overview', desc: '逐季度 / 月度融资走势与节奏' },
    { no: '03', label: '横向透视', en: 'Horizontal View', desc: '赛道、轮次、头部玩家与地区分布' },
    { no: '04', label: '产业链分层', en: 'Industry Chain', desc: '上游 — 中游 — 下游的层级结构' },
    { no: '05', label: '典型案例', en: 'Case Studies', desc: 'Anthropic / xAI / CoreWeave 深度剖析' },
    { no: '06', label: '风险与展望', en: 'Risks & Outlook', desc: '四重风险传导 + 阶段性策略' },
    { no: '07', label: '结论', en: 'Conclusion', desc: '横向集中 · 纵向节奏 · 结构分层' },
  ],
  caption: '导览 · 全篇结构一览',
  // tweakable
  chapterCount: 7,
  highlight: false,
  highlightIndex: 0,
  accentColor: '#5b8def',
  showDesc: true,
  showCaption: true,
};

export const controls = [
  { key: 'chapterCount', label: '章节数量', type: 'number', default: 7, min: 3, max: 7, step: 1, unit: ' 章',
    description: '目录展示的章节卡数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: false,
    description: '是否高亮强调其中一个章节（如「当前所在」）。' },
  { key: 'highlightIndex', label: '强调第几章', type: 'number', default: 0, min: 0, max: 6, step: 1,
    description: '被强调的章节序号（从 0 开始）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '序号与高亮的统一强调色。' },
  { key: 'showDesc', label: '章节简介', type: 'boolean', default: true,
    description: '是否在每张卡上显示一句话简介。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideContents(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const chs = p.chapters.slice(0, Math.max(3, Math.min(7, p.chapterCount)));

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '1fr',
        gap: 20, marginTop: 18, minHeight: 0 }}>
        {chs.map((c, i) => {
          const on = p.highlight && i === p.highlightIndex;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '0 34px', borderRadius: 22,
              background: on ? `linear-gradient(120deg, ${hexA(ac, 0.18)}, ${hexA(ac, 0.05)})` : 'rgba(255,255,255,.5)',
              border: `1px solid ${on ? hexA(ac, 0.5) : 'rgba(255,255,255,.75)'}`,
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              boxShadow: on ? `0 22px 50px ${hexA(ac, 0.22)}` : '0 1px 0 rgba(255,255,255,.7) inset, 0 16px 40px rgba(70,72,100,.1)' }}>
              <span style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontSize: 76, fontWeight: 700,
                lineHeight: 1, letterSpacing: '-.02em', color: on ? ac : hexA(ac, 0.5) }}>{c.no}</span>
              <span style={{ flex: '0 0 auto', width: 1, alignSelf: 'stretch', margin: '22px 0',
                background: hexA('#2b2b30', 0.12) }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 38, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.1 }}>{c.label}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, letterSpacing: '.12em',
                    textTransform: 'uppercase', color: hexA(ac, 0.8) }}>{c.en}</span>
                </div>
                {p.showDesc && <div style={{ marginTop: 6, fontSize: 25, color: 'var(--aip-ink-2)', fontWeight: 500, lineHeight: 1.4, textWrap: 'pretty' }}>{c.desc}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
