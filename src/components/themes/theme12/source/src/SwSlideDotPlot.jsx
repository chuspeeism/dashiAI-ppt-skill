// SwSlideDotPlot.jsx — "点阵单位 / Units" pictogram chart page.
//
// Each category is drawn as a run of unit dots (one dot = N units), so quantity
// reads as a countable shape — distinct from the bar/line/pie chart pages.
// Category count (2–4), the unit-per-dot value, legend, a focus row and accent
// are props-controlled and map 1:1 to `controls`; all visible copy/data
// defaults live in `defaultProps`. No global side effects, no
// runtime host dependency.

import React from 'react';
import { swTheme, swStatColors } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font;

export const meta = { id: 'dotplot', index: 48, label: '点阵单位 / Units' };

export const defaultProps = {
  accent: C.orange,
  categoryCount: 4,        // 2–4 categories
  dotValue: 20,            // units (万) per dot
  showValues: true,        // numeric value beside each row
  focus: true,             // highlight one category
  focusIndex: 1,           // 1-based
  // —— content ——
  barMeta: '48 — Units',
  kicker: '互动构成 / Engagement',
  title: '每个点，都是[[真实的人]]。',
  unit: '万',
  cats: [
    { cn: '流媒体播放', en: 'Streaming', value: 420 },
    { cn: '主页收藏', en: 'Saves', value: 260 },
    { cn: '转发分享', en: 'Shares', value: 150 },
    { cn: '评论互动', en: 'Comments', value: 90 },
  ],
  page: '48',
  total: '82',
};

export const controls = [
  { key: 'categoryCount', label: '类目数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '参与对比的类目数量' },
  { key: 'dotValue', label: '每点单位', type: 'slider', def: 20, min: 10, max: 40, step: 5, unit: '万',
    desc: '每个圆点代表的数量（万）' },
  { key: 'showValues', label: '数值标签', type: 'toggle', def: true, desc: '显示/隐藏每行右侧数值' },
  { key: 'focus', label: '高亮某行', type: 'toggle', def: true, desc: '高亮某一类目、弱化其余' },
  { key: 'focusIndex', label: '高亮第几行', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '被高亮类目的序号（1 起）' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '高亮行 / 页脚强调色' },
];

export default function SwSlideDotPlot(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const n = Math.max(2, Math.min(4, p.categoryCount));
  const cats = (p.cats || []).slice(0, n);
  const per = p.dotValue;

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '40px 54px 38px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Shape kind="pentagon" size={104} color="rgba(196,78,224,.10)" style={{ bottom: -26, right: -20, zIndex: 0 }} />

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40,
          marginBottom: 30, position: 'relative', zIndex: 2 }}>
          <div>
            <Kicker accent={accent}>{p.kicker}</Kicker>
            <h2 style={{ fontWeight: 900, fontSize: 46, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 14 }}>
              {renderSwText(p.title, { hl: { tone: 'o' } })}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingBottom: 6 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: accent }} />
            <span style={{ fontFamily: F.mono, fontSize: 21, letterSpacing: '.06em', color: C.inkMut }}>
              = {per} {p.unit}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-around',
          position: 'relative', zIndex: 2 }}>
          {cats.map((c, ci) => {
            const on = !p.focus || (ci + 1) === p.focusIndex;
            const color = (p.focus && (ci + 1) === p.focusIndex) ? accent : swStatColors[ci % swStatColors.length];
            const dots = Math.round(c.value / per);
            return (
              <div key={c.en} style={{ display: 'grid', gridTemplateColumns: '230px 1fr auto', alignItems: 'center',
                gap: 24, opacity: on ? 1 : 0.42, transition: 'opacity .2s',
                borderTop: ci ? '1px solid ' + C.line : 'none', paddingTop: ci ? 18 : 0, paddingBottom: 4 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: 30, letterSpacing: '-.4px' }}>{c.cn}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: C.inkMut, marginTop: 3 }}>{c.en}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'center', minWidth: 0 }}>
                  {Array.from({ length: dots }).map((_, di) => (
                    <span key={di} style={{ width: 26, height: 26, borderRadius: '50%', background: color,
                      boxShadow: on ? '0 2px 6px ' + color + '55' : 'none' }} />
                  ))}
                </div>
                {p.showValues && (
                  <div style={{ textAlign: 'right', minWidth: 120 }}>
                    <span style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-1px',
                      color: on ? color : C.ink, fontVariantNumeric: 'tabular-nums' }}>{c.value}</span>
                    <span style={{ fontSize: 22, fontWeight: 700, color: C.inkMut, marginLeft: 4 }}>{p.unit}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
