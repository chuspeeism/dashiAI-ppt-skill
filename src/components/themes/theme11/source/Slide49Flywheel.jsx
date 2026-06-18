/* Slide49Flywheel.jsx — IGNIS deck · circular flywheel / loop diagram page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: flywheelDefaultProps (complete defaults) + flywheelControls (1:1).
 *
 * Regular text+diagram page. A circular loop of stages with a hub label, arrows
 * implying perpetual motion. Distinct from the linear Process (07) and the
 * horizontal Roadmap (45) — this is the deck's only cyclical diagram.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-fly .ign-frame{justify-content:space-between}
.ign-fly .b1{width:1100px;height:1100px;right:-160px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.34),rgba(226,42,12,0) 64%);filter:blur(56px)}
.ign-fly .ign-ghost{font-size:520px;left:20px;bottom:-140px}
.ign-fly-body{flex:1;display:grid;grid-template-columns:0.72fr 1.28fr;gap:48px;align-items:center;margin-top:6px}
.ign-fly-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-fly-head h2{font-size:68px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-fly-head h2 .ign-serif{color:var(--ign-a)}
.ign-fly-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:400px;text-wrap:pretty}
.ign-fly-list{margin-top:30px;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--ign-hair)}
.ign-fly-li{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:baseline;padding:15px 0;border-bottom:1px solid var(--ign-hair)}
.ign-fly-li .nv{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:24px;color:var(--ign-a);letter-spacing:0.02em}
.ign-fly-li .tx{font-size:24px;font-weight:600}
.ign-fly-li .tx .sub{font-weight:300;color:var(--ign-ink2)}
.ign-fly-diag{position:relative;display:flex;align-items:center;justify-content:center}
.ign-fly-diag svg{width:720px;max-width:52vw;height:auto;overflow:visible}
.ign-fly-hub{font-family:'Space Grotesk',sans-serif;font-weight:700;letter-spacing:-0.02em;fill:var(--ign-ink)}
.ign-fly-hub2{font-family:'Noto Sans SC',sans-serif;font-weight:400;fill:var(--ign-ink2)}
.ign-fly-stt{font-family:'Noto Sans SC',sans-serif;font-weight:600;fill:var(--ign-ink)}
.ign-fly-num{font-family:'Space Grotesk',sans-serif;font-weight:700;fill:#1B1108}
`;

const STAGES_BASE = [
  { zh: '吸引', en: 'Attract' },
  { zh: '转化', en: 'Convert' },
  { zh: '沉淀', en: 'Retain' },
  { zh: '放大', en: 'Amplify' },
];

export const flywheelDefaultProps = {
  surface: 'ember',
  stageCount: 4,
  showHub: true,
  showList: true,
  showArrows: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '↻',
  railText: 'Flywheel — 飞轮',
  navItems: ['飞轮'],
  navCurrent: 0,
  ixNo: '49',
  ixLabel: 'Flywheel',
  lead: 'It keeps spinning.',
  headingHtml: '转起来之后，<br><span class="ign-ember-text">就停不下来</span>。',
  lede: '每一环都给下一环加速：吸引带来转化，转化沉淀资产，资产放大吸引——这就是飞轮。',
  stages: [
    { zh: '吸引', en: 'Attract' },
    { zh: '转化', en: 'Convert' },
    { zh: '沉淀', en: 'Retain' },
    { zh: '放大', en: 'Amplify' },
    { zh: '复利', en: 'Compound' },
  ],
  hubZh: '复利',
  hubEn: 'COMPOUND',
  metaLeft: 'IGNIS — 燃点 · 增长飞轮',
  metaMid: '越转越快',
};

export const flywheelControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'stageCount', type: 'slider', label: '环节数量', default: 4, min: 3, max: 5, step: 1, describe: '飞轮上的环节数量。' },
  { key: 'showHub', type: 'toggle', label: '中心标签', default: true, describe: '飞轮中心的核心标签。' },
  { key: 'showList', type: 'toggle', label: '环节清单', default: true, describe: '左侧的环节文字清单。' },
  { key: 'showArrows', type: 'toggle', label: '循环箭头', default: true, describe: '环节之间的循环方向箭头。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一环节，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的环节序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function FlywheelSlide(props) {
  injectCSS('ign-fly-css', CSS);
  const p = { ...flywheelDefaultProps, ...props };
  const n = clampInt(p.stageCount, 3, 5);
  const stages = (Array.isArray(p.stages) ? p.stages : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const CX = 280, CY = 280, R = 190;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const node = (i) => [CX + R * Math.cos(ang(i)), CY + R * Math.sin(ang(i))];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-fly">
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

        <div className="ign-fly-body">
          <div className="ign-fly-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showList && (
              <div className="ign-fly-list">
                {stages.map((s, i) => (
                  <div key={i} className="ign-fly-li">
                    <span className="nv">{String(i + 1).padStart(2, '0')}</span>
                    <span className="tx">{s.zh} <span className="sub">· {s.en}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ign-fly-diag ign-a2">
            <svg viewBox="0 0 560 560">
              <defs>
                <radialGradient id="ign-fly-g" cx="40%" cy="34%" r="70%">
                  <stop offset="0" stopColor="#FFC07A" /><stop offset="0.55" stopColor="#FF6E2E" /><stop offset="1" stopColor="#E22A0C" />
                </radialGradient>
                <marker id="ign-fly-ar" markerWidth="11" markerHeight="11" refX="6" refY="5.5" orient="auto">
                  <path d="M1 1 L9 5.5 L1 10" fill="none" stroke="var(--ign-a)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>

              {p.showArrows && [...Array(n)].map((_, i) => {
                const a0 = ang(i) + 0.42, a1 = ang(i + 1) - 0.42;
                const x0 = CX + R * Math.cos(a0), y0 = CY + R * Math.sin(a0);
                const x1 = CX + R * Math.cos(a1), y1 = CY + R * Math.sin(a1);
                return (
                  <path key={i} d={`M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`}
                    fill="none" stroke="var(--ign-hair2)" strokeWidth="2" markerEnd="url(#ign-fly-ar)" />
                );
              })}

              {p.showHub && (
                <g>
                  <circle cx={CX} cy={CY} r="76" fill="var(--ign-panel)" stroke="var(--ign-hair2)" strokeWidth="1.5" />
                  <text x={CX} y={CY - 6} textAnchor="middle" className="ign-fly-hub" fontSize="34">{p.hubZh}</text>
                  <text x={CX} y={CY + 24} textAnchor="middle" className="ign-fly-hub2" fontSize="19" style={{ letterSpacing: '0.12em' }}>{p.hubEn}</text>
                </g>
              )}

              {stages.map((s, i) => {
                const [x, y] = node(i);
                const lit = !p.emphasis || i === emi;
                return (
                  <g key={i} style={{ opacity: lit ? 1 : 0.34 }}>
                    <circle cx={x} cy={y} r="50" fill={lit ? 'url(#ign-fly-g)' : 'var(--ign-ink4)'}
                      stroke={lit ? '#E22A0C' : 'var(--ign-hair2)'} strokeWidth="1.5" />
                    <text x={x} y={y - 4} textAnchor="middle" className="ign-fly-stt" fontSize="26"
                      style={{ fill: lit ? '#1B1108' : 'var(--ign-ink2)' }}>{s.zh}</text>
                    <text x={x} y={y + 20} textAnchor="middle" fontSize="14"
                      style={{ fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '0.1em', fill: lit ? 'rgba(27,17,8,0.7)' : 'var(--ign-ink3)' }}>{s.en.toUpperCase()}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '60%' }} /></span> 49 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
