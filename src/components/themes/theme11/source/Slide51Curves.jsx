/* Slide51Curves.jsx — IGNIS deck · multi-series trend-line chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: curvesDefaultProps (complete defaults) + curvesControls (1:1).
 *
 * Chart page. A multi-line trend chart comparing several growth series over a
 * 12-month span, with a lead series highlighted. Distinct from Proof (03, a
 * single before/after series) — this is the deck's multi-series comparison.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-crv .ign-frame{justify-content:space-between}
.ign-crv .b1{width:1180px;height:1180px;right:-260px;top:52%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.3),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-crv .ign-ghost{font-size:560px;right:30px;top:-60px}
.ign-crv-body{flex:1;display:grid;grid-template-columns:0.82fr 1.3fr;gap:64px;align-items:center;margin-top:18px}
.ign-crv-l .ign-eyebrow{margin-bottom:22px}
.ign-crv-l h2{font-size:62px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-crv-l h2 .ign-serif{color:var(--ign-a)}
.ign-crv-l p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:420px;text-wrap:pretty}
.ign-crv-keys{margin-top:34px;border-top:1px solid var(--ign-hair)}
.ign-crv-key{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:16px;padding:16px 0;border-bottom:1px solid var(--ign-hair)}
.ign-crv-key .sw{width:22px;height:4px;border-radius:2px;align-self:center}
.ign-crv-key .nm{font-size:25px;font-weight:600}
.ign-crv-key .nm .en{font-weight:300;color:var(--ign-ink3);font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.06em;margin-left:8px}
.ign-crv-key .ev{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:-0.02em}
.ign-crv-key.dim{opacity:0.32;filter:saturate(0.45)}
.ign-crv-card{padding:36px 40px 28px}
.ign-crv-card-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.ign-crv-card-h .ct{font-family:'Space Grotesk',sans-serif;font-size:23px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-crv-card-h .yu{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3)}
.ign-crv-card svg{width:100%;display:block;overflow:visible}
.ign-crv-x{display:flex;justify-content:space-between;font-family:'Space Grotesk',sans-serif;font-size:21px;color:var(--ign-ink3);margin-top:14px}
`;

const SERIES_REMOVED = null;
const XLAB2_REMOVED = null;

const XLAB_REMOVED = null;

export const curvesDefaultProps = {
  surface: 'ink',
  chartVariant: 'area',
  seriesCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showGrid: true,
  showEndDots: true,
  showKeys: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↗',
  railText: 'Trend — 趋势',
  navItems: ['趋势'],
  navCurrent: 0,
  ixNo: '50',
  ixLabel: 'Trend',
  eyebrowNo: '趋势',
  eyebrowEn: '12-month index',
  headingHtml: '同一条起跰线，<br><span class="ign-ember-text">跑出三种结局</span>。',
  lede: '把基期归一为 100，看 12 个月后的走向——干预与否，差的是一整条曲线。',
  cardTitle: '增长指数 · 基期 = 100',
  cardNote: '越高越好',
  series: [
    { nm: '接入燃点', en: 'IGNIS', kind: 'lead', data: [12, 17, 22, 30, 39, 47, 56, 67, 76, 85, 92, 99] },
    { nm: '行业均值', en: 'Industry', kind: 'mid', data: [12, 14, 16, 17, 19, 20, 22, 23, 25, 26, 27, 29] },
    { nm: '自然增长', en: 'No action', kind: 'low', data: [12, 12, 13, 12, 14, 13, 14, 13, 15, 14, 15, 16] },
  ],
  xLabels: ['1月', '3月', '6月', '9月', '12月'],
  metaLeft: 'IGNIS — 燃点 · 跨 2,400+ 品牌中位',
  metaMid: '差距不是一天拉开的',
};

export const curvesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'chartVariant', type: 'select', label: '图表类型', default: 'area',
    options: [{ value: 'area', label: '面积折线' }, { value: 'lines', label: '纯折线' }],
    describe: '主序列是否带面积填充。' },
  { key: 'seriesCount', type: 'slider', label: '序列数量', default: 3, min: 2, max: 3, step: 1, describe: '参与对比的趋势序列数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一序列，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的序列序号（从 0 起）。' },
  { key: 'showGrid', type: 'toggle', label: '网格线', default: true, describe: '图表的横向参考网格线。' },
  { key: 'showEndDots', type: 'toggle', label: '终点标记', default: true, describe: '每条曲线末端的圆点标记。' },
  { key: 'showKeys', type: 'toggle', label: '序列图例', default: true, describe: '左侧带终值的序列图例清单。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function CurvesSlide(props) {
  injectCSS('ign-crv-css', CSS);
  const p = { ...curvesDefaultProps, ...props };
  const n = clampInt(p.seriesCount, 2, 3);
  const series = (Array.isArray(p.series) ? p.series : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  const W = 760, H = 340, padT = 18, padB = 18;
  const x = (i) => 18 + (i * (W - 36)) / 11;
  const y = (v) => padT + (1 - v / 100) * (H - padT - padB);
  const stroke = { lead: 'url(#ign-crv-lg)', mid: 'var(--ign-ink3)', low: 'var(--ign-ink4)' };
  const swatch = { lead: 'var(--ign-b)', mid: 'var(--ign-ink3)', low: 'var(--ign-ink4)' };
  const pts = (s) => s.data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const lead = series.find((s) => s.kind === 'lead');

  return (
    <Slide surface={p.surface} className="ign-crv">
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

        <div className="ign-crv-body">
          <div className="ign-crv-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showKeys && (
              <div className="ign-crv-keys">
                {series.map((s, i) => (
                  <div key={i} className={`ign-crv-key ${p.emphasis && i !== emi ? 'dim' : ''}`}>
                    <span className="sw" style={{ background: swatch[s.kind] }} />
                    <span className="nm">{s.nm}<span className="en">{s.en}</span></span>
                    {s.kind === 'lead'
                      ? <EmberText className="ev">{s.data[s.data.length - 1]}</EmberText>
                      : <span className="ev" style={{ color: 'var(--ign-ink2)' }}>{s.data[s.data.length - 1]}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-card ign-crv-card ign-a2">
            <div className="ign-crv-card-h">
              <div className="ct">{p.cardTitle}</div>
              <div className="yu">{p.cardNote}</div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="ign-crv-lg" x1="0" y1="0" x2={W} y2="0"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
                <linearGradient id="ign-crv-ar" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FF6E2E" stopOpacity="0.26" /><stop offset="1" stopColor="#FF6E2E" stopOpacity="0" /></linearGradient>
              </defs>
              {p.showGrid && [0, 25, 50, 75, 100].map((g) => (
                <line key={g} x1="0" y1={y(g)} x2={W} y2={y(g)} stroke={g === 0 ? 'var(--ign-hair2)' : 'var(--ign-hair)'} />
              ))}
              {p.chartVariant === 'area' && lead && (!p.emphasis || series[emi].kind === 'lead') && (
                <polygon points={`${pts(lead)} ${x(11)},${y(0)} ${x(0)},${y(0)}`} fill="url(#ign-crv-ar)" />
              )}
              {series.map((s, i) => {
                const lit = !p.emphasis || i === emi;
                return (
                  <polyline key={i} points={pts(s)} fill="none"
                    stroke={s.kind === 'lead' ? stroke.lead : stroke[s.kind]}
                    strokeWidth={s.kind === 'lead' ? 4.5 : 2.5}
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ opacity: lit ? 1 : 0.22 }} />
                );
              })}
              {p.showEndDots && series.map((s, i) => {
                const lit = !p.emphasis || i === emi;
                return (
                  <circle key={i} cx={x(11)} cy={y(s.data[11])} r={s.kind === 'lead' ? 7 : 5}
                    fill={s.kind === 'lead' ? '#FFC07A' : 'var(--ign-bg)'}
                    stroke={s.kind === 'lead' ? '#E22A0C' : swatch[s.kind]} strokeWidth="2"
                    style={{ opacity: lit ? 1 : 0.3 }} />
                );
              })}
            </svg>
            <div className="ign-crv-x">{(Array.isArray(p.xLabels) ? p.xLabels : []).map((l, i) => <span key={i}>{l}</span>)}</div>
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '61%' }} /></span> 50 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
