/* Slide63Slope.jsx — IGNIS deck · two-point slope-chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: slopeDefaultProps (complete defaults) + slopeControls (1:1).
 *
 * Chart page. A slope graph: two vertical axes (Before / After), each metric a
 * straight line connecting its left value to its right value — slope encodes
 * the change, the lead metric drawn ember. Distinct from Curves (51, many
 * monthly points) and Split (28, two isolated numbers) — this is the deck's
 * many-metrics-at-two-moments comparison.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-slp .ign-frame{justify-content:space-between}
.ign-slp .b1{width:1180px;height:1180px;right:-280px;top:52%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.26),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-slp .ign-ghost{font-size:560px;left:0;bottom:-170px}
.ign-slp-body{flex:1;display:grid;grid-template-columns:0.82fr 1.3fr;gap:60px;align-items:center;margin-top:16px}
.ign-slp-l .ign-eyebrow{margin-bottom:22px}
.ign-slp-l h2{font-size:60px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-slp-l h2 .ign-serif{color:var(--ign-a)}
.ign-slp-l p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:22px;max-width:420px;text-wrap:pretty}
.ign-slp-keys{margin-top:30px;border-top:1px solid var(--ign-hair)}
.ign-slp-key{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid var(--ign-hair)}
.ign-slp-key .sw{width:22px;height:4px;border-radius:2px;align-self:center}
.ign-slp-key .nm{font-size:24px;font-weight:500}
.ign-slp-key .ev{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:24px;letter-spacing:-0.01em}
.ign-slp-key.dim{opacity:0.32;filter:saturate(0.45)}
.ign-slp-card{padding:30px 40px 24px;position:relative}
.ign-slp-card-h{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px}
.ign-slp-card-h .ax{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-slp-card-h .ax b{color:var(--ign-a);font-weight:500}
.ign-slp-card svg{width:100%;display:block;overflow:visible}
.ign-slp-lab{font-family:'Space Grotesk',sans-serif;font-size:20px}
`;

/* before/after pairs (index units); first is the lead */
export const slopeDefaultProps = {
  surface: 'paper',
  lineCount: 5,
  emphasis: false,
  emphasisIndex: 0,
  showValues: true,
  showAxisLabels: true,
  showKeys: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '⟋',
  railText: 'Slope — 跃迁',
  navItems: ['跃迁'],
  navCurrent: 0,
  ixNo: '62',
  ixLabel: 'Slope',
  eyebrowNo: '跃迁',
  eyebrowEn: 'Before → After',
  headingHtml: '五条线，<br><span class="ign-ember-text">同时拐了个弯</span>。',
  lede: '接入前后各取一刻，斜率越陡，变化越猛——好指标向上，成本指标向下。',
  axisBeforeHtml: '接入<b>前</b>',
  axisAfterHtml: '接入<b>后</b>',
  metrics: [
    { nm: '自然流量', b: 26, a: 92, kind: 'lead' },
    { nm: '转化率', b: 34, a: 71, kind: 'mid' },
    { nm: '复购率', b: 41, a: 64, kind: 'mid' },
    { nm: '获客成本', b: 78, a: 38, kind: 'low' },
    { nm: '跳出率', b: 70, a: 33, kind: 'low' },
  ],
  metaLeft: 'IGNIS — 燃点 · 接入前后跃迁',
  metaMid: '陡的那条，是自然流量',
};

export const slopeControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'lineCount', type: 'slider', label: '指标数量', default: 5, min: 3, max: 5, step: 1, describe: '参与前后对比的指标（斜线）数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条斜线，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的指标序号（从 0 起）。' },
  { key: 'showValues', type: 'toggle', label: '端点数值', default: true, describe: '斜线两端的数值标注。' },
  { key: 'showAxisLabels', type: 'toggle', label: '轴标签', default: true, describe: '左右两端「接入前 / 接入后」轴标签。' },
  { key: 'showKeys', type: 'toggle', label: '指标图例', default: true, describe: '左侧带变化量的指标图例清单。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '主标题下方的说明段落。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SlopeSlide(props) {
  injectCSS('ign-slp-css', CSS);
  const p = { ...slopeDefaultProps, ...props };
  const n = clampInt(p.lineCount, 3, 5);
  const metrics = (Array.isArray(p.metrics) ? p.metrics : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  const W = 720, H = 360, padT = 30, padB = 30;
  const xL = 120, xR = W - 120;
  const y = (v) => padT + (1 - v / 100) * (H - padT - padB);
  const stroke = { lead: 'url(#ign-slp-lg)', mid: 'var(--ign-ink3)', low: 'var(--ign-ink4)' };
  const swatch = { lead: 'var(--ign-b)', mid: 'var(--ign-ink3)', low: 'var(--ign-ink4)' };
  const dot = { lead: '#FF7A33', mid: 'var(--ign-ink3)', low: 'var(--ign-ink4)' };

  return (
    <Slide surface={p.surface} className="ign-slp">
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

        <div className="ign-slp-body">
          <div className="ign-slp-l ign-a1">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
            {p.showKeys && (
              <div className="ign-slp-keys">
                {metrics.map((m, i) => {
                  const delta = m.a - m.b;
                  const good = m.kind !== 'low' ? delta > 0 : delta < 0;
                  return (
                    <div key={i} className={`ign-slp-key ${p.emphasis && i !== emi ? 'dim' : ''}`}>
                      <span className="sw" style={{ background: swatch[m.kind] }} />
                      <span className="nm">{m.nm}</span>
                      {m.kind === 'lead'
                        ? <EmberText className="ev">{delta > 0 ? '+' : ''}{delta}</EmberText>
                        : <span className="ev" style={{ color: good ? 'var(--ign-ink)' : 'var(--ign-ink2)' }}>{delta > 0 ? '+' : ''}{delta}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="ign-card ign-slp-card ign-a2">
            <div className="ign-slp-card-h">
              <div className="ax" dangerouslySetInnerHTML={{ __html: p.axisBeforeHtml }} />
              <div className="ax" dangerouslySetInnerHTML={{ __html: p.axisAfterHtml }} />
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="ign-slp-lg" x1="0" y1="0" x2={W} y2="0"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
              </defs>
              <line x1={xL} y1={padT - 14} x2={xL} y2={H - padB + 14} stroke="var(--ign-hair2)" />
              <line x1={xR} y1={padT - 14} x2={xR} y2={H - padB + 14} stroke="var(--ign-hair2)" />
              {metrics.map((m, i) => {
                const lit = !p.emphasis || i === emi;
                const lead = m.kind === 'lead';
                return (
                  <g key={i} style={{ opacity: lit ? 1 : 0.22 }}>
                    <line x1={xL} y1={y(m.b)} x2={xR} y2={y(m.a)} stroke={lead ? stroke.lead : stroke[m.kind]} strokeWidth={lead ? 4.5 : 2.5} strokeLinecap="round" />
                    <circle cx={xL} cy={y(m.b)} r={lead ? 6 : 4.5} fill="var(--ign-bg)" stroke={dot[m.kind]} strokeWidth="2" />
                    <circle cx={xR} cy={y(m.a)} r={lead ? 7 : 5} fill={lead ? '#FFC07A' : 'var(--ign-bg)'} stroke={lead ? '#E22A0C' : dot[m.kind]} strokeWidth="2" />
                    {p.showValues && <text className="ign-slp-lab" x={xL - 14} y={y(m.b) + 6} textAnchor="end" fill={lit ? 'var(--ign-ink2)' : 'var(--ign-ink3)'}>{m.b}</text>}
                    {p.showValues && <text className="ign-slp-lab" x={xR + 14} y={y(m.a) + 6} textAnchor="start" fill={lead ? 'var(--ign-a)' : (lit ? 'var(--ign-ink)' : 'var(--ign-ink3)')} fontWeight={lead ? 600 : 400}>{m.a}</text>}
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
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '76%' }} /></span> 62 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
