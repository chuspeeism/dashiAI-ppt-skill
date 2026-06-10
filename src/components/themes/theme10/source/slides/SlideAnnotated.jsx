// SlideAnnotated.jsx — 标注影像 / annotated image with numbered callout pins.
// One large image slot carries numbered markers placed at authored coordinates;
// a matching numbered legend sits alongside. Use to point at parts of a chart
// screenshot, a property photo, a product shot. Distinct from SlideCaptioned
// (single caption block), SlideFeature (image + stats) and SlideFullImage
// (overlaid title only): here several pins map to several notes. Standalone &
// migratable: depends only on React + DeckImageSlot (both global). Token-driven,
// light/dark tone applies. CSS scoped `.ann-`.
//
// ── Props (canonical list in SlideAnnotated.META.controls) ────────────────────
//   markerCount  number 2..5   how many pins + legend rows                (4)
//   imageSide    'left'|'right' which side holds the image                ('left')
//   showPins     boolean       the numbered pins over the image           (true)
//   showLegend   boolean       the numbered legend list                   (true)
//   radius       number 0..28  image corner radius (px)                   (14)
//   focus        boolean       emphasise one pin + its legend row         (false)
//   focusIndex   number 1..5   which marker is emphasised (1-based)       (1)
//
// Content props (authored at call-site):
//   idPrefix, overline, title, markers:[{ x, y, title, note }]  (x/y = % over image)

import React from 'react';
import { DeckImageSlot } from '../components/DeckImageSlot.jsx';

function SlideAnnotated({
  idPrefix = 'annotated',
  overline = '组合透视 · READ THE PICTURE',
  title = '一张图里的四个决策点',
  markers = [
    { x: 26, y: 30, title: '核心底仓', note: '占比最大、波动最低的压舱石。' },
    { x: 68, y: 22, title: '卫星增强', note: '小仓位博取超额，严格止损。' },
    { x: 40, y: 64, title: '对冲腿', note: '在回撤里贡献正收益的保险。' },
    { x: 78, y: 70, title: '现金缓冲', note: '随时可动用的机会与防御储备。' },
  ],
  markerCount = 4, imageSide = 'left', showPins = true, showLegend = true, radius = 14,
  focus = false, focusIndex = 1,
}) {
  React.useEffect(() => { annInjectStyle(); }, []);
  const n = Math.max(2, Math.min(markers.length, markerCount));
  const used = markers.slice(0, n);
  const fIdx = focus ? Math.max(0, Math.min(n - 1, focusIndex - 1)) : -1;
  const HUE = ['var(--ds-c1)', 'var(--ds-c4)', 'var(--ds-c3)', 'var(--ds-c5)', 'var(--ds-c6)'];

  const Picture = (
    <div className="ann-pic" style={{ borderRadius: radius }}>
      <DeckImageSlot id={`${idPrefix}-main`} fit="cover" radius={radius} placeholder="ANNOTATED IMAGE" />
      {showPins && used.map((m, i) => {
        const hot = fIdx < 0 || fIdx === i;
        return (
          <span className={`ann-pin ${fIdx === i ? 'is-hot' : ''} ${fIdx >= 0 && !hot ? 'is-dim' : ''}`}
                key={i} style={{ left: `${m.x}%`, top: `${m.y}%`, background: HUE[i % HUE.length] }}>{i + 1}</span>
        );
      })}
    </div>
  );

  const Legend = showLegend && (
    <div className="ann-legend">
      <div className="ann-head">
        <div className="ann-overline">{overline}</div>
        <h2 className="ann-title">{title}</h2>
      </div>
      <div className="ann-rows">
        {used.map((m, i) => {
          const hot = fIdx < 0 || fIdx === i;
          return (
            <div className={`ann-row ${fIdx === i ? 'is-hot' : ''} ${fIdx >= 0 && !hot ? 'is-dim' : ''}`} key={i}>
              <span className="ann-num" style={fIdx === i ? undefined : { color: HUE[i % HUE.length], boxShadow: `inset 0 0 0 1.5px ${HUE[i % HUE.length]}` }}>{i + 1}</span>
              <div className="ann-meta">
                <span className="ann-mtitle">{m.title}</span>
                <span className="ann-mnote">{m.note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`ann-root ${imageSide === 'right' ? 'is-imgright' : 'is-imgleft'}`}>
      {imageSide === 'right' ? <>{Legend}{Picture}</> : <>{Picture}{Legend}</>}
    </div>
  );
}

function annInjectStyle() {
  if (document.getElementById('ann-style')) return;
  const s = document.createElement('style'); s.id = 'ann-style';
  s.textContent = `
  .ann-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:grid;grid-template-columns:1.18fr .82fr;gap:84px;
    align-items:stretch;font-family:var(--font-sans);}
  .ann-pic{position:relative;min-height:0;overflow:hidden;}
  .ann-pin{position:absolute;transform:translate(-50%,-50%);width:60px;height:60px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:30px;
    color:#fff;background:var(--ds-accent,#5479e8);box-shadow:0 0 0 6px rgba(8,9,11,.35);
    transition:opacity .25s ease,transform .2s ease;}
  .ann-pin.is-hot{background:var(--ds-grad,linear-gradient(118deg,#33405c,#5479e8));transform:translate(-50%,-50%) scale(1.16);}
  .ann-pin.is-dim{opacity:.34;}
  .ann-legend{display:flex;flex-direction:column;min-height:0;}
  .ann-head{margin-bottom:44px;}
  .ann-overline{font-family:var(--font-mono);font-size:25px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .ann-title{font-size:54px;font-weight:300;margin:16px 0 0;line-height:1.12;text-wrap:balance;}
  .ann-rows{display:flex;flex-direction:column;gap:30px;}
  .ann-row{display:grid;grid-template-columns:62px 1fr;align-items:start;gap:26px;transition:opacity .25s ease;}
  .ann-row.is-dim{opacity:.4;}
  .ann-num{width:62px;height:62px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    font-family:var(--font-mono);font-size:30px;color:var(--ds-ink,#f2f3f6);
    box-shadow:inset 0 0 0 1.5px var(--ds-line,rgba(242,243,246,.28));}
  .ann-row.is-hot .ann-num{background:var(--ds-accent,#5479e8);color:#fff;box-shadow:none;}
  .ann-meta{display:flex;flex-direction:column;gap:6px;padding-top:4px;min-width:0;}
  .ann-mtitle{font-size:36px;font-weight:300;line-height:1.1;}
  .ann-mnote{font-size:25px;font-weight:300;line-height:1.45;color:var(--ds-muted,rgba(242,243,246,.62));text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideAnnotated.META = {
  id: 'annotated', title: '标注影像',
  defaults: { markerCount: 4, imageSide: 'left', showPins: true, showLegend: true, radius: 14, focus: false, focusIndex: 1 },
  controls: [
    { key: 'markerCount', type: 'slider', label: '标注数量', default: 4, min: 2, max: 5, step: 1,
      description: '图片上的编号标注点与右侧图例条数。图片随上传比例自适应裁切填满。' },
    { key: 'imageSide', type: 'radio', label: '图片位置', default: 'left',
      options: [{ value: 'left', label: '左侧' }, { value: 'right', label: '右侧' }],
      description: '大图所在的一侧。' },
    { key: 'showPins', type: 'toggle', label: '标注点', default: true,
      description: '叠在图片上的编号圆点。' },
    { key: 'showLegend', type: 'toggle', label: '图例列表', default: true,
      description: '编号对应的标题 + 说明列表。' },
    { key: 'radius', type: 'slider', label: '圆角', default: 14, min: 0, max: 28, step: 2, unit: 'px',
      description: '图片的圆角半径。' },
    { key: 'focus', type: 'toggle', label: '重点聚焦', default: false,
      description: '高亮某一个标注点及其图例，其余弱化。' },
    { key: 'focusIndex', type: 'slider', label: '聚焦第几项', default: 1, min: 1, max: 5, step: 1,
      description: '需开启「重点聚焦」后生效，指定被高亮的标注。' },
  ],
};

export { SlideAnnotated };
export const META = SlideAnnotated.META;
export default SlideAnnotated;
