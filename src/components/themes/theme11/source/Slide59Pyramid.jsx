/* Slide59Pyramid.jsx — IGNIS deck · layered value-pyramid chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: pyramidDefaultProps (complete defaults) + pyramidControls (1:1).
 *
 * Chart page. Growth-maturity rendered as a stacked pyramid of trapezoid
 * bands — apex (profit) on top, foundation (data) at base, width encoding the
 * size of each layer. Distinct from Funnel (21, downward conversion) and
 * Treemap (56, area share) — this is the deck's only hierarchy pyramid, read
 * bottom-up as a value ladder.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-pyr .ign-frame{justify-content:space-between}
.ign-pyr .b1{width:1180px;height:1180px;right:-280px;top:52%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.28),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-pyr .ign-ghost{font-size:560px;left:0;bottom:-170px}
.ign-pyr-body{flex:1;display:grid;grid-template-columns:0.86fr 1.24fr;gap:64px;align-items:center;margin-top:16px}
.ign-pyr-l .ign-eyebrow{margin-bottom:22px}
.ign-pyr-l h2{font-size:60px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-pyr-l h2 .ign-serif{color:var(--ign-a)}
.ign-pyr-l p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:22px;max-width:420px;text-wrap:pretty}
.ign-pyr-keys{margin-top:30px;border-top:1px solid var(--ign-hair)}
.ign-pyr-key{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid var(--ign-hair)}
.ign-pyr-key .sw{width:13px;height:13px;border-radius:3px;align-self:center}
.ign-pyr-key .nm{font-size:24px;font-weight:500}
.ign-pyr-key .pc{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:26px;letter-spacing:-0.01em}
.ign-pyr-key.dim{opacity:0.34;filter:saturate(0.5)}
.ign-pyr-plot{position:relative;width:100%;display:flex;flex-direction:column;gap:8px}
.ign-pyr-band{position:relative;height:96px;display:flex;align-items:center;justify-content:center}
.ign-pyr-shape{position:absolute;inset:0;border:1px solid var(--ign-hair2)}
.ign-pyr-band.lead .ign-pyr-shape{border:1px solid #E22A0C}
.ign-pyr-txt{position:relative;z-index:2;display:flex;align-items:baseline;gap:14px}
.ign-pyr-txt .nm{font-size:27px;font-weight:700;letter-spacing:-0.01em;color:var(--ign-ink)}
.ign-pyr-band.lead .ign-pyr-txt .nm{color:#1B1108}
.ign-pyr-txt .vv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:24px;color:var(--ign-ink2)}
.ign-pyr-band.lead .ign-pyr-txt .vv{color:rgba(27,17,8,0.72)}
.ign-pyr-band.dim{opacity:0.3}
.ign-pyr-axis{position:absolute;left:0;right:0;display:flex;justify-content:flex-end;
  font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.04em;color:var(--ign-ink3);pointer-events:none}
.ign-pyr-axis.top{top:-40px}
.ign-pyr-axis.bot{bottom:-40px}
.ign-pyr-axis span{white-space:nowrap}
`;

/* base = foundation (widest, bottom) … apex = profit (narrowest, top).
 * Listed apex-first so index 0 is the lead/top layer. */
export const pyramidDefaultProps = {
  surface: 'ink',
  layerCount: 5,
  emphasis: false,
  emphasisIndex: 0,
  showValues: true,
  showKeys: true,
  showAxis: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '▲',
  railText: 'Pyramid — 层级',
  navItems: ['层级'],
  navCurrent: 0,
  ixNo: '58',
  ixLabel: 'Pyramid',
  eyebrowNo: '层级',
  eyebrowEn: 'The growth stack',
  headingHtml: '越往上越值钱，<br><span class="ign-ember-text">越往下越扎实</span>。',
  lede: '增长不是单点爆发，是一层托一层——地基稳，复利才滚得起来。',
  axisTop: '↑ 价值 / 利润',
  axisBot: '↓ 体量 / 流量',
  layers: [
    { nm: '利润复利', vv: '复利层', share: 8 },
    { nm: '转化系统', vv: '收口层', share: 16 },
    { nm: '自然流量', vv: '增长层', share: 24 },
    { nm: '内容资产', vv: '沉淀层', share: 28 },
    { nm: '数据地基', vv: '地基层', share: 36 },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长价值栈',
  metaMid: '尖顶赚钱，底盘抗摔',
};

export const pyramidControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'layerCount', type: 'slider', label: '层级数量', default: 5, min: 3, max: 5, step: 1, describe: '金字塔的分层数量（自顶向下）。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一层，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的层级序号（0 = 顶层）。' },
  { key: 'showValues', type: 'toggle', label: '层级标注', default: true, describe: '每层名称右侧的层位标注。' },
  { key: 'showKeys', type: 'toggle', label: '占比图例', default: true, describe: '左侧带占比的图例清单。' },
  { key: 'showAxis', type: 'toggle', label: '方向轴标', default: true, describe: '金字塔右侧的「价值 / 体量」方向标注。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PyramidSlide(props) {
  injectCSS('ign-pyr-css', CSS);
  const p = { ...pyramidDefaultProps, ...props };
  const n = clampInt(p.layerCount, 3, 5);
  const layers = (Array.isArray(p.layers) ? p.layers : []).slice(0, n);
  const sum = layers.reduce((s, l) => s + l.share, 0);
  const items = layers.map((l, i) => ({ ...l, i, pct: Math.round((l.share / sum) * 100) }));
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  const APEX = 18, BASE = 100; // top/bottom width % of plot
  const widthAt = (t) => APEX + (BASE - APEX) * t; // t 0=top,1=bottom
  const tone = ['url(#x)', 'rgba(255,110,46,0.26)', 'rgba(255,110,46,0.17)', 'rgba(255,110,46,0.10)', 'rgba(255,110,46,0.055)'];

  return (
    <Slide surface={p.surface} className="ign-pyr">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav className="ign-nav">{(Array.isArray(p.navItems) ? p.navItems : []).map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className="ign-pyr-body">
          <div className="ign-pyr-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showKeys && (
              <div className="ign-pyr-keys">
                {items.map((it) => (
                  <div key={it.i} className={`ign-pyr-key ${p.emphasis && it.i !== emi ? 'dim' : ''}`}>
                    <span className="sw" style={{ background: it.i === 0 ? 'linear-gradient(135deg,#FFC07A,#E22A0C)' : tone[it.i], border: it.i === 0 ? 'none' : '1px solid var(--ign-hair2)' }} />
                    <span className="nm">{it.nm}</span>
                    {it.i === 0 ? <EmberText className="pc">{it.pct}%</EmberText> : <span className="pc" style={{ color: 'var(--ign-ink2)' }}>{it.pct}%</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-pyr-plot ign-a2" style={{ position: 'relative' }}>
            {items.map((it) => {
              const t0 = it.i / n, t1 = (it.i + 1) / n;
              const wTop = widthAt(t0), wBot = widthAt(t1);
              const clip = `polygon(${(100 - wTop) / 2}% 0, ${(100 + wTop) / 2}% 0, ${(100 + wBot) / 2}% 100%, ${(100 - wBot) / 2}% 100%)`;
              const lit = !p.emphasis || it.i === emi;
              const fill = it.i === 0 ? 'linear-gradient(120deg,#FFC07A,#FF6E2E 52%,#E22A0C)' : tone[it.i];
              return (
                <div key={it.i} className={`ign-pyr-band ${it.i === 0 ? 'lead' : ''} ${lit ? '' : 'dim'}`}>
                  <div className="ign-pyr-shape" style={{ clipPath: clip, background: fill, borderColor: it.i === 0 ? '#E22A0C' : 'var(--ign-hair2)' }} />
                  <div className="ign-pyr-txt">
                    <span className="nm">{it.nm}</span>
                    {p.showValues && <span className="vv">· {it.vv}</span>}
                  </div>
                </div>
              );
            })}
            {p.showAxis && <div className="ign-pyr-axis top"><span>{p.axisTop}</span></div>}
            {p.showAxis && <div className="ign-pyr-axis bot"><span>{p.axisBot}</span></div>}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '71%' }} /></span> 58 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
