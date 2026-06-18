/* Slide04Outcomes.jsx — IGNIS deck · outcomes + CTA dashboard page. */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-out .ign-frame{justify-content:space-between}
.ign-out .b1{width:1860px;height:720px;left:50%;bottom:-300px;transform:translateX(-50%);
  background:radial-gradient(50% 70% at 50% 100%,rgba(255,150,70,0.55),rgba(255,90,35,0) 64%),
  radial-gradient(70% 90% at 50% 100%,rgba(226,42,12,0.4),rgba(120,20,8,0) 72%);filter:blur(46px)}
.ign-out .ign-ghost{font-size:560px;left:60px;top:-60px}
.ign-out-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:34px}
.ign-out-head h2{font-size:62px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-out-head h2 .ign-serif{color:var(--ign-a)}
.ign-out-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:24px;color:var(--ign-ink3);max-width:300px;text-align:right}
.ign-stat-grid{display:grid;gap:0}
.ign-stat-cell{padding:30px 44px 30px 0}
.ign-stat-cell + .ign-stat-cell{border-left:1px solid var(--ign-hair);padding-left:44px}
.ign-stat-cell .sv{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:84px;line-height:0.9;letter-spacing:-0.04em}
.ign-stat-cell .sl{font-size:26px;font-weight:300;color:var(--ign-ink2);margin-top:14px}
.ign-bars{display:flex;align-items:flex-end;gap:7px;height:56px;margin-top:22px}
.ign-bars i{flex:1;background:var(--ign-ink4);border-radius:2px}
.ign-bars i.hot{background:linear-gradient(180deg,var(--ign-a),var(--ign-b))}
.ign-ribbon{display:flex;align-items:center;border-top:1px solid var(--ign-hair);padding-top:26px}
.ign-rstep{display:flex;align-items:center;gap:14px}
.ign-rstep .rn{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-a)}
.ign-rstep .rt{font-size:26px;color:var(--ign-ink2);white-space:nowrap}
.ign-rarrow{flex:1;height:1px;background:linear-gradient(90deg,var(--ign-hair2),var(--ign-hair));margin:0 22px;position:relative}
.ign-rarrow::after{content:"";position:absolute;right:0;top:-3px;width:7px;height:7px;border-top:1px solid var(--ign-ink3);border-right:1px solid var(--ign-ink3);transform:rotate(45deg)}
.ign-out-cta{display:flex;align-items:flex-end;justify-content:space-between;gap:40px}
.ign-quote{display:flex;align-items:center;gap:26px;max-width:760px}
.ign-quote .qtext .q{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:30px;line-height:1.4;color:var(--ign-ink)}
.ign-quote .qtext .qa{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.1em;color:var(--ign-ink3);margin-top:14px}
.ign-out-cta .right{text-align:right;flex:none}
.ign-out-cta .cs{font-family:'Space Grotesk',sans-serif;font-size:24px;color:var(--ign-ink3);margin-bottom:16px;letter-spacing:0.06em;white-space:nowrap}
.ign-out-cta .cta{display:inline-flex;align-items:center;gap:16px;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:40px;letter-spacing:-0.01em;white-space:nowrap;
  color:var(--ign-ink);padding-top:18px;border-top:1px solid var(--ign-hair2)}
.ign-out-cta .cta .arw{color:var(--ign-b);font-size:34px}
`;

const STATS = [
  { v: '+182%', l: '自然搜索流量 · 12 月平均增幅', bars: [22, 30, 28, 42, 52, 64, 82, 100], hotFrom: 6 },
  { v: '3.8×', l: '转化率提升 · 较投放前基线', bars: [26, 24, 38, 46, 44, 60, 78, 96], hotFrom: 6 },
  { v: '−41%', l: '单客获取成本 · 持续优化下降', bars: [100, 90, 72, 66, 54, 48, 40, 34], hotTo: 2 },
];
const RIBBON = ['关键词研究', '落地页搭建', 'A/B 测试', '转化率优化', '规模化复利'];

export const outcomesDefaultProps = {
  surface: 'ember',
  statCount: 3,
  emphasis: false,
  emphasisIndex: 0,
  showBars: true,
  showRibbon: true,
  ribbonStepCount: 5,
  showQuote: true,
  avatarCount: 0,
  avatar: [],
  showNote: true,
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '03',
  railText: 'Outcomes — 成果',
  navItems: ['封面', '方法', '实证', '成果'],
  navCurrent: 3,
  ixNo: '03',
  ixLabel: 'Outcomes',
  headingHtml: '用数据，<span class="ign-ember-text">点燃增长</span>。',
  noteHtml: '三类核心指标，<br>跨 2,400+ 品牌的中位表现。',
  stats: [
    { v: '+182%', l: '自然搜索流量 · 12 月平均增幅', bars: [22, 30, 28, 42, 52, 64, 82, 100], hotFrom: 6 },
    { v: '3.8×', l: '转化率提升 · 较投放前基线', bars: [26, 24, 38, 46, 44, 60, 78, 96], hotFrom: 6 },
    { v: '−41%', l: '单客获取成本 · 持续优化下降', bars: [100, 90, 72, 66, 54, 48, 40, 34], hotTo: 2 },
  ],
  ribbon: ['关键词研究', '落地页搭建', 'A/B 测试', '转化率优化', '规模化复利'],
  quoteText: '“一支团队，搞定过去三家代理才做完的事。”',
  quoteAttr: '— Sarah Chen · 增长负责人',
  ctaSub: 'hello@ignis.cn · 通往收入的 shortest 路径',
  ctaText: '预约增长诊断',
};

export const outcomesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'statCount', type: 'slider', label: '数据卡数量', default: 3, min: 1, max: 3, step: 1, describe: '关键数据卡片的数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一张数据卡，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 2, step: 1, describe: '需要突出的数据卡序号（从 0 起）。' },
  { key: 'showBars', type: 'toggle', label: '迷你趋势图', default: true, describe: '每张数据卡下方的迷你柱状趋势。' },
  { key: 'showRibbon', type: 'toggle', label: '流程飘带', default: true, describe: '中部的流程步骤飘带。' },
  { key: 'ribbonStepCount', type: 'slider', label: '流程节点数', default: 5, min: 3, max: 5, step: 1, describe: '流程飘带的节点数量。' },
  { key: 'showQuote', type: 'toggle', label: '引述区块', default: true, describe: '底部客户引述显示与隐藏。' },
  { key: 'avatarCount', type: 'slider', label: '头像图片槽', default: 0, min: 0, max: 1, step: 1, describe: '引述旁的头像图片槽数量（0 或 1），自动按原图比例裁切为圆形。' },
  { key: 'showNote', type: 'toggle', label: '装饰注释', default: true, describe: '标题旁的衬线注释文案。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function OutcomesSlide(props) {
  injectCSS('ign-out-css', CSS);
  const p = { ...outcomesDefaultProps, ...props };
  const count = clampInt(p.statCount, 1, 3);
  const stats = (Array.isArray(p.stats) ? p.stats : []).slice(0, count);
  const emi = clampInt(p.emphasisIndex, 0, count - 1);
  const rc = clampInt(p.ribbonStepCount, 3, 5);
  const ribbon = (Array.isArray(p.ribbon) ? p.ribbon : []).slice(0, rc);
  const avatars = Array.isArray(p.avatar) ? p.avatar : [];
  const showAvatar = clampInt(p.avatarCount, 0, 1) > 0;
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-out">
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

        <div className="ign-out-head ign-a1">
          <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          {p.showNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-stat-grid ign-a2" style={{ gridTemplateColumns: `repeat(${count},1fr)` }}>
          {stats.map((s, i) => (
            <div key={i} className={`ign-stat-cell ${p.emphasis ? (i === emi ? 'ign-lit' : 'ign-dim') : ''}`}>
              <EmberText className="sv">{s.v}</EmberText>
              <div className="sl">{s.l}</div>
              {p.showBars && (
                <div className="ign-bars">
                  {s.bars.map((h, j) => {
                    const hot = s.hotFrom != null ? j >= s.hotFrom : s.hotTo != null ? j <= s.hotTo : false;
                    return <i key={j} className={hot ? 'hot' : ''} style={{ height: h + '%' }} />;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {p.showRibbon && (
          <div className="ign-ribbon ign-a3">
            {ribbon.map((r, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="ign-rarrow" />}
                <div className="ign-rstep"><span className="rn">{String(i + 1).padStart(2, '0')}</span><span className="rt">{r}</span></div>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="ign-out-cta ign-a3">
          {p.showQuote ? (
            <div className="ign-quote">
              {showAvatar && <ImageSlot src={avatars[0]} placeholder="头像" mode="fill" height={86} radius={999} />}
              <div className="qtext">
                <div className="q">{p.quoteText}</div>
                <div className="qa">{p.quoteAttr}</div>
              </div>
            </div>
          ) : <div />}
          <div className="right">
            <div className="cs">{p.ctaSub}</div>
            <div className="cta">{p.ctaText} <span className="arw">↗</span></div>
          </div>
        </div>
      </Frame>
    </Slide>
  );
}
