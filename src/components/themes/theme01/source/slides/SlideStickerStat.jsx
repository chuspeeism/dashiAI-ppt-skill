// SlideStickerStat.jsx — 贴纸大数字 / sticker-callout hero stat.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Visual: one oversized numeral lifted on a fluorescent highlighter, ringed by
// tilted "sticker" chips — a direct nod to the label/sticker reference (tilt,
// fluorescent accent, oversized type). Built for a single punchy risk/insight.
import React from 'react';
import { SlideFrame, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  eyebrow: '风险信号 · 估值泡沫',
  value: '1000',
  prefix: '',
  suffix: '×+',
  unitLabel: 'P / S 市销率',
  headline: '估值跑在收入前面',
  highlightWord: '估值',
  sub: 'Anthropic 9650 亿美元估值，对应 2024 年预计收入约 8 亿美元——市销率超千倍，一旦宏观收紧，估值回调难以避免。',
  stickers: [
    { label: '9650 亿 估值', tone: 'violet' },
    { label: '≈ 8 亿 收入', tone: 'blue' },
    { label: '建立在「未来市值」', tone: 'amber' },
    { label: '收紧 → 估值回调', tone: 'red' },
  ],
  caption: '大数字 · 纪录之下，泡沫信号不容忽视',
  // tweakable
  stickerCount: 4,
  highlight: true,
  highlightIndex: 3,
  accentColor: '#e8503a',
  showHighlighter: true,
  showCaption: true,
};

export const controls = [
  { key: 'stickerCount', label: '贴纸数量', type: 'number', default: 4, min: 0, max: 4, step: 1, unit: ' 张',
    description: '主数字四周的贴纸标签数量（0 时只显示主数字）。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否把其中一张贴纸渲染成荧光强调款。' },
  { key: 'highlightIndex', label: '强调第几张', type: 'number', default: 3, min: 0, max: 3, step: 1,
    description: '被强调的贴纸序号（从 0 开始）。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '主数字、荧光高亮与强调贴纸的颜色。' },
  { key: 'showHighlighter', label: '荧光高亮', type: 'boolean', default: true,
    description: '是否给标题关键词加荧光底纹。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const TONE = { red: '#e8503a', blue: '#5b8def', green: '#46b083', amber: '#e0a23a', violet: '#7a5ae0' };

// position presets around the central numeral (percent of the stage box).
const SPOTS = [
  { l: 7, t: 13, r: -5.5 },
  { r: 8, t: 9, r2: 5 },
  { l: 9, b: 16, r: 4.5 },
  { r: 7, b: 13, r2: -5 },
];

function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum > 0.62 ? '#23232a' : '#ffffff';
}

function Sticker({ label, color, on, spot, accent }) {
  const c = on ? accent : color;
  const fg = on ? readableOn(accent) : 'var(--aip-ink)';
  const pos = {
    position: 'absolute',
    left: spot.l != null ? `${spot.l}%` : undefined,
    right: spot.r != null && spot.l == null ? `${spot.r}%` : undefined,
    top: spot.t != null ? `${spot.t}%` : undefined,
    bottom: spot.b != null ? `${spot.b}%` : undefined,
    transform: `rotate(${(spot.r2 != null ? spot.r2 : spot.r) || 0}deg)`,
  };
  // spot.r doubles as x-position key AND rotation in presets; normalise:
  const tilt = spot.r2 != null ? spot.r2 : (typeof spot.r === 'number' && spot.l == null ? 0 : spot.r);
  pos.transform = `rotate(${tilt || -4}deg)`;
  return (
    <span style={{
      ...pos, zIndex: 3, display: 'inline-block', whiteSpace: 'nowrap',
      padding: on ? '16px 28px' : '14px 24px', borderRadius: 16,
      fontSize: on ? 34 : 30, fontWeight: on ? 900 : 700, letterSpacing: '.01em',
      background: on ? c : 'rgba(255,255,255,.78)', color: on ? fg : 'var(--aip-ink)',
      border: `1px solid ${on ? hexA(c, 0.5) : 'rgba(255,255,255,.9)'}`,
      boxShadow: on
        ? `0 22px 48px ${hexA(c, 0.4)}, 0 2px 0 rgba(255,255,255,.45) inset`
        : '0 1px 0 rgba(255,255,255,.7) inset, 0 16px 36px rgba(70,72,100,.16)',
    }}>{label}</span>
  );
}

function Marked({ text, word, color, on }) {
  if (!word || !on || !text.includes(word)) return <span>{text}</span>;
  const i = text.indexOf(word);
  return (
    <span>{text.slice(0, i)}<span style={{
      background: `linear-gradient(180deg, transparent 0 40%, ${hexA(color, 0.36)} 40% 94%, transparent 94%)`,
      padding: '0 .06em', borderRadius: 4,
    }}>{word}</span>{text.slice(i + word.length)}</span>
  );
}

export default function SlideStickerStat(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const stickers = p.stickers.slice(0, Math.max(0, Math.min(4, p.stickerCount)));

  return (
    <SlideFrame bg="a">
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

        {/* scattered sticker tags around the numeral */}
        {stickers.map((s, i) => (
          <Sticker key={i} label={s.label} color={TONE[s.tone] || ac} accent={ac}
            on={p.highlight && i === p.highlightIndex} spot={SPOTS[i]} />
        ))}

        <div style={{ fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
          letterSpacing: '.2em', fontSize: 30, color: hexA(ac, 0.92), fontWeight: 700 }}>{p.eyebrow}</div>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 14, marginTop: 6 }}>
          {p.prefix && <span style={{ fontSize: 120, fontWeight: 900, color: ac, lineHeight: 1 }}>{p.prefix}</span>}
          <span style={{ display: 'inline-block', fontSize: 420, fontWeight: 900, lineHeight: 1, paddingBottom: '0.08em',
            letterSpacing: '-.03em', color: 'var(--aip-ink)',
            backgroundImage: `linear-gradient(180deg, var(--aip-ink) 56%, ${hexA(ac, 0.9)})`,
            WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.value}</span>
          {p.suffix && <span style={{ fontSize: 150, fontWeight: 900, color: ac, lineHeight: 1 }}>{p.suffix}</span>}
        </div>

        <div style={{ marginTop: 2, fontFamily: "'Space Mono', monospace", letterSpacing: '.14em',
          textTransform: 'uppercase', fontSize: 30, color: 'var(--aip-ink-3)', fontWeight: 700 }}>{p.unitLabel}</div>

        <div style={{ marginTop: 30, fontSize: 64, fontWeight: 900, color: 'var(--aip-ink)', letterSpacing: '.01em' }}>
          <Marked text={p.headline} word={p.highlightWord} color={ac} on={p.showHighlighter} />
        </div>

        <p style={{ margin: '20px 0 0', maxWidth: 1120, fontSize: 30, lineHeight: 1.5,
          color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.sub}</p>

        {p.showCaption && <MonoCaption style={{ marginTop: 44 }}>{p.caption}</MonoCaption>}
      </div>
    </SlideFrame>
  );
}
