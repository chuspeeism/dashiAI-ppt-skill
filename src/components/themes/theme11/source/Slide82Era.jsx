/* Slide82Era.jsx — IGNIS deck · horizontal era/history timeline page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: eraDefaultProps (complete defaults) + eraControls (1:1).
 *
 * Timeline page. A horizontal band of eras with year markers, nodes and a
 * filled progress line up to "today". Distinct from Timeline (16, vertical
 * milestones) and Roadmap (45, staggered forward plan): this reads as a
 * company history left-to-right. Era count and the current node are prop-driven;
 * the current node is rendered ember.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-era .ign-frame{justify-content:space-between}
.ign-era .ign-eyebrow{white-space:nowrap}
.ign-era .b1{width:1300px;height:760px;left:50%;top:56%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-era .ign-ghost{font-size:540px;right:0;bottom:-160px}
.ign-era-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-era-head h2{font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-era-head h2 .ign-serif{color:var(--ign-a)}
.ign-era-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-era-band{flex:1;position:relative;margin-top:18px}
.ign-era-axis{position:absolute;left:0;right:0;top:50%;height:2px;background:var(--ign-hair2);transform:translateY(-50%);z-index:0}
.ign-era-fill{position:absolute;left:0;top:50%;height:2px;background:linear-gradient(90deg,var(--ign-a),var(--ign-b));transform:translateY(-50%);z-index:0}
.ign-era-row{position:absolute;inset:0;z-index:1;display:grid}
.ign-era-col{position:relative;padding:0 16px}
.ign-era-yr{position:absolute;left:16px;right:16px;bottom:calc(50% + 30px);text-align:center;
  font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:44px;letter-spacing:-0.02em;line-height:1;color:var(--ign-ink3)}
.ign-era-col.cur .ign-era-yr{color:transparent;background:linear-gradient(120deg,#FFC07A,#FF6E2E 52%,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-era-node{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:20px;height:20px;border-radius:50%;
  background:var(--ign-bg);border:2px solid var(--ign-hair2);z-index:2}
.ign-era-col.done .ign-era-node{border-color:var(--ign-b);background:var(--ign-b)}
.ign-era-col.cur .ign-era-node{width:28px;height:28px;border:none;background:linear-gradient(135deg,#FFC07A,#E22A0C);
  box-shadow:0 0 22px rgba(255,110,46,0.6)}
.ign-era-below{position:absolute;left:16px;right:16px;top:calc(50% + 30px);text-align:center}
.ign-era-tt{font-size:26px;font-weight:700;letter-spacing:-0.01em}
.ign-era-col.cur .ign-era-tt{color:transparent;background:linear-gradient(120deg,#FFC07A,#FF6E2E 52%,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-era-dd{font-size:19px;font-weight:300;color:var(--ign-ink2);line-height:1.45;margin-top:9px;max-width:240px;margin-left:auto;margin-right:auto;text-wrap:pretty}
.ign-era-tag{font-family:'Space Grotesk',sans-serif;font-size:15px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ign-ink3);margin-top:12px}
`;

export const eraDefaultProps = {
  surface: 'paper',
  eraCount: 5,
  currentIndex: 4,
  showYears: true,
  showDesc: true,
  showTags: true,
  showAxis: true,
  showKicker: true,
  showLede: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '↗',
  railText: 'Era — 历程',
  navItems: ['历程'],
  navCurrent: 0,
  ixNo: '81',
  ixLabel: 'Era',
  eyebrowNo: '一路走来',
  eyebrowEn: 'Our story',
  headingHtml: '从一间房，<span class="ign-ember-text">到一台引擎</span>。',
  noteHtml: '六年时间<br>把手艺打磨成系统。',
  eras: [
    { yr: '2019', tt: '起步', dd: '三个人一间房，第一批客户口口相传。', tag: 'Founded' },
    { yr: '2021', tt: '成型', dd: '增长操作系统跑通，方法开始可复制。', tag: 'System' },
    { yr: '2023', tt: '规模', dd: '跨行业验证，服务品牌数破千。', tag: 'Scale' },
    { yr: '2025', tt: 'AI 化', dd: '引擎接入 AI，研究到上线提速一个量级。', tag: 'AI engine' },
    { yr: '今天', tt: '复利', dd: '2,400+ 品牌在同一套引擎上持续滚动。', tag: 'Today' },
  ],
  metaLeft: 'IGNIS — 燃点 · 发展历程',
  metaMid: '慢慢来，比较快',
};

export const eraControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'eraCount', type: 'slider', label: '阶段数量', default: 5, min: 3, max: 5, step: 1, describe: '历程的阶段节点数量。' },
  { key: 'currentIndex', type: 'slider', label: '当前阶段', default: 4, min: 0, max: 4, step: 1, describe: '点亮为暖橙的「当前」阶段序号（进度填充至此）。' },
  { key: 'showYears', type: 'toggle', label: '年份', default: true, describe: '每个节点上方的年份。' },
  { key: 'showDesc', type: 'toggle', label: '阶段说明', default: true, describe: '每个节点下方的一句话说明。' },
  { key: 'showTags', type: 'toggle', label: '阶段标签', default: true, describe: '每个节点的英文阶段标签。' },
  { key: 'showAxis', type: 'toggle', label: '时间轴线', default: true, describe: '贯穿的横向时间轴与进度填充。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showLede', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function EraSlide(props) {
  injectCSS('ign-era-css', CSS);
  const p = { ...eraDefaultProps, ...props };
  const n = clampInt(p.eraCount, 3, 5);
  const eras = (Array.isArray(p.eras) ? p.eras : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const cur = clampInt(p.currentIndex, 0, n - 1);
  // fill line up to the current node's center
  const fillPct = n > 1 ? ((cur + 0.5) / n) * 100 : 100;

  return (
    <Slide surface={p.surface} className="ign-era">
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

        <div className="ign-era-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showLede && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-era-band ign-a2">
          {p.showAxis && <span className="ign-era-axis" />}
          {p.showAxis && <span className="ign-era-fill" style={{ width: `${fillPct}%` }} />}
          <div className="ign-era-row" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {eras.map((e, i) => (
              <div key={i} className={`ign-era-col ${i < cur ? 'done' : ''} ${i === cur ? 'cur' : ''}`}>
                {p.showYears && <div className="ign-era-yr">{e.yr}</div>}
                <span className="ign-era-node" />
                <div className="ign-era-below">
                  <div className="ign-era-tt">{e.tt}</div>
                  {p.showDesc && <div className="ign-era-dd">{e.dd}</div>}
                  {p.showTags && <div className="ign-era-tag">{e.tag}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 18 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '99%' }} /></span> 81 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
