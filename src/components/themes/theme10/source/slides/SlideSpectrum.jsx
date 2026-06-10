// SlideSpectrum.jsx — 风险光谱 / a single positional scale.
// A wide segmented spectrum bar with a marker dropped at one position, zone
// captions beneath, end anchors, and a big readout of the marked zone. A
// one-concept "where do you sit" page — distinct from SlideQuadrant (2D scatter)
// and SlideGauges (radial dials). Standalone & migratable: depends only on React.
// CSS scoped under `.spc-`.
//
// ── Props (canonical list in SlideSpectrum.META.controls) ─────────────────────
//   segmentCount number 3..6   how many spectrum zones                      (5)
//   markerPos    number 0..100 marker position along the scale (%)          (62)
//   showMarker   boolean       the dropped marker + readout                 (true)
//   showScale    boolean       the 0–100 numeric scale ticks                (true)
//   showEnds     boolean       the low / high end anchor captions           (true)
//
// Content props (authored at call-site):
//   overline, title, ends {low,high}, segments:[{label}], readoutLabel, readoutNote

import React from 'react';

function SlideSpectrum({
  overline = '风险定位 · RISK PROFILE', title = '你正坐落在光谱的哪一段',
  ends = { low: '保本优先', high: '增长优先' },
  segments = [
    { label: '极保守' }, { label: '稳健' }, { label: '平衡' }, { label: '积极' }, { label: '进取' }, { label: '激进' },
  ],
  readoutLabel = '积极成长',
  readoutNote = '愿意承受中高波动，以换取长期更高的复利回报；自主指数将在该区间内动态调仓。',
  segmentCount = 5, markerPos = 62, showMarker = true, showScale = true, showEnds = true,
}) {
  React.useEffect(() => { spcInjectStyle(); }, []);
  const n = Math.max(3, Math.min(segments.length, segmentCount));
  const segs = segments.slice(0, n);
  const pos = Math.max(0, Math.min(100, markerPos));
  const activeSeg = Math.min(n - 1, Math.floor((pos / 100) * n));
  // Risk reads cool(safe)→warm(aggressive): sweep the brand palette across zones.
  const RAMP = ['var(--ds-c1)', 'var(--ds-c2)', 'var(--ds-c3)', 'var(--ds-c4)', 'var(--ds-c5)', 'var(--ds-c6)'];
  const segColor = (i) => RAMP[Math.round((i / Math.max(1, n - 1)) * (RAMP.length - 2))];

  return (
    <div className="spc-root">
      <div className="spc-head">
        <div className="spc-overline">{overline}</div>
        <h2 className="spc-title">{title}</h2>
      </div>

      <div className="spc-stage">
        {showMarker && (
          <div className="spc-readout" style={{ left: `${pos}%` }}>
            <span className="spc-readlabel">{readoutLabel}</span>
            <span className="spc-readpct">{Math.round(pos)}</span>
          </div>
        )}

        <div className="spc-bar">
          {segs.map((sg, i) => (
            <div className={`spc-seg ${i === activeSeg && showMarker ? 'is-active' : ''}`} key={i}
                 style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${segColor(i)} 78%, #fff) 0%, ${segColor(i)} 100%)`,
                   borderRadius: i === 0 ? '10px 0 0 10px' : i === n - 1 ? '0 10px 10px 0' : '0' }}>
              <span className="spc-seglabel">{sg.label}</span>
            </div>
          ))}
          {showMarker && <span className="spc-marker" style={{ left: `${pos}%` }} />}
        </div>

        {showScale && (
          <div className="spc-scale">
            {[0, 25, 50, 75, 100].map((v) => <span key={v}>{v}</span>)}
          </div>
        )}

        {showEnds && (
          <div className="spc-ends">
            <span>◂ {ends.low}</span>
            <span>{ends.high} ▸</span>
          </div>
        )}
      </div>

      {showMarker && <p className="spc-note">{readoutNote}</p>}
    </div>
  );
}

function spcInjectStyle() {
  if (document.getElementById('spc-style')) return;
  const s = document.createElement('style'); s.id = 'spc-style';
  s.textContent = `
  .spc-root{position:relative;width:100%;height:100%;background:var(--ds-bg,#0d0e11);color:var(--ds-ink,#f2f3f6);
    padding:var(--pad-y,96px) var(--pad-x,120px);display:flex;flex-direction:column;justify-content:center;font-family:var(--font-sans);}
  .spc-head{margin-bottom:150px;}
  .spc-overline{font-family:var(--font-mono);font-size:26px;letter-spacing:.16em;color:var(--ds-faint,rgba(242,243,246,.42));}
  .spc-title{font-size:64px;font-weight:300;margin:16px 0 0;line-height:1.06;}
  .spc-stage{position:relative;}
  .spc-readout{position:absolute;bottom:calc(100% + 26px);transform:translateX(-50%);display:flex;flex-direction:column;
    align-items:center;gap:6px;white-space:nowrap;}
  .spc-readlabel{font-size:34px;font-weight:300;color:var(--ds-accent,#6f9bd8);}
  .spc-readpct{font-family:var(--font-mono);font-size:64px;line-height:.9;font-weight:200;letter-spacing:-.02em;
    font-variant-numeric:tabular-nums;}
  .spc-bar{position:relative;display:flex;height:78px;border-radius:10px;overflow:visible;
    box-shadow:inset 0 0 0 1px var(--ds-line,rgba(242,243,246,.14));}
  .spc-seg{position:relative;flex:1;display:flex;align-items:center;justify-content:center;background:var(--ds-accent,#6f9bd8);}
  .spc-seg:first-child{border-radius:10px 0 0 10px;}
  .spc-seg:last-child{border-radius:0 10px 10px 0;}
  .spc-seg + .spc-seg{box-shadow:inset 1px 0 0 var(--ds-bg-soft,#16181d);}
  .spc-seglabel{font-family:var(--font-mono);font-size:24px;letter-spacing:.04em;color:#fff;font-weight:500;}
  .spc-seg.is-active .spc-seglabel{color:#fff;font-weight:600;}
  .spc-marker{position:absolute;top:-16px;bottom:-16px;width:3px;background:var(--ds-ink,#f2f3f6);transform:translateX(-50%);}
  .spc-marker::before{content:"";position:absolute;left:50%;top:-9px;width:18px;height:18px;border-radius:50%;
    background:var(--ds-ink,#f2f3f6);transform:translateX(-50%);}
  .spc-scale{display:flex;justify-content:space-between;margin-top:20px;font-family:var(--font-mono);font-size:24px;
    color:var(--ds-faint,rgba(242,243,246,.4));}
  .spc-ends{display:flex;justify-content:space-between;margin-top:14px;font-family:var(--font-mono);font-size:25px;
    letter-spacing:.06em;color:var(--ds-muted,rgba(242,243,246,.6));}
  .spc-ends span{white-space:nowrap;}
  .spc-note{font-size:30px;line-height:1.56;font-weight:300;color:var(--ds-muted,rgba(242,243,246,.62));
    margin:56px 0 0;max-width:1300px;text-wrap:pretty;}
  `;
  document.head.appendChild(s);
}

SlideSpectrum.META = {
  id: 'spectrum', title: '风险光谱',
  defaults: { segmentCount: 5, markerPos: 62, showMarker: true, showScale: true, showEnds: true },
  controls: [
    { key: 'segmentCount', type: 'slider', label: '光谱段数', default: 5, min: 3, max: 6, step: 1,
      description: '风险光谱划分的区段数量。' },
    { key: 'markerPos', type: 'slider', label: '标记位置', default: 62, min: 0, max: 100, step: 1, unit: '%',
      description: '标记沿光谱的位置（0 最保守，100 最进取）。' },
    { key: 'showMarker', type: 'toggle', label: '定位标记', default: true,
      description: '光谱上的标记指针与上方读数。' },
    { key: 'showScale', type: 'toggle', label: '数值刻度', default: true,
      description: '光谱下方的 0–100 刻度。' },
    { key: 'showEnds', type: 'toggle', label: '两端锚点', default: true,
      description: '光谱两端的高低取向说明。' },
  ],
};

export { SlideSpectrum };
export const META = SlideSpectrum.META;
export default SlideSpectrum;
