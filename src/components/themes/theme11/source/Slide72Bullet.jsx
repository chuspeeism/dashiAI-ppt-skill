/* Slide72Bullet.jsx — IGNIS deck · bullet-chart target-attainment page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: bulletDefaultProps (complete defaults) + bulletControls (1:1).
 *
 * Chart page. Each KPI is a bullet graph — graded qualitative bands behind a
 * measure bar, with a vertical target tick — so actual-vs-target reads in one
 * glance across several metrics. Distinct from Lollipop (68, magnitude),
 * Ranking (61, order) and Rings (30, single-ring %): the bullet's job is
 * pass/miss against a goal. Lead row's measure is rendered ember.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-bul .ign-frame{justify-content:space-between}
.ign-bul .b1{width:1240px;height:880px;left:46%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.34),rgba(226,42,12,0) 68%);filter:blur(64px)}
.ign-bul .ign-ghost{font-size:520px;right:0;bottom:-150px}
.ign-bul .ign-eyebrow{white-space:nowrap}
.ign-bul-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-bul-head h2{font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-bul-head h2 .ign-serif{color:var(--ign-a)}
.ign-bul-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:300px;line-height:1.4}
.ign-bul-list{flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px;margin-top:8px}
.ign-bul-row{display:grid;grid-template-columns:262px 1fr 156px;align-items:center;gap:26px;padding:14px 0;
  border-bottom:1px solid var(--ign-hair)}
.ign-bul-row:first-child{border-top:1px solid var(--ign-hair)}
.ign-bul-nm{display:flex;flex-direction:column;gap:3px}
.ign-bul-nm .t{font-size:26px;font-weight:600;letter-spacing:-0.01em}
.ign-bul-nm .e{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:0.08em;color:var(--ign-ink3);text-transform:uppercase}
.ign-bul-track{position:relative;height:34px;border-radius:6px;overflow:hidden;background:var(--ign-panel);border:1px solid var(--ign-hair)}
.ign-bul-band{position:absolute;top:0;bottom:0}
.ign-bul-band.b1{left:0;background:var(--ign-hair)}
.ign-bul-band.b2{right:0;background:rgba(255,110,46,0.10)}
.ign-bul-band.b3{right:0;background:rgba(255,110,46,0.20)}
.ign-bul-meas{position:absolute;top:50%;left:0;transform:translateY(-50%);height:12px;border-radius:8px;
  background:var(--ign-ink2);z-index:2}
.ign-bul-row.lead .ign-bul-meas{height:16px;background:linear-gradient(90deg,#FFC07A,#FF6E2E 55%,#E22A0C);
  box-shadow:0 0 18px rgba(255,110,46,0.5)}
.ign-bul-tgt{position:absolute;top:-4px;bottom:-4px;width:3px;border-radius:2px;background:var(--ign-ink);z-index:3;transform:translateX(-50%)}
.ign-bul-tgt::after{content:attr(data-label);position:absolute;top:-24px;left:50%;transform:translateX(-50%);
  font-family:'Space Grotesk',sans-serif;font-size:14px;letter-spacing:0.06em;color:var(--ign-ink3);white-space:nowrap}
.ign-bul-val{text-align:right}
.ign-bul-val .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:36px;line-height:1;letter-spacing:-0.02em}
.ign-bul-val .v .u{font-size:0.5em;color:var(--ign-ink2);font-weight:400;margin-left:1px}
.ign-bul-val .s{font-family:'Space Grotesk',sans-serif;font-size:16px;letter-spacing:0.04em;margin-top:6px}
.ign-bul-val .s.hit{color:var(--ign-a)}
.ign-bul-val .s.miss{color:var(--ign-ink3)}
.ign-bul-row.dim{opacity:0.36;filter:saturate(0.5)}
`;

/* meas/target/bands are 0–100 along each metric's own scale. disp = shown value. */
export const bulletDefaultProps = {
  surface: 'ember',
  metricCount: 5,
  emphasis: true,
  emphasisIndex: 0,
  showBands: true,
  showTargets: true,
  showValues: true,
  showStatus: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '◎',
  railText: 'Targets — 达成',
  navItems: ['达成'],
  navCurrent: 0,
  ixNo: '71',
  ixLabel: 'Targets',
  eyebrowNo: '目标达成',
  eyebrowEn: 'Vs target',
  headingHtml: '定了目标，<span class="ign-ember-text">就拿数字对账</span>。',
  noteHtml: '深条为实际，竖线为目标<br>越过线，才算交付。',
  targetLabel: '目标',
  statusHit: '✓ 达成',
  statusMiss: '◷ 在途',
  rows: [
    { nm: '自然进线', en: 'Organic leads', meas: 96, target: 80, b2: 55, b3: 78, disp: '+182', u: '%', hit: true },
    { nm: '转化率', en: 'Conversion', meas: 88, target: 75, b2: 50, b3: 72, disp: '×3.8', u: '', hit: true },
    { nm: '获客成本', en: 'CAC ↓', meas: 71, target: 70, b2: 45, b3: 68, disp: '−41', u: '%', hit: true },
    { nm: '复购占比', en: 'Repeat rate', meas: 62, target: 75, b2: 50, b3: 72, disp: '34', u: '%', hit: false },
    { nm: '内容产出', en: 'Content velocity', meas: 84, target: 70, b2: 48, b3: 70, disp: '5.4k', u: '', hit: true },
  ],
  metaLeft: 'IGNIS — 燃点 · 关键指标达成（中位样本）',
  metaMid: '越过那条线，才算数',
};

export const bulletControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'metricCount', type: 'slider', label: '指标数量', default: 5, min: 3, max: 5, step: 1, describe: '子弹图的指标行数。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: true, describe: '开启后突出某一指标，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的指标序号（从 0 起）。' },
  { key: 'showBands', type: 'toggle', label: '分级背景', default: true, describe: '每行的差/中/优分级背景带。' },
  { key: 'showTargets', type: 'toggle', label: '目标刻度', default: true, describe: '每行的纵向目标刻度线。' },
  { key: 'showValues', type: 'toggle', label: '数值标注', default: true, describe: '每行右侧的成果数值。' },
  { key: 'showStatus', type: 'toggle', label: '达成标记', default: true, describe: '数值下方的达成 / 在途标记。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function BulletSlide(props) {
  injectCSS('ign-bul-css', CSS);
  const p = { ...bulletDefaultProps, ...props };
  const n = clampInt(p.metricCount, 3, 5);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-bul">
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

        <div className="ign-bul-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-bul-list ign-a2">
          {rows.map((r, i) => {
            const lead = i === 0;
            const dim = p.emphasis && i !== emi;
            return (
              <div key={i} className={`ign-bul-row ${p.emphasis && lead ? 'lead' : ''} ${dim ? 'dim' : ''}`}>
                <div className="ign-bul-nm"><span className="t">{r.nm}</span><span className="e">{r.en}</span></div>
                <div className="ign-bul-track">
                  {p.showBands && <><span className="ign-bul-band b1" style={{ width: '100%' }} /><span className="ign-bul-band b2" style={{ width: `${100 - r.b2}%` }} /><span className="ign-bul-band b3" style={{ width: `${100 - r.b3}%` }} /></>}
                  <span className="ign-bul-meas" style={{ width: `${r.meas}%` }} />
                  {p.showTargets && <span className="ign-bul-tgt" data-label={p.targetLabel} style={{ left: `${r.target}%` }} />}
                </div>
                <div className="ign-bul-val">
                  {p.emphasis && lead
                    ? <EmberText className="v">{r.disp}{r.u && <span className="u">{r.u}</span>}</EmberText>
                    : <div className="v">{r.disp}{r.u && <span className="u">{r.u}</span>}</div>}
                  {p.showStatus && <div className={`s ${r.hit ? 'hit' : 'miss'}`}>{r.hit ? p.statusHit : p.statusMiss}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 16 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '87%' }} /></span> 71 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
