// SwSlideStack.jsx — Slide 02 (product matrix / the stack).
// All visible copy/data defaults live in `defaultProps`; layout/visibility
// props map 1:1 with `controls`.

import React from 'react';
import { swTheme, swCardPalette } from './swTheme.js';
import { SlideRoot, Bar, Footer, Hl, renderSwText } from './swBase.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'stack', index: 5, label: '产品矩阵 / The Stack' };

export const defaultProps = {
  accent: C.orange,
  cardCount: 4,
  columns: 2,
  focus: false,
  focusIndex: 1,
  showLede: true,
  showDeco: true,
  // —— content ——
  barMeta: '05 — The Stack',
  lede: '你只管[[写歌]]，发行 · 结算 · [[维权]]，[[声浪全包了]]。',
  cards: [
    { num: '01', cn: '一键发行', en: 'Release', body: '一次上传，自动分发到全球 30+ 流媒体平台，元数据与封面规格代为校验。', tag: '30+ 平台' },
    { num: '02', cn: '粉丝直连', en: 'Direct', body: '跳过算法与中间商，用专属页面与会员把听众沉淀为可经营的资产。', tag: '0 中间商' },
    { num: '03', cn: '收益透明', en: 'Ledger', body: '实时结算面板，按平台、地区、单曲拆解每一笔版税，路径可追溯。', tag: '72h 到账' },
    { num: '04', cn: '版权护盾', en: 'Shield', body: '作品自动登记存证，全网监测翻唱、采样与盗用，一键发起维权。', tag: '全网监测' },
  ],
  page: '05',
  total: '82',
};

export const controls = [
  { key: 'cardCount', label: '卡片数量', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '展示的产品卡片数量' },
  { key: 'columns', label: '栏数', type: 'segment', def: 2,
    options: [{ value: 1, label: '1 栏' }, { value: 2, label: '2 栏' }], desc: '卡片网格的列数' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false, desc: '高亮某一张卡片，弱化其余' },
  { key: 'focusIndex', label: '强调第几个', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '被强调卡片的序号（1 起）' },
  { key: 'showLede', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏顶部高亮短句' },
  { key: 'showDeco', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏卡片内的图形装饰' },
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '页脚等强调色' },
];

function Deco({ i, pal }) {
  const wrap = { position: 'absolute', right: 30, bottom: 26 };
  if (i === 1) {
    return (
      <div style={{ ...wrap, width: 96, height: 96 }}>
        <span style={{ position: 'absolute', right: 0, bottom: 0, width: 96, height: 96, borderRadius: '50%', background: pal.deco[0] }} />
        <span style={{ position: 'absolute', right: 0, bottom: 0, width: 62, height: 62, borderRadius: '50%', background: pal.deco[1] }} />
        <span style={{ position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: '50%', background: pal.deco[2] }} />
      </div>
    );
  }
  if (i === 3) {
    return (
      <div style={{ ...wrap, width: 80, height: 92, background: pal.deco[0],
        clipPath: 'polygon(50% 0,100% 18%,100% 62%,50% 100%,0 62%,0 18%)' }} />
    );
  }
  const hs = [[34, 62, 44, 74]][0];
  return (
    <div style={{ ...wrap, display: 'flex', alignItems: 'flex-end', gap: 8, height: 74 }}>
      {hs.map((h, k) => (
        <i key={k} style={{ width: 13, height: h, borderRadius: 4, display: 'block',
          background: k % 2 ? pal.deco[1] : pal.deco[0] }} />
      ))}
    </div>
  );
}

export default function SwSlideStack(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const count = Math.max(2, Math.min(4, p.cardCount));
  const cols = p.columns === 1 ? 1 : 2;
  const cards = (p.cards || []).slice(0, count);

  return (
    <SlideRoot bg={C.blush} color={C.ink}>
      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, background: C.paper, borderRadius: 38, margin: '24px 0 22px',
        padding: '44px 52px 50px', display: 'flex', flexDirection: 'column' }}>
        {p.showLede && (
          <p style={{ textAlign: 'center', fontWeight: 900, fontSize: 40, lineHeight: 1.34, letterSpacing: '-.5px',
            maxWidth: 1180, margin: '0 auto 36px' }}>
            {renderSwText(p.lede, { hl: { tone: 'o' } })}
          </p>
        )}

        <div style={{ flex: 1, minHeight: 0, display: 'grid',
          gridTemplateColumns: 'repeat(' + cols + ',1fr)', gridAutoRows: '1fr', gap: 22 }}>
          {cards.map((card, i) => {
            const pal = swCardPalette[i % swCardPalette.length];
            const dim = p.focus && (i + 1) !== p.focusIndex;
            return (
              <div key={card.num} style={{ borderRadius: 26, padding: '34px 38px', position: 'relative',
                overflow: 'hidden', display: 'flex', flexDirection: 'column', background: pal.bg, color: pal.body,
                opacity: dim ? 0.4 : 1, transform: p.focus && !dim ? 'scale(1)' : 'none',
                outline: p.focus && !dim ? '3px solid ' + accent : 'none', outlineOffset: -3, transition: 'opacity .2s' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 25, color: pal.name }}>{card.num}</span>
                  <span style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase', color: pal.sub }}>{card.en}</span>
                </div>
                <h3 style={{ fontWeight: 900, fontSize: T.h3, letterSpacing: '-.5px', marginTop: 18, color: pal.title }}>{card.cn}</h3>
                <p style={{ fontSize: 24, lineHeight: 1.6, marginTop: 12, maxWidth: '74%' }}>{card.body}</p>
                <span style={{ marginTop: 'auto', alignSelf: 'flex-start', fontFamily: F.mono, fontWeight: 700,
                  fontSize: 24, letterSpacing: '.04em', padding: '9px 20px', borderRadius: 999,
                  background: pal.tagBg, color: pal.tagFg }}>{card.tag}</span>
                {p.showDeco && <Deco i={i} pal={pal} />}
              </div>
            );
          })}
        </div>
      </div>

      <Footer page={p.page} total={p.total} accent={accent} />
    </SlideRoot>
  );
}
