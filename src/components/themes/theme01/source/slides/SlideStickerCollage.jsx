// SlideStickerCollage.jsx — 贴纸拼贴掠影 / sticker-typography hero + photo collage.
// Channels the label/sticker reference: a stack of tilted, highlighted word
// "stickers" (filled / outline / fluorescent) beside a scrapbook photo montage,
// ringed by scattered tag chips. Image-driven page; the collage adapts to 1–5
// uploads and to each image's own aspect ratio (cover crop / contain, no warp)
// via CollageImageArea. Migration-safe: default export + defaultProps +
// controls; props-only; `aip-` scope, never touching the host :root.
import React from 'react';
import { SlideFrame, MonoCaption, CollageImageArea, hexA } from './SlideKit.jsx';

export const defaultProps = {
  eyebrow: '前沿掠影 · 2026',
  titleLines: [
    { text: '下一个', kind: 'outline' },
    { text: '浪潮', kind: 'accent' },
    { text: '正在成形', kind: 'dark' },
  ],
  lead: '当大模型的叙事进入兑现期，资本的目光正越过屏幕，投向能感知、行动、改写物理世界的下一代系统。',
  tags: [
    { label: '具身智能', tone: 'blue' },
    { label: 'AI Agent', tone: 'green' },
    { label: '世界模型', tone: 'amber' },
    { label: 'AI 芯片', tone: 'red' },
  ],
  images: ['', '', ''],
  caption: '贴纸拼贴 · 越过屏幕，投向能改写物理世界的下一代系统',
  // tweakable (universal names)
  imageSlotCount: 3,
  imageFit: 'cover',
  tagCount: 4,
  highlight: true,
  highlightIndex: 0,
  showLead: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 3, min: 0, max: 5, step: 1, unit: ' 张',
    description: '右侧拼贴的图片张数（0–5，构图自动适配数量与比例）。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传拼贴图片，槽位自适应图片比例不变形（cover/contain）。' },
  { key: 'imageFit', label: '图片裁剪', type: 'select', default: 'cover', options: ['cover', 'contain'],
    description: 'cover 裁剪填满 · contain 完整留白，均不变形。' },
  { key: 'tagCount', label: '标签数量', type: 'number', default: 4, min: 0, max: 4, step: 1, unit: ' 个',
    description: '散落贴纸标签的数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个散落标签。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 0, min: 0, max: 3, step: 1,
    description: '被强调的标签序号（从 0 开始）。' },
  { key: 'showLead', label: '引导段落', type: 'boolean', default: true,
    description: '标题下方引导文案的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '荧光强调字块与拼贴前景框的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const SOLID = { blue: '#5b8def', green: '#46b083', red: '#e8503a', amber: '#e0a23a', violet: '#7a5ae0' };
const TILT = [-2.4, 1.8, -1.4, 2.2];

// scattered tag positions around the collage (percent of the right column box)
const TAGSPOT = [
  { l: -6, t: -3, r: -7 },
  { r: -4, t: 32, r2: 6 },
  { l: -8, b: 24, r2: 5 },
  { r: -5, b: -3, r2: -6 },
];

function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const nn = parseInt(x, 16);
  const lum = (0.299 * ((nn >> 16) & 255) + 0.587 * ((nn >> 8) & 255) + 0.114 * (nn & 255)) / 255;
  return lum > 0.62 ? '#23232a' : '#ffffff';
}

function WordSticker({ text, kind, tilt, accent }) {
  const base = {
    display: 'inline-block', alignSelf: 'flex-start', padding: '8px 26px 12px', borderRadius: 14,
    fontSize: 116, fontWeight: 900, lineHeight: 1.0, letterSpacing: '.005em', whiteSpace: 'nowrap',
    transform: `rotate(${tilt}deg)`,
  };
  if (kind === 'dark') {
    return <span style={{ ...base, background: '#23232a', color: '#fff', boxShadow: '0 16px 38px rgba(20,20,28,.34)' }}>{text}</span>;
  }
  if (kind === 'accent') {
    return <span style={{ ...base, background: accent, color: readableOn(accent),
      boxShadow: `0 18px 44px ${hexA(accent, 0.45)}` }}>{text}</span>;
  }
  // outline / paper
  return <span style={{ ...base, background: 'rgba(255,255,255,.82)', color: '#23232a',
    border: '2px solid rgba(35,35,42,.16)', boxShadow: '0 14px 34px rgba(70,72,100,.16)' }}>{text}</span>;
}

function Chip({ label, color, on, spot, accent }) {
  const c = on ? accent : color;
  const tilt = spot.r2 != null ? spot.r2 : (spot.r || -4);
  return (
    <span style={{
      position: 'absolute',
      left: spot.l != null ? `${spot.l}%` : undefined,
      right: spot.r != null && spot.l == null ? `${spot.r}%` : undefined,
      top: spot.t != null ? `${spot.t}%` : undefined,
      bottom: spot.b != null ? `${spot.b}%` : undefined,
      transform: `rotate(${tilt}deg)`, zIndex: 6, whiteSpace: 'nowrap',
      padding: on ? '12px 24px' : '11px 20px', borderRadius: 14,
      fontSize: on ? 30 : 27, fontWeight: on ? 900 : 700,
      background: on ? c : 'rgba(255,255,255,.86)', color: on ? readableOn(c) : 'var(--aip-ink)',
      border: on ? `1px solid ${hexA(c, 0.5)}` : '1px solid rgba(255,255,255,.95)',
      boxShadow: on ? `0 18px 40px ${hexA(c, 0.42)}` : '0 12px 30px rgba(70,72,100,.18)',
    }}>{label}</span>
  );
}

export default function SlideStickerCollage(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const tags = p.tags.slice(0, Math.max(0, Math.min(4, p.tagCount)));

  return (
    <SlideFrame bg="a">
      <div style={{ position: 'absolute', inset: 0, padding: 'var(--aip-pad-top) var(--aip-pad-x) var(--aip-pad-bottom)',
        display: 'flex', gap: 56, alignItems: 'center' }}>

        {/* left — sticker typography */}
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14, zIndex: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '.2em',
            fontSize: 28, fontWeight: 700, color: hexA(ac, 0.92), marginBottom: 6 }}>{p.eyebrow}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            {p.titleLines.map((l, i) => (
              <WordSticker key={i} text={l.text} kind={l.kind} tilt={TILT[i % TILT.length]} accent={ac} />
            ))}
          </div>
          {p.showLead && (
            <p style={{ margin: '26px 0 0', maxWidth: 620, fontSize: 30, lineHeight: 1.5,
              color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.lead}</p>
          )}
        </div>

        {/* right — photo collage with scattered chips */}
        <div style={{ flex: '0 0 47%', alignSelf: 'stretch', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', height: '82%' }}>
            <CollageImageArea count={Math.max(0, Math.min(5, p.imageSlotCount))} images={p.images}
              fit={p.imageFit} accent={ac} accentFront />
            {tags.map((t, i) => (
              <Chip key={i} label={t.label} color={SOLID[t.tone] || ac} accent={ac}
                on={p.highlight && i === p.highlightIndex} spot={TAGSPOT[i]} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 'var(--aip-pad-x)', bottom: 40, zIndex: 5 }}>
        <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
      </div>
    </SlideFrame>
  );
}
