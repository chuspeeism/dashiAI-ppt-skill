import React from 'react';

export function RelationMap({ title, points, relations }) {
  const byId = new Map(points.map((point) => [point.id, point]));

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(18deg,transparent 0 44%,rgba(var(--ink-rgb),.11) 44% 44.2%,transparent 44.2%),linear-gradient(-8deg,transparent 0 54%,rgba(var(--ink-rgb),.09) 54% 54.16%,transparent 54.16%),linear-gradient(0deg,transparent 0 61%,rgba(var(--ink-rgb),.08) 61% 61.15%,transparent 61.15%),var(--grey-1)' }}>
      <div style={{ position: 'absolute', top: '1.4vh', left: '1.2vw', zIndex: 2, background: 'rgba(var(--paper-rgb),.92)', padding: '1.2vh 1vw', maxWidth: '28vw' }}>
        <div className="t-meta">RELATION MAP</div>
        <div className="t-h-prod" style={{ marginTop: '.4vh' }}>{title}</div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {relations.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--focus-mark)" strokeWidth=".24" strokeDasharray="1.4 1.2" opacity=".68" />;
        })}
      </svg>
      {points.map((point) => (
        <div key={point.id} style={{ position: 'absolute', left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%,-50%)' }}>
          <span style={{ position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: point.accent ? 'var(--focus-mark)' : 'var(--ink)', border: '2px solid var(--paper)' }} />
          <span style={{ position: 'absolute', left: 7, top: 0, width: 24, height: 1, background: point.accent ? 'var(--focus-mark)' : 'var(--ink)', opacity: point.accent ? .75 : .45 }} />
          <span style={{ position: 'absolute', left: 31, top: -18, minWidth: 76, background: 'rgba(var(--paper-rgb),.9)', padding: '6px 7px', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'block', fontFamily: 'var(--sans),var(--sans-zh)', fontSize: 'var(--fs-caption)', lineHeight: 1.05, color: point.accent ? 'var(--focus-mark)' : 'var(--ink)' }}>{point.name}</span>
            <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: 'calc(var(--fs-caption) * .75)', lineHeight: 1, letterSpacing: '.12em', color: 'var(--text-helper)', marginTop: 4, textTransform: 'uppercase' }}>{point.meta}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
