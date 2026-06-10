/* Slide62Masthead.jsx — IGNIS deck · full-bleed magazine-cover image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: mastheadDefaultProps (complete defaults) + mastheadControls (1:1).
 *
 * Image page. ONE full-bleed image behind an editorial magazine cover: a giant
 * masthead across the top, an issue/credit line, and a stack of teaser cover-
 * lines down one side. Distinct from Hero (52, bottom metric strip) and
 * Showcase (20, panel overlay) — this is the deck's cover-of-the-magazine
 * treatment. Slot adapts to upload (cover-fill); 0 images = striped placeholder.
 */
import { Slide, Grain, Edge, Ghost, Frame, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-mh{position:absolute;inset:0}
.ign-mh-img{position:absolute;inset:0;z-index:0}
.ign-mh-img .ign-imgslot{width:100%;height:100%;border-radius:0}
.ign-mh-img .ign-imgslot img,.ign-mh-img .ign-imgslot-ph{border-radius:0}
.ign-mh-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(180deg,rgba(8,5,3,0.62) 0%,rgba(8,5,3,0.12) 26%,rgba(8,5,3,0.16) 60%,rgba(8,5,3,0.74) 100%)}
.ign-mh-scrim.side{background:linear-gradient(180deg,rgba(8,5,3,0.62),rgba(8,5,3,0.1) 24%),linear-gradient(270deg,rgba(8,5,3,0.66) 0%,rgba(8,5,3,0) 46%)}
.ign-mh .ign-grain,.ign-mh .ign-edge{z-index:2}
.ign-mh .ign-ghost{z-index:1;font-size:560px;left:-10px;bottom:-180px;color:rgba(255,255,255,0.05)}
.ign-mh-frame{position:absolute;inset:0;z-index:5;padding:64px 92px 60px;display:flex;flex-direction:column;color:#F6EFE6}
.ign-mh-top{display:flex;align-items:center;justify-content:space-between;font-family:'Space Grotesk',sans-serif;
  font-size:21px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(246,239,230,0.72)}
.ign-mh-mast{font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-0.04em;line-height:0.82;
  font-size:228px;margin-top:6px}
.ign-mh-mast em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;letter-spacing:-0.01em}
.ign-mh-issue{display:flex;align-items:center;gap:18px;margin-top:18px;font-family:'Space Grotesk',sans-serif;
  font-size:22px;letter-spacing:0.06em;color:rgba(246,239,230,0.82)}
.ign-mh-issue .bar{width:42px;height:1px;background:rgba(246,239,230,0.5)}
.ign-mh-spacer{flex:1}
.ign-mh-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:48px}
.ign-mh-deck{font-size:46px;font-weight:300;line-height:1.12;letter-spacing:-0.02em;max-width:760px;text-wrap:pretty}
.ign-mh-deck b{font-weight:700}
.ign-mh-lines{display:flex;flex-direction:column;gap:14px;align-items:flex-end;text-align:right;max-width:420px}
.ign-mh-line{display:flex;align-items:baseline;gap:14px;justify-content:flex-end}
.ign-mh-line .k{font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.14em;color:var(--ign-a);white-space:nowrap}
.ign-mh-line .t{font-size:25px;font-weight:500;line-height:1.2}
.ign-mh-bc{display:flex;align-items:flex-end;gap:3px;height:34px;margin-top:8px}
.ign-mh-bc i{display:block;width:3px;background:rgba(246,239,230,0.85)}
`;

export const mastheadDefaultProps = {
  surface: 'ink',
  images: [],
  showMast: true,
  showIssue: true,
  showDeck: true,
  showLines: true,
  lineCount: 4,
  showBarcode: true,
  showScrim: true,
  showGhostMark: true,
  showMeta: true,
  ghostMark: '★',
  imagePlaceholder: '封面满铺大图',
  topLeft: 'IGNIS QUARTERLY · 增长志',
  topRight: '第 04 期 · 2026 春',
  mastHtml: '燃<em>点</em>',
  issueSegs: ['AI 增长引擎', 'The growth issue', '¥0 · 免费阅'],
  deckHtml: '把营销，<br>做成<b>一台会复利的增长机器</b>。',
  lines: [
    { k: 'P.182', t: '一年增长 182% 的复盘' },
    { k: 'P.58', t: '把流量买回来，不如长出来' },
    { k: 'P.24', t: '14 天见效的接入手册' },
    { k: 'P.09', t: '为什么自然资产是底盘' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长志封面',
};

export const mastheadControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showMast', type: 'toggle', label: '刊头', default: true, describe: '顶部超大刊头字。' },
  { key: 'showIssue', type: 'toggle', label: '刊期行', default: true, describe: '刊头下方的刊期与署名行。' },
  { key: 'showDeck', type: 'toggle', label: '主标语', default: true, describe: '底部的大号封面主标语。' },
  { key: 'showLines', type: 'toggle', label: '导读条目', default: true, describe: '右下角的封面导读条目列表。' },
  { key: 'lineCount', type: 'slider', label: '导读数量', default: 4, min: 2, max: 4, step: 1, describe: '封面导读条目的数量。' },
  { key: 'showBarcode', type: 'toggle', label: '条码装饰', default: true, describe: '杂志封面式的条码装饰。' },
  { key: 'showScrim', type: 'toggle', label: '压暗叠层', default: true, describe: '图上的压暗渐变，保证文字可读。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息（融入封面，简化呈现）。' },
];

export default function MastheadSlide(props) {
  injectCSS('ign-mh-css', CSS);
  const p = { ...mastheadDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const ln = clampInt(p.lineCount, 2, 4);
  const lines = (Array.isArray(p.lines) ? p.lines : []).slice(0, ln);
  const issueSegs = Array.isArray(p.issueSegs) ? p.issueSegs : [];
  const bars = [10, 4, 7, 3, 12, 5, 8, 4, 11, 6, 3, 9, 5, 7];

  return (
    <Slide surface={p.surface} className="ign-mh">
      <div className="ign-mh-img"><ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" height="100%" radius={0} /></div>
      {p.showScrim && <div className={`ign-mh-scrim ${p.showLines ? 'side' : ''}`} />}
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}

      <div className="ign-mh-frame">
        <div className="ign-mh-top ign-a1">
          <span>{p.topLeft}</span>
          <span>{p.topRight}</span>
        </div>

        {p.showMast && <div className="ign-mh-mast ign-a1" dangerouslySetInnerHTML={{ __html: p.mastHtml }} />}
        {p.showIssue && (
          <div className="ign-mh-issue ign-a2">
            {issueSegs.map((sg, i) => (<React.Fragment key={i}>{i > 0 && <span className="bar" />}<span>{sg}</span></React.Fragment>))}
          </div>
        )}

        <div className="ign-mh-spacer" />

        <div className="ign-mh-bottom ign-a3">
          {p.showDeck && (
            <div className="ign-mh-deck" dangerouslySetInnerHTML={{ __html: p.deckHtml }} />
          )}
          {p.showLines && (
            <div className="ign-mh-lines">
              {lines.map((l, i) => (
                <div key={i} className="ign-mh-line"><span className="k">{l.k}</span><span className="t">{l.t}</span></div>
              ))}
              {p.showBarcode && <div className="ign-mh-bc">{bars.map((h, i) => <i key={i} style={{ height: h * 2.4 }} />)}</div>}
            </div>
          )}
        </div>

        {p.showMeta && (
          <div className="ign-mh-top" style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(246,239,230,0.18)' }}>
            <span>{p.metaLeft}</span>
            <span>61 / 82</span>
          </div>
        )}
      </div>
    </Slide>
  );
}
