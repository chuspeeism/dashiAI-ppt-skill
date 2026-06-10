// SlideMagCover.jsx — 图片页 · 杂志封面贴纸特写（满版影像 + 叠贴标签 + 超大字）。
// 迁移安全：default export + defaultProps + controls；纯 props 驱动；aip- 作用域。
//
// 设计语言取自「标签化 / 贴纸化」潮流：满版影像之上，标题被拆成多枚错落的实色
// 贴纸块（黑 / 白 / 荧光交替、各自微旋），四角点缀手写感批注贴纸，底部一枚大数字
// 贴纸钉在画面上。影像槽 0–2 张：1 张满版、2 张则左右分屏，均按比例自适应不变形。
import React from 'react';
import { SlideFrame, ImageSlot, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '封面故事 · 算力',
  // 标题按行拆成贴纸；fill: 'dark' | 'light' | 'accent'
  titleLines: [
    { text: '算力即权力', fill: 'dark' },
    { text: '一场资本', fill: 'light' },
    { text: '军备竞赛', fill: 'accent' },
  ],
  en: 'The Compute Arms Race',
  bigStat: { value: '255', unit: '亿', label: '上游芯片 + 基础设施吸金' },
  // 四角批注贴纸；pos: 'tl' | 'tr' | 'bl' | 'br'
  notes: [
    { text: 'GPU 一卡难求', pos: 'tl', rot: -5 },
    { text: 'CoreWeave ↑ 190 亿', pos: 'tr', rot: 4.5 },
    { text: '谁囤算力，谁定价', pos: 'bl', rot: 4 },
  ],
  images: ['', ''],
  caption: '杂志封面 · 算力成为这场竞赛最确定的底层资产',
  // tweakable（通用命名）
  imageSlotCount: 1,
  imageFit: 'cover',
  titleLineCount: 3,
  noteCount: 3,
  showBigStat: true,
  showEn: true,
  accentColor: '#c9f24d',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '图片数量', type: 'number', default: 1, min: 0, max: 2, step: 1, unit: ' 张',
    description: '满版影像槽：0 纯色封面 / 1 满版 / 2 左右分屏，均按比例自适应不变形。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '裁剪填满铺满版面，或完整自适应按原始比例显示。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传封面影像，槽位自适应图片比例。' },
  { key: 'titleLineCount', label: '标题行数', type: 'number', default: 3, min: 1, max: 3, step: 1, unit: ' 行',
    description: '标题贴纸的行数（黑 / 白 / 荧光交替）。' },
  { key: 'noteCount', label: '批注贴纸', type: 'number', default: 3, min: 0, max: 3, step: 1, unit: ' 枚',
    description: '四角手写感批注贴纸的数量。' },
  { key: 'showBigStat', label: '大数字贴纸', type: 'boolean', default: true,
    description: '底部大数字贴纸的显示。' },
  { key: 'showEn', label: '英文副标', type: 'boolean', default: true,
    description: '标题下方英文副标的显示。' },
  { key: 'accentColor', label: '荧光色', type: 'color', default: '#c9f24d',
    options: ['#c9f24d', '#5b8def', '#46b083', '#e0a23a', '#e8503a', '#7a5ae0'],
    description: '荧光贴纸与强调元素的颜色。' },
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

const POS = {
  tl: { top: '16%', left: '5%' }, tr: { top: '8%', right: '5%' },
  bl: { bottom: '20%', left: '5%' }, br: { bottom: '20%', right: '5%' },
};

export default function SlideMagCover(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const onAcc = readableOn(ac);
  const n = Math.max(0, Math.min(2, p.imageSlotCount));
  const lines = (p.titleLines || []).slice(0, Math.max(1, Math.min(3, p.titleLineCount)));
  const notes = (p.notes || []).slice(0, Math.max(0, Math.min(3, p.noteCount)));

  const stickerFill = (kind) => {
    if (kind === 'accent') return { background: ac, color: onAcc };
    if (kind === 'light') return { background: 'rgba(255,255,255,.94)', color: '#23232a' };
    return { background: '#1c1c22', color: '#ffffff' };
  };

  return (
    <SlideFrame bg="a">
      {/* 满版影像层 */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {n === 0 ? (
          <div style={{ flex: 1, background: 'linear-gradient(140deg, #2a2a34, #15151c)' }} />
        ) : (
          Array.from({ length: n }).map((_, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, borderRight: n === 2 && i === 0 ? '3px solid rgba(255,255,255,.85)' : 'none' }}>
              <ImageSlot src={p.images[i] || ''} placeholder={n === 2 ? `影像 ${i + 1}` : '满版影像'} fit={p.imageFit}
                ratioMode="fill" accent="#5b8def" radius={0} style={{ height: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }} />
            </div>
          ))
        )}
      </div>
      {/* 压暗渐变，保证贴纸可读 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(14,14,20,.34) 0%, rgba(14,14,20,.05) 30%, rgba(14,14,20,.16) 64%, rgba(14,14,20,.6) 100%)' }} />

      {/* 顶部 kicker 贴纸 */}
      <div style={{ position: 'absolute', top: 'var(--aip-pad-top)', left: 'var(--aip-pad-x)', zIndex: 4 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 13,
          background: '#1c1c22', color: '#fff', transform: 'rotate(-1.4deg)', boxShadow: '0 14px 30px rgba(10,10,16,.4)' }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: ac }} />
          <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: '.04em', whiteSpace: 'nowrap' }}># {p.kicker}</span>
        </span>
      </div>

      {/* 角落批注贴纸 */}
      {notes.map((nt, i) => (
        <div key={i} style={{ position: 'absolute', zIndex: 4, ...POS[nt.pos], transform: `rotate(${nt.rot || 0}deg)` }}>
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap', padding: '12px 22px', borderRadius: 14, fontSize: 28, fontWeight: 800,
            background: 'rgba(255,255,255,.92)', color: '#23232a', border: '2px dashed rgba(35,35,42,.32)',
            boxShadow: '0 14px 32px rgba(10,10,16,.3)' }}>{nt.text}</span>
        </div>
      ))}

      {/* 中央标题贴纸堆 */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', padding: '0 var(--aip-pad-x)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
          {lines.map((ln, i) => {
            const f = stickerFill(ln.fill);
            const rot = [-2.2, 1.6, -1.2][i % 3];
            return (
              <span key={i} style={{ ...f, display: 'inline-block', padding: '10px 30px 16px', borderRadius: 16,
                fontSize: 132, fontWeight: 900, lineHeight: 0.98, letterSpacing: '.005em', transform: `rotate(${rot}deg)`,
                boxShadow: ln.fill === 'accent' ? `0 20px 48px -16px ${hexA(ac, 0.7)}` : '0 22px 50px rgba(10,10,16,.42)',
                border: ln.fill === 'light' ? '1px solid rgba(255,255,255,.9)' : 'none' }}>{ln.text}</span>
            );
          })}
        </div>
        {p.showEn && (
          <div style={{ marginTop: 26, marginLeft: 8, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase',
            letterSpacing: '.18em', fontSize: 30, fontWeight: 700, color: '#fff', textShadow: '0 2px 14px rgba(0,0,0,.5)' }}>{p.en}</div>
        )}
      </div>

      {/* 底部大数字贴纸 */}
      {p.showBigStat && (
        <div style={{ position: 'absolute', zIndex: 4, right: 'var(--aip-pad-x)', bottom: 100, transform: 'rotate(-1.6deg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, padding: '22px 34px', borderRadius: 22,
            background: 'rgba(255,255,255,.96)', boxShadow: '0 24px 56px rgba(10,10,16,.4)', border: '1px solid rgba(255,255,255,.9)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 138, fontWeight: 900, lineHeight: 0.82, letterSpacing: '-.02em', color: '#23232a' }}>{p.bigStat.value}</span>
              <span style={{ fontSize: 52, fontWeight: 900, color: 'var(--aip-ink-2)' }}>{p.bigStat.unit}</span>
            </div>
            <div style={{ paddingBottom: 12, maxWidth: 280 }}>
              <span style={{ display: 'inline-block', height: 10, width: 64, borderRadius: 5, background: ac, marginBottom: 12 }} />
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--aip-ink-2)', lineHeight: 1.3, textWrap: 'pretty' }}>{p.bigStat.label}</div>
            </div>
          </div>
        </div>
      )}

      {p.showCaption && (
        <div style={{ position: 'absolute', zIndex: 4, left: 'var(--aip-pad-x)', bottom: 44 }}>
          <MonoCaption style={{ color: 'rgba(255,255,255,.82)' }}>{p.caption}</MonoCaption>
        </div>
      )}
    </SlideFrame>
  );
}
