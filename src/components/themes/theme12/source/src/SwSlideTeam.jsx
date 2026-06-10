// SwSlideTeam.jsx — "团队群像 / Team" portrait-card grid.
//
// A grid of member cards, each a portrait image slot above a name + role, with a
// coloured accent strip per card. Distinct from Testimonial (one portrait +
// quote), Duo (diptych) and GridWall (photo wall). Member count (3–6), columns
// (3|4|6 derived), roles, mediaFit, accent and theme are props-controlled, 1:1
// with controls; all visible copy/data defaults live in `defaultProps`. Image
// slots are fully controlled (media + onMediaChange). No
// global side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'team', index: 79, label: '团队群像 / Team' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  memberCount: 4,          // 3–6 members
  showRole: true,
  showLede: true,
  mediaFit: 'cover',
  media: [],
  onMediaChange: () => {},
  // —— content ——
  barMeta: '79 — Team',
  kicker: '团队 / The Crew',
  title: '一群[[做音乐的人]]，在做工具。',
  lede: '我们自己也是创作者——所以更懂，把主权还给做音乐的人有多重要。',
  mediaPlaceholder: '拖入头像',
  members: [
    { cn: '林知夏', en: 'Zhixia Lin', role: '创始人 · CEO' },
    { cn: '陈屿', en: 'Yu Chen', role: '产品负责人 · CPO' },
    { cn: '苏野', en: 'Ye Su', role: '版权与结算 · COO' },
    { cn: '何川', en: 'Chuan He', role: '技术负责人 · CTO' },
    { cn: '罗念', en: 'Nian Luo', role: '创作者增长' },
    { cn: '周屿森', en: 'Yusen Zhou', role: '设计负责人' },
  ],
  page: '79',
  total: '82',
};

export const controls = [
  { key: 'memberCount', label: '成员数量', type: 'slider', def: 4, min: 3, max: 6, step: 1,
    desc: '团队成员卡片的数量' },
  { key: 'showRole', label: '职位', type: 'toggle', def: true, desc: '显示/隐藏成员职位' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }], desc: '头像填充方式' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '色条 / 高亮 / 页脚强调色' },
];

export default function SwSlideTeam(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(3, Math.min(6, p.memberCount));
  const cols = count <= 3 ? count : count === 4 ? 4 : count <= 6 ? 3 : 4;
  const members = (p.members || []).slice(0, count);

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const cardBg = dark ? '#241e20' : '#ffffff';
  const roleC = dark ? '#9a8f8c' : C.inkMut;

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 22px', display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 40 }}>
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.04, letterSpacing: '-1.5px', marginTop: 14 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.6, color: roleC, maxWidth: 400, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 20,
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr' }}>
          {members.map((m, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            return (
              <div key={m.en} style={{ position: 'relative', overflow: 'hidden', borderRadius: 22,
                background: cardBg, border: '1px solid ' + (dark ? C.lineD : C.line),
                display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
                <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: pal.bg, zIndex: 2 }} />
                <div style={{ flex: 1, minHeight: 0, padding: 14, paddingTop: 16 }}>
                  <div style={{ width: '100%', height: '100%' }}>
                    <SwImageSlot value={p.media[i] || null} onChange={(s) => p.onMediaChange(i, s)}
                      fit={p.mediaFit} accent={pal.bg} radius={14} tone={dark ? 'dark' : 'light'}
                      placeholder={p.mediaPlaceholder} />
                  </div>
                </div>
                <div style={{ flexShrink: 0, padding: '0 20px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-.4px', color: fg }}>{m.cn}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.06em', color: roleC }}>{m.en}</span>
                  </div>
                  {p.showRole && (
                    <div style={{ fontSize: 21, color: pal.bg === '#fdddc6' ? C.rust : pal.bg,
                      fontWeight: 700, marginTop: 5 }}>{m.role}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Footer page={p.page} total={p.total} accent={accent} dark={dark} divider={false} />
      </div>
    </SlideRoot>
  );
}
