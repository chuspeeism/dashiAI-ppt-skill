// SwSlideBento.jsx — "能力便当 / Capabilities" bento-grid page.
//
// An asymmetric bento of mixed-proportion tiles, each a saturated COLOUR-BLOCKED
// card (one brand colour per tile) — distinct from Stack's uniform 2-column grid
// and Process's linear flow. A hero tile in the accent colour anchors the grid;
// the rest are capability + stat tiles carrying geometric decoration. Tile count
// (4–6), focus, decorations, accent and theme are props-controlled and map 1:1
// to `controls`; all visible copy/data defaults live in `defaultProps`.
// No global side effects.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'bento', index: 6, label: '能力便当 / Capabilities' };

export const defaultProps = {
  accent: C.orange,
  theme: 'light',          // 'light' | 'dark'
  tileCount: 6,            // 4–6 tiles
  focus: false,
  focusIndex: 1,
  showDeco: true,
  // —— content（首格为 hero；kind:'kpi' 为大数字格）——
  barMeta: '06 — Capabilities',
  kicker: '能力便当 / Capabilities',
  title: '一个工作台，[[全链路]]覆盖。',
  lede: '从母带到结算，从听众到维权——把分散在十几个后台里的事，收进同一块面板。',
  heroTags: ['30+ 平台', '0 中间商'],
  tiles: [
    { cn: '一键发行', en: 'Release', d: '一次上传，自动分发到全球 30+ 流媒体平台，元数据代为校验。', kind: 'hero' },
    { cn: '透明结算', en: 'Ledger', d: '按平台拆解每一笔版税。', kind: 'kpi', kpi: '72h' },
    { cn: '粉丝直连', en: 'Direct', d: '专属页面把听众沉淀为资产。', kind: 'plain' },
    { cn: '版权护盾', en: 'Shield', d: '全网监测盗用，一键存证维权。', kind: 'plain' },
    { cn: '协作分账', en: 'Splits', d: '词曲编混按比例自动拆账。', kind: 'plain' },
    { cn: '数据洞察', en: 'Insights', d: '听众画像与趋势一目了然。', kind: 'plain' },
  ],
  page: '06',
  total: '82',
};

export const controls = [
  { key: 'theme', label: '配色', type: 'segment', def: 'light',
    options: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }],
    desc: '页面整体明暗配色' },
  { key: 'tileCount', label: '便当格数', type: 'slider', def: 6, min: 4, max: 6, step: 1,
    desc: '便当网格中的格子数量' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false, desc: '高亮某一格，弱化其余' },
  { key: 'focusIndex', label: '强调第几格', type: 'slider', def: 1, min: 1, max: 6, step: 1,
    dependsOn: 'focus', desc: '被强调格子的序号（1 起）' },
  { key: 'showDeco', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏格子内几何装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '导语 / 焦点 / 页脚强调色' },
];

// Colour assignment per (non-hero) tile, offset so it never sits orange-on-orange.
const PAL_ORDER = [1, 2, 3, 0, 1]; // cyan, green, peach, purple, cyan

// Distinct-area layouts; #areas always === tileCount, edge-to-edge balanced.
const LAYOUTS = {
  4: { cols: '1.35fr 1fr', rows: '1fr 1fr', areas: '"a b" "a c"', ord: ['a', 'b', 'c'] },
  5: { cols: '1.5fr 1fr 1fr', rows: '1fr 1fr', areas: '"a b c" "a d e"', ord: ['a', 'b', 'c', 'd', 'e'] },
  6: { cols: '1.25fr 1fr 1fr', rows: '1fr 1fr', areas: '"a b c" "d e f"', ord: ['a', 'b', 'c', 'd', 'e', 'f'] },
};

function TileDeco({ i, color }) {
  if (i % 3 === 0) return <Shape kind="circle" size={50} color={color} style={{ position: 'absolute', right: -12, bottom: -12, opacity: .95 }} />;
  if (i % 3 === 1) return <Shape kind="ring" size={52} border={11} color={color} style={{ position: 'absolute', right: 20, bottom: 22 }} />;
  return <Shape kind="pentagon" size={46} color={color} style={{ position: 'absolute', right: 18, bottom: 18 }} />;
}

export default function SwSlideBento(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const dark = p.theme === 'dark';
  const count = Math.max(4, Math.min(6, p.tileCount));
  const L = LAYOUTS[count];
  const tiles = (p.tiles || []).slice(0, L.ord.length);

  const pageBg = dark ? C.dark : C.blush;
  const fg = dark ? C.blush : C.ink;
  const mut = dark ? '#9a8f8c' : C.inkMut;

  return (
    <SlideRoot bg={pageBg} color={fg}>
      <Bar meta={p.barMeta} accent={accent} dark={dark} />

      <div style={{ flexShrink: 0, marginTop: 22, marginBottom: 20, display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
        <div>
          <Kicker accent={accent}>{p.kicker}</Kicker>
          <h2 style={{ fontWeight: 900, fontSize: 50, lineHeight: 1.04, letterSpacing: '-1.2px', marginTop: 14 }}>
            {renderSwText(p.title, { hl: { tone: 'o' } })}
          </h2>
        </div>
        <p style={{ fontSize: 24, lineHeight: 1.6, color: mut, maxWidth: 460, paddingBottom: 6 }}>
          {p.lede}
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gap: 18,
        gridTemplateColumns: L.cols, gridTemplateRows: L.rows, gridTemplateAreas: L.areas }}>
        {tiles.map((t, i) => {
          const area = L.ord[i];
          const hero = t.kind === 'hero';
          const kpi = t.kind === 'kpi';
          const dim = p.focus && (i + 1) !== p.focusIndex;
          const pal = swCardPalette[PAL_ORDER[(i - 1 + PAL_ORDER.length) % PAL_ORDER.length]];

          const cardBg = hero ? accent : pal.bg;
          const titleC = hero ? '#fff' : pal.title;
          const bodyC = hero ? 'rgba(255,255,255,.92)' : pal.body;
          const labelC = hero ? 'rgba(255,255,255,.82)' : pal.sub;
          const numC = hero ? 'rgba(255,255,255,.6)' : pal.name;

          return (
            <div key={t.en} style={{ gridArea: area, position: 'relative', overflow: 'hidden',
              borderRadius: 24, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column',
              padding: hero ? '40px 40px 38px' : '28px 30px 26px',
              background: cardBg, color: bodyC,
              opacity: dim ? 0.34 : 1, transition: 'opacity .2s',
              outline: p.focus && !dim && !hero ? '3px solid ' + accent : 'none', outlineOffset: -3 }}>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: hero ? 24 : 21,
                  letterSpacing: '.14em', textTransform: 'uppercase', color: labelC }}>{t.en}</span>
                <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: hero ? 24 : 20, color: numC }}>{String(i + 1).padStart(2, '0')}</span>
              </div>

              {kpi ? (
                <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 76, lineHeight: 1, letterSpacing: '-2px', color: pal.name }}>{t.kpi}</div>
                  <h3 style={{ fontWeight: 900, fontSize: 28, letterSpacing: '-.3px', marginTop: 12, color: titleC }}>{t.cn}</h3>
                  <p style={{ fontSize: 21, lineHeight: 1.5, color: bodyC, marginTop: 6 }}>{t.d}</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontWeight: 900, fontSize: hero ? 46 : 30, letterSpacing: '-.6px',
                    marginTop: hero ? 26 : 16, position: 'relative', zIndex: 1, color: titleC }}>{t.cn}</h3>
                  <p style={{ fontSize: hero ? T.body : 22, lineHeight: 1.6, marginTop: hero ? 16 : 10,
                    maxWidth: hero ? 440 : '88%', position: 'relative', zIndex: 1, color: bodyC }}>{t.d}</p>
                  {hero && (
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 1 }}>
                      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.04em',
                        padding: '9px 20px', borderRadius: 999, background: '#fff', color: accent }}>{p.heroTags[0]}</span>
                      <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.04em',
                        padding: '9px 20px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,.5)' }}>{p.heroTags[1]}</span>
                    </div>
                  )}
                </>
              )}

              {p.showDeco && !hero && !kpi && <TileDeco i={i} color={pal.deco[0]} />}
              {hero && (
                <div aria-hidden="true" style={{ position: 'absolute', right: -40, top: -50,
                  width: 200, height: 200, borderRadius: '50%', border: '26px solid rgba(255,255,255,.16)' }} />
              )}
            </div>
          );
        })}
      </div>

      <Footer page={p.page} total={p.total} accent={accent} dark={dark} />
    </SlideRoot>
  );
}
