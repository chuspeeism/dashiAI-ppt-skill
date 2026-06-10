// SlideAppendix.jsx — 数据来源 / 附录 / 收尾页（独立版式）。
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// 版式刻意区别于结论页（结论 = 等分卡片网格 + 横向深条）：
//   左栏 = 编号「来源索引」清单（行 + 分隔线，非卡片）；右栏 = 单块磨砂玻璃「口径与说明」面板。
// 仍沿用系统基元：SlideHead 标题区 + 玻璃 + 单一 accent + mono 脚注。
import React from 'react';
import { SlideFrame, SlideHead, GlassCard, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 附录',
  title: '数据来源与研究说明',
  en: 'Sources & Methodology',
  cn: '数据口径与免责说明',
  listLabel: '数据来源 · SOURCES',
  sources: [
    { label: '公开融资数据库', note: 'PitchBook · Crunchbase 等一级市场数据' },
    { label: '企业公告与新闻', note: '官方披露 · 主流财经媒体报道' },
    { label: '行业研究报告', note: '一级 / 二级市场机构研究' },
    { label: '研究性推演补全', note: '部分数据缺口经建模估算' },
  ],
  panelLabel: '口径与说明 · NOTES',
  lead: '本报告聚焦 2024 全年单笔 ≥ 1 亿美元的公开融资事件，采用「横纵分析法」对全景、赛道、轮次、产业链与典型案例展开梳理。',
  meta: [
    { k: '编制日期', v: '2026-06-03' },
    { k: '数据口径', v: '2024 全年 ≥ 1 亿美元事件' },
    { k: '样本规模', v: '97 笔 · 970 亿美元' },
  ],
  disclaimer: '数据为调研整理，部分经研究性推演，仅供研究参考；内容由 AI 生成，请谨慎参考。',
  caption: '附录 · 数据来源与口径说明',
  // tweakable
  sourceCount: 4,
  highlight: false,
  highlightIndex: 3,
  accentColor: '#5b8def',
  showPanel: true,
  showDisclaimer: true,
  showCaption: true,
};

export const controls = [
  { key: 'sourceCount', label: '来源数量', type: 'number', default: 4, min: 0, max: 4, step: 1, unit: ' 类',
    description: '左栏来源索引的行数（0 时只显示右侧说明面板）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: false,
    description: '是否高亮强调其中一条来源。' },
  { key: 'highlightIndex', label: '强调第几条', type: 'number', default: 3, min: 0, max: 3, step: 1,
    description: '被强调的来源序号（从 0 开始）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '编号、分隔与高亮的统一强调色。' },
  { key: 'showPanel', label: '说明面板', type: 'boolean', default: true,
    description: '是否显示右侧「口径与说明」玻璃面板（关闭时来源清单占满整页）。' },
  { key: 'showDisclaimer', label: '免责声明', type: 'boolean', default: true,
    description: '是否在说明面板内显示免责声明。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideAppendix(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const sources = p.sources.slice(0, Math.max(0, Math.min(4, p.sourceCount)));
  const hasList = sources.length > 0;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, display: 'flex', gap: 56, marginTop: 18, minHeight: 0 }}>
        {/* 左栏 — 编号来源索引清单（行 + 分隔线） */}
        {hasList && (
          <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, letterSpacing: '.14em',
              color: hexA(ac, 0.9), fontWeight: 700, marginBottom: 6 }}>{p.listLabel}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {sources.map((s, i) => {
                const on = p.highlight && i === p.highlightIndex;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 30,
                    padding: '0 22px', borderTop: i === 0 ? 'none' : `1px solid ${hexA('#2b2b30', 0.12)}`,
                    borderRadius: on ? 18 : 0,
                    background: on ? `linear-gradient(120deg, ${hexA(ac, 0.16)}, ${hexA(ac, 0.04)})` : 'transparent',
                    boxShadow: on ? `inset 0 0 0 1px ${hexA(ac, 0.4)}` : 'none' }}>
                    <span style={{ flex: '0 0 auto', width: 92, fontFamily: "'Space Mono', monospace",
                      fontSize: 70, fontWeight: 700, lineHeight: 1, letterSpacing: '-.02em',
                      color: on ? ac : hexA(ac, 0.55) }}>{String(i + 1).padStart(2, '0')}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.15 }}>{s.label}</div>
                      <div style={{ fontSize: 25, color: 'var(--aip-ink-3)', fontWeight: 500, marginTop: 4, textWrap: 'pretty' }}>{s.note}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 右栏 — 单块磨砂玻璃「口径与说明」面板 */}
        {p.showPanel && (
          <GlassCard style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '44px 46px',
            justifyContent: 'center', minWidth: 0 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, letterSpacing: '.14em',
              color: hexA(ac, 0.9), fontWeight: 700 }}>{p.panelLabel}</div>

            <p style={{ margin: '20px 0 0', fontSize: 28, lineHeight: 1.55, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.lead}</p>

            <div style={{ height: 1, background: hexA('#2b2b30', 0.12), margin: '26px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {p.meta.map((m, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ flex: '0 0 168px', fontFamily: "'Space Mono', monospace", fontSize: 23,
                    letterSpacing: '.04em', color: 'var(--aip-ink-3)' }}>{m.k}</span>
                  <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--aip-ink)' }}>{m.v}</span>
                </div>
              ))}
            </div>

            {p.showDisclaimer && (
              <>
                <div style={{ height: 1, background: hexA('#2b2b30', 0.12), margin: '26px 0' }} />
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flex: '0 0 auto', width: 11, height: 11, borderRadius: '50%', background: ac, marginTop: 11 }} />
                  <span style={{ fontSize: 24, lineHeight: 1.5, color: 'var(--aip-ink-3)', fontWeight: 500, textWrap: 'pretty' }}>{p.disclaimer}</span>
                </div>
              </>
            )}
          </GlassCard>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
