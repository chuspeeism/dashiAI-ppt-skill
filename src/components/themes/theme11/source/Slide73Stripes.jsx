/* Slide73Stripes.jsx — IGNIS deck · stacked image-band image page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: stripesDefaultProps (complete defaults) + stripesControls (1:1).
 *
 * Image page. Full-width horizontal image bands stacked vertically, each
 * carrying an oversized index numeral, a title and a one-line caption over a
 * left scrim. Distinct from Cards (55, columns), Gallery (18, grid) and Bento
 * (70, packed): the stripe reads top-to-bottom as a ranked list of cases.
 * Slots cover-fill each band; empty slots fall back to striped placeholders.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-srp .ign-frame{justify-content:space-between}
.ign-srp .b1{width:1200px;height:760px;right:-220px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,110,46,0.16),rgba(226,42,12,0) 70%);filter:blur(58px)}
.ign-srp .ign-ghost{font-size:520px;left:-10px;bottom:-150px}
.ign-srp .ign-eyebrow{white-space:nowrap}
.ign-srp-head{display:flex;align-items:flex-end;justify-content:space-between;gap:48px;margin-top:22px}
.ign-srp-head h2{font-size:54px;font-weight:900;line-height:1.0;letter-spacing:-0.03em}
.ign-srp-head h2 .ign-serif{color:var(--ign-a)}
.ign-srp-head .note{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:800;font-size:23px;color:var(--ign-ink3);text-align:right;max-width:320px;line-height:1.4}
.ign-srp-stack{flex:1;display:flex;flex-direction:column;gap:14px;margin-top:24px;min-height:0}
.ign-srp-band{position:relative;flex:1;border-radius:8px;overflow:hidden;min-height:0;border:1px solid var(--ign-hair)}
.ign-srp-band .ign-imgslot{position:absolute;inset:0;width:100%;height:100%;border-radius:8px}
.ign-srp-scrim{position:absolute;inset:0;z-index:2;
  background:linear-gradient(90deg,rgba(6,5,4,0.82) 0%,rgba(6,5,4,0.5) 42%,rgba(6,5,4,0) 72%)}
.ign-srp-in{position:absolute;z-index:3;inset:0;display:flex;align-items:center;gap:34px;padding:0 40px}
.ign-srp-no{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:96px;line-height:0.8;letter-spacing:-0.04em;
  color:rgba(246,239,230,0.22);flex:none}
.ign-srp-band.lead .ign-srp-no{color:transparent;background:linear-gradient(135deg,#FFC07A,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-srp-txt{display:flex;flex-direction:column;gap:8px;min-width:0}
.ign-srp-tag{display:flex;align-items:center;gap:10px;font-family:'Space Grotesk',sans-serif;font-size:17px;
  letter-spacing:0.14em;text-transform:uppercase;color:var(--ign-a)}
.ign-srp-tag .tick{width:22px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-srp-t{font-size:32px;font-weight:700;letter-spacing:-0.01em;color:#F6EFE6}
.ign-srp-c{font-size:21px;font-weight:300;color:rgba(246,239,230,0.74);line-height:1.4;max-width:560px;text-wrap:pretty}
.ign-srp-kpi{position:absolute;z-index:3;right:40px;top:50%;transform:translateY(-50%);text-align:right}
.ign-srp-kpi .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:54px;line-height:0.86;letter-spacing:-0.03em;color:#F6EFE6}
.ign-srp-band.lead .ign-srp-kpi .v{color:transparent;background:linear-gradient(135deg,#FFC07A,#E22A0C);-webkit-background-clip:text;background-clip:text}
.ign-srp-kpi .l{font-size:18px;font-weight:300;color:rgba(246,239,230,0.6);margin-top:6px}
.ign-srp-band.dim{opacity:0.5;filter:saturate(0.6)}
`;

export const stripesDefaultProps = {
  surface: 'ink',
  bandCount: 3,
  images: [],
  emphasis: false,
  emphasisIndex: 0,
  showIndex: true,
  showTags: true,
  showCaptions: true,
  showKpi: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  ghostMark: '≡',
  railText: 'Cases — 案例辑',
  navItems: ['案例辑'],
  navCurrent: 0,
  ixNo: '72',
  ixLabel: 'Reel',
  eyebrowNo: '案例辑',
  eyebrowEn: 'Case reel',
  headingHtml: '一条接一条，<span class="ign-ember-text">都是同一套打法</span>。',
  noteHtml: '行业不同，路径一致——<br>结果各自说话。',
  bands: [
    { tag: 'DTC 硬件', t: 'VOLT 电动 · 主路径重排', c: '14 天进线翻倍，把犹豫拦在按钮之前。', v: '×3.8', l: '转化率' },
    { tag: '本地连锁', t: '桥本生活 · 本地 SEO 矩阵', c: '门店进店稳步上扬，自然进线接管增长。', v: '+182%', l: '自然进线' },
    { tag: 'B2B 软件', t: 'Nimbus SaaS · 获客漏斗重建', c: '试用转付费链路拉直，获客成本显著下降。', v: '−41%', l: '获客成本' },
    { tag: '内容消费', t: 'Kindle 计划 · 内容资产沉淀', c: '把流量沉成可复利的内容库，长尾持续供血。', v: '5.4k', l: '内容产出' },
  ],
  metaLeft: 'IGNIS — 燃点 · 案例辑',
  metaMid: '一条一条往下读',
};

export const stripesControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ink',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'bandCount', type: 'slider', label: '条带数量', default: 3, min: 2, max: 4, step: 1, describe: '纵向堆叠的图片条带数量。' },
  { key: 'emphasis', type: 'toggle', label: '重点突出', default: false, describe: '开启后突出某一条带，其余弱化。' },
  { key: 'emphasisIndex', type: 'slider', label: '重点序号', default: 0, min: 0, max: 3, step: 1, describe: '需要突出的条带序号（从 0 起）。' },
  { key: 'showIndex', type: 'toggle', label: '序号', default: true, describe: '每条带左侧的大序号。' },
  { key: 'showTags', type: 'toggle', label: '行业标签', default: true, describe: '每条带的行业小标签。' },
  { key: 'showCaptions', type: 'toggle', label: '说明文案', default: true, describe: '每条带的一句话说明。' },
  { key: 'showKpi', type: 'toggle', label: '成果数字', default: true, describe: '每条带右侧的成果数字。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function StripesSlide(props) {
  injectCSS('ign-srp-css', CSS);
  const p = { ...stripesDefaultProps, ...props };
  const n = clampInt(p.bandCount, 2, 4);
  const bands = (Array.isArray(p.bands) ? p.bands : []).slice(0, n);
  const nav = Array.isArray(p.navItems) ? p.navItems : [];
  const images = Array.isArray(p.images) ? p.images : [];
  const emi = clampInt(p.emphasisIndex, 0, n - 1);

  return (
    <Slide surface={p.surface} className="ign-srp">
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

        <div className="ign-srp-head ign-a1">
          <div>
            {p.showKicker && <div className="ign-eyebrow" style={{ marginBottom: 16 }}><span className="tick" /><span className="no">{p.eyebrowNo}</span><span>{p.eyebrowEn}</span></div>}
            <h2 dangerouslySetInnerHTML={{ __html: p.headingHtml }} />
          </div>
          {p.showKicker && <div className="note" dangerouslySetInnerHTML={{ __html: p.noteHtml }} />}
        </div>

        <div className="ign-srp-stack ign-a2">
          {bands.map((b, i) => (
            <div key={i} className={`ign-srp-band ${p.emphasis && i === emi ? 'lead' : ''} ${p.emphasis && i !== emi ? 'dim' : ''}`}>
              <ImageSlot src={images[i]} placeholder={`${b.tag} · 配图`} mode="fill" radius={8} />
              <div className="ign-srp-scrim" />
              <div className="ign-srp-in">
                {p.showIndex && <div className="ign-srp-no">{String(i + 1).padStart(2, '0')}</div>}
                <div className="ign-srp-txt">
                  {p.showTags && <div className="ign-srp-tag"><span className="tick" />{b.tag}</div>}
                  <div className="ign-srp-t">{b.t}</div>
                  {p.showCaptions && <div className="ign-srp-c">{b.c}</div>}
                </div>
              </div>
              {p.showKpi && (
                <div className="ign-srp-kpi"><div className="v">{b.v}</div><div className="l">{b.l}</div></div>
              )}
            </div>
          ))}
        </div>

        {p.showMeta && (
          <footer className="ign-meta" style={{ marginTop: 18 }}>
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '88%' }} /></span> 72 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
