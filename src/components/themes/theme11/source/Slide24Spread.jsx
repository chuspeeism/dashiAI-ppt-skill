/* Slide24Spread.jsx — IGNIS deck · editorial image-spread page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: spreadDefaultProps (complete defaults) + spreadControls (1:1).
 *
 * Image page. A magazine-style offset collage: a primary image plus a smaller
 * image overlapping its corner, paired with a numbered editorial column.
 * Distinct from full-bleed Showcase and grid Gallery — this one is a layered
 * composition with whitespace and captions.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-spr .ign-frame{justify-content:space-between}
.ign-spr .b1{width:1080px;height:1080px;left:-260px;bottom:-260px;
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.38),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-spr .ign-ghost{font-size:600px;right:20px;top:-130px}
.ign-spr-body{flex:1;display:grid;grid-template-columns:1.04fr 1.16fr;gap:80px;align-items:center;margin-top:6px}
.ign-spr-txt .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-spr-txt h2{font-size:78px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-spr-txt h2 .ign-serif{color:var(--ign-a)}
.ign-spr-txt p{font-size:25px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:26px;max-width:480px;text-wrap:pretty}
.ign-spr-pts{margin-top:34px;display:flex;flex-direction:column;border-top:1px solid var(--ign-hair)}
.ign-spr-pt{display:flex;align-items:baseline;gap:22px;padding:18px 0;border-bottom:1px solid var(--ign-hair)}
.ign-spr-pt .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:26px;letter-spacing:0.04em;color:var(--ign-a);min-width:42px}
.ign-spr-pt .t{font-size:26px;font-weight:600}
.ign-spr-pt .d{font-size:22px;font-weight:300;color:var(--ign-ink3);margin-left:auto;text-align:right;max-width:260px}
.ign-spr-col{position:relative;height:680px}
.ign-spr-primary{position:absolute;right:0;top:8px;width:548px}
.ign-spr-secondary{position:absolute;left:0;bottom:24px;width:330px;z-index:3}
.ign-spr-secondary .ign-imgslot{box-shadow:0 30px 70px rgba(0,0,0,0.5)}
.ign-spr-frame{position:relative;border:1px solid var(--ign-hair2);padding:9px;background:var(--ign-panel)}
.ign-spr-frame.accent{border-color:rgba(255,160,100,0.5)}
.ign-spr-tag{position:absolute;top:18px;left:18px;z-index:4;font-family:'Space Grotesk',sans-serif;font-size:19px;
  letter-spacing:0.14em;text-transform:uppercase;color:#F4EEE6;background:rgba(8,5,4,0.6);backdrop-filter:blur(4px);padding:7px 13px}
.ign-spr-num{position:absolute;right:-6px;bottom:-58px;font-family:'Space Grotesk',sans-serif;font-weight:500;
  font-size:150px;line-height:0.7;letter-spacing:-0.04em;color:transparent;background:var(--ign-ember);-webkit-background-clip:text;background-clip:text;z-index:1}
`;

export const spreadDefaultProps = {
  surface: 'ink',
  imageCount: 2,
  images: [],
  showPoints: true,
  pointCount: 3,
  showCaptions: true,
  showNumber: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '图辑',
  railText: 'Spread — 镜像',
  navItems: ['图辑'],
  navCurrent: 0,
  ixNo: '12',
  ixLabel: 'Spread',
  lead: 'Before & after.',
  headingHtml: '一次改版，<br><span class="ign-ember-text">三层重排</span>。',
  bodyText: '我们不只是换皮。从前台体验、后台结构到增长闭环，三层同时重排，结果才立得住。',
  primaryTag: '改版后 · After',
  secondaryTag: '改版前 · Before',
  primaryPlaceholder: '主图 · 改版后',
  secondaryPlaceholder: '叠加小图',
  decoNumber: '02',
  pts: [
    { t: '前台体验', d: '从首屏到结算的视觉与节奏' },
    { t: '后台结构', d: '信息架构与可维护性重排' },
    { t: '增长闭环', d: '投放、落地与复购的衔接' },
  ],
  metaLeft: 'IGNIS — 燃点 · 改版图辑',
  metaMid: '换皮没用，换路径才行',
};

export const spreadControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'imageCount', type: 'slider', label: '图片数量', default: 2, min: 0, max: 2, step: 1, describe: '拼贴图片槽数量：0 占位、1 单图、2 主图+叠加小图。' },
  { key: 'showPoints', type: 'toggle', label: '要点清单', default: true, describe: '左侧编号要点清单。' },
  { key: 'pointCount', type: 'slider', label: '要点数量', default: 3, min: 2, max: 3, step: 1, describe: '编号要点的条目数量。' },
  { key: 'showCaptions', type: 'toggle', label: '图片标签', default: true, describe: '图片角标分类标签。' },
  { key: 'showNumber', type: 'toggle', label: '装饰编号', default: true, describe: '拼贴角落的大号装饰编号。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SpreadSlide(props) {
  injectCSS('ign-spr-css', CSS);
  const p = { ...spreadDefaultProps, ...props };
  const count = clampInt(p.imageCount, 0, 2);
  const imgs = Array.isArray(p.images) ? p.images : [];
  const pts = (Array.isArray(p.pts) ? p.pts : []).slice(0, clampInt(p.pointCount, 2, 3));
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-spr">
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

        <div className="ign-spr-body">
          <div className="ign-spr-txt ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            <p>{p.bodyText}</p>
            {p.showPoints && (
              <div className="ign-spr-pts">
                {pts.map((m, i) => (
                  <div key={i} className="ign-spr-pt">
                    <span className="no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t">{m.t}</span>
                    <span className="d">{m.d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-spr-col ign-a2">
            <div className="ign-spr-primary">
              <div className="ign-spr-frame">
                {p.showCaptions && <span className="ign-spr-tag">{p.primaryTag}</span>}
                <ImageSlot src={count >= 1 ? imgs[0] : undefined} mode="ratio" placeholder={p.primaryPlaceholder} />
              </div>
              {p.showNumber && <span className="ign-spr-num">{p.decoNumber}</span>}
            </div>
            {count >= 2 && (
              <div className="ign-spr-secondary">
                <div className="ign-spr-frame accent">
                  {p.showCaptions && <span className="ign-spr-tag">{p.secondaryTag}</span>}
                  <ImageSlot src={imgs[1]} mode="fill" height={232} radius={2} placeholder={p.secondaryPlaceholder} />
                </div>
              </div>
            )}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '22%' }} /></span> 18 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
