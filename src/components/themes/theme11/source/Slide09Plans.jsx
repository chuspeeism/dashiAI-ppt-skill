/* Slide09Plans.jsx — IGNIS deck · pricing / engagement-tiers page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: plansDefaultProps (complete defaults) + plansControls (1:1).
 */
import { Slide, Bloom, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-plans .ign-frame{justify-content:space-between}
.ign-plans .b1{width:1300px;height:820px;left:50%;top:58%;transform:translate(-50%,-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.24),rgba(226,42,12,0) 70%);filter:blur(54px)}
.ign-plans .ign-ghost{font-size:520px;left:40px;bottom:-90px}
.ign-plans-head{display:flex;align-items:flex-end;justify-content:space-between;margin-top:38px;gap:48px}
.ign-plans-head h2{font-size:70px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-plans-head h2 .ign-serif{color:var(--ign-a)}
.ign-plans-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:26px;color:var(--ign-ink3);max-width:340px;text-align:right;line-height:1.4}
.ign-plans-grid{display:grid;gap:24px}
.ign-plan{border:1px solid var(--ign-hair);border-radius:6px;padding:34px 34px 30px;display:flex;flex-direction:column;position:relative}
.ign-plan.hot{border-color:var(--ign-b);background:rgba(255,110,46,0.05)}
.ign-plan .tag{position:absolute;top:-14px;left:34px;font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;
  text-transform:uppercase;color:var(--ign-b);background:var(--ign-bg);padding:0 12px;display:inline-flex;align-items:center;gap:9px}
.ign-plan .tag::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--ign-b);box-shadow:0 0 11px var(--ign-b)}
.ign-plan .pname{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3)}
.ign-plan .pname em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;text-transform:none;color:var(--ign-a);font-size:26px;letter-spacing:0;margin-left:8px}
.ign-plan .pprice{display:flex;align-items:baseline;gap:8px;margin-top:22px;padding-bottom:24px;border-bottom:1px solid var(--ign-hair)}
.ign-plan .pprice .cur{font-family:'Space Grotesk',sans-serif;font-size:34px;color:var(--ign-ink2)}
.ign-plan .pprice .amt{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:62px;line-height:0.9;letter-spacing:-0.03em}
.ign-plan .pprice .per{font-size:24px;color:var(--ign-ink3);font-family:'Space Grotesk',sans-serif}
.ign-plan .pfeat{list-style:none;margin-top:24px;flex:1}
.ign-plan .pfeat li{display:flex;align-items:flex-start;gap:14px;padding:11px 0;font-size:25px;font-weight:300;color:var(--ign-ink2);line-height:1.4}
.ign-plan .pfeat li::before{content:"↗";color:var(--ign-a);font-family:'Space Grotesk',sans-serif;flex:none;transform:translateY(2px)}
.ign-plan .pcta{margin-top:26px;padding-top:22px;border-top:1px solid var(--ign-hair);display:flex;align-items:center;justify-content:space-between;
  font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:26px;color:var(--ign-ink2)}
.ign-plan .pcta .arw{color:var(--ign-ink3)}
.ign-plan.hot .pcta{color:var(--ign-a)}
.ign-plan.hot .pcta .arw{color:var(--ign-b)}
`;

const PLANS = [
  { name: '启动', en: 'Spark', cur: '¥', amt: '12k', per: '/ 月起', feats: ['搜索引擎优化基础包', '每月内容产出 4 篇', '月度数据看板', '邮件支持'] },
  { name: '增长', en: 'Growth', cur: '¥', amt: '28k', per: '/ 月起', feats: ['SEO + 转化率优化', '付费投放代运营', '每周 A/B 测试迭代', '专属增长策略师', '双周复盘会'] },
  { name: '规模', en: 'Scale', cur: '', amt: '定制', per: '按目标计费', feats: ['全栈增长团队延伸', '多渠道归因建模', '落地页与网站开发', '7×24 优先响应', '季度董事会汇报'] },
];

export const plansDefaultProps = {
  surface: 'paper',
  planCount: 3,
  featured: true,
  featuredIndex: 1,
  featureCount: 4,
  showPriceNote: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '08',
  railText: 'Plans — 套餐',
  navItems: ['套餐'],
  navCurrent: 0,
  ixNo: '08',
  ixLabel: 'Plans',
  eyebrowNo: '08',
  eyebrowText: 'Engagement',
  headingHtml: '合作方式，<span class="ign-ember-text">按目标定价</span>。',
  noteHtml: '无长期捆绑，<br>随增长阶段灵活升降级。',
  tagLabel: 'Most popular',
  ctaHot: '预约增长诊断',
  ctaDefault: '了解详情',
  metaLeft: 'IGNIS — 燃点 · 合作方式',
  metaMid: '一支团队，搞定三家代理的活',
  plans: [
    { name: '启动', en: 'Spark', cur: '¥', amt: '12k', per: '/ 月起', feats: ['搜索引擎优化基础包', '每月内容产出 4 篇', '月度数据看板', '邮件支持'] },
    { name: '增长', en: 'Growth', cur: '¥', amt: '28k', per: '/ 月起', feats: ['SEO + 转化率优化', '付费投放代运营', '每周 A/B 测试迭代', '专属增长策略师', '双周复盘会'] },
    { name: '规模', en: 'Scale', cur: '', amt: '定制', per: '按目标计费', feats: ['全栈增长团队延伸', '多渠道归因建模', '落地页与网站开发', '7×24 优先响应', '季度董事会汇报'] },
  ],
};

export const plansControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'planCount', type: 'slider', label: '套餐数量', default: 3, min: 2, max: 3, step: 1, describe: '价格套餐卡片的数量。' },
  { key: 'featured', type: 'toggle', label: '主推套餐', default: true, describe: '开启后高亮某一张套餐为主推方案。' },
  { key: 'featuredIndex', type: 'slider', label: '主推序号', default: 1, min: 0, max: 2, step: 1, describe: '主推套餐的序号（从 0 起），仅在“主推套餐”开启时生效。' },
  { key: 'featureCount', type: 'slider', label: '权益条目数', default: 4, min: 3, max: 5, step: 1, describe: '每张套餐展示的权益条目数量。' },
  { key: 'showPriceNote', type: 'toggle', label: '价格注释', default: true, describe: '标题旁的衬线说明文案。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰眉标。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵数字装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function PlansSlide(props) {
  injectCSS('ign-plans-css', CSS);
  const p = { ...plansDefaultProps, ...props };
  const count = clampInt(p.planCount, 2, 3);
  const plans = (Array.isArray(p.plans) ? p.plans : []).slice(0, count);
  const fi = clampInt(p.featuredIndex, 0, count - 1);
  const fc = clampInt(p.featureCount, 3, 5);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-plans">
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

        <div className="ign-plans-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow"><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowText}</span></div>}
            <h2 style={{ marginTop: 18 }} dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showPriceNote && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-plans-grid ign-a2" style={{ gridTemplateColumns: `repeat(${count},1fr)` }}>
          {plans.map((pl, i) => {
            const hot = p.featured && i === fi;
            return (
              <div key={i} className={`ign-plan ${hot ? 'hot' : ''}`}>
                {hot && <span className="tag">{p.tagLabel}</span>}
                <div className="pname">{pl.name}<em>{pl.en}</em></div>
                <div className="pprice">
                  {pl.cur && <span className="cur">{pl.cur}</span>}
                  {hot ? <EmberText className="amt">{pl.amt}</EmberText> : <span className="amt">{pl.amt}</span>}
                  <span className="per">{pl.per}</span>
                </div>
                <ul className="pfeat">
                  {pl.feats.slice(0, fc).map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <div className="pcta">{hot ? p.ctaHot : p.ctaDefault} <span className="arw">↗</span></div>
              </div>
            );
          })}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '28%' }} /></span> 23 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
