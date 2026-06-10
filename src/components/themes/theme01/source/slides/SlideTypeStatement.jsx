// SlideTypeStatement.jsx — 大字主张 / oversized typographic thesis.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A manifesto-scale statement: multi-line giant type where key phrases are
// fluorescent-highlighted, accent-colored, struck-through (the rejected idea) or
// boxed as stickers — the deck's "超大字 + 标签化 + 荧光高亮" voice, distinct from
// the attributed pull-quote and the single big-number pages. A row of sticker
// stats grounds the claim. Accent, highlighter, stat count, align tweakable;
// the statement text lives in defaultProps as structured tokens. Self-contained.
import React from 'react';
import { SlideFrame, Tag, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '核心主张 · Thesis',
  tone: 'violet',
  // lines → tokens. mark: 'plain' | 'accent' | 'hi' | 'strike' | 'box'
  lines: [
    [{ t: '资本不再为 ' }, { t: '叙事', mark: 'strike' }, { t: ' 买单，' }],
    [{ t: '开始为 ' }, { t: '兑现', mark: 'hi' }, { t: ' 定价。' }],
  ],
  sub: '2025 年起，估值锚点从「想象空间」转向「收入与现金流」——能讲故事的公司很多，能持续交付的不多。资本的下一程，押注确定性。',
  stats: [
    { value: '1000×+', label: '头部市销率' },
    { value: '>60%', label: '资金流向 Top 5' },
    { value: '2026', label: 'IPO 窗口开启' },
  ],
  caption: '大字主张 · 从赌叙事，到看兑现',
  // tweakable (universal names)
  accentColor: '#7a5ae0',
  showHighlighter: true,
  showSub: true,
  statCount: 3,
  highlight: true,
  highlightIndex: 0,
  align: 'left',
  showCaption: true,
};

export const controls = [
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '荧光高亮、强调字与强调贴纸的颜色。' },
  { key: 'showHighlighter', label: '荧光 / 贴纸标记', type: 'boolean', default: true,
    description: '关闭后高亮词回退为普通文字（仅保留删除线语义）。' },
  { key: 'showSub', label: '副文说明', type: 'boolean', default: true,
    description: '主张下方说明段落的显示。' },
  { key: 'statCount', label: '数据贴纸数量', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 张',
    description: '底部数据贴纸数量（0 时只留大字主张）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一张数据贴纸渲染成主题色强调款。' },
  { key: 'highlightIndex', label: '强调第几张', type: 'number', default: 0, min: 0, max: 2, step: 1,
    description: '被强调的数据贴纸序号（从 0 开始）。' },
  { key: 'align', label: '对齐', type: 'select', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    description: '主张文字的对齐方式。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function Token({ tk, ac, hiOn }) {
  const mark = tk.mark || 'plain';
  if (mark === 'accent') {
    return <span style={{ color: ac }}>{tk.t}</span>;
  }
  if (mark === 'strike') {
    return <span style={{ color: 'var(--aip-ink-3)', textDecoration: 'line-through',
      textDecorationThickness: '6px', textDecorationColor: hexA('#9a9ba4', 0.6) }}>{tk.t}</span>;
  }
  if (mark === 'hi') {
    if (!hiOn) return <span style={{ color: ac }}>{tk.t}</span>;
    return (
      <span style={{ color: 'var(--aip-ink)', padding: '0 .08em', borderRadius: 6,
        backgroundImage: `linear-gradient(180deg, transparent 0 32%, ${hexA(ac, 0.4)} 32% 96%, transparent 96%)` }}>
        {tk.t}
      </span>
    );
  }
  if (mark === 'box') {
    if (!hiOn) return <span style={{ color: ac, fontWeight: 900 }}>{tk.t}</span>;
    return (
      <span style={{ display: 'inline-block', transform: 'rotate(-2deg)', background: ac, color: '#fff',
        padding: '0 .18em', borderRadius: 12, boxShadow: `0 16px 36px ${hexA(ac, 0.42)}`,
        lineHeight: 1.04 }}>{tk.t}</span>
    );
  }
  return <span>{tk.t}</span>;
}

export default function SlideTypeStatement(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const center = p.align === 'center';
  const stats = p.stats.slice(0, Math.max(0, Math.min(3, p.statCount)));

  return (
    <SlideFrame bg="b">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left' }}>

        <Tag tone={p.tone} style={{ marginBottom: 34 }}>{p.kicker}</Tag>

        <div style={{ fontWeight: 900, fontSize: 118, lineHeight: 1.06, letterSpacing: '.005em',
          color: 'var(--aip-ink)', textWrap: 'balance', maxWidth: 1640 }}>
          {p.lines.map((line, li) => (
            <div key={li}>
              {line.map((tk, ti) => <Token key={ti} tk={tk} ac={ac} hiOn={p.showHighlighter} />)}
            </div>
          ))}
        </div>

        {p.showSub && (
          <p style={{ margin: '40px 0 0', maxWidth: 1280, fontSize: 33, lineHeight: 1.5,
            color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.sub}</p>
        )}

        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: 22, marginTop: 52, flexWrap: 'wrap',
            justifyContent: center ? 'center' : 'flex-start' }}>
            {stats.map((s, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4,
                  padding: '20px 32px', borderRadius: 20, transform: `rotate(${i % 2 ? 1.4 : -1.4}deg)`,
                  background: on ? ac : 'rgba(255,255,255,.72)',
                  border: `1px solid ${on ? hexA(ac, 0.5) : 'rgba(255,255,255,.9)'}`,
                  boxShadow: on ? `0 22px 48px ${hexA(ac, 0.4)}, 0 2px 0 rgba(255,255,255,.4) inset`
                    : '0 1px 0 rgba(255,255,255,.7) inset, 0 16px 36px rgba(70,72,100,.16)' }}>
                  <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1,
                    color: on ? '#fff' : 'var(--aip-ink)' }}>{s.value}</span>
                  <span style={{ fontSize: 25, fontWeight: 700,
                    color: on ? 'rgba(255,255,255,.9)' : 'var(--aip-ink-2)' }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
