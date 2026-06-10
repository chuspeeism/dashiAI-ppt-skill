/* Slide76Waffle.jsx — IGNIS deck · waffle (10×10) composition chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: waffleDefaultProps (complete defaults) + waffleControls (1:1).
 *
 * Chart page. A 100-cell waffle grid where each category fills cells in
 * proportion to its share — percentages you can literally count. Distinct from
 * Mix (14, donut/bars), Treemap (56, area) and Pyramid (59): the waffle reads
 * as "X out of 100". Lead category is rendered ember.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-waf .ign-frame{justify-content:space-between}
.ign-waf .b1{width:1120px;height:900px;right:-200px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-waf .ign-ghost{font-size:540px;left:-10px;bottom:-160px}
.ign-waf-body{flex:1;display:grid;grid-template-columns:1.02fr 0.98fr;gap:72px;align-items:center;margin-top:8px}
.ign-waf .ign-eyebrow{white-space:nowrap}
.ign-waf-l .ign-eyebrow{margin-bottom:22px}
.ign-waf-l h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-waf-l h2 .ign-serif{color:var(--ign-a)}
.ign-waf-l p{font-size:23px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:20px;max-width:420px;text-wrap:pretty}
.ign-waf-keys{margin-top:30px;border-top:1px solid var(--ign-hair)}
.ign-waf-key{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid var(--ign-hair)}
.ign-waf-key .sw{width:15px;height:15px;border-radius:4px}
.ign-waf-key .nm{font-size:24px;font-weight:500}
.ign-waf-key .pc{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:27px;letter-spacing:-0.01em}
.ign-waf-key.dim{opacity:0.36;filter:saturate(0.5)}
.ign-waf-grid{display:grid;grid-template-columns:repeat(10,1fr);grid-template-rows:repeat(10,1fr);gap:9px;aspect-ratio:1;
  width:100%;max-width:560px;margin:0 auto}
.ign-waf-cell{border-radius:4px;background:var(--ign-hair);transition:none}
`;

export const waffleDefaultProps = {
  surface: 'paper',
  categoryCount: 5,
  emphasis: true,
  emphasisIndex: 0,
  showLegend: true,
  showValues: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '▥',
  railText: 'Waffle — 构成',
  navItems: ['构成'],
  navCurrent: 0,
  ixNo: '75',
  ixLabel: 'Waffle',
  eyebrowNo: '流量构成',
  eyebrowEn: 'Out of 100',
  headingHtml: '每 100 次进线，<br><span class="ign-ember-text">这样分布</span>。',
  lede: '把占比摊成 100 格——一眼能数清，谁在真正供血。',
  cats: [
    { nm: '自然搜索', share: 38, tone: 'lead' },
    { nm: '内容矩阵', share: 24, tone: 'rgba(255,110,46,0.5)' },
    { nm: '私域复购', share: 18, tone: 'rgba(255,110,46,0.3)' },
    { nm: '社媒互动', share: 12, tone: 'rgba(255,110,46,0.18)' },
    { nm: '付费投放', share: 8, tone: 'rgba(255,110,46,0.1)' },
  ],
  metaLeft: 'IGNIS — 燃点 · 进线构成（每 100 次）',
  metaMid: '数得清，才算看明白',
};

export const waffleControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'categoryCount', type: 'slider', label: '类别数量', default: 5, min: 2, max: 5, step: 1, describe: '构成类别数量（剩余补为「其他」灰格）。' },
  { key: 'emphasis', type: 'toggle', label: '首类突出', default: true, describe: '开启后占比最大的类别点亮为暖橙，图例其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的类别序号（从 0 起）。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '左侧带占比的图例清单。' },
  { key: 'showValues', type: 'toggle', label: '占比数值', default: true, describe: '图例右侧的百分比数值。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function WaffleSlide(props) {
  injectCSS('ign-waf-css', CSS);
  const p = { ...waffleDefaultProps, ...props };
  const n = clampInt(p.categoryCount, 2, 5);
  const cats = (Array.isArray(p.cats) ? p.cats : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const leadFill = 'linear-gradient(135deg,#FFC07A,#FF6E2E 55%,#E22A0C)';
  const fillOf = (i) => cats[i].tone === 'lead' ? leadFill : cats[i].tone;

  // assign 100 cells by cumulative share (row-major), remainder = neutral
  const cells = [];
  let idx = 0;
  cats.forEach((c, ci) => { for (let k = 0; k < c.share && idx < 100; k++, idx++) cells.push(ci); });
  while (idx < 100) { cells.push(-1); idx++; }

  return (
    <Slide surface={p.surface} className="ign-waf">
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

        <div className="ign-waf-body">
          <div className="ign-waf-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showLegend && (
              <div className="ign-waf-keys">
                {cats.map((c, i) => (
                  <div key={i} className={`ign-waf-key ${p.emphasis && i !== emi ? 'dim' : ''}`}>
                    <span className="sw" style={{ background: fillOf(i) }} />
                    <span className="nm">{c.nm}</span>
                    {p.showValues && (i === 0
                      ? <EmberText className="pc">{c.share}%</EmberText>
                      : <span className="pc" style={{ color: 'var(--ign-ink2)' }}>{c.share}%</span>)}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-waf-grid ign-a2">
            {cells.map((ci, k) => (
              <span key={k} className="ign-waf-cell"
                style={ci >= 0 ? { background: fillOf(ci), opacity: (p.emphasis && ci !== emi) ? 0.5 : 1 } : undefined} />
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '91%' }} /></span> 75 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
