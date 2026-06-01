import React from 'react';
import { BlackTechSlide, CaptionBlock, Lines, ShaderBackdrop } from './primitives.jsx';

export function BT07Warp({
  chrome = { left: '06 · FULL-BLEED SHADER', right: 'PAGE 07/12', bottomLeft: 'BACKDROP COMPONENT', bottomRight: '◦ SWAPPABLE' },
  shader = 'movingInto',
  eyebrow = '06',
  accent = '年度转场',
  titleTop = '年度复盘',
  titleAlt = '不是结尾',
  titleBottom = '而是下一轮起点。',
  body = ['这一页用于承接从年度结果到下一年规划的章节转换。', '背景组件可以替换，文字层保持同一套 Token。', '适合放年度关键词或阶段性判断。'],
  captions = [
    ['Layer A', '年度情绪'],
    ['Layer B', '遮罩'],
    ['Layer C', '章节标题'],
  ],
}) {
  return (
    <BlackTechSlide
      layout="BT07"
      chrome={chrome}
      className="bt-warp-slide"
    >
      <ShaderBackdrop variant={shader} />
      <div className="bt-warp-overlay" />
      <div className="bt-warp-title">
        <div className="bt-eyebrow">{eyebrow} · <span className="bt-accent">{accent}</span></div>
        <div className="bt-display">
          {titleTop}<br /><span className="bt-title-alt">{titleAlt}</span><br />{titleBottom}
        </div>
      </div>
      <div className="bt-warp-bottom">
        <div className="bt-body">
          <Lines lines={body} />
        </div>
        <div className="bt-caption-row">
          {captions.map(([label, value]) => <CaptionBlock key={label} label={label} value={value} />)}
        </div>
      </div>
    </BlackTechSlide>
  );
}
