/* Slide30Rings.jsx — IGNIS deck · KPI progress-ring dashboard chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: ringsDefaultProps (complete defaults) + ringsControls (1:1).
 *
 * Chart page. A row of radial progress rings, each a single KPI percentage with
 * an ember-gradient arc, center value and delta. Distinct from the single
 * semicircle gauge on the Health page — this reads as a multi-metric scoreboard.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-rng .ign-frame{justify-content:space-between}
.ign-rng .b1{width:1500px;height:900px;left:50%;top:54%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,130,60,0.3),rgba(255,90,35,0) 70%);filter:blur(60px)}
.ign-rng .ign-ghost{font-size:560px;right:30px;bottom:-150px}
.ign-rng-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:6px}
.ign-rng-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:12px}
.ign-rng-head h2{font-size:70px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-rng-head h2 .ign-serif{color:var(--ign-a)}
.ign-rng-head p{font-size:23px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:400px;text-align:right;text-wrap:pretty}
.ign-rng-body{flex:1;display:grid;align-items:center;gap:48px}
.ign-rng-cell{display:flex;flex-direction:column;align-items:center;text-align:center}
.ign-rng-dial{position:relative;width:300px;max-width:24vw;aspect-ratio:1/1}
.ign-rng-dial svg{width:100%;height:100%;display:block;transform:rotate(-90deg)}
.ign-rng-ctr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ign-rng-ctr .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:74px;line-height:0.85;letter-spacing:-0.04em}
.ign-rng-ctr .u{font-size:34px;font-weight:400;color:var(--ign-ink2)}
.ign-rng-name{font-size:29px;font-weight:700;margin-top:24px;letter-spacing:-0.01em}
.ign-rng-en{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);margin-top:7px}
.ign-rng-delta{display:inline-flex;align-items:center;gap:8px;margin-top:16px;font-family:'Space Grotesk',sans-serif;
  font-size:22px;font-weight:500;color:var(--ign-a)}
.ign-rng-cell.dim{opacity:0.34;filter:saturate(0.5)}
`;

export const ringsDefaultProps = {
  surface: 'ink',
  ringCount: 4,
  emphasis: false,
  emphasisIndex: 0,
  showCenterValue: true,
  showDelta: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '%',
  railText: 'Scoreboard — 指标',
  navItems: ['指标'],
  navCurrent: 0,
  ixNo: '30',
  ixLabel: 'Scoreboard',
  lead: 'Every dial, climbing.',
  headingHtml: '每一项，<span class="ign-ember-text">都在往上走</span>。',
  lede: '不是单点漂亮，而是关键指标同时抬升——这才是引擎跑顺的样子。',
  deltaSuffix: ' pts · 同比',
  rings: [
    { pct: 96, name: '站点健康度', en: 'Site Health', delta: '+38' },
    { pct: 82, name: '内容收录率', en: 'Indexation', delta: '+27' },
    { pct: 73, name: '转化达成', en: 'Conversion', delta: '+19' },
    { pct: 88, name: '投放回报达标', en: 'Paid ROI', delta: '+24' },
  ],
  metaLeft: 'IGNIS — 燃点 · 关键指标记分牌（季度）',
  metaMid: '同时抬升，才叫引擎',
};

export const ringsControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'ringCount', type: 'slider', label: '指标环数量', default: 4, min: 2, max: 4, step: 1, describe: '展示的 KPI 进度环数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一个环，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的环序号（从 0 起）。' },
  { key: 'showCenterValue', type: 'toggle', label: '环心数值', default: true, describe: '每个环中心的百分比数值。' },
  { key: 'showDelta', type: 'toggle', label: '同比增幅', default: true, describe: '名称下方的同比增幅标记。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '右上角的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function RingsSlide(props) {
  injectCSS('ign-rng-css', CSS);
  const p = { ...ringsDefaultProps, ...props };
  const count = clampInt(p.ringCount, 2, 4);
  const rings = (Array.isArray(p.rings) ? p.rings : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const R = 84, C = 2 * Math.PI * R;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-rng">
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

        <div className="ign-rng-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <p>{p.lede}</p>}
        </div>

        <div className="ign-rng-body ign-a2" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
          {rings.map((r, i) => {
            const dash = (r.pct / 100) * C;
            const gid = `ign-rng-g${i}`;
            return (
              <div key={i} className={`ign-rng-cell ${p.emphasis ? (i === emi ? '' : 'dim') : ''}`}>
                <div className="ign-rng-dial">
                  <svg viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id={gid} x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFC07A" /><stop offset="0.5" stopColor="#FF6E2E" /><stop offset="1" stopColor="#E22A0C" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r={R} fill="none" stroke="var(--ign-hair)" strokeWidth="14" />
                    <circle cx="100" cy="100" r={R} fill="none" stroke={`url(#${gid})`} strokeWidth="14"
                      strokeLinecap="round" strokeDasharray={`${dash} ${C - dash}`} />
                  </svg>
                  {p.showCenterValue && (
                    <div className="ign-rng-ctr">
                      <span className="v">{r.pct}<span className="u">%</span></span>
                    </div>
                  )}
                </div>
                <div className="ign-rng-name">{r.name}</div>
                <div className="ign-rng-en">{r.en}</div>
                {p.showDelta && <div className="ign-rng-delta">↑ {r.delta}{p.deltaSuffix}</div>}
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '37%' }} /></span> 30 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
