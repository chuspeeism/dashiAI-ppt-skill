/* Slide14Mix.jsx — IGNIS deck · channel-mix data page with a switchable viz.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: mixDefaultProps (complete defaults) + mixControls (1:1).
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-mix .ign-frame{justify-content:space-between}
.ign-mix .b1{width:1180px;height:1180px;left:-200px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.26),rgba(226,42,12,0) 68%);filter:blur(56px)}
.ign-mix .ign-ghost{font-size:540px;right:30px;bottom:-120px}
.ign-mix-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:34px;gap:48px}
.ign-mix-head h2{font-size:64px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-mix-head h2 .ign-serif{color:var(--ign-a)}
.ign-mix-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);max-width:360px;text-align:right;line-height:1.4}
.ign-mix-body{display:grid;grid-template-columns:0.9fr 1.1fr;gap:80px;align-items:center;margin-top:8px}
.ign-mix-body.solo{grid-template-columns:1fr;max-width:1000px}
.ign-mix-viz{position:relative;display:flex;align-items:center;justify-content:center}
.ign-mix-viz svg{width:100%;height:auto;display:block;overflow:visible}
.ign-donut-c{position:absolute;text-align:center}
.ign-donut-c .dv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:90px;line-height:0.9;letter-spacing:-0.03em}
.ign-donut-c .dl{font-size:24px;color:var(--ign-ink2);margin-top:8px;font-weight:300}
.ign-mix-legend{display:flex;flex-direction:column;gap:0}
.ign-mix-row{display:flex;align-items:center;gap:20px;padding:22px 0;border-top:1px solid var(--ign-hair)}
.ign-mix-row:last-child{border-bottom:1px solid var(--ign-hair)}
.ign-mix-row .sw{width:16px;height:16px;border-radius:4px;flex:none}
.ign-mix-row .nm{font-size:30px;font-weight:700;min-width:160px}
.ign-mix-row .en{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.08em;color:var(--ign-ink3)}
.ign-mix-row .barwrap{flex:1;height:8px;background:var(--ign-hair);border-radius:4px;overflow:hidden;margin:0 6px}
.ign-mix-row .barwrap i{display:block;height:100%;border-radius:4px}
.ign-mix-row .pc{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:34px;letter-spacing:-0.02em;width:96px;text-align:right}
.ign-mix-stack{width:100%}
.ign-mix-stack .track{display:flex;height:88px;border-radius:6px;overflow:hidden;border:1px solid var(--ign-hair2)}
.ign-mix-stack .seg{display:flex;align-items:flex-end;padding:0 0 12px 16px}
.ign-mix-stack .seg .sp{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;color:#1a120c}
.ign-mix-stack .keys{display:flex;flex-wrap:wrap;gap:14px 34px;margin-top:30px}
.ign-mix-stack .keys .k{display:flex;align-items:center;gap:12px;font-size:26px;color:var(--ign-ink2)}
.ign-mix-stack .keys .k .sw{width:14px;height:14px;border-radius:4px}
`;

const CHANNELS = [
  { nm: '自然搜索', en: 'SEO', pct: 38 },
  { nm: '付费投放', en: 'Paid Media', pct: 26 },
  { nm: '内容营销', en: 'Content', pct: 22 },
  { nm: '社媒互动', en: 'Social', pct: 9 },
  { nm: '邮件复购', en: 'Lifecycle', pct: 5 },
];

function fillFor(i, emphasis, emi) {
  const ramp = ['url(#ign-mix-g)', 'var(--ign-b)', 'var(--ign-ink3)', 'var(--ign-ink4)', 'var(--ign-hair2)'];
  if (emphasis) return i === emi ? 'url(#ign-mix-g)' : 'var(--ign-ink4)';
  return ramp[i] || 'var(--ign-hair2)';
}

function MixDefs() {
  return (
    <defs>
      <linearGradient id="ign-mix-g" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
    </defs>
  );
}

function Donut({ items, emphasis, emi, heroNote }) {
  const R = 132, SW = 40, C = 2 * Math.PI * R, cx = 170, cy = 170;
  let cum = 0;
  const hero = emphasis ? items[clampInt(emi, 0, items.length - 1)] : items[0];
  return (
    <div className="ign-mix-viz" style={{ minHeight: 340 }}>
      <svg viewBox="0 0 340 340">
        <MixDefs />
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--ign-hair)" strokeWidth={SW} />
        {items.map((it, i) => {
          const frac = it.pct / 100;
          const dash = `${frac * C} ${C}`;
          const rot = -90 + cum * 360;
          cum += frac;
          return <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={fillFor(i, emphasis, emi)} strokeWidth={SW}
            strokeDasharray={dash} transform={`rotate(${rot} ${cx} ${cy})`} strokeLinecap="butt" />;
        })}
      </svg>
      <div className="ign-donut-c">
        <EmberText className="dv">{hero.pct}%</EmberText>
        <div className="dl">{hero.nm} · {heroNote}</div>
      </div>
    </div>
  );
}

function Bars({ items, emphasis, emi }) {
  const max = Math.max(...items.map((i) => i.pct));
  return (
    <div className="ign-mix-legend">
      <svg width="0" height="0"><MixDefs /></svg>
      {items.map((it, i) => (
        <div key={i} className={`ign-mix-row ${emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
          <span className="sw" style={{ background: fillFor(i, emphasis, emi) }} />
          <span className="nm">{it.nm}</span>
          <span className="barwrap"><i style={{ width: (it.pct / max * 100) + '%', background: fillFor(i, emphasis, emi) }} /></span>
          <span className="pc">{it.pct}%</span>
        </div>
      ))}
    </div>
  );
}

function Stack({ items, emphasis, emi }) {
  return (
    <div className="ign-mix-stack">
      <svg width="0" height="0"><MixDefs /></svg>
      <div className="track">
        {items.map((it, i) => (
          <div key={i} className="seg" style={{ width: it.pct + '%', background: fillFor(i, emphasis, emi) }}>
            {it.pct >= 12 && <span className="sp">{it.pct}%</span>}
          </div>
        ))}
      </div>
      <div className="keys">
        {items.map((it, i) => (
          <span key={i} className="k" style={emphasis && i !== emi ? { opacity: 0.4 } : undefined}>
            <span className="sw" style={{ background: fillFor(i, emphasis, emi) }} />{it.nm} · {it.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}

export const mixDefaultProps = {
  surface: 'paper',
  chartVariant: 'donut',
  itemCount: 4,
  emphasis: false,
  emphasisIndex: 0,
  showLegend: true,
  showNote: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '%',
  railText: 'Channel Mix — 渠道',
  navItems: ['渠道'],
  navCurrent: 0,
  ixNo: '06',
  ixLabel: 'Channel Mix',
  eyebrowNo: '06',
  eyebrowText: 'Where growth comes from',
  headingHtml: '增长，<span class="ign-ember-text">有据可循</span>。',
  noteHtml: '每一分增长，<br>都能拆回到具体渠道。',
  donutNote: '占比最高',
  channels: [
    { nm: '自然搜索', en: 'SEO', pct: 38 },
    { nm: '付费投放', en: 'Paid Media', pct: 26 },
    { nm: '内容营销', en: 'Content', pct: 22 },
    { nm: '社媒互动', en: 'Social', pct: 9 },
    { nm: '邮件复购', en: 'Lifecycle', pct: 5 },
  ],
  metaLeft: 'IGNIS — 燃点 · 渠道构成（中位样本）',
  metaMid: '归因清晰，预算才花得明白',
};

export const mixControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'chartVariant', type: 'select', label: '图表类型', default: 'donut',
    options: [{ value: 'donut', label: '环形图' }, { value: 'bars', label: '条形图' }, { value: 'stacked', label: '堆叠条' }],
    describe: '渠道占比的可视化类型。' },
  { key: 'itemCount', type: 'slider', label: '渠道数量', default: 4, min: 3, max: 5, step: 1, describe: '参与构成的渠道数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一渠道，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的渠道序号（从 0 起）。' },
  { key: 'showLegend', type: 'toggle', label: '明细图例', default: true, describe: '环形图右侧的明细图例（仅环形图模式）。' },
  { key: 'showNote', type: 'toggle', label: '装饰注释', default: true, describe: '标题旁的衬线注释文案。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function MixSlide(props) {
  injectCSS('ign-mix-css', CSS);
  const p = { ...mixDefaultProps, ...props };
  const count = clampInt(p.itemCount, 3, 5);
  const items = (Array.isArray(p.channels) ? p.channels : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const isDonut = p.chartVariant === 'donut';
  const solo = isDonut && !p.showLegend;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-mix">
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

        <div className="ign-mix-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 18 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowText}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className={`ign-mix-body ign-a2 ${solo ? 'solo' : ''}`}>
          {isDonut && <Donut items={items} emphasis={p.emphasis} emi={emi} heroNote={p.donutNote} />}
          {isDonut
            ? (p.showLegend && <Bars items={items} emphasis={p.emphasis} emi={emi} />)
            : (p.chartVariant === 'bars'
                ? <div style={{ gridColumn: '1 / -1' }}><Bars items={items} emphasis={p.emphasis} emi={emi} /></div>
                : <div style={{ gridColumn: '1 / -1' }}><Stack items={items} emphasis={p.emphasis} emi={emi} /></div>)}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '11%' }} /></span> 9 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
