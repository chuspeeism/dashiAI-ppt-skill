// SwSlideCoverType.jsx — "封面 · 字体 / Masthead" — premiere-issue type cover.
//
// Front-matter cover #1, built as a real magazine front: a Bar/Footer chrome
// frame, a giant 声浪 masthead with an oversized ghost numeral bleeding behind
// it, a stack of cover-line teasers down the facing column, a creator-owned
// seal and an issue barcode. Independent + props-only: all visible copy/data
// defaults live in `defaultProps`; layout/visibility props map 1:1 with
// `controls`. CSS namespaced `sw-`, no global side effects, no host deps.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'coverType', index: 1, label: '封面 · 字体 / Masthead' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',        // 'light' | 'dark'
  showCoverLines: true,
  lineCount: 3,          // 1–3 cover-line teasers
  showSeal: true,
  showGhost: true,
  showBarcode: true,
  showShapes: true,
  // —— content（可见文案/数据默认值；[[x]] = 笔刷高亮，**x** = 强调，\n = 换行）——
  barMeta: '创刊号 / Premiere Issue · Vol. 01',
  kicker: 'The Sound of Sovereignty',
  title: '声[[浪]]',
  titleEn: 'SOUNDWAVE',
  tagline: '为独立音乐人而造的发行与变现操作系统——**声音的主权，归于创作者。**',
  ghostText: '01',
  linesTitle: '本期 / In This Issue',
  lines: [
    { n: '01', big: '独立厂牌', sub: '一个人，撑起一座厂牌的 12 种方式' },
    { n: '02', big: '版税透明', sub: '每一分钱，看得见来处' },
    { n: '03', big: '现场复兴', sub: '小场地里，正在发生的大事' },
  ],
  seal: { top: '★ EST. 2026 ★', name: '声浪', sub: 'CREATOR-OWNED' },
  barcodeLabel: 'SW 01 · 2026',
  page: '01',
  total: '86',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '整版底色：腮红浅底 / 深色板' },
  { key: 'showCoverLines', label: '封面导语', type: 'toggle', def: true, desc: '显示/隐藏右栏封面导语' },
  { key: 'lineCount', label: '导语条数', type: 'slider', def: 3, min: 1, max: 3, step: 1,
    dependsOn: 'showCoverLines', desc: '封面导语条目数量' },
  { key: 'showSeal', label: '创作者印章', type: 'toggle', def: true, desc: '显示/隐藏 CREATOR-OWNED 圆章' },
  { key: 'showGhost', label: '巨型刊号', type: 'toggle', def: true, desc: '显示/隐藏出血的巨型刊号数字' },
  { key: 'showBarcode', label: '刊号条码', type: 'toggle', def: true, desc: '显示/隐藏角落刊号条码' },
  { key: 'showShapes', label: '几何装饰', type: 'toggle', def: true, desc: '显示/隐藏漂浮几何装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.magenta, C.cyan, C.green], desc: '主字高亮 / 编号 / 印章强调色' },
];

function Barcode({ dark, label }) {
  const ws = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2];
  return (
    <div style={{ background: '#fff', padding: '9px 11px 5px', borderRadius: 4, display: 'inline-block',
      boxShadow: dark ? '0 6px 20px rgba(0,0,0,.4)' : '0 6px 18px rgba(27,21,24,.12)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 36 }} aria-hidden="true">
        {ws.map((w, i) => <span key={i} style={{ width: w, height: '100%', background: '#0c0809' }} />)}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 12, letterSpacing: '.16em', color: '#0c0809',
        marginTop: 4, textAlign: 'center' }}>{label}</div>
    </div>
  );
}

function Seal({ accent, fg, seal }) {
  return (
    <div style={{ width: 132, height: 132, borderRadius: '50%', border: '2px solid ' + accent,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: 'rotate(-9deg)', position: 'relative', flexShrink: 0,
      background: 'rgba(255,255,255,.02)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 9, borderRadius: '50%',
        border: '1px dashed ' + accent, opacity: 0.5 }} />
      <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '.22em', color: accent }}>{seal.top}</div>
      <div style={{ fontWeight: 900, fontSize: 27, letterSpacing: '1px', color: fg, margin: '5px 0' }}>{seal.name}</div>
      <div style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '.18em', color: fg, opacity: 0.62 }}>{seal.sub}</div>
    </div>
  );
}

export default function SwSlideCoverType(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? 'rgba(245,225,227,.62)' : C.inkMut;
  const subC = dark ? '#c8c0bd' : '#5a4f54';
  const line = dark ? C.lineD : C.line;
  const lines = (p.lines || []).slice(0, Math.max(1, Math.min(p.lines.length, p.lineCount)));

  return (
    <SlideRoot bg={bg} color={fg}>
      {/* textured layout-grid backdrop */}
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, ' + (dark ? 'rgba(245,225,227,.035)' : 'rgba(27,21,24,.028)')
          + ' 0 1px, transparent 1px 38px)' }} />

      {p.showShapes && (
        <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Shape kind="pentagon" size={120} color={C.green} style={{ top: 150, left: 96 }} />
          <Shape kind="ring" size={92} border={16} color={C.cyan} style={{ bottom: 180, left: 250 }} />
          <Shape kind="circle" size={58} color={C.magenta} style={{ top: 360, left: 38 }} />
        </div>
      )}

      {p.showGhost && (
        <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', left: '41%', bottom: -150,
          fontFamily: F.mono, fontWeight: 700, fontSize: 430, lineHeight: 0.8, zIndex: 0, pointerEvents: 'none',
          color: 'transparent', WebkitTextStroke: '2px ' + (dark ? 'rgba(245,225,227,.07)' : accent + '1f') }}>{p.ghostText}</div>
      )}

      {/* issue barcode — floats clear above the footer */}
      {p.showBarcode && (
        <div data-sw-no-reveal="" style={{ position: 'absolute', right: 96, bottom: 128, zIndex: 3 }}><Barcode dark={dark} label={p.barcodeLabel} /></div>
      )}

      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      {/* main */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.42fr 1fr',
        gap: 56, alignItems: 'center', padding: '14px 0', position: 'relative', zIndex: 3 }}>

        {/* masthead */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: F.mono, fontSize: 25,
            fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: accent }}>
            <span style={{ width: 46, height: 3, background: accent, borderRadius: 2 }} />{p.kicker}
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 232, lineHeight: 0.88, letterSpacing: '-4px', margin: '16px 0 0', color: fg }}>
            {renderSwText(p.title, { hl: { tone: 'o', block: true, style: { background: accent, color: dark ? C.dark : '#fff' } } })}
          </h1>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, gap: 24 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 54, letterSpacing: '.16em', color: fg,
                paddingLeft: '.16em' }}>{p.titleEn}</div>
              <p style={{ fontSize: 28, lineHeight: 1.55, color: subC, marginTop: 20, maxWidth: 620 }}>
                {renderSwText(p.tagline, { strong: { color: fg } })}
              </p>
            </div>
            {p.showSeal && <Seal accent={accent} fg={fg} seal={p.seal} />}
          </div>
        </div>

        {/* cover lines */}
        {p.showCoverLines && (
          <div style={{ position: 'relative', paddingLeft: 38, borderLeft: '2px solid ' + line }}>
            <div style={{ fontFamily: F.mono, fontSize: 24, fontWeight: 700, letterSpacing: '.2em',
              textTransform: 'uppercase', color: mut, marginBottom: 8 }}>{p.linesTitle}</div>
            {lines.map((l, i) => (
              <div key={l.n} style={{ padding: '24px 0', borderBottom: i === lines.length - 1 ? 'none' : '1px solid ' + line }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: accent }}>{l.n}</span>
                  <span style={{ fontWeight: 900, fontSize: 46, letterSpacing: '-1px', color: fg }}>{l.big}</span>
                </div>
                <div style={{ fontSize: 24, lineHeight: 1.45, color: subC, marginTop: 8 }}>{l.sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
      </div>
    </SlideRoot>
  );
}
