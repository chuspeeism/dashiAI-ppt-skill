/* Slide86CoverSplit.jsx — IGNIS deck · ALTERNATE COVER D (split panel).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: coverSplitDefaultProps (complete defaults) + coverSplitControls (1:1).
 *
 * Cover variant. A two-column split cover: a left headline column over a
 * heat-glow field, divided by a hairline from a right panel that carries either
 * a stacked set of hero metrics OR an optional full-height image slot. Distinct
 * from editorial (A), photo hero (B) and big-type (C) — the structured,
 * asymmetric opener. Right slot adapts to upload; 0 images = metric stack.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cvs .ign-frame{padding:0;z-index:6}
.ign-cvs-grid{position:absolute;inset:0;z-index:5;display:grid;grid-template-columns:1.18fr 0.82fr}
.ign-cvs-l{position:relative;padding:76px 72px 66px 128px;display:flex;flex-direction:column;justify-content:space-between}
.ign-cvs-l .b1{position:absolute;width:980px;height:760px;left:-220px;top:54%;transform:translateY(-50%);z-index:0;
  pointer-events:none;opacity:var(--ign-glow);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,150,70,0.42),rgba(255,90,35,0) 72%),
  radial-gradient(60% 60% at 46% 56%,rgba(226,42,12,0.34),rgba(120,20,8,0) 76%);filter:blur(44px)}
.ign-cvs-l > *{position:relative;z-index:1}
.ign-cvs-r{position:relative;border-left:1px solid var(--ign-hair2);padding:76px 100px 66px 72px;
  display:flex;flex-direction:column;justify-content:center;background:var(--ign-panel)}
.ign-cvs-kick{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.26em;text-transform:uppercase;color:var(--ign-ink2)}
.ign-cvs-kick .dot{width:9px;height:9px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 14px var(--ign-b)}
.ign-cvs-h{font-size:130px;font-weight:900;line-height:1.36;letter-spacing:-0.045em}
.ign-cvs-h .row{display:block;white-space:nowrap}
.ign-cvs-h em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400}
.ign-cvs-lede{margin-top:30px;font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:36px;
  color:var(--ign-ink2);max-width:660px;line-height:1.34;text-wrap:pretty}
.ign-cvs-lede b{font-style:normal;font-weight:500;color:var(--ign-ink)}
.ign-cvs-foot{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.18em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-cvs-foot .ar{font-size:28px;color:var(--ign-a)}
.ign-cvs-rcap{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--ign-ink3);margin-bottom:36px}
.ign-cvs-stat{padding:30px 0;border-top:1px solid var(--ign-hair)}
.ign-cvs-stat:first-of-type{border-top:none;padding-top:0}
.ign-cvs-stat:last-of-type{padding-bottom:0}
.ign-cvs-stat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:84px;line-height:0.84;letter-spacing:-0.03em}
.ign-cvs-stat .l{font-size:25px;font-weight:300;color:var(--ign-ink2);margin-top:16px;letter-spacing:0.01em}
.ign-cvs-img{width:100%;height:100%}
.ign-cvs-img .ign-imgslot{width:100%;height:100%}
`;

export const coverSplitDefaultProps = {
  surface: 'ink',
  showKicker: true,
  showLede: true,
  showArrow: true,
  statCount: 3,
  imageCount: 0,
  images: [],
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: 'IG',
  kickerText: '现接受 2026 Q3 增长合作',
  headlineHtml: '<span class="row">排名<span class="ign-ember-text">更高</span></span><span class="row">转化<em>更强</em></span>',
  ledeHtml: '把搜索、内容与投放，拧成<b>一股力</b>——让曝光换成实际增长。',
  arrowText: 'Capabilities Deck · 2026',
  imagePlaceholder: '封面满栏图 · 竖构图',
  ribbonCap: '成绩单 · 截至 2026',
  stats: [
    { v: '2,400+', l: '服务品牌' },
    { v: '3.8×', l: '平均转化率提升' },
    { v: '14 天', l: '首次见效周期' },
  ],
};

export const coverSplitControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '左栏标题上方的状态小标。' },
  { key: 'showLede', type: 'toggle', label: '衬线引言', default: true, describe: '左栏标题下方的衬线引言。' },
  { key: 'showArrow', type: 'toggle', label: '翻页箭头', default: true, describe: '左栏底部的箭头母题与提示。' },
  { key: 'imageCount', type: 'slider', label: '图片槽数量', default: 0, min: 0, max: 1, step: 1, describe: '右栏图片槽数量：0 = 呈现指标堆叠，1 = 呈现一张满栏图。' },
  { key: 'statCount', type: 'slider', label: '指标数量', default: 3, min: 2, max: 3, step: 1, describe: '右栏指标堆叠的条目数量（仅图片槽数量为 0 时）。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '左栏的超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function CoverSplitSlide(props) {
  injectCSS('ign-cvs-css', CSS);
  const p = { ...coverSplitDefaultProps, ...props };
  const images = Array.isArray(p.images) ? p.images : [];
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, clampInt(p.statCount, 2, 3));
  const useImage = clampInt(p.imageCount, 0, 1) > 0;

  return (
    <Slide surface={p.surface} className="ign-cvs">
      <Grain /><Edge />
      {p.showScaffold && <Rail>AI Growth Engine — 燃点</Rail>}
      {p.showScaffold && <Corners />}

      <div className="ign-cvs-grid">
        <div className="ign-cvs-l">
          <span className="b1" />
          {p.showGhostMark && <Ghost style={{ fontSize: 300, right: 40, bottom: 40 }}>{p.ghostMark}</Ghost>}
          <header className="ign-util" style={{ gridTemplateColumns: '1fr', justifyItems: 'start' }}>
            <Wordmark />
          </header>

          <div>
            {p.showKicker && (
              <div className="ign-cvs-kick ign-a1"><span className="dot" />{p.kickerText}</div>
            )}
            <h1 className="ign-cvs-h ign-a2" style={{ marginTop: p.showKicker ? 28 : 0 }} dangerouslySetInnerHTML={{ __html: p.headlineHtml }} />
            {p.showLede && (
              <p className="ign-cvs-lede ign-a3" dangerouslySetInnerHTML={{ __html: p.ledeHtml }} />
            )}
          </div>

          {p.showArrow
            ? <div className="ign-cvs-foot ign-a3">{p.arrowText} <span className="ar">→</span></div>
            : <span />}
        </div>

        <div className="ign-cvs-r ign-a2">
          {useImage ? (
            <div className="ign-cvs-img"><ImageSlot src={images[0]} placeholder={p.imagePlaceholder} mode="fill" height="100%" radius={4} /></div>
          ) : (
            <>
              <div className="ign-cvs-rcap">{p.ribbonCap}</div>
              {stats.map((s, i) => (
                <div key={i} className="ign-cvs-stat">
                  <EmberText className="v">{s.v}</EmberText>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Slide>
  );
}
