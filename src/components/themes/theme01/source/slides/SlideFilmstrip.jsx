// SlideFilmstrip.jsx — 影像长卷 / a clean horizontal strip of equal image frames.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Unlike the tilted scrapbook collage, this is an editorial contact-sheet: 2–5
// equal-height frames sit shoulder-to-shoulder, each carrying a mono index badge
// and a caption bar; one frame can be promoted (wider + accent frame) as the
// lead still. Images self-adapt via ImageSlot (cover crops, contain letterboxes,
// never warps). Frame count, fit, index badges, captions, the lead frame and
// accent are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, ImageSlot, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '典型案例 · 影像长卷',
  tone: 'violet',
  title: '2024，被资本改写的一年',
  en: 'The Year in Frames',
  cn: '四个关键场景，串起全年最受瞩目的融资时刻',
  frames: [
    { caption: 'OpenAI · 660 亿美元新一轮', tag: '通用大模型' },
    { caption: 'Anthropic · 安全对齐的押注', tag: '通用大模型' },
    { caption: 'xAI · 算力军备竞赛', tag: '算力' },
    { caption: 'CoreWeave · 卖铲子的人', tag: '基础设施' },
  ],
  images: ['', '', '', '', ''],
  caption: '影像长卷 · 一帧一事件，串起全年资本主线',
  // tweakable (universal names)
  imageSlotCount: 4,
  imageFit: 'cover',
  highlight: true,
  highlightIndex: 0,
  showIndex: true,
  showFrameCaption: true,
  accentColor: '#7a5ae0',
  showCaption: true,
};

export const controls = [
  { key: 'imageSlotCount', label: '画面数量', type: 'number', default: 4, min: 2, max: 5, step: 1, unit: ' 帧',
    description: '长卷中并排的画面（图片帧）数量。' },
  { key: 'imageFit', label: '图片填充', type: 'select', default: 'cover',
    options: [{ value: 'cover', label: '裁剪填满' }, { value: 'contain', label: '完整自适应' }],
    description: '图片填充方式：裁剪填满铺满画面，完整自适应按原始比例显示。' },
  { key: 'images', label: '图片', type: 'images', countKey: 'imageSlotCount',
    description: '上传画面图片，槽位自适应图片比例不变形。' },
  { key: 'highlight', label: '主画面', type: 'boolean', default: true,
    description: '是否把其中一帧加宽并以主题色描边，作为主画面。' },
  { key: 'highlightIndex', label: '主画面第几帧', type: 'number', default: 0, min: 0, max: 4, step: 1,
    description: '被加宽强调的主画面序号（从 0 开始）。' },
  { key: 'showIndex', label: '编号角标', type: 'boolean', default: true,
    description: '每帧左上角 01 / 02 编号角标的显示。' },
  { key: 'showFrameCaption', label: '画面说明', type: 'boolean', default: true,
    description: '每帧底部说明条 / 标签的显示。' },
  { key: 'accentColor', label: '主题色', type: 'color', default: '#7a5ae0',
    options: ['#7a5ae0', '#5b8def', '#46b083', '#e0a23a', '#e8503a'],
    description: '编号角标、标签与主画面描边的主题色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideFilmstrip(props) {
  const p = { ...defaultProps, ...props };
  const ac = p.accentColor;
  const n = Math.max(2, Math.min(5, p.imageSlotCount));
  const frames = Array.from({ length: n }, (_, i) => p.frames[i] || { caption: '', tag: '' });
  const hiIdx = p.highlight ? Math.min(p.highlightIndex, n - 1) : -1;

  return (
    <SlideFrame bg="a">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 24, display: 'flex', gap: 18 }}>
        {frames.map((fr, i) => {
          const on = i === hiIdx;
          return (
            <div key={i} style={{ flex: on ? 1.6 : 1, minWidth: 0, position: 'relative', borderRadius: 22, overflow: 'hidden',
              border: on ? `4px solid ${ac}` : '1px solid rgba(255,255,255,.7)',
              boxShadow: on ? `0 26px 60px ${hexA(ac, 0.4)}` : '0 18px 44px rgba(70,72,100,.18)' }}>
              <ImageSlot src={p.images[i] || ''} placeholder={`画面 ${i + 1}`} fit={p.imageFit}
                ratioMode="fill" accent={ac} radius={0}
                style={{ height: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }} />

              {/* index badge */}
              {p.showIndex && (
                <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 3, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', minWidth: 52, height: 52, padding: '0 12px', borderRadius: 13,
                  background: on ? ac : 'rgba(20,20,28,.78)', color: '#fff', backdropFilter: 'blur(6px)',
                  fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(20,20,28,.3)' }}>{String(i + 1).padStart(2, '0')}</div>
              )}

              {/* caption bar */}
              {p.showFrameCaption && (fr.caption || fr.tag) && (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3, padding: '40px 18px 16px',
                  background: 'linear-gradient(180deg, transparent, rgba(18,18,26,.84))' }}>
                  {fr.tag && (
                    <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 8, marginBottom: 8,
                      background: hexA(ac, 0.92), color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '.02em' }}>{fr.tag}</span>
                  )}
                  {fr.caption && (
                    <div style={{ fontSize: on ? 30 : 25, fontWeight: 800, color: '#fff', lineHeight: 1.25,
                      textShadow: '0 2px 12px rgba(0,0,0,.5)', textWrap: 'pretty' }}>{fr.caption}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MonoCaption show={p.showCaption} style={{ marginTop: 16 }}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
