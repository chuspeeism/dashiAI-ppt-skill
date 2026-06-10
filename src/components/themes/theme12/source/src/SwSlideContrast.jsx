// SwSlideContrast.jsx — "对照 / Before · After" two-panel comparison.
//
// A hard before/after split: a muted "without" panel against a vivid "with"
// panel, joined by a centre VS badge. Each side carries a headline stat and a
// checklist (✗ vs ✓). Distinct from Table (feature matrix) and WhyNow (stat
// tiles). Point count (2–4), headline stat, badge and accent are props-
// controlled and map 1:1 to `controls`; all visible copy/data defaults live in
// `defaultProps`. No global side effects.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'contrast', index: 35, label: '对照 / Before · After' };

export const defaultProps = {
  accent: C.orange,
  pointCount: 4,           // 2–4 checklist items per side
  showStat: true,
  showBadge: true,
  // —— content ——
  barMeta: '35 — Before · After',
  badgeLabel: 'VS',
  beforeSide: '没有声浪 / Without',
  afterSide: '有了声浪 / With',
  before: {
    stat: '15–45%', statLb: '被层层抽走的分成',
    points: ['作品散落在十几个后台', '版税要等一整个季度', '听众数据握在平台手里', '盗用翻唱无从追踪'],
  },
  after: {
    stat: '0–15%', statLb: '透明、可追溯的分成',
    points: ['一个入口管完全链路', '版税最快 72 小时到账', '粉丝数据回到你手中', '全网监测，一键维权'],
  },
  page: '35',
  total: '82',
};

export const controls = [
  { key: 'pointCount', label: '对照条目', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '每侧列出的对照条目数量' },
  { key: 'showStat', label: '对照大数', type: 'toggle', def: true, desc: '显示/隐藏每侧顶部的对比数字' },
  { key: 'showBadge', label: '中缝徽标', type: 'toggle', def: true, desc: '显示/隐藏中间的 VS 徽标' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '“有声浪”一侧 / 页脚强调色' },
];

function Mark({ ok, color }) {
  return (
    <span style={{ flex: '0 0 auto', width: 34, height: 34, borderRadius: '50%', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 19,
      background: ok ? color : 'rgba(245,225,227,.12)', color: ok ? '#fff' : 'rgba(245,225,227,.55)' }}>
      {ok ? '✓' : '✕'}
    </span>
  );
}

export default function SwSlideContrast(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(2, Math.min(4, p.pointCount));

  const Panel = ({ side, data, ok }) => {
    const dark = !ok;
    const fg = dark ? '#cfc6c8' : '#fff';
    const head = dark ? '#9a8f8c' : 'rgba(255,255,255,.82)';
    return (
      <div style={{ position: 'relative', minWidth: 0, padding: '54px 64px',
        background: ok ? accent : '#1c1416', color: fg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: ok ? '#fff' : accent }} />
          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.16em',
            textTransform: 'uppercase', color: head }}>{side}</span>
        </div>

        {p.showStat && (
          <div style={{ marginTop: 30 }}>
            <div style={{ fontWeight: 900, fontSize: 104, lineHeight: 0.92, letterSpacing: '-3px',
              color: ok ? '#fff' : '#7d7176' }}>{data.stat}</div>
            <div style={{ fontSize: 24, marginTop: 10, color: ok ? 'rgba(255,255,255,.9)' : '#9a8f8c' }}>{data.statLb}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 'auto', paddingTop: 36 }}>
          {data.points.slice(0, n).map((pt) => (
            <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Mark ok={ok} color="#fff" />
              <span style={{ fontSize: 26, fontWeight: ok ? 700 : 400, lineHeight: 1.3,
                color: ok ? '#fff' : '#cfc6c8' }}>{pt}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, margin: '24px 0 22px', borderRadius: 32, overflow: 'hidden',
        position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Panel side={p.beforeSide} data={p.before} ok={false} />
        <Panel side={p.afterSide} data={p.after} ok={true} />

        {p.showBadge && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 92, height: 92, borderRadius: '50%', background: C.blush, color: C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
            fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: '.04em', lineHeight: 1,
            paddingLeft: '.04em',
            boxShadow: '0 14px 40px rgba(0,0,0,.32)' }}>{p.badgeLabel}</div>
        )}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
