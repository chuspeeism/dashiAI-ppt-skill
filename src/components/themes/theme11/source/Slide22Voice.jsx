/* Slide22Voice.jsx — IGNIS deck · portrait-led testimonial page.
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: voiceDefaultProps (complete defaults) + voiceControls (1:1).
 *
 * Image page. A large client portrait anchors the right; an editorial quote,
 * attribution and a typographic metric run left. Distinct from the centered
 * Quote manifesto — this one is a real, attributed customer voice.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, ImageSlot, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-vox .ign-frame{justify-content:space-between}
.ign-vox .b1{width:1180px;height:1180px;right:-160px;top:50%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,120,52,0.46),rgba(226,42,12,0) 66%);filter:blur(56px)}
.ign-vox .ign-ghost{font-size:680px;left:0;top:-160px}
.ign-vox-body{flex:1;display:grid;grid-template-columns:1.32fr 0.68fr;gap:96px;align-items:center}
.ign-vox-body.solo{grid-template-columns:1fr}
.ign-vox-quote .mk{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:160px;line-height:0.6;color:var(--ign-a);display:block;height:84px}
.ign-vox-quote q{display:block;quotes:none;font-size:58px;font-weight:500;line-height:1.28;letter-spacing:-0.015em;text-wrap:pretty}
.ign-vox-quote q .ign-serif{color:var(--ign-a)}
.ign-vox-rate{display:flex;align-items:center;gap:10px;margin-top:34px}
.ign-vox-rate i{width:14px;height:14px;background:var(--ign-ember);transform:rotate(45deg)}
.ign-vox-rate i.off{background:var(--ign-ink4)}
.ign-vox-rate span{font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:0.14em;color:var(--ign-ink3);margin-left:10px}
.ign-vox-attr{display:flex;align-items:center;gap:22px;margin-top:30px}
.ign-vox-attr .rule{width:54px;height:1px;background:var(--ign-hair2)}
.ign-vox-attr .nm{font-size:28px;font-weight:700}
.ign-vox-attr .ti{font-size:23px;font-weight:300;color:var(--ign-ink2);margin-top:3px}
.ign-vox-metric{margin-top:44px;display:flex;align-items:baseline;gap:20px;border-top:1px solid var(--ign-hair);padding-top:30px}
.ign-vox-metric .v{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:88px;line-height:0.82;letter-spacing:-0.03em}
.ign-vox-metric .l{font-size:24px;font-weight:300;color:var(--ign-ink2);max-width:300px;line-height:1.4}
.ign-vox-port{display:flex;flex-direction:column;align-items:center;gap:26px}
.ign-vox-portbox{position:relative;padding:10px;border:1px solid var(--ign-hair2)}
.ign-vox-portbox.circle{border-radius:50%}
.ign-vox-portbox.rounded{border-radius:22px}
.ign-vox-portbox::after{content:"";position:absolute;inset:-1px;border:1px solid transparent;
  background:linear-gradient(150deg,var(--ign-a),transparent 60%) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;border-radius:inherit;pointer-events:none}
.ign-vox-cap{text-align:center}
.ign-vox-cap .co{font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:30px;letter-spacing:0.02em}
.ign-vox-cap .co em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;color:var(--ign-a)}
.ign-vox-cap .sub{font-family:'Space Grotesk',sans-serif;font-size:21px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink3);margin-top:8px}
`;

export const voiceDefaultProps = {
  surface: 'ember',
  avatarCount: 1,
  avatar: [],
  portraitShape: 'rounded',
  showRating: true,
  showMetric: true,
  showKicker: true,
  showGhostMark: true,
  showScaffold: true,
  showMeta: true,
  // --- visible content defaults (override via props for migration) ---
  ghostMark: '“',
  markGlyph: '“',
  railText: 'Voice — 见证',
  navItems: ['见证'],
  navCurrent: 0,
  ixNo: '09',
  ixLabel: 'Voice',
  quoteHtml: '他们不是接了个活，而是把<span class="ign-ember-text">整条增长路径</span>接管下来——三个月，转化曲线第一次<span class="ign-serif">真的</span>立起来了。',
  ratingText: '5.0 · 长期续约',
  attrName: '林见川',
  attrTitle: 'DAZZ · 增长负责人',
  metricValue: '3.8×',
  metricLabel: '合作首季度，注册到付费的转化倍数。',
  portraitPlaceholder: '客户头像',
  capName: 'DAZZ',
  capSuffix: ' .',
  capSub: 'SaaS · 北美',
  metaLeft: 'IGNIS — 燃点 · 客户见证',
  metaMid: '让结果替我们说话',
};

export const voiceControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'ember',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'avatarCount', type: 'slider', label: '头像数量', default: 1, min: 0, max: 1, step: 1, describe: '客户头像图片槽数量（0 为留白占位）。' },
  { key: 'portraitShape', type: 'select', label: '头像形状', default: 'rounded',
    options: [{ value: 'rounded', label: '圆角方形' }, { value: 'circle', label: '正圆' }], describe: '头像槽的裁切形状。' },
  { key: 'showRating', type: 'toggle', label: '评分行', default: true, describe: '引文上下的菱形评分点。' },
  { key: 'showMetric', type: 'toggle', label: '成果数字', default: true, describe: '左下角的大号成果指标。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '导航旁的装饰标签。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落超大幽灵引号装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
  { key: 'showMeta', type: 'toggle', label: '底部信息条', default: true, describe: '底部页脚信息与进度条。' },
];

export default function VoiceSlide(props) {
  injectCSS('ign-vox-css', CSS);
  const p = { ...voiceDefaultProps, ...props };
  const count = clampInt(p.avatarCount, 0, 1);
  const src = (Array.isArray(p.avatar) ? p.avatar : [])[0];
  const circle = p.portraitShape === 'circle';
  const nav = Array.isArray(p.navItems) ? p.navItems : [];

  return (
    <Slide surface={p.surface} className="ign-vox">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>{p.railText}</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          {p.showKicker ? <nav className="ign-nav">{nav.map((it, i) => (
            <React.Fragment key={i}>{i > 0 && <i>/</i>}<span className={i === p.navCurrent ? 'on' : ''}>{it}</span></React.Fragment>
          ))}</nav> : <span />}
          <div className="ign-ix"><b>{p.ixNo}</b> — {p.ixLabel}</div>
        </header>

        <div className={`ign-vox-body ${count >= 1 ? '' : 'solo'}`}>
          <div className="ign-vox-quote ign-a1">
            <span className="mk">{p.markGlyph}</span>
            <q dangerouslySetInnerHTML={{ __html: p.quoteHtml }} />
            {p.showRating && (
              <div className="ign-vox-rate">
                {[0, 1, 2, 3, 4].map((i) => <i key={i} />)}
                <span>{p.ratingText}</span>
              </div>
            )}
            <div className="ign-vox-attr">
              <span className="rule" />
              <div><div className="nm">{p.attrName}</div><div className="ti">{p.attrTitle}</div></div>
            </div>
            {p.showMetric && (
              <div className="ign-vox-metric">
                <EmberText className="v">{p.metricValue}</EmberText>
                <span className="l">{p.metricLabel}</span>
              </div>
            )}
          </div>

          {count >= 1 && (
            <div className="ign-vox-port ign-a2">
              <div className={`ign-vox-portbox ${circle ? 'circle' : 'rounded'}`}>
                <ImageSlot src={src} mode="fill" height={420} radius={circle ? '50%' : 14} placeholder={p.portraitPlaceholder} />
              </div>
              <div className="ign-vox-cap">
                <div className="co">{p.capName}<em>{p.capSuffix}</em></div>
                <div className="sub">{p.capSub}</div>
              </div>
            </div>
          )}
        </div>

        {p.showMeta && (
          <footer className="ign-meta">
            <div>{p.metaLeft}</div>
            <div className="mid">{p.metaMid}</div>
            <div className="r"><span className="ign-prog"><span className="track"><span className="fill" style={{ width: '16%' }} /></span> 13 / 82</span></div>
          </footer>
        )}
      </Frame>
    </Slide>
  );
}
