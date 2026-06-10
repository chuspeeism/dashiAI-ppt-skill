// SwSlideCoverWave.jsx — "封面 · 声波 / Spectrum" — dark broadcast cover.
//
// Front-matter cover #2: a dark "now broadcasting" field. A LIVE badge + headline
// sit over a full-bleed spectrum analyser — gradient bars with a mirrored
// reflection, a baseline axis with frequency ticks and a sweeping playhead — all
// inside Bar/Footer chrome. One-shot grow-from-floor entrance (never loops).
// Independent + props-only: bar count, reflection, axis, playhead, alignment and
// accent map 1:1 with `controls`; all visible copy/data defaults live in
// `defaultProps`. CSS namespaced `sw-` via one
// idempotent <style>; no :root writes, no host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText, swDeckSection } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'coverWave', index: 2, label: '封面 · 声波 / Spectrum' };

export const defaultProps = {
  accent: C.magenta,
  align: 'left',         // 'left' | 'center'
  barCount: 34,          // 18–52 spectrum bars
  showReflection: true,
  showAxis: true,
  showPlayhead: true,
  showTagline: true,
  // —— content ——
  barMeta: '正在直播 / On Air · Vol. 01',
  badge: 'LIVE · 声浪电台',
  title: '每一道[[声浪]]，\n都被听见。',
  tagline: '发行、结算、版权与听众，收拢进同一处——为独立音乐人打造的操作系统。',
  ticks: ['20Hz', '120', '500', '1k', '4k', '12k', '20k'],
  page: '02',
  total: '86',
};

export const controls = [
  { key: 'align', label: '对齐', type: 'segment', def: 'left',
    options: [{ value: 'left', label: '居左' }, { value: 'center', label: '居中' }], desc: '标题与文案的排版对齐' },
  { key: 'barCount', label: '频谱条数', type: 'slider', def: 34, min: 18, max: 52, step: 1, desc: '频谱分析条的数量' },
  { key: 'showReflection', label: '镜面倒影', type: 'toggle', def: true, desc: '显示/隐藏频谱下方的倒影' },
  { key: 'showAxis', label: '频率刻度', type: 'toggle', def: true, desc: '显示/隐藏基线与频率刻度' },
  { key: 'showPlayhead', label: '播放游标', type: 'toggle', def: true, desc: '显示/隐藏扫过频谱的播放游标' },
  { key: 'showTagline', label: '副标语', type: 'toggle', def: true, desc: '显示/隐藏一行副标语' },
  { key: 'accent', label: '强调色', type: 'color', def: C.magenta,
    options: [C.magenta, C.orange, C.cyan, C.lime], desc: '主高亮 / 频谱主色 / 游标色' },
];

function injectWaveAnim() {
  if (typeof document === 'undefined' || document.getElementById('sw-coverwave-anim')) return;
  const s = document.createElement('style');
  s.id = 'sw-coverwave-anim';
  s.textContent =
    '.sw-cvw-bar{transform-origin:bottom;transition:transform .85s cubic-bezier(.2,.8,.2,1)}' +
    '.sw-cvw-ref{transform-origin:top;transition:transform .85s cubic-bezier(.2,.8,.2,1)}' +
    '@media (prefers-reduced-motion:no-preference){' +
    '.sw-cvw-root:not(.is-in) .sw-cvw-bar{transform:scaleY(.03)}' +
    '.sw-cvw-root:not(.is-in) .sw-cvw-ref{transform:scaleY(.03)}}';
  document.head.appendChild(s);
}

export default function SwSlideCoverWave(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const center = p.align === 'center';
  const n = Math.max(18, Math.min(52, Math.round(p.barCount)));
  const rootRef = React.useRef(null);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => { injectWaveAnim(); }, []);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setEntered(true); return; }
    const section = swDeckSection(root);
    if (!section) { const t = setTimeout(() => setEntered(true), 40); return () => clearTimeout(t); }
    const sync = () => setEntered(section.hasAttribute('data-deck-active'));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(section, { attributes: true, attributeFilter: ['data-deck-active'] });
    return () => mo.disconnect();
  }, []);

  const palette = [accent, C.cyan, C.lime, C.plum, C.orange];
  const heights = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const wave = 0.5 + 0.28 * Math.sin(t * Math.PI * 3 + 0.6) + 0.18 * Math.sin(t * Math.PI * 7 + 1.2)
      + 0.1 * Math.sin(t * Math.PI * 13 + 2.1);
    // rising envelope — low on the left (under the headline), tall on the right,
    // so neither the bars nor their reflection collide with the type.
    const env = 0.14 + 0.86 * Math.pow(t, 0.9);
    return Math.max(0.06, Math.min(1, Math.abs(wave) * env));
  });

  const barGap = Math.max(3, 10 - n / 8);
  const Bars = ({ reflect }) => (
    <div style={{ display: 'flex', alignItems: reflect ? 'flex-start' : 'flex-end', gap: barGap,
      height: reflect ? 132 : 344,
      ...(reflect ? {
        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,.6) 0%, rgba(0,0,0,.28) 42%, transparent 82%)',
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,.6) 0%, rgba(0,0,0,.28) 42%, transparent 82%)',
        filter: 'blur(.6px)' } : null) }}>
      {heights.map((h, i) => {
        const col = palette[i % palette.length];
        return (
          <div key={i} className={reflect ? 'sw-cvw-ref' : 'sw-cvw-bar'} style={{ flex: 1,
            height: Math.round(h * 100) + '%',
            borderRadius: reflect ? '0 0 4px 4px' : '4px 4px 0 0',
            background: reflect
              ? col
              : 'linear-gradient(180deg, ' + col + ' 0%, ' + col + ' 60%, ' + col + '55 100%)',
            opacity: reflect ? (0.42 + 0.5 * h) : (0.45 + 0.55 * h),
            boxShadow: reflect ? 'none' : '0 0 16px ' + col + '55',
            transitionDelay: (i * 0.016).toFixed(3) + 's' }} />
        );
      })}
    </div>
  );

  return (
    <SlideRoot bg={C.dark} color={C.blush} className={'sw-cvw-root' + (entered ? ' is-in' : '')}>
      <div ref={rootRef} data-sw-no-reveal="" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {/* accent glow wash behind the spectrum */}
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: -120, height: 560, zIndex: 0,
        pointerEvents: 'none', background: 'radial-gradient(60% 70% at 50% 100%, ' + accent + '24, transparent 70%)' }} />

      {/* full-bleed spectrum */}
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', left: 96, right: 96, bottom: 96, zIndex: 3 }}>
        <Bars reflect={false} />
        {p.showAxis && (
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, ' + accent + '88 12%, ' + accent + '88 88%, transparent)',
            boxShadow: '0 0 14px ' + accent + '55' }} />
        )}
        {p.showReflection && <Bars reflect />}
        {p.showAxis && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.mono, fontSize: 18,
            letterSpacing: '.12em', color: 'rgba(245,225,227,.4)', marginTop: 4 }}>
            {p.ticks.map((t) => <span key={t}>{t}</span>)}
          </div>
        )}
        {p.showPlayhead && (
          <div aria-hidden="true" style={{ position: 'absolute', top: -10, bottom: 30, left: '62%', width: 2,
            background: 'linear-gradient(180deg, rgba(245,225,227,.5), rgba(245,225,227,.5) 70%, transparent)' }}>
            <span style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 12,
              height: 12, borderRadius: '50%', background: accent, boxShadow: '0 0 12px ' + accent }} />
          </div>
        )}
      </div>

      {/* gentle top wash for headline legibility — sits BELOW the spectrum so the bars stay vivid */}
      <div data-sw-no-reveal="" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(20,16,20,.6) 0%, rgba(20,16,20,.18) 30%, rgba(20,16,20,0) 50%)' }} />

      <div style={{ position: 'relative', zIndex: 4 }}><Bar meta={p.barMeta} accent={accent} dark /></div>

      {/* hero — top-aligned so the spectrum owns the lower half */}
      <div style={{ position: 'relative', zIndex: 4, flex: 1, minHeight: 0, display: 'flex',
        flexDirection: 'column', justifyContent: 'flex-start', alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left', paddingTop: 26 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px 8px 12px',
          borderRadius: 999, border: '1px solid ' + accent + '66', background: accent + '1f' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: accent, boxShadow: '0 0 0 4px ' + accent + '33' }} />
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.2em', color: C.blush }}>{p.badge}</span>
        </div>
        <h1 style={{ fontWeight: 900, fontSize: 138, lineHeight: 0.98, letterSpacing: '-3px', margin: '26px 0 0', color: C.blush }}>
          {renderSwText(p.title, { hl: { tone: 'o', block: true, style: { background: accent, color: '#fff' } } })}
        </h1>
        {p.showTagline && (
          <p style={{ fontSize: 29, lineHeight: 1.55, color: 'rgba(245,225,227,.72)', marginTop: 28,
            maxWidth: 900, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0 }}>
            {p.tagline}
          </p>
        )}
      </div>

      <div style={{ position: 'relative', zIndex: 4 }}><Footer page={p.page} total={p.total} accent={accent} dark /></div>
    </SlideRoot>
  );
}
