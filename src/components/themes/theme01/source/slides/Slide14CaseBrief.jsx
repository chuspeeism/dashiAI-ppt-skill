// Slide14CaseBrief.jsx — 典型案例（简版）/ Reusable brief case-study page.
// A second, lighter case layout (distinct from Slide07's milestone timeline):
// intro + stat cards + key-point cards on the left, an adaptive image area on
// the right. Designed for reuse — the SAME component renders any company by
// swapping props (see defaultProps; the deck instantiates it for both xAI and
// CoreWeave). Fully controlled by props; `aip-` scoped; relative imports only.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, ImageSlot, CollageImageArea, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '# 典型案例',
  tone: 'blue',
  accentColor: '#5b8def',
  title: 'xAI · 马斯克的第三次创业',
  en: "Musk's Third Venture",
  intro: '由埃隆·马斯克于 2023 年创立的 xAI，在 2024 年 11 月完成 50 亿美元融资，估值达 500 亿美元。体量虽不及 OpenAI / Anthropic，但增速惊人——从成立到跻身头部梯队仅用 18 个月。',
  stats: [
    { value: '50', unit: '亿美元', label: '单轮融资' },
    { value: '500', unit: '亿美元', label: '投后估值' },
    { value: '18', unit: '个月', label: '跻身头部' },
  ],
  points: [
    { h: 'X 平台数据', d: '背靠 X（原 Twitter），拥有海量实时社交数据' },
    { h: '特斯拉协同', d: '与自动驾驶团队协同，多模态感知积累深厚' },
    { h: 'Grok 差异化', d: '主打「幽默、实时、无审查」，定位鲜明' },
  ],
  images: ['', '', ''],
  caption: '体量不及头部，但增速惊人 · 差异化定位形成独特护城河',
  // ── tweakable ──
  statCount: 3,
  pointCount: 3,
  highlight: true,
  highlightIndex: 0,
  imageSlotCount: 1,
  imageFit: 'cover',
  imageLayout: 'normal',
  showCaption: true,
};

export const controls = [
  { key: 'statCount', label: '指标卡数量', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 张',
    description: '顶部关键指标卡的数量（0 时隐藏整行）。' },
  { key: 'pointCount', label: '要点卡数量', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 张',
    description: '核心优势要点卡的数量。' },
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个要点。' },
  { key: 'highlightIndex', label: '强调第几项', type: 'number', default: 0, min: 0, max: 2, step: 1,
    description: '被强调的要点序号（从 0 开始）。' },
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 1, min: 0, max: 3, step: 1, unit: ' 张',
    description: '右侧图片槽数量（0 时文字占满整页，布局自动适配）。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满构图统一，完整自适应按原始比例显示。' },
  { key: 'imageLayout', label: '图片版式', type: 'select', default: 'normal',
    options: [{ value: 'normal', label: '常规排布' }, { value: 'collage', label: '叠放拼贴' }],
    description: '常规：整齐排布；叠放拼贴：图片倾斜叠压、白边浮起的拼贴效果。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传图片（数量由「图片数量」控制），槽位会自适应图片比例。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
];

// Adaptive image composition (0–3 slots), balanced at every count & ratio.
function ImageArea({ count, images, fit, accent }) {
  const mode = fit === 'contain' ? 'auto' : 'fill';
  const slot = (i, style) => (
    <ImageSlot key={i} src={images[i] || ''} placeholder={`图片 ${i + 1}`} fit={fit}
      ratioMode={count === 1 ? mode : 'fill'} accent={accent} style={style} />
  );
  if (count === 1) {
    return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>{slot(0, { height: fit === 'contain' ? 'auto' : '100%' })}</div>;
  }
  if (count === 2) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>{slot(0, { flex: 1 })}{slot(1, { flex: 1 })}</div>;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, height: '100%' }}>
      {slot(0, { flex: 1.5 })}
      <div style={{ display: 'flex', gap: 22, flex: 1 }}>{slot(1, { flex: 1 })}{slot(2, { flex: 1 })}</div>
    </div>
  );
}

export default function Slide14CaseBrief(props) {
  const p = { ...defaultProps, ...props };
  const c = p.accentColor;
  const stats = p.stats.slice(0, Math.max(0, Math.min(3, p.statCount)));
  const pts = p.points.slice(0, Math.max(1, Math.min(3, p.pointCount)));
  const hasImg = p.imageSlotCount > 0;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} />

      <div style={{ flex: 1, display: 'flex', gap: 56, marginTop: 8, minHeight: 0 }}>
        {/* left: narrative + stats + points */}
        <div style={{ flex: hasImg ? 1.12 : 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 27, lineHeight: 1.5, color: 'var(--aip-ink-2)', fontWeight: 500, textWrap: 'pretty' }}>{p.intro}</p>

          {stats.length > 0 && (
            <div style={{ display: 'flex', gap: 16 }}>
              {stats.map((st, i) => (
                <div key={i} style={{ flex: 1, padding: '15px 22px', borderRadius: 18,
                  background: `linear-gradient(160deg, ${hexA(c, 0.14)}, ${hexA(c, 0.04)})`,
                  border: `1px solid ${hexA(c, 0.28)}` }}>
                  <div style={{ fontSize: 46, fontWeight: 900, color: 'var(--aip-ink)', lineHeight: 1, whiteSpace: 'nowrap' }}>
                    {st.value}<small style={{ fontSize: 24, fontWeight: 700, color: hexA(c, 0.9), marginLeft: 4 }}>{st.unit}</small>
                  </div>
                  <div style={{ fontSize: 24, color: 'var(--aip-ink-2)', marginTop: 5, fontWeight: 500 }}>{st.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'center' }}>
            {pts.map((pt, i) => {
              const on = p.highlight && i === p.highlightIndex;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '13px 22px', borderRadius: 16,
                  background: on ? `linear-gradient(120deg, ${hexA(c, 0.16)}, ${hexA(c, 0.05)})` : 'rgba(255,255,255,.5)',
                  border: `1px solid ${on ? hexA(c, 0.5) : 'rgba(255,255,255,.65)'}`,
                  boxShadow: on ? `0 16px 36px ${hexA(c, 0.2)}` : 'none', transition: 'all .3s ease' }}>
                  <span style={{ flex: '0 0 auto', width: 14, height: 14, borderRadius: '50%', background: on ? c : hexA(c, 0.45) }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--aip-ink)' }}>{pt.h}</div>
                    <div style={{ fontSize: 23, color: 'var(--aip-ink-2)', lineHeight: 1.4, marginTop: 2, textWrap: 'pretty' }}>{pt.d}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* right: adaptive image area */}
        {hasImg && (
          <div style={{ flex: 1, minWidth: 0 }}>
            {p.imageLayout === 'collage'
              ? <CollageImageArea count={Math.min(3, p.imageSlotCount)} images={p.images} fit={p.imageFit} accent={c} />
              : <ImageArea count={Math.min(3, p.imageSlotCount)} images={p.images} fit={p.imageFit} accent={c} />}
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}

// ── Preset props for the second instance (CoreWeave) — exported so the deck
//    (or any host) can render the same component with different content. ──
export const coreweaveProps = {
  kicker: '# 典型案例',
  tone: 'green',
  accentColor: '#46b083',
  title: 'CoreWeave · 卖铲子的人也赚翻了',
  en: 'Selling Shovels in the Gold Rush',
  intro: '原本是一家加密货币挖矿公司，2023 年转型为 AI 算力云服务商。2024 年完成 110 亿美元融资，估值超 190 亿美元——印证了「淘金热中卖铲子」的商业逻辑。',
  stats: [
    { value: '110', unit: '亿美元', label: '年度融资' },
    { value: '190', unit: '亿美元', label: '投后估值' },
    { value: '2023', unit: '转型', label: '挖矿→算力云' },
  ],
  points: [
    { h: 'NVIDIA 长约', d: '签订长期供应协议，锁定数万张 H100/H200 GPU' },
    { h: '稀缺算力', d: '提前锁定 GPU 资源，反成稀缺标的' },
    { h: '核心供应商', d: 'OpenAI、Stability AI 等公司的算力供应方' },
  ],
  images: ['', '', ''],
  caption: '当所有模型公司都在抢 GPU，提前锁定算力者反成赢家',
  statCount: 3,
  pointCount: 3,
  highlight: true,
  highlightIndex: 0,
  imageSlotCount: 1,
  imageFit: 'cover',
  imageLayout: 'normal',
  showCaption: true,
};
