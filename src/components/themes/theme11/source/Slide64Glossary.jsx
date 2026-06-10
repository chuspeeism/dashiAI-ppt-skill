/* Slide64Glossary.jsx — IGNIS deck · defined-terms lexicon table page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: glossaryDefaultProps (complete defaults) + glossaryControls (1:1).
 *
 * Table page. A two-column lexicon: numbered term (zh + en) on the left, its
 * plain-language definition on the right, divided by hairlines. Distinct from
 * FAQ (39, Q/A), Versus (47, check/cross) and Sheet (54, delivery rows) — this
 * is the deck's vocabulary key, aligning everyone on what the words mean.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-gls .ign-frame{justify-content:space-between}
.ign-gls .b1{width:1240px;height:880px;right:-200px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.22),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-gls .ign-ghost{font-size:540px;left:10px;bottom:-160px}
.ign-gls-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-gls-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-gls-head h2 .ign-serif{color:var(--ign-a)}
.ign-gls-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-gls-list{flex:1;display:flex;flex-direction:column;justify-content:center;margin-top:18px;border-top:1px solid var(--ign-hair2)}
.ign-gls-row{display:grid;grid-template-columns:62px 0.74fr 1.26fr;align-items:baseline;gap:36px;padding:24px 0;border-bottom:1px solid var(--ign-hair)}
.ign-gls-no{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-ink3);letter-spacing:0.02em}
.ign-gls-term .t{font-size:34px;font-weight:700;letter-spacing:-0.01em;line-height:1.04}
.ign-gls-term .e{display:block;font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:0.12em;
  text-transform:uppercase;color:var(--ign-ink3);margin-top:8px}
.ign-gls-def{font-size:26px;font-weight:300;line-height:1.46;color:var(--ign-ink2);text-wrap:pretty}
.ign-gls-def b{font-weight:600;color:var(--ign-ink)}
.ign-gls-row.lead .ign-gls-term .t{color:var(--ign-a)}
.ign-gls-row.dim{opacity:0.32;filter:saturate(0.5)}
`;

export const glossaryDefaultProps = {
  surface: 'ember',
  rowCount: 5,
  showNumbers: true,
  showEnTerm: true,
  emphasis: false,
  emphasisIndex: 0,
  showNote: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: 'A→Z',
  railText: 'Lexicon — 术语',
  navItems: ['术语'],
  navCurrent: 0,
  ixNo: '63',
  ixLabel: 'Lexicon',
  eyebrowNo: '先对齐词',
  eyebrowEn: 'Speak the same language',
  headingHtml: '同一套词，<span class="ign-ember-text">才聊得到一块</span>。',
  noteHtml: '五个关键词<br>读懂它们，就读懂了燃点怎么干活。',
  terms: [
    { t: '增长资产', e: 'Growth Asset', d: '不随投放停摆而消失的东西——内容、口碑、自然排名。<b>越攒越多，不花钱也在涨。</b>' },
    { t: '复利留存', e: 'Compounding', d: '老用户带新用户、内容带流量，<b>增长自己滚增长</b>，而不是每月从零开始买。' },
    { t: '单一看板', e: 'One Dashboard', d: '把散落的报表收成一块板，<b>直接对齐利润</b>，而不是对齐点击与曝光。' },
    { t: '接入即用', e: 'Plug-in', d: '不改你的组织、不换你的系统，<b>14 天接上就跑</b>，增长团队即插即用。' },
    { t: '自然托底', e: 'Organic Floor', d: '投放是油门，自然流量是底盘；<b>停了投放也不至于归零</b>。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 关键词表',
  metaMid: '词对了，事就顺了',
};

export const glossaryControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'rowCount', type: 'slider', label: '词条数量', default: 5, min: 3, max: 5, step: 1, describe: '术语定义的词条数量。' },
  { key: 'showNumbers', type: 'toggle', label: '词条序号', default: true, describe: '每条左侧的序号。' },
  { key: 'showEnTerm', type: 'toggle', label: '英文术语', default: true, describe: '中文术语下方的英文对照。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一词条，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 4, step: 1, describe: '需要突出的词条序号（从 0 起）。' },
  { key: 'showNote', type: 'toggle', label: '右上注释', default: true, describe: '标题右侧的衬线注释。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function GlossarySlide(props) {
  injectCSS('ign-gls-css', CSS);
  const p = { ...glossaryDefaultProps, ...props };
  const n = clampInt(p.rowCount, 3, 5);
  const terms = (Array.isArray(p.terms) ? p.terms : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-gls">
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

        <div className="ign-gls-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-gls-list ign-a2">
          {terms.map((t, i) => (
            <div key={i} className={`ign-gls-row ${p.emphasis && i === emi ? 'lead' : ''} ${p.emphasis && i !== emi ? 'dim' : ''}`}>
              {p.showNumbers && <div className="ign-gls-no">{String(i + 1).padStart(2, '0')}</div>}
              <div className="ign-gls-term" style={p.showNumbers ? null : { gridColumn: '1 / 3' }}>
                <span className="t">{t.t}</span>
                {p.showEnTerm && <span className="e">{t.e}</span>}
              </div>
              <div className="ign-gls-def" dangerouslySetInnerHTML={{ __html: t.d }} />
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 18 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '77%' }} /></span> 63 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
