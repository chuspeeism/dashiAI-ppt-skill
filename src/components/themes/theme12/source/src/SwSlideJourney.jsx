// SwSlideJourney.jsx — "旅程纵览 / Journey" vertical-spine timeline.
//
// An origin-story timeline on a vertical centre spine with cards alternating
// left/right — distinct from the horizontal Roadmap (Timeline) and the arrow
// Process flow. Node count (3–5), the "now" focus node, the spine, progress
// fill and descriptions are props-controlled and map 1:1 to `controls`; all
// visible copy/data defaults live in `defaultProps`. No
// global side effects, no host dependency.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'journey', index: 72, label: '旅程纵览 / Journey' };

export const defaultProps = {
  accent: C.orange,
  stepCount: 5,            // 3–5 nodes
  focus: true,             // highlight the "now" node
  focusIndex: 5,           // which node (1-based)
  showSpine: true,         // central spine + progress
  showDescriptions: true,
  // —— content ——
  barMeta: '72 — Journey',
  kicker: '我们的旅程 / The Journey',
  title: '从一间\n出租屋，\n到[[十万人]]。',
  intro: '声浪不是凭空出现的——它长在创作者真实的难处里。',
  nowLabel: 'Now',
  nodes: [
    { y: '2019', t: '一间出租屋', d: '几个乐手凑钱，做了第一版给自己用的结算表。' },
    { y: '2021', t: '第一笔到账', d: '帮一位独立音乐人，追回被漏发的版税。' },
    { y: '2023', t: '声浪成形', d: '发行、版权、结算，合成同一个产品。' },
    { y: '2025', t: '十万创作者', d: '平台服务的音乐人，突破十万。' },
    { y: '2026', t: '全球结算', d: '多币种实时透明分账，正式上线。' },
  ],
  page: '72',
  total: '82',
};

export const controls = [
  { key: 'stepCount', label: '节点数', type: 'slider', def: 5, min: 3, max: 5, step: 1,
    desc: '旅程节点的数量' },
  { key: 'focus', label: '当前节点', type: 'toggle', def: true, desc: '高亮“此刻”所处的节点' },
  { key: 'focusIndex', label: '进行到第几个', type: 'slider', def: 5, min: 1, max: 5, step: 1,
    dependsOn: 'focus', desc: '当前节点序号（1 起）' },
  { key: 'showSpine', label: '中轴脊线', type: 'toggle', def: true, desc: '显示/隐藏中央脊线与进度填充' },
  { key: 'showDescriptions', label: '节点描述', type: 'toggle', def: true, desc: '显示/隐藏节点描述文字' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '当前节点 / 进度 / 页脚强调色' },
];

export default function SwSlideJourney(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(3, Math.min(5, p.stepCount));
  const now = p.focus ? Math.max(1, Math.min(count, p.focusIndex)) : 0;
  const nodes = (p.nodes || []).slice(0, count);
  const progress = now > 1 ? ((now - 0.5) / count) * 100 : (now === 1 ? (0.5 / count) * 100 : 0);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '376px 1fr', gap: 56,
        padding: '14px 0 6px' }}>

        {/* intro rail */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 56, lineHeight: 1.06, letterSpacing: '-1.6px', marginTop: 16 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
          <p style={{ fontSize: T.body, lineHeight: 1.66, color: '#5a4f54', marginTop: 20, maxWidth: 320 }}>
            {p.intro}
          </p>
        </div>

        {/* spine */}
        <div style={{ position: 'relative', minWidth: 0 }}>
          {p.showSpine && (
            <>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4,
                transform: 'translateX(-50%)', background: C.line2, borderRadius: 999 }} />
              {now > 0 && (
                <div style={{ position: 'absolute', left: '50%', top: 0, height: progress + '%', width: 4,
                  transform: 'translateX(-50%)', background: accent, borderRadius: 999 }} />
              )}
            </>
          )}
          <div style={{ position: 'relative', height: '100%', display: 'grid',
            gridTemplateRows: 'repeat(' + count + ',1fr)' }}>
            {nodes.map((m, i) => {
              const right = i % 2 === 1;
              const isNow = (i + 1) === now;
              const past = now > 0 && (i + 1) < now;
              const pal = swCardPalette[i % swCardPalette.length];
              const dot = isNow || past ? accent : pal.bg;
              return (
                <div key={m.t} style={{ position: 'relative', display: 'grid',
                  gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
                  {/* dot on the spine */}
                  <div style={{ position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%,-50%)', zIndex: 2 }}>
                    {isNow ? (
                      <span style={{ display: 'flex', width: 34, height: 34, borderRadius: '50%', background: accent,
                        boxShadow: '0 0 0 8px ' + accent + '22', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
                      </span>
                    ) : (
                      <span style={{ display: 'block', width: 22, height: 22, borderRadius: '50%', background: dot,
                        border: '5px solid ' + C.blush, boxShadow: '0 0 0 2px ' + dot }} />
                    )}
                  </div>

                  {/* card */}
                  <div style={{ gridColumn: right ? 2 : 1, padding: right ? '0 0 0 40px' : '0 40px 0 0',
                    textAlign: right ? 'left' : 'right' }}>
                    <div style={{ display: 'inline-block', textAlign: 'left',
                      borderRadius: 18, padding: '13px 20px', maxWidth: 440,
                      background: isNow ? accent : C.paper,
                      color: isNow ? '#fff' : C.ink,
                      boxShadow: isNow ? '0 16px 38px rgba(20,15,16,.2)' : '0 6px 20px rgba(20,15,16,.06)',
                      border: isNow ? 'none' : '1px solid ' + C.line }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: '.04em',
                          color: isNow ? '#fff' : accent }}>{m.y}</span>
                        {isNow && (
                          <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: '.1em',
                            textTransform: 'uppercase', color: accent, background: '#fff', borderRadius: 999,
                            padding: '2px 10px' }}>{p.nowLabel}</span>
                        )}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.4px', marginTop: 3,
                        color: isNow ? '#fff' : C.ink }}>{m.t}</div>
                      {p.showDescriptions && (
                        <p style={{ fontSize: 20, lineHeight: 1.42, marginTop: 5,
                          color: isNow ? 'rgba(255,255,255,.92)' : '#5a4f54' }}>{m.d}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
