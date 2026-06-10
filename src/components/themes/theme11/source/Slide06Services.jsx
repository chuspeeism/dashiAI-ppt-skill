/* Slide06Services.jsx — IGNIS deck · service-matrix page with an arrow motif.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: servicesDefaultProps (complete defaults) + servicesControls (1:1).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-svc .ign-frame{justify-content:space-between}
.ign-svc .b1{width:1200px;height:1200px;right:-260px;top:52%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.34),rgba(226,42,12,0) 68%);filter:blur(58px)}
.ign-svc .ign-ghost{font-size:520px;left:40px;bottom:-80px}
.ign-svc-body{display:grid;grid-template-columns:1.15fr 0.85fr;gap:60px;margin-top:34px;align-items:center}
.ign-svc-l h2{font-size:78px;font-weight:900;line-height:1.0;letter-spacing:-0.03em;margin-top:22px}
.ign-svc-l h2 .ign-serif{color:var(--ign-a)}
.ign-svc-list{margin-top:38px}
.ign-svc-row{display:flex;align-items:baseline;gap:24px;padding:22px 0;border-top:1px solid var(--ign-hair)}
.ign-svc-row:last-child{border-bottom:1px solid var(--ign-hair)}
.ign-svc-row .n{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-a);width:42px;flex:none}
.ign-svc-row .t{font-size:34px;font-weight:700}
.ign-svc-row .e{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:26px;color:var(--ign-ink3);margin-left:auto;white-space:nowrap}
.ign-svc-art{display:flex;align-items:center;justify-content:center;position:relative}
.ign-arrow-motif{width:340px;height:340px;border-radius:50%;border:1px solid var(--ign-hair2);display:flex;align-items:center;justify-content:center;position:relative}
.ign-arrow-motif::before{content:"";position:absolute;inset:42px;border-radius:50%;border:1px solid var(--ign-hair);}
.ign-arrow-motif .glyph{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:200px;line-height:1;transform:translateY(-6px)}
.ign-svc-pills{display:flex;flex-wrap:wrap;gap:12px;border-top:1px solid var(--ign-hair);padding-top:28px}
.ign-svc-pills span{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.04em;color:var(--ign-ink2);
  border:1px solid var(--ign-hair2);border-radius:999px;padding:11px 22px;white-space:nowrap;display:inline-flex;align-items:center;gap:10px}
.ign-svc-pills span::before{content:"↗";color:var(--ign-a);font-family:'Space Grotesk',sans-serif}
.ign-svc-pills span.on{color:var(--ign-a);border-color:rgba(255,110,46,0.55)}
`;

const SERVICES = [
  { t: '搜索引擎优化', e: 'Search' },
  { t: '网站开发与维护', e: 'Web Dev' },
  { t: '转化率优化', e: 'Convert' },
  { t: '付费搜索投放', e: 'Paid Media' },
  { t: '数据分析与归因', e: 'Analytics' },
];
const PILLS = ['关键词映射', '竞品分析', '关键词研究', '网站分析', '内容策略', '流量获取', 'A/B 测试', '技术 SEO'];

export const servicesDefaultProps = {
  surface: 'ink',
  serviceCount: 4,
  emphasis: false,
  emphasisIndex: 0,
  showArrow: true,
  showPills: true,
  pillCount: 6,
  pillActiveIndex: 1,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '05',
  railText: 'Services — 服务',
  navItems: ['服务'],
  navCurrent: 0,
  ixNo: '05',
  ixLabel: 'Services',
  eyebrowNo: '05',
  eyebrowText: 'What we do',
  headingHtml: '不止于<br><span class="ign-ember-text">数字营销</span>。',
  arrowGlyph: '↗',
  services: [
    { t: '搜索引擎优化', e: 'Search' },
    { t: '网站开发与维护', e: 'Web Dev' },
    { t: '转化率优化', e: 'Convert' },
    { t: '付费搜索投放', e: 'Paid Media' },
    { t: '数据分析与归因', e: 'Analytics' },
  ],
  pills: ['关键词映射', '竞品分析', '关键词研究', '网站分析', '内容策略', '流量获取', 'A/B 测试', '技术 SEO'],
};

export const servicesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'serviceCount', type: 'slider', label: '服务条目数', default: 4, min: 3, max: 5, step: 1, describe: '左侧服务清单的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条服务，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的服务序号（从 0 起）。' },
  { key: 'showArrow', type: 'toggle', label: '箭头母题', default: true, describe: '右侧的圆环箭头品牌母题。' },
  { key: 'showPills', type: 'toggle', label: '能力标签行', default: true, describe: '底部的能力标签胶囊行。' },
  { key: 'pillCount', type: 'slider', label: '标签数量', default: 6, min: 3, max: 8, step: 1, describe: '能力标签的数量。' },
  { key: 'pillActiveIndex', type: 'slider', label: '高亮标签序号', default: 1, min: 0, max: 7, step: 1, describe: '高亮为实底的标签序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰眉标。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function ServicesSlide(props) {
  injectCSS('ign-svc-css', CSS);
  const p = { ...servicesDefaultProps, ...props };
  const count = clampInt(p.serviceCount, 3, 5);
  const services = (Array.isArray(p.services) ? p.services : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const pc = clampInt(p.pillCount, 3, 8);
  const pills = (Array.isArray(p.pills) ? p.pills : []).slice(0, pc);
  const pai = clampInt(p.pillActiveIndex, 0, pc - 1);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-svc">
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

        <div className="ign-svc-body ign-a1">
          <div className="ign-svc-l">
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowText}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            <div className="ign-svc-list">
              {services.map((s, i) => (
                <div key={i} className={`ign-svc-row ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                  <span className="n">{String(i + 1).padStart(2, '0')}</span><span className="t">{s.t}</span><span className="e">{s.e}</span>
                </div>
              ))}
            </div>
          </div>
          {p.showArrow && (
            <div className="ign-svc-art">
              <div className="ign-arrow-motif"><EmberText className="glyph">{p.arrowGlyph}</EmberText></div>
            </div>
          )}
        </div>

        {p.showPills && (
          <div className="ign-svc-pills ign-a3">
            {pills.map((x, i) => <span key={i} className={i === pai ? 'on' : ''}>{x}</span>)}
          </div>
        )}
      </Frame>
    </Slide>
  );
}
