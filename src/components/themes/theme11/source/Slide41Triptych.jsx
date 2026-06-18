/* Slide41Triptych.jsx — IGNIS deck · three-up big-number band page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: triptychDefaultProps (complete defaults) + triptychControls (1:1).
 *
 * Big-number page. Three oversized stats sit in a divided band, each with a
 * delta + caption. Distinct from the single-hero Metric (12) and the two-up
 * before/after Split (28) — this is the deck's triptych scoreboard moment.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-trp .ign-frame{justify-content:space-between}
.ign-trp .b1{width:1600px;height:900px;left:50%;top:55%;transform:translate(-50%,-50%);
  background:radial-gradient(48% 50% at 50% 50%,rgba(255,130,60,0.3),rgba(255,90,35,0) 70%);filter:blur(64px)}
.ign-trp .ign-ghost{font-size:600px;left:20px;bottom:-170px}
.ign-trp-head{margin-top:6px}
.ign-trp-head .lead{display:flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.28em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:18px}
.ign-trp-head .lead .tick{width:34px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-trp-head .lead .no{color:var(--ign-a)}
.ign-trp-head h2{font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.03em;max-width:1180px}
.ign-trp-head h2 .ign-serif{color:var(--ign-a);font-weight:800}
.ign-trp-body{flex:1;display:grid;align-items:center;border-top:1px solid var(--ign-hair2);border-bottom:1px solid var(--ign-hair2)}
.ign-trp-body.stack{display:flex;flex-direction:column;justify-content:center}
.ign-trp-cell{padding:30px 44px;display:flex;flex-direction:column;justify-content:center}
.ign-trp-body:not(.stack) .ign-trp-cell + .ign-trp-cell{border-left:1px solid var(--ign-hair)}
.ign-trp-body.stack .ign-trp-cell{flex-direction:row;align-items:baseline;gap:36px;padding:26px 8px}
.ign-trp-body.stack .ign-trp-cell + .ign-trp-cell{border-top:1px solid var(--ign-hair)}
.ign-trp-delta{display:inline-flex;align-items:center;gap:9px;font-family:'Space Grotesk',sans-serif;font-size:22px;
  font-weight:500;letter-spacing:0.04em;color:var(--ign-a);margin-bottom:14px}
.ign-trp-body.stack .ign-trp-delta{margin-bottom:0;order:3}
.ign-trp-num{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:152px;line-height:0.82;letter-spacing:-0.05em}
.ign-trp-num .u{font-size:64px;font-weight:400;color:var(--ign-ink2)}
.ign-trp-body.stack .ign-trp-num{font-size:120px;min-width:380px}
.ign-trp-cap{font-size:26px;font-weight:300;line-height:1.4;color:var(--ign-ink2);margin-top:18px;max-width:340px;text-wrap:pretty}
.ign-trp-body.stack .ign-trp-cap{margin-top:0;flex:1}
.ign-trp-cell.dim{opacity:0.32;filter:saturate(0.5)}
`;

export const triptychDefaultProps = {
  surface: 'ember',
  statCount: 3,
  orientation: 'row',
  showDeltas: true,
  showCaptions: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '%',
  railText: 'Numbers — 数字',
  navItems: ['数字'],
  navCurrent: 0,
  ixNo: '41',
  ixLabel: 'Numbers',
  leadEn: 'By the numbers',
  leadZh: '三个数字',
  headingHtml: '不用形容词，<span class="ign-ember-text">用三个数字</span>说话。',
  stats: [
    { num: '3.8', u: '×', delta: '↑ vs 行业 1.4×', cap: '平均转化率提升，接入 12 个月口径。' },
    { num: '−41', u: '%', delta: '↓ 持续下降', cap: '单客获取成本，靠自然流量稀释付费。' },
    { num: '94', u: '%', delta: '↑ 逐年走高', cap: '客户续约率——结果好，才留得住。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 关键成效（中位客户口径）',
  metaMid: '数字不会替你夸张',
};

export const triptychControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'statCount', type: 'slider', label: '数字数量', default: 3, min: 2, max: 3, step: 1, describe: '并列展示的大数字数量。' },
  { key: 'orientation', type: 'select', label: '排列方向', default: 'row',
    options: [{ value: 'row', label: '横向并列' }, { value: 'stack', label: '纵向堆叠' }], describe: '大数字的排列方向。' },
  { key: 'showDeltas', type: 'toggle', label: '趋势标记', default: true, describe: '每个数字的趋势/对比标记。' },
  { key: 'showCaptions', type: 'toggle', label: '数字说明', default: true, describe: '每个数字的说明文案。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一个数字，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的数字序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '主标题', default: true, describe: '数字带上方的主标题。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function TriptychSlide(props) {
  injectCSS('ign-trp-css', CSS);
  const p = { ...triptychDefaultProps, ...props };
  const n = clampInt(p.statCount, 2, 3);
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, n);
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const stack = p.orientation === 'stack';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-trp">
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

        <div className="ign-trp-head ign-a1">
          {p.showKicker && <div className="lead"><span className="no">{p.leadEn}</span><span className="tick" /><span>{p.leadZh}</span></div>}
          {p.showLede && <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />}
        </div>

        <div className={`ign-trp-body ign-a2 ${stack ? 'stack' : ''}`}
          style={stack ? undefined : { gridTemplateColumns: `repeat(${n}, 1fr)` }}>
          {stats.map((s, i) => (
            <div key={i} className={`ign-trp-cell ${p.emphasis && i !== emi ? 'dim' : ''}`}>
              {p.showDeltas && <span className="ign-trp-delta">{s.delta}</span>}
              <EmberText className="ign-trp-num">{s.num}<span className="u">{s.u}</span></EmberText>
              {p.showCaptions && <div className="ign-trp-cap">{s.cap}</div>}
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '50%' }} /></span> 41 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
