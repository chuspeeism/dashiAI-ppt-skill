import React from 'react';
import { ShaderBackdrop } from '../blacktech/primitives.jsx';
import { Mascot, Style1Slide, Wordmark } from './primitives.jsx';

export function Style1_01Cover() {
  return (
    <Style1Slide layout="ST1-01" tone="dark" className="st1-cover st1-shader-slide">
      <ShaderBackdrop variant="movingInto" />
      <div className="st1-cover-content">
        <div className="st1-top-row">
          <Wordmark />
          <div className="st1-meta">Vol. 04 · MMXXVI<br />Jelly Lab Report</div>
        </div>
        <div className="st1-center">
          <div className="st1-eyebrow">2026 · COLOR TREND REPORT</div>
          <h1>潮流<span>Color</span>报告</h1>
          <div className="st1-sub">五种颜色，五种心情。</div>
        </div>
        <div className="st1-bottom-row">
          <div className="st1-left-meta"><span>果冻研究所 出品</span><span>·</span><span>Issue 04</span></div>
          <div className="st1-character-row">
            <Mascot kind="cloud" slotId="st1-cover-cloud" className="cyan" />
            <Mascot kind="drop" slotId="st1-cover-drop" className="orange" />
            <Mascot kind="flower" slotId="st1-cover-flower" className="lime" />
            <Mascot kind="heart" slotId="st1-cover-heart" className="purple" />
            <Mascot kind="star" slotId="st1-cover-star" className="ink" />
          </div>
        </div>
      </div>
    </Style1Slide>
  );
}
