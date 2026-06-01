import React from 'react';
import { GridBg, Mascot, Style1Slide, Wordmark } from './primitives.jsx';

export function Style1_03Naming() {
  return (
    <Style1Slide layout="ST1-03" className="st1-type">
      <GridBg />
      <div className="st1-type-head">
        <Wordmark />
        <div className="st1-meta">Section 03<br />Color · Naming<br />Manifesto</div>
      </div>
      <div className="st1-type-body">
        <div className="st1-names">
          <div className="r1">电光<span>Cyan</span><Mascot kind="cloud" slotId="st1-name-cloud" className="cyan inline" /></div>
          <div className="r2">果冻粉</div>
          <div className="r3"><Mascot kind="flower" slotId="st1-name-flower" className="lime inline" />草坪绿</div>
          <div className="r4">落日<span>Orange</span></div>
          <div className="r5">葡萄紫<Mascot kind="star" slotId="st1-name-star" className="purple inline" /></div>
        </div>
        <div className="st1-right-col">
          <div className="st1-quote">颜色不是装饰，<br />颜色是<span>情绪</span>的形状。<br />每一年，我们都在<br />重新发明心情的<span>名字</span>。</div>
          <div className="st1-meta-grid">
            {[
              ['类型 · TYPE', '情绪驱动'],
              ['数量 · COUNT', '5 个主色'],
              ['饱和度 · CHROMA', '高 · 0.20+'],
              ['建议场景', '品牌、海报、UI'],
            ].map(([k, v]) => <div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>)}
          </div>
          <div className="st1-signature"><span>编辑 · CURATED BY</span>Jelly Lab, 2026</div>
        </div>
      </div>
    </Style1Slide>
  );
}
