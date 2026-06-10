// Slide07Case.jsx — 典型案例 / Deep-dive case study (with image slots).
// Image area adapts to slot count (0–3) with balanced compositions, and to each
// image's ratio via imageFit. Milestone count, highlight, and quote are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, ImageSlot, CollageImageArea, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 典型案例',
  title: '典型案例 · Anthropic',
  en: 'From Challenger to Frontrunner',
  intro: '2021 年由 OpenAI 前研究副总裁 Dario Amodei 创立。2024 年连续完成三轮大额融资，累计超 650 亿美元，估值突破 9650 亿美元，超越 OpenAI 成为全球估值最高的 AI 初创企业。',
  milestones: [
    { date: '2024 · 05', round: 'Series G', amount: '280 亿', note: '估值 600 亿', color: '#5b8def' },
    { date: '2024 · 08', round: 'Series H 首轮', amount: '180 亿', note: '估值 830 亿', color: '#46b083' },
    { date: '2024 · 11', round: 'Series H 扩轮', amount: '190 亿', note: '估值 9650 亿', color: '#e8503a' },
    { date: '2026 · 06', round: '递交 IPO 申请', amount: '预计年内上市', note: '全球估值最高 AI 初创', color: '#7a5ae0' },
  ],
  quote: '通过 Constitutional AI 等方法构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
  quoteBy: 'Dario Amodei · CEO',
  images: ['', '', ''],
  // tweakable
  milestoneCount: 4,
  highlight: true,
  highlightIndex: 2,
  imageSlotCount: 2,
  imageFit: 'cover',
  imageLayout: 'normal',
  showQuote: true,
};

export const controls = [
  { key: 'milestoneCount', label: '里程碑数量', type: 'number', default: 4, min: 0, max: 4, step: 1, unit: ' 项',
    description: '展示的融资里程碑卡片数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个里程碑。' },
  { key: 'highlightIndex', label: '强调第几项', type: 'number', default: 2, min: 0, max: 3, step: 1,
    description: '被强调的里程碑序号（从 0 开始）。' },
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 2, min: 0, max: 3, step: 1, unit: ' 张',
    description: '右侧图片槽数量（0 时文字占满整页，布局自动适配）。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满构图统一，完整自适应按原始比例显示。' },
  { key: 'imageLayout', label: '图片版式', type: 'select', default: 'normal',
    options: [{ value: 'normal', label: '常规排布' }, { value: 'collage', label: '叠放拼贴' }],
    description: '常规：整齐排布；叠放拼贴：图片倾斜叠压、白边浮起的拼贴效果。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传图片（数量由「图片数量」控制），槽位会自适应图片比例。' },
  { key: 'showQuote', label: '引言', type: 'boolean', default: true,
    description: '是否显示创始人引言。' },
];

function ImageArea({ count, images, fit }) {
  const mode = fit === 'contain' ? 'auto' : 'fill';
  const slot = (i, style) => (
    <ImageSlot key={i} src={images[i] || ''} placeholder={`图片 ${i + 1}`} fit={fit}
      ratioMode={count === 1 ? mode : 'fill'} accent="#5b8def" style={style} />
  );
  if (count === 1) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>{slot(0, { height: count === 1 && fit === 'contain' ? 'auto' : '100%' })}</div>;
  }
  if (count === 2) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>{slot(0, { flex: 1 })}{slot(1, { flex: 1 })}</div>;
  }
  // 3 — hero on top, two below
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>
      {slot(0, { flex: 1.5 })}
      <div style={{ display: 'flex', gap: 22, flex: 1 }}>{slot(1, { flex: 1 })}{slot(2, { flex: 1 })}</div>
    </div>
  );
}

export default function Slide07Case(props) {
  const p = { ...defaultProps, ...props };
  const ms = p.milestones.slice(0, Math.max(0, Math.min(4, p.milestoneCount)));
  const hasImg = p.imageSlotCount > 0;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone="violet" title={p.title} en={p.en} />

      <div style={{ flex: 1, display: 'flex', gap: 56, marginTop: 8, minHeight: 0 }}>
        {/* left: narrative */}
        <div style={{ flex: hasImg ? 1.15 : 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <p style={{ margin: 0, fontSize: 29, lineHeight: 1.55, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.intro}</p>

          <div style={{ display: hasImg ? 'flex' : 'grid', flexDirection: 'column',
            gridTemplateColumns: hasImg ? undefined : 'repeat(2, 1fr)', gap: 10 }}>
            {ms.map((m, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 22, padding: '12px 24px', borderRadius: 16,
                  background: on ? `linear-gradient(120deg, ${hexA(m.color, 0.16)}, ${hexA(m.color, 0.05)})` : 'rgba(255,255,255,.45)',
                  border: `1px solid ${on ? hexA(m.color, 0.5) : 'rgba(255,255,255,.6)'}`,
                  boxShadow: on ? `0 16px 36px ${hexA(m.color, 0.2)}` : 'none', transition: 'all .3s ease',
                }}>
                  <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 120 }}>
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 24, letterSpacing: '.02em', color: m.color, fontWeight: 700 }}>{m.date}</div>
                  </div>
                  <div style={{ width: 1, alignSelf: 'stretch', background: hexA(m.color, 0.3) }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--aip-ink)' }}>{m.round}</div>
                    <div style={{ fontSize: 24, color: 'var(--aip-ink-3)', marginTop: 2 }}>{m.note}</div>
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: on ? m.color : 'var(--aip-ink)', whiteSpace: 'nowrap' }}>{m.amount}</div>
                </div>
              );
            })}
          </div>

          {p.showQuote && (
            <div style={{ position: 'relative', padding: '16px 24px 16px 36px', borderRadius: 16,
              background: 'rgba(255,255,255,.5)', borderLeft: '5px solid var(--aip-violet)' }}>
              <div style={{ fontSize: 24, lineHeight: 1.5, color: 'var(--aip-ink)', fontWeight: 500, fontStyle: 'italic' }}>“{p.quote}”</div>
              <div style={{ marginTop: 8, fontFamily: 'Space Mono, monospace', fontSize: 24, color: 'var(--aip-ink-3)' }}>— {p.quoteBy}</div>
            </div>
          )}
        </div>

        {/* right: adaptive image area */}
        {hasImg && (
          <div style={{ flex: 1, minWidth: 0 }}>
            {p.imageLayout === 'collage'
              ? <CollageImageArea count={Math.min(3, p.imageSlotCount)} images={p.images} fit={p.imageFit} accent="#7a5ae0" />
              : <ImageArea count={Math.min(3, p.imageSlotCount)} images={p.images} fit={p.imageFit} />}
          </div>
        )}
      </div>
    </SlideFrame>
  );
}
