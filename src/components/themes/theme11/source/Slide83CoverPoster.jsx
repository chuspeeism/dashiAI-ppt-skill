/* Slide83CoverPoster.jsx — IGNIS deck · ALTERNATE COVER A (poster / ticker).
 * Independent, prop-driven. No window globals, no preview-runtime dependency.
 * Pair: coverPosterDefaultProps (complete defaults) + coverPosterControls (1:1).
 *
 * Cover variant. A confident light "poster": left-anchored oversized headline
 * underlined by an ember gradient sweep bar, with a full-width keyword TICKER
 * (arrow-separated pipeline) along the bottom. Distinct from the photo Hero (B),
 * the split panel (D) and the ember Statement (C) — this is the typographic
 * poster opener. No image; pure type + brand devices.
 */
import { Slide, Grain, Edge, Ghost, Rail, Corners, Frame, Wordmark, EmberText, injectCSS, clampInt } from './ignBase.jsx';

const CSS = `
.ign-cvp .ign-frame{justify-content:space-between}
.ign-cvp .b1{width:1100px;height:720px;left:-280px;top:60%;transform:translateY(-50%);
  background:radial-gradient(50% 50% at 50% 50%,rgba(255,150,70,0.22),rgba(255,90,35,0) 72%);filter:blur(50px)}
.ign-cvp-status{display:inline-flex;align-items:center;gap:12px;font-family:'Space Grotesk',sans-serif;font-size:24px;
  letter-spacing:0.16em;text-transform:uppercase;color:var(--ign-ink2);border:1px solid var(--ign-hair2);
  border-radius:999px;padding:14px 28px;white-space:nowrap}
.ign-cvp-status .dot{width:8px;height:8px;border-radius:50%;background:#54d17a;box-shadow:0 0 12px #54d17a}
.ign-cvp-mid{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.ign-cvp-kick{display:flex;align-items:center;gap:18px;font-family:'Space Grotesk',sans-serif;font-size:25px;
  letter-spacing:0.3em;text-transform:uppercase;color:var(--ign-ink2);margin-bottom:34px}
.ign-cvp-kick .tick{width:54px;height:1px;background:linear-gradient(90deg,var(--ign-b),transparent)}
.ign-cvp-kick .no{color:var(--ign-a)}
.ign-cvp-h{font-size:150px;font-weight:900;line-height:1.4;letter-spacing:-0.05em;width:fit-content}
.ign-cvp-h .row{display:block;white-space:nowrap}
.ign-cvp-h em{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-weight:400;letter-spacing:-0.01em}
.ign-cvp-sweep{height:18px;width:480px;margin:36px 0 30px;border-radius:999px;
  background:var(--ign-ember);box-shadow:0 14px 50px -14px rgba(226,42,12,0.6)}
.ign-cvp-lede{font-family:'Newsreader','Noto Serif SC',serif;font-style:italic;font-size:40px;line-height:1.3;
  color:var(--ign-ink2);max-width:1040px;text-wrap:pretty}
.ign-cvp-lede b{font-style:normal;font-weight:500;color:var(--ign-ink)}
.ign-cvp-foot{display:flex;align-items:center;justify-content:space-between;gap:40px;
  border-top:1px solid var(--ign-hair);padding-top:26px}
.ign-cvp-ticker{display:flex;align-items:center;gap:22px;flex-wrap:nowrap;overflow:hidden}
.ign-cvp-ticker .k{font-family:'Space Grotesk','Noto Sans SC',sans-serif;font-weight:600;font-size:30px;
  letter-spacing:0.04em;color:var(--ign-ink);white-space:nowrap}
.ign-cvp-ticker .k.on{color:transparent;background:var(--ign-ember);-webkit-background-clip:text;background-clip:text}
.ign-cvp-ticker .ar{font-family:'Space Grotesk',sans-serif;font-size:30px;color:var(--ign-a)}
.ign-cvp-page{font-family:'Space Grotesk',sans-serif;font-size:24px;letter-spacing:0.18em;text-transform:uppercase;
  color:var(--ign-ink3);white-space:nowrap}
`;

export const coverPosterDefaultProps = {
  surface: 'paper',
  showStatus: true,
  showKicker: true,
  showSweep: true,
  showLede: true,
  showTicker: true,
  tickerCount: 5,
  showGhostMark: true,
  showScaffold: true,
  // --- visible content defaults (override via props for migration) ---
  statusText: '现接受 2026 Q3 合作',
  deckLabel: 'CAPABILITIES DECK',
  deckYear: '2026',
  kickerLabel: 'AI 增长引擎',
  kickerText: 'Rank higher, convert better',
  ghostMark: '燃',
  headlineHtml: '<span class="row">把流量，</span><span class="row">拧成 <span class="ign-ember-text">增长</span>。</span>',
  ledeHtml: '搜索、内容与投放，合成一台<b>会复利的增长引擎</b>——让每一次曝光，都换成实际增长。',
  ticker: ['搜索', '内容', '投放', '转化', '复利增长'],
  pageLabel: '↓ 开始',
};

export const coverPosterControls = [
  { key: 'surface', type: 'select', label: '背景基调', default: 'paper',
    options: [{ value: 'ink', label: '深色' }, { value: 'paper', label: '浅色' }, { value: 'ember', label: '暖橙' }],
    describe: '页面背景主题，用于在相邻页之间制造色彩跳跃。' },
  { key: 'showStatus', type: 'toggle', label: '状态胶囊', default: true, describe: '顶部的接单状态胶囊。' },
  { key: 'showKicker', type: 'toggle', label: '装饰副标题', default: true, describe: '主标题上方的刊号式装饰小标。' },
  { key: 'showSweep', type: 'toggle', label: '暖橙扫光条', default: true, describe: '主标题下方的暖橙渐变扫光条（图形母题）。' },
  { key: 'showLede', type: 'toggle', label: '衬线引言', default: true, describe: '扫光条下方的衬线斜体引言。' },
  { key: 'showTicker', type: 'toggle', label: '关键词跑马条', default: true, describe: '底部的箭头串联关键词跑马条。' },
  { key: 'tickerCount', type: 'slider', label: '关键词数量', default: 5, min: 3, max: 5, step: 1, describe: '跑马条中的关键词数量（末项点亮）。' },
  { key: 'showGhostMark', type: 'toggle', label: '背景大字符', default: true, describe: '角落的超大幽灵字符装饰。' },
  { key: 'showScaffold', type: 'toggle', label: '边框骨架', default: true, describe: '侧边竖排标签与四角括线。' },
];

export default function CoverPosterSlide(props) {
  injectCSS('ign-cvp-css', CSS);
  const p = { ...coverPosterDefaultProps, ...props };
  const ticker = (Array.isArray(p.ticker) ? p.ticker : []).slice(0, clampInt(p.tickerCount, 3, 5));

  return (
    <Slide surface={p.surface} className="ign-cvp">
      <span className="ign-bloom b1" />
      <Grain /><Edge />
      {p.showGhostMark && <Ghost style={{ fontSize: 300, right: 100, top: '50%', transform: 'translateY(-50%)' }}>{p.ghostMark}</Ghost>}
      {p.showScaffold && <Rail>Capabilities — 燃点</Rail>}
      {p.showScaffold && <Corners />}

      <Frame>
        <header className="ign-util">
          <Wordmark />
          <nav>{p.showStatus && <span className="ign-cvp-status"><span className="dot" />{p.statusText}</span>}</nav>
          <div className="ign-ix">{p.deckLabel} · <b>{p.deckYear}</b></div>
        </header>

        <div className="ign-cvp-mid">
          {p.showKicker && (
            <div className="ign-cvp-kick ign-a1"><span className="tick" /><span className="no">{p.kickerLabel}</span> {p.kickerText}</div>
          )}
          <h1 className="ign-cvp-h ign-a2" dangerouslySetInnerHTML={{ __html: p.headlineHtml }} />
          {p.showSweep && <div className="ign-cvp-sweep ign-a2" />}
          {p.showLede && (
            <p className="ign-cvp-lede ign-a3" dangerouslySetInnerHTML={{ __html: p.ledeHtml }} />
          )}
        </div>

        <footer className="ign-cvp-foot ign-a3">
          {p.showTicker ? (
            <div className="ign-cvp-ticker">
              {ticker.map((k, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="ar">→</span>}
                  <span className={`k${i === ticker.length - 1 ? ' on' : ''}`}>{k}{i === ticker.length - 1 ? ' ↑' : ''}</span>
                </React.Fragment>
              ))}
            </div>
          ) : <span />}
          <div className="ign-cvp-page">{p.pageLabel}</div>
        </footer>
      </Frame>
    </Slide>
  );
}
