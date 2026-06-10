// Slide09Rounds.jsx — 轮次结构 / Funding-round structure (combo chart).
// Bars encode deal count; an overlaid line encodes average ticket size. The
// secondary metric, any highlighted round, and the caption are tweakable.
import React from 'react';
import { SlideFrame, SlideHead, MonoCaption, hexA } from './SlideKit.jsx';

const EVIL_HATCH = 'repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 2px, transparent 2px 9px)';
const EVIL_DOTS = { backgroundImage: 'radial-gradient(rgba(90,90,112,.20) 1.6px, transparent 1.6px)', backgroundSize: '24px 24px' };

export const defaultProps = {
  kicker: '# 横向透视',
  title: '轮次结构 · 笔数与单笔',
  en: 'Rounds — Count vs Avg Ticket',
  cn: '不同轮次的事件笔数与平均单笔',
  rounds: [
    { label: '种子轮', en: 'Seed', deals: 8, avg: 1.2 },
    { label: 'A 轮', en: 'Series A', deals: 12, avg: 1.8 },
    { label: 'B 轮', en: 'Series B', deals: 18, avg: 3.5 },
    { label: 'C 轮', en: 'Series C', deals: 15, avg: 6.8 },
    { label: 'D 轮+', en: 'Series D+', deals: 22, avg: 15.2 },
    { label: '未标明', en: 'Undisclosed', deals: 22, avg: 18.6 },
  ],
  barColor: '#5b8def',
  lineColor: '#e8503a',
  caption: '“D 轮及以后”与“未标明轮次”合计过半，平均单笔超 15 亿 · 头部公司“赢家通吃”',
  // tweakable
  highlight: true,
  highlightIndex: 5,
  showSecondary: true,
  showCaption: true,
  evil: false,
};

export const controls = [
  { key: 'highlight', label: '重点强调', type: 'boolean', default: true,
    description: '是否高亮强调其中一个轮次。' },
  { key: 'highlightIndex', label: '强调第几个', type: 'number', default: 5, min: 0, max: 5, step: 1,
    description: '被强调的轮次序号（从 0 开始）。' },
  { key: 'showSecondary', label: '平均单笔曲线', type: 'boolean', default: true,
    description: '是否叠加“平均单笔金额”折线（次坐标）。' },
  { key: 'barColor', label: '柱状颜色', type: 'color', default: '#5b8def',
    options: ['#5b8def', '#46b083', '#7a5ae0', '#e0a23a'], description: '事件笔数柱状的颜色。' },
  { key: 'lineColor', label: '折线颜色', type: 'color', default: '#e8503a',
    options: ['#e8503a', '#e0a23a', '#7a5ae0', '#46b083'], description: '平均单笔折线的颜色。' },
  { key: 'showCaption', label: '装饰文案', type: 'boolean', default: true,
    description: '是否显示底部说明文案。' },
  { key: 'evil', label: 'evilcharts 模式', type: 'boolean', default: false,
    description: '切换为 evilcharts 风格：点阵底纹绘图区 + 柱面 45° 斜纹 + 柱/线霓虹辉光。' },
];

const PLOT_H = 400;

export default function Slide09Rounds(props) {
  const p = { ...defaultProps, ...props };
  const rs = p.rounds;
  const n = rs.length;
  const maxDeals = Math.max(...rs.map((r) => r.deals)) * 1.15;
  const maxAvg = Math.max(...rs.map((r) => r.avg)) * 1.2;
  const cx = (i) => ((i + 0.5) / n) * 100;
  const ly = (v) => PLOT_H - (v / maxAvg) * PLOT_H * 0.82;

  return (
    <SlideFrame bg="b">
      <SlideHead kicker={p.kicker} tone="blue" title={p.title} en={p.en} cn={p.cn} />

      {/* legend */}
      <div style={{ display: 'flex', gap: 28, marginTop: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, color: 'var(--aip-ink-2)', fontWeight: 500 }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, background: p.barColor }} />事件笔数
        </span>
        {p.showSecondary && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, color: 'var(--aip-ink-2)', fontWeight: 500 }}>
            <span style={{ width: 26, height: 5, borderRadius: 3, background: p.lineColor }} />平均单笔（亿美元）
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', marginTop: 12 }}>
        <div style={{ position: 'relative', width: '100%', height: PLOT_H + 90 }}>
          {p.evil && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 90, height: PLOT_H, borderRadius: 18, ...EVIL_DOTS }} />}
          {/* bars — gapless equal columns, bar centred in each column so the
              avg-line markers (positioned at (i+0.5)/n) line up with bar centres */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 90, height: PLOT_H, display: 'flex', alignItems: 'flex-end' }}>
            {rs.map((r, i) => {
              const on = p.highlight && i === p.highlightIndex;
              const dim = p.highlight && !on;
              return (
                <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{
                    width: '66%', height: `${(r.deals / maxDeals) * 100}%`, borderRadius: '14px 14px 6px 6px',
                    opacity: dim ? 0.5 : 1,
                    background: p.evil ? `${EVIL_HATCH}, linear-gradient(180deg, ${hexA(p.barColor, 0.92)}, ${hexA(p.barColor, 0.45)})` : `linear-gradient(180deg, ${hexA(p.barColor, 0.9)}, ${hexA(p.barColor, 0.4)})`,
                    border: on ? `2px solid ${p.barColor}` : '1px solid rgba(255,255,255,.55)',
                    boxShadow: p.evil
                      ? (on ? `0 0 0 1px ${hexA(p.barColor, .5)}, 0 0 38px ${hexA(p.barColor, .55)}, 0 16px 38px ${hexA(p.barColor, .4)}`
                            : `0 0 0 1px ${hexA(p.barColor, .4)}, 0 0 20px ${hexA(p.barColor, .3)}, 0 10px 24px ${hexA(p.barColor, .2)}`)
                      : (on ? `0 18px 40px ${hexA(p.barColor, 0.4)}` : '0 14px 32px rgba(70,90,180,.16)'),
                    transition: 'all .3s ease',
                  }}>
                    <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, textAlign: 'center',
                      fontSize: 34, fontWeight: 900, color: 'var(--aip-ink)', marginBottom: 12 }}>{r.deals}<small style={{ fontSize: 24, color: '#8a8b94', fontWeight: 700 }}> 笔</small></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* avg line overlay */}
          {p.showSecondary && (
            <svg viewBox={`0 0 100 ${PLOT_H}`} preserveAspectRatio="none"
              style={{ position: 'absolute', left: 0, right: 0, bottom: 90, width: '100%', height: PLOT_H, overflow: 'visible' }}>
              <polyline fill="none" stroke={p.lineColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                points={rs.map((r, i) => `${cx(i)},${ly(r.avg)}`).join(' ')} style={{ strokeWidth: 3, filter: p.evil ? `drop-shadow(0 0 8px ${hexA(p.lineColor, 0.75)})` : 'none' }} />
            </svg>
          )}
          {/* avg markers + labels (non-distorted, absolute %) */}
          {p.showSecondary && rs.map((r, i) => {
            const on = p.highlight && i === p.highlightIndex;
            return (
              <div key={i} style={{ position: 'absolute', left: `${cx(i)}%`, bottom: 90 + (PLOT_H - ly(r.avg)) - 0,
                transform: 'translate(-50%, 50%)' }}>
                <div style={{ width: on ? 18 : 13, height: on ? 18 : 13, borderRadius: '50%', background: '#fff',
                  border: `${on ? 5 : 4}px solid ${p.lineColor}`, boxSizing: 'border-box' }} />
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginBottom: 8, fontSize: 24, fontWeight: 900, color: p.lineColor, whiteSpace: 'nowrap' }}>{r.avg}</div>
              </div>
            );
          })}

          {/* x labels — same gapless equal columns as the bars */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, display: 'flex' }}>
            {rs.map((r, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', paddingTop: 18 }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--aip-ink)' }}>{r.label}</div>
                <div className="aip-en" style={{ fontSize: 24 }}>{r.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MonoCaption show={p.showCaption}>{p.caption}</MonoCaption>
    </SlideFrame>
  );
}
