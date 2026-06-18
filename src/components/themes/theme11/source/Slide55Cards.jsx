/* Slide55Cards.jsx — IGNIS deck · three-up case-card image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: cardsDefaultProps (complete defaults) + cardsControls (1:1).
 *
 * Image page. 2–3 equal case cards in a row, each pairing an adaptive image
 * slot with a client name, a one-line result and a headline metric. Distinct
 * from Gallery (18, free 0–4) and Mosaic (37, collage) — this is the deck's
 * structured, metric-anchored case row. Image slots adapt to uploads; 0 images
 * falls back to striped placeholders so composition stays balanced.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cd .ign-frame{justify-content:space-between}
.ign-cd .b1{width:1400px;height:760px;left:50%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.22),rgba(226,42,12,0) 70%);filter:blur(58px)}
.ign-cd .ign-ghost{font-size:520px;left:20px;bottom:-120px}
.ign-cd-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:26px}
.ign-cd-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-cd-head h2 .ign-serif{color:var(--ign-a)}
.ign-cd-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:25px;color:var(--ign-ink3);text-align:right;max-width:340px;line-height:1.4}
.ign-cd-row{flex:1;display:grid;gap:36px;align-items:stretch;margin-top:30px}
.ign-cd-card{display:flex;flex-direction:column;min-width:0;min-height:0}
.ign-cd-media{flex:1;min-height:0}
.ign-cd-media .ign-imgslot{width:100%;height:100%;aspect-ratio:auto}
.ign-cd-meta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:22px}
.ign-cd-meta .nm{font-size:30px;font-weight:700;letter-spacing:-0.01em}
.ign-cd-meta .cat{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
.ign-cd-res{font-size:24px;font-weight:300;line-height:1.45;color:var(--ign-ink2);margin-top:14px;text-wrap:pretty}
.ign-cd-stat{display:flex;align-items:baseline;gap:14px;margin-top:auto;padding-top:22px;border-top:1px solid var(--ign-hair)}
.ign-cd-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:54px;line-height:0.86;letter-spacing:-0.03em}
.ign-cd-stat .l{font-size:22px;font-weight:300;color:var(--ign-ink2)}
.ign-cd-card.dim{opacity:0.34;filter:saturate(0.5)}
`;

export const cardsDefaultProps = {
  surface: 'paper',
  cardCount: 3,
  images: [],
  showMetric: true,
  showResult: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '★',
  railText: 'Cases — 案例集',
  navItems: ['案例集'],
  navCurrent: 0,
  ixNo: '54',
  ixLabel: 'Cases',
  eyebrowNo: '案例集',
  eyebrowEn: 'Selected work',
  headingHtml: '不同行业，<span class="ign-ember-text">同一种增长</span>。',
  noteHtml: '硬件、连锁、SaaS——<br>路径一致，结果可复制。',
  cards: [
    { nm: 'VOLT 电动', cat: 'DTC 硬件', res: '主落地页重排 + 投放提效，14 天进线翻倍。', v: '×3.8', l: '转化率' },
    { nm: '桥本生活', cat: '本地连锁', res: '本地 SEO 与内容矩阵双轮，门店进店稳步上扬。', v: '+182%', l: '自然进线' },
    { nm: 'Nimbus SaaS', cat: 'B2B 软件', res: '重建获客漏斗，把试用转付费的链路拉直。', v: '−41%', l: '获客成本' },
  ],
  metaLeft: 'IGNIS — 燃点 · 精选客户案例',
  metaMid: '能复制的，才叫方法',
};

export const cardsControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'cardCount', type: 'slider', label: '卡片数量', default: 3, min: 2, max: 3, step: 1, describe: '并列案例卡的数量。' },
  { key: 'showMetric', type: 'toggle', label: '成果数字', default: true, describe: '每张卡底部的成果数字。' },
  { key: 'showResult', type: 'toggle', label: '成果描述', default: true, describe: '每张卡的一句话成果描述。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一张卡，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的卡片序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function CardsSlide(props) {
  injectCSS('ign-cd-css', CSS);
  const p = { ...cardsDefaultProps, ...props };
  const cc = clampInt(p.cardCount, 2, 3);
  const cards = (Array.isArray(p.cards) ? p.cards : []).slice(0, cc);
  const images = Array.isArray(p.images) ? p.images : [];
  const emi = clampInt(p.emphasisIndex, 0, cc - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-cd">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-cd-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-cd-row ign-a2" style={{ gridTemplateColumns: `repeat(${cc}, 1fr)` }}>
          {cards.map((c, i) => (
            <div key={i} className={`ign-cd-card ${p.emphasis && i !== emi ? 'dim' : ''}`}>
              <div className="ign-cd-media">
                <ImageSlot src={images[i]} placeholder={`案例 ${i + 1}`} mode="fill" radius={5} />
              </div>
              <div className="ign-cd-meta"><span className="nm">{c.nm}</span><span className="cat">{c.cat}</span></div>
              {p.showResult && <div className="ign-cd-res">{c.res}</div>}
              {p.showMetric && (
                <div className="ign-cd-stat"><EmberText className="v">{c.v}</EmberText><span className="l">{c.l}</span></div>
              )}
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '66%' }} /></span> 54 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
