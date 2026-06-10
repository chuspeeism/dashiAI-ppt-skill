// SlideBigNumber.jsx — 大数字 / hero statistic page.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Visual: one oversized numeral with a highlighter-marked supporting line and an
// optional row of secondary stat chips.
import React from 'react';
import { SlideFrame, MonoCaption, GlassCard, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '2024 全年 · 美国 AI 风险投资',
  value: '970',
  unit: '亿美元',
  sub: '创历史新高，占全美风险投资近三分之一。',
  highlightWord: '近三分之一',
  secondaries: [
    { value: '97', unit: ' 笔', label: '单笔 ≥ 1 亿美元事件' },
    { value: '≈10', unit: ' 亿', label: '平均单笔融资额' },
    { value: '43.3', unit: '%', label: '通用大模型赛道占比' },
  ],
  caption: '大数字 · 一眼看清资本体量',
  // tweakable
  secondaryCount: 3,
  accentColor: '#e8503a',
  showHighlighter: true,
  highlight: true,
  highlightIndex: 0,
  align: 'center',
  showCaption: true,
};

export const controls = [
  { key: 'secondaryCount', label: '副指标数量', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 个',
    description: '主数字下方的副统计卡数量。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '主数字与荧光高亮的颜色。' },
  { key: 'showHighlighter', label: '荧光高亮', type: 'boolean', default: true,
    description: '是否给说明句中的关键词加荧光底纹。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮其中一个副指标。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 0, min: 0, max: 2, step: 1,
    description: '被强调的副指标序号（从 0 开始）。' },
  { key: 'align', label: '对齐方式', type: 'select', default: 'center',
    options: [{ value: 'center', label: '居中' }, { value: 'left', label: '左对齐' }],
    description: '整页内容的对齐方式。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

// Render a sentence with one phrase wrapped in a highlighter mark.
function Marked({ text, word, color, on }) {
  if (!word || !on || !text.includes(word)) return <span>{text}</span>;
  const i = text.indexOf(word);
  const mark = {
    background: `linear-gradient(180deg, transparent 0 42%, ${hexA(color, 0.34)} 42% 92%, transparent 92%)`,
    padding: '0 .08em', borderRadius: 4, fontWeight: 700, color: 'var(--aip-ink)',
  };
  return (
    <span>{text.slice(0, i)}<span style={mark}>{word}</span>{text.slice(i + word.length)}</span>
  );
}

export default function SlideBigNumber(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const left = p.align === 'left';
  const secs = p.secondaries.slice(0, Math.max(0, Math.min(3, p.secondaryCount)));

  return (
    <SlideFrame bg="a">
      <div style={{
        position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: left ? 'flex-start' : 'center',
        textAlign: left ? 'left' : 'center',
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.18em', fontSize: 30, color: hexA(ac, 0.92), fontWeight: 700 }}>{p.kicker}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14, justifyContent: left ? 'flex-start' : 'center' }}>
          <span key={ac} style={{ display: 'inline-block', fontSize: 400, fontWeight: 900, lineHeight: 1, paddingBottom: '0.1em', letterSpacing: '-.02em', color: 'var(--aip-ink)',
            backgroundImage: `linear-gradient(180deg, var(--aip-ink) 58%, ${hexA(ac, 0.85)})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.value}</span>
          <span style={{ fontSize: 84, fontWeight: 900, color: ac, lineHeight: 1 }}>{p.unit}</span>
        </div>

        <p style={{ margin: '26px 0 0', maxWidth: 1180, fontSize: 40, lineHeight: 1.45, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>
          <Marked text={p.sub} word={p.highlightWord} color={ac} on={p.showHighlighter} />
        </p>

        {secs.length > 0 && (
          <div style={{ display: 'flex', gap: 26, marginTop: 56, justifyContent: left ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
            {secs.map((s, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <GlassCard key={i} style={{
                  width: 'max-content', padding: '28px 40px', textAlign: 'left', borderRadius: 22,
                  background: on ? `linear-gradient(150deg, ${hexA(ac, 0.16)}, ${hexA(ac, 0.05)})` : undefined,
                  border: on ? `1px solid ${hexA(ac, 0.45)}` : undefined,
                  boxShadow: on ? `0 22px 50px ${hexA(ac, 0.22)}` : undefined,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 76, fontWeight: 900, color: on ? ac : 'var(--aip-ink)', lineHeight: 1 }}>{s.value}</span>
                    <span style={{ fontSize: 34, fontWeight: 700, color: 'var(--aip-ink-3)' }}>{s.unit}</span>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 25, color: 'var(--aip-ink-2)', fontWeight: 500, whiteSpace: 'nowrap' }}>{s.label}</div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {p.showCaption && <MonoCaption style={{ marginTop: 52 }}>{p.caption}</MonoCaption>}
      </div>
    </SlideFrame>
  );
}
