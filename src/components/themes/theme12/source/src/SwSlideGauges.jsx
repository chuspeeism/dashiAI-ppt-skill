// SwSlideGauges.jsx — "仪表盘 / Gauges" radial-progress chart page.
//
// A row of donut gauges, each a coloured arc over a track with a big centre
// percentage and a label. Distinct from Donut (one composition pie), bars, line,
// funnel and matrix. Gauge count (2–4), track ring, centre caption, lede and
// accent are props-controlled, 1:1 with controls; all visible copy/data
// defaults live in `defaultProps`. No global side effects, no
// host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'gauges', index: 52, label: '仪表盘 / Gauges' };

export const defaultProps = {
  accent: C.orange,
  gaugeCount: 3,           // 2–4 gauges
  showTrack: true,
  showLede: true,
  theme: 'light',          // 'light' | 'dark'
  // —— content ——
  barMeta: '52 — Gauges',
  kicker: '健康度 / Health',
  title: '几个我们[[最在意]]的数。',
  lede: '不是越大越好，而是越透明越好——这些环，量的是创作者对平台的信任。',
  gauges: [
    { pct: 94, cn: '版税透明度', en: 'Transparency', note: '每一分都可追溯' },
    { pct: 88, cn: '创作者留存', en: 'Retention', note: '年度续约率' },
    { pct: 72, cn: '收入来自直连', en: 'Direct income', note: '非平台抽成部分' },
    { pct: 65, cn: '海外结算占比', en: 'Global payout', note: '多币种实时' },
  ],
  page: '52',
  total: '82',
};

export const controls = [
  { key: 'gaugeCount', label: '仪表数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '环形仪表的数量' },
  { key: 'showTrack', label: '底环轨道', type: 'toggle', def: true, desc: '显示/隐藏环形底色轨道' },
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }], desc: '页面整体明暗配色' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题区导语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '首个仪表 / 高亮 / 页脚强调色' },
];

function Gauge({ pct, color, track, trackColor, label, en, note, big, sub, cardBg, cardBorder }) {
  const r = 82, cx = 100, cy = 100, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const ang = (pct / 100) * 2 * Math.PI;            // clockwise from 3 o'clock (svg is rotated -90°)
  const ex = cx + r * Math.cos(ang), ey = cy + r * Math.sin(ang);
  return (
    <div style={{ background: cardBg, border: '1px solid ' + cardBorder, borderRadius: 26,
      padding: '36px 26px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minWidth: 0, boxShadow: '0 1px 0 rgba(0,0,0,.02)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 224 }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: 'auto', display: 'block', transform: 'rotate(-90deg)' }}>
          {track && <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="13" />}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"
            strokeDasharray={dash + ' ' + (circ - dash)} />
          {pct > 0 && pct < 100 && (
            <>
              <circle cx={ex} cy={ey} r={11} fill={cardBg} />
              <circle cx={ex} cy={ey} r={6.5} fill={color} />
            </>
          )}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 62, letterSpacing: '-2.5px', color: big, lineHeight: 1,
            fontVariantNumeric: 'tabular-nums' }}>
            {pct}<span style={{ fontSize: 28, fontWeight: 700, color: color, marginLeft: 1 }}>%</span></div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 22 }}>
        <div style={{ fontWeight: 900, fontSize: 29, letterSpacing: '-.4px', color: big }}>{label}</div>
        <div style={{ fontFamily: F.mono, fontSize: 18, letterSpacing: '.14em', textTransform: 'uppercase',
          color: sub, marginTop: 6 }}>{en}</div>
        <div style={{ width: 34, height: 3, borderRadius: 2, background: color, margin: '16px auto 14px' }} />
        <div style={{ fontSize: 21, color: sub }}>{note}</div>
      </div>
    </div>
  );
}

export default function SwSlideGauges(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(2, Math.min(4, p.gaugeCount));
  const gauges = (p.gauges || []).slice(0, count);
  const colors = [accent, C.cyan, C.purple, C.green];

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const sub = dark ? '#9a8f8c' : C.inkMut;
  const trackColor = dark ? 'rgba(255,255,255,.08)' : 'rgba(27,21,24,.07)';
  const cardBg = dark ? '#241e20' : '#ffffff';
  const cardBorder = dark ? C.lineD : C.line;

  return (
    <SlideRoot bg={bg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3 }}>
        {p.showLede && (
          <div style={{ flexShrink: 0, margin: '22px 0 10px', display: 'flex', alignItems: 'flex-end',
            justifyContent: 'space-between', gap: 40 }}>
            <div>
              <Kicker accent={accent}>{p.kicker}</Kicker>
              <h2 style={{ fontWeight: 900, fontSize: 52, lineHeight: 1.04, letterSpacing: '-1.4px', marginTop: 14 }}>
                {renderSwText(p.title, { hl: { tone: 'o' } })}
              </h2>
            </div>
            <p style={{ fontSize: 24, lineHeight: 1.6, color: sub, maxWidth: 420, paddingBottom: 6 }}>
              {p.lede}
            </p>
          </div>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 26, alignItems: 'stretch',
          gridTemplateColumns: 'repeat(' + count + ',1fr)', paddingTop: 8 }}>
          {gauges.map((g, i) => (
            <Gauge key={g.en} pct={g.pct} color={colors[i % colors.length]} track={p.showTrack}
              trackColor={trackColor} label={g.cn} en={g.en} note={g.note} big={fg} sub={sub}
              cardBg={cardBg} cardBorder={cardBorder} />
          ))}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
