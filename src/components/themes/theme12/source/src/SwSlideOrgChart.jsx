// SwSlideOrgChart.jsx — "组织架构 / Structure" hierarchy tree page.
//
// A top-down org/structure tree: one root node branches to N children via a
// connector bus, each optionally branching again into two leaf nodes. Distinct
// from Ecosystem (radial network) and Process (linear steps). Child count (2–4),
// the third level, leaf labels and accent are props-controlled, 1:1 with
// `controls`; all visible copy/data defaults live in `defaultProps`.
// Connectors are plain divs (uniform strokes). No host dependency.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'orgchart', index: 9, label: '组织架构 / Structure' };

export const defaultProps = {
  accent: C.purple,
  childCount: 3,           // 2–4 branches
  showLevel3: true,
  showLeafDesc: true,
  // —— content ——
  barMeta: '09 — Structure',
  kicker: '组织架构 / Structure',
  title: '一个内核，[[四面延展]]。',
  rootTitle: '声浪 OS',
  rootSub: 'INDEPENDENT MUSIC CORE',
  branches: [
    { t: '创作者中台', s: 'CREATORS', c: '#3bb6ec', leaves: [['发行', '一键多平台'], ['结算', '72h 到账']] },
    { t: '版权中枢', s: 'RIGHTS', c: '#1f6b2a', leaves: [['存证', '链上确权'], ['授权', '全球清算']] },
    { t: '听众网络', s: 'AUDIENCE', c: '#f15a29', leaves: [['订阅', '粉丝直连'], ['现场', '票务联动']] },
    { t: '生态伙伴', s: 'PARTNERS', c: '#c44ee0', leaves: [['平台', '30+ 渠道'], ['品牌', '联合企划']] },
  ],
  page: '09',
  total: '82',
};

export const controls = [
  { key: 'childCount', label: '分支数量', type: 'slider', def: 3, min: 2, max: 4, step: 1,
    desc: '第二层分支节点数量' },
  { key: 'showLevel3', label: '第三层', type: 'toggle', def: true, desc: '显示/隐藏第三层叶子节点' },
  { key: 'showLeafDesc', label: '叶子说明', type: 'toggle', def: true, desc: '显示/隐藏叶子节点下方说明' },
  { key: 'accent', label: '强调色', type: 'color', def: C.purple,
    options: [C.purple, C.orange, C.cyan, C.green], desc: '根节点 / 连线 / 页脚强调色' },
];

const LINE = 'rgba(27,21,24,.26)';
function VLine({ left, top, height, color = LINE }) {
  return <div style={{ position: 'absolute', left: left, top: top, height: height, width: 2,
    background: color, transform: 'translateX(-1px)' }} />;
}
function HLine({ left, width, top, color = LINE }) {
  return <div style={{ position: 'absolute', left: left, width: width, top: top, height: 2,
    background: color, transform: 'translateY(-1px)' }} />;
}

export default function SwSlideOrgChart(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(2, Math.min(4, p.childCount));
  const data = (p.branches || []).slice(0, n);
  const colW = 100 / n;
  const childX = (i) => colW * (i + 0.5);
  const firstX = childX(0), lastX = childX(n - 1);

  // vertical zones (% of stage)
  const busY = 27, childTop = 33, childBot = p.showLevel3 ? 60 : 66, gbusY = 70, leafTop = 76;
  const gOff = colW * 0.24;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flexShrink: 0, marginTop: 18 }}>
        <Kicker accent={accent}>{p.kicker}</Kicker>
        <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.02, letterSpacing: '-1.2px', marginTop: 10 }}>
          {renderSwText(p.title, { hl: { tone: 'p' } })}
        </h2>
      </div>

      {/* tree stage */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative', marginTop: 14 }}>
        {/* root node */}
        <div style={{ position: 'absolute', left: '50%', top: '2%', transform: 'translateX(-50%)',
          background: accent, color: '#fff', borderRadius: 18, padding: '18px 40px', textAlign: 'center',
          boxShadow: '0 16px 36px ' + accent + '4d', zIndex: 2 }}>
          <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: '-.5px' }}>{p.rootTitle}</div>
          <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: '.2em', opacity: 0.85, marginTop: 2 }}>{p.rootSub}</div>
        </div>

        {/* connectors: root → bus → children */}
        <VLine left="50%" top="20%" height="7%" color={accent} />
        <HLine left={firstX + '%'} width={(lastX - firstX) + '%'} top={busY + '%'} color={accent} />
        {data.map((_, i) => (
          <VLine key={'cs' + i} left={childX(i) + '%'} top={busY + '%'} height={(childTop - busY) + '%'} color={accent} />
        ))}

        {/* children */}
        {data.map((b, i) => (
          <div key={b.t} style={{ position: 'absolute', left: childX(i) + '%', top: childTop + '%',
            transform: 'translateX(-50%)', width: 'calc(' + colW + '% - 28px)', maxWidth: 320,
            background: C.paper, borderRadius: 16, padding: '16px 18px', textAlign: 'center',
            borderTop: '5px solid ' + b.c, boxShadow: '0 10px 26px rgba(27,21,24,.1)', zIndex: 2 }}>
            <div style={{ fontWeight: 900, fontSize: 26, letterSpacing: '-.4px' }}>{b.t}</div>
            <div style={{ fontFamily: F.mono, fontSize: 15, letterSpacing: '.16em', color: b.c, marginTop: 2 }}>{b.s}</div>
          </div>
        ))}

        {/* level 3 */}
        {p.showLevel3 && data.map((b, i) => {
          const cx = childX(i);
          const lx = cx - gOff, rx = cx + gOff;
          return (
            <React.Fragment key={'l3' + i}>
              <VLine left={cx + '%'} top={childTop + '%'} height={(gbusY - childTop) + '%'} color={b.c} />
              <HLine left={lx + '%'} width={(rx - lx) + '%'} top={gbusY + '%'} color={b.c} />
              <VLine left={lx + '%'} top={gbusY + '%'} height={(leafTop - gbusY) + '%'} color={b.c} />
              <VLine left={rx + '%'} top={gbusY + '%'} height={(leafTop - gbusY) + '%'} color={b.c} />
              {b.leaves.map((lf, j) => (
                <div key={j} style={{ position: 'absolute', left: (j === 0 ? lx : rx) + '%', top: leafTop + '%',
                  transform: 'translateX(-50%)', width: 'calc(' + (colW * 0.46) + '% - 6px)', maxWidth: 170,
                  background: '#fff', border: '1px solid rgba(27,21,24,.12)', borderRadius: 12,
                  padding: '11px 10px', textAlign: 'center', zIndex: 2 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: b.c }} />
                    <span style={{ fontWeight: 700, fontSize: 21, letterSpacing: '-.2px' }}>{lf[0]}</span>
                  </div>
                  {p.showLeafDesc && (
                    <div style={{ fontFamily: F.mono, fontSize: 14, color: C.inkMut, marginTop: 3 }}>{lf[1]}</div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
