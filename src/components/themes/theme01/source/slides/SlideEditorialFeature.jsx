// SlideEditorialFeature.jsx — 专题特写 / magazine-style editorial image page.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// A two-column editorial spread: a giant ghosted section numeral watermarks the
// text column behind a kicker tag, oversized headline, fluorescent-marked lead
// and pull-quote, plus tilted stat stickers; the facing column is a self-adapting
// image area (single hero for 1 slot, tilted scrapbook collage for 2–3) carrying
// a caption sticker. Image side, slot count, fit, quote/stats and accent are
// tweakable; images never distort (cover crops, contain letterboxes). Text in
// defaultProps.
import React from 'react';
import { SlideFrame, MonoCaption, ImageSlot, CollageImageArea, hexA } from './SlideKit.jsx';

export const defaultProps = {
  index: '04',
  kicker: '前沿专题 · AI Agent',
  title: '软件正在长出手脚',
  en: 'The Agentic Turn',
  lead: '从「回答问题」到「替你完成任务」，自主智能体让软件第一次能够调用工具、连续决策——资本正把它当作应用层的下一个入口。',
  highlightWord: '下一个入口',
  pullQuote: '会用工具的 AI，才真正开始改变工作方式。',
  stats: [
    { value: '38', unit: '亿', label: 'Agent 赛道年度融资' },
    { value: '4.1', unit: '×', label: '同比融资增速' },
  ],
  images: ['', '', ''],
  imgCaption: '专题图片 · 自主智能体如何重塑软件',
  // tweakable (universal names)
  imageSide: 'right',
  imageSlotCount: 2,
  imageFit: 'cover',
  statCount: 2,
  showQuote: true,
  showGhost: true,
  showHighlighter: true,
  accentColor: '#46b083',
  showCaption: true,
};

export const controls = [
  { key: 'imageSide', label: '图片位置', type: 'select', default: 'right',
    options: [{ value: 'right', label: '图右文左' }, { value: 'left', label: '图左文右' }],
    description: '图片栏放在左侧还是右侧。' },
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 2, min: 0, max: 3, step: 1, unit: ' 张',
    description: '图片槽数量：1 张为单图特写，2–3 张为倾斜叠压拼贴，0 张为纯文字大留白。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满铺满版面，完整自适应按原始比例显示。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传专题图片，槽位自适应图片比例不变形。' },
  { key: 'statCount', label: '数据贴纸', type: 'number', default: 2, min: 0, max: 2, step: 1, unit: ' 个',
    description: '正文下方倾斜数据贴纸的数量。' },
  { key: 'showQuote', label: '引述金句', type: 'boolean', default: true,
    description: '正文与数据之间引述金句条的显示。' },
  { key: 'showGhost', label: '巨型刊号', type: 'boolean', default: true,
    description: '文字栏背后超大幽灵刊号数字的显示。' },
  { key: 'showHighlighter', label: '荧光高亮', type: 'boolean', default: true,
    description: '是否给导语关键词加荧光底纹。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '刊号、荧光、引述竖条与图片边框的主题色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function Marked({ text, word, color, on }) {
  if (!word || !on || !String(text).includes(word)) return <span>{text}</span>;
  const i = text.indexOf(word);
  const mark = { background: `linear-gradient(180deg, transparent 0 44%, ${hexA(color, 0.4)} 44% 94%, transparent 94%)`,
    padding: '0 .08em', borderRadius: 4, fontWeight: 800, color: 'var(--aip-ink)' };
  return <span>{text.slice(0, i)}<span style={mark}>{word}</span>{text.slice(i + word.length)}</span>;
}

export default function SlideEditorialFeature(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const n = Math.max(0, Math.min(3, p.imageSlotCount));
  const hasImg = n > 0;
  const imgLeft = p.imageSide === 'left';
  const stats = (p.stats || []).slice(0, Math.max(0, Math.min(2, p.statCount)));

  const imgCol = hasImg ? (
    <div style={{ flex: '0 0 46%', minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', height: '92%', position: 'relative' }}>
        {n === 1 ? (
          <ImageSlot src={p.images[0] || ''} placeholder="专题图片" fit={p.imageFit}
            ratioMode="fill" accent={ac} radius={26} style={{ height: '100%' }} />
        ) : (
          <CollageImageArea count={n} images={p.images} fit={p.imageFit} accent={ac} />
        )}
      </div>
      {/* caption sticker riding the image corner */}
      {p.showCaption && (
        <div style={{ position: 'absolute', bottom: 8, left: imgLeft ? 'auto' : -10, right: imgLeft ? -10 : 'auto',
          transform: `rotate(${imgLeft ? 2.4 : -2.4}deg)`, zIndex: 6,
          padding: '12px 22px', borderRadius: 14, background: '#23232a', color: '#fff',
          fontFamily: "'Space Mono', monospace", fontSize: 21, fontWeight: 700, letterSpacing: '.02em',
          boxShadow: '0 16px 36px rgba(20,20,28,.32)', maxWidth: '90%' }}>
          {p.imgCaption}
        </div>
      )}
    </div>
  ) : null;

  return (
    <SlideFrame bg="b">
      <div style={{ position: 'absolute', inset: 0, padding: 'var(--aip-pad-top) var(--aip-pad-x) var(--aip-pad-bottom)',
        display: 'flex', gap: 64, alignItems: 'stretch' }}>
        {imgLeft && imgCol}

        {/* text column */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {p.showGhost && (
            <div style={{ position: 'absolute', top: -28, left: -8, zIndex: 0, pointerEvents: 'none', userSelect: 'none',
              fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 380, lineHeight: 0.8,
              color: hexA(ac, 0.10), letterSpacing: '-.04em' }}>{p.index}</div>
          )}

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '11px 24px',
              borderRadius: 13, background: '#23232a', transform: 'rotate(-1.2deg)', boxShadow: '0 12px 28px rgba(20,20,28,.3)' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: ac }} />
              <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}># {p.kicker}</span>
            </div>

            <h2 style={{ margin: '26px 0 0', fontSize: 104, fontWeight: 900, lineHeight: 1.0, letterSpacing: '.01em',
              color: 'var(--aip-ink)', textWrap: 'pretty' }}>{p.title}</h2>
            <div style={{ marginTop: 14, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
              letterSpacing: '.16em', fontSize: 28, color: 'var(--aip-ink-3)' }}>{p.en}</div>

            <p style={{ margin: '26px 0 0', maxWidth: 820, fontSize: 32, lineHeight: 1.5, color: 'var(--aip-ink-2)',
              fontWeight: 500, textWrap: 'pretty' }}>
              <Marked text={p.lead} word={p.highlightWord} color={ac} on={p.showHighlighter} />
            </p>

            {p.showQuote && p.pullQuote && (
              <div style={{ margin: '28px 0 0', paddingLeft: 26, borderLeft: `6px solid ${ac}`,
                fontSize: 38, fontWeight: 800, lineHeight: 1.32, color: 'var(--aip-ink)', maxWidth: 820, textWrap: 'pretty' }}>
                {p.pullQuote}
              </div>
            )}

            {stats.length > 0 && (
              <div style={{ display: 'flex', gap: 18, marginTop: 34, flexWrap: 'wrap' }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ padding: '16px 28px', borderRadius: 16, transform: `rotate(${i % 2 ? 1.4 : -1.4}deg)`,
                    background: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.85)',
                    boxShadow: '0 14px 32px rgba(70,72,100,.18)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: ac, lineHeight: 1 }}>{s.value}</span>
                      <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--aip-ink-3)' }}>{s.unit}</span>
                    </div>
                    <div style={{ fontSize: 24, color: 'var(--aip-ink-2)', fontWeight: 600, marginTop: 4, whiteSpace: 'nowrap' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {p.showCaption && !hasImg && <MonoCaption style={{ marginTop: 40 }}>{p.imgCaption}</MonoCaption>}
          </div>
        </div>

        {!imgLeft && imgCol}
      </div>
    </SlideFrame>
  );
}
