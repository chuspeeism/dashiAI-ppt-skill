/* Slide08Health.jsx — IGNIS deck · site-health dashboard (gauge + issue metrics).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: healthDefaultProps (complete defaults) + healthControls (1:1).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-health .ign-frame{justify-content:space-between}
.ign-health .b1{width:1100px;height:1100px;left:-220px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.30),rgba(226,42,12,0) 68%);filter:blur(56px)}
.ign-health .ign-ghost{font-size:520px;right:40px;bottom:-90px}
.ign-health-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:36px;gap:48px}
.ign-health-head h2{font-size:70px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-health-head h2 .ign-serif{color:var(--ign-a)}
.ign-health-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:30px;color:var(--ign-a);margin-bottom:12px}
.ign-health-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);max-width:320px;text-align:right;line-height:1.4}
.ign-health-body{display:grid;grid-template-columns:0.78fr 1.22fr;gap:74px;margin-top:8px;align-items:center}
.ign-health-body.solo{grid-template-columns:1fr}
.ign-gauge{position:relative;display:flex;flex-direction:column;align-items:center}
.ign-gauge svg{width:380px;display:block}
.ign-gauge .gv{position:absolute;top:96px;left:0;right:0;text-align:center}
.ign-gauge .gv .num{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:96px;line-height:0.9;letter-spacing:-0.04em}
.ign-gauge .gv .num em{font-size:46px;font-style:normal;font-weight:400;color:var(--ign-ink3)}
.ign-gauge .gcap{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ign-ink2);margin-top:6px}
.ign-issues{display:grid;gap:0}
.ign-issue{padding:28px 40px 28px 0}
.ign-issue + .ign-issue{border-left:1px solid var(--ign-hair);padding-left:40px}
.ign-issue .iv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:72px;line-height:0.9;letter-spacing:-0.03em}
.ign-issue .il{font-size:25px;font-weight:300;color:var(--ign-ink2);margin-top:14px;line-height:1.4}
.ign-issue .ibar{height:8px;border-radius:4px;background:var(--ign-hair);margin-top:22px;overflow:hidden}
.ign-issue .ibar i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,var(--ign-a),var(--ign-b))}
.ign-health-foot{display:grid;gap:48px;border-top:1px solid var(--ign-hair);padding-top:26px}
.ign-health-foot .hf .ht{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-a);margin-bottom:10px}
.ign-health-foot .hf .hd{font-size:26px;font-weight:300;line-height:1.5;color:var(--ign-ink2)}
`;

function Gauge({ value, caption }) {
  const v = clampInt(value, 0, 100);
  return (
    <div className="ign-gauge">
      <svg viewBox="0 0 380 210">
        <defs>
          <linearGradient id="ign-gauge-lg" x1="0" y1="0" x2="380" y2="0"><stop stopColor="#FFC07A" /><stop offset="1" stopColor="#E22A0C" /></linearGradient>
        </defs>
        <path d="M30 190 A160 160 0 0 1 350 190" fill="none" stroke="var(--ign-hair)" strokeWidth="20" strokeLinecap="round" />
        <path d="M30 190 A160 160 0 0 1 350 190" fill="none" stroke="url(#ign-gauge-lg)" strokeWidth="20" strokeLinecap="round" pathLength="100" strokeDasharray={`${v} 100`} />
      </svg>
      <div className="gv"><div className="num">{v}<em>%</em></div></div>
      <div className="gcap">{caption}</div>
    </div>
  );
}

export const healthDefaultProps = {
  surface: 'ink',
  showGauge: true,
  metricCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showBars: true,
  showFoot: true,
  footCount: 2,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '07',
  railText: 'Health — 诊断',
  navItems: ['诊断'],
  navCurrent: 0,
  ixNo: '07',
  ixLabel: 'Health',
  lead: 'Websites that convert.',
  headingHtml: '开发与维护，<br><span class="ign-ember-text">同样可量化</span>。',
  noteHtml: '一份透明的健康度档案，<br>问题与进展一目了然。',
  gaugeValue: 96,
  gaugeCaption: '健康度 · 优秀',
  metrics: [
    { v: '185', l: '已修复技术问题 · 本月累计', bar: 92 },
    { v: '15%', l: '警告项 · 排队等待优化', bar: 15 },
    { v: '4%', l: '严重项 · 正在处理中', bar: 4 },
  ],
  foot: [
    { t: 'Higher rankings', d: '为现有页面创建优化内容，让网站更受搜索引擎青睐。' },
    { t: 'Free your team', d: '把例行的内容发布与迁移工作交给我们，团队得以专注核心。' },
  ],
};

export const healthControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showGauge', type: 'toggle', label: '健康度仪表', default: true, describe: '左侧的半环健康度仪表；隐藏时右侧指标占满整行。' },
  { key: 'metricCount', type: 'slider', label: '指标数量', default: 3, min: 1, max: 3, step: 1, describe: '右侧技术指标的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一项指标，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的指标序号（从 0 起）。' },
  { key: 'showBars', type: 'toggle', label: '指标进度条', default: true, describe: '每项指标下方的进度条。' },
  { key: 'showFoot', type: 'toggle', label: '底部说明', default: true, describe: '底部的成果说明栏。' },
  { key: 'footCount', type: 'slider', label: '说明数量', default: 2, min: 1, max: 2, step: 1, describe: '底部说明栏的条目数量。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function HealthSlide(props) {
  injectCSS('ign-health-css', CSS);
  const p = { ...healthDefaultProps, ...props };
  const count = clampInt(p.metricCount, 1, 3);
  const metrics = (Array.isArray(p.metrics) ? p.metrics : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const fc = clampInt(p.footCount, 1, 2);
  const foot = (Array.isArray(p.foot) ? p.foot : []).slice(0, fc);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-health">
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

        <div className="ign-health-head ign-a1">
          <div>
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className={`ign-health-body ign-a2 ${p.showGauge ? '' : 'solo'}`}>
          {p.showGauge && <Gauge value={p.gaugeValue} caption={p.gaugeCaption} />}
          <div className="ign-issues" style={{ gridTemplateColumns: `repeat(${count},1fr)` }}>
            {metrics.map((m, i) => (
              <div key={i} className={`ign-issue ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                <EmberText className="iv">{m.v}</EmberText>
                <div className="il">{m.l}</div>
                {p.showBars && <div className="ibar"><i style={{ width: m.bar + '%' }} /></div>}
              </div>
            ))}
          </div>
        </div>

        {p.showFoot && (
          <div className="ign-health-foot ign-a3" style={{ gridTemplateColumns: `repeat(${fc},1fr)` }}>
            {foot.map((f, i) => (
              <div key={i} className="hf"><div className="ht">{f.t}</div><div className="hd">{f.d}</div></div>
            ))}
          </div>
        )}
      </Frame>
    </Slide>
  );
}
