/* Slide67AppFlow.jsx — IGNIS deck · multi-screen app-flow image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: appflowDefaultProps (complete defaults) + appflowControls (1:1).
 *
 * Image page. A horizontal sequence of 2–4 phone-screen mocks connected by
 * arrows, each carrying a step number and a one-line caption — the user's
 * journey rendered as a storyboard. Distinct from Device (32, one browser
 * frame) and Cards (55, case row): here the through-line BETWEEN screens is
 * the message. Screen slots cover-fill the phone aspect; 0 images falls back
 * to striped placeholders so the row stays balanced at any count.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-afl .ign-frame{justify-content:space-between}
.ign-afl .b1{width:1480px;height:760px;left:50%;top:60%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.20),rgba(226,42,12,0) 70%);filter:blur(60px)}
.ign-afl .ign-ghost{font-size:520px;right:-10px;bottom:-150px}
.ign-afl .ign-eyebrow{white-space:nowrap}
.ign-afl-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:24px}
.ign-afl-head h2{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-afl-head h2 .ign-serif{color:var(--ign-a)}
.ign-afl-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:24px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-afl-row{flex:1;display:flex;align-items:center;justify-content:center;gap:0;margin-top:8px}
.ign-afl-step{display:flex;flex-direction:column;align-items:center;gap:22px;flex:0 0 auto}
.ign-afl-phone{position:relative;width:228px;aspect-ratio:9 / 19;border-radius:30px;padding:9px;
  background:linear-gradient(150deg,rgba(255,255,255,0.10),rgba(255,255,255,0.02));
  border:1px solid var(--ign-hair2);box-shadow:0 30px 60px rgba(0,0,0,0.42)}
.ign-afl-screen{position:relative;width:100%;height:100%;border-radius:22px;overflow:hidden;background:var(--ign-panel)}
.ign-afl-screen .ign-imgslot{width:100%;height:100%;border-radius:22px}
.ign-afl-notch{position:absolute;z-index:3;top:12px;left:50%;transform:translateX(-50%);
  width:74px;height:7px;border-radius:6px;background:rgba(0,0,0,0.45)}
.ign-afl-cap{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;max-width:228px}
.ign-afl-no{display:flex;align-items:center;gap:10px;font-family:'Space Grotesk',sans-serif;font-weight:500;
  font-size:20px;letter-spacing:0.14em;color:var(--ign-a)}
.ign-afl-no::before{content:"";width:24px;height:1px;background:linear-gradient(90deg,transparent,var(--ign-b))}
.ign-afl-no::after{content:"";width:24px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-afl-ct{font-size:26px;font-weight:700;letter-spacing:-0.01em}
.ign-afl-cd{font-size:19px;font-weight:300;color:var(--ign-ink2);line-height:1.4;text-wrap:pretty}
.ign-afl-arrow{flex:0 0 auto;width:64px;display:flex;align-items:center;justify-content:center;
  align-self:flex-start;margin-top:148px;color:var(--ign-ink3);font-size:30px}
.ign-afl-arrow span{display:block;transform:translateY(-2px)}
.ign-afl-step.dim{opacity:0.34;filter:saturate(0.5)}
`;

export const appflowDefaultProps = {
  surface: 'ink',
  screenCount: 4,
  images: [],
  showArrows: true,
  showSteps: true,
  showCaptions: true,
  emphasis: false,
  emphasisIndex: 0,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '→',
  railText: 'Flow — 旅程',
  navItems: ['旅程'],
  navCurrent: 0,
  ixNo: '66',
  ixLabel: 'Flow',
  eyebrowNo: '用户旅程',
  eyebrowEn: 'The journey',
  headingHtml: '从被看见，<span class="ign-ember-text">到留下来</span>。',
  noteHtml: '同一条路径，<br>每一屏都在替转化让路。',
  stepLabel: 'STEP',
  arrowGlyph: '→',
  steps: [
    { t: '看见', d: '一次精准曝光，把对的人引到对的入口。' },
    { t: '进入', d: '落地页直给价值，3 秒内说清「为什么是你」。' },
    { t: '行动', d: '路径无摩擦，把犹豫拦在按钮之前。' },
    { t: '复购', d: '私域承接沉淀，把一次成交变成复利。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 用户旅程',
  metaMid: '每一屏都在替转化让路',
};

export const appflowControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'screenCount', type: 'slider', label: '屏幕数量', default: 4, min: 2, max: 4, step: 1, describe: '横向排列的手机屏数量（流程步数）。' },
  { key: 'showArrows', type: 'toggle', label: '连接箭头', default: true, describe: '屏与屏之间的流向箭头。' },
  { key: 'showSteps', type: 'toggle', label: '步骤序号', default: true, describe: '每屏下方的步骤序号。' },
  { key: 'showCaptions', type: 'toggle', label: '步骤说明', default: true, describe: '每屏下方的一句话说明。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一屏，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的屏序号（从 0 起）。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function AppFlowSlide(props) {
  injectCSS('ign-afl-css', CSS);
  const p = { ...appflowDefaultProps, ...props };
  const n = clampInt(p.screenCount, 2, 4);
  const steps = (Array.isArray(p.steps) ? p.steps : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const images = Array.isArray(p.images) ? p.images : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-afl">
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

        <div className="ign-afl-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-afl-row ign-a2">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`ign-afl-step ${p.emphasis && i !== emi ? 'dim' : ''}`}>
                <div className="ign-afl-phone">
                  <span className="ign-afl-notch" />
                  <div className="ign-afl-screen">
                    <ImageSlot src={images[i]} placeholder={`屏 ${i + 1}`} mode="fill" radius={22} />
                  </div>
                </div>
                <div className="ign-afl-cap">
                  {p.showSteps && <div className="ign-afl-no">{p.stepLabel} {String(i + 1).padStart(2, '0')}</div>}
                  <div className="ign-afl-ct">{s.t}</div>
                  {p.showCaptions && <div className="ign-afl-cd">{s.d}</div>}
                </div>
              </div>
              {p.showArrows && i < n - 1 && <div className="ign-afl-arrow"><span>{p.arrowGlyph}</span></div>}
            </React.Fragment>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '80%' }} /></span> 66 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
