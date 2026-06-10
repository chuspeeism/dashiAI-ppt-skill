// SwSlideBigNumber.jsx — single hero metric "大数字" page.
//
// One dominant figure carries the slide. Theme (light/dark), an optional small
// bar-trend chart, and a row of 0–3 supporting stats are all props-controlled;
// all visible copy/data defaults live in `defaultProps`.
// No global side effects, no host dependency.

import React from 'react';
import { swTheme, swSeriesColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Shape } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'bignumber', index: 58, label: '大数字 / By the Numbers' };

export const defaultProps = {
  accent: C.cyan,
  theme: 'dark',           // 'light' | 'dark'
  showTrend: true,         // small bar-trend chart beside the figure
  showSupporting: true,
  supportingCount: 3,      // 0–3 supporting stats
  showDecorations: true,
  // —— content ——
  barMeta: '58 — By the Numbers',
  kicker: '截至 2026 / To Date',
  prefix: '¥',
  figure: '2.4',
  suffix: '亿+',
  caption: '已发放给独立音乐人的版税总额',
  captionEn: 'Total royalties paid out to independent artists',
  trend: [0.32, 0.46, 0.41, 0.62, 0.78, 1],
  supporting: [
    { v: '12k+', lb: 'Artists', ds: '入驻音乐人与厂牌' },
    { v: '30+', lb: 'Platforms', ds: '同步分发平台' },
    { v: '72h', lb: 'Payout', ds: '版税平均到账' },
  ],
  page: '58',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'dark',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }],
    desc: '页面整体明暗配色' },
  { key: 'showTrend', label: '趋势图', type: 'toggle', def: true, desc: '显示/隐藏主数字旁的小条形趋势' },
  { key: 'showSupporting', label: '辅助指标', type: 'toggle', def: true, desc: '显示/隐藏底部辅助数据行' },
  { key: 'supportingCount', label: '辅助数量', type: 'slider', def: 3, min: 0, max: 3, step: 1,
    dependsOn: 'showSupporting', desc: '底部辅助指标的数量' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.cyan,
    options: [C.cyan, C.orange, C.purple, C.green], desc: '主数字 / 导语 / 页脚强调色' },
];

export default function SwSlideBigNumber(props) {
  const p = { ...defaultProps, ...props };
  const dark = p.theme === 'dark';
  const accent = p.accent;
  const sc = Math.max(0, Math.min(3, p.supportingCount));
  const TREND = p.trend;

  const bg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;
  const trackBg = dark ? 'rgba(245,225,227,.12)' : 'rgba(27,21,24,.10)';
  const support = (p.supporting || []).slice(0, sc);

  return (
    <SlideRoot bg={bg} color={fg}>
      {p.showDecorations && (
        <>
          <Shape kind="circle" size={70} color={dark ? C.magenta : C.cyan} style={{ top: 150, right: 150 }} />
          <Shape kind="ring" size={92} border={15} color={accent} style={{ top: 128, right: 268 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', zIndex: 3 }}>

        <Kicker accent={accent}>{p.kicker}</Kicker>

        <div style={{ display: 'flex', alignItems: 'center', gap: 56, marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
            <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 80, color: accent,
              marginTop: 36, marginRight: 8 }}>{p.prefix}</span>
            <span style={{ fontWeight: 900, fontSize: 320, lineHeight: 0.82, letterSpacing: '-8px',
              color: accent }}>{p.figure}</span>
            <span style={{ fontWeight: 900, fontSize: 120, letterSpacing: '-2px', alignSelf: 'flex-end',
              marginBottom: 24, marginLeft: 4, whiteSpace: 'nowrap' }}>{p.suffix}</span>
          </div>

          {p.showTrend && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, height: 200, marginBottom: 30 }}>
              {TREND.map((h, i) => (
                <i key={i} style={{ width: 22, height: Math.max(14, h * 200) + 'px', display: 'block',
                  borderRadius: 6, background: i === TREND.length - 1 ? accent : trackBg }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.3px', marginTop: 22 }}>
          {p.caption}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.12em', textTransform: 'uppercase',
          color: mut, marginTop: 8 }}>{p.captionEn}</div>

        {p.showSupporting && sc > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + sc + ',auto)', gap: 64,
            borderTop: '1px solid ' + (dark ? C.lineD2 : C.line2), marginTop: 44, paddingTop: 30 }}>
            {support.map((s, i) => (
              <div key={s.lb}>
                <div style={{ fontWeight: 900, fontSize: 58, letterSpacing: '-1.5px',
                  color: swSeriesColors[(i + 1) % swSeriesColors.length] }}>{s.v}</div>
                <div style={{ fontFamily: F.mono, fontSize: 23, letterSpacing: '.12em', textTransform: 'uppercase',
                  color: mut, marginTop: 6 }}>{s.lb}</div>
                <div style={{ fontSize: 23, color: dark ? '#c8c0bd' : '#5a4f54', marginTop: 6 }}>{s.ds}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
