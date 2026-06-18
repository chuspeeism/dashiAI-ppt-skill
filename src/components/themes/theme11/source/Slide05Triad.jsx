/* Slide05Triad.jsx — IGNIS deck · value-pillars page (Optimize · Engage · Profit).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: triadDefaultProps (complete defaults) + triadControls (1:1 with props).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-triad .ign-frame{justify-content:space-between}
.ign-triad .b1{width:1300px;height:900px;left:50%;top:60%;transform:translate(-50%,-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,110,46,0.30),rgba(226,42,12,0) 70%);filter:blur(54px)}
.ign-triad .ign-ghost{font-size:560px;right:30px;bottom:-110px}
.ign-triad-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:40px;gap:48px}
.ign-triad-head h2{font-size:78px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-triad-head h2 .ign-serif{color:var(--ign-a)}
.ign-triad-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:26px;color:var(--ign-ink3);max-width:360px;text-align:right;line-height:1.4}
.ign-triad-grid{display:grid;gap:0}
.ign-pillar{padding:38px 48px 8px 0;border-top:2px solid var(--ign-hair2);position:relative}
.ign-pillar + .ign-pillar{border-left:1px solid var(--ign-hair);padding-left:48px}
.ign-pillar.hot{border-top-color:var(--ign-b)}
.ign-pillar .pn{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.2em;color:var(--ign-ink3);text-transform:uppercase}
.ign-pillar .pw{font-size:56px;font-weight:900;letter-spacing:-0.02em;margin-top:20px;line-height:1}
.ign-pillar .pe{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:30px;color:var(--ign-ink3);margin-top:10px}
.ign-pillar .pd{font-size:26px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:24px;max-width:380px}
.ign-pillar .pstat{display:flex;align-items:baseline;gap:14px;margin-top:30px;padding-top:24px;border-top:1px solid var(--ign-hair)}
.ign-pillar .pstat .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:46px;letter-spacing:-0.02em}
.ign-pillar .pstat .l{font-size:24px;color:var(--ign-ink3);font-family:'Space Grotesk',sans-serif;letter-spacing:0.08em}
`;

const PILLARS = [
  { w: '优化', en: 'Optimize', d: '通过最大化现有流量的价值来降低获客成本，把每一次到访都变成可衡量的资产。', sv: '−38%', sl: '获客成本 CAC' },
  { w: '互动', en: 'Engage', d: '用数据驱动决策、改进策略规划，让内容与受众在每个触点真正发生连接。', sv: '2.4×', sl: '互动深度' },
  { w: '利润', en: 'Profit', d: '通过消除任何阻碍访客转化的摩擦，确保从点击到收入的体验始终无缝顺滑。', sv: '3.8×', sl: '投放回报 ROI' },
];

export const triadDefaultProps = {
  surface: 'paper',
  pillarCount: 3,
  emphasis: true,
  emphasisIndex: 2,
  showStat: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '04',
  railText: 'Value — 价值',
  navItems: ['价值'],
  navCurrent: 0,
  ixNo: '04',
  ixLabel: 'Value',
  headingHtml: '从优化，<br><span class="ign-ember-text">到利润</span>。',
  noteHtml: '同一支团队，从降本到增收，<br>覆盖转化的每一段路径。',
  pillars: [
    { w: '优化', en: 'Optimize', d: '通过最大化现有流量的价值来降低获客成本，把每一次到访都变成可衡量的资产。', sv: '−38%', sl: '获客成本 CAC' },
    { w: '互动', en: 'Engage', d: '用数据驱动决策、改进策略规划，让内容与受众在每个触点真正发生连接。', sv: '2.4×', sl: '互动深度' },
    { w: '利润', en: 'Profit', d: '通过消除任何阻碍访客转化的摩擦，确保从点击到收入的体验始终无缝顺滑。', sv: '3.8×', sl: '投放回报 ROI' },
  ],
  metaLeft: 'IGNIS — 燃点 · 转化价值模型',
  metaMid: '优化 · 互动 · 利润',
};

export const triadControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'pillarCount', type: 'slider', label: '价值柱数量', default: 3, min: 2, max: 3, step: 1, describe: '横向价值柱的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后突出某一根价值柱，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 2, min: 0, max: 2, step: 1, describe: '需要突出的价值柱序号（从 0 起），仅在“重点突出”开启时生效。' },
  { key: 'showStat', type: 'toggle', label: '指标行', default: true, describe: '每根价值柱底部的关键数字。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '标题旁的衬线注释文案。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function TriadSlide(props) {
  injectCSS('ign-triad-css', CSS);
  const p = { ...triadDefaultProps, ...props };
  const count = clampInt(p.pillarCount, 2, 3);
  const pillars = (Array.isArray(p.pillars) ? p.pillars : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-triad">
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

        <div className="ign-triad-head ign-a1">
          <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-triad-grid ign-a2" style={{ gridTemplateColumns: `repeat(${count},1fr)` }}>
          {pillars.map((pl, i) => {
            const hot = p.emphasis && i === emi;
            return (
              <div key={i} className={`ign-pillar ${hot ? 'hot ign-lit' : (p.emphasis ? 'ign-dim' : '')}`}>
                <div className="pn">{String(i + 1).padStart(2, '0')} — Pillar</div>
                <div className="pw">{hot ? <EmberText>{pl.w}</EmberText> : pl.w}</div>
                <div className="pe">{pl.en}</div>
                <div className="pd">{pl.d}</div>
                {p.showStat && (
                  <div className="pstat">
                    {hot ? <EmberText className="v">{pl.sv}</EmberText> : <span className="v">{pl.sv}</span>}
                    <span className="l">{pl.sl}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '17%' }} /></span> 14 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
