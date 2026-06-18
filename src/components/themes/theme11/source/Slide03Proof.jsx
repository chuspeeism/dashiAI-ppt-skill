/* Slide03Proof.jsx — IGNIS deck · proof page with a switchable data viz. */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-proof .ign-frame{justify-content:space-between}
.ign-proof .b1{width:1100px;height:1100px;right:-220px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.3),rgba(226,42,12,0) 68%);filter:blur(56px)}
.ign-proof .ign-ghost{font-size:560px;right:40px;top:-40px}
.ign-proof-body{display:grid;grid-template-columns:0.92fr 1.25fr;gap:74px;margin-top:36px;align-items:start}
.ign-proof-body.solo{grid-template-columns:1fr}
.ign-proof-l h2{font-size:62px;font-weight:900;line-height:1.04;letter-spacing:-0.03em;margin-top:24px}
.ign-proof-l h2 .ign-serif{color:var(--ign-a)}
.ign-pl-list{margin-top:36px}
.ign-pl-row{display:flex;align-items:baseline;gap:20px;padding:16px 0;border-top:1px solid var(--ign-hair)}
.ign-pl-row:last-child{border-bottom:1px solid var(--ign-hair)}
.ign-pl-row .n{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-a);width:34px;flex:none}
.ign-pl-row .t{font-size:28px;font-weight:700}
.ign-pl-row .e{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);margin-left:auto;white-space:nowrap}
.ign-pills{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
.ign-pills span{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.06em;color:var(--ign-ink2);
  border:1px solid var(--ign-hair2);border-radius:999px;padding:9px 18px;white-space:nowrap}
.ign-chart{padding:34px 38px 30px}
.ign-chart-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}
.ign-chart-h .ct{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3);white-space:nowrap}
.ign-legend{display:flex;gap:24px;font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-ink2)}
.ign-legend i{display:inline-flex;align-items:center;gap:9px;font-style:normal}
.ign-legend i::before{content:"";width:14px;height:3px;border-radius:2px}
.ign-legend .a::before{background:var(--ign-b)}
.ign-legend .b::before{background:var(--ign-ink3)}
.ign-chart svg{width:100%;display:block}
.ign-chart-x{display:flex;justify-content:space-between;font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-ink3);margin-top:14px}
`;

const ITEMS = [
  { t: '搜索引擎优化', e: 'Search' },
  { t: '转化率优化', e: 'Convert' },
  { t: '付费投放', e: 'Paid Media' },
];
const PILLS = ['关键词研究', '竞品分析', '内容策略', 'A/B 测试', '技术 SEO'];

function Chart({ variant }) {
  const grid = (
    <>
      <line x1="0" y1="40" x2="720" y2="40" stroke="var(--ign-hair)" />
      <line x1="0" y1="130" x2="720" y2="130" stroke="var(--ign-hair)" />
      <line x1="0" y1="220" x2="720" y2="220" stroke="var(--ign-hair)" />
      <line x1="0" y1="310" x2="720" y2="310" stroke="var(--ign-hair2)" />
    </>
  );
  const defs = (
    <defs>
      <linearGradient id="ign-lg" x1="0" y1="0" x2="720" y2="0"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
      <linearGradient id="ign-ar" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#FF6E2E" stopOpacity="0.28" /><stop offset="1" stopColor="#FF6E2E" stopOpacity="0" /></linearGradient>
    </defs>
  );
  const divider = <line x1="408" y1="10" x2="408" y2="310" stroke="var(--ign-hair2)" strokeDasharray="3 6" />;

  if (variant === 'bars') {
    const before = [250, 244, 250, 240, 246, 238];
    const after = [226, 200, 176, 150, 110, 60];
    const bw = 44;
    const xs0 = 24, gap = (384 - xs0) / 6;
    return (
      <svg viewBox="0 0 720 340" preserveAspectRatio="none">
        {defs}{grid}{divider}
        {before.map((y, i) => <rect key={'b' + i} x={xs0 + i * gap} y={y} width={bw} height={310 - y} rx="3" fill="var(--ign-ink4)" />)}
        {after.map((y, i) => <rect key={'a' + i} x={420 + i * gap} y={y} width={bw} height={310 - y} rx="3" fill="url(#ign-lg)" />)}
      </svg>
    );
  }

  const lineBefore = '24,250 96,244 168,252 240,238 312,246 384,236 408,228';
  const lineAfter = '408,228 468,200 528,178 588,128 648,92 708,40';
  return (
    <svg viewBox="0 0 720 340" preserveAspectRatio="none">
      {defs}{grid}{divider}
      {variant === 'area' && <path d="M408 80 L468 64 L528 70 L588 44 L648 36 L708 22 L708 310 L408 310 Z" fill="url(#ign-ar)" />}
      <polyline points={lineBefore} fill="none" stroke="var(--ign-ink3)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={lineAfter} fill="none" stroke="url(#ign-lg)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="408" cy="228" r="6" fill="#FF6E2E" />
      <circle cx="708" cy="40" r="6" fill="#FFC07A" />
    </svg>
  );
}

export const proofDefaultProps = {
  surface: 'ink',
  chartVariant: 'area',
  showChart: true,
  itemCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showPills: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '02',
  railText: 'Proof — 实证',
  navItems: ['封面', '方法', '实证', '成果'],
  navCurrent: 2,
  ixNo: '02',
  ixLabel: 'Proof',
  eyebrowNo: '02',
  eyebrowText: 'Capabilities',
  headingHtml: '搜索表现，<br><span class="ign-ember-text">肉眼可见</span>。<br><span class="ign-serif">Search that compounds.</span>',
  items: [
    { t: '搜索引擎优化', e: 'Search' },
    { t: '转化率优化', e: 'Convert' },
    { t: '付费投放', e: 'Paid Media' },
  ],
  pills: ['关键词研究', '竞品分析', '内容策略', 'A/B 测试', '技术 SEO'],
  chartTitle: '自然搜索流量 · Organic',
  legendA: '接入后',
  legendB: '接入前',
  xLabels: ['1月', '3月', '6月', '接入燃点', '9月', '12月 · +182%'],
  metaLeft: 'IGNIS — 燃点 · 12 个月真实数据',
  metaMid: '让 SEO 超越算法，对齐真实意图',
};

export const proofControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'chartVariant', type: 'select', label: '图表类型', default: 'area',
    options: [{ value: 'area', label: '面积图' }, { value: 'line', label: '折线图' }, { value: 'bars', label: '柱状图' }],
    describe: '右侧数据图的可视化类型。' },
  { key: 'showChart', type: 'toggle', label: '数据图卡片', default: true, describe: '右侧图表卡片显示与隐藏；隐藏时左侧内容占满整行。' },
  { key: 'itemCount', type: 'slider', label: '列表项数量', default: 3, min: 1, max: 3, step: 1, describe: '左侧能力清单的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条目，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的条目序号（从 0 起）。' },
  { key: 'showPills', type: 'toggle', label: '装饰标签行', default: true, describe: '左下角的标签胶囊行。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function ProofSlide(props) {
  injectCSS('ign-proof-css', CSS);
  const p = { ...proofDefaultProps, ...props };
  const count = clampInt(p.itemCount, 1, 3);
  const items = (Array.isArray(p.items) ? p.items : []).slice(0, count);
  const pills = Array.isArray(p.pills) ? p.pills : [];
  const xLabels = Array.isArray(p.xLabels) ? p.xLabels : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, count - 1);

  return (
    <Slide surface={p.surface} className="ign-proof">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <div className="ign-lock"><div className="ign-wm">IGNIS <em>燃点</em></div></div>
          <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav>
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className={`ign-proof-body ${p.showChart ? '' : 'solo'}`}>
          <div className="ign-proof-l ign-a1">
            <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowText}</span></div>
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            <div className="ign-pl-list">
              {items.map((it, i) => (
                <div key={i} className={`ign-pl-row ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                  <span className="n">{String(i + 1).padStart(2, '0')}</span><span className="t">{it.t}</span><span className="e">{it.e}</span>
                </div>
              ))}
            </div>
            {p.showPills && <div className="ign-pills">{pills.map((x, i) => <span key={i}>{x}</span>)}</div>}
          </div>

          {p.showChart && (
            <div className="ign-card ign-chart ign-a2">
              <div className="ign-chart-h">
                <div className="ct">{p.chartTitle}</div>
                <div className="ign-legend"><i className="a">{p.legendA}</i><i className="b">{p.legendB}</i></div>
              </div>
              <Chart variant={p.chartVariant} />
              <div className="ign-chart-x">{xLabels.map((x, i) => <span key={i}>{x}</span>)}</div>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '10%' }} /></span> 8 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
