/* Slide69Tally.jsx — IGNIS deck · cumulative-total big-number page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: tallyDefaultProps (complete defaults) + tallyControls (1:1).
 *
 * Big-number page. One oversized running-total figure that bleeds off the
 * right edge, anchored by a left rail of contributing sub-figures and a
 * caption. Distinct from Headline (53, centered single number) and Triptych
 * (41, three equal stats): here a hero SUM dominates and the sub-stats explain
 * how it accrued. The unit/prefix and sub-stat count are prop-driven.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-tly .ign-frame{justify-content:space-between}
.ign-tly .b1{width:1500px;height:1100px;right:-380px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.4),rgba(226,42,12,0) 66%);filter:blur(70px)}
.ign-tly .ign-ghost{font-size:600px;left:-20px;bottom:-200px}
.ign-tly .ign-eyebrow{white-space:nowrap}
.ign-tly-body{flex:1;display:grid;grid-template-columns:0.84fr 1.16fr;gap:56px;align-items:center;margin-top:10px}
.ign-tly-l{display:flex;flex-direction:column}
.ign-tly-l h2{font-size:46px;font-weight:900;line-height:1.06;letter-spacing:-0.02em;margin-top:20px}
.ign-tly-l h2 .ign-serif{color:var(--ign-a)}
.ign-tly-l p{font-size:23px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:18px;max-width:380px;text-wrap:pretty}
.ign-tly-subs{margin-top:30px;border-top:1px solid var(--ign-hair)}
.ign-tly-sub{display:flex;align-items:baseline;justify-content:space-between;gap:18px;padding:15px 0;border-bottom:1px solid var(--ign-hair)}
.ign-tly-sub .l{font-size:23px;font-weight:400;color:var(--ign-ink2)}
.ign-tly-sub .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:-0.02em}
.ign-tly-r{position:relative;display:flex;flex-direction:column;align-items:flex-end;justify-content:center}
.ign-tly-pre{font-family:'Space Grotesk',sans-serif;font-size:30px;letter-spacing:0.06em;color:var(--ign-ink2);margin-bottom:-6px}
.ign-tly-big{display:flex;align-items:flex-start;line-height:0.8}
.ign-tly-big .n{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:440px;line-height:0.74;letter-spacing:-0.05em}
.ign-tly-big .u{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:120px;line-height:0.9;letter-spacing:-0.02em;margin-top:24px;margin-left:6px;color:var(--ign-ink)}
.ign-tly-cap{display:flex;align-items:center;gap:16px;margin-top:6px;font-family:'Space Grotesk',sans-serif;
  font-size:25px;letter-spacing:0.04em;color:var(--ign-ink2)}
.ign-tly-cap .pill{display:inline-flex;align-items:center;gap:8px;padding:7px 16px;border:1px solid var(--ign-hair2);border-radius:999px;
  font-size:21px;color:var(--ign-ink);letter-spacing:0.02em}
.ign-tly-cap .pill .dot{width:8px;height:8px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 12px var(--ign-b)}
`;

export const tallyDefaultProps = {
  surface: 'ember',
  bigNumber: '4.7',
  unit: '亿',
  prefix: '累计为客户创造增量营收',
  subStatCount: 3,
  showPrefix: true,
  showUnit: true,
  showCaption: true,
  showSubStats: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '¥',
  railText: 'Total — 累计',
  navItems: ['累计'],
  navCurrent: 0,
  ixNo: '68',
  ixLabel: 'Total',
  eyebrowNo: '累计至今',
  eyebrowEn: 'Compounded',
  headingHtml: '不是一次爆发，<br><span class="ign-ember-text">是攒出来的复利</span>。',
  bodyText: '把每一次曝光的价值留住、再投资——四年下来，它长成了一个不容忽视的数字。',
  captionText: '2,400+ 品牌 · 截至 2026 Q2',
  captionPill: '仍在累加',
  subs: [
    { l: '自然搜索增量', v: '+182%' },
    { l: '内容资产沉淀', v: '5,400 篇' },
    { l: '私域复购占比', v: '34%' },
  ],
  metaLeft: 'IGNIS — 燃点 · 累计创造增量营收',
  metaMid: '攒出来的，才拿得走',
};

export const tallyControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'subStatCount', type: 'slider', label: '辅助数据', default: 3, min: 1, max: 3, step: 1, describe: '左侧贡献分项的数量。' },
  { key: 'showPrefix', type: 'toggle', label: '数字前缀', default: true, describe: '大数字上方的口径前缀。' },
  { key: 'showUnit', type: 'toggle', label: '数字单位', default: true, describe: '大数字右侧的单位。' },
  { key: 'showCaption', type: 'toggle', label: '底部标记', default: true, describe: '大数字下方的口径与增长胶囊标记。' },
  { key: 'showSubStats', type: 'toggle', label: '辅助清单', default: true, describe: '左侧带数值的贡献分项清单。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '左栏顶部的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function TallySlide(props) {
  injectCSS('ign-tly-css', CSS);
  const p = { ...tallyDefaultProps, ...props };
  const sn = clampInt(p.subStatCount, 1, 3);
  const subs = (Array.isArray(p.subs) ? p.subs : []).slice(0, sn);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-tly">
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

        <div className="ign-tly-body">
          <div className="ign-tly-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            <p>{p.bodyText}</p>
            {p.showSubStats && (
              <div className="ign-tly-subs">
                {subs.map((s, i) => (
                  <div key={i} className="ign-tly-sub"><span className="l">{s.l}</span><span className="v">{s.v}</span></div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-tly-r ign-a2">
            {p.showPrefix && <div className="ign-tly-pre">{p.prefix}</div>}
            <div className="ign-tly-big">
              <EmberText className="n">{p.bigNumber}</EmberText>
              {p.showUnit && <span className="u">{p.unit}</span>}
            </div>
            {p.showCaption && (
              <div className="ign-tly-cap">
                <span>{p.captionText}</span>
                <span className="pill"><span className="dot" />{p.captionPill}</span>
              </div>
            )}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '83%' }} /></span> 68 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
