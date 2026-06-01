import React from 'react';
import { Mascot, Style1Slide } from './primitives.jsx';

const cast = [
  ['01', 'cloud', 'cyan', '青云', 'Cloudy', '#4DBFFF'],
  ['02', 'heart', 'pink', '小心心', 'Heartie', '#FF3DC0'],
  ['03', 'flower', 'lime', '花生', 'Bloomy', '#7AE040'],
  ['04', 'drop', 'orange', '橘滴', 'Droppy', '#FF8B3D'],
  ['05', 'star', 'purple', '紫闪', 'Starly', '#A87FFF'],
];

export function Style1_05Cast() {
  return (
    <Style1Slide layout="ST1-05" tone="dark" className="st1-cast">
      <div className="st1-cast-head">
        <div><div className="st1-eyebrow">Section 05 · The Cast</div><h2>五位<span>Color</span>主角，<br />各有各的脾气。</h2></div>
        <div className="st1-meta">Jelly Lab<br />Mascot Family<br />2026 / V.04</div>
      </div>
      <div className="st1-lineup">
        {cast.map(([num, kind, color, cn, en, hex]) => (
          <div className="st1-cast-card" key={num}>
            <div className="stage"><span>{num}</span><Mascot kind={kind} slotId={`st1-cast-${num}`} className={color} /></div>
            <div className="cn">{cn}</div><div className="en">{en}</div><div className="hex">{hex}</div>
          </div>
        ))}
      </div>
      <div className="st1-footer-row"><span>果冻研究所 / Jelly Lab · 2026</span><span>Section 05 · Mascot Family</span></div>
    </Style1Slide>
  );
}
