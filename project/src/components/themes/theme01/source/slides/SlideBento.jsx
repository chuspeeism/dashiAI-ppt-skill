// SlideBento.jsx — 图片页 · 便当格图文混排（dashboard 式「一图读懂」）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 便当（bento）网格：大小不一的拼块组成一屏速览——左侧数据区有「深色大数字英雄块 +
// 榜单块 + 占比环块 + 金句块」，右侧影像区按 imageSlotCount（0–3）自适应排布。每块
// 各有处理（深色 / 玻璃 / 荧光），影像槽按比例自适应不变形；图片为 0 时数据区铺满。
import React from 'react';
import { SlideFrame, SlideHead, ImageSlot, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '速览 · 一图读懂',
  tone: 'green',
  title: '一图读懂 · 2024 AI 融资全景',
  en: 'The Year in One Frame',
  cn: '总量、头部、集中度与拐点',
  hero: { value: '700', unit: '亿', label: '2024 美国 AI 大额融资总额 · 美元', sub: '单笔 ≥ 1 亿美元口径' },
  listTitle: '单笔融资 Top 3',
  list: [
    { name: 'OpenAI', value: '66', unit: '亿' },
    { name: 'Anthropic', value: '65', unit: '亿' },
    { name: 'xAI', value: '50', unit: '亿' },
  ],
  ratio: { value: 63.9, unit: '%', label: '旧金山湾区占比' },
  quote: { text: '资本正从「赌叙事」转向「看兑现」。', mark: '看兑现' },
  images: ['', '', ''],
  caption: '便当速览 · 把一年的资本故事压进一屏',
  // tweakable（通用命名）
  imageSlotCount: 2,
  imageFit: 'cover',
  listCount: 3,
  showRatio: true,
  showQuote: true,
  accentColor: '#46b083',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 2, min: 0, max: 3, step: 1, unit: ' 张',
    description: '右侧影像区图片数（0 数据区铺满 / 1 满版 / 2 上下 / 3 一大两小），按比例自适应。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '裁剪填满铺满拼块，或完整自适应按原始比例显示。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传影像，槽位自适应图片比例。' },
  { key: 'listCount', label: '榜单条目', type: 'number', default: 3, min: 2, max: 4, step: 1, unit: ' 条',
    description: '榜单拼块展示的条目数量。' },
  { key: 'showRatio', label: '占比环块', type: 'boolean', default: true,
    description: '集中度占比环形拼块的显示。' },
  { key: 'showQuote', label: '金句块', type: 'boolean', default: true,
    description: '底部金句拼块的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#46b083',
    options: ['#46b083', '#5b8def', '#e0a23a', '#e8503a', '#7a5ae0', '#c9f24d'],
    description: '荧光、占比环与强调元素的颜色。' },
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

const TILE = {
  borderRadius: 24, border: '1px solid rgba(255,255,255,.72)', position: 'relative', overflow: 'hidden',
  boxShadow: '0 1px 0 rgba(255,255,255,.7) inset, 0 22px 50px -28px rgba(70,72,100,.5)',
};
const GLASS = { ...TILE, background: 'rgba(255,255,255,.52)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' };

function ImageRegion({ n, images, fit }) {
  const slot = (i, style) => (
    <div key={i} style={{ ...style, minHeight: 0, minWidth: 0 }}>
      <ImageSlot slot={i} src={images[i] || ''} placeholder={`影像 ${i + 1}`} fit={fit} ratioMode="fill"
        accent="#5b8def" radius={24} style={{ height: '100%' }} />
    </div>
  );
  if (n === 1) return <div style={{ display: 'grid', height: '100%' }}>{slot(0, {})}</div>;
  if (n === 2) return <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 18, height: '100%' }}>{slot(0, {})}{slot(1, {})}</div>;
  return (
    <div style={{ display: 'grid', gridTemplateRows: '1.4fr 1fr', gap: 18, height: '100%' }}>
      {slot(0, {})}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, minHeight: 0 }}>{slot(1, {})}{slot(2, {})}</div>
    </div>
  );
}

export default function SlideBento(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const onAcc = readableOn(ac);
  const n = Math.max(0, Math.min(3, p.imageSlotCount));
  const list = (p.list || []).slice(0, Math.max(2, Math.min(4, p.listCount)));
  const maxV = Math.max.apply(null, list.map((x) => parseFloat(x.value) || 0));
  const showQuote = p.showQuote;
  const showRatio = p.showRatio;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 18, display: 'flex', gap: 20 }}>
        {/* 数据区 */}
        <div style={{ flex: n > 0 ? '1.5' : '1', minWidth: 0, display: 'grid',
          gridTemplateColumns: '1fr 1fr', gridTemplateRows: showQuote ? '1.5fr 1.16fr 0.64fr' : '1.42fr 1fr',
          gap: 18 }}>
          {/* 英雄大数字（深色） */}
          <div style={{ ...TILE, gridColumn: '1 / 3', background: 'linear-gradient(150deg, #24242c, #15151b)',
            border: '1px solid rgba(255,255,255,.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 40px' }}>
            <div style={{ position: 'absolute', right: -30, bottom: -70, fontFamily: "'Space Mono', monospace",
              fontSize: 380, fontWeight: 700, lineHeight: 0.7, color: hexA(ac, 0.16), userSelect: 'none', pointerEvents: 'none' }}>$</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, letterSpacing: '.18em',
              textTransform: 'uppercase', color: hexA(ac, 0.95), fontWeight: 700 }}>Total Capital</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
              <span style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.85, letterSpacing: '-.02em', color: '#fff' }}>{p.hero.value}</span>
              <span style={{ fontSize: 40, fontWeight: 900, color: ac }}>{p.hero.unit}</span>
            </div>
            <div style={{ fontSize: 27, fontWeight: 700, color: 'rgba(255,255,255,.88)', marginTop: 14, textWrap: 'pretty' }}>{p.hero.label}</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, color: 'rgba(255,255,255,.5)', marginTop: 6 }}>{p.hero.sub}</div>
          </div>

          {/* 榜单 */}
          <div style={{ ...GLASS, gridColumn: showRatio ? '1 / 2' : '1 / 3', display: 'flex', flexDirection: 'column', padding: '20px 26px', minWidth: 0 }}>
            <div style={{ flex: '0 0 auto', fontSize: 24, fontWeight: 900, color: 'var(--aip-ink)' }}>{p.listTitle}</div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              {list.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <span style={{ flex: '0 0 24px', fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700,
                    color: i === 0 ? ac : 'var(--aip-ink-3)', textAlign: 'center' }}>{i + 1}</span>
                  <span style={{ flex: '0 0 auto', maxWidth: 152, fontSize: 23, fontWeight: 800, color: 'var(--aip-ink)', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</span>
                  <div style={{ flex: 1, minWidth: 0, height: 11, borderRadius: 6, background: 'rgba(43,43,48,.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${((parseFloat(it.value) || 0) / maxV) * 100}%`, height: '100%', borderRadius: 7,
                      background: `linear-gradient(90deg, ${hexA(ac, 0.55)}, ${ac})` }} />
                  </div>
                  <span style={{ flex: '0 0 auto', fontFamily: "'Space Mono', monospace", fontSize: 23, fontWeight: 700, color: 'var(--aip-ink)', whiteSpace: 'nowrap' }}>
                    {it.value}<span style={{ fontSize: 15, color: 'var(--aip-ink-3)', marginLeft: 3 }}>{it.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 占比环 */}
          {showRatio && (
            <div style={{ ...GLASS, gridColumn: '2 / 3', display: 'flex', alignItems: 'center', gap: 24, padding: '20px 30px' }}>
              <div style={{ flex: '0 0 auto', width: 156, height: 156, borderRadius: '50%',
                background: `conic-gradient(${ac} ${p.ratio.value * 3.6}deg, ${hexA(ac, 0.14)} 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 122, height: 122, borderRadius: '50%', background: '#fff', display: 'flex',
                  alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 33, fontWeight: 700, color: ac, lineHeight: 1 }}>{p.ratio.value}</span>
                    <span style={{ fontSize: 19, color: 'var(--aip-ink-3)', fontWeight: 700, marginLeft: 2 }}>{p.ratio.unit}</span>
                  </span>
                </div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 20, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: 'var(--aip-ink-3)', fontWeight: 700 }}>Concentration</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--aip-ink)', marginTop: 6, lineHeight: 1.2, textWrap: 'pretty' }}>{p.ratio.label}</div>
              </div>
            </div>
          )}

          {/* 金句 */}
          {showQuote && (
            <div style={{ ...TILE, gridColumn: '1 / 3', background: ac, display: 'flex', alignItems: 'center', padding: '20px 36px' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 92, fontWeight: 700, color: hexA(onAcc, 0.3), lineHeight: 0.6, marginRight: 18 }}>“</span>
              <div style={{ fontSize: 38, fontWeight: 900, color: onAcc, lineHeight: 1.25, textWrap: 'pretty' }}>
                {p.quote.mark && p.quote.text.includes(p.quote.mark)
                  ? (() => { const i = p.quote.text.indexOf(p.quote.mark); return (
                      <span>{p.quote.text.slice(0, i)}<span style={{ textDecoration: 'underline', textDecorationThickness: 6,
                        textUnderlineOffset: 6 }}>{p.quote.mark}</span>{p.quote.text.slice(i + p.quote.mark.length)}</span>); })()
                  : p.quote.text}
              </div>
            </div>
          )}
        </div>

        {/* 影像区 */}
        {n > 0 && (
          <div style={{ flex: '1', minWidth: 0 }}>
            <ImageRegion n={n} images={p.images} fit={p.imageFit} />
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 14 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
