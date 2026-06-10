// SwSlideLogoWall.jsx — "伙伴墙 / Logo Wall" partner-grid page.
//
// An even grid of logo slots (platforms / partners) the user fills, paired with
// a compact title rail. Distinct from GridWall (photo wall) and Showcase: the
// slots here are small, uniform, neutral logo cells. Logo count (6–12), columns
// (3|4|6), title rail, captions, accent and theme are props-controlled, 1:1 with
// controls; all visible copy defaults live in `defaultProps`. Image slots are
// fully controlled (media + onMediaChange). No global
// side effects, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'logowall', index: 69, label: '伙伴墙 / Logo Wall' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  logoCount: 10,           // 6–12 logo cells
  columns: 5,              // 3 | 4 | 5
  showTitle: true,
  showCaptions: true,
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '69 — Logo Wall',
  kicker: '分发网络 / Everywhere',
  title: '一次上传，[[处处可听]]。',
  lede: '声浪已接入全球主流平台——你的作品，会出现在听众本来就在的地方。',
  names: ['Spotify', 'Apple Music', 'YouTube', 'TikTok', 'Amazon', 'Tidal', 'Deezer',
    'Bandcamp', 'SoundCloud', 'QQ音乐', '网易云', 'Pandora'],
  mediaPlaceholder: '拖入 Logo',
  page: '69',
  total: '82',
};

export const controls = [
  { key: 'logoCount', label: '品牌数量', type: 'slider', def: 10, min: 6, max: 12, step: 1,
    desc: '伙伴墙的 logo 格数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 5,
    options: [{ value: 3, label: '3' }, { value: 4, label: '4' }, { value: 5, label: '5' }], desc: 'logo 网格列数' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showTitle', label: '标题条', type: 'toggle', def: true, desc: '显示/隐藏顶部标题区' },
  { key: 'showCaptions', label: '伙伴名', type: 'toggle', def: true, desc: '显示/隐藏 logo 下方名称' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮 / 页脚强调色' },
];

export default function SwSlideLogoWall(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(6, Math.min(12, p.logoCount));
  const cols = [3, 4, 5].includes(p.columns) ? p.columns : 5;
  const rows = Math.ceil(count / cols);
  const dense = rows >= 4;          // short cells → trim padding/caption so the logo keeps room
  const gap = 16;
  const cellW = 'calc((100% - ' + ((cols - 1) * gap) + 'px) / ' + cols + ')';
  const cellH = 'calc((100% - ' + ((rows - 1) * gap) + 'px) / ' + rows + ')';

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const cellBg = dark ? '#241e20' : '#ffffff';
  const cellBorder = dark ? C.lineD : C.line;
  const capC = dark ? '#9a8f8c' : C.inkMut;

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        {p.showTitle && (
          <div style={{ flexShrink: 0, margin: '22px 0 22px', display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 40, position: 'relative' }}>
            <Shape kind="pentagon" size={52} color={accent} style={{ top: -6, right: 4, opacity: .9 }} />
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 14 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.6, color: capC, maxWidth: 400, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexWrap: 'wrap', gap: gap,
          justifyContent: 'center', alignContent: 'flex-start' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ position: 'relative', flex: '0 0 ' + cellW, width: cellW, height: cellH,
              borderRadius: 18, background: cellBg,
              border: '1px solid ' + cellBorder, padding: dense ? 10 : 14, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', minWidth: 0, minHeight: 0 }}>
              <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                  fit="contain" accent={accent} radius={10} tone={dark ? 'dark' : 'light'}
                  placeholder={p.mediaPlaceholder} />
              </div>
              {p.showCaptions && (
                <div style={{ flexShrink: 0, fontFamily: F.mono, fontSize: dense ? 15 : 18, letterSpacing: '.04em',
                  color: capC, marginTop: dense ? 5 : 10, textAlign: 'center', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{p.names[i % p.names.length]}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
