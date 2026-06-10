// DeckPrimitives.jsx — shared building blocks reused across slides.
// Self-contained: depends only on React (imported). CSS scoped under dh-/dbar-/ddon-.
// Exports: DECK_THEMES, DeckHead, DeckBars, DeckDonut.

// Shared themed background gradients (mirrors the cover's moods).
import React from 'react';

const DECK_THEMES = {
  dusk:     { bg: 'linear-gradient(158deg,#0a0d11 0%,#141f2a 26%,#33434e 52%,#857f76 78%,#cdb6a0 100%)', fg: '#f4f4f2', sub: 'rgba(244,244,242,.72)', foot: 'rgba(22,18,14,.6)' },
  midnight: { bg: 'radial-gradient(120% 85% at 72% 8%,#1c2533 0%,#0d1016 52%,#07080b 100%)', fg: '#f2f3f6', sub: 'rgba(242,243,246,.62)', foot: 'rgba(242,243,246,.42)' },
  graphite: { bg: 'linear-gradient(165deg,#191b1f 0%,#3b3f45 48%,#9a9b9a 82%,#cdcecb 100%)', fg: '#f3f4f4', sub: 'rgba(243,244,244,.68)', foot: 'rgba(20,20,22,.52)' },
  dawn:     { bg: 'linear-gradient(160deg,#161320 0%,#473846 38%,#9c6f5e 72%,#dcb595 100%)', fg: '#f7f2ec', sub: 'rgba(247,242,236,.74)', foot: 'rgba(28,18,14,.58)' },
  paper:    { bg: '#f1f0ec', fg: '#15161a', sub: 'rgba(21,22,26,.62)', foot: 'rgba(21,22,26,.5)' },
  vapor:    { bg: 'linear-gradient(180deg,#0a0e14 0%,#1c2531 32%,#3a4450 58%,#8a8c90 82%,#cdccc8 100%)', fg: '#f3f4f6', sub: 'rgba(243,244,246,.78)', foot: 'rgba(20,20,22,.5)' },
};

// Slide header: overline + title (+ optional caption). Keeps headers parallel
// across every content slide.
function DeckHead({ overline, title, caption }) {
  React.useEffect(() => { dpInjectStyle(); }, []);
  return (
    <div className="dh">
      {overline && <div className="dh-overline">{overline}</div>}
      {title && <h2 className="dh-title">{title}</h2>}
      {caption && <p className="dh-caption">{caption}</p>}
    </div>
  );
}

// Horizontal bar list. data: [{label, value}]. focusIndex -1 = none.
function DeckBars({ data = [], focusIndex = -1, showValues = true, unit = '', accent = 'var(--ds-accent,#6f9bd8)' }) {
  React.useEffect(() => { dpInjectStyle(); }, []);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="dbar">
      {data.map((d, i) => {
        const hot = focusIndex === i;
        const dim = focusIndex >= 0 && !hot;
        return (
          <div className={`dbar-row ${dim ? 'is-dim' : ''}`} key={i}>
            <span className="dbar-label">{d.label}</span>
            <span className="dbar-track">
              <span className="dbar-fill" style={{ width: `${(d.value / max) * 100}%`,
                background: hot ? accent : 'currentColor', opacity: hot ? 1 : 0.34 }} />
            </span>
            {showValues && <span className="dbar-value" style={{ color: hot ? accent : undefined }}>{d.value}{unit}</span>}
          </div>
        );
      })}
    </div>
  );
}

// Donut chart. segments: [{label, value}]. focusIndex -1 = shade ramp.
function DeckDonut({ segments = [], focusIndex = -1, size = 340, centerLabel = '', accent = 'var(--ds-accent,#6f9bd8)' }) {
  React.useEffect(() => { dpInjectStyle(); }, []);
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const R = 132, SW = 42, C = 2 * Math.PI * R;
  const ramp = [0.92, 0.64, 0.46, 0.32, 0.22, 0.14];
  let off = 0;
  return (
    <div className="ddon" style={{ width: size, height: size }}>
      <svg viewBox="0 0 320 320" width={size} height={size}>
        <g transform="rotate(-90 160 160)">
          {segments.map((s, i) => {
            const len = (s.value / total) * C;
            const hot = focusIndex === i;
            const stroke = focusIndex >= 0 && hot ? accent : 'currentColor';
            const strokeOpacity = focusIndex >= 0 ? (hot ? 1 : 0.15) : ramp[i % ramp.length];
            const el = (
              <circle key={i} cx="160" cy="160" r={R} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={SW}
                      strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-off} />
            );
            off += len;
            return el;
          })}
        </g>
        {centerLabel && <text x="160" y="160" className="ddon-center" textAnchor="middle" dominantBaseline="central">{centerLabel}</text>}
      </svg>
    </div>
  );
}

function dpInjectStyle() {
  if (document.getElementById('dp-style')) return;
  const s = document.createElement('style');
  s.id = 'dp-style';
  s.textContent = `
  .dh{margin-bottom:56px;}
  .dh-overline{font-family:var(--font-mono,monospace);font-size:26px;letter-spacing:.16em;
    color:var(--ds-faint,rgba(242,243,246,.42));}
  .dh-title{font-size:68px;font-weight:300;line-height:1.12;margin:18px 0 0;letter-spacing:.01em;}
  .dh-caption{font-family:var(--font-mono,monospace);font-size:24px;letter-spacing:.05em;
    color:var(--ds-muted,rgba(242,243,246,.55));margin:20px 0 0;}

  .dbar{display:flex;flex-direction:column;gap:34px;}
  .dbar-row{display:flex;align-items:center;gap:34px;transition:opacity .25s ease;}
  .dbar-row.is-dim{opacity:.4;}
  .dbar-label{flex:0 0 300px;font-size:30px;font-weight:300;}
  .dbar-track{flex:1;height:16px;border-radius:8px;background:rgba(128,128,128,.2);overflow:hidden;}
  .dbar-fill{display:block;height:100%;border-radius:8px;transition:width .4s cubic-bezier(.3,.7,.4,1),background .25s;}
  .dbar-value{flex:0 0 auto;min-width:120px;text-align:right;font-family:var(--font-mono,monospace);
    font-size:30px;font-variant-numeric:tabular-nums;color:var(--ds-muted,rgba(242,243,246,.62));}

  .ddon{position:relative;flex:0 0 auto;}
  .ddon-center{fill:var(--ds-faint,rgba(242,243,246,.5));font-family:var(--font-mono,monospace);
    font-size:26px;letter-spacing:.1em;}
  `;
  document.head.appendChild(s);
}

export { DECK_THEMES, DeckHead, DeckBars, DeckDonut };
