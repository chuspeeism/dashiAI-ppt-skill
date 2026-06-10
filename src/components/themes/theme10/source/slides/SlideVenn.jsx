// SlideVenn.jsx — 策略交集 / overlapping-set diagram.
// Two or three translucent discs overlap; the shared centre is called out as the
// sweet spot (e.g. 你的目标 ∩ 我们的能力 ∩ 市场机会). A side panel names each
// set and the intersection. Distinct from SlideQuadrant (a 2×2 grid) and
// SlideOrbit (a hub with satellites). Standalone & migratable: depends only on
// React (imported). Token-driven, light/dark tone applies. CSS scoped `.vnn-`.
//
// ── Props (canonical list in SlideVenn.META.controls) ─────────────────────────
//   circleCount  number 2..3   how many sets / discs                      (3)
//   showCenter   boolean       the highlighted intersection chip          (true)
//   showLegend   boolean       the side panel listing each set            (true)
//   showDiscLabels boolean     the short label sitting on each disc       (true)
//   focus        boolean       emphasise one set, dim the others          (false)
//   focusIndex   number 1..3   which set is emphasised (1-based)          (1)
//
// Content props (authored at call-site):
//   overline, title, sets:[{ name, note }], center:{ label, note }

import React from 'react';

function SlideVenn({
  overline = '决策交集 · WHERE THE FIT IS',
  title = '三个圈的交点，才是该下注的地方',
  sets = [
    { name: '你的目标', note: '现金流、期限与风险偏好' },
    { name: '我们的能力', note: '可复制、可解释的策略边界' },
    { name: '市场机会', note: '当前定价提供的胜率与赔率' },
  ],
  center = { label: '黄金交集', note: '三者重叠处，方案才既合适又可执行。' },
  circleCount = 3, showCenter = true, showLegend = true, showDiscLabels = true, focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { vnnInjectStyle(); }, []);
  const n = Math.max(2, Math.min(sets.length, circleCount));
  const used = sets.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const COL = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)'];

  // Disc geometry within a 620×620 stage.
  const STAGE = 620;
  const layout3 = [{ x: 310, y: 224, r: 178 }, { x: 224, y: 402, r: 178 }, { x: 396, y: 402, r: 178 }];
  const layout2 = [{ x: 250, y: 310, r: 200 }, { x: 370, y: 310, r: 200 }];
  const discs = (n === 2 ? layout2 : layout3).slice(0, n);
  const centerPt = n === 2 ? { x: 310, y: 310 } : { x: 310, y: 350 };
  // disc label anchor (pushed outward from centroid)
  const labelPos = n === 2
    ? [{ x: 150, y: 310 }, { x: 470, y: 310 }]
    : [{ x: 310, y: 150 }, { x: 150, y: 452 }, { x: 470, y: 452 }];

  return (
    <div className="vnn-root">
      <div className="vnn-head">
        <div className="vnn-overline">{overline}</div>
        <h2 className="vnn-title">{title}</h2>
      </div>

      <div className="vnn-body">
        <div className="vnn-stage" style={{ width: STAGE, height: STAGE }}>
          {discs.map((d, i) => {
            const hot = fIdx < 0 || fIdx === i;
            return (
              <span className="vnn-disc" key={i} style={{
                left: d.x - d.r, top: d.y - d.r, width: d.r * 2, height: d.r * 2,
                color: COL[i], borderColor: COL[i],
                background: `radial-gradient(circle at 50% 42%, ${COL[i]} 0%, color-mix(in srgb, ${COL[i]} 55%, transparent) 46%, transparent 72%)`,
                mixBlendMode: 'screen',
                opacity: hot ? (fIdx === i ? 0.98 : 0.8) : 0.22,
              }} />
            );
          })}
          {showCenter && (
            <span className="vnn-center" style={{ left: centerPt.x, top: centerPt.y }}>
              <span className="vnn-cdot" />
              <span className="vnn-clabel">{center.label}</span>
            </span>
          )}
          {showDiscLabels && discs.map((_, i) => {
            const hot = fIdx < 0 || fIdx === i;
            return (
              <span className={`vnn-dlabel ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}
                    style={{ left: labelPos[i].x, top: labelPos[i].y, color: COL[i] }}>
                {used[i].name}
              </span>
            );
          })}
        </div>

        {showLegend && (
          <div className="vnn-legend">
            <div className="vnn-rows">
              {used.map((s, i) => {
                const hot = fIdx < 0 || fIdx === i;
                return (
                  <div className={`vnn-row ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}>
                    <span className="vnn-sw" style={{ background: COL[i] }} />
                    <div className="vnn-meta">
                      <span className="vnn-name">{s.name}</span>
                      <span className="vnn-note">{s.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {showCenter && (
              <div className="vnn-cbox">
                <span className="vnn-ctag">{center.label}</span>
                <span className="vnn-cnote">{center.note}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function vnnInjectStyle() {
  if (document.getElementById('vnn-style')) return;
  const s = document.createElement('style'); s.id = 'vnn-style';
  s.textContent = `
  .vnn-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;font-family:var(--font-sans);}
  .vnn-head{margin-bottom:24px;}
  .vnn-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .vnn-title{font-size:58px;font-weight:300;margin:16px 0 0;line-height:1.12;text-wrap:balance;max-width:1280px;}
  .vnn-body{flex:1;min-height:0;display:grid;grid-template-columns:auto 1fr;gap:90px;align-items:center;}
  .vnn-stage{position:relative;flex:0 0 auto;}
  .vnn-disc{position:absolute;border-radius:50%;border:2px solid currentColor;transition:opacity .3s ease;}
  .vnn-center{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:12px;}
  .vnn-cdot{width:18px;height:18px;border-radius:50%;background:var(--ds-ink,#f2f3f6);box-shadow:0 0 0 7px rgba(84,121,232,.22);}
  .vnn-clabel{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;color:var(--ds-ink,#f2f3f6);white-space:nowrap;}
  .vnn-dlabel{position:absolute;transform:translate(-50%,-50%);font-size:32px;font-weight:300;white-space:nowrap;
    transition:opacity .25s ease;}
  .vnn-dlabel.is-dim{opacity:.34;}
  .vnn-legend{display:flex;flex-direction:column;gap:44px;min-width:0;}
  .vnn-rows{display:flex;flex-direction:column;gap:30px;}
  .vnn-row{display:grid;grid-template-columns:26px 1fr;align-items:start;gap:24px;transition:opacity .25s ease;}
  .vnn-row.is-dim{opacity:.4;}
  .vnn-sw{width:26px;height:26px;border-radius:50%;margin-top:6px;}
  .vnn-meta{display:flex;flex-direction:column;gap:5px;min-width:0;}
  .vnn-name{font-size:36px;font-weight:300;}
  .vnn-note{font-size:24px;font-weight:300;line-height:1.4;color:var(--ds-muted,rgba(242,243,246,.62));text-wrap:pretty;}
  .vnn-cbox{display:flex;flex-direction:column;gap:10px;padding:30px 34px;border-radius:18px;
    background:var(--ds-grad-soft,linear-gradient(110deg,rgba(51,64,92,.3),rgba(200,150,107,.3)));
    box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ds-accent,#5479e8) 34%,transparent);}
  .vnn-ctag{font-family:var(--font-mono);font-size:24px;letter-spacing:.1em;color:var(--ds-accent,#5479e8);}
  .vnn-cnote{font-size:27px;font-weight:300;line-height:1.4;text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideVenn.META = {
  id: 'venn', title: '策略交集',
  defaults: { circleCount: 3, showCenter: true, showLegend: true, showDiscLabels: true, focus: false, focusIndex: 1 },
  controls: [
    { key: 'circleCount', type: 'slider', label: '圆圈数量', default: 3, min: 2, max: 3, step: 1,
      description: '参与交集的集合 / 圆圈数。' },
    { key: 'showCenter', type: 'toggle', label: '交集高亮', default: true,
      description: '中心重叠处的「黄金交集」标记与说明。' },
    { key: 'showLegend', type: 'toggle', label: '图例', default: true,
      description: '右侧逐个集合的名称 + 说明。' },
    { key: 'showDiscLabels', type: 'toggle', label: '圆上标签', default: true,
      description: '直接落在每个圆上的简短名称。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一个集合，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 3, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的集合。' },
  ],
};

export { SlideVenn };
export const META = SlideVenn.META;
export default SlideVenn;
