// SlideDumbbell.jsx — 估值跃迁 / dumbbell (range) chart of valuation leaps.
// Migration-safe: default export + defaultProps + controls; props-only; aip- scope.
// Each company is one row: a hollow "年初" dot and a filled "最新" dot joined by
// a gradient barbell on a shared linear axis, with a ×倍 jump badge on the right.
// Built with flex + % positioning (crisp CN labels) inside the frosted-glass +
// bokeh system. Row count / highlighted row / axis ticks / delta badge / accent
// are tweakable; text lives in defaultProps.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

export const defaultProps = {
  kicker: '风险与展望 · 估值',
  tone: 'red',
  title: '一年之间，估值翻了几番',
  en: 'Valuation Leap · Dumbbell',
  cn: '年初 → 最新，谁的跃迁最猛',
  unit: '亿',
  startLabel: '年初',
  endLabel: '最新',
  rows: [
    { name: 'OpenAI', sub: '通用大模型', start: 1570, end: 5000 },
    { name: 'Anthropic', sub: '通用大模型', start: 615, end: 1830 },
    { name: 'xAI', sub: '通用大模型', start: 240, end: 2000 },
    { name: 'Safe Superintelligence', sub: '通用大模型', start: 50, end: 320 },
    { name: 'Mistral AI', sub: '开源大模型', start: 60, end: 140 },
  ],
  axisMax: 5500,
  axisTicks: [0, 1000, 2000, 3000, 4000, 5000],
  caption: '哑铃图 · xAI 一年 8 倍领跑，泡沫与机会同在一条轴上',
  // tweakable (universal names)
  itemCount: 5,
  highlight: true,
  highlightIndex: 2,
  showAxis: true,
  showDelta: true,
  showStartDot: true,
  accentColor: '#e8503a',
  startColor: '#9a9ba4',
  showCaption: true,
};

export const controls = [
  { key: 'itemCount', label: '公司行数', type: 'number', default: 5, min: 3, max: 5, step: 1, unit: ' 行',
    description: '展示的公司（哑铃行）数量。' },
  { key: 'highlight', label: '高亮某行', type: 'boolean', default: true,
    description: '是否突出其中一行（提亮 + 放大端点）。' },
  { key: 'highlightIndex', label: '高亮第几行', type: 'number', default: 2, min: 0, max: 4, step: 1,
    description: '被高亮的行序号（从 0 开始）。' },
  { key: 'showAxis', label: '坐标刻度', type: 'boolean', default: true,
    description: '底部数值刻度与纵向参考线的显示。' },
  { key: 'showDelta', label: '倍数角标', type: 'boolean', default: true,
    description: '右侧 ×倍 跃迁角标的显示。' },
  { key: 'showStartDot', label: '年初端点', type: 'boolean', default: true,
    description: '空心「年初」端点与其数值标签的显示。' },
  { key: 'accentColor', label: '终点色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#e0a23a', '#7a5ae0', '#5b8def', '#46b083'],
    description: '「最新」端点与连杆的强调色。' },
  { key: 'startColor', label: '起点色', type: 'color', default: '#9a9ba4',
    options: ['#9a9ba4', '#5b8def', '#46b083', '#e0a23a', '#7a5ae0'],
    description: '「年初」空心端点的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '底部 */ … /* 说明文案的显示。' },
];

export default function SlideDumbbell(props) {
  const p = { ...defaultProps, ...props };
  const rows = p.rows.slice(0, Math.max(3, Math.min(5, p.itemCount)));
  const ac = p.accentColor, sc = p.startColor;
  const max = p.axisMax || Math.max.apply(null, rows.map((r) => r.end)) * 1.1;
  const pct = (v) => (v / max) * 100;
  const hi = p.highlight ? Math.min(p.highlightIndex, rows.length - 1) : -1;
  const LEFT = 360, RIGHT = 158;   // px gutters around the plotting track

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone={p.tone} title={p.title} en={p.en} cn={p.cn} />

      <div style={{ flex: 1, minHeight: 0, marginTop: 22, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,.55)', backdropFilter: 'blur(28px) saturate(140%)', WebkitBackdropFilter: 'blur(28px) saturate(140%)',
        border: '1px solid rgba(255,255,255,.72)', borderRadius: 30, padding: '24px 46px 22px',
        boxShadow: '0 1px 0 rgba(255,255,255,.8) inset, 0 28px 64px rgba(70,72,100,.14)' }}>

        {/* legend */}
        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 30, paddingLeft: LEFT, paddingBottom: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', border: `4px solid ${sc}` }} />
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{p.startLabel}估值</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: ac, boxShadow: `0 0 12px ${hexA(ac, 0.6)}` }} />
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--aip-ink-2)' }}>{p.endLabel}估值（{p.unit}美元）</span>
          </span>
        </div>

        {/* rows */}
        <div style={{ flex: 1, minHeight: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* vertical gridlines spanning the rows */}
          {p.showAxis && (
            <div style={{ position: 'absolute', left: LEFT, right: RIGHT, top: 0, bottom: 0, pointerEvents: 'none' }}>
              {p.axisTicks.map((tk, i) => (
                <div key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: `${pct(tk)}%`, width: 1,
                  background: hexA('#5a5a70', i === 0 ? 0.26 : 0.12) }} />
              ))}
            </div>
          )}

          {rows.map((r, i) => {
            const on = i === hi;
            const x0 = pct(r.start), x1 = pct(r.end);
            const mult = (r.end / r.start);
            return (
              <div key={i} style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center',
                borderTop: i === 0 ? 'none' : '1px solid rgba(43,43,48,.1)' }}>
                {/* label */}
                <div style={{ flex: `0 0 ${LEFT}px`, paddingRight: 26, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 24, fontWeight: 700, color: on ? ac : 'var(--aip-ink-3)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: on ? 34 : 31, fontWeight: 900, color: on ? ac : 'var(--aip-ink)', lineHeight: 1.05,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
                  </div>
                  <div style={{ marginTop: 2, fontSize: 22, fontWeight: 600, color: 'var(--aip-ink-3)' }}>{r.sub}</div>
                </div>

                {/* track */}
                <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                  {/* barbell connector */}
                  <div style={{ position: 'absolute', top: '50%', left: `${x0}%`, width: `${x1 - x0}%`, height: on ? 16 : 12,
                    transform: 'translateY(-50%)', borderRadius: 999,
                    background: `linear-gradient(90deg, ${hexA(sc, 0.5)}, ${ac})`,
                    boxShadow: on ? `0 6px 20px ${hexA(ac, 0.4)}` : `0 4px 12px ${hexA(ac, 0.18)}` }} />
                  {/* start dot + label */}
                  {p.showStartDot && (
                    <>
                      <div style={{ position: 'absolute', top: '50%', left: `${x0}%`, width: on ? 26 : 22, height: on ? 26 : 22,
                        transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#fff', border: `4px solid ${sc}`, zIndex: 2 }} />
                      <div style={{ position: 'absolute', bottom: 'calc(50% + 18px)', left: `${x0}%`, transform: 'translateX(-50%)',
                        fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: 'var(--aip-ink-3)', whiteSpace: 'nowrap' }}>{r.start}</div>
                    </>
                  )}
                  {/* end dot + label */}
                  <div style={{ position: 'absolute', top: '50%', left: `${x1}%`, width: on ? 32 : 26, height: on ? 32 : 26,
                    transform: 'translate(-50%,-50%)', borderRadius: '50%', background: ac, border: '3px solid #fff', zIndex: 3,
                    boxShadow: on ? `0 0 18px ${hexA(ac, 0.7)}, 0 6px 16px ${hexA(ac, 0.4)}` : `0 4px 12px ${hexA(ac, 0.3)}` }} />
                  <div style={{ position: 'absolute', top: 'calc(50% + 16px)', left: `${x1}%`, transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'baseline', gap: 3, whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 34 : 28, fontWeight: 700, color: on ? ac : 'var(--aip-ink)', letterSpacing: '-.02em' }}>{r.end}</span>
                  </div>
                </div>

                {/* delta badge */}
                {p.showDelta && (
                  <div style={{ flex: `0 0 ${RIGHT}px`, display: 'flex', justifyContent: 'flex-end', paddingLeft: 18 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 2, padding: on ? '10px 20px' : '8px 16px', borderRadius: 999,
                      background: on ? ac : hexA(ac, 0.1), border: `1.5px solid ${hexA(ac, on ? 1 : 0.4)}` }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: on ? 38 : 32, fontWeight: 700, lineHeight: 1,
                        color: on ? '#fff' : ac, letterSpacing: '-.02em' }}>{mult.toFixed(1)}</span>
                      <span style={{ fontSize: on ? 24 : 21, fontWeight: 800, color: on ? '#fff' : ac }}>×</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* axis ticks */}
        {p.showAxis && (
          <div style={{ flex: '0 0 auto', position: 'relative', height: 30, marginTop: 4, marginLeft: LEFT, marginRight: RIGHT }}>
            {p.axisTicks.map((tk, i) => (
              <span key={i} style={{ position: 'absolute', left: `${pct(tk)}%`, transform: 'translateX(-50%)',
                fontFamily: "'Space Mono', monospace", fontSize: 19, color: 'var(--aip-ink-3)' }}>{tk}</span>
            ))}
          </div>
        )}
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
