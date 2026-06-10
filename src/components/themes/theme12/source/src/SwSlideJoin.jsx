// SwSlideJoin.jsx — Slide 04 (call to action / directory / marquee).
// All visible copy/data defaults live in `defaultProps`; layout/visibility
// props map 1:1 with `controls`.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'join', index: 82, label: '加入声浪 / Join Us' };

export const defaultProps = {
  accent: C.orange,
  showDirectory: true,
  directoryColumns: 4,
  showMarquee: true,
  marqueeSpeed: 20,
  showDecorations: true,
  // —— content ——
  barMeta: '82 — Join Us',
  kicker: '加入声浪 / Join Us',
  title: '现在，轮到你\n发出[[声浪]]。',
  subtitle: 'Now — make some noise.',
  ctaText: '免费开始发行',
  ctaUrl: 'sound.wave / start',
  marqueeCn: '声浪',
  marqueeEn: 'SOUNDWAVE',
  directory: [
    { h: '产品 / Product', links: ['一键发行 Release', '收益结算 Ledger', '版权护盾 Shield', '数据洞察 Insights'] },
    { h: '资源 / Resources', links: ['帮助中心 Docs', '开发者 API', '博客 Journal', '价格 Pricing'] },
    { h: '社区 / Community', links: ['创作者计划', '论坛 Forum', 'Discord', '活动 Live'] },
    { h: '关于 / About', links: ['团队 Team', '招聘 Careers', '媒体 Press', '联系 Contact'] },
  ],
};

export const controls = [
  { key: 'showDirectory', label: '显示目录', type: 'toggle', def: true, desc: '显示/隐藏底部链接目录' },
  { key: 'directoryColumns', label: '目录栏数', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    dependsOn: 'showDirectory', desc: '链接目录的列数' },
  { key: 'showMarquee', label: '显示跑马灯', type: 'toggle', def: true, desc: '显示/隐藏底部滚动条' },
  { key: 'marqueeSpeed', label: '跑马灯速度', type: 'slider', def: 20, min: 8, max: 40, step: 1, unit: 's',
    dependsOn: 'showMarquee', desc: '滚动一圈的秒数（越小越快）' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮/按钮等强调色' },
];

function Eq() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 5, height: 42 }}>
      {[18, 42, 28, 38].map((h, i) => <i key={i} style={{ width: 9, height: h, background: C.lime, borderRadius: 3, display: 'block' }} />)}
    </span>
  );
}

export default function SwSlideJoin(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const cols = Math.max(2, Math.min(4, p.directoryColumns));
  const dirs = (p.directory || []).slice(0, cols);

  const seg = (
    <>
      <span style={{ fontWeight: 900, fontSize: 60, letterSpacing: '-1px' }}>{p.marqueeCn}</span><Eq />
      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 46, color: '#9a8f8c' }}>{p.marqueeEn}</span><Eq />
    </>
  );

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      {p.showDecorations && (
        <>
          <Shape kind="circle" size={70} color={C.magenta} style={{ top: 150, right: 260 }} />
          <Shape kind="pentagon" size={104} color={C.green} style={{ top: 118, right: 120 }} />
        </>
      )}

      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 18, position: 'relative', zIndex: 3 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h1 style={{ fontWeight: 900, fontSize: 108, lineHeight: 1.14, letterSpacing: '-2px', marginTop: 24 }}>
          {renderSwText(p.title, { hl: { tone: 'o', style: { background: accent, color: '#fff' } } })}
        </h1>
        <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
          color: C.inkMut, marginTop: 26 }}>{p.subtitle}</div>

        {/* CTA — editorial underlined headline, not a web button */}
        <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px 34px', marginTop: 42 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, fontWeight: 900, fontSize: 50,
            letterSpacing: '-1.5px', color: C.ink, lineHeight: 1,
            borderBottom: '7px solid ' + accent, paddingBottom: 10 }}>
            {p.ctaText}
            <span aria-hidden="true" style={{ color: accent, fontSize: 46 }}>→</span>
          </span>
          <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.08em', color: C.inkMut,
            paddingBottom: 12 }}>{p.ctaUrl}</span>
        </div>

        {p.showDirectory && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols + ',1fr)', gap: 36, flexShrink: 0,
            borderTop: '1px solid ' + C.line2, paddingTop: 26, marginTop: 34 }}>
            {dirs.map((col) => (
              <div key={col.h}>
                <h4 style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
                  color: accent, marginBottom: 15 }}>{col.h}</h4>
                {col.links.map((l) => (
                  <span key={l} style={{ display: 'block', fontSize: 24, color: '#4f444a', lineHeight: 1.95 }}>{l}</span>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {p.showMarquee && (
        <div style={{ flexShrink: 0, background: C.dark, color: C.blush, overflow: 'hidden',
          margin: '24px -96px -48px', padding: '22px 0', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40, whiteSpace: 'nowrap',
            animation: 'sw-marquee ' + p.marqueeSpeed + 's linear infinite' }}>
            {seg}{seg}{seg}
          </div>
        </div>
      )}
    </SlideRoot>
  );
}
