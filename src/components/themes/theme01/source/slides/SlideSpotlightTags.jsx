// SlideSpotlightTags.jsx — 标签化特写 / image spotlight with fluorescent sticker tags.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// An oversized adaptive hero image anchors one half; a cluster of tilted,
// fluorescent "sticker" tags straddles its inner seam, and an editorial column
// carries a dark kicker pill, a huge headline, one hero stat and a name plate.
// The tags are the signature move (cf. 标签化的设计效果): short, highlighter-
// backed labels that read like annotations stuck onto the scene. Image side /
// fit / slot count, tag count, hero stat, accent are all tweakable; the image
// slot adapts to any aspect ratio without distortion (cover / contain). Text
// lives in defaultProps.
import React from 'react';
import { SlideFrame, MonoCaption, ImageSlot, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '典型案例 · 前沿掠影',
  title: '安全对齐的领跑者',
  en: 'The Alignment-First Frontier',
  lead: '当同行比拼参数与算力，它把可解释、可控当作护城河——用安全叙事撬动了一级市场最贵的估值之一。',
  highlightWord: '护城河',
  namePlate: { name: 'Anthropic', role: '通用大模型 · 旧金山' },
  bigStat: { value: '9650', unit: '亿', label: '最新估值 · 美元' },
  // sticker tags hugging the image seam; `tone:'accent'` paints it fluorescent.
  tags: [
    { label: 'Constitutional AI', tone: 'accent' },
    { label: '企业级 Claude' },
    { label: '安全对齐' },
    { label: '2026 递交 IPO' },
    { label: '亚马逊 / 谷歌加持' },
  ],
  images: [''],
  caption: '图片特写 · 标签化拆解一家公司的标签',
  // tweakable (universal names)
  imageSlotCount: 1,
  imageFit: 'cover',
  imageSide: 'right',
  tagCount: 5,
  highlight: true,
  highlightIndex: 0,
  showStat: true,
  showHighlighter: true,
  accentColor: '#c9f24d',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 1, min: 0, max: 1, step: 1, unit: ' 张',
    description: '特写图片槽（0 时切换为纯文字 + 标签的大留白构图）。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满铺满版面，完整自适应按原始比例显示不变形。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传特写图片，槽位自适应图片比例。' },
  { key: 'imageSide', label: '图片位置', type: 'select', default: 'right',
    options: [{ value: 'right', label: '图右文左' }, { value: 'left', label: '图左文右' }],
    description: '特写图片在左还是在右（标签贴纸自动贴向接缝一侧）。' },
  { key: 'tagCount', label: '标签数量', type: 'number', default: 5, min: 0, max: 6, step: 1, unit: ' 个',
    description: '贴在接缝上的标签贴纸数量。' },
  { key: 'highlight', label: '荧光标签', type: 'boolean', default: true,
    description: '是否把其中一个标签点亮成荧光强调贴纸。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 0, min: 0, max: 5, step: 1,
    description: '被荧光强调的标签序号（从 0 开始；也可在标签数据里以 tone:accent 指定）。' },
  { key: 'showStat', label: '主数字', type: 'boolean', default: true,
    description: '文字栏底部主数字贴纸的显示。' },
  { key: 'showHighlighter', label: '关键词荧光', type: 'boolean', default: true,
    description: '说明句关键词荧光底纹的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#c9f24d',
    options: ['#c9f24d', '#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '荧光标签、主数字与强调描边的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.6 ? '#23232a' : '#ffffff';
}
function Marked({ text, word, color, on }) {
  if (!word || !on || !String(text).includes(word)) return <span>{text}</span>;
  const i = text.indexOf(word);
  const mark = { background: `linear-gradient(180deg, transparent 0 44%, ${hexA(color, 0.45)} 44% 94%, transparent 94%)`,
    padding: '0 .08em', borderRadius: 4, fontWeight: 900, color: 'var(--aip-ink)' };
  return <span>{text.slice(0, i)}<span style={mark}>{word}</span>{text.slice(i + word.length)}</span>;
}

// vertical seam anchors (top%, rotation, outward nudge px) for up to 6 tags.
const TAG_SLOTS = [
  { top: 7, r: -3.4, nudge: 30 },
  { top: 24, r: 2.6, nudge: -18 },
  { top: 41, r: -2.0, nudge: 46 },
  { top: 58, r: 3.2, nudge: -10 },
  { top: 75, r: -3.0, nudge: 38 },
  { top: 90, r: 2.2, nudge: 6 },
];

export default function SlideSpotlightTags(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const fg = readableOn(ac);
  const hasImg = p.imageSlotCount > 0;
  const imgRight = p.imageSide !== 'left';
  const tags = (p.tags || []).slice(0, Math.max(0, Math.min(6, p.tagCount)));
  const accentIdx = p.highlight ? p.highlightIndex : -1;

  const imgCol = hasImg ? (
    <div style={{ position: 'relative', flex: '0 0 50%', minWidth: 0, display: 'flex', alignItems: 'stretch' }}>
      <ImageSlot src={p.images[0] || ''} placeholder="人物 / 公司特写" fit={p.imageFit}
        ratioMode="fill" accent={ac} radius={28} style={{ height: '100%' }} />
      {/* sticker tags hugging the inner seam */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, [imgRight ? 'left' : 'right']: 0, width: 0, zIndex: 4 }}>
        {tags.map((tag, i) => {
          const slot = TAG_SLOTS[i] || TAG_SLOTS[TAG_SLOTS.length - 1];
          const on = tag.tone === 'accent' || i === accentIdx;
          const out = (imgRight ? -1 : 1) * slot.nudge;
          return (
            <div key={i} style={{ position: 'absolute', top: `${slot.top}%`,
              [imgRight ? 'left' : 'right']: out, transform: `translate(${imgRight ? '-50%' : '50%'}, -50%) rotate(${slot.r}deg)`,
              padding: '12px 22px', borderRadius: 14, whiteSpace: 'nowrap',
              background: on ? ac : 'rgba(255,255,255,.94)',
              color: on ? fg : 'var(--aip-ink)', fontSize: 28, fontWeight: 800, letterSpacing: '.01em',
              border: on ? `2px solid ${hexA(ac, 0.6)}` : '1px solid rgba(255,255,255,.9)',
              boxShadow: on
                ? `0 0 0 5px ${hexA(ac, 0.18)}, 0 16px 34px ${hexA(ac, 0.42)}`
                : '0 14px 30px rgba(40,42,70,.24), 0 2px 0 rgba(255,255,255,.7) inset' }}>
              {tag.label}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <SlideFrame bg="a">
      <div style={{ position: 'absolute', inset: 0, padding: 'var(--aip-pad-top) var(--aip-pad-x) var(--aip-pad-bottom)',
        display: 'flex', gap: hasImg ? 72 : 0, alignItems: 'stretch' }}>
        {hasImg && !imgRight && imgCol}

        {/* text column */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 12, padding: '11px 24px',
            borderRadius: 13, background: '#23232a', transform: 'rotate(-1.2deg)', boxShadow: '0 12px 28px rgba(20,20,28,.3)' }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: ac }} />
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}># {p.kicker}</span>
          </div>

          <h2 style={{ margin: '26px 0 0', fontSize: 96, fontWeight: 900, lineHeight: 1.0, letterSpacing: '.01em',
            color: 'var(--aip-ink)', textWrap: 'pretty' }}>{p.title}</h2>
          <div style={{ marginTop: 14, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.16em',
            fontSize: 27, color: 'var(--aip-ink-3)' }}>{p.en}</div>

          {/* name plate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28 }}>
            <span style={{ width: 8, height: 46, borderRadius: 4, background: ac }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: 'var(--aip-ink)' }}>{p.namePlate.name}</span>
              <span style={{ fontSize: 26, fontWeight: 600, color: 'var(--aip-ink-3)' }}>{p.namePlate.role}</span>
            </div>
          </div>

          <p style={{ margin: '24px 0 0', maxWidth: 720, fontSize: 31, lineHeight: 1.5, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>
            <Marked text={p.lead} word={p.highlightWord} color={ac} on={p.showHighlighter} />
          </p>

          {p.showStat && (
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'baseline', gap: 12, marginTop: 34,
              padding: '18px 32px', borderRadius: 20, transform: 'rotate(-1deg)',
              background: 'rgba(255,255,255,.66)', border: '1px solid rgba(255,255,255,.85)',
              boxShadow: '0 16px 36px rgba(70,72,100,.18)' }}>
              <span style={{ fontSize: 96, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-.02em', color: ac }}>{p.bigStat.value}</span>
              <span style={{ fontSize: 44, fontWeight: 900, color: ac }}>{p.bigStat.unit}</span>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--aip-ink-2)', marginLeft: 10 }}>{p.bigStat.label}</span>
            </div>
          )}

          <MonoCaption show={p.showCaption} style={{ marginTop: 36 }}>{p.caption}</MonoCaption>
        </div>

        {hasImg && imgRight && imgCol}
      </div>
    </SlideFrame>
  );
}
