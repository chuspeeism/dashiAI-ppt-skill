import React from 'react';
import { ShaderBackdrop } from '../blacktech/primitives.jsx';
import { CornerMeta, Style2Slide } from './primitives.jsx';

export function Style2_05Visual() {
  return (
    <Style2Slide layout="ST2-05" className="st2-visual">
      <CornerMeta pos="tl">05 — 章節　CHAPTER</CornerMeta>
      <CornerMeta pos="tr">PLATE V</CornerMeta>
      <div className="st2-vstack">
        <div className="st2-kicker">— PART V —</div>
        <div className="st2-vert">夜　行</div>
        <div className="st2-vlead">關於<em>夜晚</em>的影像愈來愈多，<br />而真正能在夜裡<em>被看見</em>的人，<br />卻愈來愈少。</div>
        <div className="st2-by">章節作者　LIN, J. — 撰文 / 王知衡 — 攝影</div>
      </div>
      <div className="st2-canvas st2-shader-canvas"><ShaderBackdrop variant="automations" /></div>
      <CornerMeta pos="bl">P. 028 / 048</CornerMeta>
      <CornerMeta pos="br">章節之五</CornerMeta>
    </Style2Slide>
  );
}
