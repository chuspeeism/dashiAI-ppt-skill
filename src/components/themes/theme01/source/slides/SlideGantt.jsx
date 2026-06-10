// SlideGantt.jsx — 时间轴页 · 甘特排期图（duration bars on a quarter axis）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；样式收在
// `.aip-root` 作用域（沿用 SlideKit 主题，不污染全局，不依赖 window）。
//
// 设计：横向季度轴打底，每家公司一条占据若干季度的「窗口条」，条末缀一枚里程碑
// 圆点（递表 / 上市）。一根「今天」竖线贯穿全图，把已发生与待兑现一刀切开；可把
// 某条提为荧光主条（加粗 + 发光 + 放大里程碑）。纯 CSS 网格，导出 PDF/PPTX 干净。
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';
import { THEME } from './theme.js';

export const defaultProps = {
  kicker: '风险与展望 · 退出排期',
  tone: 'red',
  title: 'IPO 上市窗口 · 排队时刻表',
  en: 'The Exit Window, Quarter by Quarter',
  cn: '头部公司从递表到挂牌的预计窗口',
  // 时间轴刻度（列）
  periods: ['25Q3', '25Q4', '26Q1', '26Q2', '26Q3', '26Q4', '27Q1', '27Q2'],
  // start=起始列(0基), span=跨列数, status 决定配色, milestone=条末事件
  bars: [
    { label: 'CoreWeave', en: 'AI 基础设施', start: 0, span: 2, status: 'done', milestone: '已挂牌', meta: '算力租赁 · 首个上市' },
    { label: 'Anthropic', en: '通用大模型', start: 1, span: 4, status: 'active', milestone: '递表→上市', meta: '已递交 S-1' },
    { label: 'Databricks', en: 'AI 基础设施', start: 2, span: 3, status: 'active', milestone: '预计挂牌', meta: '数据 + AI 平台' },
    { label: 'xAI', en: '通用大模型', start: 3, span: 4, status: 'planned', milestone: '筹备中', meta: '估值待二级检验' },
    { label: 'Perplexity', en: 'AI 搜索', start: 4, span: 3, status: 'planned', milestone: '观望窗口', meta: '收入兑现待验' },
    { label: 'Figure AI', en: '具身智能', start: 5, span: 3, status: 'planned', milestone: '远期候选', meta: '量产决定节奏' },
  ],
  nowIndex: 2,            // 「今天」竖线落在哪一列的起点（0 基）
  note: '2026 全年是退出窗口最密集的一段——一级市场的天价估值，正排队接受二级市场真金白银的检验。',
  // tweakable（通用命名）
  itemCount: 6,
  highlight: true,
  highlightIndex: 1,
  showNow: true,
  showGrid: true,
  showMeta: true,
  showMilestone: true,
  showNote: true,
  accentColor: '#e8503a',
  showCaption: true,
  caption: '甘特排期 · 2026 退出窗口最密集',
};

export const controls = [
  { key: 'itemCount', label: '公司条数', type: 'number', default: 6, min: 3, max: 6, step: 1, unit: ' 家',
    description: '时间表上展示的公司条数。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把某一条渲染成荧光主条（加粗 + 发光）。' },
  { key: 'highlightIndex', label: '强调第几条', type: 'number', default: 1, min: 0, max: 5, step: 1,
    description: '被强调的公司序号（0 基）。' },
  { key: 'showNow', label: '「今天」竖线', type: 'boolean', default: true,
    description: '贯穿全图的「今天」分隔竖线的显示。' },
  { key: 'showGrid', label: '季度网格', type: 'boolean', default: true,
    description: '纵向季度分隔网格的显示。' },
  { key: 'showMeta', label: '副标说明', type: 'boolean', default: true,
    description: '每条标签下方赛道 / 说明的显示。' },
  { key: 'showMilestone', label: '里程碑徽标', type: 'boolean', default: true,
    description: '条末里程碑圆点与事件标签的显示。' },
  { key: 'showNote', label: '核心发现', type: 'boolean', default: true,
    description: '底部「核心发现」说明卡的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '「今天」竖线、强调条与核心发现卡的主题色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

// 状态 → 配色（done 已完成 / active 进行中 / planned 计划中）
const STATUS = {
  done: { c: THEME.green, label: '已完成' },
  active: { c: THEME.blue, label: '进行中' },
  planned: { c: THEME.ink3, label: '计划中' },
};

export default function SlideGantt(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const periods = p.periods;
  const nP = periods.length;
  const bars = p.bars.slice(0, Math.max(3, Math.min(6, p.itemCount)));
  const focus = p.highlight ? Math.max(0, Math.min(bars.length - 1, p.highlightIndex)) : -1;
  const colPct = 100 / nP;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '20px 44px 18px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* 时间轴表头 */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ flex: '0 0 340px' }} />
          <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
            {periods.map((lab, k) => {
              const yr = lab.slice(0, 2), q = lab.slice(2);
              const newYear = k === 0 || periods[k - 1].slice(0, 2) !== yr;
              return (
                <div key={k} style={{ flex: `0 0 ${colPct}%`, textAlign: 'center',
                  borderLeft: newYear ? '2px solid rgba(43,43,48,.18)' : '1px solid rgba(43,43,48,.08)', paddingBottom: 8 }}>
                  {newYear && (
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, fontWeight: 700,
                      color: 'var(--aip-ink-2)', letterSpacing: '.04em' }}>20{yr}</div>
                  )}
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700,
                    color: 'var(--aip-ink-3)', marginTop: newYear ? 2 : 24 }}>{q}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 行区（含网格 + 今天竖线，绝对定位贯穿） */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* 背景网格 + 今天线，限定在右侧轨道区 */}
          <div style={{ position: 'absolute', left: 340, right: 0, top: 0, bottom: 0, pointerEvents: 'none' }}>
            {p.showGrid && periods.map((_, k) => (
              <div key={k} style={{ position: 'absolute', left: `${k * colPct}%`, top: 0, bottom: 0,
                width: 1, background: 'rgba(43,43,48,.07)' }} />
            ))}
            {p.showNow && (
              <div style={{ position: 'absolute', left: `${p.nowIndex * colPct}%`, top: -6, bottom: 0, width: 0,
                borderLeft: `2.5px dashed ${hexA(ac, 0.8)}` }}>
                <span style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: "'Space Mono', monospace", fontSize: 17, fontWeight: 700, color: '#fff',
                  background: ac, padding: '3px 12px', borderRadius: 8, whiteSpace: 'nowrap',
                  boxShadow: `0 8px 18px -6px ${hexA(ac, 0.7)}` }}>今天</span>
              </div>
            )}
          </div>

          {bars.map((b, i) => {
            const on = p.highlight && i === focus;
            const st = STATUS[b.status] || STATUS.planned;
            const c = on ? ac : st.c;
            const leftPct = b.start * colPct;
            const widthPct = b.span * colPct;
            const barH = on ? 46 : 38;
            return (
              <div key={i} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center',
                borderTop: i ? '1px solid rgba(43,43,48,.07)' : 'none' }}>
                {/* label */}
                <div style={{ flex: '0 0 340px', minWidth: 0, paddingRight: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                  <span style={{ fontSize: on ? 32 : 28, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1.1,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>
                  {p.showMeta && (
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: 'var(--aip-ink-3)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.en}{b.meta ? ` · ${b.meta}` : ''}</span>
                  )}
                </div>

                {/* track */}
                <div style={{ flex: 1, minWidth: 0, position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: `${leftPct}%`, width: `${widthPct}%`, height: barH,
                    borderRadius: 999, display: 'flex', alignItems: 'center', paddingLeft: 20, paddingRight: 16,
                    background: on
                      ? `linear-gradient(90deg, ${hexA(c, 0.82)}, ${c})`
                      : `linear-gradient(90deg, ${hexA(c, 0.42)}, ${hexA(c, 0.78)})`,
                    border: `1.5px solid ${hexA(c, 0.6)}`,
                    boxShadow: on
                      ? `0 0 0 4px ${hexA(c, 0.14)}, 0 14px 32px ${hexA(c, 0.46)}`
                      : `0 8px 20px ${hexA(c, 0.24)}`,
                    transition: 'all .3s' }}>
                    <span style={{ fontSize: on ? 22 : 19, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap',
                      textShadow: '0 1px 3px rgba(0,0,0,.22)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.label}</span>

                    {/* 里程碑圆点（条末） */}
                    {p.showMilestone && (
                      <div style={{ position: 'absolute', right: -9, top: '50%', transform: 'translateY(-50%)',
                        width: on ? 26 : 20, height: on ? 26 : 20, borderRadius: '50%', background: '#fff',
                        border: `${on ? 5 : 4}px solid ${c}`,
                        boxShadow: on ? `0 0 0 5px ${hexA(c, 0.18)}, 0 8px 18px ${hexA(c, 0.5)}` : `0 4px 10px ${hexA(c, 0.4)}` }} />
                    )}
                  </div>

                  {/* 里程碑事件标签（圆点右侧） */}
                  {p.showMilestone && b.milestone && (
                    <span style={{ position: 'absolute', left: `calc(${leftPct + widthPct}% + 22px)`, top: '50%',
                      transform: 'translateY(-50%)', whiteSpace: 'nowrap', fontSize: on ? 21 : 19, fontWeight: 800,
                      color: on ? ac : 'var(--aip-ink-2)' }}>{b.milestone}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 状态图例 */}
        <div style={{ flex: '0 0 auto', marginTop: 10, paddingLeft: 340, display: 'flex', alignItems: 'center', gap: 26,
          fontFamily: "'Space Mono', monospace", fontSize: 19, color: 'var(--aip-ink-3)' }}>
          {Object.keys(STATUS).map((k) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 26, height: 12, borderRadius: 999,
                background: `linear-gradient(90deg, ${hexA(STATUS[k].c, 0.42)}, ${hexA(STATUS[k].c, 0.82)})` }} />{STATUS[k].label}
            </span>
          ))}
          {p.showMilestone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: '4px solid var(--aip-ink-3)' }} />里程碑事件
            </span>
          )}
        </div>
      </div>

      {p.showNote && p.note && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginTop: 14, padding: '16px 26px', borderRadius: 18,
          background: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.7)',
          boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 18px 44px -28px rgba(70,72,100,.5)' }}>
          <span style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 20,
            letterSpacing: '.12em', color: '#fff', background: ac, padding: '8px 16px', borderRadius: 9 }}>核心发现</span>
          <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.note}</p>
        </div>
      )}

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
