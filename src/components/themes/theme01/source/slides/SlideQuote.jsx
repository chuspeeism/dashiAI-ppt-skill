// SlideQuote.jsx — 金句 / pull-quote page.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// The quote splits on the em-dash「——」into a SETUP block and a PIVOT block;
// inside the pivot, `contrastWord` becomes a dark stamp sticker and
// `highlightWord` an oversized fluorescent sticker — visualizing the turn.
import React from 'react';
import { SlideFrame, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '一句话总结',
  quote: 'AI 融资盛宴仍在继续，但音乐的节奏正在变化——资本的下一阶段，将从「赌叙事」转向「看兑现」。',
  contrastWord: '「赌叙事」',   // rendered as the dark "stamp" sticker
  highlightWord: '「看兑现」',   // rendered as the oversized fluorescent sticker
  attribution: '本报告 · 结论',
  caption: '金句 · 一句话记住核心判断',
  notes: [
    { label: '叙事驱动', tone: 'muted' },
    { label: '兑现驱动', tone: 'accent' },
  ],
  // tweakable
  accentColor: '#c9f24d',
  noteCount: 2,
  showQuoteMark: true,
  showHighlighter: true,
  showAttribution: true,
  align: 'left',
  showCaption: true,
};

export const controls = [
  { key: 'accentColor', label: '荧光色', type: 'color', default: '#c9f24d',
    options: ['#c9f24d', '#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '荧光贴纸与高亮的颜色（参考图的荧光高亮）。' },
  { key: 'noteCount', label: '便签贴纸', type: 'number', default: 2, min: 0, max: 3, step: 1, unit: ' 个',
    description: '右上角倾斜便签贴纸的数量（装饰性回声标签）。' },
  { key: 'showHighlighter', label: '关键词贴纸', type: 'boolean', default: true,
    description: '是否把金句中的对立关键词渲染成「黑色印章 + 荧光」贴纸。' },
  { key: 'showQuoteMark', label: '巨型引号', type: 'boolean', default: true,
    description: '是否显示背景的超大引号。' },
  { key: 'showAttribution', label: '署名', type: 'boolean', default: true,
    description: '是否显示出处 / 署名。' },
  { key: 'align', label: '对齐方式', type: 'select', default: 'left',
    options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
    description: '整页内容的对齐方式。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

const INK = '#23232a';
// pick readable text color (dark on light accents like lime, white on saturated ones)
function readableOn(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const n = parseInt(x, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.6 ? INK : '#ffffff';
}
const strip = (s) => String(s).replace(/[「」“”"']/g, '');

// ── stickers ────────────────────────────────────────────────────────────────
function StampSticker({ children, tilt = 2 }) {
  return (
    <span style={{
      display: 'inline-block', padding: '.04em .34em', margin: '0 .08em',
      borderRadius: 16, background: INK, color: '#fff', fontWeight: 900,
      transform: `rotate(${tilt}deg)`, lineHeight: 1.04,
      boxShadow: '0 14px 32px rgba(20,20,28,.34), 0 2px 0 rgba(255,255,255,.12) inset',
    }}>{children}</span>
  );
}
function FluoSticker({ children, color, tilt = -2.5 }) {
  return (
    <span style={{
      display: 'inline-block', padding: '.04em .34em', margin: '0 .08em',
      borderRadius: 16, background: color, color: readableOn(color), fontWeight: 900,
      transform: `rotate(${tilt}deg)`, lineHeight: 1.04,
      boxShadow: `0 16px 38px ${hexA(color, 0.5)}, 0 0 0 1px ${hexA(color, 0.7)}, 0 2px 0 rgba(255,255,255,.55) inset`,
    }}>{children}</span>
  );
}

// render a run of text, swapping contrast/highlight words for stickers
function PivotRun({ text, contrastWord, highlightWord, color, on }) {
  if (!on) return <>{strip(text).replace(/[「」]/g, '')}</>;
  const tokens = [];
  let rest = text;
  const order = [
    { w: contrastWord, kind: 'stamp' },
    { w: highlightWord, kind: 'fluo' },
  ].filter((t) => t.w && rest.includes(t.w));
  // walk through the string, emitting stickers where the marked words occur
  let guard = 0;
  while (rest.length && guard++ < 50) {
    let best = null;
    for (const t of order) {
      const i = rest.indexOf(t.w);
      if (i >= 0 && (best === null || i < best.i)) best = { ...t, i };
    }
    if (!best) { tokens.push({ type: 'txt', v: rest }); break; }
    if (best.i > 0) tokens.push({ type: 'txt', v: rest.slice(0, best.i) });
    tokens.push({ type: best.kind, v: strip(best.w) });
    rest = rest.slice(best.i + best.w.length);
  }
  return (
    <>
      {tokens.map((t, i) =>
        t.type === 'stamp' ? <StampSticker key={i} tilt={2.5}>{t.v}</StampSticker>
        : t.type === 'fluo' ? <FluoSticker key={i} color={color} tilt={-2.5}>{t.v}</FluoSticker>
        : <span key={i}>{t.v}</span>)}
    </>
  );
}

export default function SlideQuote(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const left = p.align === 'left';
  const notes = (p.notes || []).slice(0, Math.max(0, Math.min(3, p.noteCount)));

  // split the quote into setup + pivot on the em-dash; fall back to a single run
  const m = String(p.quote).split(/——|—|--/);
  const setup = m.length > 1 ? m[0] : '';
  const pivot = m.length > 1 ? m.slice(1).join('—') : p.quote;

  return (
    <SlideFrame bg="b">
      {/* big ghost quote mark — decorative, behind everything */}
      {p.showQuoteMark && (
        <div style={{
          position: 'absolute', zIndex: 0, top: 40, left: left ? -18 : '50%',
          transform: left ? 'none' : 'translateX(-50%)', pointerEvents: 'none', userSelect: 'none',
          fontFamily: 'Georgia, "Noto Serif SC", serif', fontSize: 480, lineHeight: 0.7,
          color: hexA(INK, 0.07), fontWeight: 700,
        }}>“</div>
      )}

      {/* tilted note-stickers — top-right whitespace */}
      {notes.length > 0 && (
        <div style={{
          position: 'absolute', zIndex: 2, top: 96, right: 96, display: 'flex',
          flexDirection: 'column', alignItems: 'flex-end', gap: 26, pointerEvents: 'none',
        }}>
          {notes.map((n, i) => {
            const accent = n.tone === 'accent';
            return (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 26px',
                borderRadius: 18, fontSize: 34, fontWeight: 800, whiteSpace: 'nowrap',
                transform: `rotate(${i % 2 === 0 ? 3 : -3.5}deg)`,
                background: accent ? ac : 'rgba(255,255,255,.82)',
                color: accent ? readableOn(ac) : INK,
                border: accent ? `1px solid ${hexA(ac, 0.7)}` : `2px dashed ${hexA(INK, 0.3)}`,
                boxShadow: accent
                  ? `0 16px 36px ${hexA(ac, 0.42)}`
                  : '0 14px 32px rgba(70,72,100,.16)',
              }}>
                <span style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: accent ? INK : ac,
                }} />
                {n.label}
              </span>
            );
          })}
        </div>
      )}

      <div style={{
        position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: left ? 'flex-start' : 'center',
        textAlign: left ? 'left' : 'center', paddingTop: 40,
      }}>
        {/* kicker — dark stamp sticker with fluorescent dot */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 28px',
          borderRadius: 14, background: INK, transform: 'rotate(-1.5deg)',
          boxShadow: '0 14px 30px rgba(20,20,28,.3)',
        }}>
          <span style={{ width: 16, height: 16, borderRadius: 5, background: ac }} />
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: '.04em', color: '#fff', whiteSpace: 'nowrap' }}>
            # {p.kicker}
          </span>
        </div>

        {/* setup block */}
        {setup && (
          <div style={{
            margin: '34px 0 0', maxWidth: 1520, fontSize: 58, fontWeight: 800,
            lineHeight: 1.3, letterSpacing: '.005em', color: 'var(--aip-ink)', textWrap: 'pretty',
          }}>{setup}</div>
        )}

        {/* pivot block — oversized, with the dual sticker emphasis */}
        <div style={{
          margin: setup ? '24px 0 0' : '34px 0 0', maxWidth: 1620, fontSize: 74, fontWeight: 900,
          lineHeight: 1.4, letterSpacing: '.005em', color: 'var(--aip-ink)', textWrap: 'pretty',
        }}>
          <PivotRun text={pivot} contrastWord={p.contrastWord} highlightWord={p.highlightWord}
            color={ac} on={p.showHighlighter} />
        </div>

        {p.showAttribution && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 52 }}>
            <span style={{ width: 64, height: 5, borderRadius: 3, background: INK }} />
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 30, letterSpacing: '.04em', color: 'var(--aip-ink-2)', fontWeight: 700 }}>{p.attribution}</span>
          </div>
        )}

        {p.showCaption && <MonoCaption style={{ marginTop: 40 }}>{p.caption}</MonoCaption>}
      </div>
    </SlideFrame>
  );
}
