// SwSlideSplit.jsx — "影像分栏 / Split" image-led editorial page.
//
// A hard vertical split: one full-bleed cover image owns ~half the canvas, the
// other half is an editorial text column with a giant ghost numeral and a
// caption chip straddling the seam. Distinct from Showcase (text-rail + grid),
// Hero (full-bleed) and Mosaic (collage). Image side, theme, caption, stat row
// and accent are props-controlled; all visible copy/data defaults live in
// `defaultProps`. Image data is controlled via `media`/
// `onMediaChange`; the component owns no persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'split', index: 10, label: '影像分栏 / Split' };

export const defaultProps = {
  accent: C.orange,
  theme: 'dark',           // 'light' | 'dark' (text column)
  imageSide: 'left',       // 'left' | 'right'
  showCaption: true,
  showStats: true,
  statCount: 2,            // 0–2 small stats under the headline
  media: [],
  onMediaChange: () => {},
  // —— content ——
  ghostText: '09',
  kicker: '创作者现场 / On Set',
  title: '镜头之外，\n还有一整套[[系统]]\n在替你运转。',
  intro: '当你在台上、在棚里、在路上，发行、结算与维权仍在后台无声完成。你只需要专注那一刻的表达。',
  captionTag: 'Live · 2026',
  captionText: '声浪现场 / 巡演纪实',
  mediaPlaceholder: '拖入整幅人物 / 现场大图',
  stats: [
    { v: '12k+', lb: '入驻音乐人' },
    { v: '¥2.4亿', lb: '已发版税' },
  ],
  page: '10',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '文字栏的明暗配色' },
  { key: 'imageSide', label: '图片位置', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '靠左' }, { value: 'right', label: '靠右' }], desc: '大图位于左侧或右侧' },
  { key: 'showCaption', label: '骑缝图注', type: 'toggle', def: true, desc: '显示/隐藏跨缝的图注小标签' },
  { key: 'showStats', label: '数据小行', type: 'toggle', def: true, desc: '显示/隐藏标题下的数据小行' },
  { key: 'statCount', label: '数据数量', type: 'slider', def: 2, min: 0, max: 2, step: 1,
    dependsOn: 'showStats', desc: '标题下数据条目的数量' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 图注 / 页脚强调色' },
];

export default function SwSlideSplit(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const left = p.imageSide === 'left';
  const sc = Math.max(0, Math.min(2, p.statCount));
  const stats = (p.stats || []).slice(0, sc);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;

  const ImagePane = (
    <div style={{ position: 'relative', minWidth: 0, minHeight: 0 }}>
      <SwImageSlot value={p.media[0] || null} onChange={(s) => p.onMediaChange(0, s)}
        fit="cover" accent={accent} radius={0} tone="dark" placeholder={p.mediaPlaceholder} />
    </div>
  );

  const TextPane = (
    <div style={{ position: 'relative', minWidth: 0, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: '0 92px' }}>
      {/* ghost numeral */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 34, right: left ? 64 : 'auto',
        left: left ? 'auto' : 64, fontFamily: F.mono, fontWeight: 700, fontSize: 200, lineHeight: 0.8,
        color: 'transparent', WebkitTextStroke: '2px ' + (dark ? 'rgba(245,225,227,.16)' : 'rgba(27,21,24,.12)') }}>{p.ghostText}</div>

      <Kicker accent={accent}>{p.kicker}</Kicker>
      <h2 style={{ fontWeight: 900, fontSize: 64, lineHeight: 1.1, letterSpacing: '-1.5px', marginTop: 20 }}>
        {renderSwText(p.title, { hl: { tone: 'o' } })}
      </h2>
      <p style={{ fontSize: T.body, lineHeight: 1.72, color: dark ? '#ddd5d2' : '#4f444a',
        marginTop: 22, maxWidth: 520 }}>
        {p.intro}
      </p>

      {p.showStats && sc > 0 && (
        <div style={{ display: 'flex', gap: 56, marginTop: 38, paddingTop: 28,
          borderTop: '1px solid ' + (dark ? C.lineD2 : C.line2) }}>
          {stats.map((s) => (
            <div key={s.lb}>
              <div style={{ fontWeight: 900, fontSize: 48, letterSpacing: '-1.5px', color: accent, whiteSpace: 'nowrap' }}>{s.v}</div>
              <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.1em', textTransform: 'uppercase',
                color: mut, marginTop: 6 }}>{s.lb}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <SlideRoot bg={bg} color={fg} style={{ padding: 0 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid',
        gridTemplateColumns: left ? '0.92fr 1.08fr' : '1.08fr 0.92fr' }}>
        {left ? <>{ImagePane}{TextPane}</> : <>{TextPane}{ImagePane}</>}
      </div>

      {/* caption chip anchored to the lower corner of the image pane */}
      {p.showCaption && (
        <div style={{ position: 'absolute', bottom: 64,
          left: left ? 48 : 'auto', right: left ? 'auto' : 48,
          zIndex: 6, background: accent, color: '#fff', padding: '14px 22px', borderRadius: 14,
          boxShadow: '0 18px 50px rgba(0,0,0,.28)', maxWidth: 230 }}>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 20, letterSpacing: '.14em',
            textTransform: 'uppercase' }}>{p.captionTag}</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4, lineHeight: 1.3 }}>{p.captionText}</div>
        </div>
      )}

      {/* footer pinned over the text column */}
      <div style={{ position: 'absolute', bottom: 0, left: left ? '46%' : 0, right: left ? 0 : '46%',
        padding: '0 92px 40px', zIndex: 6 }}>
        <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
      </div>
    </SlideRoot>
  );
}
