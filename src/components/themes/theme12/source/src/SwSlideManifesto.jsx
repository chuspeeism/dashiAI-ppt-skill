// SwSlideManifesto.jsx — Slide 01 (cover / manifesto).
//
// Independent, props-only. All visible copy/data defaults live in `defaultProps`;
// everything else is controlled via props that map 1:1 to
// the exported `controls` schema. Image data is passed in via `media` and lifted
// out via `onMediaChange` so the component never owns persistence.

import React from 'react';
import { swTheme } from './swTheme.js';
import { SlideRoot, Bar, Footer, Kicker, Hl, Shape, renderSwText, swDeckSection } from './swBase.jsx';
import SwImageSlot from './SwImageSlot.jsx';

const C = swTheme.color, F = swTheme.font, T = swTheme.type;

export const meta = { id: 'manifesto', index: 1, label: '封面 / Manifesto' };

export const defaultProps = {
  accent: C.orange,
  showDecorations: true,
  showKicker: true,
  mediaCount: 0,
  mediaFit: 'cover',
  indexCount: 4,
  focus: false,
  focusIndex: 1,
  media: [],                 // array<string|null>, image srcs (controlled)
  onMediaChange: () => {},   // (index, src) => void
  // —— content ——
  barMeta: 'Independent Music OS — Vol. 01 / 2026',
  kicker: '01 — 宣言 / Manifesto',
  title: '声音的主权，\n属于[[创作者]]。',
  titleEn: 'Ownership of sound\nbelongs to the maker.',
  aboutLabel: 'What is 声浪',
  aboutBody: '声浪是为独立音乐人打造的[[发行与变现操作系统]]。把发行、结算、版权登记与粉丝运营收拢进同一处——让你不必再把作品、收入和听众，交到任何中间人手里。',
  aboutFoot: '一次上传，全球分发；每一分收益，路径透明。',
  mediaPlaceholderHero: '拖入主图 / Hero image',
  mediaPlaceholder: '拖入图片',
  index: [
    { n: '01', t: '宣言', e: 'Manifesto', d: '主权，为何比流量更重要。', c: C.orange },
    { n: '02', t: '产品矩阵', e: 'The Stack', d: '发行 · 直连 · 结算 · 护盾。', c: C.magenta },
    { n: '03', t: '为什么是现在', e: 'Why Now', d: '独立发行的拐点已到来。', c: C.cyan },
    { n: '04', t: '加入声浪', e: 'Join Us', d: '轮到你，发出声浪。', c: C.green },
  ],
  page: '01',
  total: '82',
};

export const controls = [
  { key: 'accent', label: '强调色', type: 'color', def: C.orange,
    options: [C.orange, C.purple, C.cyan, C.green], desc: '主强调色，作用于编号、页脚、装饰条' },
  { key: 'mediaCount', label: '图片数量', type: 'slider', def: 0, min: 0, max: 3, step: 1,
    desc: '右栏图片槽数量；0 时显示文字说明卡，1 时图片按原始比例自适应' },
  { key: 'mediaFit', label: '图片填充', type: 'segment', def: 'cover',
    options: [{ value: 'cover', label: '裁切' }, { value: 'contain', label: '完整' }],
    dependsOn: 'mediaCount', desc: '多图时图片的填充方式' },
  { key: 'indexCount', label: '目录条目', type: 'slider', def: 4, min: 2, max: 4, step: 1,
    desc: '底部目录展示的条目数' },
  { key: 'focus', label: '重点强调', type: 'toggle', def: false,
    desc: '高亮某一目录条目，弱化其余' },
  { key: 'focusIndex', label: '强调第几个', type: 'slider', def: 1, min: 1, max: 4, step: 1,
    dependsOn: 'focus', desc: '被强调条目的序号（1 起）' },
  { key: 'showKicker', label: '显示导语', type: 'toggle', def: true, desc: '显示/隐藏标题上方的小标签' },
  { key: 'showDecorations', label: '显示装饰', type: 'toggle', def: true, desc: '显示/隐藏几何装饰图形' },
];

// One idempotent, namespaced style: cover entrance. The visible end-state is
// the base style; elements are only held hidden while the root lacks `.is-in`
// (a class JS adds shortly after mount) AND the user allows motion. Because the
// persistent state is *visible*, a paused animation clock or disabled
// transitions still snap content to visible — it can never get stuck hidden.
function injectCoverAnim() {
  if (typeof document === 'undefined' || document.getElementById('sw-cover-anim')) return;
  const s = document.createElement('style');
  s.id = 'sw-cover-anim';
  s.textContent =
    '.sw-cover-anim{transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}' +
    '@media (prefers-reduced-motion:no-preference){' +
    '.sw-cover-root:not(.is-in) .sw-cover-anim{opacity:0;transform:translateY(26px)}}';
  document.head.appendChild(s);
}

function Gallery({ count, media, onMediaChange, fit, accent, placeholderHero, placeholder }) {
  if (count === 1) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <SwImageSlot value={media[0] || null} onChange={(s) => onMediaChange(0, s)}
          adaptive fit="contain" accent={accent} radius={swTheme.radius} placeholder={placeholderHero} />
      </div>
    );
  }
  const layout = count === 2
    ? { display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16, height: '100%' }
    : { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1.3fr 1fr',
        gridTemplateAreas: '"a a" "b c"', gap: 16, height: '100%' };
  const areas = ['a', 'b', 'c'];
  return (
    <div style={layout}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ gridArea: count === 3 ? areas[i] : undefined, minHeight: 0 }}>
          <SwImageSlot value={media[i] || null} onChange={(s) => onMediaChange(i, s)}
            fit={fit} accent={accent} radius={swTheme.radius} label={i + 1} placeholder={placeholder} />
        </div>
      ))}
    </div>
  );
}

export default function SwSlideManifesto(props) {
  const p = { ...defaultProps, ...props };
  const accent = p.accent;
  const items = (p.index || []).slice(0, Math.max(2, Math.min(4, p.indexCount)));
  const rootRef = React.useRef(null);
  const [entered, setEntered] = React.useState(false);
  React.useEffect(() => { injectCoverAnim(); }, []);
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

  return (
    <SlideRoot bg={C.blush} color={C.ink} className={'sw-cover-root' + (entered ? ' is-in' : '')}>
      <div ref={rootRef} data-sw-no-reveal="" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {p.showDecorations && (
        <div className="sw-cover-anim">
          <Shape kind="pentagon" size={128} color={C.green} style={{ top: 120, right: 340 }} />
          <Shape kind="ring" size={96} border={16} color={C.cyan} style={{ top: 150, right: 150 }} />
          <Shape kind="circle" size={78} color={C.magenta} style={{ top: 600, left: 566 }} />
          <Shape kind="teardrop" size={72} color="#fff" style={{ top: 606, left: 744 }} />
        </div>
      )}

      <Bar meta={p.barMeta} accent={accent} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.5fr 1fr',
        gap: 64, alignItems: 'center', padding: '6px 0', position: 'relative', zIndex: 3 }}>
        <div>
          {p.showKicker && <div className="sw-cover-anim" style={{ transitionDelay: '.06s' }}><Kicker accent={accent}>{p.kicker}</Kicker></div>}
          <h1 className="sw-cover-anim" style={{ fontWeight: 900, fontSize: T.hero, lineHeight: 1.13, letterSpacing: '-2px', marginTop: 24, transitionDelay: '.14s' }}>
            {renderSwText(p.title, { hl: { tone: 'p' } })}
          </h1>
          <div className="sw-cover-anim" style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.1em', textTransform: 'uppercase',
            color: C.inkMut, marginTop: 28, lineHeight: 1.6, transitionDelay: '.24s' }}>
            {renderSwText(p.titleEn)}
          </div>
        </div>

        {p.mediaCount > 0 ? (
          <Gallery count={p.mediaCount} media={p.media} onMediaChange={p.onMediaChange}
            fit={p.mediaFit} accent={accent} placeholderHero={p.mediaPlaceholderHero} placeholder={p.mediaPlaceholder} />
        ) : (
          <div className="sw-cover-anim" style={{ background: C.paper, borderRadius: swTheme.radius, padding: '44px 46px', alignSelf: 'center', transitionDelay: '.32s' }}>
            <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.14em', textTransform: 'uppercase',
              color: accent, marginBottom: 20 }}>{p.aboutLabel}</div>
            <p style={{ fontSize: T.body, lineHeight: 1.78, color: '#2c2528' }}>
              {renderSwText(p.aboutBody, { hl: { tone: 'o' } })}
            </p>
            <div style={{ height: 1, background: C.line, margin: '26px 0' }} />
            <p style={{ fontSize: 24, lineHeight: 1.6, color: '#54494e' }}>{p.aboutFoot}</p>
          </div>
        )}
      </div>

      <div className="sw-cover-anim" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + items.length + ',1fr)',
        borderTop: '1px solid ' + C.line2, marginTop: 30, flexShrink: 0, position: 'relative', zIndex: 3, transitionDelay: '.4s' }}>
        {items.map((it, i) => {
          const dim = p.focus && (i + 1) !== p.focusIndex;
          return (
            <div key={it.n} style={{ padding: i === 0 ? '22px 26px 2px 0' : '22px 26px 2px 30px',
              borderLeft: i === 0 ? 'none' : '1px solid ' + C.line, opacity: dim ? 0.32 : 1,
              transition: 'opacity .2s' }}>
              <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 24, letterSpacing: '.08em', color: it.c }}>{it.n}</div>
              <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: '-.5px', marginTop: 11 }}>{it.t}</div>
              <div style={{ fontFamily: F.mono, fontSize: 24, letterSpacing: '.1em', textTransform: 'uppercase',
                color: C.inkMut, marginTop: 7 }}>{it.e}</div>
              <p style={{ fontSize: 24, color: '#5a4f54', lineHeight: 1.5, marginTop: 12 }}>{it.d}</p>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 18 }}>
        <Footer page={p.page} total={p.total} accent={accent} />
      </div>
    </SlideRoot>
  );
}
