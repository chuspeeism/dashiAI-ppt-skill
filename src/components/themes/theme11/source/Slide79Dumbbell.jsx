/* Slide79Dumbbell.jsx — IGNIS deck · dumbbell before/after chart page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: dumbbellDefaultProps (complete defaults) + dumbbellControls (1:1).
 *
 * Chart page. Each metric is two dots — before and after — joined by a
 * connector, so the size AND direction of change read at a glance. Distinct
 * from Lollipop (68, single dot), Slope (63, crossing lines) and Bridge (36,
 * waterfall): the dumbbell pairs two states per row. Lead row's after-dot is
 * rendered ember.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-dmb .ign-frame{justify-content:space-between}
.ign-dmb .ign-eyebrow{white-space:nowrap}
.ign-dmb .b1{width:1160px;height:900px;right:-200px;top:54%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-dmb .ign-ghost{font-size:540px;left:-10px;bottom:-160px}
.ign-dmb-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-dmb-head h2{font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-dmb-head h2 .ign-serif{color:var(--ign-a)}
.ign-dmb-head .legend{display:flex;gap:24px;align-items:center;font-family:'Space Grotesk',sans-serif;font-size:19px;letter-spacing:0.03em;color:var(--ign-ink3)}
.ign-dmb-head .legend .it{display:flex;align-items:center;gap:9px}
.ign-dmb-head .legend .d{width:16px;height:16px;border-radius:50%}
.ign-dmb-head .legend .d.b{background:var(--ign-bg);border:2px solid var(--ign-ink3)}
.ign-dmb-head .legend .d.a{background:linear-gradient(135deg,#FFC07A,#E22A0C)}
.ign-dmb-plot{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:14px;position:relative}
.ign-dmb-grid{position:absolute;inset:0;left:240px;right:120px;z-index:0;pointer-events:none}
.ign-dmb-gl{position:absolute;top:0;bottom:0;width:1px;background:var(--ign-hair)}
.ign-dmb-gx{position:absolute;bottom:-30px;transform:translateX(-50%);font-family:'Space Grotesk',sans-serif;font-size:18px;color:var(--ign-ink3)}
.ign-dmb-row{position:relative;z-index:1;display:grid;grid-template-columns:240px 1fr 120px;align-items:center;height:80px}
.ign-dmb-nm{display:flex;flex-direction:column;gap:3px;padding-right:24px}
.ign-dmb-nm .t{font-size:26px;font-weight:600;letter-spacing:-0.01em}
.ign-dmb-row.lead .ign-dmb-nm .t{font-weight:700}
.ign-dmb-nm .e{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-dmb-track{position:relative;height:100%;display:flex;align-items:center}
.ign-dmb-bar{position:absolute;height:4px;border-radius:4px;background:var(--ign-hair2)}
.ign-dmb-row.lead .ign-dmb-bar{background:linear-gradient(90deg,rgba(255,110,46,0.4),#FF6E2E)}
.ign-dmb-dot{position:absolute;width:22px;height:22px;border-radius:50%;transform:translateX(-50%);border:3px solid var(--ign-bg)}
.ign-dmb-dot.b{background:var(--ign-bg);border:2px solid var(--ign-ink3);width:20px;height:20px}
.ign-dmb-dot.a{background:var(--ign-ink2);box-shadow:0 0 0 1px var(--ign-hair2)}
.ign-dmb-row.lead .ign-dmb-dot.a{background:linear-gradient(135deg,#FFC07A,#E22A0C);width:28px;height:28px;
  box-shadow:0 0 20px rgba(255,110,46,0.6)}
.ign-dmb-bv,.ign-dmb-av{position:absolute;top:-26px;transform:translateX(-50%);font-family:'Space Grotesk',sans-serif;font-size:18px;color:var(--ign-ink3)}
.ign-dmb-av{font-weight:500;color:var(--ign-ink2)}
.ign-dmb-delta{text-align:right;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:-0.02em;color:var(--ign-a)}
.ign-dmb-row.dim{opacity:0.36;filter:saturate(0.5)}
`;

/* before/after on a 0–200 index scale. delta shown at right. Sorted by gain. */
export const dumbbellDefaultProps = {
  surface: 'paper',
  itemCount: 5,
  emphasis: true,
  emphasisIndex: 0,
  showValues: true,
  showDelta: true,
  showGrid: true,
  showLegend: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '⟷',
  railText: 'Shift — 前后',
  navItems: ['前后'],
  navCurrent: 0,
  ixNo: '78',
  ixLabel: 'Dumbbell',
  eyebrowNo: '接入前后',
  eyebrowEn: 'Before / after',
  headingHtml: '同一批指标，<span class="ign-ember-text">挪了多远</span>。',
  legendBefore: '接入前',
  legendAfter: '接入后',
  rows: [
    { nm: '自然进线', en: 'Organic', before: 52, after: 182, delta: '+250%' },
    { nm: '转化率', en: 'Conversion', before: 38, after: 144, delta: '×3.8' },
    { nm: '客单价', en: 'AOV', before: 70, after: 122, delta: '+74%' },
    { nm: '复购率', en: 'Repeat', before: 44, after: 96, delta: '+118%' },
    { nm: '获客成本', en: 'CAC', before: 130, after: 77, delta: '−41%' },
  ],
  metaLeft: 'IGNIS — 燃点 · 接入前后对照（指数化）',
  metaMid: '挪动的距离，就是价值',
};

export const dumbbellControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'itemCount', type: 'slider', label: '指标数量', default: 5, min: 3, max: 5, step: 1, describe: '哑铃图的指标行数。' },
  { key: 'emphasis', type: 'toggle', label: '首行突出', default: true, describe: '开启后首行点亮为暖橙，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的指标序号（从 0 起）。' },
  { key: 'showValues', type: 'toggle', label: '端点数值', default: true, describe: '前后两点上方的数值。' },
  { key: 'showDelta', type: 'toggle', label: '变化幅度', default: true, describe: '每行右侧的变化幅度。' },
  { key: 'showGrid', type: 'toggle', label: '刻度网格', default: true, describe: '背景的纵向刻度线与轴标。' },
  { key: 'showLegend', type: 'toggle', label: '图例', default: true, describe: '标题右侧的「接入前 / 接入后」图例。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function DumbbellSlide(props) {
  injectCSS('ign-dmb-css', CSS);
  const p = { ...dumbbellDefaultProps, ...props };
  const n = clampInt(p.itemCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);
  const SCALE = 200;
  const pos = (v) => `${(v / SCALE) * 100}%`;
  const ticks = [0, 50, 100, 150, 200];

  return (
    <Slide surface={p.surface} className="ign-dmb">
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

        <div className="ign-dmb-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLegend && (
            <div className="legend">
              <span className="it"><span className="d b" />{p.legendBefore}</span>
              <span className="it"><span className="d a" />{p.legendAfter}</span>
            </div>
          )}
        </div>

        <div className="ign-dmb-plot ign-a2">
          {p.showGrid && (
            <div className="ign-dmb-grid">
              {ticks.map((t) => (
                <div key={t} className="ign-dmb-gl" style={{ left: pos(t) }}><span className="ign-dmb-gx" style={{ left: 0 }}>{t}</span></div>
              ))}
            </div>
          )}
          {rows.map((r, i) => {
            const lead = i === 0;
            const dim = p.emphasis && i !== emi;
            const lo = Math.min(r.before, r.after), hi = Math.max(r.before, r.after);
            return (
              <div key={i} className={`ign-dmb-row ${p.emphasis && lead ? 'lead' : ''} ${dim ? 'dim' : ''}`}>
                <div className="ign-dmb-nm"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                <div className="ign-dmb-track">
                  <span className="ign-dmb-bar" style={{ left: pos(lo), width: pos(hi - lo) }} />
                  <span className="ign-dmb-dot b" style={{ left: pos(r.before) }} />
                  <span className="ign-dmb-dot a" style={{ left: pos(r.after) }} />
                  {p.showValues && <span className="ign-dmb-bv" style={{ left: pos(r.before) }}>{r.before}</span>}
                  {p.showValues && <span className="ign-dmb-av" style={{ left: pos(r.after) }}>{r.after}</span>}
                </div>
                {p.showDelta && <div className="ign-dmb-delta">{r.delta}</div>}
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 28 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '95%' }} /></span> 78 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
