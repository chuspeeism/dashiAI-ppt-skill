/* Slide74Next.jsx — IGNIS deck · "next steps" section / transition page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: nextDefaultProps (complete defaults) + nextControls (1:1).
 *
 * Section page. A penultimate transition that turns the pitch into action: an
 * oversized "下一步" title with a typographic agenda of concrete next moves —
 * numbered lines with arrows, no UI controls. Distinct from Section (11,
 * opening) and Chapter (40, mid-deck divider): this is the hand-off beat right
 * before the closing. Step count and the highlighted step are prop-driven.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-nxt .ign-frame{justify-content:space-between}
.ign-nxt .b1{width:1280px;height:980px;right:-300px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.2),rgba(226,42,12,0) 68%);filter:blur(64px)}
.ign-nxt .ign-ghost{font-size:560px;left:-20px;bottom:-180px}
.ign-nxt-body{flex:1;display:grid;grid-template-columns:0.92fr 1.08fr;gap:64px;align-items:center;margin-top:10px}
.ign-nxt-l{display:flex;flex-direction:column}
.ign-nxt-l .tag{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:24px}
.ign-nxt-l h2{font-size:128px;font-weight:900;line-height:0.92;letter-spacing:-0.04em}
.ign-nxt-l h2 .ign-serif{color:var(--ign-a)}
.ign-nxt-l p{font-size:25px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:28px;max-width:420px;text-wrap:pretty}
.ign-nxt-steps{display:flex;flex-direction:column}
.ign-nxt-step{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:26px;
  padding:26px 0;border-bottom:1px solid var(--ign-hair)}
.ign-nxt-step:first-child{border-top:1px solid var(--ign-hair)}
.ign-nxt-step .no{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:30px;letter-spacing:0.02em;color:var(--ign-ink3)}
.ign-nxt-step .bd{display:flex;flex-direction:column;gap:7px;min-width:0}
.ign-nxt-step .t{font-size:34px;font-weight:700;letter-spacing:-0.01em}
.ign-nxt-step .d{font-size:21px;font-weight:300;color:var(--ign-ink2);line-height:1.45;text-wrap:pretty}
.ign-nxt-step .ar{font-family:'Space Grotesk',sans-serif;font-size:30px;color:var(--ign-ink3);align-self:center}
.ign-nxt-step.lead .no{color:var(--ign-a)}
.ign-nxt-step.lead .t{color:transparent;background:linear-gradient(120deg,#FFC07A,#FF6E2E 52%,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-nxt-step.lead .ar{color:var(--ign-b)}
.ign-nxt-when{display:flex;align-items:center;gap:16px;margin-top:30px;font-family:'Space Grotesk',sans-serif;
  font-size:23px;letter-spacing:0.04em;color:var(--ign-ink2)}
.ign-nxt-when .ln{flex:1;height:1px;background:var(--ign-hair)}
`;

export const nextDefaultProps = {
  surface: 'paper',
  stepCount: 3,
  emphasis: true,
  emphasisIndex: 0,
  showTag: true,
  showLede: true,
  showArrows: true,
  showDesc: true,
  showWhen: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '↗',
  railText: 'Next — 下一步',
  navItems: ['下一步'],
  navCurrent: 0,
  ixNo: '73',
  ixLabel: 'Next',
  tagText: '从这里开始 / Where we go next',
  headingHtml: '下一步，<br><span class="ign-ember-text">就一步</span>。',
  lede: '不必推翻什么。先做一次诊断，挑出能立刻发力的地方——然后点火。',
  arrowGlyph: '→',
  whenLeft: '最快本周即可启动',
  whenRight: '14 天见首个数据',
  steps: [
    { t: '一次增长诊断', d: '我们看你的数据，给出可执行的增长缺口清单。' },
    { t: '锁定首月路线', d: '挑出 2–3 个高杠杆动作，排进六个月节奏。' },
    { t: '点火，开始复利', d: '上线、测量、放大赢家——让引擎自己转起来。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 下一步',
  metaMid: '少说一句，多走一步',
};

export const nextControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'stepCount', type: 'slider', label: '步骤数量', default: 3, min: 2, max: 4, step: 1, describe: '下一步行动的条目数量。' },
  { key: 'emphasis', type: 'toggle', label: '首步突出', default: true, describe: '开启后第一步点亮为暖橙。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的步骤序号（从 0 起）。' },
  { key: 'showTag', type: 'toggle', label: '顶部标签', default: true, describe: '大标题上方的小标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '大标题下方的说明段落。' },
  { key: 'showArrows', type: 'toggle', label: '箭头母题', default: true, describe: '每步右侧的流向箭头。' },
  { key: 'showDesc', type: 'toggle', label: '步骤说明', default: true, describe: '每步的一句话说明。' },
  { key: 'showWhen', type: 'toggle', label: '时间注脚', default: true, describe: '步骤下方的「最快多久启动」注脚。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function NextSlide(props) {
  injectCSS('ign-nxt-css', CSS);
  const p = { ...nextDefaultProps, ...props };
  const n = clampInt(p.stepCount, 2, 4);
  const steps = (Array.isArray(p.steps) ? p.steps : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-nxt">
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

        <div className="ign-nxt-body">
          <div className="ign-nxt-l ign-a1">
            {p.showTag && <div className="tag">{p.tagText}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
          </div>

          <div className="ign-nxt-r ign-a2">
            <div className="ign-nxt-steps">
              {steps.map((s, i) => (
                <div key={i} className={`ign-nxt-step ${p.emphasis && i === emi ? 'lead' : ''}`}>
                  <span className="no">{String(i + 1).padStart(2, '0')}</span>
                  <div className="bd">
                    <span className="t">{s.t}</span>
                    {p.showDesc && <span className="d">{s.d}</span>}
                  </div>
                  {p.showArrows && <span className="ar">{p.arrowGlyph}</span>}
                </div>
              ))}
            </div>
            {p.showWhen && (
              <div className="ign-nxt-when"><span>{p.whenLeft}</span><span className="ln" /><span>{p.whenRight}</span></div>
            )}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '89%' }} /></span> 73 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
