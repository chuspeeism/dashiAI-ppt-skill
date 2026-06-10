/* Slide29Roster.jsx — IGNIS deck · team-roster image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: rosterDefaultProps (complete defaults) + rosterControls (1:1).
 *
 * Image page. A manifesto sits beside a row of portrait cards; each card has an
 * adaptive avatar slot (0–n filled, the rest fall back to an elegant monogram).
 * Distinct from the single-portrait Voice page and the generic Gallery grid.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-ros .ign-frame{justify-content:space-between}
.ign-ros .b1{width:1200px;height:1200px;left:-260px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,130,60,0.42),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-ros .ign-ghost{font-size:520px;right:20px;bottom:-130px}
.ign-ros-body{flex:1;display:grid;grid-template-columns:0.82fr 1.18fr;gap:80px;align-items:center;margin-top:8px}
.ign-ros-head .lead{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:28px;color:var(--ign-a);margin-bottom:14px}
.ign-ros-head h2{font-size:72px;font-weight:900;line-height:0.98;letter-spacing:-0.03em}
.ign-ros-head h2 .ign-serif{color:var(--ign-a)}
.ign-ros-head p{font-size:24px;font-weight:300;line-height:1.55;color:var(--ign-ink2);margin-top:26px;max-width:430px;text-wrap:pretty}
.ign-ros-row{display:grid;gap:30px}
.ign-ros-card{display:flex;flex-direction:column}
.ign-ros-port{position:relative;width:100%;aspect-ratio:3/4;overflow:hidden;border:1px solid var(--ign-hair)}
.ign-ros-port.circle{aspect-ratio:1/1;border-radius:50%}
.ign-ros-mono{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:repeating-linear-gradient(135deg,var(--ign-panel) 0 11px,transparent 11px 22px)}
.ign-ros-mono span{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:90px;letter-spacing:0.02em;
  background:var(--ign-ember);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0.9}
.ign-ros-name{font-size:30px;font-weight:700;margin-top:20px;letter-spacing:-0.01em}
.ign-ros-role{font-size:23px;font-weight:300;color:var(--ign-ink2);margin-top:6px}
.ign-ros-en{font-family:'Space Grotesk',sans-serif;font-size:18px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);margin-top:10px;
  padding-top:12px;border-top:1px solid var(--ign-hair)}
`;

export const rosterDefaultProps = {
  surface: 'ember',
  memberCount: 4,
  avatarCount: 0,
  avatars: [],
  portraitShape: 'rounded',
  showRoles: true,
  showEn: true,
  showLede: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '团队',
  railText: 'Team — 团队',
  navItems: ['团队'],
  navCurrent: 0,
  ixNo: '29',
  ixLabel: 'Team',
  lead: 'One team, not five vendors.',
  headingHtml: '一支队，<br><span class="ign-ember-text">跑通全链路</span>。',
  lede: '策略、内容、转化、工程坐在同一张桌子上——没有交接成本，没有互相甲锅，只有一个对增长负责的团队。',
  members: [
    { name: '林 远', role: '增长策略总监', en: 'Strategy', mono: '远' },
    { name: '苏 黎', role: '内容与SEO主理', en: 'Content / SEO', mono: '黎' },
    { name: '陈 默', role: '转化与数据负责', en: 'CRO / Data', mono: '默' },
    { name: '何 川', role: '前端与性能工程', en: 'Web / Perf', mono: '川' },
  ],
  metaLeft: 'IGNIS — 燃点 · 核心团队',
  metaMid: '一张桌子，一个目标',
};

export const rosterControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'memberCount', type: 'slider', label: '成员数量', default: 4, min: 2, max: 4, step: 1, describe: '展示的成员卡片数量。' },
  { key: 'avatarCount', type: 'slider', label: '头像槽数量', default: 0, min: 0, max: 4, step: 1, describe: '使用真实照片的成员数量；其余回退为字号大的姓氏字符。' },
  { key: 'portraitShape', type: 'select', label: '头像形状', default: 'rounded',
    options: [{ value: 'rounded', label: '竖版方形' }, { value: 'circle', label: '圆形' }], describe: '头像槽的裁切形状。' },
  { key: 'showRoles', type: 'toggle', label: '职务', default: true, describe: '姓名下方的中文职务。' },
  { key: 'showEn', type: 'toggle', label: '英文标签', default: true, describe: '卡片底部的英文职能标签。' },
  { key: 'showLede', type: 'toggle', label: '说明文案', default: true, describe: '左侧标题下方的说明段落。' },
  { key: 'showKicker', type: 'toggle', label: '装饰引言', default: true, describe: '标题上方的衬线引言。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function RosterSlide(props) {
  injectCSS('ign-ros-css', CSS);
  const p = { ...rosterDefaultProps, ...props };
  const count = clampInt(p.memberCount, 2, 4);
  const members = (Array.isArray(p.members) ? p.members : []).slice(0, count);
  const avatars = Array.isArray(p.avatars) ? p.avatars : [];
  const filled = clampInt(p.avatarCount, 0, count);
  const circle = p.portraitShape === 'circle';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-ros">
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

        <div className="ign-ros-body">
          <div className="ign-ros-head ign-a1">
            {p.showKicker && <div className="lead">{p.lead}</div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
            {p.showLede && <p>{p.lede}</p>}
          </div>

          <div className="ign-ros-row ign-a2" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
            {members.map((m, i) => (
              <div key={i} className="ign-ros-card">
                <div className={`ign-ros-port ${circle ? 'circle' : ''}`}>
                  {i < filled
                    ? <ImageSlot src={avatars[i]} placeholder={m.mono} mode="fill" fit="cover" radius={circle ? 999 : 0} />
                    : <div className="ign-ros-mono"><span>{m.mono}</span></div>}
                </div>
                <div className="ign-ros-name">{m.name}</div>
                {p.showRoles && <div className="ign-ros-role">{m.role}</div>}
                {p.showEn && <div className="ign-ros-en">{m.en}</div>}
              </div>
            ))}
          </div>
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '35%' }} /></span> 29 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
