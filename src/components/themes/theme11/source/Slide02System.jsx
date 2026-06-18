/* Slide02System.jsx — IGNIS deck · approach / operating-system page. */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-os .ign-frame{justify-content:space-between}
.ign-os .b1{width:1400px;height:980px;left:-280px;top:42%;transform:translateY(-50%);
  background:radial-gradient(46% 50% at 50% 50%,rgba(255,110,46,0.36),rgba(226,42,12,0) 70%);filter:blur(50px)}
.ign-os .ign-ghost{font-size:560px;left:60px;bottom:-90px}
.ign-os-top{display:grid;grid-template-columns:1.35fr 1fr;gap:70px;margin-top:40px}
.ign-os-top.solo{grid-template-columns:1fr}
.ign-os-lead .lead-en{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:38px;color:var(--ign-a);margin-bottom:18px}
.ign-os-lead h2{font-size:86px;font-weight:900;line-height:1.02;letter-spacing:-0.03em}
.ign-os-lead p{margin-top:26px;font-size:26px;font-weight:300;line-height:1.55;color:var(--ign-ink2);max-width:560px}
.ign-card{background:var(--ign-panel);border:1px solid var(--ign-hair);border-radius:4px}
.ign-os-card{padding:34px 36px}
.ign-os-card .ch{display:flex;align-items:center;justify-content:space-between;font-family:'Space Grotesk',sans-serif;
  font-size:24px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);padding-bottom:20px;border-bottom:1px solid var(--ign-hair)}
.ign-os-card .ch .no{color:var(--ign-a)}
.ign-os-row{display:flex;align-items:baseline;justify-content:space-between;padding:18px 0;border-bottom:1px solid var(--ign-hair)}
.ign-os-row:last-child{border-bottom:none;padding-bottom:0}
.ign-os-row .k{font-size:26px;color:var(--ign-ink2)}
.ign-os-row .v{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:30px;white-space:nowrap}
.ign-os-row .v em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;color:var(--ign-a);font-size:24px}
.ign-flow{display:flex;align-items:stretch}
.ign-fstep{flex:1;padding-top:30px;border-top:1px solid var(--ign-hair);position:relative}
.ign-fstep::before{content:"";position:absolute;top:-5px;left:0;width:9px;height:9px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 14px var(--ign-b)}
.ign-fstep .fn{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;color:var(--ign-a)}
.ign-fstep .ft{font-size:36px;font-weight:700;margin-top:18px}
.ign-fstep .ft .ign-serif{color:var(--ign-ink2);font-size:28px}
.ign-fstep .fd{margin-top:14px;font-size:26px;font-weight:300;line-height:1.5;color:var(--ign-ink2);max-width:330px}
.ign-fconn{width:84px;flex:none;border-top:1px solid var(--ign-hair);position:relative}
.ign-fconn::after{content:"";position:absolute;top:-4px;left:50%;transform:translate(-50%,0) rotate(45deg);
  width:8px;height:8px;border-top:1.5px solid var(--ign-b);border-right:1.5px solid var(--ign-b)}
`;

const Conn = () => (
  <div className="ign-fconn" />
);

export const systemDefaultProps = {
  surface: 'paper',
  showSidePanel: true,
  stepCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '01',
  railText: 'Operating System — 方法',
  navItems: ['封面', '方法', '实证', '成果'],
  navCurrent: 1,
  ixNo: '01',
  ixLabel: 'Operating System',
  leadEn: 'Seamless onboarding.',
  headingHtml: '无缝接入，<br><span class="ign-ember-text">卓越成效</span>。',
  leadText: '燃点像团队的一部分一样运转——把目标、节奏与责任装进同一套增长操作系统，从第一天起就开始产出。',
  panelTitle: '交付节奏',
  panelTag: 'CADENCE',
  panelRows: [
    { k: '首次见效', v: '14 <em>天</em>' },
    { k: '协作透明度', v: '100<em>%</em>' },
    { k: '周迭代次数', v: '3<em>×</em>' },
  ],
  steps: [
    { fn: '01 — Team', t: '协作', en: 'faster', d: '作为你团队的延伸而存在，主动推进、快速交付，省去反复对齐的内耗。' },
    { fn: '02 — Goals', t: '目标', en: 'sooner', d: '把增长目标拆成清晰优先级，第一天就排进可执行的行动日程。' },
    { fn: '03 — Attitude', t: '结果', en: 'first', d: '用数据说话、对结果负责，这是燃点区别于其他营销伙伴的态度。' },
  ],
  metaLeft: 'IGNIS — 燃点 · 增长操作系统',
  metaMid: '让每一次曝光都通向收入',
};

export const systemControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showSidePanel', type: 'toggle', label: '侧栏信息卡', default: true, describe: '右上角的指标信息卡显示与隐藏；隐藏时主标题占满整行。' },
  { key: 'stepCount', type: 'slider', label: '步骤数量', default: 3, min: 2, max: 3, step: 1, describe: '底部流程步骤的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一步骤，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的步骤序号（从 0 起），仅在“重点突出”开启时生效。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function SystemSlide(props) {
  injectCSS('ign-os-css', CSS);
  const p = { ...systemDefaultProps, ...props };
  const count = clampInt(p.stepCount, 2, 3);
  const steps = (Array.isArray(p.steps) ? p.steps : []).slice(0, count);
  const panelRows = Array.isArray(p.panelRows) ? p.panelRows : [];
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const emi = clampInt(p.emphasisIndex, 0, count - 1);

  return (
    <Slide surface={p.surface} className="ign-os">
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

        <div className={`ign-os-top ign-a1 ${p.showSidePanel ? '' : 'solo'}`}>
          <div className="ign-os-lead">
            <div className="lead-en">{p.leadEn}</div>
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            <p>{p.leadText}</p>
          </div>
          {p.showSidePanel && (
            <div className="ign-card ign-os-card">
              <div className="ch"><span>{p.panelTitle}</span><span className="no">{p.panelTag}</span></div>
              {panelRows.map((r, i) => (
                <div key={i} className="ign-os-row"><span className="k">{r.k}</span><span className="v" dangerouslySetInnerHTML={{ __html: r.v }} /></div>
              ))}
            </div>
          )}
        </div>

        <div className="ign-flow ign-a2">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Conn />}
              <div className={`ign-fstep ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
                <div className="fn">{s.fn}</div>
                <div className="ft">{s.t} <span className="ign-serif">{s.en}</span></div>
                <div className="fd">{s.d}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '9%' }} /></span> 7 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
