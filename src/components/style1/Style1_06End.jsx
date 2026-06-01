import React from 'react';
import { ShaderBackdrop } from '../blacktech/primitives.jsx';
import { Mascot, Style1Slide, Wordmark } from './primitives.jsx';

export function Style1_06End() {
  return (
    <Style1Slide layout="ST1-06" tone="dark" className="st1-end st1-shader-slide">
      <ShaderBackdrop variant="gooeyBalls" />
      <div className="st1-end-content">
        <div className="st1-top-row">
          <Wordmark />
          <div className="st1-meta">End · Vol. 04<br />MMXXVI</div>
        </div>
        <div className="st1-center">
          <div className="st1-eyebrow">THANK YOU · 谢谢观看</div>
          <h1>下一年，<br />什么<span>Color</span>？</h1>
          <div className="st1-sub">把心情，调成一种颜色。</div>
        </div>
        <div className="st1-bottom-row">
          <div className="st1-contact">
            <div><div className="k">Web</div><div className="v">jellylab.studio</div></div>
            <div><div className="k">合作 / Hello</div><div className="v">hi@jellylab.studio</div></div>
            <div><div className="k">出品</div><div className="v">果冻研究所</div></div>
          </div>
          <div className="st1-character-row small">
            <Mascot kind="cloud" slotId="st1-end-cloud" className="ink" /><Mascot kind="flower" slotId="st1-end-flower" className="lime" /><Mascot kind="drop" slotId="st1-end-drop" className="orange" /><Mascot kind="star" slotId="st1-end-star" className="purple" />
          </div>
        </div>
      </div>
    </Style1Slide>
  );
}
