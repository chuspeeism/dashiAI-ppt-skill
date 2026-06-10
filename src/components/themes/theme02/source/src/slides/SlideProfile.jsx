/**
 * SlideProfile.jsx — 公司档案（图片页 · 案例身份卡）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * A single-company case-study identity layout: a ratio-adaptive portrait image
 * area on one side, an identity lockup (name + role + tags), a compact fact
 * ledger, and an optional pull quote. Image count is tunable 0–2 while keeping
 * the composition balanced (0 → the text column spans full width).
 *
 * ── Props (see slideProfileDefaults) ────────────────────────────────────────
 *   kicker, name, nameEm, role        strings (nameEm = glowing fragment)
 *   facts        Array<{label,value}>  the fact ledger rows
 *   factCount    number   how many fact rows to show (slices `facts`)
 *   quote        string   pull-quote body
 *   quoteBy      string   pull-quote attribution
 *   tags         string[] decorative pills under the identity
 *   imageCount   number   0–2 portrait slots (0 → text-only, full width)
 *   imageSide    'left' | 'right'   which side the image column sits on
 *   captions     string[] per-slot caption text
 *   focusEnabled boolean  highlight one image (accent ring)
 *   focusIndex   number   0-based slot to highlight
 *   showQuote    boolean  show/hide the pull quote
 *   images       array    image sources (preview wiring)
 *   onSlotActivate, onSlotClear  fn?  preview slot wiring
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader, ImageSlots, TagRow } from '../gxnPrimitives.jsx';

export const slideProfileDefaults = {
  kicker: 'CASE · 公司档案',
  name: 'Anthropic ',
  nameEm: '安全对齐路线',
  role: '通用大模型 · 从追赶到反超',
  facts: [
    { label: '成立', value: '2021' },
    { label: '最新估值', value: '9650 亿美元' },
    { label: '全年累计融资', value: '650 亿美元' },
    { label: '融资轮次', value: 'Series G → H 三轮' },
    { label: 'IPO 进度', value: '2026 已递交申请' },
  ],
  factCount: 5,
  quote: '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。',
  quoteBy: 'Dario Amodei · 联合创始人 / CEO',
  tags: ['安全对齐', '企业信任', '云巨头渠道'],
  imageCount: 1,
  imageSide: 'right',
  captions: ['Anthropic · 公司形象', 'Claude · 产品界面'],
  focusEnabled: false,
  focusIndex: 0,
  showQuote: true,
  images: [],
};

export const slideProfileControls = [
  { key: 'imageCount', type: 'number', label: '图片数量', default: 1, min: 0, max: 2, step: 1,
    describe: '档案配图槽位数量（0 = 纯文字版式）' },
  { key: 'imageSide', type: 'enum', label: '图片位置', default: 'right',
    options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
    visibleWhen: (p) => p.imageCount > 0, describe: '配图列位于左侧或右侧' },
  { key: 'factCount', type: 'number', label: '档案条目', default: 5, min: 2, step: 1,
    maxFrom: (p) => (p.facts ? p.facts.length : 5), describe: '展示的事实条目数量' },
  { key: 'showQuote', type: 'toggle', label: '人物金句', default: true,
    describe: '显示/隐藏底部的人物金句' },
  { key: 'focusEnabled', type: 'toggle', label: '重点强调', default: false,
    visibleWhen: (p) => p.imageCount > 0, describe: '是否高亮其中一张配图' },
  { key: 'focusIndex', type: 'number', label: '强调项', default: 0, min: 0, step: 1,
    oneBased: true, maxFrom: (p) => Math.max(0, (p.imageCount || 1) - 1),
    visibleWhen: (p) => p.focusEnabled && p.imageCount > 0, describe: '被强调配图的序号' },
];

export function SlideProfile(props) {
  const p = { ...slideProfileDefaults, ...props };
  const hasImages = p.imageCount > 0;
  const fIdx = p.focusEnabled ? Math.max(0, Math.min(p.imageCount - 1, p.focusIndex)) : -1;
  const facts = (p.facts || []).slice(0, Math.max(1, p.factCount));

  const imageCol = hasImages ? (
    <div style={{ minHeight: 0, minWidth: 0 }}>
      <ImageSlots count={p.imageCount} items={p.images}
                  captions={p.captions} focusIndex={fIdx}
                  arrange={p.imageCount >= 2 ? 'row' : 'grid'} gap={18}
                  onActivate={p.onSlotActivate} onClear={p.onSlotClear}
                  placeholder="拖入人物 / 产品图 · IMAGE" />
    </div>
  ) : null;

  const textCol = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 30, justifyContent: 'center', minWidth: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--gxn-font-sans)', fontWeight: 700,
                     fontSize: 64, lineHeight: 1.06, letterSpacing: '-0.01em', color: 'var(--gxn-text)' }}>
          {p.name}{p.nameEm && <span className="gxn-em">{p.nameEm}</span>}
        </h2>
        <p className="gxn-mono" style={{ margin: 0, fontSize: 26, letterSpacing: '.04em', color: 'var(--gxn-dim)' }}>{p.role}</p>
      </div>

      {/* fact ledger */}
      <div className="gxn-panel" style={{ padding: '8px 30px' }}>
        {facts.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24,
            padding: '18px 0', borderTop: i === 0 ? 'none' : '1px solid var(--gxn-line)',
          }}>
            <span className="gxn-mono" style={{ fontSize: 24, color: 'var(--gxn-faint)', letterSpacing: '.04em' }}>{f.label}</span>
            <span className={cx('gxn-num', i === 1 && 'gxn-aurora-num')} style={{
              fontSize: 32, fontWeight: 600, textAlign: 'right',
              color: i === 1 ? 'var(--gxn-accent)' : 'var(--gxn-text)',
              textShadow: i === 1 ? '0 0 24px rgba(var(--gxn-glow),0.5)' : 'none',
            }}>{f.value}</span>
          </div>
        ))}
      </div>

      <TagRow tags={p.tags} />
    </div>
  );

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} index={p.index} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 36, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            {!hasImages ? (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', maxWidth: 1320 }}>{textCol}</div>
            ) : (
              <div style={{
                height: '100%', display: 'grid', gap: 64, alignItems: 'stretch', minHeight: 0,
                gridTemplateColumns: p.imageSide === 'left' ? '1.04fr 1.1fr' : '1.1fr 1.04fr',
              }}>
                {p.imageSide === 'left' ? <>{imageCol}{textCol}</> : <>{textCol}{imageCol}</>}
              </div>
            )}
          </div>

          {p.showQuote && (
            <div className="gxn-panel gxn-rise-3" style={{ padding: '26px 36px', display: 'flex', alignItems: 'center', gap: 28, flex: '0 0 auto' }}>
              <span aria-hidden="true" style={{
                fontFamily: 'Georgia, serif', fontSize: 96, lineHeight: 0.7, color: 'var(--gxn-accent)',
                opacity: 0.4, textShadow: '0 0 30px rgba(var(--gxn-glow),0.5)', flex: '0 0 auto',
              }}>“</span>
              <p style={{ margin: 0, flex: 1, fontSize: 'var(--gxn-fs-h3)', lineHeight: 1.45, color: 'var(--gxn-text)', textWrap: 'pretty' }}>
                {p.quote}
                <span className="gxn-mono" style={{ display: 'block', marginTop: 10, fontSize: 22, color: 'var(--gxn-faint)' }}>{p.quoteBy}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SlideProfile;
