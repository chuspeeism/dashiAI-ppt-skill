import React from 'react';
import { Style1Slide } from './primitives.jsx';

const chips = [
  ['果冻', 'pink'], ['JELLY', 'cyan en dark'], ['Jelly', 'lime italic dark'], ['果冻', 'orange'],
  ['JELLY', 'purple en'], ['果冻 · Jelly', 'paper wide dark'], ['Jelly', 'pink italic'],
  ['Jelly', 'cyan italic dark'], ['果冻', 'purple'], ['JELLY', 'orange en dark'], ['果冻', 'lime dark'],
];

export function Style1_04Brand() {
  return (
    <Style1Slide layout="ST1-04" tone="dark" className="st1-brand">
      <div className="st1-data-head">
        <h2>同一个名字，<br />五种<span>Mood</span>。</h2>
        <div className="st1-meta">Section 04<br />Brand · Application<br />Mood Matrix</div>
      </div>
      <div className="st1-chip-grid">
        {chips.map(([label, className], index) => <div className={`st1-chip ${className}`} key={`${label}-${index}`}>{label}</div>)}
      </div>
      <div className="st1-footer-row"><span>果冻研究所 / Jelly Lab · 2026</span><span>Section 04 · Brand Application</span></div>
    </Style1Slide>
  );
}
