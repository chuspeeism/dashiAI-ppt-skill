/**
 * SlideVersus.jsx — 多空对照（对照页 · 双栏正反）.
 * Independent, prop-driven. Renders its own theme styles.
 *
 * 左右双栏的正反/多空对照：每栏一个标签、一个关键数字与若干论点，中央以
 * 发光 VS 分隔。可强调某一栏（另一栏自动暗淡），栏内论点数量可调。仅依赖 props。
 *
 * ── Props (see slideVersusDefaults) ─────────────────────────────────────────
 *   kicker, title, titleEm           strings
 *   leftTag, rightTag                strings   栏标签（如 看多 / 看空）
 *   leftPoints, rightPoints          string[]  各栏论点
 *   pointCount   number   每栏展示的论点数（2–n，取两栏较短长度上限）
 *   leftStat, rightStat  {value,unit,caption}   各栏关键数字
 *   showStat     boolean  关键数字显隐
 *   showVs       boolean  中央 VS 徽标显隐
 *   focusSide    'none' | 'left' | 'right'      辉光强调某一栏
 *   gxnScheme    object?  { accent, glow, palette } 调色（缺省走主题绿）
 */
import React from 'react';
import { ThemeStyle, THEME_CLASS, cx } from '../gxnTheme.js';
import { SlideHeader } from '../gxnPrimitives.jsx';

export const slideVersusDefaults = {
  kicker: 'BULL vs BEAR · 多空对照',
  title: '同一张资本牌桌上的 ',
  titleEm: '两种声音',
  leftTag: '看多 · 顺风',
  rightTag: '看空 · 逆风',
  leftPoints: [
    '算力与模型能力仍在快速攀升，头部公司护城河持续加宽',
    '企业级 AI 落地加速，付费意愿与续费率双双走高',
    '一级市场资金充裕，超大额融资为头部续航',
  ],
  rightPoints: [
    '估值透支未来数年增长，回报周期被显著拉长',
    '算力成本与能耗高企，单位经济模型尚未跑通',
    '资本高度集中于少数玩家，长尾公司融资骤冷',
  ],
  pointCount: 3,
  leftStat: { value: '63.9', unit: '%', caption: '资金流向头部湾区' },
  rightStat: { value: '≈10', unit: '亿/笔', caption: '平均单笔估值门槛' },
  showStat: true,
  showVs: true,
  focusSide: 'none',
};

export const slideVersusControls = [
  { key: 'pointCount', type: 'number', label: '每栏论点数', default: 3, min: 2, step: 1,
    maxFrom: (p) => Math.min(
      p.leftPoints ? p.leftPoints.length : 3,
      p.rightPoints ? p.rightPoints.length : 3),
    describe: '每栏展示的论点条数' },
  { key: 'showStat', type: 'toggle', label: '关键数字', default: true,
    describe: '每栏顶部关键数字显隐' },
  { key: 'showVs', type: 'toggle', label: '中央 VS', default: true,
    describe: '中央 VS 徽标显隐' },
  { key: 'focusSide', type: 'enum', label: '重点强调', default: 'none',
    options: [
      { value: 'none', label: '不强调' },
      { value: 'left', label: '强调左栏' },
      { value: 'right', label: '强调右栏' },
    ],
    describe: '辉光强调某一栏，另一栏自动暗淡' },
];

function Side({ tag, points, stat, showStat, color, glow, focus, dim, align, marker }) {
  return (
    <div className={cx('gxn-panel', focus && 'is-focus')}
         style={{ position: 'relative', overflow: 'hidden', padding: '46px 50px',
                  display: 'flex', flexDirection: 'column', gap: 28,
                  opacity: dim ? 0.46 : 1, filter: dim ? 'saturate(.7)' : 'none',
                  transition: 'opacity .3s ease, filter .3s ease',
                  alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <span className="gxn-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 10,
        fontSize: 25, letterSpacing: '.12em', padding: '9px 20px',
        borderRadius: 999, color, border: `1px solid ${color}`, background: 'rgba(255,255,255,0.03)',
        boxShadow: `0 0 24px -8px ${color}` }}>
        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, opacity: 0.92 }}>{marker}</span>
        {tag}
      </span>

      {showStat && stat && (
        <div className="gxn-num" style={{ fontSize: 92, fontWeight: 600, lineHeight: 0.95,
          letterSpacing: '-0.02em', color, textShadow: `0 0 40px ${rgba(glow, 0.45)}`,
          textAlign: align === 'right' ? 'right' : 'left' }}>
          {stat.value}
          {stat.unit && <span style={{ fontSize: '0.32em', marginLeft: 10, color: 'var(--gxn-dim)', fontWeight: 500 }}>{stat.unit}</span>}
          {stat.caption && (
            <div className="gxn-mono" style={{ fontSize: 23, marginTop: 8, color: 'var(--gxn-faint)',
              fontWeight: 400, letterSpacing: '.02em' }}>{stat.caption}</div>
          )}
        </div>
      )}

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 20,
        width: '100%' }}>
        {points.map((pt, i) => (
          <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start',
            flexDirection: align === 'right' ? 'row-reverse' : 'row', textAlign: align === 'right' ? 'right' : 'left' }}>
            <span aria-hidden="true" style={{ flex: '0 0 auto', marginTop: 13, width: 10, height: 10, borderRadius: 3,
              background: color, boxShadow: `0 0 12px ${color}` }} />
            <span style={{ fontSize: 27, lineHeight: 1.46, color: 'var(--gxn-text)' }}>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function rgba(glow, a) { return `rgba(${glow},${a})`; }

export function SlideVersus(props) {
  const p = { ...slideVersusDefaults, ...props };
  const sc = p.gxnScheme || {};
  const accent = sc.accent || '#2fe07f';
  const glow = sc.glow || '47,224,127';
  const palette = sc.palette || [];
  // contrast colour for the "bear" side — second palette hue (or a warm pink)
  const counter = palette[3] || palette[5] || '#ff6fae';
  const counterGlow = hexToGlow(counter);

  const max = Math.min(p.leftPoints.length, p.rightPoints.length);
  const n = Math.max(2, Math.min(max, p.pointCount));
  const left = p.leftPoints.slice(0, n);
  const right = p.rightPoints.slice(0, n);
  const fs = p.focusSide;

  return (
    <div className={cx(THEME_CLASS, 'gxn-slide')}>
      <ThemeStyle />
      <div className="gxn-pad">
        <SlideHeader kicker={p.kicker} title={p.title} titleEm={p.titleEm} index={p.index || "39 / 39"} />

        <div className="gxn-rise-2" style={{ flex: 1, marginTop: 40, minHeight: 0, position: 'relative',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 92, alignItems: 'stretch' }}>
          <Side tag={p.leftTag} points={left} stat={p.leftStat} showStat={p.showStat}
                color={accent} glow={glow} align="left" marker="▲"
                focus={fs === 'left'} dim={fs === 'right'} />
          <Side tag={p.rightTag} points={right} stat={p.rightStat} showStat={p.showStat}
                color={counter} glow={counterGlow} align="right" marker="▼"
                focus={fs === 'right'} dim={fs === 'left'} />

          {p.showVs && (
            <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)', zIndex: 4,
              width: 96, height: 96, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'radial-gradient(circle at 50% 40%, #11151b, #06080a)',
              border: '1px solid var(--gxn-line)',
              boxShadow: '0 0 0 8px rgba(7,9,11,0.9), inset 0 0 28px -6px rgba(255,255,255,0.18), 0 24px 50px -24px rgba(0,0,0,0.9)' }}>
              <span style={{ fontFamily: 'var(--gxn-font-display)', fontWeight: 700, fontSize: 38,
                letterSpacing: '.04em', color: '#f4f7fb',
                textShadow: `0 0 14px ${rgba(glow, 0.55)}, 0 0 22px ${rgba(counterGlow, 0.4)}` }}>VS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* derive an "r,g,b" glow string from a #rrggbb hue (for text-shadow alpha). */
function hexToGlow(hex) {
  const h = (hex || '').replace('#', '');
  if (h.length !== 6) return '255,111,174';
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

export default SlideVersus;
