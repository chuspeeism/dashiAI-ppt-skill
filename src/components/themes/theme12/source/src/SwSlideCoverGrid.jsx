// SwSlideCoverGrid.jsx — "封面 · 目录 / Contents" — editorial split cover.
//
// Front-matter cover #4: a magazine cover/contents hybrid. A solid colour panel
// carries the 声浪 masthead over an oversized ghost numeral, a tagline, a
// creator-owned seal and an issue line; the facing column is a true contents
// page — numbered entries with English sub-lines and descriptions, an optional
// focus highlight, and a row of stat chips. Independent + props-only: panel
// theme, item count, focus + focusIndex, stat chips, seal and accent map 1:1
// with `controls`; all visible copy/data defaults live in `defaultProps`.
// CSS namespaced `sw-`, no deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'coverGrid', index: 4, label: '封面 · 目录 / Contents' };

export const defaultProps = {
  accent: C.purple,
  theme: 'accent',       // 'accent' | 'dark'
  itemCount: 4,          // 3–5 contents entries
  focus: false,
  focusIndex: 1,
  showStats: true,
  statCount: 3,
  showSeal: true,
  showGhost: true,
  colorfulRows: true,
  // —— content ——
  brand: '声浪 SOUNDWAVE',
  panelKicker: 'Independent Music OS',
  titleCn: '声浪',
  titleEn: 'SOUNDWAVE',
  tagline: '为独立音乐人而造的\n发行与变现操作系统。',
  ghostText: '01',
  issueLine: 'VOL. 01\n夏 / Summer 2026',
  seal: { top: '★ EST. 2026 ★', name: '声浪', sub: 'CREATOR-OWNED' },
  contentsTitle: '目录',
  contentsMeta: 'Contents · 本期共 86 页',
  contents: [
    { n: '01', t: '宣言', e: 'Manifesto', d: '主权，为何比流量更重要', pg: '05' },
    { n: '02', t: '产品矩阵', e: 'The Stack', d: '发行 · 直连 · 结算 · 护盾', pg: '09' },
    { n: '03', t: '为什么是现在', e: 'Why Now', d: '独立发行的拐点已到来', pg: '24' },
    { n: '04', t: '加入声浪', e: 'Join Us', d: '轮到你，发出声浪', pg: '78' },
    { n: '05', t: '路线图', e: 'Roadmap', d: '接下来的四个季度', pg: '52' },
  ],
  chips: [
    { v: '30+', lb: '分发平台' },
    { v: '72h', lb: '版税到账' },
    { v: '0%', lb: '首季分成' },
  ],
  page: '04',
  total: '86',
};

export const controls = [
  { key: 'theme', label: '面板配色', type: 'segment', def: 'accent',
    options: [{ value: 'accent', label: '强调' }, { value: 'dark', label: '深色' }], desc: '左侧面板底色' },
  { key: 'itemCount', label: '目录条目', type: 'slider', def: 4, min: 3, max: 5, step: 1, desc: '右栏目录条目数' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false, desc: '高亮某一目录条目，弱化其余' },
  { key: 'focusIndex', label: '强调第几个', type: 'slider', def: 1, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '被强调条目的序号（1 起）' },
  { key: 'showStats', label: '数据标签', type: 'toggle', def: true, desc: '显示/隐藏底部数据标签' },
  { key: 'statCount', label: '标签数量', type: 'slider', def: 3, min: 0, max: 3, step: 1,
    dependsOn: 'showStats', desc: '数据标签的数量' },
  { key: 'showSeal', label: '创作者印章', type: 'toggle', def: true, desc: '显示/隐藏 CREATOR-OWNED 圆章' },
  { key: 'showGhost', label: '巨型刊号', type: 'toggle', def: true, desc: '显示/隐藏面板内出血的巨型刊号' },
  { key: 'colorfulRows', label: '彩色目录', type: 'toggle', def: true, desc: '每条目录使用不同的品牌色编号' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '面板 / 编号 / 高亮强调色' },
];

const CONTENTS_REMOVED = true;
// Brand palette so the contents page reads as a colourful cover, not one accent.
const ITEM_COLORS = [C.orange, C.cyan, C.lime, C.magenta, C.green];
const CHIP_COLORS = [C.orange, C.cyan, C.lime];

function Seal({ accent, fg, seal }) {
  return (
    <div style={{ width: 122, height: 122, borderRadius: '50%', border: '2px solid ' + fg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(-9deg)', position: 'relative', flexShrink: 0 }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px dashed ' + fg, opacity: 0.55 }} />
      <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '.2em', color: fg, opacity: 0.85 }}>{seal.top}</div>
      <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '1px', color: fg, margin: '2px 0' }}>{seal.name}</div>
      <div style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: '.16em', color: fg, opacity: 0.7 }}>{seal.sub}</div>
    </div>
  );
}

export default function SwSlideCoverGrid(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const panelBg = dark ? C.dark : accent;
  const panelFg = '#fff';
  const panelMut = dark ? 'rgba(245,225,227,.64)' : 'rgba(255,255,255,.74)';
  const items = (p.contents || []).slice(0, Math.max(3, Math.min(5, p.itemCount)));
  const chips = (p.chips || []).slice(0, Math.max(0, Math.min(3, p.statCount)));

  return (
    <SlideRoot bg={C.blush} color={C.ink} style={{ padding: 0, flexDirection: 'row' }}>
      {/* left panel */}
      <div style={{ width: '43%', flexShrink: 0, background: panelBg, color: panelFg,
        padding: '54px 58px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden' }}>
        {p.showGhost && (
          <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', right: -40, bottom: -120,
            fontFamily: F.mono, fontWeight: 700, fontSize: 460, lineHeight: 0.8, zIndex: 0, pointerEvents: 'none',
            color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,.12)' }}>{p.ghostText}</div>
        )}
        <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Shape kind="ring" size={92} border={15} color={C.cyan} style={{ top: 210, right: 36 }} />
          <Shape kind="pentagon" size={76} color={C.lime} style={{ bottom: 250, right: 70 }} />
          <Shape kind="teardrop" size={58} color={C.orange} style={{ top: 360, right: 150 }} />
          <Shape kind="circle" size={40} color="rgba(255,255,255,.22)" style={{ top: 470, right: 250 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 13, position: 'relative', zIndex: 1 }}>
          <span style={{ width: 16, height: 16, background: dark ? accent : '#fff', borderRadius: 4 }} />
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.2em' }}>{p.brand}</span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, letterSpacing: '.22em',
            textTransform: 'uppercase', color: dark ? accent : 'rgba(255,255,255,.88)' }}>{p.panelKicker}</div>
          <h1 style={{ fontWeight: 900, fontSize: 156, lineHeight: 0.86, letterSpacing: '-2px', margin: '14px 0 0' }}>{p.titleCn}</h1>
          <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 40, letterSpacing: '.16em', marginTop: 10, paddingLeft: '.16em' }}>{p.titleEn}</div>
          <p style={{ fontSize: 27, lineHeight: 1.55, color: panelMut, marginTop: 24, maxWidth: 540 }}>
            {renderSwText(p.tagline)}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: '.14em', textTransform: 'uppercase', color: panelMut }}>
            {renderSwText(p.issueLine)}
          </div>
          {p.showSeal && <Seal accent={accent} fg={panelFg} seal={p.seal} />}
        </div>
      </div>

      {/* right contents column */}
      <div style={{ flex: 1, minWidth: 0, padding: '54px 64px 48px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          borderBottom: '2px solid ' + C.ink, paddingBottom: 18 }}>
          <span style={{ fontWeight: 900, fontSize: 50, letterSpacing: '-1px' }}>{p.contentsTitle}</span>
          <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.16em', textTransform: 'uppercase', color: C.inkMut }}>{p.contentsMeta}</span>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {items.map((it, i) => {
            const dim = p.focus && (i + 1) !== p.focusIndex;
            const hot = p.focus && (i + 1) === p.focusIndex;
            const col = p.colorfulRows ? ITEM_COLORS[i % ITEM_COLORS.length] : accent;
            return (
              <div key={it.n} style={{ display: 'flex', alignItems: 'baseline', gap: 22, padding: '18px 0',
                borderBottom: '1px solid ' + C.line, opacity: dim ? 0.32 : 1, transition: 'opacity .2s' }}>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: '#fff', background: col,
                  borderRadius: 8, padding: '5px 11px', flexShrink: 0, alignSelf: 'flex-start', marginTop: 4 }}>{it.n}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                    <span style={{ fontWeight: 900, fontSize: 40, letterSpacing: '-.5px', color: C.ink }}>
                      {hot ? <Hl tone="o" style={{ background: col, color: '#fff' }}>{it.t}</Hl> : it.t}
                    </span>
                    <span style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: '.1em', textTransform: 'uppercase', color: col }}>{it.e}</span>
                  </div>
                  <div style={{ fontSize: 22, color: '#5a4f54', marginTop: 5 }}>{it.d}</div>
                </div>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.ink, flexShrink: 0 }}>{it.pg}</span>
              </div>
            );
          })}
        </div>

        {p.showStats && chips.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {chips.map((c, i) => (
              <div key={c.lb} style={{ flex: 1, padding: '18px 22px 20px', borderRadius: 14, background: C.paper,
                borderTop: '4px solid ' + CHIP_COLORS[i % CHIP_COLORS.length], boxShadow: '0 8px 24px rgba(27,21,24,.06)' }}>
                <div style={{ fontWeight: 900, fontSize: 46, letterSpacing: '-1px', color: CHIP_COLORS[i % CHIP_COLORS.length] }}>{c.v}</div>
                <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: '.1em', textTransform: 'uppercase', color: C.inkMut, marginTop: 4 }}>{c.lb}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideRoot>
  );
}
