// SlideChapterIndex.jsx — chapter divider with a running table-of-contents.
// Standalone & migratable: depends only on React (imported) + DECK_THEMES (for the
// themed background palette; falls back to tokens if absent). All variation via
// props; copy is authored in markup. CSS scoped under `.cidx-`.
//
// ── Props (canonical list in SlideChapterIndex.META.controls) ─────────────────
//   theme         'midnight'|'dusk'|'graphite'|'dawn'|'paper'|'vapor'   bg mood   ('midnight')
//   align         'left'|'center'           big title alignment                    ('left')
//   currentIndex  number 1..N               which chapter is "now" (drives hero+list) (2)
//   showIndex     boolean                   show the running chapter list          (true)
//   showProgress  boolean                   show the "NN / NN" counter             (true)
//
// Content props (authored at call-site, not exposed as Tweaks):
//   kicker, chapters: [{ no, title }]

import React from 'react';
import { DECK_THEMES } from '../components/DeckPrimitives.jsx';

function SlideChapterIndex({
  kicker = 'AUTONOMOUS INDEX · 章节',
  chapters = [
    { no: '01', title: '市场环境与机会' },
    { no: '02', title: '自主指数的运作机制' },
    { no: '03', title: '历史业绩与归因' },
    { no: '04', title: '风险框架与对冲' },
    { no: '05', title: '费用结构与透明度' },
  ],
  theme = 'dusk', align = 'left',
  currentIndex = 2, showIndex = true, showProgress = true,
}) {
  React.useEffect(() => { cidxInjectStyle(); }, []);
  const t = DECK_THEMES[theme] || { bg: 'var(--ds-bg,#0d0e11)', fg: 'var(--ds-ink,#f2f3f6)', sub: 'var(--ds-muted)' };
  const n = chapters.length || 1;
  const active = Math.max(0, Math.min(n - 1, currentIndex - 1));
  const cur = chapters[active] || { no: '01', title: '' };

  return (
    <div className="cidx-root" style={{ background: t.bg, color: t.fg, ['--cidx-sub']: t.sub }}>
      <div className="cidx-grain" />

      <div className="cidx-top">
        <span className="cidx-kicker">{kicker}</span>
        {showProgress && (
          <span className="cidx-progress">
            <span className="cidx-progress-cur">{cur.no}</span>
            <span className="cidx-progress-sep">/</span>
            <span className="cidx-progress-tot">{String(n).padStart(2, '0')}</span>
          </span>
        )}
      </div>

      <div className="cidx-body">
        <div className="cidx-hero" style={{ alignItems: align === 'center' ? 'center' : 'flex-start',
          textAlign: align === 'center' ? 'center' : 'left' }}>
          <div className="cidx-num">{cur.no}</div>
          <h2 className="cidx-title">{cur.title}</h2>
        </div>

        {showIndex && align !== 'center' && (
          <ul className="cidx-list">
            {chapters.map((c, i) => {
              const isCur = i === active;
              return (
                <li className={`cidx-li ${isCur ? 'is-cur' : ''} ${i < active ? 'is-past' : ''}`} key={i}>
                  <span className="cidx-li-dot" />
                  <span className="cidx-li-no">{c.no}</span>
                  <span className="cidx-li-title">{c.title}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function cidxInjectStyle() {
  if (document.getElementById('cidx-style')) return;
  const s = document.createElement('style'); s.id = 'cidx-style';
  s.textContent = `
  .cidx-root{position:relative;width:100%;height:100%;overflow:hidden;font-family:var(--font-sans);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;}
  .cidx-grain{position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
  .cidx-top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;}
  .cidx-kicker{font-family:var(--font-mono);font-size:26px;letter-spacing:.24em;color:var(--cidx-sub);white-space:nowrap;}
  .cidx-progress{font-family:var(--font-mono);font-size:30px;letter-spacing:.08em;display:flex;align-items:baseline;gap:10px;}
  .cidx-progress-cur{color:#fff;}
  .cidx-progress-sep,.cidx-progress-tot{color:var(--cidx-sub);}
  .cidx-body{position:relative;z-index:1;flex:1;display:flex;align-items:flex-end;gap:96px;min-height:0;}
  .cidx-hero{flex:1;display:flex;flex-direction:column;justify-content:flex-end;}
  .cidx-num{font-size:300px;line-height:.82;font-weight:200;letter-spacing:-.02em;
    font-variant-numeric:tabular-nums;opacity:.94;}
  .cidx-title{font-size:96px;font-weight:300;margin:34px 0 0;line-height:1.04;letter-spacing:.01em;}
  .cidx-list{flex:0 0 540px;list-style:none;margin:0 0 14px;padding:0;
    display:flex;flex-direction:column;align-self:flex-end;}
  .cidx-li{position:relative;display:flex;align-items:center;gap:26px;padding:24px 0 24px 30px;
    border-top:1px solid var(--ds-line,rgba(242,243,246,.14));transition:opacity .25s ease;}
  .cidx-li:last-child{border-bottom:1px solid var(--ds-line,rgba(242,243,246,.14));}
  .cidx-li-dot{position:absolute;left:0;width:10px;height:10px;border-radius:50%;
    background:currentColor;opacity:.28;}
  .cidx-li-no{font-family:var(--font-mono);font-size:24px;letter-spacing:.06em;color:var(--cidx-sub);min-width:44px;}
  .cidx-li-title{font-size:30px;font-weight:300;}
  .cidx-li.is-past{opacity:.4;}
  .cidx-li.is-cur .cidx-li-dot{background:#fff;opacity:1;box-shadow:0 0 0 6px rgba(255,255,255,.16);}
  .cidx-li.is-cur .cidx-li-no{color:#fff;}
  .cidx-li.is-cur .cidx-li-title{font-weight:400;}
  `;
  document.head.appendChild(s);
}

SlideChapterIndex.META = {
  id: 'chapter', title: '章节索引',
  defaults: { theme: 'dusk', align: 'left', currentIndex: 2, showIndex: true, showProgress: true },
  controls: [
    { key: 'theme', type: 'select', label: '背景主题', default: 'dusk',
      options: [
        { value: 'midnight', label: '午夜' }, { value: 'dusk', label: '暮光' },
        { value: 'graphite', label: '石墨' }, { value: 'dawn', label: '晨光' },
        { value: 'vapor', label: '垂直渐变' }, { value: 'paper', label: '纸白' },
      ], description: '分章页的背景渐变与配色基调。' },
    { key: 'align', type: 'radio', label: '标题对齐', default: 'left',
      options: [{ value: 'left', label: '左对齐' }, { value: 'center', label: '居中' }],
      description: '大号编号与标题的对齐方式（居中时自动隐藏右侧目录）。' },
    { key: 'currentIndex', type: 'slider', label: '当前章节', default: 2, min: 1, max: 5, step: 1,
      description: '指定“当前”章节，主标题与右侧目录的高亮会同步跟随。' },
    { key: 'showIndex', type: 'toggle', label: '章节目录', default: true,
      description: '右侧的全章节列表，显示阅读进度。' },
    { key: 'showProgress', type: 'toggle', label: '进度计数', default: true,
      description: '右上角的「当前 / 总数」计数标记。' },
  ],
};

export { SlideChapterIndex };
export const META = SlideChapterIndex.META;
export default SlideChapterIndex;
